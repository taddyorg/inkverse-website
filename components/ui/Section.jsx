import React, { PureComponent } from 'react';

export default ({ children, className='bg-white py-6 my-2 px-4 sm:px-6 lg:px-8 border border-gray-200' }) => {
  return (
    <div className={className}>
      { children }
    </div>
  )
}
