import { notFound } from 'next/navigation';
import NgoDashboardWorkspace from '@/Components/ngo/NgoDashboardWorkspace';

const validSections = new Set([
  'dashboard',
  'audits',
  'drives',
  'messages',
  'workers',
  'doctors',
  'donors',
  'notifications',
  'decisions',
  'media',
  'blogs',
]);

export default  async function NgoSectionPage({ params }) {
  const resolvedParams = await params;
  const section = resolvedParams?.section;

  if (!validSections.has(section)) {
    notFound();
  }

  return <NgoDashboardWorkspace activeView={section} />;
}
