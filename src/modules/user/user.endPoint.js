import { roles } from "../../middleware/auth.js";

export const endpoints = {
  getAll: [roles.Admin],

  getUser: [roles.Admin, roles.User],
};
