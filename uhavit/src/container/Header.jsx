/** @jsx jsx */
import { jsx, css } from '@emotion/core';

const Header = (props) => {
    return(
        <header 
        css={headerStyle}
        className="header">
        {props.children}
        </header>
    )
}

const headerStyle = css`
    // border-bottom: 1px solid #F8FDFE;

    nav {
        display: flex;
        margin: 0 auto;
        width: 1200px;
        box-shadow: #000 0 0 5px 0;
        background: #191d3a;
        & a {
            display: flex;
            justify-content: center;
            align-items: center;          
            padding: 10px 20px;
            font-weight: bold;
            text-decoration: none;
            color: #F8FDFE;
            font-size: 18px;
            &:hover {
                background: #1F3044;
            }
        }
    }
`;

export default Header;
