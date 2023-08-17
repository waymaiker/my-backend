import { Body, Controller, Delete, Get, HttpCode, Param, ParseUUIDPipe, Post, Put } from '@nestjs/common';

import { ChapterService } from './chapter.service';
import { CreateChapterDto, UpdateChapterDto, ChapterResponseDto, ChapterType } from 'src/dtos/chapter.dto';

@Controller('chapters/:type')
export class UserController {

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
    @Param('id', ParseUUIDPipe) id: string
  ): ChapterResponseDto {
    const chapterType = type === 'freemium' ? ChapterType.FREEMIUM : ChapterType.PREMIUM;
    return this.chapterService.getChapterById(chapterType, id);
  }

  @Post()
  createChapter(
    @Param('type') type: string,
    @Body() {name}: CreateChapterDto
  ): ChapterResponseDto {
    const chapterType = type === 'freemium' ? ChapterType.FREEMIUM : ChapterType.PREMIUM;
    return this.chapterService.createChapter(chapterType, {name});
  }

  @Put(':id')
  updateChapter(
    @Param('type') type: string,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() body: UpdateChapterDto,
  ): ChapterResponseDto {
    const chapterType = type === 'freemium' ? ChapterType.FREEMIUM : ChapterType.PREMIUM;
    return this.chapterService.updateChapter(chapterType, id, body);
  }

  @HttpCode(204)
  @Delete(':id')
  deleteChapter(@Param('id', ParseUUIDPipe) id: string){
    return this.chapterService.deleteChapter(id);
  }
}
