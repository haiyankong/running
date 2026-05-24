import useActivities from '@/hooks/useActivities';
import { formatPace } from '@/utils/utils';
import CyclingText from '@/components/CyclingText';

const PBStat = () => {
  const { activities } = useActivities();
  const runs = activities.filter((run) => run.type === 'Run');

  const formatSeconds = (s: number) => {
    const h = Math.floor(s / 3600);
    const m = Math.floor((s % 3600) / 60);
    const sec = Math.round(s % 60);
    const mm = m < 10 && h > 0 ? `0${m}` : `${m}`;
    const ss = sec < 10 ? `0${sec}` : `${sec}`;
    return h > 0 ? `${h}:${mm}:${ss}` : `${m}:${ss}`;
  };

  const getPB = (targetMeters: number) => {
    let bestSeconds = Infinity;
    let bestPace = '';
    let bestDate = '';
    runs.forEach((run) => {
      if (run.average_speed && run.distance >= targetMeters) {
        const seconds = targetMeters / run.average_speed;
        if (seconds < bestSeconds) {
          bestSeconds = seconds;
          bestPace = formatPace(run.average_speed);
          bestDate = run.start_date_local.split(' ')[0];
        }
      }
    });
    return bestSeconds === Infinity
      ? { pace: '--', time: '--', date: '' }
      : { pace: bestPace, time: formatSeconds(bestSeconds), date: bestDate };
  };

  const pb5 = getPB(5000);
  const pb10 = getPB(10000);
  const pb15 = getPB(15000);

  return (
    <div className="w-full p-5 font-sans sm:p-6">
      <div className="mb-4 flex items-center gap-2 text-xs font-black uppercase text-secondary">
        <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="#F2B84B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 2l3 7h7l-5.5 4 2 7-6.5-4-6.5 4 2-7L2 9h7z" />
        </svg>
        PB
      </div>
      <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
        {[{ label: '5K', pb: pb5 }, { label: '10K', pb: pb10 }, { label: '15K', pb: pb15 }].map(({ label, pb }) => (
          <div key={label} className="flex flex-col gap-1">
            <span className="flex items-center gap-2 text-xs font-black uppercase text-secondary">
              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="#1877F2" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 4v16" />
                <path d="M4 4h10l-2 3 2 3H4" />
              </svg>
              {label}
            </span>
            <div className="bg-gradient-to-r from-route to-mint bg-clip-text text-[28px] font-black leading-[1.1] text-transparent">
              <CyclingText text={pb.pace} hoverPlay={true} interval={50} />
              <span className="ml-1 text-base font-bold text-secondary">/km</span>
            </div>
            <div className="text-xs font-semibold text-secondary">
              {pb.time}{pb.date ? ` · ${pb.date}` : ''}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PBStat;
