import { Directive, ElementRef, HostListener, Input } from '@angular/core';

@Directive({
  selector: '[appHighlight]',
  standalone: true
})
export class HighlightDirective {

  @Input()
  appHighlight = '';
  @Input()
  name = 'default';

  constructor(private el: ElementRef) {
    // this.el.nativeElement.style.backgroundColor = ''
  }
  
  @HostListener('mouseenter') //decorador
  onMouseEnter(){
    this.highlight(this.appHighlight);
  }
  
  @HostListener('mouseleave') //decorador
  onMouseLeave(){
    this.highlight('');
  }
  
  private highlight(color: string){
    this.el.nativeElement.style.backgroundColor = color;
    
  }

  @HostListener('click') //decorador
  registerEvent(){
    console.log('regusterEvent ->', this.name)
  }

}
