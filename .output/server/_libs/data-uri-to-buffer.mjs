import { fileURLToPath as __eveFileURLToPath } from "node:url";
import { dirname as __eveDirname } from "node:path";
__eveDirname(__eveFileURLToPath(import.meta.url));
import { n as __esmMin, t as __commonJSMin } from "../_runtime.mjs";
//#region node_modules/get-uri/node_modules/data-uri-to-buffer/dist/common.js
var require_common = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.makeDataUriToBuffer = void 0;
	/**
	* Returns a `Buffer` instance from the given data URI `uri`.
	*
	* @param {String} uri Data URI to turn into a Buffer instance
	*/
	const makeDataUriToBuffer = (convert) => (uri) => {
		uri = String(uri);
		if (!/^data:/i.test(uri)) throw new TypeError("`uri` does not appear to be a Data URI (must begin with \"data:\")");
		uri = uri.replace(/\r?\n/g, "");
		const firstComma = uri.indexOf(",");
		if (firstComma === -1 || firstComma <= 4) throw new TypeError("malformed data: URI");
		const meta = uri.substring(5, firstComma).split(";");
		let charset = "";
		let base64 = false;
		const type = meta[0] || "text/plain";
		let typeFull = type;
		for (let i = 1; i < meta.length; i++) if (meta[i] === "base64") base64 = true;
		else if (meta[i]) {
			typeFull += `;${meta[i]}`;
			if (meta[i].indexOf("charset=") === 0) charset = meta[i].substring(8);
		}
		if (!meta[0] && !charset.length) {
			typeFull += ";charset=US-ASCII";
			charset = "US-ASCII";
		}
		const data = unescape(uri.substring(firstComma + 1));
		const buffer = base64 ? convert.base64ToArrayBuffer(data) : convert.stringToBuffer(data);
		return {
			type,
			typeFull,
			charset,
			buffer
		};
	};
	exports.makeDataUriToBuffer = makeDataUriToBuffer;
}));
//#endregion
//#region node_modules/get-uri/node_modules/data-uri-to-buffer/dist/node.js
var require_node = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.dataUriToBuffer = void 0;
	const common_1 = require_common();
	function nodeBuffertoArrayBuffer(nodeBuf) {
		if (nodeBuf.byteLength === nodeBuf.buffer.byteLength) return nodeBuf.buffer;
		const buffer = new ArrayBuffer(nodeBuf.byteLength);
		new Uint8Array(buffer).set(nodeBuf);
		return buffer;
	}
	function base64ToArrayBuffer(base64) {
		return nodeBuffertoArrayBuffer(Buffer.from(base64, "base64"));
	}
	function stringToBuffer(str) {
		return nodeBuffertoArrayBuffer(Buffer.from(str, "ascii"));
	}
	/**
	* Returns a `Buffer` instance from the given data URI `uri`.
	*
	* @param {String} uri Data URI to turn into a Buffer instance
	*/
	exports.dataUriToBuffer = (0, common_1.makeDataUriToBuffer)({
		stringToBuffer,
		base64ToArrayBuffer
	});
}));
//#endregion
//#region node_modules/data-uri-to-buffer/dist/index.js
/**
* Returns a `Buffer` instance from the given data URI `uri`.
*
* @param {String} uri Data URI to turn into a Buffer instance
* @returns {Buffer} Buffer instance from Data URI
* @api public
*/
function dataUriToBuffer(uri) {
	if (!/^data:/i.test(uri)) throw new TypeError("`uri` does not appear to be a Data URI (must begin with \"data:\")");
	uri = uri.replace(/\r?\n/g, "");
	const firstComma = uri.indexOf(",");
	if (firstComma === -1 || firstComma <= 4) throw new TypeError("malformed data: URI");
	const meta = uri.substring(5, firstComma).split(";");
	let charset = "";
	let base64 = false;
	const type = meta[0] || "text/plain";
	let typeFull = type;
	for (let i = 1; i < meta.length; i++) if (meta[i] === "base64") base64 = true;
	else if (meta[i]) {
		typeFull += `;${meta[i]}`;
		if (meta[i].indexOf("charset=") === 0) charset = meta[i].substring(8);
	}
	if (!meta[0] && !charset.length) {
		typeFull += ";charset=US-ASCII";
		charset = "US-ASCII";
	}
	const encoding = base64 ? "base64" : "ascii";
	const data = unescape(uri.substring(firstComma + 1));
	const buffer = Buffer.from(data, encoding);
	buffer.type = type;
	buffer.typeFull = typeFull;
	buffer.charset = charset;
	return buffer;
}
var init_dist = __esmMin((() => {}));
//#endregion
export { init_dist as n, require_node as r, dataUriToBuffer as t };
