import connectDB from "../db/connection.js";
import categoriesRouter from "./modules/category/category.router.js";
import productsRouter from "./modules/product/product.router.js";
import authRouter from "./modules/auth/auth.router.js";
import cartRouter from "./modules/cart/cart.router.js";
import couponRouter from "./modules/coupon/coupon.router.js";
import orderRouter from "./modules/order/order.router.js";
import userRouter from "./modules/user/user.router.js";

const initApp = (app, express) => {
  connectDB();
  app.use(express.json());
  app.get("/", (req, res) => {
    return res.status(200).json({ message: "Success" });
  });
  app.use("/categories", categoriesRouter);
  app.use("/auth", authRouter);
  app.use("/products", productsRouter);
  app.use("/cart", cartRouter);
  app.use("/order", orderRouter);
  app.use("/coupon", couponRouter);
  app.use("/user", userRouter);


  app.use("*", (req, res) => {
    return res.status(404).json({ message: "Page not found" });
  });
};

export default initApp;
