import { Exclude, Expose } from "class-transformer"

class AdminsDto {
  group_id?: number
  user_id: string
  assigned_at?: Date
  assigned_by?: string
}

class FollowersDto {
  group_id?: number
  user_id: string
  created_at?: Date
}

export class GroupResponseDto {
  id: number;
  name: string;
  description: string;

  admins: AdminsDto[]

  followers: FollowersDto[]

  @Exclude()
  is_public: boolean;

  @Exclude()
  restricted_access: boolean;

  @Exclude()
  created_at: Date;

  @Exclude()
  updated_at: Date;

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