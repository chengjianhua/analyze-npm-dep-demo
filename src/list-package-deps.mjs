import RegistryClient from 'npm-registry-client';
import util from 'util';
import semver from 'semver';

const client = new RegistryClient();
const getPackage = util.promisify(client.get).bind(client);

/**
 * 根据提供的包名和可选的版本号，返回该包的依赖树
 */
export default async function listPackageDependencies(packageName, version) {
  const result = await resolvePkgDeps([{ name: packageName, version }]);

  console.log(util.inspect(result, { colors: true, depth: Infinity }));

  return result;
}

/**
 * 获取一系列包的依赖信息，并建立一个依赖树
 */
async function resolvePkgDeps(packages) {
  const resolvePkgPromises = packages.map(async p => {
    const item = {
      ...p,
      children: null,
    };
    const manifest = await resolveManifest(p);
    // 如果包的版本没有指定的话，则指定版本为从 manifest 中获取的最新版本号
    // （例如一开始默认解析的包并没有指定包名）
    if (!item.version) {
      item.version = manifest.version;
    }

    const dependencyEntries = manifest.dependencies
      ? Object.entries(manifest.dependencies)
      : [];
    if (dependencyEntries.length === 0) {
      return item;
    }

    const depPackages = dependencyEntries.map(([name, version]) => ({
      name,
      version,
    }));
    item.children = await resolvePkgDeps(depPackages);

    return item;
  });

  return Promise.all(resolvePkgPromises);
}

/**
 * 获得指定名称、版本下包的 package.json 相关信息
 */
async function resolveManifest({ name, version }) {
  // encodeURIComponent 用于处理 scoped package 的包名，例如 @babel/runtime 没经过处理
  // 会使得解析到错误的路径
  let url = `http://registry.npmjs.org/${encodeURIComponent(name)}`;
  let manifest;

  if (!version) {
    const data = await getPackage(url, {});
    version = data['dist-tags'].latest;
    manifest = data.versions[version];
  } else {
    version = semver.coerce(version);
    // See https://github.com/npm/registry-issue-archive/issues/34#issuecomment-228349870
    if (name.startsWith('@') && /^\d/.test(version)) {
      version = '^' + version;
    }
    url = `${url}/${version}`;
    const data = await getPackage(url, {});
    manifest = data;
  }

  return manifest;
}
