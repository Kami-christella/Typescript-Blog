
// import { UserController } from "../repository/userRepository";
// export const UserRouter=[
//     {
//         method:"post",
//         route:"/createUser",
//         controller:UserController,
//         action:"createUser"
//     },
//     {
//         method:"get",
//         route:"/getAllUser",
//         controller:UserController,
//         action:"AllUsers"
//     },
//     {
//    method:"get",
//    route:"/getUserById/:id",
//    controller:UserController,
//    action:"FindUser"
//     },
//     {
//         method:"put",
//         route:"/updateUser/:id",
//         controller:UserController,
//         action:"UpdateUser"

//     },
//     {
//         method:"delete",
//         route:"/deleteUser/:id",
//         controller:UserController,
//         action:"RemoveUser"
//     }
// ]

import express, { Router } from 'express';
import {
  SignIn,
  SignUp,
  Validateopt,
  ResetPassword,
  ForgotPassword,
  getAllusers,
  getUserById,
  Logout,
  updateUser,
  deleteUser,
  findUserByName,
  test
} from "../repository/UserController";

import { authenticated } from '../middleware/auth.middleware';
import { authorize } from "../middleware/authenthicateToken";
import { validate } from '../middleware/validation.middleware';
import {authorizeRole} from '../middleware/autharization';
import {
  getUserByIdSchema,
  updateUserSchema,
  deleteUserSchema,
  createUserSchema
} from '../schemas/user.schema';

const UserRouter: Router = express.Router();

//  Public routes (no auth)
UserRouter.post('/login', SignIn);
UserRouter.post('/signup', validate(createUserSchema), SignUp);
UserRouter.post('/Validateopt/:token', Validateopt);

//  Protected routes (with auth)
//UserRouter.use(authenticated);

UserRouter.get('/getUserById/:id', getUserById);

UserRouter.get('/listAll', getAllusers);

// UserRouter.put('/updateUser/:id', authorize('admin'), validate(updateUserSchema), updateUser);
//UserRouter.put('/updateUser/:id', updateUser,  validate(createUserSchema),authorize('admin'));

UserRouter.put('/updateUser/:id', 
        // authorizeRole("admin"),
  validate(createUserSchema),  
  updateUser                  
);

//Router.get("/profile",authentification as any,authorizeRole("admin"),AuthController.getProfile as any);

UserRouter.delete('/deleteUser/:id', authorizeRole('admin'), validate(deleteUserSchema), deleteUser);

UserRouter.post('/forgotpassword',ForgotPassword)

UserRouter.post('/resetpassword/:token',ResetPassword)

export default UserRouter;
