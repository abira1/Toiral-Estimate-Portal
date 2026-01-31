import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Mail, Monitor, PartyPopper, Sparkles, AlertCircle } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Card } from '../components/ui/Card';
import { StarDoodle } from '../components/doodles/StarDoodle';
import { SpringDoodle } from '../components/doodles/SpringDoodle';
import { ScribbleDoodle } from '../components/doodles/ScribbleDoodle';
import { useAuth } from '../contexts/AuthContext';
type JourneyStep = {
  icon: React.ReactNode;
  label: string;
  description: string;
  color: string;
  bgColor: string;
};
const journeySteps: JourneyStep[] = [
{
  icon: <Mail className="w-8 h-8" />,
  label: 'Receive Code',
  description: 'Get your unique access code',
  color: 'text-toiral-primary',
  bgColor: 'bg-toiral-light/40'
},
{
  icon: <Monitor className="w-8 h-8" />,
  label: 'Track Progress',
  description: 'View real-time project updates',
  color: 'text-toiral-secondary',
  bgColor: 'bg-orange-100'
},
{
  icon: <PartyPopper className="w-8 h-8" />,
  label: 'Celebrate Success',
  description: 'See your project come to life',
  color: 'text-amber-500',
  bgColor: 'bg-amber-100'
}];

function JourneyIllustration() {
  return (
    <div className="relative w-full max-w-md mx-auto py-8">
      {/* Connecting Path - Dotted Line */}
      <svg
        className="absolute left-1/2 top-0 h-full w-4 -translate-x-1/2 z-0"
        viewBox="0 0 16 400"
        fill="none"
        preserveAspectRatio="none">

        <motion.path
          d="M8 20 Q8 100, 8 130 Q8 160, 8 200 Q8 240, 8 270 Q8 300, 8 380"
          stroke="#149499"
          strokeWidth="2"
          strokeDasharray="8 8"
          strokeLinecap="round"
          initial={{
            pathLength: 0,
            opacity: 0
          }}
          animate={{
            pathLength: 1,
            opacity: 0.4
          }}
          transition={{
            duration: 1.5,
            delay: 0.5,
            ease: 'easeInOut'
          }} />

      </svg>

      {/* Journey Steps */}
      <div className="relative z-10 space-y-12">
        {journeySteps.map((step, index) =>
        <motion.div
          key={step.label}
          initial={{
            opacity: 0,
            x: index % 2 === 0 ? -30 : 30
          }}
          animate={{
            opacity: 1,
            x: 0
          }}
          transition={{
            duration: 0.6,
            delay: 0.2 + index * 0.25,
            ease: 'easeOut'
          }}
          className={`flex items-center gap-4 ${index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'}`}>

            {/* Icon Circle with Float Animation */}
            <motion.div
            animate={{
              y: [0, -6, 0]
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              delay: index * 0.3,
              ease: 'easeInOut'
            }}
            className={`relative flex-shrink-0 w-20 h-20 rounded-3xl ${step.bgColor} ${step.color} flex items-center justify-center shadow-lg`}>

              {step.icon}

              {/* Small decorative dot */}
              <motion.div
              animate={{
                scale: [1, 1.2, 1]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                delay: index * 0.2
              }}
              className={`absolute -top-1 -right-1 w-3 h-3 rounded-full ${step.color.replace('text-', 'bg-')}`} />

            </motion.div>

            {/* Text Content */}
            <div className={`${index % 2 === 0 ? 'text-left' : 'text-right'}`}>
              <h3 className="font-bold text-toiral-dark text-lg">
                {step.label}
              </h3>
              <p className="text-gray-500 text-sm mt-0.5">{step.description}</p>
            </div>
          </motion.div>
        )}
      </div>

      {/* Decorative Doodles */}
      <motion.div
        animate={{
          rotate: [0, 10, 0]
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: 'easeInOut'
        }}
        className="absolute top-4 right-4">

        <StarDoodle size={32} className="text-toiral-secondary" />
      </motion.div>

      <motion.div
        animate={{
          rotate: [0, -8, 0],
          scale: [1, 1.05, 1]
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: 'easeInOut'
        }}
        className="absolute top-1/3 left-0">

        <SpringDoodle size={40} />
      </motion.div>

      <motion.div
        animate={{
          rotate: [0, 5, 0]
        }}
        transition={{
          duration: 7,
          repeat: Infinity,
          ease: 'easeInOut'
        }}
        className="absolute bottom-8 right-8">

        <StarDoodle size={24} className="text-amber-400" />
      </motion.div>

      <motion.div
        animate={{
          scale: [1, 1.1, 1]
        }}
        transition={{
          duration: 5,
          repeat: Infinity,
          ease: 'easeInOut'
        }}
        className="absolute bottom-1/4 left-4">

        <StarDoodle size={20} className="text-toiral-primary/60" />
      </motion.div>
    </div>);

}
export function Landing() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [accessCode, setAccessCode] = useState('');
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      navigate('/client/dashboard');
    }, 1500);
  };
  return (
    <div className="min-h-screen bg-toiral-bg flex flex-col lg:flex-row overflow-hidden">
      {/* Left Side - Illustrated Journey */}
      <div className="lg:w-1/2 p-6 sm:p-8 lg:p-12 flex flex-col justify-center relative overflow-hidden">
        {/* Background Decoration */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-64 h-64 bg-toiral-primary/5 rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-10 w-48 h-48 bg-toiral-secondary/5 rounded-full blur-3xl" />
        </div>

        <motion.div
          initial={{
            opacity: 0,
            y: 20
          }}
          animate={{
            opacity: 1,
            y: 0
          }}
          transition={{
            duration: 0.6
          }}
          className="relative z-10">

          {/* Header Badge */}
          <motion.div
            initial={{
              opacity: 0,
              scale: 0.9
            }}
            animate={{
              opacity: 1,
              scale: 1
            }}
            transition={{
              duration: 0.5,
              delay: 0.1
            }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-sm mb-6">

            <Sparkles className="w-4 h-4 text-toiral-primary" />
            <span className="text-sm font-medium text-toiral-dark">
              Your Project Journey
            </span>
          </motion.div>

          {/* Main Heading */}
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-toiral-dark mb-4 leading-tight">
            Track your project{' '}
            <span className="relative inline-block text-toiral-primary">
              every step
              <ScribbleDoodle
                className="absolute -bottom-1 left-0 w-full"
                color="#149499" />

            </span>{' '}
            of the way
          </h1>

          <p className="text-gray-600 text-base sm:text-lg mb-8 max-w-md">
            From kickoff to launch, stay connected with real-time updates on
            your project's progress.
          </p>

          {/* Journey Illustration */}
          <JourneyIllustration />
        </motion.div>
      </div>

      {/* Right Side - Login Form */}
      <div className="lg:w-1/2 bg-white/60 backdrop-blur-sm p-6 sm:p-8 lg:p-12 flex flex-col justify-center relative border-t lg:border-t-0 lg:border-l border-gray-100">
        <motion.div
          initial={{
            opacity: 0,
            x: 20
          }}
          animate={{
            opacity: 1,
            x: 0
          }}
          transition={{
            duration: 0.6,
            delay: 0.8
          }}
          className="max-w-sm mx-auto w-full">

          <Card className="bg-white shadow-xl border-0 p-8">
            {/* Form Header */}
            <div className="text-center mb-8">
              <motion.div
                initial={{
                  scale: 0
                }}
                animate={{
                  scale: 1
                }}
                transition={{
                  type: 'spring',
                  stiffness: 200,
                  delay: 1
                }}
                className="w-16 h-16 bg-toiral-light/30 rounded-2xl flex items-center justify-center mx-auto mb-4">

                <Mail className="w-8 h-8 text-toiral-primary" />
              </motion.div>

              <h2 className="text-2xl font-bold text-toiral-dark">
                Access Your Project
              </h2>
              <p className="text-gray-500 mt-2 text-sm">
                Enter your unique code to view real-time progress
              </p>
            </div>

            {/* Login Form */}
            <form onSubmit={handleLogin} className="space-y-6">
              <div>
                <Input
                  label="Access Code"
                  placeholder="PRJ-2024-XYZ"
                  value={accessCode}
                  onChange={(e) => setAccessCode(e.target.value)}
                  className="text-center text-lg tracking-wider font-mono" />

                <p className="text-xs text-gray-400 mt-2 text-center">
                  Check your email for your unique project code
                </p>
              </div>

              <Button
                type="submit"
                className="w-full"
                size="lg"
                loading={loading}>

                View My Project
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </form>

            {/* Help Link */}
            <p className="text-center mt-6 text-sm text-gray-500">
              Can't find your code?{' '}
              <button className="text-toiral-primary font-medium hover:underline">
                Contact support
              </button>
            </p>
          </Card>

          {/* Footer */}
          <p className="text-center mt-8 text-xs text-gray-400">
            © 2024 Toiral Estimate. All rights reserved.
          </p>
        </motion.div>
      </div>
    </div>);

}