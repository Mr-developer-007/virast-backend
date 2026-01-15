import type { Context } from "hono";
import { saveImage } from "../helper/saveImage";
import Product from "../model/productModel";


export const createProduct = async (c: Context) => {
  try {
    // 1. Parse the multipart/form-data body
    // { all: true } ensures we get arrays for fields with multiple values (like images)
    const body = await c.req.parseBody({ all: true });

    // 2. Extract Basic Fields
    const name = body.name as string;
    const description = body.description as string;
    const richDescription = (body.richDescription as string) || "";
    
    const price = Number(body.price);
    const salePrice = body.salePrice ? Number(body.salePrice) : 0;
    
    const category = body.category as string;
    
    const hasVariants = body.hasVariants === "true";
    const isFeatured = body.isFeatured === "true"; // Defaults to false if undefined
    
    const fabric = (body.fabric as string) || "";
    const washCare = (body.washCare as string) || "";
    const occasion = (body.occasion as string) || "";
    
    // SEO Fields (optional)
    const metaTitle = (body.metaTitle as string) || "";
    const metaDescription = (body.metaDescription as string) || "";

    // 3. Validation: Check Required Fields
    if (!name || !description || !price || !category) {
      return c.json({ success: false, message: "Missing required fields: name, description, price, or category" }, 400);
    }

    if (salePrice > price) {
      return c.json({ success: false, message: "Sale price cannot be greater than regular price" }, 400);
    }

    // 4. JSON Parsing (Tags & Variants)
    let tags: string[] = [];
    let variants: any[] = [];

    try {
      // Handle tags: ensure it's an array even if parsed from string
      if (body.tags) {
        tags = typeof body.tags === 'string' ? JSON.parse(body.tags) : body.tags;
      }
      
      // Handle variants
      if (body.variants) {
        variants = typeof body.variants === 'string' ? JSON.parse(body.variants) : body.variants;
      }
    } catch (e) {
      return c.json({ success: false, message: "Invalid JSON format in 'tags' or 'variants'" }, 400);
    }

    // 5. File Handling: Thumbnail (Required)
    const thumbnailFile = body.thumbnail as File;
    if (!thumbnailFile) {
      return c.json({ success: false, message: "Thumbnail image is required" }, 400);
    }
    // Assuming saveImage returns the saved file path as a string
    const thumbnailPath = await saveImage(thumbnailFile, "product-thumbnails"); 

    // 6. File Handling: Gallery Images (Optional, Array)
    const rawImages = body.images; 
    let imagePaths: string[] = [];

    if (rawImages) {
      // Normalize to array: rawImages could be a single File or File[]
      const filesToSave = Array.isArray(rawImages) ? rawImages : [rawImages];
      
      // Filter out any non-File items and save valid ones
      const validFiles = filesToSave.filter((f): f is File => f instanceof File);
      

      imagePaths = await Promise.all(validFiles.map(async (file) => {
         return await saveImage(file, "product-gallery");
      }));
    }

    // 7. Stock Calculation
    let totalStock = 0;
    if (hasVariants && variants.length > 0) {
      // Sum up stock from all variants
      totalStock = variants.reduce(
        (sum: number, v: any) => sum + Number(v.stock || 0), 0
      );
    } else {
      totalStock = Number(body.totalStock || 0);
    }

    // 8. Slug Generation
    const slug = name
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, "") 
      .replace(/\s+/g, "-")      
      .replace(/-+/g, "-");        

    
      const newProduct = new Product({
      name,
      slug,
      description,
      richDescription,
      price,
      salePrice,
      category, // Mongoose automatically casts string ID to ObjectId
      tags,
      thumbnail: thumbnailPath,
      images: imagePaths,
      hasVariants,
      variants,
      totalStock,
      fabric,
      washCare,
      occasion,
      isFeatured,
      metaTitle,
      metaDescription
    });

    await newProduct.save();

    return c.json({ success: true, message: "Product created successfully", product: newProduct }, 201);

  } catch (error: any) {
    console.error("Create Product Error:", error);

    // Handle Duplicate Slug Error (Mongoose Error Code 11000)
    if (error.code === 11000) {
      return c.json({ success: false, message: "A product with this name already exists." }, 409);
    }

    return c.json({ success: false, message: error.message || "Internal Server Error" }, 500);
  }
};


