import {dbcon} from "../db.js"
import {driverQualifyingForm} from "./qual-calculations.js"

export async function teammateBaseline(driverID, season, round) {


   let drivers

   const db = await dbcon()

   let driverSql
   
   driverSql = `
   SELECT DISTINCT driverId
   FROM race_results
   WHERE constructorId = (
        SELECT constructorId
        FROM race_results
        WHERE driverId = ? AND season = ?
        LIMIT 1
   ) 
    AND season = ?
    AND driverId != ?`

     try {
         drivers = await db.all(driverSql, [driverID, season, season, driverID])

        

    } catch (error) {
        console.log(error)

    }

    const driverA = driverID
   const driverB = drivers[0].driverId

   const {data: dataDriverA} = await driverQualifyingForm(driverA, season, round)
   const {data: dataDriverB} = await driverQualifyingForm(driverB, season, round)

   return ({
    driverDataA: dataDriverA,
    driverDataB : dataDriverB
   })

   console.log(driverA)
   console.log(driverB)

   console.log(dataDriverA[0])
   console.log(dataDriverB[0])


    
}

export async function calculateTeammateBaseline(driverID, season, round) {

    const {driverDataA, driverDataB} = await teammateBaseline(driverID, season, round)


   let wins = 0

   let totalRaces
   //let racesCalc = driverDataA.length

   if(driverDataA.length <= driverDataB.length) {
        totalRaces = driverDataA.length
   } else {
        totalRaces = driverDataB.length
   }

   for(let x = 0; x < totalRaces; x++) {

        if(driverDataA[x].position < driverDataB[x].position) {
            wins = wins+1;
        }
   }

   let TBR = wins/totalRaces

   console.log(driverDataA)
   console.log(driverDataB)

   console.log(TBR)
   return TBR

}

//calculateTeammateBaseline("piastri", 2025, 5)

//ADD ERROR HANDELING AND TESTING