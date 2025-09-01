import React from "react";
import "./style.scss";
import defaultUserImage from "@/public/images/defult.png"; 
import Image from "next/image";

interface PersonelCardProps {
  name: string;
  role: string;
  imageUrl?: string;
  onDelete: () => void;
  onUpdate: () => void;
  onViewDocuments: () => void;
}

const PersonelCard: React.FC<PersonelCardProps> = ({
  name,
  role,
  imageUrl,
  onDelete,
  onUpdate,
  onViewDocuments,
}) => {
  const finalImage =
    imageUrl && imageUrl.trim() !== "" ? imageUrl : defaultUserImage;

  return (
    <div className="personel-card">
      <div className="personel-image">
        <Image src={finalImage} alt={name} width={70} height={70} />
      </div>
      <div className="personel-info">
        <h3>{name}</h3>
        <p>{role}</p>
      </div>
      <div className="personel-actions">
        <button className="delete-btn" onClick={onDelete}>🗑 حذف</button>
        <button className="update-btn" onClick={onUpdate}>✏️ ویرایش</button>
        <button className="docs-btn" onClick={onViewDocuments}>📄 مدارک</button>
      </div>
    </div>
  );
};

export default PersonelCard;
