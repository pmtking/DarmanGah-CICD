import { UserProvider } from "@/context/UserContext";

interface RespontionLayoutType {
  children: React.ReactNode;
}

const RespontionLayout = ({ children }: RespontionLayoutType) => {
  return (
    <>
      <main className="flex justify-center items-center w-screen h-screen ">
        <UserProvider>{children}</UserProvider>
      </main>
    </>
  );
};

export default RespontionLayout;
