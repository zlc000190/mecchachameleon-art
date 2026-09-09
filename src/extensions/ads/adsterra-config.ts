/**
 * Adsterra 投放位配置（2026-09-09 恢复广告时建）。
 *
 * 为什么单独拎出来 + 留 env 覆盖口：Adsterra 会换投递域名（这两条的域名从
 * `pl301053xx.effectivecpmnetwork.com` 变成 `pl301053xx.profitableratecpmnetwork.com`，
 * **zone / container id 一个都没变**）。写死在页面里 = 每次换域名要改 3 个文件；
 * 现在设 `NEXT_PUBLIC_ADSTERRA_POPUNDER` / `NEXT_PUBLIC_ADSTERRA_INVOKE` 就能换，
 * 设成 `off` 就整体关掉（对应位不再渲染）。
 *
 * 记一笔：popunder（弹层）与 AdSense 审核冲突。要申请 AdSense 的站点先把弹层关掉。
 */

const POPUNDER_DEFAULT =
  'https://pl30105393.profitableratecpmnetwork.com/0a/2b/5b/0a2b5bb2f1a96e1b689409e8ea42d91f.js';
const INVOKE_DEFAULT =
  'https://pl30105394.profitableratecpmnetwork.com/b59ba82077f589c928c05fdf83f0e6e0/invoke.js';
const CONTAINER_DEFAULT = 'container-b59ba82077f589c928c05fdf83f0e6e0';

/** env 优先；`off` = 关掉；没设 = 用仓库里的默认投放位。 */
function pick(raw: string | undefined, fallback: string) {
  const v = (raw || '').trim();
  if (v === 'off') return '';
  return v || fallback;
}

const invoke = pick(process.env.NEXT_PUBLIC_ADSTERRA_INVOKE, INVOKE_DEFAULT);

export const ADSTERRA = {
  popunderSrc: pick(
    process.env.NEXT_PUBLIC_ADSTERRA_POPUNDER,
    POPUNDER_DEFAULT
  ),
  native: {
    containerId: CONTAINER_DEFAULT,
    invokeSrc: invoke,
    disabled: !invoke,
  },
};
