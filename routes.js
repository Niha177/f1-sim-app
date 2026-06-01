import express from "express"

export const apiApp = express.Router()

apiApp.get("/results/race", raceResults)
//apiApp.get("/results/qualifying")

export async function raceResults(req, res) {
    const results = ""
    console.log("h")
}
    