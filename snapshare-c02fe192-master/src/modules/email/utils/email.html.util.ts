export function generateHtmlEmailContent(htmlBody: string, style?: string): string {
  let head =
    `<head>` + `<meta charset="UTF-8">` + `<meta name="viewport" content="width=device-width, initial-scale=1.0">`;

  if (style) {
    head += `<style>` + style + `</style>`;
  }

  head += `</head>`;

  const result = `<!DOCTYPE html>` + `<html lang="en">` + head + htmlBody + `</html>`;

  return result;
}
