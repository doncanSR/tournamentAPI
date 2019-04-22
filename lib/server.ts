import app from "./app";
import { createSchedule } from "./utils/create-schedules";
import { Schedulefill } from "./utils/schedules-fill";
import { ScheduleInterface } from "./utils/interfaces/schedule-interface";
import { addPoints } from "./utils/addPoints";
import { MatchDataInterface } from "utils/interfaces/matchData-interface";
const PORT = 3000;

app.listen(PORT, () => {
	console.log('Express server listening on port ', PORT);

	// let schedules = new createSchedule(24, '5bb975f97ccc872a398cfc25');
	// let isCorrect: boolean = schedules.verifyTeams();
	// let scheduleData: ScheduleInterface;
	// console.log('This is the result ', schedules);
	// console.log('Is this correct ? ', isCorrect);
	// scheduleData = schedules;

	// let fillSchedules = new Schedulefill(scheduleData);
	// fillSchedules.fill();

	let match: MatchDataInterface;
	match = {
		teamOne: '5cb80d481d8bd1c2bfddf844',
		teamTwo: '5cb80d481d8bd1c2bfddf848',
		setsTO: 2,
		setsTT: 1,
		totalPointsTO: 65,
		totalPointsTT: 40,
		tournamentID: '5bb975f97ccc872a398cfc25'
	  }
	let games = new addPoints(2);
	games.wasAdded(match);

	


});