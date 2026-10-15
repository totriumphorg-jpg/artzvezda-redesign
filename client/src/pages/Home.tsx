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
            <a href="#genres">Номинации</a>
            <a href="#results">Итоги</a>
            <a href="#faq">Вопросы</a>
            <a href="/admin" className="text-[#3a6cb2] hover:text-blue-700 transition-colors">Вход оргкомитета</a>
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
              <div className="trust-icon-wrap icon-blue">
                <Globe2 className="w-5 h-5" />
              </div>
              <strong>Международный диплом</strong>
              <span>На официальном гербовом бланке за подписью экспертного совета</span>
            </div>
            <div className="trust-card">
              <div className="trust-icon-wrap icon-purple">
                <Award className="w-5 h-5" />
              </div>
              <strong>Экспертная оценка</strong>
              <span>Профильное жюри из Лондона и ведущих театров страны</span>
            </div>
            <div className="trust-card">
              <div className="trust-icon-wrap icon-coral">
                <ShieldCheck className="w-5 h-5" />
              </div>
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
            <div>
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

            <div className="rules-footer-note">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-blue-600" />
                <span>Официальная редакция регламента ТО «Триумф» · 2026 г.</span>
              </div>
              <a href="#faq" className="text-blue-700 hover:underline">
                Частые вопросы по регламенту →
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Disciplines Section */}
      <section className="directions section-grid" id="genres">
        <div className="directions-header">
          <span className="eyebrow">НОМИНАЦИИ</span>
          <h2>Искусство говорит <span className="gradient-text italic font-serif">на разных языках</span>.</h2>
        </div>
        <div className="discipline-photo">
          <img src={ASSETS.disciplines} alt="Предметы искусства" />
          <div className="photo-caption">10 конкурсных направлений</div>
        </div>
        <div className="genre-list">
          {GENRES.slice(0, 5).map((g, idx) => (
            <div key={idx} className="genre-item">
              <span className="genre-index">{`0${idx + 1}`}</span>
              <span className={`genre-icon-badge badge-${idx + 1}`}>
                {idx === 0 && <Sparkles className="w-4 h-4" />}
                {idx === 1 && <Music2 className="w-4 h-4" />}
                {idx === 2 && <Award className="w-4 h-4" />}
                {idx === 3 && <Palette className="w-4 h-4" />}
                {idx === 4 && <Theater className="w-4 h-4" />}
              </span>
              <div className="genre-copy">
                <h3>{g.split("(")[0]}</h3>
                <p>{g.includes("(") ? `(${g.split("(")[1]}` : "Все исполнительские формы"}</p>
              </div>
              <span className="genre-arrow">↗</span>
            </div>
          ))}
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

        <div className="results-grid-wide">
          {comp.results?.map((res: any, idx: number) => (
            <div key={idx} className="result-card-wide">
              <div className="result-card-info">
                <span className="result-date-badge">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Дата публикации: {res.publishedDate}
                </span>
                <h3>{res.title}</h3>
                <p>{res.description}</p>
              </div>

              <div className="result-card-actions">
                <div className="result-status-pill">
                  <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                  <span>Протоколы жюри утверждены и разосланы</span>
                </div>
                <div className="result-links-wide">
                  {res.vkUrl && (
                    <a href={res.vkUrl} target="_blank" rel="noreferrer" className="button button-ghost text-xs">
                      Группа ВКонтакте <ExternalLink className="w-3.5 h-3.5 inline ml-1.5" />
                    </a>
                  )}
                  <a href="#apply" className="button button-primary text-xs">
                    Подать заявку на сезон
                  </a>
                </div>
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
          <p className="mt-3 leading-relaxed">
            Заполните форму участия. После нажатия «Отправить и оплатить» данные безопасно сохраняются в системе, а вы переходите к оплате организационного взноса.
          </p>
          <div className="fee-highlight-card mt-6">
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
                <a href="/admin" className="social-badge admin-link">
                  Панель управления
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
