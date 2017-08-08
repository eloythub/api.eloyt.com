module.exports = {
  apps: [
    {
      name: "npm",
      interpreter: "./node_modules/babel-cli/bin/babel-node.js",
      script: "App.js",
      watch: [
        "App/",
        "App.js",
        "Config.js",
        "Router.js",
        "Server.js",
        ".env",
      ],
      watch_options: {
        persistent: true,
        ignoreInitial: true,
        usePolling: true
      },
      env: {
        DEBUG: "ELOYT-ZONE:*",
        NODE_ENV: "dev"
      },
      env_: {
        DEBUG: "ELOYT-ZONE:*",
        NODE_ENV: "dev"
      }
    }
  ]
}