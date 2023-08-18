import { Body, Controller, Delete, Get, HttpCode, Param, ParseIntPipe, Post, Put } from '@nestjs/common';

import { ChapterService } from './chapter.service';
import { CreateChapterDto, UpdateChapterDto, ChapterResponseDto } from 'src/dtos/chapter.dto';
import { Subscription } from 'src/dtos/shared/types';

@Controller('chapters/:scope')
export class ChapterController {

  constructor(
    private readonly chapterService: ChapterService
  ){}

  @Get()
  getChapters(
    @Param('scope') scope: string
  ): ChapterResponseDto[] {
    const chapterType = scope === 'freemium' ? Subscription.FREEMIUM : Subscription.PREMIUM;
    return this.chapterService.getChapters(chapterType);
  }

  @Get(':id')
  getChapterById(
    @Param('scope') scope: string,
    @Param('id', ParseIntPipe) id: number
  ): ChapterResponseDto {
    const chapterType = scope === 'freemium' ? Subscription.FREEMIUM : Subscription.PREMIUM;
    return this.chapterService.getChapterById(chapterType, id);
  }

  @Post()
  createChapter(
    @Param('scope') scope: string,
    @Body() body: CreateChapterDto
  ): ChapterResponseDto {
    const chapterType = scope === 'freemium' ? Subscription.FREEMIUM : Subscription.PREMIUM;
    return this.chapterService.createChapter(chapterType, body);
  }

  @Put(':id')
  updateChapter(
    @Param('scope') scope: string,
    @Param('id', ParseIntPipe) id: number,
    @Body() body: UpdateChapterDto,
  ): ChapterResponseDto {
    const chapterType = scope === 'freemium' ? Subscription.FREEMIUM : Subscription.PREMIUM;
    return this.chapterService.updateChapter(chapterType, id, body);
  }

  @HttpCode(204)
  @Delete(':id')
  deleteChapter(@Param('id', ParseIntPipe) id: number){
    return this.chapterService.deleteChapter(id);
  }
}
