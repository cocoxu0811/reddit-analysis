import { fileURLToPath as __eveFileURLToPath } from "node:url";
import { dirname as __eveDirname } from "node:path";
__eveDirname(__eveFileURLToPath(import.meta.url));
import { a as __require, r as __exportAll, t as __commonJSMin } from "../_runtime.mjs";
import { a as defineLazyEventHandler, c as NodeResponse, i as defineHandler, l as serve, n as HTTPError, o as handleCors, r as HTTPResponse, s as toEventHandler, t as H3Core } from "./h3+rou3+srvx.mjs";
import { t as HookableCore } from "./hookable.mjs";
import { B as br, G as dispatchChannelRequest, H as once, J as Xn, K as health_default$2, L as sandboxShutdownPlugin, R as validateWorkflowWorld, U as defineAgent, W as installEveWorkflowQueueNamespace, X as ba, Y as Zn, en as eveChannel, nn as installBundledCompiledArtifacts, q as defineTool, rn as handleHomePageRequest, tn as localDev, z as resolveLocalWorkflowWorldDataDirectory } from "./eve.mjs";
import { C as object, E as string, S as number, d as _enum, h as boolean, m as array } from "./@ai-sdk/gateway+[...].mjs";
import { t as createGoogle } from "./@ai-sdk/google+[...].mjs";
import { n as Type, t as GoogleGenAI } from "./@google/genai+[...].mjs";
import { t as createClient } from "./supabase__supabase-js.mjs";
import { t as require_lru_cache } from "./lru-cache.mjs";
import { t as require_dist$4 } from "./agent-base.mjs";
import { n as require_src, t as ApifyClient } from "./apify-client+[...].mjs";
import { t as require_dist$5 } from "./http-proxy-agent.mjs";
import { t as require_dist$6 } from "./https-proxy-agent.mjs";
import { t as require_ip_address } from "./ip-address.mjs";
import { t as require_dist$7 } from "./get-uri.mjs";
import { t as require_dist$8 } from "./degenerator+[...].mjs";
import { t as require_netmask } from "./netmask.mjs";
import { t as require_dist$9 } from "./@tootallnate/quickjs-emscripten+[...].mjs";
import { t as E } from "./croner.mjs";
import { createRequire } from "node:module";
import { randomUUID } from "node:crypto";
import { promises } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import path from "path";
import fs from "fs";
import fs$1 from "fs/promises";
String.fromCharCode;
const ENC_SLASH_RE = /%2f/gi;
function decode(text = "") {
	try {
		return decodeURIComponent("" + text);
	} catch {
		return "" + text;
	}
}
function decodePath(text) {
	return decode(text.replace(ENC_SLASH_RE, "%252F"));
}
const TRAILING_SLASH_RE = /\/$|\/\?|\/#/;
const JOIN_LEADING_SLASH_RE = /^\.?\//;
function hasTrailingSlash(input = "", respectQueryAndFragment) {
	if (!respectQueryAndFragment) return input.endsWith("/");
	return TRAILING_SLASH_RE.test(input);
}
function withoutTrailingSlash(input = "", respectQueryAndFragment) {
	if (!respectQueryAndFragment) return (hasTrailingSlash(input) ? input.slice(0, -1) : input) || "/";
	if (!hasTrailingSlash(input, true)) return input || "/";
	let path = input;
	let fragment = "";
	const fragmentIndex = input.indexOf("#");
	if (fragmentIndex !== -1) {
		path = input.slice(0, fragmentIndex);
		fragment = input.slice(fragmentIndex);
	}
	const [s0, ...s] = path.split("?");
	return ((s0.endsWith("/") ? s0.slice(0, -1) : s0) || "/") + (s.length > 0 ? `?${s.join("?")}` : "") + fragment;
}
function withTrailingSlash(input = "", respectQueryAndFragment) {
	if (!respectQueryAndFragment) return input.endsWith("/") ? input : input + "/";
	if (hasTrailingSlash(input, true)) return input || "/";
	let path = input;
	let fragment = "";
	const fragmentIndex = input.indexOf("#");
	if (fragmentIndex !== -1) {
		path = input.slice(0, fragmentIndex);
		fragment = input.slice(fragmentIndex);
		if (!path) return fragment;
	}
	const [s0, ...s] = path.split("?");
	return s0 + "/" + (s.length > 0 ? `?${s.join("?")}` : "") + fragment;
}
function hasLeadingSlash(input = "") {
	return input.startsWith("/");
}
function withLeadingSlash(input = "") {
	return hasLeadingSlash(input) ? input : "/" + input;
}
function isNonEmptyURL(url) {
	return url && url !== "/";
}
function joinURL(base, ...input) {
	let url = base || "";
	for (const segment of input.filter((url2) => isNonEmptyURL(url2))) if (url) {
		const _segment = segment.replace(JOIN_LEADING_SLASH_RE, "");
		url = withTrailingSlash(url) + _segment;
	} else url = segment;
	return url;
}
//#endregion
//#region #eve-route/
var _eve_route_default = async (event) => handleHomePageRequest({ "agentName": "react-example" }, event.req);
//#endregion
//#region #eve-route-handler/GET /eve/v1/health
var health_default$1 = health_default$2;
//#endregion
//#region #eve-route-handler/HEAD /eve/v1/health
var health_default = health_default$2;
//#endregion
//#region #nitro/virtual/eve-channel/GET /eve/v1/connections/:name/callback/:token
const config$7 = { "kind": "production" };
var _token_default$2 = (event) => dispatchChannelRequest(event, "GET /eve/v1/connections/:name/callback/:token", config$7);
//#endregion
//#region #nitro/virtual/eve-channel/POST /eve/v1/connections/:name/callback/:token
const config$6 = { "kind": "production" };
var _token_default$1 = (event) => dispatchChannelRequest(event, "POST /eve/v1/connections/:name/callback/:token", config$6);
//#endregion
//#region #nitro/virtual/eve-channel/POST /eve/v1/callback/:token
const config$5 = { "kind": "production" };
var _token_default = (event) => dispatchChannelRequest(event, "POST /eve/v1/callback/:token", config$5);
//#endregion
//#region #nitro/virtual/eve-channel/GET /eve/v1/info
const cors$9 = {};
const config$4 = { "kind": "production" };
var info_default$1 = (event) => {
	const corsResponse = handleCors(event, cors$9);
	if (corsResponse !== false) return corsResponse;
	return dispatchChannelRequest(event, "GET /eve/v1/info", config$4);
};
//#endregion
//#region #nitro/virtual/eve-channel/OPTIONS /eve/v1/info
const cors$8 = {};
var info_default = (event) => {
	const corsResponse = handleCors(event, cors$8);
	if (corsResponse !== false) return corsResponse;
	return new Response(null, { status: 204 });
};
//#endregion
//#region #nitro/virtual/eve-channel/POST /eve/v1/session
const cors$7 = {};
const config$3 = { "kind": "production" };
var session_default$1 = (event) => {
	const corsResponse = handleCors(event, cors$7);
	if (corsResponse !== false) return corsResponse;
	return dispatchChannelRequest(event, "POST /eve/v1/session", config$3);
};
//#endregion
//#region #nitro/virtual/eve-channel/OPTIONS /eve/v1/session
const cors$6 = {};
var session_default = (event) => {
	const corsResponse = handleCors(event, cors$6);
	if (corsResponse !== false) return corsResponse;
	return new Response(null, { status: 204 });
};
//#endregion
//#region #nitro/virtual/eve-channel/POST /eve/v1/session/:sessionId
const cors$5 = {};
const config$2 = { "kind": "production" };
var _sessionId_default$1 = (event) => {
	const corsResponse = handleCors(event, cors$5);
	if (corsResponse !== false) return corsResponse;
	return dispatchChannelRequest(event, "POST /eve/v1/session/:sessionId", config$2);
};
//#endregion
//#region #nitro/virtual/eve-channel/OPTIONS /eve/v1/session/:sessionId
const cors$4 = {};
var _sessionId_default = (event) => {
	const corsResponse = handleCors(event, cors$4);
	if (corsResponse !== false) return corsResponse;
	return new Response(null, { status: 204 });
};
//#endregion
//#region #nitro/virtual/eve-channel/POST /eve/v1/session/:sessionId/cancel
const cors$3 = {};
const config$1 = { "kind": "production" };
var cancel_default$1 = (event) => {
	const corsResponse = handleCors(event, cors$3);
	if (corsResponse !== false) return corsResponse;
	return dispatchChannelRequest(event, "POST /eve/v1/session/:sessionId/cancel", config$1);
};
//#endregion
//#region #nitro/virtual/eve-channel/OPTIONS /eve/v1/session/:sessionId/cancel
const cors$2 = {};
var cancel_default = (event) => {
	const corsResponse = handleCors(event, cors$2);
	if (corsResponse !== false) return corsResponse;
	return new Response(null, { status: 204 });
};
//#endregion
//#region #nitro/virtual/eve-channel/GET /eve/v1/session/:sessionId/stream
const cors$1 = {};
const config = { "kind": "production" };
var stream_default$1 = (event) => {
	const corsResponse = handleCors(event, cors$1);
	if (corsResponse !== false) return corsResponse;
	return dispatchChannelRequest(event, "GET /eve/v1/session/:sessionId/stream", config);
};
//#endregion
//#region #nitro/virtual/eve-channel/OPTIONS /eve/v1/session/:sessionId/stream
const cors = {};
var stream_default = (event) => {
	const corsResponse = handleCors(event, cors);
	if (corsResponse !== false) return corsResponse;
	return new Response(null, { status: 204 });
};
//#endregion
//#region agent/agent.ts
var agent_exports$1 = /* @__PURE__ */ __exportAll({ default: () => agent_default$1 });
var agent_default$1 = defineAgent({ model: createGoogle({ apiKey: process.env.GEMINI_API_KEY })(process.env.GEMINI_AGENT_MODEL || "gemini-2.5-flash") });
//#endregion
//#region agent/channels/eve.ts
var eve_exports = /* @__PURE__ */ __exportAll({ default: () => eve_default });
var eve_default = eveChannel({
	auth: [localDev()],
	cors: true
});
let adminClient = null;
function requireEnv$1(name) {
	const v = process.env[name]?.trim();
	if (!v) throw new Error(`Missing ${name}`);
	return v;
}
function isSupabaseConfigured() {
	return Boolean(process.env.SUPABASE_URL?.trim() && process.env.SUPABASE_SERVICE_ROLE_KEY?.trim());
}
function getSupabaseAdmin() {
	if (!adminClient) adminClient = createClient(requireEnv$1("SUPABASE_URL"), requireEnv$1("SUPABASE_SERVICE_ROLE_KEY"), { auth: {
		persistSession: false,
		autoRefreshToken: false
	} });
	return adminClient;
}
function extFromMime(mimeType) {
	if (mimeType === "image/jpeg") return "jpg";
	if (mimeType === "image/webp") return "webp";
	return "png";
}
function buildAssetStoragePath(mimeType) {
	return `product-assets/${randomUUID()}.${extFromMime(mimeType)}`;
}
function buildGenerationStoragePath(mimeType) {
	return `generations/${randomUUID()}.${extFromMime(mimeType)}`;
}
function detectBucket(storagePath) {
	if (storagePath.startsWith("generations/")) return "product-generated";
	if (storagePath.startsWith("product-assets/")) return "product-originals";
	return "product-media";
}
async function uploadToStorage(storagePath, buffer, mimeType) {
	const bucket = detectBucket(storagePath);
	const supabase = getSupabaseAdmin();
	const { error } = await supabase.storage.from(bucket).upload(storagePath, buffer, {
		contentType: mimeType,
		upsert: false
	});
	if (error) throw new Error(`Storage upload failed: ${error.message}`);
	const { data } = supabase.storage.from(bucket).getPublicUrl(storagePath);
	if (!data?.publicUrl) throw new Error("Failed to get public URL for uploaded file");
	return { publicUrl: data.publicUrl };
}
async function downloadFromStorage(storagePath) {
	const bucket = detectBucket(storagePath);
	const supabase = getSupabaseAdmin();
	let { data, error } = await supabase.storage.from(bucket).download(storagePath);
	if (error && bucket !== "product-media") ({data, error} = await supabase.storage.from("product-media").download(storagePath));
	if (error || !data) throw new Error(`Storage download failed: ${error?.message ?? "empty"}`);
	return Buffer.from(await data.arrayBuffer());
}
//#endregion
//#region node_modules/openai/internal/tslib.mjs
function __classPrivateFieldSet(receiver, state, value, kind, f) {
	if (kind === "m") throw new TypeError("Private method is not writable");
	if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
	if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
	return kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value), value;
}
function __classPrivateFieldGet(receiver, state, kind, f) {
	if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
	if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
	return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
}
//#endregion
//#region node_modules/openai/internal/utils/uuid.mjs
/**
* https://stackoverflow.com/a/2117523
*/
let uuid4 = function() {
	const { crypto } = globalThis;
	if (crypto?.randomUUID) {
		uuid4 = crypto.randomUUID.bind(crypto);
		return crypto.randomUUID();
	}
	const u8 = /* @__PURE__ */ new Uint8Array(1);
	const randomByte = crypto ? () => crypto.getRandomValues(u8)[0] : () => Math.random() * 255 & 255;
	return "10000000-1000-4000-8000-100000000000".replace(/[018]/g, (c) => (+c ^ randomByte() & 15 >> +c / 4).toString(16));
};
//#endregion
//#region node_modules/openai/internal/errors.mjs
function isAbortError(err) {
	return typeof err === "object" && err !== null && ("name" in err && err.name === "AbortError" || "message" in err && String(err.message).includes("FetchRequestCanceledException"));
}
const castToError = (err) => {
	if (err instanceof Error) return err;
	if (typeof err === "object" && err !== null) {
		try {
			if (Object.prototype.toString.call(err) === "[object Error]") {
				const error = new Error(err.message, err.cause ? { cause: err.cause } : {});
				if (err.stack) error.stack = err.stack;
				if (err.cause && !error.cause) error.cause = err.cause;
				if (err.name) error.name = err.name;
				return error;
			}
		} catch {}
		try {
			return new Error(JSON.stringify(err));
		} catch {}
	}
	return new Error(err);
};
//#endregion
//#region node_modules/openai/core/error.mjs
var OpenAIError = class extends Error {};
var APIError = class APIError extends OpenAIError {
	constructor(status, error, message, headers) {
		super(`${APIError.makeMessage(status, error, message)}`);
		this.status = status;
		this.headers = headers;
		this.requestID = headers?.get("x-request-id");
		this.error = error;
		const data = error;
		this.code = data?.["code"];
		this.param = data?.["param"];
		this.type = data?.["type"];
	}
	static makeMessage(status, error, message) {
		const msg = error?.message ? typeof error.message === "string" ? error.message : JSON.stringify(error.message) : error ? JSON.stringify(error) : message;
		if (status && msg) return `${status} ${msg}`;
		if (status) return `${status} status code (no body)`;
		if (msg) return msg;
		return "(no status code or body)";
	}
	static generate(status, errorResponse, message, headers) {
		if (!status || !headers) return new APIConnectionError({
			message,
			cause: castToError(errorResponse)
		});
		const error = errorResponse?.["error"];
		if (status === 400) return new BadRequestError(status, error, message, headers);
		if (status === 401) return new AuthenticationError(status, error, message, headers);
		if (status === 403) return new PermissionDeniedError(status, error, message, headers);
		if (status === 404) return new NotFoundError(status, error, message, headers);
		if (status === 409) return new ConflictError(status, error, message, headers);
		if (status === 422) return new UnprocessableEntityError(status, error, message, headers);
		if (status === 429) return new RateLimitError(status, error, message, headers);
		if (status >= 500) return new InternalServerError(status, error, message, headers);
		return new APIError(status, error, message, headers);
	}
};
var APIUserAbortError = class extends APIError {
	constructor({ message } = {}) {
		super(void 0, void 0, message || "Request was aborted.", void 0);
	}
};
var APIConnectionError = class extends APIError {
	constructor({ message, cause }) {
		super(void 0, void 0, message || "Connection error.", void 0);
		if (cause) this.cause = cause;
	}
};
var APIConnectionTimeoutError = class extends APIConnectionError {
	constructor({ message } = {}) {
		super({ message: message ?? "Request timed out." });
	}
};
var BadRequestError = class extends APIError {};
var AuthenticationError = class extends APIError {};
var PermissionDeniedError = class extends APIError {};
var NotFoundError = class extends APIError {};
var ConflictError = class extends APIError {};
var UnprocessableEntityError = class extends APIError {};
var RateLimitError = class extends APIError {};
var InternalServerError = class extends APIError {};
var LengthFinishReasonError = class extends OpenAIError {
	constructor() {
		super(`Could not parse response content as the length limit was reached`);
	}
};
var ContentFilterFinishReasonError = class extends OpenAIError {
	constructor() {
		super(`Could not parse response content as the request was rejected by the content filter`);
	}
};
var InvalidWebhookSignatureError = class extends Error {
	constructor(message) {
		super(message);
	}
};
/**
* Error thrown by the API server during OAuth token exchange.
* Can have status codes 400, 401, or 403.
* Other status codes from OAuth endpoints are raised as normal APIError types.
*/
var OAuthError = class extends APIError {
	constructor(status, error, headers) {
		let finalMessage = "OAuth2 authentication error";
		let error_code = void 0;
		if (error && typeof error === "object") {
			const errorData = error;
			error_code = errorData["error"];
			const description = errorData["error_description"];
			if (description && typeof description === "string") finalMessage = description;
			else if (error_code) finalMessage = error_code;
		}
		super(status, error, finalMessage, headers);
		this.error_code = error_code;
	}
};
var SubjectTokenProviderError = class extends OpenAIError {
	constructor(message, provider, cause) {
		super(message);
		this.provider = provider;
		this.cause = cause;
	}
};
//#endregion
//#region node_modules/openai/internal/utils/values.mjs
const startsWithSchemeRegexp = /^[a-z][a-z0-9+.-]*:/i;
const isAbsoluteURL = (url) => {
	return startsWithSchemeRegexp.test(url);
};
let isArray = (val) => (isArray = Array.isArray, isArray(val));
let isReadonlyArray = isArray;
/** Returns an object if the given value isn't an object, otherwise returns as-is */
function maybeObj(x) {
	if (typeof x !== "object") return {};
	return x ?? {};
}
function isEmptyObj(obj) {
	if (!obj) return true;
	for (const _k in obj) return false;
	return true;
}
function hasOwn(obj, key) {
	return Object.prototype.hasOwnProperty.call(obj, key);
}
function isObj(obj) {
	return obj != null && typeof obj === "object" && !Array.isArray(obj);
}
const validatePositiveInteger = (name, n) => {
	if (typeof n !== "number" || !Number.isInteger(n)) throw new OpenAIError(`${name} must be an integer`);
	if (n < 0) throw new OpenAIError(`${name} must be a positive integer`);
	return n;
};
const safeJSON = (text) => {
	try {
		return JSON.parse(text);
	} catch (err) {
		return;
	}
};
//#endregion
//#region node_modules/openai/internal/utils/sleep.mjs
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
//#endregion
//#region node_modules/openai/internal/detect-platform.mjs
const isRunningInBrowser = () => {
	return typeof window !== "undefined" && typeof window.document !== "undefined" && typeof navigator !== "undefined";
};
/**
* Note this does not detect 'browser'; for that, use getBrowserInfo().
*/
function getDetectedPlatform() {
	if (typeof Deno !== "undefined" && Deno.build != null) return "deno";
	if (typeof EdgeRuntime !== "undefined") return "edge";
	if (Object.prototype.toString.call(typeof globalThis.process !== "undefined" ? globalThis.process : 0) === "[object process]") return "node";
	return "unknown";
}
const getPlatformProperties = () => {
	const detectedPlatform = getDetectedPlatform();
	if (detectedPlatform === "deno") return {
		"X-Stainless-Lang": "js",
		"X-Stainless-Package-Version": "6.45.0",
		"X-Stainless-OS": normalizePlatform(Deno.build.os),
		"X-Stainless-Arch": normalizeArch(Deno.build.arch),
		"X-Stainless-Runtime": "deno",
		"X-Stainless-Runtime-Version": typeof Deno.version === "string" ? Deno.version : Deno.version?.deno ?? "unknown"
	};
	if (typeof EdgeRuntime !== "undefined") return {
		"X-Stainless-Lang": "js",
		"X-Stainless-Package-Version": "6.45.0",
		"X-Stainless-OS": "Unknown",
		"X-Stainless-Arch": `other:${EdgeRuntime}`,
		"X-Stainless-Runtime": "edge",
		"X-Stainless-Runtime-Version": globalThis.process.version
	};
	if (detectedPlatform === "node") return {
		"X-Stainless-Lang": "js",
		"X-Stainless-Package-Version": "6.45.0",
		"X-Stainless-OS": normalizePlatform(globalThis.process.platform ?? "unknown"),
		"X-Stainless-Arch": normalizeArch(globalThis.process.arch ?? "unknown"),
		"X-Stainless-Runtime": "node",
		"X-Stainless-Runtime-Version": globalThis.process.version ?? "unknown"
	};
	const browserInfo = getBrowserInfo();
	if (browserInfo) return {
		"X-Stainless-Lang": "js",
		"X-Stainless-Package-Version": "6.45.0",
		"X-Stainless-OS": "Unknown",
		"X-Stainless-Arch": "unknown",
		"X-Stainless-Runtime": `browser:${browserInfo.browser}`,
		"X-Stainless-Runtime-Version": browserInfo.version
	};
	return {
		"X-Stainless-Lang": "js",
		"X-Stainless-Package-Version": "6.45.0",
		"X-Stainless-OS": "Unknown",
		"X-Stainless-Arch": "unknown",
		"X-Stainless-Runtime": "unknown",
		"X-Stainless-Runtime-Version": "unknown"
	};
};
function getBrowserInfo() {
	if (typeof navigator === "undefined" || !navigator) return null;
	for (const { key, pattern } of [
		{
			key: "edge",
			pattern: /Edge(?:\W+(\d+)\.(\d+)(?:\.(\d+))?)?/
		},
		{
			key: "ie",
			pattern: /MSIE(?:\W+(\d+)\.(\d+)(?:\.(\d+))?)?/
		},
		{
			key: "ie",
			pattern: /Trident(?:.*rv\:(\d+)\.(\d+)(?:\.(\d+))?)?/
		},
		{
			key: "chrome",
			pattern: /Chrome(?:\W+(\d+)\.(\d+)(?:\.(\d+))?)?/
		},
		{
			key: "firefox",
			pattern: /Firefox(?:\W+(\d+)\.(\d+)(?:\.(\d+))?)?/
		},
		{
			key: "safari",
			pattern: /(?:Version\W+(\d+)\.(\d+)(?:\.(\d+))?)?(?:\W+Mobile\S*)?\W+Safari/
		}
	]) {
		const match = pattern.exec(navigator.userAgent);
		if (match) return {
			browser: key,
			version: `${match[1] || 0}.${match[2] || 0}.${match[3] || 0}`
		};
	}
	return null;
}
const normalizeArch = (arch) => {
	if (arch === "x32") return "x32";
	if (arch === "x86_64" || arch === "x64") return "x64";
	if (arch === "arm") return "arm";
	if (arch === "aarch64" || arch === "arm64") return "arm64";
	if (arch) return `other:${arch}`;
	return "unknown";
};
const normalizePlatform = (platform) => {
	platform = platform.toLowerCase();
	if (platform.includes("ios")) return "iOS";
	if (platform === "android") return "Android";
	if (platform === "darwin") return "MacOS";
	if (platform === "win32") return "Windows";
	if (platform === "freebsd") return "FreeBSD";
	if (platform === "openbsd") return "OpenBSD";
	if (platform === "linux") return "Linux";
	if (platform) return `Other:${platform}`;
	return "Unknown";
};
let _platformHeaders;
const getPlatformHeaders = () => {
	return _platformHeaders ?? (_platformHeaders = getPlatformProperties());
};
//#endregion
//#region node_modules/openai/internal/shims.mjs
function getDefaultFetch() {
	if (typeof fetch !== "undefined") return fetch;
	throw new Error("`fetch` is not defined as a global; Either pass `fetch` to the client, `new OpenAI({ fetch })` or polyfill the global, `globalThis.fetch = fetch`");
}
function makeReadableStream(...args) {
	const ReadableStream = globalThis.ReadableStream;
	if (typeof ReadableStream === "undefined") throw new Error("`ReadableStream` is not defined as a global; You will need to polyfill it, `globalThis.ReadableStream = ReadableStream`");
	return new ReadableStream(...args);
}
function ReadableStreamFrom(iterable) {
	let iter = Symbol.asyncIterator in iterable ? iterable[Symbol.asyncIterator]() : iterable[Symbol.iterator]();
	return makeReadableStream({
		start() {},
		async pull(controller) {
			const { done, value } = await iter.next();
			if (done) controller.close();
			else controller.enqueue(value);
		},
		async cancel() {
			await iter.return?.();
		}
	});
}
/**
* Most browsers don't yet have async iterable support for ReadableStream,
* and Node has a very different way of reading bytes from its "ReadableStream".
*
* This polyfill was pulled from https://github.com/MattiasBuelens/web-streams-polyfill/pull/122#issuecomment-1627354490
*/
function ReadableStreamToAsyncIterable(stream) {
	if (stream[Symbol.asyncIterator]) return stream;
	const reader = stream.getReader();
	return {
		async next() {
			try {
				const result = await reader.read();
				if (result?.done) reader.releaseLock();
				return result;
			} catch (e) {
				reader.releaseLock();
				throw e;
			}
		},
		async return() {
			const cancelPromise = reader.cancel();
			reader.releaseLock();
			await cancelPromise;
			return {
				done: true,
				value: void 0
			};
		},
		[Symbol.asyncIterator]() {
			return this;
		}
	};
}
/**
* Cancels a ReadableStream we don't need to consume.
* See https://undici.nodejs.org/#/?id=garbage-collection
*/
async function CancelReadableStream(stream) {
	if (stream === null || typeof stream !== "object") return;
	if (stream[Symbol.asyncIterator]) {
		await stream[Symbol.asyncIterator]().return?.();
		return;
	}
	const reader = stream.getReader();
	const cancelPromise = reader.cancel();
	reader.releaseLock();
	await cancelPromise;
}
//#endregion
//#region node_modules/openai/internal/request-options.mjs
const FallbackEncoder = ({ headers, body }) => {
	return {
		bodyHeaders: { "content-type": "application/json" },
		body: JSON.stringify(body)
	};
};
//#endregion
//#region node_modules/openai/internal/qs/formats.mjs
const default_formatter = (v) => String(v);
const formatters = {
	RFC1738: (v) => String(v).replace(/%20/g, "+"),
	RFC3986: default_formatter
};
//#endregion
//#region node_modules/openai/internal/qs/utils.mjs
let has = (obj, key) => (has = Object.hasOwn ?? Function.prototype.call.bind(Object.prototype.hasOwnProperty), has(obj, key));
const hex_table = /* @__PURE__ */ (() => {
	const array = [];
	for (let i = 0; i < 256; ++i) array.push("%" + ((i < 16 ? "0" : "") + i.toString(16)).toUpperCase());
	return array;
})();
const limit = 1024;
const encode = (str, _defaultEncoder, charset, _kind, format) => {
	if (str.length === 0) return str;
	let string = str;
	if (typeof str === "symbol") string = Symbol.prototype.toString.call(str);
	else if (typeof str !== "string") string = String(str);
	if (charset === "iso-8859-1") return escape(string).replace(/%u[0-9a-f]{4}/gi, function($0) {
		return "%26%23" + parseInt($0.slice(2), 16) + "%3B";
	});
	let out = "";
	for (let j = 0; j < string.length; j += limit) {
		const segment = string.length >= limit ? string.slice(j, j + limit) : string;
		const arr = [];
		for (let i = 0; i < segment.length; ++i) {
			let c = segment.charCodeAt(i);
			if (c === 45 || c === 46 || c === 95 || c === 126 || c >= 48 && c <= 57 || c >= 65 && c <= 90 || c >= 97 && c <= 122 || format === "RFC1738" && (c === 40 || c === 41)) {
				arr[arr.length] = segment.charAt(i);
				continue;
			}
			if (c < 128) {
				arr[arr.length] = hex_table[c];
				continue;
			}
			if (c < 2048) {
				arr[arr.length] = hex_table[192 | c >> 6] + hex_table[128 | c & 63];
				continue;
			}
			if (c < 55296 || c >= 57344) {
				arr[arr.length] = hex_table[224 | c >> 12] + hex_table[128 | c >> 6 & 63] + hex_table[128 | c & 63];
				continue;
			}
			i += 1;
			c = 65536 + ((c & 1023) << 10 | segment.charCodeAt(i) & 1023);
			arr[arr.length] = hex_table[240 | c >> 18] + hex_table[128 | c >> 12 & 63] + hex_table[128 | c >> 6 & 63] + hex_table[128 | c & 63];
		}
		out += arr.join("");
	}
	return out;
};
function is_buffer(obj) {
	if (!obj || typeof obj !== "object") return false;
	return !!(obj.constructor && obj.constructor.isBuffer && obj.constructor.isBuffer(obj));
}
function maybe_map(val, fn) {
	if (isArray(val)) {
		const mapped = [];
		for (let i = 0; i < val.length; i += 1) mapped.push(fn(val[i]));
		return mapped;
	}
	return fn(val);
}
//#endregion
//#region node_modules/openai/internal/qs/stringify.mjs
const array_prefix_generators = {
	brackets(prefix) {
		return String(prefix) + "[]";
	},
	comma: "comma",
	indices(prefix, key) {
		return String(prefix) + "[" + key + "]";
	},
	repeat(prefix) {
		return String(prefix);
	}
};
const push_to_array = function(arr, value_or_array) {
	Array.prototype.push.apply(arr, isArray(value_or_array) ? value_or_array : [value_or_array]);
};
let toISOString;
const defaults = {
	addQueryPrefix: false,
	allowDots: false,
	allowEmptyArrays: false,
	arrayFormat: "indices",
	charset: "utf-8",
	charsetSentinel: false,
	delimiter: "&",
	encode: true,
	encodeDotInKeys: false,
	encoder: encode,
	encodeValuesOnly: false,
	format: "RFC3986",
	formatter: default_formatter,
	/** @deprecated */
	indices: false,
	serializeDate(date) {
		return (toISOString ?? (toISOString = Function.prototype.call.bind(Date.prototype.toISOString)))(date);
	},
	skipNulls: false,
	strictNullHandling: false
};
function is_non_nullish_primitive(v) {
	return typeof v === "string" || typeof v === "number" || typeof v === "boolean" || typeof v === "symbol" || typeof v === "bigint";
}
const sentinel = {};
function inner_stringify(object, prefix, generateArrayPrefix, commaRoundTrip, allowEmptyArrays, strictNullHandling, skipNulls, encodeDotInKeys, encoder, filter, sort, allowDots, serializeDate, format, formatter, encodeValuesOnly, charset, sideChannel) {
	let obj = object;
	let tmp_sc = sideChannel;
	let step = 0;
	let find_flag = false;
	while ((tmp_sc = tmp_sc.get(sentinel)) !== void 0 && !find_flag) {
		const pos = tmp_sc.get(object);
		step += 1;
		if (typeof pos !== "undefined") if (pos === step) throw new RangeError("Cyclic object value");
		else find_flag = true;
		if (typeof tmp_sc.get(sentinel) === "undefined") step = 0;
	}
	if (typeof filter === "function") obj = filter(prefix, obj);
	else if (obj instanceof Date) obj = serializeDate?.(obj);
	else if (generateArrayPrefix === "comma" && isArray(obj)) obj = maybe_map(obj, function(value) {
		if (value instanceof Date) return serializeDate?.(value);
		return value;
	});
	if (obj === null) {
		if (strictNullHandling) return encoder && !encodeValuesOnly ? encoder(prefix, defaults.encoder, charset, "key", format) : prefix;
		obj = "";
	}
	if (is_non_nullish_primitive(obj) || is_buffer(obj)) {
		if (encoder) {
			const key_value = encodeValuesOnly ? prefix : encoder(prefix, defaults.encoder, charset, "key", format);
			return [formatter?.(key_value) + "=" + formatter?.(encoder(obj, defaults.encoder, charset, "value", format))];
		}
		return [formatter?.(prefix) + "=" + formatter?.(String(obj))];
	}
	const values = [];
	if (typeof obj === "undefined") return values;
	let obj_keys;
	if (generateArrayPrefix === "comma" && isArray(obj)) {
		if (encodeValuesOnly && encoder) obj = maybe_map(obj, encoder);
		obj_keys = [{ value: obj.length > 0 ? obj.join(",") || null : void 0 }];
	} else if (isArray(filter)) obj_keys = filter;
	else {
		const keys = Object.keys(obj);
		obj_keys = sort ? keys.sort(sort) : keys;
	}
	const encoded_prefix = encodeDotInKeys ? String(prefix).replace(/\./g, "%2E") : String(prefix);
	const adjusted_prefix = commaRoundTrip && isArray(obj) && obj.length === 1 ? encoded_prefix + "[]" : encoded_prefix;
	if (allowEmptyArrays && isArray(obj) && obj.length === 0) return adjusted_prefix + "[]";
	for (let j = 0; j < obj_keys.length; ++j) {
		const key = obj_keys[j];
		const value = typeof key === "object" && typeof key.value !== "undefined" ? key.value : obj[key];
		if (skipNulls && value === null) continue;
		const encoded_key = allowDots && encodeDotInKeys ? key.replace(/\./g, "%2E") : key;
		const key_prefix = isArray(obj) ? typeof generateArrayPrefix === "function" ? generateArrayPrefix(adjusted_prefix, encoded_key) : adjusted_prefix : adjusted_prefix + (allowDots ? "." + encoded_key : "[" + encoded_key + "]");
		sideChannel.set(object, step);
		const valueSideChannel = /* @__PURE__ */ new WeakMap();
		valueSideChannel.set(sentinel, sideChannel);
		push_to_array(values, inner_stringify(value, key_prefix, generateArrayPrefix, commaRoundTrip, allowEmptyArrays, strictNullHandling, skipNulls, encodeDotInKeys, generateArrayPrefix === "comma" && encodeValuesOnly && isArray(obj) ? null : encoder, filter, sort, allowDots, serializeDate, format, formatter, encodeValuesOnly, charset, valueSideChannel));
	}
	return values;
}
function normalize_stringify_options(opts = defaults) {
	if (typeof opts.allowEmptyArrays !== "undefined" && typeof opts.allowEmptyArrays !== "boolean") throw new TypeError("`allowEmptyArrays` option can only be `true` or `false`, when provided");
	if (typeof opts.encodeDotInKeys !== "undefined" && typeof opts.encodeDotInKeys !== "boolean") throw new TypeError("`encodeDotInKeys` option can only be `true` or `false`, when provided");
	if (opts.encoder !== null && typeof opts.encoder !== "undefined" && typeof opts.encoder !== "function") throw new TypeError("Encoder has to be a function.");
	const charset = opts.charset || defaults.charset;
	if (typeof opts.charset !== "undefined" && opts.charset !== "utf-8" && opts.charset !== "iso-8859-1") throw new TypeError("The charset option must be either utf-8, iso-8859-1, or undefined");
	let format = "RFC3986";
	if (typeof opts.format !== "undefined") {
		if (!has(formatters, opts.format)) throw new TypeError("Unknown format option provided.");
		format = opts.format;
	}
	const formatter = formatters[format];
	let filter = defaults.filter;
	if (typeof opts.filter === "function" || isArray(opts.filter)) filter = opts.filter;
	let arrayFormat;
	if (opts.arrayFormat && opts.arrayFormat in array_prefix_generators) arrayFormat = opts.arrayFormat;
	else if ("indices" in opts) arrayFormat = opts.indices ? "indices" : "repeat";
	else arrayFormat = defaults.arrayFormat;
	if ("commaRoundTrip" in opts && typeof opts.commaRoundTrip !== "boolean") throw new TypeError("`commaRoundTrip` must be a boolean, or absent");
	const allowDots = typeof opts.allowDots === "undefined" ? !!opts.encodeDotInKeys === true ? true : defaults.allowDots : !!opts.allowDots;
	return {
		addQueryPrefix: typeof opts.addQueryPrefix === "boolean" ? opts.addQueryPrefix : defaults.addQueryPrefix,
		allowDots,
		allowEmptyArrays: typeof opts.allowEmptyArrays === "boolean" ? !!opts.allowEmptyArrays : defaults.allowEmptyArrays,
		arrayFormat,
		charset,
		charsetSentinel: typeof opts.charsetSentinel === "boolean" ? opts.charsetSentinel : defaults.charsetSentinel,
		commaRoundTrip: !!opts.commaRoundTrip,
		delimiter: typeof opts.delimiter === "undefined" ? defaults.delimiter : opts.delimiter,
		encode: typeof opts.encode === "boolean" ? opts.encode : defaults.encode,
		encodeDotInKeys: typeof opts.encodeDotInKeys === "boolean" ? opts.encodeDotInKeys : defaults.encodeDotInKeys,
		encoder: typeof opts.encoder === "function" ? opts.encoder : defaults.encoder,
		encodeValuesOnly: typeof opts.encodeValuesOnly === "boolean" ? opts.encodeValuesOnly : defaults.encodeValuesOnly,
		filter,
		format,
		formatter,
		serializeDate: typeof opts.serializeDate === "function" ? opts.serializeDate : defaults.serializeDate,
		skipNulls: typeof opts.skipNulls === "boolean" ? opts.skipNulls : defaults.skipNulls,
		sort: typeof opts.sort === "function" ? opts.sort : null,
		strictNullHandling: typeof opts.strictNullHandling === "boolean" ? opts.strictNullHandling : defaults.strictNullHandling
	};
}
function stringify(object, opts = {}) {
	let obj = object;
	const options = normalize_stringify_options(opts);
	let obj_keys;
	let filter;
	if (typeof options.filter === "function") {
		filter = options.filter;
		obj = filter("", obj);
	} else if (isArray(options.filter)) {
		filter = options.filter;
		obj_keys = filter;
	}
	const keys = [];
	if (typeof obj !== "object" || obj === null) return "";
	const generateArrayPrefix = array_prefix_generators[options.arrayFormat];
	const commaRoundTrip = generateArrayPrefix === "comma" && options.commaRoundTrip;
	if (!obj_keys) obj_keys = Object.keys(obj);
	if (options.sort) obj_keys.sort(options.sort);
	const sideChannel = /* @__PURE__ */ new WeakMap();
	for (let i = 0; i < obj_keys.length; ++i) {
		const key = obj_keys[i];
		if (options.skipNulls && obj[key] === null) continue;
		push_to_array(keys, inner_stringify(obj[key], key, generateArrayPrefix, commaRoundTrip, options.allowEmptyArrays, options.strictNullHandling, options.skipNulls, options.encodeDotInKeys, options.encode ? options.encoder : null, options.filter, options.sort, options.allowDots, options.serializeDate, options.format, options.formatter, options.encodeValuesOnly, options.charset, sideChannel));
	}
	const joined = keys.join(options.delimiter);
	let prefix = options.addQueryPrefix === true ? "?" : "";
	if (options.charsetSentinel) if (options.charset === "iso-8859-1") prefix += "utf8=%26%2310003%3B&";
	else prefix += "utf8=%E2%9C%93&";
	return joined.length > 0 ? prefix + joined : "";
}
//#endregion
//#region node_modules/openai/internal/utils/query.mjs
function stringifyQuery(query) {
	return stringify(query, { arrayFormat: "brackets" });
}
//#endregion
//#region node_modules/openai/internal/utils/bytes.mjs
function concatBytes(buffers) {
	let length = 0;
	for (const buffer of buffers) length += buffer.length;
	const output = new Uint8Array(length);
	let index = 0;
	for (const buffer of buffers) {
		output.set(buffer, index);
		index += buffer.length;
	}
	return output;
}
let encodeUTF8_;
function encodeUTF8(str) {
	let encoder;
	return (encodeUTF8_ ?? (encoder = new globalThis.TextEncoder(), encodeUTF8_ = encoder.encode.bind(encoder)))(str);
}
let decodeUTF8_;
function decodeUTF8(bytes) {
	let decoder;
	return (decodeUTF8_ ?? (decoder = new globalThis.TextDecoder(), decodeUTF8_ = decoder.decode.bind(decoder)))(bytes);
}
//#endregion
//#region node_modules/openai/internal/decoders/line.mjs
var _LineDecoder_buffer;
var _LineDecoder_carriageReturnIndex;
/**
* A re-implementation of httpx's `LineDecoder` in Python that handles incrementally
* reading lines from text.
*
* https://github.com/encode/httpx/blob/920333ea98118e9cf617f246905d7b202510941c/httpx/_decoders.py#L258
*/
var LineDecoder = class {
	constructor() {
		_LineDecoder_buffer.set(this, void 0);
		_LineDecoder_carriageReturnIndex.set(this, void 0);
		__classPrivateFieldSet(this, _LineDecoder_buffer, /* @__PURE__ */ new Uint8Array(), "f");
		__classPrivateFieldSet(this, _LineDecoder_carriageReturnIndex, null, "f");
	}
	decode(chunk) {
		if (chunk == null) return [];
		const binaryChunk = chunk instanceof ArrayBuffer ? new Uint8Array(chunk) : typeof chunk === "string" ? encodeUTF8(chunk) : chunk;
		__classPrivateFieldSet(this, _LineDecoder_buffer, concatBytes([__classPrivateFieldGet(this, _LineDecoder_buffer, "f"), binaryChunk]), "f");
		const lines = [];
		let patternIndex;
		while ((patternIndex = findNewlineIndex(__classPrivateFieldGet(this, _LineDecoder_buffer, "f"), __classPrivateFieldGet(this, _LineDecoder_carriageReturnIndex, "f"))) != null) {
			if (patternIndex.carriage && __classPrivateFieldGet(this, _LineDecoder_carriageReturnIndex, "f") == null) {
				__classPrivateFieldSet(this, _LineDecoder_carriageReturnIndex, patternIndex.index, "f");
				continue;
			}
			if (__classPrivateFieldGet(this, _LineDecoder_carriageReturnIndex, "f") != null && (patternIndex.index !== __classPrivateFieldGet(this, _LineDecoder_carriageReturnIndex, "f") + 1 || patternIndex.carriage)) {
				lines.push(decodeUTF8(__classPrivateFieldGet(this, _LineDecoder_buffer, "f").subarray(0, __classPrivateFieldGet(this, _LineDecoder_carriageReturnIndex, "f") - 1)));
				__classPrivateFieldSet(this, _LineDecoder_buffer, __classPrivateFieldGet(this, _LineDecoder_buffer, "f").subarray(__classPrivateFieldGet(this, _LineDecoder_carriageReturnIndex, "f")), "f");
				__classPrivateFieldSet(this, _LineDecoder_carriageReturnIndex, null, "f");
				continue;
			}
			const endIndex = __classPrivateFieldGet(this, _LineDecoder_carriageReturnIndex, "f") !== null ? patternIndex.preceding - 1 : patternIndex.preceding;
			const line = decodeUTF8(__classPrivateFieldGet(this, _LineDecoder_buffer, "f").subarray(0, endIndex));
			lines.push(line);
			__classPrivateFieldSet(this, _LineDecoder_buffer, __classPrivateFieldGet(this, _LineDecoder_buffer, "f").subarray(patternIndex.index), "f");
			__classPrivateFieldSet(this, _LineDecoder_carriageReturnIndex, null, "f");
		}
		return lines;
	}
	flush() {
		if (!__classPrivateFieldGet(this, _LineDecoder_buffer, "f").length) return [];
		return this.decode("\n");
	}
};
_LineDecoder_buffer = /* @__PURE__ */ new WeakMap(), _LineDecoder_carriageReturnIndex = /* @__PURE__ */ new WeakMap();
LineDecoder.NEWLINE_CHARS = /* @__PURE__ */ new Set(["\n", "\r"]);
LineDecoder.NEWLINE_REGEXP = /\r\n|[\n\r]/g;
/**
* This function searches the buffer for the end patterns, (\r or \n)
* and returns an object with the index preceding the matched newline and the
* index after the newline char. `null` is returned if no new line is found.
*
* ```ts
* findNewLineIndex('abc\ndef') -> { preceding: 2, index: 3 }
* ```
*/
function findNewlineIndex(buffer, startIndex) {
	const newline = 10;
	const carriage = 13;
	for (let i = startIndex ?? 0; i < buffer.length; i++) {
		if (buffer[i] === newline) return {
			preceding: i,
			index: i + 1,
			carriage: false
		};
		if (buffer[i] === carriage) return {
			preceding: i,
			index: i + 1,
			carriage: true
		};
	}
	return null;
}
function findDoubleNewlineIndex(buffer) {
	const newline = 10;
	const carriage = 13;
	for (let i = 0; i < buffer.length - 1; i++) {
		if (buffer[i] === newline && buffer[i + 1] === newline) return i + 2;
		if (buffer[i] === carriage && buffer[i + 1] === carriage) return i + 2;
		if (buffer[i] === carriage && buffer[i + 1] === newline && i + 3 < buffer.length && buffer[i + 2] === carriage && buffer[i + 3] === newline) return i + 4;
	}
	return -1;
}
//#endregion
//#region node_modules/openai/internal/utils/log.mjs
const levelNumbers = {
	off: 0,
	error: 200,
	warn: 300,
	info: 400,
	debug: 500
};
const parseLogLevel = (maybeLevel, sourceName, client) => {
	if (!maybeLevel) return;
	if (hasOwn(levelNumbers, maybeLevel)) return maybeLevel;
	loggerFor(client).warn(`${sourceName} was set to ${JSON.stringify(maybeLevel)}, expected one of ${JSON.stringify(Object.keys(levelNumbers))}`);
};
function noop() {}
function makeLogFn(fnLevel, logger, logLevel) {
	if (!logger || levelNumbers[fnLevel] > levelNumbers[logLevel]) return noop;
	else return logger[fnLevel].bind(logger);
}
const noopLogger = {
	error: noop,
	warn: noop,
	info: noop,
	debug: noop
};
let cachedLoggers = /* @__PURE__ */ new WeakMap();
function loggerFor(client) {
	const logger = client.logger;
	const logLevel = client.logLevel ?? "off";
	if (!logger) return noopLogger;
	const cachedLogger = cachedLoggers.get(logger);
	if (cachedLogger && cachedLogger[0] === logLevel) return cachedLogger[1];
	const levelLogger = {
		error: makeLogFn("error", logger, logLevel),
		warn: makeLogFn("warn", logger, logLevel),
		info: makeLogFn("info", logger, logLevel),
		debug: makeLogFn("debug", logger, logLevel)
	};
	cachedLoggers.set(logger, [logLevel, levelLogger]);
	return levelLogger;
}
const formatRequestDetails = (details) => {
	if (details.options) {
		details.options = { ...details.options };
		delete details.options["headers"];
	}
	if (details.headers) details.headers = Object.fromEntries((details.headers instanceof Headers ? [...details.headers] : Object.entries(details.headers)).map(([name, value]) => [name, name.toLowerCase() === "authorization" || name.toLowerCase() === "api-key" || name.toLowerCase() === "x-api-key" || name.toLowerCase() === "x-amz-security-token" || name.toLowerCase() === "cookie" || name.toLowerCase() === "set-cookie" ? "***" : value]));
	if ("retryOfRequestLogID" in details) {
		if (details.retryOfRequestLogID) details.retryOf = details.retryOfRequestLogID;
		delete details.retryOfRequestLogID;
	}
	return details;
};
//#endregion
//#region node_modules/openai/core/streaming.mjs
var _Stream_client;
var Stream = class Stream {
	constructor(iterator, controller, client) {
		this.iterator = iterator;
		_Stream_client.set(this, void 0);
		this.controller = controller;
		__classPrivateFieldSet(this, _Stream_client, client, "f");
	}
	static fromSSEResponse(response, controller, client, synthesizeEventData) {
		let consumed = false;
		const logger = client ? loggerFor(client) : console;
		async function* iterator() {
			if (consumed) throw new OpenAIError("Cannot iterate over a consumed stream, use `.tee()` to split the stream.");
			consumed = true;
			let done = false;
			try {
				for await (const sse of _iterSSEMessages(response, controller)) {
					if (done) continue;
					if (sse.data.startsWith("[DONE]")) {
						done = true;
						continue;
					}
					if (sse.event === null || !sse.event.startsWith("thread.")) {
						let data;
						try {
							data = JSON.parse(sse.data);
						} catch (e) {
							logger.error(`Could not parse message into JSON:`, sse.data);
							logger.error(`From chunk:`, sse.raw);
							throw e;
						}
						if (data && data.error) throw new APIError(void 0, data.error, void 0, response.headers);
						yield synthesizeEventData ? {
							event: sse.event,
							data
						} : data;
					} else {
						let data;
						try {
							data = JSON.parse(sse.data);
						} catch (e) {
							console.error(`Could not parse message into JSON:`, sse.data);
							console.error(`From chunk:`, sse.raw);
							throw e;
						}
						if (sse.event == "error") throw new APIError(void 0, data.error, data.message, void 0);
						yield {
							event: sse.event,
							data
						};
					}
				}
				done = true;
			} catch (e) {
				if (isAbortError(e)) return;
				throw e;
			} finally {
				if (!done) controller.abort();
			}
		}
		return new Stream(iterator, controller, client);
	}
	/**
	* Generates a Stream from a newline-separated ReadableStream
	* where each item is a JSON value.
	*/
	static fromReadableStream(readableStream, controller, client) {
		let consumed = false;
		async function* iterLines() {
			const lineDecoder = new LineDecoder();
			const iter = ReadableStreamToAsyncIterable(readableStream);
			for await (const chunk of iter) for (const line of lineDecoder.decode(chunk)) yield line;
			for (const line of lineDecoder.flush()) yield line;
		}
		async function* iterator() {
			if (consumed) throw new OpenAIError("Cannot iterate over a consumed stream, use `.tee()` to split the stream.");
			consumed = true;
			let done = false;
			try {
				for await (const line of iterLines()) {
					if (done) continue;
					if (line) yield JSON.parse(line);
				}
				done = true;
			} catch (e) {
				if (isAbortError(e)) return;
				throw e;
			} finally {
				if (!done) controller.abort();
			}
		}
		return new Stream(iterator, controller, client);
	}
	[(_Stream_client = /* @__PURE__ */ new WeakMap(), Symbol.asyncIterator)]() {
		return this.iterator();
	}
	/**
	* Splits the stream into two streams which can be
	* independently read from at different speeds.
	*/
	tee() {
		const left = [];
		const right = [];
		const iterator = this.iterator();
		const teeIterator = (queue) => {
			return { next: () => {
				if (queue.length === 0) {
					const result = iterator.next();
					left.push(result);
					right.push(result);
				}
				return queue.shift();
			} };
		};
		return [new Stream(() => teeIterator(left), this.controller, __classPrivateFieldGet(this, _Stream_client, "f")), new Stream(() => teeIterator(right), this.controller, __classPrivateFieldGet(this, _Stream_client, "f"))];
	}
	/**
	* Converts this stream to a newline-separated ReadableStream of
	* JSON stringified values in the stream
	* which can be turned back into a Stream with `Stream.fromReadableStream()`.
	*/
	toReadableStream() {
		const self = this;
		let iter;
		return makeReadableStream({
			async start() {
				iter = self[Symbol.asyncIterator]();
			},
			async pull(ctrl) {
				try {
					const { value, done } = await iter.next();
					if (done) return ctrl.close();
					const bytes = encodeUTF8(JSON.stringify(value) + "\n");
					ctrl.enqueue(bytes);
				} catch (err) {
					ctrl.error(err);
				}
			},
			async cancel() {
				await iter.return?.();
			}
		});
	}
};
async function* _iterSSEMessages(response, controller) {
	if (!response.body) {
		controller.abort();
		if (typeof globalThis.navigator !== "undefined" && globalThis.navigator.product === "ReactNative") throw new OpenAIError(`The default react-native fetch implementation does not support streaming. Please use expo/fetch: https://docs.expo.dev/versions/latest/sdk/expo/#expofetch-api`);
		throw new OpenAIError(`Attempted to iterate over a response with no body`);
	}
	const sseDecoder = new SSEDecoder();
	const lineDecoder = new LineDecoder();
	const iter = ReadableStreamToAsyncIterable(response.body);
	for await (const sseChunk of iterSSEChunks(iter)) for (const line of lineDecoder.decode(sseChunk)) {
		const sse = sseDecoder.decode(line);
		if (sse) yield sse;
	}
	for (const line of lineDecoder.flush()) {
		const sse = sseDecoder.decode(line);
		if (sse) yield sse;
	}
}
/**
* Given an async iterable iterator, iterates over it and yields full
* SSE chunks, i.e. yields when a double new-line is encountered.
*/
async function* iterSSEChunks(iterator) {
	let data = /* @__PURE__ */ new Uint8Array();
	for await (const chunk of iterator) {
		if (chunk == null) continue;
		const binaryChunk = chunk instanceof ArrayBuffer ? new Uint8Array(chunk) : typeof chunk === "string" ? encodeUTF8(chunk) : chunk;
		let newData = new Uint8Array(data.length + binaryChunk.length);
		newData.set(data);
		newData.set(binaryChunk, data.length);
		data = newData;
		let patternIndex;
		while ((patternIndex = findDoubleNewlineIndex(data)) !== -1) {
			yield data.slice(0, patternIndex);
			data = data.slice(patternIndex);
		}
	}
	if (data.length > 0) yield data;
}
var SSEDecoder = class {
	constructor() {
		this.event = null;
		this.data = [];
		this.chunks = [];
	}
	decode(line) {
		if (line.endsWith("\r")) line = line.substring(0, line.length - 1);
		if (!line) {
			if (!this.event && !this.data.length) return null;
			const sse = {
				event: this.event,
				data: this.data.join("\n"),
				raw: this.chunks
			};
			this.event = null;
			this.data = [];
			this.chunks = [];
			return sse;
		}
		this.chunks.push(line);
		if (line.startsWith(":")) return null;
		let [fieldname, _, value] = partition(line, ":");
		if (value.startsWith(" ")) value = value.substring(1);
		if (fieldname === "event") this.event = value;
		else if (fieldname === "data") this.data.push(value);
		return null;
	}
};
function partition(str, delimiter) {
	const index = str.indexOf(delimiter);
	if (index !== -1) return [
		str.substring(0, index),
		delimiter,
		str.substring(index + delimiter.length)
	];
	return [
		str,
		"",
		""
	];
}
//#endregion
//#region node_modules/openai/internal/parse.mjs
async function defaultParseResponse(client, props) {
	const { response, requestLogID, retryOfRequestLogID, startTime } = props;
	const body = await (async () => {
		if (props.options.stream) {
			loggerFor(client).debug("response", response.status, response.url, response.headers, response.body);
			if (props.options.__streamClass) return props.options.__streamClass.fromSSEResponse(response, props.controller, client, props.options.__synthesizeEventData);
			return Stream.fromSSEResponse(response, props.controller, client, props.options.__synthesizeEventData);
		}
		if (response.status === 204) return null;
		if (props.options.__binaryResponse) return response;
		const mediaType = response.headers.get("content-type")?.split(";")[0]?.trim();
		if (mediaType?.includes("application/json") || mediaType?.endsWith("+json")) {
			if (response.headers.get("content-length") === "0") return;
			return addRequestID(await response.json(), response);
		}
		return await response.text();
	})();
	loggerFor(client).debug(`[${requestLogID}] response parsed`, formatRequestDetails({
		retryOfRequestLogID,
		url: response.url,
		status: response.status,
		body,
		durationMs: Date.now() - startTime
	}));
	return body;
}
function addRequestID(value, response) {
	if (!value || typeof value !== "object" || Array.isArray(value)) return value;
	return Object.defineProperty(value, "_request_id", {
		value: response.headers.get("x-request-id"),
		enumerable: false
	});
}
//#endregion
//#region node_modules/openai/core/api-promise.mjs
var _APIPromise_client;
/**
* A subclass of `Promise` providing additional helper methods
* for interacting with the SDK.
*/
var APIPromise = class APIPromise extends Promise {
	constructor(client, responsePromise, parseResponse = defaultParseResponse) {
		super((resolve) => {
			resolve(null);
		});
		this.responsePromise = responsePromise;
		this.parseResponse = parseResponse;
		_APIPromise_client.set(this, void 0);
		__classPrivateFieldSet(this, _APIPromise_client, client, "f");
	}
	_thenUnwrap(transform) {
		return new APIPromise(__classPrivateFieldGet(this, _APIPromise_client, "f"), this.responsePromise, async (client, props) => addRequestID(transform(await this.parseResponse(client, props), props), props.response));
	}
	/**
	* Gets the raw `Response` instance instead of parsing the response
	* data.
	*
	* If you want to parse the response body but still get the `Response`
	* instance, you can use {@link withResponse()}.
	*
	* 👋 Getting the wrong TypeScript type for `Response`?
	* Try setting `"moduleResolution": "NodeNext"` or add `"lib": ["DOM"]`
	* to your `tsconfig.json`.
	*/
	asResponse() {
		return this.responsePromise.then((p) => p.response);
	}
	/**
	* Gets the parsed response data, the raw `Response` instance and the ID of the request,
	* returned via the X-Request-ID header which is useful for debugging requests and reporting
	* issues to OpenAI.
	*
	* If you just want to get the raw `Response` instance without parsing it,
	* you can use {@link asResponse()}.
	*
	* 👋 Getting the wrong TypeScript type for `Response`?
	* Try setting `"moduleResolution": "NodeNext"` or add `"lib": ["DOM"]`
	* to your `tsconfig.json`.
	*/
	async withResponse() {
		const [data, response] = await Promise.all([this.parse(), this.asResponse()]);
		return {
			data,
			response,
			request_id: response.headers.get("x-request-id")
		};
	}
	parse() {
		if (!this.parsedPromise) this.parsedPromise = this.responsePromise.then((data) => this.parseResponse(__classPrivateFieldGet(this, _APIPromise_client, "f"), data));
		return this.parsedPromise;
	}
	then(onfulfilled, onrejected) {
		return this.parse().then(onfulfilled, onrejected);
	}
	catch(onrejected) {
		return this.parse().catch(onrejected);
	}
	finally(onfinally) {
		return this.parse().finally(onfinally);
	}
};
_APIPromise_client = /* @__PURE__ */ new WeakMap();
//#endregion
//#region node_modules/openai/core/pagination.mjs
var _AbstractPage_client;
var AbstractPage = class {
	constructor(client, response, body, options) {
		_AbstractPage_client.set(this, void 0);
		__classPrivateFieldSet(this, _AbstractPage_client, client, "f");
		this.options = options;
		this.response = response;
		this.body = body;
	}
	hasNextPage() {
		if (!this.getPaginatedItems().length) return false;
		return this.nextPageRequestOptions() != null;
	}
	async getNextPage() {
		const nextOptions = this.nextPageRequestOptions();
		if (!nextOptions) throw new OpenAIError("No next page expected; please check `.hasNextPage()` before calling `.getNextPage()`.");
		return await __classPrivateFieldGet(this, _AbstractPage_client, "f").requestAPIList(this.constructor, nextOptions);
	}
	async *iterPages() {
		let page = this;
		yield page;
		while (page.hasNextPage()) {
			page = await page.getNextPage();
			yield page;
		}
	}
	async *[(_AbstractPage_client = /* @__PURE__ */ new WeakMap(), Symbol.asyncIterator)]() {
		for await (const page of this.iterPages()) for (const item of page.getPaginatedItems()) yield item;
	}
};
/**
* This subclass of Promise will resolve to an instantiated Page once the request completes.
*
* It also implements AsyncIterable to allow auto-paginating iteration on an unawaited list call, eg:
*
*    for await (const item of client.items.list()) {
*      console.log(item)
*    }
*/
var PagePromise = class extends APIPromise {
	constructor(client, request, Page) {
		super(client, request, async (client, props) => new Page(client, props.response, await defaultParseResponse(client, props), props.options));
	}
	/**
	* Allow auto-paginating iteration on an unawaited list call, eg:
	*
	*    for await (const item of client.items.list()) {
	*      console.log(item)
	*    }
	*/
	async *[Symbol.asyncIterator]() {
		const page = await this;
		for await (const item of page) yield item;
	}
};
/**
* Note: no pagination actually occurs yet, this is for forwards-compatibility.
*/
var Page = class extends AbstractPage {
	constructor(client, response, body, options) {
		super(client, response, body, options);
		this.data = body.data || [];
		this.object = body.object;
	}
	getPaginatedItems() {
		return this.data ?? [];
	}
	nextPageRequestOptions() {
		return null;
	}
};
var CursorPage = class extends AbstractPage {
	constructor(client, response, body, options) {
		super(client, response, body, options);
		this.data = body.data || [];
		this.has_more = body.has_more || false;
	}
	getPaginatedItems() {
		return this.data ?? [];
	}
	hasNextPage() {
		if (this.has_more === false) return false;
		return super.hasNextPage();
	}
	nextPageRequestOptions() {
		const data = this.getPaginatedItems();
		const id = data[data.length - 1]?.id;
		if (!id) return null;
		return {
			...this.options,
			query: {
				...maybeObj(this.options.query),
				after: id
			}
		};
	}
};
var ConversationCursorPage = class extends AbstractPage {
	constructor(client, response, body, options) {
		super(client, response, body, options);
		this.data = body.data || [];
		this.has_more = body.has_more || false;
		this.last_id = body.last_id || "";
	}
	getPaginatedItems() {
		return this.data ?? [];
	}
	hasNextPage() {
		if (this.has_more === false) return false;
		return super.hasNextPage();
	}
	nextPageRequestOptions() {
		const cursor = this.last_id;
		if (!cursor) return null;
		return {
			...this.options,
			query: {
				...maybeObj(this.options.query),
				after: cursor
			}
		};
	}
};
var NextCursorPage = class extends AbstractPage {
	constructor(client, response, body, options) {
		super(client, response, body, options);
		this.data = body.data || [];
		this.has_more = body.has_more || false;
		this.next = body.next || null;
	}
	getPaginatedItems() {
		return this.data ?? [];
	}
	hasNextPage() {
		if (this.has_more === false) return false;
		return super.hasNextPage();
	}
	nextPageRequestOptions() {
		const cursor = this.next;
		if (!cursor) return null;
		return {
			...this.options,
			query: {
				...maybeObj(this.options.query),
				after: cursor
			}
		};
	}
};
//#endregion
//#region node_modules/openai/auth/workload-identity-auth.mjs
const SUBJECT_TOKEN_TYPES = {
	jwt: "urn:ietf:params:oauth:token-type:jwt",
	id: "urn:ietf:params:oauth:token-type:id_token"
};
const TOKEN_EXCHANGE_GRANT_TYPE = "urn:ietf:params:oauth:grant-type:token-exchange";
var WorkloadIdentityAuth = class {
	constructor(config, fetch) {
		this.cachedToken = null;
		this.refreshPromise = null;
		this.tokenExchangeUrl = "https://auth.openai.com/oauth/token";
		this.config = config;
		this.fetch = fetch ?? getDefaultFetch();
	}
	async getToken() {
		if (!this.cachedToken || this.isTokenExpired(this.cachedToken)) {
			if (this.refreshPromise) return await this.refreshPromise;
			this.refreshPromise = this.refreshToken();
			try {
				return await this.refreshPromise;
			} finally {
				this.refreshPromise = null;
			}
		}
		if (this.needsRefresh(this.cachedToken) && !this.refreshPromise) this.refreshPromise = this.refreshToken().finally(() => {
			this.refreshPromise = null;
		});
		return this.cachedToken.token;
	}
	async refreshToken() {
		const subjectToken = await this.config.provider.getToken();
		const body = {
			grant_type: TOKEN_EXCHANGE_GRANT_TYPE,
			subject_token: subjectToken,
			subject_token_type: SUBJECT_TOKEN_TYPES[this.config.provider.tokenType],
			identity_provider_id: this.config.identityProviderId,
			service_account_id: this.config.serviceAccountId
		};
		if (this.config.clientId) body["client_id"] = this.config.clientId;
		const response = await this.fetch(this.tokenExchangeUrl, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(body)
		});
		if (!response.ok) {
			const errorText = await response.text();
			let body = void 0;
			try {
				body = JSON.parse(errorText);
			} catch {}
			if (response.status === 400 || response.status === 401 || response.status === 403) throw new OAuthError(response.status, body, response.headers);
			throw APIError.generate(response.status, body, `Token exchange failed with status ${response.status}`, response.headers);
		}
		const tokenResponse = await response.json();
		if (typeof tokenResponse !== "object" || tokenResponse === null || !("access_token" in tokenResponse) || typeof tokenResponse.access_token !== "string" || tokenResponse.access_token.trim().length === 0) throw new OpenAIError("Token exchange response missing 'access_token' field");
		const accessToken = tokenResponse.access_token;
		const expiresIn = tokenResponse.expires_in ?? 3600;
		const expiresAt = Date.now() + expiresIn * 1e3;
		this.cachedToken = {
			token: accessToken,
			expiresAt
		};
		return accessToken;
	}
	isTokenExpired(cachedToken) {
		return Date.now() >= cachedToken.expiresAt;
	}
	needsRefresh(cachedToken) {
		const bufferMs = (this.config.refreshBufferSeconds ?? 1200) * 1e3;
		return Date.now() >= cachedToken.expiresAt - bufferMs;
	}
	invalidateToken() {
		this.cachedToken = null;
		this.refreshPromise = null;
	}
};
//#endregion
//#region node_modules/openai/internal/uploads.mjs
const checkFileSupport = () => {
	if (typeof File === "undefined") {
		const { process } = globalThis;
		const isOldNode = typeof process?.versions?.node === "string" && parseInt(process.versions.node.split(".")) < 20;
		throw new Error("`File` is not defined as a global, which is required for file uploads." + (isOldNode ? " Update to Node 20 LTS or newer, or set `globalThis.File` to `import('node:buffer').File`." : ""));
	}
};
/**
* Construct a `File` instance. This is used to ensure a helpful error is thrown
* for environments that don't define a global `File` yet.
*/
function makeFile(fileBits, fileName, options) {
	checkFileSupport();
	return new File(fileBits, fileName ?? "unknown_file", options);
}
function getName(value) {
	return (typeof value === "object" && value !== null && ("name" in value && value.name && String(value.name) || "url" in value && value.url && String(value.url) || "filename" in value && value.filename && String(value.filename) || "path" in value && value.path && String(value.path)) || "").split(/[\\/]/).pop() || void 0;
}
const isAsyncIterable = (value) => value != null && typeof value === "object" && typeof value[Symbol.asyncIterator] === "function";
/**
* Returns a multipart/form-data request if any part of the given request body contains a File / Blob value.
* Otherwise returns the request as is.
*/
const maybeMultipartFormRequestOptions = async (opts, fetch) => {
	if (!hasUploadableValue(opts.body)) return opts;
	return {
		...opts,
		body: await createForm(opts.body, fetch)
	};
};
const multipartFormRequestOptions = async (opts, fetch) => {
	return {
		...opts,
		body: await createForm(opts.body, fetch)
	};
};
const supportsFormDataMap = /* @__PURE__ */ new WeakMap();
/**
* node-fetch doesn't support the global FormData object in recent node versions. Instead of sending
* properly-encoded form data, it just stringifies the object, resulting in a request body of "[object FormData]".
* This function detects if the fetch function provided supports the global FormData object to avoid
* confusing error messages later on.
*/
function supportsFormData(fetchObject) {
	const fetch = typeof fetchObject === "function" ? fetchObject : fetchObject.fetch;
	const cached = supportsFormDataMap.get(fetch);
	if (cached) return cached;
	const promise = (async () => {
		try {
			const FetchResponse = "Response" in fetch ? fetch.Response : (await fetch("data:,")).constructor;
			const data = new FormData();
			if (data.toString() === await new FetchResponse(data).text()) return false;
			return true;
		} catch {
			return true;
		}
	})();
	supportsFormDataMap.set(fetch, promise);
	return promise;
}
const createForm = async (body, fetch) => {
	if (!await supportsFormData(fetch)) throw new TypeError("The provided fetch function does not support file uploads with the current global FormData class.");
	const form = new FormData();
	await Promise.all(Object.entries(body || {}).map(([key, value]) => addFormValue(form, key, value)));
	return form;
};
const isNamedBlob = (value) => value instanceof Blob && "name" in value;
const isUploadable = (value) => typeof value === "object" && value !== null && (value instanceof Response || isAsyncIterable(value) || isNamedBlob(value));
const hasUploadableValue = (value) => {
	if (isUploadable(value)) return true;
	if (Array.isArray(value)) return value.some(hasUploadableValue);
	if (value && typeof value === "object") {
		for (const k in value) if (hasUploadableValue(value[k])) return true;
	}
	return false;
};
const addFormValue = async (form, key, value) => {
	if (value === void 0) return;
	if (value == null) throw new TypeError(`Received null for "${key}"; to pass null in FormData, you must use the string 'null'`);
	if (typeof value === "string" || typeof value === "number" || typeof value === "boolean") form.append(key, String(value));
	else if (value instanceof Response) form.append(key, makeFile([await value.blob()], getName(value)));
	else if (isAsyncIterable(value)) form.append(key, makeFile([await new Response(ReadableStreamFrom(value)).blob()], getName(value)));
	else if (isNamedBlob(value)) form.append(key, value, getName(value));
	else if (Array.isArray(value)) await Promise.all(value.map((entry) => addFormValue(form, key + "[]", entry)));
	else if (typeof value === "object") await Promise.all(Object.entries(value).map(([name, prop]) => addFormValue(form, `${key}[${name}]`, prop)));
	else throw new TypeError(`Invalid value given to form, expected a string, number, boolean, object, Array, File or Blob but got ${value} instead`);
};
//#endregion
//#region node_modules/openai/internal/to-file.mjs
/**
* This check adds the arrayBuffer() method type because it is available and used at runtime
*/
const isBlobLike = (value) => value != null && typeof value === "object" && typeof value.size === "number" && typeof value.type === "string" && typeof value.text === "function" && typeof value.slice === "function" && typeof value.arrayBuffer === "function";
/**
* This check adds the arrayBuffer() method type because it is available and used at runtime
*/
const isFileLike = (value) => value != null && typeof value === "object" && typeof value.name === "string" && typeof value.lastModified === "number" && isBlobLike(value);
const isResponseLike = (value) => value != null && typeof value === "object" && typeof value.url === "string" && typeof value.blob === "function";
/**
* Helper for creating a {@link File} to pass to an SDK upload method from a variety of different data formats
* @param value the raw content of the file. Can be an {@link Uploadable}, BlobLikePart, or AsyncIterable of BlobLikeParts
* @param {string=} name the name of the file. If omitted, toFile will try to determine a file name from bits if possible
* @param {Object=} options additional properties
* @param {string=} options.type the MIME type of the content
* @param {number=} options.lastModified the last modified timestamp
* @returns a {@link File} with the given properties
*/
async function toFile(value, name, options) {
	checkFileSupport();
	value = await value;
	if (isFileLike(value)) {
		if (value instanceof File) return value;
		return makeFile([await value.arrayBuffer()], value.name);
	}
	if (isResponseLike(value)) {
		const blob = await value.blob();
		name || (name = new URL(value.url).pathname.split(/[\\/]/).pop());
		return makeFile(await getBytes(blob), name, options);
	}
	const parts = await getBytes(value);
	name || (name = getName(value));
	if (!options?.type) {
		const type = parts.find((part) => typeof part === "object" && "type" in part && part.type);
		if (typeof type === "string") options = {
			...options,
			type
		};
	}
	return makeFile(parts, name, options);
}
async function getBytes(value) {
	let parts = [];
	if (typeof value === "string" || ArrayBuffer.isView(value) || value instanceof ArrayBuffer) parts.push(value);
	else if (isBlobLike(value)) parts.push(value instanceof Blob ? value : await value.arrayBuffer());
	else if (isAsyncIterable(value)) for await (const chunk of value) parts.push(...await getBytes(chunk));
	else {
		const constructor = value?.constructor?.name;
		throw new Error(`Unexpected data type: ${typeof value}${constructor ? `; constructor: ${constructor}` : ""}${propsForError(value)}`);
	}
	return parts;
}
function propsForError(value) {
	if (typeof value !== "object" || value === null) return "";
	return `; props: [${Object.getOwnPropertyNames(value).map((p) => `"${p}"`).join(", ")}]`;
}
//#endregion
//#region node_modules/openai/core/resource.mjs
var APIResource = class {
	constructor(client) {
		this._client = client;
	}
};
//#endregion
//#region node_modules/openai/internal/utils/path.mjs
/**
* Percent-encode everything that isn't safe to have in a path without encoding safe chars.
*
* Taken from https://datatracker.ietf.org/doc/html/rfc3986#section-3.3:
* > unreserved  = ALPHA / DIGIT / "-" / "." / "_" / "~"
* > sub-delims  = "!" / "$" / "&" / "'" / "(" / ")" / "*" / "+" / "," / ";" / "="
* > pchar       = unreserved / pct-encoded / sub-delims / ":" / "@"
*/
function encodeURIPath(str) {
	return str.replace(/[^A-Za-z0-9\-._~!$&'()*+,;=:@]+/g, encodeURIComponent);
}
const EMPTY = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.create(null));
const createPathTagFunction = (pathEncoder = encodeURIPath) => function path(statics, ...params) {
	if (statics.length === 1) return statics[0];
	let postPath = false;
	const invalidSegments = [];
	const path = statics.reduce((previousValue, currentValue, index) => {
		if (/[?#]/.test(currentValue)) postPath = true;
		const value = params[index];
		let encoded = (postPath ? encodeURIComponent : pathEncoder)("" + value);
		if (index !== params.length && (value == null || typeof value === "object" && value.toString === Object.getPrototypeOf(Object.getPrototypeOf(value.hasOwnProperty ?? EMPTY) ?? EMPTY)?.toString)) {
			encoded = value + "";
			invalidSegments.push({
				start: previousValue.length + currentValue.length,
				length: encoded.length,
				error: `Value of type ${Object.prototype.toString.call(value).slice(8, -1)} is not a valid path parameter`
			});
		}
		return previousValue + currentValue + (index === params.length ? "" : encoded);
	}, "");
	const pathOnly = path.split(/[?#]/, 1)[0];
	const invalidSegmentPattern = /(?<=^|\/)(?:\.|%2e){1,2}(?=\/|$)/gi;
	let match;
	while ((match = invalidSegmentPattern.exec(pathOnly)) !== null) invalidSegments.push({
		start: match.index,
		length: match[0].length,
		error: `Value "${match[0]}" can\'t be safely passed as a path parameter`
	});
	invalidSegments.sort((a, b) => a.start - b.start);
	if (invalidSegments.length > 0) {
		let lastEnd = 0;
		const underline = invalidSegments.reduce((acc, segment) => {
			const spaces = " ".repeat(segment.start - lastEnd);
			const arrows = "^".repeat(segment.length);
			lastEnd = segment.start + segment.length;
			return acc + spaces + arrows;
		}, "");
		throw new OpenAIError(`Path parameters result in path with invalid segments:\n${invalidSegments.map((e) => e.error).join("\n")}\n${path}\n${underline}`);
	}
	return path;
};
/**
* URI-encodes path params and ensures no unsafe /./ or /../ path segments are introduced.
*/
const path$1 = /* @__PURE__ */ createPathTagFunction(encodeURIPath);
//#endregion
//#region node_modules/openai/resources/chat/completions/messages.mjs
/**
* Given a list of messages comprising a conversation, the model will return a response.
*/
var Messages$1 = class extends APIResource {
	/**
	* Get the messages in a stored chat completion. Only Chat Completions that have
	* been created with the `store` parameter set to `true` will be returned.
	*
	* @example
	* ```ts
	* // Automatically fetches more pages as needed.
	* for await (const chatCompletionStoreMessage of client.chat.completions.messages.list(
	*   'completion_id',
	* )) {
	*   // ...
	* }
	* ```
	*/
	list(completionID, query = {}, options) {
		return this._client.getAPIList(path$1`/chat/completions/${completionID}/messages`, CursorPage, {
			query,
			...options,
			__security: { bearerAuth: true }
		});
	}
};
//#endregion
//#region node_modules/openai/lib/parser.mjs
function isChatCompletionFunctionTool(tool) {
	return tool !== void 0 && "function" in tool && tool.function !== void 0;
}
function isAutoParsableResponseFormat(response_format) {
	return response_format?.["$brand"] === "auto-parseable-response-format";
}
function isAutoParsableTool$1(tool) {
	return tool?.["$brand"] === "auto-parseable-tool";
}
function maybeParseChatCompletion(completion, params) {
	if (!params || !hasAutoParseableInput$1(params)) return {
		...completion,
		choices: completion.choices.map((choice) => {
			assertToolCallsAreChatCompletionFunctionToolCalls(choice.message.tool_calls);
			return {
				...choice,
				message: {
					...choice.message,
					parsed: null,
					...choice.message.tool_calls ? { tool_calls: choice.message.tool_calls } : void 0
				}
			};
		})
	};
	return parseChatCompletion(completion, params);
}
function parseChatCompletion(completion, params) {
	const choices = completion.choices.map((choice) => {
		if (choice.finish_reason === "length") throw new LengthFinishReasonError();
		if (choice.finish_reason === "content_filter") throw new ContentFilterFinishReasonError();
		assertToolCallsAreChatCompletionFunctionToolCalls(choice.message.tool_calls);
		return {
			...choice,
			message: {
				...choice.message,
				...choice.message.tool_calls ? { tool_calls: choice.message.tool_calls?.map((toolCall) => parseToolCall$1(params, toolCall)) ?? void 0 } : void 0,
				parsed: choice.message.content && !choice.message.refusal ? parseResponseFormat(params, choice.message.content) : null
			}
		};
	});
	return {
		...completion,
		choices
	};
}
function parseResponseFormat(params, content) {
	if (params.response_format?.type !== "json_schema") return null;
	if (params.response_format?.type === "json_schema") {
		if ("$parseRaw" in params.response_format) return params.response_format.$parseRaw(content);
		return JSON.parse(content);
	}
	return null;
}
function parseToolCall$1(params, toolCall) {
	const inputTool = params.tools?.find((inputTool) => isChatCompletionFunctionTool(inputTool) && inputTool.function?.name === toolCall.function.name);
	return {
		...toolCall,
		function: {
			...toolCall.function,
			parsed_arguments: isAutoParsableTool$1(inputTool) ? inputTool.$parseRaw(toolCall.function.arguments) : inputTool?.function.strict ? JSON.parse(toolCall.function.arguments) : null
		}
	};
}
function shouldParseToolCall(params, toolCall) {
	if (!params || !("tools" in params) || !params.tools) return false;
	const inputTool = params.tools?.find((inputTool) => isChatCompletionFunctionTool(inputTool) && inputTool.function?.name === toolCall.function.name);
	return isChatCompletionFunctionTool(inputTool) && (isAutoParsableTool$1(inputTool) || inputTool?.function.strict || false);
}
function hasAutoParseableInput$1(params) {
	if (isAutoParsableResponseFormat(params.response_format)) return true;
	return params.tools?.some((t) => isAutoParsableTool$1(t) || t.type === "function" && t.function.strict === true) ?? false;
}
function assertToolCallsAreChatCompletionFunctionToolCalls(toolCalls) {
	for (const toolCall of toolCalls || []) if (toolCall.type !== "function") throw new OpenAIError(`Currently only \`function\` tool calls are supported; Received \`${toolCall.type}\``);
}
function validateInputTools(tools) {
	for (const tool of tools ?? []) {
		if (tool.type !== "function") throw new OpenAIError(`Currently only \`function\` tool types support auto-parsing; Received \`${tool.type}\``);
		if (tool.function.strict !== true) throw new OpenAIError(`The \`${tool.function.name}\` tool is not marked with \`strict: true\`. Only strict function tools can be auto-parsed`);
	}
}
//#endregion
//#region node_modules/openai/lib/chatCompletionUtils.mjs
const isAssistantMessage = (message) => {
	return message?.role === "assistant";
};
const isToolMessage = (message) => {
	return message?.role === "tool";
};
//#endregion
//#region node_modules/openai/lib/EventStream.mjs
var _EventStream_instances;
var _EventStream_connectedPromise;
var _EventStream_resolveConnectedPromise;
var _EventStream_rejectConnectedPromise;
var _EventStream_endPromise;
var _EventStream_resolveEndPromise;
var _EventStream_rejectEndPromise;
var _EventStream_listeners;
var _EventStream_abortListeners;
var _EventStream_ended;
var _EventStream_errored;
var _EventStream_aborted;
var _EventStream_catchingPromiseCreated;
var _EventStream_removeAbortListeners;
var _EventStream_handleError;
var EventStream = class {
	constructor() {
		_EventStream_instances.add(this);
		this.controller = new AbortController();
		_EventStream_connectedPromise.set(this, void 0);
		_EventStream_resolveConnectedPromise.set(this, () => {});
		_EventStream_rejectConnectedPromise.set(this, () => {});
		_EventStream_endPromise.set(this, void 0);
		_EventStream_resolveEndPromise.set(this, () => {});
		_EventStream_rejectEndPromise.set(this, () => {});
		_EventStream_listeners.set(this, {});
		_EventStream_abortListeners.set(this, []);
		_EventStream_ended.set(this, false);
		_EventStream_errored.set(this, false);
		_EventStream_aborted.set(this, false);
		_EventStream_catchingPromiseCreated.set(this, false);
		__classPrivateFieldSet(this, _EventStream_connectedPromise, new Promise((resolve, reject) => {
			__classPrivateFieldSet(this, _EventStream_resolveConnectedPromise, resolve, "f");
			__classPrivateFieldSet(this, _EventStream_rejectConnectedPromise, reject, "f");
		}), "f");
		__classPrivateFieldSet(this, _EventStream_endPromise, new Promise((resolve, reject) => {
			__classPrivateFieldSet(this, _EventStream_resolveEndPromise, resolve, "f");
			__classPrivateFieldSet(this, _EventStream_rejectEndPromise, reject, "f");
		}), "f");
		__classPrivateFieldGet(this, _EventStream_connectedPromise, "f").catch(() => {});
		__classPrivateFieldGet(this, _EventStream_endPromise, "f").catch(() => {});
	}
	_run(executor) {
		setTimeout(() => {
			executor().then(() => {
				this._emitFinal();
				this._emit("end");
			}, __classPrivateFieldGet(this, _EventStream_instances, "m", _EventStream_handleError).bind(this));
		}, 0);
	}
	_connected() {
		if (this.ended) return;
		__classPrivateFieldGet(this, _EventStream_resolveConnectedPromise, "f").call(this);
		this._emit("connect");
	}
	get ended() {
		return __classPrivateFieldGet(this, _EventStream_ended, "f");
	}
	get errored() {
		return __classPrivateFieldGet(this, _EventStream_errored, "f");
	}
	get aborted() {
		return __classPrivateFieldGet(this, _EventStream_aborted, "f");
	}
	abort() {
		this.controller.abort();
	}
	_listenForAbort(signal) {
		if (!signal || this.ended) return;
		if (signal.aborted) {
			this.controller.abort();
			return;
		}
		const listener = () => this.controller.abort();
		signal.addEventListener("abort", listener, { once: true });
		__classPrivateFieldGet(this, _EventStream_abortListeners, "f").push({
			signal,
			listener
		});
	}
	/**
	* Adds the listener function to the end of the listeners array for the event.
	* No checks are made to see if the listener has already been added. Multiple calls passing
	* the same combination of event and listener will result in the listener being added, and
	* called, multiple times.
	* @returns this ChatCompletionStream, so that calls can be chained
	*/
	on(event, listener) {
		(__classPrivateFieldGet(this, _EventStream_listeners, "f")[event] || (__classPrivateFieldGet(this, _EventStream_listeners, "f")[event] = [])).push({ listener });
		return this;
	}
	/**
	* Removes the specified listener from the listener array for the event.
	* off() will remove, at most, one instance of a listener from the listener array. If any single
	* listener has been added multiple times to the listener array for the specified event, then
	* off() must be called multiple times to remove each instance.
	* @returns this ChatCompletionStream, so that calls can be chained
	*/
	off(event, listener) {
		const listeners = __classPrivateFieldGet(this, _EventStream_listeners, "f")[event];
		if (!listeners) return this;
		const index = listeners.findIndex((l) => l.listener === listener);
		if (index >= 0) listeners.splice(index, 1);
		return this;
	}
	/**
	* Adds a one-time listener function for the event. The next time the event is triggered,
	* this listener is removed and then invoked.
	* @returns this ChatCompletionStream, so that calls can be chained
	*/
	once(event, listener) {
		(__classPrivateFieldGet(this, _EventStream_listeners, "f")[event] || (__classPrivateFieldGet(this, _EventStream_listeners, "f")[event] = [])).push({
			listener,
			once: true
		});
		return this;
	}
	/**
	* This is similar to `.once()`, but returns a Promise that resolves the next time
	* the event is triggered, instead of calling a listener callback.
	* @returns a Promise that resolves the next time given event is triggered,
	* or rejects if an error is emitted.  (If you request the 'error' event,
	* returns a promise that resolves with the error).
	*
	* Example:
	*
	*   const message = await stream.emitted('message') // rejects if the stream errors
	*/
	emitted(event) {
		return new Promise((resolve, reject) => {
			__classPrivateFieldSet(this, _EventStream_catchingPromiseCreated, true, "f");
			if (event !== "error") this.once("error", reject);
			this.once(event, resolve);
		});
	}
	async done() {
		__classPrivateFieldSet(this, _EventStream_catchingPromiseCreated, true, "f");
		await __classPrivateFieldGet(this, _EventStream_endPromise, "f");
	}
	_emit(event, ...args) {
		if (__classPrivateFieldGet(this, _EventStream_ended, "f")) return;
		if (event === "end") {
			__classPrivateFieldGet(this, _EventStream_instances, "m", _EventStream_removeAbortListeners).call(this);
			__classPrivateFieldSet(this, _EventStream_ended, true, "f");
			__classPrivateFieldGet(this, _EventStream_resolveEndPromise, "f").call(this);
		}
		const listeners = __classPrivateFieldGet(this, _EventStream_listeners, "f")[event];
		if (listeners) {
			__classPrivateFieldGet(this, _EventStream_listeners, "f")[event] = listeners.filter((l) => !l.once);
			listeners.forEach(({ listener }) => listener(...args));
		}
		if (event === "abort") {
			const error = args[0];
			if (!__classPrivateFieldGet(this, _EventStream_catchingPromiseCreated, "f") && !listeners?.length) Promise.reject(error);
			__classPrivateFieldGet(this, _EventStream_rejectConnectedPromise, "f").call(this, error);
			__classPrivateFieldGet(this, _EventStream_rejectEndPromise, "f").call(this, error);
			this._emit("end");
			return;
		}
		if (event === "error") {
			const error = args[0];
			if (!__classPrivateFieldGet(this, _EventStream_catchingPromiseCreated, "f") && !listeners?.length) Promise.reject(error);
			__classPrivateFieldGet(this, _EventStream_rejectConnectedPromise, "f").call(this, error);
			__classPrivateFieldGet(this, _EventStream_rejectEndPromise, "f").call(this, error);
			this._emit("end");
		}
	}
	_emitFinal() {}
};
_EventStream_connectedPromise = /* @__PURE__ */ new WeakMap(), _EventStream_resolveConnectedPromise = /* @__PURE__ */ new WeakMap(), _EventStream_rejectConnectedPromise = /* @__PURE__ */ new WeakMap(), _EventStream_endPromise = /* @__PURE__ */ new WeakMap(), _EventStream_resolveEndPromise = /* @__PURE__ */ new WeakMap(), _EventStream_rejectEndPromise = /* @__PURE__ */ new WeakMap(), _EventStream_listeners = /* @__PURE__ */ new WeakMap(), _EventStream_abortListeners = /* @__PURE__ */ new WeakMap(), _EventStream_ended = /* @__PURE__ */ new WeakMap(), _EventStream_errored = /* @__PURE__ */ new WeakMap(), _EventStream_aborted = /* @__PURE__ */ new WeakMap(), _EventStream_catchingPromiseCreated = /* @__PURE__ */ new WeakMap(), _EventStream_instances = /* @__PURE__ */ new WeakSet(), _EventStream_removeAbortListeners = function _EventStream_removeAbortListeners() {
	for (const { signal, listener } of __classPrivateFieldGet(this, _EventStream_abortListeners, "f").splice(0)) signal.removeEventListener("abort", listener);
}, _EventStream_handleError = function _EventStream_handleError(error) {
	__classPrivateFieldSet(this, _EventStream_errored, true, "f");
	if (error instanceof Error && error.name === "AbortError") error = new APIUserAbortError();
	if (error instanceof APIUserAbortError) {
		__classPrivateFieldSet(this, _EventStream_aborted, true, "f");
		return this._emit("abort", error);
	}
	if (error instanceof OpenAIError) return this._emit("error", error);
	if (error instanceof Error) {
		const openAIError = new OpenAIError(error.message);
		openAIError.cause = error;
		return this._emit("error", openAIError);
	}
	return this._emit("error", new OpenAIError(String(error)));
};
//#endregion
//#region node_modules/openai/lib/RunnableFunction.mjs
function isRunnableFunctionWithParse(fn) {
	return typeof fn.parse === "function";
}
//#endregion
//#region node_modules/openai/lib/AbstractChatCompletionRunner.mjs
var _AbstractChatCompletionRunner_instances;
var _AbstractChatCompletionRunner_getFinalContent;
var _AbstractChatCompletionRunner_getFinalMessage;
var _AbstractChatCompletionRunner_getFinalFunctionToolCall;
var _AbstractChatCompletionRunner_getFinalFunctionToolCallResult;
var _AbstractChatCompletionRunner_calculateTotalUsage;
var _AbstractChatCompletionRunner_validateParams;
var _AbstractChatCompletionRunner_stringifyFunctionCallResult;
const DEFAULT_MAX_CHAT_COMPLETIONS = 10;
var AbstractChatCompletionRunner = class extends EventStream {
	constructor() {
		super(...arguments);
		_AbstractChatCompletionRunner_instances.add(this);
		this._chatCompletions = [];
		this.messages = [];
	}
	_addChatCompletion(chatCompletion) {
		this._chatCompletions.push(chatCompletion);
		this._emit("chatCompletion", chatCompletion);
		const message = chatCompletion.choices[0]?.message;
		if (message) this._addMessage(message);
		return chatCompletion;
	}
	_addMessage(message, emit = true) {
		if (!("content" in message)) message.content = null;
		this.messages.push(message);
		if (emit) {
			this._emit("message", message);
			if (isToolMessage(message) && message.content) this._emit("functionToolCallResult", message.content);
			else if (isAssistantMessage(message) && message.tool_calls) {
				for (const tool_call of message.tool_calls) if (tool_call.type === "function") this._emit("functionToolCall", tool_call.function);
			}
		}
	}
	/**
	* @returns a promise that resolves with the final ChatCompletion, or rejects
	* if an error occurred or the stream ended prematurely without producing a ChatCompletion.
	*/
	async finalChatCompletion() {
		await this.done();
		const completion = this._chatCompletions[this._chatCompletions.length - 1];
		if (!completion) throw new OpenAIError("stream ended without producing a ChatCompletion");
		return completion;
	}
	/**
	* @returns a promise that resolves with the content of the final ChatCompletionMessage, or rejects
	* if an error occurred or the stream ended prematurely without producing a ChatCompletionMessage.
	*/
	async finalContent() {
		await this.done();
		return __classPrivateFieldGet(this, _AbstractChatCompletionRunner_instances, "m", _AbstractChatCompletionRunner_getFinalContent).call(this);
	}
	/**
	* @returns a promise that resolves with the final assistant ChatCompletionMessage response,
	* or rejects if an error occurred or the stream ended prematurely without producing a ChatCompletionMessage.
	*/
	async finalMessage() {
		await this.done();
		return __classPrivateFieldGet(this, _AbstractChatCompletionRunner_instances, "m", _AbstractChatCompletionRunner_getFinalMessage).call(this);
	}
	/**
	* @returns a promise that resolves with the content of the final FunctionCall, or rejects
	* if an error occurred or the stream ended prematurely without producing a ChatCompletionMessage.
	*/
	async finalFunctionToolCall() {
		await this.done();
		return __classPrivateFieldGet(this, _AbstractChatCompletionRunner_instances, "m", _AbstractChatCompletionRunner_getFinalFunctionToolCall).call(this);
	}
	async finalFunctionToolCallResult() {
		await this.done();
		return __classPrivateFieldGet(this, _AbstractChatCompletionRunner_instances, "m", _AbstractChatCompletionRunner_getFinalFunctionToolCallResult).call(this);
	}
	async totalUsage() {
		await this.done();
		return __classPrivateFieldGet(this, _AbstractChatCompletionRunner_instances, "m", _AbstractChatCompletionRunner_calculateTotalUsage).call(this);
	}
	allChatCompletions() {
		return [...this._chatCompletions];
	}
	_emitFinal() {
		const completion = this._chatCompletions[this._chatCompletions.length - 1];
		if (completion) this._emit("finalChatCompletion", completion);
		const finalMessage = __classPrivateFieldGet(this, _AbstractChatCompletionRunner_instances, "m", _AbstractChatCompletionRunner_getFinalMessage).call(this);
		if (finalMessage) this._emit("finalMessage", finalMessage);
		const finalContent = __classPrivateFieldGet(this, _AbstractChatCompletionRunner_instances, "m", _AbstractChatCompletionRunner_getFinalContent).call(this);
		if (finalContent) this._emit("finalContent", finalContent);
		const finalFunctionCall = __classPrivateFieldGet(this, _AbstractChatCompletionRunner_instances, "m", _AbstractChatCompletionRunner_getFinalFunctionToolCall).call(this);
		if (finalFunctionCall) this._emit("finalFunctionToolCall", finalFunctionCall);
		const finalFunctionCallResult = __classPrivateFieldGet(this, _AbstractChatCompletionRunner_instances, "m", _AbstractChatCompletionRunner_getFinalFunctionToolCallResult).call(this);
		if (finalFunctionCallResult != null) this._emit("finalFunctionToolCallResult", finalFunctionCallResult);
		if (this._chatCompletions.some((c) => c.usage)) this._emit("totalUsage", __classPrivateFieldGet(this, _AbstractChatCompletionRunner_instances, "m", _AbstractChatCompletionRunner_calculateTotalUsage).call(this));
	}
	async _createChatCompletion(client, params, options) {
		this._listenForAbort(options?.signal);
		__classPrivateFieldGet(this, _AbstractChatCompletionRunner_instances, "m", _AbstractChatCompletionRunner_validateParams).call(this, params);
		const chatCompletion = await client.chat.completions.create({
			...params,
			stream: false
		}, {
			...options,
			signal: this.controller.signal
		});
		this._connected();
		return this._addChatCompletion(parseChatCompletion(chatCompletion, params));
	}
	async _runChatCompletion(client, params, options) {
		for (const message of params.messages) this._addMessage(message, false);
		return await this._createChatCompletion(client, params, options);
	}
	async _runTools(client, params, runner, options) {
		const role = "tool";
		const { tool_choice = "auto", stream, ...restParams } = params;
		const singleFunctionToCall = typeof tool_choice !== "string" && tool_choice.type === "function" && tool_choice?.function?.name;
		const { maxChatCompletions = DEFAULT_MAX_CHAT_COMPLETIONS, afterCompletion } = options || {};
		const inputTools = params.tools.map((tool) => {
			if (isAutoParsableTool$1(tool)) {
				if (!tool.$callback) throw new OpenAIError("Tool given to `.runTools()` that does not have an associated function");
				return {
					type: "function",
					function: {
						function: tool.$callback,
						name: tool.function.name,
						description: tool.function.description || "",
						parameters: tool.function.parameters,
						parse: tool.$parseRaw,
						strict: true
					}
				};
			}
			return tool;
		});
		const functionsByName = {};
		for (const f of inputTools) if (f.type === "function") functionsByName[f.function.name || f.function.function.name] = f.function;
		const tools = "tools" in params ? inputTools.map((t) => t.type === "function" ? {
			type: "function",
			function: {
				name: t.function.name || t.function.function.name,
				parameters: t.function.parameters,
				description: t.function.description,
				strict: t.function.strict
			}
		} : t) : void 0;
		for (const message of params.messages) this._addMessage(message, false);
		const runToolCall = async (toolCall) => {
			if (toolCall.type !== "function") return {
				message: void 0,
				functionCalled: false
			};
			const tool_call_id = toolCall.id;
			const { name, arguments: args } = toolCall.function;
			const fn = functionsByName[name];
			if (!fn) {
				const content = `Invalid tool_call: ${JSON.stringify(name)}. Available options are: ${Object.keys(functionsByName).map((name) => JSON.stringify(name)).join(", ")}. Please try again`;
				return {
					message: {
						role,
						tool_call_id,
						content
					},
					functionCalled: false
				};
			}
			if (singleFunctionToCall && singleFunctionToCall !== name) {
				const content = `Invalid tool_call: ${JSON.stringify(name)}. ${JSON.stringify(singleFunctionToCall)} requested. Please try again`;
				return {
					message: {
						role,
						tool_call_id,
						content
					},
					functionCalled: false
				};
			}
			let rawContent;
			if (isRunnableFunctionWithParse(fn)) {
				let parsed;
				try {
					parsed = await fn.parse(args);
				} catch (error) {
					const content = error instanceof Error ? error.message : String(error);
					return {
						message: {
							role,
							tool_call_id,
							content
						},
						functionCalled: false
					};
				}
				rawContent = await fn.function(parsed, runner);
			} else rawContent = await fn.function(args, runner);
			const content = __classPrivateFieldGet(this, _AbstractChatCompletionRunner_instances, "m", _AbstractChatCompletionRunner_stringifyFunctionCallResult).call(this, rawContent);
			return {
				message: {
					role,
					tool_call_id,
					content
				},
				functionCalled: true
			};
		};
		for (let i = 0; i < maxChatCompletions; ++i) {
			const chatCompletion = await this._createChatCompletion(client, {
				...restParams,
				tool_choice,
				tools,
				messages: [...this.messages]
			}, options);
			const message = chatCompletion.choices[0]?.message;
			if (!message) throw new OpenAIError(`missing message in ChatCompletion response`);
			if (!message.tool_calls?.length) {
				await afterCompletion?.(chatCompletion, runner);
				return;
			}
			if (singleFunctionToCall || params.parallel_tool_calls === false) for (const toolCall of message.tool_calls) {
				const result = await runToolCall(toolCall);
				if (result.message) this._addMessage(result.message);
				if (singleFunctionToCall && result.functionCalled) {
					await afterCompletion?.(chatCompletion, runner);
					return;
				}
			}
			else {
				const results = await Promise.allSettled(message.tool_calls.map(runToolCall));
				for (const result of results) if (result.status === "rejected") throw result.reason;
				for (const result of results) if (result.status === "fulfilled" && result.value.message) this._addMessage(result.value.message);
			}
			await afterCompletion?.(chatCompletion, runner);
		}
	}
};
_AbstractChatCompletionRunner_instances = /* @__PURE__ */ new WeakSet(), _AbstractChatCompletionRunner_getFinalContent = function _AbstractChatCompletionRunner_getFinalContent() {
	return __classPrivateFieldGet(this, _AbstractChatCompletionRunner_instances, "m", _AbstractChatCompletionRunner_getFinalMessage).call(this).content ?? null;
}, _AbstractChatCompletionRunner_getFinalMessage = function _AbstractChatCompletionRunner_getFinalMessage() {
	let i = this.messages.length;
	while (i-- > 0) {
		const message = this.messages[i];
		if (isAssistantMessage(message)) return {
			...message,
			content: message.content ?? null,
			refusal: message.refusal ?? null
		};
	}
	throw new OpenAIError("stream ended without producing a ChatCompletionMessage with role=assistant");
}, _AbstractChatCompletionRunner_getFinalFunctionToolCall = function _AbstractChatCompletionRunner_getFinalFunctionToolCall() {
	for (let i = this.messages.length - 1; i >= 0; i--) {
		const message = this.messages[i];
		if (isAssistantMessage(message) && message?.tool_calls?.length) for (let j = message.tool_calls.length - 1; j >= 0; j--) {
			const toolCall = message.tool_calls[j];
			if (toolCall?.type === "function") return toolCall.function;
		}
	}
}, _AbstractChatCompletionRunner_getFinalFunctionToolCallResult = function _AbstractChatCompletionRunner_getFinalFunctionToolCallResult() {
	for (let i = this.messages.length - 1; i >= 0; i--) {
		const message = this.messages[i];
		if (isToolMessage(message) && message.content != null && typeof message.content === "string" && this.messages.some((x) => x.role === "assistant" && x.tool_calls?.some((y) => y.type === "function" && y.id === message.tool_call_id))) return message.content;
	}
}, _AbstractChatCompletionRunner_calculateTotalUsage = function _AbstractChatCompletionRunner_calculateTotalUsage() {
	const total = {
		completion_tokens: 0,
		prompt_tokens: 0,
		total_tokens: 0
	};
	for (const { usage } of this._chatCompletions) if (usage) {
		total.completion_tokens += usage.completion_tokens;
		total.prompt_tokens += usage.prompt_tokens;
		total.total_tokens += usage.total_tokens;
	}
	return total;
}, _AbstractChatCompletionRunner_validateParams = function _AbstractChatCompletionRunner_validateParams(params) {
	if (params.n != null && params.n > 1) throw new OpenAIError("ChatCompletion convenience helpers only support n=1 at this time. To use n>1, please use chat.completions.create() directly.");
}, _AbstractChatCompletionRunner_stringifyFunctionCallResult = function _AbstractChatCompletionRunner_stringifyFunctionCallResult(rawContent) {
	return typeof rawContent === "string" ? rawContent : rawContent === void 0 ? "undefined" : JSON.stringify(rawContent);
};
//#endregion
//#region node_modules/openai/lib/ChatCompletionRunner.mjs
var ChatCompletionRunner = class ChatCompletionRunner extends AbstractChatCompletionRunner {
	static runTools(client, params, options) {
		const runner = new ChatCompletionRunner();
		const opts = {
			...options,
			headers: {
				...options?.headers,
				"X-Stainless-Helper-Method": "runTools"
			}
		};
		runner._run(() => runner._runTools(client, params, runner, opts));
		return runner;
	}
	_addMessage(message, emit = true) {
		super._addMessage(message, emit);
		if (isAssistantMessage(message) && message.content) this._emit("content", message.content);
	}
};
//#endregion
//#region node_modules/openai/_vendor/partial-json-parser/parser.mjs
const Allow = {
	STR: 1,
	NUM: 2,
	ARR: 4,
	OBJ: 8,
	NULL: 16,
	BOOL: 32,
	NAN: 64,
	INFINITY: 128,
	MINUS_INFINITY: 256,
	INF: 384,
	SPECIAL: 496,
	ATOM: 499,
	COLLECTION: 12,
	ALL: 511
};
var PartialJSON = class extends Error {};
var MalformedJSON = class extends Error {};
/**
* Parse incomplete JSON
* @param {string} jsonString Partial JSON to be parsed
* @param {number} allowPartial Specify what types are allowed to be partial, see {@link Allow} for details
* @returns The parsed JSON
* @throws {PartialJSON} If the JSON is incomplete (related to the `allow` parameter)
* @throws {MalformedJSON} If the JSON is malformed
*/
function parseJSON(jsonString, allowPartial = Allow.ALL) {
	if (typeof jsonString !== "string") throw new TypeError(`expecting str, got ${typeof jsonString}`);
	if (!jsonString.trim()) throw new Error(`${jsonString} is empty`);
	return _parseJSON(jsonString.trim(), allowPartial);
}
const _parseJSON = (jsonString, allow) => {
	const length = jsonString.length;
	let index = 0;
	const markPartialJSON = (msg) => {
		throw new PartialJSON(`${msg} at position ${index}`);
	};
	const throwMalformedError = (msg) => {
		throw new MalformedJSON(`${msg} at position ${index}`);
	};
	const parseAny = () => {
		skipBlank();
		if (index >= length) markPartialJSON("Unexpected end of input");
		if (jsonString[index] === "\"") return parseStr();
		if (jsonString[index] === "{") return parseObj();
		if (jsonString[index] === "[") return parseArr();
		if (jsonString.substring(index, index + 4) === "null" || Allow.NULL & allow && length - index < 4 && "null".startsWith(jsonString.substring(index))) {
			index += 4;
			return null;
		}
		if (jsonString.substring(index, index + 4) === "true" || Allow.BOOL & allow && length - index < 4 && "true".startsWith(jsonString.substring(index))) {
			index += 4;
			return true;
		}
		if (jsonString.substring(index, index + 5) === "false" || Allow.BOOL & allow && length - index < 5 && "false".startsWith(jsonString.substring(index))) {
			index += 5;
			return false;
		}
		if (jsonString.substring(index, index + 8) === "Infinity" || Allow.INFINITY & allow && length - index < 8 && "Infinity".startsWith(jsonString.substring(index))) {
			index += 8;
			return Infinity;
		}
		if (jsonString.substring(index, index + 9) === "-Infinity" || Allow.MINUS_INFINITY & allow && 1 < length - index && length - index < 9 && "-Infinity".startsWith(jsonString.substring(index))) {
			index += 9;
			return -Infinity;
		}
		if (jsonString.substring(index, index + 3) === "NaN" || Allow.NAN & allow && length - index < 3 && "NaN".startsWith(jsonString.substring(index))) {
			index += 3;
			return NaN;
		}
		return parseNum();
	};
	const parseStr = () => {
		const start = index;
		let escape = false;
		index++;
		while (index < length && (jsonString[index] !== "\"" || escape && jsonString[index - 1] === "\\")) {
			escape = jsonString[index] === "\\" ? !escape : false;
			index++;
		}
		if (jsonString.charAt(index) == "\"") try {
			return JSON.parse(jsonString.substring(start, ++index - Number(escape)));
		} catch (e) {
			throwMalformedError(String(e));
		}
		else if (Allow.STR & allow) try {
			return JSON.parse(jsonString.substring(start, index - Number(escape)) + "\"");
		} catch (e) {
			return JSON.parse(jsonString.substring(start, jsonString.lastIndexOf("\\")) + "\"");
		}
		markPartialJSON("Unterminated string literal");
	};
	const parseObj = () => {
		index++;
		skipBlank();
		const obj = {};
		try {
			while (jsonString[index] !== "}") {
				skipBlank();
				if (index >= length && Allow.OBJ & allow) return obj;
				const key = parseStr();
				skipBlank();
				index++;
				try {
					const value = parseAny();
					Object.defineProperty(obj, key, {
						value,
						writable: true,
						enumerable: true,
						configurable: true
					});
				} catch (e) {
					if (Allow.OBJ & allow) return obj;
					else throw e;
				}
				skipBlank();
				if (jsonString[index] === ",") index++;
			}
		} catch (e) {
			if (Allow.OBJ & allow) return obj;
			else markPartialJSON("Expected '}' at end of object");
		}
		index++;
		return obj;
	};
	const parseArr = () => {
		index++;
		const arr = [];
		try {
			while (jsonString[index] !== "]") {
				arr.push(parseAny());
				skipBlank();
				if (jsonString[index] === ",") index++;
			}
		} catch (e) {
			if (Allow.ARR & allow) return arr;
			markPartialJSON("Expected ']' at end of array");
		}
		index++;
		return arr;
	};
	const parseNum = () => {
		if (index === 0) {
			if (jsonString === "-" && Allow.NUM & allow) markPartialJSON("Not sure what '-' is");
			try {
				return JSON.parse(jsonString);
			} catch (e) {
				if (Allow.NUM & allow) try {
					if ("." === jsonString[jsonString.length - 1]) return JSON.parse(jsonString.substring(0, jsonString.lastIndexOf(".")));
					return JSON.parse(jsonString.substring(0, jsonString.lastIndexOf("e")));
				} catch (e) {}
				throwMalformedError(String(e));
			}
		}
		const start = index;
		if (jsonString[index] === "-") index++;
		while (jsonString[index] && !",]}".includes(jsonString[index])) index++;
		if (index == length && !(Allow.NUM & allow)) markPartialJSON("Unterminated number literal");
		try {
			return JSON.parse(jsonString.substring(start, index));
		} catch (e) {
			if (jsonString.substring(start, index) === "-" && Allow.NUM & allow) markPartialJSON("Not sure what '-' is");
			try {
				return JSON.parse(jsonString.substring(start, jsonString.lastIndexOf("e")));
			} catch (e) {
				throwMalformedError(String(e));
			}
		}
	};
	const skipBlank = () => {
		while (index < length && " \n\r	".includes(jsonString[index])) index++;
	};
	return parseAny();
};
const partialParse = (input) => parseJSON(input, Allow.ALL ^ Allow.NUM);
//#endregion
//#region node_modules/openai/lib/ChatCompletionStream.mjs
var _ChatCompletionStream_instances;
var _ChatCompletionStream_params;
var _ChatCompletionStream_choiceEventStates;
var _ChatCompletionStream_currentChatCompletionSnapshot;
var _ChatCompletionStream_beginRequest;
var _ChatCompletionStream_getChoiceEventState;
var _ChatCompletionStream_addChunk;
var _ChatCompletionStream_emitToolCallDoneEvent;
var _ChatCompletionStream_emitContentDoneEvents;
var _ChatCompletionStream_endRequest;
var _ChatCompletionStream_getAutoParseableResponseFormat;
var _ChatCompletionStream_accumulateChatCompletion;
var ChatCompletionStream = class ChatCompletionStream extends AbstractChatCompletionRunner {
	constructor(params) {
		super();
		_ChatCompletionStream_instances.add(this);
		_ChatCompletionStream_params.set(this, void 0);
		_ChatCompletionStream_choiceEventStates.set(this, void 0);
		_ChatCompletionStream_currentChatCompletionSnapshot.set(this, void 0);
		__classPrivateFieldSet(this, _ChatCompletionStream_params, params, "f");
		__classPrivateFieldSet(this, _ChatCompletionStream_choiceEventStates, [], "f");
	}
	get currentChatCompletionSnapshot() {
		return __classPrivateFieldGet(this, _ChatCompletionStream_currentChatCompletionSnapshot, "f");
	}
	/**
	* Intended for use on the frontend, consuming a stream produced with
	* `.toReadableStream()` on the backend.
	*
	* Note that messages sent to the model do not appear in `.on('message')`
	* in this context.
	*/
	static fromReadableStream(stream) {
		const runner = new ChatCompletionStream(null);
		runner._run(() => runner._fromReadableStream(stream));
		return runner;
	}
	static createChatCompletion(client, params, options) {
		const runner = new ChatCompletionStream(params);
		runner._run(() => runner._runChatCompletion(client, {
			...params,
			stream: true
		}, {
			...options,
			headers: {
				...options?.headers,
				"X-Stainless-Helper-Method": "stream"
			}
		}));
		return runner;
	}
	async _createChatCompletion(client, params, options) {
		super._createChatCompletion;
		this._listenForAbort(options?.signal);
		__classPrivateFieldGet(this, _ChatCompletionStream_instances, "m", _ChatCompletionStream_beginRequest).call(this);
		const stream = await client.chat.completions.create({
			...params,
			stream: true
		}, {
			...options,
			signal: this.controller.signal
		});
		this._connected();
		for await (const chunk of stream) __classPrivateFieldGet(this, _ChatCompletionStream_instances, "m", _ChatCompletionStream_addChunk).call(this, chunk);
		if (stream.controller.signal?.aborted) throw new APIUserAbortError();
		return this._addChatCompletion(__classPrivateFieldGet(this, _ChatCompletionStream_instances, "m", _ChatCompletionStream_endRequest).call(this));
	}
	async _fromReadableStream(readableStream, options) {
		this._listenForAbort(options?.signal);
		__classPrivateFieldGet(this, _ChatCompletionStream_instances, "m", _ChatCompletionStream_beginRequest).call(this);
		this._connected();
		const stream = Stream.fromReadableStream(readableStream, this.controller);
		let chatId;
		for await (const chunk of stream) {
			if (chatId && chatId !== chunk.id) this._addChatCompletion(__classPrivateFieldGet(this, _ChatCompletionStream_instances, "m", _ChatCompletionStream_endRequest).call(this));
			__classPrivateFieldGet(this, _ChatCompletionStream_instances, "m", _ChatCompletionStream_addChunk).call(this, chunk);
			chatId = chunk.id;
		}
		if (stream.controller.signal?.aborted) throw new APIUserAbortError();
		return this._addChatCompletion(__classPrivateFieldGet(this, _ChatCompletionStream_instances, "m", _ChatCompletionStream_endRequest).call(this));
	}
	[(_ChatCompletionStream_params = /* @__PURE__ */ new WeakMap(), _ChatCompletionStream_choiceEventStates = /* @__PURE__ */ new WeakMap(), _ChatCompletionStream_currentChatCompletionSnapshot = /* @__PURE__ */ new WeakMap(), _ChatCompletionStream_instances = /* @__PURE__ */ new WeakSet(), _ChatCompletionStream_beginRequest = function _ChatCompletionStream_beginRequest() {
		if (this.ended) return;
		__classPrivateFieldSet(this, _ChatCompletionStream_currentChatCompletionSnapshot, void 0, "f");
	}, _ChatCompletionStream_getChoiceEventState = function _ChatCompletionStream_getChoiceEventState(choice) {
		let state = __classPrivateFieldGet(this, _ChatCompletionStream_choiceEventStates, "f")[choice.index];
		if (state) return state;
		state = {
			content_done: false,
			refusal_done: false,
			logprobs_content_done: false,
			logprobs_refusal_done: false,
			done_tool_calls: /* @__PURE__ */ new Set(),
			current_tool_call_index: null
		};
		__classPrivateFieldGet(this, _ChatCompletionStream_choiceEventStates, "f")[choice.index] = state;
		return state;
	}, _ChatCompletionStream_addChunk = function _ChatCompletionStream_addChunk(chunk) {
		if (this.ended) return;
		const completion = __classPrivateFieldGet(this, _ChatCompletionStream_instances, "m", _ChatCompletionStream_accumulateChatCompletion).call(this, chunk);
		this._emit("chunk", chunk, completion);
		for (const choice of chunk.choices) {
			const choiceSnapshot = completion.choices[choice.index];
			if (choice.delta.content != null && choiceSnapshot.message?.role === "assistant" && choiceSnapshot.message?.content) {
				this._emit("content", choice.delta.content, choiceSnapshot.message.content);
				this._emit("content.delta", {
					delta: choice.delta.content,
					snapshot: choiceSnapshot.message.content,
					parsed: choiceSnapshot.message.parsed
				});
			}
			if (choice.delta.refusal != null && choiceSnapshot.message?.role === "assistant" && choiceSnapshot.message?.refusal) this._emit("refusal.delta", {
				delta: choice.delta.refusal,
				snapshot: choiceSnapshot.message.refusal
			});
			if (choice.logprobs?.content != null && choiceSnapshot.message?.role === "assistant") this._emit("logprobs.content.delta", {
				content: choice.logprobs?.content,
				snapshot: choiceSnapshot.logprobs?.content ?? []
			});
			if (choice.logprobs?.refusal != null && choiceSnapshot.message?.role === "assistant") this._emit("logprobs.refusal.delta", {
				refusal: choice.logprobs?.refusal,
				snapshot: choiceSnapshot.logprobs?.refusal ?? []
			});
			const state = __classPrivateFieldGet(this, _ChatCompletionStream_instances, "m", _ChatCompletionStream_getChoiceEventState).call(this, choiceSnapshot);
			if (choiceSnapshot.finish_reason) {
				__classPrivateFieldGet(this, _ChatCompletionStream_instances, "m", _ChatCompletionStream_emitContentDoneEvents).call(this, choiceSnapshot);
				if (state.current_tool_call_index != null) __classPrivateFieldGet(this, _ChatCompletionStream_instances, "m", _ChatCompletionStream_emitToolCallDoneEvent).call(this, choiceSnapshot, state.current_tool_call_index);
			}
			for (const toolCall of choice.delta.tool_calls ?? []) {
				if (state.current_tool_call_index !== toolCall.index) {
					__classPrivateFieldGet(this, _ChatCompletionStream_instances, "m", _ChatCompletionStream_emitContentDoneEvents).call(this, choiceSnapshot);
					if (state.current_tool_call_index != null) __classPrivateFieldGet(this, _ChatCompletionStream_instances, "m", _ChatCompletionStream_emitToolCallDoneEvent).call(this, choiceSnapshot, state.current_tool_call_index);
				}
				state.current_tool_call_index = toolCall.index;
			}
			for (const toolCallDelta of choice.delta.tool_calls ?? []) {
				const toolCallSnapshot = choiceSnapshot.message.tool_calls?.[toolCallDelta.index];
				if (!toolCallSnapshot?.type) continue;
				if (toolCallSnapshot?.type === "function") this._emit("tool_calls.function.arguments.delta", {
					name: toolCallSnapshot.function?.name,
					index: toolCallDelta.index,
					arguments: toolCallSnapshot.function.arguments,
					parsed_arguments: toolCallSnapshot.function.parsed_arguments,
					arguments_delta: toolCallDelta.function?.arguments ?? ""
				});
				else toolCallSnapshot?.type;
			}
		}
	}, _ChatCompletionStream_emitToolCallDoneEvent = function _ChatCompletionStream_emitToolCallDoneEvent(choiceSnapshot, toolCallIndex) {
		if (__classPrivateFieldGet(this, _ChatCompletionStream_instances, "m", _ChatCompletionStream_getChoiceEventState).call(this, choiceSnapshot).done_tool_calls.has(toolCallIndex)) return;
		const toolCallSnapshot = choiceSnapshot.message.tool_calls?.[toolCallIndex];
		if (!toolCallSnapshot) throw new Error("no tool call snapshot");
		if (!toolCallSnapshot.type) throw new Error("tool call snapshot missing `type`");
		if (toolCallSnapshot.type === "function") {
			const inputTool = __classPrivateFieldGet(this, _ChatCompletionStream_params, "f")?.tools?.find((tool) => isChatCompletionFunctionTool(tool) && tool.function.name === toolCallSnapshot.function.name);
			this._emit("tool_calls.function.arguments.done", {
				name: toolCallSnapshot.function.name,
				index: toolCallIndex,
				arguments: toolCallSnapshot.function.arguments,
				parsed_arguments: isAutoParsableTool$1(inputTool) ? inputTool.$parseRaw(toolCallSnapshot.function.arguments) : inputTool?.function.strict ? JSON.parse(toolCallSnapshot.function.arguments) : null
			});
		} else toolCallSnapshot.type;
	}, _ChatCompletionStream_emitContentDoneEvents = function _ChatCompletionStream_emitContentDoneEvents(choiceSnapshot) {
		const state = __classPrivateFieldGet(this, _ChatCompletionStream_instances, "m", _ChatCompletionStream_getChoiceEventState).call(this, choiceSnapshot);
		if (choiceSnapshot.message.content && !state.content_done) {
			state.content_done = true;
			const responseFormat = __classPrivateFieldGet(this, _ChatCompletionStream_instances, "m", _ChatCompletionStream_getAutoParseableResponseFormat).call(this);
			this._emit("content.done", {
				content: choiceSnapshot.message.content,
				parsed: responseFormat ? responseFormat.$parseRaw(choiceSnapshot.message.content) : null
			});
		}
		if (choiceSnapshot.message.refusal && !state.refusal_done) {
			state.refusal_done = true;
			this._emit("refusal.done", { refusal: choiceSnapshot.message.refusal });
		}
		if (choiceSnapshot.logprobs?.content && !state.logprobs_content_done) {
			state.logprobs_content_done = true;
			this._emit("logprobs.content.done", { content: choiceSnapshot.logprobs.content });
		}
		if (choiceSnapshot.logprobs?.refusal && !state.logprobs_refusal_done) {
			state.logprobs_refusal_done = true;
			this._emit("logprobs.refusal.done", { refusal: choiceSnapshot.logprobs.refusal });
		}
	}, _ChatCompletionStream_endRequest = function _ChatCompletionStream_endRequest() {
		if (this.ended) throw new OpenAIError(`stream has ended, this shouldn't happen`);
		const snapshot = __classPrivateFieldGet(this, _ChatCompletionStream_currentChatCompletionSnapshot, "f");
		if (!snapshot) throw new OpenAIError(`request ended without sending any chunks`);
		__classPrivateFieldSet(this, _ChatCompletionStream_currentChatCompletionSnapshot, void 0, "f");
		__classPrivateFieldSet(this, _ChatCompletionStream_choiceEventStates, [], "f");
		return finalizeChatCompletion(snapshot, __classPrivateFieldGet(this, _ChatCompletionStream_params, "f"));
	}, _ChatCompletionStream_getAutoParseableResponseFormat = function _ChatCompletionStream_getAutoParseableResponseFormat() {
		const responseFormat = __classPrivateFieldGet(this, _ChatCompletionStream_params, "f")?.response_format;
		if (isAutoParsableResponseFormat(responseFormat)) return responseFormat;
		return null;
	}, _ChatCompletionStream_accumulateChatCompletion = function _ChatCompletionStream_accumulateChatCompletion(chunk) {
		var _a, _b, _c, _d;
		let snapshot = __classPrivateFieldGet(this, _ChatCompletionStream_currentChatCompletionSnapshot, "f");
		const { choices, ...rest } = chunk;
		if (!snapshot) snapshot = __classPrivateFieldSet(this, _ChatCompletionStream_currentChatCompletionSnapshot, {
			...rest,
			choices: []
		}, "f");
		else Object.assign(snapshot, rest);
		for (const { delta, finish_reason, index, logprobs = null, ...other } of chunk.choices) {
			let choice = snapshot.choices[index];
			if (!choice) choice = snapshot.choices[index] = {
				finish_reason,
				index,
				message: {},
				logprobs,
				...other
			};
			if (logprobs) if (!choice.logprobs) choice.logprobs = Object.assign({}, logprobs);
			else {
				const { content, refusal, ...rest } = logprobs;
				Object.assign(choice.logprobs, rest);
				if (content) {
					(_a = choice.logprobs).content ?? (_a.content = []);
					choice.logprobs.content.push(...content);
				}
				if (refusal) {
					(_b = choice.logprobs).refusal ?? (_b.refusal = []);
					choice.logprobs.refusal.push(...refusal);
				}
			}
			if (finish_reason) {
				choice.finish_reason = finish_reason;
				if (__classPrivateFieldGet(this, _ChatCompletionStream_params, "f") && hasAutoParseableInput$1(__classPrivateFieldGet(this, _ChatCompletionStream_params, "f"))) {
					if (finish_reason === "length") throw new LengthFinishReasonError();
					if (finish_reason === "content_filter") throw new ContentFilterFinishReasonError();
				}
			}
			Object.assign(choice, other);
			if (!delta) continue;
			const { content, refusal, function_call, role, tool_calls, ...rest } = delta;
			Object.assign(choice.message, rest);
			if (refusal) choice.message.refusal = (choice.message.refusal || "") + refusal;
			if (role) choice.message.role = role;
			if (function_call) if (!choice.message.function_call) choice.message.function_call = function_call;
			else {
				if (function_call.name) choice.message.function_call.name = function_call.name;
				if (function_call.arguments) {
					(_c = choice.message.function_call).arguments ?? (_c.arguments = "");
					choice.message.function_call.arguments += function_call.arguments;
				}
			}
			if (content) {
				choice.message.content = (choice.message.content || "") + content;
				if (!choice.message.refusal && __classPrivateFieldGet(this, _ChatCompletionStream_instances, "m", _ChatCompletionStream_getAutoParseableResponseFormat).call(this)) choice.message.parsed = choice.message.content.trim() ? partialParse(choice.message.content) : null;
			}
			if (tool_calls) {
				if (!choice.message.tool_calls) choice.message.tool_calls = [];
				for (const { index, id, type, function: fn, ...rest } of tool_calls) {
					const tool_call = (_d = choice.message.tool_calls)[index] ?? (_d[index] = {});
					Object.assign(tool_call, rest);
					if (id) tool_call.id = id;
					if (type) tool_call.type = type;
					if (fn) tool_call.function ?? (tool_call.function = {
						name: fn.name ?? "",
						arguments: ""
					});
					if (fn?.name) tool_call.function.name = fn.name;
					if (fn?.arguments) {
						tool_call.function.arguments += fn.arguments;
						if (shouldParseToolCall(__classPrivateFieldGet(this, _ChatCompletionStream_params, "f"), tool_call)) tool_call.function.parsed_arguments = partialParse(tool_call.function.arguments);
					}
				}
			}
		}
		return snapshot;
	}, Symbol.asyncIterator)]() {
		const pushQueue = [];
		const readQueue = [];
		let done = false;
		this.on("chunk", (chunk) => {
			const reader = readQueue.shift();
			if (reader) reader.resolve(chunk);
			else pushQueue.push(chunk);
		});
		this.on("end", () => {
			done = true;
			for (const reader of readQueue) reader.resolve(void 0);
			readQueue.length = 0;
		});
		this.on("abort", (err) => {
			done = true;
			for (const reader of readQueue) reader.reject(err);
			readQueue.length = 0;
		});
		this.on("error", (err) => {
			done = true;
			for (const reader of readQueue) reader.reject(err);
			readQueue.length = 0;
		});
		return {
			next: async () => {
				if (!pushQueue.length) {
					if (done) return {
						value: void 0,
						done: true
					};
					return new Promise((resolve, reject) => readQueue.push({
						resolve,
						reject
					})).then((chunk) => chunk ? {
						value: chunk,
						done: false
					} : {
						value: void 0,
						done: true
					});
				}
				return {
					value: pushQueue.shift(),
					done: false
				};
			},
			return: async () => {
				this.abort();
				return {
					value: void 0,
					done: true
				};
			}
		};
	}
	toReadableStream() {
		return new Stream(this[Symbol.asyncIterator].bind(this), this.controller).toReadableStream();
	}
};
function finalizeChatCompletion(snapshot, params) {
	const { id, choices, created, model, system_fingerprint, ...rest } = snapshot;
	return maybeParseChatCompletion({
		...rest,
		id,
		choices: choices.map(({ message, finish_reason, index, logprobs, ...choiceRest }) => {
			if (!finish_reason) throw new OpenAIError(`missing finish_reason for choice ${index}`);
			const { content = null, function_call, tool_calls, ...messageRest } = message;
			const role = message.role;
			if (!role) throw new OpenAIError(`missing role for choice ${index}`);
			if (function_call) {
				const { arguments: args, name } = function_call;
				if (args == null) throw new OpenAIError(`missing function_call.arguments for choice ${index}`);
				if (!name) throw new OpenAIError(`missing function_call.name for choice ${index}`);
				return {
					...choiceRest,
					message: {
						content,
						function_call: {
							arguments: args,
							name
						},
						role,
						refusal: message.refusal ?? null
					},
					finish_reason,
					index,
					logprobs
				};
			}
			if (tool_calls) return {
				...choiceRest,
				index,
				finish_reason,
				logprobs,
				message: {
					...messageRest,
					role,
					content,
					refusal: message.refusal ?? null,
					tool_calls: tool_calls.map((tool_call, i) => {
						const { function: fn, type, id, ...toolRest } = tool_call;
						const { arguments: args, name, ...fnRest } = fn || {};
						if (id == null) throw new OpenAIError(`missing choices[${index}].tool_calls[${i}].id\n${str(snapshot)}`);
						if (type == null) throw new OpenAIError(`missing choices[${index}].tool_calls[${i}].type\n${str(snapshot)}`);
						if (name == null) throw new OpenAIError(`missing choices[${index}].tool_calls[${i}].function.name\n${str(snapshot)}`);
						if (args == null) throw new OpenAIError(`missing choices[${index}].tool_calls[${i}].function.arguments\n${str(snapshot)}`);
						return {
							...toolRest,
							id,
							type,
							function: {
								...fnRest,
								name,
								arguments: args
							}
						};
					})
				}
			};
			return {
				...choiceRest,
				message: {
					...messageRest,
					content,
					role,
					refusal: message.refusal ?? null
				},
				finish_reason,
				index,
				logprobs
			};
		}),
		created,
		model,
		object: "chat.completion",
		...system_fingerprint ? { system_fingerprint } : {}
	}, params);
}
function str(x) {
	return JSON.stringify(x);
}
//#endregion
//#region node_modules/openai/lib/ChatCompletionStreamingRunner.mjs
var ChatCompletionStreamingRunner = class ChatCompletionStreamingRunner extends ChatCompletionStream {
	static fromReadableStream(stream) {
		const runner = new ChatCompletionStreamingRunner(null);
		runner._run(() => runner._fromReadableStream(stream));
		return runner;
	}
	static runTools(client, params, options) {
		const runner = new ChatCompletionStreamingRunner(params);
		const opts = {
			...options,
			headers: {
				...options?.headers,
				"X-Stainless-Helper-Method": "runTools"
			}
		};
		runner._run(() => runner._runTools(client, params, runner, opts));
		return runner;
	}
};
//#endregion
//#region node_modules/openai/resources/chat/completions/completions.mjs
/**
* Given a list of messages comprising a conversation, the model will return a response.
*/
var Completions$1 = class extends APIResource {
	constructor() {
		super(...arguments);
		this.messages = new Messages$1(this._client);
	}
	create(body, options) {
		return this._client.post("/chat/completions", {
			body,
			...options,
			stream: body.stream ?? false,
			__security: { bearerAuth: true }
		});
	}
	/**
	* Get a stored chat completion. Only Chat Completions that have been created with
	* the `store` parameter set to `true` will be returned.
	*
	* @example
	* ```ts
	* const chatCompletion =
	*   await client.chat.completions.retrieve('completion_id');
	* ```
	*/
	retrieve(completionID, options) {
		return this._client.get(path$1`/chat/completions/${completionID}`, {
			...options,
			__security: { bearerAuth: true }
		});
	}
	/**
	* Modify a stored chat completion. Only Chat Completions that have been created
	* with the `store` parameter set to `true` can be modified. Currently, the only
	* supported modification is to update the `metadata` field.
	*
	* @example
	* ```ts
	* const chatCompletion = await client.chat.completions.update(
	*   'completion_id',
	*   { metadata: { foo: 'string' } },
	* );
	* ```
	*/
	update(completionID, body, options) {
		return this._client.post(path$1`/chat/completions/${completionID}`, {
			body,
			...options,
			__security: { bearerAuth: true }
		});
	}
	/**
	* List stored Chat Completions. Only Chat Completions that have been stored with
	* the `store` parameter set to `true` will be returned.
	*
	* @example
	* ```ts
	* // Automatically fetches more pages as needed.
	* for await (const chatCompletion of client.chat.completions.list()) {
	*   // ...
	* }
	* ```
	*/
	list(query = {}, options) {
		return this._client.getAPIList("/chat/completions", CursorPage, {
			query,
			...options,
			__security: { bearerAuth: true }
		});
	}
	/**
	* Delete a stored chat completion. Only Chat Completions that have been created
	* with the `store` parameter set to `true` can be deleted.
	*
	* @example
	* ```ts
	* const chatCompletionDeleted =
	*   await client.chat.completions.delete('completion_id');
	* ```
	*/
	delete(completionID, options) {
		return this._client.delete(path$1`/chat/completions/${completionID}`, {
			...options,
			__security: { bearerAuth: true }
		});
	}
	parse(body, options) {
		validateInputTools(body.tools);
		return this._client.chat.completions.create(body, {
			...options,
			headers: {
				...options?.headers,
				"X-Stainless-Helper-Method": "chat.completions.parse"
			}
		})._thenUnwrap((completion) => parseChatCompletion(completion, body));
	}
	runTools(body, options) {
		if (body.stream) return ChatCompletionStreamingRunner.runTools(this._client, body, options);
		return ChatCompletionRunner.runTools(this._client, body, options);
	}
	/**
	* Creates a chat completion stream
	*/
	stream(body, options) {
		return ChatCompletionStream.createChatCompletion(this._client, body, options);
	}
};
Completions$1.Messages = Messages$1;
//#endregion
//#region node_modules/openai/resources/chat/chat.mjs
var Chat = class extends APIResource {
	constructor() {
		super(...arguments);
		this.completions = new Completions$1(this._client);
	}
};
Chat.Completions = Completions$1;
//#endregion
//#region node_modules/openai/resources/admin/organization/admin-api-keys.mjs
var AdminAPIKeys = class extends APIResource {
	/**
	* Create an organization admin API key
	*
	* @example
	* ```ts
	* const adminAPIKey =
	*   await client.admin.organization.adminAPIKeys.create({
	*     name: 'New Admin Key',
	*   });
	* ```
	*/
	create(body, options) {
		return this._client.post("/organization/admin_api_keys", {
			body,
			...options,
			__security: { adminAPIKeyAuth: true }
		});
	}
	/**
	* Retrieve a single organization API key
	*
	* @example
	* ```ts
	* const adminAPIKey =
	*   await client.admin.organization.adminAPIKeys.retrieve(
	*     'key_id',
	*   );
	* ```
	*/
	retrieve(keyID, options) {
		return this._client.get(path$1`/organization/admin_api_keys/${keyID}`, {
			...options,
			__security: { adminAPIKeyAuth: true }
		});
	}
	/**
	* List organization API keys
	*
	* @example
	* ```ts
	* // Automatically fetches more pages as needed.
	* for await (const adminAPIKey of client.admin.organization.adminAPIKeys.list()) {
	*   // ...
	* }
	* ```
	*/
	list(query = {}, options) {
		return this._client.getAPIList("/organization/admin_api_keys", CursorPage, {
			query,
			...options,
			__security: { adminAPIKeyAuth: true }
		});
	}
	/**
	* Delete an organization admin API key
	*
	* @example
	* ```ts
	* const adminAPIKey =
	*   await client.admin.organization.adminAPIKeys.delete(
	*     'key_id',
	*   );
	* ```
	*/
	delete(keyID, options) {
		return this._client.delete(path$1`/organization/admin_api_keys/${keyID}`, {
			...options,
			__security: { adminAPIKeyAuth: true }
		});
	}
};
//#endregion
//#region node_modules/openai/resources/admin/organization/audit-logs.mjs
/**
* List user actions and configuration changes within this organization.
*/
var AuditLogs = class extends APIResource {
	/**
	* List user actions and configuration changes within this organization.
	*
	* @example
	* ```ts
	* // Automatically fetches more pages as needed.
	* for await (const auditLogListResponse of client.admin.organization.auditLogs.list()) {
	*   // ...
	* }
	* ```
	*/
	list(query = {}, options) {
		return this._client.getAPIList("/organization/audit_logs", ConversationCursorPage, {
			query,
			...options,
			__security: { adminAPIKeyAuth: true }
		});
	}
};
//#endregion
//#region node_modules/openai/resources/admin/organization/certificates.mjs
var Certificates$1 = class extends APIResource {
	/**
	* Upload a certificate to the organization. This does **not** automatically
	* activate the certificate.
	*
	* Organizations can upload up to 50 certificates.
	*
	* @example
	* ```ts
	* const certificate =
	*   await client.admin.organization.certificates.create({
	*     certificate: 'certificate',
	*   });
	* ```
	*/
	create(body, options) {
		return this._client.post("/organization/certificates", {
			body,
			...options,
			__security: { adminAPIKeyAuth: true }
		});
	}
	/**
	* Get a certificate that has been uploaded to the organization.
	*
	* You can get a certificate regardless of whether it is active or not.
	*
	* @example
	* ```ts
	* const certificate =
	*   await client.admin.organization.certificates.retrieve(
	*     'certificate_id',
	*   );
	* ```
	*/
	retrieve(certificateID, query = {}, options) {
		return this._client.get(path$1`/organization/certificates/${certificateID}`, {
			query,
			...options,
			__security: { adminAPIKeyAuth: true }
		});
	}
	/**
	* Modify a certificate. Note that only the name can be modified.
	*
	* @example
	* ```ts
	* const certificate =
	*   await client.admin.organization.certificates.update(
	*     'certificate_id',
	*   );
	* ```
	*/
	update(certificateID, body, options) {
		return this._client.post(path$1`/organization/certificates/${certificateID}`, {
			body,
			...options,
			__security: { adminAPIKeyAuth: true }
		});
	}
	/**
	* List uploaded certificates for this organization.
	*
	* @example
	* ```ts
	* // Automatically fetches more pages as needed.
	* for await (const certificateListResponse of client.admin.organization.certificates.list()) {
	*   // ...
	* }
	* ```
	*/
	list(query = {}, options) {
		return this._client.getAPIList("/organization/certificates", ConversationCursorPage, {
			query,
			...options,
			__security: { adminAPIKeyAuth: true }
		});
	}
	/**
	* Delete a certificate from the organization.
	*
	* The certificate must be inactive for the organization and all projects.
	*
	* @example
	* ```ts
	* const certificate =
	*   await client.admin.organization.certificates.delete(
	*     'certificate_id',
	*   );
	* ```
	*/
	delete(certificateID, options) {
		return this._client.delete(path$1`/organization/certificates/${certificateID}`, {
			...options,
			__security: { adminAPIKeyAuth: true }
		});
	}
	/**
	* Activate certificates at the organization level.
	*
	* You can atomically and idempotently activate up to 10 certificates at a time.
	*
	* @example
	* ```ts
	* // Automatically fetches more pages as needed.
	* for await (const certificateActivateResponse of client.admin.organization.certificates.activate(
	*   { certificate_ids: ['cert_abc'] },
	* )) {
	*   // ...
	* }
	* ```
	*/
	activate(body, options) {
		return this._client.getAPIList("/organization/certificates/activate", Page, {
			body,
			method: "post",
			...options,
			__security: { adminAPIKeyAuth: true }
		});
	}
	/**
	* Deactivate certificates at the organization level.
	*
	* You can atomically and idempotently deactivate up to 10 certificates at a time.
	*
	* @example
	* ```ts
	* // Automatically fetches more pages as needed.
	* for await (const certificateDeactivateResponse of client.admin.organization.certificates.deactivate(
	*   { certificate_ids: ['cert_abc'] },
	* )) {
	*   // ...
	* }
	* ```
	*/
	deactivate(body, options) {
		return this._client.getAPIList("/organization/certificates/deactivate", Page, {
			body,
			method: "post",
			...options,
			__security: { adminAPIKeyAuth: true }
		});
	}
};
//#endregion
//#region node_modules/openai/resources/admin/organization/data-retention.mjs
var DataRetention$1 = class extends APIResource {
	/**
	* Retrieves organization data retention controls.
	*
	* @example
	* ```ts
	* const organizationDataRetention =
	*   await client.admin.organization.dataRetention.retrieve();
	* ```
	*/
	retrieve(options) {
		return this._client.get("/organization/data_retention", {
			...options,
			__security: { adminAPIKeyAuth: true }
		});
	}
	/**
	* Updates organization data retention controls.
	*
	* @example
	* ```ts
	* const organizationDataRetention =
	*   await client.admin.organization.dataRetention.update({
	*     retention_type: 'zero_data_retention',
	*   });
	* ```
	*/
	update(body, options) {
		return this._client.post("/organization/data_retention", {
			body,
			...options,
			__security: { adminAPIKeyAuth: true }
		});
	}
};
//#endregion
//#region node_modules/openai/resources/admin/organization/invites.mjs
var Invites = class extends APIResource {
	/**
	* Create an invite for a user to the organization. The invite must be accepted by
	* the user before they have access to the organization.
	*
	* @example
	* ```ts
	* const invite =
	*   await client.admin.organization.invites.create({
	*     email: 'email',
	*     role: 'reader',
	*   });
	* ```
	*/
	create(body, options) {
		return this._client.post("/organization/invites", {
			body,
			...options,
			__security: { adminAPIKeyAuth: true }
		});
	}
	/**
	* Retrieves an invite.
	*
	* @example
	* ```ts
	* const invite =
	*   await client.admin.organization.invites.retrieve(
	*     'invite_id',
	*   );
	* ```
	*/
	retrieve(inviteID, options) {
		return this._client.get(path$1`/organization/invites/${inviteID}`, {
			...options,
			__security: { adminAPIKeyAuth: true }
		});
	}
	/**
	* Returns a list of invites in the organization.
	*
	* @example
	* ```ts
	* // Automatically fetches more pages as needed.
	* for await (const invite of client.admin.organization.invites.list()) {
	*   // ...
	* }
	* ```
	*/
	list(query = {}, options) {
		return this._client.getAPIList("/organization/invites", ConversationCursorPage, {
			query,
			...options,
			__security: { adminAPIKeyAuth: true }
		});
	}
	/**
	* Delete an invite. If the invite has already been accepted, it cannot be deleted.
	*
	* @example
	* ```ts
	* const invite =
	*   await client.admin.organization.invites.delete(
	*     'invite_id',
	*   );
	* ```
	*/
	delete(inviteID, options) {
		return this._client.delete(path$1`/organization/invites/${inviteID}`, {
			...options,
			__security: { adminAPIKeyAuth: true }
		});
	}
};
//#endregion
//#region node_modules/openai/resources/admin/organization/roles.mjs
var Roles$5 = class extends APIResource {
	/**
	* Creates a custom role for the organization.
	*
	* @example
	* ```ts
	* const role = await client.admin.organization.roles.create({
	*   permissions: ['string'],
	*   role_name: 'role_name',
	* });
	* ```
	*/
	create(body, options) {
		return this._client.post("/organization/roles", {
			body,
			...options,
			__security: { adminAPIKeyAuth: true }
		});
	}
	/**
	* Retrieves an organization role.
	*
	* @example
	* ```ts
	* const role = await client.admin.organization.roles.retrieve(
	*   'role_id',
	* );
	* ```
	*/
	retrieve(roleID, options) {
		return this._client.get(path$1`/organization/roles/${roleID}`, {
			...options,
			__security: { adminAPIKeyAuth: true }
		});
	}
	/**
	* Updates an existing organization role.
	*
	* @example
	* ```ts
	* const role = await client.admin.organization.roles.update(
	*   'role_id',
	* );
	* ```
	*/
	update(roleID, body, options) {
		return this._client.post(path$1`/organization/roles/${roleID}`, {
			body,
			...options,
			__security: { adminAPIKeyAuth: true }
		});
	}
	/**
	* Lists the roles configured for the organization.
	*
	* @example
	* ```ts
	* // Automatically fetches more pages as needed.
	* for await (const role of client.admin.organization.roles.list()) {
	*   // ...
	* }
	* ```
	*/
	list(query = {}, options) {
		return this._client.getAPIList("/organization/roles", NextCursorPage, {
			query,
			...options,
			__security: { adminAPIKeyAuth: true }
		});
	}
	/**
	* Deletes a custom role from the organization.
	*
	* @example
	* ```ts
	* const role = await client.admin.organization.roles.delete(
	*   'role_id',
	* );
	* ```
	*/
	delete(roleID, options) {
		return this._client.delete(path$1`/organization/roles/${roleID}`, {
			...options,
			__security: { adminAPIKeyAuth: true }
		});
	}
};
//#endregion
//#region node_modules/openai/resources/admin/organization/spend-alerts.mjs
var SpendAlerts$1 = class extends APIResource {
	/**
	* Creates an organization spend alert.
	*
	* @example
	* ```ts
	* const organizationSpendAlert =
	*   await client.admin.organization.spendAlerts.create({
	*     currency: 'USD',
	*     interval: 'month',
	*     notification_channel: {
	*       recipients: ['string'],
	*       type: 'email',
	*     },
	*     threshold_amount: 0,
	*   });
	* ```
	*/
	create(body, options) {
		return this._client.post("/organization/spend_alerts", {
			body,
			...options,
			__security: { adminAPIKeyAuth: true }
		});
	}
	/**
	* Retrieves an organization spend alert.
	*
	* @example
	* ```ts
	* const organizationSpendAlert =
	*   await client.admin.organization.spendAlerts.retrieve(
	*     'alert_id',
	*   );
	* ```
	*/
	retrieve(alertID, options) {
		return this._client.get(path$1`/organization/spend_alerts/${alertID}`, {
			...options,
			__security: { adminAPIKeyAuth: true }
		});
	}
	/**
	* Updates an organization spend alert.
	*
	* @example
	* ```ts
	* const organizationSpendAlert =
	*   await client.admin.organization.spendAlerts.update(
	*     'alert_id',
	*     {
	*       currency: 'USD',
	*       interval: 'month',
	*       notification_channel: {
	*         recipients: ['string'],
	*         type: 'email',
	*       },
	*       threshold_amount: 0,
	*     },
	*   );
	* ```
	*/
	update(alertID, body, options) {
		return this._client.post(path$1`/organization/spend_alerts/${alertID}`, {
			body,
			...options,
			__security: { adminAPIKeyAuth: true }
		});
	}
	/**
	* Lists organization spend alerts.
	*
	* @example
	* ```ts
	* // Automatically fetches more pages as needed.
	* for await (const organizationSpendAlert of client.admin.organization.spendAlerts.list()) {
	*   // ...
	* }
	* ```
	*/
	list(query = {}, options) {
		return this._client.getAPIList("/organization/spend_alerts", ConversationCursorPage, {
			query,
			...options,
			__security: { adminAPIKeyAuth: true }
		});
	}
	/**
	* Deletes an organization spend alert.
	*
	* @example
	* ```ts
	* const organizationSpendAlertDeleted =
	*   await client.admin.organization.spendAlerts.delete(
	*     'alert_id',
	*   );
	* ```
	*/
	delete(alertID, options) {
		return this._client.delete(path$1`/organization/spend_alerts/${alertID}`, {
			...options,
			__security: { adminAPIKeyAuth: true }
		});
	}
};
//#endregion
//#region node_modules/openai/resources/admin/organization/usage.mjs
var Usage = class extends APIResource {
	/**
	* Get audio speeches usage details for the organization.
	*
	* @example
	* ```ts
	* const response =
	*   await client.admin.organization.usage.audioSpeeches({
	*     start_time: 0,
	*   });
	* ```
	*/
	audioSpeeches(query, options) {
		return this._client.get("/organization/usage/audio_speeches", {
			query,
			...options,
			__security: { adminAPIKeyAuth: true }
		});
	}
	/**
	* Get audio transcriptions usage details for the organization.
	*
	* @example
	* ```ts
	* const response =
	*   await client.admin.organization.usage.audioTranscriptions(
	*     { start_time: 0 },
	*   );
	* ```
	*/
	audioTranscriptions(query, options) {
		return this._client.get("/organization/usage/audio_transcriptions", {
			query,
			...options,
			__security: { adminAPIKeyAuth: true }
		});
	}
	/**
	* Get code interpreter sessions usage details for the organization.
	*
	* @example
	* ```ts
	* const response =
	*   await client.admin.organization.usage.codeInterpreterSessions(
	*     { start_time: 0 },
	*   );
	* ```
	*/
	codeInterpreterSessions(query, options) {
		return this._client.get("/organization/usage/code_interpreter_sessions", {
			query,
			...options,
			__security: { adminAPIKeyAuth: true }
		});
	}
	/**
	* Get completions usage details for the organization.
	*
	* @example
	* ```ts
	* const response =
	*   await client.admin.organization.usage.completions({
	*     start_time: 0,
	*   });
	* ```
	*/
	completions(query, options) {
		return this._client.get("/organization/usage/completions", {
			query,
			...options,
			__security: { adminAPIKeyAuth: true }
		});
	}
	/**
	* Get costs details for the organization.
	*
	* @example
	* ```ts
	* const response =
	*   await client.admin.organization.usage.costs({
	*     start_time: 0,
	*   });
	* ```
	*/
	costs(query, options) {
		return this._client.get("/organization/costs", {
			query,
			...options,
			__security: { adminAPIKeyAuth: true }
		});
	}
	/**
	* Get embeddings usage details for the organization.
	*
	* @example
	* ```ts
	* const response =
	*   await client.admin.organization.usage.embeddings({
	*     start_time: 0,
	*   });
	* ```
	*/
	embeddings(query, options) {
		return this._client.get("/organization/usage/embeddings", {
			query,
			...options,
			__security: { adminAPIKeyAuth: true }
		});
	}
	/**
	* Get file search calls usage details for the organization.
	*
	* @example
	* ```ts
	* const response =
	*   await client.admin.organization.usage.fileSearchCalls({
	*     start_time: 0,
	*   });
	* ```
	*/
	fileSearchCalls(query, options) {
		return this._client.get("/organization/usage/file_search_calls", {
			query,
			...options,
			__security: { adminAPIKeyAuth: true }
		});
	}
	/**
	* Get images usage details for the organization.
	*
	* @example
	* ```ts
	* const response =
	*   await client.admin.organization.usage.images({
	*     start_time: 0,
	*   });
	* ```
	*/
	images(query, options) {
		return this._client.get("/organization/usage/images", {
			query,
			...options,
			__security: { adminAPIKeyAuth: true }
		});
	}
	/**
	* Get moderations usage details for the organization.
	*
	* @example
	* ```ts
	* const response =
	*   await client.admin.organization.usage.moderations({
	*     start_time: 0,
	*   });
	* ```
	*/
	moderations(query, options) {
		return this._client.get("/organization/usage/moderations", {
			query,
			...options,
			__security: { adminAPIKeyAuth: true }
		});
	}
	/**
	* Get vector stores usage details for the organization.
	*
	* @example
	* ```ts
	* const response =
	*   await client.admin.organization.usage.vectorStores({
	*     start_time: 0,
	*   });
	* ```
	*/
	vectorStores(query, options) {
		return this._client.get("/organization/usage/vector_stores", {
			query,
			...options,
			__security: { adminAPIKeyAuth: true }
		});
	}
	/**
	* Get web search calls usage details for the organization.
	*
	* @example
	* ```ts
	* const response =
	*   await client.admin.organization.usage.webSearchCalls({
	*     start_time: 0,
	*   });
	* ```
	*/
	webSearchCalls(query, options) {
		return this._client.get("/organization/usage/web_search_calls", {
			query,
			...options,
			__security: { adminAPIKeyAuth: true }
		});
	}
};
//#endregion
//#region node_modules/openai/resources/admin/organization/groups/roles.mjs
var Roles$4 = class extends APIResource {
	/**
	* Assigns an organization role to a group within the organization.
	*
	* @example
	* ```ts
	* const role =
	*   await client.admin.organization.groups.roles.create(
	*     'group_id',
	*     { role_id: 'role_id' },
	*   );
	* ```
	*/
	create(groupID, body, options) {
		return this._client.post(path$1`/organization/groups/${groupID}/roles`, {
			body,
			...options,
			__security: { adminAPIKeyAuth: true }
		});
	}
	/**
	* Retrieves an organization role assigned to a group.
	*
	* @example
	* ```ts
	* const role =
	*   await client.admin.organization.groups.roles.retrieve(
	*     'role_id',
	*     { group_id: 'group_id' },
	*   );
	* ```
	*/
	retrieve(roleID, params, options) {
		const { group_id } = params;
		return this._client.get(path$1`/organization/groups/${group_id}/roles/${roleID}`, {
			...options,
			__security: { adminAPIKeyAuth: true }
		});
	}
	/**
	* Lists the organization roles assigned to a group within the organization.
	*
	* @example
	* ```ts
	* // Automatically fetches more pages as needed.
	* for await (const roleListResponse of client.admin.organization.groups.roles.list(
	*   'group_id',
	* )) {
	*   // ...
	* }
	* ```
	*/
	list(groupID, query = {}, options) {
		return this._client.getAPIList(path$1`/organization/groups/${groupID}/roles`, NextCursorPage, {
			query,
			...options,
			__security: { adminAPIKeyAuth: true }
		});
	}
	/**
	* Unassigns an organization role from a group within the organization.
	*
	* @example
	* ```ts
	* const role =
	*   await client.admin.organization.groups.roles.delete(
	*     'role_id',
	*     { group_id: 'group_id' },
	*   );
	* ```
	*/
	delete(roleID, params, options) {
		const { group_id } = params;
		return this._client.delete(path$1`/organization/groups/${group_id}/roles/${roleID}`, {
			...options,
			__security: { adminAPIKeyAuth: true }
		});
	}
};
//#endregion
//#region node_modules/openai/resources/admin/organization/groups/users.mjs
var Users$2 = class extends APIResource {
	/**
	* Adds a user to a group.
	*
	* @example
	* ```ts
	* const user =
	*   await client.admin.organization.groups.users.create(
	*     'group_id',
	*     { user_id: 'user_id' },
	*   );
	* ```
	*/
	create(groupID, body, options) {
		return this._client.post(path$1`/organization/groups/${groupID}/users`, {
			body,
			...options,
			__security: { adminAPIKeyAuth: true }
		});
	}
	/**
	* Retrieves a user in a group.
	*
	* @example
	* ```ts
	* const user =
	*   await client.admin.organization.groups.users.retrieve(
	*     'user_id',
	*     { group_id: 'group_id' },
	*   );
	* ```
	*/
	retrieve(userID, params, options) {
		const { group_id } = params;
		return this._client.get(path$1`/organization/groups/${group_id}/users/${userID}`, {
			...options,
			__security: { adminAPIKeyAuth: true }
		});
	}
	/**
	* Lists the users assigned to a group.
	*
	* @example
	* ```ts
	* // Automatically fetches more pages as needed.
	* for await (const organizationGroupUser of client.admin.organization.groups.users.list(
	*   'group_id',
	* )) {
	*   // ...
	* }
	* ```
	*/
	list(groupID, query = {}, options) {
		return this._client.getAPIList(path$1`/organization/groups/${groupID}/users`, NextCursorPage, {
			query,
			...options,
			__security: { adminAPIKeyAuth: true }
		});
	}
	/**
	* Removes a user from a group.
	*
	* @example
	* ```ts
	* const user =
	*   await client.admin.organization.groups.users.delete(
	*     'user_id',
	*     { group_id: 'group_id' },
	*   );
	* ```
	*/
	delete(userID, params, options) {
		const { group_id } = params;
		return this._client.delete(path$1`/organization/groups/${group_id}/users/${userID}`, {
			...options,
			__security: { adminAPIKeyAuth: true }
		});
	}
};
//#endregion
//#region node_modules/openai/resources/admin/organization/groups/groups.mjs
var Groups$1 = class extends APIResource {
	constructor() {
		super(...arguments);
		this.users = new Users$2(this._client);
		this.roles = new Roles$4(this._client);
	}
	/**
	* Creates a new group in the organization.
	*
	* @example
	* ```ts
	* const group = await client.admin.organization.groups.create(
	*   { name: 'x' },
	* );
	* ```
	*/
	create(body, options) {
		return this._client.post("/organization/groups", {
			body,
			...options,
			__security: { adminAPIKeyAuth: true }
		});
	}
	/**
	* Retrieves a group.
	*
	* @example
	* ```ts
	* const group =
	*   await client.admin.organization.groups.retrieve(
	*     'group_id',
	*   );
	* ```
	*/
	retrieve(groupID, options) {
		return this._client.get(path$1`/organization/groups/${groupID}`, {
			...options,
			__security: { adminAPIKeyAuth: true }
		});
	}
	/**
	* Updates a group's information.
	*
	* @example
	* ```ts
	* const group = await client.admin.organization.groups.update(
	*   'group_id',
	*   { name: 'x' },
	* );
	* ```
	*/
	update(groupID, body, options) {
		return this._client.post(path$1`/organization/groups/${groupID}`, {
			body,
			...options,
			__security: { adminAPIKeyAuth: true }
		});
	}
	/**
	* Lists all groups in the organization.
	*
	* @example
	* ```ts
	* // Automatically fetches more pages as needed.
	* for await (const group of client.admin.organization.groups.list()) {
	*   // ...
	* }
	* ```
	*/
	list(query = {}, options) {
		return this._client.getAPIList("/organization/groups", NextCursorPage, {
			query,
			...options,
			__security: { adminAPIKeyAuth: true }
		});
	}
	/**
	* Deletes a group from the organization.
	*
	* @example
	* ```ts
	* const group = await client.admin.organization.groups.delete(
	*   'group_id',
	* );
	* ```
	*/
	delete(groupID, options) {
		return this._client.delete(path$1`/organization/groups/${groupID}`, {
			...options,
			__security: { adminAPIKeyAuth: true }
		});
	}
};
Groups$1.Users = Users$2;
Groups$1.Roles = Roles$4;
//#endregion
//#region node_modules/openai/resources/admin/organization/projects/api-keys.mjs
var APIKeys = class extends APIResource {
	/**
	* Retrieves an API key in the project.
	*
	* @example
	* ```ts
	* const projectAPIKey =
	*   await client.admin.organization.projects.apiKeys.retrieve(
	*     'api_key_id',
	*     { project_id: 'project_id' },
	*   );
	* ```
	*/
	retrieve(apiKeyID, params, options) {
		const { project_id } = params;
		return this._client.get(path$1`/organization/projects/${project_id}/api_keys/${apiKeyID}`, {
			...options,
			__security: { adminAPIKeyAuth: true }
		});
	}
	/**
	* Returns a list of API keys in the project.
	*
	* @example
	* ```ts
	* // Automatically fetches more pages as needed.
	* for await (const projectAPIKey of client.admin.organization.projects.apiKeys.list(
	*   'project_id',
	* )) {
	*   // ...
	* }
	* ```
	*/
	list(projectID, query = {}, options) {
		return this._client.getAPIList(path$1`/organization/projects/${projectID}/api_keys`, ConversationCursorPage, {
			query,
			...options,
			__security: { adminAPIKeyAuth: true }
		});
	}
	/**
	* Deletes an API key from the project.
	*
	* Returns confirmation of the key deletion, or an error if the key belonged to a
	* service account.
	*
	* @example
	* ```ts
	* const apiKey =
	*   await client.admin.organization.projects.apiKeys.delete(
	*     'api_key_id',
	*     { project_id: 'project_id' },
	*   );
	* ```
	*/
	delete(apiKeyID, params, options) {
		const { project_id } = params;
		return this._client.delete(path$1`/organization/projects/${project_id}/api_keys/${apiKeyID}`, {
			...options,
			__security: { adminAPIKeyAuth: true }
		});
	}
};
//#endregion
//#region node_modules/openai/resources/admin/organization/projects/certificates.mjs
var Certificates = class extends APIResource {
	/**
	* List certificates for this project.
	*
	* @example
	* ```ts
	* // Automatically fetches more pages as needed.
	* for await (const certificateListResponse of client.admin.organization.projects.certificates.list(
	*   'project_id',
	* )) {
	*   // ...
	* }
	* ```
	*/
	list(projectID, query = {}, options) {
		return this._client.getAPIList(path$1`/organization/projects/${projectID}/certificates`, ConversationCursorPage, {
			query,
			...options,
			__security: { adminAPIKeyAuth: true }
		});
	}
	/**
	* Activate certificates at the project level.
	*
	* You can atomically and idempotently activate up to 10 certificates at a time.
	*
	* @example
	* ```ts
	* // Automatically fetches more pages as needed.
	* for await (const certificateActivateResponse of client.admin.organization.projects.certificates.activate(
	*   'project_id',
	*   { certificate_ids: ['cert_abc'] },
	* )) {
	*   // ...
	* }
	* ```
	*/
	activate(projectID, body, options) {
		return this._client.getAPIList(path$1`/organization/projects/${projectID}/certificates/activate`, Page, {
			body,
			method: "post",
			...options,
			__security: { adminAPIKeyAuth: true }
		});
	}
	/**
	* Deactivate certificates at the project level. You can atomically and
	* idempotently deactivate up to 10 certificates at a time.
	*
	* @example
	* ```ts
	* // Automatically fetches more pages as needed.
	* for await (const certificateDeactivateResponse of client.admin.organization.projects.certificates.deactivate(
	*   'project_id',
	*   { certificate_ids: ['cert_abc'] },
	* )) {
	*   // ...
	* }
	* ```
	*/
	deactivate(projectID, body, options) {
		return this._client.getAPIList(path$1`/organization/projects/${projectID}/certificates/deactivate`, Page, {
			body,
			method: "post",
			...options,
			__security: { adminAPIKeyAuth: true }
		});
	}
};
//#endregion
//#region node_modules/openai/resources/admin/organization/projects/data-retention.mjs
var DataRetention = class extends APIResource {
	/**
	* Retrieves project data retention controls.
	*
	* @example
	* ```ts
	* const projectDataRetention =
	*   await client.admin.organization.projects.dataRetention.retrieve(
	*     'project_id',
	*   );
	* ```
	*/
	retrieve(projectID, options) {
		return this._client.get(path$1`/organization/projects/${projectID}/data_retention`, {
			...options,
			__security: { adminAPIKeyAuth: true }
		});
	}
	/**
	* Updates project data retention controls.
	*
	* @example
	* ```ts
	* const projectDataRetention =
	*   await client.admin.organization.projects.dataRetention.update(
	*     'project_id',
	*     { retention_type: 'organization_default' },
	*   );
	* ```
	*/
	update(projectID, body, options) {
		return this._client.post(path$1`/organization/projects/${projectID}/data_retention`, {
			body,
			...options,
			__security: { adminAPIKeyAuth: true }
		});
	}
};
//#endregion
//#region node_modules/openai/resources/admin/organization/projects/hosted-tool-permissions.mjs
var HostedToolPermissions = class extends APIResource {
	/**
	* Returns hosted tool permissions for a project.
	*
	* @example
	* ```ts
	* const projectHostedToolPermissions =
	*   await client.admin.organization.projects.hostedToolPermissions.retrieve(
	*     'project_id',
	*   );
	* ```
	*/
	retrieve(projectID, options) {
		return this._client.get(path$1`/organization/projects/${projectID}/hosted_tool_permissions`, {
			...options,
			__security: { adminAPIKeyAuth: true }
		});
	}
	/**
	* Updates hosted tool permissions for a project.
	*
	* @example
	* ```ts
	* const projectHostedToolPermissions =
	*   await client.admin.organization.projects.hostedToolPermissions.update(
	*     'project_id',
	*   );
	* ```
	*/
	update(projectID, body, options) {
		return this._client.post(path$1`/organization/projects/${projectID}/hosted_tool_permissions`, {
			body,
			...options,
			__security: { adminAPIKeyAuth: true }
		});
	}
};
//#endregion
//#region node_modules/openai/resources/admin/organization/projects/model-permissions.mjs
var ModelPermissions = class extends APIResource {
	/**
	* Returns model permissions for a project.
	*
	* @example
	* ```ts
	* const projectModelPermissions =
	*   await client.admin.organization.projects.modelPermissions.retrieve(
	*     'project_id',
	*   );
	* ```
	*/
	retrieve(projectID, options) {
		return this._client.get(path$1`/organization/projects/${projectID}/model_permissions`, {
			...options,
			__security: { adminAPIKeyAuth: true }
		});
	}
	/**
	* Updates model permissions for a project.
	*
	* @example
	* ```ts
	* const projectModelPermissions =
	*   await client.admin.organization.projects.modelPermissions.update(
	*     'project_id',
	*     { mode: 'allow_list', model_ids: ['string'] },
	*   );
	* ```
	*/
	update(projectID, body, options) {
		return this._client.post(path$1`/organization/projects/${projectID}/model_permissions`, {
			body,
			...options,
			__security: { adminAPIKeyAuth: true }
		});
	}
	/**
	* Deletes model permissions for a project.
	*
	* @example
	* ```ts
	* const projectModelPermissionsDeleted =
	*   await client.admin.organization.projects.modelPermissions.delete(
	*     'project_id',
	*   );
	* ```
	*/
	delete(projectID, options) {
		return this._client.delete(path$1`/organization/projects/${projectID}/model_permissions`, {
			...options,
			__security: { adminAPIKeyAuth: true }
		});
	}
};
//#endregion
//#region node_modules/openai/resources/admin/organization/projects/rate-limits.mjs
var RateLimits = class extends APIResource {
	/**
	* Returns the rate limits per model for a project.
	*
	* @example
	* ```ts
	* // Automatically fetches more pages as needed.
	* for await (const projectRateLimit of client.admin.organization.projects.rateLimits.listRateLimits(
	*   'project_id',
	* )) {
	*   // ...
	* }
	* ```
	*/
	listRateLimits(projectID, query = {}, options) {
		return this._client.getAPIList(path$1`/organization/projects/${projectID}/rate_limits`, ConversationCursorPage, {
			query,
			...options,
			__security: { adminAPIKeyAuth: true }
		});
	}
	/**
	* Updates a project rate limit.
	*
	* @example
	* ```ts
	* const projectRateLimit =
	*   await client.admin.organization.projects.rateLimits.updateRateLimit(
	*     'rate_limit_id',
	*     { project_id: 'project_id' },
	*   );
	* ```
	*/
	updateRateLimit(rateLimitID, params, options) {
		const { project_id, ...body } = params;
		return this._client.post(path$1`/organization/projects/${project_id}/rate_limits/${rateLimitID}`, {
			body,
			...options,
			__security: { adminAPIKeyAuth: true }
		});
	}
};
//#endregion
//#region node_modules/openai/resources/admin/organization/projects/roles.mjs
var Roles$3 = class extends APIResource {
	/**
	* Creates a custom role for a project.
	*
	* @example
	* ```ts
	* const role =
	*   await client.admin.organization.projects.roles.create(
	*     'project_id',
	*     { permissions: ['string'], role_name: 'role_name' },
	*   );
	* ```
	*/
	create(projectID, body, options) {
		return this._client.post(path$1`/projects/${projectID}/roles`, {
			body,
			...options,
			__security: { adminAPIKeyAuth: true }
		});
	}
	/**
	* Retrieves a project role.
	*
	* @example
	* ```ts
	* const role =
	*   await client.admin.organization.projects.roles.retrieve(
	*     'role_id',
	*     { project_id: 'project_id' },
	*   );
	* ```
	*/
	retrieve(roleID, params, options) {
		const { project_id } = params;
		return this._client.get(path$1`/projects/${project_id}/roles/${roleID}`, {
			...options,
			__security: { adminAPIKeyAuth: true }
		});
	}
	/**
	* Updates an existing project role.
	*
	* @example
	* ```ts
	* const role =
	*   await client.admin.organization.projects.roles.update(
	*     'role_id',
	*     { project_id: 'project_id' },
	*   );
	* ```
	*/
	update(roleID, params, options) {
		const { project_id, ...body } = params;
		return this._client.post(path$1`/projects/${project_id}/roles/${roleID}`, {
			body,
			...options,
			__security: { adminAPIKeyAuth: true }
		});
	}
	/**
	* Lists the roles configured for a project.
	*
	* @example
	* ```ts
	* // Automatically fetches more pages as needed.
	* for await (const role of client.admin.organization.projects.roles.list(
	*   'project_id',
	* )) {
	*   // ...
	* }
	* ```
	*/
	list(projectID, query = {}, options) {
		return this._client.getAPIList(path$1`/projects/${projectID}/roles`, NextCursorPage, {
			query,
			...options,
			__security: { adminAPIKeyAuth: true }
		});
	}
	/**
	* Deletes a custom role from a project.
	*
	* @example
	* ```ts
	* const role =
	*   await client.admin.organization.projects.roles.delete(
	*     'role_id',
	*     { project_id: 'project_id' },
	*   );
	* ```
	*/
	delete(roleID, params, options) {
		const { project_id } = params;
		return this._client.delete(path$1`/projects/${project_id}/roles/${roleID}`, {
			...options,
			__security: { adminAPIKeyAuth: true }
		});
	}
};
//#endregion
//#region node_modules/openai/resources/admin/organization/projects/service-accounts.mjs
var ServiceAccounts = class extends APIResource {
	/**
	* Creates a new service account in the project. This also returns an unredacted
	* API key for the service account.
	*
	* @example
	* ```ts
	* const serviceAccount =
	*   await client.admin.organization.projects.serviceAccounts.create(
	*     'project_id',
	*     { name: 'name' },
	*   );
	* ```
	*/
	create(projectID, body, options) {
		return this._client.post(path$1`/organization/projects/${projectID}/service_accounts`, {
			body,
			...options,
			__security: { adminAPIKeyAuth: true }
		});
	}
	/**
	* Retrieves a service account in the project.
	*
	* @example
	* ```ts
	* const projectServiceAccount =
	*   await client.admin.organization.projects.serviceAccounts.retrieve(
	*     'service_account_id',
	*     { project_id: 'project_id' },
	*   );
	* ```
	*/
	retrieve(serviceAccountID, params, options) {
		const { project_id } = params;
		return this._client.get(path$1`/organization/projects/${project_id}/service_accounts/${serviceAccountID}`, {
			...options,
			__security: { adminAPIKeyAuth: true }
		});
	}
	/**
	* Updates a service account in the project.
	*
	* @example
	* ```ts
	* const projectServiceAccount =
	*   await client.admin.organization.projects.serviceAccounts.update(
	*     'service_account_id',
	*     { project_id: 'project_id' },
	*   );
	* ```
	*/
	update(serviceAccountID, params, options) {
		const { project_id, ...body } = params;
		return this._client.post(path$1`/organization/projects/${project_id}/service_accounts/${serviceAccountID}`, {
			body,
			...options,
			__security: { adminAPIKeyAuth: true }
		});
	}
	/**
	* Returns a list of service accounts in the project.
	*
	* @example
	* ```ts
	* // Automatically fetches more pages as needed.
	* for await (const projectServiceAccount of client.admin.organization.projects.serviceAccounts.list(
	*   'project_id',
	* )) {
	*   // ...
	* }
	* ```
	*/
	list(projectID, query = {}, options) {
		return this._client.getAPIList(path$1`/organization/projects/${projectID}/service_accounts`, ConversationCursorPage, {
			query,
			...options,
			__security: { adminAPIKeyAuth: true }
		});
	}
	/**
	* Deletes a service account from the project.
	*
	* Returns confirmation of service account deletion, or an error if the project is
	* archived (archived projects have no service accounts).
	*
	* @example
	* ```ts
	* const serviceAccount =
	*   await client.admin.organization.projects.serviceAccounts.delete(
	*     'service_account_id',
	*     { project_id: 'project_id' },
	*   );
	* ```
	*/
	delete(serviceAccountID, params, options) {
		const { project_id } = params;
		return this._client.delete(path$1`/organization/projects/${project_id}/service_accounts/${serviceAccountID}`, {
			...options,
			__security: { adminAPIKeyAuth: true }
		});
	}
};
//#endregion
//#region node_modules/openai/resources/admin/organization/projects/spend-alerts.mjs
var SpendAlerts = class extends APIResource {
	/**
	* Creates a project spend alert.
	*
	* @example
	* ```ts
	* const projectSpendAlert =
	*   await client.admin.organization.projects.spendAlerts.create(
	*     'project_id',
	*     {
	*       currency: 'USD',
	*       interval: 'month',
	*       notification_channel: {
	*         recipients: ['string'],
	*         type: 'email',
	*       },
	*       threshold_amount: 0,
	*     },
	*   );
	* ```
	*/
	create(projectID, body, options) {
		return this._client.post(path$1`/organization/projects/${projectID}/spend_alerts`, {
			body,
			...options,
			__security: { adminAPIKeyAuth: true }
		});
	}
	/**
	* Retrieves a project spend alert.
	*
	* @example
	* ```ts
	* const projectSpendAlert =
	*   await client.admin.organization.projects.spendAlerts.retrieve(
	*     'alert_id',
	*     { project_id: 'project_id' },
	*   );
	* ```
	*/
	retrieve(alertID, params, options) {
		const { project_id } = params;
		return this._client.get(path$1`/organization/projects/${project_id}/spend_alerts/${alertID}`, {
			...options,
			__security: { adminAPIKeyAuth: true }
		});
	}
	/**
	* Updates a project spend alert.
	*
	* @example
	* ```ts
	* const projectSpendAlert =
	*   await client.admin.organization.projects.spendAlerts.update(
	*     'alert_id',
	*     {
	*       project_id: 'project_id',
	*       currency: 'USD',
	*       interval: 'month',
	*       notification_channel: {
	*         recipients: ['string'],
	*         type: 'email',
	*       },
	*       threshold_amount: 0,
	*     },
	*   );
	* ```
	*/
	update(alertID, params, options) {
		const { project_id, ...body } = params;
		return this._client.post(path$1`/organization/projects/${project_id}/spend_alerts/${alertID}`, {
			body,
			...options,
			__security: { adminAPIKeyAuth: true }
		});
	}
	/**
	* Lists project spend alerts.
	*
	* @example
	* ```ts
	* // Automatically fetches more pages as needed.
	* for await (const projectSpendAlert of client.admin.organization.projects.spendAlerts.list(
	*   'project_id',
	* )) {
	*   // ...
	* }
	* ```
	*/
	list(projectID, query = {}, options) {
		return this._client.getAPIList(path$1`/organization/projects/${projectID}/spend_alerts`, ConversationCursorPage, {
			query,
			...options,
			__security: { adminAPIKeyAuth: true }
		});
	}
	/**
	* Deletes a project spend alert.
	*
	* @example
	* ```ts
	* const projectSpendAlertDeleted =
	*   await client.admin.organization.projects.spendAlerts.delete(
	*     'alert_id',
	*     { project_id: 'project_id' },
	*   );
	* ```
	*/
	delete(alertID, params, options) {
		const { project_id } = params;
		return this._client.delete(path$1`/organization/projects/${project_id}/spend_alerts/${alertID}`, {
			...options,
			__security: { adminAPIKeyAuth: true }
		});
	}
};
//#endregion
//#region node_modules/openai/resources/admin/organization/projects/groups/roles.mjs
var Roles$2 = class extends APIResource {
	/**
	* Assigns a project role to a group within a project.
	*
	* @example
	* ```ts
	* const role =
	*   await client.admin.organization.projects.groups.roles.create(
	*     'group_id',
	*     { project_id: 'project_id', role_id: 'role_id' },
	*   );
	* ```
	*/
	create(groupID, params, options) {
		const { project_id, ...body } = params;
		return this._client.post(path$1`/projects/${project_id}/groups/${groupID}/roles`, {
			body,
			...options,
			__security: { adminAPIKeyAuth: true }
		});
	}
	/**
	* Retrieves a project role assigned to a group.
	*
	* @example
	* ```ts
	* const role =
	*   await client.admin.organization.projects.groups.roles.retrieve(
	*     'role_id',
	*     { project_id: 'project_id', group_id: 'group_id' },
	*   );
	* ```
	*/
	retrieve(roleID, params, options) {
		const { project_id, group_id } = params;
		return this._client.get(path$1`/projects/${project_id}/groups/${group_id}/roles/${roleID}`, {
			...options,
			__security: { adminAPIKeyAuth: true }
		});
	}
	/**
	* Lists the project roles assigned to a group within a project.
	*
	* @example
	* ```ts
	* // Automatically fetches more pages as needed.
	* for await (const roleListResponse of client.admin.organization.projects.groups.roles.list(
	*   'group_id',
	*   { project_id: 'project_id' },
	* )) {
	*   // ...
	* }
	* ```
	*/
	list(groupID, params, options) {
		const { project_id, ...query } = params;
		return this._client.getAPIList(path$1`/projects/${project_id}/groups/${groupID}/roles`, NextCursorPage, {
			query,
			...options,
			__security: { adminAPIKeyAuth: true }
		});
	}
	/**
	* Unassigns a project role from a group within a project.
	*
	* @example
	* ```ts
	* const role =
	*   await client.admin.organization.projects.groups.roles.delete(
	*     'role_id',
	*     { project_id: 'project_id', group_id: 'group_id' },
	*   );
	* ```
	*/
	delete(roleID, params, options) {
		const { project_id, group_id } = params;
		return this._client.delete(path$1`/projects/${project_id}/groups/${group_id}/roles/${roleID}`, {
			...options,
			__security: { adminAPIKeyAuth: true }
		});
	}
};
//#endregion
//#region node_modules/openai/resources/admin/organization/projects/groups/groups.mjs
var Groups = class extends APIResource {
	constructor() {
		super(...arguments);
		this.roles = new Roles$2(this._client);
	}
	/**
	* Grants a group access to a project.
	*
	* @example
	* ```ts
	* const projectGroup =
	*   await client.admin.organization.projects.groups.create(
	*     'project_id',
	*     { group_id: 'group_id', role: 'role' },
	*   );
	* ```
	*/
	create(projectID, body, options) {
		return this._client.post(path$1`/organization/projects/${projectID}/groups`, {
			body,
			...options,
			__security: { adminAPIKeyAuth: true }
		});
	}
	/**
	* Retrieves a project's group.
	*
	* @example
	* ```ts
	* const projectGroup =
	*   await client.admin.organization.projects.groups.retrieve(
	*     'group_id',
	*     { project_id: 'project_id' },
	*   );
	* ```
	*/
	retrieve(groupID, params, options) {
		const { project_id, ...query } = params;
		return this._client.get(path$1`/organization/projects/${project_id}/groups/${groupID}`, {
			query,
			...options,
			__security: { adminAPIKeyAuth: true }
		});
	}
	/**
	* Lists the groups that have access to a project.
	*
	* @example
	* ```ts
	* // Automatically fetches more pages as needed.
	* for await (const projectGroup of client.admin.organization.projects.groups.list(
	*   'project_id',
	* )) {
	*   // ...
	* }
	* ```
	*/
	list(projectID, query = {}, options) {
		return this._client.getAPIList(path$1`/organization/projects/${projectID}/groups`, NextCursorPage, {
			query,
			...options,
			__security: { adminAPIKeyAuth: true }
		});
	}
	/**
	* Revokes a group's access to a project.
	*
	* @example
	* ```ts
	* const group =
	*   await client.admin.organization.projects.groups.delete(
	*     'group_id',
	*     { project_id: 'project_id' },
	*   );
	* ```
	*/
	delete(groupID, params, options) {
		const { project_id } = params;
		return this._client.delete(path$1`/organization/projects/${project_id}/groups/${groupID}`, {
			...options,
			__security: { adminAPIKeyAuth: true }
		});
	}
};
Groups.Roles = Roles$2;
//#endregion
//#region node_modules/openai/resources/admin/organization/projects/users/roles.mjs
var Roles$1 = class extends APIResource {
	/**
	* Assigns a project role to a user within a project.
	*
	* @example
	* ```ts
	* const role =
	*   await client.admin.organization.projects.users.roles.create(
	*     'user_id',
	*     { project_id: 'project_id', role_id: 'role_id' },
	*   );
	* ```
	*/
	create(userID, params, options) {
		const { project_id, ...body } = params;
		return this._client.post(path$1`/projects/${project_id}/users/${userID}/roles`, {
			body,
			...options,
			__security: { adminAPIKeyAuth: true }
		});
	}
	/**
	* Retrieves a project role assigned to a user.
	*
	* @example
	* ```ts
	* const role =
	*   await client.admin.organization.projects.users.roles.retrieve(
	*     'role_id',
	*     { project_id: 'project_id', user_id: 'user_id' },
	*   );
	* ```
	*/
	retrieve(roleID, params, options) {
		const { project_id, user_id } = params;
		return this._client.get(path$1`/projects/${project_id}/users/${user_id}/roles/${roleID}`, {
			...options,
			__security: { adminAPIKeyAuth: true }
		});
	}
	/**
	* Lists the project roles assigned to a user within a project.
	*
	* @example
	* ```ts
	* // Automatically fetches more pages as needed.
	* for await (const roleListResponse of client.admin.organization.projects.users.roles.list(
	*   'user_id',
	*   { project_id: 'project_id' },
	* )) {
	*   // ...
	* }
	* ```
	*/
	list(userID, params, options) {
		const { project_id, ...query } = params;
		return this._client.getAPIList(path$1`/projects/${project_id}/users/${userID}/roles`, NextCursorPage, {
			query,
			...options,
			__security: { adminAPIKeyAuth: true }
		});
	}
	/**
	* Unassigns a project role from a user within a project.
	*
	* @example
	* ```ts
	* const role =
	*   await client.admin.organization.projects.users.roles.delete(
	*     'role_id',
	*     { project_id: 'project_id', user_id: 'user_id' },
	*   );
	* ```
	*/
	delete(roleID, params, options) {
		const { project_id, user_id } = params;
		return this._client.delete(path$1`/projects/${project_id}/users/${user_id}/roles/${roleID}`, {
			...options,
			__security: { adminAPIKeyAuth: true }
		});
	}
};
//#endregion
//#region node_modules/openai/resources/admin/organization/projects/users/users.mjs
var Users$1 = class extends APIResource {
	constructor() {
		super(...arguments);
		this.roles = new Roles$1(this._client);
	}
	/**
	* Adds a user to the project. Users must already be members of the organization to
	* be added to a project.
	*
	* @example
	* ```ts
	* const projectUser =
	*   await client.admin.organization.projects.users.create(
	*     'project_id',
	*     { role: 'role' },
	*   );
	* ```
	*/
	create(projectID, body, options) {
		return this._client.post(path$1`/organization/projects/${projectID}/users`, {
			body,
			...options,
			__security: { adminAPIKeyAuth: true }
		});
	}
	/**
	* Retrieves a user in the project.
	*
	* @example
	* ```ts
	* const projectUser =
	*   await client.admin.organization.projects.users.retrieve(
	*     'user_id',
	*     { project_id: 'project_id' },
	*   );
	* ```
	*/
	retrieve(userID, params, options) {
		const { project_id } = params;
		return this._client.get(path$1`/organization/projects/${project_id}/users/${userID}`, {
			...options,
			__security: { adminAPIKeyAuth: true }
		});
	}
	/**
	* Modifies a user's role in the project.
	*
	* @example
	* ```ts
	* const projectUser =
	*   await client.admin.organization.projects.users.update(
	*     'user_id',
	*     { project_id: 'project_id' },
	*   );
	* ```
	*/
	update(userID, params, options) {
		const { project_id, ...body } = params;
		return this._client.post(path$1`/organization/projects/${project_id}/users/${userID}`, {
			body,
			...options,
			__security: { adminAPIKeyAuth: true }
		});
	}
	/**
	* Returns a list of users in the project.
	*
	* @example
	* ```ts
	* // Automatically fetches more pages as needed.
	* for await (const projectUser of client.admin.organization.projects.users.list(
	*   'project_id',
	* )) {
	*   // ...
	* }
	* ```
	*/
	list(projectID, query = {}, options) {
		return this._client.getAPIList(path$1`/organization/projects/${projectID}/users`, ConversationCursorPage, {
			query,
			...options,
			__security: { adminAPIKeyAuth: true }
		});
	}
	/**
	* Deletes a user from the project.
	*
	* Returns confirmation of project user deletion, or an error if the project is
	* archived (archived projects have no users).
	*
	* @example
	* ```ts
	* const user =
	*   await client.admin.organization.projects.users.delete(
	*     'user_id',
	*     { project_id: 'project_id' },
	*   );
	* ```
	*/
	delete(userID, params, options) {
		const { project_id } = params;
		return this._client.delete(path$1`/organization/projects/${project_id}/users/${userID}`, {
			...options,
			__security: { adminAPIKeyAuth: true }
		});
	}
};
Users$1.Roles = Roles$1;
//#endregion
//#region node_modules/openai/resources/admin/organization/projects/projects.mjs
var Projects = class extends APIResource {
	constructor() {
		super(...arguments);
		this.users = new Users$1(this._client);
		this.serviceAccounts = new ServiceAccounts(this._client);
		this.apiKeys = new APIKeys(this._client);
		this.rateLimits = new RateLimits(this._client);
		this.modelPermissions = new ModelPermissions(this._client);
		this.hostedToolPermissions = new HostedToolPermissions(this._client);
		this.groups = new Groups(this._client);
		this.roles = new Roles$3(this._client);
		this.dataRetention = new DataRetention(this._client);
		this.spendAlerts = new SpendAlerts(this._client);
		this.certificates = new Certificates(this._client);
	}
	/**
	* Create a new project in the organization. Projects can be created and archived,
	* but cannot be deleted.
	*
	* @example
	* ```ts
	* const project =
	*   await client.admin.organization.projects.create({
	*     name: 'name',
	*   });
	* ```
	*/
	create(body, options) {
		return this._client.post("/organization/projects", {
			body,
			...options,
			__security: { adminAPIKeyAuth: true }
		});
	}
	/**
	* Retrieves a project.
	*
	* @example
	* ```ts
	* const project =
	*   await client.admin.organization.projects.retrieve(
	*     'project_id',
	*   );
	* ```
	*/
	retrieve(projectID, options) {
		return this._client.get(path$1`/organization/projects/${projectID}`, {
			...options,
			__security: { adminAPIKeyAuth: true }
		});
	}
	/**
	* Modifies a project in the organization.
	*
	* @example
	* ```ts
	* const project =
	*   await client.admin.organization.projects.update(
	*     'project_id',
	*   );
	* ```
	*/
	update(projectID, body, options) {
		return this._client.post(path$1`/organization/projects/${projectID}`, {
			body,
			...options,
			__security: { adminAPIKeyAuth: true }
		});
	}
	/**
	* Returns a list of projects.
	*
	* @example
	* ```ts
	* // Automatically fetches more pages as needed.
	* for await (const project of client.admin.organization.projects.list()) {
	*   // ...
	* }
	* ```
	*/
	list(query = {}, options) {
		return this._client.getAPIList("/organization/projects", ConversationCursorPage, {
			query,
			...options,
			__security: { adminAPIKeyAuth: true }
		});
	}
	/**
	* Archives a project in the organization. Archived projects cannot be used or
	* updated.
	*
	* @example
	* ```ts
	* const project =
	*   await client.admin.organization.projects.archive(
	*     'project_id',
	*   );
	* ```
	*/
	archive(projectID, options) {
		return this._client.post(path$1`/organization/projects/${projectID}/archive`, {
			...options,
			__security: { adminAPIKeyAuth: true }
		});
	}
};
Projects.Users = Users$1;
Projects.ServiceAccounts = ServiceAccounts;
Projects.APIKeys = APIKeys;
Projects.RateLimits = RateLimits;
Projects.ModelPermissions = ModelPermissions;
Projects.HostedToolPermissions = HostedToolPermissions;
Projects.Groups = Groups;
Projects.Roles = Roles$3;
Projects.DataRetention = DataRetention;
Projects.SpendAlerts = SpendAlerts;
Projects.Certificates = Certificates;
//#endregion
//#region node_modules/openai/resources/admin/organization/users/roles.mjs
var Roles = class extends APIResource {
	/**
	* Assigns an organization role to a user within the organization.
	*
	* @example
	* ```ts
	* const role =
	*   await client.admin.organization.users.roles.create(
	*     'user_id',
	*     { role_id: 'role_id' },
	*   );
	* ```
	*/
	create(userID, body, options) {
		return this._client.post(path$1`/organization/users/${userID}/roles`, {
			body,
			...options,
			__security: { adminAPIKeyAuth: true }
		});
	}
	/**
	* Retrieves an organization role assigned to a user.
	*
	* @example
	* ```ts
	* const role =
	*   await client.admin.organization.users.roles.retrieve(
	*     'role_id',
	*     { user_id: 'user_id' },
	*   );
	* ```
	*/
	retrieve(roleID, params, options) {
		const { user_id } = params;
		return this._client.get(path$1`/organization/users/${user_id}/roles/${roleID}`, {
			...options,
			__security: { adminAPIKeyAuth: true }
		});
	}
	/**
	* Lists the organization roles assigned to a user within the organization.
	*
	* @example
	* ```ts
	* // Automatically fetches more pages as needed.
	* for await (const roleListResponse of client.admin.organization.users.roles.list(
	*   'user_id',
	* )) {
	*   // ...
	* }
	* ```
	*/
	list(userID, query = {}, options) {
		return this._client.getAPIList(path$1`/organization/users/${userID}/roles`, NextCursorPage, {
			query,
			...options,
			__security: { adminAPIKeyAuth: true }
		});
	}
	/**
	* Unassigns an organization role from a user within the organization.
	*
	* @example
	* ```ts
	* const role =
	*   await client.admin.organization.users.roles.delete(
	*     'role_id',
	*     { user_id: 'user_id' },
	*   );
	* ```
	*/
	delete(roleID, params, options) {
		const { user_id } = params;
		return this._client.delete(path$1`/organization/users/${user_id}/roles/${roleID}`, {
			...options,
			__security: { adminAPIKeyAuth: true }
		});
	}
};
//#endregion
//#region node_modules/openai/resources/admin/organization/users/users.mjs
var Users = class extends APIResource {
	constructor() {
		super(...arguments);
		this.roles = new Roles(this._client);
	}
	/**
	* Retrieves a user by their identifier.
	*
	* @example
	* ```ts
	* const organizationUser =
	*   await client.admin.organization.users.retrieve('user_id');
	* ```
	*/
	retrieve(userID, options) {
		return this._client.get(path$1`/organization/users/${userID}`, {
			...options,
			__security: { adminAPIKeyAuth: true }
		});
	}
	/**
	* Modifies a user's role in the organization.
	*
	* @example
	* ```ts
	* const organizationUser =
	*   await client.admin.organization.users.update('user_id');
	* ```
	*/
	update(userID, body, options) {
		return this._client.post(path$1`/organization/users/${userID}`, {
			body,
			...options,
			__security: { adminAPIKeyAuth: true }
		});
	}
	/**
	* Lists all of the users in the organization.
	*
	* @example
	* ```ts
	* // Automatically fetches more pages as needed.
	* for await (const organizationUser of client.admin.organization.users.list()) {
	*   // ...
	* }
	* ```
	*/
	list(query = {}, options) {
		return this._client.getAPIList("/organization/users", ConversationCursorPage, {
			query,
			...options,
			__security: { adminAPIKeyAuth: true }
		});
	}
	/**
	* Deletes a user from the organization.
	*
	* @example
	* ```ts
	* const user = await client.admin.organization.users.delete(
	*   'user_id',
	* );
	* ```
	*/
	delete(userID, options) {
		return this._client.delete(path$1`/organization/users/${userID}`, {
			...options,
			__security: { adminAPIKeyAuth: true }
		});
	}
};
Users.Roles = Roles;
//#endregion
//#region node_modules/openai/resources/admin/organization/organization.mjs
var Organization = class extends APIResource {
	constructor() {
		super(...arguments);
		this.auditLogs = new AuditLogs(this._client);
		this.adminAPIKeys = new AdminAPIKeys(this._client);
		this.usage = new Usage(this._client);
		this.invites = new Invites(this._client);
		this.users = new Users(this._client);
		this.groups = new Groups$1(this._client);
		this.roles = new Roles$5(this._client);
		this.dataRetention = new DataRetention$1(this._client);
		this.spendAlerts = new SpendAlerts$1(this._client);
		this.certificates = new Certificates$1(this._client);
		this.projects = new Projects(this._client);
	}
};
Organization.AuditLogs = AuditLogs;
Organization.AdminAPIKeys = AdminAPIKeys;
Organization.Usage = Usage;
Organization.Invites = Invites;
Organization.Users = Users;
Organization.Groups = Groups$1;
Organization.Roles = Roles$5;
Organization.DataRetention = DataRetention$1;
Organization.SpendAlerts = SpendAlerts$1;
Organization.Certificates = Certificates$1;
Organization.Projects = Projects;
//#endregion
//#region node_modules/openai/resources/admin/admin.mjs
var Admin = class extends APIResource {
	constructor() {
		super(...arguments);
		this.organization = new Organization(this._client);
	}
};
Admin.Organization = Organization;
//#endregion
//#region node_modules/openai/internal/headers.mjs
const brand_privateNullableHeaders = /* @__PURE__ */ Symbol("brand.privateNullableHeaders");
function* iterateHeaders(headers) {
	if (!headers) return;
	if (brand_privateNullableHeaders in headers) {
		const { values, nulls } = headers;
		yield* values.entries();
		for (const name of nulls) yield [name, null];
		return;
	}
	let shouldClear = false;
	let iter;
	if (headers instanceof Headers) iter = headers.entries();
	else if (isReadonlyArray(headers)) iter = headers;
	else {
		shouldClear = true;
		iter = Object.entries(headers ?? {});
	}
	for (let row of iter) {
		const name = row[0];
		if (typeof name !== "string") throw new TypeError("expected header name to be a string");
		const values = isReadonlyArray(row[1]) ? row[1] : [row[1]];
		let didClear = false;
		for (const value of values) {
			if (value === void 0) continue;
			if (shouldClear && !didClear) {
				didClear = true;
				yield [name, null];
			}
			yield [name, value];
		}
	}
}
const buildHeaders = (newHeaders) => {
	const targetHeaders = new Headers();
	const nullHeaders = /* @__PURE__ */ new Set();
	for (const headers of newHeaders) {
		const seenHeaders = /* @__PURE__ */ new Set();
		for (const [name, value] of iterateHeaders(headers)) {
			const lowerName = name.toLowerCase();
			if (!seenHeaders.has(lowerName)) {
				targetHeaders.delete(name);
				seenHeaders.add(lowerName);
			}
			if (value === null) {
				targetHeaders.delete(name);
				nullHeaders.add(lowerName);
			} else {
				targetHeaders.append(name, value);
				nullHeaders.delete(lowerName);
			}
		}
	}
	return {
		[brand_privateNullableHeaders]: true,
		values: targetHeaders,
		nulls: nullHeaders
	};
};
//#endregion
//#region node_modules/openai/resources/audio/speech.mjs
/**
* Turn audio into text or text into audio.
*/
var Speech = class extends APIResource {
	/**
	* Generates audio from the input text.
	*
	* Returns the audio file content, or a stream of audio events.
	*
	* @example
	* ```ts
	* const speech = await client.audio.speech.create({
	*   input: 'input',
	*   model: 'tts-1',
	*   voice: 'alloy',
	* });
	*
	* const content = await speech.blob();
	* console.log(content);
	* ```
	*/
	create(body, options) {
		return this._client.post("/audio/speech", {
			body,
			...options,
			headers: buildHeaders([{ Accept: "application/octet-stream" }, options?.headers]),
			__security: { bearerAuth: true },
			__binaryResponse: true
		});
	}
};
//#endregion
//#region node_modules/openai/resources/audio/transcriptions.mjs
/**
* Turn audio into text or text into audio.
*/
var Transcriptions = class extends APIResource {
	create(body, options) {
		return this._client.post("/audio/transcriptions", multipartFormRequestOptions({
			body,
			...options,
			stream: body.stream ?? false,
			__metadata: { model: body.model },
			__security: { bearerAuth: true }
		}, this._client));
	}
};
//#endregion
//#region node_modules/openai/resources/audio/translations.mjs
/**
* Turn audio into text or text into audio.
*/
var Translations = class extends APIResource {
	create(body, options) {
		return this._client.post("/audio/translations", multipartFormRequestOptions({
			body,
			...options,
			__metadata: { model: body.model },
			__security: { bearerAuth: true }
		}, this._client));
	}
};
//#endregion
//#region node_modules/openai/resources/audio/audio.mjs
var Audio = class extends APIResource {
	constructor() {
		super(...arguments);
		this.transcriptions = new Transcriptions(this._client);
		this.translations = new Translations(this._client);
		this.speech = new Speech(this._client);
	}
};
Audio.Transcriptions = Transcriptions;
Audio.Translations = Translations;
Audio.Speech = Speech;
//#endregion
//#region node_modules/openai/resources/batches.mjs
/**
* Create large batches of API requests to run asynchronously.
*/
var Batches = class extends APIResource {
	/**
	* Creates and executes a batch from an uploaded file of requests
	*/
	create(body, options) {
		return this._client.post("/batches", {
			body,
			...options,
			__security: { bearerAuth: true }
		});
	}
	/**
	* Retrieves a batch.
	*/
	retrieve(batchID, options) {
		return this._client.get(path$1`/batches/${batchID}`, {
			...options,
			__security: { bearerAuth: true }
		});
	}
	/**
	* List your organization's batches.
	*/
	list(query = {}, options) {
		return this._client.getAPIList("/batches", CursorPage, {
			query,
			...options,
			__security: { bearerAuth: true }
		});
	}
	/**
	* Cancels an in-progress batch. The batch will be in status `cancelling` for up to
	* 10 minutes, before changing to `cancelled`, where it will have partial results
	* (if any) available in the output file.
	*/
	cancel(batchID, options) {
		return this._client.post(path$1`/batches/${batchID}/cancel`, {
			...options,
			__security: { bearerAuth: true }
		});
	}
};
//#endregion
//#region node_modules/openai/resources/beta/assistants.mjs
/**
* Build Assistants that can call models and use tools.
*/
var Assistants = class extends APIResource {
	/**
	* Create an assistant with a model and instructions.
	*
	* @deprecated
	*/
	create(body, options) {
		return this._client.post("/assistants", {
			body,
			...options,
			headers: buildHeaders([{ "OpenAI-Beta": "assistants=v2" }, options?.headers]),
			__security: { bearerAuth: true }
		});
	}
	/**
	* Retrieves an assistant.
	*
	* @deprecated
	*/
	retrieve(assistantID, options) {
		return this._client.get(path$1`/assistants/${assistantID}`, {
			...options,
			headers: buildHeaders([{ "OpenAI-Beta": "assistants=v2" }, options?.headers]),
			__security: { bearerAuth: true }
		});
	}
	/**
	* Modifies an assistant.
	*
	* @deprecated
	*/
	update(assistantID, body, options) {
		return this._client.post(path$1`/assistants/${assistantID}`, {
			body,
			...options,
			headers: buildHeaders([{ "OpenAI-Beta": "assistants=v2" }, options?.headers]),
			__security: { bearerAuth: true }
		});
	}
	/**
	* Returns a list of assistants.
	*
	* @deprecated
	*/
	list(query = {}, options) {
		return this._client.getAPIList("/assistants", CursorPage, {
			query,
			...options,
			headers: buildHeaders([{ "OpenAI-Beta": "assistants=v2" }, options?.headers]),
			__security: { bearerAuth: true }
		});
	}
	/**
	* Delete an assistant.
	*
	* @deprecated
	*/
	delete(assistantID, options) {
		return this._client.delete(path$1`/assistants/${assistantID}`, {
			...options,
			headers: buildHeaders([{ "OpenAI-Beta": "assistants=v2" }, options?.headers]),
			__security: { bearerAuth: true }
		});
	}
};
//#endregion
//#region node_modules/openai/resources/beta/realtime/sessions.mjs
var Sessions$1 = class extends APIResource {
	/**
	* Create an ephemeral API token for use in client-side applications with the
	* Realtime API. Can be configured with the same session parameters as the
	* `session.update` client event.
	*
	* It responds with a session object, plus a `client_secret` key which contains a
	* usable ephemeral API token that can be used to authenticate browser clients for
	* the Realtime API.
	*
	* @example
	* ```ts
	* const session =
	*   await client.beta.realtime.sessions.create();
	* ```
	*/
	create(body, options) {
		return this._client.post("/realtime/sessions", {
			body,
			...options,
			headers: buildHeaders([{ "OpenAI-Beta": "assistants=v2" }, options?.headers]),
			__security: { bearerAuth: true }
		});
	}
};
//#endregion
//#region node_modules/openai/resources/beta/realtime/transcription-sessions.mjs
var TranscriptionSessions = class extends APIResource {
	/**
	* Create an ephemeral API token for use in client-side applications with the
	* Realtime API specifically for realtime transcriptions. Can be configured with
	* the same session parameters as the `transcription_session.update` client event.
	*
	* It responds with a session object, plus a `client_secret` key which contains a
	* usable ephemeral API token that can be used to authenticate browser clients for
	* the Realtime API.
	*
	* @example
	* ```ts
	* const transcriptionSession =
	*   await client.beta.realtime.transcriptionSessions.create();
	* ```
	*/
	create(body, options) {
		return this._client.post("/realtime/transcription_sessions", {
			body,
			...options,
			headers: buildHeaders([{ "OpenAI-Beta": "assistants=v2" }, options?.headers]),
			__security: { bearerAuth: true }
		});
	}
};
//#endregion
//#region node_modules/openai/resources/beta/realtime/realtime.mjs
/**
* @deprecated Realtime has now launched and is generally available. The old beta API is now deprecated.
*/
var Realtime$1 = class extends APIResource {
	constructor() {
		super(...arguments);
		this.sessions = new Sessions$1(this._client);
		this.transcriptionSessions = new TranscriptionSessions(this._client);
	}
};
Realtime$1.Sessions = Sessions$1;
Realtime$1.TranscriptionSessions = TranscriptionSessions;
//#endregion
//#region node_modules/openai/resources/beta/chatkit/sessions.mjs
var Sessions = class extends APIResource {
	/**
	* Create a ChatKit session.
	*
	* @example
	* ```ts
	* const chatSession =
	*   await client.beta.chatkit.sessions.create({
	*     user: 'x',
	*     workflow: { id: 'id' },
	*   });
	* ```
	*/
	create(body, options) {
		return this._client.post("/chatkit/sessions", {
			body,
			...options,
			headers: buildHeaders([{ "OpenAI-Beta": "chatkit_beta=v1" }, options?.headers]),
			__security: { bearerAuth: true }
		});
	}
	/**
	* Cancel an active ChatKit session and return its most recent metadata.
	*
	* Cancelling prevents new requests from using the issued client secret.
	*
	* @example
	* ```ts
	* const chatSession =
	*   await client.beta.chatkit.sessions.cancel('cksess_123');
	* ```
	*/
	cancel(sessionID, options) {
		return this._client.post(path$1`/chatkit/sessions/${sessionID}/cancel`, {
			...options,
			headers: buildHeaders([{ "OpenAI-Beta": "chatkit_beta=v1" }, options?.headers]),
			__security: { bearerAuth: true }
		});
	}
};
//#endregion
//#region node_modules/openai/resources/beta/chatkit/threads.mjs
var Threads$1 = class extends APIResource {
	/**
	* Retrieve a ChatKit thread by its identifier.
	*
	* @example
	* ```ts
	* const chatkitThread =
	*   await client.beta.chatkit.threads.retrieve('cthr_123');
	* ```
	*/
	retrieve(threadID, options) {
		return this._client.get(path$1`/chatkit/threads/${threadID}`, {
			...options,
			headers: buildHeaders([{ "OpenAI-Beta": "chatkit_beta=v1" }, options?.headers]),
			__security: { bearerAuth: true }
		});
	}
	/**
	* List ChatKit threads with optional pagination and user filters.
	*
	* @example
	* ```ts
	* // Automatically fetches more pages as needed.
	* for await (const chatkitThread of client.beta.chatkit.threads.list()) {
	*   // ...
	* }
	* ```
	*/
	list(query = {}, options) {
		return this._client.getAPIList("/chatkit/threads", ConversationCursorPage, {
			query,
			...options,
			headers: buildHeaders([{ "OpenAI-Beta": "chatkit_beta=v1" }, options?.headers]),
			__security: { bearerAuth: true }
		});
	}
	/**
	* Delete a ChatKit thread along with its items and stored attachments.
	*
	* @example
	* ```ts
	* const thread = await client.beta.chatkit.threads.delete(
	*   'cthr_123',
	* );
	* ```
	*/
	delete(threadID, options) {
		return this._client.delete(path$1`/chatkit/threads/${threadID}`, {
			...options,
			headers: buildHeaders([{ "OpenAI-Beta": "chatkit_beta=v1" }, options?.headers]),
			__security: { bearerAuth: true }
		});
	}
	/**
	* List items that belong to a ChatKit thread.
	*
	* @example
	* ```ts
	* // Automatically fetches more pages as needed.
	* for await (const thread of client.beta.chatkit.threads.listItems(
	*   'cthr_123',
	* )) {
	*   // ...
	* }
	* ```
	*/
	listItems(threadID, query = {}, options) {
		return this._client.getAPIList(path$1`/chatkit/threads/${threadID}/items`, ConversationCursorPage, {
			query,
			...options,
			headers: buildHeaders([{ "OpenAI-Beta": "chatkit_beta=v1" }, options?.headers]),
			__security: { bearerAuth: true }
		});
	}
};
//#endregion
//#region node_modules/openai/resources/beta/chatkit/chatkit.mjs
var ChatKit = class extends APIResource {
	constructor() {
		super(...arguments);
		this.sessions = new Sessions(this._client);
		this.threads = new Threads$1(this._client);
	}
};
ChatKit.Sessions = Sessions;
ChatKit.Threads = Threads$1;
//#endregion
//#region node_modules/openai/resources/beta/threads/messages.mjs
/**
* Build Assistants that can call models and use tools.
*
* @deprecated The Assistants API is deprecated in favor of the Responses API
*/
var Messages = class extends APIResource {
	/**
	* Create a message.
	*
	* @deprecated The Assistants API is deprecated in favor of the Responses API
	*/
	create(threadID, body, options) {
		return this._client.post(path$1`/threads/${threadID}/messages`, {
			body,
			...options,
			headers: buildHeaders([{ "OpenAI-Beta": "assistants=v2" }, options?.headers]),
			__security: { bearerAuth: true }
		});
	}
	/**
	* Retrieve a message.
	*
	* @deprecated The Assistants API is deprecated in favor of the Responses API
	*/
	retrieve(messageID, params, options) {
		const { thread_id } = params;
		return this._client.get(path$1`/threads/${thread_id}/messages/${messageID}`, {
			...options,
			headers: buildHeaders([{ "OpenAI-Beta": "assistants=v2" }, options?.headers]),
			__security: { bearerAuth: true }
		});
	}
	/**
	* Modifies a message.
	*
	* @deprecated The Assistants API is deprecated in favor of the Responses API
	*/
	update(messageID, params, options) {
		const { thread_id, ...body } = params;
		return this._client.post(path$1`/threads/${thread_id}/messages/${messageID}`, {
			body,
			...options,
			headers: buildHeaders([{ "OpenAI-Beta": "assistants=v2" }, options?.headers]),
			__security: { bearerAuth: true }
		});
	}
	/**
	* Returns a list of messages for a given thread.
	*
	* @deprecated The Assistants API is deprecated in favor of the Responses API
	*/
	list(threadID, query = {}, options) {
		return this._client.getAPIList(path$1`/threads/${threadID}/messages`, CursorPage, {
			query,
			...options,
			headers: buildHeaders([{ "OpenAI-Beta": "assistants=v2" }, options?.headers]),
			__security: { bearerAuth: true }
		});
	}
	/**
	* Deletes a message.
	*
	* @deprecated The Assistants API is deprecated in favor of the Responses API
	*/
	delete(messageID, params, options) {
		const { thread_id } = params;
		return this._client.delete(path$1`/threads/${thread_id}/messages/${messageID}`, {
			...options,
			headers: buildHeaders([{ "OpenAI-Beta": "assistants=v2" }, options?.headers]),
			__security: { bearerAuth: true }
		});
	}
};
//#endregion
//#region node_modules/openai/resources/beta/threads/runs/steps.mjs
/**
* Build Assistants that can call models and use tools.
*
* @deprecated The Assistants API is deprecated in favor of the Responses API
*/
var Steps = class extends APIResource {
	/**
	* Retrieves a run step.
	*
	* @deprecated The Assistants API is deprecated in favor of the Responses API
	*/
	retrieve(stepID, params, options) {
		const { thread_id, run_id, ...query } = params;
		return this._client.get(path$1`/threads/${thread_id}/runs/${run_id}/steps/${stepID}`, {
			query,
			...options,
			headers: buildHeaders([{ "OpenAI-Beta": "assistants=v2" }, options?.headers]),
			__security: { bearerAuth: true }
		});
	}
	/**
	* Returns a list of run steps belonging to a run.
	*
	* @deprecated The Assistants API is deprecated in favor of the Responses API
	*/
	list(runID, params, options) {
		const { thread_id, ...query } = params;
		return this._client.getAPIList(path$1`/threads/${thread_id}/runs/${runID}/steps`, CursorPage, {
			query,
			...options,
			headers: buildHeaders([{ "OpenAI-Beta": "assistants=v2" }, options?.headers]),
			__security: { bearerAuth: true }
		});
	}
};
//#endregion
//#region node_modules/openai/internal/utils/base64.mjs
/**
* Converts a Base64 encoded string to a Float32Array.
* @param base64Str - The Base64 encoded string.
* @returns An Array of numbers interpreted as Float32 values.
*/
const toFloat32Array = (base64Str) => {
	if (typeof Buffer !== "undefined") {
		const buf = Buffer.from(base64Str, "base64");
		return Array.from(new Float32Array(buf.buffer, buf.byteOffset, buf.length / Float32Array.BYTES_PER_ELEMENT));
	} else {
		const binaryStr = atob(base64Str);
		const len = binaryStr.length;
		const bytes = new Uint8Array(len);
		for (let i = 0; i < len; i++) bytes[i] = binaryStr.charCodeAt(i);
		return Array.from(new Float32Array(bytes.buffer));
	}
};
//#endregion
//#region node_modules/openai/internal/utils/env.mjs
/**
* Read an environment variable.
*
* Trims beginning and trailing whitespace.
*
* Will return undefined if the environment variable doesn't exist or cannot be accessed.
*/
const readEnv = (env) => {
	if (typeof globalThis.process !== "undefined") return globalThis.process.env?.[env]?.trim() || void 0;
	if (typeof globalThis.Deno !== "undefined") return globalThis.Deno.env?.get?.(env)?.trim() || void 0;
};
//#endregion
//#region node_modules/openai/lib/AssistantStream.mjs
var _AssistantStream_instances;
var _a$1;
var _AssistantStream_events;
var _AssistantStream_runStepSnapshots;
var _AssistantStream_messageSnapshots;
var _AssistantStream_messageSnapshot;
var _AssistantStream_finalRun;
var _AssistantStream_currentContentIndex;
var _AssistantStream_currentContent;
var _AssistantStream_currentToolCallIndex;
var _AssistantStream_currentToolCall;
var _AssistantStream_currentEvent;
var _AssistantStream_currentRunSnapshot;
var _AssistantStream_currentRunStepSnapshot;
var _AssistantStream_addEvent;
var _AssistantStream_endRequest;
var _AssistantStream_handleMessage;
var _AssistantStream_handleRunStep;
var _AssistantStream_handleEvent;
var _AssistantStream_accumulateRunStep;
var _AssistantStream_accumulateMessage;
var _AssistantStream_accumulateContent;
var _AssistantStream_handleRun;
var AssistantStream = class extends EventStream {
	constructor() {
		super(...arguments);
		_AssistantStream_instances.add(this);
		_AssistantStream_events.set(this, []);
		_AssistantStream_runStepSnapshots.set(this, {});
		_AssistantStream_messageSnapshots.set(this, {});
		_AssistantStream_messageSnapshot.set(this, void 0);
		_AssistantStream_finalRun.set(this, void 0);
		_AssistantStream_currentContentIndex.set(this, void 0);
		_AssistantStream_currentContent.set(this, void 0);
		_AssistantStream_currentToolCallIndex.set(this, void 0);
		_AssistantStream_currentToolCall.set(this, void 0);
		_AssistantStream_currentEvent.set(this, void 0);
		_AssistantStream_currentRunSnapshot.set(this, void 0);
		_AssistantStream_currentRunStepSnapshot.set(this, void 0);
	}
	[(_AssistantStream_events = /* @__PURE__ */ new WeakMap(), _AssistantStream_runStepSnapshots = /* @__PURE__ */ new WeakMap(), _AssistantStream_messageSnapshots = /* @__PURE__ */ new WeakMap(), _AssistantStream_messageSnapshot = /* @__PURE__ */ new WeakMap(), _AssistantStream_finalRun = /* @__PURE__ */ new WeakMap(), _AssistantStream_currentContentIndex = /* @__PURE__ */ new WeakMap(), _AssistantStream_currentContent = /* @__PURE__ */ new WeakMap(), _AssistantStream_currentToolCallIndex = /* @__PURE__ */ new WeakMap(), _AssistantStream_currentToolCall = /* @__PURE__ */ new WeakMap(), _AssistantStream_currentEvent = /* @__PURE__ */ new WeakMap(), _AssistantStream_currentRunSnapshot = /* @__PURE__ */ new WeakMap(), _AssistantStream_currentRunStepSnapshot = /* @__PURE__ */ new WeakMap(), _AssistantStream_instances = /* @__PURE__ */ new WeakSet(), Symbol.asyncIterator)]() {
		const pushQueue = [];
		const readQueue = [];
		let done = false;
		this.on("event", (event) => {
			const reader = readQueue.shift();
			if (reader) reader.resolve(event);
			else pushQueue.push(event);
		});
		this.on("end", () => {
			done = true;
			for (const reader of readQueue) reader.resolve(void 0);
			readQueue.length = 0;
		});
		this.on("abort", (err) => {
			done = true;
			for (const reader of readQueue) reader.reject(err);
			readQueue.length = 0;
		});
		this.on("error", (err) => {
			done = true;
			for (const reader of readQueue) reader.reject(err);
			readQueue.length = 0;
		});
		return {
			next: async () => {
				if (!pushQueue.length) {
					if (done) return {
						value: void 0,
						done: true
					};
					return new Promise((resolve, reject) => readQueue.push({
						resolve,
						reject
					})).then((chunk) => chunk ? {
						value: chunk,
						done: false
					} : {
						value: void 0,
						done: true
					});
				}
				return {
					value: pushQueue.shift(),
					done: false
				};
			},
			return: async () => {
				this.abort();
				return {
					value: void 0,
					done: true
				};
			}
		};
	}
	static fromReadableStream(stream) {
		const runner = new _a$1();
		runner._run(() => runner._fromReadableStream(stream));
		return runner;
	}
	async _fromReadableStream(readableStream, options) {
		this._listenForAbort(options?.signal);
		this._connected();
		const stream = Stream.fromReadableStream(readableStream, this.controller);
		for await (const event of stream) __classPrivateFieldGet(this, _AssistantStream_instances, "m", _AssistantStream_addEvent).call(this, event);
		if (stream.controller.signal?.aborted) throw new APIUserAbortError();
		return this._addRun(__classPrivateFieldGet(this, _AssistantStream_instances, "m", _AssistantStream_endRequest).call(this));
	}
	toReadableStream() {
		return new Stream(this[Symbol.asyncIterator].bind(this), this.controller).toReadableStream();
	}
	static createToolAssistantStream(runId, runs, params, options) {
		const runner = new _a$1();
		runner._run(() => runner._runToolAssistantStream(runId, runs, params, {
			...options,
			headers: {
				...options?.headers,
				"X-Stainless-Helper-Method": "stream"
			}
		}));
		return runner;
	}
	async _createToolAssistantStream(run, runId, params, options) {
		this._listenForAbort(options?.signal);
		const body = {
			...params,
			stream: true
		};
		const stream = await run.submitToolOutputs(runId, body, {
			...options,
			signal: this.controller.signal
		});
		this._connected();
		for await (const event of stream) __classPrivateFieldGet(this, _AssistantStream_instances, "m", _AssistantStream_addEvent).call(this, event);
		if (stream.controller.signal?.aborted) throw new APIUserAbortError();
		return this._addRun(__classPrivateFieldGet(this, _AssistantStream_instances, "m", _AssistantStream_endRequest).call(this));
	}
	static createThreadAssistantStream(params, thread, options) {
		const runner = new _a$1();
		runner._run(() => runner._threadAssistantStream(params, thread, {
			...options,
			headers: {
				...options?.headers,
				"X-Stainless-Helper-Method": "stream"
			}
		}));
		return runner;
	}
	static createAssistantStream(threadId, runs, params, options) {
		const runner = new _a$1();
		runner._run(() => runner._runAssistantStream(threadId, runs, params, {
			...options,
			headers: {
				...options?.headers,
				"X-Stainless-Helper-Method": "stream"
			}
		}));
		return runner;
	}
	currentEvent() {
		return __classPrivateFieldGet(this, _AssistantStream_currentEvent, "f");
	}
	currentRun() {
		return __classPrivateFieldGet(this, _AssistantStream_currentRunSnapshot, "f");
	}
	currentMessageSnapshot() {
		return __classPrivateFieldGet(this, _AssistantStream_messageSnapshot, "f");
	}
	currentRunStepSnapshot() {
		return __classPrivateFieldGet(this, _AssistantStream_currentRunStepSnapshot, "f");
	}
	async finalRunSteps() {
		await this.done();
		return Object.values(__classPrivateFieldGet(this, _AssistantStream_runStepSnapshots, "f"));
	}
	async finalMessages() {
		await this.done();
		return Object.values(__classPrivateFieldGet(this, _AssistantStream_messageSnapshots, "f"));
	}
	async finalRun() {
		await this.done();
		if (!__classPrivateFieldGet(this, _AssistantStream_finalRun, "f")) throw Error("Final run was not received.");
		return __classPrivateFieldGet(this, _AssistantStream_finalRun, "f");
	}
	async _createThreadAssistantStream(thread, params, options) {
		this._listenForAbort(options?.signal);
		const body = {
			...params,
			stream: true
		};
		const stream = await thread.createAndRun(body, {
			...options,
			signal: this.controller.signal
		});
		this._connected();
		for await (const event of stream) __classPrivateFieldGet(this, _AssistantStream_instances, "m", _AssistantStream_addEvent).call(this, event);
		if (stream.controller.signal?.aborted) throw new APIUserAbortError();
		return this._addRun(__classPrivateFieldGet(this, _AssistantStream_instances, "m", _AssistantStream_endRequest).call(this));
	}
	async _createAssistantStream(run, threadId, params, options) {
		this._listenForAbort(options?.signal);
		const body = {
			...params,
			stream: true
		};
		const stream = await run.create(threadId, body, {
			...options,
			signal: this.controller.signal
		});
		this._connected();
		for await (const event of stream) __classPrivateFieldGet(this, _AssistantStream_instances, "m", _AssistantStream_addEvent).call(this, event);
		if (stream.controller.signal?.aborted) throw new APIUserAbortError();
		return this._addRun(__classPrivateFieldGet(this, _AssistantStream_instances, "m", _AssistantStream_endRequest).call(this));
	}
	static accumulateDelta(acc, delta) {
		for (const [key, deltaValue] of Object.entries(delta)) {
			if (!acc.hasOwnProperty(key)) {
				acc[key] = deltaValue;
				continue;
			}
			let accValue = acc[key];
			if (accValue === null || accValue === void 0) {
				acc[key] = deltaValue;
				continue;
			}
			if (key === "index" || key === "type") {
				acc[key] = deltaValue;
				continue;
			}
			if (typeof accValue === "string" && typeof deltaValue === "string") accValue += deltaValue;
			else if (typeof accValue === "number" && typeof deltaValue === "number") accValue += deltaValue;
			else if (isObj(accValue) && isObj(deltaValue)) accValue = this.accumulateDelta(accValue, deltaValue);
			else if (Array.isArray(accValue) && Array.isArray(deltaValue)) {
				if (accValue.every((x) => typeof x === "string" || typeof x === "number")) {
					accValue.push(...deltaValue);
					continue;
				}
				for (const deltaEntry of deltaValue) {
					if (!isObj(deltaEntry)) throw new Error(`Expected array delta entry to be an object but got: ${deltaEntry}`);
					const index = deltaEntry["index"];
					if (index == null) {
						console.error(deltaEntry);
						throw new Error("Expected array delta entry to have an `index` property");
					}
					if (typeof index !== "number") throw new Error(`Expected array delta entry \`index\` property to be a number but got ${index}`);
					const accEntry = accValue[index];
					if (accEntry == null) accValue.push(deltaEntry);
					else accValue[index] = this.accumulateDelta(accEntry, deltaEntry);
				}
				continue;
			} else throw Error(`Unhandled record type: ${key}, deltaValue: ${deltaValue}, accValue: ${accValue}`);
			acc[key] = accValue;
		}
		return acc;
	}
	_addRun(run) {
		return run;
	}
	async _threadAssistantStream(params, thread, options) {
		return await this._createThreadAssistantStream(thread, params, options);
	}
	async _runAssistantStream(threadId, runs, params, options) {
		return await this._createAssistantStream(runs, threadId, params, options);
	}
	async _runToolAssistantStream(runId, runs, params, options) {
		return await this._createToolAssistantStream(runs, runId, params, options);
	}
};
_a$1 = AssistantStream, _AssistantStream_addEvent = function _AssistantStream_addEvent(event) {
	if (this.ended) return;
	__classPrivateFieldSet(this, _AssistantStream_currentEvent, event, "f");
	__classPrivateFieldGet(this, _AssistantStream_instances, "m", _AssistantStream_handleEvent).call(this, event);
	switch (event.event) {
		case "thread.created": break;
		case "thread.run.created":
		case "thread.run.queued":
		case "thread.run.in_progress":
		case "thread.run.requires_action":
		case "thread.run.completed":
		case "thread.run.incomplete":
		case "thread.run.failed":
		case "thread.run.cancelling":
		case "thread.run.cancelled":
		case "thread.run.expired":
			__classPrivateFieldGet(this, _AssistantStream_instances, "m", _AssistantStream_handleRun).call(this, event);
			break;
		case "thread.run.step.created":
		case "thread.run.step.in_progress":
		case "thread.run.step.delta":
		case "thread.run.step.completed":
		case "thread.run.step.failed":
		case "thread.run.step.cancelled":
		case "thread.run.step.expired":
			__classPrivateFieldGet(this, _AssistantStream_instances, "m", _AssistantStream_handleRunStep).call(this, event);
			break;
		case "thread.message.created":
		case "thread.message.in_progress":
		case "thread.message.delta":
		case "thread.message.completed":
		case "thread.message.incomplete":
			__classPrivateFieldGet(this, _AssistantStream_instances, "m", _AssistantStream_handleMessage).call(this, event);
			break;
		case "error": throw new Error("Encountered an error event in event processing - errors should be processed earlier");
		default:
	}
}, _AssistantStream_endRequest = function _AssistantStream_endRequest() {
	if (this.ended) throw new OpenAIError(`stream has ended, this shouldn't happen`);
	if (!__classPrivateFieldGet(this, _AssistantStream_finalRun, "f")) throw Error("Final run has not been received");
	return __classPrivateFieldGet(this, _AssistantStream_finalRun, "f");
}, _AssistantStream_handleMessage = function _AssistantStream_handleMessage(event) {
	const [accumulatedMessage, newContent] = __classPrivateFieldGet(this, _AssistantStream_instances, "m", _AssistantStream_accumulateMessage).call(this, event, __classPrivateFieldGet(this, _AssistantStream_messageSnapshot, "f"));
	__classPrivateFieldSet(this, _AssistantStream_messageSnapshot, accumulatedMessage, "f");
	__classPrivateFieldGet(this, _AssistantStream_messageSnapshots, "f")[accumulatedMessage.id] = accumulatedMessage;
	for (const content of newContent) {
		const snapshotContent = accumulatedMessage.content[content.index];
		if (snapshotContent?.type == "text") this._emit("textCreated", snapshotContent.text);
	}
	switch (event.event) {
		case "thread.message.created":
			this._emit("messageCreated", event.data);
			break;
		case "thread.message.in_progress": break;
		case "thread.message.delta":
			this._emit("messageDelta", event.data.delta, accumulatedMessage);
			if (event.data.delta.content) for (const content of event.data.delta.content) {
				if (content.type == "text" && content.text) {
					let textDelta = content.text;
					let snapshot = accumulatedMessage.content[content.index];
					if (snapshot && snapshot.type == "text") this._emit("textDelta", textDelta, snapshot.text);
					else throw Error("The snapshot associated with this text delta is not text or missing");
				}
				if (content.index != __classPrivateFieldGet(this, _AssistantStream_currentContentIndex, "f")) {
					if (__classPrivateFieldGet(this, _AssistantStream_currentContent, "f")) switch (__classPrivateFieldGet(this, _AssistantStream_currentContent, "f").type) {
						case "text":
							this._emit("textDone", __classPrivateFieldGet(this, _AssistantStream_currentContent, "f").text, __classPrivateFieldGet(this, _AssistantStream_messageSnapshot, "f"));
							break;
						case "image_file":
							this._emit("imageFileDone", __classPrivateFieldGet(this, _AssistantStream_currentContent, "f").image_file, __classPrivateFieldGet(this, _AssistantStream_messageSnapshot, "f"));
							break;
					}
					__classPrivateFieldSet(this, _AssistantStream_currentContentIndex, content.index, "f");
				}
				__classPrivateFieldSet(this, _AssistantStream_currentContent, accumulatedMessage.content[content.index], "f");
			}
			break;
		case "thread.message.completed":
		case "thread.message.incomplete":
			if (__classPrivateFieldGet(this, _AssistantStream_currentContentIndex, "f") !== void 0) {
				const currentContent = event.data.content[__classPrivateFieldGet(this, _AssistantStream_currentContentIndex, "f")];
				if (currentContent) switch (currentContent.type) {
					case "image_file":
						this._emit("imageFileDone", currentContent.image_file, __classPrivateFieldGet(this, _AssistantStream_messageSnapshot, "f"));
						break;
					case "text":
						this._emit("textDone", currentContent.text, __classPrivateFieldGet(this, _AssistantStream_messageSnapshot, "f"));
						break;
				}
			}
			if (__classPrivateFieldGet(this, _AssistantStream_messageSnapshot, "f")) this._emit("messageDone", event.data);
			__classPrivateFieldSet(this, _AssistantStream_messageSnapshot, void 0, "f");
	}
}, _AssistantStream_handleRunStep = function _AssistantStream_handleRunStep(event) {
	const accumulatedRunStep = __classPrivateFieldGet(this, _AssistantStream_instances, "m", _AssistantStream_accumulateRunStep).call(this, event);
	__classPrivateFieldSet(this, _AssistantStream_currentRunStepSnapshot, accumulatedRunStep, "f");
	switch (event.event) {
		case "thread.run.step.created":
			this._emit("runStepCreated", event.data);
			break;
		case "thread.run.step.delta":
			const delta = event.data.delta;
			if (delta.step_details && delta.step_details.type == "tool_calls" && delta.step_details.tool_calls && accumulatedRunStep.step_details.type == "tool_calls") for (const toolCall of delta.step_details.tool_calls) if (toolCall.index == __classPrivateFieldGet(this, _AssistantStream_currentToolCallIndex, "f")) this._emit("toolCallDelta", toolCall, accumulatedRunStep.step_details.tool_calls[toolCall.index]);
			else {
				if (__classPrivateFieldGet(this, _AssistantStream_currentToolCall, "f")) this._emit("toolCallDone", __classPrivateFieldGet(this, _AssistantStream_currentToolCall, "f"));
				__classPrivateFieldSet(this, _AssistantStream_currentToolCallIndex, toolCall.index, "f");
				__classPrivateFieldSet(this, _AssistantStream_currentToolCall, accumulatedRunStep.step_details.tool_calls[toolCall.index], "f");
				if (__classPrivateFieldGet(this, _AssistantStream_currentToolCall, "f")) this._emit("toolCallCreated", __classPrivateFieldGet(this, _AssistantStream_currentToolCall, "f"));
			}
			this._emit("runStepDelta", event.data.delta, accumulatedRunStep);
			break;
		case "thread.run.step.completed":
		case "thread.run.step.failed":
		case "thread.run.step.cancelled":
		case "thread.run.step.expired":
			__classPrivateFieldSet(this, _AssistantStream_currentRunStepSnapshot, void 0, "f");
			if (event.data.step_details.type == "tool_calls") {
				if (__classPrivateFieldGet(this, _AssistantStream_currentToolCall, "f")) {
					this._emit("toolCallDone", __classPrivateFieldGet(this, _AssistantStream_currentToolCall, "f"));
					__classPrivateFieldSet(this, _AssistantStream_currentToolCall, void 0, "f");
				}
			}
			this._emit("runStepDone", event.data, accumulatedRunStep);
			break;
		case "thread.run.step.in_progress": break;
	}
}, _AssistantStream_handleEvent = function _AssistantStream_handleEvent(event) {
	__classPrivateFieldGet(this, _AssistantStream_events, "f").push(event);
	this._emit("event", event);
}, _AssistantStream_accumulateRunStep = function _AssistantStream_accumulateRunStep(event) {
	switch (event.event) {
		case "thread.run.step.created":
			__classPrivateFieldGet(this, _AssistantStream_runStepSnapshots, "f")[event.data.id] = event.data;
			return event.data;
		case "thread.run.step.delta":
			let snapshot = __classPrivateFieldGet(this, _AssistantStream_runStepSnapshots, "f")[event.data.id];
			if (!snapshot) throw Error("Received a RunStepDelta before creation of a snapshot");
			let data = event.data;
			if (data.delta) {
				const accumulated = _a$1.accumulateDelta(snapshot, data.delta);
				__classPrivateFieldGet(this, _AssistantStream_runStepSnapshots, "f")[event.data.id] = accumulated;
			}
			return __classPrivateFieldGet(this, _AssistantStream_runStepSnapshots, "f")[event.data.id];
		case "thread.run.step.completed":
		case "thread.run.step.failed":
		case "thread.run.step.cancelled":
		case "thread.run.step.expired":
		case "thread.run.step.in_progress":
			__classPrivateFieldGet(this, _AssistantStream_runStepSnapshots, "f")[event.data.id] = event.data;
			break;
	}
	if (__classPrivateFieldGet(this, _AssistantStream_runStepSnapshots, "f")[event.data.id]) return __classPrivateFieldGet(this, _AssistantStream_runStepSnapshots, "f")[event.data.id];
	throw new Error("No snapshot available");
}, _AssistantStream_accumulateMessage = function _AssistantStream_accumulateMessage(event, snapshot) {
	let newContent = [];
	switch (event.event) {
		case "thread.message.created": return [event.data, newContent];
		case "thread.message.delta":
			if (!snapshot) throw Error("Received a delta with no existing snapshot (there should be one from message creation)");
			let data = event.data;
			if (data.delta.content) for (const contentElement of data.delta.content) if (contentElement.index in snapshot.content) {
				let currentContent = snapshot.content[contentElement.index];
				snapshot.content[contentElement.index] = __classPrivateFieldGet(this, _AssistantStream_instances, "m", _AssistantStream_accumulateContent).call(this, contentElement, currentContent);
			} else {
				snapshot.content[contentElement.index] = contentElement;
				newContent.push(contentElement);
			}
			return [snapshot, newContent];
		case "thread.message.in_progress":
		case "thread.message.completed":
		case "thread.message.incomplete": if (snapshot) return [snapshot, newContent];
		else throw Error("Received thread message event with no existing snapshot");
	}
	throw Error("Tried to accumulate a non-message event");
}, _AssistantStream_accumulateContent = function _AssistantStream_accumulateContent(contentElement, currentContent) {
	return _a$1.accumulateDelta(currentContent, contentElement);
}, _AssistantStream_handleRun = function _AssistantStream_handleRun(event) {
	__classPrivateFieldSet(this, _AssistantStream_currentRunSnapshot, event.data, "f");
	switch (event.event) {
		case "thread.run.created": break;
		case "thread.run.queued": break;
		case "thread.run.in_progress": break;
		case "thread.run.requires_action":
		case "thread.run.cancelled":
		case "thread.run.failed":
		case "thread.run.completed":
		case "thread.run.expired":
		case "thread.run.incomplete":
			__classPrivateFieldSet(this, _AssistantStream_finalRun, event.data, "f");
			if (__classPrivateFieldGet(this, _AssistantStream_currentToolCall, "f")) {
				this._emit("toolCallDone", __classPrivateFieldGet(this, _AssistantStream_currentToolCall, "f"));
				__classPrivateFieldSet(this, _AssistantStream_currentToolCall, void 0, "f");
			}
			break;
		case "thread.run.cancelling": break;
	}
};
//#endregion
//#region node_modules/openai/resources/beta/threads/runs/runs.mjs
/**
* Build Assistants that can call models and use tools.
*
* @deprecated The Assistants API is deprecated in favor of the Responses API
*/
var Runs$1 = class extends APIResource {
	constructor() {
		super(...arguments);
		this.steps = new Steps(this._client);
	}
	create(threadID, params, options) {
		const { include, ...body } = params;
		return this._client.post(path$1`/threads/${threadID}/runs`, {
			query: { include },
			body,
			...options,
			headers: buildHeaders([{ "OpenAI-Beta": "assistants=v2" }, options?.headers]),
			stream: params.stream ?? false,
			__synthesizeEventData: true,
			__security: { bearerAuth: true }
		});
	}
	/**
	* Retrieves a run.
	*
	* @deprecated The Assistants API is deprecated in favor of the Responses API
	*/
	retrieve(runID, params, options) {
		const { thread_id } = params;
		return this._client.get(path$1`/threads/${thread_id}/runs/${runID}`, {
			...options,
			headers: buildHeaders([{ "OpenAI-Beta": "assistants=v2" }, options?.headers]),
			__security: { bearerAuth: true }
		});
	}
	/**
	* Modifies a run.
	*
	* @deprecated The Assistants API is deprecated in favor of the Responses API
	*/
	update(runID, params, options) {
		const { thread_id, ...body } = params;
		return this._client.post(path$1`/threads/${thread_id}/runs/${runID}`, {
			body,
			...options,
			headers: buildHeaders([{ "OpenAI-Beta": "assistants=v2" }, options?.headers]),
			__security: { bearerAuth: true }
		});
	}
	/**
	* Returns a list of runs belonging to a thread.
	*
	* @deprecated The Assistants API is deprecated in favor of the Responses API
	*/
	list(threadID, query = {}, options) {
		return this._client.getAPIList(path$1`/threads/${threadID}/runs`, CursorPage, {
			query,
			...options,
			headers: buildHeaders([{ "OpenAI-Beta": "assistants=v2" }, options?.headers]),
			__security: { bearerAuth: true }
		});
	}
	/**
	* Cancels a run that is `in_progress`.
	*
	* @deprecated The Assistants API is deprecated in favor of the Responses API
	*/
	cancel(runID, params, options) {
		const { thread_id } = params;
		return this._client.post(path$1`/threads/${thread_id}/runs/${runID}/cancel`, {
			...options,
			headers: buildHeaders([{ "OpenAI-Beta": "assistants=v2" }, options?.headers]),
			__security: { bearerAuth: true }
		});
	}
	/**
	* A helper to create a run an poll for a terminal state. More information on Run
	* lifecycles can be found here:
	* https://platform.openai.com/docs/assistants/how-it-works/runs-and-run-steps
	*/
	async createAndPoll(threadId, body, options) {
		const run = await this.create(threadId, body, options);
		return await this.poll(run.id, { thread_id: threadId }, options);
	}
	/**
	* Create a Run stream
	*
	* @deprecated use `stream` instead
	*/
	createAndStream(threadId, body, options) {
		return AssistantStream.createAssistantStream(threadId, this._client.beta.threads.runs, body, options);
	}
	/**
	* A helper to poll a run status until it reaches a terminal state. More
	* information on Run lifecycles can be found here:
	* https://platform.openai.com/docs/assistants/how-it-works/runs-and-run-steps
	*/
	async poll(runId, params, options) {
		const headers = buildHeaders([options?.headers, {
			"X-Stainless-Poll-Helper": "true",
			"X-Stainless-Custom-Poll-Interval": options?.pollIntervalMs?.toString() ?? void 0
		}]);
		while (true) {
			const { data: run, response } = await this.retrieve(runId, params, {
				...options,
				headers: {
					...options?.headers,
					...headers
				}
			}).withResponse();
			switch (run.status) {
				case "queued":
				case "in_progress":
				case "cancelling":
					let sleepInterval = 5e3;
					if (options?.pollIntervalMs) sleepInterval = options.pollIntervalMs;
					else {
						const headerInterval = response.headers.get("openai-poll-after-ms");
						if (headerInterval) {
							const headerIntervalMs = parseInt(headerInterval);
							if (!isNaN(headerIntervalMs)) sleepInterval = headerIntervalMs;
						}
					}
					await sleep(sleepInterval);
					break;
				case "requires_action":
				case "incomplete":
				case "cancelled":
				case "completed":
				case "failed":
				case "expired": return run;
			}
		}
	}
	/**
	* Create a Run stream
	*/
	stream(threadId, body, options) {
		return AssistantStream.createAssistantStream(threadId, this._client.beta.threads.runs, body, options);
	}
	submitToolOutputs(runID, params, options) {
		const { thread_id, ...body } = params;
		return this._client.post(path$1`/threads/${thread_id}/runs/${runID}/submit_tool_outputs`, {
			body,
			...options,
			headers: buildHeaders([{ "OpenAI-Beta": "assistants=v2" }, options?.headers]),
			stream: params.stream ?? false,
			__synthesizeEventData: true,
			__security: { bearerAuth: true }
		});
	}
	/**
	* A helper to submit a tool output to a run and poll for a terminal run state.
	* More information on Run lifecycles can be found here:
	* https://platform.openai.com/docs/assistants/how-it-works/runs-and-run-steps
	*/
	async submitToolOutputsAndPoll(runId, params, options) {
		const run = await this.submitToolOutputs(runId, params, options);
		return await this.poll(run.id, params, options);
	}
	/**
	* Submit the tool outputs from a previous run and stream the run to a terminal
	* state. More information on Run lifecycles can be found here:
	* https://platform.openai.com/docs/assistants/how-it-works/runs-and-run-steps
	*/
	submitToolOutputsStream(runId, params, options) {
		return AssistantStream.createToolAssistantStream(runId, this._client.beta.threads.runs, params, options);
	}
};
Runs$1.Steps = Steps;
//#endregion
//#region node_modules/openai/resources/beta/threads/threads.mjs
/**
* Build Assistants that can call models and use tools.
*
* @deprecated The Assistants API is deprecated in favor of the Responses API
*/
var Threads = class extends APIResource {
	constructor() {
		super(...arguments);
		this.runs = new Runs$1(this._client);
		this.messages = new Messages(this._client);
	}
	/**
	* Create a thread.
	*
	* @deprecated The Assistants API is deprecated in favor of the Responses API
	*/
	create(body = {}, options) {
		return this._client.post("/threads", {
			body,
			...options,
			headers: buildHeaders([{ "OpenAI-Beta": "assistants=v2" }, options?.headers]),
			__security: { bearerAuth: true }
		});
	}
	/**
	* Retrieves a thread.
	*
	* @deprecated The Assistants API is deprecated in favor of the Responses API
	*/
	retrieve(threadID, options) {
		return this._client.get(path$1`/threads/${threadID}`, {
			...options,
			headers: buildHeaders([{ "OpenAI-Beta": "assistants=v2" }, options?.headers]),
			__security: { bearerAuth: true }
		});
	}
	/**
	* Modifies a thread.
	*
	* @deprecated The Assistants API is deprecated in favor of the Responses API
	*/
	update(threadID, body, options) {
		return this._client.post(path$1`/threads/${threadID}`, {
			body,
			...options,
			headers: buildHeaders([{ "OpenAI-Beta": "assistants=v2" }, options?.headers]),
			__security: { bearerAuth: true }
		});
	}
	/**
	* Delete a thread.
	*
	* @deprecated The Assistants API is deprecated in favor of the Responses API
	*/
	delete(threadID, options) {
		return this._client.delete(path$1`/threads/${threadID}`, {
			...options,
			headers: buildHeaders([{ "OpenAI-Beta": "assistants=v2" }, options?.headers]),
			__security: { bearerAuth: true }
		});
	}
	createAndRun(body, options) {
		return this._client.post("/threads/runs", {
			body,
			...options,
			headers: buildHeaders([{ "OpenAI-Beta": "assistants=v2" }, options?.headers]),
			stream: body.stream ?? false,
			__synthesizeEventData: true,
			__security: { bearerAuth: true }
		});
	}
	/**
	* A helper to create a thread, start a run and then poll for a terminal state.
	* More information on Run lifecycles can be found here:
	* https://platform.openai.com/docs/assistants/how-it-works/runs-and-run-steps
	*/
	async createAndRunPoll(body, options) {
		const run = await this.createAndRun(body, options);
		return await this.runs.poll(run.id, { thread_id: run.thread_id }, options);
	}
	/**
	* Create a thread and stream the run back
	*/
	createAndRunStream(body, options) {
		return AssistantStream.createThreadAssistantStream(body, this._client.beta.threads, options);
	}
};
Threads.Runs = Runs$1;
Threads.Messages = Messages;
//#endregion
//#region node_modules/openai/resources/beta/beta.mjs
var Beta = class extends APIResource {
	constructor() {
		super(...arguments);
		this.realtime = new Realtime$1(this._client);
		this.chatkit = new ChatKit(this._client);
		this.assistants = new Assistants(this._client);
		this.threads = new Threads(this._client);
	}
};
Beta.Realtime = Realtime$1;
Beta.ChatKit = ChatKit;
Beta.Assistants = Assistants;
Beta.Threads = Threads;
//#endregion
//#region node_modules/openai/resources/completions.mjs
/**
* Given a prompt, the model will return one or more predicted completions, and can also return the probabilities of alternative tokens at each position.
*/
var Completions = class extends APIResource {
	create(body, options) {
		return this._client.post("/completions", {
			body,
			...options,
			stream: body.stream ?? false,
			__security: { bearerAuth: true }
		});
	}
};
//#endregion
//#region node_modules/openai/resources/containers/files/content.mjs
var Content$2 = class extends APIResource {
	/**
	* Retrieve Container File Content
	*/
	retrieve(fileID, params, options) {
		const { container_id } = params;
		return this._client.get(path$1`/containers/${container_id}/files/${fileID}/content`, {
			...options,
			headers: buildHeaders([{ Accept: "application/binary" }, options?.headers]),
			__security: { bearerAuth: true },
			__binaryResponse: true
		});
	}
};
//#endregion
//#region node_modules/openai/resources/containers/files/files.mjs
var Files$2 = class extends APIResource {
	constructor() {
		super(...arguments);
		this.content = new Content$2(this._client);
	}
	/**
	* Create a Container File
	*
	* You can send either a multipart/form-data request with the raw file content, or
	* a JSON request with a file ID.
	*/
	create(containerID, body, options) {
		return this._client.post(path$1`/containers/${containerID}/files`, maybeMultipartFormRequestOptions({
			body,
			...options,
			__security: { bearerAuth: true }
		}, this._client));
	}
	/**
	* Retrieve Container File
	*/
	retrieve(fileID, params, options) {
		const { container_id } = params;
		return this._client.get(path$1`/containers/${container_id}/files/${fileID}`, {
			...options,
			__security: { bearerAuth: true }
		});
	}
	/**
	* List Container files
	*/
	list(containerID, query = {}, options) {
		return this._client.getAPIList(path$1`/containers/${containerID}/files`, CursorPage, {
			query,
			...options,
			__security: { bearerAuth: true }
		});
	}
	/**
	* Delete Container File
	*/
	delete(fileID, params, options) {
		const { container_id } = params;
		return this._client.delete(path$1`/containers/${container_id}/files/${fileID}`, {
			...options,
			headers: buildHeaders([{ Accept: "*/*" }, options?.headers]),
			__security: { bearerAuth: true }
		});
	}
};
Files$2.Content = Content$2;
//#endregion
//#region node_modules/openai/resources/containers/containers.mjs
var Containers = class extends APIResource {
	constructor() {
		super(...arguments);
		this.files = new Files$2(this._client);
	}
	/**
	* Create Container
	*/
	create(body, options) {
		return this._client.post("/containers", {
			body,
			...options,
			__security: { bearerAuth: true }
		});
	}
	/**
	* Retrieve Container
	*/
	retrieve(containerID, options) {
		return this._client.get(path$1`/containers/${containerID}`, {
			...options,
			__security: { bearerAuth: true }
		});
	}
	/**
	* List Containers
	*/
	list(query = {}, options) {
		return this._client.getAPIList("/containers", CursorPage, {
			query,
			...options,
			__security: { bearerAuth: true }
		});
	}
	/**
	* Delete Container
	*/
	delete(containerID, options) {
		return this._client.delete(path$1`/containers/${containerID}`, {
			...options,
			headers: buildHeaders([{ Accept: "*/*" }, options?.headers]),
			__security: { bearerAuth: true }
		});
	}
};
Containers.Files = Files$2;
//#endregion
//#region node_modules/openai/resources/conversations/items.mjs
/**
* Manage conversations and conversation items.
*/
var Items = class extends APIResource {
	/**
	* Create items in a conversation with the given ID.
	*/
	create(conversationID, params, options) {
		const { include, ...body } = params;
		return this._client.post(path$1`/conversations/${conversationID}/items`, {
			query: { include },
			body,
			...options,
			__security: { bearerAuth: true }
		});
	}
	/**
	* Get a single item from a conversation with the given IDs.
	*/
	retrieve(itemID, params, options) {
		const { conversation_id, ...query } = params;
		return this._client.get(path$1`/conversations/${conversation_id}/items/${itemID}`, {
			query,
			...options,
			__security: { bearerAuth: true }
		});
	}
	/**
	* List all items for a conversation with the given ID.
	*/
	list(conversationID, query = {}, options) {
		return this._client.getAPIList(path$1`/conversations/${conversationID}/items`, ConversationCursorPage, {
			query,
			...options,
			__security: { bearerAuth: true }
		});
	}
	/**
	* Delete an item from a conversation with the given IDs.
	*/
	delete(itemID, params, options) {
		const { conversation_id } = params;
		return this._client.delete(path$1`/conversations/${conversation_id}/items/${itemID}`, {
			...options,
			__security: { bearerAuth: true }
		});
	}
};
//#endregion
//#region node_modules/openai/resources/conversations/conversations.mjs
/**
* Manage conversations and conversation items.
*/
var Conversations = class extends APIResource {
	constructor() {
		super(...arguments);
		this.items = new Items(this._client);
	}
	/**
	* Create a conversation.
	*/
	create(body = {}, options) {
		return this._client.post("/conversations", {
			body,
			...options,
			__security: { bearerAuth: true }
		});
	}
	/**
	* Get a conversation
	*/
	retrieve(conversationID, options) {
		return this._client.get(path$1`/conversations/${conversationID}`, {
			...options,
			__security: { bearerAuth: true }
		});
	}
	/**
	* Update a conversation
	*/
	update(conversationID, body, options) {
		return this._client.post(path$1`/conversations/${conversationID}`, {
			body,
			...options,
			__security: { bearerAuth: true }
		});
	}
	/**
	* Delete a conversation. Items in the conversation will not be deleted.
	*/
	delete(conversationID, options) {
		return this._client.delete(path$1`/conversations/${conversationID}`, {
			...options,
			__security: { bearerAuth: true }
		});
	}
};
Conversations.Items = Items;
//#endregion
//#region node_modules/openai/resources/embeddings.mjs
/**
* Get a vector representation of a given input that can be easily consumed by machine learning models and algorithms.
*/
var Embeddings = class extends APIResource {
	/**
	* Creates an embedding vector representing the input text.
	*
	* @example
	* ```ts
	* const createEmbeddingResponse =
	*   await client.embeddings.create({
	*     input: 'The quick brown fox jumped over the lazy dog',
	*     model: 'text-embedding-3-small',
	*   });
	* ```
	*/
	create(body, options) {
		const hasUserProvidedEncodingFormat = !!body.encoding_format;
		let encoding_format = hasUserProvidedEncodingFormat ? body.encoding_format : "base64";
		if (hasUserProvidedEncodingFormat) loggerFor(this._client).debug("embeddings/user defined encoding_format:", body.encoding_format);
		const response = this._client.post("/embeddings", {
			body: {
				...body,
				encoding_format
			},
			...options,
			__security: { bearerAuth: true }
		});
		if (hasUserProvidedEncodingFormat) return response;
		loggerFor(this._client).debug("embeddings/decoding base64 embeddings from base64");
		return response._thenUnwrap((response) => {
			if (response && response.data) response.data.forEach((embeddingBase64Obj) => {
				const embeddingBase64Str = embeddingBase64Obj.embedding;
				embeddingBase64Obj.embedding = toFloat32Array(embeddingBase64Str);
			});
			return response;
		});
	}
};
//#endregion
//#region node_modules/openai/resources/evals/runs/output-items.mjs
/**
* Manage and run evals in the OpenAI platform.
*/
var OutputItems = class extends APIResource {
	/**
	* Get an evaluation run output item by ID.
	*/
	retrieve(outputItemID, params, options) {
		const { eval_id, run_id } = params;
		return this._client.get(path$1`/evals/${eval_id}/runs/${run_id}/output_items/${outputItemID}`, {
			...options,
			__security: { bearerAuth: true }
		});
	}
	/**
	* Get a list of output items for an evaluation run.
	*/
	list(runID, params, options) {
		const { eval_id, ...query } = params;
		return this._client.getAPIList(path$1`/evals/${eval_id}/runs/${runID}/output_items`, CursorPage, {
			query,
			...options,
			__security: { bearerAuth: true }
		});
	}
};
//#endregion
//#region node_modules/openai/resources/evals/runs/runs.mjs
/**
* Manage and run evals in the OpenAI platform.
*/
var Runs = class extends APIResource {
	constructor() {
		super(...arguments);
		this.outputItems = new OutputItems(this._client);
	}
	/**
	* Kicks off a new run for a given evaluation, specifying the data source, and what
	* model configuration to use to test. The datasource will be validated against the
	* schema specified in the config of the evaluation.
	*/
	create(evalID, body, options) {
		return this._client.post(path$1`/evals/${evalID}/runs`, {
			body,
			...options,
			__security: { bearerAuth: true }
		});
	}
	/**
	* Get an evaluation run by ID.
	*/
	retrieve(runID, params, options) {
		const { eval_id } = params;
		return this._client.get(path$1`/evals/${eval_id}/runs/${runID}`, {
			...options,
			__security: { bearerAuth: true }
		});
	}
	/**
	* Get a list of runs for an evaluation.
	*/
	list(evalID, query = {}, options) {
		return this._client.getAPIList(path$1`/evals/${evalID}/runs`, CursorPage, {
			query,
			...options,
			__security: { bearerAuth: true }
		});
	}
	/**
	* Delete an eval run.
	*/
	delete(runID, params, options) {
		const { eval_id } = params;
		return this._client.delete(path$1`/evals/${eval_id}/runs/${runID}`, {
			...options,
			__security: { bearerAuth: true }
		});
	}
	/**
	* Cancel an ongoing evaluation run.
	*/
	cancel(runID, params, options) {
		const { eval_id } = params;
		return this._client.post(path$1`/evals/${eval_id}/runs/${runID}`, {
			...options,
			__security: { bearerAuth: true }
		});
	}
};
Runs.OutputItems = OutputItems;
//#endregion
//#region node_modules/openai/resources/evals/evals.mjs
/**
* Manage and run evals in the OpenAI platform.
*/
var Evals = class extends APIResource {
	constructor() {
		super(...arguments);
		this.runs = new Runs(this._client);
	}
	/**
	* Create the structure of an evaluation that can be used to test a model's
	* performance. An evaluation is a set of testing criteria and the config for a
	* data source, which dictates the schema of the data used in the evaluation. After
	* creating an evaluation, you can run it on different models and model parameters.
	* We support several types of graders and datasources. For more information, see
	* the [Evals guide](https://platform.openai.com/docs/guides/evals).
	*/
	create(body, options) {
		return this._client.post("/evals", {
			body,
			...options,
			__security: { bearerAuth: true }
		});
	}
	/**
	* Get an evaluation by ID.
	*/
	retrieve(evalID, options) {
		return this._client.get(path$1`/evals/${evalID}`, {
			...options,
			__security: { bearerAuth: true }
		});
	}
	/**
	* Update certain properties of an evaluation.
	*/
	update(evalID, body, options) {
		return this._client.post(path$1`/evals/${evalID}`, {
			body,
			...options,
			__security: { bearerAuth: true }
		});
	}
	/**
	* List evaluations for a project.
	*/
	list(query = {}, options) {
		return this._client.getAPIList("/evals", CursorPage, {
			query,
			...options,
			__security: { bearerAuth: true }
		});
	}
	/**
	* Delete an evaluation.
	*/
	delete(evalID, options) {
		return this._client.delete(path$1`/evals/${evalID}`, {
			...options,
			__security: { bearerAuth: true }
		});
	}
};
Evals.Runs = Runs;
//#endregion
//#region node_modules/openai/resources/files.mjs
/**
* Files are used to upload documents that can be used with features like Assistants and Fine-tuning.
*/
var Files$1 = class extends APIResource {
	/**
	* Upload a file that can be used across various endpoints. Individual files can be
	* up to 512 MB, and each project can store up to 2.5 TB of files in total. There
	* is no organization-wide storage limit. Uploads to this endpoint are rate-limited
	* to 1,000 requests per minute per authenticated user.
	*
	* - The Assistants API supports files up to 2 million tokens and of specific file
	*   types. See the
	*   [Assistants Tools guide](https://platform.openai.com/docs/assistants/tools)
	*   for details.
	* - The Fine-tuning API only supports `.jsonl` files. The input also has certain
	*   required formats for fine-tuning
	*   [chat](https://platform.openai.com/docs/api-reference/fine-tuning/chat-input)
	*   or
	*   [completions](https://platform.openai.com/docs/api-reference/fine-tuning/completions-input)
	*   models.
	* - The Batch API only supports `.jsonl` files up to 200 MB in size. The input
	*   also has a specific required
	*   [format](https://platform.openai.com/docs/api-reference/batch/request-input).
	* - For Retrieval or `file_search` ingestion, upload files here first. If you need
	*   to attach multiple uploaded files to the same vector store, use
	*   [`/vector_stores/{vector_store_id}/file_batches`](https://platform.openai.com/docs/api-reference/vector-stores-file-batches/createBatch)
	*   instead of attaching them one by one. Vector store attachment has separate
	*   limits from file upload, including 2,000 attached files per minute per
	*   organization.
	*
	* Please [contact us](https://help.openai.com/) if you need to increase these
	* storage limits.
	*/
	create(body, options) {
		return this._client.post("/files", multipartFormRequestOptions({
			body,
			...options,
			__security: { bearerAuth: true }
		}, this._client));
	}
	/**
	* Returns information about a specific file.
	*/
	retrieve(fileID, options) {
		return this._client.get(path$1`/files/${fileID}`, {
			...options,
			__security: { bearerAuth: true }
		});
	}
	/**
	* Returns a list of files.
	*/
	list(query = {}, options) {
		return this._client.getAPIList("/files", CursorPage, {
			query,
			...options,
			__security: { bearerAuth: true }
		});
	}
	/**
	* Delete a file and remove it from all vector stores.
	*/
	delete(fileID, options) {
		return this._client.delete(path$1`/files/${fileID}`, {
			...options,
			__security: { bearerAuth: true }
		});
	}
	/**
	* Returns the contents of the specified file.
	*/
	content(fileID, options) {
		return this._client.get(path$1`/files/${fileID}/content`, {
			...options,
			headers: buildHeaders([{ Accept: "application/binary" }, options?.headers]),
			__security: { bearerAuth: true },
			__binaryResponse: true
		});
	}
	/**
	* Waits for the given file to be processed, default timeout is 30 mins.
	*/
	async waitForProcessing(id, { pollInterval = 5e3, maxWait = 1800 * 1e3 } = {}) {
		const TERMINAL_STATES = /* @__PURE__ */ new Set([
			"processed",
			"error",
			"deleted"
		]);
		const start = Date.now();
		let file = await this.retrieve(id);
		while (!file.status || !TERMINAL_STATES.has(file.status)) {
			await sleep(pollInterval);
			file = await this.retrieve(id);
			if (Date.now() - start > maxWait) throw new APIConnectionTimeoutError({ message: `Giving up on waiting for file ${id} to finish processing after ${maxWait} milliseconds.` });
		}
		return file;
	}
};
//#endregion
//#region node_modules/openai/resources/fine-tuning/methods.mjs
var Methods = class extends APIResource {};
//#endregion
//#region node_modules/openai/resources/fine-tuning/alpha/graders.mjs
/**
* Manage fine-tuning jobs to tailor a model to your specific training data.
*/
var Graders$1 = class extends APIResource {
	/**
	* Run a grader.
	*
	* @example
	* ```ts
	* const response = await client.fineTuning.alpha.graders.run({
	*   grader: {
	*     input: 'input',
	*     name: 'name',
	*     operation: 'eq',
	*     reference: 'reference',
	*     type: 'string_check',
	*   },
	*   model_sample: 'model_sample',
	* });
	* ```
	*/
	run(body, options) {
		return this._client.post("/fine_tuning/alpha/graders/run", {
			body,
			...options,
			__security: { bearerAuth: true }
		});
	}
	/**
	* Validate a grader.
	*
	* @example
	* ```ts
	* const response =
	*   await client.fineTuning.alpha.graders.validate({
	*     grader: {
	*       input: 'input',
	*       name: 'name',
	*       operation: 'eq',
	*       reference: 'reference',
	*       type: 'string_check',
	*     },
	*   });
	* ```
	*/
	validate(body, options) {
		return this._client.post("/fine_tuning/alpha/graders/validate", {
			body,
			...options,
			__security: { bearerAuth: true }
		});
	}
};
//#endregion
//#region node_modules/openai/resources/fine-tuning/alpha/alpha.mjs
var Alpha = class extends APIResource {
	constructor() {
		super(...arguments);
		this.graders = new Graders$1(this._client);
	}
};
Alpha.Graders = Graders$1;
//#endregion
//#region node_modules/openai/resources/fine-tuning/checkpoints/permissions.mjs
/**
* Manage fine-tuning jobs to tailor a model to your specific training data.
*/
var Permissions = class extends APIResource {
	/**
	* **NOTE:** Calling this endpoint requires an [admin API key](../admin-api-keys).
	*
	* This enables organization owners to share fine-tuned models with other projects
	* in their organization.
	*
	* @example
	* ```ts
	* // Automatically fetches more pages as needed.
	* for await (const permissionCreateResponse of client.fineTuning.checkpoints.permissions.create(
	*   'ft:gpt-4o-mini-2024-07-18:org:weather:B7R9VjQd',
	*   { project_ids: ['string'] },
	* )) {
	*   // ...
	* }
	* ```
	*/
	create(fineTunedModelCheckpoint, body, options) {
		return this._client.getAPIList(path$1`/fine_tuning/checkpoints/${fineTunedModelCheckpoint}/permissions`, Page, {
			body,
			method: "post",
			...options,
			__security: { adminAPIKeyAuth: true }
		});
	}
	/**
	* **NOTE:** This endpoint requires an [admin API key](../admin-api-keys).
	*
	* Organization owners can use this endpoint to view all permissions for a
	* fine-tuned model checkpoint.
	*
	* @deprecated Retrieve is deprecated. Please swap to the paginated list method instead.
	*/
	retrieve(fineTunedModelCheckpoint, query = {}, options) {
		return this._client.get(path$1`/fine_tuning/checkpoints/${fineTunedModelCheckpoint}/permissions`, {
			query,
			...options,
			__security: { adminAPIKeyAuth: true }
		});
	}
	/**
	* **NOTE:** This endpoint requires an [admin API key](../admin-api-keys).
	*
	* Organization owners can use this endpoint to view all permissions for a
	* fine-tuned model checkpoint.
	*
	* @example
	* ```ts
	* // Automatically fetches more pages as needed.
	* for await (const permissionListResponse of client.fineTuning.checkpoints.permissions.list(
	*   'ft-AF1WoRqd3aJAHsqc9NY7iL8F',
	* )) {
	*   // ...
	* }
	* ```
	*/
	list(fineTunedModelCheckpoint, query = {}, options) {
		return this._client.getAPIList(path$1`/fine_tuning/checkpoints/${fineTunedModelCheckpoint}/permissions`, ConversationCursorPage, {
			query,
			...options,
			__security: { adminAPIKeyAuth: true }
		});
	}
	/**
	* **NOTE:** This endpoint requires an [admin API key](../admin-api-keys).
	*
	* Organization owners can use this endpoint to delete a permission for a
	* fine-tuned model checkpoint.
	*
	* @example
	* ```ts
	* const permission =
	*   await client.fineTuning.checkpoints.permissions.delete(
	*     'cp_zc4Q7MP6XxulcVzj4MZdwsAB',
	*     {
	*       fine_tuned_model_checkpoint:
	*         'ft:gpt-4o-mini-2024-07-18:org:weather:B7R9VjQd',
	*     },
	*   );
	* ```
	*/
	delete(permissionID, params, options) {
		const { fine_tuned_model_checkpoint } = params;
		return this._client.delete(path$1`/fine_tuning/checkpoints/${fine_tuned_model_checkpoint}/permissions/${permissionID}`, {
			...options,
			__security: { adminAPIKeyAuth: true }
		});
	}
};
//#endregion
//#region node_modules/openai/resources/fine-tuning/checkpoints/checkpoints.mjs
var Checkpoints$1 = class extends APIResource {
	constructor() {
		super(...arguments);
		this.permissions = new Permissions(this._client);
	}
};
Checkpoints$1.Permissions = Permissions;
//#endregion
//#region node_modules/openai/resources/fine-tuning/jobs/checkpoints.mjs
/**
* Manage fine-tuning jobs to tailor a model to your specific training data.
*/
var Checkpoints = class extends APIResource {
	/**
	* List checkpoints for a fine-tuning job.
	*
	* @example
	* ```ts
	* // Automatically fetches more pages as needed.
	* for await (const fineTuningJobCheckpoint of client.fineTuning.jobs.checkpoints.list(
	*   'ft-AF1WoRqd3aJAHsqc9NY7iL8F',
	* )) {
	*   // ...
	* }
	* ```
	*/
	list(fineTuningJobID, query = {}, options) {
		return this._client.getAPIList(path$1`/fine_tuning/jobs/${fineTuningJobID}/checkpoints`, CursorPage, {
			query,
			...options,
			__security: { bearerAuth: true }
		});
	}
};
//#endregion
//#region node_modules/openai/resources/fine-tuning/jobs/jobs.mjs
/**
* Manage fine-tuning jobs to tailor a model to your specific training data.
*/
var Jobs = class extends APIResource {
	constructor() {
		super(...arguments);
		this.checkpoints = new Checkpoints(this._client);
	}
	/**
	* Creates a fine-tuning job which begins the process of creating a new model from
	* a given dataset.
	*
	* Response includes details of the enqueued job including job status and the name
	* of the fine-tuned models once complete.
	*
	* [Learn more about fine-tuning](https://platform.openai.com/docs/guides/model-optimization)
	*
	* @example
	* ```ts
	* const fineTuningJob = await client.fineTuning.jobs.create({
	*   model: 'gpt-4o-mini',
	*   training_file: 'file-abc123',
	* });
	* ```
	*/
	create(body, options) {
		return this._client.post("/fine_tuning/jobs", {
			body,
			...options,
			__security: { bearerAuth: true }
		});
	}
	/**
	* Get info about a fine-tuning job.
	*
	* [Learn more about fine-tuning](https://platform.openai.com/docs/guides/model-optimization)
	*
	* @example
	* ```ts
	* const fineTuningJob = await client.fineTuning.jobs.retrieve(
	*   'ft-AF1WoRqd3aJAHsqc9NY7iL8F',
	* );
	* ```
	*/
	retrieve(fineTuningJobID, options) {
		return this._client.get(path$1`/fine_tuning/jobs/${fineTuningJobID}`, {
			...options,
			__security: { bearerAuth: true }
		});
	}
	/**
	* List your organization's fine-tuning jobs
	*
	* @example
	* ```ts
	* // Automatically fetches more pages as needed.
	* for await (const fineTuningJob of client.fineTuning.jobs.list()) {
	*   // ...
	* }
	* ```
	*/
	list(query = {}, options) {
		return this._client.getAPIList("/fine_tuning/jobs", CursorPage, {
			query,
			...options,
			__security: { bearerAuth: true }
		});
	}
	/**
	* Immediately cancel a fine-tune job.
	*
	* @example
	* ```ts
	* const fineTuningJob = await client.fineTuning.jobs.cancel(
	*   'ft-AF1WoRqd3aJAHsqc9NY7iL8F',
	* );
	* ```
	*/
	cancel(fineTuningJobID, options) {
		return this._client.post(path$1`/fine_tuning/jobs/${fineTuningJobID}/cancel`, {
			...options,
			__security: { bearerAuth: true }
		});
	}
	/**
	* Get status updates for a fine-tuning job.
	*
	* @example
	* ```ts
	* // Automatically fetches more pages as needed.
	* for await (const fineTuningJobEvent of client.fineTuning.jobs.listEvents(
	*   'ft-AF1WoRqd3aJAHsqc9NY7iL8F',
	* )) {
	*   // ...
	* }
	* ```
	*/
	listEvents(fineTuningJobID, query = {}, options) {
		return this._client.getAPIList(path$1`/fine_tuning/jobs/${fineTuningJobID}/events`, CursorPage, {
			query,
			...options,
			__security: { bearerAuth: true }
		});
	}
	/**
	* Pause a fine-tune job.
	*
	* @example
	* ```ts
	* const fineTuningJob = await client.fineTuning.jobs.pause(
	*   'ft-AF1WoRqd3aJAHsqc9NY7iL8F',
	* );
	* ```
	*/
	pause(fineTuningJobID, options) {
		return this._client.post(path$1`/fine_tuning/jobs/${fineTuningJobID}/pause`, {
			...options,
			__security: { bearerAuth: true }
		});
	}
	/**
	* Resume a fine-tune job.
	*
	* @example
	* ```ts
	* const fineTuningJob = await client.fineTuning.jobs.resume(
	*   'ft-AF1WoRqd3aJAHsqc9NY7iL8F',
	* );
	* ```
	*/
	resume(fineTuningJobID, options) {
		return this._client.post(path$1`/fine_tuning/jobs/${fineTuningJobID}/resume`, {
			...options,
			__security: { bearerAuth: true }
		});
	}
};
Jobs.Checkpoints = Checkpoints;
//#endregion
//#region node_modules/openai/resources/fine-tuning/fine-tuning.mjs
var FineTuning = class extends APIResource {
	constructor() {
		super(...arguments);
		this.methods = new Methods(this._client);
		this.jobs = new Jobs(this._client);
		this.checkpoints = new Checkpoints$1(this._client);
		this.alpha = new Alpha(this._client);
	}
};
FineTuning.Methods = Methods;
FineTuning.Jobs = Jobs;
FineTuning.Checkpoints = Checkpoints$1;
FineTuning.Alpha = Alpha;
//#endregion
//#region node_modules/openai/resources/graders/grader-models.mjs
var GraderModels = class extends APIResource {};
//#endregion
//#region node_modules/openai/resources/graders/graders.mjs
var Graders = class extends APIResource {
	constructor() {
		super(...arguments);
		this.graderModels = new GraderModels(this._client);
	}
};
Graders.GraderModels = GraderModels;
//#endregion
//#region node_modules/openai/resources/images.mjs
/**
* Given a prompt and/or an input image, the model will generate a new image.
*/
var Images = class extends APIResource {
	/**
	* Creates a variation of a given image. This endpoint only supports `dall-e-2`.
	*
	* @example
	* ```ts
	* const imagesResponse = await client.images.createVariation({
	*   image: fs.createReadStream('otter.png'),
	* });
	* ```
	*/
	createVariation(body, options) {
		return this._client.post("/images/variations", multipartFormRequestOptions({
			body,
			...options,
			__security: { bearerAuth: true }
		}, this._client));
	}
	edit(body, options) {
		return this._client.post("/images/edits", multipartFormRequestOptions({
			body,
			...options,
			stream: body.stream ?? false,
			__security: { bearerAuth: true }
		}, this._client));
	}
	generate(body, options) {
		return this._client.post("/images/generations", {
			body,
			...options,
			stream: body.stream ?? false,
			__security: { bearerAuth: true }
		});
	}
};
//#endregion
//#region node_modules/openai/resources/models.mjs
/**
* List and describe the various models available in the API.
*/
var Models = class extends APIResource {
	/**
	* Retrieves a model instance, providing basic information about the model such as
	* the owner and permissioning.
	*/
	retrieve(model, options) {
		return this._client.get(path$1`/models/${model}`, {
			...options,
			__security: { bearerAuth: true }
		});
	}
	/**
	* Lists the currently available models, and provides basic information about each
	* one such as the owner and availability.
	*/
	list(options) {
		return this._client.getAPIList("/models", Page, {
			...options,
			__security: { bearerAuth: true }
		});
	}
	/**
	* Delete a fine-tuned model. You must have the Owner role in your organization to
	* delete a model.
	*/
	delete(model, options) {
		return this._client.delete(path$1`/models/${model}`, {
			...options,
			__security: { bearerAuth: true }
		});
	}
};
//#endregion
//#region node_modules/openai/resources/moderations.mjs
/**
* Given text and/or image inputs, classifies if those inputs are potentially harmful.
*/
var Moderations = class extends APIResource {
	/**
	* Classifies if text and/or image inputs are potentially harmful. Learn more in
	* the [moderation guide](https://platform.openai.com/docs/guides/moderation).
	*/
	create(body, options) {
		return this._client.post("/moderations", {
			body,
			...options,
			__security: { bearerAuth: true }
		});
	}
};
//#endregion
//#region node_modules/openai/resources/realtime/calls.mjs
var Calls = class extends APIResource {
	/**
	* Accept an incoming SIP call and configure the realtime session that will handle
	* it.
	*
	* @example
	* ```ts
	* await client.realtime.calls.accept('call_id', {
	*   type: 'realtime',
	* });
	* ```
	*/
	accept(callID, body, options) {
		return this._client.post(path$1`/realtime/calls/${callID}/accept`, {
			body,
			...options,
			headers: buildHeaders([{ Accept: "*/*" }, options?.headers]),
			__security: { bearerAuth: true }
		});
	}
	/**
	* End an active Realtime API call, whether it was initiated over SIP or WebRTC.
	*
	* @example
	* ```ts
	* await client.realtime.calls.hangup('call_id');
	* ```
	*/
	hangup(callID, options) {
		return this._client.post(path$1`/realtime/calls/${callID}/hangup`, {
			...options,
			headers: buildHeaders([{ Accept: "*/*" }, options?.headers]),
			__security: { bearerAuth: true }
		});
	}
	/**
	* Transfer an active SIP call to a new destination using the SIP REFER verb.
	*
	* @example
	* ```ts
	* await client.realtime.calls.refer('call_id', {
	*   target_uri: 'tel:+14155550123',
	* });
	* ```
	*/
	refer(callID, body, options) {
		return this._client.post(path$1`/realtime/calls/${callID}/refer`, {
			body,
			...options,
			headers: buildHeaders([{ Accept: "*/*" }, options?.headers]),
			__security: { bearerAuth: true }
		});
	}
	/**
	* Decline an incoming SIP call by returning a SIP status code to the caller.
	*
	* @example
	* ```ts
	* await client.realtime.calls.reject('call_id');
	* ```
	*/
	reject(callID, body = {}, options) {
		return this._client.post(path$1`/realtime/calls/${callID}/reject`, {
			body,
			...options,
			headers: buildHeaders([{ Accept: "*/*" }, options?.headers]),
			__security: { bearerAuth: true }
		});
	}
};
//#endregion
//#region node_modules/openai/resources/realtime/client-secrets.mjs
var ClientSecrets = class extends APIResource {
	/**
	* Create a Realtime client secret with an associated session configuration.
	*
	* Client secrets are short-lived tokens that can be passed to a client app, such
	* as a web frontend or mobile client, which grants access to the Realtime API
	* without leaking your main API key. You can configure a custom TTL for each
	* client secret.
	*
	* You can also attach session configuration options to the client secret, which
	* will be applied to any sessions created using that client secret, but these can
	* also be overridden by the client connection.
	*
	* [Learn more about authentication with client secrets over WebRTC](https://platform.openai.com/docs/guides/realtime-webrtc).
	*
	* Returns the created client secret and the effective session object. The client
	* secret is a string that looks like `ek_1234`.
	*
	* @example
	* ```ts
	* const clientSecret =
	*   await client.realtime.clientSecrets.create();
	* ```
	*/
	create(body, options) {
		return this._client.post("/realtime/client_secrets", {
			body,
			...options,
			__security: { bearerAuth: true }
		});
	}
};
//#endregion
//#region node_modules/openai/resources/realtime/realtime.mjs
var Realtime = class extends APIResource {
	constructor() {
		super(...arguments);
		this.clientSecrets = new ClientSecrets(this._client);
		this.calls = new Calls(this._client);
	}
};
Realtime.ClientSecrets = ClientSecrets;
Realtime.Calls = Calls;
//#endregion
//#region node_modules/openai/lib/ResponsesParser.mjs
function maybeParseResponse(response, params) {
	if (!params || !hasAutoParseableInput(params)) {
		const parsed = {
			...response,
			output_parsed: null,
			output: response.output.map((item) => {
				if (item.type === "function_call") return {
					...item,
					parsed_arguments: null
				};
				if (item.type === "message") return {
					...item,
					content: item.content.map((content) => ({
						...content,
						parsed: null
					}))
				};
				else return item;
			})
		};
		if (needsOutputText(response, parsed)) addOutputText(parsed);
		return parsed;
	}
	return parseResponse(response, params);
}
function parseResponse(response, params) {
	const shouldParse = !response.status || response.status === "completed";
	const output = response.output.map((item) => {
		if (item.type === "function_call") return {
			...item,
			parsed_arguments: shouldParse ? parseToolCall(params, item) : null
		};
		if (item.type === "message") {
			const content = item.content.map((content) => {
				if (content.type === "output_text") return {
					...content,
					parsed: shouldParse ? parseTextFormat(params, content.text) : null
				};
				return content;
			});
			return {
				...item,
				content
			};
		}
		return item;
	});
	const parsed = Object.assign({}, response, { output });
	if (needsOutputText(response, parsed)) addOutputText(parsed);
	Object.defineProperty(parsed, "output_parsed", {
		enumerable: true,
		get() {
			for (const output of parsed.output) {
				if (output.type !== "message") continue;
				for (const content of output.content) if (content.type === "output_text" && content.parsed !== null) return content.parsed;
			}
			return null;
		}
	});
	return parsed;
}
function parseTextFormat(params, content) {
	if (params.text?.format?.type !== "json_schema") return null;
	if ("$parseRaw" in params.text?.format) return (params.text?.format).$parseRaw(content);
	return JSON.parse(content);
}
function hasAutoParseableInput(params) {
	if (isAutoParsableResponseFormat(params.text?.format)) return true;
	return false;
}
function isAutoParsableTool(tool) {
	return tool?.["$brand"] === "auto-parseable-tool";
}
function getInputToolByName(input_tools, name) {
	return input_tools.find((tool) => tool.type === "function" && tool.name === name);
}
function parseToolCall(params, toolCall) {
	const inputTool = getInputToolByName(params.tools ?? [], toolCall.name);
	return {
		...toolCall,
		...toolCall,
		parsed_arguments: isAutoParsableTool(inputTool) ? inputTool.$parseRaw(toolCall.arguments) : inputTool?.strict ? JSON.parse(toolCall.arguments) : null
	};
}
function needsOutputText(response, target) {
	return !Object.getOwnPropertyDescriptor(response, "output_text") || target.output_text == null;
}
function addOutputText(rsp) {
	const texts = [];
	for (const output of rsp.output) {
		if (output.type !== "message") continue;
		for (const content of output.content) if (content.type === "output_text") texts.push(content.text);
	}
	rsp.output_text = texts.join("");
}
//#endregion
//#region node_modules/openai/lib/responses/ResponseAccumulator.mjs
/**
* Applies a streaming event to a response snapshot.
*
* Always use the returned snapshot. Incremental events update the supplied snapshot
* in place, while response lifecycle events return a detached replacement. Event
* payloads are cloned, so retaining or replaying the raw events is safe.
*/
function accumulateResponse(event, snapshot) {
	if (!snapshot) {
		if (event.type !== "response.created") throw new OpenAIError(`When snapshot hasn't been set yet, expected 'response.created' event, got ${event.type}`);
		return cloneResponse(event.response);
	}
	switch (event.type) {
		case "response.output_item.added":
			snapshot.output.push(structuredClone(event.item));
			if (event.item.type === "message") addOutputText(snapshot);
			break;
		case "response.output_item.done":
			getOutput(snapshot, event.output_index);
			snapshot.output[event.output_index] = structuredClone(event.item);
			if (event.item.type === "message") addOutputText(snapshot);
			break;
		case "response.content_part.added": {
			const output = getOutput(snapshot, event.output_index);
			const type = output.type;
			const part = event.part;
			if (type === "message" && part.type !== "reasoning_text") {
				output.content.push(structuredClone(part));
				if (part.type === "output_text") addOutputText(snapshot);
			} else if (type === "reasoning" && part.type === "reasoning_text") {
				if (!output.content) output.content = [];
				output.content.push(structuredClone(part));
			}
			break;
		}
		case "response.content_part.done": {
			const output = getOutput(snapshot, event.output_index);
			const part = event.part;
			if (output.type === "message" && part.type !== "reasoning_text") {
				getContent(output.content, event.content_index);
				output.content[event.content_index] = structuredClone(part);
				if (part.type === "output_text") addOutputText(snapshot);
			} else if (output.type === "reasoning" && part.type === "reasoning_text") {
				const content = output.content;
				if (!content) throw new OpenAIError(`missing content at index ${event.content_index}`);
				getContent(content, event.content_index);
				content[event.content_index] = structuredClone(part);
			}
			break;
		}
		case "response.output_text.delta": {
			const output = getOutput(snapshot, event.output_index);
			if (output.type === "message") {
				const content = getContent(output.content, event.content_index);
				if (content.type !== "output_text") throw new OpenAIError(`expected content to be 'output_text', got ${content.type}`);
				content.text += event.delta;
				snapshot.output_text += event.delta;
			}
			break;
		}
		case "response.output_text.done": {
			const output = getOutput(snapshot, event.output_index);
			if (output.type === "message") {
				const content = getContent(output.content, event.content_index);
				if (content.type !== "output_text") throw new OpenAIError(`expected content to be 'output_text', got ${content.type}`);
				content.text = event.text;
				addOutputText(snapshot);
			}
			break;
		}
		case "response.output_text.annotation.added": {
			const output = getOutput(snapshot, event.output_index);
			if (output.type === "message") {
				const content = getContent(output.content, event.content_index);
				if (content.type !== "output_text") throw new OpenAIError(`expected content to be 'output_text', got ${content.type}`);
				content.annotations[event.annotation_index] = structuredClone(event.annotation);
			}
			break;
		}
		case "response.refusal.delta": {
			const output = getOutput(snapshot, event.output_index);
			if (output.type === "message") {
				const content = getContent(output.content, event.content_index);
				if (content.type !== "refusal") throw new OpenAIError(`expected content to be 'refusal', got ${content.type}`);
				content.refusal += event.delta;
			}
			break;
		}
		case "response.refusal.done": {
			const output = getOutput(snapshot, event.output_index);
			if (output.type === "message") {
				const content = getContent(output.content, event.content_index);
				if (content.type !== "refusal") throw new OpenAIError(`expected content to be 'refusal', got ${content.type}`);
				content.refusal = event.refusal;
			}
			break;
		}
		case "response.function_call_arguments.delta": {
			const output = getOutput(snapshot, event.output_index);
			if (output.type === "function_call") output.arguments += event.delta;
			break;
		}
		case "response.function_call_arguments.done": {
			const output = getOutput(snapshot, event.output_index);
			if (output.type === "function_call") output.arguments = event.arguments;
			break;
		}
		case "response.reasoning_text.delta": {
			const output = getOutput(snapshot, event.output_index);
			if (output.type === "reasoning") {
				if (!output.content) throw new OpenAIError(`missing content at index ${event.content_index}`);
				const content = getContent(output.content, event.content_index);
				if (content.type !== "reasoning_text") throw new OpenAIError(`expected content to be 'reasoning_text', got ${content.type}`);
				content.text += event.delta;
			}
			break;
		}
		case "response.reasoning_text.done": {
			const output = getOutput(snapshot, event.output_index);
			if (output.type === "reasoning") {
				if (!output.content) throw new OpenAIError(`missing content at index ${event.content_index}`);
				const content = getContent(output.content, event.content_index);
				if (content.type !== "reasoning_text") throw new OpenAIError(`expected content to be 'reasoning_text', got ${content.type}`);
				content.text = event.text;
			}
			break;
		}
		case "response.reasoning_summary_part.added": {
			const output = getOutput(snapshot, event.output_index);
			if (output.type === "reasoning") output.summary.push(structuredClone(event.part));
			break;
		}
		case "response.reasoning_summary_part.done": {
			const output = getOutput(snapshot, event.output_index);
			if (output.type === "reasoning") {
				getContent(output.summary, event.summary_index);
				output.summary[event.summary_index] = structuredClone(event.part);
			}
			break;
		}
		case "response.reasoning_summary_text.delta": {
			const output = getOutput(snapshot, event.output_index);
			if (output.type === "reasoning") {
				const part = getContent(output.summary, event.summary_index);
				part.text += event.delta;
			}
			break;
		}
		case "response.reasoning_summary_text.done": {
			const output = getOutput(snapshot, event.output_index);
			if (output.type === "reasoning") {
				const part = getContent(output.summary, event.summary_index);
				part.text = event.text;
			}
			break;
		}
		case "response.custom_tool_call_input.delta": {
			const output = getOutput(snapshot, event.output_index);
			if (output.type === "custom_tool_call") output.input += event.delta;
			break;
		}
		case "response.custom_tool_call_input.done": {
			const output = getOutput(snapshot, event.output_index);
			if (output.type === "custom_tool_call") output.input = event.input;
			break;
		}
		case "response.mcp_call_arguments.delta": {
			const output = getOutput(snapshot, event.output_index);
			if (output.type === "mcp_call") output.arguments += event.delta;
			break;
		}
		case "response.mcp_call_arguments.done": {
			const output = getOutput(snapshot, event.output_index);
			if (output.type === "mcp_call") output.arguments = event.arguments;
			break;
		}
		case "response.code_interpreter_call_code.delta": {
			const output = getOutput(snapshot, event.output_index);
			if (output.type === "code_interpreter_call") output.code = (output.code ?? "") + event.delta;
			break;
		}
		case "response.code_interpreter_call_code.done": {
			const output = getOutput(snapshot, event.output_index);
			if (output.type === "code_interpreter_call") output.code = event.code;
			break;
		}
		case "response.code_interpreter_call.in_progress": {
			const output = getOutput(snapshot, event.output_index);
			if (output.type === "code_interpreter_call") output.status = "in_progress";
			break;
		}
		case "response.code_interpreter_call.interpreting": {
			const output = getOutput(snapshot, event.output_index);
			if (output.type === "code_interpreter_call") output.status = "interpreting";
			break;
		}
		case "response.code_interpreter_call.completed": {
			const output = getOutput(snapshot, event.output_index);
			if (output.type === "code_interpreter_call") output.status = "completed";
			break;
		}
		case "response.file_search_call.in_progress": {
			const output = getOutput(snapshot, event.output_index);
			if (output.type === "file_search_call") output.status = "in_progress";
			break;
		}
		case "response.file_search_call.searching": {
			const output = getOutput(snapshot, event.output_index);
			if (output.type === "file_search_call") output.status = "searching";
			break;
		}
		case "response.file_search_call.completed": {
			const output = getOutput(snapshot, event.output_index);
			if (output.type === "file_search_call") output.status = "completed";
			break;
		}
		case "response.web_search_call.in_progress": {
			const output = getOutput(snapshot, event.output_index);
			if (output.type === "web_search_call") output.status = "in_progress";
			break;
		}
		case "response.web_search_call.searching": {
			const output = getOutput(snapshot, event.output_index);
			if (output.type === "web_search_call") output.status = "searching";
			break;
		}
		case "response.web_search_call.completed": {
			const output = getOutput(snapshot, event.output_index);
			if (output.type === "web_search_call") output.status = "completed";
			break;
		}
		case "response.image_generation_call.in_progress": {
			const output = getOutput(snapshot, event.output_index);
			if (output.type === "image_generation_call") output.status = "in_progress";
			break;
		}
		case "response.image_generation_call.generating": {
			const output = getOutput(snapshot, event.output_index);
			if (output.type === "image_generation_call") output.status = "generating";
			break;
		}
		case "response.image_generation_call.completed": {
			const output = getOutput(snapshot, event.output_index);
			if (output.type === "image_generation_call") output.status = "completed";
			break;
		}
		case "response.mcp_call.in_progress": {
			const output = getOutput(snapshot, event.output_index);
			if (output.type === "mcp_call") output.status = "in_progress";
			break;
		}
		case "response.mcp_call.completed": {
			const output = getOutput(snapshot, event.output_index);
			if (output.type === "mcp_call") output.status = "completed";
			break;
		}
		case "response.mcp_call.failed": {
			const output = getOutput(snapshot, event.output_index);
			if (output.type === "mcp_call") output.status = "failed";
			break;
		}
		case "response.created":
		case "response.queued":
		case "response.in_progress":
		case "response.completed":
		case "response.failed":
		case "response.incomplete":
			snapshot = cloneResponse(event.response);
			break;
		case "response.audio.delta":
		case "response.audio.done":
		case "response.audio.transcript.delta":
		case "response.audio.transcript.done":
		case "response.image_generation_call.partial_image":
		case "response.mcp_list_tools.in_progress":
		case "response.mcp_list_tools.completed":
		case "response.mcp_list_tools.failed":
		case "error": break;
		default: assertNever(event);
	}
	return snapshot;
}
function cloneResponse(response) {
	const snapshot = structuredClone(response);
	if (!Object.getOwnPropertyDescriptor(snapshot, "output_text") || snapshot.output_text == null) addOutputText(snapshot);
	return snapshot;
}
function getOutput(snapshot, outputIndex) {
	const output = snapshot.output[outputIndex];
	if (!output) throw new OpenAIError(`missing output at index ${outputIndex}`);
	return output;
}
function getContent(content, contentIndex) {
	const part = content[contentIndex];
	if (!part) throw new OpenAIError(`missing content at index ${contentIndex}`);
	return part;
}
function assertNever(value) {
	throw new OpenAIError(`Unhandled response stream event: ${JSON.stringify(value)}`);
}
//#endregion
//#region node_modules/openai/lib/responses/ResponseStream.mjs
var _ResponseStream_instances;
var _ResponseStream_params;
var _ResponseStream_currentResponseSnapshot;
var _ResponseStream_finalResponse;
var _ResponseStream_beginRequest;
var _ResponseStream_addEvent;
var _ResponseStream_endRequest;
var ResponseStream = class ResponseStream extends EventStream {
	constructor(params) {
		super();
		_ResponseStream_instances.add(this);
		_ResponseStream_params.set(this, void 0);
		_ResponseStream_currentResponseSnapshot.set(this, void 0);
		_ResponseStream_finalResponse.set(this, void 0);
		__classPrivateFieldSet(this, _ResponseStream_params, params, "f");
	}
	static createResponse(client, params, options) {
		const runner = new ResponseStream(params);
		runner._run(() => runner._createOrRetrieveResponse(client, params, {
			...options,
			headers: {
				...options?.headers,
				"X-Stainless-Helper-Method": "stream"
			}
		}));
		return runner;
	}
	async _createOrRetrieveResponse(client, params, options) {
		this._listenForAbort(options?.signal);
		__classPrivateFieldGet(this, _ResponseStream_instances, "m", _ResponseStream_beginRequest).call(this);
		let stream;
		let starting_after = null;
		if ("response_id" in params) {
			stream = await client.responses.retrieve(params.response_id, { stream: true }, {
				...options,
				signal: this.controller.signal,
				stream: true
			});
			starting_after = params.starting_after ?? null;
		} else stream = await client.responses.create({
			...params,
			stream: true
		}, {
			...options,
			signal: this.controller.signal
		});
		this._connected();
		for await (const event of stream) __classPrivateFieldGet(this, _ResponseStream_instances, "m", _ResponseStream_addEvent).call(this, event, starting_after);
		if (stream.controller.signal?.aborted) throw new APIUserAbortError();
		return __classPrivateFieldGet(this, _ResponseStream_instances, "m", _ResponseStream_endRequest).call(this);
	}
	[(_ResponseStream_params = /* @__PURE__ */ new WeakMap(), _ResponseStream_currentResponseSnapshot = /* @__PURE__ */ new WeakMap(), _ResponseStream_finalResponse = /* @__PURE__ */ new WeakMap(), _ResponseStream_instances = /* @__PURE__ */ new WeakSet(), _ResponseStream_beginRequest = function _ResponseStream_beginRequest() {
		if (this.ended) return;
		__classPrivateFieldSet(this, _ResponseStream_currentResponseSnapshot, void 0, "f");
	}, _ResponseStream_addEvent = function _ResponseStream_addEvent(event, starting_after) {
		if (this.ended) return;
		const maybeEmit = (name, event) => {
			if (starting_after == null || event.sequence_number > starting_after) this._emit(name, event);
		};
		const response = accumulateResponse(event, __classPrivateFieldGet(this, _ResponseStream_currentResponseSnapshot, "f"));
		__classPrivateFieldSet(this, _ResponseStream_currentResponseSnapshot, response, "f");
		maybeEmit("event", event);
		switch (event.type) {
			case "response.output_text.delta": {
				const output = response.output[event.output_index];
				if (!output) throw new OpenAIError(`missing output at index ${event.output_index}`);
				if (output.type === "message") {
					const content = output.content[event.content_index];
					if (!content) throw new OpenAIError(`missing content at index ${event.content_index}`);
					if (content.type !== "output_text") throw new OpenAIError(`expected content to be 'output_text', got ${content.type}`);
					maybeEmit("response.output_text.delta", {
						...event,
						snapshot: content.text
					});
				}
				break;
			}
			case "response.function_call_arguments.delta": {
				const output = response.output[event.output_index];
				if (!output) throw new OpenAIError(`missing output at index ${event.output_index}`);
				if (output.type === "function_call") maybeEmit("response.function_call_arguments.delta", {
					...event,
					snapshot: output.arguments
				});
				break;
			}
			default:
				maybeEmit(event.type, event);
				break;
		}
	}, _ResponseStream_endRequest = function _ResponseStream_endRequest() {
		if (this.ended) throw new OpenAIError(`stream has ended, this shouldn't happen`);
		const snapshot = __classPrivateFieldGet(this, _ResponseStream_currentResponseSnapshot, "f");
		if (!snapshot) throw new OpenAIError(`request ended without sending any events`);
		__classPrivateFieldSet(this, _ResponseStream_currentResponseSnapshot, void 0, "f");
		const parsedResponse = finalizeResponse(snapshot, __classPrivateFieldGet(this, _ResponseStream_params, "f"));
		__classPrivateFieldSet(this, _ResponseStream_finalResponse, parsedResponse, "f");
		return parsedResponse;
	}, Symbol.asyncIterator)]() {
		const pushQueue = [];
		const readQueue = [];
		let done = false;
		this.on("event", (event) => {
			const reader = readQueue.shift();
			if (reader) reader.resolve(event);
			else pushQueue.push(event);
		});
		this.on("end", () => {
			done = true;
			for (const reader of readQueue) reader.resolve(void 0);
			readQueue.length = 0;
		});
		this.on("abort", (err) => {
			done = true;
			for (const reader of readQueue) reader.reject(err);
			readQueue.length = 0;
		});
		this.on("error", (err) => {
			done = true;
			for (const reader of readQueue) reader.reject(err);
			readQueue.length = 0;
		});
		return {
			next: async () => {
				if (!pushQueue.length) {
					if (done) return {
						value: void 0,
						done: true
					};
					return new Promise((resolve, reject) => readQueue.push({
						resolve,
						reject
					})).then((event) => event ? {
						value: event,
						done: false
					} : {
						value: void 0,
						done: true
					});
				}
				return {
					value: pushQueue.shift(),
					done: false
				};
			},
			return: async () => {
				this.abort();
				return {
					value: void 0,
					done: true
				};
			}
		};
	}
	/**
	* @returns a promise that resolves with the final Response, or rejects
	* if an error occurred or the stream ended prematurely without producing a REsponse.
	*/
	async finalResponse() {
		await this.done();
		const response = __classPrivateFieldGet(this, _ResponseStream_finalResponse, "f");
		if (!response) throw new OpenAIError("stream ended without producing a ChatCompletion");
		return response;
	}
};
function finalizeResponse(snapshot, params) {
	return maybeParseResponse(snapshot, params);
}
//#endregion
//#region node_modules/openai/resources/responses/input-items.mjs
var InputItems = class extends APIResource {
	/**
	* Returns a list of input items for a given response.
	*
	* @example
	* ```ts
	* // Automatically fetches more pages as needed.
	* for await (const responseItem of client.responses.inputItems.list(
	*   'response_id',
	* )) {
	*   // ...
	* }
	* ```
	*/
	list(responseID, query = {}, options) {
		return this._client.getAPIList(path$1`/responses/${responseID}/input_items`, CursorPage, {
			query,
			...options,
			__security: { bearerAuth: true }
		});
	}
};
//#endregion
//#region node_modules/openai/resources/responses/input-tokens.mjs
var InputTokens = class extends APIResource {
	/**
	* Returns input token counts of the request.
	*
	* Returns an object with `object` set to `response.input_tokens` and an
	* `input_tokens` count.
	*
	* @example
	* ```ts
	* const response = await client.responses.inputTokens.count();
	* ```
	*/
	count(body = {}, options) {
		return this._client.post("/responses/input_tokens", {
			body,
			...options,
			__security: { bearerAuth: true }
		});
	}
};
//#endregion
//#region node_modules/openai/resources/responses/responses.mjs
var Responses = class extends APIResource {
	constructor() {
		super(...arguments);
		this.inputItems = new InputItems(this._client);
		this.inputTokens = new InputTokens(this._client);
	}
	create(body, options) {
		return this._client.post("/responses", {
			body,
			...options,
			stream: body.stream ?? false,
			__security: { bearerAuth: true }
		})._thenUnwrap((rsp) => {
			if ("object" in rsp && rsp.object === "response") addOutputText(rsp);
			return rsp;
		});
	}
	retrieve(responseID, query = {}, options) {
		return this._client.get(path$1`/responses/${responseID}`, {
			query,
			...options,
			stream: query?.stream ?? false,
			__security: { bearerAuth: true }
		})._thenUnwrap((rsp) => {
			if ("object" in rsp && rsp.object === "response") addOutputText(rsp);
			return rsp;
		});
	}
	/**
	* Deletes a model response with the given ID.
	*
	* @example
	* ```ts
	* await client.responses.delete(
	*   'resp_677efb5139a88190b512bc3fef8e535d',
	* );
	* ```
	*/
	delete(responseID, options) {
		return this._client.delete(path$1`/responses/${responseID}`, {
			...options,
			headers: buildHeaders([{ Accept: "*/*" }, options?.headers]),
			__security: { bearerAuth: true }
		});
	}
	parse(body, options) {
		return this._client.responses.create(body, options)._thenUnwrap((response) => parseResponse(response, body));
	}
	/**
	* Creates a model response stream
	*/
	stream(body, options) {
		return ResponseStream.createResponse(this._client, body, options);
	}
	/**
	* Cancels a model response with the given ID. Only responses created with the
	* `background` parameter set to `true` can be cancelled.
	* [Learn more](https://platform.openai.com/docs/guides/background).
	*
	* @example
	* ```ts
	* const response = await client.responses.cancel(
	*   'resp_677efb5139a88190b512bc3fef8e535d',
	* );
	* ```
	*/
	cancel(responseID, options) {
		return this._client.post(path$1`/responses/${responseID}/cancel`, {
			...options,
			__security: { bearerAuth: true }
		});
	}
	/**
	* Compact a conversation. Returns a compacted response object.
	*
	* Learn when and how to compact long-running conversations in the
	* [conversation state guide](https://platform.openai.com/docs/guides/conversation-state#managing-the-context-window).
	* For ZDR-compatible compaction details, see
	* [Compaction (advanced)](https://platform.openai.com/docs/guides/conversation-state#compaction-advanced).
	*
	* @example
	* ```ts
	* const compactedResponse = await client.responses.compact({
	*   model: 'gpt-5.4',
	* });
	* ```
	*/
	compact(body, options) {
		return this._client.post("/responses/compact", {
			body,
			...options,
			__security: { bearerAuth: true }
		});
	}
};
Responses.InputItems = InputItems;
Responses.InputTokens = InputTokens;
//#endregion
//#region node_modules/openai/resources/skills/content.mjs
var Content$1 = class extends APIResource {
	/**
	* Download a skill zip bundle by its ID.
	*/
	retrieve(skillID, options) {
		return this._client.get(path$1`/skills/${skillID}/content`, {
			...options,
			headers: buildHeaders([{ Accept: "application/binary" }, options?.headers]),
			__security: { bearerAuth: true },
			__binaryResponse: true
		});
	}
};
//#endregion
//#region node_modules/openai/resources/skills/versions/content.mjs
var Content = class extends APIResource {
	/**
	* Download a skill version zip bundle.
	*/
	retrieve(version, params, options) {
		const { skill_id } = params;
		return this._client.get(path$1`/skills/${skill_id}/versions/${version}/content`, {
			...options,
			headers: buildHeaders([{ Accept: "application/binary" }, options?.headers]),
			__security: { bearerAuth: true },
			__binaryResponse: true
		});
	}
};
//#endregion
//#region node_modules/openai/resources/skills/versions/versions.mjs
var Versions = class extends APIResource {
	constructor() {
		super(...arguments);
		this.content = new Content(this._client);
	}
	/**
	* Create a new immutable skill version.
	*/
	create(skillID, body = {}, options) {
		return this._client.post(path$1`/skills/${skillID}/versions`, maybeMultipartFormRequestOptions({
			body,
			...options,
			__security: { bearerAuth: true }
		}, this._client));
	}
	/**
	* Get a specific skill version.
	*/
	retrieve(version, params, options) {
		const { skill_id } = params;
		return this._client.get(path$1`/skills/${skill_id}/versions/${version}`, {
			...options,
			__security: { bearerAuth: true }
		});
	}
	/**
	* List skill versions for a skill.
	*/
	list(skillID, query = {}, options) {
		return this._client.getAPIList(path$1`/skills/${skillID}/versions`, CursorPage, {
			query,
			...options,
			__security: { bearerAuth: true }
		});
	}
	/**
	* Delete a skill version.
	*/
	delete(version, params, options) {
		const { skill_id } = params;
		return this._client.delete(path$1`/skills/${skill_id}/versions/${version}`, {
			...options,
			__security: { bearerAuth: true }
		});
	}
};
Versions.Content = Content;
//#endregion
//#region node_modules/openai/resources/skills/skills.mjs
var Skills = class extends APIResource {
	constructor() {
		super(...arguments);
		this.content = new Content$1(this._client);
		this.versions = new Versions(this._client);
	}
	/**
	* Create a new skill.
	*/
	create(body = {}, options) {
		return this._client.post("/skills", maybeMultipartFormRequestOptions({
			body,
			...options,
			__security: { bearerAuth: true }
		}, this._client));
	}
	/**
	* Get a skill by its ID.
	*/
	retrieve(skillID, options) {
		return this._client.get(path$1`/skills/${skillID}`, {
			...options,
			__security: { bearerAuth: true }
		});
	}
	/**
	* Update the default version pointer for a skill.
	*/
	update(skillID, body, options) {
		return this._client.post(path$1`/skills/${skillID}`, {
			body,
			...options,
			__security: { bearerAuth: true }
		});
	}
	/**
	* List all skills for the current project.
	*/
	list(query = {}, options) {
		return this._client.getAPIList("/skills", CursorPage, {
			query,
			...options,
			__security: { bearerAuth: true }
		});
	}
	/**
	* Delete a skill by its ID.
	*/
	delete(skillID, options) {
		return this._client.delete(path$1`/skills/${skillID}`, {
			...options,
			__security: { bearerAuth: true }
		});
	}
};
Skills.Content = Content$1;
Skills.Versions = Versions;
//#endregion
//#region node_modules/openai/resources/uploads/parts.mjs
/**
* Use Uploads to upload large files in multiple parts.
*/
var Parts = class extends APIResource {
	/**
	* Adds a
	* [Part](https://platform.openai.com/docs/api-reference/uploads/part-object) to an
	* [Upload](https://platform.openai.com/docs/api-reference/uploads/object) object.
	* A Part represents a chunk of bytes from the file you are trying to upload.
	*
	* Each Part can be at most 64 MB, and you can add Parts until you hit the Upload
	* maximum of 8 GB.
	*
	* It is possible to add multiple Parts in parallel. You can decide the intended
	* order of the Parts when you
	* [complete the Upload](https://platform.openai.com/docs/api-reference/uploads/complete).
	*/
	create(uploadID, body, options) {
		return this._client.post(path$1`/uploads/${uploadID}/parts`, multipartFormRequestOptions({
			body,
			...options,
			__security: { bearerAuth: true }
		}, this._client));
	}
};
//#endregion
//#region node_modules/openai/resources/uploads/uploads.mjs
/**
* Use Uploads to upload large files in multiple parts.
*/
var Uploads = class extends APIResource {
	constructor() {
		super(...arguments);
		this.parts = new Parts(this._client);
	}
	/**
	* Creates an intermediate
	* [Upload](https://platform.openai.com/docs/api-reference/uploads/object) object
	* that you can add
	* [Parts](https://platform.openai.com/docs/api-reference/uploads/part-object) to.
	* Currently, an Upload can accept at most 8 GB in total and expires after an hour
	* after you create it.
	*
	* Once you complete the Upload, we will create a
	* [File](https://platform.openai.com/docs/api-reference/files/object) object that
	* contains all the parts you uploaded. This File is usable in the rest of our
	* platform as a regular File object.
	*
	* For certain `purpose` values, the correct `mime_type` must be specified. Please
	* refer to documentation for the
	* [supported MIME types for your use case](https://platform.openai.com/docs/assistants/tools/file-search#supported-files).
	*
	* For guidance on the proper filename extensions for each purpose, please follow
	* the documentation on
	* [creating a File](https://platform.openai.com/docs/api-reference/files/create).
	*
	* Returns the Upload object with status `pending`.
	*/
	create(body, options) {
		return this._client.post("/uploads", {
			body,
			...options,
			__security: { bearerAuth: true }
		});
	}
	/**
	* Cancels the Upload. No Parts may be added after an Upload is cancelled.
	*
	* Returns the Upload object with status `cancelled`.
	*/
	cancel(uploadID, options) {
		return this._client.post(path$1`/uploads/${uploadID}/cancel`, {
			...options,
			__security: { bearerAuth: true }
		});
	}
	/**
	* Completes the
	* [Upload](https://platform.openai.com/docs/api-reference/uploads/object).
	*
	* Within the returned Upload object, there is a nested
	* [File](https://platform.openai.com/docs/api-reference/files/object) object that
	* is ready to use in the rest of the platform.
	*
	* You can specify the order of the Parts by passing in an ordered list of the Part
	* IDs.
	*
	* The number of bytes uploaded upon completion must match the number of bytes
	* initially specified when creating the Upload object. No Parts may be added after
	* an Upload is completed. Returns the Upload object with status `completed`,
	* including an additional `file` property containing the created usable File
	* object.
	*/
	complete(uploadID, body, options) {
		return this._client.post(path$1`/uploads/${uploadID}/complete`, {
			body,
			...options,
			__security: { bearerAuth: true }
		});
	}
};
Uploads.Parts = Parts;
//#endregion
//#region node_modules/openai/lib/Util.mjs
/**
* Like `Promise.allSettled()` but throws an error if any promises are rejected.
*/
const allSettledWithThrow = async (promises) => {
	const results = await Promise.allSettled(promises);
	const rejected = results.filter((result) => result.status === "rejected");
	if (rejected.length) {
		for (const result of rejected) console.error(result.reason);
		throw new Error(`${rejected.length} promise(s) failed - see the above errors`);
	}
	const values = [];
	for (const result of results) if (result.status === "fulfilled") values.push(result.value);
	return values;
};
//#endregion
//#region node_modules/openai/resources/vector-stores/file-batches.mjs
var FileBatches = class extends APIResource {
	/**
	* Create a vector store file batch.
	*/
	create(vectorStoreID, body, options) {
		return this._client.post(path$1`/vector_stores/${vectorStoreID}/file_batches`, {
			body,
			...options,
			headers: buildHeaders([{ "OpenAI-Beta": "assistants=v2" }, options?.headers]),
			__security: { bearerAuth: true }
		});
	}
	/**
	* Retrieves a vector store file batch.
	*/
	retrieve(batchID, params, options) {
		const { vector_store_id } = params;
		return this._client.get(path$1`/vector_stores/${vector_store_id}/file_batches/${batchID}`, {
			...options,
			headers: buildHeaders([{ "OpenAI-Beta": "assistants=v2" }, options?.headers]),
			__security: { bearerAuth: true }
		});
	}
	/**
	* Cancel a vector store file batch. This attempts to cancel the processing of
	* files in this batch as soon as possible.
	*/
	cancel(batchID, params, options) {
		const { vector_store_id } = params;
		return this._client.post(path$1`/vector_stores/${vector_store_id}/file_batches/${batchID}/cancel`, {
			...options,
			headers: buildHeaders([{ "OpenAI-Beta": "assistants=v2" }, options?.headers]),
			__security: { bearerAuth: true }
		});
	}
	/**
	* Create a vector store batch and poll until all files have been processed.
	*/
	async createAndPoll(vectorStoreId, body, options) {
		const batch = await this.create(vectorStoreId, body);
		return await this.poll(vectorStoreId, batch.id, options);
	}
	/**
	* Returns a list of vector store files in a batch.
	*/
	listFiles(batchID, params, options) {
		const { vector_store_id, ...query } = params;
		return this._client.getAPIList(path$1`/vector_stores/${vector_store_id}/file_batches/${batchID}/files`, CursorPage, {
			query,
			...options,
			headers: buildHeaders([{ "OpenAI-Beta": "assistants=v2" }, options?.headers]),
			__security: { bearerAuth: true }
		});
	}
	/**
	* Wait for the given file batch to be processed.
	*
	* Note: this will return even if one of the files failed to process, you need to
	* check batch.file_counts.failed_count to handle this case.
	*/
	async poll(vectorStoreID, batchID, options) {
		const headers = buildHeaders([options?.headers, {
			"X-Stainless-Poll-Helper": "true",
			"X-Stainless-Custom-Poll-Interval": options?.pollIntervalMs?.toString() ?? void 0
		}]);
		while (true) {
			const { data: batch, response } = await this.retrieve(batchID, { vector_store_id: vectorStoreID }, {
				...options,
				headers
			}).withResponse();
			switch (batch.status) {
				case "in_progress":
					let sleepInterval = 5e3;
					if (options?.pollIntervalMs) sleepInterval = options.pollIntervalMs;
					else {
						const headerInterval = response.headers.get("openai-poll-after-ms");
						if (headerInterval) {
							const headerIntervalMs = parseInt(headerInterval);
							if (!isNaN(headerIntervalMs)) sleepInterval = headerIntervalMs;
						}
					}
					await sleep(sleepInterval);
					break;
				case "failed":
				case "cancelled":
				case "completed": return batch;
			}
		}
	}
	/**
	* Uploads the given files concurrently and then creates a vector store file batch.
	*
	* The concurrency limit is configurable using the `maxConcurrency` parameter.
	*/
	async uploadAndPoll(vectorStoreId, { files, fileIds = [] }, options) {
		if (files == null || files.length == 0) throw new Error(`No \`files\` provided to process. If you've already uploaded files you should use \`.createAndPoll()\` instead`);
		const configuredConcurrency = options?.maxConcurrency ?? 5;
		const concurrencyLimit = Math.min(configuredConcurrency, files.length);
		const client = this._client;
		const fileIterator = files.values();
		const allFileIds = [...fileIds];
		async function processFiles(iterator) {
			for (let item of iterator) {
				const fileObj = await client.files.create({
					file: item,
					purpose: "assistants"
				}, options);
				allFileIds.push(fileObj.id);
			}
		}
		await allSettledWithThrow(Array(concurrencyLimit).fill(fileIterator).map(processFiles));
		return await this.createAndPoll(vectorStoreId, { file_ids: allFileIds });
	}
};
//#endregion
//#region node_modules/openai/resources/vector-stores/files.mjs
var Files = class extends APIResource {
	/**
	* Create a vector store file by attaching a
	* [File](https://platform.openai.com/docs/api-reference/files) to a
	* [vector store](https://platform.openai.com/docs/api-reference/vector-stores/object).
	*/
	create(vectorStoreID, body, options) {
		return this._client.post(path$1`/vector_stores/${vectorStoreID}/files`, {
			body,
			...options,
			headers: buildHeaders([{ "OpenAI-Beta": "assistants=v2" }, options?.headers]),
			__security: { bearerAuth: true }
		});
	}
	/**
	* Retrieves a vector store file.
	*/
	retrieve(fileID, params, options) {
		const { vector_store_id } = params;
		return this._client.get(path$1`/vector_stores/${vector_store_id}/files/${fileID}`, {
			...options,
			headers: buildHeaders([{ "OpenAI-Beta": "assistants=v2" }, options?.headers]),
			__security: { bearerAuth: true }
		});
	}
	/**
	* Update attributes on a vector store file.
	*/
	update(fileID, params, options) {
		const { vector_store_id, ...body } = params;
		return this._client.post(path$1`/vector_stores/${vector_store_id}/files/${fileID}`, {
			body,
			...options,
			headers: buildHeaders([{ "OpenAI-Beta": "assistants=v2" }, options?.headers]),
			__security: { bearerAuth: true }
		});
	}
	/**
	* Returns a list of vector store files.
	*/
	list(vectorStoreID, query = {}, options) {
		return this._client.getAPIList(path$1`/vector_stores/${vectorStoreID}/files`, CursorPage, {
			query,
			...options,
			headers: buildHeaders([{ "OpenAI-Beta": "assistants=v2" }, options?.headers]),
			__security: { bearerAuth: true }
		});
	}
	/**
	* Delete a vector store file. This will remove the file from the vector store but
	* the file itself will not be deleted. To delete the file, use the
	* [delete file](https://platform.openai.com/docs/api-reference/files/delete)
	* endpoint.
	*/
	delete(fileID, params, options) {
		const { vector_store_id } = params;
		return this._client.delete(path$1`/vector_stores/${vector_store_id}/files/${fileID}`, {
			...options,
			headers: buildHeaders([{ "OpenAI-Beta": "assistants=v2" }, options?.headers]),
			__security: { bearerAuth: true }
		});
	}
	/**
	* Attach a file to the given vector store and wait for it to be processed.
	*/
	async createAndPoll(vectorStoreId, body, options) {
		const file = await this.create(vectorStoreId, body, options);
		return await this.poll(vectorStoreId, file.id, options);
	}
	/**
	* Wait for the vector store file to finish processing.
	*
	* Note: this will return even if the file failed to process, you need to check
	* file.last_error and file.status to handle these cases
	*/
	async poll(vectorStoreID, fileID, options) {
		const headers = buildHeaders([options?.headers, {
			"X-Stainless-Poll-Helper": "true",
			"X-Stainless-Custom-Poll-Interval": options?.pollIntervalMs?.toString() ?? void 0
		}]);
		while (true) {
			const fileResponse = await this.retrieve(fileID, { vector_store_id: vectorStoreID }, {
				...options,
				headers
			}).withResponse();
			const file = fileResponse.data;
			switch (file.status) {
				case "in_progress":
					let sleepInterval = 5e3;
					if (options?.pollIntervalMs) sleepInterval = options.pollIntervalMs;
					else {
						const headerInterval = fileResponse.response.headers.get("openai-poll-after-ms");
						if (headerInterval) {
							const headerIntervalMs = parseInt(headerInterval);
							if (!isNaN(headerIntervalMs)) sleepInterval = headerIntervalMs;
						}
					}
					await sleep(sleepInterval);
					break;
				case "failed":
				case "completed": return file;
			}
		}
	}
	/**
	* Upload a file to the `files` API and then attach it to the given vector store.
	*
	* Note the file will be asynchronously processed (you can use the alternative
	* polling helper method to wait for processing to complete).
	*/
	async upload(vectorStoreId, file, options) {
		const fileInfo = await this._client.files.create({
			file,
			purpose: "assistants"
		}, options);
		return this.create(vectorStoreId, { file_id: fileInfo.id }, options);
	}
	/**
	* Add a file to a vector store and poll until processing is complete.
	*/
	async uploadAndPoll(vectorStoreId, file, options) {
		const fileInfo = await this.upload(vectorStoreId, file, options);
		return await this.poll(vectorStoreId, fileInfo.id, options);
	}
	/**
	* Retrieve the parsed contents of a vector store file.
	*/
	content(fileID, params, options) {
		const { vector_store_id } = params;
		return this._client.getAPIList(path$1`/vector_stores/${vector_store_id}/files/${fileID}/content`, Page, {
			...options,
			headers: buildHeaders([{ "OpenAI-Beta": "assistants=v2" }, options?.headers]),
			__security: { bearerAuth: true }
		});
	}
};
//#endregion
//#region node_modules/openai/resources/vector-stores/vector-stores.mjs
var VectorStores = class extends APIResource {
	constructor() {
		super(...arguments);
		this.files = new Files(this._client);
		this.fileBatches = new FileBatches(this._client);
	}
	/**
	* Create a vector store.
	*/
	create(body, options) {
		return this._client.post("/vector_stores", {
			body,
			...options,
			headers: buildHeaders([{ "OpenAI-Beta": "assistants=v2" }, options?.headers]),
			__security: { bearerAuth: true }
		});
	}
	/**
	* Retrieves a vector store.
	*/
	retrieve(vectorStoreID, options) {
		return this._client.get(path$1`/vector_stores/${vectorStoreID}`, {
			...options,
			headers: buildHeaders([{ "OpenAI-Beta": "assistants=v2" }, options?.headers]),
			__security: { bearerAuth: true }
		});
	}
	/**
	* Modifies a vector store.
	*/
	update(vectorStoreID, body, options) {
		return this._client.post(path$1`/vector_stores/${vectorStoreID}`, {
			body,
			...options,
			headers: buildHeaders([{ "OpenAI-Beta": "assistants=v2" }, options?.headers]),
			__security: { bearerAuth: true }
		});
	}
	/**
	* Returns a list of vector stores.
	*/
	list(query = {}, options) {
		return this._client.getAPIList("/vector_stores", CursorPage, {
			query,
			...options,
			headers: buildHeaders([{ "OpenAI-Beta": "assistants=v2" }, options?.headers]),
			__security: { bearerAuth: true }
		});
	}
	/**
	* Delete a vector store.
	*/
	delete(vectorStoreID, options) {
		return this._client.delete(path$1`/vector_stores/${vectorStoreID}`, {
			...options,
			headers: buildHeaders([{ "OpenAI-Beta": "assistants=v2" }, options?.headers]),
			__security: { bearerAuth: true }
		});
	}
	/**
	* Search a vector store for relevant chunks based on a query and file attributes
	* filter.
	*/
	search(vectorStoreID, body, options) {
		return this._client.getAPIList(path$1`/vector_stores/${vectorStoreID}/search`, Page, {
			body,
			method: "post",
			...options,
			headers: buildHeaders([{ "OpenAI-Beta": "assistants=v2" }, options?.headers]),
			__security: { bearerAuth: true }
		});
	}
};
VectorStores.Files = Files;
VectorStores.FileBatches = FileBatches;
//#endregion
//#region node_modules/openai/resources/videos.mjs
var Videos = class extends APIResource {
	/**
	* Create a new video generation job from a prompt and optional reference assets.
	*/
	create(body, options) {
		return this._client.post("/videos", multipartFormRequestOptions({
			body,
			...options,
			__security: { bearerAuth: true }
		}, this._client));
	}
	/**
	* Fetch the latest metadata for a generated video.
	*/
	retrieve(videoID, options) {
		return this._client.get(path$1`/videos/${videoID}`, {
			...options,
			__security: { bearerAuth: true }
		});
	}
	/**
	* List recently generated videos for the current project.
	*/
	list(query = {}, options) {
		return this._client.getAPIList("/videos", ConversationCursorPage, {
			query,
			...options,
			__security: { bearerAuth: true }
		});
	}
	/**
	* Permanently delete a completed or failed video and its stored assets.
	*/
	delete(videoID, options) {
		return this._client.delete(path$1`/videos/${videoID}`, {
			...options,
			__security: { bearerAuth: true }
		});
	}
	/**
	* Create a character from an uploaded video.
	*/
	createCharacter(body, options) {
		return this._client.post("/videos/characters", multipartFormRequestOptions({
			body,
			...options,
			__security: { bearerAuth: true }
		}, this._client));
	}
	/**
	* Download the generated video bytes or a derived preview asset.
	*
	* Streams the rendered video content for the specified video job.
	*/
	downloadContent(videoID, query = {}, options) {
		return this._client.get(path$1`/videos/${videoID}/content`, {
			query,
			...options,
			headers: buildHeaders([{ Accept: "application/binary" }, options?.headers]),
			__security: { bearerAuth: true },
			__binaryResponse: true
		});
	}
	/**
	* Create a new video generation job by editing a source video or existing
	* generated video.
	*/
	edit(body, options) {
		return this._client.post("/videos/edits", multipartFormRequestOptions({
			body,
			...options,
			__security: { bearerAuth: true }
		}, this._client));
	}
	/**
	* Create an extension of a completed video.
	*/
	extend(body, options) {
		return this._client.post("/videos/extensions", multipartFormRequestOptions({
			body,
			...options,
			__security: { bearerAuth: true }
		}, this._client));
	}
	/**
	* Fetch a character.
	*/
	getCharacter(characterID, options) {
		return this._client.get(path$1`/videos/characters/${characterID}`, {
			...options,
			__security: { bearerAuth: true }
		});
	}
	/**
	* Create a remix of a completed video using a refreshed prompt.
	*/
	remix(videoID, body, options) {
		return this._client.post(path$1`/videos/${videoID}/remix`, maybeMultipartFormRequestOptions({
			body,
			...options,
			__security: { bearerAuth: true }
		}, this._client));
	}
};
//#endregion
//#region node_modules/openai/resources/webhooks/webhooks.mjs
var _Webhooks_instances;
var _Webhooks_validateSecret;
var _Webhooks_getRequiredHeader;
var Webhooks = class extends APIResource {
	constructor() {
		super(...arguments);
		_Webhooks_instances.add(this);
	}
	/**
	* Validates that the given payload was sent by OpenAI and parses the payload.
	*/
	async unwrap(payload, headers, secret = this._client.webhookSecret, tolerance = 300) {
		await this.verifySignature(payload, headers, secret, tolerance);
		return JSON.parse(payload);
	}
	/**
	* Validates whether or not the webhook payload was sent by OpenAI.
	*
	* An error will be raised if the webhook payload was not sent by OpenAI.
	*
	* @param payload - The webhook payload
	* @param headers - The webhook headers
	* @param secret - The webhook secret (optional, will use client secret if not provided)
	* @param tolerance - Maximum age of the webhook in seconds (default: 300 = 5 minutes)
	*/
	async verifySignature(payload, headers, secret = this._client.webhookSecret, tolerance = 300) {
		if (typeof crypto === "undefined" || typeof crypto.subtle.importKey !== "function" || typeof crypto.subtle.verify !== "function") throw new Error("Webhook signature verification is only supported when the `crypto` global is defined");
		__classPrivateFieldGet(this, _Webhooks_instances, "m", _Webhooks_validateSecret).call(this, secret);
		const headersObj = buildHeaders([headers]).values;
		const signatureHeader = __classPrivateFieldGet(this, _Webhooks_instances, "m", _Webhooks_getRequiredHeader).call(this, headersObj, "webhook-signature");
		const timestamp = __classPrivateFieldGet(this, _Webhooks_instances, "m", _Webhooks_getRequiredHeader).call(this, headersObj, "webhook-timestamp");
		const webhookId = __classPrivateFieldGet(this, _Webhooks_instances, "m", _Webhooks_getRequiredHeader).call(this, headersObj, "webhook-id");
		const timestampSeconds = parseInt(timestamp, 10);
		if (isNaN(timestampSeconds)) throw new InvalidWebhookSignatureError("Invalid webhook timestamp format");
		const nowSeconds = Math.floor(Date.now() / 1e3);
		if (nowSeconds - timestampSeconds > tolerance) throw new InvalidWebhookSignatureError("Webhook timestamp is too old");
		if (timestampSeconds > nowSeconds + tolerance) throw new InvalidWebhookSignatureError("Webhook timestamp is too new");
		const signatures = signatureHeader.split(" ").map((part) => part.startsWith("v1,") ? part.substring(3) : part);
		const decodedSecret = secret.startsWith("whsec_") ? Buffer.from(secret.replace("whsec_", ""), "base64") : Buffer.from(secret, "utf-8");
		const signedPayload = webhookId ? `${webhookId}.${timestamp}.${payload}` : `${timestamp}.${payload}`;
		const key = await crypto.subtle.importKey("raw", decodedSecret, {
			name: "HMAC",
			hash: "SHA-256"
		}, false, ["verify"]);
		for (const signature of signatures) try {
			const signatureBytes = Buffer.from(signature, "base64");
			if (await crypto.subtle.verify("HMAC", key, signatureBytes, new TextEncoder().encode(signedPayload))) return;
		} catch {
			continue;
		}
		throw new InvalidWebhookSignatureError("The given webhook signature does not match the expected signature");
	}
};
_Webhooks_instances = /* @__PURE__ */ new WeakSet(), _Webhooks_validateSecret = function _Webhooks_validateSecret(secret) {
	if (typeof secret !== "string" || secret.length === 0) throw new Error(`The webhook secret must either be set using the env var, OPENAI_WEBHOOK_SECRET, on the client class, OpenAI({ webhookSecret: '123' }), or passed to this function`);
}, _Webhooks_getRequiredHeader = function _Webhooks_getRequiredHeader(headers, name) {
	if (!headers) throw new Error(`Headers are required`);
	const value = headers.get(name);
	if (value === null || value === void 0) throw new Error(`Missing required header: ${name}`);
	return value;
};
//#endregion
//#region node_modules/openai/internal/provider.mjs
/**
* A provider factory such as `bedrock(options)` captures configuration in a
* definition, while every OpenAI client receives a fresh runtime from
* `definition.configure()`. Keeping definitions out of the provider object
* makes providers opaque and prevents arbitrary objects from imitating one.
* It also leaves provider-specific dependencies outside the core SDK.
*
* The registry lives on `globalThis` under a global symbol so a provider made
* by one copy of the package still works with another copy, including mixed
* CommonJS and ESM installations. The WeakMap avoids retaining discarded
* provider configurations.
*/
const providerDefinitionsKey = Symbol.for("openai.node.providerDefinitions.v1");
const providerGlobal = globalThis;
const existingProviderDefinitions = providerGlobal[providerDefinitionsKey];
const providerDefinitions = existingProviderDefinitions ?? /* @__PURE__ */ new WeakMap();
if (!existingProviderDefinitions) Object.defineProperty(providerGlobal, providerDefinitionsKey, { value: providerDefinitions });
function configureProvider(provider) {
	const definition = providerDefinitions.get(provider);
	if (!definition) throw new Error("Invalid provider. Providers must be created with createProvider().");
	return definition.configure();
}
//#endregion
//#region node_modules/openai/client.mjs
var _OpenAI_instances;
var _a;
var _OpenAI_encoder;
var _OpenAI_baseURLOverridden;
const WORKLOAD_IDENTITY_API_KEY_PLACEHOLDER = "workload-identity-auth";
/**
* API Client for interfacing with the OpenAI API.
*/
var OpenAI = class {
	/**
	* API Client for interfacing with the OpenAI API.
	*
	* @param {string | null | undefined} [opts.apiKey=process.env['OPENAI_API_KEY'] ?? null]
	* @param {string | null | undefined} [opts.adminAPIKey=process.env['OPENAI_ADMIN_KEY'] ?? null]
	* @param {string | null | undefined} [opts.organization=process.env['OPENAI_ORG_ID'] ?? null]
	* @param {string | null | undefined} [opts.project=process.env['OPENAI_PROJECT_ID'] ?? null]
	* @param {string | null | undefined} [opts.webhookSecret=process.env['OPENAI_WEBHOOK_SECRET'] ?? null]
	* @param {string} [opts.baseURL=process.env['OPENAI_BASE_URL'] ?? https://api.openai.com/v1] - Override the default base URL for the API.
	* @param {Provider} [opts.provider] - Configure a third-party API provider. Mutually exclusive with top-level authentication and base URL options.
	* @param {number} [opts.timeout=10 minutes] - The maximum amount of time (in milliseconds) the client will wait for a response before timing out.
	* @param {MergedRequestInit} [opts.fetchOptions] - Additional `RequestInit` options to be passed to `fetch` calls.
	* @param {Fetch} [opts.fetch] - Specify a custom `fetch` function implementation.
	* @param {number} [opts.maxRetries=2] - The maximum number of times the client will retry a request.
	* @param {HeadersLike} opts.defaultHeaders - Default headers to include with every request to the API.
	* @param {Record<string, string | undefined>} opts.defaultQuery - Default query parameters to include with every request to the API.
	* @param {boolean} [opts.dangerouslyAllowBrowser=false] - By default, client-side use of this library is not allowed, as it risks exposing your secret API credentials to attackers.
	*/
	constructor(clientOptions = {}) {
		_OpenAI_instances.add(this);
		_OpenAI_encoder.set(this, void 0);
		/**
		* Given a prompt, the model will return one or more predicted completions, and can also return the probabilities of alternative tokens at each position.
		*/
		this.completions = new Completions(this);
		this.chat = new Chat(this);
		/**
		* Get a vector representation of a given input that can be easily consumed by machine learning models and algorithms.
		*/
		this.embeddings = new Embeddings(this);
		/**
		* Files are used to upload documents that can be used with features like Assistants and Fine-tuning.
		*/
		this.files = new Files$1(this);
		/**
		* Given a prompt and/or an input image, the model will generate a new image.
		*/
		this.images = new Images(this);
		this.audio = new Audio(this);
		/**
		* Given text and/or image inputs, classifies if those inputs are potentially harmful.
		*/
		this.moderations = new Moderations(this);
		/**
		* List and describe the various models available in the API.
		*/
		this.models = new Models(this);
		this.fineTuning = new FineTuning(this);
		this.graders = new Graders(this);
		this.vectorStores = new VectorStores(this);
		this.webhooks = new Webhooks(this);
		this.beta = new Beta(this);
		/**
		* Create large batches of API requests to run asynchronously.
		*/
		this.batches = new Batches(this);
		/**
		* Use Uploads to upload large files in multiple parts.
		*/
		this.uploads = new Uploads(this);
		this.admin = new Admin(this);
		this.responses = new Responses(this);
		this.realtime = new Realtime(this);
		/**
		* Manage conversations and conversation items.
		*/
		this.conversations = new Conversations(this);
		/**
		* Manage and run evals in the OpenAI platform.
		*/
		this.evals = new Evals(this);
		this.containers = new Containers(this);
		this.skills = new Skills(this);
		this.videos = new Videos(this);
		const provider = clientOptions.provider;
		if (provider) {
			const conflictingOptions = [
				"apiKey",
				"adminAPIKey",
				"workloadIdentity",
				"baseURL"
			].filter((key) => clientOptions[key] != null);
			if (conflictingOptions.length) throw new OpenAIError(`The \`provider\` option cannot be used with ${conflictingOptions.map((key) => `\`${key}\``).join(", ")}. Configure authentication and the base URL through the provider instead.`);
		}
		const { baseURL = provider ? null : readEnv("OPENAI_BASE_URL"), apiKey = provider ? null : readEnv("OPENAI_API_KEY") ?? null, adminAPIKey = provider ? null : readEnv("OPENAI_ADMIN_KEY") ?? null, organization = provider ? null : readEnv("OPENAI_ORG_ID") ?? null, project = provider ? null : readEnv("OPENAI_PROJECT_ID") ?? null, webhookSecret = readEnv("OPENAI_WEBHOOK_SECRET") ?? null, workloadIdentity, ...opts } = clientOptions;
		const providerRuntime = provider ? configureProvider(provider) : void 0;
		const options = {
			apiKey,
			adminAPIKey,
			organization,
			project,
			webhookSecret,
			workloadIdentity,
			provider,
			...opts,
			baseURL: providerRuntime?.baseURL ?? (baseURL || `https://api.openai.com/v1`)
		};
		if (apiKey && workloadIdentity) throw new OpenAIError("The `apiKey` and `workloadIdentity` options are mutually exclusive");
		if (!providerRuntime && !apiKey && !adminAPIKey && !workloadIdentity) throw new OpenAIError("Missing credentials. Please pass an `apiKey`, `workloadIdentity`, `adminAPIKey`, or set the `OPENAI_API_KEY` or `OPENAI_ADMIN_KEY` environment variable.");
		if (!options.dangerouslyAllowBrowser && isRunningInBrowser()) throw new OpenAIError("It looks like you're running in a browser-like environment.\n\nThis is disabled by default, as it risks exposing your secret API credentials to attackers.\nIf you understand the risks and have appropriate mitigations in place,\nyou can set the `dangerouslyAllowBrowser` option to `true`, e.g.,\n\nnew OpenAI({ apiKey, dangerouslyAllowBrowser: true });\n\nhttps://help.openai.com/en/articles/5112595-best-practices-for-api-key-safety\n");
		this.baseURL = options.baseURL;
		this.timeout = options.timeout ?? _a.DEFAULT_TIMEOUT;
		this.logger = options.logger ?? console;
		const defaultLogLevel = "warn";
		this.logLevel = defaultLogLevel;
		this.logLevel = parseLogLevel(options.logLevel, "ClientOptions.logLevel", this) ?? parseLogLevel(readEnv("OPENAI_LOG"), "process.env['OPENAI_LOG']", this) ?? defaultLogLevel;
		this.fetchOptions = options.fetchOptions;
		this.maxRetries = options.maxRetries ?? 2;
		this.fetch = options.fetch ?? getDefaultFetch();
		__classPrivateFieldSet(this, _OpenAI_encoder, FallbackEncoder, "f");
		const customHeadersEnv = provider ? void 0 : readEnv("OPENAI_CUSTOM_HEADERS");
		if (customHeadersEnv) {
			const parsed = {};
			for (const line of customHeadersEnv.split("\n")) {
				const colon = line.indexOf(":");
				if (colon >= 0) parsed[line.substring(0, colon).trim()] = line.substring(colon + 1).trim();
			}
			options.defaultHeaders = buildHeaders([parsed, options.defaultHeaders]);
		}
		this._options = options;
		this._provider = providerRuntime;
		if (workloadIdentity) this._workloadIdentityAuth = new WorkloadIdentityAuth(workloadIdentity, this.fetch);
		this.apiKey = typeof apiKey === "string" ? apiKey : null;
		this.adminAPIKey = adminAPIKey;
		this.organization = organization;
		this.project = project;
		this.webhookSecret = webhookSecret;
	}
	/**
	* Create a new client instance re-using the same options given to the current client with optional overriding.
	*/
	withOptions(options) {
		const inheritedProvider = this._options.provider;
		const provider = options.provider ?? inheritedProvider;
		const inheritedOptions = {
			...this._options,
			baseURL: this.baseURL,
			maxRetries: this.maxRetries,
			timeout: this.timeout,
			logger: this.logger,
			logLevel: this.logLevel,
			fetch: this.fetch,
			fetchOptions: this.fetchOptions,
			apiKey: this._options.apiKey,
			adminAPIKey: this.adminAPIKey,
			workloadIdentity: this._options.workloadIdentity,
			organization: this.organization,
			project: this.project,
			webhookSecret: this.webhookSecret
		};
		if (provider) {
			delete inheritedOptions.apiKey;
			delete inheritedOptions.adminAPIKey;
			delete inheritedOptions.workloadIdentity;
			delete inheritedOptions.baseURL;
			if (provider !== inheritedProvider) {
				delete inheritedOptions.organization;
				delete inheritedOptions.project;
				delete inheritedOptions.defaultHeaders;
			}
		}
		return new this.constructor({
			...inheritedOptions,
			...options,
			provider
		});
	}
	defaultQuery() {
		return this._options.defaultQuery;
	}
	validateHeaders({ values, nulls }, schemes = {
		bearerAuth: true,
		adminAPIKeyAuth: true
	}) {
		if (values.get("authorization") || values.get("api-key")) return;
		if (nulls.has("authorization") || nulls.has("api-key")) return;
		if (this._workloadIdentityAuth && schemes.bearerAuth) return;
		throw new Error("Could not resolve authentication method. Expected either apiKey or adminAPIKey to be set. Or for one of the \"Authorization\" or \"api-key\" headers to be explicitly omitted");
	}
	async authHeaders(opts, schemes = {
		bearerAuth: true,
		adminAPIKeyAuth: true
	}) {
		return buildHeaders([schemes.bearerAuth ? await this.bearerAuth(opts) : null, schemes.adminAPIKeyAuth ? await this.adminAPIKeyAuth(opts) : null]);
	}
	async bearerAuth(opts) {
		if (this._workloadIdentityAuth) return buildHeaders([{ Authorization: `Bearer ${await this._workloadIdentityAuth.getToken()}` }]);
		if (this.apiKey == null) return;
		return buildHeaders([{ Authorization: `Bearer ${this.apiKey}` }]);
	}
	async adminAPIKeyAuth(opts) {
		if (this.adminAPIKey == null) return;
		return buildHeaders([{ Authorization: `Bearer ${this.adminAPIKey}` }]);
	}
	stringifyQuery(query) {
		return stringifyQuery(query);
	}
	getUserAgent() {
		return `${this.constructor.name}/JS 6.45.0`;
	}
	defaultIdempotencyKey() {
		return `stainless-node-retry-${uuid4()}`;
	}
	makeStatusError(status, error, message, headers) {
		return APIError.generate(status, error, message, headers);
	}
	async _callApiKey() {
		if (this._provider) return false;
		const apiKey = this._options.apiKey;
		if (typeof apiKey !== "function") return false;
		let token;
		try {
			token = await apiKey();
		} catch (err) {
			if (err instanceof OpenAIError) throw err;
			throw new OpenAIError(`Failed to get token from 'apiKey' function: ${err.message}`, { cause: err });
		}
		if (typeof token !== "string" || !token) throw new OpenAIError(`Expected 'apiKey' function argument to return a string but it returned ${token}`);
		this.apiKey = token;
		return true;
	}
	buildURL(path, query, defaultBaseURL) {
		const baseURL = !__classPrivateFieldGet(this, _OpenAI_instances, "m", _OpenAI_baseURLOverridden).call(this) && defaultBaseURL || this.baseURL;
		const url = isAbsoluteURL(path) ? new URL(path) : new URL(baseURL + (baseURL.endsWith("/") && path.startsWith("/") ? path.slice(1) : path));
		const defaultQuery = this.defaultQuery();
		const pathQuery = Object.fromEntries(url.searchParams);
		if (!isEmptyObj(defaultQuery) || !isEmptyObj(pathQuery)) query = {
			...pathQuery,
			...defaultQuery,
			...query
		};
		if (typeof query === "object" && query && !Array.isArray(query)) url.search = this.stringifyQuery(query);
		return url.toString();
	}
	/**
	* Used as a callback for mutating the given `FinalRequestOptions` object.
	*/
	async prepareOptions(options) {
		if (this._provider) return;
		if ((options.__security ?? { bearerAuth: true }).bearerAuth) await this._callApiKey();
	}
	/**
	* Used as a callback for mutating the given `RequestInit` object.
	*
	* This is useful for cases where you want to add certain headers based off of
	* the request properties, e.g. `method` or `url`.
	*/
	async prepareRequest(request, { url, options }) {}
	get(path, opts) {
		return this.methodRequest("get", path, opts);
	}
	post(path, opts) {
		return this.methodRequest("post", path, opts);
	}
	patch(path, opts) {
		return this.methodRequest("patch", path, opts);
	}
	put(path, opts) {
		return this.methodRequest("put", path, opts);
	}
	delete(path, opts) {
		return this.methodRequest("delete", path, opts);
	}
	methodRequest(method, path, opts) {
		return this.request(Promise.resolve(opts).then((opts) => {
			return {
				method,
				path,
				...opts
			};
		}));
	}
	request(options, remainingRetries = null) {
		return new APIPromise(this, this.makeRequest(options, remainingRetries, void 0));
	}
	async makeRequest(optionsInput, retriesRemaining, retryOfRequestLogID) {
		const options = await optionsInput;
		const maxRetries = options.maxRetries ?? this.maxRetries;
		if (retriesRemaining == null) retriesRemaining = maxRetries;
		await this.prepareOptions(options);
		const { req, url, timeout } = await this.buildRequest(options, { retryCount: maxRetries - retriesRemaining });
		await this.prepareRequest(req, {
			url,
			options
		});
		await this._provider?.prepareRequest?.(req, {
			url,
			options
		});
		/** Not an API request ID, just for correlating local log entries. */
		const requestLogID = "log_" + (Math.random() * (1 << 24) | 0).toString(16).padStart(6, "0");
		const retryLogStr = retryOfRequestLogID === void 0 ? "" : `, retryOf: ${retryOfRequestLogID}`;
		const startTime = Date.now();
		loggerFor(this).debug(`[${requestLogID}] sending request`, formatRequestDetails({
			retryOfRequestLogID,
			method: options.method,
			url,
			options,
			headers: req.headers
		}));
		if (options.signal?.aborted) throw new APIUserAbortError();
		const security = options.__security ?? { bearerAuth: true };
		const controller = new AbortController();
		const response = await this.fetchWithAuth(url, req, timeout, controller, security).catch(castToError);
		const headersTime = Date.now();
		if (response instanceof globalThis.Error) {
			const retryMessage = `retrying, ${retriesRemaining} attempts remaining`;
			if (options.signal?.aborted) throw new APIUserAbortError();
			const isTimeout = isAbortError(response) || /timed? ?out/i.test(String(response) + ("cause" in response ? String(response.cause) : ""));
			if (retriesRemaining) {
				loggerFor(this).info(`[${requestLogID}] connection ${isTimeout ? "timed out" : "failed"} - ${retryMessage}`);
				loggerFor(this).debug(`[${requestLogID}] connection ${isTimeout ? "timed out" : "failed"} (${retryMessage})`, formatRequestDetails({
					retryOfRequestLogID,
					url,
					durationMs: headersTime - startTime,
					message: response.message
				}));
				return this.retryRequest(options, retriesRemaining, retryOfRequestLogID ?? requestLogID);
			}
			loggerFor(this).info(`[${requestLogID}] connection ${isTimeout ? "timed out" : "failed"} - error; no more retries left`);
			loggerFor(this).debug(`[${requestLogID}] connection ${isTimeout ? "timed out" : "failed"} (error; no more retries left)`, formatRequestDetails({
				retryOfRequestLogID,
				url,
				durationMs: headersTime - startTime,
				message: response.message
			}));
			if (response instanceof OAuthError || response instanceof SubjectTokenProviderError) throw response;
			if (isTimeout) throw new APIConnectionTimeoutError();
			throw new APIConnectionError({
				message: getConnectionErrorMessage(response),
				cause: response
			});
		}
		const responseInfo = `[${requestLogID}${retryLogStr}${[...response.headers.entries()].filter(([name]) => name === "x-request-id").map(([name, value]) => ", " + name + ": " + JSON.stringify(value)).join("")}] ${req.method} ${url} ${response.ok ? "succeeded" : "failed"} with status ${response.status} in ${headersTime - startTime}ms`;
		if (!response.ok) {
			if (response.status === 401 && this._workloadIdentityAuth && security.bearerAuth && !options.__metadata?.["hasStreamingBody"] && !options.__metadata?.["workloadIdentityTokenRefreshed"]) {
				await CancelReadableStream(response.body);
				this._workloadIdentityAuth.invalidateToken();
				return this.makeRequest({
					...options,
					__metadata: {
						...options.__metadata,
						workloadIdentityTokenRefreshed: true
					}
				}, retriesRemaining, retryOfRequestLogID ?? requestLogID);
			}
			const shouldRetry = await this.shouldRetry(response);
			if (retriesRemaining && shouldRetry) {
				const retryMessage = `retrying, ${retriesRemaining} attempts remaining`;
				await CancelReadableStream(response.body);
				loggerFor(this).info(`${responseInfo} - ${retryMessage}`);
				loggerFor(this).debug(`[${requestLogID}] response error (${retryMessage})`, formatRequestDetails({
					retryOfRequestLogID,
					url: response.url,
					status: response.status,
					headers: response.headers,
					durationMs: headersTime - startTime
				}));
				return this.retryRequest(options, retriesRemaining, retryOfRequestLogID ?? requestLogID, response.headers);
			}
			const retryMessage = shouldRetry ? `error; no more retries left` : `error; not retryable`;
			loggerFor(this).info(`${responseInfo} - ${retryMessage}`);
			const errText = await response.text().catch((err) => castToError(err).message);
			const errJSON = safeJSON(errText);
			const errMessage = errJSON ? void 0 : errText;
			loggerFor(this).debug(`[${requestLogID}] response error (${retryMessage})`, formatRequestDetails({
				retryOfRequestLogID,
				url: response.url,
				status: response.status,
				headers: response.headers,
				message: errMessage,
				durationMs: Date.now() - startTime
			}));
			throw this.makeStatusError(response.status, errJSON, errMessage, response.headers);
		}
		loggerFor(this).info(responseInfo);
		loggerFor(this).debug(`[${requestLogID}] response start`, formatRequestDetails({
			retryOfRequestLogID,
			url: response.url,
			status: response.status,
			headers: response.headers,
			durationMs: headersTime - startTime
		}));
		return {
			response,
			options,
			controller,
			requestLogID,
			retryOfRequestLogID,
			startTime
		};
	}
	getAPIList(path, Page, opts) {
		return this.requestAPIList(Page, opts && "then" in opts ? opts.then((opts) => ({
			method: "get",
			path,
			...opts
		})) : {
			method: "get",
			path,
			...opts
		});
	}
	requestAPIList(Page, options) {
		const request = this.makeRequest(options, null, void 0);
		return new PagePromise(this, request, Page);
	}
	async fetchWithAuth(url, init, timeout, controller, schemes = {
		bearerAuth: true,
		adminAPIKeyAuth: true
	}) {
		if (this._workloadIdentityAuth && schemes.bearerAuth) {
			const headers = init.headers;
			const authHeader = headers.get("Authorization");
			if (!authHeader || authHeader === `Bearer ${WORKLOAD_IDENTITY_API_KEY_PLACEHOLDER}`) {
				const token = await this._workloadIdentityAuth.getToken();
				headers.set("Authorization", `Bearer ${token}`);
			}
		}
		return await this.fetchWithTimeout(url, init, timeout, controller);
	}
	async fetchWithTimeout(url, init, ms, controller) {
		const { signal, method, ...options } = init || {};
		const abort = this._makeAbort(controller);
		if (signal) signal.addEventListener("abort", abort, { once: true });
		const timeout = setTimeout(abort, ms);
		const isReadableBody = globalThis.ReadableStream && options.body instanceof globalThis.ReadableStream || typeof options.body === "object" && options.body !== null && Symbol.asyncIterator in options.body;
		const fetchOptions = {
			signal: controller.signal,
			...isReadableBody ? { duplex: "half" } : {},
			method: "GET",
			...options
		};
		if (method) fetchOptions.method = method.toUpperCase();
		try {
			return await this.fetch.call(void 0, url, fetchOptions);
		} finally {
			clearTimeout(timeout);
		}
	}
	async shouldRetry(response) {
		const shouldRetryHeader = response.headers.get("x-should-retry");
		if (shouldRetryHeader === "true") return true;
		if (shouldRetryHeader === "false") return false;
		if (response.status === 408) return true;
		if (response.status === 409) return true;
		if (response.status === 429) return true;
		if (response.status >= 500) return true;
		return false;
	}
	async retryRequest(options, retriesRemaining, requestLogID, responseHeaders) {
		let timeoutMillis;
		const retryAfterMillisHeader = responseHeaders?.get("retry-after-ms");
		if (retryAfterMillisHeader) {
			const timeoutMs = parseFloat(retryAfterMillisHeader);
			if (!Number.isNaN(timeoutMs)) timeoutMillis = timeoutMs;
		}
		const retryAfterHeader = responseHeaders?.get("retry-after");
		if (retryAfterHeader && !timeoutMillis) {
			const timeoutSeconds = parseFloat(retryAfterHeader);
			if (!Number.isNaN(timeoutSeconds)) timeoutMillis = timeoutSeconds * 1e3;
			else timeoutMillis = Date.parse(retryAfterHeader) - Date.now();
		}
		if (timeoutMillis === void 0) {
			const maxRetries = options.maxRetries ?? this.maxRetries;
			timeoutMillis = this.calculateDefaultRetryTimeoutMillis(retriesRemaining, maxRetries);
		}
		await sleep(timeoutMillis);
		return this.makeRequest(options, retriesRemaining - 1, requestLogID);
	}
	calculateDefaultRetryTimeoutMillis(retriesRemaining, maxRetries) {
		const initialRetryDelay = .5;
		const maxRetryDelay = 8;
		const numRetries = maxRetries - retriesRemaining;
		return Math.min(initialRetryDelay * Math.pow(2, numRetries), maxRetryDelay) * (1 - Math.random() * .25) * 1e3;
	}
	async buildRequest(inputOptions, { retryCount = 0 } = {}) {
		const options = { ...inputOptions };
		const { method, path, query, defaultBaseURL } = options;
		const url = this.buildURL(path, query, defaultBaseURL);
		if ("timeout" in options) validatePositiveInteger("timeout", options.timeout);
		options.timeout = options.timeout ?? this.timeout;
		const { bodyHeaders, body, isStreamingBody } = this.buildBody({ options });
		if (isStreamingBody) inputOptions.__metadata = {
			...inputOptions.__metadata,
			hasStreamingBody: true
		};
		return {
			req: {
				method,
				headers: await this.buildHeaders({
					options: inputOptions,
					method,
					bodyHeaders,
					retryCount
				}),
				...options.signal && { signal: options.signal },
				...globalThis.ReadableStream && body instanceof globalThis.ReadableStream && { duplex: "half" },
				...body && { body },
				...this.fetchOptions ?? {},
				...options.fetchOptions ?? {}
			},
			url,
			timeout: options.timeout
		};
	}
	async buildHeaders({ options, method, bodyHeaders, retryCount }) {
		let idempotencyHeaders = {};
		if (this.idempotencyHeader && method !== "get") {
			if (!options.idempotencyKey) options.idempotencyKey = this.defaultIdempotencyKey();
			idempotencyHeaders[this.idempotencyHeader] = options.idempotencyKey;
		}
		const headers = buildHeaders([
			idempotencyHeaders,
			{
				Accept: "application/json",
				"User-Agent": this.getUserAgent(),
				"X-Stainless-Retry-Count": String(retryCount),
				...options.timeout ? { "X-Stainless-Timeout": String(Math.trunc(options.timeout / 1e3)) } : {},
				...getPlatformHeaders(),
				"OpenAI-Organization": this.organization,
				"OpenAI-Project": this.project
			},
			this._provider ? void 0 : await this.authHeaders(options, options.__security ?? { bearerAuth: true }),
			this._options.defaultHeaders,
			bodyHeaders,
			options.headers
		]);
		if (!this._provider) this.validateHeaders(headers, options.__security ?? { bearerAuth: true });
		return headers.values;
	}
	_makeAbort(controller) {
		return () => controller.abort();
	}
	buildBody({ options }) {
		const { body, headers: rawHeaders } = options;
		if (!body) {
			if (body === void 0 && "body" in options) return {
				...__classPrivateFieldGet(this, _OpenAI_encoder, "f").call(this, {
					body,
					headers: buildHeaders([rawHeaders])
				}),
				isStreamingBody: false
			};
			return {
				bodyHeaders: void 0,
				body: void 0,
				isStreamingBody: false
			};
		}
		const headers = buildHeaders([rawHeaders]);
		const isReadableStream = typeof globalThis.ReadableStream !== "undefined" && body instanceof globalThis.ReadableStream;
		const isRetryableBody = !isReadableStream && (typeof body === "string" || body instanceof ArrayBuffer || ArrayBuffer.isView(body) || typeof globalThis.Blob !== "undefined" && body instanceof globalThis.Blob || body instanceof URLSearchParams || body instanceof FormData);
		if (ArrayBuffer.isView(body) || body instanceof ArrayBuffer || body instanceof DataView || typeof body === "string" && headers.values.has("content-type") || globalThis.Blob && body instanceof globalThis.Blob || body instanceof FormData || body instanceof URLSearchParams || isReadableStream) return {
			bodyHeaders: void 0,
			body,
			isStreamingBody: !isRetryableBody
		};
		else if (typeof body === "object" && (Symbol.asyncIterator in body || Symbol.iterator in body && "next" in body && typeof body.next === "function")) return {
			bodyHeaders: void 0,
			body: ReadableStreamFrom(body),
			isStreamingBody: true
		};
		else if (typeof body === "object" && headers.values.get("content-type") === "application/x-www-form-urlencoded") return {
			bodyHeaders: { "content-type": "application/x-www-form-urlencoded" },
			body: this.stringifyQuery(body),
			isStreamingBody: false
		};
		else return {
			...__classPrivateFieldGet(this, _OpenAI_encoder, "f").call(this, {
				body,
				headers
			}),
			isStreamingBody: false
		};
	}
};
_a = OpenAI, _OpenAI_encoder = /* @__PURE__ */ new WeakMap(), _OpenAI_instances = /* @__PURE__ */ new WeakSet(), _OpenAI_baseURLOverridden = function _OpenAI_baseURLOverridden() {
	return this._provider !== void 0 || this.baseURL !== "https://api.openai.com/v1";
};
OpenAI.OpenAI = _a;
OpenAI.DEFAULT_TIMEOUT = 6e5;
OpenAI.OpenAIError = OpenAIError;
OpenAI.APIError = APIError;
OpenAI.APIConnectionError = APIConnectionError;
OpenAI.APIConnectionTimeoutError = APIConnectionTimeoutError;
OpenAI.APIUserAbortError = APIUserAbortError;
OpenAI.NotFoundError = NotFoundError;
OpenAI.ConflictError = ConflictError;
OpenAI.RateLimitError = RateLimitError;
OpenAI.BadRequestError = BadRequestError;
OpenAI.AuthenticationError = AuthenticationError;
OpenAI.InternalServerError = InternalServerError;
OpenAI.PermissionDeniedError = PermissionDeniedError;
OpenAI.UnprocessableEntityError = UnprocessableEntityError;
OpenAI.InvalidWebhookSignatureError = InvalidWebhookSignatureError;
OpenAI.toFile = toFile;
OpenAI.Completions = Completions;
OpenAI.Chat = Chat;
OpenAI.Embeddings = Embeddings;
OpenAI.Files = Files$1;
OpenAI.Images = Images;
OpenAI.Audio = Audio;
OpenAI.Moderations = Moderations;
OpenAI.Models = Models;
OpenAI.FineTuning = FineTuning;
OpenAI.Graders = Graders;
OpenAI.VectorStores = VectorStores;
OpenAI.Webhooks = Webhooks;
OpenAI.Beta = Beta;
OpenAI.Batches = Batches;
OpenAI.Uploads = Uploads;
OpenAI.Admin = Admin;
OpenAI.Responses = Responses;
OpenAI.Realtime = Realtime;
OpenAI.Conversations = Conversations;
OpenAI.Evals = Evals;
OpenAI.Containers = Containers;
OpenAI.Skills = Skills;
OpenAI.Videos = Videos;
function getConnectionErrorMessage(error) {
	if (isUndiciDispatcherVersionMismatchError(error)) return `Connection error. This may be caused by passing an undici dispatcher, such as ProxyAgent, that is incompatible with the fetch implementation. If you are using undici's ProxyAgent, pass the fetch implementation from the same undici package: import { fetch, ProxyAgent } from 'undici'; new OpenAI({ fetch, fetchOptions: { dispatcher: new ProxyAgent(...) } });`;
}
function isUndiciDispatcherVersionMismatchError(error) {
	let current = error;
	for (let i = 0; i < 8 && current && typeof current === "object"; i++) {
		const err = current;
		if (err.code === "UND_ERR_INVALID_ARG" && typeof err.message === "string" && err.message.includes("invalid onRequestStart method")) return true;
		current = err.cause;
	}
	return false;
}
//#endregion
//#region lib/embeddings.ts
const DEFAULT_MODEL = "text-embedding-3-small";
const EMBEDDING_DIM = 1536;
let client = null;
function getOpenAiClient() {
	if (!client) {
		const key = process.env.OPENAI_API_KEY?.trim();
		if (!key) throw new Error("Missing OPENAI_API_KEY");
		client = new OpenAI({ apiKey: key });
	}
	return client;
}
function isEmbeddingAvailable() {
	return Boolean(process.env.OPENAI_API_KEY?.trim());
}
function getEmbeddingModel() {
	return process.env.OPENAI_EMBEDDING_MODEL?.trim() || DEFAULT_MODEL;
}
async function embedTexts(texts) {
	if (texts.length === 0) return [];
	const openai = getOpenAiClient();
	const model = getEmbeddingModel();
	return [...(await openai.embeddings.create({
		model,
		input: texts
	})).data].sort((a, b) => a.index - b.index).map((row) => {
		if (row.embedding.length !== EMBEDDING_DIM) throw new Error(`Unexpected embedding dimension: ${row.embedding.length}`);
		return row.embedding;
	});
}
async function embedText(text) {
	const [embedding] = await embedTexts([text]);
	return embedding;
}
//#endregion
//#region lib/knowledge.ts
function isKnowledgeConfigured() {
	return isSupabaseConfigured() && isEmbeddingAvailable();
}
function mapMatchRow(row) {
	return {
		id: String(row.id),
		documentId: String(row.document_id),
		title: String(row.title ?? ""),
		content: String(row.content ?? ""),
		sourceType: String(row.source_type),
		tags: Array.isArray(row.tags) ? row.tags.map(String) : [],
		performanceWeight: Number(row.performance_weight ?? .5),
		similarity: Number(row.similarity ?? 0),
		combinedScore: Number(row.combined_score ?? 0)
	};
}
async function searchKnowledge(input) {
	if (!isKnowledgeConfigured()) return [];
	const query = input.query.trim();
	if (!query) return [];
	const embedding = await embedText(query);
	const { data, error } = await getSupabaseAdmin().rpc("match_knowledge_chunks", {
		query_embedding: embedding,
		match_count: input.topK ?? 5,
		filter_source_type: input.sourceType ?? null,
		filter_language: input.language ?? null
	});
	if (error) throw new Error(error.message);
	return (data ?? []).map((row) => mapMatchRow(row));
}
//#endregion
//#region lib/ragContext.ts
const SOURCE_LABELS = {
	brand_guide: {
		en: "Brand guide",
		zh: "品牌指南"
	},
	product_desc: {
		en: "Product description",
		zh: "产品描述"
	},
	history_copy: {
		en: "Historical copy",
		zh: "历史文案"
	},
	subreddit_rules: {
		en: "Subreddit rules",
		zh: "版块规则"
	},
	campaign_strategy: {
		en: "Campaign strategy",
		zh: "Campaign 策略"
	}
};
function buildRagQueryFromReport(report) {
	return [
		report.summary,
		...report.painPoints.slice(0, 4),
		...report.praisedFeatures.slice(0, 3),
		...report.mentionedBrands.slice(0, 4),
		...report.highFrequencyWords.slice(0, 6)
	].filter(Boolean).join(" ").slice(0, 2e3);
}
function buildRagQueryFromPrompt(subreddit, instruction) {
	return `${subreddit} ${instruction}`.trim().slice(0, 2e3);
}
async function retrieveRagMatches(input) {
	if (!isKnowledgeConfigured()) return [];
	const query = input.query.trim();
	if (!query) return [];
	const topK = input.topK ?? 5;
	const sourceTypes = input.sourceTypes?.length ? input.sourceTypes : [
		"brand_guide",
		"product_desc",
		"history_copy",
		"campaign_strategy"
	];
	const perType = Math.max(2, Math.ceil(topK / sourceTypes.length));
	const seen = /* @__PURE__ */ new Set();
	const merged = [];
	for (const sourceType of sourceTypes) {
		const rows = await searchKnowledge({
			query,
			topK: perType,
			sourceType,
			language: input.language
		});
		for (const row of rows) {
			if (seen.has(row.id)) continue;
			seen.add(row.id);
			merged.push(row);
		}
	}
	merged.sort((a, b) => b.combinedScore - a.combinedScore);
	return merged.slice(0, topK);
}
function formatRagContextBlock(matches, language) {
	if (matches.length === 0) return "";
	return `\n${language === "zh" ? "## 知识库参考（RAG 检索 — 借鉴语气与事实，勿逐字抄袭）" : "## Knowledge base references (RAG — borrow voice and facts, do NOT copy verbatim)"}\n${matches.map((match, index) => {
		const label = SOURCE_LABELS[match.sourceType]?.[language] ?? match.sourceType;
		const score = match.combinedScore.toFixed(2);
		return `[${index + 1}] (${label}, score ${score}) ${match.title}\n${match.content.slice(0, 900)}`;
	}).join("\n\n")}\n`;
}
async function buildRagPromptSection(input) {
	return formatRagContextBlock(await retrieveRagMatches({
		query: input.query,
		language: input.language,
		topK: input.topK ?? 5
	}), input.language);
}
//#endregion
//#region lib/llm.ts
function normalizeAiProvider(raw) {
	const s = String(raw ?? "").trim().toLowerCase();
	if (s === "minimax" || s === "minimax2.7" || s === "minimax-2.7") return "minimax";
	return "gemini";
}
function getDefaultAiProvider() {
	const configured = process.env.AI_PROVIDER || process.env.LLM_PROVIDER;
	if (configured) return normalizeAiProvider(configured);
	if (process.env.MINIMAX_API_KEY && !process.env.GEMINI_API_KEY) return "minimax";
	return "gemini";
}
function parseJsonObject(raw) {
	const cleaned = raw.trim().replace(/^```(?:json)?\s*/i, "").replace(/```$/i, "").trim();
	try {
		return JSON.parse(cleaned);
	} catch {
		const start = cleaned.indexOf("{");
		const end = cleaned.lastIndexOf("}");
		if (start >= 0 && end > start) return JSON.parse(cleaned.slice(start, end + 1));
		throw new Error("AI response was not valid JSON");
	}
}
function requireEnv(name) {
	const value = process.env[name]?.trim();
	if (!value) throw new Error(`Missing ${name}`);
	return value;
}
async function generateJsonWithGemini(prompt, schema, model = process.env.GEMINI_MODEL || "gemini-3.1-pro-preview") {
	const text = (await new GoogleGenAI({ apiKey: requireEnv("GEMINI_API_KEY") }).models.generateContent({
		model,
		contents: prompt,
		config: {
			responseMimeType: "application/json",
			responseSchema: normalizeGeminiSchema(schema)
		}
	})).text;
	if (!text) throw new Error("No response from Gemini");
	return parseJsonObject(text);
}
function normalizeGeminiSchema(value) {
	if (Array.isArray(value)) return value.map(normalizeGeminiSchema);
	if (!value || typeof value !== "object") return value;
	const out = {};
	for (const [key, raw] of Object.entries(value)) if (key === "type" && typeof raw === "string") out[key] = raw.toUpperCase();
	else out[key] = normalizeGeminiSchema(raw);
	return out;
}
async function generateJsonWithMiniMax(prompt, model = process.env.MINIMAX_MODEL || "MiniMax-M2.7") {
	const apiKey = requireEnv("MINIMAX_API_KEY");
	const endpoint = `${(process.env.MINIMAX_BASE_URL || "https://api.minimax.io/v1").replace(/\/+$/, "")}/chat/completions`;
	const response = await fetch(endpoint, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${apiKey}`
		},
		body: JSON.stringify({
			model,
			messages: [{
				role: "system",
				content: "You are a strict JSON API. Return only one valid JSON object. No markdown, no code fences, no commentary."
			}, {
				role: "user",
				content: prompt
			}],
			temperature: .7,
			response_format: { type: "json_object" }
		})
	});
	if (!response.ok) {
		const message = await response.text().catch(() => "");
		const keyHint = `key=${apiKey.slice(0, 6)}…`;
		const urlHint = `url=${endpoint}`;
		throw new Error(`MiniMax API failed (${response.status}): ${message || response.statusText}\n[调试信息] ${urlHint}, ${keyHint}\n[常见原因] 国际版 Key 请使用 https://api.minimax.io/v1；中国大陆版 Key 请在 Vercel 中将 MINIMAX_BASE_URL 设为 https://api.minimax.chat/v1`);
	}
	const text = (await response.json()).choices?.[0]?.message?.content;
	if (!text) throw new Error("No response from MiniMax");
	return parseJsonObject(text);
}
async function generateJsonObject(prompt, schema, provider = getDefaultAiProvider(), options = {}) {
	if (provider === "minimax") return generateJsonWithMiniMax(prompt, options.minimaxModel);
	return generateJsonWithGemini(prompt, schema, options.geminiModel);
}
function clampStringArray(raw, max = 8) {
	if (!Array.isArray(raw)) return [];
	return raw.filter((x) => typeof x === "string").map((s) => s.trim()).filter(Boolean).slice(0, max);
}
function normalizeRedditAnalysisReport(raw) {
	return {
		summary: typeof raw.summary === "string" ? raw.summary.trim() : "",
		painPoints: clampStringArray(raw.painPoints),
		praisedFeatures: clampStringArray(raw.praisedFeatures),
		mentionedBrands: clampStringArray(raw.mentionedBrands, 12),
		highFrequencyWords: clampStringArray(raw.highFrequencyWords, 20)
	};
}
async function generateRedditAnalysisReport(datasetText, language, provider = getDefaultAiProvider()) {
	return normalizeRedditAnalysisReport(await generateJsonObject(`
Analyze the following Reddit dataset (posts and comments) and provide a structured report based on this framework:
1. Summary: Summarize the discussions in these posts and comments.
2. Pain Points: Main user pain points, most frequent complaints or issues.
3. Praised Features: Product features users recommend or praise (functionality, design, appearance, etc.).
4. Mentioned Brands: Most frequently mentioned products or brand names.
5. High Frequency Words: Most commonly used vocabulary or high-frequency words when describing products and issues.

IMPORTANT:
- The final output MUST be in ${language === "zh" ? "Simplified Chinese" : "English"}.
- Output must be strict JSON with keys: summary, painPoints, praisedFeatures, mentionedBrands, highFrequencyWords.
- Array fields must contain strings only.

Dataset:
${datasetText.substring(0, 3e4)}
`, {
		type: Type.OBJECT,
		properties: {
			summary: {
				type: Type.STRING,
				description: "Summary of discussions"
			},
			painPoints: {
				type: Type.ARRAY,
				items: { type: Type.STRING },
				description: "Main user pain points"
			},
			praisedFeatures: {
				type: Type.ARRAY,
				items: { type: Type.STRING },
				description: "Praised product features"
			},
			mentionedBrands: {
				type: Type.ARRAY,
				items: { type: Type.STRING },
				description: "Mentioned brands or products"
			},
			highFrequencyWords: {
				type: Type.ARRAY,
				items: { type: Type.STRING },
				description: "High frequency words"
			}
		},
		required: [
			"summary",
			"painPoints",
			"praisedFeatures",
			"mentionedBrands",
			"highFrequencyWords"
		]
	}, provider));
}
const TONE_DESC = {
	curious: {
		zh: "疑惑向：语气困惑、真诚，提出'为什么'疑问，承认不确定性",
		en: "curious: confused, genuine, ask why, admit uncertainty"
	},
	question: {
		zh: "提问向：真诚发问，征求社区经验，无预设答案",
		en: "question: honest ask, seek lived experience, no predetermined answer"
	},
	recommend: {
		zh: "推荐向：以踩坑过来人视角，分享经验与顺序感，避免广告味",
		en: "recommend: veteran who was burned, share lessons & sequencing, anti-shill"
	},
	rant: {
		zh: "吐槽向：情绪化但可讨论，有反差与张力，最后落脚可执行建议",
		en: "rant: heated but discussable, contrast & tension, end with actionable ask"
	}
};
const ANTI_PATTERN_RULES = `
## NEVER do these (common AI tells that kill authenticity)
- Never start with "So," or "Hey everyone," or "I've been thinking about..."
- Never use transition words like "Furthermore", "Moreover", "Additionally", "In conclusion"
- Never write perfectly balanced paragraphs with clean topic sentences
- Never summarize your own post at the end
- Never use "game-changer", "deep dive", "at the end of the day", "invaluable", "landscape"
- Never use numbered lists or bullet points for emotional/personal posts
- Never hedge every statement with "it might be worth considering"
- Never use corporate/marketing phrases like "leverage", "synergy", "unlock potential"
- Never start consecutive sentences with the same word
- Never write a "perfect" post — real humans ramble, self-correct, and go off-topic`;
const POST_STRUCTURE_RULES = `
## Post structure (invisible to the reader — do NOT label these sections)
Each postBody must follow this narrative arc naturally:
1. HOOK (1-2 sentences): A specific, personal moment that triggered the post.
   Examples: "just got off a call that made me question everything",
   "ok so I've been lurking here for months and finally need to ask"
2. CONTEXT (2-3 sentences): Minimal background — just enough so strangers get it.
   Drop details mid-sentence like a real person would.
3. BODY: The actual question/rant/recommendation. Include at least one of:
   - A tangent or self-correction ("wait actually that's not quite right...")
   - A parenthetical aside ("(my co-founder disagrees but whatever)")
   - An incomplete thought trailed off with "..." or "idk"
4. CLOSE: End with an open question OR a trailing thought — NEVER a summary or CTA.
   Good: "anyone dealt with this?", "idk maybe I'm overthinking this",
   "sorry for the wall of text lol", "curious what you all think"
   Bad: "In summary...", "Hope this helps!", "Let me know your thoughts below!"`;
const PERSONA_RULES = `
## Persona variation (critical for authenticity)
Each of the 6 posts must be written by a DIFFERENT persona. Internally assign:
- Post 1: newcomer / first-time poster, slightly nervous, over-explains context
- Post 2: experienced veteran, blunt and concise, uses community slang
- Post 3: frustrated user who has tried everything, emotionally raw
- Post 4: analytical thinker, includes specific numbers/dates, methodical
- Post 5: casual lurker finally posting, self-deprecating humor, apologetic
- Post 6: passionate advocate, genuine enthusiasm (not shill-ish), uses caps sparingly
Each persona affects: vocabulary, sentence length, paragraph count, punctuation style,
level of formality, and emotional register. Do NOT mention or label the persona.`;
async function generateContentIdeas(report, language, tone, provider = getDefaultAiProvider(), count = 6, options = {}) {
	const n = Math.min(Math.max(count, 1), 10);
	const td = TONE_DESC[tone] ?? TONE_DESC.question;
	const toneDesc = language === "zh" ? td.zh : td.en;
	const langNote = language === "zh" ? "所有文字（title、angle、postTitle、postBody）必须用简体中文。" : "All text (title, angle, postTitle, postBody) must be in English.";
	const personaBlock = n >= 3 ? PERSONA_RULES.replace(/Each of the 6 posts/g, `Each of the ${n} posts`) : "";
	let ragBlock = "";
	if (options.useRag !== false) try {
		ragBlock = await buildRagPromptSection({
			query: buildRagQueryFromReport(report),
			language,
			topK: 5
		});
	} catch {}
	const raw = await generateJsonObject(`
You are a Reddit content strategist. Based on this Reddit community analysis, generate exactly **${n}** distinct post ideas that fit the **exact domain** of the discussions.

## Analysis Report
- Summary: ${report.summary.slice(0, 500)}
- Pain Points: ${report.painPoints.slice(0, 5).join(" | ")}
- Praised Features: ${report.praisedFeatures.slice(0, 5).join(" | ")}
- Mentioned Brands: ${report.mentionedBrands.slice(0, 5).join(" | ")}
- High-Frequency Words: ${report.highFrequencyWords.slice(0, 5).join(" | ")}
${ragBlock}
## Tone for ALL ideas
${toneDesc}
${ANTI_PATTERN_RULES}
${POST_STRUCTURE_RULES}
${personaBlock}

## Critical Rules
1. You MUST generate exactly **${n}** ideas — no more, no less.
2. **Match the domain exactly.** Infer the community topic (adult toys, fitness, gaming, cooking, SaaS, etc.) purely from the analysis above and write accordingly. Never import irrelevant jargon (e.g. "migration", "permissions", "KPI", "landing page", "team bandwidth" in an adult-toys context).
3. Each idea must be genuinely distinct — different hook, different angle, different aspect of the data.
4. postBody must be 120-250 words, written like a real Reddit user (first-person, honest, imperfect).
5. suggestedSubreddit must be a real, active subreddit matching the domain (e.g. r/SexToys, r/tifu, r/relationship_advice — NOT r/SaaS or r/smallbusiness unless the data is about SaaS/business).
6. ${langNote}

## Output — strict JSON only
Return a JSON object with key "ideas" containing an array of exactly ${n} objects:
{
  "ideas": [
    {
      "title": "short idea label (≤15 words)",
      "angle": "one-sentence content angle / hook strategy",
      "basedOn": ["pain or feature or brand this idea references"],
      "postTitle": "Reddit post title (≤15 words)",
      "postBody": "full post body text",
      "suggestedSubreddit": "r/ExampleSubreddit"
    }
  ]
}
`, {
		type: "object",
		properties: { ideas: {
			type: "array",
			items: {
				type: "object",
				properties: {
					title: { type: "string" },
					angle: { type: "string" },
					basedOn: {
						type: "array",
						items: { type: "string" }
					},
					postTitle: { type: "string" },
					postBody: { type: "string" },
					suggestedSubreddit: { type: "string" }
				},
				required: [
					"title",
					"angle",
					"basedOn",
					"postTitle",
					"postBody",
					"suggestedSubreddit"
				]
			}
		} },
		required: ["ideas"]
	}, provider);
	return (Array.isArray(raw.ideas) ? raw.ideas : []).slice(0, n);
}
function normalizeSubredditName(raw) {
	const s = String(raw ?? "").trim().replace(/^r\//i, "").replace(/^\/+/, "").replace(/[^A-Za-z0-9_]/g, "");
	return s ? `r/${s}` : "";
}
async function suggestSubredditsForIdeas(ideas, language, provider = getDefaultAiProvider()) {
	if (ideas.length === 0) return [];
	const raw = await generateJsonObject(`
你是 Reddit 运营顾问。请根据每条选题草案，推荐最匹配的 subreddit。

输出要求：
- 仅输出 JSON：{ "suggestedSubreddits": ["r/xxx", ...] }
- 数组长度必须与输入 ideas 数量一致。
- 每个值必须是 "r/xxx" 形式（只允许字母/数字/下划线）。
- 只返回真实存在且活跃的大众版块；不要返回 NSFW 之外不相关版块。
- 若主题明显偏成人/情趣用品（如 sextoys、vibrators、dildos、sexual wellness），优先对应成人讨论版块。
- 语言为 ${language === "zh" ? "简体中文语境" : "English context"}，但 subreddit 名必须保持英文原名。

ideas:
${JSON.stringify(ideas.map((x) => ({
		title: x.title,
		angle: x.angle,
		postTitle: x.postTitle,
		postBody: x.postBody.slice(0, 1800),
		currentSuggestedSubreddit: x.currentSuggestedSubreddit || ""
	})), null, 2)}
`, {
		type: "object",
		properties: { suggestedSubreddits: {
			type: "array",
			items: { type: "string" }
		} },
		required: ["suggestedSubreddits"]
	}, provider);
	const normalized = (Array.isArray(raw.suggestedSubreddits) ? raw.suggestedSubreddits : []).map((x) => normalizeSubredditName(x)).filter(Boolean);
	while (normalized.length < ideas.length) normalized.push("r/AskReddit");
	return normalized.slice(0, ideas.length);
}
async function generateContentFromPrompt(subreddit, userInstruction, language, tone = "question", provider = getDefaultAiProvider(), examplePosts = [], count = 6, options = {}) {
	const n = Math.min(Math.max(count, 1), 10);
	const td = TONE_DESC[tone] ?? TONE_DESC.question;
	const toneDesc = language === "zh" ? td.zh : td.en;
	const langNote = language === "zh" ? "所有文字（title、angle、postTitle、postBody）必须用简体中文。" : "All text (title, angle, postTitle, postBody) must be in English.";
	let ragBlock = "";
	if (options.useRag !== false) try {
		ragBlock = await buildRagPromptSection({
			query: buildRagQueryFromPrompt(subreddit, userInstruction),
			language,
			topK: 5
		});
	} catch {}
	const examplesBlock = examplePosts.length > 0 ? `
## Real posts from this community (study the writing style, DO NOT copy content)
Observe how these real Reddit users write — their sentence structure, vocabulary,
emotional register, imperfections, and formatting. Your output must match this
voice and feel, NOT the content.

${examplePosts.join("\n\n---\n\n")}

## Style patterns to extract from the examples above
- How do they start posts? (mid-thought? with a question? with context?)
- Do they use perfect grammar or casual/broken sentences?
- How long are their paragraphs?
- Do they use hedging language? Self-deprecation? Humor?
- How do they end — open question, trailing thought, or call-to-action?
Match these patterns in your output.
` : "";
	const personaBlock = n >= 3 ? PERSONA_RULES.replace(/Each of the 6 posts/g, `Each of the ${n} posts`) : "";
	const raw = await generateJsonObject(`
You are a Reddit content strategist. Generate exactly **${n}** distinct post ideas for the subreddit **${subreddit}** based on the user's instruction below.

## User Instruction
${userInstruction}

## Target Subreddit
${subreddit}
${ragBlock}
## Tone for ALL ideas
${toneDesc}
${examplesBlock}
${ANTI_PATTERN_RULES}
${POST_STRUCTURE_RULES}
${personaBlock}

## Critical Rules
1. You MUST generate exactly **${n}** ideas — no more, no less.
2. All posts must feel native to ${subreddit} — match the community's culture, vocabulary, and discussion style.
3. Each idea must be genuinely distinct — different hook, different angle.
4. postBody must be 120-250 words, written like a real Reddit user (first-person, honest, imperfect).
5. suggestedSubreddit should be ${subreddit} for most ideas, but you may suggest 1-2 alternative subreddits if they fit better.
6. ${langNote}
7. Do NOT sound like marketing or AI-generated content. Write like a real person with real experiences.

## Output — strict JSON only
Return a JSON object with key "ideas" containing an array of exactly ${n} objects:
{
  "ideas": [
    {
      "title": "short idea label (≤15 words)",
      "angle": "one-sentence content angle / hook strategy",
      "basedOn": ["relevant topic or keyword this idea references"],
      "postTitle": "Reddit post title (≤15 words)",
      "postBody": "full post body text",
      "suggestedSubreddit": "r/ExampleSubreddit"
    }
  ]
}
`, {
		type: "object",
		properties: { ideas: {
			type: "array",
			items: {
				type: "object",
				properties: {
					title: { type: "string" },
					angle: { type: "string" },
					basedOn: {
						type: "array",
						items: { type: "string" }
					},
					postTitle: { type: "string" },
					postBody: { type: "string" },
					suggestedSubreddit: { type: "string" }
				},
				required: [
					"title",
					"angle",
					"basedOn",
					"postTitle",
					"postBody",
					"suggestedSubreddit"
				]
			}
		} },
		required: ["ideas"]
	}, provider);
	return (Array.isArray(raw.ideas) ? raw.ideas : []).slice(0, n);
}
//#endregion
//#region agent/tools/analyze_reddit_data.ts
var analyze_reddit_data_exports = /* @__PURE__ */ __exportAll({ default: () => analyze_reddit_data_default });
var analyze_reddit_data_default = defineTool({
	description: "对 Reddit 帖子和评论数据进行深度分析，生成结构化报告：讨论摘要、用户痛点、被赞特性、提及品牌、高频词汇。",
	inputSchema: object({
		datasetText: string().min(10).describe("Reddit 帖子和评论的文本数据集"),
		language: _enum(["en", "zh"]).default("en").describe("输出语言")
	}),
	async execute({ datasetText, language }) {
		return await generateRedditAnalysisReport(datasetText, language);
	}
});
//#endregion
//#region agent/tools/generate_content_from_prompt.ts
var generate_content_from_prompt_exports = /* @__PURE__ */ __exportAll({ default: () => generate_content_from_prompt_default });
var generate_content_from_prompt_default = defineTool({
	description: "基于用户指令和目标 subreddit 直接生成 Reddit 帖子创意。不需要分析报告。可传入真人帖子范文作为风格参考。",
	inputSchema: object({
		subreddit: string().describe("目标 subreddit，例如 'r/startups'"),
		instruction: string().describe("用户的内容生成指令"),
		language: _enum(["en", "zh"]).default("en").describe("输出语言"),
		tone: _enum([
			"curious",
			"question",
			"recommend",
			"rant"
		]).default("question").describe("帖子语气风格"),
		examplePosts: array(string()).default([]).describe("来自 search_reddit 的真人帖子范文，用于风格参考"),
		count: number().min(1).max(10).default(6).describe("生成帖子数量")
	}),
	async execute({ subreddit, instruction, language, tone, examplePosts, count }) {
		return {
			subreddit,
			tone,
			language,
			count,
			ideas: await generateContentFromPrompt(subreddit, instruction, language, tone, void 0, examplePosts, count)
		};
	}
});
//#endregion
//#region agent/tools/generate_content_ideas.ts
var generate_content_ideas_exports = /* @__PURE__ */ __exportAll({ default: () => generate_content_ideas_default });
var generate_content_ideas_default = defineTool({
	description: "基于分析报告生成 Reddit 帖子创意，包含标题、正文和推荐 subreddit。数量由 count 参数控制。",
	inputSchema: object({
		report: object({
			summary: string(),
			painPoints: array(string()),
			praisedFeatures: array(string()),
			mentionedBrands: array(string()),
			highFrequencyWords: array(string())
		}).describe("分析报告对象"),
		language: _enum(["en", "zh"]).default("en").describe("输出语言"),
		tone: _enum([
			"curious",
			"question",
			"recommend",
			"rant"
		]).default("question").describe("帖子语气风格"),
		count: number().min(1).max(10).default(6).describe("生成帖子数量")
	}),
	async execute({ report, language, tone, count }) {
		return {
			tone,
			language,
			count,
			ideas: await generateContentIdeas(report, language, tone, void 0, count)
		};
	}
});
//#endregion
//#region db/sqlite.ts
/**
* 本地 SQLite（.data/app.db），与 JSON 双写；读时优先 DB，空则回读 JSON 并回填。
* 使用 Node.js 内置 node:sqlite（需 Node ≥ 22.5）。
*
* 勿在模块顶层 `import from "node:sqlite"`：Vercel 若 Node&lt;22 或打包环境缺失该内置模块时，
* 会导致整链 `import()` 失败并返回 HTML 错误页。此处用 createRequire 惰性加载，失败则 KV 读写降级为 no-op。
*/
const require$1 = createRequire(import.meta.url);
/** Node 22+ 首次加载 `node:sqlite` 会打印 ExperimentalWarning；仅在此短暂屏蔽，不影响其它告警 */
function requireDatabaseSync() {
	const prev = process.emitWarning;
	process.emitWarning = ((warning, type, code, ctor) => {
		const msg = typeof warning === "string" ? warning : warning && typeof warning === "object" && "message" in warning ? String(warning.message) : "";
		if (type === "ExperimentalWarning" && /SQLite is an experimental feature/i.test(msg)) return;
		return prev.call(process, warning, type, code, ctor);
	});
	try {
		return require$1("node:sqlite").DatabaseSync;
	} catch {
		return null;
	} finally {
		process.emitWarning = prev;
	}
}
const DatabaseSyncCtor = requireDatabaseSync();
/** 与 server 写入的 .data/*.json 一致：请在项目根目录启动（npm run dev / node dist/server.cjs） */
const DATA_DIR = path.join(process.cwd(), ".data");
const DB_PATH = path.join(DATA_DIR, "app.db");
let db = null;
function getDb() {
	if (!DatabaseSyncCtor) throw new Error("SQLite unavailable (requires Node.js 22.5+ with built-in node:sqlite)");
	if (!db) {
		fs.mkdirSync(DATA_DIR, { recursive: true });
		db = new DatabaseSyncCtor(DB_PATH, { enableForeignKeyConstraints: true });
		db.exec("PRAGMA journal_mode = WAL;");
		initSchema(db);
	}
	return db;
}
function initSchema(database) {
	database.exec(`
    CREATE TABLE IF NOT EXISTS analysis_history (
      id TEXT PRIMARY KEY NOT NULL,
      created_at TEXT NOT NULL,
      language TEXT NOT NULL,
      source_type TEXT NOT NULL,
      source_label TEXT NOT NULL,
      input_text TEXT NOT NULL,
      report_json TEXT NOT NULL
    );
    CREATE INDEX IF NOT EXISTS idx_analysis_history_created ON analysis_history(created_at DESC);

    CREATE TABLE IF NOT EXISTS kv_store (
      k TEXT PRIMARY KEY NOT NULL,
      v TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );
  `);
}
const KV_COMPETITIVE = "competitive_cache_v1_json";
function getKvJson(key) {
	try {
		const row = getDb().prepare(`SELECT v FROM kv_store WHERE k = ?`).get(key);
		if (!row?.v) return null;
		try {
			return JSON.parse(row.v);
		} catch {
			return null;
		}
	} catch {
		return null;
	}
}
function setKvJson(key, value) {
	try {
		const database = getDb();
		const now = (/* @__PURE__ */ new Date()).toISOString();
		const v = JSON.stringify(value);
		database.prepare(`INSERT INTO kv_store (k, v, updated_at) VALUES (?, ?, ?)
       ON CONFLICT(k) DO UPDATE SET v = excluded.v, updated_at = excluded.updated_at`).run(key, v, now);
	} catch {}
}
function setCompetitiveCacheKv(payload) {
	setKvJson(KV_COMPETITIVE, payload);
}
function getCompetitiveCacheKv() {
	return getKvJson(KV_COMPETITIVE);
}
//#endregion
//#region node_modules/proxy-agent/node_modules/proxy-from-env/index.js
var require_proxy_from_env = /* @__PURE__ */ __commonJSMin(((exports) => {
	var parseUrl = __require("url").parse;
	var DEFAULT_PORTS = {
		ftp: 21,
		gopher: 70,
		http: 80,
		https: 443,
		ws: 80,
		wss: 443
	};
	var stringEndsWith = String.prototype.endsWith || function(s) {
		return s.length <= this.length && this.indexOf(s, this.length - s.length) !== -1;
	};
	/**
	* @param {string|object} url - The URL, or the result from url.parse.
	* @return {string} The URL of the proxy that should handle the request to the
	*  given URL. If no proxy is set, this will be an empty string.
	*/
	function getProxyForUrl(url) {
		var parsedUrl = typeof url === "string" ? parseUrl(url) : url || {};
		var proto = parsedUrl.protocol;
		var hostname = parsedUrl.host;
		var port = parsedUrl.port;
		if (typeof hostname !== "string" || !hostname || typeof proto !== "string") return "";
		proto = proto.split(":", 1)[0];
		hostname = hostname.replace(/:\d*$/, "");
		port = parseInt(port) || DEFAULT_PORTS[proto] || 0;
		if (!shouldProxy(hostname, port)) return "";
		var proxy = getEnv("npm_config_" + proto + "_proxy") || getEnv(proto + "_proxy") || getEnv("npm_config_proxy") || getEnv("all_proxy");
		if (proxy && proxy.indexOf("://") === -1) proxy = proto + "://" + proxy;
		return proxy;
	}
	/**
	* Determines whether a given URL should be proxied.
	*
	* @param {string} hostname - The host name of the URL.
	* @param {number} port - The effective port of the URL.
	* @returns {boolean} Whether the given URL should be proxied.
	* @private
	*/
	function shouldProxy(hostname, port) {
		var NO_PROXY = (getEnv("npm_config_no_proxy") || getEnv("no_proxy")).toLowerCase();
		if (!NO_PROXY) return true;
		if (NO_PROXY === "*") return false;
		return NO_PROXY.split(/[,\s]/).every(function(proxy) {
			if (!proxy) return true;
			var parsedProxy = proxy.match(/^(.+):(\d+)$/);
			var parsedProxyHostname = parsedProxy ? parsedProxy[1] : proxy;
			var parsedProxyPort = parsedProxy ? parseInt(parsedProxy[2]) : 0;
			if (parsedProxyPort && parsedProxyPort !== port) return true;
			if (!/^[.*]/.test(parsedProxyHostname)) return hostname !== parsedProxyHostname;
			if (parsedProxyHostname.charAt(0) === "*") parsedProxyHostname = parsedProxyHostname.slice(1);
			return !stringEndsWith.call(hostname, parsedProxyHostname);
		});
	}
	/**
	* Get the value for an environment variable.
	*
	* @param {string} key - The name of the environment variable.
	* @return {string} The value of the environment variable.
	* @private
	*/
	function getEnv(key) {
		return process.env[key.toLowerCase()] || process.env[key.toUpperCase()] || "";
	}
	exports.getProxyForUrl = getProxyForUrl;
}));
//#endregion
//#region node_modules/smart-buffer/build/utils.js
var require_utils = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	const buffer_1 = __require("buffer");
	/**
	* Error strings
	*/
	const ERRORS = {
		INVALID_ENCODING: "Invalid encoding provided. Please specify a valid encoding the internal Node.js Buffer supports.",
		INVALID_SMARTBUFFER_SIZE: "Invalid size provided. Size must be a valid integer greater than zero.",
		INVALID_SMARTBUFFER_BUFFER: "Invalid Buffer provided in SmartBufferOptions.",
		INVALID_SMARTBUFFER_OBJECT: "Invalid SmartBufferOptions object supplied to SmartBuffer constructor or factory methods.",
		INVALID_OFFSET: "An invalid offset value was provided.",
		INVALID_OFFSET_NON_NUMBER: "An invalid offset value was provided. A numeric value is required.",
		INVALID_LENGTH: "An invalid length value was provided.",
		INVALID_LENGTH_NON_NUMBER: "An invalid length value was provived. A numeric value is required.",
		INVALID_TARGET_OFFSET: "Target offset is beyond the bounds of the internal SmartBuffer data.",
		INVALID_TARGET_LENGTH: "Specified length value moves cursor beyong the bounds of the internal SmartBuffer data.",
		INVALID_READ_BEYOND_BOUNDS: "Attempted to read beyond the bounds of the managed data.",
		INVALID_WRITE_BEYOND_BOUNDS: "Attempted to write beyond the bounds of the managed data."
	};
	exports.ERRORS = ERRORS;
	/**
	* Checks if a given encoding is a valid Buffer encoding. (Throws an exception if check fails)
	*
	* @param { String } encoding The encoding string to check.
	*/
	function checkEncoding(encoding) {
		if (!buffer_1.Buffer.isEncoding(encoding)) throw new Error(ERRORS.INVALID_ENCODING);
	}
	exports.checkEncoding = checkEncoding;
	/**
	* Checks if a given number is a finite integer. (Throws an exception if check fails)
	*
	* @param { Number } value The number value to check.
	*/
	function isFiniteInteger(value) {
		return typeof value === "number" && isFinite(value) && isInteger(value);
	}
	exports.isFiniteInteger = isFiniteInteger;
	/**
	* Checks if an offset/length value is valid. (Throws an exception if check fails)
	*
	* @param value The value to check.
	* @param offset True if checking an offset, false if checking a length.
	*/
	function checkOffsetOrLengthValue(value, offset) {
		if (typeof value === "number") {
			if (!isFiniteInteger(value) || value < 0) throw new Error(offset ? ERRORS.INVALID_OFFSET : ERRORS.INVALID_LENGTH);
		} else throw new Error(offset ? ERRORS.INVALID_OFFSET_NON_NUMBER : ERRORS.INVALID_LENGTH_NON_NUMBER);
	}
	/**
	* Checks if a length value is valid. (Throws an exception if check fails)
	*
	* @param { Number } length The value to check.
	*/
	function checkLengthValue(length) {
		checkOffsetOrLengthValue(length, false);
	}
	exports.checkLengthValue = checkLengthValue;
	/**
	* Checks if a offset value is valid. (Throws an exception if check fails)
	*
	* @param { Number } offset The value to check.
	*/
	function checkOffsetValue(offset) {
		checkOffsetOrLengthValue(offset, true);
	}
	exports.checkOffsetValue = checkOffsetValue;
	/**
	* Checks if a target offset value is out of bounds. (Throws an exception if check fails)
	*
	* @param { Number } offset The offset value to check.
	* @param { SmartBuffer } buff The SmartBuffer instance to check against.
	*/
	function checkTargetOffset(offset, buff) {
		if (offset < 0 || offset > buff.length) throw new Error(ERRORS.INVALID_TARGET_OFFSET);
	}
	exports.checkTargetOffset = checkTargetOffset;
	/**
	* Determines whether a given number is a integer.
	* @param value The number to check.
	*/
	function isInteger(value) {
		return typeof value === "number" && isFinite(value) && Math.floor(value) === value;
	}
	/**
	* Throws if Node.js version is too low to support bigint
	*/
	function bigIntAndBufferInt64Check(bufferMethod) {
		if (typeof BigInt === "undefined") throw new Error("Platform does not support JS BigInt type.");
		if (typeof buffer_1.Buffer.prototype[bufferMethod] === "undefined") throw new Error(`Platform does not support Buffer.prototype.${bufferMethod}.`);
	}
	exports.bigIntAndBufferInt64Check = bigIntAndBufferInt64Check;
}));
//#endregion
//#region node_modules/smart-buffer/build/smartbuffer.js
var require_smartbuffer = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	const utils_1 = require_utils();
	const DEFAULT_SMARTBUFFER_SIZE = 4096;
	const DEFAULT_SMARTBUFFER_ENCODING = "utf8";
	exports.SmartBuffer = class SmartBuffer {
		/**
		* Creates a new SmartBuffer instance.
		*
		* @param options { SmartBufferOptions } The SmartBufferOptions to apply to this instance.
		*/
		constructor(options) {
			this.length = 0;
			this._encoding = DEFAULT_SMARTBUFFER_ENCODING;
			this._writeOffset = 0;
			this._readOffset = 0;
			if (SmartBuffer.isSmartBufferOptions(options)) {
				if (options.encoding) {
					utils_1.checkEncoding(options.encoding);
					this._encoding = options.encoding;
				}
				if (options.size) if (utils_1.isFiniteInteger(options.size) && options.size > 0) this._buff = Buffer.allocUnsafe(options.size);
				else throw new Error(utils_1.ERRORS.INVALID_SMARTBUFFER_SIZE);
				else if (options.buff) if (Buffer.isBuffer(options.buff)) {
					this._buff = options.buff;
					this.length = options.buff.length;
				} else throw new Error(utils_1.ERRORS.INVALID_SMARTBUFFER_BUFFER);
				else this._buff = Buffer.allocUnsafe(DEFAULT_SMARTBUFFER_SIZE);
			} else {
				if (typeof options !== "undefined") throw new Error(utils_1.ERRORS.INVALID_SMARTBUFFER_OBJECT);
				this._buff = Buffer.allocUnsafe(DEFAULT_SMARTBUFFER_SIZE);
			}
		}
		/**
		* Creates a new SmartBuffer instance with the provided internal Buffer size and optional encoding.
		*
		* @param size { Number } The size of the internal Buffer.
		* @param encoding { String } The BufferEncoding to use for strings.
		*
		* @return { SmartBuffer }
		*/
		static fromSize(size, encoding) {
			return new this({
				size,
				encoding
			});
		}
		/**
		* Creates a new SmartBuffer instance with the provided Buffer and optional encoding.
		*
		* @param buffer { Buffer } The Buffer to use as the internal Buffer value.
		* @param encoding { String } The BufferEncoding to use for strings.
		*
		* @return { SmartBuffer }
		*/
		static fromBuffer(buff, encoding) {
			return new this({
				buff,
				encoding
			});
		}
		/**
		* Creates a new SmartBuffer instance with the provided SmartBufferOptions options.
		*
		* @param options { SmartBufferOptions } The options to use when creating the SmartBuffer instance.
		*/
		static fromOptions(options) {
			return new this(options);
		}
		/**
		* Type checking function that determines if an object is a SmartBufferOptions object.
		*/
		static isSmartBufferOptions(options) {
			const castOptions = options;
			return castOptions && (castOptions.encoding !== void 0 || castOptions.size !== void 0 || castOptions.buff !== void 0);
		}
		/**
		* Reads an Int8 value from the current read position or an optionally provided offset.
		*
		* @param offset { Number } The offset to read data from (optional)
		* @return { Number }
		*/
		readInt8(offset) {
			return this._readNumberValue(Buffer.prototype.readInt8, 1, offset);
		}
		/**
		* Reads an Int16BE value from the current read position or an optionally provided offset.
		*
		* @param offset { Number } The offset to read data from (optional)
		* @return { Number }
		*/
		readInt16BE(offset) {
			return this._readNumberValue(Buffer.prototype.readInt16BE, 2, offset);
		}
		/**
		* Reads an Int16LE value from the current read position or an optionally provided offset.
		*
		* @param offset { Number } The offset to read data from (optional)
		* @return { Number }
		*/
		readInt16LE(offset) {
			return this._readNumberValue(Buffer.prototype.readInt16LE, 2, offset);
		}
		/**
		* Reads an Int32BE value from the current read position or an optionally provided offset.
		*
		* @param offset { Number } The offset to read data from (optional)
		* @return { Number }
		*/
		readInt32BE(offset) {
			return this._readNumberValue(Buffer.prototype.readInt32BE, 4, offset);
		}
		/**
		* Reads an Int32LE value from the current read position or an optionally provided offset.
		*
		* @param offset { Number } The offset to read data from (optional)
		* @return { Number }
		*/
		readInt32LE(offset) {
			return this._readNumberValue(Buffer.prototype.readInt32LE, 4, offset);
		}
		/**
		* Reads a BigInt64BE value from the current read position or an optionally provided offset.
		*
		* @param offset { Number } The offset to read data from (optional)
		* @return { BigInt }
		*/
		readBigInt64BE(offset) {
			utils_1.bigIntAndBufferInt64Check("readBigInt64BE");
			return this._readNumberValue(Buffer.prototype.readBigInt64BE, 8, offset);
		}
		/**
		* Reads a BigInt64LE value from the current read position or an optionally provided offset.
		*
		* @param offset { Number } The offset to read data from (optional)
		* @return { BigInt }
		*/
		readBigInt64LE(offset) {
			utils_1.bigIntAndBufferInt64Check("readBigInt64LE");
			return this._readNumberValue(Buffer.prototype.readBigInt64LE, 8, offset);
		}
		/**
		* Writes an Int8 value to the current write position (or at optional offset).
		*
		* @param value { Number } The value to write.
		* @param offset { Number } The offset to write the value at.
		*
		* @return this
		*/
		writeInt8(value, offset) {
			this._writeNumberValue(Buffer.prototype.writeInt8, 1, value, offset);
			return this;
		}
		/**
		* Inserts an Int8 value at the given offset value.
		*
		* @param value { Number } The value to insert.
		* @param offset { Number } The offset to insert the value at.
		*
		* @return this
		*/
		insertInt8(value, offset) {
			return this._insertNumberValue(Buffer.prototype.writeInt8, 1, value, offset);
		}
		/**
		* Writes an Int16BE value to the current write position (or at optional offset).
		*
		* @param value { Number } The value to write.
		* @param offset { Number } The offset to write the value at.
		*
		* @return this
		*/
		writeInt16BE(value, offset) {
			return this._writeNumberValue(Buffer.prototype.writeInt16BE, 2, value, offset);
		}
		/**
		* Inserts an Int16BE value at the given offset value.
		*
		* @param value { Number } The value to insert.
		* @param offset { Number } The offset to insert the value at.
		*
		* @return this
		*/
		insertInt16BE(value, offset) {
			return this._insertNumberValue(Buffer.prototype.writeInt16BE, 2, value, offset);
		}
		/**
		* Writes an Int16LE value to the current write position (or at optional offset).
		*
		* @param value { Number } The value to write.
		* @param offset { Number } The offset to write the value at.
		*
		* @return this
		*/
		writeInt16LE(value, offset) {
			return this._writeNumberValue(Buffer.prototype.writeInt16LE, 2, value, offset);
		}
		/**
		* Inserts an Int16LE value at the given offset value.
		*
		* @param value { Number } The value to insert.
		* @param offset { Number } The offset to insert the value at.
		*
		* @return this
		*/
		insertInt16LE(value, offset) {
			return this._insertNumberValue(Buffer.prototype.writeInt16LE, 2, value, offset);
		}
		/**
		* Writes an Int32BE value to the current write position (or at optional offset).
		*
		* @param value { Number } The value to write.
		* @param offset { Number } The offset to write the value at.
		*
		* @return this
		*/
		writeInt32BE(value, offset) {
			return this._writeNumberValue(Buffer.prototype.writeInt32BE, 4, value, offset);
		}
		/**
		* Inserts an Int32BE value at the given offset value.
		*
		* @param value { Number } The value to insert.
		* @param offset { Number } The offset to insert the value at.
		*
		* @return this
		*/
		insertInt32BE(value, offset) {
			return this._insertNumberValue(Buffer.prototype.writeInt32BE, 4, value, offset);
		}
		/**
		* Writes an Int32LE value to the current write position (or at optional offset).
		*
		* @param value { Number } The value to write.
		* @param offset { Number } The offset to write the value at.
		*
		* @return this
		*/
		writeInt32LE(value, offset) {
			return this._writeNumberValue(Buffer.prototype.writeInt32LE, 4, value, offset);
		}
		/**
		* Inserts an Int32LE value at the given offset value.
		*
		* @param value { Number } The value to insert.
		* @param offset { Number } The offset to insert the value at.
		*
		* @return this
		*/
		insertInt32LE(value, offset) {
			return this._insertNumberValue(Buffer.prototype.writeInt32LE, 4, value, offset);
		}
		/**
		* Writes a BigInt64BE value to the current write position (or at optional offset).
		*
		* @param value { BigInt } The value to write.
		* @param offset { Number } The offset to write the value at.
		*
		* @return this
		*/
		writeBigInt64BE(value, offset) {
			utils_1.bigIntAndBufferInt64Check("writeBigInt64BE");
			return this._writeNumberValue(Buffer.prototype.writeBigInt64BE, 8, value, offset);
		}
		/**
		* Inserts a BigInt64BE value at the given offset value.
		*
		* @param value { BigInt } The value to insert.
		* @param offset { Number } The offset to insert the value at.
		*
		* @return this
		*/
		insertBigInt64BE(value, offset) {
			utils_1.bigIntAndBufferInt64Check("writeBigInt64BE");
			return this._insertNumberValue(Buffer.prototype.writeBigInt64BE, 8, value, offset);
		}
		/**
		* Writes a BigInt64LE value to the current write position (or at optional offset).
		*
		* @param value { BigInt } The value to write.
		* @param offset { Number } The offset to write the value at.
		*
		* @return this
		*/
		writeBigInt64LE(value, offset) {
			utils_1.bigIntAndBufferInt64Check("writeBigInt64LE");
			return this._writeNumberValue(Buffer.prototype.writeBigInt64LE, 8, value, offset);
		}
		/**
		* Inserts a Int64LE value at the given offset value.
		*
		* @param value { BigInt } The value to insert.
		* @param offset { Number } The offset to insert the value at.
		*
		* @return this
		*/
		insertBigInt64LE(value, offset) {
			utils_1.bigIntAndBufferInt64Check("writeBigInt64LE");
			return this._insertNumberValue(Buffer.prototype.writeBigInt64LE, 8, value, offset);
		}
		/**
		* Reads an UInt8 value from the current read position or an optionally provided offset.
		*
		* @param offset { Number } The offset to read data from (optional)
		* @return { Number }
		*/
		readUInt8(offset) {
			return this._readNumberValue(Buffer.prototype.readUInt8, 1, offset);
		}
		/**
		* Reads an UInt16BE value from the current read position or an optionally provided offset.
		*
		* @param offset { Number } The offset to read data from (optional)
		* @return { Number }
		*/
		readUInt16BE(offset) {
			return this._readNumberValue(Buffer.prototype.readUInt16BE, 2, offset);
		}
		/**
		* Reads an UInt16LE value from the current read position or an optionally provided offset.
		*
		* @param offset { Number } The offset to read data from (optional)
		* @return { Number }
		*/
		readUInt16LE(offset) {
			return this._readNumberValue(Buffer.prototype.readUInt16LE, 2, offset);
		}
		/**
		* Reads an UInt32BE value from the current read position or an optionally provided offset.
		*
		* @param offset { Number } The offset to read data from (optional)
		* @return { Number }
		*/
		readUInt32BE(offset) {
			return this._readNumberValue(Buffer.prototype.readUInt32BE, 4, offset);
		}
		/**
		* Reads an UInt32LE value from the current read position or an optionally provided offset.
		*
		* @param offset { Number } The offset to read data from (optional)
		* @return { Number }
		*/
		readUInt32LE(offset) {
			return this._readNumberValue(Buffer.prototype.readUInt32LE, 4, offset);
		}
		/**
		* Reads a BigUInt64BE value from the current read position or an optionally provided offset.
		*
		* @param offset { Number } The offset to read data from (optional)
		* @return { BigInt }
		*/
		readBigUInt64BE(offset) {
			utils_1.bigIntAndBufferInt64Check("readBigUInt64BE");
			return this._readNumberValue(Buffer.prototype.readBigUInt64BE, 8, offset);
		}
		/**
		* Reads a BigUInt64LE value from the current read position or an optionally provided offset.
		*
		* @param offset { Number } The offset to read data from (optional)
		* @return { BigInt }
		*/
		readBigUInt64LE(offset) {
			utils_1.bigIntAndBufferInt64Check("readBigUInt64LE");
			return this._readNumberValue(Buffer.prototype.readBigUInt64LE, 8, offset);
		}
		/**
		* Writes an UInt8 value to the current write position (or at optional offset).
		*
		* @param value { Number } The value to write.
		* @param offset { Number } The offset to write the value at.
		*
		* @return this
		*/
		writeUInt8(value, offset) {
			return this._writeNumberValue(Buffer.prototype.writeUInt8, 1, value, offset);
		}
		/**
		* Inserts an UInt8 value at the given offset value.
		*
		* @param value { Number } The value to insert.
		* @param offset { Number } The offset to insert the value at.
		*
		* @return this
		*/
		insertUInt8(value, offset) {
			return this._insertNumberValue(Buffer.prototype.writeUInt8, 1, value, offset);
		}
		/**
		* Writes an UInt16BE value to the current write position (or at optional offset).
		*
		* @param value { Number } The value to write.
		* @param offset { Number } The offset to write the value at.
		*
		* @return this
		*/
		writeUInt16BE(value, offset) {
			return this._writeNumberValue(Buffer.prototype.writeUInt16BE, 2, value, offset);
		}
		/**
		* Inserts an UInt16BE value at the given offset value.
		*
		* @param value { Number } The value to insert.
		* @param offset { Number } The offset to insert the value at.
		*
		* @return this
		*/
		insertUInt16BE(value, offset) {
			return this._insertNumberValue(Buffer.prototype.writeUInt16BE, 2, value, offset);
		}
		/**
		* Writes an UInt16LE value to the current write position (or at optional offset).
		*
		* @param value { Number } The value to write.
		* @param offset { Number } The offset to write the value at.
		*
		* @return this
		*/
		writeUInt16LE(value, offset) {
			return this._writeNumberValue(Buffer.prototype.writeUInt16LE, 2, value, offset);
		}
		/**
		* Inserts an UInt16LE value at the given offset value.
		*
		* @param value { Number } The value to insert.
		* @param offset { Number } The offset to insert the value at.
		*
		* @return this
		*/
		insertUInt16LE(value, offset) {
			return this._insertNumberValue(Buffer.prototype.writeUInt16LE, 2, value, offset);
		}
		/**
		* Writes an UInt32BE value to the current write position (or at optional offset).
		*
		* @param value { Number } The value to write.
		* @param offset { Number } The offset to write the value at.
		*
		* @return this
		*/
		writeUInt32BE(value, offset) {
			return this._writeNumberValue(Buffer.prototype.writeUInt32BE, 4, value, offset);
		}
		/**
		* Inserts an UInt32BE value at the given offset value.
		*
		* @param value { Number } The value to insert.
		* @param offset { Number } The offset to insert the value at.
		*
		* @return this
		*/
		insertUInt32BE(value, offset) {
			return this._insertNumberValue(Buffer.prototype.writeUInt32BE, 4, value, offset);
		}
		/**
		* Writes an UInt32LE value to the current write position (or at optional offset).
		*
		* @param value { Number } The value to write.
		* @param offset { Number } The offset to write the value at.
		*
		* @return this
		*/
		writeUInt32LE(value, offset) {
			return this._writeNumberValue(Buffer.prototype.writeUInt32LE, 4, value, offset);
		}
		/**
		* Inserts an UInt32LE value at the given offset value.
		*
		* @param value { Number } The value to insert.
		* @param offset { Number } The offset to insert the value at.
		*
		* @return this
		*/
		insertUInt32LE(value, offset) {
			return this._insertNumberValue(Buffer.prototype.writeUInt32LE, 4, value, offset);
		}
		/**
		* Writes a BigUInt64BE value to the current write position (or at optional offset).
		*
		* @param value { Number } The value to write.
		* @param offset { Number } The offset to write the value at.
		*
		* @return this
		*/
		writeBigUInt64BE(value, offset) {
			utils_1.bigIntAndBufferInt64Check("writeBigUInt64BE");
			return this._writeNumberValue(Buffer.prototype.writeBigUInt64BE, 8, value, offset);
		}
		/**
		* Inserts a BigUInt64BE value at the given offset value.
		*
		* @param value { Number } The value to insert.
		* @param offset { Number } The offset to insert the value at.
		*
		* @return this
		*/
		insertBigUInt64BE(value, offset) {
			utils_1.bigIntAndBufferInt64Check("writeBigUInt64BE");
			return this._insertNumberValue(Buffer.prototype.writeBigUInt64BE, 8, value, offset);
		}
		/**
		* Writes a BigUInt64LE value to the current write position (or at optional offset).
		*
		* @param value { Number } The value to write.
		* @param offset { Number } The offset to write the value at.
		*
		* @return this
		*/
		writeBigUInt64LE(value, offset) {
			utils_1.bigIntAndBufferInt64Check("writeBigUInt64LE");
			return this._writeNumberValue(Buffer.prototype.writeBigUInt64LE, 8, value, offset);
		}
		/**
		* Inserts a BigUInt64LE value at the given offset value.
		*
		* @param value { Number } The value to insert.
		* @param offset { Number } The offset to insert the value at.
		*
		* @return this
		*/
		insertBigUInt64LE(value, offset) {
			utils_1.bigIntAndBufferInt64Check("writeBigUInt64LE");
			return this._insertNumberValue(Buffer.prototype.writeBigUInt64LE, 8, value, offset);
		}
		/**
		* Reads an FloatBE value from the current read position or an optionally provided offset.
		*
		* @param offset { Number } The offset to read data from (optional)
		* @return { Number }
		*/
		readFloatBE(offset) {
			return this._readNumberValue(Buffer.prototype.readFloatBE, 4, offset);
		}
		/**
		* Reads an FloatLE value from the current read position or an optionally provided offset.
		*
		* @param offset { Number } The offset to read data from (optional)
		* @return { Number }
		*/
		readFloatLE(offset) {
			return this._readNumberValue(Buffer.prototype.readFloatLE, 4, offset);
		}
		/**
		* Writes a FloatBE value to the current write position (or at optional offset).
		*
		* @param value { Number } The value to write.
		* @param offset { Number } The offset to write the value at.
		*
		* @return this
		*/
		writeFloatBE(value, offset) {
			return this._writeNumberValue(Buffer.prototype.writeFloatBE, 4, value, offset);
		}
		/**
		* Inserts a FloatBE value at the given offset value.
		*
		* @param value { Number } The value to insert.
		* @param offset { Number } The offset to insert the value at.
		*
		* @return this
		*/
		insertFloatBE(value, offset) {
			return this._insertNumberValue(Buffer.prototype.writeFloatBE, 4, value, offset);
		}
		/**
		* Writes a FloatLE value to the current write position (or at optional offset).
		*
		* @param value { Number } The value to write.
		* @param offset { Number } The offset to write the value at.
		*
		* @return this
		*/
		writeFloatLE(value, offset) {
			return this._writeNumberValue(Buffer.prototype.writeFloatLE, 4, value, offset);
		}
		/**
		* Inserts a FloatLE value at the given offset value.
		*
		* @param value { Number } The value to insert.
		* @param offset { Number } The offset to insert the value at.
		*
		* @return this
		*/
		insertFloatLE(value, offset) {
			return this._insertNumberValue(Buffer.prototype.writeFloatLE, 4, value, offset);
		}
		/**
		* Reads an DoublEBE value from the current read position or an optionally provided offset.
		*
		* @param offset { Number } The offset to read data from (optional)
		* @return { Number }
		*/
		readDoubleBE(offset) {
			return this._readNumberValue(Buffer.prototype.readDoubleBE, 8, offset);
		}
		/**
		* Reads an DoubleLE value from the current read position or an optionally provided offset.
		*
		* @param offset { Number } The offset to read data from (optional)
		* @return { Number }
		*/
		readDoubleLE(offset) {
			return this._readNumberValue(Buffer.prototype.readDoubleLE, 8, offset);
		}
		/**
		* Writes a DoubleBE value to the current write position (or at optional offset).
		*
		* @param value { Number } The value to write.
		* @param offset { Number } The offset to write the value at.
		*
		* @return this
		*/
		writeDoubleBE(value, offset) {
			return this._writeNumberValue(Buffer.prototype.writeDoubleBE, 8, value, offset);
		}
		/**
		* Inserts a DoubleBE value at the given offset value.
		*
		* @param value { Number } The value to insert.
		* @param offset { Number } The offset to insert the value at.
		*
		* @return this
		*/
		insertDoubleBE(value, offset) {
			return this._insertNumberValue(Buffer.prototype.writeDoubleBE, 8, value, offset);
		}
		/**
		* Writes a DoubleLE value to the current write position (or at optional offset).
		*
		* @param value { Number } The value to write.
		* @param offset { Number } The offset to write the value at.
		*
		* @return this
		*/
		writeDoubleLE(value, offset) {
			return this._writeNumberValue(Buffer.prototype.writeDoubleLE, 8, value, offset);
		}
		/**
		* Inserts a DoubleLE value at the given offset value.
		*
		* @param value { Number } The value to insert.
		* @param offset { Number } The offset to insert the value at.
		*
		* @return this
		*/
		insertDoubleLE(value, offset) {
			return this._insertNumberValue(Buffer.prototype.writeDoubleLE, 8, value, offset);
		}
		/**
		* Reads a String from the current read position.
		*
		* @param arg1 { Number | String } The number of bytes to read as a String, or the BufferEncoding to use for
		*             the string (Defaults to instance level encoding).
		* @param encoding { String } The BufferEncoding to use for the string (Defaults to instance level encoding).
		*
		* @return { String }
		*/
		readString(arg1, encoding) {
			let lengthVal;
			if (typeof arg1 === "number") {
				utils_1.checkLengthValue(arg1);
				lengthVal = Math.min(arg1, this.length - this._readOffset);
			} else {
				encoding = arg1;
				lengthVal = this.length - this._readOffset;
			}
			if (typeof encoding !== "undefined") utils_1.checkEncoding(encoding);
			const value = this._buff.slice(this._readOffset, this._readOffset + lengthVal).toString(encoding || this._encoding);
			this._readOffset += lengthVal;
			return value;
		}
		/**
		* Inserts a String
		*
		* @param value { String } The String value to insert.
		* @param offset { Number } The offset to insert the string at.
		* @param encoding { String } The BufferEncoding to use for writing strings (defaults to instance encoding).
		*
		* @return this
		*/
		insertString(value, offset, encoding) {
			utils_1.checkOffsetValue(offset);
			return this._handleString(value, true, offset, encoding);
		}
		/**
		* Writes a String
		*
		* @param value { String } The String value to write.
		* @param arg2 { Number | String } The offset to write the string at, or the BufferEncoding to use.
		* @param encoding { String } The BufferEncoding to use for writing strings (defaults to instance encoding).
		*
		* @return this
		*/
		writeString(value, arg2, encoding) {
			return this._handleString(value, false, arg2, encoding);
		}
		/**
		* Reads a null-terminated String from the current read position.
		*
		* @param encoding { String } The BufferEncoding to use for the string (Defaults to instance level encoding).
		*
		* @return { String }
		*/
		readStringNT(encoding) {
			if (typeof encoding !== "undefined") utils_1.checkEncoding(encoding);
			let nullPos = this.length;
			for (let i = this._readOffset; i < this.length; i++) if (this._buff[i] === 0) {
				nullPos = i;
				break;
			}
			const value = this._buff.slice(this._readOffset, nullPos);
			this._readOffset = nullPos + 1;
			return value.toString(encoding || this._encoding);
		}
		/**
		* Inserts a null-terminated String.
		*
		* @param value { String } The String value to write.
		* @param arg2 { Number | String } The offset to write the string to, or the BufferEncoding to use.
		* @param encoding { String } The BufferEncoding to use for writing strings (defaults to instance encoding).
		*
		* @return this
		*/
		insertStringNT(value, offset, encoding) {
			utils_1.checkOffsetValue(offset);
			this.insertString(value, offset, encoding);
			this.insertUInt8(0, offset + value.length);
			return this;
		}
		/**
		* Writes a null-terminated String.
		*
		* @param value { String } The String value to write.
		* @param arg2 { Number | String } The offset to write the string to, or the BufferEncoding to use.
		* @param encoding { String } The BufferEncoding to use for writing strings (defaults to instance encoding).
		*
		* @return this
		*/
		writeStringNT(value, arg2, encoding) {
			this.writeString(value, arg2, encoding);
			this.writeUInt8(0, typeof arg2 === "number" ? arg2 + value.length : this.writeOffset);
			return this;
		}
		/**
		* Reads a Buffer from the internal read position.
		*
		* @param length { Number } The length of data to read as a Buffer.
		*
		* @return { Buffer }
		*/
		readBuffer(length) {
			if (typeof length !== "undefined") utils_1.checkLengthValue(length);
			const lengthVal = typeof length === "number" ? length : this.length;
			const endPoint = Math.min(this.length, this._readOffset + lengthVal);
			const value = this._buff.slice(this._readOffset, endPoint);
			this._readOffset = endPoint;
			return value;
		}
		/**
		* Writes a Buffer to the current write position.
		*
		* @param value { Buffer } The Buffer to write.
		* @param offset { Number } The offset to write the Buffer to.
		*
		* @return this
		*/
		insertBuffer(value, offset) {
			utils_1.checkOffsetValue(offset);
			return this._handleBuffer(value, true, offset);
		}
		/**
		* Writes a Buffer to the current write position.
		*
		* @param value { Buffer } The Buffer to write.
		* @param offset { Number } The offset to write the Buffer to.
		*
		* @return this
		*/
		writeBuffer(value, offset) {
			return this._handleBuffer(value, false, offset);
		}
		/**
		* Reads a null-terminated Buffer from the current read poisiton.
		*
		* @return { Buffer }
		*/
		readBufferNT() {
			let nullPos = this.length;
			for (let i = this._readOffset; i < this.length; i++) if (this._buff[i] === 0) {
				nullPos = i;
				break;
			}
			const value = this._buff.slice(this._readOffset, nullPos);
			this._readOffset = nullPos + 1;
			return value;
		}
		/**
		* Inserts a null-terminated Buffer.
		*
		* @param value { Buffer } The Buffer to write.
		* @param offset { Number } The offset to write the Buffer to.
		*
		* @return this
		*/
		insertBufferNT(value, offset) {
			utils_1.checkOffsetValue(offset);
			this.insertBuffer(value, offset);
			this.insertUInt8(0, offset + value.length);
			return this;
		}
		/**
		* Writes a null-terminated Buffer.
		*
		* @param value { Buffer } The Buffer to write.
		* @param offset { Number } The offset to write the Buffer to.
		*
		* @return this
		*/
		writeBufferNT(value, offset) {
			if (typeof offset !== "undefined") utils_1.checkOffsetValue(offset);
			this.writeBuffer(value, offset);
			this.writeUInt8(0, typeof offset === "number" ? offset + value.length : this._writeOffset);
			return this;
		}
		/**
		* Clears the SmartBuffer instance to its original empty state.
		*/
		clear() {
			this._writeOffset = 0;
			this._readOffset = 0;
			this.length = 0;
			return this;
		}
		/**
		* Gets the remaining data left to be read from the SmartBuffer instance.
		*
		* @return { Number }
		*/
		remaining() {
			return this.length - this._readOffset;
		}
		/**
		* Gets the current read offset value of the SmartBuffer instance.
		*
		* @return { Number }
		*/
		get readOffset() {
			return this._readOffset;
		}
		/**
		* Sets the read offset value of the SmartBuffer instance.
		*
		* @param offset { Number } - The offset value to set.
		*/
		set readOffset(offset) {
			utils_1.checkOffsetValue(offset);
			utils_1.checkTargetOffset(offset, this);
			this._readOffset = offset;
		}
		/**
		* Gets the current write offset value of the SmartBuffer instance.
		*
		* @return { Number }
		*/
		get writeOffset() {
			return this._writeOffset;
		}
		/**
		* Sets the write offset value of the SmartBuffer instance.
		*
		* @param offset { Number } - The offset value to set.
		*/
		set writeOffset(offset) {
			utils_1.checkOffsetValue(offset);
			utils_1.checkTargetOffset(offset, this);
			this._writeOffset = offset;
		}
		/**
		* Gets the currently set string encoding of the SmartBuffer instance.
		*
		* @return { BufferEncoding } The string Buffer encoding currently set.
		*/
		get encoding() {
			return this._encoding;
		}
		/**
		* Sets the string encoding of the SmartBuffer instance.
		*
		* @param encoding { BufferEncoding } The string Buffer encoding to set.
		*/
		set encoding(encoding) {
			utils_1.checkEncoding(encoding);
			this._encoding = encoding;
		}
		/**
		* Gets the underlying internal Buffer. (This includes unmanaged data in the Buffer)
		*
		* @return { Buffer } The Buffer value.
		*/
		get internalBuffer() {
			return this._buff;
		}
		/**
		* Gets the value of the internal managed Buffer (Includes managed data only)
		*
		* @param { Buffer }
		*/
		toBuffer() {
			return this._buff.slice(0, this.length);
		}
		/**
		* Gets the String value of the internal managed Buffer
		*
		* @param encoding { String } The BufferEncoding to display the Buffer as (defaults to instance level encoding).
		*/
		toString(encoding) {
			const encodingVal = typeof encoding === "string" ? encoding : this._encoding;
			utils_1.checkEncoding(encodingVal);
			return this._buff.toString(encodingVal, 0, this.length);
		}
		/**
		* Destroys the SmartBuffer instance.
		*/
		destroy() {
			this.clear();
			return this;
		}
		/**
		* Handles inserting and writing strings.
		*
		* @param value { String } The String value to insert.
		* @param isInsert { Boolean } True if inserting a string, false if writing.
		* @param arg2 { Number | String } The offset to insert the string at, or the BufferEncoding to use.
		* @param encoding { String } The BufferEncoding to use for writing strings (defaults to instance encoding).
		*/
		_handleString(value, isInsert, arg3, encoding) {
			let offsetVal = this._writeOffset;
			let encodingVal = this._encoding;
			if (typeof arg3 === "number") offsetVal = arg3;
			else if (typeof arg3 === "string") {
				utils_1.checkEncoding(arg3);
				encodingVal = arg3;
			}
			if (typeof encoding === "string") {
				utils_1.checkEncoding(encoding);
				encodingVal = encoding;
			}
			const byteLength = Buffer.byteLength(value, encodingVal);
			if (isInsert) this.ensureInsertable(byteLength, offsetVal);
			else this._ensureWriteable(byteLength, offsetVal);
			this._buff.write(value, offsetVal, byteLength, encodingVal);
			if (isInsert) this._writeOffset += byteLength;
			else if (typeof arg3 === "number") this._writeOffset = Math.max(this._writeOffset, offsetVal + byteLength);
			else this._writeOffset += byteLength;
			return this;
		}
		/**
		* Handles writing or insert of a Buffer.
		*
		* @param value { Buffer } The Buffer to write.
		* @param offset { Number } The offset to write the Buffer to.
		*/
		_handleBuffer(value, isInsert, offset) {
			const offsetVal = typeof offset === "number" ? offset : this._writeOffset;
			if (isInsert) this.ensureInsertable(value.length, offsetVal);
			else this._ensureWriteable(value.length, offsetVal);
			value.copy(this._buff, offsetVal);
			if (isInsert) this._writeOffset += value.length;
			else if (typeof offset === "number") this._writeOffset = Math.max(this._writeOffset, offsetVal + value.length);
			else this._writeOffset += value.length;
			return this;
		}
		/**
		* Ensures that the internal Buffer is large enough to read data.
		*
		* @param length { Number } The length of the data that needs to be read.
		* @param offset { Number } The offset of the data that needs to be read.
		*/
		ensureReadable(length, offset) {
			let offsetVal = this._readOffset;
			if (typeof offset !== "undefined") {
				utils_1.checkOffsetValue(offset);
				offsetVal = offset;
			}
			if (offsetVal < 0 || offsetVal + length > this.length) throw new Error(utils_1.ERRORS.INVALID_READ_BEYOND_BOUNDS);
		}
		/**
		* Ensures that the internal Buffer is large enough to insert data.
		*
		* @param dataLength { Number } The length of the data that needs to be written.
		* @param offset { Number } The offset of the data to be written.
		*/
		ensureInsertable(dataLength, offset) {
			utils_1.checkOffsetValue(offset);
			this._ensureCapacity(this.length + dataLength);
			if (offset < this.length) this._buff.copy(this._buff, offset + dataLength, offset, this._buff.length);
			if (offset + dataLength > this.length) this.length = offset + dataLength;
			else this.length += dataLength;
		}
		/**
		* Ensures that the internal Buffer is large enough to write data.
		*
		* @param dataLength { Number } The length of the data that needs to be written.
		* @param offset { Number } The offset of the data to be written (defaults to writeOffset).
		*/
		_ensureWriteable(dataLength, offset) {
			const offsetVal = typeof offset === "number" ? offset : this._writeOffset;
			this._ensureCapacity(offsetVal + dataLength);
			if (offsetVal + dataLength > this.length) this.length = offsetVal + dataLength;
		}
		/**
		* Ensures that the internal Buffer is large enough to write at least the given amount of data.
		*
		* @param minLength { Number } The minimum length of the data needs to be written.
		*/
		_ensureCapacity(minLength) {
			const oldLength = this._buff.length;
			if (minLength > oldLength) {
				let data = this._buff;
				let newLength = oldLength * 3 / 2 + 1;
				if (newLength < minLength) newLength = minLength;
				this._buff = Buffer.allocUnsafe(newLength);
				data.copy(this._buff, 0, 0, oldLength);
			}
		}
		/**
		* Reads a numeric number value using the provided function.
		*
		* @typeparam T { number | bigint } The type of the value to be read
		*
		* @param func { Function(offset: number) => number } The function to read data on the internal Buffer with.
		* @param byteSize { Number } The number of bytes read.
		* @param offset { Number } The offset to read from (optional). When this is not provided, the managed readOffset is used instead.
		*
		* @returns { T } the number value
		*/
		_readNumberValue(func, byteSize, offset) {
			this.ensureReadable(byteSize, offset);
			const value = func.call(this._buff, typeof offset === "number" ? offset : this._readOffset);
			if (typeof offset === "undefined") this._readOffset += byteSize;
			return value;
		}
		/**
		* Inserts a numeric number value based on the given offset and value.
		*
		* @typeparam T { number | bigint } The type of the value to be written
		*
		* @param func { Function(offset: T, offset?) => number} The function to write data on the internal Buffer with.
		* @param byteSize { Number } The number of bytes written.
		* @param value { T } The number value to write.
		* @param offset { Number } the offset to write the number at (REQUIRED).
		*
		* @returns SmartBuffer this buffer
		*/
		_insertNumberValue(func, byteSize, value, offset) {
			utils_1.checkOffsetValue(offset);
			this.ensureInsertable(byteSize, offset);
			func.call(this._buff, value, offset);
			this._writeOffset += byteSize;
			return this;
		}
		/**
		* Writes a numeric number value based on the given offset and value.
		*
		* @typeparam T { number | bigint } The type of the value to be written
		*
		* @param func { Function(offset: T, offset?) => number} The function to write data on the internal Buffer with.
		* @param byteSize { Number } The number of bytes written.
		* @param value { T } The number value to write.
		* @param offset { Number } the offset to write the number at (REQUIRED).
		*
		* @returns SmartBuffer this buffer
		*/
		_writeNumberValue(func, byteSize, value, offset) {
			if (typeof offset === "number") {
				if (offset < 0) throw new Error(utils_1.ERRORS.INVALID_WRITE_BEYOND_BOUNDS);
				utils_1.checkOffsetValue(offset);
			}
			const offsetVal = typeof offset === "number" ? offset : this._writeOffset;
			this._ensureWriteable(byteSize, offsetVal);
			func.call(this._buff, value, offsetVal);
			if (typeof offset === "number") this._writeOffset = Math.max(this._writeOffset, offsetVal + byteSize);
			else this._writeOffset += byteSize;
			return this;
		}
	};
}));
//#endregion
//#region node_modules/socks/build/common/constants.js
var require_constants = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.SOCKS5_NO_ACCEPTABLE_AUTH = exports.SOCKS5_CUSTOM_AUTH_END = exports.SOCKS5_CUSTOM_AUTH_START = exports.SOCKS_INCOMING_PACKET_SIZES = exports.SocksClientState = exports.Socks5Response = exports.Socks5HostType = exports.Socks5Auth = exports.Socks4Response = exports.SocksCommand = exports.ERRORS = exports.DEFAULT_TIMEOUT = void 0;
	exports.DEFAULT_TIMEOUT = 3e4;
	exports.ERRORS = {
		InvalidSocksCommand: "An invalid SOCKS command was provided. Valid options are connect, bind, and associate.",
		InvalidSocksCommandForOperation: "An invalid SOCKS command was provided. Only a subset of commands are supported for this operation.",
		InvalidSocksCommandChain: "An invalid SOCKS command was provided. Chaining currently only supports the connect command.",
		InvalidSocksClientOptionsDestination: "An invalid destination host was provided.",
		InvalidSocksClientOptionsExistingSocket: "An invalid existing socket was provided. This should be an instance of stream.Duplex.",
		InvalidSocksClientOptionsProxy: "Invalid SOCKS proxy details were provided.",
		InvalidSocksClientOptionsTimeout: "An invalid timeout value was provided. Please enter a value above 0 (in ms).",
		InvalidSocksClientOptionsProxiesLength: "At least two socks proxies must be provided for chaining.",
		InvalidSocksClientOptionsCustomAuthRange: "Custom auth must be a value between 0x80 and 0xFE.",
		InvalidSocksClientOptionsCustomAuthOptions: "When a custom_auth_method is provided, custom_auth_request_handler, custom_auth_response_size, and custom_auth_response_handler must also be provided and valid.",
		NegotiationError: "Negotiation error",
		SocketClosed: "Socket closed",
		ProxyConnectionTimedOut: "Proxy connection timed out",
		InternalError: "SocksClient internal error (this should not happen)",
		InvalidSocks4HandshakeResponse: "Received invalid Socks4 handshake response",
		Socks4ProxyRejectedConnection: "Socks4 Proxy rejected connection",
		InvalidSocks4IncomingConnectionResponse: "Socks4 invalid incoming connection response",
		Socks4ProxyRejectedIncomingBoundConnection: "Socks4 Proxy rejected incoming bound connection",
		InvalidSocks5InitialHandshakeResponse: "Received invalid Socks5 initial handshake response",
		InvalidSocks5IntiailHandshakeSocksVersion: "Received invalid Socks5 initial handshake (invalid socks version)",
		InvalidSocks5InitialHandshakeNoAcceptedAuthType: "Received invalid Socks5 initial handshake (no accepted authentication type)",
		InvalidSocks5InitialHandshakeUnknownAuthType: "Received invalid Socks5 initial handshake (unknown authentication type)",
		Socks5AuthenticationFailed: "Socks5 Authentication failed",
		InvalidSocks5FinalHandshake: "Received invalid Socks5 final handshake response",
		InvalidSocks5FinalHandshakeRejected: "Socks5 proxy rejected connection",
		InvalidSocks5IncomingConnectionResponse: "Received invalid Socks5 incoming connection response",
		Socks5ProxyRejectedIncomingBoundConnection: "Socks5 Proxy rejected incoming bound connection"
	};
	exports.SOCKS_INCOMING_PACKET_SIZES = {
		Socks5InitialHandshakeResponse: 2,
		Socks5UserPassAuthenticationResponse: 2,
		Socks5ResponseHeader: 5,
		Socks5ResponseIPv4: 10,
		Socks5ResponseIPv6: 22,
		Socks5ResponseHostname: (hostNameLength) => hostNameLength + 7,
		Socks4Response: 8
	};
	var SocksCommand;
	(function(SocksCommand) {
		SocksCommand[SocksCommand["connect"] = 1] = "connect";
		SocksCommand[SocksCommand["bind"] = 2] = "bind";
		SocksCommand[SocksCommand["associate"] = 3] = "associate";
	})(SocksCommand || (exports.SocksCommand = SocksCommand = {}));
	var Socks4Response;
	(function(Socks4Response) {
		Socks4Response[Socks4Response["Granted"] = 90] = "Granted";
		Socks4Response[Socks4Response["Failed"] = 91] = "Failed";
		Socks4Response[Socks4Response["Rejected"] = 92] = "Rejected";
		Socks4Response[Socks4Response["RejectedIdent"] = 93] = "RejectedIdent";
	})(Socks4Response || (exports.Socks4Response = Socks4Response = {}));
	var Socks5Auth;
	(function(Socks5Auth) {
		Socks5Auth[Socks5Auth["NoAuth"] = 0] = "NoAuth";
		Socks5Auth[Socks5Auth["GSSApi"] = 1] = "GSSApi";
		Socks5Auth[Socks5Auth["UserPass"] = 2] = "UserPass";
	})(Socks5Auth || (exports.Socks5Auth = Socks5Auth = {}));
	exports.SOCKS5_CUSTOM_AUTH_START = 128;
	exports.SOCKS5_CUSTOM_AUTH_END = 254;
	exports.SOCKS5_NO_ACCEPTABLE_AUTH = 255;
	var Socks5Response;
	(function(Socks5Response) {
		Socks5Response[Socks5Response["Granted"] = 0] = "Granted";
		Socks5Response[Socks5Response["Failure"] = 1] = "Failure";
		Socks5Response[Socks5Response["NotAllowed"] = 2] = "NotAllowed";
		Socks5Response[Socks5Response["NetworkUnreachable"] = 3] = "NetworkUnreachable";
		Socks5Response[Socks5Response["HostUnreachable"] = 4] = "HostUnreachable";
		Socks5Response[Socks5Response["ConnectionRefused"] = 5] = "ConnectionRefused";
		Socks5Response[Socks5Response["TTLExpired"] = 6] = "TTLExpired";
		Socks5Response[Socks5Response["CommandNotSupported"] = 7] = "CommandNotSupported";
		Socks5Response[Socks5Response["AddressNotSupported"] = 8] = "AddressNotSupported";
	})(Socks5Response || (exports.Socks5Response = Socks5Response = {}));
	var Socks5HostType;
	(function(Socks5HostType) {
		Socks5HostType[Socks5HostType["IPv4"] = 1] = "IPv4";
		Socks5HostType[Socks5HostType["Hostname"] = 3] = "Hostname";
		Socks5HostType[Socks5HostType["IPv6"] = 4] = "IPv6";
	})(Socks5HostType || (exports.Socks5HostType = Socks5HostType = {}));
	var SocksClientState;
	(function(SocksClientState) {
		SocksClientState[SocksClientState["Created"] = 0] = "Created";
		SocksClientState[SocksClientState["Connecting"] = 1] = "Connecting";
		SocksClientState[SocksClientState["Connected"] = 2] = "Connected";
		SocksClientState[SocksClientState["SentInitialHandshake"] = 3] = "SentInitialHandshake";
		SocksClientState[SocksClientState["ReceivedInitialHandshakeResponse"] = 4] = "ReceivedInitialHandshakeResponse";
		SocksClientState[SocksClientState["SentAuthentication"] = 5] = "SentAuthentication";
		SocksClientState[SocksClientState["ReceivedAuthenticationResponse"] = 6] = "ReceivedAuthenticationResponse";
		SocksClientState[SocksClientState["SentFinalHandshake"] = 7] = "SentFinalHandshake";
		SocksClientState[SocksClientState["ReceivedFinalResponse"] = 8] = "ReceivedFinalResponse";
		SocksClientState[SocksClientState["BoundWaitingForConnection"] = 9] = "BoundWaitingForConnection";
		SocksClientState[SocksClientState["Established"] = 10] = "Established";
		SocksClientState[SocksClientState["Disconnected"] = 11] = "Disconnected";
		SocksClientState[SocksClientState["Error"] = 99] = "Error";
	})(SocksClientState || (exports.SocksClientState = SocksClientState = {}));
}));
//#endregion
//#region node_modules/socks/build/common/util.js
var require_util$1 = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.shuffleArray = exports.SocksClientError = void 0;
	/**
	* Error wrapper for SocksClient
	*/
	var SocksClientError = class extends Error {
		constructor(message, options) {
			super(message);
			this.options = options;
		}
	};
	exports.SocksClientError = SocksClientError;
	/**
	* Shuffles a given array.
	* @param array The array to shuffle.
	*/
	function shuffleArray(array) {
		for (let i = array.length - 1; i > 0; i--) {
			const j = Math.floor(Math.random() * (i + 1));
			[array[i], array[j]] = [array[j], array[i]];
		}
	}
	exports.shuffleArray = shuffleArray;
}));
//#endregion
//#region node_modules/socks/build/common/helpers.js
var require_helpers = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.ipToBuffer = exports.int32ToIpv4 = exports.ipv4ToInt32 = exports.validateSocksClientChainOptions = exports.validateSocksClientOptions = void 0;
	const util_1 = require_util$1();
	const constants_1 = require_constants();
	const stream = __require("stream");
	const ip_address_1 = require_ip_address();
	const net$3 = __require("net");
	/**
	* Validates the provided SocksClientOptions
	* @param options { SocksClientOptions }
	* @param acceptedCommands { string[] } A list of accepted SocksProxy commands.
	*/
	function validateSocksClientOptions(options, acceptedCommands = [
		"connect",
		"bind",
		"associate"
	]) {
		if (!constants_1.SocksCommand[options.command]) throw new util_1.SocksClientError(constants_1.ERRORS.InvalidSocksCommand, options);
		if (acceptedCommands.indexOf(options.command) === -1) throw new util_1.SocksClientError(constants_1.ERRORS.InvalidSocksCommandForOperation, options);
		if (!isValidSocksRemoteHost(options.destination)) throw new util_1.SocksClientError(constants_1.ERRORS.InvalidSocksClientOptionsDestination, options);
		if (!isValidSocksProxy(options.proxy)) throw new util_1.SocksClientError(constants_1.ERRORS.InvalidSocksClientOptionsProxy, options);
		validateCustomProxyAuth(options.proxy, options);
		if (options.timeout && !isValidTimeoutValue(options.timeout)) throw new util_1.SocksClientError(constants_1.ERRORS.InvalidSocksClientOptionsTimeout, options);
		if (options.existing_socket && !(options.existing_socket instanceof stream.Duplex)) throw new util_1.SocksClientError(constants_1.ERRORS.InvalidSocksClientOptionsExistingSocket, options);
	}
	exports.validateSocksClientOptions = validateSocksClientOptions;
	/**
	* Validates the SocksClientChainOptions
	* @param options { SocksClientChainOptions }
	*/
	function validateSocksClientChainOptions(options) {
		if (options.command !== "connect") throw new util_1.SocksClientError(constants_1.ERRORS.InvalidSocksCommandChain, options);
		if (!isValidSocksRemoteHost(options.destination)) throw new util_1.SocksClientError(constants_1.ERRORS.InvalidSocksClientOptionsDestination, options);
		if (!(options.proxies && Array.isArray(options.proxies) && options.proxies.length >= 2)) throw new util_1.SocksClientError(constants_1.ERRORS.InvalidSocksClientOptionsProxiesLength, options);
		options.proxies.forEach((proxy) => {
			if (!isValidSocksProxy(proxy)) throw new util_1.SocksClientError(constants_1.ERRORS.InvalidSocksClientOptionsProxy, options);
			validateCustomProxyAuth(proxy, options);
		});
		if (options.timeout && !isValidTimeoutValue(options.timeout)) throw new util_1.SocksClientError(constants_1.ERRORS.InvalidSocksClientOptionsTimeout, options);
	}
	exports.validateSocksClientChainOptions = validateSocksClientChainOptions;
	function validateCustomProxyAuth(proxy, options) {
		if (proxy.custom_auth_method !== void 0) {
			if (proxy.custom_auth_method < constants_1.SOCKS5_CUSTOM_AUTH_START || proxy.custom_auth_method > constants_1.SOCKS5_CUSTOM_AUTH_END) throw new util_1.SocksClientError(constants_1.ERRORS.InvalidSocksClientOptionsCustomAuthRange, options);
			if (proxy.custom_auth_request_handler === void 0 || typeof proxy.custom_auth_request_handler !== "function") throw new util_1.SocksClientError(constants_1.ERRORS.InvalidSocksClientOptionsCustomAuthOptions, options);
			if (proxy.custom_auth_response_size === void 0) throw new util_1.SocksClientError(constants_1.ERRORS.InvalidSocksClientOptionsCustomAuthOptions, options);
			if (proxy.custom_auth_response_handler === void 0 || typeof proxy.custom_auth_response_handler !== "function") throw new util_1.SocksClientError(constants_1.ERRORS.InvalidSocksClientOptionsCustomAuthOptions, options);
		}
	}
	/**
	* Validates a SocksRemoteHost
	* @param remoteHost { SocksRemoteHost }
	*/
	function isValidSocksRemoteHost(remoteHost) {
		return remoteHost && typeof remoteHost.host === "string" && Buffer.byteLength(remoteHost.host) < 256 && typeof remoteHost.port === "number" && remoteHost.port >= 0 && remoteHost.port <= 65535;
	}
	/**
	* Validates a SocksProxy
	* @param proxy { SocksProxy }
	*/
	function isValidSocksProxy(proxy) {
		return proxy && (typeof proxy.host === "string" || typeof proxy.ipaddress === "string") && typeof proxy.port === "number" && proxy.port >= 0 && proxy.port <= 65535 && (proxy.type === 4 || proxy.type === 5);
	}
	/**
	* Validates a timeout value.
	* @param value { Number }
	*/
	function isValidTimeoutValue(value) {
		return typeof value === "number" && value > 0;
	}
	function ipv4ToInt32(ip) {
		return new ip_address_1.Address4(ip).toArray().reduce((acc, part) => (acc << 8) + part, 0) >>> 0;
	}
	exports.ipv4ToInt32 = ipv4ToInt32;
	function int32ToIpv4(int32) {
		return [
			int32 >>> 24 & 255,
			int32 >>> 16 & 255,
			int32 >>> 8 & 255,
			int32 & 255
		].join(".");
	}
	exports.int32ToIpv4 = int32ToIpv4;
	function ipToBuffer(ip) {
		if (net$3.isIPv4(ip)) {
			const address = new ip_address_1.Address4(ip);
			return Buffer.from(address.toArray());
		} else if (net$3.isIPv6(ip)) {
			const address = new ip_address_1.Address6(ip);
			return Buffer.from(address.canonicalForm().split(":").map((segment) => segment.padStart(4, "0")).join(""), "hex");
		} else throw new Error("Invalid IP address format");
	}
	exports.ipToBuffer = ipToBuffer;
}));
//#endregion
//#region node_modules/socks/build/common/receivebuffer.js
var require_receivebuffer = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.ReceiveBuffer = void 0;
	var ReceiveBuffer = class {
		constructor(size = 4096) {
			this.buffer = Buffer.allocUnsafe(size);
			this.offset = 0;
			this.originalSize = size;
		}
		get length() {
			return this.offset;
		}
		append(data) {
			if (!Buffer.isBuffer(data)) throw new Error("Attempted to append a non-buffer instance to ReceiveBuffer.");
			if (this.offset + data.length >= this.buffer.length) {
				const tmp = this.buffer;
				this.buffer = Buffer.allocUnsafe(Math.max(this.buffer.length + this.originalSize, this.buffer.length + data.length));
				tmp.copy(this.buffer);
			}
			data.copy(this.buffer, this.offset);
			return this.offset += data.length;
		}
		peek(length) {
			if (length > this.offset) throw new Error("Attempted to read beyond the bounds of the managed internal data.");
			return this.buffer.slice(0, length);
		}
		get(length) {
			if (length > this.offset) throw new Error("Attempted to read beyond the bounds of the managed internal data.");
			const value = Buffer.allocUnsafe(length);
			this.buffer.slice(0, length).copy(value);
			this.buffer.copyWithin(0, length, length + this.offset - length);
			this.offset -= length;
			return value;
		}
	};
	exports.ReceiveBuffer = ReceiveBuffer;
}));
//#endregion
//#region node_modules/socks/build/client/socksclient.js
var require_socksclient = /* @__PURE__ */ __commonJSMin(((exports) => {
	var __awaiter = exports && exports.__awaiter || function(thisArg, _arguments, P, generator) {
		function adopt(value) {
			return value instanceof P ? value : new P(function(resolve) {
				resolve(value);
			});
		}
		return new (P || (P = Promise))(function(resolve, reject) {
			function fulfilled(value) {
				try {
					step(generator.next(value));
				} catch (e) {
					reject(e);
				}
			}
			function rejected(value) {
				try {
					step(generator["throw"](value));
				} catch (e) {
					reject(e);
				}
			}
			function step(result) {
				result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
			}
			step((generator = generator.apply(thisArg, _arguments || [])).next());
		});
	};
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.SocksClientError = exports.SocksClient = void 0;
	const events_1$1 = __require("events");
	const net$2 = __require("net");
	const smart_buffer_1 = require_smartbuffer();
	const constants_1 = require_constants();
	const helpers_1 = require_helpers();
	const receivebuffer_1 = require_receivebuffer();
	const util_1 = require_util$1();
	Object.defineProperty(exports, "SocksClientError", {
		enumerable: true,
		get: function() {
			return util_1.SocksClientError;
		}
	});
	const ip_address_1 = require_ip_address();
	exports.SocksClient = class SocksClient extends events_1$1.EventEmitter {
		constructor(options) {
			super();
			this.options = Object.assign({}, options);
			(0, helpers_1.validateSocksClientOptions)(options);
			this.setState(constants_1.SocksClientState.Created);
		}
		/**
		* Creates a new SOCKS connection.
		*
		* Note: Supports callbacks and promises. Only supports the connect command.
		* @param options { SocksClientOptions } Options.
		* @param callback { Function } An optional callback function.
		* @returns { Promise }
		*/
		static createConnection(options, callback) {
			return new Promise((resolve, reject) => {
				try {
					(0, helpers_1.validateSocksClientOptions)(options, ["connect"]);
				} catch (err) {
					if (typeof callback === "function") {
						callback(err);
						return resolve(err);
					} else return reject(err);
				}
				const client = new SocksClient(options);
				client.connect(options.existing_socket);
				client.once("established", (info) => {
					client.removeAllListeners();
					if (typeof callback === "function") {
						callback(null, info);
						resolve(info);
					} else resolve(info);
				});
				client.once("error", (err) => {
					client.removeAllListeners();
					if (typeof callback === "function") {
						callback(err);
						resolve(err);
					} else reject(err);
				});
			});
		}
		/**
		* Creates a new SOCKS connection chain to a destination host through 2 or more SOCKS proxies.
		*
		* Note: Supports callbacks and promises. Only supports the connect method.
		* Note: Implemented via createConnection() factory function.
		* @param options { SocksClientChainOptions } Options
		* @param callback { Function } An optional callback function.
		* @returns { Promise }
		*/
		static createConnectionChain(options, callback) {
			return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
				try {
					(0, helpers_1.validateSocksClientChainOptions)(options);
				} catch (err) {
					if (typeof callback === "function") {
						callback(err);
						return resolve(err);
					} else return reject(err);
				}
				if (options.randomizeChain) (0, util_1.shuffleArray)(options.proxies);
				try {
					let sock;
					for (let i = 0; i < options.proxies.length; i++) {
						const nextProxy = options.proxies[i];
						const nextDestination = i === options.proxies.length - 1 ? options.destination : {
							host: options.proxies[i + 1].host || options.proxies[i + 1].ipaddress,
							port: options.proxies[i + 1].port
						};
						const result = yield SocksClient.createConnection({
							command: "connect",
							proxy: nextProxy,
							destination: nextDestination,
							existing_socket: sock
						});
						sock = sock || result.socket;
					}
					if (typeof callback === "function") {
						callback(null, { socket: sock });
						resolve({ socket: sock });
					} else resolve({ socket: sock });
				} catch (err) {
					if (typeof callback === "function") {
						callback(err);
						resolve(err);
					} else reject(err);
				}
			}));
		}
		/**
		* Creates a SOCKS UDP Frame.
		* @param options
		*/
		static createUDPFrame(options) {
			const buff = new smart_buffer_1.SmartBuffer();
			buff.writeUInt16BE(0);
			buff.writeUInt8(options.frameNumber || 0);
			if (net$2.isIPv4(options.remoteHost.host)) {
				buff.writeUInt8(constants_1.Socks5HostType.IPv4);
				buff.writeUInt32BE((0, helpers_1.ipv4ToInt32)(options.remoteHost.host));
			} else if (net$2.isIPv6(options.remoteHost.host)) {
				buff.writeUInt8(constants_1.Socks5HostType.IPv6);
				buff.writeBuffer((0, helpers_1.ipToBuffer)(options.remoteHost.host));
			} else {
				buff.writeUInt8(constants_1.Socks5HostType.Hostname);
				buff.writeUInt8(Buffer.byteLength(options.remoteHost.host));
				buff.writeString(options.remoteHost.host);
			}
			buff.writeUInt16BE(options.remoteHost.port);
			buff.writeBuffer(options.data);
			return buff.toBuffer();
		}
		/**
		* Parses a SOCKS UDP frame.
		* @param data
		*/
		static parseUDPFrame(data) {
			const buff = smart_buffer_1.SmartBuffer.fromBuffer(data);
			buff.readOffset = 2;
			const frameNumber = buff.readUInt8();
			const hostType = buff.readUInt8();
			let remoteHost;
			if (hostType === constants_1.Socks5HostType.IPv4) remoteHost = (0, helpers_1.int32ToIpv4)(buff.readUInt32BE());
			else if (hostType === constants_1.Socks5HostType.IPv6) remoteHost = ip_address_1.Address6.fromByteArray(Array.from(buff.readBuffer(16))).canonicalForm();
			else remoteHost = buff.readString(buff.readUInt8());
			const remotePort = buff.readUInt16BE();
			return {
				frameNumber,
				remoteHost: {
					host: remoteHost,
					port: remotePort
				},
				data: buff.readBuffer()
			};
		}
		/**
		* Internal state setter. If the SocksClient is in an error state, it cannot be changed to a non error state.
		*/
		setState(newState) {
			if (this.state !== constants_1.SocksClientState.Error) this.state = newState;
		}
		/**
		* Starts the connection establishment to the proxy and destination.
		* @param existingSocket Connected socket to use instead of creating a new one (internal use).
		*/
		connect(existingSocket) {
			this.onDataReceived = (data) => this.onDataReceivedHandler(data);
			this.onClose = () => this.onCloseHandler();
			this.onError = (err) => this.onErrorHandler(err);
			this.onConnect = () => this.onConnectHandler();
			const timer = setTimeout(() => this.onEstablishedTimeout(), this.options.timeout || constants_1.DEFAULT_TIMEOUT);
			if (timer.unref && typeof timer.unref === "function") timer.unref();
			if (existingSocket) this.socket = existingSocket;
			else this.socket = new net$2.Socket();
			this.socket.once("close", this.onClose);
			this.socket.once("error", this.onError);
			this.socket.once("connect", this.onConnect);
			this.socket.on("data", this.onDataReceived);
			this.setState(constants_1.SocksClientState.Connecting);
			this.receiveBuffer = new receivebuffer_1.ReceiveBuffer();
			if (existingSocket) this.socket.emit("connect");
			else {
				this.socket.connect(this.getSocketOptions());
				if (this.options.set_tcp_nodelay !== void 0 && this.options.set_tcp_nodelay !== null) this.socket.setNoDelay(!!this.options.set_tcp_nodelay);
			}
			this.prependOnceListener("established", (info) => {
				setImmediate(() => {
					if (this.receiveBuffer.length > 0) {
						const excessData = this.receiveBuffer.get(this.receiveBuffer.length);
						info.socket.emit("data", excessData);
					}
					info.socket.resume();
				});
			});
		}
		getSocketOptions() {
			return Object.assign(Object.assign({}, this.options.socket_options), {
				host: this.options.proxy.host || this.options.proxy.ipaddress,
				port: this.options.proxy.port
			});
		}
		/**
		* Handles internal Socks timeout callback.
		* Note: If the Socks client is not BoundWaitingForConnection or Established, the connection will be closed.
		*/
		onEstablishedTimeout() {
			if (this.state !== constants_1.SocksClientState.Established && this.state !== constants_1.SocksClientState.BoundWaitingForConnection) this.closeSocket(constants_1.ERRORS.ProxyConnectionTimedOut);
		}
		/**
		* Handles Socket connect event.
		*/
		onConnectHandler() {
			this.setState(constants_1.SocksClientState.Connected);
			if (this.options.proxy.type === 4) this.sendSocks4InitialHandshake();
			else this.sendSocks5InitialHandshake();
			this.setState(constants_1.SocksClientState.SentInitialHandshake);
		}
		/**
		* Handles Socket data event.
		* @param data
		*/
		onDataReceivedHandler(data) {
			this.receiveBuffer.append(data);
			this.processData();
		}
		/**
		* Handles processing of the data we have received.
		*/
		processData() {
			while (this.state !== constants_1.SocksClientState.Established && this.state !== constants_1.SocksClientState.Error && this.receiveBuffer.length >= this.nextRequiredPacketBufferSize) if (this.state === constants_1.SocksClientState.SentInitialHandshake) if (this.options.proxy.type === 4) this.handleSocks4FinalHandshakeResponse();
			else this.handleInitialSocks5HandshakeResponse();
			else if (this.state === constants_1.SocksClientState.SentAuthentication) this.handleInitialSocks5AuthenticationHandshakeResponse();
			else if (this.state === constants_1.SocksClientState.SentFinalHandshake) this.handleSocks5FinalHandshakeResponse();
			else if (this.state === constants_1.SocksClientState.BoundWaitingForConnection) if (this.options.proxy.type === 4) this.handleSocks4IncomingConnectionResponse();
			else this.handleSocks5IncomingConnectionResponse();
			else {
				this.closeSocket(constants_1.ERRORS.InternalError);
				break;
			}
		}
		/**
		* Handles Socket close event.
		* @param had_error
		*/
		onCloseHandler() {
			this.closeSocket(constants_1.ERRORS.SocketClosed);
		}
		/**
		* Handles Socket error event.
		* @param err
		*/
		onErrorHandler(err) {
			this.closeSocket(err.message);
		}
		/**
		* Removes internal event listeners on the underlying Socket.
		*/
		removeInternalSocketHandlers() {
			this.socket.pause();
			this.socket.removeListener("data", this.onDataReceived);
			this.socket.removeListener("close", this.onClose);
			this.socket.removeListener("error", this.onError);
			this.socket.removeListener("connect", this.onConnect);
		}
		/**
		* Closes and destroys the underlying Socket. Emits an error event.
		* @param err { String } An error string to include in error event.
		*/
		closeSocket(err) {
			if (this.state !== constants_1.SocksClientState.Error) {
				this.setState(constants_1.SocksClientState.Error);
				this.socket.destroy();
				this.removeInternalSocketHandlers();
				this.emit("error", new util_1.SocksClientError(err, this.options));
			}
		}
		/**
		* Sends initial Socks v4 handshake request.
		*/
		sendSocks4InitialHandshake() {
			const userId = this.options.proxy.userId || "";
			const buff = new smart_buffer_1.SmartBuffer();
			buff.writeUInt8(4);
			buff.writeUInt8(constants_1.SocksCommand[this.options.command]);
			buff.writeUInt16BE(this.options.destination.port);
			if (net$2.isIPv4(this.options.destination.host)) {
				buff.writeBuffer((0, helpers_1.ipToBuffer)(this.options.destination.host));
				buff.writeStringNT(userId);
			} else {
				buff.writeUInt8(0);
				buff.writeUInt8(0);
				buff.writeUInt8(0);
				buff.writeUInt8(1);
				buff.writeStringNT(userId);
				buff.writeStringNT(this.options.destination.host);
			}
			this.nextRequiredPacketBufferSize = constants_1.SOCKS_INCOMING_PACKET_SIZES.Socks4Response;
			this.socket.write(buff.toBuffer());
		}
		/**
		* Handles Socks v4 handshake response.
		* @param data
		*/
		handleSocks4FinalHandshakeResponse() {
			const data = this.receiveBuffer.get(8);
			if (data[1] !== constants_1.Socks4Response.Granted) this.closeSocket(`${constants_1.ERRORS.Socks4ProxyRejectedConnection} - (${constants_1.Socks4Response[data[1]]})`);
			else if (constants_1.SocksCommand[this.options.command] === constants_1.SocksCommand.bind) {
				const buff = smart_buffer_1.SmartBuffer.fromBuffer(data);
				buff.readOffset = 2;
				const remoteHost = {
					port: buff.readUInt16BE(),
					host: (0, helpers_1.int32ToIpv4)(buff.readUInt32BE())
				};
				if (remoteHost.host === "0.0.0.0") remoteHost.host = this.options.proxy.ipaddress;
				this.setState(constants_1.SocksClientState.BoundWaitingForConnection);
				this.emit("bound", {
					remoteHost,
					socket: this.socket
				});
			} else {
				this.setState(constants_1.SocksClientState.Established);
				this.removeInternalSocketHandlers();
				this.emit("established", { socket: this.socket });
			}
		}
		/**
		* Handles Socks v4 incoming connection request (BIND)
		* @param data
		*/
		handleSocks4IncomingConnectionResponse() {
			const data = this.receiveBuffer.get(8);
			if (data[1] !== constants_1.Socks4Response.Granted) this.closeSocket(`${constants_1.ERRORS.Socks4ProxyRejectedIncomingBoundConnection} - (${constants_1.Socks4Response[data[1]]})`);
			else {
				const buff = smart_buffer_1.SmartBuffer.fromBuffer(data);
				buff.readOffset = 2;
				const remoteHost = {
					port: buff.readUInt16BE(),
					host: (0, helpers_1.int32ToIpv4)(buff.readUInt32BE())
				};
				this.setState(constants_1.SocksClientState.Established);
				this.removeInternalSocketHandlers();
				this.emit("established", {
					remoteHost,
					socket: this.socket
				});
			}
		}
		/**
		* Sends initial Socks v5 handshake request.
		*/
		sendSocks5InitialHandshake() {
			const buff = new smart_buffer_1.SmartBuffer();
			const supportedAuthMethods = [constants_1.Socks5Auth.NoAuth];
			if (this.options.proxy.userId || this.options.proxy.password) supportedAuthMethods.push(constants_1.Socks5Auth.UserPass);
			if (this.options.proxy.custom_auth_method !== void 0) supportedAuthMethods.push(this.options.proxy.custom_auth_method);
			buff.writeUInt8(5);
			buff.writeUInt8(supportedAuthMethods.length);
			for (const authMethod of supportedAuthMethods) buff.writeUInt8(authMethod);
			this.nextRequiredPacketBufferSize = constants_1.SOCKS_INCOMING_PACKET_SIZES.Socks5InitialHandshakeResponse;
			this.socket.write(buff.toBuffer());
			this.setState(constants_1.SocksClientState.SentInitialHandshake);
		}
		/**
		* Handles initial Socks v5 handshake response.
		* @param data
		*/
		handleInitialSocks5HandshakeResponse() {
			const data = this.receiveBuffer.get(2);
			if (data[0] !== 5) this.closeSocket(constants_1.ERRORS.InvalidSocks5IntiailHandshakeSocksVersion);
			else if (data[1] === constants_1.SOCKS5_NO_ACCEPTABLE_AUTH) this.closeSocket(constants_1.ERRORS.InvalidSocks5InitialHandshakeNoAcceptedAuthType);
			else if (data[1] === constants_1.Socks5Auth.NoAuth) {
				this.socks5ChosenAuthType = constants_1.Socks5Auth.NoAuth;
				this.sendSocks5CommandRequest();
			} else if (data[1] === constants_1.Socks5Auth.UserPass) {
				this.socks5ChosenAuthType = constants_1.Socks5Auth.UserPass;
				this.sendSocks5UserPassAuthentication();
			} else if (data[1] === this.options.proxy.custom_auth_method) {
				this.socks5ChosenAuthType = this.options.proxy.custom_auth_method;
				this.sendSocks5CustomAuthentication();
			} else this.closeSocket(constants_1.ERRORS.InvalidSocks5InitialHandshakeUnknownAuthType);
		}
		/**
		* Sends Socks v5 user & password auth handshake.
		*
		* Note: No auth and user/pass are currently supported.
		*/
		sendSocks5UserPassAuthentication() {
			const userId = this.options.proxy.userId || "";
			const password = this.options.proxy.password || "";
			const buff = new smart_buffer_1.SmartBuffer();
			buff.writeUInt8(1);
			buff.writeUInt8(Buffer.byteLength(userId));
			buff.writeString(userId);
			buff.writeUInt8(Buffer.byteLength(password));
			buff.writeString(password);
			this.nextRequiredPacketBufferSize = constants_1.SOCKS_INCOMING_PACKET_SIZES.Socks5UserPassAuthenticationResponse;
			this.socket.write(buff.toBuffer());
			this.setState(constants_1.SocksClientState.SentAuthentication);
		}
		sendSocks5CustomAuthentication() {
			return __awaiter(this, void 0, void 0, function* () {
				this.nextRequiredPacketBufferSize = this.options.proxy.custom_auth_response_size;
				this.socket.write(yield this.options.proxy.custom_auth_request_handler());
				this.setState(constants_1.SocksClientState.SentAuthentication);
			});
		}
		handleSocks5CustomAuthHandshakeResponse(data) {
			return __awaiter(this, void 0, void 0, function* () {
				return yield this.options.proxy.custom_auth_response_handler(data);
			});
		}
		handleSocks5AuthenticationNoAuthHandshakeResponse(data) {
			return __awaiter(this, void 0, void 0, function* () {
				return data[1] === 0;
			});
		}
		handleSocks5AuthenticationUserPassHandshakeResponse(data) {
			return __awaiter(this, void 0, void 0, function* () {
				return data[1] === 0;
			});
		}
		/**
		* Handles Socks v5 auth handshake response.
		* @param data
		*/
		handleInitialSocks5AuthenticationHandshakeResponse() {
			return __awaiter(this, void 0, void 0, function* () {
				this.setState(constants_1.SocksClientState.ReceivedAuthenticationResponse);
				let authResult = false;
				if (this.socks5ChosenAuthType === constants_1.Socks5Auth.NoAuth) authResult = yield this.handleSocks5AuthenticationNoAuthHandshakeResponse(this.receiveBuffer.get(2));
				else if (this.socks5ChosenAuthType === constants_1.Socks5Auth.UserPass) authResult = yield this.handleSocks5AuthenticationUserPassHandshakeResponse(this.receiveBuffer.get(2));
				else if (this.socks5ChosenAuthType === this.options.proxy.custom_auth_method) authResult = yield this.handleSocks5CustomAuthHandshakeResponse(this.receiveBuffer.get(this.options.proxy.custom_auth_response_size));
				if (!authResult) this.closeSocket(constants_1.ERRORS.Socks5AuthenticationFailed);
				else this.sendSocks5CommandRequest();
			});
		}
		/**
		* Sends Socks v5 final handshake request.
		*/
		sendSocks5CommandRequest() {
			const buff = new smart_buffer_1.SmartBuffer();
			buff.writeUInt8(5);
			buff.writeUInt8(constants_1.SocksCommand[this.options.command]);
			buff.writeUInt8(0);
			if (net$2.isIPv4(this.options.destination.host)) {
				buff.writeUInt8(constants_1.Socks5HostType.IPv4);
				buff.writeBuffer((0, helpers_1.ipToBuffer)(this.options.destination.host));
			} else if (net$2.isIPv6(this.options.destination.host)) {
				buff.writeUInt8(constants_1.Socks5HostType.IPv6);
				buff.writeBuffer((0, helpers_1.ipToBuffer)(this.options.destination.host));
			} else {
				buff.writeUInt8(constants_1.Socks5HostType.Hostname);
				buff.writeUInt8(this.options.destination.host.length);
				buff.writeString(this.options.destination.host);
			}
			buff.writeUInt16BE(this.options.destination.port);
			this.nextRequiredPacketBufferSize = constants_1.SOCKS_INCOMING_PACKET_SIZES.Socks5ResponseHeader;
			this.socket.write(buff.toBuffer());
			this.setState(constants_1.SocksClientState.SentFinalHandshake);
		}
		/**
		* Handles Socks v5 final handshake response.
		* @param data
		*/
		handleSocks5FinalHandshakeResponse() {
			const header = this.receiveBuffer.peek(5);
			if (header[0] !== 5 || header[1] !== constants_1.Socks5Response.Granted) this.closeSocket(`${constants_1.ERRORS.InvalidSocks5FinalHandshakeRejected} - ${constants_1.Socks5Response[header[1]]}`);
			else {
				const addressType = header[3];
				let remoteHost;
				let buff;
				if (addressType === constants_1.Socks5HostType.IPv4) {
					const dataNeeded = constants_1.SOCKS_INCOMING_PACKET_SIZES.Socks5ResponseIPv4;
					if (this.receiveBuffer.length < dataNeeded) {
						this.nextRequiredPacketBufferSize = dataNeeded;
						return;
					}
					buff = smart_buffer_1.SmartBuffer.fromBuffer(this.receiveBuffer.get(dataNeeded).slice(4));
					remoteHost = {
						host: (0, helpers_1.int32ToIpv4)(buff.readUInt32BE()),
						port: buff.readUInt16BE()
					};
					if (remoteHost.host === "0.0.0.0") remoteHost.host = this.options.proxy.ipaddress;
				} else if (addressType === constants_1.Socks5HostType.Hostname) {
					const hostLength = header[4];
					const dataNeeded = constants_1.SOCKS_INCOMING_PACKET_SIZES.Socks5ResponseHostname(hostLength);
					if (this.receiveBuffer.length < dataNeeded) {
						this.nextRequiredPacketBufferSize = dataNeeded;
						return;
					}
					buff = smart_buffer_1.SmartBuffer.fromBuffer(this.receiveBuffer.get(dataNeeded).slice(5));
					remoteHost = {
						host: buff.readString(hostLength),
						port: buff.readUInt16BE()
					};
				} else if (addressType === constants_1.Socks5HostType.IPv6) {
					const dataNeeded = constants_1.SOCKS_INCOMING_PACKET_SIZES.Socks5ResponseIPv6;
					if (this.receiveBuffer.length < dataNeeded) {
						this.nextRequiredPacketBufferSize = dataNeeded;
						return;
					}
					buff = smart_buffer_1.SmartBuffer.fromBuffer(this.receiveBuffer.get(dataNeeded).slice(4));
					remoteHost = {
						host: ip_address_1.Address6.fromByteArray(Array.from(buff.readBuffer(16))).canonicalForm(),
						port: buff.readUInt16BE()
					};
				}
				this.setState(constants_1.SocksClientState.ReceivedFinalResponse);
				if (constants_1.SocksCommand[this.options.command] === constants_1.SocksCommand.connect) {
					this.setState(constants_1.SocksClientState.Established);
					this.removeInternalSocketHandlers();
					this.emit("established", {
						remoteHost,
						socket: this.socket
					});
				} else if (constants_1.SocksCommand[this.options.command] === constants_1.SocksCommand.bind) {
					this.setState(constants_1.SocksClientState.BoundWaitingForConnection);
					this.nextRequiredPacketBufferSize = constants_1.SOCKS_INCOMING_PACKET_SIZES.Socks5ResponseHeader;
					this.emit("bound", {
						remoteHost,
						socket: this.socket
					});
				} else if (constants_1.SocksCommand[this.options.command] === constants_1.SocksCommand.associate) {
					this.setState(constants_1.SocksClientState.Established);
					this.removeInternalSocketHandlers();
					this.emit("established", {
						remoteHost,
						socket: this.socket
					});
				}
			}
		}
		/**
		* Handles Socks v5 incoming connection request (BIND).
		*/
		handleSocks5IncomingConnectionResponse() {
			const header = this.receiveBuffer.peek(5);
			if (header[0] !== 5 || header[1] !== constants_1.Socks5Response.Granted) this.closeSocket(`${constants_1.ERRORS.Socks5ProxyRejectedIncomingBoundConnection} - ${constants_1.Socks5Response[header[1]]}`);
			else {
				const addressType = header[3];
				let remoteHost;
				let buff;
				if (addressType === constants_1.Socks5HostType.IPv4) {
					const dataNeeded = constants_1.SOCKS_INCOMING_PACKET_SIZES.Socks5ResponseIPv4;
					if (this.receiveBuffer.length < dataNeeded) {
						this.nextRequiredPacketBufferSize = dataNeeded;
						return;
					}
					buff = smart_buffer_1.SmartBuffer.fromBuffer(this.receiveBuffer.get(dataNeeded).slice(4));
					remoteHost = {
						host: (0, helpers_1.int32ToIpv4)(buff.readUInt32BE()),
						port: buff.readUInt16BE()
					};
					if (remoteHost.host === "0.0.0.0") remoteHost.host = this.options.proxy.ipaddress;
				} else if (addressType === constants_1.Socks5HostType.Hostname) {
					const hostLength = header[4];
					const dataNeeded = constants_1.SOCKS_INCOMING_PACKET_SIZES.Socks5ResponseHostname(hostLength);
					if (this.receiveBuffer.length < dataNeeded) {
						this.nextRequiredPacketBufferSize = dataNeeded;
						return;
					}
					buff = smart_buffer_1.SmartBuffer.fromBuffer(this.receiveBuffer.get(dataNeeded).slice(5));
					remoteHost = {
						host: buff.readString(hostLength),
						port: buff.readUInt16BE()
					};
				} else if (addressType === constants_1.Socks5HostType.IPv6) {
					const dataNeeded = constants_1.SOCKS_INCOMING_PACKET_SIZES.Socks5ResponseIPv6;
					if (this.receiveBuffer.length < dataNeeded) {
						this.nextRequiredPacketBufferSize = dataNeeded;
						return;
					}
					buff = smart_buffer_1.SmartBuffer.fromBuffer(this.receiveBuffer.get(dataNeeded).slice(4));
					remoteHost = {
						host: ip_address_1.Address6.fromByteArray(Array.from(buff.readBuffer(16))).canonicalForm(),
						port: buff.readUInt16BE()
					};
				}
				this.setState(constants_1.SocksClientState.Established);
				this.removeInternalSocketHandlers();
				this.emit("established", {
					remoteHost,
					socket: this.socket
				});
			}
		}
		get socksClientOptions() {
			return Object.assign({}, this.options);
		}
	};
}));
//#endregion
//#region node_modules/socks/build/index.js
var require_build = /* @__PURE__ */ __commonJSMin(((exports) => {
	var __createBinding = exports && exports.__createBinding || (Object.create ? (function(o, m, k, k2) {
		if (k2 === void 0) k2 = k;
		var desc = Object.getOwnPropertyDescriptor(m, k);
		if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) desc = {
			enumerable: true,
			get: function() {
				return m[k];
			}
		};
		Object.defineProperty(o, k2, desc);
	}) : (function(o, m, k, k2) {
		if (k2 === void 0) k2 = k;
		o[k2] = m[k];
	}));
	var __exportStar = exports && exports.__exportStar || function(m, exports$1) {
		for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports$1, p)) __createBinding(exports$1, m, p);
	};
	Object.defineProperty(exports, "__esModule", { value: true });
	__exportStar(require_socksclient(), exports);
}));
//#endregion
//#region node_modules/socks-proxy-agent/dist/index.js
var require_dist$3 = /* @__PURE__ */ __commonJSMin(((exports) => {
	var __createBinding = exports && exports.__createBinding || (Object.create ? (function(o, m, k, k2) {
		if (k2 === void 0) k2 = k;
		var desc = Object.getOwnPropertyDescriptor(m, k);
		if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) desc = {
			enumerable: true,
			get: function() {
				return m[k];
			}
		};
		Object.defineProperty(o, k2, desc);
	}) : (function(o, m, k, k2) {
		if (k2 === void 0) k2 = k;
		o[k2] = m[k];
	}));
	var __setModuleDefault = exports && exports.__setModuleDefault || (Object.create ? (function(o, v) {
		Object.defineProperty(o, "default", {
			enumerable: true,
			value: v
		});
	}) : function(o, v) {
		o["default"] = v;
	});
	var __importStar = exports && exports.__importStar || function(mod) {
		if (mod && mod.__esModule) return mod;
		var result = {};
		if (mod != null) {
			for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
		}
		__setModuleDefault(result, mod);
		return result;
	};
	var __importDefault = exports && exports.__importDefault || function(mod) {
		return mod && mod.__esModule ? mod : { "default": mod };
	};
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.SocksProxyAgent = void 0;
	const socks_1 = require_build();
	const agent_base_1 = require_dist$4();
	const debug_1 = __importDefault(require_src());
	const dns = __importStar(__require("dns"));
	const net$1 = __importStar(__require("net"));
	const tls$1 = __importStar(__require("tls"));
	const url_1$2 = __require("url");
	const debug = (0, debug_1.default)("socks-proxy-agent");
	const setServernameFromNonIpHost = (options) => {
		if (options.servername === void 0 && options.host && !net$1.isIP(options.host)) return {
			...options,
			servername: options.host
		};
		return options;
	};
	function parseSocksURL(url) {
		let lookup = false;
		let type = 5;
		const host = url.hostname;
		const port = parseInt(url.port, 10) || 1080;
		switch (url.protocol.replace(":", "")) {
			case "socks4":
				lookup = true;
				type = 4;
				break;
			case "socks4a":
				type = 4;
				break;
			case "socks5":
				lookup = true;
				type = 5;
				break;
			case "socks":
				type = 5;
				break;
			case "socks5h":
				type = 5;
				break;
			default: throw new TypeError(`A "socks" protocol must be specified! Got: ${String(url.protocol)}`);
		}
		const proxy = {
			host,
			port,
			type
		};
		if (url.username) Object.defineProperty(proxy, "userId", {
			value: decodeURIComponent(url.username),
			enumerable: false
		});
		if (url.password != null) Object.defineProperty(proxy, "password", {
			value: decodeURIComponent(url.password),
			enumerable: false
		});
		return {
			lookup,
			proxy
		};
	}
	var SocksProxyAgent = class extends agent_base_1.Agent {
		constructor(uri, opts) {
			super(opts);
			const { proxy, lookup } = parseSocksURL(typeof uri === "string" ? new url_1$2.URL(uri) : uri);
			this.shouldLookup = lookup;
			this.proxy = proxy;
			this.timeout = opts?.timeout ?? null;
			this.socketOptions = opts?.socketOptions ?? null;
		}
		/**
		* Initiates a SOCKS connection to the specified SOCKS proxy server,
		* which in turn connects to the specified remote host and port.
		*/
		async connect(req, opts) {
			const { shouldLookup, proxy, timeout } = this;
			if (!opts.host) throw new Error("No `host` defined!");
			let { host } = opts;
			const { port, lookup: lookupFn = dns.lookup } = opts;
			if (shouldLookup) host = await new Promise((resolve, reject) => {
				lookupFn(host, {}, (err, res) => {
					if (err) reject(err);
					else resolve(res);
				});
			});
			const socksOpts = {
				proxy,
				destination: {
					host,
					port: typeof port === "number" ? port : parseInt(port, 10)
				},
				command: "connect",
				timeout: timeout ?? void 0,
				socket_options: this.socketOptions ?? void 0
			};
			const cleanup = (tlsSocket) => {
				req.destroy();
				socket.destroy();
				if (tlsSocket) tlsSocket.destroy();
			};
			debug("Creating socks proxy connection: %o", socksOpts);
			const { socket } = await socks_1.SocksClient.createConnection(socksOpts);
			debug("Successfully created socks proxy connection");
			if (timeout !== null) {
				socket.setTimeout(timeout);
				socket.on("timeout", () => cleanup());
			}
			if (opts.secureEndpoint) {
				debug("Upgrading socket connection to TLS");
				const tlsSocket = tls$1.connect({
					...omit(setServernameFromNonIpHost(opts), "host", "path", "port"),
					socket
				});
				tlsSocket.once("error", (error) => {
					debug("Socket TLS error", error.message);
					cleanup(tlsSocket);
				});
				return tlsSocket;
			}
			return socket;
		}
	};
	SocksProxyAgent.protocols = [
		"socks",
		"socks4",
		"socks4a",
		"socks5",
		"socks5h"
	];
	exports.SocksProxyAgent = SocksProxyAgent;
	function omit(obj, ...keys) {
		const ret = {};
		let key;
		for (key in obj) if (!keys.includes(key)) ret[key] = obj[key];
		return ret;
	}
}));
//#endregion
//#region node_modules/pac-resolver/dist/dateRange.js
var require_dateRange = /* @__PURE__ */ __commonJSMin(((exports) => {
	/**
	* If only a single value is specified (from each category: day, month, year), the
	* function returns a true value only on days that match that specification. If
	* both values are specified, the result is true between those times, including
	* bounds.
	*
	* Even though the examples don't show, the "GMT" parameter can be specified
	* in any of the 9 different call profiles, always as the last parameter.
	*
	* Examples:
	*
	* ``` js
	* dateRange(1)
	* true on the first day of each month, local timezone.
	*
	* dateRange(1, "GMT")
	* true on the first day of each month, GMT timezone.
	*
	* dateRange(1, 15)
	* true on the first half of each month.
	*
	* dateRange(24, "DEC")
	* true on 24th of December each year.
	*
	* dateRange(24, "DEC", 1995)
	* true on 24th of December, 1995.
	*
	* dateRange("JAN", "MAR")
	* true on the first quarter of the year.
	*
	* dateRange(1, "JUN", 15, "AUG")
	* true from June 1st until August 15th, each year (including June 1st and August
	* 15th).
	*
	* dateRange(1, "JUN", 15, 1995, "AUG", 1995)
	* true from June 1st, 1995, until August 15th, same year.
	*
	* dateRange("OCT", 1995, "MAR", 1996)
	* true from October 1995 until March 1996 (including the entire month of October
	* 1995 and March 1996).
	*
	* dateRange(1995)
	* true during the entire year 1995.
	*
	* dateRange(1995, 1997)
	* true from beginning of year 1995 until the end of year 1997.
	* ```
	*
	* dateRange(day)
	* dateRange(day1, day2)
	* dateRange(mon)
	* dateRange(month1, month2)
	* dateRange(year)
	* dateRange(year1, year2)
	* dateRange(day1, month1, day2, month2)
	* dateRange(month1, year1, month2, year2)
	* dateRange(day1, month1, year1, day2, month2, year2)
	* dateRange(day1, month1, year1, day2, month2, year2, gmt)
	*
	* @param {String} day is the day of month between 1 and 31 (as an integer).
	* @param {String} month is one of the month strings: JAN FEB MAR APR MAY JUN JUL AUG SEP OCT NOV DEC
	* @param {String} year is the full year number, for example 1995 (but not 95). Integer.
	* @param {String} gmt is either the string "GMT", which makes time comparison occur in GMT timezone; if left unspecified, times are taken to be in the local timezone.
	* @return {Boolean}
	*/
	Object.defineProperty(exports, "__esModule", { value: true });
	function dateRange() {
		return false;
	}
	exports.default = dateRange;
}));
//#endregion
//#region node_modules/pac-resolver/dist/dnsDomainIs.js
var require_dnsDomainIs = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	/**
	* Returns true iff the domain of hostname matches.
	*
	* Examples:
	*
	* ``` js
	* dnsDomainIs("www.netscape.com", ".netscape.com")
	*   // is true.
	*
	* dnsDomainIs("www", ".netscape.com")
	*   // is false.
	*
	* dnsDomainIs("www.mcom.com", ".netscape.com")
	*   // is false.
	* ```
	*
	*
	* @param {String} host is the hostname from the URL.
	* @param {String} domain is the domain name to test the hostname against.
	* @return {Boolean} true iff the domain of the hostname matches.
	*/
	function dnsDomainIs(host, domain) {
		host = String(host);
		domain = String(domain);
		return host.substr(domain.length * -1) === domain;
	}
	exports.default = dnsDomainIs;
}));
//#endregion
//#region node_modules/pac-resolver/dist/dnsDomainLevels.js
var require_dnsDomainLevels = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	/**
	* Returns the number (integer) of DNS domain levels (number of dots) in the
	* hostname.
	*
	* Examples:
	*
	* ``` js
	* dnsDomainLevels("www")
	*   // returns 0.
	* dnsDomainLevels("www.netscape.com")
	*   // returns 2.
	* ```
	*
	* @param {String} host is the hostname from the URL.
	* @return {Number} number of domain levels
	*/
	function dnsDomainLevels(host) {
		const match = String(host).match(/\./g);
		let levels = 0;
		if (match) levels = match.length;
		return levels;
	}
	exports.default = dnsDomainLevels;
}));
//#endregion
//#region node_modules/pac-resolver/dist/util.js
var require_util = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.isGMT = exports.dnsLookup = void 0;
	const dns_1 = __require("dns");
	function dnsLookup(host, opts) {
		return new Promise((resolve, reject) => {
			(0, dns_1.lookup)(host, opts, (err, res) => {
				if (err) reject(err);
				else resolve(res);
			});
		});
	}
	exports.dnsLookup = dnsLookup;
	function isGMT(v) {
		return v === "GMT";
	}
	exports.isGMT = isGMT;
}));
//#endregion
//#region node_modules/pac-resolver/dist/dnsResolve.js
var require_dnsResolve = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	const util_1 = require_util();
	/**
	* Resolves the given DNS hostname into an IP address, and returns it in the dot
	* separated format as a string.
	*
	* Example:
	*
	* ``` js
	* dnsResolve("home.netscape.com")
	*   // returns the string "198.95.249.79".
	* ```
	*
	* @param {String} host hostname to resolve
	* @return {String} resolved IP address
	*/
	async function dnsResolve(host) {
		const family = 4;
		try {
			const r = await (0, util_1.dnsLookup)(host, { family });
			if (typeof r === "string") return r;
		} catch (err) {}
		return null;
	}
	exports.default = dnsResolve;
}));
//#endregion
//#region node_modules/pac-resolver/dist/isInNet.js
var require_isInNet = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	const netmask_1 = require_netmask();
	const util_1 = require_util();
	/**
	* True iff the IP address of the host matches the specified IP address pattern.
	*
	* Pattern and mask specification is done the same way as for SOCKS configuration.
	*
	* Examples:
	*
	* ``` js
	* isInNet(host, "198.95.249.79", "255.255.255.255")
	*   // is true iff the IP address of host matches exactly 198.95.249.79.
	*
	* isInNet(host, "198.95.0.0", "255.255.0.0")
	*   // is true iff the IP address of the host matches 198.95.*.*.
	* ```
	*
	* @param {String} host a DNS hostname, or IP address. If a hostname is passed,
	*   it will be resoved into an IP address by this function.
	* @param {String} pattern an IP address pattern in the dot-separated format mask.
	* @param {String} mask for the IP address pattern informing which parts of the
	*   IP address should be matched against. 0 means ignore, 255 means match.
	* @return {Boolean}
	*/
	async function isInNet(host, pattern, mask) {
		const family = 4;
		try {
			const ip = await (0, util_1.dnsLookup)(host, { family });
			if (typeof ip === "string") return new netmask_1.Netmask(pattern, mask).contains(ip);
		} catch (err) {}
		return false;
	}
	exports.default = isInNet;
}));
//#endregion
//#region node_modules/pac-resolver/dist/isPlainHostName.js
var require_isPlainHostName = /* @__PURE__ */ __commonJSMin(((exports) => {
	/**
	* True iff there is no domain name in the hostname (no dots).
	*
	* Examples:
	*
	* ``` js
	* isPlainHostName("www")
	*   // is true.
	*
	* isPlainHostName("www.netscape.com")
	*   // is false.
	* ```
	*
	* @param {String} host The hostname from the URL (excluding port number).
	* @return {Boolean}
	*/
	Object.defineProperty(exports, "__esModule", { value: true });
	function isPlainHostName(host) {
		return !/\./.test(host);
	}
	exports.default = isPlainHostName;
}));
//#endregion
//#region node_modules/pac-resolver/dist/isResolvable.js
var require_isResolvable = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	const util_1 = require_util();
	/**
	* Tries to resolve the hostname. Returns true if succeeds.
	*
	* @param {String} host is the hostname from the URL.
	* @return {Boolean}
	*/
	async function isResolvable(host) {
		const family = 4;
		try {
			if (await (0, util_1.dnsLookup)(host, { family })) return true;
		} catch (err) {}
		return false;
	}
	exports.default = isResolvable;
}));
//#endregion
//#region node_modules/pac-resolver/dist/localHostOrDomainIs.js
var require_localHostOrDomainIs = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	/**
	* Is true if the hostname matches exactly the specified hostname, or if there is
	* no domain name part in the hostname, but the unqualified hostname matches.
	*
	* Examples:
	*
	* ``` js
	* localHostOrDomainIs("www.netscape.com", "www.netscape.com")
	*   // is true (exact match).
	*
	* localHostOrDomainIs("www", "www.netscape.com")
	*   // is true (hostname match, domain not specified).
	*
	* localHostOrDomainIs("www.mcom.com", "www.netscape.com")
	*   // is false (domain name mismatch).
	*
	* localHostOrDomainIs("home.netscape.com", "www.netscape.com")
	*   // is false (hostname mismatch).
	* ```
	*
	* @param {String} host the hostname from the URL.
	* @param {String} hostdom fully qualified hostname to match against.
	* @return {Boolean}
	*/
	function localHostOrDomainIs(host, hostdom) {
		const parts = host.split(".");
		const domparts = hostdom.split(".");
		let matches = true;
		for (let i = 0; i < parts.length; i++) if (parts[i] !== domparts[i]) {
			matches = false;
			break;
		}
		return matches;
	}
	exports.default = localHostOrDomainIs;
}));
//#endregion
//#region node_modules/pac-resolver/dist/ip.js
var require_ip = /* @__PURE__ */ __commonJSMin(((exports) => {
	var __importDefault = exports && exports.__importDefault || function(mod) {
		return mod && mod.__esModule ? mod : { "default": mod };
	};
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.ip = void 0;
	const os_1 = __importDefault(__require("os"));
	exports.ip = {
		address() {
			const interfaces = os_1.default.networkInterfaces();
			const family = normalizeFamily();
			const all = Object.values(interfaces).map((addrs = []) => {
				const addresses = addrs.filter((details) => {
					if (normalizeFamily(details.family) !== family || exports.ip.isLoopback(details.address)) return false;
					return true;
				});
				return addresses.length ? addresses[0].address : void 0;
			}).filter(Boolean);
			return !all.length ? exports.ip.loopback(family) : all[0];
		},
		isLoopback(addr) {
			return /^(::f{4}:)?127\.([0-9]{1,3})\.([0-9]{1,3})\.([0-9]{1,3})/.test(addr) || /^fe80::1$/.test(addr) || /^::1$/.test(addr) || /^::$/.test(addr);
		},
		loopback(family) {
			family = normalizeFamily(family);
			if (family !== "ipv4" && family !== "ipv6") throw new Error("family must be ipv4 or ipv6");
			return family === "ipv4" ? "127.0.0.1" : "fe80::1";
		}
	};
	function normalizeFamily(family) {
		if (family === 4) return "ipv4";
		if (family === 6) return "ipv6";
		return family ? family.toLowerCase() : "ipv4";
	}
}));
//#endregion
//#region node_modules/pac-resolver/dist/myIpAddress.js
var require_myIpAddress = /* @__PURE__ */ __commonJSMin(((exports) => {
	var __importDefault = exports && exports.__importDefault || function(mod) {
		return mod && mod.__esModule ? mod : { "default": mod };
	};
	Object.defineProperty(exports, "__esModule", { value: true });
	const ip_1 = require_ip();
	const net_1 = __importDefault(__require("net"));
	/**
	* Returns the IP address of the host that the Navigator is running on, as
	* a string in the dot-separated integer format.
	*
	* Example:
	*
	* ``` js
	* myIpAddress()
	*   // would return the string "198.95.249.79" if you were running the
	*   // Navigator on that host.
	* ```
	*
	* @return {String} external IP address
	*/
	async function myIpAddress() {
		return new Promise((resolve, reject) => {
			const socket = net_1.default.connect({
				host: "8.8.8.8",
				port: 53
			});
			const onError = () => {
				resolve(ip_1.ip.address());
			};
			socket.once("error", onError);
			socket.once("connect", () => {
				socket.removeListener("error", onError);
				const addr = socket.address();
				socket.destroy();
				if (typeof addr === "string") resolve(addr);
				else if (addr.address) resolve(addr.address);
				else reject(/* @__PURE__ */ new Error("Expected a `string`"));
			});
		});
	}
	exports.default = myIpAddress;
}));
//#endregion
//#region node_modules/pac-resolver/dist/shExpMatch.js
var require_shExpMatch = /* @__PURE__ */ __commonJSMin(((exports) => {
	/**
	* Returns true if the string matches the specified shell
	* expression.
	*
	* Actually, currently the patterns are shell expressions,
	* not regular expressions.
	*
	* Examples:
	*
	* ``` js
	* shExpMatch("http://home.netscape.com/people/ari/index.html", "*\/ari/*")
	*   // is true.
	*
	* shExpMatch("http://home.netscape.com/people/montulli/index.html", "*\/ari/*")
	*   // is false.
	* ```
	*
	* @param {String} str is any string to compare (e.g. the URL, or the hostname).
	* @param {String} shexp is a shell expression to compare against.
	* @return {Boolean} true if the string matches the shell expression.
	*/
	Object.defineProperty(exports, "__esModule", { value: true });
	function shExpMatch(str, shexp) {
		return toRegExp(shexp).test(str);
	}
	exports.default = shExpMatch;
	/**
	* Converts a "shell expression" to a JavaScript RegExp.
	*
	* @api private
	*/
	function toRegExp(str) {
		str = String(str).replace(/\./g, "\\.").replace(/\?/g, ".").replace(/\*/g, ".*");
		return new RegExp(`^${str}$`);
	}
}));
//#endregion
//#region node_modules/pac-resolver/dist/timeRange.js
var require_timeRange = /* @__PURE__ */ __commonJSMin(((exports) => {
	/**
	* True during (or between) the specified time(s).
	*
	* Even though the examples don't show it, this parameter may be present in
	* each of the different parameter profiles, always as the last parameter.
	*
	*
	* Examples:
	*
	* ``` js
	* timerange(12)
	* true from noon to 1pm.
	*
	* timerange(12, 13)
	* same as above.
	*
	* timerange(12, "GMT")
	* true from noon to 1pm, in GMT timezone.
	*
	* timerange(9, 17)
	* true from 9am to 5pm.
	*
	* timerange(8, 30, 17, 00)
	* true from 8:30am to 5:00pm.
	*
	* timerange(0, 0, 0, 0, 0, 30)
	* true between midnight and 30 seconds past midnight.
	* ```
	*
	* timeRange(hour)
	* timeRange(hour1, hour2)
	* timeRange(hour1, min1, hour2, min2)
	* timeRange(hour1, min1, sec1, hour2, min2, sec2)
	* timeRange(hour1, min1, sec1, hour2, min2, sec2, gmt)
	*
	* @param {String} hour is the hour from 0 to 23. (0 is midnight, 23 is 11 pm.)
	* @param {String} min minutes from 0 to 59.
	* @param {String} sec seconds from 0 to 59.
	* @param {String} gmt either the string "GMT" for GMT timezone, or not specified, for local timezone.
	* @return {Boolean}
	*/
	Object.defineProperty(exports, "__esModule", { value: true });
	function timeRange() {
		const args = Array.prototype.slice.call(arguments);
		const lastArg = args.pop();
		const useGMTzone = lastArg === "GMT";
		const currentDate = /* @__PURE__ */ new Date();
		if (!useGMTzone) args.push(lastArg);
		let result = false;
		const noOfArgs = args.length;
		const numericArgs = args.map((n) => parseInt(n, 10));
		if (noOfArgs === 1) result = getCurrentHour(useGMTzone, currentDate) === numericArgs[0];
		else if (noOfArgs === 2) {
			const currentHour = getCurrentHour(useGMTzone, currentDate);
			result = numericArgs[0] <= currentHour && currentHour < numericArgs[1];
		} else if (noOfArgs === 4) result = valueInRange(secondsElapsedToday(numericArgs[0], numericArgs[1], 0), secondsElapsedToday(getCurrentHour(useGMTzone, currentDate), getCurrentMinute(useGMTzone, currentDate), 0), secondsElapsedToday(numericArgs[2], numericArgs[3], 59));
		else if (noOfArgs === 6) result = valueInRange(secondsElapsedToday(numericArgs[0], numericArgs[1], numericArgs[2]), secondsElapsedToday(getCurrentHour(useGMTzone, currentDate), getCurrentMinute(useGMTzone, currentDate), getCurrentSecond(useGMTzone, currentDate)), secondsElapsedToday(numericArgs[3], numericArgs[4], numericArgs[5]));
		return result;
	}
	exports.default = timeRange;
	function secondsElapsedToday(hh, mm, ss) {
		return hh * 3600 + mm * 60 + ss;
	}
	function getCurrentHour(gmt, currentDate) {
		return gmt ? currentDate.getUTCHours() : currentDate.getHours();
	}
	function getCurrentMinute(gmt, currentDate) {
		return gmt ? currentDate.getUTCMinutes() : currentDate.getMinutes();
	}
	function getCurrentSecond(gmt, currentDate) {
		return gmt ? currentDate.getUTCSeconds() : currentDate.getSeconds();
	}
	function valueInRange(start, value, finish) {
		return start <= value && value <= finish;
	}
}));
//#endregion
//#region node_modules/pac-resolver/dist/weekdayRange.js
var require_weekdayRange = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	const util_1 = require_util();
	const weekdays = [
		"SUN",
		"MON",
		"TUE",
		"WED",
		"THU",
		"FRI",
		"SAT"
	];
	/**
	* Only the first parameter is mandatory. Either the second, the third, or both
	* may be left out.
	*
	* If only one parameter is present, the function yeilds a true value on the
	* weekday that the parameter represents. If the string "GMT" is specified as
	* a second parameter, times are taken to be in GMT, otherwise in local timezone.
	*
	* If both wd1 and wd1 are defined, the condition is true if the current weekday
	* is in between those two weekdays. Bounds are inclusive. If the "GMT" parameter
	* is specified, times are taken to be in GMT, otherwise the local timezone is
	* used.
	*
	* Valid "weekday strings" are:
	*
	*     SUN MON TUE WED THU FRI SAT
	*
	* Examples:
	*
	* ``` js
	* weekdayRange("MON", "FRI")
	* true Monday trhough Friday (local timezone).
	*
	* weekdayRange("MON", "FRI", "GMT")
	* same as above, but GMT timezone.
	*
	* weekdayRange("SAT")
	* true on Saturdays local time.
	*
	* weekdayRange("SAT", "GMT")
	* true on Saturdays GMT time.
	*
	* weekdayRange("FRI", "MON")
	* true Friday through Monday (note, order does matter!).
	* ```
	*
	*
	* @param {String} wd1 one of the weekday strings.
	* @param {String} wd2 one of the weekday strings.
	* @param {String} gmt is either the string: GMT or is left out.
	* @return {Boolean}
	*/
	function weekdayRange(wd1, wd2, gmt) {
		let useGMTzone = false;
		let wd1Index = -1;
		let wd2Index = -1;
		let wd2IsGmt = false;
		if ((0, util_1.isGMT)(gmt)) useGMTzone = true;
		else if ((0, util_1.isGMT)(wd2)) {
			useGMTzone = true;
			wd2IsGmt = true;
		}
		wd1Index = weekdays.indexOf(wd1);
		if (!wd2IsGmt && isWeekday(wd2)) wd2Index = weekdays.indexOf(wd2);
		const todaysDay = getTodaysDay(useGMTzone);
		let result;
		if (wd2Index < 0) result = todaysDay === wd1Index;
		else if (wd1Index <= wd2Index) result = valueInRange(wd1Index, todaysDay, wd2Index);
		else result = valueInRange(wd1Index, todaysDay, 6) || valueInRange(0, todaysDay, wd2Index);
		return result;
	}
	exports.default = weekdayRange;
	function getTodaysDay(gmt) {
		return gmt ? (/* @__PURE__ */ new Date()).getUTCDay() : (/* @__PURE__ */ new Date()).getDay();
	}
	function valueInRange(start, value, finish) {
		return start <= value && value <= finish;
	}
	function isWeekday(v) {
		if (!v) return false;
		return weekdays.includes(v);
	}
}));
//#endregion
//#region node_modules/pac-resolver/dist/index.js
var require_dist$2 = /* @__PURE__ */ __commonJSMin(((exports) => {
	var __importDefault = exports && exports.__importDefault || function(mod) {
		return mod && mod.__esModule ? mod : { "default": mod };
	};
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.sandbox = exports.createPacResolver = void 0;
	const degenerator_1 = require_dist$8();
	/**
	* Built-in PAC functions.
	*/
	const dateRange_1 = __importDefault(require_dateRange());
	const dnsDomainIs_1 = __importDefault(require_dnsDomainIs());
	const dnsDomainLevels_1 = __importDefault(require_dnsDomainLevels());
	const dnsResolve_1 = __importDefault(require_dnsResolve());
	const isInNet_1 = __importDefault(require_isInNet());
	const isPlainHostName_1 = __importDefault(require_isPlainHostName());
	const isResolvable_1 = __importDefault(require_isResolvable());
	const localHostOrDomainIs_1 = __importDefault(require_localHostOrDomainIs());
	const myIpAddress_1 = __importDefault(require_myIpAddress());
	const shExpMatch_1 = __importDefault(require_shExpMatch());
	const timeRange_1 = __importDefault(require_timeRange());
	const weekdayRange_1 = __importDefault(require_weekdayRange());
	/**
	* Returns an asynchronous `FindProxyForURL()` function
	* from the given JS string (from a PAC file).
	*/
	function createPacResolver(qjs, _str, _opts = {}) {
		const str = Buffer.isBuffer(_str) ? _str.toString("utf8") : _str;
		const context = {
			...exports.sandbox,
			..._opts.sandbox
		};
		const opts = {
			filename: "proxy.pac",
			names: Object.keys(context).filter((k) => isAsyncFunction(context[k])),
			..._opts,
			sandbox: context
		};
		const resolver = (0, degenerator_1.compile)(qjs, str, "FindProxyForURL", opts);
		function FindProxyForURL(url, _host) {
			const urlObj = typeof url === "string" ? new URL(url) : url;
			const host = _host || urlObj.hostname;
			if (!host) throw new TypeError("Could not determine `host`");
			return resolver(urlObj.href, host);
		}
		Object.defineProperty(FindProxyForURL, "toString", {
			value: () => resolver.toString(),
			enumerable: false
		});
		return FindProxyForURL;
	}
	exports.createPacResolver = createPacResolver;
	exports.sandbox = Object.freeze({
		alert: (message = "") => console.log("%s", message),
		dateRange: dateRange_1.default,
		dnsDomainIs: dnsDomainIs_1.default,
		dnsDomainLevels: dnsDomainLevels_1.default,
		dnsResolve: dnsResolve_1.default,
		isInNet: isInNet_1.default,
		isPlainHostName: isPlainHostName_1.default,
		isResolvable: isResolvable_1.default,
		localHostOrDomainIs: localHostOrDomainIs_1.default,
		myIpAddress: myIpAddress_1.default,
		shExpMatch: shExpMatch_1.default,
		timeRange: timeRange_1.default,
		weekdayRange: weekdayRange_1.default
	});
	function isAsyncFunction(v) {
		if (typeof v !== "function") return false;
		if (v.constructor.name === "AsyncFunction") return true;
		if (String(v).indexOf("__awaiter(") !== -1) return true;
		return Boolean(v.async);
	}
}));
//#endregion
//#region node_modules/pac-proxy-agent/dist/index.js
var require_dist$1 = /* @__PURE__ */ __commonJSMin(((exports) => {
	var __createBinding = exports && exports.__createBinding || (Object.create ? (function(o, m, k, k2) {
		if (k2 === void 0) k2 = k;
		var desc = Object.getOwnPropertyDescriptor(m, k);
		if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) desc = {
			enumerable: true,
			get: function() {
				return m[k];
			}
		};
		Object.defineProperty(o, k2, desc);
	}) : (function(o, m, k, k2) {
		if (k2 === void 0) k2 = k;
		o[k2] = m[k];
	}));
	var __setModuleDefault = exports && exports.__setModuleDefault || (Object.create ? (function(o, v) {
		Object.defineProperty(o, "default", {
			enumerable: true,
			value: v
		});
	}) : function(o, v) {
		o["default"] = v;
	});
	var __importStar = exports && exports.__importStar || function(mod) {
		if (mod && mod.__esModule) return mod;
		var result = {};
		if (mod != null) {
			for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
		}
		__setModuleDefault(result, mod);
		return result;
	};
	var __importDefault = exports && exports.__importDefault || function(mod) {
		return mod && mod.__esModule ? mod : { "default": mod };
	};
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.PacProxyAgent = void 0;
	const net = __importStar(__require("net"));
	const tls = __importStar(__require("tls"));
	const crypto$1 = __importStar(__require("crypto"));
	const events_1 = __require("events");
	const debug_1 = __importDefault(require_src());
	const url_1$1 = __require("url");
	const agent_base_1 = require_dist$4();
	const get_uri_1 = require_dist$7();
	const pac_resolver_1 = require_dist$2();
	const quickjs_emscripten_1 = require_dist$9();
	const debug = (0, debug_1.default)("pac-proxy-agent");
	const setServernameFromNonIpHost = (options) => {
		if (options.servername === void 0 && options.host && !net.isIP(options.host)) return {
			...options,
			servername: options.host
		};
		return options;
	};
	/**
	* The `PacProxyAgent` class.
	*
	* A few different "protocol" modes are supported (supported protocols are
	* backed by the `get-uri` module):
	*
	*   - "pac+data", "data" - refers to an embedded "data:" URI
	*   - "pac+file", "file" - refers to a local file
	*   - "pac+ftp", "ftp" - refers to a file located on an FTP server
	*   - "pac+http", "http" - refers to an HTTP endpoint
	*   - "pac+https", "https" - refers to an HTTPS endpoint
	*/
	var PacProxyAgent = class extends agent_base_1.Agent {
		constructor(uri, opts) {
			super(opts);
			this.clearResolverPromise = () => {
				this.resolverPromise = void 0;
			};
			const uriStr = typeof uri === "string" ? uri : uri.href;
			this.uri = new url_1$1.URL(uriStr.replace(/^pac\+/i, ""));
			debug("Creating PacProxyAgent with URI %o", this.uri.href);
			this.opts = { ...opts };
			this.cache = void 0;
			this.resolver = void 0;
			this.resolverHash = "";
			this.resolverPromise = void 0;
			if (!this.opts.filename) this.opts.filename = this.uri.href;
		}
		/**
		* Loads the PAC proxy file from the source if necessary, and returns
		* a generated `FindProxyForURL()` resolver function to use.
		*/
		getResolver() {
			if (!this.resolverPromise) {
				this.resolverPromise = this.loadResolver();
				this.resolverPromise.then(this.clearResolverPromise, this.clearResolverPromise);
			}
			return this.resolverPromise;
		}
		async loadResolver() {
			try {
				const [qjs, code] = await Promise.all([(0, quickjs_emscripten_1.getQuickJS)(), this.loadPacFile()]);
				const hash = crypto$1.createHash("sha1").update(code).digest("hex");
				if (this.resolver && this.resolverHash === hash) {
					debug("Same sha1 hash for code - contents have not changed, reusing previous proxy resolver");
					return this.resolver;
				}
				debug("Creating new proxy resolver instance");
				this.resolver = (0, pac_resolver_1.createPacResolver)(qjs, code, this.opts);
				this.resolverHash = hash;
				return this.resolver;
			} catch (err) {
				if (this.resolver && err.code === "ENOTMODIFIED") {
					debug("Got ENOTMODIFIED response, reusing previous proxy resolver");
					return this.resolver;
				}
				throw err;
			}
		}
		/**
		* Loads the contents of the PAC proxy file.
		*
		* @api private
		*/
		async loadPacFile() {
			debug("Loading PAC file: %o", this.uri);
			const rs = await (0, get_uri_1.getUri)(this.uri, {
				...this.opts,
				cache: this.cache
			});
			debug("Got `Readable` instance for URI");
			this.cache = rs;
			const buf = await (0, agent_base_1.toBuffer)(rs);
			debug("Read %o byte PAC file from URI", buf.length);
			return buf.toString("utf8");
		}
		/**
		* Called when the node-core HTTP client library is creating a new HTTP request.
		*/
		async connect(req, opts) {
			const { secureEndpoint } = opts;
			const isWebSocket = req.getHeader("upgrade") === "websocket";
			const resolver = await this.getResolver();
			const protocol = secureEndpoint ? "https:" : "http:";
			const host = opts.host && net.isIPv6(opts.host) ? `[${opts.host}]` : opts.host;
			const defaultPort = secureEndpoint ? 443 : 80;
			const url = Object.assign(new url_1$1.URL(req.path, `${protocol}//${host}`), defaultPort ? void 0 : { port: opts.port });
			debug("url: %s", url);
			let result = await resolver(url);
			if (!result) result = "DIRECT";
			const proxies = String(result).trim().split(/\s*;\s*/g).filter(Boolean);
			if (this.opts.fallbackToDirect && !proxies.includes("DIRECT")) proxies.push("DIRECT");
			for (const proxy of proxies) {
				let agent = null;
				let socket = null;
				const [type, target] = proxy.split(/\s+/);
				debug("Attempting to use proxy: %o", proxy);
				if (type === "DIRECT") if (secureEndpoint) socket = tls.connect(setServernameFromNonIpHost(opts));
				else socket = net.connect(opts);
				else if (type === "SOCKS" || type === "SOCKS5") {
					const { SocksProxyAgent } = await Promise.resolve().then(() => __importStar(require_dist$3()));
					agent = new SocksProxyAgent(`socks://${target}`, this.opts);
				} else if (type === "SOCKS4") {
					const { SocksProxyAgent } = await Promise.resolve().then(() => __importStar(require_dist$3()));
					agent = new SocksProxyAgent(`socks4a://${target}`, this.opts);
				} else if (type === "PROXY" || type === "HTTP" || type === "HTTPS") {
					const proxyURL = `${type === "HTTPS" ? "https" : "http"}://${target}`;
					if (secureEndpoint || isWebSocket) {
						const { HttpsProxyAgent } = await Promise.resolve().then(() => __importStar(require_dist$6()));
						agent = new HttpsProxyAgent(proxyURL, this.opts);
					} else {
						const { HttpProxyAgent } = await Promise.resolve().then(() => __importStar(require_dist$5()));
						agent = new HttpProxyAgent(proxyURL, this.opts);
					}
				}
				try {
					if (socket) {
						await (0, events_1.once)(socket, "connect");
						req.emit("proxy", {
							proxy,
							socket
						});
						return socket;
					}
					if (agent) {
						const s = await agent.connect(req, opts);
						if (!(s instanceof net.Socket)) throw new Error("Expected a `net.Socket` to be returned from agent");
						req.emit("proxy", {
							proxy,
							socket: s
						});
						return s;
					}
					throw new Error(`Could not determine proxy type for: ${proxy}`);
				} catch (err) {
					debug("Got error for proxy %o: %o", proxy, err);
					req.emit("proxy", {
						proxy,
						error: err
					});
				}
			}
			throw new Error(`Failed to establish a socket connection to proxies: ${JSON.stringify(proxies)}`);
		}
	};
	PacProxyAgent.protocols = [
		"pac+data",
		"pac+file",
		"pac+ftp",
		"pac+http",
		"pac+https"
	];
	exports.PacProxyAgent = PacProxyAgent;
}));
(/* @__PURE__ */ __commonJSMin(((exports) => {
	var __createBinding = exports && exports.__createBinding || (Object.create ? (function(o, m, k, k2) {
		if (k2 === void 0) k2 = k;
		var desc = Object.getOwnPropertyDescriptor(m, k);
		if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) desc = {
			enumerable: true,
			get: function() {
				return m[k];
			}
		};
		Object.defineProperty(o, k2, desc);
	}) : (function(o, m, k, k2) {
		if (k2 === void 0) k2 = k;
		o[k2] = m[k];
	}));
	var __setModuleDefault = exports && exports.__setModuleDefault || (Object.create ? (function(o, v) {
		Object.defineProperty(o, "default", {
			enumerable: true,
			value: v
		});
	}) : function(o, v) {
		o["default"] = v;
	});
	var __importStar = exports && exports.__importStar || function(mod) {
		if (mod && mod.__esModule) return mod;
		var result = {};
		if (mod != null) {
			for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
		}
		__setModuleDefault(result, mod);
		return result;
	};
	var __importDefault = exports && exports.__importDefault || function(mod) {
		return mod && mod.__esModule ? mod : { "default": mod };
	};
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.ProxyAgent = exports.proxies = void 0;
	const http = __importStar(__require("http"));
	const https = __importStar(__require("https"));
	const url_1 = __require("url");
	const lru_cache_1 = __importDefault(require_lru_cache());
	const agent_base_1 = require_dist$4();
	const debug_1 = __importDefault(require_src());
	const proxy_from_env_1 = require_proxy_from_env();
	const debug = (0, debug_1.default)("proxy-agent");
	/**
	* Shorthands for built-in supported types.
	* Lazily loaded since some of these imports can be quite expensive
	* (in particular, pac-proxy-agent).
	*/
	const wellKnownAgents = {
		http: async () => (await Promise.resolve().then(() => __importStar(require_dist$5()))).HttpProxyAgent,
		https: async () => (await Promise.resolve().then(() => __importStar(require_dist$6()))).HttpsProxyAgent,
		socks: async () => (await Promise.resolve().then(() => __importStar(require_dist$3()))).SocksProxyAgent,
		pac: async () => (await Promise.resolve().then(() => __importStar(require_dist$1()))).PacProxyAgent
	};
	/**
	* Supported proxy types.
	*/
	exports.proxies = {
		http: [wellKnownAgents.http, wellKnownAgents.https],
		https: [wellKnownAgents.http, wellKnownAgents.https],
		socks: [wellKnownAgents.socks, wellKnownAgents.socks],
		socks4: [wellKnownAgents.socks, wellKnownAgents.socks],
		socks4a: [wellKnownAgents.socks, wellKnownAgents.socks],
		socks5: [wellKnownAgents.socks, wellKnownAgents.socks],
		socks5h: [wellKnownAgents.socks, wellKnownAgents.socks],
		"pac+data": [wellKnownAgents.pac, wellKnownAgents.pac],
		"pac+file": [wellKnownAgents.pac, wellKnownAgents.pac],
		"pac+ftp": [wellKnownAgents.pac, wellKnownAgents.pac],
		"pac+http": [wellKnownAgents.pac, wellKnownAgents.pac],
		"pac+https": [wellKnownAgents.pac, wellKnownAgents.pac]
	};
	function isValidProtocol(v) {
		return Object.keys(exports.proxies).includes(v);
	}
	/**
	* Uses the appropriate `Agent` subclass based off of the "proxy"
	* environment variables that are currently set.
	*
	* An LRU cache is used, to prevent unnecessary creation of proxy
	* `http.Agent` instances.
	*/
	var ProxyAgent = class extends agent_base_1.Agent {
		constructor(opts) {
			super(opts);
			/**
			* Cache for `Agent` instances.
			*/
			this.cache = new lru_cache_1.default({
				max: 20,
				dispose: (agent) => agent.destroy()
			});
			debug("Creating new ProxyAgent instance: %o", opts);
			this.connectOpts = opts;
			this.httpAgent = opts?.httpAgent || new http.Agent(opts);
			this.httpsAgent = opts?.httpsAgent || new https.Agent(opts);
			this.getProxyForUrl = opts?.getProxyForUrl || proxy_from_env_1.getProxyForUrl;
		}
		async connect(req, opts) {
			const { secureEndpoint } = opts;
			const isWebSocket = req.getHeader("upgrade") === "websocket";
			const protocol = secureEndpoint ? isWebSocket ? "wss:" : "https:" : isWebSocket ? "ws:" : "http:";
			const host = req.getHeader("host");
			const url = new url_1.URL(req.path, `${protocol}//${host}`).href;
			const proxy = await this.getProxyForUrl(url, req);
			if (!proxy) {
				debug("Proxy not enabled for URL: %o", url);
				return secureEndpoint ? this.httpsAgent : this.httpAgent;
			}
			debug("Request URL: %o", url);
			debug("Proxy URL: %o", proxy);
			const cacheKey = `${protocol}+${proxy}`;
			let agent = this.cache.get(cacheKey);
			if (!agent) {
				const proxyProto = new url_1.URL(proxy).protocol.replace(":", "");
				if (!isValidProtocol(proxyProto)) throw new Error(`Unsupported protocol for proxy URL: ${proxy}`);
				agent = new (await (exports.proxies[proxyProto][secureEndpoint || isWebSocket ? 1 : 0]()))(proxy, this.connectOpts);
				this.cache.set(cacheKey, agent);
			} else debug("Cache hit for proxy URL: %o", proxy);
			return agent;
		}
		destroy() {
			for (const agent of this.cache.values()) agent.destroy();
			super.destroy();
		}
	};
	exports.ProxyAgent = ProxyAgent;
})))();
//#endregion
//#region competitive/runDaily.ts
const ROOT = process.cwd();
path.join(ROOT, ".data", "competitive-config.json");
/** Vercel 仅 /tmp 可写；缓存文件放 /tmp，配置仍读部署目录 .data */
const COMPETITIVE_CACHE_FILE = process.env.VERCEL ? path.join("/tmp", "reddit-analysis", "competitive-cache.json") : path.join(ROOT, ".data", "competitive-cache.json");
async function readJsonFile(file) {
	try {
		const raw = await fs$1.readFile(file, "utf-8");
		return JSON.parse(raw);
	} catch {
		return null;
	}
}
async function readCompetitiveCache() {
	try {
		const fromDb = getCompetitiveCacheKv();
		if (fromDb && fromDb.version === 1) return fromDb;
	} catch {}
	const c = await readJsonFile(COMPETITIVE_CACHE_FILE);
	if (!c || c.version !== 1) return null;
	try {
		setCompetitiveCacheKv(c);
	} catch (e) {
		console.warn("[competitive] sqlite backfill skipped:", e);
	}
	return c;
}
//#endregion
//#region agent/tools/get_competitive_data.ts
var get_competitive_data_exports = /* @__PURE__ */ __exportAll({ default: () => get_competitive_data_default });
var get_competitive_data_default = defineTool({
	description: "获取 Instagram 竞品监控的最新缓存数据，包括各竞品账号的帖子、互动数据和内容分类。",
	inputSchema: object({}),
	async execute() {
		const cache = await readCompetitiveCache();
		if (!cache?.instagram) return {
			available: false,
			message: "暂无竞品数据缓存"
		};
		const ig = cache.instagram;
		const handles = ig.handles || [];
		const summary = handles.map((h) => {
			const posts = ig.postsByUsername?.[h.toLowerCase()] || [];
			return {
				handle: h,
				postCount: posts.length,
				recentPosts: posts.slice(0, 3).map((p) => ({
					caption: (p.caption || "").slice(0, 100),
					likes: p.likesCount,
					comments: p.commentsCount,
					type: p.type,
					timestamp: p.timestamp
				}))
			};
		});
		return {
			available: true,
			fetchedAt: ig.fetchedAt,
			handles,
			summary
		};
	}
});
//#endregion
//#region lib/redditLinkConvert.ts
/**
* Reddit JSON 链接转换（纯逻辑，供 server / api 共用）
*
* 说明：Reddit 对数据中心 IP（含 Vercel）常返回 403 HTML；old.reddit.com + 合规 UA 可缓解，但不能保证云端可用。
*/
function mapUtmStrip(url) {
	url.searchParams.delete("utm_source");
	url.searchParams.delete("utm_medium");
	url.searchParams.delete("utm_campaign");
}
function buildRedditFetchHeaders(jsonUrl) {
	return {
		"User-Agent": `reddit-analysis/1.0 (script; contact: ${typeof process !== "undefined" && process.env?.REDDIT_UA_CONTACT?.trim() ? String(process.env.REDDIT_UA_CONTACT).trim() : "https://github.com/cocoxu0811/reddit-analysis"})`,
		Accept: "application/json, text/plain, */*",
		"Accept-Language": "en-US,en;q=0.9",
		Referer: `${new URL(jsonUrl).origin}/`,
		"Cache-Control": "no-cache"
	};
}
function looksLikeHtml(body) {
	const s = body.slice(0, 200).toLowerCase();
	return s.includes("<!doctype") || s.includes("<html") || s.includes("<body");
}
function formatRedditError(status, body) {
	if (status === 403 || looksLikeHtml(body)) return [
		"Reddit 返回 403 或 HTML 页面：匿名 .json 接口常会拦截云函数/数据中心出口 IP（如 Vercel），与 User-Agent 无关。",
		"可行做法：在本地执行 npm run dev 后再做链接转换；或在环境变量 REDDIT_UA_CONTACT 中填写项目/联系方式（仍不保证云端可用）。",
		"Anonymous Reddit JSON often blocks datacenter IPs; try locally or a residential network."
	].join(" ");
	return `Reddit HTTP ${status}: ${body.length > 280 ? `${body.slice(0, 280)}…` : body}`;
}
async function fetchRedditJsonOnce(jsonUrl) {
	return fetch(jsonUrl, {
		headers: buildRedditFetchHeaders(jsonUrl),
		redirect: "follow"
	});
}
/**
* 将任意 reddit.com 的完整 URL（path/query 已含 .json 等）仅替换 host，供版块监控 /new、帖内 thread 等共用。
*/
function rewriteRedditHostname(fullUrl, hostname) {
	const url = new URL(fullUrl);
	if (!url.hostname.toLowerCase().includes("reddit.com")) throw new Error("Only reddit.com URLs are supported");
	mapUtmStrip(url);
	url.hostname = hostname;
	return url.toString();
}
/**
* 拉取 Reddit 匿名 JSON API（与「链接转 JSON」相同策略：优先 old，403 再试 www）。
* 用于 `r/sub/new.json`、帖详情 `…permalink….json` 等已拼好的 URL。
*/
async function fetchRedditApiJson(fullUrl) {
	let jsonUrl = rewriteRedditHostname(fullUrl, "old.reddit.com");
	let response = await fetchRedditJsonOnce(jsonUrl);
	if (response.status === 403) {
		jsonUrl = rewriteRedditHostname(fullUrl, "www.reddit.com");
		response = await fetchRedditJsonOnce(jsonUrl);
	}
	const text = await response.text();
	if (!response.ok) throw new Error(formatRedditError(response.status, text));
	try {
		return JSON.parse(text);
	} catch {
		throw new Error(formatRedditError(response.status || 502, text));
	}
}
//#endregion
//#region lib/redditMonitor.ts
/**
* Subreddit 新帖拉取 + 评论摘录 + 情绪/类别分类（启发式 + 可选 AI）
*/
/** 与 Instagram 竞品共用 APIFY_TOKEN；默认 trudax/reddit-scraper-lite（按 Apify 用量计费） */
const DEFAULT_APIFY_REDDIT_ACTOR = "trudax/reddit-scraper-lite";
/** 配置 APIFY_TOKEN 且未设 REDDIT_MONITOR_DIRECT=true 时，版块监控走 Apify，避免 Vercel 直连 Reddit 403 */
function useApifyMonitor() {
	return Boolean(process.env.APIFY_TOKEN?.trim()) && process.env.REDDIT_MONITOR_DIRECT !== "true";
}
const EMOTION_LABELS = [
	"疑惑",
	"生气",
	"兴奋",
	"失望",
	"讽刺",
	"中性"
];
const CATEGORY_LABELS = [
	"推荐",
	"吐槽",
	"讨论",
	"求助",
	"展示"
];
function normalizeSubreddit(raw) {
	const s = raw.trim().replace(/^r\//i, "").replace(/^\//, "");
	if (!/^[A-Za-z0-9_]+$/.test(s)) throw new Error("Invalid subreddit name");
	return s;
}
/** 与 Dataset 中帖 id、评论 parentId 对齐（统一为 t3_xxx） */
function normalizeT3Id(id) {
	const s = String(id ?? "").trim();
	if (!s) return "";
	if (s.startsWith("t3_")) return s;
	return `t3_${s.replace(/^t3_?/i, "")}`;
}
const APIFY_COMMENTS_PER_POST_CAP = 40;
function buildCommentMapFromApifyItems(items) {
	const map = /* @__PURE__ */ new Map();
	for (const row of items) {
		if (String(row.dataType) !== "comment") continue;
		const parentId = normalizeT3Id(row.parentId ?? row.parent_id);
		if (!parentId.startsWith("t3_")) continue;
		const body = String(row.body ?? "").trim();
		if (!body || body === "[deleted]" || body === "[removed]") continue;
		const up = row.upVotes;
		const sc = row.score;
		const score = typeof up === "number" ? up : typeof sc === "number" ? sc : Number(up ?? sc) || 0;
		const mc = {
			id: String(row.id ?? row.parsedId ?? ""),
			body: body.slice(0, 4e3),
			author: String(row.username ?? row.author ?? "[deleted]"),
			score
		};
		const list = map.get(parentId) ?? [];
		if (list.length >= APIFY_COMMENTS_PER_POST_CAP) continue;
		list.push(mc);
		map.set(parentId, list);
	}
	return map;
}
async function runRedditApifyDatasetForSub(sub, maxPostCount) {
	const token = process.env.APIFY_TOKEN?.trim();
	if (!token) throw new Error("缺少 APIFY_TOKEN：版块监控已改为通过 Apify 拉取 Reddit，请与 Instagram 竞品共用同一 Token。");
	const actorId = process.env.APIFY_REDDIT_ACTOR?.trim() || DEFAULT_APIFY_REDDIT_ACTOR;
	const client = new ApifyClient({ token });
	const input = {
		startUrls: [{ url: `https://www.reddit.com/r/${encodeURIComponent(sub)}/new/` }],
		maxPostCount,
		maxComments: APIFY_COMMENTS_PER_POST_CAP
	};
	const run = await client.actor(actorId).call(input);
	if (!run.defaultDatasetId) return {
		items: [],
		commentsByPostId: /* @__PURE__ */ new Map()
	};
	const { items } = await client.dataset(run.defaultDatasetId).listItems({ limit: 1e4 });
	const list = items ?? [];
	return {
		items: list,
		commentsByPostId: buildCommentMapFromApifyItems(list)
	};
}
function apifyPostBelongsToSub(raw, sub) {
	const want = sub.toLowerCase();
	const parsed = String(raw.parsedCommunityName ?? "").toLowerCase();
	if (parsed && parsed === want) return true;
	const m = String(raw.communityName ?? "").match(/^r\/([^/]+)/i);
	return m ? m[1].toLowerCase() === want : false;
}
async function fetchRedditJson(url) {
	return fetchRedditApiJson(url);
}
function walkComments(children, acc, max) {
	if (!children || acc.length >= max) return;
	for (const child of children) {
		if (acc.length >= max) return;
		if (child?.kind === "t1" && child.data) {
			const d = child.data;
			const body = (d.body || "").trim();
			if (body && body !== "[deleted]" && body !== "[removed]") acc.push({
				id: d.name || d.id || "",
				body: body.slice(0, 4e3),
				author: d.author || "[deleted]",
				score: typeof d.ups === "number" ? d.ups : 0
			});
			if (d.replies?.data?.children?.length) walkComments(d.replies.data.children, acc, max);
		}
	}
}
const INTENT_MAX = 5;
const INTENT_MIN_CHARS = 8;
const INTENT_SNIP = 160;
function splitIntentChunks(text) {
	const t = text.replace(/\r/g, "").replace(/\s+/g, " ").trim();
	if (!t) return [];
	const parts = t.split(/(?:[。！？]+|[.!?]+\s+|\n+)/g);
	const out = [];
	for (const p of parts) {
		const s = p.trim();
		if (s.length >= INTENT_MIN_CHARS) out.push(s.slice(0, 420));
	}
	if (out.length === 0 && t.length >= INTENT_MIN_CHARS) out.push(t.slice(0, 420));
	return out;
}
function normalizeIntentMarksFromAi(raw) {
	const clamp = (arr) => {
		if (!Array.isArray(arr)) return [];
		return arr.filter((x) => typeof x === "string").map((s) => s.trim().slice(0, INTENT_SNIP)).filter((s) => s.length > 0).slice(0, INTENT_MAX);
	};
	return {
		likes: clamp(raw.likes),
		dislikes: clamp(raw.dislikes),
		requests: clamp(raw.requests),
		complaints: clamp(raw.complaints)
	};
}
/** 关键词启发式（未开启 Gemini 或 AI 调用失败时使用） */
function extractIntentMarks(title, body, comments) {
	const chunks = [];
	if (title?.trim()) chunks.push(...splitIntentChunks(title));
	if (body?.trim()) chunks.push(...splitIntentChunks(body));
	for (const c of comments) if (c.body?.trim()) chunks.push(...splitIntentChunks(c.body));
	const RE_COMPLAINT = /抱怨|吐槽|受不了|气死|离谱|坑爹|骗人|垃圾|难用|太慢|卡死|卡爆|bug|崩了|失效|黑店|踩雷|别信|scam|sucks|terrible|worst|awful|broken|disappoint|fed up|garbage|rip-?off|frustrated/i;
	const RE_REQUEST = /求|请问|能不能|可不可以|希望|有没有|求助|建议|想要|需要|哪位大神|How (do|can|should|would)|looking for|can anyone|please (tell|help|share)|advice on|what('s| is) the best|anyone know|recommend/i;
	const RE_LIKE = /喜欢|好用|强推|安利|赞|满意|太棒|真香|值得|爱了|推荐它|love it|great|awesome|highly recommend|works well|impressed|game.?changer|worth (it|every)/i;
	const RE_DISLIKE = /不喜欢|讨厌|失望|鸡肋|不好用|别买|避雷|千万别|avoid|don't like|not worth|waste of|regret (buying|it)|worst purchase|overrated/i;
	const seen = /* @__PURE__ */ new Set();
	const push = (arr, s) => {
		const t = s.trim().slice(0, INTENT_SNIP);
		const key = t.toLowerCase().slice(0, 96);
		if (t.length < INTENT_MIN_CHARS || seen.has(key)) return;
		seen.add(key);
		arr.push(t);
	};
	const likes = [];
	const dislikes = [];
	const requests = [];
	const complaints = [];
	for (const sent of chunks) {
		if (RE_COMPLAINT.test(sent) && complaints.length < INTENT_MAX) push(complaints, sent);
		if (RE_REQUEST.test(sent) && requests.length < INTENT_MAX) push(requests, sent);
		if (RE_DISLIKE.test(sent) && dislikes.length < INTENT_MAX) push(dislikes, sent);
		if (RE_LIKE.test(sent) && likes.length < INTENT_MAX) push(likes, sent);
	}
	return {
		likes,
		dislikes,
		requests,
		complaints
	};
}
async function buildMonitoredPostFromT3(p, sub, options) {
	const permalink = p.permalink;
	if (!permalink) return null;
	const delay = options.delayMs ?? 180;
	const comments = [];
	try {
		const thread = await fetchRedditJson(`https://www.reddit.com${permalink}.json?sort=top&depth=2&limit=40&raw_json=1`);
		if (Array.isArray(thread) && thread[1]?.data?.children) walkComments(thread[1].data.children, comments, 35);
	} catch {}
	const title = (p.title || "").slice(0, 500);
	const body = (p.selftext || "").slice(0, 8e3);
	let emotion;
	let category;
	let classificationSource = "heuristic";
	const h = classifyHeuristic(title, body, comments);
	emotion = h.emotion;
	category = h.category;
	let intentMarks = extractIntentMarks(title, body, comments);
	if (options.useGemini) {
		const provider = options.aiProvider ?? getDefaultAiProvider();
		const g = await classifyAi(title, body, comments, provider);
		if (g) {
			emotion = g.emotion;
			category = g.category;
			classificationSource = provider;
			intentMarks = g.intentMarks;
		}
	}
	const postUrl = p.permalink ? `https://www.reddit.com${p.permalink}` : p.url ? String(p.url) : "";
	const result = {
		id: p.name || p.id || "",
		title,
		body,
		url: postUrl,
		author: p.author || "",
		createdAt: p.created_utc ? (/* @__PURE__ */ new Date(p.created_utc * 1e3)).toISOString() : "",
		subreddit: p.subreddit_name_prefixed || `r/${sub}`,
		flair: p.link_flair_text || null,
		numComments: typeof p.num_comments === "number" ? p.num_comments : comments.length,
		score: typeof p.ups === "number" ? p.ups : 0,
		comments,
		emotion,
		category,
		classificationSource,
		intentMarks
	};
	await new Promise((r) => setTimeout(r, delay));
	return result;
}
/** 分页 /new，收集本地日 [startMs,endMs] 内的帖（最多 maxPosts 条）；Apify 模式下为一批帖子再按时间筛 */
async function collectT3ForDayRange(sub, startMs, endMs, maxPosts) {
	if (useApifyMonitor()) {
		const { items, commentsByPostId } = await runRedditApifyDatasetForSub(sub, Math.min(200, maxPosts * 10));
		const collected = [];
		for (const row of items) {
			if (!row || typeof row !== "object") continue;
			const o = row;
			if (String(o.dataType) !== "post") continue;
			if (!apifyPostBelongsToSub(o, sub)) continue;
			const t = new Date(String(o.createdAt ?? 0)).getTime();
			if (t >= startMs && t <= endMs) {
				const pid = normalizeT3Id(o.id ?? o.parsedId);
				const comments = (commentsByPostId.get(pid) ?? []).slice(0, APIFY_COMMENTS_PER_POST_CAP);
				collected.push({
					post: o,
					comments
				});
				if (collected.length >= maxPosts) return collected;
			}
		}
		return collected;
	}
	const MAX_PAGES = 22;
	const collected = [];
	let after;
	for (let page = 0; page < MAX_PAGES; page++) {
		let url = `https://www.reddit.com/r/${sub}/new.json?limit=100&raw_json=1`;
		if (after) url += `&after=${encodeURIComponent(after)}`;
		const listing = await fetchRedditJson(url);
		const children = listing?.data?.children || [];
		if (children.length === 0) break;
		let oldestInPage = Infinity;
		for (const ch of children) {
			if (ch.kind !== "t3" || !ch.data) continue;
			const p = ch.data;
			const t = (p.created_utc || 0) * 1e3;
			oldestInPage = Math.min(oldestInPage, t);
			if (t >= startMs && t <= endMs) {
				collected.push(p);
				if (collected.length >= maxPosts) return collected;
			}
		}
		if (oldestInPage < startMs) break;
		after = listing?.data?.after;
		if (!after) break;
		await new Promise((r) => setTimeout(r, 150));
	}
	return collected;
}
function classifyHeuristic(title, body, comments) {
	const text = `${title}\n${body}\n${comments.map((c) => c.body).join("\n")}`.toLowerCase();
	const t = `${title}\n${body}`;
	const emotionScore = Object.fromEntries(EMOTION_LABELS.map((e) => [e, 0]));
	const catScore = Object.fromEntries(CATEGORY_LABELS.map((c) => [c, 0]));
	emotionScore["中性"] = 1;
	catScore["讨论"] = 1;
	if (/[?？]/.test(t) || /\b(how|why|what|when|where|which|求助|请问|不懂|疑惑|怎么|如何)\b/i.test(text)) emotionScore["疑惑"] += 4;
	if (/\b(fuck|shit|hate|scam|garbage|worst|terrible|awful|angry|ridiculous)\b/i.test(text) || /(气死|离谱|垃圾|骗人|恶心|受不了|坑爹|愤怒)/.test(text)) emotionScore["生气"] += 5;
	if (/!{2,}/.test(t) || text.includes("!!!")) emotionScore["生气"] += 2;
	if (/\b(love|amazing|awesome|finally|great|perfect|best)\b/i.test(text) || /(太棒|爱了|强推|真香|爽)/.test(text)) emotionScore["兴奋"] += 3;
	if (/\b(disappoint|unfortunately|sadly|regret)\b/i.test(text) || /(失望|遗憾|后悔|凉了)/.test(text)) emotionScore["失望"] += 3;
	if (/\/s\b|lol sure|obviously|呵呵|笑死|懂的都懂/i.test(text)) emotionScore["讽刺"] += 3;
	if (/\b(help|advice|suggestions|recommend me|what should)\b/i.test(text) || /(求助|帮帮我|怎么办|请教)/.test(text)) catScore["求助"] += 4;
	if (/\b(recommend|review|best \w+|top \d|must try)\b/i.test(text) || /(推荐|安利|种草|好评|值得买)/.test(text)) catScore["推荐"] += 3;
	if (/\b(rant|complain|sucks|hate this)\b/i.test(text) || /(吐槽|踩雷|别买|难用)/.test(text)) catScore["吐槽"] += 4;
	if (/\b(showcase|my build|i made|built a|here is my)\b/i.test(text) || /(晒|成果|我做的|开箱)/.test(text)) catScore["展示"] += 3;
	if (/\b(discussion|thoughts|opinion|debate|agree|disagree)\b/i.test(text) || /(讨论|大家怎么看|理性讨论)/.test(text)) catScore["讨论"] += 3;
	const pickMax = (m, labels) => {
		let best = labels[0];
		let v = m[best] ?? 0;
		for (const k of labels) if ((m[k] ?? 0) > v) {
			v = m[k];
			best = k;
		}
		return best;
	};
	return {
		emotion: pickMax(emotionScore, EMOTION_LABELS),
		category: pickMax(catScore, CATEGORY_LABELS)
	};
}
async function classifyAi(title, body, comments, provider) {
	const sample = comments.slice(0, 12).map((c) => c.body.slice(0, 500)).join("\n---\n");
	const prompt = `你是 Reddit 内容分析助手。根据帖子标题、正文和评论摘录，输出 JSON。

1) 情绪 emotion：必须且只能从以下选一：${EMOTION_LABELS.join("、")}
2) 类别 category：必须且只能从以下选一：${CATEGORY_LABELS.join("、")}
3) 用户倾向（基于全文理解，不要用固定关键词表；中英文帖均可）：
   - likes：用户明确表达满意、推荐、喜欢、称赞的要点（短句，尽量贴近原文）
   - dislikes：明确否定、不推荐、失望、认为不值得的要点
   - requests：求助、求建议、询问、希望实现的功能或信息需求
   - complaints：抱怨、吐槽、对问题/体验的不满
   每个数组最多 5 条；无相关内容则该数组为空 []。不要编造帖中未体现的内容。

标题：${title.slice(0, 500)}
正文：${(body || "").slice(0, 3500)}
评论摘录：${sample.slice(0, 4500)}`;
	try {
		const parsed = await generateJsonObject(prompt, {
			type: "object",
			properties: {
				emotion: { type: "string" },
				category: { type: "string" },
				likes: {
					type: "array",
					items: { type: "string" }
				},
				dislikes: {
					type: "array",
					items: { type: "string" }
				},
				requests: {
					type: "array",
					items: { type: "string" }
				},
				complaints: {
					type: "array",
					items: { type: "string" }
				}
			},
			required: [
				"emotion",
				"category",
				"likes",
				"dislikes",
				"requests",
				"complaints"
			]
		}, provider, { geminiModel: "gemini-2.0-flash" });
		const emotion = EMOTION_LABELS.includes(parsed.emotion) ? parsed.emotion : null;
		const category = CATEGORY_LABELS.includes(parsed.category) ? parsed.category : null;
		if (!emotion || !category) return null;
		return {
			emotion,
			category,
			intentMarks: normalizeIntentMarksFromAi(parsed)
		};
	} catch (e) {
		console.warn(`${provider} classification failed:`, e);
	}
	return null;
}
/** Apify Dataset 中 dataType=post 的条目 → MonitoredPost（评论来自同 Dataset 中 dataType=comment、parentId=t3_*） */
async function apifyRowToMonitoredPost(raw, sub, options, preloadedComments) {
	if (String(raw.dataType) !== "post") return null;
	if (!apifyPostBelongsToSub(raw, sub)) return null;
	const title = String(raw.title ?? "").slice(0, 500);
	const body = String(raw.body ?? "").slice(0, 8e3);
	const comments = preloadedComments ? preloadedComments.slice(0, APIFY_COMMENTS_PER_POST_CAP) : [];
	let emotion;
	let category;
	let classificationSource = "heuristic";
	const h = classifyHeuristic(title, body, comments);
	emotion = h.emotion;
	category = h.category;
	let intentMarks = extractIntentMarks(title, body, comments);
	if (options.useGemini) {
		const provider = options.aiProvider ?? getDefaultAiProvider();
		const g = await classifyAi(title, body, comments, provider);
		if (g) {
			emotion = g.emotion;
			category = g.category;
			classificationSource = provider;
			intentMarks = g.intentMarks;
		}
	}
	let createdAt = "";
	try {
		const d = new Date(String(raw.createdAt ?? ""));
		createdAt = Number.isNaN(d.getTime()) ? (/* @__PURE__ */ new Date()).toISOString() : d.toISOString();
	} catch {
		createdAt = (/* @__PURE__ */ new Date()).toISOString();
	}
	const flairRaw = raw.linkFlair ?? raw.authorFlair ?? raw.link_flair_text;
	const delay = options.delayMs ?? 180;
	await new Promise((r) => setTimeout(r, delay));
	return {
		id: String(raw.id ?? raw.parsedId ?? ""),
		title,
		body,
		url: String(raw.url ?? ""),
		author: String(raw.username ?? ""),
		createdAt,
		subreddit: String(raw.communityName ?? `r/${sub}`),
		flair: flairRaw != null && String(flairRaw).trim() ? String(flairRaw) : null,
		numComments: Math.max(typeof raw.numberOfComments === "number" ? raw.numberOfComments : 0, comments.length),
		score: typeof raw.upVotes === "number" ? raw.upVotes : 0,
		comments,
		emotion,
		category,
		classificationSource,
		intentMarks
	};
}
async function scanSubreddit(rawSub, limit, options = {}) {
	const sub = normalizeSubreddit(rawSub);
	const lim = Math.min(Math.max(limit || 10, 1), 25);
	if (useApifyMonitor()) {
		const { items, commentsByPostId } = await runRedditApifyDatasetForSub(sub, lim);
		const posts = [];
		for (const row of items) {
			if (!row || typeof row !== "object") continue;
			const ro = row;
			if (String(ro.dataType) !== "post") continue;
			const pid = normalizeT3Id(ro.id ?? ro.parsedId);
			const built = await apifyRowToMonitoredPost(ro, sub, options, (commentsByPostId.get(pid) ?? []).slice(0, APIFY_COMMENTS_PER_POST_CAP));
			if (built) posts.push(built);
		}
		return {
			subreddit: sub,
			fetchedAt: (/* @__PURE__ */ new Date()).toISOString(),
			posts
		};
	}
	const children = (await fetchRedditJson(`https://www.reddit.com/r/${sub}/new.json?limit=${lim}&raw_json=1`))?.data?.children || [];
	const posts = [];
	for (const ch of children) {
		if (ch.kind !== "t3" || !ch.data) continue;
		const built = await buildMonitoredPostFromT3(ch.data, sub, options);
		if (built) posts.push(built);
	}
	return {
		subreddit: sub,
		fetchedAt: (/* @__PURE__ */ new Date()).toISOString(),
		posts
	};
}
function tryNormalizeSub(raw) {
	const t = raw.trim();
	if (!t) return null;
	try {
		return normalizeSubreddit(t);
	} catch {
		return null;
	}
}
/** 依次扫描多个版块，合并帖子并按时间倒序 */
async function scanMultipleSubreddits(rawSubs, limit, options = {}) {
	const seen = /* @__PURE__ */ new Set();
	const list = [];
	for (const raw of rawSubs) {
		const n = tryNormalizeSub(raw);
		if (n && !seen.has(n.toLowerCase())) {
			seen.add(n.toLowerCase());
			list.push(n);
		}
	}
	if (list.length === 0) throw new Error("No valid subreddit names");
	const allPosts = [];
	const between = options.delayBetweenSubsMs ?? 400;
	const lim = Math.min(Math.max(limit || 10, 1), 50);
	if (options.dayRange) {
		const { startMs, endMs } = options.dayRange;
		if (endMs < startMs) throw new Error("Invalid day range");
		for (let i = 0; i < list.length; i++) {
			const sub = list[i];
			const rawPosts = await collectT3ForDayRange(sub, startMs, endMs, lim);
			for (const p of rawPosts) {
				const built = useApifyMonitor() ? await apifyRowToMonitoredPost(p.post, sub, options, p.comments) : await buildMonitoredPostFromT3(p, sub, options);
				if (built) allPosts.push(built);
			}
			if (i < list.length - 1) await new Promise((r) => setTimeout(r, between));
		}
		allPosts.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
		return {
			subreddits: list,
			fetchedAt: (/* @__PURE__ */ new Date()).toISOString(),
			posts: allPosts,
			dayRange: options.dayRange
		};
	}
	for (let i = 0; i < list.length; i++) {
		const sub = list[i];
		const { posts } = await scanSubreddit(sub, lim, options);
		allPosts.push(...posts);
		if (i < list.length - 1) await new Promise((r) => setTimeout(r, between));
	}
	allPosts.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
	return {
		subreddits: list,
		fetchedAt: (/* @__PURE__ */ new Date()).toISOString(),
		posts: allPosts
	};
}
//#endregion
//#region agent/tools/scan_subreddit.ts
var scan_subreddit_exports = /* @__PURE__ */ __exportAll({ default: () => scan_subreddit_default });
function summarizePost(post) {
	return {
		title: post.title,
		subreddit: post.subreddit,
		author: post.author,
		score: post.score,
		numComments: post.numComments,
		emotion: post.emotion,
		category: post.category,
		body: post.body.slice(0, 300) + (post.body.length > 300 ? "..." : ""),
		intentMarks: post.intentMarks,
		topComments: post.comments.slice(0, 3).map((c) => ({
			body: c.body.slice(0, 200),
			score: c.score
		}))
	};
}
var scan_subreddit_default = defineTool({
	description: "扫描一个或多个 subreddit 的最新帖子，获取帖子内容、评论、情绪分类和用户意图标注。用于了解社区最新讨论动态。",
	inputSchema: object({
		subreddits: array(string()).min(1).describe("要扫描的 subreddit 名称列表，例如 ['startups', 'SaaS']"),
		limit: number().min(1).max(25).default(10).describe("每个 subreddit 获取的帖子数量"),
		useAi: boolean().default(true).describe("是否使用 AI 标注情绪和分类")
	}),
	async execute({ subreddits, limit, useAi }) {
		if (subreddits.length === 1) {
			const result = await scanSubreddit(subreddits[0], limit, {
				useGemini: useAi,
				aiProvider: "gemini"
			});
			return {
				subreddits: [result.subreddit],
				fetchedAt: result.fetchedAt,
				postCount: result.posts.length,
				posts: result.posts.map(summarizePost)
			};
		}
		const result = await scanMultipleSubreddits(subreddits, limit, {
			useGemini: useAi,
			aiProvider: "gemini"
		});
		return {
			subreddits: result.subreddits,
			fetchedAt: result.fetchedAt,
			postCount: result.posts.length,
			posts: result.posts.map(summarizePost)
		};
	}
});
//#endregion
//#region lib/redditSearch.ts
const USER_AGENT = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) reddit-analysis-tool/1.0";
/**
* 判断帖子是否为低质量/不适合作为范文的内容。
* 排除：mod 公告、AMA、纯链接帖、投票帖、周报等。
*/
function isLowQualityPost(post) {
	const t = post.title.toLowerCase();
	const b = post.selftext.toLowerCase();
	if (t.startsWith("[mod") || t.startsWith("[meta") || t.includes("weekly thread") || t.includes("monthly thread") || t.includes("daily discussion") || t.includes("megathread") || t.includes("ama ") || t.startsWith("ama:") || t.startsWith("i am a ") || t.startsWith("we are ")) return true;
	if (b.includes("[removed]") || b.includes("[deleted]") || b.startsWith("http") || b.startsWith("www.")) return true;
	if (post.author === "AutoModerator" || post.author === "[deleted]") return true;
	return false;
}
/**
* 帖子质量综合评分。
* 综合考虑 score、评论数、新鲜度，优先选出"社区真正认可"的帖子。
*/
function postQualityScore(post, nowSec) {
	const ageDays = Math.max((nowSec - post.createdUtc) / 86400, 1);
	const scoreFactor = Math.log10(Math.max(post.score, 1) + 1);
	const commentFactor = Math.log10(Math.max(post.numComments, 1) + 1);
	const freshness = ageDays <= 90 ? 1 : Math.max(.3, 1 - (ageDays - 90) / 365);
	const len = post.selftext.length;
	const lengthBonus = len >= 200 && len <= 1500 ? 1 : len > 1500 && len <= 3e3 ? .8 : .5;
	return (scoreFactor * 2 + commentFactor * 1.5) * freshness * lengthBonus;
}
/**
* 搜索 Reddit 帖子。
*
* 默认搜索策略：按 top 排序，取最近一年的帖子，
* 但后续 extractStyleExamples 会优先选最近 3 个月的高质量帖。
*
* 为什么 API 层面不直接限制为 3 个月？
* Reddit 的 search API 只支持 hour/day/week/month/year/all，
* 没有"3 个月"选项。如果用 month（1 个月），结果太少；
* 如果用 year，再在本地用评分系统筛选，覆盖面更广。
*/
async function searchRedditPosts(query, subreddit, sort = "top", timeRange = "year", limit = 10) {
	const params = new URLSearchParams({
		q: query,
		sort,
		t: timeRange,
		limit: String(Math.min(Math.max(limit, 1), 25)),
		raw_json: "1",
		restrict_sr: subreddit ? "on" : "off",
		type: "link"
	});
	const url = `${subreddit ? `https://www.reddit.com/r/${encodeURIComponent(subreddit)}/search.json` : `https://www.reddit.com/search.json`}?${params}`;
	const res = await fetch(url, {
		headers: { "User-Agent": USER_AGENT },
		signal: AbortSignal.timeout(15e3)
	});
	if (!res.ok) throw new Error(`Reddit search failed: ${res.status} ${res.statusText}`);
	const posts = ((await res.json())?.data?.children ?? []).filter((c) => c.kind === "t3" && c.data?.selftext).map((c) => ({
		title: c.data.title ?? "",
		selftext: c.data.selftext ?? "",
		subreddit: c.data.subreddit ?? "",
		author: c.data.author ?? "[deleted]",
		score: c.data.score ?? 0,
		numComments: c.data.num_comments ?? 0,
		permalink: c.data.permalink ?? "",
		createdUtc: c.data.created_utc ?? 0
	}));
	return {
		query,
		subreddit: subreddit ?? null,
		posts,
		fetchedAt: (/* @__PURE__ */ new Date()).toISOString()
	};
}
/**
* 从搜索结果中提取最适合作为 few-shot 范文的帖子。
*
* 筛选规则（优先级从高到低）：
* 1. 排除低质量帖子（mod、AMA、deleted、bot 帖）
* 2. 正文长度 200-3000 字符（太短没学习价值，太长浪费 token）
* 3. score ≥ 20（社区真正认可的内容）
* 4. 至少 3 条评论（有互动 = 社区觉得值得讨论）
* 5. 优先最近 3 个月的帖子（写作风格更贴近当前社区氛围）
* 6. 综合质量评分排序：score × comments × freshness × length
*/
function extractStyleExamples(posts, options = {}) {
	const { maxExamples = 3, minScore = 20, minComments = 3, minBodyLength = 200, maxBodyLength = 3e3, preferRecentMonths = 3 } = options;
	const nowSec = Date.now() / 1e3;
	const recentCutoff = nowSec - preferRecentMonths * 30 * 86400;
	const qualified = posts.filter((p) => !isLowQualityPost(p) && p.selftext.length >= minBodyLength && p.selftext.length <= maxBodyLength && p.score >= minScore && p.numComments >= minComments);
	const recent = qualified.filter((p) => p.createdUtc >= recentCutoff);
	const older = qualified.filter((p) => p.createdUtc < recentCutoff);
	const scoredRecent = recent.map((p) => ({
		post: p,
		quality: postQualityScore(p, nowSec)
	})).sort((a, b) => b.quality - a.quality);
	const scoredOlder = older.map((p) => ({
		post: p,
		quality: postQualityScore(p, nowSec)
	})).sort((a, b) => b.quality - a.quality);
	return [...scoredRecent.slice(0, maxExamples), ...scoredOlder.slice(0, Math.max(0, maxExamples - scoredRecent.length))].slice(0, maxExamples).map(({ post: p }, i) => {
		const ageLabel = formatAge(nowSec - p.createdUtc);
		return `Example ${i + 1} (r/${p.subreddit}, score: ${p.score}, ${p.numComments} comments, ${ageLabel} ago):\nTitle: "${p.title}"\nBody: "${p.selftext.slice(0, 800)}${p.selftext.length > 800 ? "..." : ""}"`;
	});
}
function formatAge(seconds) {
	const days = Math.floor(seconds / 86400);
	if (days < 1) return "today";
	if (days < 30) return `${days}d`;
	if (days < 365) return `${Math.floor(days / 30)}mo`;
	return `${(days / 365).toFixed(1)}y`;
}
//#endregion
//#region agent/tools/search_reddit.ts
var search_reddit_exports = /* @__PURE__ */ __exportAll({ default: () => search_reddit_default });
function formatPostAge(createdUtc) {
	const days = Math.floor((Date.now() / 1e3 - createdUtc) / 86400);
	if (days < 1) return "today";
	if (days < 30) return `${days}d ago`;
	if (days < 365) return `${Math.floor(days / 30)}mo ago`;
	return `${(days / 365).toFixed(1)}y ago`;
}
var search_reddit_default = defineTool({
	description: "搜索 Reddit 帖子。用于在生成内容前获取目标社区的真人帖子范文，学习写作风格和社区文化。",
	inputSchema: object({
		query: string().min(1).describe("搜索关键词"),
		subreddit: string().optional().describe("限定搜索的 subreddit（不含 r/ 前缀）"),
		sort: _enum([
			"relevance",
			"top",
			"new",
			"comments"
		]).default("top").describe("排序方式"),
		timeRange: _enum([
			"hour",
			"day",
			"week",
			"month",
			"year",
			"all"
		]).default("year").describe("时间范围"),
		limit: number().min(1).max(15).default(10).describe("返回帖子数量")
	}),
	async execute({ query, subreddit, sort, timeRange, limit }) {
		const result = await searchRedditPosts(query, subreddit, sort, timeRange, limit);
		const styleExamples = extractStyleExamples(result.posts, {
			maxExamples: 3,
			minScore: 20,
			minComments: 3,
			preferRecentMonths: 3
		});
		return {
			query: result.query,
			subreddit: result.subreddit,
			fetchedAt: result.fetchedAt,
			postCount: result.posts.length,
			qualifiedExampleCount: styleExamples.length,
			posts: result.posts.map((p) => ({
				title: p.title,
				subreddit: p.subreddit,
				author: p.author,
				score: p.score,
				numComments: p.numComments,
				ageLabel: formatPostAge(p.createdUtc),
				body: p.selftext.slice(0, 500) + (p.selftext.length > 500 ? "..." : "")
			})),
			styleExamples
		};
	}
});
//#endregion
//#region agent/tools/suggest_subreddits.ts
var suggest_subreddits_exports = /* @__PURE__ */ __exportAll({ default: () => suggest_subreddits_default });
var suggest_subreddits_default = defineTool({
	description: "为一组内容创意推荐最匹配的 subreddit。基于内容主题、角度和正文来判断最适合发布的社区。",
	inputSchema: object({
		ideas: array(object({
			title: string(),
			angle: string(),
			postTitle: string(),
			postBody: string(),
			currentSuggestedSubreddit: string().optional()
		})).min(1).describe("内容创意列表"),
		language: _enum(["en", "zh"]).default("en").describe("语言")
	}),
	async execute({ ideas, language }) {
		const suggestions = await suggestSubredditsForIdeas(ideas, language);
		return { suggestions: ideas.map((idea, i) => ({
			title: idea.title,
			suggestedSubreddit: suggestions[i] || "r/AskReddit"
		})) };
	}
});
//#endregion
//#region agent/subagents/image_designer/agent.ts
var agent_exports = /* @__PURE__ */ __exportAll({ default: () => agent_default });
var agent_default = defineAgent({
	description: "专业的产品图片 AI 设计师。负责电商平台适配图生成、产品去背景、VLM 质检、品牌规范搜索。Strategist 在用户需要图片生成时将任务委派给此子 Agent。",
	model: createGoogle({ apiKey: process.env.GEMINI_API_KEY })(process.env.GEMINI_AGENT_MODEL || "gemini-2.5-flash")
});
//#endregion
//#region lib/platformStyles.ts
const PLATFORM_IDS = [
	"tmall",
	"jd",
	"temu",
	"instagram"
];
/** Fallback when DB unavailable; keep in sync with supabase/migrations/001_asset_library.sql */
const PLATFORM_STYLE_FALLBACKS = [
	{
		id: "tmall",
		nameZh: "天猫",
		nameEn: "Tmall",
		aspectRatio: "1:1",
		size: "1024x1024",
		promptTemplate: "Transform this product photo into a Tmall/Taobao main product image: pure white background (#FFFFFF), product centered with generous padding, clean e-commerce look, soft even studio lighting, no clutter, space reserved for Chinese selling points overlay, photorealistic, sharp product details preserved.",
		negativeHints: "busy background, text watermark, low quality, distorted product",
		sortOrder: 1
	},
	{
		id: "jd",
		nameZh: "京东",
		nameEn: "JD.com",
		aspectRatio: "1:1",
		size: "1024x1024",
		promptTemplate: "Transform this product photo into a JD.com main product image: crisp white background, product centered, slightly higher contrast and punchy colors, professional e-commerce photography, sturdy premium feel, sharp edges, no decorative clutter, suitable for Chinese marketplace listing.",
		negativeHints: "messy background, cartoon style, blurry, wrong colors",
		sortOrder: 2
	},
	{
		id: "temu",
		nameZh: "Temu",
		nameEn: "Temu",
		aspectRatio: "1:1",
		size: "1024x1024",
		promptTemplate: "Transform this product photo into a Temu-style promotional product image: vibrant saturated colors, eye-catching deal/shopping vibe, subtle promotional sticker feel, bold composition, high energy, product still clearly visible and accurate, marketplace thumbnail optimized.",
		negativeHints: "dull colors, luxury minimal, unreadable product",
		sortOrder: 3
	},
	{
		id: "instagram",
		nameZh: "Instagram",
		nameEn: "Instagram",
		aspectRatio: "4:5",
		size: "1024x1280",
		promptTemplate: "Transform this product photo into an Instagram lifestyle post: natural soft daylight, authentic UGC aesthetic, product in a real-life context or styled flat lay, warm inviting mood, subtle depth of field, not overly commercial, social-media ready vertical composition.",
		negativeHints: "white e-commerce background, heavy text, stock photo cliché",
		sortOrder: 4
	}
];
function isPlatformId(value) {
	return typeof value === "string" && PLATFORM_IDS.includes(value);
}
/**
* 4-layer prompt architecture for generation consistency:
*   Layer 1 — Product Identity (shared across all platforms)
*   Layer 2 — Platform Style (background, lighting, composition)
*   Layer 3 — User Instructions (extra prompt from UI)
*   Layer 4 — Negative Constraints (what to avoid)
*/
function buildPlatformPrompt(style, options = {}) {
	const sections = [];
	const idParts = [];
	if (options.productName?.trim()) idParts.push(`Product: ${options.productName.trim()}.`);
	const id = options.identity;
	if (id) {
		if (id.description?.trim()) idParts.push(`Description: ${id.description.trim()}.`);
		if (id.primaryColors?.length) idParts.push(`Primary colors: ${id.primaryColors.join(", ")}. These exact colors MUST be preserved.`);
		if (id.material?.trim()) idParts.push(`Material/texture: ${id.material.trim()}.`);
		if (id.shapeKeywords?.trim()) idParts.push(`Shape: ${id.shapeKeywords.trim()}. The product shape and proportions MUST remain accurate.`);
		if (id.brandElements?.trim()) idParts.push(`Brand elements to preserve: ${id.brandElements.trim()}.`);
		if (id.immutableFeatures?.trim()) idParts.push(`CRITICAL — do NOT alter: ${id.immutableFeatures.trim()}.`);
	}
	if (idParts.length > 0) sections.push(`[PRODUCT IDENTITY]\n${idParts.join("\n")}`);
	sections.push(`[PLATFORM STYLE]\n${style.promptTemplate}`);
	if (options.extraPrompt?.trim()) sections.push(`[ADDITIONAL INSTRUCTIONS]\n${options.extraPrompt.trim()}`);
	const negParts = [];
	if (style.negativeHints?.trim()) negParts.push(style.negativeHints.trim());
	negParts.push("distorted product shape, wrong product colors, missing brand logo, altered product proportions");
	sections.push(`[AVOID]\n${negParts.join(", ")}.`);
	return sections.join("\n\n");
}
function parseOpenAiSize(size) {
	if (size === "1024x1280" || size === "1024x1536") return "1024x1536";
	if (size === "1280x1024" || size === "1536x1024") return "1536x1024";
	if (size === "1024x1024") return "1024x1024";
	return "auto";
}
//#endregion
//#region lib/assetLibrary.ts
function mapAssetRow(row) {
	return {
		id: String(row.id),
		name: String(row.name ?? ""),
		description: String(row.description ?? ""),
		storagePath: String(row.storage_path ?? ""),
		publicUrl: String(row.public_url ?? ""),
		mimeType: String(row.mime_type ?? "image/png"),
		tags: Array.isArray(row.tags) ? row.tags.map(String) : [],
		identity: {
			primaryColors: Array.isArray(row.primary_colors) ? row.primary_colors.map(String) : [],
			material: String(row.material ?? ""),
			shapeKeywords: String(row.shape_keywords ?? ""),
			brandElements: String(row.brand_elements ?? ""),
			immutableFeatures: String(row.immutable_features ?? "")
		},
		cleanStoragePath: row.clean_storage_path != null ? String(row.clean_storage_path) : null,
		cleanPublicUrl: row.clean_public_url != null ? String(row.clean_public_url) : null,
		createdAt: String(row.created_at ?? ""),
		updatedAt: String(row.updated_at ?? ""),
		generationCount: typeof row.generation_count === "number" ? row.generation_count : void 0
	};
}
function mapGenerationRow(row) {
	return {
		id: String(row.id),
		assetId: String(row.asset_id),
		platformId: String(row.platform_id),
		promptUsed: String(row.prompt_used ?? ""),
		storagePath: row.storage_path != null ? String(row.storage_path) : null,
		publicUrl: row.public_url != null ? String(row.public_url) : null,
		status: String(row.status ?? "pending"),
		errorMessage: row.error_message != null ? String(row.error_message) : null,
		model: String(row.model ?? "gpt-image-2"),
		seed: row.seed != null ? Number(row.seed) : null,
		approved: row.approved === true,
		reviewStatus: row.review_status != null ? String(row.review_status) : null,
		reviewNotes: row.review_notes != null ? String(row.review_notes) : null,
		createdAt: String(row.created_at ?? "")
	};
}
function mapPlatformRow(row) {
	return {
		id: String(row.id),
		nameZh: String(row.name_zh ?? ""),
		nameEn: String(row.name_en ?? ""),
		aspectRatio: String(row.aspect_ratio ?? "1:1"),
		size: String(row.size ?? "1024x1024"),
		promptTemplate: String(row.prompt_template ?? ""),
		negativeHints: row.negative_hints != null ? String(row.negative_hints) : void 0,
		sortOrder: Number(row.sort_order ?? 0)
	};
}
function assertSupabaseReady() {
	if (!isSupabaseConfigured()) throw new Error("Supabase is not configured. Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY.");
}
async function listPlatformStyles() {
	assertSupabaseReady();
	const { data, error } = await getSupabaseAdmin().from("platform_styles").select("*").order("sort_order", { ascending: true });
	if (error || !data?.length) return PLATFORM_STYLE_FALLBACKS;
	return data.map((row) => mapPlatformRow(row));
}
async function listAssets(limit = 50, offset = 0) {
	assertSupabaseReady();
	const { data, error } = await getSupabaseAdmin().from("product_assets").select("*, asset_generations(count)").order("created_at", { ascending: false }).range(offset, offset + limit - 1);
	if (error) throw new Error(error.message);
	return (data ?? []).map((row) => {
		const mapped = mapAssetRow(row);
		const genCount = row.asset_generations?.[0]?.count;
		if (typeof genCount === "number") mapped.generationCount = genCount;
		return mapped;
	});
}
async function getAsset$1(id) {
	assertSupabaseReady();
	const { data, error } = await getSupabaseAdmin().from("product_assets").select("*").eq("id", id).maybeSingle();
	if (error) throw new Error(error.message);
	return data ? mapAssetRow(data) : null;
}
async function createGenerationRecord(input) {
	assertSupabaseReady();
	if (!isPlatformId(input.platformId)) throw new Error("Invalid platform");
	const { data, error } = await getSupabaseAdmin().from("asset_generations").insert({
		asset_id: input.assetId,
		platform_id: input.platformId,
		prompt_used: input.promptUsed,
		status: "processing"
	}).select("*").single();
	if (error) throw new Error(error.message);
	return mapGenerationRow(data);
}
async function completeGenerationRecord(id, input) {
	assertSupabaseReady();
	const storagePath = buildGenerationStoragePath(input.mimeType);
	const { publicUrl } = await uploadToStorage(storagePath, input.buffer, input.mimeType);
	const { data, error } = await getSupabaseAdmin().from("asset_generations").update({
		storage_path: storagePath,
		public_url: publicUrl,
		prompt_used: input.promptUsed,
		status: "completed",
		error_message: null
	}).eq("id", id).select("*").single();
	if (error) throw new Error(error.message);
	return mapGenerationRow(data);
}
async function failGenerationRecord(id, errorMessage) {
	assertSupabaseReady();
	const { error } = await getSupabaseAdmin().from("asset_generations").update({
		status: "failed",
		error_message: errorMessage
	}).eq("id", id);
	if (error) throw new Error(error.message);
}
async function updateGenerationReview(generationId, review) {
	assertSupabaseReady();
	const { error } = await getSupabaseAdmin().from("asset_generations").update({
		review_status: review.status,
		review_notes: review.notes
	}).eq("id", generationId);
	if (error) throw new Error(error.message);
}
async function getApprovedGenerations(assetId) {
	assertSupabaseReady();
	const { data, error } = await getSupabaseAdmin().from("asset_generations").select("*").eq("asset_id", assetId).eq("approved", true).eq("status", "completed").order("created_at", { ascending: false });
	if (error) throw new Error(error.message);
	return (data ?? []).map((row) => mapGenerationRow(row));
}
async function updateAssetClean(assetId, input) {
	assertSupabaseReady();
	const storagePath = buildAssetStoragePath(input.mimeType);
	const { publicUrl } = await uploadToStorage(storagePath, input.buffer, input.mimeType);
	const { data, error } = await getSupabaseAdmin().from("product_assets").update({
		clean_storage_path: storagePath,
		clean_public_url: publicUrl,
		updated_at: (/* @__PURE__ */ new Date()).toISOString()
	}).eq("id", assetId).select("*").single();
	if (error) throw new Error(error.message);
	return mapAssetRow(data);
}
async function downloadAssetBuffer(asset) {
	return downloadFromStorage(asset.storagePath);
}
async function downloadCleanBuffer(asset) {
	if (!asset.cleanStoragePath) return null;
	return downloadFromStorage(asset.cleanStoragePath);
}
//#endregion
//#region lib/imageGen.ts
function requireOpenAiKey() {
	const key = process.env.OPENAI_API_KEY?.trim();
	if (!key) throw new Error("Missing OPENAI_API_KEY");
	return key;
}
function mimeToExt(mimeType) {
	if (mimeType === "image/jpeg") return "jpg";
	if (mimeType === "image/webp") return "webp";
	return "png";
}
async function generatePlatformImage(input) {
	const client = new OpenAI({ apiKey: requireOpenAiKey() });
	const identityForPrompt = {
		...input.identity,
		description: input.description || input.identity?.description
	};
	let extraParts = input.extraPrompt ?? "";
	if (input.approvedContext?.trim()) extraParts = `${extraParts}\n\n[APPROVED REFERENCE]\nPreviously approved generations for this product had these characteristics — maintain visual consistency:\n${input.approvedContext.trim()}`.trim();
	const promptUsed = buildPlatformPrompt(input.platformStyle, {
		productName: input.productName,
		extraPrompt: extraParts || void 0,
		identity: identityForPrompt
	});
	const model = process.env.OPENAI_IMAGE_MODEL?.trim() || "gpt-image-2";
	const size = parseOpenAiSize(input.platformStyle.size);
	const imageFile = await toFile(input.cleanBuffer ?? input.sourceBuffer, `source.${mimeToExt(input.mimeType)}`, { type: input.mimeType });
	const first = (await client.images.edit({
		model,
		image: imageFile,
		prompt: promptUsed,
		size,
		...input.seed != null ? { seed: input.seed } : {}
	})).data?.[0];
	if (!first) throw new Error("OpenAI returned no image data");
	if (first.b64_json) return {
		buffer: Buffer.from(first.b64_json, "base64"),
		promptUsed,
		mimeType: "image/png"
	};
	if (first.url) {
		const res = await fetch(first.url);
		if (!res.ok) throw new Error(`Failed to download generated image: ${res.status}`);
		const arrayBuffer = await res.arrayBuffer();
		const contentType = res.headers.get("content-type") || "image/png";
		return {
			buffer: Buffer.from(arrayBuffer),
			promptUsed,
			mimeType: contentType.split(";")[0] || "image/png"
		};
	}
	throw new Error("OpenAI image response missing b64_json and url");
}
//#endregion
//#region lib/brandDna.ts
/**
* Pull brand visual guidelines from the RAG knowledge base.
* Returns a formatted text block suitable for injection into image generation prompts.
*/
async function fetchBrandDnaForImageGen(input) {
	if (!isKnowledgeConfigured()) return "";
	const queryParts = ["brand visual style guide color palette photography"];
	if (input.productName) queryParts.push(input.productName);
	if (input.tags?.length) queryParts.push(input.tags.join(" "));
	const query = queryParts.join(" ").slice(0, 1500);
	const matches = [];
	try {
		const brandHits = await searchKnowledge({
			query,
			topK: 3,
			sourceType: "brand_guide",
			language: input.language
		});
		matches.push(...brandHits);
	} catch {}
	try {
		const productHits = await searchKnowledge({
			query,
			topK: 2,
			sourceType: "product_desc",
			language: input.language
		});
		matches.push(...productHits);
	} catch {}
	if (matches.length === 0) return "";
	matches.sort((a, b) => b.combinedScore - a.combinedScore);
	const topMatches = matches.slice(0, 4);
	const minScore = .25;
	const relevant = topMatches.filter((m) => m.combinedScore >= minScore);
	if (relevant.length === 0) return "";
	return `[BRAND DNA — from knowledge base]\n${relevant.map((m) => `- (${m.sourceType}) ${m.content.slice(0, 500)}`).join("\n")}`;
}
//#endregion
//#region agent/subagents/image_designer/tools/generate_platform_image.ts
var generate_platform_image_exports = /* @__PURE__ */ __exportAll({ default: () => generate_platform_image_default });
async function resolveStyle(platform, sizeStr, width, height) {
	if (platform && platform !== "custom") {
		try {
			const match = (await listPlatformStyles()).find((s) => s.id === platform);
			if (match) return match;
		} catch {}
		const fb = PLATFORM_STYLE_FALLBACKS.find((s) => s.id === platform);
		if (fb) return fb;
	}
	let resolvedSize = "1024x1024";
	if (width && height) resolvedSize = `${width}x${height}`;
	else if (sizeStr) resolvedSize = {
		"1:1": "1024x1024",
		"3:2": "1536x1024",
		"2:3": "1024x1536",
		"4:3": "1024x768",
		"3:4": "768x1024",
		"9:16": "1024x1536",
		"16:9": "1536x1024"
	}[sizeStr] ?? "1024x1024";
	return {
		id: "custom",
		nameZh: "自定义",
		nameEn: "Custom",
		aspectRatio: sizeStr ?? "1:1",
		size: resolvedSize,
		promptTemplate: "Transform this product photo: professional product photography, clean composition, high quality, sharp details, accurate product representation.",
		negativeHints: "distorted, blurry, wrong colors",
		sortOrder: 99
	};
}
function buildIdentityForPrompt$1(asset) {
	return {
		description: asset.description,
		primaryColors: asset.identity.primaryColors,
		material: asset.identity.material,
		shapeKeywords: asset.identity.shapeKeywords,
		brandElements: asset.identity.brandElements,
		immutableFeatures: asset.identity.immutableFeatures
	};
}
var generate_platform_image_default = defineTool({
	description: "根据平台、尺寸、prompt 等参数为指定产品素材生成电商适配图。支持天猫、京东、Temu、Instagram或自定义尺寸。消耗 API 额度，需要审批。",
	inputSchema: object({
		assetId: string().describe("产品素材 ID"),
		platform: _enum([
			"tmall",
			"jd",
			"temu",
			"instagram",
			"custom"
		]).optional().describe("目标平台"),
		width: number().optional().describe("自定义宽度（px）"),
		height: number().optional().describe("自定义高度（px）"),
		size: _enum([
			"1:1",
			"3:2",
			"2:3",
			"4:3",
			"3:4",
			"9:16",
			"16:9"
		]).optional().describe("预设比例"),
		count: number().min(1).max(10).default(1).describe("生成数量"),
		extraPrompt: string().optional().describe("额外生成指令"),
		seed: number().optional().describe("随机种子"),
		useCleanBg: boolean().default(true).describe("是否优先使用去背景版本")
	}),
	approval: once(),
	async execute({ assetId, platform, width, height, size, count, extraPrompt, seed, useCleanBg }) {
		const asset = await getAsset$1(assetId);
		if (!asset) throw new Error(`Asset ${assetId} not found`);
		const platformStyle = await resolveStyle(platform, size, width, height);
		const [sourceBuffer, cleanBuffer] = await Promise.all([downloadAssetBuffer(asset), useCleanBg ? downloadCleanBuffer(asset) : Promise.resolve(null)]);
		const identity = buildIdentityForPrompt$1(asset);
		let approvedContext = "";
		try {
			const approved = await getApprovedGenerations(assetId);
			if (approved.length > 0) approvedContext = approved.filter((g) => g.platformId !== platform).slice(0, 3).map((g) => `${g.platformId}: ${g.promptUsed.slice(0, 300)}`).join("\n");
		} catch {}
		let brandDna = "";
		try {
			brandDna = await fetchBrandDnaForImageGen({
				productName: asset.name,
				tags: asset.tags
			});
		} catch {}
		const combinedExtra = [extraPrompt, brandDna].filter(Boolean).join("\n\n");
		const results = [];
		for (let i = 0; i < count; i++) {
			const pending = await createGenerationRecord({
				assetId,
				platformId: platform ?? "custom",
				promptUsed: ""
			});
			try {
				const { buffer, promptUsed, mimeType } = await generatePlatformImage({
					sourceBuffer,
					cleanBuffer,
					mimeType: asset.mimeType,
					platformStyle,
					productName: asset.name,
					description: asset.description,
					extraPrompt: combinedExtra || void 0,
					identity,
					seed: seed != null ? seed + i : null,
					approvedContext
				});
				const gen = await completeGenerationRecord(pending.id, {
					buffer,
					mimeType,
					promptUsed
				});
				results.push({
					generationId: gen.id,
					publicUrl: gen.publicUrl,
					status: "completed",
					promptUsed
				});
			} catch (err) {
				const msg = err instanceof Error ? err.message : String(err);
				await failGenerationRecord(pending.id, msg).catch(() => {});
				results.push({
					generationId: pending.id,
					publicUrl: null,
					status: "failed",
					promptUsed: "",
					error: msg
				});
			}
		}
		return {
			assetName: asset.name,
			platform: platform ?? "custom",
			count: results.length,
			results
		};
	}
});
//#endregion
//#region agent/subagents/image_designer/tools/list_product_assets.ts
var list_product_assets_exports = /* @__PURE__ */ __exportAll({ default: () => list_product_assets_default });
var list_product_assets_default = defineTool({
	description: "列出素材库中的产品图片。返回产品名称、描述、缩略图URL等信息，供用户选择要生成的产品。",
	inputSchema: object({ limit: number().min(1).max(50).default(20).describe("返回数量") }),
	async execute({ limit }) {
		const assets = await listAssets(limit, 0);
		return {
			count: assets.length,
			assets: assets.map((a) => ({
				id: a.id,
				name: a.name,
				description: a.description,
				publicUrl: a.publicUrl,
				hasClean: Boolean(a.cleanPublicUrl),
				tags: a.tags,
				generationCount: a.generationCount ?? 0
			}))
		};
	}
});
//#endregion
//#region lib/removeBackground.ts
function isRemoveBgAvailable() {
	return Boolean(process.env.GEMINI_API_KEY?.trim());
}
/**
* Remove the background from a product image using Gemini's image generation,
* producing a clean product cutout on a pure white background.
*/
async function removeBackground(input) {
	const apiKey = process.env.GEMINI_API_KEY?.trim();
	if (!apiKey) throw new Error("GEMINI_API_KEY is required for background removal");
	const ai = new GoogleGenAI({ apiKey });
	const model = process.env.GEMINI_IMAGE_MODEL || "gemini-2.0-flash-preview-image-generation";
	const parts = (await ai.models.generateContent({
		model,
		contents: [{
			role: "user",
			parts: [{ inlineData: {
				mimeType: input.mimeType || "image/png",
				data: input.buffer.toString("base64")
			} }, { text: "Remove the background from this product image completely. Output ONLY the product on a pure white (#FFFFFF) background. Preserve every detail of the product: exact colors, textures, shape, logos, text, and proportions. Do not alter, crop, or resize the product itself. The result should look like a professional product cutout photo on white." }]
		}],
		config: { responseModalities: ["image", "text"] }
	})).candidates?.[0]?.content?.parts ?? [];
	for (const part of parts) if (part.inlineData?.data) return {
		buffer: Buffer.from(part.inlineData.data, "base64"),
		mimeType: part.inlineData.mimeType || "image/png"
	};
	throw new Error("Gemini did not return an image for background removal");
}
//#endregion
//#region agent/subagents/image_designer/tools/remove_background.ts
var remove_background_exports = /* @__PURE__ */ __exportAll({ default: () => remove_background_default });
var remove_background_default = defineTool({
	description: "去除产品图片的背景，生成纯白底的产品抠图。后续生成时会自动优先使用抠图版本。",
	inputSchema: object({ assetId: string().describe("产品素材 ID") }),
	async execute({ assetId }) {
		if (!isRemoveBgAvailable()) return {
			success: false,
			error: "Background removal requires GEMINI_API_KEY"
		};
		const asset = await getAsset$1(assetId);
		if (!asset) throw new Error(`Asset ${assetId} not found`);
		const { buffer, mimeType } = await removeBackground({
			buffer: await downloadAssetBuffer(asset),
			mimeType: asset.mimeType
		});
		const updated = await updateAssetClean(assetId, {
			buffer,
			mimeType
		});
		return {
			success: true,
			assetName: updated.name,
			cleanUrl: updated.cleanPublicUrl
		};
	}
});
//#endregion
//#region lib/imageReview.ts
function getGeminiClient() {
	const key = process.env.GEMINI_API_KEY?.trim();
	if (!key) return null;
	return new GoogleGenAI({ apiKey: key });
}
function bufferToBase64Part(buffer, mimeType) {
	return { inlineData: {
		mimeType: mimeType || "image/png",
		data: buffer.toString("base64")
	} };
}
function isReviewAvailable() {
	return Boolean(process.env.GEMINI_API_KEY?.trim());
}
/**
* Compare a generated image against the original product photo using Gemini Vision.
* Returns a structured review with pass/warning/fail status.
*/
async function reviewGeneratedImage(input) {
	const ai = getGeminiClient();
	if (!ai) return {
		status: "warning",
		shapeOk: true,
		colorOk: true,
		brandOk: true,
		overallUsable: true,
		notes: "VLM review skipped: GEMINI_API_KEY not configured."
	};
	const identityContext = [];
	if (input.productName) identityContext.push(`Product name: ${input.productName}`);
	const id = input.identity;
	if (id?.primaryColors?.length) identityContext.push(`Expected primary colors: ${id.primaryColors.join(", ")}`);
	if (id?.material) identityContext.push(`Material: ${id.material}`);
	if (id?.shapeKeywords) identityContext.push(`Shape: ${id.shapeKeywords}`);
	if (id?.brandElements) identityContext.push(`Brand elements: ${id.brandElements}`);
	if (id?.immutableFeatures) identityContext.push(`Must not change: ${id.immutableFeatures}`);
	const prompt = `You are a product image QA reviewer for e-commerce. Compare the ORIGINAL product photo (Image 1) with the AI-GENERATED version (Image 2).

${identityContext.length > 0 ? `Product reference:\n${identityContext.join("\n")}\n` : ""}
Evaluate these criteria:
1. SHAPE: Is the product shape/silhouette/proportions preserved? (no distortion, stretching, or missing parts)
2. COLOR: Are the product's actual colors accurate? (no color shift, wrong hues)
3. BRAND: Are brand elements (logo, text, distinctive features) preserved?
4. USABLE: Would this image be acceptable for a real e-commerce listing?

Respond in EXACTLY this JSON format, nothing else:
{"shapeOk":true/false,"colorOk":true/false,"brandOk":true/false,"overallUsable":true/false,"notes":"brief explanation of any issues"}`;
	try {
		const model = process.env.GEMINI_REVIEW_MODEL || "gemini-2.5-flash";
		const text = (await ai.models.generateContent({
			model,
			contents: [{
				role: "user",
				parts: [
					bufferToBase64Part(input.originalBuffer, input.originalMimeType),
					bufferToBase64Part(input.generatedBuffer, input.generatedMimeType),
					{ text: prompt }
				]
			}]
		})).text?.trim() ?? "";
		const jsonMatch = text.match(/\{[\s\S]*\}/);
		if (!jsonMatch) return {
			status: "warning",
			shapeOk: true,
			colorOk: true,
			brandOk: true,
			overallUsable: true,
			notes: `VLM returned non-JSON: ${text.slice(0, 200)}`
		};
		const parsed = JSON.parse(jsonMatch[0]);
		const shapeOk = parsed.shapeOk !== false;
		const colorOk = parsed.colorOk !== false;
		const brandOk = parsed.brandOk !== false;
		const overallUsable = parsed.overallUsable !== false;
		const notes = String(parsed.notes ?? "");
		const allOk = shapeOk && colorOk && brandOk && overallUsable;
		const anyFail = !shapeOk || !colorOk;
		let status;
		if (allOk) status = "passed";
		else if (anyFail) status = "failed";
		else status = "warning";
		return {
			status,
			shapeOk,
			colorOk,
			brandOk,
			overallUsable,
			notes
		};
	} catch (err) {
		return {
			status: "warning",
			shapeOk: true,
			colorOk: true,
			brandOk: true,
			overallUsable: true,
			notes: `VLM review error: ${err instanceof Error ? err.message : String(err)}`
		};
	}
}
//#endregion
//#region agent/subagents/image_designer/tools/review_image.ts
var review_image_exports = /* @__PURE__ */ __exportAll({ default: () => review_image_default });
function buildIdentityForPrompt(asset) {
	return {
		description: asset.description,
		primaryColors: asset.identity.primaryColors,
		material: asset.identity.material,
		shapeKeywords: asset.identity.shapeKeywords,
		brandElements: asset.identity.brandElements,
		immutableFeatures: asset.identity.immutableFeatures
	};
}
var review_image_default = defineTool({
	description: "用 VLM（视觉语言模型）审查生成的图片，对比原图检查产品形状、颜色、品牌元素是否保持一致。返回通过/警告/失败状态。",
	inputSchema: object({
		assetId: string().describe("原始产品素材 ID"),
		generationId: string().describe("要审查的生成记录 ID")
	}),
	async execute({ assetId, generationId }) {
		if (!isReviewAvailable()) return {
			status: "warning",
			notes: "VLM review not available: GEMINI_API_KEY not configured"
		};
		const asset = await getAsset$1(assetId);
		if (!asset) throw new Error(`Asset ${assetId} not found`);
		const { getSupabaseAdmin } = await import("./_5.mjs");
		const { data: genRow } = await getSupabaseAdmin().from("asset_generations").select("storage_path, public_url").eq("id", generationId).single();
		if (!genRow?.storage_path) throw new Error("Generation not found or has no image");
		const { downloadFromStorage } = await import("./_5.mjs");
		const [originalBuffer, generatedBuffer] = await Promise.all([downloadAssetBuffer(asset), downloadFromStorage(genRow.storage_path)]);
		const identity = buildIdentityForPrompt(asset);
		const result = await reviewGeneratedImage({
			originalBuffer,
			originalMimeType: asset.mimeType,
			generatedBuffer,
			generatedMimeType: "image/png",
			productName: asset.name,
			identity
		});
		await updateGenerationReview(generationId, {
			status: result.status,
			notes: result.notes
		});
		return result;
	}
});
//#endregion
//#region agent/subagents/image_designer/tools/search_brand_guidelines.ts
var search_brand_guidelines_exports = /* @__PURE__ */ __exportAll({ default: () => search_brand_guidelines_default });
var search_brand_guidelines_default = defineTool({
	description: "从 RAG 知识库搜索品牌视觉规范（色彩、风格、摄影要求等），用于指导图片生成保持品牌一致性。",
	inputSchema: object({
		productName: string().optional().describe("产品名称"),
		tags: array(string()).default([]).describe("相关标签")
	}),
	async execute({ productName, tags }) {
		const result = await fetchBrandDnaForImageGen({
			productName,
			tags
		});
		if (!result) return {
			found: false,
			message: "No brand guidelines found in knowledge base"
		};
		return {
			found: true,
			guidelines: result
		};
	}
});
//#endregion
//#region .eve/builds/mrp1vvvh-d562e54e-36fd-4538-af24-d6d19af0c971/host/compiled-artifacts-bootstrap.mjs
installEveWorkflowQueueNamespace("react-example");
const moduleMap = Object.freeze({ "nodes": Object.freeze({
	"__root__": Object.freeze({ "modules": Object.freeze({
		"agent.ts": agent_exports$1,
		"channels/eve.ts": eve_exports,
		"tools/analyze_reddit_data.ts": analyze_reddit_data_exports,
		"tools/generate_content_from_prompt.ts": generate_content_from_prompt_exports,
		"tools/generate_content_ideas.ts": generate_content_ideas_exports,
		"tools/get_competitive_data.ts": get_competitive_data_exports,
		"tools/scan_subreddit.ts": scan_subreddit_exports,
		"tools/search_reddit.ts": search_reddit_exports,
		"tools/suggest_subreddits.ts": suggest_subreddits_exports
	}) }),
	"subagents/image_designer": Object.freeze({ "modules": Object.freeze({
		"agent.ts": agent_exports,
		"tools/generate_platform_image.ts": generate_platform_image_exports,
		"tools/list_product_assets.ts": list_product_assets_exports,
		"tools/remove_background.ts": remove_background_exports,
		"tools/review_image.ts": review_image_exports,
		"tools/search_brand_guidelines.ts": search_brand_guidelines_exports
	}) })
}) });
const metadata = {
	"compile": { "moduleMap": {
		"path": ".output/.eve/compile/module-map.mjs",
		"sha256": "8ac7ead262e6e4084a8dd2f93b571ce8d8b1909b281670f5374aa52d580904e3"
	} },
	"discovery": {
		"diagnostics": {
			"path": ".output/.eve/discovery/diagnostics.json",
			"sha256": "b26fc8e66ee943f962b1bab4a790f6a611ce7e6738aa29f83ea53b73cc362c63"
		},
		"manifest": {
			"path": ".output/.eve/discovery/agent-discovery-manifest.json",
			"sha256": "2d0c3da0dc21303da2e52869922859198ffde481904e360d4b78d455f3fd047f"
		},
		"sourceGraphHash": "7ffb6db8eecde9a6b8bf8e578c89347649a7d1e8ce7afc7ac4523717f661b676",
		"summary": {
			"errors": 0,
			"warnings": 0
		}
	},
	"generator": {
		"name": "eve",
		"version": "0.24.6"
	},
	"kind": "eve-compile-metadata",
	"status": "ready",
	"version": 5
};
const manifest = {
	"agentRoot": "/Users/xuke/Documents/reddit/reddit-analysis/agent",
	"appRoot": "/Users/xuke/Documents/reddit/reddit-analysis",
	"channels": [
		{
			"kind": "channel",
			"name": "eve",
			"logicalPath": "channels/eve.ts",
			"method": "GET",
			"urlPath": "/eve/v1/info",
			"sourceId": "channels/eve.ts",
			"sourceKind": "module",
			"adapterKind": "http",
			"cors": {}
		},
		{
			"kind": "channel",
			"name": "eve",
			"logicalPath": "channels/eve.ts",
			"method": "POST",
			"urlPath": "/eve/v1/session",
			"sourceId": "channels/eve.ts",
			"sourceKind": "module",
			"adapterKind": "http",
			"cors": {}
		},
		{
			"kind": "channel",
			"name": "eve",
			"logicalPath": "channels/eve.ts",
			"method": "POST",
			"urlPath": "/eve/v1/session/:sessionId",
			"sourceId": "channels/eve.ts",
			"sourceKind": "module",
			"adapterKind": "http",
			"cors": {}
		},
		{
			"kind": "channel",
			"name": "eve",
			"logicalPath": "channels/eve.ts",
			"method": "POST",
			"urlPath": "/eve/v1/session/:sessionId/cancel",
			"sourceId": "channels/eve.ts",
			"sourceKind": "module",
			"adapterKind": "http",
			"cors": {}
		},
		{
			"kind": "channel",
			"name": "eve",
			"logicalPath": "channels/eve.ts",
			"method": "GET",
			"urlPath": "/eve/v1/session/:sessionId/stream",
			"sourceId": "channels/eve.ts",
			"sourceKind": "module",
			"adapterKind": "http",
			"cors": {}
		}
	],
	"connections": [],
	"config": {
		"compaction": {},
		"model": {
			"id": "google/gemini-2.5-flash",
			"routing": {
				"kind": "external",
				"provider": "google"
			},
			"contextWindowTokens": 1e6,
			"source": {
				"sourceKind": "module",
				"logicalPath": "agent.ts",
				"sourceId": "agent.ts"
			}
		},
		"name": "react-example",
		"source": {
			"sourceKind": "module",
			"logicalPath": "agent.ts",
			"sourceId": "agent.ts"
		}
	},
	"diagnosticsSummary": {
		"errors": 0,
		"warnings": 0
	},
	"disabledFrameworkTools": [],
	"dynamicInstructions": [],
	"dynamicSkills": [],
	"dynamicTools": [],
	"hooks": [],
	"remoteAgents": [],
	"sandbox": null,
	"sandboxWorkspaces": [],
	"schedules": [{
		"cron": "0 9 * * 1-5",
		"hasRun": false,
		"logicalPath": "schedules/daily-competitive-scan.ts",
		"name": "daily-competitive-scan",
		"sourceId": "schedules/daily-competitive-scan.ts",
		"sourceKind": "module",
		"markdown": "执行每日竞品扫描任务：\n\n1. 调用 get_competitive_data 获取最新的 Instagram 竞品监控数据\n2. 调用 scan_subreddit 扫描以下核心 subreddit 的最新动态：\n   - r/ecommerce\n   - r/smallbusiness\n   - r/dropship\n3. 将扫描结果与昨日数据对比，总结关键变化\n4. 生成一份结构化的每日竞品简报，包含：\n   - 竞品社媒动态摘要\n   - Reddit 社区热点话题\n   - 值得关注的用户痛点或需求\n   - 建议的应对策略\n\n注意：只报告有实质变化的内容，不要重复已知信息。"
	}, {
		"cron": "0 10 * * 1",
		"hasRun": false,
		"logicalPath": "schedules/weekly-report.ts",
		"name": "weekly-report",
		"sourceId": "schedules/weekly-report.ts",
		"sourceKind": "module",
		"markdown": "执行周度营销总结任务：\n\n1. 调用 search_reddit 搜索过去一周各核心 subreddit 的高赞帖子（sort: top, time_filter: week）\n2. 调用 analyze_reddit_data 对搜索结果进行深度分析\n3. 调用 generate_content_ideas 基于分析结果生成下周内容创意\n4. 生成一份完整的周报，包含：\n   - 本周 Reddit 社区趋势总结\n   - 用户讨论热点和情绪变化\n   - 竞品动态回顾\n   - 下周内容创作建议（包含 3-5 个具体选题）\n   - 推荐发布时间和目标 subreddit"
	}],
	"skills": [],
	"tools": [
		{
			"description": "对 Reddit 帖子和评论数据进行深度分析，生成结构化报告：讨论摘要、用户痛点、被赞特性、提及品牌、高频词汇。",
			"inputSchema": {
				"$schema": "http://json-schema.org/draft-07/schema#",
				"type": "object",
				"properties": {
					"datasetText": {
						"type": "string",
						"minLength": 10,
						"description": "Reddit 帖子和评论的文本数据集"
					},
					"language": {
						"default": "en",
						"description": "输出语言",
						"type": "string",
						"enum": ["en", "zh"]
					}
				},
				"required": ["datasetText"]
			},
			"logicalPath": "tools/analyze_reddit_data.ts",
			"name": "analyze_reddit_data",
			"sourceId": "tools/analyze_reddit_data.ts",
			"sourceKind": "module"
		},
		{
			"description": "基于用户指令和目标 subreddit 直接生成 Reddit 帖子创意。不需要分析报告。可传入真人帖子范文作为风格参考。",
			"inputSchema": {
				"$schema": "http://json-schema.org/draft-07/schema#",
				"type": "object",
				"properties": {
					"subreddit": {
						"type": "string",
						"description": "目标 subreddit，例如 'r/startups'"
					},
					"instruction": {
						"type": "string",
						"description": "用户的内容生成指令"
					},
					"language": {
						"default": "en",
						"description": "输出语言",
						"type": "string",
						"enum": ["en", "zh"]
					},
					"tone": {
						"default": "question",
						"description": "帖子语气风格",
						"type": "string",
						"enum": [
							"curious",
							"question",
							"recommend",
							"rant"
						]
					},
					"examplePosts": {
						"default": [],
						"description": "来自 search_reddit 的真人帖子范文，用于风格参考",
						"type": "array",
						"items": { "type": "string" }
					},
					"count": {
						"default": 6,
						"description": "生成帖子数量",
						"type": "number",
						"minimum": 1,
						"maximum": 10
					}
				},
				"required": ["subreddit", "instruction"]
			},
			"logicalPath": "tools/generate_content_from_prompt.ts",
			"name": "generate_content_from_prompt",
			"sourceId": "tools/generate_content_from_prompt.ts",
			"sourceKind": "module"
		},
		{
			"description": "基于分析报告生成 Reddit 帖子创意，包含标题、正文和推荐 subreddit。数量由 count 参数控制。",
			"inputSchema": {
				"$schema": "http://json-schema.org/draft-07/schema#",
				"type": "object",
				"properties": {
					"report": {
						"type": "object",
						"properties": {
							"summary": { "type": "string" },
							"painPoints": {
								"type": "array",
								"items": { "type": "string" }
							},
							"praisedFeatures": {
								"type": "array",
								"items": { "type": "string" }
							},
							"mentionedBrands": {
								"type": "array",
								"items": { "type": "string" }
							},
							"highFrequencyWords": {
								"type": "array",
								"items": { "type": "string" }
							}
						},
						"required": [
							"summary",
							"painPoints",
							"praisedFeatures",
							"mentionedBrands",
							"highFrequencyWords"
						],
						"description": "分析报告对象"
					},
					"language": {
						"default": "en",
						"description": "输出语言",
						"type": "string",
						"enum": ["en", "zh"]
					},
					"tone": {
						"default": "question",
						"description": "帖子语气风格",
						"type": "string",
						"enum": [
							"curious",
							"question",
							"recommend",
							"rant"
						]
					},
					"count": {
						"default": 6,
						"description": "生成帖子数量",
						"type": "number",
						"minimum": 1,
						"maximum": 10
					}
				},
				"required": ["report"]
			},
			"logicalPath": "tools/generate_content_ideas.ts",
			"name": "generate_content_ideas",
			"sourceId": "tools/generate_content_ideas.ts",
			"sourceKind": "module"
		},
		{
			"description": "获取 Instagram 竞品监控的最新缓存数据，包括各竞品账号的帖子、互动数据和内容分类。",
			"inputSchema": {
				"$schema": "http://json-schema.org/draft-07/schema#",
				"type": "object",
				"properties": {}
			},
			"logicalPath": "tools/get_competitive_data.ts",
			"name": "get_competitive_data",
			"sourceId": "tools/get_competitive_data.ts",
			"sourceKind": "module"
		},
		{
			"description": "扫描一个或多个 subreddit 的最新帖子，获取帖子内容、评论、情绪分类和用户意图标注。用于了解社区最新讨论动态。",
			"inputSchema": {
				"$schema": "http://json-schema.org/draft-07/schema#",
				"type": "object",
				"properties": {
					"subreddits": {
						"minItems": 1,
						"type": "array",
						"items": { "type": "string" },
						"description": "要扫描的 subreddit 名称列表，例如 ['startups', 'SaaS']"
					},
					"limit": {
						"default": 10,
						"description": "每个 subreddit 获取的帖子数量",
						"type": "number",
						"minimum": 1,
						"maximum": 25
					},
					"useAi": {
						"default": true,
						"description": "是否使用 AI 标注情绪和分类",
						"type": "boolean"
					}
				},
				"required": ["subreddits"]
			},
			"logicalPath": "tools/scan_subreddit.ts",
			"name": "scan_subreddit",
			"sourceId": "tools/scan_subreddit.ts",
			"sourceKind": "module"
		},
		{
			"description": "搜索 Reddit 帖子。用于在生成内容前获取目标社区的真人帖子范文，学习写作风格和社区文化。",
			"inputSchema": {
				"$schema": "http://json-schema.org/draft-07/schema#",
				"type": "object",
				"properties": {
					"query": {
						"type": "string",
						"minLength": 1,
						"description": "搜索关键词"
					},
					"subreddit": {
						"description": "限定搜索的 subreddit（不含 r/ 前缀）",
						"type": "string"
					},
					"sort": {
						"default": "top",
						"description": "排序方式",
						"type": "string",
						"enum": [
							"relevance",
							"top",
							"new",
							"comments"
						]
					},
					"timeRange": {
						"default": "year",
						"description": "时间范围",
						"type": "string",
						"enum": [
							"hour",
							"day",
							"week",
							"month",
							"year",
							"all"
						]
					},
					"limit": {
						"default": 10,
						"description": "返回帖子数量",
						"type": "number",
						"minimum": 1,
						"maximum": 15
					}
				},
				"required": ["query"]
			},
			"logicalPath": "tools/search_reddit.ts",
			"name": "search_reddit",
			"sourceId": "tools/search_reddit.ts",
			"sourceKind": "module"
		},
		{
			"description": "为一组内容创意推荐最匹配的 subreddit。基于内容主题、角度和正文来判断最适合发布的社区。",
			"inputSchema": {
				"$schema": "http://json-schema.org/draft-07/schema#",
				"type": "object",
				"properties": {
					"ideas": {
						"minItems": 1,
						"type": "array",
						"items": {
							"type": "object",
							"properties": {
								"title": { "type": "string" },
								"angle": { "type": "string" },
								"postTitle": { "type": "string" },
								"postBody": { "type": "string" },
								"currentSuggestedSubreddit": { "type": "string" }
							},
							"required": [
								"title",
								"angle",
								"postTitle",
								"postBody"
							]
						},
						"description": "内容创意列表"
					},
					"language": {
						"default": "en",
						"description": "语言",
						"type": "string",
						"enum": ["en", "zh"]
					}
				},
				"required": ["ideas"]
			},
			"logicalPath": "tools/suggest_subreddits.ts",
			"name": "suggest_subreddits",
			"sourceId": "tools/suggest_subreddits.ts",
			"sourceKind": "module"
		}
	],
	"workspaceResourceRoot": {
		"logicalPath": "workspace-resources/__root__",
		"rootEntries": []
	},
	"instructions": {
		"name": "instructions",
		"logicalPath": "instructions.md",
		"markdown": "你是一个 AI 营销策略师（Marketing Strategist），服务于电商品牌团队。\n\n## 核心能力\n\n- **Reddit 社区调研**：扫描指定 subreddit 的最新帖子，分析讨论趋势、用户痛点、热门话题\n- **数据分析报告**：基于 Reddit 数据集生成结构化报告（摘要、痛点、好评特性、品牌、高频词）\n- **内容创作**：基于分析报告或用户指令生成 Reddit 帖子草稿\n- **Subreddit 推荐**：为内容创意推荐最匹配的 subreddit\n- **竞品分析**：查看 Instagram 竞品监控数据\n\n## 内容生成决策流程\n1. 用户指定了目标 subreddit？否 → 先询问或用 suggest_subreddits 推荐\n2. **先搜索再生成**：调用 search_reddit 搜索高赞帖子，学习社区语气和文化\n3. 将搜索结果传给 generate_content_from_prompt 作为风格参考\n4. 用户指定了数量就用该数量，否则默认 6 篇\n\n## 图片生成\n当用户需要生成产品图片、去背景、批量生图等图片相关任务时，**委派给 image_designer 子 Agent**。\n在委派消息中包含：\n- 具体任务描述\n- 目标平台和尺寸（如果用户指定了）\n- 产品素材 ID（如果已知）\n- 生成数量\n- 任何额外的用户要求\n\n## clientContext 说明\n前端会通过 clientContext 传递界面和参数信息：\n- `mode`: \"strategist\" | \"image-studio\"\n- `platform`, `size`, `count`, `quality`：图片生成预设参数\n- `selectedAssetId`：选中的产品素材 ID\n\n当 mode 为 \"image-studio\" 时，用户主要想进行图片操作，请直接委派给 image_designer。\n\n## 通用原则\n- 通过调用工具来执行任务，不自己编造数据\n- 生成的 Reddit 内容必须像真实用户写的，避免营销感\n- 用中文回复用户，除非用户用英文提问\n",
		"sourceId": "instructions.md",
		"sourceKind": "markdown"
	},
	"kind": "eve-agent-compiled-manifest",
	"extensionMounts": [],
	"subagentEdges": [{
		"childNodeId": "subagents/image_designer",
		"parentNodeId": "__root__"
	}],
	"subagents": [{
		"agent": {
			"agentRoot": "/Users/xuke/Documents/reddit/reddit-analysis/agent/subagents/image_designer",
			"appRoot": "/Users/xuke/Documents/reddit/reddit-analysis",
			"channels": [],
			"connections": [],
			"config": {
				"compaction": {},
				"description": "专业的产品图片 AI 设计师。负责电商平台适配图生成、产品去背景、VLM 质检、品牌规范搜索。Strategist 在用户需要图片生成时将任务委派给此子 Agent。",
				"model": {
					"id": "google/gemini-2.5-flash",
					"routing": {
						"kind": "external",
						"provider": "google"
					},
					"contextWindowTokens": 1e6,
					"source": {
						"sourceKind": "module",
						"logicalPath": "agent.ts",
						"sourceId": "agent.ts"
					}
				},
				"name": "image_designer",
				"source": {
					"sourceKind": "module",
					"logicalPath": "agent.ts",
					"sourceId": "agent.ts"
				}
			},
			"diagnosticsSummary": {
				"errors": 0,
				"warnings": 0
			},
			"disabledFrameworkTools": [],
			"dynamicInstructions": [],
			"dynamicSkills": [],
			"dynamicTools": [],
			"hooks": [],
			"remoteAgents": [],
			"sandbox": null,
			"sandboxWorkspaces": [],
			"schedules": [],
			"skills": [],
			"tools": [
				{
					"description": "根据平台、尺寸、prompt 等参数为指定产品素材生成电商适配图。支持天猫、京东、Temu、Instagram或自定义尺寸。消耗 API 额度，需要审批。",
					"inputSchema": {
						"$schema": "http://json-schema.org/draft-07/schema#",
						"type": "object",
						"properties": {
							"assetId": {
								"type": "string",
								"description": "产品素材 ID"
							},
							"platform": {
								"description": "目标平台",
								"type": "string",
								"enum": [
									"tmall",
									"jd",
									"temu",
									"instagram",
									"custom"
								]
							},
							"width": {
								"description": "自定义宽度（px）",
								"type": "number"
							},
							"height": {
								"description": "自定义高度（px）",
								"type": "number"
							},
							"size": {
								"description": "预设比例",
								"type": "string",
								"enum": [
									"1:1",
									"3:2",
									"2:3",
									"4:3",
									"3:4",
									"9:16",
									"16:9"
								]
							},
							"count": {
								"default": 1,
								"description": "生成数量",
								"type": "number",
								"minimum": 1,
								"maximum": 10
							},
							"extraPrompt": {
								"description": "额外生成指令",
								"type": "string"
							},
							"seed": {
								"description": "随机种子",
								"type": "number"
							},
							"useCleanBg": {
								"default": true,
								"description": "是否优先使用去背景版本",
								"type": "boolean"
							}
						},
						"required": ["assetId"]
					},
					"logicalPath": "tools/generate_platform_image.ts",
					"name": "generate_platform_image",
					"sourceId": "tools/generate_platform_image.ts",
					"sourceKind": "module"
				},
				{
					"description": "列出素材库中的产品图片。返回产品名称、描述、缩略图URL等信息，供用户选择要生成的产品。",
					"inputSchema": {
						"$schema": "http://json-schema.org/draft-07/schema#",
						"type": "object",
						"properties": { "limit": {
							"default": 20,
							"description": "返回数量",
							"type": "number",
							"minimum": 1,
							"maximum": 50
						} }
					},
					"logicalPath": "tools/list_product_assets.ts",
					"name": "list_product_assets",
					"sourceId": "tools/list_product_assets.ts",
					"sourceKind": "module"
				},
				{
					"description": "去除产品图片的背景，生成纯白底的产品抠图。后续生成时会自动优先使用抠图版本。",
					"inputSchema": {
						"$schema": "http://json-schema.org/draft-07/schema#",
						"type": "object",
						"properties": { "assetId": {
							"type": "string",
							"description": "产品素材 ID"
						} },
						"required": ["assetId"]
					},
					"logicalPath": "tools/remove_background.ts",
					"name": "remove_background",
					"sourceId": "tools/remove_background.ts",
					"sourceKind": "module"
				},
				{
					"description": "用 VLM（视觉语言模型）审查生成的图片，对比原图检查产品形状、颜色、品牌元素是否保持一致。返回通过/警告/失败状态。",
					"inputSchema": {
						"$schema": "http://json-schema.org/draft-07/schema#",
						"type": "object",
						"properties": {
							"assetId": {
								"type": "string",
								"description": "原始产品素材 ID"
							},
							"generationId": {
								"type": "string",
								"description": "要审查的生成记录 ID"
							}
						},
						"required": ["assetId", "generationId"]
					},
					"logicalPath": "tools/review_image.ts",
					"name": "review_image",
					"sourceId": "tools/review_image.ts",
					"sourceKind": "module"
				},
				{
					"description": "从 RAG 知识库搜索品牌视觉规范（色彩、风格、摄影要求等），用于指导图片生成保持品牌一致性。",
					"inputSchema": {
						"$schema": "http://json-schema.org/draft-07/schema#",
						"type": "object",
						"properties": {
							"productName": {
								"description": "产品名称",
								"type": "string"
							},
							"tags": {
								"default": [],
								"description": "相关标签",
								"type": "array",
								"items": { "type": "string" }
							}
						}
					},
					"logicalPath": "tools/search_brand_guidelines.ts",
					"name": "search_brand_guidelines",
					"sourceId": "tools/search_brand_guidelines.ts",
					"sourceKind": "module"
				}
			],
			"workspaceResourceRoot": {
				"logicalPath": "workspace-resources/subagents/image_designer",
				"rootEntries": []
			},
			"instructions": {
				"name": "instructions",
				"logicalPath": "instructions.md",
				"markdown": "你是一个专业的产品图片 AI 设计师。你帮助用户完成以下任务：\n\n1. **生成电商平台适配图**：天猫、京东、Temu、Instagram 或自定义尺寸\n2. **去除产品背景**：将产品从复杂背景中抠出\n3. **风格变换与批量生成**：根据不同平台需求批量处理\n4. **基于参考图保持一致性**：利用已采纳的生成结果保持跨平台视觉统一\n\n## 工作方式\n- 你通过调用工具来执行具体任务，不自己编造图片\n- 父 Agent 会在消息中告诉你目标平台、尺寸、数量等参数\n- 生成前，你会自动搜索品牌规范和已采纳的历史生成，确保一致性\n- 生成后，你会自动调用 VLM 审查工具检查质量\n\n## 决策流程\n1. 用户是否指定了产品素材？\n   - 是 → 直接使用该素材 ID\n   - 否 → 调用 list_product_assets 让用户选择\n2. 确定平台和尺寸\n3. 搜索品牌规范（如果知识库可用）\n4. 调用 generate_platform_image 生成图片\n5. 调用 review_image 质检\n6. 返回结果和质检报告\n\n## 重要原则\n- 产品形状、颜色、品牌元素必须保持准确\n- 如果要求批量生成（count > 1），每次都使用相同的产品身份信息\n- 用中文回复，除非收到英文指令\n",
				"sourceId": "instructions.md",
				"sourceKind": "markdown"
			}
		},
		"description": "专业的产品图片 AI 设计师。负责电商平台适配图生成、产品去背景、VLM 质检、品牌规范搜索。Strategist 在用户需要图片生成时将任务委派给此子 Agent。",
		"entryPath": "/Users/xuke/Documents/reddit/reddit-analysis/agent/subagents/image_designer",
		"logicalPath": "subagents/image_designer",
		"name": "image_designer",
		"nodeId": "subagents/image_designer",
		"rootPath": "/Users/xuke/Documents/reddit/reddit-analysis/agent/subagents/image_designer",
		"sourceId": "subagents/image_designer",
		"sourceKind": "module"
	}],
	"version": 36
};
function installCompiledArtifactsBootstrap() {
	installBundledCompiledArtifacts({
		manifest,
		metadata,
		moduleMap
	});
}
installCompiledArtifactsBootstrap();
function installCompiledArtifactsPlugin() {}
const POST = ba(Buffer.from([
	"Z2xvYmFsVGhpcy5fX3ByaXZhdGVfd29ya2Zsb3dzID0gbmV3IE1hcCgpOwovLyNyZWdpb24gZGlzdC9zcmMvc2hhcmVkL2d1YXJkcy5qcwpmdW5jdGlvbiBpc09iamVjdChlKSB7CglyZXR1cm4gdHlwZW9mIGUgPT0gYG9iamVjdGAgJiYgISFlICYmICFBcnJheS5pc0FycmF5KGUpOwp9CmZ1bmN0aW9uIGlzTm9uRW1wdHlTdHJpbmcoZSkgewoJcmV0dXJuIHR5cGVvZiBlID09IGBzdHJpbmdgICYmIGUubGVuZ3RoID4gMDsKfQovLyNlbmRyZWdpb24KLy8jcmVnaW9uIGRpc3Qvc3JjL3NoYXJlZC9lcnJvcnMuanMKZnVuY3Rpb24gdG9FcnJvck1lc3NhZ2UodCkgewoJcmV0dXJuIHQgaW5zdGFuY2VvZiBFcnJvciA/IHQubWVzc2FnZSA6IHR5cGVvZiB0ID09IGBzdHJpbmdgID8gdCA6IHQgPT0gbnVsbCA/IFN0cmluZyh0KSA6IGlzT2JqZWN0KHQpID8gdHlwZW9mIHQubWVzc2FnZSA9PSBgc3RyaW5nYCAmJiB0Lm1lc3NhZ2UubGVuZ3RoID4gMCA/IHQubWVzc2FnZSA6IHNhZmVKc29uU3RyaW5naWZ5KHQpIDogU3RyaW5nKHQpOwp9CmZ1bmN0aW9uIHNhZmVKc29uU3RyaW5naWZ5KGUpIHsKCXRyeSB7CgkJcmV0dXJuIEpTT04uc3RyaW5naWZ5KGUpID8/IFN0cmluZyhlKTsKCX0gY2F0Y2ggewoJCXJldHVybiBTdHJpbmcoZSk7Cgl9Cn0KbmV3IFRleHRFbmNvZGVyKCk7Ci8vI2VuZHJlZ2lvbgovLyNyZWdpb24gZGlzdC9zcmMvcnVudGltZS9hY3Rpb25zL2tleXMuanMKZnVuY3Rpb24gZ2V0UnVudGltZUFjdGlvblJlc3VsdEtleShlKSB7Cglzd2l0Y2ggKGUua2luZCkgewoJCWNhc2UgYGxvYWQtc2tpbGwtcmVzdWx0YDogcmV0dXJuIGBydW50aW1lLWFjdGlvbjpsb2FkLXNraWxsOiR7ZS5jYWxsSWR9YDsKCQljYXNlIGBzdWJhZ2VudC1yZXN1bHRgOiByZXR1cm4gYHN1YmFnZW50LWNhbGw6JHtlLnN1YmFnZW50TmFtZX06JHtlLmNhbGxJZH1gOwoJCWNhc2UgYHRvb2wtcmVzdWx0YDogcmV0dXJuIGB0b29sLWNhbGw6JHtlLnRvb2xOYW1lfToke2UuY2FsbElkfWA7Cgl9Cn0KLy8jZW5kcmVnaW9uCi8vI3JlZ2lvbiBkaXN0L3NyYy9oYXJuZXNzL3J1bnRpbWUtYWN0aW9ucy5qcwpmdW5jdGlvbiByZXNvbHZlUnVudGltZUFjdGlvblJlc3VsdHNGb3JLZXlzKGUpIHsKCWxldCB0ID0gbmV3IFNldChlLnBlbmRpbmdLZXlzKSwgbiA9IG5ldyBNYXAoKTsKCWZvciAobGV0IHIgb2YgZS5yZXN1bHRzKSB7CgkJbGV0IGUgPSBnZXRSdW50aW1lQWN0aW9uUmVzdWx0S2V5KHIpOwoJCXQuaGFzKGUpICYmIG4uc2V0KGUsIHIpOwoJfQoJbGV0IHIgPSBbXTsKCWZvciAobGV0IHQgb2YgZS5wZW5kaW5nS2V5cykgewoJCWxldCBlID0gbi5nZXQodCk7CgkJaWYgKGUgPT09IHZvaWQgMCkgcmV0dXJuOwoJCXIucHVzaChlKTsKCX0KCXJldHVybiByOwp9Ci8vI2VuZHJlZ2lvbgovLyNyZWdpb24gZGlzdC9zcmMvZXhlY3V0aW9uL2Rpc3BhdGNoLXJ1bnRpbWUtYWN0aW9ucy1zdGVwLmpzCnZhciBkaXNwYXRjaFJ1bnRpbWVBY3Rpb25zU3RlcCA9IGdsb2JhbFRoaXNbU3ltYm9sLmZvcigiV09SS0ZMT1dfVVNFX1NURVAiKV0oInN0ZXAvL2V2ZUAwLjI0LjYvL2Rpc3BhdGNoUnVudGltZUFjdGlvbnNTdGVwIik7Ci8vI2VuZHJlZ2lvbgovLyNyZWdpb24gZGlzdC9zcmMvZXhlY3V0aW9uL3dvcmtmbG93LWNhbGxiYWNrLXVybC5qcwpmdW5jdGlvbiByZXNvbHZlVmVyY2VsUHJvZHVjdGlvbkNhbGxiYWNrQmFzZVVybCgpIHsKCXJldHVybiBwcm9jZXNzLmVudi5WRVJDRUxfRU5WID09PSBgcHJvZHVjdGlvbmAgJiYgcHJvY2Vzcy5lbnYuVkVSQ0VMX1BST0pFQ1RfUFJPRFVDVElPTl9VUkwgPyBgaHR0cHM6Ly8ke3Byb2Nlc3MuZW52LlZFUkNFTF9QUk9KRUNUX1BST0RVQ1RJT05fVVJMfWAgOiBudWxsOwp9CmZ1bmN0aW9uIHJlc29sdmVXb3JrZmxvd0NhbGxiYWNrQmFzZVVybChlKSB7CglsZXQgdCA9IHByb2Nlc3MuZW52LldPUktGTE9XX0xPQ0FMX0JBU0VfVVJMPy50cmltKCkgfHwgdm9pZCAwOwoJcmV0dXJuIChyZXNvbHZlVmVyY2VsUHJvZHVjdGlvbkNhbGxiYWNrQmFzZVVybCgpID8/IHQgPz8gZSkucmVwbGFjZSgvXC8kLywgYGApOwp9Ci8vI2VuZHJlZ2lvbgovLyNyZWdpb24gZGlzdC9zcmMvZXhlY3V0aW9uL3dvcmtmbG93LXN0ZXBzLmpzCnZhciB0dXJuU3RlcCA9IGdsb2JhbFRoaXNbU3ltYm9sLmZvcigiV09SS0ZMT1dfVVNFX1NURVAiKV0oInN0ZXAvL2V2ZUAwLjI0LjYvL3R1cm5TdGVwIik7CnZhciByb3V0ZVByb3hpZWREZWxpdmVyU3RlcCA9IGdsb2JhbFRoaXNbU3ltYm9sLmZvcigiV09SS0ZMT1dfVVNFX1NURVAiKV0oInN0ZXAvL2V2ZUAwLjI0LjYvL3JvdXRlUHJveGllZERlbGl2ZXJTdGVwIik7CnZhciBkaXNwYXRjaFR1cm5TdGVwID0gZ2xvYmFsVGhpc1tTeW1ib2wuZm9yKCJXT1JLRkxPV19VU0VfU1RFUCIpXSgic3RlcC8vZXZlQDAuMjQuNi8vZGlzcGF0Y2hUdXJuU3RlcCIpOwovLyNlbmRyZWdpb24KLy8jcmVnaW9uIGRpc3Qvc3JjL2ludGVybmFsL3dvcmtmbG93LWJ1bmRsZS93b3JrZmxvdy1jb3JlLXNoaW0uanMKY29uc3QgV09SS0ZMT1dfQ09OVEVYVF9TWU1CT0wgPSBTeW1ib2wuZm9yKGBXT1JLRkxPV19DT05URVhUYCk7CmNvbnN0IFdPUktGTE9XX0NSRUFURV9IT09LID0gU3ltYm9sLmZvcihgV09SS0ZMT1dfQ1JFQVRFX0hPT0tgKTsKY29uc3QgV09SS0ZMT1dfR0VUX1NUUkVBTV9JRCA9IFN5bWJvbC5mb3IoYFdPUktGTE9XX0dFVF9TVFJFQU1fSURgKTsKY29uc3QgU1RSRUFNX05BTUVfU1lNQk9MID0gU3ltYm9sLmZvcihgV09SS0ZMT1dfU1RSRUFNX05BTUVgKTsKY29uc3Qgd29ya2Zsb3dHbG9iYWwgPSBnbG9iYWxUaGlzOwpmdW5jdGlvbiBjcmVhdGVIb29rKGUpIHsKCWxldCBuID0gd29ya2Zsb3dHbG9iYWxbV09SS0ZMT1dfQ1JFQVRFX0hPT0tdOwoJaWYgKG4gPT09IHZvaWQgMCkgdGhyb3cgRXJyb3IoImBjcmVhdGVIb29rKClgIGNhbiBvbmx5IGJlIGNhbGxlZCBpbnNpZGUgYSB3b3JrZmxvdyBmdW5jdGlvbiIpOwoJcmV0dXJuIG4oZSk7Cn0KZnVuY3Rpb24gZ2V0V29ya2Zsb3dNZXRhZGF0YSgpIHsKCWxldCB0ID0gd29ya2Zsb3dHbG9iYWxbV09SS0ZMT1dfQ09OVEVYVF9TWU1CT0xdOwoJaWYgKHQgPT09IHZvaWQgMCkgdGhyb3cgRXJyb3IoImBnZXRXb3JrZmxvd01ldGFkYXRhKClgIGNhbiBvbmx5IGJlIGNhbGxlZCBpbnNpZGUgYSB3b3JrZmxvdyBvciBzdGVwIGZ1bmN0aW9uIik7CglyZXR1cm4gdDsKfQpmdW5jdGlvbiBnZXRXcml0YWJsZShlID0ge30pIHsKCWxldCB0ID0gd29ya2Zsb3dHbG9iYWxbV09SS0ZMT1dfR0VUX1NUUkVBTV9JRF07CglpZiAodCA9PT0gdm9pZCAwKSB0aHJvdyBFcnJvcigiYGdldFdyaXRhYmxlKClgIGNhbiBvbmx5IGJlIGNhbGxlZCBpbnNpZGUgYSB3b3JrZmxvdyBmdW5jdGlvbiIpOwoJbGV0IHIgPSB0KGUubmFtZXNwYWNlKTsKCXJldHVybiBPYmplY3QuY3JlYXRlKGdsb2JhbFRoaXMuV3JpdGFibGVTdHJlYW0ucHJvdG90eXBlLCB7IFtTVFJFQU1fTkFNRV9TWU1CT0xdOiB7CgkJdmFsdWU6IHIsCgkJd3JpdGFibGU6ICExCgl9IH0pOwp9Ci8vI2VuZHJlZ2lvbgovLyNyZWdpb24gZGlzdC9zcmMvZXhlY3V0aW9uL2hvb2stb3duZXJzaGlwLmpzCmFzeW5jIGZ1bmN0aW9uIGNsYWltSG9va093bmVyc2hpcChlKSB7CglsZXQgdDsKCXRyeSB7CgkJdCA9IGF3YWl0IGUuZ2V0Q29uZmxpY3QoKTsKCX0gY2F0Y2ggKHQpIHsKCQlyZXR1cm4gYXdhaXQgZGlzcG9zZUFuZFRocm93KGUsIG5vcm1hbGl6ZUhvb2tDbGFpbUVycm9yKHQsIGUudG9rZW4pKTsKCX0KCWlmICh0ICE9PSBudWxsKSByZXR1cm4gYXdhaXQgZGlzcG9zZUFuZFRocm93KGUsIGNyZWF0ZUhvb2tDb25mbGljdEVycm9yKGUudG9rZW4sIHQucnVuSWQpKTsKfQphc3luYyBmdW5jdGlvbiBjbG9zZUhvb2tJdGVyYXRvcihlKSB7Cgl0eXBlb2YgZS5yZXR1cm4gPT0gYGZ1bmN0aW9uYCAmJiBhd2FpdCBlLnJldHVybih2b2lkIDApOwp9CmFzeW5jIGZ1bmN0aW9uIGRpc3Bvc2VIb29rKGUpIHsKCWxldCB0ID0gZS5kaXNwb3NlOwoJaWYgKHR5cGVvZiB0ID09IGBmdW5jdGlvbmApIHsKCQlhd2FpdCB0LmNhbGwoZSk7CgkJcmV0dXJuOwoJfQoJbGV0IG4gPSBlW1N5bWJvbC5kaXNwb3NlXTsKCXR5cGVvZiBuID09IGBmdW5jdGlvbmAgJiYgYXdhaXQgbi5jYWxsKGUpOwp9CmFzeW5jIGZ1bmN0aW9uIGRpc3Bvc2VBbmRUaHJvdyhlLCB0KSB7Cgl0cnkgewoJCWF3YWl0IGRpc3Bvc2VIb29rKGUpOwoJfSBjYXRjaCB7fQoJdGhyb3cgdDsKfQpmdW5jdGlvbiBub3JtYWxpemVIb29rQ2xhaW1FcnJvcihlLCB0KSB7CglyZXR1cm4gaXNIb29rQ29uZmxpY3RFcnJvcihlKSA/IGNyZWF0ZUhvb2tDb25mbGljdEVycm9yKHR5cGVvZiBlLnRva2VuID09IGBzdHJpbmdgID8gZS50b2tlbiA6IHQsIHR5cGVvZiBlLmNvbmZsaWN0aW5nUnVuSWQgPT0gYHN0cmluZ2AgPyBlLmNvbmZsaWN0aW5nUnVuSWQgOiB2b2lkIDApIDogZTsKfQpmdW5jdGlvbiBpc0hvb2tDb25mbGljdEVycm9yKGUpIHsKCXJldHVybiB0eXBlb2YgZSA9PSBgb2JqZWN0YCAmJiAhIWUgJiYgYG5hbWVgIGluIGUgJiYgZS5uYW1lID09PSBgSG9va0NvbmZsaWN0RXJyb3JgOwp9CmZ1bmN0aW9uIGNyZWF0ZUhvb2tDb25mbGljdEVycm9yKGUsIHQpIHsKCWxldCBuID0gdCA9PT0gdm9pZCAwID8gYGAgOiBgIChydW4gIiR7dH0iKWA7CglyZXR1cm4gT2JqZWN0LmFzc2lnbihFcnJvcihgSG9vayB0b2tlbiAiJHtlfSIgaXMgYWxyZWFkeSBpbiB1c2Uke259YCksIHsKCQljb25mbGljdGluZ1J1bklkOiB0LAoJCW5hbWU6IGBIb29rQ29uZmxpY3RFcnJvcmAsCgkJdG9rZW46IGUKCX0pOwp9Ci8vI2VuZHJlZ2lvbgovLyNyZWdpb24gZGlzdC9zcmMvZXhlY3V0aW9uL3dvcmtmbG93LWVycm9ycy5qcwpmdW5jdGlvbiBub3JtYWxpemVTZXJpYWxpemFibGVFcnJvcihlKSB7CglyZXR1cm4gZSBpbnN0YW5jZW9mIEVycm9yID8gewoJCS4uLk9iamVjdC5mcm9tRW50cmllcyhPYmplY3QuZW50cmllcyhlKSksCgkJY2F1c2U6IGUuY2F1c2UgPT09IHZvaWQgMCA/IHZvaWQgMCA6IG5vcm1hbGl6ZVNlcmlhbGl6YWJsZUVycm9yKGUuY2F1c2UpLAoJCW1lc3NhZ2U6IGUubWVzc2FnZSwKCQluYW1lOiBlLm5hbWUsCgkJc3RhY2s6IGUuc3RhY2sKCX0gOiBlOwp9CmZ1bmN0aW9uIHJlYnVpbGRTZXJpYWxpemFibGVFcnJvcihlKSB7CglpZiAoIWlzUmVjb3JkKGUpKSByZXR1cm4gRXJyb3IoU3RyaW5nKGUpKTsKCWxldCB0ID0gdHlwZW9mIGUubWVzc2FnZSA9PSBgc3RyaW5nYCA/IGUubWVzc2FnZSA6IFN0cmluZyhlKSwgbiA9IEVycm9yKHQpOwoJdHlwZW9mIGUubmFtZSA9PSBgc3RyaW5nYCAmJiAobi5uYW1lID0gZS5uYW1lKSwgdHlwZW9mIGUuc3RhY2sgPT0gYHN0cmluZ2AgJiYgKG4uc3RhY2sgPSBlLnN0YWNrKSwgYGNhdXNlYCBpbiBlICYmIChuLmNhdXNlID0gaXNSZWNvcmQoZS5jYXVzZSkgPyByZWJ1aWxkU2VyaWFsaXphYmxlRXJyb3IoZS5jYXVzZSkgOiBlLmNhdXNlKTsKCWxldCByID0gbjsKCWZvciAobGV0IFt0LCBuXSBvZiBPYmplY3QuZW50cmllcyhlKSkgdCA9PT0gYG1lc3NhZ2VgIHx8IHQgPT09IGBuYW1lYCB8fCB0ID09PSBgc3RhY2tgIHx8IHQgPT09IGBjYXVzZWAgfHwgKHJbdF0gPSBuKTsKCXJldHVybiBuOwp9CmZ1bmN0aW9uIGlzUmVjb3JkKGUpIHsKCXJldHVybiB0eXBlb2YgZSA9PSBgb2JqZWN0YCAmJiAhIWU7Cn0KLy8jZW5kcmVnaW9uCi8vI3JlZ2lvbiBkaXN0L3NyYy9leGVjdXRpb24vdHVybi1jb250cm9sLXByb3RvY29sLmpzCnZhciBzZW5kVHVybkNvbnRyb2xTdGVwID0gZ2xvYmFsVGhpc1tTeW1ib2wuZm9yKCJXT1JLRkxPV19VU0VfU1RFUCIpXSgic3RlcC8vZXZlQDAuMjQuNi8vc2VuZFR1cm5Db250cm9sU3RlcCIpOwovLyNlbmRyZWdpb24KLy8jcmVnaW9uIGRpc3Qvc3JjL2V4ZWN1dGlvbi9jYW5jZWwtZGVzY2VuZGFudC10dXJucy1zdGVwLmpzCnZhciBjYW5jZWxEZXNjZW5kYW50VHVybnNTdGVwID0gZ2xvYmFsVGhpc1tTeW1ib2wuZm9yKCJXT1JLRkxPV19VU0VfU1RFUCIpXSgic3RlcC8vZXZlQDAuMjQuNi8vY2FuY2VsRGVzY2VuZGFudFR1cm5zU3RlcCIpOwovLyNlbmRyZWdpb24KLy8jcmVnaW9uIGRpc3Qvc3JjL2V4ZWN1dGlvbi9kaXNwYXRjaC13b3JrZmxvdy1ydW50aW1lLWFjdGlvbnMtc3RlcC5qcwp2YXIgZGlzcGF0Y2hXb3JrZmxvd1J1bnRpbWVBY3Rpb25zU3RlcCA9IGdsb2JhbFRoaXNbU3ltYm9sLmZvcigiV09SS0ZMT1dfVVNFX1NURVAiKV0oInN0ZXAvL2V2ZUAwLjI0LjYvL2Rpc3BhdGNoV29ya2Zsb3dSdW50aW1lQWN0aW9uc1N0ZXAiKTsKLy8jZW5kcmVnaW9uCi8vI3JlZ2lvbiBkaXN0L3NyYy9leGVjdXRpb24vZHVyYWJsZS1zZXNzaW9uLW1pZ3JhdGlvbnMvY2hhaW4uanMKZnVuY3Rpb24gcnVuTWlncmF0aW9uQ2hhaW4oZSkgewoJaWYgKHR5cGVvZiBlLnZhbHVlICE9IGBvYmplY3RgIHx8IGUudmFsdWUgPT09IG51bGwpIHRocm93IEVycm9yKGAke2UubGFiZWx9OiB2YWx1ZSBoYXMgbm8gbnVtZXJpYyAidmVyc2lvbiIgZmllbGQuYCk7CglsZXQgdCA9IGUudmFsdWUudmVyc2lvbiwgbjsKCWlmICh0eXBlb2YgdCA9PSBgbnVtYmVyYCkgbiA9IGUudmFsdWU7CgllbHNlIGlmICghKGB2ZXJzaW9uYCBpbiBlLnZhbHVlKSAmJiBlLmluaXRpYWxWZXJzaW9uICE9PSB2b2lkIDApIG4gPSB7CgkJLi4uZS52YWx1ZSwKCQl2ZXJzaW9uOiBlLmluaXRpYWxWZXJzaW9uCgl9OwoJZWxzZSB0aHJvdyBFcnJvcihgJHtlLmxhYmVsfTogdmFsdWUgaGFzIG5vIG51bWVyaWMgInZlcnNpb24iIGZpZWxkLmApOwoJbGV0IHIgPSBlLmluaXRpYWxWZXJzaW9uID8/IDE7CglpZiAoIU51bWJlci5pc0ludGVnZXIobi52ZXJzaW9uKSB8fCBuLnZlcnNpb24gPCByKSB0aHJvdyBFcnJvcihgJHtlLmxhYmVsfTogdmVyc2lvbiAke24udmVyc2lvbn0gaXMgbm90IGEgcG9zaXRpdmUgaW50ZWdlci5gKTsKCWlmIChuLnZlcnNpb24gPiBlLnRhcmdldFZlcnNpb24pIHRocm93IEVycm9yKGAke2UubGFiZWx9OiBlbmNvdW50ZXJlZCB2ZXJzaW9uICR7bi52ZXJzaW9ufSwgd2hpY2ggaXMgbmV3ZXIgdGhhbiB0aGUgc3VwcG9ydGVkIHZlcnNpb24gJHtlLnRhcmdldFZlcnNpb259LiBUaGlzIHVzdWFsbHkgaW5kaWNhdGVzIHRoZSB3aXJlIHdhcyB3cml0dGVuIGJ5IGEgbmV3ZXIgZXZlIGRlcGxveW1lbnQgdGhhbiB0aGUgb25lIHJlYWRpbmcgaXQuYCk7Cglmb3IgKDsgbi52ZXJzaW9uIDwgZS50YXJnZXRWZXJzaW9uOykgewoJCWxldCB0ID0gZS5taWdyYXRpb25zLmZpbmQoKGUpID0+IGUuZnJvbSA9PT0gbi52ZXJzaW9uKTsKCQlpZiAoIXQpIHRocm93IEVycm9yKGAke2UubGFiZWx9OiBubyBtaWdyYXRpb24gcmVnaXN0ZXJlZCBmb3IgdmVyc2lvbiAke24udmVyc2lvbn0g4oaSICR7bi52ZXJzaW9uICsgMX0uYCk7CgkJaWYgKHQudG8gIT09IHQuZnJvbSArIDEpIHRocm93IEVycm9yKGAke2UubGFiZWx9OiBtaWdyYXRpb24gJHt0LmZyb219IOKGkiAke3QudG99IG11c3Qgc3RlcCBleGFjdGx5IG9uZSB2ZXJzaW9uIGF0IGEgdGltZS5gKTsKCQlsZXQgciA9IHQubWlncmF0ZShuKTsKCQlpZiAoci52ZXJzaW9uICE9PSB0LnRvKSB0aHJvdyBFcnJvcihgJHtlLmxhYmVsfTogbWlncmF0aW9uICR7dC5mcm9tfSDihpIgJHt0LnRvfSBwcm9kdWNlZCBhIHZhbHVlIHdpdGggdmVyc2lvbiAke3IudmVyc2lvbn0uYCk7CgkJbiA9IHI7Cgl9CglyZXR1cm4gbjsKfQovLyNlbmRyZWdpb24KLy8jcmVnaW9uIGRpc3Qvc3JjL2V4ZWN1dGlvbi9kdXJhYmxlLXNlc3Npb24tbWlncmF0aW9ucy90dXJuLXdvcmtmbG93LXYwLXRvLXYxLmpzCmNvbnN0IHR1cm5Xb3JrZmxvd0lucHV0VjBUb1YxID0gewoJZnJvbTogMCwKCW1pZ3JhdGUoZSkgewoJCWlmICghaXNQcmVWZXJzaW9uVHVybldvcmtmbG93SW5wdXQoZSkpIHRocm93IEVycm9yKGB0dXJuIHdvcmtmbG93IGlucHV0OiB2ZXJzaW9uIDAgdmFsdWUgaXMgbm90IGEgcmVjb2duaXplZCBwcmUtdmVyc2lvbiBzaGFwZS5gKTsKCQlyZXR1cm4gewoJCQljYXBhYmlsaXRpZXM6IGUuY2FwYWJpbGl0aWVzLAoJCQljb21wbGV0aW9uVG9rZW46IGUuY29tcGxldGlvblRva2VuLAoJCQltb2RlOiBlLm1vZGUsCgkJCXN0ZXBJbnB1dDogewoJCQkJaW5wdXQ6IGUuZGVsaXZlcnksCgkJCQlwYXJlbnRXcml0YWJsZTogZS5wYXJlbnRXcml0YWJsZSwKCQkJCXNlcmlhbGl6ZWRDb250ZXh0OiBlLnNlcmlhbGl6ZWRDb250ZXh0LAoJCQkJc2Vzc2lvblN0YXRlOiBlLnNlc3Npb25TdGF0ZQoJCQl9LAoJCQl2ZXJzaW9uOiAxCgkJfTsKCX0sCgl0bzogMQp9OwpmdW5jdGlvbiBpc1ByZVZlcnNpb25UdXJuV29ya2Zsb3dJbnB1dChlKSB7CglyZXR1cm4gdHlwZW9mIGUgPT0gYG9iamVjdGAgJiYgISFlICYmIGBkZWxpdmVyeWAgaW4gZTsKfQovLyNlbmRyZWdpb24KLy8jcmVnaW9uIGRpc3Qvc3JjL2V4ZWN1dGlvbi9kdXJhYmxlLXNlc3Npb24tbWlncmF0aW9ucy90dXJuLXdvcmtmbG93LmpzCmNvbnN0IHR1cm5Xb3JrZmxvd0lucHV0TWlncmF0aW9ucyA9IFt0dXJuV29ya2Zsb3dJbnB1dFYwVG9WMV07CmZ1bmN0aW9uIG1pZ3JhdGVUdXJuV29ya2Zsb3dJbnB1dCh0KSB7CglyZXR1cm4gcnVuTWlncmF0aW9uQ2hhaW4oewoJCWluaXRpYWxWZXJzaW9uOiAwLAoJCWxhYmVsOiBgdHVybiB3b3JrZmxvdyBpbnB1dGAsCgkJbWlncmF0aW9uczogdHVybldvcmtmbG93SW5wdXRNaWdyYXRpb25zLAoJCXRhcmdldFZlcnNpb246IDEsCgkJdmFsdWU6IHQKCX0pOwp9Ci8vI2VuZHJlZ2lvbgovLyNyZWdpb24gZGlzdC9zcmMvZXhlY3V0aW9uL2RlbGl2ZXItcGF5bG9hZHMuanMKZnVuY3Rpb24gY29hbGVzY2VEZWxpdmVyUGF5bG9hZHMoZSkgewoJaWYgKGUubGVuZ3RoID09PSAwKSByZXR1cm4ge307CglpZiAoZS5sZW5ndGggPT09IDEpIHJldHVybiBlWzBdID8/IHt9OwoJbGV0IHQgPSB7fSwgbiA9IFtdOwoJZm9yIChsZXQgciBvZiBlKSB7CgkJZm9yIChsZXQgW2UsIG5dIG9mIE9iamVjdC5lbnRyaWVzKHIpKSBlICE9PSBgaW5wdXRSZXNwb25zZXNgICYmIG4gIT09IHZvaWQgMCAmJiAodFtlXSA9IG4pOwoJCXIuaW5wdXRSZXNwb25zZXMgIT09IHZvaWQgMCAmJiBuLnB1c2goLi4uci5pbnB1dFJlc3BvbnNlcyk7Cgl9CglyZXR1cm4gbi5sZW5ndGggPiAwICYmICh0LmlucHV0UmVzcG9uc2VzID0gbiksIHQ7Cn0KLy8jZW5kcmVnaW9uCi8vI3JlZ2lvbiBkaXN0L3NyYy9leGVjdXRpb24vcm91dGUtY2hpbGQtZGVsaXZlcnkuanMKYXN5bmMgZnVuY3Rpb24gcm91dGVEZWxpdmVyVG9DaGlsZHJlbihlKSB7CglsZXQgdCA9IGNvYWxlc2NlRGVsaXZlclBheWxvYWRzKGUucGF5bG9hZHMpOwoJcmV0dXJuIGUuc2Vzc2lvblN0YXRlLmhhc1Byb3h5SW5wdXRSZXF1ZXN0cyA/IChhd2FpdCByb3V0ZVByb3hpZWREZWxpdmVyU3RlcCh7CgkJYXV0aDogZS5hdXRoLAoJCXBhcmVudFdyaXRhYmxlOiBlLnBhcmVudFdyaXRhYmxlLAoJCXBheWxvYWQ6IHQsCgkJc2Vzc2lvblN0YXRlOiBlLnNlc3Npb25TdGF0ZQoJfSkpLnJlbWFpbmRlciA6IHQ7Cn0KLy8jZW5kcmVnaW9uCi8vI3JlZ2lvbiBkaXN0L3NyYy9leGVjdXRpb24vc3ViYWdlbnQtZXZlbnQtcHJveHktc3RlcC5qcwp2YXIgcnVuUHJveHlTdWJhZ2VudEV2ZW50U3RlcCA9IGdsb2JhbFRoaXNbU3ltYm9sLmZvcigiV09SS0ZMT1dfVVNFX1NURVAiKV0oInN0ZXAvL2V2ZUAwLjI0LjYvL3J1blByb3h5U3ViYWdlbnRFdmVudFN0ZXAiKTsKLy8jZW5kcmVnaW9uCi8vI3JlZ2lvbiBkaXN0L3NyYy9leGVjdXRpb24vdHVybi1jYW5jZWxsYXRpb24tdG9rZW4uanMKZnVuY3Rpb24gc2Vzc2lvbkNhbmNlbEhvb2tUb2tlbihlKSB7CglyZXR1cm4gYCR7ZX06Y2FuY2VsYDsKfQovLyNlbmRyZWdpb24KLy8jcmVnaW9uIGRpc3Qvc3JjL2hhcm5lc3MvdHVybi1jYW5jZWxsYXRpb24uanMKY29uc3QgVFVSTl9DQU5DRUxMRURfRVJST1JfTkFNRSA9IGBUdXJuQ2FuY2VsbGVkRXJyb3JgOwp2YXIgVHVybkNhbmNlbGxlZEVycm9yID0gY2xhc3MgZXh0ZW5kcyBFcnJvciB7Cgljb25zdHJ1Y3Rvcih0ID0gYFRoZSB0dXJuIHdhcyBjYW5jZWxsZWQuYCkgewoJCXN1cGVyKHQpLCB0aGlzLm5hbWUgPSBUVVJOX0NBTkNFTExFRF9FUlJPUl9OQU1FOwoJfQp9OwovLyNlbmRyZWdpb24KLy8jcmVnaW9uIGRpc3Qvc3JjL2V4ZWN1dGlvbi90dXJuLWNhbmNlbGxhdGlvbi1jb250cm9sLmpzCmFzeW5jIGZ1bmN0aW9uIGNyZWF0ZVR1cm5DYW5jZWxsYXRpb25Db250cm9sKHIpIHsKCWxldCBpID0gY3JlYXRlSG9vayh7IHRva2VuOiBzZXNzaW9uQ2FuY2VsSG9va1Rva2VuKHIuc2Vzc2lvbklkKSB9KSwgYSA9IGlbU3ltYm9sLmFzeW5jSXRlcmF0b3JdKCk7Cgl0cnkgewoJCWF3YWl0IGNsYWltSG9va093bmVyc2hpcChpKTsKCX0gY2F0Y2ggKGUpIHsKCQlpZiAoaXNIb29rQ29uZmxpY3RFcnJvcihlKSkgcmV0dXJuOwoJCXRocm93IGU7Cgl9CglsZXQgbyA9IG5ldyBBYm9ydENvbnRyb2xsZXIoKSwgcyA9IGNvbnN1bWVNYXRjaGluZ0NhbmNlbChhLCByLmV4cGVjdGVkVHVybklkKS50aGVuKCgpID0+IChvLmFib3J0KG5ldyBUdXJuQ2FuY2VsbGVkRXJyb3IoKSksIGBjYW5jZWxgKSksIGMgPSAhMTsKCXJldHVybiB7CgkJc2lnbmFsOiBvLnNpZ25hbCwKCQlyZXF1ZXN0ZWQ6IHMsCgkJYXN5bmMgZGlzcG9zZSgpIHsKCQkJYyB8fCAoYyA9ICEwLCBhd2FpdCBkaXNwb3NlSG9vayhpKSk7CgkJfQoJfTsKfQphc3luYyBmdW5jdGlvbiBjb25zdW1lTWF0Y2hpbmdDYW5jZWwoZSwgdCkgewoJZm9yICg7OykgewoJCWxldCBuID0gYXdhaXQgZS5uZXh0KCk7CgkJaWYgKG4uZG9uZSkgcmV0dXJuIGF3YWl0IG5ldyBQcm9taXNlKCgpID0+IHt9KTsKCQlpZiAobWF0Y2hlc0FjdGl2ZVR1cm4obi52YWx1ZSwgdCkpIHJldHVybjsKCX0KfQpmdW5jdGlvbiBtYXRjaGVzQWN0aXZlVHVybihlLCB0KSB7CglpZiAodHlwZW9mIGUgIT0gYG9iamVjdGAgfHwgIWUpIHJldHVybiAhMDsKCWxldCBuID0gZS50dXJuSWQ7CglyZXR1cm4gbiA9PT0gdm9pZCAwIHx8IG4gPT09IHQ7Cn0KLy8jZW5kcmVnaW9uCi8vI3JlZ2lvbiBkaXN0L3NyYy9leGVjdXRpb24vdHVybi1leGVjdXRpb24tY3Vyc29yLmpzCnZhciBUdXJuRXhlY3V0aW9uQ3Vyc29yID0gY2xhc3MgewoJY29udHJvbFRva2VuOwoJcGFyZW50V3JpdGFibGU7CgljdXJyZW50U2VyaWFsaXplZENvbnRleHQ7CgljdXJyZW50U2Vzc2lvblN0YXRlOwoJbGFzdFJlcG9ydGVkQ29udGludWF0aW9uVG9rZW47Cgljb25zdHJ1Y3RvcihlKSB7CgkJdGhpcy5jb250cm9sVG9rZW4gPSBlLmNvbnRyb2xUb2tlbiwgdGhpcy5jdXJyZW50U2VyaWFsaXplZENvbnRleHQgPSBlLnNlcmlhbGl6ZWRDb250ZXh0LCB0aGlzLmN1cnJlbnRTZXNzaW9uU3RhdGUgPSBlLnNlc3Npb25TdGF0ZSwgdGhpcy5sYXN0UmVwb3J0ZWRDb250aW51YXRpb25Ub2tlbiA9IGUuc2Vzc2lvblN0YXRlLmNvbnRpbnVhdGlvblRva2VuLCB0aGlzLnBhcmVudFdyaXRhYmxlID0gZS5wYXJlbnRXcml0YWJsZTsKCX0KCWdldCBzZXJpYWxpemVkQ29udGV4dCgpIHsKCQlyZXR1cm4gdGhpcy5jdXJyZW50U2VyaWFsaXplZENvbnRleHQ7Cgl9CglnZXQgc2Vzc2lvblN0YXRlKCkgewoJCXJldHVybiB0aGlzLmN1cnJlbnRTZXNzaW9uU3RhdGU7Cgl9Cglhc3luYyBhZG9wdChlKSB7CgkJdGhpcy5zZXRTdGF0ZShlKTsKCQlsZXQgdCA9IGUuc2Vzc2lvblN0YXRlLmNvbnRpbnVhdGlvblRva2VuOwoJCXQgPT09IGBgIHx8IHQgPT09IHRoaXMubGFzdFJlcG9ydGVkQ29udGludWF0aW9uVG9rZW4gfHwgKHRoaXMubGFzdFJlcG9ydGVkQ29udGludWF0aW9uVG9rZW4gPSB0LCBhd2FpdCB0aGlzLnNlbmQoewoJCQljb250aW51YXRpb25Ub2tlbjogdCwKCQkJa2luZDogYHR1cm4tY29udGludWF0aW9uLXRva2VuYAoJCX0pKTsKCX0KCWNyZWF0ZVN0ZXBJbnB1dChlLCB0KSB7CgkJcmV0dXJuIHsKCQkJYWJvcnRTaWduYWw6IHQsCgkJCWlucHV0OiBlLAoJCQlwYXJlbnRXcml0YWJsZTogdGhpcy5wYXJlbnRXcml0YWJsZSwKCQkJc2VyaWFsaXplZENvbnRleHQ6IHRoaXMuY3VycmVudFNlcmlhbGl6ZWRDb250ZXh0LAoJCQlzZXNzaW9uU3RhdGU6IHRoaXMuY3VycmVudFNlc3Npb25TdGF0ZQoJCX07Cgl9Cglhc3luYyBmaW5pc2goZSwgdCwgbikgewoJCXRoaXMuc2V0U3RhdGUoZSksIGF3YWl0IHRoaXMuc2VuZCh7CgkJCWFjdGlvbjogewoJCQkJLi4udCwKCQkJCXNlcmlhbGl6ZWRDb250ZXh0OiB0aGlzLmN1cnJlbnRTZXJpYWxpemVkQ29udGV4dCwKCQkJCXNlc3Npb25TdGF0ZTogdGhpcy5jdXJyZW50U2Vzc2lvblN0YXRlCgkJCX0sCgkJCWJ1",
	"ZmZlcmVkRGVsaXZlcmllczogbi5sZW5ndGggPT09IDAgPyB2b2lkIDAgOiBbLi4ubl0sCgkJCWtpbmQ6IGB0dXJuLXJlc3VsdGAKCQl9KTsKCX0KCWFzeW5jIHNlbmQodCkgewoJCWF3YWl0IHNlbmRUdXJuQ29udHJvbFN0ZXAoewoJCQljb250cm9sVG9rZW46IHRoaXMuY29udHJvbFRva2VuLAoJCQlwYXlsb2FkOiB0CgkJfSk7Cgl9CglzZXRTdGF0ZShlKSB7CgkJdGhpcy5jdXJyZW50U2VyaWFsaXplZENvbnRleHQgPSBlLnNlcmlhbGl6ZWRDb250ZXh0ID8/IHRoaXMuY3VycmVudFNlcmlhbGl6ZWRDb250ZXh0LCB0aGlzLmN1cnJlbnRTZXNzaW9uU3RhdGUgPSBlLnNlc3Npb25TdGF0ZTsKCX0KfTsKLy8jZW5kcmVnaW9uCi8vI3JlZ2lvbiBkaXN0L3NyYy9oYXJuZXNzL2FjdGl2ZS10dXJuLWlkLmpzCmZ1bmN0aW9uIGFjdGl2ZVR1cm5JZChlKSB7CglyZXR1cm4gZS50dXJuSWQgPT09IGBgID8gYHR1cm5fJHtlLnNlcXVlbmNlfWAgOiBlLnR1cm5JZDsKfQovLyNlbmRyZWdpb24KLy8jcmVnaW9uIGRpc3Qvc3JjL2V4ZWN1dGlvbi90dXJuLXdvcmtmbG93LmpzCmNvbnN0IFRBU0tfTU9ERV9XQUlUX0VSUk9SX01FU1NBR0UgPSAiVGFzayBtb2RlIGNhbm5vdCB3YWl0IGZvciBmb2xsb3ctdXAgaW5wdXQgKGBuZXh0OiBudWxsYCkuIjsKZnVuY3Rpb24gY2FuU2V0dGxlQ2FuY2VsbGVkVHVybkFzUGFyayhlKSB7CglyZXR1cm4gZS5tb2RlID09PSBgY29udmVyc2F0aW9uYCB8fCBlLnN0ZXBJbnB1dC5zZXNzaW9uU3RhdGUuY29udGludWF0aW9uVG9rZW4gIT09IGBgOwp9CmFzeW5jIGZ1bmN0aW9uIHR1cm5Xb3JrZmxvdyhlKSB7CglsZXQgdCA9IG1pZ3JhdGVUdXJuV29ya2Zsb3dJbnB1dChlKTsKCXJldHVybiB0LmRyaXZlckNhcGFiaWxpdGllcz8udHVybkluYm94ID09PSAhMCA/IHJ1blR1cm5Pd25lZFdvcmtmbG93KHQpIDogcnVuTGVnYWN5VHVybldvcmtmbG93KHQpOwp9CmFzeW5jIGZ1bmN0aW9uIHJ1blR1cm5Pd25lZFdvcmtmbG93KGUpIHsKCWxldCBjID0gY3JlYXRlSG9vayh7IHRva2VuOiBgJHtlLmNvbXBsZXRpb25Ub2tlbn06aW5ib3hgIH0pLCBsID0gY1tTeW1ib2wuYXN5bmNJdGVyYXRvcl0oKSwgdSA9IG5ldyBUdXJuRXhlY3V0aW9uQ3Vyc29yKHsKCQljb250cm9sVG9rZW46IGUuY29tcGxldGlvblRva2VuLAoJCXBhcmVudFdyaXRhYmxlOiBlLnN0ZXBJbnB1dC5wYXJlbnRXcml0YWJsZSwKCQlzZXJpYWxpemVkQ29udGV4dDogZS5zdGVwSW5wdXQuc2VyaWFsaXplZENvbnRleHQsCgkJc2Vzc2lvblN0YXRlOiBlLnN0ZXBJbnB1dC5zZXNzaW9uU3RhdGUKCX0pLCBkID0gMCwgbmV4dERlbGl2ZXJ5UmVxdWVzdElkID0gKCkgPT4gYCR7Yy50b2tlbn06ZGVsaXZlcnk6JHtTdHJpbmcoZCsrKX1gLCBmID0gW10sIHAgPSBlLnN0ZXBJbnB1dC5pbnB1dCwgbSA9ICExLCBoOwoJdHJ5IHsKCQl0cnkgewoJCQlhd2FpdCBjbGFpbUhvb2tPd25lcnNoaXAoYyksIG0gPSAhMDsKCQl9IGNhdGNoIChlKSB7CgkJCWlmIChpc0hvb2tDb25mbGljdEVycm9yKGUpKSByZXR1cm47CgkJCXRocm93IGU7CgkJfQoJCWZvciAoZS5kcml2ZXJDYXBhYmlsaXRpZXM/LmNhbmNlbGxlZFR1cm5TZXR0bGUgPT09ICEwICYmIGNhblNldHRsZUNhbmNlbGxlZFR1cm5Bc1BhcmsoZSkgJiYgKGggPSBhd2FpdCBjcmVhdGVUdXJuQ2FuY2VsbGF0aW9uQ29udHJvbCh7CgkJCWV4cGVjdGVkVHVybklkOiBhY3RpdmVUdXJuSWQoZS5zdGVwSW5wdXQuc2Vzc2lvblN0YXRlLmVtaXNzaW9uU3RhdGUpLAoJCQlzZXNzaW9uSWQ6IGUuc3RlcElucHV0LnNlc3Npb25TdGF0ZS5zZXNzaW9uSWQKCQl9KSk7OykgewoJCQlsZXQgaSA9IGF3YWl0IHR1cm5TdGVwKHUuY3JlYXRlU3RlcElucHV0KHAsIGg/LnNpZ25hbCkpOwoJCQlpZiAoaS5hY3Rpb24gPT09IGBjYW5jZWxsZWRgKSB7CgkJCQlhd2FpdCBjYW5jZWxEZXNjZW5kYW50VHVybnNTdGVwKHsKCQkJCQlzZXJpYWxpemVkQ29udGV4dDogdS5zZXJpYWxpemVkQ29udGV4dCwKCQkJCQlzZXNzaW9uU3RhdGU6IHUuc2Vzc2lvblN0YXRlCgkJCQl9KSwgYXdhaXQgaD8uZGlzcG9zZSgpLCBhd2FpdCB1LmZpbmlzaCh7IHNlc3Npb25TdGF0ZTogdS5zZXNzaW9uU3RhdGUgfSwgewoJCQkJCWNhbmNlbGxlZDogITAsCgkJCQkJa2luZDogYHBhcmtgCgkJCQl9LCBmKTsKCQkJCXJldHVybjsKCQkJfQoJCQlpZiAoaS5hY3Rpb24gPT09IGBkb25lYCkgewoJCQkJYXdhaXQgaD8uZGlzcG9zZSgpLCBhd2FpdCB1LmZpbmlzaChpLCB7CgkJCQkJa2luZDogYGRvbmVgLAoJCQkJCW91dHB1dDogaS5vdXRwdXQgPz8gYGAsCgkJCQkJaXNFcnJvcjogaS5pc0Vycm9yLAoJCQkJCXVzYWdlOiBpLnVzYWdlCgkJCQl9LCBmKTsKCQkJCXJldHVybjsKCQkJfQoJCQlsZXQgbyA9IGkuYWN0aW9uID09PSBgZGlzcGF0Y2gtd29ya2Zsb3ctcnVudGltZS1hY3Rpb25zYCB8fCBpLmFjdGlvbiA9PT0gYHBhcmtgID8gaS5wZW5kaW5nUnVudGltZUFjdGlvbktleXMgOiB2b2lkIDA7CgkJCWlmIChvICE9PSB2b2lkIDApIHsKCQkJCWF3YWl0IHUuYWRvcHQoaSk7CgkJCQlsZXQgZSA9IGF3YWl0IChpLmFjdGlvbiA9PT0gYGRpc3BhdGNoLXdvcmtmbG93LXJ1bnRpbWUtYWN0aW9uc2AgPyBkaXNwYXRjaFdvcmtmbG93UnVudGltZUFjdGlvbnNTdGVwIDogZGlzcGF0Y2hSdW50aW1lQWN0aW9uc1N0ZXApKHsKCQkJCQljYWxsYmFja0Jhc2VVcmw6IHJlc29sdmVXb3JrZmxvd0NhbGxiYWNrQmFzZVVybChnZXRXb3JrZmxvd01ldGFkYXRhKCkudXJsKSwKCQkJCQlwYXJlbnRDb250aW51YXRpb25Ub2tlbjogYy50b2tlbiwKCQkJCQlwYXJlbnRXcml0YWJsZTogdS5wYXJlbnRXcml0YWJsZSwKCQkJCQlzZXJpYWxpemVkQ29udGV4dDogdS5zZXJpYWxpemVkQ29udGV4dCwKCQkJCQlzZXNzaW9uU3RhdGU6IHUuc2Vzc2lvblN0YXRlCgkJCQl9KTsKCQkJCWF3YWl0IHUuYWRvcHQoZSk7CgkJCQlsZXQgciA9IGF3YWl0IHdhaXRGb3JSdW50aW1lQWN0aW9uUmVzdWx0cyh7CgkJCQkJYnVmZmVyZWREZWxpdmVyaWVzOiBmLAoJCQkJCWNhbmNlbGxhdGlvbjogaCwKCQkJCQljdXJzb3I6IHUsCgkJCQkJaW5ib3hUb2tlbjogYy50b2tlbiwKCQkJCQlpbml0aWFsUmVzdWx0czogZS5yZXN1bHRzLAoJCQkJCWl0ZXJhdG9yOiBsLAoJCQkJCW5leHREZWxpdmVyeVJlcXVlc3RJZCwKCQkJCQlwZW5kaW5nQWN0aW9uS2V5czogbwoJCQkJfSk7CgkJCQlpZiAociA9PT0gYGNhbmNlbGxlZGApIHsKCQkJCQlwID0gdm9pZCAwOwoJCQkJCWNvbnRpbnVlOwoJCQkJfQoJCQkJcCA9IHsKCQkJCQlraW5kOiBgcnVudGltZS1hY3Rpb24tcmVzdWx0YCwKCQkJCQlyZXN1bHRzOiByCgkJCQl9OwoJCQkJY29udGludWU7CgkJCX0KCQkJaWYgKGkuYWN0aW9uID09PSBgcGFya2ApIHsKCQkJCWlmICghKGkuaGFzUGVuZGluZ0F1dGhvcml6YXRpb24gfHwgaS5oYXNQZW5kaW5nSW5wdXRCYXRjaCAmJiBlLmNhcGFiaWxpdGllcz8ucmVxdWVzdElucHV0ID09PSAhMCB8fCBlLm1vZGUgPT09IGBjb252ZXJzYXRpb25gKSkgdGhyb3cgRXJyb3IoVEFTS19NT0RFX1dBSVRfRVJST1JfTUVTU0FHRSk7CgkJCQlhd2FpdCBoPy5kaXNwb3NlKCksIGF3YWl0IHUuZmluaXNoKGksIHsKCQkJCQlhdXRob3JpemF0aW9uTmFtZXM6IGkuYXV0aG9yaXphdGlvbk5hbWVzLAoJCQkJCWtpbmQ6IGBwYXJrYAoJCQkJfSwgZik7CgkJCQlyZXR1cm47CgkJCX0KCQkJYXdhaXQgdS5hZG9wdChpKSwgcCA9IHZvaWQgMDsKCQl9Cgl9IGNhdGNoIChlKSB7CgkJdGhyb3cgYXdhaXQgdS5zZW5kKHsKCQkJZXJyb3I6IG5vcm1hbGl6ZVNlcmlhbGl6YWJsZUVycm9yKGUpLAoJCQlraW5kOiBgdHVybi1lcnJvcmAKCQl9KSwgZTsKCX0gZmluYWxseSB7CgkJaCAhPT0gdm9pZCAwICYmIGF3YWl0IGguZGlzcG9zZSgpLCBtICYmIGF3YWl0IGRpc3Bvc2VIb29rKGMpOwoJfQp9CmFzeW5jIGZ1bmN0aW9uIHdhaXRGb3JSdW50aW1lQWN0aW9uUmVzdWx0cyh0KSB7CglsZXQgbiwgciA9IFsuLi50LmluaXRpYWxSZXN1bHRzXTsKCWZvciAoOzspIHsKCQlsZXQgaSA9IHJlc29sdmVSdW50aW1lQWN0aW9uUmVzdWx0c0ZvcktleXMoewoJCQlwZW5kaW5nS2V5czogdC5wZW5kaW5nQWN0aW9uS2V5cywKCQkJcmVzdWx0czogcgoJCX0pOwoJCWlmIChpICE9PSB2b2lkIDApIHJldHVybiBuICE9PSB2b2lkIDAgJiYgYXdhaXQgdC5jdXJzb3Iuc2VuZCh7CgkJCWtpbmQ6IGB0dXJuLWRlbGl2ZXJ5LWNhbmNlbGxlZGAsCgkJCXJlcXVlc3RJZDogbgoJCX0pLCBpOwoJCXQuY3Vyc29yLnNlc3Npb25TdGF0ZS5oYXNQcm94eUlucHV0UmVxdWVzdHMgJiYgbiA9PT0gdm9pZCAwICYmIChuID0gdC5uZXh0RGVsaXZlcnlSZXF1ZXN0SWQoKSwgYXdhaXQgdC5jdXJzb3Iuc2VuZCh7CgkJCWNvbnRpbnVhdGlvblRva2VuOiB0LmN1cnNvci5zZXNzaW9uU3RhdGUuY29udGludWF0aW9uVG9rZW4sCgkJCWluYm94VG9rZW46IHQuaW5ib3hUb2tlbiwKCQkJa2luZDogYHR1cm4tZGVsaXZlcnktcmVxdWVzdGAsCgkJCXJlcXVlc3RJZDogbgoJCX0pKTsKCQlsZXQgYSA9IHQuaXRlcmF0b3IubmV4dCgpOwoJCWEuY2F0Y2goKCkgPT4ge30pOwoJCWxldCBvID0gYXdhaXQgKHQuY2FuY2VsbGF0aW9uID09PSB2b2lkIDAgPyBhIDogUHJvbWlzZS5yYWNlKFthLCB0LmNhbmNlbGxhdGlvbi5yZXF1ZXN0ZWRdKSk7CgkJaWYgKG8gPT09IGBjYW5jZWxgKSByZXR1cm4gbiAhPT0gdm9pZCAwICYmIGF3YWl0IHQuY3Vyc29yLnNlbmQoewoJCQlraW5kOiBgdHVybi1kZWxpdmVyeS1jYW5jZWxsZWRgLAoJCQlyZXF1ZXN0SWQ6IG4KCQl9KSwgYGNhbmNlbGxlZGA7CgkJaWYgKG8uZG9uZSkgdGhyb3cgRXJyb3IoYFR1cm4gaW5ib3ggY2xvc2VkIGJlZm9yZSBydW50aW1lIGFjdGlvbnMgY29tcGxldGVkLmApOwoJCWxldCBzID0gby52YWx1ZTsKCQlpZiAocy5raW5kID09PSBgcnVudGltZS1hY3Rpb24tcmVzdWx0YCkgewoJCQlyLnB1c2goLi4ucy5yZXN1bHRzKTsKCQkJY29udGludWU7CgkJfQoJCWlmIChzLmtpbmQgPT09IGBzdWJhZ2VudC1pbnB1dC1yZXF1ZXN0YCB8fCBzLmtpbmQgPT09IGBzdWJhZ2VudC1hdXRob3JpemF0aW9uLWV2ZW50YCkgewoJCQlsZXQgZSA9IGF3YWl0IHJ1blByb3h5U3ViYWdlbnRFdmVudFN0ZXAoewoJCQkJaG9va1BheWxvYWQ6IHMsCgkJCQlwYXJlbnRXcml0YWJsZTogdC5jdXJzb3IucGFyZW50V3JpdGFibGUsCgkJCQlzZXJpYWxpemVkQ29udGV4dDogdC5jdXJzb3Iuc2VyaWFsaXplZENvbnRleHQsCgkJCQlzZXNzaW9uU3RhdGU6IHQuY3Vyc29yLnNlc3Npb25TdGF0ZQoJCQl9KTsKCQkJYXdhaXQgdC5jdXJzb3IuYWRvcHQoZSk7CgkJCWNvbnRpbnVlOwoJCX0KCQlpZiAocy5raW5kID09PSBgZHJpdmVyLWRlbGl2ZXJ5YCAmJiBzLnJlcXVlc3RJZCA9PT0gbikgewoJCQlhd2FpdCB0LmN1cnNvci5zZW5kKHsKCQkJCWtpbmQ6IGB0dXJuLWRlbGl2ZXJ5LWFjY2VwdGVkYCwKCQkJCXJlcXVlc3RJZDogcy5yZXF1ZXN0SWQKCQkJfSksIG4gPSB2b2lkIDA7CgkJCWxldCBlID0gYXdhaXQgcm91dGVEZWxpdmVyVG9DaGlsZHJlbih7CgkJCQlhdXRoOiBzLmRlbGl2ZXJ5LmF1dGgsCgkJCQlwYXJlbnRXcml0YWJsZTogdC5jdXJzb3IucGFyZW50V3JpdGFibGUsCgkJCQlwYXlsb2Fkczogcy5kZWxpdmVyeS5wYXlsb2FkcywKCQkJCXNlc3Npb25TdGF0ZTogdC5jdXJzb3Iuc2Vzc2lvblN0YXRlCgkJCX0pOwoJCQllICE9PSB2b2lkIDAgJiYgdC5idWZmZXJlZERlbGl2ZXJpZXMucHVzaCh7CgkJCQkuLi5zLmRlbGl2ZXJ5LAoJCQkJcGF5bG9hZHM6IFtlXQoJCQl9KTsKCQl9Cgl9Cn0KYXN5bmMgZnVuY3Rpb24gcnVuTGVnYWN5VHVybldvcmtmbG93KGUpIHsKCWxldCB0ID0gZS5zdGVwSW5wdXQ7Cgl0cnkgewoJCWZvciAoOzspIHsKCQkJbGV0IG4gPSBhd2FpdCB0dXJuU3RlcCh0KTsKCQkJaWYgKG4uYWN0aW9uID09PSBgZG9uZWApIHsKCQkJCWF3YWl0IHNlbmRUdXJuQ29udHJvbFN0ZXAoewoJCQkJCWNvbnRyb2xUb2tlbjogZS5jb21wbGV0aW9uVG9rZW4sCgkJCQkJcGF5bG9hZDogewoJCQkJCQlhY3Rpb246IHsKCQkJCQkJCWtpbmQ6IGBkb25lYCwKCQkJCQkJCW91dHB1dDogbi5vdXRwdXQgPz8gYGAsCgkJCQkJCQlpc0Vycm9yOiBuLmlzRXJyb3IsCgkJCQkJCQlzZXJpYWxpemVkQ29udGV4dDogbi5zZXJpYWxpemVkQ29udGV4dCwKCQkJCQkJCXNlc3Npb25TdGF0ZTogbi5zZXNzaW9uU3RhdGUsCgkJCQkJCQl1c2FnZTogbi51c2FnZQoJCQkJCQl9LAoJCQkJCQlraW5kOiBgdHVybi1yZXN1bHRgCgkJCQkJfQoJCQkJfSk7CgkJCQlyZXR1cm47CgkJCX0KCQkJaWYgKG4uYWN0aW9uID09PSBgZGlzcGF0Y2gtd29ya2Zsb3ctcnVudGltZS1hY3Rpb25zYCkgewoJCQkJYXdhaXQgc2VuZFR1cm5Db250cm9sU3RlcCh7CgkJCQkJY29udHJvbFRva2VuOiBlLmNvbXBsZXRpb25Ub2tlbiwKCQkJCQlwYXlsb2FkOiB7CgkJCQkJCWFjdGlvbjogewoJCQkJCQkJa2luZDogYGRpc3BhdGNoLXdvcmtmbG93LXJ1bnRpbWUtYWN0aW9uc2AsCgkJCQkJCQlwZW5kaW5nQWN0aW9uS2V5czogbi5wZW5kaW5nUnVudGltZUFjdGlvbktleXMsCgkJCQkJCQlzZXJpYWxpemVkQ29udGV4dDogbi5zZXJpYWxpemVkQ29udGV4dCwKCQkJCQkJCXNlc3Npb25TdGF0ZTogbi5zZXNzaW9uU3RhdGUKCQkJCQkJfSwKCQkJCQkJa2luZDogYHR1cm4tcmVzdWx0YAoJCQkJCX0KCQkJCX0pOwoJCQkJcmV0dXJuOwoJCQl9CgkJCWlmIChuLmFjdGlvbiA9PT0gYHBhcmtgKSB7CgkJCQlsZXQgdCA9IG4ucGVuZGluZ1J1bnRpbWVBY3Rpb25LZXlzOwoJCQkJaWYgKCEodCAhPT0gdm9pZCAwIHx8IG4uaGFzUGVuZGluZ0F1dGhvcml6YXRpb24gfHwgbi5oYXNQZW5kaW5nSW5wdXRCYXRjaCAmJiBlLmNhcGFiaWxpdGllcz8ucmVxdWVzdElucHV0ID09PSAhMCB8fCBlLm1vZGUgPT09IGBjb252ZXJzYXRpb25gKSkgdGhyb3cgRXJyb3IoVEFTS19NT0RFX1dBSVRfRVJST1JfTUVTU0FHRSk7CgkJCQlsZXQgciA9IHQgPT09IHZvaWQgMCA/IHsKCQkJCQlraW5kOiBgcGFya2AsCgkJCQkJc2VyaWFsaXplZENvbnRleHQ6IG4uc2VyaWFsaXplZENvbnRleHQsCgkJCQkJc2Vzc2lvblN0YXRlOiBuLnNlc3Npb25TdGF0ZSwKCQkJCQlhdXRob3JpemF0aW9uTmFtZXM6IG4uYXV0aG9yaXphdGlvbk5hbWVzCgkJCQl9IDogewoJCQkJCWtpbmQ6IGBkaXNwYXRjaC1ydW50aW1lLWFjdGlvbnNgLAoJCQkJCXBlbmRpbmdBY3Rpb25LZXlzOiB0LAoJCQkJCXNlcmlhbGl6ZWRDb250ZXh0OiBuLnNlcmlhbGl6ZWRDb250ZXh0LAoJCQkJCXNlc3Npb25TdGF0ZTogbi5zZXNzaW9uU3RhdGUKCQkJCX07CgkJCQlhd2FpdCBzZW5kVHVybkNvbnRyb2xTdGVwKHsKCQkJCQljb250cm9sVG9rZW46IGUuY29tcGxldGlvblRva2VuLAoJCQkJCXBheWxvYWQ6IHsKCQkJCQkJYWN0aW9uOiByLAoJCQkJCQlraW5kOiBgdHVybi1yZXN1bHRgCgkJCQkJfQoJCQkJfSk7CgkJCQlyZXR1cm47CgkJCX0KCQkJdCA9IHsKCQkJCWlucHV0OiB2b2lkIDAsCgkJCQlwYXJlbnRXcml0YWJsZTogdC5wYXJlbnRXcml0YWJsZSwKCQkJCXNlcmlhbGl6ZWRDb250ZXh0OiBuLnNlcmlhbGl6ZWRDb250ZXh0LAoJCQkJc2Vzc2lvblN0YXRlOiBuLnNlc3Npb25TdGF0ZQoJCQl9OwoJCX0KCX0gY2F0Y2ggKHQpIHsKCQl0aHJvdyBhd2FpdCBzZW5kVHVybkNvbnRyb2xTdGVwKHsKCQkJY29udHJvbFRva2VuOiBlLmNvbXBsZXRpb25Ub2tlbiwKCQkJcGF5bG9hZDogewoJCQkJZXJyb3I6IG5vcm1hbGl6ZVNlcmlhbGl6YWJsZUVycm9yKHQpLAoJCQkJa2luZDogYHR1cm4tZXJyb3JgCgkJCX0KCQl9KSwgdDsKCX0KfQp0dXJuV29ya2Zsb3cud29ya2Zsb3dJZCA9ICJ3b3JrZmxvdy8vZXZlLy90dXJuV29ya2Zsb3ciOwpnbG9iYWxUaGlzLl9fcHJpdmF0ZV93b3JrZmxvd3Muc2V0KCJ3b3JrZmxvdy8vZXZlLy90dXJuV29ya2Zsb3ciLCB0dXJuV29ya2Zsb3cpOwovLyNlbmRyZWdpb24KLy8jcmVnaW9uIGRpc3Qvc3JjL2NvbnRleHQva2V5LmpzCmNvbnN0IEtFWV9SRUdJU1RSWV9HTE9CQUxfS0VZID0gU3ltYm9sLmZvcihgZXZlLmNvbnRleHQta2V5LXJlZ2lzdHJ5YCk7CmNvbnN0IGdsb2JhbEtleVJlZ2lzdHJ5Q29udGFpbmVyID0gZ2xvYmFsVGhpczsKZ2xvYmFsS2V5UmVnaXN0cnlDb250YWluZXJbS0VZX1JFR0lTVFJZX0dMT0JBTF9LRVldID09PSB2b2lkIDAgJiYgKGdsb2JhbEtleVJlZ2lzdHJ5Q29udGFpbmVyW0tFWV9SRUdJU1RSWV9HTE9CQUxfS0VZXSA9IG5ldyBNYXAoKSk7CmNvbnN0IGtleVJlZ2lzdHJ5ID0gZ2xvYmFsS2V5UmVnaXN0cnlDb250YWluZXJbS0VZX1JFR0lTVFJZX0dMT0JBTF9LRVldOwp2YXIgQ29udGV4dEtleSA9IGNsYXNzIHsKCW5hbWU7Cgljb2RlYzsKCWNvbnN0cnVjdG9yKGUsIHQgPSB7fSkgewoJCXRoaXMubmFtZSA9IGUsIHRoaXMuY29kZWMgPSB0LmNvZGVjOwoJCWxldCBuID0ga2V5UmVnaXN0cnkuZ2V0KGUpOwoJCWlmIChuICE9PSB2b2lkIDAgJiYgbi5jb2RlYyA9PT0gdm9pZCAwICE9ICh0aGlzLmNvZGVjID09PSB2b2lkIDApKSB0aHJvdyBFcnJvcihgQ29udGV4dEtleSBuYW1lIGNvbGxpc2lvbjogIiR7ZX0iIGlzIGFscmVhZHkgcmVnaXN0ZXJlZCAke24uY29kZWMgPyBgd2l0aGAgOiBgd2l0aG91dGB9IGEgY29kZWMsIGJ1dCBhIGtleSAke3RoaXMuY29kZWMgPyBgd2l0aGAgOiBgd2l0aG91dGB9IGEgY29kZWMgaXMgYmVpbmcgcmVnaXN0ZXJlZCB1bmRlciB0aGUgc2FtZSBuYW1lLiBUaGlzIHNpbGVudGx5IGJyZWFrcyBjb250ZXh0IHNlcmlhbGl6YXRpb24g4oCUIHVzZSBhIGRpc3RpbmN0IG5hbWUuYCk7CgkJa2V5UmVnaXN0cnkuc2V0KGUsIHRoaXMpOwoJfQp9OwpuZXcgQ29udGV4dEtleShgZXZlLmF1dGhgKTsKbmV3IENvbnRleHRLZXkoYGV2ZS5pbml0aWF0b3JBdXRoYCk7Cm5ldyBDb250ZXh0S2V5KGBldmUuc2Vzc2lvbklkYCk7Cm5ldyBDb250ZXh0S2V5KGBldmUuY29udGludWF0aW9uVG9rZW5gKTsKY29uc3QgQ2hhbm5lbFJlcXVlc3RJZEtleSA9IG5ldyBDb250ZXh0S2V5KGBldmUuY2hhbm5lbFJlcXVlc3RJZGApOwpuZXcgQ29udGV4dEtleShgZXZlLmNoYW5uZWxJbnN0cnVtZW50YXRpb25gKTsKbmV3IENvbnRleHRLZXkoYGV2ZS5tb2RlYCk7Cm5ldyBDb250ZXh0S2V5KGBldmUucGFyZW50U2Vzc2lvbmApOwpjb25zdCBTdWJhZ2VudERlcHRoS2V5ID0gbmV3IENvbnRleHRLZXkoYGV2ZS5zdWJhZ2VudERlcHRoYCk7Cm5ldyBDb250ZXh0S2V5KGBldmUuY2FwYWJpbGl0aWVzYCk7Cm5ldyBDb250ZXh0S2V5KGBldmUuc2Vzc2lvbkNhbGxiYWNrYCk7Cm5ldyBDb250ZXh0S2V5KGBldmUuc2Vzc2lvbmApOwpuZXcgQ29udGV4dEtleShgZXZlLnNhbmRib3hgKTsKbmV3IENvbnRleHRLZXkoYGV2ZS5zZXNzaW9uRHluYW1pY01vZGVsUmVmZXJlbmNlYCk7Cm5ldyBDb250ZXh0S2V5KGBldmUudHVybkR5bmFtaWNNb2RlbFJlZmVyZW5jZWApOwpuZXcgQ29udGV4dEtleShgZXZlLmxpdmVTdGVwRHluYW1pY01vZGVsU2VsZWN0aW9uYCk7Cm5ldyBDb250ZXh0S2V5KGBldmUuc2Vzc2lvbkR5bmFtaWNUb29sTWV0YWRhdGFgKTsKbmV3IENvbnRleHRLZXkoYGV2ZS50dXJuRHluYW1pY1Rvb2xNZXRhZGF0YWApOwpuZXcgQ29udGV4dEtleShgZXZlLmxpdmVTdGVwVG9vbHNgKTsKbmV3IENvbnRleHRLZXkoYGV2ZS5keW5hbWljU2tpbGxNYW5pZmVzdGApOwpuZXcgQ29udGV4dEtleShgZXZlLnNlc3Npb25EeW5hbWljSW5zdHJ1Y3Rpb25zYCk7Cm5ldyBDb250ZXh0S2V5KGBldmUudHVybkR5bmFtaWNJbnN0cnVjdGlvbnNgKTsKLy8jZW5kcmVnaW9uCi8vI3JlZ2lvbiBkaXN0L3NyYy9oYXJuZXNzL3N1YmFnZW50LWRlcHRoLmpzCmZ1bmN0aW9uIHJlYWRTZXJpYWxpemVkU3ViYWdlbnREZXB0aCh0KSB7CglsZXQgbiA9IHBhcnNlU3ViYWdlbnREZXB0aCh0W1N1YmFnZW50RGVwdGhLZXkubmFtZV0pOwoJcmV0dXJuIG4gPT09IDAgPyB2b2lkIDAgOiBuOwp9CmZ1bmN0aW9uIHBhcnNlU3ViYWdlbnREZXB0aChlKSB7CglyZXR1cm4gdHlwZW9mIGUgPT0gYG51bWJlcmAgJiYgTnVtYmVyLmlzSW50ZWdlcihlKSAmJiBlID4gMCA/IGUgOiAwOwp9Ci8vI2VuZHJlZ2lvbgovLyNyZWdpb24gZGlzdC9zcmMvaGFybmVzcy9tZXNzYWdlcy5qcwpmdW5jdGlvbiBjb2FsZXNjZURlbGl2ZXJpZXMoZSkgewoJbGV0IFt0LCAuLi5uXSA9IGU7CglpZiAodCA9PT0gdm9pZCAwKSB0aHJvdyBFcnJvcihgQ2Fubm90IGNvYWxlc2NlIGFuIGVtcHR5IGRlbGl2ZXJ5IGJhdGNoLmApOwoJbGV0IHIgPSB0LmF1dGgsIGkgPSBbLi4udC5wYXlsb2Fkc107Cglmb3IgKGxldCBlIG9mIG4pIGUuYXV0aCAhPT0gdm9pZCAwICYmIChyID0gZS5hdXRoKSwgaS5wdXNoKC4uLmUucGF5bG9hZHMpOwoJcmV0dXJuIHsKCQkuLi50LAoJCWF1dGg6IHIsCgkJcGF5bG9hZHM6IGkKCX07Cn0KLy8jZW5kcmVnaW9uCi8vI3JlZ2lvbiBkaXN0L3NyYy9leGVjdXRpb24vZXZlLXdvcmtmbG93LWF0dHJpYnV0ZXMuanMKZnVuY3Rpb24gcmVhZFBhcmVudExpbmVhZ2UoZSkgewoJbGV0IG4gPSBlW2BldmUucGFyZW50U2Vzc2lvbmBdLCByID0gbj8uY2FsbElkLCBpID0gbj8ucm9vdFNlc3Npb25JZCwgYSA9IG4/LnNlc3Npb25JZCwgbyA9IG4/LnR1cm4/LmlkOwoJcmV0dXJuIHsKCQljYWxsSWQ6IGlzTm9uRW1wdHlTdHJpbmcocikgPyByIDogdm9pZCAwLAoJCXJvb3RTZXNzaW9uSWQ6IGlzTm9uRW1wdHlTdHJpbmcoaSkgPyBpIDogdm9pZCAwLAoJCXNlc3Npb25JZDogaXNOb25FbXB0eVN0cmluZyhhKSA/IGEgOiB2b2lkIDAsCgkJdHVybklkOiBpc05vbkVtcHR5U3RyaW5nKG8pID8gbyA6IHZvaWQgMAoJfTsKfQpmdW5jdGlvbiByZWFkUm9vdFNlc3Npb25JZChlKSB7CglyZXR1cm4gcmVhZFBhcmVudExpbmVhZ2UoZSkucm9vdFNlc3Npb25JZDsKfQpmdW5jdGlvbiByZWFkQ2hhbm5lbFJlcXVlc3RJZChuKSB7CglsZXQgciA9IG5bQ2hhbm5lbFJlcXVlc3RJZEtleS5uYW1lXTsKCXJldHVybiBpc05vbkVtcHR5U3RyaW5nKHIpID8gciA6IHZvaWQgMDsKfQovLyNlbmRyZWdpb24KLy8jcmVnaW9uIGRpc3Qvc3JjL2V4ZWN1dGlvbi9kZWxlZ2F0ZWQtcGFyZW50LW5vdGlmaWNhdGlvbi5qcwp2YXIgbm90aWZ5RGVsZWdhdGVkUGFyZW50U3RlcCA9IGdsb2JhbFRoaXNbU3ltYm9sLmZvcigiV09SS0ZMT1dfVVNFX1NURVAiKV0oInN0ZXAvL2V2ZUAwLjI0LjYvL25vdGlmeURlbGVnYXRlZFBhcmVudFN0ZXAiKTsKLy8jZW5kcmVnaW9uCi8vI3JlZ2lvbiBkaXN0L3NyYy9leGVjdXRpb24vc3ViYWdlbnQtYWRhcHRlci5qcwpjb25zdCBTVUJBR0VOVF9BREFQVEVSX0tJTkQgPSBgc3ViYWdlbnRgOwpnbG9iYWxUaGlzW1N5bWJvbC5mb3IoIldPUktGTE9XX1VTRV9TVEVQIildKCJzdGVwLy9ldmVAMC4yNC42Ly9mb3J3YXJkU3ViYWdlbnRBdXRob3JpemF0aW9uRXZlbnRTdGVwIik7Cmdsb2JhbFRoaXNbU3ltYm9sLmZvcigiV09SS0ZMT1dfVVNFX1NURVAiKV0oInN0ZXAvL2V2ZUAwLjI0LjYvL2ZvcndhcmRTdWJhZ2VudElucHV0UmVxdWVzdFN0ZXAiKTsKLy8jZW5kcmVnaW9uCi8vI3JlZ2lvbiBkaXN0L3NyYy9leGVjdXRpb24vZGVsZWdhdGVkLXBhcmVudC1yZXN1bHQuanMKZnVuY3Rpb24gY3JlYXRlRGVsZWdhdGVkU3ViYWdlbnRTdWNjZXNzUmVzdWx0KGUsIG4pIHsKCWxldCByID0gZVtgZXZlLmNoYW5uZWxgXTsKCWlmIChyPy5raW5kID09PSBTVUJBR0VOVF9BREFQVEVSX0tJTkQpIHJldHVybiB7CgkJY2FsbElkOiBTdHJpbmcoci5zdGF0ZT8uY2FsbElkID8/IGBgKSwKCQlraW5kOiBgc3ViYWdlbnQtcmVzdWx0YCwKCQlvdXRwdXQ6IG4sCgkJc3ViYWdlbnROYW1lOiBTdHJpbmcoci5zdGF0ZT8uc3ViYWdlbnROYW1lID8/IGBgKQoJfTsKfQpmdW5jdGlvbiBjcmVhdGVEZWxlZ2F0ZWRTdWJhZ2VudEVycm9yUmVzdWx0KHQsIG4pIHsKCWxldCByID0gY3JlYXRlRGVsZWdhdGVkU3ViYWdlbnRTdWNjZXNzUmVzdWx0KHQsIGBgKTsKCWlmIChyICE9PSB2b2lkIDApIHJldHVybiB7CgkJLi4uciwKCQlpc0Vycm9yOiAhMCwKCQlvdXRwdXQ6IHsKCQkJY29kZTogYFNVQkFHRU5UX0VYRUNVVElPTl9GQUlMRURgLAoJCQltZXNzYWdlOiB0b0Vycm9yTWVzc2FnZShuKQoJCX0KCX07Cn0KLy8jZW5kcmVnaW9uCi8vI3JlZ2lvbiBkaXN0L3NyYy9leGVjdXRpb24vZm9yd2FyZC10dXJuLWRlbGl2ZXJ5LXN0ZXAuanMKdmFyIGZvcndhcmRUdXJuRGVsaXZlcnlTdGVwID0gZ2xvYmFsVGhpc1tTeW1ib2wuZm9yKCJXT1JLRkxPV19VU0VfU1RFUCIpXSgic3RlcC8vZXZlQDAuMjQuNi8vZm9yd2FyZFR1cm5EZWxpdmVyeVN0ZXAiKTsKLy8jZW5kcmVnaW9u",
	"Ci8vI3JlZ2lvbiBkaXN0L3NyYy9leGVjdXRpb24vdHVybi1jb250cm9sLXJlY2VpdmVyLmpzCnZhciBUdXJuQ29udHJvbFJlY2VpdmVyID0gY2xhc3MgewoJYnVmZmVyZWREZWxpdmVyaWVzOwoJY29udHJvbDsKCWNvbnRyb2xJdGVyYXRvcjsKCWRlbGl2ZXJ5SG9vazsKCXBlbmRpbmdDb250cm9sID0gbnVsbDsKCWNvbnN0cnVjdG9yKHQpIHsKCQl0aGlzLmJ1ZmZlcmVkRGVsaXZlcmllcyA9IHQuYnVmZmVyZWREZWxpdmVyaWVzLCB0aGlzLmNvbnRyb2wgPSBjcmVhdGVIb29rKHsgdG9rZW46IHQudG9rZW4gfSksIHRoaXMuY29udHJvbEl0ZXJhdG9yID0gdGhpcy5jb250cm9sW1N5bWJvbC5hc3luY0l0ZXJhdG9yXSgpLCB0aGlzLmRlbGl2ZXJ5SG9vayA9IHQuZGVsaXZlcnlIb29rOwoJfQoJZ2V0IHRva2VuKCkgewoJCXJldHVybiB0aGlzLmNvbnRyb2wudG9rZW47Cgl9Cglhc3luYyBkaXNwb3NlKCkgewoJCWF3YWl0IGNsb3NlSG9va0l0ZXJhdG9yKHRoaXMuY29udHJvbEl0ZXJhdG9yKSwgYXdhaXQgZGlzcG9zZUhvb2sodGhpcy5jb250cm9sKTsKCX0KCWFzeW5jIHdhaXRGb3JBY3Rpb24oKSB7CgkJZm9yICg7OykgewoJCQlsZXQgZSA9IGF3YWl0IHRoaXMubmV4dENvbnRyb2woYFR1cm4gY29udHJvbCBob29rIGNsb3NlZCBiZWZvcmUgZGVsaXZlcmluZyBhIHJlc3VsdC5gKSwgdCA9IHRoaXMucmVhZFRlcm1pbmFsQ29udHJvbChlKTsKCQkJaWYgKHQgIT09IHZvaWQgMCkgcmV0dXJuIHQ7CgkJCWlmIChlLmtpbmQgPT09IGB0dXJuLWRlbGl2ZXJ5LXJlcXVlc3RgKSB7CgkJCQlsZXQgdCA9IGF3YWl0IHRoaXMuc2VydmljZURlbGl2ZXJ5UmVxdWVzdChlKTsKCQkJCWlmICh0ICE9PSB2b2lkIDApIHJldHVybiB0OwoJCQl9CgkJfQoJfQoJYnVmZmVyVHVybkRlbGl2ZXJpZXMoZSkgewoJCWUuYnVmZmVyZWREZWxpdmVyaWVzICE9PSB2b2lkIDAgJiYgdGhpcy5idWZmZXJlZERlbGl2ZXJpZXMudW5zaGlmdCguLi5lLmJ1ZmZlcmVkRGVsaXZlcmllcyk7Cgl9Cgljb25zdW1lQ29udHJvbCgpIHsKCQl0aGlzLnBlbmRpbmdDb250cm9sID0gbnVsbDsKCX0KCWdldENvbnRyb2xQcm9taXNlKCkgewoJCXJldHVybiB0aGlzLnBlbmRpbmdDb250cm9sID8/PSB0aGlzLmNvbnRyb2xJdGVyYXRvci5uZXh0KCksIHRoaXMucGVuZGluZ0NvbnRyb2w7Cgl9Cglhc3luYyBuZXh0Q29udHJvbChlKSB7CgkJZm9yICg7OykgewoJCQlsZXQgdCA9IGF3YWl0IHRoaXMuZ2V0Q29udHJvbFByb21pc2UoKTsKCQkJaWYgKHRoaXMuY29uc3VtZUNvbnRyb2woKSwgdC5kb25lKSB0aHJvdyBFcnJvcihlKTsKCQkJbGV0IG4gPSB0LnZhbHVlOwoJCQlpZiAobi5raW5kID09PSBgdHVybi1lcnJvcmApIHRocm93IHJlYnVpbGRTZXJpYWxpemFibGVFcnJvcihuLmVycm9yKTsKCQkJaWYgKG4ua2luZCA9PT0gYHR1cm4tY29udGludWF0aW9uLXRva2VuYCkgewoJCQkJYXdhaXQgdGhpcy5kZWxpdmVyeUhvb2sucmVrZXkobi5jb250aW51YXRpb25Ub2tlbik7CgkJCQljb250aW51ZTsKCQkJfQoJCQlyZXR1cm4gbjsKCQl9Cgl9CglyZWFkVGVybWluYWxDb250cm9sKGUpIHsKCQlpZiAoZS5raW5kID09PSBgdHVybi1lcnJvcmApIHRocm93IHJlYnVpbGRTZXJpYWxpemFibGVFcnJvcihlLmVycm9yKTsKCQlpZiAoZS5raW5kID09PSBgdHVybi1yZXN1bHRgKSByZXR1cm4gdGhpcy5idWZmZXJUdXJuRGVsaXZlcmllcyhlKSwgZS5hY3Rpb247Cgl9Cglhc3luYyBzZXJ2aWNlRGVsaXZlcnlSZXF1ZXN0KGUpIHsKCQlhd2FpdCB0aGlzLmRlbGl2ZXJ5SG9vay5yZWtleShlLmNvbnRpbnVhdGlvblRva2VuKTsKCQlsZXQgdCA9IHRoaXMuYnVmZmVyZWREZWxpdmVyaWVzLnNoaWZ0KCk7CgkJZm9yICg7IHQgPT09IHZvaWQgMDspIHsKCQkJbGV0IG4gPSBhd2FpdCBQcm9taXNlLnJhY2UoW3RoaXMuZ2V0Q29udHJvbFByb21pc2UoKS50aGVuKChlKSA9PiAoewoJCQkJa2luZDogYGNvbnRyb2xgLAoJCQkJdmFsdWU6IGUKCQkJfSkpLCB0aGlzLmRlbGl2ZXJ5SG9vay5uZXh0KCkudGhlbigoZSkgPT4gKHsKCQkJCWtpbmQ6IGBkZWxpdmVyeWAsCgkJCQl2YWx1ZTogZQoJCQl9KSldKTsKCQkJaWYgKG4ua2luZCA9PT0gYGNvbnRyb2xgKSB7CgkJCQlpZiAodGhpcy5jb25zdW1lQ29udHJvbCgpLCBuLnZhbHVlLmRvbmUpIHRocm93IEVycm9yKGBUdXJuIGNvbnRyb2wgaG9vayBjbG9zZWQgZHVyaW5nIGEgZGVsaXZlcnkgcmVxdWVzdC5gKTsKCQkJCWlmIChuLnZhbHVlLnZhbHVlLmtpbmQgPT09IGB0dXJuLWNvbnRpbnVhdGlvbi10b2tlbmApIHsKCQkJCQlhd2FpdCB0aGlzLmRlbGl2ZXJ5SG9vay5yZWtleShuLnZhbHVlLnZhbHVlLmNvbnRpbnVhdGlvblRva2VuKTsKCQkJCQljb250aW51ZTsKCQkJCX0KCQkJCWxldCB0ID0gdGhpcy5yZWFkVGVybWluYWxDb250cm9sKG4udmFsdWUudmFsdWUpOwoJCQkJaWYgKHQgIT09IHZvaWQgMCkgcmV0dXJuIHQ7CgkJCQlpZiAobi52YWx1ZS52YWx1ZS5raW5kID09PSBgdHVybi1kZWxpdmVyeS1jYW5jZWxsZWRgICYmIG4udmFsdWUudmFsdWUucmVxdWVzdElkID09PSBlLnJlcXVlc3RJZCkgcmV0dXJuOwoJCQkJY29udGludWU7CgkJCX0KCQkJaWYgKG4udmFsdWUuZG9uZSkgdGhyb3cgRXJyb3IoYFNlc3Npb24gZGVsaXZlcnkgaG9vayBjbG9zZWQgZHVyaW5nIGEgdHVybiBkZWxpdmVyeSByZXF1ZXN0LmApOwoJCQl0aGlzLmRlbGl2ZXJ5SG9vay5jb25zdW1lTmV4dCgpLCBuLnZhbHVlLnZhbHVlLmtpbmQgPT09IGBkZWxpdmVyYCAmJiAodCA9IG4udmFsdWUudmFsdWUpOwoJCX0KCQl0cnkgewoJCQlhd2FpdCBmb3J3YXJkVHVybkRlbGl2ZXJ5U3RlcCh7CgkJCQlpbmJveFRva2VuOiBlLmluYm94VG9rZW4sCgkJCQlwYXlsb2FkOiB7CgkJCQkJZGVsaXZlcnk6IHQsCgkJCQkJa2luZDogYGRyaXZlci1kZWxpdmVyeWAsCgkJCQkJcmVxdWVzdElkOiBlLnJlcXVlc3RJZAoJCQkJfQoJCQl9KTsKCQl9IGNhdGNoIChlKSB7CgkJCWlmICghKGUgaW5zdGFuY2VvZiBFcnJvciAmJiBlLm5hbWUgPT09IGBIb29rTm90Rm91bmRFcnJvcmApKSB0aHJvdyBlOwoJCX0KCQlyZXR1cm4gYXdhaXQgdGhpcy5hd2FpdEZvcndhcmRlZERlbGl2ZXJ5KGUucmVxdWVzdElkLCB0KTsKCX0KCWFzeW5jIGF3YWl0Rm9yd2FyZGVkRGVsaXZlcnkoZSwgdCkgewoJCWZvciAoOzspIHsKCQkJbGV0IG4gPSBhd2FpdCB0aGlzLm5leHRDb250cm9sKGBUdXJuIGNvbnRyb2wgaG9vayBjbG9zZWQgYmVmb3JlIHJlc29sdmluZyBhIGZvcndhcmRlZCBkZWxpdmVyeS5gKTsKCQkJaWYgKG4ua2luZCA9PT0gYHR1cm4tZGVsaXZlcnktYWNjZXB0ZWRgKSB7CgkJCQlpZiAobi5yZXF1ZXN0SWQgPT09IGUpIHJldHVybjsKCQkJCWNvbnRpbnVlOwoJCQl9CgkJCWlmIChuLmtpbmQgPT09IGB0dXJuLWRlbGl2ZXJ5LWNhbmNlbGxlZGAgJiYgbi5yZXF1ZXN0SWQgPT09IGUpIHsKCQkJCXRoaXMuYnVmZmVyZWREZWxpdmVyaWVzLnVuc2hpZnQodCk7CgkJCQlyZXR1cm47CgkJCX0KCQkJbi5raW5kID09PSBgdHVybi1yZXN1bHRgICYmIHRoaXMuYnVmZmVyZWREZWxpdmVyaWVzLnVuc2hpZnQodCk7CgkJCWxldCByID0gdGhpcy5yZWFkVGVybWluYWxDb250cm9sKG4pOwoJCQlpZiAociAhPT0gdm9pZCAwKSByZXR1cm4gcjsKCQl9Cgl9Cn07Ci8vI2VuZHJlZ2lvbgovLyNyZWdpb24gZGlzdC9zcmMvZXhlY3V0aW9uL3R1cm4tZGlzcGF0Y2guanMKYXN5bmMgZnVuY3Rpb24gZGlzcGF0Y2hBbmRBd2FpdFR1cm4odCkgewoJbGV0IG4gPSBuZXcgVHVybkNvbnRyb2xSZWNlaXZlcih7CgkJYnVmZmVyZWREZWxpdmVyaWVzOiB0LmJ1ZmZlcmVkRGVsaXZlcmllcywKCQlkZWxpdmVyeUhvb2s6IHQuZGVsaXZlcnlIb29rLAoJCXRva2VuOiB0LmNvbnRyb2xUb2tlbgoJfSk7Cgl0cnkgewoJCXJldHVybiBhd2FpdCBkaXNwYXRjaFR1cm5TdGVwKHsKCQkJY2FwYWJpbGl0aWVzOiB0LmNhcGFiaWxpdGllcywKCQkJY29tcGxldGlvblRva2VuOiBuLnRva2VuLAoJCQlkZWxpdmVyeTogdC5kZWxpdmVyeSwKCQkJbW9kZTogdC5tb2RlLAoJCQlwYXJlbnRXcml0YWJsZTogdC5wYXJlbnRXcml0YWJsZSwKCQkJc2VyaWFsaXplZENvbnRleHQ6IHQuc2VyaWFsaXplZENvbnRleHQsCgkJCXNlc3Npb25TdGF0ZTogdC5zZXNzaW9uU3RhdGUKCQl9KSwgewoJCQlhY3Rpb246IGF3YWl0IG4ud2FpdEZvckFjdGlvbigpLAoJCQlkaXNwb3NlOiAoKSA9PiBuLmRpc3Bvc2UoKQoJCX07Cgl9IGNhdGNoIChlKSB7CgkJdGhyb3cgYXdhaXQgbi5kaXNwb3NlKCksIGU7Cgl9Cn0KLy8jZW5kcmVnaW9uCi8vI3JlZ2lvbiBkaXN0L3NyYy9leGVjdXRpb24vY3JlYXRlLXNlc3Npb24tc3RlcC5qcwp2YXIgY3JlYXRlU2Vzc2lvblN0ZXAgPSBnbG9iYWxUaGlzW1N5bWJvbC5mb3IoIldPUktGTE9XX1VTRV9TVEVQIildKCJzdGVwLy9ldmVAMC4yNC42Ly9jcmVhdGVTZXNzaW9uU3RlcCIpOwovLyNlbmRyZWdpb24KLy8jcmVnaW9uIGRpc3Qvc3JjL2V4ZWN1dGlvbi9zZXR0bGUtY2FuY2VsbGVkLXR1cm4tc3RlcC5qcwp2YXIgc2V0dGxlQ2FuY2VsbGVkVHVyblN0ZXAgPSBnbG9iYWxUaGlzW1N5bWJvbC5mb3IoIldPUktGTE9XX1VTRV9TVEVQIildKCJzdGVwLy9ldmVAMC4yNC42Ly9zZXR0bGVDYW5jZWxsZWRUdXJuU3RlcCIpOwovLyNlbmRyZWdpb24KLy8jcmVnaW9uIGRpc3Qvc3JjL2V4ZWN1dGlvbi90ZXJtaW5hbC1zZXNzaW9uLWZhaWx1cmUtc3RlcC5qcwp2YXIgZW1pdFRlcm1pbmFsU2Vzc2lvbkZhaWx1cmVTdGVwID0gZ2xvYmFsVGhpc1tTeW1ib2wuZm9yKCJXT1JLRkxPV19VU0VfU1RFUCIpXSgic3RlcC8vZXZlQDAuMjQuNi8vZW1pdFRlcm1pbmFsU2Vzc2lvbkZhaWx1cmVTdGVwIik7Ci8vI2VuZHJlZ2lvbgovLyNyZWdpb24gZGlzdC9zcmMvZXhlY3V0aW9uL3Nlc3Npb24tY2FsbGJhY2stc3RlcC5qcwp2YXIgZmlyZVNlc3Npb25DYWxsYmFja1N0ZXAgPSBnbG9iYWxUaGlzW1N5bWJvbC5mb3IoIldPUktGTE9XX1VTRV9TVEVQIildKCJzdGVwLy9ldmVAMC4yNC42Ly9maXJlU2Vzc2lvbkNhbGxiYWNrU3RlcCIpOwovLyNlbmRyZWdpb24KLy8jcmVnaW9uIGRpc3Qvc3JjL2V4ZWN1dGlvbi9zZXNzaW9uLWRlbGl2ZXJ5LWhvb2suanMKZnVuY3Rpb24gY3JlYXRlU2Vzc2lvbkRlbGl2ZXJ5SG9vayhyKSB7CglsZXQgaSwgYSA9IFtdLCBvID0gW10sIHMgPSAwLCBjID0gbnVsbCwgbCwgdSwgZW5xdWV1ZSA9IChlKSA9PiB7CgkJby5wdXNoKGUpLCBvLnNvcnQoKGUsIHQpID0+IGUub3JkZXIgLSB0Lm9yZGVyKSwgdT8uKCksIHUgPSB2b2lkIDA7Cgl9LCBhcm0gPSAoZSkgPT4gewoJCWUuY2xvc2VkIHx8IGUucGVuZGluZyB8fCAoZS5wZW5kaW5nID0gITAsIGUucmVzb2x2ZWQgPSB2b2lkIDAsIChlLnJldGlyZWQgPyBQcm9taXNlLnJlc29sdmUoZS5ob29rKS50aGVuKChlKSA9PiAoewoJCQlkb25lOiAhMSwKCQkJdmFsdWU6IGUKCQl9KSkgOiBlLml0ZXJhdG9yLm5leHQoKSkudGhlbigodCkgPT4gewoJCQlsZXQgbiA9IHsKCQkJCW9yZGVyOiBzKyssCgkJCQlyZXN1bHQ6IHQsCgkJCQlzdGF0ZTogZQoJCQl9OwoJCQllLnJlc29sdmVkID0gbiwgZS5lbmFibGVkICYmIGVucXVldWUobik7CgkJfSwgKCkgPT4ge30pKTsKCX0sIGVuYWJsZSA9IChlKSA9PiB7CgkJZS5lbmFibGVkID0gITAsIGUucmVzb2x2ZWQgIT09IHZvaWQgMCAmJiBlbnF1ZXVlKGUucmVzb2x2ZWQpOwoJfSwgZHJhaW5SZWFkeSA9IGFzeW5jICgpID0+IHsKCQlpZiAoYyA9PT0gbnVsbCkgZm9yIChhd2FpdCBQcm9taXNlLnJlc29sdmUoKTsgby5sZW5ndGggPiAwOykgewoJCQlsZXQgZSA9IG8uc2hpZnQoKTsKCQkJZS5zdGF0ZS5wZW5kaW5nID0gITEsIGUuc3RhdGUucmVzb2x2ZWQgPSB2b2lkIDAsIGUucmVzdWx0LmRvbmUgPyBlLnN0YXRlLmNsb3NlZCA9ICEwIDogZS5yZXN1bHQudmFsdWUua2luZCA9PT0gYGRlbGl2ZXJgICYmIHIucHVzaChlLnJlc3VsdC52YWx1ZSksIGFybShlLnN0YXRlKSwgYXdhaXQgUHJvbWlzZS5yZXNvbHZlKCk7CgkJfQoJfTsKCXJldHVybiB7CgkJY29uc3VtZU5leHQoKSB7CgkJCWlmIChsID09PSB2b2lkIDApIHRocm93IEVycm9yKGBDYW5ub3QgY29uc3VtZSBhIHB1YmxpYyBkZWxpdmVyeSBiZWZvcmUgaXQgcmVzb2x2ZXMuYCk7CgkJCWwuc3RhdGUucGVuZGluZyA9ICExLCBsLnN0YXRlLnJlc29sdmVkID0gdm9pZCAwLCBsLnJlc3VsdC5kb25lICYmIChsLnN0YXRlLmNsb3NlZCA9ICEwKSwgbCA9IHZvaWQgMCwgYyA9IG51bGw7CgkJfSwKCQlhc3luYyBkaXNwb3NlKCkgewoJCQlpICE9PSB2b2lkIDAgJiYgKGF3YWl0IGRpc3Bvc2VIb29rKGkuaG9vayksIGkgPSB2b2lkIDApOwoJCX0sCgkJbmV4dCgpIHsKCQkJaWYgKGkgPT09IHZvaWQgMCkgdGhyb3cgRXJyb3IoYENhbm5vdCB3YWl0IGZvciBkZWxpdmVyaWVzIGJlZm9yZSBhIGNvbnRpbnVhdGlvbiB0b2tlbiBpcyBhdmFpbGFibGUuYCk7CgkJCWlmIChjICE9PSBudWxsKSByZXR1cm4gYzsKCQkJYXJtKGkpOwoJCQlmb3IgKGxldCBlIG9mIGEpIGFybShlKTsKCQkJcmV0dXJuIGkuY2xvc2VkICYmIGEuZXZlcnkoKGUpID0+IGUuY2xvc2VkKSA/IChsID0gewoJCQkJb3JkZXI6IHMrKywKCQkJCXJlc3VsdDogewoJCQkJCWRvbmU6ICEwLAoJCQkJCXZhbHVlOiB2b2lkIDAKCQkJCX0sCgkJCQlzdGF0ZTogaQoJCQl9LCBjID0gUHJvbWlzZS5yZXNvbHZlKGwucmVzdWx0KSwgYykgOiAoYyA9IChhc3luYyAoKSA9PiB7CgkJCQlmb3IgKDsgby5sZW5ndGggPT09IDA7KSBhd2FpdCBuZXcgUHJvbWlzZSgoZSkgPT4gewoJCQkJCXUgPSBlOwoJCQkJfSk7CgkJCQlsZXQgZSA9IG8uc2hpZnQoKTsKCQkJCXJldHVybiBsID0gZSwgZS5yZXN1bHQ7CgkJCX0pKCksIGMpOwoJCX0sCgkJYXN5bmMgcmVrZXkocikgewoJCQlpZiAoIXIgfHwgaT8uaG9vay50b2tlbiA9PT0gcikgcmV0dXJuOwoJCQlsZXQgbyA9IGNyZWF0ZUhvb2soeyB0b2tlbjogciB9KSwgcyA9IHsKCQkJCWNsb3NlZDogITEsCgkJCQllbmFibGVkOiAhMSwKCQkJCWhvb2s6IG8sCgkJCQlpdGVyYXRvcjogb1tTeW1ib2wuYXN5bmNJdGVyYXRvcl0oKSwKCQkJCXBlbmRpbmc6ICExLAoJCQkJcmV0aXJlZDogITEKCQkJfTsKCQkJaWYgKGkgPT09IHZvaWQgMCkgewoJCQkJYXdhaXQgY2xhaW1Ib29rT3duZXJzaGlwKHMuaG9vayksIGVuYWJsZShzKSwgaSA9IHM7CgkJCQlyZXR1cm47CgkJCX0KCQkJbGV0IGMgPSBpOwoJCQlhcm0oYyksIGFybShzKSwgYXdhaXQgY2xhaW1Ib29rT3duZXJzaGlwKHMuaG9vayksIGVuYWJsZShzKSwgYXdhaXQgZHJhaW5SZWFkeSgpOwoJCQl0cnkgewoJCQkJYXdhaXQgZGlzcG9zZUhvb2soYy5ob29rKTsKCQkJfSBjYXRjaCAoZSkgewoJCQkJaSA9IHZvaWQgMDsKCQkJCXRyeSB7CgkJCQkJYXdhaXQgZGlzcG9zZUhvb2socy5ob29rKTsKCQkJCX0gY2F0Y2gge30KCQkJCXRocm93IGU7CgkJCX0KCQkJYy5yZXRpcmVkID0gITAsIGEucHVzaChjKSwgaSA9IHMsIGF3YWl0IGRyYWluUmVhZHkoKTsKCQl9Cgl9Owp9Ci8vI2VuZHJlZ2lvbgovLyNyZWdpb24gZGlzdC9zcmMvZXhlY3V0aW9uL3dvcmtmbG93LWVudHJ5LmpzCmFzeW5jIGZ1bmN0aW9uIHdvcmtmbG93RW50cnkodCkgewoJbGV0IHsgd29ya2Zsb3dSdW5JZDogaSB9ID0gZ2V0V29ya2Zsb3dNZXRhZGF0YSgpLCBvID0gdC5zZXJpYWxpemVkQ29udGV4dFtgZXZlLmNvbnRpbnVhdGlvblRva2VuYF0gfHwgYGAsIHMgPSB0LnNlcmlhbGl6ZWRDb250ZXh0W2BldmUubW9kZWBdLCB1ID0gdC5zZXJpYWxpemVkQ29udGV4dFtgZXZlLmNhcGFiaWxpdGllc2BdLCBkID0gdC5zZXJpYWxpemVkQ29udGV4dFtgZXZlLmJ1bmRsZWBdOwoJdC5zZXJpYWxpemVkQ29udGV4dFtgZXZlLnNlc3Npb25JZGBdID0gaTsKCWxldCBmID0gZ2V0V3JpdGFibGUoKTsKCXRyeSB7CgkJbGV0IG4gPSByZWFkUm9vdFNlc3Npb25JZCh0LnNlcmlhbGl6ZWRDb250ZXh0KSwgciA9IHJlYWRTZXJpYWxpemVkU3ViYWdlbnREZXB0aCh0LnNlcmlhbGl6ZWRDb250ZXh0KSwgeyBzdGF0ZTogYSB9ID0gYXdhaXQgY3JlYXRlU2Vzc2lvblN0ZXAoewoJCQljb21waWxlZEFydGlmYWN0c1NvdXJjZTogZC5zb3VyY2UsCgkJCWNvbnRpbnVhdGlvblRva2VuOiBvLAoJCQlpbmhlcml0ZWRMaW1pdHM6IHQubGltaXRzLAoJCQlub2RlSWQ6IGQubm9kZUlkLAoJCQlvdXRwdXRTY2hlbWE6IHQuaW5wdXQub3V0cHV0U2NoZW1hLAoJCQlyb290U2Vzc2lvbklkOiBuLAoJCQlzZXNzaW9uSWQ6IGksCgkJCXN1YmFnZW50RGVwdGg6IHIKCQl9KTsKCQlyZXR1cm4gYXdhaXQgcnVuRHJpdmVyTG9vcCh7CgkJCWNhcGFiaWxpdGllczogdSwKCQkJZHJpdmVyV3JpdGFibGU6IGYsCgkJCWluaXRpYWxJbnB1dDogewoJCQkJa2luZDogYGRlbGl2ZXJgLAoJCQkJcGF5bG9hZHM6IFt7CgkJCQkJbWVzc2FnZTogdC5pbnB1dC5tZXNzYWdlLAoJCQkJCWNvbnRleHQ6IHQuaW5wdXQuY29udGV4dCwKCQkJCQlvdXRwdXRTY2hlbWE6IHQuaW5wdXQub3V0cHV0U2NoZW1hCgkJCQl9XSwKCQkJCXJlcXVlc3RJZDogcmVhZENoYW5uZWxSZXF1ZXN0SWQodC5zZXJpYWxpemVkQ29udGV4dCkKCQkJfSwKCQkJbW9kZTogcywKCQkJc2VyaWFsaXplZENvbnRleHQ6IHQuc2VyaWFsaXplZENvbnRleHQsCgkJCXNlc3Npb25TdGF0ZTogYQoJCX0pOwoJfSBjYXRjaCAoZSkgewoJCXRocm93IGF3YWl0IGVtaXRUZXJtaW5hbFNlc3Npb25GYWlsdXJlU3RlcCh7CgkJCWVycm9yOiBub3JtYWxpemVTZXJpYWxpemFibGVFcnJvcihlKSwKCQkJcGFyZW50V3JpdGFibGU6IGYsCgkJCXNlcmlhbGl6ZWRDb250ZXh0OiB0LnNlcmlhbGl6ZWRDb250ZXh0CgkJfSksIGF3YWl0IGZpcmVTZXNzaW9uQ2FsbGJhY2tTdGVwKHsKCQkJZXJyb3I6IG5vcm1hbGl6ZVNlcmlhbGl6YWJsZUVycm9yKGUpLAoJCQlzZXJpYWxpemVkQ29udGV4dDogdC5zZXJpYWxpemVkQ29udGV4dCwKCQkJc3RhdHVzOiBgZmFpbGVkYAoJCX0pLCBhd2FpdCBub3RpZnlEZWxlZ2F0ZWRQYXJlbnRTdGVwKHsKCQkJcmVzdWx0OiBjcmVhdGVEZWxlZ2F0ZWRTdWJhZ2VudEVycm9yUmVzdWx0KHQuc2VyaWFsaXplZENvbnRleHQsIGUpLAoJCQlzZXJpYWxpemVkQ29udGV4dDogdC5zZXJpYWxpemVkQ29udGV4dAoJCX0pLCBlOwoJfQp9CmFzeW5jIGZ1bmN0aW9uIHJ1bkRyaXZlckxvb3AoZSkgewoJbGV0IG4gPSBjcmVhdGVIb29rKHsgdG9rZW46IGAke2Uuc2Vzc2lvblN0YXRlLnNlc3Npb25JZH06YXV0aGAgfSksIHIgPSBuW1N5bWJvbC5hc3luY0l0ZXJhdG9yXSgpLCBhID0gMCwgbmV4dFR1cm5Db250cm9sVG9rZW4gPSAoKSA9PiBgJHtlLnNlc3Npb25TdGF0ZS5zZXNzaW9uSWR9OnR1cm4tY29udHJvbDoke1N0cmluZyhhKyspfWAsIHMgPSBbXSwgYyA9IGNyZWF0ZVNlc3Npb25EZWxpdmVyeUhvb2socyksIGwsIHJ1blR1cm4gPSBhc3luYyAodCkgPT4gewoJCWxldCBuID0gYXdhaXQgZGlzcGF0Y2hBbmRBd2FpdFR1cm4oewoJCQlidWZmZXJlZERlbGl2ZXJpZXM6IHMsCgkJCWNhcGFiaWxpdGllczogZS5jYXBhYmlsaXRpZXMsCgkJCWNvbnRyb2xUb2tlbjogbmV4dFR1cm5Db250cm9sVG9rZW4oKSwKCQkJZGVsaXZlcnk6IHQuZGVsaXZlcnksCgkJCWRlbGl2ZXJ5SG9vazogYywKCQkJbW9kZTogZS5tb2RlLAoJCQlwYXJlbnRXcml0YWJsZTogZS5kcml2ZXJXcml0YWJsZSwKCQkJc2VyaWFsaXplZENvbnRleHQ6IHQuc2VyaWFsaXplZENvbnRleHQsCgkJCXNlc3Npb25TdGF0ZTogdC5zZXNzaW9uU3RhdGUKCQl9KTsKCQlyZXR1cm4gYXdhaXQgbD8uKCksIGwgPSBuLmRpc3Bvc2UsIG4uYWN0aW9uOwoJfTsKCXRyeSB7CgkJZS5zZXNzaW9uU3RhdGUuY29udGludWF0aW9uVG9rZW4gJiYgYXdhaXQgYy5yZWtleShlLnNlc3Npb25TdGF0ZS5jb250aW51YXRpb25Ub2tlbik7CgkJbGV0IHQgPSBhd2FpdCBydW5UdXJuKHsKCQkJZGVsaXZlcnk6IGUuaW5pdGlhbElucHV0LAoJCQlzZXJpYWxpemVkQ29udGV4dDogZS5zZXJpYWxpemVkQ29udGV4dCwKCQkJc2Vzc2lvblN0YXRlOiBlLnNlc3Npb25TdGF0ZQoJCX0pOwoJCWZvciAoOzspIHsKCQkJaWYgKHQua2luZCA9PT0gYGRvbmVgKSByZXR1cm4gYXdhaXQgZmluYWxpemVEb25lKHsKCQkJCWFjdGlvbjogdCwKCQkJCWRyaXZlcldyaXRhYmxlOiBlLmRyaXZlcldyaXRhYmxlCgkJCX0pOwoJCQlpZiAodC5raW5kICE9PSBgcGFya2ApIHRocm93IEVycm9yKGBEcml2ZXIgcmVjZWl2ZWQgdW5leHBlY3RlZCB0dXJuIGFjdGlvbiAiJHt0LmtpbmR9Ii5gKTsKCQkJaWYgKHQuY2FuY2VsbGVkID09PSAhMCkgewoJCQkJbGV0IG4gPSBhd2FpdCBzZXR0bGVDYW5jZWxsZWRUdXJuU3RlcCh7CgkJCQkJcGFyZW50V3JpdGFibGU6IGUuZHJpdmVyV3JpdGFibGUsCgkJCQkJc2VyaWFsaXplZENvbnRleHQ6IHQuc2VyaWFsaXplZENvbnRleHQsCgkJCQkJc2Vzc2lvblN0YXRlOiB0LnNlc3Npb25TdGF0ZQoJCQkJfSk7CgkJCQl0ID0gewoJCQkJCS4uLnQsCgkJCQkJc2VyaWFsaXplZENvbnRleHQ6IG4uc2VyaWFsaXplZENvbnRleHQsCgkJCQkJc2Vzc2lvblN0YXRlOiBuLnNlc3Npb25TdGF0ZQoJCQkJfTsKCQkJfQoJCQlpZiAoIXQuc2Vzc2lvblN0YXRlLmNvbnRpbnVhdGlvblRva2VuKSB0aHJvdyBFcnJvcigiQ2Fubm90IHBhcms6IG5vIGNvbnRpbnVhdGlvbiB0b2tlbiBhdmFpbGFibGUuIFRoZSBjaGFubmVsIG11c3QgcG9zdCB0aGUgZmlyc3QgbWVzc2FnZSBkdXJpbmcgdGhlIGluaXRpYWwgdHVybiAoYW5jaG9yaW5nIHRoZSBzZXNzaW9uKSBvciBgc2VuZCgpYCBtdXN0IGJlIGNhbGxlZCB3aXRoIGFuIGV4cGxpY2l0IGNvbnRpbnVhdGlvblRva2VuLiIpOwoJCQlpZiAoYXdhaXQgYy5yZWtleSh0LnNlc3Npb25TdGF0ZS5jb250aW51YXRpb25Ub2tlbiksIHQuYXV0aG9yaXphdGlvbk5hbWVzICYmIHQuYXV0aG9yaXphdGlvbk5hbWVzLmxlbmd0aCA+IDApIHsKCQkJCWxldCBlID0gdC5hdXRob3JpemF0aW9uTmFtZXMubGVuZ3RoLCBuID0gW107CgkJCQlmb3IgKDsgbi5sZW5ndGggPCBlOykgewoJCQkJCWxldCBlID0gYXdhaXQgci5uZXh0KCk7CgkJCQkJaWYgKGUuZG9uZSkgYnJlYWs7CgkJCQkJZS52YWx1ZS5raW5kID09PSBgZGVsaXZlcmAgJiYgbi5wdXNoKC4uLmUudmFsdWUucGF5bG9hZHMpOwoJCQkJfQoJCQkJdCA9IGF3YWl0IHJ1blR1cm4oewoJCQkJCWRlbGl2ZXJ5OiB7CgkJCQkJCWtpbmQ6IGBkZWxpdmVyYCwKCQkJCQkJcGF5bG9hZHM6IG4KCQkJCQl9LAoJCQkJCXNlcmlhbGl6ZWRDb250ZXh0OiB0LnNlcmlhbGl6ZWRDb250ZXh0LAoJCQkJCXNlc3Npb25TdGF0ZTogdC5zZXNzaW9uU3RhdGUKCQkJCX0pOwoJCQkJY29udGludWU7CgkJCX0KCQkJbGV0IG4gPSBhd2FpdCB3YWl0Rm9yTmV4dERlbGl2ZXIoewoJCQkJYnVmZmVyZWREZWxpdmVyaWVzOiBzLAoJCQkJZGVsaXZlcnlIb29rOiBjCgkJCX0pOwoJCQlpZiAobiA9PT0gbnVsbCkgcmV0dXJuIHsgb3V0cHV0OiBgYCB9OwoJCQlsZXQgaSA9IGF3YWl0IHJvdXRlRGVsaXZlclRvQ2hpbGRyZW4oewoJCQkJYXV0aDogbi5hdXRoLAoJCQkJcGFyZW50V3JpdGFibGU6IGUuZHJpdmVyV3JpdGFibGUsCgkJCQlwYXlsb2Fkczogbi5wYXlsb2FkcywKCQkJCXNlc3Npb25TdGF0ZTogdC5zZXNzaW9uU3RhdGUKCQkJfSk7CgkJCWkgIT09IHZvaWQgMCAmJiAodCA9IGF3YWl0IHJ1blR1cm4oewoJCQkJZGVsaXZlcnk6IHsKCQkJCQlhdXRoOiBuLmF1dGgsCgkJCQkJa2luZDogYGRlbGl2ZXJgLAoJCQkJCXBheWxvYWRzOiBbaV0sCgkJCQkJcmVxdWVzdElkOiBuLnJlcXVlc3RJZAoJCQkJfSwKCQkJCXNlcmlhbGl6ZWRDb250ZXh0OiB0LnNlcmlhbGl6ZWRDb250ZXh0LAoJCQkJc2Vzc2lvblN0YXRlOiB0LnNlc3Npb25TdGF0ZQoJCQl9KSk7CgkJfQoJfSBmaW5hbGx5IHsKCQlhd2FpdCBsPy4oKSwgYXdhaXQgYy5kaXNwb3NlKCksIGF3YWl0IGRpc3Bvc2VIb29rKG4pOwoJfQp9CmFzeW5jIGZ1bmN0aW9uIGZpbmFsaXplRG9uZShlKSB7CglsZXQgeyBvdXRwdXQ6IHQsIHNlcmlhbGl6ZWRDb250ZXh0OiBuIH0gPSBlLmFjdGlvbiwgciA9IGUuYWN0aW9uLmlzRXJyb3IgPT09ICEwOwoJcmV0dXJuIGF3YWl0IGZpcmVTZXNzaW9uQ2FsbGJhY2tTdGVwKHsKCQllcnJvcjogciA/IHQgOiB2b2lkIDAsCgkJb3V0cHV0OiByID8gdm9pZCAwIDogdCwKCQlzZXJpYWxpemVkQ29udGV4dDogbiwKCQlzdGF0dXM6IHIgPyBgZmFpbGVkYCA6IGBjb21wbGV0ZWRgLAoJCXVzYWdlOiByID8gdm9pZCAwIDogZS5hY3Rpb24udXNhZ2UKCX0pLCBhd2FpdCBub3RpZnlEZWxlZ2F0ZWRQYXJlbnRTdGVwKHsKCQlyZXN1bHQ6IHIgPyBjcmVhdGVEZWxlZ2F0ZWRTdWJhZ2VudEVycm9y",
	"UmVzdWx0KG4sIHQpIDogY3JlYXRlRGVsZWdhdGVkU3ViYWdlbnRTdWNjZXNzUmVzdWx0KG4sIHQpLAoJCXNlcmlhbGl6ZWRDb250ZXh0OiBuLAoJCXVzYWdlOiByID8gdm9pZCAwIDogZS5hY3Rpb24udXNhZ2UKCX0pLCB7IG91dHB1dDogdCB9Owp9CmFzeW5jIGZ1bmN0aW9uIHdhaXRGb3JOZXh0RGVsaXZlcihlKSB7CglpZiAoZS5idWZmZXJlZERlbGl2ZXJpZXMubGVuZ3RoID4gMCkgcmV0dXJuIGNvYWxlc2NlRGVsaXZlcmllcyhlLmJ1ZmZlcmVkRGVsaXZlcmllcy5zcGxpY2UoMCkpOwoJZm9yICg7OykgewoJCWxldCB0ID0gYXdhaXQgZS5kZWxpdmVyeUhvb2submV4dCgpOwoJCWlmIChlLmRlbGl2ZXJ5SG9vay5jb25zdW1lTmV4dCgpLCB0LmRvbmUpIHJldHVybiBudWxsOwoJCWlmICh0LnZhbHVlLmtpbmQgIT09IGBkZWxpdmVyYCkgY29udGludWU7CgkJbGV0IG4gPSB0LnZhbHVlOwoJCWZvciAoOzspIHsKCQkJbGV0IHQgPSBhd2FpdCB0YWtlUmVhZHlQYXlsb2FkKGUuZGVsaXZlcnlIb29rLm5leHQoKSk7CgkJCWlmICh0ID09PSBOT19SRUFEWV9NRVNTQUdFIHx8IChlLmRlbGl2ZXJ5SG9vay5jb25zdW1lTmV4dCgpLCB0LmRvbmUpKSBicmVhazsKCQkJdC52YWx1ZS5raW5kID09PSBgZGVsaXZlcmAgJiYgKG4gPSBjb2FsZXNjZURlbGl2ZXJpZXMoW24sIHQudmFsdWVdKSk7CgkJfQoJCXJldHVybiBuOwoJfQp9CmNvbnN0IE5PX1JFQURZX01FU1NBR0UgPSBTeW1ib2woYG5vLXJlYWR5LW1lc3NhZ2VgKTsKYXN5bmMgZnVuY3Rpb24gdGFrZVJlYWR5UGF5bG9hZChlKSB7CglyZXR1cm4gYXdhaXQgUHJvbWlzZS5yZXNvbHZlKCksIGF3YWl0IFByb21pc2UucmFjZShbZSwgUHJvbWlzZS5yZXNvbHZlKE5PX1JFQURZX01FU1NBR0UpXSk7Cn0Kd29ya2Zsb3dFbnRyeS53b3JrZmxvd0lkID0gIndvcmtmbG93Ly9ldmUvL3dvcmtmbG93RW50cnkiOwpnbG9iYWxUaGlzLl9fcHJpdmF0ZV93b3JrZmxvd3Muc2V0KCJ3b3JrZmxvdy8vZXZlLy93b3JrZmxvd0VudHJ5Iiwgd29ya2Zsb3dFbnRyeSk7Ci8vI2VuZHJlZ2lvbgoKLy8jIHNvdXJjZU1hcHBpbmdVUkw9ZGF0YTphcHBsaWNhdGlvbi9qc29uO2NoYXJzZXQ9dXRmLTg7YmFzZTY0LGV5SjJaWEp6YVc5dUlqb3pMQ0ptYVd4bElqb2lYMlYyWlMxM2IzSnJabXh2ZHkxbGJuUnllUzVxY3lJc0ltNWhiV1Z6SWpwYlhTd2ljMjkxY21ObGN5STZXeUp6Y21NdmMyaGhjbVZrTDJkMVlYSmtjeTVxY3lJc0luTnlZeTl6YUdGeVpXUXZaWEp5YjNKekxtcHpJaXdpYzNKakwzQnliM1J2WTI5c0wyMWxjM05oWjJVdWFuTWlMQ0p6Y21NdmNuVnVkR2x0WlM5aFkzUnBiMjV6TDJ0bGVYTXVhbk1pTENKemNtTXZhR0Z5Ym1WemN5OXlkVzUwYVcxbExXRmpkR2x2Ym5NdWFuTWlMQ0p6Y21NdlpYaGxZM1YwYVc5dUwyUnBjM0JoZEdOb0xYSjFiblJwYldVdFlXTjBhVzl1Y3kxemRHVndMbXB6SWl3aWMzSmpMMlY0WldOMWRHbHZiaTkzYjNKclpteHZkeTFqWVd4c1ltRmpheTExY213dWFuTWlMQ0p6Y21NdlpYaGxZM1YwYVc5dUwzZHZjbXRtYkc5M0xYTjBaWEJ6TG1weklpd2ljM0pqTDJsdWRHVnlibUZzTDNkdmNtdG1iRzkzTFdKMWJtUnNaUzkzYjNKclpteHZkeTFqYjNKbExYTm9hVzB1YW5NaUxDSnpjbU12WlhobFkzVjBhVzl1TDJodmIyc3RiM2R1WlhKemFHbHdMbXB6SWl3aWMzSmpMMlY0WldOMWRHbHZiaTkzYjNKclpteHZkeTFsY25KdmNuTXVhbk1pTENKemNtTXZaWGhsWTNWMGFXOXVMM1IxY200dFkyOXVkSEp2YkMxd2NtOTBiMk52YkM1cWN5SXNJbk55WXk5bGVHVmpkWFJwYjI0dlkyRnVZMlZzTFdSbGMyTmxibVJoYm5RdGRIVnlibk10YzNSbGNDNXFjeUlzSW5OeVl5OWxlR1ZqZFhScGIyNHZaR2x6Y0dGMFkyZ3RkMjl5YTJac2IzY3RjblZ1ZEdsdFpTMWhZM1JwYjI1ekxYTjBaWEF1YW5NaUxDSnpjbU12WlhobFkzVjBhVzl1TDJSMWNtRmliR1V0YzJWemMybHZiaTF0YVdkeVlYUnBiMjV6TDJOb1lXbHVMbXB6SWl3aWMzSmpMMlY0WldOMWRHbHZiaTlrZFhKaFlteGxMWE5sYzNOcGIyNHRiV2xuY21GMGFXOXVjeTkwZFhKdUxYZHZjbXRtYkc5M0xYWXdMWFJ2TFhZeExtcHpJaXdpYzNKakwyVjRaV04xZEdsdmJpOWtkWEpoWW14bExYTmxjM05wYjI0dGJXbG5jbUYwYVc5dWN5OTBkWEp1TFhkdmNtdG1iRzkzTG1weklpd2ljM0pqTDJWNFpXTjFkR2x2Ymk5a1pXeHBkbVZ5TFhCaGVXeHZZV1J6TG1weklpd2ljM0pqTDJWNFpXTjFkR2x2Ymk5eWIzVjBaUzFqYUdsc1pDMWtaV3hwZG1WeWVTNXFjeUlzSW5OeVl5OWxlR1ZqZFhScGIyNHZjM1ZpWVdkbGJuUXRaWFpsYm5RdGNISnZlSGt0YzNSbGNDNXFjeUlzSW5OeVl5OWxlR1ZqZFhScGIyNHZkSFZ5YmkxallXNWpaV3hzWVhScGIyNHRkRzlyWlc0dWFuTWlMQ0p6Y21NdmFHRnlibVZ6Y3k5MGRYSnVMV05oYm1ObGJHeGhkR2x2Ymk1cWN5SXNJbk55WXk5bGVHVmpkWFJwYjI0dmRIVnliaTFqWVc1alpXeHNZWFJwYjI0dFkyOXVkSEp2YkM1cWN5SXNJbk55WXk5bGVHVmpkWFJwYjI0dmRIVnliaTFsZUdWamRYUnBiMjR0WTNWeWMyOXlMbXB6SWl3aWMzSmpMMmhoY201bGMzTXZZV04wYVhabExYUjFjbTR0YVdRdWFuTWlMQ0p6Y21NdlpYaGxZM1YwYVc5dUwzUjFjbTR0ZDI5eWEyWnNiM2N1YW5NaUxDSnpjbU12WTI5dWRHVjRkQzlyWlhrdWFuTWlMQ0p6Y21NdlkyOXVkR1Y0ZEM5clpYbHpMbXB6SWl3aWMzSmpMMmhoY201bGMzTXZjM1ZpWVdkbGJuUXRaR1Z3ZEdndWFuTWlMQ0p6Y21NdmFHRnlibVZ6Y3k5dFpYTnpZV2RsY3k1cWN5SXNJbk55WXk5bGVHVmpkWFJwYjI0dlpYWmxMWGR2Y210bWJHOTNMV0YwZEhKcFluVjBaWE11YW5NaUxDSnpjbU12WlhobFkzVjBhVzl1TDJSbGJHVm5ZWFJsWkMxd1lYSmxiblF0Ym05MGFXWnBZMkYwYVc5dUxtcHpJaXdpYzNKakwyVjRaV04xZEdsdmJpOXpkV0poWjJWdWRDMWhaR0Z3ZEdWeUxtcHpJaXdpYzNKakwyVjRaV04xZEdsdmJpOWtaV3hsWjJGMFpXUXRjR0Z5Wlc1MExYSmxjM1ZzZEM1cWN5SXNJbk55WXk5bGVHVmpkWFJwYjI0dlptOXlkMkZ5WkMxMGRYSnVMV1JsYkdsMlpYSjVMWE4wWlhBdWFuTWlMQ0p6Y21NdlpYaGxZM1YwYVc5dUwzUjFjbTR0WTI5dWRISnZiQzF5WldObGFYWmxjaTVxY3lJc0luTnlZeTlsZUdWamRYUnBiMjR2ZEhWeWJpMWthWE53WVhSamFDNXFjeUlzSW5OeVl5OWxlR1ZqZFhScGIyNHZZM0psWVhSbExYTmxjM05wYjI0dGMzUmxjQzVxY3lJc0luTnlZeTlsZUdWamRYUnBiMjR2YzJWMGRHeGxMV05oYm1ObGJHeGxaQzEwZFhKdUxYTjBaWEF1YW5NaUxDSnpjbU12WlhobFkzVjBhVzl1TDNSbGNtMXBibUZzTFhObGMzTnBiMjR0Wm1GcGJIVnlaUzF6ZEdWd0xtcHpJaXdpYzNKakwyVjRaV04xZEdsdmJpOXpaWE56YVc5dUxXTmhiR3hpWVdOckxYTjBaWEF1YW5NaUxDSnpjbU12WlhobFkzVjBhVzl1TDNObGMzTnBiMjR0WkdWc2FYWmxjbmt0YUc5dmF5NXFjeUlzSW5OeVl5OWxlR1ZqZFhScGIyNHZkMjl5YTJac2IzY3RaVzUwY25rdWFuTWlYU3dpYzI5MWNtTmxjME52Ym5SbGJuUWlPbHNpWm5WdVkzUnBiMjRnYVhOUFltcGxZM1FvWlNsN2NtVjBkWEp1SUhSNWNHVnZaaUJsUFQxZ2IySnFaV04wWUNZbUlTRmxKaVloUVhKeVlYa3VhWE5CY25KaGVTaGxLWDFtZFc1amRHbHZiaUJwYzA1dmJrVnRjSFI1VTNSeWFXNW5LR1VwZTNKbGRIVnliaUIwZVhCbGIyWWdaVDA5WUhOMGNtbHVaMkFtSm1VdWJHVnVaM1JvUGpCOVpuVnVZM1JwYjI0Z2FYTlVhR1Z1WVdKc1pTaGxLWHR5WlhSMWNtNGdhWE5QWW1wbFkzUW9aU2ttSm5SNWNHVnZaaUJsTG5Sb1pXNDlQV0JtZFc1amRHbHZibUI5Wm5WdVkzUnBiMjRnYVhORmNuSnViME52WkdVb1pTeDBLWHR5WlhSMWNtNGdaU0JwYm5OMFlXNWpaVzltSUVWeWNtOXlKaVpnWTI5a1pXQnBiaUJsSmlabExtTnZaR1U5UFQxMGZXWjFibU4wYVc5dUlHbHpVR3hoYVc1U1pXTnZjbVFvWlNsN2FXWW9JV2x6VDJKcVpXTjBLR1VwS1hKbGRIVnliaUV4TzJ4bGRDQjBQVTlpYW1WamRDNW5aWFJRY205MGIzUjVjR1ZQWmlobEtUdHlaWFIxY200Z2REMDlQVTlpYW1WamRDNXdjbTkwYjNSNWNHVjhmSFE5UFQxdWRXeHNmV1Y0Y0c5eWRIdHBjMFZ5Y201dlEyOWtaU3hwYzA1dmJrVnRjSFI1VTNSeWFXNW5MR2x6VDJKcVpXTjBMR2x6VUd4aGFXNVNaV052Y21Rc2FYTlVhR1Z1WVdKc1pYMDdJaXdpYVcxd2IzSjBlMmx6VDJKcVpXTjBmV1p5YjIxY0lpTnphR0Z5WldRdlozVmhjbVJ6TG1welhDSTdablZ1WTNScGIyNGdkRzlGY25KdmNrMWxjM05oWjJVb2RDbDdjbVYwZFhKdUlIUWdhVzV6ZEdGdVkyVnZaaUJGY25KdmNqOTBMbTFsYzNOaFoyVTZkSGx3Wlc5bUlIUTlQV0J6ZEhKcGJtZGdQM1E2ZEQwOWJuVnNiRDlUZEhKcGJtY29kQ2s2YVhOUFltcGxZM1FvZENrL2RIbHdaVzltSUhRdWJXVnpjMkZuWlQwOVlITjBjbWx1WjJBbUpuUXViV1Z6YzJGblpTNXNaVzVuZEdnK01EOTBMbTFsYzNOaFoyVTZjMkZtWlVwemIyNVRkSEpwYm1kcFpua29kQ2s2VTNSeWFXNW5LSFFwZldaMWJtTjBhVzl1SUhSdlJYSnliM0lvZENsN2FXWW9kQ0JwYm5OMFlXNWpaVzltSUVWeWNtOXlLWEpsZEhWeWJpQjBPMnhsZENCdVBVVnljbTl5S0hSdlJYSnliM0pOWlhOellXZGxLSFFwS1R0eVpYUjFjbTRnYVhOUFltcGxZM1FvZENrL0tIUjVjR1Z2WmlCMExtNWhiV1U5UFdCemRISnBibWRnSmlaMExtNWhiV1V1YkdWdVozUm9QakFtSmlodUxtNWhiV1U5ZEM1dVlXMWxLU3gwZVhCbGIyWWdkQzV6ZEdGamF6MDlZSE4wY21sdVoyQW1KblF1YzNSaFkyc3ViR1Z1WjNSb1BqQW1KaWh1TG5OMFlXTnJQWFF1YzNSaFkyc3BMR0JqWVhWelpXQnBiaUIwSmlaMExtTmhkWE5sSVQwOWRtOXBaQ0F3SmlaMExtTmhkWE5sSVQwOWRDWW1LRzR1WTJGMWMyVTlkQzVqWVhWelpTa3NiaWs2Ym4xbWRXNWpkR2x2YmlCellXWmxTbk52YmxOMGNtbHVaMmxtZVNobEtYdDBjbmw3Y21WMGRYSnVJRXBUVDA0dWMzUnlhVzVuYVdaNUtHVXBQejlUZEhKcGJtY29aU2w5WTJGMFkyaDdjbVYwZFhKdUlGTjBjbWx1WnlobEtYMTlaWGh3YjNKMGUzUnZSWEp5YjNJc2RHOUZjbkp2Y2sxbGMzTmhaMlY5T3lJc0ltbHRjRzl5ZEh0MGIwTm9ZVzV1Wld4TWIyTmhiRU52Ym5ScGJuVmhkR2x2YmxSdmEyVnVmV1p5YjIxY0lpTnphR0Z5WldRdlkyOXVkR2x1ZFdGMGFXOXVMWFJ2YTJWdUxtcHpYQ0k3YVcxd2IzSjBlMlJsYzJWeWFXRnNhWHBsVlhKc1JtbHNaVkJoY25Rc2FHRnpTVzUwWlhKdVlXeFNaV1pUWTJobGJXVXNhWE5UWlhKcFlXeHBlbVZrVlhKc1JtbHNaVkJoY25SOVpuSnZiVndpSTJsdWRHVnlibUZzTDJGMGRHRmphRzFsYm5SekwzVnliQzF5WldaekxtcHpYQ0k3YVcxd2IzSjBlMlJsWTI5a1pWTmhibVJpYjNoU1pXWXNhWE5UWVc1a1ltOTRVbVZtVlhKc2ZXWnliMjFjSWlOcGJuUmxjbTVoYkM5aGRIUmhZMmh0Wlc1MGN5OXpZVzVrWW05NExYSmxabk11YW5OY0lqdGpiMjV6ZENCRlZrVmZVMFZUVTBsUFRsOUpSRjlJUlVGRVJWSTlZSGd0WlhabExYTmxjM05wYjI0dGFXUmdMRVZXUlY5VFZGSkZRVTFmUms5U1RVRlVYMGhGUVVSRlVqMWdlQzFsZG1VdGMzUnlaV0Z0TFdadmNtMWhkR0FzUlZaRlgxTlVVa1ZCVFY5V1JWSlRTVTlPWDBoRlFVUkZVajFnZUMxbGRtVXRjM1J5WldGdExYWmxjbk5wYjI1Z0xFVldSVjlOUlZOVFFVZEZYMU5VVWtWQlRWOURUMDVVUlU1VVgxUlpVRVU5WUdGd2NHeHBZMkYwYVc5dUwzZ3RibVJxYzI5dU95QmphR0Z5YzJWMFBYVjBaaTA0WUN4RlZrVmZUVVZUVTBGSFJWOVRWRkpGUVUxZlJrOVNUVUZVUFdCdVpHcHpiMjVnTEVWV1JWOU5SVk5UUVVkRlgxTlVVa1ZCVFY5V1JWSlRTVTlPUFdBeE9XQXNkR1Y0ZEVWdVkyOWtaWEk5Ym1WM0lGUmxlSFJGYm1OdlpHVnlPMloxYm1OMGFXOXVJR2x6UTNWeWNtVnVkRlIxY201Q2IzVnVaR0Z5ZVVWMlpXNTBLR1VwZTNKbGRIVnliaUJsTG5SNWNHVTlQVDFnYzJWemMybHZiaTVqYjIxd2JHVjBaV1JnZkh4bExuUjVjR1U5UFQxZ2MyVnpjMmx2Ymk1bVlXbHNaV1JnZkh4bExuUjVjR1U5UFQxZ2MyVnpjMmx2Ymk1M1lXbDBhVzVuWUgxbWRXNWpkR2x2YmlCcGMxUjFjbTVHWVdsc2RYSmxSWFpsYm5Rb1pTbDdjbVYwZFhKdUlHVXVkSGx3WlQwOVBXQnpaWE56YVc5dUxtWmhhV3hsWkdCOGZHVXVkSGx3WlQwOVBXQnpkR1Z3TG1aaGFXeGxaR0I4ZkdVdWRIbHdaVDA5UFdCMGRYSnVMbVpoYVd4bFpHQjlablZ1WTNScGIyNGdZM0psWVhSbFUyVnpjMmx2YmxOMFlYSjBaV1JGZG1WdWRDaGxLWHRzWlhRZ2REMTdmVHR5WlhSMWNtNGdaVDh1YVc1MmIyTmhkR2x2YmlFOVBYWnZhV1FnTUNZbUtIUXVhVzUyYjJOaGRHbHZiajFsTG1sdWRtOWpZWFJwYjI0cExHVS9MbkoxYm5ScGJXVWhQVDEyYjJsa0lEQW1KaWgwTG5KMWJuUnBiV1U5WlM1eWRXNTBhVzFsS1N4N1pHRjBZVHAwTEhSNWNHVTZZSE5sYzNOcGIyNHVjM1JoY25SbFpHQjlmV1oxYm1OMGFXOXVJR055WldGMFpWUjFjbTVUZEdGeWRHVmtSWFpsYm5Rb1pTbDdjbVYwZFhKdWUyUmhkR0U2ZTNObGNYVmxibU5sT21VdWMyVnhkV1Z1WTJVc2RIVnlia2xrT21VdWRIVnlia2xrZlN4MGVYQmxPbUIwZFhKdUxuTjBZWEowWldSZ2ZYMW1kVzVqZEdsdmJpQmpjbVZoZEdWTlpYTnpZV2RsVW1WalpXbDJaV1JGZG1WdWRDaGxLWHR5WlhSMWNtNTdaR0YwWVRwN2JXVnpjMkZuWlRwemRXMXRZWEpwZW1WVmMyVnlRMjl1ZEdWdWRDaGxMbTFsYzNOaFoyVXBMSEJoY25Sek9uQnliMnBsWTNSVmMyVnlRMjl1ZEdWdWRGQmhjblJ6S0dVdWJXVnpjMkZuWlNrc2MyVnhkV1Z1WTJVNlpTNXpaWEYxWlc1alpTeDBkWEp1U1dRNlpTNTBkWEp1U1dSOUxIUjVjR1U2WUcxbGMzTmhaMlV1Y21WalpXbDJaV1JnZlgxbWRXNWpkR2x2YmlCemRXMXRZWEpwZW1WVmMyVnlRMjl1ZEdWdWRDaGxLWHRwWmloMGVYQmxiMllnWlQwOVlITjBjbWx1WjJBcGNtVjBkWEp1SUdVN2JHVjBJSFE5VzEwN1ptOXlLR3hsZENCdUlHOW1JR1VwYVdZb2JpNTBlWEJsUFQwOVlIUmxlSFJnS1hRdWNIVnphQ2h1TG5SbGVIUXBPMlZzYzJVZ2FXWW9iaTUwZVhCbFBUMDlZR1pwYkdWZ0tYdHNaWFFnWlQxdUxtWnBiR1Z1WVcxbFB6OXVMbTFsWkdsaFZIbHdaVHQwTG5CMWMyZ29ZRnRtYVd4bE9pQWtlMlY5SUNna2UyNHViV1ZrYVdGVWVYQmxmU2xkWUNsOVpXeHpaU0J1TG5SNWNHVTlQVDFnYVcxaFoyVmdKaVowTG5CMWMyZ29ZRnRwYldGblpUb2dKSHR1TG0xbFpHbGhWSGx3WlQ4L1lHbHRZV2RsWUgxZFlDazdjbVYwZFhKdUlIUXVhbTlwYmloZ1hHNWdLWDFtZFc1amRHbHZiaUJ3Y205cVpXTjBWWE5sY2tOdmJuUmxiblJRWVhKMGN5aGxLWHRwWmloMGVYQmxiMllnWlQwOVlITjBjbWx1WjJBcGNtVjBkWEp1VzN0MFpYaDBPbVVzZEhsd1pUcGdkR1Y0ZEdCOVhUdHNaWFFnZEQxYlhUdG1iM0lvYkdWMElHNGdiMllnWlNsdUxuUjVjR1U5UFQxZ2RHVjRkR0EvZEM1d2RYTm9LSHQwWlhoME9tNHVkR1Y0ZEN4MGVYQmxPbUIwWlhoMFlIMHBPbTR1ZEhsd1pUMDlQV0JtYVd4bFlEOTBMbkIxYzJnb2NISnZhbVZqZEVacGJHVk1hV3RsVUdGeWRDaHVMbVJoZEdFc2JpNXRaV1JwWVZSNWNHVXNiaTVtYVd4bGJtRnRaU2twT200dWRIbHdaVDA5UFdCcGJXRm5aV0FtSm5RdWNIVnphQ2h3Y205cVpXTjBSbWxzWlV4cGEyVlFZWEowS0c0dWFXMWhaMlVzYmk1dFpXUnBZVlI1Y0dVL1AyQmhjSEJzYVdOaGRHbHZiaTl2WTNSbGRDMXpkSEpsWVcxZ0xIWnZhV1FnTUNrcE8zSmxkSFZ5YmlCMGZXWjFibU4wYVc5dUlIQnliMnBsWTNSR2FXeGxUR2xyWlZCaGNuUW9aU3gwTEc0cGUybG1LR2x6VTJGdVpHSnZlRkpsWmxWeWJDaGxLU2w3YkdWMElIUTlaR1ZqYjJSbFUyRnVaR0p2ZUZKbFppaGxLVHR5WlhSMWNtNGdZM0psWVhSbFVISnZhbVZqZEdWa1JtbHNaVkJoY25Rb2UyWnBiR1Z1WVcxbE9tSmhjMlZ1WVcxbFQyWW9iajgvZEM1d1lYUm9LU3h0WldScFlWUjVjR1U2ZEM1dFpXUnBZVlI1Y0dVc2MybDZaVHAwTG5OcGVtVjlLWDFzWlhRZ2NqMXdjbTlxWldOMFZHRm5aMlZrUm1sc1pVUmhkR0VvWlN4MExHNHBPMmxtS0hJaFBUMTJiMmxrSURBcGNtVjBkWEp1SUhJN2JHVjBJR2s5WW5sMFpVeGxibWQwYUU5bUtHVXBPM0psZEhWeWJpQmpjbVZoZEdWUWNtOXFaV04wWldSR2FXeGxVR0Z5ZENocFBUMDlkbTlwWkNBd1AzdG1hV3hsYm1GdFpUcHVMRzFsWkdsaFZIbHdaVHAwTEM0dUxtTnNhV1Z1ZEZWeWJFWnlZV2R0Wlc1MEtHVXBmVHA3Wm1sc1pXNWhiV1U2Yml4dFpXUnBZVlI1Y0dVNmRDeHphWHBsT21sOUtYMW1kVzVqZEdsdmJpQndjbTlxWldOMFZHRm5aMlZrUm1sc1pVUmhkR0VvWlN4MExHNHBlMmxtS0dselZHRm5aMlZrUm1sc1pVUmhkR0VvWlNrcGMzZHBkR05vS0dVdWRIbHdaU2w3WTJGelpXQmtZWFJoWURwN2JHVjBJSEk5WW5sMFpVeGxibWQwYUU5bUtHVXVaR0YwWVNrN2NtVjBkWEp1SUdOeVpXRjBaVkJ5YjJwbFkzUmxaRVpwYkdWUVlYSjBLSEk5UFQxMmIybGtJREEvZTJacGJHVnVZVzFsT200c2JXVmthV0ZVZVhCbE9uUjlPbnRtYVd4bGJtRnRaVHB1TEcxbFpHbGhWSGx3WlRwMExITnBlbVU2Y24wcGZXTmhjMlZnY21WbVpYSmxibU5sWURwallYTmxZSFJsZUhSZ09uSmxkSFZ5YmlCamNtVmhkR1ZRY205cVpXTjBaV1JHYVd4bFVHRnlkQ2g3Wm1sc1pXNWhiV1U2Yml4dFpXUnBZVlI1Y0dVNmRIMHBPMk5oYzJWZ2RYSnNZRHB5WlhSMWNtNGdZM0psWVhSbFVISnZhbVZqZEdWa1JtbHNaVkJoY25Rb2UyWnBiR1Z1WVcxbE9tNHNiV1ZrYVdGVWVYQmxPblFzTGk0dVkyeHBaVzUwVlhKc1JuSmhaMjFsYm5Rb1pTNTFjbXdwZlNsOWZXWjFibU4wYVc5dUlHTnlaV0YwWlZCeWIycGxZM1JsWkVacGJHVlFZWEowS0dVcGUyeGxkQ0IwUFh0dFpXUnBZVlI1Y0dVNlpTNXRaV1JwWVZSNWNHVXNkSGx3WlRwZ1ptbHNaV0I5TzNKbGRIVnliaUJsTG1acGJHVnVZVzFsSVQwOWRtOXBaQ0F3SmlZb2RDNW1hV3hsYm1GdFpUMWxMbVpwYkdWdVlXMWxLU3hsTG5OcGVtVWhQVDEyYjJsa0lEQW1KaWgwTG5OcGVtVTlaUzV6YVhwbEtTeGxMblZ5YkNFOVBYWnZhV1FnTUNZbUtIUXVkWEpzUFdVdWRYSnNLU3gwZldaMWJtTjBhVzl1SUdselZHRm5aMlZrUm1sc1pVUmhkR0VvWlNsN2FXWW9kSGx3Wlc5bUlHVWhQV0J2WW1wbFkzUmdmSHdoWlNseVpYUjFjbTRoTVR0c1pYUWdkRDFsTG5SNWNHVTdjbVYwZFhKdUlIUTlQVDFnWkdGMFlXQjhmSFE5UFQxZ2NtVm1aWEpsYm1ObFlIeDhkRDA5UFdCMFpYaDBZSHg4ZEQwOVBXQjFjbXhnZldaMWJtTjBhVzl1SUdKNWRHVk1aVzVuZEdoUFppaGxLWHRwWmlobElHbHVjM1JoYm1ObGIyWWdWV2x1ZERoQmNuSmhlWHg4WlNCcGJuTjBZVzVqWlc5bUlFRnljbUY1UW5WbVptVnlLWEpsZEhWeWJpQmxMbUo1ZEdWTVpXNW5kR2g5Wm5WdVkzUnBiMjRnWTJ4cFpXNTBWWEpzUm5KaFoyMWxiblFvWlNsN2FXWW9hWE5UWlhKcFlXeHBlbVZrVlhKc1JtbHNaVkJoY25Rb1pTa3BkSEo1ZTJ4bGRDQnVQV1JsYzJWeWFXRnNhWHBsVlhKc1JtbHNaVkJoY25Rb1pTazdjbVYwZFhKdUlHbHpRMnhwWlc1MFVtVnpiMngyWVdKc1pWVnliQ2h1S1Q5N2RYSnNPbTR1YUhKbFpuMDZlMzE5WTJGMFkyaDdjbVYwZFhKdWUzMTlhV1lvWlNCcGJuTjBZVzVqWlc5bUlGVlNUQ2x5WlhSMWNtNGdhWE5EYkdsbGJuUlNaWE52YkhaaFlteGxWWEpzS0dVcFAzdDFjbXc2WlM1b2NtVm1mVHA3ZlR0cFppaDBlWEJsYjJZZ1pTRTlZSE4wY21sdVoyQjhmR2hoYzBsdWRHVnlibUZzVW1WbVUyTm9aVzFsS0dVcEtYSmxkSFZ5Ym50OU8ybG1LR1V1YzNSaGNuUnpWMmwwYUNoZ1pHRjBZVHBnS1NseVpYUjFjbTU3ZFhKc09tVjlPM1J5ZVh0c1pYUWdkRDF1WlhjZ1ZWSk1LR1VwTzNKbGRIVnliaUJwYzBOc2FXVnVkRkpsYzI5c2RtRmliR1ZWY213b2RDay9lM1Z5YkRwMExtaHlaV1o5T250OWZXTmhkR05vZTNKbGRIVnlibnQ5ZlgxbWRXNWpkR2x2YmlCcGMwTnNhV1Z1ZEZKbGMyOXNkbUZpYkdWVmNtd29aU2w3Y21WMGRYSnVJR1V1Y0hKdmRHOWpiMnc5UFQxZ2FIUjBjRHBnZkh4bExuQnliM1J2WTI5c1BUMDlZR2gwZEhCek9tQjhmR1V1Y0hKdmRHOWpiMnc5UFQxZ1pHRjBZVHBnZldaMWJtTjBhVzl1SUdKaGMyVnVZVzFsVDJZb1pTbDdiR1YwSUhROVpTNXlaWEJzWVdObFFXeHNLR0JjWEZ4Y1lDeGdMMkFwTEc0OWRDNXpiR2xqWlNoMExteGhjM1JKYm1SbGVFOW1LR0F2WUNrck1TazdjbVYwZFhKdUlHNHViR1Z1WjNSb1BqQS9ianBsZldaMWJtTjBhVzl1SUdOeVpXRjBaVUZqZEdsdmJuTlNaWEYxWlhOMFpXUkZkbVZ1ZENobEtYdHlaWFIxY201N1pHRjBZVHA3WVdOMGFXOXVjenBsTG1GamRHbHZibk1zYzJWeGRXVnVZMlU2WlM1elpYRjFaVzVqWlN4emRHVndTVzVrWlhnNlpTNXpkR1Z3U1c1a1pYZ3NkSFZ5Ymtsa09tVXVkSFZ5Ymtsa2ZTeDBlWEJsT21CaFkzUnBiMjV6TG5KbGNYVmxjM1JsWkdCOWZXWjFibU4wYVc5dUlHTnlaV0YwWlVGMWRHaHZjbWw2WVhScGIyNVNaWEYxYVhKbFpFVjJaVzUwS0dVcGUyeGxkQ0IwUFh0a1pYTmpjbWx3ZEdsdmJqcGxMbVJsYzJOeWFYQjBhVzl1TEc1aGJXVTZaUzV1WVcxbExITmxjWFZsYm1ObE9tVXVjMlZ4ZFdWdVkyVXNjM1JsY0VsdVpHVjRPbVV1YzNSbGNFbHVaR1Y0TEhSMWNtNUpaRHBsTG5SMWNtNUpaSDA3Y21WMGRYSnVJR1V1WVhWMGFHOXlhWHBoZEdsdmJpRTlQWFp2YVdRZ01DWW1LSFF1WVhWMGFHOXlhWHBoZEdsdmJqMWxMbUYxZEdodmNtbDZZWFJwYjI0cExHVXVkMlZpYUc5dmExVnliQ0U5UFhadmFXUWdNQ1ltS0hRdWQyVmlhRzl2YTFWeWJEMWxMbmRsWW1odmIydFZjbXdwTEh0a1lYUmhPblFzZEhsd1pUcGdZWFYwYUc5eWFYcGhkR2x2Ymk1eVpYRjFhWEpsWkdCOWZXWjFibU4wYVc5dUlHTnlaV0YwWlVGMWRHaHZjbWw2WVhScGIyNURiMjF3YkdWMFpXUkZkbVZ1ZENobEtYdHNaWFFnZEQxN2JtRnRaVHBsTG01aGJXVXNiM1YwWTI5dFpUcGxMbTkxZEdOdmJXVXNjMlZ4ZFdWdVkyVTZaUzV6WlhGMVpXNWpaU3h6ZEdWd1NXNWtaWGc2WlM1emRHVndTVzVrWlhnc2RIVnlia2xrT21VdWRIVnlia2xrZlR0eVpYUjFjbTRnWlM1aGRYUm9iM0pwZW1GMGFXOXVJVDA5ZG05cFpDQXdKaVlvZEM1aGRYUm9iM0pwZW1GMGFXOXVQV1V1WVhWMGFHOXlhWHBoZEdsdmJpa3NaUzV5WldGemIyNGhQVDEyYjJsa0lEQW1KaWgwTG5KbFlYTnZiajFsTG5KbFlYTnZiaWtzZTJSaGRHRTZkQ3gwZVhCbE9tQmhkWFJvYjNKcGVtRjBhVzl1TG1OdmJYQnNaWFJsWkdCOWZXWjFibU4wYVc5dUlHTnlaV0YwWlVsdWNIVjBVbVZ4ZFdWemRHVmtSWFpsYm5Rb1pTbDdjbVYwZFhKdWUyUmhkR0U2ZTNKbGNYVmxjM1J6T21VdWNtVnhkV1Z6ZEhNc2MyVnhkV1Z1WTJVNlpTNXpaWEYxWlc1alpTeHpkR1Z3U1c1a1pYZzZaUzV6ZEdWd1NXNWtaWGdzZEhWeWJrbGtPbVV1ZEhWeWJrbGtmU3gwZVhCbE9tQnBibkIxZEM1eVpYRjFaWE4wWldSZ2ZYMW1kVzVqZEdsdmJpQmpjbVZoZEdWQlkzUnBiMjVTWlhOMWJIUkZkbVZ1ZENobEtYdHNaWFFnZEQxbExuSmxhbVZqZEdWa1BUMDlJVEEvZTJWeWNtOXlPbUoxYVd4a1FXTjBhVzl1VW1WemRXeDBSWEp5YjNJb1pTNXlaWE4xYkhRcExITjBZWFIxY3pwZ2NtVnFaV04wWldSZ2ZUcHViM0p0WVd4cGVtVkJZM1JwYjI1U1pYTjFiSFJQZFhSamIyMWxLR1V1Y21WemRXeDBLVHR5WlhSMWNtNTdaR0YwWVRwN1pYSnliM0k2ZEM1bGNuSnZjaXh5WlhOMWJIUTZaUzV5WlhOMWJIUXNjMlZ4ZFdWdVkyVTZaUzV6WlhGMVpXNWpaU3h6ZEdWd1NXNWtaWGc2WlM1emRHVndTVzVrWlhnc2MzUmhkSFZ6T25RdWMzUmhkSFZ6TEhSMWNtNUpaRHBsTG5SMWNtNUpaSDBzZEhsd1pUcGdZV04wYVc5dUxuSmxjM1ZzZEdCOWZXWjFibU4wYVc5dUlHTnlaV0YwWlZOMVltRm5aVzUwUTJGc2JHVmtSWFpsYm5Rb1pTbDdjbVYwZFhKdWUyUmhkR0U2ZTJOaGJHeEpaRHBsTG1OaGJHeEpaQ3hqYUdsc1pGTmxjM05wYjI1SlpEcGxMbU5vYVd4a1UyVnpjMmx2Ymtsa0xITmxjM05wYjI1SlpEcGxMbk5sYzNOcGIyNUpaQ3h6WlhGMVpXNWpaVHBsTG5ObGNYVmxibU5sTEc1aGJXVTZaUzV1WVcxbExISmxiVzkwWlRwbExuSmxiVzkwWlN4MGIyOXNUbUZ0WlRwbExuUnZiMnhPWVcxbExIUjFjbTVKWkRwbExuUjFjbTVKWkN4M2IzSnJabXh2ZDBsa09tVXVkMjl5YTJac2IzZEpaSDBzZEhsd1pUcGdjM1ZpWVdkbGJuUXVZMkZzYkdWa1lIMTlablZ1WTNScGIyNGdZM0psWVhSbFRXVnpjMkZuWlVGd2NHVnVaR1ZrUlhabGJuUW9aU2w3Y21WMGRYSnVlMlJoZEdFNmUyMWxjM05oWjJWRVpXeDBZVHBsTG0xbGMzTmhaMlZFWld4MFlTeHRaWE56WVdkbFUyOUdZWEk2WlM1dFpYTnpZV2RsVTI5R1lYSXNjMlZ4ZFdWdVkyVTZaUzV6WlhGMVpXNWpaU3h6ZEdWd1NXNWtaWGc2WlM1emRHVndTVzVrWlhnc2RIVnlia2xrT21VdWRIVnlia2xrZlN4MGVYQmxPbUJ0WlhOellXZGxMbUZ3Y0dWdVpHVmtZSDE5Wm5WdVkzUnBiMjRnWTNKbFlYUmxVbVZoYzI5dWFXNW5R",
	"WEJ3Wlc1a1pXUkZkbVZ1ZENobEtYdHlaWFIxY201N1pHRjBZVHA3Y21WaGMyOXVhVzVuUkdWc2RHRTZaUzV5WldGemIyNXBibWRFWld4MFlTeHlaV0Z6YjI1cGJtZFRiMFpoY2pwbExuSmxZWE52Ym1sdVoxTnZSbUZ5TEhObGNYVmxibU5sT21VdWMyVnhkV1Z1WTJVc2MzUmxjRWx1WkdWNE9tVXVjM1JsY0VsdVpHVjRMSFIxY201SlpEcGxMblIxY201SlpIMHNkSGx3WlRwZ2NtVmhjMjl1YVc1bkxtRndjR1Z1WkdWa1lIMTlablZ1WTNScGIyNGdZM0psWVhSbFRXVnpjMkZuWlVOdmJYQnNaWFJsWkVWMlpXNTBLR1VwZTNKbGRIVnlibnRrWVhSaE9udG1hVzVwYzJoU1pXRnpiMjQ2WlM1bWFXNXBjMmhTWldGemIyNC9QMkJ6ZEc5d1lDeHRaWE56WVdkbE9tVXViV1Z6YzJGblpTeHpaWEYxWlc1alpUcGxMbk5sY1hWbGJtTmxMSE4wWlhCSmJtUmxlRHBsTG5OMFpYQkpibVJsZUN4MGRYSnVTV1E2WlM1MGRYSnVTV1I5TEhSNWNHVTZZRzFsYzNOaFoyVXVZMjl0Y0d4bGRHVmtZSDE5Wm5WdVkzUnBiMjRnWTNKbFlYUmxVbVZoYzI5dWFXNW5RMjl0Y0d4bGRHVmtSWFpsYm5Rb1pTbDdjbVYwZFhKdWUyUmhkR0U2ZTNKbFlYTnZibWx1WnpwbExuSmxZWE52Ym1sdVp5eHpaWEYxWlc1alpUcGxMbk5sY1hWbGJtTmxMSE4wWlhCSmJtUmxlRHBsTG5OMFpYQkpibVJsZUN4MGRYSnVTV1E2WlM1MGRYSnVTV1I5TEhSNWNHVTZZSEpsWVhOdmJtbHVaeTVqYjIxd2JHVjBaV1JnZlgxbWRXNWpkR2x2YmlCamNtVmhkR1ZTWlhOMWJIUkRiMjF3YkdWMFpXUkZkbVZ1ZENobEtYdHlaWFIxY201N1pHRjBZVHA3Y21WemRXeDBPbVV1Y21WemRXeDBMSE5sY1hWbGJtTmxPbVV1YzJWeGRXVnVZMlVzYzNSbGNFbHVaR1Y0T21VdWMzUmxjRWx1WkdWNExIUjFjbTVKWkRwbExuUjFjbTVKWkgwc2RIbHdaVHBnY21WemRXeDBMbU52YlhCc1pYUmxaR0I5ZldaMWJtTjBhVzl1SUdOeVpXRjBaVk4wWlhCVGRHRnlkR1ZrUlhabGJuUW9aU2w3Y21WMGRYSnVlMlJoZEdFNmUzTmxjWFZsYm1ObE9tVXVjMlZ4ZFdWdVkyVXNjM1JsY0VsdVpHVjRPbVV1YzNSbGNFbHVaR1Y0TEhSMWNtNUpaRHBsTG5SMWNtNUpaSDBzZEhsd1pUcGdjM1JsY0M1emRHRnlkR1ZrWUgxOVpuVnVZM1JwYjI0Z1kzSmxZWFJsVTNSbGNFTnZiWEJzWlhSbFpFVjJaVzUwS0dVcGUyeGxkQ0IwUFh0bWFXNXBjMmhTWldGemIyNDZaUzVtYVc1cGMyaFNaV0Z6YjI0c2MyVnhkV1Z1WTJVNlpTNXpaWEYxWlc1alpTeHpkR1Z3U1c1a1pYZzZaUzV6ZEdWd1NXNWtaWGdzZEhWeWJrbGtPbVV1ZEhWeWJrbGtmVHR5WlhSMWNtNGdaUzUxYzJGblpTRTlQWFp2YVdRZ01DWW1LSFF1ZFhOaFoyVTlaUzUxYzJGblpTa3NaUzV3Y205MmFXUmxjazFsZEdGa1lYUmhJVDA5ZG05cFpDQXdKaVlvZEM1d2NtOTJhV1JsY2sxbGRHRmtZWFJoUFdVdWNISnZkbWxrWlhKTlpYUmhaR0YwWVNrc2UyUmhkR0U2ZEN4MGVYQmxPbUJ6ZEdWd0xtTnZiWEJzWlhSbFpHQjlmV1oxYm1OMGFXOXVJR055WldGMFpWTjBaWEJHWVdsc1pXUkZkbVZ1ZENobEtYdHlaWFIxY201N1pHRjBZVHA3WTI5a1pUcGxMbU52WkdVc1pHVjBZV2xzY3pwbExtUmxkR0ZwYkhNc2JXVnpjMkZuWlRwbExtMWxjM05oWjJVc2MyVnhkV1Z1WTJVNlpTNXpaWEYxWlc1alpTeHpkR1Z3U1c1a1pYZzZaUzV6ZEdWd1NXNWtaWGdzZEhWeWJrbGtPbVV1ZEhWeWJrbGtmU3gwZVhCbE9tQnpkR1Z3TG1aaGFXeGxaR0I5ZldaMWJtTjBhVzl1SUdOeVpXRjBaVlIxY201RGIyMXdiR1YwWldSRmRtVnVkQ2hsS1h0eVpYUjFjbTU3WkdGMFlUcDdjMlZ4ZFdWdVkyVTZaUzV6WlhGMVpXNWpaU3gwZFhKdVNXUTZaUzUwZFhKdVNXUjlMSFI1Y0dVNllIUjFjbTR1WTI5dGNHeGxkR1ZrWUgxOVpuVnVZM1JwYjI0Z1kzSmxZWFJsVkhWeWJrWmhhV3hsWkVWMlpXNTBLR1VwZTNKbGRIVnlibnRrWVhSaE9udGpiMlJsT21VdVkyOWtaU3hrWlhSaGFXeHpPbVV1WkdWMFlXbHNjeXh0WlhOellXZGxPbVV1YldWemMyRm5aU3h6WlhGMVpXNWpaVHBsTG5ObGNYVmxibU5sTEhSMWNtNUpaRHBsTG5SMWNtNUpaSDBzZEhsd1pUcGdkSFZ5Ymk1bVlXbHNaV1JnZlgxbWRXNWpkR2x2YmlCamNtVmhkR1ZVZFhKdVEyRnVZMlZzYkdWa1JYWmxiblFvWlNsN2NtVjBkWEp1ZTJSaGRHRTZlM05sY1hWbGJtTmxPbVV1YzJWeGRXVnVZMlVzZEhWeWJrbGtPbVV1ZEhWeWJrbGtmU3gwZVhCbE9tQjBkWEp1TG1OaGJtTmxiR3hsWkdCOWZXWjFibU4wYVc5dUlHTnlaV0YwWlVOdmJYQmhZM1JwYjI1U1pYRjFaWE4wWldSRmRtVnVkQ2hsS1h0eVpYUjFjbTU3WkdGMFlUcDdiVzlrWld4SlpEcGxMbTF2WkdWc1NXUXNjMlZ4ZFdWdVkyVTZaUzV6WlhGMVpXNWpaU3h6WlhOemFXOXVTV1E2WlM1elpYTnphVzl1U1dRc2RIVnlia2xrT21VdWRIVnlia2xrTEhWellXZGxTVzV3ZFhSVWIydGxibk02WlM1MWMyRm5aVWx1Y0hWMFZHOXJaVzV6UHo5dWRXeHNmU3gwZVhCbE9tQmpiMjF3WVdOMGFXOXVMbkpsY1hWbGMzUmxaR0I5ZldaMWJtTjBhVzl1SUdOeVpXRjBaVU52YlhCaFkzUnBiMjVEYjIxd2JHVjBaV1JGZG1WdWRDaGxLWHR5WlhSMWNtNTdaR0YwWVRwN2JXOWtaV3hKWkRwbExtMXZaR1ZzU1dRc2MyVnhkV1Z1WTJVNlpTNXpaWEYxWlc1alpTeHpaWE56YVc5dVNXUTZaUzV6WlhOemFXOXVTV1FzZEhWeWJrbGtPbVV1ZEhWeWJrbGtmU3gwZVhCbE9tQmpiMjF3WVdOMGFXOXVMbU52YlhCc1pYUmxaR0I5ZldaMWJtTjBhVzl1SUdOeVpXRjBaVk5sYzNOcGIyNVhZV2wwYVc1blJYWmxiblFvZENsN2NtVjBkWEp1ZTJSaGRHRTZlMk52Ym5ScGJuVmhkR2x2YmxSdmEyVnVPblJ2UTJoaGJtNWxiRXh2WTJGc1EyOXVkR2x1ZFdGMGFXOXVWRzlyWlc0b2RDa3NkMkZwZERwZ2JtVjRkQzExYzJWeUxXMWxjM05oWjJWZ2ZTeDBlWEJsT21CelpYTnphVzl1TG5kaGFYUnBibWRnZlgxbWRXNWpkR2x2YmlCamNtVmhkR1ZUWlhOemFXOXVSbUZwYkdWa1JYWmxiblFvWlNsN2NtVjBkWEp1ZTJSaGRHRTZlMk52WkdVNlpTNWpiMlJsTEdSbGRHRnBiSE02WlM1a1pYUmhhV3h6TEcxbGMzTmhaMlU2WlM1dFpYTnpZV2RsTEhObGMzTnBiMjVKWkRwbExuTmxjM05wYjI1SlpIMHNkSGx3WlRwZ2MyVnpjMmx2Ymk1bVlXbHNaV1JnZlgxbWRXNWpkR2x2YmlCamNtVmhkR1ZUWlhOemFXOXVRMjl0Y0d4bGRHVmtSWFpsYm5Rb0tYdHlaWFIxY201N2RIbHdaVHBnYzJWemMybHZiaTVqYjIxd2JHVjBaV1JnZlgxbWRXNWpkR2x2YmlCMGFXMWxjM1JoYlhCSVlXNWtiR1ZOWlhOellXZGxVM1J5WldGdFJYWmxiblFvWlN4MFBXNWxkeUJFWVhSbEtDa3VkRzlKVTA5VGRISnBibWNvS1NsN2NtVjBkWEp1ZXk0dUxtVXNiV1YwWVRwN1lYUTZkSDE5ZldaMWJtTjBhVzl1SUdWdVkyOWtaVTFsYzNOaFoyVlRkSEpsWVcxRmRtVnVkQ2hsS1h0eVpYUjFjbTRnZEdWNGRFVnVZMjlrWlhJdVpXNWpiMlJsS0dBa2UwcFRUMDR1YzNSeWFXNW5hV1o1S0dVcGZWeGNibUFwZldaMWJtTjBhVzl1SUc1dmNtMWhiR2w2WlVGamRHbHZibEpsYzNWc2RFOTFkR052YldVb1pTbDdhV1lvWlM1cGMwVnljbTl5UFQwOUlUQXBjbVYwZFhKdWUyVnljbTl5T21KMWFXeGtRV04wYVc5dVVtVnpkV3gwUlhKeWIzSW9aU2tzYzNSaGRIVnpPbUJtWVdsc1pXUmdmVHRzWlhRZ2REMXlaV0ZrUVdOMGFXOXVVbVZ6ZFd4MFQzVjBjSFYwUlhKeWIzSW9aUzV2ZFhSd2RYUXBPM0psZEhWeWJpQjBQVDA5ZG05cFpDQXdQM3R6ZEdGMGRYTTZZR052YlhCc1pYUmxaR0I5T250bGNuSnZjanAwTEhOMFlYUjFjenBnWm1GcGJHVmtZSDE5Wm5WdVkzUnBiMjRnWW5WcGJHUkJZM1JwYjI1U1pYTjFiSFJGY25KdmNpaGxLWHRzWlhRZ2REMXlaV0ZrUVdOMGFXOXVVbVZ6ZFd4MFQzVjBjSFYwUlhKeWIzSW9aUzV2ZFhSd2RYUXBPM0psZEhWeWJpQjBQVDA5ZG05cFpDQXdQM3RqYjJSbE9tQkJRMVJKVDA1ZlVrVlRWVXhVWDBaQlNVeEZSR0FzYldWemMyRm5aVHBtYjNKdFlYUkJZM1JwYjI1U1pYTjFiSFJQZFhSd2RYUW9aUzV2ZFhSd2RYUXBmVHAwZldaMWJtTjBhVzl1SUhKbFlXUkJZM1JwYjI1U1pYTjFiSFJQZFhSd2RYUkZjbkp2Y2lobEtYdHNaWFFnZEQxd1lYSnpaVUZqZEdsdmJsSmxjM1ZzZEU5MWRIQjFkRkpsWTI5eVpDaGxLVHRwWmloMFBUMDlkbTlwWkNBd0tYSmxkSFZ5Ymp0c1pYUWdiajEwZVhCbGIyWWdkQzVqYjJSbFBUMWdjM1J5YVc1bllDWW1kQzVqYjJSbExteGxibWQwYUQ0d1AzUXVZMjlrWlRwMmIybGtJREFzY2oxMGVYQmxiMllnZEM1dFpYTnpZV2RsUFQxZ2MzUnlhVzVuWUNZbWRDNXRaWE56WVdkbExteGxibWQwYUQ0d1AzUXViV1Z6YzJGblpUcDJiMmxrSURBN2FXWW9JU2h1UFQwOWRtOXBaQ0F3Zkh4eVBUMDlkbTlwWkNBd0tTbHlaWFIxY201N1kyOWtaVHB1TEcxbGMzTmhaMlU2Y24xOVpuVnVZM1JwYjI0Z2NHRnljMlZCWTNScGIyNVNaWE4xYkhSUGRYUndkWFJTWldOdmNtUW9aU2w3YVdZb2RIbHdaVzltSUdVOVBXQnZZbXBsWTNSZ0ppWmxLWEpsZEhWeWJpQmxPMmxtS0hSNWNHVnZaaUJsSVQxZ2MzUnlhVzVuWUNseVpYUjFjbTQ3YkdWMElIUTlaUzUwY21sdEtDazdhV1lvZEM1c1pXNW5kR2doUFQwd0tYUnllWHRzWlhRZ1pUMUtVMDlPTG5CaGNuTmxLSFFwTzJsbUtIUjVjR1Z2WmlCbFBUMWdiMkpxWldOMFlDWW1aU2x5WlhSMWNtNGdaWDFqWVhSamFIdHlaWFIxY201OWZXWjFibU4wYVc5dUlHWnZjbTFoZEVGamRHbHZibEpsYzNWc2RFOTFkSEIxZENobEtYdHBaaWgwZVhCbGIyWWdaVDA5WUhOMGNtbHVaMkFwY21WMGRYSnVJR1U3YkdWMElIUTlTbE5QVGk1emRISnBibWRwWm5rb1pTazdjbVYwZFhKdUlIUjVjR1Z2WmlCMFBUMWdjM1J5YVc1bllDWW1kQzVzWlc1bmRHZytNRDkwT21CQlkzUnBiMjRnWm1GcGJHVmtMbUI5Wlhod2IzSjBlMFZXUlY5TlJWTlRRVWRGWDFOVVVrVkJUVjlEVDA1VVJVNVVYMVJaVUVVc1JWWkZYMDFGVTFOQlIwVmZVMVJTUlVGTlgwWlBVazFCVkN4RlZrVmZUVVZUVTBGSFJWOVRWRkpGUVUxZlZrVlNVMGxQVGl4RlZrVmZVMFZUVTBsUFRsOUpSRjlJUlVGRVJWSXNSVlpGWDFOVVVrVkJUVjlHVDFKTlFWUmZTRVZCUkVWU0xFVldSVjlUVkZKRlFVMWZWa1ZTVTBsUFRsOUlSVUZFUlZJc1kzSmxZWFJsUVdOMGFXOXVVbVZ6ZFd4MFJYWmxiblFzWTNKbFlYUmxRV04wYVc5dWMxSmxjWFZsYzNSbFpFVjJaVzUwTEdOeVpXRjBaVUYxZEdodmNtbDZZWFJwYjI1RGIyMXdiR1YwWldSRmRtVnVkQ3hqY21WaGRHVkJkWFJvYjNKcGVtRjBhVzl1VW1WeGRXbHlaV1JGZG1WdWRDeGpjbVZoZEdWRGIyMXdZV04wYVc5dVEyOXRjR3hsZEdWa1JYWmxiblFzWTNKbFlYUmxRMjl0Y0dGamRHbHZibEpsY1hWbGMzUmxaRVYyWlc1MExHTnlaV0YwWlVsdWNIVjBVbVZ4ZFdWemRHVmtSWFpsYm5Rc1kzSmxZWFJsVFdWemMyRm5aVUZ3Y0dWdVpHVmtSWFpsYm5Rc1kzSmxZWFJsVFdWemMyRm5aVU52YlhCc1pYUmxaRVYyWlc1MExHTnlaV0YwWlUxbGMzTmhaMlZTWldObGFYWmxaRVYyWlc1MExHTnlaV0YwWlZKbFlYTnZibWx1WjBGd2NHVnVaR1ZrUlhabGJuUXNZM0psWVhSbFVtVmhjMjl1YVc1blEyOXRjR3hsZEdWa1JYWmxiblFzWTNKbFlYUmxVbVZ6ZFd4MFEyOXRjR3hsZEdWa1JYWmxiblFzWTNKbFlYUmxVMlZ6YzJsdmJrTnZiWEJzWlhSbFpFVjJaVzUwTEdOeVpXRjBaVk5sYzNOcGIyNUdZV2xzWldSRmRtVnVkQ3hqY21WaGRHVlRaWE56YVc5dVUzUmhjblJsWkVWMlpXNTBMR055WldGMFpWTmxjM05wYjI1WFlXbDBhVzVuUlhabGJuUXNZM0psWVhSbFUzUmxjRU52YlhCc1pYUmxaRVYyWlc1MExHTnlaV0YwWlZOMFpYQkdZV2xzWldSRmRtVnVkQ3hqY21WaGRHVlRkR1Z3VTNSaGNuUmxaRVYyWlc1MExHTnlaV0YwWlZOMVltRm5aVzUwUTJGc2JHVmtSWFpsYm5Rc1kzSmxZWFJsVkhWeWJrTmhibU5sYkd4bFpFVjJaVzUwTEdOeVpXRjBaVlIxY201RGIyMXdiR1YwWldSRmRtVnVkQ3hqY21WaGRHVlVkWEp1Um1GcGJHVmtSWFpsYm5Rc1kzSmxZWFJsVkhWeWJsTjBZWEowWldSRmRtVnVkQ3hsYm1OdlpHVk5aWE56WVdkbFUzUnlaV0Z0UlhabGJuUXNhWE5EZFhKeVpXNTBWSFZ5YmtKdmRXNWtZWEo1UlhabGJuUXNhWE5VZFhKdVJtRnBiSFZ5WlVWMlpXNTBMSFJwYldWemRHRnRjRWhoYm1Sc1pVMWxjM05oWjJWVGRISmxZVzFGZG1WdWRIMDdJaXdpWm5WdVkzUnBiMjRnWjJWMFVuVnVkR2x0WlVGamRHbHZibEpsY1hWbGMzUkxaWGtvWlNsN2MzZHBkR05vS0dVdWEybHVaQ2w3WTJGelpXQnNiMkZrTFhOcmFXeHNZRHB5WlhSMWNtNWdjblZ1ZEdsdFpTMWhZM1JwYjI0NkpIdGxMbXRwYm1SOU9pUjdaUzVqWVd4c1NXUjlZRHRqWVhObFlISmxiVzkwWlMxaFoyVnVkQzFqWVd4c1lEcHlaWFIxY201Z2MzVmlZV2RsYm5RdFkyRnNiRG9rZTJVdWNtVnRiM1JsUVdkbGJuUk9ZVzFsZlRva2UyVXVZMkZzYkVsa2ZXQTdZMkZ6WldCemRXSmhaMlZ1ZEMxallXeHNZRHB5WlhSMWNtNWdjM1ZpWVdkbGJuUXRZMkZzYkRva2UyVXVjM1ZpWVdkbGJuUk9ZVzFsZlRva2UyVXVZMkZzYkVsa2ZXQTdZMkZ6WldCMGIyOXNMV05oYkd4Z09uSmxkSFZ5Ym1CMGIyOXNMV05oYkd3NkpIdGxMblJ2YjJ4T1lXMWxmVG9rZTJVdVkyRnNiRWxrZldCOWZXWjFibU4wYVc5dUlHZGxkRkoxYm5ScGJXVkJZM1JwYjI1U1pYTjFiSFJMWlhrb1pTbDdjM2RwZEdOb0tHVXVhMmx1WkNsN1kyRnpaV0JzYjJGa0xYTnJhV3hzTFhKbGMzVnNkR0E2Y21WMGRYSnVZSEoxYm5ScGJXVXRZV04wYVc5dU9teHZZV1F0YzJ0cGJHdzZKSHRsTG1OaGJHeEpaSDFnTzJOaGMyVmdjM1ZpWVdkbGJuUXRjbVZ6ZFd4MFlEcHlaWFIxY201Z2MzVmlZV2RsYm5RdFkyRnNiRG9rZTJVdWMzVmlZV2RsYm5ST1lXMWxmVG9rZTJVdVkyRnNiRWxrZldBN1kyRnpaV0IwYjI5c0xYSmxjM1ZzZEdBNmNtVjBkWEp1WUhSdmIyd3RZMkZzYkRva2UyVXVkRzl2YkU1aGJXVjlPaVI3WlM1allXeHNTV1I5WUgxOVpYaHdiM0owZTJkbGRGSjFiblJwYldWQlkzUnBiMjVTWlhGMVpYTjBTMlY1TEdkbGRGSjFiblJwYldWQlkzUnBiMjVTWlhOMWJIUkxaWGw5T3lJc0ltbHRjRzl5ZEh0amNtVmhkR1ZCWTNScGIyNVNaWE4xYkhSRmRtVnVkSDFtY205dFhDSWpjSEp2ZEc5amIyd3ZiV1Z6YzJGblpTNXFjMXdpTzJsdGNHOXlkSHR3WVhKelpVcHpiMjVQWW1wbFkzUjlabkp2YlZ3aUkzTm9ZWEpsWkM5cWMyOXVMbXB6WENJN2FXMXdiM0owZTJOc1pXRnlVSEp2ZUhsSmJuQjFkRkpsY1hWbGMzUnpSbTl5UTJocGJHUjlabkp2YlZ3aUkyaGhjbTVsYzNNdmNISnZlSGt0YVc1d2RYUXRjbVZ4ZFdWemRITXVhbk5jSWp0cGJYQnZjblI3WVdOamRXMTFiR0YwWlZObGMzTnBiMjVWYzJGblpTeG5aWFJVZFhKdVZYTmhaMlZUZEdGMFpTeHpaWFJVZFhKdVZYTmhaMlZUZEdGMFpYMW1jbTl0WENJamFHRnlibVZ6Y3k5MGRYSnVMWFJoWnkxemRHRjBaUzVxYzF3aU8ybHRjRzl5ZEh0blpYUlNkVzUwYVcxbFFXTjBhVzl1VW1WeGRXVnpkRXRsZVN4blpYUlNkVzUwYVcxbFFXTjBhVzl1VW1WemRXeDBTMlY1ZldaeWIyMWNJaU55ZFc1MGFXMWxMMkZqZEdsdmJuTXZhMlY1Y3k1cWMxd2lPMk52Ym5OMElGQkZUa1JKVGtkZlVsVk9WRWxOUlY5QlExUkpUMDVmUWtGVVEwaGZTMFZaUFdCbGRtVXVjblZ1ZEdsdFpTNXdaVzVrYVc1blFXTjBhVzl1UW1GMFkyaGdPMloxYm1OMGFXOXVJR2RsZEZCbGJtUnBibWRTZFc1MGFXMWxRV04wYVc5dVFtRjBZMmdvWlNsN2JHVjBJSFE5WlQ4dVcxQkZUa1JKVGtkZlVsVk9WRWxOUlY5QlExUkpUMDVmUWtGVVEwaGZTMFZaWFR0cFppaDBlWEJsYjJZZ2RDRTlZRzlpYW1WamRHQjhmQ0YwS1hKbGRIVnlianRzWlhRZ2JqMTBPMmxtS0NFb0lVRnljbUY1TG1selFYSnlZWGtvYmk1aFkzUnBiMjV6S1h4OElVRnljbUY1TG1selFYSnlZWGtvYmk1eVpYTndiMjV6WlUxbGMzTmhaMlZ6S1h4OGRIbHdaVzltSUc0dVpYWmxiblFoUFdCdlltcGxZM1JnZkh4dUxtVjJaVzUwUFQwOWJuVnNiQ2twY21WMGRYSnVJRzU5Wm5WdVkzUnBiMjRnYUdGelVHVnVaR2x1WjFKMWJuUnBiV1ZCWTNScGIyNUNZWFJqYUNobEtYdHlaWFIxY200Z1oyVjBVR1Z1WkdsdVoxSjFiblJwYldWQlkzUnBiMjVDWVhSamFDaGxLU0U5UFhadmFXUWdNSDFtZFc1amRHbHZiaUJqYkdWaGNsQmxibVJwYm1kU2RXNTBhVzFsUVdOMGFXOXVRbUYwWTJnb1pTbDdhV1lvWlM1emRHRjBaVDh1VzFCRlRrUkpUa2RmVWxWT1ZFbE5SVjlCUTFSSlQwNWZRa0ZVUTBoZlMwVlpYVDA5UFhadmFXUWdNQ2x5WlhSMWNtNGdaVHRzWlhRZ2REMTdMaTR1WlM1emRHRjBaWDA3Y21WMGRYSnVJR1JsYkdWMFpTQjBXMUJGVGtSSlRrZGZVbFZPVkVsTlJWOUJRMVJKVDA1ZlFrRlVRMGhmUzBWWlhTeDdMaTR1WlN4emRHRjBaVHBQWW1wbFkzUXVhMlY1Y3loMEtTNXNaVzVuZEdnK01EOTBPblp2YVdRZ01IMTlablZ1WTNScGIyNGdjMlYwVUdWdVpHbHVaMUoxYm5ScGJXVkJZM1JwYjI1Q1lYUmphQ2hsS1h0c1pYUWdkRDE3TGk0dVpTNXpaWE56YVc5dUxuTjBZWFJsZlR0eVpYUjFjbTRnZEZ0UVJVNUVTVTVIWDFKVlRsUkpUVVZmUVVOVVNVOU9YMEpCVkVOSVgwdEZXVjA5ZTJGamRHbHZibk02V3k0dUxtVXVZV04wYVc5dWMxMHNaWFpsYm5RNlpTNWxkbVZ1ZEN4eVpYTndiMjV6WlUxbGMzTmhaMlZ6T2xzdUxpNWxMbkpsYzNCdmJuTmxUV1Z6YzJGblpYTmRmU3g3TGk0dVpTNXpaWE56YVc5dUxITjBZWFJsT25SOWZXWjFibU4wYVc5dUlISmxZMjl5WkZCbGJtUnBibWRUZFdKaFoyVnVkRU5vYVd4a0tHVXBlMnhsZENCMFBXZGxkRkJsYm1ScGJtZFNkVzUwYVcxbFFXTjBhVzl1UW1GMFkyZ29aUzV6WlhOemFXOXVMbk4wWVhSbEtUdHBaaWgwUFQwOWRtOXBaQ0F3S1hKbGRIVnliaUJsTG5ObGMzTnBiMjQ3YkdWMElHNDlleTR1TG1VdWMyVnpjMmx2Ymk1emRHRjBaWDA3Y21WMGRYSnVJRzViVUVWT1JFbE9SMTlTVlU1VVNVMUZYMEZEVkVsUFRsOUNRVlJEU0Y5TFJWbGRQWHN1TGk1MExDNHVMbVV1WTJocGJHUXVhMmx1WkQwOVBXQnNiMk5oYkdBL2UyTm9hV3hrUTI5dWRHbHVkV0YwYVc5dVZHOXJaVzV6T25zdUxpNTBMbU5vYVd4a1EyOXVkR2x1ZFdGMGFXOXVWRzlyWlc1ekxGdGxMbU5oYkd4SlpGMDZaUzVqYUdsc1pDNWpiMjUwYVc1MVlYUnBiMjVVYjJ0bGJuMTlPbnQ5TEdOb2FXeGtVMlZ6YzJsdmJrbGtjenA3TGk0dWRDNWphR2xzWkZObGMzTnBiMjVKWkhNc1cyVXVZMkZzYkVsa1hUcGxMbU5vYVd4a0xuTmxjM05wYjI1SlpIMTlMSHN1TGk1bExuTmxjM05wYjI0c2MzUmhkR1U2Ym4xOVpuVnVZM1JwYjI0Z2NtVnpiMngyWlZKbFlXUjVVblZ1ZEdsdFpVRmpkR2x2YmxKbGMzVnNkSE1vWlNsN2JHVjBJSFE5WjJWMFVHVnVaR2x1WjFKMWJuUnBiV1ZCWTNScGIyNUNZWFJqYUNobExuTmxjM05wYjI0dWMzUmhkR1VwTzJsbUtIUWhQVDEyYjJsa0lEQXBjbVYwZFhKdUlISmxjMjlzZG1WU2RXNTBhVzFsUVdOMGFXOXVVbVZ6ZFd4MGMwWnZja0poZEdOb0tIdGlZWFJqYURwMExISmxjM1ZzZEhNNlpTNXlaWE4xYkhSemZTbDlablZ1WTNScGIyNGdjbVZ6YjJ4MlpWSjFiblJwYldWQlkzUnBiMjVTWlhOMWJIUnpSbTl5UW1GMFkyZ29aU2w3Y21WMGRYSnVJSEpsYzI5c2RtVlNkVzUwYVcxbFFXTjBhVzl1VW1WemRXeDBjMFp2Y2t0bGVYTW9lM0JsYm1ScGJtZExaWGx6T21VdVltRjBZMmd1WVdOMGFXOXVjeTV0WVhBb1pUMCtaMlYwVW5WdWRHbHRaVUZqZEdsdmJsSmxjWFZsYzNSTFpYa29aU2twTEhKbGMzVnNkSE02WlM1eVpYTjFiSFJ6ZlNsOVpuVnVZM1JwYjI0Z2NtVnpiMngyWlZKMWJuUnBiV1ZCWTNScGIyNVNaWE4xYkhSelJtOXlTMlY1Y3lobEtYdHNaWFFnZEQxdVpYY2dVMlYwS0dVdWNHVnVaR2x1WjB0bGVYTXBMRzQ5Ym1WM0lFMWhjRHRtYjNJb2JHVjBJSElnYjJZZ1pTNXlaWE4xYkhSektYdHNaWFFnWlQxblpYUlNkVzUwYVcxbFFXTjBhVzl1VW1WemRXeDBTMlY1S0hJcE8zUXVhR0Z6S0dVcEppWnVMbk5sZENobExISXBmV3hsZENCeVBWdGRPMlp2Y2loc1pYUWdkQ0J2WmlCbExuQmxibVJwYm1kTFpYbHpLWHRzWlhRZ1pUMXVMbWRsZENoMEtUdHBaaWhsUFQwOWRtOXBaQ0F3S1hKbGRIVnlianR5TG5CMWMyZ29aU2w5Y21WMGRYSnVJSEo5WVhONWJtTWdablZ1WTNScGIyNGdjbVZ6YjJ4MlpWQmxibVJwYm1kU2RXNTBhVzFsUVdOMGFXOXVjeWgwS1h0c1pYUWdhVDFuWlhSUVpXNWthVzVuVW5WdWRHbHRaVUZqZEdsdmJrSmhkR05vS0hRdWMyVnpjMmx2Ymk1emRHRjBaU2s3YVdZb2FUMDlQWFp2YVdRZ01DbHlaWFIxY201N2JXVnpjMkZuWlhNNld5NHVMblF1YzJWemMybHZiaTVvYVhOMGIzSjVYU3h2ZFhSamIyMWxPbUJqYjI1MGFXNTFaV0FzYzJWemMybHZianAwTG5ObGMzTnBiMjU5TzJ4bGRDQmhQWEpsYzI5c2RtVlNaV0ZrZVZKMWJuUnBiV1ZCWTNScGIyNVNaWE4xYkhSektIdHlaWE4xYkhSek9uUXVjM1JsY0VsdWNIVjBQeTV5ZFc1MGFXMWxRV04wYVc5dVVtVnpkV3gwY3o4L1cxMHNjMlZ6YzJsdmJqcDBMbk5sYzNOcGIyNTlLVHRwWmloaFBUMDlkbTlwWkNBd0tYSmxkSFZ5Ym50dFpYTnpZV2RsY3pwYkxpNHVkQzV6WlhOemFXOXVMbWhwYzNSdmNubGRMRzkxZEdOdmJXVTZZSFZ1Y21WemIyeDJaV1JnTEhObGMzTnBiMjQ2ZEM1elpYTnphVzl1ZlR0cFppaDBMbVZ0YVhRaFBUMTJiMmxrSURBcFptOXlLR3hsZENCdUlHOW1JR0VwYmk1cmFXNWtQVDA5WUhOMVltRm5aVzUwTFhKbGMzVnNkR0FtSm00dWFYTkZjbkp2Y2lFOVBTRXdKaVpoZDJGcGRDQjBMbVZ0YVhRb2UyUmhkR0U2ZTJOaGJHeEpaRHB1TG1OaGJHeEpaQ3h2ZFhSd2RYUTZkSGx3Wlc5bUlHNHViM1YwY0hWMFBUMWdjM1J5YVc1bllEOXVMbTkxZEhCMWREcEtVMDlPTG5OMGNtbHVaMmxtZVNodUxtOTFkSEIxZENrc2MzVmlZV2RsYm5ST1lXMWxPbTR1YzNWaVlXZGxiblJPWVcxbGZTeDBlWEJsT21CemRXSmhaMlZ1ZEM1amIyMXdiR1YwWldSZ2ZTa3NZWGRoYVhRZ2RDNWxiV2wwS0dOeVpXRjBaVUZqZEdsdmJsSmxjM1ZzZEVWMlpXNTBLSHR5WlhOMWJIUTZiaXh6WlhGMVpXNWpaVHBwTG1WMlpXNTBMbk5sY1hWbGJtTmxMSE4wWlhCSmJtUmxlRHBwTG1WMlpXNTBMbk4wWlhCSmJtUmxlQ3gwZFhKdVNXUTZhUzVsZG1WdWRDNTBkWEp1U1dSOUtTazdiR1YwSUc4OWV5NHVMblF1YzJWemMybHZiaTV6ZEdGMFpYMDdaR1ZzWlhSbElHOWJVRVZPUkVsT1IxOVNWVTVVU1UxRlgwRkRWRWxQVGw5Q1FWUkRTRjlMUlZsZE8yeGxkQ0J6UFhzdUxpNTBMbk5sYzNOcGIyNHNjM1JoZEdVNlQySnFaV04wTG10bGVYTW9ieWt1YkdWdVozUm9QakEvYnpwMmIybGtJREI5TEdNOWFTNWphR2xzWkVOdmJuUnBiblZoZEdsdmJsUnZhMlZ1Y3p0cFppaGpJVDA5ZG05cFpDQXdLV1p2Y2loc1pYUWdaU0J2WmlCaEtYdHBaaWhsTG10cGJtUWhQVDFnYzNWaVlXZGxiblF0Y21WemRXeDBZQ2xqYjI1MGFXNTFaVHRzWlhRZ2REMWpXMlV1WTJGc2JFbGtYVHQwSVQwOWRtOXBaQ0F3SmlZb2N6MWpiR1ZoY2xCeWIzaDVTVzV3ZFhSU1pYRjFaWE4wYzBadmNrTm9hV3hrS0hNc2RDa3BmV1p2Y2loc1pYUWdaU0J2WmlCaEtXVXVhMmx1WkNFOVBXQnpkV0poWjJWdWRDMXlaWE4xYkhSZ2ZIeGxMblZ6WVdkbFBUMDlkbTlwWkNBd2ZId29jejF6WlhSVWRYSnVWWE5oWjJWVGRHRjBaU2h6TEdGalkzVnRkV3hoZEdWVFpYTnphVzl1VlhOaFoyVW9lM0J5WlhacGIzVnpPbWRsZEZSMWNtNVZjMkZuWlZOMFlYUmxLSE11YzNSaGRHVXBMSFZ6WVdkbE9tVXVkWE5oWjJWOUtTa3BPMnhsZENCc1BXRXViV0Z3S0dVOVBudHpkMmwwWTJnb1pTNXJhVzVrS1h0allYTmxZR3h2WVdRdGMydHBiR3d0Y21WemRXeDBZRHB5WlhSMWNtNTdiM1YwY0hWME9uUnZWRzl2YkZKbGMzVnNkRTkxZEhCMWRDaGxLU3gwYjI5c1EyRnNiRWxrT21VdVkyRnNiRWxrTEhSdmIyeE9ZVzFsT21Cc2IyRmtYM05yYVd4c1lDeDBlWEJsT21CMGIyOXNMWEpsYzNWc2RHQjlPMk5oYzJWZ2MzVmlZV2RsYm5RdGNtVnpkV3gwWURweVpYUjFjbTU3YjNWMGNIVjBPblJ2Vkc5dmJGSmxjM1ZzZEU5MWRIQjFkQ2hsS1N4MGIyOXNRMkZzYkVsa09tVXVZMkZzYkVsa0xIUnZiMnhPWVcxbE9tVXVjM1ZpWVdkbGJuUk9ZVzFsTEhSNWNHVTZZSFJ2YjJ3dGNtVnpkV3gwWUgwN1kyRnpaV0IwYjI5c0xYSmxjM1ZzZEdBNmNtVjBkWEp1ZTI5MWRIQjFkRHAwYjFSdmIyeFNaWE4xYkhSUGRYUndkWFFvWlNrc2RHOXZiRU5oYkd4SlpEcGxMbU5oYkd4SlpDeDBiMjlzVG1GdFpUcGxMblJ2YjJ4T1lXMWxMSFI1Y0dVNllIUnZiMnd0Y21WemRXeDBZSDE5ZEdoeWIzY2dSWEp5YjNJb1lGVnVjM1Z3Y0c5eWRHVmtJSEoxYm5ScGJXVWdZV04wYVc5dUlISmxjM1ZzZENCcmFXNWtJRndpSkh0VGRISnBibWNvWlNsOVhDSXVZQ2w5S1N4MVBWc3VMaTV6TG1ocGMzUnZjbmtzTGk0dWFTNXlaWE53YjI1elpVMWxjM05oWjJWelhUdHlaWFIxY200Z2JDNXNaVzVuZEdnK01DWW1kUzV3ZFhOb0tIdGpiMjUwWlc1ME9td3NjbTlzWlRwZ2RHOXZiR0I5S1N4N2JXVnpj",
	"MkZuWlhNNmRTeHZkWFJqYjIxbE9tQnlaWE52YkhabFpHQXNjMlZ6YzJsdmJqcHpmWDFtZFc1amRHbHZiaUJqY21WaGRHVlNkVzUwYVcxbFFXTjBhVzl1VW1WeGRXVnpkRVp5YjIxVWIyOXNRMkZzYkNobEtYdHNaWFFnZEQxbExuUnZiMnh6TG1kbGRDaGxMblJ2YjJ4RFlXeHNMblJ2YjJ4T1lXMWxLVHR5WlhSMWNtNGdkRDh1Y25WdWRHbHRaVUZqZEdsdmJqOHVhMmx1WkQwOVBXQnpkV0poWjJWdWRDMWpZV3hzWUQ5N1kyRnNiRWxrT21VdWRHOXZiRU5oYkd3dWRHOXZiRU5oYkd4SlpDeGtaWE5qY21sd2RHbHZianAwTG1SbGMyTnlhWEIwYVc5dUxHbHVjSFYwT25KbGMyOXNkbVZVYjI5c1EyRnNiRWx1Y0hWMFQySnFaV04wS0dVdWRHOXZiRU5oYkd3dWFXNXdkWFFzZTJOaGJHeEpaRHBsTG5SdmIyeERZV3hzTG5SdmIyeERZV3hzU1dRc2RHOXZiRTVoYldVNlpTNTBiMjlzUTJGc2JDNTBiMjlzVG1GdFpYMHBMR3RwYm1RNllITjFZbUZuWlc1MExXTmhiR3hnTEc1aGJXVTZkQzV1WVcxbExHNXZaR1ZKWkRwMExuSjFiblJwYldWQlkzUnBiMjR1Ym05a1pVbGtMSE4xWW1GblpXNTBUbUZ0WlRwMExuSjFiblJwYldWQlkzUnBiMjR1YzNWaVlXZGxiblJPWVcxbGZUcDBQeTV5ZFc1MGFXMWxRV04wYVc5dVB5NXJhVzVrUFQwOVlISmxiVzkwWlMxaFoyVnVkQzFqWVd4c1lEOTdZMkZzYkVsa09tVXVkRzl2YkVOaGJHd3VkRzl2YkVOaGJHeEpaQ3hrWlhOamNtbHdkR2x2YmpwMExtUmxjMk55YVhCMGFXOXVMR2x1Y0hWME9uSmxjMjlzZG1WVWIyOXNRMkZzYkVsdWNIVjBUMkpxWldOMEtHVXVkRzl2YkVOaGJHd3VhVzV3ZFhRc2UyTmhiR3hKWkRwbExuUnZiMnhEWVd4c0xuUnZiMnhEWVd4c1NXUXNkRzl2YkU1aGJXVTZaUzUwYjI5c1EyRnNiQzUwYjI5c1RtRnRaWDBwTEd0cGJtUTZZSEpsYlc5MFpTMWhaMlZ1ZEMxallXeHNZQ3h1WVcxbE9uUXVibUZ0WlN4dWIyUmxTV1E2ZEM1eWRXNTBhVzFsUVdOMGFXOXVMbTV2WkdWSlpDeHlaVzF2ZEdWQloyVnVkRTVoYldVNmRDNXlkVzUwYVcxbFFXTjBhVzl1TG5KbGJXOTBaVUZuWlc1MFRtRnRaVDgvZEM1dVlXMWxmVHA3WTJGc2JFbGtPbVV1ZEc5dmJFTmhiR3d1ZEc5dmJFTmhiR3hKWkN4cGJuQjFkRHB5WlhOdmJIWmxWRzl2YkVOaGJHeEpibkIxZEU5aWFtVmpkQ2hsTG5SdmIyeERZV3hzTG1sdWNIVjBMSHRqWVd4c1NXUTZaUzUwYjI5c1EyRnNiQzUwYjI5c1EyRnNiRWxrTEhSdmIyeE9ZVzFsT21VdWRHOXZiRU5oYkd3dWRHOXZiRTVoYldWOUtTeHJhVzVrT21CMGIyOXNMV05oYkd4Z0xIUnZiMnhPWVcxbE9tVXVkRzl2YkVOaGJHd3VkRzl2YkU1aGJXVjlmV1oxYm1OMGFXOXVJSEpsYzI5c2RtVlViMjlzUTJGc2JFbHVjSFYwVDJKcVpXTjBLR1VzYmlsN2FXWW9aVDA5Ym5Wc2JDbHlaWFIxY201N2ZUdDBjbmw3Y21WMGRYSnVJSEJoY25ObFNuTnZiazlpYW1WamRDaGxLWDFqWVhSamFDaGxLWHRzWlhRZ2REMWxJR2x1YzNSaGJtTmxiMllnUlhKeWIzSS9aUzV0WlhOellXZGxPbE4wY21sdVp5aGxLVHQwYUhKdmR5QlVlWEJsUlhKeWIzSW9ZRVpoYVd4bFpDQjBieUJ3WVhKelpTQjBiMjlzTFdOaGJHd2dZWEpuZFcxbGJuUnpJR1p2Y2lCY0lpUjdiaTUwYjI5c1RtRnRaWDFjSWlBb0pIdHVMbU5oYkd4SlpIMHBPaUFrZTNSOVlDeDdZMkYxYzJVNlpYMHBmWDFtZFc1amRHbHZiaUIwYjFSdmIyeFNaWE4xYkhSUGRYUndkWFFvWlNsN2NtVjBkWEp1SUhSNWNHVnZaaUJsTG05MWRIQjFkRDA5WUhOMGNtbHVaMkEvWlM1cGMwVnljbTl5UFQwOUlUQS9lM1I1Y0dVNllHVnljbTl5TFhSbGVIUmdMSFpoYkhWbE9tVXViM1YwY0hWMGZUcDdkSGx3WlRwZ2RHVjRkR0FzZG1Gc2RXVTZaUzV2ZFhSd2RYUjlPbVV1YVhORmNuSnZjajA5UFNFd1AzdDBlWEJsT21CbGNuSnZjaTFxYzI5dVlDeDJZV3gxWlRwMGIwMTFkR0ZpYkdWS2MyOXVWbUZzZFdVb1pTNXZkWFJ3ZFhRcGZUcDdkSGx3WlRwZ2FuTnZibUFzZG1Gc2RXVTZkRzlOZFhSaFlteGxTbk52YmxaaGJIVmxLR1V1YjNWMGNIVjBLWDE5Wm5WdVkzUnBiMjRnZEc5TmRYUmhZbXhsU25OdmJsWmhiSFZsS0dVcGUybG1LR1U5UFQxdWRXeHNmSHgwZVhCbGIyWWdaVDA5WUhOMGNtbHVaMkI4ZkhSNWNHVnZaaUJsUFQxZ2JuVnRZbVZ5WUh4OGRIbHdaVzltSUdVOVBXQmliMjlzWldGdVlDbHlaWFIxY200Z1pUdHBaaWhCY25KaGVTNXBjMEZ5Y21GNUtHVXBLWEpsZEhWeWJpQmxMbTFoY0NobFBUNTBiMDExZEdGaWJHVktjMjl1Vm1Gc2RXVW9aU2twTzJ4bGRDQjBQWHQ5TzJadmNpaHNaWFJiYml4eVhXOW1JRTlpYW1WamRDNWxiblJ5YVdWektHVXBLWFJiYmwwOWRHOU5kWFJoWW14bFNuTnZibFpoYkhWbEtISXBPM0psZEhWeWJpQjBmV1Y0Y0c5eWRIdGpiR1ZoY2xCbGJtUnBibWRTZFc1MGFXMWxRV04wYVc5dVFtRjBZMmdzWTNKbFlYUmxVblZ1ZEdsdFpVRmpkR2x2YmxKbGNYVmxjM1JHY205dFZHOXZiRU5oYkd3c1oyVjBVR1Z1WkdsdVoxSjFiblJwYldWQlkzUnBiMjVDWVhSamFDeG9ZWE5RWlc1a2FXNW5VblZ1ZEdsdFpVRmpkR2x2YmtKaGRHTm9MSEpsWTI5eVpGQmxibVJwYm1kVGRXSmhaMlZ1ZEVOb2FXeGtMSEpsYzI5c2RtVlFaVzVrYVc1blVuVnVkR2x0WlVGamRHbHZibk1zY21WemIyeDJaVkoxYm5ScGJXVkJZM1JwYjI1U1pYTjFiSFJ6Um05eVMyVjVjeXh5WlhOdmJIWmxWRzl2YkVOaGJHeEpibkIxZEU5aWFtVmpkQ3h6WlhSUVpXNWthVzVuVW5WdWRHbHRaVUZqZEdsdmJrSmhkR05vZlRzaUxDSXZLaXBmWDJsdWRHVnlibUZzWDNkdmNtdG1iRzkzYzN0Y0luTjBaWEJ6WENJNmUxd2laR2x6ZEM5emNtTXZaWGhsWTNWMGFXOXVMMlJwYzNCaGRHTm9MWEoxYm5ScGJXVXRZV04wYVc5dWN5MXpkR1Z3TG1welhDSTZlMXdpWkdsemNHRjBZMmhTZFc1MGFXMWxRV04wYVc5dWMxTjBaWEJjSWpwN1hDSnpkR1Z3U1dSY0lqcGNJbk4wWlhBdkwyVjJaVUF3TGpJMExqWXZMMlJwYzNCaGRHTm9VblZ1ZEdsdFpVRmpkR2x2Ym5OVGRHVndYQ0o5ZlgxOUtpODdYRzVsZUhCdmNuUWdkbUZ5SUdScGMzQmhkR05vVW5WdWRHbHRaVUZqZEdsdmJuTlRkR1Z3SUQwZ1oyeHZZbUZzVkdocGMxdFRlVzFpYjJ3dVptOXlLRndpVjA5U1MwWk1UMWRmVlZORlgxTlVSVkJjSWlsZEtGd2ljM1JsY0M4dlpYWmxRREF1TWpRdU5pOHZaR2x6Y0dGMFkyaFNkVzUwYVcxbFFXTjBhVzl1YzFOMFpYQmNJaWs3WEc0aUxDSm1kVzVqZEdsdmJpQnlaWE52YkhabFZtVnlZMlZzVUhKdlpIVmpkR2x2YmtOaGJHeGlZV05yUW1GelpWVnliQ2dwZTNKbGRIVnliaUJ3Y205alpYTnpMbVZ1ZGk1V1JWSkRSVXhmUlU1V1BUMDlZSEJ5YjJSMVkzUnBiMjVnSmlad2NtOWpaWE56TG1WdWRpNVdSVkpEUlV4ZlVGSlBTa1ZEVkY5UVVrOUVWVU5VU1U5T1gxVlNURDlnYUhSMGNITTZMeThrZTNCeWIyTmxjM011Wlc1MkxsWkZVa05GVEY5UVVrOUtSVU5VWDFCU1QwUlZRMVJKVDA1ZlZWSk1mV0E2Ym5Wc2JIMW1kVzVqZEdsdmJpQnlaWE52YkhabFYyOXlhMlpzYjNkRFlXeHNZbUZqYTBKaGMyVlZjbXdvWlNsN2JHVjBJSFE5Y0hKdlkyVnpjeTVsYm5ZdVYwOVNTMFpNVDFkZlRFOURRVXhmUWtGVFJWOVZVa3cvTG5SeWFXMG9LWHg4ZG05cFpDQXdPM0psZEhWeWJpaHlaWE52YkhabFZtVnlZMlZzVUhKdlpIVmpkR2x2YmtOaGJHeGlZV05yUW1GelpWVnliQ2dwUHo5MFB6OWxLUzV5WlhCc1lXTmxLQzljWEM4a0x5eGdZQ2w5Wm5WdVkzUnBiMjRnWTNKbFlYUmxWMjl5YTJac2IzZERZV3hzWW1GamExVnliQ2hsTEhRcGUyeGxkQ0J1UFc1bGR5QlZVa3dvZEN4bEtTeHlQWEJ5YjJObGMzTXVaVzUyTGxaRlVrTkZURjlCVlZSUFRVRlVTVTlPWDBKWlVFRlRVMTlUUlVOU1JWUS9MblJ5YVcwb0tUdHlaWFIxY200Z2NpWW1iaTV6WldGeVkyaFFZWEpoYlhNdWMyVjBLR0I0TFhabGNtTmxiQzF3Y205MFpXTjBhVzl1TFdKNWNHRnpjMkFzY2lrc2JpNTBiMU4wY21sdVp5Z3BmV1Y0Y0c5eWRIdGpjbVZoZEdWWGIzSnJabXh2ZDBOaGJHeGlZV05yVlhKc0xISmxjMjlzZG1WV1pYSmpaV3hRY205a2RXTjBhVzl1UTJGc2JHSmhZMnRDWVhObFZYSnNMSEpsYzI5c2RtVlhiM0pyWm14dmQwTmhiR3hpWVdOclFtRnpaVlZ5YkgwN0lpd2lMeW9xWDE5cGJuUmxjbTVoYkY5M2IzSnJabXh2ZDNON1hDSnpkR1Z3YzF3aU9udGNJbVJwYzNRdmMzSmpMMlY0WldOMWRHbHZiaTkzYjNKclpteHZkeTF6ZEdWd2N5NXFjMXdpT250Y0luUjFjbTVUZEdWd1hDSTZlMXdpYzNSbGNFbGtYQ0k2WENKemRHVndMeTlsZG1WQU1DNHlOQzQyTHk5MGRYSnVVM1JsY0Z3aWZTeGNJbkp2ZFhSbFVISnZlR2xsWkVSbGJHbDJaWEpUZEdWd1hDSTZlMXdpYzNSbGNFbGtYQ0k2WENKemRHVndMeTlsZG1WQU1DNHlOQzQyTHk5eWIzVjBaVkJ5YjNocFpXUkVaV3hwZG1WeVUzUmxjRndpZlN4Y0ltUnBjM0JoZEdOb1ZIVnlibE4wWlhCY0lqcDdYQ0p6ZEdWd1NXUmNJanBjSW5OMFpYQXZMMlYyWlVBd0xqSTBMall2TDJScGMzQmhkR05vVkhWeWJsTjBaWEJjSW4xOWZYMHFMenRjYm1WNGNHOXlkQ0IyWVhJZ2RIVnlibE4wWlhBZ1BTQm5iRzlpWVd4VWFHbHpXMU41YldKdmJDNW1iM0lvWENKWFQxSkxSa3hQVjE5VlUwVmZVMVJGVUZ3aUtWMG9YQ0p6ZEdWd0x5OWxkbVZBTUM0eU5DNDJMeTkwZFhKdVUzUmxjRndpS1R0Y2JtVjRjRzl5ZENCMllYSWdjbTkxZEdWUWNtOTRhV1ZrUkdWc2FYWmxjbE4wWlhBZ1BTQm5iRzlpWVd4VWFHbHpXMU41YldKdmJDNW1iM0lvWENKWFQxSkxSa3hQVjE5VlUwVmZVMVJGVUZ3aUtWMG9YQ0p6ZEdWd0x5OWxkbVZBTUM0eU5DNDJMeTl5YjNWMFpWQnliM2hwWldSRVpXeHBkbVZ5VTNSbGNGd2lLVHRjYm1WNGNHOXlkQ0IyWVhJZ1pHbHpjR0YwWTJoVWRYSnVVM1JsY0NBOUlHZHNiMkpoYkZSb2FYTmJVM2x0WW05c0xtWnZjaWhjSWxkUFVrdEdURTlYWDFWVFJWOVRWRVZRWENJcFhTaGNJbk4wWlhBdkwyVjJaVUF3TGpJMExqWXZMMlJwYzNCaGRHTm9WSFZ5YmxOMFpYQmNJaWs3WEc0aUxDSmpiMjV6ZENCWFQxSkxSa3hQVjE5RFQwNVVSVmhVWDFOWlRVSlBURDFUZVcxaWIyd3VabTl5S0dCWFQxSkxSa3hQVjE5RFQwNVVSVmhVWUNrc1YwOVNTMFpNVDFkZlExSkZRVlJGWDBoUFQwczlVM2x0WW05c0xtWnZjaWhnVjA5U1MwWk1UMWRmUTFKRlFWUkZYMGhQVDB0Z0tTeFhUMUpMUmt4UFYxOUhSVlJmVTFSU1JVRk5YMGxFUFZONWJXSnZiQzVtYjNJb1lGZFBVa3RHVEU5WFgwZEZWRjlUVkZKRlFVMWZTVVJnS1N4WFQxSkxSa3hQVjE5VlUwVmZVMVJGVUQxVGVXMWliMnd1Wm05eUtHQlhUMUpMUmt4UFYxOVZVMFZmVTFSRlVHQXBMRk5VVWtWQlRWOU9RVTFGWDFOWlRVSlBURDFUZVcxaWIyd3VabTl5S0dCWFQxSkxSa3hQVjE5VFZGSkZRVTFmVGtGTlJXQXBMSGR2Y210bWJHOTNSMnh2WW1Gc1BXZHNiMkpoYkZSb2FYTTdkbUZ5SUZKbGRISjVZV0pzWlVWeWNtOXlQV05zWVhOeklHVjRkR1Z1WkhNZ1JYSnliM0o3ZlN4R1lYUmhiRVZ5Y205eVBXTnNZWE56SUdWNGRHVnVaSE1nUlhKeWIzSjdmVHRtZFc1amRHbHZiaUJqY21WaGRHVkliMjlyS0dVcGUyeGxkQ0J1UFhkdmNtdG1iRzkzUjJ4dlltRnNXMWRQVWt0R1RFOVhYME5TUlVGVVJWOUlUMDlMWFR0cFppaHVQVDA5ZG05cFpDQXdLWFJvY205M0lFVnljbTl5S0Z3aVlHTnlaV0YwWlVodmIyc29LV0FnWTJGdUlHOXViSGtnWW1VZ1kyRnNiR1ZrSUdsdWMybGtaU0JoSUhkdmNtdG1iRzkzSUdaMWJtTjBhVzl1WENJcE8zSmxkSFZ5YmlCdUtHVXBmV1oxYm1OMGFXOXVJR2RsZEZkdmNtdG1iRzkzVFdWMFlXUmhkR0VvS1h0c1pYUWdkRDEzYjNKclpteHZkMGRzYjJKaGJGdFhUMUpMUmt4UFYxOURUMDVVUlZoVVgxTlpUVUpQVEYwN2FXWW9kRDA5UFhadmFXUWdNQ2wwYUhKdmR5QkZjbkp2Y2loY0ltQm5aWFJYYjNKclpteHZkMDFsZEdGa1lYUmhLQ2xnSUdOaGJpQnZibXg1SUdKbElHTmhiR3hsWkNCcGJuTnBaR1VnWVNCM2IzSnJabXh2ZHlCdmNpQnpkR1Z3SUdaMWJtTjBhVzl1WENJcE8zSmxkSFZ5YmlCMGZXWjFibU4wYVc5dUlHZGxkRmR5YVhSaFlteGxLR1U5ZTMwcGUyeGxkQ0IwUFhkdmNtdG1iRzkzUjJ4dlltRnNXMWRQVWt0R1RFOVhYMGRGVkY5VFZGSkZRVTFmU1VSZE8ybG1LSFE5UFQxMmIybGtJREFwZEdoeWIzY2dSWEp5YjNJb1hDSmdaMlYwVjNKcGRHRmliR1VvS1dBZ1kyRnVJRzl1YkhrZ1ltVWdZMkZzYkdWa0lHbHVjMmxrWlNCaElIZHZjbXRtYkc5M0lHWjFibU4wYVc5dVhDSXBPMnhsZENCeVBYUW9aUzV1WVcxbGMzQmhZMlVwTzNKbGRIVnliaUJQWW1wbFkzUXVZM0psWVhSbEtHZHNiMkpoYkZSb2FYTXVWM0pwZEdGaWJHVlRkSEpsWVcwdWNISnZkRzkwZVhCbExIdGJVMVJTUlVGTlgwNUJUVVZmVTFsTlFrOU1YVHA3ZG1Gc2RXVTZjaXgzY21sMFlXSnNaVG9oTVgxOUtYMW1kVzVqZEdsdmJpQmpjbVZoZEdWWFpXSm9iMjlyS0dVcGUyeGxkQ0IwUFdOeVpXRjBaVWh2YjJzb1pTa3NiajFuWlhSWGIzSnJabXh2ZDAxbGRHRmtZWFJoS0NrN2NtVjBkWEp1SUhRdWRYSnNQV0FrZTNSNWNHVnZaaUJ1TG5WeWJEMDlZSE4wY21sdVoyQS9iaTUxY213NllHQjlMeTUzWld4c0xXdHViM2R1TDNkdmNtdG1iRzkzTDNZeEwzZGxZbWh2YjJzdkpIdGxibU52WkdWVlVrbERiMjF3YjI1bGJuUW9kQzUwYjJ0bGJpbDlZQ3gwZldaMWJtTjBhVzl1SUdSbFptbHVaVWh2YjJzb0tYdHlaWFIxY201N1kzSmxZWFJsT21OeVpXRjBaVWh2YjJzc2NtVnpkVzFsS0NsN2RHaHliM2NnUlhKeWIzSW9YQ0pnWkdWbWFXNWxTRzl2YXlncExuSmxjM1Z0WlNncFlDQmpZVzRnYjI1c2VTQmlaU0JqWVd4c1pXUWdabkp2YlNCbGVIUmxjbTVoYkNCamIyNTBaWGgwY3k1Y0lpbDlmWDFtZFc1amRHbHZiaUJ6YkdWbGNDZ3BlM1JvY205M0lFVnljbTl5S0Z3aVlITnNaV1Z3S0NsZ0lHbHpJRzV2ZENCaGRtRnBiR0ZpYkdVZ2FXNGdaWFpsSUhkdmNtdG1iRzkzSUdKdlpIa2dZblZ1Wkd4bGMxd2lLWDFtZFc1amRHbHZiaUJ5WlhOMWJXVkliMjlyS0NsN2RHaHliM2NnUlhKeWIzSW9YQ0pnY21WemRXMWxTRzl2YXlncFlDQmpZVzRnYjI1c2VTQmlaU0JqWVd4c1pXUWdabkp2YlNCdmRYUnphV1JsSUdFZ2QyOXlhMlpzYjNjZ1puVnVZM1JwYjI1Y0lpbDlablZ1WTNScGIyNGdaMlYwVTNSbGNFMWxkR0ZrWVhSaEtDbDdkR2h5YjNjZ1JYSnliM0lvWENKZ1oyVjBVM1JsY0UxbGRHRmtZWFJoS0NsZ0lHTmhiaUJ2Ym14NUlHSmxJR05oYkd4bFpDQnBibk5wWkdVZ1lTQnpkR1Z3SUdaMWJtTjBhVzl1WENJcGZXRnplVzVqSUdaMWJtTjBhVzl1SUdWNGNHVnlhVzFsYm5SaGJGOXpaWFJCZEhSeWFXSjFkR1Z6S0dVc2REMTdmU2w3YkdWMElHNDlUMkpxWldOMExtVnVkSEpwWlhNb1pTazdhV1lvYmk1c1pXNW5kR2c5UFQwd0tYSmxkSFZ5Ymp0c1pYUWdhVDEzYjNKclpteHZkMGRzYjJKaGJGdFhUMUpMUmt4UFYxOVZVMFZmVTFSRlVGMDdhV1lvYVQwOVBYWnZhV1FnTUNsMGFISnZkeUJGY25KdmNpaGNJbUJsZUhCbGNtbHRaVzUwWVd4ZmMyVjBRWFIwY21saWRYUmxjeWdwWUNCallXNGdiMjVzZVNCaVpTQmpZV3hzWldRZ2FXNXphV1JsSUdFZ2QyOXlhMlpzYjNjZ2NuVnVkR2x0WlNCamIyNTBaWGgwWENJcE8yeGxkQ0JoUFc0dWJXRndLQ2hiWlN4MFhTazlQaWg3YTJWNU9tVXNkbUZzZFdVNmREMDlQWFp2YVdRZ01EOXVkV3hzT25SOUtTa3NiejEwTG1Gc2JHOTNVbVZ6WlhKMlpXUkJkSFJ5YVdKMWRHVnpQVDA5SVRBL2UyRnNiRzkzVW1WelpYSjJaV1JCZEhSeWFXSjFkR1Z6T2lFd2ZUcDdmVHRoZDJGcGRDQnBLR0JmWDJKMWFXeDBhVzVmYzJWMFgyRjBkSEpwWW5WMFpYTmdLU2hoTEc4cGZXVjRjRzl5ZEh0R1lYUmhiRVZ5Y205eUxGSmxkSEo1WVdKc1pVVnljbTl5TEdOeVpXRjBaVWh2YjJzc1kzSmxZWFJsVjJWaWFHOXZheXhrWldacGJtVkliMjlyTEdWNGNHVnlhVzFsYm5SaGJGOXpaWFJCZEhSeWFXSjFkR1Z6TEdkbGRGTjBaWEJOWlhSaFpHRjBZU3huWlhSWGIzSnJabXh2ZDAxbGRHRmtZWFJoTEdkbGRGZHlhWFJoWW14bExISmxjM1Z0WlVodmIyc3NjMnhsWlhCOU95SXNJbUZ6ZVc1aklHWjFibU4wYVc5dUlHTnNZV2x0U0c5dmEwOTNibVZ5YzJocGNDaGxLWHRzWlhRZ2REdDBjbmw3ZEQxaGQyRnBkQ0JsTG1kbGRFTnZibVpzYVdOMEtDbDlZMkYwWTJnb2RDbDdjbVYwZFhKdUlHRjNZV2wwSUdScGMzQnZjMlZCYm1SVWFISnZkeWhsTEc1dmNtMWhiR2w2WlVodmIydERiR0ZwYlVWeWNtOXlLSFFzWlM1MGIydGxiaWtwZldsbUtIUWhQVDF1ZFd4c0tYSmxkSFZ5YmlCaGQyRnBkQ0JrYVhOd2IzTmxRVzVrVkdoeWIzY29aU3hqY21WaGRHVkliMjlyUTI5dVpteHBZM1JGY25KdmNpaGxMblJ2YTJWdUxIUXVjblZ1U1dRcEtYMWhjM2x1WXlCbWRXNWpkR2x2YmlCamJHOXpaVWh2YjJ0SmRHVnlZWFJ2Y2lobEtYdDBlWEJsYjJZZ1pTNXlaWFIxY200OVBXQm1kVzVqZEdsdmJtQW1KbUYzWVdsMElHVXVjbVYwZFhKdUtIWnZhV1FnTUNsOVlYTjVibU1nWm5WdVkzUnBiMjRnWkdsemNHOXpaVWh2YjJzb1pTbDdiR1YwSUhROVpTNWthWE53YjNObE8ybG1LSFI1Y0dWdlppQjBQVDFnWm5WdVkzUnBiMjVnS1h0aGQyRnBkQ0IwTG1OaGJHd29aU2s3Y21WMGRYSnVmV3hsZENCdVBXVmJVM2x0WW05c0xtUnBjM0J2YzJWZE8zUjVjR1Z2WmlCdVBUMWdablZ1WTNScGIyNWdKaVpoZDJGcGRDQnVMbU5oYkd3b1pTbDlZWE41Ym1NZ1puVnVZM1JwYjI0Z1pHbHpjRzl6WlVGdVpGUm9jbTkzS0dVc2RDbDdkSEo1ZTJGM1lXbDBJR1JwYzNCdmMyVkliMjlyS0dVcGZXTmhkR05vZTMxMGFISnZkeUIwZldaMWJtTjBhVzl1SUc1dmNtMWhiR2w2WlVodmIydERiR0ZwYlVWeWNtOXlLR1VzZENsN2NtVjBkWEp1SUdselNHOXZhME52Ym1ac2FXTjBSWEp5YjNJb1pTay9ZM0psWVhSbFNHOXZhME52Ym1ac2FXTjBSWEp5YjNJb2RIbHdaVzltSUdVdWRHOXJaVzQ5UFdCemRISnBibWRnUDJVdWRHOXJaVzQ2ZEN4MGVYQmxiMllnWlM1amIyNW1iR2xqZEdsdVoxSjFia2xrUFQxZ2MzUnlhVzVuWUQ5bExtTnZibVpzYVdOMGFXNW5VblZ1U1dRNmRtOXBaQ0F3S1RwbGZXWjFibU4wYVc5dUlHbHpTRzl2YTBOdmJtWnNhV04wUlhKeWIzSW9aU2w3Y21WMGRYSnVJSFI1Y0dWdlppQmxQVDFnYjJKcVpXTjBZQ1ltSVNGbEppWmdibUZ0WldCcGJpQmxKaVpsTG01aGJXVTlQVDFnU0c5dmEwTnZibVpzYVdOMFJYSnliM0pnZldaMWJtTjBhVzl1SUdOeVpXRjBaVWh2YjJ0RGIyNW1iR2xqZEVWeWNtOXlLR1VzZENsN2JHVjBJRzQ5ZEQwOVBYWnZhV1FnTUQ5Z1lEcGdJQ2h5ZFc0Z1hDSWtlM1I5WENJcFlEdHlaWFIxY200Z1QySnFaV04wTG1GemMybG5iaWhGY25KdmNpaGdTRzl2YXlCMGIydGxiaUJjSWlSN1pYMWNJaUJwY3lCaGJISmxZV1I1SUdsdUlIVnpaU1I3Ym4xZ0tTeDdZMjl1Wm14cFkzUnBibWRTZFc1SlpEcDBMRzVoYldVNllFaHZiMnREYjI1bWJHbGpkRVZ5Y205eVlDeDBiMnRsYmpwbGZTbDlaWGh3YjNKMGUyTnNZV2x0U0c5dmEwOTNibVZ5YzJocGNDeGpiRzl6WlVodmIydEpkR1Z5WVhSdmNpeGthWE53YjNObFNHOXZheXhwYzBodmIydERiMjVtYkdsamRFVnljbTl5ZlRzaUxDSm1kVzVqZEdsdmJpQnViM0p0WVd4cGVtVlRaWEpwWVd4cGVtRmliR1ZGY25KdmNpaGxLWHR5WlhSMWNtNGdaU0JwYm5OMFlXNWpaVzltSUVWeWNtOXlQM3N1TGk1UFltcGxZM1F1Wm5KdmJVVnVkSEpwWlhNb1QySnFaV04wTG1WdWRISnBaWE1vWlNrcExHTmhkWE5sT21VdVkyRjFjMlU5UFQxMmIybGtJREEvZG05cFpDQXdPbTV2Y20xaGJHbDZaVk5sY21saGJHbDZZV0pzWlVWeWNtOXlLR1V1WTJGMWMyVXBMRzFsYzNOaFoyVTZaUzV0WlhOellXZGxMRzVoYldVNlpTNXVZVzFsTEhOMFlXTnJPbVV1YzNSaFkydDlPbVY5Wm5WdVkzUnBiMjRnY21WaWRXbHNaRk5sY21saGJHbDZZV0pzWlVWeWNtOXlLR1VwZTJsbUtDRnBjMUpsWTI5eVpDaGxLU2x5WlhSMWNtNGdSWEp5YjNJb1UzUnlhVzVuS0dVcEtUdHNaWFFnZEQxMGVYQmxiMllnWlM1dFpYTnpZV2RsUFQxZ2MzUnlhVzVuWUQ5bExtMWxjM05oWjJVNlUzUnlhVzVuS0dVcExHNDlSWEp5YjNJb2RDazdkSGx3Wlc5bUlHVXVibUZ0WlQwOVlITjBjbWx1WjJBbUppaHVMbTVoYldVOVpTNXVZVzFsS1N4MGVYQmxiMllnWlM1emRHRmphejA5WUhOMGNtbHVaMkFtSmlodUxuTjBZV05yUFdVdWMzUmhZMnNwTEdCallYVnpaV0JwYmlCbEppWW9iaTVqWVhWelpUMXBjMUpsWTI5eVpDaGxMbU5oZFhObEtUOXlaV0oxYVd4a1UyVnlhV0ZzYVhwaFlteGxSWEp5YjNJb1pTNWpZWFZ6WlNrNlpTNWpZWFZ6WlNrN2JHVjBJSEk5Ymp0bWIzSW9iR1YwVzNRc2JsMXZaaUJQWW1wbFkzUXVaVzUwY21sbGN5aGxLU2wwUFQwOVlHMWxjM05oWjJWZ2ZIeDBQVDA5WUc1aGJXVmdmSHgwUFQwOVlITjBZV05yWUh4OGREMDlQV0JqWVhWelpXQjhmQ2h5VzNSZFBXNHBPM0psZEhWeWJpQnVmV1oxYm1OMGFXOXVJR2x6VW1WamIzSmtLR1VwZTNKbGRIVnliaUIwZVhCbGIyWWdaVDA5WUc5aWFtVmpkR0FtSmlFaFpYMWxlSEJ2Y25SN2JtOXliV0ZzYVhwbFUyVnlhV0ZzYVhwaFlteGxSWEp5YjNJc2NtVmlkV2xzWkZObGNtbGhiR2w2WVdKc1pVVnljbTl5ZlRzaUxDSXZLaXBmWDJsdWRHVnlibUZzWDNkdmNtdG1iRzkzYzN0Y0luTjBaWEJ6WENJNmUxd2laR2x6ZEM5emNtTXZaWGhsWTNWMGFXOXVMM1IxY200dFkyOXVkSEp2YkMxd2NtOTBiMk52YkM1cWMxd2lPbnRjSW5ObGJtUlVkWEp1UTI5dWRISnZiRk4wWlhCY0lqcDdYQ0p6ZEdWd1NXUmNJanBjSW5OMFpYQXZMMlYyWlVBd0xqSTBMall2TDNObGJtUlVkWEp1UTI5dWRISnZiRk4wWlhCY0luMTlmWDBxTHp0Y2JtVjRjRzl5ZENCMllYSWdjMlZ1WkZSMWNtNURiMjUwY205c1UzUmxjQ0E5SUdkc2IySmhiRlJvYVhOYlUzbHRZbTlzTG1admNpaGNJbGRQVWt0R1RFOVhYMVZUUlY5VFZFVlFYQ0lwWFNoY0luTjBaWEF2TDJWMlpVQXdMakkwTGpZdkwzTmxibVJVZFhKdVEyOXVkSEp2YkZOMFpYQmNJaWs3WEc0aUxDSXZLaXBmWDJsdWRHVnlibUZzWDNkdmNtdG1iRzkzYzN0Y0luTjBaWEJ6WENJNmUxd2laR2x6ZEM5emNtTXZaWGhsWTNWMGFXOXVMMk5oYm1ObGJDMWtaWE5qWlc1a1lXNTBMWFIxY201ekxYTjBaWEF1YW5OY0lqcDdYQ0pqWVc1alpXeEVaWE5qWlc1a1lXNTBWSFZ5Ym5OVGRHVndYQ0k2ZTF3aWMzUmxjRWxrWENJNlhDSnpkR1Z3THk5bGRtVkFNQzR5TkM0Mkx5OWpZVzVqWld4RVpYTmpaVzVrWVc1MFZIVnlibk5UZEdWd1hDSjlmWDE5S2k4N1hHNWxlSEJ2Y25RZ2RtRnlJR05oYm1ObGJFUmxjMk5sYm1SaGJuUlVkWEp1YzFOMFpYQWdQU0JuYkc5aVlXeFVhR2x6VzFONWJXSnZiQzVtYjNJb1hDSlhUMUpMUmt4UFYxOVZVMFZmVTFSRlVGd2lLVjBvWENKemRHVndMeTlsZG1WQU1DNHlOQzQyTHk5allXNWpaV3hFWlhOalpXNWtZVzUwVkhWeWJuTlRkR1Z3WENJcE8xeHVJaXdpTHlvcVgxOXBiblJsY201aGJGOTNiM0pyWm14dmQzTjdYQ0p6ZEdWd2Mxd2lPbnRjSW1ScGMzUXZjM0pqTDJWNFpXTjFkR2x2Ymk5a2FYTndZWFJqYUMxM2IzSnJabXh2ZHkxeWRXNTBhVzFsTFdGamRHbHZibk10YzNSbGNDNXFjMXdpT250Y0ltUnBjM0JoZEdOb1YyOXlhMlpzYjNkU2RXNTBhVzFsUVdOMGFXOXVjMU4wWlhCY0lqcDdYQ0p6ZEdWd1NXUmNJanBjSW5OMFpYQXZMMlYyWlVBd0xqSTBMall2TDJScGMzQmhkR05vVjI5eWEyWnNiM2RTZFc1MGFXMWxRV04wYVc5dWMxTjBaWEJjSW4xOWZYMHFMenRjYm1WNGNHOXlkQ0IyWVhJZ1pHbHpjR0YwWTJoWGIzSnJabXh2ZDFKMWJuUnBiV1ZCWTNScGIyNXpVM1JsY0NBOUlHZHNiMkpoYkZSb2FYTmJVM2x0WW05c0xtWnZjaWhjSWxkUFVrdEdURTlYWDFWVFJWOVRWRVZRWENJcFhTaGNJbk4wWlhBdkwyVjJaVUF3TGpJMExqWXZMMlJwYzNCaGRHTm9WMjl5YTJac2IzZFNkVzUwYVcxbFFXTjBhVzl1YzFOMFpYQmNJaWs3WEc0aUxDSm1kVzVqZEdsdmJpQnlkVzVOYVdkeVlYUnBiMjVEYUdGcGJpaGxLWHRwWmloMGVYQmxiMllnWlM1MllXeDFaU0U5WUc5aWFtVmpkR0I4ZkdVdWRtRnNkV1U5UFQxdWRXeHNLWFJvY205M0lFVnljbTl5S0dBa2UyVXViR0ZpWld4OU9pQjJZV3gxWlNCb1lYTWdibThnYm5WdFpYSnBZeUJjSW5abGNuTnBiMjVjSWlCbWFXVnNaQzVnS1R0c1pYUWdkRDFsTG5aaGJIVmxMblpsY25OcGIyNHNianRwWmloMGVYQmxiMllnZEQwOVlHNTFiV0psY21BcGJqMWxMblpoYkhWbE8yVnNjMlVnYVdZb0lTaGdkbVZ5YzJsdmJtQnBiaUJsTG5aaGJIVmxLU1ltWlM1cGJtbDBhV0ZzVm1WeWMybHZiaUU5UFhadmFXUWdNQ2x1UFhzdUxpNWxMblpoYkhWbExIWmxjbk5wYjI0NlpTNXBibWwwYVdGc1ZtVnljMmx2Ym4wN1pXeHpaU0IwYUhKdmR5QkZjbkp2Y2loZ0pIdGxMbXhoWW1Wc2ZUb2dkbUZzZFdVZ2FHRnpJRzV2SUc1MWJXVnlhV01nWENKMlpYSnphVzl1WENJZ1ptbGxiR1F1WUNrN2JHVjBJSEk5WlM1cGJtbDBhV0ZzVm1WeWMybHZiajgvTVR0cFppZ2hUblZ0WW1WeUxtbHpT",
	"VzUwWldkbGNpaHVMblpsY25OcGIyNHBmSHh1TG5abGNuTnBiMjQ4Y2lsMGFISnZkeUJGY25KdmNpaGdKSHRsTG14aFltVnNmVG9nZG1WeWMybHZiaUFrZTI0dWRtVnljMmx2Ym4wZ2FYTWdibTkwSUdFZ2NHOXphWFJwZG1VZ2FXNTBaV2RsY2k1Z0tUdHBaaWh1TG5abGNuTnBiMjQrWlM1MFlYSm5aWFJXWlhKemFXOXVLWFJvY205M0lFVnljbTl5S0dBa2UyVXViR0ZpWld4OU9pQmxibU52ZFc1MFpYSmxaQ0IyWlhKemFXOXVJQ1I3Ymk1MlpYSnphVzl1ZlN3Z2QyaHBZMmdnYVhNZ2JtVjNaWElnZEdoaGJpQjBhR1VnYzNWd2NHOXlkR1ZrSUhabGNuTnBiMjRnSkh0bExuUmhjbWRsZEZabGNuTnBiMjU5TGlCVWFHbHpJSFZ6ZFdGc2JIa2dhVzVrYVdOaGRHVnpJSFJvWlNCM2FYSmxJSGRoY3lCM2NtbDBkR1Z1SUdKNUlHRWdibVYzWlhJZ1pYWmxJR1JsY0d4dmVXMWxiblFnZEdoaGJpQjBhR1VnYjI1bElISmxZV1JwYm1jZ2FYUXVZQ2s3Wm05eUtEdHVMblpsY25OcGIyNDhaUzUwWVhKblpYUldaWEp6YVc5dU95bDdiR1YwSUhROVpTNXRhV2R5WVhScGIyNXpMbVpwYm1Rb1pUMCtaUzVtY205dFBUMDliaTUyWlhKemFXOXVLVHRwWmlnaGRDbDBhSEp2ZHlCRmNuSnZjaWhnSkh0bExteGhZbVZzZlRvZ2JtOGdiV2xuY21GMGFXOXVJSEpsWjJsemRHVnlaV1FnWm05eUlIWmxjbk5wYjI0Z0pIdHVMblpsY25OcGIyNTlJT0tHa2lBa2UyNHVkbVZ5YzJsdmJpc3hmUzVnS1R0cFppaDBMblJ2SVQwOWRDNW1jbTl0S3pFcGRHaHliM2NnUlhKeWIzSW9ZQ1I3WlM1c1lXSmxiSDA2SUcxcFozSmhkR2x2YmlBa2UzUXVabkp2YlgwZzRvYVNJQ1I3ZEM1MGIzMGdiWFZ6ZENCemRHVndJR1Y0WVdOMGJIa2diMjVsSUhabGNuTnBiMjRnWVhRZ1lTQjBhVzFsTG1BcE8yeGxkQ0J5UFhRdWJXbG5jbUYwWlNodUtUdHBaaWh5TG5abGNuTnBiMjRoUFQxMExuUnZLWFJvY205M0lFVnljbTl5S0dBa2UyVXViR0ZpWld4OU9pQnRhV2R5WVhScGIyNGdKSHQwTG1aeWIyMTlJT0tHa2lBa2UzUXVkRzk5SUhCeWIyUjFZMlZrSUdFZ2RtRnNkV1VnZDJsMGFDQjJaWEp6YVc5dUlDUjdjaTUyWlhKemFXOXVmUzVnS1R0dVBYSjljbVYwZFhKdUlHNTlaWGh3YjNKMGUzSjFiazFwWjNKaGRHbHZia05vWVdsdWZUc2lMQ0pqYjI1emRDQjBkWEp1VjI5eWEyWnNiM2RKYm5CMWRGWXdWRzlXTVQxN1puSnZiVG93TEcxcFozSmhkR1VvWlNsN2FXWW9JV2x6VUhKbFZtVnljMmx2YmxSMWNtNVhiM0pyWm14dmQwbHVjSFYwS0dVcEtYUm9jbTkzSUVWeWNtOXlLR0IwZFhKdUlIZHZjbXRtYkc5M0lHbHVjSFYwT2lCMlpYSnphVzl1SURBZ2RtRnNkV1VnYVhNZ2JtOTBJR0VnY21WamIyZHVhWHBsWkNCd2NtVXRkbVZ5YzJsdmJpQnphR0Z3WlM1Z0tUdHlaWFIxY201N1kyRndZV0pwYkdsMGFXVnpPbVV1WTJGd1lXSnBiR2wwYVdWekxHTnZiWEJzWlhScGIyNVViMnRsYmpwbExtTnZiWEJzWlhScGIyNVViMnRsYml4dGIyUmxPbVV1Ylc5a1pTeHpkR1Z3U1c1d2RYUTZlMmx1Y0hWME9tVXVaR1ZzYVhabGNua3NjR0Z5Wlc1MFYzSnBkR0ZpYkdVNlpTNXdZWEpsYm5SWGNtbDBZV0pzWlN4elpYSnBZV3hwZW1Wa1EyOXVkR1Y0ZERwbExuTmxjbWxoYkdsNlpXUkRiMjUwWlhoMExITmxjM05wYjI1VGRHRjBaVHBsTG5ObGMzTnBiMjVUZEdGMFpYMHNkbVZ5YzJsdmJqb3hmWDBzZEc4Nk1YMDdablZ1WTNScGIyNGdhWE5RY21WV1pYSnphVzl1VkhWeWJsZHZjbXRtYkc5M1NXNXdkWFFvWlNsN2NtVjBkWEp1SUhSNWNHVnZaaUJsUFQxZ2IySnFaV04wWUNZbUlTRmxKaVpnWkdWc2FYWmxjbmxnYVc0Z1pYMWxlSEJ2Y25SN2RIVnlibGR2Y210bWJHOTNTVzV3ZFhSV01GUnZWakY5T3lJc0ltbHRjRzl5ZEh0eWRXNU5hV2R5WVhScGIyNURhR0ZwYm4xbWNtOXRYQ0l1TDJOb1lXbHVMbXB6WENJN2FXMXdiM0owZTNSMWNtNVhiM0pyWm14dmQwbHVjSFYwVmpCVWIxWXhmV1p5YjIxY0lpNHZkSFZ5YmkxM2IzSnJabXh2ZHkxMk1DMTBieTEyTVM1cWMxd2lPMk52Ym5OMElGUlZVazVmVjA5U1MwWk1UMWRmU1U1UVZWUmZWa1ZTVTBsUFRqMHhMSFIxY201WGIzSnJabXh2ZDBsdWNIVjBUV2xuY21GMGFXOXVjejFiZEhWeWJsZHZjbXRtYkc5M1NXNXdkWFJXTUZSdlZqRmRPMloxYm1OMGFXOXVJR055WldGMFpWUjFjbTVYYjNKclpteHZkMGx1Y0hWMEtHVXBlM0psZEhWeWJudGpZWEJoWW1sc2FYUnBaWE02WlM1allYQmhZbWxzYVhScFpYTXNZMjl0Y0d4bGRHbHZibFJ2YTJWdU9tVXVZMjl0Y0d4bGRHbHZibFJ2YTJWdUxHUnlhWFpsY2tOaGNHRmlhV3hwZEdsbGN6cDdZMkZ1WTJWc2JHVmtWSFZ5YmxObGRIUnNaVG9oTUN4MGRYSnVTVzVpYjNnNklUQjlMRzF2WkdVNlpTNXRiMlJsTEhOMFpYQkpibkIxZERwN2FXNXdkWFE2WlM1a1pXeHBkbVZ5ZVN4d1lYSmxiblJYY21sMFlXSnNaVHBsTG5CaGNtVnVkRmR5YVhSaFlteGxMSE5sY21saGJHbDZaV1JEYjI1MFpYaDBPbVV1YzJWeWFXRnNhWHBsWkVOdmJuUmxlSFFzYzJWemMybHZibE4wWVhSbE9tVXVjMlZ6YzJsdmJsTjBZWFJsZlN4MlpYSnphVzl1T2pGOWZXWjFibU4wYVc5dUlHMXBaM0poZEdWVWRYSnVWMjl5YTJac2IzZEpibkIxZENoMEtYdHlaWFIxY200Z2NuVnVUV2xuY21GMGFXOXVRMmhoYVc0b2UybHVhWFJwWVd4V1pYSnphVzl1T2pBc2JHRmlaV3c2WUhSMWNtNGdkMjl5YTJac2IzY2dhVzV3ZFhSZ0xHMXBaM0poZEdsdmJuTTZkSFZ5YmxkdmNtdG1iRzkzU1c1d2RYUk5hV2R5WVhScGIyNXpMSFJoY21kbGRGWmxjbk5wYjI0Nk1TeDJZV3gxWlRwMGZTbDlaWGh3YjNKMGUxUlZVazVmVjA5U1MwWk1UMWRmU1U1UVZWUmZWa1ZTVTBsUFRpeGpjbVZoZEdWVWRYSnVWMjl5YTJac2IzZEpibkIxZEN4dGFXZHlZWFJsVkhWeWJsZHZjbXRtYkc5M1NXNXdkWFI5T3lJc0ltWjFibU4wYVc5dUlHTnZZV3hsYzJObFJHVnNhWFpsY2xCaGVXeHZZV1J6S0dVcGUybG1LR1V1YkdWdVozUm9QVDA5TUNseVpYUjFjbTU3ZlR0cFppaGxMbXhsYm1kMGFEMDlQVEVwY21WMGRYSnVJR1ZiTUYwL1AzdDlPMnhsZENCMFBYdDlMRzQ5VzEwN1ptOXlLR3hsZENCeUlHOW1JR1VwZTJadmNpaHNaWFJiWlN4dVhXOW1JRTlpYW1WamRDNWxiblJ5YVdWektISXBLV1VoUFQxZ2FXNXdkWFJTWlhOd2IyNXpaWE5nSmladUlUMDlkbTlwWkNBd0ppWW9kRnRsWFQxdUtUdHlMbWx1Y0hWMFVtVnpjRzl1YzJWeklUMDlkbTlwWkNBd0ppWnVMbkIxYzJnb0xpNHVjaTVwYm5CMWRGSmxjM0J2Ym5ObGN5bDljbVYwZFhKdUlHNHViR1Z1WjNSb1BqQW1KaWgwTG1sdWNIVjBVbVZ6Y0c5dWMyVnpQVzRwTEhSOVpYaHdiM0owZTJOdllXeGxjMk5sUkdWc2FYWmxjbEJoZVd4dllXUnpmVHNpTENKcGJYQnZjblI3WTI5aGJHVnpZMlZFWld4cGRtVnlVR0Y1Ykc5aFpITjlabkp2YlZ3aUkyVjRaV04xZEdsdmJpOWtaV3hwZG1WeUxYQmhlV3h2WVdSekxtcHpYQ0k3YVcxd2IzSjBlM0p2ZFhSbFVISnZlR2xsWkVSbGJHbDJaWEpUZEdWd2ZXWnliMjFjSWlObGVHVmpkWFJwYjI0dmQyOXlhMlpzYjNjdGMzUmxjSE11YW5OY0lqdGhjM2x1WXlCbWRXNWpkR2x2YmlCeWIzVjBaVVJsYkdsMlpYSlViME5vYVd4a2NtVnVLR1VwZTJ4bGRDQjBQV052WVd4bGMyTmxSR1ZzYVhabGNsQmhlV3h2WVdSektHVXVjR0Y1Ykc5aFpITXBPM0psZEhWeWJpQmxMbk5sYzNOcGIyNVRkR0YwWlM1b1lYTlFjbTk0ZVVsdWNIVjBVbVZ4ZFdWemRITS9LR0YzWVdsMElISnZkWFJsVUhKdmVHbGxaRVJsYkdsMlpYSlRkR1Z3S0h0aGRYUm9PbVV1WVhWMGFDeHdZWEpsYm5SWGNtbDBZV0pzWlRwbExuQmhjbVZ1ZEZkeWFYUmhZbXhsTEhCaGVXeHZZV1E2ZEN4elpYTnphVzl1VTNSaGRHVTZaUzV6WlhOemFXOXVVM1JoZEdWOUtTa3VjbVZ0WVdsdVpHVnlPblI5Wlhod2IzSjBlM0p2ZFhSbFJHVnNhWFpsY2xSdlEyaHBiR1J5Wlc1OU95SXNJaThxS2w5ZmFXNTBaWEp1WVd4ZmQyOXlhMlpzYjNkemUxd2ljM1JsY0hOY0lqcDdYQ0prYVhOMEwzTnlZeTlsZUdWamRYUnBiMjR2YzNWaVlXZGxiblF0WlhabGJuUXRjSEp2ZUhrdGMzUmxjQzVxYzF3aU9udGNJbkoxYmxCeWIzaDVVM1ZpWVdkbGJuUkZkbVZ1ZEZOMFpYQmNJanA3WENKemRHVndTV1JjSWpwY0luTjBaWEF2TDJWMlpVQXdMakkwTGpZdkwzSjFibEJ5YjNoNVUzVmlZV2RsYm5SRmRtVnVkRk4wWlhCY0luMTlmWDBxTHp0Y2JtVjRjRzl5ZENCMllYSWdjblZ1VUhKdmVIbFRkV0poWjJWdWRFVjJaVzUwVTNSbGNDQTlJR2RzYjJKaGJGUm9hWE5iVTNsdFltOXNMbVp2Y2loY0lsZFBVa3RHVEU5WFgxVlRSVjlUVkVWUVhDSXBYU2hjSW5OMFpYQXZMMlYyWlVBd0xqSTBMall2TDNKMWJsQnliM2g1VTNWaVlXZGxiblJGZG1WdWRGTjBaWEJjSWlrN1hHNGlMQ0ptZFc1amRHbHZiaUJ6WlhOemFXOXVRMkZ1WTJWc1NHOXZhMVJ2YTJWdUtHVXBlM0psZEhWeWJtQWtlMlY5T21OaGJtTmxiR0I5Wlhod2IzSjBlM05sYzNOcGIyNURZVzVqWld4SWIyOXJWRzlyWlc1OU95SXNJbU52Ym5OMElGUlZVazVmUTBGT1EwVk1URVZFWDBWU1VrOVNYMDVCVFVVOVlGUjFjbTVEWVc1alpXeHNaV1JGY25KdmNtQTdkbUZ5SUZSMWNtNURZVzVqWld4c1pXUkZjbkp2Y2oxamJHRnpjeUJsZUhSbGJtUnpJRVZ5Y205eWUyTnZibk4wY25WamRHOXlLSFE5WUZSb1pTQjBkWEp1SUhkaGN5QmpZVzVqWld4c1pXUXVZQ2w3YzNWd1pYSW9kQ2tzZEdocGN5NXVZVzFsUFZSVlVrNWZRMEZPUTBWTVRFVkVYMFZTVWs5U1gwNUJUVVY5ZlR0bWRXNWpkR2x2YmlCcGMxUjFjbTVEWVc1alpXeHNZWFJwYjI0b2RDbDdiR1YwSUc0OWRDeHlQVzVsZHlCVFpYUTdabTl5S0R0MGVYQmxiMllnYmowOVlHOWlhbVZqZEdBbUptNG1KaUZ5TG1oaGN5aHVLVHNwZTJsbUtISXVZV1JrS0c0cExHNHVibUZ0WlQwOVBWUlZVazVmUTBGT1EwVk1URVZFWDBWU1VrOVNYMDVCVFVVcGNtVjBkWEp1SVRBN2JqMXVMbU5oZFhObGZYSmxkSFZ5YmlFeGZXWjFibU4wYVc5dUlIUm9jbTkzU1daVWRYSnVRV0p2Y25SbFpDaGxLWHRwWmlobFB5NWhZbTl5ZEdWa1BUMDlJVEFwZEdoeWIzY2dhWE5VZFhKdVEyRnVZMlZzYkdGMGFXOXVLR1V1Y21WaGMyOXVLVDlsTG5KbFlYTnZianB1WlhjZ1ZIVnlia05oYm1ObGJHeGxaRVZ5Y205eWZXVjRjRzl5ZEh0VWRYSnVRMkZ1WTJWc2JHVmtSWEp5YjNJc2FYTlVkWEp1UTJGdVkyVnNiR0YwYVc5dUxIUm9jbTkzU1daVWRYSnVRV0p2Y25SbFpIMDdJaXdpYVcxd2IzSjBlMk55WldGMFpVaHZiMnQ5Wm5KdmJWd2lJMk52YlhCcGJHVmtMMEIzYjNKclpteHZkeTlqYjNKbEwybHVaR1Y0TG1welhDSTdhVzF3YjNKMGUyTnNZV2x0U0c5dmEwOTNibVZ5YzJocGNDeGthWE53YjNObFNHOXZheXhwYzBodmIydERiMjVtYkdsamRFVnljbTl5ZldaeWIyMWNJaU5sZUdWamRYUnBiMjR2YUc5dmF5MXZkMjVsY25Ob2FYQXVhbk5jSWp0cGJYQnZjblI3YzJWemMybHZia05oYm1ObGJFaHZiMnRVYjJ0bGJuMW1jbTl0WENJalpYaGxZM1YwYVc5dUwzUjFjbTR0WTJGdVkyVnNiR0YwYVc5dUxYUnZhMlZ1TG1welhDSTdhVzF3YjNKMGUxUjFjbTVEWVc1alpXeHNaV1JGY25KdmNuMW1jbTl0WENJamFHRnlibVZ6Y3k5MGRYSnVMV05oYm1ObGJHeGhkR2x2Ymk1cWMxd2lPMkZ6ZVc1aklHWjFibU4wYVc5dUlHTnlaV0YwWlZSMWNtNURZVzVqWld4c1lYUnBiMjVEYjI1MGNtOXNLSElwZTJ4bGRDQnBQV055WldGMFpVaHZiMnNvZTNSdmEyVnVPbk5sYzNOcGIyNURZVzVqWld4SWIyOXJWRzlyWlc0b2NpNXpaWE56YVc5dVNXUXBmU2tzWVQxcFcxTjViV0p2YkM1aGMzbHVZMGwwWlhKaGRHOXlYU2dwTzNSeWVYdGhkMkZwZENCamJHRnBiVWh2YjJ0UGQyNWxjbk5vYVhBb2FTbDlZMkYwWTJnb1pTbDdhV1lvYVhOSWIyOXJRMjl1Wm14cFkzUkZjbkp2Y2lobEtTbHlaWFIxY200N2RHaHliM2NnWlgxc1pYUWdiejF1WlhjZ1FXSnZjblJEYjI1MGNtOXNiR1Z5TEhNOVkyOXVjM1Z0WlUxaGRHTm9hVzVuUTJGdVkyVnNLR0VzY2k1bGVIQmxZM1JsWkZSMWNtNUpaQ2t1ZEdobGJpZ29LVDArS0c4dVlXSnZjblFvYm1WM0lGUjFjbTVEWVc1alpXeHNaV1JGY25KdmNpa3NZR05oYm1ObGJHQXBLU3hqUFNFeE8zSmxkSFZ5Ym50emFXZHVZV3c2Ynk1emFXZHVZV3dzY21WeGRXVnpkR1ZrT25Nc1lYTjVibU1nWkdsemNHOXpaU2dwZTJOOGZDaGpQU0V3TEdGM1lXbDBJR1JwYzNCdmMyVkliMjlyS0drcEtYMTlmV0Z6ZVc1aklHWjFibU4wYVc5dUlHTnZibk4xYldWTllYUmphR2x1WjBOaGJtTmxiQ2hsTEhRcGUyWnZjaWc3T3lsN2JHVjBJRzQ5WVhkaGFYUWdaUzV1WlhoMEtDazdhV1lvYmk1a2IyNWxLWEpsZEhWeWJpQmhkMkZwZENCdVpYY2dVSEp2YldselpTZ29LVDArZTMwcE8ybG1LRzFoZEdOb1pYTkJZM1JwZG1WVWRYSnVLRzR1ZG1Gc2RXVXNkQ2twY21WMGRYSnVmWDFtZFc1amRHbHZiaUJ0WVhSamFHVnpRV04wYVhabFZIVnliaWhsTEhRcGUybG1LSFI1Y0dWdlppQmxJVDFnYjJKcVpXTjBZSHg4SVdVcGNtVjBkWEp1SVRBN2JHVjBJRzQ5WlM1MGRYSnVTV1E3Y21WMGRYSnVJRzQ5UFQxMmIybGtJREI4Zkc0OVBUMTBmV1Y0Y0c5eWRIdGpjbVZoZEdWVWRYSnVRMkZ1WTJWc2JHRjBhVzl1UTI5dWRISnZiSDA3SWl3aWFXMXdiM0owZTNObGJtUlVkWEp1UTI5dWRISnZiRk4wWlhCOVpuSnZiVndpSTJWNFpXTjFkR2x2Ymk5MGRYSnVMV052Ym5SeWIyd3RjSEp2ZEc5amIyd3Vhbk5jSWp0MllYSWdWSFZ5YmtWNFpXTjFkR2x2YmtOMWNuTnZjajFqYkdGemMzdGpiMjUwY205c1ZHOXJaVzQ3Y0dGeVpXNTBWM0pwZEdGaWJHVTdZM1Z5Y21WdWRGTmxjbWxoYkdsNlpXUkRiMjUwWlhoME8yTjFjbkpsYm5SVFpYTnphVzl1VTNSaGRHVTdiR0Z6ZEZKbGNHOXlkR1ZrUTI5dWRHbHVkV0YwYVc5dVZHOXJaVzQ3WTI5dWMzUnlkV04wYjNJb1pTbDdkR2hwY3k1amIyNTBjbTlzVkc5clpXNDlaUzVqYjI1MGNtOXNWRzlyWlc0c2RHaHBjeTVqZFhKeVpXNTBVMlZ5YVdGc2FYcGxaRU52Ym5SbGVIUTlaUzV6WlhKcFlXeHBlbVZrUTI5dWRHVjRkQ3gwYUdsekxtTjFjbkpsYm5SVFpYTnphVzl1VTNSaGRHVTlaUzV6WlhOemFXOXVVM1JoZEdVc2RHaHBjeTVzWVhOMFVtVndiM0owWldSRGIyNTBhVzUxWVhScGIyNVViMnRsYmoxbExuTmxjM05wYjI1VGRHRjBaUzVqYjI1MGFXNTFZWFJwYjI1VWIydGxiaXgwYUdsekxuQmhjbVZ1ZEZkeWFYUmhZbXhsUFdVdWNHRnlaVzUwVjNKcGRHRmliR1Y5WjJWMElITmxjbWxoYkdsNlpXUkRiMjUwWlhoMEtDbDdjbVYwZFhKdUlIUm9hWE11WTNWeWNtVnVkRk5sY21saGJHbDZaV1JEYjI1MFpYaDBmV2RsZENCelpYTnphVzl1VTNSaGRHVW9LWHR5WlhSMWNtNGdkR2hwY3k1amRYSnlaVzUwVTJWemMybHZibE4wWVhSbGZXRnplVzVqSUdGa2IzQjBLR1VwZTNSb2FYTXVjMlYwVTNSaGRHVW9aU2s3YkdWMElIUTlaUzV6WlhOemFXOXVVM1JoZEdVdVkyOXVkR2x1ZFdGMGFXOXVWRzlyWlc0N2REMDlQV0JnZkh4MFBUMDlkR2hwY3k1c1lYTjBVbVZ3YjNKMFpXUkRiMjUwYVc1MVlYUnBiMjVVYjJ0bGJueDhLSFJvYVhNdWJHRnpkRkpsY0c5eWRHVmtRMjl1ZEdsdWRXRjBhVzl1Vkc5clpXNDlkQ3hoZDJGcGRDQjBhR2x6TG5ObGJtUW9lMk52Ym5ScGJuVmhkR2x2YmxSdmEyVnVPblFzYTJsdVpEcGdkSFZ5YmkxamIyNTBhVzUxWVhScGIyNHRkRzlyWlc1Z2ZTa3BmV055WldGMFpWTjBaWEJKYm5CMWRDaGxMSFFwZTNKbGRIVnlibnRoWW05eWRGTnBaMjVoYkRwMExHbHVjSFYwT21Vc2NHRnlaVzUwVjNKcGRHRmliR1U2ZEdocGN5NXdZWEpsYm5SWGNtbDBZV0pzWlN4elpYSnBZV3hwZW1Wa1EyOXVkR1Y0ZERwMGFHbHpMbU4xY25KbGJuUlRaWEpwWVd4cGVtVmtRMjl1ZEdWNGRDeHpaWE56YVc5dVUzUmhkR1U2ZEdocGN5NWpkWEp5Wlc1MFUyVnpjMmx2YmxOMFlYUmxmWDFoYzNsdVl5Qm1hVzVwYzJnb1pTeDBMRzRwZTNSb2FYTXVjMlYwVTNSaGRHVW9aU2tzWVhkaGFYUWdkR2hwY3k1elpXNWtLSHRoWTNScGIyNDZleTR1TG5Rc2MyVnlhV0ZzYVhwbFpFTnZiblJsZUhRNmRHaHBjeTVqZFhKeVpXNTBVMlZ5YVdGc2FYcGxaRU52Ym5SbGVIUXNjMlZ6YzJsdmJsTjBZWFJsT25Sb2FYTXVZM1Z5Y21WdWRGTmxjM05wYjI1VGRHRjBaWDBzWW5WbVptVnlaV1JFWld4cGRtVnlhV1Z6T200dWJHVnVaM1JvUFQwOU1EOTJiMmxrSURBNld5NHVMbTVkTEd0cGJtUTZZSFIxY200dGNtVnpkV3gwWUgwcGZXRnplVzVqSUhObGJtUW9kQ2w3WVhkaGFYUWdjMlZ1WkZSMWNtNURiMjUwY205c1UzUmxjQ2g3WTI5dWRISnZiRlJ2YTJWdU9uUm9hWE11WTI5dWRISnZiRlJ2YTJWdUxIQmhlV3h2WVdRNmRIMHBmWE5sZEZOMFlYUmxLR1VwZTNSb2FYTXVZM1Z5Y21WdWRGTmxjbWxoYkdsNlpXUkRiMjUwWlhoMFBXVXVjMlZ5YVdGc2FYcGxaRU52Ym5SbGVIUS9QM1JvYVhNdVkzVnljbVZ1ZEZObGNtbGhiR2w2WldSRGIyNTBaWGgwTEhSb2FYTXVZM1Z5Y21WdWRGTmxjM05wYjI1VGRHRjBaVDFsTG5ObGMzTnBiMjVUZEdGMFpYMTlPMlY0Y0c5eWRIdFVkWEp1UlhobFkzVjBhVzl1UTNWeWMyOXlmVHNpTENKbWRXNWpkR2x2YmlCaFkzUnBkbVZVZFhKdVNXUW9aU2w3Y21WMGRYSnVJR1V1ZEhWeWJrbGtQVDA5WUdBL1lIUjFjbTVmSkh0bExuTmxjWFZsYm1ObGZXQTZaUzUwZFhKdVNXUjlaWGh3YjNKMGUyRmpkR2wyWlZSMWNtNUpaSDA3SWl3aUx5b3FYMTlwYm5SbGNtNWhiRjkzYjNKclpteHZkM043WENKM2IzSnJabXh2ZDNOY0lqcDdYQ0prYVhOMEwzTnlZeTlsZUdWamRYUnBiMjR2ZEhWeWJpMTNiM0pyWm14dmR5NXFjMXdpT250Y0luUjFjbTVYYjNKclpteHZkMXdpT250Y0luZHZjbXRtYkc5M1NXUmNJanBjSW5kdmNtdG1iRzkzTHk5bGRtVXZMM1IxY201WGIzSnJabXh2ZDF3aWZYMTlmU292TzF4dWFXMXdiM0owZTNKbGMyOXNkbVZTZFc1MGFXMWxRV04wYVc5dVVtVnpkV3gwYzBadmNrdGxlWE45Wm5KdmJWd2lJMmhoY201bGMzTXZjblZ1ZEdsdFpTMWhZM1JwYjI1ekxtcHpYQ0k3YVcxd2IzSjBlMlJwYzNCaGRHTm9VblZ1ZEdsdFpVRmpkR2x2Ym5OVGRHVndmV1p5YjIxY0lpTmxlR1ZqZFhScGIyNHZaR2x6Y0dGMFkyZ3RjblZ1ZEdsdFpTMWhZM1JwYjI1ekxYTjBaWEF1YW5OY0lqdHBiWEJ2Y25SN2NtVnpiMngyWlZkdmNtdG1iRzkzUTJGc2JHSmhZMnRDWVhObFZYSnNmV1p5YjIxY0lpTmxlR1ZqZFhScGIyNHZkMjl5YTJac2IzY3RZMkZzYkdKaFkyc3RkWEpzTG1welhDSTdhVzF3YjNKMGUzUjFjbTVUZEdWd2ZXWnliMjFjSWlObGVHVmpkWFJwYjI0dmQyOXlhMlpzYjNjdGMzUmxjSE11YW5OY0lqdHBiWEJ2Y25SN1kzSmxZWFJsU0c5dmF5eG5aWFJYYjNKclpteHZkMDFsZEdGa1lYUmhmV1p5YjIxY0lpTmpiMjF3YVd4bFpDOUFkMjl5YTJac2IzY3ZZMjl5WlM5cGJtUmxlQzVxYzF3aU8ybHRjRzl5ZEh0amJHRnBiVWh2YjJ0UGQyNWxjbk5vYVhBc1pHbHpjRzl6WlVodmIyc3NhWE5JYjI5clEyOXVabXhwWTNSRmNuSnZjbjFtY205dFhDSWpaWGhsWTNWMGFXOXVMMmh2YjJzdGIzZHVaWEp6YUdsd0xtcHpYQ0k3YVcxd2IzSjBlMjV2Y20xaGJHbDZaVk5sY21saGJHbDZZV0pzWlVWeWNtOXlmV1p5YjIxY0lpTmxlR1ZqZFhScGIyNHZkMjl5YTJac2IzY3RaWEp5YjNKekxtcHpYQ0k3YVcxd2IzSjBlM05sYm1SVWRYSnVRMjl1ZEhKdmJGTjBaWEI5Wm5KdmJWd2lJMlY0WldOMWRHbHZiaTkwZFhKdUxXTnZiblJ5YjJ3dGNISnZkRzlqYjJ3dWFuTmNJanRwYlhCdmNuUjdZMkZ1WTJWc1JHVnpZMlZ1WkdGdWRGUjFjbTV6VTNSbGNIMW1jbTl0WENJalpYaGxZM1YwYVc5dUwyTmhibU5sYkMxa1pYTmpaVzVrWVc1MExYUjFjbTV6TFhOMFpYQXVhbk5jSWp0cGJYQnZjblI3WkdsemNHRjBZMmhYYjNKclpteHZkMUoxYm5ScGJXVkJZM1JwYjI1elUzUmxjSDFtY205dFhDSWpaWGhsWTNWMGFXOXVMMlJwYzNCaGRHTm9MWGR2Y210bWJHOTNMWEoxYm5ScGJXVXRZV04wYVc5dWN5MXpkR1Z3TG1welhDSTdhVzF3YjNKMGUyMXBaM0poZEdWVWRYSnVWMjl5YTJac2IzZEpibkIxZEgxbWNtOXRYQ0lqWlhobFkzVjBhVzl1TDJSMWNtRmliR1V0YzJWemMybHZiaTF0YVdkeVlYUnBiMjV6TDNSMWNtNHRkMjl5YTJac2IzY3Vhbk5jSWp0cGJYQnZjblI3Y205MWRHVkVaV3hwZG1WeVZHOURhR2xzWkhKbGJuMW1jbTl0WENJalpYaGxZM1YwYVc5dUwzSnZkWFJsTFdOb2FXeGtMV1JsYkdsMlpYSjVMbXB6WENJN2FXMXdiM0owZTNKMWJsQnliM2g1VTNWaVlXZGxiblJGZG1WdWRGTjBaWEI5Wm5KdmJWd2lJMlY0WldOMWRHbHZiaTl6ZFdKaFoyVnVkQzFsZG1WdWRDMXdjbTk0ZVMxemRHVndMbXB6WENJN2FXMXdiM0owZTJOeVpXRjBaVlIxY201RFlXNWpaV3hzWVhScGIyNURiMjUwY205c2ZXWnliMjFjSWlObGVHVmpkWFJwYjI0dmRIVnliaTFqWVc1alpXeHNZWFJwYjI0dFkyOXVkSEp2YkM1cWMxd2lPMmx0Y0c5eWRIdFVkWEp1UlhobFkzVjBhVzl1UTNWeWMyOXlmV1p5YjIxY0lpTmxlR1ZqZFhScGIyNHZkSFZ5YmkxbGVHVmpkWFJwYjI0dFkzVnljMjl5TG1welhDSTdhVzF3YjNKMGUyRmpkR2wyWlZSMWNtNUpaSDFtY205dFhDSWphR0Z5Ym1WemN5OWhZM1JwZG1VdGRIVnliaTFwWkM1cWMxd2lPMk52Ym5OMElGUkJVMHRmVFU5RVJWOVhRVWxVWDBWU1VrOVNYMDFGVTFOQlIwVTlYQ0pVWVhOcklHMXZaR1VnWTJGdWJtOTBJSGRoYVhRZ1ptOXlJR1p2Ykd4dmR5MTFjQ0JwYm5CMWRDQW9ZRzVsZUhRNklHNTFiR3hnS1M1Y0lqdG1kVzVqZEdsdmJpQmpZVzVUWlhSMGJHVkRZVzVqWld4c1pXUlVkWEp1UVhOUVlYSnJLR1VwZTNKbGRIVnliaUJsTG0xdlpHVTlQVDFnWTI5dWRtVnljMkYwYVc5dVlIeDhaUzV6ZEdWd1NXNXdkWFF1YzJWemMybHZibE4wWVhSbExtTnZiblJwYm5WaGRHbHZibFJ2YTJWdUlUMDlZR0I5WVhONWJtTWdablZ1WTNScGIyNGdkSFZ5YmxkdmNtdG1iRzkzS0dVcGUyeGxkQ0IwUFcxcFozSmhkR1ZVZFhKdVYyOXlhMlpzYjNkSmJuQjFkQ2hsS1R0eVpYUjFjbTRnZEM1a2NtbDJaWEpEWVhCaFltbHNhWFJwWlhNL0xuUjFjbTVKYm1KdmVEMDlQU0V3UDNKMWJsUjFjbTVQZDI1bFpGZHZjbXRtYkc5M0tIUXBPbkoxYmt4bFoyRmplVlIxY201WGIzSnJabXh2ZHloMEtYMWhjM2x1WXlCbWRXNWpkR2x2YmlCeWRXNVVkWEp1VDNkdVpXUlhiM0pyWm14dmR5aGxLWHRzWlhRZ1l6MWpjbVZoZEdWSWIyOXJLSHQwYjJ0bGJqcGdKSHRsTG1OdmJYQnNaWFJwYjI1VWIydGxibjA2YVc1aWIzaGdmU2tzYkQxalcxTjViV0p2YkM1aGMzbHVZMGwwWlhKaGRHOXlYU2dwTEhVOWJtVjNJRlIxY201RmVHVmpkWFJwYjI1RGRYSnpiM0lvZTJOdmJuUnliMnhVYjJ0bGJqcGxMbU52YlhCc1pYUnBiMjVVYjJ0bGJpeHdZWEpsYm5SWGNtbDBZV0pzWlRwbExuTjBaWEJKYm5CMWRDNXdZWEpsYm5SWGNtbDBZV0pzWlN4elpYSnBZV3hwZW1Wa1EyOXVkR1Y0ZERwbExuTjBaWEJKYm5CMWRDNXpaWEpwWVd4cGVtVmtRMjl1ZEdWNGRDeHpaWE56YVc5dVUzUmhkR1U2WlM1emRHVndTVzV3ZFhRdWMyVnpjMmx2YmxOMFlYUmxmU2tzWkQwd0xHNWxlSFJFWld4cGRtVnllVkpsY1hWbGMzUkpaRDBvS1QwK1lDUjdZeTUwYjJ0bGJuMDZaR1ZzYVhabGNuazZKSHRUZEhKcGJtY29aQ3NyS1gxZ0xHWTlXMTBzY0QxbExuTjBaWEJKYm5CMWRDNXBibkIxZEN4dFBTRXhMR2c3ZEhKNWUzUnllWHRoZDJGcGRDQmpiR0ZwYlVodmIydFBkMjVsY25Ob2FYQW9ZeWtzYlQwaE1IMWpZWFJqYUNobEtYdHBaaWhwYzBodmIydERiMjVtYkdsamRFVnljbTl5S0dVcEtYSmxkSFZ5Ymp0MGFISnZkeUJsZldadmNpaGxMbVJ5YVhabGNrTmhjR0ZpYVd4cGRHbGxjejh1WTJGdVkyVnNiR1ZrVkhWeWJsTmxkSFJzWlQwOVBTRXdKaVpqWVc1VFpYUjBiR1ZEWVc1alpXeHNaV1JVZFhKdVFYTlFZWEpyS0dVcEppWW9hRDFoZDJGcGRDQmpjbVZoZEdWVWRYSnVRMkZ1WTJWc2JHRjBhVzl1UTI5dWRISnZiQ2g3Wlhod1pXTjBaV1JVZFhKdVNXUTZZV04wYVhabFZIVnlia2xrS0dVdWMzUmxjRWx1Y0hWMExuTmxjM05wYjI1VGRHRjBaUzVsYldsemMybHZibE4wWVhSbEtTeHpaWE56YVc5dVNXUTZaUzV6ZEdWd1NXNXdkWFF1YzJWemMybHZibE4wWVhSbExuTmxjM05wYjI1SlpIMHBLVHM3S1h0c1pYUWdhVDFoZDJGcGRDQjBkWEp1VTNSbGNDaDFMbU55WldGMFpWTjBaWEJKYm5CMWRDaHdMR2cvTG5OcFoyNWhiQ2twTzJsbUtHa3VZV04wYVc5dVBUMDlZR05oYm1ObGJHeGxaR0FwZTJGM1lXbDBJR05oYm1ObGJFUmxjMk5sYm1SaGJuUlVkWEp1YzFOMFpYQW9lM05sY21saGJHbDZaV1JEYjI1MFpYaDBPblV1YzJWeWFXRnNhWHBsWkVOdmJuUmxlSFFzYzJWemMybHZibE4wWVhSbE9uVXVjMlZ6YzJsdmJsTjBZWFJsZlNrc1lYZGhhWFFnYUQ4dVpHbHpjRzl6WlNncExHRjNZV2wwSUhVdVptbHVhWE5vS0h0elpYTnphVzl1VTNSaGRHVTZkUzV6WlhOemFXOXVVM1JoZEdWOUxIdGpZVzVqWld4c1pXUTZJVEFzYTJsdVpEcGdjR0Z5YTJCOUxHWXBP",
	"M0psZEhWeWJuMXBaaWhwTG1GamRHbHZiajA5UFdCa2IyNWxZQ2w3WVhkaGFYUWdhRDh1WkdsemNHOXpaU2dwTEdGM1lXbDBJSFV1Wm1sdWFYTm9LR2tzZTJ0cGJtUTZZR1J2Ym1WZ0xHOTFkSEIxZERwcExtOTFkSEIxZEQ4L1lHQXNhWE5GY25KdmNqcHBMbWx6UlhKeWIzSXNkWE5oWjJVNmFTNTFjMkZuWlgwc1ppazdjbVYwZFhKdWZXeGxkQ0J2UFdrdVlXTjBhVzl1UFQwOVlHUnBjM0JoZEdOb0xYZHZjbXRtYkc5M0xYSjFiblJwYldVdFlXTjBhVzl1YzJCOGZHa3VZV04wYVc5dVBUMDlZSEJoY210Z1Aya3VjR1Z1WkdsdVoxSjFiblJwYldWQlkzUnBiMjVMWlhsek9uWnZhV1FnTUR0cFppaHZJVDA5ZG05cFpDQXdLWHRoZDJGcGRDQjFMbUZrYjNCMEtHa3BPMnhsZENCbFBXRjNZV2wwS0drdVlXTjBhVzl1UFQwOVlHUnBjM0JoZEdOb0xYZHZjbXRtYkc5M0xYSjFiblJwYldVdFlXTjBhVzl1YzJBL1pHbHpjR0YwWTJoWGIzSnJabXh2ZDFKMWJuUnBiV1ZCWTNScGIyNXpVM1JsY0Rwa2FYTndZWFJqYUZKMWJuUnBiV1ZCWTNScGIyNXpVM1JsY0Nrb2UyTmhiR3hpWVdOclFtRnpaVlZ5YkRweVpYTnZiSFpsVjI5eWEyWnNiM2REWVd4c1ltRmphMEpoYzJWVmNtd29aMlYwVjI5eWEyWnNiM2ROWlhSaFpHRjBZU2dwTG5WeWJDa3NjR0Z5Wlc1MFEyOXVkR2x1ZFdGMGFXOXVWRzlyWlc0Nll5NTBiMnRsYml4d1lYSmxiblJYY21sMFlXSnNaVHAxTG5CaGNtVnVkRmR5YVhSaFlteGxMSE5sY21saGJHbDZaV1JEYjI1MFpYaDBPblV1YzJWeWFXRnNhWHBsWkVOdmJuUmxlSFFzYzJWemMybHZibE4wWVhSbE9uVXVjMlZ6YzJsdmJsTjBZWFJsZlNrN1lYZGhhWFFnZFM1aFpHOXdkQ2hsS1R0c1pYUWdjajFoZDJGcGRDQjNZV2wwUm05eVVuVnVkR2x0WlVGamRHbHZibEpsYzNWc2RITW9lMkoxWm1abGNtVmtSR1ZzYVhabGNtbGxjenBtTEdOaGJtTmxiR3hoZEdsdmJqcG9MR04xY25OdmNqcDFMR2x1WW05NFZHOXJaVzQ2WXk1MGIydGxiaXhwYm1sMGFXRnNVbVZ6ZFd4MGN6cGxMbkpsYzNWc2RITXNhWFJsY21GMGIzSTZiQ3h1WlhoMFJHVnNhWFpsY25sU1pYRjFaWE4wU1dRc2NHVnVaR2x1WjBGamRHbHZia3RsZVhNNmIzMHBPMmxtS0hJOVBUMWdZMkZ1WTJWc2JHVmtZQ2w3Y0QxMmIybGtJREE3WTI5dWRHbHVkV1Y5Y0QxN2EybHVaRHBnY25WdWRHbHRaUzFoWTNScGIyNHRjbVZ6ZFd4MFlDeHlaWE4xYkhSek9uSjlPMk52Ym5ScGJuVmxmV2xtS0drdVlXTjBhVzl1UFQwOVlIQmhjbXRnS1h0cFppZ2hLR2t1YUdGelVHVnVaR2x1WjBGMWRHaHZjbWw2WVhScGIyNThmR2t1YUdGelVHVnVaR2x1WjBsdWNIVjBRbUYwWTJnbUptVXVZMkZ3WVdKcGJHbDBhV1Z6UHk1eVpYRjFaWE4wU1c1d2RYUTlQVDBoTUh4OFpTNXRiMlJsUFQwOVlHTnZiblpsY25OaGRHbHZibUFwS1hSb2NtOTNJRVZ5Y205eUtGUkJVMHRmVFU5RVJWOVhRVWxVWDBWU1VrOVNYMDFGVTFOQlIwVXBPMkYzWVdsMElHZy9MbVJwYzNCdmMyVW9LU3hoZDJGcGRDQjFMbVpwYm1semFDaHBMSHRoZFhSb2IzSnBlbUYwYVc5dVRtRnRaWE02YVM1aGRYUm9iM0pwZW1GMGFXOXVUbUZ0WlhNc2EybHVaRHBnY0dGeWEyQjlMR1lwTzNKbGRIVnlibjFoZDJGcGRDQjFMbUZrYjNCMEtHa3BMSEE5ZG05cFpDQXdmWDFqWVhSamFDaGxLWHQwYUhKdmR5QmhkMkZwZENCMUxuTmxibVFvZTJWeWNtOXlPbTV2Y20xaGJHbDZaVk5sY21saGJHbDZZV0pzWlVWeWNtOXlLR1VwTEd0cGJtUTZZSFIxY200dFpYSnliM0pnZlNrc1pYMW1hVzVoYkd4NWUyZ2hQVDEyYjJsa0lEQW1KbUYzWVdsMElHZ3VaR2x6Y0c5elpTZ3BMRzBtSm1GM1lXbDBJR1JwYzNCdmMyVkliMjlyS0dNcGZYMWhjM2x1WXlCbWRXNWpkR2x2YmlCM1lXbDBSbTl5VW5WdWRHbHRaVUZqZEdsdmJsSmxjM1ZzZEhNb2RDbDdiR1YwSUc0c2NqMWJMaTR1ZEM1cGJtbDBhV0ZzVW1WemRXeDBjMTA3Wm05eUtEczdLWHRzWlhRZ2FUMXlaWE52YkhabFVuVnVkR2x0WlVGamRHbHZibEpsYzNWc2RITkdiM0pMWlhsektIdHdaVzVrYVc1blMyVjVjenAwTG5CbGJtUnBibWRCWTNScGIyNUxaWGx6TEhKbGMzVnNkSE02Y24wcE8ybG1LR2toUFQxMmIybGtJREFwY21WMGRYSnVJRzRoUFQxMmIybGtJREFtSm1GM1lXbDBJSFF1WTNWeWMyOXlMbk5sYm1Rb2UydHBibVE2WUhSMWNtNHRaR1ZzYVhabGNua3RZMkZ1WTJWc2JHVmtZQ3h5WlhGMVpYTjBTV1E2Ym4wcExHazdkQzVqZFhKemIzSXVjMlZ6YzJsdmJsTjBZWFJsTG1oaGMxQnliM2g1U1c1d2RYUlNaWEYxWlhOMGN5WW1iajA5UFhadmFXUWdNQ1ltS0c0OWRDNXVaWGgwUkdWc2FYWmxjbmxTWlhGMVpYTjBTV1FvS1N4aGQyRnBkQ0IwTG1OMWNuTnZjaTV6Wlc1a0tIdGpiMjUwYVc1MVlYUnBiMjVVYjJ0bGJqcDBMbU4xY25OdmNpNXpaWE56YVc5dVUzUmhkR1V1WTI5dWRHbHVkV0YwYVc5dVZHOXJaVzRzYVc1aWIzaFViMnRsYmpwMExtbHVZbTk0Vkc5clpXNHNhMmx1WkRwZ2RIVnliaTFrWld4cGRtVnllUzF5WlhGMVpYTjBZQ3h5WlhGMVpYTjBTV1E2Ym4wcEtUdHNaWFFnWVQxMExtbDBaWEpoZEc5eUxtNWxlSFFvS1R0aExtTmhkR05vS0NncFBUNTdmU2s3YkdWMElHODlZWGRoYVhRb2RDNWpZVzVqWld4c1lYUnBiMjQ5UFQxMmIybGtJREEvWVRwUWNtOXRhWE5sTG5KaFkyVW9XMkVzZEM1allXNWpaV3hzWVhScGIyNHVjbVZ4ZFdWemRHVmtYU2twTzJsbUtHODlQVDFnWTJGdVkyVnNZQ2x5WlhSMWNtNGdiaUU5UFhadmFXUWdNQ1ltWVhkaGFYUWdkQzVqZFhKemIzSXVjMlZ1WkNoN2EybHVaRHBnZEhWeWJpMWtaV3hwZG1WeWVTMWpZVzVqWld4c1pXUmdMSEpsY1hWbGMzUkpaRHB1ZlNrc1lHTmhibU5sYkd4bFpHQTdhV1lvYnk1a2IyNWxLWFJvY205M0lFVnljbTl5S0dCVWRYSnVJR2x1WW05NElHTnNiM05sWkNCaVpXWnZjbVVnY25WdWRHbHRaU0JoWTNScGIyNXpJR052YlhCc1pYUmxaQzVnS1R0c1pYUWdjejF2TG5aaGJIVmxPMmxtS0hNdWEybHVaRDA5UFdCeWRXNTBhVzFsTFdGamRHbHZiaTF5WlhOMWJIUmdLWHR5TG5CMWMyZ29MaTR1Y3k1eVpYTjFiSFJ6S1R0amIyNTBhVzUxWlgxcFppaHpMbXRwYm1ROVBUMWdjM1ZpWVdkbGJuUXRhVzV3ZFhRdGNtVnhkV1Z6ZEdCOGZITXVhMmx1WkQwOVBXQnpkV0poWjJWdWRDMWhkWFJvYjNKcGVtRjBhVzl1TFdWMlpXNTBZQ2w3YkdWMElHVTlZWGRoYVhRZ2NuVnVVSEp2ZUhsVGRXSmhaMlZ1ZEVWMlpXNTBVM1JsY0NoN2FHOXZhMUJoZVd4dllXUTZjeXh3WVhKbGJuUlhjbWwwWVdKc1pUcDBMbU4xY25OdmNpNXdZWEpsYm5SWGNtbDBZV0pzWlN4elpYSnBZV3hwZW1Wa1EyOXVkR1Y0ZERwMExtTjFjbk52Y2k1elpYSnBZV3hwZW1Wa1EyOXVkR1Y0ZEN4elpYTnphVzl1VTNSaGRHVTZkQzVqZFhKemIzSXVjMlZ6YzJsdmJsTjBZWFJsZlNrN1lYZGhhWFFnZEM1amRYSnpiM0l1WVdSdmNIUW9aU2s3WTI5dWRHbHVkV1Y5YVdZb2N5NXJhVzVrUFQwOVlHUnlhWFpsY2kxa1pXeHBkbVZ5ZVdBbUpuTXVjbVZ4ZFdWemRFbGtQVDA5YmlsN1lYZGhhWFFnZEM1amRYSnpiM0l1YzJWdVpDaDdhMmx1WkRwZ2RIVnliaTFrWld4cGRtVnllUzFoWTJObGNIUmxaR0FzY21WeGRXVnpkRWxrT25NdWNtVnhkV1Z6ZEVsa2ZTa3NiajEyYjJsa0lEQTdiR1YwSUdVOVlYZGhhWFFnY205MWRHVkVaV3hwZG1WeVZHOURhR2xzWkhKbGJpaDdZWFYwYURwekxtUmxiR2wyWlhKNUxtRjFkR2dzY0dGeVpXNTBWM0pwZEdGaWJHVTZkQzVqZFhKemIzSXVjR0Z5Wlc1MFYzSnBkR0ZpYkdVc2NHRjViRzloWkhNNmN5NWtaV3hwZG1WeWVTNXdZWGxzYjJGa2N5eHpaWE56YVc5dVUzUmhkR1U2ZEM1amRYSnpiM0l1YzJWemMybHZibE4wWVhSbGZTazdaU0U5UFhadmFXUWdNQ1ltZEM1aWRXWm1aWEpsWkVSbGJHbDJaWEpwWlhNdWNIVnphQ2g3TGk0dWN5NWtaV3hwZG1WeWVTeHdZWGxzYjJGa2N6cGJaVjE5S1gxOWZXRnplVzVqSUdaMWJtTjBhVzl1SUhKMWJreGxaMkZqZVZSMWNtNVhiM0pyWm14dmR5aGxLWHRzWlhRZ2REMWxMbk4wWlhCSmJuQjFkRHQwY25sN1ptOXlLRHM3S1h0c1pYUWdiajFoZDJGcGRDQjBkWEp1VTNSbGNDaDBLVHRwWmlodUxtRmpkR2x2YmowOVBXQmtiMjVsWUNsN1lYZGhhWFFnYzJWdVpGUjFjbTVEYjI1MGNtOXNVM1JsY0NoN1kyOXVkSEp2YkZSdmEyVnVPbVV1WTI5dGNHeGxkR2x2YmxSdmEyVnVMSEJoZVd4dllXUTZlMkZqZEdsdmJqcDdhMmx1WkRwZ1pHOXVaV0FzYjNWMGNIVjBPbTR1YjNWMGNIVjBQejlnWUN4cGMwVnljbTl5T200dWFYTkZjbkp2Y2l4elpYSnBZV3hwZW1Wa1EyOXVkR1Y0ZERwdUxuTmxjbWxoYkdsNlpXUkRiMjUwWlhoMExITmxjM05wYjI1VGRHRjBaVHB1TG5ObGMzTnBiMjVUZEdGMFpTeDFjMkZuWlRwdUxuVnpZV2RsZlN4cmFXNWtPbUIwZFhKdUxYSmxjM1ZzZEdCOWZTazdjbVYwZFhKdWZXbG1LRzR1WVdOMGFXOXVQVDA5WUdScGMzQmhkR05vTFhkdmNtdG1iRzkzTFhKMWJuUnBiV1V0WVdOMGFXOXVjMkFwZTJGM1lXbDBJSE5sYm1SVWRYSnVRMjl1ZEhKdmJGTjBaWEFvZTJOdmJuUnliMnhVYjJ0bGJqcGxMbU52YlhCc1pYUnBiMjVVYjJ0bGJpeHdZWGxzYjJGa09udGhZM1JwYjI0NmUydHBibVE2WUdScGMzQmhkR05vTFhkdmNtdG1iRzkzTFhKMWJuUnBiV1V0WVdOMGFXOXVjMkFzY0dWdVpHbHVaMEZqZEdsdmJrdGxlWE02Ymk1d1pXNWthVzVuVW5WdWRHbHRaVUZqZEdsdmJrdGxlWE1zYzJWeWFXRnNhWHBsWkVOdmJuUmxlSFE2Ymk1elpYSnBZV3hwZW1Wa1EyOXVkR1Y0ZEN4elpYTnphVzl1VTNSaGRHVTZiaTV6WlhOemFXOXVVM1JoZEdWOUxHdHBibVE2WUhSMWNtNHRjbVZ6ZFd4MFlIMTlLVHR5WlhSMWNtNTlhV1lvYmk1aFkzUnBiMjQ5UFQxZ2NHRnlhMkFwZTJ4bGRDQjBQVzR1Y0dWdVpHbHVaMUoxYm5ScGJXVkJZM1JwYjI1TFpYbHpPMmxtS0NFb2RDRTlQWFp2YVdRZ01IeDhiaTVvWVhOUVpXNWthVzVuUVhWMGFHOXlhWHBoZEdsdmJueDhiaTVvWVhOUVpXNWthVzVuU1c1d2RYUkNZWFJqYUNZbVpTNWpZWEJoWW1sc2FYUnBaWE0vTG5KbGNYVmxjM1JKYm5CMWREMDlQU0V3Zkh4bExtMXZaR1U5UFQxZ1kyOXVkbVZ5YzJGMGFXOXVZQ2twZEdoeWIzY2dSWEp5YjNJb1ZFRlRTMTlOVDBSRlgxZEJTVlJmUlZKU1QxSmZUVVZUVTBGSFJTazdiR1YwSUhJOWREMDlQWFp2YVdRZ01EOTdhMmx1WkRwZ2NHRnlhMkFzYzJWeWFXRnNhWHBsWkVOdmJuUmxlSFE2Ymk1elpYSnBZV3hwZW1Wa1EyOXVkR1Y0ZEN4elpYTnphVzl1VTNSaGRHVTZiaTV6WlhOemFXOXVVM1JoZEdVc1lYVjBhRzl5YVhwaGRHbHZiazVoYldWek9tNHVZWFYwYUc5eWFYcGhkR2x2Yms1aGJXVnpmVHA3YTJsdVpEcGdaR2x6Y0dGMFkyZ3RjblZ1ZEdsdFpTMWhZM1JwYjI1ellDeHdaVzVrYVc1blFXTjBhVzl1UzJWNWN6cDBMSE5sY21saGJHbDZaV1JEYjI1MFpYaDBPbTR1YzJWeWFXRnNhWHBsWkVOdmJuUmxlSFFzYzJWemMybHZibE4wWVhSbE9tNHVjMlZ6YzJsdmJsTjBZWFJsZlR0aGQyRnBkQ0J6Wlc1a1ZIVnlia052Ym5SeWIyeFRkR1Z3S0h0amIyNTBjbTlzVkc5clpXNDZaUzVqYjIxd2JHVjBhVzl1Vkc5clpXNHNjR0Y1Ykc5aFpEcDdZV04wYVc5dU9uSXNhMmx1WkRwZ2RIVnliaTF5WlhOMWJIUmdmWDBwTzNKbGRIVnlibjEwUFh0cGJuQjFkRHAyYjJsa0lEQXNjR0Z5Wlc1MFYzSnBkR0ZpYkdVNmRDNXdZWEpsYm5SWGNtbDBZV0pzWlN4elpYSnBZV3hwZW1Wa1EyOXVkR1Y0ZERwdUxuTmxjbWxoYkdsNlpXUkRiMjUwWlhoMExITmxjM05wYjI1VGRHRjBaVHB1TG5ObGMzTnBiMjVUZEdGMFpYMTlmV05oZEdOb0tIUXBlM1JvY205M0lHRjNZV2wwSUhObGJtUlVkWEp1UTI5dWRISnZiRk4wWlhBb2UyTnZiblJ5YjJ4VWIydGxianBsTG1OdmJYQnNaWFJwYjI1VWIydGxiaXh3WVhsc2IyRmtPbnRsY25KdmNqcHViM0p0WVd4cGVtVlRaWEpwWVd4cGVtRmliR1ZGY25KdmNpaDBLU3hyYVc1a09tQjBkWEp1TFdWeWNtOXlZSDE5S1N4MGZYMWxlSEJ2Y25SN2RIVnlibGR2Y210bWJHOTNmVHRjYm5SMWNtNVhiM0pyWm14dmR5NTNiM0pyWm14dmQwbGtJRDBnWENKM2IzSnJabXh2ZHk4dlpYWmxMeTkwZFhKdVYyOXlhMlpzYjNkY0lqdGNibWRzYjJKaGJGUm9hWE11WDE5d2NtbDJZWFJsWDNkdmNtdG1iRzkzY3k1elpYUW9YQ0ozYjNKclpteHZkeTh2WlhabEx5OTBkWEp1VjI5eWEyWnNiM2RjSWl3Z2RIVnlibGR2Y210bWJHOTNLVHRjYmlJc0ltTnZibk4wSUV0RldWOVNSVWRKVTFSU1dWOUhURTlDUVV4ZlMwVlpQVk41YldKdmJDNW1iM0lvWUdWMlpTNWpiMjUwWlhoMExXdGxlUzF5WldkcGMzUnllV0FwTEdkc2IySmhiRXRsZVZKbFoybHpkSEo1UTI5dWRHRnBibVZ5UFdkc2IySmhiRlJvYVhNN1oyeHZZbUZzUzJWNVVtVm5hWE4wY25sRGIyNTBZV2x1WlhKYlMwVlpYMUpGUjBsVFZGSlpYMGRNVDBKQlRGOUxSVmxkUFQwOWRtOXBaQ0F3SmlZb1oyeHZZbUZzUzJWNVVtVm5hWE4wY25sRGIyNTBZV2x1WlhKYlMwVlpYMUpGUjBsVFZGSlpYMGRNVDBKQlRGOUxSVmxkUFc1bGR5Qk5ZWEFwTzJOdmJuTjBJR3RsZVZKbFoybHpkSEo1UFdkc2IySmhiRXRsZVZKbFoybHpkSEo1UTI5dWRHRnBibVZ5VzB0RldWOVNSVWRKVTFSU1dWOUhURTlDUVV4ZlMwVlpYVHQyWVhJZ1EyOXVkR1Y0ZEV0bGVUMWpiR0Z6YzN0dVlXMWxPMk52WkdWak8yTnZibk4wY25WamRHOXlLR1VzZEQxN2ZTbDdkR2hwY3k1dVlXMWxQV1VzZEdocGN5NWpiMlJsWXoxMExtTnZaR1ZqTzJ4bGRDQnVQV3RsZVZKbFoybHpkSEo1TG1kbGRDaGxLVHRwWmlodUlUMDlkbTlwWkNBd0ppWnVMbU52WkdWalBUMDlkbTlwWkNBd0lUMG9kR2hwY3k1amIyUmxZejA5UFhadmFXUWdNQ2twZEdoeWIzY2dSWEp5YjNJb1lFTnZiblJsZUhSTFpYa2dibUZ0WlNCamIyeHNhWE5wYjI0NklGd2lKSHRsZlZ3aUlHbHpJR0ZzY21WaFpIa2djbVZuYVhOMFpYSmxaQ0FrZTI0dVkyOWtaV00vWUhkcGRHaGdPbUIzYVhSb2IzVjBZSDBnWVNCamIyUmxZeXdnWW5WMElHRWdhMlY1SUNSN2RHaHBjeTVqYjJSbFl6OWdkMmwwYUdBNllIZHBkR2h2ZFhSZ2ZTQmhJR052WkdWaklHbHpJR0psYVc1bklISmxaMmx6ZEdWeVpXUWdkVzVrWlhJZ2RHaGxJSE5oYldVZ2JtRnRaUzRnVkdocGN5QnphV3hsYm5Sc2VTQmljbVZoYTNNZ1kyOXVkR1Y0ZENCelpYSnBZV3hwZW1GMGFXOXVJT0tBbENCMWMyVWdZU0JrYVhOMGFXNWpkQ0J1WVcxbExtQXBPMnRsZVZKbFoybHpkSEo1TG5ObGRDaGxMSFJvYVhNcGZYMDdablZ1WTNScGIyNGdjbVZ6YjJ4MlpVdGxlU2hsS1h0eVpYUjFjbTRnYTJWNVVtVm5hWE4wY25rdVoyVjBLR1VwZldWNGNHOXlkSHREYjI1MFpYaDBTMlY1TEhKbGMyOXNkbVZMWlhsOU95SXNJbWx0Y0c5eWRIdERiMjUwWlhoMFMyVjVmV1p5YjIxY0lpTmpiMjUwWlhoMEwydGxlUzVxYzF3aU8yTnZibk4wSUVGMWRHaExaWGs5Ym1WM0lFTnZiblJsZUhSTFpYa29ZR1YyWlM1aGRYUm9ZQ2tzU1c1cGRHbGhkRzl5UVhWMGFFdGxlVDF1WlhjZ1EyOXVkR1Y0ZEV0bGVTaGdaWFpsTG1sdWFYUnBZWFJ2Y2tGMWRHaGdLU3hUWlhOemFXOXVTV1JMWlhrOWJtVjNJRU52Ym5SbGVIUkxaWGtvWUdWMlpTNXpaWE56YVc5dVNXUmdLU3hEYjI1MGFXNTFZWFJwYjI1VWIydGxia3RsZVQxdVpYY2dRMjl1ZEdWNGRFdGxlU2hnWlhabExtTnZiblJwYm5WaGRHbHZibFJ2YTJWdVlDa3NRMmhoYm01bGJGSmxjWFZsYzNSSlpFdGxlVDF1WlhjZ1EyOXVkR1Y0ZEV0bGVTaGdaWFpsTG1Ob1lXNXVaV3hTWlhGMVpYTjBTV1JnS1N4RGFHRnVibVZzU1c1emRISjFiV1Z1ZEdGMGFXOXVTMlY1UFc1bGR5QkRiMjUwWlhoMFMyVjVLR0JsZG1VdVkyaGhibTVsYkVsdWMzUnlkVzFsYm5SaGRHbHZibUFwTEUxdlpHVkxaWGs5Ym1WM0lFTnZiblJsZUhSTFpYa29ZR1YyWlM1dGIyUmxZQ2tzVUdGeVpXNTBVMlZ6YzJsdmJrdGxlVDF1WlhjZ1EyOXVkR1Y0ZEV0bGVTaGdaWFpsTG5CaGNtVnVkRk5sYzNOcGIyNWdLU3hUZFdKaFoyVnVkRVJsY0hSb1MyVjVQVzVsZHlCRGIyNTBaWGgwUzJWNUtHQmxkbVV1YzNWaVlXZGxiblJFWlhCMGFHQXBMRU5oY0dGaWFXeHBkR2xsYzB0bGVUMXVaWGNnUTI5dWRHVjRkRXRsZVNoZ1pYWmxMbU5oY0dGaWFXeHBkR2xsYzJBcExGTmxjM05wYjI1RFlXeHNZbUZqYTB0bGVUMXVaWGNnUTI5dWRHVjRkRXRsZVNoZ1pYWmxMbk5sYzNOcGIyNURZV3hzWW1GamEyQXBMRk5sYzNOcGIyNUxaWGs5Ym1WM0lFTnZiblJsZUhSTFpYa29ZR1YyWlM1elpYTnphVzl1WUNrc1UyRnVaR0p2ZUV0bGVUMXVaWGNnUTI5dWRHVjRkRXRsZVNoZ1pYWmxMbk5oYm1SaWIzaGdLU3hUWlhOemFXOXVSSGx1WVcxcFkwMXZaR1ZzVW1WbVpYSmxibU5sUzJWNVBXNWxkeUJEYjI1MFpYaDBTMlY1S0dCbGRtVXVjMlZ6YzJsdmJrUjVibUZ0YVdOTmIyUmxiRkpsWm1WeVpXNWpaV0FwTEZSMWNtNUVlVzVoYldsalRXOWtaV3hTWldabGNtVnVZMlZMWlhrOWJtVjNJRU52Ym5SbGVIUkxaWGtvWUdWMlpTNTBkWEp1UkhsdVlXMXBZMDF2WkdWc1VtVm1aWEpsYm1ObFlDa3NUR2wyWlZOMFpYQkVlVzVoYldsalRXOWtaV3hUWld4bFkzUnBiMjVMWlhrOWJtVjNJRU52Ym5SbGVIUkxaWGtvWUdWMlpTNXNhWFpsVTNSbGNFUjVibUZ0YVdOTmIyUmxiRk5sYkdWamRHbHZibUFwTEZObGMzTnBiMjVFZVc1aGJXbGpWRzl2YkUxbGRHRmtZWFJoUzJWNVBXNWxkeUJEYjI1MFpYaDBTMlY1S0dCbGRtVXVjMlZ6YzJsdmJrUjVibUZ0YVdOVWIyOXNUV1YwWVdSaGRHRmdLU3hVZFhKdVJIbHVZVzFwWTFSdmIyeE5aWFJoWkdGMFlVdGxlVDF1WlhjZ1EyOXVkR1Y0ZEV0bGVTaGdaWFpsTG5SMWNtNUVlVzVoYldsalZHOXZiRTFsZEdGa1lYUmhZQ2tzVEdsMlpWTjBaWEJVYjI5c2MwdGxlVDF1WlhjZ1EyOXVkR1Y0ZEV0bGVTaGdaWFpsTG14cGRtVlRkR1Z3Vkc5dmJITmdLU3hFZVc1aGJXbGpVMnRwYkd4TllXNXBabVZ6ZEV0bGVUMXVaWGNnUTI5dWRHVjRkRXRsZVNoZ1pYWmxMbVI1Ym1GdGFXTlRhMmxzYkUxaGJtbG1aWE4wWUNrc1UyVnpjMmx2YmtSNWJtRnRhV05KYm5OMGNuVmpkR2x2Ym5OTFpYazlibVYzSUVOdmJuUmxlSFJMWlhrb1lHVjJaUzV6WlhOemFXOXVSSGx1WVcxcFkwbHVjM1J5ZFdOMGFXOXVjMkFwTEZSMWNtNUVlVzVoYldsalNXNXpkSEoxWTNScGIyNXpTMlY1UFc1bGR5QkRiMjUwWlhoMFMyVjVLR0JsZG1VdWRIVnlia1I1Ym1GdGFXTkpibk4wY25WamRHbHZibk5nS1R0bGVIQnZjblI3UVhWMGFFdGxlU3hEWVhCaFltbHNhWFJwWlhOTFpYa3NRMmhoYm01bGJFbHVjM1J5ZFcxbGJuUmhkR2x2Ymt0bGVTeERhR0Z1Ym1Wc1VtVnhkV1Z6ZEVsa1MyVjVMRU52Ym5ScGJuVmhkR2x2YmxSdmEyVnVTMlY1TEVSNWJtRnRhV05UYTJsc2JFMWhibWxtWlhOMFMyVjVMRWx1YVhScFlYUnZja0YxZEdoTFpYa3NUR2wyWlZOMFpYQkVlVzVoYldsalRXOWtaV3hUWld4bFkzUnBiMjVMWlhrc1RHbDJaVk4wWlhCVWIyOXNjMHRsZVN4TmIyUmxTMlY1TEZCaGNtVnVkRk5sYzNOcGIyNUxaWGtzVTJGdVpHSnZlRXRsZVN4VFpYTnphVzl1UTJGc2JHSmhZMnRMWlhrc1UyVnpjMmx2YmtSNWJtRnRhV05KYm5OMGNuVmpkR2x2Ym5OTFpYa3NVMlZ6YzJsdmJrUjVibUZ0YVdOTmIyUmxiRkpsWm1WeVpXNWpaVXRsZVN4VFpYTnphVzl1UkhsdVlXMXBZMVJ2YjJ4TlpYUmhaR0YwWVV0bGVTeFRaWE56YVc5dVNXUkxaWGtzVTJWemMybHZia3RsZVN4VGRXSmhaMlZ1ZEVSbGNIUm9TMlY1TEZSMWNtNUVlVzVoYldsalNXNXpkSEoxWTNScGIyNXpTMlY1TEZSMWNtNUVlVzVoYldsalRXOWtaV3hTWldabGNtVnVZMlZMWlhrc1ZIVnlia1I1Ym1GdGFXTlViMjlzVFdWMFlXUmhkR0ZMWlhsOU95SXNJbWx0Y0c5eWRIdFRkV0poWjJWdWRFUmxjSFJvUzJWNWZXWnliMjFjSWlOamIyNTBaWGgwTDJ0bGVYTXVhbk5jSWp0bWRXNWpkR2x2YmlCeVpYTnZiSFpsVTNWaVlXZGxiblJFWlhCMGFDaGxLWHRzWlhRZ2REMXdZWEp6WlZOMVltRm5aVzUwUkdWd2RHZ29aUzV6ZFdKaFoyVnVkRVJsY0hSb0tUdHlaWFIxY201N1kzVnljbVZ1ZEVSbGNIUm9PblFzYm1WNGRFTm9hV3hrUkdWd2RHZzZkQ3N4ZlgxbWRXNWpkR2x2YmlCeVpXRmtVMlZ5YVdGc2FYcGxaRk4xWW1GblpXNTBSR1Z3ZEdnb2RDbDdiR1YwSUc0OWNHRnljMlZUZFdKaFoyVnVkRVJsY0hSb0tIUmJVM1ZpWVdkbGJuUkVaWEIwYUV0bGVTNXVZVzFsWFNrN2NtVjBkWEp1SUc0OVBUMHdQM1p2YVdRZ01EcHVmV1oxYm1OMGFXOXVJR2x6VTNWaVlXZGxiblJFWld4bFoyRjBhVzl1UVdOMGFXOXVLR1VwZTNKbGRIVnliaUJsTG10cGJtUTlQVDFnYzNWaVlXZGxiblF0WTJGc2JHQjhmR1V1YTJsdVpEMDlQV0J5WlcxdmRHVXRZV2RsYm5RdFkyRnNiR0I5Wm5WdVkzUnBiMjRnWjJWMFUzVmlZV2RsYm5SRVpXeGxaMkYwYVc5dVRtRnRaU2hsS1h0emQybDBZMmdvWlM1cmFXNWtLWHRqWVhObFlISmxiVzkwWlMxaFoyVnVkQzFqWVd4c1lEcHlaWFIxY200Z1pTNXlaVzF2ZEdWQloyVnVkRTVoYldVN1kyRnpaV0J6ZFdKaFoyVnVkQzFqWVd4c1lEcHlaWFIxY200Z1pTNXpkV0poWjJWdWRFNWhiV1U3WkdWbVlYVnNkRHB5WlhSMWNtNGdaWDE5Wm5WdVkzUnBiMjRnY0dGeWMyVlRkV0poWjJWdWRFUmxjSFJvS0dVcGUzSmxkSFZ5YmlCMGVYQmxiMllnWlQwOVlHNTFiV0psY21BbUprNTFiV0psY2k1cGMwbHVkR1ZuWlhJb1pTa21KbVUrTUQ5bE9qQjlaWGh3YjNKMGUyZGxkRk4xWW1GblpXNTBSR1ZzWldkaGRHbHZiazVoYldVc2FYTlRkV0poWjJWdWRFUmxiR1ZuWVhScGIyNUJZM1JwYjI0c2NtVmhaRk5sY21saGJHbDZaV1JUZFdKaFoyVnVkRVJsY0hSb0xISmxjMjlzZG1WVGRXSmhaMlZ1ZEVSbGNIUm9mVHNpTENKbWRXNWpkR2x2YmlCamIyRnNaWE5qWlZSMWNtNUpibkIxZEhNb1pTeDBLWHRzWlhRZ2JqMWpiMkZzWlhOalpVbHVjSFYwVW1WemNHOXVjMlZ6S0h0aE9tVXVhVzV3ZFhSU1pYTndiMjV6WlhNc1lqcDBMbWx1Y0hWMFVtVnpjRzl1YzJWemZTa3NjajFqYjJGc1pYTmpaVTFsYzNOaFoyVW9lMkU2WlM1dFpYTnpZV2RsTEdJNmRDNXRaWE56WVdkbGZTa3NhVDFqYjJGc1pYTmpaVU52Ym5SbGVIUW9lMkU2WlM1amIyNTBaWGgwTEdJNmRDNWpiMjUwWlhoMGZTa3NZVDEwTG05MWRIQjFkRk5qYUdWdFlUOC9aUzV2ZFhSd2RYUlRZMmhsYldFc2J6MTdmVHR5WlhSMWNtNGdiaUU5UFhadmFXUWdNQ1ltS0c4dWFXNXdkWFJTWlhOd2IyNXpaWE05Ymlrc2NpRTlQWFp2YVdRZ01DWW1LRzh1YldWemMyRm5aVDF5S1N4cElUMDlkbTlwWkNBd0ppWW9ieTVqYjI1MFpYaDBQV2twTEdFaFBUMTJiMmxrSURBbUppaHZMbTkxZEhCMWRGTmphR1Z0WVQxaEtTeHZmV1oxYm1OMGFXOXVJSEpsYzI5c2RtVkJjM05wYzNSaGJuUlRkR1Z3VkdWNGRDaGxMSFFwZTJadmNpaHNaWFFnZEQxbExteGxibWQwYUMweE8zUStQVEE3TFMxMEtYdHNaWFFnYmoxbFczUmRPMmxtS0c0L0xuSnZiR1VoUFQxZ1lYTnphWE4wWVc1MFlDbGpiMjUwYVc1MVpUdHNaWFFnY2oxbGVIUnlZV04wVFdWemMyRm5aVlJsZUhRb2JpazdhV1lvY2k1MGNtbHRLQ2t1YkdWdVozUm9QakFwY21WMGRYSnVJSEo5Y21WMGRYSnVJSFFoUFQxMmIybGtJREFtSm5RdWRISnBiU2dwTG14bGJtZDBhRDR3UDNRNmJuVnNiSDFtZFc1amRHbHZiaUJsZUhSeVlXTjBUV1Z6YzJGblpWUmxlSFFvWlNsN2NtVjBkWEp1SUhSNWNHVnZaaUJsTG1OdmJuUmxiblE5UFdCemRISnBibWRnUDJVdVkyOXVkR1Z1ZERwQmNuSmhlUzVwYzBGeWNtRjVLR1V1WTI5dWRHVnVkQ2svWlM1amIyNTBaVzUwTG1ac1lYUk5ZWEFvWlQwK2RIbHdaVzltSUdVOVBXQnpkSEpwYm1kZ1AxdGxYVHBnZEhsd1pXQnBiaUJsSmlabExuUjVjR1U5UFQxZ2RHVjRkR0FtSm5SNWNHVnZaaUJsTG5SbGVIUTlQV0J6ZEhKcGJtZGdQMXRsTG5SbGVIUmRPbHRkS1M1cWIybHVLR0JnS1RwZ1lIMW1kVzVqZEdsdmJpQmpiMkZzWlhOalpVbHVjSFYwVW1WemNHOXVjMlZ6S0dVcGUyeGxkQ0IwUFdVdVlUOC9XMTBzYmoxbExtSS9QMXRkTzJsbUtDRW9kQzVzWlc1bmRHZzlQVDB3SmladUxteGxibWQwYUQwOVBUQXBLWEpsZEhWeWJsc3VMaTUwTEM0dUxtNWRmV1oxYm1OMGFXOXVJR052WVd4bGMyTmxRMjl1ZEdWNGRDaGxLWHRzWlhRZ2REMWxMbUUvUDF0ZExHNDlaUzVpUHo5YlhUdHBaaWdoS0hRdWJHVnVaM1JvUFQwOU1DWW1iaTVzWlc1bmRHZzlQVDB3S1NseVpYUjFjbTViTGk0dWRDd3VMaTV1WFgxbWRXNWpkR2x2YmlCamIyRnNaWE5qWlUxbGMzTmhaMlVvWlNsN2NtVjBkWEp1SUdVdVlUMDlQWFp2YVdRZ01EOWxMbUk2WlM1aVBUMDlkbTlwWkNBd1AyVXVZVHAwZVhCbGIyWWdaUzVoUFQxZ2MzUnlhVzVuWUNZbWRIbHdaVzltSUdVdVlqMDlZSE4wY21sdVoyQS9ZQ1I3WlM1aGZWeGNibHhjYmlSN1pTNWlmV0E2V3k0dUxuUnZWWE5sY2tOdmJuUmxiblJCY25KaGVTaGxMbUVwTEM0dUxuUnZWWE5sY2tOdmJuUmxiblJCY25KaGVTaGxMbUlwWFgxbWRXNWpkR2x2YmlCMGIxVnpaWEpEYjI1MFpXNTBR",
	"WEp5WVhrb1pTbDdjbVYwZFhKdUlIUjVjR1Z2WmlCbFBUMWdjM1J5YVc1bllEOWxMbXhsYm1kMGFENHdQMXQ3ZEhsd1pUcGdkR1Y0ZEdBc2RHVjRkRHBsZlYwNlcxMDZRWEp5WVhrdWFYTkJjbkpoZVNobEtUOWJMaTR1WlYwNlcxMTlablZ1WTNScGIyNGdZMjloYkdWelkyVkVaV3hwZG1WeWFXVnpLR1VwZTJ4bGRGdDBMQzR1TG01ZFBXVTdhV1lvZEQwOVBYWnZhV1FnTUNsMGFISnZkeUJGY25KdmNpaGdRMkZ1Ym05MElHTnZZV3hsYzJObElHRnVJR1Z0Y0hSNUlHUmxiR2wyWlhKNUlHSmhkR05vTG1BcE8yeGxkQ0J5UFhRdVlYVjBhQ3hwUFZzdUxpNTBMbkJoZVd4dllXUnpYVHRtYjNJb2JHVjBJR1VnYjJZZ2JpbGxMbUYxZEdnaFBUMTJiMmxrSURBbUppaHlQV1V1WVhWMGFDa3NhUzV3ZFhOb0tDNHVMbVV1Y0dGNWJHOWhaSE1wTzNKbGRIVnlibnN1TGk1MExHRjFkR2c2Y2l4d1lYbHNiMkZrY3pwcGZYMWxlSEJ2Y25SN1kyOWhiR1Z6WTJWRVpXeHBkbVZ5YVdWekxHTnZZV3hsYzJObFZIVnlia2x1Y0hWMGN5eHlaWE52YkhabFFYTnphWE4wWVc1MFUzUmxjRlJsZUhSOU95SXNJbWx0Y0c5eWRIdERhR0Z1Ym1Wc1VtVnhkV1Z6ZEVsa1MyVjVmV1p5YjIxY0lpTmpiMjUwWlhoMEwydGxlWE11YW5OY0lqdHBiWEJ2Y25SN2FYTk9iMjVGYlhCMGVWTjBjbWx1WjMxbWNtOXRYQ0lqYzJoaGNtVmtMMmQxWVhKa2N5NXFjMXdpTzJaMWJtTjBhVzl1SUhKbFlXUkRhR0Z1Ym1Wc1MybHVaQ2hsS1h0c1pYUWdiajFsVzJCbGRtVXVZMmhoYm01bGJHQmRQeTVyYVc1a08zSmxkSFZ5YmlCcGMwNXZia1Z0Y0hSNVUzUnlhVzVuS0c0cFAyNDZkbTlwWkNBd2ZXWjFibU4wYVc5dUlISmxZV1JRWVhKbGJuUk1hVzVsWVdkbEtHVXBlMnhsZENCdVBXVmJZR1YyWlM1d1lYSmxiblJUWlhOemFXOXVZRjBzY2oxdVB5NWpZV3hzU1dRc2FUMXVQeTV5YjI5MFUyVnpjMmx2Ymtsa0xHRTliajh1YzJWemMybHZia2xrTEc4OWJqOHVkSFZ5Ymo4dWFXUTdjbVYwZFhKdWUyTmhiR3hKWkRwcGMwNXZia1Z0Y0hSNVUzUnlhVzVuS0hJcFAzSTZkbTlwWkNBd0xISnZiM1JUWlhOemFXOXVTV1E2YVhOT2IyNUZiWEIwZVZOMGNtbHVaeWhwS1Q5cE9uWnZhV1FnTUN4elpYTnphVzl1U1dRNmFYTk9iMjVGYlhCMGVWTjBjbWx1WnloaEtUOWhPblp2YVdRZ01DeDBkWEp1U1dRNmFYTk9iMjVGYlhCMGVWTjBjbWx1WnlodktUOXZPblp2YVdRZ01IMTlablZ1WTNScGIyNGdjbVZoWkZCaGNtVnVkRk5sYzNOcGIyNUpaQ2hsS1h0eVpYUjFjbTRnY21WaFpGQmhjbVZ1ZEV4cGJtVmhaMlVvWlNrdWMyVnpjMmx2Ymtsa2ZXWjFibU4wYVc5dUlISmxZV1JTYjI5MFUyVnpjMmx2Ymtsa0tHVXBlM0psZEhWeWJpQnlaV0ZrVUdGeVpXNTBUR2x1WldGblpTaGxLUzV5YjI5MFUyVnpjMmx2Ymtsa2ZXWjFibU4wYVc5dUlISmxZV1JEYUdGdWJtVnNVbVZ4ZFdWemRFbGtLRzRwZTJ4bGRDQnlQVzViUTJoaGJtNWxiRkpsY1hWbGMzUkpaRXRsZVM1dVlXMWxYVHR5WlhSMWNtNGdhWE5PYjI1RmJYQjBlVk4wY21sdVp5aHlLVDl5T25admFXUWdNSDFqYjI1emRDQkZWa1ZmVTBWVFUwbFBUbDlVU1ZSTVJWOU5RVmhmUTBoQlVsTTlNVEkxTzJaMWJtTjBhVzl1SUdSbGNtbDJaVk5sYzNOcGIyNVVhWFJzWlNobEtYdHNaWFFnZEQxamIyeHNaV04wVFdWemMyRm5aVlJsZUhRb1pTazdhV1lvZEQwOVBYWnZhV1FnTUh4OGRDNXNaVzVuZEdnOVBUMHdLWEpsZEhWeWJqdHNaWFFnYmoxMExuSmxjR3hoWTJVb0wxeGNjeXN2WjNVc1lDQmdLUzUwY21sdEtDazdhV1lvYmk1c1pXNW5kR2c5UFQwd0tYSmxkSFZ5Ymp0c1pYUWdjajFCY25KaGVTNW1jbTl0S0c0cE8zSmxkSFZ5YmlCeUxteGxibWQwYUR3OU1USTFQMjQ2WUNSN2NpNXpiR2xqWlNnd0xERXlOQ2t1YW05cGJpaGdZQ2w5NG9DbVlIMW1kVzVqZEdsdmJpQmpiMnhzWldOMFRXVnpjMkZuWlZSbGVIUW9aU2w3YVdZb2RIbHdaVzltSUdVOVBXQnpkSEpwYm1kZ0tYSmxkSFZ5YmlCbE8ybG1LQ0ZCY25KaGVTNXBjMEZ5Y21GNUtHVXBLWEpsZEhWeWJqdHNaWFFnZEQxYlhUdG1iM0lvYkdWMElHNGdiMllnWlNsdUppWjBlWEJsYjJZZ2JqMDlZRzlpYW1WamRHQW1KbTR1ZEhsd1pUMDlQV0IwWlhoMFlDWW1kSGx3Wlc5bUlHNHVkR1Y0ZEQwOVlITjBjbWx1WjJBbUpuUXVjSFZ6YUNodUxuUmxlSFFwTzNKbGRIVnliaUIwTG14bGJtZDBhRDR3UDNRdWFtOXBiaWhnSUdBcE9uWnZhV1FnTUgxbWRXNWpkR2x2YmlCaWRXbHNaRk5sYzNOcGIyNUJkSFJ5YVdKMWRHVnpLR1VwZTNKbGRIVnlibnRjSWlSbGRtVXVZMmhoYm01bGJGOXlaWEYxWlhOMFgybGtYQ0k2Y21WaFpFTm9ZVzV1Wld4U1pYRjFaWE4wU1dRb1pTNXpaWEpwWVd4cGVtVmtRMjl1ZEdWNGRDa3NYQ0lrWlhabExuUjVjR1ZjSWpwZ2MyVnpjMmx2Ym1Bc1hDSWtaWFpsTG5SeWFXZG5aWEpjSWpweVpXRmtRMmhoYm01bGJFdHBibVFvWlM1elpYSnBZV3hwZW1Wa1EyOXVkR1Y0ZENrc1hDSWtaWFpsTG5ScGRHeGxYQ0k2WkdWeWFYWmxVMlZ6YzJsdmJsUnBkR3hsS0dVdWFXNXdkWFJOWlhOellXZGxLWDE5Wm5WdVkzUnBiMjRnWW5WcGJHUlRkV0poWjJWdWRGSnZiM1JCZEhSeWFXSjFkR1Z6S0dVcGUzSmxkSFZ5Ym50Y0lpUmxkbVV1WTJoaGJtNWxiRjl5WlhGMVpYTjBYMmxrWENJNmNtVmhaRU5vWVc1dVpXeFNaWEYxWlhOMFNXUW9aUzV6WlhKcFlXeHBlbVZrUTI5dWRHVjRkQ2tzWENJa1pYWmxMblI1Y0dWY0lqcGdjM1ZpWVdkbGJuUmdMRndpSkdWMlpTNXdZWEpsYm5SY0lqcGxMbkJoY21WdWRGTmxjM05wYjI1SlpDeGNJaVJsZG1VdWNHRnlaVzUwWDJOaGJHeGNJanBsTG5CaGNtVnVkRU5oYkd4SlpDeGNJaVJsZG1VdWNHRnlaVzUwWDNSMWNtNWNJanBsTG5CaGNtVnVkRlIxY201SlpDeGNJaVJsZG1VdWNtOXZkRndpT21VdWNtOXZkRk5sYzNOcGIyNUpaQ3hjSWlSbGRtVXVjM1ZpWVdkbGJuUmNJanBsTG1sa1pXNTBhWFI1TG01dlpHVkpaQ3hjSWlSbGRtVXVkSEpwWjJkbGNsd2lPbkpsWVdSRGFHRnVibVZzUzJsdVpDaGxMbk5sY21saGJHbDZaV1JEYjI1MFpYaDBLWDE5Wm5WdVkzUnBiMjRnWW5WcGJHUlVkWEp1UVhSMGNtbGlkWFJsY3lobEtYdHlaWFIxY201N1hDSWtaWFpsTG1Ob1lXNXVaV3hmY21WeGRXVnpkRjlwWkZ3aU9tVXVjbVZ4ZFdWemRFbGtMRndpSkdWMlpTNTBlWEJsWENJNllIUjFjbTVnTEZ3aUpHVjJaUzV3WVhKbGJuUmNJanBsTG5CaGNtVnVkRk5sYzNOcGIyNUpaQ3hjSWlSbGRtVXVjbTl2ZEZ3aU9tVXVjbTl2ZEZObGMzTnBiMjVKWkgxOVpYaHdiM0owZTBWV1JWOVRSVk5UU1U5T1gxUkpWRXhGWDAxQldGOURTRUZTVXl4aWRXbHNaRk5sYzNOcGIyNUJkSFJ5YVdKMWRHVnpMR0oxYVd4a1UzVmlZV2RsYm5SU2IyOTBRWFIwY21saWRYUmxjeXhpZFdsc1pGUjFjbTVCZEhSeWFXSjFkR1Z6TEdSbGNtbDJaVk5sYzNOcGIyNVVhWFJzWlN4eVpXRmtRMmhoYm01bGJFdHBibVFzY21WaFpFTm9ZVzV1Wld4U1pYRjFaWE4wU1dRc2NtVmhaRkJoY21WdWRFeHBibVZoWjJVc2NtVmhaRkJoY21WdWRGTmxjM05wYjI1SlpDeHlaV0ZrVW05dmRGTmxjM05wYjI1SlpIMDdJaXdpTHlvcVgxOXBiblJsY201aGJGOTNiM0pyWm14dmQzTjdYQ0p6ZEdWd2Mxd2lPbnRjSW1ScGMzUXZjM0pqTDJWNFpXTjFkR2x2Ymk5a1pXeGxaMkYwWldRdGNHRnlaVzUwTFc1dmRHbG1hV05oZEdsdmJpNXFjMXdpT250Y0ltNXZkR2xtZVVSbGJHVm5ZWFJsWkZCaGNtVnVkRk4wWlhCY0lqcDdYQ0p6ZEdWd1NXUmNJanBjSW5OMFpYQXZMMlYyWlVBd0xqSTBMall2TDI1dmRHbG1lVVJsYkdWbllYUmxaRkJoY21WdWRGTjBaWEJjSW4xOWZYMHFMenRjYm1WNGNHOXlkQ0IyWVhJZ2JtOTBhV1o1UkdWc1pXZGhkR1ZrVUdGeVpXNTBVM1JsY0NBOUlHZHNiMkpoYkZSb2FYTmJVM2x0WW05c0xtWnZjaWhjSWxkUFVrdEdURTlYWDFWVFJWOVRWRVZRWENJcFhTaGNJbk4wWlhBdkwyVjJaVUF3TGpJMExqWXZMMjV2ZEdsbWVVUmxiR1ZuWVhSbFpGQmhjbVZ1ZEZOMFpYQmNJaWs3WEc0aUxDSXZLaXBmWDJsdWRHVnlibUZzWDNkdmNtdG1iRzkzYzN0Y0luTjBaWEJ6WENJNmUxd2laR2x6ZEM5emNtTXZaWGhsWTNWMGFXOXVMM04xWW1GblpXNTBMV0ZrWVhCMFpYSXVhbk5jSWpwN1hDSm1iM0ozWVhKa1UzVmlZV2RsYm5SQmRYUm9iM0pwZW1GMGFXOXVSWFpsYm5SVGRHVndYQ0k2ZTF3aWMzUmxjRWxrWENJNlhDSnpkR1Z3THk5bGRtVkFNQzR5TkM0Mkx5OW1iM0ozWVhKa1UzVmlZV2RsYm5SQmRYUm9iM0pwZW1GMGFXOXVSWFpsYm5SVGRHVndYQ0o5TEZ3aVptOXlkMkZ5WkZOMVltRm5aVzUwU1c1d2RYUlNaWEYxWlhOMFUzUmxjRndpT250Y0luTjBaWEJKWkZ3aU9sd2ljM1JsY0M4dlpYWmxRREF1TWpRdU5pOHZabTl5ZDJGeVpGTjFZbUZuWlc1MFNXNXdkWFJTWlhGMVpYTjBVM1JsY0Z3aWZYMTlmU292TzF4dVkyOXVjM1FnVTFWQ1FVZEZUbFJmUVVSQlVGUkZVbDlMU1U1RVBXQnpkV0poWjJWdWRHQTdYRzVsZUhCdmNuUWdleUJUVlVKQlIwVk9WRjlCUkVGUVZFVlNYMHRKVGtRZ2ZUdGNiblpoY2lCbWIzSjNZWEprVTNWaVlXZGxiblJCZFhSb2IzSnBlbUYwYVc5dVJYWmxiblJUZEdWd0lEMGdaMnh2WW1Gc1ZHaHBjMXRUZVcxaWIyd3VabTl5S0Z3aVYwOVNTMFpNVDFkZlZWTkZYMU5VUlZCY0lpbGRLRndpYzNSbGNDOHZaWFpsUURBdU1qUXVOaTh2Wm05eWQyRnlaRk4xWW1GblpXNTBRWFYwYUc5eWFYcGhkR2x2YmtWMlpXNTBVM1JsY0Z3aUtUdGNiblpoY2lCbWIzSjNZWEprVTNWaVlXZGxiblJKYm5CMWRGSmxjWFZsYzNSVGRHVndJRDBnWjJ4dlltRnNWR2hwYzF0VGVXMWliMnd1Wm05eUtGd2lWMDlTUzBaTVQxZGZWVk5GWDFOVVJWQmNJaWxkS0Z3aWMzUmxjQzh2WlhabFFEQXVNalF1Tmk4dlptOXlkMkZ5WkZOMVltRm5aVzUwU1c1d2RYUlNaWEYxWlhOMFUzUmxjRndpS1R0Y2JpSXNJbWx0Y0c5eWRIdDBiMFZ5Y205eVRXVnpjMkZuWlgxbWNtOXRYQ0lqYzJoaGNtVmtMMlZ5Y205eWN5NXFjMXdpTzJsdGNHOXlkSHRUVlVKQlIwVk9WRjlCUkVGUVZFVlNYMHRKVGtSOVpuSnZiVndpSTJWNFpXTjFkR2x2Ymk5emRXSmhaMlZ1ZEMxaFpHRndkR1Z5TG1welhDSTdablZ1WTNScGIyNGdZM0psWVhSbFJHVnNaV2RoZEdWa1UzVmlZV2RsYm5SVGRXTmpaWE56VW1WemRXeDBLR1VzYmlsN2JHVjBJSEk5WlZ0Z1pYWmxMbU5vWVc1dVpXeGdYVHRwWmloeVB5NXJhVzVrUFQwOVUxVkNRVWRGVGxSZlFVUkJVRlJGVWw5TFNVNUVLWEpsZEhWeWJudGpZV3hzU1dRNlUzUnlhVzVuS0hJdWMzUmhkR1UvTG1OaGJHeEpaRDgvWUdBcExHdHBibVE2WUhOMVltRm5aVzUwTFhKbGMzVnNkR0FzYjNWMGNIVjBPbTRzYzNWaVlXZGxiblJPWVcxbE9sTjBjbWx1WnloeUxuTjBZWFJsUHk1emRXSmhaMlZ1ZEU1aGJXVS9QMkJnS1gxOVpuVnVZM1JwYjI0Z1kzSmxZWFJsUkdWc1pXZGhkR1ZrVTNWaVlXZGxiblJGY25KdmNsSmxjM1ZzZENoMExHNHBlMnhsZENCeVBXTnlaV0YwWlVSbGJHVm5ZWFJsWkZOMVltRm5aVzUwVTNWalkyVnpjMUpsYzNWc2RDaDBMR0JnS1R0cFppaHlJVDA5ZG05cFpDQXdLWEpsZEhWeWJuc3VMaTV5TEdselJYSnliM0k2SVRBc2IzVjBjSFYwT250amIyUmxPbUJUVlVKQlIwVk9WRjlGV0VWRFZWUkpUMDVmUmtGSlRFVkVZQ3h0WlhOellXZGxPblJ2UlhKeWIzSk5aWE56WVdkbEtHNHBmWDE5Wlhod2IzSjBlMk55WldGMFpVUmxiR1ZuWVhSbFpGTjFZbUZuWlc1MFJYSnliM0pTWlhOMWJIUXNZM0psWVhSbFJHVnNaV2RoZEdWa1UzVmlZV2RsYm5SVGRXTmpaWE56VW1WemRXeDBmVHNpTENJdktpcGZYMmx1ZEdWeWJtRnNYM2R2Y210bWJHOTNjM3RjSW5OMFpYQnpYQ0k2ZTF3aVpHbHpkQzl6Y21NdlpYaGxZM1YwYVc5dUwyWnZjbmRoY21RdGRIVnliaTFrWld4cGRtVnllUzF6ZEdWd0xtcHpYQ0k2ZTF3aVptOXlkMkZ5WkZSMWNtNUVaV3hwZG1WeWVWTjBaWEJjSWpwN1hDSnpkR1Z3U1dSY0lqcGNJbk4wWlhBdkwyVjJaVUF3TGpJMExqWXZMMlp2Y25kaGNtUlVkWEp1UkdWc2FYWmxjbmxUZEdWd1hDSjlmWDE5S2k4N1hHNWxlSEJ2Y25RZ2RtRnlJR1p2Y25kaGNtUlVkWEp1UkdWc2FYWmxjbmxUZEdWd0lEMGdaMnh2WW1Gc1ZHaHBjMXRUZVcxaWIyd3VabTl5S0Z3aVYwOVNTMFpNVDFkZlZWTkZYMU5VUlZCY0lpbGRLRndpYzNSbGNDOHZaWFpsUURBdU1qUXVOaTh2Wm05eWQyRnlaRlIxY201RVpXeHBkbVZ5ZVZOMFpYQmNJaWs3WEc0aUxDSnBiWEJ2Y25SN1kzSmxZWFJsU0c5dmEzMW1jbTl0WENJalkyOXRjR2xzWldRdlFIZHZjbXRtYkc5M0wyTnZjbVV2YVc1a1pYZ3Vhbk5jSWp0cGJYQnZjblI3WTJ4dmMyVkliMjlyU1hSbGNtRjBiM0lzWkdsemNHOXpaVWh2YjJ0OVpuSnZiVndpSTJWNFpXTjFkR2x2Ymk5b2IyOXJMVzkzYm1WeWMyaHBjQzVxYzF3aU8ybHRjRzl5ZEh0bWIzSjNZWEprVkhWeWJrUmxiR2wyWlhKNVUzUmxjSDFtY205dFhDSWpaWGhsWTNWMGFXOXVMMlp2Y25kaGNtUXRkSFZ5Ymkxa1pXeHBkbVZ5ZVMxemRHVndMbXB6WENJN2FXMXdiM0owZTNKbFluVnBiR1JUWlhKcFlXeHBlbUZpYkdWRmNuSnZjbjFtY205dFhDSWpaWGhsWTNWMGFXOXVMM2R2Y210bWJHOTNMV1Z5Y205eWN5NXFjMXdpTzNaaGNpQlVkWEp1UTI5dWRISnZiRkpsWTJWcGRtVnlQV05zWVhOemUySjFabVpsY21Wa1JHVnNhWFpsY21sbGN6dGpiMjUwY205c08yTnZiblJ5YjJ4SmRHVnlZWFJ2Y2p0a1pXeHBkbVZ5ZVVodmIyczdjR1Z1WkdsdVowTnZiblJ5YjJ3OWJuVnNiRHRqYjI1emRISjFZM1J2Y2loMEtYdDBhR2x6TG1KMVptWmxjbVZrUkdWc2FYWmxjbWxsY3oxMExtSjFabVpsY21Wa1JHVnNhWFpsY21sbGN5eDBhR2x6TG1OdmJuUnliMnc5WTNKbFlYUmxTRzl2YXloN2RHOXJaVzQ2ZEM1MGIydGxibjBwTEhSb2FYTXVZMjl1ZEhKdmJFbDBaWEpoZEc5eVBYUm9hWE11WTI5dWRISnZiRnRUZVcxaWIyd3VZWE41Ym1OSmRHVnlZWFJ2Y2wwb0tTeDBhR2x6TG1SbGJHbDJaWEo1U0c5dmF6MTBMbVJsYkdsMlpYSjVTRzl2YTMxblpYUWdkRzlyWlc0b0tYdHlaWFIxY200Z2RHaHBjeTVqYjI1MGNtOXNMblJ2YTJWdWZXRnplVzVqSUdScGMzQnZjMlVvS1h0aGQyRnBkQ0JqYkc5elpVaHZiMnRKZEdWeVlYUnZjaWgwYUdsekxtTnZiblJ5YjJ4SmRHVnlZWFJ2Y2lrc1lYZGhhWFFnWkdsemNHOXpaVWh2YjJzb2RHaHBjeTVqYjI1MGNtOXNLWDFoYzNsdVl5QjNZV2wwUm05eVFXTjBhVzl1S0NsN1ptOXlLRHM3S1h0c1pYUWdaVDFoZDJGcGRDQjBhR2x6TG01bGVIUkRiMjUwY205c0tHQlVkWEp1SUdOdmJuUnliMndnYUc5dmF5QmpiRzl6WldRZ1ltVm1iM0psSUdSbGJHbDJaWEpwYm1jZ1lTQnlaWE4xYkhRdVlDa3NkRDEwYUdsekxuSmxZV1JVWlhKdGFXNWhiRU52Ym5SeWIyd29aU2s3YVdZb2RDRTlQWFp2YVdRZ01DbHlaWFIxY200Z2REdHBaaWhsTG10cGJtUTlQVDFnZEhWeWJpMWtaV3hwZG1WeWVTMXlaWEYxWlhOMFlDbDdiR1YwSUhROVlYZGhhWFFnZEdocGN5NXpaWEoyYVdObFJHVnNhWFpsY25sU1pYRjFaWE4wS0dVcE8ybG1LSFFoUFQxMmIybGtJREFwY21WMGRYSnVJSFI5ZlgxaWRXWm1aWEpVZFhKdVJHVnNhWFpsY21sbGN5aGxLWHRsTG1KMVptWmxjbVZrUkdWc2FYWmxjbWxsY3lFOVBYWnZhV1FnTUNZbWRHaHBjeTVpZFdabVpYSmxaRVJsYkdsMlpYSnBaWE11ZFc1emFHbG1kQ2d1TGk1bExtSjFabVpsY21Wa1JHVnNhWFpsY21sbGN5bDlZMjl1YzNWdFpVTnZiblJ5YjJ3b0tYdDBhR2x6TG5CbGJtUnBibWREYjI1MGNtOXNQVzUxYkd4OVoyVjBRMjl1ZEhKdmJGQnliMjFwYzJVb0tYdHlaWFIxY200Z2RHaHBjeTV3Wlc1a2FXNW5RMjl1ZEhKdmJEOC9QWFJvYVhNdVkyOXVkSEp2YkVsMFpYSmhkRzl5TG01bGVIUW9LU3gwYUdsekxuQmxibVJwYm1kRGIyNTBjbTlzZldGemVXNWpJRzVsZUhSRGIyNTBjbTlzS0dVcGUyWnZjaWc3T3lsN2JHVjBJSFE5WVhkaGFYUWdkR2hwY3k1blpYUkRiMjUwY205c1VISnZiV2x6WlNncE8ybG1LSFJvYVhNdVkyOXVjM1Z0WlVOdmJuUnliMndvS1N4MExtUnZibVVwZEdoeWIzY2dSWEp5YjNJb1pTazdiR1YwSUc0OWRDNTJZV3gxWlR0cFppaHVMbXRwYm1ROVBUMWdkSFZ5YmkxbGNuSnZjbUFwZEdoeWIzY2djbVZpZFdsc1pGTmxjbWxoYkdsNllXSnNaVVZ5Y205eUtHNHVaWEp5YjNJcE8ybG1LRzR1YTJsdVpEMDlQV0IwZFhKdUxXTnZiblJwYm5WaGRHbHZiaTEwYjJ0bGJtQXBlMkYzWVdsMElIUm9hWE11WkdWc2FYWmxjbmxJYjI5ckxuSmxhMlY1S0c0dVkyOXVkR2x1ZFdGMGFXOXVWRzlyWlc0cE8yTnZiblJwYm5WbGZYSmxkSFZ5YmlCdWZYMXlaV0ZrVkdWeWJXbHVZV3hEYjI1MGNtOXNLR1VwZTJsbUtHVXVhMmx1WkQwOVBXQjBkWEp1TFdWeWNtOXlZQ2wwYUhKdmR5QnlaV0oxYVd4a1UyVnlhV0ZzYVhwaFlteGxSWEp5YjNJb1pTNWxjbkp2Y2lrN2FXWW9aUzVyYVc1a1BUMDlZSFIxY200dGNtVnpkV3gwWUNseVpYUjFjbTRnZEdocGN5NWlkV1ptWlhKVWRYSnVSR1ZzYVhabGNtbGxjeWhsS1N4bExtRmpkR2x2Ym4xaGMzbHVZeUJ6WlhKMmFXTmxSR1ZzYVhabGNubFNaWEYxWlhOMEtHVXBlMkYzWVdsMElIUm9hWE11WkdWc2FYWmxjbmxJYjI5ckxuSmxhMlY1S0dVdVkyOXVkR2x1ZFdGMGFXOXVWRzlyWlc0cE8yeGxkQ0IwUFhSb2FYTXVZblZtWm1WeVpXUkVaV3hwZG1WeWFXVnpMbk5vYVdaMEtDazdabTl5S0R0MFBUMDlkbTlwWkNBd095bDdiR1YwSUc0OVlYZGhhWFFnVUhKdmJXbHpaUzV5WVdObEtGdDBhR2x6TG1kbGRFTnZiblJ5YjJ4UWNtOXRhWE5sS0NrdWRHaGxiaWhsUFQ0b2UydHBibVE2WUdOdmJuUnliMnhnTEhaaGJIVmxPbVY5S1Nrc2RHaHBjeTVrWld4cGRtVnllVWh2YjJzdWJtVjRkQ2dwTG5Sb1pXNG9aVDArS0h0cmFXNWtPbUJrWld4cGRtVnllV0FzZG1Gc2RXVTZaWDBwS1YwcE8ybG1LRzR1YTJsdVpEMDlQV0JqYjI1MGNtOXNZQ2w3YVdZb2RHaHBjeTVqYjI1emRXMWxRMjl1ZEhKdmJDZ3BMRzR1ZG1Gc2RXVXVaRzl1WlNsMGFISnZkeUJGY25KdmNpaGdWSFZ5YmlCamIyNTBjbTlzSUdodmIyc2dZMnh2YzJWa0lHUjFjbWx1WnlCaElHUmxiR2wyWlhKNUlISmxjWFZsYzNRdVlDazdhV1lvYmk1MllXeDFaUzUyWVd4MVpTNXJhVzVrUFQwOVlIUjFjbTR0WTI5dWRHbHVkV0YwYVc5dUxYUnZhMlZ1WUNsN1lYZGhhWFFnZEdocGN5NWtaV3hwZG1WeWVVaHZiMnN1Y21WclpYa29iaTUyWVd4MVpTNTJZV3gxWlM1amIyNTBhVzUxWVhScGIyNVViMnRsYmlrN1kyOXVkR2x1ZFdWOWJHVjBJSFE5ZEdocGN5NXlaV0ZrVkdWeWJXbHVZV3hEYjI1MGNtOXNLRzR1ZG1Gc2RXVXVkbUZzZFdVcE8ybG1LSFFoUFQxMmIybGtJREFwY21WMGRYSnVJSFE3YVdZb2JpNTJZV3gxWlM1MllXeDFaUzVyYVc1a1BUMDlZSFIxY200dFpHVnNhWFpsY25rdFkyRnVZMlZzYkdWa1lDWW1iaTUyWVd4MVpTNTJZV3gxWlM1eVpYRjFaWE4wU1dROVBUMWxMbkpsY1hWbGMzUkpaQ2x5WlhSMWNtNDdZMjl1ZEdsdWRXVjlhV1lvYmk1MllXeDFaUzVrYjI1bEtYUm9jbTkzSUVWeWNtOXlLR0JUWlhOemFXOXVJR1JsYkdsMlpYSjVJR2h2YjJzZ1kyeHZjMlZrSUdSMWNtbHVaeUJoSUhSMWNtNGdaR1ZzYVhabGNua2djbVZ4ZFdWemRDNWdLVHQwYUdsekxtUmxiR2wyWlhKNVNHOXZheTVqYjI1emRXMWxUbVY0ZENncExHNHVkbUZzZFdVdWRtRnNkV1V1YTJsdVpEMDlQV0JrWld4cGRtVnlZQ1ltS0hROWJpNTJZV3gxWlM1MllXeDFaU2w5ZEhKNWUyRjNZV2wwSUdadmNuZGhjbVJVZFhKdVJHVnNhWFpsY25sVGRHVndLSHRwYm1KdmVGUnZhMlZ1T21VdWFXNWliM2hVYjJ0bGJpeHdZWGxzYjJGa09udGtaV3hwZG1WeWVUcDBMR3RwYm1RNllHUnlhWFpsY2kxa1pXeHBkbVZ5ZVdBc2NtVnhkV1Z6ZEVsa09tVXVjbVZ4ZFdWemRFbGtmWDBwZldOaGRHTm9LR1VwZTJsbUtDRW9aU0JwYm5OMFlXNWpaVzltSUVWeWNtOXlKaVpsTG01aGJXVTlQVDFnU0c5dmEwNXZkRVp2ZFc1a1JYSnliM0pnS1NsMGFISnZkeUJsZlhKbGRIVnliaUJoZDJGcGRDQjBhR2x6TG1GM1lXbDBSbTl5ZDJGeVpHVmtSR1ZzYVhabGNua29aUzV5WlhGMVpYTjBTV1FzZENsOVlYTjVibU1nWVhkaGFYUkdiM0ozWVhKa1pXUkVaV3hwZG1WeWVTaGxMSFFwZTJadmNpZzdPeWw3YkdWMElHNDlZWGRoYVhRZ2RHaHBjeTV1WlhoMFEyOXVkSEp2YkNoZ1ZIVnliaUJqYjI1MGNtOXNJR2h2YjJzZ1kyeHZjMlZrSUdKbFptOXlaU0J5WlhOdmJIWnBibWNnWVNCbWIzSjNZWEprWldRZ1pHVnNhWFpsY25rdVlDazdhV1lvYmk1cmFXNWtQVDA5WUhSMWNtNHRaR1ZzYVhabGNua3RZV05qWlhCMFpXUmdLWHRwWmlodUxuSmxjWFZsYzNSSlpEMDlQV1VwY21WMGRYSnVPMk52Ym5ScGJuVmxmV2xtS0c0dWEybHVaRDA5UFdCMGRYSnVMV1JsYkdsMlpYSjVMV05oYm1ObGJHeGxaR0FtSm00dWNtVnhkV1Z6ZEVsa1BUMDlaU2w3ZEdocGN5NWlkV1ptWlhKbFpFUmxiR2wyWlhKcFpYTXVkVzV6YUdsbWRDaDBLVHR5WlhSMWNtNTliaTVyYVc1a1BUMDlZSFIxY200dGNtVnpkV3gwWUNZbWRHaHBjeTVpZFdabVpYSmxaRVJsYkdsMlpYSnBaWE11ZFc1emFHbG1kQ2gwS1R0c1pYUWdjajEwYUdsekxuSmxZV1JVWlhKdGFXNWhiRU52Ym5SeWIyd29iaWs3YVdZb2NpRTlQWFp2YVdRZ01DbHlaWFIxY200Z2NuMTlmVHRsZUhCdmNuUjdWSFZ5YmtOdmJuUnliMnhTWldObGFYWmxjbjA3SWl3aWFXMXdiM0owZTJScGMzQmhkR05vVkhWeWJsTjBaWEI5Wm5KdmJWd2lJMlY0WldOMWRHbHZiaTkzYjNKclpteHZkeTF6ZEdWd2N5NXFjMXdpTzJsdGNHOXlkSHRVZFhKdVEyOXVkSEp2YkZKbFkyVnBkbVZ5ZldaeWIyMWNJaU5sZUdWamRYUnBiMjR2ZEhWeWJpMWpiMjUwY205c0xYSmxZMlZwZG1WeUxtcHpYQ0k3WVhONWJtTWdablZ1WTNScGIyNGdaR2x6Y0dGMFkyaEJibVJCZDJGcGRGUjFjbTRvZENsN2JHVjBJRzQ5Ym1WM0lGUjFjbTVEYjI1MGNtOXNVbVZqWldsMlpYSW9lMkoxWm1abGNtVmtSR1ZzYVhabGNtbGxjenAwTG1KMVptWmxjbVZrUkdWc2FYWmxjbWxsY3l4a1pXeHBkbVZ5ZVVodmIyczZkQzVrWld4cGRtVnllVWh2YjJzc2RHOXJaVzQ2ZEM1amIyNTBjbTlzVkc5clpXNTlLVHQwY25sN2NtVjBkWEp1SUdGM1lXbDBJR1JwYzNCaGRHTm9WSFZ5YmxOMFpYQW9lMk5oY0dGaWFXeHBkR2xsY3pwMExtTmhjR0ZpYVd4cGRHbGxjeXhqYjIxd2JHVjBhVzl1Vkc5clpXNDZiaTUwYjJ0bGJpeGtaV3hwZG1WeWVUcDBMbVJsYkdsMlpYSjVMRzF2WkdVNmRDNXRiMlJsTEhCaGNtVnVkRmR5YVhSaFlteGxPblF1Y0dGeVpXNTBWM0pwZEdGaWJHVXNjMlZ5YVdGc2FYcGxaRU52Ym5SbGVIUTZkQzV6WlhKcFlXeHBlbVZrUTI5dWRHVjRkQ3h6WlhOemFXOXVVM1JoZEdVNmRDNXpaWE56YVc5dVUzUmhkR1Y5S1N4N1lXTjBhVzl1T21GM1lXbDBJRzR1ZDJGcGRFWnZja0ZqZEdsdmJpZ3BMR1JwYzNCdmMyVTZLQ2s5UG00dVpHbHpjRzl6WlNncGZYMWpZWFJqYUNobEtYdDBhSEp2ZHlCaGQyRnBkQ0J1TG1ScGMzQnZjMlVvS1N4bGZYMWxlSEJ2Y25SN1pHbHpjR0YwWTJoQmJtUkJkMkZwZEZSMWNtNTlPeUlzSWk4cUtsOWZhVzUwWlhKdVlXeGZkMjl5YTJac2IzZHplMXdpYzNSbGNITmNJanA3WENKa2FYTjBMM055WXk5bGVHVmpkWFJwYjI0dlkzSmxZWFJsTFhObGMzTnBiMjR0YzNSbGNDNXFjMXdpT250Y0ltTnlaV0YwWlZObGMzTnBiMjVUZEdWd1hDSTZlMXdpYzNSbGNFbGtYQ0k2WENKemRHVndMeTlsZG1WQU1DNHlOQzQyTHk5amNtVmhkR1ZUWlhOemFXOXVVM1JsY0Z3aWZYMTlmU292TzF4dVpYaHdiM0owSUhaaGNpQmpjbVZoZEdWVFpYTnphVzl1VTNSbGNDQTlJR2RzYjJKaGJGUm9hWE5iVTNsdFltOXNMbVp2Y2loY0lsZFBVa3RHVEU5WFgxVlRSVjlUVkVWUVhDSXBYU2hjSW5OMFpYQXZMMlYyWlVBd0xqSTBMall2TDJOeVpXRjBaVk5sYzNOcGIyNVRkR1Z3WENJcE8xeHVJaXdpTHlvcVgxOXBiblJsY201aGJGOTNiM0pyWm14dmQzTjdYQ0p6ZEdWd2Mxd2lPbnRjSW1ScGMzUXZjM0pqTDJWNFpXTjFkR2x2Ymk5elpYUjBiR1V0WTJGdVkyVnNiR1ZrTFhSMWNtNHRjM1JsY0M1cWMxd2lPbnRjSW5ObGRIUnNaVU5oYm1ObGJHeGxaRlIxY201VGRHVndYQ0k2ZTF3aWMzUmxjRWxrWENJNlhDSnpkR1Z3THk5bGRtVkFNQzR5TkM0Mkx5OXpaWFIwYkdWRFlXNWpaV3hzWldSVWRYSnVVM1JsY0Z3aWZYMTlmU292TzF4dVpYaHdiM0owSUhaaGNpQnpaWFIwYkdWRFlXNWpaV3hzWldSVWRYSnVVM1JsY0NBOUlHZHNiMkpoYkZSb2FYTmJVM2x0WW05c0xtWnZjaWhjSWxkUFVrdEdURTlYWDFWVFJWOVRWRVZRWENJcFhTaGNJbk4wWlhBdkwyVjJaVUF3TGpJMExqWXZMM05sZEhSc1pVTmhibU5sYkd4bFpGUjFjbTVUZEdWd1hDSXBPMXh1SWl3aUx5b3FYMTlwYm5SbGNtNWhiRjkzYjNKclpteHZkM043WENKemRHVndjMXdpT250Y0ltUnBjM1F2YzNKakwyVjRaV04xZEdsdmJpOTBaWEp0YVc1aGJDMXpaWE56YVc5dUxXWmhhV3gxY21VdGMzUmxj",
	"QzVxYzF3aU9udGNJbVZ0YVhSVVpYSnRhVzVoYkZObGMzTnBiMjVHWVdsc2RYSmxVM1JsY0Z3aU9udGNJbk4wWlhCSlpGd2lPbHdpYzNSbGNDOHZaWFpsUURBdU1qUXVOaTh2WlcxcGRGUmxjbTFwYm1Gc1UyVnpjMmx2YmtaaGFXeDFjbVZUZEdWd1hDSjlmWDE5S2k4N1hHNWxlSEJ2Y25RZ2RtRnlJR1Z0YVhSVVpYSnRhVzVoYkZObGMzTnBiMjVHWVdsc2RYSmxVM1JsY0NBOUlHZHNiMkpoYkZSb2FYTmJVM2x0WW05c0xtWnZjaWhjSWxkUFVrdEdURTlYWDFWVFJWOVRWRVZRWENJcFhTaGNJbk4wWlhBdkwyVjJaVUF3TGpJMExqWXZMMlZ0YVhSVVpYSnRhVzVoYkZObGMzTnBiMjVHWVdsc2RYSmxVM1JsY0Z3aUtUdGNiaUlzSWk4cUtsOWZhVzUwWlhKdVlXeGZkMjl5YTJac2IzZHplMXdpYzNSbGNITmNJanA3WENKa2FYTjBMM055WXk5bGVHVmpkWFJwYjI0dmMyVnpjMmx2YmkxallXeHNZbUZqYXkxemRHVndMbXB6WENJNmUxd2labWx5WlZObGMzTnBiMjVEWVd4c1ltRmphMU4wWlhCY0lqcDdYQ0p6ZEdWd1NXUmNJanBjSW5OMFpYQXZMMlYyWlVBd0xqSTBMall2TDJacGNtVlRaWE56YVc5dVEyRnNiR0poWTJ0VGRHVndYQ0o5ZlgxOUtpODdYRzVsZUhCdmNuUWdkbUZ5SUdacGNtVlRaWE56YVc5dVEyRnNiR0poWTJ0VGRHVndJRDBnWjJ4dlltRnNWR2hwYzF0VGVXMWliMnd1Wm05eUtGd2lWMDlTUzBaTVQxZGZWVk5GWDFOVVJWQmNJaWxkS0Z3aWMzUmxjQzh2WlhabFFEQXVNalF1Tmk4dlptbHlaVk5sYzNOcGIyNURZV3hzWW1GamExTjBaWEJjSWlrN1hHNGlMQ0pwYlhCdmNuUjdZM0psWVhSbFNHOXZhMzFtY205dFhDSWpZMjl0Y0dsc1pXUXZRSGR2Y210bWJHOTNMMk52Y21VdmFXNWtaWGd1YW5OY0lqdHBiWEJ2Y25SN1kyeGhhVzFJYjI5clQzZHVaWEp6YUdsd0xHUnBjM0J2YzJWSWIyOXJmV1p5YjIxY0lpTmxlR1ZqZFhScGIyNHZhRzl2YXkxdmQyNWxjbk5vYVhBdWFuTmNJanRtZFc1amRHbHZiaUJqY21WaGRHVlRaWE56YVc5dVJHVnNhWFpsY25sSWIyOXJLSElwZTJ4bGRDQnBMR0U5VzEwc2J6MWJYU3h6UFRBc1l6MXVkV3hzTEd3c2RTeGxibkYxWlhWbFBXVTlQbnR2TG5CMWMyZ29aU2tzYnk1emIzSjBLQ2hsTEhRcFBUNWxMbTl5WkdWeUxYUXViM0prWlhJcExIVS9MaWdwTEhVOWRtOXBaQ0F3ZlN4aGNtMDlaVDArZTJVdVkyeHZjMlZrZkh4bExuQmxibVJwYm1kOGZDaGxMbkJsYm1ScGJtYzlJVEFzWlM1eVpYTnZiSFpsWkQxMmIybGtJREFzS0dVdWNtVjBhWEpsWkQ5UWNtOXRhWE5sTG5KbGMyOXNkbVVvWlM1b2IyOXJLUzUwYUdWdUtHVTlQaWg3Wkc5dVpUb2hNU3gyWVd4MVpUcGxmU2twT21VdWFYUmxjbUYwYjNJdWJtVjRkQ2dwS1M1MGFHVnVLSFE5UG50c1pYUWdiajE3YjNKa1pYSTZjeXNyTEhKbGMzVnNkRHAwTEhOMFlYUmxPbVY5TzJVdWNtVnpiMngyWldROWJpeGxMbVZ1WVdKc1pXUW1KbVZ1Y1hWbGRXVW9iaWw5TENncFBUNTdmU2twZlN4bGJtRmliR1U5WlQwK2UyVXVaVzVoWW14bFpEMGhNQ3hsTG5KbGMyOXNkbVZrSVQwOWRtOXBaQ0F3SmlabGJuRjFaWFZsS0dVdWNtVnpiMngyWldRcGZTeGtjbUZwYmxKbFlXUjVQV0Z6ZVc1aktDazlQbnRwWmloalBUMDliblZzYkNsbWIzSW9ZWGRoYVhRZ1VISnZiV2x6WlM1eVpYTnZiSFpsS0NrN2J5NXNaVzVuZEdnK01Ec3BlMnhsZENCbFBXOHVjMmhwWm5Rb0tUdGxMbk4wWVhSbExuQmxibVJwYm1jOUlURXNaUzV6ZEdGMFpTNXlaWE52YkhabFpEMTJiMmxrSURBc1pTNXlaWE4xYkhRdVpHOXVaVDlsTG5OMFlYUmxMbU5zYjNObFpEMGhNRHBsTG5KbGMzVnNkQzUyWVd4MVpTNXJhVzVrUFQwOVlHUmxiR2wyWlhKZ0ppWnlMbkIxYzJnb1pTNXlaWE4xYkhRdWRtRnNkV1VwTEdGeWJTaGxMbk4wWVhSbEtTeGhkMkZwZENCUWNtOXRhWE5sTG5KbGMyOXNkbVVvS1gxOU8zSmxkSFZ5Ym50amIyNXpkVzFsVG1WNGRDZ3BlMmxtS0d3OVBUMTJiMmxrSURBcGRHaHliM2NnUlhKeWIzSW9ZRU5oYm01dmRDQmpiMjV6ZFcxbElHRWdjSFZpYkdsaklHUmxiR2wyWlhKNUlHSmxabTl5WlNCcGRDQnlaWE52YkhabGN5NWdLVHRzTG5OMFlYUmxMbkJsYm1ScGJtYzlJVEVzYkM1emRHRjBaUzV5WlhOdmJIWmxaRDEyYjJsa0lEQXNiQzV5WlhOMWJIUXVaRzl1WlNZbUtHd3VjM1JoZEdVdVkyeHZjMlZrUFNFd0tTeHNQWFp2YVdRZ01DeGpQVzUxYkd4OUxHRnplVzVqSUdScGMzQnZjMlVvS1h0cElUMDlkbTlwWkNBd0ppWW9ZWGRoYVhRZ1pHbHpjRzl6WlVodmIyc29hUzVvYjI5cktTeHBQWFp2YVdRZ01DbDlMRzVsZUhRb0tYdHBaaWhwUFQwOWRtOXBaQ0F3S1hSb2NtOTNJRVZ5Y205eUtHQkRZVzV1YjNRZ2QyRnBkQ0JtYjNJZ1pHVnNhWFpsY21sbGN5QmlaV1p2Y21VZ1lTQmpiMjUwYVc1MVlYUnBiMjRnZEc5clpXNGdhWE1nWVhaaGFXeGhZbXhsTG1BcE8ybG1LR01oUFQxdWRXeHNLWEpsZEhWeWJpQmpPMkZ5YlNocEtUdG1iM0lvYkdWMElHVWdiMllnWVNsaGNtMG9aU2s3Y21WMGRYSnVJR2t1WTJ4dmMyVmtKaVpoTG1WMlpYSjVLR1U5UG1VdVkyeHZjMlZrS1Q4b2JEMTdiM0prWlhJNmN5c3JMSEpsYzNWc2REcDdaRzl1WlRvaE1DeDJZV3gxWlRwMmIybGtJREI5TEhOMFlYUmxPbWw5TEdNOVVISnZiV2x6WlM1eVpYTnZiSFpsS0d3dWNtVnpkV3gwS1N4aktUb29ZejBvWVhONWJtTW9LVDArZTJadmNpZzdieTVzWlc1bmRHZzlQVDB3T3lsaGQyRnBkQ0J1WlhjZ1VISnZiV2x6WlNobFBUNTdkVDFsZlNrN2JHVjBJR1U5Ynk1emFHbG1kQ2dwTzNKbGRIVnliaUJzUFdVc1pTNXlaWE4xYkhSOUtTZ3BMR01wZlN4aGMzbHVZeUJ5Wld0bGVTaHlLWHRwWmlnaGNueDhhVDh1YUc5dmF5NTBiMnRsYmowOVBYSXBjbVYwZFhKdU8yeGxkQ0J2UFdOeVpXRjBaVWh2YjJzb2UzUnZhMlZ1T25KOUtTeHpQWHRqYkc5elpXUTZJVEVzWlc1aFlteGxaRG9oTVN4b2IyOXJPbThzYVhSbGNtRjBiM0k2YjF0VGVXMWliMnd1WVhONWJtTkpkR1Z5WVhSdmNsMG9LU3h3Wlc1a2FXNW5PaUV4TEhKbGRHbHlaV1E2SVRGOU8ybG1LR2s5UFQxMmIybGtJREFwZTJGM1lXbDBJR05zWVdsdFNHOXZhMDkzYm1WeWMyaHBjQ2h6TG1odmIyc3BMR1Z1WVdKc1pTaHpLU3hwUFhNN2NtVjBkWEp1Zld4bGRDQmpQV2s3WVhKdEtHTXBMR0Z5YlNoektTeGhkMkZwZENCamJHRnBiVWh2YjJ0UGQyNWxjbk5vYVhBb2N5NW9iMjlyS1N4bGJtRmliR1VvY3lrc1lYZGhhWFFnWkhKaGFXNVNaV0ZrZVNncE8zUnllWHRoZDJGcGRDQmthWE53YjNObFNHOXZheWhqTG1odmIyc3BmV05oZEdOb0tHVXBlMms5ZG05cFpDQXdPM1J5ZVh0aGQyRnBkQ0JrYVhOd2IzTmxTRzl2YXloekxtaHZiMnNwZldOaGRHTm9lMzEwYUhKdmR5QmxmV011Y21WMGFYSmxaRDBoTUN4aExuQjFjMmdvWXlrc2FUMXpMR0YzWVdsMElHUnlZV2x1VW1WaFpIa29LWDE5ZldWNGNHOXlkSHRqY21WaGRHVlRaWE56YVc5dVJHVnNhWFpsY25sSWIyOXJmVHNpTENJdktpcGZYMmx1ZEdWeWJtRnNYM2R2Y210bWJHOTNjM3RjSW5kdmNtdG1iRzkzYzF3aU9udGNJbVJwYzNRdmMzSmpMMlY0WldOMWRHbHZiaTkzYjNKclpteHZkeTFsYm5SeWVTNXFjMXdpT250Y0luZHZjbXRtYkc5M1JXNTBjbmxjSWpwN1hDSjNiM0pyWm14dmQwbGtYQ0k2WENKM2IzSnJabXh2ZHk4dlpYWmxMeTkzYjNKclpteHZkMFZ1ZEhKNVhDSjlmWDE5S2k4N1hHNXBiWEJ2Y25SN2NtVmhaRk5sY21saGJHbDZaV1JUZFdKaFoyVnVkRVJsY0hSb2ZXWnliMjFjSWlOb1lYSnVaWE56TDNOMVltRm5aVzUwTFdSbGNIUm9MbXB6WENJN2FXMXdiM0owZTJOeVpXRjBaVWh2YjJzc1oyVjBWMjl5YTJac2IzZE5aWFJoWkdGMFlTeG5aWFJYY21sMFlXSnNaWDFtY205dFhDSWpZMjl0Y0dsc1pXUXZRSGR2Y210bWJHOTNMMk52Y21VdmFXNWtaWGd1YW5OY0lqdHBiWEJ2Y25SN1pHbHpjRzl6WlVodmIydDlabkp2YlZ3aUkyVjRaV04xZEdsdmJpOW9iMjlyTFc5M2JtVnljMmhwY0M1cWMxd2lPMmx0Y0c5eWRIdHViM0p0WVd4cGVtVlRaWEpwWVd4cGVtRmliR1ZGY25KdmNuMW1jbTl0WENJalpYaGxZM1YwYVc5dUwzZHZjbXRtYkc5M0xXVnljbTl5Y3k1cWMxd2lPMmx0Y0c5eWRIdHliM1YwWlVSbGJHbDJaWEpVYjBOb2FXeGtjbVZ1ZldaeWIyMWNJaU5sZUdWamRYUnBiMjR2Y205MWRHVXRZMmhwYkdRdFpHVnNhWFpsY25rdWFuTmNJanRwYlhCdmNuUjdZMjloYkdWelkyVkVaV3hwZG1WeWFXVnpmV1p5YjIxY0lpTm9ZWEp1WlhOekwyMWxjM05oWjJWekxtcHpYQ0k3YVcxd2IzSjBlM0psWVdSRGFHRnVibVZzVW1WeGRXVnpkRWxrTEhKbFlXUlNiMjkwVTJWemMybHZia2xrZldaeWIyMWNJaU5sZUdWamRYUnBiMjR2WlhabExYZHZjbXRtYkc5M0xXRjBkSEpwWW5WMFpYTXVhbk5jSWp0cGJYQnZjblI3Ym05MGFXWjVSR1ZzWldkaGRHVmtVR0Z5Wlc1MFUzUmxjSDFtY205dFhDSWpaWGhsWTNWMGFXOXVMMlJsYkdWbllYUmxaQzF3WVhKbGJuUXRibTkwYVdacFkyRjBhVzl1TG1welhDSTdhVzF3YjNKMGUyTnlaV0YwWlVSbGJHVm5ZWFJsWkZOMVltRm5aVzUwUlhKeWIzSlNaWE4xYkhRc1kzSmxZWFJsUkdWc1pXZGhkR1ZrVTNWaVlXZGxiblJUZFdOalpYTnpVbVZ6ZFd4MGZXWnliMjFjSWlObGVHVmpkWFJwYjI0dlpHVnNaV2RoZEdWa0xYQmhjbVZ1ZEMxeVpYTjFiSFF1YW5OY0lqdHBiWEJ2Y25SN1pHbHpjR0YwWTJoQmJtUkJkMkZwZEZSMWNtNTlabkp2YlZ3aUkyVjRaV04xZEdsdmJpOTBkWEp1TFdScGMzQmhkR05vTG1welhDSTdhVzF3YjNKMGUyTnlaV0YwWlZObGMzTnBiMjVUZEdWd2ZXWnliMjFjSWlObGVHVmpkWFJwYjI0dlkzSmxZWFJsTFhObGMzTnBiMjR0YzNSbGNDNXFjMXdpTzJsdGNHOXlkSHR6WlhSMGJHVkRZVzVqWld4c1pXUlVkWEp1VTNSbGNIMW1jbTl0WENJalpYaGxZM1YwYVc5dUwzTmxkSFJzWlMxallXNWpaV3hzWldRdGRIVnliaTF6ZEdWd0xtcHpYQ0k3YVcxd2IzSjBlMlZ0YVhSVVpYSnRhVzVoYkZObGMzTnBiMjVHWVdsc2RYSmxVM1JsY0gxbWNtOXRYQ0lqWlhobFkzVjBhVzl1TDNSbGNtMXBibUZzTFhObGMzTnBiMjR0Wm1GcGJIVnlaUzF6ZEdWd0xtcHpYQ0k3YVcxd2IzSjBlMlpwY21WVFpYTnphVzl1UTJGc2JHSmhZMnRUZEdWd2ZXWnliMjFjSWlObGVHVmpkWFJwYjI0dmMyVnpjMmx2YmkxallXeHNZbUZqYXkxemRHVndMbXB6WENJN2FXMXdiM0owZTJOeVpXRjBaVk5sYzNOcGIyNUVaV3hwZG1WeWVVaHZiMnQ5Wm5KdmJWd2lJMlY0WldOMWRHbHZiaTl6WlhOemFXOXVMV1JsYkdsMlpYSjVMV2h2YjJzdWFuTmNJanRoYzNsdVl5Qm1kVzVqZEdsdmJpQjNiM0pyWm14dmQwVnVkSEo1S0hRcGUyeGxkSHQzYjNKclpteHZkMUoxYmtsa09tbDlQV2RsZEZkdmNtdG1iRzkzVFdWMFlXUmhkR0VvS1N4dlBYUXVjMlZ5YVdGc2FYcGxaRU52Ym5SbGVIUmJZR1YyWlM1amIyNTBhVzUxWVhScGIyNVViMnRsYm1CZGZIeGdZQ3h6UFhRdWMyVnlhV0ZzYVhwbFpFTnZiblJsZUhSYllHVjJaUzV0YjJSbFlGMHNkVDEwTG5ObGNtbGhiR2w2WldSRGIyNTBaWGgwVzJCbGRtVXVZMkZ3WVdKcGJHbDBhV1Z6WUYwc1pEMTBMbk5sY21saGJHbDZaV1JEYjI1MFpYaDBXMkJsZG1VdVluVnVaR3hsWUYwN2RDNXpaWEpwWVd4cGVtVmtRMjl1ZEdWNGRGdGdaWFpsTG5ObGMzTnBiMjVKWkdCZFBXazdiR1YwSUdZOVoyVjBWM0pwZEdGaWJHVW9LVHQwY25sN2JHVjBJRzQ5Y21WaFpGSnZiM1JUWlhOemFXOXVTV1FvZEM1elpYSnBZV3hwZW1Wa1EyOXVkR1Y0ZENrc2NqMXlaV0ZrVTJWeWFXRnNhWHBsWkZOMVltRm5aVzUwUkdWd2RHZ29kQzV6WlhKcFlXeHBlbVZrUTI5dWRHVjRkQ2tzZTNOMFlYUmxPbUY5UFdGM1lXbDBJR055WldGMFpWTmxjM05wYjI1VGRHVndLSHRqYjIxd2FXeGxaRUZ5ZEdsbVlXTjBjMU52ZFhKalpUcGtMbk52ZFhKalpTeGpiMjUwYVc1MVlYUnBiMjVVYjJ0bGJqcHZMR2x1YUdWeWFYUmxaRXhwYldsMGN6cDBMbXhwYldsMGN5eHViMlJsU1dRNlpDNXViMlJsU1dRc2IzVjBjSFYwVTJOb1pXMWhPblF1YVc1d2RYUXViM1YwY0hWMFUyTm9aVzFoTEhKdmIzUlRaWE56YVc5dVNXUTZiaXh6WlhOemFXOXVTV1E2YVN4emRXSmhaMlZ1ZEVSbGNIUm9Pbko5S1R0eVpYUjFjbTRnWVhkaGFYUWdjblZ1UkhKcGRtVnlURzl2Y0NoN1kyRndZV0pwYkdsMGFXVnpPblVzWkhKcGRtVnlWM0pwZEdGaWJHVTZaaXhwYm1sMGFXRnNTVzV3ZFhRNmUydHBibVE2WUdSbGJHbDJaWEpnTEhCaGVXeHZZV1J6T2x0N2JXVnpjMkZuWlRwMExtbHVjSFYwTG0xbGMzTmhaMlVzWTI5dWRHVjRkRHAwTG1sdWNIVjBMbU52Ym5SbGVIUXNiM1YwY0hWMFUyTm9aVzFoT25RdWFXNXdkWFF1YjNWMGNIVjBVMk5vWlcxaGZWMHNjbVZ4ZFdWemRFbGtPbkpsWVdSRGFHRnVibVZzVW1WeGRXVnpkRWxrS0hRdWMyVnlhV0ZzYVhwbFpFTnZiblJsZUhRcGZTeHRiMlJsT25Nc2MyVnlhV0ZzYVhwbFpFTnZiblJsZUhRNmRDNXpaWEpwWVd4cGVtVmtRMjl1ZEdWNGRDeHpaWE56YVc5dVUzUmhkR1U2WVgwcGZXTmhkR05vS0dVcGUzUm9jbTkzSUdGM1lXbDBJR1Z0YVhSVVpYSnRhVzVoYkZObGMzTnBiMjVHWVdsc2RYSmxVM1JsY0NoN1pYSnliM0k2Ym05eWJXRnNhWHBsVTJWeWFXRnNhWHBoWW14bFJYSnliM0lvWlNrc2NHRnlaVzUwVjNKcGRHRmliR1U2Wml4elpYSnBZV3hwZW1Wa1EyOXVkR1Y0ZERwMExuTmxjbWxoYkdsNlpXUkRiMjUwWlhoMGZTa3NZWGRoYVhRZ1ptbHlaVk5sYzNOcGIyNURZV3hzWW1GamExTjBaWEFvZTJWeWNtOXlPbTV2Y20xaGJHbDZaVk5sY21saGJHbDZZV0pzWlVWeWNtOXlLR1VwTEhObGNtbGhiR2w2WldSRGIyNTBaWGgwT25RdWMyVnlhV0ZzYVhwbFpFTnZiblJsZUhRc2MzUmhkSFZ6T21CbVlXbHNaV1JnZlNrc1lYZGhhWFFnYm05MGFXWjVSR1ZzWldkaGRHVmtVR0Z5Wlc1MFUzUmxjQ2g3Y21WemRXeDBPbU55WldGMFpVUmxiR1ZuWVhSbFpGTjFZbUZuWlc1MFJYSnliM0pTWlhOMWJIUW9kQzV6WlhKcFlXeHBlbVZrUTI5dWRHVjRkQ3hsS1N4elpYSnBZV3hwZW1Wa1EyOXVkR1Y0ZERwMExuTmxjbWxoYkdsNlpXUkRiMjUwWlhoMGZTa3NaWDE5WVhONWJtTWdablZ1WTNScGIyNGdjblZ1UkhKcGRtVnlURzl2Y0NobEtYdHNaWFFnYmoxamNtVmhkR1ZJYjI5cktIdDBiMnRsYmpwZ0pIdGxMbk5sYzNOcGIyNVRkR0YwWlM1elpYTnphVzl1U1dSOU9tRjFkR2hnZlNrc2NqMXVXMU41YldKdmJDNWhjM2x1WTBsMFpYSmhkRzl5WFNncExHRTlNQ3h1WlhoMFZIVnlia052Ym5SeWIyeFViMnRsYmowb0tUMCtZQ1I3WlM1elpYTnphVzl1VTNSaGRHVXVjMlZ6YzJsdmJrbGtmVHAwZFhKdUxXTnZiblJ5YjJ3NkpIdFRkSEpwYm1jb1lTc3JLWDFnTEhNOVcxMHNZejFqY21WaGRHVlRaWE56YVc5dVJHVnNhWFpsY25sSWIyOXJLSE1wTEd3c2NuVnVWSFZ5YmoxaGMzbHVZeUIwUFQ1N2JHVjBJRzQ5WVhkaGFYUWdaR2x6Y0dGMFkyaEJibVJCZDJGcGRGUjFjbTRvZTJKMVptWmxjbVZrUkdWc2FYWmxjbWxsY3pwekxHTmhjR0ZpYVd4cGRHbGxjenBsTG1OaGNHRmlhV3hwZEdsbGN5eGpiMjUwY205c1ZHOXJaVzQ2Ym1WNGRGUjFjbTVEYjI1MGNtOXNWRzlyWlc0b0tTeGtaV3hwZG1WeWVUcDBMbVJsYkdsMlpYSjVMR1JsYkdsMlpYSjVTRzl2YXpwakxHMXZaR1U2WlM1dGIyUmxMSEJoY21WdWRGZHlhWFJoWW14bE9tVXVaSEpwZG1WeVYzSnBkR0ZpYkdVc2MyVnlhV0ZzYVhwbFpFTnZiblJsZUhRNmRDNXpaWEpwWVd4cGVtVmtRMjl1ZEdWNGRDeHpaWE56YVc5dVUzUmhkR1U2ZEM1elpYTnphVzl1VTNSaGRHVjlLVHR5WlhSMWNtNGdZWGRoYVhRZ2JEOHVLQ2tzYkQxdUxtUnBjM0J2YzJVc2JpNWhZM1JwYjI1OU8zUnllWHRsTG5ObGMzTnBiMjVUZEdGMFpTNWpiMjUwYVc1MVlYUnBiMjVVYjJ0bGJpWW1ZWGRoYVhRZ1l5NXlaV3RsZVNobExuTmxjM05wYjI1VGRHRjBaUzVqYjI1MGFXNTFZWFJwYjI1VWIydGxiaWs3YkdWMElIUTlZWGRoYVhRZ2NuVnVWSFZ5YmloN1pHVnNhWFpsY25rNlpTNXBibWwwYVdGc1NXNXdkWFFzYzJWeWFXRnNhWHBsWkVOdmJuUmxlSFE2WlM1elpYSnBZV3hwZW1Wa1EyOXVkR1Y0ZEN4elpYTnphVzl1VTNSaGRHVTZaUzV6WlhOemFXOXVVM1JoZEdWOUtUdG1iM0lvT3pzcGUybG1LSFF1YTJsdVpEMDlQV0JrYjI1bFlDbHlaWFIxY200Z1lYZGhhWFFnWm1sdVlXeHBlbVZFYjI1bEtIdGhZM1JwYjI0NmRDeGtjbWwyWlhKWGNtbDBZV0pzWlRwbExtUnlhWFpsY2xkeWFYUmhZbXhsZlNrN2FXWW9kQzVyYVc1a0lUMDlZSEJoY210Z0tYUm9jbTkzSUVWeWNtOXlLR0JFY21sMlpYSWdjbVZqWldsMlpXUWdkVzVsZUhCbFkzUmxaQ0IwZFhKdUlHRmpkR2x2YmlCY0lpUjdkQzVyYVc1a2ZWd2lMbUFwTzJsbUtIUXVZMkZ1WTJWc2JHVmtQVDA5SVRBcGUyeGxkQ0J1UFdGM1lXbDBJSE5sZEhSc1pVTmhibU5sYkd4bFpGUjFjbTVUZEdWd0tIdHdZWEpsYm5SWGNtbDBZV0pzWlRwbExtUnlhWFpsY2xkeWFYUmhZbXhsTEhObGNtbGhiR2w2WldSRGIyNTBaWGgwT25RdWMyVnlhV0ZzYVhwbFpFTnZiblJsZUhRc2MyVnpjMmx2YmxOMFlYUmxPblF1YzJWemMybHZibE4wWVhSbGZTazdkRDE3TGk0dWRDeHpaWEpwWVd4cGVtVmtRMjl1ZEdWNGREcHVMbk5sY21saGJHbDZaV1JEYjI1MFpYaDBMSE5sYzNOcGIyNVRkR0YwWlRwdUxuTmxjM05wYjI1VGRHRjBaWDE5YVdZb0lYUXVjMlZ6YzJsdmJsTjBZWFJsTG1OdmJuUnBiblZoZEdsdmJsUnZhMlZ1S1hSb2NtOTNJRVZ5Y205eUtGd2lRMkZ1Ym05MElIQmhjbXM2SUc1dklHTnZiblJwYm5WaGRHbHZiaUIwYjJ0bGJpQmhkbUZwYkdGaWJHVXVJRlJvWlNCamFHRnVibVZzSUcxMWMzUWdjRzl6ZENCMGFHVWdabWx5YzNRZ2JXVnpjMkZuWlNCa2RYSnBibWNnZEdobElHbHVhWFJwWVd3Z2RIVnliaUFvWVc1amFHOXlhVzVuSUhSb1pTQnpaWE56YVc5dUtTQnZjaUJnYzJWdVpDZ3BZQ0J0ZFhOMElHSmxJR05oYkd4bFpDQjNhWFJvSUdGdUlHVjRjR3hwWTJsMElHTnZiblJwYm5WaGRHbHZibFJ2YTJWdUxsd2lLVHRwWmloaGQyRnBkQ0JqTG5KbGEyVjVLSFF1YzJWemMybHZibE4wWVhSbExtTnZiblJwYm5WaGRHbHZibFJ2YTJWdUtTeDBMbUYxZEdodmNtbDZZWFJwYjI1T1lXMWxjeVltZEM1aGRYUm9iM0pwZW1GMGFXOXVUbUZ0WlhNdWJHVnVaM1JvUGpBcGUyeGxkQ0JsUFhRdVlYVjBhRzl5YVhwaGRHbHZiazVoYldWekxteGxibWQwYUN4dVBWdGRPMlp2Y2lnN2JpNXNaVzVuZEdnOFpUc3BlMnhsZENCbFBXRjNZV2wwSUhJdWJtVjRkQ2dwTzJsbUtHVXVaRzl1WlNsaWNtVmhhenRsTG5aaGJIVmxMbXRwYm1ROVBUMWdaR1ZzYVhabGNtQW1KbTR1Y0hWemFDZ3VMaTVsTG5aaGJIVmxMbkJoZVd4dllXUnpLWDEwUFdGM1lXbDBJSEoxYmxSMWNtNG9lMlJsYkdsMlpYSjVPbnRyYVc1a09tQmtaV3hwZG1WeVlDeHdZWGxzYjJGa2N6cHVmU3h6WlhKcFlXeHBlbVZrUTI5dWRHVjRkRHAwTG5ObGNtbGhiR2w2WldSRGIyNTBaWGgwTEhObGMzTnBiMjVUZEdGMFpUcDBMbk5sYzNOcGIyNVRkR0YwWlgwcE8yTnZiblJwYm5WbGZXeGxkQ0J1UFdGM1lXbDBJSGRoYVhSR2IzSk9aWGgwUkdWc2FYWmxjaWg3WW5WbVptVnlaV1JFWld4cGRtVnlhV1Z6T25Nc1pHVnNhWFpsY25sSWIyOXJPbU45S1R0cFppaHVQVDA5Ym5Wc2JDbHlaWFIxY201N2IzVjBjSFYwT21CZ2ZUdHNaWFFnYVQxaGQyRnBkQ0J5YjNWMFpVUmxiR2wyWlhKVWIwTm9hV3hrY21WdUtIdGhkWFJvT200dVlYVjBhQ3h3WVhKbGJuUlhjbWwwWVdKc1pUcGxMbVJ5YVhabGNsZHlhWFJoWW14bExIQmhlV3h2WVdSek9tNHVjR0Y1Ykc5aFpITXNjMlZ6YzJsdmJsTjBZWFJsT25RdWMyVnpjMmx2YmxOMFlYUmxmU2s3YVNFOVBYWnZhV1FnTUNZbUtIUTlZWGRoYVhRZ2NuVnVWSFZ5YmloN1pHVnNhWFpsY25rNmUyRjFkR2c2Ymk1aGRYUm9MR3RwYm1RNllHUmxiR2wyWlhKZ0xIQmhlV3h2WVdSek9sdHBYU3h5WlhGMVpYTjBTV1E2Ymk1eVpYRjFaWE4wU1dSOUxITmxjbWxoYkdsNlpXUkRiMjUwWlhoME9uUXVjMlZ5YVdGc2FYcGxaRU52Ym5SbGVIUXNjMlZ6YzJsdmJsTjBZWFJsT25RdWMyVnpjMmx2YmxOMFlYUmxmU2twZlgxbWFXNWhiR3g1ZTJGM1lXbDBJR3cvTGlncExHRjNZV2wwSUdNdVpHbHpjRzl6WlNncExHRjNZV2wwSUdScGMzQnZjMlZJYjI5cktHNHBmWDFoYzNsdVl5Qm1kVzVqZEdsdmJpQm1hVzVoYkdsNlpVUnZibVVvWlNsN2JHVjBlMjkxZEhCMWREcDBMSE5sY21saGJHbDZaV1JEYjI1MFpYaDBPbTU5UFdVdVlXTjBhVzl1TEhJOVpTNWhZM1JwYjI0dWFYTkZjbkp2Y2owOVBTRXdPM0psZEhWeWJpQmhkMkZwZENCbWFYSmxVMlZ6YzJsdmJrTmhiR3hpWVdOclUzUmxjQ2g3WlhKeWIzSTZjajkwT25admFXUWdNQ3h2ZFhSd2RYUTZjajkyYjJsa0lEQTZkQ3h6WlhKcFlXeHBlbVZrUTI5dWRHVjRkRHB1TEhOMFlYUjFjenB5UDJCbVlXbHNaV1JnT21CamIyMXdiR1YwWldSZ0xIVnpZV2RsT25JL2RtOXBaQ0F3T21VdVlXTjBhVzl1TG5WellXZGxmU2tzWVhkaGFYUWdibTkwYVdaNVJHVnNaV2RoZEdWa1VHRnlaVzUwVTNSbGNDaDdjbVZ6ZFd4ME9uSS9ZM0psWVhSbFJHVnNaV2RoZEdWa1UzVmlZV2RsYm5SRmNuSnZjbEpsYzNWc2RDaHVMSFFwT21OeVpXRjBaVVJsYkdWbllYUmxaRk4xWW1GblpXNTBVM1ZqWTJWemMxSmxjM1ZzZENodUxIUXBMSE5sY21saGJHbDZaV1JEYjI1MFpYaDBPbTRzZFhOaFoyVTZjajkyYjJsa0lEQTZaUzVoWTNScGIyNHVkWE5oWjJWOUtTeDdiM1YwY0hWME9uUjlmV0Z6ZVc1aklHWjFibU4wYVc5dUlIZGhhWFJHYjNKT1pYaDBSR1ZzYVhabGNpaGxLWHRwWmlobExtSjFabVpsY21Wa1JHVnNhWFpsY21sbGN5NXNaVzVuZEdnK01DbHlaWFIxY200Z1kyOWhiR1Z6WTJWRVpXeHBkbVZ5YVdWektHVXVZblZtWm1WeVpXUkVaV3hwZG1WeWFXVnpMbk53YkdsalpTZ3dLU2s3Wm05eUtEczdLWHRzWlhRZ2REMWhkMkZwZENCbExtUmxiR2wyWlhKNVNHOXZheTV1WlhoMEtDazdhV1lvWlM1a1pXeHBkbVZ5ZVVodmIyc3VZMjl1YzNWdFpVNWxlSFFvS1N4MExtUnZibVVwY21WMGRYSnVJRzUxYkd3N2FXWW9kQzUyWVd4MVpTNXJhVzVrSVQwOVlHUmxiR2wyWlhKZ0tXTnZiblJwYm5WbE8yeGxkQ0J1UFhRdWRtRnNkV1U3Wm05eUtEczdLWHRzWlhRZ2REMWhkMkZwZENCMFlXdGxVbVZoWkhsUVlYbHNiMkZrS0dVdVpHVnNhWFpsY25sSWIyOXJMbTVsZUhRb0tTazdhV1lvZEQwOVBVNVBYMUpGUVVSWlgwMUZVMU5CUjBWOGZDaGxMbVJsYkdsMlpYSjVTRzl2YXk1amIyNXpkVzFsVG1WNGRDZ3BMSFF1Wkc5dVpTa3BZbkpsWVdzN2RDNTJZV3gxWlM1cmFXNWtQVDA5WUdSbGJHbDJaWEpnSmlZb2JqMWpiMkZzWlhOalpVUmxiR2wyWlhKcFpYTW9XMjRzZEM1MllXeDFaVjBwS1gxeVpYUjFjbTRnYm4xOVkyOXVjM1FnVGs5ZlVrVkJSRmxmVFVWVFUwRkhSVDFUZVcxaWIyd29ZRzV2TFhKbFlXUjVMVzFsYzNOaFoyVmdLVHRoYzNsdVl5Qm1kVzVqZEdsdmJpQjBZV3RsVW1WaFpIbFFZWGxzYjJGa0tHVXBlM0psZEhWeWJpQmhkMkZwZENCUWNtOXRhWE5sTG5KbGMyOXNkbVVvS1N4aGQyRnBkQ0JRY205dGFYTmxMbkpoWTJVb1cyVXNVSEp2YldselpTNXlaWE52YkhabEtFNVBYMUpGUVVSWlgwMUZVMU5CUjBVcFhTbDlaWGh3YjNKMGUzZHZjbXRtYkc5M1JXNTBjbmw5TzF4dWQyOXlhMlpzYjNkRmJuUnllUzUzYjNKclpteHZkMGxrSUQwZ1hDSjNiM0pyWm14dmR5OHZaWFpsTHk5M2IzSnJabXh2ZDBWdWRISjVYQ0k3WEc1bmJHOWlZV3hVYUdsekxsOWZjSEpwZG1GMFpWOTNiM0pyWm14dmQzTXVjMlYwS0Z3aWQyOXlhMlpzYjNjdkwyVjJaUzh2ZDI5eWEyWnNiM2RGYm5SeWVWd2lMQ0IzYjNKclpteHZkMFZ1ZEhKNUtUdGNiaUpkTENKdFlYQndhVzVuY3lJNklqczdRVUZCUVN4VFFVRlRMRk5CUVZNc1IwRkJSVHREUVVGRExFOUJRVThzVDBGQlR5eExRVUZITEZsQlFWVXNRMEZCUXl4RFFVRkRMRXRCUVVjc1EwRkJReXhOUVVGTkxGRkJRVkVzUTBGQlF6dEJRVUZETzBGQlFVTXNVMEZCVXl4cFFrRkJhVUlzUjBGQlJUdERRVUZETEU5QlFVOHNUMEZCVHl4TFFVRkhMRmxCUVZVc1JVRkJSU3hUUVVGUE8wRkJRVU03T3p0QlEwRnFSeXhUUVVGVExHVkJRV1VzUjBGQlJUdERRVUZETEU5QlFVOHNZVUZCWVN4UlFVRk5MRVZCUVVVc1ZVRkJVU3hQUVVGUExFdEJRVWNzVjBGQlV5eEpRVUZGTEV0QlFVY3NUMEZCU3l4UFFVRlBMRU5CUVVNc1NVRkJSU3hUUVVGVExFTkJRVU1zU1VGQlJTeFBRVUZQTEVWQlFVVXNWMEZCVXl4WlFVRlZMRVZCUVVVc1VVRkJVU3hUUVVGUExFbEJRVVVzUlVGQlJTeFZRVUZSTEd0Q1FVRnJRaXhEUVVGRExFbEJRVVVzVDBGQlR5eERRVUZETzBGQlFVTTdRVUZCYTFNc1UwRkJVeXhyUWtGQmEwSXNSMEZCUlR0RFFVRkRMRWxCUVVjN1JVRkJReXhQUVVGUExFdEJRVXNzVlVGQlZTeERRVUZETEV0QlFVY3NUMEZCVHl4RFFVRkRPME5CUVVNc1VVRkJUVHRGUVVGRExFOUJRVThzVDBGQlR5eERRVUZETzBOQlFVTTdRVUZCUXp0QlEwRXhS",
	"Q3hKUVVGSkxGbEJRVlU3T3p0QlEwRTFVQ3hUUVVGVExEQkNRVUV3UWl4SFFVRkZPME5CUVVNc1VVRkJUeXhGUVVGRkxFMUJRVlE3UlVGQlpTeExRVUZKTEhGQ1FVRnZRaXhQUVVGTkxEWkNRVUUyUWl4RlFVRkZPMFZCUVZNc1MwRkJTU3h0UWtGQmEwSXNUMEZCVFN4cFFrRkJhVUlzUlVGQlJTeGhRVUZoTEVkQlFVY3NSVUZCUlR0RlFVRlRMRXRCUVVrc1pVRkJZeXhQUVVGTkxHRkJRV0VzUlVGQlJTeFRRVUZUTEVkQlFVY3NSVUZCUlR0RFFVRlJPMEZCUVVNN096dEJRMEYzTTBNc1UwRkJVeXh0UTBGQmJVTXNSMEZCUlR0RFFVRkRMRWxCUVVrc1NVRkJSU3hKUVVGSkxFbEJRVWtzUlVGQlJTeFhRVUZYTEVkQlFVVXNTVUZCUlN4SlFVRkpMRWxCUVVVN1EwRkJSU3hMUVVGSkxFbEJRVWtzUzBGQlN5eEZRVUZGTEZOQlFWRTdSVUZCUXl4SlFVRkpMRWxCUVVVc01FSkJRVEJDTEVOQlFVTTdSVUZCUlN4RlFVRkZMRWxCUVVrc1EwRkJReXhMUVVGSExFVkJRVVVzU1VGQlNTeEhRVUZGTEVOQlFVTTdRMEZCUXp0RFFVRkRMRWxCUVVrc1NVRkJSU3hEUVVGRE8wTkJRVVVzUzBGQlNTeEpRVUZKTEV0QlFVc3NSVUZCUlN4aFFVRlpPMFZCUVVNc1NVRkJTU3hKUVVGRkxFVkJRVVVzU1VGQlNTeERRVUZETzBWQlFVVXNTVUZCUnl4TlFVRkpMRXRCUVVzc1IwRkJSVHRGUVVGUExFVkJRVVVzUzBGQlN5eERRVUZETzBOQlFVTTdRMEZCUXl4UFFVRlBPMEZCUVVNN096dEJRME53YzBVc1NVRkJWeXcyUWtGQk5rSXNWMEZCVnl4UFFVRlBMRWxCUVVrc2JVSkJRVzFDTEVWQlFVVXNRMEZCUXl3NFEwRkJPRU03T3p0QlEwUnNTU3hUUVVGVExIbERRVUYzUXp0RFFVRkRMRTlCUVU4c1VVRkJVU3hKUVVGSkxHVkJRV0VzWjBKQlFXTXNVVUZCVVN4SlFVRkpMR2REUVVFNFFpeFhRVUZYTEZGQlFWRXNTVUZCU1N4clEwRkJaME03UVVGQlNUdEJRVUZETEZOQlFWTXNLMEpCUVN0Q0xFZEJRVVU3UTBGQlF5eEpRVUZKTEVsQlFVVXNVVUZCVVN4SlFVRkpMSGxDUVVGNVFpeExRVUZMTEV0QlFVY3NTMEZCU3p0RFFVRkZMRkZCUVU4c2RVTkJRWFZETEV0QlFVY3NTMEZCUnl4RlFVRkJMRU5CUVVjc1VVRkJVU3hQUVVGTkxFVkJRVVU3UVVGQlF6czdPMEZEUTI1WUxFbEJRVmNzVjBGQlZ5eFhRVUZYTEU5QlFVOHNTVUZCU1N4dFFrRkJiVUlzUlVGQlJTeERRVUZETERSQ1FVRTBRanRCUVVNNVJpeEpRVUZYTERCQ1FVRXdRaXhYUVVGWExFOUJRVThzU1VGQlNTeHRRa0ZCYlVJc1JVRkJSU3hEUVVGRExESkRRVUV5UXp0QlFVTTFTQ3hKUVVGWExHMUNRVUZ0UWl4WFFVRlhMRTlCUVU4c1NVRkJTU3h0UWtGQmJVSXNSVUZCUlN4RFFVRkRMRzlEUVVGdlF6czdPMEZEU0RsSExFMUJRVTBzTUVKQlFYZENMRTlCUVU4c1NVRkJTU3hyUWtGQmEwSTdUVUZCUlN4MVFrRkJjVUlzVDBGQlR5eEpRVUZKTEhOQ1FVRnpRanROUVVGRkxIbENRVUYxUWl4UFFVRlBMRWxCUVVrc2QwSkJRWGRDTzAxQlFXOUVMSEZDUVVGdFFpeFBRVUZQTEVsQlFVa3NjMEpCUVhOQ08wMUJRVVVzYVVKQlFXVTdRVUZCY1VZc1UwRkJVeXhYUVVGWExFZEJRVVU3UTBGQlF5eEpRVUZKTEVsQlFVVXNaVUZCWlR0RFFVRnpRaXhKUVVGSExFMUJRVWtzUzBGQlN5eEhRVUZGTEUxQlFVMHNUVUZCVFN3NFJFRkJPRVE3UTBGQlJTeFBRVUZQTEVWQlFVVXNRMEZCUXp0QlFVRkRPMEZCUVVNc1UwRkJVeXh6UWtGQmNVSTdRMEZCUXl4SlFVRkpMRWxCUVVVc1pVRkJaVHREUVVGNVFpeEpRVUZITEUxQlFVa3NTMEZCU3l4SFFVRkZMRTFCUVUwc1RVRkJUU3dyUlVGQkswVTdRMEZCUlN4UFFVRlBPMEZCUVVNN1FVRkJReXhUUVVGVExGbEJRVmtzU1VGQlJTeERRVUZETEVkQlFVVTdRMEZCUXl4SlFVRkpMRWxCUVVVc1pVRkJaVHREUVVGM1FpeEpRVUZITEUxQlFVa3NTMEZCU3l4SFFVRkZMRTFCUVUwc1RVRkJUU3dyUkVGQkswUTdRMEZCUlN4SlFVRkpMRWxCUVVVc1JVRkJSU3hGUVVGRkxGTkJRVk03UTBGQlJTeFBRVUZQTEU5QlFVOHNUMEZCVHl4WFFVRlhMR1ZCUVdVc1YwRkJWU3hIUVVGRkxIRkNRVUZ2UWp0RlFVRkRMRTlCUVUwN1JVRkJSU3hWUVVGVExFTkJRVU03UTBGQlF5eEZRVUZETEVOQlFVTTdRVUZCUXpzN08wRkRRWEJuUXl4bFFVRmxMRzFDUVVGdFFpeEhRVUZGTzBOQlFVTXNTVUZCU1R0RFFVRkZMRWxCUVVjN1JVRkJReXhKUVVGRkxFMUJRVTBzUlVGQlJTeFpRVUZaTzBOQlFVTXNVMEZCVHl4SFFVRkZPMFZCUVVNc1QwRkJUeXhOUVVGTkxHZENRVUZuUWl4SFFVRkZMSGRDUVVGM1FpeEhRVUZGTEVWQlFVVXNTMEZCU3l4RFFVRkRPME5CUVVNN1EwRkJReXhKUVVGSExFMUJRVWtzVFVGQlN5eFBRVUZQTEUxQlFVMHNaMEpCUVdkQ0xFZEJRVVVzZDBKQlFYZENMRVZCUVVVc1QwRkJUU3hGUVVGRkxFdEJRVXNzUTBGQlF6dEJRVUZETzBGQlFVTXNaVUZCWlN4clFrRkJhMElzUjBGQlJUdERRVUZETEU5QlFVOHNSVUZCUlN4VlFVRlJMR05CUVZrc1RVRkJUU3hGUVVGRkxFOUJRVThzUzBGQlN5eERRVUZETzBGQlFVTTdRVUZCUXl4bFFVRmxMRmxCUVZrc1IwRkJSVHREUVVGRExFbEJRVWtzU1VGQlJTeEZRVUZGTzBOQlFWRXNTVUZCUnl4UFFVRlBMRXRCUVVjc1dVRkJWenRGUVVGRExFMUJRVTBzUlVGQlJTeExRVUZMTEVOQlFVTTdSVUZCUlR0RFFVRk5PME5CUVVNc1NVRkJTU3hKUVVGRkxFVkJRVVVzVDBGQlR6dERRVUZUTEU5QlFVOHNTMEZCUnl4alFVRlpMRTFCUVUwc1JVRkJSU3hMUVVGTExFTkJRVU03UVVGQlF6dEJRVUZETEdWQlFXVXNaMEpCUVdkQ0xFZEJRVVVzUjBGQlJUdERRVUZETEVsQlFVYzdSVUZCUXl4TlFVRk5MRmxCUVZrc1EwRkJRenREUVVGRExGRkJRVTBzUTBGQlF6dERRVUZETEUxQlFVMDdRVUZCUXp0QlFVRkRMRk5CUVZNc2QwSkJRWGRDTEVkQlFVVXNSMEZCUlR0RFFVRkRMRTlCUVU4c2IwSkJRVzlDTEVOQlFVTXNTVUZCUlN4M1FrRkJkMElzVDBGQlR5eEZRVUZGTEZOQlFVOHNWMEZCVXl4RlFVRkZMRkZCUVUwc1IwRkJSU3hQUVVGUExFVkJRVVVzYjBKQlFXdENMRmRCUVZNc1JVRkJSU3h0UWtGQmFVSXNTMEZCU3l4RFFVRkRMRWxCUVVVN1FVRkJRenRCUVVGRExGTkJRVk1zYjBKQlFXOUNMRWRCUVVVN1EwRkJReXhQUVVGUExFOUJRVThzUzBGQlJ5eFpRVUZWTEVOQlFVTXNRMEZCUXl4TFFVRkhMRlZCUVZNc1MwRkJSeXhGUVVGRkxGTkJRVTg3UVVGQmJVSTdRVUZCUXl4VFFVRlRMSGRDUVVGM1FpeEhRVUZGTEVkQlFVVTdRMEZCUXl4SlFVRkpMRWxCUVVVc1RVRkJTU3hMUVVGTExFbEJRVVVzUzBGQlJ5eFZRVUZWTEVWQlFVVTdRMEZCU1N4UFFVRlBMRTlCUVU4c1QwRkJUeXhOUVVGTkxHVkJRV1VzUlVGQlJTeHhRa0ZCY1VJc1IwRkJSeXhIUVVGRk8wVkJRVU1zYTBKQlFXbENPMFZCUVVVc1RVRkJTenRGUVVGdlFpeFBRVUZOTzBOQlFVTXNRMEZCUXp0QlFVRkRPenM3UVVOQmRtaERMRk5CUVZNc01rSkJRVEpDTEVkQlFVVTdRMEZCUXl4UFFVRlBMR0ZCUVdFc1VVRkJUVHRGUVVGRExFZEJRVWNzVDBGQlR5eFpRVUZaTEU5QlFVOHNVVUZCVVN4RFFVRkRMRU5CUVVNN1JVRkJSU3hQUVVGTkxFVkJRVVVzVlVGQlVTeExRVUZMTEVsQlFVVXNTMEZCU3l4SlFVRkZMREpDUVVFeVFpeEZRVUZGTEV0QlFVczdSVUZCUlN4VFFVRlJMRVZCUVVVN1JVRkJVU3hOUVVGTExFVkJRVVU3UlVGQlN5eFBRVUZOTEVWQlFVVTdRMEZCU3l4SlFVRkZPMEZCUVVNN1FVRkJReXhUUVVGVExIbENRVUY1UWl4SFFVRkZPME5CUVVNc1NVRkJSeXhEUVVGRExGTkJRVk1zUTBGQlF5eEhRVUZGTEU5QlFVOHNUVUZCVFN4UFFVRlBMRU5CUVVNc1EwRkJRenREUVVGRkxFbEJRVWtzU1VGQlJTeFBRVUZQTEVWQlFVVXNWMEZCVXl4WFFVRlRMRVZCUVVVc1ZVRkJVU3hQUVVGUExFTkJRVU1zUjBGQlJTeEpRVUZGTEUxQlFVMHNRMEZCUXp0RFFVRkZMRTlCUVU4c1JVRkJSU3hSUVVGTkxHRkJRVmNzUlVGQlJTeFBRVUZMTEVWQlFVVXNUMEZCVFN4UFFVRlBMRVZCUVVVc1UwRkJUeXhoUVVGWExFVkJRVVVzVVVGQlRTeEZRVUZGTEZGQlFVOHNWMEZCVlN4TlFVRkpMRVZCUVVVc1VVRkJUU3hUUVVGVExFVkJRVVVzUzBGQlN5eEpRVUZGTEhsQ1FVRjVRaXhGUVVGRkxFdEJRVXNzU1VGQlJTeEZRVUZGTzBOQlFVOHNTVUZCU1N4SlFVRkZPME5CUVVVc1MwRkJTU3hKUVVGSExFTkJRVU1zUjBGQlJTeE5RVUZMTEU5QlFVOHNVVUZCVVN4RFFVRkRMRWRCUVVVc1RVRkJTU3hoUVVGWExFMUJRVWtzVlVGQlVTeE5RVUZKTEZkQlFWTXNUVUZCU1N4WlFVRlZMRVZCUVVVc1MwRkJSenREUVVGSExFOUJRVTg3UVVGQlF6dEJRVUZETEZOQlFWTXNVMEZCVXl4SFFVRkZPME5CUVVNc1QwRkJUeXhQUVVGUExFdEJRVWNzV1VGQlZTeERRVUZETEVOQlFVTTdRVUZCUXpzN08wRkRRM0J5UWl4SlFVRlhMSE5DUVVGelFpeFhRVUZYTEU5QlFVOHNTVUZCU1N4dFFrRkJiVUlzUlVGQlJTeERRVUZETEhWRFFVRjFRenM3TzBGRFFYQklMRWxCUVZjc05FSkJRVFJDTEZkQlFWY3NUMEZCVHl4SlFVRkpMRzFDUVVGdFFpeEZRVUZGTEVOQlFVTXNOa05CUVRaRE96czdRVU5CYUVrc1NVRkJWeXh4UTBGQmNVTXNWMEZCVnl4UFFVRlBMRWxCUVVrc2JVSkJRVzFDTEVWQlFVVXNRMEZCUXl4elJFRkJjMFE3T3p0QlEwUnNTaXhUUVVGVExHdENRVUZyUWl4SFFVRkZPME5CUVVNc1NVRkJSeXhQUVVGUExFVkJRVVVzVTBGQlR5eFpRVUZWTEVWQlFVVXNWVUZCVVN4TlFVRkxMRTFCUVUwc1RVRkJUU3hIUVVGSExFVkJRVVVzVFVGQlRTeDNRMEZCZDBNN1EwRkJSU3hKUVVGSkxFbEJRVVVzUlVGQlJTeE5RVUZOTEZOQlFWRTdRMEZCUlN4SlFVRkhMRTlCUVU4c1MwRkJSeXhWUVVGVExFbEJRVVVzUlVGQlJUdE5RVUZYTEVsQlFVY3NSVUZCUlN4aFFVRlpMRVZCUVVVc1ZVRkJVU3hGUVVGRkxHMUNRVUZwUWl4TFFVRkxMRWRCUVVVc1NVRkJSVHRGUVVGRExFZEJRVWNzUlVGQlJUdEZRVUZOTEZOQlFWRXNSVUZCUlR0RFFVRmpPMDFCUVU4c1RVRkJUU3hOUVVGTkxFZEJRVWNzUlVGQlJTeE5RVUZOTEhkRFFVRjNRenREUVVGRkxFbEJRVWtzU1VGQlJTeEZRVUZGTEd0Q1FVRm5RanREUVVGRkxFbEJRVWNzUTBGQlF5eFBRVUZQTEZWQlFWVXNSVUZCUlN4UFFVRlBMRXRCUVVjc1JVRkJSU3hWUVVGUkxFZEJRVVVzVFVGQlRTeE5RVUZOTEVkQlFVY3NSVUZCUlN4TlFVRk5MRmxCUVZrc1JVRkJSU3hSUVVGUkxEUkNRVUUwUWp0RFFVRkZMRWxCUVVjc1JVRkJSU3hWUVVGUkxFVkJRVVVzWlVGQll5eE5RVUZOTEUxQlFVMHNSMEZCUnl4RlFVRkZMRTFCUVUwc2QwSkJRWGRDTEVWQlFVVXNVVUZCVVN3NFEwRkJPRU1zUlVGQlJTeGpRVUZqTEdsSFFVRnBSenREUVVGRkxFOUJRVXNzUlVGQlJTeFZRVUZSTEVWQlFVVXNaMEpCUVdVN1JVRkJReXhKUVVGSkxFbEJRVVVzUlVGQlJTeFhRVUZYTEUxQlFVc3NUVUZCUnl4RlFVRkZMRk5CUVU4c1JVRkJSU3hQUVVGUE8wVkJRVVVzU1VGQlJ5eERRVUZETEVkQlFVVXNUVUZCVFN4TlFVRk5MRWRCUVVjc1JVRkJSU3hOUVVGTkxIZERRVUYzUXl4RlFVRkZMRkZCUVZFc1MwRkJTeXhGUVVGRkxGVkJRVkVzUlVGQlJTeEZRVUZGTzBWQlFVVXNTVUZCUnl4RlFVRkZMRTlCUVVzc1JVRkJSU3hQUVVGTExFZEJRVVVzVFVGQlRTeE5RVUZOTEVkQlFVY3NSVUZCUlN4TlFVRk5MR05CUVdNc1JVRkJSU3hMUVVGTExFdEJRVXNzUlVGQlJTeEhRVUZITERCRFFVRXdRenRGUVVGRkxFbEJRVWtzU1VGQlJTeEZRVUZGTEZGQlFWRXNRMEZCUXp0RlFVRkZMRWxCUVVjc1JVRkJSU3haUVVGVkxFVkJRVVVzU1VGQlJ5eE5RVUZOTEUxQlFVMHNSMEZCUnl4RlFVRkZMRTFCUVUwc1kwRkJZeXhGUVVGRkxFdEJRVXNzUzBGQlN5eEZRVUZGTEVkQlFVY3NhVU5CUVdsRExFVkJRVVVzVVVGQlVTeEZRVUZGTzBWQlFVVXNTVUZCUlR0RFFVRkRPME5CUVVNc1QwRkJUenRCUVVGRE96czdRVU5CY25KRExFMUJRVTBzTUVKQlFYZENPME5CUVVNc1RVRkJTenREUVVGRkxGRkJRVkVzUjBGQlJUdEZRVUZETEVsQlFVY3NRMEZCUXl3NFFrRkJPRUlzUTBGQlF5eEhRVUZGTEUxQlFVMHNUVUZCVFN3MlJVRkJOa1U3UlVGQlJTeFBRVUZOTzBkQlFVTXNZMEZCWVN4RlFVRkZPMGRCUVdFc2FVSkJRV2RDTEVWQlFVVTdSMEZCWjBJc1RVRkJTeXhGUVVGRk8wZEJRVXNzVjBGQlZUdEpRVUZETEU5QlFVMHNSVUZCUlR0SlFVRlRMR2RDUVVGbExFVkJRVVU3U1VGQlpTeHRRa0ZCYTBJc1JVRkJSVHRKUVVGclFpeGpRVUZoTEVWQlFVVTdSMEZCV1R0SFFVRkZMRk5CUVZFN1JVRkJRenREUVVGRE8wTkJRVVVzU1VGQlJ6dEJRVUZETzBGQlFVVXNVMEZCVXl3NFFrRkJPRUlzUjBGQlJUdERRVUZETEU5QlFVOHNUMEZCVHl4TFFVRkhMRmxCUVZVc1EwRkJReXhEUVVGRExFdEJRVWNzWTBGQllUdEJRVUZET3pzN1RVTkJOVllzT0VKQlFUUkNMRU5CUVVNc2RVSkJRWFZDTzBGQlFUQlVMRk5CUVZNc2VVSkJRWGxDTEVkQlFVVTdRMEZCUXl4UFFVRlBMR3RDUVVGclFqdEZRVUZETEdkQ1FVRmxPMFZCUVVVc1QwRkJUVHRGUVVGelFpeFpRVUZYTzBWQlFUUkNMR1ZCUVdNN1JVRkJSU3hQUVVGTk8wTkJRVU1zUTBGQlF6dEJRVUZET3pzN1FVTkJlbkZDTEZOQlFWTXNkMEpCUVhkQ0xFZEJRVVU3UTBGQlF5eEpRVUZITEVWQlFVVXNWMEZCVXl4SFFVRkZMRTlCUVUwc1EwRkJRenREUVVGRkxFbEJRVWNzUlVGQlJTeFhRVUZUTEVkQlFVVXNUMEZCVHl4RlFVRkZMRTFCUVVrc1EwRkJRenREUVVGRkxFbEJRVWtzU1VGQlJTeERRVUZETEVkQlFVVXNTVUZCUlN4RFFVRkRPME5CUVVVc1MwRkJTU3hKUVVGSkxFdEJRVXNzUjBGQlJUdEZRVUZETEV0QlFVa3NTVUZCUnl4RFFVRkRMRWRCUVVVc1RVRkJTeXhQUVVGUExGRkJRVkVzUTBGQlF5eEhRVUZGTEUxQlFVa3NiMEpCUVd0Q0xFMUJRVWtzUzBGQlN5eE5RVUZKTEVWQlFVVXNTMEZCUnp0RlFVRkhMRVZCUVVVc2JVSkJRV2xDTEV0QlFVc3NTMEZCUnl4RlFVRkZMRXRCUVVzc1IwRkJSeXhGUVVGRkxHTkJRV003UTBGQlF6dERRVUZETEU5QlFVOHNSVUZCUlN4VFFVRlBMRTFCUVVrc1JVRkJSU3hwUWtGQlpTeEpRVUZITzBGQlFVTTdPenRCUTBGcVN5eGxRVUZsTEhWQ1FVRjFRaXhIUVVGRk8wTkJRVU1zU1VGQlNTeEpRVUZGTEhkQ1FVRjNRaXhGUVVGRkxGRkJRVkU3UTBGQlJTeFBRVUZQTEVWQlFVVXNZVUZCWVN4NVFrRkJkVUlzVFVGQlRTeDNRa0ZCZDBJN1JVRkJReXhOUVVGTExFVkJRVVU3UlVGQlN5eG5Ra0ZCWlN4RlFVRkZPMFZCUVdVc1UwRkJVVHRGUVVGRkxHTkJRV0VzUlVGQlJUdERRVUZaTEVOQlFVTXNSVUZCUVN4RFFVRkhMRmxCUVZVN1FVRkJRenM3TzBGRFEzSlpMRWxCUVZjc05FSkJRVFJDTEZkQlFWY3NUMEZCVHl4SlFVRkpMRzFDUVVGdFFpeEZRVUZGTEVOQlFVTXNOa05CUVRaRE96czdRVU5FYUVrc1UwRkJVeXgxUWtGQmRVSXNSMEZCUlR0RFFVRkRMRTlCUVUwc1IwRkJSeXhGUVVGRk8wRkJRVkU3T3p0QlEwRjBSQ3hOUVVGTkxEUkNRVUV3UWp0QlFVRnhRaXhKUVVGSkxIRkNRVUZ0UWl4alFVRmpMRTFCUVVzN1EwRkJReXhaUVVGWkxFbEJRVVVzTWtKQlFUQkNPMFZCUVVNc1RVRkJUU3hEUVVGRExFZEJRVVVzUzBGQlN5eFBRVUZMTzBOQlFYbENPMEZCUVVNN096dEJRMEY1Unl4bFFVRmxMRGhDUVVFNFFpeEhRVUZGTzBOQlFVTXNTVUZCU1N4SlFVRkZMRmRCUVZjc1JVRkJReXhQUVVGTkxIVkNRVUYxUWl4RlFVRkZMRk5CUVZNc1JVRkJReXhEUVVGRExFZEJRVVVzU1VGQlJTeEZRVUZGTEU5QlFVOHNZMEZCWXl4RFFVRkRPME5CUVVVc1NVRkJSenRGUVVGRExFMUJRVTBzYlVKQlFXMUNMRU5CUVVNN1EwRkJReXhUUVVGUExFZEJRVVU3UlVGQlF5eEpRVUZITEc5Q1FVRnZRaXhEUVVGRExFZEJRVVU3UlVGQlR5eE5RVUZOTzBOQlFVTTdRMEZCUXl4SlFVRkpMRWxCUVVVc1NVRkJTU3huUWtGQll5eEhRVUZGTEVsQlFVVXNjMEpCUVhOQ0xFZEJRVVVzUlVGQlJTeGpRVUZqTEVOQlFVTXNRMEZCUXl4WlFVRlZMRVZCUVVVc1RVRkJUU3hKUVVGSkxHMUNRVUZwUWl4RFFVRkRMRWRCUVVVc1UwRkJVeXhIUVVGRkxFbEJRVVVzUTBGQlF6dERRVUZGTEU5QlFVMDdSVUZCUXl4UlFVRlBMRVZCUVVVN1JVRkJUeXhYUVVGVk8wVkJRVVVzVFVGQlRTeFZRVUZUTzBkQlFVTXNUVUZCU1N4SlFVRkZMRU5CUVVNc1IwRkJSU3hOUVVGTkxGbEJRVmtzUTBGQlF6dEZRVUZGTzBOQlFVTTdRVUZCUXp0QlFVRkRMR1ZCUVdVc2MwSkJRWE5DTEVkQlFVVXNSMEZCUlR0RFFVRkRMRk5CUVU4N1JVRkJReXhKUVVGSkxFbEJRVVVzVFVGQlRTeEZRVUZGTEV0QlFVczdSVUZCUlN4SlFVRkhMRVZCUVVVc1RVRkJTeXhQUVVGUExFMUJRVTBzU1VGQlNTeGpRVUZaTEVOQlFVTXNRMEZCUXp0RlFVRkZMRWxCUVVjc2EwSkJRV3RDTEVWQlFVVXNUMEZCVFN4RFFVRkRMRWRCUVVVN1EwRkJUVHRCUVVGRE8wRkJRVU1zVTBGQlV5eHJRa0ZCYTBJc1IwRkJSU3hIUVVGRk8wTkJRVU1zU1VGQlJ5eFBRVUZQTEV0QlFVY3NXVUZCVlN4RFFVRkRMRWRCUVVVc1QwRkJUU3hEUVVGRE8wTkJRVVVzU1VGQlNTeEpRVUZGTEVWQlFVVTdRMEZCVHl4UFFVRlBMRTFCUVVrc1MwRkJTeXhMUVVGSExFMUJRVWs3UVVGQlF6czdPMEZEUVRrMFFpeEpRVUZKTEhOQ1FVRnZRaXhOUVVGTE8wTkJRVU03UTBGQllUdERRVUZsTzBOQlFYbENPME5CUVc5Q08wTkJRVGhDTEZsQlFWa3NSMEZCUlR0RlFVRkRMRXRCUVVzc1pVRkJZU3hGUVVGRkxHTkJRV0VzUzBGQlN5d3lRa0ZCZVVJc1JVRkJSU3h0UWtGQmEwSXNTMEZCU3l4elFrRkJiMElzUlVGQlJTeGpRVUZoTEV0QlFVc3NaME5CUVRoQ0xFVkJRVVVzWVVGQllTeHRRa0ZCYTBJc1MwRkJTeXhwUWtGQlpTeEZRVUZGTzBOQlFXTTdRMEZCUXl4SlFVRkpMRzlDUVVGdFFqdEZRVUZETEU5QlFVOHNTMEZCU3p0RFFVRjNRanREUVVGRExFbEJRVWtzWlVGQll6dEZRVUZETEU5QlFVOHNTMEZCU3p0RFFVRnRRanREUVVGRExFMUJRVTBzVFVGQlRTeEhRVUZGTzBWQlFVTXNTMEZCU3l4VFFVRlRMRU5CUVVNN1JVRkJSU3hKUVVGSkxFbEJRVVVzUlVGQlJTeGhRVUZoTzBWQlFXdENMRTFCUVVrc1RVRkJTU3hOUVVGSkxFdEJRVXNzYTBOQlFXZERMRXRCUVVzc1owTkJRVGhDTEVkQlFVVXNUVUZCVFN4TFFVRkxMRXRCUVVzN1IwRkJReXh0UWtGQmEwSTdSMEZCUlN4TlFVRkxPMFZCUVhsQ0xFTkJRVU03UTBGQlJUdERRVUZETEdkQ1FVRm5RaXhIUVVGRkxFZEJRVVU3UlVGQlF5eFBRVUZOTzBkQlFVTXNZVUZCV1R0SFFVRkZMRTlCUVUwN1IwRkJSU3huUWtGQlpTeExRVUZMTzBkQlFXVXNiVUpCUVd0Q0xFdEJRVXM3UjBGQmVVSXNZMEZCWVN4TFFVRkxPMFZCUVcxQ08wTkJRVU03UTBGQlF5eE5RVUZOTEU5QlFVOHNSMEZCUlN4SFFVRkZMRWRCUVVVN1JVRkJReXhMUVVGTExGTkJRVk1zUTBGQlF5eEhRVUZGTEUxQlFVMHNTMEZCU3l4TFFVRkxPMGRCUVVNc1VVRkJUenRKUVVGRExFZEJRVWM3U1VGQlJTeHRRa0ZCYTBJc1MwRkJTenRKUVVGNVFpeGpRVUZoTEV0QlFVczdSMEZCYlVJN1IwRkJSU3h2UWtGQmJVSXNSVUZCUlN4WFFVRlRMRWxCUVVVc1MwRkJTeXhKUVVGRkxFTkJRVU1zUjBGQlJ5eERRVUZETzBkQlFVVXNUVUZCU3p0RlFVRmhMRU5CUVVNN1EwRkJRenREUVVGRExFMUJRVTBzUzBGQlN5eEhRVUZGTzBWQlFVTXNUVUZCVFN4dlFrRkJiMEk3UjBGQlF5eGpRVUZoTEV0QlFVczdSMEZCWVN4VFFVRlJPMFZCUVVNc1EwRkJRenREUVVGRE8wTkJRVU1zVTBGQlV5eEhRVUZGTzBWQlFVTXNTMEZCU3l3eVFrRkJlVUlzUlVGQlJTeHhRa0ZCYlVJc1MwRkJTeXd3UWtGQmVVSXNTMEZCU3l4elFrRkJiMElzUlVGQlJUdERRVUZaTzBGQlFVTTdPenRCUTBGdU0wTXNVMEZCVXl4aFFVRmhMRWRCUVVVN1EwRkJReXhQUVVGUExFVkJRVVVzVjBGQlV5eExRVUZITEZGQlFWRXNSVUZCUlN4aFFVRlhMRVZCUVVVN1FVRkJUVHM3TzBGRFEzRnZReXhOUVVGTkxDdENRVUUyUWp0QlFVRTBSQ3hUUVVGVExEWkNRVUUyUWl4SFFVRkZPME5CUVVNc1QwRkJUeXhGUVVGRkxGTkJRVThzYTBKQlFXZENMRVZCUVVVc1ZVRkJWU3hoUVVGaExITkNRVUZ2UWp0QlFVRkZPMEZCUVVNc1pVRkJaU3hoUVVGaExFZEJRVVU3UTBGQlF5eEpRVUZKTEVsQlFVVXNlVUpCUVhsQ0xFTkJRVU03UTBGQlJTeFBRVUZQTEVWQlFVVXNiMEpCUVc5Q0xHTkJRVmtzUTBGQlF5eEpRVUZGTEhGQ1FVRnhRaXhEUVVGRExFbEJRVVVzYzBKQlFYTkNMRU5CUVVNN1FVRkJRenRCUVVGRExHVkJRV1VzY1VKQlFYRkNMRWRCUVVVN1EwRkJReXhKUVVGSkxFbEJRVVVzVjBGQlZ5eEZRVUZETEU5QlFVMHNSMEZCUnl4RlFVRkZMR2RDUVVGblFpeFJRVUZQTEVOQlFVTXNSMEZCUlN4SlFVRkZMRVZCUVVVc1QwRkJUeXhqUVVGakxFTkJRVU1zUjBGQlJTeEpRVUZGTEVsQlFVa3NiMEpCUVc5Q08wVkJRVU1zWTBGQllTeEZRVUZGTzBWQlFXZENMR2RDUVVGbExFVkJRVVVzVlVGQlZUdEZRVUZsTEcxQ1FVRnJRaXhGUVVGRkxGVkJRVlU3UlVGQmEwSXNZMEZCWVN4RlFVRkZMRlZCUVZVN1EwRkJXU3hEUVVGRExFZEJRVVVzU1VGQlJTeEhRVUZGTERoQ1FVRXdRaXhIUVVGSExFVkJRVVVzVFVGQlRTeFpRVUZaTEU5QlFVOHNSMEZCUnl4TFFVRkpMRWxCUVVVc1EwRkJReXhIUVVGRkxFbEJRVVVzUlVGQlJTeFZRVUZWTEU5QlFVMHNTVUZCUlN4RFFVRkRMRWRCUVVVN1EwRkJSU3hKUVVGSE8wVkJRVU1zU1VGQlJ6dEhRVUZETEUxQlFVMHNiVUpCUVcxQ0xFTkJRVU1zUjBGQlJTeEpRVUZGTEVOQlFVTTdSVUZCUXl4VFFVRlBMRWRCUVVVN1IwRkJReXhKUVVGSExHOUNRVUZ2UWl4RFFVRkRMRWRCUVVVN1IwRkJUeXhOUVVGTk8wVkJRVU03UlVGQlF5eExRVUZKTEVWQlFVVXNiMEpCUVc5Q0xIZENRVUZ6UWl4RFFVRkRMRXRCUVVjc05rSkJRVFpDTEVOQlFVTXNUVUZCU1N4SlFVRkZMRTFCUVUwc09FSkJRVGhDTzBkQlFVTXNaMEpCUVdVc1lVRkJZU3hGUVVGRkxGVkJRVlVzWVVGQllTeGhRVUZoTzBkQlFVVXNWMEZCVlN4RlFVRkZMRlZCUVZVc1lVRkJZVHRGUVVGVExFTkJRVU1zVFVGQlN6dEhRVUZETEVsQlFVa3NTVUZCUlN4TlFVRk5MRk5CUVZNc1JVRkJSU3huUWtGQlowSXNSMEZCUlN4SFFVRkhMRTFCUVUwc1EwRkJRenRIUVVGRkxFbEJRVWNzUlVGQlJTeFhRVUZUTEdGQlFWazdTVUZCUXl4TlFVRk5MREJDUVVFd1FqdExRVUZETEcxQ1FVRnJRaXhGUVVGRk8wdEJRV3RDTEdOQlFXRXNSVUZCUlR0SlFVRlpMRU5CUVVNc1IwRkJSU3hOUVVGTkxFZEJRVWNzVVVGQlVTeEhRVUZGTEUxQlFVMHNSVUZCUlN4UFFVRlBMRVZCUVVNc1kwRkJZU3hGUVVGRkxHRkJRVmtzUjBGQlJUdExRVUZETEZkQlFWVXNRMEZCUXp0TFFVRkZMRTFCUVVzN1NVRkJUU3hIUVVGRkxFTkJRVU03U1VGQlJUdEhRVUZOTzBkQlFVTXNTVUZCUnl4RlFVRkZMRmRCUVZNc1VVRkJUenRKUVVGRExFMUJRVTBzUjBGQlJ5eFJRVUZSTEVkQlFVVXNUVUZCVFN4RlFVRkZMRTlCUVU4c1IwRkJSVHRMUVVGRExFMUJRVXM3UzBGQlR5eFJRVUZQTEVWQlFVVXNWVUZCVVR0TFFVRkhMRk5CUVZFc1JVRkJSVHRMUVVGUkxFOUJRVTBzUlVGQlJUdEpRVUZMTEVkQlFVVXNRMEZCUXp0SlFVRkZPMGRCUVUwN1IwRkJReXhKUVVGSkxFbEJRVVVzUlVGQlJTeFhRVUZUTEhWRFFVRnhReXhGUVVGRkxGZEJRVk1zVTBGQlR5eEZRVUZGTERKQ1FVRjVRaXhMUVVGTE8wZEJRVVVzU1VGQlJ5eE5RVUZKTEV0QlFVc3NSMEZCUlR0SlFVRkRMRTFCUVUwc1JVRkJSU3hOUVVGTkxFTkJRVU03U1VGQlJTeEpRVUZKTEVsQlFVVXNUMEZCVFN4RlFVRkZMRmRCUVZNc2MwTkJRVzlETEhGRFFVRnRReXd5UWtGQlFTeERRVUUwUWp0TFFVRkRMR2xDUVVGblFpd3JRa0ZCSzBJc2IwSkJRVzlDTEVOQlFVTXNRMEZCUXl4SFFVRkhPMHRCUVVVc2VVSkJRWGRDTEVWQlFVVTdTMEZCVFN4blFrRkJaU3hGUVVGRk8wdEJRV1VzYlVKQlFXdENMRVZCUVVVN1MwRkJhMElzWTBGQllTeEZRVUZGTzBsQlFWa3NRMEZCUXp0SlFVRkZMRTFCUVUwc1JVRkJSU3hOUVVGTkxFTkJRVU03U1VGQlJTeEpRVUZKTEVsQlFVVXNUVUZCVFN3MFFrRkJORUk3UzBGQlF5eHZRa0ZCYlVJN1MwRkJSU3hqUVVGaE8wdEJRVVVzVVVGQlR6dExRVUZGTEZsQlFWY3NSVUZCUlR0TFFVRk5MR2RDUVVGbExFVkJRVVU3UzBGQlVTeFZRVUZUTzB0QlFVVTdTMEZCYzBJc2JVSkJRV3RDTzBsQlFVTXNRMEZCUXp0SlFVRkZMRWxCUVVjc1RVRkJTU3hoUVVGWk8wdEJRVU1zU1VGQlJTeExRVUZMTzB0QlFVVTdTVUZCVVR0SlFVRkRMRWxCUVVVN1MwRkJReXhOUVVGTE8wdEJRWGRDTEZOQlFWRTdTVUZCUXp0SlFVRkZPMGRCUVZFN1IwRkJReXhKUVVGSExFVkJRVVVzVjBGQlV5eFJRVUZQTzBsQlFVTXNTVUZCUnl4RlFVRkZMRVZCUVVVc01rSkJRWGxDTEVWQlFVVXNkMEpCUVhOQ0xFVkJRVVVzWTBGQll5eHBRa0ZCWlN4RFFVRkRMRXRCUVVjc1JVRkJSU3hUUVVGUExHbENRVUZuUWl4TlFVRk5MRTFCUVUwc05FSkJRVFJDTzBsQlFVVXNUVUZCVFN4SFFVRkhMRkZCUVZFc1IwRkJSU3hOUVVGTkxFVkJRVVVzVDBGQlR5eEhRVUZGTzB0QlFVTXNiMEpCUVcxQ0xFVkJRVVU3UzBGQmJVSXNU",
	"VUZCU3p0SlFVRk5MRWRCUVVVc1EwRkJRenRKUVVGRk8wZEJRVTA3UjBGQlF5eE5RVUZOTEVWQlFVVXNUVUZCVFN4RFFVRkRMRWRCUVVVc1NVRkJSU3hMUVVGTE8wVkJRVU03UTBGQlF5eFRRVUZQTEVkQlFVVTdSVUZCUXl4TlFVRk5MRTFCUVUwc1JVRkJSU3hMUVVGTE8wZEJRVU1zVDBGQlRTd3lRa0ZCTWtJc1EwRkJRenRIUVVGRkxFMUJRVXM3UlVGQldTeERRVUZETEVkQlFVVTdRMEZCUXl4VlFVRlJPMFZCUVVNc1RVRkJTU3hMUVVGTExFdEJRVWNzVFVGQlRTeEZRVUZGTEZGQlFWRXNSMEZCUlN4TFFVRkhMRTFCUVUwc1dVRkJXU3hEUVVGRE8wTkJRVU03UVVGQlF6dEJRVUZETEdWQlFXVXNORUpCUVRSQ0xFZEJRVVU3UTBGQlF5eEpRVUZKTEVkQlFVVXNTVUZCUlN4RFFVRkRMRWRCUVVjc1JVRkJSU3hqUVVGak8wTkJRVVVzVTBGQlR6dEZRVUZETEVsQlFVa3NTVUZCUlN4dFEwRkJiVU03UjBGQlF5eGhRVUZaTEVWQlFVVTdSMEZCYTBJc1UwRkJVVHRGUVVGRExFTkJRVU03UlVGQlJTeEpRVUZITEUxQlFVa3NTMEZCU3l4SFFVRkZMRTlCUVU4c1RVRkJTU3hMUVVGTExFdEJRVWNzVFVGQlRTeEZRVUZGTEU5QlFVOHNTMEZCU3p0SFFVRkRMRTFCUVVzN1IwRkJNRUlzVjBGQlZUdEZRVUZETEVOQlFVTXNSMEZCUlR0RlFVRkZMRVZCUVVVc1QwRkJUeXhoUVVGaExIbENRVUYxUWl4TlFVRkpMRXRCUVVzc1RVRkJTU3hKUVVGRkxFVkJRVVVzYzBKQlFYTkNMRWRCUVVVc1RVRkJUU3hGUVVGRkxFOUJRVThzUzBGQlN6dEhRVUZETEcxQ1FVRnJRaXhGUVVGRkxFOUJRVThzWVVGQllUdEhRVUZyUWl4WlFVRlhMRVZCUVVVN1IwRkJWeXhOUVVGTE8wZEJRWGRDTEZkQlFWVTdSVUZCUXl4RFFVRkRPMFZCUVVjc1NVRkJTU3hKUVVGRkxFVkJRVVVzVTBGQlV5eExRVUZMTzBWQlFVVXNSVUZCUlN4WlFVRlZMRU5CUVVNc1EwRkJRenRGUVVGRkxFbEJRVWtzU1VGQlJTeFBRVUZOTEVWQlFVVXNhVUpCUVdVc1MwRkJTeXhKUVVGRkxFbEJRVVVzVVVGQlVTeExRVUZMTEVOQlFVTXNSMEZCUlN4RlFVRkZMR0ZCUVdFc1UwRkJVeXhEUVVGRE8wVkJRVWNzU1VGQlJ5eE5RVUZKTEZWQlFWTXNUMEZCVHl4TlFVRkpMRXRCUVVzc1MwRkJSeXhOUVVGTkxFVkJRVVVzVDBGQlR5eExRVUZMTzBkQlFVTXNUVUZCU3p0SFFVRXdRaXhYUVVGVk8wVkJRVU1zUTBGQlF5eEhRVUZGTzBWQlFWa3NTVUZCUnl4RlFVRkZMRTFCUVVzc1RVRkJUU3hOUVVGTkxIRkVRVUZ4UkR0RlFVRkZMRWxCUVVrc1NVRkJSU3hGUVVGRk8wVkJRVTBzU1VGQlJ5eEZRVUZGTEZOQlFVOHNlVUpCUVhkQ08wZEJRVU1zUlVGQlJTeExRVUZMTEVkQlFVY3NSVUZCUlN4UFFVRlBPMGRCUVVVN1JVRkJVVHRGUVVGRExFbEJRVWNzUlVGQlJTeFRRVUZQTERSQ1FVRXdRaXhGUVVGRkxGTkJRVThzWjBOQlFTdENPMGRCUVVNc1NVRkJTU3hKUVVGRkxFMUJRVTBzTUVKQlFUQkNPMGxCUVVNc1lVRkJXVHRKUVVGRkxHZENRVUZsTEVWQlFVVXNUMEZCVHp0SlFVRmxMRzFDUVVGclFpeEZRVUZGTEU5QlFVODdTVUZCYTBJc1kwRkJZU3hGUVVGRkxFOUJRVTg3UjBGQldTeERRVUZETzBkQlFVVXNUVUZCVFN4RlFVRkZMRTlCUVU4c1RVRkJUU3hEUVVGRE8wZEJRVVU3UlVGQlVUdEZRVUZETEVsQlFVY3NSVUZCUlN4VFFVRlBMSEZDUVVGdFFpeEZRVUZGTEdOQlFWa3NSMEZCUlR0SFFVRkRMRTFCUVUwc1JVRkJSU3hQUVVGUExFdEJRVXM3U1VGQlF5eE5RVUZMTzBsQlFYbENMRmRCUVZVc1JVRkJSVHRIUVVGVExFTkJRVU1zUjBGQlJTeEpRVUZGTEV0QlFVczdSMEZCUlN4SlFVRkpMRWxCUVVVc1RVRkJUU3gxUWtGQmRVSTdTVUZCUXl4TlFVRkxMRVZCUVVVc1UwRkJVenRKUVVGTExHZENRVUZsTEVWQlFVVXNUMEZCVHp0SlFVRmxMRlZCUVZNc1JVRkJSU3hUUVVGVE8wbEJRVk1zWTBGQllTeEZRVUZGTEU5QlFVODdSMEZCV1N4RFFVRkRPMGRCUVVVc1RVRkJTU3hMUVVGTExFdEJRVWNzUlVGQlJTeHRRa0ZCYlVJc1MwRkJTenRKUVVGRExFZEJRVWNzUlVGQlJUdEpRVUZUTEZWQlFWTXNRMEZCUXl4RFFVRkRPMGRCUVVNc1EwRkJRenRGUVVGRE8wTkJRVU03UVVGQlF6dEJRVUZETEdWQlFXVXNjMEpCUVhOQ0xFZEJRVVU3UTBGQlF5eEpRVUZKTEVsQlFVVXNSVUZCUlR0RFFVRlZMRWxCUVVjN1JVRkJReXhUUVVGUE8wZEJRVU1zU1VGQlNTeEpRVUZGTEUxQlFVMHNVMEZCVXl4RFFVRkRPMGRCUVVVc1NVRkJSeXhGUVVGRkxGZEJRVk1zVVVGQlR6dEpRVUZETEUxQlFVMHNiMEpCUVc5Q08wdEJRVU1zWTBGQllTeEZRVUZGTzB0QlFXZENMRk5CUVZFN1RVRkJReXhSUVVGUE8wOUJRVU1zVFVGQlN6dFBRVUZQTEZGQlFVOHNSVUZCUlN4VlFVRlJPMDlCUVVjc1UwRkJVU3hGUVVGRk8wOUJRVkVzYlVKQlFXdENMRVZCUVVVN1QwRkJhMElzWTBGQllTeEZRVUZGTzA5QlFXRXNUMEZCVFN4RlFVRkZPMDFCUVVzN1RVRkJSU3hOUVVGTE8wdEJRV0U3U1VGQlF5eERRVUZETzBsQlFVVTdSMEZCVFR0SFFVRkRMRWxCUVVjc1JVRkJSU3hYUVVGVExIRkRRVUZ2UXp0SlFVRkRMRTFCUVUwc2IwSkJRVzlDTzB0QlFVTXNZMEZCWVN4RlFVRkZPMHRCUVdkQ0xGTkJRVkU3VFVGQlF5eFJRVUZQTzA5QlFVTXNUVUZCU3p0UFFVRnZReXh0UWtGQmEwSXNSVUZCUlR0UFFVRjVRaXh0UWtGQmEwSXNSVUZCUlR0UFFVRnJRaXhqUVVGaExFVkJRVVU3VFVGQldUdE5RVUZGTEUxQlFVczdTMEZCWVR0SlFVRkRMRU5CUVVNN1NVRkJSVHRIUVVGTk8wZEJRVU1zU1VGQlJ5eEZRVUZGTEZkQlFWTXNVVUZCVHp0SlFVRkRMRWxCUVVrc1NVRkJSU3hGUVVGRk8wbEJRWGxDTEVsQlFVY3NSVUZCUlN4TlFVRkpMRXRCUVVzc1MwRkJSeXhGUVVGRkxESkNRVUY1UWl4RlFVRkZMSGRDUVVGelFpeEZRVUZGTEdOQlFXTXNhVUpCUVdVc1EwRkJReXhMUVVGSExFVkJRVVVzVTBGQlR5eHBRa0ZCWjBJc1RVRkJUU3hOUVVGTkxEUkNRVUUwUWp0SlFVRkZMRWxCUVVrc1NVRkJSU3hOUVVGSkxFdEJRVXNzU1VGQlJUdExRVUZETEUxQlFVczdTMEZCVHl4dFFrRkJhMElzUlVGQlJUdExRVUZyUWl4alFVRmhMRVZCUVVVN1MwRkJZU3h2UWtGQmJVSXNSVUZCUlR0SlFVRnJRaXhKUVVGRk8wdEJRVU1zVFVGQlN6dExRVUV5UWl4dFFrRkJhMEk3UzBGQlJTeHRRa0ZCYTBJc1JVRkJSVHRMUVVGclFpeGpRVUZoTEVWQlFVVTdTVUZCV1R0SlFVRkZMRTFCUVUwc2IwSkJRVzlDTzB0QlFVTXNZMEZCWVN4RlFVRkZPMHRCUVdkQ0xGTkJRVkU3VFVGQlF5eFJRVUZQTzAxQlFVVXNUVUZCU3p0TFFVRmhPMGxCUVVNc1EwRkJRenRKUVVGRk8wZEJRVTA3UjBGQlF5eEpRVUZGTzBsQlFVTXNUMEZCVFN4TFFVRkxPMGxCUVVVc1owSkJRV1VzUlVGQlJUdEpRVUZsTEcxQ1FVRnJRaXhGUVVGRk8wbEJRV3RDTEdOQlFXRXNSVUZCUlR0SFFVRlpPMFZCUVVNN1EwRkJReXhUUVVGUExFZEJRVVU3UlVGQlF5eE5RVUZOTEUxQlFVMHNiMEpCUVc5Q08wZEJRVU1zWTBGQllTeEZRVUZGTzBkQlFXZENMRk5CUVZFN1NVRkJReXhQUVVGTkxESkNRVUV5UWl4RFFVRkRPMGxCUVVVc1RVRkJTenRIUVVGWk8wVkJRVU1zUTBGQlF5eEhRVUZGTzBOQlFVTTdRVUZCUXp0QlFVTjRNMDRzWVVGQllTeGhRVUZoTzBGQlF6RkNMRmRCUVZjc2IwSkJRVzlDTEVsQlFVa3NLMEpCUVN0Q0xGbEJRVms3T3p0QlEwZzVSU3hOUVVGTkxEQkNRVUYzUWl4UFFVRlBMRWxCUVVrc01FSkJRVEJDTzAxQlFVVXNOa0pCUVRKQ08wRkJRVmNzTWtKQlFUSkNMRFpDUVVFeVFpeExRVUZMTEUxQlFVa3NNa0pCUVRKQ0xESkNRVUY1UWl4SlFVRkpMRWxCUVVVN1FVRkJSeXhOUVVGTkxHTkJRVmtzTWtKQlFUSkNPMEZCUVhsQ0xFbEJRVWtzWVVGQlZ5eE5RVUZMTzBOQlFVTTdRMEZCU3p0RFFVRk5MRmxCUVZrc1IwRkJSU3hKUVVGRkxFTkJRVU1zUjBGQlJUdEZRVUZETEV0QlFVc3NUMEZCU3l4SFFVRkZMRXRCUVVzc1VVRkJUU3hGUVVGRk8wVkJRVTBzU1VGQlNTeEpRVUZGTEZsQlFWa3NTVUZCU1N4RFFVRkRPMFZCUVVVc1NVRkJSeXhOUVVGSkxFdEJRVXNzUzBGQlJ5eEZRVUZGTEZWQlFWRXNTMEZCU3l4TlFVRkpMRXRCUVVzc1ZVRkJVU3hMUVVGTExFbEJRVWNzVFVGQlRTeE5RVUZOTEN0Q1FVRXJRaXhGUVVGRkxEQkNRVUV3UWl4RlFVRkZMRkZCUVUwc1UwRkJUeXhWUVVGVkxITkNRVUZ6UWl4TFFVRkxMRkZCUVUwc1UwRkJUeXhWUVVGVkxHOUlRVUZ2U0R0RlFVRkZMRmxCUVZrc1NVRkJTU3hIUVVGRkxFbEJRVWs3UTBGQlF6dEJRVUZETzBGRFFURnlRaXhKUVVGSkxGZEJRVmNzVlVGQlZUdEJRVUZ0UWl4SlFVRkpMRmRCUVZjc2JVSkJRVzFDTzBGQlFXVXNTVUZCU1N4WFFVRlhMR1ZCUVdVN1FVRkJkVUlzU1VGQlNTeFhRVUZYTEhWQ1FVRjFRanROUVVGRkxITkNRVUZ2UWl4SlFVRkpMRmRCUVZjc2MwSkJRWE5DTzBGQlFUUkNMRWxCUVVrc1YwRkJWeXcwUWtGQk5FSTdRVUZCVlN4SlFVRkpMRmRCUVZjc1ZVRkJWVHRCUVVGdFFpeEpRVUZKTEZkQlFWY3NiVUpCUVcxQ08wMUJRVVVzYlVKQlFXbENMRWxCUVVrc1YwRkJWeXh0UWtGQmJVSTdRVUZCYTBJc1NVRkJTU3hYUVVGWExHdENRVUZyUWp0QlFVRnhRaXhKUVVGSkxGZEJRVmNzY1VKQlFYRkNPMEZCUVdFc1NVRkJTU3hYUVVGWExHRkJRV0U3UVVGQllTeEpRVUZKTEZkQlFWY3NZVUZCWVR0QlFVRnJReXhKUVVGSkxGZEJRVmNzYTBOQlFXdERPMEZCUVN0Q0xFbEJRVWtzVjBGQlZ5d3JRa0ZCSzBJN1FVRkJiVU1zU1VGQlNTeFhRVUZYTEcxRFFVRnRRenRCUVVGblF5eEpRVUZKTEZkQlFWY3NaME5CUVdkRE8wRkJRVFpDTEVsQlFVa3NWMEZCVnl3MlFrRkJOa0k3UVVGQmJVSXNTVUZCU1N4WFFVRlhMRzFDUVVGdFFqdEJRVUV3UWl4SlFVRkpMRmRCUVZjc01FSkJRVEJDTzBGQlFXZERMRWxCUVVrc1YwRkJWeXhuUTBGQlowTTdRVUZCTmtJc1NVRkJTU3hYUVVGWExEWkNRVUUyUWpzN08wRkRRWEJ5UXl4VFFVRlRMRFJDUVVFMFFpeEhRVUZGTzBOQlFVTXNTVUZCU1N4SlFVRkZMRzFDUVVGdFFpeEZRVUZGTEdsQ1FVRnBRaXhMUVVGTE8wTkJRVVVzVDBGQlR5eE5RVUZKTEVsQlFVVXNTMEZCU3l4SlFVRkZPMEZCUVVNN1FVRkJkMUVzVTBGQlV5eHRRa0ZCYlVJc1IwRkJSVHREUVVGRExFOUJRVThzVDBGQlR5eExRVUZITEZsQlFWVXNUMEZCVHl4VlFVRlZMRU5CUVVNc1MwRkJSeXhKUVVGRkxFbEJRVVVzU1VGQlJUdEJRVUZET3pzN1FVTkJhM0pDTEZOQlFWTXNiVUpCUVcxQ0xFZEJRVVU3UTBGQlF5eEpRVUZITEVOQlFVTXNSMEZCUlN4SFFVRkhMRXRCUVVjN1EwRkJSU3hKUVVGSExFMUJRVWtzUzBGQlN5eEhRVUZGTEUxQlFVMHNUVUZCVFN3d1EwRkJNRU03UTBGQlJTeEpRVUZKTEVsQlFVVXNSVUZCUlN4TlFVRkxMRWxCUVVVc1EwRkJReXhIUVVGSExFVkJRVVVzVVVGQlVUdERRVUZGTEV0QlFVa3NTVUZCU1N4TFFVRkxMRWRCUVVVc1JVRkJSU3hUUVVGUExFdEJRVXNzVFVGQlNTeEpRVUZGTEVWQlFVVXNUMEZCVFN4RlFVRkZMRXRCUVVzc1IwRkJSeXhGUVVGRkxGRkJRVkU3UTBGQlJTeFBRVUZOTzBWQlFVTXNSMEZCUnp0RlFVRkZMRTFCUVVzN1JVRkJSU3hWUVVGVE8wTkJRVU03UVVGQlF6czdPMEZEUVhReFF5eFRRVUZUTEd0Q1FVRnJRaXhIUVVGRk8wTkJRVU1zU1VGQlNTeEpRVUZGTEVWQlFVVXNjMEpCUVhGQ0xFbEJRVVVzUjBGQlJ5eFJRVUZQTEVsQlFVVXNSMEZCUnl4bFFVRmpMRWxCUVVVc1IwRkJSeXhYUVVGVkxFbEJRVVVzUjBGQlJ5eE5RVUZOTzBOQlFVY3NUMEZCVFR0RlFVRkRMRkZCUVU4c2FVSkJRV2xDTEVOQlFVTXNTVUZCUlN4SlFVRkZMRXRCUVVzN1JVRkJSU3hsUVVGakxHbENRVUZwUWl4RFFVRkRMRWxCUVVVc1NVRkJSU3hMUVVGTE8wVkJRVVVzVjBGQlZTeHBRa0ZCYVVJc1EwRkJReXhKUVVGRkxFbEJRVVVzUzBGQlN6dEZRVUZGTEZGQlFVOHNhVUpCUVdsQ0xFTkJRVU1zU1VGQlJTeEpRVUZGTEV0QlFVczdRMEZCUXp0QlFVRkRPMEZCUVhWRkxGTkJRVk1zYTBKQlFXdENMRWRCUVVVN1EwRkJReXhQUVVGUExHdENRVUZyUWl4RFFVRkRMRU5CUVVNc1EwRkJRenRCUVVGaE8wRkJRVU1zVTBGQlV5eHhRa0ZCY1VJc1IwRkJSVHREUVVGRExFbEJRVWtzU1VGQlJTeEZRVUZGTEc5Q1FVRnZRanREUVVGTkxFOUJRVThzYVVKQlFXbENMRU5CUVVNc1NVRkJSU3hKUVVGRkxFdEJRVXM3UVVGQlF6czdPMEZEUXpWelFpeEpRVUZYTERSQ1FVRTBRaXhYUVVGWExFOUJRVThzU1VGQlNTeHRRa0ZCYlVJc1JVRkJSU3hEUVVGRExEWkRRVUUyUXpzN08wRkRRV2hKTEUxQlFVMHNkMEpCUVhOQ08wRkJSV2RDTEZkQlFWY3NUMEZCVHl4SlFVRkpMRzFDUVVGdFFpeEZRVUZGTEVOQlFVTXNlVVJCUVhsRU8wRkJRek5ITEZkQlFWY3NUMEZCVHl4SlFVRkpMRzFDUVVGdFFpeEZRVUZGTEVOQlFVTXNiVVJCUVcxRU96czdRVU5LY2tJc1UwRkJVeXh4UTBGQmNVTXNSMEZCUlN4SFFVRkZPME5CUVVNc1NVRkJTU3hKUVVGRkxFVkJRVVU3UTBGQlpTeEpRVUZITEVkQlFVY3NVMEZCVHl4MVFrRkJjMElzVDBGQlRUdEZRVUZETEZGQlFVOHNUMEZCVHl4RlFVRkZMRTlCUVU4c1ZVRkJVU3hGUVVGRk8wVkJRVVVzVFVGQlN6dEZRVUZyUWl4UlFVRlBPMFZCUVVVc1kwRkJZU3hQUVVGUExFVkJRVVVzVDBGQlR5eG5Ra0ZCWXl4RlFVRkZPME5CUVVNN1FVRkJRenRCUVVGRExGTkJRVk1zYlVOQlFXMURMRWRCUVVVc1IwRkJSVHREUVVGRExFbEJRVWtzU1VGQlJTeHhRMEZCY1VNc1IwRkJSU3hGUVVGRk8wTkJRVVVzU1VGQlJ5eE5RVUZKTEV0QlFVc3NSMEZCUlN4UFFVRk5PMFZCUVVNc1IwRkJSenRGUVVGRkxGTkJRVkVzUTBGQlF6dEZRVUZGTEZGQlFVODdSMEZCUXl4TlFVRkxPMGRCUVRSQ0xGTkJRVkVzWlVGQlpTeERRVUZETzBWQlFVTTdRMEZCUXp0QlFVRkRPenM3UVVORGJHbENMRWxCUVZjc01FSkJRVEJDTEZkQlFWY3NUMEZCVHl4SlFVRkpMRzFDUVVGdFFpeEZRVUZGTEVOQlFVTXNNa05CUVRKRE96czdRVU5FZDBvc1NVRkJTU3h6UWtGQmIwSXNUVUZCU3p0RFFVRkRPME5CUVcxQ08wTkJRVkU3UTBGQlowSTdRMEZCWVN4cFFrRkJaVHREUVVGTExGbEJRVmtzUjBGQlJUdEZRVUZETEV0QlFVc3NjVUpCUVcxQ0xFVkJRVVVzYjBKQlFXMUNMRXRCUVVzc1ZVRkJVU3hYUVVGWExFVkJRVU1zVDBGQlRTeEZRVUZGTEUxQlFVc3NRMEZCUXl4SFFVRkZMRXRCUVVzc2EwSkJRV2RDTEV0QlFVc3NVVUZCVVN4UFFVRlBMR05CUVdNc1EwRkJReXhIUVVGRkxFdEJRVXNzWlVGQllTeEZRVUZGTzBOQlFWazdRMEZCUXl4SlFVRkpMRkZCUVU4N1JVRkJReXhQUVVGUExFdEJRVXNzVVVGQlVUdERRVUZMTzBOQlFVTXNUVUZCVFN4VlFVRlRPMFZCUVVNc1RVRkJUU3hyUWtGQmEwSXNTMEZCU3l4bFFVRmxMRWRCUVVVc1RVRkJUU3haUVVGWkxFdEJRVXNzVDBGQlR6dERRVUZETzBOQlFVTXNUVUZCVFN4blFrRkJaVHRGUVVGRExGTkJRVTg3UjBGQlF5eEpRVUZKTEVsQlFVVXNUVUZCVFN4TFFVRkxMRmxCUVZrc2MwUkJRWE5FTEVkQlFVVXNTVUZCUlN4TFFVRkxMRzlDUVVGdlFpeERRVUZETzBkQlFVVXNTVUZCUnl4TlFVRkpMRXRCUVVzc1IwRkJSU3hQUVVGUE8wZEJRVVVzU1VGQlJ5eEZRVUZGTEZOQlFVOHNlVUpCUVhkQ08wbEJRVU1zU1VGQlNTeEpRVUZGTEUxQlFVMHNTMEZCU3l4MVFrRkJkVUlzUTBGQlF6dEpRVUZGTEVsQlFVY3NUVUZCU1N4TFFVRkxMRWRCUVVVc1QwRkJUenRIUVVGRE8wVkJRVU03UTBGQlF6dERRVUZETEhGQ1FVRnhRaXhIUVVGRk8wVkJRVU1zUlVGQlJTeDFRa0ZCY1VJc1MwRkJTeXhMUVVGSExFdEJRVXNzYlVKQlFXMUNMRkZCUVZFc1IwRkJSeXhGUVVGRkxHdENRVUZyUWp0RFFVRkRPME5CUVVNc2FVSkJRV2RDTzBWQlFVTXNTMEZCU3l4cFFrRkJaVHREUVVGSk8wTkJRVU1zYjBKQlFXMUNPMFZCUVVNc1QwRkJUeXhMUVVGTExHMUNRVUZwUWl4TFFVRkxMR2RDUVVGblFpeExRVUZMTEVkQlFVVXNTMEZCU3p0RFFVRmpPME5CUVVNc1RVRkJUU3haUVVGWkxFZEJRVVU3UlVGQlF5eFRRVUZQTzBkQlFVTXNTVUZCU1N4SlFVRkZMRTFCUVUwc1MwRkJTeXhyUWtGQmEwSTdSMEZCUlN4SlFVRkhMRXRCUVVzc1pVRkJaU3hIUVVGRkxFVkJRVVVzVFVGQlN5eE5RVUZOTEUxQlFVMHNRMEZCUXp0SFFVRkZMRWxCUVVrc1NVRkJSU3hGUVVGRk8wZEJRVTBzU1VGQlJ5eEZRVUZGTEZOQlFVOHNZMEZCWVN4TlFVRk5MSGxDUVVGNVFpeEZRVUZGTEV0QlFVczdSMEZCUlN4SlFVRkhMRVZCUVVVc1UwRkJUeXd5UWtGQk1FSTdTVUZCUXl4TlFVRk5MRXRCUVVzc1lVRkJZU3hOUVVGTkxFVkJRVVVzYVVKQlFXbENPMGxCUVVVN1IwRkJVVHRIUVVGRExFOUJRVTg3UlVGQlF6dERRVUZETzBOQlFVTXNiMEpCUVc5Q0xFZEJRVVU3UlVGQlF5eEpRVUZITEVWQlFVVXNVMEZCVHl4alFVRmhMRTFCUVUwc2VVSkJRWGxDTEVWQlFVVXNTMEZCU3p0RlFVRkZMRWxCUVVjc1JVRkJSU3hUUVVGUExHVkJRV01zVDBGQlR5eExRVUZMTEhGQ1FVRnhRaXhEUVVGRExFZEJRVVVzUlVGQlJUdERRVUZOTzBOQlFVTXNUVUZCVFN4MVFrRkJkVUlzUjBGQlJUdEZRVUZETEUxQlFVMHNTMEZCU3l4aFFVRmhMRTFCUVUwc1JVRkJSU3hwUWtGQmFVSTdSVUZCUlN4SlFVRkpMRWxCUVVVc1MwRkJTeXh0UWtGQmJVSXNUVUZCVFR0RlFVRkZMRTlCUVVzc1RVRkJTU3hMUVVGTExFbEJRVWM3UjBGQlF5eEpRVUZKTEVsQlFVVXNUVUZCVFN4UlFVRlJMRXRCUVVzc1EwRkJReXhMUVVGTExHdENRVUZyUWl4RFFVRkRMRU5CUVVNc1RVRkJTeXhQUVVGSk8wbEJRVU1zVFVGQlN6dEpRVUZWTEU5QlFVMDdSMEZCUXl4RlFVRkZMRWRCUVVVc1MwRkJTeXhoUVVGaExFdEJRVXNzUTBGQlF5eERRVUZETEUxQlFVc3NUMEZCU1R0SlFVRkRMRTFCUVVzN1NVRkJWeXhQUVVGTk8wZEJRVU1zUlVGQlJTeERRVUZETEVOQlFVTTdSMEZCUlN4SlFVRkhMRVZCUVVVc1UwRkJUeXhYUVVGVk8wbEJRVU1zU1VGQlJ5eExRVUZMTEdWQlFXVXNSMEZCUlN4RlFVRkZMRTFCUVUwc1RVRkJTeXhOUVVGTkxFMUJRVTBzY1VSQlFYRkVPMGxCUVVVc1NVRkJSeXhGUVVGRkxFMUJRVTBzVFVGQlRTeFRRVUZQTERKQ1FVRXdRanRMUVVGRExFMUJRVTBzUzBGQlN5eGhRVUZoTEUxQlFVMHNSVUZCUlN4TlFVRk5MRTFCUVUwc2FVSkJRV2xDTzB0QlFVVTdTVUZCVVR0SlFVRkRMRWxCUVVrc1NVRkJSU3hMUVVGTExHOUNRVUZ2UWl4RlFVRkZMRTFCUVUwc1MwRkJTenRKUVVGRkxFbEJRVWNzVFVGQlNTeExRVUZMTEVkQlFVVXNUMEZCVHp0SlFVRkZMRWxCUVVjc1JVRkJSU3hOUVVGTkxFMUJRVTBzVTBGQlR5dzJRa0ZCTWtJc1JVRkJSU3hOUVVGTkxFMUJRVTBzWTBGQldTeEZRVUZGTEZkQlFWVTdTVUZCVHp0SFFVRlJPMGRCUVVNc1NVRkJSeXhGUVVGRkxFMUJRVTBzVFVGQlN5eE5RVUZOTEUxQlFVMHNPRVJCUVRoRU8wZEJRVVVzUzBGQlN5eGhRVUZoTEZsQlFWa3NSMEZCUlN4RlFVRkZMRTFCUVUwc1RVRkJUU3hUUVVGUExHTkJRVmtzU1VGQlJTeEZRVUZGTEUxQlFVMDdSVUZCVFR0RlFVRkRMRWxCUVVjN1IwRkJReXhOUVVGTkxIZENRVUYzUWp0SlFVRkRMRmxCUVZjc1JVRkJSVHRKUVVGWExGTkJRVkU3UzBGQlF5eFZRVUZUTzB0QlFVVXNUVUZCU3p0TFFVRnJRaXhYUVVGVkxFVkJRVVU3U1VGQlV6dEhRVUZETEVOQlFVTTdSVUZCUXl4VFFVRlBMRWRCUVVVN1IwRkJReXhKUVVGSExFVkJRVVVzWVVGQllTeFRRVUZQTEVWQlFVVXNVMEZCVHl4elFrRkJjVUlzVFVGQlRUdEZRVUZETzBWQlFVTXNUMEZCVHl4TlFVRk5MRXRCUVVzc2RVSkJRWFZDTEVWQlFVVXNWMEZCVlN4RFFVRkRPME5CUVVNN1EwRkJReXhOUVVGTkxIVkNRVUYxUWl4SFFVRkZMRWRCUVVVN1JVRkJReXhUUVVGUE8wZEJRVU1zU1VGQlNTeEpRVUZGTEUxQlFVMHNTMEZCU3l4WlFVRlpMR2xGUVVGcFJUdEhRVUZGTEVsQlFVY3NSVUZCUlN4VFFVRlBMREJDUVVGNVFqdEpRVUZETEVsQlFVY3NSVUZCUlN4alFVRlpMRWRCUVVVN1NVRkJUenRIUVVGUk8wZEJRVU1zU1VGQlJ5eEZRVUZGTEZOQlFVOHNOa0pCUVRKQ0xFVkJRVVVzWTBGQldTeEhRVUZGTzBsQlFVTXNTMEZCU3l4dFFrRkJiVUlzVVVGQlVTeERRVUZETzBsQlFVVTdSMEZCVFR0SFFVRkRMRVZCUVVVc1UwRkJUeXhwUWtGQlpTeExRVUZMTEcxQ1FVRnRRaXhSUVVGUkxFTkJRVU03UjBGQlJTeEpRVUZKTEVsQlFVVXNTMEZCU3l4dlFrRkJiMElzUTBGQlF6dEhRVUZGTEVsQlFVY3NUVUZCU1N4TFFVRkxMRWRCUVVVc1QwRkJUenRGUVVGRE8wTkJRVU03UVVGQlF6czdPMEZEUVRWcVJ5eGxRVUZsTEhGQ1FVRnhRaXhIUVVGRk8wTkJRVU1zU1VGQlNTeEpRVUZGTEVsQlFVa3NiMEpCUVc5Q08wVkJRVU1zYjBKQlFXMUNMRVZCUVVVN1JVRkJiVUlzWTBGQllTeEZRVUZGTzBWQlFXRXNUMEZCVFN4RlFVRkZPME5CUVZrc1EwRkJRenREUVVGRkxFbEJRVWM3UlVGQlF5eFBRVUZQTEUxQlFVMHNhVUpCUVdsQ08wZEJRVU1zWTBGQllTeEZRVUZGTzBkQlFXRXNhVUpCUVdkQ0xFVkJRVVU3UjBGQlRTeFZRVUZUTEVWQlFVVTdSMEZCVXl4TlFVRkxMRVZCUVVVN1IwRkJTeXhuUWtGQlpTeEZRVUZGTzBkQlFXVXNiVUpCUVd0Q0xFVkJRVVU3UjBGQmEwSXNZMEZCWVN4RlFVRkZPMFZCUVZrc1EwRkJReXhIUVVGRk8wZEJRVU1zVVVGQlR5eE5RVUZOTEVWQlFVVXNZMEZCWXp0SFFVRkZMR1ZCUVZrc1JVRkJSU3hSUVVGUk8wVkJRVU03UTBGQlF5eFRRVUZQTEVkQlFVVTdSVUZCUXl4TlFVRk5MRTFCUVUwc1JVRkJSU3hSUVVGUkxFZEJRVVU3UTBGQlF6dEJRVUZET3pzN1FVTkRlR3hDTEVsQlFWY3NiMEpCUVc5Q0xGZEJRVmNzVDBGQlR5eEpRVUZKTEcxQ1FVRnRRaXhGUVVGRkxFTkJRVU1zY1VOQlFYRkRPenM3UVVOQmFFZ3NTVUZCVnl3d1FrRkJNRUlzVjBGQlZ5eFBRVUZQTEVsQlFVa3NiVUpCUVcxQ0xFVkJRVVVzUTBGQlF5d3lRMEZCTWtNN096dEJRMEUxU0N4SlFVRlhMR2xEUVVGcFF5eFhRVUZYTEU5QlFVOHNTVUZCU1N4dFFrRkJiVUlzUlVGQlJTeERRVUZETEd0RVFVRnJSRHM3TzBGRFFURkpMRWxCUVZjc01FSkJRVEJDTEZkQlFWY3NUMEZCVHl4SlFVRkpMRzFDUVVGdFFpeEZRVUZGTEVOQlFVTXNNa05CUVRKRE96czdRVU5FVHl4VFFVRlRMREJDUVVFd1FpeEhRVUZGTzBOQlFVTXNTVUZCU1N4SFFVRkZMRWxCUVVVc1EwRkJReXhIUVVGRkxFbEJRVVVzUTBGQlF5eEhRVUZGTEVsQlFVVXNSMEZCUlN4SlFVRkZMRTFCUVVzc1IwRkJSU3hIUVVGRkxGZEJRVkVzVFVGQlJ6dEZRVUZETEVWQlFVVXNTMEZCU3l4RFFVRkRMRWRCUVVVc1JVRkJSU3hOUVVGTkxFZEJRVVVzVFVGQlNTeEZRVUZGTEZGQlFVMHNSVUZCUlN4TFFVRkxMRWRCUVVVc1NVRkJTU3hIUVVGRkxFbEJRVVVzUzBGQlN6dERRVUZETEVkQlFVVXNUMEZCU1N4TlFVRkhPMFZCUVVNc1JVRkJSU3hWUVVGUkxFVkJRVVVzV1VGQlZTeEZRVUZGTEZWQlFWRXNRMEZCUXl4SFFVRkZMRVZCUVVVc1YwRkJVeXhMUVVGTExFbEJRVWNzUlVGQlJTeFZRVUZSTEZGQlFWRXNVVUZCVVN4RlFVRkZMRWxCUVVrc1EwRkJReXhEUVVGRExFMUJRVXNzVDBGQlNUdEhRVUZETEUxQlFVc3NRMEZCUXp0SFFVRkZMRTlCUVUwN1JVRkJReXhGUVVGRkxFbEJRVVVzUlVGQlJTeFRRVUZUTEV0QlFVc3NSVUZCUVN4RFFVRkhMRTFCUVVzc1RVRkJSenRIUVVGRExFbEJRVWtzU1VGQlJUdEpRVUZETEU5QlFVMDdTVUZCU1N4UlFVRlBPMGxCUVVVc1QwRkJUVHRIUVVGRE8wZEJRVVVzUlVGQlJTeFhRVUZUTEVkQlFVVXNSVUZCUlN4WFFVRlRMRkZCUVZFc1EwRkJRenRGUVVGRExGTkJRVTBzUTBGQlF5eERRVUZETzBOQlFVVXNSMEZCUlN4VlFVRlBMRTFCUVVjN1JVRkJReXhGUVVGRkxGVkJRVkVzUTBGQlF5eEhRVUZGTEVWQlFVVXNZVUZCVnl4TFFVRkxMRXRCUVVjc1VVRkJVU3hGUVVGRkxGRkJRVkU3UTBGQlF5eEhRVUZGTEdGQlFWY3NXVUZCVXp0RlFVRkRMRWxCUVVjc1RVRkJTU3hOUVVGTExFdEJRVWtzVFVGQlRTeFJRVUZSTEZGQlFWRXNSMEZCUlN4RlFVRkZMRk5CUVU4c1NVRkJSenRIUVVGRExFbEJRVWtzU1VGQlJTeEZRVUZGTEUxQlFVMDdSMEZCUlN4RlFVRkZMRTFCUVUwc1ZVRkJVU3hEUVVGRExFZEJRVVVzUlVGQlJTeE5RVUZOTEZkQlFWTXNTMEZCU3l4SFFVRkZMRVZCUVVVc1QwRkJUeXhQUVVGTExFVkJRVVVzVFVGQlRTeFRRVUZQTEVOQlFVTXNTVUZCUlN4RlFVRkZMRTlCUVU4c1RVRkJUU3hUUVVGUExHRkJRVmNzUlVGQlJTeExRVUZMTEVWQlFVVXNUMEZCVHl4TFFVRkxMRWRCUVVVc1NVRkJTU3hGUVVGRkxFdEJRVXNzUjBGQlJTeE5RVUZOTEZGQlFWRXNVVUZCVVR0RlFVRkRPME5CUVVNN1EwRkJSU3hQUVVGTk8wVkJRVU1zWTBGQllUdEhRVUZETEVsQlFVY3NUVUZCU1N4TFFVRkxMRWRCUVVVc1RVRkJUU3hOUVVGTkxITkVRVUZ6UkR0SFFVRkZMRVZCUVVVc1RVRkJUU3hWUVVGUkxFTkJRVU1zUjBGQlJTeEZRVUZGTEUxQlFVMHNWMEZCVXl4TFFVRkxMRWRCUVVVc1JVRkJSU3hQUVVGUExGTkJRVThzUlVGQlJTeE5RVUZOTEZOQlFVOHNRMEZCUXl4SlFVRkhMRWxCUVVVc1MwRkJTeXhIUVVGRkxFbEJRVVU3UlVGQlNUdEZRVUZGTEUxQlFVMHNW",
	"VUZCVXp0SFFVRkRMRTFCUVVrc1MwRkJTeXhOUVVGSkxFMUJRVTBzV1VGQldTeEZRVUZGTEVsQlFVa3NSMEZCUlN4SlFVRkZMRXRCUVVzN1JVRkJSVHRGUVVGRkxFOUJRVTA3UjBGQlF5eEpRVUZITEUxQlFVa3NTMEZCU3l4SFFVRkZMRTFCUVUwc1RVRkJUU3h6UlVGQmMwVTdSMEZCUlN4SlFVRkhMRTFCUVVrc1RVRkJTeXhQUVVGUE8wZEJRVVVzU1VGQlNTeERRVUZETzBkQlFVVXNTMEZCU1N4SlFVRkpMRXRCUVVzc1IwRkJSU3hKUVVGSkxFTkJRVU03UjBGQlJTeFBRVUZQTEVWQlFVVXNWVUZCVVN4RlFVRkZMRTlCUVUwc1RVRkJSeXhGUVVGRkxFMUJRVTBzUzBGQlJ5eEpRVUZGTzBsQlFVTXNUMEZCVFR0SlFVRkpMRkZCUVU4N1MwRkJReXhOUVVGTExFTkJRVU03UzBGQlJTeFBRVUZOTEV0QlFVczdTVUZCUXp0SlFVRkZMRTlCUVUwN1IwRkJReXhIUVVGRkxFbEJRVVVzVVVGQlVTeFJRVUZSTEVWQlFVVXNUVUZCVFN4SFFVRkZMRTFCUVVrc1MwRkJSeXhaUVVGVE8wbEJRVU1zVDBGQlN5eEZRVUZGTEZkQlFWTXNTVUZCUnl4TlFVRk5MRWxCUVVrc1UwRkJVU3hOUVVGSE8wdEJRVU1zU1VGQlJUdEpRVUZETEVOQlFVTTdTVUZCUlN4SlFVRkpMRWxCUVVVc1JVRkJSU3hOUVVGTk8wbEJRVVVzVDBGQlR5eEpRVUZGTEVkQlFVVXNSVUZCUlR0SFFVRk5MRVZCUVVFc1EwRkJSeXhIUVVGRk8wVkJRVVU3UlVGQlJTeE5RVUZOTEUxQlFVMHNSMEZCUlR0SFFVRkRMRWxCUVVjc1EwRkJReXhMUVVGSExFZEJRVWNzUzBGQlN5eFZRVUZSTEVkQlFVVTdSMEZCVHl4SlFVRkpMRWxCUVVVc1YwRkJWeXhGUVVGRExFOUJRVTBzUlVGQlF5eERRVUZETEVkQlFVVXNTVUZCUlR0SlFVRkRMRkZCUVU4c1EwRkJRenRKUVVGRkxGTkJRVkVzUTBGQlF6dEpRVUZGTEUxQlFVczdTVUZCUlN4VlFVRlRMRVZCUVVVc1QwRkJUeXhqUVVGakxFTkJRVU03U1VGQlJTeFRRVUZSTEVOQlFVTTdTVUZCUlN4VFFVRlJMRU5CUVVNN1IwRkJRenRIUVVGRkxFbEJRVWNzVFVGQlNTeExRVUZMTEVkQlFVVTdTVUZCUXl4TlFVRk5MRzFDUVVGdFFpeEZRVUZGTEVsQlFVa3NSMEZCUlN4UFFVRlBMRU5CUVVNc1IwRkJSU3hKUVVGRk8wbEJRVVU3UjBGQlRUdEhRVUZETEVsQlFVa3NTVUZCUlR0SFFVRkZMRWxCUVVrc1EwRkJReXhIUVVGRkxFbEJRVWtzUTBGQlF5eEhRVUZGTEUxQlFVMHNiVUpCUVcxQ0xFVkJRVVVzU1VGQlNTeEhRVUZGTEU5QlFVOHNRMEZCUXl4SFFVRkZMRTFCUVUwc1YwRkJWenRIUVVGRkxFbEJRVWM3U1VGQlF5eE5RVUZOTEZsQlFWa3NSVUZCUlN4SlFVRkpPMGRCUVVNc1UwRkJUeXhIUVVGRk8wbEJRVU1zU1VGQlJTeExRVUZMTzBsQlFVVXNTVUZCUnp0TFFVRkRMRTFCUVUwc1dVRkJXU3hGUVVGRkxFbEJRVWs3U1VGQlF5eFJRVUZOTEVOQlFVTTdTVUZCUXl4TlFVRk5PMGRCUVVNN1IwRkJReXhGUVVGRkxGVkJRVkVzUTBGQlF5eEhRVUZGTEVWQlFVVXNTMEZCU3l4RFFVRkRMRWRCUVVVc1NVRkJSU3hIUVVGRkxFMUJRVTBzVjBGQlZ6dEZRVUZETzBOQlFVTTdRVUZCUXpzN08wRkRRM0o0UWl4bFFVRmxMR05CUVdNc1IwRkJSVHREUVVGRExFbEJRVWNzUlVGQlF5eGxRVUZqTEUxQlFVY3NiMEpCUVc5Q0xFZEJRVVVzU1VGQlJTeEZRVUZGTEd0Q1FVRnJRaXcwUWtGQk1FSXNTVUZCUnl4SlFVRkZMRVZCUVVVc2EwSkJRV3RDTEdGQlFWa3NTVUZCUlN4RlFVRkZMR3RDUVVGclFpeHhRa0ZCYjBJc1NVRkJSU3hGUVVGRkxHdENRVUZyUWp0RFFVRmpMRVZCUVVVc2EwSkJRV3RDTEcxQ1FVRnBRanREUVVGRkxFbEJRVWtzU1VGQlJTeFpRVUZaTzBOQlFVVXNTVUZCUnp0RlFVRkRMRWxCUVVrc1NVRkJSU3hyUWtGQmEwSXNSVUZCUlN4cFFrRkJhVUlzUjBGQlJTeEpRVUZGTERSQ1FVRTBRaXhGUVVGRkxHbENRVUZwUWl4SFFVRkZMRVZCUVVNc1QwRkJUU3hOUVVGSExFMUJRVTBzYTBKQlFXdENPMGRCUVVNc2VVSkJRWGRDTEVWQlFVVTdSMEZCVHl4dFFrRkJhMEk3UjBGQlJTeHBRa0ZCWjBJc1JVRkJSVHRIUVVGUExGRkJRVThzUlVGQlJUdEhRVUZQTEdOQlFXRXNSVUZCUlN4TlFVRk5PMGRCUVdFc1pVRkJZenRIUVVGRkxGZEJRVlU3UjBGQlJTeGxRVUZqTzBWQlFVTXNRMEZCUXp0RlFVRkZMRTlCUVU4c1RVRkJUU3hqUVVGak8wZEJRVU1zWTBGQllUdEhRVUZGTEdkQ1FVRmxPMGRCUVVVc1kwRkJZVHRKUVVGRExFMUJRVXM3U1VGQlZTeFZRVUZUTEVOQlFVTTdTMEZCUXl4VFFVRlJMRVZCUVVVc1RVRkJUVHRMUVVGUkxGTkJRVkVzUlVGQlJTeE5RVUZOTzB0QlFWRXNZMEZCWVN4RlFVRkZMRTFCUVUwN1NVRkJXU3hEUVVGRE8wbEJRVVVzVjBGQlZTeHhRa0ZCY1VJc1JVRkJSU3hwUWtGQmFVSTdSMEZCUXp0SFFVRkZMRTFCUVVzN1IwRkJSU3h0UWtGQmEwSXNSVUZCUlR0SFFVRnJRaXhqUVVGaE8wVkJRVU1zUTBGQlF6dERRVUZETEZOQlFVOHNSMEZCUlR0RlFVRkRMRTFCUVUwc1RVRkJUU3dyUWtGQkswSTdSMEZCUXl4UFFVRk5MREpDUVVFeVFpeERRVUZETzBkQlFVVXNaMEpCUVdVN1IwRkJSU3h0UWtGQmEwSXNSVUZCUlR0RlFVRnBRaXhEUVVGRExFZEJRVVVzVFVGQlRTeDNRa0ZCZDBJN1IwRkJReXhQUVVGTkxESkNRVUV5UWl4RFFVRkRPMGRCUVVVc2JVSkJRV3RDTEVWQlFVVTdSMEZCYTBJc1VVRkJUenRGUVVGUkxFTkJRVU1zUjBGQlJTeE5RVUZOTERCQ1FVRXdRanRIUVVGRExGRkJRVThzYlVOQlFXMURMRVZCUVVVc2JVSkJRV3RDTEVOQlFVTTdSMEZCUlN4dFFrRkJhMElzUlVGQlJUdEZRVUZwUWl4RFFVRkRMRWRCUVVVN1EwRkJRenRCUVVGRE8wRkJRVU1zWlVGQlpTeGpRVUZqTEVkQlFVVTdRMEZCUXl4SlFVRkpMRWxCUVVVc1YwRkJWeXhGUVVGRExFOUJRVTBzUjBGQlJ5eEZRVUZGTEdGQlFXRXNWVUZCVlN4UFFVRk5MRU5CUVVNc1IwRkJSU3hKUVVGRkxFVkJRVVVzVDBGQlR5eGpRVUZqTEVOQlFVTXNSMEZCUlN4SlFVRkZMRWRCUVVVc05rSkJRWGxDTEVkQlFVY3NSVUZCUlN4aFFVRmhMRlZCUVZVc1owSkJRV2RDTEU5QlFVOHNSMEZCUnl4TFFVRkpMRWxCUVVVc1EwRkJReXhIUVVGRkxFbEJRVVVzTUVKQlFUQkNMRU5CUVVNc1IwRkJSU3hIUVVGRkxGVkJRVkVzVDBGQlRTeE5RVUZITzBWQlFVTXNTVUZCU1N4SlFVRkZMRTFCUVUwc2NVSkJRWEZDTzBkQlFVTXNiMEpCUVcxQ08wZEJRVVVzWTBGQllTeEZRVUZGTzBkQlFXRXNZMEZCWVN4eFFrRkJjVUk3UjBGQlJTeFZRVUZUTEVWQlFVVTdSMEZCVXl4alFVRmhPMGRCUVVVc1RVRkJTeXhGUVVGRk8wZEJRVXNzWjBKQlFXVXNSVUZCUlR0SFFVRmxMRzFDUVVGclFpeEZRVUZGTzBkQlFXdENMR05CUVdFc1JVRkJSVHRGUVVGWkxFTkJRVU03UlVGQlJTeFBRVUZQTEUxQlFVMHNTVUZCU1N4SFFVRkZMRWxCUVVVc1JVRkJSU3hUUVVGUkxFVkJRVVU3UTBGQlRUdERRVUZGTEVsQlFVYzdSVUZCUXl4RlFVRkZMR0ZCUVdFc2NVSkJRVzFDTEUxQlFVMHNSVUZCUlN4TlFVRk5MRVZCUVVVc1lVRkJZU3hwUWtGQmFVSTdSVUZCUlN4SlFVRkpMRWxCUVVVc1RVRkJUU3hSUVVGUk8wZEJRVU1zVlVGQlV5eEZRVUZGTzBkQlFXRXNiVUpCUVd0Q0xFVkJRVVU3UjBGQmEwSXNZMEZCWVN4RlFVRkZPMFZCUVZrc1EwRkJRenRGUVVGRkxGTkJRVTg3UjBGQlF5eEpRVUZITEVWQlFVVXNVMEZCVHl4UlFVRlBMRTlCUVU4c1RVRkJUU3hoUVVGaE8wbEJRVU1zVVVGQlR6dEpRVUZGTEdkQ1FVRmxMRVZCUVVVN1IwRkJZeXhEUVVGRE8wZEJRVVVzU1VGQlJ5eEZRVUZGTEZOQlFVOHNVVUZCVHl4TlFVRk5MRTFCUVUwc01rTkJRVEpETEVWQlFVVXNTMEZCU3l4SFFVRkhPMGRCUVVVc1NVRkJSeXhGUVVGRkxHTkJRVmtzUTBGQlF5eEhRVUZGTzBsQlFVTXNTVUZCU1N4SlFVRkZMRTFCUVUwc2QwSkJRWGRDTzB0QlFVTXNaMEpCUVdVc1JVRkJSVHRMUVVGbExHMUNRVUZyUWl4RlFVRkZPMHRCUVd0Q0xHTkJRV0VzUlVGQlJUdEpRVUZaTEVOQlFVTTdTVUZCUlN4SlFVRkZPMHRCUVVNc1IwRkJSenRMUVVGRkxHMUNRVUZyUWl4RlFVRkZPMHRCUVd0Q0xHTkJRV0VzUlVGQlJUdEpRVUZaTzBkQlFVTTdSMEZCUXl4SlFVRkhMRU5CUVVNc1JVRkJSU3hoUVVGaExHMUNRVUZyUWl4TlFVRk5MRTFCUVUwc2MwMUJRWE5OTzBkQlFVVXNTVUZCUnl4TlFVRk5MRVZCUVVVc1RVRkJUU3hGUVVGRkxHRkJRV0VzYVVKQlFXbENMRWRCUVVVc1JVRkJSU3h6UWtGQmIwSXNSVUZCUlN4dFFrRkJiVUlzVTBGQlR5eEhRVUZGTzBsQlFVTXNTVUZCU1N4SlFVRkZMRVZCUVVVc2JVSkJRVzFDTEZGQlFVOHNTVUZCUlN4RFFVRkRPMGxCUVVVc1QwRkJTeXhGUVVGRkxGTkJRVThzU1VGQlJ6dExRVUZETEVsQlFVa3NTVUZCUlN4TlFVRk5MRVZCUVVVc1MwRkJTenRMUVVGRkxFbEJRVWNzUlVGQlJTeE5RVUZMTzB0QlFVMHNSVUZCUlN4TlFVRk5MRk5CUVU4c1lVRkJWeXhGUVVGRkxFdEJRVXNzUjBGQlJ5eEZRVUZGTEUxQlFVMHNVVUZCVVR0SlFVRkRPMGxCUVVNc1NVRkJSU3hOUVVGTkxGRkJRVkU3UzBGQlF5eFZRVUZUTzAxQlFVTXNUVUZCU3p0TlFVRlZMRlZCUVZNN1MwRkJRenRMUVVGRkxHMUNRVUZyUWl4RlFVRkZPMHRCUVd0Q0xHTkJRV0VzUlVGQlJUdEpRVUZaTEVOQlFVTTdTVUZCUlR0SFFVRlJPMGRCUVVNc1NVRkJTU3hKUVVGRkxFMUJRVTBzYlVKQlFXMUNPMGxCUVVNc2IwSkJRVzFDTzBsQlFVVXNZMEZCWVR0SFFVRkRMRU5CUVVNN1IwRkJSU3hKUVVGSExFMUJRVWtzVFVGQlN5eFBRVUZOTEVWQlFVTXNVVUZCVHl4SFFVRkZPMGRCUVVVc1NVRkJTU3hKUVVGRkxFMUJRVTBzZFVKQlFYVkNPMGxCUVVNc1RVRkJTeXhGUVVGRk8wbEJRVXNzWjBKQlFXVXNSVUZCUlR0SlFVRmxMRlZCUVZNc1JVRkJSVHRKUVVGVExHTkJRV0VzUlVGQlJUdEhRVUZaTEVOQlFVTTdSMEZCUlN4TlFVRkpMRXRCUVVzc1RVRkJTU3hKUVVGRkxFMUJRVTBzVVVGQlVUdEpRVUZETEZWQlFWTTdTMEZCUXl4TlFVRkxMRVZCUVVVN1MwRkJTeXhOUVVGTE8wdEJRVlVzVlVGQlV5eERRVUZETEVOQlFVTTdTMEZCUlN4WFFVRlZMRVZCUVVVN1NVRkJVenRKUVVGRkxHMUNRVUZyUWl4RlFVRkZPMGxCUVd0Q0xHTkJRV0VzUlVGQlJUdEhRVUZaTEVOQlFVTTdSVUZCUlR0RFFVRkRMRlZCUVZFN1JVRkJReXhOUVVGTkxFbEJRVWtzUjBGQlJTeE5RVUZOTEVWQlFVVXNVVUZCVVN4SFFVRkZMRTFCUVUwc1dVRkJXU3hEUVVGRE8wTkJRVU03UVVGQlF6dEJRVUZETEdWQlFXVXNZVUZCWVN4SFFVRkZPME5CUVVNc1NVRkJSeXhGUVVGRExGRkJRVThzUjBGQlJTeHRRa0ZCYTBJc1RVRkJSeXhGUVVGRkxGRkJRVThzU1VGQlJTeEZRVUZGTEU5QlFVOHNXVUZCVlN4RFFVRkRPME5CUVVVc1QwRkJUeXhOUVVGTkxIZENRVUYzUWp0RlFVRkRMRTlCUVUwc1NVRkJSU3hKUVVGRkxFdEJRVXM3UlVGQlJTeFJRVUZQTEVsQlFVVXNTMEZCU3l4SlFVRkZPMFZCUVVVc2JVSkJRV3RDTzBWQlFVVXNVVUZCVHl4SlFVRkZMRmRCUVZNN1JVRkJXU3hQUVVGTkxFbEJRVVVzUzBGQlN5eEpRVUZGTEVWQlFVVXNUMEZCVHp0RFFVRkxMRU5CUVVNc1IwRkJSU3hOUVVGTkxEQkNRVUV3UWp0RlFVRkRMRkZCUVU4c1NVRkJSU3h0UTBGQmJVTXNSMEZCUlN4RFFVRkRMRWxCUVVVc2NVTkJRWEZETEVkQlFVVXNRMEZCUXp0RlFVRkZMRzFDUVVGclFqdEZRVUZGTEU5QlFVMHNTVUZCUlN4TFFVRkxMRWxCUVVVc1JVRkJSU3hQUVVGUE8wTkJRVXNzUTBGQlF5eEhRVUZGTEVWQlFVTXNVVUZCVHl4RlFVRkRPMEZCUVVNN1FVRkJReXhsUVVGbExHMUNRVUZ0UWl4SFFVRkZPME5CUVVNc1NVRkJSeXhGUVVGRkxHMUNRVUZ0UWl4VFFVRlBMRWRCUVVVc1QwRkJUeXh0UWtGQmJVSXNSVUZCUlN4dFFrRkJiVUlzVDBGQlR5eERRVUZETEVOQlFVTTdRMEZCUlN4VFFVRlBPMFZCUVVNc1NVRkJTU3hKUVVGRkxFMUJRVTBzUlVGQlJTeGhRVUZoTEV0QlFVczdSVUZCUlN4SlFVRkhMRVZCUVVVc1lVRkJZU3haUVVGWkxFZEJRVVVzUlVGQlJTeE5RVUZMTEU5QlFVODdSVUZCU3l4SlFVRkhMRVZCUVVVc1RVRkJUU3hUUVVGUExGZEJRVlU3UlVGQlV5eEpRVUZKTEVsQlFVVXNSVUZCUlR0RlFVRk5MRk5CUVU4N1IwRkJReXhKUVVGSkxFbEJRVVVzVFVGQlRTeHBRa0ZCYVVJc1JVRkJSU3hoUVVGaExFdEJRVXNzUTBGQlF6dEhRVUZGTEVsQlFVY3NUVUZCU1N4eFFrRkJiVUlzUlVGQlJTeGhRVUZoTEZsQlFWa3NSMEZCUlN4RlFVRkZMRTlCUVUwN1IwRkJUU3hGUVVGRkxFMUJRVTBzVTBGQlR5eGpRVUZaTEVsQlFVVXNiVUpCUVcxQ0xFTkJRVU1zUjBGQlJTeEZRVUZGTEV0QlFVc3NRMEZCUXp0RlFVRkZPMFZCUVVNc1QwRkJUenREUVVGRE8wRkJRVU03UVVGQlF5eE5RVUZOTEcxQ1FVRnBRaXhQUVVGUExHdENRVUZyUWp0QlFVRkZMR1ZCUVdVc2FVSkJRV2xDTEVkQlFVVTdRMEZCUXl4UFFVRlBMRTFCUVUwc1VVRkJVU3hSUVVGUkxFZEJRVVVzVFVGQlRTeFJRVUZSTEV0QlFVc3NRMEZCUXl4SFFVRkZMRkZCUVZFc1VVRkJVU3huUWtGQlowSXNRMEZCUXl4RFFVRkRPMEZCUVVNN1FVRkRhbk5NTEdOQlFXTXNZVUZCWVR0QlFVTXpRaXhYUVVGWExHOUNRVUZ2UWl4SlFVRkpMR2REUVVGblF5eGhRVUZoSW4wPQo="
].join(""), "base64").toString("utf8"), { namespace: "eve72656163742d6578616d706c65" });
//#endregion
//#region .eve/builds/mrp1vvvh-d562e54e-36fd-4538-af24-d6d19af0c971/nitro/workflow/workflows-handler.mjs
var workflows_handler_default = async ({ req }) => {
	return await POST(req);
};
//#endregion
//#region #nitro/virtual/public-assets-data
var public_assets_data_default = {};
//#endregion
//#region #nitro/virtual/public-assets-node
function readAsset(id) {
	const serverDir = dirname(fileURLToPath(globalThis.__nitro_main__));
	return promises.readFile(resolve(serverDir, public_assets_data_default[id].path));
}
//#endregion
//#region #nitro/virtual/public-assets
const publicAssetBases = {};
function isPublicAssetURL(id = "") {
	if (public_assets_data_default[id]) return true;
	for (const base in publicAssetBases) if (id.startsWith(base)) return true;
	return false;
}
function getAsset(id) {
	return public_assets_data_default[id];
}
//#endregion
//#region node_modules/eve/node_modules/nitro/dist/runtime/internal/static.mjs
const METHODS = /* @__PURE__ */ new Set(["HEAD", "GET"]);
const EncodingMap = {
	gzip: ".gz",
	br: ".br",
	zstd: ".zst"
};
var static_default = defineHandler((event) => {
	if (event.req.method && !METHODS.has(event.req.method)) return;
	let id = decodePath(withLeadingSlash(withoutTrailingSlash(event.url.pathname)));
	let asset;
	const encodings = [...(event.req.headers.get("accept-encoding") || "").split(",").map((e) => EncodingMap[e.trim()]).filter(Boolean).sort(), ""];
	for (const encoding of encodings) for (const _id of [id + encoding, joinURL(id, "index.html" + encoding)]) {
		const _asset = getAsset(_id);
		if (_asset) {
			asset = _asset;
			id = _id;
			break;
		}
	}
	if (!asset) {
		if (isPublicAssetURL(id)) {
			event.res.headers.delete("Cache-Control");
			throw new HTTPError({ status: 404 });
		}
		return;
	}
	if (encodings.length > 1) event.res.headers.append("Vary", "Accept-Encoding");
	if (event.req.headers.get("if-none-match") === asset.etag) {
		event.res.status = 304;
		event.res.statusText = "Not Modified";
		return "";
	}
	const ifModifiedSinceH = event.req.headers.get("if-modified-since");
	const mtimeDate = new Date(asset.mtime);
	if (ifModifiedSinceH && asset.mtime && new Date(ifModifiedSinceH) >= mtimeDate) {
		event.res.status = 304;
		event.res.statusText = "Not Modified";
		return "";
	}
	if (asset.type) event.res.headers.set("Content-Type", asset.type);
	if (asset.etag && !event.res.headers.has("ETag")) event.res.headers.set("ETag", asset.etag);
	if (asset.mtime && !event.res.headers.has("Last-Modified")) event.res.headers.set("Last-Modified", mtimeDate.toUTCString());
	if (asset.encoding && !event.res.headers.has("Content-Encoding")) event.res.headers.set("Content-Encoding", asset.encoding);
	if (asset.size > 0 && !event.res.headers.has("Content-Length")) event.res.headers.set("Content-Length", asset.size.toString());
	return readAsset(id);
});
//#endregion
//#region #nitro/virtual/routing
const _lazy_QcZ9FL = defineLazyEventHandler(() => import("./_20.mjs"));
const findRoute = /* @__PURE__ */ (() => {
	const $0 = {
		route: "/",
		method: "GET",
		handler: toEventHandler(_eve_route_default)
	}, $1 = {
		route: "/eve/v1/health",
		method: "GET",
		handler: toEventHandler(health_default$1)
	}, $2 = {
		route: "/eve/v1/health",
		method: "HEAD",
		handler: toEventHandler(health_default)
	}, $3 = {
		route: "/eve/v1/info",
		method: "GET",
		handler: toEventHandler(info_default$1)
	}, $4 = {
		route: "/eve/v1/info",
		method: "OPTIONS",
		handler: toEventHandler(info_default)
	}, $5 = {
		route: "/eve/v1/session",
		method: "POST",
		handler: toEventHandler(session_default$1)
	}, $6 = {
		route: "/eve/v1/session",
		method: "OPTIONS",
		handler: toEventHandler(session_default)
	}, $7 = {
		route: "/.well-known/workflow/v1/flow",
		handler: toEventHandler(workflows_handler_default)
	}, $8 = {
		route: "/eve/v1/connections/:name/callback/:token",
		method: "GET",
		handler: toEventHandler(_token_default$2)
	}, $9 = {
		route: "/eve/v1/connections/:name/callback/:token",
		method: "POST",
		handler: toEventHandler(_token_default$1)
	}, $10 = {
		route: "/eve/v1/callback/:token",
		method: "POST",
		handler: toEventHandler(_token_default)
	}, $11 = {
		route: "/eve/v1/session/:sessionId",
		method: "POST",
		handler: toEventHandler(_sessionId_default$1)
	}, $12 = {
		route: "/eve/v1/session/:sessionId",
		method: "OPTIONS",
		handler: toEventHandler(_sessionId_default)
	}, $13 = {
		route: "/eve/v1/session/:sessionId/cancel",
		method: "POST",
		handler: toEventHandler(cancel_default$1)
	}, $14 = {
		route: "/eve/v1/session/:sessionId/cancel",
		method: "OPTIONS",
		handler: toEventHandler(cancel_default)
	}, $15 = {
		route: "/eve/v1/session/:sessionId/stream",
		method: "GET",
		handler: toEventHandler(stream_default$1)
	}, $16 = {
		route: "/eve/v1/session/:sessionId/stream",
		method: "OPTIONS",
		handler: toEventHandler(stream_default)
	}, $17 = {
		route: "/**",
		handler: _lazy_QcZ9FL
	};
	return (m, p) => {
		if (p.charCodeAt(p.length - 1) === 47) p = p.slice(0, -1) || "/";
		if (p === "/") {
			if (m === "GET") return { data: $0 };
		} else if (p === "/eve/v1/health") {
			if (m === "GET") return { data: $1 };
			if (m === "HEAD") return { data: $2 };
		} else if (p === "/eve/v1/info") {
			if (m === "GET") return { data: $3 };
			if (m === "OPTIONS") return { data: $4 };
		} else if (p === "/eve/v1/session") {
			if (m === "POST") return { data: $5 };
			if (m === "OPTIONS") return { data: $6 };
		} else if (p === "/.well-known/workflow/v1/flow") return { data: $7 };
		let s = p.split("/"), l = s.length;
		if (l > 1) {
			if (s[1] === "eve") {
				if (l > 2) {
					if (s[2] === "v1") {
						if (l > 3) {
							if (s[3] === "connections") {
								if (l > 5) {
									if (s[5] === "callback") {
										if (l === 7 || l === 6) {
											if (m === "GET") {
												if (l > 6) return {
													data: $8,
													params: {
														"name": s[4],
														"token": s[6]
													}
												};
											}
											if (m === "POST") {
												if (l > 6) return {
													data: $9,
													params: {
														"name": s[4],
														"token": s[6]
													}
												};
											}
										}
									}
								}
							} else if (s[3] === "callback") {
								if (l === 5 || l === 4) {
									if (m === "POST") {
										if (l > 4) return {
											data: $10,
											params: { "token": s[4] }
										};
									}
								}
							} else if (s[3] === "session") {
								if (l === 5 || l === 4) {
									if (m === "POST") {
										if (l > 4) return {
											data: $11,
											params: { "sessionId": s[4] }
										};
									}
									if (m === "OPTIONS") {
										if (l > 4) return {
											data: $12,
											params: { "sessionId": s[4] }
										};
									}
								} else if (s[5] === "cancel") {
									if (l === 6) {
										if (m === "POST") return {
											data: $13,
											params: { "sessionId": s[4] }
										};
										if (m === "OPTIONS") return {
											data: $14,
											params: { "sessionId": s[4] }
										};
									}
								} else if (s[5] === "stream") {
									if (l === 6) {
										if (m === "GET") return {
											data: $15,
											params: { "sessionId": s[4] }
										};
										if (m === "OPTIONS") return {
											data: $16,
											params: { "sessionId": s[4] }
										};
									}
								}
							}
						}
					}
				}
			}
		}
		return {
			data: $17,
			params: { "_": s.slice(1).join("/") }
		};
	};
})();
const globalMiddleware = [toEventHandler(static_default)].filter(Boolean);
//#endregion
//#region node_modules/eve/node_modules/nitro/dist/runtime/internal/error/prod.mjs
const errorHandler = (error, event) => {
	const res = defaultHandler(error, event);
	return new NodeResponse(typeof res.body === "string" ? res.body : JSON.stringify(res.body, null, 2), res);
};
function defaultHandler(error, event) {
	const unhandled = error.unhandled ?? !HTTPError.isError(error);
	const { status = 500, statusText = "" } = unhandled ? {} : error;
	if (status === 404) {
		const url = event.url || new URL(event.req.url);
		const baseURL = "/";
		if (/^\/[^/]/.test(baseURL) && !url.pathname.startsWith(baseURL)) return {
			status: 302,
			headers: new Headers({ location: `${baseURL}${url.pathname.slice(1)}${url.search}` })
		};
	}
	const headers = new Headers(unhandled ? {} : error.headers);
	headers.set("content-type", "application/json; charset=utf-8");
	return {
		status,
		statusText,
		headers,
		body: {
			error: true,
			...unhandled ? {
				status,
				unhandled: true
			} : typeof error.toJSON === "function" ? error.toJSON() : {
				status,
				statusText,
				message: error.message
			}
		}
	};
}
//#endregion
//#region #nitro/virtual/error-handler
const errorHandlers = [errorHandler];
async function error_handler_default(error, event) {
	for (const handler of errorHandlers) try {
		const response = await handler(error, event, { defaultHandler });
		if (response) return response;
	} catch (error) {
		console.error(error);
	}
}
//#endregion
//#region .eve/builds/mrp1vvvh-d562e54e-36fd-4538-af24-d6d19af0c971/host/compiled-artifacts-workflow-world.mjs
const workflowWorld = await br({ dataDir: resolveLocalWorkflowWorldDataDirectory(process.cwd()) });
validateWorkflowWorld({
	packageName: void 0,
	world: workflowWorld
});
Zn(workflowWorld);
await Xn();
await workflowWorld.start?.();
function installWorkflowWorldPlugin() {}
//#endregion
//#region #nitro/virtual/plugins
const plugins = [
	installCompiledArtifactsPlugin,
	installWorkflowWorldPlugin,
	sandboxShutdownPlugin
];
//#endregion
//#region #nitro/virtual/app
function createNitroApp() {
	const hooks = new HookableCore();
	const captureError = (error, errorCtx) => {
		const promise = hooks.callHook("error", error, errorCtx)?.catch?.((hookError) => {
			console.error("Error while capturing another error", hookError);
		});
		if (errorCtx?.event) {
			const errors = errorCtx.event.req.context?.nitro?.errors;
			if (errors) errors.push({
				error,
				context: errorCtx
			});
			if (promise && typeof errorCtx.event.req.waitUntil === "function") errorCtx.event.req.waitUntil(promise);
		}
	};
	const h3App = createH3App({ onError(error, event) {
		captureError(error, { event });
		return error_handler_default(error, event);
	} });
	h3App.config.onRequest = (event) => {
		return hooks.callHook("request", event)?.catch?.((error) => {
			captureError(error, {
				event,
				tags: ["request"]
			});
		});
	};
	h3App.config.onResponse = (res, event) => {
		return hooks.callHook("response", res, event)?.catch?.((error) => {
			captureError(error, {
				event,
				tags: ["response"]
			});
		});
	};
	let appHandler = (req) => {
		req.context ||= {};
		req.context.nitro = req.context.nitro || { errors: [] };
		return h3App.fetch(req);
	};
	return {
		fetch: appHandler,
		h3: h3App,
		hooks,
		captureError
	};
}
function initNitroPlugins(app) {
	for (const plugin of plugins) try {
		plugin(app);
	} catch (error) {
		app.captureError?.(error, { tags: ["plugin"] });
		throw error;
	}
	return app;
}
function createH3App(config) {
	const h3App = new H3Core(config);
	h3App["~findRoute"] = (event) => findRoute(event.req.method, event.url.pathname);
	h3App["~middleware"].push(...globalMiddleware);
	return h3App;
}
//#endregion
//#region node_modules/eve/node_modules/nitro/dist/runtime/internal/app.mjs
const APP_ID = "default";
function useNitroApp() {
	let instance = useNitroApp._instance;
	if (instance) return instance;
	instance = useNitroApp._instance = createNitroApp();
	globalThis.__nitro__ = globalThis.__nitro__ || {};
	globalThis.__nitro__[APP_ID] = instance;
	initNitroPlugins(instance);
	return instance;
}
//#endregion
//#region #nitro/virtual/tasks
const scheduledTasks = [{
	"cron": "0 9 * * 1-5",
	"tasks": ["eve.schedule.c2NoZWR1bGVzL2RhaWx5LWNvbXBldGl0aXZlLXNjYW4udHM"]
}, {
	"cron": "0 10 * * 1",
	"tasks": ["eve.schedule.c2NoZWR1bGVzL3dlZWtseS1yZXBvcnQudHM"]
}];
const tasks = {
	"eve.schedule.c2NoZWR1bGVzL2RhaWx5LWNvbXBldGl0aXZlLXNjYW4udHM": {
		meta: { description: "Run eve schedule \"daily-competitive-scan\" from \"schedules/daily-competitive-scan.ts\"." },
		resolve: () => import("../_virtual/eve.schedule.mjs").then((r) => r.default || r)
	},
	"eve.schedule.c2NoZWR1bGVzL3dlZWtseS1yZXBvcnQudHM": {
		meta: { description: "Run eve schedule \"weekly-report\" from \"schedules/weekly-report.ts\"." },
		resolve: () => import("../_virtual/eve2.schedule.mjs").then((r) => r.default || r)
	}
};
//#endregion
//#region node_modules/eve/node_modules/nitro/dist/runtime/internal/task.mjs
const __runningTasks__ = {};
async function runTask(name, { payload = {}, context = {} } = {}) {
	if (__runningTasks__[name]) return __runningTasks__[name];
	if (!(name in tasks)) throw new HTTPError({
		message: `Task \`${name}\` is not available!`,
		status: 404
	});
	if (!tasks[name].resolve) throw new HTTPError({
		message: `Task \`${name}\` is not implemented!`,
		status: 501
	});
	const handler = await tasks[name].resolve();
	const taskEvent = {
		name,
		payload,
		context
	};
	__runningTasks__[name] = handler.run(taskEvent);
	try {
		return await __runningTasks__[name];
	} finally {
		delete __runningTasks__[name];
	}
}
function startScheduleRunner({ waitUntil } = {}) {
	if (!scheduledTasks || scheduledTasks.length === 0 || process.env.TEST) return;
	const payload = { scheduledTime: Date.now() };
	for (const schedule of scheduledTasks) new E(schedule.cron, async () => {
		await Promise.all(schedule.tasks.map((name) => runTask(name, {
			payload,
			context: { waitUntil }
		}).catch((error) => {
			console.error(`Error while running scheduled task "${name}"`, error);
		})));
	});
}
//#endregion
//#region node_modules/eve/node_modules/nitro/dist/runtime/internal/error/hooks.mjs
function _captureError(error, type) {
	console.error(`[${type}]`, error);
	useNitroApp().captureError?.(error, { tags: [type] });
}
function trapUnhandledErrors() {
	process.on("unhandledRejection", (error) => _captureError(error, "unhandledRejection"));
	process.on("uncaughtException", (error) => _captureError(error, "uncaughtException"));
}
//#endregion
//#region #nitro/virtual/tracing
const tracingSrvxPlugins = [];
//#endregion
//#region node_modules/eve/node_modules/nitro/dist/presets/node/runtime/node-server.mjs
const _parsedPort = Number.parseInt(process.env.NITRO_PORT ?? process.env.PORT ?? "");
const port = Number.isNaN(_parsedPort) ? 3e3 : _parsedPort;
const host = process.env.NITRO_HOST || process.env.HOST;
const cert = process.env.NITRO_SSL_CERT;
const key = process.env.NITRO_SSL_KEY;
const nitroApp = useNitroApp();
const server = serve({
	port,
	hostname: host,
	tls: cert && key ? {
		cert,
		key
	} : void 0,
	fetch: nitroApp.fetch,
	plugins: [...tracingSrvxPlugins]
});
trapUnhandledErrors();
startScheduleRunner({ waitUntil: server.waitUntil });
var node_server_default = {};
//#endregion
//#region #nitro/virtual/renderer-template
const rendererTemplate = () => new HTTPResponse("<!doctype html>\n<html lang=\"en\">\n  <head>\n    <meta charset=\"UTF-8\" />\n    <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\" />\n    <title>Reddit Analysis</title>\n  </head>\n  <body>\n    <div id=\"root\"></div>\n    <script type=\"module\" src=\"/src/main.tsx\"><\/script>\n  </body>\n</html>\n\n", { headers: { "content-type": "text/html; charset=utf-8" } });
//#endregion
//#region node_modules/eve/node_modules/nitro/dist/runtime/internal/routes/renderer-template.mjs
function renderIndexHTML(event) {
	return rendererTemplate(event.req);
}
//#endregion
export { downloadFromStorage as a, uploadToStorage as c, buildGenerationStoragePath as i, node_server_default as n, getSupabaseAdmin as o, buildAssetStoragePath as r, isSupabaseConfigured as s, renderIndexHTML as t };
