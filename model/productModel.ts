import mongoose, { Schema, Document, Model } from "mongoose";

// 1. Interface for Variants (Size/Color combinations)
export interface IVariant {
  size: string;
  color: string;
  stock: number;
  sku?: string;
  priceOffset?: number; // Extra cost for this specific variant
}

// 2. Main Product Interface
export interface IProduct extends Document {
  name: string;
  slug: string;
  description: string;
  richDescription?: string;
  
  // Pricing
  price: number;
  salePrice?: number;
  
  // Organization
  category: mongoose.Types.ObjectId;
  subCategory?: string;
  tags: string[];
  
  // Visuals
  thumbnail: string;
  images: string[];
  
  // Inventory
  hasVariants: boolean;
  variants: IVariant[];
  totalStock: number;
  
  // Saaj Riwaaj Specifics
  fabric?: string;
  washCare?: string;
  occasion?: string;
  
  // Status
  isFeatured: boolean;
  isArchived: boolean;
  
  // SEO
  metaTitle?: string;
  metaDescription?: string;
  
  // Ratings
  averageRating: number;
  numReviews: number;

  // Timestamps (Automatically added by mongoose, but good to type)
  createdAt: Date;
  updatedAt: Date;

  // Virtuals (Not stored in DB, but accessible)
  readonly discountPercentage: number;
  readonly inStock: boolean;
}

// 3. Schema Definition
const productSchema = new Schema<IProduct>(
  {
    name: {
      type: String,
      required: [true, "Product name is required"],
      trim: true,
    },
    slug: {
      type: String,
      unique: true,
      lowercase: true,
      index: true,
    },
    description: {
      type: String,
      required: [true, "Product description is required"],
    },
    richDescription: {
      type: String,
      default: "",
    },
    price: {
      type: Number,
      required: [true, "Price is required"],
      min: 0,
    },
    salePrice: {
      type: Number,
      default: 0,
     
    },
    category: {
      type: Schema.Types.ObjectId,
      ref: "categories",
      required: true,
    },
    
    tags: [{ type: String }],
    thumbnail: {
      type: String,
      required: true,
    },
    images: [
      {
        type: String,
      },
    ],
    hasVariants: {
      type: Boolean,
      default: true,
    },
    variants: [
      {
        size: { type: String },
        color: { type: String },
        stock: { type: Number, default: 0 },
        sku: { type: String },
        priceOffset: { type: Number, default: 0 },
      },
    ],
    totalStock: {
      type: Number,
      default: 0,
    },
    fabric: { type: String },
    washCare: { type: String },
    occasion: { type: String },
    isFeatured: {
      type: Boolean,
      default: false,
    },
    isArchived: {
      type: Boolean,
      default: false,
    },
    metaTitle: String,
    metaDescription: String,
    averageRating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    numReviews: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

productSchema.virtual("discountPercentage").get(function (this:IProduct){

if(this.salePrice && this.salePrice > 0 && this.salePrice < this.price){
    const discount = ((this.price - this.salePrice) / this.price) * 100;
    return Math.round(discount);
}

})
productSchema.virtual("inStock").get(function (this: IProduct) {
  if (this.hasVariants && this.variants.length > 0) {
    return this.variants.some((v) => v.stock > 0);
  }
  return this.totalStock > 0;
});

const Product: Model<IProduct> =
  mongoose.models.Product || mongoose.model<IProduct>("Product", productSchema);

export default Product;