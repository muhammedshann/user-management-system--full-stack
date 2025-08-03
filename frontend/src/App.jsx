import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./components/Home";
import Profile from "./components/Profile";
import Signup from "./components/signup";
import Login from "./components/login";
import { useDispatch } from "react-redux";
import AdminUser from "./components/adminUsers";
import AdminRoute from "./components/adminRoute";
import UserRoute from "./components/userRoute";

function App(){

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home/>} />
        <Route path="/signup/" element={<Signup/>} />
        <Route path="/login/" element={<Login />} />
        <Route path="/Profile/" element={
          <UserRoute>
            <Profile />
          </UserRoute>
        }/>
        <Route path="/admin_users/" element={
          <AdminRoute>
            <AdminUser />
          </AdminRoute>
        } />
      </Routes>
    </BrowserRouter>
  )
}
export default App;