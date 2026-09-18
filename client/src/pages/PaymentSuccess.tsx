import { useLocation } from "wouter";
import { CheckCircle, ArrowLeft, Mail, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function PaymentSuccessPage() {
  const [location] = useLocation();
  const search = typeof window !== "undefined" ? window.location.search : "";
  const params = new URLSearchParams(search);
  const paymentId = params.get("paymentId") || "—";

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="bg-white p-8 md:p-10 rounded-3xl shadow-xl w-full max-w-lg border border-slate-200 text-center flex flex-col items-center">
        <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-6">
          <CheckCircle className="w-9 h-9" />
        </div>
        <span className="text-xs font-black uppercase tracking-widest text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full mb-3">
          Заявка зарегистрирована
        </span>
        <h1 className="text-2xl font-black text-slate-900 mb-2">Оплата принята</h1>
        <p className="text-sm text-slate-600 mb-6 leading-relaxed">
          Спасибо! Номер вашей заявки и платежа: <strong className="text-slate-900">№{paymentId}</strong>. На указанную электронную почту направлены подтверждение участия и официальный кассовый чек.
        </p>

        <div className="w-full bg-slate-50 rounded-2xl p-4 text-left border border-slate-200 mb-6 text-xs text-slate-600 flex flex-col gap-2.5">
          <div className="flex items-center gap-2">
            <Mail className="w-4 h-4 text-blue-600" />
            <span>Письмо с подтверждением сформировано</span>
          </div>
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-blue-600" />
            <span>Результаты придут на e-mail в течение 15 рабочих дней</span>
          </div>
        </div>

        <Button onClick={() => (window.location.href = "/")} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl gap-2">
          <ArrowLeft className="w-4 h-4" /> Вернуться на главную
        </Button>
      </div>
    </div>
  );
}
