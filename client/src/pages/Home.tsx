import { useEffect, useState } from "react";
import {
  ArrowRight,
  CheckCircle2,
  ChevronDown,
  Sparkles,
  X,
  Phone,
  Mail,
  Send,
  FileText,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const GENRES = [
  "ТАНЦЕВАЛЬНОЕ ТВОРЧЕСТВО (соло, дуэты, малые формы (3-7 человек), ансамбли)",
  "ВОКАЛЬНОЕ ТВОРЧЕСТВО (соло, дуэты, трио, ансамбли, хоры)",
  "ИНСТРУМЕНТАЛЬНОЕ ТВОРЧЕСТВО",
  "КОНКУРС МОЛОДЫХ КОМПОЗИТОРОВ И БАРДОВ",
  "ТЕАТРАЛЬНОЕ ТВОРЧЕСТВО",
  "ЦИРКОВОЕ ИСКУССТВО. ОРИГИНАЛЬНЫЙ ЖАНР",
  "ИЗОБРАЗИТЕЛЬНОЕ ТВОРЧЕСТВО",
  "ВЫСТАВКА ПРИКЛАДНОГО ИСКУССТВА",
  "КОНКУРС КОСТЮМА",
  "ДЕБЮТ",
];

const AGE_GROUPS = [
  "4-8 лет",
  "9-10 лет",
  "11-12 лет",
  "13-15 лет",
  "16-18 лет",
  "19-25 лет",
  "старше 25 лет",
  "смешанная группа",
];

const AUTUMN_REPORT = {
  title: 'Итоги III Международного конкурса музыкально-художественного творчества «AUTUMN IN LONDON»',
  date: '11 сентября – 12 сентября 2026 г.',
  intro:
    'Международный online-конкурс учрежден CA Triumph – Творческим объединением «Триумф» и состоялся в заочном формате при поддержке Международной академии музыки Елены Образцовой, инновационной образовательной платформы ARTCOMPASS и Санкт-Петербургской Академии последипломного образования.',
  geography:
    'На заочной сцене платформы ARTZVEZDA свои таланты показали конкурсанты из таких стран и городов, как: Казань, Челябинск, Екатеринбург, Пенза, Красногорск, Калининград, Барнаул, Долгопрудный, Брянск, Могилев, Братск, Обнинск, Москва, Иркутск, Житковичи (Республика Беларусь), Барабинск (Новосибирская область), Оренбург и другие города.',
  juryIntro: 'В экспертном совете проекта выступили ведущие специалисты в области культуры и искусства:',
  jury: [
    'Юки Негиши (Великобритания, Лондон) – пианистка, педагог, композитор. Выступает с сольными концертами, как солистка с оркестрами и в составе камерных ансамблей в Великобритании, Нидерландах, Франции, Германии, Швейцарии, Италии, Румынии, Японии, Китае и США. Сотрудничает с музыкантами Королевского филармонического оркестра, Японского филармонического оркестра, оркестра Цюрихского Тонхалле, Королевского оркестра Концертгебау. Член жюри Международного фортепианного конкурса в Сассексе. Член Piano Week.',
    'Ячао Чжу (Великобритания, Лондон) – хореограф, танцовщица, художница. Получила степень бакалавра изящных искусств в области танца в Центральном университете национальностей Китая, работала в Пекинском театре танца. Получила степень магистра изящных искусств в области танца в Школе искусств Тиш Нью-Йоркского университета. Удостоена многих национальных и международных наград: стипендии Полетт Годдард от Школы искусств Тиш Нью-Йоркского университета, стипендии Тринити Лабан в области танца, премии «Выдающийся преподаватель» от Центрального университета национальностей и др. Проводила мастер-классы во многих университетах и академиях искусств.',
    'Дмитрий Девдариани (Великобритания, Лондон) – театральный режиссёр, работающий на различных площадках Лондона и Эдинбурга, поставил множество современных и классических пьес. Также он актёр, драматург, поэт, преподаватель, сценарист, художник. Художественный руководитель Театра русской классики в Лондоне и один из режиссёров фестиваля «Звёзды Альбиона». Дмитрий – лауреат конкурса сценаристов имени Роберта Редфорда, а также лауреат фестиваля «Звёзды Альбиона».',
    'Ольга Адамович Базиле (Великобритания, Лондон) – оперная певица, преподаватель вокала, профессор музыки, окончила Санкт-Петербургскую консерваторию имени Н. А. Римского-Корсакова, Болонскую консерваторию и Музыкальный институт Реджо-Эмилии, живёт в Великобритании, в Лондоне. Лауреат международных конкурсов. Обладательница наград за художественные достижения Оперной академии бельканто Миреллы Френи и серебряной медали города Рима.',
    'Индра Теджасукмана (Германия, Дортмунд) – вокалист, преподаватель Музыкальной академии и руководитель хора, проживающий в Дортмунде, Германия. Специализируется на эстрадных и джазовых вокальных стилях, является участником профессиональной а капелла-группы «Blended» из Берлина. Преподаёт вокальное исполнительство, эстрадный хор и постановку голоса в Музыкальном университете Мюнстера. Также преподаёт джазовый хор, гармонию и развитие слуха в Джазовой академии в Дортмунде. Автор нескольких учебных книг в области вокальной музыки.',
  ],
  prizesTitle: 'СПЕЦИАЛЬНЫЕ ПРИЗЫ и ГРАН-ПРИ I Международного конкурса музыкально-художественного творчества «AUTUMN IN LONDON»',
  prizes: [
    'Специальным призом «За высокий уровень исполнительского мастерства», а также сертификатом от Академии иностранных языков MLA награждаются:\nГорфункель Даниэль, преп. Терехина Наталья Вячеславовна\nТеатральное объединение «СОВА», преп. Кочнева Юлиана Васильевна\nКодалаева Милана, преп. Собиева Руслана Валерьевна',
    'Специальным призом «За высокий уровень исполнительного креативности», а также сертификатом от Академии иностранных языков MLA награждаются:\nФольклорный инструментальный ансамбль «Просто класс», преп. Матвеева Татьяна Александровна, Селина Елена Анатольевна',
  ],
};

const ASSETS = {
  hero: "/manus-storage/artzvezda-hero_70ad2501.jpg",
  disciplines: "/manus-storage/artzvezda-disciplines_ab424650.jpg",
  triumphLogo: "/manus-storage/triumph-official_aaece090.svg",
};

function Logo() {
  return (
    <a href="#top" className="brand-logo" aria-label="Триумф — на главную">
      <img className="official-logo" src={ASSETS.triumphLogo} alt="Логотип Творческого объединения Триумф" />
    </a>
  );
}

type TrustIconKind = "diploma" | "jury" | "status";

function TrustIcon({ kind }: { kind: TrustIconKind }) {
  if (kind === "diploma") {
    return (
      <svg className="trust-icon-svg" viewBox="0 0 64 64" aria-hidden="true">
        <path d="M20 10h22l9 9v28a7 7 0 0 1-7 7H20a7 7 0 0 1-7-7V17a7 7 0 0 1 7-7Z" />
        <path d="M42 10v10h9M22 27h20M22 33h15" />
        <circle cx="32" cy="45" r="8" />
        <path className="trust-icon-accent" d="m27 51-2 8 7-4 7 4-2-8M29 45l2-3 2 3 3 .7-2 2.4.4 3.2-3.4-1.4-3.4 1.4.4-3.2-2-2.4Z" />
      </svg>
    );
  }

  if (kind === "jury") {
    return (
      <svg className="trust-icon-svg" viewBox="0 0 64 64" aria-hidden="true">
        <circle cx="32" cy="25" r="11" />
        <path className="trust-icon-accent" d="m32 16 2.7 5.5 6.1.9-4.4 4.3 1 6.1-5.4-2.9-5.4 2.9 1-6.1-4.4-4.3 6.1-.9Z" />
        <path d="M18 53c1.5-7.5 6-11 14-11s12.5 3.5 14 11M15 39c-4.3 2.1-6.4 5.7-6.8 10M49 39c4.3 2.1 6.4 5.7 6.8 10" />
        <path className="trust-icon-accent" d="M10 25c1.5 4.1 4.2 7 8 8M54 25c-1.5 4.1-4.2 7-8 8" />
      </svg>
    );
  }

  return (
    <svg className="trust-icon-svg" viewBox="0 0 64 64" aria-hidden="true">
      <path d="M32 8 49 14v14c0 12-7.3 21.3-17 27-9.7-5.7-17-15-17-27V14Z" />
      <path className="trust-icon-accent" d="m24 31 5 5 11-12" />
      <path d="M24 18h16M24 45h16" />
      <circle className="trust-icon-accent" cx="47" cy="47" r="6" />
      <path className="trust-icon-accent" d="m44 47 2 2 4-5" />
    </svg>
  );
}

export default function Home() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [openRule, setOpenRule] = useState<string | null>("goals");
  const [activeResultIndex, setActiveResultIndex] = useState(0);
  const [isReportOpen, setIsReportOpen] = useState(false);

  const [comp, setComp] = useState<any>({
    title: "I Международный конкурс музыкально-художественного творчества «AUTUMN IN LONDON»",
    seasonBadge: "AUTUMN IN LONDON",
    startDate: "2026-09-09",
    endDate: "2026-10-11",
    priceDiscount: 1300,
    priceRegular: 1700,
    priceReduced: 790,
    bannerUrl: ASSETS.hero,
    aboutText:
      "Лондон — город, где туман над Темзой соседствует с неоновыми огнями, а классические музеи спорят с дерзким стрит-артом Ист-Энда. Мы приглашаем участников заявить о себе в конкурсе, вдохновлённом британской столицей, которая веками соединяет традиции и бунтарский дух. Жюри ждёт работ, в которых есть глубина, стиль и лондонская свобода самовыражения.",
    noticeText:
      "ВНИМАНИЕ! Сильнейшие артисты заочного конкурса будут награждены грантами на участие в очном конкурсе Творческого объединения «Триумф» в 2026 году!",
    rulesSections: [],
    faqs: [],
    results: [],
  });

  const [formData, setFormData] = useState({
    participantName: "",
    peopleCount: "1",
    genre: GENRES[0],
    ageCategory: AGE_GROUPS[0],
    nomination: "",
    email: "",
    phone: "",
    institutionName: "",
    institutionAddress: "",
    directorName: "",
    performanceTitle: "",
    collectiveInfo: "",
    videoLink1: "",
    videoLink2: "",
    agreedToPolicy: true,
  });

  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetch("/api/competition")
      .then((r) => r.json())
      .then((data) => {
        if (data && data.title) {
          setComp(data);
          if (data.rulesSections?.length > 0) {
            setOpenRule(data.rulesSections[0].id);
          }
        }
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (!isReportOpen) return;
    const previousOverflow = document.body.style.overflow;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsReportOpen(false);
    };
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", closeOnEscape);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, [isReportOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.participantName || !formData.email || !formData.phone || !formData.nomination) {
      toast.error("Пожалуйста, заполните обязательные поля заявки");
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch("/api/applications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Ошибка сохранения заявки");
      toast.success("Заявка успешно создана. Переходим к подтверждению...");
      if (data.paymentUrl) {
        window.location.href = data.paymentUrl;
      }
    } catch (err: any) {
      toast.error(err.message || "Не удалось отправить заявку");
    } finally {
      setSubmitting(false);
    }
  };

  const activeResult = comp.results?.[activeResultIndex] || comp.results?.[0];

  return (
    <div className="landing-wrap" id="top">
      <div className="ambient-canvas" aria-hidden="true">
        <div className="ambient-orb orb-1" />
        <div className="ambient-orb orb-2" />
        <div className="ambient-orb orb-3" />
      </div>

      <header className="site-header">
        <div className="header-inner">
          <Logo />
          <nav className="desktop-nav" aria-label="Основное меню">
            <a href="#about">О конкурсе</a>
            <a href="#rules">Положение</a>
            <a href="#results">Итоги</a>
            <a href="#faq">Вопросы</a>
          </nav>
          <a href="#apply" className="button button-primary header-cta">
            Подать заявку <ArrowRight className="w-4 h-4 inline ml-1.5" />
          </a>
          <button
            type="button"
            className="menu-button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Переключить меню"
          >
            <span />
            <span />
          </button>
        </div>
        <div className={`mobile-menu ${mobileMenuOpen ? "open" : ""}`}>
          <a href="#about" onClick={() => setMobileMenuOpen(false)}>О конкурсе</a>
          <a href="#rules" onClick={() => setMobileMenuOpen(false)}>Положение</a>
          <a href="#results" onClick={() => setMobileMenuOpen(false)}>Итоги</a>
          <a href="#faq" onClick={() => setMobileMenuOpen(false)}>Вопросы</a>
          <a href="#apply" className="button button-primary" onClick={() => setMobileMenuOpen(false)}>Подать заявку</a>
        </div>
      </header>

      {/* Hero Section */}
      <section className="hero section-grid">
        <div className="hero-content">
          <span className="eyebrow">
            <span className="dot" /> {comp.seasonBadge || "МЕЖДУНАРОДНЫЙ ОНЛАЙН-КОНКУРС"}
          </span>
          <h1 className="hero-heading">
            {comp.title || "Талант достоин большой сцены"}
          </h1>
          <p className="hero-lead">
            {comp.leadParagraph || "Покажите свою работу профессиональному жюри — получите признание, официальный диплом и следующий шаг в творческом пути."}
          </p>
          <div className="hero-quick-actions" aria-label="Основные действия">
            <a href="#rules" className="quick-action quick-action-rules">Положение <ArrowRight className="w-4 h-4" /></a>
            <a href="#pricing" className="quick-action quick-action-price">Стоимость <ArrowRight className="w-4 h-4" /></a>
            <a href="#apply" className="quick-action quick-action-apply">Подать заявку <ArrowRight className="w-4 h-4" /></a>
          </div>
        </div>

        <div className="hero-image-wrap">
          <img
            src={comp.bannerUrl || ASSETS.hero}
            alt="Молодые артисты выступают на сцене"
            className="hero-image"
          />
          <div className="hero-figure-card">
            <span className="year">2026</span>
            <span className="city">{comp.seasonBadge || "AUTUMN IN LONDON"}</span>
          </div>
          <div className="hero-sticker">★ ОТКРЫВАЕМ ТАЛАНТЫ</div>
        </div>
      </section>

      {/* About Section - Wide Horizontal Card (No Empty Left Column) */}
      <section className="intro section-grid" id="about">
        <div className="intro-card-wide">
          <div className="intro-top-bar">
            <span className="eyebrow m-0">О ТЕКУЩЕМ КОНКУРСЕ</span>
            <div className="intro-stage-badge">
              <span className="intro-stage-num">01</span>
              <span>СЕЗОН 2026 · ART ЗВЕЗДА</span>
            </div>
          </div>

          <h2>
            {comp.title ? comp.title.split("«")[1]?.replace("»", "") || comp.title : "Autumn in London"}
          </h2>

          <div className="intro-copy-wide">
            <p>{comp.aboutText}</p>
            <div className="intro-notice-box">
              {comp.noticeText}
            </div>
          </div>

          <div className="trust-row">
            <div className="trust-card">
              <div className="trust-emblem trust-emblem-diploma"><TrustIcon kind="diploma" /></div>
              <strong>Международный диплом</strong>
              <span>На официальном гербовом бланке за подписью экспертного совета</span>
            </div>
            <div className="trust-card">
              <div className="trust-emblem trust-emblem-jury"><TrustIcon kind="jury" /></div>
              <strong>Экспертная оценка</strong>
              <span>Профильное жюри из Лондона и ведущих театров страны</span>
            </div>
            <div className="trust-card">
              <div className="trust-emblem trust-emblem-status"><TrustIcon kind="status" /></div>
              <strong>Официальный статус</strong>
              <span>При поддержке комитетов культуры и профильного образования</span>
            </div>
          </div>
        </div>
      </section>

      {/* Rules and Regulations Section */}
      <section className="rules-section section-grid" id="rules">
        <div className="rules-header">
          <span className="eyebrow">ОФИЦИАЛЬНАЯ ИНФОРМАЦИЯ</span>
          <h2>Положение конкурса</h2>
          <p>
            Все разделы положения сохранены в полном объёме с действующего сайта. Выберите интересующий подраздел:
          </p>
        </div>

        <div className="rules-accordion">
          {comp.rulesSections?.map((section: any, idx: number) => {
            const isOpen = openRule === section.id;
            return (
              <div key={section.id} className={`rule-accordion-item ${isOpen ? "open" : ""}`}>
                <button
                  type="button"
                  className="rule-accordion-trigger"
                  onClick={() => setOpenRule(isOpen ? null : section.id)}
                  aria-expanded={isOpen}
                >
                  <span className="rule-number">{String(idx + 1).padStart(2, "0")}</span>
                  <span className="rule-title">{section.title}</span>
                  <ChevronDown className={`w-5 h-5 transition-transform ${isOpen ? "rotate-180" : ""}`} />
                </button>
                {isOpen && (
                  <div className="rule-accordion-content">
                    {section.content.split("\n").map((par: string, paragraphIndex: number) => (
                      <p key={paragraphIndex}>{par}</p>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
          <div className="rules-footer-note">
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-blue-600" />
              <span>Официальная редакция регламента ТО «Триумф» · 2026 г.</span>
            </div>
            <a href="#faq" className="text-blue-700 hover:underline">Частые вопросы по регламенту →</a>
          </div>
        </div>
      </section>

      {/* Results Section - Stretched Horizontally Without Empty Space */}
      <section className="results-section section-grid" id="results">
        <div className="results-header">
          <span className="eyebrow">ИТОГИ И РЕЗУЛЬТАТЫ</span>
          <h2>Результаты конкурсов</h2>
          <p>
            Результаты публикуются на сайте artzvezda.com и в официальной группе ВКонтакте, а персональные дипломы направляются участникам на почту.
          </p>
        </div>

        <div className="results-report-picker" role="tablist" aria-label="Отчёты по конкурсам">
          {comp.results?.map((res: any, idx: number) => (
            <button key={idx} type="button" role="tab" aria-selected={activeResultIndex === idx} className={`results-report-tab ${activeResultIndex === idx ? "active" : ""}`} onClick={() => setActiveResultIndex(idx)}>
              <span>{String(idx + 1).padStart(2, "0")}</span>
              {res.title}
            </button>
          ))}
        </div>

        {activeResult && (
          <div className="result-card-wide result-report-card">
            <div className="result-card-info">
              <span className="result-date-badge"><CheckCircle2 className="w-3.5 h-3.5" /> Дата публикации: {activeResult.publishedDate}</span>
              <h3>{activeResult.title}</h3>
              <p>{activeResult.description}</p>
            </div>
            <div className="result-card-actions">
              <button type="button" className="button button-ghost text-xs" onClick={() => setIsReportOpen(true)}>
                Открыть отчёт <FileText className="w-3.5 h-3.5 inline ml-1.5" />
              </button>
            </div>
          </div>
        )}
      </section>

      {isReportOpen && (
        <div className="report-modal-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setIsReportOpen(false); }}>
          <div className="report-modal" role="dialog" aria-modal="true" aria-labelledby="report-modal-title">
            <div className="report-modal-header">
              <div>
                <span className="eyebrow">ОТЧЁТ КОНКУРСА</span>
                <h2 id="report-modal-title">{AUTUMN_REPORT.title}</h2>
                <p className="report-modal-date">{AUTUMN_REPORT.date}</p>
              </div>
              <button type="button" className="report-modal-close" aria-label="Закрыть отчёт" onClick={() => setIsReportOpen(false)}>
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="report-modal-body">
              <p>{AUTUMN_REPORT.intro}</p>
              <p>{AUTUMN_REPORT.geography}</p>
              <h3>Экспертный совет</h3>
              <p>{AUTUMN_REPORT.juryIntro}</p>
              <div className="report-jury-list">
                {AUTUMN_REPORT.jury.map((member) => <p key={member}>{member}</p>)}
              </div>
              <h3>{AUTUMN_REPORT.prizesTitle}</h3>
              {AUTUMN_REPORT.prizes.map((prize) => (
                <p className="report-prize" key={prize}>{prize}</p>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Application Form */}
      <section className="apply-section section-grid" id="apply">
        <div>
          <span className="eyebrow">ОФИЦИАЛЬНАЯ РЕГИСТРАЦИЯ</span>
          <h2>Заявка на конкурс</h2>
          <p className="mt-3 leading-relaxed">
            Заполните форму участия. После нажатия «Отправить и оплатить» данные безопасно сохраняются в системе, а вы переходите к оплате организационного взноса.
          </p>
          <div className="fee-highlight-card mt-6" id="pricing">
            <div className="flex items-center gap-2 mb-1">
              <Sparkles className="w-4 h-4 text-amber-500" />
              <strong>Организационный взнос: {comp.priceDiscount || 1300} ₽</strong>
            </div>
            <p>Для подтверждения льготного участия ({comp.priceReduced || 790} ₽) напишите на hello@artzvezda.com.</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="apply-card form-grid">
          <div className="field">
            <label>Фамилия и имя участника / название коллектива *</label>
            <input
              type="text"
              required
              placeholder="Например: Иванов Иван или Ансамбль «Вдохновение»"
              value={formData.participantName}
              onChange={(e) => setFormData({ ...formData, participantName: e.target.value })}
            />
          </div>

          <div className="field">
            <label>Количество человек *</label>
            <input
              type="text"
              required
              placeholder="1 для соло или точное количество"
              value={formData.peopleCount}
              onChange={(e) => setFormData({ ...formData, peopleCount: e.target.value })}
            />
          </div>

          <div className="field field-full">
            <label>Жанр *</label>
            <select
              value={formData.genre}
              onChange={(e) => setFormData({ ...formData, genre: e.target.value })}
            >
              {GENRES.map((g, idx) => (
                <option key={idx} value={g}>{g}</option>
              ))}
            </select>
          </div>

          <div className="field">
            <label>Возрастная группа *</label>
            <select
              value={formData.ageCategory}
              onChange={(e) => setFormData({ ...formData, ageCategory: e.target.value })}
            >
              {AGE_GROUPS.map((a, idx) => (
                <option key={idx} value={a}>{a}</option>
              ))}
            </select>
          </div>

          <div className="field">
            <label>Номинация *</label>
            <input
              type="text"
              required
              placeholder="Например: Эстрадный вокал / Народный танец"
              value={formData.nomination}
              onChange={(e) => setFormData({ ...formData, nomination: e.target.value })}
            />
          </div>

          <div className="field">
            <label>E-mail для диплома и чека *</label>
            <input
              type="email"
              required
              placeholder="name@example.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
          </div>

          <div className="field">
            <label>Телефон *</label>
            <input
              type="tel"
              required
              placeholder="+7 (___) ___-__-__"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            />
          </div>

          <div className="field field-full">
            <label>Название образовательного учреждения</label>
            <input
              type="text"
              placeholder="ДШИ, центр творчества, школа или студия"
              value={formData.institutionName}
              onChange={(e) => setFormData({ ...formData, institutionName: e.target.value })}
            />
          </div>

          <div className="field field-full">
            <label>Адрес образовательного учреждения</label>
            <input
              type="text"
              placeholder="Город, индекс, улица, дом"
              value={formData.institutionAddress}
              onChange={(e) => setFormData({ ...formData, institutionAddress: e.target.value })}
            />
          </div>

          <div className="field">
            <label>ФИО руководителя / педагога</label>
            <input
              type="text"
              placeholder="Для указания в благодарственном письме"
              value={formData.directorName}
              onChange={(e) => setFormData({ ...formData, directorName: e.target.value })}
            />
          </div>

          <div className="field">
            <label>Название конкурсного выступления</label>
            <input
              type="text"
              placeholder="Название номера / произведения"
              value={formData.performanceTitle}
              onChange={(e) => setFormData({ ...formData, performanceTitle: e.target.value })}
            />
          </div>

          <div className="field field-full">
            <label>Ссылка на конкурсную работу 1 (YouTube, RuTube, Диск, Облако) *</label>
            <input
              type="url"
              required
              placeholder="https://..."
              value={formData.videoLink1}
              onChange={(e) => setFormData({ ...formData, videoLink1: e.target.value })}
            />
          </div>

          <div className="field field-full">
            <label>Ссылка на конкурсную работу 2 (при необходимости)</label>
            <input
              type="url"
              placeholder="https://..."
              value={formData.videoLink2}
              onChange={(e) => setFormData({ ...formData, videoLink2: e.target.value })}
            />
          </div>

          <div className="field field-full">
            <label>Сведения о коллективе / участнике</label>
            <textarea
              rows={2}
              placeholder="Дополнительные сведения, хронометраж или творческие достижения"
              value={formData.collectiveInfo}
              onChange={(e) => setFormData({ ...formData, collectiveInfo: e.target.value })}
            />
          </div>

          <div className="form-bottom field-full">
            <label className="flex items-start gap-2.5 text-sm text-[#1d4f98] font-medium">
              <input
                type="checkbox"
                required
                checked={formData.agreedToPolicy}
                onChange={(e) => setFormData({ ...formData, agreedToPolicy: e.target.checked })}
                className="mt-1 rounded text-blue-600 w-4 h-4"
              />
              <span>
                Согласие на обработку персональных данных в соответствии с политикой безопасности
              </span>
            </label>
            <Button type="submit" disabled={submitting} className="button button-primary w-full mt-4 text-base py-4">
              {submitting ? "Сохранение заявки..." : "Отправить и оплатить →"}
            </Button>
          </div>
        </form>
      </section>

      {/* FAQ Section - Chess / 2-Column Staggered Grid */}
      <section className="faq-section section-grid" id="faq">
        <div className="faq-header">
          <span className="eyebrow">ОТВЕТЫ РЯДОМ</span>
          <h2>Частые вопросы</h2>
          <p>
            Вся актуальная информация о сроках, жюри и дипломах:
          </p>
        </div>

        <div className="faq-grid-2col">
          {comp.faqs?.map((faq: any, idx: number) => (
            <div key={idx} className="faq-item">
              <button
                type="button"
                onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                aria-expanded={openFaq === idx}
              >
                <span>{faq.question}</span>
                <ChevronDown className={`w-5 h-5 transition-transform flex-shrink-0 ${openFaq === idx ? "rotate-180" : ""}`} />
              </button>
              {openFaq === idx && <p>{faq.answer}</p>}
            </div>
          ))}
        </div>
      </section>

      {/* Enriched & Revitalized Footer */}
      <div className="footer-wrap section-grid">
        <footer className="footer-revitalized">
          <div className="footer-hero-bar">
            <div className="footer-brand-side">
              <Logo />
              <div className="footer-live-badge">
                <span className="footer-live-dot" />
                <span>Приём заявок открыт онлайн 24/7</span>
              </div>
            </div>
            <a href="#apply" className="button button-primary">
              Подать заявку онлайн →
            </a>
          </div>

          <div className="footer-main-grid">
            <div className="footer-col footer-col-about">
              <h4>Организатор конкурса</h4>
              <p>
                Творческое объединение «Триумф» — организатор всероссийских и международных фестивалей с 2006 года. Конкурс, где каждый юный талант получает право звучать громче.
              </p>
              <div className="footer-subtext">
                Официальный портал проекта: artzvezda.com
              </div>
            </div>

            <div className="footer-col">
              <h4>Контакты оргкомитета</h4>
              <div className="footer-contact-cards">
                <a href="tel:+78126002123" className="contact-pill">
                  <Phone className="w-4 h-4 text-blue-600" />
                  <span>+7 (812) 600-21-23</span>
                </a>
                <a href="mailto:hello@artzvezda.com" className="contact-pill">
                  <Mail className="w-4 h-4 text-blue-600" />
                  <span>hello@artzvezda.com</span>
                </a>
              </div>
            </div>

            <div className="footer-col">
              <h4>Мы на связи</h4>
              <div className="footer-social-row">
                <a href="https://vk.com/triumph_org" target="_blank" rel="noreferrer" className="social-badge vk">
                  ВКонтакте
                </a>
                <a href="https://t.me/TO_Triumph" target="_blank" rel="noreferrer" className="social-badge tg">
                  <Send className="w-3.5 h-3.5 mr-1" /> Telegram
                </a>
              </div>
            </div>
          </div>

          <div className="footer-bottom-bar">
            <span>© 2026 ART ЗВЕЗДА · Все права защищены</span>
            <span>Творческое объединение «Триумф»</span>
            <a href="#top">Наверх ↑</a>
          </div>
        </footer>
      </div>
    </div>
  );
}
