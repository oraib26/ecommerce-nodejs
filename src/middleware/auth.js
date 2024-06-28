import jwt from "jsonwebtoken";

import { AppError } from "../utls/AppError.js";
import userModel from "../../DB/model/user.model.js";

export const roles = {
  Admin: "Admin",
  User: "User",
};

export const auth = (accessRoles = []) => {
  return async (req, res, next) => {
    const { authorization } = req.headers;
    if (!authorization?.startsWith(process.env.BEARERKEY)) {
      return next(new AppError(`Invalid authorization`, 401));
    }
    const token = authorization.split(process.env.BEARERKEY)[1];
    const decoded = jwt.verify(token, process.env.LOGINSECRET);
    if (!decoded) {
      return next(new AppError(`Invalid authorization`, 401));
    }
    const user = await userModel
      .findById(decoded.id)
      .select("userName role changePasswordTime");
    if (!user) {
      return next(new AppError(`not register user`, 404));
    }

    if (parseInt(user.changePasswordTime?.getTime() / 1000) > decoded.iat) {
      return next(new AppError(`expired token ,plz login`, 400));
    }

    if (!accessRoles.includes(user.role)) {
      return next(new AppError(`not auth user`, 404));
    }

    req.user = user;
    next();
  };
};
