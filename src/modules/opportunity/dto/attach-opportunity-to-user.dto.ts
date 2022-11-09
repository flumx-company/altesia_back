import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class AttachOpportunityToUserDto {
  @ApiProperty({
    description: 'Yes - interesting. No - not interesting',
  })
  @IsNotEmpty()
  is_interesting: boolean;
}
