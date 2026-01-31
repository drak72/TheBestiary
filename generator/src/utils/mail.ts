import nodemailer from 'nodemailer';
import * as aws from '@aws-sdk/client-ses';
import { clientParams } from './consts';
import { Generator } from '..';

const ses = new aws.SES({
  apiVersion: '2010-12-01',
  ...clientParams
});

/** Create Transporter */
const transporter = nodemailer.createTransport({
  SES: { ses, aws }
});

interface SendMailParams {
  from: string,
  to: string,
  subject: string,
  html?: string,
  header?: string,
  attachments?: { filename: string, content: Buffer }[];
}

const send = async (params: SendMailParams) => {
  return await transporter.sendMail(params);
}

const factSheet =  ({ from, to, subject, ...rest }: SendMailParams) => async (acc: Generator) => {
  /** Assuming MAIL_TO is a comma separated value string for simplicity.
   *  To scale this up to handle subscriptions: Store subscription info in either dyn or S3 (for simplicity - mostly going to be static data, dependent on scale)
   *  Use SES Bulk email call directly or SQS + a lambda as a separate microservice.
   */
  const emails = to.split(',');
  for await (const email of emails){
    const { output } = acc.textModel

    const params = {
      from,
      to: email,
      subject,
      html: `
      ${rest?.header && `<b>${rest.header}</b></br>`}
      <p><b>name:</b> ${output.name}</p>
      <p><b>scientific name:</b> <i>${output.scientific_name}</i></p>
      <p><b>coloration:</b> ${output.coloration}</p>
      <p><b>habitat:</b> ${output.habitat}</p>
      <p><b>diet:</b> ${output.diet}</p>
      <p><b>size:</b> ${output.size}</p>
      <p><b>lifespan:</b> ${output.lifespan}</p>
      <p><b>special abilities</b> ${output.special_abilities}</p>
      <p><b>fun fact:</b> ${output.fun_fact}</p>
      <p>Image Model: <i>${acc.imageModel.id}</i></p>
      <p>Text Model: <i>${acc.textModel.id}</i></p>
      <p>Prompt: <i>${acc.imageModel.input.prompt}</i></p>
      `,
      attachments: [{
        filename: 'img.png',
        content: Buffer.from(acc.imageModel.output, 'base64')
      }]
    }

    try {
      console.log(`Sending email to ${email}...`);
      await transporter.sendMail(params);
      console.log(`Email sent successfully to ${email}`);
    } catch (error) {
      console.error(`Failed to send email to ${email}:`, error);
      throw error;
    }
  };

  return acc;
}

export const mail = {
  send,
  factSheet
}