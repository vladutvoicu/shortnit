import mongoose, { Document, Schema } from "mongoose";

export interface IResetToken {
    email: string;
    urlId: string;
}

export interface IResetTokenModel extends IResetToken, Document {}

const ResetTokenSchema: Schema = new Schema(
    {
        email: { type: String, required: true },
        urlId: { type: String, required: true },
        createdAt: { type: Date, default: Date.now },
    },
    {
        versionKey: false,
    }
);

ResetTokenSchema.index({ createdAt: 1 }, { expireAfterSeconds: 43200 }); // expires after 12 hours

export default mongoose.model<IResetTokenModel>("ResetToken", ResetTokenSchema);
