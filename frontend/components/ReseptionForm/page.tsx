import { useState } from "react";
import PersonelSearch from "../PersonelSearch/page";
import Petiontnav from "../PetiontNav/page";
import ServicesComponent from "../ServicesBox/page";
import VisitTypeSelector from "../VisitTypeSelector/page";
import DoctorVisitForm from "../DoctorVisitForm/page";
import NurseVisitForm from "../NurseVisitForm/page";
import PhysiotherapyVisitForm from "../PhysiotherapyVisitForm/page";


const ReseptionForm = () => {
  const [visitType , setVisitType] = useState<String>();
  return (
    <>
      <Petiontnav />
      <div className="flex flex-col bg-white mt-5 px-10 py-2 rounded-2xl gap-8 ">
        <VisitTypeSelector onSelect={setVisitType} />
        {/* filter on visit type */}
        {
          visitType === "1" && <DoctorVisitForm />
        }
            {
          visitType === "2" && <NurseVisitForm />
        }
          
            {
          visitType === "3" && <PhysiotherapyVisitForm />
        }
      </div>
    </>
  )
}

export default ReseptionForm;