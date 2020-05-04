import React from 'react';
import Container from 'react-bootstrap/Container';
import Breadcrumb from 'react-bootstrap/Breadcrumb';
import {LinkContainer} from "react-router-bootstrap";

export default class BreadcrumbPage extends React.Component {

    static Item = class {
        constructor(name, href) {
            this.name = name;
            this.href = href;
            this.active = false;
        }

        asActive() {
            this.active = true;
            return this;
        }

        render() {
            const inputProps = this.active? {active: true}: {};
            return (
                <LinkContainer to={this.href}>
                    <Breadcrumb.Item {...inputProps}>{this.name}</Breadcrumb.Item>
                </LinkContainer>
            );
        }
    };


    render() {
        const items = this.props.items.map(item => item.render());
        return (
            <Container>
                <div className="breadcrumbHolder">
                    <Breadcrumb>
                        {items}
                    </Breadcrumb>
                </div>
                {this.props.content}
            </Container>
        );
    }

}