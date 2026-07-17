import { fileURLToPath as __eveFileURLToPath } from "node:url";
import { dirname as __eveDirname } from "node:path";
__eveDirname(__eveFileURLToPath(import.meta.url));
import { t as __commonJSMin } from "../_runtime.mjs";
//#region node_modules/netmask/dist/netmask4.js
var require_netmask4 = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.Netmask4Impl = void 0;
	exports.ip2long = ip2long;
	exports.long2ip = long2ip;
	function long2ip(long) {
		return [
			(long & 255 << 24) >>> 24,
			(long & 255 << 16) >>> 16,
			(long & 65280) >>> 8,
			long & 255
		].join(".");
	}
	const chr0 = "0".charCodeAt(0);
	const chra = "a".charCodeAt(0);
	const chrA = "A".charCodeAt(0);
	function parseNum(s) {
		let n = 0;
		let base = 10;
		let dmax = "9";
		let i = 0;
		if (s.length > 1 && s[i] === "0") {
			if (s[i + 1] === "x" || s[i + 1] === "X") {
				i += 2;
				base = 16;
			} else if ("0" <= s[i + 1] && s[i + 1] <= "9") {
				i++;
				base = 8;
				dmax = "7";
			}
		}
		const start = i;
		while (i < s.length) {
			if ("0" <= s[i] && s[i] <= dmax) n = n * base + (s.charCodeAt(i) - chr0) >>> 0;
			else if (base === 16) if ("a" <= s[i] && s[i] <= "f") n = n * base + (10 + s.charCodeAt(i) - chra) >>> 0;
			else if ("A" <= s[i] && s[i] <= "F") n = n * base + (10 + s.charCodeAt(i) - chrA) >>> 0;
			else break;
			else break;
			if (n > 4294967295) throw new Error("too large");
			i++;
		}
		if (i === start) throw new Error("empty octet");
		return [n, i];
	}
	function ip2long(ip) {
		const b = [];
		for (let i = 0; i <= 3; i++) {
			if (ip.length === 0) break;
			if (i > 0) {
				if (ip[0] !== ".") throw new Error("Invalid IP");
				ip = ip.substring(1);
			}
			const [n, c] = parseNum(ip);
			ip = ip.substring(c);
			b.push(n);
		}
		if (ip.length !== 0) throw new Error("Invalid IP");
		switch (b.length) {
			case 1:
				if (b[0] > 4294967295) throw new Error("Invalid IP");
				return b[0] >>> 0;
			case 2:
				if (b[0] > 255 || b[1] > 16777215) throw new Error("Invalid IP");
				return (b[0] << 24 | b[1]) >>> 0;
			case 3:
				if (b[0] > 255 || b[1] > 255 || b[2] > 65535) throw new Error("Invalid IP");
				return (b[0] << 24 | b[1] << 16 | b[2]) >>> 0;
			case 4:
				if (b[0] > 255 || b[1] > 255 || b[2] > 255 || b[3] > 255) throw new Error("Invalid IP");
				return (b[0] << 24 | b[1] << 16 | b[2] << 8 | b[3]) >>> 0;
			default: throw new Error("Invalid IP");
		}
	}
	exports.Netmask4Impl = class Netmask4Impl {
		constructor(net, mask) {
			if (typeof net !== "string") throw new Error("Missing `net' parameter");
			let maskStr = mask;
			if (!maskStr) {
				const parts = net.split("/", 2);
				net = parts[0];
				maskStr = parts[1];
			}
			if (!maskStr) maskStr = 32;
			if (typeof maskStr === "string" && maskStr.indexOf(".") > -1) {
				try {
					this.maskLong = ip2long(maskStr);
				} catch (error) {
					throw new Error("Invalid mask: " + maskStr);
				}
				this.bitmask = NaN;
				for (let i = 32; i >= 0; i--) if (this.maskLong === 4294967295 << 32 - i >>> 0) {
					this.bitmask = i;
					break;
				}
			} else if (maskStr || maskStr === 0) {
				this.bitmask = parseInt(maskStr, 10);
				this.maskLong = 0;
				if (this.bitmask > 0) this.maskLong = 4294967295 << 32 - this.bitmask >>> 0;
			} else throw new Error("Invalid mask: empty");
			try {
				this.netLong = (ip2long(net) & this.maskLong) >>> 0;
			} catch (error) {
				throw new Error("Invalid net address: " + net);
			}
			if (!(this.bitmask <= 32)) throw new Error("Invalid mask for ip4: " + maskStr);
			this.size = Math.pow(2, 32 - this.bitmask);
			this.base = long2ip(this.netLong);
			this.mask = long2ip(this.maskLong);
			this.hostmask = long2ip(~this.maskLong);
			this.first = this.bitmask <= 30 ? long2ip(this.netLong + 1) : this.base;
			this.last = this.bitmask <= 30 ? long2ip(this.netLong + this.size - 2) : long2ip(this.netLong + this.size - 1);
			this.broadcast = this.bitmask <= 30 ? long2ip(this.netLong + this.size - 1) : void 0;
		}
		contains(ip) {
			if (typeof ip === "string" && (ip.indexOf("/") > 0 || ip.split(".").length !== 4)) ip = new Netmask4Impl(ip);
			if (ip instanceof Netmask4Impl) return this.contains(ip.base) && this.contains(ip.broadcast || ip.last);
			else return (ip2long(ip) & this.maskLong) >>> 0 === (this.netLong & this.maskLong) >>> 0;
		}
		next(count = 1) {
			return new Netmask4Impl(long2ip(this.netLong + this.size * count), this.mask);
		}
		forEach(fn) {
			let long = ip2long(this.first);
			const lastLong = ip2long(this.last);
			let index = 0;
			while (long <= lastLong) {
				fn(long2ip(long), long, index);
				index++;
				long++;
			}
		}
		toString() {
			return this.base + "/" + this.bitmask;
		}
	};
}));
//#endregion
//#region node_modules/netmask/dist/netmask6.js
var require_netmask6 = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.Netmask6Impl = void 0;
	exports.ip6bigint = ip6bigint;
	exports.bigint2ip6 = bigint2ip6;
	const netmask4_1 = require_netmask4();
	const MAX_IPV6 = (1n << 128n) - 1n;
	function ip6bigint(ip) {
		const zoneIdx = ip.indexOf("%");
		if (zoneIdx !== -1) ip = ip.substring(0, zoneIdx);
		const lastColon = ip.lastIndexOf(":");
		if (lastColon !== -1 && ip.indexOf(".", lastColon) !== -1) {
			const ipv4Part = ip.substring(lastColon + 1);
			const ipv4Long = (0, netmask4_1.ip2long)(ipv4Part);
			return parseIPv6Pure(ip.substring(0, lastColon + 1) + "0:0") & -4294967296n | BigInt(ipv4Long);
		}
		return parseIPv6Pure(ip);
	}
	function parseIPv6Pure(ip) {
		const doubleColonIdx = ip.indexOf("::");
		let groups;
		if (doubleColonIdx !== -1) {
			const left = ip.substring(0, doubleColonIdx);
			const right = ip.substring(doubleColonIdx + 2);
			const leftGroups = left === "" ? [] : left.split(":");
			const rightGroups = right === "" ? [] : right.split(":");
			const missing = 8 - leftGroups.length - rightGroups.length;
			if (missing < 0) throw new Error("Invalid IPv6: too many groups");
			groups = [
				...leftGroups,
				...Array(missing).fill("0"),
				...rightGroups
			];
		} else groups = ip.split(":");
		if (groups.length !== 8) throw new Error("Invalid IPv6: expected 8 groups, got " + groups.length);
		let result = 0n;
		for (let i = 0; i < 8; i++) {
			const g = groups[i];
			if (g.length === 0 || g.length > 4) throw new Error("Invalid IPv6: bad group \"" + g + "\"");
			const val = parseInt(g, 16);
			if (isNaN(val) || val < 0 || val > 65535) throw new Error("Invalid IPv6: bad group \"" + g + "\"");
			result = result << 16n | BigInt(val);
		}
		return result;
	}
	function bigint2ip6(n) {
		if (n < 0n || n > MAX_IPV6) throw new Error("Invalid IPv6 address value");
		const groups = [];
		for (let i = 0; i < 8; i++) {
			groups.unshift(Number(n & 65535n));
			n >>= 16n;
		}
		let bestStart = -1;
		let bestLen = 0;
		let curStart = -1;
		let curLen = 0;
		for (let i = 0; i < 8; i++) if (groups[i] === 0) if (curStart === -1) {
			curStart = i;
			curLen = 1;
		} else curLen++;
		else {
			if (curLen > bestLen && curLen >= 2) {
				bestStart = curStart;
				bestLen = curLen;
			}
			curStart = -1;
			curLen = 0;
		}
		if (curLen > bestLen && curLen >= 2) {
			bestStart = curStart;
			bestLen = curLen;
		}
		if (bestStart !== -1 && bestStart + bestLen === 8 && bestStart > 0) return groups.slice(0, bestStart).map((g) => g.toString(16)).join(":") + "::";
		else if (bestStart === 0) return "::" + groups.slice(bestLen).map((g) => g.toString(16)).join(":");
		else if (bestStart > 0) {
			const before = groups.slice(0, bestStart).map((g) => g.toString(16));
			const after = groups.slice(bestStart + bestLen).map((g) => g.toString(16));
			return before.join(":") + "::" + after.join(":");
		} else return groups.map((g) => g.toString(16)).join(":");
	}
	exports.Netmask6Impl = class Netmask6Impl {
		constructor(net, mask) {
			if (typeof net !== "string") throw new Error("Missing `net' parameter");
			let prefixLen = mask;
			if (prefixLen === void 0 || prefixLen === null) {
				const slashIdx = net.indexOf("/");
				if (slashIdx !== -1) {
					prefixLen = parseInt(net.substring(slashIdx + 1), 10);
					net = net.substring(0, slashIdx);
				} else prefixLen = 128;
			}
			if (isNaN(prefixLen) || prefixLen < 0 || prefixLen > 128) throw new Error("Invalid mask for IPv6: " + prefixLen);
			this.bitmask = prefixLen;
			if (this.bitmask === 0) this.maskBigint = 0n;
			else this.maskBigint = MAX_IPV6 >> BigInt(128 - this.bitmask) << BigInt(128 - this.bitmask);
			try {
				this.netBigint = ip6bigint(net) & this.maskBigint;
			} catch (error) {
				throw new Error("Invalid IPv6 net address: " + net);
			}
			this.size = Number(1n << BigInt(128 - this.bitmask));
			this.base = bigint2ip6(this.netBigint);
			this.mask = bigint2ip6(this.maskBigint);
			this.hostmask = bigint2ip6(~this.maskBigint & MAX_IPV6);
			this.first = this.base;
			this.last = bigint2ip6(this.netBigint + (1n << BigInt(128 - this.bitmask)) - 1n);
			this.broadcast = void 0;
		}
		contains(ip) {
			if (typeof ip === "string") {
				if (ip.indexOf("/") > 0) ip = new Netmask6Impl(ip);
			}
			if (ip instanceof Netmask6Impl) return this.contains(ip.base) && this.contains(ip.last);
			else return (ip6bigint(ip) & this.maskBigint) === this.netBigint;
		}
		next(count = 1) {
			const sizeBig = 1n << BigInt(128 - this.bitmask);
			return new Netmask6Impl(bigint2ip6(this.netBigint + sizeBig * BigInt(count)), this.bitmask);
		}
		forEach(fn) {
			let addr = this.netBigint;
			const sizeBig = 1n << BigInt(128 - this.bitmask);
			const lastAddr = this.netBigint + sizeBig - 1n;
			let index = 0;
			while (addr <= lastAddr) {
				fn(bigint2ip6(addr), Number(addr), index);
				index++;
				addr++;
			}
		}
		toString() {
			return this.base + "/" + this.bitmask;
		}
	};
}));
//#endregion
//#region node_modules/netmask/dist/netmask.js
var require_netmask = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.long2ip = exports.ip2long = exports.Netmask = void 0;
	const netmask4_1 = require_netmask4();
	Object.defineProperty(exports, "ip2long", {
		enumerable: true,
		get: function() {
			return netmask4_1.ip2long;
		}
	});
	Object.defineProperty(exports, "long2ip", {
		enumerable: true,
		get: function() {
			return netmask4_1.long2ip;
		}
	});
	const netmask6_1 = require_netmask6();
	exports.Netmask = class Netmask {
		constructor(net, mask) {
			if (typeof net !== "string") throw new Error("Missing `net' parameter");
			if ((net.indexOf("/") !== -1 ? net.substring(0, net.indexOf("/")) : net).indexOf(":") !== -1) this._impl = new netmask6_1.Netmask6Impl(net, mask);
			else this._impl = new netmask4_1.Netmask4Impl(net, mask);
			this.base = this._impl.base;
			this.mask = this._impl.mask;
			this.hostmask = this._impl.hostmask;
			this.bitmask = this._impl.bitmask;
			this.size = this._impl.size;
			this.first = this._impl.first;
			this.last = this._impl.last;
			this.broadcast = this._impl.broadcast;
			if (this._impl instanceof netmask4_1.Netmask4Impl) {
				this.maskLong = this._impl.maskLong;
				this.netLong = this._impl.netLong;
			} else {
				this.maskLong = 0;
				this.netLong = 0;
			}
		}
		contains(ip) {
			if (typeof ip === "string") {
				if (ip.indexOf("/") > 0) ip = new Netmask(ip);
				else if (ip.indexOf(":") === -1 && ip.split(".").length !== 4) ip = new Netmask(ip);
			}
			if (ip instanceof Netmask) return this.contains(ip.base) && this.contains(ip.broadcast || ip.last);
			return this._impl.contains(ip);
		}
		next(count = 1) {
			const nextImpl = this._impl.next(count);
			return new Netmask(nextImpl.base, nextImpl.bitmask);
		}
		/** @deprecated */
		forEach(fn) {
			this._impl.forEach(fn);
		}
		toString() {
			return this._impl.toString();
		}
	};
}));
//#endregion
export { require_netmask as t };
