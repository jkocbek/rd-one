module.exports = async () => {
  // eslint-disable-next-line no-console
  console.log('Starting global setup execution...');

  const { execSync } = await import('child_process');

  execSync('yarn prisma:reset:force', { stdio: 'inherit' });

  // eslint-disable-next-line no-console
  console.log('Global setup has been executed.');
};
