// import { INestApplication } from '@nestjs/common';
// import { EmailTemplateVersionContentType } from '~modules/email-template-version/enums/email-template-version.content-type.enum';
// import { EmailType } from '~modules/email/enums/email.type.enum';

// import { PrismaService } from '~vendors/prisma/prisma.service';

// export class EmailTemplateVersionFixture {
//   static async createEmptyHtmlTemplateVersion(
//     app: INestApplication,
//     emailTemplateId: string,
//     type: EmailType,
//   ): Promise<EmailTemplateVersionFixture> {
//     const prisma = app.get<PrismaService>(PrismaService);

//     const emailTemplateVersion = await prisma.emailTemplateVersion.create({
//       data: {
//         contentType: EmailTemplateVersionContentType.html,
//         type,
//         content: '',
//         label: '',
//         subject: '',
//         emailTemplateId,
//       },
//     });

//     return emailTemplateVersion;
//   }
// }

// todo :delete this
