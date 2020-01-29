/** @jsx jsx */
import { jsx, css } from '@emotion/core';

const Wrapper = (props) => {
    return(
        <div 
        css={wrapStyle}
        className="wrapper">{props.children}</div>
    )
}

const wrapStyle = css`
    height: 100vh;
    background:#081229;
    color: #fff;
`;

export default Wrapper;