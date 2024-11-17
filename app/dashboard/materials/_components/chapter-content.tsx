"use client";

interface ChapterContentProps {
  notes: any;
}

export function ChapterContent({ notes }: ChapterContentProps) {
  const notesData =
    typeof notes === "string" ? JSON.parse(notes) : notes?.notes || notes;
  return (
    <div className="flex-1 py-8">
      <div className="container max-w-3xl mx-auto space-y-8">
        {/* Key Concepts */}
        <section>
          <h2 className="text-2xl font-bold mb-4">Key Concepts</h2>
          <ul className="space-y-2 list-disc pl-6">
            {notesData?.key_concepts?.map((concept: string, i: number) => (
              <li key={i} className="text-gray-700">
                {concept}
              </li>
            ))}
          </ul>
        </section>

        {/* Detailed Explanations */}
        <section>
          <h2 className="text-2xl font-bold mb-4">Detailed Explanations</h2>
          <div className="space-y-6">
            {Object.entries(notesData?.explanations || {}).map(
              ([concept, explanation]: [string, any], i) => (
                <div key={i} className="space-y-2">
                  <h3 className="text-lg font-semibold">{concept}</h3>
                  <p className="text-gray-700 leading-relaxed">{explanation}</p>
                </div>
              )
            )}
          </div>
        </section>

        {/* Examples */}
        <section>
          <h2 className="text-2xl font-bold mb-4">Examples</h2>
          <div className="space-y-6">
            {notesData?.examples?.map((example: any, i: number) => (
              <div key={i} className="space-y-2">
                <h3 className="text-lg font-semibold">{example.title}</h3>
                <p className="text-gray-700 mb-2">{example.description}</p>
                {example.code && (
                  <pre className="bg-gray-50 p-4 rounded-lg overflow-x-auto">
                    <code className="text-sm">{example.code}</code>
                  </pre>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Practice Questions */}
        <section>
          <h2 className="text-2xl font-bold mb-4">Practice Questions</h2>
          <div className="space-y-6">
            {notesData?.practice_questions?.map((qa: any, i: number) => (
              <div key={i} className="space-y-2">
                <p className="font-semibold">Q: {qa.question}</p>
                <p className="text-gray-700">A: {qa.answer}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Additional Resources */}
        <section>
          <h2 className="text-2xl font-bold mb-4">Additional Resources</h2>
          <div className="space-y-4">
            {notesData?.additional_resources?.map(
              (resource: any, i: number) => (
                <div key={i} className="space-y-1">
                  <h3 className="text-lg font-semibold">{resource.title}</h3>
                  <p className="text-sm text-gray-500">{resource.type}</p>
                  <p className="text-gray-700">{resource.description}</p>
                </div>
              )
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
