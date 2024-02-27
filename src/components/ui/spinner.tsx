import ClipLoader from "react-spinners/ClipLoader";

interface SpinnerProps {
  variant?: 'default' | 'brand';
  size?: number;
  className?: string | undefined;
}

export default function Spinner( { variant = 'default', size = 35, className } : SpinnerProps) {
  const theme = localStorage.getItem('vite-ui-theme') || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
  if (theme === 'dark') {
    if(variant === 'brand') {
      return (
        <div className={className}><ClipLoader color={`rgb(30 41 59)`} size={size}/></div>
      )
    
    }
    return (
      <div className={className}><ClipLoader color={`white`} size={size}/></div>
    )
  }

  if(variant === 'brand') {
    return (
      <div className={className}><ClipLoader color={`white`} size={size}/></div>
    )
  }
  return (
    <div className={className}><ClipLoader color={`rgb(30 41 59)`} size={size}/></div>
  )
}