/** @jsx jsx */
import { jsx, css } from '@emotion/core';
import PropTypes from 'prop-types';

const Title = (prop) => {
    const Tag = prop.level > 6 ? 'h6' : `h${prop.level}`;
    return(
        <Tag
            css={[style, size[prop.size]]}
        >
            {prop.text}
        </Tag>
    )
}

Title.propTypes = {
    level: PropTypes.oneOf([
        1,
        2,
        3,
        4,
        5,
        6
    ]),
    text: PropTypes.string.isRequired,
    size: PropTypes.string.isRequired
}

Title.defaultProps = {
    level: 2,
    text: 'Title',
    size: 'secondary'
}

const style = css`
    font-weight: bold;
`;

const size = {
    primary: css`
        font-size: 40px;
        margin: 0 0 30px;
    `,
    secondary: css`
        font-size: 30px;
        margin: 0 0 20px;
    `,
    tertiary: css``,
    quaternary: css``,
    quinary: css``,
    senary: css``
}

export default Title;