import fs from "fs";
import path from "path";
import crypto from "crypto";

export interface CompetitionContent {
  id: string;
  code: string;
  title: string;
  subtitle: string;
  seasonBadge: string;
  startDate: string;
  endDate: string;
  priceRegular: number;
  priceDiscount: number;
  discountUntil: string;
  priceReduced: number;
  bannerUrl: string;
  leadParagraph: string;
  aboutText: string;
  noticeText: string;
  packageDetails: string[];
  rulesSections: { id: string; title: string; content: string }[];
  faqs: { question: string; answer: string }[];
  results: {
    title: string;
    description: string;
    publishedDate: string;
    protocolUrl?: string;
    vkUrl?: string;
  }[];
  paykeeper: {
    enabled: boolean;
    serverUrl: string;
    secretKey: string;
    serviceName: string;
  };
  updatedAt: string;
}

export interface ContestApplication {
  id: number;
  paymentId: string;
  participantName: string;
  peopleCount: string;
  genre: string;
  ageCategory: string;
  nomination: string;
  email: string;
  phone: string;
  institutionName: string;
  institutionAddress: string;
  directorName: string;
  performanceTitle: string;
  collectiveInfo: string;
  videoLink1: string;
  videoLink2: string;
  agreedToPolicy: boolean;
  status: "pending_payment" | "paid" | "accepted" | "rejected";
  paymentAmount: number;
  paidAt?: string;
  paymentMethod?: string;
  paymentDetails?: Record<string, any>;
  createdAt: string;
  updatedAt: string;
}

const DATA_DIR = path.resolve(process.cwd(), "server/data");
const CONTENT_FILE = path.join(DATA_DIR, "competition.json");
const APPLICATIONS_FILE = path.join(DATA_DIR, "applications.json");

function ensureDirectory() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
}

export const defaultCompetition: CompetitionContent = JSON.parse(
  fs.readFileSync(path.join(process.cwd(), "server/data/competition.json"), "utf-8")
) as CompetitionContent;

export function getCompetitionContent(): CompetitionContent {
  ensureDirectory();
  if (!fs.existsSync(CONTENT_FILE)) {
    fs.writeFileSync(CONTENT_FILE, JSON.stringify(defaultCompetition, null, 2), "utf-8");
    return defaultCompetition;
  }
  try {
    const raw = fs.readFileSync(CONTENT_FILE, "utf-8");
    return { ...defaultCompetition, ...JSON.parse(raw) };
  } catch {
    return defaultCompetition;
  }
}

export function saveCompetitionContent(content: Partial<CompetitionContent>): CompetitionContent {
  ensureDirectory();
  let current = defaultCompetition;
  if (fs.existsSync(CONTENT_FILE)) {
    try {
      current = JSON.parse(fs.readFileSync(CONTENT_FILE, "utf-8"));
    } catch {}
  }
  const merged: CompetitionContent = {
    ...current,
    ...content,
    updatedAt: new Date().toISOString(),
  };
  fs.writeFileSync(CONTENT_FILE, JSON.stringify(merged, null, 2), "utf-8");
  return merged;
}

export function getApplications(): ContestApplication[] {
  ensureDirectory();
  if (!fs.existsSync(APPLICATIONS_FILE)) {
    fs.writeFileSync(APPLICATIONS_FILE, "[]", "utf-8");
    return [];
  }
  try {
    return JSON.parse(fs.readFileSync(APPLICATIONS_FILE, "utf-8"));
  } catch {
    return [];
  }
}

export function saveApplications(apps: ContestApplication[]): void {
  ensureDirectory();
  fs.writeFileSync(APPLICATIONS_FILE, JSON.stringify(apps, null, 2), "utf-8");
}

export function createApplication(input: Omit<ContestApplication, "id" | "paymentId" | "status" | "createdAt" | "updatedAt">): ContestApplication {
  const apps = getApplications();
  const nextId = apps.length > 0 ? Math.max(...apps.map((a) => a.id)) + 1 : 59320;
  const paymentId = `${nextId}`;
  const now = new Date().toISOString();
  const app: ContestApplication = {
    ...input,
    id: nextId,
    paymentId,
    status: "pending_payment",
    createdAt: now,
    updatedAt: now,
  };
  apps.unshift(app);
  saveApplications(apps);
  return app;
}

export function updateApplicationStatus(id: number, status: ContestApplication["status"], details?: Record<string, any>): ContestApplication | null {
  const apps = getApplications();
  const index = apps.findIndex((a) => a.id === id);
  if (index === -1) return null;
  const current = apps[index];
  const updated: ContestApplication = {
    ...current,
    status,
    paymentDetails: details ? { ...current.paymentDetails, ...details } : current.paymentDetails,
    paidAt: status === "paid" ? new Date().toISOString() : current.paidAt,
    updatedAt: new Date().toISOString(),
  };
  apps[index] = updated;
  saveApplications(apps);
  return updated;
}
