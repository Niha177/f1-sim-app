import {dbcon} from "../db.js"
import {qualifyingDataSIM} from "./qual-calculations.js"

export async function teammateBaseline(constructorId, season, round) {

    //const driverA = 
   //const driverB = 

   let drivers

   const db = await dbcon()

   let driverSql
   
   driverSql = `
   SELECT DISTINCT driverId
   FROM race_results
   WHERE constructorId = ? AND season = ?`

     try {
         drivers = await db.all(driverSql, [constructorId, season])

        

    } catch (error) {
        console.log(error)

    }

    const driverA = drivers[0].driverId
   const driverB = drivers[1].driverId

   const {data: dataDriverA} = await qualifyingDataSIM(driverA, season, round)
   const {data: dataDriverB} = await qualifyingDataSIM(driverB, season, round)

   console.log(dataDriverA)
   console.log(dataDriverB)

   
    
}

export async function calculateTeammateBaseline(constructorId, season, round) {

    const {data: dataA} = await qualifyingDataSIM(constructorId, season, round)

}

teammateBaseline("mclaren", 2025, 1)