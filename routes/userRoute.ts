import { Hono } from "hono";
import { CreateAdmin, LoginAdmin } from "../controller/userController";

const route = new Hono();

route.post("/admin/create",CreateAdmin);
route.post("/admin/login",LoginAdmin)




export default route 