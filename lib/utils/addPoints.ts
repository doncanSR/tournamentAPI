import { MatchDataInterface } from "./interfaces/matchData-interface";
import { teamSchema } from "../models/team-model";
import { matchSchema } from "../models/match-model";
import { phaseSchema } from "../models/phase/phase-model";
import { tournamentSchema } from "../models/tournament-model";
import { model, Types } from 'mongoose';
import * as constants from "../utils/tournamentConstants";
import { tournamentRoutes } from "routes/tournament-routes";
import { Schedules } from "./schedules";
import { PhaseController } from "controllers/phase-controller";

const Transaction = require("mongoose-transactions");
const assert = require('assert');

const Team = model('Team', teamSchema);
const Match = model('Match', matchSchema);
const Tournament = model('Tournament', tournamentSchema);
const Phase = model('Phase', phaseSchema);


export class AddPoints implements MatchDataInterface {
    pointsTO: number;
    pointsTT: number;
    matchId: Object;
    totalPointsTO: any;
    totalPointsTT: any;
    totalMatches: number;
    matches: number;
    private totalPointsClassTO: any;
    private totalPointsClassTT: any;
    private totalPointsMatchTO: any;
    private totalPointsMatchTT: any;
    teamOne: string;
    teamTwo: string;
    setsTO: number;
    setsTT: number;
    totalSetsTO: any;
    totalSetsTT: any;
    tournamentId: Object;
    refereeId: Object;

    constructor(tournamentId: Object){

        this.tournamentId = tournamentId;
        
    }
    
    async wasAdded(matchData: MatchDataInterface): Promise <{status: number, message: string}>{
        
        let inValid = await this.findPreviousMatch(matchData);
        if (inValid && typeof inValid !== "object") {
            return {
                status: 410,
                message: inValid
            };
        }

        this.teamOne = matchData.teamOne;
        this.teamTwo = matchData.teamTwo;
        this.setsTO = matchData.setsTO;
        this.setsTT = matchData.setsTT;
        this.totalPointsMatchTO = matchData.pointsTO;
        this.totalPointsMatchTT = matchData.pointsTT;
        this.tournamentId = matchData.tournamentId;
        this.matchId = matchData.matchId;
        this.refereeId = matchData.refereeId;
        
        return await this.updatePoints();
    }


    /**
     * findPreviousMatch
     * @param matchData 
     * @description search if the match was added
     * @returns false if the match was not added; error message if the match was added before
   */

  private async findPreviousMatch(matchData){
    let valid = await Match.findById(matchData.matchId, (err, match) =>{
        if (match.pointsTeamOne || match.pointsTeamTwo 
            || match.setsTeamOne || match.setsTeamTwo){
        
            return {
                status: constants.ERROR_DUPLICATED,
                message: constants.ERROR_REGISTER
            };
        }
        else if (match.pointsTeamOne && match.pointsTeamTwo 
            && match.setsTeamOne && match.setsTeamTwo) {
            
            return {
                status: constants.ERROR_DUPLICATED,
                message: constants.ERROR_REGISTER
            };
        }
                    
    });

    return valid;
  }
    
    private async updatePoints(): Promise <{status: number, message: string}>{

        await this.getTotalPoints();

        this.totalSetsTO += this.setsTO;
        this.totalSetsTT += this.setsTT;

        //Who is the winner??
        if(this.setsTO > this.setsTT){
            this.totalPointsTO += this.totalPointsMatchTO - this.totalPointsMatchTT;
            if (this.setsTT === 0) {
                //Add 3 points to TO
                this.totalPointsClassTO += 3;
            }else{
                //Add 2 points to TO and 1 to TT
                this.totalPointsClassTO += 2;
                this.totalPointsClassTT += 1;
            }
        }else{
            this.totalPointsTT += this.totalPointsMatchTT - this.totalPointsMatchTO;
            if (this.setsTO === 0) {
                //Add 3 points to TT
                this.totalPointsClassTT += 3;
            }else{
                //Add 2 points to TT and 1 to TO
                this.totalPointsClassTT += 2;
                this.totalPointsClassTO += 1;
            }
        }

        return this.transactionMatch();
    }

    private async getTotalPoints(){
        
        //Get all points

        await Team.findById(this.teamOne).then((team) => {
            this.totalPointsClassTO = team.pointsClass || 0;
            this.totalPointsTO = team.pointsTotal || 0;
            this.totalSetsTO = team.sets || 0;        
        });

        await Team.findById(this.teamTwo).then((team) => {
            this.totalPointsClassTT = team.pointsClass || 0;
            this.totalPointsTT = team.pointsTotal || 0;
            this.totalSetsTT = team.sets || 0;        
        });
    }

