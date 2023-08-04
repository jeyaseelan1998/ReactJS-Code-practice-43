import path from 'path'
import * as fs from 'fs'
import {Component} from 'react'

import {BrowserRouter, Route, Switch, Redirect} from 'react-router-dom'
import {render, screen, waitFor} from '@testing-library/react'
import Cookies from 'js-cookie'
import {setupServer} from 'msw/node'
import {rest} from 'msw'
import userEvent from '@testing-library/user-event'

import CartContext from '../context/CartContext'
import LoginForm from '../components/LoginForm'
import Home from '../components/Home'
import Products from '../components/Products'
import ProductItemDetails from '../components/ProductItemDetails'
import ProtectedRoute from '../components/ProtectedRoute'
import Cart from '../components/Cart'
import NotFound from '../components/NotFound'

import App from '../App'

const loginImage =
  'https://assets.ccbp.in/frontend/react-js/nxt-trendz-login-img.png'

const loginRoutePath = '/login'
const productsPath = '/products'
const productDetailsPath = '/products/16'
const productDetailsPath2 = '/products/24'
const cartPath = '/cart'

const jsxCode = fs.readFileSync(
  path.resolve(__dirname, '../components/CartItem/index.js'),
  'utf8',
)

const emptyCartImage =
  'https://assets.ccbp.in/frontend/react-js/nxt-trendz-empty-cart-img.png'

const productDetailsResponse = {
  id: 16,
  image_url:
    'https://assets.ccbp.in/frontend/react-js/ecommerce/clothes-simple-formal.png',
  title: 'Embroidered Net Gown',
  price: 62990,
  description:
    'Color, style and ceremonial importance of the gown. Enhance your beauty by after wearing this Vibrant,Gorgeous and beautiful Wedding Gown. ',
  brand: 'Manyavar',
  total_reviews: 879,
  rating: 3,
  availability: 'In Stock',
  similar_products: [
    {
      id: 1,
      image_url:
        'https://assets.ccbp.in/frontend/react-js/ecommerce/clothes-cap.png',
      title: 'Wide Bowknot Hat',
      style: 'Wide Bowknot Hat for Women and Girls (Multicolor)',
      price: 288,
      description:
        'Classy Hat For Multipurpose Use. Soft straw material, convenient for travel. Finished with light and airy woven material, durable and comfortable to wear. One Size Fits All Age Group Above 14 Years. Stay protected from the sun while sporting one of the hottest trends this season. Perfect for you to wear at the beach, pool, party, etc.',
      brand: 'MAJIK',
      total_reviews: 245,
      rating: 4.6,
      availability: 'In Stock',
    },
    {
      id: 2,
      image_url:
        'https://assets.ccbp.in/frontend/react-js/ecommerce/clothes-fit-t-shirt.png',
      title: 'Plain Round Neck T-shirt',
      style: 'Plain Round Neck T-shirt',
      price: 495,
      description:
        'Basic Round Neck T-shirts from Huetrap. These T-shirts can be worn as daily wear or can be worn during your Morning walk, Running/Jogging, and also during your Exercise and Workouts in the Gym. These can also be worn as Casual Wear for all your Outings. These T-shirts are stitched for higher durability using the best technology in the industry. After stitching, these products are quality checked for Size and any kinds of defects before packing. This assures the best of Quality and Value for money. Manufactured from Cotton fabric, these T-shirts are very smooth and soft, making them comfortable to wear during all seasons. This fabric is Durable, Odourless, and passed through Anti fading treatment that ensures the T-shirt color to be intact even after repeated washes.',
      brand: 'Huetrap',
      total_reviews: 120,
      rating: 4.1,
      availability: 'In Stock',
    },
    {
      id: 3,
      image_url:
        'https://assets.ccbp.in/frontend/react-js/ecommerce/clothes-hoodie.png',
      title: 'Cotton Hoodie',
      style: "Scott International Men's Cotton Hooded Hoodies",
      price: 498,
      description:
        'Shop from a wide range of hoodies from Scott International Perfect for your everyday use, you could layer them over a stylish T-Shirt, Polo, or Casual shirt to complete the look. Care Instructions: Do Not Bleach. Wash with similar colors. Machine wash cold.',
      brand: 'Scott International',
      total_reviews: 229,
      rating: 4.8,
      availability: 'In Stock',
    },
  ],
}

