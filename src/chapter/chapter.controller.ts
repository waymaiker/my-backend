import { Body, Controller, Delete, Get, HttpCode, Param, ParseIntPipe, Post, Put } from '@nestjs/common';

import { ChapterService } from './chapter.service';
import { CreateChapterDto, UpdateChapterDto, ChapterResponseDto, ChapterType } from 'src/dtos/chapter.dto';

@Controller('chapters/:type')
export class ChapterController {

  constructor(
    private readonly chapterService: ChapterService
  ){}

  @Get()
  getChapters(
    @Param('type') type: string
  ): ChapterResponseDto[] {
    const chapterType = type === 'freemium' ? ChapterType.FREEMIUM : ChapterType.PREMIUM;
    return this.chapterService.getChapters(chapterType);
  }

  @Get(':id')
  getChapterById(
    @Param('type') type: string,
    @Param('id', ParseIntPipe) id: number
  ): ChapterResponseDto {
    const chapterType = type === 'freemium' ? ChapterType.FREEMIUM : ChapterType.PREMIUM;
    return this.chapterService.getChapterById(chapterType, id);
  }

  @Post()
  createChapter(
    @Param('type') type: string,
    @Body() body: CreateChapterDto
  ): ChapterResponseDto {
    const chapterType = type === 'freemium' ? ChapterType.FREEMIUM : ChapterType.PREMIUM;
    return this.chapterService.createChapter(chapterType, body);
  }

  @Put(':id')
  updateChapter(
    @Param('type') type: string,
    @Param('id', ParseIntPipe) id: number,
    @Body() body: UpdateChapterDto,
  ): ChapterResponseDto {
    const chapterType = type === 'freemium' ? ChapterType.FREEMIUM : ChapterType.PREMIUM;
    return this.chapterService.updateChapter(chapterType, id, body);
  }

  @HttpCode(204)
  @Delete(':id')
  deleteChapter(@Param('id', ParseIntPipe) id: number){
    return this.chapterService.deleteChapter(id);
  }
}
