import React from 'react';
import Axios from 'axios';
import LoadingPage from '../LoadingPage';
import BreadcrumbsPage from '../BreadcrumbsPage';

import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import {Redirect} from "react-router-dom";
import FormControl from 'react-bootstrap/FormControl';
import Spinner from 'react-bootstrap/Spinner';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';

export default class JobAdd extends React.Component {
    constructor(props) {
        super(props);
        this.handleRoomResponse = this.handleRoomResponse.bind(this);
        this.handleSiteModelResponse = this.handleSiteModelResponse.bind(this);
        this.handleAllPromisesResolved = this.handleAllPromisesResolved.bind(this);
        this.onNameInputChangeHandler = this.onNameInputChangeHandler.bind(this);
        this.onDescriptionInputChangeHandler = this.onDescriptionInputChangeHandler.bind(this);
        this.onSubmitHandler = this.onSubmitHandler.bind(this);
        this.handleJobSubmitResponse = this.handleJobSubmitResponse.bind(this);

        const {roomId, siteModelId} = this.props.match.params;
        this.roomId = roomId;
        this.siteModelId = siteModelId;
        this.state = {
            loading: true,
            room: null,
            siteModel: null,
            inputName: '',
            inputDescription: '',
            submitInProgress: false,
            redirectBackToRoomPage: false
        };
        const roomPromise = Axios.get(`/api/room/${roomId}`);
        const siteModelPromise = Axios.get(`/api/siteModel/${siteModelId}`);
        roomPromise.then(this.handleRoomResponse);
        siteModelPromise.then(this.handleSiteModelResponse);
        Promise.all([roomPromise, siteModelPromise]).then(this.handleAllPromisesResolved);

    }

    handleAllPromisesResolved() {
        this.setState({
            loading: false
        })
    }

    handleRoomResponse(response) {
        this.setState({
            room: response.data.rooms[0]
        });
    }

    handleSiteModelResponse(response) {
        this.setState({
            siteModel: response.data
        });
    }

    onNameInputChangeHandler(event) {
        this.setState({
            inputName: event.target.value
        });
    }

    onDescriptionInputChangeHandler(event) {
        this.setState({
            inputDescription: event.target.value
        });
    }

    onSubmitHandler(event) {
        const formData = new FormData();
        formData.append('name', this.state.inputName);
        formData.append('description', this.state.inputDescription);
        formData.append('siteModelId', this.siteModelId);
        formData.append('roomId', this.roomId);
        this.setState({
            submitInProgress: true
        });
        Axios.put(`/api/job/`, formData).then(this.handleJobSubmitResponse);
    }

    handleJobSubmitResponse(response) {
        this.setState({
            redirectBackToRoomPage: true
        });

    }


    render() {
        if (this.state.loading) {
            return (<LoadingPage/>);
        }
        if (this.state.redirectBackToRoomPage) {
            return <Redirect to={`/app/siteModels/${this.siteModelId}/room/${this.roomId}`}/>
        }
        
        const content = (
            <Container>
                <Row>
                    <Col md="4">
                        <label id="jobNameLabel">Name</label>
                    </Col>
                    <Col md="8">
                        <FormControl
                            onChange={this.onNameInputChangeHandler}
                            placeholder="My Job"
                            aria-label="Room name"
                            aria-describedby="jobNameLabel" />
                    </Col>
                </Row>
                <Row>
                    <Col md="4">
                        <label id="jobDescLabel">Description</label>
                    </Col>
                    <Col md="8">
                        <FormControl
                            onChange={this.onDescriptionInputChangeHandler}
                            as="textarea"
                            aria-label="Room name"
                            aria-describedby="jobDescLabel" />
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
                    new BreadcrumbsPage.Item("Site Models", "/app/siteModels"),
                    new BreadcrumbsPage.Item(this.state.siteModel.name, `/app/siteModels/${this.siteModelId}/map`),
                    new BreadcrumbsPage.Item(this.state.room.name, `/app/siteModels/${this.siteModelId}/room/${this.roomId}`),
                    new BreadcrumbsPage.Item('Add job', `/app/siteModels/${this.siteModelId}/room/${this.roomId}/addJob`).asActive()
                ]}
                content={content}
            />
        );
    }
}