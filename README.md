# The Bestiary

![React](https://img.shields.io/badge/React-18.3.1-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.6.2-blue)
![Vite](https://img.shields.io/badge/Vite-6.0.1-blue)
![AWS](https://img.shields.io/badge/AWS-Bedrock-orange)


## Table of Contents
- [Overview](#overview)
- [Architecture](#architecture)
 - [Backend](#backend)
 - [Frontend](#frontend)
- [Design Choices](#design-choices)

## Overview

The Bestiary is a example project utilizing [AWS Bedrock](https://aws.amazon.com/bedrock) to explore the capabilities of various foundation models. 

There are two parts to the project: 
*  Generator
*  Webapp



## Architecture
![architecture diagram](architecture.png)

### [Generator](generator/README.md)
#### Overview

The generator function is a lambda that is meant to be run on a cron schedule using event bridge scheduler. 

It invokes an image model with a random set of prompts to generate a mythical creature.
That image is then uploaded to a bucket, and passed to another multi-media model to scientifically describe as a fact card, a la zoobooks. The fact card is also saved to an S3 bucket.

This image/fact card is then emailed to the recipient(s). 


### [Webapp](webapp/README.md)
#### Overview

The webapp is to allow users to easily browse through all of the generated creatures.
It's a react app served from an S3 bucket proxied through Cloudfront, which mediates access to the bucket. 

