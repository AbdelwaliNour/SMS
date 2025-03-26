import { ReactNode } from 'react';

interface StatCardProps {
  title: string;
  icon: ReactNode;
  stat1: {
    label: string;
    value: number | string;
  };
  stat2: {
    label: string;
    value: number | string;
  };
}

const StatCard = ({ title, icon, stat1, stat2 }: StatCardProps) => {
  return (
    <div className="bg-white dark:bg-gray-900 rounded-lg shadow overflow-hidden">
      <div className="p-5">
        <div className="flex items-center justify-center mb-4">
          <div className="w-16 h-16 rounded-full border-2 border-blue flex items-center justify-center">
            {icon}
          </div>
        </div>
        <h2 className="text-xl font-homenaje text-center uppercase mb-4 text-gray-800 dark:text-gray-200">{title}</h2>
        <div className="flex justify-between">
          <div className="text-center">
            <p className="text-gray-500 dark:text-gray-400 text-sm mb-1">{stat1.label}</p>
            <p className="text-xl font-bold text-gray-800 dark:text-gray-200">{stat1.value}</p>
          </div>
          <div className="text-center">
            <p className="text-gray-500 dark:text-gray-400 text-sm mb-1">{stat2.label}</p>
            <p className="text-xl font-bold text-gray-800 dark:text-gray-200">{stat2.value}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatCard;
