import { BookOpen } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-cream border-t-2 border-foreground py-12 px-4 relative overflow-hidden">
      <div aria-hidden="true" className="pointer-events-none absolute top-4 right-8 w-12 h-12 bg-tertiary/20 rounded-full hidden md:block" />
      <div aria-hidden="true" className="pointer-events-none absolute bottom-4 left-12 w-8 h-8 bg-secondary/20 rounded-full hidden md:block" />

      <div className="max-w-6xl mx-auto text-center relative z-10">
        <div className="flex items-center justify-center gap-2 mb-4">
          <div className="w-8 h-8 bg-accent rounded-full border-2 border-foreground flex items-center justify-center">
            <BookOpen className="w-4 h-4 text-white" strokeWidth={2.5} />
          </div>
          <span className="text-lg font-heading font-bold text-foreground">AdaptLearn</span>
        </div>
        <p className="text-slate-500 font-body mb-4">Empowering developers to master Java programming</p>
        <p className="text-sm text-slate-400">&copy; 2025 AdaptLearn. All rights reserved.</p>
      </div>
    </footer>
  );
}
