import { ApiProperty } from '@nestjs/swagger';

class Specialty {
  @ApiProperty({
    description: 'Specialty id',
    example: 1,
  })
  specialty_id: number;

  @ApiProperty({
    description: 'Level id',
    example: 1,
  })
  level: string;
}

export class UpdateUserProfileDto {
  @ApiProperty()
  availability?: string;

  @ApiProperty()
  open_to?: string;

  @ApiProperty()
  min_rate?: number;

  @ApiProperty()
  gross_salary?: number;

  @ApiProperty()
  ok_to_contact?: boolean;

  @ApiProperty()
  preferred_time_to_be_contacted?: string;

  @ApiProperty({
    description: 'Ids of missions',
    example: [1, 2],
  })
  preferredMissions?: Array<number>;

  @ApiProperty({
    description: 'Ids of industries',
    example: [1, 2],
  })
  preferredIndustries?: Array<number>;

  @ApiProperty()
  locations_to_work?: string;

  @ApiProperty({
    description: 'Ids of specialties',
    type: () => Specialty,
    example: [
      {
        specialty_id: 1,
        level: 1,
      },
    ],
  })
  specialties?: Specialty[];

  @ApiProperty()
  linkedin_link?: string;
}
