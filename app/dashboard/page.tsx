import Header from "./_components/header";
import NoNotes from "./_components/no-notes";

export default function Dashboard() {
  return (
    <div className="w-full p-2 h-full flex flex-col gap-2">
      <Header />
      <NoNotes />
    </div>
  );
}
