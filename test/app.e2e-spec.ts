import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import * as pactum from 'pactum';

import { AuthDTO } from 'src/auth/dto';
import { AppModule } from './../src/app.module';
import { PrismaService } from './../src/prisma/prisma.service';

describe('App e2e', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
      }),
    );

    await app.init();
    await app.listen(3333);
    prisma = app.get(PrismaService);

    await prisma.cleanDb();
    pactum.request.setBaseUrl('http://localhost:3333');
  });

  afterAll(async () => {
    await app.close();
  });

  describe('Auth', () => {
    const dto: AuthDTO = {
      email: 'test@test.com',
      password: '123456',
    };
    describe('SignUp', () => {
      it('should throw 400 error if email is empty', () => {
        return pactum
          .spec()
          .post('/auth/signup')
          .withBody({
            passport: dto.password,
          })
          .expectStatus(400);
      });
      it('should throw 400 error if password is empty', () => {
        return pactum
          .spec()
          .post('/auth/signup')
          .withBody({
            email: dto.email,
          })
          .expectStatus(400);
      });
      it('should throw 400 error if body is empty', () => {
        return pactum
          .spec()
          .post('/auth/signup')
          .withBody({})
          .expectStatus(400);
      });
      it('should sign up', () => {
        return pactum
          .spec()
          .post('/auth/signup')
          .withBody(dto)
          .expectStatus(201);
      });
    });

    describe('SignIn', () => {
      it('should throw 400 error if email is empty', () => {
        return pactum
          .spec()
          .post('/auth/signin')
          .withBody({
            password: dto.password,
          })
          .expectStatus(400);
      });
      it('should throw 400 error if password is empty', () => {
        return pactum
          .spec()
          .post('/auth/signin')
          .withBody({
            email: dto.email,
          })
          .expectStatus(400);
      });
      it('should throw 400 error if body is empty', () => {
        return pactum
          .spec()
          .post('/auth/signin')
          .withBody({})
          .expectStatus(400);
      });
      it('should sign in', () => {
        return pactum
          .spec()
          .post('/auth/signin')
          .withBody(dto)
          .expectStatus(200)
          .stores('token', 'access_token');
      });
    });
  });

  describe('User', () => {
    describe('Get Me', () => {
      it('should get current user', () => {
        return pactum
          .spec()
          .get('/user/me')
          .withHeaders({
            Authorization: 'Bearer $S{token}',
          })
          .expectStatus(200);
      });
    });

    describe('Edit User', () => {
      it('should update user', () => {
        const data = {
          firstName: 'Nyein',
          email: 'nyein@gmail.com',
        };
        return pactum
          .spec()
          .patch('/user')
          .withBearerToken('$S{token}')
          .withBody(data)
          .expectStatus(200)
          .expectBodyContains(data.email)
          .expectBodyContains(data.firstName);
      });
    });
  });

  describe('Bookmarks', () => {
    describe('Get empty bookmark', () => {
      it('should get empty bookmark', () => {
        return pactum
          .spec()
          .get('/bookmark')
          .withBearerToken('$S{token}')
          .expectStatus(200)
          .expectBody([]);
      });
    });

    describe('Create Bookmarks', () => {
      it('should create bookmark', () => {
        const data = {
          title: 'Google',
          link: 'https://www.google.com',
        };
        return pactum
          .spec()
          .post('/bookmark')
          .withBearerToken('$S{token}')
          .withBody(data)
          .expectStatus(201)
          .stores('bookmarkId', 'id');
      });
      it('should return 400 when title is missing ', () => {
        const data = {
          link: 'https://www.google.com',
        };
        return pactum
          .spec()
          .post('/bookmark')
          .withBearerToken('$S{token}')
          .withBody(data)
          .expectStatus(400);
      });
    });

    describe('Get Bookmarks', () => {
      it('should get bookmarks', () => {
        return pactum
          .spec()
          .get('/bookmark')
          .withBearerToken('$S{token}')
          .expectStatus(200)
          .expectJsonLength(1);
      });
    });

    describe('Get Bookmark by id', () => {
      it('should get bookmark by id', () => {
        return pactum
          .spec()
          .get('/bookmark/$S{bookmarkId}')
          .withBearerToken('$S{token}')
          .expectStatus(200);
      });
    });

    describe('Edit Bookmarks', () => {
      it('should edit bookmark', () => {
        const data = {
          description: 'Hello world',
        };
        return pactum
          .spec()
          .patch('/bookmark/$S{bookmarkId}')
          .withBearerToken('$S{token}')
          .withBody(data)
          .expectStatus(200)
          .expectBodyContains(data.description);
      });
    });

    describe('Delete Bookmarks', () => {
      it('should delete bookmark', () => {
        return pactum
          .spec()
          .delete('/bookmark/$S{bookmarkId}')
          .withBearerToken('$S{token}')
          .expectStatus(204);
      });
    });
  });
});
