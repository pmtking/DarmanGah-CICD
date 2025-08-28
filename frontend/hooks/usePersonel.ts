// =======================
// 🔸 Type Definitions
// =======================

import api from "@/libs/axios";
import { useState } from "react";
import toast from "react-hot-toast";

export interface CreatePersonnelWithAuthInput {
  name: string;
  nationalId: string;
  role: string; //Ipersonel["Role"]
  salaryType: string;
  percentageRate: number;
  phone: string;
  gender: string;
  username: string;
  password: string;
}

export interface Personnel {
  id: string;
  name: string;
  nationalId: string;
  role: string;
  salaryType: string;
  percentageRate?: number;
  phone?: string;
  gender?: string;
  username: string;
}

// =======================
// 🔹 usePersonel Hook
// =======================

const usePersonel = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [personels , setPersonels ] = useState<Personnel []> ([]) ;
  const [error , setError ] = useState<string | null> (null) ;

  // 🔹 usePersonel Hook -- >> fetchPersonel
  const fetchPersonel = async () => {
    setLoading(true);
    try {
      const res = await api.get<Personnel[]>("/personnels");
      if(!res) {
        toast('خطا در سرور')
      }
      setPersonels(res.data)
    } catch (error:any) {
        setError(error.message)
    }finally {
        setLoading(false)
    }
  };
   // 🔹 usePersonel Hook -->> addPersonel
   const addPersonel = async(newPersonel:CreatePersonnelWithAuthInput) => {
    setLoading(true) 
    try {
        const res = api.post<Personnel>('/peronel/add')
        if(!res) {
            toast.error('خطایی وجود دارد3')
        }
    } catch (error) {
        
    }
   }
  return { fetchPersonel , addPersonel };
};

export default usePersonel;
