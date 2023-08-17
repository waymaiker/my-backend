import { Exclude, Expose } from "class-transformer";
import { IsNotEmpty, IsOptional, IsString } from "class-validator";

export enum Language {
  FRENCH = 'french',
  ENGLISH = 'english',
  WOLOF = 'wolof'
}

export enum ProfileType {
  PREMIUM = 'premium',
  FREEMIUM = 'freemium'
}

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
}

export class UserResponseDto {
  id: string;
  pseudo: string;

  @Exclude()
  created_at: Date;

  @Exclude()
  updated_at: Date;
  accountType: ProfileType;

  @Expose({ name: 'createdAt' })
  transformCreatedAt(){
    return this.created_at;
  }

  constructor(partial: Partial<UserResponseDto>){
    Object.assign(this, partial);
  }
}