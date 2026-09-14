import { NextResponse } from 'next/server';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const username = searchParams.get('username') || 'Sharif-Miah';
  const year = searchParams.get('year') || 'last';
  const token = process.env.GITHUB_TOKEN;

  try {
    // 1. If a GitHub Personal Access Token is configured, try GitHub GraphQL API (supports private contributions)
    if (token) {
      try {
        let fromDate = undefined;
        let toDate = undefined;

        if (year !== 'last') {
          fromDate = `${year}-01-01T00:00:00Z`;
          toDate = `${year}-12-31T23:59:59Z`;
        }

        const query = `
          query($userName: String!, $from: DateTime, $to: DateTime) {
            user(login: $userName) {
              contributionsCollection(from: $from, to: $to) {
                contributionCalendar {
                  totalContributions
                  weeks {
                    contributionDays {
                      contributionCount
                      date
                      color
                    }
                  }
                }
              }
            }
          }
        `;

        const ghRes = await fetch('https://api.github.com/graphql', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
            'User-Agent': 'Portfolio-App',
          },
          body: JSON.stringify({
            query,
            variables: {
              userName: username,
              ...(fromDate ? { from: fromDate, to: toDate } : {}),
            },
          }),
          next: { revalidate: 3600 },
        });

        if (ghRes.ok) {
          const ghData = await ghRes.json();
          const calendar = ghData?.data?.user?.contributionsCollection?.contributionCalendar;
          if (calendar) {
            const flattened = [];
            calendar.weeks.forEach((week) => {
              week.contributionDays.forEach((day) => {
                let level = 0;
                if (day.contributionCount >= 10) level = 4;
                else if (day.contributionCount >= 6) level = 3;
                else if (day.contributionCount >= 3) level = 2;
                else if (day.contributionCount > 0) level = 1;

                flattened.push({
                  date: day.date,
                  count: day.contributionCount,
                  level,
                });
              });
            });

            return NextResponse.json(
              {
                success: true,
                source: 'github-graphql',
                year,
                totalContributions: calendar.totalContributions,
                contributions: flattened,
              },
              { status: 200 }
            );
          }
        }
      } catch (err) {
        console.warn('GitHub GraphQL failed, falling back to public API:', err.message);
      }
    }

    // 2. Fetch using jogruber contributions API
    const targetUrl = `https://github-contributions-api.jogruber.de/v4/${username}?y=${year}`;
    const response = await fetch(targetUrl, {
      next: { revalidate: 3600 },
      headers: {
        'User-Agent': 'Portfolio-App',
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch from jogruber API: ${response.statusText}`);
    }

    const data = await response.json();
    const count =
      year === 'last'
        ? data?.total?.lastYear ?? 0
        : data?.total?.[year] ?? 0;

    return NextResponse.json(
      {
        success: true,
        source: 'public-api',
        year,
        totalContributions: count,
        totalYears: data?.total || {},
        contributions: data?.contributions || [],
      },
      {
        status: 200,
        headers: {
          'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
        },
      }
    );
  } catch (error) {
    console.error('Error fetching contributions:', error);
    return NextResponse.json(
      {
        success: false,
        message: error.message || 'Error fetching GitHub contributions',
      },
      { status: 500 }
    );
  }
}
