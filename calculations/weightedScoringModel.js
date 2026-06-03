import {calculateQualifying} from "./qual-calculations.js"
import {calculateTeammateBaseline} from "./baseline-calculations.js"
import {finishingPositionDelta} from "./finishing-pos-calculations.js"
import {dbcon} from "../db.js"
import {gridCurrent} from "../databases/currentGrid.js"

export async function weightedScoreingModel(driverID, season, round) {

    let QF = await calculateQualifying(driverID, season, round)
    let TBR = await calculateTeammateBaseline(driverID, season, round)
    let FPD = await finishingPositionDelta(driverID, season, round)

    const predictionScore = (QF * 0.45) - (FPD * 0.35) + ((1 - TBR) * 0.20)
    //console.log(predictionScore)
     //console.log(QF)
    //console.log(TBR)
    //console.log(FPD)

    return predictionScore
}

//weightedScoreingModel("tsunoda", 2025, 20)

export async function predictGrid(season, wantedRound) {
    let data = []

    const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

    let driverGrid

    try{
        const db = await dbcon()

        let sql = `
        SELECT DISTINCT driverId
        FROM race_results
        WHERE season = ? AND round = ?`

        driverGrid = await db.all(sql, [season, wantedRound])

    } catch(err) {
        console.log("error")
    }


try{

    if(driverGrid.length === 0) {
        driverGrid = gridCurrent
    }

    for(let x = 0; x < driverGrid.length; x++) {

       try{
            console.log(driverGrid[x].driverId + ":" + await weightedScoreingModel(driverGrid[x].driverId, season, wantedRound))

        let cur = await weightedScoreingModel(driverGrid[x].driverId, season, wantedRound)

        data.push({driverId: driverGrid[x].driverId, relPosition: cur})

       } catch (error) {
            console.log("ommited  " + driverGrid[x].driverId)
       }
        
        await delay(1000); 
       
    }


    } catch(err) {
        console.log("error")
        console.log(err)
    }

    console.log(data)
    return data

}

predictGrid(2026, 6)