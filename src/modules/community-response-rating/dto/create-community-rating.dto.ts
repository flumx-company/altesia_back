import { ApiProperty } from '@nestjs/swagger';

export class CreateCommunityRatingDto {
  @ApiProperty({
    example: 5,
  })
  rating: number;
}
