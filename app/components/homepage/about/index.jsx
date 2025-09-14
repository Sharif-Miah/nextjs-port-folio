// @flow strict

import { personalData } from '@/utils/data/personal-data';
import Image from 'next/image';
import menCoding from '../../../assets/lottie/men-coding.json';
import AnimationLottie from '../../helper/animation-lottie';

function AboutSection() {
  return (
    <div
      id='about'
      className='my-12 lg:my-16 relative'>
      <div className='hidden lg:flex flex-col items-center absolute top-16 -right-8'>
        <span className='bg-[#1a1443] w-fit text-white rotate-90 p-2 px-5 text-xl rounded-md'>
          ABOUT ME
        </span>
        <span className='h-36 w-[2px] bg-[#1a1443]'></span>
      </div>
      <div className='grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16'>
        <div className='order-2 lg:order-1'>
          <p className='font-medium mb-5 text-[#16f2b3] text-xl uppercase'>
            Who I am?
          </p>
          <div className='text-gray-200 text-sm lg:text-lg'>
            {/* {personalData.description.split('\n').map((line, index) => (
        <p key={index} style={{ marginBottom: '2em' }}>{line}</p>
                  ))} */}
            <b>
              Hi, I’m Sharif Miah — a FullStack Developer passionate about
              crafting intuitive, high-performance, and visually appealing web
              applications.
            </b>{' '}
            <br />
            <br />I specialize in building responsive and scalable user
            interfaces using <b>
              {' '}
              React, Next.js, Bootstrap and TailwindCSS.
            </b>{' '}
            With a strong eye for design and a love for clean code, I enjoy
            turning complex problems into simple, elegant solutions. <br />
            <br />
            Beyond coding, I’m always exploring new frontend trends, optimizing
            performance, and experimenting with modern web tools to deliver
            exceptional user experiences.
            <br />
            <br />
            🚀 <b>Key Skills:</b> JavaScript (ES6+), TypeScript, React, Next.js,
            TailwindCSS, REST APIs, Git, Responsive Design, Web Performance.
            <br />
            <br />
            🌟 <b>Goal:</b> To create digital experiences that are not only
            functional but also delightful for users.
          </div>
        </div>
        <div className='flex justify-center order-1 lg:order-2 w-90 h-100'>
          <AnimationLottie animationPath={menCoding} />
        </div>
      </div>
    </div>
  );
}

export default AboutSection;
