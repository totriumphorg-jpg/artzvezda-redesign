import "dotenv/config";
import express from "express";
import { createServer } from "http";
import net from "net";
import cookieParser from "cookie-parser";
import crypto from "crypto";
import { createExpressMiddleware } from "@trpc/server/adapters/express";
import { registerOAuthRoutes } from "./oauth";
import { registerStorageProxy } from "./storageProxy";
import { appRouter } from "../routers";
import { createContext } from "./context";
import { serveStatic, setupVite } from "./vite";
import {
  getDbCompetition,
  saveDbCompetition,
  getDbApplications,
  createDbApplication,
  updateDbApplicationStatus,
} from "../dbStore";
import { applicationsToCsv } from "../export";

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "artzvezda2026";
const ADMIN_COOKIE = "artzvezda_admin_token";
const ADMIN_SECRET = process.env.ADMIN_SESSION_SECRET || "art-secret-session-key";

function makeSessionToken() {
  return crypto.createHmac("sha256", ADMIN_SECRET).update(`admin-${new Date().toDateString()}`).digest("hex");
}

function checkAdminAuth(req: express.Request, res: express.Response, next: express.NextFunction) {
  const token = req.cookies?.[ADMIN_COOKIE];
  const expected = makeSessionToken();
  if (token && token === expected) {
    return next();
  }
  return res.status(401).json({ error: "Unauthorized" });
}

function isPortAvailable(port: number): Promise<boolean> {
  return new Promise(resolve => {
    const server = net.createServer();
    server.listen(port, () => {
      server.close(() => resolve(true));
    });
    server.on("error", () => resolve(false));
  });
}

async function findAvailablePort(startPort: number = 3000): Promise<number> {
  for (let port = startPort; port < startPort + 20; port++) {
    if (await isPortAvailable(port)) {
      return port;
    }
  }
  throw new Error(`No available port found starting from ${startPort}`);
}

