import { Entity, JoinColumn, ManyToOne, OneToOne } from 'typeorm';

import { BaseEntity } from '../../common/entities/base-entity.entity';

import { UserEntity } from './user.entity';
import { OpportunityAlertEntity } from './opportunity-alert.entity';

@Entity('opportunity_alert_replies')
export class OpportunityAlertReplyEntity extends BaseEntity {
  @OneToOne(
    () => OpportunityAlertEntity,
    (opportunityAlert) => opportunityAlert.opportunityAlertReply,
    {
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    },
  )
  @JoinColumn()
  opportunityAlert: OpportunityAlertEntity;

  @ManyToOne(() => UserEntity, {
    onDelete: 'CASCADE',
  })
  replier: UserEntity;
}
