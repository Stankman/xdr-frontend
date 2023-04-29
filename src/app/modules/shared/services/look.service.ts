import { Injectable } from "@angular/core";
import { LookActions } from "../../core/models/look/look-actions.model";
import { LookConfig } from "../../core/models/look/look-config.model";
import { LookDirections } from "../../core/models/look/look-directions.model";
import { LookGestures } from "../../core/models/look/look-gestures.model";
import { LookSizes } from "../../core/models/look/look-sizes.model";
import { environment } from "src/environments/environment";

@Injectable({
    providedIn: 'root'
})
export class LookService {
    /**
     * Generate look URI
     *
     * @param look
     * @returns string
     */
     get(look: string | LookConfig): string {
      if (!look || !(look as LookConfig).look) {
        return '/assets/resources/images/habbo_mannequin2.gif';
      }
  
      if ((look as LookConfig).look) {
        look = look as LookConfig;
        return `${environment.app.imager}${look.look}&action=${
          look.action ?? LookActions.DEFAULT
        }&gesture=${look.gesture ?? LookGestures.STANDARD}&direction=${
          look.direction ?? LookDirections.SOUTH_EAST
        }&head_direction=${look.headDirection ?? LookDirections.SOUTH_EAST}&size=${
          look.size ?? LookSizes.DEFAULT
        }&headonly=${look.headOnly ? 1 : 0}`;
      }
  
      return `${environment.app.imager}${look}&action=${LookActions.DEFAULT}&gesture=${LookGestures.STANDARD}&direction=${LookDirections.SOUTH_EAST}&head_direction=${LookDirections.SOUTH_EAST}&size=${LookSizes.DEFAULT}`;
    }
}