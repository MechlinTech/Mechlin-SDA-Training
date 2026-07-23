/**
 * ============================================================================
 * File: health-check.js
 * Location: week3/day15/monitoring/
 * ============================================================================
 *
 * PURPOSE
 * -------
 * This module performs health checks for the application and its dependent
 * services. It helps determine whether the system is running correctly.
 *
 * RESPONSIBILITIES
 * ----------------
 * ✓ Check MongoDB connection
 * ✓ Check Redis connection
 * ✓ Check PostgreSQL connection
 * ✓ Collect system information
 * ✓ Generate an overall health report
 *
 * WHY IS THIS IMPORTANT?
 * ----------------------
 * Health checks are widely used in production environments by Docker,
 * Kubernetes, Load Balancers, and Monitoring tools to determine whether an
 * application is healthy.
 *
 * Example:
 *
 * GET /health
 *
 * Response:
 * {
 *   "status": "healthy",
 *   "checks": {
 *      "database": "...",
 *      "redis": "...",
 *      "postgresql": "...",
 *      "system": "..."
 *   }
 * }
 *
 * ============================================================================
 */

const healthCheck = {

    /**
     * Check MongoDB connection status.
     */
    async checkDatabase() {
        try {
            const mongoose = require("mongoose");
            const connection = mongoose.connection;

            return {
                status: connection.readyState === 1 ? "healthy" : "unhealthy",
                message: connection.readyState === 1
                    ? "Connected"
                    : "Disconnected",

                details: {
                    host: connection.host,
                    port: connection.port,
                    name: connection.name,
                    readyState: connection.readyState,
                },
            };
        } catch (error) {
            return {
                status: "unhealthy",
                message: error.message,
                details: {
                    error: error.stack,
                },
            };
        }
    },

    /**
     * Check Redis connectivity.
     */
    async checkRedis() {
        try {
            const redis = require("redis");

            const client = redis.createClient(process.env.REDIS_URL);

            await client.ping();
            await client.quit();

            return {
                status: "healthy",
                message: "Connected",

                details: {
                    url: process.env.REDIS_URL,
                },
            };
        } catch (error) {
            return {
                status: "unhealthy",
                message: error.message,

                details: {
                    error: error.stack,
                },
            };
        }
    },

    /**
     * Check PostgreSQL connectivity.
     */
    async checkPostgreSQL() {
        try {
            const { Pool } = require("pg");

            const pool = new Pool({
                connectionString: process.env.POSTGRES_URL,
            });

            const client = await pool.connect();

            await client.query("SELECT NOW()");

            client.release();
            await pool.end();

            return {
                status: "healthy",
                message: "Connected",

                details: {
                    url: process.env.POSTGRES_URL,
                },
            };
        } catch (error) {
            return {
                status: "unhealthy",
                message: error.message,

                details: {
                    error: error.stack,
                },
            };
        }
    },

    /**
     * Collect basic operating system and Node.js information.
     */
    async getSystemInfo() {
        const os = require("os");
        const process = require("process");

        return {
            uptime: process.uptime(),

            memory: process.memoryUsage(),

            cpu: {
                loadavg: os.loadavg(),
                cpus: os.cpus().length,
            },

            platform: os.platform(),
            arch: os.arch(),
            nodeVersion: process.version,
        };
    },

    /**
     * Run all health checks and generate one combined report.
     */
    async performHealthCheck() {

        const checks = await Promise.allSettled([
            this.checkDatabase(),
            this.checkRedis(),
            this.checkPostgreSQL(),
            this.getSystemInfo(),
        ]);

        const results = {

            database:
                checks[0].status === "fulfilled"
                    ? checks[0].value
                    : {
                          status: "unhealthy",
                          message: checks[0].reason.message,
                      },

            redis:
                checks[1].status === "fulfilled"
                    ? checks[1].value
                    : {
                          status: "unhealthy",
                          message: checks[1].reason.message,
                      },

            postgresql:
                checks[2].status === "fulfilled"
                    ? checks[2].value
                    : {
                          status: "unhealthy",
                          message: checks[2].reason.message,
                      },

            system:
                checks[3].status === "fulfilled"
                    ? checks[3].value
                    : {
                          status: "unhealthy",
                          message: checks[3].reason.message,
                      },
        };

        const overallStatus = Object.values(results).every(
            (check) => check.status === "healthy"
        )
            ? "healthy"
            : "unhealthy";

        return {
            status: overallStatus,
            timestamp: new Date().toISOString(),
            checks: results,
        };
    },
};

/**
 * Export the Health Check module so it can be used by
 * Express routes or monitoring services.
 */
module.exports = healthCheck;