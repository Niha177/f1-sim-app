import { open } from 'sqlite'
import sqlite3 from "sqlite3"
import path from 'node:path'

async function deletefun() {
      const db = await open({
        filename: path.join("rawDatabase.db"),
        driver: sqlite3.Database

    })
   await db.exec("DELETE FROM circuits")
   console.log("success")
   await db.close();
    
}
//deletefun()