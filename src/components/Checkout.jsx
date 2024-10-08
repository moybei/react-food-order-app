import { useContext } from "react";
import Modal from "./UI/Modal";
import CartContext from "../store/CartContext";
import UserProgressContext from "../store/UserProgressContext";
import { currencyFormatter } from "../util/formatting";
import Input from "./UI/Input";
import Button from "./UI/Button";
import useHttp from "../hooks/useHttp";
import Error from "./Error";

const requestConfig = {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
};

export default function Checkout() {
  const cartCtx = useContext(CartContext);
  const userProgressCtx = useContext(UserProgressContext);

  const cartTotal = cartCtx.items.reduce(
    (total, item) => total + item.quantity * item.price,
    0
  );

  const { data, isLoading: isSending, error, sendRequest, clearData } = useHttp(
    "http://localhost:3000/orders",
    requestConfig
  );

  function handleSubmit(e) {
    e.preventDefault();

    const fd = new FormData(e.target);
    const customerData = Object.fromEntries(fd.entries());

    sendRequest(JSON.stringify({
      order: {
        items: cartCtx.items,
        customer: customerData,
      },
    }));
  }

  function handleFinish() {
    userProgressCtx.hideCheckout();
    cartCtx.clearCart();
    clearData();
  }

  let actions = (<><Button
    type="button"
    textOnly
    onClick={() => userProgressCtx.hideCheckout()}
  >
    Close
  </Button>
  <Button>Submit</Button></>)

  if (isSending) {
    actions = <span>Sending order...</span>
  }

  if (data && !error) {
    return <Modal open={userProgressCtx.progress === "checkout"} onClose={handleFinish}>
      <h2>Success</h2>
      <p>Your order has been placed!</p>
      <p className="modal-actions">
        <Button onClick={handleFinish}>Close</Button>
      </p>
    </Modal>
  }

  return (
    <Modal
      open={userProgressCtx.progress === "checkout"}
      onClose={() => userProgressCtx.hideCheckout()}
    >
      <form onSubmit={handleSubmit}>
        <h2>Checkout</h2>
        <p>Total amount: {currencyFormatter.format(cartTotal)}</p>
        <Input label="Full Name" type="text" id="name" />
        <Input label="Email Address" type="email" id="email" />
        <Input label="Street" type="text" id="street" />
        <div className="control-row">
          <Input label="Postal Code" type="text" id="postal-code" />
          <Input label="City" type="text" id="city" />
        </div>

        {error && <Error title="Failed to send order" message={error}/>}

        <p className="modal-actions">
          {actions}
        </p>
      </form>
    </Modal>
  );
}
