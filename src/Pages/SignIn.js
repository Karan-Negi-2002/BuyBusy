
// react hook
import { useRef } from "react";

// redux tool for calling acitons
import { useDispatch } from "react-redux";

// reducer actions Auth Reducer
import { createSessionThunk } from "../Redux/Reducers/authReducer";

// react router
import { NavLink, useNavigate } from "react-router-dom";

// css styles
import styles from "../styles/signIn.module.css";


// signin page
export function SignIn(){
    // for calling actions
    const dispatch = useDispatch();

    // navigate variable to navigate to some page
    const navigate=useNavigate();
    
    // ref variables for email, password
    const emailRef=useRef();
    const passwordRef=useRef();


    // form submit function
    function handleSubmit(e){
        e.preventDefault();
        // storing user's data
        const data={
            email:emailRef.current.value,
            password:passwordRef.current.value
        }
        // sign in user
        const status=dispatch(createSessionThunk(data));
        // if user signed in redirect to corresponding page
        {status?navigate("/"):navigate("/signin")};        
    }   


    return(
        // main container of the page
        <div className={styles.container}>
            
            <div className={styles.inputForm}>
                {/* heading */}
                <h1>SignIn</h1>
                {/* form */}
                <form onSubmit={handleSubmit}>
                    {/* email */}
                    <input type="email" 
                        placeholder="Enter Email" 
                        required
                        ref={emailRef} />

                    <br />
                    {/* password */}
                    <input type="password" 
                        placeholder="Enter Password"
                        required
                        ref={passwordRef} />
                    <br />
                    {/* submit button */}
                    <button>Submit</button>
                </form>
                <br /> 
                <span>or &nbsp;</span>
                {/* link for signup page */}
                <NavLink to="/signup">
                    Create New Account
                </NavLink>
            </div>
            
        </div>
    );
}