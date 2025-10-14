import { BrowserRouter, Routes, Route } from "react-router";

import { PublicLayout, PrivateLayout } from "./components/Layouts";
import Home from "./pages/Home/Home";
import NotFound from "./pages/NotFound/NotFound";
import Dashboard from "./pages/Dashboard/Dashboard";
import Login from "./pages/Authentication/Login/Login";
import Register from "./pages/Authentication/Register/Register";

import {
  FindStation,
  History,
  Information,
  ChangeBattery,
} from "./pages/Driver";
import { Batteries, Customers, Overview, Staff, Stations } from "./pages/Admin";
import { Report,Inventory,QueueManagement,Transaction } from "./pages/Staff";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<PublicLayout />}>
            <Route index element={<Home />} />
            <Route path="login" element={<Login />} />
            <Route path="register" element={<Register/>} />
            <Route path="*" element={<NotFound />} />
          </Route>
          <Route path="/dashboard" element={<PrivateLayout />}>
            <Route index element={<Dashboard />} />
            {/* Driver */}
            <Route path="findstation" element={<FindStation />} />
            <Route path="changebattery" element={<ChangeBattery />} />
            <Route path="history" element={<History />} />
            <Route path="information" element={<Information />} />
            {/* Staff */}
            <Route path="transaction" element={<Transaction />} />
            <Route path="queueManagement" element={<QueueManagement />} />
            <Route path="inventory" element={<Inventory />} />
            <Route path="report" element={<Report />} />
            {/* Admin */}
            <Route path="overview" element={<Overview />} />
            <Route path="stations" element={<Stations />} />
            <Route path="batteries" element={<Batteries />} />
            <Route path="customers" element={<Customers />} />
            <Route path="staff" element={<Staff />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
