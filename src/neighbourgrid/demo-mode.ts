const DEMO_FLAG_KEY = 'ng-demo-mode'
const DEMO_LEFT_KEY = 'ng-demo-left'
const HOME_COMMUNITY_KEY = 'ng-home-community-id'

export function readDemoFlagFromSearch(search: string): boolean {
  const params = new URLSearchParams(search)
  return params.get('demo') === '1'
}

export function persistDemoMode(enabled: boolean): void {
  if (typeof window === 'undefined') return
  if (enabled) {
    window.sessionStorage.setItem(DEMO_FLAG_KEY, '1')
    window.sessionStorage.removeItem(DEMO_LEFT_KEY)
  } else {
    window.sessionStorage.removeItem(DEMO_FLAG_KEY)
    window.sessionStorage.setItem(DEMO_LEFT_KEY, '1')
  }
}

export function isDemoModePersisted(): boolean {
  if (typeof window === 'undefined') return false
  return window.sessionStorage.getItem(DEMO_FLAG_KEY) === '1'
}

export function explicitlyLeftDemo(): boolean {
  if (typeof window === 'undefined') return false
  return window.sessionStorage.getItem(DEMO_LEFT_KEY) === '1'
}

export function readStoredHomeCommunityId(): string | null {
  if (typeof window === 'undefined') return null
  return window.localStorage.getItem(HOME_COMMUNITY_KEY)
}

export function persistHomeCommunityId(communityId: string): void {
  if (typeof window === 'undefined') return
  window.localStorage.setItem(HOME_COMMUNITY_KEY, communityId)
}
