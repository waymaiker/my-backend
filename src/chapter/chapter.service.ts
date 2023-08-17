import { Injectable } from '@nestjs/common';
import { v4 as uuid } from 'uuid';

import { data } from 'src/data';
import { ChapterResponseDto, ChapterType } from 'src/dtos/chapter.dto';

interface Chapter {
  name: string,
  max_level: number
}

interface UpdateChapter {
  name?: string,
  max_level?: number
}


@Injectable()
export class ChapterService {
  getChapters(type: ChapterType): ChapterResponseDto[] {
    return data.chapters
      .filter((chapter) => chapter.type === type)
      .map((chapter) => new ChapterResponseDto(chapter));
  }

  getChapterById(type: ChapterType, id: number): ChapterResponseDto {
    const chapter = data.chapters
      .filter((chapter) => chapter.type === type)
      .find((chapter) => chapter.id === id)

    if(!chapter) return;

    return new ChapterResponseDto(chapter);
  }

  createChapter(type: ChapterType, {name, max_level}: Chapter): ChapterResponseDto {
    const newChapter = {
      id: data.chapters.length.valueOf(),
      name,
      max_level,
      created_at: new Date(),
      updated_at: new Date(),
      type
    };

    data.chapters.push(newChapter);
    return new ChapterResponseDto(newChapter);
  }

  updateChapter(type: ChapterType, id: number, body: UpdateChapter): ChapterResponseDto {
    const chapterToUpdate = data.chapters
      .filter((chapter) => chapter.type === type)
      .find((chapter) => chapter.id === id)

    if(!chapterToUpdate) return;

    const chapterIndex = data.chapters.findIndex((chapter) => chapter.id === id)
    data.chapters[chapterIndex] = {
      ...data.chapters[chapterIndex],
      ...body,
      updated_at: new Date()
    };

    return new ChapterResponseDto(data.chapters[chapterIndex]);
   }

  deleteChapter(id: number){
    const chapterIndex = data.chapters.findIndex((chapter) => chapter.id === id)

    if(chapterIndex === -1) return;

    data.chapters.splice(chapterIndex, 1);
    return;
  }
}
