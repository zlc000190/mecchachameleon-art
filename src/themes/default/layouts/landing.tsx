import { ReactNode } from 'react';
import Link from 'next/link';

import { getThemeBlock } from '@/core/theme';
import {
  Footer as FooterType,
  Header as HeaderType,
} from '@/shared/types/blocks/landing';

export default async function LandingLayout({
  children,
  header,
  footer,
}: {
  children: ReactNode;
  header: HeaderType;
  footer: FooterType;
}) {
  const Header = await getThemeBlock('header');
  const Footer = await getThemeBlock('footer');

  return (
    <div className="h-screen w-screen">
      <Header header={header} />
      <aside className="border-b border-amber-300 bg-amber-50 px-4 pt-24 pb-3 text-center text-xs leading-5 text-amber-950 sm:text-sm">
        Independent fan site — not affiliated with lemorion_1224. The official
        MECCHA CHAMELEON is the paid Windows PC game on Steam. Browser games
        listed here are separate third-party or fan-made titles.{' '}
        <Link href="/about" className="font-semibold underline">
          About this site
        </Link>
      </aside>
      {children}
      <Footer footer={footer} />
    </div>
  );
}
