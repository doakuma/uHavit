import React from 'react';

const Footer = (props) => {
    return(
        <footer className="footer">
        {props.children}
        </footer>
    )
}

export default Footer;