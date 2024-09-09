<a name="readme-top"></a>

<!-- Project Logos -->
<p align="center">
  <span>
    <img style="height:64px" src="./assets/povio-logo-dark.png" alt="Povio Logo">
  </span>
  &nbsp;&nbsp;&nbsp;&nbsp;
  <span>
    <img style="height:64px" src="./assets/firebase-cloud-messaging-logo-standard.svg" alt="Firebase Cloud Messaging (FCM) Logo">
  </span>
</p>

<!-- Project Title -->
<h3 align="center">Povio - Notification Provider with Firebase Cloud Messaging (FCM)</h3>

---

<p align="center">Implementation of an notification provider using the Firebase Cloud Messaging as an external service provider.</p>

## Table of Contents

- [External Setup](#external-setup)
- [Environmental Variables](#environmental-variables)
- [Template Adjustments](#template-adjustments)
- [Notes](#notes)
- [Links & Resources](#links-and-resources)

## External Setup <a name="external-setup"></a>

To use Firebase Cloud Messaging as your notification provider, the following external setup is required:

1. Create a Firebase account on [Official Firebase Console][firebase-console-official-website].
2. Create a new project on your Firebase account.
   - Suggestion: Use 1 project per environemnt (eg. DEV + QA + PRD would be 3 Firebase projects).
3. Generate new Firebase Admin SDK private key.
   - Navigate to "Project settings".
   - Select tab "Service accounts".
   - Ensure you have "Firebase Admin SDK" selected.
   - Click button "Generate new private key".
   - The output of this step will be a JSON configuration file.
4. Open the JSON configuration file and copy `private_key`, `client_email` and `project_id`.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## Environmental Variables Setup <a name="environmental-variables"></a>

To use Firebase Cloud messaging, set the following environmental variables:

- `FCM_PRIVATE_KEY`
  - Description: The private key used for Firebase Cloud Messaging authentication.
  - Example: `-----BEGIN PRIVATE KEY-----\nYourPrivateKeyHere\n-----END PRIVATE KEY-----\n`
- `FCM_CLIENT_EMAIL`
  - Description: The email address associated with the FCM service account.
  - Example: `your-service-account-email@your-project-id.iam.gserviceaccount.com`
- `FCM_PROJECT_ID`
  - Description: The Firebase project's unique ID.
  - Example: `your-project-id`

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## Template Adjustments <a name="template-adjustments"></a>

FCM vendor does not require template adjustments.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## Notes <a name="notes"></a>

- In template, helper tool exists to assist you with testing FCM notifications locally.
  - This tool is located in [tools/fcm-client](../../../tools/fcm-client/) folder.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## Links & Resources <a name="links-and-resources"></a>

FCM vendor does not have any links or reference materials.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- Readme Variables -->

[firebase-console-official-website]: https://console.firebase.google.com/
