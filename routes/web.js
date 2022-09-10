const homeController = require('../app/http/controllers/homeController');
const authController = require('../app/http/controllers/authController');
const customerController = require('../app/http/controllers/customers/cartController');
const orderController = require('../app/http/controllers/customers/orderController');
const adminOrderController = require('../app/http/controllers/admin/adminOrderController');
const orderStatusController = require('../app/http/controllers/admin/orderStatusController');
const checkoutController = require('../app/http/controllers/checkout/checkoutController');
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

    app.get('/customer/orders/:id', auth, orderController().show);


    //Admin Routes
    app.get('/admin/orders', admin, adminOrderController().index);

    app.post('/admin/order/status', admin, orderStatusController().update);

    //checkout
    app.get('/checkout/success', auth, checkoutController().success);
    app.get('/checkout/failure', auth, checkoutController().failure);

}

module.exports = initRoutes;