import { useRef, useState } from "react";
import RegisterImg from "../../assets/desktop-illustration-step-2-x2.webp";
import "./Style.css";
import { Button, Col, Form, Placeholder, Row } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import Apis, { endpoints } from "../../configs/Apis";
import FloatField from '../../components/User/FloatField'

const Register = () => {
  const [user, setUser] = useState({});
  const [error, setError] = useState();
  const [loading, setLoading] = useState(false);
  const avatar = useRef();
  const nav = useNavigate();

  const userInfo = [
    { field: "fullName", title: "Họ và tên", type: "text" },
    { field: "username", title: "Tên đăng nhập", type: "text" },
    { field: "email", title: "Email", type: "email" },
    { field: "password", title: "Mật khẩu", type: "password" },
    { field: "confirm", title: "Xác nhận mật khẩu", type: "password" },
  ];

  const validateData = () => {
    for (let u of userInfo) {
      if (!user[u.field] || user[u.field].trim() === "") {
        setError(`Vui lòng điền đủ ${u.title}`);
        return false;
      }

      if (u.field === "fullName") {
        const nameRegex = /^[\p{L}\s]+$/u;
        if (!nameRegex.test(user[u.field])) {
          setError(`${u.title} không được chứa ký tự đặc biệt`);
          return false;
        }
      }

      if (u.field === "username") {
        const usernameRegex = /^[A-Za-z0-9]+$/;
        if (!usernameRegex.test(user[u.field])) {
          setError(`${u.title} không được chứa ký tự đặc biệt`);
          return false;
        }
      }

      if (u.field === "email") {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(user[u.field])) {
          setError("Email không hợp lệ");
          return false;
        }
      }
    }

    if (user.password !== user.confirm) {
      setError("Mật khẩu và xác nhận mật khẩu phải khớp nhau");
      return false;
    }

    setError(null);
    return true;
  };

  const register = async (e) => {
    e.preventDefault();
    if (validateData() === true) {
      let form = new FormData();

      const { confirm, ...registerData } = user;

      const jsonBlob = new Blob([JSON.stringify(registerData)], {
        type: "application/json",
      });

      form.append("data", jsonBlob);

      if (avatar.current.files.length > 0) {
        form.append("avatar", avatar.current.files[0]);
      }

      try {
        setLoading(true);
        let res = await Apis.post(endpoints.register, form, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });

        if (res.status === 201) {
          nav("/login");
        }
      } catch (err) {
        console.error(err);
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
            alt="Register image"
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
              style={{ fontSize: "2rem" }}
            >
              Đăng ký tài khoản
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

            <Form onSubmit={register}>
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

              <Form.Group className="mb-4" controlId="avatar">
                <Form.Label
                  className="fw-bold small"
                  style={{ color: "#1c1d1f" }}
                  disabled={loading}
                >
                  Ảnh đại diện
                </Form.Label>
                <Form.Control
                  size="lg"
                  type="file"
                  ref={avatar}
                  style={{
                    fontSize: "1rem",
                  }}
                />
              </Form.Group>

              <Form.Group className="mb-3" controlId="button">
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
                    Đăng ký
                  </Button>
                )}
              </Form.Group>
            </Form>

            <hr className="my-4" />

            <div className="text-center" style={{ fontSize: "1.1rem" }}>
              Bạn đã có tài khoản?{" "}
              <Link
                to="/login"
                className="text-decoration-none fw-bold text-decoration-underline"
                style={{ color: "#5624d0" }}
              >
                Đăng nhập
              </Link>
            </div>
          </div>
        </Col>
      </div>
    </div>
  );
};
export default Register;
