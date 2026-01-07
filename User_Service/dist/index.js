import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import userRoutes from "./UserRoutes.js";
dotenv.config();
const connectDb = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URL, {
            dbName: "Spotify",
        });
        console.log("connected");
    }
    catch (error) {
        console.log(error);
    }
};
const app = express();
const port = process.env.PORT || 5000;
app.get("/", (req, res) => {
    res.send("getting intial get request");
});
app.use("/api/v1", userRoutes);
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
    connectDb();
});
//# sourceMappingURL=index.js.map