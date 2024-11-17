import { CreateOnboarding } from "./_components/create-onboarding";

export default function CreatePage() {
  return (
    <div className="flex-1 h-full max-w-3xl mx-auto py-12">
      <div className="space-y-2 text-center">
        <h1 className="text-3xl font-bold text-primary">
          Start Building Your Personal Study Material
        </h1>
        <p className="text-muted-foreground">
          Fill All details in order to generate study material for your next
          project
        </p>
      </div>

      <CreateOnboarding />
    </div>
  );
}
