import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from 'src/prisma/prisma.service';
import { ChapterController } from './chapter.controller';
import { ChapterService } from './chapter.service';

describe('ChapterController', () => {
  let controller: ChapterController;

  const mockPrisma = {
    user: { findMany: () => Promise.resolve([]) },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ChapterController],
      providers: [ChapterService, PrismaService]
    })
    .overrideProvider(PrismaService)
    .useValue(mockPrisma)
    .compile();

    controller = module.get<ChapterController>(ChapterController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
