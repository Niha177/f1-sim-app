import {orderedPositions} from "./orderedPositions.js"
import {dbcon} from "../db.js"

export async function performaceCoefficent(season, wantedRound) {
    const db = dbcon()

    try {
        const response = await fetch("https://api.jolpi.ca/ergast/f1/2026/last/results/")

    } catch(err) {

    }
    let sql = `
    SELECT driverId, position
    FROM race_results
    WHERE season = ?`
   
}