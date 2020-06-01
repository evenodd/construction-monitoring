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

export default class MonitoringNodesPage extends React.Component {

    constructor() {
        super();
        this.handleSearchResponse = this.handleSearchResponse.bind(this);

        this.state = {
            loading: true,
            monitoringNodes: []
        }

        Axios.get('/api/nodeConfig/search').then(this.handleSearchResponse);
    }

    static Item = class {
        
        constructor(id, deviceId, deviceName) {
            this.id = id;
            this.deviceId = deviceId;
            this.deviceName = deviceName;
        }

        render() {
            const uri = `/app/monitoringNodes/${this.id}`
            return (
                <LinkContainer to={uri}>
                    <ListGroup.Item 
                        md="12"
                        action
                    >
                        {this.deviceName} - {this.deviceId} 
                    </ListGroup.Item>
                </LinkContainer>
            );
        }
    }

    handleSearchResponse(response) {
        this.setState({
            loading: false,
            monitoringNodes: response.data
        });
    }

    render() {
        const items = this.state.monitoringNodes.map(node => new MonitoringNodesPage.Item(node._id, node.deviceId, node.deviceName).render())
        
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

            </Container>
        );
        return (
            <BreadcrumbsPage
                items={[
                    new BreadcrumbsPage.Item("Monitoring Nodes", "/app/monitoringNodes").asActive()
                ]}
                content={content}
            />
        );

    }
}
