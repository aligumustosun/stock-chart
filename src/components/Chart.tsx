import { useEffect } from "react";
import * as d3 from "d3";

import responsivefy from "../utils/responsivefy";

interface IParsedData {
  date: Date;
  open: number;
  close: number;
  high: number;
  low: number;
  volume: number;
}
function Chart(props: { data: IParsedData[] }) {
  const { data } = props;

  interface IMovingAverageData {
    date: Date;
    average: number;
  }

  useEffect(() => {

    function movingAverage(
      data: Array<IParsedData>,
      numberOfPricePoints: number
    ): IMovingAverageData[] {
      return data.map((row, index, total) => {
        const start = index;
        const end = Math.min(data.length, index + numberOfPricePoints);
        const subset = total.slice(start, end + 1);
        const sum = subset.reduce((a, b) => {
          return Number(a) + Number(b["close"]);
        }, 0);
        return {
          date: row["date"],
          average: sum / subset.length,
        };
      });
    }

    function drawChart(data: Array<IParsedData>) {
      const margin = { top: 50, right: 50, bottom: 50, left: 50 };
      const width = window.innerWidth - margin.left - margin.right;
      const height = window.innerHeight - margin.top - margin.bottom;

      // remove old chart before creating the new one
      d3.select("#chart").selectAll("*").remove();

      const svg = d3
        .select("#chart")
        .append("svg")
        .attr("width", width + margin["left"] + margin["right"])
        .attr("height", height + margin["top"] + margin["bottom"])
        .call(responsivefy)
        .append("g")
        .attr("transform", `translate(${margin["left"]},  ${margin["top"]})`);

      let xMin = d3.min(data, (d) => {
        return d["date"] as Date;
      });
      let xMax = d3.max(data, (d) => {
        return d["date"] as Date;
      });
      let yMin = d3.min(data, (d) => {
        return d["close"];
      });
      let yMax = d3.max(data, (d) => {
        return d["close"];
      });
      if (xMin === undefined) {
        xMin = new Date();
      }
      if (xMax === undefined) {
        xMax = new Date();
      }
      if (yMin === undefined) {
        yMin = 0;
      }
      if (yMax === undefined) {
        yMax = 100;
      }
      const xScale = d3.scaleTime().domain([xMin, xMax]).range([0, width]);
      const yScale = d3
        .scaleLinear()
        .domain([yMin - 5, yMax])
        .range([height, 0]);
      svg
        .append("g")
        .attr("id", "xAxis")
        .attr("transform", `translate(0, ${height})`)
        .call(d3.axisBottom(xScale));
      svg
        .append("g")
        .attr("id", "yAxis")
        .attr("transform", `translate(${width}, 0)`)
        .call(d3.axisRight(yScale));

      const line = d3
        .line<IParsedData>()
        .x((d) => {
          return xScale(d["date"]);
        })
        .y((d) => {
          return yScale(d["close"]);
        });

      svg
        .append("path")
        .data([data])
        .style("fill", "none")
        .attr("id", "priceChart")
        .attr("stroke", "#2ECC71")
        .attr("stroke-width", "1.5")
        .attr("d", line);

      const movingAverageData = movingAverage(data, 49);
      const movingAverageLine = d3
        .line<IMovingAverageData>()
        .x((d) => {
          return xScale(d["date"]);
        })
        .y((d) => {
          return yScale(d["average"]);
        })
        .curve(d3.curveBasis);
      svg
        .append("path")
        .data([movingAverageData])
        .style("fill", "none")
        .attr("id", "movingAverageLine")
        .attr("stroke", "#AF7AC5")
        .attr("d", movingAverageLine);
    }

    drawChart(data);
  }, [data]);

  return <div id="chart"></div>;
}

export default Chart;
