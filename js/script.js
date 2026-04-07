const margin = {top: 50, right: 220, bottom: 40, left: 180};
const width = 1000 - margin.left - margin.right;
const height = 2000 - margin.top - margin.bottom;
const incomeLevels = ["All income", "High income", "Low income", "Lower middle income", "Upper middle income"]
const sex = ["Male", "Female"]
const employmentTypes  = [
    "Employment in services",
    "Employment in industry",
    "Contributing family workers",
    "Wage and salaried workers",
    "Vulnerable employment",
    "Self-employed",
    "Employers",
    "Employment in agriculture"
  ];
const t = 1000; 

let allData = []
let employmentVar, incomeVariable, targetYear
incomeVariable = "High income"; 
employmentVar = "Employment in services"; 
let xScale, yScale, sizeScale
targetYear = 1991; 

const colorScale = d3.scaleOrdinal()
  .domain(["Male", "Female"])
  .range(["steelblue", "hotpink"]);

const xLabelX = width / 2;
const xLabelY = -margin.top + 15;

const svg = d3.select('#vis')
    .append('svg')
    .attr('width', width + margin.left + margin.right)
    .attr('height', height + margin.top + margin.bottom)
    .append('g')
    .attr('transform', `translate(${margin.left},${margin.top})`);

const xGridGroup = svg.append("g")
    .attr("class", "x-grid")
    .attr("transform", "translate(0,0)");

const xAxisGroup = svg.append("g")
    .attr("class", "x-axis")
    .attr("transform", "translate(0,0)");

const yAxisGroup = svg.append("g")
    .attr("class", "y-axis");

const zeroLine = svg.append("line")
    .attr("class", "zero-line")
    .attr("y1", 0)
    .attr("y2", height)
    .attr("stroke", "#666")
    .attr("stroke-dasharray", "4 4");

svg.append("text")
    .attr("class", "axis-label x-axis-label")
    .attr("text-anchor", "middle")
    .attr("x", xLabelX)
    .attr("y", xLabelY)
    .text("Employment Share (%)");

svg.append("text")
    .attr("class", "axis-label y-axis-label")
    .attr("text-anchor", "middle")
    .attr("transform", "rotate(-90)")
    .attr("x", -height / 2)
    .attr("y", -margin.left + 15)
    .text("Country");

const svg2 = d3.select('#vis2')
    .append('svg')
    .attr('width', width + margin.left + margin.right)
    .attr('height', height + margin.top + margin.bottom)
    .append('g')
    .attr('transform', `translate(${margin.left},${margin.top})`);

const xGridGroup2 = svg2.append("g")
    .attr("class", "x-grid")
    .attr("transform", "translate(0,0)");

const xAxisGroup2 = svg2.append("g")
    .attr("class", "x-axis")
    .attr("transform", "translate(0,0)");

const yAxisGroup2 = svg2.append("g")
    .attr("class", "y-axis");

const zeroLine2 = svg2.append("line")
    .attr("class", "zero-line")
    .attr("y1", 0)
    .attr("y2", height)
    .attr("stroke", "#666")
    .attr("stroke-dasharray", "4 4");

svg2.append("text")
    .attr("class", "axis-label x-axis-label")
    .attr("text-anchor", "middle")
    .attr("x", xLabelX)
    .attr("y", xLabelY)
    .text("Employment Share (%)");

svg2.append("text")
    .attr("class", "axis-label y-axis-label")
    .attr("text-anchor", "middle")
    .attr("transform", "rotate(-90)")
    .attr("x", -height / 2)
    .attr("y", -margin.left + 15)
    .text("Country");


xScale = d3.scaleLinear();
yScale = d3.scaleBand();

function init(){
        d3.csv("./data/cleaned.csv", function(d){
            
            // Besides converting the types, we also simpilify the variable names here. 
            let row = {
                country: d.Country,
                indicator: d.IndicatorName,
                incomeGroup: d.IncomeGroup
              };
            
              for (let year = 1991; year <= 2019; year++) {
                row[year] = d[year] === "" ? null : +d[year];
              }
            
              return row;
            
            
        })
        .then(data => {
                console.log(data)
                allData = data
                // placeholder for building vis
                // placeholder for adding listerners
    
                setupSelector(svg); 
                setupSelector(svg2);
                
                d3.select("#employmentVar").property("value", employmentVar);
                d3.select("#incomeVariable").property("value", incomeVariable);
                d3.select("#employmentVar2").property("value", employmentVar);
                d3.select("#incomeVariable2").property("value", incomeVariable);

                updateVis(svg);
                updateVis(svg2);
    
            })
        .catch(error => console.error('Error loading data:', error));
    }

