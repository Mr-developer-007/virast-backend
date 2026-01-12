import path from "path"
import { $ } from "bun"



export const saveImage= async(file : File,newpath:string)=>{

     const uploadDir = path.join(process.cwd(), "uploads",newpath); 
     const filename = `${crypto.randomUUID()}.${file.name.split(".")[1]}`;
const filepath = path.join(uploadDir, filename);
await  Bun.write(filepath, Buffer.from(await file.arrayBuffer()));
return `/uploads/${newpath}/${filename}`;

}

export const deleteImage= async(newpath:string)=>{
     if(!newpath.startsWith("/uploads")) return
 const imgpath =    path.join(process.cwd(),newpath)
   await  $ `rm   ${imgpath}`
}



