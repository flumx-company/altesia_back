import {
  BeforeInsert,
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
} from 'typeorm';
import { BaseEntity } from 'src/common/entities/base-entity.entity';
import { UserProfileEntity } from 'src/shared/models/user-profile.entity';
import { Exclude } from 'class-transformer';
import * as bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';
import { authenticator, totp } from '@otplib/preset-default';

import { UserStatusEnum } from '../../modules/user/enums/user-status.enum';

import { UserFeatureEntity } from './user-feature.entity';
import { CommunityQuestionEntity } from './community-question.entity';
import { CommunityResponseEntity } from './community-response.entity';
import { UserRoleEntity } from './user-role.entity';
import { UserOpportunityEntity } from './user-opportunity.entity';
import { OpportunityAlertEntity } from './opportunity-alert.entity';
import { UserEventEntity } from './user-event.entity';

@Entity('users')
export class UserEntity extends BaseEntity {
  @Column()
  first_name: string;

  @Column()
  last_name: string;

  @Column()
  email: string;

  @Column()
  @Exclude()
  password: string;

  @Column()
  @Exclude()
  secret: string;

  @Column()
  @Exclude()
  confirmation_code: string;

  @Column({
    type: 'enum',
    enum: UserStatusEnum,
    default: UserStatusEnum.PENDING,
  })
  status: UserStatusEnum;

  @Column({
    default: 0,
  })
  internal_rating: number;

  // relations
  @OneToOne(() => UserProfileEntity, (userProfile) => userProfile.user)
  userProfile: UserProfileEntity;

  @OneToMany(() => UserFeatureEntity, (userFeature) => userFeature.user, {
    cascade: true,
  })
  userFeatures: UserFeatureEntity[];

  @OneToMany(
    () => CommunityQuestionEntity,
    (communityQuestion) => communityQuestion.user,
  )
  communityQuestions: CommunityQuestionEntity[];

  @OneToMany(() => UserEventEntity, (userEvent) => userEvent.user, {
    cascade: true,
  })
  userEvents!: UserEventEntity[];

  @OneToMany(
    () => CommunityResponseEntity,
    (communityResponse) => communityResponse.user,
  )
  communityResponses: CommunityResponseEntity[];

  @OneToMany(() => UserRoleEntity, (roleUser) => roleUser.user, {
    cascade: true,
  })
  @JoinColumn({ referencedColumnName: 'user_id' })
  userRoles!: UserRoleEntity[];

  @OneToMany(
    () => UserOpportunityEntity,
    (opportunityUser) => opportunityUser.user,
    {
      cascade: true,
    },
  )
  userOpportunities: UserOpportunityEntity[];

  @OneToMany(() => OpportunityAlertEntity, (alertEntity) => alertEntity.user)
  userAlerts: OpportunityAlertEntity[];

  // hooks
  @BeforeInsert()
  async setPassword(password: string) {
    const salt = await bcrypt.genSalt();
    this.password = await bcrypt.hash(password || this.password, salt);
  }

  @BeforeInsert()
  setConfirmationCode() {
    const secret = uuidv4();
    totp.options = {
      step: Number(process.env.CODE_EXPIRE_TIME),
    };
    this.confirmation_code = totp.generate(secret);
  }

  @BeforeInsert()
  setSecret() {
    this.secret = authenticator.generateSecret();
  }

  public static of(params: Partial<UserEntity>): UserEntity {
    const entity = new UserEntity();

    Object.assign(entity, params);

    return entity;
  }
}
