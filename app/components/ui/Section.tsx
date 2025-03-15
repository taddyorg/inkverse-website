import React, { PureComponent } from 'react';

type SectionProps = {
  children: React.ReactNode
  className?: string
}

export const Section = (props: SectionProps) => {
  const { children, className = 'bg-white py-6 my-2 px-4 sm:px-6 lg:px-8 border border-gray-200' } = props;
  
  return (
    <div className={className}>
      { children }
    </div>
  )
}