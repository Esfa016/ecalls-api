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
  bulkVsUrl: process.env.BULK_VS_URL,
  bulkVsApiKey: process.env.BULK_VS_API_KEY,
  playHtBaseUrl: process.env.PLAY_HT_BASE_URL,
  playHtUserId: process.env.PLAY_HT_USER_ID,
  playHtSecretKey: process.env.PLAY_HT_SECRET_KEY,
  twilioSid: process.env.TWILIO_SID,
  twilioAuthToken: process.env.TWILIO_AUTH_TOKEN,
});
