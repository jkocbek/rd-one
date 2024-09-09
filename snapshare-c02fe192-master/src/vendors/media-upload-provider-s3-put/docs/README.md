<a name="readme-top"></a>

<!-- Project Logos -->
<p align="center">
  <span>
    <img style="height:64px" src="./assets/povio-logo-dark.png" alt="Povio Logo">
  </span>
  <span>
    <img style="height:64px" src="./assets/amazon-s3.png" alt="Amazon S3 Logo">
  </span>
</p>

<!-- Project Title -->
<h3 align="center">GPBuild - Upload Media with S3 PUT</h3>

---

<p align="center">Implementation of uploading media using S3 PUT method.</p>

## Table of Contents

- [External Setup](#external-setup)
- [Environmental Variables](#environmental-variables)
- [Template Adjustments](#template-adjustments)
- [Notes](#notes)
- [Links & Resources](#links-and-resources)

## External Setup <a name="external-setup"></a>

To use S3 as your uploading service with S3 PUT method, the following external setup is required:

1. Create an AWS account on [Official Amazon Web Service Website][aws-services-official-website].
2. Create a new S3 bucket.
3. Configure the S3 bucket to your match your desired privacy and security policy.
   - Note: Keep in mind, upload method will be using presigned urls to allow content upload.
4. Copy the S3 `bucket_name`.
5. Prepare AWS account that has permissions to generate presigned URL using PUT method.
   - Note: This can possibly already be as part of CI/CD.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## Environmental Variables Setup <a name="environmental-variables"></a>

To use upload media using S3 PUT, set the following environmental variables:

- `AWS_REGION`
  - Description: The AWS region where your AWS resources are hosted or where you want your AWS SDKs and services to operate.
  - Example: `us-east-1`
- `AWS_ACCESS_KEY_ID`
  - Description: The Access Key ID is used to identify your AWS account when making API requests. It is associated with your AWS IAM (Identity and Access Management) user or role.
  - Example: `your_access_id`
- `AWS_SECRET_ACCESS_KEY`
  - Description: The Secret Access Key is a long, secret key that is used in combination with the Access Key ID to authenticate your AWS API requests.
  - Example: `your_secret_access_key`
- `AWS_S3_BUCKET`
  - Description: The name of an AWS S3 (Simple Storage Service) bucket where you store and manage objects, such as files and data.
  - Example: `your_bucket_name`
- `AWS_ENDPOINT` (optional)
  - Description: AWS endpoint variable allows you to specify a custom endpoint URL for AWS services.
  - Example: `http://localhost:4567`
  - Notes: This variable is optional.
    - It is used when doing local setup.
    - It is omitted in production setup.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## Template Adjustments <a name="template-adjustments"></a>

1. In [upload-media.constants.ts](../upload-media/upload-media.constants.ts) ensure constant `mediaUploadMethod` is set to `UploadMediaMethod.PUT`.

By swiching to `UploadMediaMethod.PUT`, all references and dependencies will automatically switch to using upload media using S3 PUT method.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## Notes <a name="notes"></a>

Upload media S3 PUT vendor does not have any notes.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## Links & Resources <a name="links-and-resources"></a>

Upload media S3 PUT vendor does not have any links or reference materials.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- Readme Variables -->

[aws-services-official-website]: https://aws.amazon.com/
