/** @jsx jsx */
import { jsx, css } from '@emotion/core';
import PropTypes from 'prop-types';

/** 버튼 */
const Button = (props) => {
    return(
        <button
            btnType={props.type}
            css={[style, themes[props.theme]]}
            onClick={props.action}>
            {props.title}
        </button>
    )
}

Button.propTypes = {
    /** Button Type : button, submit, ...  */
    type: PropTypes.string,
    /** Button Themes : primary, secondary, tertiary */
    theme: PropTypes.string,
    /** Button onClick function */
    action: PropTypes.func,
    /** Button Text */
    title: PropTypes.string
}

Button.defaultProps = {
    type: 'button',
    title: 'Button'
}

const style = css`
    display: inline-flex;
    justify-content: center;
    align-items: center;
    width: 120px;
    height: 40px;
    font-size: 16px;
    border: 1px solid #191d3a;
    background: #0e101c;
    color: #fff;
    border-radius: 5px;
    transition: all 0.15s;
    &:hover {
        border-color: #bf1650
    }
`;
const themes = {
    primary: css`
        background: #bf1650;
        border-color: #bf1650
    `,
    secondary: css``,
    tertiary: css``
}

export default Button;