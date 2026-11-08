import { describe, expect, it } from 'vitest'
import {
  parseBcHydroOutageItems,
  stripHtml,
} from './official-updates'

const SAMPLE_FEED = `<?xml version="1.0"?>
<rss version="2.0">
  <channel>
    <title>BC Hydro Outage - Surrey</title>
    <item>
      <guid>abc123</guid>
      <title>Current Outage - 3000 block KING GEORGE BLVD</title>
      <link>https://www.bchydro.com/power-outages/app/outage-map.html#outage=1</link>
      <pubDate>07 Nov 2026 18:30:01 PST</pubDate>
      <description><![CDATA[
        <table>
          <tr><td><b>Municipality:</b></td><td>Surrey</td></tr>
          <tr><td><b>Approx. Area Affected:</b></td><td>3000 block KING GEORGE BLVD</td></tr>
        </table>
      ]]></description>
    </item>
    <item>
      <guid>def456</guid>
      <title>Restored Outage - 15000 block 72 AVE</title>
      <link>https://www.bchydro.com/power-outages/app/outage-list.html#restored</link>
      <pubDate>07 Nov 2026 17:00:00 PST</pubDate>
      <description><![CDATA[Municipality: Surrey]]></description>
    </item>
  </channel>
</rss>`

describe('official updates parser', () => {
  it('strips HTML and CDATA safely', () => {
    expect(stripHtml('<b>Municipality:</b> Surrey')).toContain('Municipality:')
    expect(stripHtml('<![CDATA[Hello &amp; world]]>')).toBe('Hello & world')
  })

  it('parses Surrey municipality items without inventing Newton', () => {
    const updates = parseBcHydroOutageItems(SAMPLE_FEED, '2026-11-08T01:00:00.000Z')
    expect(updates).toHaveLength(2)
    expect(updates[0]?.status).toBe('current')
    expect(updates[1]?.status).toBe('restored')
    expect(updates.every((update) => update.municipality === 'Surrey')).toBe(true)
    expect(updates.every((update) => !/newton/i.test(update.title))).toBe(true)
    expect(updates.every((update) => update.isDemo === false)).toBe(true)
    expect(updates[0]?.fetchedAt).toBe('2026-11-08T01:00:00.000Z')
  })
})
