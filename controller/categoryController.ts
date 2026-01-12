import type { Context } from "hono";
import Category from "../model/categoryModel";
import { saveImage } from "../helper/saveImage";

 export const createCategory= async(c:Context)=>{
    try {
        const body = await c.req.parseBody();
        const title= body.title as string;
        const image = body.image as File;
          
          if(!title?.trim() || !image){
 return c.json(
        { success: false, message: "Category  title  and image is required" },
        400
      );
          }


          const allreadyTitle = await Category.findOne({title});
          if(allreadyTitle){
 return c.json(
        { success: false, message: "Category already exists" },
        409
      );
          }


          const imgpath = await saveImage(image,"category");
          const slug = title.toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, "") 
      .replace(/\s+/g, "-")  
      .replace(/-+/g, "-"); 

    await Category.create({
        title,slug,image:imgpath
    })
     
    
  return c.json(
      {
        success: true,
        message: "Category created successfully",
      },
      201
    );

    } catch (error) {
          return c.json(
      { success: false, message: "Internal server error" },
      500
    ); 
    }
}

export const deleteCategory= async(C:Context)=>{

}