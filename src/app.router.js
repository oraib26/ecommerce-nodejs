import connectDB from "../db/connection.js";
import categoriesRouter from "./modules/category/category.router.js";
import productsRouter from "./modules/product/product.router.js";
import authRouter from "./modules/auth/auth.router.js";

const initApp = (app, express) => {
  connectDB();
  app.use(express.json());
  app.get("/", (req, res) => {
    return res.status(200).json({ message: "Success" });
  });
  app.use("/categories", categoriesRouter);
  app.use("/auth", authRouter);
  app.use("/products", productsRouter);

  app.use("*", (req, res) => {
    return res.status(404).json({ message: "Page not found" });
  });
};

export default initApp;
