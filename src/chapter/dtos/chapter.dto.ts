import { Language, SubscriptionType } from "@prisma/client";
import { Exclude, Expose } from "class-transformer";
import { IsArray, IsNotEmpty, IsNumber, IsOptional, IsPositive, IsString } from "class-validator";

export interface Chapters {
  chapters: {
    id: string,
    name: string,
    max_level: number,
    language: Language,
    exercises: number[],
    created_at: Date,
    updated_at: Date,
    scope: SubscriptionType
  }[]
}

export class CreateChapterDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsNumber()
  @IsPositive()
  max_level: number;

  @IsArray()
  @IsNumber()
  @IsPositive()
  exercises: number[];
}

export class UpdateChapterDto {
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  name: string;

  @IsNumber()
  @IsPositive()
  @IsOptional()
  max_level: number;

  @IsArray()
  @IsNumber()
  @IsPositive()
  @IsOptional()
  exercises: number[];

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  scope: SubscriptionType;
}

export class ChapterResponseDto {
  id: number;
  name: string;
  scope: SubscriptionType;
  exercises: number[];

  @Exclude()
  max_level: number;

  @Exclude()
  created_at: Date;

  @Exclude()
  updated_at: Date;

  @Expose({ name: 'maxLevel' })
  transformMaxLevel(){
    return this.max_level;
  }

  @Expose({ name: 'createdAt' })
  transformCreatedAt(){
    return this.created_at;
  }

  constructor(partial: Partial<ChapterResponseDto>){
    Object.assign(this, partial);
  }
}