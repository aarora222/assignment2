# White Hat Write-Up 

This visualization performs analysis on data from the World Bank's "World Development Indicators" dataset. It includes categorical variables for geographic region like "Country", socioeconomic classifications like "IncomeGroup", and quantitative variables to track yearly changes for gender equality indicators across different industries (e.g., the amount of females employed in agriculture). 

We set both sets of female and male bars at a central x-value, utilizing a scale to calculate positive widths for male bars extending to the right, while also calculating negative coordinate offsets and widths for the female bars extending leftwards. This presents viewers with a diverging bar chart, making comparisons between neighboring countries and gender gaps within those countries easily identifiable. We colored male and female data in steelblue and tomato respectively. These colors were chosen to provide a modern aesthetic that allows for easy distinction between the two groups. 

This visualization also includes interactive filtering made possible by attaching an event listener to two dropdown menu options that update employment and income global variables (respectively), triggering the visualization to be redrawn. This allows viewers to make comparisons and draw their own conclusions about gender equality by referencing a multitude of different indicators.

In addition to this, we also used a d3-simple-slider to allow users to manually drag and change the global targetYear variable to a value between 1991 and 2019. There are 1 second transitions (implemented with the D3 transition interface) called whenever the visualization is updated - specifically when the dropdown menus or slider is used. This allows viewers to track how individual countries shift without experiencing a jarring replacement of data. This updates the visualization to reflect data for the year in reference. Perhaps the most important part of an effective visualization is providing a wide range of information that is easily digestible, making these features important.

Math.abs is used to calculate how far male-to-female ratios are from 1 for user-chosen indicators. This is implemented into a sorting algorithm, which places countries with the strongest calculated gender equality (closest ratio to 1) at the top and countries with the weakest calculated gender equality at the bottom (furthest ratio from 1). This allows users to draw comparisons between and amongst countries across different indicators very simply and to observe information in a more visually appealing, properly sequenced manner. 


# Black Hat Write-Up
