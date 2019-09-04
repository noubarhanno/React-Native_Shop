import React from 'react';
import { createAppContainer, createSwitchNavigator } from 'react-navigation';
import { Platform, SafeAreaView, Button, View } from 'react-native';
import { createStackNavigator } from 'react-navigation-stack';
import { createDrawerNavigator, DrawerNavigatorItems } from 'react-navigation-drawer';
import ProductsOverview from '../screens/shop/ProductsOverview';
import ProductDetail from '../screens/shop/ProductDetail';
import UserProducts from '../screens/user/UserProducts';
import EditProduct from '../screens/user/EditProduct';
import AuthScreen from '../screens/user/AuthScreen';
import StartupScreen from '../screens/StartupScreen';
import Order from '../screens/shop/Orders';
import Cart from '../screens/shop/Cart';
import Colors from '../constants/Colors';
import { Ionicons } from '@expo/vector-icons';
import { useDispatch } from 'react-redux';
import * as AuthActions from '../store/actions/auth';

const defaultNavOptions = {
    headerStyle: {
        backgroundColor: Platform.OS === 'android' ? Colors.primary : ''
    },
    headerTitleStyle: {
        fontFamily: 'open-sans-bold'
    },
    headerBackTitleStyle: {
        fontFamily: 'open-sans'
    },
    headerTintColor: Platform.OS === 'android' ? 'white' : Colors.primary
}

const ProductsNavigator = createStackNavigator({
    ProductsOverview: ProductsOverview,
    ProductDetail: ProductDetail,
    Cart: Cart
}, {
    navigationOptions: {
        drawerIcon: drawerConfig => <Ionicons name={Platform.OS === 'android' ? 'md-cart' : 'ios-cart' } Size= {23} color={drawerConfig.tintColor} />
    },
    defaultNavigationOptions: defaultNavOptions
}
);

const OrdersNavigator = createStackNavigator({
    orders: Order
}, {
    navigationOptions: {
        drawerIcon: drawerConfig => <Ionicons name={Platform.OS === 'android' ? 'md-create': 'ios-create'} Size= {23} color={drawerConfig.tintColor}/>
    },
    defaultNavigationOptions: defaultNavOptions
})
const AdminNavigator = createStackNavigator({
    UserProducts: UserProducts,
    EditProduct: EditProduct
}, {
    navigationOptions: {
        drawerIcon: drawerConfig => <Ionicons name={Platform.OS === 'android' ? 'md-create': 'ios-create'} Size= {23} color={drawerConfig.tintColor}/>
    },
    defaultNavigationOptions: defaultNavOptions
})

const shopNavigator = createDrawerNavigator({
    Products: ProductsNavigator,
    Orders: OrdersNavigator,
    Admin: AdminNavigator
}, {
    contentOptions: {
        activeTintColor: Colors.primary
    },
    contentComponent: props => {
        const dispatch = useDispatch();
        return (
            <View style={{flex: 1, paddingTop: 20}}>
                <SafeAreaView forceInset={{tope: 'always', horizontal: 'never'}}>
                    <DrawerNavigatorItems {...props} />
                    {/* above is the old navigation items we have */}
                    <Button title="Logout" color={Colors.primary} onPress={() => {
                        dispatch(AuthActions.logout());
                        // props.navigation.navigate('Auth'); we remove this part as we now have a conatiner which checks the token and the userId and navigate upon the inavaibility
                    }} />
                </SafeAreaView>
            </View>
        );
    }
})

const AuthNavigator = createStackNavigator({
    Auth: AuthScreen
}, {
    defaultNavigationOptions: defaultNavOptions
})

const MainNavigator = createSwitchNavigator({
    Startup: StartupScreen,
    Auth: AuthNavigator,
    Shop: shopNavigator
});

export default createAppContainer(MainNavigator);