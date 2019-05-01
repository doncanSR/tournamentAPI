import * as mongoose from 'mongoose';
import { tournamentSchema } from '../models/tournament-model';

const Tournament = mongoose.model('Tournament', tournamentSchema);

export class schedules {

    days: string[];
    courts: string[];
    start: number;
    finish: number;
    matchesCan: number;
    minutesPerMatch: number;
    matches: string[];
    schedule: Object[];

    constructor(){

        this.days = ['viernes','sabado','domingo'];
        this.courts = ['cancha_1', 'cancha_2', 'cancha_3'];
        this.minutesPerMatch = 60;
        this.matches = ['5c6c57d7fb660e1f98b9d270', '5c6c57d7fb660e1f98b9d270', '5c6c57d7fb660e1f98b9d270'];
    
    }

    async getTournament(id: string){

        await Tournament.findById(id).then((tournament) => {
            console.log(tournament);
        });

    }

    async possible(id: string){


        await this.getTournament(id);

        this.matchesCan = this.days.length * this.courts.length * ( this.finish - this.start ) * ( this.minutesPerMatch/60 );
        
        if( this.matchesCan > this.matches.length )
            return -1;
        
        console.log(this.schedule);

    }

    async doIt(){

        let court = new Array;
        this.matches.forEach(match => {
            court.push(match);
        });


    }
    
}