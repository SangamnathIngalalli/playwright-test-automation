// config/Config.ts
import dotenv from 'dotenv';
import { stagingConfig } from '../config/environments/staging';
import { prodConfig } from '../config/environments/prod';
import { devConfig } from '@config/environments/dev';


// Load .env file
dotenv.config();

const env = process.env.ENV?.toLowerCase() || 'prod';

let config;
switch (env) {
  case 'dev':
    config = devConfig;
    break;
  case 'staging':
    config = stagingConfig;
    break;
  case 'prod':
    config = prodConfig;
    break;
  default:
    throw new Error(`Unknown environment: ${env}`);
}

export const Config = {
  get ENV() { return config.name; },
  get BASE_URL() { return config.baseUrl; },
  get API_URL() { return config.apiUrl; },
};