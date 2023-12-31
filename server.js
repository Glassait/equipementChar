const express = require('express');
const path = require('path');
const app = express();

// set up rate limiter: maximum of sixty requests per minute
const RateLimit = require('express-rate-limit');
const limiter = RateLimit({
    windowMs: 60 * 1000, // 1 minute
    max: 60,
});

// apply rate limiter to all requests
app.use(limiter);

app.use(express.static(__dirname + '/dist/app'));
app.get('/*', function (_req, res) {
    res.sendFile(path.join(__dirname + '/dist/app/index.html'));
});
app.listen(process.env.PORT || 8080);
