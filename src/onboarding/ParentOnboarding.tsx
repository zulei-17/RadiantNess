import RoleOnboarding from "../components/RoleOnboarding";

interface ParentOnboardingProps {
  onComplete: (data: any) => void;
  onBack: () => void;
}

export default function ParentOnboarding({ onComplete, onBack }: ParentOnboardingProps) {
  return (
    <RoleOnboarding 
      role="parent"
      onComplete={onComplete}
      onBack={onBack}
    />
  );
}
