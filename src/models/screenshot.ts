import mongoose, { Schema } from 'mongoose';

export interface IScreenshot extends mongoose.Document {
  title: string;
  description: string;
  image: Buffer;
  mimeType: string;
  fileName: string;
}

const ScreenshotSchema = new Schema<IScreenshot>(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, default: '', trim: true },
    image: { type: Buffer, required: true },
    mimeType: { type: String, required: true },
    fileName: { type: String, required: true }
  },
  { timestamps: true }
);

export default mongoose.model<IScreenshot>('Screenshot', ScreenshotSchema);
