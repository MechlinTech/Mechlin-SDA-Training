/**
 * ============================================================================
 * File: secrets.js
 * Location: week3/day15/config/
 * ============================================================================
 *
 * PURPOSE
 * -------
 * This file provides a centralized way to manage sensitive information
 * (called "secrets") used by the application.
 *
 * Instead of hardcoding passwords, API keys, JWT secrets, or database
 * credentials in the source code, they are loaded from environment variables.
 *
 * RESPONSIBILITIES
 * ----------------
 * ✔ Read secrets from environment variables
 * ✔ Validate required secrets at application startup
 * ✔ Encrypt sensitive values when needed
 * ✔ Decrypt encrypted values
 * ✔ Provide a single interface to access secrets
 *
 * WHY IS THIS IMPORTANT?
 * ----------------------
 * Hardcoding secrets is a major security risk because anyone with repository
 * access can see them.
 *
 * By using this file:
 * • Secrets stay outside the source code.
 * • Different environments can use different credentials.
 * • The application becomes easier to secure and maintain.
 *
 * This file is typically loaded during application startup before database
 * connections or authentication services are initialized.
 * ============================================================================
 */

const crypto = require("crypto");

class SecretsManager {
    constructor() {
        /**
         * Encryption configuration.
         * If ENCRYPTION_KEY is not provided, a temporary key is generated.
         * (Production applications should always provide this key.)
         */
        this.encryptionKey =
            process.env.ENCRYPTION_KEY || this.generateKey();

        this.algorithm = "aes-256-gcm";
    }

    /**
     * Generate a random 256-bit encryption key.
     */
    generateKey() {
        return crypto.randomBytes(32).toString("hex");
    }

    /**
     * Encrypt plain text.
     *
     * Returns:
     * - encrypted text
     * - initialization vector (IV)
     * - authentication tag
     */
    encrypt(text) {
        const iv = crypto.randomBytes(16);

        const cipher = crypto.createCipher(
            this.algorithm,
            this.encryptionKey
        );

        cipher.setAAD(Buffer.from("sda-training", "utf8"));

        let encrypted = cipher.update(text, "utf8", "hex");
        encrypted += cipher.final("hex");

        const authTag = cipher.getAuthTag();

        return {
            encrypted,
            iv: iv.toString("hex"),
            authTag: authTag.toString("hex"),
        };
    }

    /**
     * Decrypt previously encrypted data.
     */
    decrypt(encryptedData) {
        const decipher = crypto.createDecipher(
            this.algorithm,
            this.encryptionKey
        );

        decipher.setAAD(Buffer.from("sda-training", "utf8"));
        decipher.setAuthTag(
            Buffer.from(encryptedData.authTag, "hex")
        );

        let decrypted = decipher.update(
            encryptedData.encrypted,
            "hex",
            "utf8"
        );

        decrypted += decipher.final("utf8");

        return decrypted;
    }

    /**
     * Ensure all required secrets are available before
     * the application starts.
     */
    validateSecrets() {
        const requiredSecrets = [
            "JWT_SECRET",
            "MONGODB_URI",
            "POSTGRES_PASSWORD",
            "REDIS_URL",
        ];

        const missingSecrets = requiredSecrets.filter(
            (secret) => !process.env[secret]
        );

        if (missingSecrets.length > 0) {
            throw new Error(
                `Missing required secrets: ${missingSecrets.join(", ")}`
            );
        }

        return true;
    }

    /**
     * Retrieve a secret safely.
     *
     * If the secret does not exist:
     * - return default value (if provided)
     * - otherwise throw an error
     */
    getSecret(name, defaultValue = null) {
        const value = process.env[name];

        if (!value && defaultValue === null) {
            throw new Error(
                `Secret "${name}" is required but was not found.`
            );
        }

        return value || defaultValue;
    }
}

// Export a single shared instance across the application.
module.exports = new SecretsManager();