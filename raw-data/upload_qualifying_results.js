import {dbcon} from "../db.js"

export async function uploadQualifyResults() {

    for(let x = 2022; x <= 2026; x++) { //extracting all data from 2022-26
        try {
            await qualifyResults(x)
        } catch (err) {
            console.log("error")
            console.log(err)
        }
       

    }

}

export async function qualifyResults(year) {
    const db = await dbcon()
    let data;
    let num_rounds;
    //let data

    try{
        const res_round = await fetch("FETCH DATA") //FETCH NUMBER OF ROUNDS HERE FROM SINGLE YEAR
        num_rounds = await res_round.json()


       for(let x = 0; x < num_rounds; x++) {

        const response = await fetch(`https://api.jolpi.ca/ergast/f1/${year}/${x}/qualifying.json`)
         data = response.json()

         const table = data.MRData.RaceTable //MODIFY TO EXTRACT EXACT/NEEDED TABLE
         //EXTRACT MORE INFO FOR DATA INSERTION

            try {
                await db.exec("BEGIN TRANSACTION")

                for(const {season, round, driverId, position} of table) {
                    //INSERT ALL DATA
                }

            await db.exec("COMMIT")
             console.log("SUCCESS")

            } catch (error) {
                await db.exec("ROLLBACK")
                 console.log(err)
            } finally {
                await db.close()
                console.log("closed")
            }

       }

        if(response.ok) {
            console.log("info all ok")
        }

    } catch(error) {
        console.log("error")
    }

    
}

export async function qualifyResults(year, round) {
    const db = await dbcon()
    let num_rounds;
    let data

    try {
        

    } catch (err) {

    }

}