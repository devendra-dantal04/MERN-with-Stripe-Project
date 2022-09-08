const homeController = require('../app/http/controllers/homeController');
const authController = require('../app/http/controllers/authController');
const customerController = require('../app/http/controllers/customers/cartController');
const orderController = require('../app/http/controllers/customers/orderController');
const adminOrderController = require('../app/http/controllers/admin/adminOrderController');
const guest = require("../app/http/middleware/guest");
const auth = require("../app/http/middleware/auth");
const admin = require("../app/http/middleware/admin");


function initRoutes(app) {
    
    
    app.get("/", homeController().index);

    app.get("/login", guest, authController().login);

    app.post("/login", authController().postLogin);
    
    app.get("/register", guest,  authController().register);

    app.post("/register", authController().postRegister);
    
    app.get("/cart", customerController().cart);

    app.post("/update-cart", customerController().update);

    app.post("/logout", authController().logout);



    //Customers Route

    app.post("/orders", auth, orderController().store);

    app.get('/customer/orders', auth, orderController().index);


    //Admin Routes
    app.get('/admin/orders', admin, adminOrderController().index);

}

module.exports = initRoutes;