    private async transactionMatch(){

        const useDB = true;
        const transaction = new Transaction(useDB);
        let result = {
            status: constants.STATUS_OK,
            message: constants.SUCCESSFUL_REGISTER
        }
        
        const team: string = 'Team';
        const match: string = 'Match';

        try {

            transaction.update(team,this.teamOne,{ 
                pointsTotal: this.totalPointsTO,
                pointsClass: this.totalPointsClassTO,
                sets: this.totalSetsTO
            },{new: true});

            transaction.update(team,this.teamTwo,{ 
                pointsTotal: this.totalPointsTT,
                pointsClass: this.totalPointsClassTT,
                sets: this.totalSetsTT
            },{new: true});            

            transaction.update(match,this.matchId,{ 
                pointsTeamOne: this.totalPointsMatchTO,
                pointsTeamTwo: this.totalPointsMatchTT,
                setsTeamOne: this.setsTO,
                setsTeamTwo: this.setsTT,
                refereeId: this.refereeId
            },{new: true});

            const final = await transaction.run();


        } catch (error) {

            console.error(error);
            const rollbackObj = await transaction.rollback().catch(console.error);
            transaction.clean();
            result = {
                status: constants.ERROR_INTERNAL_SERVER,
                message: constants.ERROR_REGISTER
            };

        }

        return result;

    }

    // private transactionMatch(){

    //     let session = null;

    //     let result = {
    //         status: constants.ERROR_INTERNAL_SERVER,
    //         message: constants.ERROR_REGISTER
    //     };

    //     async () => await Team.startSession().
    //     then(async session => session.withTransaction(async () => {
    //         return await Team.findOneAndUpdate({_id: this.teamOne},{
    //             pointsTotal: this.totalPointsTO,
    //             pointsClass: this.totalPointsClassTO,
    //             sets: this.totalSetsTO
    //         },{ session: session});
    //     })).
    //     then( async () => await Team.countDocuments()).
    //     then(count => console.log(assert.strictEqual(count, 1)));
        
    //     return result;
    // }


     /**
     * getList
     * @description do the list of the best teams
     * @returns a ordered list with the best teams, started with the best and finish with the 
     */
    async getList(phaseId){
        let list = await Team.find({tournamentId: this.tournamentId, phaseId: phaseId}, err => {
            return {
                status: constants.ERROR_INTERNAL_SERVER,
                message: constants.ERROR_QUERY
            }
        });
        return await this.bubbleSort(list);
    }

    bubbleSort = arr => {
        const l = arr.length;
        for (let i = 0; i < l; i++) {
            for (let j = 0; j < l - 1 - i; j++) {
                if (arr[j].pointsClass > arr[j + 1].pointsClass) {
                    //The best in pairs by Points Class
                    [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
                } else if (arr[j].pointsClass === arr[j + 1].pointsClass) {
                    //It's a tie by points
                    if (arr[j].sets > arr[j + 1].sets) {
                        //The best in pairs by Sets
                        [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
                    } else if (arr[j].sets === arr[j + 1].sets) {
                        //It's a tie by sets
                        if (arr[j].pointsTotal > arr[j + 1].pointsTotal) {
                            //The best in pairs by Total Points
                            [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
                        }
                    }
                }
            }
        }
        return arr;
    };
     /**
     * finishGroupPhase
     * @description when the groups phase finish, the next phase and the matches will be created and
     * teams and tournament will be updated
     * @returns  
     */
    public async finishGroupPhase(){

        let tournament = await Tournament.findById(this.tournamentId);
        let numberOfPhases = tournament.numberOfPhases;
        let listTeams = await this.getList(this.tournamentId);
        let bestTeams = listTeams.splice(Math.pow(2,numberOfPhases));
        let phaseId; 
        switch(numberOfPhases - 1){
            case 5:
                phaseId = constants.SIXTEENTHS_PHASE_ID;
                break;
            case 4:
                phaseId = constants.EIGHTHS_PHASE_ID;
                break;
            case 3:
                phaseId = constants.QUARTERS_PHASE_ID;
                break;
            case 2:
                phaseId = constants.SEMIFINAL_PHASE_ID;
                break;
            case 1:
                phaseId = constants.FINAL_PHASE_ID;
                break;
        }

        this.createMatches(bestTeams, phaseId);

    }
     /**
     * createMatches
     * @description do the list of the best teams
     * @returns a ordered list with the best teams, started with the best and finish with the 
     */
    private createMatches(bestTeams, phaseId){
        let schedule = new Schedules(this.tournamentId);
        schedule.createPhaseMatch(bestTeams, Types.ObjectId(phaseId));
        
    }
     /**
     * updateTeams
     * @description do the list of the best teams
     * @returns a ordered list with the best teams, started with the best and finish with the 
     */
    private updateTeams(){

    }
}