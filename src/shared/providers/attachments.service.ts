import * as fs from 'fs';

import { Injectable } from '@nestjs/common';

const fsPromise = fs.promises;

interface IAttachmentDetail {
  originalName: string;
  filename: string;
  path: string;
  mineType: string;
}

@Injectable()
export class AttachmentsService {
  /**
   * Get attachments details. Like filename, mineType, originalName, etc.
   * @param {Array} attachments - Array of attachments.
   * @return {Array} - Attachments details.
   */
  getAttachmentDetails(
    attachments: Array<Express.Multer.File>,
  ): IAttachmentDetail[] {
    if (!attachments.length) return [];
    return attachments.map((attachment) => ({
      originalName: attachment.originalname,
      filename: attachment.filename,
      path: attachment.path,
      mineType: attachment.mimetype,
    }));
  }

  /**
   * Destroy entity attachments.
   * @param {Array} attachments - Entity attachments.
   */
  async destroyEntityAttachments(attachments: IAttachmentDetail[]) {
    if (!attachments.length) return;
    const unlinkPromises = attachments.map((filename) =>
      this.unlinkByPath(filename.path),
    );
    await Promise.allSettled(unlinkPromises);
  }

  /**
   * Remove file by paths.
   * @param {Array} paths - Array of paths
   */
  async destroyFileFromPaths(paths: string[]) {
    if (!paths.length) return;
    const unlinkPromises = paths.map((path) => this.unlinkByPath(path));
    await Promise.allSettled(unlinkPromises);
  }

  unlinkByPath(path) {
    return fsPromise.unlink(path);
  }
}
