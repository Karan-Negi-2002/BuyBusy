
// redux tools for calling actions and getting data from store
import { useDispatch, useSelector } from "react-redux";

// css styles 
import styles from "../../styles/navbar.module.css";

// import form react router
import { Outlet, NavLink } from "react-router-dom";

// actions from Auth Reducer
import { authSelector, removeSessionThunk } from "../../Redux/Reducers/authReducer";


// Navbar Component
export default function Navbar(){

    // for calling actions
    const dispatch=useDispatch();
    
    // user's login status from redux store
    const {isLoggedIn}=useSelector(authSelector);

    
    return(
        <>
            {/* main container */}
            <div className={styles.navbarContainer}> 
                {/* app heading */}
                <div className={styles.appName}>
                    <NavLink to="/">
                        {/* logo of the app */}
                        <i class="fa-solid fa-shop"></i>
                        Buy Busy
                    </NavLink>
                </div>

                {/* all the navigation link */}
                <div className={styles.navLinks}>

                    {/* homepage link */}
                    <NavLink to="/">
                        <span>
                            {/* home logo */}
                            <i class="fa-solid fa-house"></i>
                            Home
                        </span>
                    </NavLink>

                    {/* myorder link */}
                    {/* show when user is logged in */}
                    {isLoggedIn && <NavLink to="/myorder">
                        <span>
                            {/* my order logo */}
                            <i class="fa-solid fa-bag-shopping"></i>
                            My Order
                        </span>
                    </NavLink> }


                    {/* cart link */}
                    {/* show when user is logged in */}
                    {isLoggedIn && <NavLink to="/cart">
                        <span>
                            {/* cart icon */}
                            <i class="fa-sharp fa-solid fa-cart-shopping"></i>
                            Cart
                        </span>
                    </NavLink> }


                    {/* for signIN and signOut */}
                    <NavLink to={!isLoggedIn?"/signin":"/"}>
                        <span>
                            {!isLoggedIn?
                                <>
                                    {/* sign in icon */}
                                    <i class="fa-solid fa-right-to-bracket"></i>
                                    SignIn
                                </>
                                :
                                <>
                                    {/* sign out icon */}
                                    <i class="fa-solid fa-right-from-bracket"></i>
                                    {/* sign out user  */}
                                    <span onClick={() => dispatch(removeSessionThunk())}>SignOut</span>
                                </>
                            }
                        </span>
                    </NavLink>
                </div>
            </div>
            {/* render child pages */}
            <Outlet />
        </>
    )
}