import { ReactNode } from 'react';

interface StatCardProps {
  title: string;
  icon: ReactNode;
  stat1: {
    label: string;
    value: number | string;
    color?: 'blue' | 'green' | 'yellow' | 'red' | 'default';
  };
  stat2: {
    label: string;
    value: number | string;
    color?: 'blue' | 'green' | 'yellow' | 'red' | 'default';
  };
  cardColor?: 'blue' | 'green' | 'yellow' | 'red' | 'default';
}

const StatCard = ({ 
  title, 
  icon, 
  stat1, 
  stat2, 
  cardColor = 'blue' 
}: StatCardProps) => {
  
  // Determine card border color
  const borderColorMap = {
    blue: 'border-blue',
    green: 'border-green',
    yellow: 'border-yellow',
    red: 'border-red',
    default: 'border-blue'
  };
  
  // Determine card icon color
  const iconColorMap = {
    blue: 'text-blue',
    green: 'text-green',
    yellow: 'text-yellow',
    red: 'text-red',
    default: 'text-blue'
  };
  
  // Determine stat value colors
  const statColorMap = {
    blue: 'text-blue',
    green: 'text-green',
    yellow: 'text-yellow',
    red: 'text-red',
    default: 'text-gray-800 dark:text-gray-200'
  };
  
  const borderColor = borderColorMap[cardColor];
  const iconColor = iconColorMap[cardColor];
  const stat1Color = statColorMap[stat1.color || 'default'];
  const stat2Color = statColorMap[stat2.color || 'default'];
  
  return (
    <div className="bg-white dark:bg-gray-900 rounded-lg shadow overflow-hidden border-t-4 border-t-blue">
      <div className="p-5">
        <div className="flex items-center justify-center mb-4">
          <div className={`w-16 h-16 rounded-full border-2 ${borderColor} flex items-center justify-center ${iconColor}`}>
            {icon}
          </div>
        </div>
        <h2 className="text-xl font-homenaje text-center uppercase mb-4 text-gray-800 dark:text-gray-200">{title}</h2>
        <div className="flex justify-between">
          <div className="text-center p-2 rounded-lg bg-gray-50 dark:bg-gray-800">
            <p className="text-gray-500 dark:text-gray-400 text-sm mb-1">{stat1.label}</p>
            <p className={`text-xl font-bold ${stat1Color}`}>{stat1.value}</p>
          </div>
          <div className="text-center p-2 rounded-lg bg-gray-50 dark:bg-gray-800">
            <p className="text-gray-500 dark:text-gray-400 text-sm mb-1">{stat2.label}</p>
            <p className={`text-xl font-bold ${stat2Color}`}>{stat2.value}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatCard;
