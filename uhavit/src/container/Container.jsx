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
    width: 800px;
    color: #fff;
    background: rgba(0,0,0,0.35);
    border-radius 5px;
    box-shadow: 0 0 10px rgba(255,255,255,0.15);
`;

export default Container;
