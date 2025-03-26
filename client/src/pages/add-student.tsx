import Layout from '@/components/layout/Layout';
import AddStudentForm from '@/components/students/AddStudentForm';

export default function AddStudent() {
  return (
    <Layout>
      <div className="space-y-6">
        <h1 className="text-2xl font-homenaje">Add New Student</h1>
        <AddStudentForm />
      </div>
    </Layout>
  );
}
