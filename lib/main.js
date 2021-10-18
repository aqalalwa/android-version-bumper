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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const actions_toolkit_1 = require("actions-toolkit");
const promises_1 = __importDefault(require("fs/promises"));
const env_1 = require("./env");
const git_1 = require("./git");
const gradle_1 = require("./gradle");
const version_1 = require("./version");
actions_toolkit_1.Toolkit.run((tools) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const tagPrefix = (0, env_1.getTagPrefix)(tools);
        const skipCi = (0, env_1.isSkippingCi)(tools);
        const buildNumber = (0, env_1.getBuildNumber)(tools);
        const releaseFlavor = (0, env_1.getReleaseFlavor)(tools);
        const versionFileExists = yield (0, gradle_1.doesVersionPropertiesExist)(promises_1.default, releaseFlavor);
        let build;
        if (versionFileExists) {
            const existingVersion = yield (0, gradle_1.getVersionProperties)(tools, releaseFlavor);
            const { commits } = tools.context.payload;
            build = (0, version_1.bumpBuild)(commits !== null && commits !== void 0 ? commits : [], existingVersion, buildNumber);
        }
        else {
            // create version 0.0.1 by default in build.gradle if not exists
            const defaultBuild = {
                major: 0,
                minor: 0,
                patch: 1,
                build: buildNumber,
            };
            build = (0, version_1.getBuildFromVersion)(defaultBuild);
        }
        const message = (0, env_1.getCommitMessage)(tools, build, tagPrefix, skipCi);
        yield (0, gradle_1.setVersionProperties)(promises_1.default, tools, build.version, releaseFlavor);
        yield (0, git_1.setGitIdentity)(tools);
        yield (0, git_1.createCommit)(tools, message, releaseFlavor);
        yield (0, git_1.pushChanges)(tools, build.name, true);
        console.log(`::set-output name=new_tag::${build.name}`);
        tools.exit.success(`Version bumped version to ${build.name} successfully!`);
    }
    catch (e) {
        tools.log.fatal(e);
        tools.exit.failure('Failed to bump version!');
    }
}));
