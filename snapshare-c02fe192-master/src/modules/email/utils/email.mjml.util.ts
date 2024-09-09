import { InternalServerErrorException, Logger } from '@nestjs/common';
import mjml2html = require('mjml');

const logger = new Logger('utility.mjml');

export function mjmlToHtml(input: string): string {
  const result = mjml2html(input, { minify: true, validationLevel: 'soft' });

  if (result.errors.length > 0) {
    result.errors.forEach((error) => {
      logger.warn(`Mjml validation error warning: ${error.message}`, error.formattedMessage);
    });
  }

  if (!result.html) {
    logger.error(`Could not generate mjml template in method mjmlToHtml! Errors are: `, result.errors);
    throw new InternalServerErrorException();
  }

  return result.html;
}
