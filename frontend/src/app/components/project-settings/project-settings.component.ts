import {
  Component,
  OnDestroy
} from '@angular/core'

import {isMobile} from '../../app.component'
import {Themes} from '../../utils/themes'

import {EditorConfigService} from '../../services/editor-config.service'
import {Subscription} from 'rxjs/Subscription';

@Component({
  selector: 'app-project-settings',
  templateUrl: './project-settings.component.html',
  styleUrls: ['./project-settings.component.sass']
})
export class ProjectSettingsComponent implements OnDestroy {

  isMobile: boolean
  themes: string[]
  selectedTheme: string
  editorConfigSubscription: Subscription
  showModal = false

  constructor(private editorConfigService: EditorConfigService) {
    this.isMobile = isMobile
    this.themes = Themes
    this.selectedTheme = editorConfigService.getConfig()['theme']
  }

  ngAfterViewInit() {

  }

  ngOnDestroy() {
    this.editorConfigSubscription.unsubscribe()
  }

  onClick(theme: string) {
    this.selectedTheme = theme
    this.editorConfigService.setOption('theme', this.selectedTheme)
    this.showModal = false
  }

}
