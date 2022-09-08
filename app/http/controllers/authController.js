const User = require("../../models/user");
const bcrypt = require("bcrypt");
const passport = require("passport");

function authController() {
    const _gertRedirectUrl = (req) => {
        return req.user.role === 'admin' ? '/admin/orders' : '/customer/orders'
    }


    return {
        login(req,res) {
            res.render("auth/login");
        },

        postLogin(req,res, next) {
            const {email,password} = req.body;
              //Validate request
            
              if(!email || !password) {
                req.flash('error', 'All fields are required')
                return res.redirect("/login");
            }


            passport.authenticate('local', (err, user, info) => {
                if(err) {
                    req.flash('error', info.message);
                    return next(err);
                }

                if(!user) {
                    req.flash('error', info.message)
                    return res.redirect('/login')
                }

                req.logIn(user, (err) => {
                    if(err) {
                        req.flash('error', info.message)
                        return next(err)
                    }

                    return res.redirect(_gertRedirectUrl(req))
                })
            })(req,res,next);

        },

        register(req,res) {
            res.render("auth/register");
        },

        async postRegister(req,res) {
            const {name, email, password} = req.body;

            //Validate request
            
            if(!name || !email || !password) {
                req.flash('error', 'All fields are required')
                req.flash('name', name);
                req.flash('email', email);
                return res.redirect("/register");
            }

            //Check if email exists
            if(User.exists({email : email}, (err,result) => {
                req.flash('error', 'Email already exists')
                req.flash('name', name);
                req.flash('email', email);
                return res.redirect("/register");
            }));


            //Hash Password

            const hashedPassword = await bcrypt.hash(password, 10);

            // Create user
            const user = await User.create({
                name,
                email,
                password: hashedPassword,
            })

            if (user) {
                //  res.redirect("/");
                return
            } else {
                req.flash('error', 'Something went wrong')
                return res.redirect("/register");
            }
             
        },
        logout(req,res) {
            req.logout((err, result) => {
                if(err) {
                    res.redirect("/")
                }
            });
            return res.redirect('/login')
        }
    }
}

module.exports = authController;