import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class AttachEventToUser {
  @ApiProperty({
    description: 'Yes - interesting. No - not interesting',
  })
  @IsNotEmpty()
  is_interesting: boolean;
}
