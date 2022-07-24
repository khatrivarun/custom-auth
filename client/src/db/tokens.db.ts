export class TokensDb {
  public checkAuth() {
    return localStorage.getItem('accessToken') ? true : false;
  }

  public getAccessToken() {
    return localStorage.getItem('accessToken');
  }

  public getRefreshToken() {
    return localStorage.getItem('refreshToken');
  }

  public setAccessToken(token: string) {
    localStorage.setItem('accessToken', token);
  }

  public setRefreshToken(token: string) {
    localStorage.setItem('refreshToken', token);
  }
}

