import { roles } from "../../middleware/auth.js";


export const endPoints ={
    create: [roles.User],
    delete: [roles.User,roles.Admin],
    all:[roles.Admin],
    getOrder:[roles.User],
    changeStatus:[roles.Admin],
}