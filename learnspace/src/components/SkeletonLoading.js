import { Placeholder, Card, Col } from "react-bootstrap";

const CourseSkeleton = ({ items = 4, lgSize = 3, mdSize = 4, smSize = 6 }) => {
  return (
    <>
      {Array.from({ length: items }).map((_, index) => (
        <Col
          key={index}
          xs={12}
          sm={smSize}
          md={mdSize}
          lg={lgSize}
          className="mb-4"
        >
          <Card className="h-100 border-0 rounded-0">
            <Placeholder
              as={Card.Img}
              variant="top"
              style={{ height: "150px", backgroundColor: "#e9ecef" }}
              animation="glow"
            />
            <Card.Body className="px-0">
              <Placeholder as={Card.Title} animation="glow">
                <Placeholder xs={12} />
                <Placeholder xs={8} />
              </Placeholder>
              <Placeholder as={Card.Text} animation="glow">
                <Placeholder xs={6} className="mb-2" /> <br />
                <Placeholder xs={4} /> <Placeholder xs={3} />
              </Placeholder>
            </Card.Body>
          </Card>
        </Col>
      ))}
    </>
  );
};

export default CourseSkeleton;
