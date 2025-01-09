export const X = ({ className, onClick }: { className: string, onClick: () => void}) => {
  return (
    <svg onClick={onClick}  xmlns="http://www.w3.org/2000/svg"  width={35}  height={35}  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  strokeWidth={2}  strokeLinecap="round"  strokeLinejoin="round"  className={`${className} icon icon-tabler icons-tabler-outline icon-tabler-x`}><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M18 6l-12 12" /><path d="M6 6l12 12" /></svg>
  )
}
