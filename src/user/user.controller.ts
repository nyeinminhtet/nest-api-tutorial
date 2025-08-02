import { Body, Controller, Get, Patch, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { EditUserDTO } from './dto';
import { UserService } from './user.service';
import { User } from '../../generated/prisma';
import { GetUser } from '../../src/auth/decorator/get-user.decorator';

@UseGuards(AuthGuard('jwt'))
@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  // get current logged in user
  @Get('me')
  getMe(@GetUser() user: User) {
    return user;
  }

  // update user info
  @Patch()
  updateUser(@GetUser('id') userId: number, @Body() dto: EditUserDTO) {
    return this.userService.editUser(userId, dto);
  }
}
