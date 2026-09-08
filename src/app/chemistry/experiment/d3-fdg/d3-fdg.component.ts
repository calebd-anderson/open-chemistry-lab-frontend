import {
  Component,
  ElementRef,
  input,
  OnInit,
} from '@angular/core';

import * as d3 from 'd3';

@Component({
  selector: 'd3-fdg',
  imports: [],
  templateUrl: './d3-fdg.component.html',
  styleUrl: './d3-fdg.component.scss',
})
export class D3FdgComponent implements OnInit {
  constructor(private readonly elementRef: ElementRef<HTMLElement>) {}

  private svg: any;
  private margin = 50;
  private width = 550 - this.margin * 2;
  private height = 300 - this.margin * 2;

  // data = input.required();
  data = input();

  ngOnInit(): void {
    this.createSvg();
    this.drawGraphics(this.data() as any);
  }

  private createSvg(): void {
    // Create the SVG container.
    this.svg = d3
      .select('figure#graphics')
      .append('svg')
      .attr('width', this.width + this.margin * 2)
      .attr('height', this.height + this.margin * 2)
      .attr('viewBox', [0, 0, this.width, this.height])
      .attr('style', 'max-width: 100%; height: auto;');
    // .attr('transform', 'translate(' + this.margin + ',' + this.margin + ')');
  }

  drawGraphics(data: any) {
    // Specify the color scale.
    const color = d3.scaleOrdinal(d3.schemeCategory10);

    // The force simulation mutates links and nodes, so create a copy
    // so that re-evaluating this cell produces the same result.
    const links = data.links.map((d: any) => ({ ...d }));
    const nodes = data.nodes.map((d: any) => ({ ...d }));

    // Create a simulation with several forces.
    const simulation = d3
      .forceSimulation(nodes)
      .force(
        'link',
        d3.forceLink(links).id((d: any) => d.id),
      )
      .force('charge', d3.forceManyBody())
      .force('center', d3.forceCenter(this.width / 2, this.height / 2))
      .on('tick', ticked);

    // Add a line for each link, and a circle for each node.
    const link = this.svg
      .append('g')
      .attr('stroke', '#999')
      .attr('stroke-opacity', 0.6)
      .selectAll()
      .data(links)
      .join('line')
      .attr('stroke-width', (d: any) => Math.sqrt(d.value));

    const node = this.svg
      .append('g')
      .attr('stroke', '#fff')
      .attr('stroke-width', 1.5)
      .selectAll()
      .data(nodes)
      .join('circle')
      .attr('r', 5)
      .attr('fill', (d: any) => color(d.group));

    node.append('title').text((d: any) => d.id);

    // Add a drag behavior.
    node.call(
      d3
        .drag()
        .on('start', dragstarted)
        .on('drag', dragged)
        .on('end', dragended),
    );

    // Set the position attributes of links and nodes each time the simulation ticks.
    function ticked() {
      link
        .attr('x1', (d: any) => d.source.x)
        .attr('y1', (d: any) => d.source.y)
        .attr('x2', (d: any) => d.target.x)
        .attr('y2', (d: any) => d.target.y);

      node.attr('cx', (d: any) => d.x).attr('cy', (d: any) => d.y);
    }

    // Reheat the simulation when drag starts, and fix the subject position.
    function dragstarted(event: any) {
      if (!event.active) simulation.alphaTarget(0.3).restart();
      event.subject.fx = event.subject.x;
      event.subject.fy = event.subject.y;
    }

    // Update the subject (dragged node) position during drag.
    function dragged(event: any) {
      event.subject.fx = event.x;
      event.subject.fy = event.y;
    }

    // Restore the target alpha so the simulation cools after dragging ends.
    // Unfix the subject position now that it’s no longer being dragged.
    function dragended(event: any) {
      if (!event.active) simulation.alphaTarget(0);
      event.subject.fx = null;
      event.subject.fy = null;
    }

    // When this cell is re-run, stop the previous simulation. (This doesn’t
    // really matter since the target alpha is zero and the simulation will
    // stop naturally, but it’s a good practice.)
    // invalidation.then(() => simulation.stop());
  }
}
