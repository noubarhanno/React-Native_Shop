import { ADD_TO_CART, REMOVE_FROM_CART } from "../actions/cart";
import CartItem from '../../models/cart-item';
import { ADD_ORDER } from "../actions/order";
import { DELETE_PRODUCT } from "../actions/products";

const initialState = {
    items: {},
    totalAmount: 0
};

export default (state = initialState, action) => {
    switch(action.type){
        case ADD_TO_CART:
            const addedProduct = action.product;
            const prodPrice = addedProduct.price;
            const prodTitle = addedProduct.title;

            let updateOrNewCartItem;
            if (state.items[addedProduct.id]){
                // already have the item in the cart
                updateOrNewCartItem = new CartItem(
                    state.items[addedProduct.id].quantity + 1,
                    prodPrice,
                    prodTitle,
                    state.items[addedProduct.id].sum + prodPrice
                );
                return {
                    ...state,
                    items: {...state.items, [addedProduct.id]: updateOrNewCartItem},
                    totalAmount: state.totalAmount + prodPrice
                }
            } else {
                updateOrNewCartItem = new CartItem(1, prodPrice, prodTitle, prodPrice);
                return {
                    ...state,
                    items: {...state.items, [addedProduct.id]: updateOrNewCartItem},
                    totalAmount: state.totalAmount + prodPrice
                }
            }
        case REMOVE_FROM_CART:
            const selectedItem = state.items[action.pid];
            const currentlyQty = state.items[action.pid].quantity;
            let updatedCartItems;
            if (currentlyQty > 1){
                // need to reduce it
                updatedCartItems = new CartItem(selectedItem.quantity -1, selectedItem.productPrice, selectedItem.productTitle, selectedItem.sum - selectedItem.productPrice);
                updatedCartItems = {...state.items, [action.pid]: updatedCartItems}
            } else {
                updatedCartItems = {...state.items };
                delete updatedCartItems[action.pid] // to delete item from an object
            }
            return {
                ...state,
                items: updatedCartItems,
                totalAmount: state.totalAmount - selectedItem.productPrice
            }
        case ADD_ORDER:
            return initialState;
        case DELETE_PRODUCT:
            if (!state.items[action.pid]){
                return state;
            }
            const updatedItems = {...state.items};
            const itemTotal = state.items[action.pid].sum
            delete updatedItems[action.pid]
            return {
                ...state,
                items: updatedItems,
                totalAmount: state.totalAmount - itemTotal
            }
        default:
            return state;
    }
    
};