import { BrowserRouter, Routes, Route } from "react-router";

import { PublicLayout,PrivateLayout } from "./components/Layouts";
import Home from "./pages/Home/Home";
import NotFound from "./pages/NotFound/NotFound";
import HomeManager from "./pages/HomeManager/HomeManager";
function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<PublicLayout />}>
            <Route index path="/" element={<Home />} />
            <Route path="/*" element={<NotFound />} />
          </Route>
          <Route path="/manager" element={<PrivateLayout/>}>
            <Route index path="/manager" element={<HomeManager/>} />
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
