import React, {useState} from 'react';
import { createStore, combineReducers, applyMiddleware } from 'redux';
import ReduxThunk from 'redux-thunk';
import { Provider } from 'react-redux';
import ProductsReducer from './store/reducers/products';
import CartReducer from './store/reducers/cart';
import OrderReducer from './store/reducers/order';
import NavigationContainer from './naigation/NavigationContainer';
import authReducer from './store/reducers/auth';
import { AppLoading } from 'expo';
import * as Font from 'expo-font';
import { composeWithDevTools } from 'redux-devtools-extension';

const rootReducer = combineReducers({
  products: ProductsReducer,
  cart: CartReducer,
  orders: OrderReducer,
  auth: authReducer
});

const store = createStore(rootReducer, applyMiddleware(ReduxThunk));
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
      <NavigationContainer />
    </Provider>
  );
}
