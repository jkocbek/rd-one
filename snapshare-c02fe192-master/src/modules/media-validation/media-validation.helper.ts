export class MediaValidationHelper {
  static validateMimeType(mimeType: string, allowedMimeTypes?: string[]): boolean {
    if (!allowedMimeTypes) {
      return true;
    }

    const mimeTypeSplit = mimeType.split('/');
    const type = mimeTypeSplit[0];
    const subtype = mimeTypeSplit[1];

    for (let i = 0; i < allowedMimeTypes.length; i += 1) {
      const allowedMimeType = allowedMimeTypes[i];
      const allowedMimeTypeSplit = allowedMimeType.split('/');
      const allowedType = allowedMimeTypeSplit[0];
      const allowedSubtype = allowedMimeTypeSplit[1];

      if (type === allowedType && subtype === allowedSubtype) {
        return true;
      } else if (type === allowedType && allowedSubtype === '*') {
        return true;
      } else if (allowedType === '*' && allowedSubtype === '*') {
        return true;
      }
    }

    return false;
  }
}
