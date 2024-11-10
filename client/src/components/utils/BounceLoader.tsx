import { classNames } from "@/lib/utils";

interface BounceLoaderProps {
  className?: string;
}

function BounceLoader({
  className = ''
}: BounceLoaderProps) {
  const containerClassName = className ? `flex ${className}` : 'flex'
  const circleCommonClasses = 'h-3 w-3 bg-neutral-400 rounded-full';

  return (
    <div className={classNames(containerClassName)}>
      <div className={`${circleCommonClasses} mr-1.5 animate-bounce`}></div>
      <div className={`${circleCommonClasses} mr-1.5 animate-bounce200`}></div>
      <div className={`${circleCommonClasses} animate-bounce400`}></div>
    </div>
  );
}

export {
  BounceLoader
}