const productDetailsResponse1 = {
  id: 17,
  image_url:
    'https://assets.ccbp.in/frontend/react-js/ecommerce/appliances-washing-machine.png',
  title: 'Front Load Machine',
  price: 22490,
  description:
    'Samsung Front Load washing machine comes with AI-enabled Intelligent Wash. It personalizes washing by remembering your habits, suggesting cycles, and displaying timely information. A SmartThings App provides advice on washing cycles, planning, and troubleshooting.',
  brand: 'Samsung',
  total_reviews: 1234,
  rating: 4,
  availability: 'In Stock',
  similar_products: [
    {
      id: 1,
      image_url:
        'https://assets.ccbp.in/frontend/react-js/ecommerce/clothes-cap.png',
      title: 'Wide Bowknot Hat',
      style: 'Wide Bowknot Hat for Women and Girls (Multicolor)',
      price: 288,
      description:
        'Classy Hat For Multipurpose Use. Soft straw material, convenient for travel. Finished with light and airy woven material, durable and comfortable to wear. One Size Fits All Age Group Above 14 Years. Stay protected from the sun while sporting one of the hottest trends this season. Perfect for you to wear at the beach, pool, party, etc.',
      brand: 'MAJIK',
      total_reviews: 245,
      rating: 4.6,
      availability: 'In Stock',
    },
    {
      id: 2,
      image_url:
        'https://assets.ccbp.in/frontend/react-js/ecommerce/clothes-fit-t-shirt.png',
      title: 'Plain Round Neck T-shirt',
      style: 'Plain Round Neck T-shirt',
      price: 495,
      description:
        'Basic Round Neck T-shirts from Huetrap. These T-shirts can be worn as daily wear or can be worn during your Morning walk, Running/Jogging, and also during your Exercise and Workouts in the Gym. These can also be worn as Casual Wear for all your Outings. These T-shirts are stitched for higher durability using the best technology in the industry. After stitching, these products are quality checked for Size and any kinds of defects before packing. This assures the best of Quality and Value for money. Manufactured from Cotton fabric, these T-shirts are very smooth and soft, making them comfortable to wear during all seasons. This fabric is Durable, Odourless, and passed through Anti fading treatment that ensures the T-shirt color to be intact even after repeated washes.',
      brand: 'Huetrap',
      total_reviews: 120,
      rating: 4.1,
      availability: 'In Stock',
    },
    {
      id: 3,
      image_url:
        'https://assets.ccbp.in/frontend/react-js/ecommerce/clothes-hoodie.png',
      title: 'Cotton Hoodie',
      style: "Scott International Men's Cotton Hooded Hoodies",
      price: 498,
      description:
        'Shop from a wide range of hoodies from Scott International Perfect for your everyday use, you could layer them over a stylish T-Shirt, Polo, or Casual shirt to complete the look. Care Instructions: Do Not Bleach. Wash with similar colors. Machine wash cold.',
      brand: 'Scott International',
      total_reviews: 229,
      rating: 4.8,
      availability: 'In Stock',
    },
  ],
}

const cartListResponse = [
  {
    availability: 'In Stock',
    brand: 'LEGO',
    description:
      'Collect all mystery mini-figures in the new series 11 and grow your LEGO Minifigure Collection. Each mini-figure comes in a sealed “mystery” bag with its accessories, display plate, and collector’s booklet. Only 1 of 16 individual mini-figures will be available in each “mystery” bag.',
    id: 1002,
    imageUrl:
      'https://assets.ccbp.in/frontend/react-js/ecommerce/toys-people-toys.png',
    price: 760,
    quantity: 1,
    rating: 3.9,
    title: 'Minifigures',
    totalReviews: 5463,
  },
  {
    availability: 'In Stock',
    brand: 'Phillips',
    description:
      'Cleverly designed, this compact hairdryer is easy to handle and lightweight. The ThermoProtect temperature setting provides the optimal hair drying rate while protecting your hair from overheating. An efficient hairdryer sets your hair dry in just a few seconds. It also comes with a rubber storage hook.',
    id: 1001,
    imageUrl:
      'https://assets.ccbp.in/frontend/react-js/ecommerce/appliances-silver-hair-dryer.png',
    price: 770,
    quantity: 1,
    rating: 3.9,
    title: 'Hair Dryer',
    totalReviews: 5463,
  },
]

const cartListResponse2 = [
  {
    availability: 'In Stock',
    brand: 'LEGO',
    description:
      'Collect all mystery mini-figures in the new series 11 and grow your LEGO Minifigure Collection. Each mini-figure comes in a sealed “mystery” bag with its accessories, display plate, and collector’s booklet. Only 1 of 16 individual mini-figures will be available in each “mystery” bag.',
    id: 1002,
    imageUrl:
      'https://assets.ccbp.in/frontend/react-js/ecommerce/toys-people-toys.png',
    price: 760,
    quantity: 3,
    rating: 3.9,
    title: 'Minifigures',
    totalReviews: 5463,
  },
]

