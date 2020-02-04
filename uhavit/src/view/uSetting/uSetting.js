import React, { useState }from 'react';
import Container from '../../container/Container';
import Title from '../../components/Title';
import Input from '../../components/Input';
import Button from '../../components/Button';


const USetting = () => {
    const [setInfo, setState] = useState({
        uWant: '',
        uFreq: '',
        uWhen: ''
    })

    const updateField = e => {
        setState({
            ...setInfo,
            [e.target.name]: e.target.value
        })
    }

    const resetLogin = (e) => {
        setState({
            [e.target.name]: ''
        })
    }

    const confirmLogin = (e) => {
        e.preventDefault();
        console.log(setInfo)
    }
    return(
        <Container>
            <Title level={2} text="uSetting"/>

            <form>
                <Input
                    title="What U want"
                    id="uWant"
                    name="uWant"
                    type="text"
                    value={setInfo.uWant}
                    handleChange={updateField}
                    placeholder="Write What U want"
                />
                <Input
                    title="How U often"
                    id="uFreq"
                    name="uFreq"
                    type="number"
                    value={setInfo.uFreq}
                    handleChange={updateField}
                    placeholder="Write How U want"
                />
                <Input
                    title="When U want"
                    id="uWhen"
                    name="uWhen"
                    type="number"
                    value={setInfo.uWhen}
                    handleChange={updateField}
                    placeholder="Write When U want"
                />
                <Button 
                    type="submit"
                    title="SetUp"
                />
            </form>
        </Container>
    )

}

export default USetting;
