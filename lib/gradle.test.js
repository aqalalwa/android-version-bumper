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
const jest_mock_extended_1 = require("jest-mock-extended");
const gradle_1 = require("./gradle");
const toolkit = (0, jest_mock_extended_1.mock)();
const fs = (0, jest_mock_extended_1.mock)();
describe('Gradle', () => {
    beforeEach(() => {
        jest.resetAllMocks();
    });
    describe('doesVersionPropertiesExist', () => {
        it('should return false on exception', () => __awaiter(void 0, void 0, void 0, function* () {
            fs.readFile.mockImplementation(() => __awaiter(void 0, void 0, void 0, function* () {
                throw new Error();
            }));
            yield expect((0, gradle_1.doesVersionPropertiesExist)(fs, '')).resolves.toBeFalsy();
        }));
        it('should return false on empty file', () => __awaiter(void 0, void 0, void 0, function* () {
            fs.readFile.mockImplementation(() => __awaiter(void 0, void 0, void 0, function* () { return ''; }));
            yield expect((0, gradle_1.doesVersionPropertiesExist)(fs, '')).resolves.toBeFalsy();
        }));
        it('should return true on file containing text', () => __awaiter(void 0, void 0, void 0, function* () {
            fs.readFile.mockImplementation(() => __awaiter(void 0, void 0, void 0, function* () { return 'majorVersion=1'; }));
            yield expect((0, gradle_1.doesVersionPropertiesExist)(fs, '')).resolves.toBeTruthy();
        }));
    });
    describe('getVersionProperties', () => {
        it('should return parsed version', () => __awaiter(void 0, void 0, void 0, function* () {
            toolkit.readFile.mockImplementation(() => __awaiter(void 0, void 0, void 0, function* () {
                return `
          majorVersion=1
          minorVersion=2
          patchVersion=3
          buildNumber=
        `;
            }));
            yield expect((0, gradle_1.getVersionProperties)(toolkit, '')).resolves.toEqual({
                major: 1,
                minor: 2,
                patch: 3,
            });
        }));
        it('should return 0.0.0 on error', () => __awaiter(void 0, void 0, void 0, function* () {
            toolkit.readFile.mockImplementation(() => __awaiter(void 0, void 0, void 0, function* () {
                return `
          majorVersion=
          minorVersion=
          patchVersion=
          buildNumber=
        `;
            }));
            yield expect((0, gradle_1.getVersionProperties)(toolkit, '')).resolves.toEqual({
                major: 0,
                minor: 0,
                patch: 0,
            });
        }));
        it('should parse 10 as integer and not stringified truncation', () => __awaiter(void 0, void 0, void 0, function* () {
            toolkit.readFile.mockImplementation(() => __awaiter(void 0, void 0, void 0, function* () {
                return `
          majorVersion=1
          minorVersion=0
          patchVersion=10
          buildNumber=
        `;
            }));
            yield expect((0, gradle_1.getVersionProperties)(toolkit, '')).resolves.toEqual({
                major: 1,
                minor: 0,
                patch: 10,
            });
        }));
        it('should return 0.0.0 on empty file', () => __awaiter(void 0, void 0, void 0, function* () {
            toolkit.readFile.mockImplementation(() => __awaiter(void 0, void 0, void 0, function* () { return ''; }));
            yield expect((0, gradle_1.getVersionProperties)(toolkit, '')).resolves.toEqual({
                major: 0,
                minor: 0,
                patch: 0,
            });
        }));
    });
});