const productsResponse = {
  products: [
    {
      title: 'Front Load Machine',
      brand: 'Samsung',
      price: 22490,
      id: 24,
      image_url:
        'https://assets.ccbp.in/frontend/react-js/ecommerce/appliances-washing-machine.png',
      rating: 4.5,
    },
    {
      title: "Collider Black Dial Men's Watch",
      brand: 'Fossil',
      price: 14995,
      id: 33,
      image_url:
        'https://assets.ccbp.in/frontend/react-js/ecommerce/electronics-simple-belt-watch.png',
      rating: 4.3,
    },
    {
      title: 'True Wireless Earbuds',
      brand: 'LG',
      price: 13499,
      id: 18,
      image_url:
        'https://assets.ccbp.in/frontend/react-js/ecommerce/appliances-ear-buds.png',
      rating: 4.4,
    },
    {
      title: "Maritime Men's Watch",
      brand: 'Titan',
      price: 11999,
      id: 35,
      image_url:
        'https://assets.ccbp.in/frontend/react-js/ecommerce/electronics-tatar-watch.png',
      rating: 4.3,
    },
    {
      title: "Neutra Analog Men's Watch",
      brand: 'Fossil',
      price: 10995,
      id: 34,
      image_url:
        'https://assets.ccbp.in/frontend/react-js/ecommerce/electronics-simple-watch.png',
      rating: 4.1,
    },
    {
      title: 'Monsters Charm Toy',
      brand: 'Trendytap',
      price: 8600,
      id: 48,
      image_url:
        'https://assets.ccbp.in/frontend/react-js/ecommerce/toys-minnos.png',
      rating: 4.2,
    },
    {
      title: 'Privateer Quartz Watch',
      brand: 'Fossil',
      price: 8122,
      id: 31,
      image_url:
        'https://assets.ccbp.in/frontend/react-js/ecommerce/electronics-royal-black-watch.png',
      rating: 4.4,
    },
    {
      title: 'Podcast Microphone',
      brand: 'MAONO',
      price: 5555,
      id: 22,
      image_url:
        'https://assets.ccbp.in/frontend/react-js/ecommerce/appliances-singing-mike.png',
      rating: 4.4,
    },
    {
      title: 'Virgin Avocado Oil',
      brand: 'ProV',
      price: 4144,
      id: 42,
      image_url:
        'https://assets.ccbp.in/frontend/react-js/ecommerce/grocery-oil.png',
      rating: 4.4,
    },
    {
      title: 'Warm Up Jacket',
      brand: 'Monte Carlo',
      price: 2796,
      id: 11,
      image_url:
        'https://assets.ccbp.in/frontend/react-js/ecommerce/clothes-sim-jacket.png',
      rating: 4.4,
    },
  ],
}

const primeDealsResponse = {
  prime_deals: [
    {
      id: 1001,
      image_url:
        'https://assets.ccbp.in/frontend/react-js/ecommerce/appliances-silver-hair-dryer.png',
      title: 'Hair Dryer',
      style: 'Philips HP8100/46 Hair Dryer - Salon Dry Compact',
      price: 760,
      description: 'Advanced concentrator technology with quick-heat head. ',
      brand: 'Phillips',
      total_reviews: 5463,
      rating: 3.9,
      availability: 'In Stock',
    },
    {
      id: 1002,
      image_url:
        'https://assets.ccbp.in/frontend/react-js/ecommerce/toys-people-toys.png',
      title: 'Minifigures',
      style: 'Minifigures',
      price: 760,
      description:
        'Collect all mystery minifigures in the new series 11 and grow your LEGO Minifigure Collection. ',
      brand: 'LEGO',
      total_reviews: 5463,
      rating: 3.9,
      availability: 'In Stock',
    },
    {
      id: 1003,
      image_url:
        'https://assets.ccbp.in/frontend/react-js/ecommerce/electronics-short-tri-pod.png',
      title: 'Lightweight Tripod',
      style: 'Lightweight Tripod',
      price: 760,
      description:
        'Adjustable-height tripod made of lightweight aluminum, Recommended max load weight is 2 Kg for optimal performance. ',
      brand: 'LEGO',
      total_reviews: 5463,
      rating: 3.9,
      availability: 'In Stock',
    },
  ],
}

const productsApiUrl = 'https://apis.ccbp.in/products'
const primeDealsApiUrl = 'https://apis.ccbp.in/prime-deals'
const productDetailsApiUrl1 = 'https://apis.ccbp.in/products/16'
const productDetailsApiUrl2 = 'https://apis.ccbp.in/products/24'

