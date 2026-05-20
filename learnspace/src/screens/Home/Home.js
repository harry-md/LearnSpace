import { useState, useEffect, useContext } from "react";
import { Card, Row, Col } from "react-bootstrap";
import { useNavigate, useSearchParams } from "react-router-dom";
import SkeletonLoading from "../../components/SkeletonLoading";
import Apis, { endpoints } from "../../configs/Apis";
import { CartContext } from "../../configs/Context";

const Home = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [q] = useSearchParams();
  const [, dispatchCourse] = useContext(CartContext);
  const nav = useNavigate();
  const [err, setErr] = useState("");

  const loadCourses = async () => {
    try {
      setLoading(true);

      let url = `${endpoints.courses}?page=${page}`;

      const cateId = q.get("categoryId");
      if (cateId) {
        url = `${url}&categoryId=${cateId}`;
      }

      const kw = q.get("kw");
      if (kw) {
        url = `${url}&kw=${kw}`;
      }

      let res = await Apis.get(`${endpoints.courses}?page=${page}`);

      if (res.data.length === 0) {
        setPage(0);
      }

      if (page === 1) {
        setProducts(res.data);
      } else {
        setProducts([...products, ...res.data]);
      }
    } catch (err) {
      console.error(err);
      setErr("Có lỗi xảy ra khi tải khóa học");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCourses();
  }, [page, q]);

  return (
    <div className="container mt-5">
      <h2 className="fw-bold mb-4" style={{ color: "#1c1d1f" }}>
        Khóa học nổi bật
      </h2>
      <Row>
        {loading ? (
          <SkeletonLoading items={4} lgSize={3} />
        ) : (
          Array.from({ length: 4 }).map((_, index) => (
            <Col key={index} xs={12} sm={6} md={4} lg={3} className="mb-4">
              <Card
                className="h-100 border-0 rounded-0"
                style={{ cursor: "pointer" }}
              >
                <div
                  style={{ height: "150px", backgroundColor: "#d1d7dc" }}
                  className="card-img-top border"
                ></div>
                <Card.Body className="px-0">
                  <Card.Title
                    className="fs-6 fw-bold mb-1"
                    style={{ color: "#1c1d1f" }}
                  >
                    Tên khóa học lập trình Web Udemy {index + 1}
                  </Card.Title>
                  <Card.Text className="small text-muted mb-1">
                    Harry MD
                  </Card.Text>
                  <div className="fw-bold" style={{ fontSize: "1.1rem" }}>
                    ₫ 499.000
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))
        )}
      </Row>
    </div>
  );
};

export default Home;
