import RoleOnboarding from "../components/RoleOnboarding";

interface NGOOnboardingProps {
  onComplete: (data: any) => void;
  onBack: () => void;
}

export default function NGOOnboarding({ onComplete, onBack }: NGOOnboardingProps) {
  return (
    <RoleOnboarding 
      role="ngo_business"
      onComplete={onComplete}
      onBack={onBack}
    />
  );
}
