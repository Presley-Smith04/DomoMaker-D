const controller = require('./controllers');
const mid = require('./middleware');

const router = (app) => {
    app.get('/getDomos', mid.requiresLogin, controller.Domo.getDomos);

    app.get('/login', mid.requiresSecure, mid.requiresLogout, controller.Account.loginPage);
    app.post('/login', mid.requiresSecure, mid.requiresLogout, controller.Account.login);

    // app.get('/signup', mid.requiresSecure, mid.requiresLogout, controller.Account.signupPage);
    app.post('/signup', mid.requiresSecure, mid.requiresLogout, controller.Account.signup);

    app.get('/logout', mid.requiresLogin, controller.Account.logout);
    app.get('/maker', mid.requiresLogin, controller.Domo.makerPage);
    app.post('/maker', mid.requiresLogin, controller.Domo.makeDomo);

    app.get('/', mid.requiresSecure, mid.requiresLogout, controller.Account.loginPage);
    app.post('/deleteDomo', mid.requiresLogin, controller.Domo.deleteDomo); //vaporizing domos

};

module.exports = router;