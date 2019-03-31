import listPackageDependencies from './list-package-deps';
import printDeps from './print-deps';

async function main() {
  try {
    const tree = await listPackageDependencies('react-router-dom');
    console.log(JSON.stringify(tree, null, 2));
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
