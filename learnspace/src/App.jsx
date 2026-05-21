import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Login from "./screens/User/Login";
import Register from "./screens/User/Register";
import HomePage from "./screens/Home/HomePage";
import LearningPage from "./screens/Learning/LearningPage";
import CartPage from "./screens/Cart/CartPage";
import ProfilePage from "./screens/Profile/ProfilePage";
import CourseDetailPage from "./screens/CourseDetail/CourseDetailPage";
import TeacherDashboard from "./screens/Teacher/TeacherDashboard";
import MainLayout from "./components/Layout/MainLayout";
import { UserContext } from "./configs/Context";
import { useReducer } from "react";
import UserReducer from "./reducers/UserReducer";
import cookies from "react-cookies";

function App() {
  const [user, dispatch] = useReducer(UserReducer, cookies.load("user") || null);
  return (
    <UserContext.Provider value={[user, dispatch]}>
      <BrowserRouter>
        <Routes>
          {/* Routes without shared Header/Footer */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/teacher/dashboard" element={<TeacherDashboard />} />

          {/* Routes with shared Header/Footer */}
          <Route element={<MainLayout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/learning" element={<LearningPage />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/course/:id" element={<CourseDetailPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </UserContext.Provider>
  );
}

export default App;
