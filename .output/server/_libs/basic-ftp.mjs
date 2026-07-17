import { fileURLToPath as __eveFileURLToPath } from "node:url";
import { dirname as __eveDirname } from "node:path";
__eveDirname(__eveFileURLToPath(import.meta.url));
import { a as __require, t as __commonJSMin } from "../_runtime.mjs";
//#region node_modules/basic-ftp/dist/parseControlResponse.js
var require_parseControlResponse = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.parseControlResponse = parseControlResponse;
	exports.isSingleLine = isSingleLine;
	exports.isMultiline = isMultiline;
	exports.positiveCompletion = positiveCompletion;
	exports.positiveIntermediate = positiveIntermediate;
	const LF = "\n";
	/**
	* Parse an FTP control response as a collection of messages. A message is a complete
	* single- or multiline response. A response can also contain multiple multiline responses
	* that will each be represented by a message. A response can also be incomplete
	* and be completed on the next incoming data chunk for which case this function also
	* describes a `rest`. This function converts all CRLF to LF.
	*/
	function parseControlResponse(text) {
		const lines = text.split(/\r?\n/).filter(isNotBlank);
		const messages = [];
		let startAt = 0;
		let tokenRegex;
		for (let i = 0; i < lines.length; i++) {
			const line = lines[i];
			if (!tokenRegex) {
				if (isMultiline(line)) {
					const token = line.substr(0, 3);
					tokenRegex = new RegExp(`^${token}(?:$| )`);
					startAt = i;
				} else if (isSingleLine(line)) messages.push(line);
			} else if (tokenRegex.test(line)) {
				tokenRegex = void 0;
				messages.push(lines.slice(startAt, i + 1).join(LF));
			}
		}
		return {
			messages,
			rest: tokenRegex ? lines.slice(startAt).join(LF) + LF : ""
		};
	}
	function isSingleLine(line) {
		return /^\d\d\d(?:$| )/.test(line);
	}
	function isMultiline(line) {
		return /^\d\d\d-/.test(line);
	}
	/**
	* Return true if an FTP return code describes a positive completion.
	*/
	function positiveCompletion(code) {
		return code >= 200 && code < 300;
	}
	/**
	* Return true if an FTP return code describes a positive intermediate response.
	*/
	function positiveIntermediate(code) {
		return code >= 300 && code < 400;
	}
	function isNotBlank(str) {
		return str.trim() !== "";
	}
}));
//#endregion
//#region node_modules/basic-ftp/dist/FtpContext.js
var require_FtpContext = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.FTPContext = exports.FTPError = void 0;
	const net_1 = __require("net");
	const parseControlResponse_1 = require_parseControlResponse();
	/**
	* Describes an FTP server error response including the FTP response code.
	*/
	var FTPError = class extends Error {
		constructor(res) {
			super(res.message);
			this.name = this.constructor.name;
			this.code = res.code;
		}
	};
	exports.FTPError = FTPError;
	function doNothing() {
		/** Do nothing */
	}
	/**
	* FTPContext holds the control and data sockets of an FTP connection and provides a
	* simplified way to interact with an FTP server, handle responses, errors and timeouts.
	*
	* It doesn't implement or use any FTP commands. It's only a foundation to make writing an FTP
	* client as easy as possible. You won't usually instantiate this, but use `Client`.
	*/
	var FTPContext = class {
		/**
		* Instantiate an FTP context.
		*
		* @param timeout - Timeout in milliseconds to apply to control and data connections. Use 0 for no timeout.
		* @param encoding - Encoding to use for control connection. UTF-8 by default. Use "latin1" for older servers.
		*/
		constructor(timeout = 0, encoding = "utf8") {
			this.timeout = timeout;
			/** Debug-level logging of all socket communication. */
			this.verbose = false;
			/** IP version to prefer (4: IPv4, 6: IPv6, undefined: automatic). */
			this.ipFamily = void 0;
			/** Options for TLS connections. */
			this.tlsOptions = {};
			/** A multiline response might be received as multiple chunks. */
			this._partialResponse = "";
			this._encoding = encoding;
			this._socket = this.socket = this._newSocket();
			this._dataSocket = void 0;
		}
		/**
		* Close the context.
		*/
		close() {
			const message = this._task ? "User closed client during task" : "User closed client";
			const err = new Error(message);
			this.closeWithError(err);
		}
		/**
		* Close the context with an error.
		*/
		closeWithError(err) {
			if (this._closingError) return;
			this._closingError = err;
			this._closeControlSocket();
			this._closeSocket(this._dataSocket);
			this._passToHandler(err);
			this._stopTrackingTask();
		}
		/**
		* Returns true if this context has been closed or hasn't been connected yet. You can reopen it with `access`.
		*/
		get closed() {
			return this.socket.remoteAddress === void 0 || this._closingError !== void 0;
		}
		/**
		* Reset this contex and all of its state.
		*/
		reset() {
			this.socket = this._newSocket();
		}
		/**
		* Get the FTP control socket.
		*/
		get socket() {
			return this._socket;
		}
		/**
		* Set the socket for the control connection. This will only close the current control socket
		* if the new one is not an upgrade to the current one.
		*/
		set socket(socket) {
			this.dataSocket = void 0;
			this.tlsOptions = {};
			this._partialResponse = "";
			if (this._socket) if (socket.localPort === this._socket.localPort) this._removeSocketListeners(this.socket);
			else this._closeControlSocket();
			if (socket) {
				this._closingError = void 0;
				socket.setTimeout(0);
				socket.setEncoding(this._encoding);
				socket.setKeepAlive(true);
				socket.on("data", (data) => this._onControlSocketData(data));
				socket.on("end", () => this.closeWithError(/* @__PURE__ */ new Error("Server sent FIN packet unexpectedly, closing connection.")));
				socket.on("close", (hadError) => {
					if (!hadError) this.closeWithError(/* @__PURE__ */ new Error("Server closed connection unexpectedly."));
				});
				this._setupDefaultErrorHandlers(socket, "control socket");
			}
			this._socket = socket;
		}
		/**
		* Get the current FTP data connection if present.
		*/
		get dataSocket() {
			return this._dataSocket;
		}
		/**
		* Set the socket for the data connection. This will automatically close the former data socket.
		*/
		set dataSocket(socket) {
			this._closeSocket(this._dataSocket);
			if (socket) {
				socket.setTimeout(0);
				this._setupDefaultErrorHandlers(socket, "data socket");
			}
			this._dataSocket = socket;
		}
		/**
		* Get the currently used encoding.
		*/
		get encoding() {
			return this._encoding;
		}
		/**
		* Set the encoding used for the control socket.
		*
		* See https://nodejs.org/api/buffer.html#buffer_buffers_and_character_encodings for what encodings
		* are supported by Node.
		*/
		set encoding(encoding) {
			this._encoding = encoding;
			if (this.socket) this.socket.setEncoding(encoding);
		}
		/**
		* Send an FTP command without waiting for or handling the result.
		*/
		send(command) {
			if (/[\r\n\0]/.test(command)) throw new Error(`Invalid command: Contains control characters. (${command})`);
			const message = command.startsWith("PASS") ? "> PASS ###" : `> ${command}`;
			this.log(message);
			this._socket.write(command + "\r\n", this.encoding);
		}
		/**
		* Send an FTP command and handle the first response. Use this if you have a simple
		* request-response situation.
		*/
		request(command) {
			return this.handle(command, (res, task) => {
				if (res instanceof Error) task.reject(res);
				else task.resolve(res);
			});
		}
		/**
		* Send an FTP command and handle any response until you resolve/reject. Use this if you expect multiple responses
		* to a request. This returns a Promise that will hold whatever the response handler passed on when resolving/rejecting its task.
		*/
		handle(command, responseHandler) {
			if (this._task) {
				const err = /* @__PURE__ */ new Error("User launched a task while another one is still running. Forgot to use 'await' or '.then()'?");
				err.stack += `\nRunning task launched at: ${this._task.stack}`;
				this.closeWithError(err);
			}
			return new Promise((resolveTask, rejectTask) => {
				this._task = {
					stack: (/* @__PURE__ */ new Error()).stack || "Unknown call stack",
					responseHandler,
					resolver: {
						resolve: (arg) => {
							this._stopTrackingTask();
							resolveTask(arg);
						},
						reject: (err) => {
							this._stopTrackingTask();
							rejectTask(err);
						}
					}
				};
				if (this._closingError) {
					const err = /* @__PURE__ */ new Error(`Client is closed because ${this._closingError.message}`);
					err.stack += `\nClosing reason: ${this._closingError.stack}`;
					err.code = this._closingError.code !== void 0 ? this._closingError.code : "0";
					this._passToHandler(err);
					return;
				}
				this.socket.setTimeout(this.timeout);
				if (command) this.send(command);
			});
		}
		/**
		* Log message if set to be verbose.
		*/
		log(message) {
			if (this.verbose) console.log(message);
		}
		/**
		* Return true if the control socket is using TLS. This does not mean that a session
		* has already been negotiated.
		*/
		get hasTLS() {
			return "encrypted" in this._socket;
		}
		/**
		* Removes reference to current task and handler. This won't resolve or reject the task.
		* @protected
		*/
		_stopTrackingTask() {
			this.socket.setTimeout(0);
			this._task = void 0;
		}
		/**
		* Handle incoming data on the control socket. The chunk is going to be of type `string`
		* because we let `socket` handle encoding with `setEncoding`.
		* @protected
		*/
		_onControlSocketData(chunk) {
			this.log(`< ${chunk}`);
			const completeResponse = this._partialResponse + chunk;
			const parsed = (0, parseControlResponse_1.parseControlResponse)(completeResponse);
			this._partialResponse = parsed.rest;
			for (const message of parsed.messages) {
				const code = parseInt(message.substr(0, 3), 10);
				const response = {
					code,
					message
				};
				const err = code >= 400 ? new FTPError(response) : void 0;
				this._passToHandler(err ? err : response);
			}
		}
		/**
		* Send the current handler a response. This is usually a control socket response
		* or a socket event, like an error or timeout.
		* @protected
		*/
		_passToHandler(response) {
			if (this._task) this._task.responseHandler(response, this._task.resolver);
		}
		/**
		* Setup all error handlers for a socket.
		* @protected
		*/
		_setupDefaultErrorHandlers(socket, identifier) {
			socket.once("error", (error) => {
				error.message += ` (${identifier})`;
				this.closeWithError(error);
			});
			socket.once("close", (hadError) => {
				if (hadError) this.closeWithError(/* @__PURE__ */ new Error(`Socket closed due to transmission error (${identifier})`));
			});
			socket.once("timeout", () => {
				socket.destroy();
				this.closeWithError(/* @__PURE__ */ new Error(`Timeout (${identifier})`));
			});
		}
		/**
		* Close the control socket. Sends QUIT, then FIN, and ignores any response or error.
		*/
		_closeControlSocket() {
			this._removeSocketListeners(this._socket);
			this._socket.on("error", doNothing);
			this.send("QUIT");
			this._closeSocket(this._socket);
		}
		/**
		* Close a socket, ignores any error.
		* @protected
		*/
		_closeSocket(socket) {
			if (socket) {
				this._removeSocketListeners(socket);
				socket.on("error", doNothing);
				socket.destroy();
			}
		}
		/**
		* Remove all default listeners for socket.
		* @protected
		*/
		_removeSocketListeners(socket) {
			socket.removeAllListeners();
			socket.removeAllListeners("timeout");
			socket.removeAllListeners("data");
			socket.removeAllListeners("end");
			socket.removeAllListeners("error");
			socket.removeAllListeners("close");
			socket.removeAllListeners("connect");
		}
		/**
		* Provide a new socket instance.
		*
		* Internal use only, replaced for unit tests.
		*/
		_newSocket() {
			return new net_1.Socket();
		}
	};
	exports.FTPContext = FTPContext;
}));
//#endregion
//#region node_modules/basic-ftp/dist/FileInfo.js
var require_FileInfo = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.FileInfo = exports.FileType = void 0;
	var FileType;
	(function(FileType) {
		FileType[FileType["Unknown"] = 0] = "Unknown";
		FileType[FileType["File"] = 1] = "File";
		FileType[FileType["Directory"] = 2] = "Directory";
		FileType[FileType["SymbolicLink"] = 3] = "SymbolicLink";
	})(FileType || (exports.FileType = FileType = {}));
	/**
	* Describes a file, directory or symbolic link.
	*/
	var FileInfo = class {
		constructor(name) {
			this.name = name;
			this.type = FileType.Unknown;
			this.size = 0;
			/**
			* Unparsed, raw modification date as a string.
			*
			* If `modifiedAt` is undefined, the FTP server you're connected to doesn't support the more modern
			* MLSD command for machine-readable directory listings. The older command LIST is then used returning
			* results that vary a lot between servers as the format hasn't been standardized. Here, directory listings
			* and especially modification dates were meant to be human-readable first.
			*
			* Be careful when still trying to parse this by yourself. Parsing dates from listings using LIST is
			* unreliable. This library decides to offer parsed dates only when they're absolutely reliable and safe to
			* use e.g. for comparisons.
			*/
			this.rawModifiedAt = "";
			/**
			* Parsed modification date.
			*
			* Available if the FTP server supports the MLSD command. Only MLSD guarantees dates than can be reliably
			* parsed with the correct timezone and a resolution down to seconds. See `rawModifiedAt` property for the unparsed
			* date that is always available.
			*/
			this.modifiedAt = void 0;
			/**
			* Unix permissions if present. If the underlying FTP server is not running on Unix this will be undefined.
			* If set, you might be able to edit permissions with the FTP command `SITE CHMOD`.
			*/
			this.permissions = void 0;
			/**
			* Hard link count if available.
			*/
			this.hardLinkCount = void 0;
			/**
			* Link name for symbolic links if available.
			*/
			this.link = void 0;
			/**
			* Unix group if available.
			*/
			this.group = void 0;
			/**
			* Unix user if available.
			*/
			this.user = void 0;
			/**
			* Unique ID if available.
			*/
			this.uniqueID = void 0;
			this.name = name;
		}
		get isDirectory() {
			return this.type === FileType.Directory;
		}
		get isSymbolicLink() {
			return this.type === FileType.SymbolicLink;
		}
		get isFile() {
			return this.type === FileType.File;
		}
		/**
		* Deprecated, legacy API. Use `rawModifiedAt` instead.
		* @deprecated
		*/
		get date() {
			return this.rawModifiedAt;
		}
		set date(rawModifiedAt) {
			this.rawModifiedAt = rawModifiedAt;
		}
	};
	exports.FileInfo = FileInfo;
	FileInfo.UnixPermission = {
		Read: 4,
		Write: 2,
		Execute: 1
	};
}));
//#endregion
//#region node_modules/basic-ftp/dist/parseListDOS.js
var require_parseListDOS = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.testLine = testLine;
	exports.parseLine = parseLine;
	exports.transformList = transformList;
	const FileInfo_1 = require_FileInfo();
	/**
	* This parser is based on the FTP client library source code in Apache Commons Net provided
	* under the Apache 2.0 license. It has been simplified and rewritten to better fit the Javascript language.
	*
	* https://github.com/apache/commons-net/blob/master/src/main/java/org/apache/commons/net/ftp/parser/NTFTPEntryParser.java
	*/
	const RE_LINE = /* @__PURE__ */ new RegExp("(\\S+)\\s+(\\S+)\\s+(?:(<DIR>)|([0-9]+))\\s+(\\S.*)");
	/**
	* Returns true if a given line might be a DOS-style listing.
	*
	* - Example: `12-05-96  05:03PM       <DIR>          myDir`
	*/
	function testLine(line) {
		return /^\d{2}/.test(line) && RE_LINE.test(line);
	}
	/**
	* Parse a single line of a DOS-style directory listing.
	*/
	function parseLine(line) {
		const groups = line.match(RE_LINE);
		if (groups === null) return;
		const name = groups[5];
		if (name === "." || name === "..") return;
		const file = new FileInfo_1.FileInfo(name);
		if (groups[3] === "<DIR>") {
			file.type = FileInfo_1.FileType.Directory;
			file.size = 0;
		} else {
			file.type = FileInfo_1.FileType.File;
			file.size = parseInt(groups[4], 10);
		}
		file.rawModifiedAt = groups[1] + " " + groups[2];
		return file;
	}
	function transformList(files) {
		return files;
	}
}));
//#endregion
//#region node_modules/basic-ftp/dist/parseListUnix.js
var require_parseListUnix = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.testLine = testLine;
	exports.parseLine = parseLine;
	exports.transformList = transformList;
	const FileInfo_1 = require_FileInfo();
	/**
	* This parser is based on the FTP client library source code in Apache Commons Net provided
	* under the Apache 2.0 license. It has been simplified and rewritten to better fit the Javascript language.
	*
	* https://github.com/apache/commons-net/blob/master/src/main/java/org/apache/commons/net/ftp/parser/UnixFTPEntryParser.java
	*
	* Below is the regular expression used by this parser.
	*
	* Permissions:
	*    r   the file is readable
	*    w   the file is writable
	*    x   the file is executable
	*    -   the indicated permission is not granted
	*    L   mandatory locking occurs during access (the set-group-ID bit is
	*        on and the group execution bit is off)
	*    s   the set-user-ID or set-group-ID bit is on, and the corresponding
	*        user or group execution bit is also on
	*    S   undefined bit-state (the set-user-ID bit is on and the user
	*        execution bit is off)
	*    t   the 1000 (octal) bit, or sticky bit, is on [see chmod(1)], and
	*        execution is on
	*    T   the 1000 bit is turned on, and execution is off (undefined bit-
	*        state)
	*    e   z/OS external link bit
	*    Final letter may be appended:
	*    +   file has extended security attributes (e.g. ACL)
	*    Note: local listings on MacOSX also use '@'
	*    this is not allowed for here as does not appear to be shown by FTP servers
	*    {@code @}   file has extended attributes
	*/
	const RE_LINE = /* @__PURE__ */ new RegExp("([bcdelfmpSs-])(((r|-)(w|-)([xsStTL-]))((r|-)(w|-)([xsStTL-]))((r|-)(w|-)([xsStTL-]?)))\\+?\\s*(\\d+)\\s+(?:(\\S+(?:\\s\\S+)*?)\\s+)?(?:(\\S+(?:\\s\\S+)*)\\s+)?(\\d+(?:,\\s*\\d+)?)\\s+((?:\\d+[-/]\\d+[-/]\\d+)|(?:\\S{3}\\s+\\d{1,2})|(?:\\d{1,2}\\s+\\S{3})|(?:\\d{1,2}月\\s+\\d{1,2}日))\\s+((?:\\d+(?::\\d+)?)|(?:\\d{4}年))\\s(.*)");
	/**
	* Returns true if a given line might be a Unix-style listing.
	*
	* - Example: `-rw-r--r--+   1 patrick  staff   1057 Dec 11 14:35 test.txt`
	*/
	function testLine(line) {
		return RE_LINE.test(line);
	}
	/**
	* Parse a single line of a Unix-style directory listing.
	*/
	function parseLine(line) {
		const groups = line.match(RE_LINE);
		if (groups === null) return;
		const name = groups[21];
		if (name === "." || name === "..") return;
		const file = new FileInfo_1.FileInfo(name);
		file.size = parseInt(groups[18], 10);
		file.user = groups[16];
		file.group = groups[17];
		file.hardLinkCount = parseInt(groups[15], 10);
		file.rawModifiedAt = groups[19] + " " + groups[20];
		file.permissions = {
			user: parseMode(groups[4], groups[5], groups[6]),
			group: parseMode(groups[8], groups[9], groups[10]),
			world: parseMode(groups[12], groups[13], groups[14])
		};
		switch (groups[1].charAt(0)) {
			case "d":
				file.type = FileInfo_1.FileType.Directory;
				break;
			case "e":
				file.type = FileInfo_1.FileType.SymbolicLink;
				break;
			case "l":
				file.type = FileInfo_1.FileType.SymbolicLink;
				break;
			case "b":
			case "c":
				file.type = FileInfo_1.FileType.File;
				break;
			case "f":
			case "-":
				file.type = FileInfo_1.FileType.File;
				break;
			default: file.type = FileInfo_1.FileType.Unknown;
		}
		if (file.isSymbolicLink) {
			const end = name.indexOf(" -> ");
			if (end !== -1) {
				file.name = name.substring(0, end);
				file.link = name.substring(end + 4);
			}
		}
		return file;
	}
	function transformList(files) {
		return files;
	}
	function parseMode(r, w, x) {
		let value = 0;
		if (r !== "-") value += FileInfo_1.FileInfo.UnixPermission.Read;
		if (w !== "-") value += FileInfo_1.FileInfo.UnixPermission.Write;
		const execToken = x.charAt(0);
		if (execToken !== "-" && execToken.toUpperCase() !== execToken) value += FileInfo_1.FileInfo.UnixPermission.Execute;
		return value;
	}
}));
//#endregion
//#region node_modules/basic-ftp/dist/parseListMLSD.js
var require_parseListMLSD = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.testLine = testLine;
	exports.parseLine = parseLine;
	exports.transformList = transformList;
	exports.parseMLSxDate = parseMLSxDate;
	const FileInfo_1 = require_FileInfo();
	function parseSize(value, info) {
		info.size = parseInt(value, 10);
	}
	/**
	* Parsers for MLSD facts.
	*/
	const factHandlersByName = {
		"size": parseSize,
		"sizd": parseSize,
		"unique": (value, info) => {
			info.uniqueID = value;
		},
		"modify": (value, info) => {
			info.modifiedAt = parseMLSxDate(value);
			info.rawModifiedAt = info.modifiedAt.toISOString();
		},
		"type": (value, info) => {
			if (value.startsWith("OS.unix=slink")) {
				info.type = FileInfo_1.FileType.SymbolicLink;
				info.link = value.substr(value.indexOf(":") + 1);
				return 1;
			}
			switch (value) {
				case "file":
					info.type = FileInfo_1.FileType.File;
					break;
				case "dir":
					info.type = FileInfo_1.FileType.Directory;
					break;
				case "OS.unix=symlink":
					info.type = FileInfo_1.FileType.SymbolicLink;
					break;
				case "cdir":
				case "pdir": return 2;
				default: info.type = FileInfo_1.FileType.Unknown;
			}
			return 1;
		},
		"unix.mode": (value, info) => {
			const digits = value.substr(-3);
			info.permissions = {
				user: parseInt(digits[0], 10),
				group: parseInt(digits[1], 10),
				world: parseInt(digits[2], 10)
			};
		},
		"unix.ownername": (value, info) => {
			info.user = value;
		},
		"unix.owner": (value, info) => {
			if (info.user === void 0) info.user = value;
		},
		get "unix.uid"() {
			return this["unix.owner"];
		},
		"unix.groupname": (value, info) => {
			info.group = value;
		},
		"unix.group": (value, info) => {
			if (info.group === void 0) info.group = value;
		},
		get "unix.gid"() {
			return this["unix.group"];
		}
	};
	/**
	* Split a string once at the first position of a delimiter. For example
	* `splitStringOnce("a b c d", " ")` returns `["a", "b c d"]`.
	*/
	function splitStringOnce(str, delimiter) {
		const pos = str.indexOf(delimiter);
		return [str.substr(0, pos), str.substr(pos + delimiter.length)];
	}
	/**
	* Returns true if a given line might be part of an MLSD listing.
	*
	* - Example 1: `size=15227;type=dir;perm=el;modify=20190419065730; test one`
	* - Example 2: ` file name` (leading space)
	*/
	function testLine(line) {
		return /^\S+=\S+;/.test(line) || line.startsWith(" ");
	}
	/**
	* Parse single line as MLSD listing, see specification at https://tools.ietf.org/html/rfc3659#section-7.
	*/
	function parseLine(line) {
		const [packedFacts, name] = splitStringOnce(line, " ");
		if (name === "" || name === "." || name === "..") return;
		const info = new FileInfo_1.FileInfo(name);
		const facts = packedFacts.split(";");
		for (const fact of facts) {
			const [factName, factValue] = splitStringOnce(fact, "=");
			if (!factValue) continue;
			const factHandler = factHandlersByName[factName.toLowerCase()];
			if (!factHandler) continue;
			if (factHandler(factValue, info) === 2) return;
		}
		return info;
	}
	function transformList(files) {
		const nonLinksByID = /* @__PURE__ */ new Map();
		for (const file of files) if (!file.isSymbolicLink && file.uniqueID !== void 0) nonLinksByID.set(file.uniqueID, file);
		const resolvedFiles = [];
		for (const file of files) {
			if (file.isSymbolicLink && file.uniqueID !== void 0 && file.link === void 0) {
				const target = nonLinksByID.get(file.uniqueID);
				if (target !== void 0) file.link = target.name;
			}
			if (!file.name.includes("/")) resolvedFiles.push(file);
		}
		return resolvedFiles;
	}
	/**
	* Parse date as specified in https://tools.ietf.org/html/rfc3659#section-2.3.
	*
	* Message contains response code and modified time in the format: YYYYMMDDHHMMSS[.sss]
	* For example `19991005213102` or `19980615100045.014`.
	*/
	function parseMLSxDate(fact) {
		return new Date(Date.UTC(+fact.slice(0, 4), +fact.slice(4, 6) - 1, +fact.slice(6, 8), +fact.slice(8, 10), +fact.slice(10, 12), +fact.slice(12, 14), +fact.slice(15, 18)));
	}
}));
//#endregion
//#region node_modules/basic-ftp/dist/parseList.js
var require_parseList = /* @__PURE__ */ __commonJSMin(((exports) => {
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
	var __importStar = exports && exports.__importStar || (function() {
		var ownKeys = function(o) {
			ownKeys = Object.getOwnPropertyNames || function(o) {
				var ar = [];
				for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
				return ar;
			};
			return ownKeys(o);
		};
		return function(mod) {
			if (mod && mod.__esModule) return mod;
			var result = {};
			if (mod != null) {
				for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
			}
			__setModuleDefault(result, mod);
			return result;
		};
	})();
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.parseList = parseList;
	/**
	* Available directory listing parsers. These are candidates that will be tested
	* in the order presented. The first candidate will be used to parse the whole list.
	*/
	const availableParsers = [
		__importStar(require_parseListDOS()),
		__importStar(require_parseListUnix()),
		__importStar(require_parseListMLSD())
	];
	function firstCompatibleParser(line, parsers) {
		return parsers.find((parser) => parser.testLine(line) === true);
	}
	function isNotBlank(str) {
		return str.trim() !== "";
	}
	function isNotMeta(str) {
		return !str.startsWith("total");
	}
	const REGEX_NEWLINE = /\r?\n/;
	/**
	* Parse raw directory listing.
	*/
	function parseList(rawList) {
		const lines = rawList.split(REGEX_NEWLINE).filter(isNotBlank).filter(isNotMeta);
		if (lines.length === 0) return [];
		const testLine = lines[lines.length - 1];
		const parser = firstCompatibleParser(testLine, availableParsers);
		if (!parser) throw new Error("This library only supports MLSD, Unix- or DOS-style directory listing. Your FTP server seems to be using another format. You can see the transmitted listing when setting `client.ftp.verbose = true`. You can then provide a custom parser to `client.parseList`, see the documentation for details.");
		const files = lines.map(parser.parseLine).filter((info) => info !== void 0);
		return parser.transformList(files);
	}
}));
//#endregion
//#region node_modules/basic-ftp/dist/ProgressTracker.js
var require_ProgressTracker = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.ProgressTracker = void 0;
	/**
	* Tracks progress of one socket data transfer at a time.
	*/
	var ProgressTracker = class {
		constructor() {
			this.bytesOverall = 0;
			this.intervalMs = 500;
			this.onStop = noop;
			this.onHandle = noop;
		}
		/**
		* Register a new handler for progress info. Use `undefined` to disable reporting.
		*/
		reportTo(onHandle = noop) {
			this.onHandle = onHandle;
		}
		/**
		* Start tracking transfer progress of a socket.
		*
		* @param socket  The socket to observe.
		* @param name  A name associated with this progress tracking, e.g. a filename.
		* @param type  The type of the transfer, typically "upload" or "download".
		*/
		start(socket, name, type) {
			let lastBytes = 0;
			this.onStop = poll(this.intervalMs, () => {
				const bytes = socket.bytesRead + socket.bytesWritten;
				this.bytesOverall += bytes - lastBytes;
				lastBytes = bytes;
				this.onHandle({
					name,
					type,
					bytes,
					bytesOverall: this.bytesOverall
				});
			});
		}
		/**
		* Stop tracking transfer progress.
		*/
		stop() {
			this.onStop(false);
		}
		/**
		* Call the progress handler one more time, then stop tracking.
		*/
		updateAndStop() {
			this.onStop(true);
		}
	};
	exports.ProgressTracker = ProgressTracker;
	/**
	* Starts calling a callback function at a regular interval. The first call will go out
	* immediately. The function returns a function to stop the polling.
	*/
	function poll(intervalMs, updateFunc) {
		const id = setInterval(updateFunc, intervalMs);
		const stopFunc = (stopWithUpdate) => {
			clearInterval(id);
			if (stopWithUpdate) updateFunc();
			updateFunc = noop;
		};
		updateFunc();
		return stopFunc;
	}
	function noop() {}
}));
//#endregion
//#region node_modules/basic-ftp/dist/StringWriter.js
var require_StringWriter = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.StringWriter = void 0;
	const stream_1$1 = __require("stream");
	var StringWriter = class extends stream_1$1.Writable {
		constructor() {
			super(...arguments);
			this.buf = Buffer.alloc(0);
		}
		_write(chunk, _, callback) {
			if (chunk instanceof Buffer) {
				this.buf = Buffer.concat([this.buf, chunk]);
				callback(null);
			} else callback(/* @__PURE__ */ new Error("StringWriter expects chunks of type 'Buffer'."));
		}
		getText(encoding) {
			return this.buf.toString(encoding);
		}
	};
	exports.StringWriter = StringWriter;
}));
//#endregion
//#region node_modules/basic-ftp/dist/netUtils.js
var require_netUtils = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.describeTLS = describeTLS;
	exports.describeAddress = describeAddress;
	exports.upgradeSocket = upgradeSocket;
	exports.ipIsPrivateV4Address = ipIsPrivateV4Address;
	const tls_1$2 = __require("tls");
	/**
	* Returns a string describing the encryption on a given socket instance.
	*/
	function describeTLS(socket) {
		if (socket instanceof tls_1$2.TLSSocket) {
			const protocol = socket.getProtocol();
			return protocol ? protocol : "Server socket or disconnected client socket";
		}
		return "No encryption";
	}
	/**
	* Returns a string describing the remote address of a socket.
	*/
	function describeAddress(socket) {
		if (socket.remoteFamily === "IPv6") return `[${socket.remoteAddress}]:${socket.remotePort}`;
		return `${socket.remoteAddress}:${socket.remotePort}`;
	}
	/**
	* Upgrade a socket connection with TLS.
	*/
	function upgradeSocket(socket, options) {
		return new Promise((resolve, reject) => {
			const tlsOptions = Object.assign({}, options, { socket });
			const tlsSocket = (0, tls_1$2.connect)(tlsOptions, () => {
				if (tlsOptions.rejectUnauthorized !== false && !tlsSocket.authorized) reject(tlsSocket.authorizationError);
				else {
					tlsSocket.removeAllListeners("error");
					resolve(tlsSocket);
				}
			}).once("error", (error) => {
				reject(error);
			});
		});
	}
	/**
	* Returns true if an IP is a private address according to https://tools.ietf.org/html/rfc1918#section-3.
	* This will handle IPv4-mapped IPv6 addresses correctly but return false for all other IPv6 addresses.
	*
	* @param ip  The IP as a string, e.g. "192.168.0.1"
	*/
	function ipIsPrivateV4Address(ip = "") {
		if (ip.startsWith("::ffff:")) ip = ip.substr(7);
		const octets = ip.split(".").map((o) => parseInt(o, 10));
		return octets[0] === 10 || octets[0] === 172 && octets[1] >= 16 && octets[1] <= 31 || octets[0] === 192 && octets[1] === 168 || ip === "127.0.0.1";
	}
}));
//#endregion
//#region node_modules/basic-ftp/dist/transfer.js
var require_transfer = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.enterPassiveModeIPv6 = enterPassiveModeIPv6;
	exports.parseEpsvResponse = parseEpsvResponse;
	exports.enterPassiveModeIPv4 = enterPassiveModeIPv4;
	exports.enterPassiveModeIPv4_forceControlHostIP = enterPassiveModeIPv4_forceControlHostIP;
	exports.parsePasvResponse = parsePasvResponse;
	exports.connectForPassiveTransfer = connectForPassiveTransfer;
	exports.uploadFrom = uploadFrom;
	exports.downloadTo = downloadTo;
	const netUtils_1 = require_netUtils();
	const stream_1 = __require("stream");
	const tls_1$1 = __require("tls");
	const parseControlResponse_1 = require_parseControlResponse();
	/**
	* Prepare a data socket using passive mode over IPv6.
	*/
	async function enterPassiveModeIPv6(ftp) {
		const res = await ftp.request("EPSV");
		const port = parseEpsvResponse(res.message);
		if (!port) throw new Error("Can't parse EPSV response: " + res.message);
		const controlHost = ftp.socket.remoteAddress;
		if (controlHost === void 0) throw new Error("Control socket is disconnected, can't get remote address.");
		await connectForPassiveTransfer(controlHost, port, ftp);
		return res;
	}
	/**
	* Parse an EPSV response. Returns only the port as in EPSV the host of the control connection is used.
	*/
	function parseEpsvResponse(message) {
		const groups = message.match(/[|!]{3}(.+)[|!]/);
		if (groups === null || groups[1] === void 0) throw new Error(`Can't parse response to 'EPSV': ${message}`);
		const port = parseInt(groups[1], 10);
		if (Number.isNaN(port)) throw new Error(`Can't parse response to 'EPSV', port is not a number: ${message}`);
		return port;
	}
	/**
	* Prepare a data socket using passive mode over IPv4.
	*/
	async function enterPassiveModeIPv4(ftp) {
		const res = await ftp.request("PASV");
		const target = parsePasvResponse(res.message);
		if (!target) throw new Error("Can't parse PASV response: " + res.message);
		const controlHost = ftp.socket.remoteAddress;
		if ((0, netUtils_1.ipIsPrivateV4Address)(target.host) && controlHost && !(0, netUtils_1.ipIsPrivateV4Address)(controlHost)) target.host = controlHost;
		await connectForPassiveTransfer(target.host, target.port, ftp);
		return res;
	}
	/**
	* Prepare a data socket using passive mode over IPv4. Ignore the IP provided by the PASV response,
	* and use the control host IP. This is the same behaviour as with the more modern variant EPSV. Use
	* this to fix issues around NAT or provide more security by preventing FTP bounce attacks.
	*/
	async function enterPassiveModeIPv4_forceControlHostIP(ftp) {
		const res = await ftp.request("PASV");
		const target = parsePasvResponse(res.message);
		if (!target) throw new Error("Can't parse PASV response: " + res.message);
		const controlHost = ftp.socket.remoteAddress;
		if (controlHost === void 0) throw new Error("Control socket is disconnected, can't get remote address.");
		await connectForPassiveTransfer(controlHost, target.port, ftp);
		return res;
	}
	/**
	* Parse a PASV response.
	*/
	function parsePasvResponse(message) {
		const groups = message.match(/([-\d]+,[-\d]+,[-\d]+,[-\d]+),([-\d]+),([-\d]+)/);
		if (groups === null || groups.length !== 4) throw new Error(`Can't parse response to 'PASV': ${message}`);
		return {
			host: groups[1].replace(/,/g, "."),
			port: (parseInt(groups[2], 10) & 255) * 256 + (parseInt(groups[3], 10) & 255)
		};
	}
	function connectForPassiveTransfer(host, port, ftp) {
		return new Promise((resolve, reject) => {
			let socket = ftp._newSocket();
			const handleConnErr = function(err) {
				err.message = "Can't open data connection in passive mode: " + err.message;
				reject(err);
			};
			const handleTimeout = function() {
				socket.destroy();
				reject(/* @__PURE__ */ new Error(`Timeout when trying to open data connection to ${host}:${port}`));
			};
			socket.setTimeout(ftp.timeout);
			socket.on("error", handleConnErr);
			socket.on("timeout", handleTimeout);
			socket.connect({
				port,
				host,
				family: ftp.ipFamily
			}, () => {
				if (ftp.socket instanceof tls_1$1.TLSSocket) socket = (0, tls_1$1.connect)(Object.assign({}, ftp.tlsOptions, {
					socket,
					session: ftp.socket.getSession()
				}));
				socket.removeListener("error", handleConnErr);
				socket.removeListener("timeout", handleTimeout);
				ftp.dataSocket = socket;
				resolve();
			});
		});
	}
	/**
	* Helps resolving/rejecting transfers.
	*
	* This is used internally for all FTP transfers. For example when downloading, the server might confirm
	* with "226 Transfer complete" when in fact the download on the data connection has not finished
	* yet. With all transfers we make sure that a) the result arrived and b) has been confirmed by
	* e.g. the control connection. We just don't know in which order this will happen.
	*/
	var TransferResolver = class {
		/**
		* Instantiate a TransferResolver
		*/
		constructor(ftp, progress) {
			this.ftp = ftp;
			this.progress = progress;
			this.response = void 0;
			this.dataTransferDone = false;
		}
		/**
		* Mark the beginning of a transfer.
		*
		* @param name - Name of the transfer, usually the filename.
		* @param type - Type of transfer, usually "upload" or "download".
		*/
		onDataStart(name, type) {
			if (this.ftp.dataSocket === void 0) throw new Error("Data transfer should start but there is no data connection.");
			this.ftp.socket.setTimeout(0);
			this.ftp.dataSocket.setTimeout(this.ftp.timeout);
			this.progress.start(this.ftp.dataSocket, name, type);
		}
		/**
		* The data connection has finished the transfer.
		*/
		onDataDone(task) {
			this.progress.updateAndStop();
			this.ftp.socket.setTimeout(this.ftp.timeout);
			if (this.ftp.dataSocket) this.ftp.dataSocket.setTimeout(0);
			this.dataTransferDone = true;
			this.tryResolve(task);
		}
		/**
		* The control connection reports the transfer as finished.
		*/
		onControlDone(task, response) {
			this.response = response;
			this.tryResolve(task);
		}
		/**
		* An error has been reported and the task should be rejected.
		*/
		onError(task, err) {
			this.progress.updateAndStop();
			this.ftp.socket.setTimeout(this.ftp.timeout);
			this.ftp.dataSocket = void 0;
			task.reject(err);
		}
		/**
		* Control connection sent an unexpected request requiring a response from our part. We
		* can't provide that (because unknown) and have to close the contrext with an error because
		* the FTP server is now caught up in a state we can't resolve.
		*/
		onUnexpectedRequest(response) {
			const err = /* @__PURE__ */ new Error(`Unexpected FTP response is requesting an answer: ${response.message}`);
			this.ftp.closeWithError(err);
		}
		tryResolve(task) {
			if (this.dataTransferDone && this.response !== void 0) {
				this.ftp.dataSocket = void 0;
				task.resolve(this.response);
			}
		}
	};
	function uploadFrom(source, config) {
		const resolver = new TransferResolver(config.ftp, config.tracker);
		const fullCommand = `${config.command} ${config.remotePath}`;
		return config.ftp.handle(fullCommand, (res, task) => {
			if (res instanceof Error) resolver.onError(task, res);
			else if (res.code === 150 || res.code === 125) {
				const dataSocket = config.ftp.dataSocket;
				if (!dataSocket) {
					resolver.onError(task, /* @__PURE__ */ new Error("Upload should begin but no data connection is available."));
					return;
				}
				onConditionOrEvent("getCipher" in dataSocket ? dataSocket.getCipher() !== void 0 : true, dataSocket, "secureConnect", () => {
					config.ftp.log(`Uploading to ${(0, netUtils_1.describeAddress)(dataSocket)} (${(0, netUtils_1.describeTLS)(dataSocket)})`);
					resolver.onDataStart(config.remotePath, config.type);
					(0, stream_1.pipeline)(source, dataSocket, (err) => {
						if (err) resolver.onError(task, err);
						else resolver.onDataDone(task);
					});
				});
			} else if ((0, parseControlResponse_1.positiveCompletion)(res.code)) resolver.onControlDone(task, res);
			else if ((0, parseControlResponse_1.positiveIntermediate)(res.code)) resolver.onUnexpectedRequest(res);
		});
	}
	function downloadTo(destination, config) {
		if (!config.ftp.dataSocket) throw new Error("Download will be initiated but no data connection is available.");
		const resolver = new TransferResolver(config.ftp, config.tracker);
		return config.ftp.handle(config.command, (res, task) => {
			if (res instanceof Error) resolver.onError(task, res);
			else if (res.code === 150 || res.code === 125) {
				const dataSocket = config.ftp.dataSocket;
				if (!dataSocket) {
					resolver.onError(task, /* @__PURE__ */ new Error("Download should begin but no data connection is available."));
					return;
				}
				config.ftp.log(`Downloading from ${(0, netUtils_1.describeAddress)(dataSocket)} (${(0, netUtils_1.describeTLS)(dataSocket)})`);
				resolver.onDataStart(config.remotePath, config.type);
				(0, stream_1.pipeline)(dataSocket, destination, (err) => {
					if (err) resolver.onError(task, err);
					else resolver.onDataDone(task);
				});
			} else if (res.code === 350) config.ftp.send("RETR " + config.remotePath);
			else if ((0, parseControlResponse_1.positiveCompletion)(res.code)) resolver.onControlDone(task, res);
			else if ((0, parseControlResponse_1.positiveIntermediate)(res.code)) resolver.onUnexpectedRequest(res);
		});
	}
	/**
	* Calls a function immediately if a condition is met or subscribes to an event and calls
	* it once the event is emitted.
	*
	* @param condition  The condition to test.
	* @param emitter  The emitter to use if the condition is not met.
	* @param eventName  The event to subscribe to if the condition is not met.
	* @param action  The function to call.
	*/
	function onConditionOrEvent(condition, emitter, eventName, action) {
		if (condition === true) action();
		else emitter.once(eventName, () => action());
	}
}));
//#endregion
//#region node_modules/basic-ftp/dist/Client.js
var require_Client = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.Client = void 0;
	const fs_1 = __require("fs");
	const path_1 = __require("path");
	const tls_1 = __require("tls");
	const util_1 = __require("util");
	const FtpContext_1 = require_FtpContext();
	const parseList_1 = require_parseList();
	const ProgressTracker_1 = require_ProgressTracker();
	const StringWriter_1 = require_StringWriter();
	const parseListMLSD_1 = require_parseListMLSD();
	const netUtils_1 = require_netUtils();
	const transfer_1 = require_transfer();
	const parseControlResponse_1 = require_parseControlResponse();
	const fsReadDir = (0, util_1.promisify)(fs_1.readdir);
	const fsMkDir = (0, util_1.promisify)(fs_1.mkdir);
	const fsStat = (0, util_1.promisify)(fs_1.stat);
	const fsOpen = (0, util_1.promisify)(fs_1.open);
	const fsClose = (0, util_1.promisify)(fs_1.close);
	const fsUnlink = (0, util_1.promisify)(fs_1.unlink);
	const defaultClientOptions = { allowSeparateTransferHost: true };
	const LIST_COMMANDS_DEFAULT = () => ["LIST -a", "LIST"];
	const LIST_COMMANDS_MLSD = () => [
		"MLSD",
		"LIST -a",
		"LIST"
	];
	/**
	* High-level API to interact with an FTP server.
	*/
	var Client = class {
		/**
		* Instantiate an FTP client.
		*
		* @param timeout  Timeout in milliseconds, use 0 for no timeout. Optional, default is 30 seconds.
		*/
		constructor(timeout = 3e4, options = defaultClientOptions) {
			this.availableListCommands = LIST_COMMANDS_DEFAULT();
			this.ftp = new FtpContext_1.FTPContext(timeout);
			this.prepareTransfer = this._enterFirstCompatibleMode([transfer_1.enterPassiveModeIPv6, options.allowSeparateTransferHost ? transfer_1.enterPassiveModeIPv4 : transfer_1.enterPassiveModeIPv4_forceControlHostIP]);
			this.parseList = parseList_1.parseList;
			this._progressTracker = new ProgressTracker_1.ProgressTracker();
		}
		/**
		* Close the client and all open socket connections.
		*
		* Close the client and all open socket connections. The client can’t be used anymore after calling this method,
		* you have to either reconnect with `access` or `connect` or instantiate a new instance to continue any work.
		* A client is also closed automatically if any timeout or connection error occurs.
		*/
		close() {
			this.ftp.close();
			this._progressTracker.stop();
		}
		/**
		* Returns true if the client is closed and can't be used anymore.
		*/
		get closed() {
			return this.ftp.closed;
		}
		/**
		* Connect (or reconnect) to an FTP server.
		*
		* This is an instance method and thus can be called multiple times during the lifecycle of a `Client`
		* instance. Whenever you do, the client is reset with a new control connection. This also implies that
		* you can reopen a `Client` instance that has been closed due to an error when reconnecting with this
		* method. In fact, reconnecting is the only way to continue using a closed `Client`.
		*
		* @param host  Host the client should connect to. Optional, default is "localhost".
		* @param port  Port the client should connect to. Optional, default is 21.
		*/
		connect(host = "localhost", port = 21) {
			this.ftp.reset();
			this.ftp.socket.connect({
				host,
				port,
				family: this.ftp.ipFamily
			}, () => this.ftp.log(`Connected to ${(0, netUtils_1.describeAddress)(this.ftp.socket)} (${(0, netUtils_1.describeTLS)(this.ftp.socket)})`));
			return this._handleConnectResponse();
		}
		/**
		* As `connect` but using implicit TLS. Implicit TLS is not an FTP standard and has been replaced by
		* explicit TLS. There are still FTP servers that support only implicit TLS, though.
		*/
		connectImplicitTLS(host = "localhost", port = 21, tlsOptions = {}) {
			this.ftp.reset();
			this.ftp.socket = (0, tls_1.connect)(port, host, tlsOptions, () => this.ftp.log(`Connected to ${(0, netUtils_1.describeAddress)(this.ftp.socket)} (${(0, netUtils_1.describeTLS)(this.ftp.socket)})`));
			this.ftp.tlsOptions = tlsOptions;
			return this._handleConnectResponse();
		}
		/**
		* Handles the first reponse by an FTP server after the socket connection has been established.
		*/
		_handleConnectResponse() {
			return this.ftp.handle(void 0, (res, task) => {
				if (res instanceof Error) task.reject(res);
				else if ((0, parseControlResponse_1.positiveCompletion)(res.code)) task.resolve(res);
				else task.reject(new FtpContext_1.FTPError(res));
			});
		}
		/**
		* Send an FTP command and handle the first response.
		*/
		send(command, ignoreErrorCodesDEPRECATED = false) {
			if (ignoreErrorCodesDEPRECATED) {
				this.ftp.log("Deprecated call using send(command, flag) with boolean flag to ignore errors. Use sendIgnoringError(command).");
				return this.sendIgnoringError(command);
			}
			return this.ftp.request(command);
		}
		/**
		* Send an FTP command and ignore an FTP error response. Any other kind of error or timeout will still reject the Promise.
		*
		* @param command
		*/
		sendIgnoringError(command) {
			return this.ftp.handle(command, (res, task) => {
				if (res instanceof FtpContext_1.FTPError) task.resolve({
					code: res.code,
					message: res.message
				});
				else if (res instanceof Error) task.reject(res);
				else task.resolve(res);
			});
		}
		/**
		* Upgrade the current socket connection to TLS.
		*
		* @param options  TLS options as in `tls.connect(options)`, optional.
		* @param command  Set the authentication command. Optional, default is "AUTH TLS".
		*/
		async useTLS(options = {}, command = "AUTH TLS") {
			const ret = await this.send(command);
			this.ftp.socket = await (0, netUtils_1.upgradeSocket)(this.ftp.socket, options);
			this.ftp.tlsOptions = options;
			this.ftp.log(`Control socket is using: ${(0, netUtils_1.describeTLS)(this.ftp.socket)}`);
			return ret;
		}
		/**
		* Login a user with a password.
		*
		* @param user  Username to use for login. Optional, default is "anonymous".
		* @param password  Password to use for login. Optional, default is "guest".
		*/
		login(user = "anonymous", password = "guest") {
			this.ftp.log(`Login security: ${(0, netUtils_1.describeTLS)(this.ftp.socket)}`);
			return this.ftp.handle("USER " + user, (res, task) => {
				if (res instanceof Error) task.reject(res);
				else if ((0, parseControlResponse_1.positiveCompletion)(res.code)) task.resolve(res);
				else if (res.code === 331) this.ftp.send("PASS " + password);
				else task.reject(new FtpContext_1.FTPError(res));
			});
		}
		/**
		* Set the usual default settings.
		*
		* Settings used:
		* * Binary mode (TYPE I)
		* * File structure (STRU F)
		* * Additional settings for FTPS (PBSZ 0, PROT P)
		*/
		async useDefaultSettings() {
			const supportsMLSD = (await this.features()).has("MLST");
			this.availableListCommands = supportsMLSD ? LIST_COMMANDS_MLSD() : LIST_COMMANDS_DEFAULT();
			await this.send("TYPE I");
			await this.sendIgnoringError("STRU F");
			await this.sendIgnoringError("OPTS UTF8 ON");
			if (supportsMLSD) await this.sendIgnoringError("OPTS MLST type;size;modify;unique;unix.mode;unix.owner;unix.group;unix.ownername;unix.groupname;");
			if (this.ftp.hasTLS) {
				await this.sendIgnoringError("PBSZ 0");
				await this.sendIgnoringError("PROT P");
			}
		}
		/**
		* Convenience method that calls `connect`, `useTLS`, `login` and `useDefaultSettings`.
		*
		* This is an instance method and thus can be called multiple times during the lifecycle of a `Client`
		* instance. Whenever you do, the client is reset with a new control connection. This also implies that
		* you can reopen a `Client` instance that has been closed due to an error when reconnecting with this
		* method. In fact, reconnecting is the only way to continue using a closed `Client`.
		*/
		async access(options = {}) {
			var _a, _b;
			const useExplicitTLS = options.secure === true;
			const useImplicitTLS = options.secure === "implicit";
			let welcome;
			if (useImplicitTLS) welcome = await this.connectImplicitTLS(options.host, options.port, options.secureOptions);
			else welcome = await this.connect(options.host, options.port);
			if (useExplicitTLS) {
				const secureOptions = (_a = options.secureOptions) !== null && _a !== void 0 ? _a : {};
				secureOptions.host = (_b = secureOptions.host) !== null && _b !== void 0 ? _b : options.host;
				await this.useTLS(secureOptions);
			}
			await this.sendIgnoringError("OPTS UTF8 ON");
			await this.login(options.user, options.password);
			await this.useDefaultSettings();
			return welcome;
		}
		/**
		* Get the current working directory.
		*/
		async pwd() {
			const res = await this.send("PWD");
			const parsed = res.message.match(/"(.+)"/);
			if (parsed === null || parsed[1] === void 0) throw new Error(`Can't parse response to command 'PWD': ${res.message}`);
			return parsed[1];
		}
		/**
		* Get a description of supported features.
		*
		* This sends the FEAT command and parses the result into a Map where keys correspond to available commands
		* and values hold further information. Be aware that your FTP servers might not support this
		* command in which case this method will not throw an exception but just return an empty Map.
		*/
		async features() {
			const res = await this.sendIgnoringError("FEAT");
			const features = /* @__PURE__ */ new Map();
			if (res.code < 400 && (0, parseControlResponse_1.isMultiline)(res.message)) res.message.split("\n").slice(1, -1).forEach((line) => {
				const entry = line.trim().split(" ");
				features.set(entry[0], entry[1] || "");
			});
			return features;
		}
		/**
		* Set the working directory.
		*/
		async cd(path) {
			const validPath = await this.protectWhitespace(path);
			return this.send("CWD " + validPath);
		}
		/**
		* Switch to the parent directory of the working directory.
		*/
		async cdup() {
			return this.send("CDUP");
		}
		/**
		* Get the last modified time of a file. This is not supported by every FTP server, in which case
		* calling this method will throw an exception.
		*/
		async lastMod(path) {
			const validPath = await this.protectWhitespace(path);
			const date = (await this.send(`MDTM ${validPath}`)).message.slice(4);
			return (0, parseListMLSD_1.parseMLSxDate)(date);
		}
		/**
		* Get the size of a file.
		*/
		async size(path) {
			const command = `SIZE ${await this.protectWhitespace(path)}`;
			const res = await this.send(command);
			const size = parseInt(res.message.slice(4), 10);
			if (Number.isNaN(size)) throw new Error(`Can't parse response to command '${command}' as a numerical value: ${res.message}`);
			return size;
		}
		/**
		* Rename a file.
		*
		* Depending on the FTP server this might also be used to move a file from one
		* directory to another by providing full paths.
		*/
		async rename(srcPath, destPath) {
			const validSrc = await this.protectWhitespace(srcPath);
			const validDest = await this.protectWhitespace(destPath);
			await this.send("RNFR " + validSrc);
			return this.send("RNTO " + validDest);
		}
		/**
		* Remove a file from the current working directory.
		*
		* You can ignore FTP error return codes which won't throw an exception if e.g.
		* the file doesn't exist.
		*/
		async remove(path, ignoreErrorCodes = false) {
			const validPath = await this.protectWhitespace(path);
			if (ignoreErrorCodes) return this.sendIgnoringError(`DELE ${validPath}`);
			return this.send(`DELE ${validPath}`);
		}
		/**
		* Report transfer progress for any upload or download to a given handler.
		*
		* This will also reset the overall transfer counter that can be used for multiple transfers. You can
		* also call the function without a handler to stop reporting to an earlier one.
		*
		* @param handler  Handler function to call on transfer progress.
		*/
		trackProgress(handler) {
			this._progressTracker.bytesOverall = 0;
			this._progressTracker.reportTo(handler);
		}
		/**
		* Upload data from a readable stream or a local file to a remote file.
		*
		* @param source  Readable stream or path to a local file.
		* @param toRemotePath  Path to a remote file to write to.
		*/
		async uploadFrom(source, toRemotePath, options = {}) {
			return this._uploadWithCommand(source, toRemotePath, "STOR", options);
		}
		/**
		* Upload data from a readable stream or a local file by appending it to an existing file. If the file doesn't
		* exist the FTP server should create it.
		*
		* @param source  Readable stream or path to a local file.
		* @param toRemotePath  Path to a remote file to write to.
		*/
		async appendFrom(source, toRemotePath, options = {}) {
			return this._uploadWithCommand(source, toRemotePath, "APPE", options);
		}
		/**
		* @protected
		*/
		async _uploadWithCommand(source, remotePath, command, options) {
			if (typeof source === "string") return this._uploadLocalFile(source, remotePath, command, options);
			return this._uploadFromStream(source, remotePath, command);
		}
		/**
		* @protected
		*/
		async _uploadLocalFile(localPath, remotePath, command, options) {
			const fd = await fsOpen(localPath, "r");
			const source = (0, fs_1.createReadStream)("", {
				fd,
				start: options.localStart,
				end: options.localEndInclusive,
				autoClose: false
			});
			try {
				return await this._uploadFromStream(source, remotePath, command);
			} finally {
				await ignoreError(() => fsClose(fd));
			}
		}
		/**
		* @protected
		*/
		async _uploadFromStream(source, remotePath, command) {
			const onError = (err) => this.ftp.closeWithError(err);
			source.once("error", onError);
			try {
				const validPath = await this.protectWhitespace(remotePath);
				await this.prepareTransfer(this.ftp);
				return await (0, transfer_1.uploadFrom)(source, {
					ftp: this.ftp,
					tracker: this._progressTracker,
					command,
					remotePath: validPath,
					type: "upload"
				});
			} finally {
				source.removeListener("error", onError);
			}
		}
		/**
		* Download a remote file and pipe its data to a writable stream or to a local file.
		*
		* You can optionally define at which position of the remote file you'd like to start
		* downloading. If the destination you provide is a file, the offset will be applied
		* to it as well. For example: To resume a failed download, you'd request the size of
		* the local, partially downloaded file and use that as the offset. Assuming the size
		* is 23, you'd download the rest using `downloadTo("local.txt", "remote.txt", 23)`.
		*
		* @param destination  Stream or path for a local file to write to.
		* @param fromRemotePath  Path of the remote file to read from.
		* @param startAt  Position within the remote file to start downloading at. If the destination is a file, this offset is also applied to it.
		*/
		async downloadTo(destination, fromRemotePath, startAt = 0) {
			if (typeof destination === "string") return this._downloadToFile(destination, fromRemotePath, startAt);
			return this._downloadToStream(destination, fromRemotePath, startAt);
		}
		/**
		* @protected
		*/
		async _downloadToFile(localPath, remotePath, startAt) {
			const appendingToLocalFile = startAt > 0;
			const fd = await fsOpen(localPath, appendingToLocalFile ? "r+" : "w");
			const destination = (0, fs_1.createWriteStream)("", {
				fd,
				start: startAt,
				autoClose: false
			});
			try {
				return await this._downloadToStream(destination, remotePath, startAt);
			} catch (err) {
				const localFileStats = await ignoreError(() => fsStat(localPath));
				const hasDownloadedData = localFileStats && localFileStats.size > 0;
				if (!appendingToLocalFile && !hasDownloadedData) await ignoreError(() => fsUnlink(localPath));
				throw err;
			} finally {
				await ignoreError(() => fsClose(fd));
			}
		}
		/**
		* @protected
		*/
		async _downloadToStream(destination, remotePath, startAt) {
			const onError = (err) => this.ftp.closeWithError(err);
			destination.once("error", onError);
			try {
				const validPath = await this.protectWhitespace(remotePath);
				await this.prepareTransfer(this.ftp);
				return await (0, transfer_1.downloadTo)(destination, {
					ftp: this.ftp,
					tracker: this._progressTracker,
					command: startAt > 0 ? `REST ${startAt}` : `RETR ${validPath}`,
					remotePath: validPath,
					type: "download"
				});
			} finally {
				destination.removeListener("error", onError);
				destination.end();
			}
		}
		/**
		* List files and directories in the current working directory, or from `path` if specified.
		*
		* @param [path]  Path to remote file or directory.
		*/
		async list(path = "") {
			const validPath = await this.protectWhitespace(path);
			let lastError;
			for (const candidate of this.availableListCommands) {
				const command = validPath === "" ? candidate : `${candidate} ${validPath}`;
				await this.prepareTransfer(this.ftp);
				try {
					const parsedList = await this._requestListWithCommand(command);
					this.availableListCommands = [candidate];
					return parsedList;
				} catch (err) {
					if (!(err instanceof FtpContext_1.FTPError)) throw err;
					lastError = err;
				}
			}
			throw lastError;
		}
		/**
		* @protected
		*/
		async _requestListWithCommand(command) {
			const buffer = new StringWriter_1.StringWriter();
			await (0, transfer_1.downloadTo)(buffer, {
				ftp: this.ftp,
				tracker: this._progressTracker,
				command,
				remotePath: "",
				type: "list"
			});
			const text = buffer.getText(this.ftp.encoding);
			this.ftp.log(text);
			return this.parseList(text);
		}
		/**
		* Remove a directory and all of its content.
		*
		* @param remoteDirPath  The path of the remote directory to delete.
		* @example client.removeDir("foo") // Remove directory 'foo' using a relative path.
		* @example client.removeDir("foo/bar") // Remove directory 'bar' using a relative path.
		* @example client.removeDir("/foo/bar") // Remove directory 'bar' using an absolute path.
		* @example client.removeDir("/") // Remove everything.
		*/
		async removeDir(remoteDirPath) {
			return this._exitAtCurrentDirectory(async () => {
				await this.cd(remoteDirPath);
				const absoluteDirPath = await this.pwd();
				await this.clearWorkingDir();
				if (!(absoluteDirPath === "/")) {
					await this.cdup();
					await this.removeEmptyDir(absoluteDirPath);
				}
			});
		}
		/**
		* Remove all files and directories in the working directory without removing
		* the working directory itself.
		*/
		async clearWorkingDir() {
			for (const file of await this.list()) if (file.isDirectory) {
				await this.cd(file.name);
				await this.clearWorkingDir();
				await this.cdup();
				await this.removeEmptyDir(file.name);
			} else await this.remove(file.name);
		}
		/**
		* Upload the contents of a local directory to the remote working directory.
		*
		* This will overwrite existing files with the same names and reuse existing directories.
		* Unrelated files and directories will remain untouched. You can optionally provide a `remoteDirPath`
		* to put the contents inside a directory which will be created if necessary including all
		* intermediate directories. If you did provide a remoteDirPath the working directory will stay
		* the same as before calling this method.
		*
		* @param localDirPath  Local path, e.g. "foo/bar" or "../test"
		* @param [remoteDirPath]  Remote path of a directory to upload to. Working directory if undefined.
		*/
		async uploadFromDir(localDirPath, remoteDirPath) {
			return this._exitAtCurrentDirectory(async () => {
				if (remoteDirPath) await this.ensureDir(remoteDirPath);
				return await this._uploadToWorkingDir(localDirPath);
			});
		}
		/**
		* @protected
		*/
		async _uploadToWorkingDir(localDirPath) {
			const files = await fsReadDir(localDirPath);
			for (const file of files) {
				const fullPath = (0, path_1.join)(localDirPath, file);
				const stats = await fsStat(fullPath);
				if (stats.isFile()) await this.uploadFrom(fullPath, file);
				else if (stats.isDirectory()) {
					await this._openDir(file);
					await this._uploadToWorkingDir(fullPath);
					await this.cdup();
				}
			}
		}
		/**
		* Download all files and directories of the working directory to a local directory.
		*
		* @param localDirPath  The local directory to download to.
		* @param remoteDirPath  Remote directory to download. Current working directory if not specified.
		*/
		async downloadToDir(localDirPath, remoteDirPath) {
			return this._exitAtCurrentDirectory(async () => {
				if (remoteDirPath) await this.cd(remoteDirPath);
				return await this._downloadFromWorkingDir(localDirPath);
			});
		}
		/**
		* @protected
		*/
		async _downloadFromWorkingDir(localDirPath) {
			await ensureLocalDirectory(localDirPath);
			for (const file of await this.list()) {
				if (!file.name || (0, path_1.basename)(file.name) !== file.name) {
					const safeName = JSON.stringify(file.name);
					this.ftp.log(`Invalid filename from server listing, will skip file. (${safeName})`);
					continue;
				}
				const localPath = (0, path_1.join)(localDirPath, file.name);
				if (file.isDirectory) {
					await this.cd(file.name);
					await this._downloadFromWorkingDir(localPath);
					await this.cdup();
				} else if (file.isFile) await this.downloadTo(localPath, file.name);
			}
		}
		/**
		* Make sure a given remote path exists, creating all directories as necessary.
		* This function also changes the current working directory to the given path.
		*/
		async ensureDir(remoteDirPath) {
			if (remoteDirPath.startsWith("/")) await this.cd("/");
			const names = remoteDirPath.split("/").filter((name) => name !== "");
			for (const name of names) await this._openDir(name);
		}
		/**
		* Try to create a directory and enter it. This will not raise an exception if the directory
		* couldn't be created if for example it already exists.
		* @protected
		*/
		async _openDir(dirName) {
			await this.sendIgnoringError("MKD " + dirName);
			await this.cd(dirName);
		}
		/**
		* Remove an empty directory, will fail if not empty.
		*/
		async removeEmptyDir(path) {
			const validPath = await this.protectWhitespace(path);
			return this.send(`RMD ${validPath}`);
		}
		/**
		* FTP servers can't handle filenames that have leading whitespace. This method transforms
		* a given path to fix that issue for most cases.
		*/
		async protectWhitespace(path) {
			if (!path.startsWith(" ")) return path;
			const pwd = await this.pwd();
			return (pwd.endsWith("/") ? pwd : pwd + "/") + path;
		}
		async _exitAtCurrentDirectory(func) {
			const userDir = await this.pwd();
			try {
				return await func();
			} finally {
				if (!this.closed) await ignoreError(() => this.cd(userDir));
			}
		}
		/**
		* Try all available transfer strategies and pick the first one that works. Update `client` to
		* use the working strategy for all successive transfer requests.
		*
		* @returns a function that will try the provided strategies.
		*/
		_enterFirstCompatibleMode(strategies) {
			return async (ftp) => {
				ftp.log("Trying to find optimal transfer strategy...");
				let lastError = void 0;
				for (const strategy of strategies) try {
					const res = await strategy(ftp);
					ftp.log("Optimal transfer strategy found.");
					this.prepareTransfer = strategy;
					return res;
				} catch (err) {
					lastError = err;
				}
				throw new Error(`None of the available transfer strategies work. Last error response was '${lastError}'.`);
			};
		}
		/**
		* DEPRECATED, use `uploadFrom`.
		* @deprecated
		*/
		async upload(source, toRemotePath, options = {}) {
			this.ftp.log("Warning: upload() has been deprecated, use uploadFrom().");
			return this.uploadFrom(source, toRemotePath, options);
		}
		/**
		* DEPRECATED, use `appendFrom`.
		* @deprecated
		*/
		async append(source, toRemotePath, options = {}) {
			this.ftp.log("Warning: append() has been deprecated, use appendFrom().");
			return this.appendFrom(source, toRemotePath, options);
		}
		/**
		* DEPRECATED, use `downloadTo`.
		* @deprecated
		*/
		async download(destination, fromRemotePath, startAt = 0) {
			this.ftp.log("Warning: download() has been deprecated, use downloadTo().");
			return this.downloadTo(destination, fromRemotePath, startAt);
		}
		/**
		* DEPRECATED, use `uploadFromDir`.
		* @deprecated
		*/
		async uploadDir(localDirPath, remoteDirPath) {
			this.ftp.log("Warning: uploadDir() has been deprecated, use uploadFromDir().");
			return this.uploadFromDir(localDirPath, remoteDirPath);
		}
		/**
		* DEPRECATED, use `downloadToDir`.
		* @deprecated
		*/
		async downloadDir(localDirPath) {
			this.ftp.log("Warning: downloadDir() has been deprecated, use downloadToDir().");
			return this.downloadToDir(localDirPath);
		}
	};
	exports.Client = Client;
	async function ensureLocalDirectory(path) {
		try {
			await fsStat(path);
		} catch (_a) {
			await fsMkDir(path, { recursive: true });
		}
	}
	async function ignoreError(func) {
		try {
			return await func();
		} catch (_a) {
			return;
		}
	}
}));
//#endregion
//#region node_modules/basic-ftp/dist/StringEncoding.js
var require_StringEncoding = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
}));
//#endregion
//#region node_modules/basic-ftp/dist/index.js
var require_dist = /* @__PURE__ */ __commonJSMin(((exports) => {
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
	exports.enterPassiveModeIPv6 = exports.enterPassiveModeIPv4 = void 0;
	/**
	* Public API
	*/
	__exportStar(require_Client(), exports);
	__exportStar(require_FtpContext(), exports);
	__exportStar(require_FileInfo(), exports);
	__exportStar(require_parseList(), exports);
	__exportStar(require_StringEncoding(), exports);
	var transfer_1 = require_transfer();
	Object.defineProperty(exports, "enterPassiveModeIPv4", {
		enumerable: true,
		get: function() {
			return transfer_1.enterPassiveModeIPv4;
		}
	});
	Object.defineProperty(exports, "enterPassiveModeIPv6", {
		enumerable: true,
		get: function() {
			return transfer_1.enterPassiveModeIPv6;
		}
	});
}));
//#endregion
export { require_dist as t };
