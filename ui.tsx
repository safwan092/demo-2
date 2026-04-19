import { useEffect, useState } from "react";
import { Avatar, Icon } from "./ui";

const sectionLabels: Record<string, string> = {
  dashboard: "لوحة التحكم الرئيسية",
  workers: "إدارة العاملات",
  clients: "إدارة العملاء",
  schedule: "الجدولة الأسبوعية",
  contracts: "إدارة العقود",
};

export function Topbar({
  current,
  onMenu,
  alertsCount,
}: {
  current: string;
  onMenu: () => void;
  alertsCount: number;
}) {
  const [now, setNow] = useState(new Date());
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 30_000);
    return () => clearInterval(t);
  }, []);
  const dateStr = now.toLocaleDateString("ar-SA-u-nu-arab", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
  const timeStr = now.toLocaleTimeString("ar-SA-u-nu-arab", { hour: "2-digit", minute: "2-digit" });

  return (
    <header className="sticky top-0 z-30 bg-white/80 backdrop-blur border-b border-slate-200">
      <div className="px-4 lg:px-8 h-16 flex items-center gap-4">
        <button
          onClick={onMenu}
          className="lg:hidden w-10 h-10 rounded-xl hover:bg-slate-100 flex items-center justify-center text-slate-600"
        >
          <Icon name="menu" />
        </button>
        <div className="flex-1 min-w-0">
          <h1 className="text-lg lg:text-xl font-extrabold text-brand-600 truncate">
            {sectionLabels[current]}
          </h1>
          <div className="text-xs text-slate-500 hidden sm:block">
            {dateStr} • {timeStr}
          </div>
        </div>

        {/* Search */}
        <div className="hidden md:flex items-center gap-2 bg-slate-100 rounded-xl px-3 py-2 w-64">
          <Icon name="search" className="w-4 h-4 text-slate-400" />
          <input
            placeholder="ابحث..."
            className="bg-transparent outline-none text-sm flex-1 placeholder:text-slate-400"
          />
          <span className="text-[10px] text-slate-400 bg-white px-1.5 py-0.5 rounded">⌘K</span>
        </div>

        <button className="relative w-10 h-10 rounded-xl bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-600 transition">
          <Icon name="bell" />
          {alertsCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-rose-500 text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center pulse-dot">
              {alertsCount}
            </span>
          )}
        </button>

        <div className="flex items-center gap-3 pl-2 border-r border-slate-200 pr-3">
          <div className="text-right hidden sm:block">
            <div className="text-sm font-bold text-slate-800">سلطان العنزي</div>
            <div className="text-[11px] text-slate-500">مدير العمليات</div>
          </div>
          <Avatar name="سلطان العنزي" size={40} />
        </div>
      </div>
    </header>
  );
}
