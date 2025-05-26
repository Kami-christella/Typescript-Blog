
import { UserController } from "../repository/userRepository";
export const UserRouter=[
    {
        method:"post",
        route:"/createUser",
        controller:UserController,
        action:"createUser"
    },
    {
        method:"get",
        route:"/getAllUser",
        controller:UserController,
        action:"AllUsers"
    },
    {
   method:"get",
   route:"/getUserById/:id",
   controller:UserController,
   action:"FindUser"
    },
    {
        method:"put",
        route:"/updateUser/:id",
        controller:UserController,
        action:"UpdateUser"

    },
    {
        method:"delete",
        route:"/deleteUser/:id",
        controller:UserController,
        action:"RemoveUser"
    }
]