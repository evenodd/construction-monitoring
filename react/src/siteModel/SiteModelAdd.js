import React from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import FormControl from 'react-bootstrap/FormControl';
import Button from 'react-bootstrap/Button';
import Jumbotron from 'react-bootstrap/Jumbotron';
import Spinner from 'react-bootstrap/Spinner';
import Dropzone from 'react-dropzone';
import Axios from 'axios';
import BreadcrumbsPage from '../BreadcrumbsPage';

export default class SiteModelAdd extends React.Component {

    constructor(props) {
        super(props);
        this.onDropHandler = this.onDropHandler.bind(this);
        this.onSubmitHandler = this.onSubmitHandler.bind(this);
        this.onNameInputChangeHandler = this.onNameInputChangeHandler.bind(this);
        this.state = {
            uploadedFile: null,
            inputName: '',
            loading: false
        };
    }


    onDropHandler(acceptedFiles) {
        this.setState({
            uploadedFile: acceptedFiles[0]
        });
    }

    onSubmitHandler(event) {
        var formData = new FormData();
        formData.append('file', this.state.uploadedFile);
        formData.append('name', this.state.inputName);
        this.setState({
            loading: true
        });
        Axios.put('/api/siteModel', formData)
            .then((res) => {
                this.setState({
                    loading: false
                });
            });
    }

    onNameInputChangeHandler(event) {
        this.setState({
            inputName: event.target.value
        });
    }


    render() {
        var currentFileElement = (<div />)
        if (this.state.uploadedFile != null) {
            currentFileElement = (
                <Jumbotron fluid>
                    <Container>
                        <p>
                            Currently uploaded file: <b>{this.state.uploadedFile.name}</b>
                        </p>
                    </Container>
                </Jumbotron>
            );
        }

        const content = (
            <Container>
                <Row className="justify-content-md-center">
                    <Col md="4" className="labelHolder">
                        <label id="siteModelNameLabel">Site Model Name</label>
                    </Col>
                    <Col md="8">
                        <FormControl
                            onChange={this.onNameInputChangeHandler}
                            placeholder="My floor plan"
                            aria-label="Site Model Name"
                            aria-describedby="siteModelNameLabel"
                        />
                    </Col>

                </Row>
                <Row>
                    <Dropzone onDrop={this.onDropHandler}>
                        {({ getRootProps, getInputProps }) => (
                            <section className="dropZoneHolder">
                                <div className="dropZone" {...getRootProps()}>
                                    {currentFileElement}
                                    <input {...getInputProps()} />
                                    <p>Drag 'n' drop some files here, or click to select files</p>
                                </div>
                            </section>
                        )}
                    </Dropzone>
                </Row>
                <Row className="justify-content-md-end">
                    {
                        (this.state.loading) ? <Spinner animation="border" role="status"><span className="sr-only">Loading...</span></Spinner> : ''
                    }
                    <Button onClick={this.onSubmitHandler} disabled={this.state.loading}>Submit</Button>

                </Row>
            </Container>
        );
        return (
            <BreadcrumbsPage
                items={[
                    new BreadcrumbsPage.Item("Site Models", "/app/siteModels"),
                    new BreadcrumbsPage.Item("Create New", "/app/siteModels/add").asActive()
                ]}
                content={content}
            />
        );

    }
}