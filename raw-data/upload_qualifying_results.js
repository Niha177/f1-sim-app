import {dbcon} from "../db.js"

export async function uploadQualifyResults() {

    const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

    for(let x = 2022; x <= 2026; x++) { //extracting all data from 2022-26
        try {
            await qualifyResults(x)
        } catch (err) {
            console.log("error")
            console.log(err)
        }
       
        await delay(4000); 
    }


}

export async function qualifyResults(year) {
    const db = await dbcon()
    let data;
    let num_rounds;
    //let data

    const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

    try{
        const res_round = await fetch(`https://api.jolpi.ca/ergast/f1/${year}/`) 
        const numRounds = await res_round.json()
        num_rounds = numRounds.MRData.total


       for(let x = 1; x <= num_rounds; x++) {

        const response = await fetch(`https://api.jolpi.ca/ergast/f1/${year}/${x}/qualifying.json`)
         data = await response.json()

         const table = data.MRData.RaceTable.Races[0] //MODIFY TO EXTRACT EXACT/NEEDED TABLE
         //EXTRACT MORE INFO FOR DATA INSERTION

            try {
                console.log("beginning data extraction")
                await db.exec("BEGIN TRANSACTION")

                /*
                for(const {season, round} of table) {
                    //INSERT ALL DATA
                    await db.run(`
                    INSERT INTO qualifying_results (season, round, driverId)
                        `)
                }
                        */
            const qualResults = data.MRData.RaceTable.Races[0].QualifyingResults

            for(let i = 0; i < qualResults.length; i++) {

               let curSeason = year
               let curRound = x


                let driverID = qualResults[i].Driver.driverId
                let pos = qualResults[i].position

                await db.run(`
                    INSERT INTO qualifying_results (season, round, driverId, position)
                    VALUES(?,?,?,?)`,
                [curSeason, curRound, driverID, pos])
            }

            await db.exec("COMMIT")
             console.log("SUCCESS")

             await delay(4000); 

            } catch (error) {
                await db.exec("ROLLBACK")
                 console.log(error)
            }

       }

        await db.close()
        console.log("closed")


    } catch(error) {
        console.log(error)
    }

    
}



//uploadQualifyResults()
//2022 DONE
//2023 DONE
//2024 DONE
//2025 DONE
//2026
qualifyResults(2026)