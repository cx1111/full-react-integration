import { AxiosPromise } from "axios";
import { CoreAPI } from "./utils";

export type ViewUserResponse = {
  username: string | null;
};

export abstract class UserAPI extends CoreAPI {
  viewUser = (): AxiosPromise<ViewUserResponse> =>
    this.request.get(`/api/user/`);
}
