import StudentOnboardingQuiz from "../components/StudentOnboardingQuiz";

interface StudentOnboardingProps {
  onComplete: (data: any) => void;
  onBack: () => void;
}

export default function StudentOnboarding({ onComplete, onBack }: StudentOnboardingProps) {
  return (
    <StudentOnboardingQuiz 
      onComplete={onComplete}
      onBack={onBack}
    />
  );
}
