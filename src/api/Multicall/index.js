"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
var __spread = (this && this.__spread) || function () {
    for (var ar = [], i = 0; i < arguments.length; i++) ar = ar.concat(__read(arguments[i]));
    return ar;
};
exports.__esModule = true;
exports.MultiCall = exports.DataTypes = void 0;
var abi_1 = require("./abi");
var lodash_1 = require("lodash");
var helpers_1 = require("./helpers");
var DataTypes;
(function (DataTypes) {
    DataTypes["originAddress"] = "originAddress";
})(DataTypes = exports.DataTypes || (exports.DataTypes = {}));
var MultiCall = /** @class */ (function () {
    function MultiCall(web3, contract, chunkSizes) {
        if (contract === void 0) { contract = "0x5Eb3fa2DFECdDe21C950813C665E9364fa609bD2"; }
        if (chunkSizes === void 0) { chunkSizes = [300, 100, 25]; }
        this.web3 = web3;
        this.contract = contract;
        this.chunkSizes = chunkSizes;
        var isNumbersAndAtLeastOne = chunkSizes.every(function (number) { return lodash_1.isNumber(number); }) && chunkSizes.length > 0;
        if (!isNumbersAndAtLeastOne)
            throw new Error("Chunk sizes must be numbers and at least one");
    }
    MultiCall.prototype.rawCall = function (calls, strict, blockHeight) {
        if (strict === void 0) { strict = false; }
        return __awaiter(this, void 0, void 0, function () {
            var multiContract, callArgs, res, matched, e_1;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        multiContract = new this.web3.eth.Contract(abi_1.ABIMultiCallContract, this.contract);
                        _b.label = 1;
                    case 1:
                        _b.trys.push([1, 3, , 4]);
                        callArgs = blockHeight ? [null, blockHeight] : [];
                        return [4 /*yield*/, (_a = multiContract.methods
                                .aggregateStrict(calls, strict)).call.apply(_a, __spread(callArgs))];
                    case 2:
                        res = _b.sent();
                        matched = lodash_1.zip(calls.map(function (_a) {
                            var _b = __read(_a, 1), address = _b[0];
                            return address;
                        }), res.returnData);
                        return [2 /*return*/, matched];
                    case 3:
                        e_1 = _b.sent();
                        throw new Error(e_1);
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    MultiCall.prototype.multiCallGroups = function (calls, blockHeight) {
        return __awaiter(this, void 0, void 0, function () {
            var indexes, flatCalls, res;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (calls.length == 0)
                            return [2 /*return*/, []];
                        indexes = helpers_1.createIndexSet(calls);
                        flatCalls = calls.flat(1);
                        return [4 /*yield*/, this.rawCallInChunks(flatCalls, this.chunkSizes, blockHeight)];
                    case 1:
                        res = _a.sent();
                        return [2 /*return*/, helpers_1.mergeFromIndexSet(res, indexes)];
                }
            });
        });
    };
    MultiCall.prototype.rawCallInChunks = function (calls, chunkSizes, blockHeight) {
        return __awaiter(this, void 0, void 0, function () {
            var chunksNoBiggerThanRequests, chunks, res, allFulfilled, allFailedAndLastChunk, working;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        chunksNoBiggerThanRequests = helpers_1.removeOverSizedChunks(calls.length, chunkSizes);
                        chunks = lodash_1.chunk(calls, chunksNoBiggerThanRequests[0]);
                        return [4 /*yield*/, Promise.all(chunks.map(function (chunk) { return __awaiter(_this, void 0, void 0, function () {
                                var requests, result, e_2;
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0:
                                            requests = chunk;
                                            _a.label = 1;
                                        case 1:
                                            _a.trys.push([1, 3, , 4]);
                                            return [4 /*yield*/, this.rawCall(chunk, false, blockHeight)];
                                        case 2:
                                            result = _a.sent();
                                            return [2 /*return*/, {
                                                    success: true,
                                                    requests: requests,
                                                    result: result
                                                }];
                                        case 3:
                                            e_2 = _a.sent();
                                            return [2 /*return*/, {
                                                    success: false,
                                                    requests: requests,
                                                    error: e_2.message
                                                }];
                                        case 4: return [2 /*return*/];
                                    }
                                });
                            }); }))];
                    case 1:
                        res = _a.sent();
                        allFulfilled = res.every(function (res) { return res.success; });
                        allFailedAndLastChunk = chunksNoBiggerThanRequests.length == 1 &&
                            res.every(function (res) { return !res.success; });
                        if (!allFulfilled) return [3 /*break*/, 2];
                        return [2 /*return*/, res.flatMap(function (x) { return x.result; })];
                    case 2:
                        if (!allFailedAndLastChunk) return [3 /*break*/, 3];
                        throw new Error("All requests failed on last chunk " + res[0].error);
                    case 3: return [4 /*yield*/, Promise.all(res.map(function (res) { return __awaiter(_this, void 0, void 0, function () {
                            var newChunkSize;
                            return __generator(this, function (_a) {
                                if (res.success) {
                                    return [2 /*return*/, res.result];
                                }
                                newChunkSize = chunksNoBiggerThanRequests.slice(1);
                                if (newChunkSize.length == 0)
                                    throw new Error("Failed request " + res.error);
                                return [2 /*return*/, this.rawCallInChunks(res.requests, newChunkSize, blockHeight)];
                            });
                        }); }))];
                    case 4:
                        working = _a.sent();
                        return [2 /*return*/, working.flat(1)];
                }
            });
        });
    };
    MultiCall.prototype.decodeHex = function (hex, type) {
        var typeIsArray = Array.isArray(type);
        try {
            if (typeIsArray) {
                return this.web3.eth.abi.decodeParameters(type, hex);
            }
            else {
                return this.web3.eth.abi.decodeParameter(type, hex);
            }
        }
        catch (e) {
            return undefined;
        }
    };
    MultiCall.prototype.normalCall = function (groupsOfShapes, blockHeight) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, Promise.all(groupsOfShapes.map(function (group) { return __awaiter(_this, void 0, void 0, function () {
                        var _this = this;
                        return __generator(this, function (_a) {
                            return [2 /*return*/, Promise.all(group.map(function (shape) { return __awaiter(_this, void 0, void 0, function () {
                                    var originAddresses, firstOriginAddress, sameOriginAddress, callArgs, _a, _b;
                                    var _this = this;
                                    return __generator(this, function (_c) {
                                        switch (_c.label) {
                                            case 0:
                                                originAddresses = Object.values(shape).map(function (abi) { return abi._parent._address; });
                                                firstOriginAddress = originAddresses[0];
                                                sameOriginAddress = originAddresses.every(function (address) { return address == firstOriginAddress; });
                                                if (!sameOriginAddress)
                                                    throw new Error("Shape group must have the same origin address");
                                                callArgs = blockHeight ? [null, blockHeight] : [];
                                                _a = {
                                                    _originAddress: firstOriginAddress
                                                };
                                                _b = lodash_1.fromPairs;
                                                return [4 /*yield*/, Promise.all(lodash_1.toPairs(shape).map(function (_a) {
                                                        var _b = __read(_a, 2), label = _b[0], abi = _b[1];
                                                        return __awaiter(_this, void 0, void 0, function () {
                                                            var _c;
                                                            return __generator(this, function (_d) {
                                                                switch (_d.label) {
                                                                    case 0:
                                                                        _c = [label];
                                                                        return [4 /*yield*/, abi.call.apply(abi, __spread(callArgs))["catch"](function () { })];
                                                                    case 1: return [2 /*return*/, _c.concat([
                                                                            _d.sent()
                                                                        ])];
                                                                }
                                                            });
                                                        });
                                                    }))];
                                            case 1: return [2 /*return*/, (_a.data = _b.apply(void 0, [_c.sent()]),
                                                    _a)];
                                        }
                                    });
                                }); }))];
                        });
                    }); }))];
            });
        });
    };
    MultiCall.prototype.encodeAbi = function (groupsOfShapes) {
        return groupsOfShapes.map(function (group) {
            return group.map(function (shape) {
                var originAddresses = Object.values(shape).map(function (abi) { return abi._parent._address; });
                var sameOriginAddress = originAddresses.every(function (address, index, arr) { return address === arr[0]; });
                if (!sameOriginAddress)
                    throw new Error("Shape group must have the same origin address");
                var originAddress = originAddresses[0];
                return {
                    originAddress: originAddress,
                    data: lodash_1.mapValues(shape, function (abi) { return abi.encodeABI(); })
                };
            });
        });
    };
    MultiCall.prototype.stripLabels = function (groupsOfShapes) {
        return groupsOfShapes.map(function (group) {
            return group.map(function (relay) {
                var pairs = lodash_1.toPairs(relay);
                var keysToRemove = pairs
                    .filter(function (_a) {
                    var _b = __read(_a, 2), key = _b[0], value = _b[1];
                    return typeof value == "string";
                })
                    .map(function (_a) {
                    var _b = __read(_a, 1), key = _b[0];
                    return key;
                });
                return lodash_1.omit(relay, keysToRemove);
            });
        });
    };
    MultiCall.prototype.recoverLabels = function (original, withData) {
        var nameRecall = lodash_1.zip(original, withData);
        var toReturn = nameRecall.map(function (_a) {
            var _b = __read(_a, 2), plainShape = _b[0], withOrigin = _b[1];
            var zipped = lodash_1.zip(plainShape, withOrigin);
            return zipped.map(function (_a) {
                var _b = __read(_a, 2), plain = _b[0], origin = _b[1];
                var originAddressKey = "_originAddress";
                var originAddress = origin[originAddressKey];
                var keysToAdd = lodash_1.toPairs(plain)
                    .filter(function (_a) {
                    var _b = __read(_a, 2), key = _b[0], value = _b[1];
                    return typeof value == "string";
                })
                    .map(function (_a) {
                    var _b = __read(_a, 2), key = _b[0], value = _b[1];
                    return [
                        key,
                        value == DataTypes.originAddress
                            ? originAddress
                            : value,
                    ];
                });
                var keysAdded = keysToAdd.reduce(function (acc, _a) {
                    var _b;
                    var _c = __read(_a, 2), key = _c[0], value = _c[1];
                    return (__assign(__assign({}, acc), (_b = {}, _b[key] = value, _b)));
                }, origin);
                var big = lodash_1.omit(keysAdded, originAddressKey);
                var noData = lodash_1.omit(big, "data");
                return __assign(__assign({}, noData), big.data);
            });
        });
        return toReturn;
    };
    MultiCall.prototype.all = function (groupsOfShapes, passedOptions) {
        return __awaiter(this, void 0, void 0, function () {
            var flattenedAmount, defaultOptions, options, skipDecode, traditional, blockHeight, plainShapes, normalEncoded, flattened, propertiesCount, abiEncodedGroups, groupsIndexSet, multiCalls, res, rebuiltRes, answer, better, rawMatch, withOrigin, renamed;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        flattenedAmount = groupsOfShapes.flat(9).length;
                        if (flattenedAmount == 0)
                            return [2 /*return*/, groupsOfShapes];
                        defaultOptions = {
                            skipDecode: false,
                            traditional: false,
                            blockHeight: undefined
                        };
                        options = __assign(__assign({}, defaultOptions), passedOptions);
                        skipDecode = options.skipDecode, traditional = options.traditional, blockHeight = options.blockHeight;
                        plainShapes = this.stripLabels(groupsOfShapes);
                        if (!traditional) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.normalCall(plainShapes, blockHeight)];
                    case 1:
                        normalEncoded = _a.sent();
                        flattened = normalEncoded.flat(2);
                        propertiesCount = flattened.reduce(function (acc, item) { return Object.keys(item.data).length + acc; }, 0);
                        return [2 /*return*/, this.recoverLabels(groupsOfShapes, normalEncoded)];
                    case 2:
                        abiEncodedGroups = this.encodeAbi(plainShapes);
                        groupsIndexSet = helpers_1.createIndexSet(groupsOfShapes);
                        multiCalls = abiEncodedGroups.flatMap(function (encodedGroup) {
                            return encodedGroup.map(function (group) {
                                return Object.values(group.data).map(function (encodedString) {
                                    return [group.originAddress, encodedString];
                                });
                            });
                        });
                        return [4 /*yield*/, this.multiCallGroups(multiCalls, blockHeight)];
                    case 3:
                        res = _a.sent();
                        rebuiltRes = helpers_1.mergeFromIndexSet(res, groupsIndexSet);
                        answer = lodash_1.zip(plainShapes, rebuiltRes);
                        better = answer.map(function (_a) {
                            var _b = __read(_a, 2), abi = _b[0], res = _b[1];
                            return lodash_1.zip(abi, res);
                        });
                        rawMatch = better.map(function (group) {
                            return group.map(function (_a) {
                                var _b = __read(_a, 2), shape = _b[0], resultsArr = _b[1];
                                return lodash_1.zip(lodash_1.toPairs(shape), resultsArr);
                            });
                        });
                        withOrigin = rawMatch.map(function (group) {
                            return group.map(function (keys) {
                                return keys.reduce(function (acc, _a) {
                                    var _b;
                                    var _c = __read(_a, 2), _d = __read(_c[0], 2), key = _d[0], value = _d[1], _e = __read(_c[1], 2), origin = _e[0], _f = _e[1], success = _f.success, data = _f.data;
                                    var callReturn = value;
                                    var result = skipDecode
                                        ? data
                                        : success
                                            ? _this.decodeHex(data, callReturn._method.outputs.length == 1
                                                ? callReturn._method.outputs[0].type
                                                : callReturn._method.outputs.map(function (x) { return x.type; }))
                                            : undefined;
                                    return __assign(__assign({}, acc), (_b = { _originAddress: origin }, _b[key] = result, _b));
                                }, {});
                            });
                        });
                        renamed = this.recoverLabels(groupsOfShapes, withOrigin);
                        return [2 /*return*/, renamed];
                }
            });
        });
    };
    return MultiCall;
}());
exports.MultiCall = MultiCall;
