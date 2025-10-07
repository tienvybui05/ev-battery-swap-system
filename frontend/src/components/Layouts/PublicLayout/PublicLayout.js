import { Outlet } from "react-router";
import styles from "./PublicLayout.module.css";
import GlobalStyles from "../../GlobalStyles/GlobalStyles.js";
import Footer from "./Footer/Footer.js";
import Header from "./Header/Header.js";
import Main from "./Main/Main.js";

function PublicLayout() {
  return (
    <>
      <GlobalStyles>
        <div className={styles.wrapper}>
            <div className={styles.header}>
                 <Header />
            </div>
          <div className={styles.main}>
            <Main>
              <Outlet />
            </Main>
          </div>
          <Footer />
        </div>
      </GlobalStyles>
    </>
  );
}
export default PublicLayout;
