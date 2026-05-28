import * as cdk from "aws-cdk-lib";
import * as cognito from "aws-cdk-lib/aws-cognito";

export type CognitoAuthDeps = {
  domainPrefix: string;
  callbackUrl: string;
  logoutUrl: string;
};

export type CognitoAuthResources = {
  userPool: cognito.UserPool;
  userPoolClient: cognito.UserPoolClient;
  userPoolDomain: cognito.UserPoolDomain;
};

export const createCognitoAuth = (
  scope: cdk.Stack,
  deps: CognitoAuthDeps,
): CognitoAuthResources => {
  const userPool = new cognito.UserPool(scope, "JobsViewerUserPool", {
    userPoolName: `${cdk.Stack.of(scope).stackName}-jobs-viewer-users`,
    selfSignUpEnabled: true,
    signInAliases: { email: true },
    autoVerify: { email: true },
    removalPolicy: cdk.RemovalPolicy.RETAIN,
    passwordPolicy: {
      minLength: 8,
      requireDigits: true,
      requireLowercase: true,
      requireUppercase: true,
      requireSymbols: false,
    },
  });

  const userPoolClient = userPool.addClient("JobsViewerUserPoolClient", {
    userPoolClientName: "jobs-viewer-web-client",
    generateSecret: false,
    preventUserExistenceErrors: true,
    authFlows: {
      userPassword: true,
      userSrp: true,
    },
    oAuth: {
      flows: { authorizationCodeGrant: true },
      scopes: [cognito.OAuthScope.OPENID, cognito.OAuthScope.EMAIL, cognito.OAuthScope.PROFILE],
      callbackUrls: [deps.callbackUrl],
      logoutUrls: [deps.logoutUrl],
    },
  });

  const userPoolDomain = userPool.addDomain("JobsViewerUserPoolDomain", {
    cognitoDomain: {
      domainPrefix: deps.domainPrefix,
    },
  });

  return { userPool, userPoolClient, userPoolDomain };
};
