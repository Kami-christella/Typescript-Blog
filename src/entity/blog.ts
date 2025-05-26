import {
  Entity, PrimaryGeneratedColumn, Column,
  CreateDateColumn, UpdateDateColumn, Unique,OneToMany
} from 'typeorm';
import { Token } from './Token';
@Entity()
@Unique(['name']) 
export class Blog {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  name!: string;

  @Column()
  description!: string;

  @Column()
  comments!: string;

  @Column({ default: 'active' })
  status!: string;

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
