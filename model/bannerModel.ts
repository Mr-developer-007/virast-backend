import { Document, model, Schema } from "mongoose";
export interface IBanner extends Document {
  tag: string;
  title: string;
  des: string;
  image: string;
  status: boolean;
}

const bannerSchema = new Schema<IBanner>(
  {
    tag: {
      type: String,
      required: true,
      trim: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    des: {
      type: String,
      required: true,
      trim: true,
    },
    image: {
      type: String,
      required: true,
      trim: true,
    },
    status: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

const Banner = model<IBanner>("banners", bannerSchema);
export default Banner;
