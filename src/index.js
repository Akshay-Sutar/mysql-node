const express = require('express');
const { StatusCodes } = require('http-status-codes');
const config = require('./config');
const app = express();

process.on('unhandledRejection', (reason, promise) => {
    console.error('unhandled rejection', reason.message);
    process.exit(1);
});

process.on('uncaughtException', (error) => {
    console.error('uncaught exception', error.message);
    process.exit(1);
});

app.use(express.json());
app.use(express.urlencoded({
    extended: true
}));

app.use(require('./routes'));

app.use('*', (req, res) => {
    return res.status(StatusCodes.NOT_FOUND).json({ message: `path not found ${req.originalUrl}` });
});

app.use((err, req, res, next) => {
    return res.status(StatusCodes.NOT_FOUND).json({ message: err.message, code: `SERVER_ERROR` });
});

app.listen(config.PORT, () => {
    console.log(`Server started at ${config.PORT}`);
});