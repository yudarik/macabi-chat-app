import mongoose from 'mongoose';
import * as bcrypt from "bcrypt";

export interface IUser {
    username: string;
    password: string;
}

const userSchema = new mongoose.Schema<IUser>(
  {
    username: { type: "String", required: true, unique: true },
    password: { type: "String", required: true },
  },
);

userSchema.methods.matchPassword = async function (enteredPassword: string) {
  return await bcrypt.compare(enteredPassword, this.password);
};

userSchema.pre("save", async function (next) {
  if (!this.isModified) {
    next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

const User = mongoose.model("User", userSchema);

export default User;