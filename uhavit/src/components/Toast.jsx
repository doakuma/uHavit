/** @jsx jsx */
import { jsx, css } from '@emotion/core';
import PropTypes from 'prop-types';

const Toast = (props) => {
    return (
        <div>{props.content}</div>
    )
}

export default Toast;