import Layout from '@/components/layout/Layout';
import AddEmployeeForm from '@/components/employees/AddEmployeeForm';

export default function AddEmployee() {
  return (
    <Layout>
      <div className="space-y-6">
        <h1 className="text-2xl font-homenaje">Add New Employee</h1>
        <AddEmployeeForm />
      </div>
    </Layout>
  );
}
