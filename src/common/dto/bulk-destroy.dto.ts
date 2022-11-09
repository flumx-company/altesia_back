import { ApiProperty } from '@nestjs/swagger';
import { ArrayNotEmpty } from 'class-validator';

export class BulkDestroyDto {
  @ApiProperty({
    type: [Number],
    description: 'Ids of records that need to be destroyed',
  })
  @ArrayNotEmpty()
  ids: number[];
}
