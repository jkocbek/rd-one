# Config and Environment Variables

## Core principles

A Stage is a set of configurations that define the environment in which the application is running. The stage is
defined by the `STAGE` environment variable. Usually we name it as an abbreviation of the project name and the
environment (e.g. `myapp-dev`).

To guarantee reproducibility, we always define all the variables in the current stage inside a configuration file,
that is generated at runtime and before booting the app. This config file is then read at runtime and used to set
the environment.

The application is expected to fail fast if the configuration is not present or is invalid. This is to prevent
the application from running in an unknown state.

### Environment variables

The environment variables are available at runtime in `.config/${process.env.STAGE}.api.yaml`. This file is generated
at boot - _preferably, no other environments variables should be used_.

Locally, the `local` STAGE is default, and a `.config/local.api.yaml` file is available or generated on demand in the case
of secrets or sensitive data.

### Validation

Each module should validate the configuration at boot. For this purpose, a `~common/config` module is available that
can be used to extract the configuration and validate it. The `class-validator` and `class-transformer` libraries are
used by default also by `vendors`, so it is encouraged to use them for validation but not required by design.

## Providers

_For alternative setups, not described below, stick to the core principles described above._

### AWS ECS

By default, we use [ecs-deploy-cli](https://github.com/poviolabs/ecs-deploy-cli) to deploy to AWS ECS. The configuration
is defined in `.config/${process.env.STAGE}.ecs-deploy.yaml` - this includes:

- environment variables generation at boot, that can be sourced from AWS Secrets Manager or SSM
- ECS task definition generation, that is based of a base task definition (defined in SSM)
- Dockerfile build and push to ECR

```bash
yarn ecs-deploy build api --stage myapp-dev
yarn ecs-deploy deploy api --stage myapp-dev
yarn ecs-deploy bootstrap --stage myapp-dev
```



