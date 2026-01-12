import type { Context } from "hono";
import { saveImage } from "../helper/saveImage";
import Banner from "../model/bannerModel";






export const createBanner= async(c:Context)=>{
    try {
      const body = await c.req.parseBody();
        const tag = body.tag as string;
    const title = body.title as string;
    const des = body.des as string;
    const status = body.status === "true";
    const image = body.image as File;
     if( !tag || !title || !des || !status ){
 return c.json(
        { success: false, message: "All fields are required" },
        400
      );
     }
     if(!image){
 return c.json(
        { success: false, message: "Banner image is required" },
        400
      );
     }
  if (!image.type.startsWith("image/")) {
      return c.json(
        { success: false, message: "Only image files allowed" },
        400
      );
    }
     const imgpath = await saveImage(image,"banners");
      await Banner.create({
        tag,title,des,status,image:imgpath
      })
  return c.json({
      success: true,
      message: "Banner created successfully",
     
    });
    } catch (error) {
         return c.json(
      {
        success: false,
        message: "Internal Server Error",
      },
      500
    );
    }
}


export const getAllBanner= async(c:Context)=>{
try {
    const banners = await Banner.find();
    return c.json({banners},200);
} catch (error) {
       return c.json(
      {
        success: false,
        message: "Internal Server Error",
      },
      500
    );
}
}

export const togelBanner= async(c:Context)=>{
    try {
        const id = await c.req.param("id");
         if (!id) {
      return c.json(
        { success: false, message: "Banner ID is required" },
        400
      );
    }

        const banner = await Banner.findById(id);
           if (!banner) {
      return c.json(
        { success: false, message: "Banner not found" },
        404
      );
    }
        banner.status = !banner.status;
   await banner.save()

        return c.json({
      success: true,
      message: "Banner status updated successfully",

    });     
        
    } catch (error) {
          return c.json(
      { success: false, message: "Server error" },
      500
    );
    }
}

