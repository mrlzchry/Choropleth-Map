import * as d3 from 'd3'
import './App.css';
import React, {useState, useEffect, useRef} from 'react';
import * as topojson from 'topojson'

const url = [fetch("https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/counties.json"),
fetch("https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/for_user_education.json")]
function App() {
  const [dataCounty, setDataCounty] = useState([]);
  const [dataEducation, setDataEducation] = useState([]);
  
  //useEffect is used for fetching API as it would avoid any error when rendering the page
  useEffect (() => {
    fetchData();
  },[])

   async function fetchData() {
      try {
        await Promise.all(url).then((response) => {Promise.all(response.map((item) => {
          return item.clone().json();
        })).then(data => {return (setDataCounty(topojson.feature(data[0], data[0].objects.counties).features),
         setDataEducation(data[1]))}) }
      )}
  
      catch(error) {
        console.error(error);
      }
    };

    console.log(dataCounty);
    console.log(dataEducation);

  // async function fetchData1() {
  //   try {
  //     await fetch("https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/counties.json")
  //           .then(response => response.json())
  //           .then(data => setDataCounty(topojson.feature(data, data.objects.counties).features));
  //   }

  //   catch(error) {
  //     console.error(error);
  //   }
  // };

  // async function fetchData2() {
  //   try {
  //     await fetch("https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/for_user_education.json")
  //           .then(response => response.json())
  //           .then(data => setDataFips(data));
  //   }

  //   catch(error) {
  //     console.error(error);
  //   }
  // };
  // console.log(dataset);
  // console.log(dataset2);

  return (
    <div className="App">
      <header className="App-header">
        <DrawMap title="United States Educational Attainment" data={dataCounty} data2={dataEducation}></DrawMap>
      </header>
    </div>
  );
}

