import React from 'react';
import Dropdown from 'react-bootstrap/Dropdown';

export default class JobTableRow extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <tr>
                <td>{this.props.job.name}</td>
                <td>
                    {this.props.job.description}
                </td>
                <td>{this.props.job.completed? 'Yes' : 'No'}</td>
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
