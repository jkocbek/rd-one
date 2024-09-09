import { handlebarsCompile } from './utils/email-provider.handlebars.util';

export abstract class EmailProviderService {
  abstract sendEmail(
    email: string,
    subject: string,
    htmlContent: string,
    templateVars: Record<string, any>,
    textContent?: string,
  ): Promise<void>;

  protected compileEmailContent(template: string, templateVars: Record<string, any>): string {
    const result = handlebarsCompile(template, templateVars);
    return result;
  }
}
