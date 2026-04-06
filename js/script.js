const margin = {top: 50, right: 40, bottom: 40, left: 180};
const width = 800 - margin.left - margin.right;
const height = 2000 - margin.top - margin.bottom;
const incomeLevels = ["High income", "Low income", "Lower middle income", "Upper middle income"]
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
  .range(["steelblue", "tomato"]);


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
    .attr("x", width / 2)
    .attr("y", -35)
    .text("Employment Share (%)");

svg.append("text")
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
    
                
    
                setupSelector(); 
                
                d3.select("#employmentVar").property("value", employmentVar);
                d3.select("#incomeVariable").property("value", incomeVariable);

                updateVis();
    
                
             
                
            })
        .catch(error => console.error('Error loading data:', error));
    }

function setupSelector() {
    d3.selectAll('.evariable')
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
        updateVis();
        });
    
    d3.selectAll('.ivariable')
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
        updateVis();
        });
    }

function getFilteredData() {
    const grouped = d3.group(
        allData.filter(d =>
            d.indicator.includes(employmentVar) &&
            d.incomeGroup === incomeVariable
        ),
        d => d.country
    );

    return Array.from(grouped, ([country, rows]) => {
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
    ).sort((a, b) =>
    Math.abs(a.male_value / a.female_value - 1) - Math.abs(b.male_value / b.female_value - 1)
);

}

function updateVis() {
    const filteredData = getFilteredData();
    updateAxes(filteredData);
    
    const barHeight = Math.min(yScale.bandwidth(), 20);
    const barOffset = (yScale.bandwidth() - barHeight) / 2;
    const transition = svg.transition().duration(t).ease(d3.easeCubicInOut);

    svg.selectAll(".male-bar")
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
                    .attr("width", d => xScale(d.male_value) - xScale(0))),
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

    svg.selectAll(".female-bar")
        .data(filteredData, d => d.country)
        .join(
            enter => enter
                .append("rect")
                .attr("class", "female-bar")
                .attr("x", xScale(0))
                .attr("y", d => yScale(d.country) + barOffset)
                .attr("width", 0)
                .attr("height", barHeight)
                .attr("fill", "tomato")
                .call(enter => enter
                    .transition(transition)
                    .attr("x", d => xScale(-d.female_value))
                    .attr("y", d => yScale(d.country) + barOffset)
                    .attr("width", d => xScale(0) - xScale(-d.female_value))),
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
    addLegend(); 
}

function updateAxes(filteredData) {
    // Build symmetric x-domain so men extend left and women extend right
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

function addLegend() {
    svg.selectAll(".sexSquare").remove();
  
    const legend = svg.append("g")
      .attr("class", "sexSquare")
      .attr("transform", `translate(${width - 165}, ${-42})`);

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
    



window.addEventListener('load', init);
