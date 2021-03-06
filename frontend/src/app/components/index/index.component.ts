/*
 * Copyright 2017 Yash D. Saraf, Raees R. Mulla and Sachin S. Negi.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  OnChanges,
  OnDestroy,
  OnInit,
  QueryList,
  ViewChild,
  ViewChildren,
  Renderer2,
  Injector
} from '@angular/core'
import {
  animate,
  keyframes,
  style,
  transition,
  trigger
} from '@angular/animations'
import {ActivatedRoute, Router} from '@angular/router'
import {Subscription} from 'rxjs/Subscription'

// CODEMIRROR Modes
import 'codemirror/mode/apl/apl'
import 'codemirror/mode/asciiarmor/asciiarmor'
import 'codemirror/mode/asn.1/asn.1'
import 'codemirror/mode/asterisk/asterisk'
import 'codemirror/mode/brainfuck/brainfuck'
import 'codemirror/mode/clike/clike'
import 'codemirror/mode/clojure/clojure'
import 'codemirror/mode/cmake/cmake'
import 'codemirror/mode/cobol/cobol'
import 'codemirror/mode/coffeescript/coffeescript'
import 'codemirror/mode/commonlisp/commonlisp'
import 'codemirror/mode/crystal/crystal'
import 'codemirror/mode/css/css'
import 'codemirror/mode/cypher/cypher'
import 'codemirror/mode/d/d'
import 'codemirror/mode/dart/dart'
import 'codemirror/mode/diff/diff'
import 'codemirror/mode/django/django'
import 'codemirror/mode/dockerfile/dockerfile'
import 'codemirror/mode/dtd/dtd'
import 'codemirror/mode/dylan/dylan'
import 'codemirror/mode/ebnf/ebnf'
import 'codemirror/mode/ecl/ecl'
import 'codemirror/mode/eiffel/eiffel'
import 'codemirror/mode/elm/elm'
import 'codemirror/mode/erlang/erlang'
import 'codemirror/mode/factor/factor'
import 'codemirror/mode/fcl/fcl'
import 'codemirror/mode/forth/forth'
import 'codemirror/mode/fortran/fortran'
import 'codemirror/mode/gas/gas'
import 'codemirror/mode/gfm/gfm'
import 'codemirror/mode/gherkin/gherkin'
import 'codemirror/mode/go/go'
import 'codemirror/mode/groovy/groovy'
import 'codemirror/mode/haml/haml'
import 'codemirror/mode/handlebars/handlebars'
import 'codemirror/mode/haskell/haskell'
import 'codemirror/mode/haskell-literate/haskell-literate'
import 'codemirror/mode/haxe/haxe'
import 'codemirror/mode/htmlembedded/htmlembedded'
import 'codemirror/mode/htmlmixed/htmlmixed'
import 'codemirror/mode/http/http'
import 'codemirror/mode/idl/idl'
import 'codemirror/mode/javascript/javascript'
import 'codemirror/mode/jinja2/jinja2'
import 'codemirror/mode/jsx/jsx'
import 'codemirror/mode/julia/julia'
import 'codemirror/mode/livescript/livescript'
import 'codemirror/mode/lua/lua'
import 'codemirror/mode/markdown/markdown'
import 'codemirror/mode/mathematica/mathematica'
import 'codemirror/mode/mbox/mbox'
import 'codemirror/mode/mirc/mirc'
import 'codemirror/mode/mllike/mllike'
import 'codemirror/mode/modelica/modelica'
import 'codemirror/mode/mscgen/mscgen'
import 'codemirror/mode/mumps/mumps'
import 'codemirror/mode/nginx/nginx'
import 'codemirror/mode/nsis/nsis'
import 'codemirror/mode/ntriples/ntriples'
import 'codemirror/mode/octave/octave'
import 'codemirror/mode/oz/oz'
import 'codemirror/mode/pascal/pascal'
import 'codemirror/mode/pegjs/pegjs'
import 'codemirror/mode/perl/perl'
import 'codemirror/mode/php/php'
import 'codemirror/mode/pig/pig'
import 'codemirror/mode/powershell/powershell'
import 'codemirror/mode/properties/properties'
import 'codemirror/mode/protobuf/protobuf'
import 'codemirror/mode/pug/pug'
import 'codemirror/mode/puppet/puppet'
import 'codemirror/mode/python/python'
import 'codemirror/mode/q/q'
import 'codemirror/mode/r/r'
import 'codemirror/mode/rpm/rpm'
import 'codemirror/mode/rst/rst'
import 'codemirror/mode/ruby/ruby'
import 'codemirror/mode/rust/rust'
import 'codemirror/mode/sas/sas'
import 'codemirror/mode/sass/sass'
import 'codemirror/mode/scheme/scheme'
import 'codemirror/mode/shell/shell'
import 'codemirror/mode/sieve/sieve'
import 'codemirror/mode/slim/slim'
import 'codemirror/mode/smalltalk/smalltalk'
import 'codemirror/mode/smarty/smarty'
import 'codemirror/mode/solr/solr'
import 'codemirror/mode/soy/soy'
import 'codemirror/mode/sparql/sparql'
import 'codemirror/mode/spreadsheet/spreadsheet'
import 'codemirror/mode/sql/sql'
import 'codemirror/mode/stex/stex'
import 'codemirror/mode/stylus/stylus'
import 'codemirror/mode/swift/swift'
import 'codemirror/mode/tcl/tcl'
import 'codemirror/mode/textile/textile'
import 'codemirror/mode/tiddlywiki/tiddlywiki'
import 'codemirror/mode/tiki/tiki'
import 'codemirror/mode/toml/toml'
import 'codemirror/mode/tornado/tornado'
import 'codemirror/mode/troff/troff'
import 'codemirror/mode/ttcn/ttcn'
import 'codemirror/mode/ttcn-cfg/ttcn-cfg'
import 'codemirror/mode/turtle/turtle'
import 'codemirror/mode/twig/twig'
import 'codemirror/mode/vb/vb'
import 'codemirror/mode/vbscript/vbscript'
import 'codemirror/mode/velocity/velocity'
import 'codemirror/mode/verilog/verilog'
import 'codemirror/mode/vhdl/vhdl'
import 'codemirror/mode/vue/vue'
import 'codemirror/mode/webidl/webidl'
import 'codemirror/mode/xml/xml'
import 'codemirror/mode/xquery/xquery'
import 'codemirror/mode/yacas/yacas'
import 'codemirror/mode/yaml/yaml'
import 'codemirror/mode/yaml-frontmatter/yaml-frontmatter'
import 'codemirror/mode/z80/z80'

import {FlashMessagesService} from 'angular2-flash-messages'

import {BlogService} from '../../services/blog.service'
import {ConfigService} from '../../services/config.service'
import {CoreService} from '../../services/core.service'
import {EditorConfigService} from '../../services/editor-config.service'
import {ProgressBarService} from '../../services/progress-bar.service'
import {
  IndexService,
  IndexTab
} from '../../services/index.service'
import {isMobile} from '../../app.component'
import {Output} from '../../models/output'
import {KLOUDLESS_APP_ID} from '../../utils/application'
import {decodeError} from '../../utils/general-utils'
import {CodeSnippet} from '../../models/code-snippet'
import {AuthService} from '../../services/auth.service'

declare const $: any

const SYNC_INTERVAL = 10000

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.sass']
})
export class IndexComponent implements OnChanges, OnDestroy, OnInit {

  @ViewChildren('editor') editorView: QueryList<any>
  @ViewChild('downloadLink') downloadLink: ElementRef
  isNavOpen = true
  isMobile: boolean
  editorConfig: Object
  editor: any
  output: Output = {
    stderr: '',
    stdout: ''
  }
  openFiles: IndexTab[]
  indexSubscription: any
  openFile: string
  editorConfigSubscription: Subscription
  editorFontSize: number
  explorer: any
  saveAsModal: boolean
  _shareCodeModal: boolean
  dontAskAgain: boolean
  isSnippetTitleValid: boolean
  isSnippetTitleLoading: boolean
  sharedLink: string

  constructor(
    private blogService: BlogService,
    private cdr: ChangeDetectorRef,
    private configService: ConfigService,
    private coreService: CoreService,
    private editorConfigService: EditorConfigService,
    private flashMessagesService: FlashMessagesService,
    private indexService: IndexService,
    private progressBarService: ProgressBarService,
    private renderer: Renderer2,
    private route: ActivatedRoute,
    private router: Router,
    private injector: Injector
  ) {
    this.isMobile = isMobile
    this.indexSubscription = indexService.emitter.subscribe(openFiles => {
      this.openFiles = openFiles
      this.cdr.detectChanges()
    })
    this.openFile = route.snapshot.params.openfile
    this.editorFontSize = 1
    this.saveAsModal = false
    this._shareCodeModal = false
    this.isSnippetTitleLoading = false
    this.isSnippetTitleValid = false
    this.dontAskAgain = false
    this.sharedLink = null
  }

  ngOnChanges() {
    this.refresh()
  }

  ngOnInit(): void {
    this.isNavOpen = !this.isMobile

    // function sleep(ms) {
    //   return new Promise(resolve => setTimeout(resolve, ms))
    // }

    // (async () => {
    //   while (true) {
    //     await sleep(SYNC_INTERVAL)
    //     this.coreService.sync(this.openFiles).catch(() => {})
    //   }
    // })()

  }

  ngOnDestroy() {
    this.indexSubscription.unsubscribe()
    this.editorConfigSubscription.unsubscribe()
  }

  ngAfterViewInit() {
    this.editorConfigSubscription = this.editorConfigService.emitter
      .subscribe(config => {
        this.editorConfig = config
        this.editorView.forEach(i => {
          let editor = i.instance
          editor.setOption('theme', config['theme'])
        })
      })
    this.editorConfigService.setOption('mode', this.route.snapshot.params.mode)
    this.refreshAfter(80)
    let _window: any = window
    this.explorer = _window.Kloudless.explorer({
      app_id: KLOUDLESS_APP_ID,
      computer: true,
      persist: 'session'
    })
  }

  removeTab(name: string) {
    this.coreService.sync(this.openFiles).then(() => {
      this.indexService.removeTab(name)
      this.refresh()
    }).catch(() => {})
  }

  refresh() {
    this.editorView.forEach(i => {
      let editor = i.instance
      editor.setSize(null, '52vh')
      editor.refresh()
    })
  }

  refreshAfter(ms: number) {
    setTimeout(() => {
      this.refresh()
    }, ms)
  }

  refreshJsTree() {
    $('#file-list').jstree().refresh()
  }

  executeTool(tool: string) {
    switch (tool) {
      case 'run':
        this.runProject()
        break
      case 'zoom-in':
        this.adjustEditorZoom(.3)
        break
      case 'zoom-out':
        this.adjustEditorZoom(.3, true)
        break
      case 'save':
        this.saveProject()
        break
      case 'close':
        this.closeProject()
        break
      case 'share':
        this.shareCodeModal()
        break;
    }
  }

  adjustEditorZoom(value: number, isNegative = false) {
    if (!isNegative) {
      if (this.editorFontSize < 10) {
        this.editorFontSize += .3
      }
    } else {
      if (this.editorFontSize > .1) {
        this.editorFontSize -= .3
      }
    }
    this.refreshAfter(50)
  }

  runProject() {
    this.output = {stderr: '', stdout: ''}
    this.progressBarService.show(null, "Executing the project")
    this.coreService.runProject(this.openFiles).subscribe(
      (data: Output) => {
        this.output = data
        this.progressBarService.dismiss()
        this.refreshJsTree()
      },
      err => {
        this.progressBarService.dismiss()
        this.refreshJsTree()
        this.errorHandler(err)
      }
    )
  }

  saveProject() {
    this.coreService.sync(this.openFiles).catch(() => {})
    let saveAs
    if (this.injector.get(AuthService).getRole() == 'GUEST') {
      saveAs = 'offline'
    } else {
      if (this.configService.getSaveAs() == null) {
        this.saveAsModal = true
        return
      }
      saveAs = this.configService.getSaveAs(true)
    }
    if (!this.dontAskAgain) {
      this.configService.deleteSaveAs()
    }
    this.progressBarService.show(null, 'Saving project')
    this.coreService.save().subscribe(
      data => {
        this.progressBarService.dismiss()
        if (saveAs == 'offline') {
          this.renderer.setAttribute(this.downloadLink.nativeElement, 'href', data.url)
          this.downloadLink.nativeElement.click()
          return
        }
        let files = [data]
        this.explorer.save(files)
      },
      err => {
        this.progressBarService.dismiss()
        this.errorHandler(err)
      }
    )
  }

  closeProject() {
    this.coreService.close().subscribe(
      data => {
        this.router.navigate(['/home'])
        this.flashMessagesService.show('Project closed successfully. Get started with a new one!', {
          cssClass: 'ui success message',
          timeout: 4000
        })
      },
      err => this.errorHandler(err)
    )
  }

  shareCode(title: string) {
    let activeTab = this.openFiles.find(tab => !!tab.isActive)
    let snippet: CodeSnippet = {
      title,
      code: activeTab.content
    }
    this.blogService.createSnippet(snippet).subscribe(
      data => this.sharedLink = title,
      err => this.errorHandler(err)
    )
  }

  onSnippetTitleChange(title: string) {
    if (title == null || title.trim() == '') {
      this.isSnippetTitleValid = false
      return
    }
    this.isSnippetTitleLoading = true
    this.blogService.checkTitle(title.trim()).subscribe(
      data => {
        this.isSnippetTitleValid = true
        this.isSnippetTitleLoading = false
      },
      err => {
        this.isSnippetTitleValid = false
        this.isSnippetTitleLoading = false
      }
    )
  }

  shareCodeModal() {
    if (this.openFiles == null || this.openFiles.length == 0) {
      return
    }
    let activeTab = this.openFiles.find(tab => !!tab.isActive)
    if (activeTab.content == null || activeTab.content.trim() == '') {
      return
    }
    this._shareCodeModal = true
  }

  closeSaveAsModal(value: string) {
    this.saveAsModal = false
    this.configService.setSaveAs(value)
    this.saveProject()
  }

  errorHandler(err) {
    this.flashMessagesService.show(decodeError(err), {
      cssClass: 'ui error message', timeout: 4000
    })
  }

}
