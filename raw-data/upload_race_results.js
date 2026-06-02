import {dbcon} from "../db.js"



export async function raceResults(year) {
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

        const response = await fetch(`https://api.jolpi.ca/ergast/f1/${year}/${x}/results/`)
         data = await response.json()

         //const table = data.MRData.RaceTable.Races[0] //MODIFY TO EXTRACT EXACT/NEEDED TABLE
         //EXTRACT MORE INFO FOR DATA INSERTION

            try {
                console.log("beginning data extraction")
                await db.exec("BEGIN TRANSACTION")

            const finalResults = data.MRData.RaceTable.Races[0].Results
            let circuit = data.MRData.RaceTable.Races[0].Circuit.circuitId
            

            for(let i = 0; i < finalResults.length; i++) {

               let curSeason = year
               let curRound = x


                let driverID = finalResults[i].Driver.driverId
                let pos = finalResults[i].position
                let grid = finalResults[i].grid
                let status = finalResults[i].status
                let constructor = finalResults[i].Constructor.constructorId

                await db.run(`
                    INSERT INTO race_results (season, round, circuitId, driverId, grid, position, status, constructorId)
                    VALUES(?,?,?,?,?,?,?,?)`,
                [curSeason, curRound, circuit, driverID, grid, pos, status, constructor])
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


export async function uploadFinalResults() {

    const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

    for(let x = 2023; x <= 2026; x++) { //extracting all data from 2022-26
        try {
            await raceResults(x)
        } catch (err) {
            console.log("error")
            console.log(err)
        }
       
        await delay(4000); 
    }


}

//raceResults(2022)
uploadFinalResults()