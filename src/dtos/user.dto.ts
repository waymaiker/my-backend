import { Exclude, Expose } from "class-transformer";
import { IsNotEmpty, IsNumber, IsOptional, IsPositive, IsString } from "class-validator";
import { AccountType } from "src/data";

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

export class UserResponseDto {
  id: string;
  pseudo: string;
  level: number;

  @Exclude()
  created_at: Date;

  @Exclude()
  updated_at: Date;
  accountType: AccountType;

  @Expose({ name: 'createdAt' })
  transformCreatedAt(){
    return this.created_at;
  }

  constructor(partial: Partial<UserResponseDto>){
    Object.assign(this, partial);
  }
}