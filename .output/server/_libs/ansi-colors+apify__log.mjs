import { fileURLToPath as __eveFileURLToPath } from "node:url";
import { dirname as __eveDirname } from "node:path";
__eveDirname(__eveFileURLToPath(import.meta.url));
import { a as __require, t as __commonJSMin } from "../_runtime.mjs";
import { t as require_cjs$1 } from "./apify__consts.mjs";
//#region node_modules/ansi-colors/symbols.js
var require_symbols = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	const isHyper = typeof process !== "undefined" && process.env.TERM_PROGRAM === "Hyper";
	const isWindows = typeof process !== "undefined" && process.platform === "win32";
	const isLinux = typeof process !== "undefined" && process.platform === "linux";
	const common = {
		ballotDisabled: "☒",
		ballotOff: "☐",
		ballotOn: "☑",
		bullet: "•",
		bulletWhite: "◦",
		fullBlock: "█",
		heart: "❤",
		identicalTo: "≡",
		line: "─",
		mark: "※",
		middot: "·",
		minus: "－",
		multiplication: "×",
		obelus: "÷",
		pencilDownRight: "✎",
		pencilRight: "✏",
		pencilUpRight: "✐",
		percent: "%",
		pilcrow2: "❡",
		pilcrow: "¶",
		plusMinus: "±",
		question: "?",
		section: "§",
		starsOff: "☆",
		starsOn: "★",
		upDownArrow: "↕"
	};
	const windows = Object.assign({}, common, {
		check: "√",
		cross: "×",
		ellipsisLarge: "...",
		ellipsis: "...",
		info: "i",
		questionSmall: "?",
		pointer: ">",
		pointerSmall: "»",
		radioOff: "( )",
		radioOn: "(*)",
		warning: "‼"
	});
	const other = Object.assign({}, common, {
		ballotCross: "✘",
		check: "✔",
		cross: "✖",
		ellipsisLarge: "⋯",
		ellipsis: "…",
		info: "ℹ",
		questionFull: "？",
		questionSmall: "﹖",
		pointer: isLinux ? "▸" : "❯",
		pointerSmall: isLinux ? "‣" : "›",
		radioOff: "◯",
		radioOn: "◉",
		warning: "⚠"
	});
	module.exports = isWindows && !isHyper ? windows : other;
	Reflect.defineProperty(module.exports, "common", {
		enumerable: false,
		value: common
	});
	Reflect.defineProperty(module.exports, "windows", {
		enumerable: false,
		value: windows
	});
	Reflect.defineProperty(module.exports, "other", {
		enumerable: false,
		value: other
	});
}));
//#endregion
//#region node_modules/ansi-colors/index.js
var require_ansi_colors = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	const isObject = (val) => val !== null && typeof val === "object" && !Array.isArray(val);
	const ANSI_REGEX = /[\u001b\u009b][[\]#;?()]*(?:(?:(?:[^\W_]*;?[^\W_]*)\u0007)|(?:(?:[0-9]{1,4}(;[0-9]{0,4})*)?[~0-9=<>cf-nqrtyA-PRZ]))/g;
	const hasColor = () => {
		if (typeof process !== "undefined") return process.env.FORCE_COLOR !== "0";
		return false;
	};
	const create = () => {
		const colors = {
			enabled: hasColor(),
			visible: true,
			styles: {},
			keys: {}
		};
		const ansi = (style) => {
			let open = style.open = `\u001b[${style.codes[0]}m`;
			let close = style.close = `\u001b[${style.codes[1]}m`;
			let regex = style.regex = new RegExp(`\\u001b\\[${style.codes[1]}m`, "g");
			style.wrap = (input, newline) => {
				if (input.includes(close)) input = input.replace(regex, close + open);
				let output = open + input + close;
				return newline ? output.replace(/\r*\n/g, `${close}$&${open}`) : output;
			};
			return style;
		};
		const wrap = (style, input, newline) => {
			return typeof style === "function" ? style(input) : style.wrap(input, newline);
		};
		const style = (input, stack) => {
			if (input === "" || input == null) return "";
			if (colors.enabled === false) return input;
			if (colors.visible === false) return "";
			let str = "" + input;
			let nl = str.includes("\n");
			let n = stack.length;
			if (n > 0 && stack.includes("unstyle")) stack = [.../* @__PURE__ */ new Set(["unstyle", ...stack])].reverse();
			while (n-- > 0) str = wrap(colors.styles[stack[n]], str, nl);
			return str;
		};
		const define = (name, codes, type) => {
			colors.styles[name] = ansi({
				name,
				codes
			});
			(colors.keys[type] || (colors.keys[type] = [])).push(name);
			Reflect.defineProperty(colors, name, {
				configurable: true,
				enumerable: true,
				set(value) {
					colors.alias(name, value);
				},
				get() {
					let color = (input) => style(input, color.stack);
					Reflect.setPrototypeOf(color, colors);
					color.stack = this.stack ? this.stack.concat(name) : [name];
					return color;
				}
			});
		};
		define("reset", [0, 0], "modifier");
		define("bold", [1, 22], "modifier");
		define("dim", [2, 22], "modifier");
		define("italic", [3, 23], "modifier");
		define("underline", [4, 24], "modifier");
		define("inverse", [7, 27], "modifier");
		define("hidden", [8, 28], "modifier");
		define("strikethrough", [9, 29], "modifier");
		define("black", [30, 39], "color");
		define("red", [31, 39], "color");
		define("green", [32, 39], "color");
		define("yellow", [33, 39], "color");
		define("blue", [34, 39], "color");
		define("magenta", [35, 39], "color");
		define("cyan", [36, 39], "color");
		define("white", [37, 39], "color");
		define("gray", [90, 39], "color");
		define("grey", [90, 39], "color");
		define("bgBlack", [40, 49], "bg");
		define("bgRed", [41, 49], "bg");
		define("bgGreen", [42, 49], "bg");
		define("bgYellow", [43, 49], "bg");
		define("bgBlue", [44, 49], "bg");
		define("bgMagenta", [45, 49], "bg");
		define("bgCyan", [46, 49], "bg");
		define("bgWhite", [47, 49], "bg");
		define("blackBright", [90, 39], "bright");
		define("redBright", [91, 39], "bright");
		define("greenBright", [92, 39], "bright");
		define("yellowBright", [93, 39], "bright");
		define("blueBright", [94, 39], "bright");
		define("magentaBright", [95, 39], "bright");
		define("cyanBright", [96, 39], "bright");
		define("whiteBright", [97, 39], "bright");
		define("bgBlackBright", [100, 49], "bgBright");
		define("bgRedBright", [101, 49], "bgBright");
		define("bgGreenBright", [102, 49], "bgBright");
		define("bgYellowBright", [103, 49], "bgBright");
		define("bgBlueBright", [104, 49], "bgBright");
		define("bgMagentaBright", [105, 49], "bgBright");
		define("bgCyanBright", [106, 49], "bgBright");
		define("bgWhiteBright", [107, 49], "bgBright");
		colors.ansiRegex = ANSI_REGEX;
		colors.hasColor = colors.hasAnsi = (str) => {
			colors.ansiRegex.lastIndex = 0;
			return typeof str === "string" && str !== "" && colors.ansiRegex.test(str);
		};
		colors.alias = (name, color) => {
			let fn = typeof color === "string" ? colors[color] : color;
			if (typeof fn !== "function") throw new TypeError("Expected alias to be the name of an existing color (string) or a function");
			if (!fn.stack) {
				Reflect.defineProperty(fn, "name", { value: name });
				colors.styles[name] = fn;
				fn.stack = [name];
			}
			Reflect.defineProperty(colors, name, {
				configurable: true,
				enumerable: true,
				set(value) {
					colors.alias(name, value);
				},
				get() {
					let color = (input) => style(input, color.stack);
					Reflect.setPrototypeOf(color, colors);
					color.stack = this.stack ? this.stack.concat(fn.stack) : fn.stack;
					return color;
				}
			});
		};
		colors.theme = (custom) => {
			if (!isObject(custom)) throw new TypeError("Expected theme to be an object");
			for (let name of Object.keys(custom)) colors.alias(name, custom[name]);
			return colors;
		};
		colors.alias("unstyle", (str) => {
			if (typeof str === "string" && str !== "") {
				colors.ansiRegex.lastIndex = 0;
				return str.replace(colors.ansiRegex, "");
			}
			return "";
		});
		colors.alias("noop", (str) => str);
		colors.none = colors.clear = colors.noop;
		colors.stripColor = colors.unstyle;
		colors.symbols = require_symbols();
		colors.define = define;
		return colors;
	};
	module.exports = create();
	module.exports.create = create;
}));
//#endregion
//#region node_modules/@apify/log/cjs/index.cjs
var require_cjs = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var __create = Object.create;
	var __defProp = Object.defineProperty;
	var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
	var __getOwnPropNames = Object.getOwnPropertyNames;
	var __getProtoOf = Object.getPrototypeOf;
	var __hasOwnProp = Object.prototype.hasOwnProperty;
	var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, {
		enumerable: true,
		configurable: true,
		writable: true,
		value
	}) : obj[key] = value;
	var __name = (target, value) => __defProp(target, "name", {
		value,
		configurable: true
	});
	var __export = (target, all) => {
		for (var name in all) __defProp(target, name, {
			get: all[name],
			enumerable: true
		});
	};
	var __copyProps = (to, from, except, desc) => {
		if (from && typeof from === "object" || typeof from === "function") {
			for (let key of __getOwnPropNames(from)) if (!__hasOwnProp.call(to, key) && key !== except) __defProp(to, key, {
				get: () => from[key],
				enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable
			});
		}
		return to;
	};
	var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", {
		value: mod,
		enumerable: true
	}) : target, mod));
	var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
	var __publicField = (obj, key, value) => __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
	var index_exports = {};
	__export(index_exports, {
		IS_APIFY_LOGGER_EXCEPTION: () => IS_APIFY_LOGGER_EXCEPTION,
		LEVELS: () => LEVELS,
		LEVEL_TO_STRING: () => LEVEL_TO_STRING,
		Log: () => Log,
		LogFormat: () => LogFormat,
		LogLevel: () => LogLevel,
		Logger: () => Logger,
		LoggerJson: () => LoggerJson,
		LoggerText: () => LoggerText,
		PREFERRED_API_ERROR_FIELDS: () => PREFERRED_API_ERROR_FIELDS,
		PREFERRED_DATA_FIELDS: () => PREFERRED_DATA_FIELDS,
		PREFERRED_ERROR_FIELDS: () => PREFERRED_ERROR_FIELDS,
		PREFERRED_FIELDS: () => PREFERRED_FIELDS,
		PREFERRED_HTTP_FIELDS: () => PREFERRED_HTTP_FIELDS,
		PREFERRED_ID_FIELDS: () => PREFERRED_ID_FIELDS,
		PREFIX_DELIMITER: () => PREFIX_DELIMITER,
		TRUNCATION_FLAG_KEY: () => TRUNCATION_FLAG_KEY,
		TRUNCATION_SUFFIX: () => TRUNCATION_SUFFIX,
		default: () => index_default,
		getFormatFromEnv: () => getFormatFromEnv,
		getLevelFromEnv: () => getLevelFromEnv,
		sanitizeData: () => sanitizeData,
		truncate: () => truncate
	});
	module.exports = __toCommonJS(index_exports);
	var LogLevel = /* @__PURE__ */ ((LogLevel2) => {
		LogLevel2[LogLevel2["OFF"] = 0] = "OFF";
		LogLevel2[LogLevel2["ERROR"] = 1] = "ERROR";
		LogLevel2[LogLevel2["SOFT_FAIL"] = 2] = "SOFT_FAIL";
		LogLevel2[LogLevel2["WARNING"] = 3] = "WARNING";
		LogLevel2[LogLevel2["INFO"] = 4] = "INFO";
		LogLevel2[LogLevel2["DEBUG"] = 5] = "DEBUG";
		LogLevel2[LogLevel2["PERF"] = 6] = "PERF";
		return LogLevel2;
	})(LogLevel || {});
	var LEVELS = LogLevel;
	var LEVEL_TO_STRING = Object.keys(LogLevel).filter((x) => Number.isNaN(+x));
	var LogFormat = /* @__PURE__ */ ((LogFormat2) => {
		LogFormat2["JSON"] = "JSON";
		LogFormat2["TEXT"] = "TEXT";
		return LogFormat2;
	})(LogFormat || {});
	var IS_APIFY_LOGGER_EXCEPTION = /* @__PURE__ */ Symbol("apify.processed_error");
	var PREFIX_DELIMITER = ":";
	var TRUNCATION_FLAG_KEY = "[TRUNCATED]";
	var TRUNCATION_SUFFIX = "...[truncated]";
	var PREFERRED_ID_FIELDS = [
		"_id",
		"id",
		"userId",
		"impersonatedUserId",
		"impersonatingUserId",
		"adminUserId",
		"actorId",
		"actorTaskId",
		"taskId",
		"buildId",
		"buildNumber",
		"runId"
	];
	var PREFERRED_ERROR_FIELDS = [
		"name",
		"message",
		"stack",
		"cause"
	];
	var PREFERRED_HTTP_FIELDS = [
		"url",
		"method",
		"code",
		"status",
		"statusCode",
		"statusText"
	];
	var PREFERRED_API_ERROR_FIELDS = [
		"errorCode",
		"errorMessage",
		"errorResponse"
	];
	var PREFERRED_DATA_FIELDS = [
		"response",
		"request",
		"data",
		"payload",
		"details",
		"exception",
		"config",
		"headers"
	];
	var PREFERRED_FIELDS = [
		...PREFERRED_ID_FIELDS,
		...PREFERRED_ERROR_FIELDS,
		...PREFERRED_HTTP_FIELDS,
		...PREFERRED_API_ERROR_FIELDS,
		...PREFERRED_DATA_FIELDS
	];
	var import_consts = require_cjs$1();
	function truncate(str, maxLength, suffix = TRUNCATION_SUFFIX) {
		maxLength = Math.floor(maxLength);
		if (suffix.length > maxLength) throw new Error("suffix string cannot be longer than maxLength");
		if (typeof str === "string" && str.length > maxLength) str = str.substr(0, maxLength - suffix.length) + suffix;
		return str;
	}
	__name(truncate, "truncate");
	function getLevelFromEnv() {
		const envVar = process.env[import_consts.APIFY_ENV_VARS.LOG_LEVEL];
		if (!envVar) return 4;
		if (Number.isFinite(+envVar)) return +envVar;
		if (LogLevel[envVar]) return LogLevel[envVar];
		return +envVar;
	}
	__name(getLevelFromEnv, "getLevelFromEnv");
	function getFormatFromEnv() {
		const envVar = process.env[import_consts.APIFY_ENV_VARS.LOG_FORMAT] || "TEXT";
		switch (envVar.toLowerCase()) {
			case "JSON".toLowerCase(): return "JSON";
			case "TEXT".toLowerCase(): return "TEXT";
			default:
				console.warn(`Unknown value for environment variable ${import_consts.APIFY_ENV_VARS.LOG_FORMAT}: ${envVar}`);
				return "TEXT";
		}
	}
	__name(getFormatFromEnv, "getFormatFromEnv");
	function sanitizeData(data, options) {
		const { maxDepth = Infinity, gradualLimitFactor = 1, maxStringLength = Infinity, maxArrayLength = Infinity, maxFields = Infinity, preferredFieldsMap = {}, truncationSuffix = TRUNCATION_SUFFIX, truncationFlagKey = TRUNCATION_FLAG_KEY } = options;
		if (typeof data === "string") return data.length > maxStringLength ? truncate(data, maxStringLength, truncationSuffix) : data;
		if ([
			"number",
			"boolean",
			"symbol",
			"bigint"
		].includes(typeof data) || data == null || data instanceof Date) return data;
		if (data instanceof Error) {
			const { name, message, stack, cause, ...rest } = data;
			data = {
				name,
				message,
				stack,
				cause,
				...rest,
				[IS_APIFY_LOGGER_EXCEPTION]: true
			};
		}
		const nextCall = /* @__PURE__ */ __name((dat) => sanitizeData(dat, {
			...options,
			maxDepth: maxDepth - 1,
			maxStringLength: Math.max(Math.floor(maxStringLength * gradualLimitFactor), truncationSuffix.length),
			maxArrayLength: Math.floor(maxArrayLength * gradualLimitFactor),
			maxFields: Math.floor(maxFields * gradualLimitFactor)
		}), "nextCall");
		if (Array.isArray(data)) {
			if (maxDepth <= 0) return "[array]";
			const sanitized = data.slice(0, maxArrayLength).map(nextCall);
			if (data.length > maxArrayLength) sanitized.push(truncationSuffix);
			return sanitized;
		}
		if (typeof data === "object" && data !== null) {
			if (maxDepth <= 0) return "[object]";
			const allKeys = Reflect.ownKeys(data);
			allKeys.sort((a, b) => {
				const aIndex = preferredFieldsMap[String(a)] ?? -1;
				const bIndex = preferredFieldsMap[String(b)] ?? -1;
				if (aIndex === -1 && bIndex === -1) return 0;
				if (aIndex === -1) return 1;
				if (bIndex === -1) return -1;
				return aIndex - bIndex;
			});
			const sanitized = {};
			allKeys.slice(0, maxFields).forEach((key) => {
				sanitized[key] = nextCall(data[key]);
			});
			if (allKeys.length > maxFields) sanitized[truncationFlagKey] = true;
			return sanitized;
		}
		if (typeof data === "function") return "[function]";
		console.log(`WARNING: Object cannot be logged: ${data}`);
	}
	__name(sanitizeData, "sanitizeData");
	var import_node_events = __require("events");
	var _Logger = class _Logger extends import_node_events.EventEmitter {
		constructor(options) {
			super();
			this.options = options;
		}
		setOptions(options) {
			this.options = {
				...this.options,
				...options
			};
		}
		getOptions() {
			return this.options;
		}
		_outputWithConsole(level, line) {
			switch (level) {
				case 1:
					console.error(line);
					break;
				case 3:
					console.warn(line);
					break;
				case 5:
					console.debug(line);
					break;
				default: console.log(line);
			}
		}
		_log(level, message, data, exception, opts = {}) {
			throw new Error("log() method must be implemented!");
		}
		log(level, message, ...args) {
			const line = this._log(level, message, ...args);
			this.emit("line", line);
		}
	};
	__name(_Logger, "Logger");
	var Logger = _Logger;
	var DEFAULT_OPTIONS = {
		skipLevelInfo: false,
		skipTime: false
	};
	var _LoggerJson = class _LoggerJson extends Logger {
		constructor(options = {}) {
			super({
				...DEFAULT_OPTIONS,
				...options
			});
		}
		_log(level, message, data, exception, opts = {}) {
			const { prefix, suffix } = opts;
			if (exception) data = {
				...data,
				exception
			};
			if (prefix) message = `${prefix}${PREFIX_DELIMITER} ${message}`;
			if (suffix) message = `${message} ${suffix}`;
			const rec = {
				time: !this.options.skipTime ? /* @__PURE__ */ new Date() : void 0,
				level: this.options.skipLevelInfo && level === 4 ? void 0 : LogLevel[level],
				msg: message,
				...data
			};
			const line = JSON.stringify(rec);
			this._outputWithConsole(level, line);
			return line;
		}
	};
	__name(_LoggerJson, "LoggerJson");
	var LoggerJson = _LoggerJson;
	var import_ansi_colors2 = __toESM(require_ansi_colors());
	var import_ansi_colors = __toESM(require_ansi_colors());
	function identicalSequenceRange(a, b) {
		for (let i = 0; i < a.length - 3; i++) {
			const pos = b.indexOf(a[i]);
			if (pos !== -1) {
				const rest = b.length - pos;
				if (rest > 3) {
					let len = 1;
					const maxLen = Math.min(a.length - i, rest);
					while (maxLen > len && a[i + len] === b[pos + len]) len++;
					if (len > 3) return {
						len,
						offset: i
					};
				}
			}
		}
		return {
			len: 0,
			offset: 0
		};
	}
	__name(identicalSequenceRange, "identicalSequenceRange");
	function getStackString(error) {
		return error.stack ? String(error.stack) : Error.prototype.toString.call(error);
	}
	__name(getStackString, "getStackString");
	function getStackFrames(err, stack) {
		const frames = stack.split("\n");
		let cause;
		try {
			({cause} = err);
		} catch {}
		if (cause != null && typeof cause === "object" && IS_APIFY_LOGGER_EXCEPTION in cause) {
			const causeStack = getStackString(cause);
			const causeStackStart = causeStack.indexOf("\n    at");
			if (causeStackStart !== -1) {
				const { len, offset } = identicalSequenceRange(frames, causeStack.slice(causeStackStart + 1).split("\n"));
				if (len > 0) {
					const skipped = len - 2;
					const msg = `    ... ${skipped} lines matching cause stack trace ...`;
					frames.splice(offset + 1, skipped, import_ansi_colors.default.grey(msg));
				}
			}
		}
		return frames;
	}
	__name(getStackFrames, "getStackFrames");
	var SHORTEN_LEVELS = {
		SOFT_FAIL: "SFAIL",
		WARNING: "WARN"
	};
	var LEVEL_TO_COLOR = {
		[1]: "red",
		[2]: "red",
		[3]: "yellow",
		[4]: "green",
		[5]: "blue",
		[6]: "magenta"
	};
	var SHORTENED_LOG_LEVELS = LEVEL_TO_STRING.map((level) => SHORTEN_LEVELS[level] || level);
	var MAX_LEVEL_LENGTH_SPACES = Math.max(...SHORTENED_LOG_LEVELS.map((l) => l.length));
	var getLevelIndent = /* @__PURE__ */ __name((level) => {
		let spaces = "";
		for (let i = 0; i < MAX_LEVEL_LENGTH_SPACES - level.length; i++) spaces += " ";
		return spaces;
	}, "getLevelIndent");
	var DEFAULT_OPTIONS2 = { skipTime: true };
	var _LoggerText = class _LoggerText extends Logger {
		constructor(options = {}) {
			super({
				...DEFAULT_OPTIONS2,
				...options
			});
		}
		_log(level, message, data, exception, opts = {}) {
			let { prefix, suffix } = opts;
			let maybeDate = "";
			if (!this.options.skipTime) maybeDate = `${(/* @__PURE__ */ new Date()).toISOString().replace("Z", "").replace("T", " ")} `;
			const errStack = exception ? this._parseException(exception) : "";
			const color = LEVEL_TO_COLOR[level];
			const levelStr = SHORTENED_LOG_LEVELS[level];
			const levelIndent = getLevelIndent(levelStr);
			const dataStr = !data ? "" : ` ${JSON.stringify(data)}`;
			prefix = prefix ? ` ${prefix}${PREFIX_DELIMITER}` : "";
			suffix = suffix ? ` ${suffix}` : "";
			const line = `${import_ansi_colors2.default.gray(maybeDate)}${import_ansi_colors2.default[color](levelStr)}${levelIndent}${import_ansi_colors2.default.yellow(prefix)} ${message || ""}${import_ansi_colors2.default.gray(dataStr)}${import_ansi_colors2.default.yellow(suffix)}${errStack}`;
			this._outputWithConsole(level, line);
			return line;
		}
		_parseException(exception, indentLevel = 1) {
			if ([
				"string",
				"boolean",
				"number",
				"undefined",
				"bigint"
			].includes(typeof exception)) return `
${exception}`;
			if (exception === null) return "\nnull";
			if (typeof exception === "symbol") return `
${exception.toString()}`;
			if (typeof exception === "object" && IS_APIFY_LOGGER_EXCEPTION in exception) return this._parseLoggerException(exception, indentLevel);
			return `
${JSON.stringify(exception, null, 2)}`;
		}
		_parseLoggerException(exception, indentLevel = 1) {
			const errDetails = [];
			if (exception.type) errDetails.push(`type=${exception.type}`);
			if (exception.details) Object.entries(exception.details).map(([key, val]) => errDetails.push(`${key}=${val}`));
			const errorString = exception.stack || exception.reason || exception.message;
			const isStack = errorString === exception.stack;
			const errorLines = getStackFrames(exception, errorString);
			if (isStack) errorLines[0] = exception.message || errorLines[0];
			if (errDetails.length) errorLines[0] += import_ansi_colors2.default.gray(`(details: ${errDetails.join(", ")})`);
			for (let i = 1; i < errorLines.length; i++) errorLines[i] = import_ansi_colors2.default.gray(errorLines[i]);
			if (exception.cause) {
				const causeLines = this._parseException(exception.cause, indentLevel + 1).trim().split("\n");
				errorLines.push(import_ansi_colors2.default.red(`  CAUSE: ${import_ansi_colors2.default.reset(causeLines[0])}`), ...causeLines.slice(1));
			}
			return `
${errorLines.map((line) => `${" ".repeat(indentLevel * 2)}${line}`).join("\n")}`;
		}
	};
	__name(_LoggerText, "LoggerText");
	var LoggerText = _LoggerText;
	var getLoggerForFormat = /* @__PURE__ */ __name((format) => {
		switch (format) {
			case "JSON": return new LoggerJson();
			default: return new LoggerText();
		}
	}, "getLoggerForFormat");
	var getDefaultOptions = /* @__PURE__ */ __name(() => ({
		level: getLevelFromEnv(),
		maxDepth: 4,
		gradualLimitFactor: 1 / 2,
		maxStringLength: 1e3,
		maxArrayLength: 500,
		maxFields: 20,
		preferredFields: [...PREFERRED_FIELDS],
		prefix: null,
		suffix: null,
		truncationSuffix: TRUNCATION_SUFFIX,
		truncationFlagKey: TRUNCATION_FLAG_KEY,
		logger: getLoggerForFormat(getFormatFromEnv()),
		data: {}
	}), "getDefaultOptions");
	var _Log = class _Log {
		constructor(options = {}) {
			/**
			* Map of available log levels that's useful for easy setting of appropriate log levels.
			* Each log level is represented internally by a number. Eg. `log.LEVELS.DEBUG === 5`.
			*/
			__publicField(this, "LEVELS", LogLevel);
			__publicField(this, "options");
			/** Maps preferred fields to their index for faster lookup */
			__publicField(this, "preferredFieldsMap");
			__publicField(this, "warningsOnceLogged", /* @__PURE__ */ new Set());
			this.options = {
				...getDefaultOptions(),
				...options
			};
			if (!LogLevel[this.options.level]) throw new Error("Options \"level\" must be one of log.LEVELS enum!");
			if (typeof this.options.maxDepth !== "number") throw new Error("Options \"maxDepth\" must be a number!");
			if (typeof this.options.gradualLimitFactor !== "number") throw new Error("Options \"gradualLimitFactor\" must be a number!");
			if (typeof this.options.maxStringLength !== "number") throw new Error("Options \"maxStringLength\" must be a number!");
			if (typeof this.options.maxArrayLength !== "number") throw new Error("Options \"maxArrayLength\" must be a number!");
			if (typeof this.options.maxFields !== "number") throw new Error("Options \"maxFields\" must be a number!");
			if (!Array.isArray(this.options.preferredFields)) throw new Error("Options \"preferredFields\" must be an array!");
			if (this.options.prefix && typeof this.options.prefix !== "string") throw new Error("Options \"prefix\" must be a string!");
			if (this.options.suffix && typeof this.options.suffix !== "string") throw new Error("Options \"suffix\" must be a string!");
			if (typeof this.options.truncationSuffix !== "string") throw new Error("Options \"truncationSuffix\" must be a string!");
			if (typeof this.options.truncationFlagKey !== "string") throw new Error("Options \"truncationFlagKey\" must be a string!");
			if (typeof this.options.logger !== "object") throw new Error("Options \"logger\" must be an object!");
			if (typeof this.options.data !== "object") throw new Error("Options \"data\" must be an object!");
			this.preferredFieldsMap = Object.fromEntries(this.options.preferredFields.map((field, index) => [field, index]));
		}
		_sanitizeData(obj) {
			return sanitizeData(obj, {
				maxDepth: this.options.maxDepth,
				gradualLimitFactor: this.options.gradualLimitFactor,
				maxStringLength: this.options.maxStringLength,
				maxArrayLength: this.options.maxArrayLength,
				maxFields: this.options.maxFields,
				preferredFieldsMap: this.preferredFieldsMap,
				truncationSuffix: this.options.truncationSuffix,
				truncationFlagKey: this.options.truncationFlagKey
			});
		}
		/**
		* Returns the currently selected logging level. This is useful for checking whether a message
		* will actually be printed to the console before one actually performs a resource intensive operation
		* to construct the message, such as querying a DB for some metadata that need to be added. If the log
		* level is not high enough at the moment, it doesn't make sense to execute the query.
		*/
		getLevel() {
			return this.options.level;
		}
		/**
		* Sets the log level to the given value, preventing messages from less important log levels
		* from being printed to the console. Use in conjunction with the `log.LEVELS` constants such as
		*
		* ```
		* log.setLevel(log.LEVELS.DEBUG);
		* ```
		*
		* Default log level is INFO.
		*/
		setLevel(level) {
			if (!LogLevel[level]) throw new Error("Options \"level\" must be one of log.LEVELS enum!");
			this.options.level = level;
		}
		internal(level, message, data, exception) {
			if (level > this.options.level) return;
			data = {
				...this.options.data,
				...data
			};
			data = Reflect.ownKeys(data).length > 0 ? this._sanitizeData(data) : void 0;
			exception = this._sanitizeData(exception);
			this.options.logger.log(level, message, data, exception, {
				prefix: this.options.prefix,
				suffix: this.options.suffix
			});
		}
		/**
		* Configures logger.
		*/
		setOptions(options) {
			this.options = {
				...this.options,
				...options
			};
		}
		/**
		* Returns the logger configuration.
		*/
		getOptions() {
			return { ...this.options };
		}
		/**
		* Creates a new instance of logger that inherits settings from a parent logger.
		*/
		child(options) {
			let { prefix } = this.options;
			if (options.prefix) prefix = prefix ? `${prefix}${PREFIX_DELIMITER}${options.prefix}` : options.prefix;
			const data = options.data ? {
				...this.options.data,
				...options.data
			} : this.options.data;
			const newOptions = {
				...this.options,
				...options,
				prefix,
				data
			};
			return new _Log(newOptions);
		}
		/**
		* Logs an `ERROR` message. Use this method to log error messages that are not directly connected
		* to an exception. For logging exceptions, use the `log.exception` method.
		*/
		error(message, data) {
			this.internal(1, message, data);
		}
		/**
		* Logs an `ERROR` level message with a nicely formatted exception. Note that the exception is the first parameter
		* here and an additional message is only optional.
		*/
		exception(exception, message, data) {
			this.internal(1, message, data, exception);
		}
		softFail(message, data) {
			this.internal(2, message, data);
		}
		/**
		* Logs a `WARNING` level message. Data are stringified and appended to the message.
		*/
		warning(message, data) {
			this.internal(3, message, data);
		}
		/**
		* Logs an `INFO` message. `INFO` is the default log level so info messages will be always logged,
		* unless the log level is changed. Data are stringified and appended to the message.
		*/
		info(message, data) {
			this.internal(4, message, data);
		}
		/**
		* Logs a `DEBUG` message. By default, it will not be written to the console. To see `DEBUG`
		* messages in the console, set the log level to `DEBUG` either using the `log.setLevel(log.LEVELS.DEBUG)`
		* method or using the environment variable `APIFY_LOG_LEVEL=DEBUG`. Data are stringified and appended
		* to the message.
		*/
		debug(message, data) {
			this.internal(5, message, data);
		}
		perf(message, data) {
			this.internal(6, message, data);
		}
		/**
		* Logs a `WARNING` level message only once.
		*/
		warningOnce(message) {
			if (this.warningsOnceLogged.has(message)) return;
			this.warningsOnceLogged.add(message);
			this.warning(message);
		}
		/**
		* Logs given message only once as WARNING. It's used to warn user that some feature he is using has been deprecated.
		*/
		deprecated(message) {
			this.warningOnce(message);
		}
	};
	__name(_Log, "Log");
	var Log = _Log;
	var index_default = new Log();
	0 && (module.exports = {
		IS_APIFY_LOGGER_EXCEPTION,
		LEVELS,
		LEVEL_TO_STRING,
		Log,
		LogFormat,
		LogLevel,
		Logger,
		LoggerJson,
		LoggerText,
		PREFERRED_API_ERROR_FIELDS,
		PREFERRED_DATA_FIELDS,
		PREFERRED_ERROR_FIELDS,
		PREFERRED_FIELDS,
		PREFERRED_HTTP_FIELDS,
		PREFERRED_ID_FIELDS,
		PREFIX_DELIMITER,
		TRUNCATION_FLAG_KEY,
		TRUNCATION_SUFFIX,
		getFormatFromEnv,
		getLevelFromEnv,
		sanitizeData,
		truncate
	});
}));
//#endregion
export { require_ansi_colors as n, require_cjs as t };
