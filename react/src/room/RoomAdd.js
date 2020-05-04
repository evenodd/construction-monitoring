import React from 'react';
import Axios from 'axios';
import BreadcrumbsPage from '../BreadcrumbsPage';
import LoadingPage from '../LoadingPage';
import {Redirect} from "react-router-dom";
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import FormControl from 'react-bootstrap/FormControl';
import Button from 'react-bootstrap/Button';
import Spinner from 'react-bootstrap/Spinner';



export default class RoomAdd extends React.Component {

    constructor(props) {
        super(props);
        this.handleSiteModelResponse = this.handleSiteModelResponse.bind(this);
        this.onNameInputChangeHandler = this.onNameInputChangeHandler.bind(this);
        this.onSubmitHandler = this.onSubmitHandler.bind(this);
        this.handleRoomSubmitResponse = this.handleRoomSubmitResponse.bind(this);
        
        const {siteModelId} = this.props.match.params;
        this.siteModelId = siteModelId;
        this.state = {
            loading: true,
            submitInProgress: false,
            siteModel: null,
            inputName: '',
            redirectToSiteModelMap: false
        };

        Axios.get(`/api/siteModel/${siteModelId}`).then(this.handleSiteModelResponse);

    }

    handleSiteModelResponse(response) {
        this.setState({
            siteModel: response.data,
            loading: false
        });
    }

    onNameInputChangeHandler(event) {
        this.setState({
            inputName: event.target.value
        })
    }

    onSubmitHandler(event) {
        const formData = new FormData();
        formData.append('name', this.state.inputName);
        formData.append('siteModelId', this.siteModelId);
        this.setState({
            submitInProgress: true
        });
        Axios.put(`/api/room/`, formData).then(this.handleRoomSubmitResponse);
    }

    handleRoomSubmitResponse(response) {
        this.setState({
            redirectToSiteModelMap: true
        });
    }

    render() {
        if (this.state.loading) {
            return (<LoadingPage/>);
        }

        if (this.state.redirectToSiteModelMap) {
            return (<Redirect to={`/app/siteModels/${this.siteModelId}/map`}/>);
        }

        const content = (
            <Container>
                <Row>
                    <Col md="4">
                        <label id="roomNameLabel">Room name</label>
                    </Col>
                    <Col md="8">
                        <FormControl
                            onChange={this.onNameInputChangeHandler}
                            placeholder="My room"
                            aria-label="Room name"
                            aria-describedby="roomNameLabel"
                        />
                    </Col>
                </Row>
                <Row className="justify-content-md-end buttonFooter">
                    {
                        (this.state.submitInProgress) ? <Spinner animation="border" role="status"><span className="sr-only">Loading...</span></Spinner> : null
                    }
                    <Button onClick={this.onSubmitHandler} disabled={this.state.submitInProgress}>Submit</Button>
                </Row>
            </Container>
        );

        return (
            <BreadcrumbsPage
                items={[
                    new BreadcrumbsPage.Item('Site Models', '/app/siteModels'),
                    new BreadcrumbsPage.Item(this.state.siteModel.name, `/app/siteModels/${this.siteModelId}/map`),
                    new BreadcrumbsPage.Item('Add room', window.location.pathname).asActive()
                ]}
                content={content}
            />

        )
    }
}