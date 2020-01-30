import React, { useState }from 'react';
import Container from '../../container/Container';
import Title from '../../components/Title';
import Input from '../../components/Input';
import Button from '../../components/Button.jsx';


const LogIn = () => {

    const [ userInfo, setState] = useState({
        userId: '',
        userPw: ''
    })

    const updateField = e => {
        setState({
            ...userInfo,
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
        console.log(userInfo)
    }
    return(
        <Container>
            <Title level={2} text="Login"/>
            <form 
            onSubmit={confirmLogin}
            onReset={resetLogin}
            >
                <Input
                    title="ID"
                    id="userId"
                    name="userId"
                    type="text"
                    value={userInfo.userId}
                    handleChange={updateField}
                    placeholder="User Id"
                />
                <Input
                    title="Password"
                    id="userPw"
                    name="userPw"
                    type="password"
                    value={userInfo.userPw}
                    handleChange={updateField}
                    placeholder="Your Password"
                />
                <Button
                    type="submit"
                    title="Login"
                />
                <Button
                    type="reset"
                    title="Cancel"
                />
            </form>
        </Container>
    )
}

export default LogIn;
