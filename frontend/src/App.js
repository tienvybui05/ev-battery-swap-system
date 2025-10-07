import { BrowserRouter, Routes, Route } from "react-router";

import { PublicLayout } from "./components/Layouts";
import Home from "./pages/Home/Home";
import NotFound from "./pages/NotFound/NotFound";
function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<PublicLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/*" element={<NotFound />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
