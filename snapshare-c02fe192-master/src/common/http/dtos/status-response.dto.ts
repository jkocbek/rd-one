import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsString } from 'class-validator';

export class StatusResponseDto {
  constructor(data: StatusResponseDto) {
    this.code = data.code;
    this.meta = data.meta;
    this.message = data.message;
    this.detail = data.detail;
  }

  /**
   * Machine-readable equivalent of 'message'
   */
  @Expose()
  @IsString()
  @ApiProperty()
  code: string;

  /**
   * Message / Human Readable Status
   */
  @Expose()
  @IsString()
  @ApiProperty()
  message: string;

  /**
   * Human-readable explanation of this response
   */
  @Expose()
  @IsString()
  @ApiProperty()
  detail?: string;

  /**
   * Free-form data returned by logic
   */

  @Expose()
  @ApiProperty()
  meta?: Record<string, any>;
}
