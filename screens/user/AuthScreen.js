import React, {useState, useReducer, useCallback, useEffect} from 'react';
import { ScrollView, ActivityIndicator, StyleSheet, View, KeyboardAvoidingView, Button, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useDispatch } from 'react-redux';
import * as Actions from '../../store/actions/auth';
import Input from '../../components/UI/Input';
import Card from '../../components/UI/Card';
import Colors from '../../constants/Colors';

const FORM_UPDATE = "FORM_UPDATE";

const formReducer = (state, action) => {
  if (action.type === FORM_UPDATE) {
    const updatedValues = {
      ...state.inputValues,
      [action.input]: action.value
    };
    const updatedValidities = {
      ...state.inputValidities,
      [action.input]: action.isValid
    };
    let updatedFormIsValid = true;
    for (const key in updatedValidities) {
      updatedFormIsValid = updatedFormIsValid && updatedValidities[key];
    }
    return {
      ...state,
      formIsValid: updatedFormIsValid,
      inputValidities: updatedValidities,
      inputValues: updatedValues
    };
  }
  return state;
};





const AuthScreen = props => {
  const[isSignup, setIsSignup] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState();
  const [formState, dispatchFormState] = useReducer(formReducer, {
    inputValues: {
      email: '',
      password: ''
    },
    inputValidities: {
      email: false,
      password: false
    },
    formIsValid: false
  });

    const dispatch = useDispatch();

    useEffect(() => {
      if (error) {
        Alert.alert('An Error Occured!', error, [{text: 'Okay'}])
      }
    },[error])

    const authHandler = async () => {
      let action;
      if (isSignup){
        action = Actions.signup(formState.inputValues.email, formState.inputValues.password)
      } else {
        action = Actions.login(formState.inputValues.email, formState.inputValues.password);
      }
      setError(null);
      setIsLoading(true);
      try{
        await dispatch(action);
        props.navigation.navigate('Shop');
      } catch (err){
        setError(err.message);
        setIsLoading(false);
      }
      
      
    }

    const inputChangeHandler = useCallback((input, text, inputValidity) => {
      dispatchFormState({
        type: FORM_UPDATE,
        value: text,
        isValid: inputValidity,
        input: input
      });
    }, [dispatchFormState])

    return (
      <KeyboardAvoidingView
        behavior="padding"
        keyboardVerticalOffset={50}
        style={styles.screen}
      >
        <LinearGradient colors={["#ffedff", "#ffe3ff"]} style={styles.gradient}>
          <Card style={styles.authContainer}>
            <ScrollView>
              <Input
                id="email"
                label="E-Mail"
                keyboardType="email-address"
                required
                email
                autoCapitalize="none"
                errorText="Please enter a valid email address"
                onInputChange={inputChangeHandler}
                initialValue=""
              />
              <Input
                id="password"
                label="Password"
                keyboardType="default"
                secureTextEntry
                required
                minLength={5}
                autoCapitalize="none"
                errorText="Please enter a valid password"
                onInputChange={inputChangeHandler}
                initialValue=""
              />
              <View style={styles.buttonContainer}>
              {isLoading ? <ActivityIndicator size="small" color={Colors.primary} /> : 
              <Button title={isSignup ? 'Sign Up' : 'Login'} color={Colors.primary} onPress={authHandler} />
              }
              </View>
              <View style={styles.buttonContainer}>
                <Button
                  title={isSignup ? "Switch to Login" : "Switch to Signup"}
                  color={Colors.accent}
                  onPress={() => {
                    setIsSignup(prevState => !prevState);
                  }}
                />
              </View>
            </ScrollView>
          </Card>
        </LinearGradient>
      </KeyboardAvoidingView>
    );
};

AuthScreen.navigationOptions = {
  headerTitle:"Authenticate"
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  authContainer:{
    width: '80%',
    maxWidth: 400,
    maxHeight: 400,
    padding: 20
  },
  gradient:{
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center'
  },
  buttonContainer: {
    marginTop: 10,
  }
});

export default AuthScreen;