import { UserType } from "@prisma/client";
import { IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString, Matches, MinLength } from "class-validator";
import { CreateUserDto } from "./user.dto";

export class SignUpDto extends CreateUserDto {
  @IsString()
  @IsNotEmpty()
  pseudo: string;

  @Matches(/^(\d{4,30})$|^(\(?\d{2,3}\)?[ .-]?)?\d{3,6}[-. ]?\d{3,10}$|^\+?\(?([0-9]{3})\)?[-. ]?([0-9]{2,3})[-. ]?([0-9]{4,6})[-. ]?(\d{3,6})?$|^(\([0-9]{3}\)\s*|[0-9]{3}\-)[0-9]{3}-[0-9]{4}$/, {
    message: 'phone must be a valid phone number'
  })
  phone: string;

  @IsEmail()
  email: string;

  @IsString()
  @MinLength(8)
  password: string;

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