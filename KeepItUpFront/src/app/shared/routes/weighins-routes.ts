import { environment } from "../../environments/environments";

export const WEIGHINS_API_URL = environment.endpointUrl + 'weighins';

export const BASE = environment.base;

export const WEIGHIN_ROUTES = {
    list: (id: number) => `${WEIGHINS_API_URL}/${id}`,
    delete: (id: number) => `${WEIGHINS_API_URL}/${id}`,
    create: () => `${WEIGHINS_API_URL}`
  };