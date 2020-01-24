/** @jsx jsx */
import { jsx, css } from '@emotion/core';
import PropTypes from 'prop-types';

/** 버튼 */
const Button = (props) => {
    return(
        <button
            style={props.style}
            className={props.type === 'primary' ? 'btn btn-primary' : 'btn btn-secondary'}
            onClick={props.action}>
            {props.title}
        </button>
    )
}

Button.propTypes = {
    /** className 설정  */
    type: PropTypes.string,
    style: PropTypes.array,
    action: PropTypes.func,
    title: PropTypes.string
}

export default Button;