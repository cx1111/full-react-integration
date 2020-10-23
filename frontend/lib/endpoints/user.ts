import { AxiosPromise } from "axios";
import { API } from "./utils";

export type User = {
  username: string;
  email: string;
};

export type ViewUserResponse = {
  user: User | null;
};

export type GetTokenParams = {
  username: string;
  password: string;
};

export type GetTokenResponse = {
  access: string;
  refresh: string;
};

export type RefreshTokenParams = {
  refresh: string;
};

class UserAPI {
  viewUser = (accessToken?: string): AxiosPromise<ViewUserResponse> => {
    if (accessToken) {
      return API.request.get("/api/user/", {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
    }
    return API.request.get("/api/user/");
  };

  getToken = (params: GetTokenParams): AxiosPromise<GetTokenResponse> =>
    API.request.post("/api/token/", { ...params });

  refreshToken = (params: RefreshTokenParams): AxiosPromise<GetTokenResponse> =>
    API.request.post("api/token/refresh/", { ...params });
}

export const userAPI = new UserAPI();
