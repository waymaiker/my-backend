import { Exclude, Expose } from "class-transformer";
import { IsNotEmpty, IsNumber, IsOptional, IsPositive, IsString } from "class-validator";

export interface Chapters {
  users: {
    id: string,
    name: string,
    level: number,
    created_at: Date,
    updated_at: Date,
    chapterType: ChapterType
  }[]
}

export enum ChapterType {
  PREMIUM = 'premium',
  FREEMIUM = 'freemium'
}

export class CreateChapterDto {
  @IsString()
  @IsNotEmpty()
  name: string;
}

export class UpdateChapterDto {
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  name: string;

  @IsNumber()
  @IsPositive()
  @IsOptional()
  level: number;
}

export class ChapterResponseDto {
  id: string;
  name: string;
  level: number;
  type: ChapterType;

  @Exclude()
  created_at: Date;

  @Exclude()
  updated_at: Date;

  @Expose({ name: 'createdAt' })
  transformCreatedAt(){
    return this.created_at;
  }

  constructor(partial: Partial<ChapterResponseDto>){
    Object.assign(this, partial);
  }
}