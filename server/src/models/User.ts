import mongoose, { Document, Schema } from "mongoose";

export interface IUser {
    email: string;
    password: string;
    tempUser: boolean;
}

export interface IUserModel extends IUser, Document {}

const UserSchema: Schema = new Schema(
    {
        email: { type: String, required: false },
        password: { type: String, required: false },
        tempUser: { type: Boolean, required: true },
    },
    {
        versionKey: false,
    }
);

export default mongoose.model<IUserModel>("User", UserSchema);
