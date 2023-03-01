import React from 'react'

export default function Footer() {
  const currentYear = new Date().getFullYear();
  return (
    <section id="footer" className='flex flex-col items-center md:flex-row text-center md:text-left justify-between py-3 px-2 font-medium dark:text-white'>
      <div className="text-md">
        &copy;&nbsp;{currentYear}&nbsp;
        <span>Huy Nguyen Tuan</span>
      </div>
      <div className='text-sm'>Build with &#128149; and &#x1F375;</div>
    </section>
  )
}
