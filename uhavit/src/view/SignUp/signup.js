import React, { Component }from 'react';
import Container from '../../container/Container';
import Title from '../../components/Title';
import Input from '../../components/Input';
import Select from '../../components/select';
import CheckBox from '../../components/CheckBox';
import TextArea from '../../components/TextArea';
import Button from '../../components/Button.jsx';
import FormContainer from '../../container/FormContainer';

const SignUp = (props) => {
    return(
        <Container>
            <Title
                level={2}
                text="Sign Up"
            />
            <FormContainer/>
        </Container>
    )

}

export default SignUp;
