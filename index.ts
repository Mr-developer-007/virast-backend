import { Hono } from "hono";
import mongoose from "mongoose";
import BannerRoute from "./routes/bannerRoutes"
import categoryRoute from "./routes/categoryRoutes"
import collectionsRoute from "./routes/collectionRoute"
import userRoute from "./routes/userRoute"
import { serveStatic } from "hono/bun";

const app = new Hono();

app.use('/uploads/*', serveStatic({ root: './' }));





app.route("/api/v1/banner",BannerRoute)
app.route("/api/v1/category",categoryRoute)
app.route("/api/v1/collection",collectionsRoute)
app.route("/api/v1/user",userRoute)



















mongoose
  .connect(process.env.DB_URL as string)
  .then(() => {
    const server = Bun.serve({
      fetch: app.fetch, 
      port: process.env.PORT,
    });

    console.log(`✅ Server running on ${server.url}`);
  })
  .catch((error) => {
    console.error("❌ MongoDB connection error:");
    console.error(error.message);
    process.exit(1);
  });
   

  