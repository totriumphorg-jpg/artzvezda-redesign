import { int, mysqlEnum, mysqlTable, text, timestamp, varchar, json } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = mysqlTable("users", {
  /**
   * Surrogate primary key. Auto-incremented numeric value managed by the database.
   * Use this for relations between tables.
   */
  id: int("id").autoincrement().primaryKey(),
  /** Manus OAuth identifier (openId) returned from the OAuth callback. Unique per user. */
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

export const competitions = mysqlTable("competitions", {
  id: varchar("id", { length: 64 }).primaryKey(),
  code: varchar("code", { length: 128 }).notNull(),
  title: text("title").notNull(),
  subtitle: text("subtitle"),
  seasonBadge: varchar("seasonBadge", { length: 128 }),
  startDate: varchar("startDate", { length: 32 }).notNull(),
  endDate: varchar("endDate", { length: 32 }).notNull(),
  priceRegular: int("priceRegular").default(1700).notNull(),
  priceDiscount: int("priceDiscount").default(1300).notNull(),
  priceReduced: int("priceReduced").default(790).notNull(),
  bannerUrl: text("bannerUrl"),
  leadParagraph: text("leadParagraph"),
  aboutText: text("aboutText"),
  noticeText: text("noticeText"),
  rulesSections: json("rulesSections"),
  faqs: json("faqs"),
  results: json("results"),
  paykeeperConfig: json("paykeeperConfig"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export const applications = mysqlTable("applications", {
  id: int("id").autoincrement().primaryKey(),
  competitionId: varchar("competitionId", { length: 64 }).notNull(),
  paymentId: varchar("paymentId", { length: 64 }).notNull().unique(),
  participantName: text("participantName").notNull(),
  peopleCount: varchar("peopleCount", { length: 32 }).default("1"),
  genre: text("genre").notNull(),
  ageCategory: varchar("ageCategory", { length: 64 }),
  nomination: text("nomination").notNull(),
  email: varchar("email", { length: 320 }).notNull(),
  phone: varchar("phone", { length: 64 }).notNull(),
  institutionName: text("institutionName"),
  institutionAddress: text("institutionAddress"),
  directorName: text("directorName"),
  performanceTitle: text("performanceTitle"),
  collectiveInfo: text("collectiveInfo"),
  videoLink1: text("videoLink1").notNull(),
  videoLink2: text("videoLink2"),
  amount: int("amount").notNull(),
  status: mysqlEnum("status", ["pending_payment", "paid", "accepted", "rejected"]).default("pending_payment").notNull(),
  paymentDetails: json("paymentDetails"),
  paidAt: timestamp("paidAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Competition = typeof competitions.$inferSelect;
export type Application = typeof applications.$inferSelect;
