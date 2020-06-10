import React from 'react';
import Axios from 'axios';
import LoadingPage from '../LoadingPage';
import BreadcrumbsPage from '../BreadcrumbsPage';

import Row from 'react-bootstrap/Row';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Table from 'react-bootstrap/Table';
import JobTableRow from './JobTableRow'

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
            analysisPending: true
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
            analysisPending: response.data
        });
    }

    render() {
        if(this.state.loading) {
            return (<LoadingPage/>);
        }

        let jobs = [];

        if (this.state.room.jobs) {
            jobs = this.state.room.jobs.map(job => (<JobTableRow job={job}/>));
        }

        const analysisButtonProps = {
            onClick: this.handleStartAnalysis
        };

        if (this.state.analysisPending) {
            analysisButtonProps.disabled = true;
        }

        const content= (
            <Container>
                <Row>
                    <h3>Jobs</h3>
                </Row>

                <Row className="justify-content-md-center buttonFooter">
                    <Table striped bordered hover>
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Description</th>
                                <th>Completed</th>
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