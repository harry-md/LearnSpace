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
import { UserContext, UIContext, CartContext, ChatContext } from "./configs/Context";
import { useReducer } from "react";
import UserReducer from "./reducers/UserReducer";
import UIReducer, { initialUIState } from "./reducers/UIReducer";
import CartReducer from "./reducers/CartReducer";
import ChatReducer, { initialChatState } from "./reducers/ChatReducer";
import cookies from "react-cookies";
import ProtectedRoute from "./components/ProtectedRoute/ProtectedRoute";
import GlobalLoading from "./components/GlobalLoading/GlobalLoading";
import GlobalDialog from "./components/GlobalDialog/GlobalDialog";
import GlobalChatContainer from "./components/GlobalChat/GlobalChatContainer";
import SearchResult from "./screens/SearchResult/SearchResult";
import PaymentSuccessPage from "./screens/Payment/PaymentSuccessPage";

function App() {
  const [user, dispatch] = useReducer(
    UserReducer,
    cookies.load("user") || null,
  );
  const [uiState, uiDispatch] = useReducer(UIReducer, initialUIState);
  const [cart, cartDispatch] = useReducer(CartReducer, {
    carts: cookies.load("carts") || [],
  });
  const [chatState, chatDispatch] = useReducer(ChatReducer, initialChatState);

  return (
    <ChatContext.Provider value={[chatState, chatDispatch]}>
      <UIContext.Provider value={[uiState, uiDispatch]}>
        <UserContext.Provider value={[user, dispatch]}>
          <CartContext.Provider value={[cart, cartDispatch]}>
          <GlobalLoading show={uiState.loading} />
          <GlobalDialog
            show={uiState.dialog.show}
            title={uiState.dialog.title}
            message={uiState.dialog.message}
            type={uiState.dialog.type}
            onConfirm={uiState.dialog.onConfirm}
            onClose={() => uiDispatch({ type: "HIDE_DIALOG" })}
          />
          <GlobalChatContainer />
          <BrowserRouter>
            <Routes>
              {/* Routes without shared Header/Footer */}

              {/* Protected Teacher Route */}
              <Route
                path="/teacher"
                element={
                  <ProtectedRoute
                    allowedRoles={["TEACHER", "VERIFIED_TEACHER"]}
                  >
                    <TeacherDashboard />
                  </ProtectedRoute>
                }
              />

              {/* Routes with shared Header/Footer */}
              <Route element={<MainLayout />}>
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/" element={<HomePage />} />
                <Route
                  path="/learning"
                  element={
                    <ProtectedRoute
                      allowedRoles={[
                        "STUDENT",
                        "TEACHER",
                        "VERIFIED_TEACHER",
                        "ADMIN",
                      ]}
                    >
                      <LearningPage />
                    </ProtectedRoute>
                  }
                />
                <Route path="/cart" element={<CartPage />} />
                <Route
                  path="/payment/success"
                  element={<PaymentSuccessPage />}
                />
                <Route path="/profile" element={<ProfilePage />} />
                <Route path="/course/:id" element={<CourseDetailPage />} />
                <Route path="/courses" element={<SearchResult />} />
              </Route>
            </Routes>
          </BrowserRouter>
        </CartContext.Provider>
      </UserContext.Provider>
    </UIContext.Provider>
    </ChatContext.Provider>
  );
}

export default App;
