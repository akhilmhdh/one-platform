import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-outlined-pie-graph',
  templateUrl: './outlined-pie-graph.component.html',
  styleUrls: ['./outlined-pie-graph.component.scss'],
})
export class OutlinedPieGraphComponent implements OnInit {
  constructor() {}
  @Input() score = 0;
  @Input() name = '';
  @Input() type: 'orange' | 'green' | 'blue' = 'orange';
  ngOnInit(): void {}
}
