import { fileURLToPath as __eveFileURLToPath } from "node:url";
import { dirname as __eveDirname } from "node:path";
__eveDirname(__eveFileURLToPath(import.meta.url));
import "./fetch-blob+[...].mjs";
import "./formdata-polyfill.mjs";
import { i as init_src, r as fetch } from "./node-fetch.mjs";
init_src();
export { fetch as default };
