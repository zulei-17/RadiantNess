import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ArrowRight, ArrowLeft, Building2, Users, HeartHandshake, MapPin, Package, User, GraduationCap, Bell, QrCode, Mail } from "lucide-react";
import { cn } from "../lib/utils";

const COUNTRIES = [
  { id: "ZA", text: "South Africa", value: "South Africa" },
  { id: "NG", text: "Nigeria", value: "Nigeria" },
  { id: "KE", text: "Kenya", value: "Kenya" },
  { id: "GH", text: "Ghana", value: "Ghana" },
  { id: "ET", text: "Ethiopia", value: "Ethiopia" },
  { id: "EG", text: "Egypt", value: "Egypt" },
  { id: "MA", text: "Morocco", value: "Morocco" },
  { id: "US", text: "United States", value: "United States" },
  { id: "GB", text: "United Kingdom", value: "United Kingdom" },
  { id: "CA", text: "Canada", value: "Canada" },
  { id: "AU", text: "Australia", value: "Australia" },
  { id: "IN", text: "India", value: "India" },
  { id: "OTHER", text: "Other / Not Listed", value: "Other" },
];

const PROVINCES: Record<string, { id: string; text: string; value: string }[]> = {
  "South Africa": [
    { id: "GP", text: "Gauteng", value: "Gauteng" },
    { id: "WC", text: "Western Cape", value: "Western Cape" },
    { id: "KZN", text: "KwaZulu-Natal", value: "KwaZulu-Natal" },
    { id: "EC", text: "Eastern Cape", value: "Eastern Cape" },
    { id: "FS", text: "Free State", value: "Free State" },
    { id: "LP", text: "Limpopo", value: "Limpopo" },
    { id: "MP", text: "Mpumalanga", value: "Mpumalanga" },
    { id: "NW", text: "North West", value: "North West" },
    { id: "NC", text: "Northern Cape", value: "Northern Cape" },
  ],
  "Nigeria": [
    { id: "LA", text: "Lagos", value: "Lagos" },
    { id: "AB", text: "Abuja (FCT)", value: "Abuja" },
    { id: "KN", text: "Kano", value: "Kano" },
    { id: "RI", text: "Rivers", value: "Rivers" },
    { id: "OY", text: "Oyo", value: "Oyo" },
  ],
  "Kenya": [
    { id: "NRB", text: "Nairobi", value: "Nairobi" },
    { id: "MSA", text: "Mombasa", value: "Mombasa" },
    { id: "KSM", text: "Kisumu", value: "Kisumu" },
  ],
  "Ghana": [
    { id: "GA", text: "Greater Accra", value: "Greater Accra" },
    { id: "AS", text: "Ashanti", value: "Ashanti" },
    { id: "WR", text: "Western", value: "Western" },
  ],
};

const CITIES: Record<string, { id: string; text: string; value: string }[]> = {
  "Gauteng": [
    { id: "JHB", text: "Johannesburg", value: "Johannesburg" },
    { id: "PTA", text: "Pretoria", value: "Pretoria" },
    { id: "SOW", text: "Soweto", value: "Soweto" },
  ],
  "Western Cape": [
    { id: "CPT", text: "Cape Town", value: "Cape Town" },
    { id: "STE", text: "Stellenbosch", value: "Stellenbosch" },
    { id: "GEO", text: "George", value: "George" },
  ],
  // ... can add more as needed
};

