import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

import { BaseEntity } from '../../common/entities/base-entity.entity';

import { UserEntity } from './user.entity';
import { EventEntity } from './event.entity';

@Entity('user_events')
export class UserEventEntity extends BaseEntity {
  @Column()
  user_id!: number;

  @Column()
  event_id!: number;

  @ManyToOne(() => UserEntity, (user) => user.userEvents, {
    orphanedRowAction: 'delete',
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'user_id' })
  user!: UserEntity;

  @ManyToOne(() => EventEntity, (event) => event.userEvents, {
    orphanedRowAction: 'delete',
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'event_id' })
  event!: EventEntity;

  @Column({
    comment: 'If true user is interesting this event, if false not interesting',
  })
  is_interesting: boolean;
}
