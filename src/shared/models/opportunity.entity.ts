import { Column, Entity, OneToMany } from 'typeorm';

import { HasRemoveAttachmentsHook } from '../../common/entities/has-remove-attachments.hook';
import { EntityHasAttachmentsInterface } from '../../common/interfaces/entity-has-attachments.interface';
import { ReleasedStatusesEnum } from '../../common/enums/released-statuses.enum';

import { UserOpportunityEntity } from './user-opportunity.entity';
import { OpportunityAlertEntity } from './opportunity-alert.entity';
import { OpportunityFileEntity } from './opportunity-file.entity';

@Entity('opportunities')
export class OpportunityEntity
  extends HasRemoveAttachmentsHook
  implements EntityHasAttachmentsInterface<OpportunityFileEntity>
{
  @Column({
    type: 'varchar',
    length: 1024,
  })
  title: string;

  @Column()
  rate: number;

  @Column()
  location: string;

  @Column()
  duration: string;

  @Column()
  client_name: string;

  @Column()
  industry: string;

  @Column({
    type: 'text',
  })
  info: string;

  @Column({
    type: 'enum',
    enum: ReleasedStatusesEnum,
    default: ReleasedStatusesEnum.UNPUBLISHED,
  })
  status: ReleasedStatusesEnum;

  // relations
  @OneToMany(
    () => OpportunityFileEntity,
    (opportunityFile) => opportunityFile.opportunity,
    {
      cascade: true,
    },
  )
  attachmentFiles: OpportunityFileEntity[];

  @OneToMany(
    () => UserOpportunityEntity,
    (opportunityUser) => opportunityUser.opportunity,
    {
      cascade: true,
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    },
  )
  userOpportunities: UserOpportunityEntity[];

  @OneToMany(
    () => OpportunityAlertEntity,
    (opportunityAlert) => opportunityAlert.opportunity,
    {
      cascade: true,
      onDelete: 'CASCADE',
    },
  )
  opportunityAlerts: OpportunityAlertEntity[];
}
