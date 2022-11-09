import {
  OnQueueActive,
  OnQueueCompleted,
  OnQueueFailed,
  OnQueueError,
} from '@nestjs/bull';
import { Job } from 'bull';
import { Logger } from '@nestjs/common';

export class BaseProcessor {
  protected readonly logger = new Logger(BaseProcessor.name);

  @OnQueueActive()
  onActive(job: Job) {
    this.logger.debug(
      `Processing job ${job.id} of type ${job.name}. Data: ${JSON.stringify(
        job.data,
      )}`,
    );
  }

  @OnQueueCompleted()
  onComplete(job: Job, result: any) {
    this.logger.debug(
      `Completed job ${job.id} of type ${job.name}. Result: ${JSON.stringify(
        result,
      )}`,
    );
  }

  @OnQueueError()
  onError(job: Job, error: any) {
    this.logger.error(
      `Error job ${job.id} of type ${job.name}: ${error.message}`,
      error.stack,
    );
  }

  @OnQueueFailed()
  onFailed(job: Job, error: any) {
    this.logger.error(
      `Failed job ${job.id} of type ${job.name}: ${error.message}`,
      error.stack,
    );
  }
}
