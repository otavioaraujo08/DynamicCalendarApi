import {
  BadRequestException,
  HttpStatus,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as chalk from 'chalk';
import { Model } from 'mongoose';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { UpdateUserInfosDto } from './dto/update-user-infos.dto';
import { UpdateUserPasswordDto } from './dto/update-user-password.dto';
import { UserDto } from './dto/user.dto';
import { User, UserDocument } from './schema/user.schema';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async login(loginUserDto: LoginUserDto): Promise<User> {
    const { userName, password } = loginUserDto;
    const user = await this.userModel.findOne({ userName, password }).exec();
    if (!user) {
      this.logger.error(
        chalk.red(
          `Login failed for user: ${userName} at ${new Date().toISOString()}`,
        ),
      );
      throw new NotFoundException('User not found or incorrect password');
    }
    this.logger.log(
      chalk.green(`User logged in: ${userName} at ${new Date().toISOString()}`),
    );
    return user;
  }

  async getAllUsers(): Promise<Partial<UserDto[]>> {
    this.logger.log(
      chalk.blue(`Getting all users at ${new Date().toISOString()}`),
    );
    const users = (await this.userModel.find().exec()).map((user) => {
      const { _id, userName, picture } = user;
      return { _id: _id.toString(), username: userName, picture };
    });
    this.logger.log(
      chalk.blue(`Found ${users.length} users at ${new Date().toISOString()}`),
    );
    return users;
  }

  async findUserById(id: string): Promise<User> {
    this.logger.log(
      chalk.blue(`Finding user with ID: ${id} at ${new Date().toISOString()}`),
    );
    const user = await this.userModel.findById(id).exec();
    if (!user) {
      this.logger.error(
        chalk.red(
          `User not found with ID: ${id} at ${new Date().toISOString()}`,
        ),
      );
      throw new NotFoundException('User not found');
    }
    this.logger.log(
      chalk.blue(`User found with ID: ${id} at ${new Date().toISOString()}`),
    );
    return user;
  }

  async createUser(createUserDto: CreateUserDto): Promise<User> {
    const existingUser = await this.userModel
      .findOne({ userName: createUserDto.userName })
      .exec();
    if (existingUser) {
      this.logger.error(
        chalk.yellow(
          `User creation failed: ${createUserDto.userName} already exists at ${new Date().toISOString()}`,
        ),
      );
      throw new BadRequestException('User already exists');
    }
    const createdUser = new this.userModel(createUserDto);
    this.logger.log(
      chalk.blue(
        `User created: ${createUserDto.userName} at ${new Date().toISOString()}`,
      ),
    );
    return createdUser.save();
  }

  async updateUserInfos(
    id: string,
    updateUserDto: UpdateUserInfosDto,
  ): Promise<User> {
    const updatedUser = await this.userModel
      .findByIdAndUpdate(id, updateUserDto, { new: true })
      .exec();
    if (!updatedUser) {
      this.logger.error(
        chalk.red(
          `User update failed: User with ID ${id} not found at ${new Date().toISOString()}`,
        ),
      );
      throw new NotFoundException('User not found');
    }
    this.logger.log(
      chalk.green(
        `User updated: ${updatedUser.userName} at ${new Date().toISOString()}`,
      ),
    );
    return updatedUser;
  }

  async updateUserPassword(
    id: string,
    updatePasswordDto: UpdateUserPasswordDto,
  ): Promise<{ status: number; message: string }> {
    const user = await this.userModel.findOne({ _id: id }).exec();
    if (!user) {
      this.logger.error(
        chalk.hex('#FF00FF')(
          `Password update failed for user ID: ${id} at ${new Date().toISOString()}`,
        ),
      );
      throw new NotFoundException('User not found');
    }

    if (user.password !== updatePasswordDto.oldPassword) {
      this.logger.error(
        chalk.hex('#FF00FF')(
          `Password update failed for user ID: ${id} at ${new Date().toISOString()}`,
        ),
      );
      throw new BadRequestException('Incorrect old password');
    }

    await this.userModel
      .findByIdAndUpdate(
        id,
        { password: updatePasswordDto.newPassword },
        { new: true },
      )
      .exec();
    this.logger.log(
      chalk.cyan(
        `Password updated for user ID: ${id} at ${new Date().toISOString()}`,
      ),
    );
    return { status: HttpStatus.OK, message: 'Password updated successfully' };
  }
}
