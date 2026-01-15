import type { Context } from "hono";
import User from "../model/userModel";
import { setCookie } from "hono/cookie";
import JWT from "jsonwebtoken"
export const CreateAdmin = async (c: Context) => {
  try {
    const body = await c.req.json();
    const { name, email, password } = body;
    if (!name || !email || !password) {
      return c.json(
        { success: false, message: "All fields are required" },
        400
      );
    }
    const allReadyUser = await User.findOne({ email });
    if (allReadyUser) {
      return c.json({ success: false, message: "Admin already exists" }, 409);
    }

    const hashPassword = await Bun.password.hash(password, {
      algorithm: "bcrypt",
      cost: 10,
    });

    await User.create({ name, email, password: hashPassword, role: "admin" });

    return c.json(
      {
        success: true,
        message: "Admin created successfully",
      },
      201
    );
  } catch (error: any) {
    return c.json(
      {
        success: false,
        message: "Internal server error",
        error: error.message,
      },
      500
    );
  }
};


export const LoginAdmin= async(c:Context)=>{
    try {
        const body = await c.req.json();
      const {email,password}  = body;
        if (!email || !password) {
      return c.json(
        { success: false, message: "Email and password are required" },
        400
      );
    }

      const getAdmin = await User.findOne({email,role:"admin"});

      if(!getAdmin){
  return c.json(
        { success: false, message: "Admin not found" },
        404
      );
      }

      const verifyPassword = await Bun.password.verify(password,`${getAdmin?.password}`)

      if(!verifyPassword){
  return c.json(
        { success: false, message: "Invalid credentials" },
        401
      );
      }


const token = await JWT.sign({id:`${getAdmin?._id}`},process.env.JWT_SECRET!,{
expiresIn:"40d"
})

      setCookie(c,"auth_token",token,{
        httpOnly: true,    
        secure: process.env.NODE_ENVD=="production",  
        sameSite: process.env.NODE_ENVD=="production"?"strict":"Lax",
        path: "/",
         maxAge: 60 * 60 * 24 * 40
      })
   
 return c.json({
      success: true,
      message: "Admin logged in successfully",
    
    });

    } catch (error:any) {
     
    return c.json(
      { success: false, message: "Server error" },
      500
    ); 
    }
}