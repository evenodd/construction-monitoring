import React from 'react';
import Axios from 'axios';
import LoadingPage from '../LoadingPage';
import BreadcrumbsPage from '../BreadcrumbsPage';

import Row from 'react-bootstrap/Row';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Table from 'react-bootstrap/Table';
import Modal from 'react-bootstrap/Modal';
import ListGroup from 'react-bootstrap/ListGroup';
import JobTableRow from './JobTableRow'

import TimestampDateFormat from '../util/TimestampDateFormat';
import JobUtil from '../util/JobUtil';

export default class RoomPage extends React.Component {
    constructor(props) {
        super(props);
        this.handleRoomResponse = this.handleRoomResponse.bind(this);
        this.handleSiteModelResponse = this.handleSiteModelResponse.bind(this);
        this.handleAllPromisesResolved = this.handleAllPromisesResolved.bind(this);
        this.handleStartAnalysis = this.handleStartAnalysis.bind(this);
        this.handlePendingAnalysisResponse = this.handlePendingAnalysisResponse.bind(this);

        const {siteModelId, id} = this.props.match.params;
        this.id = id;
        this.siteModelId = siteModelId;
        this.state = {
            loading: true,
            room: null,
            siteModel: null,
            analysisPending: true,
            siteModal: false,
        }
        const roomPromise = Axios.get(`/api/room/${id}`);
        const siteModelPromise = Axios.get(`/api/siteModel/${siteModelId}`);
        const pendingAnalysisPromise = Axios.get(`/api/analysisQueue/pending/${id}`);
        roomPromise.then(this.handleRoomResponse);
        siteModelPromise.then(this.handleSiteModelResponse);
        pendingAnalysisPromise.then(this.handlePendingAnalysisResponse);
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

    handleStartAnalysis(response) {
        Axios.post('/api/analysisQueue', {
            roomId: this.state.room._id
        });
    }

    handlePendingAnalysisResponse(response) {
        this.setState({
            analysisPending: response.data.pendingAnalysis
        });
    }

    handleOpenModal = (image) => {
        this.setState({
            showModal: true,
        })
    }

    handleCloseModal = (image) => {
        this.setState({
            showModal: false,
        })
    }

    render() {
        if(this.state.loading) {
            return (<LoadingPage/>);
        }

        let jobs = [];

        if (this.state.room.jobs) {
            jobs = this.state.room.jobs.map(job => (
                <JobTableRow
                    onThumbClick={this.handleOpenModal}
                    jobURL={`/app/siteModels/${this.state.siteModel._id}/room/${this.state.room._id}/job/${job._id}`}
                    job={job}
                />
            ));
        }

        const analysisButtonProps = {
            onClick: this.handleStartAnalysis
        };

        if (this.state.analysisPending) {
            analysisButtonProps.disabled = true;
            analysisButtonProps.alt = "Analysis already pending..."
        }

        const content = (
            <Container>
                <Row>
                    <h3>Overview</h3>
                </Row>
                
                <Row>
                    <RoomOverview room={this.state.room}/>
                </Row>

                <Row>
                    <h3>Jobs</h3>
                </Row>

                <Row>
                    <Table striped bordered hover>
                        <thead>
                            <tr>
                                <th>Preview</th>
                                <th>Name</th>
                                <th>Type</th>
                                <th>Description</th>
                                <th>Completed</th>
                                <th>Start Date</th>
                                <th>Complete Date</th>
                                <th>History</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {jobs}
                        </tbody>
                    </Table>
                </Row>
                <Row className="justify-content-md-center buttonFooter">
                        <Button { ...analysisButtonProps } >Start Analysis</Button>
                </Row>
                <ImageModal show={this.state.showModal} onHide={this.handleCloseModal}/>
            </Container>
        );
        return (
            <BreadcrumbsPage
                items={[
                    new BreadcrumbsPage.Item("Site Models", "/app/siteModels"),
                    new BreadcrumbsPage.Item(this.state.siteModel.name, `/app/siteModels/${this.siteModelId}/map`),
                    new BreadcrumbsPage.Item(this.state.room.name, window.location.pathname).asActive(),
                ]}
                content={content}
            />
        );
    }

}

const RoomOverview = (props) => {

    return (
        <ListGroup horizontal style={{textAlign: 'center'}}>
            <ListGroup.Item>
                <h2 style={{marginBottom: 0}}>{JobUtil.calculateCompletedJobs(props.room.jobs)}%</h2> 
                <small>Complete</small>
            </ListGroup.Item>
            <ListGroup.Item>
                <h2 style={{marginBottom: 0}}>26</h2> 
                <small>Defects</small>
            </ListGroup.Item>
            <ListGroup.Item>
                {
                    props.room.nodeId
                    ? <h2 style={{marginBottom: 0}}>{props.room.nodeId}</h2> 
                    : <small style={{display: 'block'}}>No node configured</small>
                }
                <small>Monitoring Node ID</small>
            </ListGroup.Item>
            <ListGroup.Item>
                {
                    props.room.lastAnalysedTimestamp
                    ? <h2>{TimestampDateFormat.RoomOverview(props.room.lastAnalysedTimestamp)}</h2>
                    : <small style={{display: 'block'}}>Not analysed</small>
                }
                <small>Last updated</small>
            </ListGroup.Item>
            <ListGroup.Item><Button>Update Room Analysis</Button></ListGroup.Item>
        </ListGroup>
    )
}

const ImageModal = (props) => {
    return (
        <Modal show={props.show} onHide={props.onHide}>
            <Modal.Header closeButton>
                <Modal.Title>Modal heading</Modal.Title>
            </Modal.Header>
            <Modal.Body>Woohoo, you're reading this text in a modal!</Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={props.onHide}>
                    Close
                </Button>
                <Button variant="primary" onClick={props.onHide}>
                    Save Changes
                </Button>
            </Modal.Footer>
        </Modal>
    )
}