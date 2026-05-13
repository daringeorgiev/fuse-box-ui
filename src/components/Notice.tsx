interface INoticeProps {
  children: React.ReactNode
  className?: string
}

export default function Notice({ children, className }: INoticeProps) {
  return (
    <div className={`notice${className ? ` ${className}` : ''}`}>
      {children}
    </div>
  )
}
