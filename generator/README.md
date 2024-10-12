# Overview

The generator function is a Lambda that is meant to be run on a cron schedule using EventBridge scheduler. It invokes an image model with a random set of prompts to generate a mythical creature. That image is then uploaded to a bucket, and passed to another multi-media model to scientifically describe as a fact card, a la Zoobooks. The fact card is also saved to an S3 bucket. This image/fact card is then emailed to the recipient(s).

## Frameworks

* AWS Lambda
* AWS EventBridge
* AWS S3
* AWS SES

## Toolchain
### _required for deployment_

* AWS CLI
* AWS SAM CLI

## Installation

To install the dependencies, run:

```sh
npm install
```
## Environment Variables
Ensure the following environment variables are set in your AWS Parameter Store:
    
    Type: String
    Name: '/BESTIARY/STORAGE'
    Description: S3 Bucket for storing generated content
    
    Type: String
    Name: '/BESTIARY/ENTITY'
    Description: Entity type for generation (e.g., 'unicorn')
    
    Type: String
    Name: '/BESTIARY/MAIL_TO'
    Description: Email address to send the generated content
    
    Type: String
    Name: '/BESTIARY/MAIL_FROM'
    Description: Email address from which the content is sent

    Type: String
    Name: '/BESTIARY/IDENTITY'
    Description: SES Domain identity
    
## Mail setup
 If using the mailing functions, follow the instructions provided by AWS to [set up Amazon SES domains and identities](https://docs.aws.amazon.com/ses/latest/DeveloperGuide/verify-domains.html).

## Deployment 
Setup your AWS Credential file with a profile of your choice (here set as personal)

Run the following commands and follow the prompts to deploy the infrastructure:
```sh
sam build
sam deploy --profile personal
```



