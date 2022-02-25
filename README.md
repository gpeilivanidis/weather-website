# weather-website
minimal weather website

Providing information about the weather, temperatures, humidity and wind on more than 200,000 locations. Weather predictions up to 6 days in the future. 
The basic features are: 

<li>location search</li>
<li>light and dark theme</li>
<li>measurement unit selection</li>
<li>saving city, theme and settings (measurement units) info on client machine</li>

<h1>API</h1>
The api key is empty inside the index.js, you need to put your api key there for the script to work.
I am using the One Call API by Open Weather. It's free to make an account and they provide a free tier for their API, which I'm using.

<h1>Info about the project</h1>
I definetely could make some more optimizations, I just didn't want to spend too much time on this.
It was a fun way to learn some basics on fetch. 
I also wanted to make a page showing the hourly weather predictions, maybe I'll leave it for some time in the future...
I tried my best on making it responsive. 
I was also thinking on having an option for Kelvin unit for temperatures, but the 3digit kelvin temperatures were overflowing and 
at that point it was easier to just not include it.

some known issues:

<h2>styles</h2>
This was also my first time with scss, so there are a lot of improvements I could make on my spaghetti code.
The settings styling is a little bit weird, as the main card below can overlap it if you hover the card.
Also all the hidden units (settings and humidity & wind on sub-cards) for some reason are interactive even when 
they are hidden. I probably should had used display: none instead of block-size: 0vh and opacity: 0. I thought
that block-size and opacity were easier to transition. Maybe I could have used all three properties.
Settings must be clicked again to close. You can't close them by clicking on the body.

<h2>script</h2>
The search works by typing the desired location and pressing enter. Then clicking on the prefered result that apears below. 
For some reason it only suggests one location per search. If a location is not clicked, it will not go away unless it's 
clicked or enter is pressed on empty searchbar.