function setupSelector(svgvar) {
    if(svgvar == svg){
        eclass = '.evariable'
        iclass = '.ivariable'
    } else {
        eclass = '.evariable2'
        iclass = '.ivariable2'
    }
    d3.selectAll(eclass)
        .each(function() {
        d3.select(this)
            .selectAll('option')
            .data(employmentTypes)
            .enter()
            .append('option')
            .text(d => d)
            .attr('value', d => d);
        })
        .on('change', function() {
        employmentVar = d3.select(this).property('value');
        updateVis(svgvar);
        });
    
    d3.selectAll(iclass)
        .each(function() {
        d3.select(this)
            .selectAll('option')
            .data(incomeLevels)
            .enter()
            .append('option')
            .text(d => d)
            .attr('value', d => d);
        })
        .on('change', function() {
        incomeVariable = d3.select(this).property('value');
        updateVis(svgvar);
        });
    }

function getFilteredData(svgvar) {
    const grouped = d3.group(
        allData.filter(d =>
            d.indicator.includes(employmentVar) &&
            (incomeVariable === "All income" || d.incomeGroup === incomeVariable)
        ),
        d => d.country
    );

    let arr = Array.from(grouped, ([country, rows]) => {
        const maleValue = rows.find(d => d.indicator.includes("male"))?.[targetYear];
        const femaleValue = rows.find(d => d.indicator.includes("female"))?.[targetYear];
    
        return {
            country,
            male_value: maleValue,
            female_value: femaleValue
        };
    }).filter(d =>
        d.male_value != null &&
        !Number.isNaN(d.male_value) &&
        d.female_value != null &&
        !Number.isNaN(d.female_value)
    );
    
    if(svgvar == svg){
        arr = arr.sort((a, b) =>
            Math.abs(a.male_value / a.female_value - 1) - Math.abs(b.male_value / b.female_value - 1));
    } else {
        // AI generated deterministic nonsensical sorting
        arr = arr.sort((a, b) => {
            const scoreA =
                a.country.length *
                Math.sin(a.male_value) +
                a.country.charCodeAt(0);

            const scoreB =
                b.country.length *
                Math.sin(b.male_value) +
                b.country.charCodeAt(0);

            return scoreA - scoreB;
        });
    }

    return arr;
}

function getBoxStats(values) {
    const sorted = values.slice().sort(d3.ascending);

    return {
        min: d3.min(sorted),
        q1: d3.quantile(sorted, 0.25),
        median: d3.quantile(sorted, 0.5),
        q3: d3.quantile(sorted, 0.75),
        max: d3.max(sorted)
    };
}


function updateBoxplot(filteredData, svgvar) {
    
    const boxplotWidth = 130;
    const boxplotHeight = 250;
    const boxplotX = width + (margin.right - boxplotWidth) / 2;
    const boxplotY = 40;
    const labelOffset = 15;

    const boxData = [
        { group: "Male", ...getBoxStats(filteredData.map(d => d.male_value)) },
        { group: "Female", ...getBoxStats(filteredData.map(d => d.female_value)) }
    ];
    const boxMax = d3.max(boxData, d => d.max) || 100;

    const boxY = d3.scaleLinear()
        .domain([0, boxMax])
        .range([boxplotHeight, 0]);

    const boxX = d3.scaleBand()
        .domain(["Male", "Female"])
        .range([0, boxplotWidth])
        .padding(0.4);
    const boxTransition = d3.transition()
        .duration(t)
        .ease(d3.easeCubicInOut);

    const boxGroup = svgvar.selectAll(".boxplot-group")
        .data([null])
        .join("g")
        .attr("class", "boxplot-group");

    boxGroup
        .transition(boxTransition)
        .attr("transform", `translate(${boxplotX}, ${boxplotY})`);

    const boxes = boxGroup.selectAll(".boxplot")
        .data(boxData)
        .join("g")
        .attr("class", "boxplot");

    boxes
        .transition(boxTransition)
        .attr("transform", d => `translate(${boxX(d.group)}, 0)`);

    boxes.selectAll(".range-line")
        .data(d => [d])
        .join("line")
        .attr("class", "range-line")
        .transition(boxTransition)
        .attr("x1", boxX.bandwidth() / 2)
        .attr("x2", boxX.bandwidth() / 2)
        .attr("y1", d => boxY(d.min))
        .attr("y2", d => boxY(d.max))
        .attr("stroke", "#333");

    boxes.selectAll(".box")
        .data(d => [d])
        .join("rect")
        .attr("class", "box")
        .transition(boxTransition)
        .attr("x", 0)
        .attr("y", d => boxY(d.q3))
        .attr("width", boxX.bandwidth())
        .attr("height", d => boxY(d.q1) - boxY(d.q3))
        .attr("fill", d => colorScale(d.group))
        .attr("opacity", 0.5);

    boxes.selectAll(".median-line")
        .data(d => [d])
        .join("line")
        .attr("class", "median-line")
        .transition(boxTransition)
        .attr("x1", 0)
        .attr("x2", boxX.bandwidth())
        .attr("y1", d => boxY(d.median))
        .attr("y2", d => boxY(d.median))
        .attr("stroke", "#111")
        .attr("stroke-width", 2);

    boxes.selectAll(".box-label")
        .data(d => [d])
        .join("text")
        .attr("class", "box-label")
        .transition(boxTransition)
        .attr("x", boxX.bandwidth() / 2)
        .attr("y", boxplotHeight + labelOffset)
        .attr("text-anchor", "middle")
        .attr("alignment-baseline", "middle")
        .style("font-size", "11px")
        .text(d => d.group);
    
}


