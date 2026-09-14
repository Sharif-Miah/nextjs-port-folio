'use client';

import React, { useState, useEffect, useMemo, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { FaGithub } from 'react-icons/fa';
import { BsFire, BsCalendarCheck, BsAward } from 'react-icons/bs';
import { personalData } from '@/utils/data/personal-data';

const MONTH_NAMES = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
];

const DAY_LABELS = [
  { day: 1, label: 'Mon' },
  { day: 3, label: 'Wed' },
  { day: 5, label: 'Fri' },
];

export default function GitActivity() {
  const [selectedYear, setSelectedYear] = useState('last');
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [hoveredDay, setHoveredDay] = useState(null);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });
  const containerRef = useRef(null);

  // Available year filters matching GitHub style
  const years = ['last', '2026', '2025', '2024', '2023', '2022'];

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    setError(null);

    const githubUser = personalData?.github
      ? personalData.github.split('/').filter(Boolean).pop()
      : 'Sharif-Miah';

    fetch(`/api/github-contributions?username=${githubUser}&year=${selectedYear}`)
      .then((res) => {
        if (!res.ok) throw new Error('Failed to load GitHub activity');
        return res.json();
      })
      .then((resData) => {
        if (isMounted) {
          if (resData.success) {
            setData(resData);
          } else {
            setError(resData.message || 'Could not fetch contributions');
          }
          setLoading(false);
        }
      })
      .catch((err) => {
        if (isMounted) {
          setError(err.message);
          setLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [selectedYear]);

  // Organize flat days into 7-day columns (weeks)
  const { weeks, monthHeaders, stats } = useMemo(() => {
    if (!data?.contributions || data.contributions.length === 0) {
      return { weeks: [], monthHeaders: [], stats: { total: 0, maxDay: 0, streak: 0, longestStreak: 0 } };
    }

    const contributions = data.contributions;
    let total = data.totalContributions || 0;
    let maxDay = 0;
    let currentStreak = 0;
    let longestStreak = 0;
    let tempStreak = 0;

    // Calculate streaks & max contributions
    contributions.forEach((d) => {
      if (d.count > maxDay) maxDay = d.count;
      if (d.count > 0) {
        tempStreak++;
        if (tempStreak > longestStreak) longestStreak = tempStreak;
      } else {
        tempStreak = 0;
      }
    });

    // Count backwards for current streak
    for (let i = contributions.length - 1; i >= 0; i--) {
      if (contributions[i].count > 0) {
        currentStreak++;
      } else {
        // If today has 0, check if yesterday had commits
        if (i === contributions.length - 1) continue;
        break;
      }
    }

    // Build weeks array (column-based)
    const weeksList = [];
    let currentWeek = [];

    // Pad first week if it doesn't start on Sunday
    const firstDate = new Date(contributions[0].date);
    const firstDayOfWeek = firstDate.getUTCDay(); // 0 = Sun, 1 = Mon ...
    for (let i = 0; i < firstDayOfWeek; i++) {
      currentWeek.push(null);
    }

    // Group each day into weeks
    contributions.forEach((dayItem) => {
      currentWeek.push(dayItem);
      if (currentWeek.length === 7) {
        weeksList.push(currentWeek);
        currentWeek = [];
      }
    });

    // Pad last week if incomplete
    if (currentWeek.length > 0) {
      while (currentWeek.length < 7) {
        currentWeek.push(null);
      }
      weeksList.push(currentWeek);
    }

    // Determine month label positions
    const monthHeadersList = [];
    let lastSeenMonth = -1;

    weeksList.forEach((week, weekIdx) => {
      // Look at the first non-null day in this week
      const firstValidDay = week.find((d) => d !== null);
      if (firstValidDay) {
        const d = new Date(firstValidDay.date);
        const month = d.getUTCMonth();
        if (month !== lastSeenMonth) {
          monthHeadersList.push({
            weekIndex: weekIdx,
            label: MONTH_NAMES[month],
          });
          lastSeenMonth = month;
        }
      }
    });

    return {
      weeks: weeksList,
      monthHeaders: monthHeadersList,
      stats: {
        total,
        maxDay,
        streak: currentStreak,
        longestStreak,
      },
    };
  }, [data]);

  // Color mapping matching website dark + neon emerald theme
  const getLevelColor = (level) => {
    switch (level) {
      case 1:
        return 'bg-[#0e4429] border-[#105634]';
      case 2:
        return 'bg-[#006d32] border-[#0a8240]';
      case 3:
        return 'bg-[#10b981] border-[#34d399]';
      case 4:
        return 'bg-[#16f2b3] border-[#72fbd1] shadow-[0_0_8px_#16f2b3aa]';
      default:
        return 'bg-[#151b2c] border-[#1f263d]';
    }
  };

  const handleMouseEnterDay = (day, e) => {
    if (!day) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const containerRect = containerRef.current
      ? containerRef.current.getBoundingClientRect()
      : { left: 0, top: 0 };

    setTooltipPos({
      x: rect.left - containerRect.left + rect.width / 2,
      y: rect.top - containerRect.top - 8,
    });
    setHoveredDay(day);
  };

  const handleMouseLeaveDay = () => {
    setHoveredDay(null);
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      timeZone: 'UTC',
    });
  };

  return (
    <div id="git-activity" className="relative z-50 border-t my-12 lg:my-24 border-[#25213b]">
      <Image
        src="/section.svg"
        alt="Hero"
        width={1572}
        height={795}
        className="absolute top-0 -z-10"
      />

      <div className="flex justify-center -translate-y-[1px]">
        <div className="w-3/4">
          <div className="h-[1px] bg-gradient-to-r from-transparent via-violet-500 to-transparent w-full" />
        </div>
      </div>

      <div className="flex justify-center my-5 lg:py-8">
        <div className="flex items-center">
          <span className="w-24 h-[2px] bg-[#1a1443]"></span>
          <span className="bg-[#1a1443] w-fit text-white p-2 px-5 text-xl rounded-md font-medium tracking-wide">
            GITHUB ACTIVITY
          </span>
          <span className="w-24 h-[2px] bg-[#1a1443]"></span>
        </div>
      </div>

      <div className="w-full max-w-6xl mx-auto px-4 sm:px-6">
        {/* Quick Stats Badges */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          <div className="bg-[#11152c] border border-[#1b2c68a0] rounded-xl p-4 text-center hover:border-violet-500 transition-all duration-300">
            <div className="flex items-center justify-center gap-2 text-violet-400 mb-1">
              <FaGithub className="text-xl" />
              <span className="text-xs uppercase tracking-wider text-gray-400">Contributions</span>
            </div>
            <p className="text-2xl font-bold text-white">
              {stats.total.toLocaleString()}
            </p>
          </div>

          <div className="bg-[#11152c] border border-[#1b2c68a0] rounded-xl p-4 text-center hover:border-[#16f2b3] transition-all duration-300">
            <div className="flex items-center justify-center gap-2 text-[#16f2b3] mb-1">
              <BsFire className="text-xl" />
              <span className="text-xs uppercase tracking-wider text-gray-400">Current Streak</span>
            </div>
            <p className="text-2xl font-bold text-white">
              {stats.streak} <span className="text-sm font-normal text-gray-400">days</span>
            </p>
          </div>

          <div className="bg-[#11152c] border border-[#1b2c68a0] rounded-xl p-4 text-center hover:border-amber-400 transition-all duration-300">
            <div className="flex items-center justify-center gap-2 text-amber-400 mb-1">
              <BsAward className="text-xl" />
              <span className="text-xs uppercase tracking-wider text-gray-400">Longest Streak</span>
            </div>
            <p className="text-2xl font-bold text-white">
              {stats.longestStreak} <span className="text-sm font-normal text-gray-400">days</span>
            </p>
          </div>

          <div className="bg-[#11152c] border border-[#1b2c68a0] rounded-xl p-4 text-center hover:border-pink-500 transition-all duration-300">
            <div className="flex items-center justify-center gap-2 text-pink-400 mb-1">
              <BsCalendarCheck className="text-xl" />
              <span className="text-xs uppercase tracking-wider text-gray-400">Best Day</span>
            </div>
            <p className="text-2xl font-bold text-white">
              {stats.maxDay} <span className="text-sm font-normal text-gray-400">commits</span>
            </p>
          </div>
        </div>

        {/* Main Heatmap Container + Year Buttons */}
        <div className="flex flex-col lg:flex-row gap-6 items-start">
          {/* Main Heatmap Card */}
          <div
            ref={containerRef}
            className="flex-1 w-full bg-[#0d1224] border border-[#1b2c68a0] rounded-xl p-4 sm:p-6 shadow-2xl relative"
          >
            {/* Top Bar inside Card */}
            <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
              <div className="flex items-center gap-3">
                <span className="text-white text-base sm:text-lg font-semibold">
                  {loading
                    ? 'Loading contributions...'
                    : `${stats.total.toLocaleString()} contributions in ${
                        selectedYear === 'last' ? 'the last year' : selectedYear
                      }`}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <Link
                  href={personalData.github}
                  target="_blank"
                  className="flex items-center gap-2 text-xs sm:text-sm text-gray-300 hover:text-[#16f2b3] bg-[#1a1443] hover:bg-[#231d4b] px-3 py-1.5 rounded-lg border border-[#2b2468] transition-all"
                >
                  <FaGithub className="text-base" />
                  <span>@Sharif-Miah</span>
                </Link>
              </div>
            </div>

            {/* Heatmap Area */}
            {loading ? (
              <div className="h-44 flex items-center justify-center">
                <div className="flex flex-col items-center gap-2">
                  <div className="w-8 h-8 border-2 border-[#16f2b3] border-t-transparent rounded-full animate-spin"></div>
                  <span className="text-xs text-gray-400">Fetching live GitHub activity...</span>
                </div>
              </div>
            ) : error ? (
              <div className="h-44 flex flex-col items-center justify-center text-center p-4">
                <p className="text-rose-400 text-sm mb-2">{error}</p>
                <button
                  onClick={() => setSelectedYear((y) => y)}
                  className="text-xs text-[#16f2b3] underline hover:no-underline"
                >
                  Try Again
                </button>
              </div>
            ) : (
              <div className="overflow-x-auto pb-3 select-none">
                <div className="min-w-[720px]">
                  {/* Month labels header */}
                  <div className="flex text-xs text-gray-400 ml-8 mb-2 h-4 relative">
                    {monthHeaders.map((m, idx) => (
                      <span
                        key={idx}
                        className="absolute"
                        style={{ left: `${m.weekIndex * 14}px` }}
                      >
                        {m.label}
                      </span>
                    ))}
                  </div>

                  {/* Days label column + Grid of cells */}
                  <div className="flex gap-2">
                    {/* Mon, Wed, Fri Day labels */}
                    <div className="flex flex-col justify-between text-[10px] text-gray-400 py-[2px] w-6 text-right select-none">
                      <span className="h-3 leading-3"></span>
                      <span className="h-3 leading-3">Mon</span>
                      <span className="h-3 leading-3"></span>
                      <span className="h-3 leading-3">Wed</span>
                      <span className="h-3 leading-3"></span>
                      <span className="h-3 leading-3">Fri</span>
                      <span className="h-3 leading-3"></span>
                    </div>

                    {/* Columns of 7 days */}
                    <div className="flex gap-[3px]">
                      {weeks.map((week, wIdx) => (
                        <div key={wIdx} className="flex flex-col gap-[3px]">
                          {week.map((day, dIdx) => {
                            if (!day) {
                              return (
                                <div
                                  key={dIdx}
                                  className="w-[11px] h-[11px] rounded-[2px] bg-transparent opacity-0 pointer-events-none"
                                />
                              );
                            }

                            const colorClass = getLevelColor(day.level);

                            return (
                              <div
                                key={dIdx}
                                onMouseEnter={(e) => handleMouseEnterDay(day, e)}
                                onMouseLeave={handleMouseLeaveDay}
                                className={`w-[11px] h-[11px] rounded-[2px] border ${colorClass} transition-transform duration-150 hover:scale-125 hover:z-20 cursor-pointer`}
                              />
                            );
                          })}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Tooltip */}
            {hoveredDay && (
              <div
                className="absolute z-50 pointer-events-none -translate-x-1/2 -translate-y-full px-3 py-1.5 text-xs text-white bg-[#101426] border border-[#2b3558] rounded-md shadow-xl whitespace-nowrap"
                style={{ left: `${tooltipPos.x}px`, top: `${tooltipPos.y}px` }}
              >
                <span className="font-semibold text-[#16f2b3]">
                  {hoveredDay.count === 0
                    ? 'No contributions'
                    : `${hoveredDay.count} contribution${hoveredDay.count > 1 ? 's' : ''}`}
                </span>{' '}
                on {formatDate(hoveredDay.date)}
              </div>
            )}

            {/* Bottom Footer inside Card */}
            <div className="flex flex-wrap items-center justify-between gap-4 mt-6 pt-4 border-t border-[#1b2c6860] text-xs text-gray-400">
              <a
                href="https://docs.github.com/en/account-and-profile/setting-up-and-managing-your-github-profile/managing-contribution-settings-on-your-profile/why-are-my-contributions-not-showing-up-on-my-profile"
                target="_blank"
                rel="noreferrer"
                className="hover:text-[#16f2b3] transition-colors"
              >
                Learn how we count contributions
              </a>

              <div className="flex items-center gap-1.5">
                <span>Less</span>
                <span className="w-3 h-3 rounded-[2px] bg-[#151b2c] border border-[#1f263d]"></span>
                <span className="w-3 h-3 rounded-[2px] bg-[#0e4429] border-[#105634]"></span>
                <span className="w-3 h-3 rounded-[2px] bg-[#006d32] border-[#0a8240]"></span>
                <span className="w-3 h-3 rounded-[2px] bg-[#10b981] border-[#34d399]"></span>
                <span className="w-3 h-3 rounded-[2px] bg-[#16f2b3] border-[#72fbd1] shadow-[0_0_6px_#16f2b3aa]"></span>
                <span>More</span>
              </div>
            </div>
          </div>

          {/* Year Buttons on the Right Side (Matching GitHub Screenshot) */}
          <div className="w-full lg:w-32 flex flex-row lg:flex-col gap-2 overflow-x-auto lg:overflow-visible py-1">
            {years.map((yr) => {
              const isActive = selectedYear === yr;
              const displayLabel = yr === 'last' ? '2026 (Recent)' : yr;

              return (
                <button
                  key={yr}
                  onClick={() => setSelectedYear(yr)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 text-center whitespace-nowrap ${
                    isActive
                      ? 'bg-gradient-to-r from-blue-600 to-violet-600 text-white shadow-lg shadow-violet-900/40 border border-violet-400 scale-105'
                      : 'bg-[#11152c] text-gray-400 hover:text-white border border-[#1b2c68a0] hover:border-violet-500/60 hover:bg-[#181d3d]'
                  }`}
                >
                  {displayLabel}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
