import { useMemo, useState } from "react";
import { Avatar, Badge, Icon, Toggle, toast } from "./ui";
import { clients, contracts as initial, workers } from "../data";

const filters = [
  { key: "all", label: "الكل" },
  { key: "active", label: "نشطة" },
  { key: "expiring", label: "تنتهي هذا الشهر" },
  { key: "expired", label: "منتهية" },
];

const statusInfo: Record<string, { tone: any; label: string }> = {
  active: { tone: "green", label: "نشط" },
  expiring: { tone: "amber", label: "ينتهي قريباً" },
  expired: { tone: "red", label: "منتهي" },
  renewed: { tone: "blue", label: "مجدد" },
};

export function Contracts() {
  const [filter, setFilter] = useState("all");
  const [list, setList] = useState(initial);

  const filtered = useMemo(
    () => list.filter((c) => filter === "all" || c.status === filter),
    [filter, list]
  );

  const totals = useMemo(() => {
    return {
      all: list.length,
      active: list.filter((c) => c.status === "active").length,
      expiring: list.filter((c) => c.status === "expiring").length,
      expired: list.filter((c) => c.status === "expired").length,
      renewed: list.filter((c) => c.status === "renewed").length,
    };
  }, [list]);

  return (
    <div className="space-y-5 fade-in-up">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <SummaryChip label="عقود نشطة" value={totals.active} tone="emerald" />
        <SummaryChip label="تنتهي قريباً" value={totals.expiring} tone="amber" />
        <SummaryChip label="منتهية" value={totals.expired} tone="rose" />
        <SummaryChip label="مجددة" value={totals.renewed} tone="sky" />
      </div>

      <div className="soft-card p-4 flex items-center gap-3 flex-wrap">
        <div className="flex items-center gap-1.5 overflow-x-auto flex-1">
          {filters.map((f) => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition ${
                filter === f.key ? "btn-primary" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
        <button className="btn-gold rounded-xl px-4 py-2 text-xs flex items-center gap-1.5">
          <Icon name="plus" className="w-4 h-4" />
          عقد جديد
        </button>
      </div>

      <div className="soft-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-[900px]">
            <thead className="bg-slate-50">
              <tr className="text-[11px] text-slate-500 font-bold">
                <th className="text-right px-4 py-3">رقم العقد</th>
                <th className="text-right px-4 py-3">العميل</th>
                <th className="text-right px-4 py-3">العاملة</th>
                <th className="text-right px-4 py-3">المدة</th>
                <th className="text-right px-4 py-3">التقدم</th>
                <th className="text-right px-4 py-3">الحالة</th>
                <th className="text-center px-4 py-3">تذكير تلقائي</th>
                <th className="text-right px-4 py-3">الإجراءات</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((ct) => {
                const c = clients.find((x) => x.id === ct.clientId)!;
                const w = workers.find((x) => x.id === ct.workerId)!;
                const pct = Math.min(100, Math.round((ct.daysElapsed / ct.totalDays) * 100));
                const info = statusInfo[ct.status];
                return (
                  <tr key={ct.id} className="border-t border-slate-100 hover:bg-slate-50/50">
                    <td className="px-4 py-3 font-extrabold text-brand-600 text-xs tick">
                      {ct.number}
                    </td>
                    <td className="px-4 py-3">
                      <div className="text-xs font-bold text-slate-800">{c.family}</div>
                      <div className="text-[10px] text-slate-500">{c.area}</div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <Avatar name={w.name} size={28} />
                        <span className="text-xs font-bold">{w.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-[11px] text-slate-600 tick">
                      {ct.start}
                      <br />
                      ← {ct.end}
                    </td>
                    <td className="px-4 py-3 w-40">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all ${
                              pct >= 95
                                ? "bg-rose-500"
                                : pct >= 80
                                ? "bg-amber-500"
                                : "bg-emerald-500"
                            }`}
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                        <span className="text-[10px] font-bold text-slate-600 tick">{pct}%</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <Badge tone={info.tone}>{info.label}</Badge>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <Toggle
                        checked={ct.autoReminder}
                        onChange={(v) => {
                          setList((arr) =>
                            arr.map((x) => (x.id === ct.id ? { ...x, autoReminder: v } : x))
                          );
                          toast({
                            type: v ? "success" : "info",
                            title: v ? "تم تفعيل التذكير التلقائي" : "تم إيقاف التذكير",
                            desc: ct.number,
                          });
                        }}
                      />
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => {
                            setList((arr) =>
                              arr.map((x) =>
                                x.id === ct.id ? { ...x, status: "renewed" } : x
                              )
                            );
                            toast({
                              type: "success",
                              title: "تم تجديد العقد",
                              desc: ct.number,
                            });
                          }}
                          className="text-[10px] font-bold px-2 py-1.5 rounded-lg bg-brand-50 text-brand-600 hover:bg-brand-100"
                        >
                          تجديد
                        </button>
                        <button
                          onClick={() =>
                            toast({ type: "info", title: "عرض العقد", desc: ct.number })
                          }
                          className="text-[10px] font-bold px-2 py-1.5 rounded-lg bg-slate-100 text-slate-600 hover:bg-slate-200"
                        >
                          عرض
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function SummaryChip({
  label,
  value,
  tone,
}: {
  label: string;
  value: number;
  tone: "emerald" | "amber" | "rose" | "sky";
}) {
  const colors = {
    emerald: "from-emerald-500 to-emerald-400",
    amber: "from-amber-500 to-amber-400",
    rose: "from-rose-500 to-rose-400",
    sky: "from-sky-500 to-sky-400",
  };
  return (
    <div className="soft-card p-4 flex items-center gap-3">
      <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${colors[tone]} text-white flex items-center justify-center font-extrabold text-lg`}>
        {value.toLocaleString("ar-EG")}
      </div>
      <div>
        <div className="text-xs font-bold text-slate-500">{label}</div>
        <div className="text-[10px] text-slate-400">عقد</div>
      </div>
    </div>
  );
}
