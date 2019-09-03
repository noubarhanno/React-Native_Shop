import React, {useState} from 'react';
import { View, Text, FlatList, StyleSheet, Button, ActivityIndicator } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import Colors from '../../constants/Colors';
import CartItem from '../../components/shop/CartItem';
import * as cartActions from '../../store/actions/cart';
import * as orderActions from '../../store/actions/order';
import Card from '../../components/UI/Card';

const Cart = props => {
    const cartTotalAmount = useSelector(state => state.cart.totalAmount);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState();
    const dispatch = useDispatch();
    const cartItems = useSelector(state => {
        const transformedCartItems = [];
        for(const key in state.cart.items){
            transformedCartItems.push({
                productId: key,
                productTitle: state.cart.items[key].productTitle,
                productPrice: state.cart.items[key].productPrice,
                quantity: state.cart.items[key].quantity,
                sum: state.cart.items[key].sum
            });
        }
        return transformedCartItems.sort((a , b) => a.productId > b.productId ? 1 : -1);
    });

    const sendOrderHandler = async () => {
      setError(null);
      setIsLoading(true)
      try {
        await dispatch(orderActions.addOrder(cartItems, cartTotalAmount));
      } catch (err){
        setError(err);
      }
      setIsLoading(false);
      
    }

    if(error){
      return (
        <View style={styles.centered}>
          <Text style={{color: 'red', fontFamily: 'open-sans'}}>{error.message}</Text>
          <Button title="Try again" onPress={sendOrderHandler} color={Colors.primary}/>
        </View>
      );
    }

    return (
      <View style={styles.screen}>
        <Card style={styles.summary}>
          <Text style={styles.summaryText}>
            Total:{" "}
            <Text style={styles.amount}>
              ${Math.round(cartTotalAmount.toFixed(2) * 100) / 100}
            </Text>
          </Text>
          { isLoading ? <ActivityIndicator size='large' color={Colors.primary}/> : 
          <Button
            color={Colors.accent}
            title="Order Now"
            disabled={cartItems.length === 0}
            onPress={sendOrderHandler}
          />
          }
        </Card>
        <FlatList
          data={cartItems}
          keyExtractor={item => item.productId}
          renderItem={itemData => (
            <CartItem
              deletable
              quantity={itemData.item.quantity}
              title={itemData.item.productTitle}
              amount={itemData.item.sum}
              onRemove={() => {
                dispatch(cartActions.removeFromCart(itemData.item.productId));
              }}
            />
          )}
        />
      </View>
    );
};

Cart.navigationOptions = {
    headerTitle: 'Your Cart'
}

const styles = StyleSheet.create({
  screen: {
    margin: 20
  },
  summary: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
    padding: 10,
  },
  summaryText: {
      fontFamily: 'open-sans-bold',
      fontSize: 18
  },
  amount: {
      color: Colors.primary
  },
  centered:{
    flex:1,
    justifyContent: 'center',
    alignItems: 'center'
  }
});

export default Cart;