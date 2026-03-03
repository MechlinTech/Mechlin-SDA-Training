// config/secrets.js
const crypto = require('crypto');

class SecretsManager {
  constructor() {
    this.encryptionKey = process.env.ENCRYPTION_KEY || this.generateKey();
    this.algorithm = 'aes-256-gcm';
  }

  generateKey() {
    return crypto.randomBytes(32).toString('hex');
  }

  encrypt(text) {
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipher(this.algorithm, this.encryptionKey);
    cipher.setAAD(Buffer.from('sda-training', 'utf8'));
    
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    
    const authTag = cipher.getAuthTag();
    
    return {
      encrypted,
      iv: iv.toString('hex'),
      authTag: authTag.toString('hex')
    };
  }

  decrypt(encryptedData) {
    const decipher = crypto.createDecipher(this.algorithm, this.encryptionKey);
    decipher.setAAD(Buffer.from('sda-training', 'utf8'));
    decipher.setAuthTag(Buffer.from(encryptedData.authTag, 'hex'));
    
    let decrypted = decipher.update(encryptedData.encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    
    return decrypted;
  }

  validateSecrets() {
    const requiredSecrets = [
        'JWT_SECRET',
        'MONGODB_URI'
    ];

    const missingSecrets = requiredSecrets.filter(secret => !process.env[secret]);
    
    if (missingSecrets.length > 0) {
      throw new Error(`Missing required secrets: ${missingSecrets.join(', ')}`);
    }

    return true;
  }

  getSecret(name, defaultValue = null) {
    const value = process.env[name];
    if (!value && !defaultValue) {
      throw new Error(`Secret ${name} is required but not found`);
    }
    return value || defaultValue;
  }
}

module.exports = new SecretsManager();