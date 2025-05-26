
import {
  Entity, PrimaryGeneratedColumn, Column,
  CreateDateColumn, UpdateDateColumn, Unique,OneToMany
} from 'typeorm';
import { Token } from './Token';
@Entity()
@Unique(['email']) 
export class User {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  name!: string;

  @Column()
  email!: string;

  @Column()
  password!: string;

  @Column({ default: 'user' })
  role!: string;

  @Column()
  otp!: number;

  @Column({ type: 'timestamp', nullable: true })
  otpExpires!: Date;

  @Column({ default: false })
  verified!: boolean;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

 @OneToMany(() => Token, (token) => token.user, { cascade: true })
  tokens!: Token[];
}
