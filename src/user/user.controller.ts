import { Controller, Get, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { User } from '../../generated/prisma';
import { GetUser } from '../../src/auth/decorator/get-user.decorator';

@UseGuards(AuthGuard('jwt'))
@Controller('user')
export class UserController {
  // get current logged in user
  @Get('me')
  getMe(@GetUser() user: User) {
    return user;
  }
}
