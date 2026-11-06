export interface D1Meta {
  changes?: number;
  last_row_id?: number;
}

export interface D1Result<T = unknown> {
  results: T[];
  success: boolean;
  meta?: D1Meta;
}

export interface D1PreparedStatement {
  bind(...values: unknown[]): D1PreparedStatement;
  first<T = Record<string, unknown>>(): Promise<T | null>;
  all<T = Record<string, unknown>>(): Promise<D1Result<T>>;
  run<T = Record<string, unknown>>(): Promise<D1Result<T>>;
}

export interface D1Database {
  prepare(query: string): D1PreparedStatement;
  batch<T = unknown>(statements: D1PreparedStatement[]): Promise<D1Result<T>[]>;
}

export interface AssetFetcher {
  fetch(request: Request): Promise<Response>;
}

export interface Env {
  DB: D1Database;
  ASSETS?: AssetFetcher;
  APP_ENV?: string;
  ACCESS_TEAM_DOMAIN?: string;
  ACCESS_AUD?: string;
  LOCAL_DEV_AUTH?: string;
  LOCAL_DEV_EMAIL?: string;
}

export interface AccessClaims {
  iss: string;
  aud: string | string[];
  exp: number;
  nbf?: number;
  iat?: number;
  sub: string;
  email?: string;
  common_name?: string;
}

export interface WorkspaceMember {
  id: string;
  workspace_id: string;
  email: string;
  display_name: string;
  role: 'OWNER' | 'EDITOR';
  workspace_name: string;
  timezone: string;
}
