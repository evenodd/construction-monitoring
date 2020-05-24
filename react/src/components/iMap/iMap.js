import React from 'react';
import Container from 'react-bootstrap/Container';
import ImageMapper from 'react-image-mapper';

export default class IMap extends React.Component {

    constructor(props) {
        super(props);
        let areas = [];
        if (props.rooms) {
            areas = props.rooms.map(room => {
                return {
                    shape: "poly",
                    coords: room.coords.split(',').map(x => +x),
                    href: `/app/siteModels/${this.props.siteModelId}/room/${room._id}`,
                    preFillColor: "rgba(0,255,0,0.3)",
                    strokeColor: "rgba(0,0,255,0.8)",
                    lineWidth: "2"
                }
            })
        }
        this.state = {
            src: props.data,
            map: {
                name: "Rooms",
                areas
            },
        }
    }

    render() {
        return (
            <Container>
                <ImageMapper 
                    src={this.state.src}
                    map={this.state.map}/>
            </Container>
        )
    }
}