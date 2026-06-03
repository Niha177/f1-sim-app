import {dbcon} from "../db.js"
import {driverQualifyingForm} from "./qual-calculations.js"

export async function finishingPositionDelta(driverID, season, round) {

    const db = await dbcon()
 

    const{data: gridPositions} = await driverQualifyingForm(driverID, season, round, "race_results", "grid")
    const{data: FinishPositions} = await driverQualifyingForm(driverID, season, round, "race_results", "position, status")

    //console.log(gridPositions)
    //console.log(FinishPositions)


    let len = FinishPositions.length
    let deltaArray = []

    for(let x = 0; x < len; x++) {
        if(FinishPositions[x].status === "Finished" || (FinishPositions[x].status).includes("Lap")) {
            let delta = gridPositions[x].grid - FinishPositions[x].position

            deltaArray.push(delta)
        }
    }

    let sum = 0;

    for(let x = 0; x < deltaArray.length; x++) {
        sum+= deltaArray[x]
    }


   // console.log(deltaArray)
    //console.log(sum)

    let FPD = sum/(deltaArray.length)

   // console.log(FPD)

    return FPD
}




//finishingPositionDelta("max_verstappen", 2024, 22)

