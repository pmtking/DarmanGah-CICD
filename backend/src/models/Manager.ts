import mongoose, { Document, Schema } from "mongoose";

// ----------------------- types ----------- //
export interface IManager extends Document {
  username: string;
  password: string;
  accesskey: string;
  isSuperAdmin: boolean;
}

const managerSchema = new Schema<IManager>(
  {
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true, unique: true },
    isSuperAdmin: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const Manager = mongoose.model<IManager>("Manager", managerSchema);
