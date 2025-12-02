import React from 'react';
import { Users, Star, BarChart3 } from 'lucide-react';

interface StatCardProps {
  icon: React.ReactNode;
  iconBg: string;
  iconColor: string;
  value: string;
  label: string;
}

const StatCard: React.FC<StatCardProps> = ({ icon, iconBg, iconColor, value, label }) => (
  <div className="bg-surface border border-gray-800 p-5 rounded-2xl flex items-center gap-4 hover:border-gray-700 transition-colors shadow-xl">
    <div className={`w-12 h-12 ${iconBg} rounded-xl flex items-center justify-center shrink-0`}>
      <div className={iconColor}>{icon}</div>
    </div>
    <div>
      <div className="text-2xl font-bold text-white">{value}</div>
      <div className="text-sm text-gray-400 font-medium">{label}</div>
    </div>
  </div>
);

const Stats: React.FC = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto w-full -mt-4 relative z-20">
      <StatCard 
        icon={<Users size={24} />}
        iconBg="bg-blue-500/10"
        iconColor="text-blue-500"
        value="29,600+"
        label="Active Learners"
      />
      <StatCard 
        icon={<Star size={24} fill="currentColor" />}
        iconBg="bg-emerald-500/10"
        iconColor="text-emerald-500"
        value="4.8/5"
        label="Average Rating"
      />
      <StatCard 
        icon={<BarChart3 size={24} />}
        iconBg="bg-cyan-500/10"
        iconColor="text-cyan-500"
        value="94%"
        label="Completion Rate"
      />
    </div>
  );
};

export default Stats;