/** @jsx jsx */
import {jsx, css} from '@emotion/core';
import PropTypes from 'prop-types';

/** `Button` 컴포넌트는 어떠한 작업을 트리거 할 때 사용합니다.  */
const Button = ({btnType, btnText, btnTheme, btnState}) => {
    return(
        <button
            css={[style, theme[btnTheme]]}
            type={btnType}
            disabled={btnState}
        >{btnText}</button>
    )
}

Button.propTypes = {
    /**
     * 버튼 타입
     */
    btnType: PropTypes.string,
    /** 
     * 버튼 텍스트
    */
    btnText: PropTypes.string,
    /** 
     * 버튼 테마 : primary | secondary | tertiary
    */
    btnTheme: PropTypes.string,
    /** 
     * 버튼 상태 : disabled 속성 
    */
    btnState: PropTypes.bool
}

Button.defaultProps = {
    btnType: 'button',
    btnText: '확인',
    btnTheme: 'primary',
    btnState: false
}
const style = css`
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: 0 12px;
    height: 30px;
    border: none;
    background: #fff;
    border-radius: 4px;
    font-size: 14px;
    line-height: 1.46;
    cursor: pointer;
    &:focus {
     box-shadow: 0px 0px 8px rgba(0, 0, 0, 0.2);
    }
`;
const theme = {
    primary: css`
    background: #20c997;
    color: white;
    &:hover {
      background: #38d9a9;
    }
    &:active {
      background: #12b886;
    }
  `,
  secondary: css`
    background: #e9ecef;
    color: #343a40;
    &:hover {
      background: #f1f3f5;
    }
    &:active {
      background: #dee2e6;
    }
  `,
  tertiary: css`
    background: none;
    color: #20c997;
    &:hover {
      background: #e6fcf5;
    }
    &:active {
      background: #c3fae8;
    }
  `
}
export default Button;