import * as d3 from "d3";

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
interface tooltip {
    display: boolean;
    x: number;
    y: number;
    value: number;
}

export default function BarChart(
    barColors: string[],
    setBarColors: Function,
    height: number,
    width: number,
    svgContainer: any,
    setShowBackArrow: Function,
    setGraphType: Function,
    rboData: RBO_wrapper[],
    setRBOData: Function,
    setAgeValue: Function,
    setGenderValue: Function,
    setRaceValue: Function,
    setIncomeValue: Function,
    setLivingValue: Function,
    setSexualValue: Function,
    setMhsgValue: Function,
    setPhsgValue: Function,
    setBFIExtraHiValue: Function,
    setFilters: Function,
    tooltip: tooltip,
    setTooltip: Function,
) {
    const demo_dict = {
        age: "Age Range",
        gender: "Gender",
        race: "Race/Ethnicity",
        income: "Income",
        living: "Location",
        sexual: "Sexual Orientation",
        mhsg: "MHSG",
        phsg: "PHSG",
        BFI: "BFIExtraHi",
    };
    let graph_rbos: any = [];
    rboData.forEach(function (r) {
        let rbo: any = { demographic: r.demographic };
        r.rbo_info.forEach(function (i) {
            rbo[i.goal] = i.rbo;
        });
        graph_rbos.push(rbo);
    });

    const margin = { top: 10, right: 30, bottom: 50, left: 70 };

    const everything = d3.select(svgContainer.current).selectAll("*");
    everything.remove();

    const svg = d3
        .select(svgContainer.current)
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom);

    const container = svg
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

    var subgroups = Object.keys(graph_rbos[0]).slice(1);
    subgroups = subgroups.filter((sg) => {
        return barColors.includes(sg);
    });

    var groups = Array.from(new Set(rboData.map((item) => item.demographic)));

    var x = d3.scaleBand().domain(groups).range([0, width]).padding(0.2);
    const xAxisGroup = container
        .append("g")
        .attr("transform", "translate(0," + height + ")")
        .style("font-size", "16px")
        .call(
            d3
                .axisBottom(x)
                .tickSize(0)
                .tickFormat((d) => demo_dict[d as keyof typeof demo_dict]),
        );

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
        .data(graph_rbos)
        .enter()
        .append("g")
        .attr("transform", function (d: any) {
            return "translate(" + x(d.demographic) + ",0)";
        })
        .selectAll("rect")
        .data(function (d: any) {
            return subgroups.map(function (key) {
                return {
                    key: d.demographic + "_" + key,
                    value: d[key as keyof typeof d],
                };
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
        })
        .on("mouseover", function (e, d) {
            d3.select(this).transition().duration(50).attr("opacity", ".85");
            setTooltip({
                display: true,
                x: e.pageX,
                y: e.pageY,
                value: y(Number(d.value)),
            });
        })
        .on("mouseout", function (e, d) {
            d3.select(this).transition().duration(50).attr("opacity", "1");
            setTooltip({ ...tooltip, display: false });
        });

    d3.selectAll("rect")
        .style("cursor", "pointer")
        .on("click", (e) => {
            let goal = e.srcElement.__data__.key.split("_")[1];
            let demographic = e.srcElement.__data__.key.split("_")[0];
            let demo_functions = {
                age: setAgeValue,
                gender: setGenderValue,
                race: setRaceValue,
                income: setIncomeValue,
                living: setLivingValue,
                sexual: setSexualValue,
                mhsg: setMhsgValue,
                phsg: setPhsgValue,
                BFI: setBFIExtraHiValue,
            };

            Object.keys(demo_functions).forEach((d) => {
                if (d !== demographic) {
                    demo_functions[d as keyof typeof demo_functions]([]);
                }
            });

            d3.select(svgContainer.current).selectAll("*").remove();
            setShowBackArrow(true);
            setBarColors([goal]);
            setFilters([demo_dict[demographic as keyof typeof demo_dict]]);
            setGraphType("Sankey Diagram");
        });
}
