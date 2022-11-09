import { Column, Entity, OneToMany } from 'typeorm';
import { EventFileEntity } from 'src/shared/models/event-file.entity';

import { HasRemoveAttachmentsHook } from '../../common/entities/has-remove-attachments.hook';
import { EntityHasAttachmentsInterface } from '../../common/interfaces/entity-has-attachments.interface';
import { ReleasedStatusesEnum } from '../../common/enums/released-statuses.enum';

import { UserEventEntity } from './user-event.entity';

@Entity('events')
export class EventEntity
  extends HasRemoveAttachmentsHook
  implements EntityHasAttachmentsInterface<EventFileEntity>
{
  @Column({
    type: 'varchar',
    length: 1024,
  })
  title: string;

  @Column({
    type: 'text',
  })
  description: string;

  @Column()
  maxAttendanceNumber: number;

  @Column()
  date: string;

  @Column({
    type: 'enum',
    enum: ReleasedStatusesEnum,
    default: ReleasedStatusesEnum.UNPUBLISHED,
  })
  status: ReleasedStatusesEnum;

  @OneToMany(() => UserEventEntity, (userEvent) => userEvent.event, {
    cascade: true,
  })
  userEvents!: UserEventEntity[];

  @OneToMany(() => EventFileEntity, (eventFile) => eventFile.event, {
    cascade: true,
  })
  attachmentFiles: EventFileEntity[];
}
