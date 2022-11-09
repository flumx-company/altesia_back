import { ApiProperty } from '@nestjs/swagger';

export class BaseSuccessResponseDto<TData = Record<string, unknown>> {
  @ApiProperty()
  success: boolean;

  @ApiProperty()
  data: TData;
}
