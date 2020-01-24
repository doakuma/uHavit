/** @jsx jsx */
import { jsx, css } from '@emotion/core';
import PropTypes from 'prop-types';

const TextArea = (props) => {
    return(
        <div className="form-group">
            <label htmlFor={props.name} className="form-label">{props.title}</label>
            <textarea
                className="form-control"
                name={props.name}
                rows={props.rows}
                cols={props.cols}
                value={props.value}
                onChange={props.handleChange}
                placeholder={props.placeholder}
            ></textarea>
        </div>
    )
}

export default TextArea;