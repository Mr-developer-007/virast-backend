import type { Context } from "hono";
import Collection from "../model/collectionModel";
import { deleteImage, saveImage } from "../helper/saveImage";


export const createCollaction = async(c:Context)=>{
    try {
        const body = await c.req.parseBody();
        const title = body.title as string;
        const des = body.des as string;
        const color = body.color as string;
        const image = body.image as File;
        const state = body.state as string[] | string;
         if (!title || !des || !color || !image) {
      return c.json(
        { success: false, message: "All required fields must be filled" },
        400
      );
    }


 const exists = await Collection.findOne({
     title
    });
   if (exists) {
      return c.json(
        { success: false, message: "Collection already exists" },
        409
      );
    }

       const statesArray =
      typeof state === "string" ? state.split(",") : state || [];


 const slug = title.toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, "") 
      .replace(/\s+/g, "-")  
      .replace(/-+/g, "-"); 

let imgpath= "";


if(image){
    imgpath = await saveImage(image,"collection")
}


      const collection = await Collection.create({
      title,
      slug,
      des,
      color,
      image:imgpath,
      state: statesArray,
    });

 return c.json(
      {
        success: true,
        message: "Collection created successfully",
        data: collection,
      },
      201
    );
    } catch (error) {
        console.error(error);
    return c.json(
      { success: false, message: "Failed to create collection" },
      500
    );
    }
}


export const deleteCollection = async (c: Context) => {
  try {
    const id = c.req.param("id");

    if (!id) {
      return c.json(
        { success: false, message: "Collection ID is required" },
        400
      );
    }

    const collection = await Collection.findById(id);

    if (!collection) {
      return c.json(
        { success: false, message: "Collection not found" },
        404
      );
    }

    if (collection.image) {
      await deleteImage(collection.image);
    }

    await collection.deleteOne();

    return c.json(
      {
        success: true,
        message: "Collection deleted successfully",
      },
      200
    );
  } catch (error) {
    console.error(error);
    return c.json(
      { success: false, message: "Failed to delete collection" },
      500
    );
  }
};


