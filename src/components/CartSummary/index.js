import CartContext from '../../context/CartContext'

import './index.css'

const CartSummary = () => (
  <CartContext.Consumer>
    {value => {
      const {cartList} = value

      const totalPriceAmount = cartList.reduce(
        (total, item) => item.quantity * item.price + total,
        0,
      )
      const cartItems = cartList.length

      return (
        <div className="cart-summary-container">
          <h1>Order Total: </h1>
          <h1 className="price">Rs {totalPriceAmount}/-</h1>
          <p>{cartItems} Items in cart</p>
          <button className="button checkout-button" type="button">
            Checkout
          </button>
        </div>
      )
    }}
  </CartContext.Consumer>
)

export default CartSummary
