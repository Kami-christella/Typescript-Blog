// import {
//   IsEmail,
//   IsEnum,
//   IsNotEmpty,
//   IsOptional,
//   Matches,
//   MinLength,
//   registerDecorator,
//   ValidationArguments,
//   ValidationOptions,
// } from 'class-validator';

// // Optional: Role enum for better type safety
// export enum Role {
//   USER = 'user',
//   ADMIN = 'admin',
// }

// export class CreateUserDto {
//   @IsOptional()
//   name!: string;
//   // Must be a valid email
//   @IsEmail({}, { message: 'Email must be valid' })
//   email!: string;

//   // Strong password rule:
//   // - at least 6 characters
//   // - includes uppercase, lowercase, number, and special char
//   @Matches(
//     /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\w\s]).{6,}$/,
//     {
//       message:
//         'Password must be at least 6 characters and include uppercase, lowercase, number, and special character',
//     }
//   )
//   password!: string;

//   @MinLength(6, { message: 'Confirm password must be at least 6 characters' })
//   confirmPassword!: string;

//   // Only allow "user" or "admin"
//   @IsEnum(Role, { message: 'Role must be either user or admin' })
//   role!: Role;

//   @IsNotEmpty({ message: 'OTP is required' })
//   otp!: number;

//   @IsOptional()
//   otpExpires?: Date;
// }
