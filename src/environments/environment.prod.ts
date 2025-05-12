// environment.prod.ts
export const environment = {
  production: true,
  apiUrl: 'https://api.kickconnect.net',
  auth: {
    cognitoDomain: 'https://us-east-1bfqjwgbzu.auth.us-east-1.amazoncognito.com',
    clientId: '4n6qv2oc54q300lhindcglgr33',
    redirectUri: 'https://your-production-domain.com/login', // Your production redirect URL
    clientSecret: '31jl6fmm5q73od3dusk26huff9obsk0ui1uj5jcsc7bt8376c1a'
  }
};
  