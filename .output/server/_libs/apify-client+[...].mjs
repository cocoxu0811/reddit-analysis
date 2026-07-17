import { fileURLToPath as __eveFileURLToPath } from "node:url";
import { dirname as __eveDirname } from "node:path";
__eveDirname(__eveFileURLToPath(import.meta.url));
import { a as __require, n as __esmMin, o as __toCommonJS, r as __exportAll, s as __toESM, t as __commonJSMin } from "../_runtime.mjs";
import { r as require_retry } from "./@google/genai+[...].mjs";
import { t as require_dist$2 } from "./sindresorhus__is.mjs";
import { t as require_cjs } from "./apify__consts.mjs";
import { n as require_ansi_colors, t as require_cjs$1 } from "./ansi-colors+apify__log.mjs";
import { t as require_cjs$2 } from "./apify__utilities.mjs";
import process$1 from "node:process";
import os from "node:os";
import tty from "node:tty";
//#region node_modules/ms/index.js
var require_ms = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	/**
	* Helpers.
	*/
	var s = 1e3;
	var m = s * 60;
	var h = m * 60;
	var d = h * 24;
	var w = d * 7;
	var y = d * 365.25;
	/**
	* Parse or format the given `val`.
	*
	* Options:
	*
	*  - `long` verbose formatting [false]
	*
	* @param {String|Number} val
	* @param {Object} [options]
	* @throws {Error} throw an error if val is not a non-empty string or a number
	* @return {String|Number}
	* @api public
	*/
	module.exports = function(val, options) {
		options = options || {};
		var type = typeof val;
		if (type === "string" && val.length > 0) return parse(val);
		else if (type === "number" && isFinite(val)) return options.long ? fmtLong(val) : fmtShort(val);
		throw new Error("val is not a non-empty string or a valid number. val=" + JSON.stringify(val));
	};
	/**
	* Parse the given `str` and return milliseconds.
	*
	* @param {String} str
	* @return {Number}
	* @api private
	*/
	function parse(str) {
		str = String(str);
		if (str.length > 100) return;
		var match = /^(-?(?:\d+)?\.?\d+) *(milliseconds?|msecs?|ms|seconds?|secs?|s|minutes?|mins?|m|hours?|hrs?|h|days?|d|weeks?|w|years?|yrs?|y)?$/i.exec(str);
		if (!match) return;
		var n = parseFloat(match[1]);
		switch ((match[2] || "ms").toLowerCase()) {
			case "years":
			case "year":
			case "yrs":
			case "yr":
			case "y": return n * y;
			case "weeks":
			case "week":
			case "w": return n * w;
			case "days":
			case "day":
			case "d": return n * d;
			case "hours":
			case "hour":
			case "hrs":
			case "hr":
			case "h": return n * h;
			case "minutes":
			case "minute":
			case "mins":
			case "min":
			case "m": return n * m;
			case "seconds":
			case "second":
			case "secs":
			case "sec":
			case "s": return n * s;
			case "milliseconds":
			case "millisecond":
			case "msecs":
			case "msec":
			case "ms": return n;
			default: return;
		}
	}
	/**
	* Short format for `ms`.
	*
	* @param {Number} ms
	* @return {String}
	* @api private
	*/
	function fmtShort(ms) {
		var msAbs = Math.abs(ms);
		if (msAbs >= d) return Math.round(ms / d) + "d";
		if (msAbs >= h) return Math.round(ms / h) + "h";
		if (msAbs >= m) return Math.round(ms / m) + "m";
		if (msAbs >= s) return Math.round(ms / s) + "s";
		return ms + "ms";
	}
	/**
	* Long format for `ms`.
	*
	* @param {Number} ms
	* @return {String}
	* @api private
	*/
	function fmtLong(ms) {
		var msAbs = Math.abs(ms);
		if (msAbs >= d) return plural(ms, msAbs, d, "day");
		if (msAbs >= h) return plural(ms, msAbs, h, "hour");
		if (msAbs >= m) return plural(ms, msAbs, m, "minute");
		if (msAbs >= s) return plural(ms, msAbs, s, "second");
		return ms + " ms";
	}
	/**
	* Pluralization helper.
	*/
	function plural(ms, msAbs, n, name) {
		var isPlural = msAbs >= n * 1.5;
		return Math.round(ms / n) + " " + name + (isPlural ? "s" : "");
	}
}));
//#endregion
//#region node_modules/debug/src/common.js
var require_common = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	/**
	* This is the common logic for both the Node.js and web browser
	* implementations of `debug()`.
	*/
	function setup(env) {
		createDebug.debug = createDebug;
		createDebug.default = createDebug;
		createDebug.coerce = coerce;
		createDebug.disable = disable;
		createDebug.enable = enable;
		createDebug.enabled = enabled;
		createDebug.humanize = require_ms();
		createDebug.destroy = destroy;
		Object.keys(env).forEach((key) => {
			createDebug[key] = env[key];
		});
		/**
		* The currently active debug mode names, and names to skip.
		*/
		createDebug.names = [];
		createDebug.skips = [];
		/**
		* Map of special "%n" handling functions, for the debug "format" argument.
		*
		* Valid key names are a single, lower or upper-case letter, i.e. "n" and "N".
		*/
		createDebug.formatters = {};
		/**
		* Selects a color for a debug namespace
		* @param {String} namespace The namespace string for the debug instance to be colored
		* @return {Number|String} An ANSI color code for the given namespace
		* @api private
		*/
		function selectColor(namespace) {
			let hash = 0;
			for (let i = 0; i < namespace.length; i++) {
				hash = (hash << 5) - hash + namespace.charCodeAt(i);
				hash |= 0;
			}
			return createDebug.colors[Math.abs(hash) % createDebug.colors.length];
		}
		createDebug.selectColor = selectColor;
		/**
		* Create a debugger with the given `namespace`.
		*
		* @param {String} namespace
		* @return {Function}
		* @api public
		*/
		function createDebug(namespace) {
			let prevTime;
			let enableOverride = null;
			let namespacesCache;
			let enabledCache;
			function debug(...args) {
				if (!debug.enabled) return;
				const self = debug;
				const curr = Number(/* @__PURE__ */ new Date());
				self.diff = curr - (prevTime || curr);
				self.prev = prevTime;
				self.curr = curr;
				prevTime = curr;
				args[0] = createDebug.coerce(args[0]);
				if (typeof args[0] !== "string") args.unshift("%O");
				let index = 0;
				args[0] = args[0].replace(/%([a-zA-Z%])/g, (match, format) => {
					if (match === "%%") return "%";
					index++;
					const formatter = createDebug.formatters[format];
					if (typeof formatter === "function") {
						const val = args[index];
						match = formatter.call(self, val);
						args.splice(index, 1);
						index--;
					}
					return match;
				});
				createDebug.formatArgs.call(self, args);
				(self.log || createDebug.log).apply(self, args);
			}
			debug.namespace = namespace;
			debug.useColors = createDebug.useColors();
			debug.color = createDebug.selectColor(namespace);
			debug.extend = extend;
			debug.destroy = createDebug.destroy;
			Object.defineProperty(debug, "enabled", {
				enumerable: true,
				configurable: false,
				get: () => {
					if (enableOverride !== null) return enableOverride;
					if (namespacesCache !== createDebug.namespaces) {
						namespacesCache = createDebug.namespaces;
						enabledCache = createDebug.enabled(namespace);
					}
					return enabledCache;
				},
				set: (v) => {
					enableOverride = v;
				}
			});
			if (typeof createDebug.init === "function") createDebug.init(debug);
			return debug;
		}
		function extend(namespace, delimiter) {
			const newDebug = createDebug(this.namespace + (typeof delimiter === "undefined" ? ":" : delimiter) + namespace);
			newDebug.log = this.log;
			return newDebug;
		}
		/**
		* Enables a debug mode by namespaces. This can include modes
		* separated by a colon and wildcards.
		*
		* @param {String} namespaces
		* @api public
		*/
		function enable(namespaces) {
			createDebug.save(namespaces);
			createDebug.namespaces = namespaces;
			createDebug.names = [];
			createDebug.skips = [];
			const split = (typeof namespaces === "string" ? namespaces : "").trim().replace(/\s+/g, ",").split(",").filter(Boolean);
			for (const ns of split) if (ns[0] === "-") createDebug.skips.push(ns.slice(1));
			else createDebug.names.push(ns);
		}
		/**
		* Checks if the given string matches a namespace template, honoring
		* asterisks as wildcards.
		*
		* @param {String} search
		* @param {String} template
		* @return {Boolean}
		*/
		function matchesTemplate(search, template) {
			let searchIndex = 0;
			let templateIndex = 0;
			let starIndex = -1;
			let matchIndex = 0;
			while (searchIndex < search.length) if (templateIndex < template.length && (template[templateIndex] === search[searchIndex] || template[templateIndex] === "*")) if (template[templateIndex] === "*") {
				starIndex = templateIndex;
				matchIndex = searchIndex;
				templateIndex++;
			} else {
				searchIndex++;
				templateIndex++;
			}
			else if (starIndex !== -1) {
				templateIndex = starIndex + 1;
				matchIndex++;
				searchIndex = matchIndex;
			} else return false;
			while (templateIndex < template.length && template[templateIndex] === "*") templateIndex++;
			return templateIndex === template.length;
		}
		/**
		* Disable debug output.
		*
		* @return {String} namespaces
		* @api public
		*/
		function disable() {
			const namespaces = [...createDebug.names, ...createDebug.skips.map((namespace) => "-" + namespace)].join(",");
			createDebug.enable("");
			return namespaces;
		}
		/**
		* Returns true if the given mode name is enabled, false otherwise.
		*
		* @param {String} name
		* @return {Boolean}
		* @api public
		*/
		function enabled(name) {
			for (const skip of createDebug.skips) if (matchesTemplate(name, skip)) return false;
			for (const ns of createDebug.names) if (matchesTemplate(name, ns)) return true;
			return false;
		}
		/**
		* Coerce `val`.
		*
		* @param {Mixed} val
		* @return {Mixed}
		* @api private
		*/
		function coerce(val) {
			if (val instanceof Error) return val.stack || val.message;
			return val;
		}
		/**
		* XXX DO NOT USE. This is a temporary stub function.
		* XXX It WILL be removed in the next major release.
		*/
		function destroy() {
			console.warn("Instance method `debug.destroy()` is deprecated and no longer does anything. It will be removed in the next major version of `debug`.");
		}
		createDebug.enable(createDebug.load());
		return createDebug;
	}
	module.exports = setup;
}));
//#endregion
//#region node_modules/debug/src/browser.js
var require_browser = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	/**
	* This is the web browser implementation of `debug()`.
	*/
	exports.formatArgs = formatArgs;
	exports.save = save;
	exports.load = load;
	exports.useColors = useColors;
	exports.storage = localstorage();
	exports.destroy = (() => {
		let warned = false;
		return () => {
			if (!warned) {
				warned = true;
				console.warn("Instance method `debug.destroy()` is deprecated and no longer does anything. It will be removed in the next major version of `debug`.");
			}
		};
	})();
	/**
	* Colors.
	*/
	exports.colors = [
		"#0000CC",
		"#0000FF",
		"#0033CC",
		"#0033FF",
		"#0066CC",
		"#0066FF",
		"#0099CC",
		"#0099FF",
		"#00CC00",
		"#00CC33",
		"#00CC66",
		"#00CC99",
		"#00CCCC",
		"#00CCFF",
		"#3300CC",
		"#3300FF",
		"#3333CC",
		"#3333FF",
		"#3366CC",
		"#3366FF",
		"#3399CC",
		"#3399FF",
		"#33CC00",
		"#33CC33",
		"#33CC66",
		"#33CC99",
		"#33CCCC",
		"#33CCFF",
		"#6600CC",
		"#6600FF",
		"#6633CC",
		"#6633FF",
		"#66CC00",
		"#66CC33",
		"#9900CC",
		"#9900FF",
		"#9933CC",
		"#9933FF",
		"#99CC00",
		"#99CC33",
		"#CC0000",
		"#CC0033",
		"#CC0066",
		"#CC0099",
		"#CC00CC",
		"#CC00FF",
		"#CC3300",
		"#CC3333",
		"#CC3366",
		"#CC3399",
		"#CC33CC",
		"#CC33FF",
		"#CC6600",
		"#CC6633",
		"#CC9900",
		"#CC9933",
		"#CCCC00",
		"#CCCC33",
		"#FF0000",
		"#FF0033",
		"#FF0066",
		"#FF0099",
		"#FF00CC",
		"#FF00FF",
		"#FF3300",
		"#FF3333",
		"#FF3366",
		"#FF3399",
		"#FF33CC",
		"#FF33FF",
		"#FF6600",
		"#FF6633",
		"#FF9900",
		"#FF9933",
		"#FFCC00",
		"#FFCC33"
	];
	/**
	* Currently only WebKit-based Web Inspectors, Firefox >= v31,
	* and the Firebug extension (any Firefox version) are known
	* to support "%c" CSS customizations.
	*
	* TODO: add a `localStorage` variable to explicitly enable/disable colors
	*/
	function useColors() {
		if (typeof window !== "undefined" && window.process && (window.process.type === "renderer" || window.process.__nwjs)) return true;
		if (typeof navigator !== "undefined" && navigator.userAgent && navigator.userAgent.toLowerCase().match(/(edge|trident)\/(\d+)/)) return false;
		let m;
		return typeof document !== "undefined" && document.documentElement && document.documentElement.style && document.documentElement.style.WebkitAppearance || typeof window !== "undefined" && window.console && (window.console.firebug || window.console.exception && window.console.table) || typeof navigator !== "undefined" && navigator.userAgent && (m = navigator.userAgent.toLowerCase().match(/firefox\/(\d+)/)) && parseInt(m[1], 10) >= 31 || typeof navigator !== "undefined" && navigator.userAgent && navigator.userAgent.toLowerCase().match(/applewebkit\/(\d+)/);
	}
	/**
	* Colorize log arguments if enabled.
	*
	* @api public
	*/
	function formatArgs(args) {
		args[0] = (this.useColors ? "%c" : "") + this.namespace + (this.useColors ? " %c" : " ") + args[0] + (this.useColors ? "%c " : " ") + "+" + module.exports.humanize(this.diff);
		if (!this.useColors) return;
		const c = "color: " + this.color;
		args.splice(1, 0, c, "color: inherit");
		let index = 0;
		let lastC = 0;
		args[0].replace(/%[a-zA-Z%]/g, (match) => {
			if (match === "%%") return;
			index++;
			if (match === "%c") lastC = index;
		});
		args.splice(lastC, 0, c);
	}
	/**
	* Invokes `console.debug()` when available.
	* No-op when `console.debug` is not a "function".
	* If `console.debug` is not available, falls back
	* to `console.log`.
	*
	* @api public
	*/
	exports.log = console.debug || console.log || (() => {});
	/**
	* Save `namespaces`.
	*
	* @param {String} namespaces
	* @api private
	*/
	function save(namespaces) {
		try {
			if (namespaces) exports.storage.setItem("debug", namespaces);
			else exports.storage.removeItem("debug");
		} catch (error) {}
	}
	/**
	* Load `namespaces`.
	*
	* @return {String} returns the previously persisted debug modes
	* @api private
	*/
	function load() {
		let r;
		try {
			r = exports.storage.getItem("debug") || exports.storage.getItem("DEBUG");
		} catch (error) {}
		if (!r && typeof process !== "undefined" && "env" in process) r = process.env.DEBUG;
		return r;
	}
	/**
	* Localstorage attempts to return the localstorage.
	*
	* This is necessary because safari throws
	* when a user disables cookies/localstorage
	* and you attempt to access it.
	*
	* @return {LocalStorage}
	* @api private
	*/
	function localstorage() {
		try {
			return localStorage;
		} catch (error) {}
	}
	module.exports = require_common()(exports);
	const { formatters } = module.exports;
	/**
	* Map %j to `JSON.stringify()`, since no Web Inspectors do that by default.
	*/
	formatters.j = function(v) {
		try {
			return JSON.stringify(v);
		} catch (error) {
			return "[UnexpectedJSONParseError]: " + error.message;
		}
	};
}));
//#endregion
//#region node_modules/supports-color/index.js
var supports_color_exports = /* @__PURE__ */ __exportAll({
	createSupportsColor: () => createSupportsColor,
	default: () => supportsColor
});
function hasFlag(flag, argv = globalThis.Deno ? globalThis.Deno.args : process$1.argv) {
	const prefix = flag.startsWith("-") ? "" : flag.length === 1 ? "-" : "--";
	const position = argv.indexOf(prefix + flag);
	const terminatorPosition = argv.indexOf("--");
	return position !== -1 && (terminatorPosition === -1 || position < terminatorPosition);
}
function envForceColor() {
	if (!("FORCE_COLOR" in env)) return;
	if (env.FORCE_COLOR === "true") return 1;
	if (env.FORCE_COLOR === "false") return 0;
	if (env.FORCE_COLOR.length === 0) return 1;
	const level = Math.min(Number.parseInt(env.FORCE_COLOR, 10), 3);
	if (![
		0,
		1,
		2,
		3
	].includes(level)) return;
	return level;
}
function translateLevel(level) {
	if (level === 0) return false;
	return {
		level,
		hasBasic: true,
		has256: level >= 2,
		has16m: level >= 3
	};
}
function _supportsColor(haveStream, { streamIsTTY, sniffFlags = true } = {}) {
	const noFlagForceColor = envForceColor();
	if (noFlagForceColor !== void 0) flagForceColor = noFlagForceColor;
	const forceColor = sniffFlags ? flagForceColor : noFlagForceColor;
	if (forceColor === 0) return 0;
	if (sniffFlags) {
		if (hasFlag("color=16m") || hasFlag("color=full") || hasFlag("color=truecolor")) return 3;
		if (hasFlag("color=256")) return 2;
	}
	if ("TF_BUILD" in env && "AGENT_NAME" in env) return 1;
	if (haveStream && !streamIsTTY && forceColor === void 0) return 0;
	const min = forceColor || 0;
	if (env.TERM === "dumb") return min;
	if (process$1.platform === "win32") {
		const osRelease = os.release().split(".");
		if (Number(osRelease[0]) >= 10 && Number(osRelease[2]) >= 10586) return Number(osRelease[2]) >= 14931 ? 3 : 2;
		return 1;
	}
	if ("CI" in env) {
		if ([
			"GITHUB_ACTIONS",
			"GITEA_ACTIONS",
			"CIRCLECI"
		].some((key) => key in env)) return 3;
		if ([
			"TRAVIS",
			"APPVEYOR",
			"GITLAB_CI",
			"BUILDKITE",
			"DRONE"
		].some((sign) => sign in env) || env.CI_NAME === "codeship") return 1;
		return min;
	}
	if ("TEAMCITY_VERSION" in env) return /^(9\.(0*[1-9]\d*)\.|\d{2,}\.)/.test(env.TEAMCITY_VERSION) ? 1 : 0;
	if (env.COLORTERM === "truecolor") return 3;
	if (env.TERM === "xterm-kitty") return 3;
	if (env.TERM === "xterm-ghostty") return 3;
	if (env.TERM === "wezterm") return 3;
	if ("TERM_PROGRAM" in env) {
		const version = Number.parseInt((env.TERM_PROGRAM_VERSION || "").split(".")[0], 10);
		switch (env.TERM_PROGRAM) {
			case "iTerm.app": return version >= 3 ? 3 : 2;
			case "Apple_Terminal": return 2;
		}
	}
	if (/-256(color)?$/i.test(env.TERM)) return 2;
	if (/^screen|^xterm|^vt100|^vt220|^rxvt|color|ansi|cygwin|linux/i.test(env.TERM)) return 1;
	if ("COLORTERM" in env) return 1;
	return min;
}
function createSupportsColor(stream, options = {}) {
	return translateLevel(_supportsColor(stream, {
		streamIsTTY: stream && stream.isTTY,
		...options
	}));
}
var env, flagForceColor, supportsColor;
var init_supports_color = __esmMin((() => {
	({env} = process$1);
	if (hasFlag("no-color") || hasFlag("no-colors") || hasFlag("color=false") || hasFlag("color=never")) flagForceColor = 0;
	else if (hasFlag("color") || hasFlag("colors") || hasFlag("color=true") || hasFlag("color=always")) flagForceColor = 1;
	supportsColor = {
		stdout: createSupportsColor({ isTTY: tty.isatty(1) }),
		stderr: createSupportsColor({ isTTY: tty.isatty(2) })
	};
}));
//#endregion
//#region node_modules/debug/src/node.js
var require_node = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	/**
	* Module dependencies.
	*/
	const tty$1 = __require("tty");
	const util$4 = __require("util");
	/**
	* This is the Node.js implementation of `debug()`.
	*/
	exports.init = init;
	exports.log = log;
	exports.formatArgs = formatArgs;
	exports.save = save;
	exports.load = load;
	exports.useColors = useColors;
	exports.destroy = util$4.deprecate(() => {}, "Instance method `debug.destroy()` is deprecated and no longer does anything. It will be removed in the next major version of `debug`.");
	/**
	* Colors.
	*/
	exports.colors = [
		6,
		2,
		3,
		4,
		5,
		1
	];
	try {
		const supportsColor = (init_supports_color(), __toCommonJS(supports_color_exports));
		if (supportsColor && (supportsColor.stderr || supportsColor).level >= 2) exports.colors = [
			20,
			21,
			26,
			27,
			32,
			33,
			38,
			39,
			40,
			41,
			42,
			43,
			44,
			45,
			56,
			57,
			62,
			63,
			68,
			69,
			74,
			75,
			76,
			77,
			78,
			79,
			80,
			81,
			92,
			93,
			98,
			99,
			112,
			113,
			128,
			129,
			134,
			135,
			148,
			149,
			160,
			161,
			162,
			163,
			164,
			165,
			166,
			167,
			168,
			169,
			170,
			171,
			172,
			173,
			178,
			179,
			184,
			185,
			196,
			197,
			198,
			199,
			200,
			201,
			202,
			203,
			204,
			205,
			206,
			207,
			208,
			209,
			214,
			215,
			220,
			221
		];
	} catch (error) {}
	/**
	* Build up the default `inspectOpts` object from the environment variables.
	*
	*   $ DEBUG_COLORS=no DEBUG_DEPTH=10 DEBUG_SHOW_HIDDEN=enabled node script.js
	*/
	exports.inspectOpts = Object.keys(process.env).filter((key) => {
		return /^debug_/i.test(key);
	}).reduce((obj, key) => {
		const prop = key.substring(6).toLowerCase().replace(/_([a-z])/g, (_, k) => {
			return k.toUpperCase();
		});
		let val = process.env[key];
		if (/^(yes|on|true|enabled)$/i.test(val)) val = true;
		else if (/^(no|off|false|disabled)$/i.test(val)) val = false;
		else if (val === "null") val = null;
		else val = Number(val);
		obj[prop] = val;
		return obj;
	}, {});
	/**
	* Is stdout a TTY? Colored output is enabled when `true`.
	*/
	function useColors() {
		return "colors" in exports.inspectOpts ? Boolean(exports.inspectOpts.colors) : tty$1.isatty(process.stderr.fd);
	}
	/**
	* Adds ANSI color escape codes if enabled.
	*
	* @api public
	*/
	function formatArgs(args) {
		const { namespace: name, useColors } = this;
		if (useColors) {
			const c = this.color;
			const colorCode = "\x1B[3" + (c < 8 ? c : "8;5;" + c);
			const prefix = `  ${colorCode};1m${name} \u001B[0m`;
			args[0] = prefix + args[0].split("\n").join("\n" + prefix);
			args.push(colorCode + "m+" + module.exports.humanize(this.diff) + "\x1B[0m");
		} else args[0] = getDate() + name + " " + args[0];
	}
	function getDate() {
		if (exports.inspectOpts.hideDate) return "";
		return (/* @__PURE__ */ new Date()).toISOString() + " ";
	}
	/**
	* Invokes `util.formatWithOptions()` with the specified arguments and writes to stderr.
	*/
	function log(...args) {
		return process.stderr.write(util$4.formatWithOptions(exports.inspectOpts, ...args) + "\n");
	}
	/**
	* Save `namespaces`.
	*
	* @param {String} namespaces
	* @api private
	*/
	function save(namespaces) {
		if (namespaces) process.env.DEBUG = namespaces;
		else delete process.env.DEBUG;
	}
	/**
	* Load `namespaces`.
	*
	* @return {String} returns the previously persisted debug modes
	* @api private
	*/
	function load() {
		return process.env.DEBUG;
	}
	/**
	* Init logic for `debug` instances.
	*
	* Create a new `inspectOpts` object in case `useColors` is set
	* differently for a particular `debug` instance.
	*/
	function init(debug) {
		debug.inspectOpts = {};
		const keys = Object.keys(exports.inspectOpts);
		for (let i = 0; i < keys.length; i++) debug.inspectOpts[keys[i]] = exports.inspectOpts[keys[i]];
	}
	module.exports = require_common()(exports);
	const { formatters } = module.exports;
	/**
	* Map %o to `util.inspect()`, all on a single line.
	*/
	formatters.o = function(v) {
		this.inspectOpts.colors = this.useColors;
		return util$4.inspect(v, this.inspectOpts).split("\n").map((str) => str.trim()).join(" ");
	};
	/**
	* Map %O to `util.inspect()`, allowing multiple lines if needed.
	*/
	formatters.O = function(v) {
		this.inspectOpts.colors = this.useColors;
		return util$4.inspect(v, this.inspectOpts);
	};
}));
//#endregion
//#region node_modules/debug/src/index.js
var require_src = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	/**
	* Detect Electron renderer / nwjs process, which is node, but we should
	* treat as a browser.
	*/
	if (typeof process === "undefined" || process.type === "renderer" || process.browser === true || process.__nwjs) module.exports = require_browser();
	else module.exports = require_node();
}));
//#endregion
//#region node_modules/callsites/index.js
var require_callsites = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	const callsites = () => {
		const _prepareStackTrace = Error.prepareStackTrace;
		Error.prepareStackTrace = (_, stack) => stack;
		const stack = (/* @__PURE__ */ new Error()).stack.slice(1);
		Error.prepareStackTrace = _prepareStackTrace;
		return stack;
	};
	module.exports = callsites;
	module.exports.default = callsites;
}));
//#endregion
//#region node_modules/ow/dist/utils/is-valid-identifier.js
var require_is_valid_identifier = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	const identifierRegex = /^[a-z$_][$\w]*$/i;
	const reservedSet = /* @__PURE__ */ new Set([
		"undefined",
		"null",
		"true",
		"false",
		"super",
		"this",
		"Infinity",
		"NaN"
	]);
	/**
	Test if the string is a valid JavaScript identifier.
	
	@param string - String to test.
	*/
	exports.default = (string) => string && !reservedSet.has(string) && identifierRegex.test(string);
}));
//#endregion
//#region node_modules/ow/dist/utils/node/is-node.js
var require_is_node = /* @__PURE__ */ __commonJSMin(((exports) => {
	var _a;
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = Boolean((_a = process === null || process === void 0 ? void 0 : process.versions) === null || _a === void 0 ? void 0 : _a.node);
}));
//#endregion
//#region node_modules/ow/dist/utils/infer-label.js
var require_infer_label = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.inferLabel = void 0;
	const fs$1 = __require("fs");
	const is_valid_identifier_1 = require_is_valid_identifier();
	const is_node_1 = require_is_node();
	const labelRegex = /^.*?\((?<label>.*?)[,)]/;
	/**
	Infer the label of the caller.
	
	@hidden
	
	@param callsites - List of stack frames.
	*/
	const inferLabel = (callsites) => {
		var _a;
		if (!is_node_1.default) return;
		const functionCallStackFrame = callsites[1];
		if (!functionCallStackFrame) return;
		const fileName = functionCallStackFrame.getFileName();
		const lineNumber = functionCallStackFrame.getLineNumber();
		const columnNumber = functionCallStackFrame.getColumnNumber();
		if (fileName === null || lineNumber === null || columnNumber === null) return;
		let content = [];
		try {
			content = fs$1.readFileSync(fileName, "utf8").split("\n");
		} catch {
			return;
		}
		let line = content[lineNumber - 1];
		if (!line) return;
		line = line.slice(columnNumber - 1);
		const match = labelRegex.exec(line);
		if (!((_a = match === null || match === void 0 ? void 0 : match.groups) === null || _a === void 0 ? void 0 : _a.label)) return;
		const token = match.groups.label;
		if ((0, is_valid_identifier_1.default)(token) || (0, is_valid_identifier_1.default)(token.split(".").pop())) return token;
	};
	exports.inferLabel = inferLabel;
}));
//#endregion
//#region node_modules/ow/dist/utils/generate-stack.js
var require_generate_stack = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.generateStackTrace = void 0;
	/**
	Generates a useful stacktrace that points to the user's code where the error happened on platforms without the `Error.captureStackTrace()` method.
	
	@hidden
	*/
	const generateStackTrace = () => {
		return (/* @__PURE__ */ new RangeError("INTERNAL_OW_ERROR")).stack;
	};
	exports.generateStackTrace = generateStackTrace;
}));
//#endregion
//#region node_modules/ow/dist/argument-error.js
var require_argument_error = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.ArgumentError = void 0;
	const generate_stack_1 = require_generate_stack();
	const wrapStackTrace = (error, stack) => `${error.name}: ${error.message}\n${stack}`;
	/**
	@hidden
	*/
	var ArgumentError = class extends Error {
		constructor(message, context, errors = /* @__PURE__ */ new Map()) {
			super(message);
			Object.defineProperty(this, "validationErrors", {
				enumerable: true,
				configurable: true,
				writable: true,
				value: void 0
			});
			this.name = "ArgumentError";
			if (Error.captureStackTrace) Error.captureStackTrace(this, context);
			else this.stack = wrapStackTrace(this, (0, generate_stack_1.generateStackTrace)());
			this.validationErrors = errors;
		}
	};
	exports.ArgumentError = ArgumentError;
}));
//#endregion
//#region node_modules/ow/dist/utils/random-id.js
var require_random_id = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = () => Math.random().toString(16).slice(2);
}));
//#endregion
//#region node_modules/ow/dist/operators/not.js
var require_not = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.not = void 0;
	const random_id_1 = require_random_id();
	const predicate_1 = require_predicate();
	/**
	Operator which inverts the following validation.
	
	@hidden
	
	@param predictate - Predicate to wrap inside the operator.
	*/
	const not = (predicate) => {
		const originalAddValidator = predicate.addValidator;
		predicate.addValidator = (validator) => {
			const { validator: fn, message, negatedMessage } = validator;
			const placeholder = (0, random_id_1.default)();
			validator.message = (value, label) => negatedMessage ? negatedMessage(value, label) : message(value, placeholder).replace(/ to /, "$&not ").replace(placeholder, label);
			validator.validator = (value) => !fn(value);
			predicate[predicate_1.validatorSymbol].push(validator);
			predicate.addValidator = originalAddValidator;
			return predicate;
		};
		return predicate;
	};
	exports.not = not;
}));
//#endregion
//#region node_modules/ow/dist/predicates/base-predicate.js
var require_base_predicate = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.isPredicate = exports.testSymbol = void 0;
	/**
	@hidden
	*/
	exports.testSymbol = Symbol("test");
	/**
	@hidden
	*/
	const isPredicate = (value) => Boolean(value[exports.testSymbol]);
	exports.isPredicate = isPredicate;
}));
//#endregion
//#region node_modules/ow/dist/utils/generate-argument-error-message.js
var require_generate_argument_error_message = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.generateArgumentErrorMessage = void 0;
	/**
	Generates a complete message from all errors generated by predicates.
	
	@param errors - The errors generated by the predicates.
	@param isAny - If this function is called from the any argument.
	@hidden
	*/
	const generateArgumentErrorMessage = (errors, isAny = false) => {
		const message = [];
		const errorArray = [...errors.entries()];
		const anyErrorWithoutOneItemOnly = errorArray.some(([, array]) => array.size !== 1);
		if (errorArray.length === 1) {
			const [, returnedErrors] = errorArray[0];
			if (!isAny && returnedErrors.size === 1) {
				const [errorMessage] = returnedErrors;
				return errorMessage;
			}
			for (const entry of returnedErrors) message.push(`${isAny ? "  - " : ""}${entry}`);
			return message.join("\n");
		}
		if (!anyErrorWithoutOneItemOnly) return errorArray.map(([, [item]]) => `  - ${item}`).join("\n");
		for (const [key, value] of errorArray) {
			message.push(`Errors from the "${key}" predicate:`);
			for (const entry of value) message.push(`  - ${entry}`);
		}
		return message.join("\n");
	};
	exports.generateArgumentErrorMessage = generateArgumentErrorMessage;
}));
//#endregion
//#region node_modules/ow/dist/predicates/predicate.js
var require_predicate = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.Predicate = exports.validatorSymbol = void 0;
	const is_1 = require_dist$2();
	const argument_error_1 = require_argument_error();
	const not_1 = require_not();
	const base_predicate_1 = require_base_predicate();
	const generate_argument_error_message_1 = require_generate_argument_error_message();
	/**
	@hidden
	*/
	exports.validatorSymbol = Symbol("validators");
	/**
	@hidden
	*/
	var Predicate = class {
		constructor(type, options = {}) {
			Object.defineProperty(this, "type", {
				enumerable: true,
				configurable: true,
				writable: true,
				value: type
			});
			Object.defineProperty(this, "options", {
				enumerable: true,
				configurable: true,
				writable: true,
				value: options
			});
			Object.defineProperty(this, "context", {
				enumerable: true,
				configurable: true,
				writable: true,
				value: { validators: [] }
			});
			this.context = {
				...this.context,
				...this.options
			};
			const typeString = this.type.charAt(0).toLowerCase() + this.type.slice(1);
			this.addValidator({
				message: (value, label) => {
					return `Expected ${(label === null || label === void 0 ? void 0 : label.slice(this.type.length + 1)) || "argument"} to be of type \`${this.type}\` but received type \`${(0, is_1.default)(value)}\``;
				},
				validator: (value) => is_1.default[typeString](value)
			});
		}
		/**
		@hidden
		*/
		[base_predicate_1.testSymbol](value, main, label, idLabel) {
			const errors = /* @__PURE__ */ new Map();
			for (const { validator, message } of this.context.validators) {
				if (this.options.optional === true && value === void 0) continue;
				let result;
				try {
					result = validator(value);
				} catch (error) {
					result = error;
				}
				if (result === true) continue;
				const label2 = is_1.default.function_(label) ? label() : label;
				const labelWithTick = label2 && idLabel ? `\`${label2}\`` : label2;
				const label_ = labelWithTick ? `${this.type} ${labelWithTick}` : this.type;
				const mapKey = label2 || this.type;
				const currentErrors = errors.get(mapKey);
				const errorMessage = message(value, label_, result);
				if (currentErrors) currentErrors.add(errorMessage);
				else errors.set(mapKey, /* @__PURE__ */ new Set([errorMessage]));
			}
			if (errors.size > 0) {
				const message = (0, generate_argument_error_message_1.generateArgumentErrorMessage)(errors);
				throw new argument_error_1.ArgumentError(message, main, errors);
			}
		}
		/**
		@hidden
		*/
		get [exports.validatorSymbol]() {
			return this.context.validators;
		}
		/**
		Invert the following validators.
		*/
		get not() {
			return (0, not_1.not)(this);
		}
		/**
		Test if the value matches a custom validation function. The validation function should return an object containing a `validator` and `message`. If the `validator` is `false`, the validation fails and the `message` will be used as error message. If the `message` is a function, the function is invoked with the `label` as argument to let you further customize the error message.
		
		@param customValidator - Custom validation function.
		*/
		validate(customValidator) {
			return this.addValidator({
				message: (_, label, error) => typeof error === "string" ? `(${label}) ${error}` : error(label),
				validator: (value) => {
					const { message, validator } = customValidator(value);
					if (validator) return true;
					return message;
				}
			});
		}
		/**
		Test if the value matches a custom validation function. The validation function should return `true` if the value passes the function. If the function either returns `false` or a string, the function fails and the string will be used as error message.
		
		@param validator - Validation function.
		*/
		is(validator) {
			return this.addValidator({
				message: (value, label, error) => error ? `(${label}) ${error}` : `Expected ${label} \`${value}\` to pass custom validation function`,
				validator
			});
		}
		/**
		Provide a new error message to be thrown when the validation fails.
		
		@param newMessage - Either a string containing the new message or a function returning the new message.
		
		@example
		```
		ow('🌈', 'unicorn', ow.string.equals('🦄').message('Expected unicorn, got rainbow'));
		//=> ArgumentError: Expected unicorn, got rainbow
		```
		
		@example
		```
		ow('🌈', ow.string.minLength(5).message((value, label) => `Expected ${label}, to have a minimum length of 5, got \`${value}\``));
		//=> ArgumentError: Expected string, to be have a minimum length of 5, got `🌈`
		```
		*/
		message(newMessage) {
			const { validators } = this.context;
			validators[validators.length - 1].message = (value, label) => {
				if (typeof newMessage === "function") return newMessage(value, label);
				return newMessage;
			};
			return this;
		}
		/**
		Register a new validator.
		
		@param validator - Validator to register.
		*/
		addValidator(validator) {
			this.context.validators.push(validator);
			return this;
		}
	};
	exports.Predicate = Predicate;
}));
//#endregion
//#region node_modules/vali-date/index.js
var require_vali_date = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	module.exports = function(str) {
		return !isNaN(Date.parse(str));
	};
}));
//#endregion
//#region node_modules/ow/dist/predicates/string.js
var require_string = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.StringPredicate = void 0;
	const is_1 = require_dist$2();
	const valiDate = require_vali_date();
	const predicate_1 = require_predicate();
	var StringPredicate = class extends predicate_1.Predicate {
		/**
		@hidden
		*/
		constructor(options) {
			super("string", options);
		}
		/**
		Test a string to have a specific length.
		
		@param length - The length of the string.
		*/
		length(length) {
			return this.addValidator({
				message: (value, label) => `Expected ${label} to have length \`${length}\`, got \`${value}\``,
				validator: (value) => value.length === length
			});
		}
		/**
		Test a string to have a minimum length.
		
		@param length - The minimum length of the string.
		*/
		minLength(length) {
			return this.addValidator({
				message: (value, label) => `Expected ${label} to have a minimum length of \`${length}\`, got \`${value}\``,
				validator: (value) => value.length >= length,
				negatedMessage: (value, label) => `Expected ${label} to have a maximum length of \`${length - 1}\`, got \`${value}\``
			});
		}
		/**
		Test a string to have a maximum length.
		
		@param length - The maximum length of the string.
		*/
		maxLength(length) {
			return this.addValidator({
				message: (value, label) => `Expected ${label} to have a maximum length of \`${length}\`, got \`${value}\``,
				validator: (value) => value.length <= length,
				negatedMessage: (value, label) => `Expected ${label} to have a minimum length of \`${length + 1}\`, got \`${value}\``
			});
		}
		/**
		Test a string against a regular expression.
		
		@param regex - The regular expression to match the value with.
		*/
		matches(regex) {
			return this.addValidator({
				message: (value, label) => `Expected ${label} to match \`${regex}\`, got \`${value}\``,
				validator: (value) => regex.test(value)
			});
		}
		/**
		Test a string to start with a specific value.
		
		@param searchString - The value that should be the start of the string.
		*/
		startsWith(searchString) {
			return this.addValidator({
				message: (value, label) => `Expected ${label} to start with \`${searchString}\`, got \`${value}\``,
				validator: (value) => value.startsWith(searchString)
			});
		}
		/**
		Test a string to end with a specific value.
		
		@param searchString - The value that should be the end of the string.
		*/
		endsWith(searchString) {
			return this.addValidator({
				message: (value, label) => `Expected ${label} to end with \`${searchString}\`, got \`${value}\``,
				validator: (value) => value.endsWith(searchString)
			});
		}
		/**
		Test a string to include a specific value.
		
		@param searchString - The value that should be included in the string.
		*/
		includes(searchString) {
			return this.addValidator({
				message: (value, label) => `Expected ${label} to include \`${searchString}\`, got \`${value}\``,
				validator: (value) => value.includes(searchString)
			});
		}
		/**
		Test if the string is an element of the provided list.
		
		@param list - List of possible values.
		*/
		oneOf(list) {
			return this.addValidator({
				message: (value, label) => {
					let printedList = JSON.stringify(list);
					if (list.length > 10) {
						const overflow = list.length - 10;
						printedList = JSON.stringify(list.slice(0, 10)).replace(/]$/, `,…+${overflow} more]`);
					}
					return `Expected ${label} to be one of \`${printedList}\`, got \`${value}\``;
				},
				validator: (value) => list.includes(value)
			});
		}
		/**
		Test a string to be empty.
		*/
		get empty() {
			return this.addValidator({
				message: (value, label) => `Expected ${label} to be empty, got \`${value}\``,
				validator: (value) => value === ""
			});
		}
		/**
		Test a string to be not empty.
		*/
		get nonEmpty() {
			return this.addValidator({
				message: (_, label) => `Expected ${label} to not be empty`,
				validator: (value) => value !== ""
			});
		}
		/**
		Test a string to be equal to a specified string.
		
		@param expected - Expected value to match.
		*/
		equals(expected) {
			return this.addValidator({
				message: (value, label) => `Expected ${label} to be equal to \`${expected}\`, got \`${value}\``,
				validator: (value) => value === expected
			});
		}
		/**
		Test a string to be alphanumeric.
		*/
		get alphanumeric() {
			return this.addValidator({
				message: (value, label) => `Expected ${label} to be alphanumeric, got \`${value}\``,
				validator: (value) => /^[a-z\d]+$/i.test(value)
			});
		}
		/**
		Test a string to be alphabetical.
		*/
		get alphabetical() {
			return this.addValidator({
				message: (value, label) => `Expected ${label} to be alphabetical, got \`${value}\``,
				validator: (value) => /^[a-z]+$/gi.test(value)
			});
		}
		/**
		Test a string to be numeric.
		*/
		get numeric() {
			return this.addValidator({
				message: (value, label) => `Expected ${label} to be numeric, got \`${value}\``,
				validator: (value) => /^[+-]?\d+$/i.test(value)
			});
		}
		/**
		Test a string to be a valid date.
		*/
		get date() {
			return this.addValidator({
				message: (value, label) => `Expected ${label} to be a date, got \`${value}\``,
				validator: valiDate
			});
		}
		/**
		Test a non-empty string to be lowercase. Matching both alphabetical & numbers.
		*/
		get lowercase() {
			return this.addValidator({
				message: (value, label) => `Expected ${label} to be lowercase, got \`${value}\``,
				validator: (value) => value.trim() !== "" && value === value.toLowerCase()
			});
		}
		/**
		Test a non-empty string to be uppercase. Matching both alphabetical & numbers.
		*/
		get uppercase() {
			return this.addValidator({
				message: (value, label) => `Expected ${label} to be uppercase, got \`${value}\``,
				validator: (value) => value.trim() !== "" && value === value.toUpperCase()
			});
		}
		/**
		Test a string to be a valid URL.
		*/
		get url() {
			return this.addValidator({
				message: (value, label) => `Expected ${label} to be a URL, got \`${value}\``,
				validator: is_1.default.urlString
			});
		}
	};
	exports.StringPredicate = StringPredicate;
}));
//#endregion
//#region node_modules/ow/dist/predicates/number.js
var require_number = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.NumberPredicate = void 0;
	const is_1 = require_dist$2();
	const predicate_1 = require_predicate();
	var NumberPredicate = class extends predicate_1.Predicate {
		/**
		@hidden
		*/
		constructor(options) {
			super("number", options);
		}
		/**
		Test a number to be in a specified range.
		
		@param start - Start of the range.
		@param end - End of the range.
		*/
		inRange(start, end) {
			return this.addValidator({
				message: (value, label) => `Expected ${label} to be in range [${start}..${end}], got ${value}`,
				validator: (value) => is_1.default.inRange(value, [start, end])
			});
		}
		/**
		Test a number to be greater than the provided value.
		
		@param number - Minimum value.
		*/
		greaterThan(number) {
			return this.addValidator({
				message: (value, label) => `Expected ${label} to be greater than ${number}, got ${value}`,
				validator: (value) => value > number
			});
		}
		/**
		Test a number to be greater than or equal to the provided value.
		
		@param number - Minimum value.
		*/
		greaterThanOrEqual(number) {
			return this.addValidator({
				message: (value, label) => `Expected ${label} to be greater than or equal to ${number}, got ${value}`,
				validator: (value) => value >= number
			});
		}
		/**
		Test a number to be less than the provided value.
		
		@param number - Maximum value.
		*/
		lessThan(number) {
			return this.addValidator({
				message: (value, label) => `Expected ${label} to be less than ${number}, got ${value}`,
				validator: (value) => value < number
			});
		}
		/**
		Test a number to be less than or equal to the provided value.
		
		@param number - Minimum value.
		*/
		lessThanOrEqual(number) {
			return this.addValidator({
				message: (value, label) => `Expected ${label} to be less than or equal to ${number}, got ${value}`,
				validator: (value) => value <= number
			});
		}
		/**
		Test a number to be equal to a specified number.
		
		@param expected - Expected value to match.
		*/
		equal(expected) {
			return this.addValidator({
				message: (value, label) => `Expected ${label} to be equal to ${expected}, got ${value}`,
				validator: (value) => value === expected
			});
		}
		/**
		Test if a number is an element of the provided list.
		
		@param list - List of possible values.
		*/
		oneOf(list) {
			return this.addValidator({
				message: (value, label) => {
					let printedList = JSON.stringify(list);
					if (list.length > 10) {
						const overflow = list.length - 10;
						printedList = JSON.stringify(list.slice(0, 10)).replace(/]$/, `,…+${overflow} more]`);
					}
					return `Expected ${label} to be one of \`${printedList}\`, got ${value}`;
				},
				validator: (value) => list.includes(value)
			});
		}
		/**
		Test a number to be an integer.
		*/
		get integer() {
			return this.addValidator({
				message: (value, label) => `Expected ${label} to be an integer, got ${value}`,
				validator: (value) => is_1.default.integer(value)
			});
		}
		/**
		Test a number to be finite.
		*/
		get finite() {
			return this.addValidator({
				message: (value, label) => `Expected ${label} to be finite, got ${value}`,
				validator: (value) => !is_1.default.infinite(value)
			});
		}
		/**
		Test a number to be infinite.
		*/
		get infinite() {
			return this.addValidator({
				message: (value, label) => `Expected ${label} to be infinite, got ${value}`,
				validator: (value) => is_1.default.infinite(value)
			});
		}
		/**
		Test a number to be positive.
		*/
		get positive() {
			return this.addValidator({
				message: (value, label) => `Expected ${label} to be positive, got ${value}`,
				validator: (value) => value > 0
			});
		}
		/**
		Test a number to be negative.
		*/
		get negative() {
			return this.addValidator({
				message: (value, label) => `Expected ${label} to be negative, got ${value}`,
				validator: (value) => value < 0
			});
		}
		/**
		Test a number to be an integer or infinite.
		*/
		get integerOrInfinite() {
			return this.addValidator({
				message: (value, label) => `Expected ${label} to be an integer or infinite, got ${value}`,
				validator: (value) => is_1.default.integer(value) || is_1.default.infinite(value)
			});
		}
		/**
		Test a number to be in a valid range for a 8-bit unsigned integer.
		*/
		get uint8() {
			return this.integer.inRange(0, 255);
		}
		/**
		Test a number to be in a valid range for a 16-bit unsigned integer.
		*/
		get uint16() {
			return this.integer.inRange(0, 65535);
		}
		/**
		Test a number to be in a valid range for a 32-bit unsigned integer.
		*/
		get uint32() {
			return this.integer.inRange(0, 4294967295);
		}
		/**
		Test a number to be in a valid range for a 8-bit signed integer.
		*/
		get int8() {
			return this.integer.inRange(-128, 127);
		}
		/**
		Test a number to be in a valid range for a 16-bit signed integer.
		*/
		get int16() {
			return this.integer.inRange(-32768, 32767);
		}
		/**
		Test a number to be in a valid range for a 32-bit signed integer.
		*/
		get int32() {
			return this.integer.inRange(-2147483648, 2147483647);
		}
	};
	exports.NumberPredicate = NumberPredicate;
}));
//#endregion
//#region node_modules/ow/dist/predicates/bigint.js
var require_bigint = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.BigIntPredicate = void 0;
	const predicate_1 = require_predicate();
	var BigIntPredicate = class extends predicate_1.Predicate {
		/**
		@hidden
		*/
		constructor(options) {
			super("bigint", options);
		}
	};
	exports.BigIntPredicate = BigIntPredicate;
}));
//#endregion
//#region node_modules/ow/dist/predicates/boolean.js
var require_boolean = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.BooleanPredicate = void 0;
	const predicate_1 = require_predicate();
	var BooleanPredicate = class extends predicate_1.Predicate {
		/**
		@hidden
		*/
		constructor(options) {
			super("boolean", options);
		}
		/**
		Test a boolean to be true.
		*/
		get true() {
			return this.addValidator({
				message: (value, label) => `Expected ${label} to be true, got ${value}`,
				validator: (value) => value
			});
		}
		/**
		Test a boolean to be false.
		*/
		get false() {
			return this.addValidator({
				message: (value, label) => `Expected ${label} to be false, got ${value}`,
				validator: (value) => !value
			});
		}
	};
	exports.BooleanPredicate = BooleanPredicate;
}));
//#endregion
//#region node_modules/lodash.isequal/index.js
var require_lodash_isequal = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	/**
	* Lodash (Custom Build) <https://lodash.com/>
	* Build: `lodash modularize exports="npm" -o ./`
	* Copyright JS Foundation and other contributors <https://js.foundation/>
	* Released under MIT license <https://lodash.com/license>
	* Based on Underscore.js 1.8.3 <http://underscorejs.org/LICENSE>
	* Copyright Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
	*/
	/** Used as the size to enable large array optimizations. */
	var LARGE_ARRAY_SIZE = 200;
	/** Used to stand-in for `undefined` hash values. */
	var HASH_UNDEFINED = "__lodash_hash_undefined__";
	/** Used to compose bitmasks for value comparisons. */
	var COMPARE_PARTIAL_FLAG = 1;
	var COMPARE_UNORDERED_FLAG = 2;
	/** Used as references for various `Number` constants. */
	var MAX_SAFE_INTEGER = 9007199254740991;
	/** `Object#toString` result references. */
	var argsTag = "[object Arguments]";
	var arrayTag = "[object Array]";
	var asyncTag = "[object AsyncFunction]";
	var boolTag = "[object Boolean]";
	var dateTag = "[object Date]";
	var errorTag = "[object Error]";
	var funcTag = "[object Function]";
	var genTag = "[object GeneratorFunction]";
	var mapTag = "[object Map]";
	var numberTag = "[object Number]";
	var nullTag = "[object Null]";
	var objectTag = "[object Object]";
	var promiseTag = "[object Promise]";
	var proxyTag = "[object Proxy]";
	var regexpTag = "[object RegExp]";
	var setTag = "[object Set]";
	var stringTag = "[object String]";
	var symbolTag = "[object Symbol]";
	var undefinedTag = "[object Undefined]";
	var weakMapTag = "[object WeakMap]";
	var arrayBufferTag = "[object ArrayBuffer]";
	var dataViewTag = "[object DataView]";
	var float32Tag = "[object Float32Array]";
	var float64Tag = "[object Float64Array]";
	var int8Tag = "[object Int8Array]";
	var int16Tag = "[object Int16Array]";
	var int32Tag = "[object Int32Array]";
	var uint8Tag = "[object Uint8Array]";
	var uint8ClampedTag = "[object Uint8ClampedArray]";
	var uint16Tag = "[object Uint16Array]";
	var uint32Tag = "[object Uint32Array]";
	/**
	* Used to match `RegExp`
	* [syntax characters](http://ecma-international.org/ecma-262/7.0/#sec-patterns).
	*/
	var reRegExpChar = /[\\^$.*+?()[\]{}|]/g;
	/** Used to detect host constructors (Safari). */
	var reIsHostCtor = /^\[object .+?Constructor\]$/;
	/** Used to detect unsigned integer values. */
	var reIsUint = /^(?:0|[1-9]\d*)$/;
	/** Used to identify `toStringTag` values of typed arrays. */
	var typedArrayTags = {};
	typedArrayTags[float32Tag] = typedArrayTags[float64Tag] = typedArrayTags[int8Tag] = typedArrayTags[int16Tag] = typedArrayTags[int32Tag] = typedArrayTags[uint8Tag] = typedArrayTags[uint8ClampedTag] = typedArrayTags[uint16Tag] = typedArrayTags[uint32Tag] = true;
	typedArrayTags[argsTag] = typedArrayTags[arrayTag] = typedArrayTags[arrayBufferTag] = typedArrayTags[boolTag] = typedArrayTags[dataViewTag] = typedArrayTags[dateTag] = typedArrayTags[errorTag] = typedArrayTags[funcTag] = typedArrayTags[mapTag] = typedArrayTags[numberTag] = typedArrayTags[objectTag] = typedArrayTags[regexpTag] = typedArrayTags[setTag] = typedArrayTags[stringTag] = typedArrayTags[weakMapTag] = false;
	/** Detect free variable `global` from Node.js. */
	var freeGlobal = typeof global == "object" && global && global.Object === Object && global;
	/** Detect free variable `self`. */
	var freeSelf = typeof self == "object" && self && self.Object === Object && self;
	/** Used as a reference to the global object. */
	var root = freeGlobal || freeSelf || Function("return this")();
	/** Detect free variable `exports`. */
	var freeExports = typeof exports == "object" && exports && !exports.nodeType && exports;
	/** Detect free variable `module`. */
	var freeModule = freeExports && typeof module == "object" && module && !module.nodeType && module;
	/** Detect the popular CommonJS extension `module.exports`. */
	var moduleExports = freeModule && freeModule.exports === freeExports;
	/** Detect free variable `process` from Node.js. */
	var freeProcess = moduleExports && freeGlobal.process;
	/** Used to access faster Node.js helpers. */
	var nodeUtil = function() {
		try {
			return freeProcess && freeProcess.binding && freeProcess.binding("util");
		} catch (e) {}
	}();
	var nodeIsTypedArray = nodeUtil && nodeUtil.isTypedArray;
	/**
	* A specialized version of `_.filter` for arrays without support for
	* iteratee shorthands.
	*
	* @private
	* @param {Array} [array] The array to iterate over.
	* @param {Function} predicate The function invoked per iteration.
	* @returns {Array} Returns the new filtered array.
	*/
	function arrayFilter(array, predicate) {
		var index = -1, length = array == null ? 0 : array.length, resIndex = 0, result = [];
		while (++index < length) {
			var value = array[index];
			if (predicate(value, index, array)) result[resIndex++] = value;
		}
		return result;
	}
	/**
	* Appends the elements of `values` to `array`.
	*
	* @private
	* @param {Array} array The array to modify.
	* @param {Array} values The values to append.
	* @returns {Array} Returns `array`.
	*/
	function arrayPush(array, values) {
		var index = -1, length = values.length, offset = array.length;
		while (++index < length) array[offset + index] = values[index];
		return array;
	}
	/**
	* A specialized version of `_.some` for arrays without support for iteratee
	* shorthands.
	*
	* @private
	* @param {Array} [array] The array to iterate over.
	* @param {Function} predicate The function invoked per iteration.
	* @returns {boolean} Returns `true` if any element passes the predicate check,
	*  else `false`.
	*/
	function arraySome(array, predicate) {
		var index = -1, length = array == null ? 0 : array.length;
		while (++index < length) if (predicate(array[index], index, array)) return true;
		return false;
	}
	/**
	* The base implementation of `_.times` without support for iteratee shorthands
	* or max array length checks.
	*
	* @private
	* @param {number} n The number of times to invoke `iteratee`.
	* @param {Function} iteratee The function invoked per iteration.
	* @returns {Array} Returns the array of results.
	*/
	function baseTimes(n, iteratee) {
		var index = -1, result = Array(n);
		while (++index < n) result[index] = iteratee(index);
		return result;
	}
	/**
	* The base implementation of `_.unary` without support for storing metadata.
	*
	* @private
	* @param {Function} func The function to cap arguments for.
	* @returns {Function} Returns the new capped function.
	*/
	function baseUnary(func) {
		return function(value) {
			return func(value);
		};
	}
	/**
	* Checks if a `cache` value for `key` exists.
	*
	* @private
	* @param {Object} cache The cache to query.
	* @param {string} key The key of the entry to check.
	* @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
	*/
	function cacheHas(cache, key) {
		return cache.has(key);
	}
	/**
	* Gets the value at `key` of `object`.
	*
	* @private
	* @param {Object} [object] The object to query.
	* @param {string} key The key of the property to get.
	* @returns {*} Returns the property value.
	*/
	function getValue(object, key) {
		return object == null ? void 0 : object[key];
	}
	/**
	* Converts `map` to its key-value pairs.
	*
	* @private
	* @param {Object} map The map to convert.
	* @returns {Array} Returns the key-value pairs.
	*/
	function mapToArray(map) {
		var index = -1, result = Array(map.size);
		map.forEach(function(value, key) {
			result[++index] = [key, value];
		});
		return result;
	}
	/**
	* Creates a unary function that invokes `func` with its argument transformed.
	*
	* @private
	* @param {Function} func The function to wrap.
	* @param {Function} transform The argument transform.
	* @returns {Function} Returns the new function.
	*/
	function overArg(func, transform) {
		return function(arg) {
			return func(transform(arg));
		};
	}
	/**
	* Converts `set` to an array of its values.
	*
	* @private
	* @param {Object} set The set to convert.
	* @returns {Array} Returns the values.
	*/
	function setToArray(set) {
		var index = -1, result = Array(set.size);
		set.forEach(function(value) {
			result[++index] = value;
		});
		return result;
	}
	/** Used for built-in method references. */
	var arrayProto = Array.prototype;
	var funcProto = Function.prototype;
	var objectProto = Object.prototype;
	/** Used to detect overreaching core-js shims. */
	var coreJsData = root["__core-js_shared__"];
	/** Used to resolve the decompiled source of functions. */
	var funcToString = funcProto.toString;
	/** Used to check objects for own properties. */
	var hasOwnProperty = objectProto.hasOwnProperty;
	/** Used to detect methods masquerading as native. */
	var maskSrcKey = function() {
		var uid = /[^.]+$/.exec(coreJsData && coreJsData.keys && coreJsData.keys.IE_PROTO || "");
		return uid ? "Symbol(src)_1." + uid : "";
	}();
	/**
	* Used to resolve the
	* [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
	* of values.
	*/
	var nativeObjectToString = objectProto.toString;
	/** Used to detect if a method is native. */
	var reIsNative = RegExp("^" + funcToString.call(hasOwnProperty).replace(reRegExpChar, "\\$&").replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, "$1.*?") + "$");
	/** Built-in value references. */
	var Buffer = moduleExports ? root.Buffer : void 0;
	var Symbol = root.Symbol;
	var Uint8Array = root.Uint8Array;
	var propertyIsEnumerable = objectProto.propertyIsEnumerable;
	var splice = arrayProto.splice;
	var symToStringTag = Symbol ? Symbol.toStringTag : void 0;
	var nativeGetSymbols = Object.getOwnPropertySymbols;
	var nativeIsBuffer = Buffer ? Buffer.isBuffer : void 0;
	var nativeKeys = overArg(Object.keys, Object);
	var DataView = getNative(root, "DataView");
	var Map = getNative(root, "Map");
	var Promise = getNative(root, "Promise");
	var Set = getNative(root, "Set");
	var WeakMap = getNative(root, "WeakMap");
	var nativeCreate = getNative(Object, "create");
	/** Used to detect maps, sets, and weakmaps. */
	var dataViewCtorString = toSource(DataView);
	var mapCtorString = toSource(Map);
	var promiseCtorString = toSource(Promise);
	var setCtorString = toSource(Set);
	var weakMapCtorString = toSource(WeakMap);
	/** Used to convert symbols to primitives and strings. */
	var symbolProto = Symbol ? Symbol.prototype : void 0;
	var symbolValueOf = symbolProto ? symbolProto.valueOf : void 0;
	/**
	* Creates a hash object.
	*
	* @private
	* @constructor
	* @param {Array} [entries] The key-value pairs to cache.
	*/
	function Hash(entries) {
		var index = -1, length = entries == null ? 0 : entries.length;
		this.clear();
		while (++index < length) {
			var entry = entries[index];
			this.set(entry[0], entry[1]);
		}
	}
	/**
	* Removes all key-value entries from the hash.
	*
	* @private
	* @name clear
	* @memberOf Hash
	*/
	function hashClear() {
		this.__data__ = nativeCreate ? nativeCreate(null) : {};
		this.size = 0;
	}
	/**
	* Removes `key` and its value from the hash.
	*
	* @private
	* @name delete
	* @memberOf Hash
	* @param {Object} hash The hash to modify.
	* @param {string} key The key of the value to remove.
	* @returns {boolean} Returns `true` if the entry was removed, else `false`.
	*/
	function hashDelete(key) {
		var result = this.has(key) && delete this.__data__[key];
		this.size -= result ? 1 : 0;
		return result;
	}
	/**
	* Gets the hash value for `key`.
	*
	* @private
	* @name get
	* @memberOf Hash
	* @param {string} key The key of the value to get.
	* @returns {*} Returns the entry value.
	*/
	function hashGet(key) {
		var data = this.__data__;
		if (nativeCreate) {
			var result = data[key];
			return result === HASH_UNDEFINED ? void 0 : result;
		}
		return hasOwnProperty.call(data, key) ? data[key] : void 0;
	}
	/**
	* Checks if a hash value for `key` exists.
	*
	* @private
	* @name has
	* @memberOf Hash
	* @param {string} key The key of the entry to check.
	* @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
	*/
	function hashHas(key) {
		var data = this.__data__;
		return nativeCreate ? data[key] !== void 0 : hasOwnProperty.call(data, key);
	}
	/**
	* Sets the hash `key` to `value`.
	*
	* @private
	* @name set
	* @memberOf Hash
	* @param {string} key The key of the value to set.
	* @param {*} value The value to set.
	* @returns {Object} Returns the hash instance.
	*/
	function hashSet(key, value) {
		var data = this.__data__;
		this.size += this.has(key) ? 0 : 1;
		data[key] = nativeCreate && value === void 0 ? HASH_UNDEFINED : value;
		return this;
	}
	Hash.prototype.clear = hashClear;
	Hash.prototype["delete"] = hashDelete;
	Hash.prototype.get = hashGet;
	Hash.prototype.has = hashHas;
	Hash.prototype.set = hashSet;
	/**
	* Creates an list cache object.
	*
	* @private
	* @constructor
	* @param {Array} [entries] The key-value pairs to cache.
	*/
	function ListCache(entries) {
		var index = -1, length = entries == null ? 0 : entries.length;
		this.clear();
		while (++index < length) {
			var entry = entries[index];
			this.set(entry[0], entry[1]);
		}
	}
	/**
	* Removes all key-value entries from the list cache.
	*
	* @private
	* @name clear
	* @memberOf ListCache
	*/
	function listCacheClear() {
		this.__data__ = [];
		this.size = 0;
	}
	/**
	* Removes `key` and its value from the list cache.
	*
	* @private
	* @name delete
	* @memberOf ListCache
	* @param {string} key The key of the value to remove.
	* @returns {boolean} Returns `true` if the entry was removed, else `false`.
	*/
	function listCacheDelete(key) {
		var data = this.__data__, index = assocIndexOf(data, key);
		if (index < 0) return false;
		if (index == data.length - 1) data.pop();
		else splice.call(data, index, 1);
		--this.size;
		return true;
	}
	/**
	* Gets the list cache value for `key`.
	*
	* @private
	* @name get
	* @memberOf ListCache
	* @param {string} key The key of the value to get.
	* @returns {*} Returns the entry value.
	*/
	function listCacheGet(key) {
		var data = this.__data__, index = assocIndexOf(data, key);
		return index < 0 ? void 0 : data[index][1];
	}
	/**
	* Checks if a list cache value for `key` exists.
	*
	* @private
	* @name has
	* @memberOf ListCache
	* @param {string} key The key of the entry to check.
	* @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
	*/
	function listCacheHas(key) {
		return assocIndexOf(this.__data__, key) > -1;
	}
	/**
	* Sets the list cache `key` to `value`.
	*
	* @private
	* @name set
	* @memberOf ListCache
	* @param {string} key The key of the value to set.
	* @param {*} value The value to set.
	* @returns {Object} Returns the list cache instance.
	*/
	function listCacheSet(key, value) {
		var data = this.__data__, index = assocIndexOf(data, key);
		if (index < 0) {
			++this.size;
			data.push([key, value]);
		} else data[index][1] = value;
		return this;
	}
	ListCache.prototype.clear = listCacheClear;
	ListCache.prototype["delete"] = listCacheDelete;
	ListCache.prototype.get = listCacheGet;
	ListCache.prototype.has = listCacheHas;
	ListCache.prototype.set = listCacheSet;
	/**
	* Creates a map cache object to store key-value pairs.
	*
	* @private
	* @constructor
	* @param {Array} [entries] The key-value pairs to cache.
	*/
	function MapCache(entries) {
		var index = -1, length = entries == null ? 0 : entries.length;
		this.clear();
		while (++index < length) {
			var entry = entries[index];
			this.set(entry[0], entry[1]);
		}
	}
	/**
	* Removes all key-value entries from the map.
	*
	* @private
	* @name clear
	* @memberOf MapCache
	*/
	function mapCacheClear() {
		this.size = 0;
		this.__data__ = {
			"hash": new Hash(),
			"map": new (Map || ListCache)(),
			"string": new Hash()
		};
	}
	/**
	* Removes `key` and its value from the map.
	*
	* @private
	* @name delete
	* @memberOf MapCache
	* @param {string} key The key of the value to remove.
	* @returns {boolean} Returns `true` if the entry was removed, else `false`.
	*/
	function mapCacheDelete(key) {
		var result = getMapData(this, key)["delete"](key);
		this.size -= result ? 1 : 0;
		return result;
	}
	/**
	* Gets the map value for `key`.
	*
	* @private
	* @name get
	* @memberOf MapCache
	* @param {string} key The key of the value to get.
	* @returns {*} Returns the entry value.
	*/
	function mapCacheGet(key) {
		return getMapData(this, key).get(key);
	}
	/**
	* Checks if a map value for `key` exists.
	*
	* @private
	* @name has
	* @memberOf MapCache
	* @param {string} key The key of the entry to check.
	* @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
	*/
	function mapCacheHas(key) {
		return getMapData(this, key).has(key);
	}
	/**
	* Sets the map `key` to `value`.
	*
	* @private
	* @name set
	* @memberOf MapCache
	* @param {string} key The key of the value to set.
	* @param {*} value The value to set.
	* @returns {Object} Returns the map cache instance.
	*/
	function mapCacheSet(key, value) {
		var data = getMapData(this, key), size = data.size;
		data.set(key, value);
		this.size += data.size == size ? 0 : 1;
		return this;
	}
	MapCache.prototype.clear = mapCacheClear;
	MapCache.prototype["delete"] = mapCacheDelete;
	MapCache.prototype.get = mapCacheGet;
	MapCache.prototype.has = mapCacheHas;
	MapCache.prototype.set = mapCacheSet;
	/**
	*
	* Creates an array cache object to store unique values.
	*
	* @private
	* @constructor
	* @param {Array} [values] The values to cache.
	*/
	function SetCache(values) {
		var index = -1, length = values == null ? 0 : values.length;
		this.__data__ = new MapCache();
		while (++index < length) this.add(values[index]);
	}
	/**
	* Adds `value` to the array cache.
	*
	* @private
	* @name add
	* @memberOf SetCache
	* @alias push
	* @param {*} value The value to cache.
	* @returns {Object} Returns the cache instance.
	*/
	function setCacheAdd(value) {
		this.__data__.set(value, HASH_UNDEFINED);
		return this;
	}
	/**
	* Checks if `value` is in the array cache.
	*
	* @private
	* @name has
	* @memberOf SetCache
	* @param {*} value The value to search for.
	* @returns {number} Returns `true` if `value` is found, else `false`.
	*/
	function setCacheHas(value) {
		return this.__data__.has(value);
	}
	SetCache.prototype.add = SetCache.prototype.push = setCacheAdd;
	SetCache.prototype.has = setCacheHas;
	/**
	* Creates a stack cache object to store key-value pairs.
	*
	* @private
	* @constructor
	* @param {Array} [entries] The key-value pairs to cache.
	*/
	function Stack(entries) {
		var data = this.__data__ = new ListCache(entries);
		this.size = data.size;
	}
	/**
	* Removes all key-value entries from the stack.
	*
	* @private
	* @name clear
	* @memberOf Stack
	*/
	function stackClear() {
		this.__data__ = new ListCache();
		this.size = 0;
	}
	/**
	* Removes `key` and its value from the stack.
	*
	* @private
	* @name delete
	* @memberOf Stack
	* @param {string} key The key of the value to remove.
	* @returns {boolean} Returns `true` if the entry was removed, else `false`.
	*/
	function stackDelete(key) {
		var data = this.__data__, result = data["delete"](key);
		this.size = data.size;
		return result;
	}
	/**
	* Gets the stack value for `key`.
	*
	* @private
	* @name get
	* @memberOf Stack
	* @param {string} key The key of the value to get.
	* @returns {*} Returns the entry value.
	*/
	function stackGet(key) {
		return this.__data__.get(key);
	}
	/**
	* Checks if a stack value for `key` exists.
	*
	* @private
	* @name has
	* @memberOf Stack
	* @param {string} key The key of the entry to check.
	* @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
	*/
	function stackHas(key) {
		return this.__data__.has(key);
	}
	/**
	* Sets the stack `key` to `value`.
	*
	* @private
	* @name set
	* @memberOf Stack
	* @param {string} key The key of the value to set.
	* @param {*} value The value to set.
	* @returns {Object} Returns the stack cache instance.
	*/
	function stackSet(key, value) {
		var data = this.__data__;
		if (data instanceof ListCache) {
			var pairs = data.__data__;
			if (!Map || pairs.length < LARGE_ARRAY_SIZE - 1) {
				pairs.push([key, value]);
				this.size = ++data.size;
				return this;
			}
			data = this.__data__ = new MapCache(pairs);
		}
		data.set(key, value);
		this.size = data.size;
		return this;
	}
	Stack.prototype.clear = stackClear;
	Stack.prototype["delete"] = stackDelete;
	Stack.prototype.get = stackGet;
	Stack.prototype.has = stackHas;
	Stack.prototype.set = stackSet;
	/**
	* Creates an array of the enumerable property names of the array-like `value`.
	*
	* @private
	* @param {*} value The value to query.
	* @param {boolean} inherited Specify returning inherited property names.
	* @returns {Array} Returns the array of property names.
	*/
	function arrayLikeKeys(value, inherited) {
		var isArr = isArray(value), isArg = !isArr && isArguments(value), isBuff = !isArr && !isArg && isBuffer(value), isType = !isArr && !isArg && !isBuff && isTypedArray(value), skipIndexes = isArr || isArg || isBuff || isType, result = skipIndexes ? baseTimes(value.length, String) : [], length = result.length;
		for (var key in value) if ((inherited || hasOwnProperty.call(value, key)) && !(skipIndexes && (key == "length" || isBuff && (key == "offset" || key == "parent") || isType && (key == "buffer" || key == "byteLength" || key == "byteOffset") || isIndex(key, length)))) result.push(key);
		return result;
	}
	/**
	* Gets the index at which the `key` is found in `array` of key-value pairs.
	*
	* @private
	* @param {Array} array The array to inspect.
	* @param {*} key The key to search for.
	* @returns {number} Returns the index of the matched value, else `-1`.
	*/
	function assocIndexOf(array, key) {
		var length = array.length;
		while (length--) if (eq(array[length][0], key)) return length;
		return -1;
	}
	/**
	* The base implementation of `getAllKeys` and `getAllKeysIn` which uses
	* `keysFunc` and `symbolsFunc` to get the enumerable property names and
	* symbols of `object`.
	*
	* @private
	* @param {Object} object The object to query.
	* @param {Function} keysFunc The function to get the keys of `object`.
	* @param {Function} symbolsFunc The function to get the symbols of `object`.
	* @returns {Array} Returns the array of property names and symbols.
	*/
	function baseGetAllKeys(object, keysFunc, symbolsFunc) {
		var result = keysFunc(object);
		return isArray(object) ? result : arrayPush(result, symbolsFunc(object));
	}
	/**
	* The base implementation of `getTag` without fallbacks for buggy environments.
	*
	* @private
	* @param {*} value The value to query.
	* @returns {string} Returns the `toStringTag`.
	*/
	function baseGetTag(value) {
		if (value == null) return value === void 0 ? undefinedTag : nullTag;
		return symToStringTag && symToStringTag in Object(value) ? getRawTag(value) : objectToString(value);
	}
	/**
	* The base implementation of `_.isArguments`.
	*
	* @private
	* @param {*} value The value to check.
	* @returns {boolean} Returns `true` if `value` is an `arguments` object,
	*/
	function baseIsArguments(value) {
		return isObjectLike(value) && baseGetTag(value) == argsTag;
	}
	/**
	* The base implementation of `_.isEqual` which supports partial comparisons
	* and tracks traversed objects.
	*
	* @private
	* @param {*} value The value to compare.
	* @param {*} other The other value to compare.
	* @param {boolean} bitmask The bitmask flags.
	*  1 - Unordered comparison
	*  2 - Partial comparison
	* @param {Function} [customizer] The function to customize comparisons.
	* @param {Object} [stack] Tracks traversed `value` and `other` objects.
	* @returns {boolean} Returns `true` if the values are equivalent, else `false`.
	*/
	function baseIsEqual(value, other, bitmask, customizer, stack) {
		if (value === other) return true;
		if (value == null || other == null || !isObjectLike(value) && !isObjectLike(other)) return value !== value && other !== other;
		return baseIsEqualDeep(value, other, bitmask, customizer, baseIsEqual, stack);
	}
	/**
	* A specialized version of `baseIsEqual` for arrays and objects which performs
	* deep comparisons and tracks traversed objects enabling objects with circular
	* references to be compared.
	*
	* @private
	* @param {Object} object The object to compare.
	* @param {Object} other The other object to compare.
	* @param {number} bitmask The bitmask flags. See `baseIsEqual` for more details.
	* @param {Function} customizer The function to customize comparisons.
	* @param {Function} equalFunc The function to determine equivalents of values.
	* @param {Object} [stack] Tracks traversed `object` and `other` objects.
	* @returns {boolean} Returns `true` if the objects are equivalent, else `false`.
	*/
	function baseIsEqualDeep(object, other, bitmask, customizer, equalFunc, stack) {
		var objIsArr = isArray(object), othIsArr = isArray(other), objTag = objIsArr ? arrayTag : getTag(object), othTag = othIsArr ? arrayTag : getTag(other);
		objTag = objTag == argsTag ? objectTag : objTag;
		othTag = othTag == argsTag ? objectTag : othTag;
		var objIsObj = objTag == objectTag, othIsObj = othTag == objectTag, isSameTag = objTag == othTag;
		if (isSameTag && isBuffer(object)) {
			if (!isBuffer(other)) return false;
			objIsArr = true;
			objIsObj = false;
		}
		if (isSameTag && !objIsObj) {
			stack || (stack = new Stack());
			return objIsArr || isTypedArray(object) ? equalArrays(object, other, bitmask, customizer, equalFunc, stack) : equalByTag(object, other, objTag, bitmask, customizer, equalFunc, stack);
		}
		if (!(bitmask & COMPARE_PARTIAL_FLAG)) {
			var objIsWrapped = objIsObj && hasOwnProperty.call(object, "__wrapped__"), othIsWrapped = othIsObj && hasOwnProperty.call(other, "__wrapped__");
			if (objIsWrapped || othIsWrapped) {
				var objUnwrapped = objIsWrapped ? object.value() : object, othUnwrapped = othIsWrapped ? other.value() : other;
				stack || (stack = new Stack());
				return equalFunc(objUnwrapped, othUnwrapped, bitmask, customizer, stack);
			}
		}
		if (!isSameTag) return false;
		stack || (stack = new Stack());
		return equalObjects(object, other, bitmask, customizer, equalFunc, stack);
	}
	/**
	* The base implementation of `_.isNative` without bad shim checks.
	*
	* @private
	* @param {*} value The value to check.
	* @returns {boolean} Returns `true` if `value` is a native function,
	*  else `false`.
	*/
	function baseIsNative(value) {
		if (!isObject(value) || isMasked(value)) return false;
		return (isFunction(value) ? reIsNative : reIsHostCtor).test(toSource(value));
	}
	/**
	* The base implementation of `_.isTypedArray` without Node.js optimizations.
	*
	* @private
	* @param {*} value The value to check.
	* @returns {boolean} Returns `true` if `value` is a typed array, else `false`.
	*/
	function baseIsTypedArray(value) {
		return isObjectLike(value) && isLength(value.length) && !!typedArrayTags[baseGetTag(value)];
	}
	/**
	* The base implementation of `_.keys` which doesn't treat sparse arrays as dense.
	*
	* @private
	* @param {Object} object The object to query.
	* @returns {Array} Returns the array of property names.
	*/
	function baseKeys(object) {
		if (!isPrototype(object)) return nativeKeys(object);
		var result = [];
		for (var key in Object(object)) if (hasOwnProperty.call(object, key) && key != "constructor") result.push(key);
		return result;
	}
	/**
	* A specialized version of `baseIsEqualDeep` for arrays with support for
	* partial deep comparisons.
	*
	* @private
	* @param {Array} array The array to compare.
	* @param {Array} other The other array to compare.
	* @param {number} bitmask The bitmask flags. See `baseIsEqual` for more details.
	* @param {Function} customizer The function to customize comparisons.
	* @param {Function} equalFunc The function to determine equivalents of values.
	* @param {Object} stack Tracks traversed `array` and `other` objects.
	* @returns {boolean} Returns `true` if the arrays are equivalent, else `false`.
	*/
	function equalArrays(array, other, bitmask, customizer, equalFunc, stack) {
		var isPartial = bitmask & COMPARE_PARTIAL_FLAG, arrLength = array.length, othLength = other.length;
		if (arrLength != othLength && !(isPartial && othLength > arrLength)) return false;
		var stacked = stack.get(array);
		if (stacked && stack.get(other)) return stacked == other;
		var index = -1, result = true, seen = bitmask & COMPARE_UNORDERED_FLAG ? new SetCache() : void 0;
		stack.set(array, other);
		stack.set(other, array);
		while (++index < arrLength) {
			var arrValue = array[index], othValue = other[index];
			if (customizer) var compared = isPartial ? customizer(othValue, arrValue, index, other, array, stack) : customizer(arrValue, othValue, index, array, other, stack);
			if (compared !== void 0) {
				if (compared) continue;
				result = false;
				break;
			}
			if (seen) {
				if (!arraySome(other, function(othValue, othIndex) {
					if (!cacheHas(seen, othIndex) && (arrValue === othValue || equalFunc(arrValue, othValue, bitmask, customizer, stack))) return seen.push(othIndex);
				})) {
					result = false;
					break;
				}
			} else if (!(arrValue === othValue || equalFunc(arrValue, othValue, bitmask, customizer, stack))) {
				result = false;
				break;
			}
		}
		stack["delete"](array);
		stack["delete"](other);
		return result;
	}
	/**
	* A specialized version of `baseIsEqualDeep` for comparing objects of
	* the same `toStringTag`.
	*
	* **Note:** This function only supports comparing values with tags of
	* `Boolean`, `Date`, `Error`, `Number`, `RegExp`, or `String`.
	*
	* @private
	* @param {Object} object The object to compare.
	* @param {Object} other The other object to compare.
	* @param {string} tag The `toStringTag` of the objects to compare.
	* @param {number} bitmask The bitmask flags. See `baseIsEqual` for more details.
	* @param {Function} customizer The function to customize comparisons.
	* @param {Function} equalFunc The function to determine equivalents of values.
	* @param {Object} stack Tracks traversed `object` and `other` objects.
	* @returns {boolean} Returns `true` if the objects are equivalent, else `false`.
	*/
	function equalByTag(object, other, tag, bitmask, customizer, equalFunc, stack) {
		switch (tag) {
			case dataViewTag:
				if (object.byteLength != other.byteLength || object.byteOffset != other.byteOffset) return false;
				object = object.buffer;
				other = other.buffer;
			case arrayBufferTag:
				if (object.byteLength != other.byteLength || !equalFunc(new Uint8Array(object), new Uint8Array(other))) return false;
				return true;
			case boolTag:
			case dateTag:
			case numberTag: return eq(+object, +other);
			case errorTag: return object.name == other.name && object.message == other.message;
			case regexpTag:
			case stringTag: return object == other + "";
			case mapTag: var convert = mapToArray;
			case setTag:
				var isPartial = bitmask & COMPARE_PARTIAL_FLAG;
				convert || (convert = setToArray);
				if (object.size != other.size && !isPartial) return false;
				var stacked = stack.get(object);
				if (stacked) return stacked == other;
				bitmask |= COMPARE_UNORDERED_FLAG;
				stack.set(object, other);
				var result = equalArrays(convert(object), convert(other), bitmask, customizer, equalFunc, stack);
				stack["delete"](object);
				return result;
			case symbolTag: if (symbolValueOf) return symbolValueOf.call(object) == symbolValueOf.call(other);
		}
		return false;
	}
	/**
	* A specialized version of `baseIsEqualDeep` for objects with support for
	* partial deep comparisons.
	*
	* @private
	* @param {Object} object The object to compare.
	* @param {Object} other The other object to compare.
	* @param {number} bitmask The bitmask flags. See `baseIsEqual` for more details.
	* @param {Function} customizer The function to customize comparisons.
	* @param {Function} equalFunc The function to determine equivalents of values.
	* @param {Object} stack Tracks traversed `object` and `other` objects.
	* @returns {boolean} Returns `true` if the objects are equivalent, else `false`.
	*/
	function equalObjects(object, other, bitmask, customizer, equalFunc, stack) {
		var isPartial = bitmask & COMPARE_PARTIAL_FLAG, objProps = getAllKeys(object), objLength = objProps.length;
		if (objLength != getAllKeys(other).length && !isPartial) return false;
		var index = objLength;
		while (index--) {
			var key = objProps[index];
			if (!(isPartial ? key in other : hasOwnProperty.call(other, key))) return false;
		}
		var stacked = stack.get(object);
		if (stacked && stack.get(other)) return stacked == other;
		var result = true;
		stack.set(object, other);
		stack.set(other, object);
		var skipCtor = isPartial;
		while (++index < objLength) {
			key = objProps[index];
			var objValue = object[key], othValue = other[key];
			if (customizer) var compared = isPartial ? customizer(othValue, objValue, key, other, object, stack) : customizer(objValue, othValue, key, object, other, stack);
			if (!(compared === void 0 ? objValue === othValue || equalFunc(objValue, othValue, bitmask, customizer, stack) : compared)) {
				result = false;
				break;
			}
			skipCtor || (skipCtor = key == "constructor");
		}
		if (result && !skipCtor) {
			var objCtor = object.constructor, othCtor = other.constructor;
			if (objCtor != othCtor && "constructor" in object && "constructor" in other && !(typeof objCtor == "function" && objCtor instanceof objCtor && typeof othCtor == "function" && othCtor instanceof othCtor)) result = false;
		}
		stack["delete"](object);
		stack["delete"](other);
		return result;
	}
	/**
	* Creates an array of own enumerable property names and symbols of `object`.
	*
	* @private
	* @param {Object} object The object to query.
	* @returns {Array} Returns the array of property names and symbols.
	*/
	function getAllKeys(object) {
		return baseGetAllKeys(object, keys, getSymbols);
	}
	/**
	* Gets the data for `map`.
	*
	* @private
	* @param {Object} map The map to query.
	* @param {string} key The reference key.
	* @returns {*} Returns the map data.
	*/
	function getMapData(map, key) {
		var data = map.__data__;
		return isKeyable(key) ? data[typeof key == "string" ? "string" : "hash"] : data.map;
	}
	/**
	* Gets the native function at `key` of `object`.
	*
	* @private
	* @param {Object} object The object to query.
	* @param {string} key The key of the method to get.
	* @returns {*} Returns the function if it's native, else `undefined`.
	*/
	function getNative(object, key) {
		var value = getValue(object, key);
		return baseIsNative(value) ? value : void 0;
	}
	/**
	* A specialized version of `baseGetTag` which ignores `Symbol.toStringTag` values.
	*
	* @private
	* @param {*} value The value to query.
	* @returns {string} Returns the raw `toStringTag`.
	*/
	function getRawTag(value) {
		var isOwn = hasOwnProperty.call(value, symToStringTag), tag = value[symToStringTag];
		try {
			value[symToStringTag] = void 0;
			var unmasked = true;
		} catch (e) {}
		var result = nativeObjectToString.call(value);
		if (unmasked) if (isOwn) value[symToStringTag] = tag;
		else delete value[symToStringTag];
		return result;
	}
	/**
	* Creates an array of the own enumerable symbols of `object`.
	*
	* @private
	* @param {Object} object The object to query.
	* @returns {Array} Returns the array of symbols.
	*/
	var getSymbols = !nativeGetSymbols ? stubArray : function(object) {
		if (object == null) return [];
		object = Object(object);
		return arrayFilter(nativeGetSymbols(object), function(symbol) {
			return propertyIsEnumerable.call(object, symbol);
		});
	};
	/**
	* Gets the `toStringTag` of `value`.
	*
	* @private
	* @param {*} value The value to query.
	* @returns {string} Returns the `toStringTag`.
	*/
	var getTag = baseGetTag;
	if (DataView && getTag(new DataView(/* @__PURE__ */ new ArrayBuffer(1))) != dataViewTag || Map && getTag(new Map()) != mapTag || Promise && getTag(Promise.resolve()) != promiseTag || Set && getTag(new Set()) != setTag || WeakMap && getTag(new WeakMap()) != weakMapTag) getTag = function(value) {
		var result = baseGetTag(value), Ctor = result == objectTag ? value.constructor : void 0, ctorString = Ctor ? toSource(Ctor) : "";
		if (ctorString) switch (ctorString) {
			case dataViewCtorString: return dataViewTag;
			case mapCtorString: return mapTag;
			case promiseCtorString: return promiseTag;
			case setCtorString: return setTag;
			case weakMapCtorString: return weakMapTag;
		}
		return result;
	};
	/**
	* Checks if `value` is a valid array-like index.
	*
	* @private
	* @param {*} value The value to check.
	* @param {number} [length=MAX_SAFE_INTEGER] The upper bounds of a valid index.
	* @returns {boolean} Returns `true` if `value` is a valid index, else `false`.
	*/
	function isIndex(value, length) {
		length = length == null ? MAX_SAFE_INTEGER : length;
		return !!length && (typeof value == "number" || reIsUint.test(value)) && value > -1 && value % 1 == 0 && value < length;
	}
	/**
	* Checks if `value` is suitable for use as unique object key.
	*
	* @private
	* @param {*} value The value to check.
	* @returns {boolean} Returns `true` if `value` is suitable, else `false`.
	*/
	function isKeyable(value) {
		var type = typeof value;
		return type == "string" || type == "number" || type == "symbol" || type == "boolean" ? value !== "__proto__" : value === null;
	}
	/**
	* Checks if `func` has its source masked.
	*
	* @private
	* @param {Function} func The function to check.
	* @returns {boolean} Returns `true` if `func` is masked, else `false`.
	*/
	function isMasked(func) {
		return !!maskSrcKey && maskSrcKey in func;
	}
	/**
	* Checks if `value` is likely a prototype object.
	*
	* @private
	* @param {*} value The value to check.
	* @returns {boolean} Returns `true` if `value` is a prototype, else `false`.
	*/
	function isPrototype(value) {
		var Ctor = value && value.constructor;
		return value === (typeof Ctor == "function" && Ctor.prototype || objectProto);
	}
	/**
	* Converts `value` to a string using `Object.prototype.toString`.
	*
	* @private
	* @param {*} value The value to convert.
	* @returns {string} Returns the converted string.
	*/
	function objectToString(value) {
		return nativeObjectToString.call(value);
	}
	/**
	* Converts `func` to its source code.
	*
	* @private
	* @param {Function} func The function to convert.
	* @returns {string} Returns the source code.
	*/
	function toSource(func) {
		if (func != null) {
			try {
				return funcToString.call(func);
			} catch (e) {}
			try {
				return func + "";
			} catch (e) {}
		}
		return "";
	}
	/**
	* Performs a
	* [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
	* comparison between two values to determine if they are equivalent.
	*
	* @static
	* @memberOf _
	* @since 4.0.0
	* @category Lang
	* @param {*} value The value to compare.
	* @param {*} other The other value to compare.
	* @returns {boolean} Returns `true` if the values are equivalent, else `false`.
	* @example
	*
	* var object = { 'a': 1 };
	* var other = { 'a': 1 };
	*
	* _.eq(object, object);
	* // => true
	*
	* _.eq(object, other);
	* // => false
	*
	* _.eq('a', 'a');
	* // => true
	*
	* _.eq('a', Object('a'));
	* // => false
	*
	* _.eq(NaN, NaN);
	* // => true
	*/
	function eq(value, other) {
		return value === other || value !== value && other !== other;
	}
	/**
	* Checks if `value` is likely an `arguments` object.
	*
	* @static
	* @memberOf _
	* @since 0.1.0
	* @category Lang
	* @param {*} value The value to check.
	* @returns {boolean} Returns `true` if `value` is an `arguments` object,
	*  else `false`.
	* @example
	*
	* _.isArguments(function() { return arguments; }());
	* // => true
	*
	* _.isArguments([1, 2, 3]);
	* // => false
	*/
	var isArguments = baseIsArguments(function() {
		return arguments;
	}()) ? baseIsArguments : function(value) {
		return isObjectLike(value) && hasOwnProperty.call(value, "callee") && !propertyIsEnumerable.call(value, "callee");
	};
	/**
	* Checks if `value` is classified as an `Array` object.
	*
	* @static
	* @memberOf _
	* @since 0.1.0
	* @category Lang
	* @param {*} value The value to check.
	* @returns {boolean} Returns `true` if `value` is an array, else `false`.
	* @example
	*
	* _.isArray([1, 2, 3]);
	* // => true
	*
	* _.isArray(document.body.children);
	* // => false
	*
	* _.isArray('abc');
	* // => false
	*
	* _.isArray(_.noop);
	* // => false
	*/
	var isArray = Array.isArray;
	/**
	* Checks if `value` is array-like. A value is considered array-like if it's
	* not a function and has a `value.length` that's an integer greater than or
	* equal to `0` and less than or equal to `Number.MAX_SAFE_INTEGER`.
	*
	* @static
	* @memberOf _
	* @since 4.0.0
	* @category Lang
	* @param {*} value The value to check.
	* @returns {boolean} Returns `true` if `value` is array-like, else `false`.
	* @example
	*
	* _.isArrayLike([1, 2, 3]);
	* // => true
	*
	* _.isArrayLike(document.body.children);
	* // => true
	*
	* _.isArrayLike('abc');
	* // => true
	*
	* _.isArrayLike(_.noop);
	* // => false
	*/
	function isArrayLike(value) {
		return value != null && isLength(value.length) && !isFunction(value);
	}
	/**
	* Checks if `value` is a buffer.
	*
	* @static
	* @memberOf _
	* @since 4.3.0
	* @category Lang
	* @param {*} value The value to check.
	* @returns {boolean} Returns `true` if `value` is a buffer, else `false`.
	* @example
	*
	* _.isBuffer(new Buffer(2));
	* // => true
	*
	* _.isBuffer(new Uint8Array(2));
	* // => false
	*/
	var isBuffer = nativeIsBuffer || stubFalse;
	/**
	* Performs a deep comparison between two values to determine if they are
	* equivalent.
	*
	* **Note:** This method supports comparing arrays, array buffers, booleans,
	* date objects, error objects, maps, numbers, `Object` objects, regexes,
	* sets, strings, symbols, and typed arrays. `Object` objects are compared
	* by their own, not inherited, enumerable properties. Functions and DOM
	* nodes are compared by strict equality, i.e. `===`.
	*
	* @static
	* @memberOf _
	* @since 0.1.0
	* @category Lang
	* @param {*} value The value to compare.
	* @param {*} other The other value to compare.
	* @returns {boolean} Returns `true` if the values are equivalent, else `false`.
	* @example
	*
	* var object = { 'a': 1 };
	* var other = { 'a': 1 };
	*
	* _.isEqual(object, other);
	* // => true
	*
	* object === other;
	* // => false
	*/
	function isEqual(value, other) {
		return baseIsEqual(value, other);
	}
	/**
	* Checks if `value` is classified as a `Function` object.
	*
	* @static
	* @memberOf _
	* @since 0.1.0
	* @category Lang
	* @param {*} value The value to check.
	* @returns {boolean} Returns `true` if `value` is a function, else `false`.
	* @example
	*
	* _.isFunction(_);
	* // => true
	*
	* _.isFunction(/abc/);
	* // => false
	*/
	function isFunction(value) {
		if (!isObject(value)) return false;
		var tag = baseGetTag(value);
		return tag == funcTag || tag == genTag || tag == asyncTag || tag == proxyTag;
	}
	/**
	* Checks if `value` is a valid array-like length.
	*
	* **Note:** This method is loosely based on
	* [`ToLength`](http://ecma-international.org/ecma-262/7.0/#sec-tolength).
	*
	* @static
	* @memberOf _
	* @since 4.0.0
	* @category Lang
	* @param {*} value The value to check.
	* @returns {boolean} Returns `true` if `value` is a valid length, else `false`.
	* @example
	*
	* _.isLength(3);
	* // => true
	*
	* _.isLength(Number.MIN_VALUE);
	* // => false
	*
	* _.isLength(Infinity);
	* // => false
	*
	* _.isLength('3');
	* // => false
	*/
	function isLength(value) {
		return typeof value == "number" && value > -1 && value % 1 == 0 && value <= MAX_SAFE_INTEGER;
	}
	/**
	* Checks if `value` is the
	* [language type](http://www.ecma-international.org/ecma-262/7.0/#sec-ecmascript-language-types)
	* of `Object`. (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
	*
	* @static
	* @memberOf _
	* @since 0.1.0
	* @category Lang
	* @param {*} value The value to check.
	* @returns {boolean} Returns `true` if `value` is an object, else `false`.
	* @example
	*
	* _.isObject({});
	* // => true
	*
	* _.isObject([1, 2, 3]);
	* // => true
	*
	* _.isObject(_.noop);
	* // => true
	*
	* _.isObject(null);
	* // => false
	*/
	function isObject(value) {
		var type = typeof value;
		return value != null && (type == "object" || type == "function");
	}
	/**
	* Checks if `value` is object-like. A value is object-like if it's not `null`
	* and has a `typeof` result of "object".
	*
	* @static
	* @memberOf _
	* @since 4.0.0
	* @category Lang
	* @param {*} value The value to check.
	* @returns {boolean} Returns `true` if `value` is object-like, else `false`.
	* @example
	*
	* _.isObjectLike({});
	* // => true
	*
	* _.isObjectLike([1, 2, 3]);
	* // => true
	*
	* _.isObjectLike(_.noop);
	* // => false
	*
	* _.isObjectLike(null);
	* // => false
	*/
	function isObjectLike(value) {
		return value != null && typeof value == "object";
	}
	/**
	* Checks if `value` is classified as a typed array.
	*
	* @static
	* @memberOf _
	* @since 3.0.0
	* @category Lang
	* @param {*} value The value to check.
	* @returns {boolean} Returns `true` if `value` is a typed array, else `false`.
	* @example
	*
	* _.isTypedArray(new Uint8Array);
	* // => true
	*
	* _.isTypedArray([]);
	* // => false
	*/
	var isTypedArray = nodeIsTypedArray ? baseUnary(nodeIsTypedArray) : baseIsTypedArray;
	/**
	* Creates an array of the own enumerable property names of `object`.
	*
	* **Note:** Non-object values are coerced to objects. See the
	* [ES spec](http://ecma-international.org/ecma-262/7.0/#sec-object.keys)
	* for more details.
	*
	* @static
	* @since 0.1.0
	* @memberOf _
	* @category Object
	* @param {Object} object The object to query.
	* @returns {Array} Returns the array of property names.
	* @example
	*
	* function Foo() {
	*   this.a = 1;
	*   this.b = 2;
	* }
	*
	* Foo.prototype.c = 3;
	*
	* _.keys(new Foo);
	* // => ['a', 'b'] (iteration order is not guaranteed)
	*
	* _.keys('hi');
	* // => ['0', '1']
	*/
	function keys(object) {
		return isArrayLike(object) ? arrayLikeKeys(object) : baseKeys(object);
	}
	/**
	* This method returns a new empty array.
	*
	* @static
	* @memberOf _
	* @since 4.13.0
	* @category Util
	* @returns {Array} Returns the new empty array.
	* @example
	*
	* var arrays = _.times(2, _.stubArray);
	*
	* console.log(arrays);
	* // => [[], []]
	*
	* console.log(arrays[0] === arrays[1]);
	* // => false
	*/
	function stubArray() {
		return [];
	}
	/**
	* This method returns `false`.
	*
	* @static
	* @memberOf _
	* @since 4.13.0
	* @category Util
	* @returns {boolean} Returns `false`.
	* @example
	*
	* _.times(2, _.stubFalse);
	* // => [false, false]
	*/
	function stubFalse() {
		return false;
	}
	module.exports = isEqual;
}));
//#endregion
//#region node_modules/ow/dist/test.js
var require_test = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	const base_predicate_1 = require_base_predicate();
	/**
	Validate the value against the provided predicate.
	
	@hidden
	
	@param value - Value to test.
	@param label - Label which should be used in error messages.
	@param predicate - Predicate to test to value against.
	@param idLabel - If true, the label is a variable or type. Default: true.
	*/
	function test(value, label, predicate, idLabel = true) {
		predicate[base_predicate_1.testSymbol](value, test, label, idLabel);
	}
	exports.default = test;
}));
//#endregion
//#region node_modules/ow/dist/utils/match-shape.js
var require_match_shape = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.exact = exports.partial = void 0;
	const is_1 = require_dist$2();
	const test_1 = require_test();
	const base_predicate_1 = require_base_predicate();
	/**
	Test if the `object` matches the `shape` partially.
	
	@hidden
	
	@param object - Object to test against the provided shape.
	@param shape - Shape to test the object against.
	@param parent - Name of the parent property.
	*/
	function partial(object, shape, parent) {
		try {
			for (const key of Object.keys(shape)) {
				const label = parent ? `${parent}.${key}` : key;
				if ((0, base_predicate_1.isPredicate)(shape[key])) (0, test_1.default)(object[key], label, shape[key]);
				else if (is_1.default.plainObject(shape[key])) {
					const result = partial(object[key], shape[key], label);
					if (result !== true) return result;
				}
			}
			return true;
		} catch (error) {
			return error.message;
		}
	}
	exports.partial = partial;
	/**
	Test if the `object` matches the `shape` exactly.
	
	@hidden
	
	@param object - Object to test against the provided shape.
	@param shape - Shape to test the object against.
	@param parent - Name of the parent property.
	*/
	function exact(object, shape, parent, isArray) {
		try {
			const objectKeys = new Set(Object.keys(object));
			for (const key of Object.keys(shape)) {
				objectKeys.delete(key);
				const label = parent ? `${parent}.${key}` : key;
				if ((0, base_predicate_1.isPredicate)(shape[key])) (0, test_1.default)(object[key], label, shape[key]);
				else if (is_1.default.plainObject(shape[key])) {
					if (!Object.prototype.hasOwnProperty.call(object, key)) return `Expected \`${label}\` to exist`;
					const result = exact(object[key], shape[key], label);
					if (result !== true) return result;
				}
			}
			if (objectKeys.size > 0) {
				const firstKey = [...objectKeys.keys()][0];
				const label = parent ? `${parent}.${firstKey}` : firstKey;
				return `Did not expect ${isArray ? "element" : "property"} \`${label}\` to exist, got \`${object[firstKey]}\``;
			}
			return true;
		} catch (error) {
			return error.message;
		}
	}
	exports.exact = exact;
}));
//#endregion
//#region node_modules/ow/dist/utils/of-type.js
var require_of_type = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	const test_1 = require_test();
	/**
	Test all the values in the collection against a provided predicate.
	
	@hidden
	@param source Source collection to test.
	@param name The name to call the collection of values, such as `values` or `keys`.
	@param predicate Predicate to test every item in the source collection against.
	*/
	exports.default = (source, name, predicate) => {
		try {
			for (const item of source) (0, test_1.default)(item, name, predicate, false);
			return true;
		} catch (error) {
			return error.message;
		}
	};
}));
//#endregion
//#region node_modules/ow/dist/predicates/array.js
var require_array = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.ArrayPredicate = void 0;
	const isEqual = require_lodash_isequal();
	const predicate_1 = require_predicate();
	const match_shape_1 = require_match_shape();
	const of_type_1 = require_of_type();
	var ArrayPredicate = class extends predicate_1.Predicate {
		/**
		@hidden
		*/
		constructor(options) {
			super("array", options);
		}
		/**
		Test an array to have a specific length.
		
		@param length - The length of the array.
		*/
		length(length) {
			return this.addValidator({
				message: (value, label) => `Expected ${label} to have length \`${length}\`, got \`${value.length}\``,
				validator: (value) => value.length === length
			});
		}
		/**
		Test an array to have a minimum length.
		
		@param length - The minimum length of the array.
		*/
		minLength(length) {
			return this.addValidator({
				message: (value, label) => `Expected ${label} to have a minimum length of \`${length}\`, got \`${value.length}\``,
				validator: (value) => value.length >= length,
				negatedMessage: (value, label) => `Expected ${label} to have a maximum length of \`${length - 1}\`, got \`${value.length}\``
			});
		}
		/**
		Test an array to have a maximum length.
		
		@param length - The maximum length of the array.
		*/
		maxLength(length) {
			return this.addValidator({
				message: (value, label) => `Expected ${label} to have a maximum length of \`${length}\`, got \`${value.length}\``,
				validator: (value) => value.length <= length,
				negatedMessage: (value, label) => `Expected ${label} to have a minimum length of \`${length + 1}\`, got \`${value.length}\``
			});
		}
		/**
		Test an array to start with a specific value. The value is tested by identity, not structure.
		
		@param searchElement - The value that should be the start of the array.
		*/
		startsWith(searchElement) {
			return this.addValidator({
				message: (value, label) => `Expected ${label} to start with \`${searchElement}\`, got \`${value[0]}\``,
				validator: (value) => value[0] === searchElement
			});
		}
		/**
		Test an array to end with a specific value. The value is tested by identity, not structure.
		
		@param searchElement - The value that should be the end of the array.
		*/
		endsWith(searchElement) {
			return this.addValidator({
				message: (value, label) => `Expected ${label} to end with \`${searchElement}\`, got \`${value[value.length - 1]}\``,
				validator: (value) => value[value.length - 1] === searchElement
			});
		}
		/**
		Test an array to include all the provided elements. The values are tested by identity, not structure.
		
		@param searchElements - The values that should be included in the array.
		*/
		includes(...searchElements) {
			return this.addValidator({
				message: (value, label) => `Expected ${label} to include all elements of \`${JSON.stringify(searchElements)}\`, got \`${JSON.stringify(value)}\``,
				validator: (value) => searchElements.every((element) => value.includes(element))
			});
		}
		/**
		Test an array to include any of the provided elements. The values are tested by identity, not structure.
		
		@param searchElements - The values that should be included in the array.
		*/
		includesAny(...searchElements) {
			return this.addValidator({
				message: (value, label) => `Expected ${label} to include any element of \`${JSON.stringify(searchElements)}\`, got \`${JSON.stringify(value)}\``,
				validator: (value) => searchElements.some((element) => value.includes(element))
			});
		}
		/**
		Test an array to be empty.
		*/
		get empty() {
			return this.addValidator({
				message: (value, label) => `Expected ${label} to be empty, got \`${JSON.stringify(value)}\``,
				validator: (value) => value.length === 0
			});
		}
		/**
		Test an array to be not empty.
		*/
		get nonEmpty() {
			return this.addValidator({
				message: (_, label) => `Expected ${label} to not be empty`,
				validator: (value) => value.length > 0
			});
		}
		/**
		Test an array to be deeply equal to the provided array.
		
		@param expected - Expected value to match.
		*/
		deepEqual(expected) {
			return this.addValidator({
				message: (value, label) => `Expected ${label} to be deeply equal to \`${JSON.stringify(expected)}\`, got \`${JSON.stringify(value)}\``,
				validator: (value) => isEqual(value, expected)
			});
		}
		/**
		Test all elements in the array to match to provided predicate.
		
		@param predicate - The predicate that should be applied against every individual item.
		
		@example
		```
		ow(['a', 1], ow.array.ofType(ow.any(ow.string, ow.number)));
		```
		*/
		ofType(predicate) {
			return this.addValidator({
				message: (_, label, error) => `(${label}) ${error}`,
				validator: (value) => (0, of_type_1.default)(value, "values", predicate)
			});
		}
		/**
		Test if the elements in the array exactly matches the elements placed at the same indices in the predicates array.
		
		@param predicates - Predicates to test the array against. Describes what the tested array should look like.
		
		@example
		```
		ow(['1', 2], ow.array.exactShape([ow.string, ow.number]));
		```
		*/
		exactShape(predicates) {
			const shape = predicates;
			return this.addValidator({
				message: (_, label, message) => `${message.replace("Expected", "Expected element")} in ${label}`,
				validator: (object) => (0, match_shape_1.exact)(object, shape, void 0, true)
			});
		}
	};
	exports.ArrayPredicate = ArrayPredicate;
}));
//#endregion
//#region node_modules/is-obj/index.js
var require_is_obj = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	module.exports = (value) => {
		const type = typeof value;
		return value !== null && (type === "object" || type === "function");
	};
}));
//#endregion
//#region node_modules/dot-prop/index.js
var require_dot_prop = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	const isObj = require_is_obj();
	const disallowedKeys = /* @__PURE__ */ new Set([
		"__proto__",
		"prototype",
		"constructor"
	]);
	const isValidPath = (pathSegments) => !pathSegments.some((segment) => disallowedKeys.has(segment));
	function getPathSegments(path) {
		const pathArray = path.split(".");
		const parts = [];
		for (let i = 0; i < pathArray.length; i++) {
			let p = pathArray[i];
			while (p[p.length - 1] === "\\" && pathArray[i + 1] !== void 0) {
				p = p.slice(0, -1) + ".";
				p += pathArray[++i];
			}
			parts.push(p);
		}
		if (!isValidPath(parts)) return [];
		return parts;
	}
	module.exports = {
		get(object, path, value) {
			if (!isObj(object) || typeof path !== "string") return value === void 0 ? object : value;
			const pathArray = getPathSegments(path);
			if (pathArray.length === 0) return;
			for (let i = 0; i < pathArray.length; i++) {
				object = object[pathArray[i]];
				if (object === void 0 || object === null) {
					if (i !== pathArray.length - 1) return value;
					break;
				}
			}
			return object === void 0 ? value : object;
		},
		set(object, path, value) {
			if (!isObj(object) || typeof path !== "string") return object;
			const root = object;
			const pathArray = getPathSegments(path);
			for (let i = 0; i < pathArray.length; i++) {
				const p = pathArray[i];
				if (!isObj(object[p])) object[p] = {};
				if (i === pathArray.length - 1) object[p] = value;
				object = object[p];
			}
			return root;
		},
		delete(object, path) {
			if (!isObj(object) || typeof path !== "string") return false;
			const pathArray = getPathSegments(path);
			for (let i = 0; i < pathArray.length; i++) {
				const p = pathArray[i];
				if (i === pathArray.length - 1) {
					delete object[p];
					return true;
				}
				object = object[p];
				if (!isObj(object)) return false;
			}
		},
		has(object, path) {
			if (!isObj(object) || typeof path !== "string") return false;
			const pathArray = getPathSegments(path);
			if (pathArray.length === 0) return false;
			for (let i = 0; i < pathArray.length; i++) if (isObj(object)) {
				if (!(pathArray[i] in object)) return false;
				object = object[pathArray[i]];
			} else return false;
			return true;
		}
	};
}));
//#endregion
//#region node_modules/ow/dist/utils/has-items.js
var require_has_items = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	/**
	Retrieve the missing values in a collection based on an array of items.
	
	@hidden
	
	@param source - Source collection to search through.
	@param items - Items to search for.
	@param maxValues - Maximum number of values after the search process is stopped. Default: 5.
	*/
	exports.default = (source, items, maxValues = 5) => {
		const missingValues = [];
		for (const value of items) {
			if (source.has(value)) continue;
			missingValues.push(value);
			if (missingValues.length === maxValues) return missingValues;
		}
		return missingValues.length === 0 ? true : missingValues;
	};
}));
//#endregion
//#region node_modules/ow/dist/utils/of-type-deep.js
var require_of_type_deep = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	const is_1 = require_dist$2();
	const test_1 = require_test();
	const ofTypeDeep = (object, predicate) => {
		if (!is_1.default.plainObject(object)) {
			(0, test_1.default)(object, "deep values", predicate, false);
			return true;
		}
		return Object.values(object).every((value) => ofTypeDeep(value, predicate));
	};
	/**
	Test all the values in the object against a provided predicate.
	
	@hidden
	
	@param predicate - Predicate to test every value in the given object against.
	*/
	exports.default = (object, predicate) => {
		try {
			return ofTypeDeep(object, predicate);
		} catch (error) {
			return error.message;
		}
	};
}));
//#endregion
//#region node_modules/ow/dist/predicates/object.js
var require_object = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.ObjectPredicate = void 0;
	const is_1 = require_dist$2();
	const dotProp = require_dot_prop();
	const isEqual = require_lodash_isequal();
	const has_items_1 = require_has_items();
	const of_type_1 = require_of_type();
	const of_type_deep_1 = require_of_type_deep();
	const match_shape_1 = require_match_shape();
	const predicate_1 = require_predicate();
	var ObjectPredicate = class extends predicate_1.Predicate {
		/**
		@hidden
		*/
		constructor(options) {
			super("object", options);
		}
		/**
		Test if an Object is a plain object.
		*/
		get plain() {
			return this.addValidator({
				message: (_, label) => `Expected ${label} to be a plain object`,
				validator: (object) => is_1.default.plainObject(object)
			});
		}
		/**
		Test an object to be empty.
		*/
		get empty() {
			return this.addValidator({
				message: (object, label) => `Expected ${label} to be empty, got \`${JSON.stringify(object)}\``,
				validator: (object) => Object.keys(object).length === 0
			});
		}
		/**
		Test an object to be not empty.
		*/
		get nonEmpty() {
			return this.addValidator({
				message: (_, label) => `Expected ${label} to not be empty`,
				validator: (object) => Object.keys(object).length > 0
			});
		}
		/**
		Test all the values in the object to match the provided predicate.
		
		@param predicate - The predicate that should be applied against every value in the object.
		*/
		valuesOfType(predicate) {
			return this.addValidator({
				message: (_, label, error) => `(${label}) ${error}`,
				validator: (object) => (0, of_type_1.default)(Object.values(object), "values", predicate)
			});
		}
		/**
		Test all the values in the object deeply to match the provided predicate.
		
		@param predicate - The predicate that should be applied against every value in the object.
		*/
		deepValuesOfType(predicate) {
			return this.addValidator({
				message: (_, label, error) => `(${label}) ${error}`,
				validator: (object) => (0, of_type_deep_1.default)(object, predicate)
			});
		}
		/**
		Test an object to be deeply equal to the provided object.
		
		@param expected - Expected object to match.
		*/
		deepEqual(expected) {
			return this.addValidator({
				message: (object, label) => `Expected ${label} to be deeply equal to \`${JSON.stringify(expected)}\`, got \`${JSON.stringify(object)}\``,
				validator: (object) => isEqual(object, expected)
			});
		}
		/**
		Test an object to be of a specific instance type.
		
		@param instance - The expected instance type of the object.
		*/
		instanceOf(instance) {
			return this.addValidator({
				message: (object, label) => {
					var _a;
					let { name } = (_a = object === null || object === void 0 ? void 0 : object.constructor) !== null && _a !== void 0 ? _a : {};
					if (!name || name === "Object") name = JSON.stringify(object);
					return `Expected ${label} \`${name}\` to be of type \`${instance.name}\``;
				},
				validator: (object) => object instanceof instance
			});
		}
		/**
		Test an object to include all the provided keys. You can use [dot-notation](https://github.com/sindresorhus/dot-prop) in a key to access nested properties.
		
		@param keys - The keys that should be present in the object.
		*/
		hasKeys(...keys) {
			return this.addValidator({
				message: (_, label, missingKeys) => `Expected ${label} to have keys \`${JSON.stringify(missingKeys)}\``,
				validator: (object) => (0, has_items_1.default)({ has: (item) => dotProp.has(object, item) }, keys)
			});
		}
		/**
		Test an object to include any of the provided keys. You can use [dot-notation](https://github.com/sindresorhus/dot-prop) in a key to access nested properties.
		
		@param keys - The keys that could be a key in the object.
		*/
		hasAnyKeys(...keys) {
			return this.addValidator({
				message: (_, label) => `Expected ${label} to have any key of \`${JSON.stringify(keys)}\``,
				validator: (object) => keys.some((key) => dotProp.has(object, key))
			});
		}
		/**
		Test an object to match the `shape` partially. This means that it ignores unexpected properties. The shape comparison is deep.
		
		The shape is an object which describes how the tested object should look like. The keys are the same as the source object and the values are predicates.
		
		@param shape - Shape to test the object against.
		
		@example
		```
		import ow from 'ow';
		
		const object = {
		unicorn: '🦄',
		rainbow: '🌈'
		};
		
		ow(object, ow.object.partialShape({
		unicorn: ow.string
		}));
		```
		*/
		partialShape(shape) {
			return this.addValidator({
				message: (_, label, message) => `${message.replace("Expected", "Expected property")} in ${label}`,
				validator: (object) => (0, match_shape_1.partial)(object, shape)
			});
		}
		/**
		Test an object to match the `shape` exactly. This means that will fail if it comes across unexpected properties. The shape comparison is deep.
		
		The shape is an object which describes how the tested object should look like. The keys are the same as the source object and the values are predicates.
		
		@param shape - Shape to test the object against.
		
		@example
		```
		import ow from 'ow';
		
		ow({unicorn: '🦄'}, ow.object.exactShape({
		unicorn: ow.string
		}));
		```
		*/
		exactShape(shape) {
			return this.addValidator({
				message: (_, label, message) => `${message.replace("Expected", "Expected property")} in ${label}`,
				validator: (object) => (0, match_shape_1.exact)(object, shape)
			});
		}
	};
	exports.ObjectPredicate = ObjectPredicate;
}));
//#endregion
//#region node_modules/ow/dist/predicates/date.js
var require_date = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.DatePredicate = void 0;
	const predicate_1 = require_predicate();
	var DatePredicate = class extends predicate_1.Predicate {
		/**
		@hidden
		*/
		constructor(options) {
			super("date", options);
		}
		/**
		Test a date to be before another date.
		
		@param date - Maximum value.
		*/
		before(date) {
			return this.addValidator({
				message: (value, label) => `Expected ${label} ${value.toISOString()} to be before ${date.toISOString()}`,
				validator: (value) => value.getTime() < date.getTime()
			});
		}
		/**
		Test a date to be before another date.
		
		@param date - Minimum value.
		*/
		after(date) {
			return this.addValidator({
				message: (value, label) => `Expected ${label} ${value.toISOString()} to be after ${date.toISOString()}`,
				validator: (value) => value.getTime() > date.getTime()
			});
		}
	};
	exports.DatePredicate = DatePredicate;
}));
//#endregion
//#region node_modules/ow/dist/predicates/error.js
var require_error = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.ErrorPredicate = void 0;
	const predicate_1 = require_predicate();
	var ErrorPredicate = class extends predicate_1.Predicate {
		/**
		@hidden
		*/
		constructor(options) {
			super("error", options);
		}
		/**
		Test an error to have a specific name.
		
		@param expected - Expected name of the Error.
		*/
		name(expected) {
			return this.addValidator({
				message: (error, label) => `Expected ${label} to have name \`${expected}\`, got \`${error.name}\``,
				validator: (error) => error.name === expected
			});
		}
		/**
		Test an error to have a specific message.
		
		@param expected - Expected message of the Error.
		*/
		message(expected) {
			return this.addValidator({
				message: (error, label) => `Expected ${label} message to be \`${expected}\`, got \`${error.message}\``,
				validator: (error) => error.message === expected
			});
		}
		/**
		Test the error message to include a specific message.
		
		@param message - Message that should be included in the error.
		*/
		messageIncludes(message) {
			return this.addValidator({
				message: (error, label) => `Expected ${label} message to include \`${message}\`, got \`${error.message}\``,
				validator: (error) => error.message.includes(message)
			});
		}
		/**
		Test the error object to have specific keys.
		
		@param keys - One or more keys which should be part of the error object.
		*/
		hasKeys(...keys) {
			return this.addValidator({
				message: (_, label) => `Expected ${label} message to have keys \`${keys.join("`, `")}\``,
				validator: (error) => keys.every((key) => Object.prototype.hasOwnProperty.call(error, key))
			});
		}
		/**
		Test an error to be of a specific instance type.
		
		@param instance - The expected instance type of the error.
		*/
		instanceOf(instance) {
			return this.addValidator({
				message: (error, label) => `Expected ${label} \`${error.name}\` to be of type \`${instance.name}\``,
				validator: (error) => error instanceof instance
			});
		}
		/**
		Test an Error to be a TypeError.
		*/
		get typeError() {
			return this.instanceOf(TypeError);
		}
		/**
		Test an Error to be an EvalError.
		*/
		get evalError() {
			return this.instanceOf(EvalError);
		}
		/**
		Test an Error to be a RangeError.
		*/
		get rangeError() {
			return this.instanceOf(RangeError);
		}
		/**
		Test an Error to be a ReferenceError.
		*/
		get referenceError() {
			return this.instanceOf(ReferenceError);
		}
		/**
		Test an Error to be a SyntaxError.
		*/
		get syntaxError() {
			return this.instanceOf(SyntaxError);
		}
		/**
		Test an Error to be a URIError.
		*/
		get uriError() {
			return this.instanceOf(URIError);
		}
	};
	exports.ErrorPredicate = ErrorPredicate;
}));
//#endregion
//#region node_modules/ow/dist/predicates/map.js
var require_map = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.MapPredicate = void 0;
	const isEqual = require_lodash_isequal();
	const has_items_1 = require_has_items();
	const of_type_1 = require_of_type();
	const predicate_1 = require_predicate();
	var MapPredicate = class extends predicate_1.Predicate {
		/**
		@hidden
		*/
		constructor(options) {
			super("Map", options);
		}
		/**
		Test a Map to have a specific size.
		
		@param size - The size of the Map.
		*/
		size(size) {
			return this.addValidator({
				message: (map, label) => `Expected ${label} to have size \`${size}\`, got \`${map.size}\``,
				validator: (map) => map.size === size
			});
		}
		/**
		Test an Map to have a minimum size.
		
		@param size - The minimum size of the Map.
		*/
		minSize(size) {
			return this.addValidator({
				message: (map, label) => `Expected ${label} to have a minimum size of \`${size}\`, got \`${map.size}\``,
				validator: (map) => map.size >= size,
				negatedMessage: (map, label) => `Expected ${label} to have a maximum size of \`${size - 1}\`, got \`${map.size}\``
			});
		}
		/**
		Test an Map to have a maximum size.
		
		@param size - The maximum size of the Map.
		*/
		maxSize(size) {
			return this.addValidator({
				message: (map, label) => `Expected ${label} to have a maximum size of \`${size}\`, got \`${map.size}\``,
				validator: (map) => map.size <= size,
				negatedMessage: (map, label) => `Expected ${label} to have a minimum size of \`${size + 1}\`, got \`${map.size}\``
			});
		}
		/**
		Test a Map to include all the provided keys. The keys are tested by identity, not structure.
		
		@param keys - The keys that should be a key in the Map.
		*/
		hasKeys(...keys) {
			return this.addValidator({
				message: (_, label, missingKeys) => `Expected ${label} to have keys \`${JSON.stringify(missingKeys)}\``,
				validator: (map) => (0, has_items_1.default)(map, keys)
			});
		}
		/**
		Test a Map to include any of the provided keys. The keys are tested by identity, not structure.
		
		@param keys - The keys that could be a key in the Map.
		*/
		hasAnyKeys(...keys) {
			return this.addValidator({
				message: (_, label) => `Expected ${label} to have any key of \`${JSON.stringify(keys)}\``,
				validator: (map) => keys.some((key) => map.has(key))
			});
		}
		/**
		Test a Map to include all the provided values. The values are tested by identity, not structure.
		
		@param values - The values that should be a value in the Map.
		*/
		hasValues(...values) {
			return this.addValidator({
				message: (_, label, missingValues) => `Expected ${label} to have values \`${JSON.stringify(missingValues)}\``,
				validator: (map) => (0, has_items_1.default)(new Set(map.values()), values)
			});
		}
		/**
		Test a Map to include any of the provided values. The values are tested by identity, not structure.
		
		@param values - The values that could be a value in the Map.
		*/
		hasAnyValues(...values) {
			return this.addValidator({
				message: (_, label) => `Expected ${label} to have any value of \`${JSON.stringify(values)}\``,
				validator: (map) => {
					const valueSet = new Set(map.values());
					return values.some((key) => valueSet.has(key));
				}
			});
		}
		/**
		Test all the keys in the Map to match the provided predicate.
		
		@param predicate - The predicate that should be applied against every key in the Map.
		*/
		keysOfType(predicate) {
			return this.addValidator({
				message: (_, label, error) => `(${label}) ${error}`,
				validator: (map) => (0, of_type_1.default)(map.keys(), "keys", predicate)
			});
		}
		/**
		Test all the values in the Map to match the provided predicate.
		
		@param predicate - The predicate that should be applied against every value in the Map.
		*/
		valuesOfType(predicate) {
			return this.addValidator({
				message: (_, label, error) => `(${label}) ${error}`,
				validator: (map) => (0, of_type_1.default)(map.values(), "values", predicate)
			});
		}
		/**
		Test a Map to be empty.
		*/
		get empty() {
			return this.addValidator({
				message: (map, label) => `Expected ${label} to be empty, got \`${JSON.stringify([...map])}\``,
				validator: (map) => map.size === 0
			});
		}
		/**
		Test a Map to be not empty.
		*/
		get nonEmpty() {
			return this.addValidator({
				message: (_, label) => `Expected ${label} to not be empty`,
				validator: (map) => map.size > 0
			});
		}
		/**
		Test a Map to be deeply equal to the provided Map.
		
		@param expected - Expected Map to match.
		*/
		deepEqual(expected) {
			return this.addValidator({
				message: (map, label) => `Expected ${label} to be deeply equal to \`${JSON.stringify([...expected])}\`, got \`${JSON.stringify([...map])}\``,
				validator: (map) => isEqual(map, expected)
			});
		}
	};
	exports.MapPredicate = MapPredicate;
}));
//#endregion
//#region node_modules/ow/dist/predicates/weak-map.js
var require_weak_map = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.WeakMapPredicate = void 0;
	const has_items_1 = require_has_items();
	const predicate_1 = require_predicate();
	var WeakMapPredicate = class extends predicate_1.Predicate {
		/**
		@hidden
		*/
		constructor(options) {
			super("WeakMap", options);
		}
		/**
		Test a WeakMap to include all the provided keys. The keys are tested by identity, not structure.
		
		@param keys - The keys that should be a key in the WeakMap.
		*/
		hasKeys(...keys) {
			return this.addValidator({
				message: (_, label, missingKeys) => `Expected ${label} to have keys \`${JSON.stringify(missingKeys)}\``,
				validator: (map) => (0, has_items_1.default)(map, keys)
			});
		}
		/**
		Test a WeakMap to include any of the provided keys. The keys are tested by identity, not structure.
		
		@param keys - The keys that could be a key in the WeakMap.
		*/
		hasAnyKeys(...keys) {
			return this.addValidator({
				message: (_, label) => `Expected ${label} to have any key of \`${JSON.stringify(keys)}\``,
				validator: (map) => keys.some((key) => map.has(key))
			});
		}
	};
	exports.WeakMapPredicate = WeakMapPredicate;
}));
//#endregion
//#region node_modules/ow/dist/predicates/set.js
var require_set = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.SetPredicate = void 0;
	const isEqual = require_lodash_isequal();
	const has_items_1 = require_has_items();
	const of_type_1 = require_of_type();
	const predicate_1 = require_predicate();
	var SetPredicate = class extends predicate_1.Predicate {
		/**
		@hidden
		*/
		constructor(options) {
			super("Set", options);
		}
		/**
		Test a Set to have a specific size.
		
		@param size - The size of the Set.
		*/
		size(size) {
			return this.addValidator({
				message: (set, label) => `Expected ${label} to have size \`${size}\`, got \`${set.size}\``,
				validator: (set) => set.size === size
			});
		}
		/**
		Test a Set to have a minimum size.
		
		@param size - The minimum size of the Set.
		*/
		minSize(size) {
			return this.addValidator({
				message: (set, label) => `Expected ${label} to have a minimum size of \`${size}\`, got \`${set.size}\``,
				validator: (set) => set.size >= size,
				negatedMessage: (set, label) => `Expected ${label} to have a maximum size of \`${size - 1}\`, got \`${set.size}\``
			});
		}
		/**
		Test a Set to have a maximum size.
		
		@param size - The maximum size of the Set.
		*/
		maxSize(size) {
			return this.addValidator({
				message: (set, label) => `Expected ${label} to have a maximum size of \`${size}\`, got \`${set.size}\``,
				validator: (set) => set.size <= size,
				negatedMessage: (set, label) => `Expected ${label} to have a minimum size of \`${size + 1}\`, got \`${set.size}\``
			});
		}
		/**
		Test a Set to include all the provided items. The items are tested by identity, not structure.
		
		@param items - The items that should be a item in the Set.
		*/
		has(...items) {
			return this.addValidator({
				message: (_, label, missingItems) => `Expected ${label} to have items \`${JSON.stringify(missingItems)}\``,
				validator: (set) => (0, has_items_1.default)(set, items)
			});
		}
		/**
		Test a Set to include any of the provided items. The items are tested by identity, not structure.
		
		@param items - The items that could be a item in the Set.
		*/
		hasAny(...items) {
			return this.addValidator({
				message: (_, label) => `Expected ${label} to have any item of \`${JSON.stringify(items)}\``,
				validator: (set) => items.some((item) => set.has(item))
			});
		}
		/**
		Test all the items in the Set to match the provided predicate.
		
		@param predicate - The predicate that should be applied against every item in the Set.
		*/
		ofType(predicate) {
			return this.addValidator({
				message: (_, label, error) => `(${label}) ${error}`,
				validator: (set) => (0, of_type_1.default)(set, "values", predicate)
			});
		}
		/**
		Test a Set to be empty.
		*/
		get empty() {
			return this.addValidator({
				message: (set, label) => `Expected ${label} to be empty, got \`${JSON.stringify([...set])}\``,
				validator: (set) => set.size === 0
			});
		}
		/**
		Test a Set to be not empty.
		*/
		get nonEmpty() {
			return this.addValidator({
				message: (_, label) => `Expected ${label} to not be empty`,
				validator: (set) => set.size > 0
			});
		}
		/**
		Test a Set to be deeply equal to the provided Set.
		
		@param expected - Expected Set to match.
		*/
		deepEqual(expected) {
			return this.addValidator({
				message: (set, label) => `Expected ${label} to be deeply equal to \`${JSON.stringify([...expected])}\`, got \`${JSON.stringify([...set])}\``,
				validator: (set) => isEqual(set, expected)
			});
		}
	};
	exports.SetPredicate = SetPredicate;
}));
//#endregion
//#region node_modules/ow/dist/predicates/weak-set.js
var require_weak_set = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.WeakSetPredicate = void 0;
	const has_items_1 = require_has_items();
	const predicate_1 = require_predicate();
	var WeakSetPredicate = class extends predicate_1.Predicate {
		/**
		@hidden
		*/
		constructor(options) {
			super("WeakSet", options);
		}
		/**
		Test a WeakSet to include all the provided items. The items are tested by identity, not structure.
		
		@param items - The items that should be a item in the WeakSet.
		*/
		has(...items) {
			return this.addValidator({
				message: (_, label, missingItems) => `Expected ${label} to have items \`${JSON.stringify(missingItems)}\``,
				validator: (set) => (0, has_items_1.default)(set, items)
			});
		}
		/**
		Test a WeakSet to include any of the provided items. The items are tested by identity, not structure.
		
		@param items - The items that could be a item in the WeakSet.
		*/
		hasAny(...items) {
			return this.addValidator({
				message: (_, label) => `Expected ${label} to have any item of \`${JSON.stringify(items)}\``,
				validator: (set) => items.some((item) => set.has(item))
			});
		}
	};
	exports.WeakSetPredicate = WeakSetPredicate;
}));
//#endregion
//#region node_modules/ow/dist/predicates/typed-array.js
var require_typed_array = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.TypedArrayPredicate = void 0;
	const predicate_1 = require_predicate();
	var TypedArrayPredicate = class extends predicate_1.Predicate {
		/**
		Test a typed array to have a specific byte length.
		
		@param byteLength - The byte length of the typed array.
		*/
		byteLength(byteLength) {
			return this.addValidator({
				message: (value, label) => `Expected ${label} to have byte length of \`${byteLength}\`, got \`${value.byteLength}\``,
				validator: (value) => value.byteLength === byteLength
			});
		}
		/**
		Test a typed array to have a minimum byte length.
		
		@param byteLength - The minimum byte length of the typed array.
		*/
		minByteLength(byteLength) {
			return this.addValidator({
				message: (value, label) => `Expected ${label} to have a minimum byte length of \`${byteLength}\`, got \`${value.byteLength}\``,
				validator: (value) => value.byteLength >= byteLength,
				negatedMessage: (value, label) => `Expected ${label} to have a maximum byte length of \`${byteLength - 1}\`, got \`${value.byteLength}\``
			});
		}
		/**
		Test a typed array to have a minimum byte length.
		
		@param length - The minimum byte length of the typed array.
		*/
		maxByteLength(byteLength) {
			return this.addValidator({
				message: (value, label) => `Expected ${label} to have a maximum byte length of \`${byteLength}\`, got \`${value.byteLength}\``,
				validator: (value) => value.byteLength <= byteLength,
				negatedMessage: (value, label) => `Expected ${label} to have a minimum byte length of \`${byteLength + 1}\`, got \`${value.byteLength}\``
			});
		}
		/**
		Test a typed array to have a specific length.
		
		@param length - The length of the typed array.
		*/
		length(length) {
			return this.addValidator({
				message: (value, label) => `Expected ${label} to have length \`${length}\`, got \`${value.length}\``,
				validator: (value) => value.length === length
			});
		}
		/**
		Test a typed array to have a minimum length.
		
		@param length - The minimum length of the typed array.
		*/
		minLength(length) {
			return this.addValidator({
				message: (value, label) => `Expected ${label} to have a minimum length of \`${length}\`, got \`${value.length}\``,
				validator: (value) => value.length >= length,
				negatedMessage: (value, label) => `Expected ${label} to have a maximum length of \`${length - 1}\`, got \`${value.length}\``
			});
		}
		/**
		Test a typed array to have a maximum length.
		
		@param length - The maximum length of the typed array.
		*/
		maxLength(length) {
			return this.addValidator({
				message: (value, label) => `Expected ${label} to have a maximum length of \`${length}\`, got \`${value.length}\``,
				validator: (value) => value.length <= length,
				negatedMessage: (value, label) => `Expected ${label} to have a minimum length of \`${length + 1}\`, got \`${value.length}\``
			});
		}
	};
	exports.TypedArrayPredicate = TypedArrayPredicate;
}));
//#endregion
//#region node_modules/ow/dist/predicates/array-buffer.js
var require_array_buffer = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.ArrayBufferPredicate = void 0;
	const predicate_1 = require_predicate();
	var ArrayBufferPredicate = class extends predicate_1.Predicate {
		/**
		Test an array buffer to have a specific byte length.
		
		@param byteLength - The byte length of the array buffer.
		*/
		byteLength(byteLength) {
			return this.addValidator({
				message: (value, label) => `Expected ${label} to have byte length of \`${byteLength}\`, got \`${value.byteLength}\``,
				validator: (value) => value.byteLength === byteLength
			});
		}
		/**
		Test an array buffer to have a minimum byte length.
		
		@param byteLength - The minimum byte length of the array buffer.
		*/
		minByteLength(byteLength) {
			return this.addValidator({
				message: (value, label) => `Expected ${label} to have a minimum byte length of \`${byteLength}\`, got \`${value.byteLength}\``,
				validator: (value) => value.byteLength >= byteLength,
				negatedMessage: (value, label) => `Expected ${label} to have a maximum byte length of \`${byteLength - 1}\`, got \`${value.byteLength}\``
			});
		}
		/**
		Test an array buffer to have a minimum byte length.
		
		@param length - The minimum byte length of the array buffer.
		*/
		maxByteLength(byteLength) {
			return this.addValidator({
				message: (value, label) => `Expected ${label} to have a maximum byte length of \`${byteLength}\`, got \`${value.byteLength}\``,
				validator: (value) => value.byteLength <= byteLength,
				negatedMessage: (value, label) => `Expected ${label} to have a minimum byte length of \`${byteLength + 1}\`, got \`${value.byteLength}\``
			});
		}
	};
	exports.ArrayBufferPredicate = ArrayBufferPredicate;
}));
//#endregion
//#region node_modules/ow/dist/predicates/data-view.js
var require_data_view = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.DataViewPredicate = void 0;
	const predicate_1 = require_predicate();
	var DataViewPredicate = class extends predicate_1.Predicate {
		/**
		@hidden
		*/
		constructor(options) {
			super("DataView", options);
		}
		/**
		Test a DataView to have a specific byte length.
		
		@param byteLength - The byte length of the DataView.
		*/
		byteLength(byteLength) {
			return this.addValidator({
				message: (value, label) => `Expected ${label} to have byte length of \`${byteLength}\`, got \`${value.byteLength}\``,
				validator: (value) => value.byteLength === byteLength
			});
		}
		/**
		Test a DataView to have a minimum byte length.
		
		@param byteLength - The minimum byte length of the DataView.
		*/
		minByteLength(byteLength) {
			return this.addValidator({
				message: (value, label) => `Expected ${label} to have a minimum byte length of \`${byteLength}\`, got \`${value.byteLength}\``,
				validator: (value) => value.byteLength >= byteLength,
				negatedMessage: (value, label) => `Expected ${label} to have a maximum byte length of \`${byteLength - 1}\`, got \`${value.byteLength}\``
			});
		}
		/**
		Test a DataView to have a minimum byte length.
		
		@param length - The minimum byte length of the DataView.
		*/
		maxByteLength(byteLength) {
			return this.addValidator({
				message: (value, label) => `Expected ${label} to have a maximum byte length of \`${byteLength}\`, got \`${value.byteLength}\``,
				validator: (value) => value.byteLength <= byteLength,
				negatedMessage: (value, label) => `Expected ${label} to have a minimum byte length of \`${byteLength + 1}\`, got \`${value.byteLength}\``
			});
		}
	};
	exports.DataViewPredicate = DataViewPredicate;
}));
//#endregion
//#region node_modules/ow/dist/predicates/any.js
var require_any = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.AnyPredicate = void 0;
	const argument_error_1 = require_argument_error();
	const base_predicate_1 = require_base_predicate();
	const generate_argument_error_message_1 = require_generate_argument_error_message();
	/**
	@hidden
	*/
	var AnyPredicate = class {
		constructor(predicates, options = {}) {
			Object.defineProperty(this, "predicates", {
				enumerable: true,
				configurable: true,
				writable: true,
				value: predicates
			});
			Object.defineProperty(this, "options", {
				enumerable: true,
				configurable: true,
				writable: true,
				value: options
			});
		}
		[base_predicate_1.testSymbol](value, main, label, idLabel) {
			const errors = /* @__PURE__ */ new Map();
			for (const predicate of this.predicates) try {
				main(value, label, predicate, idLabel);
				return;
			} catch (error) {
				if (value === void 0 && this.options.optional === true) return;
				if (error instanceof argument_error_1.ArgumentError) for (const [key, value] of error.validationErrors.entries()) {
					const alreadyPresent = errors.get(key);
					errors.set(key, /* @__PURE__ */ new Set([...alreadyPresent !== null && alreadyPresent !== void 0 ? alreadyPresent : [], ...value]));
				}
			}
			if (errors.size > 0) {
				const message = (0, generate_argument_error_message_1.generateArgumentErrorMessage)(errors, true);
				throw new argument_error_1.ArgumentError(`Any predicate failed with the following errors:\n${message}`, main, errors);
			}
		}
	};
	exports.AnyPredicate = AnyPredicate;
}));
//#endregion
//#region node_modules/ow/dist/predicates.js
var require_predicates = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.AnyPredicate = exports.DataViewPredicate = exports.ArrayBufferPredicate = exports.TypedArrayPredicate = exports.WeakSetPredicate = exports.SetPredicate = exports.WeakMapPredicate = exports.MapPredicate = exports.ErrorPredicate = exports.DatePredicate = exports.ObjectPredicate = exports.ArrayPredicate = exports.BooleanPredicate = exports.BigIntPredicate = exports.NumberPredicate = exports.StringPredicate = void 0;
	const string_1 = require_string();
	Object.defineProperty(exports, "StringPredicate", {
		enumerable: true,
		get: function() {
			return string_1.StringPredicate;
		}
	});
	const number_1 = require_number();
	Object.defineProperty(exports, "NumberPredicate", {
		enumerable: true,
		get: function() {
			return number_1.NumberPredicate;
		}
	});
	const bigint_1 = require_bigint();
	Object.defineProperty(exports, "BigIntPredicate", {
		enumerable: true,
		get: function() {
			return bigint_1.BigIntPredicate;
		}
	});
	const boolean_1 = require_boolean();
	Object.defineProperty(exports, "BooleanPredicate", {
		enumerable: true,
		get: function() {
			return boolean_1.BooleanPredicate;
		}
	});
	const predicate_1 = require_predicate();
	const array_1 = require_array();
	Object.defineProperty(exports, "ArrayPredicate", {
		enumerable: true,
		get: function() {
			return array_1.ArrayPredicate;
		}
	});
	const object_1 = require_object();
	Object.defineProperty(exports, "ObjectPredicate", {
		enumerable: true,
		get: function() {
			return object_1.ObjectPredicate;
		}
	});
	const date_1 = require_date();
	Object.defineProperty(exports, "DatePredicate", {
		enumerable: true,
		get: function() {
			return date_1.DatePredicate;
		}
	});
	const error_1 = require_error();
	Object.defineProperty(exports, "ErrorPredicate", {
		enumerable: true,
		get: function() {
			return error_1.ErrorPredicate;
		}
	});
	const map_1 = require_map();
	Object.defineProperty(exports, "MapPredicate", {
		enumerable: true,
		get: function() {
			return map_1.MapPredicate;
		}
	});
	const weak_map_1 = require_weak_map();
	Object.defineProperty(exports, "WeakMapPredicate", {
		enumerable: true,
		get: function() {
			return weak_map_1.WeakMapPredicate;
		}
	});
	const set_1 = require_set();
	Object.defineProperty(exports, "SetPredicate", {
		enumerable: true,
		get: function() {
			return set_1.SetPredicate;
		}
	});
	const weak_set_1 = require_weak_set();
	Object.defineProperty(exports, "WeakSetPredicate", {
		enumerable: true,
		get: function() {
			return weak_set_1.WeakSetPredicate;
		}
	});
	const typed_array_1 = require_typed_array();
	Object.defineProperty(exports, "TypedArrayPredicate", {
		enumerable: true,
		get: function() {
			return typed_array_1.TypedArrayPredicate;
		}
	});
	const array_buffer_1 = require_array_buffer();
	Object.defineProperty(exports, "ArrayBufferPredicate", {
		enumerable: true,
		get: function() {
			return array_buffer_1.ArrayBufferPredicate;
		}
	});
	const data_view_1 = require_data_view();
	Object.defineProperty(exports, "DataViewPredicate", {
		enumerable: true,
		get: function() {
			return data_view_1.DataViewPredicate;
		}
	});
	const any_1 = require_any();
	Object.defineProperty(exports, "AnyPredicate", {
		enumerable: true,
		get: function() {
			return any_1.AnyPredicate;
		}
	});
	exports.default = (object, options) => {
		Object.defineProperties(object, {
			string: { get: () => new string_1.StringPredicate(options) },
			number: { get: () => new number_1.NumberPredicate(options) },
			bigint: { get: () => new bigint_1.BigIntPredicate(options) },
			boolean: { get: () => new boolean_1.BooleanPredicate(options) },
			undefined: { get: () => new predicate_1.Predicate("undefined", options) },
			null: { get: () => new predicate_1.Predicate("null", options) },
			nullOrUndefined: { get: () => new predicate_1.Predicate("nullOrUndefined", options) },
			nan: { get: () => new predicate_1.Predicate("nan", options) },
			symbol: { get: () => new predicate_1.Predicate("symbol", options) },
			array: { get: () => new array_1.ArrayPredicate(options) },
			object: { get: () => new object_1.ObjectPredicate(options) },
			date: { get: () => new date_1.DatePredicate(options) },
			error: { get: () => new error_1.ErrorPredicate(options) },
			map: { get: () => new map_1.MapPredicate(options) },
			weakMap: { get: () => new weak_map_1.WeakMapPredicate(options) },
			set: { get: () => new set_1.SetPredicate(options) },
			weakSet: { get: () => new weak_set_1.WeakSetPredicate(options) },
			function: { get: () => new predicate_1.Predicate("Function", options) },
			buffer: { get: () => new predicate_1.Predicate("Buffer", options) },
			regExp: { get: () => new predicate_1.Predicate("RegExp", options) },
			promise: { get: () => new predicate_1.Predicate("Promise", options) },
			typedArray: { get: () => new typed_array_1.TypedArrayPredicate("TypedArray", options) },
			int8Array: { get: () => new typed_array_1.TypedArrayPredicate("Int8Array", options) },
			uint8Array: { get: () => new typed_array_1.TypedArrayPredicate("Uint8Array", options) },
			uint8ClampedArray: { get: () => new typed_array_1.TypedArrayPredicate("Uint8ClampedArray", options) },
			int16Array: { get: () => new typed_array_1.TypedArrayPredicate("Int16Array", options) },
			uint16Array: { get: () => new typed_array_1.TypedArrayPredicate("Uint16Array", options) },
			int32Array: { get: () => new typed_array_1.TypedArrayPredicate("Int32Array", options) },
			uint32Array: { get: () => new typed_array_1.TypedArrayPredicate("Uint32Array", options) },
			float32Array: { get: () => new typed_array_1.TypedArrayPredicate("Float32Array", options) },
			float64Array: { get: () => new typed_array_1.TypedArrayPredicate("Float64Array", options) },
			arrayBuffer: { get: () => new array_buffer_1.ArrayBufferPredicate("ArrayBuffer", options) },
			sharedArrayBuffer: { get: () => new array_buffer_1.ArrayBufferPredicate("SharedArrayBuffer", options) },
			dataView: { get: () => new data_view_1.DataViewPredicate(options) },
			iterable: { get: () => new predicate_1.Predicate("Iterable", options) },
			any: { value: (...predicates) => new any_1.AnyPredicate(predicates, options) }
		});
		return object;
	};
}));
//#endregion
//#region node_modules/ow/dist/modifiers.js
var require_modifiers = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	const predicates_1 = require_predicates();
	exports.default = (object) => {
		Object.defineProperties(object, { optional: { get: () => (0, predicates_1.default)({}, { optional: true }) } });
		return object;
	};
}));
//#endregion
//#region node_modules/ow/dist/index.js
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
	var __exportStar = exports && exports.__exportStar || function(m, exports$2) {
		for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports$2, p)) __createBinding(exports$2, m, p);
	};
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.ArgumentError = exports.Predicate = void 0;
	const callsites_1 = require_callsites();
	const infer_label_1 = require_infer_label();
	const predicate_1 = require_predicate();
	Object.defineProperty(exports, "Predicate", {
		enumerable: true,
		get: function() {
			return predicate_1.Predicate;
		}
	});
	const base_predicate_1 = require_base_predicate();
	const modifiers_1 = require_modifiers();
	const predicates_1 = require_predicates();
	const test_1 = require_test();
	const ow = (value, labelOrPredicate, predicate) => {
		if (!(0, base_predicate_1.isPredicate)(labelOrPredicate) && typeof labelOrPredicate !== "string") throw new TypeError(`Expected second argument to be a predicate or a string, got \`${typeof labelOrPredicate}\``);
		if ((0, base_predicate_1.isPredicate)(labelOrPredicate)) {
			const stackFrames = (0, callsites_1.default)();
			(0, test_1.default)(value, () => (0, infer_label_1.inferLabel)(stackFrames), labelOrPredicate);
			return;
		}
		(0, test_1.default)(value, labelOrPredicate, predicate);
	};
	Object.defineProperties(ow, {
		isValid: { value: (value, predicate) => {
			try {
				(0, test_1.default)(value, "", predicate);
				return true;
			} catch {
				return false;
			}
		} },
		create: { value: (labelOrPredicate, predicate) => (value, label) => {
			if ((0, base_predicate_1.isPredicate)(labelOrPredicate)) {
				const stackFrames = (0, callsites_1.default)();
				(0, test_1.default)(value, label !== null && label !== void 0 ? label : (() => (0, infer_label_1.inferLabel)(stackFrames)), labelOrPredicate);
				return;
			}
			(0, test_1.default)(value, label !== null && label !== void 0 ? label : labelOrPredicate, predicate);
		} }
	});
	exports.default = (0, predicates_1.default)((0, modifiers_1.default)(ow));
	__exportStar(require_predicates(), exports);
	var argument_error_1 = require_argument_error();
	Object.defineProperty(exports, "ArgumentError", {
		enumerable: true,
		get: function() {
			return argument_error_1.ArgumentError;
		}
	});
}));
//#endregion
//#region node_modules/async-retry/lib/index.js
var require_lib = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var retrier = require_retry();
	function retry(fn, opts) {
		function run(resolve, reject) {
			var options = opts || {};
			var op;
			if (!("randomize" in options)) options.randomize = true;
			op = retrier.operation(options);
			function bail(err) {
				reject(err || /* @__PURE__ */ new Error("Aborted"));
			}
			function onError(err, num) {
				if (err.bail) {
					bail(err);
					return;
				}
				if (!op.retry(err)) reject(op.mainError());
				else if (options.onRetry) options.onRetry(err, num);
			}
			function runAttempt(num) {
				var val;
				try {
					val = fn(bail, num);
				} catch (err) {
					onError(err, num);
					return;
				}
				Promise.resolve(val).then(resolve).catch(function catchIt(err) {
					onError(err, num);
				});
			}
			op.attempt(runAttempt);
		}
		return new Promise(run);
	}
	module.exports = retry;
}));
//#endregion
//#region node_modules/delayed-stream/lib/delayed_stream.js
var require_delayed_stream = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var Stream$2 = __require("stream").Stream;
	var util$3 = __require("util");
	module.exports = DelayedStream;
	function DelayedStream() {
		this.source = null;
		this.dataSize = 0;
		this.maxDataSize = 1024 * 1024;
		this.pauseStream = true;
		this._maxDataSizeExceeded = false;
		this._released = false;
		this._bufferedEvents = [];
	}
	util$3.inherits(DelayedStream, Stream$2);
	DelayedStream.create = function(source, options) {
		var delayedStream = new this();
		options = options || {};
		for (var option in options) delayedStream[option] = options[option];
		delayedStream.source = source;
		var realEmit = source.emit;
		source.emit = function() {
			delayedStream._handleEmit(arguments);
			return realEmit.apply(source, arguments);
		};
		source.on("error", function() {});
		if (delayedStream.pauseStream) source.pause();
		return delayedStream;
	};
	Object.defineProperty(DelayedStream.prototype, "readable", {
		configurable: true,
		enumerable: true,
		get: function() {
			return this.source.readable;
		}
	});
	DelayedStream.prototype.setEncoding = function() {
		return this.source.setEncoding.apply(this.source, arguments);
	};
	DelayedStream.prototype.resume = function() {
		if (!this._released) this.release();
		this.source.resume();
	};
	DelayedStream.prototype.pause = function() {
		this.source.pause();
	};
	DelayedStream.prototype.release = function() {
		this._released = true;
		this._bufferedEvents.forEach(function(args) {
			this.emit.apply(this, args);
		}.bind(this));
		this._bufferedEvents = [];
	};
	DelayedStream.prototype.pipe = function() {
		var r = Stream$2.prototype.pipe.apply(this, arguments);
		this.resume();
		return r;
	};
	DelayedStream.prototype._handleEmit = function(args) {
		if (this._released) {
			this.emit.apply(this, args);
			return;
		}
		if (args[0] === "data") {
			this.dataSize += args[1].length;
			this._checkIfMaxDataSizeExceeded();
		}
		this._bufferedEvents.push(args);
	};
	DelayedStream.prototype._checkIfMaxDataSizeExceeded = function() {
		if (this._maxDataSizeExceeded) return;
		if (this.dataSize <= this.maxDataSize) return;
		this._maxDataSizeExceeded = true;
		var message = "DelayedStream#maxDataSize of " + this.maxDataSize + " bytes exceeded.";
		this.emit("error", new Error(message));
	};
}));
//#endregion
//#region node_modules/combined-stream/lib/combined_stream.js
var require_combined_stream = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var util$2 = __require("util");
	var Stream$1 = __require("stream").Stream;
	var DelayedStream = require_delayed_stream();
	module.exports = CombinedStream;
	function CombinedStream() {
		this.writable = false;
		this.readable = true;
		this.dataSize = 0;
		this.maxDataSize = 2 * 1024 * 1024;
		this.pauseStreams = true;
		this._released = false;
		this._streams = [];
		this._currentStream = null;
		this._insideLoop = false;
		this._pendingNext = false;
	}
	util$2.inherits(CombinedStream, Stream$1);
	CombinedStream.create = function(options) {
		var combinedStream = new this();
		options = options || {};
		for (var option in options) combinedStream[option] = options[option];
		return combinedStream;
	};
	CombinedStream.isStreamLike = function(stream) {
		return typeof stream !== "function" && typeof stream !== "string" && typeof stream !== "boolean" && typeof stream !== "number" && !Buffer.isBuffer(stream);
	};
	CombinedStream.prototype.append = function(stream) {
		if (CombinedStream.isStreamLike(stream)) {
			if (!(stream instanceof DelayedStream)) {
				var newStream = DelayedStream.create(stream, {
					maxDataSize: Infinity,
					pauseStream: this.pauseStreams
				});
				stream.on("data", this._checkDataSize.bind(this));
				stream = newStream;
			}
			this._handleErrors(stream);
			if (this.pauseStreams) stream.pause();
		}
		this._streams.push(stream);
		return this;
	};
	CombinedStream.prototype.pipe = function(dest, options) {
		Stream$1.prototype.pipe.call(this, dest, options);
		this.resume();
		return dest;
	};
	CombinedStream.prototype._getNext = function() {
		this._currentStream = null;
		if (this._insideLoop) {
			this._pendingNext = true;
			return;
		}
		this._insideLoop = true;
		try {
			do {
				this._pendingNext = false;
				this._realGetNext();
			} while (this._pendingNext);
		} finally {
			this._insideLoop = false;
		}
	};
	CombinedStream.prototype._realGetNext = function() {
		var stream = this._streams.shift();
		if (typeof stream == "undefined") {
			this.end();
			return;
		}
		if (typeof stream !== "function") {
			this._pipeNext(stream);
			return;
		}
		stream(function(stream) {
			if (CombinedStream.isStreamLike(stream)) {
				stream.on("data", this._checkDataSize.bind(this));
				this._handleErrors(stream);
			}
			this._pipeNext(stream);
		}.bind(this));
	};
	CombinedStream.prototype._pipeNext = function(stream) {
		this._currentStream = stream;
		if (CombinedStream.isStreamLike(stream)) {
			stream.on("end", this._getNext.bind(this));
			stream.pipe(this, { end: false });
			return;
		}
		var value = stream;
		this.write(value);
		this._getNext();
	};
	CombinedStream.prototype._handleErrors = function(stream) {
		var self = this;
		stream.on("error", function(err) {
			self._emitError(err);
		});
	};
	CombinedStream.prototype.write = function(data) {
		this.emit("data", data);
	};
	CombinedStream.prototype.pause = function() {
		if (!this.pauseStreams) return;
		if (this.pauseStreams && this._currentStream && typeof this._currentStream.pause == "function") this._currentStream.pause();
		this.emit("pause");
	};
	CombinedStream.prototype.resume = function() {
		if (!this._released) {
			this._released = true;
			this.writable = true;
			this._getNext();
		}
		if (this.pauseStreams && this._currentStream && typeof this._currentStream.resume == "function") this._currentStream.resume();
		this.emit("resume");
	};
	CombinedStream.prototype.end = function() {
		this._reset();
		this.emit("end");
	};
	CombinedStream.prototype.destroy = function() {
		this._reset();
		this.emit("close");
	};
	CombinedStream.prototype._reset = function() {
		this.writable = false;
		this._streams = [];
		this._currentStream = null;
	};
	CombinedStream.prototype._checkDataSize = function() {
		this._updateDataSize();
		if (this.dataSize <= this.maxDataSize) return;
		var message = "DelayedStream#maxDataSize of " + this.maxDataSize + " bytes exceeded.";
		this._emitError(new Error(message));
	};
	CombinedStream.prototype._updateDataSize = function() {
		this.dataSize = 0;
		var self = this;
		this._streams.forEach(function(stream) {
			if (!stream.dataSize) return;
			self.dataSize += stream.dataSize;
		});
		if (this._currentStream && this._currentStream.dataSize) this.dataSize += this._currentStream.dataSize;
	};
	CombinedStream.prototype._emitError = function(err) {
		this._reset();
		this.emit("error", err);
	};
}));
//#endregion
//#region node_modules/mime-db/db.json
var require_db = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	module.exports = {
		"application/1d-interleaved-parityfec": { "source": "iana" },
		"application/3gpdash-qoe-report+xml": {
			"source": "iana",
			"charset": "UTF-8",
			"compressible": true
		},
		"application/3gpp-ims+xml": {
			"source": "iana",
			"compressible": true
		},
		"application/3gpphal+json": {
			"source": "iana",
			"compressible": true
		},
		"application/3gpphalforms+json": {
			"source": "iana",
			"compressible": true
		},
		"application/a2l": { "source": "iana" },
		"application/ace+cbor": { "source": "iana" },
		"application/activemessage": { "source": "iana" },
		"application/activity+json": {
			"source": "iana",
			"compressible": true
		},
		"application/alto-costmap+json": {
			"source": "iana",
			"compressible": true
		},
		"application/alto-costmapfilter+json": {
			"source": "iana",
			"compressible": true
		},
		"application/alto-directory+json": {
			"source": "iana",
			"compressible": true
		},
		"application/alto-endpointcost+json": {
			"source": "iana",
			"compressible": true
		},
		"application/alto-endpointcostparams+json": {
			"source": "iana",
			"compressible": true
		},
		"application/alto-endpointprop+json": {
			"source": "iana",
			"compressible": true
		},
		"application/alto-endpointpropparams+json": {
			"source": "iana",
			"compressible": true
		},
		"application/alto-error+json": {
			"source": "iana",
			"compressible": true
		},
		"application/alto-networkmap+json": {
			"source": "iana",
			"compressible": true
		},
		"application/alto-networkmapfilter+json": {
			"source": "iana",
			"compressible": true
		},
		"application/alto-updatestreamcontrol+json": {
			"source": "iana",
			"compressible": true
		},
		"application/alto-updatestreamparams+json": {
			"source": "iana",
			"compressible": true
		},
		"application/aml": { "source": "iana" },
		"application/andrew-inset": {
			"source": "iana",
			"extensions": ["ez"]
		},
		"application/applefile": { "source": "iana" },
		"application/applixware": {
			"source": "apache",
			"extensions": ["aw"]
		},
		"application/at+jwt": { "source": "iana" },
		"application/atf": { "source": "iana" },
		"application/atfx": { "source": "iana" },
		"application/atom+xml": {
			"source": "iana",
			"compressible": true,
			"extensions": ["atom"]
		},
		"application/atomcat+xml": {
			"source": "iana",
			"compressible": true,
			"extensions": ["atomcat"]
		},
		"application/atomdeleted+xml": {
			"source": "iana",
			"compressible": true,
			"extensions": ["atomdeleted"]
		},
		"application/atomicmail": { "source": "iana" },
		"application/atomsvc+xml": {
			"source": "iana",
			"compressible": true,
			"extensions": ["atomsvc"]
		},
		"application/atsc-dwd+xml": {
			"source": "iana",
			"compressible": true,
			"extensions": ["dwd"]
		},
		"application/atsc-dynamic-event-message": { "source": "iana" },
		"application/atsc-held+xml": {
			"source": "iana",
			"compressible": true,
			"extensions": ["held"]
		},
		"application/atsc-rdt+json": {
			"source": "iana",
			"compressible": true
		},
		"application/atsc-rsat+xml": {
			"source": "iana",
			"compressible": true,
			"extensions": ["rsat"]
		},
		"application/atxml": { "source": "iana" },
		"application/auth-policy+xml": {
			"source": "iana",
			"compressible": true
		},
		"application/bacnet-xdd+zip": {
			"source": "iana",
			"compressible": false
		},
		"application/batch-smtp": { "source": "iana" },
		"application/bdoc": {
			"compressible": false,
			"extensions": ["bdoc"]
		},
		"application/beep+xml": {
			"source": "iana",
			"charset": "UTF-8",
			"compressible": true
		},
		"application/calendar+json": {
			"source": "iana",
			"compressible": true
		},
		"application/calendar+xml": {
			"source": "iana",
			"compressible": true,
			"extensions": ["xcs"]
		},
		"application/call-completion": { "source": "iana" },
		"application/cals-1840": { "source": "iana" },
		"application/captive+json": {
			"source": "iana",
			"compressible": true
		},
		"application/cbor": { "source": "iana" },
		"application/cbor-seq": { "source": "iana" },
		"application/cccex": { "source": "iana" },
		"application/ccmp+xml": {
			"source": "iana",
			"compressible": true
		},
		"application/ccxml+xml": {
			"source": "iana",
			"compressible": true,
			"extensions": ["ccxml"]
		},
		"application/cdfx+xml": {
			"source": "iana",
			"compressible": true,
			"extensions": ["cdfx"]
		},
		"application/cdmi-capability": {
			"source": "iana",
			"extensions": ["cdmia"]
		},
		"application/cdmi-container": {
			"source": "iana",
			"extensions": ["cdmic"]
		},
		"application/cdmi-domain": {
			"source": "iana",
			"extensions": ["cdmid"]
		},
		"application/cdmi-object": {
			"source": "iana",
			"extensions": ["cdmio"]
		},
		"application/cdmi-queue": {
			"source": "iana",
			"extensions": ["cdmiq"]
		},
		"application/cdni": { "source": "iana" },
		"application/cea": { "source": "iana" },
		"application/cea-2018+xml": {
			"source": "iana",
			"compressible": true
		},
		"application/cellml+xml": {
			"source": "iana",
			"compressible": true
		},
		"application/cfw": { "source": "iana" },
		"application/city+json": {
			"source": "iana",
			"compressible": true
		},
		"application/clr": { "source": "iana" },
		"application/clue+xml": {
			"source": "iana",
			"compressible": true
		},
		"application/clue_info+xml": {
			"source": "iana",
			"compressible": true
		},
		"application/cms": { "source": "iana" },
		"application/cnrp+xml": {
			"source": "iana",
			"compressible": true
		},
		"application/coap-group+json": {
			"source": "iana",
			"compressible": true
		},
		"application/coap-payload": { "source": "iana" },
		"application/commonground": { "source": "iana" },
		"application/conference-info+xml": {
			"source": "iana",
			"compressible": true
		},
		"application/cose": { "source": "iana" },
		"application/cose-key": { "source": "iana" },
		"application/cose-key-set": { "source": "iana" },
		"application/cpl+xml": {
			"source": "iana",
			"compressible": true,
			"extensions": ["cpl"]
		},
		"application/csrattrs": { "source": "iana" },
		"application/csta+xml": {
			"source": "iana",
			"compressible": true
		},
		"application/cstadata+xml": {
			"source": "iana",
			"compressible": true
		},
		"application/csvm+json": {
			"source": "iana",
			"compressible": true
		},
		"application/cu-seeme": {
			"source": "apache",
			"extensions": ["cu"]
		},
		"application/cwt": { "source": "iana" },
		"application/cybercash": { "source": "iana" },
		"application/dart": { "compressible": true },
		"application/dash+xml": {
			"source": "iana",
			"compressible": true,
			"extensions": ["mpd"]
		},
		"application/dash-patch+xml": {
			"source": "iana",
			"compressible": true,
			"extensions": ["mpp"]
		},
		"application/dashdelta": { "source": "iana" },
		"application/davmount+xml": {
			"source": "iana",
			"compressible": true,
			"extensions": ["davmount"]
		},
		"application/dca-rft": { "source": "iana" },
		"application/dcd": { "source": "iana" },
		"application/dec-dx": { "source": "iana" },
		"application/dialog-info+xml": {
			"source": "iana",
			"compressible": true
		},
		"application/dicom": { "source": "iana" },
		"application/dicom+json": {
			"source": "iana",
			"compressible": true
		},
		"application/dicom+xml": {
			"source": "iana",
			"compressible": true
		},
		"application/dii": { "source": "iana" },
		"application/dit": { "source": "iana" },
		"application/dns": { "source": "iana" },
		"application/dns+json": {
			"source": "iana",
			"compressible": true
		},
		"application/dns-message": { "source": "iana" },
		"application/docbook+xml": {
			"source": "apache",
			"compressible": true,
			"extensions": ["dbk"]
		},
		"application/dots+cbor": { "source": "iana" },
		"application/dskpp+xml": {
			"source": "iana",
			"compressible": true
		},
		"application/dssc+der": {
			"source": "iana",
			"extensions": ["dssc"]
		},
		"application/dssc+xml": {
			"source": "iana",
			"compressible": true,
			"extensions": ["xdssc"]
		},
		"application/dvcs": { "source": "iana" },
		"application/ecmascript": {
			"source": "iana",
			"compressible": true,
			"extensions": ["es", "ecma"]
		},
		"application/edi-consent": { "source": "iana" },
		"application/edi-x12": {
			"source": "iana",
			"compressible": false
		},
		"application/edifact": {
			"source": "iana",
			"compressible": false
		},
		"application/efi": { "source": "iana" },
		"application/elm+json": {
			"source": "iana",
			"charset": "UTF-8",
			"compressible": true
		},
		"application/elm+xml": {
			"source": "iana",
			"compressible": true
		},
		"application/emergencycalldata.cap+xml": {
			"source": "iana",
			"charset": "UTF-8",
			"compressible": true
		},
		"application/emergencycalldata.comment+xml": {
			"source": "iana",
			"compressible": true
		},
		"application/emergencycalldata.control+xml": {
			"source": "iana",
			"compressible": true
		},
		"application/emergencycalldata.deviceinfo+xml": {
			"source": "iana",
			"compressible": true
		},
		"application/emergencycalldata.ecall.msd": { "source": "iana" },
		"application/emergencycalldata.providerinfo+xml": {
			"source": "iana",
			"compressible": true
		},
		"application/emergencycalldata.serviceinfo+xml": {
			"source": "iana",
			"compressible": true
		},
		"application/emergencycalldata.subscriberinfo+xml": {
			"source": "iana",
			"compressible": true
		},
		"application/emergencycalldata.veds+xml": {
			"source": "iana",
			"compressible": true
		},
		"application/emma+xml": {
			"source": "iana",
			"compressible": true,
			"extensions": ["emma"]
		},
		"application/emotionml+xml": {
			"source": "iana",
			"compressible": true,
			"extensions": ["emotionml"]
		},
		"application/encaprtp": { "source": "iana" },
		"application/epp+xml": {
			"source": "iana",
			"compressible": true
		},
		"application/epub+zip": {
			"source": "iana",
			"compressible": false,
			"extensions": ["epub"]
		},
		"application/eshop": { "source": "iana" },
		"application/exi": {
			"source": "iana",
			"extensions": ["exi"]
		},
		"application/expect-ct-report+json": {
			"source": "iana",
			"compressible": true
		},
		"application/express": {
			"source": "iana",
			"extensions": ["exp"]
		},
		"application/fastinfoset": { "source": "iana" },
		"application/fastsoap": { "source": "iana" },
		"application/fdt+xml": {
			"source": "iana",
			"compressible": true,
			"extensions": ["fdt"]
		},
		"application/fhir+json": {
			"source": "iana",
			"charset": "UTF-8",
			"compressible": true
		},
		"application/fhir+xml": {
			"source": "iana",
			"charset": "UTF-8",
			"compressible": true
		},
		"application/fido.trusted-apps+json": { "compressible": true },
		"application/fits": { "source": "iana" },
		"application/flexfec": { "source": "iana" },
		"application/font-sfnt": { "source": "iana" },
		"application/font-tdpfr": {
			"source": "iana",
			"extensions": ["pfr"]
		},
		"application/font-woff": {
			"source": "iana",
			"compressible": false
		},
		"application/framework-attributes+xml": {
			"source": "iana",
			"compressible": true
		},
		"application/geo+json": {
			"source": "iana",
			"compressible": true,
			"extensions": ["geojson"]
		},
		"application/geo+json-seq": { "source": "iana" },
		"application/geopackage+sqlite3": { "source": "iana" },
		"application/geoxacml+xml": {
			"source": "iana",
			"compressible": true
		},
		"application/gltf-buffer": { "source": "iana" },
		"application/gml+xml": {
			"source": "iana",
			"compressible": true,
			"extensions": ["gml"]
		},
		"application/gpx+xml": {
			"source": "apache",
			"compressible": true,
			"extensions": ["gpx"]
		},
		"application/gxf": {
			"source": "apache",
			"extensions": ["gxf"]
		},
		"application/gzip": {
			"source": "iana",
			"compressible": false,
			"extensions": ["gz"]
		},
		"application/h224": { "source": "iana" },
		"application/held+xml": {
			"source": "iana",
			"compressible": true
		},
		"application/hjson": { "extensions": ["hjson"] },
		"application/http": { "source": "iana" },
		"application/hyperstudio": {
			"source": "iana",
			"extensions": ["stk"]
		},
		"application/ibe-key-request+xml": {
			"source": "iana",
			"compressible": true
		},
		"application/ibe-pkg-reply+xml": {
			"source": "iana",
			"compressible": true
		},
		"application/ibe-pp-data": { "source": "iana" },
		"application/iges": { "source": "iana" },
		"application/im-iscomposing+xml": {
			"source": "iana",
			"charset": "UTF-8",
			"compressible": true
		},
		"application/index": { "source": "iana" },
		"application/index.cmd": { "source": "iana" },
		"application/index.obj": { "source": "iana" },
		"application/index.response": { "source": "iana" },
		"application/index.vnd": { "source": "iana" },
		"application/inkml+xml": {
			"source": "iana",
			"compressible": true,
			"extensions": ["ink", "inkml"]
		},
		"application/iotp": { "source": "iana" },
		"application/ipfix": {
			"source": "iana",
			"extensions": ["ipfix"]
		},
		"application/ipp": { "source": "iana" },
		"application/isup": { "source": "iana" },
		"application/its+xml": {
			"source": "iana",
			"compressible": true,
			"extensions": ["its"]
		},
		"application/java-archive": {
			"source": "apache",
			"compressible": false,
			"extensions": [
				"jar",
				"war",
				"ear"
			]
		},
		"application/java-serialized-object": {
			"source": "apache",
			"compressible": false,
			"extensions": ["ser"]
		},
		"application/java-vm": {
			"source": "apache",
			"compressible": false,
			"extensions": ["class"]
		},
		"application/javascript": {
			"source": "iana",
			"charset": "UTF-8",
			"compressible": true,
			"extensions": ["js", "mjs"]
		},
		"application/jf2feed+json": {
			"source": "iana",
			"compressible": true
		},
		"application/jose": { "source": "iana" },
		"application/jose+json": {
			"source": "iana",
			"compressible": true
		},
		"application/jrd+json": {
			"source": "iana",
			"compressible": true
		},
		"application/jscalendar+json": {
			"source": "iana",
			"compressible": true
		},
		"application/json": {
			"source": "iana",
			"charset": "UTF-8",
			"compressible": true,
			"extensions": ["json", "map"]
		},
		"application/json-patch+json": {
			"source": "iana",
			"compressible": true
		},
		"application/json-seq": { "source": "iana" },
		"application/json5": { "extensions": ["json5"] },
		"application/jsonml+json": {
			"source": "apache",
			"compressible": true,
			"extensions": ["jsonml"]
		},
		"application/jwk+json": {
			"source": "iana",
			"compressible": true
		},
		"application/jwk-set+json": {
			"source": "iana",
			"compressible": true
		},
		"application/jwt": { "source": "iana" },
		"application/kpml-request+xml": {
			"source": "iana",
			"compressible": true
		},
		"application/kpml-response+xml": {
			"source": "iana",
			"compressible": true
		},
		"application/ld+json": {
			"source": "iana",
			"compressible": true,
			"extensions": ["jsonld"]
		},
		"application/lgr+xml": {
			"source": "iana",
			"compressible": true,
			"extensions": ["lgr"]
		},
		"application/link-format": { "source": "iana" },
		"application/load-control+xml": {
			"source": "iana",
			"compressible": true
		},
		"application/lost+xml": {
			"source": "iana",
			"compressible": true,
			"extensions": ["lostxml"]
		},
		"application/lostsync+xml": {
			"source": "iana",
			"compressible": true
		},
		"application/lpf+zip": {
			"source": "iana",
			"compressible": false
		},
		"application/lxf": { "source": "iana" },
		"application/mac-binhex40": {
			"source": "iana",
			"extensions": ["hqx"]
		},
		"application/mac-compactpro": {
			"source": "apache",
			"extensions": ["cpt"]
		},
		"application/macwriteii": { "source": "iana" },
		"application/mads+xml": {
			"source": "iana",
			"compressible": true,
			"extensions": ["mads"]
		},
		"application/manifest+json": {
			"source": "iana",
			"charset": "UTF-8",
			"compressible": true,
			"extensions": ["webmanifest"]
		},
		"application/marc": {
			"source": "iana",
			"extensions": ["mrc"]
		},
		"application/marcxml+xml": {
			"source": "iana",
			"compressible": true,
			"extensions": ["mrcx"]
		},
		"application/mathematica": {
			"source": "iana",
			"extensions": [
				"ma",
				"nb",
				"mb"
			]
		},
		"application/mathml+xml": {
			"source": "iana",
			"compressible": true,
			"extensions": ["mathml"]
		},
		"application/mathml-content+xml": {
			"source": "iana",
			"compressible": true
		},
		"application/mathml-presentation+xml": {
			"source": "iana",
			"compressible": true
		},
		"application/mbms-associated-procedure-description+xml": {
			"source": "iana",
			"compressible": true
		},
		"application/mbms-deregister+xml": {
			"source": "iana",
			"compressible": true
		},
		"application/mbms-envelope+xml": {
			"source": "iana",
			"compressible": true
		},
		"application/mbms-msk+xml": {
			"source": "iana",
			"compressible": true
		},
		"application/mbms-msk-response+xml": {
			"source": "iana",
			"compressible": true
		},
		"application/mbms-protection-description+xml": {
			"source": "iana",
			"compressible": true
		},
		"application/mbms-reception-report+xml": {
			"source": "iana",
			"compressible": true
		},
		"application/mbms-register+xml": {
			"source": "iana",
			"compressible": true
		},
		"application/mbms-register-response+xml": {
			"source": "iana",
			"compressible": true
		},
		"application/mbms-schedule+xml": {
			"source": "iana",
			"compressible": true
		},
		"application/mbms-user-service-description+xml": {
			"source": "iana",
			"compressible": true
		},
		"application/mbox": {
			"source": "iana",
			"extensions": ["mbox"]
		},
		"application/media-policy-dataset+xml": {
			"source": "iana",
			"compressible": true,
			"extensions": ["mpf"]
		},
		"application/media_control+xml": {
			"source": "iana",
			"compressible": true
		},
		"application/mediaservercontrol+xml": {
			"source": "iana",
			"compressible": true,
			"extensions": ["mscml"]
		},
		"application/merge-patch+json": {
			"source": "iana",
			"compressible": true
		},
		"application/metalink+xml": {
			"source": "apache",
			"compressible": true,
			"extensions": ["metalink"]
		},
		"application/metalink4+xml": {
			"source": "iana",
			"compressible": true,
			"extensions": ["meta4"]
		},
		"application/mets+xml": {
			"source": "iana",
			"compressible": true,
			"extensions": ["mets"]
		},
		"application/mf4": { "source": "iana" },
		"application/mikey": { "source": "iana" },
		"application/mipc": { "source": "iana" },
		"application/missing-blocks+cbor-seq": { "source": "iana" },
		"application/mmt-aei+xml": {
			"source": "iana",
			"compressible": true,
			"extensions": ["maei"]
		},
		"application/mmt-usd+xml": {
			"source": "iana",
			"compressible": true,
			"extensions": ["musd"]
		},
		"application/mods+xml": {
			"source": "iana",
			"compressible": true,
			"extensions": ["mods"]
		},
		"application/moss-keys": { "source": "iana" },
		"application/moss-signature": { "source": "iana" },
		"application/mosskey-data": { "source": "iana" },
		"application/mosskey-request": { "source": "iana" },
		"application/mp21": {
			"source": "iana",
			"extensions": ["m21", "mp21"]
		},
		"application/mp4": {
			"source": "iana",
			"extensions": ["mp4s", "m4p"]
		},
		"application/mpeg4-generic": { "source": "iana" },
		"application/mpeg4-iod": { "source": "iana" },
		"application/mpeg4-iod-xmt": { "source": "iana" },
		"application/mrb-consumer+xml": {
			"source": "iana",
			"compressible": true
		},
		"application/mrb-publish+xml": {
			"source": "iana",
			"compressible": true
		},
		"application/msc-ivr+xml": {
			"source": "iana",
			"charset": "UTF-8",
			"compressible": true
		},
		"application/msc-mixer+xml": {
			"source": "iana",
			"charset": "UTF-8",
			"compressible": true
		},
		"application/msword": {
			"source": "iana",
			"compressible": false,
			"extensions": ["doc", "dot"]
		},
		"application/mud+json": {
			"source": "iana",
			"compressible": true
		},
		"application/multipart-core": { "source": "iana" },
		"application/mxf": {
			"source": "iana",
			"extensions": ["mxf"]
		},
		"application/n-quads": {
			"source": "iana",
			"extensions": ["nq"]
		},
		"application/n-triples": {
			"source": "iana",
			"extensions": ["nt"]
		},
		"application/nasdata": { "source": "iana" },
		"application/news-checkgroups": {
			"source": "iana",
			"charset": "US-ASCII"
		},
		"application/news-groupinfo": {
			"source": "iana",
			"charset": "US-ASCII"
		},
		"application/news-transmission": { "source": "iana" },
		"application/nlsml+xml": {
			"source": "iana",
			"compressible": true
		},
		"application/node": {
			"source": "iana",
			"extensions": ["cjs"]
		},
		"application/nss": { "source": "iana" },
		"application/oauth-authz-req+jwt": { "source": "iana" },
		"application/oblivious-dns-message": { "source": "iana" },
		"application/ocsp-request": { "source": "iana" },
		"application/ocsp-response": { "source": "iana" },
		"application/octet-stream": {
			"source": "iana",
			"compressible": false,
			"extensions": [
				"bin",
				"dms",
				"lrf",
				"mar",
				"so",
				"dist",
				"distz",
				"pkg",
				"bpk",
				"dump",
				"elc",
				"deploy",
				"exe",
				"dll",
				"deb",
				"dmg",
				"iso",
				"img",
				"msi",
				"msp",
				"msm",
				"buffer"
			]
		},
		"application/oda": {
			"source": "iana",
			"extensions": ["oda"]
		},
		"application/odm+xml": {
			"source": "iana",
			"compressible": true
		},
		"application/odx": { "source": "iana" },
		"application/oebps-package+xml": {
			"source": "iana",
			"compressible": true,
			"extensions": ["opf"]
		},
		"application/ogg": {
			"source": "iana",
			"compressible": false,
			"extensions": ["ogx"]
		},
		"application/omdoc+xml": {
			"source": "apache",
			"compressible": true,
			"extensions": ["omdoc"]
		},
		"application/onenote": {
			"source": "apache",
			"extensions": [
				"onetoc",
				"onetoc2",
				"onetmp",
				"onepkg"
			]
		},
		"application/opc-nodeset+xml": {
			"source": "iana",
			"compressible": true
		},
		"application/oscore": { "source": "iana" },
		"application/oxps": {
			"source": "iana",
			"extensions": ["oxps"]
		},
		"application/p21": { "source": "iana" },
		"application/p21+zip": {
			"source": "iana",
			"compressible": false
		},
		"application/p2p-overlay+xml": {
			"source": "iana",
			"compressible": true,
			"extensions": ["relo"]
		},
		"application/parityfec": { "source": "iana" },
		"application/passport": { "source": "iana" },
		"application/patch-ops-error+xml": {
			"source": "iana",
			"compressible": true,
			"extensions": ["xer"]
		},
		"application/pdf": {
			"source": "iana",
			"compressible": false,
			"extensions": ["pdf"]
		},
		"application/pdx": { "source": "iana" },
		"application/pem-certificate-chain": { "source": "iana" },
		"application/pgp-encrypted": {
			"source": "iana",
			"compressible": false,
			"extensions": ["pgp"]
		},
		"application/pgp-keys": {
			"source": "iana",
			"extensions": ["asc"]
		},
		"application/pgp-signature": {
			"source": "iana",
			"extensions": ["asc", "sig"]
		},
		"application/pics-rules": {
			"source": "apache",
			"extensions": ["prf"]
		},
		"application/pidf+xml": {
			"source": "iana",
			"charset": "UTF-8",
			"compressible": true
		},
		"application/pidf-diff+xml": {
			"source": "iana",
			"charset": "UTF-8",
			"compressible": true
		},
		"application/pkcs10": {
			"source": "iana",
			"extensions": ["p10"]
		},
		"application/pkcs12": { "source": "iana" },
		"application/pkcs7-mime": {
			"source": "iana",
			"extensions": ["p7m", "p7c"]
		},
		"application/pkcs7-signature": {
			"source": "iana",
			"extensions": ["p7s"]
		},
		"application/pkcs8": {
			"source": "iana",
			"extensions": ["p8"]
		},
		"application/pkcs8-encrypted": { "source": "iana" },
		"application/pkix-attr-cert": {
			"source": "iana",
			"extensions": ["ac"]
		},
		"application/pkix-cert": {
			"source": "iana",
			"extensions": ["cer"]
		},
		"application/pkix-crl": {
			"source": "iana",
			"extensions": ["crl"]
		},
		"application/pkix-pkipath": {
			"source": "iana",
			"extensions": ["pkipath"]
		},
		"application/pkixcmp": {
			"source": "iana",
			"extensions": ["pki"]
		},
		"application/pls+xml": {
			"source": "iana",
			"compressible": true,
			"extensions": ["pls"]
		},
		"application/poc-settings+xml": {
			"source": "iana",
			"charset": "UTF-8",
			"compressible": true
		},
		"application/postscript": {
			"source": "iana",
			"compressible": true,
			"extensions": [
				"ai",
				"eps",
				"ps"
			]
		},
		"application/ppsp-tracker+json": {
			"source": "iana",
			"compressible": true
		},
		"application/problem+json": {
			"source": "iana",
			"compressible": true
		},
		"application/problem+xml": {
			"source": "iana",
			"compressible": true
		},
		"application/provenance+xml": {
			"source": "iana",
			"compressible": true,
			"extensions": ["provx"]
		},
		"application/prs.alvestrand.titrax-sheet": { "source": "iana" },
		"application/prs.cww": {
			"source": "iana",
			"extensions": ["cww"]
		},
		"application/prs.cyn": {
			"source": "iana",
			"charset": "7-BIT"
		},
		"application/prs.hpub+zip": {
			"source": "iana",
			"compressible": false
		},
		"application/prs.nprend": { "source": "iana" },
		"application/prs.plucker": { "source": "iana" },
		"application/prs.rdf-xml-crypt": { "source": "iana" },
		"application/prs.xsf+xml": {
			"source": "iana",
			"compressible": true
		},
		"application/pskc+xml": {
			"source": "iana",
			"compressible": true,
			"extensions": ["pskcxml"]
		},
		"application/pvd+json": {
			"source": "iana",
			"compressible": true
		},
		"application/qsig": { "source": "iana" },
		"application/raml+yaml": {
			"compressible": true,
			"extensions": ["raml"]
		},
		"application/raptorfec": { "source": "iana" },
		"application/rdap+json": {
			"source": "iana",
			"compressible": true
		},
		"application/rdf+xml": {
			"source": "iana",
			"compressible": true,
			"extensions": ["rdf", "owl"]
		},
		"application/reginfo+xml": {
			"source": "iana",
			"compressible": true,
			"extensions": ["rif"]
		},
		"application/relax-ng-compact-syntax": {
			"source": "iana",
			"extensions": ["rnc"]
		},
		"application/remote-printing": { "source": "iana" },
		"application/reputon+json": {
			"source": "iana",
			"compressible": true
		},
		"application/resource-lists+xml": {
			"source": "iana",
			"compressible": true,
			"extensions": ["rl"]
		},
		"application/resource-lists-diff+xml": {
			"source": "iana",
			"compressible": true,
			"extensions": ["rld"]
		},
		"application/rfc+xml": {
			"source": "iana",
			"compressible": true
		},
		"application/riscos": { "source": "iana" },
		"application/rlmi+xml": {
			"source": "iana",
			"compressible": true
		},
		"application/rls-services+xml": {
			"source": "iana",
			"compressible": true,
			"extensions": ["rs"]
		},
		"application/route-apd+xml": {
			"source": "iana",
			"compressible": true,
			"extensions": ["rapd"]
		},
		"application/route-s-tsid+xml": {
			"source": "iana",
			"compressible": true,
			"extensions": ["sls"]
		},
		"application/route-usd+xml": {
			"source": "iana",
			"compressible": true,
			"extensions": ["rusd"]
		},
		"application/rpki-ghostbusters": {
			"source": "iana",
			"extensions": ["gbr"]
		},
		"application/rpki-manifest": {
			"source": "iana",
			"extensions": ["mft"]
		},
		"application/rpki-publication": { "source": "iana" },
		"application/rpki-roa": {
			"source": "iana",
			"extensions": ["roa"]
		},
		"application/rpki-updown": { "source": "iana" },
		"application/rsd+xml": {
			"source": "apache",
			"compressible": true,
			"extensions": ["rsd"]
		},
		"application/rss+xml": {
			"source": "apache",
			"compressible": true,
			"extensions": ["rss"]
		},
		"application/rtf": {
			"source": "iana",
			"compressible": true,
			"extensions": ["rtf"]
		},
		"application/rtploopback": { "source": "iana" },
		"application/rtx": { "source": "iana" },
		"application/samlassertion+xml": {
			"source": "iana",
			"compressible": true
		},
		"application/samlmetadata+xml": {
			"source": "iana",
			"compressible": true
		},
		"application/sarif+json": {
			"source": "iana",
			"compressible": true
		},
		"application/sarif-external-properties+json": {
			"source": "iana",
			"compressible": true
		},
		"application/sbe": { "source": "iana" },
		"application/sbml+xml": {
			"source": "iana",
			"compressible": true,
			"extensions": ["sbml"]
		},
		"application/scaip+xml": {
			"source": "iana",
			"compressible": true
		},
		"application/scim+json": {
			"source": "iana",
			"compressible": true
		},
		"application/scvp-cv-request": {
			"source": "iana",
			"extensions": ["scq"]
		},
		"application/scvp-cv-response": {
			"source": "iana",
			"extensions": ["scs"]
		},
		"application/scvp-vp-request": {
			"source": "iana",
			"extensions": ["spq"]
		},
		"application/scvp-vp-response": {
			"source": "iana",
			"extensions": ["spp"]
		},
		"application/sdp": {
			"source": "iana",
			"extensions": ["sdp"]
		},
		"application/secevent+jwt": { "source": "iana" },
		"application/senml+cbor": { "source": "iana" },
		"application/senml+json": {
			"source": "iana",
			"compressible": true
		},
		"application/senml+xml": {
			"source": "iana",
			"compressible": true,
			"extensions": ["senmlx"]
		},
		"application/senml-etch+cbor": { "source": "iana" },
		"application/senml-etch+json": {
			"source": "iana",
			"compressible": true
		},
		"application/senml-exi": { "source": "iana" },
		"application/sensml+cbor": { "source": "iana" },
		"application/sensml+json": {
			"source": "iana",
			"compressible": true
		},
		"application/sensml+xml": {
			"source": "iana",
			"compressible": true,
			"extensions": ["sensmlx"]
		},
		"application/sensml-exi": { "source": "iana" },
		"application/sep+xml": {
			"source": "iana",
			"compressible": true
		},
		"application/sep-exi": { "source": "iana" },
		"application/session-info": { "source": "iana" },
		"application/set-payment": { "source": "iana" },
		"application/set-payment-initiation": {
			"source": "iana",
			"extensions": ["setpay"]
		},
		"application/set-registration": { "source": "iana" },
		"application/set-registration-initiation": {
			"source": "iana",
			"extensions": ["setreg"]
		},
		"application/sgml": { "source": "iana" },
		"application/sgml-open-catalog": { "source": "iana" },
		"application/shf+xml": {
			"source": "iana",
			"compressible": true,
			"extensions": ["shf"]
		},
		"application/sieve": {
			"source": "iana",
			"extensions": ["siv", "sieve"]
		},
		"application/simple-filter+xml": {
			"source": "iana",
			"compressible": true
		},
		"application/simple-message-summary": { "source": "iana" },
		"application/simplesymbolcontainer": { "source": "iana" },
		"application/sipc": { "source": "iana" },
		"application/slate": { "source": "iana" },
		"application/smil": { "source": "iana" },
		"application/smil+xml": {
			"source": "iana",
			"compressible": true,
			"extensions": ["smi", "smil"]
		},
		"application/smpte336m": { "source": "iana" },
		"application/soap+fastinfoset": { "source": "iana" },
		"application/soap+xml": {
			"source": "iana",
			"compressible": true
		},
		"application/sparql-query": {
			"source": "iana",
			"extensions": ["rq"]
		},
		"application/sparql-results+xml": {
			"source": "iana",
			"compressible": true,
			"extensions": ["srx"]
		},
		"application/spdx+json": {
			"source": "iana",
			"compressible": true
		},
		"application/spirits-event+xml": {
			"source": "iana",
			"compressible": true
		},
		"application/sql": { "source": "iana" },
		"application/srgs": {
			"source": "iana",
			"extensions": ["gram"]
		},
		"application/srgs+xml": {
			"source": "iana",
			"compressible": true,
			"extensions": ["grxml"]
		},
		"application/sru+xml": {
			"source": "iana",
			"compressible": true,
			"extensions": ["sru"]
		},
		"application/ssdl+xml": {
			"source": "apache",
			"compressible": true,
			"extensions": ["ssdl"]
		},
		"application/ssml+xml": {
			"source": "iana",
			"compressible": true,
			"extensions": ["ssml"]
		},
		"application/stix+json": {
			"source": "iana",
			"compressible": true
		},
		"application/swid+xml": {
			"source": "iana",
			"compressible": true,
			"extensions": ["swidtag"]
		},
		"application/tamp-apex-update": { "source": "iana" },
		"application/tamp-apex-update-confirm": { "source": "iana" },
		"application/tamp-community-update": { "source": "iana" },
		"application/tamp-community-update-confirm": { "source": "iana" },
		"application/tamp-error": { "source": "iana" },
		"application/tamp-sequence-adjust": { "source": "iana" },
		"application/tamp-sequence-adjust-confirm": { "source": "iana" },
		"application/tamp-status-query": { "source": "iana" },
		"application/tamp-status-response": { "source": "iana" },
		"application/tamp-update": { "source": "iana" },
		"application/tamp-update-confirm": { "source": "iana" },
		"application/tar": { "compressible": true },
		"application/taxii+json": {
			"source": "iana",
			"compressible": true
		},
		"application/td+json": {
			"source": "iana",
			"compressible": true
		},
		"application/tei+xml": {
			"source": "iana",
			"compressible": true,
			"extensions": ["tei", "teicorpus"]
		},
		"application/tetra_isi": { "source": "iana" },
		"application/thraud+xml": {
			"source": "iana",
			"compressible": true,
			"extensions": ["tfi"]
		},
		"application/timestamp-query": { "source": "iana" },
		"application/timestamp-reply": { "source": "iana" },
		"application/timestamped-data": {
			"source": "iana",
			"extensions": ["tsd"]
		},
		"application/tlsrpt+gzip": { "source": "iana" },
		"application/tlsrpt+json": {
			"source": "iana",
			"compressible": true
		},
		"application/tnauthlist": { "source": "iana" },
		"application/token-introspection+jwt": { "source": "iana" },
		"application/toml": {
			"compressible": true,
			"extensions": ["toml"]
		},
		"application/trickle-ice-sdpfrag": { "source": "iana" },
		"application/trig": {
			"source": "iana",
			"extensions": ["trig"]
		},
		"application/ttml+xml": {
			"source": "iana",
			"compressible": true,
			"extensions": ["ttml"]
		},
		"application/tve-trigger": { "source": "iana" },
		"application/tzif": { "source": "iana" },
		"application/tzif-leap": { "source": "iana" },
		"application/ubjson": {
			"compressible": false,
			"extensions": ["ubj"]
		},
		"application/ulpfec": { "source": "iana" },
		"application/urc-grpsheet+xml": {
			"source": "iana",
			"compressible": true
		},
		"application/urc-ressheet+xml": {
			"source": "iana",
			"compressible": true,
			"extensions": ["rsheet"]
		},
		"application/urc-targetdesc+xml": {
			"source": "iana",
			"compressible": true,
			"extensions": ["td"]
		},
		"application/urc-uisocketdesc+xml": {
			"source": "iana",
			"compressible": true
		},
		"application/vcard+json": {
			"source": "iana",
			"compressible": true
		},
		"application/vcard+xml": {
			"source": "iana",
			"compressible": true
		},
		"application/vemmi": { "source": "iana" },
		"application/vividence.scriptfile": { "source": "apache" },
		"application/vnd.1000minds.decision-model+xml": {
			"source": "iana",
			"compressible": true,
			"extensions": ["1km"]
		},
		"application/vnd.3gpp-prose+xml": {
			"source": "iana",
			"compressible": true
		},
		"application/vnd.3gpp-prose-pc3ch+xml": {
			"source": "iana",
			"compressible": true
		},
		"application/vnd.3gpp-v2x-local-service-information": { "source": "iana" },
		"application/vnd.3gpp.5gnas": { "source": "iana" },
		"application/vnd.3gpp.access-transfer-events+xml": {
			"source": "iana",
			"compressible": true
		},
		"application/vnd.3gpp.bsf+xml": {
			"source": "iana",
			"compressible": true
		},
		"application/vnd.3gpp.gmop+xml": {
			"source": "iana",
			"compressible": true
		},
		"application/vnd.3gpp.gtpc": { "source": "iana" },
		"application/vnd.3gpp.interworking-data": { "source": "iana" },
		"application/vnd.3gpp.lpp": { "source": "iana" },
		"application/vnd.3gpp.mc-signalling-ear": { "source": "iana" },
		"application/vnd.3gpp.mcdata-affiliation-command+xml": {
			"source": "iana",
			"compressible": true
		},
		"application/vnd.3gpp.mcdata-info+xml": {
			"source": "iana",
			"compressible": true
		},
		"application/vnd.3gpp.mcdata-payload": { "source": "iana" },
		"application/vnd.3gpp.mcdata-service-config+xml": {
			"source": "iana",
			"compressible": true
		},
		"application/vnd.3gpp.mcdata-signalling": { "source": "iana" },
		"application/vnd.3gpp.mcdata-ue-config+xml": {
			"source": "iana",
			"compressible": true
		},
		"application/vnd.3gpp.mcdata-user-profile+xml": {
			"source": "iana",
			"compressible": true
		},
		"application/vnd.3gpp.mcptt-affiliation-command+xml": {
			"source": "iana",
			"compressible": true
		},
		"application/vnd.3gpp.mcptt-floor-request+xml": {
			"source": "iana",
			"compressible": true
		},
		"application/vnd.3gpp.mcptt-info+xml": {
			"source": "iana",
			"compressible": true
		},
		"application/vnd.3gpp.mcptt-location-info+xml": {
			"source": "iana",
			"compressible": true
		},
		"application/vnd.3gpp.mcptt-mbms-usage-info+xml": {
			"source": "iana",
			"compressible": true
		},
		"application/vnd.3gpp.mcptt-service-config+xml": {
			"source": "iana",
			"compressible": true
		},
		"application/vnd.3gpp.mcptt-signed+xml": {
			"source": "iana",
			"compressible": true
		},
		"application/vnd.3gpp.mcptt-ue-config+xml": {
			"source": "iana",
			"compressible": true
		},
		"application/vnd.3gpp.mcptt-ue-init-config+xml": {
			"source": "iana",
			"compressible": true
		},
		"application/vnd.3gpp.mcptt-user-profile+xml": {
			"source": "iana",
			"compressible": true
		},
		"application/vnd.3gpp.mcvideo-affiliation-command+xml": {
			"source": "iana",
			"compressible": true
		},
		"application/vnd.3gpp.mcvideo-affiliation-info+xml": {
			"source": "iana",
			"compressible": true
		},
		"application/vnd.3gpp.mcvideo-info+xml": {
			"source": "iana",
			"compressible": true
		},
		"application/vnd.3gpp.mcvideo-location-info+xml": {
			"source": "iana",
			"compressible": true
		},
		"application/vnd.3gpp.mcvideo-mbms-usage-info+xml": {
			"source": "iana",
			"compressible": true
		},
		"application/vnd.3gpp.mcvideo-service-config+xml": {
			"source": "iana",
			"compressible": true
		},
		"application/vnd.3gpp.mcvideo-transmission-request+xml": {
			"source": "iana",
			"compressible": true
		},
		"application/vnd.3gpp.mcvideo-ue-config+xml": {
			"source": "iana",
			"compressible": true
		},
		"application/vnd.3gpp.mcvideo-user-profile+xml": {
			"source": "iana",
			"compressible": true
		},
		"application/vnd.3gpp.mid-call+xml": {
			"source": "iana",
			"compressible": true
		},
		"application/vnd.3gpp.ngap": { "source": "iana" },
		"application/vnd.3gpp.pfcp": { "source": "iana" },
		"application/vnd.3gpp.pic-bw-large": {
			"source": "iana",
			"extensions": ["plb"]
		},
		"application/vnd.3gpp.pic-bw-small": {
			"source": "iana",
			"extensions": ["psb"]
		},
		"application/vnd.3gpp.pic-bw-var": {
			"source": "iana",
			"extensions": ["pvb"]
		},
		"application/vnd.3gpp.s1ap": { "source": "iana" },
		"application/vnd.3gpp.sms": { "source": "iana" },
		"application/vnd.3gpp.sms+xml": {
			"source": "iana",
			"compressible": true
		},
		"application/vnd.3gpp.srvcc-ext+xml": {
			"source": "iana",
			"compressible": true
		},
		"application/vnd.3gpp.srvcc-info+xml": {
			"source": "iana",
			"compressible": true
		},
		"application/vnd.3gpp.state-and-event-info+xml": {
			"source": "iana",
			"compressible": true
		},
		"application/vnd.3gpp.ussd+xml": {
			"source": "iana",
			"compressible": true
		},
		"application/vnd.3gpp2.bcmcsinfo+xml": {
			"source": "iana",
			"compressible": true
		},
		"application/vnd.3gpp2.sms": { "source": "iana" },
		"application/vnd.3gpp2.tcap": {
			"source": "iana",
			"extensions": ["tcap"]
		},
		"application/vnd.3lightssoftware.imagescal": { "source": "iana" },
		"application/vnd.3m.post-it-notes": {
			"source": "iana",
			"extensions": ["pwn"]
		},
		"application/vnd.accpac.simply.aso": {
			"source": "iana",
			"extensions": ["aso"]
		},
		"application/vnd.accpac.simply.imp": {
			"source": "iana",
			"extensions": ["imp"]
		},
		"application/vnd.acucobol": {
			"source": "iana",
			"extensions": ["acu"]
		},
		"application/vnd.acucorp": {
			"source": "iana",
			"extensions": ["atc", "acutc"]
		},
		"application/vnd.adobe.air-application-installer-package+zip": {
			"source": "apache",
			"compressible": false,
			"extensions": ["air"]
		},
		"application/vnd.adobe.flash.movie": { "source": "iana" },
		"application/vnd.adobe.formscentral.fcdt": {
			"source": "iana",
			"extensions": ["fcdt"]
		},
		"application/vnd.adobe.fxp": {
			"source": "iana",
			"extensions": ["fxp", "fxpl"]
		},
		"application/vnd.adobe.partial-upload": { "source": "iana" },
		"application/vnd.adobe.xdp+xml": {
			"source": "iana",
			"compressible": true,
			"extensions": ["xdp"]
		},
		"application/vnd.adobe.xfdf": {
			"source": "iana",
			"extensions": ["xfdf"]
		},
		"application/vnd.aether.imp": { "source": "iana" },
		"application/vnd.afpc.afplinedata": { "source": "iana" },
		"application/vnd.afpc.afplinedata-pagedef": { "source": "iana" },
		"application/vnd.afpc.cmoca-cmresource": { "source": "iana" },
		"application/vnd.afpc.foca-charset": { "source": "iana" },
		"application/vnd.afpc.foca-codedfont": { "source": "iana" },
		"application/vnd.afpc.foca-codepage": { "source": "iana" },
		"application/vnd.afpc.modca": { "source": "iana" },
		"application/vnd.afpc.modca-cmtable": { "source": "iana" },
		"application/vnd.afpc.modca-formdef": { "source": "iana" },
		"application/vnd.afpc.modca-mediummap": { "source": "iana" },
		"application/vnd.afpc.modca-objectcontainer": { "source": "iana" },
		"application/vnd.afpc.modca-overlay": { "source": "iana" },
		"application/vnd.afpc.modca-pagesegment": { "source": "iana" },
		"application/vnd.age": {
			"source": "iana",
			"extensions": ["age"]
		},
		"application/vnd.ah-barcode": { "source": "iana" },
		"application/vnd.ahead.space": {
			"source": "iana",
			"extensions": ["ahead"]
		},
		"application/vnd.airzip.filesecure.azf": {
			"source": "iana",
			"extensions": ["azf"]
		},
		"application/vnd.airzip.filesecure.azs": {
			"source": "iana",
			"extensions": ["azs"]
		},
		"application/vnd.amadeus+json": {
			"source": "iana",
			"compressible": true
		},
		"application/vnd.amazon.ebook": {
			"source": "apache",
			"extensions": ["azw"]
		},
		"application/vnd.amazon.mobi8-ebook": { "source": "iana" },
		"application/vnd.americandynamics.acc": {
			"source": "iana",
			"extensions": ["acc"]
		},
		"application/vnd.amiga.ami": {
			"source": "iana",
			"extensions": ["ami"]
		},
		"application/vnd.amundsen.maze+xml": {
			"source": "iana",
			"compressible": true
		},
		"application/vnd.android.ota": { "source": "iana" },
		"application/vnd.android.package-archive": {
			"source": "apache",
			"compressible": false,
			"extensions": ["apk"]
		},
		"application/vnd.anki": { "source": "iana" },
		"application/vnd.anser-web-certificate-issue-initiation": {
			"source": "iana",
			"extensions": ["cii"]
		},
		"application/vnd.anser-web-funds-transfer-initiation": {
			"source": "apache",
			"extensions": ["fti"]
		},
		"application/vnd.antix.game-component": {
			"source": "iana",
			"extensions": ["atx"]
		},
		"application/vnd.apache.arrow.file": { "source": "iana" },
		"application/vnd.apache.arrow.stream": { "source": "iana" },
		"application/vnd.apache.thrift.binary": { "source": "iana" },
		"application/vnd.apache.thrift.compact": { "source": "iana" },
		"application/vnd.apache.thrift.json": { "source": "iana" },
		"application/vnd.api+json": {
			"source": "iana",
			"compressible": true
		},
		"application/vnd.aplextor.warrp+json": {
			"source": "iana",
			"compressible": true
		},
		"application/vnd.apothekende.reservation+json": {
			"source": "iana",
			"compressible": true
		},
		"application/vnd.apple.installer+xml": {
			"source": "iana",
			"compressible": true,
			"extensions": ["mpkg"]
		},
		"application/vnd.apple.keynote": {
			"source": "iana",
			"extensions": ["key"]
		},
		"application/vnd.apple.mpegurl": {
			"source": "iana",
			"extensions": ["m3u8"]
		},
		"application/vnd.apple.numbers": {
			"source": "iana",
			"extensions": ["numbers"]
		},
		"application/vnd.apple.pages": {
			"source": "iana",
			"extensions": ["pages"]
		},
		"application/vnd.apple.pkpass": {
			"compressible": false,
			"extensions": ["pkpass"]
		},
		"application/vnd.arastra.swi": { "source": "iana" },
		"application/vnd.aristanetworks.swi": {
			"source": "iana",
			"extensions": ["swi"]
		},
		"application/vnd.artisan+json": {
			"source": "iana",
			"compressible": true
		},
		"application/vnd.artsquare": { "source": "iana" },
		"application/vnd.astraea-software.iota": {
			"source": "iana",
			"extensions": ["iota"]
		},
		"application/vnd.audiograph": {
			"source": "iana",
			"extensions": ["aep"]
		},
		"application/vnd.autopackage": { "source": "iana" },
		"application/vnd.avalon+json": {
			"source": "iana",
			"compressible": true
		},
		"application/vnd.avistar+xml": {
			"source": "iana",
			"compressible": true
		},
		"application/vnd.balsamiq.bmml+xml": {
			"source": "iana",
			"compressible": true,
			"extensions": ["bmml"]
		},
		"application/vnd.balsamiq.bmpr": { "source": "iana" },
		"application/vnd.banana-accounting": { "source": "iana" },
		"application/vnd.bbf.usp.error": { "source": "iana" },
		"application/vnd.bbf.usp.msg": { "source": "iana" },
		"application/vnd.bbf.usp.msg+json": {
			"source": "iana",
			"compressible": true
		},
		"application/vnd.bekitzur-stech+json": {
			"source": "iana",
			"compressible": true
		},
		"application/vnd.bint.med-content": { "source": "iana" },
		"application/vnd.biopax.rdf+xml": {
			"source": "iana",
			"compressible": true
		},
		"application/vnd.blink-idb-value-wrapper": { "source": "iana" },
		"application/vnd.blueice.multipass": {
			"source": "iana",
			"extensions": ["mpm"]
		},
		"application/vnd.bluetooth.ep.oob": { "source": "iana" },
		"application/vnd.bluetooth.le.oob": { "source": "iana" },
		"application/vnd.bmi": {
			"source": "iana",
			"extensions": ["bmi"]
		},
		"application/vnd.bpf": { "source": "iana" },
		"application/vnd.bpf3": { "source": "iana" },
		"application/vnd.businessobjects": {
			"source": "iana",
			"extensions": ["rep"]
		},
		"application/vnd.byu.uapi+json": {
			"source": "iana",
			"compressible": true
		},
		"application/vnd.cab-jscript": { "source": "iana" },
		"application/vnd.canon-cpdl": { "source": "iana" },
		"application/vnd.canon-lips": { "source": "iana" },
		"application/vnd.capasystems-pg+json": {
			"source": "iana",
			"compressible": true
		},
		"application/vnd.cendio.thinlinc.clientconf": { "source": "iana" },
		"application/vnd.century-systems.tcp_stream": { "source": "iana" },
		"application/vnd.chemdraw+xml": {
			"source": "iana",
			"compressible": true,
			"extensions": ["cdxml"]
		},
		"application/vnd.chess-pgn": { "source": "iana" },
		"application/vnd.chipnuts.karaoke-mmd": {
			"source": "iana",
			"extensions": ["mmd"]
		},
		"application/vnd.ciedi": { "source": "iana" },
		"application/vnd.cinderella": {
			"source": "iana",
			"extensions": ["cdy"]
		},
		"application/vnd.cirpack.isdn-ext": { "source": "iana" },
		"application/vnd.citationstyles.style+xml": {
			"source": "iana",
			"compressible": true,
			"extensions": ["csl"]
		},
		"application/vnd.claymore": {
			"source": "iana",
			"extensions": ["cla"]
		},
		"application/vnd.cloanto.rp9": {
			"source": "iana",
			"extensions": ["rp9"]
		},
		"application/vnd.clonk.c4group": {
			"source": "iana",
			"extensions": [
				"c4g",
				"c4d",
				"c4f",
				"c4p",
				"c4u"
			]
		},
		"application/vnd.cluetrust.cartomobile-config": {
			"source": "iana",
			"extensions": ["c11amc"]
		},
		"application/vnd.cluetrust.cartomobile-config-pkg": {
			"source": "iana",
			"extensions": ["c11amz"]
		},
		"application/vnd.coffeescript": { "source": "iana" },
		"application/vnd.collabio.xodocuments.document": { "source": "iana" },
		"application/vnd.collabio.xodocuments.document-template": { "source": "iana" },
		"application/vnd.collabio.xodocuments.presentation": { "source": "iana" },
		"application/vnd.collabio.xodocuments.presentation-template": { "source": "iana" },
		"application/vnd.collabio.xodocuments.spreadsheet": { "source": "iana" },
		"application/vnd.collabio.xodocuments.spreadsheet-template": { "source": "iana" },
		"application/vnd.collection+json": {
			"source": "iana",
			"compressible": true
		},
		"application/vnd.collection.doc+json": {
			"source": "iana",
			"compressible": true
		},
		"application/vnd.collection.next+json": {
			"source": "iana",
			"compressible": true
		},
		"application/vnd.comicbook+zip": {
			"source": "iana",
			"compressible": false
		},
		"application/vnd.comicbook-rar": { "source": "iana" },
		"application/vnd.commerce-battelle": { "source": "iana" },
		"application/vnd.commonspace": {
			"source": "iana",
			"extensions": ["csp"]
		},
		"application/vnd.contact.cmsg": {
			"source": "iana",
			"extensions": ["cdbcmsg"]
		},
		"application/vnd.coreos.ignition+json": {
			"source": "iana",
			"compressible": true
		},
		"application/vnd.cosmocaller": {
			"source": "iana",
			"extensions": ["cmc"]
		},
		"application/vnd.crick.clicker": {
			"source": "iana",
			"extensions": ["clkx"]
		},
		"application/vnd.crick.clicker.keyboard": {
			"source": "iana",
			"extensions": ["clkk"]
		},
		"application/vnd.crick.clicker.palette": {
			"source": "iana",
			"extensions": ["clkp"]
		},
		"application/vnd.crick.clicker.template": {
			"source": "iana",
			"extensions": ["clkt"]
		},
		"application/vnd.crick.clicker.wordbank": {
			"source": "iana",
			"extensions": ["clkw"]
		},
		"application/vnd.criticaltools.wbs+xml": {
			"source": "iana",
			"compressible": true,
			"extensions": ["wbs"]
		},
		"application/vnd.cryptii.pipe+json": {
			"source": "iana",
			"compressible": true
		},
		"application/vnd.crypto-shade-file": { "source": "iana" },
		"application/vnd.cryptomator.encrypted": { "source": "iana" },
		"application/vnd.cryptomator.vault": { "source": "iana" },
		"application/vnd.ctc-posml": {
			"source": "iana",
			"extensions": ["pml"]
		},
		"application/vnd.ctct.ws+xml": {
			"source": "iana",
			"compressible": true
		},
		"application/vnd.cups-pdf": { "source": "iana" },
		"application/vnd.cups-postscript": { "source": "iana" },
		"application/vnd.cups-ppd": {
			"source": "iana",
			"extensions": ["ppd"]
		},
		"application/vnd.cups-raster": { "source": "iana" },
		"application/vnd.cups-raw": { "source": "iana" },
		"application/vnd.curl": { "source": "iana" },
		"application/vnd.curl.car": {
			"source": "apache",
			"extensions": ["car"]
		},
		"application/vnd.curl.pcurl": {
			"source": "apache",
			"extensions": ["pcurl"]
		},
		"application/vnd.cyan.dean.root+xml": {
			"source": "iana",
			"compressible": true
		},
		"application/vnd.cybank": { "source": "iana" },
		"application/vnd.cyclonedx+json": {
			"source": "iana",
			"compressible": true
		},
		"application/vnd.cyclonedx+xml": {
			"source": "iana",
			"compressible": true
		},
		"application/vnd.d2l.coursepackage1p0+zip": {
			"source": "iana",
			"compressible": false
		},
		"application/vnd.d3m-dataset": { "source": "iana" },
		"application/vnd.d3m-problem": { "source": "iana" },
		"application/vnd.dart": {
			"source": "iana",
			"compressible": true,
			"extensions": ["dart"]
		},
		"application/vnd.data-vision.rdz": {
			"source": "iana",
			"extensions": ["rdz"]
		},
		"application/vnd.datapackage+json": {
			"source": "iana",
			"compressible": true
		},
		"application/vnd.dataresource+json": {
			"source": "iana",
			"compressible": true
		},
		"application/vnd.dbf": {
			"source": "iana",
			"extensions": ["dbf"]
		},
		"application/vnd.debian.binary-package": { "source": "iana" },
		"application/vnd.dece.data": {
			"source": "iana",
			"extensions": [
				"uvf",
				"uvvf",
				"uvd",
				"uvvd"
			]
		},
		"application/vnd.dece.ttml+xml": {
			"source": "iana",
			"compressible": true,
			"extensions": ["uvt", "uvvt"]
		},
		"application/vnd.dece.unspecified": {
			"source": "iana",
			"extensions": ["uvx", "uvvx"]
		},
		"application/vnd.dece.zip": {
			"source": "iana",
			"extensions": ["uvz", "uvvz"]
		},
		"application/vnd.denovo.fcselayout-link": {
			"source": "iana",
			"extensions": ["fe_launch"]
		},
		"application/vnd.desmume.movie": { "source": "iana" },
		"application/vnd.dir-bi.plate-dl-nosuffix": { "source": "iana" },
		"application/vnd.dm.delegation+xml": {
			"source": "iana",
			"compressible": true
		},
		"application/vnd.dna": {
			"source": "iana",
			"extensions": ["dna"]
		},
		"application/vnd.document+json": {
			"source": "iana",
			"compressible": true
		},
		"application/vnd.dolby.mlp": {
			"source": "apache",
			"extensions": ["mlp"]
		},
		"application/vnd.dolby.mobile.1": { "source": "iana" },
		"application/vnd.dolby.mobile.2": { "source": "iana" },
		"application/vnd.doremir.scorecloud-binary-document": { "source": "iana" },
		"application/vnd.dpgraph": {
			"source": "iana",
			"extensions": ["dpg"]
		},
		"application/vnd.dreamfactory": {
			"source": "iana",
			"extensions": ["dfac"]
		},
		"application/vnd.drive+json": {
			"source": "iana",
			"compressible": true
		},
		"application/vnd.ds-keypoint": {
			"source": "apache",
			"extensions": ["kpxx"]
		},
		"application/vnd.dtg.local": { "source": "iana" },
		"application/vnd.dtg.local.flash": { "source": "iana" },
		"application/vnd.dtg.local.html": { "source": "iana" },
		"application/vnd.dvb.ait": {
			"source": "iana",
			"extensions": ["ait"]
		},
		"application/vnd.dvb.dvbisl+xml": {
			"source": "iana",
			"compressible": true
		},
		"application/vnd.dvb.dvbj": { "source": "iana" },
		"application/vnd.dvb.esgcontainer": { "source": "iana" },
		"application/vnd.dvb.ipdcdftnotifaccess": { "source": "iana" },
		"application/vnd.dvb.ipdcesgaccess": { "source": "iana" },
		"application/vnd.dvb.ipdcesgaccess2": { "source": "iana" },
		"application/vnd.dvb.ipdcesgpdd": { "source": "iana" },
		"application/vnd.dvb.ipdcroaming": { "source": "iana" },
		"application/vnd.dvb.iptv.alfec-base": { "source": "iana" },
		"application/vnd.dvb.iptv.alfec-enhancement": { "source": "iana" },
		"application/vnd.dvb.notif-aggregate-root+xml": {
			"source": "iana",
			"compressible": true
		},
		"application/vnd.dvb.notif-container+xml": {
			"source": "iana",
			"compressible": true
		},
		"application/vnd.dvb.notif-generic+xml": {
			"source": "iana",
			"compressible": true
		},
		"application/vnd.dvb.notif-ia-msglist+xml": {
			"source": "iana",
			"compressible": true
		},
		"application/vnd.dvb.notif-ia-registration-request+xml": {
			"source": "iana",
			"compressible": true
		},
		"application/vnd.dvb.notif-ia-registration-response+xml": {
			"source": "iana",
			"compressible": true
		},
		"application/vnd.dvb.notif-init+xml": {
			"source": "iana",
			"compressible": true
		},
		"application/vnd.dvb.pfr": { "source": "iana" },
		"application/vnd.dvb.service": {
			"source": "iana",
			"extensions": ["svc"]
		},
		"application/vnd.dxr": { "source": "iana" },
		"application/vnd.dynageo": {
			"source": "iana",
			"extensions": ["geo"]
		},
		"application/vnd.dzr": { "source": "iana" },
		"application/vnd.easykaraoke.cdgdownload": { "source": "iana" },
		"application/vnd.ecdis-update": { "source": "iana" },
		"application/vnd.ecip.rlp": { "source": "iana" },
		"application/vnd.eclipse.ditto+json": {
			"source": "iana",
			"compressible": true
		},
		"application/vnd.ecowin.chart": {
			"source": "iana",
			"extensions": ["mag"]
		},
		"application/vnd.ecowin.filerequest": { "source": "iana" },
		"application/vnd.ecowin.fileupdate": { "source": "iana" },
		"application/vnd.ecowin.series": { "source": "iana" },
		"application/vnd.ecowin.seriesrequest": { "source": "iana" },
		"application/vnd.ecowin.seriesupdate": { "source": "iana" },
		"application/vnd.efi.img": { "source": "iana" },
		"application/vnd.efi.iso": { "source": "iana" },
		"application/vnd.emclient.accessrequest+xml": {
			"source": "iana",
			"compressible": true
		},
		"application/vnd.enliven": {
			"source": "iana",
			"extensions": ["nml"]
		},
		"application/vnd.enphase.envoy": { "source": "iana" },
		"application/vnd.eprints.data+xml": {
			"source": "iana",
			"compressible": true
		},
		"application/vnd.epson.esf": {
			"source": "iana",
			"extensions": ["esf"]
		},
		"application/vnd.epson.msf": {
			"source": "iana",
			"extensions": ["msf"]
		},
		"application/vnd.epson.quickanime": {
			"source": "iana",
			"extensions": ["qam"]
		},
		"application/vnd.epson.salt": {
			"source": "iana",
			"extensions": ["slt"]
		},
		"application/vnd.epson.ssf": {
			"source": "iana",
			"extensions": ["ssf"]
		},
		"application/vnd.ericsson.quickcall": { "source": "iana" },
		"application/vnd.espass-espass+zip": {
			"source": "iana",
			"compressible": false
		},
		"application/vnd.eszigno3+xml": {
			"source": "iana",
			"compressible": true,
			"extensions": ["es3", "et3"]
		},
		"application/vnd.etsi.aoc+xml": {
			"source": "iana",
			"compressible": true
		},
		"application/vnd.etsi.asic-e+zip": {
			"source": "iana",
			"compressible": false
		},
		"application/vnd.etsi.asic-s+zip": {
			"source": "iana",
			"compressible": false
		},
		"application/vnd.etsi.cug+xml": {
			"source": "iana",
			"compressible": true
		},
		"application/vnd.etsi.iptvcommand+xml": {
			"source": "iana",
			"compressible": true
		},
		"application/vnd.etsi.iptvdiscovery+xml": {
			"source": "iana",
			"compressible": true
		},
		"application/vnd.etsi.iptvprofile+xml": {
			"source": "iana",
			"compressible": true
		},
		"application/vnd.etsi.iptvsad-bc+xml": {
			"source": "iana",
			"compressible": true
		},
		"application/vnd.etsi.iptvsad-cod+xml": {
			"source": "iana",
			"compressible": true
		},
		"application/vnd.etsi.iptvsad-npvr+xml": {
			"source": "iana",
			"compressible": true
		},
		"application/vnd.etsi.iptvservice+xml": {
			"source": "iana",
			"compressible": true
		},
		"application/vnd.etsi.iptvsync+xml": {
			"source": "iana",
			"compressible": true
		},
		"application/vnd.etsi.iptvueprofile+xml": {
			"source": "iana",
			"compressible": true
		},
		"application/vnd.etsi.mcid+xml": {
			"source": "iana",
			"compressible": true
		},
		"application/vnd.etsi.mheg5": { "source": "iana" },
		"application/vnd.etsi.overload-control-policy-dataset+xml": {
			"source": "iana",
			"compressible": true
		},
		"application/vnd.etsi.pstn+xml": {
			"source": "iana",
			"compressible": true
		},
		"application/vnd.etsi.sci+xml": {
			"source": "iana",
			"compressible": true
		},
		"application/vnd.etsi.simservs+xml": {
			"source": "iana",
			"compressible": true
		},
		"application/vnd.etsi.timestamp-token": { "source": "iana" },
		"application/vnd.etsi.tsl+xml": {
			"source": "iana",
			"compressible": true
		},
		"application/vnd.etsi.tsl.der": { "source": "iana" },
		"application/vnd.eu.kasparian.car+json": {
			"source": "iana",
			"compressible": true
		},
		"application/vnd.eudora.data": { "source": "iana" },
		"application/vnd.evolv.ecig.profile": { "source": "iana" },
		"application/vnd.evolv.ecig.settings": { "source": "iana" },
		"application/vnd.evolv.ecig.theme": { "source": "iana" },
		"application/vnd.exstream-empower+zip": {
			"source": "iana",
			"compressible": false
		},
		"application/vnd.exstream-package": { "source": "iana" },
		"application/vnd.ezpix-album": {
			"source": "iana",
			"extensions": ["ez2"]
		},
		"application/vnd.ezpix-package": {
			"source": "iana",
			"extensions": ["ez3"]
		},
		"application/vnd.f-secure.mobile": { "source": "iana" },
		"application/vnd.familysearch.gedcom+zip": {
			"source": "iana",
			"compressible": false
		},
		"application/vnd.fastcopy-disk-image": { "source": "iana" },
		"application/vnd.fdf": {
			"source": "iana",
			"extensions": ["fdf"]
		},
		"application/vnd.fdsn.mseed": {
			"source": "iana",
			"extensions": ["mseed"]
		},
		"application/vnd.fdsn.seed": {
			"source": "iana",
			"extensions": ["seed", "dataless"]
		},
		"application/vnd.ffsns": { "source": "iana" },
		"application/vnd.ficlab.flb+zip": {
			"source": "iana",
			"compressible": false
		},
		"application/vnd.filmit.zfc": { "source": "iana" },
		"application/vnd.fints": { "source": "iana" },
		"application/vnd.firemonkeys.cloudcell": { "source": "iana" },
		"application/vnd.flographit": {
			"source": "iana",
			"extensions": ["gph"]
		},
		"application/vnd.fluxtime.clip": {
			"source": "iana",
			"extensions": ["ftc"]
		},
		"application/vnd.font-fontforge-sfd": { "source": "iana" },
		"application/vnd.framemaker": {
			"source": "iana",
			"extensions": [
				"fm",
				"frame",
				"maker",
				"book"
			]
		},
		"application/vnd.frogans.fnc": {
			"source": "iana",
			"extensions": ["fnc"]
		},
		"application/vnd.frogans.ltf": {
			"source": "iana",
			"extensions": ["ltf"]
		},
		"application/vnd.fsc.weblaunch": {
			"source": "iana",
			"extensions": ["fsc"]
		},
		"application/vnd.fujifilm.fb.docuworks": { "source": "iana" },
		"application/vnd.fujifilm.fb.docuworks.binder": { "source": "iana" },
		"application/vnd.fujifilm.fb.docuworks.container": { "source": "iana" },
		"application/vnd.fujifilm.fb.jfi+xml": {
			"source": "iana",
			"compressible": true
		},
		"application/vnd.fujitsu.oasys": {
			"source": "iana",
			"extensions": ["oas"]
		},
		"application/vnd.fujitsu.oasys2": {
			"source": "iana",
			"extensions": ["oa2"]
		},
		"application/vnd.fujitsu.oasys3": {
			"source": "iana",
			"extensions": ["oa3"]
		},
		"application/vnd.fujitsu.oasysgp": {
			"source": "iana",
			"extensions": ["fg5"]
		},
		"application/vnd.fujitsu.oasysprs": {
			"source": "iana",
			"extensions": ["bh2"]
		},
		"application/vnd.fujixerox.art-ex": { "source": "iana" },
		"application/vnd.fujixerox.art4": { "source": "iana" },
		"application/vnd.fujixerox.ddd": {
			"source": "iana",
			"extensions": ["ddd"]
		},
		"application/vnd.fujixerox.docuworks": {
			"source": "iana",
			"extensions": ["xdw"]
		},
		"application/vnd.fujixerox.docuworks.binder": {
			"source": "iana",
			"extensions": ["xbd"]
		},
		"application/vnd.fujixerox.docuworks.container": { "source": "iana" },
		"application/vnd.fujixerox.hbpl": { "source": "iana" },
		"application/vnd.fut-misnet": { "source": "iana" },
		"application/vnd.futoin+cbor": { "source": "iana" },
		"application/vnd.futoin+json": {
			"source": "iana",
			"compressible": true
		},
		"application/vnd.fuzzysheet": {
			"source": "iana",
			"extensions": ["fzs"]
		},
		"application/vnd.genomatix.tuxedo": {
			"source": "iana",
			"extensions": ["txd"]
		},
		"application/vnd.gentics.grd+json": {
			"source": "iana",
			"compressible": true
		},
		"application/vnd.geo+json": {
			"source": "iana",
			"compressible": true
		},
		"application/vnd.geocube+xml": {
			"source": "iana",
			"compressible": true
		},
		"application/vnd.geogebra.file": {
			"source": "iana",
			"extensions": ["ggb"]
		},
		"application/vnd.geogebra.slides": { "source": "iana" },
		"application/vnd.geogebra.tool": {
			"source": "iana",
			"extensions": ["ggt"]
		},
		"application/vnd.geometry-explorer": {
			"source": "iana",
			"extensions": ["gex", "gre"]
		},
		"application/vnd.geonext": {
			"source": "iana",
			"extensions": ["gxt"]
		},
		"application/vnd.geoplan": {
			"source": "iana",
			"extensions": ["g2w"]
		},
		"application/vnd.geospace": {
			"source": "iana",
			"extensions": ["g3w"]
		},
		"application/vnd.gerber": { "source": "iana" },
		"application/vnd.globalplatform.card-content-mgt": { "source": "iana" },
		"application/vnd.globalplatform.card-content-mgt-response": { "source": "iana" },
		"application/vnd.gmx": {
			"source": "iana",
			"extensions": ["gmx"]
		},
		"application/vnd.google-apps.document": {
			"compressible": false,
			"extensions": ["gdoc"]
		},
		"application/vnd.google-apps.presentation": {
			"compressible": false,
			"extensions": ["gslides"]
		},
		"application/vnd.google-apps.spreadsheet": {
			"compressible": false,
			"extensions": ["gsheet"]
		},
		"application/vnd.google-earth.kml+xml": {
			"source": "iana",
			"compressible": true,
			"extensions": ["kml"]
		},
		"application/vnd.google-earth.kmz": {
			"source": "iana",
			"compressible": false,
			"extensions": ["kmz"]
		},
		"application/vnd.gov.sk.e-form+xml": {
			"source": "iana",
			"compressible": true
		},
		"application/vnd.gov.sk.e-form+zip": {
			"source": "iana",
			"compressible": false
		},
		"application/vnd.gov.sk.xmldatacontainer+xml": {
			"source": "iana",
			"compressible": true
		},
		"application/vnd.grafeq": {
			"source": "iana",
			"extensions": ["gqf", "gqs"]
		},
		"application/vnd.gridmp": { "source": "iana" },
		"application/vnd.groove-account": {
			"source": "iana",
			"extensions": ["gac"]
		},
		"application/vnd.groove-help": {
			"source": "iana",
			"extensions": ["ghf"]
		},
		"application/vnd.groove-identity-message": {
			"source": "iana",
			"extensions": ["gim"]
		},
		"application/vnd.groove-injector": {
			"source": "iana",
			"extensions": ["grv"]
		},
		"application/vnd.groove-tool-message": {
			"source": "iana",
			"extensions": ["gtm"]
		},
		"application/vnd.groove-tool-template": {
			"source": "iana",
			"extensions": ["tpl"]
		},
		"application/vnd.groove-vcard": {
			"source": "iana",
			"extensions": ["vcg"]
		},
		"application/vnd.hal+json": {
			"source": "iana",
			"compressible": true
		},
		"application/vnd.hal+xml": {
			"source": "iana",
			"compressible": true,
			"extensions": ["hal"]
		},
		"application/vnd.handheld-entertainment+xml": {
			"source": "iana",
			"compressible": true,
			"extensions": ["zmm"]
		},
		"application/vnd.hbci": {
			"source": "iana",
			"extensions": ["hbci"]
		},
		"application/vnd.hc+json": {
			"source": "iana",
			"compressible": true
		},
		"application/vnd.hcl-bireports": { "source": "iana" },
		"application/vnd.hdt": { "source": "iana" },
		"application/vnd.heroku+json": {
			"source": "iana",
			"compressible": true
		},
		"application/vnd.hhe.lesson-player": {
			"source": "iana",
			"extensions": ["les"]
		},
		"application/vnd.hl7cda+xml": {
			"source": "iana",
			"charset": "UTF-8",
			"compressible": true
		},
		"application/vnd.hl7v2+xml": {
			"source": "iana",
			"charset": "UTF-8",
			"compressible": true
		},
		"application/vnd.hp-hpgl": {
			"source": "iana",
			"extensions": ["hpgl"]
		},
		"application/vnd.hp-hpid": {
			"source": "iana",
			"extensions": ["hpid"]
		},
		"application/vnd.hp-hps": {
			"source": "iana",
			"extensions": ["hps"]
		},
		"application/vnd.hp-jlyt": {
			"source": "iana",
			"extensions": ["jlt"]
		},
		"application/vnd.hp-pcl": {
			"source": "iana",
			"extensions": ["pcl"]
		},
		"application/vnd.hp-pclxl": {
			"source": "iana",
			"extensions": ["pclxl"]
		},
		"application/vnd.httphone": { "source": "iana" },
		"application/vnd.hydrostatix.sof-data": {
			"source": "iana",
			"extensions": ["sfd-hdstx"]
		},
		"application/vnd.hyper+json": {
			"source": "iana",
			"compressible": true
		},
		"application/vnd.hyper-item+json": {
			"source": "iana",
			"compressible": true
		},
		"application/vnd.hyperdrive+json": {
			"source": "iana",
			"compressible": true
		},
		"application/vnd.hzn-3d-crossword": { "source": "iana" },
		"application/vnd.ibm.afplinedata": { "source": "iana" },
		"application/vnd.ibm.electronic-media": { "source": "iana" },
		"application/vnd.ibm.minipay": {
			"source": "iana",
			"extensions": ["mpy"]
		},
		"application/vnd.ibm.modcap": {
			"source": "iana",
			"extensions": [
				"afp",
				"listafp",
				"list3820"
			]
		},
		"application/vnd.ibm.rights-management": {
			"source": "iana",
			"extensions": ["irm"]
		},
		"application/vnd.ibm.secure-container": {
			"source": "iana",
			"extensions": ["sc"]
		},
		"application/vnd.iccprofile": {
			"source": "iana",
			"extensions": ["icc", "icm"]
		},
		"application/vnd.ieee.1905": { "source": "iana" },
		"application/vnd.igloader": {
			"source": "iana",
			"extensions": ["igl"]
		},
		"application/vnd.imagemeter.folder+zip": {
			"source": "iana",
			"compressible": false
		},
		"application/vnd.imagemeter.image+zip": {
			"source": "iana",
			"compressible": false
		},
		"application/vnd.immervision-ivp": {
			"source": "iana",
			"extensions": ["ivp"]
		},
		"application/vnd.immervision-ivu": {
			"source": "iana",
			"extensions": ["ivu"]
		},
		"application/vnd.ims.imsccv1p1": { "source": "iana" },
		"application/vnd.ims.imsccv1p2": { "source": "iana" },
		"application/vnd.ims.imsccv1p3": { "source": "iana" },
		"application/vnd.ims.lis.v2.result+json": {
			"source": "iana",
			"compressible": true
		},
		"application/vnd.ims.lti.v2.toolconsumerprofile+json": {
			"source": "iana",
			"compressible": true
		},
		"application/vnd.ims.lti.v2.toolproxy+json": {
			"source": "iana",
			"compressible": true
		},
		"application/vnd.ims.lti.v2.toolproxy.id+json": {
			"source": "iana",
			"compressible": true
		},
		"application/vnd.ims.lti.v2.toolsettings+json": {
			"source": "iana",
			"compressible": true
		},
		"application/vnd.ims.lti.v2.toolsettings.simple+json": {
			"source": "iana",
			"compressible": true
		},
		"application/vnd.informedcontrol.rms+xml": {
			"source": "iana",
			"compressible": true
		},
		"application/vnd.informix-visionary": { "source": "iana" },
		"application/vnd.infotech.project": { "source": "iana" },
		"application/vnd.infotech.project+xml": {
			"source": "iana",
			"compressible": true
		},
		"application/vnd.innopath.wamp.notification": { "source": "iana" },
		"application/vnd.insors.igm": {
			"source": "iana",
			"extensions": ["igm"]
		},
		"application/vnd.intercon.formnet": {
			"source": "iana",
			"extensions": ["xpw", "xpx"]
		},
		"application/vnd.intergeo": {
			"source": "iana",
			"extensions": ["i2g"]
		},
		"application/vnd.intertrust.digibox": { "source": "iana" },
		"application/vnd.intertrust.nncp": { "source": "iana" },
		"application/vnd.intu.qbo": {
			"source": "iana",
			"extensions": ["qbo"]
		},
		"application/vnd.intu.qfx": {
			"source": "iana",
			"extensions": ["qfx"]
		},
		"application/vnd.iptc.g2.catalogitem+xml": {
			"source": "iana",
			"compressible": true
		},
		"application/vnd.iptc.g2.conceptitem+xml": {
			"source": "iana",
			"compressible": true
		},
		"application/vnd.iptc.g2.knowledgeitem+xml": {
			"source": "iana",
			"compressible": true
		},
		"application/vnd.iptc.g2.newsitem+xml": {
			"source": "iana",
			"compressible": true
		},
		"application/vnd.iptc.g2.newsmessage+xml": {
			"source": "iana",
			"compressible": true
		},
		"application/vnd.iptc.g2.packageitem+xml": {
			"source": "iana",
			"compressible": true
		},
		"application/vnd.iptc.g2.planningitem+xml": {
			"source": "iana",
			"compressible": true
		},
		"application/vnd.ipunplugged.rcprofile": {
			"source": "iana",
			"extensions": ["rcprofile"]
		},
		"application/vnd.irepository.package+xml": {
			"source": "iana",
			"compressible": true,
			"extensions": ["irp"]
		},
		"application/vnd.is-xpr": {
			"source": "iana",
			"extensions": ["xpr"]
		},
		"application/vnd.isac.fcs": {
			"source": "iana",
			"extensions": ["fcs"]
		},
		"application/vnd.iso11783-10+zip": {
			"source": "iana",
			"compressible": false
		},
		"application/vnd.jam": {
			"source": "iana",
			"extensions": ["jam"]
		},
		"application/vnd.japannet-directory-service": { "source": "iana" },
		"application/vnd.japannet-jpnstore-wakeup": { "source": "iana" },
		"application/vnd.japannet-payment-wakeup": { "source": "iana" },
		"application/vnd.japannet-registration": { "source": "iana" },
		"application/vnd.japannet-registration-wakeup": { "source": "iana" },
		"application/vnd.japannet-setstore-wakeup": { "source": "iana" },
		"application/vnd.japannet-verification": { "source": "iana" },
		"application/vnd.japannet-verification-wakeup": { "source": "iana" },
		"application/vnd.jcp.javame.midlet-rms": {
			"source": "iana",
			"extensions": ["rms"]
		},
		"application/vnd.jisp": {
			"source": "iana",
			"extensions": ["jisp"]
		},
		"application/vnd.joost.joda-archive": {
			"source": "iana",
			"extensions": ["joda"]
		},
		"application/vnd.jsk.isdn-ngn": { "source": "iana" },
		"application/vnd.kahootz": {
			"source": "iana",
			"extensions": ["ktz", "ktr"]
		},
		"application/vnd.kde.karbon": {
			"source": "iana",
			"extensions": ["karbon"]
		},
		"application/vnd.kde.kchart": {
			"source": "iana",
			"extensions": ["chrt"]
		},
		"application/vnd.kde.kformula": {
			"source": "iana",
			"extensions": ["kfo"]
		},
		"application/vnd.kde.kivio": {
			"source": "iana",
			"extensions": ["flw"]
		},
		"application/vnd.kde.kontour": {
			"source": "iana",
			"extensions": ["kon"]
		},
		"application/vnd.kde.kpresenter": {
			"source": "iana",
			"extensions": ["kpr", "kpt"]
		},
		"application/vnd.kde.kspread": {
			"source": "iana",
			"extensions": ["ksp"]
		},
		"application/vnd.kde.kword": {
			"source": "iana",
			"extensions": ["kwd", "kwt"]
		},
		"application/vnd.kenameaapp": {
			"source": "iana",
			"extensions": ["htke"]
		},
		"application/vnd.kidspiration": {
			"source": "iana",
			"extensions": ["kia"]
		},
		"application/vnd.kinar": {
			"source": "iana",
			"extensions": ["kne", "knp"]
		},
		"application/vnd.koan": {
			"source": "iana",
			"extensions": [
				"skp",
				"skd",
				"skt",
				"skm"
			]
		},
		"application/vnd.kodak-descriptor": {
			"source": "iana",
			"extensions": ["sse"]
		},
		"application/vnd.las": { "source": "iana" },
		"application/vnd.las.las+json": {
			"source": "iana",
			"compressible": true
		},
		"application/vnd.las.las+xml": {
			"source": "iana",
			"compressible": true,
			"extensions": ["lasxml"]
		},
		"application/vnd.laszip": { "source": "iana" },
		"application/vnd.leap+json": {
			"source": "iana",
			"compressible": true
		},
		"application/vnd.liberty-request+xml": {
			"source": "iana",
			"compressible": true
		},
		"application/vnd.llamagraphics.life-balance.desktop": {
			"source": "iana",
			"extensions": ["lbd"]
		},
		"application/vnd.llamagraphics.life-balance.exchange+xml": {
			"source": "iana",
			"compressible": true,
			"extensions": ["lbe"]
		},
		"application/vnd.logipipe.circuit+zip": {
			"source": "iana",
			"compressible": false
		},
		"application/vnd.loom": { "source": "iana" },
		"application/vnd.lotus-1-2-3": {
			"source": "iana",
			"extensions": ["123"]
		},
		"application/vnd.lotus-approach": {
			"source": "iana",
			"extensions": ["apr"]
		},
		"application/vnd.lotus-freelance": {
			"source": "iana",
			"extensions": ["pre"]
		},
		"application/vnd.lotus-notes": {
			"source": "iana",
			"extensions": ["nsf"]
		},
		"application/vnd.lotus-organizer": {
			"source": "iana",
			"extensions": ["org"]
		},
		"application/vnd.lotus-screencam": {
			"source": "iana",
			"extensions": ["scm"]
		},
		"application/vnd.lotus-wordpro": {
			"source": "iana",
			"extensions": ["lwp"]
		},
		"application/vnd.macports.portpkg": {
			"source": "iana",
			"extensions": ["portpkg"]
		},
		"application/vnd.mapbox-vector-tile": {
			"source": "iana",
			"extensions": ["mvt"]
		},
		"application/vnd.marlin.drm.actiontoken+xml": {
			"source": "iana",
			"compressible": true
		},
		"application/vnd.marlin.drm.conftoken+xml": {
			"source": "iana",
			"compressible": true
		},
		"application/vnd.marlin.drm.license+xml": {
			"source": "iana",
			"compressible": true
		},
		"application/vnd.marlin.drm.mdcf": { "source": "iana" },
		"application/vnd.mason+json": {
			"source": "iana",
			"compressible": true
		},
		"application/vnd.maxar.archive.3tz+zip": {
			"source": "iana",
			"compressible": false
		},
		"application/vnd.maxmind.maxmind-db": { "source": "iana" },
		"application/vnd.mcd": {
			"source": "iana",
			"extensions": ["mcd"]
		},
		"application/vnd.medcalcdata": {
			"source": "iana",
			"extensions": ["mc1"]
		},
		"application/vnd.mediastation.cdkey": {
			"source": "iana",
			"extensions": ["cdkey"]
		},
		"application/vnd.meridian-slingshot": { "source": "iana" },
		"application/vnd.mfer": {
			"source": "iana",
			"extensions": ["mwf"]
		},
		"application/vnd.mfmp": {
			"source": "iana",
			"extensions": ["mfm"]
		},
		"application/vnd.micro+json": {
			"source": "iana",
			"compressible": true
		},
		"application/vnd.micrografx.flo": {
			"source": "iana",
			"extensions": ["flo"]
		},
		"application/vnd.micrografx.igx": {
			"source": "iana",
			"extensions": ["igx"]
		},
		"application/vnd.microsoft.portable-executable": { "source": "iana" },
		"application/vnd.microsoft.windows.thumbnail-cache": { "source": "iana" },
		"application/vnd.miele+json": {
			"source": "iana",
			"compressible": true
		},
		"application/vnd.mif": {
			"source": "iana",
			"extensions": ["mif"]
		},
		"application/vnd.minisoft-hp3000-save": { "source": "iana" },
		"application/vnd.mitsubishi.misty-guard.trustweb": { "source": "iana" },
		"application/vnd.mobius.daf": {
			"source": "iana",
			"extensions": ["daf"]
		},
		"application/vnd.mobius.dis": {
			"source": "iana",
			"extensions": ["dis"]
		},
		"application/vnd.mobius.mbk": {
			"source": "iana",
			"extensions": ["mbk"]
		},
		"application/vnd.mobius.mqy": {
			"source": "iana",
			"extensions": ["mqy"]
		},
		"application/vnd.mobius.msl": {
			"source": "iana",
			"extensions": ["msl"]
		},
		"application/vnd.mobius.plc": {
			"source": "iana",
			"extensions": ["plc"]
		},
		"application/vnd.mobius.txf": {
			"source": "iana",
			"extensions": ["txf"]
		},
		"application/vnd.mophun.application": {
			"source": "iana",
			"extensions": ["mpn"]
		},
		"application/vnd.mophun.certificate": {
			"source": "iana",
			"extensions": ["mpc"]
		},
		"application/vnd.motorola.flexsuite": { "source": "iana" },
		"application/vnd.motorola.flexsuite.adsi": { "source": "iana" },
		"application/vnd.motorola.flexsuite.fis": { "source": "iana" },
		"application/vnd.motorola.flexsuite.gotap": { "source": "iana" },
		"application/vnd.motorola.flexsuite.kmr": { "source": "iana" },
		"application/vnd.motorola.flexsuite.ttc": { "source": "iana" },
		"application/vnd.motorola.flexsuite.wem": { "source": "iana" },
		"application/vnd.motorola.iprm": { "source": "iana" },
		"application/vnd.mozilla.xul+xml": {
			"source": "iana",
			"compressible": true,
			"extensions": ["xul"]
		},
		"application/vnd.ms-3mfdocument": { "source": "iana" },
		"application/vnd.ms-artgalry": {
			"source": "iana",
			"extensions": ["cil"]
		},
		"application/vnd.ms-asf": { "source": "iana" },
		"application/vnd.ms-cab-compressed": {
			"source": "iana",
			"extensions": ["cab"]
		},
		"application/vnd.ms-color.iccprofile": { "source": "apache" },
		"application/vnd.ms-excel": {
			"source": "iana",
			"compressible": false,
			"extensions": [
				"xls",
				"xlm",
				"xla",
				"xlc",
				"xlt",
				"xlw"
			]
		},
		"application/vnd.ms-excel.addin.macroenabled.12": {
			"source": "iana",
			"extensions": ["xlam"]
		},
		"application/vnd.ms-excel.sheet.binary.macroenabled.12": {
			"source": "iana",
			"extensions": ["xlsb"]
		},
		"application/vnd.ms-excel.sheet.macroenabled.12": {
			"source": "iana",
			"extensions": ["xlsm"]
		},
		"application/vnd.ms-excel.template.macroenabled.12": {
			"source": "iana",
			"extensions": ["xltm"]
		},
		"application/vnd.ms-fontobject": {
			"source": "iana",
			"compressible": true,
			"extensions": ["eot"]
		},
		"application/vnd.ms-htmlhelp": {
			"source": "iana",
			"extensions": ["chm"]
		},
		"application/vnd.ms-ims": {
			"source": "iana",
			"extensions": ["ims"]
		},
		"application/vnd.ms-lrm": {
			"source": "iana",
			"extensions": ["lrm"]
		},
		"application/vnd.ms-office.activex+xml": {
			"source": "iana",
			"compressible": true
		},
		"application/vnd.ms-officetheme": {
			"source": "iana",
			"extensions": ["thmx"]
		},
		"application/vnd.ms-opentype": {
			"source": "apache",
			"compressible": true
		},
		"application/vnd.ms-outlook": {
			"compressible": false,
			"extensions": ["msg"]
		},
		"application/vnd.ms-package.obfuscated-opentype": { "source": "apache" },
		"application/vnd.ms-pki.seccat": {
			"source": "apache",
			"extensions": ["cat"]
		},
		"application/vnd.ms-pki.stl": {
			"source": "apache",
			"extensions": ["stl"]
		},
		"application/vnd.ms-playready.initiator+xml": {
			"source": "iana",
			"compressible": true
		},
		"application/vnd.ms-powerpoint": {
			"source": "iana",
			"compressible": false,
			"extensions": [
				"ppt",
				"pps",
				"pot"
			]
		},
		"application/vnd.ms-powerpoint.addin.macroenabled.12": {
			"source": "iana",
			"extensions": ["ppam"]
		},
		"application/vnd.ms-powerpoint.presentation.macroenabled.12": {
			"source": "iana",
			"extensions": ["pptm"]
		},
		"application/vnd.ms-powerpoint.slide.macroenabled.12": {
			"source": "iana",
			"extensions": ["sldm"]
		},
		"application/vnd.ms-powerpoint.slideshow.macroenabled.12": {
			"source": "iana",
			"extensions": ["ppsm"]
		},
		"application/vnd.ms-powerpoint.template.macroenabled.12": {
			"source": "iana",
			"extensions": ["potm"]
		},
		"application/vnd.ms-printdevicecapabilities+xml": {
			"source": "iana",
			"compressible": true
		},
		"application/vnd.ms-printing.printticket+xml": {
			"source": "apache",
			"compressible": true
		},
		"application/vnd.ms-printschematicket+xml": {
			"source": "iana",
			"compressible": true
		},
		"application/vnd.ms-project": {
			"source": "iana",
			"extensions": ["mpp", "mpt"]
		},
		"application/vnd.ms-tnef": { "source": "iana" },
		"application/vnd.ms-windows.devicepairing": { "source": "iana" },
		"application/vnd.ms-windows.nwprinting.oob": { "source": "iana" },
		"application/vnd.ms-windows.printerpairing": { "source": "iana" },
		"application/vnd.ms-windows.wsd.oob": { "source": "iana" },
		"application/vnd.ms-wmdrm.lic-chlg-req": { "source": "iana" },
		"application/vnd.ms-wmdrm.lic-resp": { "source": "iana" },
		"application/vnd.ms-wmdrm.meter-chlg-req": { "source": "iana" },
		"application/vnd.ms-wmdrm.meter-resp": { "source": "iana" },
		"application/vnd.ms-word.document.macroenabled.12": {
			"source": "iana",
			"extensions": ["docm"]
		},
		"application/vnd.ms-word.template.macroenabled.12": {
			"source": "iana",
			"extensions": ["dotm"]
		},
		"application/vnd.ms-works": {
			"source": "iana",
			"extensions": [
				"wps",
				"wks",
				"wcm",
				"wdb"
			]
		},
		"application/vnd.ms-wpl": {
			"source": "iana",
			"extensions": ["wpl"]
		},
		"application/vnd.ms-xpsdocument": {
			"source": "iana",
			"compressible": false,
			"extensions": ["xps"]
		},
		"application/vnd.msa-disk-image": { "source": "iana" },
		"application/vnd.mseq": {
			"source": "iana",
			"extensions": ["mseq"]
		},
		"application/vnd.msign": { "source": "iana" },
		"application/vnd.multiad.creator": { "source": "iana" },
		"application/vnd.multiad.creator.cif": { "source": "iana" },
		"application/vnd.music-niff": { "source": "iana" },
		"application/vnd.musician": {
			"source": "iana",
			"extensions": ["mus"]
		},
		"application/vnd.muvee.style": {
			"source": "iana",
			"extensions": ["msty"]
		},
		"application/vnd.mynfc": {
			"source": "iana",
			"extensions": ["taglet"]
		},
		"application/vnd.nacamar.ybrid+json": {
			"source": "iana",
			"compressible": true
		},
		"application/vnd.ncd.control": { "source": "iana" },
		"application/vnd.ncd.reference": { "source": "iana" },
		"application/vnd.nearst.inv+json": {
			"source": "iana",
			"compressible": true
		},
		"application/vnd.nebumind.line": { "source": "iana" },
		"application/vnd.nervana": { "source": "iana" },
		"application/vnd.netfpx": { "source": "iana" },
		"application/vnd.neurolanguage.nlu": {
			"source": "iana",
			"extensions": ["nlu"]
		},
		"application/vnd.nimn": { "source": "iana" },
		"application/vnd.nintendo.nitro.rom": { "source": "iana" },
		"application/vnd.nintendo.snes.rom": { "source": "iana" },
		"application/vnd.nitf": {
			"source": "iana",
			"extensions": ["ntf", "nitf"]
		},
		"application/vnd.noblenet-directory": {
			"source": "iana",
			"extensions": ["nnd"]
		},
		"application/vnd.noblenet-sealer": {
			"source": "iana",
			"extensions": ["nns"]
		},
		"application/vnd.noblenet-web": {
			"source": "iana",
			"extensions": ["nnw"]
		},
		"application/vnd.nokia.catalogs": { "source": "iana" },
		"application/vnd.nokia.conml+wbxml": { "source": "iana" },
		"application/vnd.nokia.conml+xml": {
			"source": "iana",
			"compressible": true
		},
		"application/vnd.nokia.iptv.config+xml": {
			"source": "iana",
			"compressible": true
		},
		"application/vnd.nokia.isds-radio-presets": { "source": "iana" },
		"application/vnd.nokia.landmark+wbxml": { "source": "iana" },
		"application/vnd.nokia.landmark+xml": {
			"source": "iana",
			"compressible": true
		},
		"application/vnd.nokia.landmarkcollection+xml": {
			"source": "iana",
			"compressible": true
		},
		"application/vnd.nokia.n-gage.ac+xml": {
			"source": "iana",
			"compressible": true,
			"extensions": ["ac"]
		},
		"application/vnd.nokia.n-gage.data": {
			"source": "iana",
			"extensions": ["ngdat"]
		},
		"application/vnd.nokia.n-gage.symbian.install": {
			"source": "iana",
			"extensions": ["n-gage"]
		},
		"application/vnd.nokia.ncd": { "source": "iana" },
		"application/vnd.nokia.pcd+wbxml": { "source": "iana" },
		"application/vnd.nokia.pcd+xml": {
			"source": "iana",
			"compressible": true
		},
		"application/vnd.nokia.radio-preset": {
			"source": "iana",
			"extensions": ["rpst"]
		},
		"application/vnd.nokia.radio-presets": {
			"source": "iana",
			"extensions": ["rpss"]
		},
		"application/vnd.novadigm.edm": {
			"source": "iana",
			"extensions": ["edm"]
		},
		"application/vnd.novadigm.edx": {
			"source": "iana",
			"extensions": ["edx"]
		},
		"application/vnd.novadigm.ext": {
			"source": "iana",
			"extensions": ["ext"]
		},
		"application/vnd.ntt-local.content-share": { "source": "iana" },
		"application/vnd.ntt-local.file-transfer": { "source": "iana" },
		"application/vnd.ntt-local.ogw_remote-access": { "source": "iana" },
		"application/vnd.ntt-local.sip-ta_remote": { "source": "iana" },
		"application/vnd.ntt-local.sip-ta_tcp_stream": { "source": "iana" },
		"application/vnd.oasis.opendocument.chart": {
			"source": "iana",
			"extensions": ["odc"]
		},
		"application/vnd.oasis.opendocument.chart-template": {
			"source": "iana",
			"extensions": ["otc"]
		},
		"application/vnd.oasis.opendocument.database": {
			"source": "iana",
			"extensions": ["odb"]
		},
		"application/vnd.oasis.opendocument.formula": {
			"source": "iana",
			"extensions": ["odf"]
		},
		"application/vnd.oasis.opendocument.formula-template": {
			"source": "iana",
			"extensions": ["odft"]
		},
		"application/vnd.oasis.opendocument.graphics": {
			"source": "iana",
			"compressible": false,
			"extensions": ["odg"]
		},
		"application/vnd.oasis.opendocument.graphics-template": {
			"source": "iana",
			"extensions": ["otg"]
		},
		"application/vnd.oasis.opendocument.image": {
			"source": "iana",
			"extensions": ["odi"]
		},
		"application/vnd.oasis.opendocument.image-template": {
			"source": "iana",
			"extensions": ["oti"]
		},
		"application/vnd.oasis.opendocument.presentation": {
			"source": "iana",
			"compressible": false,
			"extensions": ["odp"]
		},
		"application/vnd.oasis.opendocument.presentation-template": {
			"source": "iana",
			"extensions": ["otp"]
		},
		"application/vnd.oasis.opendocument.spreadsheet": {
			"source": "iana",
			"compressible": false,
			"extensions": ["ods"]
		},
		"application/vnd.oasis.opendocument.spreadsheet-template": {
			"source": "iana",
			"extensions": ["ots"]
		},
		"application/vnd.oasis.opendocument.text": {
			"source": "iana",
			"compressible": false,
			"extensions": ["odt"]
		},
		"application/vnd.oasis.opendocument.text-master": {
			"source": "iana",
			"extensions": ["odm"]
		},
		"application/vnd.oasis.opendocument.text-template": {
			"source": "iana",
			"extensions": ["ott"]
		},
		"application/vnd.oasis.opendocument.text-web": {
			"source": "iana",
			"extensions": ["oth"]
		},
		"application/vnd.obn": { "source": "iana" },
		"application/vnd.ocf+cbor": { "source": "iana" },
		"application/vnd.oci.image.manifest.v1+json": {
			"source": "iana",
			"compressible": true
		},
		"application/vnd.oftn.l10n+json": {
			"source": "iana",
			"compressible": true
		},
		"application/vnd.oipf.contentaccessdownload+xml": {
			"source": "iana",
			"compressible": true
		},
		"application/vnd.oipf.contentaccessstreaming+xml": {
			"source": "iana",
			"compressible": true
		},
		"application/vnd.oipf.cspg-hexbinary": { "source": "iana" },
		"application/vnd.oipf.dae.svg+xml": {
			"source": "iana",
			"compressible": true
		},
		"application/vnd.oipf.dae.xhtml+xml": {
			"source": "iana",
			"compressible": true
		},
		"application/vnd.oipf.mippvcontrolmessage+xml": {
			"source": "iana",
			"compressible": true
		},
		"application/vnd.oipf.pae.gem": { "source": "iana" },
		"application/vnd.oipf.spdiscovery+xml": {
			"source": "iana",
			"compressible": true
		},
		"application/vnd.oipf.spdlist+xml": {
			"source": "iana",
			"compressible": true
		},
		"application/vnd.oipf.ueprofile+xml": {
			"source": "iana",
			"compressible": true
		},
		"application/vnd.oipf.userprofile+xml": {
			"source": "iana",
			"compressible": true
		},
		"application/vnd.olpc-sugar": {
			"source": "iana",
			"extensions": ["xo"]
		},
		"application/vnd.oma-scws-config": { "source": "iana" },
		"application/vnd.oma-scws-http-request": { "source": "iana" },
		"application/vnd.oma-scws-http-response": { "source": "iana" },
		"application/vnd.oma.bcast.associated-procedure-parameter+xml": {
			"source": "iana",
			"compressible": true
		},
		"application/vnd.oma.bcast.drm-trigger+xml": {
			"source": "iana",
			"compressible": true
		},
		"application/vnd.oma.bcast.imd+xml": {
			"source": "iana",
			"compressible": true
		},
		"application/vnd.oma.bcast.ltkm": { "source": "iana" },
		"application/vnd.oma.bcast.notification+xml": {
			"source": "iana",
			"compressible": true
		},
		"application/vnd.oma.bcast.provisioningtrigger": { "source": "iana" },
		"application/vnd.oma.bcast.sgboot": { "source": "iana" },
		"application/vnd.oma.bcast.sgdd+xml": {
			"source": "iana",
			"compressible": true
		},
		"application/vnd.oma.bcast.sgdu": { "source": "iana" },
		"application/vnd.oma.bcast.simple-symbol-container": { "source": "iana" },
		"application/vnd.oma.bcast.smartcard-trigger+xml": {
			"source": "iana",
			"compressible": true
		},
		"application/vnd.oma.bcast.sprov+xml": {
			"source": "iana",
			"compressible": true
		},
		"application/vnd.oma.bcast.stkm": { "source": "iana" },
		"application/vnd.oma.cab-address-book+xml": {
			"source": "iana",
			"compressible": true
		},
		"application/vnd.oma.cab-feature-handler+xml": {
			"source": "iana",
			"compressible": true
		},
		"application/vnd.oma.cab-pcc+xml": {
			"source": "iana",
			"compressible": true
		},
		"application/vnd.oma.cab-subs-invite+xml": {
			"source": "iana",
			"compressible": true
		},
		"application/vnd.oma.cab-user-prefs+xml": {
			"source": "iana",
			"compressible": true
		},
		"application/vnd.oma.dcd": { "source": "iana" },
		"application/vnd.oma.dcdc": { "source": "iana" },
		"application/vnd.oma.dd2+xml": {
			"source": "iana",
			"compressible": true,
			"extensions": ["dd2"]
		},
		"application/vnd.oma.drm.risd+xml": {
			"source": "iana",
			"compressible": true
		},
		"application/vnd.oma.group-usage-list+xml": {
			"source": "iana",
			"compressible": true
		},
		"application/vnd.oma.lwm2m+cbor": { "source": "iana" },
		"application/vnd.oma.lwm2m+json": {
			"source": "iana",
			"compressible": true
		},
		"application/vnd.oma.lwm2m+tlv": { "source": "iana" },
		"application/vnd.oma.pal+xml": {
			"source": "iana",
			"compressible": true
		},
		"application/vnd.oma.poc.detailed-progress-report+xml": {
			"source": "iana",
			"compressible": true
		},
		"application/vnd.oma.poc.final-report+xml": {
			"source": "iana",
			"compressible": true
		},
		"application/vnd.oma.poc.groups+xml": {
			"source": "iana",
			"compressible": true
		},
		"application/vnd.oma.poc.invocation-descriptor+xml": {
			"source": "iana",
			"compressible": true
		},
		"application/vnd.oma.poc.optimized-progress-report+xml": {
			"source": "iana",
			"compressible": true
		},
		"application/vnd.oma.push": { "source": "iana" },
		"application/vnd.oma.scidm.messages+xml": {
			"source": "iana",
			"compressible": true
		},
		"application/vnd.oma.xcap-directory+xml": {
			"source": "iana",
			"compressible": true
		},
		"application/vnd.omads-email+xml": {
			"source": "iana",
			"charset": "UTF-8",
			"compressible": true
		},
		"application/vnd.omads-file+xml": {
			"source": "iana",
			"charset": "UTF-8",
			"compressible": true
		},
		"application/vnd.omads-folder+xml": {
			"source": "iana",
			"charset": "UTF-8",
			"compressible": true
		},
		"application/vnd.omaloc-supl-init": { "source": "iana" },
		"application/vnd.onepager": { "source": "iana" },
		"application/vnd.onepagertamp": { "source": "iana" },
		"application/vnd.onepagertamx": { "source": "iana" },
		"application/vnd.onepagertat": { "source": "iana" },
		"application/vnd.onepagertatp": { "source": "iana" },
		"application/vnd.onepagertatx": { "source": "iana" },
		"application/vnd.openblox.game+xml": {
			"source": "iana",
			"compressible": true,
			"extensions": ["obgx"]
		},
		"application/vnd.openblox.game-binary": { "source": "iana" },
		"application/vnd.openeye.oeb": { "source": "iana" },
		"application/vnd.openofficeorg.extension": {
			"source": "apache",
			"extensions": ["oxt"]
		},
		"application/vnd.openstreetmap.data+xml": {
			"source": "iana",
			"compressible": true,
			"extensions": ["osm"]
		},
		"application/vnd.opentimestamps.ots": { "source": "iana" },
		"application/vnd.openxmlformats-officedocument.custom-properties+xml": {
			"source": "iana",
			"compressible": true
		},
		"application/vnd.openxmlformats-officedocument.customxmlproperties+xml": {
			"source": "iana",
			"compressible": true
		},
		"application/vnd.openxmlformats-officedocument.drawing+xml": {
			"source": "iana",
			"compressible": true
		},
		"application/vnd.openxmlformats-officedocument.drawingml.chart+xml": {
			"source": "iana",
			"compressible": true
		},
		"application/vnd.openxmlformats-officedocument.drawingml.chartshapes+xml": {
			"source": "iana",
			"compressible": true
		},
		"application/vnd.openxmlformats-officedocument.drawingml.diagramcolors+xml": {
			"source": "iana",
			"compressible": true
		},
		"application/vnd.openxmlformats-officedocument.drawingml.diagramdata+xml": {
			"source": "iana",
			"compressible": true
		},
		"application/vnd.openxmlformats-officedocument.drawingml.diagramlayout+xml": {
			"source": "iana",
			"compressible": true
		},
		"application/vnd.openxmlformats-officedocument.drawingml.diagramstyle+xml": {
			"source": "iana",
			"compressible": true
		},
		"application/vnd.openxmlformats-officedocument.extended-properties+xml": {
			"source": "iana",
			"compressible": true
		},
		"application/vnd.openxmlformats-officedocument.presentationml.commentauthors+xml": {
			"source": "iana",
			"compressible": true
		},
		"application/vnd.openxmlformats-officedocument.presentationml.comments+xml": {
			"source": "iana",
			"compressible": true
		},
		"application/vnd.openxmlformats-officedocument.presentationml.handoutmaster+xml": {
			"source": "iana",
			"compressible": true
		},
		"application/vnd.openxmlformats-officedocument.presentationml.notesmaster+xml": {
			"source": "iana",
			"compressible": true
		},
		"application/vnd.openxmlformats-officedocument.presentationml.notesslide+xml": {
			"source": "iana",
			"compressible": true
		},
		"application/vnd.openxmlformats-officedocument.presentationml.presentation": {
			"source": "iana",
			"compressible": false,
			"extensions": ["pptx"]
		},
		"application/vnd.openxmlformats-officedocument.presentationml.presentation.main+xml": {
			"source": "iana",
			"compressible": true
		},
		"application/vnd.openxmlformats-officedocument.presentationml.presprops+xml": {
			"source": "iana",
			"compressible": true
		},
		"application/vnd.openxmlformats-officedocument.presentationml.slide": {
			"source": "iana",
			"extensions": ["sldx"]
		},
		"application/vnd.openxmlformats-officedocument.presentationml.slide+xml": {
			"source": "iana",
			"compressible": true
		},
		"application/vnd.openxmlformats-officedocument.presentationml.slidelayout+xml": {
			"source": "iana",
			"compressible": true
		},
		"application/vnd.openxmlformats-officedocument.presentationml.slidemaster+xml": {
			"source": "iana",
			"compressible": true
		},
		"application/vnd.openxmlformats-officedocument.presentationml.slideshow": {
			"source": "iana",
			"extensions": ["ppsx"]
		},
		"application/vnd.openxmlformats-officedocument.presentationml.slideshow.main+xml": {
			"source": "iana",
			"compressible": true
		},
		"application/vnd.openxmlformats-officedocument.presentationml.slideupdateinfo+xml": {
			"source": "iana",
			"compressible": true
		},
		"application/vnd.openxmlformats-officedocument.presentationml.tablestyles+xml": {
			"source": "iana",
			"compressible": true
		},
		"application/vnd.openxmlformats-officedocument.presentationml.tags+xml": {
			"source": "iana",
			"compressible": true
		},
		"application/vnd.openxmlformats-officedocument.presentationml.template": {
			"source": "iana",
			"extensions": ["potx"]
		},
		"application/vnd.openxmlformats-officedocument.presentationml.template.main+xml": {
			"source": "iana",
			"compressible": true
		},
		"application/vnd.openxmlformats-officedocument.presentationml.viewprops+xml": {
			"source": "iana",
			"compressible": true
		},
		"application/vnd.openxmlformats-officedocument.spreadsheetml.calcchain+xml": {
			"source": "iana",
			"compressible": true
		},
		"application/vnd.openxmlformats-officedocument.spreadsheetml.chartsheet+xml": {
			"source": "iana",
			"compressible": true
		},
		"application/vnd.openxmlformats-officedocument.spreadsheetml.comments+xml": {
			"source": "iana",
			"compressible": true
		},
		"application/vnd.openxmlformats-officedocument.spreadsheetml.connections+xml": {
			"source": "iana",
			"compressible": true
		},
		"application/vnd.openxmlformats-officedocument.spreadsheetml.dialogsheet+xml": {
			"source": "iana",
			"compressible": true
		},
		"application/vnd.openxmlformats-officedocument.spreadsheetml.externallink+xml": {
			"source": "iana",
			"compressible": true
		},
		"application/vnd.openxmlformats-officedocument.spreadsheetml.pivotcachedefinition+xml": {
			"source": "iana",
			"compressible": true
		},
		"application/vnd.openxmlformats-officedocument.spreadsheetml.pivotcacherecords+xml": {
			"source": "iana",
			"compressible": true
		},
		"application/vnd.openxmlformats-officedocument.spreadsheetml.pivottable+xml": {
			"source": "iana",
			"compressible": true
		},
		"application/vnd.openxmlformats-officedocument.spreadsheetml.querytable+xml": {
			"source": "iana",
			"compressible": true
		},
		"application/vnd.openxmlformats-officedocument.spreadsheetml.revisionheaders+xml": {
			"source": "iana",
			"compressible": true
		},
		"application/vnd.openxmlformats-officedocument.spreadsheetml.revisionlog+xml": {
			"source": "iana",
			"compressible": true
		},
		"application/vnd.openxmlformats-officedocument.spreadsheetml.sharedstrings+xml": {
			"source": "iana",
			"compressible": true
		},
		"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": {
			"source": "iana",
			"compressible": false,
			"extensions": ["xlsx"]
		},
		"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml": {
			"source": "iana",
			"compressible": true
		},
		"application/vnd.openxmlformats-officedocument.spreadsheetml.sheetmetadata+xml": {
			"source": "iana",
			"compressible": true
		},
		"application/vnd.openxmlformats-officedocument.spreadsheetml.styles+xml": {
			"source": "iana",
			"compressible": true
		},
		"application/vnd.openxmlformats-officedocument.spreadsheetml.table+xml": {
			"source": "iana",
			"compressible": true
		},
		"application/vnd.openxmlformats-officedocument.spreadsheetml.tablesinglecells+xml": {
			"source": "iana",
			"compressible": true
		},
		"application/vnd.openxmlformats-officedocument.spreadsheetml.template": {
			"source": "iana",
			"extensions": ["xltx"]
		},
		"application/vnd.openxmlformats-officedocument.spreadsheetml.template.main+xml": {
			"source": "iana",
			"compressible": true
		},
		"application/vnd.openxmlformats-officedocument.spreadsheetml.usernames+xml": {
			"source": "iana",
			"compressible": true
		},
		"application/vnd.openxmlformats-officedocument.spreadsheetml.volatiledependencies+xml": {
			"source": "iana",
			"compressible": true
		},
		"application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml": {
			"source": "iana",
			"compressible": true
		},
		"application/vnd.openxmlformats-officedocument.theme+xml": {
			"source": "iana",
			"compressible": true
		},
		"application/vnd.openxmlformats-officedocument.themeoverride+xml": {
			"source": "iana",
			"compressible": true
		},
		"application/vnd.openxmlformats-officedocument.vmldrawing": { "source": "iana" },
		"application/vnd.openxmlformats-officedocument.wordprocessingml.comments+xml": {
			"source": "iana",
			"compressible": true
		},
		"application/vnd.openxmlformats-officedocument.wordprocessingml.document": {
			"source": "iana",
			"compressible": false,
			"extensions": ["docx"]
		},
		"application/vnd.openxmlformats-officedocument.wordprocessingml.document.glossary+xml": {
			"source": "iana",
			"compressible": true
		},
		"application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml": {
			"source": "iana",
			"compressible": true
		},
		"application/vnd.openxmlformats-officedocument.wordprocessingml.endnotes+xml": {
			"source": "iana",
			"compressible": true
		},
		"application/vnd.openxmlformats-officedocument.wordprocessingml.fonttable+xml": {
			"source": "iana",
			"compressible": true
		},
		"application/vnd.openxmlformats-officedocument.wordprocessingml.footer+xml": {
			"source": "iana",
			"compressible": true
		},
		"application/vnd.openxmlformats-officedocument.wordprocessingml.footnotes+xml": {
			"source": "iana",
			"compressible": true
		},
		"application/vnd.openxmlformats-officedocument.wordprocessingml.numbering+xml": {
			"source": "iana",
			"compressible": true
		},
		"application/vnd.openxmlformats-officedocument.wordprocessingml.settings+xml": {
			"source": "iana",
			"compressible": true
		},
		"application/vnd.openxmlformats-officedocument.wordprocessingml.styles+xml": {
			"source": "iana",
			"compressible": true
		},
		"application/vnd.openxmlformats-officedocument.wordprocessingml.template": {
			"source": "iana",
			"extensions": ["dotx"]
		},
		"application/vnd.openxmlformats-officedocument.wordprocessingml.template.main+xml": {
			"source": "iana",
			"compressible": true
		},
		"application/vnd.openxmlformats-officedocument.wordprocessingml.websettings+xml": {
			"source": "iana",
			"compressible": true
		},
		"application/vnd.openxmlformats-package.core-properties+xml": {
			"source": "iana",
			"compressible": true
		},
		"application/vnd.openxmlformats-package.digital-signature-xmlsignature+xml": {
			"source": "iana",
			"compressible": true
		},
		"application/vnd.openxmlformats-package.relationships+xml": {
			"source": "iana",
			"compressible": true
		},
		"application/vnd.oracle.resource+json": {
			"source": "iana",
			"compressible": true
		},
		"application/vnd.orange.indata": { "source": "iana" },
		"application/vnd.osa.netdeploy": { "source": "iana" },
		"application/vnd.osgeo.mapguide.package": {
			"source": "iana",
			"extensions": ["mgp"]
		},
		"application/vnd.osgi.bundle": { "source": "iana" },
		"application/vnd.osgi.dp": {
			"source": "iana",
			"extensions": ["dp"]
		},
		"application/vnd.osgi.subsystem": {
			"source": "iana",
			"extensions": ["esa"]
		},
		"application/vnd.otps.ct-kip+xml": {
			"source": "iana",
			"compressible": true
		},
		"application/vnd.oxli.countgraph": { "source": "iana" },
		"application/vnd.pagerduty+json": {
			"source": "iana",
			"compressible": true
		},
		"application/vnd.palm": {
			"source": "iana",
			"extensions": [
				"pdb",
				"pqa",
				"oprc"
			]
		},
		"application/vnd.panoply": { "source": "iana" },
		"application/vnd.paos.xml": { "source": "iana" },
		"application/vnd.patentdive": { "source": "iana" },
		"application/vnd.patientecommsdoc": { "source": "iana" },
		"application/vnd.pawaafile": {
			"source": "iana",
			"extensions": ["paw"]
		},
		"application/vnd.pcos": { "source": "iana" },
		"application/vnd.pg.format": {
			"source": "iana",
			"extensions": ["str"]
		},
		"application/vnd.pg.osasli": {
			"source": "iana",
			"extensions": ["ei6"]
		},
		"application/vnd.piaccess.application-licence": { "source": "iana" },
		"application/vnd.picsel": {
			"source": "iana",
			"extensions": ["efif"]
		},
		"application/vnd.pmi.widget": {
			"source": "iana",
			"extensions": ["wg"]
		},
		"application/vnd.poc.group-advertisement+xml": {
			"source": "iana",
			"compressible": true
		},
		"application/vnd.pocketlearn": {
			"source": "iana",
			"extensions": ["plf"]
		},
		"application/vnd.powerbuilder6": {
			"source": "iana",
			"extensions": ["pbd"]
		},
		"application/vnd.powerbuilder6-s": { "source": "iana" },
		"application/vnd.powerbuilder7": { "source": "iana" },
		"application/vnd.powerbuilder7-s": { "source": "iana" },
		"application/vnd.powerbuilder75": { "source": "iana" },
		"application/vnd.powerbuilder75-s": { "source": "iana" },
		"application/vnd.preminet": { "source": "iana" },
		"application/vnd.previewsystems.box": {
			"source": "iana",
			"extensions": ["box"]
		},
		"application/vnd.proteus.magazine": {
			"source": "iana",
			"extensions": ["mgz"]
		},
		"application/vnd.psfs": { "source": "iana" },
		"application/vnd.publishare-delta-tree": {
			"source": "iana",
			"extensions": ["qps"]
		},
		"application/vnd.pvi.ptid1": {
			"source": "iana",
			"extensions": ["ptid"]
		},
		"application/vnd.pwg-multiplexed": { "source": "iana" },
		"application/vnd.pwg-xhtml-print+xml": {
			"source": "iana",
			"compressible": true
		},
		"application/vnd.qualcomm.brew-app-res": { "source": "iana" },
		"application/vnd.quarantainenet": { "source": "iana" },
		"application/vnd.quark.quarkxpress": {
			"source": "iana",
			"extensions": [
				"qxd",
				"qxt",
				"qwd",
				"qwt",
				"qxl",
				"qxb"
			]
		},
		"application/vnd.quobject-quoxdocument": { "source": "iana" },
		"application/vnd.radisys.moml+xml": {
			"source": "iana",
			"compressible": true
		},
		"application/vnd.radisys.msml+xml": {
			"source": "iana",
			"compressible": true
		},
		"application/vnd.radisys.msml-audit+xml": {
			"source": "iana",
			"compressible": true
		},
		"application/vnd.radisys.msml-audit-conf+xml": {
			"source": "iana",
			"compressible": true
		},
		"application/vnd.radisys.msml-audit-conn+xml": {
			"source": "iana",
			"compressible": true
		},
		"application/vnd.radisys.msml-audit-dialog+xml": {
			"source": "iana",
			"compressible": true
		},
		"application/vnd.radisys.msml-audit-stream+xml": {
			"source": "iana",
			"compressible": true
		},
		"application/vnd.radisys.msml-conf+xml": {
			"source": "iana",
			"compressible": true
		},
		"application/vnd.radisys.msml-dialog+xml": {
			"source": "iana",
			"compressible": true
		},
		"application/vnd.radisys.msml-dialog-base+xml": {
			"source": "iana",
			"compressible": true
		},
		"application/vnd.radisys.msml-dialog-fax-detect+xml": {
			"source": "iana",
			"compressible": true
		},
		"application/vnd.radisys.msml-dialog-fax-sendrecv+xml": {
			"source": "iana",
			"compressible": true
		},
		"application/vnd.radisys.msml-dialog-group+xml": {
			"source": "iana",
			"compressible": true
		},
		"application/vnd.radisys.msml-dialog-speech+xml": {
			"source": "iana",
			"compressible": true
		},
		"application/vnd.radisys.msml-dialog-transform+xml": {
			"source": "iana",
			"compressible": true
		},
		"application/vnd.rainstor.data": { "source": "iana" },
		"application/vnd.rapid": { "source": "iana" },
		"application/vnd.rar": {
			"source": "iana",
			"extensions": ["rar"]
		},
		"application/vnd.realvnc.bed": {
			"source": "iana",
			"extensions": ["bed"]
		},
		"application/vnd.recordare.musicxml": {
			"source": "iana",
			"extensions": ["mxl"]
		},
		"application/vnd.recordare.musicxml+xml": {
			"source": "iana",
			"compressible": true,
			"extensions": ["musicxml"]
		},
		"application/vnd.renlearn.rlprint": { "source": "iana" },
		"application/vnd.resilient.logic": { "source": "iana" },
		"application/vnd.restful+json": {
			"source": "iana",
			"compressible": true
		},
		"application/vnd.rig.cryptonote": {
			"source": "iana",
			"extensions": ["cryptonote"]
		},
		"application/vnd.rim.cod": {
			"source": "apache",
			"extensions": ["cod"]
		},
		"application/vnd.rn-realmedia": {
			"source": "apache",
			"extensions": ["rm"]
		},
		"application/vnd.rn-realmedia-vbr": {
			"source": "apache",
			"extensions": ["rmvb"]
		},
		"application/vnd.route66.link66+xml": {
			"source": "iana",
			"compressible": true,
			"extensions": ["link66"]
		},
		"application/vnd.rs-274x": { "source": "iana" },
		"application/vnd.ruckus.download": { "source": "iana" },
		"application/vnd.s3sms": { "source": "iana" },
		"application/vnd.sailingtracker.track": {
			"source": "iana",
			"extensions": ["st"]
		},
		"application/vnd.sar": { "source": "iana" },
		"application/vnd.sbm.cid": { "source": "iana" },
		"application/vnd.sbm.mid2": { "source": "iana" },
		"application/vnd.scribus": { "source": "iana" },
		"application/vnd.sealed.3df": { "source": "iana" },
		"application/vnd.sealed.csf": { "source": "iana" },
		"application/vnd.sealed.doc": { "source": "iana" },
		"application/vnd.sealed.eml": { "source": "iana" },
		"application/vnd.sealed.mht": { "source": "iana" },
		"application/vnd.sealed.net": { "source": "iana" },
		"application/vnd.sealed.ppt": { "source": "iana" },
		"application/vnd.sealed.tiff": { "source": "iana" },
		"application/vnd.sealed.xls": { "source": "iana" },
		"application/vnd.sealedmedia.softseal.html": { "source": "iana" },
		"application/vnd.sealedmedia.softseal.pdf": { "source": "iana" },
		"application/vnd.seemail": {
			"source": "iana",
			"extensions": ["see"]
		},
		"application/vnd.seis+json": {
			"source": "iana",
			"compressible": true
		},
		"application/vnd.sema": {
			"source": "iana",
			"extensions": ["sema"]
		},
		"application/vnd.semd": {
			"source": "iana",
			"extensions": ["semd"]
		},
		"application/vnd.semf": {
			"source": "iana",
			"extensions": ["semf"]
		},
		"application/vnd.shade-save-file": { "source": "iana" },
		"application/vnd.shana.informed.formdata": {
			"source": "iana",
			"extensions": ["ifm"]
		},
		"application/vnd.shana.informed.formtemplate": {
			"source": "iana",
			"extensions": ["itp"]
		},
		"application/vnd.shana.informed.interchange": {
			"source": "iana",
			"extensions": ["iif"]
		},
		"application/vnd.shana.informed.package": {
			"source": "iana",
			"extensions": ["ipk"]
		},
		"application/vnd.shootproof+json": {
			"source": "iana",
			"compressible": true
		},
		"application/vnd.shopkick+json": {
			"source": "iana",
			"compressible": true
		},
		"application/vnd.shp": { "source": "iana" },
		"application/vnd.shx": { "source": "iana" },
		"application/vnd.sigrok.session": { "source": "iana" },
		"application/vnd.simtech-mindmapper": {
			"source": "iana",
			"extensions": ["twd", "twds"]
		},
		"application/vnd.siren+json": {
			"source": "iana",
			"compressible": true
		},
		"application/vnd.smaf": {
			"source": "iana",
			"extensions": ["mmf"]
		},
		"application/vnd.smart.notebook": { "source": "iana" },
		"application/vnd.smart.teacher": {
			"source": "iana",
			"extensions": ["teacher"]
		},
		"application/vnd.snesdev-page-table": { "source": "iana" },
		"application/vnd.software602.filler.form+xml": {
			"source": "iana",
			"compressible": true,
			"extensions": ["fo"]
		},
		"application/vnd.software602.filler.form-xml-zip": { "source": "iana" },
		"application/vnd.solent.sdkm+xml": {
			"source": "iana",
			"compressible": true,
			"extensions": ["sdkm", "sdkd"]
		},
		"application/vnd.spotfire.dxp": {
			"source": "iana",
			"extensions": ["dxp"]
		},
		"application/vnd.spotfire.sfs": {
			"source": "iana",
			"extensions": ["sfs"]
		},
		"application/vnd.sqlite3": { "source": "iana" },
		"application/vnd.sss-cod": { "source": "iana" },
		"application/vnd.sss-dtf": { "source": "iana" },
		"application/vnd.sss-ntf": { "source": "iana" },
		"application/vnd.stardivision.calc": {
			"source": "apache",
			"extensions": ["sdc"]
		},
		"application/vnd.stardivision.draw": {
			"source": "apache",
			"extensions": ["sda"]
		},
		"application/vnd.stardivision.impress": {
			"source": "apache",
			"extensions": ["sdd"]
		},
		"application/vnd.stardivision.math": {
			"source": "apache",
			"extensions": ["smf"]
		},
		"application/vnd.stardivision.writer": {
			"source": "apache",
			"extensions": ["sdw", "vor"]
		},
		"application/vnd.stardivision.writer-global": {
			"source": "apache",
			"extensions": ["sgl"]
		},
		"application/vnd.stepmania.package": {
			"source": "iana",
			"extensions": ["smzip"]
		},
		"application/vnd.stepmania.stepchart": {
			"source": "iana",
			"extensions": ["sm"]
		},
		"application/vnd.street-stream": { "source": "iana" },
		"application/vnd.sun.wadl+xml": {
			"source": "iana",
			"compressible": true,
			"extensions": ["wadl"]
		},
		"application/vnd.sun.xml.calc": {
			"source": "apache",
			"extensions": ["sxc"]
		},
		"application/vnd.sun.xml.calc.template": {
			"source": "apache",
			"extensions": ["stc"]
		},
		"application/vnd.sun.xml.draw": {
			"source": "apache",
			"extensions": ["sxd"]
		},
		"application/vnd.sun.xml.draw.template": {
			"source": "apache",
			"extensions": ["std"]
		},
		"application/vnd.sun.xml.impress": {
			"source": "apache",
			"extensions": ["sxi"]
		},
		"application/vnd.sun.xml.impress.template": {
			"source": "apache",
			"extensions": ["sti"]
		},
		"application/vnd.sun.xml.math": {
			"source": "apache",
			"extensions": ["sxm"]
		},
		"application/vnd.sun.xml.writer": {
			"source": "apache",
			"extensions": ["sxw"]
		},
		"application/vnd.sun.xml.writer.global": {
			"source": "apache",
			"extensions": ["sxg"]
		},
		"application/vnd.sun.xml.writer.template": {
			"source": "apache",
			"extensions": ["stw"]
		},
		"application/vnd.sus-calendar": {
			"source": "iana",
			"extensions": ["sus", "susp"]
		},
		"application/vnd.svd": {
			"source": "iana",
			"extensions": ["svd"]
		},
		"application/vnd.swiftview-ics": { "source": "iana" },
		"application/vnd.sycle+xml": {
			"source": "iana",
			"compressible": true
		},
		"application/vnd.syft+json": {
			"source": "iana",
			"compressible": true
		},
		"application/vnd.symbian.install": {
			"source": "apache",
			"extensions": ["sis", "sisx"]
		},
		"application/vnd.syncml+xml": {
			"source": "iana",
			"charset": "UTF-8",
			"compressible": true,
			"extensions": ["xsm"]
		},
		"application/vnd.syncml.dm+wbxml": {
			"source": "iana",
			"charset": "UTF-8",
			"extensions": ["bdm"]
		},
		"application/vnd.syncml.dm+xml": {
			"source": "iana",
			"charset": "UTF-8",
			"compressible": true,
			"extensions": ["xdm"]
		},
		"application/vnd.syncml.dm.notification": { "source": "iana" },
		"application/vnd.syncml.dmddf+wbxml": { "source": "iana" },
		"application/vnd.syncml.dmddf+xml": {
			"source": "iana",
			"charset": "UTF-8",
			"compressible": true,
			"extensions": ["ddf"]
		},
		"application/vnd.syncml.dmtnds+wbxml": { "source": "iana" },
		"application/vnd.syncml.dmtnds+xml": {
			"source": "iana",
			"charset": "UTF-8",
			"compressible": true
		},
		"application/vnd.syncml.ds.notification": { "source": "iana" },
		"application/vnd.tableschema+json": {
			"source": "iana",
			"compressible": true
		},
		"application/vnd.tao.intent-module-archive": {
			"source": "iana",
			"extensions": ["tao"]
		},
		"application/vnd.tcpdump.pcap": {
			"source": "iana",
			"extensions": [
				"pcap",
				"cap",
				"dmp"
			]
		},
		"application/vnd.think-cell.ppttc+json": {
			"source": "iana",
			"compressible": true
		},
		"application/vnd.tmd.mediaflex.api+xml": {
			"source": "iana",
			"compressible": true
		},
		"application/vnd.tml": { "source": "iana" },
		"application/vnd.tmobile-livetv": {
			"source": "iana",
			"extensions": ["tmo"]
		},
		"application/vnd.tri.onesource": { "source": "iana" },
		"application/vnd.trid.tpt": {
			"source": "iana",
			"extensions": ["tpt"]
		},
		"application/vnd.triscape.mxs": {
			"source": "iana",
			"extensions": ["mxs"]
		},
		"application/vnd.trueapp": {
			"source": "iana",
			"extensions": ["tra"]
		},
		"application/vnd.truedoc": { "source": "iana" },
		"application/vnd.ubisoft.webplayer": { "source": "iana" },
		"application/vnd.ufdl": {
			"source": "iana",
			"extensions": ["ufd", "ufdl"]
		},
		"application/vnd.uiq.theme": {
			"source": "iana",
			"extensions": ["utz"]
		},
		"application/vnd.umajin": {
			"source": "iana",
			"extensions": ["umj"]
		},
		"application/vnd.unity": {
			"source": "iana",
			"extensions": ["unityweb"]
		},
		"application/vnd.uoml+xml": {
			"source": "iana",
			"compressible": true,
			"extensions": ["uoml"]
		},
		"application/vnd.uplanet.alert": { "source": "iana" },
		"application/vnd.uplanet.alert-wbxml": { "source": "iana" },
		"application/vnd.uplanet.bearer-choice": { "source": "iana" },
		"application/vnd.uplanet.bearer-choice-wbxml": { "source": "iana" },
		"application/vnd.uplanet.cacheop": { "source": "iana" },
		"application/vnd.uplanet.cacheop-wbxml": { "source": "iana" },
		"application/vnd.uplanet.channel": { "source": "iana" },
		"application/vnd.uplanet.channel-wbxml": { "source": "iana" },
		"application/vnd.uplanet.list": { "source": "iana" },
		"application/vnd.uplanet.list-wbxml": { "source": "iana" },
		"application/vnd.uplanet.listcmd": { "source": "iana" },
		"application/vnd.uplanet.listcmd-wbxml": { "source": "iana" },
		"application/vnd.uplanet.signal": { "source": "iana" },
		"application/vnd.uri-map": { "source": "iana" },
		"application/vnd.valve.source.material": { "source": "iana" },
		"application/vnd.vcx": {
			"source": "iana",
			"extensions": ["vcx"]
		},
		"application/vnd.vd-study": { "source": "iana" },
		"application/vnd.vectorworks": { "source": "iana" },
		"application/vnd.vel+json": {
			"source": "iana",
			"compressible": true
		},
		"application/vnd.verimatrix.vcas": { "source": "iana" },
		"application/vnd.veritone.aion+json": {
			"source": "iana",
			"compressible": true
		},
		"application/vnd.veryant.thin": { "source": "iana" },
		"application/vnd.ves.encrypted": { "source": "iana" },
		"application/vnd.vidsoft.vidconference": { "source": "iana" },
		"application/vnd.visio": {
			"source": "iana",
			"extensions": [
				"vsd",
				"vst",
				"vss",
				"vsw"
			]
		},
		"application/vnd.visionary": {
			"source": "iana",
			"extensions": ["vis"]
		},
		"application/vnd.vividence.scriptfile": { "source": "iana" },
		"application/vnd.vsf": {
			"source": "iana",
			"extensions": ["vsf"]
		},
		"application/vnd.wap.sic": { "source": "iana" },
		"application/vnd.wap.slc": { "source": "iana" },
		"application/vnd.wap.wbxml": {
			"source": "iana",
			"charset": "UTF-8",
			"extensions": ["wbxml"]
		},
		"application/vnd.wap.wmlc": {
			"source": "iana",
			"extensions": ["wmlc"]
		},
		"application/vnd.wap.wmlscriptc": {
			"source": "iana",
			"extensions": ["wmlsc"]
		},
		"application/vnd.webturbo": {
			"source": "iana",
			"extensions": ["wtb"]
		},
		"application/vnd.wfa.dpp": { "source": "iana" },
		"application/vnd.wfa.p2p": { "source": "iana" },
		"application/vnd.wfa.wsc": { "source": "iana" },
		"application/vnd.windows.devicepairing": { "source": "iana" },
		"application/vnd.wmc": { "source": "iana" },
		"application/vnd.wmf.bootstrap": { "source": "iana" },
		"application/vnd.wolfram.mathematica": { "source": "iana" },
		"application/vnd.wolfram.mathematica.package": { "source": "iana" },
		"application/vnd.wolfram.player": {
			"source": "iana",
			"extensions": ["nbp"]
		},
		"application/vnd.wordperfect": {
			"source": "iana",
			"extensions": ["wpd"]
		},
		"application/vnd.wqd": {
			"source": "iana",
			"extensions": ["wqd"]
		},
		"application/vnd.wrq-hp3000-labelled": { "source": "iana" },
		"application/vnd.wt.stf": {
			"source": "iana",
			"extensions": ["stf"]
		},
		"application/vnd.wv.csp+wbxml": { "source": "iana" },
		"application/vnd.wv.csp+xml": {
			"source": "iana",
			"compressible": true
		},
		"application/vnd.wv.ssp+xml": {
			"source": "iana",
			"compressible": true
		},
		"application/vnd.xacml+json": {
			"source": "iana",
			"compressible": true
		},
		"application/vnd.xara": {
			"source": "iana",
			"extensions": ["xar"]
		},
		"application/vnd.xfdl": {
			"source": "iana",
			"extensions": ["xfdl"]
		},
		"application/vnd.xfdl.webform": { "source": "iana" },
		"application/vnd.xmi+xml": {
			"source": "iana",
			"compressible": true
		},
		"application/vnd.xmpie.cpkg": { "source": "iana" },
		"application/vnd.xmpie.dpkg": { "source": "iana" },
		"application/vnd.xmpie.plan": { "source": "iana" },
		"application/vnd.xmpie.ppkg": { "source": "iana" },
		"application/vnd.xmpie.xlim": { "source": "iana" },
		"application/vnd.yamaha.hv-dic": {
			"source": "iana",
			"extensions": ["hvd"]
		},
		"application/vnd.yamaha.hv-script": {
			"source": "iana",
			"extensions": ["hvs"]
		},
		"application/vnd.yamaha.hv-voice": {
			"source": "iana",
			"extensions": ["hvp"]
		},
		"application/vnd.yamaha.openscoreformat": {
			"source": "iana",
			"extensions": ["osf"]
		},
		"application/vnd.yamaha.openscoreformat.osfpvg+xml": {
			"source": "iana",
			"compressible": true,
			"extensions": ["osfpvg"]
		},
		"application/vnd.yamaha.remote-setup": { "source": "iana" },
		"application/vnd.yamaha.smaf-audio": {
			"source": "iana",
			"extensions": ["saf"]
		},
		"application/vnd.yamaha.smaf-phrase": {
			"source": "iana",
			"extensions": ["spf"]
		},
		"application/vnd.yamaha.through-ngn": { "source": "iana" },
		"application/vnd.yamaha.tunnel-udpencap": { "source": "iana" },
		"application/vnd.yaoweme": { "source": "iana" },
		"application/vnd.yellowriver-custom-menu": {
			"source": "iana",
			"extensions": ["cmp"]
		},
		"application/vnd.youtube.yt": { "source": "iana" },
		"application/vnd.zul": {
			"source": "iana",
			"extensions": ["zir", "zirz"]
		},
		"application/vnd.zzazz.deck+xml": {
			"source": "iana",
			"compressible": true,
			"extensions": ["zaz"]
		},
		"application/voicexml+xml": {
			"source": "iana",
			"compressible": true,
			"extensions": ["vxml"]
		},
		"application/voucher-cms+json": {
			"source": "iana",
			"compressible": true
		},
		"application/vq-rtcpxr": { "source": "iana" },
		"application/wasm": {
			"source": "iana",
			"compressible": true,
			"extensions": ["wasm"]
		},
		"application/watcherinfo+xml": {
			"source": "iana",
			"compressible": true,
			"extensions": ["wif"]
		},
		"application/webpush-options+json": {
			"source": "iana",
			"compressible": true
		},
		"application/whoispp-query": { "source": "iana" },
		"application/whoispp-response": { "source": "iana" },
		"application/widget": {
			"source": "iana",
			"extensions": ["wgt"]
		},
		"application/winhlp": {
			"source": "apache",
			"extensions": ["hlp"]
		},
		"application/wita": { "source": "iana" },
		"application/wordperfect5.1": { "source": "iana" },
		"application/wsdl+xml": {
			"source": "iana",
			"compressible": true,
			"extensions": ["wsdl"]
		},
		"application/wspolicy+xml": {
			"source": "iana",
			"compressible": true,
			"extensions": ["wspolicy"]
		},
		"application/x-7z-compressed": {
			"source": "apache",
			"compressible": false,
			"extensions": ["7z"]
		},
		"application/x-abiword": {
			"source": "apache",
			"extensions": ["abw"]
		},
		"application/x-ace-compressed": {
			"source": "apache",
			"extensions": ["ace"]
		},
		"application/x-amf": { "source": "apache" },
		"application/x-apple-diskimage": {
			"source": "apache",
			"extensions": ["dmg"]
		},
		"application/x-arj": {
			"compressible": false,
			"extensions": ["arj"]
		},
		"application/x-authorware-bin": {
			"source": "apache",
			"extensions": [
				"aab",
				"x32",
				"u32",
				"vox"
			]
		},
		"application/x-authorware-map": {
			"source": "apache",
			"extensions": ["aam"]
		},
		"application/x-authorware-seg": {
			"source": "apache",
			"extensions": ["aas"]
		},
		"application/x-bcpio": {
			"source": "apache",
			"extensions": ["bcpio"]
		},
		"application/x-bdoc": {
			"compressible": false,
			"extensions": ["bdoc"]
		},
		"application/x-bittorrent": {
			"source": "apache",
			"extensions": ["torrent"]
		},
		"application/x-blorb": {
			"source": "apache",
			"extensions": ["blb", "blorb"]
		},
		"application/x-bzip": {
			"source": "apache",
			"compressible": false,
			"extensions": ["bz"]
		},
		"application/x-bzip2": {
			"source": "apache",
			"compressible": false,
			"extensions": ["bz2", "boz"]
		},
		"application/x-cbr": {
			"source": "apache",
			"extensions": [
				"cbr",
				"cba",
				"cbt",
				"cbz",
				"cb7"
			]
		},
		"application/x-cdlink": {
			"source": "apache",
			"extensions": ["vcd"]
		},
		"application/x-cfs-compressed": {
			"source": "apache",
			"extensions": ["cfs"]
		},
		"application/x-chat": {
			"source": "apache",
			"extensions": ["chat"]
		},
		"application/x-chess-pgn": {
			"source": "apache",
			"extensions": ["pgn"]
		},
		"application/x-chrome-extension": { "extensions": ["crx"] },
		"application/x-cocoa": {
			"source": "nginx",
			"extensions": ["cco"]
		},
		"application/x-compress": { "source": "apache" },
		"application/x-conference": {
			"source": "apache",
			"extensions": ["nsc"]
		},
		"application/x-cpio": {
			"source": "apache",
			"extensions": ["cpio"]
		},
		"application/x-csh": {
			"source": "apache",
			"extensions": ["csh"]
		},
		"application/x-deb": { "compressible": false },
		"application/x-debian-package": {
			"source": "apache",
			"extensions": ["deb", "udeb"]
		},
		"application/x-dgc-compressed": {
			"source": "apache",
			"extensions": ["dgc"]
		},
		"application/x-director": {
			"source": "apache",
			"extensions": [
				"dir",
				"dcr",
				"dxr",
				"cst",
				"cct",
				"cxt",
				"w3d",
				"fgd",
				"swa"
			]
		},
		"application/x-doom": {
			"source": "apache",
			"extensions": ["wad"]
		},
		"application/x-dtbncx+xml": {
			"source": "apache",
			"compressible": true,
			"extensions": ["ncx"]
		},
		"application/x-dtbook+xml": {
			"source": "apache",
			"compressible": true,
			"extensions": ["dtb"]
		},
		"application/x-dtbresource+xml": {
			"source": "apache",
			"compressible": true,
			"extensions": ["res"]
		},
		"application/x-dvi": {
			"source": "apache",
			"compressible": false,
			"extensions": ["dvi"]
		},
		"application/x-envoy": {
			"source": "apache",
			"extensions": ["evy"]
		},
		"application/x-eva": {
			"source": "apache",
			"extensions": ["eva"]
		},
		"application/x-font-bdf": {
			"source": "apache",
			"extensions": ["bdf"]
		},
		"application/x-font-dos": { "source": "apache" },
		"application/x-font-framemaker": { "source": "apache" },
		"application/x-font-ghostscript": {
			"source": "apache",
			"extensions": ["gsf"]
		},
		"application/x-font-libgrx": { "source": "apache" },
		"application/x-font-linux-psf": {
			"source": "apache",
			"extensions": ["psf"]
		},
		"application/x-font-pcf": {
			"source": "apache",
			"extensions": ["pcf"]
		},
		"application/x-font-snf": {
			"source": "apache",
			"extensions": ["snf"]
		},
		"application/x-font-speedo": { "source": "apache" },
		"application/x-font-sunos-news": { "source": "apache" },
		"application/x-font-type1": {
			"source": "apache",
			"extensions": [
				"pfa",
				"pfb",
				"pfm",
				"afm"
			]
		},
		"application/x-font-vfont": { "source": "apache" },
		"application/x-freearc": {
			"source": "apache",
			"extensions": ["arc"]
		},
		"application/x-futuresplash": {
			"source": "apache",
			"extensions": ["spl"]
		},
		"application/x-gca-compressed": {
			"source": "apache",
			"extensions": ["gca"]
		},
		"application/x-glulx": {
			"source": "apache",
			"extensions": ["ulx"]
		},
		"application/x-gnumeric": {
			"source": "apache",
			"extensions": ["gnumeric"]
		},
		"application/x-gramps-xml": {
			"source": "apache",
			"extensions": ["gramps"]
		},
		"application/x-gtar": {
			"source": "apache",
			"extensions": ["gtar"]
		},
		"application/x-gzip": { "source": "apache" },
		"application/x-hdf": {
			"source": "apache",
			"extensions": ["hdf"]
		},
		"application/x-httpd-php": {
			"compressible": true,
			"extensions": ["php"]
		},
		"application/x-install-instructions": {
			"source": "apache",
			"extensions": ["install"]
		},
		"application/x-iso9660-image": {
			"source": "apache",
			"extensions": ["iso"]
		},
		"application/x-iwork-keynote-sffkey": { "extensions": ["key"] },
		"application/x-iwork-numbers-sffnumbers": { "extensions": ["numbers"] },
		"application/x-iwork-pages-sffpages": { "extensions": ["pages"] },
		"application/x-java-archive-diff": {
			"source": "nginx",
			"extensions": ["jardiff"]
		},
		"application/x-java-jnlp-file": {
			"source": "apache",
			"compressible": false,
			"extensions": ["jnlp"]
		},
		"application/x-javascript": { "compressible": true },
		"application/x-keepass2": { "extensions": ["kdbx"] },
		"application/x-latex": {
			"source": "apache",
			"compressible": false,
			"extensions": ["latex"]
		},
		"application/x-lua-bytecode": { "extensions": ["luac"] },
		"application/x-lzh-compressed": {
			"source": "apache",
			"extensions": ["lzh", "lha"]
		},
		"application/x-makeself": {
			"source": "nginx",
			"extensions": ["run"]
		},
		"application/x-mie": {
			"source": "apache",
			"extensions": ["mie"]
		},
		"application/x-mobipocket-ebook": {
			"source": "apache",
			"extensions": ["prc", "mobi"]
		},
		"application/x-mpegurl": { "compressible": false },
		"application/x-ms-application": {
			"source": "apache",
			"extensions": ["application"]
		},
		"application/x-ms-shortcut": {
			"source": "apache",
			"extensions": ["lnk"]
		},
		"application/x-ms-wmd": {
			"source": "apache",
			"extensions": ["wmd"]
		},
		"application/x-ms-wmz": {
			"source": "apache",
			"extensions": ["wmz"]
		},
		"application/x-ms-xbap": {
			"source": "apache",
			"extensions": ["xbap"]
		},
		"application/x-msaccess": {
			"source": "apache",
			"extensions": ["mdb"]
		},
		"application/x-msbinder": {
			"source": "apache",
			"extensions": ["obd"]
		},
		"application/x-mscardfile": {
			"source": "apache",
			"extensions": ["crd"]
		},
		"application/x-msclip": {
			"source": "apache",
			"extensions": ["clp"]
		},
		"application/x-msdos-program": { "extensions": ["exe"] },
		"application/x-msdownload": {
			"source": "apache",
			"extensions": [
				"exe",
				"dll",
				"com",
				"bat",
				"msi"
			]
		},
		"application/x-msmediaview": {
			"source": "apache",
			"extensions": [
				"mvb",
				"m13",
				"m14"
			]
		},
		"application/x-msmetafile": {
			"source": "apache",
			"extensions": [
				"wmf",
				"wmz",
				"emf",
				"emz"
			]
		},
		"application/x-msmoney": {
			"source": "apache",
			"extensions": ["mny"]
		},
		"application/x-mspublisher": {
			"source": "apache",
			"extensions": ["pub"]
		},
		"application/x-msschedule": {
			"source": "apache",
			"extensions": ["scd"]
		},
		"application/x-msterminal": {
			"source": "apache",
			"extensions": ["trm"]
		},
		"application/x-mswrite": {
			"source": "apache",
			"extensions": ["wri"]
		},
		"application/x-netcdf": {
			"source": "apache",
			"extensions": ["nc", "cdf"]
		},
		"application/x-ns-proxy-autoconfig": {
			"compressible": true,
			"extensions": ["pac"]
		},
		"application/x-nzb": {
			"source": "apache",
			"extensions": ["nzb"]
		},
		"application/x-perl": {
			"source": "nginx",
			"extensions": ["pl", "pm"]
		},
		"application/x-pilot": {
			"source": "nginx",
			"extensions": ["prc", "pdb"]
		},
		"application/x-pkcs12": {
			"source": "apache",
			"compressible": false,
			"extensions": ["p12", "pfx"]
		},
		"application/x-pkcs7-certificates": {
			"source": "apache",
			"extensions": ["p7b", "spc"]
		},
		"application/x-pkcs7-certreqresp": {
			"source": "apache",
			"extensions": ["p7r"]
		},
		"application/x-pki-message": { "source": "iana" },
		"application/x-rar-compressed": {
			"source": "apache",
			"compressible": false,
			"extensions": ["rar"]
		},
		"application/x-redhat-package-manager": {
			"source": "nginx",
			"extensions": ["rpm"]
		},
		"application/x-research-info-systems": {
			"source": "apache",
			"extensions": ["ris"]
		},
		"application/x-sea": {
			"source": "nginx",
			"extensions": ["sea"]
		},
		"application/x-sh": {
			"source": "apache",
			"compressible": true,
			"extensions": ["sh"]
		},
		"application/x-shar": {
			"source": "apache",
			"extensions": ["shar"]
		},
		"application/x-shockwave-flash": {
			"source": "apache",
			"compressible": false,
			"extensions": ["swf"]
		},
		"application/x-silverlight-app": {
			"source": "apache",
			"extensions": ["xap"]
		},
		"application/x-sql": {
			"source": "apache",
			"extensions": ["sql"]
		},
		"application/x-stuffit": {
			"source": "apache",
			"compressible": false,
			"extensions": ["sit"]
		},
		"application/x-stuffitx": {
			"source": "apache",
			"extensions": ["sitx"]
		},
		"application/x-subrip": {
			"source": "apache",
			"extensions": ["srt"]
		},
		"application/x-sv4cpio": {
			"source": "apache",
			"extensions": ["sv4cpio"]
		},
		"application/x-sv4crc": {
			"source": "apache",
			"extensions": ["sv4crc"]
		},
		"application/x-t3vm-image": {
			"source": "apache",
			"extensions": ["t3"]
		},
		"application/x-tads": {
			"source": "apache",
			"extensions": ["gam"]
		},
		"application/x-tar": {
			"source": "apache",
			"compressible": true,
			"extensions": ["tar"]
		},
		"application/x-tcl": {
			"source": "apache",
			"extensions": ["tcl", "tk"]
		},
		"application/x-tex": {
			"source": "apache",
			"extensions": ["tex"]
		},
		"application/x-tex-tfm": {
			"source": "apache",
			"extensions": ["tfm"]
		},
		"application/x-texinfo": {
			"source": "apache",
			"extensions": ["texinfo", "texi"]
		},
		"application/x-tgif": {
			"source": "apache",
			"extensions": ["obj"]
		},
		"application/x-ustar": {
			"source": "apache",
			"extensions": ["ustar"]
		},
		"application/x-virtualbox-hdd": {
			"compressible": true,
			"extensions": ["hdd"]
		},
		"application/x-virtualbox-ova": {
			"compressible": true,
			"extensions": ["ova"]
		},
		"application/x-virtualbox-ovf": {
			"compressible": true,
			"extensions": ["ovf"]
		},
		"application/x-virtualbox-vbox": {
			"compressible": true,
			"extensions": ["vbox"]
		},
		"application/x-virtualbox-vbox-extpack": {
			"compressible": false,
			"extensions": ["vbox-extpack"]
		},
		"application/x-virtualbox-vdi": {
			"compressible": true,
			"extensions": ["vdi"]
		},
		"application/x-virtualbox-vhd": {
			"compressible": true,
			"extensions": ["vhd"]
		},
		"application/x-virtualbox-vmdk": {
			"compressible": true,
			"extensions": ["vmdk"]
		},
		"application/x-wais-source": {
			"source": "apache",
			"extensions": ["src"]
		},
		"application/x-web-app-manifest+json": {
			"compressible": true,
			"extensions": ["webapp"]
		},
		"application/x-www-form-urlencoded": {
			"source": "iana",
			"compressible": true
		},
		"application/x-x509-ca-cert": {
			"source": "iana",
			"extensions": [
				"der",
				"crt",
				"pem"
			]
		},
		"application/x-x509-ca-ra-cert": { "source": "iana" },
		"application/x-x509-next-ca-cert": { "source": "iana" },
		"application/x-xfig": {
			"source": "apache",
			"extensions": ["fig"]
		},
		"application/x-xliff+xml": {
			"source": "apache",
			"compressible": true,
			"extensions": ["xlf"]
		},
		"application/x-xpinstall": {
			"source": "apache",
			"compressible": false,
			"extensions": ["xpi"]
		},
		"application/x-xz": {
			"source": "apache",
			"extensions": ["xz"]
		},
		"application/x-zmachine": {
			"source": "apache",
			"extensions": [
				"z1",
				"z2",
				"z3",
				"z4",
				"z5",
				"z6",
				"z7",
				"z8"
			]
		},
		"application/x400-bp": { "source": "iana" },
		"application/xacml+xml": {
			"source": "iana",
			"compressible": true
		},
		"application/xaml+xml": {
			"source": "apache",
			"compressible": true,
			"extensions": ["xaml"]
		},
		"application/xcap-att+xml": {
			"source": "iana",
			"compressible": true,
			"extensions": ["xav"]
		},
		"application/xcap-caps+xml": {
			"source": "iana",
			"compressible": true,
			"extensions": ["xca"]
		},
		"application/xcap-diff+xml": {
			"source": "iana",
			"compressible": true,
			"extensions": ["xdf"]
		},
		"application/xcap-el+xml": {
			"source": "iana",
			"compressible": true,
			"extensions": ["xel"]
		},
		"application/xcap-error+xml": {
			"source": "iana",
			"compressible": true
		},
		"application/xcap-ns+xml": {
			"source": "iana",
			"compressible": true,
			"extensions": ["xns"]
		},
		"application/xcon-conference-info+xml": {
			"source": "iana",
			"compressible": true
		},
		"application/xcon-conference-info-diff+xml": {
			"source": "iana",
			"compressible": true
		},
		"application/xenc+xml": {
			"source": "iana",
			"compressible": true,
			"extensions": ["xenc"]
		},
		"application/xhtml+xml": {
			"source": "iana",
			"compressible": true,
			"extensions": ["xhtml", "xht"]
		},
		"application/xhtml-voice+xml": {
			"source": "apache",
			"compressible": true
		},
		"application/xliff+xml": {
			"source": "iana",
			"compressible": true,
			"extensions": ["xlf"]
		},
		"application/xml": {
			"source": "iana",
			"compressible": true,
			"extensions": [
				"xml",
				"xsl",
				"xsd",
				"rng"
			]
		},
		"application/xml-dtd": {
			"source": "iana",
			"compressible": true,
			"extensions": ["dtd"]
		},
		"application/xml-external-parsed-entity": { "source": "iana" },
		"application/xml-patch+xml": {
			"source": "iana",
			"compressible": true
		},
		"application/xmpp+xml": {
			"source": "iana",
			"compressible": true
		},
		"application/xop+xml": {
			"source": "iana",
			"compressible": true,
			"extensions": ["xop"]
		},
		"application/xproc+xml": {
			"source": "apache",
			"compressible": true,
			"extensions": ["xpl"]
		},
		"application/xslt+xml": {
			"source": "iana",
			"compressible": true,
			"extensions": ["xsl", "xslt"]
		},
		"application/xspf+xml": {
			"source": "apache",
			"compressible": true,
			"extensions": ["xspf"]
		},
		"application/xv+xml": {
			"source": "iana",
			"compressible": true,
			"extensions": [
				"mxml",
				"xhvml",
				"xvml",
				"xvm"
			]
		},
		"application/yang": {
			"source": "iana",
			"extensions": ["yang"]
		},
		"application/yang-data+json": {
			"source": "iana",
			"compressible": true
		},
		"application/yang-data+xml": {
			"source": "iana",
			"compressible": true
		},
		"application/yang-patch+json": {
			"source": "iana",
			"compressible": true
		},
		"application/yang-patch+xml": {
			"source": "iana",
			"compressible": true
		},
		"application/yin+xml": {
			"source": "iana",
			"compressible": true,
			"extensions": ["yin"]
		},
		"application/zip": {
			"source": "iana",
			"compressible": false,
			"extensions": ["zip"]
		},
		"application/zlib": { "source": "iana" },
		"application/zstd": { "source": "iana" },
		"audio/1d-interleaved-parityfec": { "source": "iana" },
		"audio/32kadpcm": { "source": "iana" },
		"audio/3gpp": {
			"source": "iana",
			"compressible": false,
			"extensions": ["3gpp"]
		},
		"audio/3gpp2": { "source": "iana" },
		"audio/aac": { "source": "iana" },
		"audio/ac3": { "source": "iana" },
		"audio/adpcm": {
			"source": "apache",
			"extensions": ["adp"]
		},
		"audio/amr": {
			"source": "iana",
			"extensions": ["amr"]
		},
		"audio/amr-wb": { "source": "iana" },
		"audio/amr-wb+": { "source": "iana" },
		"audio/aptx": { "source": "iana" },
		"audio/asc": { "source": "iana" },
		"audio/atrac-advanced-lossless": { "source": "iana" },
		"audio/atrac-x": { "source": "iana" },
		"audio/atrac3": { "source": "iana" },
		"audio/basic": {
			"source": "iana",
			"compressible": false,
			"extensions": ["au", "snd"]
		},
		"audio/bv16": { "source": "iana" },
		"audio/bv32": { "source": "iana" },
		"audio/clearmode": { "source": "iana" },
		"audio/cn": { "source": "iana" },
		"audio/dat12": { "source": "iana" },
		"audio/dls": { "source": "iana" },
		"audio/dsr-es201108": { "source": "iana" },
		"audio/dsr-es202050": { "source": "iana" },
		"audio/dsr-es202211": { "source": "iana" },
		"audio/dsr-es202212": { "source": "iana" },
		"audio/dv": { "source": "iana" },
		"audio/dvi4": { "source": "iana" },
		"audio/eac3": { "source": "iana" },
		"audio/encaprtp": { "source": "iana" },
		"audio/evrc": { "source": "iana" },
		"audio/evrc-qcp": { "source": "iana" },
		"audio/evrc0": { "source": "iana" },
		"audio/evrc1": { "source": "iana" },
		"audio/evrcb": { "source": "iana" },
		"audio/evrcb0": { "source": "iana" },
		"audio/evrcb1": { "source": "iana" },
		"audio/evrcnw": { "source": "iana" },
		"audio/evrcnw0": { "source": "iana" },
		"audio/evrcnw1": { "source": "iana" },
		"audio/evrcwb": { "source": "iana" },
		"audio/evrcwb0": { "source": "iana" },
		"audio/evrcwb1": { "source": "iana" },
		"audio/evs": { "source": "iana" },
		"audio/flexfec": { "source": "iana" },
		"audio/fwdred": { "source": "iana" },
		"audio/g711-0": { "source": "iana" },
		"audio/g719": { "source": "iana" },
		"audio/g722": { "source": "iana" },
		"audio/g7221": { "source": "iana" },
		"audio/g723": { "source": "iana" },
		"audio/g726-16": { "source": "iana" },
		"audio/g726-24": { "source": "iana" },
		"audio/g726-32": { "source": "iana" },
		"audio/g726-40": { "source": "iana" },
		"audio/g728": { "source": "iana" },
		"audio/g729": { "source": "iana" },
		"audio/g7291": { "source": "iana" },
		"audio/g729d": { "source": "iana" },
		"audio/g729e": { "source": "iana" },
		"audio/gsm": { "source": "iana" },
		"audio/gsm-efr": { "source": "iana" },
		"audio/gsm-hr-08": { "source": "iana" },
		"audio/ilbc": { "source": "iana" },
		"audio/ip-mr_v2.5": { "source": "iana" },
		"audio/isac": { "source": "apache" },
		"audio/l16": { "source": "iana" },
		"audio/l20": { "source": "iana" },
		"audio/l24": {
			"source": "iana",
			"compressible": false
		},
		"audio/l8": { "source": "iana" },
		"audio/lpc": { "source": "iana" },
		"audio/melp": { "source": "iana" },
		"audio/melp1200": { "source": "iana" },
		"audio/melp2400": { "source": "iana" },
		"audio/melp600": { "source": "iana" },
		"audio/mhas": { "source": "iana" },
		"audio/midi": {
			"source": "apache",
			"extensions": [
				"mid",
				"midi",
				"kar",
				"rmi"
			]
		},
		"audio/mobile-xmf": {
			"source": "iana",
			"extensions": ["mxmf"]
		},
		"audio/mp3": {
			"compressible": false,
			"extensions": ["mp3"]
		},
		"audio/mp4": {
			"source": "iana",
			"compressible": false,
			"extensions": ["m4a", "mp4a"]
		},
		"audio/mp4a-latm": { "source": "iana" },
		"audio/mpa": { "source": "iana" },
		"audio/mpa-robust": { "source": "iana" },
		"audio/mpeg": {
			"source": "iana",
			"compressible": false,
			"extensions": [
				"mpga",
				"mp2",
				"mp2a",
				"mp3",
				"m2a",
				"m3a"
			]
		},
		"audio/mpeg4-generic": { "source": "iana" },
		"audio/musepack": { "source": "apache" },
		"audio/ogg": {
			"source": "iana",
			"compressible": false,
			"extensions": [
				"oga",
				"ogg",
				"spx",
				"opus"
			]
		},
		"audio/opus": { "source": "iana" },
		"audio/parityfec": { "source": "iana" },
		"audio/pcma": { "source": "iana" },
		"audio/pcma-wb": { "source": "iana" },
		"audio/pcmu": { "source": "iana" },
		"audio/pcmu-wb": { "source": "iana" },
		"audio/prs.sid": { "source": "iana" },
		"audio/qcelp": { "source": "iana" },
		"audio/raptorfec": { "source": "iana" },
		"audio/red": { "source": "iana" },
		"audio/rtp-enc-aescm128": { "source": "iana" },
		"audio/rtp-midi": { "source": "iana" },
		"audio/rtploopback": { "source": "iana" },
		"audio/rtx": { "source": "iana" },
		"audio/s3m": {
			"source": "apache",
			"extensions": ["s3m"]
		},
		"audio/scip": { "source": "iana" },
		"audio/silk": {
			"source": "apache",
			"extensions": ["sil"]
		},
		"audio/smv": { "source": "iana" },
		"audio/smv-qcp": { "source": "iana" },
		"audio/smv0": { "source": "iana" },
		"audio/sofa": { "source": "iana" },
		"audio/sp-midi": { "source": "iana" },
		"audio/speex": { "source": "iana" },
		"audio/t140c": { "source": "iana" },
		"audio/t38": { "source": "iana" },
		"audio/telephone-event": { "source": "iana" },
		"audio/tetra_acelp": { "source": "iana" },
		"audio/tetra_acelp_bb": { "source": "iana" },
		"audio/tone": { "source": "iana" },
		"audio/tsvcis": { "source": "iana" },
		"audio/uemclip": { "source": "iana" },
		"audio/ulpfec": { "source": "iana" },
		"audio/usac": { "source": "iana" },
		"audio/vdvi": { "source": "iana" },
		"audio/vmr-wb": { "source": "iana" },
		"audio/vnd.3gpp.iufp": { "source": "iana" },
		"audio/vnd.4sb": { "source": "iana" },
		"audio/vnd.audiokoz": { "source": "iana" },
		"audio/vnd.celp": { "source": "iana" },
		"audio/vnd.cisco.nse": { "source": "iana" },
		"audio/vnd.cmles.radio-events": { "source": "iana" },
		"audio/vnd.cns.anp1": { "source": "iana" },
		"audio/vnd.cns.inf1": { "source": "iana" },
		"audio/vnd.dece.audio": {
			"source": "iana",
			"extensions": ["uva", "uvva"]
		},
		"audio/vnd.digital-winds": {
			"source": "iana",
			"extensions": ["eol"]
		},
		"audio/vnd.dlna.adts": { "source": "iana" },
		"audio/vnd.dolby.heaac.1": { "source": "iana" },
		"audio/vnd.dolby.heaac.2": { "source": "iana" },
		"audio/vnd.dolby.mlp": { "source": "iana" },
		"audio/vnd.dolby.mps": { "source": "iana" },
		"audio/vnd.dolby.pl2": { "source": "iana" },
		"audio/vnd.dolby.pl2x": { "source": "iana" },
		"audio/vnd.dolby.pl2z": { "source": "iana" },
		"audio/vnd.dolby.pulse.1": { "source": "iana" },
		"audio/vnd.dra": {
			"source": "iana",
			"extensions": ["dra"]
		},
		"audio/vnd.dts": {
			"source": "iana",
			"extensions": ["dts"]
		},
		"audio/vnd.dts.hd": {
			"source": "iana",
			"extensions": ["dtshd"]
		},
		"audio/vnd.dts.uhd": { "source": "iana" },
		"audio/vnd.dvb.file": { "source": "iana" },
		"audio/vnd.everad.plj": { "source": "iana" },
		"audio/vnd.hns.audio": { "source": "iana" },
		"audio/vnd.lucent.voice": {
			"source": "iana",
			"extensions": ["lvp"]
		},
		"audio/vnd.ms-playready.media.pya": {
			"source": "iana",
			"extensions": ["pya"]
		},
		"audio/vnd.nokia.mobile-xmf": { "source": "iana" },
		"audio/vnd.nortel.vbk": { "source": "iana" },
		"audio/vnd.nuera.ecelp4800": {
			"source": "iana",
			"extensions": ["ecelp4800"]
		},
		"audio/vnd.nuera.ecelp7470": {
			"source": "iana",
			"extensions": ["ecelp7470"]
		},
		"audio/vnd.nuera.ecelp9600": {
			"source": "iana",
			"extensions": ["ecelp9600"]
		},
		"audio/vnd.octel.sbc": { "source": "iana" },
		"audio/vnd.presonus.multitrack": { "source": "iana" },
		"audio/vnd.qcelp": { "source": "iana" },
		"audio/vnd.rhetorex.32kadpcm": { "source": "iana" },
		"audio/vnd.rip": {
			"source": "iana",
			"extensions": ["rip"]
		},
		"audio/vnd.rn-realaudio": { "compressible": false },
		"audio/vnd.sealedmedia.softseal.mpeg": { "source": "iana" },
		"audio/vnd.vmx.cvsd": { "source": "iana" },
		"audio/vnd.wave": { "compressible": false },
		"audio/vorbis": {
			"source": "iana",
			"compressible": false
		},
		"audio/vorbis-config": { "source": "iana" },
		"audio/wav": {
			"compressible": false,
			"extensions": ["wav"]
		},
		"audio/wave": {
			"compressible": false,
			"extensions": ["wav"]
		},
		"audio/webm": {
			"source": "apache",
			"compressible": false,
			"extensions": ["weba"]
		},
		"audio/x-aac": {
			"source": "apache",
			"compressible": false,
			"extensions": ["aac"]
		},
		"audio/x-aiff": {
			"source": "apache",
			"extensions": [
				"aif",
				"aiff",
				"aifc"
			]
		},
		"audio/x-caf": {
			"source": "apache",
			"compressible": false,
			"extensions": ["caf"]
		},
		"audio/x-flac": {
			"source": "apache",
			"extensions": ["flac"]
		},
		"audio/x-m4a": {
			"source": "nginx",
			"extensions": ["m4a"]
		},
		"audio/x-matroska": {
			"source": "apache",
			"extensions": ["mka"]
		},
		"audio/x-mpegurl": {
			"source": "apache",
			"extensions": ["m3u"]
		},
		"audio/x-ms-wax": {
			"source": "apache",
			"extensions": ["wax"]
		},
		"audio/x-ms-wma": {
			"source": "apache",
			"extensions": ["wma"]
		},
		"audio/x-pn-realaudio": {
			"source": "apache",
			"extensions": ["ram", "ra"]
		},
		"audio/x-pn-realaudio-plugin": {
			"source": "apache",
			"extensions": ["rmp"]
		},
		"audio/x-realaudio": {
			"source": "nginx",
			"extensions": ["ra"]
		},
		"audio/x-tta": { "source": "apache" },
		"audio/x-wav": {
			"source": "apache",
			"extensions": ["wav"]
		},
		"audio/xm": {
			"source": "apache",
			"extensions": ["xm"]
		},
		"chemical/x-cdx": {
			"source": "apache",
			"extensions": ["cdx"]
		},
		"chemical/x-cif": {
			"source": "apache",
			"extensions": ["cif"]
		},
		"chemical/x-cmdf": {
			"source": "apache",
			"extensions": ["cmdf"]
		},
		"chemical/x-cml": {
			"source": "apache",
			"extensions": ["cml"]
		},
		"chemical/x-csml": {
			"source": "apache",
			"extensions": ["csml"]
		},
		"chemical/x-pdb": { "source": "apache" },
		"chemical/x-xyz": {
			"source": "apache",
			"extensions": ["xyz"]
		},
		"font/collection": {
			"source": "iana",
			"extensions": ["ttc"]
		},
		"font/otf": {
			"source": "iana",
			"compressible": true,
			"extensions": ["otf"]
		},
		"font/sfnt": { "source": "iana" },
		"font/ttf": {
			"source": "iana",
			"compressible": true,
			"extensions": ["ttf"]
		},
		"font/woff": {
			"source": "iana",
			"extensions": ["woff"]
		},
		"font/woff2": {
			"source": "iana",
			"extensions": ["woff2"]
		},
		"image/aces": {
			"source": "iana",
			"extensions": ["exr"]
		},
		"image/apng": {
			"compressible": false,
			"extensions": ["apng"]
		},
		"image/avci": {
			"source": "iana",
			"extensions": ["avci"]
		},
		"image/avcs": {
			"source": "iana",
			"extensions": ["avcs"]
		},
		"image/avif": {
			"source": "iana",
			"compressible": false,
			"extensions": ["avif"]
		},
		"image/bmp": {
			"source": "iana",
			"compressible": true,
			"extensions": ["bmp"]
		},
		"image/cgm": {
			"source": "iana",
			"extensions": ["cgm"]
		},
		"image/dicom-rle": {
			"source": "iana",
			"extensions": ["drle"]
		},
		"image/emf": {
			"source": "iana",
			"extensions": ["emf"]
		},
		"image/fits": {
			"source": "iana",
			"extensions": ["fits"]
		},
		"image/g3fax": {
			"source": "iana",
			"extensions": ["g3"]
		},
		"image/gif": {
			"source": "iana",
			"compressible": false,
			"extensions": ["gif"]
		},
		"image/heic": {
			"source": "iana",
			"extensions": ["heic"]
		},
		"image/heic-sequence": {
			"source": "iana",
			"extensions": ["heics"]
		},
		"image/heif": {
			"source": "iana",
			"extensions": ["heif"]
		},
		"image/heif-sequence": {
			"source": "iana",
			"extensions": ["heifs"]
		},
		"image/hej2k": {
			"source": "iana",
			"extensions": ["hej2"]
		},
		"image/hsj2": {
			"source": "iana",
			"extensions": ["hsj2"]
		},
		"image/ief": {
			"source": "iana",
			"extensions": ["ief"]
		},
		"image/jls": {
			"source": "iana",
			"extensions": ["jls"]
		},
		"image/jp2": {
			"source": "iana",
			"compressible": false,
			"extensions": ["jp2", "jpg2"]
		},
		"image/jpeg": {
			"source": "iana",
			"compressible": false,
			"extensions": [
				"jpeg",
				"jpg",
				"jpe"
			]
		},
		"image/jph": {
			"source": "iana",
			"extensions": ["jph"]
		},
		"image/jphc": {
			"source": "iana",
			"extensions": ["jhc"]
		},
		"image/jpm": {
			"source": "iana",
			"compressible": false,
			"extensions": ["jpm"]
		},
		"image/jpx": {
			"source": "iana",
			"compressible": false,
			"extensions": ["jpx", "jpf"]
		},
		"image/jxr": {
			"source": "iana",
			"extensions": ["jxr"]
		},
		"image/jxra": {
			"source": "iana",
			"extensions": ["jxra"]
		},
		"image/jxrs": {
			"source": "iana",
			"extensions": ["jxrs"]
		},
		"image/jxs": {
			"source": "iana",
			"extensions": ["jxs"]
		},
		"image/jxsc": {
			"source": "iana",
			"extensions": ["jxsc"]
		},
		"image/jxsi": {
			"source": "iana",
			"extensions": ["jxsi"]
		},
		"image/jxss": {
			"source": "iana",
			"extensions": ["jxss"]
		},
		"image/ktx": {
			"source": "iana",
			"extensions": ["ktx"]
		},
		"image/ktx2": {
			"source": "iana",
			"extensions": ["ktx2"]
		},
		"image/naplps": { "source": "iana" },
		"image/pjpeg": { "compressible": false },
		"image/png": {
			"source": "iana",
			"compressible": false,
			"extensions": ["png"]
		},
		"image/prs.btif": {
			"source": "iana",
			"extensions": ["btif"]
		},
		"image/prs.pti": {
			"source": "iana",
			"extensions": ["pti"]
		},
		"image/pwg-raster": { "source": "iana" },
		"image/sgi": {
			"source": "apache",
			"extensions": ["sgi"]
		},
		"image/svg+xml": {
			"source": "iana",
			"compressible": true,
			"extensions": ["svg", "svgz"]
		},
		"image/t38": {
			"source": "iana",
			"extensions": ["t38"]
		},
		"image/tiff": {
			"source": "iana",
			"compressible": false,
			"extensions": ["tif", "tiff"]
		},
		"image/tiff-fx": {
			"source": "iana",
			"extensions": ["tfx"]
		},
		"image/vnd.adobe.photoshop": {
			"source": "iana",
			"compressible": true,
			"extensions": ["psd"]
		},
		"image/vnd.airzip.accelerator.azv": {
			"source": "iana",
			"extensions": ["azv"]
		},
		"image/vnd.cns.inf2": { "source": "iana" },
		"image/vnd.dece.graphic": {
			"source": "iana",
			"extensions": [
				"uvi",
				"uvvi",
				"uvg",
				"uvvg"
			]
		},
		"image/vnd.djvu": {
			"source": "iana",
			"extensions": ["djvu", "djv"]
		},
		"image/vnd.dvb.subtitle": {
			"source": "iana",
			"extensions": ["sub"]
		},
		"image/vnd.dwg": {
			"source": "iana",
			"extensions": ["dwg"]
		},
		"image/vnd.dxf": {
			"source": "iana",
			"extensions": ["dxf"]
		},
		"image/vnd.fastbidsheet": {
			"source": "iana",
			"extensions": ["fbs"]
		},
		"image/vnd.fpx": {
			"source": "iana",
			"extensions": ["fpx"]
		},
		"image/vnd.fst": {
			"source": "iana",
			"extensions": ["fst"]
		},
		"image/vnd.fujixerox.edmics-mmr": {
			"source": "iana",
			"extensions": ["mmr"]
		},
		"image/vnd.fujixerox.edmics-rlc": {
			"source": "iana",
			"extensions": ["rlc"]
		},
		"image/vnd.globalgraphics.pgb": { "source": "iana" },
		"image/vnd.microsoft.icon": {
			"source": "iana",
			"compressible": true,
			"extensions": ["ico"]
		},
		"image/vnd.mix": { "source": "iana" },
		"image/vnd.mozilla.apng": { "source": "iana" },
		"image/vnd.ms-dds": {
			"compressible": true,
			"extensions": ["dds"]
		},
		"image/vnd.ms-modi": {
			"source": "iana",
			"extensions": ["mdi"]
		},
		"image/vnd.ms-photo": {
			"source": "apache",
			"extensions": ["wdp"]
		},
		"image/vnd.net-fpx": {
			"source": "iana",
			"extensions": ["npx"]
		},
		"image/vnd.pco.b16": {
			"source": "iana",
			"extensions": ["b16"]
		},
		"image/vnd.radiance": { "source": "iana" },
		"image/vnd.sealed.png": { "source": "iana" },
		"image/vnd.sealedmedia.softseal.gif": { "source": "iana" },
		"image/vnd.sealedmedia.softseal.jpg": { "source": "iana" },
		"image/vnd.svf": { "source": "iana" },
		"image/vnd.tencent.tap": {
			"source": "iana",
			"extensions": ["tap"]
		},
		"image/vnd.valve.source.texture": {
			"source": "iana",
			"extensions": ["vtf"]
		},
		"image/vnd.wap.wbmp": {
			"source": "iana",
			"extensions": ["wbmp"]
		},
		"image/vnd.xiff": {
			"source": "iana",
			"extensions": ["xif"]
		},
		"image/vnd.zbrush.pcx": {
			"source": "iana",
			"extensions": ["pcx"]
		},
		"image/webp": {
			"source": "apache",
			"extensions": ["webp"]
		},
		"image/wmf": {
			"source": "iana",
			"extensions": ["wmf"]
		},
		"image/x-3ds": {
			"source": "apache",
			"extensions": ["3ds"]
		},
		"image/x-cmu-raster": {
			"source": "apache",
			"extensions": ["ras"]
		},
		"image/x-cmx": {
			"source": "apache",
			"extensions": ["cmx"]
		},
		"image/x-freehand": {
			"source": "apache",
			"extensions": [
				"fh",
				"fhc",
				"fh4",
				"fh5",
				"fh7"
			]
		},
		"image/x-icon": {
			"source": "apache",
			"compressible": true,
			"extensions": ["ico"]
		},
		"image/x-jng": {
			"source": "nginx",
			"extensions": ["jng"]
		},
		"image/x-mrsid-image": {
			"source": "apache",
			"extensions": ["sid"]
		},
		"image/x-ms-bmp": {
			"source": "nginx",
			"compressible": true,
			"extensions": ["bmp"]
		},
		"image/x-pcx": {
			"source": "apache",
			"extensions": ["pcx"]
		},
		"image/x-pict": {
			"source": "apache",
			"extensions": ["pic", "pct"]
		},
		"image/x-portable-anymap": {
			"source": "apache",
			"extensions": ["pnm"]
		},
		"image/x-portable-bitmap": {
			"source": "apache",
			"extensions": ["pbm"]
		},
		"image/x-portable-graymap": {
			"source": "apache",
			"extensions": ["pgm"]
		},
		"image/x-portable-pixmap": {
			"source": "apache",
			"extensions": ["ppm"]
		},
		"image/x-rgb": {
			"source": "apache",
			"extensions": ["rgb"]
		},
		"image/x-tga": {
			"source": "apache",
			"extensions": ["tga"]
		},
		"image/x-xbitmap": {
			"source": "apache",
			"extensions": ["xbm"]
		},
		"image/x-xcf": { "compressible": false },
		"image/x-xpixmap": {
			"source": "apache",
			"extensions": ["xpm"]
		},
		"image/x-xwindowdump": {
			"source": "apache",
			"extensions": ["xwd"]
		},
		"message/cpim": { "source": "iana" },
		"message/delivery-status": { "source": "iana" },
		"message/disposition-notification": {
			"source": "iana",
			"extensions": ["disposition-notification"]
		},
		"message/external-body": { "source": "iana" },
		"message/feedback-report": { "source": "iana" },
		"message/global": {
			"source": "iana",
			"extensions": ["u8msg"]
		},
		"message/global-delivery-status": {
			"source": "iana",
			"extensions": ["u8dsn"]
		},
		"message/global-disposition-notification": {
			"source": "iana",
			"extensions": ["u8mdn"]
		},
		"message/global-headers": {
			"source": "iana",
			"extensions": ["u8hdr"]
		},
		"message/http": {
			"source": "iana",
			"compressible": false
		},
		"message/imdn+xml": {
			"source": "iana",
			"compressible": true
		},
		"message/news": { "source": "iana" },
		"message/partial": {
			"source": "iana",
			"compressible": false
		},
		"message/rfc822": {
			"source": "iana",
			"compressible": true,
			"extensions": ["eml", "mime"]
		},
		"message/s-http": { "source": "iana" },
		"message/sip": { "source": "iana" },
		"message/sipfrag": { "source": "iana" },
		"message/tracking-status": { "source": "iana" },
		"message/vnd.si.simp": { "source": "iana" },
		"message/vnd.wfa.wsc": {
			"source": "iana",
			"extensions": ["wsc"]
		},
		"model/3mf": {
			"source": "iana",
			"extensions": ["3mf"]
		},
		"model/e57": { "source": "iana" },
		"model/gltf+json": {
			"source": "iana",
			"compressible": true,
			"extensions": ["gltf"]
		},
		"model/gltf-binary": {
			"source": "iana",
			"compressible": true,
			"extensions": ["glb"]
		},
		"model/iges": {
			"source": "iana",
			"compressible": false,
			"extensions": ["igs", "iges"]
		},
		"model/mesh": {
			"source": "iana",
			"compressible": false,
			"extensions": [
				"msh",
				"mesh",
				"silo"
			]
		},
		"model/mtl": {
			"source": "iana",
			"extensions": ["mtl"]
		},
		"model/obj": {
			"source": "iana",
			"extensions": ["obj"]
		},
		"model/step": { "source": "iana" },
		"model/step+xml": {
			"source": "iana",
			"compressible": true,
			"extensions": ["stpx"]
		},
		"model/step+zip": {
			"source": "iana",
			"compressible": false,
			"extensions": ["stpz"]
		},
		"model/step-xml+zip": {
			"source": "iana",
			"compressible": false,
			"extensions": ["stpxz"]
		},
		"model/stl": {
			"source": "iana",
			"extensions": ["stl"]
		},
		"model/vnd.collada+xml": {
			"source": "iana",
			"compressible": true,
			"extensions": ["dae"]
		},
		"model/vnd.dwf": {
			"source": "iana",
			"extensions": ["dwf"]
		},
		"model/vnd.flatland.3dml": { "source": "iana" },
		"model/vnd.gdl": {
			"source": "iana",
			"extensions": ["gdl"]
		},
		"model/vnd.gs-gdl": { "source": "apache" },
		"model/vnd.gs.gdl": { "source": "iana" },
		"model/vnd.gtw": {
			"source": "iana",
			"extensions": ["gtw"]
		},
		"model/vnd.moml+xml": {
			"source": "iana",
			"compressible": true
		},
		"model/vnd.mts": {
			"source": "iana",
			"extensions": ["mts"]
		},
		"model/vnd.opengex": {
			"source": "iana",
			"extensions": ["ogex"]
		},
		"model/vnd.parasolid.transmit.binary": {
			"source": "iana",
			"extensions": ["x_b"]
		},
		"model/vnd.parasolid.transmit.text": {
			"source": "iana",
			"extensions": ["x_t"]
		},
		"model/vnd.pytha.pyox": { "source": "iana" },
		"model/vnd.rosette.annotated-data-model": { "source": "iana" },
		"model/vnd.sap.vds": {
			"source": "iana",
			"extensions": ["vds"]
		},
		"model/vnd.usdz+zip": {
			"source": "iana",
			"compressible": false,
			"extensions": ["usdz"]
		},
		"model/vnd.valve.source.compiled-map": {
			"source": "iana",
			"extensions": ["bsp"]
		},
		"model/vnd.vtu": {
			"source": "iana",
			"extensions": ["vtu"]
		},
		"model/vrml": {
			"source": "iana",
			"compressible": false,
			"extensions": ["wrl", "vrml"]
		},
		"model/x3d+binary": {
			"source": "apache",
			"compressible": false,
			"extensions": ["x3db", "x3dbz"]
		},
		"model/x3d+fastinfoset": {
			"source": "iana",
			"extensions": ["x3db"]
		},
		"model/x3d+vrml": {
			"source": "apache",
			"compressible": false,
			"extensions": ["x3dv", "x3dvz"]
		},
		"model/x3d+xml": {
			"source": "iana",
			"compressible": true,
			"extensions": ["x3d", "x3dz"]
		},
		"model/x3d-vrml": {
			"source": "iana",
			"extensions": ["x3dv"]
		},
		"multipart/alternative": {
			"source": "iana",
			"compressible": false
		},
		"multipart/appledouble": { "source": "iana" },
		"multipart/byteranges": { "source": "iana" },
		"multipart/digest": { "source": "iana" },
		"multipart/encrypted": {
			"source": "iana",
			"compressible": false
		},
		"multipart/form-data": {
			"source": "iana",
			"compressible": false
		},
		"multipart/header-set": { "source": "iana" },
		"multipart/mixed": { "source": "iana" },
		"multipart/multilingual": { "source": "iana" },
		"multipart/parallel": { "source": "iana" },
		"multipart/related": {
			"source": "iana",
			"compressible": false
		},
		"multipart/report": { "source": "iana" },
		"multipart/signed": {
			"source": "iana",
			"compressible": false
		},
		"multipart/vnd.bint.med-plus": { "source": "iana" },
		"multipart/voice-message": { "source": "iana" },
		"multipart/x-mixed-replace": { "source": "iana" },
		"text/1d-interleaved-parityfec": { "source": "iana" },
		"text/cache-manifest": {
			"source": "iana",
			"compressible": true,
			"extensions": ["appcache", "manifest"]
		},
		"text/calendar": {
			"source": "iana",
			"extensions": ["ics", "ifb"]
		},
		"text/calender": { "compressible": true },
		"text/cmd": { "compressible": true },
		"text/coffeescript": { "extensions": ["coffee", "litcoffee"] },
		"text/cql": { "source": "iana" },
		"text/cql-expression": { "source": "iana" },
		"text/cql-identifier": { "source": "iana" },
		"text/css": {
			"source": "iana",
			"charset": "UTF-8",
			"compressible": true,
			"extensions": ["css"]
		},
		"text/csv": {
			"source": "iana",
			"compressible": true,
			"extensions": ["csv"]
		},
		"text/csv-schema": { "source": "iana" },
		"text/directory": { "source": "iana" },
		"text/dns": { "source": "iana" },
		"text/ecmascript": { "source": "iana" },
		"text/encaprtp": { "source": "iana" },
		"text/enriched": { "source": "iana" },
		"text/fhirpath": { "source": "iana" },
		"text/flexfec": { "source": "iana" },
		"text/fwdred": { "source": "iana" },
		"text/gff3": { "source": "iana" },
		"text/grammar-ref-list": { "source": "iana" },
		"text/html": {
			"source": "iana",
			"compressible": true,
			"extensions": [
				"html",
				"htm",
				"shtml"
			]
		},
		"text/jade": { "extensions": ["jade"] },
		"text/javascript": {
			"source": "iana",
			"compressible": true
		},
		"text/jcr-cnd": { "source": "iana" },
		"text/jsx": {
			"compressible": true,
			"extensions": ["jsx"]
		},
		"text/less": {
			"compressible": true,
			"extensions": ["less"]
		},
		"text/markdown": {
			"source": "iana",
			"compressible": true,
			"extensions": ["markdown", "md"]
		},
		"text/mathml": {
			"source": "nginx",
			"extensions": ["mml"]
		},
		"text/mdx": {
			"compressible": true,
			"extensions": ["mdx"]
		},
		"text/mizar": { "source": "iana" },
		"text/n3": {
			"source": "iana",
			"charset": "UTF-8",
			"compressible": true,
			"extensions": ["n3"]
		},
		"text/parameters": {
			"source": "iana",
			"charset": "UTF-8"
		},
		"text/parityfec": { "source": "iana" },
		"text/plain": {
			"source": "iana",
			"compressible": true,
			"extensions": [
				"txt",
				"text",
				"conf",
				"def",
				"list",
				"log",
				"in",
				"ini"
			]
		},
		"text/provenance-notation": {
			"source": "iana",
			"charset": "UTF-8"
		},
		"text/prs.fallenstein.rst": { "source": "iana" },
		"text/prs.lines.tag": {
			"source": "iana",
			"extensions": ["dsc"]
		},
		"text/prs.prop.logic": { "source": "iana" },
		"text/raptorfec": { "source": "iana" },
		"text/red": { "source": "iana" },
		"text/rfc822-headers": { "source": "iana" },
		"text/richtext": {
			"source": "iana",
			"compressible": true,
			"extensions": ["rtx"]
		},
		"text/rtf": {
			"source": "iana",
			"compressible": true,
			"extensions": ["rtf"]
		},
		"text/rtp-enc-aescm128": { "source": "iana" },
		"text/rtploopback": { "source": "iana" },
		"text/rtx": { "source": "iana" },
		"text/sgml": {
			"source": "iana",
			"extensions": ["sgml", "sgm"]
		},
		"text/shaclc": { "source": "iana" },
		"text/shex": {
			"source": "iana",
			"extensions": ["shex"]
		},
		"text/slim": { "extensions": ["slim", "slm"] },
		"text/spdx": {
			"source": "iana",
			"extensions": ["spdx"]
		},
		"text/strings": { "source": "iana" },
		"text/stylus": { "extensions": ["stylus", "styl"] },
		"text/t140": { "source": "iana" },
		"text/tab-separated-values": {
			"source": "iana",
			"compressible": true,
			"extensions": ["tsv"]
		},
		"text/troff": {
			"source": "iana",
			"extensions": [
				"t",
				"tr",
				"roff",
				"man",
				"me",
				"ms"
			]
		},
		"text/turtle": {
			"source": "iana",
			"charset": "UTF-8",
			"extensions": ["ttl"]
		},
		"text/ulpfec": { "source": "iana" },
		"text/uri-list": {
			"source": "iana",
			"compressible": true,
			"extensions": [
				"uri",
				"uris",
				"urls"
			]
		},
		"text/vcard": {
			"source": "iana",
			"compressible": true,
			"extensions": ["vcard"]
		},
		"text/vnd.a": { "source": "iana" },
		"text/vnd.abc": { "source": "iana" },
		"text/vnd.ascii-art": { "source": "iana" },
		"text/vnd.curl": {
			"source": "iana",
			"extensions": ["curl"]
		},
		"text/vnd.curl.dcurl": {
			"source": "apache",
			"extensions": ["dcurl"]
		},
		"text/vnd.curl.mcurl": {
			"source": "apache",
			"extensions": ["mcurl"]
		},
		"text/vnd.curl.scurl": {
			"source": "apache",
			"extensions": ["scurl"]
		},
		"text/vnd.debian.copyright": {
			"source": "iana",
			"charset": "UTF-8"
		},
		"text/vnd.dmclientscript": { "source": "iana" },
		"text/vnd.dvb.subtitle": {
			"source": "iana",
			"extensions": ["sub"]
		},
		"text/vnd.esmertec.theme-descriptor": {
			"source": "iana",
			"charset": "UTF-8"
		},
		"text/vnd.familysearch.gedcom": {
			"source": "iana",
			"extensions": ["ged"]
		},
		"text/vnd.ficlab.flt": { "source": "iana" },
		"text/vnd.fly": {
			"source": "iana",
			"extensions": ["fly"]
		},
		"text/vnd.fmi.flexstor": {
			"source": "iana",
			"extensions": ["flx"]
		},
		"text/vnd.gml": { "source": "iana" },
		"text/vnd.graphviz": {
			"source": "iana",
			"extensions": ["gv"]
		},
		"text/vnd.hans": { "source": "iana" },
		"text/vnd.hgl": { "source": "iana" },
		"text/vnd.in3d.3dml": {
			"source": "iana",
			"extensions": ["3dml"]
		},
		"text/vnd.in3d.spot": {
			"source": "iana",
			"extensions": ["spot"]
		},
		"text/vnd.iptc.newsml": { "source": "iana" },
		"text/vnd.iptc.nitf": { "source": "iana" },
		"text/vnd.latex-z": { "source": "iana" },
		"text/vnd.motorola.reflex": { "source": "iana" },
		"text/vnd.ms-mediapackage": { "source": "iana" },
		"text/vnd.net2phone.commcenter.command": { "source": "iana" },
		"text/vnd.radisys.msml-basic-layout": { "source": "iana" },
		"text/vnd.senx.warpscript": { "source": "iana" },
		"text/vnd.si.uricatalogue": { "source": "iana" },
		"text/vnd.sosi": { "source": "iana" },
		"text/vnd.sun.j2me.app-descriptor": {
			"source": "iana",
			"charset": "UTF-8",
			"extensions": ["jad"]
		},
		"text/vnd.trolltech.linguist": {
			"source": "iana",
			"charset": "UTF-8"
		},
		"text/vnd.wap.si": { "source": "iana" },
		"text/vnd.wap.sl": { "source": "iana" },
		"text/vnd.wap.wml": {
			"source": "iana",
			"extensions": ["wml"]
		},
		"text/vnd.wap.wmlscript": {
			"source": "iana",
			"extensions": ["wmls"]
		},
		"text/vtt": {
			"source": "iana",
			"charset": "UTF-8",
			"compressible": true,
			"extensions": ["vtt"]
		},
		"text/x-asm": {
			"source": "apache",
			"extensions": ["s", "asm"]
		},
		"text/x-c": {
			"source": "apache",
			"extensions": [
				"c",
				"cc",
				"cxx",
				"cpp",
				"h",
				"hh",
				"dic"
			]
		},
		"text/x-component": {
			"source": "nginx",
			"extensions": ["htc"]
		},
		"text/x-fortran": {
			"source": "apache",
			"extensions": [
				"f",
				"for",
				"f77",
				"f90"
			]
		},
		"text/x-gwt-rpc": { "compressible": true },
		"text/x-handlebars-template": { "extensions": ["hbs"] },
		"text/x-java-source": {
			"source": "apache",
			"extensions": ["java"]
		},
		"text/x-jquery-tmpl": { "compressible": true },
		"text/x-lua": { "extensions": ["lua"] },
		"text/x-markdown": {
			"compressible": true,
			"extensions": ["mkd"]
		},
		"text/x-nfo": {
			"source": "apache",
			"extensions": ["nfo"]
		},
		"text/x-opml": {
			"source": "apache",
			"extensions": ["opml"]
		},
		"text/x-org": {
			"compressible": true,
			"extensions": ["org"]
		},
		"text/x-pascal": {
			"source": "apache",
			"extensions": ["p", "pas"]
		},
		"text/x-processing": {
			"compressible": true,
			"extensions": ["pde"]
		},
		"text/x-sass": { "extensions": ["sass"] },
		"text/x-scss": { "extensions": ["scss"] },
		"text/x-setext": {
			"source": "apache",
			"extensions": ["etx"]
		},
		"text/x-sfv": {
			"source": "apache",
			"extensions": ["sfv"]
		},
		"text/x-suse-ymp": {
			"compressible": true,
			"extensions": ["ymp"]
		},
		"text/x-uuencode": {
			"source": "apache",
			"extensions": ["uu"]
		},
		"text/x-vcalendar": {
			"source": "apache",
			"extensions": ["vcs"]
		},
		"text/x-vcard": {
			"source": "apache",
			"extensions": ["vcf"]
		},
		"text/xml": {
			"source": "iana",
			"compressible": true,
			"extensions": ["xml"]
		},
		"text/xml-external-parsed-entity": { "source": "iana" },
		"text/yaml": {
			"compressible": true,
			"extensions": ["yaml", "yml"]
		},
		"video/1d-interleaved-parityfec": { "source": "iana" },
		"video/3gpp": {
			"source": "iana",
			"extensions": ["3gp", "3gpp"]
		},
		"video/3gpp-tt": { "source": "iana" },
		"video/3gpp2": {
			"source": "iana",
			"extensions": ["3g2"]
		},
		"video/av1": { "source": "iana" },
		"video/bmpeg": { "source": "iana" },
		"video/bt656": { "source": "iana" },
		"video/celb": { "source": "iana" },
		"video/dv": { "source": "iana" },
		"video/encaprtp": { "source": "iana" },
		"video/ffv1": { "source": "iana" },
		"video/flexfec": { "source": "iana" },
		"video/h261": {
			"source": "iana",
			"extensions": ["h261"]
		},
		"video/h263": {
			"source": "iana",
			"extensions": ["h263"]
		},
		"video/h263-1998": { "source": "iana" },
		"video/h263-2000": { "source": "iana" },
		"video/h264": {
			"source": "iana",
			"extensions": ["h264"]
		},
		"video/h264-rcdo": { "source": "iana" },
		"video/h264-svc": { "source": "iana" },
		"video/h265": { "source": "iana" },
		"video/iso.segment": {
			"source": "iana",
			"extensions": ["m4s"]
		},
		"video/jpeg": {
			"source": "iana",
			"extensions": ["jpgv"]
		},
		"video/jpeg2000": { "source": "iana" },
		"video/jpm": {
			"source": "apache",
			"extensions": ["jpm", "jpgm"]
		},
		"video/jxsv": { "source": "iana" },
		"video/mj2": {
			"source": "iana",
			"extensions": ["mj2", "mjp2"]
		},
		"video/mp1s": { "source": "iana" },
		"video/mp2p": { "source": "iana" },
		"video/mp2t": {
			"source": "iana",
			"extensions": ["ts"]
		},
		"video/mp4": {
			"source": "iana",
			"compressible": false,
			"extensions": [
				"mp4",
				"mp4v",
				"mpg4"
			]
		},
		"video/mp4v-es": { "source": "iana" },
		"video/mpeg": {
			"source": "iana",
			"compressible": false,
			"extensions": [
				"mpeg",
				"mpg",
				"mpe",
				"m1v",
				"m2v"
			]
		},
		"video/mpeg4-generic": { "source": "iana" },
		"video/mpv": { "source": "iana" },
		"video/nv": { "source": "iana" },
		"video/ogg": {
			"source": "iana",
			"compressible": false,
			"extensions": ["ogv"]
		},
		"video/parityfec": { "source": "iana" },
		"video/pointer": { "source": "iana" },
		"video/quicktime": {
			"source": "iana",
			"compressible": false,
			"extensions": ["qt", "mov"]
		},
		"video/raptorfec": { "source": "iana" },
		"video/raw": { "source": "iana" },
		"video/rtp-enc-aescm128": { "source": "iana" },
		"video/rtploopback": { "source": "iana" },
		"video/rtx": { "source": "iana" },
		"video/scip": { "source": "iana" },
		"video/smpte291": { "source": "iana" },
		"video/smpte292m": { "source": "iana" },
		"video/ulpfec": { "source": "iana" },
		"video/vc1": { "source": "iana" },
		"video/vc2": { "source": "iana" },
		"video/vnd.cctv": { "source": "iana" },
		"video/vnd.dece.hd": {
			"source": "iana",
			"extensions": ["uvh", "uvvh"]
		},
		"video/vnd.dece.mobile": {
			"source": "iana",
			"extensions": ["uvm", "uvvm"]
		},
		"video/vnd.dece.mp4": { "source": "iana" },
		"video/vnd.dece.pd": {
			"source": "iana",
			"extensions": ["uvp", "uvvp"]
		},
		"video/vnd.dece.sd": {
			"source": "iana",
			"extensions": ["uvs", "uvvs"]
		},
		"video/vnd.dece.video": {
			"source": "iana",
			"extensions": ["uvv", "uvvv"]
		},
		"video/vnd.directv.mpeg": { "source": "iana" },
		"video/vnd.directv.mpeg-tts": { "source": "iana" },
		"video/vnd.dlna.mpeg-tts": { "source": "iana" },
		"video/vnd.dvb.file": {
			"source": "iana",
			"extensions": ["dvb"]
		},
		"video/vnd.fvt": {
			"source": "iana",
			"extensions": ["fvt"]
		},
		"video/vnd.hns.video": { "source": "iana" },
		"video/vnd.iptvforum.1dparityfec-1010": { "source": "iana" },
		"video/vnd.iptvforum.1dparityfec-2005": { "source": "iana" },
		"video/vnd.iptvforum.2dparityfec-1010": { "source": "iana" },
		"video/vnd.iptvforum.2dparityfec-2005": { "source": "iana" },
		"video/vnd.iptvforum.ttsavc": { "source": "iana" },
		"video/vnd.iptvforum.ttsmpeg2": { "source": "iana" },
		"video/vnd.motorola.video": { "source": "iana" },
		"video/vnd.motorola.videop": { "source": "iana" },
		"video/vnd.mpegurl": {
			"source": "iana",
			"extensions": ["mxu", "m4u"]
		},
		"video/vnd.ms-playready.media.pyv": {
			"source": "iana",
			"extensions": ["pyv"]
		},
		"video/vnd.nokia.interleaved-multimedia": { "source": "iana" },
		"video/vnd.nokia.mp4vr": { "source": "iana" },
		"video/vnd.nokia.videovoip": { "source": "iana" },
		"video/vnd.objectvideo": { "source": "iana" },
		"video/vnd.radgamettools.bink": { "source": "iana" },
		"video/vnd.radgamettools.smacker": { "source": "iana" },
		"video/vnd.sealed.mpeg1": { "source": "iana" },
		"video/vnd.sealed.mpeg4": { "source": "iana" },
		"video/vnd.sealed.swf": { "source": "iana" },
		"video/vnd.sealedmedia.softseal.mov": { "source": "iana" },
		"video/vnd.uvvu.mp4": {
			"source": "iana",
			"extensions": ["uvu", "uvvu"]
		},
		"video/vnd.vivo": {
			"source": "iana",
			"extensions": ["viv"]
		},
		"video/vnd.youtube.yt": { "source": "iana" },
		"video/vp8": { "source": "iana" },
		"video/vp9": { "source": "iana" },
		"video/webm": {
			"source": "apache",
			"compressible": false,
			"extensions": ["webm"]
		},
		"video/x-f4v": {
			"source": "apache",
			"extensions": ["f4v"]
		},
		"video/x-fli": {
			"source": "apache",
			"extensions": ["fli"]
		},
		"video/x-flv": {
			"source": "apache",
			"compressible": false,
			"extensions": ["flv"]
		},
		"video/x-m4v": {
			"source": "apache",
			"extensions": ["m4v"]
		},
		"video/x-matroska": {
			"source": "apache",
			"compressible": false,
			"extensions": [
				"mkv",
				"mk3d",
				"mks"
			]
		},
		"video/x-mng": {
			"source": "apache",
			"extensions": ["mng"]
		},
		"video/x-ms-asf": {
			"source": "apache",
			"extensions": ["asf", "asx"]
		},
		"video/x-ms-vob": {
			"source": "apache",
			"extensions": ["vob"]
		},
		"video/x-ms-wm": {
			"source": "apache",
			"extensions": ["wm"]
		},
		"video/x-ms-wmv": {
			"source": "apache",
			"compressible": false,
			"extensions": ["wmv"]
		},
		"video/x-ms-wmx": {
			"source": "apache",
			"extensions": ["wmx"]
		},
		"video/x-ms-wvx": {
			"source": "apache",
			"extensions": ["wvx"]
		},
		"video/x-msvideo": {
			"source": "apache",
			"extensions": ["avi"]
		},
		"video/x-sgi-movie": {
			"source": "apache",
			"extensions": ["movie"]
		},
		"video/x-smv": {
			"source": "apache",
			"extensions": ["smv"]
		},
		"x-conference/x-cooltalk": {
			"source": "apache",
			"extensions": ["ice"]
		},
		"x-shader/x-fragment": { "compressible": true },
		"x-shader/x-vertex": { "compressible": true }
	};
}));
//#endregion
//#region node_modules/mime-db/index.js
var require_mime_db = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	/*!
	* mime-db
	* Copyright(c) 2014 Jonathan Ong
	* Copyright(c) 2015-2022 Douglas Christopher Wilson
	* MIT Licensed
	*/
	/**
	* Module exports.
	*/
	module.exports = require_db();
}));
//#endregion
//#region node_modules/mime-types/index.js
/*!
* mime-types
* Copyright(c) 2014 Jonathan Ong
* Copyright(c) 2015 Douglas Christopher Wilson
* MIT Licensed
*/
var require_mime_types = /* @__PURE__ */ __commonJSMin(((exports) => {
	/**
	* Module dependencies.
	* @private
	*/
	var db = require_mime_db();
	var extname = __require("path").extname;
	/**
	* Module variables.
	* @private
	*/
	var EXTRACT_TYPE_REGEXP = /^\s*([^;\s]*)(?:;|\s|$)/;
	var TEXT_TYPE_REGEXP = /^text\//i;
	/**
	* Module exports.
	* @public
	*/
	exports.charset = charset;
	exports.charsets = { lookup: charset };
	exports.contentType = contentType;
	exports.extension = extension;
	exports.extensions = Object.create(null);
	exports.lookup = lookup;
	exports.types = Object.create(null);
	populateMaps(exports.extensions, exports.types);
	/**
	* Get the default charset for a MIME type.
	*
	* @param {string} type
	* @return {boolean|string}
	*/
	function charset(type) {
		if (!type || typeof type !== "string") return false;
		var match = EXTRACT_TYPE_REGEXP.exec(type);
		var mime = match && db[match[1].toLowerCase()];
		if (mime && mime.charset) return mime.charset;
		if (match && TEXT_TYPE_REGEXP.test(match[1])) return "UTF-8";
		return false;
	}
	/**
	* Create a full Content-Type header given a MIME type or extension.
	*
	* @param {string} str
	* @return {boolean|string}
	*/
	function contentType(str) {
		if (!str || typeof str !== "string") return false;
		var mime = str.indexOf("/") === -1 ? exports.lookup(str) : str;
		if (!mime) return false;
		if (mime.indexOf("charset") === -1) {
			var charset = exports.charset(mime);
			if (charset) mime += "; charset=" + charset.toLowerCase();
		}
		return mime;
	}
	/**
	* Get the default extension for a MIME type.
	*
	* @param {string} type
	* @return {boolean|string}
	*/
	function extension(type) {
		if (!type || typeof type !== "string") return false;
		var match = EXTRACT_TYPE_REGEXP.exec(type);
		var exts = match && exports.extensions[match[1].toLowerCase()];
		if (!exts || !exts.length) return false;
		return exts[0];
	}
	/**
	* Lookup the MIME type for a file path/extension.
	*
	* @param {string} path
	* @return {boolean|string}
	*/
	function lookup(path) {
		if (!path || typeof path !== "string") return false;
		var extension = extname("x." + path).toLowerCase().substr(1);
		if (!extension) return false;
		return exports.types[extension] || false;
	}
	/**
	* Populate the extensions and types maps.
	* @private
	*/
	function populateMaps(extensions, types) {
		var preference = [
			"nginx",
			"apache",
			void 0,
			"iana"
		];
		Object.keys(db).forEach(function forEachMimeType(type) {
			var mime = db[type];
			var exts = mime.extensions;
			if (!exts || !exts.length) return;
			extensions[type] = exts;
			for (var i = 0; i < exts.length; i++) {
				var extension = exts[i];
				if (types[extension]) {
					var from = preference.indexOf(db[types[extension]].source);
					var to = preference.indexOf(mime.source);
					if (types[extension] !== "application/octet-stream" && (from > to || from === to && types[extension].substr(0, 12) === "application/")) continue;
				}
				types[extension] = type;
			}
		});
	}
}));
//#endregion
//#region node_modules/asynckit/lib/defer.js
var require_defer = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	module.exports = defer;
	/**
	* Runs provided function on next iteration of the event loop
	*
	* @param {function} fn - function to run
	*/
	function defer(fn) {
		var nextTick = typeof setImmediate == "function" ? setImmediate : typeof process == "object" && typeof process.nextTick == "function" ? process.nextTick : null;
		if (nextTick) nextTick(fn);
		else setTimeout(fn, 0);
	}
}));
//#endregion
//#region node_modules/asynckit/lib/async.js
var require_async = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var defer = require_defer();
	module.exports = async;
	/**
	* Runs provided callback asynchronously
	* even if callback itself is not
	*
	* @param   {function} callback - callback to invoke
	* @returns {function} - augmented callback
	*/
	function async(callback) {
		var isAsync = false;
		defer(function() {
			isAsync = true;
		});
		return function async_callback(err, result) {
			if (isAsync) callback(err, result);
			else defer(function nextTick_callback() {
				callback(err, result);
			});
		};
	}
}));
//#endregion
//#region node_modules/asynckit/lib/abort.js
var require_abort = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	module.exports = abort;
	/**
	* Aborts leftover active jobs
	*
	* @param {object} state - current state object
	*/
	function abort(state) {
		Object.keys(state.jobs).forEach(clean.bind(state));
		state.jobs = {};
	}
	/**
	* Cleans up leftover job by invoking abort function for the provided job id
	*
	* @this  state
	* @param {string|number} key - job id to abort
	*/
	function clean(key) {
		if (typeof this.jobs[key] == "function") this.jobs[key]();
	}
}));
//#endregion
//#region node_modules/asynckit/lib/iterate.js
var require_iterate = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var async = require_async();
	var abort = require_abort();
	module.exports = iterate;
	/**
	* Iterates over each job object
	*
	* @param {array|object} list - array or object (named list) to iterate over
	* @param {function} iterator - iterator to run
	* @param {object} state - current job status
	* @param {function} callback - invoked when all elements processed
	*/
	function iterate(list, iterator, state, callback) {
		var key = state["keyedList"] ? state["keyedList"][state.index] : state.index;
		state.jobs[key] = runJob(iterator, key, list[key], function(error, output) {
			if (!(key in state.jobs)) return;
			delete state.jobs[key];
			if (error) abort(state);
			else state.results[key] = output;
			callback(error, state.results);
		});
	}
	/**
	* Runs iterator over provided job element
	*
	* @param   {function} iterator - iterator to invoke
	* @param   {string|number} key - key/index of the element in the list of jobs
	* @param   {mixed} item - job description
	* @param   {function} callback - invoked after iterator is done with the job
	* @returns {function|mixed} - job abort function or something else
	*/
	function runJob(iterator, key, item, callback) {
		var aborter;
		if (iterator.length == 2) aborter = iterator(item, async(callback));
		else aborter = iterator(item, key, async(callback));
		return aborter;
	}
}));
//#endregion
//#region node_modules/asynckit/lib/state.js
var require_state = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	module.exports = state;
	/**
	* Creates initial state object
	* for iteration over list
	*
	* @param   {array|object} list - list to iterate over
	* @param   {function|null} sortMethod - function to use for keys sort,
	*                                     or `null` to keep them as is
	* @returns {object} - initial state object
	*/
	function state(list, sortMethod) {
		var isNamedList = !Array.isArray(list), initState = {
			index: 0,
			keyedList: isNamedList || sortMethod ? Object.keys(list) : null,
			jobs: {},
			results: isNamedList ? {} : [],
			size: isNamedList ? Object.keys(list).length : list.length
		};
		if (sortMethod) initState.keyedList.sort(isNamedList ? sortMethod : function(a, b) {
			return sortMethod(list[a], list[b]);
		});
		return initState;
	}
}));
//#endregion
//#region node_modules/asynckit/lib/terminator.js
var require_terminator = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var abort = require_abort();
	var async = require_async();
	module.exports = terminator;
	/**
	* Terminates jobs in the attached state context
	*
	* @this  AsyncKitState#
	* @param {function} callback - final callback to invoke after termination
	*/
	function terminator(callback) {
		if (!Object.keys(this.jobs).length) return;
		this.index = this.size;
		abort(this);
		async(callback)(null, this.results);
	}
}));
//#endregion
//#region node_modules/asynckit/parallel.js
var require_parallel = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var iterate = require_iterate();
	var initState = require_state();
	var terminator = require_terminator();
	module.exports = parallel;
	/**
	* Runs iterator over provided array elements in parallel
	*
	* @param   {array|object} list - array or object (named list) to iterate over
	* @param   {function} iterator - iterator to run
	* @param   {function} callback - invoked when all elements processed
	* @returns {function} - jobs terminator
	*/
	function parallel(list, iterator, callback) {
		var state = initState(list);
		while (state.index < (state["keyedList"] || list).length) {
			iterate(list, iterator, state, function(error, result) {
				if (error) {
					callback(error, result);
					return;
				}
				if (Object.keys(state.jobs).length === 0) {
					callback(null, state.results);
					return;
				}
			});
			state.index++;
		}
		return terminator.bind(state, callback);
	}
}));
//#endregion
//#region node_modules/asynckit/serialOrdered.js
var require_serialOrdered = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var iterate = require_iterate();
	var initState = require_state();
	var terminator = require_terminator();
	module.exports = serialOrdered;
	module.exports.ascending = ascending;
	module.exports.descending = descending;
	/**
	* Runs iterator over provided sorted array elements in series
	*
	* @param   {array|object} list - array or object (named list) to iterate over
	* @param   {function} iterator - iterator to run
	* @param   {function} sortMethod - custom sort function
	* @param   {function} callback - invoked when all elements processed
	* @returns {function} - jobs terminator
	*/
	function serialOrdered(list, iterator, sortMethod, callback) {
		var state = initState(list, sortMethod);
		iterate(list, iterator, state, function iteratorHandler(error, result) {
			if (error) {
				callback(error, result);
				return;
			}
			state.index++;
			if (state.index < (state["keyedList"] || list).length) {
				iterate(list, iterator, state, iteratorHandler);
				return;
			}
			callback(null, state.results);
		});
		return terminator.bind(state, callback);
	}
	/**
	* sort helper to sort array elements in ascending order
	*
	* @param   {mixed} a - an item to compare
	* @param   {mixed} b - an item to compare
	* @returns {number} - comparison result
	*/
	function ascending(a, b) {
		return a < b ? -1 : a > b ? 1 : 0;
	}
	/**
	* sort helper to sort array elements in descending order
	*
	* @param   {mixed} a - an item to compare
	* @param   {mixed} b - an item to compare
	* @returns {number} - comparison result
	*/
	function descending(a, b) {
		return -1 * ascending(a, b);
	}
}));
//#endregion
//#region node_modules/asynckit/serial.js
var require_serial = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var serialOrdered = require_serialOrdered();
	module.exports = serial;
	/**
	* Runs iterator over provided array elements in series
	*
	* @param   {array|object} list - array or object (named list) to iterate over
	* @param   {function} iterator - iterator to run
	* @param   {function} callback - invoked when all elements processed
	* @returns {function} - jobs terminator
	*/
	function serial(list, iterator, callback) {
		return serialOrdered(list, iterator, null, callback);
	}
}));
//#endregion
//#region node_modules/asynckit/index.js
var require_asynckit = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	module.exports = {
		parallel: require_parallel(),
		serial: require_serial(),
		serialOrdered: require_serialOrdered()
	};
}));
//#endregion
//#region node_modules/es-object-atoms/index.js
var require_es_object_atoms = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	/** @type {import('.')} */
	module.exports = Object;
}));
//#endregion
//#region node_modules/es-errors/index.js
var require_es_errors = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	/** @type {import('.')} */
	module.exports = Error;
}));
//#endregion
//#region node_modules/es-errors/eval.js
var require_eval = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	/** @type {import('./eval')} */
	module.exports = EvalError;
}));
//#endregion
//#region node_modules/es-errors/range.js
var require_range = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	/** @type {import('./range')} */
	module.exports = RangeError;
}));
//#endregion
//#region node_modules/es-errors/ref.js
var require_ref = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	/** @type {import('./ref')} */
	module.exports = ReferenceError;
}));
//#endregion
//#region node_modules/es-errors/syntax.js
var require_syntax = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	/** @type {import('./syntax')} */
	module.exports = SyntaxError;
}));
//#endregion
//#region node_modules/es-errors/type.js
var require_type = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	/** @type {import('./type')} */
	module.exports = TypeError;
}));
//#endregion
//#region node_modules/es-errors/uri.js
var require_uri = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	/** @type {import('./uri')} */
	module.exports = URIError;
}));
//#endregion
//#region node_modules/math-intrinsics/abs.js
var require_abs = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	/** @type {import('./abs')} */
	module.exports = Math.abs;
}));
//#endregion
//#region node_modules/math-intrinsics/floor.js
var require_floor = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	/** @type {import('./floor')} */
	module.exports = Math.floor;
}));
//#endregion
//#region node_modules/math-intrinsics/max.js
var require_max = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	/** @type {import('./max')} */
	module.exports = Math.max;
}));
//#endregion
//#region node_modules/math-intrinsics/min.js
var require_min = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	/** @type {import('./min')} */
	module.exports = Math.min;
}));
//#endregion
//#region node_modules/math-intrinsics/pow.js
var require_pow = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	/** @type {import('./pow')} */
	module.exports = Math.pow;
}));
//#endregion
//#region node_modules/math-intrinsics/round.js
var require_round = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	/** @type {import('./round')} */
	module.exports = Math.round;
}));
//#endregion
//#region node_modules/math-intrinsics/isNaN.js
var require_isNaN = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	/** @type {import('./isNaN')} */
	module.exports = Number.isNaN || function isNaN(a) {
		return a !== a;
	};
}));
//#endregion
//#region node_modules/math-intrinsics/sign.js
var require_sign = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var $isNaN = require_isNaN();
	/** @type {import('./sign')} */
	module.exports = function sign(number) {
		if ($isNaN(number) || number === 0) return number;
		return number < 0 ? -1 : 1;
	};
}));
//#endregion
//#region node_modules/gopd/gOPD.js
var require_gOPD = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	/** @type {import('./gOPD')} */
	module.exports = Object.getOwnPropertyDescriptor;
}));
//#endregion
//#region node_modules/gopd/index.js
var require_gopd = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	/** @type {import('.')} */
	var $gOPD = require_gOPD();
	if ($gOPD) try {
		$gOPD([], "length");
	} catch (e) {
		$gOPD = null;
	}
	module.exports = $gOPD;
}));
//#endregion
//#region node_modules/es-define-property/index.js
var require_es_define_property = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	/** @type {import('.')} */
	var $defineProperty = Object.defineProperty || false;
	if ($defineProperty) try {
		$defineProperty({}, "a", { value: 1 });
	} catch (e) {
		$defineProperty = false;
	}
	module.exports = $defineProperty;
}));
//#endregion
//#region node_modules/has-symbols/shams.js
var require_shams$1 = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	/** @type {import('./shams')} */
	module.exports = function hasSymbols() {
		if (typeof Symbol !== "function" || typeof Object.getOwnPropertySymbols !== "function") return false;
		if (typeof Symbol.iterator === "symbol") return true;
		/** @type {{ [k in symbol]?: unknown }} */
		var obj = {};
		var sym = Symbol("test");
		var symObj = Object(sym);
		if (typeof sym === "string") return false;
		if (Object.prototype.toString.call(sym) !== "[object Symbol]") return false;
		if (Object.prototype.toString.call(symObj) !== "[object Symbol]") return false;
		var symVal = 42;
		obj[sym] = symVal;
		for (var _ in obj) return false;
		if (typeof Object.keys === "function" && Object.keys(obj).length !== 0) return false;
		if (typeof Object.getOwnPropertyNames === "function" && Object.getOwnPropertyNames(obj).length !== 0) return false;
		var syms = Object.getOwnPropertySymbols(obj);
		if (syms.length !== 1 || syms[0] !== sym) return false;
		if (!Object.prototype.propertyIsEnumerable.call(obj, sym)) return false;
		if (typeof Object.getOwnPropertyDescriptor === "function") {
			var descriptor = Object.getOwnPropertyDescriptor(obj, sym);
			if (descriptor.value !== symVal || descriptor.enumerable !== true) return false;
		}
		return true;
	};
}));
//#endregion
//#region node_modules/has-symbols/index.js
var require_has_symbols = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var origSymbol = typeof Symbol !== "undefined" && Symbol;
	var hasSymbolSham = require_shams$1();
	/** @type {import('.')} */
	module.exports = function hasNativeSymbols() {
		if (typeof origSymbol !== "function") return false;
		if (typeof Symbol !== "function") return false;
		if (typeof origSymbol("foo") !== "symbol") return false;
		if (typeof Symbol("bar") !== "symbol") return false;
		return hasSymbolSham();
	};
}));
//#endregion
//#region node_modules/get-proto/Reflect.getPrototypeOf.js
var require_Reflect_getPrototypeOf = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	/** @type {import('./Reflect.getPrototypeOf')} */
	module.exports = typeof Reflect !== "undefined" && Reflect.getPrototypeOf || null;
}));
//#endregion
//#region node_modules/get-proto/Object.getPrototypeOf.js
var require_Object_getPrototypeOf = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	/** @type {import('./Object.getPrototypeOf')} */
	module.exports = require_es_object_atoms().getPrototypeOf || null;
}));
//#endregion
//#region node_modules/function-bind/implementation.js
var require_implementation = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var ERROR_MESSAGE = "Function.prototype.bind called on incompatible ";
	var toStr = Object.prototype.toString;
	var max = Math.max;
	var funcType = "[object Function]";
	var concatty = function concatty(a, b) {
		var arr = [];
		for (var i = 0; i < a.length; i += 1) arr[i] = a[i];
		for (var j = 0; j < b.length; j += 1) arr[j + a.length] = b[j];
		return arr;
	};
	var slicy = function slicy(arrLike, offset) {
		var arr = [];
		for (var i = offset || 0, j = 0; i < arrLike.length; i += 1, j += 1) arr[j] = arrLike[i];
		return arr;
	};
	var joiny = function(arr, joiner) {
		var str = "";
		for (var i = 0; i < arr.length; i += 1) {
			str += arr[i];
			if (i + 1 < arr.length) str += joiner;
		}
		return str;
	};
	module.exports = function bind(that) {
		var target = this;
		if (typeof target !== "function" || toStr.apply(target) !== funcType) throw new TypeError(ERROR_MESSAGE + target);
		var args = slicy(arguments, 1);
		var bound;
		var binder = function() {
			if (this instanceof bound) {
				var result = target.apply(this, concatty(args, arguments));
				if (Object(result) === result) return result;
				return this;
			}
			return target.apply(that, concatty(args, arguments));
		};
		var boundLength = max(0, target.length - args.length);
		var boundArgs = [];
		for (var i = 0; i < boundLength; i++) boundArgs[i] = "$" + i;
		bound = Function("binder", "return function (" + joiny(boundArgs, ",") + "){ return binder.apply(this,arguments); }")(binder);
		if (target.prototype) {
			var Empty = function Empty() {};
			Empty.prototype = target.prototype;
			bound.prototype = new Empty();
			Empty.prototype = null;
		}
		return bound;
	};
}));
//#endregion
//#region node_modules/function-bind/index.js
var require_function_bind = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var implementation = require_implementation();
	module.exports = Function.prototype.bind || implementation;
}));
//#endregion
//#region node_modules/call-bind-apply-helpers/functionCall.js
var require_functionCall = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	/** @type {import('./functionCall')} */
	module.exports = Function.prototype.call;
}));
//#endregion
//#region node_modules/call-bind-apply-helpers/functionApply.js
var require_functionApply = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	/** @type {import('./functionApply')} */
	module.exports = Function.prototype.apply;
}));
//#endregion
//#region node_modules/call-bind-apply-helpers/reflectApply.js
var require_reflectApply = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	/** @type {import('./reflectApply')} */
	module.exports = typeof Reflect !== "undefined" && Reflect && Reflect.apply;
}));
//#endregion
//#region node_modules/call-bind-apply-helpers/actualApply.js
var require_actualApply = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var bind = require_function_bind();
	var $apply = require_functionApply();
	var $call = require_functionCall();
	/** @type {import('./actualApply')} */
	module.exports = require_reflectApply() || bind.call($call, $apply);
}));
//#endregion
//#region node_modules/call-bind-apply-helpers/index.js
var require_call_bind_apply_helpers = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var bind = require_function_bind();
	var $TypeError = require_type();
	var $call = require_functionCall();
	var $actualApply = require_actualApply();
	/** @type {(args: [Function, thisArg?: unknown, ...args: unknown[]]) => Function} TODO FIXME, find a way to use import('.') */
	module.exports = function callBindBasic(args) {
		if (args.length < 1 || typeof args[0] !== "function") throw new $TypeError("a function is required");
		return $actualApply(bind, $call, args);
	};
}));
//#endregion
//#region node_modules/dunder-proto/get.js
var require_get = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var callBind = require_call_bind_apply_helpers();
	var gOPD = require_gopd();
	var hasProtoAccessor;
	try {
		hasProtoAccessor = [].__proto__ === Array.prototype;
	} catch (e) {
		if (!e || typeof e !== "object" || !("code" in e) || e.code !== "ERR_PROTO_ACCESS") throw e;
	}
	var desc = !!hasProtoAccessor && gOPD && gOPD(Object.prototype, "__proto__");
	var $Object = Object;
	var $getPrototypeOf = $Object.getPrototypeOf;
	/** @type {import('./get')} */
	module.exports = desc && typeof desc.get === "function" ? callBind([desc.get]) : typeof $getPrototypeOf === "function" ? function getDunder(value) {
		return $getPrototypeOf(value == null ? value : $Object(value));
	} : false;
}));
//#endregion
//#region node_modules/get-proto/index.js
var require_get_proto = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var reflectGetProto = require_Reflect_getPrototypeOf();
	var originalGetProto = require_Object_getPrototypeOf();
	var getDunderProto = require_get();
	/** @type {import('.')} */
	module.exports = reflectGetProto ? function getProto(O) {
		return reflectGetProto(O);
	} : originalGetProto ? function getProto(O) {
		if (!O || typeof O !== "object" && typeof O !== "function") throw new TypeError("getProto: not an object");
		return originalGetProto(O);
	} : getDunderProto ? function getProto(O) {
		return getDunderProto(O);
	} : null;
}));
//#endregion
//#region node_modules/hasown/index.js
var require_hasown = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var call = Function.prototype.call;
	var $hasOwn = Object.prototype.hasOwnProperty;
	/** @type {import('.')} */
	module.exports = require_function_bind().call(call, $hasOwn);
}));
//#endregion
//#region node_modules/get-intrinsic/index.js
var require_get_intrinsic = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var undefined;
	var $Object = require_es_object_atoms();
	var $Error = require_es_errors();
	var $EvalError = require_eval();
	var $RangeError = require_range();
	var $ReferenceError = require_ref();
	var $SyntaxError = require_syntax();
	var $TypeError = require_type();
	var $URIError = require_uri();
	var abs = require_abs();
	var floor = require_floor();
	var max = require_max();
	var min = require_min();
	var pow = require_pow();
	var round = require_round();
	var sign = require_sign();
	var $Function = Function;
	var getEvalledConstructor = function(expressionSyntax) {
		try {
			return $Function("\"use strict\"; return (" + expressionSyntax + ").constructor;")();
		} catch (e) {}
	};
	var $gOPD = require_gopd();
	var $defineProperty = require_es_define_property();
	var throwTypeError = function() {
		throw new $TypeError();
	};
	var ThrowTypeError = $gOPD ? function() {
		try {
			arguments.callee;
			return throwTypeError;
		} catch (calleeThrows) {
			try {
				return $gOPD(arguments, "callee").get;
			} catch (gOPDthrows) {
				return throwTypeError;
			}
		}
	}() : throwTypeError;
	var hasSymbols = require_has_symbols()();
	var getProto = require_get_proto();
	var $ObjectGPO = require_Object_getPrototypeOf();
	var $ReflectGPO = require_Reflect_getPrototypeOf();
	var $apply = require_functionApply();
	var $call = require_functionCall();
	var needsEval = {};
	var TypedArray = typeof Uint8Array === "undefined" || !getProto ? undefined : getProto(Uint8Array);
	var INTRINSICS = {
		__proto__: null,
		"%AggregateError%": typeof AggregateError === "undefined" ? undefined : AggregateError,
		"%Array%": Array,
		"%ArrayBuffer%": typeof ArrayBuffer === "undefined" ? undefined : ArrayBuffer,
		"%ArrayIteratorPrototype%": hasSymbols && getProto ? getProto([][Symbol.iterator]()) : undefined,
		"%AsyncFromSyncIteratorPrototype%": undefined,
		"%AsyncFunction%": needsEval,
		"%AsyncGenerator%": needsEval,
		"%AsyncGeneratorFunction%": needsEval,
		"%AsyncIteratorPrototype%": needsEval,
		"%Atomics%": typeof Atomics === "undefined" ? undefined : Atomics,
		"%BigInt%": typeof BigInt === "undefined" ? undefined : BigInt,
		"%BigInt64Array%": typeof BigInt64Array === "undefined" ? undefined : BigInt64Array,
		"%BigUint64Array%": typeof BigUint64Array === "undefined" ? undefined : BigUint64Array,
		"%Boolean%": Boolean,
		"%DataView%": typeof DataView === "undefined" ? undefined : DataView,
		"%Date%": Date,
		"%decodeURI%": decodeURI,
		"%decodeURIComponent%": decodeURIComponent,
		"%encodeURI%": encodeURI,
		"%encodeURIComponent%": encodeURIComponent,
		"%Error%": $Error,
		"%eval%": eval,
		"%EvalError%": $EvalError,
		"%Float16Array%": typeof Float16Array === "undefined" ? undefined : Float16Array,
		"%Float32Array%": typeof Float32Array === "undefined" ? undefined : Float32Array,
		"%Float64Array%": typeof Float64Array === "undefined" ? undefined : Float64Array,
		"%FinalizationRegistry%": typeof FinalizationRegistry === "undefined" ? undefined : FinalizationRegistry,
		"%Function%": $Function,
		"%GeneratorFunction%": needsEval,
		"%Int8Array%": typeof Int8Array === "undefined" ? undefined : Int8Array,
		"%Int16Array%": typeof Int16Array === "undefined" ? undefined : Int16Array,
		"%Int32Array%": typeof Int32Array === "undefined" ? undefined : Int32Array,
		"%isFinite%": isFinite,
		"%isNaN%": isNaN,
		"%IteratorPrototype%": hasSymbols && getProto ? getProto(getProto([][Symbol.iterator]())) : undefined,
		"%JSON%": typeof JSON === "object" ? JSON : undefined,
		"%Map%": typeof Map === "undefined" ? undefined : Map,
		"%MapIteratorPrototype%": typeof Map === "undefined" || !hasSymbols || !getProto ? undefined : getProto((/* @__PURE__ */ new Map())[Symbol.iterator]()),
		"%Math%": Math,
		"%Number%": Number,
		"%Object%": $Object,
		"%Object.getOwnPropertyDescriptor%": $gOPD,
		"%parseFloat%": parseFloat,
		"%parseInt%": parseInt,
		"%Promise%": typeof Promise === "undefined" ? undefined : Promise,
		"%Proxy%": typeof Proxy === "undefined" ? undefined : Proxy,
		"%RangeError%": $RangeError,
		"%ReferenceError%": $ReferenceError,
		"%Reflect%": typeof Reflect === "undefined" ? undefined : Reflect,
		"%RegExp%": RegExp,
		"%Set%": typeof Set === "undefined" ? undefined : Set,
		"%SetIteratorPrototype%": typeof Set === "undefined" || !hasSymbols || !getProto ? undefined : getProto((/* @__PURE__ */ new Set())[Symbol.iterator]()),
		"%SharedArrayBuffer%": typeof SharedArrayBuffer === "undefined" ? undefined : SharedArrayBuffer,
		"%String%": String,
		"%StringIteratorPrototype%": hasSymbols && getProto ? getProto(""[Symbol.iterator]()) : undefined,
		"%Symbol%": hasSymbols ? Symbol : undefined,
		"%SyntaxError%": $SyntaxError,
		"%ThrowTypeError%": ThrowTypeError,
		"%TypedArray%": TypedArray,
		"%TypeError%": $TypeError,
		"%Uint8Array%": typeof Uint8Array === "undefined" ? undefined : Uint8Array,
		"%Uint8ClampedArray%": typeof Uint8ClampedArray === "undefined" ? undefined : Uint8ClampedArray,
		"%Uint16Array%": typeof Uint16Array === "undefined" ? undefined : Uint16Array,
		"%Uint32Array%": typeof Uint32Array === "undefined" ? undefined : Uint32Array,
		"%URIError%": $URIError,
		"%WeakMap%": typeof WeakMap === "undefined" ? undefined : WeakMap,
		"%WeakRef%": typeof WeakRef === "undefined" ? undefined : WeakRef,
		"%WeakSet%": typeof WeakSet === "undefined" ? undefined : WeakSet,
		"%Function.prototype.call%": $call,
		"%Function.prototype.apply%": $apply,
		"%Object.defineProperty%": $defineProperty,
		"%Object.getPrototypeOf%": $ObjectGPO,
		"%Math.abs%": abs,
		"%Math.floor%": floor,
		"%Math.max%": max,
		"%Math.min%": min,
		"%Math.pow%": pow,
		"%Math.round%": round,
		"%Math.sign%": sign,
		"%Reflect.getPrototypeOf%": $ReflectGPO
	};
	if (getProto) try {
		null.error;
	} catch (e) {
		INTRINSICS["%Error.prototype%"] = getProto(getProto(e));
	}
	var doEval = function doEval(name) {
		var value;
		if (name === "%AsyncFunction%") value = getEvalledConstructor("async function () {}");
		else if (name === "%GeneratorFunction%") value = getEvalledConstructor("function* () {}");
		else if (name === "%AsyncGeneratorFunction%") value = getEvalledConstructor("async function* () {}");
		else if (name === "%AsyncGenerator%") {
			var fn = doEval("%AsyncGeneratorFunction%");
			if (fn) value = fn.prototype;
		} else if (name === "%AsyncIteratorPrototype%") {
			var gen = doEval("%AsyncGenerator%");
			if (gen && getProto) value = getProto(gen.prototype);
		}
		INTRINSICS[name] = value;
		return value;
	};
	var LEGACY_ALIASES = {
		__proto__: null,
		"%ArrayBufferPrototype%": ["ArrayBuffer", "prototype"],
		"%ArrayPrototype%": ["Array", "prototype"],
		"%ArrayProto_entries%": [
			"Array",
			"prototype",
			"entries"
		],
		"%ArrayProto_forEach%": [
			"Array",
			"prototype",
			"forEach"
		],
		"%ArrayProto_keys%": [
			"Array",
			"prototype",
			"keys"
		],
		"%ArrayProto_values%": [
			"Array",
			"prototype",
			"values"
		],
		"%AsyncFunctionPrototype%": ["AsyncFunction", "prototype"],
		"%AsyncGenerator%": ["AsyncGeneratorFunction", "prototype"],
		"%AsyncGeneratorPrototype%": [
			"AsyncGeneratorFunction",
			"prototype",
			"prototype"
		],
		"%BooleanPrototype%": ["Boolean", "prototype"],
		"%DataViewPrototype%": ["DataView", "prototype"],
		"%DatePrototype%": ["Date", "prototype"],
		"%ErrorPrototype%": ["Error", "prototype"],
		"%EvalErrorPrototype%": ["EvalError", "prototype"],
		"%Float32ArrayPrototype%": ["Float32Array", "prototype"],
		"%Float64ArrayPrototype%": ["Float64Array", "prototype"],
		"%FunctionPrototype%": ["Function", "prototype"],
		"%Generator%": ["GeneratorFunction", "prototype"],
		"%GeneratorPrototype%": [
			"GeneratorFunction",
			"prototype",
			"prototype"
		],
		"%Int8ArrayPrototype%": ["Int8Array", "prototype"],
		"%Int16ArrayPrototype%": ["Int16Array", "prototype"],
		"%Int32ArrayPrototype%": ["Int32Array", "prototype"],
		"%JSONParse%": ["JSON", "parse"],
		"%JSONStringify%": ["JSON", "stringify"],
		"%MapPrototype%": ["Map", "prototype"],
		"%NumberPrototype%": ["Number", "prototype"],
		"%ObjectPrototype%": ["Object", "prototype"],
		"%ObjProto_toString%": [
			"Object",
			"prototype",
			"toString"
		],
		"%ObjProto_valueOf%": [
			"Object",
			"prototype",
			"valueOf"
		],
		"%PromisePrototype%": ["Promise", "prototype"],
		"%PromiseProto_then%": [
			"Promise",
			"prototype",
			"then"
		],
		"%Promise_all%": ["Promise", "all"],
		"%Promise_reject%": ["Promise", "reject"],
		"%Promise_resolve%": ["Promise", "resolve"],
		"%RangeErrorPrototype%": ["RangeError", "prototype"],
		"%ReferenceErrorPrototype%": ["ReferenceError", "prototype"],
		"%RegExpPrototype%": ["RegExp", "prototype"],
		"%SetPrototype%": ["Set", "prototype"],
		"%SharedArrayBufferPrototype%": ["SharedArrayBuffer", "prototype"],
		"%StringPrototype%": ["String", "prototype"],
		"%SymbolPrototype%": ["Symbol", "prototype"],
		"%SyntaxErrorPrototype%": ["SyntaxError", "prototype"],
		"%TypedArrayPrototype%": ["TypedArray", "prototype"],
		"%TypeErrorPrototype%": ["TypeError", "prototype"],
		"%Uint8ArrayPrototype%": ["Uint8Array", "prototype"],
		"%Uint8ClampedArrayPrototype%": ["Uint8ClampedArray", "prototype"],
		"%Uint16ArrayPrototype%": ["Uint16Array", "prototype"],
		"%Uint32ArrayPrototype%": ["Uint32Array", "prototype"],
		"%URIErrorPrototype%": ["URIError", "prototype"],
		"%WeakMapPrototype%": ["WeakMap", "prototype"],
		"%WeakSetPrototype%": ["WeakSet", "prototype"]
	};
	var bind = require_function_bind();
	var hasOwn = require_hasown();
	var $concat = bind.call($call, Array.prototype.concat);
	var $spliceApply = bind.call($apply, Array.prototype.splice);
	var $replace = bind.call($call, String.prototype.replace);
	var $strSlice = bind.call($call, String.prototype.slice);
	var $exec = bind.call($call, RegExp.prototype.exec);
	var rePropName = /[^%.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|%$))/g;
	var reEscapeChar = /\\(\\)?/g;
	var stringToPath = function stringToPath(string) {
		var first = $strSlice(string, 0, 1);
		var last = $strSlice(string, -1);
		if (first === "%" && last !== "%") throw new $SyntaxError("invalid intrinsic syntax, expected closing `%`");
		else if (last === "%" && first !== "%") throw new $SyntaxError("invalid intrinsic syntax, expected opening `%`");
		var result = [];
		$replace(string, rePropName, function(match, number, quote, subString) {
			result[result.length] = quote ? $replace(subString, reEscapeChar, "$1") : number || match;
		});
		return result;
	};
	var getBaseIntrinsic = function getBaseIntrinsic(name, allowMissing) {
		var intrinsicName = name;
		var alias;
		if (hasOwn(LEGACY_ALIASES, intrinsicName)) {
			alias = LEGACY_ALIASES[intrinsicName];
			intrinsicName = "%" + alias[0] + "%";
		}
		if (hasOwn(INTRINSICS, intrinsicName)) {
			var value = INTRINSICS[intrinsicName];
			if (value === needsEval) value = doEval(intrinsicName);
			if (typeof value === "undefined" && !allowMissing) throw new $TypeError("intrinsic " + name + " exists, but is not available. Please file an issue!");
			return {
				alias,
				name: intrinsicName,
				value
			};
		}
		throw new $SyntaxError("intrinsic " + name + " does not exist!");
	};
	module.exports = function GetIntrinsic(name, allowMissing) {
		if (typeof name !== "string" || name.length === 0) throw new $TypeError("intrinsic name must be a non-empty string");
		if (arguments.length > 1 && typeof allowMissing !== "boolean") throw new $TypeError("\"allowMissing\" argument must be a boolean");
		if ($exec(/^%?[^%]*%?$/, name) === null) throw new $SyntaxError("`%` may not be present anywhere but at the beginning and end of the intrinsic name");
		var parts = stringToPath(name);
		var intrinsicBaseName = parts.length > 0 ? parts[0] : "";
		var intrinsic = getBaseIntrinsic("%" + intrinsicBaseName + "%", allowMissing);
		var intrinsicRealName = intrinsic.name;
		var value = intrinsic.value;
		var skipFurtherCaching = false;
		var alias = intrinsic.alias;
		if (alias) {
			intrinsicBaseName = alias[0];
			$spliceApply(parts, $concat([0, 1], alias));
		}
		for (var i = 1, isOwn = true; i < parts.length; i += 1) {
			var part = parts[i];
			var first = $strSlice(part, 0, 1);
			var last = $strSlice(part, -1);
			if ((first === "\"" || first === "'" || first === "`" || last === "\"" || last === "'" || last === "`") && first !== last) throw new $SyntaxError("property names with quotes must have matching quotes");
			if (part === "constructor" || !isOwn) skipFurtherCaching = true;
			intrinsicBaseName += "." + part;
			intrinsicRealName = "%" + intrinsicBaseName + "%";
			if (hasOwn(INTRINSICS, intrinsicRealName)) value = INTRINSICS[intrinsicRealName];
			else if (value != null) {
				if (!(part in value)) {
					if (!allowMissing) throw new $TypeError("base intrinsic for " + name + " exists, but the property is not available.");
					return;
				}
				if ($gOPD && i + 1 >= parts.length) {
					var desc = $gOPD(value, part);
					isOwn = !!desc;
					if (isOwn && "get" in desc && !("originalValue" in desc.get)) value = desc.get;
					else value = value[part];
				} else {
					isOwn = hasOwn(value, part);
					value = value[part];
				}
				if (isOwn && !skipFurtherCaching) INTRINSICS[intrinsicRealName] = value;
			}
		}
		return value;
	};
}));
//#endregion
//#region node_modules/has-tostringtag/shams.js
var require_shams = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var hasSymbols = require_shams$1();
	/** @type {import('.')} */
	module.exports = function hasToStringTagShams() {
		return hasSymbols() && !!Symbol.toStringTag;
	};
}));
//#endregion
//#region node_modules/es-set-tostringtag/index.js
var require_es_set_tostringtag = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var $defineProperty = require_get_intrinsic()("%Object.defineProperty%", true);
	var hasToStringTag = require_shams()();
	var hasOwn = require_hasown();
	var $TypeError = require_type();
	var toStringTag = hasToStringTag ? Symbol.toStringTag : null;
	/** @type {import('.')} */
	module.exports = function setToStringTag(object, value) {
		var overrideIfSet = arguments.length > 2 && !!arguments[2] && arguments[2].force;
		var nonConfigurable = arguments.length > 2 && !!arguments[2] && arguments[2].nonConfigurable;
		if (typeof overrideIfSet !== "undefined" && typeof overrideIfSet !== "boolean" || typeof nonConfigurable !== "undefined" && typeof nonConfigurable !== "boolean") throw new $TypeError("if provided, the `overrideIfSet` and `nonConfigurable` options must be booleans");
		if (toStringTag && (overrideIfSet || !hasOwn(object, toStringTag))) if ($defineProperty) $defineProperty(object, toStringTag, {
			configurable: !nonConfigurable,
			enumerable: false,
			value,
			writable: false
		});
		else object[toStringTag] = value;
	};
}));
//#endregion
//#region node_modules/form-data/lib/populate.js
var require_populate = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	module.exports = function(dst, src) {
		Object.keys(src).forEach(function(prop) {
			dst[prop] = dst[prop] || src[prop];
		});
		return dst;
	};
}));
//#endregion
//#region node_modules/form-data/lib/form_data.js
var require_form_data = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var CombinedStream = require_combined_stream();
	var util$1 = __require("util");
	var path = __require("path");
	var http$2 = __require("http");
	var https$2 = __require("https");
	var parseUrl = __require("url").parse;
	var fs = __require("fs");
	var Stream = __require("stream").Stream;
	var crypto$1 = __require("crypto");
	var mime = require_mime_types();
	var asynckit = require_asynckit();
	var setToStringTag = require_es_set_tostringtag();
	var hasOwn = require_hasown();
	var populate = require_populate();
	/**
	* Create readable "multipart/form-data" streams.
	* Can be used to submit forms
	* and file uploads to other web applications.
	*
	* @constructor
	* @param {object} options - Properties to be added/overriden for FormData and CombinedStream
	*/
	function FormData(options) {
		if (!(this instanceof FormData)) return new FormData(options);
		this._overheadLength = 0;
		this._valueLength = 0;
		this._valuesToMeasure = [];
		CombinedStream.call(this);
		options = options || {};
		for (var option in options) this[option] = options[option];
	}
	util$1.inherits(FormData, CombinedStream);
	FormData.LINE_BREAK = "\r\n";
	FormData.DEFAULT_CONTENT_TYPE = "application/octet-stream";
	FormData.prototype.append = function(field, value, options) {
		options = options || {};
		if (typeof options === "string") options = { filename: options };
		var append = CombinedStream.prototype.append.bind(this);
		if (typeof value === "number" || value == null) value = String(value);
		if (Array.isArray(value)) {
			this._error(/* @__PURE__ */ new Error("Arrays are not supported."));
			return;
		}
		var header = this._multiPartHeader(field, value, options);
		var footer = this._multiPartFooter();
		append(header);
		append(value);
		append(footer);
		this._trackLength(header, value, options);
	};
	FormData.prototype._trackLength = function(header, value, options) {
		var valueLength = 0;
		if (options.knownLength != null) valueLength += Number(options.knownLength);
		else if (Buffer.isBuffer(value)) valueLength = value.length;
		else if (typeof value === "string") valueLength = Buffer.byteLength(value);
		this._valueLength += valueLength;
		this._overheadLength += Buffer.byteLength(header) + FormData.LINE_BREAK.length;
		if (!value || !value.path && !(value.readable && hasOwn(value, "httpVersion")) && !(value instanceof Stream)) return;
		if (!options.knownLength) this._valuesToMeasure.push(value);
	};
	FormData.prototype._lengthRetriever = function(value, callback) {
		if (hasOwn(value, "fd")) if (value.end != void 0 && value.end != Infinity && value.start != void 0) callback(null, value.end + 1 - (value.start ? value.start : 0));
		else fs.stat(value.path, function(err, stat) {
			if (err) {
				callback(err);
				return;
			}
			callback(null, stat.size - (value.start ? value.start : 0));
		});
		else if (hasOwn(value, "httpVersion")) callback(null, Number(value.headers["content-length"]));
		else if (hasOwn(value, "httpModule")) {
			value.on("response", function(response) {
				value.pause();
				callback(null, Number(response.headers["content-length"]));
			});
			value.resume();
		} else callback("Unknown stream");
	};
	FormData.prototype._multiPartHeader = function(field, value, options) {
		if (typeof options.header === "string") return options.header;
		var contentDisposition = this._getContentDisposition(value, options);
		var contentType = this._getContentType(value, options);
		var contents = "";
		var headers = {
			"Content-Disposition": ["form-data", "name=\"" + field + "\""].concat(contentDisposition || []),
			"Content-Type": [].concat(contentType || [])
		};
		if (typeof options.header === "object") populate(headers, options.header);
		var header;
		for (var prop in headers) if (hasOwn(headers, prop)) {
			header = headers[prop];
			if (header == null) continue;
			if (!Array.isArray(header)) header = [header];
			if (header.length) contents += prop + ": " + header.join("; ") + FormData.LINE_BREAK;
		}
		return "--" + this.getBoundary() + FormData.LINE_BREAK + contents + FormData.LINE_BREAK;
	};
	FormData.prototype._getContentDisposition = function(value, options) {
		var filename;
		if (typeof options.filepath === "string") filename = path.normalize(options.filepath).replace(/\\/g, "/");
		else if (options.filename || value && (value.name || value.path)) filename = path.basename(options.filename || value && (value.name || value.path));
		else if (value && value.readable && hasOwn(value, "httpVersion")) filename = path.basename(value.client._httpMessage.path || "");
		if (filename) return "filename=\"" + filename + "\"";
	};
	FormData.prototype._getContentType = function(value, options) {
		var contentType = options.contentType;
		if (!contentType && value && value.name) contentType = mime.lookup(value.name);
		if (!contentType && value && value.path) contentType = mime.lookup(value.path);
		if (!contentType && value && value.readable && hasOwn(value, "httpVersion")) contentType = value.headers["content-type"];
		if (!contentType && (options.filepath || options.filename)) contentType = mime.lookup(options.filepath || options.filename);
		if (!contentType && value && typeof value === "object") contentType = FormData.DEFAULT_CONTENT_TYPE;
		return contentType;
	};
	FormData.prototype._multiPartFooter = function() {
		return function(next) {
			var footer = FormData.LINE_BREAK;
			if (this._streams.length === 0) footer += this._lastBoundary();
			next(footer);
		}.bind(this);
	};
	FormData.prototype._lastBoundary = function() {
		return "--" + this.getBoundary() + "--" + FormData.LINE_BREAK;
	};
	FormData.prototype.getHeaders = function(userHeaders) {
		var header;
		var formHeaders = { "content-type": "multipart/form-data; boundary=" + this.getBoundary() };
		for (header in userHeaders) if (hasOwn(userHeaders, header)) formHeaders[header.toLowerCase()] = userHeaders[header];
		return formHeaders;
	};
	FormData.prototype.setBoundary = function(boundary) {
		if (typeof boundary !== "string") throw new TypeError("FormData boundary must be a string");
		this._boundary = boundary;
	};
	FormData.prototype.getBoundary = function() {
		if (!this._boundary) this._generateBoundary();
		return this._boundary;
	};
	FormData.prototype.getBuffer = function() {
		var dataBuffer = new Buffer.alloc(0);
		var boundary = this.getBoundary();
		for (var i = 0, len = this._streams.length; i < len; i++) if (typeof this._streams[i] !== "function") {
			if (Buffer.isBuffer(this._streams[i])) dataBuffer = Buffer.concat([dataBuffer, this._streams[i]]);
			else dataBuffer = Buffer.concat([dataBuffer, Buffer.from(this._streams[i])]);
			if (typeof this._streams[i] !== "string" || this._streams[i].substring(2, boundary.length + 2) !== boundary) dataBuffer = Buffer.concat([dataBuffer, Buffer.from(FormData.LINE_BREAK)]);
		}
		return Buffer.concat([dataBuffer, Buffer.from(this._lastBoundary())]);
	};
	FormData.prototype._generateBoundary = function() {
		this._boundary = "--------------------------" + crypto$1.randomBytes(12).toString("hex");
	};
	FormData.prototype.getLengthSync = function() {
		var knownLength = this._overheadLength + this._valueLength;
		if (this._streams.length) knownLength += this._lastBoundary().length;
		if (!this.hasKnownLength()) this._error(/* @__PURE__ */ new Error("Cannot calculate proper length in synchronous way."));
		return knownLength;
	};
	FormData.prototype.hasKnownLength = function() {
		var hasKnownLength = true;
		if (this._valuesToMeasure.length) hasKnownLength = false;
		return hasKnownLength;
	};
	FormData.prototype.getLength = function(cb) {
		var knownLength = this._overheadLength + this._valueLength;
		if (this._streams.length) knownLength += this._lastBoundary().length;
		if (!this._valuesToMeasure.length) {
			process.nextTick(cb.bind(this, null, knownLength));
			return;
		}
		asynckit.parallel(this._valuesToMeasure, this._lengthRetriever, function(err, values) {
			if (err) {
				cb(err);
				return;
			}
			values.forEach(function(length) {
				knownLength += length;
			});
			cb(null, knownLength);
		});
	};
	FormData.prototype.submit = function(params, cb) {
		var request;
		var options;
		var defaults = { method: "post" };
		if (typeof params === "string") {
			params = parseUrl(params);
			options = populate({
				port: params.port,
				path: params.pathname,
				host: params.hostname,
				protocol: params.protocol
			}, defaults);
		} else {
			options = populate(params, defaults);
			if (!options.port) options.port = options.protocol === "https:" ? 443 : 80;
		}
		options.headers = this.getHeaders(params.headers);
		if (options.protocol === "https:") request = https$2.request(options);
		else request = http$2.request(options);
		this.getLength(function(err, length) {
			if (err && err !== "Unknown stream") {
				this._error(err);
				return;
			}
			if (length) request.setHeader("Content-Length", length);
			this.pipe(request);
			if (cb) {
				var onResponse;
				var callback = function(error, responce) {
					request.removeListener("error", callback);
					request.removeListener("response", onResponse);
					return cb.call(this, error, responce);
				};
				onResponse = callback.bind(this, null);
				request.on("error", callback);
				request.on("response", onResponse);
			}
		}.bind(this));
		return request;
	};
	FormData.prototype._error = function(err) {
		if (!this.error) {
			this.error = err;
			this.pause();
			this.emit("error", err);
		}
	};
	FormData.prototype.toString = function() {
		return "[object FormData]";
	};
	setToStringTag(FormData.prototype, "FormData");
	module.exports = FormData;
}));
//#endregion
//#region node_modules/follow-redirects/debug.js
var require_debug = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var debug;
	module.exports = function() {
		if (!debug) {
			try {
				debug = require_src()("follow-redirects");
			} catch (error) {}
			if (typeof debug !== "function") debug = function() {};
		}
		debug.apply(null, arguments);
	};
}));
//#endregion
//#region node_modules/follow-redirects/index.js
var require_follow_redirects = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var url$1 = __require("url");
	var URL = url$1.URL;
	var http$1 = __require("http");
	var https$1 = __require("https");
	var Writable = __require("stream").Writable;
	var assert = __require("assert");
	var debug = require_debug();
	// istanbul ignore next
	(function detectUnsupportedEnvironment() {
		var looksLikeNode = typeof process !== "undefined";
		var looksLikeBrowser = typeof window !== "undefined" && typeof document !== "undefined";
		var looksLikeV8 = isFunction(Error.captureStackTrace);
		if (!looksLikeNode && (looksLikeBrowser || !looksLikeV8)) console.warn("The follow-redirects package should be excluded from browser builds.");
	})();
	var useNativeURL = false;
	try {
		assert(new URL(""));
	} catch (error) {
		useNativeURL = error.code === "ERR_INVALID_URL";
	}
	var preservedUrlFields = [
		"auth",
		"host",
		"hostname",
		"href",
		"path",
		"pathname",
		"port",
		"protocol",
		"query",
		"search",
		"hash"
	];
	var events = [
		"abort",
		"aborted",
		"connect",
		"error",
		"socket",
		"timeout"
	];
	var eventHandlers = Object.create(null);
	events.forEach(function(event) {
		eventHandlers[event] = function(arg1, arg2, arg3) {
			this._redirectable.emit(event, arg1, arg2, arg3);
		};
	});
	var InvalidUrlError = createErrorType("ERR_INVALID_URL", "Invalid URL", TypeError);
	var RedirectionError = createErrorType("ERR_FR_REDIRECTION_FAILURE", "Redirected request failed");
	var TooManyRedirectsError = createErrorType("ERR_FR_TOO_MANY_REDIRECTS", "Maximum number of redirects exceeded", RedirectionError);
	var MaxBodyLengthExceededError = createErrorType("ERR_FR_MAX_BODY_LENGTH_EXCEEDED", "Request body larger than maxBodyLength limit");
	var WriteAfterEndError = createErrorType("ERR_STREAM_WRITE_AFTER_END", "write after end");
	// istanbul ignore next
	var destroy = Writable.prototype.destroy || noop;
	function RedirectableRequest(options, responseCallback) {
		Writable.call(this);
		this._sanitizeOptions(options);
		this._options = options;
		this._ended = false;
		this._ending = false;
		this._redirectCount = 0;
		this._redirects = [];
		this._requestBodyLength = 0;
		this._requestBodyBuffers = [];
		if (responseCallback) this.on("response", responseCallback);
		var self = this;
		this._onNativeResponse = function(response) {
			try {
				self._processResponse(response);
			} catch (cause) {
				self.emit("error", cause instanceof RedirectionError ? cause : new RedirectionError({ cause }));
			}
		};
		this._performRequest();
	}
	RedirectableRequest.prototype = Object.create(Writable.prototype);
	RedirectableRequest.prototype.abort = function() {
		destroyRequest(this._currentRequest);
		this._currentRequest.abort();
		this.emit("abort");
	};
	RedirectableRequest.prototype.destroy = function(error) {
		destroyRequest(this._currentRequest, error);
		destroy.call(this, error);
		return this;
	};
	RedirectableRequest.prototype.write = function(data, encoding, callback) {
		if (this._ending) throw new WriteAfterEndError();
		if (!isString(data) && !isBuffer(data)) throw new TypeError("data should be a string, Buffer or Uint8Array");
		if (isFunction(encoding)) {
			callback = encoding;
			encoding = null;
		}
		if (data.length === 0) {
			if (callback) callback();
			return;
		}
		if (this._requestBodyLength + data.length <= this._options.maxBodyLength) {
			this._requestBodyLength += data.length;
			this._requestBodyBuffers.push({
				data,
				encoding
			});
			this._currentRequest.write(data, encoding, callback);
		} else {
			this.emit("error", new MaxBodyLengthExceededError());
			this.abort();
		}
	};
	RedirectableRequest.prototype.end = function(data, encoding, callback) {
		if (isFunction(data)) {
			callback = data;
			data = encoding = null;
		} else if (isFunction(encoding)) {
			callback = encoding;
			encoding = null;
		}
		if (!data) {
			this._ended = this._ending = true;
			this._currentRequest.end(null, null, callback);
		} else {
			var self = this;
			var currentRequest = this._currentRequest;
			this.write(data, encoding, function() {
				self._ended = true;
				currentRequest.end(null, null, callback);
			});
			this._ending = true;
		}
	};
	RedirectableRequest.prototype.setHeader = function(name, value) {
		this._options.headers[name] = value;
		this._currentRequest.setHeader(name, value);
	};
	RedirectableRequest.prototype.removeHeader = function(name) {
		delete this._options.headers[name];
		this._currentRequest.removeHeader(name);
	};
	RedirectableRequest.prototype.setTimeout = function(msecs, callback) {
		var self = this;
		function destroyOnTimeout(socket) {
			socket.setTimeout(msecs);
			socket.removeListener("timeout", socket.destroy);
			socket.addListener("timeout", socket.destroy);
		}
		function startTimer(socket) {
			if (self._timeout) clearTimeout(self._timeout);
			self._timeout = setTimeout(function() {
				self.emit("timeout");
				clearTimer();
			}, msecs);
			destroyOnTimeout(socket);
		}
		function clearTimer() {
			if (self._timeout) {
				clearTimeout(self._timeout);
				self._timeout = null;
			}
			self.removeListener("abort", clearTimer);
			self.removeListener("error", clearTimer);
			self.removeListener("response", clearTimer);
			self.removeListener("close", clearTimer);
			if (callback) self.removeListener("timeout", callback);
			if (!self.socket) self._currentRequest.removeListener("socket", startTimer);
		}
		if (callback) this.on("timeout", callback);
		if (this.socket) startTimer(this.socket);
		else this._currentRequest.once("socket", startTimer);
		this.on("socket", destroyOnTimeout);
		this.on("abort", clearTimer);
		this.on("error", clearTimer);
		this.on("response", clearTimer);
		this.on("close", clearTimer);
		return this;
	};
	[
		"flushHeaders",
		"getHeader",
		"setNoDelay",
		"setSocketKeepAlive"
	].forEach(function(method) {
		RedirectableRequest.prototype[method] = function(a, b) {
			return this._currentRequest[method](a, b);
		};
	});
	[
		"aborted",
		"connection",
		"socket"
	].forEach(function(property) {
		Object.defineProperty(RedirectableRequest.prototype, property, { get: function() {
			return this._currentRequest[property];
		} });
	});
	RedirectableRequest.prototype._sanitizeOptions = function(options) {
		if (!options.headers) options.headers = {};
		if (options.host) {
			if (!options.hostname) options.hostname = options.host;
			delete options.host;
		}
		if (!options.pathname && options.path) {
			var searchPos = options.path.indexOf("?");
			if (searchPos < 0) options.pathname = options.path;
			else {
				options.pathname = options.path.substring(0, searchPos);
				options.search = options.path.substring(searchPos);
			}
		}
	};
	RedirectableRequest.prototype._performRequest = function() {
		var protocol = this._options.protocol;
		var nativeProtocol = this._options.nativeProtocols[protocol];
		if (!nativeProtocol) throw new TypeError("Unsupported protocol " + protocol);
		if (this._options.agents) {
			var scheme = protocol.slice(0, -1);
			this._options.agent = this._options.agents[scheme];
		}
		var request = this._currentRequest = nativeProtocol.request(this._options, this._onNativeResponse);
		request._redirectable = this;
		for (var event of events) request.on(event, eventHandlers[event]);
		this._currentUrl = /^\//.test(this._options.path) ? url$1.format(this._options) : this._options.path;
		if (this._isRedirect) {
			var i = 0;
			var self = this;
			var buffers = this._requestBodyBuffers;
			(function writeNext(error) {
				// istanbul ignore else
				if (request === self._currentRequest) {
					// istanbul ignore if
					if (error) self.emit("error", error);
					else if (i < buffers.length) {
						var buffer = buffers[i++];
						// istanbul ignore else
						if (!request.finished) request.write(buffer.data, buffer.encoding, writeNext);
					} else if (self._ended) request.end();
				}
			})();
		}
	};
	RedirectableRequest.prototype._processResponse = function(response) {
		var statusCode = response.statusCode;
		if (this._options.trackRedirects) this._redirects.push({
			url: this._currentUrl,
			headers: response.headers,
			statusCode
		});
		var location = response.headers.location;
		if (!location || this._options.followRedirects === false || statusCode < 300 || statusCode >= 400) {
			response.responseUrl = this._currentUrl;
			response.redirects = this._redirects;
			this.emit("response", response);
			this._requestBodyBuffers = [];
			return;
		}
		destroyRequest(this._currentRequest);
		response.destroy();
		if (++this._redirectCount > this._options.maxRedirects) throw new TooManyRedirectsError();
		var requestHeaders;
		var beforeRedirect = this._options.beforeRedirect;
		if (beforeRedirect) requestHeaders = Object.assign({ Host: response.req.getHeader("host") }, this._options.headers);
		var method = this._options.method;
		if ((statusCode === 301 || statusCode === 302) && this._options.method === "POST" || statusCode === 303 && !/^(?:GET|HEAD)$/.test(this._options.method)) {
			this._options.method = "GET";
			this._requestBodyBuffers = [];
			removeMatchingHeaders(/^content-/i, this._options.headers);
		}
		var currentHostHeader = removeMatchingHeaders(/^host$/i, this._options.headers);
		var currentUrlParts = parseUrl(this._currentUrl);
		var currentHost = currentHostHeader || currentUrlParts.host;
		var currentUrl = /^\w+:/.test(location) ? this._currentUrl : url$1.format(Object.assign(currentUrlParts, { host: currentHost }));
		var redirectUrl = resolveUrl(location, currentUrl);
		debug("redirecting to", redirectUrl.href);
		this._isRedirect = true;
		spreadUrlObject(redirectUrl, this._options);
		if (redirectUrl.protocol !== currentUrlParts.protocol && redirectUrl.protocol !== "https:" || redirectUrl.host !== currentHost && !isSubdomain(redirectUrl.host, currentHost)) removeMatchingHeaders(/^(?:(?:proxy-)?authorization|cookie)$/i, this._options.headers);
		if (isFunction(beforeRedirect)) {
			var responseDetails = {
				headers: response.headers,
				statusCode
			};
			var requestDetails = {
				url: currentUrl,
				method,
				headers: requestHeaders
			};
			beforeRedirect(this._options, responseDetails, requestDetails);
			this._sanitizeOptions(this._options);
		}
		this._performRequest();
	};
	function wrap(protocols) {
		var exports$1 = {
			maxRedirects: 21,
			maxBodyLength: 10 * 1024 * 1024
		};
		var nativeProtocols = {};
		Object.keys(protocols).forEach(function(scheme) {
			var protocol = scheme + ":";
			var nativeProtocol = nativeProtocols[protocol] = protocols[scheme];
			var wrappedProtocol = exports$1[scheme] = Object.create(nativeProtocol);
			function request(input, options, callback) {
				if (isURL(input)) input = spreadUrlObject(input);
				else if (isString(input)) input = spreadUrlObject(parseUrl(input));
				else {
					callback = options;
					options = validateUrl(input);
					input = { protocol };
				}
				if (isFunction(options)) {
					callback = options;
					options = null;
				}
				options = Object.assign({
					maxRedirects: exports$1.maxRedirects,
					maxBodyLength: exports$1.maxBodyLength
				}, input, options);
				options.nativeProtocols = nativeProtocols;
				if (!isString(options.host) && !isString(options.hostname)) options.hostname = "::1";
				assert.equal(options.protocol, protocol, "protocol mismatch");
				debug("options", options);
				return new RedirectableRequest(options, callback);
			}
			function get(input, options, callback) {
				var wrappedRequest = wrappedProtocol.request(input, options, callback);
				wrappedRequest.end();
				return wrappedRequest;
			}
			Object.defineProperties(wrappedProtocol, {
				request: {
					value: request,
					configurable: true,
					enumerable: true,
					writable: true
				},
				get: {
					value: get,
					configurable: true,
					enumerable: true,
					writable: true
				}
			});
		});
		return exports$1;
	}
	function noop() {}
	function parseUrl(input) {
		var parsed;
		// istanbul ignore else
		if (useNativeURL) parsed = new URL(input);
		else {
			parsed = validateUrl(url$1.parse(input));
			if (!isString(parsed.protocol)) throw new InvalidUrlError({ input });
		}
		return parsed;
	}
	function resolveUrl(relative, base) {
		// istanbul ignore next
		return useNativeURL ? new URL(relative, base) : parseUrl(url$1.resolve(base, relative));
	}
	function validateUrl(input) {
		if (/^\[/.test(input.hostname) && !/^\[[:0-9a-f]+\]$/i.test(input.hostname)) throw new InvalidUrlError({ input: input.href || input });
		if (/^\[/.test(input.host) && !/^\[[:0-9a-f]+\](:\d+)?$/i.test(input.host)) throw new InvalidUrlError({ input: input.href || input });
		return input;
	}
	function spreadUrlObject(urlObject, target) {
		var spread = target || {};
		for (var key of preservedUrlFields) spread[key] = urlObject[key];
		if (spread.hostname.startsWith("[")) spread.hostname = spread.hostname.slice(1, -1);
		if (spread.port !== "") spread.port = Number(spread.port);
		spread.path = spread.search ? spread.pathname + spread.search : spread.pathname;
		return spread;
	}
	function removeMatchingHeaders(regex, headers) {
		var lastValue;
		for (var header in headers) if (regex.test(header)) {
			lastValue = headers[header];
			delete headers[header];
		}
		return lastValue === null || typeof lastValue === "undefined" ? void 0 : String(lastValue).trim();
	}
	function createErrorType(code, message, baseClass) {
		function CustomError(properties) {
			// istanbul ignore else
			if (isFunction(Error.captureStackTrace)) Error.captureStackTrace(this, this.constructor);
			Object.assign(this, properties || {});
			this.code = code;
			this.message = this.cause ? message + ": " + this.cause.message : message;
		}
		CustomError.prototype = new (baseClass || Error)();
		Object.defineProperties(CustomError.prototype, {
			constructor: {
				value: CustomError,
				enumerable: false
			},
			name: {
				value: "Error [" + code + "]",
				enumerable: false
			}
		});
		return CustomError;
	}
	function destroyRequest(request, error) {
		for (var event of events) request.removeListener(event, eventHandlers[event]);
		request.on("error", noop);
		request.destroy(error);
	}
	function isSubdomain(subdomain, domain) {
		assert(isString(subdomain) && isString(domain));
		var dot = subdomain.length - domain.length - 1;
		return dot > 0 && subdomain[dot] === "." && subdomain.endsWith(domain);
	}
	function isString(value) {
		return typeof value === "string" || value instanceof String;
	}
	function isFunction(value) {
		return typeof value === "function";
	}
	function isBuffer(value) {
		return typeof value === "object" && "length" in value;
	}
	function isURL(value) {
		return URL && value instanceof URL;
	}
	module.exports = wrap({
		http: http$1,
		https: https$1
	});
	module.exports.wrap = wrap;
}));
//#endregion
//#region node_modules/axios/dist/node/axios.cjs
/*! Axios v1.15.0 Copyright (c) 2026 Matt Zabriskie and contributors */
var require_axios = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var FormData$1 = require_form_data();
	var crypto = __require("crypto");
	var url = __require("url");
	var http = __require("http");
	var https = __require("https");
	var http2 = __require("http2");
	var util = __require("util");
	var followRedirects = require_follow_redirects();
	var zlib = __require("zlib");
	var stream = __require("stream");
	var events = __require("events");
	/**
	* Create a bound version of a function with a specified `this` context
	*
	* @param {Function} fn - The function to bind
	* @param {*} thisArg - The value to be passed as the `this` parameter
	* @returns {Function} A new function that will call the original function with the specified `this` context
	*/
	function bind(fn, thisArg) {
		return function wrap() {
			return fn.apply(thisArg, arguments);
		};
	}
	const { toString } = Object.prototype;
	const { getPrototypeOf } = Object;
	const { iterator, toStringTag } = Symbol;
	const kindOf = ((cache) => (thing) => {
		const str = toString.call(thing);
		return cache[str] || (cache[str] = str.slice(8, -1).toLowerCase());
	})(Object.create(null));
	const kindOfTest = (type) => {
		type = type.toLowerCase();
		return (thing) => kindOf(thing) === type;
	};
	const typeOfTest = (type) => (thing) => typeof thing === type;
	/**
	* Determine if a value is a non-null object
	*
	* @param {Object} val The value to test
	*
	* @returns {boolean} True if value is an Array, otherwise false
	*/
	const { isArray } = Array;
	/**
	* Determine if a value is undefined
	*
	* @param {*} val The value to test
	*
	* @returns {boolean} True if the value is undefined, otherwise false
	*/
	const isUndefined = typeOfTest("undefined");
	/**
	* Determine if a value is a Buffer
	*
	* @param {*} val The value to test
	*
	* @returns {boolean} True if value is a Buffer, otherwise false
	*/
	function isBuffer(val) {
		return val !== null && !isUndefined(val) && val.constructor !== null && !isUndefined(val.constructor) && isFunction$1(val.constructor.isBuffer) && val.constructor.isBuffer(val);
	}
	/**
	* Determine if a value is an ArrayBuffer
	*
	* @param {*} val The value to test
	*
	* @returns {boolean} True if value is an ArrayBuffer, otherwise false
	*/
	const isArrayBuffer = kindOfTest("ArrayBuffer");
	/**
	* Determine if a value is a view on an ArrayBuffer
	*
	* @param {*} val The value to test
	*
	* @returns {boolean} True if value is a view on an ArrayBuffer, otherwise false
	*/
	function isArrayBufferView(val) {
		let result;
		if (typeof ArrayBuffer !== "undefined" && ArrayBuffer.isView) result = ArrayBuffer.isView(val);
		else result = val && val.buffer && isArrayBuffer(val.buffer);
		return result;
	}
	/**
	* Determine if a value is a String
	*
	* @param {*} val The value to test
	*
	* @returns {boolean} True if value is a String, otherwise false
	*/
	const isString = typeOfTest("string");
	/**
	* Determine if a value is a Function
	*
	* @param {*} val The value to test
	* @returns {boolean} True if value is a Function, otherwise false
	*/
	const isFunction$1 = typeOfTest("function");
	/**
	* Determine if a value is a Number
	*
	* @param {*} val The value to test
	*
	* @returns {boolean} True if value is a Number, otherwise false
	*/
	const isNumber = typeOfTest("number");
	/**
	* Determine if a value is an Object
	*
	* @param {*} thing The value to test
	*
	* @returns {boolean} True if value is an Object, otherwise false
	*/
	const isObject = (thing) => thing !== null && typeof thing === "object";
	/**
	* Determine if a value is a Boolean
	*
	* @param {*} thing The value to test
	* @returns {boolean} True if value is a Boolean, otherwise false
	*/
	const isBoolean = (thing) => thing === true || thing === false;
	/**
	* Determine if a value is a plain Object
	*
	* @param {*} val The value to test
	*
	* @returns {boolean} True if value is a plain Object, otherwise false
	*/
	const isPlainObject = (val) => {
		if (kindOf(val) !== "object") return false;
		const prototype = getPrototypeOf(val);
		return (prototype === null || prototype === Object.prototype || Object.getPrototypeOf(prototype) === null) && !(toStringTag in val) && !(iterator in val);
	};
	/**
	* Determine if a value is an empty object (safely handles Buffers)
	*
	* @param {*} val The value to test
	*
	* @returns {boolean} True if value is an empty object, otherwise false
	*/
	const isEmptyObject = (val) => {
		if (!isObject(val) || isBuffer(val)) return false;
		try {
			return Object.keys(val).length === 0 && Object.getPrototypeOf(val) === Object.prototype;
		} catch (e) {
			return false;
		}
	};
	/**
	* Determine if a value is a Date
	*
	* @param {*} val The value to test
	*
	* @returns {boolean} True if value is a Date, otherwise false
	*/
	const isDate = kindOfTest("Date");
	/**
	* Determine if a value is a File
	*
	* @param {*} val The value to test
	*
	* @returns {boolean} True if value is a File, otherwise false
	*/
	const isFile = kindOfTest("File");
	/**
	* Determine if a value is a React Native Blob
	* React Native "blob": an object with a `uri` attribute. Optionally, it can
	* also have a `name` and `type` attribute to specify filename and content type
	*
	* @see https://github.com/facebook/react-native/blob/26684cf3adf4094eb6c405d345a75bf8c7c0bf88/Libraries/Network/FormData.js#L68-L71
	* 
	* @param {*} value The value to test
	* 
	* @returns {boolean} True if value is a React Native Blob, otherwise false
	*/
	const isReactNativeBlob = (value) => {
		return !!(value && typeof value.uri !== "undefined");
	};
	/**
	* Determine if environment is React Native
	* ReactNative `FormData` has a non-standard `getParts()` method
	* 
	* @param {*} formData The formData to test
	* 
	* @returns {boolean} True if environment is React Native, otherwise false
	*/
	const isReactNative = (formData) => formData && typeof formData.getParts !== "undefined";
	/**
	* Determine if a value is a Blob
	*
	* @param {*} val The value to test
	*
	* @returns {boolean} True if value is a Blob, otherwise false
	*/
	const isBlob = kindOfTest("Blob");
	/**
	* Determine if a value is a FileList
	*
	* @param {*} val The value to test
	*
	* @returns {boolean} True if value is a File, otherwise false
	*/
	const isFileList = kindOfTest("FileList");
	/**
	* Determine if a value is a Stream
	*
	* @param {*} val The value to test
	*
	* @returns {boolean} True if value is a Stream, otherwise false
	*/
	const isStream = (val) => isObject(val) && isFunction$1(val.pipe);
	/**
	* Determine if a value is a FormData
	*
	* @param {*} thing The value to test
	*
	* @returns {boolean} True if value is an FormData, otherwise false
	*/
	function getGlobal() {
		if (typeof globalThis !== "undefined") return globalThis;
		if (typeof self !== "undefined") return self;
		if (typeof window !== "undefined") return window;
		if (typeof global !== "undefined") return global;
		return {};
	}
	const G = getGlobal();
	const FormDataCtor = typeof G.FormData !== "undefined" ? G.FormData : void 0;
	const isFormData = (thing) => {
		let kind;
		return thing && (FormDataCtor && thing instanceof FormDataCtor || isFunction$1(thing.append) && ((kind = kindOf(thing)) === "formdata" || kind === "object" && isFunction$1(thing.toString) && thing.toString() === "[object FormData]"));
	};
	/**
	* Determine if a value is a URLSearchParams object
	*
	* @param {*} val The value to test
	*
	* @returns {boolean} True if value is a URLSearchParams object, otherwise false
	*/
	const isURLSearchParams = kindOfTest("URLSearchParams");
	const [isReadableStream, isRequest, isResponse, isHeaders] = [
		"ReadableStream",
		"Request",
		"Response",
		"Headers"
	].map(kindOfTest);
	/**
	* Trim excess whitespace off the beginning and end of a string
	*
	* @param {String} str The String to trim
	*
	* @returns {String} The String freed of excess whitespace
	*/
	const trim = (str) => {
		return str.trim ? str.trim() : str.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, "");
	};
	/**
	* Iterate over an Array or an Object invoking a function for each item.
	*
	* If `obj` is an Array callback will be called passing
	* the value, index, and complete array for each item.
	*
	* If 'obj' is an Object callback will be called passing
	* the value, key, and complete object for each property.
	*
	* @param {Object|Array<unknown>} obj The object to iterate
	* @param {Function} fn The callback to invoke for each item
	*
	* @param {Object} [options]
	* @param {Boolean} [options.allOwnKeys = false]
	* @returns {any}
	*/
	function forEach(obj, fn, { allOwnKeys = false } = {}) {
		if (obj === null || typeof obj === "undefined") return;
		let i;
		let l;
		if (typeof obj !== "object") obj = [obj];
		if (isArray(obj)) for (i = 0, l = obj.length; i < l; i++) fn.call(null, obj[i], i, obj);
		else {
			if (isBuffer(obj)) return;
			const keys = allOwnKeys ? Object.getOwnPropertyNames(obj) : Object.keys(obj);
			const len = keys.length;
			let key;
			for (i = 0; i < len; i++) {
				key = keys[i];
				fn.call(null, obj[key], key, obj);
			}
		}
	}
	/**
	* Finds a key in an object, case-insensitive, returning the actual key name.
	* Returns null if the object is a Buffer or if no match is found.
	*
	* @param {Object} obj - The object to search.
	* @param {string} key - The key to find (case-insensitive).
	* @returns {?string} The actual key name if found, otherwise null.
	*/
	function findKey(obj, key) {
		if (isBuffer(obj)) return null;
		key = key.toLowerCase();
		const keys = Object.keys(obj);
		let i = keys.length;
		let _key;
		while (i-- > 0) {
			_key = keys[i];
			if (key === _key.toLowerCase()) return _key;
		}
		return null;
	}
	const _global = (() => {
		if (typeof globalThis !== "undefined") return globalThis;
		return typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : global;
	})();
	const isContextDefined = (context) => !isUndefined(context) && context !== _global;
	/**
	* Accepts varargs expecting each argument to be an object, then
	* immutably merges the properties of each object and returns result.
	*
	* When multiple objects contain the same key the later object in
	* the arguments list will take precedence.
	*
	* Example:
	*
	* ```js
	* const result = merge({foo: 123}, {foo: 456});
	* console.log(result.foo); // outputs 456
	* ```
	*
	* @param {Object} obj1 Object to merge
	*
	* @returns {Object} Result of all merge properties
	*/
	function merge() {
		const { caseless, skipUndefined } = isContextDefined(this) && this || {};
		const result = {};
		const assignValue = (val, key) => {
			if (key === "__proto__" || key === "constructor" || key === "prototype") return;
			const targetKey = caseless && findKey(result, key) || key;
			if (isPlainObject(result[targetKey]) && isPlainObject(val)) result[targetKey] = merge(result[targetKey], val);
			else if (isPlainObject(val)) result[targetKey] = merge({}, val);
			else if (isArray(val)) result[targetKey] = val.slice();
			else if (!skipUndefined || !isUndefined(val)) result[targetKey] = val;
		};
		for (let i = 0, l = arguments.length; i < l; i++) arguments[i] && forEach(arguments[i], assignValue);
		return result;
	}
	/**
	* Extends object a by mutably adding to it the properties of object b.
	*
	* @param {Object} a The object to be extended
	* @param {Object} b The object to copy properties from
	* @param {Object} thisArg The object to bind function to
	*
	* @param {Object} [options]
	* @param {Boolean} [options.allOwnKeys]
	* @returns {Object} The resulting value of object a
	*/
	const extend = (a, b, thisArg, { allOwnKeys } = {}) => {
		forEach(b, (val, key) => {
			if (thisArg && isFunction$1(val)) Object.defineProperty(a, key, {
				value: bind(val, thisArg),
				writable: true,
				enumerable: true,
				configurable: true
			});
			else Object.defineProperty(a, key, {
				value: val,
				writable: true,
				enumerable: true,
				configurable: true
			});
		}, { allOwnKeys });
		return a;
	};
	/**
	* Remove byte order marker. This catches EF BB BF (the UTF-8 BOM)
	*
	* @param {string} content with BOM
	*
	* @returns {string} content value without BOM
	*/
	const stripBOM = (content) => {
		if (content.charCodeAt(0) === 65279) content = content.slice(1);
		return content;
	};
	/**
	* Inherit the prototype methods from one constructor into another
	* @param {function} constructor
	* @param {function} superConstructor
	* @param {object} [props]
	* @param {object} [descriptors]
	*
	* @returns {void}
	*/
	const inherits = (constructor, superConstructor, props, descriptors) => {
		constructor.prototype = Object.create(superConstructor.prototype, descriptors);
		Object.defineProperty(constructor.prototype, "constructor", {
			value: constructor,
			writable: true,
			enumerable: false,
			configurable: true
		});
		Object.defineProperty(constructor, "super", { value: superConstructor.prototype });
		props && Object.assign(constructor.prototype, props);
	};
	/**
	* Resolve object with deep prototype chain to a flat object
	* @param {Object} sourceObj source object
	* @param {Object} [destObj]
	* @param {Function|Boolean} [filter]
	* @param {Function} [propFilter]
	*
	* @returns {Object}
	*/
	const toFlatObject = (sourceObj, destObj, filter, propFilter) => {
		let props;
		let i;
		let prop;
		const merged = {};
		destObj = destObj || {};
		if (sourceObj == null) return destObj;
		do {
			props = Object.getOwnPropertyNames(sourceObj);
			i = props.length;
			while (i-- > 0) {
				prop = props[i];
				if ((!propFilter || propFilter(prop, sourceObj, destObj)) && !merged[prop]) {
					destObj[prop] = sourceObj[prop];
					merged[prop] = true;
				}
			}
			sourceObj = filter !== false && getPrototypeOf(sourceObj);
		} while (sourceObj && (!filter || filter(sourceObj, destObj)) && sourceObj !== Object.prototype);
		return destObj;
	};
	/**
	* Determines whether a string ends with the characters of a specified string
	*
	* @param {String} str
	* @param {String} searchString
	* @param {Number} [position= 0]
	*
	* @returns {boolean}
	*/
	const endsWith = (str, searchString, position) => {
		str = String(str);
		if (position === void 0 || position > str.length) position = str.length;
		position -= searchString.length;
		const lastIndex = str.indexOf(searchString, position);
		return lastIndex !== -1 && lastIndex === position;
	};
	/**
	* Returns new array from array like object or null if failed
	*
	* @param {*} [thing]
	*
	* @returns {?Array}
	*/
	const toArray = (thing) => {
		if (!thing) return null;
		if (isArray(thing)) return thing;
		let i = thing.length;
		if (!isNumber(i)) return null;
		const arr = new Array(i);
		while (i-- > 0) arr[i] = thing[i];
		return arr;
	};
	/**
	* Checking if the Uint8Array exists and if it does, it returns a function that checks if the
	* thing passed in is an instance of Uint8Array
	*
	* @param {TypedArray}
	*
	* @returns {Array}
	*/
	const isTypedArray = ((TypedArray) => {
		return (thing) => {
			return TypedArray && thing instanceof TypedArray;
		};
	})(typeof Uint8Array !== "undefined" && getPrototypeOf(Uint8Array));
	/**
	* For each entry in the object, call the function with the key and value.
	*
	* @param {Object<any, any>} obj - The object to iterate over.
	* @param {Function} fn - The function to call for each entry.
	*
	* @returns {void}
	*/
	const forEachEntry = (obj, fn) => {
		const _iterator = (obj && obj[iterator]).call(obj);
		let result;
		while ((result = _iterator.next()) && !result.done) {
			const pair = result.value;
			fn.call(obj, pair[0], pair[1]);
		}
	};
	/**
	* It takes a regular expression and a string, and returns an array of all the matches
	*
	* @param {string} regExp - The regular expression to match against.
	* @param {string} str - The string to search.
	*
	* @returns {Array<boolean>}
	*/
	const matchAll = (regExp, str) => {
		let matches;
		const arr = [];
		while ((matches = regExp.exec(str)) !== null) arr.push(matches);
		return arr;
	};
	const isHTMLForm = kindOfTest("HTMLFormElement");
	const toCamelCase = (str) => {
		return str.toLowerCase().replace(/[-_\s]([a-z\d])(\w*)/g, function replacer(m, p1, p2) {
			return p1.toUpperCase() + p2;
		});
	};
	const hasOwnProperty = (({ hasOwnProperty }) => (obj, prop) => hasOwnProperty.call(obj, prop))(Object.prototype);
	/**
	* Determine if a value is a RegExp object
	*
	* @param {*} val The value to test
	*
	* @returns {boolean} True if value is a RegExp object, otherwise false
	*/
	const isRegExp = kindOfTest("RegExp");
	const reduceDescriptors = (obj, reducer) => {
		const descriptors = Object.getOwnPropertyDescriptors(obj);
		const reducedDescriptors = {};
		forEach(descriptors, (descriptor, name) => {
			let ret;
			if ((ret = reducer(descriptor, name, obj)) !== false) reducedDescriptors[name] = ret || descriptor;
		});
		Object.defineProperties(obj, reducedDescriptors);
	};
	/**
	* Makes all methods read-only
	* @param {Object} obj
	*/
	const freezeMethods = (obj) => {
		reduceDescriptors(obj, (descriptor, name) => {
			if (isFunction$1(obj) && [
				"arguments",
				"caller",
				"callee"
			].indexOf(name) !== -1) return false;
			const value = obj[name];
			if (!isFunction$1(value)) return;
			descriptor.enumerable = false;
			if ("writable" in descriptor) {
				descriptor.writable = false;
				return;
			}
			if (!descriptor.set) descriptor.set = () => {
				throw Error("Can not rewrite read-only method '" + name + "'");
			};
		});
	};
	/**
	* Converts an array or a delimited string into an object set with values as keys and true as values.
	* Useful for fast membership checks.
	*
	* @param {Array|string} arrayOrString - The array or string to convert.
	* @param {string} delimiter - The delimiter to use if input is a string.
	* @returns {Object} An object with keys from the array or string, values set to true.
	*/
	const toObjectSet = (arrayOrString, delimiter) => {
		const obj = {};
		const define = (arr) => {
			arr.forEach((value) => {
				obj[value] = true;
			});
		};
		isArray(arrayOrString) ? define(arrayOrString) : define(String(arrayOrString).split(delimiter));
		return obj;
	};
	const noop = () => {};
	const toFiniteNumber = (value, defaultValue) => {
		return value != null && Number.isFinite(value = +value) ? value : defaultValue;
	};
	/**
	* If the thing is a FormData object, return true, otherwise return false.
	*
	* @param {unknown} thing - The thing to check.
	*
	* @returns {boolean}
	*/
	function isSpecCompliantForm(thing) {
		return !!(thing && isFunction$1(thing.append) && thing[toStringTag] === "FormData" && thing[iterator]);
	}
	/**
	* Recursively converts an object to a JSON-compatible object, handling circular references and Buffers.
	*
	* @param {Object} obj - The object to convert.
	* @returns {Object} The JSON-compatible object.
	*/
	const toJSONObject = (obj) => {
		const stack = new Array(10);
		const visit = (source, i) => {
			if (isObject(source)) {
				if (stack.indexOf(source) >= 0) return;
				if (isBuffer(source)) return source;
				if (!("toJSON" in source)) {
					stack[i] = source;
					const target = isArray(source) ? [] : {};
					forEach(source, (value, key) => {
						const reducedValue = visit(value, i + 1);
						!isUndefined(reducedValue) && (target[key] = reducedValue);
					});
					stack[i] = void 0;
					return target;
				}
			}
			return source;
		};
		return visit(obj, 0);
	};
	/**
	* Determines if a value is an async function.
	*
	* @param {*} thing - The value to test.
	* @returns {boolean} True if value is an async function, otherwise false.
	*/
	const isAsyncFn = kindOfTest("AsyncFunction");
	/**
	* Determines if a value is thenable (has then and catch methods).
	*
	* @param {*} thing - The value to test.
	* @returns {boolean} True if value is thenable, otherwise false.
	*/
	const isThenable = (thing) => thing && (isObject(thing) || isFunction$1(thing)) && isFunction$1(thing.then) && isFunction$1(thing.catch);
	/**
	* Provides a cross-platform setImmediate implementation.
	* Uses native setImmediate if available, otherwise falls back to postMessage or setTimeout.
	*
	* @param {boolean} setImmediateSupported - Whether setImmediate is supported.
	* @param {boolean} postMessageSupported - Whether postMessage is supported.
	* @returns {Function} A function to schedule a callback asynchronously.
	*/
	const _setImmediate = ((setImmediateSupported, postMessageSupported) => {
		if (setImmediateSupported) return setImmediate;
		return postMessageSupported ? ((token, callbacks) => {
			_global.addEventListener("message", ({ source, data }) => {
				if (source === _global && data === token) callbacks.length && callbacks.shift()();
			}, false);
			return (cb) => {
				callbacks.push(cb);
				_global.postMessage(token, "*");
			};
		})(`axios@${Math.random()}`, []) : (cb) => setTimeout(cb);
	})(typeof setImmediate === "function", isFunction$1(_global.postMessage));
	/**
	* Schedules a microtask or asynchronous callback as soon as possible.
	* Uses queueMicrotask if available, otherwise falls back to process.nextTick or _setImmediate.
	*
	* @type {Function}
	*/
	const asap = typeof queueMicrotask !== "undefined" ? queueMicrotask.bind(_global) : typeof process !== "undefined" && process.nextTick || _setImmediate;
	const isIterable = (thing) => thing != null && isFunction$1(thing[iterator]);
	var utils$1 = {
		isArray,
		isArrayBuffer,
		isBuffer,
		isFormData,
		isArrayBufferView,
		isString,
		isNumber,
		isBoolean,
		isObject,
		isPlainObject,
		isEmptyObject,
		isReadableStream,
		isRequest,
		isResponse,
		isHeaders,
		isUndefined,
		isDate,
		isFile,
		isReactNativeBlob,
		isReactNative,
		isBlob,
		isRegExp,
		isFunction: isFunction$1,
		isStream,
		isURLSearchParams,
		isTypedArray,
		isFileList,
		forEach,
		merge,
		extend,
		trim,
		stripBOM,
		inherits,
		toFlatObject,
		kindOf,
		kindOfTest,
		endsWith,
		toArray,
		forEachEntry,
		matchAll,
		isHTMLForm,
		hasOwnProperty,
		hasOwnProp: hasOwnProperty,
		reduceDescriptors,
		freezeMethods,
		toObjectSet,
		toCamelCase,
		noop,
		toFiniteNumber,
		findKey,
		global: _global,
		isContextDefined,
		isSpecCompliantForm,
		toJSONObject,
		isAsyncFn,
		isThenable,
		setImmediate: _setImmediate,
		asap,
		isIterable
	};
	var AxiosError = class AxiosError extends Error {
		static from(error, code, config, request, response, customProps) {
			const axiosError = new AxiosError(error.message, code || error.code, config, request, response);
			axiosError.cause = error;
			axiosError.name = error.name;
			if (error.status != null && axiosError.status == null) axiosError.status = error.status;
			customProps && Object.assign(axiosError, customProps);
			return axiosError;
		}
		/**
		* Create an Error with the specified message, config, error code, request and response.
		*
		* @param {string} message The error message.
		* @param {string} [code] The error code (for example, 'ECONNABORTED').
		* @param {Object} [config] The config.
		* @param {Object} [request] The request.
		* @param {Object} [response] The response.
		*
		* @returns {Error} The created error.
		*/
		constructor(message, code, config, request, response) {
			super(message);
			Object.defineProperty(this, "message", {
				value: message,
				enumerable: true,
				writable: true,
				configurable: true
			});
			this.name = "AxiosError";
			this.isAxiosError = true;
			code && (this.code = code);
			config && (this.config = config);
			request && (this.request = request);
			if (response) {
				this.response = response;
				this.status = response.status;
			}
		}
		toJSON() {
			return {
				message: this.message,
				name: this.name,
				description: this.description,
				number: this.number,
				fileName: this.fileName,
				lineNumber: this.lineNumber,
				columnNumber: this.columnNumber,
				stack: this.stack,
				config: utils$1.toJSONObject(this.config),
				code: this.code,
				status: this.status
			};
		}
	};
	AxiosError.ERR_BAD_OPTION_VALUE = "ERR_BAD_OPTION_VALUE";
	AxiosError.ERR_BAD_OPTION = "ERR_BAD_OPTION";
	AxiosError.ECONNABORTED = "ECONNABORTED";
	AxiosError.ETIMEDOUT = "ETIMEDOUT";
	AxiosError.ERR_NETWORK = "ERR_NETWORK";
	AxiosError.ERR_FR_TOO_MANY_REDIRECTS = "ERR_FR_TOO_MANY_REDIRECTS";
	AxiosError.ERR_DEPRECATED = "ERR_DEPRECATED";
	AxiosError.ERR_BAD_RESPONSE = "ERR_BAD_RESPONSE";
	AxiosError.ERR_BAD_REQUEST = "ERR_BAD_REQUEST";
	AxiosError.ERR_CANCELED = "ERR_CANCELED";
	AxiosError.ERR_NOT_SUPPORT = "ERR_NOT_SUPPORT";
	AxiosError.ERR_INVALID_URL = "ERR_INVALID_URL";
	/**
	* Determines if the given thing is a array or js object.
	*
	* @param {string} thing - The object or array to be visited.
	*
	* @returns {boolean}
	*/
	function isVisitable(thing) {
		return utils$1.isPlainObject(thing) || utils$1.isArray(thing);
	}
	/**
	* It removes the brackets from the end of a string
	*
	* @param {string} key - The key of the parameter.
	*
	* @returns {string} the key without the brackets.
	*/
	function removeBrackets(key) {
		return utils$1.endsWith(key, "[]") ? key.slice(0, -2) : key;
	}
	/**
	* It takes a path, a key, and a boolean, and returns a string
	*
	* @param {string} path - The path to the current key.
	* @param {string} key - The key of the current object being iterated over.
	* @param {string} dots - If true, the key will be rendered with dots instead of brackets.
	*
	* @returns {string} The path to the current key.
	*/
	function renderKey(path, key, dots) {
		if (!path) return key;
		return path.concat(key).map(function each(token, i) {
			token = removeBrackets(token);
			return !dots && i ? "[" + token + "]" : token;
		}).join(dots ? "." : "");
	}
	/**
	* If the array is an array and none of its elements are visitable, then it's a flat array.
	*
	* @param {Array<any>} arr - The array to check
	*
	* @returns {boolean}
	*/
	function isFlatArray(arr) {
		return utils$1.isArray(arr) && !arr.some(isVisitable);
	}
	const predicates = utils$1.toFlatObject(utils$1, {}, null, function filter(prop) {
		return /^is[A-Z]/.test(prop);
	});
	/**
	* Convert a data object to FormData
	*
	* @param {Object} obj
	* @param {?Object} [formData]
	* @param {?Object} [options]
	* @param {Function} [options.visitor]
	* @param {Boolean} [options.metaTokens = true]
	* @param {Boolean} [options.dots = false]
	* @param {?Boolean} [options.indexes = false]
	*
	* @returns {Object}
	**/
	/**
	* It converts an object into a FormData object
	*
	* @param {Object<any, any>} obj - The object to convert to form data.
	* @param {string} formData - The FormData object to append to.
	* @param {Object<string, any>} options
	*
	* @returns
	*/
	function toFormData(obj, formData, options) {
		if (!utils$1.isObject(obj)) throw new TypeError("target must be an object");
		formData = formData || new (FormData$1 || FormData)();
		options = utils$1.toFlatObject(options, {
			metaTokens: true,
			dots: false,
			indexes: false
		}, false, function defined(option, source) {
			return !utils$1.isUndefined(source[option]);
		});
		const metaTokens = options.metaTokens;
		const visitor = options.visitor || defaultVisitor;
		const dots = options.dots;
		const indexes = options.indexes;
		const useBlob = (options.Blob || typeof Blob !== "undefined" && Blob) && utils$1.isSpecCompliantForm(formData);
		if (!utils$1.isFunction(visitor)) throw new TypeError("visitor must be a function");
		function convertValue(value) {
			if (value === null) return "";
			if (utils$1.isDate(value)) return value.toISOString();
			if (utils$1.isBoolean(value)) return value.toString();
			if (!useBlob && utils$1.isBlob(value)) throw new AxiosError("Blob is not supported. Use a Buffer instead.");
			if (utils$1.isArrayBuffer(value) || utils$1.isTypedArray(value)) return useBlob && typeof Blob === "function" ? new Blob([value]) : Buffer.from(value);
			return value;
		}
		/**
		* Default visitor.
		*
		* @param {*} value
		* @param {String|Number} key
		* @param {Array<String|Number>} path
		* @this {FormData}
		*
		* @returns {boolean} return true to visit the each prop of the value recursively
		*/
		function defaultVisitor(value, key, path) {
			let arr = value;
			if (utils$1.isReactNative(formData) && utils$1.isReactNativeBlob(value)) {
				formData.append(renderKey(path, key, dots), convertValue(value));
				return false;
			}
			if (value && !path && typeof value === "object") {
				if (utils$1.endsWith(key, "{}")) {
					key = metaTokens ? key : key.slice(0, -2);
					value = JSON.stringify(value);
				} else if (utils$1.isArray(value) && isFlatArray(value) || (utils$1.isFileList(value) || utils$1.endsWith(key, "[]")) && (arr = utils$1.toArray(value))) {
					key = removeBrackets(key);
					arr.forEach(function each(el, index) {
						!(utils$1.isUndefined(el) || el === null) && formData.append(indexes === true ? renderKey([key], index, dots) : indexes === null ? key : key + "[]", convertValue(el));
					});
					return false;
				}
			}
			if (isVisitable(value)) return true;
			formData.append(renderKey(path, key, dots), convertValue(value));
			return false;
		}
		const stack = [];
		const exposedHelpers = Object.assign(predicates, {
			defaultVisitor,
			convertValue,
			isVisitable
		});
		function build(value, path) {
			if (utils$1.isUndefined(value)) return;
			if (stack.indexOf(value) !== -1) throw Error("Circular reference detected in " + path.join("."));
			stack.push(value);
			utils$1.forEach(value, function each(el, key) {
				if ((!(utils$1.isUndefined(el) || el === null) && visitor.call(formData, el, utils$1.isString(key) ? key.trim() : key, path, exposedHelpers)) === true) build(el, path ? path.concat(key) : [key]);
			});
			stack.pop();
		}
		if (!utils$1.isObject(obj)) throw new TypeError("data must be an object");
		build(obj);
		return formData;
	}
	/**
	* It encodes a string by replacing all characters that are not in the unreserved set with
	* their percent-encoded equivalents
	*
	* @param {string} str - The string to encode.
	*
	* @returns {string} The encoded string.
	*/
	function encode$1(str) {
		const charMap = {
			"!": "%21",
			"'": "%27",
			"(": "%28",
			")": "%29",
			"~": "%7E",
			"%20": "+",
			"%00": "\0"
		};
		return encodeURIComponent(str).replace(/[!'()~]|%20|%00/g, function replacer(match) {
			return charMap[match];
		});
	}
	/**
	* It takes a params object and converts it to a FormData object
	*
	* @param {Object<string, any>} params - The parameters to be converted to a FormData object.
	* @param {Object<string, any>} options - The options object passed to the Axios constructor.
	*
	* @returns {void}
	*/
	function AxiosURLSearchParams(params, options) {
		this._pairs = [];
		params && toFormData(params, this, options);
	}
	const prototype = AxiosURLSearchParams.prototype;
	prototype.append = function append(name, value) {
		this._pairs.push([name, value]);
	};
	prototype.toString = function toString(encoder) {
		const _encode = encoder ? function(value) {
			return encoder.call(this, value, encode$1);
		} : encode$1;
		return this._pairs.map(function each(pair) {
			return _encode(pair[0]) + "=" + _encode(pair[1]);
		}, "").join("&");
	};
	/**
	* It replaces URL-encoded forms of `:`, `$`, `,`, and spaces with
	* their plain counterparts (`:`, `$`, `,`, `+`).
	*
	* @param {string} val The value to be encoded.
	*
	* @returns {string} The encoded value.
	*/
	function encode(val) {
		return encodeURIComponent(val).replace(/%3A/gi, ":").replace(/%24/g, "$").replace(/%2C/gi, ",").replace(/%20/g, "+");
	}
	/**
	* Build a URL by appending params to the end
	*
	* @param {string} url The base of the url (e.g., http://www.google.com)
	* @param {object} [params] The params to be appended
	* @param {?(object|Function)} options
	*
	* @returns {string} The formatted url
	*/
	function buildURL(url, params, options) {
		if (!params) return url;
		const _encode = options && options.encode || encode;
		const _options = utils$1.isFunction(options) ? { serialize: options } : options;
		const serializeFn = _options && _options.serialize;
		let serializedParams;
		if (serializeFn) serializedParams = serializeFn(params, _options);
		else serializedParams = utils$1.isURLSearchParams(params) ? params.toString() : new AxiosURLSearchParams(params, _options).toString(_encode);
		if (serializedParams) {
			const hashmarkIndex = url.indexOf("#");
			if (hashmarkIndex !== -1) url = url.slice(0, hashmarkIndex);
			url += (url.indexOf("?") === -1 ? "?" : "&") + serializedParams;
		}
		return url;
	}
	var InterceptorManager = class {
		constructor() {
			this.handlers = [];
		}
		/**
		* Add a new interceptor to the stack
		*
		* @param {Function} fulfilled The function to handle `then` for a `Promise`
		* @param {Function} rejected The function to handle `reject` for a `Promise`
		* @param {Object} options The options for the interceptor, synchronous and runWhen
		*
		* @return {Number} An ID used to remove interceptor later
		*/
		use(fulfilled, rejected, options) {
			this.handlers.push({
				fulfilled,
				rejected,
				synchronous: options ? options.synchronous : false,
				runWhen: options ? options.runWhen : null
			});
			return this.handlers.length - 1;
		}
		/**
		* Remove an interceptor from the stack
		*
		* @param {Number} id The ID that was returned by `use`
		*
		* @returns {void}
		*/
		eject(id) {
			if (this.handlers[id]) this.handlers[id] = null;
		}
		/**
		* Clear all interceptors from the stack
		*
		* @returns {void}
		*/
		clear() {
			if (this.handlers) this.handlers = [];
		}
		/**
		* Iterate over all the registered interceptors
		*
		* This method is particularly useful for skipping over any
		* interceptors that may have become `null` calling `eject`.
		*
		* @param {Function} fn The function to call for each interceptor
		*
		* @returns {void}
		*/
		forEach(fn) {
			utils$1.forEach(this.handlers, function forEachHandler(h) {
				if (h !== null) fn(h);
			});
		}
	};
	var transitionalDefaults = {
		silentJSONParsing: true,
		forcedJSONParsing: true,
		clarifyTimeoutError: false,
		legacyInterceptorReqResOrdering: true
	};
	var URLSearchParams = url.URLSearchParams;
	const ALPHA = "abcdefghijklmnopqrstuvwxyz";
	const DIGIT = "0123456789";
	const ALPHABET = {
		DIGIT,
		ALPHA,
		ALPHA_DIGIT: ALPHA + ALPHA.toUpperCase() + DIGIT
	};
	const generateString = (size = 16, alphabet = ALPHABET.ALPHA_DIGIT) => {
		let str = "";
		const { length } = alphabet;
		const randomValues = new Uint32Array(size);
		crypto.randomFillSync(randomValues);
		for (let i = 0; i < size; i++) str += alphabet[randomValues[i] % length];
		return str;
	};
	var platform$1 = {
		isNode: true,
		classes: {
			URLSearchParams,
			FormData: FormData$1,
			Blob: typeof Blob !== "undefined" && Blob || null
		},
		ALPHABET,
		generateString,
		protocols: [
			"http",
			"https",
			"file",
			"data"
		]
	};
	const hasBrowserEnv = typeof window !== "undefined" && typeof document !== "undefined";
	const _navigator = typeof navigator === "object" && navigator || void 0;
	/**
	* Determine if we're running in a standard browser environment
	*
	* This allows axios to run in a web worker, and react-native.
	* Both environments support XMLHttpRequest, but not fully standard globals.
	*
	* web workers:
	*  typeof window -> undefined
	*  typeof document -> undefined
	*
	* react-native:
	*  navigator.product -> 'ReactNative'
	* nativescript
	*  navigator.product -> 'NativeScript' or 'NS'
	*
	* @returns {boolean}
	*/
	const hasStandardBrowserEnv = hasBrowserEnv && (!_navigator || [
		"ReactNative",
		"NativeScript",
		"NS"
	].indexOf(_navigator.product) < 0);
	/**
	* Determine if we're running in a standard browser webWorker environment
	*
	* Although the `isStandardBrowserEnv` method indicates that
	* `allows axios to run in a web worker`, the WebWorker will still be
	* filtered out due to its judgment standard
	* `typeof window !== 'undefined' && typeof document !== 'undefined'`.
	* This leads to a problem when axios post `FormData` in webWorker
	*/
	const hasStandardBrowserWebWorkerEnv = (() => {
		return typeof WorkerGlobalScope !== "undefined" && self instanceof WorkerGlobalScope && typeof self.importScripts === "function";
	})();
	const origin = hasBrowserEnv && window.location.href || "http://localhost";
	var platform = {
		.../* @__PURE__ */ Object.freeze({
			__proto__: null,
			hasBrowserEnv,
			hasStandardBrowserEnv,
			hasStandardBrowserWebWorkerEnv,
			navigator: _navigator,
			origin
		}),
		...platform$1
	};
	function toURLEncodedForm(data, options) {
		return toFormData(data, new platform.classes.URLSearchParams(), {
			visitor: function(value, key, path, helpers) {
				if (platform.isNode && utils$1.isBuffer(value)) {
					this.append(key, value.toString("base64"));
					return false;
				}
				return helpers.defaultVisitor.apply(this, arguments);
			},
			...options
		});
	}
	/**
	* It takes a string like `foo[x][y][z]` and returns an array like `['foo', 'x', 'y', 'z']
	*
	* @param {string} name - The name of the property to get.
	*
	* @returns An array of strings.
	*/
	function parsePropPath(name) {
		return utils$1.matchAll(/\w+|\[(\w*)]/g, name).map((match) => {
			return match[0] === "[]" ? "" : match[1] || match[0];
		});
	}
	/**
	* Convert an array to an object.
	*
	* @param {Array<any>} arr - The array to convert to an object.
	*
	* @returns An object with the same keys and values as the array.
	*/
	function arrayToObject(arr) {
		const obj = {};
		const keys = Object.keys(arr);
		let i;
		const len = keys.length;
		let key;
		for (i = 0; i < len; i++) {
			key = keys[i];
			obj[key] = arr[key];
		}
		return obj;
	}
	/**
	* It takes a FormData object and returns a JavaScript object
	*
	* @param {string} formData The FormData object to convert to JSON.
	*
	* @returns {Object<string, any> | null} The converted object.
	*/
	function formDataToJSON(formData) {
		function buildPath(path, value, target, index) {
			let name = path[index++];
			if (name === "__proto__") return true;
			const isNumericKey = Number.isFinite(+name);
			const isLast = index >= path.length;
			name = !name && utils$1.isArray(target) ? target.length : name;
			if (isLast) {
				if (utils$1.hasOwnProp(target, name)) target[name] = [target[name], value];
				else target[name] = value;
				return !isNumericKey;
			}
			if (!target[name] || !utils$1.isObject(target[name])) target[name] = [];
			if (buildPath(path, value, target[name], index) && utils$1.isArray(target[name])) target[name] = arrayToObject(target[name]);
			return !isNumericKey;
		}
		if (utils$1.isFormData(formData) && utils$1.isFunction(formData.entries)) {
			const obj = {};
			utils$1.forEachEntry(formData, (name, value) => {
				buildPath(parsePropPath(name), value, obj, 0);
			});
			return obj;
		}
		return null;
	}
	/**
	* It takes a string, tries to parse it, and if it fails, it returns the stringified version
	* of the input
	*
	* @param {any} rawValue - The value to be stringified.
	* @param {Function} parser - A function that parses a string into a JavaScript object.
	* @param {Function} encoder - A function that takes a value and returns a string.
	*
	* @returns {string} A stringified version of the rawValue.
	*/
	function stringifySafely(rawValue, parser, encoder) {
		if (utils$1.isString(rawValue)) try {
			(parser || JSON.parse)(rawValue);
			return utils$1.trim(rawValue);
		} catch (e) {
			if (e.name !== "SyntaxError") throw e;
		}
		return (encoder || JSON.stringify)(rawValue);
	}
	const defaults = {
		transitional: transitionalDefaults,
		adapter: [
			"xhr",
			"http",
			"fetch"
		],
		transformRequest: [function transformRequest(data, headers) {
			const contentType = headers.getContentType() || "";
			const hasJSONContentType = contentType.indexOf("application/json") > -1;
			const isObjectPayload = utils$1.isObject(data);
			if (isObjectPayload && utils$1.isHTMLForm(data)) data = new FormData(data);
			if (utils$1.isFormData(data)) return hasJSONContentType ? JSON.stringify(formDataToJSON(data)) : data;
			if (utils$1.isArrayBuffer(data) || utils$1.isBuffer(data) || utils$1.isStream(data) || utils$1.isFile(data) || utils$1.isBlob(data) || utils$1.isReadableStream(data)) return data;
			if (utils$1.isArrayBufferView(data)) return data.buffer;
			if (utils$1.isURLSearchParams(data)) {
				headers.setContentType("application/x-www-form-urlencoded;charset=utf-8", false);
				return data.toString();
			}
			let isFileList;
			if (isObjectPayload) {
				if (contentType.indexOf("application/x-www-form-urlencoded") > -1) return toURLEncodedForm(data, this.formSerializer).toString();
				if ((isFileList = utils$1.isFileList(data)) || contentType.indexOf("multipart/form-data") > -1) {
					const _FormData = this.env && this.env.FormData;
					return toFormData(isFileList ? { "files[]": data } : data, _FormData && new _FormData(), this.formSerializer);
				}
			}
			if (isObjectPayload || hasJSONContentType) {
				headers.setContentType("application/json", false);
				return stringifySafely(data);
			}
			return data;
		}],
		transformResponse: [function transformResponse(data) {
			const transitional = this.transitional || defaults.transitional;
			const forcedJSONParsing = transitional && transitional.forcedJSONParsing;
			const JSONRequested = this.responseType === "json";
			if (utils$1.isResponse(data) || utils$1.isReadableStream(data)) return data;
			if (data && utils$1.isString(data) && (forcedJSONParsing && !this.responseType || JSONRequested)) {
				const strictJSONParsing = !(transitional && transitional.silentJSONParsing) && JSONRequested;
				try {
					return JSON.parse(data, this.parseReviver);
				} catch (e) {
					if (strictJSONParsing) {
						if (e.name === "SyntaxError") throw AxiosError.from(e, AxiosError.ERR_BAD_RESPONSE, this, null, this.response);
						throw e;
					}
				}
			}
			return data;
		}],
		/**
		* A timeout in milliseconds to abort a request. If set to 0 (default) a
		* timeout is not created.
		*/
		timeout: 0,
		xsrfCookieName: "XSRF-TOKEN",
		xsrfHeaderName: "X-XSRF-TOKEN",
		maxContentLength: -1,
		maxBodyLength: -1,
		env: {
			FormData: platform.classes.FormData,
			Blob: platform.classes.Blob
		},
		validateStatus: function validateStatus(status) {
			return status >= 200 && status < 300;
		},
		headers: { common: {
			Accept: "application/json, text/plain, */*",
			"Content-Type": void 0
		} }
	};
	utils$1.forEach([
		"delete",
		"get",
		"head",
		"post",
		"put",
		"patch"
	], (method) => {
		defaults.headers[method] = {};
	});
	const ignoreDuplicateOf = utils$1.toObjectSet([
		"age",
		"authorization",
		"content-length",
		"content-type",
		"etag",
		"expires",
		"from",
		"host",
		"if-modified-since",
		"if-unmodified-since",
		"last-modified",
		"location",
		"max-forwards",
		"proxy-authorization",
		"referer",
		"retry-after",
		"user-agent"
	]);
	/**
	* Parse headers into an object
	*
	* ```
	* Date: Wed, 27 Aug 2014 08:58:49 GMT
	* Content-Type: application/json
	* Connection: keep-alive
	* Transfer-Encoding: chunked
	* ```
	*
	* @param {String} rawHeaders Headers needing to be parsed
	*
	* @returns {Object} Headers parsed into an object
	*/
	var parseHeaders = (rawHeaders) => {
		const parsed = {};
		let key;
		let val;
		let i;
		rawHeaders && rawHeaders.split("\n").forEach(function parser(line) {
			i = line.indexOf(":");
			key = line.substring(0, i).trim().toLowerCase();
			val = line.substring(i + 1).trim();
			if (!key || parsed[key] && ignoreDuplicateOf[key]) return;
			if (key === "set-cookie") if (parsed[key]) parsed[key].push(val);
			else parsed[key] = [val];
			else parsed[key] = parsed[key] ? parsed[key] + ", " + val : val;
		});
		return parsed;
	};
	const $internals = Symbol("internals");
	const isValidHeaderValue = (value) => !/[\r\n]/.test(value);
	function assertValidHeaderValue(value, header) {
		if (value === false || value == null) return;
		if (utils$1.isArray(value)) {
			value.forEach((v) => assertValidHeaderValue(v, header));
			return;
		}
		if (!isValidHeaderValue(String(value))) throw new Error(`Invalid character in header content ["${header}"]`);
	}
	function normalizeHeader(header) {
		return header && String(header).trim().toLowerCase();
	}
	function stripTrailingCRLF(str) {
		let end = str.length;
		while (end > 0) {
			const charCode = str.charCodeAt(end - 1);
			if (charCode !== 10 && charCode !== 13) break;
			end -= 1;
		}
		return end === str.length ? str : str.slice(0, end);
	}
	function normalizeValue(value) {
		if (value === false || value == null) return value;
		return utils$1.isArray(value) ? value.map(normalizeValue) : stripTrailingCRLF(String(value));
	}
	function parseTokens(str) {
		const tokens = Object.create(null);
		const tokensRE = /([^\s,;=]+)\s*(?:=\s*([^,;]+))?/g;
		let match;
		while (match = tokensRE.exec(str)) tokens[match[1]] = match[2];
		return tokens;
	}
	const isValidHeaderName = (str) => /^[-_a-zA-Z0-9^`|~,!#$%&'*+.]+$/.test(str.trim());
	function matchHeaderValue(context, value, header, filter, isHeaderNameFilter) {
		if (utils$1.isFunction(filter)) return filter.call(this, value, header);
		if (isHeaderNameFilter) value = header;
		if (!utils$1.isString(value)) return;
		if (utils$1.isString(filter)) return value.indexOf(filter) !== -1;
		if (utils$1.isRegExp(filter)) return filter.test(value);
	}
	function formatHeader(header) {
		return header.trim().toLowerCase().replace(/([a-z\d])(\w*)/g, (w, char, str) => {
			return char.toUpperCase() + str;
		});
	}
	function buildAccessors(obj, header) {
		const accessorName = utils$1.toCamelCase(" " + header);
		[
			"get",
			"set",
			"has"
		].forEach((methodName) => {
			Object.defineProperty(obj, methodName + accessorName, {
				value: function(arg1, arg2, arg3) {
					return this[methodName].call(this, header, arg1, arg2, arg3);
				},
				configurable: true
			});
		});
	}
	var AxiosHeaders = class {
		constructor(headers) {
			headers && this.set(headers);
		}
		set(header, valueOrRewrite, rewrite) {
			const self = this;
			function setHeader(_value, _header, _rewrite) {
				const lHeader = normalizeHeader(_header);
				if (!lHeader) throw new Error("header name must be a non-empty string");
				const key = utils$1.findKey(self, lHeader);
				if (!key || self[key] === void 0 || _rewrite === true || _rewrite === void 0 && self[key] !== false) {
					assertValidHeaderValue(_value, _header);
					self[key || _header] = normalizeValue(_value);
				}
			}
			const setHeaders = (headers, _rewrite) => utils$1.forEach(headers, (_value, _header) => setHeader(_value, _header, _rewrite));
			if (utils$1.isPlainObject(header) || header instanceof this.constructor) setHeaders(header, valueOrRewrite);
			else if (utils$1.isString(header) && (header = header.trim()) && !isValidHeaderName(header)) setHeaders(parseHeaders(header), valueOrRewrite);
			else if (utils$1.isObject(header) && utils$1.isIterable(header)) {
				let obj = {}, dest, key;
				for (const entry of header) {
					if (!utils$1.isArray(entry)) throw TypeError("Object iterator must return a key-value pair");
					obj[key = entry[0]] = (dest = obj[key]) ? utils$1.isArray(dest) ? [...dest, entry[1]] : [dest, entry[1]] : entry[1];
				}
				setHeaders(obj, valueOrRewrite);
			} else header != null && setHeader(valueOrRewrite, header, rewrite);
			return this;
		}
		get(header, parser) {
			header = normalizeHeader(header);
			if (header) {
				const key = utils$1.findKey(this, header);
				if (key) {
					const value = this[key];
					if (!parser) return value;
					if (parser === true) return parseTokens(value);
					if (utils$1.isFunction(parser)) return parser.call(this, value, key);
					if (utils$1.isRegExp(parser)) return parser.exec(value);
					throw new TypeError("parser must be boolean|regexp|function");
				}
			}
		}
		has(header, matcher) {
			header = normalizeHeader(header);
			if (header) {
				const key = utils$1.findKey(this, header);
				return !!(key && this[key] !== void 0 && (!matcher || matchHeaderValue(this, this[key], key, matcher)));
			}
			return false;
		}
		delete(header, matcher) {
			const self = this;
			let deleted = false;
			function deleteHeader(_header) {
				_header = normalizeHeader(_header);
				if (_header) {
					const key = utils$1.findKey(self, _header);
					if (key && (!matcher || matchHeaderValue(self, self[key], key, matcher))) {
						delete self[key];
						deleted = true;
					}
				}
			}
			if (utils$1.isArray(header)) header.forEach(deleteHeader);
			else deleteHeader(header);
			return deleted;
		}
		clear(matcher) {
			const keys = Object.keys(this);
			let i = keys.length;
			let deleted = false;
			while (i--) {
				const key = keys[i];
				if (!matcher || matchHeaderValue(this, this[key], key, matcher, true)) {
					delete this[key];
					deleted = true;
				}
			}
			return deleted;
		}
		normalize(format) {
			const self = this;
			const headers = {};
			utils$1.forEach(this, (value, header) => {
				const key = utils$1.findKey(headers, header);
				if (key) {
					self[key] = normalizeValue(value);
					delete self[header];
					return;
				}
				const normalized = format ? formatHeader(header) : String(header).trim();
				if (normalized !== header) delete self[header];
				self[normalized] = normalizeValue(value);
				headers[normalized] = true;
			});
			return this;
		}
		concat(...targets) {
			return this.constructor.concat(this, ...targets);
		}
		toJSON(asStrings) {
			const obj = Object.create(null);
			utils$1.forEach(this, (value, header) => {
				value != null && value !== false && (obj[header] = asStrings && utils$1.isArray(value) ? value.join(", ") : value);
			});
			return obj;
		}
		[Symbol.iterator]() {
			return Object.entries(this.toJSON())[Symbol.iterator]();
		}
		toString() {
			return Object.entries(this.toJSON()).map(([header, value]) => header + ": " + value).join("\n");
		}
		getSetCookie() {
			return this.get("set-cookie") || [];
		}
		get [Symbol.toStringTag]() {
			return "AxiosHeaders";
		}
		static from(thing) {
			return thing instanceof this ? thing : new this(thing);
		}
		static concat(first, ...targets) {
			const computed = new this(first);
			targets.forEach((target) => computed.set(target));
			return computed;
		}
		static accessor(header) {
			const accessors = (this[$internals] = this[$internals] = { accessors: {} }).accessors;
			const prototype = this.prototype;
			function defineAccessor(_header) {
				const lHeader = normalizeHeader(_header);
				if (!accessors[lHeader]) {
					buildAccessors(prototype, _header);
					accessors[lHeader] = true;
				}
			}
			utils$1.isArray(header) ? header.forEach(defineAccessor) : defineAccessor(header);
			return this;
		}
	};
	AxiosHeaders.accessor([
		"Content-Type",
		"Content-Length",
		"Accept",
		"Accept-Encoding",
		"User-Agent",
		"Authorization"
	]);
	utils$1.reduceDescriptors(AxiosHeaders.prototype, ({ value }, key) => {
		let mapped = key[0].toUpperCase() + key.slice(1);
		return {
			get: () => value,
			set(headerValue) {
				this[mapped] = headerValue;
			}
		};
	});
	utils$1.freezeMethods(AxiosHeaders);
	/**
	* Transform the data for a request or a response
	*
	* @param {Array|Function} fns A single function or Array of functions
	* @param {?Object} response The response object
	*
	* @returns {*} The resulting transformed data
	*/
	function transformData(fns, response) {
		const config = this || defaults;
		const context = response || config;
		const headers = AxiosHeaders.from(context.headers);
		let data = context.data;
		utils$1.forEach(fns, function transform(fn) {
			data = fn.call(config, data, headers.normalize(), response ? response.status : void 0);
		});
		headers.normalize();
		return data;
	}
	function isCancel(value) {
		return !!(value && value.__CANCEL__);
	}
	var CanceledError = class extends AxiosError {
		/**
		* A `CanceledError` is an object that is thrown when an operation is canceled.
		*
		* @param {string=} message The message.
		* @param {Object=} config The config.
		* @param {Object=} request The request.
		*
		* @returns {CanceledError} The created error.
		*/
		constructor(message, config, request) {
			super(message == null ? "canceled" : message, AxiosError.ERR_CANCELED, config, request);
			this.name = "CanceledError";
			this.__CANCEL__ = true;
		}
	};
	/**
	* Resolve or reject a Promise based on response status.
	*
	* @param {Function} resolve A function that resolves the promise.
	* @param {Function} reject A function that rejects the promise.
	* @param {object} response The response.
	*
	* @returns {object} The response.
	*/
	function settle(resolve, reject, response) {
		const validateStatus = response.config.validateStatus;
		if (!response.status || !validateStatus || validateStatus(response.status)) resolve(response);
		else reject(new AxiosError("Request failed with status code " + response.status, [AxiosError.ERR_BAD_REQUEST, AxiosError.ERR_BAD_RESPONSE][Math.floor(response.status / 100) - 4], response.config, response.request, response));
	}
	/**
	* Determines whether the specified URL is absolute
	*
	* @param {string} url The URL to test
	*
	* @returns {boolean} True if the specified URL is absolute, otherwise false
	*/
	function isAbsoluteURL(url) {
		if (typeof url !== "string") return false;
		return /^([a-z][a-z\d+\-.]*:)?\/\//i.test(url);
	}
	/**
	* Creates a new URL by combining the specified URLs
	*
	* @param {string} baseURL The base URL
	* @param {string} relativeURL The relative URL
	*
	* @returns {string} The combined URL
	*/
	function combineURLs(baseURL, relativeURL) {
		return relativeURL ? baseURL.replace(/\/?\/$/, "") + "/" + relativeURL.replace(/^\/+/, "") : baseURL;
	}
	/**
	* Creates a new URL by combining the baseURL with the requestedURL,
	* only when the requestedURL is not already an absolute URL.
	* If the requestURL is absolute, this function returns the requestedURL untouched.
	*
	* @param {string} baseURL The base URL
	* @param {string} requestedURL Absolute or relative URL to combine
	*
	* @returns {string} The combined full path
	*/
	function buildFullPath(baseURL, requestedURL, allowAbsoluteUrls) {
		let isRelativeUrl = !isAbsoluteURL(requestedURL);
		if (baseURL && (isRelativeUrl || allowAbsoluteUrls == false)) return combineURLs(baseURL, requestedURL);
		return requestedURL;
	}
	var DEFAULT_PORTS$1 = {
		ftp: 21,
		gopher: 70,
		http: 80,
		https: 443,
		ws: 80,
		wss: 443
	};
	function parseUrl(urlString) {
		try {
			return new URL(urlString);
		} catch {
			return null;
		}
	}
	/**
	* @param {string|object|URL} url - The URL as a string or URL instance, or a
	*   compatible object (such as the result from legacy url.parse).
	* @return {string} The URL of the proxy that should handle the request to the
	*  given URL. If no proxy is set, this will be an empty string.
	*/
	function getProxyForUrl(url) {
		var parsedUrl = (typeof url === "string" ? parseUrl(url) : url) || {};
		var proto = parsedUrl.protocol;
		var hostname = parsedUrl.host;
		var port = parsedUrl.port;
		if (typeof hostname !== "string" || !hostname || typeof proto !== "string") return "";
		proto = proto.split(":", 1)[0];
		hostname = hostname.replace(/:\d*$/, "");
		port = parseInt(port) || DEFAULT_PORTS$1[proto] || 0;
		if (!shouldProxy(hostname, port)) return "";
		var proxy = getEnv(proto + "_proxy") || getEnv("all_proxy");
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
		var NO_PROXY = getEnv("no_proxy").toLowerCase();
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
			return !hostname.endsWith(parsedProxyHostname);
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
	const VERSION = "1.15.0";
	function parseProtocol(url) {
		const match = /^([-+\w]{1,25})(:?\/\/|:)/.exec(url);
		return match && match[1] || "";
	}
	const DATA_URL_PATTERN = /^(?:([^;]+);)?(?:[^;]+;)?(base64|),([\s\S]*)$/;
	/**
	* Parse data uri to a Buffer or Blob
	*
	* @param {String} uri
	* @param {?Boolean} asBlob
	* @param {?Object} options
	* @param {?Function} options.Blob
	*
	* @returns {Buffer|Blob}
	*/
	function fromDataURI(uri, asBlob, options) {
		const _Blob = options && options.Blob || platform.classes.Blob;
		const protocol = parseProtocol(uri);
		if (asBlob === void 0 && _Blob) asBlob = true;
		if (protocol === "data") {
			uri = protocol.length ? uri.slice(protocol.length + 1) : uri;
			const match = DATA_URL_PATTERN.exec(uri);
			if (!match) throw new AxiosError("Invalid URL", AxiosError.ERR_INVALID_URL);
			const mime = match[1];
			const isBase64 = match[2];
			const body = match[3];
			const buffer = Buffer.from(decodeURIComponent(body), isBase64 ? "base64" : "utf8");
			if (asBlob) {
				if (!_Blob) throw new AxiosError("Blob is not supported", AxiosError.ERR_NOT_SUPPORT);
				return new _Blob([buffer], { type: mime });
			}
			return buffer;
		}
		throw new AxiosError("Unsupported protocol " + protocol, AxiosError.ERR_NOT_SUPPORT);
	}
	const kInternals = Symbol("internals");
	var AxiosTransformStream = class extends stream.Transform {
		constructor(options) {
			options = utils$1.toFlatObject(options, {
				maxRate: 0,
				chunkSize: 64 * 1024,
				minChunkSize: 100,
				timeWindow: 500,
				ticksRate: 2,
				samplesCount: 15
			}, null, (prop, source) => {
				return !utils$1.isUndefined(source[prop]);
			});
			super({ readableHighWaterMark: options.chunkSize });
			const internals = this[kInternals] = {
				timeWindow: options.timeWindow,
				chunkSize: options.chunkSize,
				maxRate: options.maxRate,
				minChunkSize: options.minChunkSize,
				bytesSeen: 0,
				isCaptured: false,
				notifiedBytesLoaded: 0,
				ts: Date.now(),
				bytes: 0,
				onReadCallback: null
			};
			this.on("newListener", (event) => {
				if (event === "progress") {
					if (!internals.isCaptured) internals.isCaptured = true;
				}
			});
		}
		_read(size) {
			const internals = this[kInternals];
			if (internals.onReadCallback) internals.onReadCallback();
			return super._read(size);
		}
		_transform(chunk, encoding, callback) {
			const internals = this[kInternals];
			const maxRate = internals.maxRate;
			const readableHighWaterMark = this.readableHighWaterMark;
			const timeWindow = internals.timeWindow;
			const bytesThreshold = maxRate / (1e3 / timeWindow);
			const minChunkSize = internals.minChunkSize !== false ? Math.max(internals.minChunkSize, bytesThreshold * .01) : 0;
			const pushChunk = (_chunk, _callback) => {
				const bytes = Buffer.byteLength(_chunk);
				internals.bytesSeen += bytes;
				internals.bytes += bytes;
				internals.isCaptured && this.emit("progress", internals.bytesSeen);
				if (this.push(_chunk)) process.nextTick(_callback);
				else internals.onReadCallback = () => {
					internals.onReadCallback = null;
					process.nextTick(_callback);
				};
			};
			const transformChunk = (_chunk, _callback) => {
				const chunkSize = Buffer.byteLength(_chunk);
				let chunkRemainder = null;
				let maxChunkSize = readableHighWaterMark;
				let bytesLeft;
				let passed = 0;
				if (maxRate) {
					const now = Date.now();
					if (!internals.ts || (passed = now - internals.ts) >= timeWindow) {
						internals.ts = now;
						bytesLeft = bytesThreshold - internals.bytes;
						internals.bytes = bytesLeft < 0 ? -bytesLeft : 0;
						passed = 0;
					}
					bytesLeft = bytesThreshold - internals.bytes;
				}
				if (maxRate) {
					if (bytesLeft <= 0) return setTimeout(() => {
						_callback(null, _chunk);
					}, timeWindow - passed);
					if (bytesLeft < maxChunkSize) maxChunkSize = bytesLeft;
				}
				if (maxChunkSize && chunkSize > maxChunkSize && chunkSize - maxChunkSize > minChunkSize) {
					chunkRemainder = _chunk.subarray(maxChunkSize);
					_chunk = _chunk.subarray(0, maxChunkSize);
				}
				pushChunk(_chunk, chunkRemainder ? () => {
					process.nextTick(_callback, null, chunkRemainder);
				} : _callback);
			};
			transformChunk(chunk, function transformNextChunk(err, _chunk) {
				if (err) return callback(err);
				if (_chunk) transformChunk(_chunk, transformNextChunk);
				else callback(null);
			});
		}
	};
	const { asyncIterator } = Symbol;
	const readBlob = async function* (blob) {
		if (blob.stream) yield* blob.stream();
		else if (blob.arrayBuffer) yield await blob.arrayBuffer();
		else if (blob[asyncIterator]) yield* blob[asyncIterator]();
		else yield blob;
	};
	const BOUNDARY_ALPHABET = platform.ALPHABET.ALPHA_DIGIT + "-_";
	const textEncoder = typeof TextEncoder === "function" ? new TextEncoder() : new util.TextEncoder();
	const CRLF = "\r\n";
	const CRLF_BYTES = textEncoder.encode(CRLF);
	const CRLF_BYTES_COUNT = 2;
	var FormDataPart = class {
		constructor(name, value) {
			const { escapeName } = this.constructor;
			const isStringValue = utils$1.isString(value);
			let headers = `Content-Disposition: form-data; name="${escapeName(name)}"${!isStringValue && value.name ? `; filename="${escapeName(value.name)}"` : ""}${CRLF}`;
			if (isStringValue) value = textEncoder.encode(String(value).replace(/\r?\n|\r\n?/g, CRLF));
			else headers += `Content-Type: ${value.type || "application/octet-stream"}${CRLF}`;
			this.headers = textEncoder.encode(headers + CRLF);
			this.contentLength = isStringValue ? value.byteLength : value.size;
			this.size = this.headers.byteLength + this.contentLength + CRLF_BYTES_COUNT;
			this.name = name;
			this.value = value;
		}
		async *encode() {
			yield this.headers;
			const { value } = this;
			if (utils$1.isTypedArray(value)) yield value;
			else yield* readBlob(value);
			yield CRLF_BYTES;
		}
		static escapeName(name) {
			return String(name).replace(/[\r\n"]/g, (match) => ({
				"\r": "%0D",
				"\n": "%0A",
				"\"": "%22"
			})[match]);
		}
	};
	const formDataToStream = (form, headersHandler, options) => {
		const { tag = "form-data-boundary", size = 25, boundary = tag + "-" + platform.generateString(size, BOUNDARY_ALPHABET) } = options || {};
		if (!utils$1.isFormData(form)) throw TypeError("FormData instance required");
		if (boundary.length < 1 || boundary.length > 70) throw Error("boundary must be 10-70 characters long");
		const boundaryBytes = textEncoder.encode("--" + boundary + CRLF);
		const footerBytes = textEncoder.encode("--" + boundary + "--\r\n");
		let contentLength = footerBytes.byteLength;
		const parts = Array.from(form.entries()).map(([name, value]) => {
			const part = new FormDataPart(name, value);
			contentLength += part.size;
			return part;
		});
		contentLength += boundaryBytes.byteLength * parts.length;
		contentLength = utils$1.toFiniteNumber(contentLength);
		const computedHeaders = { "Content-Type": `multipart/form-data; boundary=${boundary}` };
		if (Number.isFinite(contentLength)) computedHeaders["Content-Length"] = contentLength;
		headersHandler && headersHandler(computedHeaders);
		return stream.Readable.from(async function* () {
			for (const part of parts) {
				yield boundaryBytes;
				yield* part.encode();
			}
			yield footerBytes;
		}());
	};
	var ZlibHeaderTransformStream = class extends stream.Transform {
		__transform(chunk, encoding, callback) {
			this.push(chunk);
			callback();
		}
		_transform(chunk, encoding, callback) {
			if (chunk.length !== 0) {
				this._transform = this.__transform;
				if (chunk[0] !== 120) {
					const header = Buffer.alloc(2);
					header[0] = 120;
					header[1] = 156;
					this.push(header, encoding);
				}
			}
			this.__transform(chunk, encoding, callback);
		}
	};
	const callbackify = (fn, reducer) => {
		return utils$1.isAsyncFn(fn) ? function(...args) {
			const cb = args.pop();
			fn.apply(this, args).then((value) => {
				try {
					reducer ? cb(null, ...reducer(value)) : cb(null, value);
				} catch (err) {
					cb(err);
				}
			}, cb);
		} : fn;
	};
	const DEFAULT_PORTS = {
		http: 80,
		https: 443,
		ws: 80,
		wss: 443,
		ftp: 21
	};
	const parseNoProxyEntry = (entry) => {
		let entryHost = entry;
		let entryPort = 0;
		if (entryHost.charAt(0) === "[") {
			const bracketIndex = entryHost.indexOf("]");
			if (bracketIndex !== -1) {
				const host = entryHost.slice(1, bracketIndex);
				const rest = entryHost.slice(bracketIndex + 1);
				if (rest.charAt(0) === ":" && /^\d+$/.test(rest.slice(1))) entryPort = Number.parseInt(rest.slice(1), 10);
				return [host, entryPort];
			}
		}
		const firstColon = entryHost.indexOf(":");
		const lastColon = entryHost.lastIndexOf(":");
		if (firstColon !== -1 && firstColon === lastColon && /^\d+$/.test(entryHost.slice(lastColon + 1))) {
			entryPort = Number.parseInt(entryHost.slice(lastColon + 1), 10);
			entryHost = entryHost.slice(0, lastColon);
		}
		return [entryHost, entryPort];
	};
	const normalizeNoProxyHost = (hostname) => {
		if (!hostname) return hostname;
		if (hostname.charAt(0) === "[" && hostname.charAt(hostname.length - 1) === "]") hostname = hostname.slice(1, -1);
		return hostname.replace(/\.+$/, "");
	};
	function shouldBypassProxy(location) {
		let parsed;
		try {
			parsed = new URL(location);
		} catch (_err) {
			return false;
		}
		const noProxy = (process.env.no_proxy || process.env.NO_PROXY || "").toLowerCase();
		if (!noProxy) return false;
		if (noProxy === "*") return true;
		const port = Number.parseInt(parsed.port, 10) || DEFAULT_PORTS[parsed.protocol.split(":", 1)[0]] || 0;
		const hostname = normalizeNoProxyHost(parsed.hostname.toLowerCase());
		return noProxy.split(/[\s,]+/).some((entry) => {
			if (!entry) return false;
			let [entryHost, entryPort] = parseNoProxyEntry(entry);
			entryHost = normalizeNoProxyHost(entryHost);
			if (!entryHost) return false;
			if (entryPort && entryPort !== port) return false;
			if (entryHost.charAt(0) === "*") entryHost = entryHost.slice(1);
			if (entryHost.charAt(0) === ".") return hostname.endsWith(entryHost);
			return hostname === entryHost;
		});
	}
	/**
	* Calculate data maxRate
	* @param {Number} [samplesCount= 10]
	* @param {Number} [min= 1000]
	* @returns {Function}
	*/
	function speedometer(samplesCount, min) {
		samplesCount = samplesCount || 10;
		const bytes = new Array(samplesCount);
		const timestamps = new Array(samplesCount);
		let head = 0;
		let tail = 0;
		let firstSampleTS;
		min = min !== void 0 ? min : 1e3;
		return function push(chunkLength) {
			const now = Date.now();
			const startedAt = timestamps[tail];
			if (!firstSampleTS) firstSampleTS = now;
			bytes[head] = chunkLength;
			timestamps[head] = now;
			let i = tail;
			let bytesCount = 0;
			while (i !== head) {
				bytesCount += bytes[i++];
				i = i % samplesCount;
			}
			head = (head + 1) % samplesCount;
			if (head === tail) tail = (tail + 1) % samplesCount;
			if (now - firstSampleTS < min) return;
			const passed = startedAt && now - startedAt;
			return passed ? Math.round(bytesCount * 1e3 / passed) : void 0;
		};
	}
	/**
	* Throttle decorator
	* @param {Function} fn
	* @param {Number} freq
	* @return {Function}
	*/
	function throttle(fn, freq) {
		let timestamp = 0;
		let threshold = 1e3 / freq;
		let lastArgs;
		let timer;
		const invoke = (args, now = Date.now()) => {
			timestamp = now;
			lastArgs = null;
			if (timer) {
				clearTimeout(timer);
				timer = null;
			}
			fn(...args);
		};
		const throttled = (...args) => {
			const now = Date.now();
			const passed = now - timestamp;
			if (passed >= threshold) invoke(args, now);
			else {
				lastArgs = args;
				if (!timer) timer = setTimeout(() => {
					timer = null;
					invoke(lastArgs);
				}, threshold - passed);
			}
		};
		const flush = () => lastArgs && invoke(lastArgs);
		return [throttled, flush];
	}
	const progressEventReducer = (listener, isDownloadStream, freq = 3) => {
		let bytesNotified = 0;
		const _speedometer = speedometer(50, 250);
		return throttle((e) => {
			const loaded = e.loaded;
			const total = e.lengthComputable ? e.total : void 0;
			const progressBytes = loaded - bytesNotified;
			const rate = _speedometer(progressBytes);
			const inRange = loaded <= total;
			bytesNotified = loaded;
			listener({
				loaded,
				total,
				progress: total ? loaded / total : void 0,
				bytes: progressBytes,
				rate: rate ? rate : void 0,
				estimated: rate && total && inRange ? (total - loaded) / rate : void 0,
				event: e,
				lengthComputable: total != null,
				[isDownloadStream ? "download" : "upload"]: true
			});
		}, freq);
	};
	const progressEventDecorator = (total, throttled) => {
		const lengthComputable = total != null;
		return [(loaded) => throttled[0]({
			lengthComputable,
			total,
			loaded
		}), throttled[1]];
	};
	const asyncDecorator = (fn) => (...args) => utils$1.asap(() => fn(...args));
	/**
	* Estimate decoded byte length of a data:// URL *without* allocating large buffers.
	* - For base64: compute exact decoded size using length and padding;
	*               handle %XX at the character-count level (no string allocation).
	* - For non-base64: use UTF-8 byteLength of the encoded body as a safe upper bound.
	*
	* @param {string} url
	* @returns {number}
	*/
	function estimateDataURLDecodedBytes(url) {
		if (!url || typeof url !== "string") return 0;
		if (!url.startsWith("data:")) return 0;
		const comma = url.indexOf(",");
		if (comma < 0) return 0;
		const meta = url.slice(5, comma);
		const body = url.slice(comma + 1);
		if (/;base64/i.test(meta)) {
			let effectiveLen = body.length;
			const len = body.length;
			for (let i = 0; i < len; i++) if (body.charCodeAt(i) === 37 && i + 2 < len) {
				const a = body.charCodeAt(i + 1);
				const b = body.charCodeAt(i + 2);
				if ((a >= 48 && a <= 57 || a >= 65 && a <= 70 || a >= 97 && a <= 102) && (b >= 48 && b <= 57 || b >= 65 && b <= 70 || b >= 97 && b <= 102)) {
					effectiveLen -= 2;
					i += 2;
				}
			}
			let pad = 0;
			let idx = len - 1;
			const tailIsPct3D = (j) => j >= 2 && body.charCodeAt(j - 2) === 37 && body.charCodeAt(j - 1) === 51 && (body.charCodeAt(j) === 68 || body.charCodeAt(j) === 100);
			if (idx >= 0) {
				if (body.charCodeAt(idx) === 61) {
					pad++;
					idx--;
				} else if (tailIsPct3D(idx)) {
					pad++;
					idx -= 3;
				}
			}
			if (pad === 1 && idx >= 0) {
				if (body.charCodeAt(idx) === 61) pad++;
				else if (tailIsPct3D(idx)) pad++;
			}
			const bytes = Math.floor(effectiveLen / 4) * 3 - (pad || 0);
			return bytes > 0 ? bytes : 0;
		}
		return Buffer.byteLength(body, "utf8");
	}
	const zlibOptions = {
		flush: zlib.constants.Z_SYNC_FLUSH,
		finishFlush: zlib.constants.Z_SYNC_FLUSH
	};
	const brotliOptions = {
		flush: zlib.constants.BROTLI_OPERATION_FLUSH,
		finishFlush: zlib.constants.BROTLI_OPERATION_FLUSH
	};
	const isBrotliSupported = utils$1.isFunction(zlib.createBrotliDecompress);
	const { http: httpFollow, https: httpsFollow } = followRedirects;
	const isHttps = /https:?/;
	const supportedProtocols = platform.protocols.map((protocol) => {
		return protocol + ":";
	});
	const flushOnFinish = (stream, [throttled, flush]) => {
		stream.on("end", flush).on("error", flush);
		return throttled;
	};
	var Http2Sessions = class {
		constructor() {
			this.sessions = Object.create(null);
		}
		getSession(authority, options) {
			options = Object.assign({ sessionTimeout: 1e3 }, options);
			let authoritySessions = this.sessions[authority];
			if (authoritySessions) {
				let len = authoritySessions.length;
				for (let i = 0; i < len; i++) {
					const [sessionHandle, sessionOptions] = authoritySessions[i];
					if (!sessionHandle.destroyed && !sessionHandle.closed && util.isDeepStrictEqual(sessionOptions, options)) return sessionHandle;
				}
			}
			const session = http2.connect(authority, options);
			let removed;
			const removeSession = () => {
				if (removed) return;
				removed = true;
				let entries = authoritySessions, len = entries.length, i = len;
				while (i--) if (entries[i][0] === session) {
					if (len === 1) delete this.sessions[authority];
					else entries.splice(i, 1);
					if (!session.closed) session.close();
					return;
				}
			};
			const originalRequestFn = session.request;
			const { sessionTimeout } = options;
			if (sessionTimeout != null) {
				let timer;
				let streamsCount = 0;
				session.request = function() {
					const stream = originalRequestFn.apply(this, arguments);
					streamsCount++;
					if (timer) {
						clearTimeout(timer);
						timer = null;
					}
					stream.once("close", () => {
						if (!--streamsCount) timer = setTimeout(() => {
							timer = null;
							removeSession();
						}, sessionTimeout);
					});
					return stream;
				};
			}
			session.once("close", removeSession);
			let entry = [session, options];
			authoritySessions ? authoritySessions.push(entry) : authoritySessions = this.sessions[authority] = [entry];
			return session;
		}
	};
	const http2Sessions = new Http2Sessions();
	/**
	* If the proxy or config beforeRedirects functions are defined, call them with the options
	* object.
	*
	* @param {Object<string, any>} options - The options object that was passed to the request.
	*
	* @returns {Object<string, any>}
	*/
	function dispatchBeforeRedirect(options, responseDetails) {
		if (options.beforeRedirects.proxy) options.beforeRedirects.proxy(options);
		if (options.beforeRedirects.config) options.beforeRedirects.config(options, responseDetails);
	}
	/**
	* If the proxy or config afterRedirects functions are defined, call them with the options
	*
	* @param {http.ClientRequestArgs} options
	* @param {AxiosProxyConfig} configProxy configuration from Axios options object
	* @param {string} location
	*
	* @returns {http.ClientRequestArgs}
	*/
	function setProxy(options, configProxy, location) {
		let proxy = configProxy;
		if (!proxy && proxy !== false) {
			const proxyUrl = getProxyForUrl(location);
			if (proxyUrl) {
				if (!shouldBypassProxy(location)) proxy = new URL(proxyUrl);
			}
		}
		if (proxy) {
			if (proxy.username) proxy.auth = (proxy.username || "") + ":" + (proxy.password || "");
			if (proxy.auth) {
				if (Boolean(proxy.auth.username || proxy.auth.password)) proxy.auth = (proxy.auth.username || "") + ":" + (proxy.auth.password || "");
				else if (typeof proxy.auth === "object") throw new AxiosError("Invalid proxy authorization", AxiosError.ERR_BAD_OPTION, { proxy });
				const base64 = Buffer.from(proxy.auth, "utf8").toString("base64");
				options.headers["Proxy-Authorization"] = "Basic " + base64;
			}
			options.headers.host = options.hostname + (options.port ? ":" + options.port : "");
			const proxyHost = proxy.hostname || proxy.host;
			options.hostname = proxyHost;
			options.host = proxyHost;
			options.port = proxy.port;
			options.path = location;
			if (proxy.protocol) options.protocol = proxy.protocol.includes(":") ? proxy.protocol : `${proxy.protocol}:`;
		}
		options.beforeRedirects.proxy = function beforeRedirect(redirectOptions) {
			setProxy(redirectOptions, configProxy, redirectOptions.href);
		};
	}
	const isHttpAdapterSupported = typeof process !== "undefined" && utils$1.kindOf(process) === "process";
	const wrapAsync = (asyncExecutor) => {
		return new Promise((resolve, reject) => {
			let onDone;
			let isDone;
			const done = (value, isRejected) => {
				if (isDone) return;
				isDone = true;
				onDone && onDone(value, isRejected);
			};
			const _resolve = (value) => {
				done(value);
				resolve(value);
			};
			const _reject = (reason) => {
				done(reason, true);
				reject(reason);
			};
			asyncExecutor(_resolve, _reject, (onDoneHandler) => onDone = onDoneHandler).catch(_reject);
		});
	};
	const resolveFamily = ({ address, family }) => {
		if (!utils$1.isString(address)) throw TypeError("address must be a string");
		return {
			address,
			family: family || (address.indexOf(".") < 0 ? 6 : 4)
		};
	};
	const buildAddressEntry = (address, family) => resolveFamily(utils$1.isObject(address) ? address : {
		address,
		family
	});
	const http2Transport = { request(options, cb) {
		const authority = options.protocol + "//" + options.hostname + ":" + (options.port || (options.protocol === "https:" ? 443 : 80));
		const { http2Options, headers } = options;
		const session = http2Sessions.getSession(authority, http2Options);
		const { HTTP2_HEADER_SCHEME, HTTP2_HEADER_METHOD, HTTP2_HEADER_PATH, HTTP2_HEADER_STATUS } = http2.constants;
		const http2Headers = {
			[HTTP2_HEADER_SCHEME]: options.protocol.replace(":", ""),
			[HTTP2_HEADER_METHOD]: options.method,
			[HTTP2_HEADER_PATH]: options.path
		};
		utils$1.forEach(headers, (header, name) => {
			name.charAt(0) !== ":" && (http2Headers[name] = header);
		});
		const req = session.request(http2Headers);
		req.once("response", (responseHeaders) => {
			const response = req;
			responseHeaders = Object.assign({}, responseHeaders);
			const status = responseHeaders[HTTP2_HEADER_STATUS];
			delete responseHeaders[HTTP2_HEADER_STATUS];
			response.headers = responseHeaders;
			response.statusCode = +status;
			cb(response);
		});
		return req;
	} };
	var httpAdapter = isHttpAdapterSupported && function httpAdapter(config) {
		return wrapAsync(async function dispatchHttpRequest(resolve, reject, onDone) {
			let { data, lookup, family, httpVersion = 1, http2Options } = config;
			const { responseType, responseEncoding } = config;
			const method = config.method.toUpperCase();
			let isDone;
			let rejected = false;
			let req;
			httpVersion = +httpVersion;
			if (Number.isNaN(httpVersion)) throw TypeError(`Invalid protocol version: '${config.httpVersion}' is not a number`);
			if (httpVersion !== 1 && httpVersion !== 2) throw TypeError(`Unsupported protocol version '${httpVersion}'`);
			const isHttp2 = httpVersion === 2;
			if (lookup) {
				const _lookup = callbackify(lookup, (value) => utils$1.isArray(value) ? value : [value]);
				lookup = (hostname, opt, cb) => {
					_lookup(hostname, opt, (err, arg0, arg1) => {
						if (err) return cb(err);
						const addresses = utils$1.isArray(arg0) ? arg0.map((addr) => buildAddressEntry(addr)) : [buildAddressEntry(arg0, arg1)];
						opt.all ? cb(err, addresses) : cb(err, addresses[0].address, addresses[0].family);
					});
				};
			}
			const abortEmitter = new events.EventEmitter();
			function abort(reason) {
				try {
					abortEmitter.emit("abort", !reason || reason.type ? new CanceledError(null, config, req) : reason);
				} catch (err) {
					console.warn("emit error", err);
				}
			}
			abortEmitter.once("abort", reject);
			const onFinished = () => {
				if (config.cancelToken) config.cancelToken.unsubscribe(abort);
				if (config.signal) config.signal.removeEventListener("abort", abort);
				abortEmitter.removeAllListeners();
			};
			if (config.cancelToken || config.signal) {
				config.cancelToken && config.cancelToken.subscribe(abort);
				if (config.signal) config.signal.aborted ? abort() : config.signal.addEventListener("abort", abort);
			}
			onDone((response, isRejected) => {
				isDone = true;
				if (isRejected) {
					rejected = true;
					onFinished();
					return;
				}
				const { data } = response;
				if (data instanceof stream.Readable || data instanceof stream.Duplex) {
					const offListeners = stream.finished(data, () => {
						offListeners();
						onFinished();
					});
				} else onFinished();
			});
			const fullPath = buildFullPath(config.baseURL, config.url, config.allowAbsoluteUrls);
			const parsed = new URL(fullPath, platform.hasBrowserEnv ? platform.origin : void 0);
			const protocol = parsed.protocol || supportedProtocols[0];
			if (protocol === "data:") {
				if (config.maxContentLength > -1) {
					if (estimateDataURLDecodedBytes(String(config.url || fullPath || "")) > config.maxContentLength) return reject(new AxiosError("maxContentLength size of " + config.maxContentLength + " exceeded", AxiosError.ERR_BAD_RESPONSE, config));
				}
				let convertedData;
				if (method !== "GET") return settle(resolve, reject, {
					status: 405,
					statusText: "method not allowed",
					headers: {},
					config
				});
				try {
					convertedData = fromDataURI(config.url, responseType === "blob", { Blob: config.env && config.env.Blob });
				} catch (err) {
					throw AxiosError.from(err, AxiosError.ERR_BAD_REQUEST, config);
				}
				if (responseType === "text") {
					convertedData = convertedData.toString(responseEncoding);
					if (!responseEncoding || responseEncoding === "utf8") convertedData = utils$1.stripBOM(convertedData);
				} else if (responseType === "stream") convertedData = stream.Readable.from(convertedData);
				return settle(resolve, reject, {
					data: convertedData,
					status: 200,
					statusText: "OK",
					headers: new AxiosHeaders(),
					config
				});
			}
			if (supportedProtocols.indexOf(protocol) === -1) return reject(new AxiosError("Unsupported protocol " + protocol, AxiosError.ERR_BAD_REQUEST, config));
			const headers = AxiosHeaders.from(config.headers).normalize();
			headers.set("User-Agent", "axios/1.15.0", false);
			const { onUploadProgress, onDownloadProgress } = config;
			const maxRate = config.maxRate;
			let maxUploadRate = void 0;
			let maxDownloadRate = void 0;
			if (utils$1.isSpecCompliantForm(data)) {
				const userBoundary = headers.getContentType(/boundary=([-_\w\d]{10,70})/i);
				data = formDataToStream(data, (formHeaders) => {
					headers.set(formHeaders);
				}, {
					tag: `axios-${VERSION}-boundary`,
					boundary: userBoundary && userBoundary[1] || void 0
				});
			} else if (utils$1.isFormData(data) && utils$1.isFunction(data.getHeaders)) {
				headers.set(data.getHeaders());
				if (!headers.hasContentLength()) try {
					const knownLength = await util.promisify(data.getLength).call(data);
					Number.isFinite(knownLength) && knownLength >= 0 && headers.setContentLength(knownLength);
				} catch (e) {}
			} else if (utils$1.isBlob(data) || utils$1.isFile(data)) {
				data.size && headers.setContentType(data.type || "application/octet-stream");
				headers.setContentLength(data.size || 0);
				data = stream.Readable.from(readBlob(data));
			} else if (data && !utils$1.isStream(data)) {
				if (Buffer.isBuffer(data));
				else if (utils$1.isArrayBuffer(data)) data = Buffer.from(new Uint8Array(data));
				else if (utils$1.isString(data)) data = Buffer.from(data, "utf-8");
				else return reject(new AxiosError("Data after transformation must be a string, an ArrayBuffer, a Buffer, or a Stream", AxiosError.ERR_BAD_REQUEST, config));
				headers.setContentLength(data.length, false);
				if (config.maxBodyLength > -1 && data.length > config.maxBodyLength) return reject(new AxiosError("Request body larger than maxBodyLength limit", AxiosError.ERR_BAD_REQUEST, config));
			}
			const contentLength = utils$1.toFiniteNumber(headers.getContentLength());
			if (utils$1.isArray(maxRate)) {
				maxUploadRate = maxRate[0];
				maxDownloadRate = maxRate[1];
			} else maxUploadRate = maxDownloadRate = maxRate;
			if (data && (onUploadProgress || maxUploadRate)) {
				if (!utils$1.isStream(data)) data = stream.Readable.from(data, { objectMode: false });
				data = stream.pipeline([data, new AxiosTransformStream({ maxRate: utils$1.toFiniteNumber(maxUploadRate) })], utils$1.noop);
				onUploadProgress && data.on("progress", flushOnFinish(data, progressEventDecorator(contentLength, progressEventReducer(asyncDecorator(onUploadProgress), false, 3))));
			}
			let auth = void 0;
			if (config.auth) {
				const username = config.auth.username || "";
				const password = config.auth.password || "";
				auth = username + ":" + password;
			}
			if (!auth && parsed.username) {
				const urlUsername = parsed.username;
				const urlPassword = parsed.password;
				auth = urlUsername + ":" + urlPassword;
			}
			auth && headers.delete("authorization");
			let path;
			try {
				path = buildURL(parsed.pathname + parsed.search, config.params, config.paramsSerializer).replace(/^\?/, "");
			} catch (err) {
				const customErr = new Error(err.message);
				customErr.config = config;
				customErr.url = config.url;
				customErr.exists = true;
				return reject(customErr);
			}
			headers.set("Accept-Encoding", "gzip, compress, deflate" + (isBrotliSupported ? ", br" : ""), false);
			const options = {
				path,
				method,
				headers: headers.toJSON(),
				agents: {
					http: config.httpAgent,
					https: config.httpsAgent
				},
				auth,
				protocol,
				family,
				beforeRedirect: dispatchBeforeRedirect,
				beforeRedirects: {},
				http2Options
			};
			!utils$1.isUndefined(lookup) && (options.lookup = lookup);
			if (config.socketPath) options.socketPath = config.socketPath;
			else {
				options.hostname = parsed.hostname.startsWith("[") ? parsed.hostname.slice(1, -1) : parsed.hostname;
				options.port = parsed.port;
				setProxy(options, config.proxy, protocol + "//" + parsed.hostname + (parsed.port ? ":" + parsed.port : "") + options.path);
			}
			let transport;
			const isHttpsRequest = isHttps.test(options.protocol);
			options.agent = isHttpsRequest ? config.httpsAgent : config.httpAgent;
			if (isHttp2) transport = http2Transport;
			else if (config.transport) transport = config.transport;
			else if (config.maxRedirects === 0) transport = isHttpsRequest ? https : http;
			else {
				if (config.maxRedirects) options.maxRedirects = config.maxRedirects;
				if (config.beforeRedirect) options.beforeRedirects.config = config.beforeRedirect;
				transport = isHttpsRequest ? httpsFollow : httpFollow;
			}
			if (config.maxBodyLength > -1) options.maxBodyLength = config.maxBodyLength;
			else options.maxBodyLength = Infinity;
			if (config.insecureHTTPParser) options.insecureHTTPParser = config.insecureHTTPParser;
			req = transport.request(options, function handleResponse(res) {
				if (req.destroyed) return;
				const streams = [res];
				const responseLength = utils$1.toFiniteNumber(res.headers["content-length"]);
				if (onDownloadProgress || maxDownloadRate) {
					const transformStream = new AxiosTransformStream({ maxRate: utils$1.toFiniteNumber(maxDownloadRate) });
					onDownloadProgress && transformStream.on("progress", flushOnFinish(transformStream, progressEventDecorator(responseLength, progressEventReducer(asyncDecorator(onDownloadProgress), true, 3))));
					streams.push(transformStream);
				}
				let responseStream = res;
				const lastRequest = res.req || req;
				if (config.decompress !== false && res.headers["content-encoding"]) {
					if (method === "HEAD" || res.statusCode === 204) delete res.headers["content-encoding"];
					switch ((res.headers["content-encoding"] || "").toLowerCase()) {
						case "gzip":
						case "x-gzip":
						case "compress":
						case "x-compress":
							streams.push(zlib.createUnzip(zlibOptions));
							delete res.headers["content-encoding"];
							break;
						case "deflate":
							streams.push(new ZlibHeaderTransformStream());
							streams.push(zlib.createUnzip(zlibOptions));
							delete res.headers["content-encoding"];
							break;
						case "br": if (isBrotliSupported) {
							streams.push(zlib.createBrotliDecompress(brotliOptions));
							delete res.headers["content-encoding"];
						}
					}
				}
				responseStream = streams.length > 1 ? stream.pipeline(streams, utils$1.noop) : streams[0];
				const response = {
					status: res.statusCode,
					statusText: res.statusMessage,
					headers: new AxiosHeaders(res.headers),
					config,
					request: lastRequest
				};
				if (responseType === "stream") {
					response.data = responseStream;
					settle(resolve, reject, response);
				} else {
					const responseBuffer = [];
					let totalResponseBytes = 0;
					responseStream.on("data", function handleStreamData(chunk) {
						responseBuffer.push(chunk);
						totalResponseBytes += chunk.length;
						if (config.maxContentLength > -1 && totalResponseBytes > config.maxContentLength) {
							rejected = true;
							responseStream.destroy();
							abort(new AxiosError("maxContentLength size of " + config.maxContentLength + " exceeded", AxiosError.ERR_BAD_RESPONSE, config, lastRequest));
						}
					});
					responseStream.on("aborted", function handlerStreamAborted() {
						if (rejected) return;
						const err = new AxiosError("stream has been aborted", AxiosError.ERR_BAD_RESPONSE, config, lastRequest);
						responseStream.destroy(err);
						reject(err);
					});
					responseStream.on("error", function handleStreamError(err) {
						if (req.destroyed) return;
						reject(AxiosError.from(err, null, config, lastRequest));
					});
					responseStream.on("end", function handleStreamEnd() {
						try {
							let responseData = responseBuffer.length === 1 ? responseBuffer[0] : Buffer.concat(responseBuffer);
							if (responseType !== "arraybuffer") {
								responseData = responseData.toString(responseEncoding);
								if (!responseEncoding || responseEncoding === "utf8") responseData = utils$1.stripBOM(responseData);
							}
							response.data = responseData;
						} catch (err) {
							return reject(AxiosError.from(err, null, config, response.request, response));
						}
						settle(resolve, reject, response);
					});
				}
				abortEmitter.once("abort", (err) => {
					if (!responseStream.destroyed) {
						responseStream.emit("error", err);
						responseStream.destroy();
					}
				});
			});
			abortEmitter.once("abort", (err) => {
				if (req.close) req.close();
				else req.destroy(err);
			});
			req.on("error", function handleRequestError(err) {
				reject(AxiosError.from(err, null, config, req));
			});
			req.on("socket", function handleRequestSocket(socket) {
				socket.setKeepAlive(true, 1e3 * 60);
			});
			if (config.timeout) {
				const timeout = parseInt(config.timeout, 10);
				if (Number.isNaN(timeout)) {
					abort(new AxiosError("error trying to parse `config.timeout` to int", AxiosError.ERR_BAD_OPTION_VALUE, config, req));
					return;
				}
				req.setTimeout(timeout, function handleRequestTimeout() {
					if (isDone) return;
					let timeoutErrorMessage = config.timeout ? "timeout of " + config.timeout + "ms exceeded" : "timeout exceeded";
					const transitional = config.transitional || transitionalDefaults;
					if (config.timeoutErrorMessage) timeoutErrorMessage = config.timeoutErrorMessage;
					abort(new AxiosError(timeoutErrorMessage, transitional.clarifyTimeoutError ? AxiosError.ETIMEDOUT : AxiosError.ECONNABORTED, config, req));
				});
			} else req.setTimeout(0);
			if (utils$1.isStream(data)) {
				let ended = false;
				let errored = false;
				data.on("end", () => {
					ended = true;
				});
				data.once("error", (err) => {
					errored = true;
					req.destroy(err);
				});
				data.on("close", () => {
					if (!ended && !errored) abort(new CanceledError("Request stream has been aborted", config, req));
				});
				data.pipe(req);
			} else {
				data && req.write(data);
				req.end();
			}
		});
	};
	var isURLSameOrigin = platform.hasStandardBrowserEnv ? ((origin, isMSIE) => (url) => {
		url = new URL(url, platform.origin);
		return origin.protocol === url.protocol && origin.host === url.host && (isMSIE || origin.port === url.port);
	})(new URL(platform.origin), platform.navigator && /(msie|trident)/i.test(platform.navigator.userAgent)) : () => true;
	var cookies = platform.hasStandardBrowserEnv ? {
		write(name, value, expires, path, domain, secure, sameSite) {
			if (typeof document === "undefined") return;
			const cookie = [`${name}=${encodeURIComponent(value)}`];
			if (utils$1.isNumber(expires)) cookie.push(`expires=${new Date(expires).toUTCString()}`);
			if (utils$1.isString(path)) cookie.push(`path=${path}`);
			if (utils$1.isString(domain)) cookie.push(`domain=${domain}`);
			if (secure === true) cookie.push("secure");
			if (utils$1.isString(sameSite)) cookie.push(`SameSite=${sameSite}`);
			document.cookie = cookie.join("; ");
		},
		read(name) {
			if (typeof document === "undefined") return null;
			const match = document.cookie.match(new RegExp("(?:^|; )" + name + "=([^;]*)"));
			return match ? decodeURIComponent(match[1]) : null;
		},
		remove(name) {
			this.write(name, "", Date.now() - 864e5, "/");
		}
	} : {
		write() {},
		read() {
			return null;
		},
		remove() {}
	};
	const headersToObject = (thing) => thing instanceof AxiosHeaders ? { ...thing } : thing;
	/**
	* Config-specific merge-function which creates a new config-object
	* by merging two configuration objects together.
	*
	* @param {Object} config1
	* @param {Object} config2
	*
	* @returns {Object} New object resulting from merging config2 to config1
	*/
	function mergeConfig(config1, config2) {
		config2 = config2 || {};
		const config = {};
		function getMergedValue(target, source, prop, caseless) {
			if (utils$1.isPlainObject(target) && utils$1.isPlainObject(source)) return utils$1.merge.call({ caseless }, target, source);
			else if (utils$1.isPlainObject(source)) return utils$1.merge({}, source);
			else if (utils$1.isArray(source)) return source.slice();
			return source;
		}
		function mergeDeepProperties(a, b, prop, caseless) {
			if (!utils$1.isUndefined(b)) return getMergedValue(a, b, prop, caseless);
			else if (!utils$1.isUndefined(a)) return getMergedValue(void 0, a, prop, caseless);
		}
		function valueFromConfig2(a, b) {
			if (!utils$1.isUndefined(b)) return getMergedValue(void 0, b);
		}
		function defaultToConfig2(a, b) {
			if (!utils$1.isUndefined(b)) return getMergedValue(void 0, b);
			else if (!utils$1.isUndefined(a)) return getMergedValue(void 0, a);
		}
		function mergeDirectKeys(a, b, prop) {
			if (prop in config2) return getMergedValue(a, b);
			else if (prop in config1) return getMergedValue(void 0, a);
		}
		const mergeMap = {
			url: valueFromConfig2,
			method: valueFromConfig2,
			data: valueFromConfig2,
			baseURL: defaultToConfig2,
			transformRequest: defaultToConfig2,
			transformResponse: defaultToConfig2,
			paramsSerializer: defaultToConfig2,
			timeout: defaultToConfig2,
			timeoutMessage: defaultToConfig2,
			withCredentials: defaultToConfig2,
			withXSRFToken: defaultToConfig2,
			adapter: defaultToConfig2,
			responseType: defaultToConfig2,
			xsrfCookieName: defaultToConfig2,
			xsrfHeaderName: defaultToConfig2,
			onUploadProgress: defaultToConfig2,
			onDownloadProgress: defaultToConfig2,
			decompress: defaultToConfig2,
			maxContentLength: defaultToConfig2,
			maxBodyLength: defaultToConfig2,
			beforeRedirect: defaultToConfig2,
			transport: defaultToConfig2,
			httpAgent: defaultToConfig2,
			httpsAgent: defaultToConfig2,
			cancelToken: defaultToConfig2,
			socketPath: defaultToConfig2,
			responseEncoding: defaultToConfig2,
			validateStatus: mergeDirectKeys,
			headers: (a, b, prop) => mergeDeepProperties(headersToObject(a), headersToObject(b), prop, true)
		};
		utils$1.forEach(Object.keys({
			...config1,
			...config2
		}), function computeConfigValue(prop) {
			if (prop === "__proto__" || prop === "constructor" || prop === "prototype") return;
			const merge = utils$1.hasOwnProp(mergeMap, prop) ? mergeMap[prop] : mergeDeepProperties;
			const configValue = merge(config1[prop], config2[prop], prop);
			utils$1.isUndefined(configValue) && merge !== mergeDirectKeys || (config[prop] = configValue);
		});
		return config;
	}
	var resolveConfig = (config) => {
		const newConfig = mergeConfig({}, config);
		let { data, withXSRFToken, xsrfHeaderName, xsrfCookieName, headers, auth } = newConfig;
		newConfig.headers = headers = AxiosHeaders.from(headers);
		newConfig.url = buildURL(buildFullPath(newConfig.baseURL, newConfig.url, newConfig.allowAbsoluteUrls), config.params, config.paramsSerializer);
		if (auth) headers.set("Authorization", "Basic " + btoa((auth.username || "") + ":" + (auth.password ? unescape(encodeURIComponent(auth.password)) : "")));
		if (utils$1.isFormData(data)) {
			if (platform.hasStandardBrowserEnv || platform.hasStandardBrowserWebWorkerEnv) headers.setContentType(void 0);
			else if (utils$1.isFunction(data.getHeaders)) {
				const formHeaders = data.getHeaders();
				const allowedHeaders = ["content-type", "content-length"];
				Object.entries(formHeaders).forEach(([key, val]) => {
					if (allowedHeaders.includes(key.toLowerCase())) headers.set(key, val);
				});
			}
		}
		if (platform.hasStandardBrowserEnv) {
			withXSRFToken && utils$1.isFunction(withXSRFToken) && (withXSRFToken = withXSRFToken(newConfig));
			if (withXSRFToken || withXSRFToken !== false && isURLSameOrigin(newConfig.url)) {
				const xsrfValue = xsrfHeaderName && xsrfCookieName && cookies.read(xsrfCookieName);
				if (xsrfValue) headers.set(xsrfHeaderName, xsrfValue);
			}
		}
		return newConfig;
	};
	var xhrAdapter = typeof XMLHttpRequest !== "undefined" && function(config) {
		return new Promise(function dispatchXhrRequest(resolve, reject) {
			const _config = resolveConfig(config);
			let requestData = _config.data;
			const requestHeaders = AxiosHeaders.from(_config.headers).normalize();
			let { responseType, onUploadProgress, onDownloadProgress } = _config;
			let onCanceled;
			let uploadThrottled, downloadThrottled;
			let flushUpload, flushDownload;
			function done() {
				flushUpload && flushUpload();
				flushDownload && flushDownload();
				_config.cancelToken && _config.cancelToken.unsubscribe(onCanceled);
				_config.signal && _config.signal.removeEventListener("abort", onCanceled);
			}
			let request = new XMLHttpRequest();
			request.open(_config.method.toUpperCase(), _config.url, true);
			request.timeout = _config.timeout;
			function onloadend() {
				if (!request) return;
				const responseHeaders = AxiosHeaders.from("getAllResponseHeaders" in request && request.getAllResponseHeaders());
				settle(function _resolve(value) {
					resolve(value);
					done();
				}, function _reject(err) {
					reject(err);
					done();
				}, {
					data: !responseType || responseType === "text" || responseType === "json" ? request.responseText : request.response,
					status: request.status,
					statusText: request.statusText,
					headers: responseHeaders,
					config,
					request
				});
				request = null;
			}
			if ("onloadend" in request) request.onloadend = onloadend;
			else request.onreadystatechange = function handleLoad() {
				if (!request || request.readyState !== 4) return;
				if (request.status === 0 && !(request.responseURL && request.responseURL.indexOf("file:") === 0)) return;
				setTimeout(onloadend);
			};
			request.onabort = function handleAbort() {
				if (!request) return;
				reject(new AxiosError("Request aborted", AxiosError.ECONNABORTED, config, request));
				request = null;
			};
			request.onerror = function handleError(event) {
				const err = new AxiosError(event && event.message ? event.message : "Network Error", AxiosError.ERR_NETWORK, config, request);
				err.event = event || null;
				reject(err);
				request = null;
			};
			request.ontimeout = function handleTimeout() {
				let timeoutErrorMessage = _config.timeout ? "timeout of " + _config.timeout + "ms exceeded" : "timeout exceeded";
				const transitional = _config.transitional || transitionalDefaults;
				if (_config.timeoutErrorMessage) timeoutErrorMessage = _config.timeoutErrorMessage;
				reject(new AxiosError(timeoutErrorMessage, transitional.clarifyTimeoutError ? AxiosError.ETIMEDOUT : AxiosError.ECONNABORTED, config, request));
				request = null;
			};
			requestData === void 0 && requestHeaders.setContentType(null);
			if ("setRequestHeader" in request) utils$1.forEach(requestHeaders.toJSON(), function setRequestHeader(val, key) {
				request.setRequestHeader(key, val);
			});
			if (!utils$1.isUndefined(_config.withCredentials)) request.withCredentials = !!_config.withCredentials;
			if (responseType && responseType !== "json") request.responseType = _config.responseType;
			if (onDownloadProgress) {
				[downloadThrottled, flushDownload] = progressEventReducer(onDownloadProgress, true);
				request.addEventListener("progress", downloadThrottled);
			}
			if (onUploadProgress && request.upload) {
				[uploadThrottled, flushUpload] = progressEventReducer(onUploadProgress);
				request.upload.addEventListener("progress", uploadThrottled);
				request.upload.addEventListener("loadend", flushUpload);
			}
			if (_config.cancelToken || _config.signal) {
				onCanceled = (cancel) => {
					if (!request) return;
					reject(!cancel || cancel.type ? new CanceledError(null, config, request) : cancel);
					request.abort();
					request = null;
				};
				_config.cancelToken && _config.cancelToken.subscribe(onCanceled);
				if (_config.signal) _config.signal.aborted ? onCanceled() : _config.signal.addEventListener("abort", onCanceled);
			}
			const protocol = parseProtocol(_config.url);
			if (protocol && platform.protocols.indexOf(protocol) === -1) {
				reject(new AxiosError("Unsupported protocol " + protocol + ":", AxiosError.ERR_BAD_REQUEST, config));
				return;
			}
			request.send(requestData || null);
		});
	};
	const composeSignals = (signals, timeout) => {
		const { length } = signals = signals ? signals.filter(Boolean) : [];
		if (timeout || length) {
			let controller = new AbortController();
			let aborted;
			const onabort = function(reason) {
				if (!aborted) {
					aborted = true;
					unsubscribe();
					const err = reason instanceof Error ? reason : this.reason;
					controller.abort(err instanceof AxiosError ? err : new CanceledError(err instanceof Error ? err.message : err));
				}
			};
			let timer = timeout && setTimeout(() => {
				timer = null;
				onabort(new AxiosError(`timeout of ${timeout}ms exceeded`, AxiosError.ETIMEDOUT));
			}, timeout);
			const unsubscribe = () => {
				if (signals) {
					timer && clearTimeout(timer);
					timer = null;
					signals.forEach((signal) => {
						signal.unsubscribe ? signal.unsubscribe(onabort) : signal.removeEventListener("abort", onabort);
					});
					signals = null;
				}
			};
			signals.forEach((signal) => signal.addEventListener("abort", onabort));
			const { signal } = controller;
			signal.unsubscribe = () => utils$1.asap(unsubscribe);
			return signal;
		}
	};
	const streamChunk = function* (chunk, chunkSize) {
		let len = chunk.byteLength;
		if (len < chunkSize) {
			yield chunk;
			return;
		}
		let pos = 0;
		let end;
		while (pos < len) {
			end = pos + chunkSize;
			yield chunk.slice(pos, end);
			pos = end;
		}
	};
	const readBytes = async function* (iterable, chunkSize) {
		for await (const chunk of readStream(iterable)) yield* streamChunk(chunk, chunkSize);
	};
	const readStream = async function* (stream) {
		if (stream[Symbol.asyncIterator]) {
			yield* stream;
			return;
		}
		const reader = stream.getReader();
		try {
			for (;;) {
				const { done, value } = await reader.read();
				if (done) break;
				yield value;
			}
		} finally {
			await reader.cancel();
		}
	};
	const trackStream = (stream, chunkSize, onProgress, onFinish) => {
		const iterator = readBytes(stream, chunkSize);
		let bytes = 0;
		let done;
		let _onFinish = (e) => {
			if (!done) {
				done = true;
				onFinish && onFinish(e);
			}
		};
		return new ReadableStream({
			async pull(controller) {
				try {
					const { done, value } = await iterator.next();
					if (done) {
						_onFinish();
						controller.close();
						return;
					}
					let len = value.byteLength;
					if (onProgress) onProgress(bytes += len);
					controller.enqueue(new Uint8Array(value));
				} catch (err) {
					_onFinish(err);
					throw err;
				}
			},
			cancel(reason) {
				_onFinish(reason);
				return iterator.return();
			}
		}, { highWaterMark: 2 });
	};
	const DEFAULT_CHUNK_SIZE = 64 * 1024;
	const { isFunction } = utils$1;
	const globalFetchAPI = (({ Request, Response }) => ({
		Request,
		Response
	}))(utils$1.global);
	const { ReadableStream: ReadableStream$1, TextEncoder: TextEncoder$1 } = utils$1.global;
	const test = (fn, ...args) => {
		try {
			return !!fn(...args);
		} catch (e) {
			return false;
		}
	};
	const factory = (env) => {
		env = utils$1.merge.call({ skipUndefined: true }, globalFetchAPI, env);
		const { fetch: envFetch, Request, Response } = env;
		const isFetchSupported = envFetch ? isFunction(envFetch) : typeof fetch === "function";
		const isRequestSupported = isFunction(Request);
		const isResponseSupported = isFunction(Response);
		if (!isFetchSupported) return false;
		const isReadableStreamSupported = isFetchSupported && isFunction(ReadableStream$1);
		const encodeText = isFetchSupported && (typeof TextEncoder$1 === "function" ? ((encoder) => (str) => encoder.encode(str))(new TextEncoder$1()) : async (str) => new Uint8Array(await new Request(str).arrayBuffer()));
		const supportsRequestStream = isRequestSupported && isReadableStreamSupported && test(() => {
			let duplexAccessed = false;
			const body = new ReadableStream$1();
			const hasContentType = new Request(platform.origin, {
				body,
				method: "POST",
				get duplex() {
					duplexAccessed = true;
					return "half";
				}
			}).headers.has("Content-Type");
			body.cancel();
			return duplexAccessed && !hasContentType;
		});
		const supportsResponseStream = isResponseSupported && isReadableStreamSupported && test(() => utils$1.isReadableStream(new Response("").body));
		const resolvers = { stream: supportsResponseStream && ((res) => res.body) };
		isFetchSupported && (() => {
			[
				"text",
				"arrayBuffer",
				"blob",
				"formData",
				"stream"
			].forEach((type) => {
				!resolvers[type] && (resolvers[type] = (res, config) => {
					let method = res && res[type];
					if (method) return method.call(res);
					throw new AxiosError(`Response type '${type}' is not supported`, AxiosError.ERR_NOT_SUPPORT, config);
				});
			});
		})();
		const getBodyLength = async (body) => {
			if (body == null) return 0;
			if (utils$1.isBlob(body)) return body.size;
			if (utils$1.isSpecCompliantForm(body)) return (await new Request(platform.origin, {
				method: "POST",
				body
			}).arrayBuffer()).byteLength;
			if (utils$1.isArrayBufferView(body) || utils$1.isArrayBuffer(body)) return body.byteLength;
			if (utils$1.isURLSearchParams(body)) body = body + "";
			if (utils$1.isString(body)) return (await encodeText(body)).byteLength;
		};
		const resolveBodyLength = async (headers, body) => {
			const length = utils$1.toFiniteNumber(headers.getContentLength());
			return length == null ? getBodyLength(body) : length;
		};
		return async (config) => {
			let { url, method, data, signal, cancelToken, timeout, onDownloadProgress, onUploadProgress, responseType, headers, withCredentials = "same-origin", fetchOptions } = resolveConfig(config);
			let _fetch = envFetch || fetch;
			responseType = responseType ? (responseType + "").toLowerCase() : "text";
			let composedSignal = composeSignals([signal, cancelToken && cancelToken.toAbortSignal()], timeout);
			let request = null;
			const unsubscribe = composedSignal && composedSignal.unsubscribe && (() => {
				composedSignal.unsubscribe();
			});
			let requestContentLength;
			try {
				if (onUploadProgress && supportsRequestStream && method !== "get" && method !== "head" && (requestContentLength = await resolveBodyLength(headers, data)) !== 0) {
					let _request = new Request(url, {
						method: "POST",
						body: data,
						duplex: "half"
					});
					let contentTypeHeader;
					if (utils$1.isFormData(data) && (contentTypeHeader = _request.headers.get("content-type"))) headers.setContentType(contentTypeHeader);
					if (_request.body) {
						const [onProgress, flush] = progressEventDecorator(requestContentLength, progressEventReducer(asyncDecorator(onUploadProgress)));
						data = trackStream(_request.body, DEFAULT_CHUNK_SIZE, onProgress, flush);
					}
				}
				if (!utils$1.isString(withCredentials)) withCredentials = withCredentials ? "include" : "omit";
				const isCredentialsSupported = isRequestSupported && "credentials" in Request.prototype;
				const resolvedOptions = {
					...fetchOptions,
					signal: composedSignal,
					method: method.toUpperCase(),
					headers: headers.normalize().toJSON(),
					body: data,
					duplex: "half",
					credentials: isCredentialsSupported ? withCredentials : void 0
				};
				request = isRequestSupported && new Request(url, resolvedOptions);
				let response = await (isRequestSupported ? _fetch(request, fetchOptions) : _fetch(url, resolvedOptions));
				const isStreamResponse = supportsResponseStream && (responseType === "stream" || responseType === "response");
				if (supportsResponseStream && (onDownloadProgress || isStreamResponse && unsubscribe)) {
					const options = {};
					[
						"status",
						"statusText",
						"headers"
					].forEach((prop) => {
						options[prop] = response[prop];
					});
					const responseContentLength = utils$1.toFiniteNumber(response.headers.get("content-length"));
					const [onProgress, flush] = onDownloadProgress && progressEventDecorator(responseContentLength, progressEventReducer(asyncDecorator(onDownloadProgress), true)) || [];
					response = new Response(trackStream(response.body, DEFAULT_CHUNK_SIZE, onProgress, () => {
						flush && flush();
						unsubscribe && unsubscribe();
					}), options);
				}
				responseType = responseType || "text";
				let responseData = await resolvers[utils$1.findKey(resolvers, responseType) || "text"](response, config);
				!isStreamResponse && unsubscribe && unsubscribe();
				return await new Promise((resolve, reject) => {
					settle(resolve, reject, {
						data: responseData,
						headers: AxiosHeaders.from(response.headers),
						status: response.status,
						statusText: response.statusText,
						config,
						request
					});
				});
			} catch (err) {
				unsubscribe && unsubscribe();
				if (err && err.name === "TypeError" && /Load failed|fetch/i.test(err.message)) throw Object.assign(new AxiosError("Network Error", AxiosError.ERR_NETWORK, config, request, err && err.response), { cause: err.cause || err });
				throw AxiosError.from(err, err && err.code, config, request, err && err.response);
			}
		};
	};
	const seedCache = /* @__PURE__ */ new Map();
	const getFetch = (config) => {
		let env = config && config.env || {};
		const { fetch, Request, Response } = env;
		const seeds = [
			Request,
			Response,
			fetch
		];
		let i = seeds.length, seed, target, map = seedCache;
		while (i--) {
			seed = seeds[i];
			target = map.get(seed);
			target === void 0 && map.set(seed, target = i ? /* @__PURE__ */ new Map() : factory(env));
			map = target;
		}
		return target;
	};
	getFetch();
	/**
	* Known adapters mapping.
	* Provides environment-specific adapters for Axios:
	* - `http` for Node.js
	* - `xhr` for browsers
	* - `fetch` for fetch API-based requests
	*
	* @type {Object<string, Function|Object>}
	*/
	const knownAdapters = {
		http: httpAdapter,
		xhr: xhrAdapter,
		fetch: { get: getFetch }
	};
	utils$1.forEach(knownAdapters, (fn, value) => {
		if (fn) {
			try {
				Object.defineProperty(fn, "name", { value });
			} catch (e) {}
			Object.defineProperty(fn, "adapterName", { value });
		}
	});
	/**
	* Render a rejection reason string for unknown or unsupported adapters
	*
	* @param {string} reason
	* @returns {string}
	*/
	const renderReason = (reason) => `- ${reason}`;
	/**
	* Check if the adapter is resolved (function, null, or false)
	*
	* @param {Function|null|false} adapter
	* @returns {boolean}
	*/
	const isResolvedHandle = (adapter) => utils$1.isFunction(adapter) || adapter === null || adapter === false;
	/**
	* Get the first suitable adapter from the provided list.
	* Tries each adapter in order until a supported one is found.
	* Throws an AxiosError if no adapter is suitable.
	*
	* @param {Array<string|Function>|string|Function} adapters - Adapter(s) by name or function.
	* @param {Object} config - Axios request configuration
	* @throws {AxiosError} If no suitable adapter is available
	* @returns {Function} The resolved adapter function
	*/
	function getAdapter(adapters, config) {
		adapters = utils$1.isArray(adapters) ? adapters : [adapters];
		const { length } = adapters;
		let nameOrAdapter;
		let adapter;
		const rejectedReasons = {};
		for (let i = 0; i < length; i++) {
			nameOrAdapter = adapters[i];
			let id;
			adapter = nameOrAdapter;
			if (!isResolvedHandle(nameOrAdapter)) {
				adapter = knownAdapters[(id = String(nameOrAdapter)).toLowerCase()];
				if (adapter === void 0) throw new AxiosError(`Unknown adapter '${id}'`);
			}
			if (adapter && (utils$1.isFunction(adapter) || (adapter = adapter.get(config)))) break;
			rejectedReasons[id || "#" + i] = adapter;
		}
		if (!adapter) {
			const reasons = Object.entries(rejectedReasons).map(([id, state]) => `adapter ${id} ` + (state === false ? "is not supported by the environment" : "is not available in the build"));
			throw new AxiosError(`There is no suitable adapter to dispatch the request ` + (length ? reasons.length > 1 ? "since :\n" + reasons.map(renderReason).join("\n") : " " + renderReason(reasons[0]) : "as no adapter specified"), "ERR_NOT_SUPPORT");
		}
		return adapter;
	}
	/**
	* Exports Axios adapters and utility to resolve an adapter
	*/
	var adapters = {
		/**
		* Resolve an adapter from a list of adapter names or functions.
		* @type {Function}
		*/
		getAdapter,
		/**
		* Exposes all known adapters
		* @type {Object<string, Function|Object>}
		*/
		adapters: knownAdapters
	};
	/**
	* Throws a `CanceledError` if cancellation has been requested.
	*
	* @param {Object} config The config that is to be used for the request
	*
	* @returns {void}
	*/
	function throwIfCancellationRequested(config) {
		if (config.cancelToken) config.cancelToken.throwIfRequested();
		if (config.signal && config.signal.aborted) throw new CanceledError(null, config);
	}
	/**
	* Dispatch a request to the server using the configured adapter.
	*
	* @param {object} config The config that is to be used for the request
	*
	* @returns {Promise} The Promise to be fulfilled
	*/
	function dispatchRequest(config) {
		throwIfCancellationRequested(config);
		config.headers = AxiosHeaders.from(config.headers);
		config.data = transformData.call(config, config.transformRequest);
		if ([
			"post",
			"put",
			"patch"
		].indexOf(config.method) !== -1) config.headers.setContentType("application/x-www-form-urlencoded", false);
		return adapters.getAdapter(config.adapter || defaults.adapter, config)(config).then(function onAdapterResolution(response) {
			throwIfCancellationRequested(config);
			response.data = transformData.call(config, config.transformResponse, response);
			response.headers = AxiosHeaders.from(response.headers);
			return response;
		}, function onAdapterRejection(reason) {
			if (!isCancel(reason)) {
				throwIfCancellationRequested(config);
				if (reason && reason.response) {
					reason.response.data = transformData.call(config, config.transformResponse, reason.response);
					reason.response.headers = AxiosHeaders.from(reason.response.headers);
				}
			}
			return Promise.reject(reason);
		});
	}
	const validators$1 = {};
	[
		"object",
		"boolean",
		"number",
		"function",
		"string",
		"symbol"
	].forEach((type, i) => {
		validators$1[type] = function validator(thing) {
			return typeof thing === type || "a" + (i < 1 ? "n " : " ") + type;
		};
	});
	const deprecatedWarnings = {};
	/**
	* Transitional option validator
	*
	* @param {function|boolean?} validator - set to false if the transitional option has been removed
	* @param {string?} version - deprecated version / removed since version
	* @param {string?} message - some message with additional info
	*
	* @returns {function}
	*/
	validators$1.transitional = function transitional(validator, version, message) {
		function formatMessage(opt, desc) {
			return "[Axios v1.15.0] Transitional option '" + opt + "'" + desc + (message ? ". " + message : "");
		}
		return (value, opt, opts) => {
			if (validator === false) throw new AxiosError(formatMessage(opt, " has been removed" + (version ? " in " + version : "")), AxiosError.ERR_DEPRECATED);
			if (version && !deprecatedWarnings[opt]) {
				deprecatedWarnings[opt] = true;
				console.warn(formatMessage(opt, " has been deprecated since v" + version + " and will be removed in the near future"));
			}
			return validator ? validator(value, opt, opts) : true;
		};
	};
	validators$1.spelling = function spelling(correctSpelling) {
		return (value, opt) => {
			console.warn(`${opt} is likely a misspelling of ${correctSpelling}`);
			return true;
		};
	};
	/**
	* Assert object's properties type
	*
	* @param {object} options
	* @param {object} schema
	* @param {boolean?} allowUnknown
	*
	* @returns {object}
	*/
	function assertOptions(options, schema, allowUnknown) {
		if (typeof options !== "object") throw new AxiosError("options must be an object", AxiosError.ERR_BAD_OPTION_VALUE);
		const keys = Object.keys(options);
		let i = keys.length;
		while (i-- > 0) {
			const opt = keys[i];
			const validator = schema[opt];
			if (validator) {
				const value = options[opt];
				const result = value === void 0 || validator(value, opt, options);
				if (result !== true) throw new AxiosError("option " + opt + " must be " + result, AxiosError.ERR_BAD_OPTION_VALUE);
				continue;
			}
			if (allowUnknown !== true) throw new AxiosError("Unknown option " + opt, AxiosError.ERR_BAD_OPTION);
		}
	}
	var validator = {
		assertOptions,
		validators: validators$1
	};
	const validators = validator.validators;
	/**
	* Create a new instance of Axios
	*
	* @param {Object} instanceConfig The default config for the instance
	*
	* @return {Axios} A new instance of Axios
	*/
	var Axios = class {
		constructor(instanceConfig) {
			this.defaults = instanceConfig || {};
			this.interceptors = {
				request: new InterceptorManager(),
				response: new InterceptorManager()
			};
		}
		/**
		* Dispatch a request
		*
		* @param {String|Object} configOrUrl The config specific for this request (merged with this.defaults)
		* @param {?Object} config
		*
		* @returns {Promise} The Promise to be fulfilled
		*/
		async request(configOrUrl, config) {
			try {
				return await this._request(configOrUrl, config);
			} catch (err) {
				if (err instanceof Error) {
					let dummy = {};
					Error.captureStackTrace ? Error.captureStackTrace(dummy) : dummy = /* @__PURE__ */ new Error();
					const stack = (() => {
						if (!dummy.stack) return "";
						const firstNewlineIndex = dummy.stack.indexOf("\n");
						return firstNewlineIndex === -1 ? "" : dummy.stack.slice(firstNewlineIndex + 1);
					})();
					try {
						if (!err.stack) err.stack = stack;
						else if (stack) {
							const firstNewlineIndex = stack.indexOf("\n");
							const secondNewlineIndex = firstNewlineIndex === -1 ? -1 : stack.indexOf("\n", firstNewlineIndex + 1);
							const stackWithoutTwoTopLines = secondNewlineIndex === -1 ? "" : stack.slice(secondNewlineIndex + 1);
							if (!String(err.stack).endsWith(stackWithoutTwoTopLines)) err.stack += "\n" + stack;
						}
					} catch (e) {}
				}
				throw err;
			}
		}
		_request(configOrUrl, config) {
			if (typeof configOrUrl === "string") {
				config = config || {};
				config.url = configOrUrl;
			} else config = configOrUrl || {};
			config = mergeConfig(this.defaults, config);
			const { transitional, paramsSerializer, headers } = config;
			if (transitional !== void 0) validator.assertOptions(transitional, {
				silentJSONParsing: validators.transitional(validators.boolean),
				forcedJSONParsing: validators.transitional(validators.boolean),
				clarifyTimeoutError: validators.transitional(validators.boolean),
				legacyInterceptorReqResOrdering: validators.transitional(validators.boolean)
			}, false);
			if (paramsSerializer != null) if (utils$1.isFunction(paramsSerializer)) config.paramsSerializer = { serialize: paramsSerializer };
			else validator.assertOptions(paramsSerializer, {
				encode: validators.function,
				serialize: validators.function
			}, true);
			if (config.allowAbsoluteUrls !== void 0);
			else if (this.defaults.allowAbsoluteUrls !== void 0) config.allowAbsoluteUrls = this.defaults.allowAbsoluteUrls;
			else config.allowAbsoluteUrls = true;
			validator.assertOptions(config, {
				baseUrl: validators.spelling("baseURL"),
				withXsrfToken: validators.spelling("withXSRFToken")
			}, true);
			config.method = (config.method || this.defaults.method || "get").toLowerCase();
			let contextHeaders = headers && utils$1.merge(headers.common, headers[config.method]);
			headers && utils$1.forEach([
				"delete",
				"get",
				"head",
				"post",
				"put",
				"patch",
				"common"
			], (method) => {
				delete headers[method];
			});
			config.headers = AxiosHeaders.concat(contextHeaders, headers);
			const requestInterceptorChain = [];
			let synchronousRequestInterceptors = true;
			this.interceptors.request.forEach(function unshiftRequestInterceptors(interceptor) {
				if (typeof interceptor.runWhen === "function" && interceptor.runWhen(config) === false) return;
				synchronousRequestInterceptors = synchronousRequestInterceptors && interceptor.synchronous;
				const transitional = config.transitional || transitionalDefaults;
				if (transitional && transitional.legacyInterceptorReqResOrdering) requestInterceptorChain.unshift(interceptor.fulfilled, interceptor.rejected);
				else requestInterceptorChain.push(interceptor.fulfilled, interceptor.rejected);
			});
			const responseInterceptorChain = [];
			this.interceptors.response.forEach(function pushResponseInterceptors(interceptor) {
				responseInterceptorChain.push(interceptor.fulfilled, interceptor.rejected);
			});
			let promise;
			let i = 0;
			let len;
			if (!synchronousRequestInterceptors) {
				const chain = [dispatchRequest.bind(this), void 0];
				chain.unshift(...requestInterceptorChain);
				chain.push(...responseInterceptorChain);
				len = chain.length;
				promise = Promise.resolve(config);
				while (i < len) promise = promise.then(chain[i++], chain[i++]);
				return promise;
			}
			len = requestInterceptorChain.length;
			let newConfig = config;
			while (i < len) {
				const onFulfilled = requestInterceptorChain[i++];
				const onRejected = requestInterceptorChain[i++];
				try {
					newConfig = onFulfilled(newConfig);
				} catch (error) {
					onRejected.call(this, error);
					break;
				}
			}
			try {
				promise = dispatchRequest.call(this, newConfig);
			} catch (error) {
				return Promise.reject(error);
			}
			i = 0;
			len = responseInterceptorChain.length;
			while (i < len) promise = promise.then(responseInterceptorChain[i++], responseInterceptorChain[i++]);
			return promise;
		}
		getUri(config) {
			config = mergeConfig(this.defaults, config);
			return buildURL(buildFullPath(config.baseURL, config.url, config.allowAbsoluteUrls), config.params, config.paramsSerializer);
		}
	};
	utils$1.forEach([
		"delete",
		"get",
		"head",
		"options"
	], function forEachMethodNoData(method) {
		Axios.prototype[method] = function(url, config) {
			return this.request(mergeConfig(config || {}, {
				method,
				url,
				data: (config || {}).data
			}));
		};
	});
	utils$1.forEach([
		"post",
		"put",
		"patch"
	], function forEachMethodWithData(method) {
		function generateHTTPMethod(isForm) {
			return function httpMethod(url, data, config) {
				return this.request(mergeConfig(config || {}, {
					method,
					headers: isForm ? { "Content-Type": "multipart/form-data" } : {},
					url,
					data
				}));
			};
		}
		Axios.prototype[method] = generateHTTPMethod();
		Axios.prototype[method + "Form"] = generateHTTPMethod(true);
	});
	/**
	* A `CancelToken` is an object that can be used to request cancellation of an operation.
	*
	* @param {Function} executor The executor function.
	*
	* @returns {CancelToken}
	*/
	var CancelToken = class CancelToken {
		constructor(executor) {
			if (typeof executor !== "function") throw new TypeError("executor must be a function.");
			let resolvePromise;
			this.promise = new Promise(function promiseExecutor(resolve) {
				resolvePromise = resolve;
			});
			const token = this;
			this.promise.then((cancel) => {
				if (!token._listeners) return;
				let i = token._listeners.length;
				while (i-- > 0) token._listeners[i](cancel);
				token._listeners = null;
			});
			this.promise.then = (onfulfilled) => {
				let _resolve;
				const promise = new Promise((resolve) => {
					token.subscribe(resolve);
					_resolve = resolve;
				}).then(onfulfilled);
				promise.cancel = function reject() {
					token.unsubscribe(_resolve);
				};
				return promise;
			};
			executor(function cancel(message, config, request) {
				if (token.reason) return;
				token.reason = new CanceledError(message, config, request);
				resolvePromise(token.reason);
			});
		}
		/**
		* Throws a `CanceledError` if cancellation has been requested.
		*/
		throwIfRequested() {
			if (this.reason) throw this.reason;
		}
		/**
		* Subscribe to the cancel signal
		*/
		subscribe(listener) {
			if (this.reason) {
				listener(this.reason);
				return;
			}
			if (this._listeners) this._listeners.push(listener);
			else this._listeners = [listener];
		}
		/**
		* Unsubscribe from the cancel signal
		*/
		unsubscribe(listener) {
			if (!this._listeners) return;
			const index = this._listeners.indexOf(listener);
			if (index !== -1) this._listeners.splice(index, 1);
		}
		toAbortSignal() {
			const controller = new AbortController();
			const abort = (err) => {
				controller.abort(err);
			};
			this.subscribe(abort);
			controller.signal.unsubscribe = () => this.unsubscribe(abort);
			return controller.signal;
		}
		/**
		* Returns an object that contains a new `CancelToken` and a function that, when called,
		* cancels the `CancelToken`.
		*/
		static source() {
			let cancel;
			return {
				token: new CancelToken(function executor(c) {
					cancel = c;
				}),
				cancel
			};
		}
	};
	/**
	* Syntactic sugar for invoking a function and expanding an array for arguments.
	*
	* Common use case would be to use `Function.prototype.apply`.
	*
	*  ```js
	*  function f(x, y, z) {}
	*  const args = [1, 2, 3];
	*  f.apply(null, args);
	*  ```
	*
	* With `spread` this example can be re-written.
	*
	*  ```js
	*  spread(function(x, y, z) {})([1, 2, 3]);
	*  ```
	*
	* @param {Function} callback
	*
	* @returns {Function}
	*/
	function spread(callback) {
		return function wrap(arr) {
			return callback.apply(null, arr);
		};
	}
	/**
	* Determines whether the payload is an error thrown by Axios
	*
	* @param {*} payload The value to test
	*
	* @returns {boolean} True if the payload is an error thrown by Axios, otherwise false
	*/
	function isAxiosError(payload) {
		return utils$1.isObject(payload) && payload.isAxiosError === true;
	}
	const HttpStatusCode = {
		Continue: 100,
		SwitchingProtocols: 101,
		Processing: 102,
		EarlyHints: 103,
		Ok: 200,
		Created: 201,
		Accepted: 202,
		NonAuthoritativeInformation: 203,
		NoContent: 204,
		ResetContent: 205,
		PartialContent: 206,
		MultiStatus: 207,
		AlreadyReported: 208,
		ImUsed: 226,
		MultipleChoices: 300,
		MovedPermanently: 301,
		Found: 302,
		SeeOther: 303,
		NotModified: 304,
		UseProxy: 305,
		Unused: 306,
		TemporaryRedirect: 307,
		PermanentRedirect: 308,
		BadRequest: 400,
		Unauthorized: 401,
		PaymentRequired: 402,
		Forbidden: 403,
		NotFound: 404,
		MethodNotAllowed: 405,
		NotAcceptable: 406,
		ProxyAuthenticationRequired: 407,
		RequestTimeout: 408,
		Conflict: 409,
		Gone: 410,
		LengthRequired: 411,
		PreconditionFailed: 412,
		PayloadTooLarge: 413,
		UriTooLong: 414,
		UnsupportedMediaType: 415,
		RangeNotSatisfiable: 416,
		ExpectationFailed: 417,
		ImATeapot: 418,
		MisdirectedRequest: 421,
		UnprocessableEntity: 422,
		Locked: 423,
		FailedDependency: 424,
		TooEarly: 425,
		UpgradeRequired: 426,
		PreconditionRequired: 428,
		TooManyRequests: 429,
		RequestHeaderFieldsTooLarge: 431,
		UnavailableForLegalReasons: 451,
		InternalServerError: 500,
		NotImplemented: 501,
		BadGateway: 502,
		ServiceUnavailable: 503,
		GatewayTimeout: 504,
		HttpVersionNotSupported: 505,
		VariantAlsoNegotiates: 506,
		InsufficientStorage: 507,
		LoopDetected: 508,
		NotExtended: 510,
		NetworkAuthenticationRequired: 511,
		WebServerIsDown: 521,
		ConnectionTimedOut: 522,
		OriginIsUnreachable: 523,
		TimeoutOccurred: 524,
		SslHandshakeFailed: 525,
		InvalidSslCertificate: 526
	};
	Object.entries(HttpStatusCode).forEach(([key, value]) => {
		HttpStatusCode[value] = key;
	});
	/**
	* Create an instance of Axios
	*
	* @param {Object} defaultConfig The default config for the instance
	*
	* @returns {Axios} A new instance of Axios
	*/
	function createInstance(defaultConfig) {
		const context = new Axios(defaultConfig);
		const instance = bind(Axios.prototype.request, context);
		utils$1.extend(instance, Axios.prototype, context, { allOwnKeys: true });
		utils$1.extend(instance, context, null, { allOwnKeys: true });
		instance.create = function create(instanceConfig) {
			return createInstance(mergeConfig(defaultConfig, instanceConfig));
		};
		return instance;
	}
	const axios = createInstance(defaults);
	axios.Axios = Axios;
	axios.CanceledError = CanceledError;
	axios.CancelToken = CancelToken;
	axios.isCancel = isCancel;
	axios.VERSION = VERSION;
	axios.toFormData = toFormData;
	axios.AxiosError = AxiosError;
	axios.Cancel = axios.CanceledError;
	axios.all = function all(promises) {
		return Promise.all(promises);
	};
	axios.spread = spread;
	axios.isAxiosError = isAxiosError;
	axios.mergeConfig = mergeConfig;
	axios.AxiosHeaders = AxiosHeaders;
	axios.formToJSON = (thing) => formDataToJSON(utils$1.isHTMLForm(thing) ? new FormData(thing) : thing);
	axios.getAdapter = adapters.getAdapter;
	axios.HttpStatusCode = HttpStatusCode;
	axios.default = axios;
	module.exports = axios;
}));
//#endregion
//#region node_modules/content-type/index.js
/*!
* content-type
* Copyright(c) 2015 Douglas Christopher Wilson
* MIT Licensed
*/
var require_content_type = /* @__PURE__ */ __commonJSMin(((exports) => {
	/**
	* RegExp to match *( ";" parameter ) in RFC 7231 sec 3.1.1.1
	*
	* parameter     = token "=" ( token / quoted-string )
	* token         = 1*tchar
	* tchar         = "!" / "#" / "$" / "%" / "&" / "'" / "*"
	*               / "+" / "-" / "." / "^" / "_" / "`" / "|" / "~"
	*               / DIGIT / ALPHA
	*               ; any VCHAR, except delimiters
	* quoted-string = DQUOTE *( qdtext / quoted-pair ) DQUOTE
	* qdtext        = HTAB / SP / %x21 / %x23-5B / %x5D-7E / obs-text
	* obs-text      = %x80-FF
	* quoted-pair   = "\" ( HTAB / SP / VCHAR / obs-text )
	*/
	var PARAM_REGEXP = /; *([!#$%&'*+.^_`|~0-9A-Za-z-]+) *= *("(?:[\u000b\u0020\u0021\u0023-\u005b\u005d-\u007e\u0080-\u00ff]|\\[\u000b\u0020-\u00ff])*"|[!#$%&'*+.^_`|~0-9A-Za-z-]+) */g;
	var TEXT_REGEXP = /^[\u000b\u0020-\u007e\u0080-\u00ff]+$/;
	var TOKEN_REGEXP = /^[!#$%&'*+.^_`|~0-9A-Za-z-]+$/;
	/**
	* RegExp to match quoted-pair in RFC 7230 sec 3.2.6
	*
	* quoted-pair = "\" ( HTAB / SP / VCHAR / obs-text )
	* obs-text    = %x80-FF
	*/
	var QESC_REGEXP = /\\([\u000b\u0020-\u00ff])/g;
	/**
	* RegExp to match chars that must be quoted-pair in RFC 7230 sec 3.2.6
	*/
	var QUOTE_REGEXP = /([\\"])/g;
	/**
	* RegExp to match type in RFC 7231 sec 3.1.1.1
	*
	* media-type = type "/" subtype
	* type       = token
	* subtype    = token
	*/
	var TYPE_REGEXP = /^[!#$%&'*+.^_`|~0-9A-Za-z-]+\/[!#$%&'*+.^_`|~0-9A-Za-z-]+$/;
	/**
	* Module exports.
	* @public
	*/
	exports.format = format;
	exports.parse = parse;
	/**
	* Format object to media type.
	*
	* @param {object} obj
	* @return {string}
	* @public
	*/
	function format(obj) {
		if (!obj || typeof obj !== "object") throw new TypeError("argument obj is required");
		var parameters = obj.parameters;
		var type = obj.type;
		if (!type || !TYPE_REGEXP.test(type)) throw new TypeError("invalid type");
		var string = type;
		if (parameters && typeof parameters === "object") {
			var param;
			var params = Object.keys(parameters).sort();
			for (var i = 0; i < params.length; i++) {
				param = params[i];
				if (!TOKEN_REGEXP.test(param)) throw new TypeError("invalid parameter name");
				string += "; " + param + "=" + qstring(parameters[param]);
			}
		}
		return string;
	}
	/**
	* Parse media type to object.
	*
	* @param {string|object} string
	* @return {Object}
	* @public
	*/
	function parse(string) {
		if (!string) throw new TypeError("argument string is required");
		var header = typeof string === "object" ? getcontenttype(string) : string;
		if (typeof header !== "string") throw new TypeError("argument string is required to be a string");
		var index = header.indexOf(";");
		var type = index !== -1 ? header.slice(0, index).trim() : header.trim();
		if (!TYPE_REGEXP.test(type)) throw new TypeError("invalid media type");
		var obj = new ContentType(type.toLowerCase());
		if (index !== -1) {
			var key;
			var match;
			var value;
			PARAM_REGEXP.lastIndex = index;
			while (match = PARAM_REGEXP.exec(header)) {
				if (match.index !== index) throw new TypeError("invalid parameter format");
				index += match[0].length;
				key = match[1].toLowerCase();
				value = match[2];
				if (value.charCodeAt(0) === 34) {
					value = value.slice(1, -1);
					if (value.indexOf("\\") !== -1) value = value.replace(QESC_REGEXP, "$1");
				}
				obj.parameters[key] = value;
			}
			if (index !== header.length) throw new TypeError("invalid parameter format");
		}
		return obj;
	}
	/**
	* Get content-type from req/res objects.
	*
	* @param {object}
	* @return {Object}
	* @private
	*/
	function getcontenttype(obj) {
		var header;
		if (typeof obj.getHeader === "function") header = obj.getHeader("content-type");
		else if (typeof obj.headers === "object") header = obj.headers && obj.headers["content-type"];
		if (typeof header !== "string") throw new TypeError("content-type header is missing from object");
		return header;
	}
	/**
	* Quote a string if necessary.
	*
	* @param {string} val
	* @return {string}
	* @private
	*/
	function qstring(val) {
		var str = String(val);
		if (TOKEN_REGEXP.test(str)) return str;
		if (str.length > 0 && !TEXT_REGEXP.test(str)) throw new TypeError("invalid parameter value");
		return "\"" + str.replace(QUOTE_REGEXP, "\\$1") + "\"";
	}
	/**
	* Class to represent a content type.
	* @private
	*/
	function ContentType(type) {
		this.parameters = Object.create(null);
		this.type = type;
	}
}));
//#endregion
//#region node_modules/apify-client/package.json
var require_package = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	module.exports = {
		"name": "apify-client",
		"version": "2.22.3",
		"description": "Apify API client for JavaScript",
		"main": "dist/index.js",
		"module": "dist/index.mjs",
		"types": "dist/index.d.ts",
		"browser": "dist/bundle.js",
		"unpkg": "dist/bundle.js",
		"exports": {
			"./package.json": "./package.json",
			"./browser": "./dist/bundle.js",
			".": {
				"import": "./dist/index.mjs",
				"require": "./dist/index.js",
				"types": "./dist/index.d.ts",
				"browser": "./dist/bundle.js"
			}
		},
		"keywords": [
			"apify",
			"api",
			"apifier",
			"crawler",
			"scraper"
		],
		"author": {
			"name": "Apify",
			"email": "support@apify.com",
			"url": "https://apify.com"
		},
		"contributors": [
			"Jan Curn <jan@apify.com>",
			"Marek Trunkát <marek@apify.com>",
			"Ondra Urban <ondra@apify.com>",
			"Jakub Drobník <jakub.drobnik@apify.com>"
		],
		"license": "Apache-2.0",
		"repository": {
			"type": "git",
			"url": "git+https://github.com/apify/apify-client-js"
		},
		"bugs": { "url": "https://github.com/apify/apify-client-js/issues" },
		"homepage": "https://docs.apify.com/api/client/js/",
		"files": ["dist", "!dist/*.tsbuildinfo"],
		"scripts": {
			"build": "npm run clean && npm run build:node && npm run build:browser",
			"postbuild": "gen-esm-wrapper dist/index.js dist/index.mjs",
			"prepublishOnly": "(test $CI || (echo \"Publishing is reserved to CI!\"; exit 1))",
			"clean": "rimraf dist",
			"test": "npm run build && vitest run",
			"test:bundling": "npm run build && npm --prefix=./test/bundling run bundle:all",
			"lint": "eslint",
			"lint:fix": "eslint --fix",
			"tsc-check-tests": "tsc --noEmit --project test/tsconfig.json",
			"format": "prettier --write .",
			"format:check": "prettier --check .",
			"build:node": "tsc",
			"build:browser": "rsbuild build"
		},
		"dependencies": {
			"@apify/consts": "^2.50.0",
			"@apify/log": "^2.2.6",
			"@apify/utilities": "^2.23.2",
			"@crawlee/types": "^3.3.0",
			"ansi-colors": "^4.1.1",
			"async-retry": "^1.3.3",
			"axios": "^1.6.7",
			"content-type": "^1.0.5",
			"ow": "^0.28.2",
			"proxy-agent": "^6.5.0",
			"tslib": "^2.5.0",
			"type-fest": "^4.0.0"
		},
		"devDependencies": {
			"@apify/eslint-config": "^1.0.0",
			"@apify/tsconfig": "^0.1.1",
			"@crawlee/puppeteer": "^3.2.2",
			"@rsbuild/core": "^1.3.6",
			"@rsbuild/plugin-node-polyfill": "^1.3.0",
			"@rspack/cli": "^1.7.6",
			"@rspack/core": "^1.7.6",
			"@stylistic/eslint-plugin-ts": "^4.2.0",
			"@types/async-retry": "^1.4.5",
			"@types/compression": "^1.8.1",
			"@types/content-type": "^1.1.5",
			"@types/express": "^5.0.0",
			"@types/node": "^24.0.0",
			"ajv": "^8.17.1",
			"body-parser": "^2.0.0",
			"compression": "^1.7.4",
			"esbuild": "0.27.4",
			"eslint": "^9.24.0",
			"eslint-config-prettier": "^10.1.2",
			"express": "^5.0.0",
			"gen-esm-wrapper": "^1.1.2",
			"globals": "^17.0.0",
			"prettier": "^3.5.3",
			"puppeteer": "^24.0.0",
			"rimraf": "^6.0.0",
			"rolldown": "^1.0.0-rc.4",
			"typescript": "^5.8.3",
			"typescript-eslint": "^8.29.1",
			"vitest": "^4.0.16",
			"webpack": "^5.105.2",
			"webpack-cli": "^7.0.0"
		},
		"packageManager": "npm@10.9.2"
	};
}));
//#endregion
//#region node_modules/apify-client/dist/utils.js
var require_utils = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.PaginationIterator = void 0;
	exports.pluckData = pluckData;
	exports.catchNotFoundOrThrow = catchNotFoundOrThrow;
	exports.parseDateFields = parseDateFields;
	exports.stringifyWebhooksToBase64 = stringifyWebhooksToBase64;
	exports.maybeGzipValue = maybeGzipValue;
	exports.sliceArrayByByteLength = sliceArrayByByteLength;
	exports.isNode = isNode;
	exports.dynamicNodeImport = dynamicNodeImport;
	exports.isBuffer = isBuffer;
	exports.isStream = isStream;
	exports.getVersionData = getVersionData;
	exports.cast = cast;
	exports.asArray = asArray;
	exports.applyQueryParamsToUrl = applyQueryParamsToUrl;
	const tslib_1$6 = __require("tslib");
	const ow_1 = tslib_1$6.__importDefault(require_dist$1());
	const NOT_FOUND_STATUS_CODE = 404;
	const RECORD_NOT_FOUND_TYPE = "record-not-found";
	const RECORD_OR_TOKEN_NOT_FOUND_TYPE = "record-or-token-not-found";
	const MIN_GZIP_BYTES = 1024;
	/**
	* Returns object's 'data' property or throws if parameter is not an object,
	* or an object without a 'data' property.
	*/
	function pluckData(obj) {
		if (typeof obj === "object" && obj) {
			if (typeof obj.data !== "undefined") return obj.data;
		}
		throw new Error(`Expected response object with a "data" property, but received: ${obj}`);
	}
	/**
	* If given HTTP error has NOT_FOUND_STATUS_CODE status code then returns undefined.
	* Otherwise rethrows error.
	*/
	function catchNotFoundOrThrow(err) {
		const isNotFoundStatus = err.statusCode === NOT_FOUND_STATUS_CODE;
		const isNotFoundMessage = err.type === RECORD_NOT_FOUND_TYPE || err.type === RECORD_OR_TOKEN_NOT_FOUND_TYPE || err.httpMethod === "head";
		if (!(isNotFoundStatus && isNotFoundMessage)) throw err;
	}
	/**
	* Traverses JSON structure and converts fields that end with "At" to a Date object (fields such as "modifiedAt" or
	* "createdAt").
	*
	* If you want parse other fields as well, you can provide a custom matcher function shouldParseField(). This
	* admittedly awkward approach allows this function to be reused for various purposes without introducing potential
	* breaking changes.
	*
	* If the field cannot be converted to Date, it is left as is.
	*/
	function parseDateFields(input, shouldParseField = null, depth = 0) {
		if (depth > 3) return input;
		if (Array.isArray(input)) return input.map((child) => parseDateFields(child, shouldParseField, depth + 1));
		if (!input || typeof input !== "object") return input;
		return Object.entries(input).reduce((output, [k, v]) => {
			const isValObject = !!v && typeof v === "object";
			if (k.endsWith("At") || shouldParseField && shouldParseField(k)) if (v) {
				const d = new Date(v);
				output[k] = Number.isNaN(d.getTime()) ? v : d;
			} else output[k] = v;
			else if (isValObject || Array.isArray(v)) output[k] = parseDateFields(v, shouldParseField, depth + 1);
			else output[k] = v;
			return output;
		}, {});
	}
	/**
	* Helper function that converts array of webhooks to base64 string
	*/
	function stringifyWebhooksToBase64(webhooks) {
		if (!webhooks) return;
		const webhooksJson = JSON.stringify(webhooks);
		if (isNode()) return Buffer.from(webhooksJson, "utf8").toString("base64");
		const uint8Array = new TextEncoder().encode(webhooksJson);
		return btoa(String.fromCharCode(...uint8Array));
	}
	let gzipPromisified;
	/**
	* Gzip provided value, otherwise returns undefined.
	*/
	async function maybeGzipValue(value) {
		if (!isNode()) return;
		if (typeof value !== "string" && !Buffer.isBuffer(value)) return;
		if (Buffer.byteLength(value) >= MIN_GZIP_BYTES) {
			if (!gzipPromisified) {
				const { promisify } = await dynamicNodeImport("node:util");
				const { gzip } = await dynamicNodeImport("node:zlib");
				gzipPromisified = promisify(gzip);
			}
			return gzipPromisified(value);
		}
	}
	/**
	* Helper function slice the items from array to fit the max byte length.
	*/
	function sliceArrayByByteLength(array, maxByteLength, startIndex) {
		const stringByteLength = (str) => isNode() ? Buffer.byteLength(str) : new Blob([str]).size;
		if (stringByteLength(JSON.stringify(array)) < maxByteLength) return array;
		const slicedArray = [];
		let byteLength = 2;
		for (let i = 0; i < array.length; i++) {
			const item = array[i];
			const itemByteSize = stringByteLength(JSON.stringify(item));
			if (itemByteSize > maxByteLength) throw new Error(`RequestQueueClient.batchAddRequests: The size of the request with index: ${startIndex + i} exceeds the maximum allowed size (${maxByteLength} bytes).`);
			if (byteLength + itemByteSize >= maxByteLength) break;
			byteLength += itemByteSize;
			slicedArray.push(item);
		}
		return slicedArray;
	}
	function isNode() {
		return !!(typeof process !== "undefined" && process.versions && process.versions.node);
	}
	/**
	* Dynamic import wrapper that prevents bundlers from statically analyzing the import specifier.
	* Use this for Node.js-only modules that should not be included in browser bundles.
	*/
	async function dynamicNodeImport(specifier) {
		return await Promise.resolve(`${specifier}`).then((s) => tslib_1$6.__importStar(__require(s)));
	}
	function isBuffer(value) {
		return ow_1.default.isValid(value, ow_1.default.any(ow_1.default.buffer, ow_1.default.arrayBuffer, ow_1.default.typedArray));
	}
	function isStream(value) {
		return ow_1.default.isValid(value, ow_1.default.object.hasKeys("on", "pipe"));
	}
	function getVersionData() {
		if (typeof BROWSER_BUILD !== "undefined") return { version: VERSION };
		return require_package();
	}
	/**
	* Helper class to create async iterators from paginated list endpoints with exclusive start key.
	*/
	var PaginationIterator = class {
		constructor(options) {
			Object.defineProperty(this, "maxPageLimit", {
				enumerable: true,
				configurable: true,
				writable: true,
				value: void 0
			});
			Object.defineProperty(this, "getPage", {
				enumerable: true,
				configurable: true,
				writable: true,
				value: void 0
			});
			Object.defineProperty(this, "limit", {
				enumerable: true,
				configurable: true,
				writable: true,
				value: void 0
			});
			Object.defineProperty(this, "exclusiveStartId", {
				enumerable: true,
				configurable: true,
				writable: true,
				value: void 0
			});
			this.maxPageLimit = options.maxPageLimit;
			this.limit = options.limit;
			this.exclusiveStartId = options.exclusiveStartId;
			this.getPage = options.getPage;
		}
		async *[Symbol.asyncIterator]() {
			let nextPageExclusiveStartId;
			let iterateItemCount = 0;
			while (true) {
				const pageLimit = this.limit ? Math.min(this.maxPageLimit, this.limit - iterateItemCount) : this.maxPageLimit;
				const pageExclusiveStartId = nextPageExclusiveStartId || this.exclusiveStartId;
				const page = await this.getPage({
					limit: pageLimit,
					exclusiveStartId: pageExclusiveStartId
				});
				if (page.items.length === 0) return;
				yield page;
				iterateItemCount += page.items.length;
				if (this.limit && iterateItemCount >= this.limit) return;
				nextPageExclusiveStartId = page.items[page.items.length - 1].id;
			}
		}
	};
	exports.PaginationIterator = PaginationIterator;
	function cast(input) {
		return input;
	}
	function asArray(value) {
		if (Array.isArray(value)) return value;
		return [value];
	}
	/**
	* Adds query parameters to a given URL based on the provided options object.
	*/
	function applyQueryParamsToUrl(url, options) {
		for (const [key, value] of Object.entries(options !== null && options !== void 0 ? options : {})) {
			if (value === void 0) continue;
			if (Array.isArray(value)) {
				url.searchParams.set(key, value.join(","));
				continue;
			}
			url.searchParams.set(key, String(value));
		}
		return url;
	}
}));
//#endregion
//#region node_modules/apify-client/dist/body_parser.js
var require_body_parser = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.maybeParseBody = maybeParseBody;
	exports.isomorphicBufferToString = isomorphicBufferToString;
	const content_type_1 = __require("tslib").__importDefault(require_content_type());
	const utils_1 = require_utils();
	const CONTENT_TYPE_JSON = "application/json";
	const STRINGIFIABLE_CONTENT_TYPE_RXS = [
		new RegExp(`^${CONTENT_TYPE_JSON}`, "i"),
		/^application\/.*xml$/i,
		/^text\//i
	];
	/**
	* Parses a Buffer or ArrayBuffer using the provided content type header.
	*
	* - application/json is returned as a parsed object.
	* - application/*xml and text/* are returned as strings.
	* - everything else is returned as original body.
	*
	* If the header includes a charset, the body will be stringified only
	* if the charset represents a known encoding to Node.js or Browser.
	*/
	function maybeParseBody(body, contentTypeHeader) {
		let contentType;
		let charset;
		try {
			const result = content_type_1.default.parse(contentTypeHeader);
			contentType = result.type;
			charset = result.parameters.charset;
		} catch {
			return body;
		}
		if (!areDataStringifiable(contentType, charset)) return body;
		const dataString = isomorphicBufferToString(body, charset);
		return contentType === CONTENT_TYPE_JSON ? JSON.parse(dataString) : dataString;
	}
	function isomorphicBufferToString(buffer, encoding) {
		if (buffer.constructor.name !== ArrayBuffer.name) return buffer.toString(encoding);
		return new TextDecoder().decode(new Uint8Array(buffer));
	}
	function isCharsetStringifiable(charset) {
		if (!charset) return true;
		if ((0, utils_1.isNode)()) return Buffer.isEncoding(charset);
		return charset.toLowerCase().replace("-", "") === "utf8";
	}
	function isContentTypeStringifiable(contentType) {
		if (!contentType) return false;
		return STRINGIFIABLE_CONTENT_TYPE_RXS.some((rx) => rx.test(contentType));
	}
	function areDataStringifiable(contentType, charset) {
		return isContentTypeStringifiable(contentType) && isCharsetStringifiable(charset);
	}
}));
//#endregion
//#region node_modules/apify-client/dist/apify_api_error.js
var require_apify_api_error = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.ApifyApiError = void 0;
	const body_parser_1 = require_body_parser();
	const utils_1 = require_utils();
	/**
	* Examples of capturing groups for "...at ActorCollectionClient._list (/Users/..."
	* 0: "at ActorCollectionClient._list ("
	* 1: undefined
	* 2: "ActorCollectionClient"
	* 3: undefined
	* 4: "list"
	* @private
	*/
	const CLIENT_METHOD_REGEX = /at( async)? ([A-Za-z]+(Collection)?Client)\._?([A-Za-z]+) \(/;
	/**
	* An `ApifyApiError` is thrown for successful HTTP requests that reach the API,
	* but the API responds with an error response. Typically, those are rate limit
	* errors and internal errors, which are automatically retried, or validation
	* errors, which are thrown immediately, because a correction by the user is
	* needed.
	*/
	var ApifyApiError = class extends Error {
		/**
		* @hidden
		*/
		constructor(response, attempt) {
			var _a;
			let message;
			let type;
			let responseData = response.data;
			let errorData;
			if ((0, utils_1.isBuffer)(responseData)) try {
				responseData = JSON.parse((0, body_parser_1.isomorphicBufferToString)(response.data, "utf-8"));
			} catch {}
			if (responseData && responseData.error) {
				const { error } = responseData;
				message = error.message;
				type = error.type;
				errorData = error.data;
			} else if (responseData) {
				let dataString;
				try {
					dataString = JSON.stringify(responseData, null, 2);
				} catch {
					dataString = `${responseData}`;
				}
				message = `Unexpected error: ${dataString}`;
			}
			super(message);
			Object.defineProperty(this, "name", {
				enumerable: true,
				configurable: true,
				writable: true,
				value: void 0
			});
			/**
			* The invoked resource client and the method. Known issue: Sometimes it displays
			* as `unknown` because it can't be parsed from a stack trace.
			*/
			Object.defineProperty(this, "clientMethod", {
				enumerable: true,
				configurable: true,
				writable: true,
				value: void 0
			});
			/**
			* HTTP status code of the error.
			*/
			Object.defineProperty(this, "statusCode", {
				enumerable: true,
				configurable: true,
				writable: true,
				value: void 0
			});
			/**
			* The type of the error, as returned by the API.
			*/
			Object.defineProperty(this, "type", {
				enumerable: true,
				configurable: true,
				writable: true,
				value: void 0
			});
			/**
			* Number of the API call attempt.
			*/
			Object.defineProperty(this, "attempt", {
				enumerable: true,
				configurable: true,
				writable: true,
				value: void 0
			});
			/**
			* HTTP method of the API call.
			*/
			Object.defineProperty(this, "httpMethod", {
				enumerable: true,
				configurable: true,
				writable: true,
				value: void 0
			});
			/**
			* Full path of the API endpoint (URL excluding origin).
			*/
			Object.defineProperty(this, "path", {
				enumerable: true,
				configurable: true,
				writable: true,
				value: void 0
			});
			/**
			* Original stack trace of the exception. It is replaced
			* by a more informative stack with API call information.
			*/
			Object.defineProperty(this, "originalStack", {
				enumerable: true,
				configurable: true,
				writable: true,
				value: void 0
			});
			/**
			* Additional data provided by the API about the error
			*/
			Object.defineProperty(this, "data", {
				enumerable: true,
				configurable: true,
				writable: true,
				value: void 0
			});
			this.name = this.constructor.name;
			this.clientMethod = this._extractClientAndMethodFromStack();
			this.statusCode = response.status;
			this.type = type;
			this.attempt = attempt;
			this.httpMethod = (_a = response.config) === null || _a === void 0 ? void 0 : _a.method;
			this.path = this._safelyParsePathFromResponse(response);
			const stack = this.stack;
			this.originalStack = stack.slice(stack.indexOf("\n"));
			this.stack = this._createApiStack();
			this.data = errorData;
		}
		_safelyParsePathFromResponse(response) {
			var _a;
			const urlString = (_a = response.config) === null || _a === void 0 ? void 0 : _a.url;
			let url;
			try {
				url = new URL(urlString);
			} catch {
				return urlString;
			}
			return url.pathname + url.search;
		}
		_extractClientAndMethodFromStack() {
			const match = this.stack.match(CLIENT_METHOD_REGEX);
			if (match) return `${match[2]}.${match[4]}`;
			return "unknown";
		}
		/**
		* Creates a better looking and more informative stack that will be printed
		* out when API errors are thrown.
		*
		* Example:
		*
		* ApifyApiError: Actor task was not found
		*   clientMethod: TaskClient.start
		*   statusCode: 404
		*   type: record-not-found
		*   attempt: 1
		*   httpMethod: post
		*   path: /v2/actor-tasks/user~my-task/runs
		*/
		_createApiStack() {
			const { name, ...props } = this;
			const stack = Object.entries(props).map(([k, v]) => {
				if (k === "originalStack") k = "stack";
				return `  ${k}: ${v}`;
			}).join("\n");
			return `${name}: ${this.message}\n${stack}`;
		}
	};
	exports.ApifyApiError = ApifyApiError;
}));
//#endregion
//#region node_modules/apify-client/dist/interceptors.js
var require_interceptors = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.responseInterceptors = exports.requestInterceptors = exports.InvalidResponseBodyError = void 0;
	const tslib_1$5 = __require("tslib");
	const axios_1 = tslib_1$5.__importStar(require_axios());
	const content_type_1 = tslib_1$5.__importDefault(require_content_type());
	const body_parser_1 = require_body_parser();
	const utils_1 = require_utils();
	/**
	* This error exists for the quite common situation, where only a partial JSON response is received and
	* an attempt to parse the JSON throws an error. In most cases this can be resolved by retrying the
	* request. We do that by identifying this error in HttpClient.
	*
	* The properties mimic AxiosError for easier integration in HttpClient error handling.
	*/
	var InvalidResponseBodyError = class extends Error {
		constructor(response, cause) {
			super(`Response body could not be parsed.\nCause:${cause.message}`);
			Object.defineProperty(this, "code", {
				enumerable: true,
				configurable: true,
				writable: true,
				value: void 0
			});
			Object.defineProperty(this, "response", {
				enumerable: true,
				configurable: true,
				writable: true,
				value: void 0
			});
			this.name = this.constructor.name;
			this.code = "invalid-response-body";
			this.response = response;
			this.cause = cause;
		}
	};
	exports.InvalidResponseBodyError = InvalidResponseBodyError;
	function serializeRequest(config) {
		var _a, _b;
		const [defaultTransform] = axios_1.default.defaults.transformRequest;
		const data = defaultTransform(config.data, config.headers);
		if (config.stringifyFunctions) {
			const contentTypeHeader = ((_a = config.headers) === null || _a === void 0 ? void 0 : _a["Content-Type"]) || ((_b = config.headers) === null || _b === void 0 ? void 0 : _b["content-type"]);
			try {
				const { type } = content_type_1.default.parse(contentTypeHeader);
				if (type === "application/json" && typeof config.data === "object") config.data = stringifyWithFunctions(config.data);
				else config.data = data;
			} catch {
				config.data = data;
			}
		} else config.data = data;
		return config;
	}
	function ensureHeadersPrototype(config) {
		if (config.headers && !(config.headers instanceof axios_1.AxiosHeaders)) Object.setPrototypeOf(config.headers, axios_1.AxiosHeaders.prototype);
		return config;
	}
	/**
	* JSON.stringify() that serializes functions to string instead
	* of replacing them with null or removing them.
	*/
	function stringifyWithFunctions(obj) {
		return JSON.stringify(obj, (_key, value) => {
			return typeof value === "function" ? value.toString() : value;
		});
	}
	async function maybeGzipRequest(config) {
		var _a, _b;
		if ((_a = config.headers) === null || _a === void 0 ? void 0 : _a["content-encoding"]) return config;
		const maybeZippedData = await (0, utils_1.maybeGzipValue)(config.data);
		if (maybeZippedData) {
			(_b = config.headers) !== null && _b !== void 0 || (config.headers = {});
			config.headers["content-encoding"] = "gzip";
			config.data = maybeZippedData;
		}
		return config;
	}
	function parseResponseData(response) {
		if (!response.data || response.config.responseType !== "arraybuffer" || response.config.forceBuffer) return response;
		if ((0, utils_1.isNode)() ? !response.data.length : !response.data.byteLength) {
			response.data = void 0;
			return response;
		}
		const contentTypeHeader = response.headers["content-type"];
		try {
			response.data = (0, body_parser_1.maybeParseBody)(response.data, contentTypeHeader);
		} catch (err) {
			throw new InvalidResponseBodyError(response, err);
		}
		return response;
	}
	exports.requestInterceptors = [
		maybeGzipRequest,
		serializeRequest,
		ensureHeadersPrototype
	];
	exports.responseInterceptors = [parseResponseData];
}));
//#endregion
//#region node_modules/apify-client/dist/http_client.js
var require_http_client = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.HttpClient = void 0;
	const tslib_1$4 = __require("tslib");
	const async_retry_1 = tslib_1$4.__importDefault(require_lib());
	const axios_1 = tslib_1$4.__importStar(require_axios());
	const consts_1 = require_cjs();
	const apify_api_error_1 = require_apify_api_error();
	const interceptors_1 = require_interceptors();
	const utils_1 = require_utils();
	const { version } = (0, utils_1.getVersionData)();
	const RATE_LIMIT_EXCEEDED_STATUS_CODE = 429;
	var HttpClient = class {
		constructor(options) {
			Object.defineProperty(this, "stats", {
				enumerable: true,
				configurable: true,
				writable: true,
				value: void 0
			});
			Object.defineProperty(this, "maxRetries", {
				enumerable: true,
				configurable: true,
				writable: true,
				value: void 0
			});
			Object.defineProperty(this, "minDelayBetweenRetriesMillis", {
				enumerable: true,
				configurable: true,
				writable: true,
				value: void 0
			});
			Object.defineProperty(this, "userProvidedRequestInterceptors", {
				enumerable: true,
				configurable: true,
				writable: true,
				value: void 0
			});
			Object.defineProperty(this, "logger", {
				enumerable: true,
				configurable: true,
				writable: true,
				value: void 0
			});
			Object.defineProperty(this, "timeoutMillis", {
				enumerable: true,
				configurable: true,
				writable: true,
				value: void 0
			});
			Object.defineProperty(this, "httpAgent", {
				enumerable: true,
				configurable: true,
				writable: true,
				value: void 0
			});
			Object.defineProperty(this, "httpsAgent", {
				enumerable: true,
				configurable: true,
				writable: true,
				value: void 0
			});
			Object.defineProperty(this, "axios", {
				enumerable: true,
				configurable: true,
				writable: true,
				value: void 0
			});
			Object.defineProperty(this, "workflowKey", {
				enumerable: true,
				configurable: true,
				writable: true,
				value: void 0
			});
			Object.defineProperty(this, "nodeInitPromise", {
				enumerable: true,
				configurable: true,
				writable: true,
				value: void 0
			});
			Object.defineProperty(this, "userAgentSuffix", {
				enumerable: true,
				configurable: true,
				writable: true,
				value: void 0
			});
			const { token } = options;
			this.stats = options.apifyClientStats;
			this.maxRetries = options.maxRetries;
			this.minDelayBetweenRetriesMillis = options.minDelayBetweenRetriesMillis;
			this.userProvidedRequestInterceptors = options.requestInterceptors;
			this.timeoutMillis = options.timeoutSecs * 1e3;
			this.logger = options.logger;
			this.workflowKey = options.workflowKey || process.env[consts_1.APIFY_ENV_VARS.WORKFLOW_KEY];
			this.userAgentSuffix = options.userAgentSuffix;
			this._onRequestRetry = this._onRequestRetry.bind(this);
			this.axios = axios_1.default.create({
				proxy: false,
				paramsSerializer: (params) => {
					const formattedParams = Object.entries(params).filter(([, value]) => value !== void 0).map(([key, value]) => {
						if (value instanceof Date) return [key, value.toISOString()];
						const updatedValue = typeof value === "boolean" ? Number(value) : value;
						return [key, String(updatedValue)];
					});
					return new URLSearchParams(formattedParams).toString();
				},
				validateStatus: null,
				transformRequest: void 0,
				transformResponse: void 0,
				responseType: "arraybuffer",
				timeout: this.timeoutMillis,
				maxBodyLength: Infinity,
				maxContentLength: -1
			});
			this.axios.defaults.headers = new axios_1.AxiosHeaders();
			if (this.workflowKey) this.axios.defaults.headers["X-Apify-Workflow-Key"] = this.workflowKey;
			if (token) this.axios.defaults.headers.Authorization = `Bearer ${token}`;
			interceptors_1.requestInterceptors.forEach((i) => this.axios.interceptors.request.use(i));
			this.userProvidedRequestInterceptors.forEach((i) => this.axios.interceptors.request.use(i));
			interceptors_1.responseInterceptors.forEach((i) => this.axios.interceptors.response.use(i));
		}
		async ensureNodeInit() {
			var _a;
			if (!(0, utils_1.isNode)()) return;
			(_a = this.nodeInitPromise) !== null && _a !== void 0 || (this.nodeInitPromise = this.initNode());
			return this.nodeInitPromise;
		}
		async initNode() {
			if (!(0, utils_1.isNode)()) return;
			const [{ ProxyAgent }, os] = await Promise.all([(0, utils_1.dynamicNodeImport)("proxy-agent"), (0, utils_1.dynamicNodeImport)("node:os")]);
			const proxyAgent = new ProxyAgent({
				keepAlive: true,
				timeout: this.timeoutMillis,
				keepAliveMsecs: 15e3,
				maxSockets: 256,
				maxFreeSockets: 256,
				scheduling: "lifo"
			});
			this.httpAgent = proxyAgent;
			this.httpsAgent = proxyAgent;
			const setNoDelay = (socket) => {
				socket.setNoDelay(true);
			};
			this.httpAgent.on("socket", setNoDelay);
			this.httpsAgent.on("socket", setNoDelay);
			this.axios.defaults.httpAgent = this.httpAgent;
			this.axios.defaults.httpsAgent = this.httpsAgent;
			const isAtHome = !!process.env[consts_1.APIFY_ENV_VARS.IS_AT_HOME];
			let userAgent = `ApifyClient/${version} (${os.type()}; Node/${process.version}); isAtHome/${isAtHome}`;
			if (this.userAgentSuffix) userAgent += `; ${(0, utils_1.asArray)(this.userAgentSuffix).join("; ")}`;
			this.axios.defaults.headers["User-Agent"] = userAgent;
		}
		async call(config) {
			await this.ensureNodeInit();
			this.stats.calls++;
			const makeRequest = this._createRequestHandler(config);
			return (0, async_retry_1.default)(makeRequest, {
				retries: this.maxRetries,
				minTimeout: this.minDelayBetweenRetriesMillis,
				onRetry: this._onRequestRetry
			});
		}
		_informAboutStreamNoRetry() {
			this.logger.warningOnce("Request body was a stream - retrying will not work, as part of it was already consumed.");
			this.logger.warningOnce("If you want Apify client to handle retries for you, collect the stream into a buffer before sending it.");
		}
		/**
		* Successful responses are returned, errors and unsuccessful
		* status codes are retried. See the following functions for the
		* retrying logic.
		*/
		_createRequestHandler(config) {
			const makeRequest = async (stopTrying, attempt) => {
				var _a;
				this.stats.requests++;
				let response;
				const requestIsStream = (0, utils_1.isStream)(config.data);
				try {
					if (requestIsStream) config = {
						...config,
						maxRedirects: 0
					};
					config.timeout = Math.min(this.timeoutMillis, ((_a = config.timeout) !== null && _a !== void 0 ? _a : this.timeoutMillis) * 2 ** (attempt - 1));
					response = await this.axios.request(config);
					if (this._isStatusOk(response.status)) return response;
				} catch (err) {
					return (0, utils_1.cast)(this._handleRequestError(err, config, stopTrying));
				}
				if (response.status === RATE_LIMIT_EXCEEDED_STATUS_CODE) this.stats.addRateLimitError(attempt);
				const apiError = new apify_api_error_1.ApifyApiError(response, attempt);
				if (this._isStatusCodeRetryable(response.status)) if (requestIsStream) this._informAboutStreamNoRetry();
				else throw apiError;
				stopTrying(apiError);
				return response;
			};
			return makeRequest;
		}
		_isStatusOk(statusCode) {
			return statusCode < 300;
		}
		/**
		* Handles all unexpected errors that can happen, but are not
		* Apify API typed errors. E.g. network errors, timeouts and so on.
		*/
		_handleRequestError(err, config, stopTrying) {
			if (this._isTimeoutError(err) && config.doNotRetryTimeouts) return stopTrying(err);
			if (this._isRetryableError(err)) if ((0, utils_1.isStream)(config.data)) this._informAboutStreamNoRetry();
			else throw err;
			return stopTrying(err);
		}
		/**
		* Axios calls req.abort() on timeouts so timeout errors will
		* have a code ECONNABORTED.
		*/
		_isTimeoutError(err) {
			return err.code === "ECONNABORTED";
		}
		/**
		* We don't want to retry every exception thrown from Axios.
		* The common denominator for retryable errors are network issues.
		* @param {Error} err
		* @private
		*/
		_isRetryableError(err) {
			return this._isNetworkError(err) || this._isResponseBodyInvalid(err);
		}
		/**
		* When a network connection to our API is interrupted in the middle of streaming
		* a response, the request often does not fail, but simply contains
		* an incomplete response. This can often be fixed by retrying.
		*/
		_isResponseBodyInvalid(err) {
			return err instanceof interceptors_1.InvalidResponseBodyError;
		}
		/**
		* When a network request is attempted by axios and fails,
		* it throws an AxiosError, which will have the request
		* and config (and other) properties.
		*/
		_isNetworkError(err) {
			const hasRequest = err.request && typeof err.request === "object";
			const hasConfig = err.config && typeof err.config === "object";
			return hasRequest && hasConfig;
		}
		/**
		* We retry 429 (rate limit) and 500+.
		* For status codes 300-499 (except 429) we do not retry the request,
		* because it's probably caused by invalid url (redirect 3xx) or invalid user input (4xx).
		*/
		_isStatusCodeRetryable(statusCode) {
			return statusCode === RATE_LIMIT_EXCEEDED_STATUS_CODE || statusCode >= 500;
		}
		_onRequestRetry(error, attempt) {
			if (attempt === Math.round(this.maxRetries / 2)) this.logger.warning(`API request failed ${attempt} times. Max attempts: ${this.maxRetries + 1}.\nCause:${error.stack}`);
		}
	};
	exports.HttpClient = HttpClient;
}));
//#endregion
//#region node_modules/apify-client/dist/base/api_client.js
var require_api_client = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.ApiClient = void 0;
	/** @private */
	var ApiClient = class {
		constructor(options) {
			Object.defineProperty(this, "id", {
				enumerable: true,
				configurable: true,
				writable: true,
				value: void 0
			});
			Object.defineProperty(this, "safeId", {
				enumerable: true,
				configurable: true,
				writable: true,
				value: void 0
			});
			Object.defineProperty(this, "baseUrl", {
				enumerable: true,
				configurable: true,
				writable: true,
				value: void 0
			});
			Object.defineProperty(this, "publicBaseUrl", {
				enumerable: true,
				configurable: true,
				writable: true,
				value: void 0
			});
			Object.defineProperty(this, "resourcePath", {
				enumerable: true,
				configurable: true,
				writable: true,
				value: void 0
			});
			Object.defineProperty(this, "url", {
				enumerable: true,
				configurable: true,
				writable: true,
				value: void 0
			});
			Object.defineProperty(this, "apifyClient", {
				enumerable: true,
				configurable: true,
				writable: true,
				value: void 0
			});
			Object.defineProperty(this, "httpClient", {
				enumerable: true,
				configurable: true,
				writable: true,
				value: void 0
			});
			Object.defineProperty(this, "params", {
				enumerable: true,
				configurable: true,
				writable: true,
				value: void 0
			});
			const { baseUrl, publicBaseUrl, apifyClient, httpClient, resourcePath, id, params = {} } = options;
			this.id = id;
			this.safeId = id && this._toSafeId(id);
			this.baseUrl = baseUrl;
			this.publicBaseUrl = publicBaseUrl;
			this.resourcePath = resourcePath;
			this.url = id ? `${baseUrl}/${resourcePath}/${this.safeId}` : `${baseUrl}/${resourcePath}`;
			this.apifyClient = apifyClient;
			this.httpClient = httpClient;
			this.params = params;
		}
		_subResourceOptions(moreOptions) {
			return {
				baseUrl: this._url(),
				publicBaseUrl: this.publicBaseUrl,
				apifyClient: this.apifyClient,
				httpClient: this.httpClient,
				params: this._params(),
				...moreOptions
			};
		}
		_url(path) {
			return path ? `${this.url}/${path}` : this.url;
		}
		_publicUrl(path) {
			const url = this.id ? `${this.publicBaseUrl}/${this.resourcePath}/${this.safeId}` : `${this.publicBaseUrl}/${this.resourcePath}`;
			return path ? `${url}/${path}` : url;
		}
		_params(endpointParams) {
			return {
				...this.params,
				...endpointParams
			};
		}
		_toSafeId(id) {
			return id.replace("/", "~");
		}
		/**
		* Returns async iterator to iterate through all items and Promise that can be awaited to get first page of results.
		*/
		_listPaginatedFromCallback(getPaginatedList, options = {}) {
			const minForLimitParam = (a, b) => {
				if (a === 0) a = void 0;
				if (b === 0) b = void 0;
				if (a === void 0) return b;
				if (b === void 0) return a;
				return Math.min(a, b);
			};
			const paginatedListPromise = getPaginatedList({
				...options,
				limit: minForLimitParam(options.limit, options.chunkSize)
			});
			async function* asyncGenerator() {
				var _a;
				let currentPage = await paginatedListPromise;
				yield* currentPage.items;
				const offset = (_a = options.offset) !== null && _a !== void 0 ? _a : 0;
				const limit = Math.min(options.limit || currentPage.total, currentPage.total);
				let currentOffset = offset + currentPage.items.length;
				let remainingItems = Math.min(currentPage.total - offset, limit) - currentPage.items.length;
				while (currentPage.items.length > 0 && remainingItems > 0) {
					currentPage = await getPaginatedList({
						...options,
						limit: minForLimitParam(remainingItems, options.chunkSize),
						offset: currentOffset
					});
					yield* currentPage.items;
					currentOffset += currentPage.items.length;
					remainingItems -= currentPage.items.length;
				}
			}
			return Object.defineProperty(paginatedListPromise, Symbol.asyncIterator, { value: asyncGenerator });
		}
	};
	exports.ApiClient = ApiClient;
}));
//#endregion
//#region node_modules/apify-client/dist/base/resource_client.js
var require_resource_client = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.ResourceClient = exports.DEFAULT_TIMEOUT_MILLIS = exports.MEDIUM_TIMEOUT_MILLIS = exports.SMALL_TIMEOUT_MILLIS = void 0;
	const consts_1 = require_cjs();
	const utils_1 = require_utils();
	const api_client_1 = require_api_client();
	/**
	* We need to supply some number for the API,
	* because it would not accept "Infinity".
	* 999999 seconds is more than 10 days.
	*/
	const MAX_WAIT_FOR_FINISH = 999999;
	exports.SMALL_TIMEOUT_MILLIS = 5 * 1e3;
	exports.MEDIUM_TIMEOUT_MILLIS = 30 * 1e3;
	exports.DEFAULT_TIMEOUT_MILLIS = 360 * 1e3;
	/**
	* Resource client.
	* @private
	*/
	var ResourceClient = class extends api_client_1.ApiClient {
		async _get(options = {}, timeoutMillis) {
			const requestOpts = {
				url: this._url(),
				method: "GET",
				params: this._params(options),
				timeout: timeoutMillis
			};
			try {
				const response = await this.httpClient.call(requestOpts);
				return (0, utils_1.parseDateFields)((0, utils_1.pluckData)(response.data));
			} catch (err) {
				(0, utils_1.catchNotFoundOrThrow)(err);
			}
		}
		async _update(newFields, timeoutMillis) {
			const response = await this.httpClient.call({
				url: this._url(),
				method: "PUT",
				params: this._params(),
				data: newFields,
				timeout: timeoutMillis
			});
			return (0, utils_1.parseDateFields)((0, utils_1.pluckData)(response.data));
		}
		async _delete(timeoutMillis) {
			try {
				await this.httpClient.call({
					url: this._url(),
					method: "DELETE",
					params: this._params(),
					timeout: timeoutMillis
				});
			} catch (err) {
				(0, utils_1.catchNotFoundOrThrow)(err);
			}
		}
		/**
		* This function is used in Build and Run endpoints so it's kept
		* here to stay DRY.
		*/
		async _waitForFinish(options = {}) {
			const { waitSecs = MAX_WAIT_FOR_FINISH } = options;
			const waitMillis = waitSecs * 1e3;
			let job;
			const startedAt = Date.now();
			const shouldRepeat = () => {
				if (Date.now() - startedAt >= waitMillis) return false;
				return !(job && consts_1.ACT_JOB_TERMINAL_STATUSES.includes(job.status));
			};
			do {
				const millisSinceStart = Date.now() - startedAt;
				const remainingWaitSeconds = Math.round((waitMillis - millisSinceStart) / 1e3);
				const waitForFinish = Math.max(0, remainingWaitSeconds);
				const requestOpts = {
					url: this._url(),
					method: "GET",
					params: this._params({ waitForFinish })
				};
				try {
					const response = await this.httpClient.call(requestOpts);
					job = (0, utils_1.parseDateFields)((0, utils_1.pluckData)(response.data));
				} catch (err) {
					(0, utils_1.catchNotFoundOrThrow)(err);
					job = void 0;
				}
				if (!job) await new Promise((resolve) => {
					setTimeout(resolve, 250);
				});
			} while (shouldRepeat());
			if (!job) {
				const jobName = this.constructor.name.match(/(\w+)Client/)[1].toLowerCase();
				throw new Error(`Waiting for ${jobName} to finish failed. Cannot fetch actor ${jobName} details from the server.`);
			}
			return job;
		}
	};
	exports.ResourceClient = ResourceClient;
}));
//#endregion
//#region node_modules/apify-client/dist/resource_clients/actor_env_var.js
var require_actor_env_var = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.ActorEnvVarClient = void 0;
	const ow_1$22 = __require("tslib").__importDefault(require_dist$1());
	const resource_client_1 = require_resource_client();
	/**
	* Client for managing a specific Actor environment variable.
	*
	* Environment variables are key-value pairs that are available to the Actor during execution.
	* This client provides methods to get, update, and delete environment variables.
	*
	* @example
	* ```javascript
	* const client = new ApifyClient({ token: 'my-token' });
	* const actorClient = client.actor('my-actor-id');
	* const versionClient = actorClient.version('0.1');
	*
	* // Get an environment variable
	* const envVarClient = versionClient.envVar('MY_VAR');
	* const envVar = await envVarClient.get();
	*
	* // Update environment variable
	* await envVarClient.update({ value: 'new-value' });
	* ```
	*
	* @see https://docs.apify.com/platform/actors/development/programming-interface/environment-variables
	*/
	var ActorEnvVarClient = class extends resource_client_1.ResourceClient {
		/**
		* @hidden
		*/
		constructor(options) {
			super({
				resourcePath: "env-vars",
				...options
			});
		}
		/**
		* Retrieves the environment variable.
		*
		* @returns The environment variable object, or `undefined` if it does not exist.
		* @see https://docs.apify.com/api/v2/act-version-env-var-get
		*/
		async get() {
			return this._get();
		}
		/**
		* Updates the environment variable.
		*
		* @param actorEnvVar - The updated environment variable data.
		* @returns The updated environment variable object.
		* @see https://docs.apify.com/api/v2/act-version-env-var-put
		*/
		async update(actorEnvVar) {
			(0, ow_1$22.default)(actorEnvVar, ow_1$22.default.object);
			return this._update(actorEnvVar);
		}
		/**
		* Deletes the environment variable.
		*
		* @see https://docs.apify.com/api/v2/act-version-env-var-delete
		*/
		async delete() {
			return this._delete();
		}
	};
	exports.ActorEnvVarClient = ActorEnvVarClient;
}));
//#endregion
//#region node_modules/apify-client/dist/base/resource_collection_client.js
var require_resource_collection_client = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.ResourceCollectionClient = void 0;
	const utils_1 = require_utils();
	const api_client_1 = require_api_client();
	/**
	* Resource collection client.
	* @private
	*/
	var ResourceCollectionClient = class extends api_client_1.ApiClient {
		/**
		* @private
		*/
		async _list(options = {}) {
			const response = await this.httpClient.call({
				url: this._url(),
				method: "GET",
				params: this._params(options)
			});
			return (0, utils_1.parseDateFields)((0, utils_1.pluckData)(response.data));
		}
		/**
		* Returns async iterator to iterate through all items and Promise that can be awaited to get first page of results.
		*/
		_listPaginated(options = {}) {
			return this._listPaginatedFromCallback(this._list.bind(this), options);
		}
		async _create(resource) {
			const response = await this.httpClient.call({
				url: this._url(),
				method: "POST",
				params: this._params(),
				data: resource
			});
			return (0, utils_1.parseDateFields)((0, utils_1.pluckData)(response.data));
		}
		async _getOrCreate(name, resource) {
			const response = await this.httpClient.call({
				url: this._url(),
				method: "POST",
				params: this._params({ name }),
				data: resource
			});
			return (0, utils_1.parseDateFields)((0, utils_1.pluckData)(response.data));
		}
	};
	exports.ResourceCollectionClient = ResourceCollectionClient;
}));
//#endregion
//#region node_modules/apify-client/dist/resource_clients/actor_env_var_collection.js
var require_actor_env_var_collection = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.ActorEnvVarCollectionClient = void 0;
	const ow_1$21 = __require("tslib").__importDefault(require_dist$1());
	const resource_collection_client_1 = require_resource_collection_client();
	/**
	* Client for managing the collection of environment variables for an Actor version.
	*
	* Environment variables are key-value pairs that are available to the Actor during execution.
	* This client provides methods to list and create environment variables.
	*
	* @example
	* ```javascript
	* const client = new ApifyClient({ token: 'my-token' });
	* const actorClient = client.actor('my-actor-id');
	* const versionClient = actorClient.version('0.1');
	*
	* // List all environment variables
	* const envVarsClient = versionClient.envVars();
	* const { items } = await envVarsClient.list();
	*
	* // Create a new environment variable
	* const newEnvVar = await envVarsClient.create({
	*   name: 'MY_VAR',
	*   value: 'my-value',
	*   isSecret: false
	* });
	* ```
	*
	* @see https://docs.apify.com/platform/actors/development/programming-interface/environment-variables
	*/
	var ActorEnvVarCollectionClient = class extends resource_collection_client_1.ResourceCollectionClient {
		/**
		* @hidden
		*/
		constructor(options) {
			super({
				resourcePath: "env-vars",
				...options
			});
		}
		/**
		* Lists all environment variables of this Actor version.
		*
		* Awaiting the return value (as you would with a Promise) will result in a single API call. The amount of fetched
		* items in a single API call is limited.
		* ```javascript
		* const paginatedList = await client.list();
		*```
		*
		* Asynchronous iteration is also supported. This will fetch additional pages if needed until all items are
		* retrieved.
		*
		* ```javascript
		* for await (const singleItem of client.list()) {...}
		* ```
		*
		* @returns A paginated iterator of environment variables.
		* @see https://docs.apify.com/api/v2/act-version-env-vars-get
		*/
		list(_options = {}) {
			return this._listPaginated();
		}
		/**
		* Creates a new environment variable for this Actor version.
		*
		* @param actorEnvVar - The environment variable data.
		* @returns The created environment variable object.
		* @see https://docs.apify.com/api/v2/act-version-env-vars-post
		*/
		async create(actorEnvVar) {
			(0, ow_1$21.default)(actorEnvVar, ow_1$21.default.optional.object);
			return this._create(actorEnvVar);
		}
	};
	exports.ActorEnvVarCollectionClient = ActorEnvVarCollectionClient;
}));
//#endregion
//#region node_modules/apify-client/dist/resource_clients/actor_version.js
var require_actor_version = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.ActorSourceType = exports.ActorVersionClient = void 0;
	const ow_1$20 = __require("tslib").__importDefault(require_dist$1());
	const resource_client_1 = require_resource_client();
	const actor_env_var_1 = require_actor_env_var();
	const actor_env_var_collection_1 = require_actor_env_var_collection();
	/**
	* Client for managing a specific Actor version.
	*
	* Actor versions represent specific builds or snapshots of an Actor's code. This client provides
	* methods to get, update, and delete versions, as well as manage their environment variables.
	*
	* @example
	* ```javascript
	* const client = new ApifyClient({ token: 'my-token' });
	* const actorClient = client.actor('my-actor-id');
	*
	* // Get a specific version
	* const versionClient = actorClient.version('0.1');
	* const version = await versionClient.get();
	*
	* // Update version
	* await versionClient.update({ buildTag: 'latest' });
	* ```
	*
	* @see https://docs.apify.com/api/v2/act-versions-get
	*/
	var ActorVersionClient = class extends resource_client_1.ResourceClient {
		/**
		* @hidden
		*/
		constructor(options) {
			super({
				resourcePath: "versions",
				...options
			});
		}
		/**
		* Retrieves the Actor version.
		*
		* @returns The Actor version object, or `undefined` if it does not exist.
		* @see https://docs.apify.com/api/v2/act-version-get
		*/
		async get() {
			return this._get();
		}
		/**
		* Updates the Actor version with the specified fields.
		*
		* @param newFields - Fields to update.
		* @returns The updated Actor version object.
		* @see https://docs.apify.com/api/v2/act-version-put
		*/
		async update(newFields) {
			(0, ow_1$20.default)(newFields, ow_1$20.default.object);
			return this._update(newFields);
		}
		/**
		* Deletes the Actor version.
		*
		* @see https://docs.apify.com/api/v2/act-version-delete
		*/
		async delete() {
			return this._delete();
		}
		/**
		* Returns a client for the specified environment variable of this Actor version.
		*
		* @param envVarName - Name of the environment variable.
		* @returns A client for the environment variable.
		* @see https://docs.apify.com/api/v2/act-version-env-var-get
		*/
		envVar(envVarName) {
			(0, ow_1$20.default)(envVarName, ow_1$20.default.string);
			return new actor_env_var_1.ActorEnvVarClient(this._subResourceOptions({ id: envVarName }));
		}
		/**
		* Returns a client for the environment variables of this Actor version.
		*
		* @returns A client for the Actor version's environment variables.
		* @see https://docs.apify.com/api/v2/act-version-env-vars-get
		*/
		envVars() {
			return new actor_env_var_collection_1.ActorEnvVarCollectionClient(this._subResourceOptions());
		}
	};
	exports.ActorVersionClient = ActorVersionClient;
	var ActorSourceType;
	(function(ActorSourceType) {
		ActorSourceType["SourceFiles"] = "SOURCE_FILES";
		ActorSourceType["GitRepo"] = "GIT_REPO";
		ActorSourceType["Tarball"] = "TARBALL";
		ActorSourceType["GitHubGist"] = "GITHUB_GIST";
	})(ActorSourceType || (exports.ActorSourceType = ActorSourceType = {}));
}));
//#endregion
//#region node_modules/apify-client/dist/resource_clients/actor_version_collection.js
var require_actor_version_collection = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.ActorVersionCollectionClient = void 0;
	const ow_1$19 = __require("tslib").__importDefault(require_dist$1());
	const resource_collection_client_1 = require_resource_collection_client();
	/**
	* Client for managing the collection of Actor versions.
	*
	* Actor versions represent specific builds or snapshots of an Actor's code. This client provides
	* methods to list and create versions for a specific Actor.
	*
	* @example
	* ```javascript
	* const client = new ApifyClient({ token: 'my-token' });
	* const actorClient = client.actor('my-actor-id');
	*
	* // List all versions
	* const versionsClient = actorClient.versions();
	* const { items } = await versionsClient.list();
	*
	* // Create a new version
	* const newVersion = await versionsClient.create({
	*   versionNumber: '0.2',
	*   buildTag: 'latest'
	* });
	* ```
	*
	* @see https://docs.apify.com/api/v2/act-versions-get
	*/
	var ActorVersionCollectionClient = class extends resource_collection_client_1.ResourceCollectionClient {
		/**
		* @hidden
		*/
		constructor(options) {
			super({
				resourcePath: "versions",
				...options
			});
		}
		/**
		* Lists all Actor versions.
		*
		* Awaiting the return value (as you would with a Promise) will result in a single API call. The amount of fetched
		* items in a single API call is limited.
		* ```javascript
		* const paginatedList = await client.list();
		*```
		*
		* Asynchronous iteration is also supported. This will fetch additional pages if needed until all items are
		* retrieved.
		*
		* ```javascript
		* for await (const singleItem of client.list()) {...}
		* ```
		*
		* @returns A paginated iterator of Actor versions.
		* @see https://docs.apify.com/api/v2/act-versions-get
		*/
		list(_options = {}) {
			return this._listPaginated();
		}
		/**
		* Creates a new Actor version.
		*
		* @param actorVersion - The Actor version data.
		* @returns The created Actor version object.
		* @see https://docs.apify.com/api/v2/act-versions-post
		*/
		async create(actorVersion) {
			(0, ow_1$19.default)(actorVersion, ow_1$19.default.optional.object);
			return this._create(actorVersion);
		}
	};
	exports.ActorVersionCollectionClient = ActorVersionCollectionClient;
}));
//#endregion
//#region node_modules/apify-client/dist/resource_clients/log.js
var require_log = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.StreamedLog = exports.LoggerActorRedirect = exports.LogClient = void 0;
	const ansi_colors_1 = __require("tslib").__importDefault(require_ansi_colors());
	const log_1 = require_cjs$1();
	const resource_client_1 = require_resource_client();
	const utils_1 = require_utils();
	/**
	* Client for accessing Actor run or build logs.
	*
	* Provides methods to retrieve logs as text or stream them in real-time. Logs can be accessed
	* for both running and finished Actor runs and builds.
	*
	* @example
	* ```javascript
	* const client = new ApifyClient({ token: 'my-token' });
	* const runClient = client.run('my-run-id');
	*
	* // Get the log content
	* const log = await runClient.log().get();
	* console.log(log);
	*
	* // Stream the log in real-time
	* const stream = await runClient.log().stream();
	* stream.on('line', (line) => console.log(line));
	* ```
	*
	* @see https://docs.apify.com/platform/actors/running/runs-and-builds#logging
	*/
	var LogClient = class extends resource_client_1.ResourceClient {
		/**
		* @hidden
		*/
		constructor(options) {
			super({
				resourcePath: "logs",
				...options
			});
		}
		/**
		* Retrieves the log as a string.
		*
		* @param options - Log retrieval options.
		* @param options.raw - If `true`, returns raw log content without any processing. Default is `false`.
		* @returns The log content as a string, or `undefined` if it does not exist.
		* @see https://docs.apify.com/api/v2/log-get
		*/
		async get(options = {}) {
			const requestOpts = {
				url: this._url(),
				method: "GET",
				params: this._params(options)
			};
			try {
				const response = await this.httpClient.call(requestOpts);
				return (0, utils_1.cast)(response.data);
			} catch (err) {
				(0, utils_1.catchNotFoundOrThrow)(err);
			}
		}
		/**
		* Retrieves the log as a Readable stream. Only works in Node.js.
		*
		* @param options - Log retrieval options.
		* @param options.raw - If `true`, returns raw log content without any processing. Default is `false`.
		* @returns The log content as a Readable stream, or `undefined` if it does not exist.
		* @see https://docs.apify.com/api/v2/log-get
		*/
		async stream(options = {}) {
			const params = {
				stream: true,
				raw: options.raw
			};
			const requestOpts = {
				url: this._url(),
				method: "GET",
				params: this._params(params),
				responseType: "stream"
			};
			try {
				const response = await this.httpClient.call(requestOpts);
				return (0, utils_1.cast)(response.data);
			} catch (err) {
				(0, utils_1.catchNotFoundOrThrow)(err);
			}
		}
	};
	exports.LogClient = LogClient;
	/**
	* Logger for redirected actor logs.
	*/
	var LoggerActorRedirect = class extends log_1.Logger {
		constructor(options = {}) {
			super({
				skipTime: true,
				level: log_1.LogLevel.DEBUG,
				...options
			});
		}
		_log(level, message, data, exception, opts = {}) {
			if (level > this.options.level) return;
			if (data || exception) throw new Error("Redirect logger does not use other arguments than level and message");
			let { prefix } = opts;
			prefix = prefix ? `${prefix}` : "";
			let maybeDate = "";
			if (!this.options.skipTime) maybeDate = `${(/* @__PURE__ */ new Date()).toISOString().replace("Z", "").replace("T", " ")} `;
			const line = `${ansi_colors_1.default.gray(maybeDate)}${ansi_colors_1.default.cyan(prefix)}${message || ""}`;
			this._outputWithConsole(log_1.LogLevel.INFO, line);
			return line;
		}
	};
	exports.LoggerActorRedirect = LoggerActorRedirect;
	/**
	* Helper class for redirecting streamed Actor logs to another log.
	*/
	var StreamedLog = class {
		constructor(options) {
			Object.defineProperty(this, "destinationLog", {
				enumerable: true,
				configurable: true,
				writable: true,
				value: void 0
			});
			Object.defineProperty(this, "streamBuffer", {
				enumerable: true,
				configurable: true,
				writable: true,
				value: []
			});
			Object.defineProperty(this, "splitMarker", {
				enumerable: true,
				configurable: true,
				writable: true,
				value: /(?:\n|^)(\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z)/g
			});
			Object.defineProperty(this, "relevancyTimeLimit", {
				enumerable: true,
				configurable: true,
				writable: true,
				value: void 0
			});
			Object.defineProperty(this, "logClient", {
				enumerable: true,
				configurable: true,
				writable: true,
				value: void 0
			});
			Object.defineProperty(this, "streamingTask", {
				enumerable: true,
				configurable: true,
				writable: true,
				value: null
			});
			Object.defineProperty(this, "stopLogging", {
				enumerable: true,
				configurable: true,
				writable: true,
				value: false
			});
			const { toLog, logClient, fromStart = true } = options;
			this.destinationLog = toLog;
			this.logClient = logClient;
			this.relevancyTimeLimit = fromStart ? null : /* @__PURE__ */ new Date();
		}
		/**
		* Start log redirection.
		*/
		start() {
			if (this.streamingTask) throw new Error("Streaming task already active");
			this.stopLogging = false;
			this.streamingTask = this.streamLog();
		}
		/**
		* Stop log redirection.
		*/
		async stop() {
			if (!this.streamingTask) throw new Error("Streaming task is not active");
			this.stopLogging = true;
			try {
				await this.streamingTask;
			} catch (err) {
				if (!(err instanceof Error && err.name === "AbortError")) throw err;
			} finally {
				this.streamingTask = null;
			}
		}
		/**
		* Get log stream from response and redirect it to another log.
		*/
		async streamLog() {
			const logStream = await this.logClient.stream({ raw: true });
			if (!logStream) return;
			const lastChunkRemainder = await this.logStreamChunks(logStream);
			const lastMessage = Buffer.from(lastChunkRemainder).toString().trim();
			if (lastMessage.length) this.destinationLog.info(lastMessage);
		}
		async logStreamChunks(logStream) {
			let previousChunkRemainder = /* @__PURE__ */ new Uint8Array();
			for await (const chunk of logStream) {
				const chunkWithPreviousRemainder = new Uint8Array(previousChunkRemainder.length + chunk.length);
				chunkWithPreviousRemainder.set(previousChunkRemainder, 0);
				chunkWithPreviousRemainder.set(chunk, previousChunkRemainder.length);
				const lastCompleteMessageIndex = chunkWithPreviousRemainder.lastIndexOf(10);
				previousChunkRemainder = chunkWithPreviousRemainder.slice(lastCompleteMessageIndex);
				this.streamBuffer.push(Buffer.from(chunkWithPreviousRemainder.slice(0, lastCompleteMessageIndex)));
				this.logBufferContent();
				if (this.stopLogging) break;
			}
			return previousChunkRemainder;
		}
		/**
		* Parse the buffer and log complete messages.
		*/
		logBufferContent() {
			const allParts = Buffer.concat(this.streamBuffer).toString().split(this.splitMarker).slice(1);
			const messageMarkers = allParts.filter((_, i) => i % 2 === 0);
			const messageContents = allParts.filter((_, i) => i % 2 !== 0);
			this.streamBuffer = [];
			messageMarkers.forEach((marker, index) => {
				const decodedMarker = marker;
				const decodedContent = messageContents[index];
				if (this.relevancyTimeLimit) {
					if (new Date(decodedMarker) < this.relevancyTimeLimit) return;
				}
				const message = decodedMarker + decodedContent;
				this.destinationLog.info(message.trim());
			});
		}
	};
	exports.StreamedLog = StreamedLog;
}));
//#endregion
//#region node_modules/apify-client/dist/resource_clients/build.js
var require_build = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.BuildClient = void 0;
	const ow_1$18 = __require("tslib").__importDefault(require_dist$1());
	const resource_client_1 = require_resource_client();
	const utils_1 = require_utils();
	const log_1 = require_log();
	/**
	* Client for managing a specific Actor build.
	*
	* Builds are created when an Actor is built from source code. This client provides methods
	* to get build details, wait for the build to finish, abort it, and access its logs.
	*
	* @example
	* ```javascript
	* const client = new ApifyClient({ token: 'my-token' });
	* const buildClient = client.build('my-build-id');
	*
	* // Get build details
	* const build = await buildClient.get();
	*
	* // Wait for the build to finish
	* const finishedBuild = await buildClient.waitForFinish();
	*
	* // Access build logs
	* const log = await buildClient.log().get();
	* ```
	*
	* @see https://docs.apify.com/platform/actors/running/runs-and-builds#builds
	*/
	var BuildClient = class extends resource_client_1.ResourceClient {
		/**
		* @hidden
		*/
		constructor(options) {
			super({
				resourcePath: "actor-builds",
				...options
			});
		}
		/**
		* Gets the Actor build object from the Apify API.
		*
		* @param options - Get options
		* @param options.waitForFinish - Maximum time to wait (in seconds, max 60s) for the build to finish on the API side before returning. Default is 0 (returns immediately).
		* @returns The Build object, or `undefined` if it does not exist
		* @see https://docs.apify.com/api/v2/actor-build-get
		*
		* @example
		* ```javascript
		* // Get build status immediately
		* const build = await client.build('build-id').get();
		* console.log(`Status: ${build.status}`);
		*
		* // Wait up to 60 seconds for build to finish
		* const build = await client.build('build-id').get({ waitForFinish: 60 });
		* ```
		*/
		async get(options = {}) {
			(0, ow_1$18.default)(options, ow_1$18.default.object.exactShape({ waitForFinish: ow_1$18.default.optional.number }));
			return this._get(options);
		}
		/**
		* Aborts the Actor build.
		*
		* Stops the build process immediately. The build will have an `ABORTED` status.
		*
		* @returns The updated Build object with `ABORTED` status
		* @see https://docs.apify.com/api/v2/actor-build-abort-post
		*
		* @example
		* ```javascript
		* await client.build('build-id').abort();
		* ```
		*/
		async abort() {
			const response = await this.httpClient.call({
				url: this._url("abort"),
				method: "POST",
				params: this._params()
			});
			return (0, utils_1.cast)((0, utils_1.parseDateFields)((0, utils_1.pluckData)(response.data)));
		}
		/**
		* Deletes the Actor build.
		*
		* @see https://docs.apify.com/api/v2/actor-build-delete
		*/
		async delete() {
			return this._delete();
		}
		/**
		* Retrieves the OpenAPI definition for the Actor build.
		*
		* @returns The OpenAPI definition object.
		* @see https://docs.apify.com/api/v2/actor-build-openapi-json-get
		*/
		async getOpenApiDefinition() {
			return (await this.httpClient.call({
				url: this._url("openapi.json"),
				method: "GET",
				params: this._params()
			})).data;
		}
		/**
		* Waits for the Actor build to finish and returns the finished Build object.
		*
		* The promise resolves when the build reaches a terminal state (`SUCCEEDED`, `FAILED`, `ABORTED`, or `TIMED-OUT`).
		* If `waitSecs` is provided and the timeout is reached, the promise resolves with the unfinished
		* Build object (status will be `RUNNING` or `READY`). The promise is NOT rejected based on build status.
		*
		* Unlike the `waitForFinish` parameter in {@link get}, this method can wait indefinitely
		* by polling the build status. It uses the `waitForFinish` parameter internally (max 60s per call)
		* and continuously polls until the build finishes or the timeout is reached.
		*
		* This is useful when you need to immediately start a run after a build finishes.
		*
		* @param options - Wait options
		* @param options.waitSecs - Maximum time to wait for the build to finish, in seconds. If omitted, waits indefinitely.
		* @returns The Build object (finished or still building if timeout was reached)
		*
		* @example
		* ```javascript
		* // Wait indefinitely for build to finish
		* const build = await client.build('build-id').waitForFinish();
		* console.log(`Build finished with status: ${build.status}`);
		*
		* // Start a run immediately after build succeeds
		* const build = await client.build('build-id').waitForFinish();
		* if (build.status === 'SUCCEEDED') {
		*   const run = await client.actor('my-actor').start();
		* }
		* ```
		*/
		async waitForFinish(options = {}) {
			(0, ow_1$18.default)(options, ow_1$18.default.object.exactShape({ waitSecs: ow_1$18.default.optional.number }));
			return this._waitForFinish(options);
		}
		/**
		* Returns a client for accessing the log of this Actor build.
		*
		* @returns A client for accessing the build's log
		* @see https://docs.apify.com/api/v2/actor-build-log-get
		*
		* @example
		* ```javascript
		* // Get build log
		* const log = await client.build('build-id').log().get();
		* console.log(log);
		* ```
		*/
		log() {
			return new log_1.LogClient(this._subResourceOptions({ resourcePath: "log" }));
		}
	};
	exports.BuildClient = BuildClient;
}));
//#endregion
//#region node_modules/apify-client/dist/resource_clients/build_collection.js
var require_build_collection = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.BuildCollectionClient = void 0;
	const ow_1$17 = __require("tslib").__importDefault(require_dist$1());
	const resource_collection_client_1 = require_resource_collection_client();
	/**
	* Client for managing the collection of Actor builds.
	*
	* Provides methods to list Actor builds across all Actors or for a specific Actor.
	* To access an individual build, use the `build()` method on the main ApifyClient.
	*
	* @example
	* ```javascript
	* const client = new ApifyClient({ token: 'my-token' });
	*
	* // List all builds
	* const buildsClient = client.builds();
	* const { items } = await buildsClient.list();
	*
	* // List builds for a specific Actor
	* const actorBuildsClient = client.actor('my-actor-id').builds();
	* const { items: actorBuilds } = await actorBuildsClient.list();
	* ```
	*
	* @see https://docs.apify.com/platform/actors/running/runs-and-builds#builds
	*/
	var BuildCollectionClient = class extends resource_collection_client_1.ResourceCollectionClient {
		/**
		* @hidden
		*/
		constructor(options) {
			super({
				...options,
				resourcePath: options.resourcePath || "actor-builds"
			});
		}
		/**
		* Lists all Actor builds.
		*
		* Awaiting the return value (as you would with a Promise) will result in a single API call. The amount of fetched
		* items in a single API call is limited.
		* ```javascript
		* const paginatedList = await client.list(options);
		* ```
		*
		* Asynchronous iteration is also supported. This will fetch additional pages if needed until all items are
		* retrieved.
		*
		* ```javascript
		* for await (const singleItem of client.list(options)) {...}
		* ```
		*
		* @param options - Pagination and sorting options.
		* @returns A paginated iterator of Actor builds.
		* @see https://docs.apify.com/api/v2/actor-builds-get
		*/
		list(options = {}) {
			(0, ow_1$17.default)(options, ow_1$17.default.object.exactShape({
				limit: ow_1$17.default.optional.number.not.negative,
				offset: ow_1$17.default.optional.number.not.negative,
				desc: ow_1$17.default.optional.boolean
			}));
			return this._listPaginated(options);
		}
	};
	exports.BuildCollectionClient = BuildCollectionClient;
}));
//#endregion
//#region node_modules/apify-client/dist/resource_clients/dataset.js
var require_dataset = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.DownloadItemsFormat = exports.DatasetClient = void 0;
	const ow_1$16 = __require("tslib").__importDefault(require_dist$1());
	const utilities_1 = require_cjs$2();
	const resource_client_1 = require_resource_client();
	const utils_1 = require_utils();
	/**
	* Client for managing a specific Dataset.
	*
	* Datasets store structured data results from Actor runs. This client provides methods to push items,
	* list and retrieve items, download items in various formats (JSON, CSV, Excel, etc.), and manage
	* the dataset.
	*
	* @template Data - Type of items stored in the dataset
	*
	* @example
	* ```javascript
	* const client = new ApifyClient({ token: 'my-token' });
	* const datasetClient = client.dataset('my-dataset-id');
	*
	* // Push items to the dataset
	* await datasetClient.pushItems([
	*   { url: 'https://example.com', title: 'Example' },
	*   { url: 'https://test.com', title: 'Test' }
	* ]);
	*
	* // List all items
	* const { items } = await datasetClient.listItems();
	*
	* // Download items as CSV
	* const buffer = await datasetClient.downloadItems('csv');
	* ```
	*
	* @see https://docs.apify.com/platform/storage/dataset
	*/
	var DatasetClient = class extends resource_client_1.ResourceClient {
		/**
		* @hidden
		*/
		constructor(options) {
			super({
				resourcePath: "datasets",
				...options
			});
		}
		/**
		* Gets the dataset object from the Apify API.
		*
		* @returns The Dataset object, or `undefined` if it does not exist
		* @see https://docs.apify.com/api/v2/dataset-get
		*/
		async get() {
			return this._get({}, resource_client_1.SMALL_TIMEOUT_MILLIS);
		}
		/**
		* Updates the dataset with specified fields.
		*
		* @param newFields - Fields to update in the dataset
		* @returns The updated Dataset object
		* @see https://docs.apify.com/api/v2/dataset-put
		*/
		async update(newFields) {
			(0, ow_1$16.default)(newFields, ow_1$16.default.object);
			return this._update(newFields, resource_client_1.SMALL_TIMEOUT_MILLIS);
		}
		/**
		* Deletes the dataset.
		*
		* @see https://docs.apify.com/api/v2/dataset-delete
		*/
		async delete() {
			return this._delete(resource_client_1.SMALL_TIMEOUT_MILLIS);
		}
		/**
		* Lists items in the dataset.
		*
		* Returns a paginated list of dataset items. You can use pagination parameters to retrieve
		* specific subsets of items, and various filtering and formatting options to customize
		* the output.
		*
		* @param options - Options for listing items
		* @param options.limit - Maximum number of items to return. Default is all items.
		* @param options.chunkSize - Maximum number of items returned in one API response. Relevant in the context of asyncIterator.
		* @param options.offset - Number of items to skip from the beginning. Default is 0.
		* @param options.desc - If `true`, items are returned in descending order (newest first). Default is `false`.
		* @param options.fields - Array of field names to include in the results. Omits all other fields.
		* @param options.omit - Array of field names to exclude from the results.
		* @param options.clean - If `true`, returns only non-empty items and skips hidden fields. Default is `false`.
		* @param options.skipEmpty - If `true`, skips empty items. Default is `false`.
		* @param options.skipHidden - If `true`, skips hidden fields (fields starting with `#`). Default is `false`.
		* @param options.flatten - Array of field names to flatten. Nested objects are converted to dot notation (e.g., `obj.field`).
		* @param options.unwind - Field name or array of field names to unwind. Each array value creates a separate item.
		* @param options.view - Name of a predefined view to use for field selection.
		* @returns A paginated list with `items`, `total` count, `offset`, `count`, and `limit`
		* @see https://docs.apify.com/api/v2/dataset-items-get
		*
		* @example
		* ```javascript
		* // Get first 100 items
		* const { items, total } = await client.dataset('my-dataset').listItems({ limit: 100 });
		* console.log(`Retrieved ${items.length} of ${total} total items`);
		*
		* // Get items with specific fields only
		* const { items } = await client.dataset('my-dataset').listItems({
		*   fields: ['url', 'title'],
		*   skipEmpty: true,
		*   limit: 50
		* });
		*
		* // Get items in descending order with pagination
		* const { items } = await client.dataset('my-dataset').listItems({
		*   desc: true,
		*   offset: 100,
		*   limit: 50
		* });
		* ```
		*/
		listItems(options = {}) {
			(0, ow_1$16.default)(options, ow_1$16.default.object.exactShape({
				clean: ow_1$16.default.optional.boolean,
				desc: ow_1$16.default.optional.boolean,
				flatten: ow_1$16.default.optional.array.ofType(ow_1$16.default.string),
				fields: ow_1$16.default.optional.array.ofType(ow_1$16.default.string),
				omit: ow_1$16.default.optional.array.ofType(ow_1$16.default.string),
				limit: ow_1$16.default.optional.number.not.negative,
				offset: ow_1$16.default.optional.number.not.negative,
				chunkSize: ow_1$16.default.optional.number.positive,
				skipEmpty: ow_1$16.default.optional.boolean,
				skipHidden: ow_1$16.default.optional.boolean,
				unwind: ow_1$16.default.optional.any(ow_1$16.default.string, ow_1$16.default.array.ofType(ow_1$16.default.string)),
				view: ow_1$16.default.optional.string,
				signature: ow_1$16.default.optional.string
			}));
			const fetchItems = async (datasetListOptions = {}) => {
				var _a;
				const response = await this.httpClient.call({
					url: this._url("items"),
					method: "GET",
					params: this._params(datasetListOptions),
					timeout: resource_client_1.DEFAULT_TIMEOUT_MILLIS
				});
				return this._createPaginationList(response, (_a = datasetListOptions.desc) !== null && _a !== void 0 ? _a : false);
			};
			return this._listPaginatedFromCallback(fetchItems, options);
		}
		/**
		* Downloads dataset items in a specific format.
		*
		* Unlike {@link listItems} which returns a {@link PaginatedList} with an array of individual
		* dataset items, this method returns the items serialized to the provided format
		* (JSON, CSV, Excel, etc.) as a Buffer. Useful for exporting data for further processing.
		*
		* @param format - Output format: `'json'`, `'jsonl'`, `'csv'`, `'xlsx'`, `'xml'`, `'rss'`, or `'html'`
		* @param options - Download and formatting options (extends all options from {@link listItems})
		* @param options.attachment - If `true`, the response will have `Content-Disposition: attachment` header.
		* @param options.bom - If `true`, adds UTF-8 BOM to the beginning of the file (useful for Excel compatibility).
		* @param options.delimiter - CSV delimiter character. Default is `,` (comma).
		* @param options.skipHeaderRow - If `true`, CSV export will not include the header row with field names.
		* @param options.xmlRoot - Name of the root XML element. Default is `'items'`.
		* @param options.xmlRow - Name of the XML element for each item. Default is `'item'`.
		* @param options.fields - Array of field names to include in the export.
		* @param options.omit - Array of field names to exclude from the export.
		* @returns Buffer containing the serialized data in the specified format
		* @see https://docs.apify.com/api/v2/dataset-items-get
		*
		* @example
		* ```javascript
		* // Download as CSV with BOM for Excel compatibility
		* const csvBuffer = await client.dataset('my-dataset').downloadItems('csv', { bom: true });
		* require('fs').writeFileSync('output.csv', csvBuffer);
		*
		* // Download as Excel with custom options
		* const xlsxBuffer = await client.dataset('my-dataset').downloadItems('xlsx', {
		*   fields: ['url', 'title', 'price'],
		*   skipEmpty: true,
		*   limit: 1000
		* });
		*
		* // Download as XML with custom element names
		* const xmlBuffer = await client.dataset('my-dataset').downloadItems('xml', {
		*   xmlRoot: 'products',
		*   xmlRow: 'product'
		* });
		* ```
		*/
		async downloadItems(format, options = {}) {
			(0, ow_1$16.default)(format, ow_1$16.default.string.oneOf(validItemFormats));
			(0, ow_1$16.default)(options, ow_1$16.default.object.exactShape({
				attachment: ow_1$16.default.optional.boolean,
				bom: ow_1$16.default.optional.boolean,
				clean: ow_1$16.default.optional.boolean,
				delimiter: ow_1$16.default.optional.string,
				desc: ow_1$16.default.optional.boolean,
				flatten: ow_1$16.default.optional.array.ofType(ow_1$16.default.string),
				fields: ow_1$16.default.optional.array.ofType(ow_1$16.default.string),
				omit: ow_1$16.default.optional.array.ofType(ow_1$16.default.string),
				limit: ow_1$16.default.optional.number.not.negative,
				offset: ow_1$16.default.optional.number.not.negative,
				skipEmpty: ow_1$16.default.optional.boolean,
				skipHeaderRow: ow_1$16.default.optional.boolean,
				skipHidden: ow_1$16.default.optional.boolean,
				unwind: ow_1$16.default.any(ow_1$16.default.optional.string, ow_1$16.default.optional.array.ofType(ow_1$16.default.string)),
				view: ow_1$16.default.optional.string,
				xmlRoot: ow_1$16.default.optional.string,
				xmlRow: ow_1$16.default.optional.string,
				signature: ow_1$16.default.optional.string
			}));
			const { data } = await this.httpClient.call({
				url: this._url("items"),
				method: "GET",
				params: this._params({
					format,
					...options
				}),
				forceBuffer: true,
				timeout: resource_client_1.DEFAULT_TIMEOUT_MILLIS
			});
			return (0, utils_1.cast)(data);
		}
		/**
		* Stores one or more items into the dataset.
		*
		* Items can be objects, strings, or arrays thereof. Each item will be stored as a separate
		* record in the dataset. Objects are automatically serialized to JSON. If you provide an array,
		* all items will be stored in order. This method is idempotent - calling it multiple times
		* with the same data will not create duplicates, but will append items each time.
		*
		* @param items - A single item (object or string) or an array of items to store.
		*                Objects are automatically stringified to JSON. Strings are stored as-is.
		* @see https://docs.apify.com/api/v2/dataset-items-post
		*
		* @example
		* ```javascript
		* // Store a single object
		* await client.dataset('my-dataset').pushItems({
		*   url: 'https://example.com',
		*   title: 'Example Page',
		*   extractedAt: new Date()
		* });
		*
		* // Store multiple items at once
		* await client.dataset('my-dataset').pushItems([
		*   { url: 'https://example.com', title: 'Example' },
		*   { url: 'https://test.com', title: 'Test' },
		*   { url: 'https://demo.com', title: 'Demo' }
		* ]);
		*
		* // Store string items
		* await client.dataset('my-dataset').pushItems(['item1', 'item2', 'item3']);
		* ```
		*/
		async pushItems(items) {
			(0, ow_1$16.default)(items, ow_1$16.default.any(ow_1$16.default.object, ow_1$16.default.string, ow_1$16.default.array.ofType(ow_1$16.default.any(ow_1$16.default.object, ow_1$16.default.string))));
			await this.httpClient.call({
				url: this._url("items"),
				method: "POST",
				headers: { "content-type": "application/json; charset=utf-8" },
				data: items,
				params: this._params(),
				doNotRetryTimeouts: true,
				timeout: resource_client_1.MEDIUM_TIMEOUT_MILLIS
			});
		}
		/**
		* Gets statistical information about the dataset.
		*
		* Returns statistics for each field in the dataset, including information about
		* data types, null counts, and value ranges.
		*
		* @returns Dataset statistics, or `undefined` if not available
		* @see https://docs.apify.com/api/v2/dataset-statistics-get
		*/
		async getStatistics() {
			const requestOpts = {
				url: this._url("statistics"),
				method: "GET",
				params: this._params(),
				timeout: resource_client_1.SMALL_TIMEOUT_MILLIS
			};
			try {
				const response = await this.httpClient.call(requestOpts);
				return (0, utils_1.cast)((0, utils_1.pluckData)(response.data));
			} catch (err) {
				(0, utils_1.catchNotFoundOrThrow)(err);
			}
		}
		/**
		* Generates a public URL for accessing dataset items.
		*
		* If the client has permission to access the dataset's URL signing key,
		* the URL will include a cryptographic signature allowing access without authentication.
		* This is useful for sharing dataset results with external services or users.
		*
		* @param options - URL generation options (extends all options from {@link listItems})
		* @param options.expiresInSecs - Number of seconds until the signed URL expires. If omitted, the URL never expires.
		* @param options.fields - Array of field names to include in the response.
		* @param options.limit - Maximum number of items to return.
		* @param options.offset - Number of items to skip.
		* @returns A public URL string for accessing the dataset items
		*
		* @example
		* ```javascript
		* // Create a URL that expires in 1 hour with specific fields
		* const url = await client.dataset('my-dataset').createItemsPublicUrl({
		*   expiresInSecs: 3600,
		*   fields: ['url', 'title'],
		*   limit: 100
		* });
		* console.log(`Share this URL: ${url}`);
		*
		* // Create a permanent public URL for clean items only
		* const url = await client.dataset('my-dataset').createItemsPublicUrl({
		*   clean: true,
		*   skipEmpty: true
		* });
		* ```
		*/
		async createItemsPublicUrl(options = {}) {
			(0, ow_1$16.default)(options, ow_1$16.default.object.exactShape({
				clean: ow_1$16.default.optional.boolean,
				desc: ow_1$16.default.optional.boolean,
				flatten: ow_1$16.default.optional.array.ofType(ow_1$16.default.string),
				fields: ow_1$16.default.optional.array.ofType(ow_1$16.default.string),
				omit: ow_1$16.default.optional.array.ofType(ow_1$16.default.string),
				limit: ow_1$16.default.optional.number.not.negative,
				offset: ow_1$16.default.optional.number.not.negative,
				skipEmpty: ow_1$16.default.optional.boolean,
				skipHidden: ow_1$16.default.optional.boolean,
				unwind: ow_1$16.default.optional.any(ow_1$16.default.string, ow_1$16.default.array.ofType(ow_1$16.default.string)),
				view: ow_1$16.default.optional.string,
				expiresInSecs: ow_1$16.default.optional.number
			}));
			const dataset = await this.get();
			const { expiresInSecs, ...queryOptions } = options;
			let createdItemsPublicUrl = new URL(this._publicUrl("items"));
			if (dataset === null || dataset === void 0 ? void 0 : dataset.urlSigningSecretKey) {
				const signature = await (0, utilities_1.createStorageContentSignatureAsync)({
					resourceId: dataset.id,
					urlSigningSecretKey: dataset.urlSigningSecretKey,
					expiresInMillis: expiresInSecs ? expiresInSecs * 1e3 : void 0
				});
				createdItemsPublicUrl.searchParams.set("signature", signature);
			}
			createdItemsPublicUrl = (0, utils_1.applyQueryParamsToUrl)(createdItemsPublicUrl, queryOptions);
			return createdItemsPublicUrl.toString();
		}
		_createPaginationList(response, userProvidedDesc) {
			var _a;
			return {
				items: response.data,
				total: Number(response.headers["x-apify-pagination-total"]),
				offset: Number(response.headers["x-apify-pagination-offset"]),
				count: response.data.length,
				limit: Number(response.headers["x-apify-pagination-limit"]),
				desc: JSON.parse((_a = response.headers["x-apify-pagination-desc"]) !== null && _a !== void 0 ? _a : userProvidedDesc)
			};
		}
	};
	exports.DatasetClient = DatasetClient;
	/**
	* Supported formats for downloading dataset items.
	*/
	var DownloadItemsFormat;
	(function(DownloadItemsFormat) {
		DownloadItemsFormat["JSON"] = "json";
		DownloadItemsFormat["JSONL"] = "jsonl";
		DownloadItemsFormat["XML"] = "xml";
		DownloadItemsFormat["HTML"] = "html";
		DownloadItemsFormat["CSV"] = "csv";
		DownloadItemsFormat["XLSX"] = "xlsx";
		DownloadItemsFormat["RSS"] = "rss";
	})(DownloadItemsFormat || (exports.DownloadItemsFormat = DownloadItemsFormat = {}));
	const validItemFormats = [...new Set(Object.values(DownloadItemsFormat).map((item) => item.toLowerCase()))];
}));
//#endregion
//#region node_modules/apify-client/dist/resource_clients/key_value_store.js
var require_key_value_store = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.KeyValueStoreClient = void 0;
	const tslib_1$3 = __require("tslib");
	const ow_1 = tslib_1$3.__importDefault(require_dist$1());
	const log_1 = tslib_1$3.__importDefault(require_cjs$1());
	const utilities_1 = require_cjs$2();
	const resource_client_1 = require_resource_client();
	const utils_1 = require_utils();
	/**
	* Client for managing a specific key-value store.
	*
	* Key-value stores are used to store arbitrary data records or files. Each record is identified by
	* a unique key and can contain any type of data. This client provides methods to get, set, and delete
	* records, list keys, and manage the store.
	*
	* @example
	* ```javascript
	* const client = new ApifyClient({ token: 'my-token' });
	* const storeClient = client.keyValueStore('my-store-id');
	*
	* // Set a record
	* await storeClient.setRecord({
	*   key: 'OUTPUT',
	*   value: { foo: 'bar' },
	*   contentType: 'application/json'
	* });
	*
	* // Get a record
	* const record = await storeClient.getRecord('OUTPUT');
	*
	* // List all keys
	* const { items } = await storeClient.listKeys();
	* ```
	*
	* @see https://docs.apify.com/platform/storage/key-value-store
	*/
	var KeyValueStoreClient = class extends resource_client_1.ResourceClient {
		/**
		* @hidden
		*/
		constructor(options) {
			super({
				resourcePath: "key-value-stores",
				...options
			});
		}
		/**
		* Gets the key-value store object from the Apify API.
		*
		* @returns The KeyValueStore object, or `undefined` if it does not exist
		* @see https://docs.apify.com/api/v2/key-value-store-get
		*/
		async get() {
			return this._get({}, resource_client_1.SMALL_TIMEOUT_MILLIS);
		}
		/**
		* Updates the key-value store with specified fields.
		*
		* @param newFields - Fields to update in the key-value store
		* @param newFields.name - New name for the store
		* @param newFields.title - New title for the store
		* @param newFields.generalAccess - General resource access level ('FOLLOW_USER_SETTING', 'ANYONE_WITH_ID_CAN_READ' or 'RESTRICTED')
		* @returns The updated KeyValueStore object
		* @see https://docs.apify.com/api/v2/key-value-store-put
		*/
		async update(newFields) {
			(0, ow_1.default)(newFields, ow_1.default.object);
			return this._update(newFields, resource_client_1.DEFAULT_TIMEOUT_MILLIS);
		}
		/**
		* Deletes the key-value store.
		*
		* @see https://docs.apify.com/api/v2/key-value-store-delete
		*/
		async delete() {
			return this._delete(resource_client_1.SMALL_TIMEOUT_MILLIS);
		}
		/**
		* Lists all keys in the key-value store.
		*
		* Returns a paginated list of all record keys in the store. Use pagination parameters
		* to retrieve large lists efficiently.
		*
		* @param options - Listing options
		* @param options.limit - Maximum number of keys to return. Default is 1000.
		* @param options.exclusiveStartKey - Key to start listing from (for pagination). The listing starts with the next key after this one.
		* @param options.collection - Filter keys by collection name.
		* @param options.prefix - Filter keys that start with this prefix.
		* @returns Object containing `items` array of key metadata, pagination info (`count`, `limit`, `isTruncated`, `nextExclusiveStartKey`)
		* @see https://docs.apify.com/api/v2/key-value-store-keys-get
		*
		* @example
		* ```javascript
		* // List all keys
		* const { items, isTruncated } = await client.keyValueStore('my-store').listKeys();
		* items.forEach(item => console.log(`${item.key}: ${item.size} bytes`));
		*
		* // List keys with prefix
		* const { items } = await client.keyValueStore('my-store').listKeys({ prefix: 'user-' });
		*
		* // Paginate through all keys
		* let exclusiveStartKey;
		* do {
		*   const result = await client.keyValueStore('my-store').listKeys({
		*     limit: 100,
		*     exclusiveStartKey
		*   });
		*   // Process result.items...
		*   exclusiveStartKey = result.nextExclusiveStartKey;
		* } while (result.isTruncated);
		* ```
		*/
		listKeys(options = {}) {
			(0, ow_1.default)(options, ow_1.default.object.exactShape({
				limit: ow_1.default.optional.number.not.negative,
				exclusiveStartKey: ow_1.default.optional.string,
				collection: ow_1.default.optional.string,
				prefix: ow_1.default.optional.string,
				signature: ow_1.default.optional.string
			}));
			const getPaginatedList = async (kvsListOptions = {}) => {
				const response = await this.httpClient.call({
					url: this._url("keys"),
					method: "GET",
					params: this._params(kvsListOptions),
					timeout: resource_client_1.MEDIUM_TIMEOUT_MILLIS
				});
				return (0, utils_1.cast)((0, utils_1.parseDateFields)((0, utils_1.pluckData)(response.data)));
			};
			const paginatedListPromise = getPaginatedList(options);
			async function* asyncGenerator() {
				let currentPage = await paginatedListPromise;
				yield* currentPage.items;
				let remainingItems = options.limit ? options.limit - currentPage.items.length : void 0;
				while (currentPage.items.length > 0 && currentPage.nextExclusiveStartKey !== null && (remainingItems === void 0 || remainingItems > 0)) {
					const newOptions = {
						...options,
						limit: remainingItems,
						exclusiveStartKey: currentPage.nextExclusiveStartKey
					};
					currentPage = await getPaginatedList(newOptions);
					yield* currentPage.items;
					if (remainingItems) remainingItems -= currentPage.items.length;
				}
			}
			return Object.defineProperty(paginatedListPromise, Symbol.asyncIterator, { value: asyncGenerator });
		}
		/**
		* Generates a public URL for accessing a specific record in the key-value store.
		*
		* If the client has permission to access the key-value store's URL signing key,
		* the URL will include a cryptographic signature for authenticated access without
		* requiring an API token.
		*
		* @param key - The record key
		* @returns A public URL string for accessing the record
		*
		* @example
		* ```javascript
		* const url = await client.keyValueStore('my-store').getRecordPublicUrl('OUTPUT');
		* console.log(`Public URL: ${url}`);
		* // You can now share this URL or use it in a browser
		* ```
		*/
		async getRecordPublicUrl(key) {
			(0, ow_1.default)(key, ow_1.default.string.nonEmpty);
			const store = await this.get();
			const recordPublicUrl = new URL(this._publicUrl(`records/${key}`));
			if (store === null || store === void 0 ? void 0 : store.urlSigningSecretKey) {
				const signature = await (0, utilities_1.createHmacSignatureAsync)(store.urlSigningSecretKey, key);
				recordPublicUrl.searchParams.append("signature", signature);
			}
			return recordPublicUrl.toString();
		}
		/**
		* Generates a public URL for accessing the list of keys in the key-value store.
		*
		* If the client has permission to access the key-value store's URL signing key,
		* the URL will include a cryptographic signature which allows access without authentication.
		*
		* @param options - URL generation options (extends all options from {@link listKeys})
		* @param options.expiresInSecs - Number of seconds until the signed URL expires. If omitted, the URL never expires.
		* @param options.limit - Maximum number of keys to return.
		* @param options.prefix - Filter keys by prefix.
		* @returns A public URL string for accessing the keys list
		*
		* @example
		* ```javascript
		* // Create a URL that expires in 1 hour
		* const url = await client.keyValueStore('my-store').createKeysPublicUrl({
		*   expiresInSecs: 3600,
		*   prefix: 'image-'
		* });
		* console.log(`Share this URL: ${url}`);
		* ```
		*/
		async createKeysPublicUrl(options = {}) {
			(0, ow_1.default)(options, ow_1.default.object.exactShape({
				limit: ow_1.default.optional.number.not.negative,
				exclusiveStartKey: ow_1.default.optional.string,
				collection: ow_1.default.optional.string,
				prefix: ow_1.default.optional.string,
				expiresInSecs: ow_1.default.optional.number
			}));
			const store = await this.get();
			const { expiresInSecs, ...queryOptions } = options;
			let createdPublicKeysUrl = new URL(this._publicUrl("keys"));
			if (store === null || store === void 0 ? void 0 : store.urlSigningSecretKey) {
				const signature = await (0, utilities_1.createStorageContentSignatureAsync)({
					resourceId: store.id,
					urlSigningSecretKey: store.urlSigningSecretKey,
					expiresInMillis: expiresInSecs ? expiresInSecs * 1e3 : void 0
				});
				createdPublicKeysUrl.searchParams.set("signature", signature);
			}
			createdPublicKeysUrl = (0, utils_1.applyQueryParamsToUrl)(createdPublicKeysUrl, queryOptions);
			return createdPublicKeysUrl.toString();
		}
		/**
		* Tests whether a record with the given key exists in the key-value store without retrieving its value.
		*
		* This is more efficient than {@link getRecord} when you only need to check for existence.
		*
		* @param key - The record key to check
		* @returns `true` if the record exists, `false` if it does not
		* @see https://docs.apify.com/api/v2/key-value-store-record-get
		*
		* @example
		* ```javascript
		* const exists = await client.keyValueStore('my-store').recordExists('OUTPUT');
		* if (exists) {
		*   console.log('OUTPUT record exists');
		* }
		* ```
		*/
		async recordExists(key) {
			const requestOpts = {
				url: this._url(`records/${key}`),
				method: "HEAD",
				params: this._params()
			};
			try {
				await this.httpClient.call(requestOpts);
				return true;
			} catch (err) {
				(0, utils_1.catchNotFoundOrThrow)(err);
			}
			return false;
		}
		async getRecord(key, options = {}) {
			(0, ow_1.default)(key, ow_1.default.string);
			(0, ow_1.default)(options, ow_1.default.object.exactShape({
				buffer: ow_1.default.optional.boolean,
				stream: ow_1.default.optional.boolean,
				disableRedirect: ow_1.default.optional.boolean,
				signature: ow_1.default.optional.string
			}));
			if (options.stream && !(0, utils_1.isNode)()) throw new Error("The stream option can only be used in Node.js environment.");
			if ("disableRedirect" in options) log_1.default.deprecated("The disableRedirect option for getRecord() is deprecated. It has no effect and will be removed in the following major release.");
			const queryParams = { attachment: "true" };
			if (options.signature) queryParams.signature = options.signature;
			const requestOpts = {
				url: this._url(`records/${key}`),
				method: "GET",
				params: this._params(queryParams),
				timeout: resource_client_1.DEFAULT_TIMEOUT_MILLIS
			};
			if (options.buffer) requestOpts.forceBuffer = true;
			if (options.stream) requestOpts.responseType = "stream";
			try {
				const response = await this.httpClient.call(requestOpts);
				return {
					key,
					value: response.data,
					contentType: response.headers["content-type"]
				};
			} catch (err) {
				(0, utils_1.catchNotFoundOrThrow)(err);
			}
		}
		/**
		* Stores a record in the key-value store.
		*
		* The record value can be any JSON-serializable object, a string, or a Buffer/Stream.
		* The content type is automatically determined based on the value type, but can be
		* overridden using the `contentType` property.
		*
		* **Note about streams:** If the value is a stream object (has `.pipe` and `.on` methods),
		* the upload cannot be retried on failure or follow redirects. For reliable uploads,
		* buffer the entire stream into memory first.
		*
		* @param record - The record to store
		* @param record.key - Record key (unique identifier)
		* @param record.value - Record value (object, string, Buffer, or Stream)
		* @param record.contentType - Optional MIME type. Auto-detected if not provided:
		*                             - Objects: `'application/json; charset=utf-8'`
		*                             - Strings: `'text/plain; charset=utf-8'`
		*                             - Buffers/Streams: `'application/octet-stream'`
		* @param options - Storage options
		* @param options.timeoutSecs - Timeout for the upload in seconds. Default varies by value size.
		* @param options.doNotRetryTimeouts - If `true`, don't retry on timeout errors. Default is `false`.
		* @see https://docs.apify.com/api/v2/key-value-store-record-put
		*
		* @example
		* ```javascript
		* // Store JSON object
		* await client.keyValueStore('my-store').setRecord({
		*   key: 'OUTPUT',
		*   value: { crawledUrls: 100, items: [...] }
		* });
		*
		* // Store text
		* await client.keyValueStore('my-store').setRecord({
		*   key: 'README',
		*   value: 'This is my readme text',
		*   contentType: 'text/plain'
		* });
		*
		* // Store binary data
		* const imageBuffer = await fetchImageBuffer();
		* await client.keyValueStore('my-store').setRecord({
		*   key: 'screenshot.png',
		*   value: imageBuffer,
		*   contentType: 'image/png'
		* });
		* ```
		*/
		async setRecord(record, options = {}) {
			(0, ow_1.default)(record, ow_1.default.object.exactShape({
				key: ow_1.default.string,
				value: ow_1.default.any(ow_1.default.null, ow_1.default.string, ow_1.default.number, ow_1.default.object, ow_1.default.boolean),
				contentType: ow_1.default.optional.string.nonEmpty
			}));
			(0, ow_1.default)(options, ow_1.default.object.exactShape({
				timeoutSecs: ow_1.default.optional.number,
				doNotRetryTimeouts: ow_1.default.optional.boolean
			}));
			const { key } = record;
			let { value, contentType } = record;
			const { timeoutSecs, doNotRetryTimeouts } = options;
			const isValueStreamOrBuffer = (0, utils_1.isStream)(value) || (0, utils_1.isBuffer)(value);
			if (!contentType) if (isValueStreamOrBuffer) contentType = "application/octet-stream";
			else if (typeof value === "string") contentType = "text/plain; charset=utf-8";
			else contentType = "application/json; charset=utf-8";
			if (/^application\/json/.test(contentType) && !isValueStreamOrBuffer && typeof value !== "string") try {
				value = JSON.stringify(value, null, 2);
			} catch (err) {
				const msg = `The record value cannot be stringified to JSON. Please provide other content type.\nCause: ${err.message}`;
				throw new Error(msg);
			}
			const uploadOpts = {
				url: this._url(`records/${key}`),
				method: "PUT",
				params: this._params(),
				data: value,
				headers: contentType ? { "content-type": contentType } : void 0,
				doNotRetryTimeouts,
				timeout: timeoutSecs !== void 0 ? timeoutSecs * 1e3 : resource_client_1.DEFAULT_TIMEOUT_MILLIS
			};
			await this.httpClient.call(uploadOpts);
		}
		/**
		* Deletes a record from the key-value store.
		*
		* @param key - The record key to delete
		* @see https://docs.apify.com/api/v2/key-value-store-record-delete
		*
		* @example
		* ```javascript
		* await client.keyValueStore('my-store').deleteRecord('temp-data');
		* ```
		*/
		async deleteRecord(key) {
			(0, ow_1.default)(key, ow_1.default.string);
			await this.httpClient.call({
				url: this._url(`records/${key}`),
				method: "DELETE",
				params: this._params(),
				timeout: resource_client_1.SMALL_TIMEOUT_MILLIS
			});
		}
	};
	exports.KeyValueStoreClient = KeyValueStoreClient;
}));
//#endregion
//#region node_modules/apify-client/dist/resource_clients/request_queue.js
var require_request_queue = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.RequestQueueClient = void 0;
	const tslib_1$2 = __require("tslib");
	const ow_1 = tslib_1$2.__importDefault(require_dist$1());
	const consts_1 = require_cjs();
	const log_1 = tslib_1$2.__importDefault(require_cjs$1());
	const resource_client_1 = require_resource_client();
	const utils_1 = require_utils();
	const DEFAULT_PARALLEL_BATCH_ADD_REQUESTS = 5;
	const DEFAULT_UNPROCESSED_RETRIES_BATCH_ADD_REQUESTS = 3;
	const DEFAULT_MIN_DELAY_BETWEEN_UNPROCESSED_REQUESTS_RETRIES_MILLIS = 500;
	const DEFAULT_REQUEST_QUEUE_REQUEST_PAGE_LIMIT = 1e3;
	const SAFETY_BUFFER_PERCENT = .01 / 100;
	/**
	* Client for managing a specific Request queue.
	*
	* Request queues store URLs to be crawled and their metadata. Each request in the queue has a unique ID
	* and can be in various states (pending, handled). This client provides methods to add, get, update,
	* and delete requests, as well as manage the queue itself.
	*
	* @example
	* ```javascript
	* const client = new ApifyClient({ token: 'my-token' });
	* const queueClient = client.requestQueue('my-queue-id');
	*
	* // Add a request to the queue
	* await queueClient.addRequest({
	*   url: 'https://example.com',
	*   uniqueKey: 'example-com'
	* });
	*
	* // Get the next request from the queue
	* const request = await queueClient.listHead();
	*
	* // Mark request as handled
	* await queueClient.updateRequest({
	*   id: request.id,
	*   handledAt: new Date().toISOString()
	* });
	* ```
	*
	* @see https://docs.apify.com/platform/storage/request-queue
	*/
	var RequestQueueClient = class extends resource_client_1.ResourceClient {
		/**
		* @hidden
		*/
		constructor(options, userOptions = {}) {
			super({
				resourcePath: "request-queues",
				...options
			});
			Object.defineProperty(this, "clientKey", {
				enumerable: true,
				configurable: true,
				writable: true,
				value: void 0
			});
			Object.defineProperty(this, "timeoutMillis", {
				enumerable: true,
				configurable: true,
				writable: true,
				value: void 0
			});
			this.clientKey = userOptions.clientKey;
			this.timeoutMillis = userOptions.timeoutSecs ? userOptions.timeoutSecs * 1e3 : void 0;
		}
		/**
		* Gets the Request queue object from the Apify API.
		*
		* @returns The RequestQueue object, or `undefined` if it does not exist
		* @see https://docs.apify.com/api/v2/request-queue-get
		*/
		async get() {
			return this._get({}, resource_client_1.SMALL_TIMEOUT_MILLIS);
		}
		/**
		* Updates the Request queue with specified fields.
		*
		* @param newFields - Fields to update in the Request queue
		* @returns The updated RequestQueue object
		* @see https://docs.apify.com/api/v2/request-queue-put
		*/
		async update(newFields) {
			(0, ow_1.default)(newFields, ow_1.default.object);
			return this._update(newFields, resource_client_1.SMALL_TIMEOUT_MILLIS);
		}
		/**
		* Deletes the Request queue.
		*
		* @see https://docs.apify.com/api/v2/request-queue-delete
		*/
		async delete() {
			return this._delete(resource_client_1.SMALL_TIMEOUT_MILLIS);
		}
		/**
		* Lists requests from the beginning of the queue (head).
		*
		* Returns the first N requests from the queue without locking them. This is useful for
		* inspecting what requests are waiting to be processed.
		*
		* @param options - Options for listing (e.g., limit)
		* @returns List of requests from the queue head
		* @see https://docs.apify.com/api/v2/request-queue-head-get
		*/
		async listHead(options = {}) {
			var _a;
			(0, ow_1.default)(options, ow_1.default.object.exactShape({ limit: ow_1.default.optional.number.not.negative }));
			const response = await this.httpClient.call({
				url: this._url("head"),
				method: "GET",
				timeout: Math.min(resource_client_1.SMALL_TIMEOUT_MILLIS, (_a = this.timeoutMillis) !== null && _a !== void 0 ? _a : Infinity),
				params: this._params({
					limit: options.limit,
					clientKey: this.clientKey
				})
			});
			return (0, utils_1.cast)((0, utils_1.parseDateFields)((0, utils_1.pluckData)(response.data)));
		}
		/**
		* Gets and locks the next requests from the queue head for processing.
		*
		* This method retrieves requests from the beginning of the queue and locks them for
		* the specified duration to prevent other clients from processing them simultaneously.
		* This is the primary method used by distributed web crawlers to coordinate work across
		* multiple workers. Locked requests won't be returned to other clients until the lock expires
		* or is explicitly released using {@link deleteRequestLock}.
		*
		* @param options - Lock configuration
		* @param options.lockSecs - **Required.** Duration in seconds to lock the requests. After this time, the locks expire and requests can be retrieved by other clients.
		* @param options.limit - Maximum number of requests to return. Default is 25.
		* @returns Object containing `items` (locked requests), `queueModifiedAt`, `hadMultipleClients`, and lock information
		* @see https://docs.apify.com/api/v2/request-queue-head-lock-post
		*
		* @example
		* ```javascript
		* // Get and lock up to 10 requests for 60 seconds
		* const { items, lockSecs } = await client.requestQueue('my-queue').listAndLockHead({
		*   lockSecs: 60,
		*   limit: 10
		* });
		*
		* // Process each locked request
		* for (const request of items) {
		*   console.log(`Processing: ${request.url}`);
		*   // ... process request ...
		*   // Delete lock after successful processing
		*   await client.requestQueue('my-queue').deleteRequestLock(request.id);
		* }
		* ```
		*/
		async listAndLockHead(options) {
			var _a;
			(0, ow_1.default)(options, ow_1.default.object.exactShape({
				lockSecs: ow_1.default.number,
				limit: ow_1.default.optional.number.not.negative
			}));
			const response = await this.httpClient.call({
				url: this._url("head/lock"),
				method: "POST",
				timeout: Math.min(resource_client_1.MEDIUM_TIMEOUT_MILLIS, (_a = this.timeoutMillis) !== null && _a !== void 0 ? _a : Infinity),
				params: this._params({
					limit: options.limit,
					lockSecs: options.lockSecs,
					clientKey: this.clientKey
				})
			});
			return (0, utils_1.cast)((0, utils_1.parseDateFields)((0, utils_1.pluckData)(response.data)));
		}
		/**
		* Adds a single request to the queue.
		*
		* If a request with the same `uniqueKey` already exists, the method will return information
		* about the existing request without adding a duplicate. The `uniqueKey` is used for
		* deduplication - typically it's the URL, but you can use any string to identify the request.
		*
		* @param request - The request object to add (excluding `id`, which is assigned by the API)
		* @param request.url - URL to be crawled
		* @param request.uniqueKey - Unique identifier for request deduplication. If not provided, defaults to `url`.
		* @param request.method - HTTP method. Default is `'GET'`.
		* @param request.userData - Custom user data (arbitrary JSON object) associated with the request.
		* @param request.headers - HTTP headers to use for the request.
		* @param request.payload - HTTP payload for POST/PUT requests (string).
		* @param options - Additional options
		* @param options.forefront - If `true`, adds the request to the beginning of the queue. Default is `false` (adds to the end).
		* @returns Object with `requestId`, `wasAlreadyPresent`, and `wasAlreadyHandled` flags
		* @see https://docs.apify.com/api/v2/request-queue-requests-post
		*
		* @example
		* ```javascript
		* const result = await client.requestQueue('my-queue').addRequest({
		*   url: 'https://example.com',
		*   uniqueKey: 'example-page',
		*   method: 'GET',
		*   userData: { label: 'START', depth: 0 }
		* });
		* console.log(`Request ID: ${result.requestId}`);
		* console.log(`Already present: ${result.wasAlreadyPresent}`);
		* console.log(`Already handled: ${result.wasAlreadyHandled}`);
		*
		* // Add urgent request to the front of the queue
		* await client.requestQueue('my-queue').addRequest(
		*   { url: 'https://priority.com', uniqueKey: 'priority-page' },
		*   { forefront: true }
		* );
		* ```
		*/
		async addRequest(request, options = {}) {
			var _a;
			(0, ow_1.default)(request, ow_1.default.object.partialShape({ id: ow_1.default.undefined }));
			(0, ow_1.default)(options, ow_1.default.object.exactShape({ forefront: ow_1.default.optional.boolean }));
			const response = await this.httpClient.call({
				url: this._url("requests"),
				method: "POST",
				timeout: Math.min(resource_client_1.SMALL_TIMEOUT_MILLIS, (_a = this.timeoutMillis) !== null && _a !== void 0 ? _a : Infinity),
				data: request,
				params: this._params({
					forefront: options.forefront,
					clientKey: this.clientKey
				})
			});
			return (0, utils_1.cast)((0, utils_1.parseDateFields)((0, utils_1.pluckData)(response.data)));
		}
		/**
		* Writes requests to Request queue in batch.
		*
		* @private
		*/
		async _batchAddRequests(requests, options = {}) {
			var _a;
			(0, ow_1.default)(requests, ow_1.default.array.ofType(ow_1.default.object.partialShape({ id: ow_1.default.undefined })).minLength(1).maxLength(consts_1.REQUEST_QUEUE_MAX_REQUESTS_PER_BATCH_OPERATION));
			(0, ow_1.default)(options, ow_1.default.object.exactShape({ forefront: ow_1.default.optional.boolean }));
			const { data } = await this.httpClient.call({
				url: this._url("requests/batch"),
				method: "POST",
				timeout: Math.min(resource_client_1.MEDIUM_TIMEOUT_MILLIS, (_a = this.timeoutMillis) !== null && _a !== void 0 ? _a : Infinity),
				data: requests,
				params: this._params({
					forefront: options.forefront,
					clientKey: this.clientKey
				})
			});
			return (0, utils_1.cast)((0, utils_1.parseDateFields)((0, utils_1.pluckData)(data)));
		}
		async _batchAddRequestsWithRetries(requests, options = {}) {
			const { forefront, maxUnprocessedRequestsRetries = DEFAULT_UNPROCESSED_RETRIES_BATCH_ADD_REQUESTS, minDelayBetweenUnprocessedRequestsRetriesMillis = DEFAULT_MIN_DELAY_BETWEEN_UNPROCESSED_REQUESTS_RETRIES_MILLIS } = options;
			let remainingRequests = requests;
			const processedRequests = [];
			let unprocessedRequests = [];
			for (let i = 0; i < 1 + maxUnprocessedRequestsRetries; i++) {
				try {
					const response = await this._batchAddRequests(remainingRequests, { forefront });
					processedRequests.push(...response.processedRequests);
					unprocessedRequests = response.unprocessedRequests;
					if (unprocessedRequests.length !== 0) this.httpClient.stats.addRateLimitError(i + 1);
					const processedRequestsUniqueKeys = processedRequests.map(({ uniqueKey }) => uniqueKey);
					remainingRequests = requests.filter(({ uniqueKey }) => !processedRequestsUniqueKeys.includes(uniqueKey));
					if (remainingRequests.length === 0) break;
				} catch (err) {
					log_1.default.exception(err, "Request batch insert failed");
					const processedRequestsUniqueKeys = processedRequests.map(({ uniqueKey }) => uniqueKey);
					unprocessedRequests = requests.filter(({ uniqueKey }) => !processedRequestsUniqueKeys.includes(uniqueKey)).map(({ method, uniqueKey, url }) => ({
						method,
						uniqueKey,
						url
					}));
					break;
				}
				const delayMillis = Math.floor((1 + Math.random()) * 2 ** i * minDelayBetweenUnprocessedRequestsRetriesMillis);
				await new Promise((resolve) => {
					setTimeout(resolve, delayMillis);
				});
			}
			const result = {
				processedRequests,
				unprocessedRequests
			};
			return (0, utils_1.cast)((0, utils_1.parseDateFields)(result));
		}
		/**
		* Adds multiple requests to the queue in a single operation.
		*
		* This is significantly more efficient than calling {@link addRequest} multiple times, especially
		* for large batches. The method automatically handles batching (max 25 requests per API call),
		* retries on rate limiting, and parallel processing. Requests are sent in chunks respecting the
		* API payload size limit, and any unprocessed requests due to rate limits are automatically
		* retried with exponential backoff.
		*
		* @param requests - Array of request objects to add (excluding `id` fields)
		* @param options - Batch operation configuration
		* @param options.forefront - If `true`, adds all requests to the beginning of the queue. Default is `false`.
		* @param options.maxUnprocessedRequestsRetries - Maximum number of retry attempts for rate-limited requests. Default is 3.
		* @param options.maxParallel - Maximum number of parallel batch API calls. Default is 5.
		* @param options.minDelayBetweenUnprocessedRequestsRetriesMillis - Minimum delay before retrying rate-limited requests. Default is 500ms.
		* @returns Object with `processedRequests` (successfully added) and `unprocessedRequests` (failed after all retries)
		* @see https://docs.apify.com/api/v2/request-queue-requests-batch-post
		*
		* @example
		* ```javascript
		* // Add a batch of URLs to crawl
		* const requests = [
		*   { url: 'https://example.com', uniqueKey: 'page1', userData: { depth: 1 } },
		*   { url: 'https://example.com/2', uniqueKey: 'page2', userData: { depth: 1 } },
		*   { url: 'https://example.com/3', uniqueKey: 'page3', userData: { depth: 1 } }
		* ];
		* const result = await client.requestQueue('my-queue').batchAddRequests(requests);
		* console.log(`Successfully added: ${result.processedRequests.length}`);
		* console.log(`Failed: ${result.unprocessedRequests.length}`);
		*
		* // Batch add with custom retry settings
		* const result = await client.requestQueue('my-queue').batchAddRequests(
		*   requests,
		*   { maxUnprocessedRequestsRetries: 5, maxParallel: 10 }
		* );
		* ```
		*/
		async batchAddRequests(requests, options = {}) {
			const { forefront, maxUnprocessedRequestsRetries = DEFAULT_UNPROCESSED_RETRIES_BATCH_ADD_REQUESTS, maxParallel = DEFAULT_PARALLEL_BATCH_ADD_REQUESTS, minDelayBetweenUnprocessedRequestsRetriesMillis = DEFAULT_MIN_DELAY_BETWEEN_UNPROCESSED_REQUESTS_RETRIES_MILLIS } = options;
			(0, ow_1.default)(requests, ow_1.default.array.ofType(ow_1.default.object.partialShape({ id: ow_1.default.undefined })).minLength(1));
			(0, ow_1.default)(forefront, ow_1.default.optional.boolean);
			(0, ow_1.default)(maxUnprocessedRequestsRetries, ow_1.default.optional.number);
			(0, ow_1.default)(maxParallel, ow_1.default.optional.number);
			(0, ow_1.default)(minDelayBetweenUnprocessedRequestsRetriesMillis, ow_1.default.optional.number);
			const executingRequests = /* @__PURE__ */ new Set();
			const individualResults = [];
			const payloadSizeLimitBytes = consts_1.MAX_PAYLOAD_SIZE_BYTES - Math.ceil(consts_1.MAX_PAYLOAD_SIZE_BYTES * SAFETY_BUFFER_PERCENT);
			let i = 0;
			while (i < requests.length) {
				const slicedRequests = requests.slice(i, i + consts_1.REQUEST_QUEUE_MAX_REQUESTS_PER_BATCH_OPERATION);
				const requestsInBatch = (0, utils_1.sliceArrayByByteLength)(slicedRequests, payloadSizeLimitBytes, i);
				const requestPromise = this._batchAddRequestsWithRetries(requestsInBatch, options);
				executingRequests.add(requestPromise);
				requestPromise.then((batchAddResult) => {
					executingRequests.delete(requestPromise);
					individualResults.push(batchAddResult);
				});
				if (executingRequests.size >= maxParallel) await Promise.race(executingRequests);
				i += requestsInBatch.length;
			}
			await Promise.all(executingRequests);
			const result = {
				processedRequests: [],
				unprocessedRequests: []
			};
			individualResults.forEach(({ processedRequests, unprocessedRequests }) => {
				result.processedRequests.push(...processedRequests);
				result.unprocessedRequests.push(...unprocessedRequests);
			});
			return result;
		}
		/**
		* Deletes multiple requests from the queue in a single operation.
		*
		* Requests can be identified by either their ID or unique key.
		*
		* @param requests - Array of requests to delete (by id or uniqueKey)
		* @returns Result containing processed and unprocessed requests
		* @see https://docs.apify.com/api/v2/request-queue-requests-batch-delete
		*/
		async batchDeleteRequests(requests) {
			var _a;
			(0, ow_1.default)(requests, ow_1.default.array.ofType(ow_1.default.any(ow_1.default.object.partialShape({ id: ow_1.default.string }), ow_1.default.object.partialShape({ uniqueKey: ow_1.default.string }))).minLength(1).maxLength(consts_1.REQUEST_QUEUE_MAX_REQUESTS_PER_BATCH_OPERATION));
			const { data } = await this.httpClient.call({
				url: this._url("requests/batch"),
				method: "DELETE",
				timeout: Math.min(resource_client_1.SMALL_TIMEOUT_MILLIS, (_a = this.timeoutMillis) !== null && _a !== void 0 ? _a : Infinity),
				data: requests,
				params: this._params({ clientKey: this.clientKey })
			});
			return (0, utils_1.cast)((0, utils_1.parseDateFields)((0, utils_1.pluckData)(data)));
		}
		/**
		* Gets a specific request from the queue by its ID.
		*
		* @param id - Request ID
		* @returns The request object, or `undefined` if not found
		* @see https://docs.apify.com/api/v2/request-queue-request-get
		*/
		async getRequest(id) {
			var _a;
			(0, ow_1.default)(id, ow_1.default.string);
			const requestOpts = {
				url: this._url(`requests/${id}`),
				method: "GET",
				timeout: Math.min(resource_client_1.SMALL_TIMEOUT_MILLIS, (_a = this.timeoutMillis) !== null && _a !== void 0 ? _a : Infinity),
				params: this._params()
			};
			try {
				const response = await this.httpClient.call(requestOpts);
				return (0, utils_1.cast)((0, utils_1.parseDateFields)((0, utils_1.pluckData)(response.data)));
			} catch (err) {
				(0, utils_1.catchNotFoundOrThrow)(err);
			}
		}
		/**
		* Updates a request in the queue.
		*
		* @param request - The updated request object (must include id)
		* @param options - Update options such as whether to move to front
		* @returns Information about the updated request
		* @see https://docs.apify.com/api/v2/request-queue-request-put
		*/
		async updateRequest(request, options = {}) {
			var _a;
			(0, ow_1.default)(request, ow_1.default.object.partialShape({ id: ow_1.default.string }));
			(0, ow_1.default)(options, ow_1.default.object.exactShape({ forefront: ow_1.default.optional.boolean }));
			const response = await this.httpClient.call({
				url: this._url(`requests/${request.id}`),
				method: "PUT",
				timeout: Math.min(resource_client_1.MEDIUM_TIMEOUT_MILLIS, (_a = this.timeoutMillis) !== null && _a !== void 0 ? _a : Infinity),
				data: request,
				params: this._params({
					forefront: options.forefront,
					clientKey: this.clientKey
				})
			});
			return (0, utils_1.cast)((0, utils_1.parseDateFields)((0, utils_1.pluckData)(response.data)));
		}
		/**
		* Deletes a specific request from the queue.
		*
		* @param id - Request ID
		*/
		async deleteRequest(id) {
			var _a;
			(0, ow_1.default)(id, ow_1.default.string);
			await this.httpClient.call({
				url: this._url(`requests/${id}`),
				method: "DELETE",
				timeout: Math.min(resource_client_1.SMALL_TIMEOUT_MILLIS, (_a = this.timeoutMillis) !== null && _a !== void 0 ? _a : Infinity),
				params: this._params({ clientKey: this.clientKey })
			});
		}
		/**
		* Prolongs the lock on a request to prevent it from being returned to other clients.
		*
		* This is useful when processing a request takes longer than expected and you need
		* to extend the lock duration to prevent other workers from picking it up. The lock
		* expiration time is reset to the current time plus the specified duration.
		*
		* @param id - Request ID (obtained from {@link listAndLockHead} or {@link getRequest})
		* @param options - Lock extension options
		* @param options.lockSecs - **Required.** New lock duration in seconds from now.
		* @param options.forefront - If `true`, moves the request to the beginning of the queue when the lock expires. Default is `false`.
		* @returns Object with new `lockExpiresAt` timestamp
		* @see https://docs.apify.com/api/v2/request-queue-request-lock-put
		*
		* @example
		* ```javascript
		* // Lock request for initial processing
		* const { items } = await client.requestQueue('my-queue').listAndLockHead({ lockSecs: 60, limit: 1 });
		* const request = items[0];
		*
		* // Processing takes longer than expected, extend the lock
		* await client.requestQueue('my-queue').prolongRequestLock(request.id, { lockSecs: 120 });
		* ```
		*/
		async prolongRequestLock(id, options) {
			var _a;
			(0, ow_1.default)(id, ow_1.default.string);
			(0, ow_1.default)(options, ow_1.default.object.exactShape({
				lockSecs: ow_1.default.number,
				forefront: ow_1.default.optional.boolean
			}));
			const response = await this.httpClient.call({
				url: this._url(`requests/${id}/lock`),
				method: "PUT",
				timeout: Math.min(resource_client_1.MEDIUM_TIMEOUT_MILLIS, (_a = this.timeoutMillis) !== null && _a !== void 0 ? _a : Infinity),
				params: this._params({
					forefront: options.forefront,
					lockSecs: options.lockSecs,
					clientKey: this.clientKey
				})
			});
			return (0, utils_1.cast)((0, utils_1.parseDateFields)((0, utils_1.pluckData)(response.data)));
		}
		/**
		* Releases the lock on a request, allowing other clients to process it.
		*
		* This should be called after successfully processing a request or when you decide
		* not to process it.
		*
		* @param id - Request ID
		* @param options - Options such as whether to move to front
		* @see https://docs.apify.com/api/v2/request-queue-request-lock-delete
		*/
		async deleteRequestLock(id, options = {}) {
			var _a;
			(0, ow_1.default)(id, ow_1.default.string);
			(0, ow_1.default)(options, ow_1.default.object.exactShape({ forefront: ow_1.default.optional.boolean }));
			await this.httpClient.call({
				url: this._url(`requests/${id}/lock`),
				method: "DELETE",
				timeout: Math.min(resource_client_1.SMALL_TIMEOUT_MILLIS, (_a = this.timeoutMillis) !== null && _a !== void 0 ? _a : Infinity),
				params: this._params({
					forefront: options.forefront,
					clientKey: this.clientKey
				})
			});
		}
		/**
		* Lists all requests in the queue.
		*
		* Returns a paginated list of all requests, allowing you to iterate through the entire
		* queue contents.
		*
		* @param options - Pagination options
		* @returns List of requests with pagination information
		* @see https://docs.apify.com/api/v2/request-queue-requests-get
		*/
		listRequests(options = {}) {
			(0, ow_1.default)(options, ow_1.default.object.exactShape({
				limit: ow_1.default.optional.number.not.negative,
				exclusiveStartId: ow_1.default.optional.string
			}));
			const getPaginatedList = async (rqListOptions = {}) => {
				var _a;
				const response = await this.httpClient.call({
					url: this._url("requests"),
					method: "GET",
					timeout: Math.min(resource_client_1.MEDIUM_TIMEOUT_MILLIS, (_a = this.timeoutMillis) !== null && _a !== void 0 ? _a : Infinity),
					params: this._params({
						...rqListOptions,
						clientKey: this.clientKey
					})
				});
				return (0, utils_1.cast)((0, utils_1.parseDateFields)((0, utils_1.pluckData)(response.data)));
			};
			const paginatedListPromise = getPaginatedList(options);
			async function* asyncGenerator() {
				let currentPage = await paginatedListPromise;
				yield* currentPage.items;
				let remainingItems = options.limit ? options.limit - currentPage.items.length : void 0;
				while (currentPage.items.length > 0 && (remainingItems === void 0 || remainingItems > 0)) {
					const exclusiveStartId = currentPage.items[currentPage.items.length - 1].id;
					const newOptions = {
						...options,
						limit: remainingItems,
						exclusiveStartId
					};
					currentPage = await getPaginatedList(newOptions);
					yield* currentPage.items;
					if (remainingItems) remainingItems -= currentPage.items.length;
				}
			}
			return Object.defineProperty(paginatedListPromise, Symbol.asyncIterator, { value: asyncGenerator });
		}
		/**
		* Unlocks all requests locked by this client.
		*
		* This is useful for releasing all locks at once, for example when shutting down
		* a crawler gracefully.
		*
		* @returns Number of requests that were unlocked
		* @see https://docs.apify.com/api/v2/request-queue-requests-unlock-post
		*/
		async unlockRequests() {
			var _a;
			const response = await this.httpClient.call({
				url: this._url("requests/unlock"),
				method: "POST",
				timeout: Math.min(resource_client_1.MEDIUM_TIMEOUT_MILLIS, (_a = this.timeoutMillis) !== null && _a !== void 0 ? _a : Infinity),
				params: this._params({ clientKey: this.clientKey })
			});
			return (0, utils_1.cast)((0, utils_1.parseDateFields)((0, utils_1.pluckData)(response.data)));
		}
		/**
		* Returns an async iterable for paginating through all requests in the queue.
		*
		* This allows you to efficiently process all requests using a for-await-of loop,
		* automatically handling pagination behind the scenes.
		*
		* @param options - Pagination options
		* @returns An async iterable of request pages
		* @see https://docs.apify.com/api/v2/request-queue-requests-get
		*
		* @example
		* ```javascript
		* for await (const { items } of client.requestQueue('my-queue').paginateRequests({ limit: 100 })) {
		*   items.forEach((request) => console.log(request.url));
		* }
		* ```
		*/
		paginateRequests(options = {}) {
			(0, ow_1.default)(options, ow_1.default.object.exactShape({
				limit: ow_1.default.optional.number.not.negative,
				maxPageLimit: ow_1.default.optional.number,
				exclusiveStartId: ow_1.default.optional.string
			}));
			const { limit, exclusiveStartId, maxPageLimit = DEFAULT_REQUEST_QUEUE_REQUEST_PAGE_LIMIT } = options;
			return new utils_1.PaginationIterator({
				getPage: this.listRequests.bind(this),
				limit,
				exclusiveStartId,
				maxPageLimit
			});
		}
	};
	exports.RequestQueueClient = RequestQueueClient;
}));
//#endregion
//#region node_modules/apify-client/dist/resource_clients/run.js
var require_run = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.RunClient = void 0;
	const ow_1$15 = __require("tslib").__importDefault(require_dist$1());
	const log_1 = require_cjs$1();
	const resource_client_1 = require_resource_client();
	const utils_1 = require_utils();
	const dataset_1 = require_dataset();
	const key_value_store_1 = require_key_value_store();
	const log_2 = require_log();
	const request_queue_1 = require_request_queue();
	const RUN_CHARGE_IDEMPOTENCY_HEADER = "idempotency-key";
	/**
	* Client for managing a specific Actor run.
	*
	* Provides methods to get run details, abort, metamorph, resurrect, wait for completion,
	* and access the run's dataset, key-value store, request queue, and logs.
	*
	* @example
	* ```javascript
	* const client = new ApifyClient({ token: 'my-token' });
	* const runClient = client.run('my-run-id');
	*
	* // Get run details
	* const run = await runClient.get();
	*
	* // Wait for the run to finish
	* const finishedRun = await runClient.waitForFinish();
	*
	* // Access the run's dataset
	* const { items } = await runClient.dataset().listItems();
	* ```
	*
	* @see https://docs.apify.com/platform/actors/running/runs-and-builds
	*/
	var RunClient = class extends resource_client_1.ResourceClient {
		/**
		* @hidden
		*/
		constructor(options) {
			super({
				...options,
				resourcePath: options.resourcePath || "actor-runs"
			});
		}
		/**
		* Gets the Actor run object from the Apify API.
		*
		* @param options - Get options
		* @param options.waitForFinish - Maximum time to wait (in seconds, max 60s) for the run to finish on the API side before returning. Default is 0 (returns immediately).
		* @returns The ActorRun object, or `undefined` if it does not exist
		* @see https://docs.apify.com/api/v2/actor-run-get
		*
		* @example
		* ```javascript
		* // Get run status immediately
		* const run = await client.run('run-id').get();
		* console.log(`Status: ${run.status}`);
		*
		* // Wait up to 60 seconds for run to finish
		* const run = await client.run('run-id').get({ waitForFinish: 60 });
		* ```
		*/
		async get(options = {}) {
			(0, ow_1$15.default)(options, ow_1$15.default.object.exactShape({ waitForFinish: ow_1$15.default.optional.number }));
			return this._get(options);
		}
		/**
		* Aborts the Actor run.
		*
		* @param options - Abort options
		* @param options.gracefully - If `true`, the Actor run will abort gracefully - it can send status messages and perform cleanup. Default is `false` (immediate abort).
		* @returns The updated ActorRun object with `ABORTING` or `ABORTED` status
		* @see https://docs.apify.com/api/v2/actor-run-abort-post
		*
		* @example
		* ```javascript
		* // Abort immediately
		* await client.run('run-id').abort();
		*
		* // Abort gracefully (allows cleanup)
		* await client.run('run-id').abort({ gracefully: true });
		* ```
		*/
		async abort(options = {}) {
			(0, ow_1$15.default)(options, ow_1$15.default.object.exactShape({ gracefully: ow_1$15.default.optional.boolean }));
			const response = await this.httpClient.call({
				url: this._url("abort"),
				method: "POST",
				params: this._params(options)
			});
			return (0, utils_1.cast)((0, utils_1.parseDateFields)((0, utils_1.pluckData)(response.data)));
		}
		/**
		* Deletes the Actor run.
		*
		* @see https://docs.apify.com/api/v2/actor-run-delete
		*/
		async delete() {
			return this._delete();
		}
		/**
		* Transforms the Actor run into a run of another Actor (metamorph).
		*
		* This operation preserves the run ID, storages (dataset, key-value store, request queue),
		* and resource allocation. The run effectively becomes a run of the target Actor with new input.
		* This is useful for chaining Actor executions or implementing complex workflows.
		*
		* @param targetActorId - ID or username/name of the target Actor
		* @param input - Input for the target Actor. Can be any JSON-serializable value.
		* @param options - Metamorph options
		* @param options.build - Tag or number of the target Actor's build to run. Default is the target Actor's default build.
		* @param options.contentType - Content type of the input. If specified, input must be a string or Buffer.
		* @returns The metamorphed ActorRun object (same ID, but now running the target Actor)
		* @see https://docs.apify.com/api/v2/actor-run-metamorph-post
		*
		* @example
		* ```javascript
		* // Transform current run into another Actor
		* const metamorphedRun = await client.run('original-run-id').metamorph(
		*   'target-actor-id',
		*   { url: 'https://example.com' }
		* );
		* console.log(`Run ${metamorphedRun.id} is now running ${metamorphedRun.actId}`);
		* ```
		*/
		async metamorph(targetActorId, input, options = {}) {
			(0, ow_1$15.default)(targetActorId, ow_1$15.default.string);
			(0, ow_1$15.default)(options, ow_1$15.default.object.exactShape({
				contentType: ow_1$15.default.optional.string,
				build: ow_1$15.default.optional.string
			}));
			const params = {
				targetActorId: this._toSafeId(targetActorId),
				build: options.build
			};
			const request = {
				url: this._url("metamorph"),
				method: "POST",
				data: input,
				params: this._params(params),
				stringifyFunctions: true
			};
			if (options.contentType) request.headers = { "content-type": options.contentType };
			const response = await this.httpClient.call(request);
			return (0, utils_1.cast)((0, utils_1.parseDateFields)((0, utils_1.pluckData)(response.data)));
		}
		/**
		* Reboots the Actor run.
		*
		* Rebooting restarts the Actor's Docker container while preserving the run ID and storages.
		* This can be useful to recover from certain errors or to force the Actor to restart
		* with a fresh environment.
		*
		* @returns The updated ActorRun object
		* @see https://docs.apify.com/api/v2/actor-run-reboot-post
		*
		* @example
		* ```javascript
		* const run = await client.run('run-id').reboot();
		* ```
		*/
		async reboot() {
			const request = {
				url: this._url("reboot"),
				method: "POST"
			};
			const response = await this.httpClient.call(request);
			return (0, utils_1.cast)((0, utils_1.parseDateFields)((0, utils_1.pluckData)(response.data)));
		}
		/**
		* Updates the Actor run with specified fields.
		*
		* @param newFields - Fields to update
		* @param newFields.statusMessage - Custom status message to display (e.g., "Processing page 10/100")
		* @param newFields.isStatusMessageTerminal - If `true`, the status message is final and won't be overwritten. Default is `false`.
		* @param newFields.generalAccess - General resource access level ('FOLLOW_USER_SETTING', 'ANYONE_WITH_ID_CAN_READ' or 'RESTRICTED')
		* @returns The updated ActorRun object
		*
		* @example
		* ```javascript
		* // Set a status message
		* await client.run('run-id').update({
		*   statusMessage: 'Processing items: 50/100'
		* });
		* ```
		*/
		async update(newFields) {
			(0, ow_1$15.default)(newFields, ow_1$15.default.object);
			return this._update(newFields);
		}
		/**
		* Resurrects a finished Actor run, starting it again with the same settings.
		*
		* This creates a new run with the same configuration as the original run. The original
		* run's storages (dataset, key-value store, request queue) are preserved and reused.
		*
		* @param options - Resurrection options (override original run settings)
		* @param options.build - Tag or number of the build to use. If not provided, uses the original run's build.
		* @param options.memory - Memory in megabytes. If not provided, uses the original run's memory.
		* @param options.timeout - Timeout in seconds. If not provided, uses the original run's timeout.
		* @param options.maxItems - Maximum number of dataset items (pay-per-result Actors).
		* @param options.maxTotalChargeUsd - Maximum cost in USD (pay-per-event Actors).
		* @param options.restartOnError - Whether to restart on error.
		* @returns The new (resurrected) ActorRun object
		* @see https://docs.apify.com/api/v2/post-resurrect-run
		*
		* @example
		* ```javascript
		* // Resurrect a failed run with more memory
		* const newRun = await client.run('failed-run-id').resurrect({ memory: 2048 });
		* console.log(`New run started: ${newRun.id}`);
		* ```
		*/
		async resurrect(options = {}) {
			(0, ow_1$15.default)(options, ow_1$15.default.object.exactShape({
				build: ow_1$15.default.optional.string,
				memory: ow_1$15.default.optional.number,
				timeout: ow_1$15.default.optional.number,
				maxItems: ow_1$15.default.optional.number,
				maxTotalChargeUsd: ow_1$15.default.optional.number,
				restartOnError: ow_1$15.default.optional.boolean
			}));
			const response = await this.httpClient.call({
				url: this._url("resurrect"),
				method: "POST",
				params: this._params(options)
			});
			return (0, utils_1.cast)((0, utils_1.parseDateFields)((0, utils_1.pluckData)(response.data)));
		}
		/**
		* Charges the Actor run for a specific event.
		*
		* @param options - Charge options including event name and count.
		* @param options.eventName - **Required.** Name of the event to charge for.
		* @param options.count - Number of times to charge the event. Default is 1.
		* @param options.idempotencyKey - Optional key to ensure the charge is not duplicated. If not provided, one is auto-generated.
		* @returns Empty response object.
		* @see https://docs.apify.com/api/v2/post-charge-run
		*/
		async charge(options) {
			var _a, _b;
			(0, ow_1$15.default)(options, ow_1$15.default.object.exactShape({
				eventName: ow_1$15.default.string,
				count: ow_1$15.default.optional.number,
				idempotencyKey: ow_1$15.default.optional.string
			}));
			const count = (_a = options.count) !== null && _a !== void 0 ? _a : 1;
			/** To avoid duplicates during the same milisecond, doesn't need to by crypto-secure. */
			const randomSuffix = (Math.random() + 1).toString(36).slice(3, 8);
			const idempotencyKey = (_b = options.idempotencyKey) !== null && _b !== void 0 ? _b : `${this.id}-${options.eventName}-${Date.now()}-${randomSuffix}`;
			const request = {
				url: this._url("charge"),
				method: "POST",
				data: {
					eventName: options.eventName,
					count
				},
				headers: { [RUN_CHARGE_IDEMPOTENCY_HEADER]: idempotencyKey }
			};
			return await this.httpClient.call(request);
		}
		/**
		* Waits for the Actor run to finish and returns the finished Run object.
		*
		* The promise resolves when the run reaches a terminal state (`SUCCEEDED`, `FAILED`, `ABORTED`, or `TIMED-OUT`).
		* If `waitSecs` is provided and the timeout is reached, the promise resolves with the unfinished
		* Run object (status will be `RUNNING` or `READY`). The promise is NOT rejected based on run status.
		*
		* Unlike the `waitForFinish` parameter in {@link get}, this method can wait indefinitely
		* by polling the run status. It uses the `waitForFinish` parameter internally (max 60s per call)
		* and continuously polls until the run finishes or the timeout is reached.
		*
		* @param options - Wait options
		* @param options.waitSecs - Maximum time to wait for the run to finish, in seconds. If the limit is reached, the returned promise resolves to a run object that will have status `READY` or `RUNNING`. If omitted, waits indefinitely.
		* @returns The ActorRun object (finished or still running if timeout was reached)
		*
		* @example
		* ```javascript
		* // Wait indefinitely for run to finish
		* const run = await client.run('run-id').waitForFinish();
		* console.log(`Run finished with status: ${run.status}`);
		*
		* // Wait up to 5 minutes
		* const run = await client.run('run-id').waitForFinish({ waitSecs: 300 });
		* if (run.status === 'SUCCEEDED') {
		*   console.log('Run succeeded!');
		* }
		* ```
		*/
		async waitForFinish(options = {}) {
			(0, ow_1$15.default)(options, ow_1$15.default.object.exactShape({ waitSecs: ow_1$15.default.optional.number }));
			return this._waitForFinish(options);
		}
		/**
		* Returns a client for the default dataset of this Actor run.
		*
		* @returns A client for accessing the run's default dataset
		* @see https://docs.apify.com/api/v2/actor-run-get
		*
		* @example
		* ```javascript
		* // Access run's dataset
		* const { items } = await client.run('run-id').dataset().listItems();
		* ```
		*/
		dataset() {
			return new dataset_1.DatasetClient(this._subResourceOptions({ resourcePath: "dataset" }));
		}
		/**
		* Returns a client for the default key-value store of this Actor run.
		*
		* @returns A client for accessing the run's default key-value store
		* @see https://docs.apify.com/api/v2/actor-run-get
		*
		* @example
		* ```javascript
		* // Access run's key-value store
		* const output = await client.run('run-id').keyValueStore().getRecord('OUTPUT');
		* ```
		*/
		keyValueStore() {
			return new key_value_store_1.KeyValueStoreClient(this._subResourceOptions({ resourcePath: "key-value-store" }));
		}
		/**
		* Returns a client for the default Request queue of this Actor run.
		*
		* @returns A client for accessing the run's default Request queue
		* @see https://docs.apify.com/api/v2/actor-run-get
		*
		* @example
		* ```javascript
		* // Access run's Request queue
		* const { items } = await client.run('run-id').requestQueue().listHead();
		* ```
		*/
		requestQueue() {
			return new request_queue_1.RequestQueueClient(this._subResourceOptions({ resourcePath: "request-queue" }));
		}
		/**
		* Returns a client for accessing the log of this Actor run.
		*
		* @returns A client for accessing the run's log
		* @see https://docs.apify.com/api/v2/actor-run-get
		*
		* @example
		* ```javascript
		* // Get run log
		* const log = await client.run('run-id').log().get();
		* console.log(log);
		* ```
		*/
		log() {
			return new log_2.LogClient(this._subResourceOptions({ resourcePath: "log" }));
		}
		/**
		* Get StreamedLog for convenient streaming of the run log and their redirection.
		*/
		async getStreamedLog(options = {}) {
			var _a, _b, _c;
			const { fromStart = true } = options;
			let { toLog } = options;
			if (toLog === null || !(0, utils_1.isNode)()) return;
			if (toLog === void 0 || toLog === "default") {
				const runData = await this.get();
				const runId = (_a = runData === null || runData === void 0 ? void 0 : runData.id) !== null && _a !== void 0 ? _a : "";
				const actorId = (_b = runData === null || runData === void 0 ? void 0 : runData.actId) !== null && _b !== void 0 ? _b : "";
				const actorData = await this.apifyClient.actor(actorId).get() || { name: "" };
				const name = [(_c = actorData === null || actorData === void 0 ? void 0 : actorData.name) !== null && _c !== void 0 ? _c : "", `runId:${runId}`].filter(Boolean).join(" ");
				toLog = new log_1.Log({
					level: log_1.LEVELS.DEBUG,
					prefix: `${name} -> `,
					logger: new log_2.LoggerActorRedirect()
				});
			}
			return new log_2.StreamedLog({
				logClient: this.log(),
				toLog,
				fromStart
			});
		}
	};
	exports.RunClient = RunClient;
}));
//#endregion
//#region node_modules/apify-client/dist/resource_clients/run_collection.js
var require_run_collection = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.RunCollectionClient = void 0;
	const ow_1$14 = __require("tslib").__importDefault(require_dist$1());
	const consts_1 = require_cjs();
	const resource_collection_client_1 = require_resource_collection_client();
	/**
	* Client for managing the collection of Actor runs.
	*
	* Provides methods to list Actor runs across all Actors or for a specific Actor.
	* To access an individual run, use the `run()` method on the main ApifyClient.
	*
	* @example
	* ```javascript
	* const client = new ApifyClient({ token: 'my-token' });
	*
	* // List all runs
	* const runsClient = client.runs();
	* const { items } = await runsClient.list();
	*
	* // List runs for a specific Actor
	* const actorRunsClient = client.actor('my-actor-id').runs();
	* const { items: actorRuns } = await actorRunsClient.list();
	* ```
	*
	* @see https://docs.apify.com/platform/actors/running/runs-and-builds
	*/
	var RunCollectionClient = class extends resource_collection_client_1.ResourceCollectionClient {
		/**
		* @hidden
		*/
		constructor(options) {
			super({
				resourcePath: "runs",
				...options
			});
		}
		/**
		* Lists all Actor runs.
		*
		* Awaiting the return value (as you would with a Promise) will result in a single API call. The amount of fetched
		* items in a single API call is limited.
		* ```javascript
		* const paginatedList = await client.list(options);
		* ```
		*
		* Asynchronous iteration is also supported. This will fetch additional pages if needed until all items are
		* retrieved.
		*
		* ```javascript
		* for await (const singleItem of client.list(options)) {...}
		* ```
		*
		* @param options - Pagination and filtering options.
		* @returns A paginated iterator of Actor runs.
		* @see https://docs.apify.com/api/v2/actor-runs-get
		*/
		list(options = {}) {
			(0, ow_1$14.default)(options, ow_1$14.default.object.exactShape({
				limit: ow_1$14.default.optional.number.not.negative,
				offset: ow_1$14.default.optional.number.not.negative,
				desc: ow_1$14.default.optional.boolean,
				status: ow_1$14.default.optional.any(ow_1$14.default.string.oneOf(Object.values(consts_1.ACTOR_JOB_STATUSES)), ow_1$14.default.array.ofType(ow_1$14.default.string.oneOf(Object.values(consts_1.ACTOR_JOB_STATUSES)))),
				startedBefore: ow_1$14.default.optional.any(ow_1$14.default.optional.date, ow_1$14.default.optional.string),
				startedAfter: ow_1$14.default.optional.any(ow_1$14.default.optional.date, ow_1$14.default.optional.string)
			}));
			return this._listPaginated(options);
		}
	};
	exports.RunCollectionClient = RunCollectionClient;
}));
//#endregion
//#region node_modules/apify-client/dist/resource_clients/webhook_collection.js
var require_webhook_collection = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.WebhookCollectionClient = void 0;
	const ow_1$13 = __require("tslib").__importDefault(require_dist$1());
	const resource_collection_client_1 = require_resource_collection_client();
	/**
	* Client for managing the collection of Webhooks.
	*
	* Webhooks allow you to receive notifications when specific events occur in your Actors or tasks.
	* This client provides methods to list and create webhooks for specific Actors or tasks.
	*
	* @example
	* ```javascript
	* const client = new ApifyClient({ token: 'my-token' });
	*
	* // List webhooks for an Actor
	* const actorWebhooksClient = client.actor('my-actor-id').webhooks();
	* const { items } = await actorWebhooksClient.list();
	*
	* // Create a webhook
	* const newWebhook = await actorWebhooksClient.create({
	*   eventTypes: ['ACTOR.RUN.SUCCEEDED'],
	*   requestUrl: 'https://example.com/webhook'
	* });
	* ```
	*
	* @see https://docs.apify.com/platform/integrations/webhooks
	*/
	var WebhookCollectionClient = class extends resource_collection_client_1.ResourceCollectionClient {
		/**
		* @hidden
		*/
		constructor(options) {
			super({
				resourcePath: "webhooks",
				...options
			});
		}
		/**
		* Lists all Webhooks.
		*
		* Awaiting the return value (as you would with a Promise) will result in a single API call. The amount of fetched
		* items in a single API call is limited.
		* ```javascript
		* const paginatedList = await client.list(options);
		* ```
		*
		* Asynchronous iteration is also supported. This will fetch additional pages if needed until all items are
		* retrieved.
		*
		* ```javascript
		* for await (const singleItem of client.list(options)) {...}
		* ```
		*
		* @param options - Pagination and sorting options.
		* @returns A paginated iterator of webhooks.
		* @see https://docs.apify.com/api/v2/webhooks-get
		*/
		list(options = {}) {
			(0, ow_1$13.default)(options, ow_1$13.default.object.exactShape({
				limit: ow_1$13.default.optional.number.not.negative,
				offset: ow_1$13.default.optional.number.not.negative,
				desc: ow_1$13.default.optional.boolean
			}));
			return this._listPaginated(options);
		}
		/**
		* Creates a new webhook.
		*
		* @param webhook - The webhook data.
		* @returns The created webhook object.
		* @see https://docs.apify.com/api/v2/webhooks-post
		*/
		async create(webhook) {
			(0, ow_1$13.default)(webhook, ow_1$13.default.optional.object);
			return this._create(webhook);
		}
	};
	exports.WebhookCollectionClient = WebhookCollectionClient;
}));
//#endregion
//#region node_modules/apify-client/dist/resource_clients/actor.js
var require_actor = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.ActorClient = void 0;
	const ow_1$12 = __require("tslib").__importDefault(require_dist$1());
	const consts_1 = require_cjs();
	const log_1 = require_cjs$1();
	const resource_client_1 = require_resource_client();
	const utils_1 = require_utils();
	const actor_version_1 = require_actor_version();
	const actor_version_collection_1 = require_actor_version_collection();
	const build_1 = require_build();
	const build_collection_1 = require_build_collection();
	const run_1 = require_run();
	const run_collection_1 = require_run_collection();
	const webhook_collection_1 = require_webhook_collection();
	/**
	* Client for managing a specific Actor.
	*
	* Provides methods to start, call, build, update, and delete an Actor, as well as manage its
	* versions, builds, runs, and webhooks.
	*
	* @example
	* ```javascript
	* const client = new ApifyClient({ token: 'my-token' });
	* const actorClient = client.actor('my-actor-id');
	*
	* // Start an Actor
	* const run = await actorClient.start(input, { memory: 256 });
	*
	* // Call an Actor and wait for it to finish
	* const finishedRun = await actorClient.call({ url: 'https://example.com' });
	* ```
	*
	* @see https://docs.apify.com/platform/actors
	*/
	var ActorClient = class extends resource_client_1.ResourceClient {
		/**
		* @hidden
		*/
		constructor(options) {
			super({
				resourcePath: "acts",
				...options
			});
		}
		/**
		* Gets the Actor object from the Apify API.
		*
		* @returns The Actor object, or `undefined` if it does not exist
		* @see https://docs.apify.com/api/v2/act-get
		*/
		async get() {
			return this._get();
		}
		/**
		* Updates the Actor with specified fields.
		*
		* @param newFields - Fields to update in the Actor
		* @returns The updated Actor object
		* @see https://docs.apify.com/api/v2/act-put
		*/
		async update(newFields) {
			(0, ow_1$12.default)(newFields, ow_1$12.default.object);
			return this._update(newFields);
		}
		/**
		* Deletes the Actor.
		*
		* @see https://docs.apify.com/api/v2/act-delete
		*/
		async delete() {
			return this._delete();
		}
		/**
		* Starts the Actor and immediately returns the Run object.
		*
		* The Actor run can be configured with optional input and various options. The run starts
		* asynchronously and this method returns immediately without waiting for completion.
		* Use the {@link call} method if you want to wait for the Actor to finish.
		*
		* @param input - Input for the Actor. Can be any JSON-serializable value (object, array, string, number).
		*                If `contentType` is specified in options, input should be a string or Buffer.
		* @param options - Run configuration options
		* @param options.build - Tag or number of the build to run (e.g., `'beta'` or `'1.2.345'`). If not provided, uses the default build.
		* @param options.memory - Memory in megabytes allocated for the run. If not provided, uses the Actor's default memory setting.
		* @param options.timeout - Timeout for the run in seconds. Zero means no timeout. If not provided, uses the Actor's default timeout.
		* @param options.waitForFinish - Maximum time to wait (in seconds, max 60s) for the run to finish on the API side before returning. Default is 0 (returns immediately).
		* @param options.webhooks - Webhooks to trigger when the Actor run reaches a specific state (e.g., `SUCCEEDED`, `FAILED`).
		* @param options.maxItems - Maximum number of dataset items that will be charged (only for pay-per-result Actors).
		* @param options.maxTotalChargeUsd - Maximum cost in USD (only for pay-per-event Actors).
		* @param options.contentType - Content type of the input. If specified, input must be a string or Buffer.
		* @returns The Actor run object with status, usage, and storage IDs
		* @see https://docs.apify.com/api/v2/act-runs-post
		*
		* @example
		* ```javascript
		* // Start Actor with simple input
		* const run = await client.actor('my-actor').start({ url: 'https://example.com' });
		* console.log(`Run started with ID: ${run.id}, status: ${run.status}`);
		*
		* // Start Actor with specific build and memory
		* const run = await client.actor('my-actor').start(
		*   { url: 'https://example.com' },
		*   { build: '0.1.2', memory: 512, timeout: 300 }
		* );
		* ```
		*/
		async start(input, options = {}) {
			(0, ow_1$12.default)(options, ow_1$12.default.object.exactShape({
				build: ow_1$12.default.optional.string,
				contentType: ow_1$12.default.optional.string,
				memory: ow_1$12.default.optional.number,
				timeout: ow_1$12.default.optional.number,
				waitForFinish: ow_1$12.default.optional.number,
				webhooks: ow_1$12.default.optional.array.ofType(ow_1$12.default.object),
				maxItems: ow_1$12.default.optional.number.not.negative,
				maxTotalChargeUsd: ow_1$12.default.optional.number.not.negative,
				restartOnError: ow_1$12.default.optional.boolean,
				forcePermissionLevel: ow_1$12.default.optional.string.oneOf(Object.values(consts_1.ACTOR_PERMISSION_LEVEL))
			}));
			const { waitForFinish, timeout, memory, build, maxItems, maxTotalChargeUsd, restartOnError, forcePermissionLevel } = options;
			const params = {
				waitForFinish,
				timeout,
				memory,
				build,
				webhooks: (0, utils_1.stringifyWebhooksToBase64)(options.webhooks),
				maxItems,
				maxTotalChargeUsd,
				restartOnError,
				forcePermissionLevel
			};
			const request = {
				url: this._url("runs"),
				method: "POST",
				data: input,
				params: this._params(params),
				stringifyFunctions: true
			};
			if (options.contentType) request.headers = { "content-type": options.contentType };
			const response = await this.httpClient.call(request);
			return (0, utils_1.cast)((0, utils_1.parseDateFields)((0, utils_1.pluckData)(response.data)));
		}
		/**
		* Starts the Actor and waits for it to finish before returning the Run object.
		*
		* This is a convenience method that starts the Actor run and waits for its completion
		* by polling the run status. It optionally streams logs to the console or a custom Log instance.
		* By default, it waits indefinitely unless the `waitSecs` option is provided.
		*
		* @param input - Input for the Actor. Can be any JSON-serializable value (object, array, string, number).
		*                If `contentType` is specified in options, input should be a string or Buffer.
		* @param options - Run configuration options (extends all options from {@link start})
		* @param options.waitSecs - Maximum time to wait for the run to finish, in seconds. If omitted, waits indefinitely.
		* @param options.log - Log instance for streaming run logs. Use `'default'` for console output, `null` to disable logging, or provide a custom Log instance.
		* @param options.build - Tag or number of the build to run (e.g., `'beta'` or `'1.2.345'`).
		* @param options.memory - Memory in megabytes allocated for the run.
		* @param options.timeout - Maximum run duration in seconds.
		* @returns The finished Actor run object with final status (`SUCCEEDED`, `FAILED`, `ABORTED`, or `TIMED-OUT`)
		* @see https://docs.apify.com/api/v2/act-runs-post
		*
		* @example
		* ```javascript
		* // Run an Actor and wait for it to finish
		* const run = await client.actor('my-actor').call({ url: 'https://example.com' });
		* console.log(`Run finished with status: ${run.status}`);
		* console.log(`Dataset ID: ${run.defaultDatasetId}`);
		*
		* // Run with a timeout and log streaming to console
		* const run = await client.actor('my-actor').call(
		*   { url: 'https://example.com' },
		*   { waitSecs: 300, log: 'default' }
		* );
		*
		* // Run with custom log instance
		* import { Log } from '@apify/log';
		* const log = new Log({ prefix: 'My Actor' });
		* const run = await client.actor('my-actor').call({ url: 'https://example.com' }, { log });
		* ```
		*/
		async call(input, options = {}) {
			(0, ow_1$12.default)(options, ow_1$12.default.object.exactShape({
				build: ow_1$12.default.optional.string,
				contentType: ow_1$12.default.optional.string,
				memory: ow_1$12.default.optional.number,
				timeout: ow_1$12.default.optional.number.not.negative,
				waitSecs: ow_1$12.default.optional.number.not.negative,
				webhooks: ow_1$12.default.optional.array.ofType(ow_1$12.default.object),
				maxItems: ow_1$12.default.optional.number.not.negative,
				maxTotalChargeUsd: ow_1$12.default.optional.number.not.negative,
				log: ow_1$12.default.optional.any(ow_1$12.default.null, ow_1$12.default.object.instanceOf(log_1.Log), ow_1$12.default.string.equals("default")),
				restartOnError: ow_1$12.default.optional.boolean,
				forcePermissionLevel: ow_1$12.default.optional.string.oneOf(Object.values(consts_1.ACTOR_PERMISSION_LEVEL))
			}));
			const { waitSecs, log, ...startOptions } = options;
			const { id } = await this.start(input, startOptions);
			const streamedLog = await this.apifyClient.run(id).getStreamedLog({ toLog: options === null || options === void 0 ? void 0 : options.log });
			streamedLog === null || streamedLog === void 0 || streamedLog.start();
			return this.apifyClient.run(id).waitForFinish({ waitSecs }).finally(async () => {
				await (streamedLog === null || streamedLog === void 0 ? void 0 : streamedLog.stop());
			});
		}
		/**
		* Builds the Actor.
		*
		* Creates a new build of the specified Actor version. The build compiles the Actor's
		* source code, installs dependencies, and prepares it for execution.
		*
		* @param versionNumber - Version number or tag to build (e.g., `'0.1'`, `'0.2'`, `'latest'`)
		* @param options - Build configuration options
		* @param options.betaPackages - If `true`, the build uses beta versions of Apify NPM packages.
		* @param options.tag - Tag to be applied to the build (e.g., `'latest'`, `'beta'`). Existing tag with the same name will be replaced.
		* @param options.useCache - If `false`, Docker build cache will be ignored. Default is `true`.
		* @param options.waitForFinish - Maximum time to wait (in seconds, max 60s) for the build to finish on the API side before returning. Default is 0 (returns immediately).
		* @returns The Build object with status and build details
		* @see https://docs.apify.com/api/v2/act-builds-post
		*
		* @example
		* ```javascript
		* // Start a build and return immediately
		* const build = await client.actor('my-actor').build('0.1');
		* console.log(`Build ${build.id} started with status: ${build.status}`);
		*
		* // Build and wait up to 120 seconds for it to finish
		* const build = await client.actor('my-actor').build('0.1', {
		*   waitForFinish: 120,
		*   tag: 'latest',
		*   useCache: true
		* });
		* ```
		*/
		async build(versionNumber, options = {}) {
			(0, ow_1$12.default)(versionNumber, ow_1$12.default.string);
			(0, ow_1$12.default)(options, ow_1$12.default.object.exactShape({
				betaPackages: ow_1$12.default.optional.boolean,
				tag: ow_1$12.default.optional.string,
				useCache: ow_1$12.default.optional.boolean,
				waitForFinish: ow_1$12.default.optional.number
			}));
			const response = await this.httpClient.call({
				url: this._url("builds"),
				method: "POST",
				params: this._params({
					version: versionNumber,
					...options
				})
			});
			return (0, utils_1.cast)((0, utils_1.parseDateFields)((0, utils_1.pluckData)(response.data)));
		}
		/**
		* Retrieves the default build of the Actor.
		*
		* @param options - Options for getting the build.
		* @returns A client for the default build.
		* @see https://docs.apify.com/api/v2/act-build-default-get
		*/
		async defaultBuild(options = {}) {
			const response = await this.httpClient.call({
				url: this._url("builds/default"),
				method: "GET",
				params: this._params(options)
			});
			const { id } = (0, utils_1.pluckData)(response.data);
			return new build_1.BuildClient({
				baseUrl: this.apifyClient.baseUrl,
				publicBaseUrl: this.apifyClient.publicBaseUrl,
				httpClient: this.httpClient,
				apifyClient: this.apifyClient,
				id
			});
		}
		/**
		* Returns a client for the last run of this Actor.
		*
		* Provides access to the most recent Actor run, optionally filtered by status or origin.
		*
		* @param options - Options to filter the last run
		* @param options.status - Filter by run status (e.g., `'SUCCEEDED'`, `'FAILED'`, `'RUNNING'`, `'ABORTED'`, `'TIMED-OUT'`).
		* @param options.origin - Filter by run origin (e.g., `'DEVELOPMENT'`, `'WEB'`, `'API'`, `'SCHEDULER'`).
		* @returns A client for the last run
		* @see https://docs.apify.com/api/v2/act-runs-last-get
		*
		* @example
		* ```javascript
		* // Get the last successful run
		* const lastRun = await client.actor('my-actor').lastRun({ status: 'SUCCEEDED' }).get();
		* ```
		*/
		lastRun(options = {}) {
			(0, ow_1$12.default)(options, ow_1$12.default.object.exactShape({
				status: ow_1$12.default.optional.string.oneOf(Object.values(consts_1.ACT_JOB_STATUSES)),
				origin: ow_1$12.default.optional.string.oneOf(Object.values(consts_1.META_ORIGINS))
			}));
			return new run_1.RunClient(this._subResourceOptions({
				id: "last",
				params: this._params(options),
				resourcePath: "runs"
			}));
		}
		/**
		* Returns a client for managing builds of this Actor.
		*
		* @returns A client for the Actor's build collection
		* @see https://docs.apify.com/api/v2/act-builds-get
		*/
		builds() {
			return new build_collection_1.BuildCollectionClient(this._subResourceOptions({ resourcePath: "builds" }));
		}
		/**
		* Returns a client for managing runs of this Actor.
		*
		* @returns A client for the Actor's run collection
		* @see https://docs.apify.com/api/v2/act-runs-get
		*/
		runs() {
			return new run_collection_1.RunCollectionClient(this._subResourceOptions({ resourcePath: "runs" }));
		}
		/**
		* Returns a client for a specific version of this Actor.
		*
		* @param versionNumber - Version number (e.g., '0.1', '1.2.3')
		* @returns A client for the specified Actor version
		* @see https://docs.apify.com/api/v2/act-version-get
		*/
		version(versionNumber) {
			(0, ow_1$12.default)(versionNumber, ow_1$12.default.string);
			return new actor_version_1.ActorVersionClient(this._subResourceOptions({ id: versionNumber }));
		}
		/**
		* Returns a client for managing versions of this Actor.
		*
		* @returns A client for the Actor's version collection
		* @see https://docs.apify.com/api/v2/act-versions-get
		*/
		versions() {
			return new actor_version_collection_1.ActorVersionCollectionClient(this._subResourceOptions());
		}
		/**
		* Returns a client for managing webhooks associated with this Actor.
		*
		* @returns A client for the Actor's webhook collection
		* @see https://docs.apify.com/api/v2/act-webhooks-get
		*/
		webhooks() {
			return new webhook_collection_1.WebhookCollectionClient(this._subResourceOptions());
		}
	};
	exports.ActorClient = ActorClient;
}));
//#endregion
//#region node_modules/apify-client/dist/resource_clients/actor_collection.js
var require_actor_collection = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.ActorListSortBy = exports.ActorCollectionClient = void 0;
	const ow_1$11 = __require("tslib").__importDefault(require_dist$1());
	const resource_collection_client_1 = require_resource_collection_client();
	/**
	* Client for managing the collection of Actors in your account.
	*
	* Provides methods to list and create Actors. To access an individual Actor,
	* use the `actor()` method on the main ApifyClient.
	*
	* @example
	* ```javascript
	* const client = new ApifyClient({ token: 'my-token' });
	* const actorsClient = client.actors();
	*
	* // List all Actors
	* const { items } = await actorsClient.list();
	*
	* // Create a new Actor
	* const newActor = await actorsClient.create({
	*   name: 'my-actor',
	*   title: 'My Actor'
	* });
	* ```
	*
	* @see https://docs.apify.com/platform/actors
	*/
	var ActorCollectionClient = class extends resource_collection_client_1.ResourceCollectionClient {
		/**
		* @hidden
		*/
		constructor(options) {
			super({
				resourcePath: "acts",
				...options
			});
		}
		/**
		* Lists all Actors.
		*
		* Awaiting the return value (as you would with a Promise) will result in a single API call. The amount of fetched
		* items in a single API call is limited.
		* ```javascript
		* const paginatedList = await client.list(options);
		* ```
		*
		* Asynchronous iteration is also supported. This will fetch additional pages if needed until all items are
		* retrieved.
		*
		* ```javascript
		* for await (const singleItem of client.list(options)) {...}
		* ```
		*
		* @param options - Pagination options.
		* @returns A paginated iterator of Actors.
		* @see https://docs.apify.com/api/v2/acts-get
		*/
		list(options = {}) {
			(0, ow_1$11.default)(options, ow_1$11.default.object.exactShape({
				my: ow_1$11.default.optional.boolean,
				limit: ow_1$11.default.optional.number.not.negative,
				offset: ow_1$11.default.optional.number.not.negative,
				desc: ow_1$11.default.optional.boolean,
				sortBy: ow_1$11.default.optional.string.oneOf(Object.values(ActorListSortBy))
			}));
			return this._listPaginated(options);
		}
		/**
		* Creates a new Actor.
		*
		* @param actor - The Actor data.
		* @returns The created Actor object.
		* @see https://docs.apify.com/api/v2/acts-post
		*/
		async create(actor) {
			(0, ow_1$11.default)(actor, ow_1$11.default.optional.object);
			return this._create(actor);
		}
	};
	exports.ActorCollectionClient = ActorCollectionClient;
	var ActorListSortBy;
	(function(ActorListSortBy) {
		ActorListSortBy["CREATED_AT"] = "createdAt";
		ActorListSortBy["LAST_RUN_STARTED_AT"] = "stats.lastRunStartedAt";
	})(ActorListSortBy || (exports.ActorListSortBy = ActorListSortBy = {}));
}));
//#endregion
//#region node_modules/apify-client/dist/resource_clients/dataset_collection.js
var require_dataset_collection = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.DatasetCollectionClient = void 0;
	const ow_1$10 = __require("tslib").__importDefault(require_dist$1());
	const consts_1 = require_cjs();
	const resource_collection_client_1 = require_resource_collection_client();
	/**
	* Client for managing the collection of datasets in your account.
	*
	* Datasets store structured data results from Actor runs. This client provides methods
	* to list, create, or get datasets by name.
	*
	* @example
	* ```javascript
	* const client = new ApifyClient({ token: 'my-token' });
	* const datasetsClient = client.datasets();
	*
	* // List all datasets
	* const { items } = await datasetsClient.list();
	*
	* // Get or create a dataset by name
	* const dataset = await datasetsClient.getOrCreate('my-dataset');
	* ```
	*
	* @see https://docs.apify.com/platform/storage/dataset
	*/
	var DatasetCollectionClient = class extends resource_collection_client_1.ResourceCollectionClient {
		/**
		* @hidden
		*/
		constructor(options) {
			super({
				resourcePath: "datasets",
				...options
			});
		}
		/**
		* Lists all Datasets.
		*
		* Awaiting the return value (as you would with a Promise) will result in a single API call. The amount of fetched
		* items in a single API call is limited.
		* ```javascript
		* const paginatedList = await client.list(options);
		* ```
		*
		* Asynchronous iteration is also supported. This will fetch additional pages if needed until all items are
		* retrieved.
		*
		* ```javascript
		* for await (const singleItem of client.list(options)) {...}
		* ```
		*
		* @param options - Pagination options.
		* @returns A paginated iterator of Datasets.
		* @see https://docs.apify.com/api/v2/datasets-get
		*/
		list(options = {}) {
			(0, ow_1$10.default)(options, ow_1$10.default.object.exactShape({
				unnamed: ow_1$10.default.optional.boolean,
				limit: ow_1$10.default.optional.number.not.negative,
				offset: ow_1$10.default.optional.number.not.negative,
				desc: ow_1$10.default.optional.boolean,
				ownership: ow_1$10.default.optional.string.oneOf(Object.values(consts_1.STORAGE_OWNERSHIP_FILTER))
			}));
			return this._listPaginated(options);
		}
		/**
		* Gets or creates a dataset with the specified name.
		*
		* @param name - Name of the dataset. If not provided, a default dataset is used.
		* @param options - Additional options like schema.
		* @returns The dataset object.
		* @see https://docs.apify.com/api/v2/datasets-post
		*/
		async getOrCreate(name, options) {
			(0, ow_1$10.default)(name, ow_1$10.default.optional.string);
			(0, ow_1$10.default)(options === null || options === void 0 ? void 0 : options.schema, ow_1$10.default.optional.object);
			return this._getOrCreate(name, options);
		}
	};
	exports.DatasetCollectionClient = DatasetCollectionClient;
}));
//#endregion
//#region node_modules/apify-client/dist/resource_clients/key_value_store_collection.js
var require_key_value_store_collection = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.KeyValueStoreCollectionClient = void 0;
	const ow_1$9 = __require("tslib").__importDefault(require_dist$1());
	const consts_1 = require_cjs();
	const resource_collection_client_1 = require_resource_collection_client();
	/**
	* Client for managing the collection of Key-value stores in your account.
	*
	* Key-value stores are used to store arbitrary data records or files. This client provides
	* methods to list, create, or get key-value stores by name.
	*
	* @example
	* ```javascript
	* const client = new ApifyClient({ token: 'my-token' });
	* const storesClient = client.keyValueStores();
	*
	* // List all key-value stores
	* const { items } = await storesClient.list();
	*
	* // Get or create a key-value store by name
	* const store = await storesClient.getOrCreate('my-store');
	* ```
	*
	* @see https://docs.apify.com/platform/storage/key-value-store
	*/
	var KeyValueStoreCollectionClient = class extends resource_collection_client_1.ResourceCollectionClient {
		/**
		* @hidden
		*/
		constructor(options) {
			super({
				resourcePath: "key-value-stores",
				...options
			});
		}
		/**
		* Lists all Key-value stores.
		*
		* Awaiting the return value (as you would with a Promise) will result in a single API call. The amount of fetched
		* items in a single API call is limited.
		* ```javascript
		* const paginatedList = await client.list(options);
		* ```
		*
		* Asynchronous iteration is also supported. This will fetch additional pages if needed until all items are
		* retrieved.
		*
		* ```javascript
		* for await (const singleItem of client.list(options)) {...}
		* ```
		*
		* @param options - Pagination options.
		* @returns A paginated iterator of Key-value stores.
		* @see https://docs.apify.com/api/v2/key-value-stores-get
		*/
		list(options = {}) {
			(0, ow_1$9.default)(options, ow_1$9.default.object.exactShape({
				unnamed: ow_1$9.default.optional.boolean,
				limit: ow_1$9.default.optional.number.not.negative,
				offset: ow_1$9.default.optional.number.not.negative,
				desc: ow_1$9.default.optional.boolean,
				ownership: ow_1$9.default.optional.string.oneOf(Object.values(consts_1.STORAGE_OWNERSHIP_FILTER))
			}));
			return this._listPaginated(options);
		}
		/**
		* Gets or creates a key-value store with the specified name.
		*
		* @param name - Name of the key-value store. If not provided, a default store is used.
		* @param options - Additional options like schema.
		* @returns The key-value store object.
		* @see https://docs.apify.com/api/v2/key-value-stores-post
		*/
		async getOrCreate(name, options) {
			(0, ow_1$9.default)(name, ow_1$9.default.optional.string);
			(0, ow_1$9.default)(options === null || options === void 0 ? void 0 : options.schema, ow_1$9.default.optional.object);
			return this._getOrCreate(name, options);
		}
	};
	exports.KeyValueStoreCollectionClient = KeyValueStoreCollectionClient;
}));
//#endregion
//#region node_modules/apify-client/dist/resource_clients/request_queue_collection.js
var require_request_queue_collection = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.RequestQueueCollectionClient = void 0;
	const ow_1$8 = __require("tslib").__importDefault(require_dist$1());
	const consts_1 = require_cjs();
	const resource_collection_client_1 = require_resource_collection_client();
	/**
	* Client for managing the collection of Request queues in your account.
	*
	* Request queues store URLs to be crawled and their metadata. This client provides methods
	* to list, create, or get request queues by name.
	*
	* @example
	* ```javascript
	* const client = new ApifyClient({ token: 'my-token' });
	* const queuesClient = client.requestQueues();
	*
	* // List all request queues
	* const { items } = await queuesClient.list();
	*
	* // Get or create a request queue by name
	* const queue = await queuesClient.getOrCreate('my-queue');
	* ```
	*
	* @see https://docs.apify.com/platform/storage/request-queue
	*/
	var RequestQueueCollectionClient = class extends resource_collection_client_1.ResourceCollectionClient {
		/**
		* @hidden
		*/
		constructor(options) {
			super({
				resourcePath: "request-queues",
				...options
			});
		}
		/**
		* Lists all Request queues.
		*
		* Awaiting the return value (as you would with a Promise) will result in a single API call. The amount of fetched
		* items in a single API call is limited.
		* ```javascript
		* const paginatedList = await client.list(options);
		* ```
		*
		* Asynchronous iteration is also supported. This will fetch additional pages if needed until all items are
		* retrieved.
		*
		* ```javascript
		* for await (const singleItem of client.list(options)) {...}
		* ```
		*
		* @param options - Pagination options.
		* @returns A paginated iterator of Request queues.
		* @see https://docs.apify.com/api/v2/request-queues-get
		*/
		list(options = {}) {
			(0, ow_1$8.default)(options, ow_1$8.default.object.exactShape({
				unnamed: ow_1$8.default.optional.boolean,
				limit: ow_1$8.default.optional.number.not.negative,
				offset: ow_1$8.default.optional.number.not.negative,
				desc: ow_1$8.default.optional.boolean,
				ownership: ow_1$8.default.optional.string.oneOf(Object.values(consts_1.STORAGE_OWNERSHIP_FILTER))
			}));
			return this._listPaginated(options);
		}
		/**
		* Gets or creates a Request queue with the specified name.
		*
		* @param name - Name of the Request queue. If not provided, a default queue is used.
		* @returns The Request queue object.
		* @see https://docs.apify.com/api/v2/request-queues-post
		*/
		async getOrCreate(name) {
			(0, ow_1$8.default)(name, ow_1$8.default.optional.string);
			return this._getOrCreate(name);
		}
	};
	exports.RequestQueueCollectionClient = RequestQueueCollectionClient;
}));
//#endregion
//#region node_modules/apify-client/dist/resource_clients/schedule.js
var require_schedule = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.ScheduleActions = exports.ScheduleClient = void 0;
	const ow_1$7 = __require("tslib").__importDefault(require_dist$1());
	const resource_client_1 = require_resource_client();
	const utils_1 = require_utils();
	/**
	* Client for managing a specific Schedule.
	*
	* Schedules are used to automatically start Actors or tasks at specified times. This client provides
	* methods to get, update, and delete schedules, as well as retrieve schedule logs.
	*
	* @example
	* ```javascript
	* const client = new ApifyClient({ token: 'my-token' });
	* const scheduleClient = client.schedule('my-schedule-id');
	*
	* // Get schedule details
	* const schedule = await scheduleClient.get();
	*
	* // Update schedule
	* await scheduleClient.update({
	*   cronExpression: '0 12 * * *',
	*   isEnabled: true
	* });
	* ```
	*
	* @see https://docs.apify.com/platform/schedules
	*/
	var ScheduleClient = class extends resource_client_1.ResourceClient {
		/**
		* @hidden
		*/
		constructor(options) {
			super({
				resourcePath: "schedules",
				...options
			});
		}
		/**
		* Retrieves the schedule.
		*
		* @returns The schedule object, or `undefined` if it does not exist.
		* @see https://docs.apify.com/api/v2/schedule-get
		*/
		async get() {
			return this._get();
		}
		/**
		* Updates the schedule with the specified fields.
		*
		* @param newFields - Fields to update.
		* @returns The updated schedule object.
		* @see https://docs.apify.com/api/v2/schedule-put
		*/
		async update(newFields) {
			(0, ow_1$7.default)(newFields, ow_1$7.default.object);
			return this._update(newFields);
		}
		/**
		* Deletes the schedule.
		*
		* @see https://docs.apify.com/api/v2/schedule-delete
		*/
		async delete() {
			return this._delete();
		}
		/**
		* Retrieves the schedule's log.
		*
		* @returns The schedule log as a string, or `undefined` if it does not exist.
		* @see https://docs.apify.com/api/v2/schedule-log-get
		*/
		async getLog() {
			const requestOpts = {
				url: this._url("log"),
				method: "GET",
				params: this._params()
			};
			try {
				const response = await this.httpClient.call(requestOpts);
				return (0, utils_1.cast)((0, utils_1.parseDateFields)((0, utils_1.pluckData)(response.data)));
			} catch (err) {
				(0, utils_1.catchNotFoundOrThrow)(err);
			}
		}
	};
	exports.ScheduleClient = ScheduleClient;
	/**
	* Types of actions that can be scheduled.
	*/
	var ScheduleActions;
	(function(ScheduleActions) {
		ScheduleActions["RunActor"] = "RUN_ACTOR";
		ScheduleActions["RunActorTask"] = "RUN_ACTOR_TASK";
	})(ScheduleActions || (exports.ScheduleActions = ScheduleActions = {}));
}));
//#endregion
//#region node_modules/apify-client/dist/resource_clients/schedule_collection.js
var require_schedule_collection = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.ScheduleCollectionClient = void 0;
	const ow_1$6 = __require("tslib").__importDefault(require_dist$1());
	const resource_collection_client_1 = require_resource_collection_client();
	/**
	* Client for managing the collection of Schedules in your account.
	*
	* Schedules are used to automatically start Actors or tasks at specified times.
	* This client provides methods to list and create schedules.
	*
	* @example
	* ```javascript
	* const client = new ApifyClient({ token: 'my-token' });
	* const schedulesClient = client.schedules();
	*
	* // List all schedules
	* const { items } = await schedulesClient.list();
	*
	* // Create a new schedule
	* const newSchedule = await schedulesClient.create({
	*   actorId: 'my-actor-id',
	*   cronExpression: '0 9 * * *',
	*   isEnabled: true
	* });
	* ```
	*
	* @see https://docs.apify.com/platform/schedules
	*/
	var ScheduleCollectionClient = class extends resource_collection_client_1.ResourceCollectionClient {
		/**
		* @hidden
		*/
		constructor(options) {
			super({
				resourcePath: "schedules",
				...options
			});
		}
		/**
		* Lists all schedules.
		*
		* Awaiting the return value (as you would with a Promise) will result in a single API call. The amount of fetched
		* items in a single API call is limited.
		* ```javascript
		* const paginatedList = await client.list(options);
		* ```
		*
		* Asynchronous iteration is also supported. This will fetch additional pages if needed until all items are
		* retrieved.
		*
		* ```javascript
		* for await (const singleItem of client.list(options)) {...}
		* ```
		*
		* @param options - Pagination and sorting options.
		* @returns A paginated iterator of schedules.
		* @see https://docs.apify.com/api/v2/schedules-get
		*/
		list(options = {}) {
			(0, ow_1$6.default)(options, ow_1$6.default.object.exactShape({
				limit: ow_1$6.default.optional.number.not.negative,
				offset: ow_1$6.default.optional.number.not.negative,
				desc: ow_1$6.default.optional.boolean
			}));
			return this._listPaginated(options);
		}
		/**
		* Creates a new schedule.
		*
		* @param schedule - The schedule data.
		* @returns The created schedule object.
		* @see https://docs.apify.com/api/v2/schedules-post
		*/
		async create(schedule) {
			(0, ow_1$6.default)(schedule, ow_1$6.default.optional.object);
			return this._create(schedule);
		}
	};
	exports.ScheduleCollectionClient = ScheduleCollectionClient;
}));
//#endregion
//#region node_modules/apify-client/dist/resource_clients/store_collection.js
var require_store_collection = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.StoreCollectionClient = void 0;
	const ow_1$5 = __require("tslib").__importDefault(require_dist$1());
	const resource_collection_client_1 = require_resource_collection_client();
	/**
	* Client for browsing Actors in the Apify Store.
	*
	* The Apify Store contains publicly available Actors that can be used by anyone.
	* This client provides methods to search and list Actors from the Store.
	*
	* @example
	* ```javascript
	* const client = new ApifyClient();
	* const storeClient = client.store();
	*
	* // Search for Actors in the Store
	* const { items } = await storeClient.list({ search: 'web scraper' });
	*
	* // Get details about a specific Store Actor
	* const actor = await storeClient.list({ username: 'apify', actorName: 'web-scraper' });
	* ```
	*
	* @see https://docs.apify.com/platform/actors/publishing
	*/
	var StoreCollectionClient = class extends resource_collection_client_1.ResourceCollectionClient {
		/**
		* @hidden
		*/
		constructor(options) {
			super({
				resourcePath: "store",
				...options
			});
		}
		/**
		* Lists Actors from the Apify Store.
		*
		* Awaiting the return value (as you would with a Promise) will result in a single API call. The amount of fetched
		* items in a single API call is limited.
		* ```javascript
		* const paginatedList = await client.list(options);
		* ```
		*
		* Asynchronous iteration is also supported. This will fetch additional pages if needed until all items are
		* retrieved.
		*
		* ```javascript
		* for await (const singleItem of client.list(options)) {...}
		* ```
		*
		* @param options - Search and pagination options.
		* @returns A paginated iterator of store Actors.
		* @see https://docs.apify.com/api/v2/store-get
		*/
		list(options = {}) {
			(0, ow_1$5.default)(options, ow_1$5.default.object.exactShape({
				limit: ow_1$5.default.optional.number.not.negative,
				offset: ow_1$5.default.optional.number.not.negative,
				search: ow_1$5.default.optional.string,
				sortBy: ow_1$5.default.optional.string,
				category: ow_1$5.default.optional.string,
				username: ow_1$5.default.optional.string,
				pricingModel: ow_1$5.default.optional.string
			}));
			return this._listPaginated(options);
		}
	};
	exports.StoreCollectionClient = StoreCollectionClient;
}));
//#endregion
//#region node_modules/apify-client/dist/resource_clients/task.js
var require_task = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.TaskClient = void 0;
	const ow_1$4 = __require("tslib").__importDefault(require_dist$1());
	const consts_1 = require_cjs();
	const resource_client_1 = require_resource_client();
	const utils_1 = require_utils();
	const run_1 = require_run();
	const run_collection_1 = require_run_collection();
	const webhook_collection_1 = require_webhook_collection();
	/**
	* Client for managing a specific Actor task.
	*
	* Tasks are pre-configured Actor runs with saved input and options. This client provides methods
	* to start, call, update, and delete tasks, as well as manage their runs and webhooks.
	*
	* @example
	* ```javascript
	* const client = new ApifyClient({ token: 'my-token' });
	* const taskClient = client.task('my-task-id');
	*
	* // Start a task
	* const run = await taskClient.start();
	*
	* // Call a task and wait for it to finish
	* const finishedRun = await taskClient.call();
	* ```
	*
	* @see https://docs.apify.com/platform/actors/running/tasks
	*/
	var TaskClient = class extends resource_client_1.ResourceClient {
		/**
		* @hidden
		*/
		constructor(options) {
			super({
				resourcePath: "actor-tasks",
				...options
			});
		}
		/**
		* Retrieves the Actor task.
		*
		* @returns The task object, or `undefined` if it does not exist.
		* @see https://docs.apify.com/api/v2/actor-task-get
		*/
		async get() {
			return this._get();
		}
		/**
		* Updates the task with the specified fields.
		*
		* @param newFields - Fields to update.
		* @returns The updated task object.
		* @see https://docs.apify.com/api/v2/actor-task-put
		*/
		async update(newFields) {
			(0, ow_1$4.default)(newFields, ow_1$4.default.object);
			return this._update(newFields);
		}
		/**
		* Deletes the Task.
		*
		* @see https://docs.apify.com/api/v2/actor-task-delete
		*/
		async delete() {
			return this._delete();
		}
		/**
		* Starts an Actor task and immediately returns the Run object.
		*
		* @param input - Input overrides for the task. If not provided, the task's saved input is used.
		* @param options - Run options.
		* @param options.build - Tag or number of the Actor build to run (e.g., `'beta'` or `'1.2.345'`).
		* @param options.memory - Memory in megabytes allocated for the run.
		* @param options.timeout - Timeout for the run in seconds. Zero means no timeout.
		* @param options.waitForFinish - Maximum time to wait (in seconds, max 60s) for the run to finish before returning.
		* @param options.webhooks - Webhooks to trigger for specific Actor run events.
		* @param options.maxItems - Maximum number of dataset items (for pay-per-result Actors).
		* @param options.maxTotalChargeUsd - Maximum cost in USD (for pay-per-event Actors).
		* @param options.restartOnError - Whether to restart the run on error.
		* @returns The Actor Run object.
		* @see https://docs.apify.com/api/v2/actor-task-runs-post
		*/
		async start(input, options = {}) {
			(0, ow_1$4.default)(input, ow_1$4.default.optional.object);
			(0, ow_1$4.default)(options, ow_1$4.default.object.exactShape({
				build: ow_1$4.default.optional.string,
				memory: ow_1$4.default.optional.number,
				timeout: ow_1$4.default.optional.number,
				waitForFinish: ow_1$4.default.optional.number,
				webhooks: ow_1$4.default.optional.array.ofType(ow_1$4.default.object),
				maxItems: ow_1$4.default.optional.number.not.negative,
				maxTotalChargeUsd: ow_1$4.default.optional.number.not.negative,
				restartOnError: ow_1$4.default.optional.boolean
			}));
			const { waitForFinish, timeout, memory, build, maxItems, maxTotalChargeUsd, restartOnError } = options;
			const params = {
				waitForFinish,
				timeout,
				memory,
				build,
				webhooks: (0, utils_1.stringifyWebhooksToBase64)(options.webhooks),
				maxItems,
				maxTotalChargeUsd,
				restartOnError
			};
			const request = {
				url: this._url("runs"),
				method: "POST",
				data: input,
				params: this._params(params),
				stringifyFunctions: true,
				headers: { "Content-Type": "application/json" }
			};
			const response = await this.httpClient.call(request);
			return (0, utils_1.cast)((0, utils_1.parseDateFields)((0, utils_1.pluckData)(response.data)));
		}
		/**
		* Starts a task and waits for it to finish before returning the Run object.
		* It waits indefinitely, unless the `waitSecs` option is provided.
		*
		* @param input - Input overrides for the task. If not provided, the task's saved input is used.
		* @param options - Run and wait options.
		* @param options.build - Tag or number of the Actor build to run.
		* @param options.memory - Memory in megabytes allocated for the run.
		* @param options.timeout - Timeout for the run in seconds.
		* @param options.waitSecs - Maximum time to wait for the run to finish, in seconds. If omitted, waits indefinitely.
		* @param options.webhooks - Webhooks to trigger for specific Actor run events.
		* @param options.maxItems - Maximum number of dataset items (for pay-per-result Actors).
		* @param options.maxTotalChargeUsd - Maximum cost in USD (for pay-per-event Actors).
		* @param options.restartOnError - Whether to restart the run on error.
		* @returns The Actor run object.
		* @see https://docs.apify.com/api/v2/actor-task-runs-post
		*/
		async call(input, options = {}) {
			(0, ow_1$4.default)(input, ow_1$4.default.optional.object);
			(0, ow_1$4.default)(options, ow_1$4.default.object.exactShape({
				build: ow_1$4.default.optional.string,
				memory: ow_1$4.default.optional.number,
				timeout: ow_1$4.default.optional.number.not.negative,
				waitSecs: ow_1$4.default.optional.number.not.negative,
				webhooks: ow_1$4.default.optional.array.ofType(ow_1$4.default.object),
				maxItems: ow_1$4.default.optional.number.not.negative,
				maxTotalChargeUsd: ow_1$4.default.optional.number.not.negative,
				restartOnError: ow_1$4.default.optional.boolean
			}));
			const { waitSecs, ...startOptions } = options;
			const { id } = await this.start(input, startOptions);
			return this.apifyClient.run(id).waitForFinish({ waitSecs });
		}
		/**
		* Retrieves the Actor task's input object.
		*
		* @returns The Task's input, or `undefined` if it does not exist.
		* @see https://docs.apify.com/api/v2/actor-task-input-get
		*/
		async getInput() {
			const requestOpts = {
				url: this._url("input"),
				method: "GET",
				params: this._params()
			};
			try {
				const response = await this.httpClient.call(requestOpts);
				return (0, utils_1.cast)(response.data);
			} catch (err) {
				(0, utils_1.catchNotFoundOrThrow)(err);
			}
		}
		/**
		* Updates the Actor task's input object.
		*
		* @param newFields - New input data for the task.
		* @returns The updated task input.
		* @see https://docs.apify.com/api/v2/actor-task-input-put
		*/
		async updateInput(newFields) {
			const response = await this.httpClient.call({
				url: this._url("input"),
				method: "PUT",
				params: this._params(),
				data: newFields
			});
			return (0, utils_1.cast)(response.data);
		}
		/**
		* Returns a client for the last run of this task.
		*
		* @param options - Filter options for the last run.
		* @param options.status - Filter by run status (e.g., `'SUCCEEDED'`, `'FAILED'`, `'RUNNING'`).
		* @param options.origin - Filter by run origin (e.g., `'WEB'`, `'API'`, `'SCHEDULE'`).
		* @returns A client for the last run.
		* @see https://docs.apify.com/api/v2/actor-task-runs-last-get
		*/
		lastRun(options = {}) {
			(0, ow_1$4.default)(options, ow_1$4.default.object.exactShape({
				status: ow_1$4.default.optional.string.oneOf(Object.values(consts_1.ACT_JOB_STATUSES)),
				origin: ow_1$4.default.optional.string.oneOf(Object.values(consts_1.META_ORIGINS))
			}));
			return new run_1.RunClient(this._subResourceOptions({
				id: "last",
				params: this._params(options),
				resourcePath: "runs"
			}));
		}
		/**
		* Returns a client for the Runs of this Task.
		*
		* @returns A client for the task's runs.
		* @see https://docs.apify.com/api/v2/actor-task-runs-get
		*/
		runs() {
			return new run_collection_1.RunCollectionClient(this._subResourceOptions({ resourcePath: "runs" }));
		}
		/**
		* Returns a client for the Webhooks of this Task.
		*
		* @returns A client for the task's webhooks.
		* @see https://docs.apify.com/api/v2/actor-task-webhooks-get
		*/
		webhooks() {
			return new webhook_collection_1.WebhookCollectionClient(this._subResourceOptions());
		}
	};
	exports.TaskClient = TaskClient;
}));
//#endregion
//#region node_modules/apify-client/dist/resource_clients/task_collection.js
var require_task_collection = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.TaskCollectionClient = void 0;
	const ow_1$3 = __require("tslib").__importDefault(require_dist$1());
	const resource_collection_client_1 = require_resource_collection_client();
	/**
	* Client for managing the collection of Actor tasks in your account.
	*
	* Tasks are pre-configured Actor runs with saved input and options. This client provides
	* methods to list and create tasks.
	*
	* @example
	* ```javascript
	* const client = new ApifyClient({ token: 'my-token' });
	* const tasksClient = client.tasks();
	*
	* // List all tasks
	* const { items } = await tasksClient.list();
	*
	* // Create a new task
	* const newTask = await tasksClient.create({
	*   actId: 'my-actor-id',
	*   name: 'my-task',
	*   input: { url: 'https://example.com' }
	* });
	* ```
	*
	* @see https://docs.apify.com/platform/actors/running/tasks
	*/
	var TaskCollectionClient = class extends resource_collection_client_1.ResourceCollectionClient {
		/**
		* @hidden
		*/
		constructor(options) {
			super({
				resourcePath: "actor-tasks",
				...options
			});
		}
		/**
		* Lists all Tasks.
		*
		* Awaiting the return value (as you would with a Promise) will result in a single API call. The amount of fetched
		* items in a single API call is limited.
		* ```javascript
		* const paginatedList = await client.list(options);
		* ```
		*
		* Asynchronous iteration is also supported. This will fetch additional pages if needed until all items are
		* retrieved.
		*
		* ```javascript
		* for await (const singleItem of client.list(options)) {...}
		* ```
		*
		* @param options - Pagination and sorting options.
		* @returns A paginated iterator of tasks.
		* @see https://docs.apify.com/api/v2/actor-tasks-get
		*/
		list(options = {}) {
			(0, ow_1$3.default)(options, ow_1$3.default.object.exactShape({
				limit: ow_1$3.default.optional.number.not.negative,
				offset: ow_1$3.default.optional.number.not.negative,
				desc: ow_1$3.default.optional.boolean
			}));
			return this._listPaginated(options);
		}
		/**
		* Creates a new task.
		*
		* @param task - The task data.
		* @returns The created task object.
		* @see https://docs.apify.com/api/v2/actor-tasks-post
		*/
		async create(task) {
			(0, ow_1$3.default)(task, ow_1$3.default.object);
			return this._create(task);
		}
	};
	exports.TaskCollectionClient = TaskCollectionClient;
}));
//#endregion
//#region node_modules/apify-client/dist/resource_clients/user.js
var require_user = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.PlatformFeature = exports.UserClient = void 0;
	const resource_client_1 = require_resource_client();
	const utils_1 = require_utils();
	/**
	* Client for managing user account information.
	*
	* Provides methods to retrieve user details, monthly usage statistics, and account limits.
	* When using an API token, you can access your own user information or public information
	* about other users.
	*
	* @example
	* ```javascript
	* const client = new ApifyClient({ token: 'my-token' });
	* const userClient = client.user('my-user-id');
	*
	* // Get user information
	* const user = await userClient.get();
	*
	* // Get monthly usage
	* const usage = await userClient.monthlyUsage();
	*
	* // Get account limits
	* const limits = await userClient.limits();
	* ```
	*
	* @see https://docs.apify.com/platform/actors/running
	*/
	var UserClient = class extends resource_client_1.ResourceClient {
		/**
		* @hidden
		*/
		constructor(options) {
			super({
				resourcePath: "users",
				...options
			});
		}
		/**
		* Retrieves the user data.
		*
		* Depending on whether ApifyClient was created with a token,
		* the method will either return public or private user data.
		*
		* @returns The user object.
		* @see https://docs.apify.com/api/v2/user-get
		*/
		async get() {
			return this._get();
		}
		/**
		* Retrieves the user's monthly usage data.
		*
		* @returns The monthly usage object, or `undefined` if it does not exist.
		* @see https://docs.apify.com/api/v2/users-me-usage-monthly-get
		*/
		async monthlyUsage() {
			const requestOpts = {
				url: this._url("usage/monthly"),
				method: "GET",
				params: this._params()
			};
			try {
				const response = await this.httpClient.call(requestOpts);
				return (0, utils_1.cast)((0, utils_1.parseDateFields)((0, utils_1.pluckData)(response.data), (key) => key === "date"));
			} catch (err) {
				(0, utils_1.catchNotFoundOrThrow)(err);
			}
		}
		/**
		* Retrieves the user's account and usage limits.
		*
		* @returns The account and usage limits object, or `undefined` if it does not exist.
		* @see https://docs.apify.com/api/v2/users-me-limits-get
		*/
		async limits() {
			const requestOpts = {
				url: this._url("limits"),
				method: "GET",
				params: this._params()
			};
			try {
				const response = await this.httpClient.call(requestOpts);
				return (0, utils_1.cast)((0, utils_1.parseDateFields)((0, utils_1.pluckData)(response.data)));
			} catch (err) {
				(0, utils_1.catchNotFoundOrThrow)(err);
			}
		}
		/**
		* Updates the user's account and usage limits.
		*
		* @param options - The new limits to set.
		* @see https://docs.apify.com/api/v2/users-me-limits-put
		*/
		async updateLimits(options) {
			const requestOpts = {
				url: this._url("limits"),
				method: "PUT",
				params: this._params(),
				data: options
			};
			await this.httpClient.call(requestOpts);
		}
	};
	exports.UserClient = UserClient;
	var PlatformFeature;
	(function(PlatformFeature) {
		PlatformFeature["Actors"] = "ACTORS";
		PlatformFeature["Storage"] = "STORAGE";
		PlatformFeature["ProxySERPS"] = "PROXY_SERPS";
		PlatformFeature["Scheduler"] = "SCHEDULER";
		PlatformFeature["Webhooks"] = "WEBHOOKS";
		PlatformFeature["Proxy"] = "PROXY";
		PlatformFeature["ProxyExternalAccess"] = "PROXY_EXTERNAL_ACCESS";
	})(PlatformFeature || (exports.PlatformFeature = PlatformFeature = {}));
}));
//#endregion
//#region node_modules/apify-client/dist/resource_clients/webhook_dispatch_collection.js
var require_webhook_dispatch_collection = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.WebhookDispatchCollectionClient = void 0;
	const ow_1$2 = __require("tslib").__importDefault(require_dist$1());
	const resource_collection_client_1 = require_resource_collection_client();
	/**
	* Client for managing the collection of webhook dispatches.
	*
	* Webhook dispatches represent individual notifications sent by a webhook. This client provides
	* methods to list all dispatches for a specific webhook.
	*
	* @example
	* ```javascript
	* const client = new ApifyClient({ token: 'my-token' });
	* const webhookClient = client.webhook('my-webhook-id');
	*
	* // List all dispatches for this webhook
	* const dispatchesClient = webhookClient.dispatches();
	* const { items } = await dispatchesClient.list();
	* ```
	*
	* @see https://docs.apify.com/platform/integrations/webhooks
	*/
	var WebhookDispatchCollectionClient = class extends resource_collection_client_1.ResourceCollectionClient {
		/**
		* @hidden
		*/
		constructor(options) {
			super({
				resourcePath: "webhook-dispatches",
				...options
			});
		}
		/**
		* Lists all webhook dispatches.
		*
		* Awaiting the return value (as you would with a Promise) will result in a single API call. The amount of fetched
		* items in a single API call is limited.
		* ```javascript
		* const paginatedList = await client.list(options);
		* ```
		*
		* Asynchronous iteration is also supported. This will fetch additional pages if needed until all items are
		* retrieved.
		*
		* ```javascript
		* for await (const singleItem of client.list(options)) {...}
		* ```
		*
		* @param options - Pagination and sorting options.
		* @returns A paginated iterator of webhook dispatches.
		* @see https://docs.apify.com/api/v2/webhook-dispatches-get
		*/
		list(options = {}) {
			(0, ow_1$2.default)(options, ow_1$2.default.object.exactShape({
				limit: ow_1$2.default.optional.number.not.negative,
				offset: ow_1$2.default.optional.number.not.negative,
				desc: ow_1$2.default.optional.boolean
			}));
			return this._listPaginated(options);
		}
	};
	exports.WebhookDispatchCollectionClient = WebhookDispatchCollectionClient;
}));
//#endregion
//#region node_modules/apify-client/dist/resource_clients/webhook.js
var require_webhook = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.WebhookClient = void 0;
	const ow_1$1 = __require("tslib").__importDefault(require_dist$1());
	const resource_client_1 = require_resource_client();
	const utils_1 = require_utils();
	const webhook_dispatch_collection_1 = require_webhook_dispatch_collection();
	/**
	* Client for managing a specific webhook.
	*
	* Webhooks allow you to receive notifications when specific events occur in your Actors or tasks.
	* This client provides methods to get, update, delete, and test webhooks, as well as retrieve
	* webhook dispatches.
	*
	* @example
	* ```javascript
	* const client = new ApifyClient({ token: 'my-token' });
	* const webhookClient = client.webhook('my-webhook-id');
	*
	* // Get webhook details
	* const webhook = await webhookClient.get();
	*
	* // Update webhook
	* await webhookClient.update({
	*   isEnabled: true,
	*   eventTypes: ['ACTOR.RUN.SUCCEEDED'],
	*   requestUrl: 'https://example.com/webhook'
	* });
	*
	* // Test webhook
	* await webhookClient.test();
	* ```
	*
	* @see https://docs.apify.com/platform/integrations/webhooks
	*/
	var WebhookClient = class extends resource_client_1.ResourceClient {
		/**
		* @hidden
		*/
		constructor(options) {
			super({
				resourcePath: "webhooks",
				...options
			});
		}
		/**
		* Retrieves the webhook.
		*
		* @returns The webhook object, or `undefined` if it does not exist.
		* @see https://docs.apify.com/api/v2/webhook-get
		*/
		async get() {
			return this._get();
		}
		/**
		* Updates the webhook with the specified fields.
		*
		* @param newFields - Fields to update.
		* @returns The updated webhook object.
		* @see https://docs.apify.com/api/v2/webhook-put
		*/
		async update(newFields) {
			(0, ow_1$1.default)(newFields, ow_1$1.default.object);
			return this._update(newFields);
		}
		/**
		* Deletes the webhook.
		*
		* @see https://docs.apify.com/api/v2/webhook-delete
		*/
		async delete() {
			return this._delete();
		}
		/**
		* Tests the webhook by dispatching a test event.
		*
		* @returns The webhook dispatch object, or `undefined` if the test fails.
		* @see https://docs.apify.com/api/v2/webhook-test-post
		*/
		async test() {
			const request = {
				url: this._url("test"),
				method: "POST",
				params: this._params()
			};
			try {
				const response = await this.httpClient.call(request);
				return (0, utils_1.cast)((0, utils_1.parseDateFields)((0, utils_1.pluckData)(response.data)));
			} catch (err) {
				(0, utils_1.catchNotFoundOrThrow)(err);
			}
		}
		/**
		* Returns a client for the dispatches of this webhook.
		*
		* @returns A client for the webhook's dispatches.
		* @see https://docs.apify.com/api/v2/webhook-webhook-dispatches-get
		*/
		dispatches() {
			return new webhook_dispatch_collection_1.WebhookDispatchCollectionClient(this._subResourceOptions({ resourcePath: "dispatches" }));
		}
	};
	exports.WebhookClient = WebhookClient;
}));
//#endregion
//#region node_modules/apify-client/dist/resource_clients/webhook_dispatch.js
var require_webhook_dispatch = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.WebhookDispatchStatus = exports.WebhookDispatchClient = void 0;
	const resource_client_1 = require_resource_client();
	/**
	* Client for managing a specific webhook dispatch.
	*
	* Webhook dispatches represent individual notifications sent by webhooks. This client provides
	* methods to retrieve details about a specific dispatch.
	*
	* @example
	* ```javascript
	* const client = new ApifyClient({ token: 'my-token' });
	* const webhookClient = client.webhook('my-webhook-id');
	*
	* // Get a specific dispatch
	* const dispatchClient = webhookClient.dispatches().get('dispatch-id');
	* const dispatch = await dispatchClient.get();
	* ```
	*
	* @see https://docs.apify.com/platform/integrations/webhooks
	*/
	var WebhookDispatchClient = class extends resource_client_1.ResourceClient {
		/**
		* @hidden
		*/
		constructor(options) {
			super({
				resourcePath: "webhook-dispatches",
				...options
			});
		}
		/**
		* Retrieves the webhook dispatch.
		*
		* @returns The webhook dispatch object, or `undefined` if it does not exist.
		* @see https://docs.apify.com/api/v2/webhook-dispatch-get
		*/
		async get() {
			return this._get();
		}
	};
	exports.WebhookDispatchClient = WebhookDispatchClient;
	var WebhookDispatchStatus;
	(function(WebhookDispatchStatus) {
		WebhookDispatchStatus["Active"] = "ACTIVE";
		WebhookDispatchStatus["Succeeded"] = "SUCCEEDED";
		WebhookDispatchStatus["Failed"] = "FAILED";
	})(WebhookDispatchStatus || (exports.WebhookDispatchStatus = WebhookDispatchStatus = {}));
}));
//#endregion
//#region node_modules/apify-client/dist/statistics.js
var require_statistics = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.Statistics = void 0;
	const ow_1 = __require("tslib").__importDefault(require_dist$1());
	var Statistics = class {
		constructor() {
			/**
			* Number of Apify client function calls
			*/
			Object.defineProperty(this, "calls", {
				enumerable: true,
				configurable: true,
				writable: true,
				value: 0
			});
			/**
			* Number of Apify API requests
			*/
			Object.defineProperty(this, "requests", {
				enumerable: true,
				configurable: true,
				writable: true,
				value: 0
			});
			/**
			* Number of times the API returned 429 error. Errors on first attempt are
			* counted at index 0. First retry error counts are on index 1 and so on.
			*/
			Object.defineProperty(this, "rateLimitErrors", {
				enumerable: true,
				configurable: true,
				writable: true,
				value: []
			});
		}
		addRateLimitError(attempt) {
			(0, ow_1.default)(attempt, ow_1.default.number.greaterThan(0));
			const index = attempt - 1;
			this._fillBlanksWithZeroes(index);
			this.rateLimitErrors[index]++;
		}
		/**
		* Removes the necessity to pre-initialize array with correct
		* number of zeroes by dynamically filling the empty indexes
		* when necessary.
		*/
		_fillBlanksWithZeroes(inclusiveIndex) {
			if (this.rateLimitErrors.length <= inclusiveIndex) {
				for (let k = 0; k <= inclusiveIndex; k++) if (typeof this.rateLimitErrors[k] !== "number") this.rateLimitErrors[k] = 0;
			}
		}
	};
	exports.Statistics = Statistics;
}));
//#endregion
//#region node_modules/apify-client/dist/apify_client.js
var require_apify_client = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.ApifyClient = void 0;
	const tslib_1$1 = __require("tslib");
	const ow_1 = tslib_1$1.__importDefault(require_dist$1());
	const consts_1 = require_cjs();
	const log_1 = tslib_1$1.__importDefault(require_cjs$1());
	const http_client_1 = require_http_client();
	const actor_1 = require_actor();
	const actor_collection_1 = require_actor_collection();
	const build_1 = require_build();
	const build_collection_1 = require_build_collection();
	const dataset_1 = require_dataset();
	const dataset_collection_1 = require_dataset_collection();
	const key_value_store_1 = require_key_value_store();
	const key_value_store_collection_1 = require_key_value_store_collection();
	const log_2 = require_log();
	const request_queue_1 = require_request_queue();
	const request_queue_collection_1 = require_request_queue_collection();
	const run_1 = require_run();
	const run_collection_1 = require_run_collection();
	const schedule_1 = require_schedule();
	const schedule_collection_1 = require_schedule_collection();
	const store_collection_1 = require_store_collection();
	const task_1 = require_task();
	const task_collection_1 = require_task_collection();
	const user_1 = require_user();
	const webhook_1 = require_webhook();
	const webhook_collection_1 = require_webhook_collection();
	const webhook_dispatch_1 = require_webhook_dispatch();
	const webhook_dispatch_collection_1 = require_webhook_dispatch_collection();
	const statistics_1 = require_statistics();
	const DEFAULT_TIMEOUT_SECS = 360;
	/**
	* The official JavaScript client for the Apify API.
	*
	* Provides programmatic access to all Apify platform resources including Actors, runs, datasets,
	* key-value stores, request queues, and more. Works in both Node.js and browser environments.
	*
	* @example
	* ```javascript
	* import { ApifyClient } from 'apify-client';
	*
	* const client = new ApifyClient({ token: 'my-token' });
	*
	* // Start an Actor and wait for it to finish
	* const run = await client.actor('my-actor-id').call();
	*
	* // Fetch dataset items
	* const { items } = await client.dataset(run.defaultDatasetId).listItems();
	* ```
	*
	* @see https://docs.apify.com/api/v2
	*/
	var ApifyClient = class {
		constructor(options = {}) {
			Object.defineProperty(this, "baseUrl", {
				enumerable: true,
				configurable: true,
				writable: true,
				value: void 0
			});
			Object.defineProperty(this, "publicBaseUrl", {
				enumerable: true,
				configurable: true,
				writable: true,
				value: void 0
			});
			Object.defineProperty(this, "token", {
				enumerable: true,
				configurable: true,
				writable: true,
				value: void 0
			});
			Object.defineProperty(this, "stats", {
				enumerable: true,
				configurable: true,
				writable: true,
				value: void 0
			});
			Object.defineProperty(this, "logger", {
				enumerable: true,
				configurable: true,
				writable: true,
				value: void 0
			});
			Object.defineProperty(this, "httpClient", {
				enumerable: true,
				configurable: true,
				writable: true,
				value: void 0
			});
			(0, ow_1.default)(options, ow_1.default.object.exactShape({
				baseUrl: ow_1.default.optional.string,
				publicBaseUrl: ow_1.default.optional.string,
				maxRetries: ow_1.default.optional.number,
				minDelayBetweenRetriesMillis: ow_1.default.optional.number,
				requestInterceptors: ow_1.default.optional.array,
				timeoutSecs: ow_1.default.optional.number,
				token: ow_1.default.optional.string,
				userAgentSuffix: ow_1.default.optional.any(ow_1.default.string, ow_1.default.array.ofType(ow_1.default.string))
			}));
			const { baseUrl = "https://api.apify.com", publicBaseUrl = "https://api.apify.com", maxRetries = 8, minDelayBetweenRetriesMillis = 500, requestInterceptors = [], timeoutSecs = DEFAULT_TIMEOUT_SECS, token } = options;
			const tempBaseUrl = baseUrl.endsWith("/") ? baseUrl.slice(0, baseUrl.length - 1) : baseUrl;
			this.baseUrl = `${tempBaseUrl}/v2`;
			const tempPublicBaseUrl = publicBaseUrl.endsWith("/") ? publicBaseUrl.slice(0, publicBaseUrl.length - 1) : publicBaseUrl;
			this.publicBaseUrl = `${tempPublicBaseUrl}/v2`;
			this.token = token;
			this.stats = new statistics_1.Statistics();
			this.logger = log_1.default.child({ prefix: "ApifyClient" });
			this.httpClient = new http_client_1.HttpClient({
				apifyClientStats: this.stats,
				maxRetries,
				minDelayBetweenRetriesMillis,
				requestInterceptors,
				timeoutSecs,
				logger: this.logger,
				token: this.token,
				userAgentSuffix: options.userAgentSuffix
			});
		}
		_options() {
			return {
				baseUrl: this.baseUrl,
				publicBaseUrl: this.publicBaseUrl,
				apifyClient: this,
				httpClient: this.httpClient
			};
		}
		/**
		* Returns a client for managing Actors in your account.
		*
		* Provides access to the Actor collection, allowing you to list, create, and search for Actors.
		*
		* @returns A client for the Actors collection
		* @see https://docs.apify.com/api/v2/acts-get
		*/
		actors() {
			return new actor_collection_1.ActorCollectionClient(this._options());
		}
		/**
		* Returns a client for a specific Actor.
		*
		* Use this to get, update, delete, start, or call an Actor, as well as manage its builds,
		* runs, versions, and webhooks.
		*
		* @param id - Actor ID or username/name
		* @returns A client for the specific Actor
		* @see https://docs.apify.com/api/v2/act-get
		*
		* @example
		* ```javascript
		* // Call an Actor and wait for it to finish
		* const run = await client.actor('apify/web-scraper').call({ url: 'https://example.com' });
		* ```
		*/
		actor(id) {
			(0, ow_1.default)(id, ow_1.default.string.nonEmpty);
			return new actor_1.ActorClient({
				id,
				...this._options()
			});
		}
		/**
		* Returns a client for managing Actor builds in your account.
		*
		* Lists all builds across all of your Actors.
		*
		* @returns A client for Actor builds collection
		* @see https://docs.apify.com/api/v2/actor-builds-get
		*/
		builds() {
			return new build_collection_1.BuildCollectionClient(this._options());
		}
		/**
		* Returns a client for a specific Actor build.
		*
		* Use this to get details about a build, wait for it to finish, or access its logs.
		*
		* @param id - Build ID
		* @returns A client for the specified build
		* @see https://docs.apify.com/api/v2/actor-build-get
		*/
		build(id) {
			(0, ow_1.default)(id, ow_1.default.string.nonEmpty);
			return new build_1.BuildClient({
				id,
				...this._options()
			});
		}
		/**
		* Returns a client for managing datasets in your account.
		*
		* Datasets store structured data results from Actor runs. Use this to list or create datasets.
		*
		* @returns A client for the Datasets collection
		* @see https://docs.apify.com/api/v2/datasets-get
		*/
		datasets() {
			return new dataset_collection_1.DatasetCollectionClient(this._options());
		}
		/**
		* Returns a client for a specific dataset.
		*
		* Use this to read, write, and manage items in the dataset. Datasets contain structured
		* data stored as individual items (records).
		*
		* @template Data - Type of items stored in the dataset
		* @param id - Dataset ID or name
		* @returns A client for the specific Dataset
		* @see https://docs.apify.com/api/v2/dataset-get
		*
		* @example
		* ```javascript
		* // Push items to a dataset
		* await client.dataset('my-dataset').pushItems([
		*   { url: 'https://example.com', title: 'Example' },
		*   { url: 'https://test.com', title: 'Test' }
		* ]);
		*
		* // Retrieve items
		* const { items } = await client.dataset('my-dataset').listItems();
		* ```
		*/
		dataset(id) {
			(0, ow_1.default)(id, ow_1.default.string.nonEmpty);
			return new dataset_1.DatasetClient({
				id,
				...this._options()
			});
		}
		/**
		* Returns a client for managing key-value stores in your account.
		*
		* Key-value stores are used to store arbitrary data records or files.
		*
		* @returns A client for the Key-value stores collection
		* @see https://docs.apify.com/api/v2/key-value-stores-get
		*/
		keyValueStores() {
			return new key_value_store_collection_1.KeyValueStoreCollectionClient(this._options());
		}
		/**
		* Returns a client for a specific key-value store.
		*
		* Use this to read, write, and delete records in the store. Key-value stores can hold
		* any type of data including text, JSON, images, and other files.
		*
		* @param id - Key-value store ID or name
		* @returns A client for the specific key-value store
		* @see https://docs.apify.com/api/v2/key-value-store-get
		*
		* @example
		* ```javascript
		* // Save a record
		* await client.keyValueStore('my-store').setRecord({ key: 'OUTPUT', value: { foo: 'bar' } });
		*
		* // Get a record
		* const record = await client.keyValueStore('my-store').getRecord('OUTPUT');
		* ```
		*/
		keyValueStore(id) {
			(0, ow_1.default)(id, ow_1.default.string.nonEmpty);
			return new key_value_store_1.KeyValueStoreClient({
				id,
				...this._options()
			});
		}
		/**
		* Returns a client for accessing logs of an Actor build or run.
		*
		* @param buildOrRunId - Build ID or run ID
		* @returns A client for accessing logs
		* @see https://docs.apify.com/api/v2/log-get
		*/
		log(buildOrRunId) {
			(0, ow_1.default)(buildOrRunId, ow_1.default.string.nonEmpty);
			return new log_2.LogClient({
				id: buildOrRunId,
				...this._options()
			});
		}
		/**
		* Returns a client for managing request queues in your account.
		*
		* Request queues store URLs to be crawled, along with their metadata.
		*
		* @returns A client for the Request queues collection
		* @see https://docs.apify.com/api/v2/request-queues-get
		*/
		requestQueues() {
			return new request_queue_collection_1.RequestQueueCollectionClient(this._options());
		}
		/**
		* Returns a client for a specific request queue.
		*
		* Use this to add, retrieve, and manage requests in the queue. Request queues are used
		* by web crawlers to manage URLs that need to be visited.
		*
		* @param id - Request queue ID or name
		* @param options - Configuration options for the request queue client
		* @returns A client for the specific Request queue
		* @see https://docs.apify.com/api/v2/request-queue-get
		*
		* @example
		* ```javascript
		* // Add requests to a queue
		* const queue = client.requestQueue('my-queue');
		* await queue.addRequest({ url: 'https://example.com', uniqueKey: 'example' });
		*
		* // Get and lock the next request
		* const { items } = await queue.listAndLockHead({ lockSecs: 60 });
		* ```
		*/
		requestQueue(id, options = {}) {
			(0, ow_1.default)(id, ow_1.default.string.nonEmpty);
			(0, ow_1.default)(options, ow_1.default.object.exactShape({
				clientKey: ow_1.default.optional.string.nonEmpty,
				timeoutSecs: ow_1.default.optional.number
			}));
			const apiClientOptions = {
				id,
				...this._options()
			};
			return new request_queue_1.RequestQueueClient(apiClientOptions, options);
		}
		/**
		* Returns a client for managing Actor runs in your account.
		*
		* Lists all runs across all of your Actors.
		*
		* @returns A client for the run collection
		* @see https://docs.apify.com/api/v2/actor-runs-get
		*/
		runs() {
			return new run_collection_1.RunCollectionClient({
				...this._options(),
				resourcePath: "actor-runs"
			});
		}
		/**
		* Returns a client for a specific Actor run.
		*
		* Use this to get details about a run, wait for it to finish, abort it, or access its
		* dataset, key-value store, and request queue.
		*
		* @param id - Run ID
		* @returns A client for the specified run
		* @see https://docs.apify.com/api/v2/actor-run-get
		*
		* @example
		* ```javascript
		* // Wait for a run to finish
		* const run = await client.run('run-id').waitForFinish();
		*
		* // Access run's dataset
		* const { items } = await client.run('run-id').dataset().listItems();
		* ```
		*/
		run(id) {
			(0, ow_1.default)(id, ow_1.default.string.nonEmpty);
			return new run_1.RunClient({
				id,
				...this._options()
			});
		}
		/**
		* Returns a client for managing Actor tasks in your account.
		*
		* Tasks are pre-configured Actor runs with stored input that can be executed repeatedly.
		*
		* @returns A client for the task collection
		* @see https://docs.apify.com/api/v2/actor-tasks-get
		*/
		tasks() {
			return new task_collection_1.TaskCollectionClient(this._options());
		}
		/**
		* Returns a client for a specific Actor task.
		*
		* Use this to get, update, delete, or run a task with pre-configured input.
		*
		* @param id - Task ID or username/task-name
		* @returns A client for the specified task
		* @see https://docs.apify.com/api/v2/actor-task-get
		*
		* @example
		* ```javascript
		* // Run a task and wait for it to finish
		* const run = await client.task('my-task').call();
		* ```
		*/
		task(id) {
			(0, ow_1.default)(id, ow_1.default.string.nonEmpty);
			return new task_1.TaskClient({
				id,
				...this._options()
			});
		}
		/**
		* Returns a client for managing schedules in your account.
		*
		* Schedules automatically start Actor or task runs at specified times.
		*
		* @returns A client for the Schedules collection
		* @see https://docs.apify.com/api/v2/schedules-get
		*/
		schedules() {
			return new schedule_collection_1.ScheduleCollectionClient(this._options());
		}
		/**
		* Returns a client for a specific schedule.
		*
		* Use this to get, update, or delete a schedule.
		*
		* @param id - Schedule ID
		* @returns A client for the specific Schedule
		* @see https://docs.apify.com/api/v2/schedule-get
		*/
		schedule(id) {
			(0, ow_1.default)(id, ow_1.default.string.nonEmpty);
			return new schedule_1.ScheduleClient({
				id,
				...this._options()
			});
		}
		/**
		* Returns a client for accessing user data.
		*
		* By default, returns information about the current user (determined by the API token).
		*
		* @param id - User ID or username. Defaults to 'me' (current user)
		* @returns A client for the user
		* @see https://docs.apify.com/api/v2/user-get
		*/
		user(id = consts_1.ME_USER_NAME_PLACEHOLDER) {
			(0, ow_1.default)(id, ow_1.default.string.nonEmpty);
			return new user_1.UserClient({
				id,
				...this._options()
			});
		}
		/**
		* Returns a client for managing webhooks in your account.
		*
		* Webhooks notify external services when specific events occur (e.g., Actor run finishes).
		*
		* @returns A client for the Webhooks collection
		* @see https://docs.apify.com/api/v2/webhooks-get
		*/
		webhooks() {
			return new webhook_collection_1.WebhookCollectionClient(this._options());
		}
		/**
		* Returns a client for a specific webhook.
		*
		* Use this to get, update, delete, or test a webhook.
		*
		* @param id - Webhook ID
		* @returns A client for the specific webhook
		* @see https://docs.apify.com/api/v2/webhook-get
		*/
		webhook(id) {
			(0, ow_1.default)(id, ow_1.default.string.nonEmpty);
			return new webhook_1.WebhookClient({
				id,
				...this._options()
			});
		}
		/**
		* Returns a client for viewing webhook dispatches in your account.
		*
		* Webhook dispatches represent individual invocations of webhooks.
		*
		* @returns A client for the webhook dispatches collection
		* @see https://docs.apify.com/api/v2/webhook-dispatches-get
		*/
		webhookDispatches() {
			return new webhook_dispatch_collection_1.WebhookDispatchCollectionClient(this._options());
		}
		/**
		* Returns a client for a specific webhook dispatch.
		*
		* @param id - Webhook dispatch ID
		* @returns A client for the specific webhook dispatch
		* @see https://docs.apify.com/api/v2/webhook-dispatch-get
		*/
		webhookDispatch(id) {
			(0, ow_1.default)(id, ow_1.default.string.nonEmpty);
			return new webhook_dispatch_1.WebhookDispatchClient({
				id,
				...this._options()
			});
		}
		/**
		* Returns a client for browsing Actors in Apify Store.
		*
		* Use this to search and retrieve information about public Actors.
		*
		* @returns A client for the Apify Store
		* @see https://docs.apify.com/api/v2/store-get
		*/
		store() {
			return new store_collection_1.StoreCollectionClient(this._options());
		}
		/**
		* Sets a status message for the current Actor run.
		*
		* This is a convenience method that updates the status message of the run specified by
		* the `ACTOR_RUN_ID` environment variable. Only works when called from within an Actor run.
		*
		* @param message - The status message to set
		* @param options - Additional options for the status message
		* @throws {Error} If `ACTOR_RUN_ID` environment variable is not set
		*/
		async setStatusMessage(message, options) {
			const runId = process.env[consts_1.ACTOR_ENV_VARS.RUN_ID];
			if (!runId) throw new Error(`Environment variable ${consts_1.ACTOR_ENV_VARS.RUN_ID} is not set!`);
			await this.run(runId).update({
				statusMessage: message,
				...options
			});
		}
	};
	exports.ApifyClient = ApifyClient;
}));
//#endregion
//#region node_modules/apify-client/dist/index.mjs
var import_dist = /* @__PURE__ */ __toESM((/* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.InvalidResponseBodyError = void 0;
	const tslib_1 = __require("tslib");
	tslib_1.__exportStar(require_apify_client(), exports);
	tslib_1.__exportStar(require_actor(), exports);
	tslib_1.__exportStar(require_actor_collection(), exports);
	tslib_1.__exportStar(require_actor_env_var(), exports);
	tslib_1.__exportStar(require_actor_env_var_collection(), exports);
	tslib_1.__exportStar(require_actor_version(), exports);
	tslib_1.__exportStar(require_actor_version_collection(), exports);
	tslib_1.__exportStar(require_build(), exports);
	tslib_1.__exportStar(require_build_collection(), exports);
	tslib_1.__exportStar(require_dataset(), exports);
	tslib_1.__exportStar(require_dataset_collection(), exports);
	tslib_1.__exportStar(require_key_value_store(), exports);
	tslib_1.__exportStar(require_key_value_store_collection(), exports);
	tslib_1.__exportStar(require_log(), exports);
	tslib_1.__exportStar(require_request_queue(), exports);
	tslib_1.__exportStar(require_request_queue_collection(), exports);
	tslib_1.__exportStar(require_run(), exports);
	tslib_1.__exportStar(require_run_collection(), exports);
	tslib_1.__exportStar(require_schedule(), exports);
	tslib_1.__exportStar(require_schedule_collection(), exports);
	tslib_1.__exportStar(require_store_collection(), exports);
	tslib_1.__exportStar(require_task(), exports);
	tslib_1.__exportStar(require_task_collection(), exports);
	tslib_1.__exportStar(require_user(), exports);
	tslib_1.__exportStar(require_webhook(), exports);
	tslib_1.__exportStar(require_webhook_collection(), exports);
	tslib_1.__exportStar(require_webhook_dispatch(), exports);
	tslib_1.__exportStar(require_webhook_dispatch_collection(), exports);
	tslib_1.__exportStar(require_apify_api_error(), exports);
	var interceptors_1 = require_interceptors();
	Object.defineProperty(exports, "InvalidResponseBodyError", {
		enumerable: true,
		get: function() {
			return interceptors_1.InvalidResponseBodyError;
		}
	});
})))(), 1);
import_dist.default.ActorClient;
import_dist.default.ActorCollectionClient;
import_dist.default.ActorEnvVarClient;
import_dist.default.ActorEnvVarCollectionClient;
import_dist.default.ActorListSortBy;
import_dist.default.ActorSourceType;
import_dist.default.ActorVersionClient;
import_dist.default.ActorVersionCollectionClient;
import_dist.default.ApifyApiError;
const ApifyClient = import_dist.default.ApifyClient;
import_dist.default.BuildClient;
import_dist.default.BuildCollectionClient;
import_dist.default.DatasetClient;
import_dist.default.DatasetCollectionClient;
import_dist.default.DownloadItemsFormat;
import_dist.InvalidResponseBodyError;
import_dist.default.KeyValueStoreClient;
import_dist.default.KeyValueStoreCollectionClient;
import_dist.default.LogClient;
import_dist.default.LoggerActorRedirect;
import_dist.default.PlatformFeature;
import_dist.default.RequestQueueClient;
import_dist.default.RequestQueueCollectionClient;
import_dist.default.RunClient;
import_dist.default.RunCollectionClient;
import_dist.default.ScheduleActions;
import_dist.default.ScheduleClient;
import_dist.default.ScheduleCollectionClient;
import_dist.default.StoreCollectionClient;
import_dist.default.StreamedLog;
import_dist.default.TaskClient;
import_dist.default.TaskCollectionClient;
import_dist.default.UserClient;
import_dist.default.WebhookClient;
import_dist.default.WebhookCollectionClient;
import_dist.default.WebhookDispatchClient;
import_dist.default.WebhookDispatchCollectionClient;
import_dist.default.WebhookDispatchStatus;
//#endregion
export { require_src as n, ApifyClient as t };
