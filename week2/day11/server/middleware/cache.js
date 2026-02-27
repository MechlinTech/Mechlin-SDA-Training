const NodeCache = require("node-cache");

const cache = new NodeCache({ stdTTL: 60 }); // 60 seconds

const cacheMiddleware = (duration = 60) => {
  return (req, res, next) => {
    const key = req.originalUrl;

    const cachedResponse = cache.get(key);

    if (cachedResponse) {
      return res.status(200).json({
        success: true,
        source: "cache",
        data: cachedResponse
      });
    }

    // Override res.json
    const originalJson = res.json;

    res.json = (body) => {
      cache.set(key, body.data, duration);
      return originalJson.call(res, body);
    };

    next();
  };
};

module.exports = cacheMiddleware;