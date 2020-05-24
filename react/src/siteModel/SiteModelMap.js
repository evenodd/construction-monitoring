import React from 'react';
import Row from 'react-bootstrap/Row';
import Button from 'react-bootstrap/Button';
import ListGroup from 'react-bootstrap/ListGroup';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import { LinkContainer } from "react-router-bootstrap";
import BreadcrumbsPage from '../BreadcrumbsPage';
import Axios from 'axios';
import LoadingPage from '../LoadingPage';
import IMap from '../components/iMap/iMap';

function RoomItem(props) {
    return (
        <LinkContainer to={`/app/siteModels/${props.siteModelId}/room/${props.id}`}>
            <ListGroup.Item md="12" action >
                {props.name} 
            </ListGroup.Item>
        </LinkContainer>
    );
}

export default class SiteModelMap extends React.Component {
    
    constructor(props) {
        super(props);
        this.handleModelResponse = this.handleModelResponse.bind(this);
        const {id} = this.props.match.params;
        this.id = id;
        this.state = {
            loading: true,
            model: null,
        };
        Axios.get(`/api/siteModel/${id}`).then(this.handleModelResponse);
    }

    handleModelResponse(response) {
        this.setState({
            model: response.data,
            loading: false
        });
    }
    
    render() {
        if (this.state.loading) {
            return (<LoadingPage/>);
        }
        const imageSrc = `/api/siteModel/${this.id}/image`;
        let rooms = [];
        if (this.state.model.rooms) {
            rooms = this.state.model.rooms.map((room) => {
                return (
                    <RoomItem 
                        id={room._id} 
                        siteModelId={this.id}
                        name={room.name}/>
                );
            });
        }
        
        const content = (
            <Container>
                <Row>
                    <Col md=" 12" className="d-flex justify-content-center">
                        <IMap siteModelId={this.id} 
                            rooms={this.state.model.rooms}
                            data={imageSrc}></IMap>
                    </Col>
                </Row>

                <Row>
                    <Col md="12" className="">
                        <ListGroup>{rooms}</ListGroup>
                    </Col>
                </Row>


                <Row className="justify-content-md-center buttonFooter">
                    <LinkContainer to={`/app/siteModels/${this.id}/addRoom`}>
                        <Button>Add room</Button>
                    </LinkContainer>
                </Row>

            </Container>
        );

        return (
            <BreadcrumbsPage
                items={[
                    new BreadcrumbsPage.Item("Site Models", "/app/siteModels"),
                    new BreadcrumbsPage.Item(this.state.model.name, `/app/siteModels/${this.id}/map`).asActive()
                ]}
                content={content}
            />
        );
        
    }
}
