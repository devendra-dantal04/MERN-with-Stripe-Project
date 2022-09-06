import axios from "axios";
import Noty from "noty";

let addToCart = document.querySelectorAll(".add-to-cart");
let cartCounter = document.getElementById("cartCounter");

const updateCart = (pizza) => {
    axios.post("/update-cart", pizza).then(
        res => {
            console.log(res);
            // console.log(cartCounter)
            cartCounter.innerText = res.data.totalQty;

            new Noty({
                text : "Item added to cart",
                type : "success",
                timeout: 1000,
                progressBar: false
            }).show();
        }
    ).catch(err => {
        new Noty({
            text : "Something went wrong.",
            type : "error",
            timeout : 1000,
            progressBar : false
        }).show()
    })
}

addToCart.forEach((btn) => {
    btn.addEventListener("click", (e)=>{
        e.preventDefault();
        
        let pizza = JSON.parse(btn.dataset.pizza);
        updateCart(pizza);
    })
})