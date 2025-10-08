import AboutMe from "./AboutMe/AboutMe";
import styles from "./Home.module.css";
function Home() {
  return <div className={styles.wrapper}>
    <AboutMe/>
  </div>
}
export default Home;
