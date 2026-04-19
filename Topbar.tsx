import { useState } from "react";
import { Avatar, Badge, Icon, Modal, toast } from "./ui";
import { clients, dayNames, weeklyAssignments, workers } from "../data";

const colors = ["#1B2A6B", "#0ea5e9", "#10b981", "#F59E0B", "#8b5cf6", "#ec4899", "#14b8a6", "#ef4444"];

export function Schedule() {
  const [view, setView] = useState<"grid" | "list">("grid");
  const [addOpen, setAddOpen] = useState<{ workerId: string; day: number } | null>(null);

  return (
    <div className="space-y-5 fade-in-up">
      <div className="soft-card p-4 flex items-center gap-3 flex-wrap">
        <div className="flex-1">
          <div className="font-extrabold text-brand-600">الجدول الأسبوعي</div>
          <div className="text-[11px] text-slate-500">السبت ← الجمعة</div>
        </div>
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
          <button
            onClick={() => setView("grid")}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg flex items-center gap-1 ${
              view === "grid" ? "bg-white shadow text-brand-600" : "text-slate-500"
            }`}
          >
            <Icon name="grid" className="w-4 h-4" />
            شبكة
          </button>
          <button
            onClick={() => setView("list")}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg flex items-center gap-1 ${
              view === "list" ? "bg-white shadow text-brand-600" : "text-slate-500"
            }`}
          >
            <Icon name="list" className="w-4 h-4" />
            قائمة
          </button>
        </div>
        <button
          onClick={() => setAddOpen({ workerId: workers[0].id, day: 0 })}
          className="btn-gold rounded-xl px-4 py-2 text-xs flex items-center gap-1.5"
        >
          <Icon name="plus" className="w-4 h-4" />
          إضافة مهمة
        </button>
      </div>

      {view === "grid" ? (
        <div className="soft-card p-4 overflow-x-auto">
          <table className="w-full min-w-[900px] border-separate border-spacing-1">
            <thead>
              <tr>
                <th className="w-40 text-right text-[11px] font-bold text-slate-500 px-2">العاملة</th>
                {dayNames.map((d, i) => (
                  <th
                    key={i}
                    className="text-[11px] font-bold text-slate-600 bg-slate-50 rounded-lg p-2 text-center"
                  >
                    {d}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {workers.slice(0, 7).map((w, wi) => (
                <tr key={w.id}>
                  <td className="px-2 py-1">
                    <div className="flex items-center gap-2">
                      <Avatar name={w.name} size={32} />
                      <div className="min-w-0">
                        <div className="text-xs font-extrabold text-slate-700 truncate">{w.name}</div>
                        <div className="text-[10px] text-slate-400">{w.service}</div>
                      </div>
                    </div>
                  </td>
                  {dayNames.map((_, di) => {
                    const a = weeklyAssignments.find((x) => x.workerId === w.id && x.day === di);
                    if (!a) {
                      return (
                        <td
                          key={di}
                          className="bg-slate-50/50 rounded-lg p-1 align-top"
                          onClick={() => setAddOpen({ workerId: w.id, day: di })}
                        >
                          <button className="w-full h-16 rounded-lg border-2 border-dashed border-slate-200 hover:border-gold-500 hover:bg-gold-50 text-slate-300 hover:text-gold-500 text-lg font-bold transition">
                            +
                          </button>
                        </td>
                      );
                    }
                    const c = clients.find((x) => x.id === a.clientId)!;
                    const color = colors[wi % colors.length];
                    return (
                      <td key={di} className="rounded-lg p-1 align-top">
                        <div
                          className="rounded-lg p-2 text-white text-[10px] h-16 cursor-pointer hover:scale-[1.02] transition"
                          style={{
                            background: `linear-gradient(135deg, ${color}, ${color}cc)`,
                            opacity: a.status === "delayed" ? 0.7 : 1,
                          }}
                        >
                          <div className="font-extrabold truncate">{c.family.replace("عائلة ", "آل ")}</div>
                          <div className="opacity-90 tick">
                            {a.start} - {a.end}
                          </div>
                          <div className="opacity-80 truncate">{a.service}</div>
                        </div>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="soft-card overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-slate-50">
              <tr className="text-[11px] text-slate-500 font-bold">
                <th className="text-right px-4 py-3">اليوم</th>
                <th className="text-right px-4 py-3">العاملة</th>
                <th className="text-right px-4 py-3">العميل</th>
                <th className="text-right px-4 py-3">من</th>
                <th className="text-right px-4 py-3">إلى</th>
                <th className="text-right px-4 py-3">الحالة</th>
                <th className="text-right px-4 py-3">الإجراءات</th>
              </tr>
            </thead>
            <tbody>
              {weeklyAssignments.map((a) => {
                const w = workers.find((x) => x.id === a.workerId)!;
                const c = clients.find((x) => x.id === a.clientId)!;
                const tone =
                  a.status === "ongoing" ? "green" : a.status === "delayed" ? "red" : "amber";
                const label =
                  a.status === "ongoing"
                    ? "جارية"
                    : a.status === "delayed"
                    ? "متأخرة"
                    : "مجدولة";
                return (
                  <tr key={a.id} className="border-t border-slate-100 hover:bg-slate-50">
                    <td className="px-4 py-3 text-xs font-bold text-slate-700">{dayNames[a.day]}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <Avatar name={w.name} size={28} />
                        <span className="text-xs font-bold">{w.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-xs font-bold text-brand-600">{c.family}</td>
                    <td className="px-4 py-3 text-xs tick">{a.start}</td>
                    <td className="px-4 py-3 text-xs tick">{a.end}</td>
                    <td className="px-4 py-3">
                      <Badge tone={tone}>{label}</Badge>
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() =>
                          toast({ type: "info", title: "عرض تفاصيل المهمة", desc: c.family })
                        }
                        className="text-xs font-bold text-brand-600 hover:underline"
                      >
                        التفاصيل ←
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      <Modal open={!!addOpen} onClose={() => setAddOpen(null)} title="إضافة مهمة جديدة">
        {addOpen && (
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1.5">العاملة</label>
              <select
                defaultValue={addOpen.workerId}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm font-bold"
              >
                {workers.map((w) => (
                  <option key={w.id} value={w.id}>
                    {w.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1.5">العميل</label>
              <select className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm font-bold">
                {clients.map((c) => (
                  <option key={c.id}>{c.family}</option>
                ))}
              </select>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1.5">من</label>
                <input
                  type="time"
                  defaultValue="09:00"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm font-bold"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1.5">إلى</label>
                <input
                  type="time"
                  defaultValue="13:00"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm font-bold"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1.5">نوع الخدمة</label>
              <input
                defaultValue="تنظيف عام"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm font-bold"
              />
            </div>
            <div className="flex gap-2 pt-2">
              <button
                onClick={() => setAddOpen(null)}
                className="flex-1 py-2.5 rounded-xl border border-slate-200 font-bold text-slate-600"
              >
                إلغاء
              </button>
              <button
                onClick={() => {
                  toast({ type: "success", title: "تمت إضافة المهمة بنجاح" });
                  setAddOpen(null);
                }}
                className="flex-1 btn-primary py-2.5 rounded-xl font-bold"
              >
                إضافة
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
