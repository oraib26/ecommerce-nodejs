import jwt from 'jsonwebtoken'
import userModel from '../../db/model/user.model.js';

export const auth = () => {
  return async (req, res, next) => {
    const { authorization } = req.headers;

    if (!authorization?.startsWith(process.env.BEARERTOKEN)) {
      return res.status(400).json({ message: "invalid token" });
    }

    const token = authorization.split(process.env.BEARERTOKEN)[1];
    const decoded = jwt.verify(token, process.env.LOGINSIG);

    if (!decoded) {
      return res.status(400).json({ message: "invalid token" });
    }

    const user = await userModel.findById(decoded.id).select("userName");

    if (!user) {
      return res.status(404).json({ message: "user not found" });
    }

    req.user = user;

    next();
  };
};
