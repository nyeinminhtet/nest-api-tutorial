import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { GetUser } from 'src/auth/decorator';
import { BookmarkService } from './bookmark.service';
import { CreateBookmarkDTO, EditBookmarkDTO } from './dto';

@UseGuards(AuthGuard('jwt'))
@Controller('bookmark')
export class BookmarkController {
  constructor(private bookmarkService: BookmarkService) {}

  // get all bookmarks
  @Get()
  getBookmarks(@GetUser('id') userId: number) {
    return this.bookmarkService.getBookmarks(userId);
  }

  // get bookmark by id
  @Get(':id')
  getBookmarkById(@Param('id', ParseIntPipe) bookmarkId: number) {
    return this.bookmarkService.getBookmarkById(bookmarkId);
  }

  // create bookmark
  @Post()
  createBookmark(
    @GetUser('id') userId: number,
    @Body() dto: CreateBookmarkDTO,
  ) {
    return this.bookmarkService.createBookmark(userId, dto);
  }

  // edit bookmark
  @Patch(':id')
  editBookmark(
    @Param('id', ParseIntPipe) bookmarkId: number,
    @Body() dto: EditBookmarkDTO,
  ) {
    return this.bookmarkService.editBookmark(bookmarkId, dto);
  }

  // delete bookmark
  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':id')
  deleteBookmark(@Param('id', ParseIntPipe) bookmarkId: number) {
    return this.bookmarkService.deleteBookmark(bookmarkId);
  }
}
