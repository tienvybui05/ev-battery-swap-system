import AboutMe from "./AboutMe/AboutMe";
import Features from "./Features/Features";
import styles from "./Home.module.css";
import PriceList from "./PriceList/PriceList";
function Home() {
  return <div className={styles.wrapper}>
    <AboutMe/>
    <Features/>
    <PriceList/>
  </div>
}
export default Home;
