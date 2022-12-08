import * as d3 from 'd3';
import { useEffect } from 'react';

export default function useGraphZoom(svgSelector: SVGSVGElement | null) {
  useEffect(() => {
    if (svgSelector === null) return;
    const handleZoom = (e: any) => {
      d3.select(svgSelector).selectChildren().attr('transform', e.transform);
    };

    const zoom = d3.zoom<SVGSVGElement, unknown>().scaleExtent([0.1, 5]).on('zoom', handleZoom);
    d3.select(svgSelector).call(zoom);
  }, [svgSelector]);
}
