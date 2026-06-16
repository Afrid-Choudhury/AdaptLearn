import { Link } from 'react-router-dom';
import { Target, TrendingUp, Clock, Users, Award, CheckCircle, ArrowRight } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import FloatingShapes from '../components/decorations/FloatingShapes';
import DotGrid from '../components/decorations/DotGrid';
import SquiggleUnderline from '../components/decorations/SquiggleUnderline';
import Card from '../components/ui/Card';
import IconCircle from '../components/ui/IconCircle';

export default function Home() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-cream">
      <Navbar variant="public" />

      <section className="relative pt-20 pb-28 px-4 overflow-hidden">
        <DotGrid className="opacity-30" />
        <FloatingShapes variant="hero" />

        <div className="max-w-6xl mx-auto relative z-10">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="font-heading text-5xl md:text-6xl font-extrabold text-foreground mb-2 leading-tight">
              Master Java with
            </h1>
            <div className="inline-block mb-6">
              <span className="font-heading text-5xl md:text-6xl font-extrabold text-accent">
                Adaptive Learning
              </span>
              <SquiggleUnderline width={320} className="mx-auto mt-1" />
            </div>
            <p className="text-lg text-slate-600 font-body mb-10 leading-relaxed max-w-2xl mx-auto">
              Take a quick assessment and receive a personalized learning path tailored to your skill level.
              Progress at your own pace with courses designed just for you.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/assessment"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full font-bold text-lg text-white bg-accent border-2 border-foreground shadow-pop hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-pop-hover active:translate-x-0.5 active:translate-y-0.5 active:shadow-pop-active transition-all duration-300 ease-bounce"
              >
                Take Free Assessment
                <span className="w-7 h-7 bg-white rounded-full flex items-center justify-center">
                  <ArrowRight className="w-4 h-4 text-accent" strokeWidth={2.5} />
                </span>
              </Link>
              {!user && (
                <Link
                  to="/signup"
                  className="inline-flex items-center justify-center px-8 py-4 rounded-full font-bold text-lg text-foreground bg-transparent border-2 border-foreground hover:bg-tertiary transition-all duration-300 ease-bounce"
                >
                  Create Account
                </Link>
              )}
            </div>
          </div>

          <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card hoverEffect className="p-6 text-center">
              <IconCircle color="accent" size="sm" className="mx-auto mb-4">
                <Users className="w-5 h-5" strokeWidth={2.5} />
              </IconCircle>
              <div className="text-3xl font-heading font-bold text-foreground mb-1">29,600+</div>
              <div className="text-slate-500 font-body">Active Learners</div>
            </Card>
            <Card hoverEffect className="p-6 text-center shadow-pop-yellow">
              <IconCircle color="tertiary" size="sm" className="mx-auto mb-4">
                <Award className="w-5 h-5" strokeWidth={2.5} />
              </IconCircle>
              <div className="text-3xl font-heading font-bold text-foreground mb-1">4.8/5</div>
              <div className="text-slate-500 font-body">Average Rating</div>
            </Card>
            <Card hoverEffect className="p-6 text-center shadow-pop-green">
              <IconCircle color="quaternary" size="sm" className="mx-auto mb-4">
                <CheckCircle className="w-5 h-5" strokeWidth={2.5} />
              </IconCircle>
              <div className="text-3xl font-heading font-bold text-foreground mb-1">94%</div>
              <div className="text-slate-500 font-body">Completion Rate</div>
            </Card>
          </div>
        </div>
      </section>

      <section className="py-24 px-4 relative overflow-hidden">
        <FloatingShapes variant="section" />
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="text-center mb-16">
            <h2 className="font-heading text-4xl font-bold text-foreground mb-2">Why Choose AdaptLearn?</h2>
            <SquiggleUnderline width={240} color="#F472B6" className="mx-auto mt-2 mb-4" />
            <p className="text-lg text-slate-600 font-body">Experience personalized learning that adapts to you</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="p-8 relative pt-12">
              <IconCircle color="accent" size="md" className="absolute -top-7 left-8">
                <Target className="w-7 h-7" strokeWidth={2.5} />
              </IconCircle>
              <h3 className="font-heading text-xl font-bold text-accent mb-3">Adaptive Learning</h3>
              <p className="text-slate-600 font-body leading-relaxed">
                Our intelligent assessment analyzes your skills and creates a customized learning path
                that matches your current level and goals.
              </p>
            </Card>

            <Card className="p-8 relative pt-12 shadow-pop-pink">
              <IconCircle color="secondary" size="md" className="absolute -top-7 left-8">
                <TrendingUp className="w-7 h-7" strokeWidth={2.5} />
              </IconCircle>
              <h3 className="font-heading text-xl font-bold text-secondary mb-3">Track Your Progress</h3>
              <p className="text-slate-600 font-body leading-relaxed">
                Monitor your learning journey with detailed progress tracking, time analytics, and
                achievement badges as you master new concepts.
              </p>
            </Card>

            <Card className="p-8 relative pt-12 shadow-pop-yellow">
              <IconCircle color="tertiary" size="md" className="absolute -top-7 left-8">
                <Clock className="w-7 h-7" strokeWidth={2.5} />
              </IconCircle>
              <h3 className="font-heading text-xl font-bold text-amber-600 mb-3">Learn at Your Pace</h3>
              <p className="text-slate-600 font-body leading-relaxed">
                No pressure, no deadlines. Study when it works for you with lifetime access to
                all course materials and resources.
              </p>
            </Card>
          </div>
        </div>
      </section>

      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto bg-accent border-2 border-foreground rounded-2xl shadow-pop p-12 text-center relative overflow-hidden">
          <div aria-hidden="true" className="absolute top-4 right-8 w-20 h-20 bg-white/10 rounded-full" />
          <div aria-hidden="true" className="absolute bottom-4 left-8 w-14 h-14 bg-tertiary/20 rounded-full" />
          <div className="relative z-10">
            <h2 className="font-heading text-4xl font-bold text-white mb-4">Ready to Start Your Java Journey?</h2>
            <p className="text-lg text-white/80 font-body mb-8">
              Take a 5-minute assessment to discover your skill level and get personalized course recommendations.
            </p>
            <Link
              to="/assessment"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-full font-bold text-lg text-accent bg-white border-2 border-foreground shadow-pop hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-pop-hover active:translate-x-0.5 active:translate-y-0.5 active:shadow-pop-active transition-all duration-300 ease-bounce"
            >
              Start Assessment Now
              <ArrowRight className="w-5 h-5" strokeWidth={2.5} />
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
