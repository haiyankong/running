import useActivities from '@/hooks/useActivities';
import { formatPace, convertMovingTime2Sec } from '@/utils/utils';
import CyclingText from '@/components/CyclingText';

const TotalStat = () => {
  const { activities } = useActivities();
  const runs = activities.filter((run) => run.type === 'Run');

  let sumDistance = 0;
  let totalSeconds = 0;
  let heartRateSum = 0;
  let heartRateCount = 0;
  let totalMetersAvail = 0;
  let totalSecondsAvail = 0;
  let minTime = Infinity;
  let maxTime = 0;
  let maxDistance = 0;
  let minDistance = runs.length > 0 ? Infinity : 0;

  runs.forEach((run) => {
    const dist = run.distance / 1000;
    sumDistance += dist;

    totalSeconds += convertMovingTime2Sec(run.moving_time);

    if (run.average_heartrate) {
      heartRateSum += run.average_heartrate;
      heartRateCount++;
    }

    if (run.average_speed) {
      totalMetersAvail += run.distance;
      totalSecondsAvail += run.distance / run.average_speed;
    }

    const runDate = new Date(run.start_date_local.replace(' ', 'T')).getTime();
    if (runDate < minTime) minTime = runDate;
    if (runDate > maxTime) maxTime = runDate;

    if (dist > maxDistance) maxDistance = dist;
    if (dist < minDistance) minDistance = dist;
  });

  const totalKm = sumDistance.toFixed(1);
  const totalHours = (totalSeconds / 3600).toFixed(2);

  const avgPace = totalSecondsAvail > 0 ? formatPace(totalMetersAvail / totalSecondsAvail) : "0'00\"";
  const avgHeartRate = heartRateCount > 0 ? (heartRateSum / heartRateCount).toFixed(0) : '0';

  let weeks = 1;
  if (minTime !== Infinity && maxTime !== 0 && maxTime >= minTime) {
    weeks = Math.max(1, (maxTime - minTime) / (1000 * 60 * 60 * 24 * 7));
  }
  const avgWeeklyKm = (sumDistance / weeks).toFixed(1);

  const maxDistStr = maxDistance.toFixed(0);
  const maxRoundedKm = Number(maxDistStr);
  const maxCount = runs.reduce((acc, run) => {
    const distKm = run.distance / 1000;
    return acc + (Math.round(distKm) === maxRoundedKm ? 1 : 0);
  }, 0);

  return (
    <div className="relative grid w-full grid-cols-1 gap-6 p-5 font-sans sm:p-6 md:grid-cols-3">
      {/* Summary */}
      <div className="relative flex flex-col gap-2 md:after:absolute md:after:-right-3 md:after:top-[10%] md:after:h-[80%] md:after:w-px md:after:bg-gradient-to-b md:after:from-transparent md:after:via-line md:after:to-transparent md:after:content-['']">
        <span className="flex items-center gap-2 text-xs font-black uppercase text-secondary">
          <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="#1877F2" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="4" y1="21" x2="4" y2="10" />
            <line x1="10" y1="21" x2="10" y2="3" />
            <line x1="16" y1="21" x2="16" y2="6" />
          </svg>
          Summary
        </span>
        <div className="bg-gradient-to-r from-route to-mint bg-clip-text text-[32px] font-black leading-[1.1] text-transparent">
          <CyclingText text={totalKm} hoverPlay={true} interval={50} />
          <span className="ml-1 text-base font-bold text-secondary">km</span>
        </div>
        <div className="text-xs font-semibold text-secondary">
          {runs.length} runs / {totalHours} hours
        </div>
      </div>

      {/* Avg */}
      <div className="relative flex flex-col gap-2 md:after:absolute md:after:-right-3 md:after:top-[10%] md:after:h-[80%] md:after:w-px md:after:bg-gradient-to-b md:after:from-transparent md:after:via-line md:after:to-transparent md:after:content-['']">
        <span className="flex items-center gap-2 text-xs font-black uppercase text-secondary">
          <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="#F2B84B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="9" />
            <path d="M12 7v5l3 3" />
          </svg>
          Avg
        </span>
        <div className="bg-gradient-to-r from-route to-mint bg-clip-text text-[32px] font-black leading-[1.1] text-transparent">
          <CyclingText text={avgPace} hoverPlay={true} interval={50} />
          <span className="ml-1 text-base font-bold text-secondary">/km</span>
        </div>
        <div className="whitespace-nowrap text-xs font-semibold text-secondary">
          {avgHeartRate} bpm / {avgWeeklyKm} weekly km
        </div>
      </div>

      {/* Max */}
      <div className="flex flex-col gap-2">
        <span className="flex items-center gap-2 text-xs font-black uppercase text-secondary">
          <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="#F05A3E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 19V5" />
            <path d="M5 12l7-7 7 7" />
          </svg>
          Max
        </span>
        <div className="bg-gradient-to-r from-route to-mint bg-clip-text text-[32px] font-black leading-[1.1] text-transparent">
          <CyclingText text={maxDistStr} hoverPlay={true} interval={50} />
          <span className="ml-1 text-base font-bold text-secondary">km</span>
        </div>
        <div className="text-xs font-semibold text-secondary">
          {maxCount} runs
        </div>
      </div>
    </div>
  );
};

export default TotalStat;
