import app  from "./app";
import { createSchedule } from "./utils/create-schedules";
const PORT = 3000;

app.listen(PORT, () => {
    console.log('Express server listening on port ', PORT);

    let schedules = new createSchedule(24);
    let isCorrect: boolean = schedules.verifyTeams();
    console.log('This is the result ', schedules);
    console.log('Is this correct? ', isCorrect);
    
    
});