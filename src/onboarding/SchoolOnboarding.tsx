import RoleOnboarding from "../components/RoleOnboarding";

interface SchoolOnboardingProps {
  onComplete: (data: any) => void;
  onBack: () => void;
}

export default function SchoolOnboarding({ onComplete, onBack }: SchoolOnboardingProps) {
  return (
    <RoleOnboarding 
      role="school"
      onComplete={onComplete}
      onBack={onBack}
    />
  );
}
