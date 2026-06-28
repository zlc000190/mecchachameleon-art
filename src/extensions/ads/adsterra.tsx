import { ReactNode } from 'react';

import { AdsConfigs, AdsProvider } from '@/extensions/ads';

export interface AdsterraConfigs extends AdsConfigs {
  popunderSrc: string;
}

export interface AdsterraNativeBannerProps {
  className?: string;
  containerId: string;
  invokeSrc: string;
}

export class AdsterraProvider implements AdsProvider {
  readonly name = 'adsterra';

  configs: AdsterraConfigs;

  constructor(configs: AdsterraConfigs) {
    this.configs = configs;
  }

  getHeadScripts(): ReactNode {
    return <script async src={this.configs.popunderSrc}></script>;
  }

  getBodyScripts(): ReactNode {
    return null;
  }

  getMetaTags(): ReactNode {
    return null;
  }
}

export function AdsterraNativeBanner({
  className,
  containerId,
  invokeSrc,
}: AdsterraNativeBannerProps) {
  const isEnabled =
    process.env.NODE_ENV === 'production' ||
    process.env.NEXT_PUBLIC_DEBUG === 'true';

  if (!isEnabled) {
    return null;
  }

  return (
    <div className={className}>
      <script async data-cfasync="false" src={invokeSrc}></script>
      <div id={containerId}></div>
    </div>
  );
}
