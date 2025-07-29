import { createClient } from '@/utils/supabase/server';
import Link from 'next/link';

const AdminDatingReportsPage = async () => {
  const supabase = createClient();

  const { data: reports, error } = await supabase
    .from('reported_messages')
    .select('*, reporter:profiles!reporter_id(username), reported:profiles!reported_user_id(username), message:messages(content)')
    .order('created_at', { ascending: false });

  if (error) {
    return <p className="text-red-500">Erreur lors du chargement des signalements: {error.message}. Avez-vous appliqué la nouvelle migration ?</p>;
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Messages Signalés</h1>
      <div className="bg-white p-8 rounded-lg shadow-md">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Signalé par</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Utilisateur signalé</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Message</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {reports.map((report: any) => (
              <tr key={report.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{report.reporter.username}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{report.reported.username}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 truncate max-w-xs">{report.message.content}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(report.created_at).toLocaleString('fr-FR')}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  {/* Actions will be added here */}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminDatingReportsPage;
