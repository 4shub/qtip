# QTIP

## Self hosted deployments

### Summary

This page information about self-hosted deployments of qtip.

### Installation

Before installing this software, please make sure you have the following software:

* Node.js version 12.6.1 or above
* MongoDB version 4.0.0 or above

Once you have the software installed above, complete the following steps:

1. Clone this repo

    ```bash
    git clone https://github.com/4shub/qtip.git
    ```

1. Set your environment variables

    **OSX and Linux**

    ```bash
    # REQUIRED
    export MONGODB_URI=your-mongodb-connection-tring
    export QTIP_AUTH_TOKEN=the-auth-token-used-to-validate-your-service

    # REQUIRED FOR IMAGE UPLOADS
    export AWS_ACCESS_KEY_ID=the-aws-access-key
    export AWS_SECRET_ACCESS_KEY=the-aws-secret-key
    export QTIP_AWS_S3_BUCKET=aws-bucket-for-image-uploads

    # OPTIONAL
    export QTIP_FILE_SYSTEM_NAME=the-name-of-your-file-system (default is qtip)
    ```

    **Windows**

    ```bash
    # REQUIRED
    SetX MONGODB_URI your-mongodb-connection-tring
    SetX QTIP_AUTH_TOKEN the-auth-token-used-to-validate-your-service

    # REQUIRED FOR IMAGE UPLOADS
    SetX AWS_ACCESS_KEY_ID the-aws-access-key
    SetX AWS_SECRET_ACCESS_KEY the-aws-secret-key
    SetX QTIP_AWS_S3_BUCKET aws-bucket-for-image-uploads

    # OPTIONAL
    SetX QTIP_FILE_SYSTEM_NAME the-name-of-your-file-system (default is qtip)
    ```

1. Install required dependencies

    ```bash
    npm i
    ```

1. Build and run the server

    ```bash
    npm build
    npm start
    ```
