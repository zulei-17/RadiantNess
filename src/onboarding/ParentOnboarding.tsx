import RoleOnboarding from "../components/RoleOnboarding";

interface ParentOnboardingProps {
  onComplete: (data: any) => void;
}

export default function ParentOnboarding({ onComplete }: ParentOnboardingProps) {
  return (
    <RoleOnboarding 
      role="parent"
      onComplete={onComplete}
      onBack={() => window.location.reload()}
    />
  );
}
