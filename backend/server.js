import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
 import postRoutes from "./routes/posts.routes.js";
import userRoutes from "./routes/users.routes.js";
dotenv.config();

const app = express();

import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(
    "/uploads",
    express.static(path.join(__dirname, "uploads"))
);
app.use(cors({
    origin: "https://nexora-git-main-nexora-483a.vercel.app",
    credentials: true
}));


app.use(express.json());

app.use(postRoutes);
app.use(userRoutes);
app.use(express.static("uploads"));
const start  = async ()=>{
     const connectDB = mongoose.connect("mongodb+srv://hemantsy66_db_user:Y0PB6PoP5RKISK0M@collegeplacementpro0.tml9xrc.mongodb.net/?appName=CollegePlacementPro0");
     app.listen(9090,()=>{
          console.log("server is listeninig on  port 9090");
     })
}
start();