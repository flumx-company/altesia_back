import { Injectable, Logger } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';

import { UserEntity } from '../../shared/models/user.entity';

@Injectable()
export class MailService {
  constructor(
    @InjectQueue('mail-queue')
    private readonly mailQueue: Queue,
  ) {}
  private readonly logger = new Logger(MailService.name);

  async sendConfirmationEmail(
    user: UserEntity,
    code: string,
  ): Promise<boolean> {
    try {
      await this.mailQueue.add('confirmation', {
        user,
        code,
      });
      return true;
    } catch (error) {
      this.logger.error(
        `Error queueing confirmation email to user ${user.email}`,
      );
      return false;
    }
  }

  async sendPasswordRestEmail(email: string, code: string): Promise<boolean> {
    try {
      await this.mailQueue.add('password-reset', {
        email,
        code,
      });
      return true;
    } catch (error) {
      this.logger.error(
        `Error queueing confirmation email to user with email - ${email}`,
      );
      return false;
    }
  }

  async sendUserFeatureResponseEmail(
    title: string,
    description: string,
    email: string,
    answer: string,
  ): Promise<boolean> {
    try {
      await this.mailQueue.add('user-feature-response', {
        title,
        answer,
        description,
        email,
      });
      return true;
    } catch (error) {
      this.logger.error(
        `Error queueing feature response email to user with email - ${email}`,
      );
      return false;
    }
  }

  async sendOpportunityAlertResponseEmail(
    title: string,
    description: string,
    email: string,
    answer: string,
  ): Promise<boolean> {
    try {
      await this.mailQueue.add('opportunity-alert-response', {
        title,
        answer,
        description,
        email,
      });
      return true;
    } catch (error) {
      this.logger.error(
        `Error queueing feature response email to user with email - ${email}`,
      );
      return false;
    }
  }

  async sendAccountVerifiedEmail(email: string): Promise<boolean> {
    try {
      await this.mailQueue.add('account-verified', {
        email,
      });
      return true;
    } catch (error) {
      this.logger.error(
        `Error queueing account verified email to user with email - ${email}`,
      );
      return false;
    }
  }

  async sendAnswerToCommunityQuestion(
    title: string,
    description: string,
    email: string,
    answer: string,
  ) {
    try {
      await this.mailQueue.add('community-question-reply', {
        title,
        description,
        email,
        answer,
      });
      return true;
    } catch (error) {
      this.logger.error(
        `Error queueing community-response-reply email to user with email - ${email}`,
      );
      return false;
    }
  }
}
