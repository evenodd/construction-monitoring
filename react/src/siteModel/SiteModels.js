import React from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Breadcrumb from 'react-bootstrap/Breadcrumb';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import {LinkContainer} from "react-router-bootstrap";


export default class SiteModel extends React.Component {
    render() {
        return (
            <Container id="siteModelContainer">
                <div className="breadcrumbHolder">
                <Breadcrumb>
                    <Breadcrumb.Item active href="/siteModels">SiteModels</Breadcrumb.Item>
                    
                </Breadcrumb>
                </div>
                
                <Row className="justify-content-md-center">
                        <LinkContainer to="/app/siteModels/add">
                            <Button>Add New Site</Button>
                        </LinkContainer>

                </Row>
            </Container>
        )
    }
}