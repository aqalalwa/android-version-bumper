import { Toolkit } from 'actions-toolkit';
import Fs from 'fs/promises';
import { Version } from './version';

export const doesVersionPropertiesExist = async (
  fs: typeof Fs,
  releaseFlavor: string,
): Promise<boolean> => {
  try {
    const fileNamePrefix = releaseFlavor ? `${releaseFlavor}.` : '';
    const file = await fs.readFile(`${fileNamePrefix}version.properties`);

    return file?.toString().length > 0;
  } catch (e) {
    return false;
  }
};

export const getVersionProperties = async (
  toolkit: Toolkit,
  releaseFlavor: string,
): Promise<Pick<Version, 'major' | 'minor' | 'patch'>> => {
  const fileNamePrefix = releaseFlavor ? `${releaseFlavor}.` : '';
  const file = (await toolkit.readFile(`${fileNamePrefix}version.properties`)).toString();
  const major = file.match(/(majorVersion=)(\d+)/);
  const minor = file.match(/(minorVersion=)(\d+)/);
  const patch = file.match(/(patchVersion=)(\d+)/);

  return {
    major: major && major.length > 1 ? Number.parseInt(major[2]) : 0,
    minor: minor && minor.length > 1 ? Number.parseInt(minor[2]) : 0,
    patch: patch && patch.length > 1 ? Number.parseInt(patch[2]) : 0,
  };
};

export const setVersionProperties = async (
  fs: typeof Fs,
  toolkit: Toolkit,
  { major, minor, patch, build }: Version,
  releaseFlavor: string,
): Promise<void> => {
  const contents = [
    `majorVersion=${major}`,
    `minorVersion=${minor}`,
    `patchVersion=${patch}`,
    `buildNumber=${build ?? ''}`,
  ].join('\n');

  const fileNamePrefix = releaseFlavor ? `${releaseFlavor}.` : '';
  await fs.writeFile(`${fileNamePrefix}version.properties`, contents);

  await toolkit.exec('cat', [`${fileNamePrefix}version.properties`]);
};
