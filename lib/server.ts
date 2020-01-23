import app from "./app";
import { createSchedule } from "./utils/create-schedules";
import { Schedulefill } from "./utils/schedules-fill";
import { ScheduleInterface } from "./utils/interfaces/schedule-interface";
import { Schedules } from "./utils/schedules";

const PORT = 3000;

app.listen(PORT, async () => {
	console.log('Express server listening on port ', PORT);

	let schedules = new createSchedule(25, '5bb975f97ccc872a398cfc25');
	let isCorrect: boolean = schedules.verifyTeams();
	let scheduleData: ScheduleInterface;
	console.log('Is this correct ? ', isCorrect);
	scheduleData = schedules;

	let fillSchedules = new Schedulefill(scheduleData);
	await fillSchedules.fill();
	
	let schedule = new Schedules('5bb975f97ccc872a398cfc25');
	await schedule.scheduleInit();
	
<<<<<<< HEAD
=======
	let schedule = new Schedules('5bb975f97ccc872a398cfc25');
	schedule.scheduleInit();
>>>>>>> 1e5559343792118f2f09cfe8593af241b20818be
	// let finals = new Finals(false, '5c6c8c4632600327ae2046c2');
	// finals.areThereTime();



});