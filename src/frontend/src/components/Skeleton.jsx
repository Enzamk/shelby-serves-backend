export default function Skeleton({ className = '', variant = 'default' }) {
  const baseClasses = 'animate-pulse bg-slate-200';
  
  const variants = {
    default: 'rounded',
    card: 'rounded-2xl',
    text: 'rounded h-4',
    title: 'rounded h-6',
    avatar: 'rounded-full',
    thumbnail: 'rounded-lg aspect-video',
  };

  return (
    <div className={`${baseClasses} ${variants[variant]} ${className}`} />
  );
}
