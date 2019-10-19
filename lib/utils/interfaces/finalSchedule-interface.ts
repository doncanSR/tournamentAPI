export interface FinalSchedule {
    courts: {
        name: string,
        days: {
            name: string,
            hour: {
                start: Date,
                end: Date
            }[]
        }[]
    }[];
}