const ROLE_QUESTIONS: Record<string, any[]> = {
  parent: [
    {
      id: "parent_basic",
      type: "input",
      question: "Parent Identity",
      description: "Tell us about yourself and your student.",
      fields: [
        { id: "fullName", label: "Your Full Name", placeholder: "e.g. John Smith", icon: User },
        { id: "studentName", label: "Student's Full Name", placeholder: "e.g. Jane Smith", icon: GraduationCap },
      ],
    },
    {
      id: "primary_need",
      question: "Why does your young girl need this app the most?",
      description: "This helps us prioritize the right support for her.",
      options: [
        { id: "A", text: "Need of sanitary products", value: "sanitary" },
        { id: "B", text: "Need of school uniform", value: "uniform" },
        { id: "C", text: "Need of stationery", value: "stationery" },
        { id: "D", text: "General emotional & mental support", value: "emotional" },
      ],
    },
    {
      id: "location_country",
      type: "select",
      question: "Where are you located?",
      description: "Select your country to see regional support options.",
      options: COUNTRIES,
    },
    {
      id: "location_province",
      type: "select",
      question: "Province or State",
      description: "Which province or state do you reside in?",
      condition: (answers: any) => !!answers.location_country && !!PROVINCES[answers.location_country],
      options: (answers: any) => PROVINCES[answers.location_country] || [],
    },
    {
      id: "location_city",
      type: "select",
      question: "City, Town or Village",
      description: "Select the city or town closest to you.",
      condition: (answers: any) => !!answers.location_province && !!CITIES[answers.location_province],
      options: (answers: any) => CITIES[answers.location_province] || [],
    },
    {
      id: "location_details",
      type: "input",
      question: "Address Details",
      description: "Please provide your specific location details.",
      fields: [
        { id: "suburb", label: "Suburb / Area", placeholder: "e.g. Sandton", icon: MapPin },
        { id: "city_manual", label: "City (if not listed previously)", placeholder: "e.g. Johannesburg", icon: MapPin, optional: true },
        { id: "street", label: "Street Address", placeholder: "e.g. 123 Radiant St", icon: MapPin },
        { id: "postalCode", label: "Postal Code", placeholder: "e.g. 2196", icon: MapPin },
      ],
    },
    {
      id: "has_child_account",
      question: "Does your child already have an account on RadiantNess?",
      description: "Linking accounts allows you to support her journey directly.",
      options: [
        { id: "yes", text: "Yes, she has an account", value: "yes" },
        { id: "no", text: "No, not yet", value: "no" },
      ],
    },
    {
      id: "link_child",
      type: "link_account",
      question: "Link your child's account",
      description: "Scan the code or enter her account name to send an invite.",
      condition: (answers: any) => answers.has_child_account === "yes",
    },
    {
      id: "notifications",
      type: "multi_select",
      question: "Notification Preferences",
      description: "What would you like to stay informed about?",
      options: [
        { id: "parenting", text: "Parenting teens", value: "parenting" },
        { id: "mental_health", text: "Mental health & emotional support", value: "mental_health" },
        { id: "menstrual_health", text: "Menstrual health education", value: "menstrual_health" },
        { id: "updates", text: "New features, updates, or improvements", value: "updates" },
      ],
    },
  ],
  school: [
    {
      id: "school_basic",
      type: "input",
      question: "School Identity",
      description: "Tell us about your school and its location.",
      fields: [
        { id: "schoolName", label: "School Name", placeholder: "e.g. Radiant High School", icon: Building2 },
        { id: "country", label: "Country", placeholder: "e.g. South Africa", icon: MapPin },
        { id: "province", label: "Province / State", placeholder: "e.g. Gauteng", icon: MapPin },
        { id: "city", label: "City", placeholder: "e.g. Johannesburg", icon: MapPin },
        { id: "suburb", label: "Area / Suburb", placeholder: "e.g. Sandton", icon: MapPin },
        { id: "postalCode", label: "Postal Code", placeholder: "2196", icon: MapPin },
      ],
    },
    {
      id: "school_representative",
      type: "input",
      question: "School Representative",
      description: "Who is the primary contact for this registration?",
      fields: [
        { id: "repName", label: "Full Name of Representative", placeholder: "e.g. Jane Doe", icon: User },
        { id: "repEmail", label: "Official Email Address", placeholder: "jane.doe@school.com", icon: User },
        { id: "repPhone", label: "Telephone / Phone Number", placeholder: "+1 234 567 8900", icon: Users },
        { id: "website", label: "School Website (Optional)", placeholder: "https://www.school.com", icon: MapPin, optional: true },
      ],
    },
    {
      id: "student_count",
      type: "input",
      question: "Student Population",
      description: "Help us understand the size of your student body.",
      fields: [
        { id: "totalStudents", label: "Total Number of Students", placeholder: "e.g. 1200", icon: Users },
        { id: "girlStudents", label: "Number of Girls", placeholder: "e.g. 650", icon: Users },
        { id: "boyStudents", label: "Number of Boys", placeholder: "e.g. 550", icon: Users },
      ],
    },
    {
      id: "student_need",
      type: "input",
      question: "Student Needs",
      description: "Estimate how many students miss school due to lack of supplies.",
      fields: [
        { id: "lackSanitary", label: "Lack of Sanitary Products", placeholder: "e.g. 150", icon: Package },
        { id: "lackUniform", label: "Lack of Uniforms", placeholder: "e.g. 80", icon: Package },
        { id: "lackStationery", label: "Lack of Stationery", placeholder: "e.g. 100", icon: Package },
      ],
    },
  ],
  ngo_business: [
    {
      id: "ngo_basic",
      type: "input",
      question: "Organization Details",
      description: "Provide your legal organization details for verification.",
      fields: [
        { id: "orgName", label: "Legal Organization Name", placeholder: "e.g. Radiant Hope Foundation", icon: HeartHandshake },
        { id: "regNumber", label: "Registration Number", placeholder: "e.g. NGO-123456-ABC", icon: Building2 },
      ],
    },
    {
      id: "ngo_contact",
      type: "input",
      question: "Contact Information",
      description: "How can we reach your organization?",
      fields: [
        { id: "telephone", label: "Telephone / Phone Number", placeholder: "+1 234 567 8900", icon: Users },
        { id: "email", label: "Official Email Address", placeholder: "contact@org.com", icon: User },
        { id: "website", label: "Website URL", placeholder: "https://www.org.com", icon: MapPin },
        { id: "other_contact", label: "Other Contact Info", placeholder: "Social media, etc.", icon: Users },
      ],
    },
    {
      id: "ngo_location",
      type: "input",
      question: "Situated Location",
      description: "Where is your organization's main office located?",
      fields: [
        { id: "country", label: "Country", placeholder: "e.g. South Africa", icon: MapPin },
        { id: "province", label: "State / Province", placeholder: "e.g. Gauteng", icon: MapPin },
        { id: "city", label: "City", placeholder: "e.g. Johannesburg", icon: MapPin },
        { id: "suburb", label: "Suburb", placeholder: "e.g. Sandton", icon: MapPin },
        { id: "zip", label: "Zip / Postal Code", placeholder: "2196", icon: MapPin },
      ],
    },
    {
      id: "donation_specialization",
      question: "What do you specialize in donating?",
      description: "Select the primary resource you can contribute.",
      options: [
        { id: "A", text: "Sanitary Products (Pads, Cups, etc.)", value: "sanitary" },
        { id: "B", text: "Clothes", value: "clothes" },
        { id: "C", text: "School Uniforms", value: "uniforms" },
        { id: "D", text: "Stationery", value: "stationery" },
        { id: "E", text: "Other (Please specify in next step)", value: "other" },
      ],
    },
    {
      id: "other_specialization",
      type: "input",
      question: "Other Specialization",
      description: "If you selected 'Other', please specify here.",
      condition: (answers: any) => answers.donation_specialization === "other",
      fields: [
        { id: "other_spec", label: "Specify Specialization", placeholder: "e.g. Mental Health Support", icon: Package },
      ],
    },
    {
      id: "supply_areas",
      type: "input",
      question: "Supply Areas",
      description: "Where do you typically supply or deliver your products/services?",
      fields: [
        { id: "supply_country", label: "Country", placeholder: "e.g. South Africa", icon: MapPin },
        { id: "supply_province", label: "Province / State", placeholder: "e.g. Western Cape", icon: MapPin },
        { id: "supply_area", label: "Area / Suburb", placeholder: "e.g. Cape Town Central", icon: MapPin },
      ],
    },
    {
      id: "why_work_with_us",
      type: "input",
      question: "Why do you want to work with us?",
      description: "Optional: Tell us about your motivation for joining RadiantNess.",
      fields: [
        { id: "motivation", label: "Your Motivation (Optional)", placeholder: "I want to help students...", icon: HeartHandshake, optional: true },
      ],
    },
  ],
};

