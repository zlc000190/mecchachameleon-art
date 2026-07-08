import { NextResponse } from 'next/server';

import { getAllConfigs } from '@/shared/models/config';

const DEFAULT_ADSENSE_CODE = 'ca-pub-5387615281666707';

export async function GET() {
  let adsenseCode = '';

  try {
    const configs = await getAllConfigs();
    if (configs.adsense_code) {
      adsenseCode = configs.adsense_code;
    }
  } catch (error) {
    console.error('read adsense_code from configs failed:', error);
  }

  if (!adsenseCode) {
    adsenseCode = DEFAULT_ADSENSE_CODE;
  }

  const normalizedAdSenseCode = adsenseCode.replace(/^ca-/, '');
  const adsContent = `google.com, ${normalizedAdSenseCode}, DIRECT, f08c47fec0942fa0`;

  return new NextResponse(adsContent, {
    status: 200,
    headers: {
      'Content-Type': 'text/plain',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  });
}
