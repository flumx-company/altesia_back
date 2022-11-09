import { ApiProperty } from '@nestjs/swagger';

export class CreateCommunityCategoryDto {
  @ApiProperty({
    required: true,
    description: 'Name of community category',
    example: 'category name',
  })
  name: string;
}
