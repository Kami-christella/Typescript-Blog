import { title } from "process";
import { AppDataSource } from "../config/database";
import { User } from "../entity/user";
import {Response,Request,NextFunction} from "express";

export class UserController{
private UserRepository=AppDataSource.getRepository(User)

    async createUser(request:Request,response:Response,next:NextFunction)
    {
    const {name,email}=request.body;
      const user =this.UserRepository.create({
        name,
        email
      })
      try{
        //save user to database
        const savedUser=await this.UserRepository.save(user);
        //extract only required fields from savedUser to avoid circular structures
        return  {
      id: savedUser.id,
      name: savedUser.name,
      email: savedUser.email
    }; 
      }
      catch(error)
      {
        return {
            message:error instanceof Error?error.message:"The user could not be created, the user already exists",
        };
      }
    }

// retrieve all users
async AllUsers(request:Request,response:Response,next:NextFunction)
{
    try {
        const users=await this.UserRepository.find();
        return users
    }
    catch(error)
    {
        next(error);
    }
}
async FindUser(request:Request,response:Response,next:NextFunction)
{
    const id=request.params.id;
    try{
        const user=await this.UserRepository.findOne({where:{id:id}})
        if(!user)
        {
            return "User not Found"

        }
        return user
    }
    catch(error)
    {
      return next(error)
    }
}

// update  an existing user

async UpdateUser(request:Request,response:Response,next:NextFunction)
{
    const id=request.params.id;
    const {name,email}=request.body;
    try{
        const userToUpdate=await this.UserRepository.findOne({where:{id:id}});
        if(!userToUpdate)
        {
            return {message:"User not found"}
        }
        //create a new object with updated fields

        const updatedUserData={
            ...userToUpdate,
            name:name??userToUpdate.name,
            email:email??userToUpdate.email,
        };
        const updatedUser=await this.UserRepository.save(updatedUserData);
        return {message:"User Updated Successfully",user:updatedUser}
    }
    catch(error)
    {
        return next(error);
    }
}

// Delete user

async RemoveUser(request:Request,response:Response,next:NextFunction)
{
const id=request.params.id;
try{
const userToDelete= await this.UserRepository.findOneBy({id:id})
if(!userToDelete)
{
    return {message:"User not found"}
}
await this.UserRepository.remove(userToDelete)
return {message:'User deleted',user:userToDelete}
}
catch(error)
{
return next(error)
}
}

    // async findOneById(id:number)
    // {
    // return this.findOneBy({id})
    // },
    // async findByName(name:string)
    // {
    //     return this.createQueryBuilder('user').where(user)
    // }
}