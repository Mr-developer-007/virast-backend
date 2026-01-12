import { Hono } from "hono";
import { createCollaction, deleteCollection } from "../controller/collectionController";

const route = new Hono()

route.post("/create",createCollaction)
route.delete("/delete/:id",deleteCollection)

export default route