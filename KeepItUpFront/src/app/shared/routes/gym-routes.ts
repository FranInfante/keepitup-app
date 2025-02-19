import { environment } from "../../environments/environments";


export const GYM_API_URL = environment.endpointUrl + 'gym';

export const GYM_ROUTES = {
  create: () => `${GYM_API_URL}`,
  byUser: (userId: number) => `${GYM_API_URL}/user/${userId}`,
  delete: (id: number) => `${GYM_API_URL}/${id}`,
};
