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
  
  const gradientMap = {
    blue: 'from-blue/10 to-blue/5',
    green: 'from-green/10 to-green/5',
    yellow: 'from-yellow/10 to-yellow/5',
    red: 'from-red/10 to-red/5',
    default: 'from-blue/10 to-blue/5'
  };
  
  const gradient = gradientMap[cardColor];
  
  return (
    <div className={`bg-gradient-to-br ${gradient} dark:bg-gray-900 rounded-xl shadow-md overflow-hidden border border-gray-100 dark:border-gray-800 hover:shadow-lg transition-all duration-300`}>
      <div className="p-6 relative">
        <div className="absolute top-4 right-4">
          <div className={`w-10 h-10 rounded-lg ${iconColor} flex items-center justify-center bg-white dark:bg-gray-800 shadow-sm`}>
            {icon}
          </div>
        </div>
        
        <h2 className="text-xl font-homenaje uppercase mb-5 text-gray-800 dark:text-gray-200">{title}</h2>
        
        <div className="grid grid-cols-2 gap-4 mt-6">
          <div className="p-3 rounded-lg bg-white dark:bg-gray-800 shadow-sm">
            <p className="text-gray-500 dark:text-gray-400 text-sm mb-1">{stat1.label}</p>
            <p className={`text-2xl font-bold ${stat1Color}`}>{stat1.value}</p>
          </div>
          <div className="p-3 rounded-lg bg-white dark:bg-gray-800 shadow-sm">
            <p className="text-gray-500 dark:text-gray-400 text-sm mb-1">{stat2.label}</p>
            <p className={`text-2xl font-bold ${stat2Color}`}>{stat2.value}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatCard;
