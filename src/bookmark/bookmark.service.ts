import { ForbiddenException, Injectable } from '@nestjs/common';

import { CreateBookmarkDTO, EditBookmarkDTO } from './dto';
import { PrismaService } from './../../src/prisma/prisma.service';

@Injectable()
export class BookmarkService {
  constructor(private prisma: PrismaService) {}

  async getBookmarks(userId: number) {
    return this.prisma.bookmark.findMany({
      where: {
        userId,
      },
    });
  }

  async getBookmarkById(bookmarkId: number) {
    return this.prisma.bookmark.findUnique({
      where: {
        id: bookmarkId,
      },
    });
  }

  async createBookmark(userId: number, dto: CreateBookmarkDTO) {
    return this.prisma.bookmark.create({
      data: {
        userId,
        ...dto,
      },
    });
  }

  async editBookmark(bookmarkId: number, dto: EditBookmarkDTO) {
    const bookmark = await this.getBookmarkById(bookmarkId);
    if (!bookmark) {
      throw new ForbiddenException('Bookmark not found');
    }

    return this.prisma.bookmark.update({
      where: {
        id: bookmarkId,
      },
      data: {
        ...dto,
      },
    });
  }

  async deleteBookmark(bookmarkId: number) {
    const bookmark = await this.getBookmarkById(bookmarkId);
    if (!bookmark) {
      throw new ForbiddenException('Bookmark not found');
    }

    return this.prisma.bookmark.delete({
      where: {
        id: bookmarkId,
      },
    });
  }
}
