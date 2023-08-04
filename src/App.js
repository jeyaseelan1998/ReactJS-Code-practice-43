import {Component} from 'react'
import {Route, Switch, Redirect} from 'react-router-dom'

import LoginForm from './components/LoginForm'
import Home from './components/Home'
import Products from './components/Products'
import ProductItemDetails from './components/ProductItemDetails'
import Cart from './components/Cart'
import NotFound from './components/NotFound'
import ProtectedRoute from './components/ProtectedRoute'
import CartContext from './context/CartContext'

import './App.css'

class App extends Component {
  state = {
    cartList: [],
  }

  addCartItem = product => {
    const {cartList} = this.state
    const {id, quantity} = product
    const isProductAlreadyExists = cartList.find(
      eachProduct => eachProduct.id === id,
    )

    if (isProductAlreadyExists !== undefined) {
      this.incrementCartItemQuantity(id, quantity)
    } else {
      this.setState(prevState => ({cartList: [...prevState.cartList, product]}))
    }
  }

  incrementCartItemQuantity = (productId, quality = 1) => {
    this.setState(prevState => ({
      cartList: prevState.cartList.map(eachProduct =>
        eachProduct.id === productId
          ? {...eachProduct, quantity: eachProduct.quantity + quality}
          : eachProduct,
      ),
    }))
  }

  decrementCartItemQuantity = productId => {
    this.setState(prevState => ({
      cartList: prevState.cartList
        .map(eachProduct =>
          eachProduct.id === productId
            ? {...eachProduct, quantity: eachProduct.quantity - 1}
            : eachProduct,
        )
        .filter(eachProduct => eachProduct.quantity > 0),
    }))
  }

  removeCartItem = productId => {
    this.setState(prevState => ({
      cartList: prevState.cartList.filter(
        eachProduct => eachProduct.id !== productId,
      ),
    }))
  }

  removeAllCartItems = () => {
    this.setState({cartList: []})
  }

  render() {
    const {cartList} = this.state

    return (
      <CartContext.Provider
        value={{
          cartList,
          addCartItem: this.addCartItem,
          removeCartItem: this.removeCartItem,
          incrementCartItemQuantity: this.incrementCartItemQuantity,
          decrementCartItemQuantity: this.decrementCartItemQuantity,
          removeAllCartItems: this.removeAllCartItems,
        }}
      >
        <Switch>
          <Route exact path="/login" component={LoginForm} />
          <ProtectedRoute exact path="/" component={Home} />
          <ProtectedRoute exact path="/products" component={Products} />
          <ProtectedRoute
            exact
            path="/products/:id"
            component={ProductItemDetails}
          />
          <ProtectedRoute exact path="/cart" component={Cart} />
          <Route path="/not-found" component={NotFound} />
          <Redirect to="not-found" />
        </Switch>
      </CartContext.Provider>
    )
  }
}

export default App
