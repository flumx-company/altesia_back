import { ApiProperty } from '@nestjs/swagger';

export class CreateIndustryDto {
  @ApiProperty({
    example: 'industry name',
  })
  name: string;
}
