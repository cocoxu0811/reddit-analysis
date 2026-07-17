import { fileURLToPath as __eveFileURLToPath } from "node:url";
import { dirname as __eveDirname } from "node:path";
__eveDirname(__eveFileURLToPath(import.meta.url));
import { n as toFormData, t as init_multipart_parser } from "./node-fetch.mjs";
init_multipart_parser();
export { toFormData };
