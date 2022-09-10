function checkoutController() {
    return {
        success(req,res) {
            res.render('checkout/success');
        },
        failure(req,res) {
            res.render('checkout/failure')
        }
    }
}

module.exports = checkoutController;