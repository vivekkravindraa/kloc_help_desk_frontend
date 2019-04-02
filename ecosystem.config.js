module.exports = {
  /**
   * Application configuration section
   * http://pm2.keymetrics.io/docs/usage/application-declaration/
   */
  apps : [
    {
      name      : 'kloc_help_desk_front_client',
      script    : 'index.html',
      args      : 'run start:production',
      env_production : {
        NODE_ENV: 'production'
      }
    },
  ],

  /**
   * Deployment section
   * http://pm2.keymetrics.io/docs/usage/deployment/
   */
  deploy : {
    production : {},
    staging: {
      key: '~/Downloads/feb142019.pem',
      user: 'ubuntu',
      host: ["13.234.34.58"],
      ref: 'origin/master',
      repo: 'git@bitbucket.org:klocapps2/kloc_help_desk_frontend.git',
      path: '/home/ubuntu/kloc_help_desk_front_client',
     "post-deploy": "npm install && pm2 startOrRestart ecosystem.json --env production"
    },
    dev : {}
  }
};
