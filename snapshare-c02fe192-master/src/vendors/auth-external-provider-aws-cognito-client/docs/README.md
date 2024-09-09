<a name="readme-top"></a>

<!-- Project Logos -->
<p align="center">
  <span>
    <img style="height:64px" src="./assets/povio-logo-dark.png" alt="Povio Logo">
  </span>
  <span>
    <img style="height:64px" src="./assets/amazon-cognito.png" alt="AWS Cognito Logo">
  </span>
</p>

<!-- Project Title -->
<h3 align="center">Povio - Auth Provider with AWS Cognito Client</h3>

---

<p align="center">Implementation of an authentication provider using the AWS Cognito client as an external service provider.</p>

## Table of Contents

- [External Setup](#external-setup)
- [Environmental Variables](#environmental-variables)
- [Template Adjustments](#template-adjustments)
- [Notes](#notes)
- [Links & Resources](#links-and-resources)

## External Setup <a name="external-setup"></a>

To use AWS Cognito as your authentication provider, the following external setup is required:

1. Create an AWS account on [AWS official website][aws-cognito-official-website].
2. Create a user pool in your AWS account.
   - Navigate under service "Cognito"
   - Create a user pool.
   - Create user pool application for this user pool.
3. Configure the user pool to allow generating access tokens for your frontend application (frontend-driven flow).
4. Obtain the `user_pool_id` and `user_pool_client_id` values from your AWS Cognito user pool.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## Environmental Variables Setup <a name="environmental-variables"></a>

To use AWS Cognito as your authentication provider, set the following environmental variables:

- `AWS_COGNITO_USER_POOL_ID`
  - Description: AWS Cognito User Pool ID is a unique identifier for a user pool in AWS Cognito.
  - Example: `us-east-1_abcd1234`
- `AWS_COGNITO_CLIENT_ID`
  - Description: AWS Cognito Client ID is a unique identifier for an app or service that interacts with your user pool.
  - Example: `1a2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p7q8r9s0t`
- `AWS_REGION`
  - Description: The AWS region where your AWS resources are hosted or where you want your AWS SDKs and services to operate.
  - Example: `us-east-1`
  - Note: This variable is dependently used in vendor `openid-client-aws-cognito`.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## Template Adjustments <a name="template-adjustments"></a>

> ℹ️ **Note:** AWS Cognito is configured as the default authentication provider. If using default setup, you can skip this step.

1. In [app.module.ts](../../modules/app/app.module.ts):
   - Import `AuthProviderAwsCognitoClientModule` (file: [auth-provider-aws-cognito-client.module.ts](./auth-provider-aws-cognito-client.module.ts))
     - Replaces `AuthProviderAuth0ClientModule`.
   - Import `OpenidClientAwsCognitoModule` (file: [openid-client-aws-cognito.module.ts](../openid-client-aws-cognito/openid-client-aws-cognito.module.ts))
     - Replaces `OpenidClientAuth0Module`.
   - Provide `AuthProviderAwsCognitoClientAuthenticationMiddleware.AUTH_PROVIDER_AWS_COGNITO_CLIENT_AUTHENTICATION_LOGGER` as implementation for `Logger` (file: [auth-provider-aws-cognito-client.authentication.middleware.ts](./middlewares/auth-provider-aws-cognito-client.authentication.middleware.ts))
     - Replaces `AuthProviderAuth0ClientAuthenticationMiddleware.AUTH_PROVIDER_AUTH0_CLIENT_AUTHENTICATION_LOGGER`.
   - Provide `AuthProviderAwsCognitoClientService` as implementation for `AuthProviderService` (file: [auth-provider-aws-cognito-client.service.ts](./auth-provider-aws-cognito-client.service.ts)).
     - Replaces `AuthProviderAuth0ClientService`.
   - Provide `OpenidClientAwsCognitoService` as implementation for `OpenidClientService` (file: [openid-client-aws-cognito.service.ts](../openid-client-aws-cognito/openid-client-aws-cognito.service.ts)).
     - Replaces `OpenidClientAuth0Service`.
   - Apply middleware `AuthProviderAwsCognitoClientAuthenticationMiddleware` for `*` routes (file: [auth-provider-aws-cognito-client.authentication.middleware.ts](./middlewares/auth-provider-aws-cognito-client.authentication.middleware.ts)).
     - Replaces middleware `AuthProviderAuth0ClientAuthenticationMiddleware`.
   - Apply middleware `AuthProviderAwsCognitoClientVerificationMiddleware` for `*` routes (file: [auth-provider-aws-cognito-client.verification.middleware.ts](./middlewares/auth-provider-aws-cognito-client.verification.middleware.ts)).
     - Replaces middleware `AuthProviderAuth0ClientVerificationMiddleware`.
2. In [auth-provider.module.ts](../auth-provider/auth-provider.module.ts):
   - Provide `AuthProviderAwsCognitoClientService` as implementation for `AuthProviderService` (file: [auth-provider-aws-cognito-client.service.ts](./auth-provider-aws-cognito-client.service.ts)).
     - Replaces `AuthProviderAuth0ClientService` implementation.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## Notes <a name="notes"></a>

- AWS Cognito cannot be tested locally using localstack, unless you are on localstack atleast Pro/Team plan (which is under monthly subscription).
  - This means to test this you must either own paid atleast Pro/Team plan for localstack, or test it on actual AWS service.
- You can enable external sign-in / sign-up flows using functionality called "federal identity providers".
  - Example: Google Sign-In, Apple Sign-In, Facebook Sign-In, etc.
  - Do note that pricing for users managed via federal identity providers is not the same as for those managed through AWS-managed user pools.
- AWS Cognito provides 2 ways to generate access token when it comes to scopes, which is `openid` approach and `aws.cognito.signin.user.admin` approach.
  - By default we allow only `openid` approach. When it comes to scope in particular, we expect at least `openid email` to be provided.
  - If you want to additionally enable support for `aws.cognito.signin.user.admin` (eg. for local development), go to config.yaml and set env variable `AWS_COGNITO_ALLOW_SIGNIN_ADMIN_USER` to `true`.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## Links & Resources <a name="links-and-resources"></a>

- Introduction to authentication on [Youtube][auth-provider-01-introduction]
- Aws Cognito step-by-step implementation on [Youtube][auth-provider-03-aws-cognito]

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- Readme Variables -->

[aws-cognito-official-website]: https://aws.amazon.com/
[auth-provider-01-introduction]: https://www.youtube.com/watch?v=ALQpjejom1c
[auth-provider-03-aws-cognito]: https://youtu.be/DAkdcD-dDFo
