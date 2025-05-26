import {Entity,PrimaryGeneratedColumn,Column, CreateDateColumn, UpdateDateColumn } from "typeorm"
@Entity()

export  class User
{
@PrimaryGeneratedColumn("uuid")
id!:string;

@Column({length:100})
name!:string;

@Column({length:100,unique:true,nullable:true})
email!:string;

@CreateDateColumn()
createdAt!:Date;

@UpdateDateColumn()
updatedAt!:Date;

}