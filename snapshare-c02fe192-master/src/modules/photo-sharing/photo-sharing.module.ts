import { Logger, Module } from '@nestjs/common';
import { PhotoSharingService } from './photo-sharing.service';
import { PostPrismaRepository } from './post.prisma-repository';
import { PhotoSharingController } from './photo-sharing.controller';

@Module({
  controllers: [PhotoSharingController],
  providers: [
    PhotoSharingService,
    {
      provide: PhotoSharingService.LOGGER_KEY,
      useValue: new Logger(PhotoSharingService.name),
    },
    {
      provide: 'PostRepository',
      useClass: PostPrismaRepository,
    },
  ],
  exports: [PhotoSharingService],
})
export class PhotoSharingModule {}
