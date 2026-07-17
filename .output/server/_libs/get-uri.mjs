import { fileURLToPath as __eveFileURLToPath } from "node:url";
import { dirname as __eveDirname } from "node:path";
__eveDirname(__eveFileURLToPath(import.meta.url));
import { a as __require, t as __commonJSMin } from "../_runtime.mjs";
import { n as require_src } from "./apify-client+[...].mjs";
import { r as require_node } from "./data-uri-to-buffer.mjs";
import { t as require_dist$1 } from "./basic-ftp.mjs";
//#region node_modules/get-uri/dist/notmodified.js
var require_notmodified = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	/**
	* Error subclass to use when the source has not been modified.
	*
	* @param {String} message optional "message" property to set
	* @api protected
	*/
	var NotModifiedError = class extends Error {
		constructor(message) {
			super(message || "Source has not been modified since the provied \"cache\", re-use previous results");
			this.code = "ENOTMODIFIED";
		}
	};
	exports.default = NotModifiedError;
}));
//#endregion
//#region node_modules/get-uri/dist/data.js
var require_data = /* @__PURE__ */ __commonJSMin(((exports) => {
	var __importDefault = exports && exports.__importDefault || function(mod) {
		return mod && mod.__esModule ? mod : { "default": mod };
	};
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.data = void 0;
	const debug_1 = __importDefault(require_src());
	const stream_1$1 = __require("stream");
	const crypto_1 = __require("crypto");
	const data_uri_to_buffer_1 = require_node();
	const notmodified_1 = __importDefault(require_notmodified());
	const debug = (0, debug_1.default)("get-uri:data");
	var DataReadable = class extends stream_1$1.Readable {
		constructor(hash, buf) {
			super();
			this.push(buf);
			this.push(null);
			this.hash = hash;
		}
	};
	/**
	* Returns a Readable stream from a "data:" URI.
	*/
	const data = async ({ href: uri }, { cache } = {}) => {
		const shasum = (0, crypto_1.createHash)("sha1");
		shasum.update(uri);
		const hash = shasum.digest("hex");
		debug("generated SHA1 hash for \"data:\" URI: %o", hash);
		if (cache?.hash === hash) {
			debug("got matching cache SHA1 hash: %o", hash);
			throw new notmodified_1.default();
		} else {
			debug("creating Readable stream from \"data:\" URI buffer");
			const { buffer } = (0, data_uri_to_buffer_1.dataUriToBuffer)(uri);
			return new DataReadable(hash, Buffer.from(buffer));
		}
	};
	exports.data = data;
}));
//#endregion
//#region node_modules/get-uri/dist/notfound.js
var require_notfound = /* @__PURE__ */ __commonJSMin(((exports) => {
	/**
	* Error subclass to use when the source does not exist at the specified endpoint.
	*
	* @param {String} message optional "message" property to set
	* @api protected
	*/
	Object.defineProperty(exports, "__esModule", { value: true });
	var NotFoundError = class extends Error {
		constructor(message) {
			super(message || "File does not exist at the specified endpoint");
			this.code = "ENOTFOUND";
		}
	};
	exports.default = NotFoundError;
}));
//#endregion
//#region node_modules/get-uri/dist/file.js
var require_file = /* @__PURE__ */ __commonJSMin(((exports) => {
	var __importDefault = exports && exports.__importDefault || function(mod) {
		return mod && mod.__esModule ? mod : { "default": mod };
	};
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.file = void 0;
	const debug_1 = __importDefault(require_src());
	const fs_1 = __require("fs");
	const notfound_1 = __importDefault(require_notfound());
	const notmodified_1 = __importDefault(require_notmodified());
	const url_1 = __require("url");
	const debug = (0, debug_1.default)("get-uri:file");
	/**
	* Returns a `fs.ReadStream` instance from a "file:" URI.
	*/
	const file = async ({ href: uri }, opts = {}) => {
		const { cache, flags = "r", mode = 438 } = opts;
		try {
			const filepath = (0, url_1.fileURLToPath)(uri);
			debug("Normalized pathname: %o", filepath);
			const fdHandle = await fs_1.promises.open(filepath, flags, mode);
			const fd = fdHandle.fd;
			const stat = await fdHandle.stat();
			if (cache && cache.stat && stat && isNotModified(cache.stat, stat)) {
				await fdHandle.close();
				throw new notmodified_1.default();
			}
			const rs = (0, fs_1.createReadStream)(filepath, {
				autoClose: true,
				...opts,
				fd
			});
			rs.stat = stat;
			return rs;
		} catch (err) {
			if (err.code === "ENOENT") throw new notfound_1.default();
			throw err;
		}
	};
	exports.file = file;
	function isNotModified(prev, curr) {
		return +prev.mtime === +curr.mtime;
	}
}));
//#endregion
//#region node_modules/get-uri/dist/ftp.js
var require_ftp = /* @__PURE__ */ __commonJSMin(((exports) => {
	var __importDefault = exports && exports.__importDefault || function(mod) {
		return mod && mod.__esModule ? mod : { "default": mod };
	};
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.ftp = void 0;
	const basic_ftp_1 = require_dist$1();
	const stream_1 = __require("stream");
	const path_1 = __require("path");
	const debug_1 = __importDefault(require_src());
	const notfound_1 = __importDefault(require_notfound());
	const notmodified_1 = __importDefault(require_notmodified());
	const debug = (0, debug_1.default)("get-uri:ftp");
	/**
	* Returns a Readable stream from an "ftp:" URI.
	*/
	const ftp = async (url, opts = {}) => {
		const { cache } = opts;
		const filepath = decodeURIComponent(url.pathname);
		let lastModified;
		if (!filepath) throw new TypeError("No \"pathname\"!");
		const client = new basic_ftp_1.Client();
		try {
			const host = url.hostname || url.host || "localhost";
			const port = parseInt(url.port || "0", 10) || 21;
			const user = url.username ? decodeURIComponent(url.username) : void 0;
			const password = url.password ? decodeURIComponent(url.password) : void 0;
			await client.access({
				host,
				port,
				user,
				password,
				...opts
			});
			try {
				lastModified = await client.lastMod(filepath);
			} catch (err) {
				if (err.code === 550) throw new notfound_1.default();
			}
			if (!lastModified) {
				const list = await client.list((0, path_1.dirname)(filepath));
				const name = (0, path_1.basename)(filepath);
				const entry = list.find((e) => e.name === name);
				if (entry) lastModified = entry.modifiedAt;
			}
			if (lastModified) {
				if (isNotModified()) throw new notmodified_1.default();
			} else throw new notfound_1.default();
			const stream = new stream_1.PassThrough();
			const rs = stream;
			client.downloadTo(stream, filepath).then((result) => {
				debug(result.message);
				client.close();
			});
			rs.lastModified = lastModified;
			return rs;
		} catch (err) {
			client.close();
			throw err;
		}
		function isNotModified() {
			if (cache?.lastModified && lastModified) return +cache.lastModified === +lastModified;
			return false;
		}
	};
	exports.ftp = ftp;
}));
//#endregion
//#region node_modules/get-uri/dist/http-error.js
var require_http_error = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	const http_1$1 = __require("http");
	/**
	* Error subclass to use when an HTTP application error has occurred.
	*/
	var HTTPError = class extends Error {
		constructor(statusCode, message = http_1$1.STATUS_CODES[statusCode]) {
			super(message);
			this.statusCode = statusCode;
			this.code = `E${String(message).toUpperCase().replace(/\s+/g, "")}`;
		}
	};
	exports.default = HTTPError;
}));
//#endregion
//#region node_modules/get-uri/dist/http.js
var require_http = /* @__PURE__ */ __commonJSMin(((exports) => {
	var __importDefault = exports && exports.__importDefault || function(mod) {
		return mod && mod.__esModule ? mod : { "default": mod };
	};
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.http = void 0;
	const http_1 = __importDefault(__require("http"));
	const https_1$1 = __importDefault(__require("https"));
	const events_1 = __require("events");
	const debug_1 = __importDefault(require_src());
	const http_error_1 = __importDefault(require_http_error());
	const notfound_1 = __importDefault(require_notfound());
	const notmodified_1 = __importDefault(require_notmodified());
	const debug = (0, debug_1.default)("get-uri:http");
	/**
	* Returns a Readable stream from an "http:" URI.
	*/
	const http = async (url, opts = {}) => {
		debug("GET %o", url.href);
		const cache = getCache(url, opts.cache);
		if (cache && isFresh(cache) && typeof cache.statusCode === "number") {
			if ((cache.statusCode / 100 | 0) === 3 && cache.headers.location) {
				debug("cached redirect");
				throw new Error("TODO: implement cached redirects!");
			}
			throw new notmodified_1.default();
		}
		const maxRedirects = typeof opts.maxRedirects === "number" ? opts.maxRedirects : 5;
		debug("allowing %o max redirects", maxRedirects);
		let mod;
		if (opts.http) {
			mod = opts.http;
			debug("using secure `https` core module");
		} else {
			mod = http_1.default;
			debug("using `http` core module");
		}
		const options = { ...opts };
		if (cache) {
			if (!options.headers) options.headers = {};
			const lastModified = cache.headers["last-modified"];
			if (lastModified) {
				options.headers["If-Modified-Since"] = lastModified;
				debug("added \"If-Modified-Since\" request header: %o", lastModified);
			}
			const etag = cache.headers.etag;
			if (etag) {
				options.headers["If-None-Match"] = etag;
				debug("added \"If-None-Match\" request header: %o", etag);
			}
		}
		const req = mod.get(url, options);
		const [res] = await (0, events_1.once)(req, "response");
		const code = res.statusCode || 0;
		res.date = Date.now();
		res.parsed = url;
		debug("got %o response status code", code);
		const type = code / 100 | 0;
		const location = res.headers.location;
		if (type === 3 && location) {
			if (!opts.redirects) opts.redirects = [];
			const redirects = opts.redirects;
			if (redirects.length < maxRedirects) {
				debug("got a \"redirect\" status code with Location: %o", location);
				res.resume();
				redirects.push(res);
				const newUri = new URL(location, url.href);
				debug("resolved redirect URL: %o", newUri.href);
				const left = maxRedirects - redirects.length;
				debug("%o more redirects allowed after this one", left);
				if (newUri.protocol !== url.protocol) opts.http = newUri.protocol === "https:" ? https_1$1.default : void 0;
				return (0, exports.http)(newUri, opts);
			}
		}
		if (type !== 2) {
			res.resume();
			if (code === 304) throw new notmodified_1.default();
			else if (code === 404) throw new notfound_1.default();
			throw new http_error_1.default(code);
		}
		if (opts.redirects) res.redirects = opts.redirects;
		return res;
	};
	exports.http = http;
	/**
	* Returns `true` if the provided cache's "freshness" is valid. That is, either
	* the Cache-Control header or Expires header values are still within the allowed
	* time period.
	*
	* @return {Boolean}
	* @api private
	*/
	function isFresh(cache) {
		let fresh = false;
		let expires = parseInt(cache.headers.expires || "", 10);
		const cacheControl = cache.headers["cache-control"];
		if (cacheControl) {
			debug("Cache-Control: %o", cacheControl);
			const parts = cacheControl.split(/,\s*?\b/);
			for (let i = 0; i < parts.length; i++) {
				const part = parts[i];
				const subparts = part.split("=");
				const name = subparts[0];
				switch (name) {
					case "max-age":
						expires = (cache.date || 0) + parseInt(subparts[1], 10) * 1e3;
						fresh = Date.now() < expires;
						if (fresh) debug("cache is \"fresh\" due to previous %o Cache-Control param", part);
						return fresh;
					case "must-revalidate": break;
					case "no-cache":
					case "no-store":
						debug("cache is \"stale\" due to explicit %o Cache-Control param", name);
						return false;
					default: break;
				}
			}
		} else if (expires) {
			debug("Expires: %o", expires);
			fresh = Date.now() < expires;
			if (fresh) debug("cache is \"fresh\" due to previous Expires response header");
			return fresh;
		}
		return false;
	}
	/**
	* Attempts to return a previous Response object from a previous GET call to the
	* same URI.
	*
	* @api private
	*/
	function getCache(url, cache) {
		if (cache) {
			if (cache.parsed && cache.parsed.href === url.href) return cache;
			if (cache.redirects) for (let i = 0; i < cache.redirects.length; i++) {
				const c = getCache(url, cache.redirects[i]);
				if (c) return c;
			}
		}
		return null;
	}
}));
//#endregion
//#region node_modules/get-uri/dist/https.js
var require_https = /* @__PURE__ */ __commonJSMin(((exports) => {
	var __importDefault = exports && exports.__importDefault || function(mod) {
		return mod && mod.__esModule ? mod : { "default": mod };
	};
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.https = void 0;
	const https_1 = __importDefault(__require("https"));
	const http_1 = require_http();
	/**
	* Returns a Readable stream from an "https:" URI.
	*/
	const https = (url, opts) => {
		return (0, http_1.http)(url, {
			...opts,
			http: https_1.default
		});
	};
	exports.https = https;
}));
//#endregion
//#region node_modules/get-uri/dist/index.js
var require_dist = /* @__PURE__ */ __commonJSMin(((exports) => {
	var __importDefault = exports && exports.__importDefault || function(mod) {
		return mod && mod.__esModule ? mod : { "default": mod };
	};
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.getUri = exports.isValidProtocol = exports.protocols = void 0;
	const debug_1 = __importDefault(require_src());
	const data_1 = require_data();
	const file_1 = require_file();
	const ftp_1 = require_ftp();
	const http_1 = require_http();
	const https_1 = require_https();
	const debug = (0, debug_1.default)("get-uri");
	exports.protocols = {
		data: data_1.data,
		file: file_1.file,
		ftp: ftp_1.ftp,
		http: http_1.http,
		https: https_1.https
	};
	const VALID_PROTOCOLS = new Set(Object.keys(exports.protocols));
	function isValidProtocol(p) {
		return VALID_PROTOCOLS.has(p);
	}
	exports.isValidProtocol = isValidProtocol;
	/**
	* Async function that returns a `stream.Readable` instance that will output
	* the contents of the given URI.
	*
	* For caching purposes, you can pass in a `stream` instance from a previous
	* `getUri()` call as a `cache: stream` option, and if the destination has
	* not changed since the last time the endpoint was retrieved then the callback
	* will be invoked with an Error object with `code` set to "ENOTMODIFIED" and
	* `null` for the "stream" instance argument. In this case, you can skip
	* retrieving the file again and continue to use the previous payload.
	*
	* @param {String} uri URI to retrieve
	* @param {Object} opts optional "options" object
	* @api public
	*/
	async function getUri(uri, opts) {
		debug("getUri(%o)", uri);
		if (!uri) throw new TypeError("Must pass in a URI to \"getUri()\"");
		const url = typeof uri === "string" ? new URL(uri) : uri;
		const protocol = url.protocol.replace(/:$/, "");
		if (!isValidProtocol(protocol)) throw new TypeError(`Unsupported protocol "${protocol}" specified in URI: "${uri}"`);
		const getter = exports.protocols[protocol];
		return getter(url, opts);
	}
	exports.getUri = getUri;
}));
//#endregion
export { require_dist as t };
