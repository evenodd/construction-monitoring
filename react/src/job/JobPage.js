import React from 'react';
import Axios from 'axios';
import LoadingPage from '../LoadingPage';
import BreadcrumbsPage from '../BreadcrumbsPage';

import Container from 'react-bootstrap/Container';
import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';

import TimestampDateFormat from '../util/TimestampDateFormat';

export default class JobPage extends React.Component {
    constructor(props) {
        super(props);

        const {roomId, siteModelId, jobId} = this.props.match.params;

        this.roomId = roomId;
        this.siteModelId = siteModelId;
        this.jobId = jobId;

        this.state = {
            loading: true,
            room: null,
            siteModel: null,
            job: null,
        };

        const roomPromise = Axios.get(`/api/room/${roomId}`);
        const siteModelPromise = Axios.get(`/api/siteModel/${siteModelId}`);
        const jobPromise = Axios.get(`/api/job/${jobId}`);
        jobPromise.then(this.handleJobResponse);
        roomPromise.then(this.handleRoomResponse);
        siteModelPromise.then(this.handleSiteModelResponse);
        Promise.all([jobPromise, roomPromise, siteModelPromise]).then(this.handleAllPromisesResolved);
    }

    handleAllPromisesResolved = () => {
        this.setState({
            loading: false,
        })
    }

    getJob() {
        this.setState({
            loading: true,
        })
        const jobPromise = Axios.get(`/api/job/${this.jobId}`);
        jobPromise.then(this.handleJobResponse);
        Promise.all([jobPromise]).then(this.handleAllPromisesResolved);
    }

    handleJobResponse = (response) => {
        this.setState({
            job: response.data
        });
    }

    handleRoomResponse = (response) => {
        this.setState({
            room: response.data.rooms[0]
        });
    }

    handleSiteModelResponse = (response) => {
        this.setState({
            siteModel: response.data
        });
    }

    onTestClick = async () => {
        await Axios.put(`/api/job/test-analysis/${this.jobId}`);
        this.getJob();
    }

    render() {
        if(this.state.loading) {
            return (<LoadingPage/>);
        }

        const content = (
            <Container>
                <h3>Job: {this.state.job.name}</h3>
                <JobAnalysisTable analysis={this.state.job.analysis}/>
                <div><Button onClick={this.onTestClick}>Add Test Analysis</Button></div>
            </Container>
        );

        return (
            <BreadcrumbsPage
                items={[
                    new BreadcrumbsPage.Item('Site Models', '/app/siteModels'),
                    new BreadcrumbsPage.Item(this.state.siteModel.name, `/app/siteModels/${this.siteModelId}/map`),
                    new BreadcrumbsPage.Item(this.state.room.name, `/app/siteModels/${this.siteModelId}/room/${this.roomId}`),
                    new BreadcrumbsPage.Item(this.state.job.name, `/app/siteModels/${this.siteModelId}/room/${this.roomId}/job`).asActive()
                ]}
                content={content}
            />
        );

    }  
}


const JobAnalysisTable = (props) => {

    return (
        <>
        <h3>Analysis History</h3>
        <Table>
            <thead>
                <tr>
                    <th>Thumbnail</th>
                    <th>Prediction</th>
                    <th>Timestamp</th>
                </tr>
            </thead>
            <tbody>
            {
                props.analysis &&
                props.analysis.length 
                ? props.analysis.map((a) => (
                <tr>
                    <td>{a.thumbnail ? '[_]' : 'No thumbnail'}</td>
                    <td>{a.modelPrediction}</td>
                    <td>{TimestampDateFormat.Job(a.timestamp)}</td>
                </tr>    
                ))
                : null
            }
            </tbody>
        </Table>
        </>
    )
}