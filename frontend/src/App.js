import { BrowserRouter, Routes, Route } from "react-router";

import { PublicLayout, PrivateLayout } from "./components/Layouts";
import Home from "./pages/Home/Home";
import NotFound from "./pages/NotFound/NotFound";
import Dashboard from "./pages/Dashboard/Dashboard";
import Login from "./pages/Authentication/Login/Login";

import {
  FindStation,
  History,
  Information,
  ChangeBattery,
} from "./pages/Driver";
function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<PublicLayout />}>
            <Route index element={<Home />} />
            <Route path="login" element={<Login />} />
            <Route path="*" element={<NotFound />} />
          </Route>
          <Route path="/dashboard" element={<PrivateLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="findstation" element={<FindStation />} />
            <Route path="changebattery" element={<ChangeBattery />} />
            <Route path="history" element={<History />} />
            <Route path="information" element={<Information />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
