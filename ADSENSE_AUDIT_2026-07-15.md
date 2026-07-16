# AdSense Site Audit — mecchachameleon.art

Date: 2026-07-15

Scope: live site, local Next.js repository, public crawler files, and the 73-item `adsense-site-auditor` checklist.
Decision: **Not ready to resubmit yet.** The repository has been materially remediated, but the live site still serves the old build. Deploy, verify, and close the ownership/consent unknowns before resubmission.

AdSense rejection reason supplied by the publisher: **Low-value content / 低质量内容**.

This rejection maps primarily to `ADS-CONTENT-01`, `ADS-CONTENT-02`, `ADS-CONTENT-03`, `ADS-CONTENT-08`, and `ADS-PUB-11`. The old production build contains a large number of search-targeted and embedded-game pages, repeated template copy, keyword-heavy sections, and insufficiently clear original value. The local remediation disables advertising on unreviewed pages and strengthens content trust signals. Sitemap, robots directives, metadata, and existing SEO sections were left unchanged at the publisher's request. Google must recrawl the eventual approved build before the rejection can be considered addressed.

## Highest-priority findings

1. **Review the remediated build before deployment.** Production still contains an Adsterra popunder/native ad, misleading “official/free browser version” language, a frame-protection bypass, and missing trust pages. The local build removes or corrects these. No deployment is authorized yet.
2. **Resolve media and trademark rights.** Confirm permission or a defensible license for every map screenshot, logo, game image, and third-party embed. Replace anything without documented rights with self-created or licensed media.
3. **Use a Google-certified CMP before enabling ads for EEA/UK/Swiss visitors.** The new local notice records a storage preference, but it is not a certified AdSense consent platform. Keep advertising disabled until this is configured.
4. **Confirm account facts.** Applicant age, duplicate-account status, AdSense site-list status, traffic sources, and invalid-traffic practices cannot be proven from source code. The supplied rejection reason is “低质量内容”.

## Local remediation completed

- Removed the global Adsterra popunder and homepage native-ad block.
- Disabled advertising, analytics, affiliate, and support scripts by default behind explicit environment flags.
- Removed the custom `x-frame-bypass` implementation and stopped presenting third-party browser games as the official product.
- Added visible independent-fan-site disclosures and corrected the primary English page claims.
- Added About, Contact, Editorial Policy, expanded Privacy Policy, and strengthened Terms.
- Left existing sitemap, robots directives, metadata, and SEO content unchanged for publisher review.
- Kept the existing Google publisher meta/`ads.txt` verification path.

## Complete 73-item checklist

Statuses describe the site as it exists **now**. “Fixed locally” items remain Fail until the new build is deployed and fetched successfully.

