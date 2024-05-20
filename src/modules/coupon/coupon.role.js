import { roles } from "../../middleware/auth.js";


export const endPoints ={
    create: [roles.Admin],
    delete: [roles.User],
    
}