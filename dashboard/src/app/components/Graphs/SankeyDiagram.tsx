import { useState, useEffect, useRef } from "react";
import * as d3 from "d3";
import * as d3Sankey from "d3-sankey";
import BarChart from "./BarChart";
import { QUESTIONS } from "../Hooks/activity_dict";

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

interface ranking {
    activity: string;
    percentage: number;
    demo: string;
}

interface RBO_goal {
    goal: string;
    rbo: number;
    rankings: ranking[];
}

interface RBO_wrapper {
    demographic: string;
    rbo_info: RBO_goal[];
}

export default function SankeyDiagram(
    barColors: string[],
    setBarColors: Function,
    height: number,
    width: number,
    svgContainer: any,
    nodeColor: string,
    rboData: RBO_wrapper[],
) {
    function wrap(text: any, width: number) {
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

                var tspan_copy: any = tspan; // absolutely not the way to do this, but typescript is stupid
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

    console.log("Sankey");
    console.log(rboData);

    let allDemoValues = rboData[0].rbo_info[0].rankings.map((d) => d.demo);
    let setDemoValues = new Set(allDemoValues.filter((item) => item !== null));
    let uniqueDemoValues = [...setDemoValues];

    const demo_dict = {
        age: ["<18", ">50"],
        gender: ["Man", "Woman"],
        race: ["Minority", "White"],
        income: ["> $50,000", "< $49,000"],
        living: ["Suburban/City", "Rural"],
        sexual: ["Heterosexual", "LGBTQAI+"],
        mhsg: ["No Mental Health Condition", "Mental Health Condition"],
        phsg: ["No Physical Health Condition", "Physical Health Condition"],
        BFI: ["low", "high"],
    };

    const graph: DAG = {
        nodes: [
            {
                nodeId: 0,
                name: demo_dict[
                    rboData[0].demographic as keyof typeof demo_dict
                ][0],
            },
            {
                nodeId: 1,
                name: demo_dict[
                    rboData[0].demographic as keyof typeof demo_dict
                ][1],
            },
        ],
        links: [],
    };
    let current_node_id = 2;
    rboData[0].rbo_info[0].rankings.forEach(function (r) {
        let node_name = QUESTIONS[
            r.activity as keyof typeof QUESTIONS
        ][0] as string;
        let node_exists = graph.nodes.find((n) => n.name === node_name);
        let target_node;

        if (node_exists) {
            target_node = node_exists.nodeId;
        } else {
            graph.nodes.push({
                nodeId: current_node_id,
                name: node_name,
            });
            target_node = current_node_id;
            current_node_id += 1;
        }

        let source_node;
        if (r.demo === uniqueDemoValues[0]) {
            source_node = 0;
        } else {
            source_node = 1;
        }

        graph.links.push({
            source: source_node,
            target: target_node,
            value: r.percentage / 15,
        });
    });
    console.log(graph);

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
    var sankey = d3Sankey
        .sankey()
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
        .attr("x", (d: any) => d.x0)
        .attr("y", (d: any) => {
            if (d.index == 0) {
                return height / 2 - 80;
            } else if (d.index == 1) {
                return height / 2 + 80;
            } else {
                return d.y0 - 15;
            }
        })
        .attr("height", 40)
        .attr("width", (d: any) => (d.index <= 1 ? d.x1 - d.x0 : 10))
        .attr("fill", (d: any) => {
            if (d.index == 0) {
                return "#B589BD";
            } else if (d.index == 1) {
                return "#CE2D4F";
            }
            return nodeColor;
        });

    rect.append("title").text((d: any) => d.name);

    const link = svg
        .append("g")
        .attr("fill", "none")
        .attr("stroke-opacity", 0.5)
        .selectAll()
        .data(links)
        .join("g")
        .style("mix-blend-mode", "multiply");

    let path = d3Sankey.sankeyLinkHorizontal();
    link.append("path")
        .attr("d", (d: any) => {
            if (d.source.index == 0) {
                d.y0 = height / 2 - 80;
            } else if (d.source.index == 1) {
                d.y0 = height / 2 + 80;
            }

            return path(d);
        })
        .attr("stroke", (d: any) =>
            d.source.index == 0 ? "#DECBE2" : "#E58A9E",
        )
        .attr("stroke-width", (d) => d.value * 10);

    link.append("title").text(
        (d: any) => `${d.source.name} → ${d.target.name}\n${d.value} TWh`,
    );

    // Adds labels on the nodes.
    svg.append("g")
        .selectAll()
        .data(nodes)
        .join("text")
        .attr("x", (d: any) => (d.x0 < width / 2 ? d.x1 - 22 : d.x0 + 12))
        .attr("y", (d: any) => (d.y1 + d.y0) / 2)
        .attr("dy", "0.35em")
        .attr("text-anchor", (d: any) => (d.x0 < width / 2 ? "end" : "start"))
        .text((d: any) => d.name)
        .call(wrap, 200); // wrap the text in <= 30 pixels
}
