export type CognitoSession = {
  accessToken: string;
  idToken: string;
  accountId: string;
};

const STORAGE_KEY = "splatmaker.cognito.session";

type JwtPayload = {
  sub?: string;
  email?: string;
  [key: string]: unknown;
};

const toBase64Url = (bytes: Uint8Array): string => {
  const base64 = btoa(String.fromCharCode(...bytes));
  return base64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
};

const createPkcePair = async (): Promise<{ verifier: string; challenge: string }> => {
  const random = crypto.getRandomValues(new Uint8Array(32));
  const verifier = toBase64Url(random);
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(verifier));
  const challenge = toBase64Url(new Uint8Array(digest));
  return { verifier, challenge };
};

const parseJwtPayload = (token: string): JwtPayload | null => {
  try {
    const payloadBase64 = token.split(".")[1];
    if (!payloadBase64) {
      return null;
    }
    const normalized = payloadBase64.replace(/-/g, "+").replace(/_/g, "/");
    const decoded = atob(normalized);
    return JSON.parse(decoded) as JwtPayload;
  } catch {
    return null;
  }
};

const getConfig = () => {
  const domain = process.env.NEXT_PUBLIC_COGNITO_DOMAIN?.trim();
  const clientId = process.env.NEXT_PUBLIC_COGNITO_CLIENT_ID?.trim();
  const redirectUri =
    process.env.NEXT_PUBLIC_COGNITO_REDIRECT_URI?.trim() ||
    `${window.location.origin}/jobs`;

  if (!domain || !clientId) {
    return null;
  }

  return {
    domain,
    clientId,
    redirectUri,
    logoutUri: redirectUri,
  };
};

export const loadSession = (): CognitoSession | null => {
  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    return null;
  }

  try {
    return JSON.parse(raw) as CognitoSession;
  } catch {
    return null;
  }
};

export const loginWithCognito = async (): Promise<void> => {
  const config = getConfig();
  if (!config) {
    throw new Error("Cognito auth is not configured in frontend env");
  }

  const { verifier, challenge } = await createPkcePair();
  window.sessionStorage.setItem("splatmaker.cognito.pkce_verifier", verifier);

  const authorizeUrl = new URL(`https://${config.domain}/oauth2/authorize`);
  authorizeUrl.searchParams.set("response_type", "code");
  authorizeUrl.searchParams.set("client_id", config.clientId);
  authorizeUrl.searchParams.set("redirect_uri", config.redirectUri);
  authorizeUrl.searchParams.set("scope", "openid email profile");
  authorizeUrl.searchParams.set("code_challenge_method", "S256");
  authorizeUrl.searchParams.set("code_challenge", challenge);

  window.location.assign(authorizeUrl.toString());
};

export const completeCognitoLoginIfNeeded = async (): Promise<CognitoSession | null> => {
  const config = getConfig();
  if (!config) {
    return null;
  }

  const url = new URL(window.location.href);
  const code = url.searchParams.get("code");
  if (!code) {
    return loadSession();
  }

  const verifier = window.sessionStorage.getItem("splatmaker.cognito.pkce_verifier");
  if (!verifier) {
    throw new Error("PKCE verifier is missing");
  }

  const tokenUrl = `https://${config.domain}/oauth2/token`;
  const body = new URLSearchParams({
    grant_type: "authorization_code",
    client_id: config.clientId,
    code,
    redirect_uri: config.redirectUri,
    code_verifier: verifier,
  });

  const tokenResponse = await fetch(tokenUrl, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body,
  });

  if (!tokenResponse.ok) {
    throw new Error(`Cognito token exchange failed (${tokenResponse.status})`);
  }

  const tokenData = (await tokenResponse.json()) as {
    access_token?: string;
    id_token?: string;
  };

  if (!tokenData.access_token || !tokenData.id_token) {
    throw new Error("Cognito token response is incomplete");
  }

  const payload = parseJwtPayload(tokenData.id_token);
  const accountId =
    (typeof payload?.email === "string" && payload.email) ||
    (typeof payload?.sub === "string" && payload.sub) ||
    "unknown";

  const session: CognitoSession = {
    accessToken: tokenData.access_token,
    idToken: tokenData.id_token,
    accountId,
  };

  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
  window.sessionStorage.removeItem("splatmaker.cognito.pkce_verifier");
  url.searchParams.delete("code");
  window.history.replaceState({}, "", url.toString());

  return session;
};

export const logoutFromCognito = (): void => {
  const config = getConfig();
  window.localStorage.removeItem(STORAGE_KEY);
  window.sessionStorage.removeItem("splatmaker.cognito.pkce_verifier");

  if (!config) {
    return;
  }

  const logoutUrl = new URL(`https://${config.domain}/logout`);
  logoutUrl.searchParams.set("client_id", config.clientId);
  logoutUrl.searchParams.set("logout_uri", config.logoutUri);
  window.location.assign(logoutUrl.toString());
};
