import Layout from '@/components/layout/Layout';
import EmployeesTable from '@/components/employees/EmployeesTable';
import { useLocation } from 'wouter';

export default function Employees() {
  const [, navigate] = useLocation();
  
  const goToAddEmployee = () => {
    navigate('/add-employee');
  };

  return (
    <Layout>
      <div className="space-y-6">
        <h1 className="text-2xl font-homenaje">Employees Management</h1>
        <EmployeesTable onAddEmployee={goToAddEmployee} />
      </div>
    </Layout>
  );
}
