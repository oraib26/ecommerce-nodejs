import mongoose from "mongoose";

const connectDB = async () => {
  mongoose
    .connect(process.env.DB)
    .then(() => {
      console.log("connectDB");
    })
    .catch((err) => {
      console.log(`error ro connect db ${err}`);
    });
};

export default connectDB;
