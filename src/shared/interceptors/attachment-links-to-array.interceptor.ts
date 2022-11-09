import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';

@Injectable()
export class AttachmentLinksToArrayInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const body = context.switchToHttp().getRequest().body;
    if (body.attachmentLinksToRemove) {
      body.attachmentLinksToRemove = Array.isArray(body.attachmentLinksToRemove)
        ? body.attachmentLinksToRemove
        : body.attachmentLinksToRemove.split(',');
    }
    return next.handle();
  }
}
