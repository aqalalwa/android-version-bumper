"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const version_1 = require("./version");
const currentVersion = { major: 1, minor: 2, patch: 3 };
describe('version', () => {
    describe('isMajorBump', () => {
        it('should return true when the commit message contains an uppercase breaking change', () => {
            expect((0, version_1.isMajorBump)('chore: BREAKING CHANGE removed support for node 10')).toBeTruthy();
        });
        it('should return false when message does not contain an intent', () => {
            expect((0, version_1.isMajorBump)('chore removed support for node 10')).toBeFalsy();
        });
        it('should return false when intent does not exist', () => {
            expect((0, version_1.isMajorBump)('removed support for : character')).toBeFalsy();
        });
        it('should return true when message contain an exclamation mark', () => {
            expect((0, version_1.isMajorBump)('chore!: removed support for node 10')).toBeTruthy();
        });
        it('should return true when message starts with major', () => {
            expect((0, version_1.isMajorBump)('major: removed support for node 10')).toBeTruthy();
        });
        it('should return true when message is uppercase', () => {
            expect((0, version_1.isMajorBump)('BREAKING CHANGE: removed support for node 10')).toBeTruthy();
        });
        it('should return true when message contains brackets', () => {
            expect((0, version_1.isMajorBump)('feat(node): BREAKING CHANGE removed support for node 10')).toBeTruthy();
        });
        it('should return false if post intent clause contains an exclamation mark, but the intent does not', () => {
            expect((0, version_1.isMajorBump)('chore: did something!')).toBeFalsy();
        });
        it('should return false otherwise', () => {
            expect((0, version_1.isMajorBump)('chore: did something')).toBeFalsy();
        });
    });
    describe('isMinorBump', () => {
        it('should return true for feat', () => {
            expect((0, version_1.isMinorBump)('feat: add user login')).toBeTruthy();
        });
        it('should return true for minor', () => {
            expect((0, version_1.isMinorBump)('minor: add user login')).toBeTruthy();
        });
        it('should return true for feat when capitalised', () => {
            expect((0, version_1.isMinorBump)('FEAT: add user login')).toBeTruthy();
        });
        it('should return true for feat when containing brackets', () => {
            expect((0, version_1.isMinorBump)('feat(registration flow): add user login')).toBeTruthy();
        });
        it('should return false otherwise', () => {
            expect((0, version_1.isMinorBump)('chore: add user login')).toBeFalsy();
        });
    });
    describe('isPatchBump', () => {
        it.each([
            'build',
            'chore',
            'ci',
            'docs',
            'fix',
            'perf',
            'refactor',
            'revert',
            'style',
            'test',
        ])('should return true for %p', (intent) => {
            const commit = `${intent}: did something`;
            expect((0, version_1.isPatchBump)(commit)).toBeTruthy();
        });
        it('should return true when intent is uppercase', () => {
            expect((0, version_1.isPatchBump)('CHORE: did something')).toBeTruthy();
        });
        it('should return true when intent is patch', () => {
            expect((0, version_1.isPatchBump)('patch: did something')).toBeTruthy();
        });
        it('should return false otherwise', () => {
            expect((0, version_1.isPatchBump)('feat: add user login')).toBeFalsy();
        });
    });
    describe('isSemanticCommit', () => {
        it('should return false on no intent', () => {
            expect((0, version_1.isSemanticCommit)('did something')).toBeFalsy();
        });
        it('should return false on no colon with a scope', () => {
            expect((0, version_1.isSemanticCommit)('chore(something) did something')).toBeFalsy();
        });
        it('should return false on no colon', () => {
            expect((0, version_1.isSemanticCommit)('chore did something')).toBeFalsy();
        });
        it('should return true on containing brackets', () => {
            expect((0, version_1.isSemanticCommit)('chore(something): did something')).toBeTruthy();
        });
        it('should return true on containing no brackets', () => {
            expect((0, version_1.isSemanticCommit)('chore: did something')).toBeTruthy();
        });
    });
    describe('getReleaseVersion', () => {
        it('should bump patch by default on no semantic commits', () => {
            const commits = ['did something', 'did something else'];
            const build = (0, version_1.bumpBuild)(commits, currentVersion);
            expect(build).toEqual({
                version: {
                    major: 1,
                    minor: 2,
                    patch: 4,
                },
                code: 10204,
                name: '1.2.4',
            });
        });
        it('should bump major and release minor and patch', () => {
            const commits = [
                'feat: BREAKING CHANGE did something',
                'feat!: did something else',
            ];
            const build = (0, version_1.bumpBuild)(commits, currentVersion);
            expect(build).toEqual({
                version: {
                    major: 2,
                    minor: 0,
                    patch: 0,
                },
                code: 20000,
                name: '2.0.0',
            });
        });
        it('should bump minor, keep major the same and reset patch', () => {
            const commits = ['feat: did something'];
            const build = (0, version_1.bumpBuild)(commits, currentVersion);
            expect(build).toEqual({
                code: 10300,
                name: '1.3.0',
                version: {
                    major: 1,
                    minor: 3,
                    patch: 0,
                },
            });
        });
        it('should bump patch, and keep major & minor the same', () => {
            const commits = ['chore: did something'];
            const build = (0, version_1.bumpBuild)(commits, currentVersion);
            expect(build).toEqual({
                code: 10204,
                name: '1.2.4',
                version: {
                    major: 1,
                    minor: 2,
                    patch: 4,
                },
            });
        });
        it('should bump patch on nonsensical semantic commit', () => {
            const commits = ['qwerty: did something'];
            const build = (0, version_1.bumpBuild)(commits, currentVersion);
            expect(build).toEqual({
                code: 10204,
                name: '1.2.4',
                version: {
                    major: 1,
                    minor: 2,
                    patch: 4,
                },
            });
        });
    });
});
