import {dbcon} from "../db.js"

export async function qualifyingDataSIM(driverId, season, round) { //full season form

    const db = dbcon()
    let roundsPrev = 0;
    let roundsCur = 0;

    let curLimit = 0;
    let prevLimit = 0;

   let params = []

   //fetch number of rounds here
   try {
    const response = await fetch(`https://api.jolpi.ca/ergast/f1/${season}/`)
    const data = await response.json()
    roundsCur = data.MRData.total

    if(round <= 5) {
        const prevSeason = season - 1

        const response2 = await fetch(`https://api.jolpi.ca/ergast/f1/${prevSeason}/`)
        const data2 = await response.json()
        roundsPrev = data.MRData.total
    }

   } catch(err) {
        console.log("error in catching number of rounds")
        console.log(err)
   }

   if(round <= 5) {
        curLimit = round
        prevLimit = roundsPrev - round
   } else {
    curLimit = round
    prevLimit = 0
   }

   params = [driverId, season - 1, prevLimit, driverId, season, curLimit]
    
   /*
   const sql = `
        SELECT position
        FROM qualifying_results
        WHERE driverId = ? AND season BETWEEN ? AND ?`

        */

    //-------------------------------------
    const sql = `FROM (
    SELECT position 
    FROM qualifying_results
    WHERE driverId = ? AND season = ?
    ORDER BY round DESC
     LIMIT ?
    )
    
    UNION ALL

    SELECT position 
    FROM qualifying_results
    WHERE driverId = ? AND season = ?
    ORDER BY round ASC 
    LIMIT ?
    `
    //-------------------------------------
    
   
    return new Promise((resolve, reject) => {
        let sum = 0;
        let length = 0;
        let QF;

        db.all(sql, params, (err, results) => {
        if(err) {
            console.log("error with query")
            return reject(err);
        }
        //calculations
        length = results.length

        for(const {position} of results) {
            sum += position
        }
         QF = sum/length

         resolve({
            data: results,
            qf: QF
         }) //returning the qf
    })

})
 

}



export async function calculateQualifying(driverId, season, round) {

    const {results, qf} = await qualifyingDataSIM(driverId, season, round)


}



