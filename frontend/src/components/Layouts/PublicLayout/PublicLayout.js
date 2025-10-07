import { Outlet } from "react-router";
import Footer from "./Footer/Footer.js";
import Header from "./Header/Header.js";
import Main from "./Main/Main.js"
function PublicLayout(){
    return <>
    <Header/>
    <Main>
         <Outlet />
    </Main>
    <Footer/>
    </>
}
export default PublicLayout;