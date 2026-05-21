import "./App.css";
import { BrowserRouter, Route, Routes, Link } from "react-router-dom";
import Login from "./screens/User/Login";
import Register from "./screens/User/Register";
import LandingPage from "./screens/LandingPage/LandingPage";
import HomePage from "./screens/Home/HomePage";
import LearningPage from "./screens/Learning/LearningPage";
import CartPage from "./screens/Cart/CartPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/learning" element={<LearningPage />} />
        <Route path="/home/my-courses/learning" element={<LearningPage />} />
        <Route path="/cart" element={<CartPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
