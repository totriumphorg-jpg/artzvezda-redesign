import { useEffect, useState } from "react";
import {
  ArrowRight,
  CheckCircle2,
  ChevronDown,
  Sparkles,
  Music2,
  Theater,
  Palette,
  ExternalLink,
  ShieldCheck,
  Award,
  Globe2,
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

const ASSETS = {
  hero: "/manus-storage/artzvezda-hero_70ad2501.jpg",
  disciplines: "/manus-storage/artzvezda-disciplines_ab424650.jpg",
  triumphLogo: "/manus-storage/triumph-apple-icon_4dcb1a83.png",
};

function Logo() {
  return (
    <a href="#top" className="brand-logo" aria-label="Триумф — на главную">
      <div className="logo-symbol">
        <img src={ASSETS.triumphLogo} alt="Логотип Творческого объединения Триумф" />
      </div>
      <div className="brand-copy">
        <span className="brand-title">ТРИУМФ</span>
        <span className="brand-sub">творческое объединение</span>
      </div>
    </a>
  );
}

export default function Home() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [activeRuleTab, setActiveRuleTab] = useState<string>("goals");

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
            setActiveRuleTab(data.rulesSections[0].id);
          }
        }
      })
      .catch(() => {});
  }, []);

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

  const activeSection = comp.rulesSections?.find((s: any) => s.id === activeRuleTab) || comp.rulesSections?.[0];

  return (
    <div className="landing-wrap" id="top">
      <header className="site-header">
        <div className="header-inner">
          <Logo />
          <nav className="desktop-nav" aria-label="Основное меню">
            <a href="#about">О конкурсе</a>
            <a href="#rules">Положение</a>
            <a href="#genres">Номинации</a>
            <a href="#results">Итоги</a>
            <a href="#faq">Вопросы</a>
            <a href="/admin" className="text-slate-400 hover:text-slate-900 transition-colors">Вход оргкомитета</a>
          </nav>
          <a href="#apply" className="button button-primary header-cta">
            Подать заявку <ArrowRight className="w-3.5 h-3.5 inline ml-1" />
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
          <a href="#genres" onClick={() => setMobileMenuOpen(false)}>Номинации</a>
          <a href="#results" onClick={() => setMobileMenuOpen(false)}>Итоги</a>
          <a href="#faq" onClick={() => setMobileMenuOpen(false)}>Вопросы</a>
          <a href="/admin" onClick={() => setMobileMenuOpen(false)}>Вход оргкомитета</a>
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
          <div className="hero-actions">
            <a href="#apply" className="button button-primary">Подать заявку ↘</a>
            <a href="#rules" className="button button-ghost">Читать положение</a>
          </div>
          <div className="hero-details">
            <div>
              <span>СРОКИ ПРОВЕДЕНИЯ</span>
              <strong>{comp.startDate ? `${comp.startDate} — ${comp.endDate}` : "9 сентября — 11 октября"}</strong>
            </div>
            <div>
              <span>ВЗНОС ЗА НОМИНАЦИЮ</span>
              <strong>{comp.priceDiscount || 1300} ₽ <span className="line-through text-slate-400 font-normal">{comp.priceRegular || 1700} ₽</span></strong>
            </div>
            <div>
              <span>ФОРМАТ</span>
              <strong>онлайн · из любой точки</strong>
            </div>
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

      {/* About Section */}
      <section className="intro section-grid" id="about">
        <div className="intro-side">
          <span className="tag">ART ЗВЕЗДА / 2026</span>
          <div className="intro-number">01</div>
        </div>
        <div>
          <span className="eyebrow">О ТЕКУЩЕМ КОНКУРСЕ</span>
          <h2>
            {comp.title ? comp.title.split("«")[1]?.replace("»", "") || comp.title : "Autumn in London"}
          </h2>
          <div className="intro-copy">
            <p>{comp.aboutText}</p>
            <p>{comp.noticeText}</p>
          </div>
          <div className="trust-row">
            <div>
              <Globe2 className="w-5 h-5 text-blue-600 mb-2" />
              <strong>Международный диплом</strong>
              <span>На официальном бланке за подписью экспертного совета</span>
            </div>
            <div>
              <Award className="w-5 h-5 text-blue-600 mb-2" />
              <strong>Экспертная оценка</strong>
              <span>Профильное жюри из Лондона и ведущих театров</span>
            </div>
            <div>
              <ShieldCheck className="w-5 h-5 text-blue-600 mb-2" />
              <strong>Официальный статус</strong>
              <span>При поддержке комитетов культуры и образования</span>
            </div>
          </div>
        </div>
      </section>

      {/* Rules and Regulations Section */}
      <section className="rules-section section-grid" id="rules">
        <div className="rules-header">
          <span className="eyebrow">ОФИЦИАЛЬНАЯ ИНФОРМАЦИЯ</span>
          <h2>Положение конкурса</h2>
          <p className="text-slate-600 text-sm mt-2 max-w-2xl">
            Все разделы положения сохранены в полном объёме с действующего сайта. Выберите интересующий подраздел:
          </p>
        </div>

        <div className="rules-container">
          <div className="rules-tabs">
            {comp.rulesSections?.map((section: any) => (
              <button
                key={section.id}
                onClick={() => setActiveRuleTab(section.id)}
                className={`rules-tab-btn ${activeRuleTab === section.id ? "active" : ""}`}
              >
                {section.title}
              </button>
            ))}
          </div>

          <div className="rules-content-card">
            {activeSection && (
              <>
                <h3>{activeSection.title}</h3>
                <div className="rules-text-body">
                  {activeSection.content.split("\n").map((par: string, idx: number) => (
                    <p key={idx}>{par}</p>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Disciplines Section */}
      <section className="directions section-grid" id="genres">
        <div className="directions-header">
          <span className="eyebrow">НОМИНАЦИИ</span>
          <h2>Искусство говорит на разных языках.</h2>
        </div>
        <div className="discipline-photo">
          <img src={ASSETS.disciplines} alt="Предметы искусства" />
          <div className="photo-caption">10 конкурсных направлений</div>
        </div>
        <div className="genre-list">
          {GENRES.slice(0, 5).map((g, idx) => (
            <div key={idx} className="genre-item">
              <span className="genre-index">{`0${idx + 1}`}</span>
              <span className="genre-icon"><Sparkles className="w-4 h-4 text-blue-600" /></span>
              <div className="genre-copy">
                <h3>{g.split("(")[0]}</h3>
                <p>{g.includes("(") ? `(${g.split("(")[1]}` : "Все исполнительские формы"}</p>
              </div>
              <span className="genre-arrow">↗</span>
            </div>
          ))}
        </div>
      </section>

      {/* Results Section */}
      <section className="results-section section-grid" id="results">
        <div className="results-header">
          <span className="eyebrow">ИТОГИ И РЕЗУЛЬТАТЫ</span>
          <h2>Результаты конкурсов</h2>
          <p className="text-slate-600 text-sm mt-2">
            Результаты публикуются на сайте artzvezda.com и в официальной группе ВКонтакте, а персональные дипломы направляются участникам на почту.
          </p>
        </div>

        <div className="results-grid">
          {comp.results?.map((res: any, idx: number) => (
            <div key={idx} className="result-card">
              <span className="result-date">Дата публикации: {res.publishedDate}</span>
              <h3>{res.title}</h3>
              <p>{res.description}</p>
              <div className="result-links">
                {res.vkUrl && (
                  <a href={res.vkUrl} target="_blank" rel="noreferrer" className="button button-ghost text-xs">
                    Группа ВКонтакте <ExternalLink className="w-3.5 h-3.5 inline ml-1" />
                  </a>
                )}
                <a href="#apply" className="button button-primary text-xs">
                  Подать заявку на следующий сезон
                </a>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Application Form */}
      <section className="apply-section section-grid" id="apply">
        <div>
          <span className="eyebrow">ОФИЦИАЛЬНАЯ РЕГИСТРАЦИЯ</span>
          <h2>Заявка на конкурс</h2>
          <p className="text-slate-600 text-sm mt-3 leading-relaxed">
            Заполните форму участия. После нажатия «Отправить и оплатить» данные безопасно сохраняются в системе, а вы переходите к оплате организационного взноса.
          </p>
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-2xl mt-6 text-xs text-blue-900 leading-relaxed">
            <strong>Организационный взнос: {comp.priceDiscount || 1300} ₽</strong>
            <p className="mt-1">Для подтверждения льготного участия (790 ₽) напишите на hello@artzvezda.com.</p>
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
            <label className="flex items-start gap-2 text-xs text-slate-600">
              <input
                type="checkbox"
                required
                checked={formData.agreedToPolicy}
                onChange={(e) => setFormData({ ...formData, agreedToPolicy: e.target.checked })}
                className="mt-0.5 rounded text-blue-600"
              />
              <span>
                Согласие на обработку персональных данных в соответствии с политикой безопасности
              </span>
            </label>
            <Button type="submit" disabled={submitting} className="button button-primary w-full mt-3">
              {submitting ? "Сохранение заявки..." : "Отправить и оплатить →"}
            </Button>
          </div>
        </form>
      </section>

      {/* FAQ Section */}
      <section className="faq section-grid" id="faq">
        <div>
          <span className="eyebrow">ОТВЕТЫ РЯДОМ</span>
          <h2>Частые вопросы</h2>
          <p className="text-slate-600 text-sm mt-3">
            Вся актуальная информация о сроках, жюри и дипломах:
          </p>
        </div>
        <div className="faq-list">
          {comp.faqs?.map((faq: any, idx: number) => (
            <div key={idx} className="faq-item">
              <button
                type="button"
                onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                aria-expanded={openFaq === idx}
              >
                <span>{faq.question}</span>
                <ChevronDown className={`w-4 h-4 transition-transform ${openFaq === idx ? "rotate-180" : ""}`} />
              </button>
              {openFaq === idx && <p>{faq.answer}</p>}
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-top">
          <Logo />
          <a href="#apply" className="button button-primary">Подать заявку</a>
        </div>
        <div className="footer-main">
          <p>Конкурс, где юный талант получает право звучать громче.</p>
          <div className="footer-links">
            <a href="mailto:hello@artzvezda.com">hello@artzvezda.com</a>
            <a href="tel:+78126002123">+7 (812) 600-21-23</a>
          </div>
          <div className="footer-links">
            <a href="https://vk.com/triumph_org" target="_blank" rel="noreferrer">ВКонтакте</a>
            <a href="https://t.me/TO_Triumph" target="_blank" rel="noreferrer">Telegram</a>
            <a href="/admin">Панель управления</a>
          </div>
        </div>
        <div className="footer-bottom">
          <span>© 2026 ART ЗВЕЗДА</span>
          <span>Творческое объединение «Триумф»</span>
          <a href="#top">Наверх ↑</a>
        </div>
      </footer>
    </div>
  );
}
