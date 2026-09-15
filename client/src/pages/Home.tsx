import { useEffect, useState } from "react";
import {
  ArrowDownRight,
  ArrowRight,
  Award,
  Check,
  ChevronDown,
  CirclePlay,
  Clock3,
  Menu,
  Music2,
  Palette,
  Sparkles,
  Star,
  Theater,
  UsersRound,
  X,
} from "lucide-react";

const genres = [
  { icon: Music2, title: "Музыка", text: "Вокал, инструментальное исполнительство, авторская песня" },
  { icon: Sparkles, title: "Танец", text: "Классика, contemporary, народный и эстрадный танец" },
  { icon: Theater, title: "Сцена", text: "Театр, художественное слово, цирковое искусство" },
  { icon: Palette, title: "Визуальное искусство", text: "Живопись, графика, фото, костюм и дизайн" },
];

const benefits = [
  "Диплом международного образца на английском языке",
  "Экспертная оценка от профильного жюри",
  "Благодарность для руководителя коллектива",
  "Шанс получить грант на очный проект «Триумфа»",
];

const faqs = [
  ["Кто может участвовать?", "Солисты, дуэты, малые формы, коллективы и творческие объединения. Возраст участников — от 4 лет; работы оцениваются в своей возрастной группе."],
  ["Какой формат работы принимается?", "Принимаются видеозаписи живых выступлений, а также работы в визуальных номинациях. Подробные технические требования будут доступны в положении конкурса."],
  ["Когда будут результаты?", "Экспертный совет рассматривает работы после завершения приёма заявок. Статус и результаты публикуются в личном сообщении и на странице конкурса."],
  ["Можно ли заявить несколько работ?", "Да. Каждая конкурсная работа оформляется как отдельная заявка — так жюри сможет корректно оценить её в соответствующей номинации."],
];

function Logo() {
  return (
    <a href="#top" className="logo" aria-label="Триумф — на главную">
      <span className="logo-symbol" aria-hidden="true">
        <svg viewBox="0 0 52 38" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M2 20.4 46.8 1.5 34.2 17.1 50 14.5 25.5 36.5 29 23.1 2 20.4Z" fill="currentColor" />
          <path d="M15.1 18.8 26.4 15.1 22.8 20.6 36.2 18.9 26.8 26.3" stroke="white" strokeWidth="1.5" strokeLinejoin="round" />
        </svg>
      </span>
      <span className="logo-copy"><b>ТРИУМФ</b><small>творческое объединение</small></span>
    </a>
  );
}

