import { IsNotEmpty, IsNumber, IsOptional, IsPositive, IsString } from "class-validator";

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  pseudo: string;
}

export class UpdateUserDto {
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  pseudo: string;

  @IsNumber()
  @IsPositive()
  @IsOptional()
  level: number;
}