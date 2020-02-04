import React, { Component }from 'react';
import Container from '../../container/Container';
import Title from '../../components/Title';
import Input from '../../components/Input';
import Button from '../../components/Button';

class USetting extends Component {
    render() {
        return(
            <Container>
                <Title level={2} text="uSetting"/>

                <form>
                    Input
                </form>
            </Container>
        )
    }
}

export default USetting;
