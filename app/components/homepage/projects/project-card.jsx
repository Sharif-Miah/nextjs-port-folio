// @flow strict

import * as React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { FaCode, FaExternalLinkAlt, FaGithub, FaGlobe } from 'react-icons/fa';

function ProjectCard({ project }) {
  // Extract display domain for the browser mockup URL bar
  let displayUrl = '';
  if (project.demo) {
    try {
      displayUrl = new URL(project.demo).hostname;
    } catch {
      displayUrl = project.demo.replace(/^https?:\/\//, '').replace(/\/.*$/, '');
    }
  }

  return (
    <div className='from-[#0d1224] border-[#1b2c68a0] relative rounded-xl border bg-gradient-to-r to-[#0a0d37] w-full overflow-hidden shadow-2xl backdrop-blur-sm'>
      {/* Top Gradient Border Line */}
      <div className='flex flex-row'>
        <div className='h-[1px] w-full bg-gradient-to-r from-transparent via-pink-500 to-violet-600'></div>
        <div className='h-[1px] w-full bg-gradient-to-r from-violet-600 to-transparent'></div>
      </div>

      {/* Card Header */}
      <div className='px-4 lg:px-6 py-3 flex items-center justify-between border-b border-indigo-950/80 bg-[#070b1e]/70'>
        <div className='flex items-center space-x-2'>
          <div className='h-3 w-3 rounded-full bg-red-400'></div>
          <div className='h-3 w-3 rounded-full bg-amber-400'></div>
          <div className='h-3 w-3 rounded-full bg-emerald-400'></div>
          <span className='text-xs font-mono text-gray-400 ml-2 hidden sm:inline'>
            projects/{project.name.toLowerCase().replace(/\s+/g, '-')}
          </span>
        </div>

        <div className='flex items-center gap-3'>
          <p className='text-[#16f2b3] font-semibold text-sm lg:text-base tracking-wide'>
            {project.name}
          </p>
          <span className='text-[10px] uppercase font-mono px-2 py-0.5 rounded-full bg-violet-900/60 text-violet-300 border border-violet-700/50 hidden md:inline'>
            {project.role}
          </span>
        </div>
      </div>

      {/* Card Main Body: Split Layout (Preview + Code) */}
      <div className='p-4 lg:p-6 grid grid-cols-1 lg:grid-cols-12 gap-5 lg:gap-6 items-stretch'>
        {/* LEFT COLUMN: Visual Homepage Preview in Browser Mockup */}
        <div className='lg:col-span-6 flex flex-col justify-between group'>
          <div className='rounded-lg border border-indigo-900/80 bg-[#080d26] overflow-hidden shadow-lg transition-all duration-300 hover:border-violet-500/60 flex flex-col h-full'>
            {/* Mockup Browser Address Bar */}
            <div className='px-3 py-2 bg-[#0d1435] border-b border-indigo-950/80 flex items-center justify-between gap-2 text-xs'>
              <div className='flex items-center gap-1.5 text-gray-400'>
                <FaGlobe className='text-[11px] text-[#16f2b3]' />
                <span className='text-[11px] text-gray-300 truncate max-w-[180px] sm:max-w-[240px] font-mono'>
                  {displayUrl || 'preview.app'}
                </span>
              </div>
              <div className='flex items-center gap-2'>
                {project.demo && (
                  <Link
                    href={project.demo}
                    target='_blank'
                    rel='noopener noreferrer'
                    className='text-[11px] flex items-center gap-1 text-[#16f2b3] hover:underline font-medium'>
                    <span>Open</span>
                    <FaExternalLinkAlt className='text-[9px]' />
                  </Link>
                )}
              </div>
            </div>

            {/* Homepage Screenshot Image Container */}
            <div className='relative overflow-hidden aspect-[16/10] bg-[#050818] flex items-center justify-center flex-1'>
              {project.image ? (
                <Image
                  src={project.image}
                  alt={`${project.name} preview`}
                  width={900}
                  height={560}
                  className='w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105'
                  priority={project.id === 0}
                />
              ) : (
                <div className='flex flex-col items-center justify-center text-gray-500 gap-2 p-6'>
                  <FaGlobe className='text-4xl text-violet-500/40' />
                  <span className='text-xs font-mono'>No preview available</span>
                </div>
              )}

              {/* Hover Action Overlay */}
              <div className='absolute inset-0 bg-gradient-to-t from-[#0a0d2c]/95 via-[#0a0d2c]/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center p-4 gap-3'>
                {project.demo && (
                  <Link
                    href={project.demo}
                    target='_blank'
                    rel='noopener noreferrer'
                    className='px-3.5 py-1.5 rounded-md bg-gradient-to-r from-pink-500 to-violet-600 text-white text-xs font-medium flex items-center gap-1.5 shadow-lg shadow-pink-500/25 hover:brightness-110 transition-all transform hover:-translate-y-0.5'>
                    <span>Live Demo</span>
                    <FaExternalLinkAlt className='text-[10px]' />
                  </Link>
                )}
                {project.code && (
                  <Link
                    href={project.code}
                    target='_blank'
                    rel='noopener noreferrer'
                    className='px-3.5 py-1.5 rounded-md bg-[#161c3b] hover:bg-[#202952] border border-indigo-700/50 text-white text-xs font-medium flex items-center gap-1.5 transition-all transform hover:-translate-y-0.5'>
                    <FaGithub className='text-xs' />
                    <span>Code</span>
                  </Link>
                )}
              </div>
            </div>

            {/* Quick Tech Badges underneath screenshot */}
            <div className='p-3 bg-[#0a0e2a] border-t border-indigo-950/80 flex flex-wrap gap-1.5'>
              {project.tools?.slice(0, 5).map((tool, idx) => (
                <span
                  key={idx}
                  className='text-[11px] px-2 py-0.5 rounded bg-[#161f48] text-cyan-300 font-mono'>
                  {tool}
                </span>
              ))}
              {project.tools?.length > 5 && (
                <span className='text-[10px] px-1.5 py-0.5 rounded bg-[#12183b] text-gray-400 font-mono'>
                  +{project.tools.length - 5} more
                </span>
              )}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Code Window Details */}
        <div className='lg:col-span-6 flex flex-col justify-between rounded-lg border border-indigo-950/80 bg-[#070b22]/90 p-4 lg:p-5 font-mono'>
          <div className='overflow-x-auto text-xs md:text-sm leading-relaxed'>
            <div className='blink mb-1'>
              <span className='mr-2 text-pink-500 font-semibold'>const</span>
              <span className='mr-2 text-white'>project</span>
              <span className='mr-2 text-pink-500'>=</span>
              <span className='text-gray-400'>{'{'}</span>
            </div>

            <div className='pl-3 lg:pl-5'>
              <span className='text-white'>name:</span>
              <span className='text-gray-400 ml-1.5'>{`'`}</span>
              <span className='text-amber-300'>{project.name}</span>
              <span className='text-gray-400'>{`',`}</span>
            </div>

            <div className='pl-3 lg:pl-5'>
              <span className='text-white'>myRole:</span>
              <span className='text-gray-400 ml-1.5'>{`'`}</span>
              <span className='text-orange-400'>{project.role}</span>
              <span className='text-gray-400'>{`',`}</span>
            </div>

            <div className='pl-3 lg:pl-5'>
              <span className='text-white'>description:</span>
              <span className='text-gray-400 ml-1.5'>{`'`}</span>
              <span className='text-cyan-400 font-sans text-xs leading-normal'>
                {project.description}
              </span>
              <span className='text-gray-400'>{`',`}</span>
            </div>

            <div className='pl-3 lg:pl-5 flex flex-wrap gap-y-1'>
              <span className='text-white mr-1'>tech:</span>
              <span className='text-gray-400'>{`['`}</span>
              {project.tools?.map((tag, i) => (
                <React.Fragment key={i}>
                  <span className='text-amber-300'>{tag}</span>
                  {project.tools.length - 1 !== i && (
                    <span className='text-gray-400'>{`', '`}</span>
                  )}
                </React.Fragment>
              ))}
              <span className='text-gray-400'>{`],`}</span>
            </div>

            {project.code && (
              <div className='pl-3 lg:pl-5'>
                <span className='text-white'>code:</span>
                <Link
                  href={project.code}
                  target='_blank'
                  rel='noopener noreferrer'
                  className='text-violet-400 hover:text-violet-300 hover:underline ml-1.5'>
                  {`'github.com/...`}
                </Link>
                <span className='text-gray-400'>',</span>
              </div>
            )}

            {project.demo && (
              <div className='pl-3 lg:pl-5'>
                <span className='text-white'>live:</span>
                <Link
                  href={project.demo}
                  target='_blank'
                  rel='noopener noreferrer'
                  className='text-[#16f2b3] hover:underline ml-1.5'>
                  {`'${displayUrl || 'live-demo'}'`}
                </Link>
                <span className='text-gray-400'>,</span>
              </div>
            )}

            <div className='text-gray-400 mt-1'>{`};`}</div>
          </div>

          {/* Action Button Bar */}
          <div className='pt-4 mt-3 border-t border-indigo-950/70 flex items-center gap-3 font-sans'>
            {project.demo && (
              <Link
                href={project.demo}
                target='_blank'
                rel='noopener noreferrer'
                className='flex-1 text-center py-2 px-3 rounded-lg bg-gradient-to-r from-pink-500 to-violet-600 text-white text-xs font-semibold flex items-center justify-center gap-1.5 shadow-md shadow-pink-500/20 hover:brightness-110 transition-all'>
                <span>View Live Demo</span>
                <FaExternalLinkAlt className='text-[10px]' />
              </Link>
            )}

            {project.code ? (
              <Link
                href={project.code}
                target='_blank'
                rel='noopener noreferrer'
                className='flex-1 text-center py-2 px-3 rounded-lg bg-[#151c3d] hover:bg-[#202957] border border-indigo-700/60 text-gray-200 text-xs font-semibold flex items-center justify-center gap-1.5 transition-all'>
                <FaGithub className='text-sm' />
                <span>Source Code</span>
              </Link>
            ) : (
              <span className='text-[11px] text-gray-500 italic py-2 px-1'>
                (Private / Client Repository)
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProjectCard;
