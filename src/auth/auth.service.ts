import { ForbiddenException, Injectable } from '@nestjs/common';
import * as argon from 'argon2';

import { AuthDTO } from './dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { PrismaClientKnownRequestError } from 'generated/prisma/runtime/library';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService) {}

  async signup(dto: AuthDTO) {
    //genereate  the password hash
    const hash = await argon.hash(dto.password);

    try {
      //save the user in db
      const user = await this.prisma.user.create({
        data: {
          email: dto.email,
          hash,
        },
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          bookmarks: true,
        },
      });

      //return the saved user
      return user;
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new ForbiddenException('Credentials taken');
        }

        console.log('error', error);

        throw error;
      }
    }
  }

  async signin(dto: AuthDTO) {
    try {
      // find the user by email
      const user = await this.prisma.user.findUnique({
        where: {
          email: dto.email,
        },
      });

      // if user does not exit throw exception
      if (!user) throw new ForbiddenException('Credentials incorrect');

      // compare password
      const comparePsw = await argon.verify(user.hash, dto.password);

      // if password incorrect throw exception
      if (!comparePsw) throw new ForbiddenException('Credentials incorrect');

      // send back the user
      const responseUser = {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
      };
      return responseUser;
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new ForbiddenException('Credentials incorrect');
        }
      }
      throw error;
    }
  }
}
