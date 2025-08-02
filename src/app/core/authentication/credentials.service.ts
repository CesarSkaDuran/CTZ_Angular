import { Injectable } from '@angular/core';
import * as SecureLS from 'secure-ls';

export interface Credentials {
  // Customize received credentials here
  access_token: string;
  expires_in: number;
  token_type: string;
}

const credentialsKey = 'credentials';

/**
 * Provides storage for authentication credentials.
 * The Credentials interface should be replaced with proper implementation.
 */
@Injectable()
export class CredentialsService {
  private _credentials: Credentials | null = null;

  constructor() {
    let ls = new SecureLS();
    const savedCredentials = ls.get(credentialsKey);
    if (savedCredentials) {
      this._credentials = savedCredentials;
    }
  }

  /**
   * Checks is the user is authenticated.
   * @return True if the user is authenticated.
   */
  isAuthenticated(): boolean {
    return !!this.credentials;
  }

  /**
   * Gets the user credentials.
   * @return The user credentials or null if the user is not authenticated.
   */
  get credentials(): Credentials | null {
    return this._credentials;
  }

  /**
   * Sets the user credentials.
   * The credentials may be persisted across sessions by setting the `remember` parameter to true.
   * Otherwise, the credentials are only persisted for the current session.
   * @param credentials The user credentials.
   * @param remember True to remember credentials across sessions.
   */
  setCredentials(credentials?: Credentials, remember?: boolean) {
    this._credentials = credentials || null;
    let ls = new SecureLS();

    if (credentials) {
      ls.set(credentialsKey, credentials);
    } else {
      ls.remove(credentialsKey);
    }
  }
}
