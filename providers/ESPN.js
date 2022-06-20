/*

  -------------------------------------
    Provider for ESPN Scoreboard Data
  -------------------------------------

  Provides scores for
    MLB
    NHL
    NFL
    NBA (National Basketball Association)
    International and NA Socer

  You can get an idea of what sports and leagues are
  supported here:
  http://www.espn.com/static/apis/devcenter/io-docs.html

  Documentation for the feed can be found here:
  http://www.espn.com/static/apis/devcenter/docs/scores.html#parameters

  ESPN has several different APIs for various sports data,
  most of which need an API key.  ESPN no longer gives out
  public API keys.  The good news is the Scoreboard API does
  not require an API key. It's free and clear.  Let's not
  abuse this.  Please do not modify this to hammer the API
  with a flood of calls, otherwise it might cause ESPN to
  lock this it down.

  Data is polled on demand per league configured in the
  front end. Each time the front end makes a request for a
  particular league a request for JSON is made to ESPN's
  servers.  The front end polls every two miuntes.

*/

const request = require("request");
const moment = require("moment-timezone");
const parseJSON = require("json-parse-async");

module.exports = {

  PROVIDER_NAME: "ESPN",

  LEAGUE_PATHS: {

    //North American Leagues
    "NBA": "basketball/nba",
    "NFL": "football/nfl",
    "NHL": "hockey/nhl",
    "MLB": "baseball/mlb",

    //International Soccer
    "AFC_ASIAN_CUP": "soccer/afc.cup",
    "AFC_ASIAN_CUP_Q": "soccer/afc.cupq",
    "AFF_CUP": "soccer/aff.championship",
    "AFR_NATIONS_CUP": "soccer/caf.nations",
    "AFR_NATIONS_CUP_Q": "soccer/caf.nations_qual",
    "AFR_NATIONS_CHAMPIONSHIP": "soccer/caf.championship",
    "CONCACAF_GOLD_CUP": "soccer/concacaf.gold",
    "CONCACAF_NATIONS_Q": "soccer/concacaf.nations.league_qual",
    "CONCACAF_WOMENS_CHAMPIONSHIP": "soccer/concacaf.womens.championship",
    "CONMEBOL_COPA_AMERICA": "soccer/conmebol.america",
    "FIFA_CLUB_WORLD_CUP": "soccer/fifa.cwc",
    "FIFA_CONFEDERATIONS_CUP": "soccer/fifa.confederations",
    "FIFA_MENS_FRIENDLIES": "soccer/fifa.friendly",
    "FIFA_MENS_OLYMPICS": "soccer/fifa.olympics",
    "FIFA_WOMENS_FRIENDLIES": "soccer/fifa.friendly.w",
    "FIFA_WOMENS_OLYMPICS": "soccer/fifa.w.olympics",
    "FIFA_WOMENS_WORLD_CUP": "soccer/fifa.wwc",
    "FIFA_WORLD_CUP": "soccer/fifa.world",
    "FIFA_WORLD_CUP_Q_AFC": "soccer/fifa.worldq.afc",
    "FIFA_WORLD_CUP_Q_CAF": "soccer/fifa.worldq.caf",
    "FIFA_WORLD_CUP_Q_CONCACAF": "soccer/fifa.worldq.concacaf",
    "FIFA_WORLD_CUP_Q_CONMEBOL": "soccer/fifa.worldq.conmebol",
    "FIFA_WORLD_CUP_Q_OFC": "soccer/fifa.worldq.ofc",
    "FIFA_WORLD_CUP_Q_UEFA": "soccer/fifa.worldq.uefa",
    "FIFA_WORLD_U17": "soccer/fifa.world.u17",
    "FIFA_WORLD_U20": "soccer/fifa.world.u20",
    "UEFA_CHAMPIONS": "soccer/uefa.champions",
    "UEFA_EUROPA": "soccer/uefa.europa",
    "UEFA_EUROPEAN_CHAMPIONSHIP": "soccer/uefa.euro",
    "UEFA_EUROPEAN_CHAMPIONSHIP_Q": "soccer/uefa.euroq",
    "UEFA_EUROPEAN_CHAMPIONSHIP_U19": "soccer/uefa.euro.u19",
    "UEFA_EUROPEAN_CHAMPIONSHIP_U21": "soccer/uefa.euro_u21",
    "UEFA_NATIONS": "soccer/uefa.nations",
    "SAFF_CHAMPIONSHIP": "soccer/afc.saff.championship",
    "WOMENS_EUROPEAN_CHAMPIONSHIP": "soccer/uefa.weuro",

    //North American Soccer
    "CONCACAF_CHAMPIONS": "soccer/concacaf.champions",
    "CONCACAF_LEAGUE": "soccer/concacaf.league",
    "CRC_PRIMERA_DIV": "soccer/crc.1",
    "GUA_LIGA_NACIONAL": "soccer/gua.1",
    "HON_PRIMERA_DIV": "soccer/hon.1",
    "JAM_PREMIER_LEAGUE": "soccer/jam.1",
    "MEX_ASCENSO_MX": "soccer/mex.2",
    "MEX_COPA_MX": "soccer/mex.copa_mx",
    "MEX_LIGA_BANCOMER": "soccer/mex.1",
    "SLV_PRIMERA_DIV": "soccer/slv.1",
    "USA_MLS": "soccer/usa.1",
    "USA_NCAA_SL_M": "soccer/usa.ncaa.m.1",
    "USA_NCAA_SL_W": "soccer/usa.ncaa.w.1",
    "USA_NASL": "soccer/usa.nasl",
    "USA_NWSL": "soccer/usa.nwsl",
    "USA_OPEN": "soccer/usa.open",
    "USA_USL": "soccer/usa.usl.1",

  },

  /*
    Used with isSoccer() so that we can quickly identify soccer leagues
    for score display patterns, instead of IFs for each league
   */
  SOCCER_LEAGUES: [

    //International
    "AFC_ASIAN_CUP",
    "AFC_ASIAN_CUP_Q",
    "AFF_CUP",
    "AFR_NATIONS_CUP",
    "AFR_NATIONS_CUP_Q",
    "CONCACAF_GOLD_CUP",
    "CONCACAF_NATIONS_Q",
    "CONCACAF_WOMENS_CHAMPIONSHIP",
    "CONMEBOL_COPA_AMERICA",
    "FIFA_CLUB_WORLD_CUP",
    "FIFA_CONFEDERATIONS_CUP",
    "FIFA_MENS_FRIENDLIES",
    "FIFA_MENS_OLYMPICS",
    "FIFA_WOMENS_FRIENDLIES",
    "FIFA_WOMENS_WORLD_CUP",
    "FIFA_WOMENS_OLYMPICS",
    "FIFA_WORLD_CUP",
    "FIFA_WORLD_CUP_Q_AFC",
    "FIFA_WORLD_CUP_Q_CAF",
    "FIFA_WORLD_CUP_Q_CONCACAF",
    "FIFA_WORLD_CUP_Q_CONMEBOL",
    "FIFA_WORLD_CUP_Q_OFC",
    "FIFA_WORLD_CUP_Q_UEFA",
    "FIFA_WORLD_U17",
    "FIFA_WORLD_U20",
    "UEFA_CHAMPIONS",
    "UEFA_EUROPA",
    "UEFA_EUROPEAN_CHAMPIONSHIP",
    "UEFA_EUROPEAN_CHAMPIONSHIP_Q",
    "UEFA_EUROPEAN_CHAMPIONSHIP_U19",
    "UEFA_EUROPEAN_CHAMPIONSHIP_U21",
    "UEFA_NATIONS",
    "SAFF_CHAMPIONSHIP",
    "WOMENS_EUROPEAN_CHAMPIONSHIP",

    //North American
    "CONCACAF_CHAMPIONS",
    "CONCACAF_LEAGUE",
    "CRC_PRIMERA_DIV",
    "GUA_LIGA_NACIONAL",
    "HON_PRIMERA_DIV",
    "JAM_PREMIER_LEAGUE",
    "MEX_ASCENSO_MX",
    "MEX_COPA_MX",
    "MEX_LIGA_BANCOMER",
    "SLV_PRIMERA_DIV",
    "USA_MLS",
    "USA_NCAA_SL_M",
    "USA_NCAA_SL_W",
    "USA_NASL",
    "USA_NWSL",
    "USA_OPEN",
    "USA_USL",
  ],


  getLeaguePath: function(league) {
    return this.LEAGUE_PATHS[league];
  },

  getScores: function(league, teams, gameDate, callback) {

    var self = this;

    var url = "http://site.api.espn.com/apis/site/v2/sports/" +
      this.getLeaguePath(league) +
      "/scoreboard?dates=" +
      moment(gameDate).format("YYYYMMDD") + "&limit=200";


    ///temporary link to have Soccer Games ShowingUp  ** Use this to have the API point to a date
    // var url = "http://site.api.espn.com/apis/site/v2/sports/" +
    //     this.getLeaguePath(league) +
    //     "/scoreboard?dates=20180317" +
    //     "&limit=200";


    request({url: url, method: "GET"}, function(r_err, response, body) {

      if(!r_err && response.statusCode == 200) {

        parseJSON(body, function(p_err, content) {
          if (p_err) {
            console.log( "[MMM-MyScoreboard] " + moment().format("D-MMM-YY HH:mm") + " ** ERROR ** Couldn't parse " + league + " data for provider ESPN: " + p_err );
          } else {
            callback(self.formatScores(league, content, teams));
          }
        });

      } else {
        console.log( "[MMM-MyScoreboard] " + moment().format("D-MMM-YY HH:mm") + " ** ERROR ** Couldn't retrieve " + league + " data for provider ESPN: " + r_err );
        console.log( "[MMM-MyScoreboard] " + url );

      }

    });


  },

  formatScores: function(league, data, teams) {

    // var self = this;
    var formattedGamesList = new Array();
    var localTZ = moment.tz.guess();

    var filteredGamesList;
    if (teams != null) { //filter to teams list

      filteredGamesList = data.events.filter(function(game) {

        //if "@T25" is in the teams list, it indicates to include teams ranked in the top 25
        if (teams.indexOf("@T25") != -1 &&
            ( (game.competitions[0].competitors[0].curatedRank.current >= 1 &&
                game.competitions[0].competitors[0].curatedRank.current <= 25) ||
                (game.competitions[0].competitors[1].curatedRank.current >= 1 &&
                    game.competitions[0].competitors[1].curatedRank.current <= 25) )) {
          return true;
        }

        return teams.indexOf(game.competitions[0].competitors[0].team.abbreviation) != -1 ||
            teams.indexOf(game.competitions[0].competitors[1].team.abbreviation) != -1;
      });

    } else { //return all games
      filteredGamesList = data.events;
    }

    //sort by start time, then by away team shortcode.
    filteredGamesList.sort(function(a,b) {
      var aTime = moment(a.competitions[0].date);
      var bTime = moment(b.competitions[0].date);

      //first sort by start time
      if (aTime.isBefore(bTime)) {
        return -1;
      }
      if (aTime.isAfter(bTime)) {
        return 1;
      }

      //start times are the same.  Now sort by away team short codes
      var aTteam = (a.competitions[0].competitors[0].homeAway == "away" ?
          a.competitions[0].competitors[0].team.abbreviation :
          a.competitions[0].competitors[1].team.abbreviation);

      var bTteam = (b.competitions[0].competitors[0].homeAway == "away" ?
          b.competitions[0].competitors[0].team.abbreviation :
          b.competitions[0].competitors[1].team.abbreviation);


      if (aTteam < bTteam) {
        return -1;
      }
      if (aTteam > bTteam) {
        return 1;
      }

      return 0;

    });


    //iterate through games and construct formattedGamesList
    filteredGamesList.forEach(game => {

      var status = [];
      var classes = [];

      var gameState = 0;

      var hTeamData = game.competitions[0].competitors[0];
      var vTeamData = game.competitions[0].competitors[1];

      /*
        Looks like the home team is always the first in the feed, but it also specified,
        so we can be sure.
      */

      if (hTeamData.homeAway == "away") {
        hTeamData = game.competitions[0].competitors[1];
        vTeamData = game.competitions[0].competitors[0];
      }      

      /*
        Not all of ESPN's status.type.id's are supported here.
        Some are for sports that this provider doesn't yet
        support, and some are so rare that we'll likely never
        see it.  These cases are handled in the 'default' block.
      */
      switch (game.status.type.id) {
        case "0" : //TBD
          gameState = 0;
          status.push("TBD");
          break;
        case "1": //scheduled
          gameState = 0;
          status.push(moment(game.competitions[0].date).tz(localTZ).format("h:mm a"));
          break;
        case "2": //in-progress
        case "21": //beginning of period
        case "24": //overtime
        case "25": //SOCCER first half
        case "26": //SOCCER second half
        case "43": //SOCCER Golden Time
        case "44": //Shootout
          gameState = 1;
          status.push(game.status.displayClock);
          status.push(this.getPeriod(league, game.status.period));            
          break;
        case "3": //final
          gameState = 2;
          status.push("Final" + this.getFinalOT(league, game.status.period));
          break;
        case "4": //forfeit
        case "9": //forfeit of home team
        case "10": //forfeit of away team
          gameState = 0;
          status.push("Forfeit");
          break;
        case "5": //cancelled
          gameState = 0;
          status.push("Cancelled");
          break;
        case "6": //postponed
          gameState = 0;
          status.push("Postponed");
          break;
        case "7":  //delayed
        case "17": //rain delay
          gameState = 1;
          classes.push["delay"];
          status.push("Delay");
          break;
        case "8": //suspended
          gameState = 0;
          status.push("Suspended");
          break;
        case "22": //end period
        case "48": //SOCCER end extra time
          gameState = 1;
          status.push("END");
          status.push(this.getPeriod(league, game.status.period));
          break;
        case "23": //halftime
          gameState = 1;
          status.push("HALFTIME");
          break;
        case "49": //SOCCER extra time half time
          gameState = 1;
          status.push("HALFTIME (ET)");
          break;
        case "28": //SOCCER Full Time
          gameState = 2;
          status.push("Full Time " + this.getFinalOT(league, game.status.period));
          break;
        case "45": //SOCCER Final ET
        case "46": //SOCCER final score - after golden goal
          gameState = 2;
          status.push("Full Time (ET)"); 
          break;         
        case "47": //Soccer Final PK
          gameState = 2;
          status.push("Full Time (PK) " + this.getFinalPK(hTeamData,vTeamData)); 
          break;         
        default: //Anything else, treat like a game that hasn't started yet
          gameState = 0;
          status.push(moment(game.competitions[0].date).tz(localTZ).format("h:mm a"));
          break;

      }


      //determine which display name to use
      var hTeamLong = hTeamData.team.shortDisplayName;
      var vTeamLong = vTeamData.team.shortDisplayName;

      formattedGamesList.push({
        classes: classes,
        gameMode: gameState,
        hTeam: hTeamData.team.abbreviation == undefined ? hTeamData.team.name.substring(0,4).toUpperCase() + " " : hTeamData.team.abbreviation,
        vTeam: vTeamData.team.abbreviation == undefined ? vTeamData.team.name.substring(0,4).toUpperCase() + " " : vTeamData.team.abbreviation,
        hTeamLong: hTeamLong,
        vTeamLong: vTeamLong,
        hTeamRanking: null,
        vTeamRanking: null,
        hScore: parseInt(hTeamData.score),
        vScore: parseInt(vTeamData.score),
        status: status,
        hTeamLogoUrl: hTeamData.team.logo ? hTeamData.team.logo : "",
        vTeamLogoUrl: vTeamData.team.logo ? vTeamData.team.logo : ""
      });

    });

    return formattedGamesList;



  },

  formatT25Ranking: function(rank) {
    if (rank >= 1 && rank <= 25) {
      return rank;
    }
    return null;
  },

  getOrdinal: function(p) {

    var mod10 = p % 10;
    var mod100 = p % 100;

    if (mod10 == 1 && mod100 != 11) {
      return p + "<sup>ST</sup>";
    }
    if (mod10 == 2 && mod100 != 12) {
      return p + "<sup>ND</sup>";
    }
    if (mod10 == 3 && mod100 != 13) {
      return p + "<sup>RD</sup>";
    }

    return p + "<sup>TH</sup>";

  },

  getPeriod: function(league, p) {

    //check for overtime, otherwise return ordinal
    if (this.isSoccer(league)) {

      if (p > 2) {
        return "ET";
      } else {
        return ""; //no need to indicate first or second half        
      }

    } else {
      if (p == 5) {
        return "OT";
      } else if (p > 5) {
        return (p - 4) + "OT";
      }      
    }

    return this.getOrdinal(p);

  },

  getFinalOT: function(league, p) {

    if (this.isSoccer(league) && p > 2) {
      return " (ET)";    
    } else if (!this.isSoccer(league)) {
      if (p == 5) {
        return " (OT)";
      } else if (p > 5) {
        return " (" + (p - 4) + "OT)";
      }
    }

    return "";
  },

  getFinalPK: function (hTeamData,vTeamData) {
    return hTeamData.shootoutScore + "x" + vTeamData.shootoutScore;
  },

  isSoccer: function(league) {
    return (this.SOCCER_LEAGUES.indexOf(league) !== -1);
  }


};
