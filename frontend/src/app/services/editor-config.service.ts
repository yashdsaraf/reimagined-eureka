import {Injectable} from '@angular/core'
import {Subject} from 'rxjs/Subject'
import {Observable} from 'rxjs/Observable'

@Injectable()
export class EditorConfigService {

  private subject: Subject<Object> = new Subject()
  emitter: Observable<Object> = this.subject.asObservable()
  defaultEditorConfig = {
    lineNumbers: true,
  }
  editorConfig = {}

  constructor() {
    let localConfigJson = localStorage.getItem('editor-config')
    try {
      this.editorConfig = JSON.parse(localConfigJson)
    } catch (e) {
      this.editorConfig = this.defaultEditorConfig
    }
    if (this.editorConfig == null) {
      this.editorConfig = this.defaultEditorConfig
    }
    this.subject.next(this.editorConfig)
  }

  setOption(option: string, value: string) {
    this.editorConfig[option] = value
    this.updateConfig()
  }

  updateConfig() {
    localStorage.setItem('editor-config', JSON.stringify(this.editorConfig))
    this.subject.next(this.editorConfig)
  }

  getConfig() {
    return this.editorConfig
  }

}
