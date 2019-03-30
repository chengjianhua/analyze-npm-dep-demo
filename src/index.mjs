import listPackageDependencies from './list-package-deps';

async function main() {
  try {
    await listPackageDependencies('styled-fns');
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
