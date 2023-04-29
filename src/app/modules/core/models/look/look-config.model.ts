import { LookActions } from "./look-actions.model";
import { LookDirections } from "./look-directions.model";
import { LookGestures } from "./look-gestures.model";
import { LookSizes } from "./look-sizes.model";

export class LookConfig {
    look!: string;
    action?: LookActions = LookActions.DEFAULT;
    size?: LookSizes = LookSizes.DEFAULT;
    direction?: LookDirections = LookDirections.SOUTH_EAST;
    headDirection?: LookDirections = LookDirections.SOUTH_EAST;
    headOnly?: boolean = false;
    gesture?: LookGestures = LookGestures.STANDARD;
}