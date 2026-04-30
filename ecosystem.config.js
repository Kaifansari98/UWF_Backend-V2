module.exports = {
  apps: [
    {
      name: "uwf-backend-v2",
      script: "dist/index.js",

      // 🔁 Restart behavior
      instances: 1,          // keep 1 unless you want cluster mode
      exec_mode: "fork",
      autorestart: true,
      watch: false,

      // 🧠 Memory safety
      max_memory_restart: "500M",

      // 🌍 Environment variables
      env: {
        NODE_ENV: "development",
        PORT: 5000,
      },

      env_production: {
        NODE_ENV: "production",
        PORT: 5000,
      },

      // 📝 Logs
      error_file: "/var/log/pm2/uwf-backend-v2-error.log",
      out_file: "/var/log/pm2/uwf-backend-v2-out.log",
      log_date_format: "YYYY-MM-DD HH:mm:ss",

      // ⏱ Graceful shutdown
      kill_timeout: 5000,
    },
  ],
};
