export const mediaUploadProviderS3PostConstants = {
  constraints: {
    fileSize: {
      min: 1, // 1B, in bytes,
      max: 1024 * 1024 * 1024 * 5, // 5GB, in bytes
    },
  },
};
