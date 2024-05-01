import { useState, useEffect, useRef } from "react";
import * as d3 from "d3";

export default function BarChart(
    barColors: string[],
    setBarColors: Function,
    height: number,
    width: number,
    svgContainer: any,
    setShowBackArrow: Function,
    setGraphType: Function,
) {
    const rboData = [
        {
            demographic: "Age",
            Sleep: 0.7,
            "Physical Health": 0.8,
            "Emotional Health": 0.85,
            Productivity: 0.67,
            "Social Wellness": 0.64,
        },
        {
            demographic: "Gender",
            Sleep: 0.9,
            "Physical Health": 0.78,
            "Emotional Health": 0.82,
            Productivity: 0.63,
            "Social Wellness": 0.68,
        },
    ];

    // set the dimensions and margins of the graph
    const margin = { top: 10, right: 30, bottom: 50, left: 70 };
    // width = 1000 - margin.left - margin.right,
    // height = 500 - margin.top - margin.bottom;

    const everything = d3.select(svgContainer.current).selectAll("*");
    everything.remove();
    // append the svg object to the body of the page

    const svg = d3
        .select(svgContainer.current)
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom);

    const container = svg
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

    var subgroups = Object.keys(rboData[0]).slice(1);
    subgroups = subgroups.filter((sg) => {
        return barColors.includes(sg);
    });

    var groups = Array.from(new Set(rboData.map((item) => item.demographic)));

    var x = d3.scaleBand().domain(groups).range([0, width]).padding(0.2);
    const xAxisGroup = container
        .append("g")
        .attr("transform", "translate(0," + height + ")")
        .style("font-size", "16px")
        .call(d3.axisBottom(x).tickSize(0));

    xAxisGroup
        .append("text")
        .attr("class", "x label")
        .attr("text-anchor", "end")
        .attr("fill", "black")
        .attr("x", width / 2)
        .attr("y", 40)
        .style("font-size", "16px")
        .text("Demographics");

    var y = d3.scaleLinear().domain([0, 1]).range([height, 0]);
    const yAxisGroup = container
        .append("g")
        .style("font-size", "16px")
        .call(d3.axisLeft(y));

    yAxisGroup
        .append("text")
        .attr("x", -(height + margin.top + margin.bottom) / 2)
        .attr("y", -margin.left + 15)
        .attr("fill", "black")
        .text("RBO")
        .style("font-size", "16px")
        .style("transform", "rotate(270deg)")
        .style("text-anchor", "middle");

    var xSubgroup = d3
        .scaleBand()
        .domain(subgroups)
        .range([0, x.bandwidth()])
        .padding(0.05);

    // var color = d3
    //     .scaleOrdinal()
    //     .domain(subgroups)
    //     .range(["#B4DFD8", "#F9F5E3", "#E4EFFF", "#E8DACE", "#FFCBB4"]);
    var colors = {
        Sleep: "#B4DFD8",
        "Physical Health": "#F9F5E3",
        "Emotional Health": "#E4EFFF",
        Productivity: "#E8DACE",
        "Social Wellness": "#FFCBB4",
    };

    container
        .append("g")
        .selectAll("g")
        .data(rboData)
        .enter()
        .append("g")
        .attr("transform", function (d) {
            return "translate(" + x(d.demographic) + ",0)";
        })
        .selectAll("rect")
        .data(function (d) {
            return subgroups.map(function (key) {
                return { key: d.demographic + "_" + key, value: d[key  as keyof typeof d] };
            });
        })
        .enter()
        .append("rect")
        .attr("x", function (d: any) {
            let x_val: number = xSubgroup(d.key.split("_")[1]) || 0;
            return x_val;

        })
        .attr("y", function (d) {
            return y(Number(d.value));
        })
        .attr("width", xSubgroup.bandwidth())
        .attr("height", function (d) {
            return height - y(Number(d.value));
        })
        .attr("fill", function (d) {
            return colors[d.key.split("_")[1] as keyof typeof colors];
        });

    d3.selectAll("rect")
        .style("cursor", "pointer")
        .on("click", (e) => {
            // console.log(e.srcElement.__data__.key);
            let goal = e.srcElement.__data__.key.split("_")[1];
            d3.select(svgContainer.current).selectAll("*").remove();
            setShowBackArrow(true);
            setBarColors([goal]);
            setGraphType("Sankey Diagram");
        });
}