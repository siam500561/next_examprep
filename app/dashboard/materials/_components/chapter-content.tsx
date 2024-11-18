"use client";

import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { prism } from "react-syntax-highlighter/dist/esm/styles/prism";
interface ChapterContentProps {
  chapter: {
    title: string;
    summary: string;
  };
  notes: any;
}

export function ChapterContent({ chapter, notes }: ChapterContentProps) {
  const notesData = JSON.parse(notes?.notes || notes || "{}");

  return (
    <div className="flex-1 container pb-6 flex flex-col">
      <Tabs defaultValue="notes" className="flex-1 flex flex-col">
        <div className="bg-gray-50 border-b">
          <TabsList className="w-full justify-start h-auto p-0 bg-transparent">
            <TabsTrigger
              value="notes"
              className="data-[state=active]:bg-white rounded-none border-b-2 data-[state=active]:border-primary data-[state=active]:shadow-none px-6 py-3"
            >
              Study Notes
            </TabsTrigger>
            <TabsTrigger
              value="summary"
              className="data-[state=active]:bg-white rounded-none border-b-2 data-[state=active]:border-primary data-[state=active]:shadow-none px-6 py-3"
            >
              Chapter Summary
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent
          value="notes"
          className="flex-1 mt-0 border-0 p-6 bg-white"
        >
          <div className="space-y-8">
            {/* Key Concepts */}
            <div>
              <h3 className="text-xl font-semibold mb-4">Key Concepts</h3>
              <Card className="p-6">
                <ul className="list-disc list-inside space-y-2">
                  {notesData?.key_concepts?.map(
                    (concept: string, i: number) => (
                      <li key={i} className="text-gray-600">
                        {concept}
                      </li>
                    )
                  )}
                </ul>
              </Card>
            </div>

            {/* Detailed Explanations */}
            <div>
              <h3 className="text-xl font-semibold mb-4">
                Detailed Explanations
              </h3>
              <Card className="p-6">
                <div className="space-y-6">
                  {Object.entries(notesData?.explanations || {}).map(
                    ([concept, explanation]: [string, any], i) => (
                      <div key={i}>
                        <h4 className="font-medium text-primary mb-2">
                          {concept}
                        </h4>
                        <p className="text-gray-600">{explanation}</p>
                      </div>
                    )
                  )}
                </div>
              </Card>
            </div>

            {/* Examples */}
            <div>
              <h3 className="text-xl font-semibold mb-4">Examples</h3>
              <Card className="p-6">
                <div className="space-y-6">
                  {notesData?.examples?.map((example: any, i: number) => (
                    <div key={i} className="space-y-2">
                      <h4 className="font-medium text-primary">
                        {example.title}
                      </h4>
                      <p className="text-gray-600">{example.description}</p>
                      {example.code && (
                        <div className="rounded-lg overflow-hidden">
                          <SyntaxHighlighter
                            language="javascript" // or any other language
                            style={prism}
                            customStyle={{
                              margin: 0,
                              padding: "1rem",
                              fontSize: "0.875rem",
                            }}
                          >
                            {example.code}
                          </SyntaxHighlighter>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </Card>
            </div>

            {/* Practice Questions */}
            <div>
              <h3 className="text-xl font-semibold mb-4">Practice Questions</h3>
              <Card className="p-6">
                <div className="space-y-6">
                  {notesData?.practice_questions?.map((qa: any, i: number) => (
                    <div key={i} className="space-y-2">
                      <p className="font-medium text-gray-900">
                        Q: {qa.question}
                      </p>
                      <p className="text-gray-600">A: {qa.answer}</p>
                    </div>
                  ))}
                </div>
              </Card>
            </div>

            {/* Additional Resources */}
            <div>
              <h3 className="text-xl font-semibold mb-4">
                Additional Resources
              </h3>
              <Card className="p-6">
                <div className="space-y-4">
                  {notesData?.additional_resources?.map(
                    (resource: any, i: number) => (
                      <div key={i} className="space-y-1">
                        <h4 className="font-medium text-primary">
                          {resource.title}
                        </h4>
                        <p className="text-xs text-gray-500 uppercase">
                          {resource.type}
                        </p>
                        <p className="text-gray-600">{resource.description}</p>
                      </div>
                    )
                  )}
                </div>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="summary" className="mt-0 border-0 p-6 bg-white">
          <Card className="p-6">
            <p className="text-gray-600">{chapter.summary}</p>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
