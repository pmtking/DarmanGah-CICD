"use client";
import { useState } from "react";

export default function UserPanel() {
  const [activeTab, setActiveTab] = useState<"labs" | "records" | "appointments">("labs");
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [pdfModalOpen, setPdfModalOpen] = useState(false);
  const [selectedPdf, setSelectedPdf] = useState<string | null>(null);

  const [profile, setProfile] = useState({
    name: "علی رضایی",
    age: 32,
    phone: "09121234567",
  });

  const labs = [
    { id: 1, testName: "CBC", result: "نرمال", date: "2025-09-12", pdf: "/pdfs/cbc.pdf" },
    { id: 2, testName: "قند خون", result: "110 mg/dl", date: "2025-09-28", pdf: "/pdfs/sugar.pdf" },
  ];
  const records = [
    { id: 1, diagnosis: "فشار خون بالا", doctor: "دکتر احمدی", date: "2025-08-10", trackingId: "TRK12345" },
    { id: 2, diagnosis: "دیابت نوع ۲", doctor: "دکتر محمدی", date: "2025-07-05", trackingId: "TRK67890" },
  ];
  const appointments = [
    { id: 1, date: "2025-10-15", doctor: "دکتر محمدی", status: "رزرو شده" },
    { id: 2, date: "2025-11-02", doctor: "دکتر احمدی", status: "انجام‌شده" },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case "labs":
        return (
          <Section title="🧪 آزمایش‌ها">
            <div className="flex overflow-x-auto gap-4 pb-4 px-2 snap-x snap-mandatory">
              {labs.map((lab) => (
                <GlassCard key={lab.id} className="flex-shrink-0 w-48 sm:w-56 md:w-64 snap-start animate-slideUp">
                  <h3 className="font-bold text-white drop-shadow-md">{lab.testName}</h3>
                  <p className="text-white drop-shadow-md">نتیجه: <span className="font-medium">{lab.result}</span></p>
                  <small className="text-white/70 drop-shadow-sm">📅 {lab.date}</small>
                  <button
                    className="mt-3 w-full py-1 text-sm rounded-xl bg-gradient-to-r from-blue-400/30 to-indigo-500/30 text-white hover:from-blue-500/40 hover:to-indigo-600/40 transition-all shadow-md"
                    onClick={() => {
                      setSelectedPdf(lab.pdf);
                      setPdfModalOpen(true);
                    }}
                  >
                    مشاهده PDF
                  </button>
                </GlassCard>
              ))}
            </div>
          </Section>
        );

      case "records":
        return (
          <Section title="📂 پرونده‌ها">
            <div className="flex overflow-x-auto gap-4 pb-4 px-2 snap-x snap-mandatory">
              {records.map((rec) => (
                <GlassCard key={rec.id} className="flex-shrink-0 w-52 sm:w-56 md:w-64 snap-start animate-slideUp">
                  <h3 className="font-bold text-white drop-shadow-md">{rec.diagnosis}</h3>
                  <p className="text-white drop-shadow-sm">👨‍⚕️ پزشک: {rec.doctor}</p>
                  <p className="text-white drop-shadow-sm">📅 تاریخ مراجعه: {rec.date}</p>
                  <p className="text-white drop-shadow-sm">🆔 کد رهگیری: <span className="font-medium">{rec.trackingId}</span></p>
                  <button className="mt-2 w-full py-1 text-sm rounded-xl bg-gradient-to-r from-green-400/30 to-teal-500/30 text-white hover:from-green-500/40 hover:to-teal-600/40 transition-all shadow-md">
                    مشاهده جزئیات
                  </button>
                </GlassCard>
              ))}
            </div>
          </Section>
        );

      case "appointments":
        return (
          <Section title="📅 نوبت‌ها">
            <div className="flex flex-col gap-4">
              {appointments.map((apt) => (
                <GlassCard key={apt.id} className="animate-slideUp">
                  <p className="text-white drop-shadow-md">👨‍⚕️ دکتر: {apt.doctor}</p>
                  <p className="text-white drop-shadow-md">📆 تاریخ: {apt.date}</p>
                  <span className={`px-2 py-1 text-xs rounded-lg ${
                    apt.status === "رزرو شده"
                      ? "bg-yellow-400/30 text-yellow-900"
                      : "bg-green-400/30 text-green-900"
                  }`}>{apt.status}</span>
                </GlassCard>
              ))}
            </div>
          </Section>
        );
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-white/5 backdrop-blur-2xl">
      {/* هدر */}
      <header className="flex items-center justify-between p-4 bg-white/10 backdrop-blur-2xl shadow-lg sticky top-0 z-20 rounded-b-3xl">
        <div>
          <h1 className="text-lg font-bold text-white drop-shadow-md">{profile.name}</h1>
          <p className="text-sm text-white/80 drop-shadow-sm">📞 {profile.phone}</p>
        </div>
        <button
          onClick={() => setIsEditModalOpen(true)}
          className="w-12 h-12 rounded-full bg-white/20 border border-white/30 text-white flex items-center justify-center shadow-lg hover:scale-110 transition-all"
        >
          ✏️
        </button>
      </header>

      {/* محتوای تب */}
      <main className="flex-1 p-4">{renderContent()}</main>

      {/* ناوبری پایین */}
      <nav className="flex justify-around items-center border-t border-white/20 bg-white/10 backdrop-blur-2xl p-3 sticky bottom-[10px] rounded-3xl mx-3 shadow-lg">
        <NavItem label="پرونده‌ها" icon="📂" active={activeTab === "records"} onClick={() => setActiveTab("records")} />
        <NavItem label="آزمایش‌ها" icon="🧪" active={activeTab === "labs"} onClick={() => setActiveTab("labs")} />
        <NavItem label="نوبت‌ها" icon="📅" active={activeTab === "appointments"} onClick={() => setActiveTab("appointments")} />
      </nav>

      {/* مدال‌ها */}
      {isEditModalOpen && <EditProfileModal profile={profile} setProfile={setProfile} close={() => setIsEditModalOpen(false)} />}
      {pdfModalOpen && selectedPdf && <PdfModal pdfUrl={selectedPdf} close={() => setPdfModalOpen(false)} />}
    </div>
  );
}

