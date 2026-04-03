import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ArrowRight, ArrowLeft, Sparkles, CheckCircle2 } from "lucide-react";
import { cn } from "@/src/lib/utils";

interface OnboardingQuizProps {
  onComplete: (data: any) => void;
  onSkip: () => void;
  onBack: () => void;
}

const QUESTIONS = [
  {
    id: "signup_method",
    question: "How would you like to join RadiantNess?",
    options: [
      { id: "A", text: "Sign up anonymously", value: "anonymous" },
      { id: "B", text: "Connect to my school", value: "school" },
    ],
  },
  {
    id: "help_needed",
    question: "What do you need help with the most right now?",
    condition: (answers: any) => answers.signup_method === "anonymous",
    options: [
      { id: "A", text: "Sanitary supplies", value: "sanitary_products" },
      { id: "B", text: "Clothes or school uniform", value: "clothes" },
      { id: "C", text: "Stationery or books", value: "stationery" },
      { id: "D", text: "Simply a confidence boost", value: "confidence" },
    ],
  },
  {
    id: "age_range",
    question: "What is your age range?",
    condition: (answers: any) => answers.signup_method === "anonymous",
    options: [
      { id: "A", text: "7 - 9 years old", value: "7-9" },
      { id: "B", text: "9 - 12 years old", value: "9-12" },
      { id: "C", text: "12 - 14 years old", value: "12-14" },
      { id: "D", text: "15 - 18 years old", value: "15-18" },
    ],
  },
  {
    id: "country",
    question: "Which country are you in?",
    condition: (answers: any) => answers.signup_method === "anonymous",
    type: "scroll_select",
    options: [
      "Afghanistan", "Albania", "Algeria", "Andorra", "Angola", "Antigua and Barbuda", "Argentina", "Armenia", "Australia", "Austria", "Azerbaijan",
      "Bahamas", "Bahrain", "Bangladesh", "Barbados", "Belarus", "Belgium", "Belize", "Benin", "Bhutan", "Bolivia", "Bosnia and Herzegovina", "Botswana", "Brazil", "Brunei", "Bulgaria", "Burkina Faso", "Burundi",
      "Cabo Verde", "Cambodia", "Cameroon", "Canada", "Central African Republic", "Chad", "Chile", "China", "Colombia", "Comoros", "Congo", "Costa Rica", "Croatia", "Cuba", "Cyprus", "Czech Republic",
      "Denmark", "Djibouti", "Dominica", "Dominican Republic",
      "Ecuador", "Egypt", "El Salvador", "Equatorial Guinea", "Eritrea", "Estonia", "Eswatini", "Ethiopia",
      "Fiji", "Finland", "France",
      "Gabon", "Gambia", "Georgia", "Germany", "Ghana", "Greece", "Grenada", "Guatemala", "Guinea", "Guinea-Bissau", "Guyana",
      "Haiti", "Honduras", "Hungary",
      "Iceland", "India", "Indonesia", "Iran", "Iraq", "Ireland", "Israel", "Italy",
      "Jamaica", "Japan", "Jordan",
      "Kazakhstan", "Kenya", "Kiribati", "Korea, North", "Korea, South", "Kosovo", "Kuwait", "Kyrgyzstan",
      "Laos", "Latvia", "Lebanon", "Lesotho", "Liberia", "Libya", "Liechtenstein", "Lithuania", "Luxembourg",
      "Madagascar", "Malawi", "Malaysia", "Maldives", "Mali", "Malta", "Marshall Islands", "Mauritania", "Mauritius", "Mexico", "Micronesia", "Moldova", "Monaco", "Mongolia", "Montenegro", "Morocco", "Mozambique", "Myanmar",
      "Namibia", "Nauru", "Nepal", "Netherlands", "New Zealand", "Nicaragua", "Niger", "Nigeria", "North Macedonia", "Norway",
      "Oman",
      "Pakistan", "Palau", "Palestine", "Panama", "Papua New Guinea", "Paraguay", "Peru", "Philippines", "Poland", "Portugal",
      "Qatar",
      "Romania", "Russia", "Rwanda",
      "Saint Kitts and Nevis", "Saint Lucia", "Saint Vincent and the Grenadines", "Samoa", "San Marino", "Sao Tome and Principe", "Saudi Arabia", "Senegal", "Serbia", "Seychelles", "Sierra Leone", "Singapore", "Slovakia", "Slovenia", "Solomon Islands", "Somalia", "South Africa", "South Sudan", "Spain", "Sri Lanka", "Sudan", "Suriname", "Sweden", "Switzerland", "Syria",
      "Taiwan", "Tajikistan", "Tanzania", "Thailand", "Timor-Leste", "Togo", "Tonga", "Trinidad and Tobago", "Tunisia", "Turkey", "Turkmenistan", "Tuvalu",
      "Uganda", "Ukraine", "United Arab Emirates", "United Kingdom", "United States", "Uruguay", "Uzbekistan",
      "Vanuatu", "Vatican City", "Venezuela", "Vietnam",
      "Yemen",
      "Zambia", "Zimbabwe"
    ].map(c => ({ id: c, text: c, value: c })),
  },
  {
    id: "province",
    question: "What is your province or state?",
    condition: (answers: any) => answers.signup_method === "anonymous",
    type: "text",
    placeholder: "e.g. Gauteng, California, Lagos...",
  },
  {
    id: "city",
    question: "What city do you live in?",
    condition: (answers: any) => answers.signup_method === "anonymous",
    type: "text",
    placeholder: "e.g. Johannesburg, New York, Nairobi...",
  },
  {
    id: "suburb",
    question: "What area or suburb do you stay in?",
    condition: (answers: any) => answers.signup_method === "anonymous",
    type: "text",
    placeholder: "e.g. Sandton, Brooklyn, Westlands...",
  },
  {
    id: "school_name_optional",
    question: "Which school are you in? (Optional)",
    condition: (answers: any) => answers.signup_method === "anonymous",
    type: "text",
    placeholder: "Enter your school name...",
    optional: true,
  },
  {
    id: "stress",
    question: "How often do you feel overwhelmed by stress or anxiety?",
    options: [
      { id: "A", text: "Almost every day — It's hard to focus", value: "daily" },
      { id: "B", text: "A few times a week — It comes and goes", value: "weekly" },
      { id: "C", text: "Rarely — I generally feel in control", value: "rarely" },
      { id: "D", text: "Almost never — I feel very balanced", value: "never" },
    ],
  },
  {
    id: "confidence",
    question: "How would you describe your current level of self-confidence?",
    options: [
      { id: "A", text: "Low — I often doubt my abilities and worth", value: "low" },
      { id: "B", text: "Medium — I have good days and bad days", value: "medium" },
      { id: "C", text: "High — I feel capable and self-assured", value: "high" },
      { id: "D", text: "Very High — I'm ready to lead and inspire", value: "very_high" },
    ],
  },
  {
    id: "goal",
    question: "What is your primary focus for this journey?",
    options: [
      { id: "A", text: "Self-Discovery — Understanding my emotions", value: "discovery" },
      { id: "B", text: "Growth — Building resilience and social skills", value: "confidence" },
      { id: "C", text: "Connection — Finding a supportive community", value: "community" },
      { id: "D", text: "Awareness — Learning about mental wellness", value: "tracking" },
    ],
  },
  {
    id: "coping",
    question: "What is your typical response to difficult emotions?",
    options: [
      { id: "A", text: "Reflection — I write or create to process", value: "journaling" },
      { id: "B", text: "Outreach — I talk to someone I trust", value: "talking" },
      { id: "C", text: "Internalization — I keep it to myself", value: "internalizing" },
      { id: "D", text: "Action — I find a hobby or distraction", value: "distraction" },
    ],
  },
  {
    id: "community_support",
    question: "How would you rate your current support system?",
    options: [
      { id: "A", text: "Strong — I have people I can always count on", value: "yes" },
      { id: "B", text: "Limited — I often feel lonely or misunderstood", value: "no" },
      { id: "C", text: "Growing — I have some support but want more", value: "some" },
      { id: "D", text: "Unsure — I'm still looking for my tribe", value: "unsure" },
    ],
  },
  {
    id: "triggers",
    question: "What usually triggers your stress the most?",
    options: [
      { id: "A", text: "Academic Pressure — Grades and expectations", value: "school" },
      { id: "B", text: "Social Dynamics — Friendships and fitting in", value: "social" },
      { id: "C", text: "Home Life — Family relationships and stress", value: "family" },
      { id: "D", text: "The Future — Uncertainty and big decisions", value: "future" },
    ],
  },
  {
    id: "self_image",
    question: "How do you perceive your own self-image?",
    options: [
      { id: "A", text: "Positive — I'm proud of who I'm becoming", value: "positive" },
      { id: "B", text: "Comparison-Heavy — I often look at others", value: "comparison" },
      { id: "C", text: "Invisible — I feel like I don't belong", value: "invisible" },
      { id: "D", text: "Evolving — I'm still discovering my identity", value: "exploring" },
    ],
  },
  {
    id: "school_attendance",
    question: "How often do you find it difficult to attend school?",
    options: [
      { id: "A", text: "Rarely — I attend almost every day", value: "rarely" },
      { id: "B", text: "Sometimes — A few days a month", value: "sometimes" },
      { id: "C", text: "Often — Once or twice a week", value: "often" },
      { id: "D", text: "Very Often — It's hard to go consistently", value: "very_often" },
    ],
  },
  {
    id: "attendance_barriers",
    question: "What is the primary reason that makes school attendance difficult for you?",
    options: [
      { id: "A", text: "Lack of proper sanitary products", value: "sanitary_products" },
      { id: "B", text: "Lack of school uniform or proper clothes", value: "clothes" },
      { id: "C", text: "Lack of stationery or books", value: "stationery" },
      { id: "D", text: "Health or emotional well-being", value: "health_emotional" },
    ],
  },
  {
    id: "basic_needs",
    question: "Do you feel you have all the basic supplies you need to succeed in school?",
    options: [
      { id: "A", text: "Yes, I have everything I need", value: "yes" },
      { id: "B", text: "Mostly, but I'm missing a few things", value: "mostly" },
      { id: "C", text: "No, I lack many essential supplies", value: "no" },
      { id: "D", text: "I'm not sure where to get help", value: "unsure" },
    ],
  },
];

