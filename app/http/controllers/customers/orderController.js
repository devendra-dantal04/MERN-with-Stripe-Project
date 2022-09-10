const Order = require("../../../models/order");
const moment = require("moment");
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);


function orderController () {
    return {
        store(req,res) {
            //Validate Request

            const {phone, address, stripeToken, paymentType} = req.body;


            if(!phone || !address) {
                return res.status(422).json({message : "All fields are required"});
                // req.flash('error', "All fields are required")
                // return res.redirect('/cart')
            }

            const order = new Order({
                customerId : req.user._id,
                items : req.session.cart.items,
                phone,
                address
            })

            order.save().then( result => {
                Order.populate(result, {path : 'customerId'}, async (err, data) => {

                    //Stripe payment
                    if(paymentType === 'card') {
                        const paymentMethod = await stripe.paymentMethods.create({
                            type: 'card',
                            card: {
                              number: '4000000000003220',
                              exp_month: 9,
                              exp_year: 2023,
                              cvc: '314',
                            },
                          });
                          
                        stripe.paymentIntents.create({
                            amount : req.session.cart.totalPrice * 100,
                            // source : stripeToken,
                            currency : 'inr',
                            payment_method_types : ["card"],
                            payment_method : paymentMethod.id,
                            statement_descriptor : `Pizza Order Succeful`,
                            metadata : {
                                order_id : `${data._id}`,
                                user_id : `${req.user._id}`
                            },
                            description : `Order Id : ${data._id}`,
                        }).then((payment_intent) => {
                            data.paymentStatus = true;
                            data.save().then( async (ord)=> {
                                
                                //Emit
                                const emitter = req.app.get('eventEmitter');
                                emitter.emit('orderPlaced', ord)

                                delete req.session.cart
                                
                    
                            // res.redirect('/customer/orders')
                                const paymentIntent = await stripe.paymentIntents.confirm(
                                    payment_intent.id,
                                    {payment_method: paymentMethod.id}
                                );


                                // const paymentIntentCapture = await stripe.paymentIntents.capture(
                                //     payment_intent.id
                                // )

                                return res.json({message : "Payment successful, Successfuly order placed"});
                            }).catch(err => {
                                console.log(err)
                            })

                        }).catch(err => {
                            console.log("I am here 2")
                            console.log(err)
                            return res.json({message : "Payment failed, you can pay at delivery time"});
                        })
                    }else {
                        // Emit
                            const emitter = req.app.get('eventEmitter');
                            emitter.emit('orderPlaced', data)

                            delete req.session.cart
                
                            // res.redirect('/customer/orders')
                            return res.json({message : "Successfuly order placed"});
                    }
                    
                            
                    // req.flash('success', 'Order placed Successfuly');
                })

            }).catch(err => {
                // req.flash('error', 'Something went wrong');
                return res.json({message : "Something went wrong"});
                // return res.redirect('/cart');
            })
        },
        async index(req,res) {
            const orders = await Order.find({customerId : req.user._id},null,{sort: {'createdAt' : -1}});
            res.header('Cache-Control', 'no-cache,private,no-store,must-revalidate,max-stale=0,post-check=0,pre-check=0')
            res.render('customers/orders', {orders : orders, moment:moment});
        },
        async show (req,res) {
            const order = await Order.findById(req.params.id);

            //Authorize user

            if(req.user._id.toString() === order.customerId.toString()) {
                return res.render('customers/singleOrder', {order : order})
            } else {
                return res.redirect("/")
            }
        } 
    }
}


module.exports = orderController;