import { ApiProperty } from '@nestjs/swagger';

export class CreateEventDto {
  @ApiProperty({
    required: true,
    description: 'Title of event',
    example: 'Event title',
  })
  title: string;

  @ApiProperty({
    required: true,
    description: 'Description of event',
    example: 'Event description',
  })
  description: string;

  @ApiProperty({
    required: true,
    description: 'Max number of memders',
    example: 300,
  })
  maxAttendanceNumber: number;

  @ApiProperty({
    required: true,
    description: 'Event date',
    example: '2021-10-27',
  })
  date: string;

  @ApiProperty({
    required: false,
    format: 'binary',
  })
  attachments: string;
}
