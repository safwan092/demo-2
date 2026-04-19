import { useEffect, useMemo, useState } from "react";
import { Avatar, Badge, Counter, Icon, Modal, toast } from "./ui";
import { clients, todaysAssignments, workers } from "../data";

function timeAgo(date: Date) {
  const diffMin = Math.max(0, Math.round((Date.now() - date.getTime()) / 60000));
  if (diffMin < 1) return "الآن";
  if (diffMin < 60) return `منذ ${diffMin} دقيقة`;
  const h = Math.floor(diffMin / 60);
  const m = diffMin % 60;
  return `منذ ${h} ساعة${m ? ` و ${m} دقيقة` : ""}`;
}

interface PresenceEntry {
  workerId: string;
  at: number;
}

export function Dashboard() {
  const [presence, setPresence] = useState<PresenceEntry[]>(() => {
    try {
      const raw = localStorage.getItem("presence");
      if (raw) return JSON.parse(raw);
    } catch {}
    return [
      { workerId: "w6", at: Date.now() - 1000 * 60 * 35 },
      { workerId: "w3", at: Date.now() - 1000 * 60 * 12 },
      { workerId: "w7", at: Date.now() - 1000 * 60 * 90 },
    ];
  });
  const [presenceModal, setPresenceModal] = useState(false);
  const [selectedPresenceWorker, setSelectedPresenceWorker] = useState<string>("w3");
  const [, force] = useState(0);

  useEffect(() => {
    localStorage.setItem("presence", JSON.stringify(presence));
  }, [presence]);

  // Re-render every 30s to update relative times
  useEffect(() => {
    const t = setInterval(() => force((x) => x + 1), 30_000);
    return () => clearInterval(t);
  }, []);

  const stats = useMemo(
    () => ({
      total: workers.length + 16, // simulated agency total
      active: workers.filter((w) => w.status === "active").length + 14,
      clients: clients.length + 25,
      expiring: clients.filter((c) => c.daysLeft <= 30).length,
    }),
    []
  );

  const activeWorkers = workers.filter((w) => w.status === "active" || w.status === "delayed");
  const officeWorkers = workers.filter((w) => w.status === "office");

  const alerts = [
    {
      tone: "red" as const,
      icon: "🔴",
      title: "عاملة لم يُسجَّل خروجها",
      desc: "هديل عبدالله — منذ 4 ساعات و 15 دقيقة",
      action: "تواصل معها",
    },
    {
      tone: "amber" as const,
      icon: "🟡",
      title: "عقد عميل ينتهي قريباً",
      desc: "عائلة القحطاني — خلال 8 أيام",
      action: "تجديد العقد",
    },
    {
      tone: "amber" as const,
      icon: "🟡",
      title: "دفعة متأخرة",
      desc: "عائلة الشمري — متأخرة 12 يوم",
      action: "إرسال تذكير",
    },
    {
      tone: "green" as const,
      icon: "🟢",
      title: "تم تجديد عقد",
      desc: "عائلة العتيبي — تم التجديد لسنة كاملة",
      action: "عرض التفاصيل",
    },
  ];

  return (
    <div className="space-y-6 fade-in-up">
      {/* Stats row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="إجمالي العاملات"
          subtitle="Total Workers"
          value={stats.total}
          icon="users"
          color="brand"
          trend="+3 هذا الشهر"
        />
        <StatCard
          label="العاملات النشطات الآن"
          subtitle="Currently Active"
          value={stats.active}
          icon="check"
          color="emerald"
          trend="٧٥٪ من الإجمالي"
        />
        <StatCard
          label="عملاء هذا الشهر"
          subtitle="Active Clients"
          value={stats.clients}
          icon="client"
          color="gold"
          trend="+5 عملاء جدد"
        />
        <StatCard
          label="عقود تنتهي قريباً"
          subtitle="Expiring Soon"
          value={stats.expiring}
          icon="warning"
          color="rose"
          trend="تتطلب إجراءً"
          urgent
        />
      </div>

      {/* Presence widget */}
      <div className="soft-card p-5 flex flex-col lg:flex-row items-stretch lg:items-center gap-5">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full pulse-dot inline-block" />
            <h3 className="font-extrabold text-brand-600 text-lg">سجل تواجد العاملات في المقر</h3>
          </div>
          <p className="text-sm text-slate-500">
            تابع العاملات الموجودات حالياً في مقر الوكالة لحظة بلحظة
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-center px-5 py-3 bg-emerald-50 rounded-2xl">
            <div className="text-3xl font-extrabold text-emerald-600 tick">
              {(presence.length + officeWorkers.length).toLocaleString("ar-EG")}
            </div>
            <div className="text-[11px] text-emerald-700 font-bold mt-0.5">في المقر الآن</div>
          </div>
          <button
            onClick={() => setPresenceModal(true)}
            className="btn-gold rounded-xl px-5 py-3 font-extrabold text-sm flex items-center gap-2"
          >
            <Icon name="login" className="w-5 h-5" />
            تسجيل تواجد عاملة في المقر
          </button>
        </div>
      </div>

      {/* Presence list */}
      {(presence.length > 0 || officeWorkers.length > 0) && (
        <div className="soft-card p-4">
          <div className="flex items-center gap-2 mb-3">
            <Icon name="clock" className="w-4 h-4 text-emerald-500" />
            <span className="text-xs font-bold text-slate-500">آخر تسجيلات التواجد</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {[...officeWorkers.map((w) => ({ workerId: w.id, at: Date.now() - 1000 * 60 * 120 })), ...presence]
              .slice(0, 6)
              .map((p, i) => {
                const w = workers.find((x) => x.id === p.workerId);
                if (!w) return null;
                return (
                  <div
                    key={i}
                    className="flex items-center gap-3 p-3 bg-emerald-50/50 rounded-xl border border-emerald-100"
                  >
                    <Avatar name={w.name} size={42} ringColor="#10b981" />
                    <div className="flex-1 min-w-0">
                      <div className="font-bold text-sm text-slate-800 truncate">{w.name}</div>
                      <div className="text-[11px] text-slate-500">{timeAgo(new Date(p.at))}</div>
                    </div>
                    <span className="w-2 h-2 bg-emerald-500 rounded-full pulse-dot" />
                  </div>
                );
              })}
          </div>
        </div>
      )}

      {/* 3 columns */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Today's schedule */}
        <Panel
          title="جدول اليوم"
          subtitle="Today's Schedule"
          accent="brand"
          icon="calendar"
        >
          <div className="space-y-2">
            {todaysAssignments.map((a) => {
              const w = workers.find((x) => x.id === a.workerId)!;
              const c = clients.find((x) => x.id === a.clientId)!;
              const tone =
                a.status === "ongoing" ? "green" : a.status === "delayed" ? "red" : "amber";
              const label =
                a.status === "ongoing" ? "جارية" : a.status === "delayed" ? "متأخرة" : "مجدولة";
              return (
                <div
                  key={a.id}
                  className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 transition"
                >
                  <Avatar name={w.name} size={40} />
                  <div className="flex-1 min-w-0">
                    <div className="font-bold text-sm text-slate-800 truncate">{w.name}</div>
                    <div className="text-[11px] text-slate-500 truncate">{c.family}</div>
                  </div>
                  <div className="text-left">
                    <div className="text-xs font-bold text-brand-600 tick">
                      {a.start} - {a.end}
                    </div>
                    <Badge tone={tone} className="mt-1">
                      {label}
                    </Badge>
                  </div>
                </div>
              );
            })}
          </div>
        </Panel>

        {/* Active workers */}
        <Panel
          title="العاملات النشطات"
          subtitle="Live Locations"
          accent="emerald"
          icon="users"
        >
          <div className="space-y-2">
            {activeWorkers.map((w) => {
              const c = clients.find((x) => x.family === w.currentClient);
              return (
                <div
                  key={w.id}
                  className="flex items-center gap-3 p-3 rounded-xl border border-slate-100 hover:border-emerald-200 hover:bg-emerald-50/40 transition"
                >
                  <div className="relative">
                    <Avatar name={w.name} size={42} ringColor="#10b981" />
                    <span
                      className={`absolute -bottom-0.5 -left-0.5 w-3 h-3 rounded-full border-2 border-white ${
                        w.status === "delayed" ? "bg-rose-500" : "bg-emerald-500 pulse-dot"
                      }`}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-bold text-sm text-slate-800 truncate">{w.name}</div>
                    <div className="text-[11px] text-slate-500 truncate flex items-center gap-1">
                      📍 {c?.area || w.currentClient}
                    </div>
                  </div>
                  <div className="text-left">
                    <div className="text-[11px] text-slate-500">{w.since}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </Panel>

        {/* Alerts */}
        <Panel
          title="تنبيهات عاجلة"
          subtitle="Urgent Alerts"
          accent="rose"
          icon="bell"
          badge="٤"
        >
          <div className="space-y-2">
            {alerts.map((a, i) => (
              <div
                key={i}
                className="p-3 rounded-xl border border-slate-100 hover:shadow-md transition"
              >
                <div className="flex items-start gap-2">
                  <span className="text-lg leading-none">{a.icon}</span>
                  <div className="flex-1 min-w-0">
                    <div className="font-bold text-sm text-slate-800">{a.title}</div>
                    <div className="text-[11px] text-slate-500 mt-0.5">{a.desc}</div>
                  </div>
                </div>
                <button
                  onClick={() => toast({ type: "info", title: a.action, desc: "تم تنفيذ الإجراء" })}
                  className="mt-2 w-full text-[11px] font-bold text-brand-600 bg-brand-50 hover:bg-brand-100 rounded-lg py-1.5 transition"
                >
                  {a.action} ←
                </button>
              </div>
            ))}
          </div>
        </Panel>
      </div>

      {/* Presence Modal */}
      <Modal
        open={presenceModal}
        onClose={() => setPresenceModal(false)}
        title="تسجيل تواجد عاملة في المقر"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-600 mb-1.5">اختر العاملة</label>
            <select
              value={selectedPresenceWorker}
              onChange={(e) => setSelectedPresenceWorker(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm font-bold focus:ring-2 focus:ring-brand-500 outline-none"
            >
              {workers.map((w) => (
                <option key={w.id} value={w.id}>
                  {w.name} — {w.nationalId}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-600 mb-1.5">وقت التسجيل</label>
            <input
              type="text"
              readOnly
              value={new Date().toLocaleString("ar-SA-u-nu-arab")}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm font-bold"
            />
          </div>
          <div className="flex gap-2 pt-2">
            <button
              onClick={() => setPresenceModal(false)}
              className="flex-1 py-2.5 rounded-xl border border-slate-200 font-bold text-slate-600 hover:bg-slate-50"
            >
              إلغاء
            </button>
            <button
              onClick={() => {
                setPresence((p) => [{ workerId: selectedPresenceWorker, at: Date.now() }, ...p]);
                setPresenceModal(false);
                const w = workers.find((x) => x.id === selectedPresenceWorker)!;
                toast({
                  type: "success",
                  title: "تم تسجيل التواجد بنجاح",
                  desc: `${w.name} متواجدة في المقر الآن`,
                });
              }}
              className="flex-1 btn-primary py-2.5 rounded-xl font-bold"
            >
              تأكيد التسجيل
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

function StatCard({
  label,
  subtitle,
  value,
  icon,
  color,
  trend,
  urgent,
}: {
  label: string;
  subtitle: string;
  value: number;
  icon: any;
  color: "brand" | "emerald" | "gold" | "rose";
  trend?: string;
  urgent?: boolean;
}) {
  const colors = {
    brand: { bg: "from-brand-600 to-brand-400", chip: "bg-brand-50 text-brand-600" },
    emerald: { bg: "from-emerald-600 to-emerald-400", chip: "bg-emerald-50 text-emerald-600" },
    gold: { bg: "from-gold-500 to-gold-400", chip: "bg-amber-50 text-amber-600" },
    rose: { bg: "from-rose-600 to-rose-400", chip: "bg-rose-50 text-rose-600" },
  }[color];
  return (
    <div
      className={`soft-card p-5 relative overflow-hidden ${urgent ? "ring-2 ring-rose-300" : ""}`}
    >
      {urgent && (
        <div className="absolute top-3 left-3 w-2 h-2 bg-rose-500 rounded-full pulse-dot" />
      )}
      <div className="flex items-start justify-between mb-3">
        <div>
          <div className="text-xs font-bold text-slate-500">{label}</div>
          <div className="text-[10px] text-slate-400">{subtitle}</div>
        </div>
        <div
          className={`w-11 h-11 rounded-xl bg-gradient-to-br ${colors.bg} text-white flex items-center justify-center shadow-md`}
        >
          <Icon name={icon} className="w-5 h-5" />
        </div>
      </div>
      <div className={`text-4xl font-extrabold ${urgent ? "text-rose-600" : "text-brand-600"}`}>
        <Counter value={value} />
      </div>
      {trend && (
        <div className={`mt-2 text-[11px] font-bold inline-block px-2 py-1 rounded-full ${colors.chip}`}>
          {trend}
        </div>
      )}
    </div>
  );
}

function Panel({
  title,
  subtitle,
  children,
  icon,
  accent,
  badge,
}: {
  title: string;
  subtitle: string;
  children: React.ReactNode;
  icon: any;
  accent: "brand" | "emerald" | "rose";
  badge?: string;
}) {
  const accents = {
    brand: "from-brand-600 to-brand-400 text-white",
    emerald: "from-emerald-500 to-emerald-400 text-white",
    rose: "from-rose-500 to-rose-400 text-white",
  };
  return (
    <div className="soft-card overflow-hidden">
      <div className="px-5 py-4 border-b border-slate-100 flex items-center gap-3">
        <div
          className={`w-9 h-9 rounded-xl bg-gradient-to-br ${accents[accent]} flex items-center justify-center`}
        >
          <Icon name={icon} className="w-4 h-4" />
        </div>
        <div className="flex-1">
          <div className="font-extrabold text-brand-600 text-sm">{title}</div>
          <div className="text-[10px] text-slate-400">{subtitle}</div>
        </div>
        {badge && (
          <span className="bg-rose-500 text-white text-[10px] font-bold px-2 py-1 rounded-full">
            {badge}
          </span>
        )}
      </div>
      <div className="p-3">{children}</div>
    </div>
  );
}
