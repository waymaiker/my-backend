import { Exclude, Expose } from "class-transformer";
import { IsNotEmpty, IsNumber, IsOptional, IsPositive, IsString } from "class-validator";
import { Language, Subscription } from "./shared/types";

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  pseudo: string;

  @IsString()
  @IsNotEmpty()
  profile_language: Language;
}

export class UpdateUserDto {
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  pseudo: string;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  profile_language: Language;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  scope: Subscription;

  @IsNumber()
  @IsPositive()
  @IsOptional()
  finished_level: number;
}

export class UserResponseDto {
  id: string;
  pseudo: string;
  scope: Subscription;

  @Exclude()
  profile_language: Language;

  @Exclude()
  finished_level: number;

  @Exclude()
  created_at: Date;

  @Exclude()
  updated_at: Date;

  @Expose({ name: 'finishedLevel' })
  transformFinishedLevel(){
    return this.finished_level;
  }

  @Expose({ name: 'profileLanguage' })
  transformProfileLanguage(){
    return this.profile_language;
  }

  @Expose({ name: 'createdAt' })
  transformCreatedAt(){
    return this.created_at;
  }

  constructor(partial: Partial<UserResponseDto>){
    Object.assign(this, partial);
  }
}