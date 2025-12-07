import GenerativeBackground from "@app/components/helpers/GenerativeBackground";

export default function FormV2TestPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 overflow-auto">
      <div className="container mx-auto py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">FormV2 Components Demo</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Testing the new optimized Form components with native MUI integration
          </p>
        </div>
        <GenerativeBackground />
      </div>
    </div>
  );
}
