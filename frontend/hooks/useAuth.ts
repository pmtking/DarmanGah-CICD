

'use client'
// type
import api from "@/libs/axios";
import { useState, useEffect } from 'react';
import toast from "react-hot-toast";

interface User {
    id: number;
    name: string;
    email: string;
    password: string;
}

interface Credentials  {
    email: string;
    password: string;

}
interface RegisterData extends Credentials {
    name: string;
}
//use Auth

const useAuth = () => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<boolean>(false);

    useEffect(() => {
        const fechUser = async () => {
            try{
                setLoading(true);
                const res = await api.get('/api/auth/user');
                setUser(res.data);
                // setLoading(false);
            }catch(err:any){
                setError(err);
                setUser(null);
            }finally {
                setLoading(false);
            }

            fechUser() ;
        }


    },[])

    const register = async (data:RegisterData) => {
        try{
            setLoading(true);
            // toast.loading('درحال ثبت نام')
            const res = await api.post('/api/auth/register', data);
            setUser(res.data.user);
            setLoading(false);
            toast.success("User registered successfully.")

        }catch (err:any){
            setLoading(false);
            setError(err);
            toast.error(err.message);
        }
    }
    return {
        loading,
        error,
        user,
        register,
    }
}

export default useAuth;