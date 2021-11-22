"use strict";
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
exports.removeOverSizedChunks = exports.mergeFromIndexSet = exports.createIndexSet = void 0;
exports.createIndexSet = function (data) {
    return data.reduce(function (acc, item) { return ({
        lastIndex: acc.lastIndex + item.length,
        built: acc.built.concat([[acc.lastIndex, acc.lastIndex + item.length]])
    }); }, { lastIndex: 0, built: [] }).built;
};
exports.mergeFromIndexSet = function (arr, indexes) {
    return indexes.map(function (_a) {
        var _b = __read(_a, 2), before = _b[0], after = _b[1];
        return arr.slice(before, after);
    });
};
exports.removeOverSizedChunks = function (callsLength, chunkSizes) {
    var hasOverSizedChunks = chunkSizes.some(function (chunkSize) { return chunkSize > callsLength; });
    if (!hasOverSizedChunks)
        return chunkSizes;
    var noOverSizedChunks = chunkSizes.filter(function (chunkSize) { return chunkSize < callsLength; });
    return __spread([callsLength], noOverSizedChunks);
};
