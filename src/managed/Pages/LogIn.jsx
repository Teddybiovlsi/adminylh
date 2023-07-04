import React from "react";
import { Container } from "react-bootstrap";

export default function LogIn() {
  return (
    <Container>
      <h1>LogIn</h1>
      <Form>
        <Form.Group className="mb-3" controlId="formBasicEmail">
          <Form.Label>帳號</Form.Label>
          <Form.Control type="email" placeholder="Enter email" />
          <Form.Text className="text-muted">
            We'll never share your email with anyone else.
          </Form.Text>
        </Form.Group>
      </Form>
    </Container>
  );
}
