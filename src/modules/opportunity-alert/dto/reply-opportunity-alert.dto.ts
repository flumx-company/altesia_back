import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class ReplyOpportunityAlertDto {
  @ApiProperty({
    example: 'Some answer goes here',
  })
  @IsNotEmpty()
  answer: string;
}