function updateVis(svgvar) {
    const filteredData = getFilteredData(svgvar);
    const maleValues = filteredData.map(d => d.male_value);
    const femaleValues = filteredData.map(d => d.female_value);

    if (svgvar == svg){
        updateAxes(filteredData);
    } else {
        updateAxes2(filteredData);
    }
    
    const barHeight = Math.min(yScale.bandwidth(), 20);
    const barOffset = (yScale.bandwidth() - barHeight) / 2;
    const transition = svgvar.transition().duration(t).ease(d3.easeCubicInOut);

    svgvar.selectAll(".male-bar")
        .data(filteredData, d => d.country)
        .join(
            enter => enter
                .append("rect")
                .attr("class", "male-bar")
                .attr("x", xScale(0))
                .attr("y", d => yScale(d.country) + barOffset)
                .attr("width", 0)
                .attr("height", barHeight)
                .attr("fill", "steelblue")
                .call(enter => enter
                    .transition(transition)
                    .attr("x", xScale(0))
                    .attr("y", d => yScale(d.country) + barOffset)
                    .attr("width", d => xScale(d.male_value) - xScale(0)))
                .on('mouseover', function (event, d) {
                    console.log(d) // See the data point in the console for debugging
                    d3.select('#tooltip')
                    .style("display", 'block') // Make the tooltip visible
                    .html( // Change the html content of the <div> directly
                    `<strong>Employment Share (% of Male Employment)</strong><br/>
                    ${d.male_value.toFixed(2)}%`)
                    .style("left", (event.pageX + 20) + "px")
                    .style("top", (event.pageY - 28) + "px");

                    d3.select(this) 
                    .style('stroke', 'black')
                    .style('stroke-width', '2px'); 
                    // placeholder: show it and fill it with our data value
                })
                .on("mousemove", function (event) {
                    d3.select('#tooltip')
                        .style("left", (event.pageX + 20) + "px")
                        .style("top", (event.pageY - 28) + "px");
                })
                .on("mouseout", function () {
                    d3.select('#tooltip')
                        .style('display', 'none');
        
                    d3.select(this)
                        .style('stroke', 'none')
                        .style('stroke-width', '1px');
                })
                    ,
            update => update.call(update => update
                .transition(transition)
                .attr("x", xScale(0))
                .attr("y", d => yScale(d.country) + barOffset)
                .attr("width", d => xScale(d.male_value) - xScale(0))
                .attr("height", barHeight)),
            exit => exit.call(exit => exit
                .transition(transition)
                .attr("width", 0)
                .remove())
        );

    svgvar.selectAll(".female-bar")
        .data(filteredData, d => d.country)
        .join(
            enter => enter
                .append("rect")
                .attr("class", "female-bar")
                .attr("x", xScale(0))
                .attr("y", d => yScale(d.country) + barOffset)
                .attr("width", 0)
                .attr("height", barHeight)
                .attr("fill", "hotpink")
                .call(enter => enter
                    .transition(transition)
                    .attr("x", d => xScale(-d.female_value))
                    .attr("y", d => yScale(d.country) + barOffset)
                    .attr("width", d => xScale(0) - xScale(-d.female_value)))
                .on('mouseover', function (event, d) {
                    console.log(d) // See the data point in the console for debugging
                    d3.select('#tooltip')
                    .style("display", 'block') // Make the tooltip visible
                    .html( // Change the html content of the <div> directly
                    `<strong>Employment Share (% of Female Employment)</strong><br/>
                    ${d.female_value.toFixed(2)}%`)
                    .style("left", (event.pageX + 20) + "px")
                    .style("top", (event.pageY - 28) + "px");

                    d3.select(this) 
                    .style('stroke', 'black')
                    .style('stroke-width', '2px'); 
                    // placeholder: show it and fill it with our data value
                })
                .on("mousemove", function (event) {
                    d3.select('#tooltip')
                        .style("left", (event.pageX + 20) + "px")
                        .style("top", (event.pageY - 28) + "px");
                })
                .on("mouseout", function () {
                    d3.select('#tooltip')
                        .style('display', 'none');
        
                    d3.select(this)
                        .style('stroke', 'none')
                        .style('stroke-width', '1px');
                }),
            update => update.call(update => update
                .transition(transition)
                .attr("x", d => xScale(-d.female_value))
                .attr("y", d => yScale(d.country) + barOffset)
                .attr("width", d => xScale(0) - xScale(-d.female_value))
                .attr("height", barHeight)),
            exit => exit.call(exit => exit
                .transition(transition)
                .attr("x", xScale(0))
                .attr("width", 0)
                .remove())
        );
    addLegend(svgvar); 
    updateBoxplot(filteredData, svgvar);
}

