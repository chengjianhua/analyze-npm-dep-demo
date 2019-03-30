import listPackageDependencies from './list-package-deps';
import printDeps from './print-deps';

async function main() {
  try {
    const tree = await listPackageDependencies('react');
    // const { default: tree } = await import('./data.json');

    console.log(printDeps(tree));
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
