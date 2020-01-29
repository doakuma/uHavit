/** @jsx jsx */
import { jsx, css } from '@emotion/core';

const Container = (props) => {
    return(
        <div 
        css={contStyle}
        className="container">
        {props.children}
        </div>
    )
}

const contStyle = css`
    margin: 20px auto 0;
    padding: 10px 20px;
    width: 1200px;
    color: #fff;
`;

export default Container;
