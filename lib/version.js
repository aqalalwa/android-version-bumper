"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.bumpBuild = exports.getBuildFromVersion = exports.getVersionCode = exports.getVersionName = exports.isSemanticCommit = exports.isPatchBump = exports.isMinorBump = exports.isMajorBump = void 0;
const getCommitIntent = (message) => {
    const [commitIntent] = message.toLowerCase().split(':');
    return commitIntent;
};
const isMajorBump = (message) => {
    if (message.includes('BREAKING CHANGE')) {
        return true;
    }
    const commitIntent = getCommitIntent(message);
    if (commitIntent.includes('!')) {
        return true;
    }
    const intents = ['major'];
    return intents.some((intent) => commitIntent.startsWith(intent));
};
exports.isMajorBump = isMajorBump;
const isMinorBump = (message) => {
    const intents = ['minor', 'feat'];
    const commitIntent = getCommitIntent(message);
    return intents.some((intent) => commitIntent.startsWith(intent));
};
exports.isMinorBump = isMinorBump;
const isPatchBump = (message) => {
    const intents = [
        'patch',
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
    ];
    const commitIntent = getCommitIntent(message);
    return intents.some((intent) => commitIntent.startsWith(intent));
};
exports.isPatchBump = isPatchBump;
const isSemanticCommit = (message) => {
    return /^([a-zA-Z]+)(\(.+\))?(!)?:/.test(message);
};
exports.isSemanticCommit = isSemanticCommit;
const getVersionName = ({ major, minor, patch, build, }) => {
    const versionName = `${major}.${minor}.${patch}`;
    return build ? `${versionName}.${build}` : versionName;
};
exports.getVersionName = getVersionName;
const getVersionCode = ({ major, minor, patch }) => {
    return major * 10000 + minor * 100 + patch;
};
exports.getVersionCode = getVersionCode;
const getBuildFromVersion = (version) => {
    return {
        version,
        name: (0, exports.getVersionName)(version),
        code: (0, exports.getVersionCode)(version),
    };
};
exports.getBuildFromVersion = getBuildFromVersion;
const bumpBuild = (commits, currentVersion, buildNumber) => {
    const semanticCommits = commits.filter(exports.isSemanticCommit);
    const isMajor = semanticCommits.some(exports.isMajorBump);
    if (isMajor) {
        const next = {
            major: currentVersion.major + 1,
            minor: 0,
            patch: 0,
        };
        if (buildNumber) {
            next.build = buildNumber;
        }
        return {
            version: next,
            name: (0, exports.getVersionName)(next),
            code: (0, exports.getVersionCode)(next),
        };
    }
    const isMinor = semanticCommits.some(exports.isMinorBump);
    if (isMinor) {
        const next = {
            major: currentVersion.major,
            minor: currentVersion.minor + 1,
            patch: 0,
        };
        if (buildNumber) {
            next.build = buildNumber;
        }
        return {
            version: next,
            name: (0, exports.getVersionName)(next),
            code: (0, exports.getVersionCode)(next),
        };
    }
    // bump patch by default
    const next = {
        major: currentVersion.major,
        minor: currentVersion.minor,
        patch: currentVersion.patch + 1,
    };
    if (buildNumber) {
        next.build = buildNumber;
    }
    return {
        version: next,
        name: (0, exports.getVersionName)(next),
        code: (0, exports.getVersionCode)(next),
    };
};
exports.bumpBuild = bumpBuild;
