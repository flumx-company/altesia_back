import { ApiProperty } from '@nestjs/swagger';

export class CreateSpecialtyDto {
  @ApiProperty({
    example: 'Specialty name',
  })
  name: string;
}
