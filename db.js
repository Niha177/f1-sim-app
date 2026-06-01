 import sqlite3 from 'sqlite3'
import { open } from 'sqlite'
import path from 'node:path'
 
 export async function dbcon() {

    return open ({
        filename: path.join("rawDatabase.db"),
        driver: sqlite3.Database
    })

 }
 
