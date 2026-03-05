type BackToMenuButtonProps = {
  onClick: () => void;
  className?: string;
};

export function BackToMenuButton({ onClick, className = "" }: BackToMenuButtonProps) {
  return (
    <button
      type="button"
      className={`menu-chip ${className}`.trim()}
      onClick={onClick}
      aria-label="메인 메뉴로 이동"
    >
      ← 뒤로가기
    </button>
  );
}
