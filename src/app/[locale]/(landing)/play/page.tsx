import { permanentRedirect } from 'next/navigation';

import { getLocalizedPath } from '@/shared/blocks/meccha/meccha-i18n';

export default async function PlayEntryPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  // Keep one ranking URL for the unblocked intent. /play is a memorable
  // acquisition entry, while /unblocked remains the canonical content page.
  permanentRedirect(getLocalizedPath(locale, '/unblocked'));
}
