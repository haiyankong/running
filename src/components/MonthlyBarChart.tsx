import { Activity } from '@/utils/utils';
import { useMemo } from 'react';

const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

const MonthlyBarChart = ({ runs, year }: { runs: Activity[]; year: string }) => {
  const { totals, max } = useMemo(() => {
    const arr = new Array(12).fill(0);
    runs.forEach((r) => {
      if (!r.start_date_local) return;
      const m = Number(r.start_date_local.slice(5, 7)) - 1;
      if (m >= 0 && m < 12) {
        const d = r.distance || 0;
        const km = d > 200 ? d / 1000 : d;
        arr[m] += km;
      }
    });
    const mx = Math.max(1, ...arr);
    return { totals: arr, max: mx };
  }, [runs]);

  return (
    <div className="rounded-card border border-line bg-card p-4 shadow-sm">
      <div className="mb-3 flex items-center justify-between">
        <div className="text-xs font-black uppercase text-secondary">Monthly KM</div>
        <div className="text-xs font-bold text-secondary">{year}</div>
      </div>
      <div className="flex h-24 items-end gap-2">
        {totals.map((v, i) => {
          const h = `${Math.round((v / max) * 100)}%`;
          return (
            <div key={months[i]} className="flex h-full flex-1 flex-col items-center gap-1">
              <div className="flex w-full flex-1 items-end">
                <div
                  className="w-full rounded-t bg-gradient-to-t from-route to-mint"
                  style={{ height: h, minHeight: v > 0 ? '4px' : 0 }}
                  title={`${months[i]}: ${v.toFixed(1)} km`}
                />
              </div>
              <div className="text-[10px] font-semibold text-secondary">{months[i]}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MonthlyBarChart;
