import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ArrowRight, ArrowLeft, CheckCircle2, Building2, Users, HeartHandshake, MapPin, Package, User, GraduationCap } from "lucide-react";
import { cn } from "../lib/utils";

interface RoleOnboardingProps {
  role: "parent" | "school" | "ngo_requester";
  onComplete: (data: any) => void;
  onBack: () => void;
}

const ROLE_QUESTIONS: Record<string, any[]> = {
  parent: [
    {
      id: "parent_basic",
      type: "input",
      question: "Personal Details",
      description: "Please provide your name and the name of the student you are supporting.",
      fields: [
        { id: "fullName", label: "Your Full Name", placeholder: "e.g. Jane Doe", icon: User },
        { id: "studentName", label: "Student's Name", placeholder: "e.g. Sarah Doe", icon: Users },
      ],
    },
    {
      id: "relationship",
      question: "What is your relationship to the student?",
      description: "This helps us understand your role in the student's life.",
      options: [
        { id: "A", text: "Parent", value: "parent" },
        { id: "B", text: "Guardian", value: "guardian" },
        { id: "C", text: "Relative / Sibling", value: "relative" },
        { id: "D", text: "Mentor / Coach", value: "mentor" },
      ],
    },
    {
      id: "concern",
      question: "What is your primary area of concern for the student?",
      description: "We'll prioritize content and resources based on your selection.",
      options: [
        { id: "A", text: "Academic Performance", value: "academic" },
        { id: "B", text: "Emotional Well-being", value: "emotional" },
        { id: "C", text: "Social Confidence", value: "social" },
        { id: "D", text: "Physical Health & Hygiene", value: "health" },
      ],
    },
    {
      id: "support_type",
      question: "How would you like to support the student through this app?",
      description: "Choose the primary way you intend to use RadiantNess.",
      options: [
        { id: "A", text: "Accessing educational resources", value: "resources" },
        { id: "B", text: "Monitoring their progress & mood", value: "tracking" },
        { id: "C", text: "Connecting with other parents/mentors", value: "community" },
        { id: "D", text: "Requesting supplies or help", value: "requests" },
      ],
    },
  ],
  school: [
    {
      id: "school_basic",
      type: "input",
      question: "School Details",
      description: "Provide the official details of your educational institution.",
      fields: [
        { id: "schoolName", label: "Official School Name", placeholder: "e.g. Radiant High School", icon: Building2 },
        { id: "schoolType", label: "School Type (Primary/Secondary)", placeholder: "e.g. Senior High School", icon: GraduationCap },
        { id: "location", label: "Physical Address / Location", placeholder: "City, Region, District", icon: MapPin },
      ],
    },
    {
      id: "student_demographics",
      question: "Student Population",
      description: "This helps us gauge the scale of support needed.",
      options: [
        { id: "A", text: "Under 100 students", value: "small" },
        { id: "B", text: "100 - 500 students", value: "medium" },
        { id: "C", text: "500 - 1000 students", value: "large" },
        { id: "D", text: "Over 1000 students", value: "very_large" },
      ],
    },
    {
      id: "primary_need",
      question: "What is the most urgent need for your students?",
      description: "We'll work with NGOs to prioritize these needs.",
      options: [
        { id: "A", text: "Sanitary Supplies (Pads/Cups)", value: "supplies" },
        { id: "B", text: "Mental Health & Counseling", value: "mental_health" },
        { id: "C", text: "Hygiene Education Materials", value: "education" },
        { id: "D", text: "Private Washroom Facilities", value: "infrastructure" },
      ],
    },
  ],
  ngo_requester: [
    {
      id: "ngo_basic",
      type: "input",
      question: "Organization Details",
      description: "Provide your legal organization details for verification.",
      fields: [
        { id: "orgName", label: "Legal Organization Name", placeholder: "e.g. Radiant Hope Foundation", icon: HeartHandshake },
        { id: "regNumber", label: "NGO Registration Number", placeholder: "e.g. NGO-123456-ABC", icon: Building2 },
        { id: "specialization", label: "Primary Focus Area", placeholder: "e.g. Menstrual Health & Hygiene", icon: Package },
      ],
    },
    {
      id: "ngo_location",
      type: "input",
      question: "Location & Logistics",
      description: "Tell us where your warehouse is located and where you can deliver.",
      fields: [
        { id: "warehouseAddress", label: "Warehouse / Office Address", placeholder: "Street, City, Building", icon: MapPin },
        { id: "serviceArea", label: "Service Area (Regions Covered)", placeholder: "e.g. Greater Accra, Northern Region", icon: MapPin },
      ],
    },
    {
      id: "donation_type",
      question: "What products or services do you specialize in providing?",
      description: "Select the primary resource you can contribute.",
      options: [
        { id: "A", text: "Sanitary Products (Pads, Cups, etc.)", value: "sanitary" },
        { id: "B", text: "Mental Health Counseling", value: "counseling" },
        { id: "C", text: "Educational Workshops", value: "workshops" },
        { id: "D", text: "Financial Grants / Scholarships", value: "grants" },
      ],
    },
    {
      id: "capacity",
      question: "What is your typical monthly distribution capacity?",
      description: "This helps us match you with schools and students in need.",
      options: [
        { id: "A", text: "Under 500 units/people", value: "small" },
        { id: "B", text: "500 - 2,000 units/people", value: "medium" },
        { id: "C", text: "2,000 - 10,000 units/people", value: "large" },
        { id: "D", text: "Over 10,000 units/people", value: "enterprise" },
      ],
    },
  ],
};

