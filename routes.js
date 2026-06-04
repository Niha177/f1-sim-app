import express from "express"
import {orderedPositions} from "./calculations/orderedPositions.js"

export const apiApp = express.Router()

apiApp.post("/race/prediction", getRacePrediction)
//apiApp.get("/results/qualifying")

export async function getRacePrediction(req, res) {

    const {season, wantedRound} = req.body

    const data = await orderedPositions(season, wantedRound)
    res.json(data)

    console.log("h")
}
    