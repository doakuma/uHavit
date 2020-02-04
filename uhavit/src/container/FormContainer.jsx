import React, { Component } from 'react';

/* Import Components */
import Input from '../components/Input';
import Select from '../components/select';
import CheckBox from '../components/CheckBox';
import TextArea from '../components/TextArea';
import Button from '../components/Button';

class FormContainer extends Component {
    constructor(props) {
        super(props);

        this.state = {
            newUser: {
                name: '',
                age: '',
                gender: '',
                about: '',
                skills: []
            },
            genderOptions: ['Male', 'Female', 'Others'],
            skillOptions: ['Programming', 'Development', 'Design', 'Testing']
        }
        this.handleFormSubmit = this.handleFormSubmit.bind(this);
        this.handleClearForm = this.handleClearForm.bind(this);
        this.handleInput = this.handleInput.bind(this);
        this.handelCheckbox = this.handelCheckbox.bind(this);
        this.handleTextArea = this.handleTextArea.bind(this)
    }

    handleFormSubmit(e) {
        e.preventDefault();
        let userData = this.state.newUser;

        fetch()
        .then()
    }
    handleClearForm(e) {
        e.preventDefault();
        this.setState({
            newUser: {
                name: '',
                age: '',
                gender: '',
                about: '',
                skills: []
            }
        })
    }
    handleInput(e) {
        let value = e.target.value;
        let name = e.target.name;
        this.setState( prevState =>({ newUser:
            {...prevState.newUser, [name]: value
            }
        }), () => console.log(this.state.newUser))
    }
    handelCheckbox(e) {
        const newSelection = e.target.value;
        let newSelectionArray;

        if(this.state.newUser.skills.indexOf(newSelection) > -1) {
            newSelectionArray = this.state.newUser.skills.filter( s => s!== newSelection )
        } else {
            newSelectionArray = [...this.state.newUser.skills, newSelection];
        }

        this.setState(prevState =>({ newUser:
            {...prevState.newUser, skills: newSelectionArray}
        }))
    }

    handleTextArea(e) {
        let value = e.target.value;
        this.setState(prevState =>({ newUser:
            {...prevState.newUser, about: value}

        }), () => console.log(this.state.newUser))
    }

    render() {
        return(
            
            <form className="container" onSubmit={this.handleClearForm}>
                
                <Input
                    type={'text'}
                    title={'Full Name'}
                    name={'name'}
                    value={this.state.newUser.name}
                    placeholder={'Enter Your Name'}
                    handleChange={this.handleInput}
                />
                <Input
                    type={'text'}
                    title={'Age'}
                    name={'age'}
                    value={this.state.newUser.age}
                    placeholder={'Enter Your Age'}
                    handleChange={this.handleInput}
                />
                <Select
                    title={'Gender'}
                    name={'gender'}
                    options={this.state.genderOptions}
                    value={this.state.newUser.gender}
                    placeholder={'Select Gender'}
                    handleChange={this.handleInput}
                />
                <CheckBox
                    title={'Skills'}
                    name={'skills'}
                    options={this.state.skillOptions}
                    selectedOptions={this.state.newUser.skills}
                    handleChange={this.handelCheckbox}
                />
                <TextArea
                    title={'About you'}
                    rows={10}
                    value={this.state.newUser.about}
                    handleChange={this.handleTextArea}
                    placeholder={'Describe your past experience and skills'}
                />
                <Button
                    action={this.handleFormSubmit}
                    title={'Submit'}
                    type={'primary'}
                />
                <Button
                    action={this.handleClearForm}
                    title={'Clear'}
                    type={'secondary'}
                />
            </form>
        )
    }
}

export default FormContainer;