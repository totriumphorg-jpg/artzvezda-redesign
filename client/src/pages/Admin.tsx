import { useState, useEffect } from "react";
import { Link } from "wouter";
import {
  Calendar,
  FileSpreadsheet,
  Settings,
  BookOpen,
  Trophy,
  CreditCard,
  LogOut,
  RefreshCw,
  Plus,
  Trash2,
  CheckCircle,
  ExternalLink,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function AdminPage() {
  const [auth, setAuth] = useState(false);
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"competition" | "rules" | "applications" | "results" | "paykeeper">("competition");

  const [competition, setCompetition] = useState<any>(null);
  const [applications, setApplications] = useState<any[]>([]);
  const [genreFilter, setGenreFilter] = useState<string>("");

  useEffect(() => {
    fetch("/api/admin/check")
      .then((r) => r.json())
      .then((res) => {
        setAuth(res.authenticated);
        setLoading(false);
        if (res.authenticated) loadData();
      })
      .catch(() => setLoading(false));
  }, []);

  const loadData = () => {
    fetch("/api/admin/competition")
      .then((r) => r.json())
      .then((data) => setCompetition(data))
      .catch(() => toast.error("Не удалось загрузить данные конкурса"));

    fetch("/api/admin/applications")
      .then((r) => r.json())
      .then((data) => setApplications(data))
      .catch(() => toast.error("Не удалось загрузить заявки"));
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });
    if (res.ok) {
      setAuth(true);
      toast.success("Вход выполнен");
      loadData();
    } else {
      toast.error("Неверный пароль администратора");
    }
  };

  const handleLogout = async () => {
    await fetch("/api/admin/logout", { method: "POST" });
    setAuth(false);
    toast.info("Вы вышли из системы");
  };

  const handleSaveCompetition = async (updatedData: any) => {
    const res = await fetch("/api/admin/competition", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedData),
    });
    if (res.ok) {
      toast.success("Изменения сохранены и обновлены на сайте");
      loadData();
    } else {
      toast.error("Ошибка сохранения данных");
    }
  };

  const updateAppStatus = async (id: number, status: string) => {
    const res = await fetch(`/api/admin/applications/${id}/status`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    if (res.ok) {
      toast.success("Статус заявки обновлён");
      loadData();
    }
  };

  if (loading) {
    return <div className="p-12 text-center text-slate-600">Загрузка панели управления...</div>;
  }

  if (!auth) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <form onSubmit={handleLogin} className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md border border-slate-200">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold">AZ</div>
            <div>
              <h1 className="text-xl font-black text-slate-900">Управление ART Звезда</h1>
              <p className="text-xs text-slate-500">Панель администратора конкурса</p>
            </div>
          </div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Пароль доступа</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Введите пароль администратора"
            className="w-full px-4 py-3 rounded-xl border border-slate-200 mb-5 focus:outline-none focus:ring-2 focus:ring-blue-600 text-sm"
          />
          <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl">
            Войти в панель
          </Button>
          <div className="mt-4 text-center">
            <Link href="/" className="text-xs text-slate-500 hover:text-blue-600">
              ← Вернуться на сайт
            </Link>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-sans">
      <header className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between sticky top-0 z-30">
        <div className="flex items-center gap-4">
          <Link href="/" className="font-black text-lg tracking-tight text-slate-900 flex items-center gap-2">
            <span className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center text-xs">AZ</span>
            ART Звезда
          </Link>
          <span className="text-xs bg-emerald-100 text-emerald-800 font-bold px-2.5 py-1 rounded-full">Панель конкурса</span>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/" target="_blank" className="text-xs text-slate-600 hover:text-blue-600 flex items-center gap-1 font-semibold">
            Открыть сайт <ExternalLink className="w-3.5 h-3.5" />
          </Link>
          <Button variant="outline" size="sm" onClick={handleLogout} className="text-xs font-semibold gap-1.5">
            <LogOut className="w-3.5 h-3.5" /> Выйти
          </Button>
        </div>
      </header>

      <div className="flex-1 max-w-7xl w-full mx-auto p-6 grid grid-cols-1 md:grid-cols-4 gap-6">
        <aside className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm flex flex-col gap-1 h-fit">
          <button
            onClick={() => setActiveTab("competition")}
            className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-bold text-left transition-colors ${
              activeTab === "competition" ? "bg-blue-600 text-white" : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            <Settings className="w-4 h-4" /> Текущий конкурс и даты
          </button>
          <button
            onClick={() => setActiveTab("rules")}
            className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-bold text-left transition-colors ${
              activeTab === "rules" ? "bg-blue-600 text-white" : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            <BookOpen className="w-4 h-4" /> Положение и номинации
          </button>
          <button
            onClick={() => setActiveTab("applications")}
            className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-bold text-left transition-colors ${
              activeTab === "applications" ? "bg-blue-600 text-white" : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            <FileSpreadsheet className="w-4 h-4" /> Заявки и CSV ({applications.length})
          </button>
          <button
            onClick={() => setActiveTab("results")}
            className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-bold text-left transition-colors ${
              activeTab === "results" ? "bg-blue-600 text-white" : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            <Trophy className="w-4 h-4" /> Итоги и результаты
          </button>
          <button
            onClick={() => setActiveTab("paykeeper")}
            className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-bold text-left transition-colors ${
              activeTab === "paykeeper" ? "bg-blue-600 text-white" : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            <CreditCard className="w-4 h-4" /> Оплата PayKeeper
          </button>
        </aside>

        <main className="md:col-span-3">
          {competition && activeTab === "competition" && (
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col gap-5">
              <div className="flex items-center justify-between border-b pb-4">
                <div>
                  <h2 className="text-lg font-black text-slate-900">Текущий конкурс и первый экран</h2>
                  <p className="text-xs text-slate-500">Название, баннер и даты сразу меняются на главной странице</p>
                </div>
                <Button onClick={() => handleSaveCompetition(competition)} className="bg-blue-600 text-white font-bold text-xs">
                  Сохранить
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Код / Лейбл сезона</label>
                  <input
                    type="text"
                    value={competition.seasonBadge || ""}
                    onChange={(e) => setCompetition({ ...competition, seasonBadge: e.target.value })}
                    className="w-full text-xs px-3 py-2 border rounded-lg"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Название текущего конкурса</label>
                  <input
                    type="text"
                    value={competition.title || ""}
                    onChange={(e) => setCompetition({ ...competition, title: e.target.value })}
                    className="w-full text-xs px-3 py-2 border rounded-lg"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Дата начала</label>
                  <input
                    type="date"
                    value={competition.startDate || ""}
                    onChange={(e) => setCompetition({ ...competition, startDate: e.target.value })}
                    className="w-full text-xs px-3 py-2 border rounded-lg"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Дата окончания приёма заявок</label>
                  <input
                    type="date"
                    value={competition.endDate || ""}
                    onChange={(e) => setCompetition({ ...competition, endDate: e.target.value })}
                    className="w-full text-xs px-3 py-2 border rounded-lg"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Стоимость взноса (руб.)</label>
                  <input
                    type="number"
                    value={competition.priceDiscount || 1300}
                    onChange={(e) => setCompetition({ ...competition, priceDiscount: Number(e.target.value) })}
                    className="w-full text-xs px-3 py-2 border rounded-lg"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Льготная стоимость (руб.)</label>
                  <input
                    type="number"
                    value={competition.priceReduced || 790}
                    onChange={(e) => setCompetition({ ...competition, priceReduced: Number(e.target.value) })}
                    className="w-full text-xs px-3 py-2 border rounded-lg"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Ссылка на баннер / фото первого экрана</label>
                <input
                  type="text"
                  value={competition.bannerUrl || ""}
                  onChange={(e) => setCompetition({ ...competition, bannerUrl: e.target.value })}
                  className="w-full text-xs px-3 py-2 border rounded-lg"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Текст раздела «О конкурсе»</label>
                <textarea
                  rows={4}
                  value={competition.aboutText || ""}
                  onChange={(e) => setCompetition({ ...competition, aboutText: e.target.value })}
                  className="w-full text-xs p-3 border rounded-lg leading-relaxed"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Важное примечание / спецприз</label>
                <input
                  type="text"
                  value={competition.noticeText || ""}
                  onChange={(e) => setCompetition({ ...competition, noticeText: e.target.value })}
                  className="w-full text-xs px-3 py-2 border rounded-lg"
                />
              </div>
            </div>
          )}

          {competition && activeTab === "rules" && (
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col gap-5">
              <div className="flex items-center justify-between border-b pb-4">
                <div>
                  <h2 className="text-lg font-black text-slate-900">Разделы положения</h2>
                  <p className="text-xs text-slate-500">Кликабельные подразделы с полным текстом как на старом сайте</p>
                </div>
                <Button onClick={() => handleSaveCompetition(competition)} className="bg-blue-600 text-white font-bold text-xs">
                  Сохранить положение
                </Button>
              </div>

              <div className="flex flex-col gap-4">
                {competition.rulesSections?.map((section: any, idx: number) => (
                  <div key={section.id || idx} className="p-4 rounded-xl border border-slate-200 bg-slate-50 flex flex-col gap-2">
                    <div className="flex items-center justify-between">
                      <input
                        type="text"
                        value={section.title}
                        onChange={(e) => {
                          const updated = [...competition.rulesSections];
                          updated[idx].title = e.target.value;
                          setCompetition({ ...competition, rulesSections: updated });
                        }}
                        className="text-xs font-black text-slate-900 bg-transparent border-b border-transparent hover:border-slate-300 focus:border-blue-600 px-1 py-0.5"
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
                      className="w-full text-xs p-2.5 border rounded-lg bg-white"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "applications" && (
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col gap-5">
              <div className="flex items-center justify-between border-b pb-4">
                <div>
                  <h2 className="text-lg font-black text-slate-900">Заявки участников</h2>
                  <p className="text-xs text-slate-500">Все отправленные формы с сайта и выгрузка в CSV для оргкомитета</p>
                </div>
                <div className="flex items-center gap-2">
                  <a
                    href={`/api/admin/applications/export.csv${genreFilter ? `?genre=${encodeURIComponent(genreFilter)}` : ""}`}
                    className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-colors"
                  >
                    <FileSpreadsheet className="w-3.5 h-3.5" /> Загрузить в CSV
                  </a>
                  <Button variant="outline" size="sm" onClick={loadData} className="text-xs">
                    <RefreshCw className="w-3.5 h-3.5" />
                  </Button>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-xs font-bold text-slate-600">Фильтр по жанру:</span>
                <select
                  value={genreFilter}
                  onChange={(e) => setGenreFilter(e.target.value)}
                  className="text-xs border rounded-lg px-2.5 py-1.5 bg-white"
                >
                  <option value="">Все жанры</option>
                  {Array.from(new Set(applications.map((a) => a.genre))).filter(Boolean).map((g) => (
                    <option key={g} value={g}>
                      {g}
                    </option>
                  ))}
                </select>
              </div>

              {applications.length === 0 ? (
                <div className="text-center py-12 text-slate-500 text-xs">Новых заявок пока нет</div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="border-b bg-slate-50 text-slate-600 font-bold">
                        <th className="p-2.5">ID</th>
                        <th className="p-2.5">Участник / Коллектив</th>
                        <th className="p-2.5">Жанр / Номинация</th>
                        <th className="p-2.5">Контакты</th>
                        <th className="p-2.5">Сумма</th>
                        <th className="p-2.5">Статус</th>
                        <th className="p-2.5">Действия</th>
                      </tr>
                    </thead>
                    <tbody>
                      {applications
                        .filter((a) => !genreFilter || a.genre === genreFilter)
                        .map((app) => (
                          <tr key={app.id} className="border-b hover:bg-slate-50/50">
                            <td className="p-2.5 font-bold text-slate-800">{app.id}</td>
                            <td className="p-2.5">
                              <div className="font-bold text-slate-900">{app.participantName}</div>
                              <div className="text-[11px] text-slate-500">{app.performanceTitle || "Без названия номера"}</div>
                            </td>
                            <td className="p-2.5">
                              <div>{app.genre}</div>
                              <div className="text-[11px] text-slate-500">{app.nomination}</div>
                            </td>
                            <td className="p-2.5">
                              <div>{app.email}</div>
                              <div className="text-[11px] text-slate-500">{app.phone}</div>
                            </td>
                            <td className="p-2.5 font-semibold">{app.paymentAmount} ₽</td>
                            <td className="p-2.5">
                              <span
                                className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                  app.status === "paid"
                                    ? "bg-emerald-100 text-emerald-800"
                                    : app.status === "pending_payment"
                                    ? "bg-amber-100 text-amber-800"
                                    : "bg-slate-200 text-slate-700"
                                }`}
                              >
                                {app.status === "paid" ? "Оплачено" : app.status === "pending_payment" ? "Ожидает оплаты" : app.status}
                              </span>
                            </td>
                            <td className="p-2.5">
                              {app.status !== "paid" ? (
                                <button
                                  onClick={() => updateAppStatus(app.id, "paid")}
                                  className="text-[11px] text-blue-600 hover:underline font-bold"
                                >
                                  Отметить оплату
                                </button>
                              ) : (
                                <span className="text-emerald-600 text-[11px] font-bold">Подтверждена</span>
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
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col gap-5">
              <div className="flex items-center justify-between border-b pb-4">
                <div>
                  <h2 className="text-lg font-black text-slate-900">Итоги конкурса</h2>
                  <p className="text-xs text-slate-500">Результаты публикуются на сайте artzvezda.com и в группе ВКонтакте</p>
                </div>
                <Button onClick={() => handleSaveCompetition(competition)} className="bg-blue-600 text-white font-bold text-xs">
                  Сохранить итоги
                </Button>
              </div>

              {competition.results?.map((res: any, idx: number) => (
                <div key={idx} className="p-4 rounded-xl border bg-slate-50 flex flex-col gap-3">
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">Заголовок релиза</label>
                    <input
                      type="text"
                      value={res.title}
                      onChange={(e) => {
                        const updated = [...competition.results];
                        updated[idx].title = e.target.value;
                        setCompetition({ ...competition, results: updated });
                      }}
                      className="w-full text-xs px-3 py-2 border rounded-lg bg-white"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">Описание и статус протоколов</label>
                    <textarea
                      rows={2}
                      value={res.description}
                      onChange={(e) => {
                        const updated = [...competition.results];
                        updated[idx].description = e.target.value;
                        setCompetition({ ...competition, results: updated });
                      }}
                      className="w-full text-xs p-2.5 border rounded-lg bg-white"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-bold text-slate-700 block mb-1">Дата публикации</label>
                      <input
                        type="date"
                        value={res.publishedDate}
                        onChange={(e) => {
                          const updated = [...competition.results];
                          updated[idx].publishedDate = e.target.value;
                          setCompetition({ ...competition, results: updated });
                        }}
                        className="w-full text-xs px-3 py-2 border rounded-lg bg-white"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-slate-700 block mb-1">Ссылка на группу VK</label>
                      <input
                        type="text"
                        value={res.vkUrl || ""}
                        onChange={(e) => {
                          const updated = [...competition.results];
                          updated[idx].vkUrl = e.target.value;
                          setCompetition({ ...competition, results: updated });
                        }}
                        className="w-full text-xs px-3 py-2 border rounded-lg bg-white"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {competition && activeTab === "paykeeper" && (
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col gap-5">
              <div className="flex items-center justify-between border-b pb-4">
                <div>
                  <h2 className="text-lg font-black text-slate-900">Интеграция с PayKeeper</h2>
                  <p className="text-xs text-slate-500">
                    Подключение личного кабинета эквайринга ART Звезда (и поддержка ARTCODE)
                  </p>
                </div>
                <Button onClick={() => handleSaveCompetition(competition)} className="bg-blue-600 text-white font-bold text-xs">
                  Сохранить настройки
                </Button>
              </div>

              <div className="p-4 rounded-xl bg-blue-50 border border-blue-200 text-xs text-blue-900 leading-relaxed">
                <strong>URL для POST-оповещений в личном кабинете PayKeeper:</strong>
                <div className="mt-1 font-mono bg-white p-2 rounded border border-blue-200 select-all">
                  https://artzvezda.com/api/paykeeper/callback
                </div>
                <p className="mt-2 text-[11px] text-blue-800">
                  В личном кабинете PayKeeper в разделе «Получение информации о платежах» выберите «POST-оповещения», укажите этот URL и скопируйте секретный ключ.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Адрес платёжного шлюза PayKeeper</label>
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
                    className="w-full text-xs px-3 py-2 border rounded-lg"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Секретный ключ подписи</label>
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
                    className="w-full text-xs px-3 py-2 border rounded-lg"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Назначение платежа</label>
                <input
                  type="text"
                  value={competition.paykeeper?.serviceName || ""}
                  onChange={(e) =>
                    setCompetition({
                      ...competition,
                      paykeeper: { ...competition.paykeeper, serviceName: e.target.value },
                    })
                  }
                  className="w-full text-xs px-3 py-2 border rounded-lg"
                />
              </div>

              <div className="flex items-center gap-3 pt-2">
                <input
                  type="checkbox"
                  id="paykeeperEnabled"
                  checked={Boolean(competition.paykeeper?.enabled)}
                  onChange={(e) =>
                    setCompetition({
                      ...competition,
                      paykeeper: { ...competition.paykeeper, enabled: e.target.checked },
                    })
                  }
                  className="rounded text-blue-600"
                />
                <label htmlFor="paykeeperEnabled" className="text-xs font-bold text-slate-800">
                  Перенаправлять участников на реальную оплату через PayKeeper
                </label>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
