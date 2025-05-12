// environment.template.ts - SAFE TO COMMIT (no secrets)
export const environment = {
    production: false,
    apiUrl: 'http://localhost:3000',
    auth: {
      cognitoDomain: 'YOUR_COGNITO_DOMAIN',
      clientId: 'YOUR_CLIENT_ID',
      redirectUri: 'http://localhost:4200/login',
      clientSecret: 'YOUR_CLIENT_SECRET'
    }
  };