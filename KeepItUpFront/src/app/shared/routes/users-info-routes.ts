import { environment } from '../../environments/environments'

export const USERS_INFO_API_URL = environment.endpointUrl + 'info';

// console.log("Environments" + environment.base + ":" + environment.endpointUrl + " : " + environment.production);

export const BASE = environment.base;

export const USERS_INFO_ROUTES = {
  setLanguage: () => `${USERS_INFO_API_URL}/set-language`,
  getUsersInfo: (id: number) => `${USERS_INFO_API_URL}/${id}`

};
