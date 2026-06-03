import {dbcon} from "../db.js"

export async function qualifyingDataSIM(driverId, season, round) { //full season form

    console.log("starting")
    

    const db = await dbcon()

    let roundsPrev = 0;
    let roundsCur = 0;

    let curLimit = 0;
    let prevLimit = 0;

   let params = []


   try {
    const response = await fetch(`https://api.jolpi.ca/ergast/f1/${season}/`)
    const data = await response.json()
    roundsCur = data.MRData.total

    if(round <= 5) {
        const prevSeason = season - 1

        const response2 = await fetch(`https://api.jolpi.ca/ergast/f1/${prevSeason}/`)
        const data2 = await response2.json()
        roundsPrev = data2.MRData.total
    }

   } catch(err) {
        console.log("error in catching number of rounds")
        console.log(err)
   }

    
    let sql;

   if(round <= 5) {

        curLimit = round - 1 
        prevLimit = 5 - curLimit 


        sql =  `
    SELECT position 
    FROM (
        SELECT position 
        FROM qualifying_results
        WHERE driverId = ? AND season = ?
        ORDER BY round DESC
        LIMIT ?
    )
    
    UNION ALL
    
    SELECT position 
    FROM (
        SELECT position 
        FROM qualifying_results
        WHERE driverId = ? AND season = ?
        AND round < ?
        ORDER BY round DESC 
        LIMIT ?
    ) 
    
    `
    params = [driverId, season - 1, prevLimit, driverId, season, round, curLimit]

   } else {
    curLimit = 5
    prevLimit = 0

    let prevRound = round - 5

    params = [driverId, season, prevRound, round]

    sql = `SELECT position
        FROM qualifying_results
        WHERE driverId = ? 
        AND season = ?
        AND round BETWEEN ? AND ?

        ORDER BY round ASC
        LIMIT 5
        `
        
   }

    try {
        const results = await db.all(sql, params)
      
         return({
            data: results,
         })


    } catch (error) {
        console.log(error)

    }
    

}



export async function calculateQualifying(driverId, season, round) {

    try {
        const {data} =  await qualifyingDataSIM(driverId, season, round)
        let len = data.length

        let sum = 0;
        for(const {position} of data) {
            sum += position
        }

        let qf = sum/len

    console.log(qf)
    console.log(data)
    

    } catch(err) {
        console.log(err)
    }
    


}

//calculateQualifying('leclerc', 2026, 5)



