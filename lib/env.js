"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCommitMessage = exports.getReleaseFlavor = exports.getBuildNumber = exports.isSkippingCi = exports.getTagPrefix = exports.getGradleLocation = exports.getValue = void 0;
const getValue = (toolkit, key, fallback) => {
    var _a, _b;
    return (_b = (_a = toolkit.inputs[key]) !== null && _a !== void 0 ? _a : fallback) !== null && _b !== void 0 ? _b : '';
};
exports.getValue = getValue;
const getGradleLocation = (toolkit) => {
    return (0, exports.getValue)(toolkit, 'gradle_location', 'app/build.gradle');
};
exports.getGradleLocation = getGradleLocation;
const getTagPrefix = (toolkit) => {
    return (0, exports.getValue)(toolkit, 'tag_prefix', 'v');
};
exports.getTagPrefix = getTagPrefix;
const isSkippingCi = (toolkit) => {
    return (0, exports.getValue)(toolkit, 'skip_ci', 'true') === 'true';
};
exports.isSkippingCi = isSkippingCi;
const getBuildNumber = (toolkit) => {
    return (0, exports.getValue)(toolkit, 'build_number', '');
};
exports.getBuildNumber = getBuildNumber;
const getReleaseFlavor = (toolkit) => {
    return (0, exports.getValue)(toolkit, 'release_flavor', '');
};
exports.getReleaseFlavor = getReleaseFlavor;
const getCommitMessage = (toolkit, build, tagPrefix, skipCi) => {
    const tagName = `${tagPrefix}${build.name}`;
    const defaultMessage = `release: ${tagName}`;
    const message = (0, exports.getValue)(toolkit, 'commit_message', defaultMessage).replace('{{version}}', tagName);
    const flag = skipCi ? '[skip-ci]' : '';
    return `${message.length > 0 ? message : defaultMessage} ${flag}`.trim();
};
exports.getCommitMessage = getCommitMessage;
