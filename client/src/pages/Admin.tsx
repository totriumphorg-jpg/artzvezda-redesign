import { useEffect, useState } from "react";
import { Link } from "wouter";
import {
  FileSpreadsheet,
  Settings,
  BookOpen,
  Trophy,
  CreditCard,
  LogOut,
  ExternalLink,
  RefreshCw,
  Search,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const OFFICIAL_LOGO = "/manus-storage/triumph-official_aaece090.svg";

export default function Admin() {
  const [auth, setAuth] = useState(false);
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"competition" | "rules" | "applications" | "results" | "paykeeper">("competition");
  const [competition, setCompetition] = useState<any>(null);
  const [applications, setApplications] = useState<any[]>([]);
  const [genreFilter, setGenreFilter] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const checkAuth = async () => {
    try {
      const res = await fetch("/api/admin/applications");
      if (res.ok) {
        setAuth(true);
        loadData();
      } else {
        setAuth(false);
      }
    } catch {
      setAuth(false);
    } finally {
      setLoading(false);
    }
  };

  const loadData = async () => {
    try {
      const [compRes, appsRes] = await Promise.all([
        fetch("/api/competition"),
        fetch("/api/admin/applications"),
      ]);
      if (compRes.ok) {
        const c = await compRes.json();
        setCompetition(c);
      }
      if (appsRes.ok) {
        const a = await appsRes.json();
        setApplications(a);
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Неверный пароль");
      toast.success("Вход выполнен успешно");
      setAuth(true);
      loadData();
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  const handleLogout = async () => {
    await fetch("/api/admin/logout", { method: "POST" });
    setAuth(false);
    toast.success("Сессия завершена");
  };

  const handleSaveCompetition = async (updated: any) => {
    try {
      const res = await fetch("/api/admin/competition", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updated),
      });
      if (!res.ok) throw new Error("Не удалось сохранить");
      toast.success("Данные конкурса успешно обновлены");
      loadData();
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  const updateAppStatus = async (id: number, status: string) => {
    try {
      const res = await fetch(`/api/admin/applications/${id}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (!res.ok) throw new Error("Ошибка обновления");
      toast.success("Статус заявки обновлён");
      loadData();
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  if (loading) {
    return (
      <div className="p-16 text-center text-[#123e80] font-bold text-lg">
        Загрузка панели управления...
      </div>
    );
  }

  if (!auth) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <form onSubmit={handleLogin} className="bg-white p-10 rounded-3xl shadow-2xl w-full max-w-lg border border-slate-200">
          <div className="flex items-center gap-4 mb-8">
            <img src={OFFICIAL_LOGO} alt="Творческое объединение Триумф" className="h-12 w-auto max-w-[210px] object-contain" />
            <div>
              <h1 className="text-2xl font-black text-[#123e80]">Управление ART Звезда</h1>
              <p className="text-sm font-semibold text-[#1d4f98]">Официальная панель оргкомитета конкурса</p>
            </div>
          </div>
          <label className="block text-sm font-extrabold text-[#123e80] uppercase tracking-wider mb-2.5">
            Пароль администратора
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Введите пароль доступа"
            className="w-full px-4 py-3.5 rounded-xl border-2 border-slate-200 mb-6 focus:outline-none focus:border-blue-600 text-base text-[#123e80]"
          />
          <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-extrabold py-4 rounded-xl text-base shadow-lg shadow-blue-600/30">
            Войти в систему
          </Button>
          <div className="mt-6 text-center">
            <Link href="/" className="text-sm font-bold text-blue-700 hover:underline">
              ← Вернуться на публичный сайт
            </Link>
          </div>
        </form>
      </div>
    );
  }

  const filteredApps = applications.filter((app) => {
    const matchesGenre = !genreFilter || app.genre === genreFilter;
    const matchesSearch =
      !searchQuery ||
      app.participantName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.phone?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.nomination?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesGenre && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-slate-100/80 flex flex-col font-sans text-[#123e80]">
      <header className="bg-white border-b border-slate-200 px-8 py-5 flex items-center justify-between sticky top-0 z-30 shadow-xs">
        <div className="flex items-center gap-4">
          <Link href="/" className="font-black text-xl tracking-tight text-[#123e80] flex items-center gap-3">
            <img src={OFFICIAL_LOGO} alt="Творческое объединение Триумф" className="h-9 w-auto max-w-[150px] object-contain" />
            <span>ART Звезда</span>
          </Link>
          <span className="text-xs bg-emerald-100 text-emerald-900 font-extrabold px-3 py-1 rounded-full border border-emerald-300">
            Панель оргкомитета · Сезон 2026
          </span>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/" target="_blank" className="text-sm text-indigo-900 hover:text-blue-700 flex items-center gap-1.5 font-bold">
            Открыть сайт <ExternalLink className="w-4 h-4" />
          </Link>
          <Button variant="outline" size="sm" onClick={handleLogout} className="text-sm font-bold gap-2 text-[#123e80] border-slate-300">
            <LogOut className="w-4 h-4" /> Выйти
          </Button>
        </div>
      </header>

      <div className="flex-1 max-w-7xl w-full mx-auto p-8 grid grid-cols-1 md:grid-cols-4 gap-8">
        <aside className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-sm flex flex-col gap-1.5 h-fit">
          <button
            onClick={() => setActiveTab("competition")}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-extrabold text-left transition-colors ${
              activeTab === "competition" ? "bg-blue-600 text-white shadow-md shadow-blue-500/20" : "text-[#1b4a91] hover:bg-slate-100"
            }`}
          >
            <Settings className="w-4 h-4" /> Текущий конкурс и даты
          </button>
          <button
            onClick={() => setActiveTab("rules")}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-extrabold text-left transition-colors ${
              activeTab === "rules" ? "bg-blue-600 text-white shadow-md shadow-blue-500/20" : "text-[#1b4a91] hover:bg-slate-100"
            }`}
          >
            <BookOpen className="w-4 h-4" /> Положение и номинации
          </button>
          <button
            onClick={() => setActiveTab("applications")}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-extrabold text-left transition-colors ${
              activeTab === "applications" ? "bg-blue-600 text-white shadow-md shadow-blue-500/20" : "text-[#1b4a91] hover:bg-slate-100"
            }`}
          >
            <FileSpreadsheet className="w-4 h-4" /> Заявки и CSV ({applications.length})
          </button>
          <button
            onClick={() => setActiveTab("results")}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-extrabold text-left transition-colors ${
              activeTab === "results" ? "bg-blue-600 text-white shadow-md shadow-blue-500/20" : "text-[#1b4a91] hover:bg-slate-100"
            }`}
          >
            <Trophy className="w-4 h-4" /> Итоги и результаты
          </button>
          <button
            onClick={() => setActiveTab("paykeeper")}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-extrabold text-left transition-colors ${
              activeTab === "paykeeper" ? "bg-blue-600 text-white shadow-md shadow-blue-500/20" : "text-[#1b4a91] hover:bg-slate-100"
            }`}
          >
            <CreditCard className="w-4 h-4" /> Оплата PayKeeper
          </button>
        </aside>

        <main className="md:col-span-3">
          {competition && activeTab === "competition" && (
            <div className="bg-white p-8 rounded-3xl border border-slate-200/90 shadow-sm flex flex-col gap-6">
              <div className="flex items-center justify-between border-b pb-4">
                <div>
                  <h2 className="text-xl font-black text-[#123e80]">Текущий конкурс и первый экран</h2>
                  <p className="text-sm font-medium text-[#1d4f98] mt-1">Все изменения отображаются на главной странице</p>
                </div>
                <Button onClick={() => handleSaveCompetition(competition)} className="bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-sm px-6 py-2.5">
                  Сохранить
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="text-sm font-bold text-[#123e80] block mb-1.5">Код / Лейбл сезона</label>
                  <input
                    type="text"
                    value={competition.seasonBadge || ""}
                    onChange={(e) => setCompetition({ ...competition, seasonBadge: e.target.value })}
                    className="w-full text-sm font-medium px-4 py-2.5 border rounded-xl focus:border-blue-600 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-sm font-bold text-[#123e80] block mb-1.5">Название текущего конкурса</label>
                  <input
                    type="text"
                    value={competition.title || ""}
                    onChange={(e) => setCompetition({ ...competition, title: e.target.value })}
                    className="w-full text-sm font-medium px-4 py-2.5 border rounded-xl focus:border-blue-600 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-sm font-bold text-[#123e80] block mb-1.5">Дата начала приёма</label>
                  <input
                    type="date"
                    value={competition.startDate || ""}
                    onChange={(e) => setCompetition({ ...competition, startDate: e.target.value })}
                    className="w-full text-sm font-medium px-4 py-2.5 border rounded-xl focus:border-blue-600 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-sm font-bold text-[#123e80] block mb-1.5">Дата окончания приёма</label>
                  <input
                    type="date"
                    value={competition.endDate || ""}
                    onChange={(e) => setCompetition({ ...competition, endDate: e.target.value })}
                    className="w-full text-sm font-medium px-4 py-2.5 border rounded-xl focus:border-blue-600 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-sm font-bold text-[#123e80] block mb-1.5">Стоимость взноса (руб.)</label>
                  <input
                    type="number"
                    value={competition.priceDiscount || 1300}
                    onChange={(e) => setCompetition({ ...competition, priceDiscount: Number(e.target.value) })}
                    className="w-full text-sm font-medium px-4 py-2.5 border rounded-xl focus:border-blue-600 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-sm font-bold text-[#123e80] block mb-1.5">Льготная стоимость (руб.)</label>
                  <input
                    type="number"
                    value={competition.priceReduced || 790}
                    onChange={(e) => setCompetition({ ...competition, priceReduced: Number(e.target.value) })}
                    className="w-full text-sm font-medium px-4 py-2.5 border rounded-xl focus:border-blue-600 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-sm font-bold text-[#123e80] block mb-1.5">Ссылка на баннер первого экрана</label>
                <input
                  type="text"
                  value={competition.bannerUrl || ""}
                  onChange={(e) => setCompetition({ ...competition, bannerUrl: e.target.value })}
                  className="w-full text-sm font-medium px-4 py-2.5 border rounded-xl focus:border-blue-600 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-sm font-bold text-[#123e80] block mb-1.5">Текст раздела «О конкурсе»</label>
                <textarea
                  rows={4}
                  value={competition.aboutText || ""}
                  onChange={(e) => setCompetition({ ...competition, aboutText: e.target.value })}
                  className="w-full text-sm font-medium p-3.5 border rounded-xl focus:border-blue-600 focus:outline-none leading-relaxed"
                />
              </div>

              <div>
                <label className="text-sm font-bold text-[#123e80] block mb-1.5">Важное примечание / гранты</label>
                <input
                  type="text"
                  value={competition.noticeText || ""}
                  onChange={(e) => setCompetition({ ...competition, noticeText: e.target.value })}
                  className="w-full text-sm font-medium px-4 py-2.5 border rounded-xl focus:border-blue-600 focus:outline-none"
                />
              </div>
            </div>
          )}

          {competition && activeTab === "rules" && (
            <div className="bg-white p-8 rounded-3xl border border-slate-200/90 shadow-sm flex flex-col gap-6">
              <div className="flex items-center justify-between border-b pb-4">
                <div>
                  <h2 className="text-xl font-black text-[#123e80]">Разделы положения</h2>
                  <p className="text-sm font-medium text-[#1d4f98] mt-1">Кликабельные подразделы положения конкурса</p>
                </div>
                <Button onClick={() => handleSaveCompetition(competition)} className="bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-sm px-6 py-2.5">
                  Сохранить положение
                </Button>
              </div>

              <div className="flex flex-col gap-5">
                {competition.rulesSections?.map((section: any, idx: number) => (
                  <div key={section.id || idx} className="p-5 rounded-2xl border border-slate-200 bg-slate-50/70 flex flex-col gap-3">
                    <div className="flex items-center justify-between">
                      <input
                        type="text"
                        value={section.title}
                        onChange={(e) => {
                          const updated = [...competition.rulesSections];
                          updated[idx].title = e.target.value;
                          setCompetition({ ...competition, rulesSections: updated });
                        }}
                        className="text-base font-extrabold text-[#123e80] bg-transparent border-b border-transparent hover:border-slate-300 focus:border-blue-600 px-1 py-1 w-full"
                      />
                    </div>
                    <textarea
                      rows={3}
                      value={section.content}
                      onChange={(e) => {
                        const updated = [...competition.rulesSections];
                        updated[idx].content = e.target.value;
                        setCompetition({ ...competition, rulesSections: updated });
                      }}
                      className="w-full text-sm font-medium p-3 border rounded-xl bg-white focus:border-blue-600 focus:outline-none"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "applications" && (
            <div className="bg-white p-8 rounded-3xl border border-slate-200/90 shadow-sm flex flex-col gap-6">
              <div className="flex items-center justify-between border-b pb-4 flex-wrap gap-4">
                <div>
                  <h2 className="text-xl font-black text-[#123e80]">Заявки участников</h2>
                  <p className="text-sm font-medium text-[#1d4f98] mt-1">Все отправленные формы и выгрузка в CSV для оргкомитета</p>
                </div>
                <div className="flex items-center gap-3">
                  <a
                    href={`/api/admin/applications/export.csv${genreFilter ? `?genre=${encodeURIComponent(genreFilter)}` : ""}`}
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-extrabold shadow-sm transition-colors"
                  >
                    <FileSpreadsheet className="w-4 h-4" /> Загрузить в CSV
                  </a>
                  <Button variant="outline" size="sm" onClick={loadData} className="text-sm font-bold">
                    <RefreshCw className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              <div className="flex items-center gap-4 flex-wrap">
                <div className="flex items-center gap-2 flex-1 min-w-[240px]">
                  <Search className="w-4 h-4 text-[#3a6cb2]" />
                  <input
                    type="text"
                    placeholder="Поиск по ФИО, email, телефону..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full text-sm font-medium border rounded-xl px-3.5 py-2 bg-white focus:outline-none focus:border-blue-600"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-[#123e80]">Жанр:</span>
                  <select
                    value={genreFilter}
                    onChange={(e) => setGenreFilter(e.target.value)}
                    className="text-sm font-medium border rounded-xl px-3 py-2 bg-white focus:outline-none focus:border-blue-600"
                  >
                    <option value="">Все жанры</option>
                    {Array.from(new Set(applications.map((a) => a.genre))).filter(Boolean).map((g) => (
                      <option key={g} value={g}>
                        {g}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {filteredApps.length === 0 ? (
                <div className="text-center py-16 text-[#285aa5] text-base font-semibold">
                  Заявок по выбранным критериям не найдено
                </div>
              ) : (
                <div className="overflow-x-auto rounded-2xl border border-slate-200">
                  <table className="w-full text-left text-sm border-collapse">
                    <thead>
                      <tr className="border-b bg-slate-50/90 text-[#123e80] font-extrabold">
                        <th className="p-3.5">ID</th>
                        <th className="p-3.5">Участник / Коллектив</th>
                        <th className="p-3.5">Жанр / Номинация</th>
                        <th className="p-3.5">Контакты</th>
                        <th className="p-3.5">Сумма</th>
                        <th className="p-3.5">Статус</th>
                        <th className="p-3.5">Действия</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                      {filteredApps.map((app) => (
                        <tr key={app.id} className="hover:bg-slate-50/60 transition-colors">
                          <td className="p-3.5 font-bold text-[#123e80]">{app.id}</td>
                          <td className="p-3.5">
                            <div className="font-extrabold text-[#123e80]">{app.participantName}</div>
                            <div className="text-xs text-[#285aa5] mt-0.5">{app.performanceTitle || "Без названия"}</div>
                          </td>
                          <td className="p-3.5">
                            <div className="font-semibold text-[#123e80]">{app.genre}</div>
                            <div className="text-xs text-[#285aa5] mt-0.5">{app.nomination}</div>
                          </td>
                          <td className="p-3.5">
                            <div className="font-semibold text-[#123e80]">{app.email}</div>
                            <div className="text-xs text-[#285aa5] mt-0.5">{app.phone}</div>
                          </td>
                          <td className="p-3.5 font-bold text-[#123e80]">{app.paymentAmount} ₽</td>
                          <td className="p-3.5">
                            <span
                              className={`px-3 py-1 rounded-full text-xs font-extrabold ${
                                app.status === "paid"
                                  ? "bg-emerald-100 text-emerald-900 border border-emerald-300"
                                  : app.status === "pending_payment"
                                  ? "bg-amber-100 text-amber-900 border border-amber-300"
                                  : "bg-slate-200 text-[#1b4a91]"
                              }`}
                            >
                              {app.status === "paid" ? "Оплачено" : app.status === "pending_payment" ? "Ожидает оплаты" : app.status}
                            </span>
                          </td>
                          <td className="p-3.5">
                            {app.status !== "paid" ? (
                              <button
                                onClick={() => updateAppStatus(app.id, "paid")}
                                className="text-xs text-blue-700 hover:text-blue-900 font-extrabold underline"
                              >
                                Отметить оплату
                              </button>
                            ) : (
                              <span className="text-emerald-700 text-xs font-bold">Подтверждена</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {competition && activeTab === "results" && (
            <div className="bg-white p-8 rounded-3xl border border-slate-200/90 shadow-sm flex flex-col gap-6">
              <div className="flex items-center justify-between border-b pb-4">
                <div>
                  <h2 className="text-xl font-black text-[#123e80]">Итоги конкурса</h2>
                  <p className="text-sm font-medium text-[#1d4f98] mt-1">Результаты публикуются на сайте artzvezda.com и в группе ВКонтакте</p>
                </div>
                <Button onClick={() => handleSaveCompetition(competition)} className="bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-sm px-6 py-2.5">
                  Сохранить итоги
                </Button>
              </div>

              {competition.results?.map((res: any, idx: number) => (
                <div key={idx} className="p-6 rounded-2xl border bg-slate-50/70 flex flex-col gap-4">
                  <div>
                    <label className="text-sm font-bold text-[#123e80] block mb-1.5">Заголовок релиза</label>
                    <input
                      type="text"
                      value={res.title}
                      onChange={(e) => {
                        const updated = [...competition.results];
                        updated[idx].title = e.target.value;
                        setCompetition({ ...competition, results: updated });
                      }}
                      className="w-full text-sm font-medium px-4 py-2.5 border rounded-xl bg-white focus:border-blue-600 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-bold text-[#123e80] block mb-1.5">Описание и статус протоколов</label>
                    <textarea
                      rows={2}
                      value={res.description}
                      onChange={(e) => {
                        const updated = [...competition.results];
                        updated[idx].description = e.target.value;
                        setCompetition({ ...competition, results: updated });
                      }}
                      className="w-full text-sm font-medium p-3 border rounded-xl bg-white focus:border-blue-600 focus:outline-none"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-bold text-[#123e80] block mb-1.5">Дата публикации</label>
                      <input
                        type="date"
                        value={res.publishedDate}
                        onChange={(e) => {
                          const updated = [...competition.results];
                          updated[idx].publishedDate = e.target.value;
                          setCompetition({ ...competition, results: updated });
                        }}
                        className="w-full text-sm font-medium px-4 py-2.5 border rounded-xl bg-white focus:border-blue-600 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-bold text-[#123e80] block mb-1.5">Ссылка на группу VK</label>
                      <input
                        type="text"
                        value={res.vkUrl || ""}
                        onChange={(e) => {
                          const updated = [...competition.results];
                          updated[idx].vkUrl = e.target.value;
                          setCompetition({ ...competition, results: updated });
                        }}
                        className="w-full text-sm font-medium px-4 py-2.5 border rounded-xl bg-white focus:border-blue-600 focus:outline-none"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {competition && activeTab === "paykeeper" && (
            <div className="bg-white p-8 rounded-3xl border border-slate-200/90 shadow-sm flex flex-col gap-6">
              <div className="flex items-center justify-between border-b pb-4">
                <div>
                  <h2 className="text-xl font-black text-[#123e80]">Интеграция с PayKeeper</h2>
                  <p className="text-sm font-medium text-[#1d4f98] mt-1">
                    Подключение личного кабинета эквайринга ART Звезда (и поддержка ARTCODE)
                  </p>
                </div>
                <Button onClick={() => handleSaveCompetition(competition)} className="bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-sm px-6 py-2.5">
                  Сохранить настройки
                </Button>
              </div>

              <div className="p-5 rounded-2xl bg-blue-50/80 border border-blue-200 text-sm text-[#123e80] leading-relaxed">
                <strong className="text-blue-900 block mb-1">URL для POST-оповещений в личном кабинете PayKeeper:</strong>
                <div className="font-mono bg-white p-3 rounded-xl border border-blue-200 select-all font-semibold">
                  https://artzvezda.com/api/paykeeper/callback
                </div>
                <p className="mt-3 text-xs text-[#1d4f98] leading-normal">
                  В личном кабинете PayKeeper в разделе «Получение информации о платежах» выберите «POST-оповещения», укажите этот URL и скопируйте секретный ключ.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="text-sm font-bold text-[#123e80] block mb-1.5">Адрес платёжного шлюза PayKeeper</label>
                  <input
                    type="text"
                    placeholder="https://triumph.paykeeper.ru"
                    value={competition.paykeeper?.serverUrl || ""}
                    onChange={(e) =>
                      setCompetition({
                        ...competition,
                        paykeeper: { ...competition.paykeeper, serverUrl: e.target.value },
                      })
                    }
                    className="w-full text-sm font-medium px-4 py-2.5 border rounded-xl focus:border-blue-600 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-sm font-bold text-[#123e80] block mb-1.5">Секретный ключ подписи</label>
                  <input
                    type="password"
                    placeholder="Секретное слово из PayKeeper"
                    value={competition.paykeeper?.secretKey || ""}
                    onChange={(e) =>
                      setCompetition({
                        ...competition,
                        paykeeper: { ...competition.paykeeper, secretKey: e.target.value },
                      })
                    }
                    className="w-full text-sm font-medium px-4 py-2.5 border rounded-xl focus:border-blue-600 focus:outline-none"
                  />
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
