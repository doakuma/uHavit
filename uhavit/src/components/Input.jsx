/** @jsx jsx */
import { jsx, css } from '@emotion/core';
import PropTypes from 'prop-types';

/** Input */
const Input = (props) => {
    return(
        <div css={style}>
            <label htmlFor={props.name} className="form-label">{props.title}</label>
            <input
                className="form-input"
                id={props.id}
                name={props.name}
                type={props.type}
                value={props.value}
                onChange={props.handleChange}
                placeholder={props.placeholder}
            />
        </div>
    )
}

Input.propTypes = {
    name: PropTypes.string,
    title: PropTypes.string,
    id: PropTypes.string,
    type: PropTypes.string,
    value: PropTypes.string,
    placeholder: PropTypes.string,
    onChange: PropTypes.func
}

Input.defaultProps = {
    title: 'Input',
    type: 'text',
    placeholder: 'please input'
}

const style = css`
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    padding: 5px 0;

    & input {
        padding: 5px 10px;
        border: 1px solid #ececec;
        color: #fff;
    }
`

export default Input;