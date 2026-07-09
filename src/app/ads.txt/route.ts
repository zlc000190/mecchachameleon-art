import { NextResponse } from 'next/server';

import { getAllConfigs } from '@/shared/models/config';

const DEFAULT_ADSENSE_CODE = 'ca-pub-5387615281666707';
const GAMEPIX_ADS_LINES = [
  '#gpx-property-SM7E1',
  '#gpx-last-updated-2024-11-21',
  '#gpx-reviq',
  'rev.iq, Kf077RYmx6XvWT8mhSbYq7LIQTU, DIRECT',
  'google.com, pub-6729046591418183, DIRECT, f08c47fec0942fa0',
  'Media.net, 8CUUN62FF, DIRECT',
  'openx.com, 540447780, DIRECT, 6a698e2ec38604c6',
  'indexexchange.com, 194018, DIRECT, 50b1c356f2c5c8fc',
  'google.com, pub-6672729658077061, DIRECT, f08c47fec0942fa0',
  'google.com, pub-4996167737872209, DIRECT, f08c47fec0942fa0',
  'google.com, pub-4440077550203864, DIRECT, f08c47fec0942fa0',
  'rubiconproject.com, 20474, DIRECT, 0bfd66d529a55807',
  'rubiconproject.com, 20476, DIRECT, 0bfd66d529a55807',
  'appnexus.com, 11995, DIRECT, f5ab79cb980f11d1',
  'pubmatic.com, 158150, DIRECT, 5d62403b186f2ace',
  'pubmatic.com, 160474, DIRECT, 5d62403b186f2ace',
  'google.com, pub-5285623249468085, DIRECT, f08c47fec0942fa0',
  'google.com, pub-8435989769185680, DIRECT, f08c47fec0942fa0',
  '# 33across',
  '33across.com, 001Pg00000G3qqWIAR, DIRECT, bbea06d9c4d2853c #33Across #hb #tag',
  'appnexus.com, 10239, RESELLER, f5ab79cb980f11d1 #33Across #hb #tag #viewable',
  'conversantmedia.com, 100141, RESELLER, 03113cd04947736d #hb #tag #video',
  'video.unrulymedia.com, 2439829435, DIRECT',
  'pubmatic.com, 156423, RESELLER, 5d62403b186f2ace #33Across #hb #tag',
  'triplelift.com, 12503, RESELLER, 6c33edb13117fd86',
  'rubiconproject.com, 16414, RESELLER, 0bfd66d529a55807 #33Across #hb #tag',
  'contextweb.com, 561516, RESELLER, 89ff185a4c4e857c',
  'loopme.com, 11575, RESELLER, 6c8d5f95897a5a3b',
  'rubiconproject.com, 21642, RESELLER, 0bfd66d529a55807 #33Across #hb #tag #viewable',
  'openx.com, 537120563, RESELLER, 6a698e2ec38604c6 #33Across #hb #tag',
  'adyoulike.com, 1f301d3bcd723f5c372070bdfd142940, RESELLER',
];

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
  const adsContent = [
    `google.com, ${normalizedAdSenseCode}, DIRECT, f08c47fec0942fa0`,
    ...GAMEPIX_ADS_LINES,
  ].join('\n');

  return new NextResponse(adsContent, {
    status: 200,
    headers: {
      'Content-Type': 'text/plain',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  });
}
