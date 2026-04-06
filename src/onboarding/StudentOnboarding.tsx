import StudentOnboardingQuiz from "../components/StudentOnboardingQuiz";

interface StudentOnboardingProps {
  onComplete: (data: any) => void;
}

export default function StudentOnboarding({ onComplete }: StudentOnboardingProps) {
  return (
    <StudentOnboardingQuiz 
      onComplete={onComplete}
      onSkip={() => onComplete({ skipped: true })}
      onBack={() => window.location.reload()} // Simple way to go back to role selection for now
    />
  );
}
