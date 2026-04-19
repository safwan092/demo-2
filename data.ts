import { useMemo, useState } from "react";
import { Avatar, Badge, Icon, Modal, toast } from "./ui";
import { Worker, clients, workers as initialWorkers } from "../data";

const filters = [
  { key: "all", label: "الكل" },
  { key: "مقيمة", label: "مقيمة" },
  { key: "ساعية", label: "ساعية" },
  { key: "available", label: "متاحة" },
  { key: "busy", label: "مشغولة" },
];

export function Workers() {
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [checkInWorker, setCheckInWorker] = useState<Worker | null>(null);
  const [historyWorker, setHistoryWorker] = useState<Worker | null>(null);
  const [checkOutWorker, setCheckOutWorker] = useState<Worker | null>(null);
  const [selectedClient, setSelectedClient] = useState<string>(clients[0].id);

  const list = useMemo(() => {
    return initialWorkers.filter((w) => {
      if (search && !w.name.includes(search) && !w.nationalId.includes(search)) return false;
      if (filter === "all") return true;
      if (filter === "مقيمة" || filter === "ساعية") return w.service === filter;
      if (filter === "available") return w.status === "available" || w.status === "office";
      if (filter === "busy") return w.status === "active" || w.status === "delayed";
      return true;
    });
  }, [filter, search]);

  return (
    <div className="space-y-5 fade-in-up">
      {/* Search + filters */}
      <div className="soft-card p-4 flex flex-col lg:flex-row gap-3 items-stretch lg:items-center">
        <div className="flex-1 flex items-center gap-2 bg-slate-100 rounded-xl px-3 py-2.5">
          <Icon name="search" className="w-4 h-4 text-slate-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="بحث عن عاملة بالاسم أو رقم الهوية..."
            className="bg-transparent outline-none text-sm flex-1 placeholder:text-slate-400 font-bold"
          />
        </div>
        <div className="flex items-center gap-1.5 overflow-x-auto">
          {filters.map((f) => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition ${
                filter === f.key
                  ? "btn-primary"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
        <button className="btn-gold rounded-xl px-4 py-2.5 text-xs flex items-center gap-1.5">
          <Icon name="plus" className="w-4 h-4" />
          إضافة عاملة
        </button>
      </div>

      {/* Workers grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {list.map((w, i) => {
          const ringColor =
            w.status === "active"
              ? "#10b981"
              : w.status === "delayed"
              ? "#ef4444"
              : w.status === "office"
              ? "#0ea5e9"
              : "#94a3b8";
          const statusBadge = (() => {
            if (w.status === "active")
              return <Badge tone="green">● نشطة</Badge>;
            if (w.status === "delayed")
              return <Badge tone="red">● متأخرة</Badge>;
            if (w.status === "office")
              return <Badge tone="blue">● في المقر</Badge>;
            return <Badge tone="gray">○ متاحة</Badge>;
          })();
          return (
            <div
              key={w.id}
              className="soft-card p-4 hover:-translate-y-0.5 hover:shadow-xl transition fade-in-up"
              style={{ animationDelay: `${i * 40}ms` }}
            >
              <div className="flex items-start gap-3 mb-3">
                <Avatar name={w.name} size={56} ringColor={ringColor} />
                <div className="flex-1 min-w-0">
                  <div className="font-extrabold text-brand-600 truncate">{w.name}</div>
                  <div className="text-[11px] text-slate-500 tick">{w.nationalId}</div>
                  <div className="mt-1.5 flex items-center gap-1.5">
                    <Badge tone={w.service === "مقيمة" ? "purple" : "amber"}>{w.service}</Badge>
                    {statusBadge}
                  </div>
                </div>
              </div>

              <div className="bg-slate-50 rounded-xl p-3 mb-3 min-h-[64px]">
                <div className="text-[10px] font-bold text-slate-400 mb-1">الحالة الحالية</div>
                <div className="text-xs font-bold text-slate-700">
                  {w.currentClient ? (
                    <>
                      عند <span className="text-brand-600">{w.currentClient}</span>{" "}
                      <span className="text-slate-500">— {w.since}</span>
                    </>
                  ) : w.status === "office" ? (
                    "متواجدة في المقر"
                  ) : (
                    <span className="text-emerald-600">متاحة للتوزيع</span>
                  )}
                </div>
                <div className="mt-2 flex items-center justify-between text-[11px]">
                  <span className="text-slate-500">ساعات هذا الشهر</span>
                  <span className="font-extrabold text-brand-600 tick">
                    {w.monthlyHours.toLocaleString("ar-EG")} س
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-1.5 mb-1.5">
                <button
                  onClick={() => setCheckInWorker(w)}
                  className="btn-primary rounded-xl py-2.5 text-xs font-extrabold flex items-center justify-center gap-1"
                >
                  <Icon name="login" className="w-4 h-4" />
                  تسجيل حضور
                </button>
                <button
                  onClick={() => setCheckOutWorker(w)}
                  className="rounded-xl py-2.5 text-xs font-extrabold border border-slate-200 text-slate-700 hover:bg-slate-50 flex items-center justify-center gap-1"
                >
                  <Icon name="logout" className="w-4 h-4" />
                  انصراف
                </button>
              </div>
              <button
                onClick={() => setHistoryWorker(w)}
                className="w-full rounded-xl py-2 text-xs font-bold text-brand-600 bg-brand-50 hover:bg-brand-100 flex items-center justify-center gap-1"
              >
                <Icon name="history" className="w-4 h-4" />
                عرض السجل
              </button>
            </div>
          );
        })}
      </div>

      {/* Check-in modal */}
      <Modal
        open={!!checkInWorker}
        onClose={() => setCheckInWorker(null)}
        title={`تسجيل حضور — ${checkInWorker?.name || ""}`}
      >
        {checkInWorker && (
          <div className="space-y-4">
            <div className="flex items-center gap-3 p-3 bg-brand-50 rounded-xl">
              <Avatar name={checkInWorker.name} size={50} ringColor="#10b981" />
              <div>
                <div className="font-extrabold text-brand-600">{checkInWorker.name}</div>
                <div className="text-[11px] text-slate-500 tick">{checkInWorker.nationalId}</div>
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1.5">اختر العميل</label>
              <select
                value={selectedClient}
                onChange={(e) => setSelectedClient(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm font-bold focus:ring-2 focus:ring-brand-500 outline-none"
              >
                {clients.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.family} — {c.area}
                  </option>
                ))}
              </select>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1.5">التاريخ</label>
                <input
                  readOnly
                  value={new Date().toLocaleDateString("ar-SA-u-nu-arab")}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm font-bold"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1.5">الوقت</label>
                <input
                  readOnly
                  value={new Date().toLocaleTimeString("ar-SA-u-nu-arab", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm font-bold"
                />
              </div>
            </div>
            <div className="flex gap-2 pt-2">
              <button
                onClick={() => setCheckInWorker(null)}
                className="flex-1 py-2.5 rounded-xl border border-slate-200 font-bold text-slate-600 hover:bg-slate-50"
              >
                إلغاء
              </button>
              <button
                onClick={() => {
                  const c = clients.find((x) => x.id === selectedClient)!;
                  toast({
                    type: "success",
                    title: "تم تسجيل الحضور",
                    desc: `${checkInWorker.name} عند ${c.family}`,
                  });
                  setCheckInWorker(null);
                }}
                className="flex-1 btn-primary py-2.5 rounded-xl font-bold"
              >
                تأكيد التسجيل
              </button>
            </div>
          </div>
        )}
      </Modal>

      {/* Check-out modal */}
      <Modal
        open={!!checkOutWorker}
        onClose={() => setCheckOutWorker(null)}
        title={`تسجيل انصراف — ${checkOutWorker?.name || ""}`}
      >
        {checkOutWorker && (
          <div className="space-y-4">
            <div className="bg-emerald-50 rounded-xl p-4 text-center">
              <div className="text-xs font-bold text-emerald-700 mb-1">مدة العمل</div>
              <div className="text-3xl font-extrabold text-emerald-600">
                ٦ ساعات و ٣٠ دقيقة
              </div>
              <div className="text-[11px] text-emerald-600 mt-1">
                ٠٨:٠٠ ص — ٠٢:٣٠ م
              </div>
            </div>
            <div className="flex items-center justify-between bg-slate-50 rounded-xl p-3">
              <span className="text-xs font-bold text-slate-600">إجمالي الساعات الشهرية</span>
              <span className="text-lg font-extrabold text-brand-600 tick">
                {(checkOutWorker.monthlyHours + 6.5).toLocaleString("ar-EG")} س
              </span>
            </div>
            <div className="flex gap-2 pt-2">
              <button
                onClick={() => setCheckOutWorker(null)}
                className="flex-1 py-2.5 rounded-xl border border-slate-200 font-bold text-slate-600"
              >
                إلغاء
              </button>
              <button
                onClick={() => {
                  toast({
                    type: "success",
                    title: "تم تسجيل الانصراف",
                    desc: `تمت إضافة ٦ ساعات و ٣٠ دقيقة لسجل ${checkOutWorker.name}`,
                  });
                  setCheckOutWorker(null);
                }}
                className="flex-1 btn-primary py-2.5 rounded-xl font-bold"
              >
                تأكيد الانصراف
              </button>
            </div>
          </div>
        )}
      </Modal>

      {/* History modal */}
      <Modal
        open={!!historyWorker}
        onClose={() => setHistoryWorker(null)}
        title={`سجل العاملة — ${historyWorker?.name || ""}`}
        size="lg"
      >
        {historyWorker && (
          <div className="space-y-2 max-h-[60vh] overflow-y-auto">
            {[
              { date: "اليوم — ٠٨:٠٠", action: "تسجيل حضور", client: historyWorker.currentClient || "عائلة الغامدي", tone: "green" as const },
              { date: "أمس — ١٧:٤٥", action: "تسجيل انصراف", client: "عائلة العتيبي — ٨ ساعات", tone: "blue" as const },
              { date: "أمس — ٠٩:٠٠", action: "تسجيل حضور", client: "عائلة العتيبي", tone: "green" as const },
              { date: "قبل ٣ أيام", action: "تجديد إقامة", client: "إقامة سارية حتى ٢٠٢٧/٠٣", tone: "amber" as const },
              { date: "قبل أسبوع", action: "تقييم العميل", client: "⭐⭐⭐⭐⭐ ممتاز من عائلة الغامدي", tone: "amber" as const },
              { date: "الشهر الماضي", action: "بداية عقد جديد", client: "عقد سنوي مع عائلة الغامدي", tone: "blue" as const },
            ].map((h, i) => (
              <div key={i} className="flex gap-3 p-3 rounded-xl border border-slate-100">
                <Badge tone={h.tone}>{h.action}</Badge>
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-bold text-slate-700 truncate">{h.client}</div>
                  <div className="text-[10px] text-slate-400 mt-0.5">{h.date}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </Modal>
    </div>
  );
}
