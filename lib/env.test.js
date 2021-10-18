"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jest_mock_extended_1 = require("jest-mock-extended");
const env_1 = require("./env");
const toolkit = (0, jest_mock_extended_1.mock)();
const build = {
    version: {
        major: 1,
        minor: 2,
        patch: 3,
    },
    name: '1.2.3',
    code: 123,
};
describe('Env', () => {
    beforeEach(() => {
        jest.resetAllMocks();
    });
    describe('getCommitMessage', () => {
        it('should default message on none set', () => {
            toolkit.inputs['commit_message'] = undefined;
            const result = (0, env_1.getCommitMessage)(toolkit, build, 'v', false);
            expect(result).toEqual('release: v1.2.3');
        });
        it('should default message on empty string', () => {
            toolkit.inputs['commit_message'] = '';
            const result = (0, env_1.getCommitMessage)(toolkit, build, 'v', false);
            expect(result).toEqual('release: v1.2.3');
        });
        it('should set message from toolkit set', () => {
            toolkit.inputs['commit_message'] = 'release: new version!';
            const result = (0, env_1.getCommitMessage)(toolkit, build, 'v', false);
            expect(result).toEqual('release: new version!');
        });
        it('should replace {{version}} with actual version on custom message', () => {
            toolkit.inputs['commit_message'] = 'release: new version {{version}}';
            const result = (0, env_1.getCommitMessage)(toolkit, build, 'v', false);
            expect(result).toEqual('release: new version v1.2.3');
        });
        it('should allow empty tag prefix', () => {
            toolkit.inputs['commit_message'] = undefined;
            const result = (0, env_1.getCommitMessage)(toolkit, build, '', false);
            expect(result).toEqual('release: 1.2.3');
        });
        it('should allow ci skip', () => {
            toolkit.inputs['commit_message'] = undefined;
            const result = (0, env_1.getCommitMessage)(toolkit, build, 'v', true);
            expect(result).toEqual('release: v1.2.3 [skip-ci]');
        });
        it('should allow ci skip on custom message', () => {
            toolkit.inputs['commit_message'] = 'release: new release!';
            const result = (0, env_1.getCommitMessage)(toolkit, build, 'v', true);
            expect(result).toEqual('release: new release! [skip-ci]');
        });
    });
});
