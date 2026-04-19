import { useEffect, useState } from "react";
import { Sidebar, type SectionKey } from "./components/Sidebar";
import { Topbar } from "./components/Topbar";
import { Dashboard } from "./components/Dashboard";
import { Workers } from "./components/Workers";
import { Clients } from "./components/Clients";
import { Schedule } from "./components/Schedule";
import { Contracts } from "./components/Contracts";
import { Modal, ToastHost, toast } from "./components/ui";

export default function App() {
  const [section, setSection] = useState<SectionKey>("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [smartAlert, setSmartAlert] = useState<null | {
    title: string;
    desc: string;
    primary: string;
    secondary: string;
  }>(null);
  const [alertsCount, setAlertsCount] = useState(4);
  const [loading, setLoading] = useState(true);

  // Initial loading shimmer
  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 600);
    return () => clearTimeout(t);
  }, []);

  // Smart Alert System (timed simulated)
  useEffect(() => {
    const t1 = setTimeout(() => {
      setSmartAlert({
        title: "⚠️ تنبيه: عاملة لم تُسجَّل خروجها",
        desc: "فاطمة محمد لم تُسجَّل خروجها منذ ٤ ساعات و ١٥ دقيقة من عند عائلة الغامدي. هل ترغب بالتواصل معها؟",
        primary: "تواصل معها",
        secondary: "تجاهل",
      });
    }, 10_000);
    const t2 = setTimeout(() => {
      setSmartAlert({
        title: "📅 تنبيه: عقد على وشك الانتهاء",
        desc: "عقد عائلة القحطاني سينتهي خلال ٧ أيام فقط. ينصح بإرسال تذكير للعميل أو بدء إجراءات التجديد.",
        primary: "إرسال تذكير",
        secondary: "لاحقاً",
      });
    }, 22_000);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, []);

  const renderSection = () => {
    switch (section) {
      case "dashboard":
        return <Dashboard />;
      case "workers":
        return <Workers />;
      case "clients":
        return <Clients />;
      case "schedule":
        return <Schedule />;
      case "contracts":
        return <Contracts />;
    }
  };

  return (
    <div className="min-h-screen flex">
      <Sidebar
        current={section}
        onSelect={(s) => {
          setLoading(true);
          setSection(s);
          setTimeout(() => setLoading(false), 350);
        }}
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />
      <div className="flex-1 min-w-0 flex flex-col">
        <Topbar
          current={section}
          onMenu={() => setSidebarOpen(true)}
          alertsCount={alertsCount}
        />
        <main className="flex-1 px-4 lg:px-8 py-6 max-w-[1600px] w-full mx-auto">
          {loading ? <SkeletonView /> : renderSection()}
        </main>
        <footer className="text-center text-[11px] text-slate-400 py-4 border-t border-slate-200">
          © 2026 وكالة النخبة للخدمات المنزلية — نسخة تجريبية للعرض
        </footer>
      </div>

      <ToastHost />

      <Modal
        open={!!smartAlert}
        onClose={() => setSmartAlert(null)}
        title="تنبيه ذكي من النظام"
      >
        {smartAlert && (
          <div className="space-y-4">
            <div className="bg-amber-50 border-r-4 border-amber-500 rounded-2xl p-4">
              <div className="font-extrabold text-amber-800 mb-2">{smartAlert.title}</div>
              <div className="text-sm text-slate-700 leading-relaxed">{smartAlert.desc}</div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => {
                  setSmartAlert(null);
                  setAlertsCount((n) => Math.max(0, n - 1));
                }}
                className="flex-1 py-2.5 rounded-xl border border-slate-200 font-bold text-slate-600 hover:bg-slate-50"
              >
                {smartAlert.secondary}
              </button>
              <button
                onClick={() => {
                  toast({
                    type: "success",
                    title: "تم تنفيذ الإجراء",
                    desc: smartAlert.primary,
                  });
                  setSmartAlert(null);
                  setAlertsCount((n) => Math.max(0, n - 1));
                }}
                className="flex-1 btn-primary py-2.5 rounded-xl font-bold"
              >
                {smartAlert.primary}
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}

function SkeletonView() {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="soft-card p-5 h-32 shimmer rounded-2xl" />
        ))}
      </div>
      <div className="soft-card h-24 shimmer rounded-2xl" />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="soft-card h-72 shimmer rounded-2xl" />
        <div className="soft-card h-72 shimmer rounded-2xl" />
        <div className="soft-card h-72 shimmer rounded-2xl" />
      </div>
    </div>
  );
}
