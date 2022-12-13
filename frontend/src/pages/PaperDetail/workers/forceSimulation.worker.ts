/* eslint-disable @typescript-eslint/no-unused-vars */
import * as d3 from 'd3';

self.onmessage = ({ data }) => {
  const { nodes, links, centerX, centerY } = data as { nodes: any[]; links: any[]; centerX: number; centerY: number };

  const simulation = d3
    .forceSimulation(nodes)
    .force('charge', d3.forceManyBody().strength(-200).distanceMax(200))
    .force('center', d3.forceCenter(centerX, centerY))
    .force(
      'link',
      d3.forceLink(links).id((d: any) => d.key),
    )
    .on('tick', () => {
      self.postMessage({ type: 'tick', newNodes: nodes, newLinks: links });
      if (simulation.alpha() < simulation.alphaMin()) {
        simulation.stop();
        self.postMessage({ type: 'stop' });
      }
    });
};
