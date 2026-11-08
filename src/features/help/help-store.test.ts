import { beforeEach, describe, expect, it } from 'vitest'
import {
  getBeaconCooldown,
  getHelpDemoSnapshot,
  helpDemoActions,
} from './help-store'

describe('help demo lifecycle', () => {
  beforeEach(() => {
    helpDemoActions.reset()
  })

  it('moves a request from open to offered, matched, and resolved', () => {
    const request = getHelpDemoSnapshot().items.find(
      (item) => item.id === 'help-portable-charger',
    )
    expect(request?.status).toBe('open')

    helpDemoActions.setActiveUser('demo-user-maya')
    const response = helpDemoActions.respond(
      'help-portable-charger',
      'I can lend a charger near the library.',
    )
    expect(response).not.toBeNull()
    expect(
      getHelpDemoSnapshot().items.find((item) => item.id === 'help-portable-charger')?.status,
    ).toBe('offered')

    helpDemoActions.setActiveUser('demo-user-aisha')
    expect(helpDemoActions.acceptResponse(response!.id)).toBe(true)
    expect(
      getHelpDemoSnapshot().items.find((item) => item.id === 'help-portable-charger')?.status,
    ).toBe('matched')

    expect(helpDemoActions.resolve('help-portable-charger')).toBe(true)
    expect(
      getHelpDemoSnapshot().items.find((item) => item.id === 'help-portable-charger')?.status,
    ).toBe('resolved')
  })

  it('prevents responders from accepting or closing another user request', () => {
    helpDemoActions.setActiveUser('demo-user-maya')
    const response = helpDemoActions.respond('help-portable-charger', 'I can help.')
    expect(response).not.toBeNull()
    expect(helpDemoActions.acceptResponse(response!.id)).toBe(false)
    expect(helpDemoActions.cancel('help-portable-charger')).toBe(false)
  })

  it('applies a beacon cooldown and keeps the home community targeted', () => {
    helpDemoActions.setActiveUser('demo-user-maya')
    const beacon = helpDemoActions.createBeacon({
      title: 'Charging help needed',
      description: 'Looking to charge a phone for an hour.',
      category: 'power_charging',
      communityId: 'community-newton',
      targetCommunityIds: ['community-fleetwood'],
    })

    expect(beacon?.kind).toBe('beacon')
    expect(beacon?.targetCommunityIds).toEqual([
      'community-newton',
      'community-fleetwood',
    ])
    expect(getBeaconCooldown('demo-user-maya').available).toBe(false)
    expect(
      helpDemoActions.createBeacon({
        title: 'Another beacon',
        description: 'This should be blocked by the cooldown.',
        category: 'other',
        communityId: 'community-newton',
        targetCommunityIds: [],
      }),
    ).toBeNull()
  })
})
