import { useContext } from "react";
import logoImg from "../assets/logo.jpg"
import Button from "./UI/Button";
import UserProgressContext from "../store/UserProgressContext";
import CartContext from "../store/CartContext";

export default function Header() {
  const cartCtx = useContext(CartContext);
  const userProgressCtx = useContext(UserProgressContext);

  const totalCartItems = cartCtx.items.reduce((total, item) => total + item.quantity, 0);

  function handleShowCart() {
    userProgressCtx.showCart();
  }

  return (
    <header id="main-header">
      <div id="title">
        <img src={logoImg} alt="Food Logo Image" />
        <h1>React Food App</h1>
      </div>
      <nav>
        <Button textOnly onClick={handleShowCart}>Cart ({totalCartItems})</Button>
      </nav>
    </header>
  );
}
