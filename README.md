# MMM-MyScoreboard

This a module for <strong>MagicMirror</strong><br>
https://magicmirror.builders/<br>
https://github.com/MichMich/MagicMirror

This module display's today's scores for your favourite teams across a number of different
leagues, including:

* NHL Hockey
* NBA Basketball
* MLB Baseball
* NFL Footabll
* MLS Soccer
  * FIFA World Cup

![Screenshot](/../screenshots/MMM-MyScoreboard-screenshot.png?raw=true "Screenshot")


## Installation

1. Navigate into your MagicMirror `modules` folder and execute<br>
`git clone https://github.com/lafokamotion/MMM-MyScoreboard`.
2. Enter the new `MMM-MyScoreboard` directory and execute `npm install`.


## Notice to anyone updating from previous versions

1. Run `git pull` in the `MMM-MyScoreboard` directory to get the latest source code. If you are not seeing the latest update, then try deleting your `MMM-MyScoreboard` directory and reclone it as per the initial installation instructions above.
2. Still in the `MMM-MyScoreboard` directory, run `npm install`.
3. (Optional) Run `npm prune` to remove some packages that are no longer needed.
4. As the providers have changed for most sports, some of the team shortcodes are different. If you're not seeing your team show up even though you know a game is scheduled, check your config against the list of team shortcodes below.


## Configuration

<table>
  <thead>
    <tr>
      <th>Option</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><code>showLeagueSeparators</code></td>
      <td>Whether to show separators between different leagues.<br><br><strong>Type</strong> <code>Boolean</code><br>Defaults to <code>true</code></td>
    </tr>
    <tr>
      <td><code>colored</code></td>
      <td>Whether to present module in colour or black-and-white.<br><br><strong>Type</strong> <code>Boolean</code><br>Defaults to <code>true</code></td>
    </tr>
    <tr>
      <td><code>rolloverHours</code></td>
      <td>How many hours past midnight to continue to show the previous day's games.<br><br><strong>Type</strong> <code>Number</code><br>Defaults to <code>3</code> (i.e.: continue to show yesterday's games until 3:00 AM)</td>
    </tr>
    <tr>
      <td><code>viewStyle</code></td>
      <td>One of the following: <code>largeLogos</code>, <code>mediumLogos</code>, <code>smallLogos</code>, <code>oneLine</code>, <code>oneLineWithLogos</code>, <code>stacked</code> or <code>stackedWithLogos</code>.<br><br><strong>Type</strong> <code>String</code><br>Defaults to <code>largeLogos</code><br />See below for examples of the view styles.</td>
    </tr>
    <tr>
      <td><code>shadeRows</code></td>
      <td>Whether to shade alternate rows.<br><br><strong>Type</strong> <code>Boolean</code><br>Defaults to <code>false</code></td>
    </tr>
    <tr>
      <td><code>highlightWinners</code></td>
      <td>For games that are final, the winning team / score is highlighted.<br><br><strong>Type</strong> <code>Boolean</code><br>Defaults to <code>true</code></td>
    </tr>
    <tr>
      <td><code>showRankings</code></td>
      <td>For the NCAAF and NCAAM, whether to show the rankings for the top 25 teams.<br><br><strong>Type</strong> <code>Boolean</code><br>Defaults to <code>true</code></td>
    </tr>
    <tr>
      <td><code>sports</code></td>
      <td><strong>REQUIRED</strong> An array of leagues and teams you wish to follow.<br><br><strong>Type</strong> <code>Array</code><br>See below for instructions to configure your <code>sports</code> list.</td>
    </tr>
  </tbody>
</table>



## Configuring your sports list

Each entry in your `sports` array is an object with the following properties:

