module.exports = {
  apps: [
    {
      name: "npm",
      interpreter: "./node_modules/babel-cli/bin/babel-node.js",
      script: "App.js",
      watch: false,
      env: {
        DEBUG: 'ELOYT-ZONE:*',
        NODE_ENV: "staging"
      },
      env_: {
        DEBUG: 'ELOYT-ZONE:*',
        NODE_ENV: "staging"
      }
    }
  ]
}