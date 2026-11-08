import type { ActionHandler } from 'deepspace/worker'
import type { Env } from '../../worker'
import {
  acceptHelpResponseAction,
  cancelHelpItemAction,
  createHelpBeaconAction,
  createHelpItemAction,
  resolveHelpItemAction,
  respondToHelpItemAction,
} from './help-actions'

export const actions: Record<string, ActionHandler<Env>> = {
  createHelpItem: createHelpItemAction,
  createHelpBeacon: createHelpBeaconAction,
  respondToHelpItem: respondToHelpItemAction,
  acceptHelpResponse: acceptHelpResponseAction,
  resolveHelpItem: resolveHelpItemAction,
  cancelHelpItem: cancelHelpItemAction,
}
