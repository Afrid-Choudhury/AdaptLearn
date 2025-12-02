import React from 'react';
import { Compass, Clock, LineChart } from 'lucide-react';

interface FeatureCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  gradientFrom: string;
  gradientTo: string;
  iconColor: string;
  borderColor: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ 
  title, 
  description, 
  icon, 
  gradientFrom, 
  gradientTo,
  iconColor,
  borderColor
}) => (
  <div className={`relative group overflow-hidden rounded-3xl p-8 border ${borderColor} bg-surface transition-all duration-300 hover:shadow-2xl hover:-translate-y-1`}>
    {/* Background Gradient */}
    <div className={`absolute inset-0 bg-gradient-to-b ${gradientFrom} ${gradientTo} opacity-10 group-hover:opacity-20 transition-opacity`} />
    
    {/* Content */}
    <div className="relative z-10 flex flex-col items-center text-center h-full">
      <div className={`mb-6 p-4 rounded-full bg-surfaceHighlight ${iconColor} shadow-lg ring-1 ring-white/5`}>
        {icon}
      </div>
      
      <h3 className="text-xl font-bold mb-3 text-white">{title}</h3>
      <p className="text-gray-400 text-sm leading-relaxed max-w-xs">
        {description}
      </p>
    </div>
  </div>
);

const Features: React.FC = () => {
  return (
    <section className="max-w-6xl mx-auto w-full">
      <h2 className="text-2xl md:text-3xl font-bold text-center mb-12">Why Choose AdaptLearn?</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <FeatureCard 
          title="Adaptive Learning"
          description="Adaptive learning online and personalized learning path tailored to your skill level."
          icon={<Compass size={40} strokeWidth={1.5} />}
          gradientFrom="from-blue-900"
          gradientTo="to-transparent"
          iconColor="text-blue-400"
          borderColor="border-blue-900/30"
        />
        
        <FeatureCard 
          title="Track Your Progress"
          description="Track your progress need progress to you study as well and calculate your progress."
          icon={<LineChart size={40} strokeWidth={1.5} />}
          gradientFrom="from-emerald-900"
          gradientTo="to-transparent"
          iconColor="text-emerald-400"
          borderColor="border-emerald-900/30"
        />
        
        <FeatureCard 
          title="Learn at Your Pace"
          description="Learn at your pace to moist, the faster-won on some statement learning stewanto."
          icon={<Clock size={40} strokeWidth={1.5} />}
          gradientFrom="from-purple-900"
          gradientTo="to-transparent"
          iconColor="text-purple-400"
          borderColor="border-purple-900/30"
        />
      </div>
    </section>
  );
};

export default Features;