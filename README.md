# White Hat Write-Up 

This visualization performs analysis on data from the World Bank's "World Development Indicators" dataset. It includes categorical variables for geographic region like "Country", socioeconomic classifications like "IncomeGroup", and quantitative variables to track yearly changes for gender equality indicators across different industries (e.g., the amount of females employed in agriculture). 

We set both sets of female and male bars at a central x-value, utilizing a scale to calculate positive widths for male bars extending to the right, while also calculating negative coordinate offsets and widths for the female bars extending leftwards. This presents viewers with a diverging bar chart, making comparisons between neighboring countries and gender gaps within those countries easily identifiable. We colored male and female data in steelblue and tomato prescpectively. These colors were chosen to provide a modern aesthetic that allows for easy distinction between the two datasets. 

This visualization also includes interactive filtering made possible by attaching an event listener to each dropdown that updates employment and income global variables (respectively), triggering the visualization to be redrawn. 

There are 1 second transitions implemented with the D3 transition interface, allowing viewers to track how individual countries shift without experiencing a jarring replacement of data. 


# Black Hat Write-Up
