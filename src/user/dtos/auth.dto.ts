import { UserType } from "@prisma/client";
import { IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString, MinLength } from "class-validator";
import { CreateUserDto } from "./user.dto";

export class SignUpDto extends CreateUserDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty( )
  productKey?: string
}

export class SignInDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(8)
  password: string;
}

export class GenerateProductKey {
  @IsEmail()
  email: string;

  @IsEnum(UserType)
  userType: UserType;
}