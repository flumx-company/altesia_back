import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

import { AppRoutes } from '../app.routes';
import { BaseSuccessResponseDto } from '../common/dto/base-success-response.dto';
import { BaseErrorResponseDto } from '../common/dto/base-error-response.dto';
import { ApiCommonResponseDecorator } from '../shared/decorators/swagger/api-common-response.decorator';

import { AuthService } from './auth.service';
import { PasswordResetVerification } from './dto/password-reset-verification.dto';
import { PasswordResetCompleteDto } from './dto/password-reset-complete.dto';
import { PasswordResetRequest } from './dto/password-reset-request.dto';
import { UserLoginDto } from './dto/user-login.dto';
import { UserRegistrationDto } from './dto/user-registration.dto';
import { LoggedInUserInterface } from './interfaces/logged-in-user.interface';
import { RegisteredUserInterface } from './interfaces/registered-user-.interface';
import { LoggedUser } from './dto/logged-user.dto';
import { ResendConfirmationEmailCodeDto } from './dto/resend-confirmation-email-code.dto';
import { RegisteredUserDto } from './dto/registered-user.dto';

@ApiTags('Auth')
@Controller(AppRoutes.AUTH_URL.CLIENT)
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('registration')
  @ApiOperation({ summary: 'To register' })
  @ApiCommonResponseDecorator({
    type: RegisteredUserDto,
    status: HttpStatus.CREATED,
  })
  @ApiResponse({
    type: BaseErrorResponseDto,
    status: HttpStatus.BAD_REQUEST,
    description: 'User with such email already exist',
  })
  async registration(
    @Body() userRegistrationDto: UserRegistrationDto,
  ): Promise<RegisteredUserInterface> {
    return await this.authService.registration(userRegistrationDto);
  }

  @Post('login')
  @ApiOperation({ summary: 'To login' })
  @HttpCode(HttpStatus.OK)
  @ApiCommonResponseDecorator({
    type: LoggedUser,
  })
  @ApiResponse({
    type: BaseErrorResponseDto,
    status: HttpStatus.NOT_FOUND,
    description: 'User with such email is not exist',
  })
  @ApiResponse({ type: BaseErrorResponseDto, status: HttpStatus.BAD_REQUEST })
  async login(@Body() loginUser: UserLoginDto): Promise<LoggedInUserInterface> {
    return await this.authService.login(loginUser);
  }

  @Post('re-send-email-confirmation-code')
  @ApiOperation({ summary: 'Resend email confirmation code' })
  @HttpCode(HttpStatus.OK)
  @ApiCommonResponseDecorator({
    description: 'Confirmation code was sent',
  })
  @ApiResponse({
    type: BaseErrorResponseDto,
    status: HttpStatus.NOT_FOUND,
    description: 'User with such email is not exist',
  })
  @ApiResponse({ type: BaseErrorResponseDto, status: HttpStatus.BAD_REQUEST })
  resendConfirmationEmailCode(
    @Body() resendConfirmationEmailCode: ResendConfirmationEmailCodeDto,
  ) {
    return this.authService.resendConfirmationEmailCode(
      resendConfirmationEmailCode,
    );
  }

  @Post('password/reset')
  @ApiOperation({ summary: 'Request to reset password' })
  @HttpCode(HttpStatus.OK)
  @ApiResponse({ type: BaseSuccessResponseDto, status: HttpStatus.OK })
  @ApiResponse({ type: BaseErrorResponseDto, status: HttpStatus.NOT_FOUND })
  @ApiResponse({
    type: BaseErrorResponseDto,
    status: HttpStatus.BAD_REQUEST,
  })
  async passwordResetInitFlow(
    @Body() body: PasswordResetRequest,
  ): Promise<Record<string, string>> {
    return await this.authService.passwordResetInitFlow(body.email);
  }

  @Get('confirm-email/:code')
  @ApiOperation({ summary: 'Confirm email code' })
  @ApiResponse({ type: BaseSuccessResponseDto, status: HttpStatus.OK })
  @ApiResponse({ type: BaseErrorResponseDto, status: HttpStatus.NOT_FOUND })
  @ApiResponse({
    type: BaseErrorResponseDto,
    status: HttpStatus.BAD_REQUEST,
    description: 'You already have been verified your email',
  })
  @ApiResponse({
    type: BaseErrorResponseDto,
    status: HttpStatus.BAD_REQUEST,
  })
  async confirmEmail(@Param('code') code: string) {
    return await this.authService.confirmEmail(code);
  }

  @Post('password/reset/verification')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Verify reset password' })
  @ApiResponse({ type: BaseSuccessResponseDto, status: HttpStatus.OK })
  @ApiResponse({ type: BaseErrorResponseDto, status: HttpStatus.NOT_FOUND })
  @ApiResponse({
    type: BaseErrorResponseDto,
    status: HttpStatus.BAD_REQUEST,
  })
  async passwordResetVerification(
    @Body() body: PasswordResetVerification,
  ): Promise<boolean> {
    return await this.authService.passwordResetVerification(body);
  }

  @Post('password/reset/complete')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Complete reset password flow' })
  @ApiResponse({ type: BaseSuccessResponseDto, status: HttpStatus.OK })
  @ApiResponse({ type: BaseErrorResponseDto, status: HttpStatus.NOT_FOUND })
  @ApiResponse({
    type: BaseErrorResponseDto,
    status: HttpStatus.BAD_REQUEST,
  })
  async passwordResetComplete(
    @Body() body: PasswordResetCompleteDto,
  ): Promise<null> {
    return await this.authService.passwordResetComplete(body);
  }
}
