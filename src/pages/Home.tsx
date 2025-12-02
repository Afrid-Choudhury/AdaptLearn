import Header from '../components/Header';
import Hero from '../components/Hero';
import Stats from '../components/Stats';
import Features from '../components/Features';

export default function Home() {
  return (
    <div className="min-h-screen bg-[#0B0E14] text-white selection:bg-[#8B5CF6] selection:text-white overflow-x-hidden">
      <div className="absolute top-0 left-0 w-full h-[600px] bg-gradient-to-b from-indigo-900/20 to-transparent pointer-events-none z-0" />

      <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[100px] pointer-events-none z-0"></div>
      <div className="absolute top-[20%] left-[-10%] w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none z-0"></div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Header />
        <main className="flex flex-col gap-16 md:gap-24 pb-20">
          <Hero />
          <Stats />
          <Features />
        </main>
      </div>

      <footer className="border-t border-[#1E2332] py-12 text-center text-gray-500 text-sm">
        <p>&copy; 2025 AdaptLearn. All rights reserved.</p>
      </footer>
    </div>
  );
}
