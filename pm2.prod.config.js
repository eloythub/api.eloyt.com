module.exports = {
  apps: [
    {
      name: "npm",
      interpreter: "./node_modules/babel-cli/bin/babel-node.js",
      script: "App.js",
      watch: false,
      env: {
        NODE_ENV: "production"
      },
      env_: {
        NODE_ENV: "production"
      }
    }
  ]
}