/* GlassCard */
function GlassCard({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`rounded-3xl p-5 bg-white/10 shadow-2xl backdrop-blur-xl border border-white/20 text-white hover:shadow-3xl hover:scale-[1.03] transition-all ${className}`}>
      {children}
    </div>
  );
}

/* Section */
function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-6">
      <h2 className="text-2xl font-bold mb-4 text-white drop-shadow-md">{title}</h2>
      {children}
    </div>
  );
}

/* NavItem */
function NavItem({ label, icon, active, onClick }: { label: string; icon: string; active: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`flex flex-col items-center justify-center px-3 py-1 rounded-2xl transition-all ${
        active ? "text-white bg-white/20 shadow-md scale-110" : "text-white/70 hover:text-white"
      }`}
    >
      <span className="text-2xl drop-shadow-md">{icon}</span>
      <span className="text-xs mt-1 drop-shadow-sm">{label}</span>
    </button>
  );
}

/* FloatingInput */
function FloatingInput({ label, value, onChange, type = "text" }: { label: string; value: string; onChange: (val: string) => void; type?: string }) {
  return (
    <div className="relative">
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="peer w-full p-3 rounded-xl border border-white/30 bg-transparent text-white placeholder-transparent focus:border-white/50 focus:ring-2 focus:ring-white/30"
        placeholder={label}
      />
      <label className="absolute right-3 top-2 text-white/70 text-sm transition-all peer-placeholder-shown:top-3 peer-placeholder-shown:text-white/50 peer-placeholder-shown:text-base peer-focus:top-2 peer-focus:text-sm peer-focus:text-white">
        {label}
      </label>
    </div>
  );
}

/* EditProfileModal */
function EditProfileModal({ profile, setProfile, close }: { profile: any; setProfile: any; close: () => void }) {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/30 backdrop-blur-lg z-50 animate-fadeIn">
      <div className="bg-white/10 backdrop-blur-2xl p-6 rounded-3xl shadow-2xl w-80 animate-scaleIn">
        <h2 className="text-lg font-bold mb-4 text-white drop-shadow-md">ویرایش پروفایل</h2>
        <form
          onSubmit={(e) => { e.preventDefault(); close(); }}
          className="space-y-4"
        >
          <FloatingInput label="نام" value={profile.name} onChange={(val: string) => setProfile({ ...profile, name: val })} />
          <FloatingInput label="سن" type="number" value={profile.age.toString()} onChange={(val: string) => setProfile({ ...profile, age: Number(val) })} />
          <FloatingInput label="شماره تلفن" value={profile.phone} onChange={(val: string) => setProfile({ ...profile, phone: val })} />
          <div className="flex justify-between mt-6">
            <button type="button" onClick={close} className="px-4 py-2 rounded-lg bg-white/20 text-white hover:bg-white/30">لغو</button>
            <button type="submit" className="px-4 py-2 rounded-lg bg-gradient-to-r from-blue-500/40 to-indigo-600/40 text-white hover:opacity-90 shadow-lg">ذخیره</button>
          </div>
        </form>
      </div>
    </div>
  );
}

/* PdfModal */
function PdfModal({ pdfUrl, close }: { pdfUrl: string; close: () => void }) {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/30 backdrop-blur-lg z-50 animate-fadeIn">
      <div className="bg-white/10 backdrop-blur-2xl p-4 rounded-3xl w-[90%] max-w-3xl h-[80%] flex flex-col">
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-lg font-bold text-white drop-shadow-md">مشاهده آزمایش</h2>
          <button onClick={close} className="text-white hover:text-gray-200">✖️</button>
        </div>
        <iframe src={pdfUrl} className="flex-1 w-full border rounded-xl" />
      </div>
    </div>
  );
}
