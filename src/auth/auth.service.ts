import { Injectable } from '@nestjs/common';

@Injectable()
export class AuthService {
  signin() {
    return { msg: 'successfully login' };
  }

  signup() {
    return { msg: 'successfully signup' };
  }
}
