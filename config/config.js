let config = {
  APP_DB_HOST: "localhost",  // Default to EC2's public IP or set it to localhost for local testing
  APP_DB_USER: "nodeapp",
  APP_DB_PASSWORD: "student12",
  APP_DB_NAME: "STUDENTS"
};

// AWS SDK for fetching secrets
var AWS = require('aws-sdk');
var client = new AWS.SecretsManager({ region: "us-east-1" });

const secretName = "Mydbsecret";

// Fetch secrets from AWS Secrets Manager asynchronously
function loadSecrets() {
  return new Promise((resolve, reject) => {
    client.getSecretValue({ SecretId: secretName }, function (err, data) {
      if (err) {
        console.log('Secrets not found. Proceeding with default values...');
        resolve(); // Proceed with default values if no secrets found
      } else {
        if ('SecretString' in data) {
          let secret = JSON.parse(data.SecretString);
          config.APP_DB_USER = secret.user || config.APP_DB_USER;
          config.APP_DB_PASSWORD = secret.password || config.APP_DB_PASSWORD;
          config.APP_DB_HOST = secret.host || config.APP_DB_HOST;
          config.APP_DB_NAME = secret.db || config.APP_DB_NAME;
        }
        resolve(); // Resolve after loading secrets
      }
    });
  });
}

// Override with environment variables if present
Object.keys(config).forEach(key => {
  if (process.env[key]) {
    config[key] = process.env[key];
  }
});

module.exports = { config, loadSecrets };
