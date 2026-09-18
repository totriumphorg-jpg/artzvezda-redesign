import crypto from "crypto";
import { ContestApplication } from "./store";

export function applicationsToCsv(applications: ContestApplication[]): string {
  const headers = [
    "Номер",
    "paymentId",
    "Фамилия и имя участника / название коллектива",
    "Количество человек",
    "Жанр",
    "Возрастная группа",
    "Номинация",
    "Email",
    "Телефон",
    "Образовательное учреждение",
    "Адрес образовательного учреждения",
    "ФИО руководителя",
    "Название конкурсного выступления",
    "Сведения о коллективе",
    "Ссылка на работу 1",
    "Ссылка на работу 2",
    "Сумма взноса",
    "Статус оплаты",
    "Дата создания",
    "Дата оплаты",
  ];

  const escapeCsv = (val: unknown) => {
    if (val === undefined || val === null) return '""';
    const str = String(val).replace(/"/g, '""');
    return `"${str}"`;
  };

  const rows = applications.map((app) => [
    app.id,
    app.paymentId,
    app.participantName,
    app.peopleCount,
    app.genre,
    app.ageCategory,
    app.nomination,
    app.email,
    app.phone,
    app.institutionName,
    app.institutionAddress,
    app.directorName,
    app.performanceTitle,
    app.collectiveInfo,
    app.videoLink1,
    app.videoLink2,
    app.paymentAmount,
    app.status === "paid" ? "Оплачено" : app.status === "pending_payment" ? "Ожидает оплаты" : app.status,
    app.createdAt,
    app.paidAt || "",
  ]);

  const bom = "\uFEFF";
  const body = [headers.map(escapeCsv).join(";"), ...rows.map((row) => row.map(escapeCsv).join(";"))].join("\r\n");
  return bom + body;
}

export function buildPaykeeperSignature(secret: string, id: string, sum: string, clientid: string, orderid: string): string {
  const raw = `${id}${sum}${clientid}${orderid}${secret}`;
  return crypto.createHash("md5").update(raw).digest("hex");
}
