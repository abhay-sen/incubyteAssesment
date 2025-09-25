import mongoose, { Document, Model } from "mongoose";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
dotenv.config();

const SALT_ROUNDS = Number(process.env.SALT_ROUNDS || 10);

export interface IUser extends Document {
  name?: string;
  email: string;
  password: string;
  isAdmin: boolean;
  comparePassword(candidate: string): Promise<boolean>;
}

const userSchema = new mongoose.Schema<IUser>(
  {
    name: { type: String },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: { type: String, required: true },
    isAdmin: { type: Boolean, default: false },
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(SALT_ROUNDS);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.methods.comparePassword = function (candidate: string) {
  return bcrypt.compare(candidate, this.password);
};

// ✅ Define the document type explicitly
export type UserDocument = mongoose.HydratedDocument<IUser>;

// ✅ Define the model type explicitly
export interface UserModel extends Model<IUser> {}

const User = mongoose.model<IUser, UserModel>("User", userSchema);
export default User;
