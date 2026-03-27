import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const connectDB = async() => {
    try{
        await mongoose.connect(process.env.MONGO_URI)
        console.log("You have connected succesfully to the DB!")
    } catch(err){
        console.error("Failed to connect to DB", err)
        process.exit(1);
    }
}

export default connectDB;