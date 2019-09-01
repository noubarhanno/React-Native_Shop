import React, {useState} from 'react';
import { createStore, combineReducers } from 'redux';
import { Provider } from 'react-redux';
import ProductsReducer from './store/reducers/products';
import ShopNavigator from './naigation/ShopNavigator';
import { AppLoading } from 'expo';
import * as Font from 'expo-font';

const rootReducer = combineReducers({
  products: ProductsReducer
});

const store = createStore(rootReducer);

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
