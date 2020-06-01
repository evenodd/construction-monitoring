import React from 'react';
import Row from 'react-bootstrap/Row';
import Button from 'react-bootstrap/Button';
import Spinner from 'react-bootstrap/Spinner';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import BreadcrumbsPage from '../BreadcrumbsPage';
import Axios from 'axios'
import LoadingPage from '../LoadingPage';
import Form from 'react-bootstrap/Form';
import Switch from "react-switch";

const WALL_CONSTRUCTION = 'WALL_CONSTRUCTION';
const WALL_PAINT = 'WALL_PAINT';
const WALL_DEFECT = 'WALL_DEFECT';

export default class MonitoringNodeConfigPage extends React.Component {


    constructor(props) {
        super(props);
        this.handleNodeConfigResponse = this.handleNodeConfigResponse.bind(this);
        this.handleCurrentRoomResponse = this.handleCurrentRoomResponse.bind(this);
        this.handleSiteModelsResponse = this.handleSiteModelsResponse.bind(this);
        this.handleRoomsResponse = this.handleRoomsResponse.bind(this);
        this.handleSiteModelSelectChange = this.handleSiteModelSelectChange.bind(this);
        this.handleRoomSelectChange = this.handleRoomSelectChange.bind(this);
        this.handleWallConstructionChanged = this.handleWallConstructionChanged.bind(this);
        this.handleWallPaintingChanged = this.handleWallPaintingChanged.bind(this);
        this.handleWallDefectChanged = this.handleWallDefectChanged.bind(this);
        this.onSubmitHandler = this.onSubmitHandler.bind(this);

        const {id} = this.props.match.params;

        this.state = {
            loading: true,
            nodeConfig: null,
            submitInProgress: false,
            siteModels: [],
            currentRoom: null,
            rooms: [],
            registeredRoom: null,
            wallConstructionEnabled: false,
            wallPaintingEnabled: false,
            wallDefectEnabled: false,
            submitInProgress: false
        }

        Axios.get('/api/siteModel').then(this.handleSiteModelsResponse);
        Axios.get(`/api/nodeConfig/${id}`).then(this.handleNodeConfigResponse);
    }

    handleNodeConfigResponse(response) {
        const loading = response.data.roomId != null;

        if (loading) {
            Axios.get(`/api/room/${response.data.roomId}`).then(this.handleCurrentRoomResponse);
        }
        this.setState({
            loading: loading,
            nodeConfig: response.data,
            registeredRoom: response.data.roomId,
            wallConstructionEnabled: response.data.analysisModels.includes(WALL_CONSTRUCTION),
            wallPaintingEnabled: response.data.analysisModels.includes(WALL_PAINT),
            wallDefectEnabled: response.data.analysisModels.includes(WALL_DEFECT),
        });
    }

    handleCurrentRoomResponse(response) {
        this.setState({
            currentRoom: response.data.rooms[0],
            loading: false
        });
    }

    handleSiteModelsResponse(response) {
        this.setState({
            siteModels: response.data
        });
    }

    handleRoomsResponse(response) {
        this.setState({
            rooms: response.data.rooms
        });
    }

    handleSiteModelSelectChange(event) {
        const id = event.target.value
        Axios.get(`/api/siteModel/${id}`).then(this.handleRoomsResponse);
    }

    handleRoomSelectChange(event) {
        this.setState({
            registeredRoom: event.target.value,
            currentRoom: null
        });
    }

    handleWallConstructionChanged(checked) {
        this.setState({
            wallConstructionEnabled: checked
        })
    }

    handleWallPaintingChanged(checked) {
        this.setState({
            wallPaintingEnabled: checked
        })
    }

    handleWallDefectChanged(checked) {
        this.setState({
            wallDefectEnabled: checked
        })
    }

    onSubmitHandler(event) {
        this.setState({
            submitInProgress: true
        });

        const analysisModels = [];

        if (this.state.wallConstructionEnabled) {
            analysisModels.push(WALL_CONSTRUCTION);
        }
        if (this.state.wallPaintingEnabled) {
            analysisModels.push(WALL_PAINT);
        }
        if (this.state.wallDefectEnabled) {
            analysisModels.push(WALL_DEFECT);
        }

        Axios.post(`/api/nodeConfig/${this.state.nodeConfig._id}`, {
            roomId: this.state.registeredRoom,
            analysisModels: analysisModels
        })
        .then((res) => {
            this.setState({
                submitInProgress: false
            });
        });

    }


    render() {
        if(this.state.loading) {
            return (<LoadingPage/>);
        }

        const siteModelOptions = this.state.siteModels.map(siteModel => {
            return (
                <option value={siteModel._id}>{siteModel.name}</option>
            )
        });

        const roomOptions = this.state.rooms.map(room => {
            return (
                <option value={room._id}>{room.name}</option>
            );
        })
        let currentRoomOption = null;
        if (this.state.currentRoom != null) {
            currentRoomOption = (<option value={this.state.currentRoom._id} selected>{this.state.currentRoom.name}</option>)
        }

        const content = (
            <Container className="nodeConfigs">
            <Row>
                <Col md="12">
                    <Form.Group controlId="nodeConfigForm.SiteModelSelect">
                        <Form.Label>Registered site model</Form.Label>
                        <Form.Control 
                            as="select" 
                            onChange={this.handleSiteModelSelectChange}
                        >
                            <option value="" disabled selected>Select a Site Model</option>
                            {siteModelOptions}
                        </Form.Control>
                    </Form.Group>
                </Col>
            </Row>
            <Row>
                <Col md="12">
                    <Form.Group controlId="nodeConfigForm.SiteModelSelect">
                        <Form.Label>Registered room</Form.Label>
                        <Form.Control 
                            as="select"
                            onChange={this.handleRoomSelectChange}
                            registeredRoom={this.state.registeredRoom}
                        >
                            <option value="" disabled selected>Select a Room</option>
                            {currentRoomOption}
                            {roomOptions}
                        </Form.Control>
                    </Form.Group>
                </Col>
            </Row>
            <div className="analysisSwitchHolder">
                <Row>
                    <Col md="12">
                        <label>
                            <span>Wall Construction Model</span>
                            <div className="switchHolder"><Switch onChange={this.handleWallConstructionChanged} checked={this.state.wallConstructionEnabled}/></div>
                        </label>
                    </Col>
                </Row>
                <Row>
                    <Col md="12">
                        <label>
                            <span>Wall Painting Model</span>
                            <div className="switchHolder"><Switch onChange={this.handleWallPaintingChanged} checked={this.state.wallPaintingEnabled}/></div>
                        </label> 
                    </Col>
                </Row>
                <Row>
                    <Col md="12">
                        <label>
                            <span>Wall Defect Model</span>
                            <div className="switchHolder"><Switch onChange={this.handleWallDefectChanged} checked={this.state.wallDefectEnabled}/></div>
                        </label> 

                    </Col>
                </Row>
            </div>
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
                    new BreadcrumbsPage.Item("Monitoring Nodes", "/app/monitoringNodes"),
                    new BreadcrumbsPage.Item(`${this.state.nodeConfig.deviceName} - ${this.state.nodeConfig.deviceId}`, "/app/monitoringNodes").asActive()
                ]}
                content={content}
            />
        );

    }
}
