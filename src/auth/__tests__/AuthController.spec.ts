import { MongooseModule } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import { AuthController } from '../auth.controller';
import { AuthService } from '../auth.service';
import { User, UserSchema } from '../schema/user.schema';

describe('UserController (e2e)', () => {
  let authController: AuthController;
  let mongod: MongoMemoryServer;

  beforeAll(async () => {
    mongod = await MongoMemoryServer.create();
    const uri = mongod.getUri();

    const module: TestingModule = await Test.createTestingModule({
      imports: [
        MongooseModule.forRoot(uri),
        MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
      ],
      controllers: [AuthController],
      providers: [AuthService],
    }).compile();

    authController = module.get<AuthController>(AuthController);
  });

  afterAll(async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
    await mongod.stop();
  });

  it('should return an empty array when no users exist', async () => {
    const users = await authController.getUsers();
    expect(users).toEqual([]);
  });

  it('should create and retrieve a user', async () => {
    const createdUser = await authController.createUser({
      userName: 'Otávio',
      password: 'os123',
      picture: 'https://www.google.com',
    });
    expect(createdUser).toHaveProperty('_id');

    const users = await authController.getUsers();
    expect(users).toHaveLength(1);
    expect(users[0].username).toBe('Otávio');
  });
});
