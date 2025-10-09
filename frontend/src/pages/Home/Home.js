import AboutMe from "./AboutMe/AboutMe";
import Features from "./Features/Features";
import styles from "./Home.module.css";
function Home() {
  return <div className={styles.wrapper}>
    <AboutMe/>
    <Features/>
  </div>
}
export default Home;
