import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  GraduationCap, 
  Users, 
  School, 
  Calendar, 
  CreditCard, 
  BarChart3, 
  ChevronRight, 
  ChevronLeft,
  X,
  CheckCircle,
  Star,
  Sparkles
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface WelcomeWizardProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: () => void;
}

interface WizardStep {
  id: number;
  title: string;
  description: string;
  icon: React.ReactNode;
  features: string[];
  color: string;
  bgGradient: string;
}

const wizardSteps: WizardStep[] = [
  {
    id: 1,
    title: "Welcome to EduManager",
    description: "Your comprehensive education management platform",
    icon: <GraduationCap className="h-12 w-12" />,
    features: [
      "Modern, intuitive interface",
      "Complete student lifecycle management",
      "Real-time analytics and reporting",
      "Secure data management"
    ],
    color: "text-blue-600",
    bgGradient: "from-blue-500/10 to-purple-500/10"
  },
  {
    id: 2,
    title: "Student Management",
    description: "Effortlessly manage your student database",
    icon: <Users className="h-12 w-12" />,
    features: [
      "Add and edit student profiles",
      "Track academic progress",
      "Manage parent information",
      "Upload profile photos and documents"
    ],
    color: "text-green-600",
    bgGradient: "from-green-500/10 to-blue-500/10"
  },
  {
    id: 3,
    title: "Staff & Classrooms",
    description: "Organize your educational resources",
    icon: <School className="h-12 w-12" />,
    features: [
      "Employee profiles and roles",
      "Classroom allocation",
      "Teacher assignments",
      "Resource management"
    ],
    color: "text-purple-600",
    bgGradient: "from-purple-500/10 to-pink-500/10"
  },
  {
    id: 4,
    title: "Attendance & Finance",
    description: "Track attendance and manage payments",
    icon: <Calendar className="h-12 w-12" />,
    features: [
      "Daily attendance tracking",
      "Payment management",
      "Fee collection records",
      "Financial reporting"
    ],
    color: "text-orange-600",
    bgGradient: "from-orange-500/10 to-red-500/10"
  },
  {
    id: 5,
    title: "Analytics & Reports",
    description: "Gain insights with powerful analytics",
    icon: <BarChart3 className="h-12 w-12" />,
    features: [
      "Performance dashboards",
      "Attendance analytics",
      "Financial insights",
      "Custom report generation"
    ],
    color: "text-indigo-600",
    bgGradient: "from-indigo-500/10 to-purple-500/10"
  },
  {
    id: 6,
    title: "You're All Set!",
    description: "Ready to transform your education management",
    icon: <CheckCircle className="h-12 w-12" />,
    features: [
      "Start adding students and staff",
      "Explore the dashboard",
      "Set up your first classroom",
      "Begin tracking attendance"
    ],
    color: "text-emerald-600",
    bgGradient: "from-emerald-500/10 to-green-500/10"
  }
];

