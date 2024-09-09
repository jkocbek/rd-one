# NestJS Template by Povio

This template is maintained by [Povio Labs](https://poviolabs.com/).

The following is an introduction of the template, how to use it, expand it, and how to contribute to it.

## The template

The template uses Git branching for modularisation and versioning. When starting a new project, one should
merge in the required modules and keep a shallow history of the project. This allows for easy maintenance and
upgrades of the project.

Example:

```
├── nestjs/typescrip-starter # https://github.com/nestjs/typescript-starter
│   ├──@poviolabs/nestjs-template/v4
│       ├── @poviolabs/nestjs-template/v4/core/prisma
│       ├── @poviolabs/nestjs-template/v4/core/typeorm
│       ├── @poviolabs/nestjs-template/v4/module/mediaconvert
```

### Considerations for adding a module

**Reproducibility**: We should make use of techniques to assure the package version is identical and performs equally
on all environments.

**Safety**: The security of the package should be assessed before using it. A protocol should be in place to ensure
production always has safe packages.

**Reliability**: The packages we choose should be alive, well-supported, and widely used. Their trackers should be
well maintained.

Avoid the un-maintained. Check Issue trackers if there are any old bugs that are unsolved or unanswered.

Avoid the un-used. Check that the package has a relatively high usage (download) rate.

Avoid the deprecated. Check that a package was not dropped by the author.

**License**: The licenses we can use are MIT or compatible. (A)GPL should be avoided or cleared by the client.

**Future-proof-ness**: Packages should always available. Do not rely on 3rd party package managers (even GitHub).

Isolate the package. Make a thin wrapper around it.

If the package has special instructions or set up requirements, include them in the readme file.

**Leanness**: Small packages are always better than larger ones. Trivial packages are almost never ok.

**Cutting-Edge vs Well-Established**: New projects should avoid using too many unknown technologies.

### Contributing to the template

#### Contributing to the core, and core vendor modules

Core modules are first-class, maintained by Povio. These modules are kept up to date and compatible with each other.

See the [Vendors](./03_Vendors.md) documentation for more information.

#### Contributing a custom module

Custom modules are one off projects and are not actively maintained. You can contribute by opening a pull request - the
pull request will remain open unless the module is promoted to a core module.

## Package Management

### Yarn

We use Yarn Berry to manage our projects. It has proven itself to be faster and more reliable than npm.
It also has a few features that are not available in npm, such as workspaces and zero-installs.

#### Workspaces or monorepo projects

The default structure is this template as its own repository. However, we can use Yarn workspaces to manage
multiple projects in a single repository. You can adhere to the core principle by using `git subtree` to initialize
the project.

todo: add example for git subtree

#### Zero-installs

[Zero installs](https://yarnpkg.com/cli/install) and [PNP](https://yarnpkg.com/features/pnp) make disk space and usage
less of a concern, while also speeding up the installation process. This is especially useful for CI/CD pipelines.

However, packages like Prisma are not yet supported, while some packages need to use
[unplug](https://yarnpkg.com/cli/unplug) so the default is to use `node_modules` for now with the `pnpm` linker.

To enable zero-installs, see [migration to pnp](https://yarnpkg.com/migration/pnp).

#### Local cache

Yarn can use locally cached packages to speed up the installation process. Since development packages are often
quite large (and yarn does not have a way to selectively cache), we refrain from committing them to the repository.

An exception can be made using .gitignore to ignore a specific package, see `.gitignore` for an example.

Once a project is no longer maintained, we should consider packaging all its dependencies with
local .yarn cache. This will ensure that the project can be built and run in the future, even if the
dependencies are no longer available.

## Development

### Editor and OS configuration

All the tooling is configured to work on Linux and macOS (posix systems). Windows is meant to be used with WSL2.

- `.editorconfig` and `.gitattributes` is used to enforce consistent file formatting
- `.nvmrc` is used to enforce a specific Node.js version
- `.prettierrc` is used to enforce consistent code formatting

### Linting

ESLint and Prettier are used to enforce code style. The configuration is defined in `.eslintrc.js` and `.prettierrc`.
These rules can be expanded but removing them is not recommended.

### Testing

Jest is used for testing. The configuration is defined in `jest.config.js`. The tests are run in the CI/CD pipeline.

- `.spec.ts` files should be run in parallel and should not depend on each other or change the state of the system.
- `.spec-e2e.ts` files can use external resources and can use a seed but the setup should be included in the run.

### Local development

Scripts in `package.json` are used to run the project locally - the only setup required should be the preparation of the
[environment variables](./02_Config.md) - the definition should be in README.md.

The `Dockerfile` that is used for production should be reused for local development and testing. Development
dependencies are defined in docker-compose.yaml.
