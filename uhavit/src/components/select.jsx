/** @jsx jsx */
import { jsx, css } from '@emotion/core';
import PropTypes from 'prop-types';

const Select = (props) => {
    return(
        <div className="form-group">
            <label htmlFor={props.name}>{props.title}</label>
            <select
                css={style}
                name={props.name}
                value={props.value}
                onChange={props.handleChange}
            >
                <option value="" disabled>{props.placeholder}</option>
                {props.options.map(option => {
                    return(
                        <option
                            key={option}
                            value={option}
                            label={option}
                        >{option}</option>
                    )
                })}
            </select>
        </div>
    )
}

const style = css`
    padding: 5px 10px;
    border: 1px solid #ececec
`;

export default Select;