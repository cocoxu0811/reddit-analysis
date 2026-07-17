import { fileURLToPath as __eveFileURLToPath } from "node:url";
import { dirname as __eveDirname } from "node:path";
__eveDirname(__eveFileURLToPath(import.meta.url));
import { t as __commonJSMin } from "../_runtime.mjs";
//#region node_modules/ip-address/dist/common.js
var require_common = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.isInSubnet = isInSubnet;
	exports.isCorrect = isCorrect;
	exports.numberToPaddedHex = numberToPaddedHex;
	exports.stringToPaddedHex = stringToPaddedHex;
	exports.testBit = testBit;
	function isInSubnet(address) {
		if (this.subnetMask < address.subnetMask) return false;
		if (this.mask(address.subnetMask) === address.mask()) return true;
		return false;
	}
	function isCorrect(defaultBits) {
		return function() {
			if (this.addressMinusSuffix !== this.correctForm()) return false;
			if (this.subnetMask === defaultBits && !this.parsedSubnet) return true;
			return this.parsedSubnet === String(this.subnetMask);
		};
	}
	function numberToPaddedHex(number) {
		return number.toString(16).padStart(2, "0");
	}
	function stringToPaddedHex(numberString) {
		return numberToPaddedHex(parseInt(numberString, 10));
	}
	/**
	* @param binaryValue Binary representation of a value (e.g. `10`)
	* @param position Byte position, where 0 is the least significant bit
	*/
	function testBit(binaryValue, position) {
		const { length } = binaryValue;
		if (position > length) return false;
		const positionInString = length - position;
		return binaryValue.substring(positionInString, positionInString + 1) === "1";
	}
}));
//#endregion
//#region node_modules/ip-address/dist/v4/constants.js
var require_constants$1 = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.RE_SUBNET_STRING = exports.RE_ADDRESS = exports.GROUPS = exports.BITS = void 0;
	exports.BITS = 32;
	exports.GROUPS = 4;
	exports.RE_ADDRESS = /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/g;
	exports.RE_SUBNET_STRING = /\/\d{1,2}$/;
}));
//#endregion
//#region node_modules/ip-address/dist/address-error.js
var require_address_error = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.AddressError = void 0;
	var AddressError = class extends Error {
		constructor(message, parseMessage) {
			super(message);
			this.name = "AddressError";
			this.parseMessage = parseMessage;
		}
	};
	exports.AddressError = AddressError;
}));
//#endregion
//#region node_modules/ip-address/dist/ipv4.js
var require_ipv4 = /* @__PURE__ */ __commonJSMin(((exports) => {
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
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.Address4 = void 0;
	const common = __importStar(require_common());
	const constants = __importStar(require_constants$1());
	const address_error_1 = require_address_error();
	exports.Address4 = class Address4 {
		constructor(address) {
			this.groups = constants.GROUPS;
			this.parsedAddress = [];
			this.parsedSubnet = "";
			this.subnet = "/32";
			this.subnetMask = 32;
			this.v4 = true;
			/**
			* Returns true if the address is correct, false otherwise
			* @memberof Address4
			* @instance
			* @returns {Boolean}
			*/
			this.isCorrect = common.isCorrect(constants.BITS);
			/**
			* Returns true if the given address is in the subnet of the current address
			* @memberof Address4
			* @instance
			* @returns {boolean}
			*/
			this.isInSubnet = common.isInSubnet;
			this.address = address;
			const subnet = constants.RE_SUBNET_STRING.exec(address);
			if (subnet) {
				this.parsedSubnet = subnet[0].replace("/", "");
				this.subnetMask = parseInt(this.parsedSubnet, 10);
				this.subnet = `/${this.subnetMask}`;
				if (this.subnetMask < 0 || this.subnetMask > constants.BITS) throw new address_error_1.AddressError("Invalid subnet mask.");
				address = address.replace(constants.RE_SUBNET_STRING, "");
			}
			this.addressMinusSuffix = address;
			this.parsedAddress = this.parse(address);
		}
		static isValid(address) {
			try {
				new Address4(address);
				return true;
			} catch (e) {
				return false;
			}
		}
		parse(address) {
			const groups = address.split(".");
			if (!address.match(constants.RE_ADDRESS)) throw new address_error_1.AddressError("Invalid IPv4 address.");
			return groups;
		}
		/**
		* Returns the correct form of an address
		* @memberof Address4
		* @instance
		* @returns {String}
		*/
		correctForm() {
			return this.parsedAddress.map((part) => parseInt(part, 10)).join(".");
		}
		/**
		* Converts a hex string to an IPv4 address object
		* @memberof Address4
		* @static
		* @param {string} hex - a hex string to convert
		* @returns {Address4}
		*/
		static fromHex(hex) {
			const padded = hex.replace(/:/g, "").padStart(8, "0");
			const groups = [];
			let i;
			for (i = 0; i < 8; i += 2) {
				const h = padded.slice(i, i + 2);
				groups.push(parseInt(h, 16));
			}
			return new Address4(groups.join("."));
		}
		/**
		* Converts an integer into a IPv4 address object
		* @memberof Address4
		* @static
		* @param {integer} integer - a number to convert
		* @returns {Address4}
		*/
		static fromInteger(integer) {
			return Address4.fromHex(integer.toString(16));
		}
		/**
		* Return an address from in-addr.arpa form
		* @memberof Address4
		* @static
		* @param {string} arpaFormAddress - an 'in-addr.arpa' form ipv4 address
		* @returns {Adress4}
		* @example
		* var address = Address4.fromArpa(42.2.0.192.in-addr.arpa.)
		* address.correctForm(); // '192.0.2.42'
		*/
		static fromArpa(arpaFormAddress) {
			const address = arpaFormAddress.replace(/(\.in-addr\.arpa)?\.$/, "").split(".").reverse().join(".");
			return new Address4(address);
		}
		/**
		* Converts an IPv4 address object to a hex string
		* @memberof Address4
		* @instance
		* @returns {String}
		*/
		toHex() {
			return this.parsedAddress.map((part) => common.stringToPaddedHex(part)).join(":");
		}
		/**
		* Converts an IPv4 address object to an array of bytes
		* @memberof Address4
		* @instance
		* @returns {Array}
		*/
		toArray() {
			return this.parsedAddress.map((part) => parseInt(part, 10));
		}
		/**
		* Converts an IPv4 address object to an IPv6 address group
		* @memberof Address4
		* @instance
		* @returns {String}
		*/
		toGroup6() {
			const output = [];
			let i;
			for (i = 0; i < constants.GROUPS; i += 2) output.push(`${common.stringToPaddedHex(this.parsedAddress[i])}${common.stringToPaddedHex(this.parsedAddress[i + 1])}`);
			return output.join(":");
		}
		/**
		* Returns the address as a `bigint`
		* @memberof Address4
		* @instance
		* @returns {bigint}
		*/
		bigInt() {
			return BigInt(`0x${this.parsedAddress.map((n) => common.stringToPaddedHex(n)).join("")}`);
		}
		/**
		* Helper function getting start address.
		* @memberof Address4
		* @instance
		* @returns {bigint}
		*/
		_startAddress() {
			return BigInt(`0b${this.mask() + "0".repeat(constants.BITS - this.subnetMask)}`);
		}
		/**
		* The first address in the range given by this address' subnet.
		* Often referred to as the Network Address.
		* @memberof Address4
		* @instance
		* @returns {Address4}
		*/
		startAddress() {
			return Address4.fromBigInt(this._startAddress());
		}
		/**
		* The first host address in the range given by this address's subnet ie
		* the first address after the Network Address
		* @memberof Address4
		* @instance
		* @returns {Address4}
		*/
		startAddressExclusive() {
			const adjust = BigInt("1");
			return Address4.fromBigInt(this._startAddress() + adjust);
		}
		/**
		* Helper function getting end address.
		* @memberof Address4
		* @instance
		* @returns {bigint}
		*/
		_endAddress() {
			return BigInt(`0b${this.mask() + "1".repeat(constants.BITS - this.subnetMask)}`);
		}
		/**
		* The last address in the range given by this address' subnet
		* Often referred to as the Broadcast
		* @memberof Address4
		* @instance
		* @returns {Address4}
		*/
		endAddress() {
			return Address4.fromBigInt(this._endAddress());
		}
		/**
		* The last host address in the range given by this address's subnet ie
		* the last address prior to the Broadcast Address
		* @memberof Address4
		* @instance
		* @returns {Address4}
		*/
		endAddressExclusive() {
			const adjust = BigInt("1");
			return Address4.fromBigInt(this._endAddress() - adjust);
		}
		/**
		* Converts a BigInt to a v4 address object
		* @memberof Address4
		* @static
		* @param {bigint} bigInt - a BigInt to convert
		* @returns {Address4}
		*/
		static fromBigInt(bigInt) {
			return Address4.fromHex(bigInt.toString(16));
		}
		/**
		* Convert a byte array to an Address4 object
		* @memberof Address4
		* @static
		* @param {Array<number>} bytes - an array of 4 bytes (0-255)
		* @returns {Address4}
		*/
		static fromByteArray(bytes) {
			if (bytes.length !== 4) throw new address_error_1.AddressError("IPv4 addresses require exactly 4 bytes");
			for (let i = 0; i < bytes.length; i++) if (!Number.isInteger(bytes[i]) || bytes[i] < 0 || bytes[i] > 255) throw new address_error_1.AddressError("All bytes must be integers between 0 and 255");
			return this.fromUnsignedByteArray(bytes);
		}
		/**
		* Convert an unsigned byte array to an Address4 object
		* @memberof Address4
		* @static
		* @param {Array<number>} bytes - an array of 4 unsigned bytes (0-255)
		* @returns {Address4}
		*/
		static fromUnsignedByteArray(bytes) {
			if (bytes.length !== 4) throw new address_error_1.AddressError("IPv4 addresses require exactly 4 bytes");
			const address = bytes.join(".");
			return new Address4(address);
		}
		/**
		* Returns the first n bits of the address, defaulting to the
		* subnet mask
		* @memberof Address4
		* @instance
		* @returns {String}
		*/
		mask(mask) {
			if (mask === void 0) mask = this.subnetMask;
			return this.getBitsBase2(0, mask);
		}
		/**
		* Returns the bits in the given range as a base-2 string
		* @memberof Address4
		* @instance
		* @returns {string}
		*/
		getBitsBase2(start, end) {
			return this.binaryZeroPad().slice(start, end);
		}
		/**
		* Return the reversed ip6.arpa form of the address
		* @memberof Address4
		* @param {Object} options
		* @param {boolean} options.omitSuffix - omit the "in-addr.arpa" suffix
		* @instance
		* @returns {String}
		*/
		reverseForm(options) {
			if (!options) options = {};
			const reversed = this.correctForm().split(".").reverse().join(".");
			if (options.omitSuffix) return reversed;
			return `${reversed}.in-addr.arpa.`;
		}
		/**
		* Returns true if the given address is a multicast address
		* @memberof Address4
		* @instance
		* @returns {boolean}
		*/
		isMulticast() {
			return this.isInSubnet(new Address4("224.0.0.0/4"));
		}
		/**
		* Returns a zero-padded base-2 string representation of the address
		* @memberof Address4
		* @instance
		* @returns {string}
		*/
		binaryZeroPad() {
			return this.bigInt().toString(2).padStart(constants.BITS, "0");
		}
		/**
		* Groups an IPv4 address for inclusion at the end of an IPv6 address
		* @returns {String}
		*/
		groupForV6() {
			const segments = this.parsedAddress;
			return this.address.replace(constants.RE_ADDRESS, `<span class="hover-group group-v4 group-6">${segments.slice(0, 2).join(".")}</span>.<span class="hover-group group-v4 group-7">${segments.slice(2, 4).join(".")}</span>`);
		}
	};
}));
//#endregion
//#region node_modules/ip-address/dist/v6/constants.js
var require_constants = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.RE_URL_WITH_PORT = exports.RE_URL = exports.RE_ZONE_STRING = exports.RE_SUBNET_STRING = exports.RE_BAD_ADDRESS = exports.RE_BAD_CHARACTERS = exports.TYPES = exports.SCOPES = exports.GROUPS = exports.BITS = void 0;
	exports.BITS = 128;
	exports.GROUPS = 8;
	/**
	* Represents IPv6 address scopes
	* @memberof Address6
	* @static
	*/
	exports.SCOPES = {
		0: "Reserved",
		1: "Interface local",
		2: "Link local",
		4: "Admin local",
		5: "Site local",
		8: "Organization local",
		14: "Global",
		15: "Reserved"
	};
	/**
	* Represents IPv6 address types
	* @memberof Address6
	* @static
	*/
	exports.TYPES = {
		"ff01::1/128": "Multicast (All nodes on this interface)",
		"ff01::2/128": "Multicast (All routers on this interface)",
		"ff02::1/128": "Multicast (All nodes on this link)",
		"ff02::2/128": "Multicast (All routers on this link)",
		"ff05::2/128": "Multicast (All routers in this site)",
		"ff02::5/128": "Multicast (OSPFv3 AllSPF routers)",
		"ff02::6/128": "Multicast (OSPFv3 AllDR routers)",
		"ff02::9/128": "Multicast (RIP routers)",
		"ff02::a/128": "Multicast (EIGRP routers)",
		"ff02::d/128": "Multicast (PIM routers)",
		"ff02::16/128": "Multicast (MLDv2 reports)",
		"ff01::fb/128": "Multicast (mDNSv6)",
		"ff02::fb/128": "Multicast (mDNSv6)",
		"ff05::fb/128": "Multicast (mDNSv6)",
		"ff02::1:2/128": "Multicast (All DHCP servers and relay agents on this link)",
		"ff05::1:2/128": "Multicast (All DHCP servers and relay agents in this site)",
		"ff02::1:3/128": "Multicast (All DHCP servers on this link)",
		"ff05::1:3/128": "Multicast (All DHCP servers in this site)",
		"::/128": "Unspecified",
		"::1/128": "Loopback",
		"ff00::/8": "Multicast",
		"fe80::/10": "Link-local unicast"
	};
	/**
	* A regular expression that matches bad characters in an IPv6 address
	* @memberof Address6
	* @static
	*/
	exports.RE_BAD_CHARACTERS = /([^0-9a-f:/%])/gi;
	/**
	* A regular expression that matches an incorrect IPv6 address
	* @memberof Address6
	* @static
	*/
	exports.RE_BAD_ADDRESS = /([0-9a-f]{5,}|:{3,}|[^:]:$|^:[^:]|\/$)/gi;
	/**
	* A regular expression that matches an IPv6 subnet
	* @memberof Address6
	* @static
	*/
	exports.RE_SUBNET_STRING = /\/\d{1,3}(?=%|$)/;
	/**
	* A regular expression that matches an IPv6 zone
	* @memberof Address6
	* @static
	*/
	exports.RE_ZONE_STRING = /%.*$/;
	exports.RE_URL = /^\[{0,1}([0-9a-f:]+)\]{0,1}/;
	exports.RE_URL_WITH_PORT = /\[([0-9a-f:]+)\]:([0-9]{1,5})/;
}));
//#endregion
//#region node_modules/ip-address/dist/v6/helpers.js
var require_helpers = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.spanAllZeroes = spanAllZeroes;
	exports.spanAll = spanAll;
	exports.spanLeadingZeroes = spanLeadingZeroes;
	exports.simpleGroup = simpleGroup;
	/**
	* @returns {String} the string with all zeroes contained in a <span>
	*/
	function spanAllZeroes(s) {
		return s.replace(/(0+)/g, "<span class=\"zero\">$1</span>");
	}
	/**
	* @returns {String} the string with each character contained in a <span>
	*/
	function spanAll(s, offset = 0) {
		return s.split("").map((n, i) => `<span class="digit value-${n} position-${i + offset}">${spanAllZeroes(n)}</span>`).join("");
	}
	function spanLeadingZeroesSimple(group) {
		return group.replace(/^(0+)/, "<span class=\"zero\">$1</span>");
	}
	/**
	* @returns {String} the string with leading zeroes contained in a <span>
	*/
	function spanLeadingZeroes(address) {
		return address.split(":").map((g) => spanLeadingZeroesSimple(g)).join(":");
	}
	/**
	* Groups an address
	* @returns {String} a grouped address
	*/
	function simpleGroup(addressString, offset = 0) {
		return addressString.split(":").map((g, i) => {
			if (/group-v4/.test(g)) return g;
			return `<span class="hover-group group-${i + offset}">${spanLeadingZeroesSimple(g)}</span>`;
		});
	}
}));
//#endregion
//#region node_modules/ip-address/dist/v6/regular-expressions.js
var require_regular_expressions = /* @__PURE__ */ __commonJSMin(((exports) => {
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
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.ADDRESS_BOUNDARY = void 0;
	exports.groupPossibilities = groupPossibilities;
	exports.padGroup = padGroup;
	exports.simpleRegularExpression = simpleRegularExpression;
	exports.possibleElisions = possibleElisions;
	const v6 = __importStar(require_constants());
	function groupPossibilities(possibilities) {
		return `(${possibilities.join("|")})`;
	}
	function padGroup(group) {
		if (group.length < 4) return `0{0,${4 - group.length}}${group}`;
		return group;
	}
	exports.ADDRESS_BOUNDARY = "[^A-Fa-f0-9:]";
	function simpleRegularExpression(groups) {
		const zeroIndexes = [];
		groups.forEach((group, i) => {
			if (parseInt(group, 16) === 0) zeroIndexes.push(i);
		});
		const possibilities = zeroIndexes.map((zeroIndex) => groups.map((group, i) => {
			if (i === zeroIndex) {
				const elision = i === 0 || i === v6.GROUPS - 1 ? ":" : "";
				return groupPossibilities([padGroup(group), elision]);
			}
			return padGroup(group);
		}).join(":"));
		possibilities.push(groups.map(padGroup).join(":"));
		return groupPossibilities(possibilities);
	}
	function possibleElisions(elidedGroups, moreLeft, moreRight) {
		const left = moreLeft ? "" : ":";
		const right = moreRight ? "" : ":";
		const possibilities = [];
		if (!moreLeft && !moreRight) possibilities.push("::");
		if (moreLeft && moreRight) possibilities.push("");
		if (moreRight && !moreLeft || !moreRight && moreLeft) possibilities.push(":");
		possibilities.push(`${left}(:0{1,4}){1,${elidedGroups - 1}}`);
		possibilities.push(`(0{1,4}:){1,${elidedGroups - 1}}${right}`);
		possibilities.push(`(0{1,4}:){${elidedGroups - 1}}0{1,4}`);
		for (let groups = 1; groups < elidedGroups - 1; groups++) for (let position = 1; position < elidedGroups - groups; position++) possibilities.push(`(0{1,4}:){${position}}:(0{1,4}:){${elidedGroups - position - groups - 1}}0{1,4}`);
		return groupPossibilities(possibilities);
	}
}));
//#endregion
//#region node_modules/ip-address/dist/ipv6.js
var require_ipv6 = /* @__PURE__ */ __commonJSMin(((exports) => {
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
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.Address6 = void 0;
	const common = __importStar(require_common());
	const constants4 = __importStar(require_constants$1());
	const constants6 = __importStar(require_constants());
	const helpers = __importStar(require_helpers());
	const ipv4_1 = require_ipv4();
	const regular_expressions_1 = require_regular_expressions();
	const address_error_1 = require_address_error();
	const common_1 = require_common();
	function assert(condition) {
		if (!condition) throw new Error("Assertion failed.");
	}
	function addCommas(number) {
		const r = /(\d+)(\d{3})/;
		while (r.test(number)) number = number.replace(r, "$1,$2");
		return number;
	}
	function spanLeadingZeroes4(n) {
		n = n.replace(/^(0{1,})([1-9]+)$/, "<span class=\"parse-error\">$1</span>$2");
		n = n.replace(/^(0{1,})(0)$/, "<span class=\"parse-error\">$1</span>$2");
		return n;
	}
	function compact(address, slice) {
		const s1 = [];
		const s2 = [];
		let i;
		for (i = 0; i < address.length; i++) if (i < slice[0]) s1.push(address[i]);
		else if (i > slice[1]) s2.push(address[i]);
		return s1.concat(["compact"]).concat(s2);
	}
	function paddedHex(octet) {
		return parseInt(octet, 16).toString(16).padStart(4, "0");
	}
	function unsignByte(b) {
		return b & 255;
	}
	exports.Address6 = class Address6 {
		constructor(address, optionalGroups) {
			this.addressMinusSuffix = "";
			this.parsedSubnet = "";
			this.subnet = "/128";
			this.subnetMask = 128;
			this.v4 = false;
			this.zone = "";
			/**
			* Returns true if the given address is in the subnet of the current address
			* @memberof Address6
			* @instance
			* @returns {boolean}
			*/
			this.isInSubnet = common.isInSubnet;
			/**
			* Returns true if the address is correct, false otherwise
			* @memberof Address6
			* @instance
			* @returns {boolean}
			*/
			this.isCorrect = common.isCorrect(constants6.BITS);
			if (optionalGroups === void 0) this.groups = constants6.GROUPS;
			else this.groups = optionalGroups;
			this.address = address;
			const subnet = constants6.RE_SUBNET_STRING.exec(address);
			if (subnet) {
				this.parsedSubnet = subnet[0].replace("/", "");
				this.subnetMask = parseInt(this.parsedSubnet, 10);
				this.subnet = `/${this.subnetMask}`;
				if (Number.isNaN(this.subnetMask) || this.subnetMask < 0 || this.subnetMask > constants6.BITS) throw new address_error_1.AddressError("Invalid subnet mask.");
				address = address.replace(constants6.RE_SUBNET_STRING, "");
			} else if (/\//.test(address)) throw new address_error_1.AddressError("Invalid subnet mask.");
			const zone = constants6.RE_ZONE_STRING.exec(address);
			if (zone) {
				this.zone = zone[0];
				address = address.replace(constants6.RE_ZONE_STRING, "");
			}
			this.addressMinusSuffix = address;
			this.parsedAddress = this.parse(this.addressMinusSuffix);
		}
		static isValid(address) {
			try {
				new Address6(address);
				return true;
			} catch (e) {
				return false;
			}
		}
		/**
		* Convert a BigInt to a v6 address object
		* @memberof Address6
		* @static
		* @param {bigint} bigInt - a BigInt to convert
		* @returns {Address6}
		* @example
		* var bigInt = BigInt('1000000000000');
		* var address = Address6.fromBigInt(bigInt);
		* address.correctForm(); // '::e8:d4a5:1000'
		*/
		static fromBigInt(bigInt) {
			const hex = bigInt.toString(16).padStart(32, "0");
			const groups = [];
			let i;
			for (i = 0; i < constants6.GROUPS; i++) groups.push(hex.slice(i * 4, (i + 1) * 4));
			return new Address6(groups.join(":"));
		}
		/**
		* Convert a URL (with optional port number) to an address object
		* @memberof Address6
		* @static
		* @param {string} url - a URL with optional port number
		* @example
		* var addressAndPort = Address6.fromURL('http://[ffff::]:8080/foo/');
		* addressAndPort.address.correctForm(); // 'ffff::'
		* addressAndPort.port; // 8080
		*/
		static fromURL(url) {
			let host;
			let port = null;
			let result;
			if (url.indexOf("[") !== -1 && url.indexOf("]:") !== -1) {
				result = constants6.RE_URL_WITH_PORT.exec(url);
				if (result === null) return {
					error: "failed to parse address with port",
					address: null,
					port: null
				};
				host = result[1];
				port = result[2];
			} else if (url.indexOf("/") !== -1) {
				url = url.replace(/^[a-z0-9]+:\/\//, "");
				result = constants6.RE_URL.exec(url);
				if (result === null) return {
					error: "failed to parse address from URL",
					address: null,
					port: null
				};
				host = result[1];
			} else host = url;
			if (port) {
				port = parseInt(port, 10);
				if (port < 0 || port > 65536) port = null;
			} else port = null;
			return {
				address: new Address6(host),
				port
			};
		}
		/**
		* Create an IPv6-mapped address given an IPv4 address
		* @memberof Address6
		* @static
		* @param {string} address - An IPv4 address string
		* @returns {Address6}
		* @example
		* var address = Address6.fromAddress4('192.168.0.1');
		* address.correctForm(); // '::ffff:c0a8:1'
		* address.to4in6(); // '::ffff:192.168.0.1'
		*/
		static fromAddress4(address) {
			const address4 = new ipv4_1.Address4(address);
			const mask6 = constants6.BITS - (constants4.BITS - address4.subnetMask);
			return new Address6(`::ffff:${address4.correctForm()}/${mask6}`);
		}
		/**
		* Return an address from ip6.arpa form
		* @memberof Address6
		* @static
		* @param {string} arpaFormAddress - an 'ip6.arpa' form address
		* @returns {Adress6}
		* @example
		* var address = Address6.fromArpa(e.f.f.f.3.c.2.6.f.f.f.e.6.6.8.e.1.0.6.7.9.4.e.c.0.0.0.0.1.0.0.2.ip6.arpa.)
		* address.correctForm(); // '2001:0:ce49:7601:e866:efff:62c3:fffe'
		*/
		static fromArpa(arpaFormAddress) {
			let address = arpaFormAddress.replace(/(\.ip6\.arpa)?\.$/, "");
			const semicolonAmount = 7;
			if (address.length !== 63) throw new address_error_1.AddressError("Invalid 'ip6.arpa' form.");
			const parts = address.split(".").reverse();
			for (let i = semicolonAmount; i > 0; i--) {
				const insertIndex = i * 4;
				parts.splice(insertIndex, 0, ":");
			}
			address = parts.join("");
			return new Address6(address);
		}
		/**
		* Return the Microsoft UNC transcription of the address
		* @memberof Address6
		* @instance
		* @returns {String} the Microsoft UNC transcription of the address
		*/
		microsoftTranscription() {
			return `${this.correctForm().replace(/:/g, "-")}.ipv6-literal.net`;
		}
		/**
		* Return the first n bits of the address, defaulting to the subnet mask
		* @memberof Address6
		* @instance
		* @param {number} [mask=subnet] - the number of bits to mask
		* @returns {String} the first n bits of the address as a string
		*/
		mask(mask = this.subnetMask) {
			return this.getBitsBase2(0, mask);
		}
		/**
		* Return the number of possible subnets of a given size in the address
		* @memberof Address6
		* @instance
		* @param {number} [subnetSize=128] - the subnet size
		* @returns {String}
		*/
		possibleSubnets(subnetSize = 128) {
			const subnetPowers = constants6.BITS - this.subnetMask - Math.abs(subnetSize - constants6.BITS);
			if (subnetPowers < 0) return "0";
			return addCommas((BigInt("2") ** BigInt(subnetPowers)).toString(10));
		}
		/**
		* Helper function getting start address.
		* @memberof Address6
		* @instance
		* @returns {bigint}
		*/
		_startAddress() {
			return BigInt(`0b${this.mask() + "0".repeat(constants6.BITS - this.subnetMask)}`);
		}
		/**
		* The first address in the range given by this address' subnet
		* Often referred to as the Network Address.
		* @memberof Address6
		* @instance
		* @returns {Address6}
		*/
		startAddress() {
			return Address6.fromBigInt(this._startAddress());
		}
		/**
		* The first host address in the range given by this address's subnet ie
		* the first address after the Network Address
		* @memberof Address6
		* @instance
		* @returns {Address6}
		*/
		startAddressExclusive() {
			const adjust = BigInt("1");
			return Address6.fromBigInt(this._startAddress() + adjust);
		}
		/**
		* Helper function getting end address.
		* @memberof Address6
		* @instance
		* @returns {bigint}
		*/
		_endAddress() {
			return BigInt(`0b${this.mask() + "1".repeat(constants6.BITS - this.subnetMask)}`);
		}
		/**
		* The last address in the range given by this address' subnet
		* Often referred to as the Broadcast
		* @memberof Address6
		* @instance
		* @returns {Address6}
		*/
		endAddress() {
			return Address6.fromBigInt(this._endAddress());
		}
		/**
		* The last host address in the range given by this address's subnet ie
		* the last address prior to the Broadcast Address
		* @memberof Address6
		* @instance
		* @returns {Address6}
		*/
		endAddressExclusive() {
			const adjust = BigInt("1");
			return Address6.fromBigInt(this._endAddress() - adjust);
		}
		/**
		* Return the scope of the address
		* @memberof Address6
		* @instance
		* @returns {String}
		*/
		getScope() {
			let scope = constants6.SCOPES[parseInt(this.getBits(12, 16).toString(10), 10)];
			if (this.getType() === "Global unicast" && scope !== "Link local") scope = "Global";
			return scope || "Unknown";
		}
		/**
		* Return the type of the address
		* @memberof Address6
		* @instance
		* @returns {String}
		*/
		getType() {
			for (const subnet of Object.keys(constants6.TYPES)) if (this.isInSubnet(new Address6(subnet))) return constants6.TYPES[subnet];
			return "Global unicast";
		}
		/**
		* Return the bits in the given range as a BigInt
		* @memberof Address6
		* @instance
		* @returns {bigint}
		*/
		getBits(start, end) {
			return BigInt(`0b${this.getBitsBase2(start, end)}`);
		}
		/**
		* Return the bits in the given range as a base-2 string
		* @memberof Address6
		* @instance
		* @returns {String}
		*/
		getBitsBase2(start, end) {
			return this.binaryZeroPad().slice(start, end);
		}
		/**
		* Return the bits in the given range as a base-16 string
		* @memberof Address6
		* @instance
		* @returns {String}
		*/
		getBitsBase16(start, end) {
			const length = end - start;
			if (length % 4 !== 0) throw new Error("Length of bits to retrieve must be divisible by four");
			return this.getBits(start, end).toString(16).padStart(length / 4, "0");
		}
		/**
		* Return the bits that are set past the subnet mask length
		* @memberof Address6
		* @instance
		* @returns {String}
		*/
		getBitsPastSubnet() {
			return this.getBitsBase2(this.subnetMask, constants6.BITS);
		}
		/**
		* Return the reversed ip6.arpa form of the address
		* @memberof Address6
		* @param {Object} options
		* @param {boolean} options.omitSuffix - omit the "ip6.arpa" suffix
		* @instance
		* @returns {String}
		*/
		reverseForm(options) {
			if (!options) options = {};
			const characters = Math.floor(this.subnetMask / 4);
			const reversed = this.canonicalForm().replace(/:/g, "").split("").slice(0, characters).reverse().join(".");
			if (characters > 0) {
				if (options.omitSuffix) return reversed;
				return `${reversed}.ip6.arpa.`;
			}
			if (options.omitSuffix) return "";
			return "ip6.arpa.";
		}
		/**
		* Return the correct form of the address
		* @memberof Address6
		* @instance
		* @returns {String}
		*/
		correctForm() {
			let i;
			let groups = [];
			let zeroCounter = 0;
			const zeroes = [];
			for (i = 0; i < this.parsedAddress.length; i++) {
				const value = parseInt(this.parsedAddress[i], 16);
				if (value === 0) zeroCounter++;
				if (value !== 0 && zeroCounter > 0) {
					if (zeroCounter > 1) zeroes.push([i - zeroCounter, i - 1]);
					zeroCounter = 0;
				}
			}
			if (zeroCounter > 1) zeroes.push([this.parsedAddress.length - zeroCounter, this.parsedAddress.length - 1]);
			const zeroLengths = zeroes.map((n) => n[1] - n[0] + 1);
			if (zeroes.length > 0) {
				const index = zeroLengths.indexOf(Math.max(...zeroLengths));
				groups = compact(this.parsedAddress, zeroes[index]);
			} else groups = this.parsedAddress;
			for (i = 0; i < groups.length; i++) if (groups[i] !== "compact") groups[i] = parseInt(groups[i], 16).toString(16);
			let correct = groups.join(":");
			correct = correct.replace(/^compact$/, "::");
			correct = correct.replace(/(^compact)|(compact$)/, ":");
			correct = correct.replace(/compact/, "");
			return correct;
		}
		/**
		* Return a zero-padded base-2 string representation of the address
		* @memberof Address6
		* @instance
		* @returns {String}
		* @example
		* var address = new Address6('2001:4860:4001:803::1011');
		* address.binaryZeroPad();
		* // '0010000000000001010010000110000001000000000000010000100000000011
		* //  0000000000000000000000000000000000000000000000000001000000010001'
		*/
		binaryZeroPad() {
			return this.bigInt().toString(2).padStart(constants6.BITS, "0");
		}
		parse4in6(address) {
			const groups = address.split(":");
			const address4 = groups.slice(-1)[0].match(constants4.RE_ADDRESS);
			if (address4) {
				this.parsedAddress4 = address4[0];
				this.address4 = new ipv4_1.Address4(this.parsedAddress4);
				for (let i = 0; i < this.address4.groups; i++) if (/^0[0-9]+/.test(this.address4.parsedAddress[i])) throw new address_error_1.AddressError("IPv4 addresses can't have leading zeroes.", address.replace(constants4.RE_ADDRESS, this.address4.parsedAddress.map(spanLeadingZeroes4).join(".")));
				this.v4 = true;
				groups[groups.length - 1] = this.address4.toGroup6();
				address = groups.join(":");
			}
			return address;
		}
		parse(address) {
			address = this.parse4in6(address);
			const badCharacters = address.match(constants6.RE_BAD_CHARACTERS);
			if (badCharacters) throw new address_error_1.AddressError(`Bad character${badCharacters.length > 1 ? "s" : ""} detected in address: ${badCharacters.join("")}`, address.replace(constants6.RE_BAD_CHARACTERS, "<span class=\"parse-error\">$1</span>"));
			const badAddress = address.match(constants6.RE_BAD_ADDRESS);
			if (badAddress) throw new address_error_1.AddressError(`Address failed regex: ${badAddress.join("")}`, address.replace(constants6.RE_BAD_ADDRESS, "<span class=\"parse-error\">$1</span>"));
			let groups = [];
			const halves = address.split("::");
			if (halves.length === 2) {
				let first = halves[0].split(":");
				let last = halves[1].split(":");
				if (first.length === 1 && first[0] === "") first = [];
				if (last.length === 1 && last[0] === "") last = [];
				const remaining = this.groups - (first.length + last.length);
				if (!remaining) throw new address_error_1.AddressError("Error parsing groups");
				this.elidedGroups = remaining;
				this.elisionBegin = first.length;
				this.elisionEnd = first.length + this.elidedGroups;
				groups = groups.concat(first);
				for (let i = 0; i < remaining; i++) groups.push("0");
				groups = groups.concat(last);
			} else if (halves.length === 1) {
				groups = address.split(":");
				this.elidedGroups = 0;
			} else throw new address_error_1.AddressError("Too many :: groups found");
			groups = groups.map((group) => parseInt(group, 16).toString(16));
			if (groups.length !== this.groups) throw new address_error_1.AddressError("Incorrect number of groups found");
			return groups;
		}
		/**
		* Return the canonical form of the address
		* @memberof Address6
		* @instance
		* @returns {String}
		*/
		canonicalForm() {
			return this.parsedAddress.map(paddedHex).join(":");
		}
		/**
		* Return the decimal form of the address
		* @memberof Address6
		* @instance
		* @returns {String}
		*/
		decimal() {
			return this.parsedAddress.map((n) => parseInt(n, 16).toString(10).padStart(5, "0")).join(":");
		}
		/**
		* Return the address as a BigInt
		* @memberof Address6
		* @instance
		* @returns {bigint}
		*/
		bigInt() {
			return BigInt(`0x${this.parsedAddress.map(paddedHex).join("")}`);
		}
		/**
		* Return the last two groups of this address as an IPv4 address string
		* @memberof Address6
		* @instance
		* @returns {Address4}
		* @example
		* var address = new Address6('2001:4860:4001::1825:bf11');
		* address.to4().correctForm(); // '24.37.191.17'
		*/
		to4() {
			const binary = this.binaryZeroPad().split("");
			return ipv4_1.Address4.fromHex(BigInt(`0b${binary.slice(96, 128).join("")}`).toString(16));
		}
		/**
		* Return the v4-in-v6 form of the address
		* @memberof Address6
		* @instance
		* @returns {String}
		*/
		to4in6() {
			const address4 = this.to4();
			const correct = new Address6(this.parsedAddress.slice(0, 6).join(":"), 6).correctForm();
			let infix = "";
			if (!/:$/.test(correct)) infix = ":";
			return correct + infix + address4.address;
		}
		/**
		* Return an object containing the Teredo properties of the address
		* @memberof Address6
		* @instance
		* @returns {Object}
		*/
		inspectTeredo() {
			const prefix = this.getBitsBase16(0, 32);
			const udpPort = (this.getBits(80, 96) ^ BigInt("0xffff")).toString();
			const server4 = ipv4_1.Address4.fromHex(this.getBitsBase16(32, 64));
			const bitsForClient4 = this.getBits(96, 128);
			const client4 = ipv4_1.Address4.fromHex((bitsForClient4 ^ BigInt("0xffffffff")).toString(16));
			const flagsBase2 = this.getBitsBase2(64, 80);
			const coneNat = (0, common_1.testBit)(flagsBase2, 15);
			const reserved = (0, common_1.testBit)(flagsBase2, 14);
			const groupIndividual = (0, common_1.testBit)(flagsBase2, 8);
			const universalLocal = (0, common_1.testBit)(flagsBase2, 9);
			const nonce = BigInt(`0b${flagsBase2.slice(2, 6) + flagsBase2.slice(8, 16)}`).toString(10);
			return {
				prefix: `${prefix.slice(0, 4)}:${prefix.slice(4, 8)}`,
				server4: server4.address,
				client4: client4.address,
				flags: flagsBase2,
				coneNat,
				microsoft: {
					reserved,
					universalLocal,
					groupIndividual,
					nonce
				},
				udpPort
			};
		}
		/**
		* Return an object containing the 6to4 properties of the address
		* @memberof Address6
		* @instance
		* @returns {Object}
		*/
		inspect6to4() {
			const prefix = this.getBitsBase16(0, 16);
			const gateway = ipv4_1.Address4.fromHex(this.getBitsBase16(16, 48));
			return {
				prefix: prefix.slice(0, 4),
				gateway: gateway.address
			};
		}
		/**
		* Return a v6 6to4 address from a v6 v4inv6 address
		* @memberof Address6
		* @instance
		* @returns {Address6}
		*/
		to6to4() {
			if (!this.is4()) return null;
			const addr6to4 = [
				"2002",
				this.getBitsBase16(96, 112),
				this.getBitsBase16(112, 128),
				"",
				"/16"
			].join(":");
			return new Address6(addr6to4);
		}
		/**
		* Return a byte array
		* @memberof Address6
		* @instance
		* @returns {Array}
		*/
		toByteArray() {
			const valueWithoutPadding = this.bigInt().toString(16);
			const value = `${"0".repeat(valueWithoutPadding.length % 2)}${valueWithoutPadding}`;
			const bytes = [];
			for (let i = 0, length = value.length; i < length; i += 2) bytes.push(parseInt(value.substring(i, i + 2), 16));
			return bytes;
		}
		/**
		* Return an unsigned byte array
		* @memberof Address6
		* @instance
		* @returns {Array}
		*/
		toUnsignedByteArray() {
			return this.toByteArray().map(unsignByte);
		}
		/**
		* Convert a byte array to an Address6 object
		* @memberof Address6
		* @static
		* @returns {Address6}
		*/
		static fromByteArray(bytes) {
			return this.fromUnsignedByteArray(bytes.map(unsignByte));
		}
		/**
		* Convert an unsigned byte array to an Address6 object
		* @memberof Address6
		* @static
		* @returns {Address6}
		*/
		static fromUnsignedByteArray(bytes) {
			const BYTE_MAX = BigInt("256");
			let result = BigInt("0");
			let multiplier = BigInt("1");
			for (let i = bytes.length - 1; i >= 0; i--) {
				result += multiplier * BigInt(bytes[i].toString(10));
				multiplier *= BYTE_MAX;
			}
			return Address6.fromBigInt(result);
		}
		/**
		* Returns true if the address is in the canonical form, false otherwise
		* @memberof Address6
		* @instance
		* @returns {boolean}
		*/
		isCanonical() {
			return this.addressMinusSuffix === this.canonicalForm();
		}
		/**
		* Returns true if the address is a link local address, false otherwise
		* @memberof Address6
		* @instance
		* @returns {boolean}
		*/
		isLinkLocal() {
			if (this.getBitsBase2(0, 64) === "1111111010000000000000000000000000000000000000000000000000000000") return true;
			return false;
		}
		/**
		* Returns true if the address is a multicast address, false otherwise
		* @memberof Address6
		* @instance
		* @returns {boolean}
		*/
		isMulticast() {
			return this.getType() === "Multicast";
		}
		/**
		* Returns true if the address is a v4-in-v6 address, false otherwise
		* @memberof Address6
		* @instance
		* @returns {boolean}
		*/
		is4() {
			return this.v4;
		}
		/**
		* Returns true if the address is a Teredo address, false otherwise
		* @memberof Address6
		* @instance
		* @returns {boolean}
		*/
		isTeredo() {
			return this.isInSubnet(new Address6("2001::/32"));
		}
		/**
		* Returns true if the address is a 6to4 address, false otherwise
		* @memberof Address6
		* @instance
		* @returns {boolean}
		*/
		is6to4() {
			return this.isInSubnet(new Address6("2002::/16"));
		}
		/**
		* Returns true if the address is a loopback address, false otherwise
		* @memberof Address6
		* @instance
		* @returns {boolean}
		*/
		isLoopback() {
			return this.getType() === "Loopback";
		}
		/**
		* @returns {String} the address in link form with a default port of 80
		*/
		href(optionalPort) {
			if (optionalPort === void 0) optionalPort = "";
			else optionalPort = `:${optionalPort}`;
			return `http://[${this.correctForm()}]${optionalPort}/`;
		}
		/**
		* @returns {String} a link suitable for conveying the address via a URL hash
		*/
		link(options) {
			if (!options) options = {};
			if (options.className === void 0) options.className = "";
			if (options.prefix === void 0) options.prefix = "/#address=";
			if (options.v4 === void 0) options.v4 = false;
			let formFunction = this.correctForm;
			if (options.v4) formFunction = this.to4in6;
			const form = formFunction.call(this);
			if (options.className) return `<a href="${options.prefix}${form}" class="${options.className}">${form}</a>`;
			return `<a href="${options.prefix}${form}">${form}</a>`;
		}
		/**
		* Groups an address
		* @returns {String}
		*/
		group() {
			if (this.elidedGroups === 0) return helpers.simpleGroup(this.address).join(":");
			assert(typeof this.elidedGroups === "number");
			assert(typeof this.elisionBegin === "number");
			const output = [];
			const [left, right] = this.address.split("::");
			if (left.length) output.push(...helpers.simpleGroup(left));
			else output.push("");
			const classes = ["hover-group"];
			for (let i = this.elisionBegin; i < this.elisionBegin + this.elidedGroups; i++) classes.push(`group-${i}`);
			output.push(`<span class="${classes.join(" ")}"></span>`);
			if (right.length) output.push(...helpers.simpleGroup(right, this.elisionEnd));
			else output.push("");
			if (this.is4()) {
				assert(this.address4 instanceof ipv4_1.Address4);
				output.pop();
				output.push(this.address4.groupForV6());
			}
			return output.join(":");
		}
		/**
		* Generate a regular expression string that can be used to find or validate
		* all variations of this address
		* @memberof Address6
		* @instance
		* @param {boolean} substringSearch
		* @returns {string}
		*/
		regularExpressionString(substringSearch = false) {
			let output = [];
			const address6 = new Address6(this.correctForm());
			if (address6.elidedGroups === 0) output.push((0, regular_expressions_1.simpleRegularExpression)(address6.parsedAddress));
			else if (address6.elidedGroups === constants6.GROUPS) output.push((0, regular_expressions_1.possibleElisions)(constants6.GROUPS));
			else {
				const halves = address6.address.split("::");
				if (halves[0].length) output.push((0, regular_expressions_1.simpleRegularExpression)(halves[0].split(":")));
				assert(typeof address6.elidedGroups === "number");
				output.push((0, regular_expressions_1.possibleElisions)(address6.elidedGroups, halves[0].length !== 0, halves[1].length !== 0));
				if (halves[1].length) output.push((0, regular_expressions_1.simpleRegularExpression)(halves[1].split(":")));
				output = [output.join(":")];
			}
			if (!substringSearch) output = [
				"(?=^|",
				regular_expressions_1.ADDRESS_BOUNDARY,
				"|[^\\w\\:])(",
				...output,
				")(?=[^\\w\\:]|",
				regular_expressions_1.ADDRESS_BOUNDARY,
				"|$)"
			];
			return output.join("");
		}
		/**
		* Generate a regular expression that can be used to find or validate all
		* variations of this address.
		* @memberof Address6
		* @instance
		* @param {boolean} substringSearch
		* @returns {RegExp}
		*/
		regularExpression(substringSearch = false) {
			return new RegExp(this.regularExpressionString(substringSearch), "i");
		}
	};
}));
//#endregion
//#region node_modules/ip-address/dist/ip-address.js
var require_ip_address = /* @__PURE__ */ __commonJSMin(((exports) => {
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
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.v6 = exports.AddressError = exports.Address6 = exports.Address4 = void 0;
	var ipv4_1 = require_ipv4();
	Object.defineProperty(exports, "Address4", {
		enumerable: true,
		get: function() {
			return ipv4_1.Address4;
		}
	});
	var ipv6_1 = require_ipv6();
	Object.defineProperty(exports, "Address6", {
		enumerable: true,
		get: function() {
			return ipv6_1.Address6;
		}
	});
	var address_error_1 = require_address_error();
	Object.defineProperty(exports, "AddressError", {
		enumerable: true,
		get: function() {
			return address_error_1.AddressError;
		}
	});
	exports.v6 = { helpers: __importStar(require_helpers()) };
}));
//#endregion
export { require_ip_address as t };
