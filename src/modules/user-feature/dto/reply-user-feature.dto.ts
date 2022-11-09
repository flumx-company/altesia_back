import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class ReplyUserFeatureDto {
  @ApiProperty({
    example: 'Some answer goes here',
  })
  @IsNotEmpty()
  answer: string;
}
