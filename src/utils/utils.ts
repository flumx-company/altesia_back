import { extname } from 'path';

import { v4 as uuidv4 } from 'uuid';
import { LessThan } from 'typeorm';
import { subDays } from 'date-fns';

/**
 * Edit filename.
 *
 * @param req
 * @param file
 * @param callback
 */
export const editFileName = (req, file, callback) => {
  const name = uuidv4();
  const fileExtName = extname(file.originalname);
  callback(null, `${name}${fileExtName}`);
};

/**
 * TypeORM Query Operator
 *
 * @param {Date} date - Initial date. By default uses current date.
 * @param {Number} subDaysAmount - Amount of sub days.
 * @return {FindOperator<Date>} - Find operator
 * @constructor
 */
export const LessThanDate = (date: Date = new Date(), subDaysAmount = 7) =>
  LessThan(subDays(date, subDaysAmount));

/**
 * Split array into chunks.
 *
 * @param {Array} arr - Array that need to be split by chunks.
 * @param {Number} chunkSize - Size of chunk.
 */
export function splitIntoChunks<T>(arr: T[], chunkSize = 10) {
  const res = [];
  for (let i = 0; i < arr.length; i += chunkSize) {
    const chunk = arr.slice(i, i + chunkSize);
    res.push(chunk);
  }
  return res;
}

/**
 * Capitalize first letter.
 *
 * @param string - Initial string.
 * @return string - String with capitalized first letter.
 */
export function capitalizeFirstLetter(string: string) {
  return `${string.charAt(0).toUpperCase()}${string.slice(1)}`;
}
