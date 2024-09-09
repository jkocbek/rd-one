export interface IMediaConstraints {
  minContentLength?: number; // in bytes
  maxContentLength?: number; // in bytes
  allowedMimeTypes?: string[];
}
