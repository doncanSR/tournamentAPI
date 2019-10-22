import { MatchDataInterface } from "./interfaces/matchData-interface";
import { teamSchema } from "../models/team-model";
import * as mongoose from 'mongoose';

const Team = mongoose.model('Team', teamSchema);

export class AddPoints implements MatchDataInterface {
    pointsTO: number;
    pointsTT: number;

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
    tournamentID: string;
    list: any;
    orderedList: any;

    constructor(matches: number){
        this.totalMatches = matches;
        this.matches = 0;
    }

    private async updatePoints(){

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
        await Team.findOneAndUpdate({ _id: this.teamOne },{ 
            pointsTotal: this.totalPointsTO,
            pointsClass: this.totalPointsClassTO,
            sets: this.totalSetsTO
        });
        await Team.findOneAndUpdate({ _id: this.teamTwo },{ 
            pointsTotal: this.totalPointsTT,
            pointsClass: this.totalPointsClassTT,
            sets: this.totalSetsTT
        });

        return this.registredMatch();
    }

        
    async wasAdded(matchData: MatchDataInterface) {
        
        this.teamOne = matchData.teamOne;
        this.teamTwo = matchData.teamTwo;
        this.setsTO = matchData.setsTO;
        this.setsTT = matchData.setsTT;
        this.totalPointsMatchTO = matchData.pointsTO;
        this.totalPointsMatchTT = matchData.pointsTT;
        this.tournamentID = matchData.tournamentID;
        
        return await this.updatePoints();
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

    registredMatch(){
        
        this.matches++;
        if (this.matches < this.totalMatches)
            return false;    //Continue with the games
        else
            return true; //Throw the list
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

    async getList(){
        this.list = await Team.find({ 'tournamentID': '5c6c8c4632600327ae2046c2'}, {});
        this.orderedList = this.bubbleSort(this.list);
        return this.orderedList;
    }
}