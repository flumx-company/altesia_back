import { ApiProperty } from '@nestjs/swagger';

export class CreateMissionDto {
  @ApiProperty({
    example: 'Mission name',
  })
  name: string;
}
