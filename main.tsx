export type WorkerStatus = "active" | "available" | "delayed" | "office";
export type ServiceType = "مقيمة" | "ساعية";

export interface Worker {
  id: string;
  name: string;
  nationalId: string;
  service: ServiceType;
  status: WorkerStatus;
  currentClient?: string;
  since?: string;
  avatarSeed: string;
  monthlyHours: number;
  phone: string;
}

export interface Client {
  id: string;
  family: string;
  area: string;
  phone: string;
  service: ServiceType;
  workerId?: string;
  contractStart: string;
  contractEnd: string;
  daysLeft: number;
  paymentStatus: "paid" | "late";
}

export interface Assignment {
  id: string;
  workerId: string;
  clientId: string;
  start: string; // HH:mm
  end: string;
  day: number; // 0=Sat ... 6=Fri
  status: "ongoing" | "delayed" | "done" | "scheduled";
  service: string;
}

export interface Contract {
  id: string;
  number: string;
  clientId: string;
  workerId: string;
  start: string;
  end: string;
  totalDays: number;
  daysElapsed: number;
  status: "active" | "expiring" | "expired" | "renewed";
  autoReminder: boolean;
}

export const workers: Worker[] = [
  {
    id: "w1",
    name: "فاطمة أحمد",
    nationalId: "2451-0987-3",
    service: "مقيمة",
    status: "active",
    currentClient: "عائلة الغامدي",
    since: "منذ 3 أيام",
    avatarSeed: "FA",
    monthlyHours: 168,
    phone: "+966 50 123 4567",
  },
  {
    id: "w2",
    name: "مريم خالد",
    nationalId: "2890-1124-5",
    service: "ساعية",
    status: "active",
    currentClient: "عائلة العتيبي",
    since: "منذ ساعتين",
    avatarSeed: "MK",
    monthlyHours: 64,
    phone: "+966 55 222 4411",
  },
  {
    id: "w3",
    name: "نور إبراهيم",
    nationalId: "1098-7766-2",
    service: "ساعية",
    status: "available",
    avatarSeed: "NI",
    monthlyHours: 48,
    phone: "+966 53 411 7788",
  },
  {
    id: "w4",
    name: "زينب محمد",
    nationalId: "3344-2211-9",
    service: "مقيمة",
    status: "active",
    currentClient: "عائلة القحطاني",
    since: "منذ أسبوع",
    avatarSeed: "ZM",
    monthlyHours: 192,
    phone: "+966 56 778 2200",
  },
  {
    id: "w5",
    name: "هديل عبدالله",
    nationalId: "5566-3322-1",
    service: "ساعية",
    status: "delayed",
    currentClient: "عائلة الشمري",
    since: "متأخرة 25 دقيقة",
    avatarSeed: "HA",
    monthlyHours: 52,
    phone: "+966 50 998 1122",
  },
  {
    id: "w6",
    name: "رنا سعود",
    nationalId: "7788-9900-4",
    service: "مقيمة",
    status: "office",
    since: "في المقر",
    avatarSeed: "RS",
    monthlyHours: 80,
    phone: "+966 54 332 5566",
  },
  {
    id: "w7",
    name: "سارة عثمان",
    nationalId: "1133-4455-8",
    service: "ساعية",
    status: "available",
    avatarSeed: "SO",
    monthlyHours: 60,
    phone: "+966 57 111 4422",
  },
  {
    id: "w8",
    name: "ليلى يوسف",
    nationalId: "9988-7766-3",
    service: "مقيمة",
    status: "active",
    currentClient: "عائلة الدوسري",
    since: "منذ شهر",
    avatarSeed: "LY",
    monthlyHours: 200,
    phone: "+966 59 654 1230",
  },
];

