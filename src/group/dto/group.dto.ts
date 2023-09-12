import { Exclude, Expose, Type } from "class-transformer"
import { IsArray, IsBoolean, IsNotEmpty, IsOptional, IsString, ValidateNested } from "class-validator";

class AdminsDto {
  group_id?: number;
  user_id: string;
  assigned_at?: Date;
  assigned_by?: string;
}

class FollowersDto {
  group_id: number;
  user_id: string;
  created_at?: Date;
}

export class Follower {
  @IsString()
  @IsNotEmpty()
  user_id: string
}

export class Admin {
  @IsString()
  @IsNotEmpty()
  user_id: string
}

export class CreateGroupDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsArray()
  @ValidateNested({each: true})
  @Type(() => Follower)
  @IsOptional()
  followers: Follower[];

  @IsArray()
  @ValidateNested({each: true})
  @Type(() => Admin)
  @IsOptional()
  admins: Admin[];
}

export class UpdateGroupDto {
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  name: string;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  description: string;

  @IsBoolean()
  @IsOptional()
  is_public: boolean;

  @IsBoolean()
  @IsOptional()
  restricted_access: boolean;
}

export class GroupResponseDto {
  id: number;
  name: string;
  description: string;
  admins: AdminsDto[];
  followers: FollowersDto[];

  @Exclude()
  creator_id: String;

  @Exclude()
  is_public: boolean;

  @Exclude()
  restricted_access: boolean;

  @Exclude()
  created_at: Date;

  @Exclude()
  updated_at: Date;

  @Expose({ name: 'creatorId' })
  transformCreatorId(){
    return this.creator_id;
  }

  @Expose({ name: 'createdAt' })
  transformCreatedAt(){
    return this.created_at;
  }

  @Expose({ name: 'isPublic' })
  transformIsPublic(){
    return this.is_public;
  }

  @Expose({ name: 'restrictedAccess' })
  transformRestrictedAccess(){
    return this.restricted_access;
  }

  constructor(partial: Partial<GroupResponseDto>){
    Object.assign(this, partial);
  }
}