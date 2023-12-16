import mongoose from "mongoose";
import env from "./env";

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(env.MONGO_URI);

    console.log('MongoDB Connected:', conn.connection?.host);
  } catch (error: any) {
    console.error('Error:', error.message);
    process.exit(1); // Exit with a non-zero status code to indicate an error
  }
};

export default connectDB;