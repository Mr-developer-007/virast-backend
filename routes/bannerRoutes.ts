import { Hono } from "hono";
import { createBanner, getAllBanner, togelBanner } from "../controller/bannerController";

const route = new Hono();

route.post("/create",createBanner);
route.get("/get",getAllBanner);
route.put("/toggle/:id",togelBanner);



export default route