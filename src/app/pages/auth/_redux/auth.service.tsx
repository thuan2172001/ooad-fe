import axios from 'axios';
import { API_BASE_URL } from '../../../common-library/common-consts/enviroment';

const BASE_URL = API_BASE_URL + '/auth';
export const CREDENTIAL_URL = BASE_URL + '/credential';
export const PING_URL = BASE_URL + '/ping';
export const IDENTITY_URL = BASE_URL + '/identity/';

export const REQUEST_PASSWORD_URL = BASE_URL + '/verify';
export const CHANGE_PASSWORD_URL = BASE_URL + '/password';
export const SET_TEMP_PASSWORD_URL = BASE_URL + '/temp-password';

export function GetCredential(username: string) {
  return axios.post(CREDENTIAL_URL, { 'username': username });
}

export const Ping = () => {
  return axios.post(PING_URL, {});
};

export function requestPassword(email: string) {
  return axios.post(REQUEST_PASSWORD_URL, { email });
}

export const ChangePassword = (data: any) => {
  return axios.post(CHANGE_PASSWORD_URL, data);
};

export const SetTempPassword = (data: { publicKey: string; encryptedPrivateKey: string }) => {
  return axios.post(SET_TEMP_PASSWORD_URL, data);
};
export const SetPassword = (data: { publicKey: string; encryptedPrivateKey: string }) => {
  return axios.post(CHANGE_PASSWORD_URL, data);
};

export function getUserFromIdentity(username: string) {
  return axios.get(IDENTITY_URL + username);
}

export function saveIdentity(
  username: any,
  rs_password: any,
  signature: any,
  en_private_key: any,
  public_key: any,
) {
  return axios.post(IDENTITY_URL, { username, rs_password, signature, en_private_key, public_key });
}
