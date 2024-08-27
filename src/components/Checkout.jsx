import { useContext } from "react";
import Modal from "./UI/Modal";
import CartContext from "../store/CartContext";
import UserProgressContext from "../store/UserProgressContext";
import { currencyFormatter } from "../util/formatting";
import Input from "./UI/Input";
import Button from "./UI/Button";

export default function Checkout() {
  const cartCtx = useContext(CartContext);
  const userProgressCtx = useContext(UserProgressContext);

  const cartTotal = cartCtx.items.reduce((total, item) => total + item.quantity * item.price, 0);

  function handleSubmit(e){
    e.preventDefault();

    const fd = new FormData(e.target);
    const customerData = Object.fromEntries(fd.entries());

    fetch("http://localhost:3000/orders", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        order: {
          items: cartCtx.items,
          customer: customerData
        }
      })
    })
  }

  return <Modal open={userProgressCtx.progress === "checkout"} onClose={() => userProgressCtx.hideCheckout()}>
    <form onSubmit={handleSubmit}>
      <h2>Checkout</h2>
      <p>Total amount: {currencyFormatter.format(cartTotal)}</p>
      <Input label="Full Name" type="text" id="name"/>
      <Input label="Email Address" type="email" id="email"/>
      <Input label="Street" type="text" id="street"/>
      <div className="control-row">
        <Input label="Postal Code" type="text" id="postal-code"/>
        <Input label="City" type="text" id="city"/>
      </div>
      <p className="modal-actions">
        <Button type="button" textOnly onClick={() => userProgressCtx.hideCheckout()}>Close</Button>
        <Button>Submit</Button>
      </p>
    </form>
  </Modal>
}