export default function OnboardingQuiz({ onComplete, onSkip, onBack }: OnboardingQuizProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [name, setName] = useState("");
  const [textInput, setTextInput] = useState("");
  const [isFinished, setIsFinished] = useState(false);

  const handleNext = (overrideAnswers?: Record<string, string>) => {
    const currentAnswers = overrideAnswers || answers;
    let nextStep = currentStep + 1;
    
    // Skip questions if condition is not met
    while (nextStep <= QUESTIONS.length && QUESTIONS[nextStep - 1]?.condition && !QUESTIONS[nextStep - 1].condition(currentAnswers)) {
      nextStep++;
    }

    if (nextStep <= QUESTIONS.length) {
      setCurrentStep(nextStep);
      // Reset text input for next step if it's a text type
      const nextQuestion = QUESTIONS[nextStep - 1];
      if (nextQuestion?.type === "text") {
        setTextInput(currentAnswers[nextQuestion.id] || "");
      }
    } else {
      setIsFinished(true);
    }
  };

  const handleBack = () => {
    let prevStep = currentStep - 1;
    
    // Skip questions if condition is not met
    while (prevStep > 0 && QUESTIONS[prevStep - 1]?.condition && !QUESTIONS[prevStep - 1].condition(answers)) {
      prevStep--;
    }

    if (prevStep >= 0) {
      setCurrentStep(prevStep);
      // Set text input for previous step if it's a text type
      const prevQuestion = QUESTIONS[prevStep - 1];
      if (prevQuestion?.type === "text") {
        setTextInput(answers[prevQuestion.id] || "");
      }
    } else {
      onBack();
    }
  };

  const handleOptionSelect = (questionId: string, value: string) => {
    const newAnswers = { ...answers, [questionId]: value };
    setAnswers(newAnswers);
    setTimeout(() => handleNext(newAnswers), 300);
  };

  const handleTextSubmit = () => {
    const questionId = QUESTIONS[currentStep - 1].id;
    const newAnswers = { ...answers, [questionId]: textInput };
    setAnswers(newAnswers);
    handleNext(newAnswers);
  };

  const progress = ((currentStep + 1) / (QUESTIONS.length + 1)) * 100;

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
        <h2 className="text-4xl font-serif mb-4">You're all set, {name || "Radiant"}!</h2>
        <p className="text-gray-600 mb-12 max-w-xs mx-auto">
          We've personalized your experience based on your answers. Ready to start your journey?
        </p>
        <button
          onClick={() => onComplete({ name, answers })}
          className="w-full max-w-xs bg-radiant-pink text-white py-5 rounded-full font-bold uppercase tracking-widest text-sm flex items-center justify-center gap-3 shadow-lg hover:shadow-xl transition-shadow active:scale-95"
        >
          Let's Start
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
            className={cn("p-3 text-gray-400 hover:text-radiant-pink transition-colors bg-white rounded-full shadow-sm border border-black/5")}
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
            {currentStep + 1} / {QUESTIONS.length + 1}
          </span>
        </div>

        <div className="mb-12 px-4">
          <h1 className="text-xs font-bold uppercase tracking-[0.3em] text-radiant-pink mb-3">Onboarding Quiz</h1>
          <p className="text-[11px] text-gray-400 uppercase tracking-widest leading-relaxed max-w-sm">
            Purpose: Identify stress patterns, emotional triggers, and coping methods to personalize your growth journey.
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
            {currentStep === 0 ? (
              <div className="space-y-10">
                <div className="w-20 h-20 bg-radiant-pink/10 rounded-[32px] flex items-center justify-center text-radiant-pink mb-6">
                  <Sparkles size={40} />
                </div>
                <h2 className="text-5xl font-serif leading-tight tracking-tight">First, what should <br /> we call you?</h2>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your name or nickname..."
                  className="w-full bg-white rounded-[32px] py-7 px-10 shadow-sm border border-black/5 focus:outline-none focus:ring-4 focus:ring-radiant-pink/10 text-xl transition-all"
                  autoFocus
                  onKeyDown={(e) => e.key === "Enter" && name.trim() && handleNext()}
                />
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleNext}
                  disabled={!name.trim()}
                  className="w-full bg-radiant-pink text-white py-6 rounded-full font-bold uppercase tracking-widest text-sm flex items-center justify-center gap-3 shadow-lg hover:shadow-xl transition-all active:scale-95 disabled:opacity-50"
                >
                  Continue
                  <ArrowRight size={18} />
                </motion.button>
                <button 
                  onClick={onSkip}
                  className="w-full text-gray-400 text-xs font-bold uppercase tracking-widest hover:text-radiant-pink transition-colors"
                >
                  Continue without account
                </button>
              </div>
            ) : (
              <div className="space-y-10">
                <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-radiant-pink bg-radiant-pink/5 px-4 py-1.5 rounded-full inline-block">
                  {QUESTIONS[currentStep - 1].id.replace(/_/g, " ")}
                </span>
                <h2 className="text-4xl font-serif leading-tight tracking-tight">
                  {QUESTIONS[currentStep - 1].question}
                </h2>
                
                {QUESTIONS[currentStep - 1].type === "text" ? (
                  <div className="space-y-6">
                    <input
                      type="text"
                      value={textInput}
                      onChange={(e) => setTextInput(e.target.value)}
                      placeholder={QUESTIONS[currentStep - 1].placeholder}
                      className="w-full bg-white rounded-[32px] py-7 px-10 shadow-sm border border-black/5 focus:outline-none focus:ring-4 focus:ring-radiant-pink/10 text-xl transition-all"
                      autoFocus
                      onKeyDown={(e) => e.key === "Enter" && (textInput.trim() || QUESTIONS[currentStep - 1].optional) && handleTextSubmit()}
                    />
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handleTextSubmit}
                      disabled={!textInput.trim() && !QUESTIONS[currentStep - 1].optional}
                      className="w-full bg-radiant-pink text-white py-6 rounded-full font-bold uppercase tracking-widest text-sm flex items-center justify-center gap-3 shadow-lg hover:shadow-xl transition-all active:scale-95 disabled:opacity-50"
                    >
                      {QUESTIONS[currentStep - 1].optional && !textInput.trim() ? "Skip" : "Continue"}
                      <ArrowRight size={18} />
                    </motion.button>
                  </div>
                ) : QUESTIONS[currentStep - 1].type === "scroll_select" ? (
                  <div className="grid gap-3 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                    {QUESTIONS[currentStep - 1].options.map((option) => (
                      <motion.button
                        key={option.id}
                        whileHover={{ x: 10 }}
                        onClick={() => handleOptionSelect(QUESTIONS[currentStep - 1].id, option.value)}
                        className={cn(
                          "w-full bg-white p-6 rounded-[24px] text-left shadow-sm border border-black/5 flex items-center justify-between group hover:border-radiant-pink/30 transition-all active:scale-98",
                          answers[QUESTIONS[currentStep - 1].id] === option.value && "border-radiant-pink ring-4 ring-radiant-pink/5"
                        )}
                      >
                        <span className="text-lg font-medium text-gray-700 pr-4">{option.text}</span>
                        <div className={cn(
                          "w-6 h-6 rounded-full border-2 border-gray-100 flex items-center justify-center transition-all shrink-0",
                          answers[QUESTIONS[currentStep - 1].id] === option.value && "border-radiant-pink bg-radiant-pink text-white"
                        )}>
                          {answers[QUESTIONS[currentStep - 1].id] === option.value && <div className="w-2 h-2 bg-white rounded-full" />}
                        </div>
                      </motion.button>
                    ))}
                  </div>
                ) : (
                  <div className="grid gap-5">
                    {QUESTIONS[currentStep - 1].options.map((option) => (
                      <motion.button
                        key={option.id}
                        whileHover={{ x: 10 }}
                        onClick={() => handleOptionSelect(QUESTIONS[currentStep - 1].id, option.value)}
                        className={cn(
                          "w-full bg-white p-8 rounded-[32px] text-left shadow-sm border border-black/5 flex items-center justify-between group hover:border-radiant-pink/30 transition-all active:scale-98",
                          answers[QUESTIONS[currentStep - 1].id] === option.value && "border-radiant-pink ring-4 ring-radiant-pink/5"
                        )}
                      >
                        <span className="text-lg font-medium text-gray-700 pr-4">{option.text}</span>
                        <div className={cn(
                          "w-8 h-8 rounded-full border-2 border-gray-100 flex items-center justify-center transition-all shrink-0",
                          answers[QUESTIONS[currentStep - 1].id] === option.value && "border-radiant-pink bg-radiant-pink text-white"
                        )}>
                          {answers[QUESTIONS[currentStep - 1].id] === option.value && <div className="w-2.5 h-2.5 bg-white rounded-full" />}
                        </div>
                      </motion.button>
                    ))}
                  </div>
                )}
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
