import { environment } from '../../environments/environments'

export const USERS_INFO_API_URL = environment.endpointUrl + 'info';

export const BASE = environment.base;

export const USERS_INFO_ROUTES = {
  setLanguage: () => `${USERS_INFO_API_URL}/set-language`,
  setTheme: () => `${USERS_INFO_API_URL}/set-theme`,
  getUsersInfo: (id: number) => `${USERS_INFO_API_URL}/${id}`

};
