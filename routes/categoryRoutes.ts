import { Hono } from "hono";
import { createCategory } from "../controller/categoryController";

const route = new Hono();


route.post("/create",createCategory)

export default route