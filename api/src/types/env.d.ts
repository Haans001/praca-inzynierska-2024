declare global {
  namespace NodeJS {
    interface ProcessEnv {
      MY_AWS_REGION: string;
      MY_AWS_ACCESS_KEY_ID: string;
      MY_AWS_SECRET_ACCESS_KEY: string;
      WEB_APP_ORIGIN: string;
    }
  }
}

// If this file has no import/export statements (i.e. is a script)
// convert it into a module by adding an empty export statement.
export {};
