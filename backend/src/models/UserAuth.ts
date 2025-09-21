// user Auth
//---------------------- imports --------------//
import mongoose, { Document, Schema } from "mongoose";
//  -------------------- types ---------------- //
export interface IUserAuth extends Document {
  username: string;
  password: string;
  personnel: mongoose.Types.ObjectId;
  role: "DOCTOR" | "NURSE" | "RECEPTION" | "MANAGER" | "SERVICE";
}

//  ------------------------- schema --------------- //

const userAuthSchema = new Schema<IUserAuth>({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: {
      type: String,
      enum: ["DOCTOR", "NURSE", "RECEPTION", "MANAGER", "SERVICE"],
      required: true,
    },
    personnel: {
      type: Schema.Types.ObjectId,
      ref: "Personnel",
      required: true,
    },
},{ timestamps: true });

// -------------------------- exports ------------------//

export default mongoose.model<IUserAuth>("UserAuth", userAuthSchema);