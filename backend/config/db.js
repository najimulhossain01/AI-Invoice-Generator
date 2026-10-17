const mongoose = require("mongoose");

let cached = global.mongoose;

if (!cached) {
    cached = global.mongoose = { conn: null, promise: null };
}

const connectDB = async () => {
    if (cached.conn) {
        return cached.conn;
    }

    if (!process.env.MONGODB_URI) {
        console.error("MONGODB_URI environment variable is missing!");
        if (!process.env.VERCEL) {
            process.exit(1);
        }
        throw new Error("MONGODB_URI is not set in environment variables");
    }

    if (!cached.promise) {
        cached.promise = mongoose.connect(process.env.MONGODB_URI).then((instance) => {
            console.log(`\n MongoDB Connected !!!\n ${instance.connection.host}`);
            return instance;
        });
    }

    try {
        cached.conn = await cached.promise;
    } catch (error) {
        cached.promise = null;
        console.error("Connection Failed !!!", error);
        if (!process.env.VERCEL) {
            process.exit(1);
        }
        throw error;
    }

    return cached.conn;
};

module.exports = connectDB;