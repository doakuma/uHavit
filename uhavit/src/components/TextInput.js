/** @jsx jsx */
import { jsx, css } from '@emotion/core';
import React, { Component } from 'react';
import PropTypes from 'prop-types';

class TextInput extends Component {
    render() {
        const { inputType } = this.props;
        return(
            <input
                type={inputType}
            />
        )
    }
}

TextInput.propTypes = {
    inputType: PropTypes.string.isRequired
}

TextInput.defaultPops = {
    inputType: 'text'
}

export default TextInput;


