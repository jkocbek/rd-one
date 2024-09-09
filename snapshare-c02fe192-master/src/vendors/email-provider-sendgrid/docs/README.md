<a name="readme-top"></a>

<!-- Project Logos -->
<p align="center">
  <span>
    <img style="height:64px;" src="./assets/povio-logo-dark.png" alt="Povio Logo">
  </span>
  &nbsp;&nbsp;&nbsp;&nbsp;
  <span>
    <img style="height:64px" src="./assets/sendgrid-brand.png" alt="Sendgrid Logo">
  </span>
</p>

<!-- Project Title -->
<h3 align="center">Povio - Email Provider with Sendgrid</h3>

---

<p align="center">Implementation of an email provider using Sendgrid as an external service provider.</p>

## Table of Contents

- [External Setup](#external-setup)
- [Environmental Variables](#environmental-variables)
- [Template Adjustments](#template-adjustments)
- [Notes](#notes)
- [Links & Resources](#links-and-resources)

## External Setup <a name="external-setup"></a>

To use Sendgrid as your emailing service, the following external setup is required:

1. Create a Sendgrid account on [Official Sendgrid Website][sendgrid-official-website].
2. Create new Sendgrid API key on your Sendgrid account.
   - Suggestion: Use 1 sendgrid API key per environemnt (eg. DEV + QA + PRD would be 3 sendgrid API keys).
   - Suggestion: To your Sendgrid API keys only grant minimum required permissions for the functionality of the application (eg. do not give permission to list Sendgrid dashboard users if you will only send out emails).
3. Copy the sendgrid `api_key`.
4. Create sendgrid templates on Sendgrid dashboard.
5. For each sendgrid template prepare a logical value we will correlate it to.
   - This logical value should be in `camelCase`.
   - This will be important as it will be used as enum in the template.
   - Example: `welcomeEmail`, `newPurchase`, `yourDiscountExpired`.
6. For each template, take the prepare logical value and correlate it to template id.
   - Example: `welcomeEmail <-> d-0000000001`, `newPurchase <-> d-0000000002`, `yourDiscountExpired <-> d-0000000003`
7. Stringify the correlation between logical values and correlated template ids as array of JSON objects with the following signature: `{id: string, type: string }`.
   - Example: `[{ \"id\": \"d-0000000001\", \"type\": \"welcomeEmail\"}, { \"id\": \"d-0000000002\", \"type\": \"newPurchase\" }, { \"id\": \"d-0000000003\", \"type\": \"yourDiscountExpired\" }]`

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## Environmental Variables Setup <a name="environmental-variables"></a>

To use Sendgrid, set the following environmental variables:

- `SENDGRID_API_KEY`
  - Description: The API key identifier for the Sendgrid account.
  - Example: `SG.abcdefghijklmnopqrstuvwxyz1234567890`
- `SENDGRID_EMAIL_FROM`
  - Description: The email Sendgrid uses to send emails from.
  - Example: `user@example.com`
- `SENDGRID_TEMPLATES`
  - Description: The list of correlations between Sendgrid template logical values and Sendgrid template ids.
  - Example: `[{ \"id\": \"d-0000000001\", \"type\": \"welcomeEmail\"}, { \"id\": \"d-0000000002\", \"type\": \"newPurchase\" }, { \"id\": \"d-0000000003\", \"type\": \"yourDiscountExpired\" }]`

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## Template Adjustments <a name="template-adjustments"></a>

Sendgrid vendor does not require template adjustments.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## Notes <a name="notes"></a>

Sendgrid vendor does not have any notes.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## Links & Resources <a name="links-and-resources"></a>

Sendgrid vendor does not have any links or reference materials.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- Readme Variables -->

[sendgrid-official-website]: https://sendgrid.com/
