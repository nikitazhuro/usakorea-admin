import { makeAutoObservable } from 'mobx';

export default class User {
  constructor() {
    this._user = {};
    this._isAuth = false;
    makeAutoObservable(this);
  }

  setUser(user) {
    this._user = user;
  }

  get user() {
    return this._user;
  }

  setIsAuth(bool) {
    this._isAuth = bool;
  }

  get isAuth() {
    return this._isAuth;
  }
}