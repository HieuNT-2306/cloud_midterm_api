import rateLimit from 'express-rate-limit';
import logger from './logger.js';
const getClientIp = (req) => {
    const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    return ip;
};

const limiter = rateLimit({
    windows: 1 * 60 * 1000, 
    max: 10, 
    handler: (req, res) => {
        const clientIpv6 = getClientIp(req);
        logger.error({
            message: 'Rate limit exceeded for user with IP: ' + clientIpv6,
            path: req.originalUrl,
            method: req.method,
            responseCode: 409
        });
        res.status(409).json({
            message: 'You have reached your limit of 10 request/minute, please try again later.' ,
            requestCount: req.rateLimit.current,
            clientIp: clientIpv6
        });
    }
});

export default limiter;