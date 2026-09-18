import { eq, desc } from "drizzle-orm";
import { getDb } from "./db";
import { competitions, applications, Competition, Application } from "../drizzle/schema";
import { defaultCompetition } from "./store";

export async function getDbCompetition(): Promise<any> {
  const db = await getDb();
  if (!db) return defaultCompetition;

  try {
    const rows = await db.select().from(competitions).where(eq(competitions.id, "autumn-in-london-2026")).limit(1);
    if (rows.length > 0) {
      const c = rows[0];
      return {
        id: c.id,
        code: c.code,
        title: c.title,
        subtitle: c.subtitle,
        seasonBadge: c.seasonBadge,
        startDate: c.startDate,
        endDate: c.endDate,
        priceRegular: c.priceRegular,
        priceDiscount: c.priceDiscount,
        priceReduced: c.priceReduced,
        bannerUrl: c.bannerUrl,
        leadParagraph: c.leadParagraph,
        aboutText: c.aboutText,
        noticeText: c.noticeText,
        rulesSections: c.rulesSections || defaultCompetition.rulesSections,
        faqs: c.faqs || defaultCompetition.faqs,
        results: c.results || defaultCompetition.results,
        paykeeper: c.paykeeperConfig || defaultCompetition.paykeeper,
        updatedAt: c.updatedAt.toISOString(),
      };
    }

    // Seed default
    await db.insert(competitions).values({
      id: defaultCompetition.id,
      code: defaultCompetition.code,
      title: defaultCompetition.title,
      subtitle: defaultCompetition.subtitle,
      seasonBadge: defaultCompetition.seasonBadge,
      startDate: defaultCompetition.startDate,
      endDate: defaultCompetition.endDate,
      priceRegular: defaultCompetition.priceRegular,
      priceDiscount: defaultCompetition.priceDiscount,
      priceReduced: defaultCompetition.priceReduced,
      bannerUrl: defaultCompetition.bannerUrl,
      leadParagraph: defaultCompetition.leadParagraph,
      aboutText: defaultCompetition.aboutText,
      noticeText: defaultCompetition.noticeText,
      rulesSections: defaultCompetition.rulesSections,
      faqs: defaultCompetition.faqs,
      results: defaultCompetition.results,
      paykeeperConfig: defaultCompetition.paykeeper,
    });
    return defaultCompetition;
  } catch (err) {
    console.warn("DB competition fetch error, using memory default:", err);
    return defaultCompetition;
  }
}

export async function saveDbCompetition(content: any): Promise<any> {
  const db = await getDb();
  if (!db) return content;

  try {
    await db
      .insert(competitions)
      .values({
        id: "autumn-in-london-2026",
        code: content.code || defaultCompetition.code,
        title: content.title || defaultCompetition.title,
        subtitle: content.subtitle || defaultCompetition.subtitle,
        seasonBadge: content.seasonBadge || defaultCompetition.seasonBadge,
        startDate: content.startDate || defaultCompetition.startDate,
        endDate: content.endDate || defaultCompetition.endDate,
        priceRegular: content.priceRegular || defaultCompetition.priceRegular,
        priceDiscount: content.priceDiscount || defaultCompetition.priceDiscount,
        priceReduced: content.priceReduced || defaultCompetition.priceReduced,
        bannerUrl: content.bannerUrl || defaultCompetition.bannerUrl,
        leadParagraph: content.leadParagraph || defaultCompetition.leadParagraph,
        aboutText: content.aboutText || defaultCompetition.aboutText,
        noticeText: content.noticeText || defaultCompetition.noticeText,
        rulesSections: content.rulesSections || defaultCompetition.rulesSections,
        faqs: content.faqs || defaultCompetition.faqs,
        results: content.results || defaultCompetition.results,
        paykeeperConfig: content.paykeeper || defaultCompetition.paykeeper,
      })
      .onDuplicateKeyUpdate({
        set: {
          title: content.title,
          seasonBadge: content.seasonBadge,
          startDate: content.startDate,
          endDate: content.endDate,
          priceRegular: content.priceRegular,
          priceDiscount: content.priceDiscount,
          priceReduced: content.priceReduced,
          bannerUrl: content.bannerUrl,
          aboutText: content.aboutText,
          noticeText: content.noticeText,
          rulesSections: content.rulesSections,
          faqs: content.faqs,
          results: content.results,
          paykeeperConfig: content.paykeeper,
        },
      });
    return getDbCompetition();
  } catch (err) {
    console.error("Failed to save competition into database:", err);
    throw err;
  }
}

export async function getDbApplications(): Promise<any[]> {
  const db = await getDb();
  if (!db) return [];

  try {
    const list = await db.select().from(applications).orderBy(desc(applications.id));
    return list.map((a) => ({
      id: a.id,
      paymentId: a.paymentId,
      participantName: a.participantName,
      peopleCount: a.peopleCount,
      genre: a.genre,
      ageCategory: a.ageCategory,
      nomination: a.nomination,
      email: a.email,
      phone: a.phone,
      institutionName: a.institutionName,
      institutionAddress: a.institutionAddress,
      directorName: a.directorName,
      performanceTitle: a.performanceTitle,
      collectiveInfo: a.collectiveInfo,
      videoLink1: a.videoLink1,
      videoLink2: a.videoLink2,
      paymentAmount: a.amount,
      status: a.status,
      paidAt: a.paidAt?.toISOString(),
      paymentDetails: a.paymentDetails,
      createdAt: a.createdAt.toISOString(),
      updatedAt: a.updatedAt.toISOString(),
    }));
  } catch (err) {
    console.warn("Applications fetch error:", err);
    return [];
  }
}

export async function createDbApplication(input: any): Promise<any> {
  const db = await getDb();
  if (!db) throw new Error("Database not connected");

  const paymentId = `${Date.now().toString().slice(-6)}`;
  const values = {
    competitionId: "autumn-in-london-2026",
    paymentId,
    participantName: input.participantName,
    peopleCount: input.peopleCount || "1",
    genre: input.genre,
    ageCategory: input.ageCategory || "",
    nomination: input.nomination,
    email: input.email,
    phone: input.phone,
    institutionName: input.institutionName || "",
    institutionAddress: input.institutionAddress || "",
    directorName: input.directorName || "",
    performanceTitle: input.performanceTitle || "",
    collectiveInfo: input.collectiveInfo || "",
    videoLink1: input.videoLink1,
    videoLink2: input.videoLink2 || "",
    amount: input.paymentAmount,
    status: "pending_payment" as const,
  };

  const [res] = await db.insert(applications).values(values);
  return {
    id: (res as any).insertId || Number(paymentId),
    ...values,
    createdAt: new Date().toISOString(),
  };
}

export async function updateDbApplicationStatus(paymentIdOrId: string | number, status: any, details?: any): Promise<any> {
  const db = await getDb();
  if (!db) return null;

  try {
    const isNum = typeof paymentIdOrId === "number";
    const condition = isNum ? eq(applications.id, paymentIdOrId as number) : eq(applications.paymentId, String(paymentIdOrId));
    
    await db
      .update(applications)
      .set({
        status,
        paymentDetails: details,
        paidAt: status === "paid" ? new Date() : undefined,
      })
      .where(condition);
    return true;
  } catch (err) {
    console.error("Failed to update application status:", err);
    return null;
  }
}
