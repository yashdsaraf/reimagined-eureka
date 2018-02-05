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
  Component,
  EventEmitter,
  Input,
  Output
} from '@angular/core'

import {FlashMessagesService} from 'angular2-flash-messages/module/flash-messages.service'

import {FileExService} from '../../services/file-ex.service'
import {isMobile} from '../../app.component'

declare const $: any

@Component({
  selector: 'app-file-ex',
  templateUrl: './file-ex.component.html',
  styleUrls: ['./file-ex.component.sass']
})
export class FileExComponent {

  @Input() isNavOpen: boolean
  @Output() isNavOpenChange = new EventEmitter<boolean>()
  isMobile: boolean

  constructor(
    private fileExService: FileExService,
    private flashMessagesService: FlashMessagesService
  ) {
    this.isMobile = isMobile
  }

  ngAfterViewInit() {
    let fileExService = this.fileExService
    let error = (body: Object, data: any) => {
      let message
      if (body.hasOwnProperty('error')) {
        message = body['error']
        if (typeof(message) === 'object' && message.hasOwnProperty('error')) {
          message = message['error']
        }
      } else if (body.hasOwnProperty('error_description')) {
        message = body['error_description']
      } else {
        message = body
      }
      this.flashMessagesService.show(message, {
        cssClass: 'ui error message', timeout: 4000
      })
      data.instance.refresh()
    }
    let getParent = function (data): string {
      let parent = ''
      let parents: Array<string> = data.node.parents
      parents = parents.slice(0, parents.length - 2)
      for (let item of parents.reverse()) {
        parent += data.instance.get_node(item).text + '/'
      }
      parent = parent.substr(0, parent.length - 1)
      return parent
    }
    $('#file-list')
      .jstree({
        core: {
          data: function (obj, callback) {
            fileExService.getFileTree().subscribe(
              data => callback.call(this, data),
              err => $('#file-list').text(err.error)
            )
          },
          check_callback: function (operation, node, node_parent, node_position, more) {
            if (operation === 'move_node' || operation === 'copy_node') {
              if (this.get_node(node).parent === this.get_node(node_parent).id) {
                return false
              }
              if (this.get_type(node_parent) === 'file') {
                return false
              }
            }
            if (operation === 'rename_node') {
              if (this.get_node(node).original.text === node_position) {
                return false
              }
            }
            return true
          }
        },
        contextmenu: {
          items:
            function (node) {
              let tmp = $.jstree.defaults.contextmenu.items()
              delete tmp.create.action
              tmp.create.label = 'New'
              tmp.create.submenu = {
                create_folder: {
                  separator_after: true,
                  label: 'Folder',
                  action: function (data) {
                    let inst = $.jstree.reference(data.reference),
                      obj = inst.get_node(data.reference)
                    inst.create_node(obj, {type: 'default'}, 'last', function (new_node) {
                      setTimeout(function () {inst.edit(new_node)}, 0)
                    })
                  }
                },
                create_file: {
                  label: 'File',
                  action: function (data) {
                    let inst = $.jstree.reference(data.reference),
                      obj = inst.get_node(data.reference)
                    inst.create_node(obj, {type: 'file'}, 'last', function (new_node) {
                      setTimeout(function () {inst.edit(new_node)}, 0)
                    })
                  }
                }
              }
              if (this.get_type(node) === 'file') {
                delete tmp.create
              }
              return tmp
            }
        },
        types: {
          default: {icon: 'icon folder'},
          file: {valid_children: [], icon: 'icon file'}
        },
        plugins: ['contextmenu', 'types', 'unique', 'search']
      })
      .on('changed.jstree', function (e, data) {

      })
      .on('create_node.jstree', function (e, data) {
        let file = data.node.text
        let isDir = data.node.type === 'file' ? false : true
        let parent = getParent(data)
        fileExService.create(file, parent, isDir)
          .subscribe(response => {
            data.instance.refresh()
          }, err => {
            error(err, data)
          })
      })
      .on('rename_node.jstree', function (e, data) {
        let file = data.node.original.text
        let newname = data.node.text
        let parent = getParent(data)
        fileExService.rename(file, parent, newname)
          .subscribe(response => {
            data.instance.refresh()
          }, err => {
            error(err, data)
          })
      })
      .on('delete_node.jstree', function (e, data) {
        let file = data.node.text
        let parent = getParent(data)
        fileExService.delete(file, parent)
          .subscribe(
          response => {
            data.instance.refresh()
          }, err => {
            error(err, data)
          }
          )
      })
      .on('copy_node.jstree', function (e, data) {
        console.log('copy_', data)
      })
      .on('move_node.jstree', function (e, data) {
        console.log('move_', data)
      })
  }

}
