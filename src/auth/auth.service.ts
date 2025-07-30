import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthDTO } from './dto';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService) {}

  signin() {
    return { msg: 'successfully login' };
  }

  signup(dto: AuthDTO) {
    return { msg: 'successfully signup' };
  }
}
