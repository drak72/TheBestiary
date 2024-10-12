import { fromIni } from "@aws-sdk/credential-providers";
import { config } from 'dotenv';

config();
export const clientParams = process.env?.CONTEXT === 'local' ? { region: 'us-east-1', credentials: fromIni({
  profile: 'personal'
}) } : { region: 'us-east-1' }

export const bedrockParams = process.env?.CONTEXT === 'local' ? { region: 'us-west-2', credentials: fromIni({
  profile: 'personal'
}) } : { region: 'us-west-2' }

