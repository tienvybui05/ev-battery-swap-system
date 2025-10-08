import { BrowserRouter, Routes, Route } from "react-router";

import { PublicLayout, PrivateLayout } from "./components/Layouts";
import Home from "./pages/Home/Home";
import NotFound from "./pages/NotFound/NotFound";
import Dashboard from "./pages/Dashboard/Dashboard";
function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<PublicLayout />}>
            <Route index element={<Home />} />
            <Route path="*" element={<NotFound />} />
          </Route>
          <Route path="/dashboard" element={<PrivateLayout />}>
            <Route index element={<Dashboard/>} />
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
