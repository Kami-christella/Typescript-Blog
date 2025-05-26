
import {SignIn,SignUp,Validateopt,ResetPassword,ForgotPassword,getAllusers,getUserById,Logout,updateUser,deleteUser,findUserByName,test } from "../repository/UserController";
import { CreateBlog, updateBlog, getAllBlogs} from "../repository/BlogController";
import {authenticateToken,authorize} from "../middleware/authenthicateToken"
export const UserRouter=[
    {
        method:"post",
        route:"/signup",
        controller:SignUp,
        action:"SignUp"
    },
    {
        method:"post",
        route:"/login",
        controller:SignIn,
        action:"SignIn"
    },
       {
        method:"get",
        route:"/listAll",
        controller:getAllusers,
        action:"AllUsers"
    },
    {
   method:"post",
   route:"/ValidateUser",
   controller:Validateopt,
   action:"FindUser"
    },
    {
        method:"put",
        route:"/updateUser/:id",
        controller:updateUser,
        action:"updateUser",
         middlewares: [authenticateToken], // all logged-in user can update

    },
    {
        method:"delete",
        route:"/deleteUser/:id",
        controller:deleteUser,
        action:"deleteUser",
         middlewares: [authenticateToken, authorize("admin")]
    },
    {
        method:"get",
        route:"/getUserById/:id",
        controller:getUserById,
        action:"getUserById",
         middlewares: [authenticateToken] // all logged-in user can view
    },
      {
            method: "post",
            route: "/createBlog",
            controller: CreateBlog,
            action: "CreateBlog",
            middlewares: [authenticateToken, authorize("admin")], // only admin can create blog
        },
        {
            method:"put",
            route:"/updateBlog/:id",
            controller: updateBlog,
            action:"UpdateBlog",
             middlewares: [authenticateToken, authorize("admin")],
        },
         {
        method:"get",
        route:"/getAllBlogs",
        controller:getAllBlogs,
        action:"GetAllBlogs"
    },
]