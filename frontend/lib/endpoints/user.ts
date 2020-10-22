import { AxiosPromise } from "axios";
import { API } from "./utils";

export type ViewUserResponse = {
  username: string | null;
};

export type LoginParams = {
  username: string;
  password: string;
};

export type LoginResponse = {
  user: { username: string; email: string } | null;
  accessToken: string;
  refreshToken: string;
};

class UserAPI {
  viewUser = (): AxiosPromise<ViewUserResponse> =>
    API.request.get(`/api/user/`);

  login = (params: LoginParams): AxiosPromise<LoginResponse> =>
    API.request.post(`/api/login/`, { params });
}

export const userAPI = new UserAPI();
