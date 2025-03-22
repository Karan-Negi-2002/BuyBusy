
// for creating slice and AsycnThunk
import { createAsyncThunk, createSlice} from "@reduxjs/toolkit";

// firebase database
import {db} from "../../firebaseInit";
import { updateDoc, doc, arrayUnion, onSnapshot, arrayRemove } from "firebase/firestore";

// for toast notificatioins
import { toast } from "react-toastify";



// return date in yy/mm/dd format
function getDate(){
    // getting current date
    const date = new Date();
    // day 
    let day = date.getDate();
    // month
    let month = date.getMonth() + 1;
    // year
    let year = date.getFullYear();
    // yy/mm/dd format
    return(`${year}-${month}-${day}`);
}



// async thunk to get initial Data of cart items and order placed by user from database
export const getInitialCartOrdersThunk = createAsyncThunk(
    'product/getCartOrders',
    (args,thunkAPI) => {
        // getting user's data from redux store
        const {authReducer,productReducer} = thunkAPI.getState();
        const {isLoggedIn,userLoggedIn} = authReducer;
        
        // whether user logged In
        if(isLoggedIn){
            // getting real-time update of data

            const unsub = onSnapshot(doc(db, "buybusy-redux",userLoggedIn.id), (doc) => {
                // storing all the data in cart
                const data = doc.data();
                thunkAPI.dispatch(setCart(data.cart));
                thunkAPI.dispatch(setMyOrders(data.orders));
            });
            
            // returning the cart to extraReducer for further operations
            return productReducer.cart;
        }
    }
)



// async thunk to update cart inside the database
const updateCartInDatabase = createAsyncThunk(
    'product/updateCartInDatabase',
    async(args,thunkAPI) => {

        // user's data from initialState
        const {authReducer, productReducer} = thunkAPI.getState();
        const { userLoggedIn } = authReducer;

        // update the cart inside the firebase database
        const userRef = doc(db, "buybusy-redux", userLoggedIn.id);
        await updateDoc(userRef, {
            cart: productReducer.cart
        });
    }
)



// increase product quantity in cart and database
export const increaseQuantThunk = createAsyncThunk(
    "product/increaseProductQuantity",
    async (product,thunkAPI) => {
        // user's data
        const {productReducer} = thunkAPI.getState();

        // finding product inside the cart
        const index=productReducer.cart.findIndex((item) => item.name === product.name);
        
        // increase the quantity of product in initialState cart
        thunkAPI.dispatch(increaseProductQuantity(index));      
        
        // increase total amount of products in cart
        thunkAPI.dispatch(increaseTotalAmount(product.price));

        // update the cart inside the database
        thunkAPI.dispatch(updateCartInDatabase());
    }
)


// decrease the quantity of product in cart and database
export const decreaseQuantThunk = createAsyncThunk(
    "product/decreaseProductQuantity",
    async(product,thunkAPI) => {

        // getting user's data 
        const { productReducer } = thunkAPI.getState();
        
        // finding the product inside the cart 
        const index=productReducer.cart.findIndex((item) => item.name === product.name);
        
        // if quantity of product is 1 then remove it from the cart
        if(productReducer.cart[index].quantity === 1){
            thunkAPI.dispatch(removeFromCartThunk(product));
            return;
        }

        // else
        // decrease the quantity of product inside the cart
        thunkAPI.dispatch(decreaseProductQuantity(index));

        // reduce the amount of product from total amount of cart
        thunkAPI.dispatch(reduceTotalAmount(productReducer.cart[index].price));

        // update the cart inside the database
        thunkAPI.dispatch(updateCartInDatabase());
        
    }
)


// async thunk for adding a new product to the cart
export const addToCartThunk = createAsyncThunk(
    "product/addToCart",
    async (product,thunkAPI) => {
        // getting user's data 
        const { authReducer,productReducer } = thunkAPI.getState();
        const {isLoggedIn,userLoggedIn} = authReducer;
        
        // check whether user is logged in or not
        if(!isLoggedIn){
            toast.error("Please first Login !!!");
            return;
        }

        // checking whether the product already in the cart
        const index=productReducer.cart.findIndex((item) => item.name === product.name);
        if(index !== -1){
            // if product already in cart then increase quantity and return
            thunkAPI.dispatch(increaseQuantThunk(productReducer.cart[index]));
            toast.success("Product Quantity Increased!!");
            return;
        }

        // else
        // add product to the cart of loggedIn user in database
        const userRef = doc(db, "buybusy-redux", userLoggedIn.id);
        await updateDoc(userRef, {
            cart: arrayUnion({quantity:1,...product})
        });
        
        // increase total amount and product quantity
        thunkAPI.dispatch(increaseTotalAmount(product.price));
        thunkAPI.dispatch(increaseTotalItem());

        // notification
        toast.success("Added to your Cart!!");
    }
);


