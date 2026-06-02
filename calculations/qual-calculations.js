import {dbcon} from "../db.js"

export async function qualifyingData(driverId, season, round) { //full season form
    const db = dbcon()
    
   let params = []
    

   const sql = `
        SELECT position
        FROM qualifying_results
        WHERE driverId = ? AND season BETWEEN ? AND ?`
    
    if(round <= 5) {
        params = [driverId, season-1, season] //pulls prev data
    } else {
        params = [driverId, season, season]
    }


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



export async function calculateQualifying(round) {

}



