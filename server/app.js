// all initial required imports, requirements, etc.
require('dotenv').config();
const path = require('path');
const express = require('express');
const compression = require('compression');
const favicon = require('serve-favicon');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const expressHandlebars = require('express-handlebars');
const helmet = require('helmet');
const session = require('express-session');
const RedisStore = require('connect-redis').default;
const redis = require('redis');

const router = require('./router.js');

// port 3000
const port = process.env.PORT || process.env.NODE_PORT || 3000;

// link to mongoDB/mongoose
const dbURL = process.env.MONGODB_URI || 'mongodb://127.0.0.1/StatusMaker';

mongoose.connect(dbURL).then(() => {
    console.log('Connected to MongoDB');
}).catch((err) => {
    console.log('Could not connect to MongoDB:', err.message);
});

// connect to redis
const redisClient = redis.createClient({
    url: process.env.REDISCLOUD_URL,
});

redisClient.on('error', (err) => console.log('Redis Client Error', err));

// redis connections
redisClient.connect().then(() => {
    const app = express();

    app.set('trust proxy', 1);

    app.use(helmet());
    app.use('/assets', express.static(path.resolve(`${__dirname}/../hosted`)));
    app.use(favicon(`${__dirname}/../hosted/img/favicon.png`));
    app.use(compression());
    app.use(express.urlencoded({ extended: true }));
    app.use(express.json());

    app.use(session({
        key: 'sessionId',
        store: new RedisStore({ client: redisClient }),
        secret: 'Status Arigato',
        resave: false,
        saveUninitialized: false,
        cookie: {
            httpOnly: true,
            secure: false,
            sameSite: 'lax',
            maxAge: 1000 * 60 * 60 * 24,
        },
    }));

    app.engine('handlebars', expressHandlebars.engine({ defaultLayout: '' }));
    app.set('view engine', 'handlebars');
    app.set('views', `${__dirname}/../views`);

    router(app);

    // 404 response
    app.use((req, res) => {
        res.status(404).render('404', { title: 'Page Not Found' });
    });

    app.listen(port, (err) => {
        if (err) {
            console.log('Error starting the server:', err);
            process.exit(1);  // Ensure the process exits on server startup failure
        }
        console.log(`Listening on port ${port}`);
    });
});
