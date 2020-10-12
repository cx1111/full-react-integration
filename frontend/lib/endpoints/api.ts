import { applyMixins } from "../utils";
import { ForumAPI } from "./forum";
import { UserAPI } from "./user";

class API {}

interface API extends ForumAPI, UserAPI {}

applyMixins(API, [ForumAPI, UserAPI]);

export default new API();

// interface Sprite extends Jumpable, Duckable {}
// Apply the mixins into the base class via
// the JS at runtime
