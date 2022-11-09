import {
  applyDecorators,
  BadRequestException,
  UseInterceptors,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';

import { APP_CONSTANTS } from '../../common/constants/constants';
import { editFileName } from '../../utils/utils';

export function FilesUploadDecorator(destinationDirectory = 'common') {
  return applyDecorators(
    UseInterceptors(
      FilesInterceptor('attachments', APP_CONSTANTS.MAX_COUNT_UPLOADED_FILES, {
        storage: diskStorage({
          destination: `${APP_CONSTANTS.BASE_UPLOAD_FILES_DIRECTORY}/${destinationDirectory}`,
          filename: editFileName,
        }),
        fileFilter: (req, file, callback) => {
          if (!file.originalname.match(/\.(doc|docx|jpg|jpeg|pdf)$/)) {
            return callback(
              new BadRequestException(
                'Only doc|docx|jpg|jpeg|pdf files are allowed!',
              ),
              false,
            );
          }
          callback(null, true);
        },
      }),
    ),
  );
}
