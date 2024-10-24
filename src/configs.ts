import { ConfigModule, ConfigService } from '@nestjs/config';
import * as process from 'process';

export default () => ({
  port: process.env.PORT,
  jwtUser: process.env.JWT_USER,
  dbConn: process.env.DB_CONN,
  otp: process.env.OTP,
  sendgridApiKey: process.env.SENDGRID_API_KEY,
  stripeSecret: process.env.STRIPE_SECRET,
  stripePublishable: process.env.STRIPE_PUBLISHABLE,
  stripeWebhookKey: process.env.STRIPE_WEBHOOK_KEY,
  playUserId: process.env.PLAY_API_USER_ID,
  playSecretKey: process.env.PLAY_API_SECRET_KEY,
  playApiUrl: process.env.PLAY_API_URL,
  aimlApi: process.env.AIML_API,
  aimlBaseUrl: process.env.AIML_BASE_URL,
});
