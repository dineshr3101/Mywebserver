const AWS = require('aws-sdk');
var client = new AWS.SecretsManager({ region: "us-east-1" });

const secretName = "Mydbsecret";

// Default configuration
let config = {
  APP_DB_HOST: "54.158.97.146",  // EC2 public IP
  APP_DB_USER: "nodeapp",
  APP_DB_PASSWORD: "student12",
  APP_DB_NAME: "STUDENTS"
};

// Fetch secrets from AWS Secrets Manager asynchronously
async function loadSecrets() {
  try {
    const data = await client.getSecretValue({ SecretId: secretName }).promise();
    if (data.SecretString) {
      let secret = JSON.parse(data.SecretString);
      // Override config with values from the secret
      config.APP_DB_USER = secret.user || config.APP_DB_USER;
      config.APP_DB_PASSWORD = secret.password || config.APP_DB_PASSWORD;
      config.APP_DB_HOST = secret.host || config.APP_DB_HOST;
      config.APP_DB_NAME = secret.db || config.APP_DB_NAME;
    }
  } catch (err) {
    console.log('Secrets not found. Proceeding with default values...');
  }
}

// Override with environment variables if present
Object.keys(config).forEach(key => {
  if (process.env[key]) {
    config[key] = process.env[key];
  }
});

// load the secrets 
module.exports = { config, loadSecrets };
