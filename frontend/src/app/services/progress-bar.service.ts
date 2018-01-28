import {Injectable} from '@angular/core'
import {SuiModalService} from 'ng2-semantic-ui'
import {SuiComponentFactory} from 'ng2-semantic-ui/dist/misc/util/index'

declare var $: any

@Injectable()
export class ProgressBarService extends SuiModalService {

  constructor(_suiComponentFactory: SuiComponentFactory) {
    super(_suiComponentFactory)
  }

  dismiss() {
    $('sui-modal').remove()
  }

}
