import mongoose from "mongoose";

const connectDB = async () => {
    try{
        const conn = await mongoose.connect(process.env.MONGO_URL);
        console.log(`Connected to Mongodb Database ${conn.connection.host}`);
    }
    catch(err){
        console.error(`Fatal: Could not connect to MongoDB — ${err.message}`);
        process.exit(1); // Stop the server — no point running without a database
    }
}

export default connectDB;