import { EmailType } from './enums/email.type.enum';

export class EmailHelper {
  static parseEmailType(stringifiedEnum: string): EmailType {
    const status = EmailType[stringifiedEnum as keyof typeof EmailType] as any as EmailType;
    return status;
  }
}
