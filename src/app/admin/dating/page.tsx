import { createServiceRoleClient } from '@/utils/supabase/service-role';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserCheck, faUserTimes, faVenusMars, faCamera, faEnvelope } from '@fortawesome/free-solid-svg-icons';
import Link from 'next/link';

const StatCard = ({ title, value, icon }: { title: string, value: number, icon: any }) => (
  <div className="bg-white p-6 rounded-lg shadow-md flex items-center space-x-4">
    <FontAwesomeIcon icon={icon} className="text-3xl text-primary" />
    <div>
      <p className="text-gray-600 text-sm">{title}</p>
      <p className="text-2xl font-bold">{value}</p>
    </div>
  </div>
);

const AdminDatingPage = async () => {
  const supabase = createServiceRoleClient();

  const { count: totalProfiles } = await supabase.from('dating_profiles').select('*', { count: 'exact', head: true });
  const { count: validatedProfiles } = await supabase.from('dating_profiles').select('*', { count: 'exact', head: true }).eq('is_validated', true);
  const { count: pendingProfiles } = await supabase.from('dating_profiles').select('*', { count: 'exact', head: true }).eq('is_validated', false);

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Modération de la Section Rencontre</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <StatCard title="Profils au total" value={totalProfiles || 0} icon={faVenusMars} />
        <StatCard title="Profils validés" value={validatedProfiles || 0} icon={faUserCheck} />
        <StatCard title="Profils en attente" value={pendingProfiles || 0} icon={faUserTimes} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Link href="/admin/dating/profiles" className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition-shadow">
          <h2 className="text-xl font-bold flex items-center"><FontAwesomeIcon icon={faUserCheck} className="mr-3 text-primary" />Gestion des profils</h2>
          <p className="text-gray-600 mt-2">Valider, bannir, et gérer les utilisateurs de la section rencontre.</p>
        </Link>
        <Link href="/admin/dating/photos" className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition-shadow">
          <h2 className="text-xl font-bold flex items-center"><FontAwesomeIcon icon={faCamera} className="mr-3 text-primary" />Modération des photos</h2>
          <p className="text-gray-600 mt-2">Visualiser et modérer les photos de profil.</p>
        </Link>
        <Link href="/admin/dating/reports" className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition-shadow">
          <h2 className="text-xl font-bold flex items-center"><FontAwesomeIcon icon={faEnvelope} className="mr-3 text-primary" />Messages signalés</h2>
          <p className="text-gray-600 mt-2">Consulter les conversations signalées par les utilisateurs.</p>
        </Link>
      </div>
    </div>
  );
};

export default AdminDatingPage;