export const clients: Client[] = [
  {
    id: "c1",
    family: "عائلة الغامدي",
    area: "حي الروضة - الرياض",
    phone: "+966 55 123 1111",
    service: "مقيمة",
    workerId: "w1",
    contractStart: "2025-04-15",
    contractEnd: "2026-04-15",
    daysLeft: 15,
    paymentStatus: "paid",
  },
  {
    id: "c2",
    family: "عائلة العتيبي",
    area: "حي النزهة - جدة",
    phone: "+966 50 222 3344",
    service: "ساعية",
    workerId: "w2",
    contractStart: "2025-09-01",
    contractEnd: "2026-08-31",
    daysLeft: 45,
    paymentStatus: "paid",
  },
  {
    id: "c3",
    family: "عائلة القحطاني",
    area: "حي الملقا - الرياض",
    phone: "+966 56 778 0099",
    service: "مقيمة",
    workerId: "w4",
    contractStart: "2025-02-10",
    contractEnd: "2026-02-10",
    daysLeft: 8,
    paymentStatus: "paid",
  },
  {
    id: "c4",
    family: "عائلة الشمري",
    area: "حي العليا - الرياض",
    phone: "+966 53 555 6677",
    service: "ساعية",
    workerId: "w5",
    contractStart: "2025-06-20",
    contractEnd: "2026-06-20",
    daysLeft: 95,
    paymentStatus: "late",
  },
  {
    id: "c5",
    family: "عائلة الدوسري",
    area: "حي قرطبة - الرياض",
    phone: "+966 54 432 1100",
    service: "مقيمة",
    workerId: "w8",
    contractStart: "2025-01-05",
    contractEnd: "2026-01-05",
    daysLeft: 22,
    paymentStatus: "paid",
  },
  {
    id: "c6",
    family: "عائلة الزهراني",
    area: "حي السلامة - جدة",
    phone: "+966 58 887 2233",
    service: "ساعية",
    contractStart: "2025-11-01",
    contractEnd: "2026-10-31",
    daysLeft: 110,
    paymentStatus: "paid",
  },
];

const today = new Date();
const isoToday = today.toISOString().slice(0, 10);

export const todaysAssignments: Assignment[] = [
  { id: "a1", workerId: "w2", clientId: "c2", start: "08:00", end: "12:00", day: today.getDay(), status: "ongoing", service: "تنظيف عام" },
  { id: "a2", workerId: "w1", clientId: "c1", start: "07:30", end: "20:00", day: today.getDay(), status: "ongoing", service: "إقامة كاملة" },
  { id: "a3", workerId: "w5", clientId: "c4", start: "09:00", end: "13:00", day: today.getDay(), status: "delayed", service: "ترتيب وغسيل" },
  { id: "a4", workerId: "w4", clientId: "c3", start: "06:00", end: "22:00", day: today.getDay(), status: "ongoing", service: "إقامة كاملة" },
  { id: "a5", workerId: "w7", clientId: "c6", start: "14:00", end: "18:00", day: today.getDay(), status: "scheduled", service: "تنظيف وكي" },
  { id: "a6", workerId: "w3", clientId: "c5", start: "16:00", end: "19:00", day: today.getDay(), status: "scheduled", service: "تنظيف عام" },
];

