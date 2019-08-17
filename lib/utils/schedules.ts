import { tournmanetSchema } from "../models/tournament-model";
import { matchSchema } from "../models/match-model";
import * as mongoose from 'mongoose';
import { groupSchema } from "../models/group-model";
import { CourtSchema } from "../models/court-model";

const Match = mongoose.model('Match', matchSchema);
const Group = mongoose.model('Group', groupSchema)
const Tournament = mongoose.model('Tournament', tournmanetSchema);
const Court = mongoose.model('Court', CourtSchema)

export class Schedules {
  tournamentId: string;
  totalCourts: number;
  courts: any;
  hoursPerDay: number;
  days: string[] = [];
  matchesPerDay: number;
  allPosibleMatches: number;
  matchesCreated: any;
  maxGroup: any;

  constructor(tournamenId: string) {
    this.tournamentId = tournamenId;
  }
  /**
    * getTournamentInfo
    * Get info of the current tournament
    */
  public async getTournamentInfo() {
    let tournament = await Tournament.find({ '_id': this.tournamentId });
    let diffDays = 0;
    let allDays: string[] = [];
    this.totalCourts = tournament[0].courts;
    this.hoursPerDay = tournament[0].hoursPerDay;

    diffDays = tournament[0].EndDate.getDate() - tournament[0].starDate.getDate();
    for (let i = 0; i <= diffDays; i++) {
      let dToSave = new Date();
      dToSave.setDate(tournament[0].starDate.getDate() + i)
      allDays.push(dToSave.toISOString());
    }
    this.days = allDays;
    this.matchesCreated = await Match.find({ 'tournamentID': this.tournamentId });
    this.courts = await Court.find({}).sort({ 'availability': -1 });
    this.maxGroup = await Group.aggregate([
      { $unwind: "$teamID" },
      { $group: { _id: "$_id", teamNumber: { $sum: 1 } } },
      { $sort: { len: -1 } }
      // { $limit: 1 }
    ]);

    // this.distributeMatches();
  }

  private async distributeMatches() {
    let matchTime = 1;
    let posibleMatches: number;
    this.matchesPerDay = (this.hoursPerDay / matchTime) * (this.totalCourts);
    this.allPosibleMatches = this.matchesPerDay * this.days.length;

    //Refactor
    posibleMatches = this.matchesCreated.length + 16;
    if (this.matchesCreated.length && posibleMatches < this.allPosibleMatches) {
      console.log('there are time for 8th', posibleMatches);
    } else {
      posibleMatches = this.matchesCreated.length + 8;
      if (this.matchesCreated.length && posibleMatches < this.allPosibleMatches) {
        console.log('There are  time for 4th', posibleMatches);
      } else {
        posibleMatches = this.matchesCreated.length + 4;
        if (this.matchesCreated.length && posibleMatches < this.allPosibleMatches) {
          console.log('There are  time for semis', posibleMatches);
        } else {
          console.log('There are not time', posibleMatches);
        }
      }
    }
    console.log('matches per day ', this.matchesPerDay);
    console.log('All pasible matches ', this.allPosibleMatches);
    console.log('matches created', this.matchesCreated.length);

  }
  /**
   * schedulefill
   * Will fill all the schedule according the four rules method
   */
  public async scheduleInit() {


    let groups = [];
    let days = [];
    let worseIndividual = { days: [], score: 0 };
    let bestIndividual = { days: [], score: 9999 };
    let index = 0
    await this.getTournamentInfo();

    for (const group of this.maxGroup) {
      let matches = await Match.find({ 'groupName': group._id.toString() });
      let gp = {
        id: group._id.toString(),
        matches: matches
      };
      groups.push(gp);
    }
    for (index; index < 400; index++) {
      let individual = { days: [], score: 0 };
      let days = this.createDays();
      let i;
      individual.days = this.createIndividual(groups, days);
      i = this.fitnessFunction(individual);
      if (i.score > worseIndividual.score) {
        worseIndividual = i;
      }
      if (i.score < bestIndividual.score) {
        bestIndividual = i;
      }
    }
    console.log('Best: ', bestIndividual);
    console.log('Worse: ', worseIndividual);
    console.log('poblation number: ', index);
  }
  /**
   * createDays
   * @Description 
   * @returns days object
   */
  private createDays(): any {
    let days = [];
    for (let i = 0; i < this.days.length; i++) {
      let day = [];
      for (const court of this.courts) {
        let ct = {
          id: court._id.toString(),
          hours: []
        };
        for (const dayHour of court.dayHours) {
          let dh = {
            hours: dayHour,
            matchId: ''
          }
          ct.hours.push(dh);
        }
        day.push(ct);
      }
      days.push(day);
    }
    return days;
  }

  /**
   * individual
   * @param groups
   * @param days
   * @returns an individual
   */
  private createIndividual(groups, days) {
    let complete = this.matchesCreated.length;

    while (complete !== 0) {
      let randomGroup = Math.floor(Math.random() * groups.length);
      let randomMatch = Math.floor(Math.random() * groups[randomGroup].matches.length);
      let randomDay = Math.floor(Math.random() * days.length);
      let randomCourt = Math.floor(Math.random() * days[randomDay].length);
      let randomHour = Math.floor(Math.random() * days[randomDay][randomCourt].hours.length);
      if (!days[randomDay][randomCourt].hours[randomHour].matchId) {
        days[randomDay][randomCourt].hours[randomHour].matchId = groups[randomGroup].matches[randomMatch]._id.toString();
        complete--;
      }


    }
    return days;
  }
  /**
   * fitnessFunction
   * @param gMatch
   * @param individual
   * @description it is the score function, where evalute each gen inside the individual
   * @returns score
   * 
   */
  private fitnessFunction(individual): any {
    let score = 0;
    for (let i = 0; i < individual.days.length; i++) {
      for (let j = 0; j < individual.days[i].length; j++) {
        for (let k = 0; k < individual.days[i][j].hours.length; k++) {
          score += this.ruleOne(individual.days[i], individual.days[i][j].hours[k].matchId, k, j);
          score += this.ruleTwo(individual.days[i][j].hours, individual.days[i][j].hours[k].matchId);
          score += this.ruleThree(individual.days[i][j].hours, individual.days[i][j].hours[k].matchId);
          score += this.ruleFour(individual.days.length, individual.days[i][j].hours);
        }
      }
    }
    individual.score = Math.round(score * 100) / 100;
    return individual;
  }

