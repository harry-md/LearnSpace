import { useContext, useState } from "react";
import RegisterImg from "../../assets/desktop-illustration-step-2-x2.webp";
import "./Style.css";
import { Button, Col, Form, Placeholder } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import Apis, { endpoints, authApis } from "../../configs/Apis";
import { UserContext } from "@/configs/Context";
import FloatField from "../../components/User/FloatField";

const Login = () => {
  const [user, setUser] = useState({ username: "", password: "" });
  const [error, setError] = useState();
  const [loading, setLoading] = useState(false);

  const [, dispatchUser] = useContext(UserContext);

  const nav = useNavigate();

  const userInfo = [
    { field: "username", title: "Tên đăng nhập", type: "text" },
    { field: "password", title: "Mật khẩu", type: "password" },
  ];

  const validateData = () => {
    for (let u of userInfo) {
      if (!user[u.field] || user[u.field].trim() === "") {
        setError(`Vui lòng nhập ${u.title}`);
        return false;
      }
    }
    setError(null);
    return true;
  };

  const login = async (e) => {
    e.preventDefault();
    if (validateData() === true) {
      try {
        setLoading(true);
        let res = await Apis.post(endpoints.login, user);

        if (res.status === 200) {
          const token = res.data.token;
          const u = await currentUser(token);
          dispatchUser({ type: "LOGIN", payload: { ...u, token: token } });
          nav("/");
        }
      } catch (err) {
        if (err.response && err.response.data && err.response.data.message) {
          setError(err.response.data.message);
        } else {
          setError(err.message || "Đã có lỗi xảy ra, vui lòng thử lại sau.");
        }
      } finally {
        setLoading(false);
      }
    }
  };
  const currentUser = async (token) => {
    try {
      const res = await authApis(token).get(endpoints.currentUser);
      return res.data;
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="full-page-wrapper d-flex justify-content-center align-items-center">
      <div
        className="registration-page-container d-flex"
        style={{ width: "70%" }}
      >
        <Col
          xs={12}
          md={7}
          className="left-side-container d-none d-md-flex justify-content-center align-items-center p-4"
        >
          <img
            src={RegisterImg}
            alt="Login image"
            className="img-fluid"
            style={{ width: "100" }}
          />
        </Col>

        <Col
          xs={12}
          md={5}
          className="form-column d-flex flex-column p-5 justify-content-center bg-white"
        >
          <div className="registration-form-content">
            <h2
              className="fw-bold mb-1"
              style={{ color: "#000", fontSize: "3rem" }}
            >
              Đăng nhập
            </h2>

            {error && (
              <div
                className="d-flex align-items-center mb-4"
                style={{
                  backgroundColor: "#fceceb",
                  padding: "16px",
                  borderRadius: "4px",
                }}
              >
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#b40d23"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="me-3 flex-shrink-0"
                >
                  <circle cx="12" cy="12" r="10"></circle>
                  <line x1="12" y1="8" x2="12" y2="12"></line>
                  <line x1="12" y1="16" x2="12.01" y2="16"></line>
                </svg>
                <span
                  style={{
                    color: "#1c1d1f",
                    fontWeight: "700",
                    fontSize: "0.95rem",
                  }}
                >
                  {error}
                </span>
              </div>
            )}

            <Form onSubmit={login}>
              {userInfo.map((u) => (
                <FloatField
                  lg
                  key={u.field}
                  id={u.field}
                  label={u.title}
                  type={u.type}
                  value={user[u.field] || ""}
                  onChange={(e) =>
                    setUser({ ...user, [u.field]: e.target.value })
                  }
                  disabled={loading}
                />
              ))}

              <Form.Group className="mb-3 mt-4" controlId="button">
                {loading ? (
                  <Placeholder.Button
                    xs={12}
                    size="lg"
                    animation="glow"
                    className="w-100 fw-bold border-0"
                    style={{
                      backgroundColor: "#5624d0",
                      opacity: 0.7,
                      borderRadius: "0px",
                      height: "3rem",
                    }}
                  />
                ) : (
                  <Button
                    type="submit"
                    size="lg"
                    className="w-100 fw-bold border-0 text-white"
                    style={{
                      backgroundColor: "#5624d0",
                      fontSize: "1.2rem",
                    }}
                  >
                    Đăng nhập
                  </Button>
                )}
              </Form.Group>
            </Form>

            <hr className="my-4" />

            <div className="text-center" style={{ fontSize: "1.1rem" }}>
              Bạn chưa có tài khoản?{" "}
              <Link
                to="/register"
                className="text-decoration-none fw-bold text-decoration-underline"
                style={{ color: "#5624d0" }}
              >
                Đăng ký
              </Link>
            </div>
          </div>
        </Col>
      </div>
    </div>
  );
};
export default Login;
