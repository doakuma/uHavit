import styles from './Button.module.css';

/**
 * 버튼 컴포넌트
 * @param {Object} props
 * @param {React.ReactNode} props.children - 버튼 내용
 * @param {string} props.variant - 버튼 스타일 (primary, secondary, danger)
 * @param {string} props.size - 버튼 크기 (sm, md, lg)
 * @param {boolean} props.disabled - 비활성화 여부
 * @param {Function} props.onClick - 클릭 핸들러
 * @param {string} props.type - 버튼 타입 (button, submit, reset)
 */
export function Button({ children, variant = 'primary', size = 'md', disabled, onClick, type = 'button', ...props }) {
  return (
    <button
      type={type}
      className={`${styles.button} ${styles[variant]} ${styles[size]}`}
      disabled={disabled}
      onClick={onClick}
      {...props}
    >
      {children}
    </button>
  );
}
