import util from 'util'

import listPackageDependencies from './list-package-deps';

async function main() {
  try {
    const tree = await listPackageDependencies('react-router-dom');
    console.log(util.inspect(tree, { colors: true, depth: Infinity }));
  } catch (error) {
    console.error(error);
    throw error;
  }
}

main()
  .then(() => {
    console.log('executed successfully');
  })
  .catch(error => {
    console.error(error);
  });
