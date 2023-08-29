import { Injectable } from '@nestjs/common';

import { data } from 'src/data';
import { ChapterResponseDto } from 'src/chapter/dtos/chapter.dto';
import { SubscriptionType } from '@prisma/client';

interface Chapter {
  name: string,
  max_level: number,
  exercises: number[]
}

interface UpdateChapter {
  name?: string,
  max_level?: number,
  exercises?: number[]
}

@Injectable()
export class ChapterService {
  getChapters(scope: SubscriptionType): ChapterResponseDto[] {
    return data.chapters
      .filter((chapter) => chapter.scope === scope)
      .map((chapter) => new ChapterResponseDto(chapter));
  }

  getChapterById(scope: SubscriptionType, id: number): ChapterResponseDto {
    const chapter = data.chapters
      .filter((chapter) => chapter.scope === scope)
      .find((chapter) => chapter.id === id)

    if(!chapter) return;

    return new ChapterResponseDto(chapter);
  }

  createChapter(scope: SubscriptionType, {name, max_level, exercises}: Chapter): ChapterResponseDto {
    const newChapter = {
      id: data.chapters.length.valueOf(),
      name,
      max_level,
      exercises,
      created_at: new Date(),
      updated_at: new Date(),
      scope: scope
    };

    data.chapters.push(newChapter);
    return new ChapterResponseDto(newChapter);
  }

  updateChapter(scope: SubscriptionType, id: number, body: UpdateChapter): ChapterResponseDto {
    const chapterToUpdate = data.chapters
      .filter((chapter) => chapter.scope === scope)
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