export default function RoleOnboarding({ role, onComplete, onBack }: RoleOnboardingProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [isFinished, setIsFinished] = useState(false);
  
  const questions = ROLE_QUESTIONS[role] || [];
  const currentQuestion = questions[currentStep];

  const handleNext = () => {
    if (currentStep < questions.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      setIsFinished(true);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    } else {
      onBack();
    }
  };

  const handleOptionSelect = (questionId: string, value: string) => {
    setAnswers(prev => ({ ...prev, [questionId]: value }));
    setTimeout(() => handleNext(), 300);
  };

  const handleInputChange = (fieldId: string, value: string) => {
    setAnswers(prev => ({
      ...prev,
      [currentQuestion.id]: {
        ...(prev[currentQuestion.id] || {}),
        [fieldId]: value
      }
    }));
  };

  const isInputStepValid = () => {
    if (currentQuestion.type !== "input") return true;
    const stepData = answers[currentQuestion.id] || {};
    return currentQuestion.fields.every((f: any) => stepData[f.id]?.trim());
  };

  const progress = ((currentStep + 1) / questions.length) * 100;

  if (isFinished) {
    return (
      <div className="min-h-screen bg-radiant-bg flex flex-col items-center justify-center px-6 py-12 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-20 h-20 bg-radiant-pink rounded-full flex items-center justify-center text-white mb-8 shadow-xl"
        >
          <CheckCircle2 size={40} />
        </motion.div>
        <h2 className="text-4xl font-serif mb-4">Registration Complete!</h2>
        <p className="text-gray-600 mb-12 max-w-xs mx-auto">
          Thank you for providing this information. It helps us tailor the RadiantNess experience for you.
        </p>
        <button
          onClick={() => onComplete(answers)}
          className="w-full max-w-xs bg-radiant-pink text-white py-5 rounded-full font-bold uppercase tracking-widest text-sm flex items-center justify-center gap-3 shadow-lg hover:shadow-xl transition-shadow active:scale-95"
        >
          Go to Dashboard
          <ArrowRight size={18} />
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-radiant-bg px-6 py-16 flex flex-col">
      <div className="max-w-xl mx-auto w-full flex-1 flex flex-col">
        <div className="flex items-center justify-between mb-12">
          <button
            onClick={handleBack}
            className="p-3 text-gray-400 hover:text-radiant-pink transition-colors bg-white rounded-full shadow-sm border border-black/5"
          >
            <ArrowLeft size={20} />
          </button>
          <div className="flex-1 mx-8 h-2 bg-gray-200 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              className="h-full bg-radiant-pink"
            />
          </div>
          <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 w-12 text-right">
            {currentStep + 1} / {questions.length}
          </span>
        </div>

        <div className="mb-12 px-4">
          <h1 className="text-xs font-bold uppercase tracking-[0.3em] text-radiant-pink mb-3">
            {role === "parent" ? "Parent Onboarding" : role === "school" ? "School Registration" : "NGO Registration"}
          </h1>
          <p className="text-[11px] text-gray-400 uppercase tracking-widest leading-relaxed max-w-sm">
            {role === "ngo_requester" 
              ? "Register your organization to start donating products, providing services, and tracking your impact."
              : "Help us understand your role and how you can contribute to the RadiantNess community."}
          </p>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="flex-1 flex flex-col justify-center px-2"
          >
            <div className="space-y-10">
              <div className="space-y-2">
                <h2 className="text-4xl font-serif leading-tight tracking-tight">
                  {currentQuestion.question}
                </h2>
                {currentQuestion.description && (
                  <p className="text-sm text-gray-500 italic">
                    {currentQuestion.description}
                  </p>
                )}
              </div>

              {currentQuestion.type === "input" ? (
                <div className="space-y-8">
                  {currentQuestion.fields.map((field: any) => (
                    <div key={field.id} className="space-y-2">
                      <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 ml-4">
                        {field.label}
                      </label>
                      <div className="relative">
                        <div className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400">
                          <field.icon size={20} />
                        </div>
                        <input
                          type="text"
                          value={answers[currentQuestion.id]?.[field.id] || ""}
                          onChange={(e) => handleInputChange(field.id, e.target.value)}
                          placeholder={field.placeholder}
                          className="w-full bg-white rounded-[24px] py-6 pl-16 pr-8 shadow-sm border border-black/5 focus:outline-none focus:ring-4 focus:ring-radiant-pink/10 text-lg transition-all"
                        />
                      </div>
                    </div>
                  ))}
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleNext}
                    disabled={!isInputStepValid()}
                    className="w-full bg-radiant-pink text-white py-6 rounded-full font-bold uppercase tracking-widest text-sm flex items-center justify-center gap-3 shadow-lg hover:shadow-xl transition-all active:scale-95 disabled:opacity-50 mt-4"
                  >
                    Continue
                    <ArrowRight size={18} />
                  </motion.button>
                </div>
              ) : (
                <div className="grid gap-5">
                  {currentQuestion.options.map((option: any) => (
                    <motion.button
                      key={option.id}
                      whileHover={{ x: 10 }}
                      onClick={() => handleOptionSelect(currentQuestion.id, option.value)}
                      className={cn(
                        "w-full bg-white p-8 rounded-[32px] text-left shadow-sm border border-black/5 flex items-center justify-between group hover:border-radiant-pink/30 transition-all active:scale-98",
                        answers[currentQuestion.id] === option.value && "border-radiant-pink ring-4 ring-radiant-pink/5"
                      )}
                    >
                      <span className="text-lg font-medium text-gray-700 pr-4">{option.text}</span>
                      <div className={cn(
                        "w-8 h-8 rounded-full border-2 border-gray-100 flex items-center justify-center transition-all shrink-0",
                        answers[currentQuestion.id] === option.value && "border-radiant-pink bg-radiant-pink text-white"
                      )}>
                        {answers[currentQuestion.id] === option.value && <div className="w-2.5 h-2.5 bg-white rounded-full" />}
                      </div>
                    </motion.button>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
