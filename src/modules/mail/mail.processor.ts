import { MailerService } from '@nestjs-modules/mailer';
import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import { ConfigService } from '@nestjs/config';

import { UserEntity } from '../../shared/models/user.entity';
import { BaseProcessor } from '../../common/processors/base.processor';
import { splitIntoChunks } from '../../utils/utils';

@Processor('mail-queue')
export class MailProcessor extends BaseProcessor {
  constructor(
    private readonly mailerService: MailerService,
    private readonly config: ConfigService,
  ) {
    super();
  }

  @Process('confirmation')
  async sendWelcomeEmail(
    job: Job<{ user: UserEntity; code: string }>,
  ): Promise<any> {
    this.logger.log(`Sending confirmation email to '${job.data.user.email}'`);

    try {
      return await this.mailerService.sendMail({
        template: './registration-confirmation',
        context: {
          verificationCode: splitIntoChunks(job.data.code.split(''), 2),
          BACKEND_APP_URL: this.config.get('BACKEND_APP_URL'),
        },
        subject: `Email confirmation`,
        to: job.data.user.email,
      });
    } catch (error) {
      this.logger.error(
        `Failed to send confirmation email to '${job.data.user.email}'`,
        error.message,
      );
      throw error;
    }
  }

  @Process('password-reset')
  async sendPasswordResetEmail(
    job: Job<{ email: string; code: string }>,
  ): Promise<any> {
    this.logger.log(`Sending password reset email to '${job.data.email}'`);
    try {
      return await this.mailerService.sendMail({
        template: './password-reset',
        context: {
          verificationCode: splitIntoChunks(job.data.code.split(''), 2),
          BACKEND_APP_URL: this.config.get('BACKEND_APP_URL'),
        },
        subject: `Password reset`,
        to: job.data.email,
      });
    } catch (error) {
      this.logger.error(
        `Failed to send password-reset email to '${job.data.email}'`,
        error.message,
      );
      throw error;
    }
  }

  @Process('user-feature-response')
  async sendUserFeatureResponseEmail(
    job: Job<{
      title: string;
      answer: string;
      description: string;
      email: string;
    }>,
  ): Promise<any> {
    this.logger.log(`Sending feature response email to '${job.data.email}'`);

    try {
      const jobDescription = job.data.description;
      return await this.mailerService.sendMail({
        template: './user-feature-response',
        context: {
          title: job.data.title,
          description: jobDescription.slice(0, jobDescription.length / 2),
          answer: job.data.answer,
          BACKEND_APP_URL: this.config.get('BACKEND_APP_URL'),
        },
        subject: `User feature response`,
        to: job.data.email,
      });
    } catch (error) {
      this.logger.error(
        `Failed to send user-feature-response email to '${job.data.email}'`,
        error.message,
      );
      throw error;
    }
  }

  @Process('opportunity-alert-response')
  async sendOpportunityAlertResponseEmail(
    job: Job<{
      title: string;
      answer: string;
      description: string;
      email: string;
    }>,
  ): Promise<any> {
    this.logger.log(
      `Sending opportunity alert response email to '${job.data.email}'`,
    );

    try {
      const jobDescription = job.data.description;
      return await this.mailerService.sendMail({
        template: './opportunity-alert-response',
        context: {
          title: job.data.title,
          description: jobDescription.slice(0, jobDescription.length / 2),
          answer: job.data.answer,
          BACKEND_APP_URL: this.config.get('BACKEND_APP_URL'),
        },
        subject: `Opportunity alert response`,
        to: job.data.email,
      });
    } catch (error) {
      this.logger.error(
        `Failed to send opportunity-alert-response email to '${job.data.email}'`,
        error.message,
      );
      throw error;
    }
  }

  @Process('account-verified')
  async sendAccountVerifiedEmail(job: Job<{ email: string }>): Promise<any> {
    this.logger.log(`Sending account verified email to '${job.data.email}'`);

    try {
      return await this.mailerService.sendMail({
        template: './account-verified',
        subject: `Account verified`,
        context: {
          BACKEND_APP_URL: this.config.get('BACKEND_APP_URL'),
          APP_URL: 'https://google.com',
        },
        to: job.data.email,
      });
    } catch (error) {
      this.logger.error(
        `Failed to send account email to '${job.data.email}'`,
        error.message,
      );
      throw error;
    }
  }

  @Process('community-question-reply')
  async sendAnswerToCommunityQuestion(
    job: Job<{
      title: string;
      description: string;
      email: string;
      answer: string;
    }>,
  ): Promise<any> {
    this.logger.log(
      `Sending community-question-reply email to '${job.data.email}'`,
    );

    try {
      const jobDescription = job.data.description;
      //
      return await this.mailerService.sendMail({
        template: './community-question-reply',
        context: {
          title: job.data.title,
          description: jobDescription.slice(0, jobDescription.length / 2),
          answer: job.data.answer,
          BACKEND_APP_URL: this.config.get('BACKEND_APP_URL'),
        },
        subject: `Community question reply`,
        to: job.data.email,
      });
    } catch (error) {
      this.logger.error(
        `Failed to send community-question-reply email to '${job.data.email}'`,
        error.message,
      );
      throw error;
    }
  }
}
