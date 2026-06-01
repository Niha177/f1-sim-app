import { open } from 'sqlite'
import sqlite3 from "sqlite3"
import path from 'node:path'

async function createDB() {

    const db = await open({
        filename: path.join("rawDatabase.db"),
        driver: sqlite3.Database

    })

    await db.exec(`
        CREATE TABLE IF NOT EXISTS race_results (
            season INTEGER,
            round INTEGER,
            circuitId TEXT,
            driverId TEXT,
            grid INTEGER,
            position INTEGER,
            status TEXT,
            PRIMARY KEY (season, round, driverId)
        )
        `);

    await db.exec(`
        CREATE TABLE IF NOT EXISTS qualifying_results (
            season INTEGER,
            round INTEGER,
            driverId TEXT,
            position INTEGER,
            PRIMARY KEY (season, round, driverId)
        )
        `);

    await db.exec(`
        CREATE TABLE IF NOT EXISTS circuits (
            circuitId TEXT PRIMARY KEY,
            circuitName TEXT, 
            track_type TEXT
        )
        `);

    await db.close()
    console.log("tables created")
    
}



