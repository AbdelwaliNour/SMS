import { ValidationExampleForm } from '@/components/ui/validation-example-form';

export default function FormValidationDemo() {
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold mb-2">Form Validation Demo</h1>
        <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          This page demonstrates the enhanced form validation components with visual feedback,
          animations, and field state indicators. Try filling out the form to see validation in action.
        </p>
      </div>
      
      <ValidationExampleForm />
      
      <div className="mt-12 max-w-2xl mx-auto">
        <h2 className="text-2xl font-bold mb-4">Features</h2>
        <ul className="list-disc pl-6 space-y-2">
          <li>Real-time validation with visual feedback</li>
          <li>Field state indicators (error/success) with animated icons</li>
          <li>Descriptive error messages with slide-in animations</li>
          <li>Character counter for text fields with maximum length</li>
          <li>Required field indicators</li>
          <li>Section-based form organization</li>
          <li>Robust validation rules with comprehensive feedback</li>
          <li>Password strength validation with specific requirements</li>
          <li>Responsive layout for all screen sizes</li>
        </ul>
      </div>
    </div>
  );
}