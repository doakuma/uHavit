/** @jsx jsx */
import { jsx, css } from '@emotion/core';
import React, { Fragment } from 'react';
import PropTypes from 'prop-types';

const Checkbox = (props) => {
    return(
        <Fragment>
            <label htmlFor="props.name" className="form-label">{props.title}</label>
            <div className="checkbox-group">
                {props.options.map((option, idx) => {
                    return(
                        <label key={option}>
                            <input
                                className="form-checkbox"
                                id={props.name + idx}
                                name={props.name}
                                onChange={props.handleChange}
                                value={option}
                                checked={ props.selectedOptions.indexOf(option) > -1 }
                                type="checkbox"
                            /> {option}
                        </label>
                    )
                })}
            </div>
        </Fragment>
    )
}

Checkbox.propTypes = {
    title: PropTypes.string,
    options: PropTypes.array,
    name: PropTypes.string,
    handleChange: PropTypes.func,
    selectedOptions: PropTypes.object
}

export default Checkbox;