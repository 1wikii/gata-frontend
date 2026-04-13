module.exports = {
  apps: [
    {
      name: "gata-frontend",
      script: "node_modules/next/dist/bin/next",
      args: "start -p 3001",
      cwd: "/var/www/gata-frontend",
      env: {
        NODE_ENV: "production"
      }
    }
  ]
};
