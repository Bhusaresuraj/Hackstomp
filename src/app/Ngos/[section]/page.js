import { notFound } from 'next/navigation';
import NgoDashboardWorkspace from '@/Components/ngo/NgoDashboardWorkspace';

const validSections = new Set([
  'dashboard',
  'drives',
  'doctors',
  'donors',
  'notifications',
  'decisions',
  'media',
  'blogs',
]);

export default  async function NgoSectionPage({ params }) {
  conasole.log(params);
  const section = await params?.section;

  if (!validSections.has(section)) {
    notFound();
  }

  return <NgoDashboardWorkspace activeView={section} />;
}
