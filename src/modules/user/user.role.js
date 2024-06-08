import { roles } from "../../middleware/auth.js";


export const endPoints ={
    getUsers: [roles.Admin],
    userData: [roles.Admin, roles.User],
   
}