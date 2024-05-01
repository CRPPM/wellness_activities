import { useState, useEffect, useRef } from "react";
import * as d3 from "d3";
import { sankey as Sankey, sankeyLinkHorizontal } from "d3-sankey";
import BarChart from "./BarChart";

export default function SankeyDiagram(
    barColors: string[],
    setBarColors: Function,
    height: number,
    width: number,
    svgContainer: any,
    nodeColor: string,
) {
    function wrap(text, width) {
        text.each(function () {
            var text = d3.select(this),
                words = text.text().split(/\s+/).reverse(),
                word,
                line = [],
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
                // console.log(line);
                if (tspan.node().getComputedTextLength() > width) {
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

    const graph = {
        nodes: [
            { node: 0, name: "Depressed" },
            { node: 1, name: "No Mental Health Conditions" },
            { node: 2, name: "Music" },
            { node: 3, name: "Praying" },
            { node: 4, name: "Meditating" },
            { node: 5, name: "Cooking" },
            { node: 6, name: "Eating healthy" },
            { node: 7, name: "Spending time in nature" },
            { node: 8, name: "Watching TV" },
            { node: 9, name: "Playing with Pets" },
            { node: 10, name: "Exercising moderately" },
            { node: 11, name: "Spending in-person time with friends" },
            { node: 12, name: "Cleaning" },
            { node: 13, name: "Changing into comfortable clothing" },
            { node: 14, name: "Talking to a therapist" },
            { node: 15, name: "taking some deep breaths" },
            { node: 16, name: "Texting/Calling loved ones" },
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
    var sankey = Sankey()
        // .nodeId((d) => d.name);
        .nodeWidth(20)
        .nodePadding(290)
        .size([width - 250, height]);

    const { nodes, links } = sankey({
        nodes: graph.nodes.map((d) => Object.assign({}, d)),
        links: graph.links.map((d) => Object.assign({}, d)),
    });

    // Nodes
    const rect = svg
        .append("g")
        .attr("stroke", "#000")
        .selectAll()
        .data(nodes)
        .join("rect")
        .attr("x", (d) => d.x0)
        .attr("y", (d) => d.y0 - 15)
        .attr("height", 30)
        .attr("width", (d) => (d.index <= 1 ? d.x1 - d.x0 : 10))
        .attr("fill", (d) => {
            if (d.index == 0) {
                return "#B589BD";
            } else if (d.index == 1) {
                return "#CE2D4F";
            }
            return nodeColor;
        });

    rect.append("title").text((d) => d.name);

    const link = svg
        .append("g")
        .attr("fill", "none")
        .attr("stroke-opacity", 0.5)
        .selectAll()
        .data(links)
        .join("g")
        .style("mix-blend-mode", "multiply");

    link.append("path")
        .attr("d", sankeyLinkHorizontal())
        .attr("stroke", (d) => (d.source.index == 0 ? "#DECBE2" : "#E58A9E"))
        .attr("stroke-width", (d) => d.value * 10);

    link.append("title").text(
        (d) => `${d.source.name} → ${d.target.name}\n${d.value} TWh`,
    );

    // Adds labels on the nodes.
    svg.append("g")
        .selectAll()
        .data(nodes)
        .join("text")
        .attr("x", (d) => (d.x0 < width / 2 ? d.x1 - 22 : d.x0 + 12))
        .attr("y", (d) => (d.y1 + d.y0) / 2)
        .attr("dy", "0.35em")
        .attr("text-anchor", (d) => (d.x0 < width / 2 ? "end" : "start"))
        .text((d) => d.name)
        .call(wrap, 200); // wrap the text in <= 30 pixels
}
