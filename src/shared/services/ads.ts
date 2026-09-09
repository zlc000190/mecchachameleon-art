import {
  AdsenseProvider,
  AdsManager,
  AdsterraProvider,
} from '@/extensions/ads';
import { ADSTERRA } from '@/extensions/ads/adsterra-config';
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

  // adsterra popunder（2026-09-09 恢复；env 设 off 就回去）
  if (ADSTERRA.popunderSrc) {
    ads.addProvider(
      new AdsterraProvider({ popunderSrc: ADSTERRA.popunderSrc })
    );
  }

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
