import React from 'react';
import Container from 'react-bootstrap/Container';
import ImageMapper from 'react-image-mapper';
import JobUtil from '../../util/JobUtil';
import Rainbow from 'rainbowvis.js';
import hexToRgba from 'hex-to-rgba';

export default class IMap extends React.Component {

    constructor(props) {
        super(props);
        let areas = [];

        const rainbow = new Rainbow();
        rainbow.setSpectrum('#fc0000', '#00fc00');

        if (props.rooms) {
            areas = props.rooms
                .filter(room => room.hasOwnProperty('coords'))
                .map(room => {
                    const color = hexToRgba(rainbow.colorAt(JobUtil.calculateCompletedJobs(room.jobs)), 0.3);
                    console.log(color);
                    return {
                        shape: "poly",
                        coords: room.coords.split(',').map(x => +x),
                        href: `/app/siteModels/${props.siteModelId}/room/${room._id}`,
                        preFillColor: color,
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