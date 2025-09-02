// _________________________ pmt coding ________________________ //

import { useState } from "react";

interface AppointmentPayload {
  fullName: string;
  phoneNumber: string;
  insuranceType: string;
  nationalCode: string;
  doctorId: string;
  appointmentDate: string;
  appointmentTime: string;
}
export const useReserveAppointment  = () => {
    const [loading , setLoading ] = useState<boolean>(false) ;
    const [error , setError] = useState<string | null>(null) ;
    const [success , setSuccess ] = useState<boolean>(false) ;
    const reserve = async (payload:AppointmentPayload) => {
        
    }
}
