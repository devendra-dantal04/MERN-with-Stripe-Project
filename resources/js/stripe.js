import {loadStripe} from '@stripe/stripe-js';
import { placeOrder } from "./apiService";
import { CardWidget } from './cardWidget';

export async function initStripe () {
    const stripe = await loadStripe("pk_test_51LgCKVSFargJRyvtRyCC527u4e98RZD4yiAzk4Ku9vS2z3y8HPE6jvlrqFYyin3jjfTu9JvtBhlcfy6rTFzU7Wf600PSu16C8X");

    let card = null;

    // function mountWidget() {
    //     const elements = stripe.elements()

    //     card = elements.create('card', {
    //         style : {
    //             base : {
    //                 color : "#32325d",
    //                 fontFamily : '"Helvica Neue", Helvetica, sans-serif',
    //                 fontSmoothing : 'antialiased',
    //                 fontSize : '16px',
    //                 '::placeholder' : {
    //                     color : "#aab7c4"
    //                 }
    //             },
    //             invalid : {
    //                 color : "#fa755a",
    //                 iconColor : "#fa755a"
    //             }
    //         },
    //         hidePostalCode : true
    //     })

    //     card.mount(`#card-element`)
    // }


    

const paymentType = document.querySelector("#paymentType")
if(paymentType) {
    paymentType.addEventListener('change', (e) => {
        if(e.target.value === 'card') {
            //Display Widget
            card = new CardWidget(stripe)
            card.mount()
        }else {
            card.destroy()
        }
    })
}

//Ajax calls

const paymentForm = document.querySelector("#payment-form")

if(paymentForm) {
    paymentForm.addEventListener("submit", async (e) => {
        e.preventDefault()
        let formData = new FormData(paymentForm);
        let formObject = {}

        for (let [key,value] of formData.entries()) {
            formObject[key] = value
        }

        //verify card
        if(!card){
            placeOrder(formObject);
            return;
        }
        
        const token = await card.createToken();

        console.log(token);
        formObject.stripeToken = token.id;
        placeOrder(formObject)
        

        
    })
}

}