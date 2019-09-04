import React, {useEffect, useRef} from 'react';
import { useSelector } from 'react-redux';
import { NavigationActions } from 'react-navigation';
import ShopNavigator from './ShopNavigator';

const NavigationContainer = props => {
    const navRef = useRef();
    const isAuth = useSelector(state => !!state.auth.token);

    useEffect(() => {
        if(!isAuth){
            navRef.current.dispatch(NavigationActions.navigate({routeName: 'Auth'}));
        }
    }, [isAuth])
    return <ShopNavigator ref={navRef} />
};

export default NavigationContainer;

// the code above has two things 
// first we could make a container for the ShopNavigator which let us render the ShopNavigator and give an access to the redux Store without changing anything on the shopnavigator
// because at the end we need the redux store to check the token and the userId and the other thing is the useRef which works as a connection between the parent and the child component
// we used it as above then to have access to props.navigation (note we didn't have access to the navigation because the shopNavigator is a child not a parent) we use useRef().current.dispatch
// current is the current component which is ShopNavigator which at the end is AppContainer and this AppContainer has a dispatch method to dispatch action which is at the end multiple actions 
// build in inside react-navigation which props.navigation.navigate is using them behind the scene and this actions is imported from react-navigation which is NavigationAction then access navigate 
// method and don't pass the navigation url as string but instead pass it as js object which contains routeName as a key value 