const DrawMap = ({title, data, data2}) => {
  const svgRef = useRef();

  const h = 650;
  const w = 950;
  
  const tooltip = d3.select(".visHeader")
  .append("div")
  .attr("id", "tooltip")
  .style("opacity", 0);

  const svg = d3.select(svgRef.current)
                .attr("height", h)
                .attr("width", w)
                .style("background", "#282c34")
//using path to create the line of the map, d is the properties for d3.geopath
// which automatically draws the coordinate from the data
        svg.selectAll("path")
           .data(data)
           .enter()
           .append("path")
           .attr("class", "county")
           .attr("d", d3.geoPath())
           .attr("data-fips", (d, i) => data2[i].fips)
           .attr("data-education", (d, i) => data2[i].bachelorsOrHigher)
           .attr("data-state", (d, i) => data2[i].state)
           .attr("data-areaName", (d, i) => data2[i].area_name)
           .style("fill", (d, i) => {
            if (data2[i].bachelorsOrHigher > 1 && data2[i].bachelorsOrHigher < 12) {
              return "#FFDAB9"
            }
            else if (data2[i].bachelorsOrHigher >= 12 && data2[i].bachelorsOrHigher < 21) {
              return "#FBC4AB"
            }
            else if  (data2[i].bachelorsOrHigher >= 21 && data2[i].bachelorsOrHigher < 30) {
              return "#F8AD9D"
            }
            else if (data2[i].bachelorsOrHigher >= 30 && data2[i].bachelorsOrHigher < 39) {
              return "#F4978E"
            }
            else if (data2[i].bachelorsOrHigher >= 39 && data2[i].bachelorsOrHigher < 48) {
              return "#F08080"
            }
            else if (data2[i].bachelorsOrHigher >= 48 && data2[i].bachelorsOrHigher < 57) {
              return "#e36464"
            }
            else if (data2[i].bachelorsOrHigher >= 57 && data2[i].bachelorsOrHigher < 70) {
              return "#c35a5a"
            }
            else if (data2[i].bachelorsOrHigher >= 70) {
              return "#923434"
            }
           })
           .on("mouseover", function(event) {
            tooltip.html(this.getAttribute("data-areaName") + ", " + this.getAttribute("data-state") + ": "
             + this.getAttribute("data-education") + "%")
                  .attr("data-education", this.getAttribute("data-education"))
                  .style('left', `${event.pageX - 40}px`)
                  .style('top', `${event.pageY - 60}px`);
            tooltip.transition()
                  .duration(100)
                  .style("opacity", 0.9);
            
          })
            .on('mouseout', function() {
                tooltip.html('');
                tooltip.transition()
                    .duration(100)
                    .style('opacity', 0);
            }
              );


        svg.append('svg')
           .attr("id", "legend");

        svg.select("#legend")
           .append('rect')
           .attr("x",540)
           .attr("y",  30 )
           .attr("width", 40)
           .attr("height", 20)
           .style("fill", "#FFDAB9")
          //  .style("stroke", "white")

        svg.select("#legend")
           .append("text")
           .text("3%")
           .attr("x", 540)
           .attr("y", 70)
           .style("font-size", 12)
           .style("fill", "white")

        svg.select("#legend")
           .append("line")
           .attr("x1", 540)
           .attr("y1", 60)
           .attr("x2",540 )
           .attr("y2", 30)
           .style("stroke", "white")
        
        svg.select("#legend")
           .append('rect')
           .attr("x",580)
           .attr("y",  30 )
           .attr("width", 40)
           .attr("height", 20)
           .style("fill", "#FBC4AB");

        svg.select("#legend")
           .append("text")
           .text("12%")
           .attr("x", 580)
           .attr("y", 70)
           .style("font-size", 12)
           .style("fill", "white");

        svg.select("#legend")
           .append("line")
           .attr("x1", 580)
           .attr("y1", 60)
           .attr("x2",580 )
           .attr("y2", 30)
           .style("stroke", "white");

        svg.select("#legend")
           .append('rect')
           .attr("x",620)
           .attr("y",  30 )
           .attr("width", 40)
           .attr("height", 20)
           .style("fill", "#F8AD9D");

        svg.select("#legend")
           .append("text")
           .text("21%")
           .attr("x", 620)
           .attr("y", 70)
           .style("font-size", 12)
           .style("fill", "white");

           svg.select("#legend")
           .append("line")
           .attr("x1", 620)
           .attr("y1", 60)
           .attr("x2",620)
           .attr("y2", 30)
           .style("stroke", "white");

        svg.select("#legend")
           .append('rect')
           .attr("x",660)
           .attr("y",  30 )
           .attr("width", 40)
           .attr("height", 20)
           .style("fill", "#F4978E");
        
        svg.select("#legend")
           .append("text")
           .text("30%")
           .attr("x", 660)
           .attr("y", 70)
           .style("font-size", 12)
           .style("fill", "white");
        
        svg.select("#legend")
           .append("line")
           .attr("x1", 660)
           .attr("y1", 60)
           .attr("x2",660)
           .attr("y2", 30)
           .style("stroke", "white");
        
        svg.select("#legend")
           .append('rect')
           .attr("x",700)
           .attr("y",  30 )
           .attr("width", 40)
           .attr("height", 20)
           .style("fill", "#F08080");

        svg.select("#legend")
           .append("text")
           .text("39%")
           .attr("x", 700)
           .attr("y", 70)
           .style("font-size", 12)
           .style("fill", "white");
        
        svg.select("#legend")
           .append("line")
           .attr("x1", 700)
           .attr("y1", 60)
           .attr("x2",700)
           .attr("y2", 30)
           .style("stroke", "white");

        svg.select("#legend")
           .append('rect')
           .attr("x",740)
           .attr("y",  30 )
           .attr("width", 40)
           .attr("height", 20)
           .style("fill", "#e36464");

        svg.select("#legend")
           .append("text")
           .text("48%")
           .attr("x", 740)
           .attr("y", 70)
           .style("font-size", 12)
           .style("fill", "white");

        svg.select("#legend")
           .append("line")
           .attr("x1", 740)
           .attr("y1", 60)
           .attr("x2",740)
           .attr("y2", 30)
           .style("stroke", "white");

        svg.select("#legend")
           .append('rect')
           .attr("x",780)
           .attr("y",  30 )
           .attr("width", 40)
           .attr("height", 20)
           .style("fill", "#c35a5a");

        svg.select("#legend")
           .append("text")
           .text("57%")
           .attr("x", 780)
           .attr("y", 70)
           .style("font-size", 12)
           .style("fill", "white");

        svg.select("#legend")
           .append("line")
           .attr("x1", 780)
           .attr("y1", 60)
           .attr("x2",780)
           .attr("y2", 30)
           .style("stroke", "white");

        svg.select("#legend")
           .append('rect')
           .attr("x",820)
           .attr("y",  30 )
           .attr("width", 40)
           .attr("height", 20)
           .style("fill", "#923434");

        svg.select("#legend")
           .append("text")
           .text("66%")
           .attr("x", 820)
           .attr("y", 70)
           .style("font-size", 12)
           .style("fill", "white");

       svg.select("#legend")
           .append("line")
           .attr("x1", 820)
           .attr("y1", 60)
           .attr("x2",820)
           .attr("y2", 30)
           .style("stroke", "white");

        svg.select("#legend")
           .append("text")
           .text("75%")
           .attr("x", 860)
           .attr("y", 70)
           .style("font-size", 12)
           .style("fill", "white");

        svg.select("#legend")
           .append("line")
           .attr("x1", 860)
           .attr("y1", 60)
           .attr("x2",860)
           .attr("y2", 30)
           .style("stroke", "white");




  return (
    <React.Fragment>
      <h1 id="title">{title}</h1>
      <h6 id="description">Percentage of adults age 25 and older with a bachelor's degree or higher (2010-2014)</h6>
      <div className="visHeader">
        <svg ref={svgRef}></svg>
      </div>
      <h6 className="author">Created by Ammarul</h6>
      <h6><a href="blank">Source Code</a></h6>
    </React.Fragment>
  )
}

export default App;
