import Layout from '@/components/layout/Layout';
import EnhancedAddEmployeeForm from '@/components/employees/EnhancedAddEmployeeForm';

export default function AddEmployee() {
  return (
    <Layout>
      <div className="space-y-6">
        <h1 className="text-2xl font-homenaje">Add New Employee</h1>
        <EnhancedAddEmployeeForm />
      </div>
    </Layout>
  );
}
