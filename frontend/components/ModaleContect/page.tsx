import React from "react";
import "./style.scss";
import Card from "../Card/page";
interface Doctor {
  name: string;
  image: string;
  bookingLink: string;
}

interface ModalContentProps {
  data: Doctor[];
}

const ModaleContect = ({ data }: ModalContentProps) => {
  return (
    <>
      <div className="doctor-list">
        {data.map((doctor, index) => (
          // <div className="doctor-card" key={index}>
          //   <img
          //     src={doctor.image}
          //     alt={doctor.name}
          //     className="doctor-image"
          //   />
          //   <h4 className="doctor-name">{doctor.name}</h4>
          //   <a
          //     href={doctor.bookingLink}
          //     className="booking-button"
          //     target="_blank"
          //     rel="noopener noreferrer"
          //   >
          //     رزرو نوبت
          //   </a>
          // </div>
          <Card image={doctor.image} name={doctor.name} />
        ))}
      </div>
    </>
  );
};

export default ModaleContect;
