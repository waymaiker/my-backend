import { Exclude, Expose } from "class-transformer"

class UserAdminDto {
  groupId?: number
  userId: string
  assigned_at?: Date
  assigned_by?: string
}

class Followers {
  groupId?: number
  userId: string
  created_at?: Date
}

export class GroupResponseDto {
  id: number;
  name: string;
  description: string;

  admins: UserAdminDto[]

  followers: Followers[]

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