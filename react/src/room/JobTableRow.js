import React from 'react';
import Dropdown from 'react-bootstrap/Dropdown';
import { LinkContainer } from "react-router-bootstrap";

import TimestampDateFormat from '../util/TimestampDateFormat';

export default class JobTableRow extends React.Component {

    constructor(props) {
        super(props);
        console.log(this.props.job.analysis[0]);
    }

    onThumbnailClick = (image) => () => {
        this.props.onThumbClick(this.props.job.analysis[0].image || null);
    }

    render() {
        return (
            <tr>
                <td>
                    <span onClick={this.onThumbnailClick(null)}> 
                    {
                        this.props.job.analysis && 
                        this.props.job.analysis.length &&
                        this.props.job.analysis[0].image
                        ? <img style={{display: 'block', width: '50px'}} src={`data:image/jpeg;base64,${ new Buffer(this.props.job.analysis[0].image, 'base64') }`}/>
                        : 'No thumbnail'
                    }
                    </span>
                </td>
                <td>{this.props.job.name}</td>
                <td>Painting</td>
                <td>
                    {this.props.job.description}
                </td>
                <td>{this.props.job.completed? 'Yes' : 'No'}</td>
                <td>14/07/2020</td>
                <td>n/a</td>
                <td>
                    <LinkContainer to={this.props.jobURL}>
                    {
                        this.props.job.analysis &&
                        this.props.job.analysis.length &&
                        this.props.job.analysis[0].timestamp
                        ? <span>Last updated: {TimestampDateFormat.Job(this.props.job.analysis[0].timestamp)}</span> 
                        : <span>Not analysed</span>
                    }
                    </LinkContainer>
                </td>
                <td>
                    <Dropdown>
                        <Dropdown.Toggle variant="success" id="dropdown-basic">Actions</Dropdown.Toggle>
                        <Dropdown.Menu>
                            <Dropdown.Item href="#/action-1">Mark completed</Dropdown.Item>
                            <Dropdown.Item href="#/action-2">Delete</Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown>
                </td>
            </tr>
        );
    }


    getIcon() {
        return (
            // <MDBIcon icon="camera-retro" size="3x"/>
            <div></div>
        );
    }


} 
