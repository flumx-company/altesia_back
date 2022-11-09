import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { AttachmentsService } from '../providers/attachments.service';

@Injectable()
export class DestroyUploadedFilesExceptionInterceptor
  implements NestInterceptor
{
  private readonly attachmentService = new AttachmentsService();

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      catchError((err) => {
        // clear uploaded files if there is an error.
        const request = context.switchToHttp().getRequest();
        if (request.files) {
          request.files.forEach((file) =>
            this.attachmentService.unlinkByPath(file.path),
          );
        }
        return throwError(() => err);
      }),
    );
  }
}
