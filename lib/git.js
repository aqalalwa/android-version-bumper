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
exports.pushChanges = exports.createCommit = exports.setGitIdentity = void 0;
const setGitIdentity = (toolkit) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const defaultName = 'Automated Version Bump';
    const name = (_a = process.env.GITHUB_USER) !== null && _a !== void 0 ? _a : defaultName;
    toolkit.log.log(`Setting git config name to ${name}`);
    yield toolkit.exec('git', ['config', 'user.name', name]);
    const defaultEmail = 'android-semantic-release@users.noreply.github.com';
    const email = (_b = process.env.GITHUB_EMAIL) !== null && _b !== void 0 ? _b : defaultEmail;
    toolkit.log.log(`Setting git config email to ${email}`);
    yield toolkit.exec('git', ['config', 'user.email', email]);
});
exports.setGitIdentity = setGitIdentity;
const createCommit = (toolkit, commit, releaseFlavor) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const fileNamePrefix = releaseFlavor ? `${releaseFlavor}.` : '';
        toolkit.log.log(`Creating version commit`);
        toolkit.log.log({ commit });
        yield toolkit.exec('git', ['add', `${fileNamePrefix}version.properties`]);
        yield toolkit.exec('git', ['commit', '-m', commit]);
    }
    catch (e) {
        toolkit.log.warn(`Commit failed, but this shouldn't be a problem if you are using actions/checkout@v2`);
    }
});
exports.createCommit = createCommit;
const pushChanges = (toolkit, version, publishTag) => __awaiter(void 0, void 0, void 0, function* () {
    const remote = [
        'https://',
        process.env.GITHUB_ACTOR,
        ':',
        process.env.GITHUB_TOKEN,
        '@github.com/',
        process.env.GITHUB_REPOSITORY,
        '.git',
    ].join('');
    if (publishTag) {
        toolkit.log.log('Publishing tag');
        yield toolkit.exec('git', ['tag', version]);
        yield toolkit.exec('git', ['push', remote, '--follow-tags']);
        yield toolkit.exec('git', ['push', remote, '--tags']);
    }
    else {
        toolkit.log.log('Not publishing tag, pushing instead');
        yield toolkit.exec('git', ['push', remote]);
    }
});
exports.pushChanges = pushChanges;
