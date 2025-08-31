import mongoose, { Schema, Document } from "mongoose";
export interface ISupplementaryInsurance {
  companyName: string;
  contractPrice: number;
}

export interface IClinicService extends Document {
  serviceCode: string;
  serviceName: string;
  serviceGroup: string;
  pricePublic: number;
  priceGovernmental: number;
  baseInsurancePrice: number;
  supplementaryInsurances: ISupplementaryInsurance[];
  isFreeForStaff: boolean;
}

const SupplementaryInsuranceSchema = new Schema<ISupplementaryInsurance>(
  {
    companyName: {
      type: String,
      required: true,
      trim: true,
    },
    contractPrice: {
      type: Number,
      required: true,
    },
  },
  { _id: false } // چون هر بیمه نیازی به آیدی جدا نداره
);
const ClinicServiceSchema: Schema = new Schema(
  {
    serviceCode: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    serviceName: {
      type: String,
      required: true,
      trim: true,
    },
    serviceGroup: {
      type: String,
      required: true,
      trim: true,
    },
    pricePublic: {
      type: Number,
      required: true,
    },
    priceGovernmental: {
      type: Number,
      required: true,
    },
    baseInsurancePrice: {
      type: Number,
      required: true,
    },
    supplementaryInsurances: {
      type: [SupplementaryInsuranceSchema],
      default: [],
    },
    isFreeForStaff: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);


const ClinicService = mongoose.model("ClinicService" , ClinicServiceSchema) 

export default ClinicService