<a name="readme-top"></a>

<p align="center">
  <span>
    <img style="height:64px" src="./assets/povio-logo-dark.png" alt="Povio Logo">
  </span>
  <span>
    <img style="height:64px" src="./assets/auth0-by-okta.png" alt="Auth0 Okta Logo">
  </span>
</p>

<h3 align="center">Povio - Auth Provider with Auth0 Client</h3>

---

<p align="center">Implementation of an authentication provider using the Auth0 client as an external service provider.</p>

## Table of Contents

- [External Setup](#external-setup)
- [Environmental Variables](#environmental-variables)
- [Template Adjustments](#template-adjustments)
- [Notes](#notes)
- [Links & Resources](#links-and-resources)

## External Setup <a name="external-setup"></a>

To use Auth0 as your authentication provider, the following external setup is required:

1. Create an account on the [Auth0 official website][auth0-official-website].
2. Create a new tenant within your Auth0 account.
3. Configure the tenant to allow generating access tokens for your frontend application (frontend-driven flow).
4. Obtain the `domain` and `client_id` values from your Auth0 tenant.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## Environmental Variables Setup <a name="environmental-variables"></a>

To use Auth0 as your authentication provider, set the following environmental variables:

- `AUTH0_DOMAIN`
  - Description: Auth0 Tenant Domain is a unique identifier for your Auth0 tenant and is used in URLs for authentication and authorization flows.
  - Example: `my-example-tenant.auth0.com`
- `AUTH0_CLIENT_ID`
  - Description: Auth0 Client ID is a unique identifier for an application or service that interacts with your Auth0 tenant for authentication.
  - Example: `ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789`

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## Template Adjustments <a name="template-adjustments"></a>

1. In [app.module.ts](../../modules/app/app.module.ts):
   - Import `AuthProviderAuth0ClientModule` (file: [auth-provider-auth0-client.module.ts](./auth-provider-auth0-client.module.ts))
     - Replaces `AuthProviderAwsCognitoClientModule`.
   - Import `OpenidClientAuth0Module` (file: [openid-client-auth0.module.ts](../openid-client-auth0/openid-client-auth0.module.ts))
     - Replaces `OpenidClientAwsCognitoModule`.
   - Provide `AuthProviderAuth0ClientAuthenticationMiddleware.AUTH_PROVIDER_AUTH0_CLIENT_AUTHENTICATION_LOGGER` as implementation for `Logger` (file: [auth-provider-auth0-client.authentication.middleware.ts](./middleware/auth-provider-auth0-client.authentication.middleware.ts))
     - Replaces `AuthProviderAwsCognitoClientAuthenticationMiddleware.AUTH_PROVIDER_AWS_COGNITO_CLIENT_AUTHENTICATION_LOGGER`.
   - Provide `AuthProviderAuth0ClientService` as implementation for `AuthProviderService` (file: [auth-provider-auth0-client.service.ts](./auth-provider-auth0-client.service.ts)).
     - Replaces `AuthProviderAwsCognitoClientService`.
   - Provide `OpenidClientAuth0Service` as implementation for `OpenidClientService` (file: [openid-client-auth0.service.ts](../openid-client-auth0/openid-client-auth0.service.ts)).
     - Replaces `OpenidClientAwsCognitoService`.
   - Apply middleware `AuthProviderAuth0ClientAuthenticationMiddleware` for `*` routes (file: [auth-provider-auth0-client.authentication.middleware.ts](./middleware/auth-provider-auth0-client.authentication.middleware.ts)).
     - Replaces middleware `AuthProviderAwsCognitoClientAuthenticationMiddleware`.
   - Apply middleware `AuthProviderAuth0ClientVerificationMiddleware` for `*` routes (file: [auth-provider-auth0-client.verification.middleware.ts](./middleware/auth-provider-auth0-client.verification.middleware.ts)).
     - Replaces middleware `AuthProviderAwsCognitoClientVerificationMiddleware`.
2. In [auth-provider.module.ts](../auth-provider/auth-provider.module.ts):
   - Provide `AuthProviderAuth0ClientService` as implementation for `AuthProviderService` (file: [auth-provider-auth0-client.service.ts](./auth-provider-auth0-client.service.ts)).
     - Replaces `AuthProviderAwsCognitoClientService` implementation.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## Notes <a name="notes"></a>

- Auth0 does provider functionality of using external sign-in / sign-up flows.
  - They refer to it "Social Login".
  - Example: Google Sign-In, Apple Sign-In, Facebook Sign-In, etc.
  - Do note that pricing for users managed via social login is not the same as for those managed through Auth0 managed APIs.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## Links & Resources <a name="links-and-resources"></a>

- Introduction to authentication on [Youtube][auth-provider-01-introduction]
- Auth0 step-by-step implementation on [Youtube][auth-provider-02-auth0]

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- Readme Variables -->

[auth0-official-website]: https://auth0.com/
[auth-provider-01-introduction]: https://www.youtube.com/watch?v=ALQpjejom1c
[auth-provider-02-auth0]: https://www.youtube.com/watch?v=EriSpFcArTg
