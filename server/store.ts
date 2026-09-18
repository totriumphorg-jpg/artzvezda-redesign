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

export const defaultCompetition: CompetitionContent = {
  id: "autumn-in-london-2026",
  code: "AUTUMN IN LONDON",
  title: "I Международный конкурс музыкально-художественного творчества «AUTUMN IN LONDON»",
  subtitle: "Талант достоин большой сцены",
  seasonBadge: "AUTUMN IN LONDON",
  startDate: "2026-09-09",
  endDate: "2026-10-11",
  priceRegular: 1700,
  priceDiscount: 1300,
  discountUntil: "2026-09-17",
  priceReduced: 790,
  bannerUrl: "/assets/artzvezda-hero.jpg",
  leadParagraph:
    "Покажите свою работу профессиональному жюри — получите признание, официальный международный диплом и следующий шаг в творческом пути.",
  aboutText:
    "Лондон — город, где туман над Темзой соседствует с неоновыми огнями, а классические музеи спорят с дерзким стрит-артом Ист-Энда. Мы приглашаем участников заявить о себе в конкурсе, вдохновлённом британской столицей, которая веками соединяет традиции и бунтарский дух. Жюри ждёт работ, в которых есть глубина, стиль и лондонская свобода самовыражения.",
  noticeText:
    "ВНИМАНИЕ! Сильнейшие артисты заочного конкурса будут награждены грантами на участие в очном конкурсе Творческого объединения «Триумф» в 2026 году!",
  packageDetails: [
    "Престижный диплом международного образца на английском языке на официальном бланке за подписью экспертного совета и печатью организатора",
    "Официальное благодарственное письмо руководителю и наставнику",
    "Выписка экспертного совета на официальном бланке (по запросу)",
    "Возможность приглашения педагогов в состав жюри следующих конкурсов ТО «Триумф»",
  ],
  rulesSections: [
    {
      id: "goals",
      title: "Цели и задачи",
      content:
        "Конкурс проводится в целях выявления и поддержки талантливой молодежи, популяризации искусства в его исполнительском и педагогическом аспектах, а также с целью открытия новых имен и талантов в области искусств. Также целями конкурса являются сохранение и развитие многонациональной культуры, повышение профессионального уровня руководителей и поддержка постоянных творческих контактов.",
    },
    {
      id: "nominations",
      title: "Номинации конкурса",
      content:
        "1. Танцевальное творчество (соло, дуэты, малые формы 3–7 человек, ансамбли)\n2. Вокальное творчество (соло, дуэты, трио, ансамбли, хоры)\n3. Инструментальное творчество\n4. Конкурс молодых композиторов и бардов\n5. Театральное творчество\n6. Цирковое искусство и оригинальный жанр\n7. Изобразительное творчество\n8. Выставка прикладного искусства\n9. Конкурс костюма\n10. Дебют (для первых выступлений детей 4–8 лет)",
    },
    {
      id: "age-groups",
      title: "Возрастные категории",
      content:
        "Категории: 4–8 лет; 9–10 лет; 11–12 лет; 13–15 лет; 16–18 лет; 19–25 лет; старше 25 лет; смешанная группа.\nВ коллективе каждой категории допускается до 30% участников младше или старше установленных рамок.",
    },
    {
      id: "requirements",
      title: "Требования к конкурсным материалам",
      content:
        "Принимаются видеозаписи живого выступления на сцене со статичной камеры без склеек и монтажа, сделанные не ранее двух лет назад. Разрешение — не менее 720p. Размещение: YouTube, RuTube, Яндекс Диск, Google Диск, Облако Mail.ru или Vimeo с открытым доступом.",
    },
    {
      id: "program",
      title: "Программа выступления",
      content:
        "Коллективы представляют программу до 8 минут. Солисты и дуэты вокальных, танцевальных дисциплин и чтецы — до 5 минут. Инструменталисты — до 7 минут. Номинация «Дебют» — до 3 минут. Изобразительное и прикладное искусство — 2–4 авторские работы в JPG.",
    },
    {
      id: "expert-council",
      title: "Экспертный совет",
      content:
        "Дмитрий Девдариани (Лондон) — режиссёр, драматург, худрук Театра Русской Классики в Лондоне.\nОльга Адамович Базиле (Лондон) — оперная певица, педагог, лауреат международных конкурсов.\nИзабель Альварес (Лондон) — исполнительница современного танца, хореограф.\nЕвгения Терентьева (Лондон) — пианистка, композитор, руководитель академии «Музыка Нова».",
    },
    {
      id: "criteria",
      title: "Критерии оценки",
      content:
        "Работы оцениваются по техническому мастерству с учетом возраста, артистизму, сложности репертуара и глубине создания художественного образа.",
    },
    {
      id: "results-rule",
      title: "Подведение итогов конкурса",
      content:
        "Победители определяются решением жюри на основании баллов. Результаты оформляются через 15 дней после окончания приёма заявок и отправляются участникам на e-mail. Итоги также публикуются на сайте artzvezda.com и в официальной группе ВКонтакте.",
    },
    {
      id: "financial-terms",
      title: "Финансовые условия",
      content:
        "Организационный взнос за одну номинацию составляет 1300 рублей (спеццена вместо 1700 рублей). Стоимость льготного участия — 790 рублей. Оплата производится банковскими картами через защищённый сервис PayKeeper.",
    },
  ],
  faqs: [
    {
      question: "Кто может участвовать?",
      answer:
        "Солисты, дуэты, трио, малые формы (3–7 человек), коллективы и творческие объединения. Возраст участников — от 4 лет.",
    },
    {
      question: "Какой формат работы принимается?",
      answer:
        "Видеозаписи живых выступлений без склеек (YouTube, RuTube, Яндекс.Диск, Google Диск, Облако Mail, Vimeo), а для визуальных дисциплин — 2–4 авторские фотографии в высоком качестве.",
    },
    {
      question: "Когда и как объявляются результаты?",
      answer:
        "Результаты не публикуются в личных сообщениях соцсетей. Официальный протокол подводится в течение 15 рабочих дней после завершения приёма заявок, направляется на e-mail плательщика, а общие списки публикуются на сайте artzvezda.com и в группе ВКонтакте.",
    },
    {
      question: "Как проходит оплата взноса?",
      answer:
        "После заполнения формы заявки открывается защищённый платёжный шлюз PayKeeper. Оплата проходит онлайн картами банков РФ, а после проведения платежа на почту отправляются подтверждение регистрации и официальный чек.",
    },
    {
      question: "Можно ли заявить несколько конкурсных номеров?",
      answer:
        "Да. Каждый номер или номинация оформляются отдельной заявкой, чтобы экспертный совет выставил точные баллы по соответствующей категории.",
    },
  ],
  results: [
    {
      title: "Итоги I конкурса «AUTUMN IN LONDON»",
      description:
        "Протоколы жюри, дипломы и персональные выписки направляются участникам на почту. Сводные списки победителей доступны на сайте и в VK.",
      publishedDate: "2026-10-26",
      vkUrl: "https://vk.com/triumph_org",
    },
  ],
  paykeeper: {
    enabled: false,
    serverUrl: process.env.PAYKEEPER_SERVER_URL || "",
    secretKey: process.env.PAYKEEPER_SECRET_KEY || "",
    serviceName: "Оплата участия в online-конкурсе ART ЗВЕЗДА",
  },
  updatedAt: new Date().toISOString(),
};

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
