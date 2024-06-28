import cors from "cors";
import categoryRouter from "./modules/category/category.router.js";
import productRouter from "./modules/product/product.router.js";
import authRouter from "./modules/auth/auth.router.js";
import userRouter from "./modules/user/user.router.js";
import reviewRouter from "./modules/review/review.router.js";
import subcategoryRouter from "./modules/subcategory/subcategory.router.js";
import couponRouter from "./modules/coupon/coupon.router.js";
import cartRouter from "./modules/cart/cart.router.js";
import orderRouter from "./modules/order/order.router.js";
import connectDB from "../db/connection.js";

const initApp = (app, express) => {
  connectDB();
  app.use(cors());
  app.use(express.json());
  app.get("/", (req, res) => {
    return res.status(200).json({ message: "welcome" });
  });

  app.use("/categories", categoryRouter);
  app.use("/auth", authRouter);
  app.use("/user", userRouter);
  app.use("/subcategory", subcategoryRouter);
  app.use("/products", productRouter);
  app.use("/cart", cartRouter);
  app.use("/coupon", couponRouter);
  app.use("/order", orderRouter);
  app.use("/review", reviewRouter);
  app.use("*", (req, res) => {
    return res.status(404).json({ message: "page not found" });
  });
  app.use((err, req, res, next) => {
    res.status(err.statusCode).json({ message: err.message });
  });
};
export default initApp;
