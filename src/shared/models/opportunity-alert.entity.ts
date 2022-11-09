import { Column, Entity, ManyToOne, OneToMany, OneToOne } from 'typeorm';

import { BaseEntity } from '../../common/entities/base-entity.entity';
import { EntityHasAttachmentsInterface } from '../../common/interfaces/entity-has-attachments.interface';

import { OpportunityEntity } from './opportunity.entity';
import { UserEntity } from './user.entity';
import { OpportunityAlertFileEntity } from './opportunity-alert-file.entity';
import { OpportunityAlertReplyEntity } from './opportunity-alert-reply.entity';

@Entity('opportunity_alerts')
export class OpportunityAlertEntity
  extends BaseEntity
  implements EntityHasAttachmentsInterface<OpportunityAlertFileEntity>
{
  @Column()
  title: string;

  @Column()
  description: string;

  @Column({ default: false })
  is_replied: boolean;

  @Column({ default: null })
  replied_description: string;

  @ManyToOne(
    () => OpportunityEntity,
    (opportunityEntity) => opportunityEntity.opportunityAlerts,
    {
      onDelete: 'CASCADE',
    },
  )
  opportunity: OpportunityEntity;

  @ManyToOne(() => UserEntity, (userEntity) => userEntity.userAlerts, {
    onDelete: 'CASCADE',
  })
  user: UserEntity;

  @OneToMany(
    () => OpportunityAlertFileEntity,
    (alertFileEntity) => alertFileEntity.opportunityAlert,
    {
      cascade: true,
    },
  )
  attachmentFiles: OpportunityAlertFileEntity[];

  @OneToOne(
    () => OpportunityAlertReplyEntity,
    (opportunityAlertReply) => opportunityAlertReply.opportunityAlert,
    {
      cascade: true,
    },
  )
  opportunityAlertReply: OpportunityAlertReplyEntity;
}
