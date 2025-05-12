import { ResourcesConfig } from 'aws-amplify';

export const awsConfig: ResourcesConfig = {
  Auth: {
    Cognito: {
      userPoolId: 'us-east-1_BfqJwgbZU',
      userPoolClientId: '4n6qv2oc54q300lhindcglgr33',
    }
  }
};

export default awsConfig;