async function startServer() {
  const app = express();
  const server = createServer(app);
  // Configure body parser with larger size limit for file uploads
  app.use(express.json({ limit: "50mb" }));
  app.use(express.urlencoded({ limit: "50mb", extended: true }));
  app.use(cookieParser());

  // Public Competition API
  app.get("/api/competition", async (_req, res) => {
    try {
      const data = await getDbCompetition();
      res.json({
        ...data,
        paykeeper: {
          enabled: data.paykeeper?.enabled,
          serverUrl: data.paykeeper?.serverUrl ? "configured" : "",
          serviceName: data.paykeeper?.serviceName,
        },
      });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // Public Applications Submission
  app.post("/api/applications", async (req, res) => {
    try {
      const {
        participantName,
        peopleCount,
        genre,
        ageCategory,
        nomination,
        email,
        phone,
        institutionName,
        institutionAddress,
        directorName,
        performanceTitle,
        collectiveInfo,
        videoLink1,
        videoLink2,
      } = req.body;

      if (!participantName || !email || !phone || !genre || !nomination) {
        return res.status(400).json({ error: "Заполните обязательные поля заявки" });
      }

      const comp = await getDbCompetition();
      const amount = comp.priceDiscount || comp.priceRegular || 1300;

      const appRecord = await createDbApplication({
        participantName: String(participantName).trim(),
        peopleCount: String(peopleCount || "1").trim(),
        genre: String(genre).trim(),
        ageCategory: String(ageCategory || "").trim(),
        nomination: String(nomination).trim(),
        email: String(email).trim(),
        phone: String(phone).trim(),
        institutionName: String(institutionName || "").trim(),
        institutionAddress: String(institutionAddress || "").trim(),
        directorName: String(directorName || "").trim(),
        performanceTitle: String(performanceTitle || "").trim(),
        collectiveInfo: String(collectiveInfo || "").trim(),
        videoLink1: String(videoLink1 || "").trim(),
        videoLink2: String(videoLink2 || "").trim(),
        paymentAmount: amount,
      });

      let paymentUrl = `/payment-success?paymentId=${appRecord.paymentId}`;
      if (comp.paykeeper?.enabled && comp.paykeeper?.serverUrl) {
        const cleanServer = comp.paykeeper.serverUrl.replace(/\/+$/, "");
        paymentUrl = `${cleanServer}/create/?sum=${encodeURIComponent(
          amount
        )}&orderid=${encodeURIComponent(appRecord.paymentId)}&clientid=${encodeURIComponent(
          appRecord.participantName
        )}&email=${encodeURIComponent(appRecord.email)}&phone=${encodeURIComponent(
          appRecord.phone
        )}&service_name=${encodeURIComponent(comp.paykeeper.serviceName || "Оплата взноса ART Звезда")}`;
      }

      res.status(201).json({
        success: true,
        applicationId: appRecord.id,
        paymentId: appRecord.paymentId,
        paymentUrl,
        amount,
      });
    } catch (err: any) {
      res.status(500).json({ error: err.message || "Не удалось сохранить заявку" });
    }
  });

  // PayKeeper POST callback
  app.post("/api/paykeeper/callback", async (req, res) => {
    try {
      const { id, sum, clientid, orderid, key, service_name } = req.body;
      const comp = await getDbCompetition();

      if (comp.paykeeper?.secretKey) {
        const checkHash = crypto
          .createHash("md5")
          .update(`${id}${sum}${clientid}${orderid}${comp.paykeeper.secretKey}`)
          .digest("hex");

        if (checkHash !== key) {
          return res.status(400).send("Signature verification failed");
        }
      }

      await updateDbApplicationStatus(orderid, "paid", {
        paykeeperPaymentId: id,
        receivedSum: sum,
        serviceName: service_name,
        receivedAt: new Date().toISOString(),
      });

      const responseHash = crypto
        .createHash("md5")
        .update(`${id}${comp.paykeeper?.secretKey || ""}`)
        .digest("hex");
      return res.send(`OK ${responseHash}`);
    } catch (err: any) {
      return res.status(500).send(err.message || "Callback failed");
    }
  });

  // Admin Auth
  app.post("/api/admin/login", (req, res) => {
    const { password } = req.body;
    if (password === ADMIN_PASSWORD) {
      const token = makeSessionToken();
      res.cookie(ADMIN_COOKIE, token, {
        httpOnly: true,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
        maxAge: 7 * 24 * 3600 * 1000,
      });
      return res.json({ success: true });
    }
    return res.status(401).json({ error: "Неверный пароль администратора" });
  });

  app.get("/api/admin/check", (req, res) => {
    const token = req.cookies?.[ADMIN_COOKIE];
    res.json({ authenticated: token === makeSessionToken() });
  });

  app.post("/api/admin/logout", (_req, res) => {
    res.clearCookie(ADMIN_COOKIE);
    res.json({ success: true });
  });

  // Admin Endpoints
  app.get("/api/admin/competition", checkAdminAuth, async (_req, res) => {
    const comp = await getDbCompetition();
    res.json(comp);
  });

  app.put("/api/admin/competition", checkAdminAuth, async (req, res) => {
    try {
      const updated = await saveDbCompetition(req.body);
      res.json({ success: true, data: updated });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.get("/api/admin/applications", checkAdminAuth, async (req, res) => {
    const apps = await getDbApplications();
    const genre = req.query.genre ? String(req.query.genre) : null;
    const filtered = genre ? apps.filter((a) => a.genre === genre) : apps;
    res.json(filtered);
  });

  app.get("/api/admin/applications/export.csv", checkAdminAuth, async (req, res) => {
    const apps = await getDbApplications();
    const genre = req.query.genre ? String(req.query.genre) : null;
    const filtered = genre ? apps.filter((a) => a.genre === genre) : apps;
    const csv = applicationsToCsv(filtered);
    res.setHeader("Content-Type", "text/csv; charset=utf-8");
    res.setHeader("Content-Disposition", `attachment; filename="artzvezda-applications-${Date.now()}.csv"`);
    res.send(csv);
  });

  app.patch("/api/admin/applications/:id/status", checkAdminAuth, async (req, res) => {
    const id = parseInt(req.params.id, 10);
    const { status } = req.body;
    await updateDbApplicationStatus(id, status);
    res.json({ success: true });
  });

  registerStorageProxy(app);
  registerOAuthRoutes(app);
  // tRPC API
  app.use(
    "/api/trpc",
    createExpressMiddleware({
      router: appRouter,
      createContext,
    })
  );
  // development mode uses Vite, production mode uses static files
  if (process.env.NODE_ENV === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  const preferredPort = parseInt(process.env.PORT || "3000");
  const port = await findAvailablePort(preferredPort);

  if (port !== preferredPort) {
    console.log(`Port ${preferredPort} is busy, using port ${port} instead`);
  }

  server.listen(port, () => {
    console.log(`Server running on http://localhost:${port}/`);
  });
}

startServer().catch(console.error);
