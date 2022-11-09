import { Column } from 'typeorm';

import { BaseEntity } from './base-entity.entity';

export interface AttachmentFieldsEntityInterface {
  originalName: string;
  filename: string;
  path: string;
  mineType: string;
}

export class AttachmentEmbeddedColumnsEntity extends BaseEntity {
  @Column()
  originalName: string;

  @Column()
  filename: string;

  @Column()
  path: string;

  @Column()
  mineType: string;
}
