import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

import { BaseEntity } from '../../common/entities/base-entity.entity';

import { UserEntity } from './user.entity';
import { OpportunityEntity } from './opportunity.entity';

@Entity('user_opportunities')
export class UserOpportunityEntity extends BaseEntity {
  @Column()
  user_id!: number;

  @Column()
  opportunity_id!: number;

  @Column({
    comment:
      'If true user is interesting this opportunity, if false not interesting',
  })
  is_interesting: boolean;

  @ManyToOne(() => UserEntity, (user) => user.userOpportunities, {
    orphanedRowAction: 'delete',
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'user_id' })
  user!: UserEntity;

  @ManyToOne(
    () => OpportunityEntity,
    (opportunity) => opportunity.userOpportunities,
    {
      orphanedRowAction: 'delete',
      onDelete: 'CASCADE',
    },
  )
  @JoinColumn({ name: 'opportunity_id' })
  opportunity!: OpportunityEntity;
}