// Weekly schedule (Sat..Fri) — sample
export const weeklyAssignments: Assignment[] = [
  { id: "wa1", workerId: "w1", clientId: "c1", day: 0, start: "07:30", end: "20:00", status: "ongoing", service: "إقامة" },
  { id: "wa2", workerId: "w1", clientId: "c1", day: 1, start: "07:30", end: "20:00", status: "ongoing", service: "إقامة" },
  { id: "wa3", workerId: "w1", clientId: "c1", day: 2, start: "07:30", end: "20:00", status: "ongoing", service: "إقامة" },
  { id: "wa4", workerId: "w2", clientId: "c2", day: 0, start: "08:00", end: "12:00", status: "ongoing", service: "تنظيف" },
  { id: "wa5", workerId: "w2", clientId: "c5", day: 2, start: "09:00", end: "13:00", status: "scheduled", service: "تنظيف" },
  { id: "wa6", workerId: "w2", clientId: "c2", day: 4, start: "08:00", end: "12:00", status: "scheduled", service: "تنظيف" },
  { id: "wa7", workerId: "w3", clientId: "c5", day: 1, start: "16:00", end: "19:00", status: "scheduled", service: "تنظيف" },
  { id: "wa8", workerId: "w3", clientId: "c6", day: 3, start: "10:00", end: "14:00", status: "scheduled", service: "كي وغسيل" },
  { id: "wa9", workerId: "w5", clientId: "c4", day: 0, start: "09:00", end: "13:00", status: "delayed", service: "ترتيب" },
  { id: "wa10", workerId: "w5", clientId: "c4", day: 2, start: "09:00", end: "13:00", status: "scheduled", service: "ترتيب" },
  { id: "wa11", workerId: "w7", clientId: "c6", day: 1, start: "14:00", end: "18:00", status: "scheduled", service: "تنظيف وكي" },
  { id: "wa12", workerId: "w7", clientId: "c2", day: 3, start: "08:00", end: "12:00", status: "scheduled", service: "تنظيف" },
  { id: "wa13", workerId: "w4", clientId: "c3", day: 0, start: "06:00", end: "22:00", status: "ongoing", service: "إقامة" },
  { id: "wa14", workerId: "w4", clientId: "c3", day: 1, start: "06:00", end: "22:00", status: "ongoing", service: "إقامة" },
  { id: "wa15", workerId: "w8", clientId: "c5", day: 2, start: "06:00", end: "22:00", status: "ongoing", service: "إقامة" },
  { id: "wa16", workerId: "w8", clientId: "c5", day: 4, start: "06:00", end: "22:00", status: "scheduled", service: "إقامة" },
];

export const contracts: Contract[] = [
  { id: "ct1", number: "EN-2025-1042", clientId: "c1", workerId: "w1", start: "2025-04-15", end: "2026-04-15", totalDays: 365, daysElapsed: 350, status: "expiring", autoReminder: true },
  { id: "ct2", number: "EN-2025-1078", clientId: "c2", workerId: "w2", start: "2025-09-01", end: "2026-08-31", totalDays: 365, daysElapsed: 320, status: "active", autoReminder: true },
  { id: "ct3", number: "EN-2025-0911", clientId: "c3", workerId: "w4", start: "2025-02-10", end: "2026-02-10", totalDays: 365, daysElapsed: 357, status: "expiring", autoReminder: false },
  { id: "ct4", number: "EN-2025-1199", clientId: "c4", workerId: "w5", start: "2025-06-20", end: "2026-06-20", totalDays: 365, daysElapsed: 270, status: "active", autoReminder: true },
  { id: "ct5", number: "EN-2025-0820", clientId: "c5", workerId: "w8", start: "2025-01-05", end: "2026-01-05", totalDays: 365, daysElapsed: 343, status: "expiring", autoReminder: true },
  { id: "ct6", number: "EN-2025-1230", clientId: "c6", workerId: "w7", start: "2025-11-01", end: "2026-10-31", totalDays: 365, daysElapsed: 255, status: "active", autoReminder: false },
  { id: "ct7", number: "EN-2024-0712", clientId: "c2", workerId: "w7", start: "2024-09-01", end: "2025-08-31", totalDays: 365, daysElapsed: 365, status: "renewed", autoReminder: false },
  { id: "ct8", number: "EN-2024-0501", clientId: "c1", workerId: "w8", start: "2024-04-15", end: "2025-04-15", totalDays: 365, daysElapsed: 365, status: "expired", autoReminder: false },
];

export const dayNames = ["السبت", "الأحد", "الإثنين", "الثلاثاء", "الأربعاء", "الخميس", "الجمعة"];

export const todayIso = isoToday;
