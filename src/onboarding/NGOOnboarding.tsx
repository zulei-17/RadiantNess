import RoleOnboarding from "../components/RoleOnboarding";

interface NGOOnboardingProps {
  onComplete: (data: any) => void;
}

export default function NGOOnboarding({ onComplete }: NGOOnboardingProps) {
  return (
    <RoleOnboarding 
      role="ngo_business"
      onComplete={onComplete}
      onBack={() => window.location.reload()}
    />
  );
}
