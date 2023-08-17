import { Injectable } from '@nestjs/common';
import { v4 as uuid } from 'uuid';

import { data } from 'src/data';
import { ChapterResponseDto, ChapterType } from 'src/dtos/chapter.dto';

interface Chapter {
  name: string,
}

interface UpdateChapter {
  name?: string,
  level?: number
}


@Injectable()
export class ChapterService {
  getChapters(type: ChapterType): ChapterResponseDto[] {
    return data.chapters
      .filter((chapter) => chapter.type === type)
      .map((user) => new ChapterResponseDto(user));
  }

  getChapterById(type: ChapterType, id: string): ChapterResponseDto {
    const user = data.chapters
      .filter((chapter) => chapter.type === type)
      .find((user) => user.id === id)

    if(!user) return;

    return new ChapterResponseDto(user);
  }

  createChapter(type: ChapterType, {name}: Chapter): ChapterResponseDto {
    const newChapter = {
      id: uuid(),
      name,
      level: 0,
      created_at: new Date(),
      updated_at: new Date(),
      type
    };

    data.chapters.push(newChapter);
    return new ChapterResponseDto(newChapter);
  }

  updateChapter(type: ChapterType, id: string, body: UpdateChapter): ChapterResponseDto {
    const userToUpdate = data.chapters
      .filter((chapter) => chapter.type === type)
      .find((user) => user.id === id)

    if(!userToUpdate) return;

    const userIndex = data.chapters.findIndex((user) => user.id === id)
    data.chapters[userIndex] = {
      ...data.chapters[userIndex],
      ...body,
      updated_at: new Date()
    };

    return new ChapterResponseDto(data.chapters[userIndex]);
   }

  deleteChapter(id: string){
    const userIndex = data.chapters.findIndex((user) => user.id === id)

    if(userIndex === -1) return;

    data.chapters.splice(userIndex, 1);
    return;
  }
}
