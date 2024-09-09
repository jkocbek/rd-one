import * as handlebars from 'handlebars';

export function handlebarsCompile<ContextType>(input: string, context: ContextType): string {
  const templateFn = handlebars.compile(input);
  const result = templateFn(context);

  return result;
}
