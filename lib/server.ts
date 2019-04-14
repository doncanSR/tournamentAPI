import app from "./app";
import { createSchedule } from "./utils/create-schedules";
import { Schedulefill } from "./utils/schedules-fill";
import { ScheduleInterface } from "./utils/interfaces/schedule-interface";
const PORT = 3000;

app.listen(PORT, () => {
	console.log('Express server listening on port ', PORT);

	let schedules = new createSchedule(10, '5bb975f97ccc872a398cfc25');
	let isCorrect: boolean = schedules.verifyTeams();
	let scheduleData: ScheduleInterface;
	console.log('This is the result ', schedules);
	console.log('Is this correct ? ', isCorrect);
	scheduleData = schedules;

	let fillSchedules = new Schedulefill(scheduleData);
	fillSchedules.fill();


});