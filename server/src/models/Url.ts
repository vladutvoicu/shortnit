import mongoose, { Document, Schema } from "mongoose";

export interface IUrl {
    user: string;
    sourceUrl: string;
    alias: string;
    shortUrl: string;
}

export interface IUrlModel extends IUrl, Document {}

const UrlSchema: Schema = new Schema(
    {
        user: { type: Schema.Types.ObjectId, required: true, ref: "User" },
        sourceUrl: { type: String, required: true },
        shortUrl: { type: String, required: true },
        alias: { type: String, required: true },
    },
    {
        timestamps: true,
    }
);

export default mongoose.model<IUrlModel>("Url", UrlSchema);
