import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Post,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
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
  @Get('login')
  async login(@Body() loginUserDto: LoginUserDto): Promise<User> {
    try {
      if (!loginUserDto.username || !loginUserDto.password) {
        throw new HttpException(
          'Username and password are required',
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
  @Post('create')
  async createUser(@Body() createUserDto: CreateUserDto): Promise<User> {
    try {
      if (!createUserDto.username || !createUserDto.password) {
        throw new HttpException(
          'Username and password are required',
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
}
