import { Icon } from "./ui";

export type SectionKey = "dashboard" | "workers" | "clients" | "schedule" | "contracts";

const items: { key: SectionKey; label: string; icon: any }[] = [
  { key: "dashboard", label: "لوحة التحكم", icon: "dashboard" },
  { key: "workers", label: "العاملات", icon: "users" },
  { key: "clients", label: "العملاء", icon: "client" },
  { key: "schedule", label: "الجدولة", icon: "calendar" },
  { key: "contracts", label: "العقود", icon: "contract" },
];

export function Sidebar({
  current,
  onSelect,
  open,
  onClose,
}: {
  current: SectionKey;
  onSelect: (k: SectionKey) => void;
  open: boolean;
  onClose: () => void;
}) {
  return (
    <>
      {/* Mobile backdrop */}
      <div
        onClick={onClose}
        className={`lg:hidden fixed inset-0 bg-slate-900/40 z-40 transition-opacity ${
          open ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      />
      <aside
        className={`fixed lg:sticky top-0 right-0 h-screen w-64 bg-white border-l border-slate-200 z-50 transition-transform ${
          open ? "translate-x-0" : "translate-x-full lg:translate-x-0"
        } flex flex-col`}
      >
        {/* Logo */}
        <div className="px-5 py-5 border-b border-slate-100 flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-brand-600 to-brand-400 flex items-center justify-center shadow-lg shadow-brand-600/20">
            <span className="text-gold-500 font-extrabold text-lg">ن</span>
          </div>
          <div>
            <div className="font-extrabold text-brand-600 leading-tight">وكالة النخبة</div>
            <div className="text-[11px] text-slate-500">Elite Domestic Services</div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 py-4 overflow-y-auto">
          <div className="px-5 text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">
            القائمة الرئيسية
          </div>
          {items.map((it) => (
            <button
              key={it.key}
              onClick={() => {
                onSelect(it.key);
                onClose();
              }}
              className={`w-full flex items-center gap-3 px-5 py-3 text-sm font-bold text-slate-600 hover:bg-slate-50 transition ${
                current === it.key ? "nav-active" : ""
              }`}
            >
              <Icon name={it.icon} className="w-5 h-5" />
              <span>{it.label}</span>
            </button>
          ))}

          <div className="px-5 text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-6 mb-2">
            أدوات سريعة
          </div>
          <button className="w-full flex items-center gap-3 px-5 py-3 text-sm font-bold text-slate-600 hover:bg-slate-50">
            <Icon name="bell" className="w-5 h-5" />
            <span>التنبيهات</span>
            <span className="ms-auto bg-rose-500 text-white text-[10px] px-2 py-0.5 rounded-full">٤</span>
          </button>
          <button className="w-full flex items-center gap-3 px-5 py-3 text-sm font-bold text-slate-600 hover:bg-slate-50">
            <Icon name="history" className="w-5 h-5" />
            <span>السجلات</span>
          </button>
        </nav>

        {/* Footer card */}
        <div className="p-4">
          <div className="rounded-2xl p-4 bg-gradient-to-br from-brand-600 to-brand-800 text-white">
            <div className="text-xs opacity-80 mb-1">الإصدار التجريبي</div>
            <div className="font-bold text-sm mb-2">نسخة المعاينة 2026</div>
            <div className="text-[11px] opacity-80 leading-relaxed">
              جميع البيانات تجريبية لأغراض العرض فقط
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
