export default class AuthUtil {

  static setAuthenticatedUser(user, token) {
    localStorage.setItem('token', JSON.stringify(token));
    localStorage.setItem('user', JSON.stringify(user));
  }

  static getAuthHeader() {
    return { 'Authorization': 'Bearer ' + JSON.parse(localStorage.getItem('token')) };
  }

  static clearUser() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }

  static getToken() {
    return JSON.parse(localStorage.getItem('token'));
  }

  static getUser() {
    return JSON.parse(localStorage.getItem('user'));
  }
}