const WelcomeWizard: React.FC<WelcomeWizardProps> = ({ isOpen, onClose, onComplete }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [direction, setDirection] = useState(0);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const handleNext = () => {
    if (currentStep < wizardSteps.length - 1) {
      setDirection(1);
      setCurrentStep(currentStep + 1);
    } else {
      handleComplete();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setDirection(-1);
      setCurrentStep(currentStep - 1);
    }
  };

  const handleStepClick = (stepIndex: number) => {
    setDirection(stepIndex > currentStep ? 1 : -1);
    setCurrentStep(stepIndex);
  };

  const handleComplete = () => {
    onComplete();
    onClose();
  };

  const handleSkip = () => {
    onClose();
  };

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 300 : -300,
      opacity: 0
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 300 : -300,
      opacity: 0
    })
  };

  const step = wizardSteps[currentStep];

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ type: "spring", damping: 20, stiffness: 300 }}
        className="relative w-full max-w-4xl mx-4 max-h-[90vh] overflow-hidden"
      >
        <Card className="glass-morphism border-white/20 bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl shadow-2xl">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-white/10">
            <div className="flex items-center space-x-3">
              <motion.div
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="p-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl"
              >
                <Sparkles className="h-6 w-6 text-white" />
              </motion.div>
              <div>
                <h2 className="text-2xl font-bold text-gradient">Welcome Tour</h2>
                <p className="text-sm text-muted-foreground">
                  Step {currentStep + 1} of {wizardSteps.length}
                </p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleSkip}
              className="text-muted-foreground hover:text-foreground"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* Progress Bar */}
          <div className="px-6 py-3 border-b border-white/10">
            <div className="flex items-center space-x-2">
              {wizardSteps.map((_, index) => (
                <button
                  key={index}
                  onClick={() => handleStepClick(index)}
                  className="flex-1 h-2 rounded-full transition-all duration-300 hover:scale-105"
                >
                  <motion.div
                    className={`h-full rounded-full ${
                      index <= currentStep
                        ? 'bg-gradient-to-r from-blue-500 to-purple-600'
                        : 'bg-gray-200 dark:bg-gray-700'
                    }`}
                    initial={false}
                    animate={{
                      scale: index === currentStep ? 1.1 : 1,
                      opacity: index <= currentStep ? 1 : 0.5
                    }}
                    transition={{ duration: 0.3 }}
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Content */}
          <div className="relative h-96 overflow-hidden">
            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={currentStep}
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{
                  x: { type: "spring", stiffness: 300, damping: 30 },
                  opacity: { duration: 0.2 }
                }}
                className={`absolute inset-0 p-8 bg-gradient-to-br ${step.bgGradient}`}
              >
                <div className="flex flex-col lg:flex-row items-center space-y-6 lg:space-y-0 lg:space-x-8 h-full">
                  {/* Icon and Title */}
                  <div className="flex-shrink-0 text-center lg:text-left">
                    <motion.div
                      initial={{ scale: 0, rotate: -180 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{ 
                        delay: 0.2,
                        type: "spring",
                        stiffness: 260,
                        damping: 20 
                      }}
                      className={`inline-flex p-4 rounded-2xl bg-white/20 backdrop-blur-sm ${step.color} mb-4`}
                    >
                      {step.icon}
                    </motion.div>
                    <motion.h3
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                      className="text-3xl font-bold mb-2"
                    >
                      {step.title}
                    </motion.h3>
                    <motion.p
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 }}
                      className="text-muted-foreground text-lg"
                    >
                      {step.description}
                    </motion.p>
                  </div>

                  {/* Features */}
                  <div className="flex-1 w-full">
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.5 }}
                      className="space-y-4"
                    >
                      {step.features.map((feature, index) => (
                        <motion.div
                          key={feature}
                          initial={{ opacity: 0, x: 50 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.6 + index * 0.1 }}
                          className="flex items-center space-x-3 p-4 rounded-xl bg-white/30 backdrop-blur-sm border border-white/20"
                        >
                          <Star className={`h-5 w-5 ${step.color} flex-shrink-0`} />
                          <span className="text-gray-700 dark:text-gray-200 font-medium">
                            {feature}
                          </span>
                        </motion.div>
                      ))}
                    </motion.div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between p-6 border-t border-white/10">
            <Button
              variant="ghost"
              onClick={handlePrevious}
              disabled={currentStep === 0}
              className="text-muted-foreground hover:text-foreground disabled:opacity-50"
            >
              <ChevronLeft className="h-4 w-4 mr-2" />
              Previous
            </Button>

            <div className="flex items-center space-x-2">
              <Badge variant="secondary" className="bg-white/20 text-foreground">
                {currentStep + 1} / {wizardSteps.length}
              </Badge>
            </div>

            <Button
              onClick={handleNext}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium"
            >
              {currentStep === wizardSteps.length - 1 ? 'Get Started' : 'Next'}
              <ChevronRight className="h-4 w-4 ml-2" />
            </Button>
          </div>
        </Card>
      </motion.div>
    </motion.div>
  );
};

export default WelcomeWizard;