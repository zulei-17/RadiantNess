import RoleOnboarding from "../components/RoleOnboarding";

interface SchoolOnboardingProps {
  onComplete: (data: any) => void;
}

export default function SchoolOnboarding({ onComplete }: SchoolOnboardingProps) {
  return (
    <RoleOnboarding 
      role="school"
      onComplete={onComplete}
      onBack={() => window.location.reload()}
    />
  );
}
