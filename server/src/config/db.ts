import * as mongoose from "mongoose";
import env from "./env";


const connectDB = async () => {
  try {
    const conn = await mongoose.connect(env.mongo_uri, env.mongo_options as mongoose.ConnectOptions);
    const db = mongoose.connection;

    db.on('error', console.error.bind(console, 'MongoDB connection error:'));
    db.once('open', function () {
      console.log('MongoDB Connected:', conn.connection?.host);
    });
  } catch (error: any) {
    console.error('MongoDB Connection Error:', error.message);
    process.exit(1); // Exit with a non-zero status code to indicate an error
  }
};

export default connectDB;