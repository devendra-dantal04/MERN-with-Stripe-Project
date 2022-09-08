const homeController = require('../app/http/controllers/homeController');
const authController = require('../app/http/controllers/authController');
const customerController = require('../app/http/controllers/customers/cartController');
const guest = require("../app/http/middleware/guest");

function initRoutes(app) {
    
    
    app.get("/", homeController().index);

    app.get("/login", guest, authController().login);

    app.post("/login", authController().postLogin);
    
    app.get("/register", guest,  authController().register);

    app.post("/register", authController().postRegister);
    
    app.get("/cart", customerController().cart);

    app.post("/update-cart", customerController().update);

    app.post("/logout", authController().logout);

}

module.exports = initRoutes;