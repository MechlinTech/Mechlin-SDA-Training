const performanceMiddleware = (req, res, next) => {
    const start = Date.now();
    res.on('finish', () => {
        const elapsed = Date.now() - start;
        console.log(`${req.method} ${req.url} - ${elapsed}ms`);
    });
    next();
};

module.exports = { performanceMiddleware };
