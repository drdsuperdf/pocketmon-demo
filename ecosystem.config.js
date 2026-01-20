module.exports = {
  apps: [
    {
      name: 'nextjs-app',
      script: 'node_modules/next/dist/bin/next',
      args: 'start -p 3000',
      cwd: './',
      env_staging: {
        NODE_ENV: 'staging',
        PORT: 3000,
      },
      env_qa: {
        NODE_ENV: 'qa',
        PORT: 3000,
      },
      env_production: {
        NODE_ENV: 'production',
        PORT: 3000,
      },
    },
  ],
}
