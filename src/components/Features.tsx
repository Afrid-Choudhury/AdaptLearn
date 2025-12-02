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

function FeatureCard({
  title,
  description,
  icon,
  gradientFrom,
  gradientTo,
  iconColor,
  borderColor
}: FeatureCardProps) {
  return (
    <div className={`relative group overflow-hidden rounded-3xl p-8 border ${borderColor} bg-[#151925] transition-all duration-300 hover:shadow-2xl hover:-translate-y-1`}>
      <div className={`absolute inset-0 bg-gradient-to-b ${gradientFrom} ${gradientTo} opacity-10 group-hover:opacity-20 transition-opacity`} />

      <div className="relative z-10 flex flex-col items-center text-center h-full">
        <div className={`mb-6 p-4 rounded-full bg-[#1E2332] ${iconColor} shadow-lg ring-1 ring-white/5`}>
          {icon}
        </div>

        <h3 className="text-xl font-bold mb-3 text-white">{title}</h3>
        <p className="text-gray-400 text-sm leading-relaxed max-w-xs">
          {description}
        </p>
      </div>
    </div>
  );
}

export default function Features() {
  return (
    <section className="max-w-6xl mx-auto w-full">
      <h2 className="text-2xl md:text-3xl font-bold text-center mb-12">Why Choose AdaptLearn?</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <FeatureCard
          title="Adaptive Learning"
          description="Our intelligent assessment analyzes your skills and creates a customized learning path that matches your current level and goals."
          icon={<Compass size={40} strokeWidth={1.5} />}
          gradientFrom="from-blue-900"
          gradientTo="to-transparent"
          iconColor="text-blue-400"
          borderColor="border-blue-900/30"
        />

        <FeatureCard
          title="Track Your Progress"
          description="Monitor your learning journey with detailed progress tracking, time analytics, and achievement badges as you master new concepts."
          icon={<LineChart size={40} strokeWidth={1.5} />}
          gradientFrom="from-emerald-900"
          gradientTo="to-transparent"
          iconColor="text-emerald-400"
          borderColor="border-emerald-900/30"
        />

        <FeatureCard
          title="Learn at Your Pace"
          description="No pressure, no deadlines. Study when it works for you with lifetime access to all course materials and resources."
          icon={<Clock size={40} strokeWidth={1.5} />}
          gradientFrom="from-purple-900"
          gradientTo="to-transparent"
          iconColor="text-purple-400"
          borderColor="border-purple-900/30"
        />
      </div>
    </section>
  );
}