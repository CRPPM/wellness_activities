import { useState, useEffect, useRef } from "react";
import * as d3 from "d3";
import * as d3Sankey from 'd3-sankey';
import BarChart from "./BarChart";

interface SNodeExtra {
    nodeId: number;
    name: string;
}

interface SLinkExtra {
    source: number;
    target: number;
    value: number;
    // uom: string;
}

type SNode = d3Sankey.SankeyNode<SNodeExtra, SLinkExtra>;
type SLink = d3Sankey.SankeyLink<SNodeExtra, SLinkExtra>;

interface DAG {
    nodes: SNode[];
    links: SLink[];
}
export default function SankeyDiagram(
    barColors: string[],
    setBarColors: Function,
    height: number,
    width: number,
    svgContainer: any,
    nodeColor: string,
) {
    function wrap(text: any, width: number) {
        // console.log(typeof text)
        // console.log(text)
        text.each(function (this: any) {
            var text = d3.select(this),
                words = text.text().split(/\s+/).reverse(),
                word,
                line: string[] = [],
                lineNumber = 0,
                lineHeight = 1.1, // ems
                x = text.attr("x"),
                y = text.attr("y");

            var dy = 0.35; //parseFloat(text.attr("dy")),
            if (text.text().length > 26) {
                dy = -0.28;
            }
            var tspan = text
                .text(null)
                .append("tspan")
                .attr("x", x)
                .attr("y", y)
                .attr("dy", dy + "em");

            while ((word = words.pop())) {
                line.push(word);
                tspan.text(line.join(" "));

                var tspan_copy:any = tspan // absolutely not the way to do this, but typescript is stupid
                if (tspan_copy.node().getComputedTextLength() > width) {
                    line.pop();
                    tspan.text(line.join(" "));
                    line = [word];
                    tspan = text
                        .append("tspan")
                        .attr("x", x)
                        .attr("y", y)
                        .attr("dy", ++lineNumber * lineHeight + dy + "em")
                        .text(word);
                }
                
            }
        });
    }

    const graph: DAG = {
        nodes: [
            { nodeId: 0, name: "Depressed" },
            { nodeId: 1, name: "No Mental Health Conditions" },
            { nodeId: 2, name: "Music" },
            { nodeId: 3, name: "Praying" },
            { nodeId: 4, name: "Meditating" },
            { nodeId: 5, name: "Cooking" },
            { nodeId: 6, name: "Eating healthy" },
            { nodeId: 7, name: "Spending time in nature" },
            { nodeId: 8, name: "Watching TV" },
            { nodeId: 9, name: "Playing with Pets" },
            { nodeId: 10, name: "Exercising moderately" },
            { nodeId: 11, name: "Spending in-person time with friends" },
            { nodeId: 12, name: "Cleaning" },
            { nodeId: 13, name: "Changing into comfortable clothing" },
            { nodeId: 14, name: "Talking to a therapist" },
            { nodeId: 15, name: "taking some deep breaths" },
            { nodeId: 16, name: "Texting/Calling loved ones" },
        ],
        links: [
            { source: 0, target: 2, value: 2 },
            { source: 0, target: 3, value: 1 },
            { source: 0, target: 4, value: 1 },
            { source: 0, target: 5, value: 1 },
            { source: 0, target: 6, value: 1 },
            { source: 0, target: 7, value: 2 },
            { source: 0, target: 8, value: 3 },
            { source: 0, target: 9, value: 1 },
            { source: 0, target: 10, value: 2 },
            { source: 0, target: 11, value: 2 },

            { source: 1, target: 7, value: 1 },
            { source: 1, target: 8, value: 2 },
            { source: 1, target: 9, value: 1 },
            { source: 1, target: 10, value: 2 },
            { source: 1, target: 11, value: 3 },
            { source: 1, target: 12, value: 1 },
            { source: 1, target: 13, value: 1 },
            { source: 1, target: 14, value: 1 },
            { source: 1, target: 15, value: 1 },
            { source: 1, target: 16, value: 1 },
        ],
    };

    // set the dimensions and margins of the graph
    const margin = { top: 20, right: 30, bottom: 50, left: 110 };
    // width = 1000 - margin.left - margin.right,
    // height = 500 - margin.top - margin.bottom;

    const everything = d3.select(svgContainer.current).selectAll("*");
    everything.remove();
    // append the svg object to the body of the page

    var svg = d3
        .select(svgContainer.current)
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    // Color scale used
    // var color = d3.scaleOrdinal(d3.schemeCategory20);

    // Set the sankey diagram properties
    var sankey = d3Sankey.sankey()
        // .nodeId((d) => d.name);
        .nodeWidth(20)
        .nodePadding(290)
        .size([width - 250, height]);

    const { nodes, links } = sankey(graph);

    // Nodes
    const rect = svg
        .append("g")
        .attr("stroke", "#000")
        .selectAll()
        .data(nodes)
        .join("rect")
        .attr("x", (d:any) => d.x0)
        .attr("y", (d:any) => d.y0 - 15)
        .attr("height", 30)
        .attr("width", (d:any) => (d.index <= 1 ? d.x1 - d.x0 : 10))
        .attr("fill", (d:any) => {
            if (d.index == 0) {
                return "#B589BD";
            } else if (d.index == 1) {
                return "#CE2D4F";
            }
            return nodeColor;
        });

    rect.append("title").text((d:any) => d.name);

    const link = svg
        .append("g")
        .attr("fill", "none")
        .attr("stroke-opacity", 0.5)
        .selectAll()
        .data(links)
        .join("g")
        .style("mix-blend-mode", "multiply");

    link.append("path")
        .attr("d", d3Sankey.sankeyLinkHorizontal())
        .attr("stroke", (d:any) => (d.source.index == 0 ? "#DECBE2" : "#E58A9E"))
        .attr("stroke-width", (d) => d.value * 10);

    link.append("title").text(
        (d:any) => `${d.source.name} → ${d.target.name}\n${d.value} TWh`,
    );

    // Adds labels on the nodes.
    svg.append("g")
        .selectAll()
        .data(nodes)
        .join("text")
        .attr("x", (d:any) => (d.x0 < width / 2 ? d.x1 - 22 : d.x0 + 12))
        .attr("y", (d:any) => (d.y1 + d.y0) / 2)
        .attr("dy", "0.35em")
        .attr("text-anchor", (d:any) => (d.x0 < width / 2 ? "end" : "start"))
        .text((d:any) => d.name)
        .call(wrap, 200); // wrap the text in <= 30 pixels
}
