import React from 'react';
import Container from 'react-bootstrap/Container';
import './iMap.css';

export default class IMap extends React.Component {
    render() {
        console.log(this);
        return (
            <Container>
                <map name="primary">
                {this.props.rooms.map(room => (
                    <React.Fragment key={room.name}>
                        <area shape="poly"
                              class="area"
                              coords={room.coords}
                              href={`/app/siteModels/${this.props.siteModelId}/room/${room._id}`} 
                              alt={room.name}></area>
                    </React.Fragment>
                ))}
                </map>
                <img useMap="#primary" 
                     src={this.props.data}></img>
            </Container>
        )
    }
}