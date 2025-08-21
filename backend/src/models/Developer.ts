import mongoose, { Document, Schema } from "mongoose";
//------------------------ types ----------------  //
export interface IDeveloper extends Document {
  username: string;
  password: string;
  accesskey: string;
  isSuperAdmin: boolean;
}

//-------------- schemas ----------------------- //

const develooerSchema = new Schema<IDeveloper>(
  {
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    accesskey: { type: String, required: true, unique: true },
    isSuperAdmin: { type: Boolean, default: true },
  },
  { timestamps: true }
);

// --------------------------- exports ----------------- //
export const Developer = mongoose.model<IDeveloper>(
  "Developer",
  develooerSchema
);
