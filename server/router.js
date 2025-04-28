const controller = require('./controllers');
const mid = require('./middleware');
const { Status } = require('./models');

const router = (app) => {
    app.get('/getStatuses', mid.requiresLogin, controller.Status.getStatuses);

    //status pages
    app.get('/maker', mid.requiresLogin, controller.Status.makerPage);
    app.post('/maker', mid.requiresLogin, controller.Status.makeStatus);

    app.post('/deleteStatus', mid.requiresLogin, controller.Status.deleteStatus);
    app.post('/updateStatus', mid.requiresLogin, controller.Status.updateStatus);

    //account routes
    app.get('/login', mid.requiresSecure, mid.requiresLogout, controller.Account.loginPage);
    app.post('/login', mid.requiresSecure, mid.requiresLogout, controller.Account.login);
    app.post('/signup', mid.requiresSecure, mid.requiresLogout, controller.Account.signup);
    app.get('/logout', mid.requiresLogin, controller.Account.logout);

    //default
    app.get('/', mid.requiresSecure, mid.requiresLogout, controller.Account.loginPage);

    //premium
    app.post('/togglePremium', mid.requiresLogin, controller.Account.togglePremium);

};

module.exports = router;
