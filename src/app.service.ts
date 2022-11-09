import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  test(): string {
    return 'version 1.0';
  }
}
