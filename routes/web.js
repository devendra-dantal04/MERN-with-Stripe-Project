const homeController = require('../app/http/controllers/homeController');
const authController = require('../app/http/controllers/authController');
const customerController = require('../app/http/controllers/customers/cartController');


function initRoutes(app) {
    
    
    app.get("/", homeController().index);

    app.get("/cart", customerController().cart);

    app.get("/login", authController().login);

    app.get("/register", authController().register);

    app.post("/update-cart", customerController().update);

}

module.exports = initRoutes;