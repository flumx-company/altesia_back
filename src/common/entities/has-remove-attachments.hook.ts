import { BeforeRemove } from 'typeorm';

import { AttachmentsService } from '../../shared/providers/attachments.service';

import { BaseEntity } from './base-entity.entity';

export class HasRemoveAttachmentsHook extends BaseEntity {
  @BeforeRemove()
  async removeAttachments?() {
    await new AttachmentsService().destroyEntityAttachments(
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      this.attachmentFiles,
    );
  }
}
