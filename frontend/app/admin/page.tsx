import Chart from "@/components/Chart/page";
import HeaderAdmin from "@/components/HeaderAdmin/page";

const AdminPage = () => {
  return (
    <main className="mt-8 h-[85%] rounded-2xl w-full bg-white/20 backdrop-blur-md border border-white/40 shadow-lg">
      <HeaderAdmin />
      <main className="flex justify-center items-center">
        <Chart />
      </main>
    </main>
  );
};

export default AdminPage;
