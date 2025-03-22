
// css styles 
import styles from "../../styles/home.module.css";


// render the filter bar
export default function FilterBar(props){
    const {price,setPrice,setCategory}=props;

    return(

        // main container of filter bar
        <div className={styles.filterBar}>

            {/* heading */}
            <h1>
                FilterBar
            </h1>

            {/* price ranger and price slider  */}
            <div className={styles.priceRange}>
                {/* sub heading */}
                <span>Price</span>{` <= ${price}`}
                <br />
                {/* slider  */}
                <input type="range" 
                    min="100" 
                    max="50000" 
                    value={price} 
                    onChange={(e) => setPrice(e.target.value)} />
            </div>
                
                
            {/* sort item by category */}
            <div className={styles.categoryBox}>
                {/* sub heading */}
                <span>Category:</span>

                {/* radio buttons for differnet category */}
                <div>
                    {/* men category */}
                    <input type="radio" 
                        id="men" 
                        value="men" 
                        name="category" 
                        onClick={()=>setCategory("men")}/>
                    <label for="men">Men</label>
                    
                    {/* women category */}
                    <input type="radio" 
                        id="women" 
                        value="women" 
                        name="category"
                        onClick={()=>setCategory("women")}/>
                    <label for="women">Women</label>
                    
                    {/* electronic */}
                    <input type="radio" 
                        id="electric" 
                        value="electric" 
                        name="category"
                        onClick={()=>setCategory("electric")}/>
                    <label for="electric">Electronic</label>
                    
                    {/* jewellery */}
                    <input type="radio" 
                        id="jewellery" 
                        value="jewellery" 
                        name="category"
                        onClick={()=>setCategory("jewellery")}/>
                    <label for="jewellery">Jewellery</label>

                    {/* none  */}
                    <input type="radio" 
                        id="none" 
                        value="none" 
                        name="category"
                        onClick={()=>setCategory("none")}/>
                    <label for="jewellery">None</label>
                </div>

            </div>
            
        </div>
        
    )
}