import { useState } from "react";
import { Avatar, Badge, Icon, Modal, toast } from "./ui";
import { Client, clients, workers } from "../data";

export function Clients() {
  const [renew, setRenew] = useState<Client | null>(null);
  const [reminder, setReminder] = useState<Client | null>(null);
  const [search, setSearch] = useState("");

  const filtered = clients.filter(
    (c) => !search || c.family.includes(search) || c.area.includes(search)
  );

  return (
    <div className="space-y-5 fade-in-up">
      <div className="soft-card p-4 flex flex-col lg:flex-row gap-3 items-stretch lg:items-center">
        <div className="flex-1 flex items-center gap-2 bg-slate-100 rounded-xl px-3 py-2.5">
          <Icon name="search" className="w-4 h-4 text-slate-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="بحث عن عميل بالاسم أو الحي..."
            className="bg-transparent outline-none text-sm flex-1 placeholder:text-slate-400 font-bold"
          />
        </div>
        <button className="btn-gold rounded-xl px-4 py-2.5 text-xs flex items-center gap-1.5">
          <Icon name="plus" className="w-4 h-4" />
          إضافة عميل جديد
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
        {filtered.map((c, i) => {
          const worker = c.workerId ? workers.find((w) => w.id === c.workerId) : null;
          const tone = c.daysLeft < 30 ? "red" : c.daysLeft < 60 ? "amber" : "green";
          const dayLabel = `ينتهي خلال ${c.daysLeft.toLocaleString("ar-EG")} ${
            c.daysLeft === 1 ? "يوم" : "يوم"
          }`;
          return (
            <div
              key={c.id}
              className="soft-card p-5 hover:-translate-y-0.5 hover:shadow-xl transition fade-in-up"
              style={{ animationDelay: `${i * 50}ms` }}
            >
              {/* Header */}
              <div className="flex items-start gap-3 mb-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-brand-600 to-brand-400 text-white flex items-center justify-center font-extrabold text-lg shrink-0">
                  {c.family.replace("عائلة ", "")[0]}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-extrabold text-brand-600 truncate">{c.family}</div>
                  <div className="text-[11px] text-slate-500 truncate">📍 {c.area}</div>
                  <div className="mt-1.5 flex items-center gap-1.5">
                    <Badge tone={c.service === "مقيمة" ? "purple" : "amber"}>{c.service}</Badge>
                    {c.paymentStatus === "late" && <Badge tone="red">دفعة متأخرة</Badge>}
                  </div>
                </div>
              </div>

              {/* Phone */}
              <div className="flex items-center gap-2 mb-3">
                <a
                  href={`tel:${c.phone}`}
                  className="flex-1 flex items-center gap-2 bg-slate-50 hover:bg-slate-100 rounded-xl px-3 py-2 text-xs font-bold text-slate-700"
                >
                  <Icon name="phone" className="w-4 h-4 text-brand-600" />
                  <span className="tick">{c.phone}</span>
                </a>
                <button
                  onClick={() =>
                    toast({ type: "success", title: "تم فتح واتساب", desc: c.phone })
                  }
                  className="w-9 h-9 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white flex items-center justify-center shrink-0"
                  title="واتساب"
                >
                  <Icon name="whatsapp" className="w-4 h-4" />
                </button>
              </div>

              {/* Assigned worker */}
              <div className="bg-slate-50 rounded-xl p-3 mb-3">
                <div className="text-[10px] font-bold text-slate-400 mb-1.5">العاملة المخصصة</div>
                {worker ? (
                  <div className="flex items-center gap-2">
                    <Avatar name={worker.name} size={32} />
                    <div className="flex-1">
                      <div className="text-xs font-extrabold text-slate-700">{worker.name}</div>
                      <div className="text-[10px] text-slate-500">{worker.service}</div>
                    </div>
                    <span className="w-2 h-2 bg-emerald-500 rounded-full pulse-dot" />
                  </div>
                ) : (
                  <div className="text-xs font-bold text-amber-600">— لم يتم التخصيص —</div>
                )}
              </div>

              {/* Contract countdown */}
              <div
                className={`rounded-xl p-3 mb-3 text-center ${
                  tone === "red"
                    ? "bg-rose-50"
                    : tone === "amber"
                    ? "bg-amber-50"
                    : "bg-emerald-50"
                }`}
              >
                <div className="text-[10px] font-bold text-slate-500 mb-1">
                  حالة العقد
                </div>
                <div
                  className={`text-base font-extrabold ${
                    tone === "red"
                      ? "text-rose-600"
                      : tone === "amber"
                      ? "text-amber-700"
                      : "text-emerald-700"
                  }`}
                >
                  {dayLabel}
                </div>
                <div className="text-[10px] text-slate-500 mt-1 tick">
                  ينتهي بتاريخ {c.contractEnd}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-1.5">
                <button
                  onClick={() => setRenew(c)}
                  className="btn-primary rounded-xl py-2.5 text-xs font-extrabold flex items-center justify-center gap-1"
                >
                  <Icon name="renew" className="w-4 h-4" />
                  تجديد العقد
                </button>
                <button
                  onClick={() => setReminder(c)}
                  className="rounded-xl py-2.5 text-xs font-extrabold border border-slate-200 hover:bg-slate-50 text-slate-700 flex items-center justify-center gap-1"
                >
                  <Icon name="send" className="w-4 h-4" />
                  إرسال تذكير
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Renew modal */}
      <Modal open={!!renew} onClose={() => setRenew(null)} title={`تجديد عقد — ${renew?.family || ""}`}>
        {renew && (
          <div className="space-y-4">
            <div className="bg-brand-50 rounded-xl p-4">
              <div className="text-xs font-bold text-slate-500 mb-1">العقد الحالي</div>
              <div className="font-extrabold text-brand-600 tick">
                {renew.contractStart} ← {renew.contractEnd}
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1.5">مدة التجديد</label>
              <select className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm font-bold focus:ring-2 focus:ring-brand-500 outline-none">
                <option>سنة كاملة (12 شهر)</option>
                <option>6 أشهر</option>
                <option>3 أشهر</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1.5">قيمة العقد الجديدة (ر.س)</label>
              <input
                defaultValue="18,000"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm font-bold focus:ring-2 focus:ring-brand-500 outline-none"
              />
            </div>
            <div className="flex gap-2 pt-2">
              <button
                onClick={() => setRenew(null)}
                className="flex-1 py-2.5 rounded-xl border border-slate-200 font-bold text-slate-600"
              >
                إلغاء
              </button>
              <button
                onClick={() => {
                  toast({
                    type: "success",
                    title: "تم تجديد العقد بنجاح",
                    desc: `${renew.family} — لمدة سنة كاملة`,
                  });
                  setRenew(null);
                }}
                className="flex-1 btn-primary py-2.5 rounded-xl font-bold"
              >
                تأكيد التجديد
              </button>
            </div>
          </div>
        )}
      </Modal>

      {/* Reminder modal */}
      <Modal
        open={!!reminder}
        onClose={() => setReminder(null)}
        title="إرسال تذكير عبر واتساب"
        size="md"
      >
        {reminder && (
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-600">
              <Icon name="whatsapp" className="w-4 h-4 text-emerald-500" />
              <span>المرسل إليه:</span>
              <span className="text-emerald-600 tick">{reminder.phone}</span>
            </div>
            <div className="bg-emerald-50 border-r-4 border-emerald-500 rounded-2xl p-4">
              <div className="text-xs font-bold text-emerald-700 mb-2">معاينة الرسالة:</div>
              <div className="text-sm font-bold text-slate-700 leading-relaxed">
                السلام عليكم {reminder.family.replace("عائلة ", "آل ")}،
                <br />
                <br />
                نود تذكيركم بأن عقد الخدمة المنزلية الخاص بكم سينتهي بتاريخ{" "}
                <span className="text-brand-600 tick">{reminder.contractEnd}</span> (خلال{" "}
                {reminder.daysLeft.toLocaleString("ar-EG")} يوم).
                <br />
                <br />
                يرجى التواصل معنا لتجديد العقد والاستمرار في تلقي خدماتنا المميزة.
                <br />
                <br />
                مع تحيات وكالة النخبة للخدمات المنزلية 🌟
              </div>
            </div>
            <div className="flex gap-2 pt-2">
              <button
                onClick={() => setReminder(null)}
                className="flex-1 py-2.5 rounded-xl border border-slate-200 font-bold text-slate-600"
              >
                إلغاء
              </button>
              <button
                onClick={() => {
                  toast({
                    type: "success",
                    title: "تم الإرسال بنجاح ✓",
                    desc: `وصلت الرسالة إلى ${reminder.family}`,
                  });
                  setReminder(null);
                }}
                className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white py-2.5 rounded-xl font-bold flex items-center justify-center gap-2"
              >
                <Icon name="send" className="w-4 h-4" />
                تأكيد الإرسال
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
