import { PutObjectCommand, S3Client, S3ClientConfig } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { Injectable } from '@nestjs/common';
import { makeTokenizer } from '@tokenizer/s3';

import { IMediaUploadProviderGeneratePresignedUrlOptions } from '~vendors/media-upload-provider/interfaces/media-upload-provider.generate-presigned-url-options.interface';
import { IMediaUploadProviderPresignedUrlData } from '~vendors/media-upload-provider/interfaces/media-upload-provider.presigned-url.data';
import { MediaUploadProviderService } from '~vendors/media-upload-provider/media-upload-provider.service';

import { MediaUploadProviderS3PutConfig } from './media-upload-provider-s3-put.config';

@Injectable()
export class MediaUploadProviderS3PutService extends MediaUploadProviderService {
  constructor(private readonly mediaUploadProviderS3PutConfig: MediaUploadProviderS3PutConfig) {
    super();

    const { region, accessKeyId, apiEndpoint, secretAccessKey } = mediaUploadProviderS3PutConfig;

    const configuration: S3ClientConfig = {
      region,
    };

    if (accessKeyId && secretAccessKey) {
      configuration.credentials = {
        accessKeyId,
        secretAccessKey,
      };
    }

    if (apiEndpoint) {
      configuration.forcePathStyle = true;
      configuration.endpoint = apiEndpoint;
    }

    this.client = new S3Client(configuration);
  }

  private readonly client: S3Client;

  async generatePresignedUrlData(
    key: string,
    options?: IMediaUploadProviderGeneratePresignedUrlOptions,
  ): Promise<IMediaUploadProviderPresignedUrlData> {
    const expiresIn = options?.expiresIn;

    const command = new PutObjectCommand({
      Bucket: this.mediaUploadProviderS3PutConfig.bucket,
      Key: key,
    });

    const uploadUrl = await getSignedUrl(this.client, command, {
      expiresIn,
    });
    const mediaUrl = this.generateMediaUrl(uploadUrl);

    return {
      uploadMethod: 'PUT',
      uploadUrl,
      mediaUrl,
    };
  }

  async getObjectMimeType(input: string): Promise<string | undefined> {
    const s3Tokenizer = await makeTokenizer(this.client, {
      Bucket: this.mediaUploadProviderS3PutConfig.bucket,
      Key: input,
    });

    const { fileTypeFromTokenizer } = await import('file-type');
    const response = await fileTypeFromTokenizer(s3Tokenizer);
    if (!response) {
      return undefined;
    }

    return response.mime;
  }

  private generateMediaUrl(uploadUrl: string): string {
    const split = uploadUrl.split('?');

    return split[0];
  }
}
