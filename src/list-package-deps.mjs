import RegistryClient from 'npm-registry-client';
import util from 'util';
import semver from 'semver';

const client = new RegistryClient();

// client.get(url, {}, (err, data, raw, res) => {
//   console.log(data);
// });
const getPackage = util.promisify(client.get).bind(client);

export default async function listPackageDependencies(packageName, version) {
  return resolvePkgDeps([{ name: packageName, version }]);
}

async function resolvePkgDeps(packages) {
  const resolvePkgPromises = packages.map(async p => {
    console.log(p);
    const manifest = await resolveManifest(p);
    if (!manifest.dependencies) {
      return;
    }

    const depPackages = Object.entries(manifest.dependencies).map(
      ([name, version]) => {
        return { name, version };
      },
    );

    if (!depPackages.length) {
      return;
    }

    return resolvePkgDeps(depPackages);
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
