import ClientDoctorsTable from "@/components/ClientDoctorsTable/page";
import TitleComponents from "@/components/TitleComponents/page";


export default function DoctorsPage() {
  return (
    <>
      <TitleComponents h1="پزشکان" color="#fff" classname="mt-5" />
      <main className="max-w-6xl mx-auto mt-6 p-6">
        <ClientDoctorsTable />
      </main>
    </>
  );
}
