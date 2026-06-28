import {
  AdsenseProvider,
  AdsManager,
  AdsterraProvider,
} from '@/extensions/ads';
import { Configs, getAllConfigs } from '@/shared/models/config';

/**
 * get ads manager with configs
 */
export function getAdsManagerWithConfigs(configs: Configs) {
  const ads = new AdsManager();

  // adsense
  if (configs.adsense_code) {
    ads.addProvider(new AdsenseProvider({ adId: configs.adsense_code }));
  }

  ads.addProvider(
    new AdsterraProvider({
      popunderSrc:
        'https://pl30105393.effectivecpmnetwork.com/0a/2b/5b/0a2b5bb2f1a96e1b689409e8ea42d91f.js',
    })
  );

  return ads;
}

/**
 * global ads service
 */
let adsService: AdsManager | null = null;

/**
 * get ads service instance
 */
export async function getAdsService(configs?: Configs): Promise<AdsManager> {
  if (!configs) {
    configs = await getAllConfigs();
  }
  adsService = getAdsManagerWithConfigs(configs);

  return adsService;
}
