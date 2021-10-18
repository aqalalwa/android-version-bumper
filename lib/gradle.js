"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.setVersionProperties = exports.getVersionProperties = exports.doesVersionPropertiesExist = void 0;
const doesVersionPropertiesExist = (fs, releaseFlavor) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const fileNamePrefix = releaseFlavor ? `${releaseFlavor}.` : '';
        const file = yield fs.readFile(`${fileNamePrefix}version.properties`);
        return (file === null || file === void 0 ? void 0 : file.toString().length) > 0;
    }
    catch (e) {
        return false;
    }
});
exports.doesVersionPropertiesExist = doesVersionPropertiesExist;
const getVersionProperties = (toolkit, releaseFlavor) => __awaiter(void 0, void 0, void 0, function* () {
    const fileNamePrefix = releaseFlavor ? `${releaseFlavor}.` : '';
    const file = (yield toolkit.readFile(`${fileNamePrefix}version.properties`)).toString();
    const major = file.match(/(majorVersion=)(\d+)/);
    const minor = file.match(/(minorVersion=)(\d+)/);
    const patch = file.match(/(patchVersion=)(\d+)/);
    return {
        major: major && major.length > 1 ? Number.parseInt(major[2]) : 0,
        minor: minor && minor.length > 1 ? Number.parseInt(minor[2]) : 0,
        patch: patch && patch.length > 1 ? Number.parseInt(patch[2]) : 0,
    };
});
exports.getVersionProperties = getVersionProperties;
const setVersionProperties = (fs, toolkit, { major, minor, patch, build }, releaseFlavor) => __awaiter(void 0, void 0, void 0, function* () {
    const contents = [
        `majorVersion=${major}`,
        `minorVersion=${minor}`,
        `patchVersion=${patch}`,
        `buildNumber=${build !== null && build !== void 0 ? build : ''}`,
    ].join('\n');
    const fileNamePrefix = releaseFlavor ? `${releaseFlavor}.` : '';
    yield fs.writeFile(`${fileNamePrefix}version.properties`, contents);
    yield toolkit.exec('cat', [`${fileNamePrefix}version.properties`]);
});
exports.setVersionProperties = setVersionProperties;
