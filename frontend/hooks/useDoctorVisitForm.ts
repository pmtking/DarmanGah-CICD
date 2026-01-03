import api from "@/libs/axios";
import toast from "react-hot-toast";

const useDoctorVisitForm = () => {
  // give doctors shift
  const giveDoctorShift = async () => {
    const { data } = await api.get("/api/doctors");
    if (data) {
      toast.success("دریافت اطلاعات پزشکان");
    }
    return data
  };
  // export hooks
  return {giveDoctorShift};
};

export default useDoctorVisitForm;
