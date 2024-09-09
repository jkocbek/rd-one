import { plainToInstance, type ClassConstructor } from 'class-transformer';
import { validateSync } from 'class-validator';
import { cosmiconfigSync } from 'cosmiconfig';

/**
 * Load a typed configuration object from a raw configuration object
 */
export function loadConfig<T extends object>(cls: ClassConstructor<T>, data: any): T {
  const config = plainToInstance(cls, data, {
    exposeDefaultValues: true,
    exposeUnsetFields: false,
  });

  const errors = validateSync(config, {
    // strip non validated properties
    whitelist: true,
    // throw on non-whitelisted property
    forbidNonWhitelisted: true,
    // require all properties
    skipMissingProperties: false,
  });

  if (errors.length) {
    throw errors;
  }

  return config;
}

/**
 * Load the raw config from ./config/${STAGE}.api.yaml
 * do not use directly, use loadConfig with a typed config instead
 */
export function readConfig(options: { moduleName: string; directory: string }): Record<string, any> {
  const { search } = cosmiconfigSync(options.moduleName, {
    searchPlaces: ['.json', '.yaml', '.yml', '.js', '.ts', '.cjs'].map((ext) => `${options.moduleName}${ext}`),
    // stopDir: options.directory, // only search one folder
  });
  const result = search(options.directory);

  if (!result || !result.filepath) {
    throw new Error(`No config or fallback found: ${options.directory}${options.moduleName}.yml`);
  }

  if (result.isEmpty) {
    throw new Error(`Empty config found: ${result.filepath}`);
  }

  return result?.config;
}