function updateAxes(filteredData) {

    const maxValue = d3.max(filteredData, d =>
        Math.max(+d.male_value || 0, +d.female_value || 0)
    ) || 0;
    const bufferedMax = maxValue * 1.1;
    
    xScale
        .domain([-bufferedMax, bufferedMax])
        .range([0, width]);
    
    yScale
        .domain(filteredData.map(d => d.country))
        .range([0, height])
        .padding(0.2);

    const axisTransition = svg.transition().duration(t).ease(d3.easeCubicInOut);

    xGridGroup
        .transition(axisTransition)
        .call(
            d3.axisTop(xScale)
                .ticks(8)
                .tickSize(-height)
                .tickFormat("")
        );

    xAxisGroup
        .transition(axisTransition)
        .call(
            d3.axisTop(xScale)
                .ticks(8)
                .tickFormat(d => Math.abs(d))
        );

    yAxisGroup
        .transition(axisTransition)
        .call(d3.axisLeft(yScale));

    zeroLine
        .transition(axisTransition)
        .attr("x1", xScale(0))
        .attr("x2", xScale(0));
    }

function addLegend(svgvar) {
    svgvar.selectAll(".sexSquare").remove();

    const legendWidth = 165;
    const legendX = width - legendWidth + 70;
    const legendY = -margin.top + 8;
  
    const legend = svgvar.append("g")
      .attr("class", "sexSquare")
      .attr("transform", `translate(${legendX}, ${legendY})`);

    const size = 10;
    const gap = 82;
  
    const items = legend.selectAll(".sex")
      .data(sex)
      .enter()
      .append("g")
      .attr("class", "sex")
      .attr("transform", (d, i) => `translate(${i * gap}, 0)`);

    items.append("rect")
      .attr("width", size)
      .attr("height", size)
      .style("fill", d => colorScale(d))
  
    items.append("text")
      .attr("x", size + 8  )
      .attr("y", size - 4 )
      .style("alignment-baseline", "middle")
      .style("font-size", "12px")
      .style("fill", d => colorScale(d))
      .text(d => d);
}

function updateAxes2(filteredData) {
    xScale
        .domain([-100, 100])
        .range([0, width]);
    
    yScale
        .domain(filteredData.map(d => d.country))
        .range([0, height])
        .padding(0.2);

    const axisTransition = svg2.transition().duration(t).ease(d3.easeCubicInOut);

    xGridGroup2
        .transition(axisTransition)
        .call(
            d3.axisTop(xScale)
                .ticks(8)
                .tickSize(-height)
                .tickFormat("")
        );

    xAxisGroup2
        .transition(axisTransition)
        .call(
            d3.axisTop(xScale)
                .ticks(8)
                .tickFormat(d => Math.abs(d))
        );

    yAxisGroup2
        .transition(axisTransition)
        .call(d3.axisLeft(yScale));

    zeroLine2
        .transition(axisTransition)
        .attr("x1", xScale(0))
        .attr("x2", xScale(0));
    }

window.addEventListener('load', init);
