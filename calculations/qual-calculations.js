import {dbcon} from "../db.js"

export async function qualifyingDataSIM(driverId, season, round) { //full season form

    console.log("starting")
    

    const db = await dbcon()
    console.log(db)
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
        const data2 = await response2.json()
        roundsPrev = data2.MRData.total
    }

   } catch(err) {
        console.log("error in catching number of rounds")
        console.log(err)
   }

    console.log("passed")
    let sql;

   if(round <= 5) {

        curLimit = round - 1 //2
        prevLimit = 5 - curLimit //3

       

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

   
    
   /*
   const sql = `
        SELECT position
        FROM qualifying_results
        WHERE driverId = ? AND season BETWEEN ? AND ?`

        

    //-------------------------------------
     sql = `
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
        ORDER BY round ASC 
        LIMIT ?
    )
    `
    */
    //-------------------------------------

    try {
        const results = await db.all(sql, params)
        let len = results.length
        let sum = 0;
        let QF;

        for(const {position} of results) {
            sum += position
        }
         QF = sum/len

          console.log("at return")

         return({
            data: results,
            qf: QF
         })


    } catch (error) {
        console.log(error)

    }
    
  
   /*
    return new Promise( (resolve, reject) => {
        let sum = 0;
        let length = 0;
        let QF;

        console.log("entered in function")
        
        //ok up until here

         db.all(sql, params, (err, results) => {
            console.log("at resolve")
            
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
    */
 

}



export async function calculateQualifying(driverId, season, round) {

    try {
        const {data, qf} =  await qualifyingDataSIM(driverId, season, round)

    console.log(qf)
    console.log(data)
    

    } catch(err) {
        console.log(err)
    }
    


}

calculateQualifying('leclerc', 2026, 5)



