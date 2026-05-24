import TotalStat from './TotalStat';
import PBStat from './PBStat';

const DashboardStats = () => {
  return (
    <div className="mb-6 w-full overflow-hidden rounded-card border border-line bg-card shadow-sm">
      <div className="flex flex-col md:flex-row">
        <div className="flex-1">
          <TotalStat />
        </div>
        <div className="hidden w-px bg-line md:block" />
        <div className="flex-1">
          <PBStat />
        </div>
      </div>
    </div>
  );
};

export default DashboardStats;
