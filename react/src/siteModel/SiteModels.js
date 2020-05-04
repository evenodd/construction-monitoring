import React from 'react';
import Row from 'react-bootstrap/Row';
import Button from 'react-bootstrap/Button';
import Spinner from 'react-bootstrap/Spinner';
import ListGroup from 'react-bootstrap/ListGroup';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import { LinkContainer } from "react-router-bootstrap";
import BreadcrumbsPage from '../BreadcrumbsPage';
import Axios from 'axios'

export default class SiteModels extends React.Component {

    constructor() {
        super();
        this.handleGetItemsResponse = this.handleGetItemsResponse.bind(this);
        this.handleGetItemsError = this.handleGetItemsError.bind(this);
        this.state = {
            loading: true,
            items: []
        };

        Axios.get('/api/siteModel').then(this.handleGetItemsResponse).catch(this.handleGetItemsError)
    }

    static Item = class {
        
        constructor(id, name) {
            this.name = name;
            this.id = id;
        }

        render() {
            const uri = `/app/siteModels/${this.id}/map`
            return (
                <LinkContainer to={uri}>
                    <ListGroup.Item 
                        md="12"
                        action
                    >
                        {this.name} 
                    </ListGroup.Item>
                </LinkContainer>
            );
        }
    }

    handleGetItemsError(response) {
        this.setState({
            loading: false
        });
        console.error(response);
    }

    handleGetItemsResponse(response) {
        this.setState({
            loading: false,
            items: response.data
        });
    }

    render() {
        let items;
        if (this.state.items != null) {
            items = this.state.items.map(item => new SiteModels.Item(item._id, item.name).render());
        }
        const content = (
            <Container className="h-100 d-flex flex-column justify-content-between">
                <Row className="justify-content-md-center">
                    <Col md="12" className="justify-content-md-center d-flex">
                        {(this.state.loading) ? <Spinner animation="border" role="status"><span className="sr-only">Loading...</span></Spinner> : ''}
                    </Col>
                </Row>
                <Row>
                    <Col md="12" className="">
                        <ListGroup>{items}</ListGroup>
                    </Col>
                </Row>
                <Row className="justify-content-md-center buttonFooter">
                    <LinkContainer to="/app/siteModels/add">
                        <Button>Add New Site</Button>
                    </LinkContainer>
                </Row>
            </Container>
        );
        return (
            <BreadcrumbsPage
                items={[
                    new BreadcrumbsPage.Item("Site Models", "/app/siteModels").asActive()
                ]}
                content={content}
            />
        );
    }
}

