import React, {useState, useEffect, useCallback} from 'react';
import { useDispatch } from 'react-redux';
import { FlatList,View, Button, StyleSheet, Text, Platform, ActivityIndicator } from 'react-native';
import { useSelector } from 'react-redux';
import { HeaderButtons, Item } from 'react-navigation-header-buttons';
import HeaderButton from '../../components/UI/HeaderButton';
import OrderItem from '../../components/shop/OrderItem';
import * as ordersActions from '../../store/actions/order';
import Colors from '../../constants/Colors';

const Order = props => {
    const orders = useSelector(state => state.orders.orders);
    const dispatch = useDispatch();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState();

    const fetchOrdersHandler = useCallback(async () => {
      setIsLoading(true);
      setError(null);
      try {
        await dispatch(ordersActions.fetchOrders());
      } catch (err){
        setError(err)
      }
      setIsLoading(false);
    }, [dispatch])

    // as practice only
    // useEffect(() => {
    //   const onNavigating = props.navigation.addListener('willFocus', fetchOrdersHandler);

    //   return () => {
    //     onNavigating.remove();
    //   }
    // }, [fetchOrdersHandler])

    useEffect(() => {
      fetchOrdersHandler();
    }, [fetchOrdersHandler])

    if (error){
      return (
        <View style={styles.centered}>
          <Text style={{fontFamily: 'open-sans', color:'red'}}>{error.message}</Text>
          <Button title="Try again" color={Colors.primary} onPress={fetchOrdersHandler} />
        </View>
      )
    }

    if (isLoading){
      return (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color={Colors.primary} />
        </View>
      );
    }

    return (
      <FlatList
        data={orders}
        keyExtractor={item => item.id}
        renderItem={itemData => (
          <OrderItem
            items={itemData.item.items}
            amount={itemData.item.totalAmount}
            date={itemData.item.readableDate}
          />
        )}
      />
    );
};

Order.navigationOptions =  navData => {
    return {
        headerTitle: "Your Orders",
        headerLeft: (
            <HeaderButtons HeaderButtonComponent={HeaderButton}>
              <Item title="Menu" iconName={Platform.OS === "android" ? "md-menu" : "ios-menu"} onPress={() => {
                navData.navigation.toggleDrawer();
              }}></Item>
            </HeaderButtons>
          ),
    }
}

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  }
})

export default Order;