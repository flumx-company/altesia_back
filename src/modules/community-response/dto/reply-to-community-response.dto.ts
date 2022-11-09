import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class ReplyToCommunityResponseDto {
  @ApiProperty({
    example: 'Some answer goes here',
  })
  @IsNotEmpty()
  answer: string;
}
