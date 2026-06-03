import { Col, Form } from "react-bootstrap";

const FloatField = ({
  id,
  label,
  type,
  value,
  onChange,
  disabled = false,
  error,
  lg = false,
  colSm = 12,
  colMd,
}) => {
  return (
    <Col sm={colSm} md={colMd} className="mb-3">
      <Form.Group
        className="floating-input-group position-relative"
        controlId={id}
      >
        <Form.Control
          size={lg ? "lg" : ""}
          type={type}
          className={`floating-input ${lg ? "form-control-lg" : ""}`}
          placeholder=" "
          value={value}
          onChange={onChange}
          disabled={disabled}
        />
        <Form.Label className="floating-label fw-normal">{label}</Form.Label>
        {error && (
          <Form.Control.Feedback type="invalid">{error}</Form.Control.Feedback>
        )}
      </Form.Group>
    </Col>
  );
};

export default FloatField;
