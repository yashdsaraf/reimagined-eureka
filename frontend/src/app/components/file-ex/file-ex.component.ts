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

  constructor(private fileExService: FileExService) {
    this.isMobile = isMobile
  }

  ngAfterViewInit() {
    let fileExService = this.fileExService
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
              if (this.is_leaf(node_parent)) {
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
        console.log(data.instance.get_type(data.node))
      })
      .on('create_node.jstree', function (e, data) {
        console.log('creat', data)
      })
      .on('rename_node.jstree', function (e, data) {
        console.log('renam', data)
      })
      .on('delete_node.jstree', function (e, data) {
        console.log('delet', data)
      })
      .on('copy_node.jstree', function (e, data) {
        console.log('copy_', data)
      })
      .on('move_node.jstree', function (e, data) {
        console.log('move_', data)
      })
  }

}
