import dotenv from "dotenv";
dotenv.config();

export type Environmnent = "development" | "production";
export class BaseEnvironment {
  defaultEnvironmentValues = {
    DATABASE_URL: "file:./ZipFeast.db",
    PORT: 3000,
    HOST: "http://localhost",
    FRESHSALES_API_KEY: "freshsales_api_key",
    FRESHSALES_DOMAIN: "freshsales_domain",

    TWILIO_ACCOUNT_SID: "twilio_account_sid",
    TWILIO_AUTH_TOKEN: "twilio_auth",
    TWILIO_PHONE_NUMBER: "+twilio_phone_number",
  };
  get environment(): Environmnent {
    return process.env.NODE_ENV as Environmnent;
  }

  get DATABASE_URL(): string {
    return (
      process.env.DATABASE_URL! || this.defaultEnvironmentValues.DATABASE_URL
    );
  }

  get PORT(): number {
    return parseInt(process.env.PORT!) || this.defaultEnvironmentValues.PORT;
  }

  get HOST(): string {
    return process.env.HOST! || this.defaultEnvironmentValues.HOST;
  }

  get FRESHSALES_API_KEY(): string {
    return (
      process.env.FRESHSALES_API_KEY! ||
      this.defaultEnvironmentValues.FRESHSALES_API_KEY
    );
  }

  get FRESHSALES_DOMAIN(): string {
    return (
      process.env.FRESHSALES_DOMAIN! ||
      this.defaultEnvironmentValues.FRESHSALES_DOMAIN
    );
  }

  get TWILIO_ACCOUNT_SID(): string {
    return (
      process.env.TWILIO_ACCOUNT_SID! ||
      this.defaultEnvironmentValues.TWILIO_ACCOUNT_SID
    );
  }

  get TWILIO_AUTH_TOKEN(): string {
    return (
      process.env.TWILIO_AUTH_TOKEN! ||
      this.defaultEnvironmentValues.TWILIO_AUTH_TOKEN
    );
  }

  get TWILIO_PHONE_NUMBER(): string {
    return (
      process.env.TWILIO_PHONE_NUMBER! ||
      this.defaultEnvironmentValues.TWILIO_PHONE_NUMBER
    );
  }
}
