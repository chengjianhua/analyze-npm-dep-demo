import RegistryClient from 'npm-registry-client';
import util from 'util';
import semver from 'semver';

const client = new RegistryClient();

// client.get(url, {}, (err, data, raw, res) => {
//   console.log(data);
// });
const getPackage = util.promisify(client.get).bind(client);

export default async function listPackageDependencies(packageName, version) {
  const result = await resolvePkgDeps([{ name: packageName, version }]);

  console.log(JSON.stringify(result, null, 2));

  return result;
}

async function resolvePkgDeps(packages) {
  const resolvePkgPromises = packages.map(async p => {
    const item = {
      ...p,
      children: null,
    };

    // console.log(p);
    const manifest = await resolveManifest(p);
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

async function resolveManifest({ name, version }) {
  let url = `http://registry.npmjs.org/${name}`;
  let manifest;

  if (!version) {
    const data = await getPackage(url, {});

    version = data['dist-tags'].latest;
    manifest = data.versions[version];
  } else {
    version = semver.coerce(version);
    url = `${url}/${version}`;
    const data = await getPackage(url, {});
    manifest = data;
  }

  return manifest;
}
