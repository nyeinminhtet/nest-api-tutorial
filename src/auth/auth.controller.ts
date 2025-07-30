import { Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authservice: AuthService) {}

  @Post('signin')
  signin() {
    this.authservice.signin();
  }

  @Post('signup')
  signup() {
    this.authservice.signup();
  }
}
