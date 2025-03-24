import {
  Body,
  Controller,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { UpdateUserInfosDto } from './dto/update-user-infos.dto';
import { UpdateUserPasswordDto } from './dto/update-user-password.dto';
import { User } from './schema/user.schema';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({ summary: 'Login' })
  @ApiResponse({ status: 200, description: 'User logged in' })
  @ApiResponse({
    status: 404,
    description: 'User not found or incorrect password.',
  })
  @Post('login')
  async login(@Body() loginUserDto: LoginUserDto): Promise<User> {
    try {
      if (!loginUserDto.userName || !loginUserDto.password) {
        throw new HttpException(
          'userName and password are required',
          HttpStatus.BAD_REQUEST,
        );
      }

      return await this.authService.login(loginUserDto);
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : 'An unexpected error occurred';
      const errorStatus =
        (error as { status?: number })?.status ||
        HttpStatus.INTERNAL_SERVER_ERROR;
      throw new HttpException(errorMessage, errorStatus);
    }
  }

  @ApiOperation({ summary: 'Create User' })
  @ApiResponse({ status: 200, description: 'User created successfully' })
  @ApiResponse({
    status: 400,
    description: 'User already exists',
  })
  @Post('create-user')
  async createUser(@Body() createUserDto: CreateUserDto): Promise<User> {
    try {
      if (!createUserDto.userName || !createUserDto.password) {
        throw new HttpException(
          'userName and password are required',
          HttpStatus.BAD_REQUEST,
        );
      }
      return await this.authService.createUser(createUserDto);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'An unexpected error occurred';
      const errorStatus =
        (error as { status?: number })?.status ||
        HttpStatus.INTERNAL_SERVER_ERROR;
      throw new HttpException(errorMessage, errorStatus);
    }
  }

  @ApiOperation({ summary: 'Update user information' })
  @ApiResponse({
    status: 200,
    description: 'User updated successfully.',
    type: User,
  })
  @ApiResponse({ status: 404, description: 'User not found.' })
  @ApiBody({ type: UpdateUserInfosDto })
  @Put('update-user-infos/:id')
  async updateUser(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserInfosDto,
  ): Promise<User> {
    try {
      if (!updateUserDto.username || !updateUserDto.picture) {
        throw new HttpException(
          'userName and Picture is required',
          HttpStatus.BAD_REQUEST,
        );
      }
      return this.authService.updateUserInfos(id, updateUserDto);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'An unexpected error occurred';
      const errorStatus =
        (error as { status?: number })?.status ||
        HttpStatus.INTERNAL_SERVER_ERROR;
      throw new HttpException(errorMessage, errorStatus);
    }
  }

  @ApiOperation({ summary: 'Update user password' })
  @ApiResponse({ status: 200, description: 'Password updated successfully.' })
  @ApiResponse({ status: 404, description: 'User not found.' })
  @ApiBody({ type: UpdateUserPasswordDto })
  @Put('update-user-password/:id')
  async updatePassword(
    @Param('id') id: string,
    @Body() updatePasswordDto: UpdateUserPasswordDto,
  ) {
    if (!id) {
      throw new HttpException('User ID is required', HttpStatus.BAD_REQUEST);
    }

    const { oldPassword, newPassword } = updatePasswordDto;
    if (!oldPassword || !newPassword) {
      throw new HttpException(
        'Old password and new password are required',
        HttpStatus.BAD_REQUEST,
      );
    }

    try {
      return await this.authService.updateUserPassword(id, updatePasswordDto);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'An unexpected error occurred';
      const errorStatus =
        (error as { status?: number })?.status ||
        HttpStatus.INTERNAL_SERVER_ERROR;

      throw new HttpException(errorMessage, errorStatus);
    }
  }
}
