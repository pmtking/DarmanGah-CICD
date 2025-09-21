import { UserProvider } from "@/context/UserContext";

interface RespontionLayoutType {
  children: React.ReactNode;
}

const LoginLayout = ({ children }: RespontionLayoutType) => {
  return (
    <UserProvider>
      <main className="flex justify-center items-center w-screen h-screen">
        {children}
      </main>
    </UserProvider>
  );
};

export default LoginLayout;
