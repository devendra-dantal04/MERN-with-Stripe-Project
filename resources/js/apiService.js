import axios from "axios";
import Noty from "noty";

export function placeOrder(formObject) {
    axios.post('/orders', formObject).then(res => {
        new Noty({
            type : 'success',
            timeout : 1000,
            text: res.data.message,
            progressBar : false
        }).show()

        setTimeout(() => {
            window.location.href = '/customer/orders'
        }, 1000)

        
    }).catch(err => {
        new Noty({
            type : 'success',
            timeout : 1000,
            text: err,
            progressBar : false
        }).show()

        console.log("I am nothing")

        window.location.href = '/cart'
    })

}