import {dbcon} from "../db.js"
import {finalTrackIndex} from "../databases/circuits_category.js"


export async function uploadCircuitData() {
    const db = await dbcon()
    let data;

    try {
        const response = await fetch("https://api.jolpi.ca/ergast/f1/2026/circuits/")
         data = await response.json()

        if(response.ok) {
            console.log("info all ok")
        }

    } catch (err) {
        console.log(err)
    }

    
        //console.log(data.MRData.CircuitTable.Circuits[0].circuitId)
        //console.log(data.MRData.CircuitTable.Circuits[0].circuitName)
    const circ_table = data.MRData.CircuitTable.Circuits


    try {
        await db.exec("BEGIN TRANSACTION")

        for(const {circuitId, circuitName} of circ_table) {
            await db.run(`
                INSERT INTO circuits (circuitId, circuitName)
                VALUES (?,?)`,
            [circuitId, circuitName])
        }

        for(let x = 0; x < circ_table.length; x++) {
            let cur = circ_table[x].circuitId

            let type = finalTrackIndex[cur]

           /* await db.run(`
                INSERT INTO circuits (track_type)
                VALUES(?)`, [type])
                */

            await db.run(`
                UPDATE circuits
                SET track_type = ?
                WHERE circuitId = ?`
                ,[type, cur])
        }

        await db.exec("COMMIT")
        console.log("SUCCESS")

    } catch(err) {
        await db.exec("ROLLBACK")
        console.log(err)

    } finally {
        await db.close()
        console.log("closed")
    }
}
//uploadCircuitData()