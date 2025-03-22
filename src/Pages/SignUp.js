// react ref hook 
import { useRef } from "react";

// redux tool for calling actions
import { useDispatch } from "react-redux";

// Auth Reducer actions for creating a new user 
import { createUserThunk } from "../Redux/Reducers/authReducer";


// navigation router
import { useNavigate } from "react-router-dom";

// css styles
import styles from "../styles/signIn.module.css";


// signup page
export function SignUp(){

    // for calling actions
    const dispatch = useDispatch();

    // ref variables for name, email, password
    const nameRef=useRef();
    const emailRef=useRef();
    const passwordRef=useRef();

    // navigation variable
    const navigate=useNavigate();

    // handle form submit
    function handleSubmit(e){
        e.preventDefault();

        // storing user's data
        const data={
            name:nameRef.current.value,
            email:emailRef.current.value,
            password:passwordRef.current.value
        }
        // creating user
        dispatch(createUserThunk(data));

        // redirect to signIn page
        navigate("/signin");
    }
    
    return(
        <>
            {/* main container  */}
            <div className={styles.container}>
                <div className={styles.inputForm}>
                    {/* heading */}
                    <h1>SignUp</h1>
                    {/* form to get user's data */}
                    <form onSubmit={handleSubmit}>
                        {/* for name */}
                        <input type="text" 
                            placeholder="Name" 
                            required
                            ref={nameRef} />
                        {/* for email */}
                        <input type="email" 
                            placeholder="Enter Email"
                            required 
                            ref={emailRef}/>
                        {/* for password */}
                        <input type="password" 
                            placeholder="Enter Password"
                            required
                            ref={passwordRef} />
                        {/* submit button */}
                        <button>Submit</button>
                    </form>
                </div>
            </div>
        </>
    );
}