  /**
   * @name ruleOne
   * @description This rule verify that the matches are in the same time
   * @param courts 
   * @param gMatch 
   * @param hour 
   * @param court 
   * @returns scoreRuleOne
   */
  private ruleOne(courts, gMatch, hour, court): number {
    let scoreRuleOne = 0;
    if (!gMatch) {
      return 0;
    }
    let teamsMatchToEvaluate = this.getTeamsFromMatch(gMatch);

    for (let i = 0; i < courts.length; i++) {
      if (!courts[i].hours[hour]) {
        continue;
      } else if (i !== court) {
        let teamsMatch = this.getTeamsFromMatch(courts[i].hours[hour].matchId);
        if (teamsMatchToEvaluate[0] === teamsMatch[0] || teamsMatchToEvaluate[1] === teamsMatch[0]
          || teamsMatchToEvaluate[0] === teamsMatch[1] || teamsMatchToEvaluate[1] === teamsMatch[1]) {
          scoreRuleOne++;
        }
      }
    }
    return scoreRuleOne;

  }
  /**
   * @name ruleTwo
   * @param hours 
   * @param gMatch 
   * @param hour 
   * @description Validate one team can not play more than three times in a day. 
   */
  private ruleTwo(hours, gMatch): number {
    let scoreRuleTwo = 0;
    let teamOne = 0, teamTwo = 0;
    if (!gMatch) {
      return 0;
    }
    let teamsMatchToEvaluate = this.getTeamsFromMatch(gMatch);
    for (let i = 0; i < hours.length; i++) {
      if (!hours[i].matchId) {
        continue;
      } else {
        let teamsMatch = this.getTeamsFromMatch(hours[i].matchId);
        if (teamsMatchToEvaluate[0] === teamsMatch[0] || teamsMatchToEvaluate[0] === teamsMatch[1]) {
          teamOne++;
        }
        if (teamsMatchToEvaluate[1] === teamsMatch[0] || teamsMatchToEvaluate[1] === teamsMatch[1]) {
          teamTwo++;
        }
      }
    }
    if (teamOne >= 3 || teamTwo >= 3) {
      scoreRuleTwo += 0.2;
    }
    return scoreRuleTwo;
  }
  /**
   * @name ruleThree
   * @param hours 
   * @param gMatch 
   * @param hour 
   * @description One team can not wait more than two matches to play again.
   */
  private ruleThree(hours, gMatch): number {
    let scoreRuleThree = 0;
    let teamOne = 0, teamTwo = 0;
    if (!gMatch) {
      return 0;
    }
    let teamsMatchToEvaluate = this.getTeamsFromMatch(gMatch);
    for (let i = 0; i < hours.length; i++) {
      if (!hours[i].matchId) {
        teamOne++;
        teamTwo++;
        continue;
      } else {
        let teamsMatch = this.getTeamsFromMatch(hours[i].matchId);
        if (teamsMatchToEvaluate[0] === teamsMatch[0] || teamsMatchToEvaluate[0] === teamsMatch[1]) {
          teamOne = 0;
        } else {
          teamOne++;
        }
        if (teamsMatchToEvaluate[1] === teamsMatch[0] || teamsMatchToEvaluate[1] === teamsMatch[1]) {
          teamTwo = 0;
        } else {
          teamTwo++;
        }
      }
    }
    if (teamOne >= 2 || teamTwo >= 2) {
      scoreRuleThree += 0.2;
    }
    return scoreRuleThree;
  }
  /**
   * @name ruleFour
   * @description There are not empty spaces
   * @param matchId 
   * @returns score
   */
  private ruleFour(nDays, hours): number {
    let scoreRuleFour = 0;
    for (let i = 0; i < nDays; i++) {
      let scoreProd = 1 + i;
      let spaceCounter = 0;
      for (let j = 0; j < hours.length; j++ ){
        if (!hours[j].matchId) {
          scoreRuleFour += ++spaceCounter * scoreProd;
        } else {
          spaceCounter = 0;
        }
      }

    }
    return (scoreRuleFour/1000);
  }
  /**
   * @name getTeamsFromMatch
   * @description Get the teams from a match
   * @param matchId 
   * @returns teams
   */
  private getTeamsFromMatch(matchId): any[] {
    let teams = [];
    if (!matchId) {
      return teams;
    }
    for (const match of this.matchesCreated) {
      if (match._id.toString() === matchId) {
        teams.push(match.teamOne);
        teams.push(match.teamTwo);
      }
    }
    return teams;
  }
  /**
   * matchUpdate
   * @param match 
   * @param hour
   * @description it should update the match with its time and court
   */
  private async matchUpdate(match, hour, day) {
    let matchToUpdate = match;
    let dateMatch = new Date(Date.parse(this.days[day]));
    dateMatch.setHours(parseInt(hour[0]));
    match.dateMatch = dateMatch;
    // let correct = await this.fourRules(match);
    console.log('this is the match ==> ', match);
  }

}