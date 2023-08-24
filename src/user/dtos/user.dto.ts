import { SubscriptionType, Language, UserType } from "@prisma/client";
import { Exclude, Expose } from "class-transformer";
import { IsEmail, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsPositive, IsString, Matches, MinLength } from "class-validator";

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  pseudo: string;

  @IsString()
  @IsNotEmpty()
  @IsEnum(Language)
  profile_language: Language;

  @Matches(/^(\d{4,30})$|^(\(?\d{2,3}\)?[ .-]?)?\d{3,6}[-. ]?\d{3,10}$|^\+?\(?([0-9]{3})\)?[-. ]?([0-9]{2,3})[-. ]?([0-9]{4,6})[-. ]?(\d{3,6})?$|^(\([0-9]{3}\)\s*|[0-9]{3}\-)[0-9]{3}-[0-9]{4}$/, {
    message: 'phone must be a valid phone number'
  })
  phone: string;

  @IsEmail()
  email: string;

  @IsString()
  @MinLength(8)
  password: string;

  @IsString()
  @IsNotEmpty()
  @IsEnum(UserType)
  user_type: UserType

  @IsString()
  @IsNotEmpty()
  @IsEnum(SubscriptionType)
  scope: SubscriptionType
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
  scope: SubscriptionType;

  @IsNumber()
  @IsPositive()
  @IsOptional()
  finished_level: number;
}

export class UserResponseDto {
  id: string;
  pseudo: string;
  scope: SubscriptionType;

  @Exclude()
  user_type: UserType;

  @Exclude()
  profile_language: Language;

  @Exclude()
  finished_level: number;

  @Exclude()
  created_at: Date;

  @Exclude()
  updated_at: Date;

  @Expose({ name: 'userType' })
  transformUserType(){
    return this.user_type;
  }

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