import React, {useState} from 'react';
import { createStore, combineReducers } from 'redux';
import { Provider } from 'react-redux';
import ProductsReducer from './store/reducers/products';
import CartReducer from './store/reducers/cart';
import OrderReducer from './store/reducers/order';
import ShopNavigator from './naigation/ShopNavigator';
import { AppLoading } from 'expo';
import * as Font from 'expo-font';
import { composeWithDevTools } from 'redux-devtools-extension';

const rootReducer = combineReducers({
  products: ProductsReducer,
  cart: CartReducer,
  orders: OrderReducer
});

const store = createStore(rootReducer, composeWithDevTools());
// add the second argument for debugging the redux store on react native debugger

const fetchFont = () => {
  return Font.loadAsync({
    "open-sans": require("./assets/fonts/OpenSans-Regular.ttf"),
    "open-sans-bold": require("./assets/fonts/OpenSans-Bold.ttf")
  });
}

export default function App() {
  const [fontLoaded, setFontLoaded] = useState(false);

  if (!fontLoaded){
    return (
      <AppLoading startAsync={fetchFont} onFinish={() => setFontLoaded(true)} />
    );
  }


  return (
    <Provider store={store}>
      <ShopNavigator />
    </Provider>
  );
}
