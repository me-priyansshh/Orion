//=========== ALL IMPORTS ==========//
import mongoose from "mongoose";
import colors from "colors";

//=========== CONNECT TO MONGO DB ==========//
const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGODB_URL, {
        });
        console.log('MongoDB Connected Successfully: OrionDB'.rainbow.bold);
    } catch (error) {
        console.log(`Error: ${error.message}`.red.bold);
        process.exit(1);
    }
};
//=========== EXPORT HERE ==========//
export default connectDB;