import { DataSource } from "typeorm";
import { User } from "../entity/userEntity";
import { Token } from "../entity/Token";
import * as dotenv from "dotenv";
dotenv.config();
export const AppDataSource=new DataSource(
{
type:"postgres",
host:"localhost",
 port: 5433,
 username: "postgres",
 password: "12Kayigema",
 database: "User_db",
 synchronize: true,
 logging: ["error"],
 entities: [User,Token],
 migrations: [],
 subscribers: [],
})

export const InitializeDatabase = async():Promise<void>=>
{
    try{
        await AppDataSource.initialize()
        console.log("Database Connected Successfully")
    }
    catch(error)
    {
        console.error("Error connecting to database",error)
    }
}