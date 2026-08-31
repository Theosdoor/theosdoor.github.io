/**
 * Comments and reactions are GitHub Discussions, rendered by giscus.
 *
 * One-time setup (all in the browser, nothing to install locally):
 *   1. Repo Settings → General → Features → tick "Discussions".
 *   2. Install the giscus app: https://github.com/apps/giscus
 *   3. Open https://giscus.app, enter this repo, pick the discussion category
 *      (make a "Comments" one, announcement-only, so only you can open threads),
 *      and paste the `data-category-id` it prints into `categoryId` below.
 *
 * Until `categoryId` is filled in, the widget and the index counts stay hidden
 * and the site builds exactly as it does now.
 */
export const giscus = {
  repo: 'Theosdoor/theosdoor.github.io',
  repoId: 'R_kgDOQh3OGA',
  category: 'Comments',
  categoryId: '',
} as const;

/** Posts map to discussions by slug (`data-mapping="specific"`), so the index
 *  can ask for a post's counts without reproducing giscus's URL munging. */
export const giscusEnabled = giscus.categoryId.length > 0;
