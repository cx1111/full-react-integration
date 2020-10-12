import { AxiosPromise } from "axios";
import { API } from "./utils";

export type ViewUserResponse = {
  username: string | null;
};

class UserAPI {
  viewUser = (): AxiosPromise<ViewUserResponse> =>
    API.request.get(`/api/user/`);
}

export const userAPI = new UserAPI();
