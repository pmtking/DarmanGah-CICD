import React from "react";
import "./style.scss";
import Card from "../Card/page";
interface Doctor {
  name: string;
  image: string;
  bookingLink: string;
  _id:string
  specialty?:string ;
  phone?:string
}

interface ModalContentProps {
  data: Doctor[];
}

const ModaleContect = ({ data }: ModalContentProps) => {
  return (
    <>
      <div className="doctor-list">
        {data.map((doctor: Doctor, index) => (
          <Card
            doctorId={doctor._id}
            name={doctor.name}
            avatarUrl={doctor.image}
            specialty={doctor.specialty}
            // phone={doctor.phone}
              defaultAvatar="/images/default.png"

          />
        ))}
      </div>
    </>
  );
};

export default ModaleContect;