function ScrollLink({ href, children, className = "", onClick }: { href: string; children: React.ReactNode; className?: string; onClick?: () => void }) {
  return <a className={className} href={href} onClick={onClick}>{children}</a>;
}

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [sent, setSent] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const closeMenu = () => setMenuOpen(false);
  const submit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSent(true);
  };

  return (
    <div id="top" className="site-shell">
      <header className={`site-header ${scrolled ? "is-scrolled" : ""}`}>
        <div className="header-inner">
          <Logo />
          <nav className="desktop-nav" aria-label="Основная навигация">
            <ScrollLink href="#about">О конкурсе</ScrollLink>
            <ScrollLink href="#directions">Номинации</ScrollLink>
            <ScrollLink href="#process">Как участвовать</ScrollLink>
            <ScrollLink href="#faq">Вопросы</ScrollLink>
          </nav>
          <a className="header-cta" href="#apply">Подать заявку <ArrowRight size={16} /></a>
          <button className="menu-button" aria-label={menuOpen ? "Закрыть меню" : "Открыть меню"} aria-expanded={menuOpen} onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <X size={23} /> : <Menu size={23} />}
          </button>
        </div>
        <div className={`mobile-menu ${menuOpen ? "open" : ""}`}>
          <ScrollLink href="#about" onClick={closeMenu}>О конкурсе</ScrollLink>
          <ScrollLink href="#directions" onClick={closeMenu}>Номинации</ScrollLink>
          <ScrollLink href="#process" onClick={closeMenu}>Как участвовать</ScrollLink>
          <ScrollLink href="#faq" onClick={closeMenu}>Вопросы</ScrollLink>
          <a className="button button-primary" href="#apply" onClick={closeMenu}>Подать заявку <ArrowRight size={17} /></a>
        </div>
      </header>

      <main>
        <section className="hero section-grid" aria-labelledby="hero-title">
          <div className="hero-bg" aria-hidden="true" />
          <div className="hero-orb orb-one" aria-hidden="true" />
          <div className="hero-orb orb-two" aria-hidden="true" />
          <div className="hero-content reveal">
            <div className="eyebrow"><span className="pulse-dot" /> Международный онлайн-конкурс</div>
            <h1 id="hero-title">Талант достоин<br /><em>большой сцены.</em></h1>
            <p className="hero-lead">Покажите свою работу профессиональному жюри — получите признание, диплом и следующий шаг в творческом пути.</p>
            <div className="hero-actions">
              <a className="button button-primary" href="#apply">Подать заявку <ArrowDownRight size={19} /></a>
              <a className="text-action" href="#about"><CirclePlay size={21} /> Узнать о конкурсе</a>
            </div>
            <div className="hero-details" aria-label="Детали конкурса">
              <div><span>Приём работ</span><strong>до 11 октября</strong></div>
              <div><span>Формат</span><strong>онлайн · из любой точки</strong></div>
            </div>
          </div>
          <div className="hero-image-wrap reveal delay-1">
            <img src="/manus-storage/artzvezda-hero_bbf6cdaa.jpg" alt="Молодые артисты выступают на сцене" className="hero-image" />
            <div className="hero-image-overlay" />
            <div className="hero-sticker sticker-a"><Star fill="currentColor" size={16} /> открываем таланты</div>
            <div className="hero-figure-card"><span>2026</span><strong>AUTUMN<br />IN LONDON</strong></div>
          </div>
          <a className="scroll-cue" href="#about" aria-label="Прокрутить к разделу о конкурсе"><span>Листайте, чтобы<br />увидеть больше</span><i /></a>
        </section>

        <section id="about" className="intro section-grid">
          <div className="intro-side reveal">
            <p className="section-kicker">Art Звезда / 2026</p>
            <div className="intro-number">01</div>
          </div>
          <div className="intro-main reveal delay-1">
            <p className="overline">Творчество, которое замечают</p>
            <h2>Не просто конкурс.<br /><em>Точка роста.</em></h2>
            <div className="intro-copy">
              <p>«Art Звезда» объединяет юных артистов, педагогов и руководителей, которым важно двигаться дальше. Здесь у каждой работы есть зритель, у каждого усилия — профессиональная обратная связь.</p>
              <p>Мы создали понятный онлайн-формат, чтобы талант не зависел от расстояния. Снимите выступление, отправьте заявку — и дайте своей истории прозвучать.</p>
            </div>
            <div className="trust-row">
              <div><Award size={21} /><span>Международный<br />диплом</span></div>
              <div><UsersRound size={21} /><span>Экспертное<br />жюри</span></div>
              <div><Clock3 size={21} /><span>Участие без<br />поездки</span></div>
            </div>
          </div>
        </section>

        <section id="directions" className="directions section-grid">
          <div className="directions-header reveal">
            <p className="section-kicker">Выберите своё направление</p>
            <h2>Искусство говорит<br /><em>на разных языках.</em></h2>
          </div>
          <div className="discipline-photo reveal delay-1">
            <img src="/manus-storage/artzvezda-disciplines_56bbac60.jpg" alt="Предметы, представляющие различные виды искусства" />
            <span className="photo-caption">ваша форма<br />выражения</span>
          </div>
          <div className="genre-list">
            {genres.map((genre, index) => {
              const Icon = genre.icon;
              return <article className={`genre-item reveal delay-${index + 1}`} key={genre.title}>
                <span className="genre-index">0{index + 1}</span>
                <Icon className="genre-icon" strokeWidth={1.65} />
                <div><h3>{genre.title}</h3><p>{genre.text}</p></div>
                <ArrowDownRight className="genre-arrow" size={20} />
              </article>;
            })}
          </div>
        </section>

        <section className="quote-section">
          <div className="quote-mark">“</div>
          <p className="reveal">Талант начинается<br />с <em>смелости</em> быть услышанным.</p>
          <span className="quote-spark spark-one">✦</span><span className="quote-spark spark-two">✦</span>
        </section>

        <section id="process" className="process section-grid">
          <div className="process-heading reveal"><p className="section-kicker">Всё просто и понятно</p><h2>Три шага<br /><em>к признанию.</em></h2></div>
          <div className="steps">
            <article className="step reveal delay-1"><div className="step-top"><span>01</span><ArrowDownRight size={22} /></div><h3>Выберите<br />номинацию</h3><p>Найдите подходящую категорию и убедитесь, что ваша работа соответствует требованиям.</p></article>
            <article className="step reveal delay-2"><div className="step-top"><span>02</span><ArrowDownRight size={22} /></div><h3>Отправьте<br />заявку</h3><p>Заполните короткую форму, добавьте ссылку на работу и завершите регистрацию.</p></article>
            <article className="step reveal delay-3"><div className="step-top"><span>03</span><Award size={22} /></div><h3>Получите<br />результат</h3><p>Дождитесь решения экспертного совета — диплом станет подтверждением вашего труда.</p></article>
          </div>
        </section>

        <section className="story section-grid">
          <div className="story-photo reveal"><img src="/manus-storage/artzvezda-story_0cc132bb.jpg" alt="Юные творческие участники за кулисами" /></div>
          <div className="story-content reveal delay-1">
            <p className="section-kicker">Для участников и наставников</p>
            <h2>Ваш труд<br />должен быть <em>виден.</em></h2>
            <p>За каждым выступлением — репетиции, поиск и вера педагога. Мы ценим этот путь и делаем его заметным: в честной оценке, документах, новых возможностях.</p>
            <ul>{benefits.map((benefit) => <li key={benefit}><Check size={18} />{benefit}</li>)}</ul>
            <a className="text-action dark-action" href="#apply">Присоединиться к конкурсу <ArrowRight size={18} /></a>
          </div>
        </section>

        <section id="apply" className="apply-section section-grid">
          <div className="apply-top reveal"><p className="section-kicker">Приём заявок открыт</p><h2>Пусть вашу работу<br /><em>увидят.</em></h2></div>
          <div className="apply-card reveal delay-1">
            {sent ? (
              <div className="success-state"><span><Check size={22} /></span><h3>Спасибо — это начало.</h3><p>Предварительная заявка принята. Координатор «Триумфа» свяжется с вами, чтобы подсказать следующий шаг.</p><button className="button button-secondary" onClick={() => setSent(false)}>Отправить ещё одну</button></div>
            ) : (
              <form onSubmit={submit}>
                <div className="form-head"><span>Заполните за 2 минуты</span><span>01 / 01</span></div>
                <div className="form-grid">
                  <label>Ваше имя<input required name="name" placeholder="Как к вам обращаться" /></label>
                  <label>Телефон или e-mail<input required name="contact" placeholder="Для связи с вами" /></label>
                  <label className="field-full">Кто вы?<select name="role" defaultValue=""><option value="" disabled>Выберите вариант</option><option>Участник</option><option>Родитель</option><option>Педагог / руководитель</option></select></label>
                </div>
                <div className="form-bottom"><p>Нажимая «Начать заявку», вы соглашаетесь на обработку персональных данных.</p><button className="button button-primary" type="submit">Начать заявку <ArrowRight size={18} /></button></div>
              </form>
            )}
          </div>
        </section>

        <section id="faq" className="faq section-grid">
          <div className="faq-heading reveal"><p className="section-kicker">Ответы рядом</p><h2>Остались<br /><em>вопросы?</em></h2><a href="mailto:hello@artzvezda.com" className="faq-mail">hello@artzvezda.com <ArrowUpRightInline /></a></div>
          <div className="faq-list reveal delay-1">
            {faqs.map(([question, answer], index) => <article className={`faq-item ${openFaq === index ? "active" : ""}`} key={question}><button onClick={() => setOpenFaq(openFaq === index ? null : index)} aria-expanded={openFaq === index}><span>{question}</span><ChevronDown size={21} /></button><div className="faq-answer"><p>{answer}</p></div></article>)}
          </div>
        </section>
      </main>

      <footer className="footer">
        <div className="footer-top"><Logo /><a href="#apply" className="footer-apply">Подать заявку <ArrowRight size={18} /></a></div>
        <div className="footer-main"><p>Конкурс, где юный талант получает право звучать громче.</p><div><a href="mailto:hello@artzvezda.com">hello@artzvezda.com</a><a href="tel:+78126002123">+7 (812) 600-21-23</a></div><div><a href="https://vk.com/triumph_org" target="_blank" rel="noreferrer">ВКонтакте</a><a href="https://t.me/TO_Triumph" target="_blank" rel="noreferrer">Telegram</a></div></div>
        <div className="footer-bottom"><span>© 2026 ART ЗВЕЗДА</span><span>Творческое объединение «Триумф»</span><a href="#top">Наверх ↑</a></div>
      </footer>
    </div>
  );
}

function ArrowUpRightInline() {
  return <span aria-hidden="true">↗</span>;
}
