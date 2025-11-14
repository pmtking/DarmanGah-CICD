import PersonelSearch from "../PersonelSearch/page";
import Petiontnav from "../PetiontNav/page";
import ServicesComponent from "../ServicesBox/page";
import VisitTypeSelector from "../VisitTypeSelector/page";


const ReseptionForm = () => {
  return (
    <>
      <Petiontnav />
      <div className="flex flex-col bg-white mt-5 px-10 py-2 rounded-2xl gap-8 ">
        <VisitTypeSelector onSelect={() => console.log('s')} />
        <PersonelSearch  />
        <ServicesComponent doctorSpecialty="عمومی" />
      </div>
    </>
  )
}

export default ReseptionForm;