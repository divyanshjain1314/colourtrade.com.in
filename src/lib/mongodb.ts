import mongoose from 'mongoose';
import { setServers } from 'node:dns/promises';

if (process.env.NODE_ENV === 'development') {
  setServers(['8.8.8.8', '1.1.1.1']);
}

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable');
}

let cached = (global as any).mongoose;

if (!cached) {
  cached = (global as any).mongoose = { conn: null, promise: null };
}

async function connectToDatabase() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
      maxPoolSize: 10,
    };

    console.log("=> Attempting to connect to MongoDB...");

    cached.promise = mongoose.connect(MONGODB_URI!, opts).then((mongooseInstance) => {
      console.log("=> MongoDB Connected Successfully");
      return mongooseInstance;
    }).catch((error) => {
      console.error("=> MongoDB Connection Error:", error);
      throw error;
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}

export default connectToDatabase;