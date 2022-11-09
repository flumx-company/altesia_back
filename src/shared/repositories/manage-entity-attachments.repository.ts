import { DeepPartial } from 'typeorm';

import { AttachmentsService } from '../providers/attachments.service';
import { EntityHasAttachmentsInterface } from '../../common/interfaces/entity-has-attachments.interface';
import { AttachmentEmbeddedColumnsEntity } from '../../common/entities/attachment-embedded-columns.entity';

import { BaseRepository } from './base-repository';

export class ManageEntityAttachmentsRepository<
  T,
  E extends DeepPartial<E> & EntityHasAttachmentsInterface<T>,
> extends BaseRepository<E> {
  protected readonly attachmentsService;
  protected constructor() {
    super();
    this.attachmentsService = new AttachmentsService();
  }

  /**
   * Update related to entity attachments
   * @param {Entity} entity - Typeorm entity.
   * @param {Array} attachments - Attachments ti update.
   */
  async updateEntityAttachments(
    entity: E,
    attachments: Array<Express.Multer.File>,
  ): Promise<void> {
    entity.attachmentFiles = [
      ...(entity.attachmentFiles || []),
      ...this.attachmentsService.getAttachmentDetails(attachments),
    ];
    await this.save(entity);
  }

  /**
   * Destroy related to entity attachment paths.
   * @param entity
   * @param {Array} paths
   */
  async destroyEntityAttachmentFromPaths(
    entity: E,
    paths: string[],
  ): Promise<void> {
    entity.attachmentFiles = entity.attachmentFiles.filter((attachment) => {
      return !paths.includes(
        (attachment as unknown as AttachmentEmbeddedColumnsEntity).path,
      );
    });

    await this.save(entity);

    await this.attachmentsService.destroyFileFromPaths(paths);
  }
}
