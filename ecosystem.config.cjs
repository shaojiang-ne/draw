// pm2 用：pm2 start ecosystem.config.cjs && pm2 save
module.exports = {
  apps: [
    {
      name: 'draw',
      script: 'node_modules/vite/bin/vite.js',
      interpreter: 'node',
      args: 'preview --host 0.0.0.0 --port 4173',
      cwd: __dirname,
      autorestart: true,
      max_memory_restart: '300M',
      env: { NODE_ENV: 'production' },
    },
  ],
}