const handlers = [
  rest.get(primeDealsApiUrl, (req, res, ctx) =>
    res(ctx.json(primeDealsResponse)),
  ),
  rest.get(productsApiUrl, (req, res, ctx) => res(ctx.json(productsResponse))),
  rest.get(productDetailsApiUrl1, (req, res, ctx) =>
    res(ctx.json(productDetailsResponse)),
  ),
  rest.get(productDetailsApiUrl2, (req, res, ctx) =>
    res(ctx.json(productDetailsResponse1)),
  ),
]

const server = setupServer(...handlers)

const mockGetCookie = (nonPrime = true) => {
  let mockedGetCookie
  if (nonPrime) {
    mockedGetCookie = jest.fn(() => ({
      jwt_token:
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InJhaHVsIiwiaWF0IjoxNjE5MDk0MjQxfQ.1i6BbQkQvtvpv72lHPNbl2JOZIB03uRcPbchYYCkL9o',
    }))
  } else {
    mockedGetCookie = jest.fn(() => undefined)
  }
  jest.spyOn(Cookies, 'get')
  Cookies.get = mockedGetCookie
}

const restoreGetCookieFns = () => {
  Cookies.get.mockRestore()
}

const originalConsoleError = console.error

export default class CustomApp extends Component {
  render() {
    const {providerProps} = this.props
    return (
      <CartContext.Provider {...providerProps}>
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

const rtlRenderContext = (providerProps, route = '/cart') => {
  window.history.pushState({}, 'Test page', route)
  return render(<CustomApp providerProps={providerProps} />, {
    wrapper: BrowserRouter,
  })
}

const renderWithBrowserRouter = (ui, {route = '/'} = {}) => {
  window.history.pushState({}, 'Test page', route)
  return render(ui, {wrapper: BrowserRouter})
}

describe(':::RJSCPFOQQB_TEST_SUITE_6:::Cart Route tests', () => {
  beforeAll(() => {
    server.listen()
  })

  afterEach(() => {
    console.error = originalConsoleError
    server.resetHandlers()
  })

  afterAll(() => {
    server.close()
  })

  it(':::RJSCPFOQQB_TEST_91:::When a product is added multiple times in to the cart, the quantity of the respective item should be incremented accordingly:::5:::', async () => {
    mockGetCookie()
    renderWithBrowserRouter(<App />, {route: productDetailsPath2})
    expect(
      await screen.findByRole('heading', {
        name: productDetailsResponse1.title,
        exact: false,
      }),
    ).toBeInTheDocument()
    const cartBtn = screen.getByRole('link', {
      name: /^cart/i,
      exact: false,
    })

    userEvent.click(
      screen.getByRole('button', {
        name: /Add To Cart/i,
        exact: false,
      }),
    )
    userEvent.click(
      screen.getByRole('button', {
        name: /Add To Cart/i,
        exact: false,
      }),
    )
    userEvent.click(
      screen.getByRole('button', {
        name: /Add To Cart/i,
        exact: false,
      }),
    )
    userEvent.click(cartBtn)

    expect(window.location.pathname).toBe('/cart')
    expect(screen.getByText(/3/)).toBeInTheDocument()
    expect(
      screen.getByText(/3/, {
        exact: false,
      }).tagName,
    ).toBe('P')

    const productsBtn = screen.getAllByRole('link', {
      name: /products/i,
      exact: false,
    })[0]

    userEvent.click(productsBtn)

    expect(window.location.pathname).toBe('/products')

    expect(
      await screen.findByRole('heading', {
        name: productsResponse.products[0].title,
        exact: false,
      }),
    ).toBeInTheDocument()

    userEvent.click(
      screen.getByRole('heading', {
        name: productsResponse.products[0].title,
        exact: false,
      }),
    )

    expect(await window.location.pathname).toBe('/products/24')

    expect(
      await screen.findByRole('heading', {
        name: productDetailsResponse1.title,
        exact: false,
      }),
    ).toBeInTheDocument()

    expect(screen.getByTestId('plus')).toBeInTheDocument()
    userEvent.click(screen.getByTestId('plus'))
    userEvent.click(screen.getByTestId('plus'))

    userEvent.click(
      screen.getByRole('button', {
        name: /Add To Cart/i,
        exact: false,
      }),
    )

    const cartBtn2 = screen.getAllByRole('link', {
      name: /cart/i,
      exact: false,
    })[0]

    userEvent.click(cartBtn2)

    expect(await window.location.pathname).toBe('/cart')
    expect(screen.getByText(/6/)).toBeInTheDocument()
    expect(
      screen.getByText(/6/, {
        exact: false,
      }).tagName,
    ).toBe('P')

    restoreGetCookieFns()
  })
})
