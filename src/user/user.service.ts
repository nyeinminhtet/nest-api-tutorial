import { Injectable } from '@nestjs/common';

import { EditUserDTO } from './dto';
import { PrismaService } from './../../src/prisma/prisma.service';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async editUser(userId: number, dto: EditUserDTO) {
    const user = await this.prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        ...dto,
      },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        bookmarks: true,
      },
    });

    return user;
  }
}