<table>
  <thead>
    <tr>
      <th>Property</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><code>league</code></td>
      <td><strong>REQUIRED</strong> e.g.: <code>"NHL"</code>. Use any of the bold, uppercase league labaels from the list bleow.<br><br><strong>Type</strong> <code>String</code></td>
    </tr>
    <tr>
      <td><code>label</code></td>
      <td>If <code>showLeagueSeparators</code> is set to <code>true</code>, you can optionally set a custom label for the separator. Useful in particular to show something other than <code>"NCAAM_MM"</code> for the March Madness tournament.<br><br><strong>Type</strong> <code>String</code><br />Defaults to the value for <code>league</code>.</td>
    </tr>
    <tr>
      <td><code>teams</code></td>
      <td>An array of teams for which you want to see scores.  Specify teams using their shortcodes (e.g.: <code>"TOR"</code> for Toronto Maple Leafs.<br><br><strong>Type</strong> <code>Array</code><br>See below for a full listing of teams and their short codes<br><br><strong>UPDATE v2.0:</strong> This is no longer required.</td>
    </tr>
    <tr>
      <td><code>groups</code></td>
      <td>In addition to specifying individual teams, you may also specify groups.  Generally these groups correspond to the league's respective conferences and divisions.  See below for a full listing of groups available for each league. (e.g.: <code>["Atlantic", "Metropolitain"]</code> for teams in the Atlantic and Metropolitain divisions.<br><br><strong>Type</strong> <code>Array</code></td>
    </tr>
  </tbody>
</table>

It should be noted that if you specify arrays for both <code>teams</code> and <code>groups</code> they will be added together.  So it's possible to make a team list out of a division and a few other specific teams.  If you omit both parameters, then all games for the particular league will be shown.


## Example configuration

```
{
  module: "MMM-MyScoreboard",
  position: "top_right",
  classes: "default everyone",
  header: "My Scoreboard",
  config: {
    showLeagueSeparators: true,
    colored: true,
    viewStyle: "mediumLogos",
    sports: [
      {
        league: "NHL",
        groups: ["Atlantic"]
      },
      {
        league: "NBA",
        teams: ["TOR"],
        groups: ["Pacific", "Central"]
      },
      {
        league: "MLB",
        teams: ["TOR", "CHW", "NYY"]
      },
      {
        league: "NFL",
        teams: ["BUF", "NYJ", "NYG"]
      }
    ]

  }
},

```

## Supported Leagues

Currently this module supports the following leagues.  Use the bold uppercase shortcodes in your config above. Please note that while this module supports well over 100 leagues, please do not abuse this.  We're lucky to be able to use the sports API's free and clear, but there's no telling what might happen if we all configure our modules to get scores for every league.  Please just use configure the leagues you are most interested in.

### Canadian and American Leagues

* **NHL** - National Hockey League
* **NBA** - National Basketball Association
* **MLB** - Major League Baseball
* **NFL** - National Football League
* **MLS** - Major League Soccer


### Soccer Leagues & Competitions

* **FIFA_WORLD_CUP** - FIFA World Cup

#### North America
* **CONCACAF_CHAMPIONS** - CONCACAF Champions League
* **CONCACAF_LEAGUE** - CONCACAF League
* **CRC_PRIMERA_DIV** - Costa Rican Primera Division
* **GUA_LIGA_NACIONAL** - Guatemalan Liga Nacional
* **HON_PRIMERA_DIV** - Honduran Primera Division
* **JAM_PREMIER_LEAGUE** - Jamaican Premier League
* **MEX_ASCENSO_MX** - Mexican Ascenso MX
* **MEX_COPA_MX** - Mexican Copa MX
* **MEX_LIGA_BANCOMER** - Mexican Liga BBVA Bancomer
* **SLV_PRIMERA_DIV** - Salvadoran Primera Division
* **USA_MLS** - Major League Soccer
* **USA_NCAA_SL_M** - United States NCAA Men's 1
* **USA_NCAA_SL_W** - United States NCAA Women's 1
* **USA_NASL** - United States North American Soccer League
* **USA_NWSL** - United States NWSL Women's League
* **USA_OPEN** - United States Open Cup 
* **USA_USL** - United States USL Championship


## View Styles

Examples of the available view styles you can specify with the `viewStyle` parameter.

![View Styles](/../screenshots/viewStyles.jpg?raw=true "View Styles")

`smallLogos`<br />
![Small Logos](/../screenshots/viewStyle_smallLogos.png?raw=true "Small Logos")


## Team Shortcodes and Groups

**NOTE** For the soccer leagues, the list of teams changes every season as teams get relegated out, while other get promoted in.  Therefore, I won't be maintaining a team list here.  To follow a specific team, go to ESPN.com, view the table for the league your team plays in and resize your browser to mobile width.  You will see the team's shortcode there.

The following are shortcodes and groups for North American sports leagues.


### NHL

```
Teams:
---------------

ANA   Anaheim Ducks
ARI   Arizona Coyotes
BOS   Boston Bruins
BUF   Buffalo Sabres
CAR   Carolina Hurricanes
CLB   Columbus Blue Jackets
CGY   Calgary Flames
CHI   Chicago Black Hawks
COL   Colorado Avalanche
DAL   Dallas Stars
DET   Detroit Red Wings
EDM   Edmonton Oilers
FLA   Florida Panthers
LA    Los Angeles Kings
MIN   Minnesota Wild
MTL   Montreal Canadiens
NJ    New Jersey Devils
NSH   Nashville Predators
NYI   New York Islanders
NYR   New York Rangers
OTT   Ottawa Senators
PHI   Philadelphia Flyers
PIT   Pittsburgh Penguins
SJ    San Jose Sharks
STL   St. Louis Blues
TB    Tamba Bay Lightning
TOR   Toronto Maple Leafs
VAN   Vanvouver Canucks
VGK   Vegas Golden Knights
WPG   Winnipeg Jets
WSH   Washington Capitals

Groups:
---------------
Atlantic
Metropolitain
Central
Pacific
East
West
Canadian (group that includes all seven Canadian teams)
```




### MLB

```
Teams:
---------------

ARI   Arizona Diamondbacks
ATL   Atlanta Braves
BAL   Baltimore Orioles
BOS   Boston Red Sox
CHC   Chicago Cubs
CIN   Cincinnati reds
CLE   Cleveland Indians
COL   Colorado Rockies
CWS   Chicago White Sox
DET   Detroit Tigers
HOU   Houston Astros
KC    Kansas City Royals
LAA   Los Angeles Angels
LAD   Los Angeles Dodgers
MIA   Miami Marlins
MIL   Milwaukee Brewers
MIN   Minnesota Twons
NYM   New York Mets
NYY   New York Yankees
OAK   Oakland Athletics
PHI   Philadelphia Phillies
PIT   Pittsburgh Pirates
SD    San Diego Padres
SEA   Seattle Mariners
SF    San Francisco Giants
STL   St. Louis Cardinals
TB    Tampa Bay Rays
TEX   Texas Rangers
TOR   Toronto Blue Jays
WAS   Washington Nationals

Groups:
---------------
AL East
AL Central
AL West
NL East
NL Central
NL West
American League
National League
```

### NBA

```
Teams:
---------------

ATL   Atlanta Hawks
BKN   Brooklyn Nets
BOS   Boston Celtics
CHA   Charlotte Hornets
CHI   Chicago Bulls
CLE   Cleveland Cavaliers
DAL   Dallas Mavericks
DEN   Denver Nuggets
DET   Detroit Pistons
GS    Golden State Warriors
HOU   Houston Rockets
IND   Indiana Pacers
LAC   Los Angeles Clippers
LAL   Los Angeles Lakers
MEM   Memphis Grizzlies
MIA   Miami Heat
MIL   Milwaukee Bucks
MIN   Minnesota Timberwolves
NO    New Orleans Pelicans
NY    New York Knicks
OKC   Oklahoma City Thunder
ORL   Orlando Magic
PHI   Philadelphia 76ers
PHX   Phoenix Suns
POR   Portland Trail Blazers
SAC   Sacramento Kings
SA    San Antonio Spurs
TOR   Toronto Raptors
UTAH  Utah Jazz
WSH   Washington Wizards

Groups:
---------------
Atlantic
Central
Southeast
Northwest
Pacific
Southwest
East
West
```

### NFL
```
Teams:
---------------

ARI   Arizona Cardinals
ATL   Atlanta Falcons
BAL   Baltimore Ravens
BUF   Buffalo Bills
CAR   Carolina Panthers
CHI   Chicago Bears
CIN   Cincinati Bengals
CLE   Cleveland Browns
DAL   Dallas Cowboys
DEN   Denver Broncos
DET   Detroit Lions
GB    Green Bay Packers
HOU   Houston Texans
IND   Indianapolis Colts
JAX   Jacksonville Jaguars
KC    Kansas City Chiefs
LAR   Los Angeles Rams
LAC   Los Angeles Chargers
MIA   Miami Dolphins
MIN   Minnesota Vikings
NE    New England Patriots
NO    New Orleans Saints
NYG   New York Giants
NYJ   New York Jets
OAK   Oakland Raiders
PHI   Philadelphia Eagles
PIT   Pittsburgh Steelers
SEA   Seattle Seahawks
SF    San Francisco 49ers
TB    Tampa Bay Buccaneers
TEN   Tennessee Titans
WAS   Washington Redskins

Groups:
---------------
AFC East
AFC North
AFC South
AFC West
NFC East
NFC North
NFC South
NFC West
AFC
NFC
```

### MLS
```
Teams:
---------------

ATL   Atlanta United FC
CHI   Chicago Fire
CLB   Columbus Crew SC
COL   Colorado Rapids
DAL   FC Dallas
DC    DC United
HOU   Houston Dynamo
LA    LA Galaxy
KC    Sporting Kansas City
MIN   Minnesota United FC
MTL   Montreal Impact
NE    New England Revolution
NY    New York Red Bulls
NYC   New York City FC
ORL   Orlando City FC
PHI   Philadelphia Union
POR   Portland Timbers
RSL   Real Salt Lake
SJ    San Jose Earthquakes
SEA   Seattle Sounders FC
TOR   Toronto FC
VAN   Vancouver Whitecaps

Groups:
---------------
East
West
```
