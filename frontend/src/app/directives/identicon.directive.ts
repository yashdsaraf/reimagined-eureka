import {
  Directive,
  ElementRef,
  Input
} from '@angular/core'

import * as jdenticon from 'jdenticon'

@Directive({
  selector: '[appIdenticon]'
})
export class IdenticonDirective {

  hostElement: HTMLElement

  constructor(private el: ElementRef) {
    this.hostElement = el.nativeElement
  }

  @Input('appIdenticon') set templateHtml(value) {
    let vals = JSON.parse(value)
    let identicon = this.generateIdenticon(vals['value'], vals['size'])
    this.hostElement.innerHTML = identicon
  }

  private generateIdenticon(value: string, width: number): string {
    return jdenticon.toSvg(value, width)
  }

}