interface RoleOnboardingProps {
  role: "parent" | "school" | "ngo_business";
  onComplete: (data: any) => void;
  onBack: () => void;
}

export default function RoleOnboarding({ role, onComplete, onBack }: RoleOnboardingProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, any>>({});
  
  const questions = ROLE_QUESTIONS[role] || [];

  useEffect(() => {
    if (questions.length === 0) {
      onComplete({});
    }
  }, [questions, onComplete]);

  const currentQuestion = questions[currentStep];

  const handleNext = () => {
    if (!currentQuestion) return;
    let nextStep = currentStep + 1;
    while (nextStep < questions.length && questions[nextStep].condition && !questions[nextStep].condition(answers)) {
      nextStep++;
    }

    if (nextStep < questions.length) {
      setCurrentStep(nextStep);
    } else {
      onComplete(answers);
    }
  };

  const handleBack = () => {
    if (currentStep === 0) {
      onBack();
      return;
    }
    let prevStep = currentStep - 1;
    while (prevStep >= 0 && questions[prevStep].condition && !questions[prevStep].condition(answers)) {
      prevStep--;
    }

    if (prevStep >= 0) {
      setCurrentStep(prevStep);
    } else {
      onBack();
    }
  };

  const handleOptionSelect = (questionId: string, value: string) => {
    if (!currentQuestion) return;
    const newAnswers = { ...answers, [questionId]: value };
    setAnswers(newAnswers);
    setTimeout(() => {
      let nextStep = currentStep + 1;
      while (nextStep < questions.length && questions[nextStep].condition && !questions[nextStep].condition(newAnswers)) {
        nextStep++;
      }

      if (nextStep < questions.length) {
        setCurrentStep(nextStep);
      } else {
        onComplete(newAnswers);
      }
    }, 300);
  };

  const handleMultiSelect = (questionId: string, value: string) => {
    if (!currentQuestion) return;
    setAnswers(prev => {
      const current = prev[questionId] || [];
      const updated = current.includes(value)
        ? current.filter((v: string) => v !== value)
        : [...current, value];
      return { ...prev, [questionId]: updated };
    });
  };

  const handleInputChange = (fieldId: string, value: string) => {
    if (!currentQuestion) return;
    setAnswers(prev => ({
      ...prev,
      [currentQuestion.id]: {
        ...(prev[currentQuestion.id] || {}),
        [fieldId]: value
      }
    }));
  };

  const isInputStepValid = () => {
    if (!currentQuestion) return false;
    if (currentQuestion.type === "multi_select") {
      return (answers[currentQuestion.id] || []).length > 0;
    }
    if (currentQuestion.type !== "input") return true;
    const stepData = answers[currentQuestion.id] || {};
    return currentQuestion.fields.every((f: any) => f.optional || stepData[f.id]?.trim());
  };

  const progress = questions.length > 0 ? ((currentStep + 1) / questions.length) * 100 : 0;

  if (questions.length === 0 || !currentQuestion) {
    return null;
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
            {role === "ngo_business" 
              ? "Register your organization to start donating products, providing services, and tracking your impact."
              : role === "school"
              ? "Register your school to connect with donors and support your students' needs."
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
              ) : currentQuestion.type === "select" ? (
                <div className="grid gap-4">
                  {(typeof currentQuestion.options === 'function' ? currentQuestion.options(answers) : currentQuestion.options).map((option: any) => (
                    <motion.button
                      key={option.id}
                      whileHover={{ x: 5 }}
                      onClick={() => handleOptionSelect(currentQuestion.id, option.value)}
                      className={cn(
                        "w-full bg-white p-6 rounded-[24px] text-left shadow-sm border border-black/5 flex items-center justify-between group hover:border-radiant-pink/30 transition-all active:scale-98",
                        answers[currentQuestion.id] === option.value && "border-radiant-pink ring-4 ring-radiant-pink/5"
                      )}
                    >
                      <span className="text-lg font-medium text-gray-700">{option.text}</span>
                      <div className={cn(
                        "w-6 h-6 rounded-full border-2 border-gray-100 flex items-center justify-center transition-all shrink-0",
                        answers[currentQuestion.id] === option.value && "border-radiant-pink bg-radiant-pink text-white"
                      )}>
                        {answers[currentQuestion.id] === option.value && <div className="w-2 h-2 bg-white rounded-full" />}
                      </div>
                    </motion.button>
                  ))}
                </div>
              ) : currentQuestion.type === "multi_select" ? (
                <div className="space-y-8">
                  <div className="grid gap-4">
                    {currentQuestion.options.map((option: any) => (
                      <motion.button
                        key={option.id}
                        whileHover={{ x: 5 }}
                        onClick={() => handleMultiSelect(currentQuestion.id, option.value)}
                        className={cn(
                          "w-full bg-white p-6 rounded-[24px] text-left shadow-sm border border-black/5 flex items-center justify-between group hover:border-radiant-pink/30 transition-all active:scale-98",
                          (answers[currentQuestion.id] || []).includes(option.value) && "border-radiant-pink ring-4 ring-radiant-pink/5"
                        )}
                      >
                        <span className="text-lg font-medium text-gray-700">{option.text}</span>
                        <div className={cn(
                          "w-6 h-6 rounded-md border-2 border-gray-100 flex items-center justify-center transition-all shrink-0",
                          (answers[currentQuestion.id] || []).includes(option.value) && "border-radiant-pink bg-radiant-pink text-white"
                        )}>
                          {(answers[currentQuestion.id] || []).includes(option.value) && <div className="w-2 h-2 bg-white rounded-full" />}
                        </div>
                      </motion.button>
                    ))}
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleNext}
                    disabled={!isInputStepValid()}
                    className="w-full bg-radiant-pink text-white py-6 rounded-full font-bold uppercase tracking-widest text-sm flex items-center justify-center gap-3 shadow-lg hover:shadow-xl transition-all active:scale-95 disabled:opacity-50 mt-4"
                  >
                    Finish Registration
                    <ArrowRight size={18} />
                  </motion.button>
                </div>
              ) : currentQuestion.type === "link_account" ? (
                <div className="space-y-10">
                  <div className="bg-white p-10 rounded-[40px] border border-black/5 shadow-sm text-center">
                    <div className="w-48 h-48 bg-gray-50 rounded-[32px] mx-auto mb-8 flex items-center justify-center border-2 border-dashed border-gray-200">
                      <QrCode size={80} className="text-gray-300" />
                    </div>
                    <p className="text-sm text-gray-400 mb-8">Scan this code with your child's app to link accounts instantly.</p>
                    
                    <div className="relative">
                      <div className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400">
                        <Mail size={20} />
                      </div>
                      <input
                        type="text"
                        value={answers[currentQuestion.id] || ""}
                        onChange={(e) => setAnswers(prev => ({ ...prev, [currentQuestion.id]: e.target.value }))}
                        placeholder="Enter child's account name"
                        className="w-full bg-gray-50 rounded-[24px] py-6 pl-16 pr-8 shadow-inner border border-black/5 focus:outline-none focus:ring-4 focus:ring-radiant-pink/10 text-lg transition-all"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handleNext}
                      className="w-full bg-radiant-pink text-white py-6 rounded-full font-bold uppercase tracking-widest text-sm flex items-center justify-center gap-3 shadow-lg hover:shadow-xl transition-all active:scale-95"
                    >
                      Send Invite
                      <ArrowRight size={18} />
                    </motion.button>
                    <button
                      onClick={handleNext}
                      className="w-full py-4 text-sm font-bold uppercase tracking-widest text-gray-400 hover:text-radiant-pink transition-colors"
                    >
                      Maybe later
                    </button>
                  </div>
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
