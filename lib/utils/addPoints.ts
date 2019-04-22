import { MatchDataInterface } from "./interfaces/matchData-interface";
import { teamSchema } from "../models/team-model";
import * as mongoose from 'mongoose';
import { TeamController } from "controllers/team-controller";

const Team = mongoose.model('Team', teamSchema);

export class addPoints implements MatchDataInterface {

    totalPointsTO: any;
    totalPointsTT: any;
    added: boolean;
    totalMatches: number
    ;
    private totalPointsClassTO: any;
    private totalPointsClassTT: any;
    private totalPointsMatchTO: number;
    private totalPointsMatchTT: number;
    teamOne: string;
    teamTwo: string;
    setsTO: number;
    setsTT: number;
    totalSetsTO: any;
    totalSetsTT: any;
    tournamentID: string;

    constructor(matches: number){
        this.totalMatches = matches;
    }

    private async updatePoints(){

        await this.getTotalPoints();

        this.totalSetsTO += this.setsTO;
        this.totalSetsTT += this.setsTT;

        if(this.setsTO > this.setsTT){
            this.totalPointsTO += this.totalPointsMatchTO - this.totalPointsMatchTT;
            if (this.setsTT === 0) {
                //Agrega 3 puntos a TO
                this.totalPointsClassTO += 3;
                await Team.findOneAndUpdate({ _id: this.teamOne },{ 
                    pointsTotal: this.totalPointsTO,
                    pointsClass: this.totalPointsClassTO
                });

            }else{
                this.totalPointsClassTO += 2;
                this.totalPointsClassTT += 1;
                await Team.findOneAndUpdate({ _id: this.teamOne },{ 
                    pointsTotal: this.totalPointsTO,
                    pointsClass: this.totalPointsClassTO
                });
                await Team.findOneAndUpdate({ _id: this.teamTwo },{ 
                    pointsClass: this.totalPointsClassTT
                });
                //Agrega 2 puntos a TO y 1 a TT
            }
        }else{
            this.totalPointsTT += this.totalPointsMatchTT - this.totalPointsMatchTO;
            if (this.setsTO === 0) {
                //Agrega 3 puntos a TT
                this.totalPointsClassTT += 3;
                await Team.findOneAndUpdate({ _id: this.teamTwo },{ 
                    pointsTotal: this.totalPointsTT,
                    pointsClass: this.totalPointsClassTT
                });

            }else{
                this.totalPointsClassTT += 2;
                this.totalPointsClassTO += 1;
                await Team.findOneAndUpdate({ _id: this.teamTwo },{ 
                    pointsTotal: this.totalPointsTT,
                    pointsClass: this.totalPointsClassTT
                });
                await Team.findOneAndUpdate({ _id: this.teamOne },{ 
                    pointsClass: this.totalPointsClassTO
                });
                //Agrega 2 puntos a TT y 1 a TO
            }
        }
    }

        
    wasAdded(matchData: MatchDataInterface): boolean {
        
        this.totalPointsMatchTO = matchData.totalPointsTO;
        this.totalPointsMatchTT = matchData.totalPointsTT;
        this.teamOne = matchData.teamOne;
        this.teamTwo = matchData.teamTwo;
        this.setsTO = matchData.setsTO;
        this.setsTT = matchData.setsTT;
        this.tournamentID = matchData.tournamentID;
        this.added = false;

        this.updatePoints();
            
            



        
        this.added = true;
        return this.added;
    }
    
    private async getTotalPoints(){

        this.totalPointsClassTO = await Team.findOne({ '_id': this.teamOne}, {'pointsClass':1, '_id':0});
        this.totalPointsClassTO = this.totalPointsClassTO.pointsClass || 0;
        this.totalPointsClassTT = await Team.findOne({ '_id': this.teamTwo}, {'pointsClass':1, '_id':0});
        this.totalPointsClassTT = this.totalPointsClassTT.pointsClass || 0;
        this.totalPointsTO = await Team.find({_id: this.teamOne }, {'pointsTotal':1, '_id':0});
        this.totalPointsTO = this.totalPointsTO.pointsTotal || 0;
        this.totalPointsTT = await Team.find({_id: this.teamTwo }, {'pointsTotal':1, '_id':0});
        this.totalPointsTT = this.totalPointsTT.pointsTotal || 0;
        this.totalSetsTO = await Team.find({_id: this.teamOne }, {'sets':1, '_id':0});
        this.totalSetsTO = this.totalSetsTO.sets || 0;        
        this.totalSetsTT = await Team.find({_id: this.teamTwo }, {'sets':1, '_id':0});
        this.totalSetsTT = this.totalSetsTT.sets || 0;        

        console.log(this.totalPointsClassTO);
        console.log(this.totalPointsClassTT);

    }
}