// remove product from the cart
export const removeFromCartThunk = createAsyncThunk(
    "product/removeFromCart",
    async(product,thunkAPI) => {

        // getting user's data
        const { authReducer } = thunkAPI.getState();
        const {userLoggedIn} = authReducer;
        
        // remove the product from cart in database 
        const userRef = doc(db, "buybusy-redux", userLoggedIn.id);
        await updateDoc(userRef, {
            cart: arrayRemove(product)
        });

        // returning product to the extraReducer for further operations
        return product;
    }
);


// async thunk to remove all the products from the cart
export const clearCartThunk = createAsyncThunk(
    "product/emptyCart",
    async (args,thunkAPI) => {

        // getting user's data
        const { authReducer, productReducer } = thunkAPI.getState();
        const {userLoggedIn} = authReducer;
        
        // if no item in cart then return with message
        if(productReducer.itemInCart === 0){
            toast.error("Nothing to remove in Cart!!");    
            return;
        }

        // empty cart array in database
        const userRef = doc(db, "buybusy-redux", userLoggedIn.id);
        await updateDoc(userRef, {
            cart: []
        });

        // notification
        toast.success("Empty Cart!!");
    }
);


// async thunk to purchase all the product inside the cart
export const purchaseAllThunk = createAsyncThunk(
    "product/purchaseAllItems",
    async (args,thunkAPI) => {

        // getting user's data 
        const { authReducer,productReducer} = thunkAPI.getState();
        const {userLoggedIn} = authReducer;
        
        // get current data from function
        const currentDate=getDate();
        
        // adding order to database with data, products and amount
        const userRef = doc(db, "buybusy-redux", userLoggedIn.id);
        await updateDoc(userRef, {
            orders: arrayUnion({date:currentDate,
                                list:productReducer.cart,
                                amount:productReducer.total})
            }
        );

        // removng all the product's from cart
        thunkAPI.dispatch(clearCartThunk());
    }
);



// slice to manage operation of products
const productSlice = createSlice({
    name:"product",
    // containing cart for products, total number of products in side the cart, list of all the order placed by the user, total amount of the products inside the cart
    initialState:{
        cart:[],
        itemInCart:0,
        myorders:[],
        total:0,
    },
    reducers:{
        // to initialize the myorder array on first render
        setMyOrders: (state,action) => {
            state.myorders = action.payload;
            return;
        },
        // increase quantity of a product in cart
        increaseProductQuantity: (state,action) => {
            const index = action.payload;
            state.cart.at(index).quantity++;
            return; 
        },
        // decrease quantity of a product in cart
        decreaseProductQuantity: (state,action) => {
            const index = action.payload;
            state.cart.at(index).quantity--;
            return;
        },
        // initialize the cart array on first render
        setCart: (state,action) => {
            state.cart = action.payload;
            return;
        },
        // to increase the total number of items in cart
        increaseTotalItem: (state,action) => {
            state.itemInCart++;
            return;
        },
        // to increase the total amount of products inside the cart
        increaseTotalAmount: (state,action) => {
            state.total += action.payload;
            return;
        },
        // to decrease the total amount of products inside the cart
        reduceTotalAmount: (state,action) => {
            state.total -= action.payload;
            return;
        }
    },
    extraReducers: (builder) => {
        // update the state after getting data from database
        builder.addCase(getInitialCartOrdersThunk.fulfilled, (state,action) => {
            const cart = action.payload;
            if(cart){    
                let sum=0,len =0;
                cart.map((item) => {
                    Number(sum += item.price * item.quantity);
                    Number(len += item.quantity);
                });
                state.total = sum;
                state.itemInCart = len;
            }
        })
        // update state after increasing product quantity in cart and database
        .addCase(increaseQuantThunk.fulfilled, (state,action) => {
            state.itemInCart++;
        })
        // update state after decreasing product quantity in cart and database
        .addCase(decreaseQuantThunk.fulfilled, (state,action) => {
            if(state.itemInCart > 1){
                state.itemInCart--;
            }
        })
        // update state after removing product from cart and database
        .addCase(removeFromCartThunk.fulfilled, (state,action) => {
            const product = action.payload;
            // reduce item count and total amount
            state.total -= product.quantity * product.price;
            state.itemInCart -= product.quantity;
            // notification
            toast.success("Removed from Cart!!");
        })
        // update state after removing all products from cart
        .addCase(clearCartThunk.fulfilled, (state,action) => {
            state.itemInCart = 0;
            state.total = 0;
            state.cart=[];
        })
    }
});


// exporting the reducer of slice
export const productReducer = productSlice.reducer;

// exporting all the actions of reducer
export const { setMyOrders, 
            increaseProductQuantity, 
            decreaseProductQuantity, 
            setCart, 
            increaseTotalItem,
            increaseTotalAmount, 
            reduceTotalAmount } = productSlice.actions;


// exporting the state of reducer to get data
export const productSelector = (state) => state.productReducer;