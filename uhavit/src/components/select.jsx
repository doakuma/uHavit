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

Select.propTypes = {
    title: PropTypes.string,
    name: PropTypes.string,
    value: PropTypes.string,
    handleChange: PropTypes.func,
    placeholder: PropTypes.string,
    options: PropTypes.array
}
Select.defaultProps = {
    placeholder: 'Choose...',
    options: ['a','b','c']
}

const style = css`
    padding: 5px 10px;
    border: 1px solid #ececec
`;

export default Select;