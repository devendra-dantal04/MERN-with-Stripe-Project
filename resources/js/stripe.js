import Noty from "noty";
import axios from "axios";
import {loadStripe} from '@stripe/stripe-js';
import { placeOrder } from "./apiService";


export async function initStripe () {
    const stripe = await loadStripe('pk_test_51LgCKVSFargJRyvtRyCC527u4e98RZD4yiAzk4Ku9vS2z3y8HPE6jvlrqFYyin3jjfTu9JvtBhlcfy6rTFzU7Wf600PSu16C8X');

    let card = null;

    function mountWidget() {
        const elements = stripe.elements()

    card = elements.create('card', {
        style : {
            base : {
                color : "#32325d",
                fontFamily : '"Helvica Neue", Helvetica, sans-serif',
                fontSmoothing : 'antialiased',
                fontSize : '16px',
                '::placeholder' : {
                    color : "#aab7c4"
                }
            },
            invalid : {
                color : "#fa755a",
                iconColor : "#fa755a"
            }
        },
        hidePostalCode : true
    })

        card.mount(`#card-element`)
    }


    

const paymentType = document.querySelector("#paymentType")
if(paymentType) {
    paymentType.addEventListener('change', (e) => {
        if(e.target.value === 'card') {
            //Display widget
            mountWidget()
        }else {
            card.destroy()
        }
    })
}

//Ajax calls

const paymentForm = document.querySelector("#payment-form")

if(paymentForm) {
    paymentForm.addEventListener("submit", (e) => {
        e.preventDefault()
        let formData = new FormData(paymentForm);
        let formObject = {}

        for (let [key,value] of formData.entries()) {
            formObject[key] = value
        }

        // console.log(formObject)

        //verify card
        if(!card){
            placeOrder(formObject);
            return;

        }else {
            
        }
        stripe.createToken(card).then((result) => {
            console.log(result)
            formObject.stripeToken = result.token.id
            placeOrder(formObject)
        }).catch(err => {
            console.log("I am here also");
        }) 

        
    })
}

}