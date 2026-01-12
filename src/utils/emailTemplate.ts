import fs from 'fs';
import path from 'path';

export function renderTemplate(
  templateName: string,
  variables: Record<string, string>
) {
  const templatePath = path.join(
    process.cwd(),
    'src/templates',
    templateName
  );

  let html = fs.readFileSync(templatePath, 'utf-8');

  for (const [key, value] of Object.entries(variables)) {
    html = html.replace(
      new RegExp(`{{${key}}}`, 'g'),
      value
    )
  }

  return html;
}