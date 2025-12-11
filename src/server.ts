import app from "./app";
import { connectDB } from "./config/db";
import "./swagger";

connectDB()
app.listen(4040,(err)=>{
    console.log("Listening to 4040")
})

