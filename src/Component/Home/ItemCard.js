
// for calling reducer actions
import { useDispatch } from "react-redux";

// thunk action from Product Reducer
import { addToCartThunk } from "../../Redux/Reducers/productReducer";

// css styles
import styles from "../../styles/home.module.css";


// component to render single product item on the screen
export default function ItemCard(props){

    // for calling actions
    const dispatch = useDispatch();
    
    // getting all the value of product from props
    const {name,image,price,category}=props.item;


    return(
        <>  
            {/* main container */}
            <div className={styles.cardContainer} >
                
                {/* image container */}
                <div className={styles.imageContainer}>
                    <img src={image} alt={category} />
                </div>

                {/* description of the product name,price, add button */}
                <div className={styles.itemInfo}>
                    <div className={styles.namePrice}>
                        {/* name of product */}
                        <div className={styles.name}>
                            {name}
                        </div>

                        {/* price of the product */}
                        <div className={styles.price}>
                            ₹{price}   
                        </div>
                    </div>
                    

                    {/* add to cart button */}
                    <div className={styles.btnContainer}>
                        <button className={styles.addBtn}
                                // add product to the cart
                                onClick={() => dispatch(addToCartThunk(props.item))}>
                            Add to Cart
                        </button>
                    </div>

                </div>

            </div>
        </>
    )
}