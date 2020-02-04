import React, { useState }from 'react';
import Container from '../../container/Container';
import Title from '../../components/Title';
import Input from '../../components/Input';
import Button from '../../components/Button';

/**
 * TODO :
 * 
 * 
 */

const UMake = () => {
    const startHavit = e => {
        e.preventDefault();
        console.log('start havit')
    }
    const writeToday = e => {
        e.preventDefault();
        console.log('write today')
    }
    return(
        <Container>
            <Title level={2} text="UMake"/>
            <Button
                type="button"
                title="Start Havit"
                action={startHavit}
            />
            <Button
                type="button"
                title="Write Today"
                action={writeToday}
            />
        </Container>
    )
}

export default UMake;
