import React from 'react';

/** 与版块监控一致的本地日界 */
function localDayBounds(ymd: string): { startMs: number; endMs: number } | null {
  if (!ymd || !/^\d{4}-\d{2}-\d{2}$/.test(ymd.trim())) return null;
  const [y, m, d] = ymd.split('-').map(Number);
  const start = new Date(y, m - 1, d, 0, 0, 0, 0);
  const end = new Date(y, m - 1, d, 23, 59, 59, 999);
  const startMs = start.getTime();
  const endMs = end.getTime();
  if (!Number.isFinite(startMs) || !Number.isFinite(endMs)) return null;
  return { startMs, endMs };
}

function formatLocalYmd(ms: number): string {
  const n = new Date(ms);
  const y = n.getFullYear();
  const mo = String(n.getMonth() + 1).padStart(2, '0');
  const d = String(n.getDate()).padStart(2, '0');
  return `${y}-${mo}-${d}`;
}

function passesDateFilter(tsStr: string, dateFrom: string, dateTo: string): boolean {
  if (!dateFrom && !dateTo) return true;
  const t = new Date(tsStr).getTime();
  if (Number.isNaN(t)) return false;
  if (dateFrom) {
    const b = localDayBounds(dateFrom);
    if (b && t < b.startMs) return false;
  }
  if (dateTo) {
    const b = localDayBounds(dateTo);
    if (b && t > b.endMs) return false;
  }
  return true;
}

function getBucket<T>(by: Record<string, T[]>, pilot: string): T[] {
  const k = pilot.toLowerCase();
  if (by[k]) return by[k];
  const f = Object.keys(by).find((x) => x.toLowerCase() === k);
  return f ? by[f] : [];
}

/** 七个试点固定调色 — 黑白简约风灰阶区分 */
export const PILOT_DOT_COLORS = [
  '#1f1f1f',
  '#666666',
  '#999999',
  '#c2c2c2',
  '#525252',
  '#404040',
  '#e9e9e9',
];

type Labels = {
  title: string;
  prev: string;
  next: string;
  weekdays: string;
  legend: string;
};

export function CompetitiveIgCalendar({
  pilotOrder,
  postsByUsername,
  selectedLower,
  dateFrom,
  dateTo,
  monthY,
  monthM,
  onPrevMonth,
  onNextMonth,
  labels,
  language,
}: {
  pilotOrder: string[];
  postsByUsername: Record<string, Array<Record<string, unknown>>>;
  selectedLower: Record<string, boolean>;
  dateFrom: string;
  dateTo: string;
  monthY: number;
  monthM: number;
  onPrevMonth: () => void;
  onNextMonth: () => void;
  labels: Labels;
  language: 'en' | 'zh';
}) {
  const weekdayLabels =
    language === 'zh' ? ['日', '一', '二', '三', '四', '五', '六'] : ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const originalDatesByPilot = new Map<string, Set<string>>();
  for (let i = 0; i < pilotOrder.length; i++) {
    const ph = pilotOrder[i];
    const key = ph.toLowerCase();
    if (selectedLower[key] === false) continue;
    const posts = getBucket(postsByUsername, ph);
    const set = new Set<string>();
    for (const row of posts) {
      const kind = (row.postKind as string) || 'original';
      if (kind !== 'original') continue;
      const ts = row.timestamp ? String(row.timestamp) : '';
      if (!ts) continue;
      if (!passesDateFilter(ts, dateFrom, dateTo)) continue;
      set.add(formatLocalYmd(new Date(ts).getTime()));
    }
    originalDatesByPilot.set(key, set);
  }

  const first = new Date(monthY, monthM, 1);
  const pad = first.getDay();
  const daysInMonth = new Date(monthY, monthM + 1, 0).getDate();
  const cells: (number | null)[] = [...Array(pad).fill(null)];
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);
  while (cells.length % 7 !== 0) cells.push(null);

  const monthTitle =
    language === 'zh'
      ? `${monthY}年${monthM + 1}月`
      : new Date(monthY, monthM, 1).toLocaleString('en-US', { month: 'long', year: 'numeric' });

  const dotsForDay = (day: number | null): { color: string; key: string }[] => {
    if (day === null) return [];
    const t = new Date(monthY, monthM, day).getTime();
    const ymd = formatLocalYmd(t);
    const out: { color: string; key: string }[] = [];
    pilotOrder.forEach((ph, idx) => {
      const key = ph.toLowerCase();
      if (selectedLower[key] === false) return;
      const set = originalDatesByPilot.get(key);
      if (set?.has(ymd)) {
        out.push({ color: PILOT_DOT_COLORS[idx % PILOT_DOT_COLORS.length], key });
      }
    });
    return out;
  };

  const visiblePilots = pilotOrder.filter((ph) => selectedLower[ph.toLowerCase()] !== false);

  return (
    <div className="rounded-xl border border-stone-200 bg-white p-4 shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-stone-800">{labels.title}</h3>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onPrevMonth}
            className="px-2 py-1 text-xs rounded-md border border-stone-300 bg-white hover:bg-stone-50 text-stone-700"
          >
            {labels.prev}
          </button>
          <span className="text-sm font-medium text-stone-800 min-w-[8rem] text-center">{monthTitle}</span>
          <button
            type="button"
            onClick={onNextMonth}
            className="px-2 py-1 text-xs rounded-md border border-stone-300 bg-white hover:bg-stone-50 text-stone-700"
          >
            {labels.next}
          </button>
        </div>
      </div>
      <p className="text-xs text-stone-500 mb-2">{labels.weekdays}</p>
      <div className="grid grid-cols-7 gap-1 text-center text-xs">
        {weekdayLabels.map((w) => (
          <div key={w} className="py-1 text-stone-500 font-medium">
            {w}
          </div>
        ))}
        {cells.map((day, i) => {
          const dots = dotsForDay(day);
          return (
            <div
              key={`c-${i}`}
              className={`min-h-[3rem] rounded-lg border border-stone-100 p-1 flex flex-col items-center justify-start ${
                day === null ? 'bg-stone-50/50' : 'bg-stone-50/30'
              }`}
            >
              {day !== null ? (
                <>
                  <span className="text-stone-800 font-medium">{day}</span>
                  <div className="flex flex-wrap gap-0.5 justify-center mt-0.5 max-w-full">
                    {dots.map((d) => (
                      <span
                        key={d.key}
                        title={`@${d.key}`}
                        className="inline-block w-2 h-2 rounded-full shrink-0"
                        style={{ backgroundColor: d.color }}
                      />
                    ))}
                  </div>
                </>
              ) : null}
            </div>
          );
        })}
      </div>
      <div className="mt-4 pt-3 border-t border-stone-100">
        <p className="text-xs font-medium text-stone-600 mb-2">{labels.legend}</p>
        <div className="flex flex-wrap gap-x-4 gap-y-2">
          {visiblePilots.map((ph, idx) => {
            const i = pilotOrder.findIndex((p) => p.toLowerCase() === ph.toLowerCase());
            const color = PILOT_DOT_COLORS[(i >= 0 ? i : idx) % PILOT_DOT_COLORS.length];
            return (
              <div key={ph} className="flex items-center gap-1.5 text-xs text-stone-700">
                <span className="inline-block w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: color }} />
                @{ph}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
