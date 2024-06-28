import { roles } from "../../middleware/auth.js";

export const endpoints = {

    create:[roles.User],
    getAll:[roles.Admin],
    orderUser:[roles.User],
    updateOrder:[roles.Admin]
}