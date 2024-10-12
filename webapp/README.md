# Overview

The webapp is designed to allow users to easily browse through all of the generated creatures. 
It's a React application served from an S3 bucket proxied through CloudFront, which mediates access to the bucket via an Origin Access Identity

## Frameworks

* React 18
* Typescript

## Toolchain

* AWS CLI 
* AWS SAM CLI

## Installation

To install the dependencies, run:

```sh
yarn install
```

To start the project, run: 
```sh
yarn dev
```

To deploy Frontend Infrastructure, setup your AWS credentials file with a 'default' profile.
set the following parameters in AWS Parameter store in the account you intend to use: 
```sh
    Type: String
    Name: '/BESTIARY/CF/DNS'
    Description: FQDN for Cloudfront Alias
    
    Type: String
    Name: '/BESTIARY/BUCKET/HOST'
    Description: FQDN for Site Hosting bucket
    
    Type: String
    Name: '/BESTIARY/BUCKET/STORAGE'
    Description: FQDN for Asset bucket

    Type: String
    Name: '/BESTIARY/CERT/ARN'
    Description: ARN of the Certificate covering the cloudfront alias
```

Run and follow the prompts for: ```sh
sam deploy --guided --profile default
```

For any future changes, run: 
```sh
yarn deploy:default
yarn sync:default
```