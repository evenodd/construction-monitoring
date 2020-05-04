import React from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Spinner from 'react-bootstrap/Spinner';

export default function LoadingPage() {
    return (
        <Container className="h-100 d-flex flex-column justify-content-between">
            <Row className="justify-content-md-center">
                <Col md="12" className="justify-content-md-center d-flex loadingHolder">
                    <Spinner animation="border" role="status"><span className="sr-only">Loading...</span></Spinner>
                </Col>
            </Row>
        </Container>
    );

}