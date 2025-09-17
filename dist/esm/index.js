import { createRequire } from "node:module";
var __create = Object.create;
var __getProtoOf = Object.getPrototypeOf;
var __defProp = Object.defineProperty;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __toESM = (mod, isNodeMode, target) => {
  target = mod != null ? __create(__getProtoOf(mod)) : {};
  const to = isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target;
  for (let key of __getOwnPropNames(mod))
    if (!__hasOwnProp.call(to, key))
      __defProp(to, key, {
        get: () => mod[key],
        enumerable: true
      });
  return to;
};
var __commonJS = (cb, mod) => () => (mod || cb((mod = { exports: {} }).exports, mod), mod.exports);
var __require = /* @__PURE__ */ createRequire(import.meta.url);

// node_modules/esbuild/lib/main.js
var require_main = __commonJS((exports, module) => {
  var __dirname = "/home/ayush/projects/FATE/node_modules/esbuild/lib", __filename = "/home/ayush/projects/FATE/node_modules/esbuild/lib/main.js";
  var __defProp2 = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames2 = Object.getOwnPropertyNames;
  var __hasOwnProp2 = Object.prototype.hasOwnProperty;
  var __export = (target, all) => {
    for (var name in all)
      __defProp2(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames2(from))
        if (!__hasOwnProp2.call(to, key) && key !== except)
          __defProp2(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toCommonJS = (mod) => __copyProps(__defProp2({}, "__esModule", { value: true }), mod);
  var node_exports = {};
  __export(node_exports, {
    analyzeMetafile: () => analyzeMetafile,
    analyzeMetafileSync: () => analyzeMetafileSync,
    build: () => build,
    buildSync: () => buildSync,
    context: () => context,
    default: () => node_default,
    formatMessages: () => formatMessages,
    formatMessagesSync: () => formatMessagesSync,
    initialize: () => initialize,
    stop: () => stop,
    transform: () => transform,
    transformSync: () => transformSync,
    version: () => version
  });
  module.exports = __toCommonJS(node_exports);
  function encodePacket(packet) {
    let visit = (value) => {
      if (value === null) {
        bb.write8(0);
      } else if (typeof value === "boolean") {
        bb.write8(1);
        bb.write8(+value);
      } else if (typeof value === "number") {
        bb.write8(2);
        bb.write32(value | 0);
      } else if (typeof value === "string") {
        bb.write8(3);
        bb.write(encodeUTF8(value));
      } else if (value instanceof Uint8Array) {
        bb.write8(4);
        bb.write(value);
      } else if (value instanceof Array) {
        bb.write8(5);
        bb.write32(value.length);
        for (let item of value) {
          visit(item);
        }
      } else {
        let keys = Object.keys(value);
        bb.write8(6);
        bb.write32(keys.length);
        for (let key of keys) {
          bb.write(encodeUTF8(key));
          visit(value[key]);
        }
      }
    };
    let bb = new ByteBuffer;
    bb.write32(0);
    bb.write32(packet.id << 1 | +!packet.isRequest);
    visit(packet.value);
    writeUInt32LE(bb.buf, bb.len - 4, 0);
    return bb.buf.subarray(0, bb.len);
  }
  function decodePacket(bytes) {
    let visit = () => {
      switch (bb.read8()) {
        case 0:
          return null;
        case 1:
          return !!bb.read8();
        case 2:
          return bb.read32();
        case 3:
          return decodeUTF8(bb.read());
        case 4:
          return bb.read();
        case 5: {
          let count = bb.read32();
          let value2 = [];
          for (let i = 0;i < count; i++) {
            value2.push(visit());
          }
          return value2;
        }
        case 6: {
          let count = bb.read32();
          let value2 = {};
          for (let i = 0;i < count; i++) {
            value2[decodeUTF8(bb.read())] = visit();
          }
          return value2;
        }
        default:
          throw new Error("Invalid packet");
      }
    };
    let bb = new ByteBuffer(bytes);
    let id = bb.read32();
    let isRequest = (id & 1) === 0;
    id >>>= 1;
    let value = visit();
    if (bb.ptr !== bytes.length) {
      throw new Error("Invalid packet");
    }
    return { id, isRequest, value };
  }
  var ByteBuffer = class {
    constructor(buf = new Uint8Array(1024)) {
      this.buf = buf;
      this.len = 0;
      this.ptr = 0;
    }
    _write(delta) {
      if (this.len + delta > this.buf.length) {
        let clone = new Uint8Array((this.len + delta) * 2);
        clone.set(this.buf);
        this.buf = clone;
      }
      this.len += delta;
      return this.len - delta;
    }
    write8(value) {
      let offset = this._write(1);
      this.buf[offset] = value;
    }
    write32(value) {
      let offset = this._write(4);
      writeUInt32LE(this.buf, value, offset);
    }
    write(bytes) {
      let offset = this._write(4 + bytes.length);
      writeUInt32LE(this.buf, bytes.length, offset);
      this.buf.set(bytes, offset + 4);
    }
    _read(delta) {
      if (this.ptr + delta > this.buf.length) {
        throw new Error("Invalid packet");
      }
      this.ptr += delta;
      return this.ptr - delta;
    }
    read8() {
      return this.buf[this._read(1)];
    }
    read32() {
      return readUInt32LE(this.buf, this._read(4));
    }
    read() {
      let length = this.read32();
      let bytes = new Uint8Array(length);
      let ptr = this._read(bytes.length);
      bytes.set(this.buf.subarray(ptr, ptr + length));
      return bytes;
    }
  };
  var encodeUTF8;
  var decodeUTF8;
  var encodeInvariant;
  if (typeof TextEncoder !== "undefined" && typeof TextDecoder !== "undefined") {
    let encoder = new TextEncoder;
    let decoder = new TextDecoder;
    encodeUTF8 = (text) => encoder.encode(text);
    decodeUTF8 = (bytes) => decoder.decode(bytes);
    encodeInvariant = 'new TextEncoder().encode("")';
  } else if (typeof Buffer !== "undefined") {
    encodeUTF8 = (text) => Buffer.from(text);
    decodeUTF8 = (bytes) => {
      let { buffer, byteOffset, byteLength } = bytes;
      return Buffer.from(buffer, byteOffset, byteLength).toString();
    };
    encodeInvariant = 'Buffer.from("")';
  } else {
    throw new Error("No UTF-8 codec found");
  }
  if (!(encodeUTF8("") instanceof Uint8Array))
    throw new Error(`Invariant violation: "${encodeInvariant} instanceof Uint8Array" is incorrectly false

This indicates that your JavaScript environment is broken. You cannot use
esbuild in this environment because esbuild relies on this invariant. This
is not a problem with esbuild. You need to fix your environment instead.
`);
  function readUInt32LE(buffer, offset) {
    return buffer[offset++] | buffer[offset++] << 8 | buffer[offset++] << 16 | buffer[offset++] << 24;
  }
  function writeUInt32LE(buffer, value, offset) {
    buffer[offset++] = value;
    buffer[offset++] = value >> 8;
    buffer[offset++] = value >> 16;
    buffer[offset++] = value >> 24;
  }
  var quote = JSON.stringify;
  var buildLogLevelDefault = "warning";
  var transformLogLevelDefault = "silent";
  function validateAndJoinStringArray(values, what) {
    const toJoin = [];
    for (const value of values) {
      validateStringValue(value, what);
      if (value.indexOf(",") >= 0)
        throw new Error(`Invalid ${what}: ${value}`);
      toJoin.push(value);
    }
    return toJoin.join(",");
  }
  var canBeAnything = () => null;
  var mustBeBoolean = (value) => typeof value === "boolean" ? null : "a boolean";
  var mustBeString = (value) => typeof value === "string" ? null : "a string";
  var mustBeRegExp = (value) => value instanceof RegExp ? null : "a RegExp object";
  var mustBeInteger = (value) => typeof value === "number" && value === (value | 0) ? null : "an integer";
  var mustBeValidPortNumber = (value) => typeof value === "number" && value === (value | 0) && value >= 0 && value <= 65535 ? null : "a valid port number";
  var mustBeFunction = (value) => typeof value === "function" ? null : "a function";
  var mustBeArray = (value) => Array.isArray(value) ? null : "an array";
  var mustBeArrayOfStrings = (value) => Array.isArray(value) && value.every((x) => typeof x === "string") ? null : "an array of strings";
  var mustBeObject = (value) => typeof value === "object" && value !== null && !Array.isArray(value) ? null : "an object";
  var mustBeEntryPoints = (value) => typeof value === "object" && value !== null ? null : "an array or an object";
  var mustBeWebAssemblyModule = (value) => value instanceof WebAssembly.Module ? null : "a WebAssembly.Module";
  var mustBeObjectOrNull = (value) => typeof value === "object" && !Array.isArray(value) ? null : "an object or null";
  var mustBeStringOrBoolean = (value) => typeof value === "string" || typeof value === "boolean" ? null : "a string or a boolean";
  var mustBeStringOrObject = (value) => typeof value === "string" || typeof value === "object" && value !== null && !Array.isArray(value) ? null : "a string or an object";
  var mustBeStringOrArrayOfStrings = (value) => typeof value === "string" || Array.isArray(value) && value.every((x) => typeof x === "string") ? null : "a string or an array of strings";
  var mustBeStringOrUint8Array = (value) => typeof value === "string" || value instanceof Uint8Array ? null : "a string or a Uint8Array";
  var mustBeStringOrURL = (value) => typeof value === "string" || value instanceof URL ? null : "a string or a URL";
  function getFlag(object, keys, key, mustBeFn) {
    let value = object[key];
    keys[key + ""] = true;
    if (value === undefined)
      return;
    let mustBe = mustBeFn(value);
    if (mustBe !== null)
      throw new Error(`${quote(key)} must be ${mustBe}`);
    return value;
  }
  function checkForInvalidFlags(object, keys, where) {
    for (let key in object) {
      if (!(key in keys)) {
        throw new Error(`Invalid option ${where}: ${quote(key)}`);
      }
    }
  }
  function validateInitializeOptions(options) {
    let keys = /* @__PURE__ */ Object.create(null);
    let wasmURL = getFlag(options, keys, "wasmURL", mustBeStringOrURL);
    let wasmModule = getFlag(options, keys, "wasmModule", mustBeWebAssemblyModule);
    let worker = getFlag(options, keys, "worker", mustBeBoolean);
    checkForInvalidFlags(options, keys, "in initialize() call");
    return {
      wasmURL,
      wasmModule,
      worker
    };
  }
  function validateMangleCache(mangleCache) {
    let validated;
    if (mangleCache !== undefined) {
      validated = /* @__PURE__ */ Object.create(null);
      for (let key in mangleCache) {
        let value = mangleCache[key];
        if (typeof value === "string" || value === false) {
          validated[key] = value;
        } else {
          throw new Error(`Expected ${quote(key)} in mangle cache to map to either a string or false`);
        }
      }
    }
    return validated;
  }
  function pushLogFlags(flags, options, keys, isTTY2, logLevelDefault) {
    let color = getFlag(options, keys, "color", mustBeBoolean);
    let logLevel = getFlag(options, keys, "logLevel", mustBeString);
    let logLimit = getFlag(options, keys, "logLimit", mustBeInteger);
    if (color !== undefined)
      flags.push(`--color=${color}`);
    else if (isTTY2)
      flags.push(`--color=true`);
    flags.push(`--log-level=${logLevel || logLevelDefault}`);
    flags.push(`--log-limit=${logLimit || 0}`);
  }
  function validateStringValue(value, what, key) {
    if (typeof value !== "string") {
      throw new Error(`Expected value for ${what}${key !== undefined ? " " + quote(key) : ""} to be a string, got ${typeof value} instead`);
    }
    return value;
  }
  function pushCommonFlags(flags, options, keys) {
    let legalComments = getFlag(options, keys, "legalComments", mustBeString);
    let sourceRoot = getFlag(options, keys, "sourceRoot", mustBeString);
    let sourcesContent = getFlag(options, keys, "sourcesContent", mustBeBoolean);
    let target = getFlag(options, keys, "target", mustBeStringOrArrayOfStrings);
    let format = getFlag(options, keys, "format", mustBeString);
    let globalName = getFlag(options, keys, "globalName", mustBeString);
    let mangleProps = getFlag(options, keys, "mangleProps", mustBeRegExp);
    let reserveProps = getFlag(options, keys, "reserveProps", mustBeRegExp);
    let mangleQuoted = getFlag(options, keys, "mangleQuoted", mustBeBoolean);
    let minify = getFlag(options, keys, "minify", mustBeBoolean);
    let minifySyntax = getFlag(options, keys, "minifySyntax", mustBeBoolean);
    let minifyWhitespace = getFlag(options, keys, "minifyWhitespace", mustBeBoolean);
    let minifyIdentifiers = getFlag(options, keys, "minifyIdentifiers", mustBeBoolean);
    let lineLimit = getFlag(options, keys, "lineLimit", mustBeInteger);
    let drop = getFlag(options, keys, "drop", mustBeArrayOfStrings);
    let dropLabels = getFlag(options, keys, "dropLabels", mustBeArrayOfStrings);
    let charset = getFlag(options, keys, "charset", mustBeString);
    let treeShaking = getFlag(options, keys, "treeShaking", mustBeBoolean);
    let ignoreAnnotations = getFlag(options, keys, "ignoreAnnotations", mustBeBoolean);
    let jsx = getFlag(options, keys, "jsx", mustBeString);
    let jsxFactory = getFlag(options, keys, "jsxFactory", mustBeString);
    let jsxFragment = getFlag(options, keys, "jsxFragment", mustBeString);
    let jsxImportSource = getFlag(options, keys, "jsxImportSource", mustBeString);
    let jsxDev = getFlag(options, keys, "jsxDev", mustBeBoolean);
    let jsxSideEffects = getFlag(options, keys, "jsxSideEffects", mustBeBoolean);
    let define = getFlag(options, keys, "define", mustBeObject);
    let logOverride = getFlag(options, keys, "logOverride", mustBeObject);
    let supported = getFlag(options, keys, "supported", mustBeObject);
    let pure = getFlag(options, keys, "pure", mustBeArrayOfStrings);
    let keepNames = getFlag(options, keys, "keepNames", mustBeBoolean);
    let platform = getFlag(options, keys, "platform", mustBeString);
    let tsconfigRaw = getFlag(options, keys, "tsconfigRaw", mustBeStringOrObject);
    let absPaths = getFlag(options, keys, "absPaths", mustBeArrayOfStrings);
    if (legalComments)
      flags.push(`--legal-comments=${legalComments}`);
    if (sourceRoot !== undefined)
      flags.push(`--source-root=${sourceRoot}`);
    if (sourcesContent !== undefined)
      flags.push(`--sources-content=${sourcesContent}`);
    if (target)
      flags.push(`--target=${validateAndJoinStringArray(Array.isArray(target) ? target : [target], "target")}`);
    if (format)
      flags.push(`--format=${format}`);
    if (globalName)
      flags.push(`--global-name=${globalName}`);
    if (platform)
      flags.push(`--platform=${platform}`);
    if (tsconfigRaw)
      flags.push(`--tsconfig-raw=${typeof tsconfigRaw === "string" ? tsconfigRaw : JSON.stringify(tsconfigRaw)}`);
    if (minify)
      flags.push("--minify");
    if (minifySyntax)
      flags.push("--minify-syntax");
    if (minifyWhitespace)
      flags.push("--minify-whitespace");
    if (minifyIdentifiers)
      flags.push("--minify-identifiers");
    if (lineLimit)
      flags.push(`--line-limit=${lineLimit}`);
    if (charset)
      flags.push(`--charset=${charset}`);
    if (treeShaking !== undefined)
      flags.push(`--tree-shaking=${treeShaking}`);
    if (ignoreAnnotations)
      flags.push(`--ignore-annotations`);
    if (drop)
      for (let what of drop)
        flags.push(`--drop:${validateStringValue(what, "drop")}`);
    if (dropLabels)
      flags.push(`--drop-labels=${validateAndJoinStringArray(dropLabels, "drop label")}`);
    if (absPaths)
      flags.push(`--abs-paths=${validateAndJoinStringArray(absPaths, "abs paths")}`);
    if (mangleProps)
      flags.push(`--mangle-props=${jsRegExpToGoRegExp(mangleProps)}`);
    if (reserveProps)
      flags.push(`--reserve-props=${jsRegExpToGoRegExp(reserveProps)}`);
    if (mangleQuoted !== undefined)
      flags.push(`--mangle-quoted=${mangleQuoted}`);
    if (jsx)
      flags.push(`--jsx=${jsx}`);
    if (jsxFactory)
      flags.push(`--jsx-factory=${jsxFactory}`);
    if (jsxFragment)
      flags.push(`--jsx-fragment=${jsxFragment}`);
    if (jsxImportSource)
      flags.push(`--jsx-import-source=${jsxImportSource}`);
    if (jsxDev)
      flags.push(`--jsx-dev`);
    if (jsxSideEffects)
      flags.push(`--jsx-side-effects`);
    if (define) {
      for (let key in define) {
        if (key.indexOf("=") >= 0)
          throw new Error(`Invalid define: ${key}`);
        flags.push(`--define:${key}=${validateStringValue(define[key], "define", key)}`);
      }
    }
    if (logOverride) {
      for (let key in logOverride) {
        if (key.indexOf("=") >= 0)
          throw new Error(`Invalid log override: ${key}`);
        flags.push(`--log-override:${key}=${validateStringValue(logOverride[key], "log override", key)}`);
      }
    }
    if (supported) {
      for (let key in supported) {
        if (key.indexOf("=") >= 0)
          throw new Error(`Invalid supported: ${key}`);
        const value = supported[key];
        if (typeof value !== "boolean")
          throw new Error(`Expected value for supported ${quote(key)} to be a boolean, got ${typeof value} instead`);
        flags.push(`--supported:${key}=${value}`);
      }
    }
    if (pure)
      for (let fn of pure)
        flags.push(`--pure:${validateStringValue(fn, "pure")}`);
    if (keepNames)
      flags.push(`--keep-names`);
  }
  function flagsForBuildOptions(callName, options, isTTY2, logLevelDefault, writeDefault) {
    var _a2;
    let flags = [];
    let entries = [];
    let keys = /* @__PURE__ */ Object.create(null);
    let stdinContents = null;
    let stdinResolveDir = null;
    pushLogFlags(flags, options, keys, isTTY2, logLevelDefault);
    pushCommonFlags(flags, options, keys);
    let sourcemap = getFlag(options, keys, "sourcemap", mustBeStringOrBoolean);
    let bundle = getFlag(options, keys, "bundle", mustBeBoolean);
    let splitting = getFlag(options, keys, "splitting", mustBeBoolean);
    let preserveSymlinks = getFlag(options, keys, "preserveSymlinks", mustBeBoolean);
    let metafile = getFlag(options, keys, "metafile", mustBeBoolean);
    let outfile = getFlag(options, keys, "outfile", mustBeString);
    let outdir = getFlag(options, keys, "outdir", mustBeString);
    let outbase = getFlag(options, keys, "outbase", mustBeString);
    let tsconfig = getFlag(options, keys, "tsconfig", mustBeString);
    let resolveExtensions = getFlag(options, keys, "resolveExtensions", mustBeArrayOfStrings);
    let nodePathsInput = getFlag(options, keys, "nodePaths", mustBeArrayOfStrings);
    let mainFields = getFlag(options, keys, "mainFields", mustBeArrayOfStrings);
    let conditions = getFlag(options, keys, "conditions", mustBeArrayOfStrings);
    let external = getFlag(options, keys, "external", mustBeArrayOfStrings);
    let packages = getFlag(options, keys, "packages", mustBeString);
    let alias = getFlag(options, keys, "alias", mustBeObject);
    let loader = getFlag(options, keys, "loader", mustBeObject);
    let outExtension = getFlag(options, keys, "outExtension", mustBeObject);
    let publicPath = getFlag(options, keys, "publicPath", mustBeString);
    let entryNames = getFlag(options, keys, "entryNames", mustBeString);
    let chunkNames = getFlag(options, keys, "chunkNames", mustBeString);
    let assetNames = getFlag(options, keys, "assetNames", mustBeString);
    let inject = getFlag(options, keys, "inject", mustBeArrayOfStrings);
    let banner = getFlag(options, keys, "banner", mustBeObject);
    let footer = getFlag(options, keys, "footer", mustBeObject);
    let entryPoints = getFlag(options, keys, "entryPoints", mustBeEntryPoints);
    let absWorkingDir = getFlag(options, keys, "absWorkingDir", mustBeString);
    let stdin = getFlag(options, keys, "stdin", mustBeObject);
    let write = (_a2 = getFlag(options, keys, "write", mustBeBoolean)) != null ? _a2 : writeDefault;
    let allowOverwrite = getFlag(options, keys, "allowOverwrite", mustBeBoolean);
    let mangleCache = getFlag(options, keys, "mangleCache", mustBeObject);
    keys.plugins = true;
    checkForInvalidFlags(options, keys, `in ${callName}() call`);
    if (sourcemap)
      flags.push(`--sourcemap${sourcemap === true ? "" : `=${sourcemap}`}`);
    if (bundle)
      flags.push("--bundle");
    if (allowOverwrite)
      flags.push("--allow-overwrite");
    if (splitting)
      flags.push("--splitting");
    if (preserveSymlinks)
      flags.push("--preserve-symlinks");
    if (metafile)
      flags.push(`--metafile`);
    if (outfile)
      flags.push(`--outfile=${outfile}`);
    if (outdir)
      flags.push(`--outdir=${outdir}`);
    if (outbase)
      flags.push(`--outbase=${outbase}`);
    if (tsconfig)
      flags.push(`--tsconfig=${tsconfig}`);
    if (packages)
      flags.push(`--packages=${packages}`);
    if (resolveExtensions)
      flags.push(`--resolve-extensions=${validateAndJoinStringArray(resolveExtensions, "resolve extension")}`);
    if (publicPath)
      flags.push(`--public-path=${publicPath}`);
    if (entryNames)
      flags.push(`--entry-names=${entryNames}`);
    if (chunkNames)
      flags.push(`--chunk-names=${chunkNames}`);
    if (assetNames)
      flags.push(`--asset-names=${assetNames}`);
    if (mainFields)
      flags.push(`--main-fields=${validateAndJoinStringArray(mainFields, "main field")}`);
    if (conditions)
      flags.push(`--conditions=${validateAndJoinStringArray(conditions, "condition")}`);
    if (external)
      for (let name of external)
        flags.push(`--external:${validateStringValue(name, "external")}`);
    if (alias) {
      for (let old in alias) {
        if (old.indexOf("=") >= 0)
          throw new Error(`Invalid package name in alias: ${old}`);
        flags.push(`--alias:${old}=${validateStringValue(alias[old], "alias", old)}`);
      }
    }
    if (banner) {
      for (let type in banner) {
        if (type.indexOf("=") >= 0)
          throw new Error(`Invalid banner file type: ${type}`);
        flags.push(`--banner:${type}=${validateStringValue(banner[type], "banner", type)}`);
      }
    }
    if (footer) {
      for (let type in footer) {
        if (type.indexOf("=") >= 0)
          throw new Error(`Invalid footer file type: ${type}`);
        flags.push(`--footer:${type}=${validateStringValue(footer[type], "footer", type)}`);
      }
    }
    if (inject)
      for (let path3 of inject)
        flags.push(`--inject:${validateStringValue(path3, "inject")}`);
    if (loader) {
      for (let ext in loader) {
        if (ext.indexOf("=") >= 0)
          throw new Error(`Invalid loader extension: ${ext}`);
        flags.push(`--loader:${ext}=${validateStringValue(loader[ext], "loader", ext)}`);
      }
    }
    if (outExtension) {
      for (let ext in outExtension) {
        if (ext.indexOf("=") >= 0)
          throw new Error(`Invalid out extension: ${ext}`);
        flags.push(`--out-extension:${ext}=${validateStringValue(outExtension[ext], "out extension", ext)}`);
      }
    }
    if (entryPoints) {
      if (Array.isArray(entryPoints)) {
        for (let i = 0, n = entryPoints.length;i < n; i++) {
          let entryPoint = entryPoints[i];
          if (typeof entryPoint === "object" && entryPoint !== null) {
            let entryPointKeys = /* @__PURE__ */ Object.create(null);
            let input = getFlag(entryPoint, entryPointKeys, "in", mustBeString);
            let output = getFlag(entryPoint, entryPointKeys, "out", mustBeString);
            checkForInvalidFlags(entryPoint, entryPointKeys, "in entry point at index " + i);
            if (input === undefined)
              throw new Error('Missing property "in" for entry point at index ' + i);
            if (output === undefined)
              throw new Error('Missing property "out" for entry point at index ' + i);
            entries.push([output, input]);
          } else {
            entries.push(["", validateStringValue(entryPoint, "entry point at index " + i)]);
          }
        }
      } else {
        for (let key in entryPoints) {
          entries.push([key, validateStringValue(entryPoints[key], "entry point", key)]);
        }
      }
    }
    if (stdin) {
      let stdinKeys = /* @__PURE__ */ Object.create(null);
      let contents = getFlag(stdin, stdinKeys, "contents", mustBeStringOrUint8Array);
      let resolveDir = getFlag(stdin, stdinKeys, "resolveDir", mustBeString);
      let sourcefile = getFlag(stdin, stdinKeys, "sourcefile", mustBeString);
      let loader2 = getFlag(stdin, stdinKeys, "loader", mustBeString);
      checkForInvalidFlags(stdin, stdinKeys, 'in "stdin" object');
      if (sourcefile)
        flags.push(`--sourcefile=${sourcefile}`);
      if (loader2)
        flags.push(`--loader=${loader2}`);
      if (resolveDir)
        stdinResolveDir = resolveDir;
      if (typeof contents === "string")
        stdinContents = encodeUTF8(contents);
      else if (contents instanceof Uint8Array)
        stdinContents = contents;
    }
    let nodePaths = [];
    if (nodePathsInput) {
      for (let value of nodePathsInput) {
        value += "";
        nodePaths.push(value);
      }
    }
    return {
      entries,
      flags,
      write,
      stdinContents,
      stdinResolveDir,
      absWorkingDir,
      nodePaths,
      mangleCache: validateMangleCache(mangleCache)
    };
  }
  function flagsForTransformOptions(callName, options, isTTY2, logLevelDefault) {
    let flags = [];
    let keys = /* @__PURE__ */ Object.create(null);
    pushLogFlags(flags, options, keys, isTTY2, logLevelDefault);
    pushCommonFlags(flags, options, keys);
    let sourcemap = getFlag(options, keys, "sourcemap", mustBeStringOrBoolean);
    let sourcefile = getFlag(options, keys, "sourcefile", mustBeString);
    let loader = getFlag(options, keys, "loader", mustBeString);
    let banner = getFlag(options, keys, "banner", mustBeString);
    let footer = getFlag(options, keys, "footer", mustBeString);
    let mangleCache = getFlag(options, keys, "mangleCache", mustBeObject);
    checkForInvalidFlags(options, keys, `in ${callName}() call`);
    if (sourcemap)
      flags.push(`--sourcemap=${sourcemap === true ? "external" : sourcemap}`);
    if (sourcefile)
      flags.push(`--sourcefile=${sourcefile}`);
    if (loader)
      flags.push(`--loader=${loader}`);
    if (banner)
      flags.push(`--banner=${banner}`);
    if (footer)
      flags.push(`--footer=${footer}`);
    return {
      flags,
      mangleCache: validateMangleCache(mangleCache)
    };
  }
  function createChannel(streamIn) {
    const requestCallbacksByKey = {};
    const closeData = { didClose: false, reason: "" };
    let responseCallbacks = {};
    let nextRequestID = 0;
    let nextBuildKey = 0;
    let stdout = new Uint8Array(16 * 1024);
    let stdoutUsed = 0;
    let readFromStdout = (chunk) => {
      let limit = stdoutUsed + chunk.length;
      if (limit > stdout.length) {
        let swap = new Uint8Array(limit * 2);
        swap.set(stdout);
        stdout = swap;
      }
      stdout.set(chunk, stdoutUsed);
      stdoutUsed += chunk.length;
      let offset = 0;
      while (offset + 4 <= stdoutUsed) {
        let length = readUInt32LE(stdout, offset);
        if (offset + 4 + length > stdoutUsed) {
          break;
        }
        offset += 4;
        handleIncomingPacket(stdout.subarray(offset, offset + length));
        offset += length;
      }
      if (offset > 0) {
        stdout.copyWithin(0, offset, stdoutUsed);
        stdoutUsed -= offset;
      }
    };
    let afterClose = (error) => {
      closeData.didClose = true;
      if (error)
        closeData.reason = ": " + (error.message || error);
      const text = "The service was stopped" + closeData.reason;
      for (let id in responseCallbacks) {
        responseCallbacks[id](text, null);
      }
      responseCallbacks = {};
    };
    let sendRequest = (refs, value, callback) => {
      if (closeData.didClose)
        return callback("The service is no longer running" + closeData.reason, null);
      let id = nextRequestID++;
      responseCallbacks[id] = (error, response) => {
        try {
          callback(error, response);
        } finally {
          if (refs)
            refs.unref();
        }
      };
      if (refs)
        refs.ref();
      streamIn.writeToStdin(encodePacket({ id, isRequest: true, value }));
    };
    let sendResponse = (id, value) => {
      if (closeData.didClose)
        throw new Error("The service is no longer running" + closeData.reason);
      streamIn.writeToStdin(encodePacket({ id, isRequest: false, value }));
    };
    let handleRequest = async (id, request) => {
      try {
        if (request.command === "ping") {
          sendResponse(id, {});
          return;
        }
        if (typeof request.key === "number") {
          const requestCallbacks = requestCallbacksByKey[request.key];
          if (!requestCallbacks) {
            return;
          }
          const callback = requestCallbacks[request.command];
          if (callback) {
            await callback(id, request);
            return;
          }
        }
        throw new Error(`Invalid command: ` + request.command);
      } catch (e) {
        const errors = [extractErrorMessageV8(e, streamIn, null, undefined, "")];
        try {
          sendResponse(id, { errors });
        } catch {}
      }
    };
    let isFirstPacket = true;
    let handleIncomingPacket = (bytes) => {
      if (isFirstPacket) {
        isFirstPacket = false;
        let binaryVersion = String.fromCharCode(...bytes);
        if (binaryVersion !== "0.25.9") {
          throw new Error(`Cannot start service: Host version "${"0.25.9"}" does not match binary version ${quote(binaryVersion)}`);
        }
        return;
      }
      let packet = decodePacket(bytes);
      if (packet.isRequest) {
        handleRequest(packet.id, packet.value);
      } else {
        let callback = responseCallbacks[packet.id];
        delete responseCallbacks[packet.id];
        if (packet.value.error)
          callback(packet.value.error, {});
        else
          callback(null, packet.value);
      }
    };
    let buildOrContext = ({ callName, refs, options, isTTY: isTTY2, defaultWD: defaultWD2, callback }) => {
      let refCount = 0;
      const buildKey = nextBuildKey++;
      const requestCallbacks = {};
      const buildRefs = {
        ref() {
          if (++refCount === 1) {
            if (refs)
              refs.ref();
          }
        },
        unref() {
          if (--refCount === 0) {
            delete requestCallbacksByKey[buildKey];
            if (refs)
              refs.unref();
          }
        }
      };
      requestCallbacksByKey[buildKey] = requestCallbacks;
      buildRefs.ref();
      buildOrContextImpl(callName, buildKey, sendRequest, sendResponse, buildRefs, streamIn, requestCallbacks, options, isTTY2, defaultWD2, (err, res) => {
        try {
          callback(err, res);
        } finally {
          buildRefs.unref();
        }
      });
    };
    let transform2 = ({ callName, refs, input, options, isTTY: isTTY2, fs: fs3, callback }) => {
      const details = createObjectStash();
      let start = (inputPath) => {
        try {
          if (typeof input !== "string" && !(input instanceof Uint8Array))
            throw new Error('The input to "transform" must be a string or a Uint8Array');
          let {
            flags,
            mangleCache
          } = flagsForTransformOptions(callName, options, isTTY2, transformLogLevelDefault);
          let request = {
            command: "transform",
            flags,
            inputFS: inputPath !== null,
            input: inputPath !== null ? encodeUTF8(inputPath) : typeof input === "string" ? encodeUTF8(input) : input
          };
          if (mangleCache)
            request.mangleCache = mangleCache;
          sendRequest(refs, request, (error, response) => {
            if (error)
              return callback(new Error(error), null);
            let errors = replaceDetailsInMessages(response.errors, details);
            let warnings = replaceDetailsInMessages(response.warnings, details);
            let outstanding = 1;
            let next = () => {
              if (--outstanding === 0) {
                let result = {
                  warnings,
                  code: response.code,
                  map: response.map,
                  mangleCache: undefined,
                  legalComments: undefined
                };
                if ("legalComments" in response)
                  result.legalComments = response == null ? undefined : response.legalComments;
                if (response.mangleCache)
                  result.mangleCache = response == null ? undefined : response.mangleCache;
                callback(null, result);
              }
            };
            if (errors.length > 0)
              return callback(failureErrorWithLog("Transform failed", errors, warnings), null);
            if (response.codeFS) {
              outstanding++;
              fs3.readFile(response.code, (err, contents) => {
                if (err !== null) {
                  callback(err, null);
                } else {
                  response.code = contents;
                  next();
                }
              });
            }
            if (response.mapFS) {
              outstanding++;
              fs3.readFile(response.map, (err, contents) => {
                if (err !== null) {
                  callback(err, null);
                } else {
                  response.map = contents;
                  next();
                }
              });
            }
            next();
          });
        } catch (e) {
          let flags = [];
          try {
            pushLogFlags(flags, options, {}, isTTY2, transformLogLevelDefault);
          } catch {}
          const error = extractErrorMessageV8(e, streamIn, details, undefined, "");
          sendRequest(refs, { command: "error", flags, error }, () => {
            error.detail = details.load(error.detail);
            callback(failureErrorWithLog("Transform failed", [error], []), null);
          });
        }
      };
      if ((typeof input === "string" || input instanceof Uint8Array) && input.length > 1024 * 1024) {
        let next = start;
        start = () => fs3.writeFile(input, next);
      }
      start(null);
    };
    let formatMessages2 = ({ callName, refs, messages, options, callback }) => {
      if (!options)
        throw new Error(`Missing second argument in ${callName}() call`);
      let keys = {};
      let kind = getFlag(options, keys, "kind", mustBeString);
      let color = getFlag(options, keys, "color", mustBeBoolean);
      let terminalWidth = getFlag(options, keys, "terminalWidth", mustBeInteger);
      checkForInvalidFlags(options, keys, `in ${callName}() call`);
      if (kind === undefined)
        throw new Error(`Missing "kind" in ${callName}() call`);
      if (kind !== "error" && kind !== "warning")
        throw new Error(`Expected "kind" to be "error" or "warning" in ${callName}() call`);
      let request = {
        command: "format-msgs",
        messages: sanitizeMessages(messages, "messages", null, "", terminalWidth),
        isWarning: kind === "warning"
      };
      if (color !== undefined)
        request.color = color;
      if (terminalWidth !== undefined)
        request.terminalWidth = terminalWidth;
      sendRequest(refs, request, (error, response) => {
        if (error)
          return callback(new Error(error), null);
        callback(null, response.messages);
      });
    };
    let analyzeMetafile2 = ({ callName, refs, metafile, options, callback }) => {
      if (options === undefined)
        options = {};
      let keys = {};
      let color = getFlag(options, keys, "color", mustBeBoolean);
      let verbose = getFlag(options, keys, "verbose", mustBeBoolean);
      checkForInvalidFlags(options, keys, `in ${callName}() call`);
      let request = {
        command: "analyze-metafile",
        metafile
      };
      if (color !== undefined)
        request.color = color;
      if (verbose !== undefined)
        request.verbose = verbose;
      sendRequest(refs, request, (error, response) => {
        if (error)
          return callback(new Error(error), null);
        callback(null, response.result);
      });
    };
    return {
      readFromStdout,
      afterClose,
      service: {
        buildOrContext,
        transform: transform2,
        formatMessages: formatMessages2,
        analyzeMetafile: analyzeMetafile2
      }
    };
  }
  function buildOrContextImpl(callName, buildKey, sendRequest, sendResponse, refs, streamIn, requestCallbacks, options, isTTY2, defaultWD2, callback) {
    const details = createObjectStash();
    const isContext = callName === "context";
    const handleError = (e, pluginName) => {
      const flags = [];
      try {
        pushLogFlags(flags, options, {}, isTTY2, buildLogLevelDefault);
      } catch {}
      const message = extractErrorMessageV8(e, streamIn, details, undefined, pluginName);
      sendRequest(refs, { command: "error", flags, error: message }, () => {
        message.detail = details.load(message.detail);
        callback(failureErrorWithLog(isContext ? "Context failed" : "Build failed", [message], []), null);
      });
    };
    let plugins;
    if (typeof options === "object") {
      const value = options.plugins;
      if (value !== undefined) {
        if (!Array.isArray(value))
          return handleError(new Error(`"plugins" must be an array`), "");
        plugins = value;
      }
    }
    if (plugins && plugins.length > 0) {
      if (streamIn.isSync)
        return handleError(new Error("Cannot use plugins in synchronous API calls"), "");
      handlePlugins(buildKey, sendRequest, sendResponse, refs, streamIn, requestCallbacks, options, plugins, details).then((result) => {
        if (!result.ok)
          return handleError(result.error, result.pluginName);
        try {
          buildOrContextContinue(result.requestPlugins, result.runOnEndCallbacks, result.scheduleOnDisposeCallbacks);
        } catch (e) {
          handleError(e, "");
        }
      }, (e) => handleError(e, ""));
      return;
    }
    try {
      buildOrContextContinue(null, (result, done) => done([], []), () => {});
    } catch (e) {
      handleError(e, "");
    }
    function buildOrContextContinue(requestPlugins, runOnEndCallbacks, scheduleOnDisposeCallbacks) {
      const writeDefault = streamIn.hasFS;
      const {
        entries,
        flags,
        write,
        stdinContents,
        stdinResolveDir,
        absWorkingDir,
        nodePaths,
        mangleCache
      } = flagsForBuildOptions(callName, options, isTTY2, buildLogLevelDefault, writeDefault);
      if (write && !streamIn.hasFS)
        throw new Error(`The "write" option is unavailable in this environment`);
      const request = {
        command: "build",
        key: buildKey,
        entries,
        flags,
        write,
        stdinContents,
        stdinResolveDir,
        absWorkingDir: absWorkingDir || defaultWD2,
        nodePaths,
        context: isContext
      };
      if (requestPlugins)
        request.plugins = requestPlugins;
      if (mangleCache)
        request.mangleCache = mangleCache;
      const buildResponseToResult = (response, callback2) => {
        const result = {
          errors: replaceDetailsInMessages(response.errors, details),
          warnings: replaceDetailsInMessages(response.warnings, details),
          outputFiles: undefined,
          metafile: undefined,
          mangleCache: undefined
        };
        const originalErrors = result.errors.slice();
        const originalWarnings = result.warnings.slice();
        if (response.outputFiles)
          result.outputFiles = response.outputFiles.map(convertOutputFiles);
        if (response.metafile)
          result.metafile = JSON.parse(response.metafile);
        if (response.mangleCache)
          result.mangleCache = response.mangleCache;
        if (response.writeToStdout !== undefined)
          console.log(decodeUTF8(response.writeToStdout).replace(/\n$/, ""));
        runOnEndCallbacks(result, (onEndErrors, onEndWarnings) => {
          if (originalErrors.length > 0 || onEndErrors.length > 0) {
            const error = failureErrorWithLog("Build failed", originalErrors.concat(onEndErrors), originalWarnings.concat(onEndWarnings));
            return callback2(error, null, onEndErrors, onEndWarnings);
          }
          callback2(null, result, onEndErrors, onEndWarnings);
        });
      };
      let latestResultPromise;
      let provideLatestResult;
      if (isContext)
        requestCallbacks["on-end"] = (id, request2) => new Promise((resolve) => {
          buildResponseToResult(request2, (err, result, onEndErrors, onEndWarnings) => {
            const response = {
              errors: onEndErrors,
              warnings: onEndWarnings
            };
            if (provideLatestResult)
              provideLatestResult(err, result);
            latestResultPromise = undefined;
            provideLatestResult = undefined;
            sendResponse(id, response);
            resolve();
          });
        });
      sendRequest(refs, request, (error, response) => {
        if (error)
          return callback(new Error(error), null);
        if (!isContext) {
          return buildResponseToResult(response, (err, res) => {
            scheduleOnDisposeCallbacks();
            return callback(err, res);
          });
        }
        if (response.errors.length > 0) {
          return callback(failureErrorWithLog("Context failed", response.errors, response.warnings), null);
        }
        let didDispose = false;
        const result = {
          rebuild: () => {
            if (!latestResultPromise)
              latestResultPromise = new Promise((resolve, reject) => {
                let settlePromise;
                provideLatestResult = (err, result2) => {
                  if (!settlePromise)
                    settlePromise = () => err ? reject(err) : resolve(result2);
                };
                const triggerAnotherBuild = () => {
                  const request2 = {
                    command: "rebuild",
                    key: buildKey
                  };
                  sendRequest(refs, request2, (error2, response2) => {
                    if (error2) {
                      reject(new Error(error2));
                    } else if (settlePromise) {
                      settlePromise();
                    } else {
                      triggerAnotherBuild();
                    }
                  });
                };
                triggerAnotherBuild();
              });
            return latestResultPromise;
          },
          watch: (options2 = {}) => new Promise((resolve, reject) => {
            if (!streamIn.hasFS)
              throw new Error(`Cannot use the "watch" API in this environment`);
            const keys = {};
            const delay = getFlag(options2, keys, "delay", mustBeInteger);
            checkForInvalidFlags(options2, keys, `in watch() call`);
            const request2 = {
              command: "watch",
              key: buildKey
            };
            if (delay)
              request2.delay = delay;
            sendRequest(refs, request2, (error2) => {
              if (error2)
                reject(new Error(error2));
              else
                resolve(undefined);
            });
          }),
          serve: (options2 = {}) => new Promise((resolve, reject) => {
            if (!streamIn.hasFS)
              throw new Error(`Cannot use the "serve" API in this environment`);
            const keys = {};
            const port = getFlag(options2, keys, "port", mustBeValidPortNumber);
            const host = getFlag(options2, keys, "host", mustBeString);
            const servedir = getFlag(options2, keys, "servedir", mustBeString);
            const keyfile = getFlag(options2, keys, "keyfile", mustBeString);
            const certfile = getFlag(options2, keys, "certfile", mustBeString);
            const fallback = getFlag(options2, keys, "fallback", mustBeString);
            const cors = getFlag(options2, keys, "cors", mustBeObject);
            const onRequest = getFlag(options2, keys, "onRequest", mustBeFunction);
            checkForInvalidFlags(options2, keys, `in serve() call`);
            const request2 = {
              command: "serve",
              key: buildKey,
              onRequest: !!onRequest
            };
            if (port !== undefined)
              request2.port = port;
            if (host !== undefined)
              request2.host = host;
            if (servedir !== undefined)
              request2.servedir = servedir;
            if (keyfile !== undefined)
              request2.keyfile = keyfile;
            if (certfile !== undefined)
              request2.certfile = certfile;
            if (fallback !== undefined)
              request2.fallback = fallback;
            if (cors) {
              const corsKeys = {};
              const origin = getFlag(cors, corsKeys, "origin", mustBeStringOrArrayOfStrings);
              checkForInvalidFlags(cors, corsKeys, `on "cors" object`);
              if (Array.isArray(origin))
                request2.corsOrigin = origin;
              else if (origin !== undefined)
                request2.corsOrigin = [origin];
            }
            sendRequest(refs, request2, (error2, response2) => {
              if (error2)
                return reject(new Error(error2));
              if (onRequest) {
                requestCallbacks["serve-request"] = (id, request3) => {
                  onRequest(request3.args);
                  sendResponse(id, {});
                };
              }
              resolve(response2);
            });
          }),
          cancel: () => new Promise((resolve) => {
            if (didDispose)
              return resolve();
            const request2 = {
              command: "cancel",
              key: buildKey
            };
            sendRequest(refs, request2, () => {
              resolve();
            });
          }),
          dispose: () => new Promise((resolve) => {
            if (didDispose)
              return resolve();
            didDispose = true;
            const request2 = {
              command: "dispose",
              key: buildKey
            };
            sendRequest(refs, request2, () => {
              resolve();
              scheduleOnDisposeCallbacks();
              refs.unref();
            });
          })
        };
        refs.ref();
        callback(null, result);
      });
    }
  }
  var handlePlugins = async (buildKey, sendRequest, sendResponse, refs, streamIn, requestCallbacks, initialOptions, plugins, details) => {
    let onStartCallbacks = [];
    let onEndCallbacks = [];
    let onResolveCallbacks = {};
    let onLoadCallbacks = {};
    let onDisposeCallbacks = [];
    let nextCallbackID = 0;
    let i = 0;
    let requestPlugins = [];
    let isSetupDone = false;
    plugins = [...plugins];
    for (let item of plugins) {
      let keys = {};
      if (typeof item !== "object")
        throw new Error(`Plugin at index ${i} must be an object`);
      const name = getFlag(item, keys, "name", mustBeString);
      if (typeof name !== "string" || name === "")
        throw new Error(`Plugin at index ${i} is missing a name`);
      try {
        let setup = getFlag(item, keys, "setup", mustBeFunction);
        if (typeof setup !== "function")
          throw new Error(`Plugin is missing a setup function`);
        checkForInvalidFlags(item, keys, `on plugin ${quote(name)}`);
        let plugin = {
          name,
          onStart: false,
          onEnd: false,
          onResolve: [],
          onLoad: []
        };
        i++;
        let resolve = (path3, options = {}) => {
          if (!isSetupDone)
            throw new Error('Cannot call "resolve" before plugin setup has completed');
          if (typeof path3 !== "string")
            throw new Error(`The path to resolve must be a string`);
          let keys2 = /* @__PURE__ */ Object.create(null);
          let pluginName = getFlag(options, keys2, "pluginName", mustBeString);
          let importer = getFlag(options, keys2, "importer", mustBeString);
          let namespace = getFlag(options, keys2, "namespace", mustBeString);
          let resolveDir = getFlag(options, keys2, "resolveDir", mustBeString);
          let kind = getFlag(options, keys2, "kind", mustBeString);
          let pluginData = getFlag(options, keys2, "pluginData", canBeAnything);
          let importAttributes = getFlag(options, keys2, "with", mustBeObject);
          checkForInvalidFlags(options, keys2, "in resolve() call");
          return new Promise((resolve2, reject) => {
            const request = {
              command: "resolve",
              path: path3,
              key: buildKey,
              pluginName: name
            };
            if (pluginName != null)
              request.pluginName = pluginName;
            if (importer != null)
              request.importer = importer;
            if (namespace != null)
              request.namespace = namespace;
            if (resolveDir != null)
              request.resolveDir = resolveDir;
            if (kind != null)
              request.kind = kind;
            else
              throw new Error(`Must specify "kind" when calling "resolve"`);
            if (pluginData != null)
              request.pluginData = details.store(pluginData);
            if (importAttributes != null)
              request.with = sanitizeStringMap(importAttributes, "with");
            sendRequest(refs, request, (error, response) => {
              if (error !== null)
                reject(new Error(error));
              else
                resolve2({
                  errors: replaceDetailsInMessages(response.errors, details),
                  warnings: replaceDetailsInMessages(response.warnings, details),
                  path: response.path,
                  external: response.external,
                  sideEffects: response.sideEffects,
                  namespace: response.namespace,
                  suffix: response.suffix,
                  pluginData: details.load(response.pluginData)
                });
            });
          });
        };
        let promise = setup({
          initialOptions,
          resolve,
          onStart(callback) {
            let registeredText = `This error came from the "onStart" callback registered here:`;
            let registeredNote = extractCallerV8(new Error(registeredText), streamIn, "onStart");
            onStartCallbacks.push({ name, callback, note: registeredNote });
            plugin.onStart = true;
          },
          onEnd(callback) {
            let registeredText = `This error came from the "onEnd" callback registered here:`;
            let registeredNote = extractCallerV8(new Error(registeredText), streamIn, "onEnd");
            onEndCallbacks.push({ name, callback, note: registeredNote });
            plugin.onEnd = true;
          },
          onResolve(options, callback) {
            let registeredText = `This error came from the "onResolve" callback registered here:`;
            let registeredNote = extractCallerV8(new Error(registeredText), streamIn, "onResolve");
            let keys2 = {};
            let filter = getFlag(options, keys2, "filter", mustBeRegExp);
            let namespace = getFlag(options, keys2, "namespace", mustBeString);
            checkForInvalidFlags(options, keys2, `in onResolve() call for plugin ${quote(name)}`);
            if (filter == null)
              throw new Error(`onResolve() call is missing a filter`);
            let id = nextCallbackID++;
            onResolveCallbacks[id] = { name, callback, note: registeredNote };
            plugin.onResolve.push({ id, filter: jsRegExpToGoRegExp(filter), namespace: namespace || "" });
          },
          onLoad(options, callback) {
            let registeredText = `This error came from the "onLoad" callback registered here:`;
            let registeredNote = extractCallerV8(new Error(registeredText), streamIn, "onLoad");
            let keys2 = {};
            let filter = getFlag(options, keys2, "filter", mustBeRegExp);
            let namespace = getFlag(options, keys2, "namespace", mustBeString);
            checkForInvalidFlags(options, keys2, `in onLoad() call for plugin ${quote(name)}`);
            if (filter == null)
              throw new Error(`onLoad() call is missing a filter`);
            let id = nextCallbackID++;
            onLoadCallbacks[id] = { name, callback, note: registeredNote };
            plugin.onLoad.push({ id, filter: jsRegExpToGoRegExp(filter), namespace: namespace || "" });
          },
          onDispose(callback) {
            onDisposeCallbacks.push(callback);
          },
          esbuild: streamIn.esbuild
        });
        if (promise)
          await promise;
        requestPlugins.push(plugin);
      } catch (e) {
        return { ok: false, error: e, pluginName: name };
      }
    }
    requestCallbacks["on-start"] = async (id, request) => {
      details.clear();
      let response = { errors: [], warnings: [] };
      await Promise.all(onStartCallbacks.map(async ({ name, callback, note }) => {
        try {
          let result = await callback();
          if (result != null) {
            if (typeof result !== "object")
              throw new Error(`Expected onStart() callback in plugin ${quote(name)} to return an object`);
            let keys = {};
            let errors = getFlag(result, keys, "errors", mustBeArray);
            let warnings = getFlag(result, keys, "warnings", mustBeArray);
            checkForInvalidFlags(result, keys, `from onStart() callback in plugin ${quote(name)}`);
            if (errors != null)
              response.errors.push(...sanitizeMessages(errors, "errors", details, name, undefined));
            if (warnings != null)
              response.warnings.push(...sanitizeMessages(warnings, "warnings", details, name, undefined));
          }
        } catch (e) {
          response.errors.push(extractErrorMessageV8(e, streamIn, details, note && note(), name));
        }
      }));
      sendResponse(id, response);
    };
    requestCallbacks["on-resolve"] = async (id, request) => {
      let response = {}, name = "", callback, note;
      for (let id2 of request.ids) {
        try {
          ({ name, callback, note } = onResolveCallbacks[id2]);
          let result = await callback({
            path: request.path,
            importer: request.importer,
            namespace: request.namespace,
            resolveDir: request.resolveDir,
            kind: request.kind,
            pluginData: details.load(request.pluginData),
            with: request.with
          });
          if (result != null) {
            if (typeof result !== "object")
              throw new Error(`Expected onResolve() callback in plugin ${quote(name)} to return an object`);
            let keys = {};
            let pluginName = getFlag(result, keys, "pluginName", mustBeString);
            let path3 = getFlag(result, keys, "path", mustBeString);
            let namespace = getFlag(result, keys, "namespace", mustBeString);
            let suffix = getFlag(result, keys, "suffix", mustBeString);
            let external = getFlag(result, keys, "external", mustBeBoolean);
            let sideEffects = getFlag(result, keys, "sideEffects", mustBeBoolean);
            let pluginData = getFlag(result, keys, "pluginData", canBeAnything);
            let errors = getFlag(result, keys, "errors", mustBeArray);
            let warnings = getFlag(result, keys, "warnings", mustBeArray);
            let watchFiles = getFlag(result, keys, "watchFiles", mustBeArrayOfStrings);
            let watchDirs = getFlag(result, keys, "watchDirs", mustBeArrayOfStrings);
            checkForInvalidFlags(result, keys, `from onResolve() callback in plugin ${quote(name)}`);
            response.id = id2;
            if (pluginName != null)
              response.pluginName = pluginName;
            if (path3 != null)
              response.path = path3;
            if (namespace != null)
              response.namespace = namespace;
            if (suffix != null)
              response.suffix = suffix;
            if (external != null)
              response.external = external;
            if (sideEffects != null)
              response.sideEffects = sideEffects;
            if (pluginData != null)
              response.pluginData = details.store(pluginData);
            if (errors != null)
              response.errors = sanitizeMessages(errors, "errors", details, name, undefined);
            if (warnings != null)
              response.warnings = sanitizeMessages(warnings, "warnings", details, name, undefined);
            if (watchFiles != null)
              response.watchFiles = sanitizeStringArray(watchFiles, "watchFiles");
            if (watchDirs != null)
              response.watchDirs = sanitizeStringArray(watchDirs, "watchDirs");
            break;
          }
        } catch (e) {
          response = { id: id2, errors: [extractErrorMessageV8(e, streamIn, details, note && note(), name)] };
          break;
        }
      }
      sendResponse(id, response);
    };
    requestCallbacks["on-load"] = async (id, request) => {
      let response = {}, name = "", callback, note;
      for (let id2 of request.ids) {
        try {
          ({ name, callback, note } = onLoadCallbacks[id2]);
          let result = await callback({
            path: request.path,
            namespace: request.namespace,
            suffix: request.suffix,
            pluginData: details.load(request.pluginData),
            with: request.with
          });
          if (result != null) {
            if (typeof result !== "object")
              throw new Error(`Expected onLoad() callback in plugin ${quote(name)} to return an object`);
            let keys = {};
            let pluginName = getFlag(result, keys, "pluginName", mustBeString);
            let contents = getFlag(result, keys, "contents", mustBeStringOrUint8Array);
            let resolveDir = getFlag(result, keys, "resolveDir", mustBeString);
            let pluginData = getFlag(result, keys, "pluginData", canBeAnything);
            let loader = getFlag(result, keys, "loader", mustBeString);
            let errors = getFlag(result, keys, "errors", mustBeArray);
            let warnings = getFlag(result, keys, "warnings", mustBeArray);
            let watchFiles = getFlag(result, keys, "watchFiles", mustBeArrayOfStrings);
            let watchDirs = getFlag(result, keys, "watchDirs", mustBeArrayOfStrings);
            checkForInvalidFlags(result, keys, `from onLoad() callback in plugin ${quote(name)}`);
            response.id = id2;
            if (pluginName != null)
              response.pluginName = pluginName;
            if (contents instanceof Uint8Array)
              response.contents = contents;
            else if (contents != null)
              response.contents = encodeUTF8(contents);
            if (resolveDir != null)
              response.resolveDir = resolveDir;
            if (pluginData != null)
              response.pluginData = details.store(pluginData);
            if (loader != null)
              response.loader = loader;
            if (errors != null)
              response.errors = sanitizeMessages(errors, "errors", details, name, undefined);
            if (warnings != null)
              response.warnings = sanitizeMessages(warnings, "warnings", details, name, undefined);
            if (watchFiles != null)
              response.watchFiles = sanitizeStringArray(watchFiles, "watchFiles");
            if (watchDirs != null)
              response.watchDirs = sanitizeStringArray(watchDirs, "watchDirs");
            break;
          }
        } catch (e) {
          response = { id: id2, errors: [extractErrorMessageV8(e, streamIn, details, note && note(), name)] };
          break;
        }
      }
      sendResponse(id, response);
    };
    let runOnEndCallbacks = (result, done) => done([], []);
    if (onEndCallbacks.length > 0) {
      runOnEndCallbacks = (result, done) => {
        (async () => {
          const onEndErrors = [];
          const onEndWarnings = [];
          for (const { name, callback, note } of onEndCallbacks) {
            let newErrors;
            let newWarnings;
            try {
              const value = await callback(result);
              if (value != null) {
                if (typeof value !== "object")
                  throw new Error(`Expected onEnd() callback in plugin ${quote(name)} to return an object`);
                let keys = {};
                let errors = getFlag(value, keys, "errors", mustBeArray);
                let warnings = getFlag(value, keys, "warnings", mustBeArray);
                checkForInvalidFlags(value, keys, `from onEnd() callback in plugin ${quote(name)}`);
                if (errors != null)
                  newErrors = sanitizeMessages(errors, "errors", details, name, undefined);
                if (warnings != null)
                  newWarnings = sanitizeMessages(warnings, "warnings", details, name, undefined);
              }
            } catch (e) {
              newErrors = [extractErrorMessageV8(e, streamIn, details, note && note(), name)];
            }
            if (newErrors) {
              onEndErrors.push(...newErrors);
              try {
                result.errors.push(...newErrors);
              } catch {}
            }
            if (newWarnings) {
              onEndWarnings.push(...newWarnings);
              try {
                result.warnings.push(...newWarnings);
              } catch {}
            }
          }
          done(onEndErrors, onEndWarnings);
        })();
      };
    }
    let scheduleOnDisposeCallbacks = () => {
      for (const cb of onDisposeCallbacks) {
        setTimeout(() => cb(), 0);
      }
    };
    isSetupDone = true;
    return {
      ok: true,
      requestPlugins,
      runOnEndCallbacks,
      scheduleOnDisposeCallbacks
    };
  };
  function createObjectStash() {
    const map = /* @__PURE__ */ new Map;
    let nextID = 0;
    return {
      clear() {
        map.clear();
      },
      load(id) {
        return map.get(id);
      },
      store(value) {
        if (value === undefined)
          return -1;
        const id = nextID++;
        map.set(id, value);
        return id;
      }
    };
  }
  function extractCallerV8(e, streamIn, ident) {
    let note;
    let tried = false;
    return () => {
      if (tried)
        return note;
      tried = true;
      try {
        let lines = (e.stack + "").split(`
`);
        lines.splice(1, 1);
        let location = parseStackLinesV8(streamIn, lines, ident);
        if (location) {
          note = { text: e.message, location };
          return note;
        }
      } catch {}
    };
  }
  function extractErrorMessageV8(e, streamIn, stash, note, pluginName) {
    let text = "Internal error";
    let location = null;
    try {
      text = (e && e.message || e) + "";
    } catch {}
    try {
      location = parseStackLinesV8(streamIn, (e.stack + "").split(`
`), "");
    } catch {}
    return { id: "", pluginName, text, location, notes: note ? [note] : [], detail: stash ? stash.store(e) : -1 };
  }
  function parseStackLinesV8(streamIn, lines, ident) {
    let at = "    at ";
    if (streamIn.readFileSync && !lines[0].startsWith(at) && lines[1].startsWith(at)) {
      for (let i = 1;i < lines.length; i++) {
        let line = lines[i];
        if (!line.startsWith(at))
          continue;
        line = line.slice(at.length);
        while (true) {
          let match = /^(?:new |async )?\S+ \((.*)\)$/.exec(line);
          if (match) {
            line = match[1];
            continue;
          }
          match = /^eval at \S+ \((.*)\)(?:, \S+:\d+:\d+)?$/.exec(line);
          if (match) {
            line = match[1];
            continue;
          }
          match = /^(\S+):(\d+):(\d+)$/.exec(line);
          if (match) {
            let contents;
            try {
              contents = streamIn.readFileSync(match[1], "utf8");
            } catch {
              break;
            }
            let lineText = contents.split(/\r\n|\r|\n|\u2028|\u2029/)[+match[2] - 1] || "";
            let column = +match[3] - 1;
            let length = lineText.slice(column, column + ident.length) === ident ? ident.length : 0;
            return {
              file: match[1],
              namespace: "file",
              line: +match[2],
              column: encodeUTF8(lineText.slice(0, column)).length,
              length: encodeUTF8(lineText.slice(column, column + length)).length,
              lineText: lineText + `
` + lines.slice(1).join(`
`),
              suggestion: ""
            };
          }
          break;
        }
      }
    }
    return null;
  }
  function failureErrorWithLog(text, errors, warnings) {
    let limit = 5;
    text += errors.length < 1 ? "" : ` with ${errors.length} error${errors.length < 2 ? "" : "s"}:` + errors.slice(0, limit + 1).map((e, i) => {
      if (i === limit)
        return `
...`;
      if (!e.location)
        return `
error: ${e.text}`;
      let { file, line, column } = e.location;
      let pluginText = e.pluginName ? `[plugin: ${e.pluginName}] ` : "";
      return `
${file}:${line}:${column}: ERROR: ${pluginText}${e.text}`;
    }).join("");
    let error = new Error(text);
    for (const [key, value] of [["errors", errors], ["warnings", warnings]]) {
      Object.defineProperty(error, key, {
        configurable: true,
        enumerable: true,
        get: () => value,
        set: (value2) => Object.defineProperty(error, key, {
          configurable: true,
          enumerable: true,
          value: value2
        })
      });
    }
    return error;
  }
  function replaceDetailsInMessages(messages, stash) {
    for (const message of messages) {
      message.detail = stash.load(message.detail);
    }
    return messages;
  }
  function sanitizeLocation(location, where, terminalWidth) {
    if (location == null)
      return null;
    let keys = {};
    let file = getFlag(location, keys, "file", mustBeString);
    let namespace = getFlag(location, keys, "namespace", mustBeString);
    let line = getFlag(location, keys, "line", mustBeInteger);
    let column = getFlag(location, keys, "column", mustBeInteger);
    let length = getFlag(location, keys, "length", mustBeInteger);
    let lineText = getFlag(location, keys, "lineText", mustBeString);
    let suggestion = getFlag(location, keys, "suggestion", mustBeString);
    checkForInvalidFlags(location, keys, where);
    if (lineText) {
      const relevantASCII = lineText.slice(0, (column && column > 0 ? column : 0) + (length && length > 0 ? length : 0) + (terminalWidth && terminalWidth > 0 ? terminalWidth : 80));
      if (!/[\x7F-\uFFFF]/.test(relevantASCII) && !/\n/.test(lineText)) {
        lineText = relevantASCII;
      }
    }
    return {
      file: file || "",
      namespace: namespace || "",
      line: line || 0,
      column: column || 0,
      length: length || 0,
      lineText: lineText || "",
      suggestion: suggestion || ""
    };
  }
  function sanitizeMessages(messages, property, stash, fallbackPluginName, terminalWidth) {
    let messagesClone = [];
    let index = 0;
    for (const message of messages) {
      let keys = {};
      let id = getFlag(message, keys, "id", mustBeString);
      let pluginName = getFlag(message, keys, "pluginName", mustBeString);
      let text = getFlag(message, keys, "text", mustBeString);
      let location = getFlag(message, keys, "location", mustBeObjectOrNull);
      let notes = getFlag(message, keys, "notes", mustBeArray);
      let detail = getFlag(message, keys, "detail", canBeAnything);
      let where = `in element ${index} of "${property}"`;
      checkForInvalidFlags(message, keys, where);
      let notesClone = [];
      if (notes) {
        for (const note of notes) {
          let noteKeys = {};
          let noteText = getFlag(note, noteKeys, "text", mustBeString);
          let noteLocation = getFlag(note, noteKeys, "location", mustBeObjectOrNull);
          checkForInvalidFlags(note, noteKeys, where);
          notesClone.push({
            text: noteText || "",
            location: sanitizeLocation(noteLocation, where, terminalWidth)
          });
        }
      }
      messagesClone.push({
        id: id || "",
        pluginName: pluginName || fallbackPluginName,
        text: text || "",
        location: sanitizeLocation(location, where, terminalWidth),
        notes: notesClone,
        detail: stash ? stash.store(detail) : -1
      });
      index++;
    }
    return messagesClone;
  }
  function sanitizeStringArray(values, property) {
    const result = [];
    for (const value of values) {
      if (typeof value !== "string")
        throw new Error(`${quote(property)} must be an array of strings`);
      result.push(value);
    }
    return result;
  }
  function sanitizeStringMap(map, property) {
    const result = /* @__PURE__ */ Object.create(null);
    for (const key in map) {
      const value = map[key];
      if (typeof value !== "string")
        throw new Error(`key ${quote(key)} in object ${quote(property)} must be a string`);
      result[key] = value;
    }
    return result;
  }
  function convertOutputFiles({ path: path3, contents, hash }) {
    let text = null;
    return {
      path: path3,
      contents,
      hash,
      get text() {
        const binary = this.contents;
        if (text === null || binary !== contents) {
          contents = binary;
          text = decodeUTF8(binary);
        }
        return text;
      }
    };
  }
  function jsRegExpToGoRegExp(regexp) {
    let result = regexp.source;
    if (regexp.flags)
      result = `(?${regexp.flags})${result}`;
    return result;
  }
  var fs = __require("fs");
  var os = __require("os");
  var path = __require("path");
  var ESBUILD_BINARY_PATH = process.env.ESBUILD_BINARY_PATH || ESBUILD_BINARY_PATH;
  var isValidBinaryPath = (x) => !!x && x !== "/usr/bin/esbuild";
  var packageDarwin_arm64 = "@esbuild/darwin-arm64";
  var packageDarwin_x64 = "@esbuild/darwin-x64";
  var knownWindowsPackages = {
    "win32 arm64 LE": "@esbuild/win32-arm64",
    "win32 ia32 LE": "@esbuild/win32-ia32",
    "win32 x64 LE": "@esbuild/win32-x64"
  };
  var knownUnixlikePackages = {
    "aix ppc64 BE": "@esbuild/aix-ppc64",
    "android arm64 LE": "@esbuild/android-arm64",
    "darwin arm64 LE": "@esbuild/darwin-arm64",
    "darwin x64 LE": "@esbuild/darwin-x64",
    "freebsd arm64 LE": "@esbuild/freebsd-arm64",
    "freebsd x64 LE": "@esbuild/freebsd-x64",
    "linux arm LE": "@esbuild/linux-arm",
    "linux arm64 LE": "@esbuild/linux-arm64",
    "linux ia32 LE": "@esbuild/linux-ia32",
    "linux mips64el LE": "@esbuild/linux-mips64el",
    "linux ppc64 LE": "@esbuild/linux-ppc64",
    "linux riscv64 LE": "@esbuild/linux-riscv64",
    "linux s390x BE": "@esbuild/linux-s390x",
    "linux x64 LE": "@esbuild/linux-x64",
    "linux loong64 LE": "@esbuild/linux-loong64",
    "netbsd arm64 LE": "@esbuild/netbsd-arm64",
    "netbsd x64 LE": "@esbuild/netbsd-x64",
    "openbsd arm64 LE": "@esbuild/openbsd-arm64",
    "openbsd x64 LE": "@esbuild/openbsd-x64",
    "sunos x64 LE": "@esbuild/sunos-x64"
  };
  var knownWebAssemblyFallbackPackages = {
    "android arm LE": "@esbuild/android-arm",
    "android x64 LE": "@esbuild/android-x64",
    "openharmony arm64 LE": "@esbuild/openharmony-arm64"
  };
  function pkgAndSubpathForCurrentPlatform() {
    let pkg;
    let subpath;
    let isWASM = false;
    let platformKey = `${process.platform} ${os.arch()} ${os.endianness()}`;
    if (platformKey in knownWindowsPackages) {
      pkg = knownWindowsPackages[platformKey];
      subpath = "esbuild.exe";
    } else if (platformKey in knownUnixlikePackages) {
      pkg = knownUnixlikePackages[platformKey];
      subpath = "bin/esbuild";
    } else if (platformKey in knownWebAssemblyFallbackPackages) {
      pkg = knownWebAssemblyFallbackPackages[platformKey];
      subpath = "bin/esbuild";
      isWASM = true;
    } else {
      throw new Error(`Unsupported platform: ${platformKey}`);
    }
    return { pkg, subpath, isWASM };
  }
  function pkgForSomeOtherPlatform() {
    const libMainJS = __require.resolve("esbuild");
    const nodeModulesDirectory = path.dirname(path.dirname(path.dirname(libMainJS)));
    if (path.basename(nodeModulesDirectory) === "node_modules") {
      for (const unixKey in knownUnixlikePackages) {
        try {
          const pkg = knownUnixlikePackages[unixKey];
          if (fs.existsSync(path.join(nodeModulesDirectory, pkg)))
            return pkg;
        } catch {}
      }
      for (const windowsKey in knownWindowsPackages) {
        try {
          const pkg = knownWindowsPackages[windowsKey];
          if (fs.existsSync(path.join(nodeModulesDirectory, pkg)))
            return pkg;
        } catch {}
      }
    }
    return null;
  }
  function downloadedBinPath(pkg, subpath) {
    const esbuildLibDir = path.dirname(__require.resolve("esbuild"));
    return path.join(esbuildLibDir, `downloaded-${pkg.replace("/", "-")}-${path.basename(subpath)}`);
  }
  function generateBinPath() {
    if (isValidBinaryPath(ESBUILD_BINARY_PATH)) {
      if (!fs.existsSync(ESBUILD_BINARY_PATH)) {
        console.warn(`[esbuild] Ignoring bad configuration: ESBUILD_BINARY_PATH=${ESBUILD_BINARY_PATH}`);
      } else {
        return { binPath: ESBUILD_BINARY_PATH, isWASM: false };
      }
    }
    const { pkg, subpath, isWASM } = pkgAndSubpathForCurrentPlatform();
    let binPath;
    try {
      binPath = __require.resolve(`${pkg}/${subpath}`);
    } catch (e) {
      binPath = downloadedBinPath(pkg, subpath);
      if (!fs.existsSync(binPath)) {
        try {
          __require.resolve(pkg);
        } catch {
          const otherPkg = pkgForSomeOtherPlatform();
          if (otherPkg) {
            let suggestions = `
Specifically the "${otherPkg}" package is present but this platform
needs the "${pkg}" package instead. People often get into this
situation by installing esbuild on Windows or macOS and copying "node_modules"
into a Docker image that runs Linux, or by copying "node_modules" between
Windows and WSL environments.

If you are installing with npm, you can try not copying the "node_modules"
directory when you copy the files over, and running "npm ci" or "npm install"
on the destination platform after the copy. Or you could consider using yarn
instead of npm which has built-in support for installing a package on multiple
platforms simultaneously.

If you are installing with yarn, you can try listing both this platform and the
other platform in your ".yarnrc.yml" file using the "supportedArchitectures"
feature: https://yarnpkg.com/configuration/yarnrc/#supportedArchitectures
Keep in mind that this means multiple copies of esbuild will be present.
`;
            if (pkg === packageDarwin_x64 && otherPkg === packageDarwin_arm64 || pkg === packageDarwin_arm64 && otherPkg === packageDarwin_x64) {
              suggestions = `
Specifically the "${otherPkg}" package is present but this platform
needs the "${pkg}" package instead. People often get into this
situation by installing esbuild with npm running inside of Rosetta 2 and then
trying to use it with node running outside of Rosetta 2, or vice versa (Rosetta
2 is Apple's on-the-fly x86_64-to-arm64 translation service).

If you are installing with npm, you can try ensuring that both npm and node are
not running under Rosetta 2 and then reinstalling esbuild. This likely involves
changing how you installed npm and/or node. For example, installing node with
the universal installer here should work: https://nodejs.org/en/download/. Or
you could consider using yarn instead of npm which has built-in support for
installing a package on multiple platforms simultaneously.

If you are installing with yarn, you can try listing both "arm64" and "x64"
in your ".yarnrc.yml" file using the "supportedArchitectures" feature:
https://yarnpkg.com/configuration/yarnrc/#supportedArchitectures
Keep in mind that this means multiple copies of esbuild will be present.
`;
            }
            throw new Error(`
You installed esbuild for another platform than the one you're currently using.
This won't work because esbuild is written with native code and needs to
install a platform-specific binary executable.
${suggestions}
Another alternative is to use the "esbuild-wasm" package instead, which works
the same way on all platforms. But it comes with a heavy performance cost and
can sometimes be 10x slower than the "esbuild" package, so you may also not
want to do that.
`);
          }
          throw new Error(`The package "${pkg}" could not be found, and is needed by esbuild.

If you are installing esbuild with npm, make sure that you don't specify the
"--no-optional" or "--omit=optional" flags. The "optionalDependencies" feature
of "package.json" is used by esbuild to install the correct binary executable
for your current platform.`);
        }
        throw e;
      }
    }
    if (/\.zip\//.test(binPath)) {
      let pnpapi;
      try {
        pnpapi = (()=>{throw new Error("Cannot require module "+"pnpapi");})();
      } catch (e) {}
      if (pnpapi) {
        const root = pnpapi.getPackageInformation(pnpapi.topLevel).packageLocation;
        const binTargetPath = path.join(root, "node_modules", ".cache", "esbuild", `pnpapi-${pkg.replace("/", "-")}-${"0.25.9"}-${path.basename(subpath)}`);
        if (!fs.existsSync(binTargetPath)) {
          fs.mkdirSync(path.dirname(binTargetPath), { recursive: true });
          fs.copyFileSync(binPath, binTargetPath);
          fs.chmodSync(binTargetPath, 493);
        }
        return { binPath: binTargetPath, isWASM };
      }
    }
    return { binPath, isWASM };
  }
  var child_process = __require("child_process");
  var crypto = __require("crypto");
  var path2 = __require("path");
  var fs2 = __require("fs");
  var os2 = __require("os");
  var tty = __require("tty");
  var worker_threads;
  if (process.env.ESBUILD_WORKER_THREADS !== "0") {
    try {
      worker_threads = __require("worker_threads");
    } catch {}
    let [major, minor] = process.versions.node.split(".");
    if (+major < 12 || +major === 12 && +minor < 17 || +major === 13 && +minor < 13) {
      worker_threads = undefined;
    }
  }
  var _a;
  var isInternalWorkerThread = ((_a = worker_threads == null ? undefined : worker_threads.workerData) == null ? undefined : _a.esbuildVersion) === "0.25.9";
  var esbuildCommandAndArgs = () => {
    if ((!ESBUILD_BINARY_PATH || false) && (path2.basename(__filename) !== "main.js" || path2.basename(__dirname) !== "lib")) {
      throw new Error(`The esbuild JavaScript API cannot be bundled. Please mark the "esbuild" package as external so it's not included in the bundle.

More information: The file containing the code for esbuild's JavaScript API (${__filename}) does not appear to be inside the esbuild package on the file system, which usually means that the esbuild package was bundled into another file. This is problematic because the API needs to run a binary executable inside the esbuild package which is located using a relative path from the API code to the executable. If the esbuild package is bundled, the relative path will be incorrect and the executable won't be found.`);
    }
    if (false) {} else {
      const { binPath, isWASM } = generateBinPath();
      if (isWASM) {
        return ["node", [binPath]];
      } else {
        return [binPath, []];
      }
    }
  };
  var isTTY = () => tty.isatty(2);
  var fsSync = {
    readFile(tempFile, callback) {
      try {
        let contents = fs2.readFileSync(tempFile, "utf8");
        try {
          fs2.unlinkSync(tempFile);
        } catch {}
        callback(null, contents);
      } catch (err) {
        callback(err, null);
      }
    },
    writeFile(contents, callback) {
      try {
        let tempFile = randomFileName();
        fs2.writeFileSync(tempFile, contents);
        callback(tempFile);
      } catch {
        callback(null);
      }
    }
  };
  var fsAsync = {
    readFile(tempFile, callback) {
      try {
        fs2.readFile(tempFile, "utf8", (err, contents) => {
          try {
            fs2.unlink(tempFile, () => callback(err, contents));
          } catch {
            callback(err, contents);
          }
        });
      } catch (err) {
        callback(err, null);
      }
    },
    writeFile(contents, callback) {
      try {
        let tempFile = randomFileName();
        fs2.writeFile(tempFile, contents, (err) => err !== null ? callback(null) : callback(tempFile));
      } catch {
        callback(null);
      }
    }
  };
  var version = "0.25.9";
  var build = (options) => ensureServiceIsRunning().build(options);
  var context = (buildOptions) => ensureServiceIsRunning().context(buildOptions);
  var transform = (input, options) => ensureServiceIsRunning().transform(input, options);
  var formatMessages = (messages, options) => ensureServiceIsRunning().formatMessages(messages, options);
  var analyzeMetafile = (messages, options) => ensureServiceIsRunning().analyzeMetafile(messages, options);
  var buildSync = (options) => {
    if (worker_threads && !isInternalWorkerThread) {
      if (!workerThreadService)
        workerThreadService = startWorkerThreadService(worker_threads);
      return workerThreadService.buildSync(options);
    }
    let result;
    runServiceSync((service) => service.buildOrContext({
      callName: "buildSync",
      refs: null,
      options,
      isTTY: isTTY(),
      defaultWD,
      callback: (err, res) => {
        if (err)
          throw err;
        result = res;
      }
    }));
    return result;
  };
  var transformSync = (input, options) => {
    if (worker_threads && !isInternalWorkerThread) {
      if (!workerThreadService)
        workerThreadService = startWorkerThreadService(worker_threads);
      return workerThreadService.transformSync(input, options);
    }
    let result;
    runServiceSync((service) => service.transform({
      callName: "transformSync",
      refs: null,
      input,
      options: options || {},
      isTTY: isTTY(),
      fs: fsSync,
      callback: (err, res) => {
        if (err)
          throw err;
        result = res;
      }
    }));
    return result;
  };
  var formatMessagesSync = (messages, options) => {
    if (worker_threads && !isInternalWorkerThread) {
      if (!workerThreadService)
        workerThreadService = startWorkerThreadService(worker_threads);
      return workerThreadService.formatMessagesSync(messages, options);
    }
    let result;
    runServiceSync((service) => service.formatMessages({
      callName: "formatMessagesSync",
      refs: null,
      messages,
      options,
      callback: (err, res) => {
        if (err)
          throw err;
        result = res;
      }
    }));
    return result;
  };
  var analyzeMetafileSync = (metafile, options) => {
    if (worker_threads && !isInternalWorkerThread) {
      if (!workerThreadService)
        workerThreadService = startWorkerThreadService(worker_threads);
      return workerThreadService.analyzeMetafileSync(metafile, options);
    }
    let result;
    runServiceSync((service) => service.analyzeMetafile({
      callName: "analyzeMetafileSync",
      refs: null,
      metafile: typeof metafile === "string" ? metafile : JSON.stringify(metafile),
      options,
      callback: (err, res) => {
        if (err)
          throw err;
        result = res;
      }
    }));
    return result;
  };
  var stop = () => {
    if (stopService)
      stopService();
    if (workerThreadService)
      workerThreadService.stop();
    return Promise.resolve();
  };
  var initializeWasCalled = false;
  var initialize = (options) => {
    options = validateInitializeOptions(options || {});
    if (options.wasmURL)
      throw new Error(`The "wasmURL" option only works in the browser`);
    if (options.wasmModule)
      throw new Error(`The "wasmModule" option only works in the browser`);
    if (options.worker)
      throw new Error(`The "worker" option only works in the browser`);
    if (initializeWasCalled)
      throw new Error('Cannot call "initialize" more than once');
    ensureServiceIsRunning();
    initializeWasCalled = true;
    return Promise.resolve();
  };
  var defaultWD = process.cwd();
  var longLivedService;
  var stopService;
  var ensureServiceIsRunning = () => {
    if (longLivedService)
      return longLivedService;
    let [command, args] = esbuildCommandAndArgs();
    let child = child_process.spawn(command, args.concat(`--service=${"0.25.9"}`, "--ping"), {
      windowsHide: true,
      stdio: ["pipe", "pipe", "inherit"],
      cwd: defaultWD
    });
    let { readFromStdout, afterClose, service } = createChannel({
      writeToStdin(bytes) {
        child.stdin.write(bytes, (err) => {
          if (err)
            afterClose(err);
        });
      },
      readFileSync: fs2.readFileSync,
      isSync: false,
      hasFS: true,
      esbuild: node_exports
    });
    child.stdin.on("error", afterClose);
    child.on("error", afterClose);
    const stdin = child.stdin;
    const stdout = child.stdout;
    stdout.on("data", readFromStdout);
    stdout.on("end", afterClose);
    stopService = () => {
      stdin.destroy();
      stdout.destroy();
      child.kill();
      initializeWasCalled = false;
      longLivedService = undefined;
      stopService = undefined;
    };
    let refCount = 0;
    child.unref();
    if (stdin.unref) {
      stdin.unref();
    }
    if (stdout.unref) {
      stdout.unref();
    }
    const refs = {
      ref() {
        if (++refCount === 1)
          child.ref();
      },
      unref() {
        if (--refCount === 0)
          child.unref();
      }
    };
    longLivedService = {
      build: (options) => new Promise((resolve, reject) => {
        service.buildOrContext({
          callName: "build",
          refs,
          options,
          isTTY: isTTY(),
          defaultWD,
          callback: (err, res) => err ? reject(err) : resolve(res)
        });
      }),
      context: (options) => new Promise((resolve, reject) => service.buildOrContext({
        callName: "context",
        refs,
        options,
        isTTY: isTTY(),
        defaultWD,
        callback: (err, res) => err ? reject(err) : resolve(res)
      })),
      transform: (input, options) => new Promise((resolve, reject) => service.transform({
        callName: "transform",
        refs,
        input,
        options: options || {},
        isTTY: isTTY(),
        fs: fsAsync,
        callback: (err, res) => err ? reject(err) : resolve(res)
      })),
      formatMessages: (messages, options) => new Promise((resolve, reject) => service.formatMessages({
        callName: "formatMessages",
        refs,
        messages,
        options,
        callback: (err, res) => err ? reject(err) : resolve(res)
      })),
      analyzeMetafile: (metafile, options) => new Promise((resolve, reject) => service.analyzeMetafile({
        callName: "analyzeMetafile",
        refs,
        metafile: typeof metafile === "string" ? metafile : JSON.stringify(metafile),
        options,
        callback: (err, res) => err ? reject(err) : resolve(res)
      }))
    };
    return longLivedService;
  };
  var runServiceSync = (callback) => {
    let [command, args] = esbuildCommandAndArgs();
    let stdin = new Uint8Array;
    let { readFromStdout, afterClose, service } = createChannel({
      writeToStdin(bytes) {
        if (stdin.length !== 0)
          throw new Error("Must run at most one command");
        stdin = bytes;
      },
      isSync: true,
      hasFS: true,
      esbuild: node_exports
    });
    callback(service);
    let stdout = child_process.execFileSync(command, args.concat(`--service=${"0.25.9"}`), {
      cwd: defaultWD,
      windowsHide: true,
      input: stdin,
      maxBuffer: +process.env.ESBUILD_MAX_BUFFER || 16 * 1024 * 1024
    });
    readFromStdout(stdout);
    afterClose(null);
  };
  var randomFileName = () => {
    return path2.join(os2.tmpdir(), `esbuild-${crypto.randomBytes(32).toString("hex")}`);
  };
  var workerThreadService = null;
  var startWorkerThreadService = (worker_threads2) => {
    let { port1: mainPort, port2: workerPort } = new worker_threads2.MessageChannel;
    let worker = new worker_threads2.Worker(__filename, {
      workerData: { workerPort, defaultWD, esbuildVersion: "0.25.9" },
      transferList: [workerPort],
      execArgv: []
    });
    let nextID = 0;
    let fakeBuildError = (text) => {
      let error = new Error(`Build failed with 1 error:
error: ${text}`);
      let errors = [{ id: "", pluginName: "", text, location: null, notes: [], detail: undefined }];
      error.errors = errors;
      error.warnings = [];
      return error;
    };
    let validateBuildSyncOptions = (options) => {
      if (!options)
        return;
      let plugins = options.plugins;
      if (plugins && plugins.length > 0)
        throw fakeBuildError(`Cannot use plugins in synchronous API calls`);
    };
    let applyProperties = (object, properties) => {
      for (let key in properties) {
        object[key] = properties[key];
      }
    };
    let runCallSync = (command, args) => {
      let id = nextID++;
      let sharedBuffer = new SharedArrayBuffer(8);
      let sharedBufferView = new Int32Array(sharedBuffer);
      let msg = { sharedBuffer, id, command, args };
      worker.postMessage(msg);
      let status = Atomics.wait(sharedBufferView, 0, 0);
      if (status !== "ok" && status !== "not-equal")
        throw new Error("Internal error: Atomics.wait() failed: " + status);
      let { message: { id: id2, resolve, reject, properties } } = worker_threads2.receiveMessageOnPort(mainPort);
      if (id !== id2)
        throw new Error(`Internal error: Expected id ${id} but got id ${id2}`);
      if (reject) {
        applyProperties(reject, properties);
        throw reject;
      }
      return resolve;
    };
    worker.unref();
    return {
      buildSync(options) {
        validateBuildSyncOptions(options);
        return runCallSync("build", [options]);
      },
      transformSync(input, options) {
        return runCallSync("transform", [input, options]);
      },
      formatMessagesSync(messages, options) {
        return runCallSync("formatMessages", [messages, options]);
      },
      analyzeMetafileSync(metafile, options) {
        return runCallSync("analyzeMetafile", [metafile, options]);
      },
      stop() {
        worker.terminate();
        workerThreadService = null;
      }
    };
  };
  var startSyncServiceWorker = () => {
    let workerPort = worker_threads.workerData.workerPort;
    let parentPort = worker_threads.parentPort;
    let extractProperties = (object) => {
      let properties = {};
      if (object && typeof object === "object") {
        for (let key in object) {
          properties[key] = object[key];
        }
      }
      return properties;
    };
    try {
      let service = ensureServiceIsRunning();
      defaultWD = worker_threads.workerData.defaultWD;
      parentPort.on("message", (msg) => {
        (async () => {
          let { sharedBuffer, id, command, args } = msg;
          let sharedBufferView = new Int32Array(sharedBuffer);
          try {
            switch (command) {
              case "build":
                workerPort.postMessage({ id, resolve: await service.build(args[0]) });
                break;
              case "transform":
                workerPort.postMessage({ id, resolve: await service.transform(args[0], args[1]) });
                break;
              case "formatMessages":
                workerPort.postMessage({ id, resolve: await service.formatMessages(args[0], args[1]) });
                break;
              case "analyzeMetafile":
                workerPort.postMessage({ id, resolve: await service.analyzeMetafile(args[0], args[1]) });
                break;
              default:
                throw new Error(`Invalid command: ${command}`);
            }
          } catch (reject) {
            workerPort.postMessage({ id, reject, properties: extractProperties(reject) });
          }
          Atomics.add(sharedBufferView, 0, 1);
          Atomics.notify(sharedBufferView, 0, Infinity);
        })();
      });
    } catch (reject) {
      parentPort.on("message", (msg) => {
        let { sharedBuffer, id } = msg;
        let sharedBufferView = new Int32Array(sharedBuffer);
        workerPort.postMessage({ id, reject, properties: extractProperties(reject) });
        Atomics.add(sharedBufferView, 0, 1);
        Atomics.notify(sharedBufferView, 0, Infinity);
      });
    }
  };
  if (isInternalWorkerThread) {
    startSyncServiceWorker();
  }
  var node_default = node_exports;
});

// index.ts
import path3 from "path";

// config/root.config.ts
class RootConfig {
  static TDH_TTL;
  static TDH_REDIS_CONNECTION_URL;
  static TDH_EXICUTION_MODE;
  static TDH_RENDER_PATH;
}

// core/TDHRouteGenerator.ts
var import_esbuild = __toESM(require_main(), 1);
import fs from "fs";
import path from "path";

// node_modules/chalk/source/vendor/ansi-styles/index.js
var ANSI_BACKGROUND_OFFSET = 10;
var wrapAnsi16 = (offset = 0) => (code) => `\x1B[${code + offset}m`;
var wrapAnsi256 = (offset = 0) => (code) => `\x1B[${38 + offset};5;${code}m`;
var wrapAnsi16m = (offset = 0) => (red, green, blue) => `\x1B[${38 + offset};2;${red};${green};${blue}m`;
var styles = {
  modifier: {
    reset: [0, 0],
    bold: [1, 22],
    dim: [2, 22],
    italic: [3, 23],
    underline: [4, 24],
    overline: [53, 55],
    inverse: [7, 27],
    hidden: [8, 28],
    strikethrough: [9, 29]
  },
  color: {
    black: [30, 39],
    red: [31, 39],
    green: [32, 39],
    yellow: [33, 39],
    blue: [34, 39],
    magenta: [35, 39],
    cyan: [36, 39],
    white: [37, 39],
    blackBright: [90, 39],
    gray: [90, 39],
    grey: [90, 39],
    redBright: [91, 39],
    greenBright: [92, 39],
    yellowBright: [93, 39],
    blueBright: [94, 39],
    magentaBright: [95, 39],
    cyanBright: [96, 39],
    whiteBright: [97, 39]
  },
  bgColor: {
    bgBlack: [40, 49],
    bgRed: [41, 49],
    bgGreen: [42, 49],
    bgYellow: [43, 49],
    bgBlue: [44, 49],
    bgMagenta: [45, 49],
    bgCyan: [46, 49],
    bgWhite: [47, 49],
    bgBlackBright: [100, 49],
    bgGray: [100, 49],
    bgGrey: [100, 49],
    bgRedBright: [101, 49],
    bgGreenBright: [102, 49],
    bgYellowBright: [103, 49],
    bgBlueBright: [104, 49],
    bgMagentaBright: [105, 49],
    bgCyanBright: [106, 49],
    bgWhiteBright: [107, 49]
  }
};
var modifierNames = Object.keys(styles.modifier);
var foregroundColorNames = Object.keys(styles.color);
var backgroundColorNames = Object.keys(styles.bgColor);
var colorNames = [...foregroundColorNames, ...backgroundColorNames];
function assembleStyles() {
  const codes = new Map;
  for (const [groupName, group] of Object.entries(styles)) {
    for (const [styleName, style] of Object.entries(group)) {
      styles[styleName] = {
        open: `\x1B[${style[0]}m`,
        close: `\x1B[${style[1]}m`
      };
      group[styleName] = styles[styleName];
      codes.set(style[0], style[1]);
    }
    Object.defineProperty(styles, groupName, {
      value: group,
      enumerable: false
    });
  }
  Object.defineProperty(styles, "codes", {
    value: codes,
    enumerable: false
  });
  styles.color.close = "\x1B[39m";
  styles.bgColor.close = "\x1B[49m";
  styles.color.ansi = wrapAnsi16();
  styles.color.ansi256 = wrapAnsi256();
  styles.color.ansi16m = wrapAnsi16m();
  styles.bgColor.ansi = wrapAnsi16(ANSI_BACKGROUND_OFFSET);
  styles.bgColor.ansi256 = wrapAnsi256(ANSI_BACKGROUND_OFFSET);
  styles.bgColor.ansi16m = wrapAnsi16m(ANSI_BACKGROUND_OFFSET);
  Object.defineProperties(styles, {
    rgbToAnsi256: {
      value(red, green, blue) {
        if (red === green && green === blue) {
          if (red < 8) {
            return 16;
          }
          if (red > 248) {
            return 231;
          }
          return Math.round((red - 8) / 247 * 24) + 232;
        }
        return 16 + 36 * Math.round(red / 255 * 5) + 6 * Math.round(green / 255 * 5) + Math.round(blue / 255 * 5);
      },
      enumerable: false
    },
    hexToRgb: {
      value(hex) {
        const matches = /[a-f\d]{6}|[a-f\d]{3}/i.exec(hex.toString(16));
        if (!matches) {
          return [0, 0, 0];
        }
        let [colorString] = matches;
        if (colorString.length === 3) {
          colorString = [...colorString].map((character) => character + character).join("");
        }
        const integer = Number.parseInt(colorString, 16);
        return [
          integer >> 16 & 255,
          integer >> 8 & 255,
          integer & 255
        ];
      },
      enumerable: false
    },
    hexToAnsi256: {
      value: (hex) => styles.rgbToAnsi256(...styles.hexToRgb(hex)),
      enumerable: false
    },
    ansi256ToAnsi: {
      value(code) {
        if (code < 8) {
          return 30 + code;
        }
        if (code < 16) {
          return 90 + (code - 8);
        }
        let red;
        let green;
        let blue;
        if (code >= 232) {
          red = ((code - 232) * 10 + 8) / 255;
          green = red;
          blue = red;
        } else {
          code -= 16;
          const remainder = code % 36;
          red = Math.floor(code / 36) / 5;
          green = Math.floor(remainder / 6) / 5;
          blue = remainder % 6 / 5;
        }
        const value = Math.max(red, green, blue) * 2;
        if (value === 0) {
          return 30;
        }
        let result = 30 + (Math.round(blue) << 2 | Math.round(green) << 1 | Math.round(red));
        if (value === 2) {
          result += 60;
        }
        return result;
      },
      enumerable: false
    },
    rgbToAnsi: {
      value: (red, green, blue) => styles.ansi256ToAnsi(styles.rgbToAnsi256(red, green, blue)),
      enumerable: false
    },
    hexToAnsi: {
      value: (hex) => styles.ansi256ToAnsi(styles.hexToAnsi256(hex)),
      enumerable: false
    }
  });
  return styles;
}
var ansiStyles = assembleStyles();
var ansi_styles_default = ansiStyles;

// node_modules/chalk/source/vendor/supports-color/index.js
import process2 from "node:process";
import os from "node:os";
import tty from "node:tty";
function hasFlag(flag, argv = globalThis.Deno ? globalThis.Deno.args : process2.argv) {
  const prefix = flag.startsWith("-") ? "" : flag.length === 1 ? "-" : "--";
  const position = argv.indexOf(prefix + flag);
  const terminatorPosition = argv.indexOf("--");
  return position !== -1 && (terminatorPosition === -1 || position < terminatorPosition);
}
var { env } = process2;
var flagForceColor;
if (hasFlag("no-color") || hasFlag("no-colors") || hasFlag("color=false") || hasFlag("color=never")) {
  flagForceColor = 0;
} else if (hasFlag("color") || hasFlag("colors") || hasFlag("color=true") || hasFlag("color=always")) {
  flagForceColor = 1;
}
function envForceColor() {
  if ("FORCE_COLOR" in env) {
    if (env.FORCE_COLOR === "true") {
      return 1;
    }
    if (env.FORCE_COLOR === "false") {
      return 0;
    }
    return env.FORCE_COLOR.length === 0 ? 1 : Math.min(Number.parseInt(env.FORCE_COLOR, 10), 3);
  }
}
function translateLevel(level) {
  if (level === 0) {
    return false;
  }
  return {
    level,
    hasBasic: true,
    has256: level >= 2,
    has16m: level >= 3
  };
}
function _supportsColor(haveStream, { streamIsTTY, sniffFlags = true } = {}) {
  const noFlagForceColor = envForceColor();
  if (noFlagForceColor !== undefined) {
    flagForceColor = noFlagForceColor;
  }
  const forceColor = sniffFlags ? flagForceColor : noFlagForceColor;
  if (forceColor === 0) {
    return 0;
  }
  if (sniffFlags) {
    if (hasFlag("color=16m") || hasFlag("color=full") || hasFlag("color=truecolor")) {
      return 3;
    }
    if (hasFlag("color=256")) {
      return 2;
    }
  }
  if ("TF_BUILD" in env && "AGENT_NAME" in env) {
    return 1;
  }
  if (haveStream && !streamIsTTY && forceColor === undefined) {
    return 0;
  }
  const min = forceColor || 0;
  if (env.TERM === "dumb") {
    return min;
  }
  if (process2.platform === "win32") {
    const osRelease = os.release().split(".");
    if (Number(osRelease[0]) >= 10 && Number(osRelease[2]) >= 10586) {
      return Number(osRelease[2]) >= 14931 ? 3 : 2;
    }
    return 1;
  }
  if ("CI" in env) {
    if (["GITHUB_ACTIONS", "GITEA_ACTIONS", "CIRCLECI"].some((key) => (key in env))) {
      return 3;
    }
    if (["TRAVIS", "APPVEYOR", "GITLAB_CI", "BUILDKITE", "DRONE"].some((sign) => (sign in env)) || env.CI_NAME === "codeship") {
      return 1;
    }
    return min;
  }
  if ("TEAMCITY_VERSION" in env) {
    return /^(9\.(0*[1-9]\d*)\.|\d{2,}\.)/.test(env.TEAMCITY_VERSION) ? 1 : 0;
  }
  if (env.COLORTERM === "truecolor") {
    return 3;
  }
  if (env.TERM === "xterm-kitty") {
    return 3;
  }
  if (env.TERM === "xterm-ghostty") {
    return 3;
  }
  if (env.TERM === "wezterm") {
    return 3;
  }
  if ("TERM_PROGRAM" in env) {
    const version = Number.parseInt((env.TERM_PROGRAM_VERSION || "").split(".")[0], 10);
    switch (env.TERM_PROGRAM) {
      case "iTerm.app": {
        return version >= 3 ? 3 : 2;
      }
      case "Apple_Terminal": {
        return 2;
      }
    }
  }
  if (/-256(color)?$/i.test(env.TERM)) {
    return 2;
  }
  if (/^screen|^xterm|^vt100|^vt220|^rxvt|color|ansi|cygwin|linux/i.test(env.TERM)) {
    return 1;
  }
  if ("COLORTERM" in env) {
    return 1;
  }
  return min;
}
function createSupportsColor(stream, options = {}) {
  const level = _supportsColor(stream, {
    streamIsTTY: stream && stream.isTTY,
    ...options
  });
  return translateLevel(level);
}
var supportsColor = {
  stdout: createSupportsColor({ isTTY: tty.isatty(1) }),
  stderr: createSupportsColor({ isTTY: tty.isatty(2) })
};
var supports_color_default = supportsColor;

// node_modules/chalk/source/utilities.js
function stringReplaceAll(string, substring, replacer) {
  let index = string.indexOf(substring);
  if (index === -1) {
    return string;
  }
  const substringLength = substring.length;
  let endIndex = 0;
  let returnValue = "";
  do {
    returnValue += string.slice(endIndex, index) + substring + replacer;
    endIndex = index + substringLength;
    index = string.indexOf(substring, endIndex);
  } while (index !== -1);
  returnValue += string.slice(endIndex);
  return returnValue;
}
function stringEncaseCRLFWithFirstIndex(string, prefix, postfix, index) {
  let endIndex = 0;
  let returnValue = "";
  do {
    const gotCR = string[index - 1] === "\r";
    returnValue += string.slice(endIndex, gotCR ? index - 1 : index) + prefix + (gotCR ? `\r
` : `
`) + postfix;
    endIndex = index + 1;
    index = string.indexOf(`
`, endIndex);
  } while (index !== -1);
  returnValue += string.slice(endIndex);
  return returnValue;
}

// node_modules/chalk/source/index.js
var { stdout: stdoutColor, stderr: stderrColor } = supports_color_default;
var GENERATOR = Symbol("GENERATOR");
var STYLER = Symbol("STYLER");
var IS_EMPTY = Symbol("IS_EMPTY");
var levelMapping = [
  "ansi",
  "ansi",
  "ansi256",
  "ansi16m"
];
var styles2 = Object.create(null);
var applyOptions = (object, options = {}) => {
  if (options.level && !(Number.isInteger(options.level) && options.level >= 0 && options.level <= 3)) {
    throw new Error("The `level` option should be an integer from 0 to 3");
  }
  const colorLevel = stdoutColor ? stdoutColor.level : 0;
  object.level = options.level === undefined ? colorLevel : options.level;
};
var chalkFactory = (options) => {
  const chalk = (...strings) => strings.join(" ");
  applyOptions(chalk, options);
  Object.setPrototypeOf(chalk, createChalk.prototype);
  return chalk;
};
function createChalk(options) {
  return chalkFactory(options);
}
Object.setPrototypeOf(createChalk.prototype, Function.prototype);
for (const [styleName, style] of Object.entries(ansi_styles_default)) {
  styles2[styleName] = {
    get() {
      const builder = createBuilder(this, createStyler(style.open, style.close, this[STYLER]), this[IS_EMPTY]);
      Object.defineProperty(this, styleName, { value: builder });
      return builder;
    }
  };
}
styles2.visible = {
  get() {
    const builder = createBuilder(this, this[STYLER], true);
    Object.defineProperty(this, "visible", { value: builder });
    return builder;
  }
};
var getModelAnsi = (model, level, type, ...arguments_) => {
  if (model === "rgb") {
    if (level === "ansi16m") {
      return ansi_styles_default[type].ansi16m(...arguments_);
    }
    if (level === "ansi256") {
      return ansi_styles_default[type].ansi256(ansi_styles_default.rgbToAnsi256(...arguments_));
    }
    return ansi_styles_default[type].ansi(ansi_styles_default.rgbToAnsi(...arguments_));
  }
  if (model === "hex") {
    return getModelAnsi("rgb", level, type, ...ansi_styles_default.hexToRgb(...arguments_));
  }
  return ansi_styles_default[type][model](...arguments_);
};
var usedModels = ["rgb", "hex", "ansi256"];
for (const model of usedModels) {
  styles2[model] = {
    get() {
      const { level } = this;
      return function(...arguments_) {
        const styler = createStyler(getModelAnsi(model, levelMapping[level], "color", ...arguments_), ansi_styles_default.color.close, this[STYLER]);
        return createBuilder(this, styler, this[IS_EMPTY]);
      };
    }
  };
  const bgModel = "bg" + model[0].toUpperCase() + model.slice(1);
  styles2[bgModel] = {
    get() {
      const { level } = this;
      return function(...arguments_) {
        const styler = createStyler(getModelAnsi(model, levelMapping[level], "bgColor", ...arguments_), ansi_styles_default.bgColor.close, this[STYLER]);
        return createBuilder(this, styler, this[IS_EMPTY]);
      };
    }
  };
}
var proto = Object.defineProperties(() => {}, {
  ...styles2,
  level: {
    enumerable: true,
    get() {
      return this[GENERATOR].level;
    },
    set(level) {
      this[GENERATOR].level = level;
    }
  }
});
var createStyler = (open, close, parent) => {
  let openAll;
  let closeAll;
  if (parent === undefined) {
    openAll = open;
    closeAll = close;
  } else {
    openAll = parent.openAll + open;
    closeAll = close + parent.closeAll;
  }
  return {
    open,
    close,
    openAll,
    closeAll,
    parent
  };
};
var createBuilder = (self, _styler, _isEmpty) => {
  const builder = (...arguments_) => applyStyle(builder, arguments_.length === 1 ? "" + arguments_[0] : arguments_.join(" "));
  Object.setPrototypeOf(builder, proto);
  builder[GENERATOR] = self;
  builder[STYLER] = _styler;
  builder[IS_EMPTY] = _isEmpty;
  return builder;
};
var applyStyle = (self, string) => {
  if (self.level <= 0 || !string) {
    return self[IS_EMPTY] ? "" : string;
  }
  let styler = self[STYLER];
  if (styler === undefined) {
    return string;
  }
  const { openAll, closeAll } = styler;
  if (string.includes("\x1B")) {
    while (styler !== undefined) {
      string = stringReplaceAll(string, styler.close, styler.open);
      styler = styler.parent;
    }
  }
  const lfIndex = string.indexOf(`
`);
  if (lfIndex !== -1) {
    string = stringEncaseCRLFWithFirstIndex(string, closeAll, openAll, lfIndex);
  }
  return openAll + string + closeAll;
};
Object.defineProperties(createChalk.prototype, styles2);
var chalk = createChalk();
var chalkStderr = createChalk({ level: stderrColor ? stderrColor.level : 0 });
var source_default = chalk;

// utils/logger.ts
class Logger {
  static info(...args) {
    console.log(source_default.cyan("[INFO]", ...args));
  }
  static warn(...args) {
    console.log(source_default.yellow("[WARN]", ...args));
  }
  static error(...args) {
    console.log(source_default.red("[ERROR]", ...args));
  }
  static todo(...args) {
    console.log(source_default.magenta("[TODO]", ...args));
  }
}

// core/TDHRouteGenerator.ts
var __dirname = "/home/ayush/projects/FATE/core";
var DEFAULT_404 = path.join(__dirname, "../template/404.ts");
var DEFAULT_500 = path.join(__dirname, "../template/500.ts");
function listRecursiveSync(base) {
  const scan = (dir) => fs.readdirSync(dir, { withFileTypes: true }).flatMap((e) => {
    const full = path.join(dir, e.name);
    if (e.isDirectory()) {
      return scan(full);
    } else {
      return /\.(jsx|tsx|ts|js)$/.test(e.name) ? full : [];
    }
  });
  return scan(base).map((p) => path.relative(base, p).replace(/\\/g, "/"));
}
function toPathname(rel) {
  return rel.replace(/index\.(jsx|tsx|ts|js)$/, "").replace(/\([^\/]+\)\//g, "").replace(/\.(jsx|tsx|ts|js)$/, "").replace(/\.$/, "").replace(/\[([^\]]+)\]/g, ":$1");
}
async function TDHRouteGenerator() {
  const outDir = path.join(process.cwd(), ".TDH");
  const buildDir = path.join(outDir, "build");
  fs.rmSync(outDir, { recursive: true, force: true });
  fs.mkdirSync(outDir);
  fs.mkdirSync(buildDir);
  const base = RootConfig.TDH_RENDER_PATH;
  const files = listRecursiveSync(base);
  const dirLayout = {};
  const pageEntryPoints = {};
  let notFound = "";
  let internalServerError = "";
  const finalConfig = {};
  for (const rel of files) {
    const abs = path.join(base, rel);
    const isLayout = /_layout\.(tsx|jsx|ts|js)$/.test(rel);
    const is404 = /^404\.(tsx|jsx|ts|js)$/.test(rel);
    const is500 = /^500\.(tsx|jsx|ts|js)$/.test(rel);
    if (isLayout) {
      dirLayout[path.dirname(rel) === "." ? "" : path.dirname(rel)] = abs;
    } else if (is404) {
      notFound = abs;
    } else if (is500) {
      internalServerError = abs;
    } else {
      pageEntryPoints[rel] = abs;
    }
  }
  if (Object.keys(pageEntryPoints).length === 0) {
    fs.writeFileSync(path.join(outDir, "config.json"), JSON.stringify({}, null, 2));
    return;
  }
  if (!notFound) {
    notFound = DEFAULT_404;
  }
  if (!internalServerError) {
    internalServerError = DEFAULT_500;
  }
  try {
    const allEntryPoints = [
      ...Object.values(pageEntryPoints),
      ...Object.values(dirLayout)
    ];
    const result = await import_esbuild.build({
      entryPoints: allEntryPoints,
      bundle: true,
      outdir: buildDir,
      format: "esm",
      platform: "node",
      minify: true,
      sourcemap: true,
      splitting: true,
      treeShaking: true,
      metafile: true,
      absWorkingDir: process.cwd()
    });
    const specialPages = [
      { name: "404", path: notFound },
      { name: "500", path: internalServerError }
    ];
    for (const { name, path: specialPath } of specialPages) {
      const specialResult = await import_esbuild.build({
        entryPoints: [specialPath],
        bundle: true,
        outdir: buildDir,
        format: "esm",
        platform: "node",
        minify: true,
        sourcemap: true,
        splitting: false,
        treeShaking: true,
        metafile: true,
        absWorkingDir: process.cwd(),
        entryNames: name
      });
      const outputFile = findOutputFile(specialPath, specialResult);
      if (!outputFile) {
        Logger.error(`Could not find output file for ${name} page: ${specialPath}`);
        continue;
      }
      const module = (await import(outputFile)).default;
      if (!module) {
        Logger.warn(`Not a route: ${outputFile}`);
        continue;
      }
    }
    const builtLayouts = {};
    for (const [dir, layoutPath] of Object.entries(dirLayout)) {
      const outputFile = findOutputFile(layoutPath, result);
      if (outputFile) {
        builtLayouts[dir] = outputFile;
      }
    }
    for (const [rel, abs] of Object.entries(pageEntryPoints)) {
      const routePath = `/${toPathname(rel)}`;
      const segments = path.dirname(rel).split(path.sep);
      const layouts = [];
      for (let i = 0;i <= segments.length; i++) {
        const dir = segments.slice(0, i).join("/") || "";
        if (dir in builtLayouts) {
          layouts.push(builtLayouts[dir]);
        }
      }
      const outputFile = findOutputFile(abs, result);
      if (!outputFile) {
        Logger.error(`Could not find output file for ${abs}`);
        continue;
      }
      console.log(outputFile);
      const module = (await import(outputFile)).default;
      if (!module) {
        Logger.warn(`Not a route: ${outputFile}`);
        continue;
      }
      finalConfig[routePath] = {
        filepath: outputFile,
        layout: layouts.reverse()
      };
    }
  } catch (error) {
    Logger.error("Build failed:", error);
    process.exit(1);
  }
  fs.writeFileSync(path.join(outDir, "config.json"), JSON.stringify(finalConfig, null, 2));
}
function findOutputFile(absInputPath, result) {
  const relativeInput = path.relative(process.cwd(), absInputPath).replace(/\\/g, "/");
  for (const [outPath, meta] of Object.entries(result.metafile.outputs)) {
    if (meta.entryPoint && meta.entryPoint === relativeInput) {
      return path.resolve(process.cwd(), outPath);
    }
  }
  return null;
}

// core/render.ts
import path2 from "path";
import fs2 from "fs/promises";

// utils/catching.ts
class MemoryCatching {
  static catcheValues = {};
  static insertCatche(key, value, options) {
    this.catcheValues[key] = {
      ...options || {},
      value
    };
  }
  static getFromCatch(key) {
    const catche = this.catcheValues[key];
    if (!catche) {
      return null;
    }
    if (catche.expiry && new Date > catche.expiry) {
      delete this.catcheValues[key];
      return null;
    }
    return catche;
  }
}

// core/render.ts
async function getConfig() {
  const catchedConfig = MemoryCatching.getFromCatch("tdh-config");
  if (catchedConfig) {
    return catchedConfig.value;
  }
  const configDir = path2.join(process.cwd(), ".TDH", "config.json");
  const config = JSON.parse(await fs2.readFile(configDir, {
    encoding: "utf-8"
  }));
  MemoryCatching.insertCatche("tdh-config", config, {
    expiry: new Date(new Date().setDate(new Date().getDate() + 3))
  });
  return config;
}
async function render(pathname, data = {}) {
  try {
    const catche = MemoryCatching.getFromCatch(pathname);
    if (catche) {
      return catche.value;
    }
    const pageConfig = await getConfig();
    let config = pageConfig[pathname];
    let params = {};
    if (!config) {
      const matchResult = matchRoute(pathname, pageConfig);
      if (matchResult) {
        config = matchResult.config;
        params = matchResult.params;
      }
    }
    if (!config) {
      const notFountDir = path2.join(process.cwd(), ".TDH", "build");
      const page = (await import(path2.join(notFountDir, "404.js"))).default;
      const layoutInstance = (await import(path2.join(notFountDir, "_layout.js"))).default;
      const pagedata = await page.render(null);
      const layout = await layoutInstance.render(null, pagedata);
      return layout;
    }
    const pageRender = (await import(config.filepath)).default;
    let htmlString = await pageRender.render({ ...data, params });
    for (const layout of config.layout) {
      const layoutInstance = (await import(layout)).default;
      htmlString = layoutInstance.render({ ...data, params }, htmlString);
    }
    MemoryCatching.insertCatche(pathname, htmlString, {
      expiry: new Date(Date.now() + (RootConfig.TDH_TTL || 120) * 1000)
    });
    return htmlString;
  } catch (error) {
    Logger.error(error);
    const notFountDir = path2.join(process.cwd(), ".TDH", "build");
    const page = (await import(path2.join(notFountDir, "500.js"))).default;
    const layoutInstance = (await import(path2.join(notFountDir, "_layout.js"))).default;
    const pagedata = await page.render(error);
    const layout = await layoutInstance.render(null, pagedata);
    return layout;
  }
}
function matchRoute(pathname, pageConfig) {
  const pathSegments = pathname.split("/").filter(Boolean);
  for (const [route, config] of Object.entries(pageConfig)) {
    const routeSegments = route.split("/").filter(Boolean);
    if (pathSegments.length !== routeSegments.length) {
      continue;
    }
    const params = {};
    let isMatch = true;
    for (let i = 0;i < routeSegments.length; i++) {
      const routeSegment = routeSegments[i];
      const pathSegment = pathSegments[i];
      if (routeSegment.startsWith(":")) {
        const paramName = routeSegment.slice(1);
        params[paramName] = pathSegment;
      } else if (routeSegment !== pathSegment) {
        isMatch = false;
        break;
      }
    }
    if (isMatch) {
      return { config, params };
    }
  }
  return null;
}

// core/TDHPages.ts
class TDHPages {
  render;
  type;
  preventCatcheContent;
  constructor(render2, type, preventCatcheContent) {
    this.render = render2;
    this.type = type;
    this.preventCatcheContent = preventCatcheContent;
  }
}
function generateTDHPage(options) {
  return new TDHPages(options.render, options.type || "dynamic", options.preventCatcheContent);
}
// core/TDHLayout.ts
class TDHLayout {
  render;
  type;
  preventCatcheContent;
  constructor(render2, type, preventCatcheContent) {
    this.render = render2;
    this.type = type;
    this.preventCatcheContent = preventCatcheContent;
  }
}
function generateTDHLayout(options) {
  return new TDHLayout(options.render, options.type || "dynamic", options.preventCatcheContent);
}
// index.ts
class TDH {
  static __init__(config) {
    RootConfig.TDH_EXICUTION_MODE = config?.TDH_EXICUTION_MODE || "development";
    RootConfig.TDH_REDIS_CONNECTION_URL = config?.TDH_REDIS_CONNECTION_URL;
    RootConfig.TDH_TTL = config?.TDH_TTL;
    RootConfig.TDH_RENDER_PATH = config?.TDH_RENDER_PATH || path3.join(process.cwd(), "views");
    Logger.info("Preparing for configuring");
    TDHRouteGenerator().then(() => {
      Logger.info("Configuration complete, all pages will be now available");
    }).catch((error) => {
      Logger.error(error, `
Application still running but might now be able to serve pages`);
    });
  }
  static render = render;
}
export {
  generateTDHPage,
  generateTDHLayout,
  TDH as default,
  TDHPages,
  TDHLayout
};
