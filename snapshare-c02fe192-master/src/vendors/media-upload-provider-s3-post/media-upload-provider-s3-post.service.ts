import { S3Client, S3ClientConfig } from '@aws-sdk/client-s3';
import { createPresignedPost } from '@aws-sdk/s3-presigned-post';
import { Conditions } from '@aws-sdk/s3-presigned-post/dist-types/types';
import { Inject, Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { makeTokenizer } from '@tokenizer/s3';

import { IMediaUploadProviderGeneratePresignedUrlOptions } from '~vendors/media-upload-provider/interfaces/media-upload-provider.generate-presigned-url-options.interface';
import { IMediaUploadProviderPresignedUrlData } from '~vendors/media-upload-provider/interfaces/media-upload-provider.presigned-url.data';
import { MediaUploadProviderService } from '~vendors/media-upload-provider/media-upload-provider.service';

import { MediaUploadProviderS3PostConfig } from './media-upload-provider-s3-post.config';
import { mediaUploadProviderS3PostConstants } from './media-upload-provider-s3-post.constants';

@Injectable()
export class MediaUploadProviderS3PostService extends MediaUploadProviderService {
  static readonly LOGGER_KEY = 'media-upload-provider-s3-post-service-logger';

  constructor(
    private readonly mediaUploadProviderS3PostConfig: MediaUploadProviderS3PostConfig,
    @Inject(MediaUploadProviderS3PostService.LOGGER_KEY)
    private readonly logger: Logger,
  ) {
    super();

    const { region, accessKeyId, secretAccessKey, apiEndpoint } = mediaUploadProviderS3PostConfig;

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
    const { min: defaultMinContentLength, max: defaultMaxContentLength } =
      mediaUploadProviderS3PostConstants.constraints.fileSize;

    const minContentLength = options?.minContentLength ?? defaultMinContentLength;
    if (minContentLength < defaultMinContentLength) {
      this.logger.error(
        `Could not generate presigned url data. Min content length cannot go below ${defaultMinContentLength}.`,
      );
      throw new InternalServerErrorException();
    }

    const maxContentLength = options?.maxContentLength ?? defaultMaxContentLength;
    if (maxContentLength > defaultMaxContentLength) {
      this.logger.error(
        `Could not generate presigned url data. Max content length cannot go above ${defaultMaxContentLength}.`,
      );
      throw new InternalServerErrorException();
    }

    // Official docs: https://docs.aws.amazon.com/AmazonS3/latest/API/sigv4-HTTPPOSTConstructPolicy.html
    // More on: https://zaccharles.medium.com/s3-uploads-proxies-vs-presigned-urls-vs-presigned-posts-9661e2b37932
    const conditions: Conditions[] = [{ bucket: this.mediaUploadProviderS3PostConfig.bucket }];
    conditions.push(['content-length-range', minContentLength, maxContentLength]);

    const result = await createPresignedPost(this.client, {
      Bucket: this.mediaUploadProviderS3PostConfig.bucket,
      Key: key,
      Conditions: conditions,
    });

    const uploadUrl = result.url;
    const fields = result.fields;
    const mediaUrl = this.generateMediaUrl(uploadUrl, key);

    return {
      uploadMethod: 'POST',
      uploadUrl,
      mediaUrl,
      fields,
    };
  }

  async getObjectMimeType(input: string): Promise<string | undefined> {
    const s3Tokenizer = await makeTokenizer(this.client, {
      Bucket: this.mediaUploadProviderS3PostConfig.bucket,
      Key: input,
    });

    const { fileTypeFromTokenizer } = await import('file-type');
    const response = await fileTypeFromTokenizer(s3Tokenizer);
    if (!response) {
      return undefined;
    }

    return response.mime;
  }

  private generateMediaUrl(uploadUrl: string, key: string): string {
    return `${uploadUrl}${key}`;
  }
}
