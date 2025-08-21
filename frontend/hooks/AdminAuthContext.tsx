// hooks/AdminAuthContext.tsx
'use client';

import { createContext, useContext, useState } from 'react';

type AdminAuthContextType = {
    adminToken: string | null;
    setAdminToken: (token: string | null) => void;
    isAdminAuthenticated: boolean;
};

const AdminAuthContext = createContext<AdminAuthContextType>({
    adminToken: null,
    setAdminToken: () => {},
    isAdminAuthenticated: false,
});

export const AdminAuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [adminToken, setAdminToken] = useState<string | null>(null);
    const isAdminAuthenticated = !!adminToken;

    return (
        <AdminAuthContext.Provider value={{ adminToken, setAdminToken, isAdminAuthenticated }}>
            {children}
        </AdminAuthContext.Provider>
    );
};

export const useAdminAuth = () => useContext(AdminAuthContext);