| Requirement    | Status  | Evidence / next action                                                                                                                                      |
| -------------- | ------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------- |
| ADS-ELIG-01    | Unknown | Confirm the AdSense account holder is at least 18 or uses an eligible guardian account.                                                                     |
| ADS-ELIG-02    | Unknown | Confirm the publisher does not have a duplicate AdSense account.                                                                                            |
| ADS-ELIG-03    | Fail    | Current production still has policy-risk behavior; deploy the local remediation and re-audit.                                                               |
| ADS-ELIG-04    | N/A     | This is a standalone Next.js website, not a Blogger/YouTube hosted-account application.                                                                     |
| ADS-OWN-01     | Pass    | Repository and `<head>` injection path are available and were successfully built.                                                                           |
| ADS-OWN-02     | Unknown | Domain control is strongly implied by the project, but ownership should be confirmed in AdSense/Search Console.                                             |
| ADS-OWN-03     | Pass    | The production build renders normally with JavaScript support.                                                                                              |
| ADS-SITE-01    | Unknown | Check that the domain is added, verified, and shows the correct review state in AdSense.                                                                    |
| ADS-SITE-02    | Pass    | Publisher meta tag and `ads.txt` verification mechanisms exist.                                                                                             |
| ADS-TXT-01     | Pass    | `/ads.txt` exposes Google publisher `pub-5387615281666707`; confirm it matches the applying account.                                                        |
| ADS-TXT-02     | Pass    | An authorized-seller file is published at the domain root.                                                                                                  |
| ADS-CONTENT-01 | Fail    | Google explicitly rejected the current site for low-quality content. The curated local guide/tool inventory is improved but must be deployed and recrawled. |
| ADS-CONTENT-02 | Unknown | Original commentary exists, but image/embed rights and source permissions need written verification.                                                        |
| ADS-CONTENT-03 | Fail    | Production still exposes thin listings and embedded-game detail pages. The retained local core is more substantial but is not live yet.                     |
| ADS-CONTENT-04 | Pass    | No under-construction or ad-only state was found in the retained local core.                                                                                |
| ADS-CONTENT-05 | Fail    | Production still loads third-party advertising; local code removes it pending deployment.                                                                   |
| ADS-CONTENT-06 | Pass    | Primary and retained localized content uses AdSense-supported languages.                                                                                    |
| ADS-CONTENT-07 | N/A     | No public comments or user-submission system was identified.                                                                                                |
| ADS-CONTENT-08 | Fail    | Keyword/doorway inventory remains a low-quality-content risk. SEO-related remediation is intentionally deferred for publisher review.                       |
| ADS-UX-01      | Pass    | Header/footer and primary content paths are clear in the local build.                                                                                       |
| ADS-UX-02      | Pass    | The local disclosures explain the fan-guide purpose and distinguish official and third-party games.                                                         |
| ADS-UX-03      | Fail    | Production uses misleading official/play framing; corrected locally but not deployed.                                                                       |
| ADS-UX-04      | Fail    | Production still includes popunder behavior and a frame-protection bypass; removed locally.                                                                 |
| ADS-UX-05      | Fail    | About, Contact, and Editorial Policy are 404 on production; the new local pages build successfully.                                                         |
| ADS-UX-06      | Pass    | Local review build contains no active ad-like blocks or confusing ad placement.                                                                             |
| ADS-CRAWL-01   | Pass    | Homepage and representative production pages are publicly reachable; new trust pages await deployment.                                                      |
| ADS-CRAWL-02   | Pass    | No login wall was found and `robots.txt` is publicly accessible.                                                                                            |
| ADS-CRAWL-03   | Pass    | Core pages are viewable with ordinary GET requests.                                                                                                         |
| ADS-CRAWL-04   | Pass    | No excessive redirect chain was observed on the public core routes.                                                                                         |
| ADS-CRAWL-05   | Pass    | Core URLs are stable and do not contain per-user session identifiers.                                                                                       |
| ADS-CRAWL-06   | Pass    | DNS, TLS, and hosting respond publicly. Continue normal uptime monitoring.                                                                                  |
| ADS-CRAWL-07   | Pass    | The existing sitemap generation and stable internal routes remain unchanged.                                                                                |
| ADS-PROG-01    | Unknown | Confirm no self-clicking, bot impressions, incentivized visits, or automated ad testing occurs.                                                             |
| ADS-PROG-02    | Pass    | No copy asking visitors to click or support the site through ads was found.                                                                                 |
| ADS-PROG-03    | Pass    | Local review build has no ad unit that could be disguised as site content.                                                                                  |
| ADS-PROG-04    | Unknown | Review Analytics/Search Console and outreach logs for paid-to-click, exchange, spam, or bot traffic.                                                        |
| ADS-PROG-05    | Pass    | Google ad code is not modified; all ad loading is disabled by default locally.                                                                              |
| ADS-PROG-06    | Fail    | Production uses a popunder and framed third-party content; local code removes the popunder/bypass and disables ads.                                         |
| ADS-PROG-07    | N/A     | This audit covers a normal website, not an app WebView.                                                                                                     |
| ADS-PUB-01     | Pass    | No illegal products, downloads, or activity instructions were found in the retained core content.                                                           |
| ADS-PUB-02     | Unknown | Copyright/trademark permission for screenshots, logos, images, and embeds must be documented.                                                               |
| ADS-PUB-03     | Pass    | No hate, harassment, terrorism, self-harm promotion, or violent praise was found.                                                                           |
| ADS-PUB-04     | N/A     | No animal-cruelty or endangered-species commerce content applies.                                                                                           |
| ADS-PUB-05     | Fail    | Production misstates official affiliation/product status; prominent local disclosures correct this after deployment.                                        |
| ADS-PUB-06     | Pass    | No phishing, credential theft, or deceptive financial/service scheme was found.                                                                             |
| ADS-PUB-07     | Pass    | No hacking, cheating, surveillance, or dishonest-behavior enablement was found.                                                                             |
| ADS-PUB-08     | Pass    | No sexual services, exploitation, or adult-theme-in-family-content material was found.                                                                      |
| ADS-PUB-09     | Pass    | Site metadata and Google seller information are present; confirm the publisher ID against AdSense.                                                          |
| ADS-PUB-10     | Pass    | The local review build has no ad layout that overlaps or obstructs content.                                                                                 |
| ADS-PUB-11     | Fail    | Production still exposes thin/embedded pages with monetization scripts; local review flags disable ads and reduce indexing.                                 |
| ADS-PUB-12     | Pass    | No active local ad placements appear off-screen or out of context.                                                                                          |
| ADS-PUB-13     | N/A     | No elections, harmful health, or climate-consensus claims are in scope.                                                                                     |
| ADS-PUB-14     | N/A     | No manipulated public-issue media is in scope.                                                                                                              |
| ADS-PUB-15     | Pass    | No child-endangerment or sexualization signals were found.                                                                                                  |
| ADS-PUB-16     | N/A     | The site does not monetize crisis or sensitive-event coverage.                                                                                              |
| ADS-REST-01    | N/A     | No sexual/restricted sexual content was found.                                                                                                              |
| ADS-REST-02    | Pass    | The retained core does not center graphic shock content or prominent obscenity.                                                                             |
| ADS-REST-03    | N/A     | No weapons or explosives content applies.                                                                                                                   |
| ADS-REST-04    | N/A     | No tobacco or recreational-drug content applies.                                                                                                            |
| ADS-REST-05    | N/A     | No alcohol sales or irresponsible-drinking promotion applies.                                                                                               |
| ADS-REST-06    | N/A     | No paid gambling or games of chance apply.                                                                                                                  |
| ADS-REST-07    | N/A     | No prescription-drug, pharmacy, or unapproved supplement content applies.                                                                                   |
| ADS-REST-08    | Pass    | Advertising is disabled in the local review build, so no ad/video obstruction exists.                                                                       |
| ADS-PRIV-01    | Fail    | Production privacy disclosure is incomplete; the expanded local policy must be deployed.                                                                    |
| ADS-PRIV-02    | Fail    | Third-party cookie/beacon/IP disclosure is added locally but not live yet.                                                                                  |
| ADS-PRIV-03    | Unknown | Recheck production request URLs and analytics/ad configuration after enabling any scripts.                                                                  |
| ADS-PRIV-04    | Unknown | Install/configure a Google-certified CMP before enabling AdSense for EEA/UK/Swiss traffic.                                                                  |
| ADS-PRIV-05    | N/A     | No precise-location collection was identified.                                                                                                              |
| ADS-PRIV-06    | Pass    | The site is a general-audience fan guide and does not enable interest-based child targeting locally.                                                        |
| ADS-PRIV-07    | Pass    | No code modifies, intercepts, or deletes cookies on Google domains.                                                                                         |
| ADS-PRIV-08    | Pass    | Ad/analytics personalization scripts are disabled by default and no sensitive audience lists were found.                                                    |
| ADS-PRIV-09    | N/A     | Housing, employment, and credit ad targeting are outside this site's scope.                                                                                 |
| ADS-PRIV-10    | N/A     | Personalized ads are currently disabled; reassess before enabling them.                                                                                     |

## Resubmission gate

Do not resubmit until all of the following are true:

- Deploy the current local build and confirm the live homepage/trust pages match it.
- Confirm no Adsterra/effectivecpmnetwork, popunder, `x-frame-bypass`, or automatic Google ad request loads during review.
- Review the existing 259-entry sitemap and keyword-targeted inventory separately; no SEO changes have been applied in this pass.
- Document rights for third-party media/trademarks/embeds or replace/remove uncertain assets.
- Configure a certified CMP before turning advertising on for regulated regions.
- Confirm applicant/account/site-list/traffic facts; the known “低质量内容” rejection is mapped to the content and low-value-inventory checks above.
- Wait for Google to recrawl the revised site, then run the full 73-item audit again before resubmission.

This audit reduces identifiable policy risk but cannot guarantee Google approval; Google performs the final review and its current policies control.
