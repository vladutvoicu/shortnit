import mongoose, { Document, Schema } from "mongoose";

export interface IUser {
    email: string;
}

export interface IUserModel extends IUser, Document {}

const UserSchema: Schema = new Schema(
    {
        email: { type: String, required: true },
    },
    {
        versionKey: false,
    }
);

export default mongoose.model<IUserModel>("User", UserSchema);
