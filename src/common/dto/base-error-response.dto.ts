import { ApiProperty } from '@nestjs/swagger';

type dataType = {
  statusCode: number;
  message: string;
  error: string;
  timestamp: string;
  endpoint: string;
  method: string;
};

export class BaseErrorResponseDto {
  @ApiProperty({
    example: false,
  })
  success: boolean;

  @ApiProperty({
    example: {
      statusCode: 400,
      code: 'HttpException',
      message: 'string',
      error: 'string',
      timestamp: 'string',
      endpoint: 'string',
      method: 'string',
    },
  })
  data: dataType;
}
