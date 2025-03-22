
// import styles 
import styles from "../../styles/home.module.css";

// import component to render a single item in the list
import ItemCard from "./ItemCard";

// getting all the product data
import { data } from "../../Assets/data";

// to show all the products
export default function MainContent(props){
    
    // values form props to filter list
    const {search,price,category,applyFilter}=props;
    

    return(
        <div className={styles.itemContainer}>
            {/* filter on the basis of search bar */}
            {data.filter((item) => {
                    return search.toLocaleLowerCase() === ''
                    ? item
                    :item.name.toLocaleLowerCase().includes(search)})
            // filter on the basis of price range
            .filter((item) => {
                    return !applyFilter
                    ? item
                    :item.price <= price})
            // filter on the basis of category
            .filter((item) => {
                    return !applyFilter || category === 'none'
                    ? item
                    :item.category === category})
            // map to each item of the array
            .map((item) => <ItemCard 
                                    key={item.id} 
                                    item={item} />)}
        </div>
        
    )
}