import sqlite3 from 'sqlite3'
import { open } from 'sqlite'
import path from 'node:path'

async function viewQual() {
  const db = await open({ 
    filename: path.join('rawDatabase.db'),
    driver: sqlite3.Database
  });

  try { 
    const products = await db.all('SELECT * FROM qualifying_results')
    // Neater table display
    const displayItems = products.map(({ season, round, driverId, position }) => {
      return { season, round, driverId, position}
    })
    console.table(displayItems)
  } catch (err) {
    console.error('Error fetching products:', err.message)
  } finally {
    await db.close()
  }
}

async function viewAllFinal() {
  const db = await open({ 
    filename: path.join('rawDatabase.db'),
    driver: sqlite3.Database
  });

  try { 
    const products = await db.all('SELECT * FROM race_results')
    // Neater table display
    const displayItems = products.map(({ season, round, circuitId, driverId, grid, position, status, constructorId }) => {
      return { season, round, circuitId, driverId, grid, position, status, constructorId }
    })
    console.table(displayItems)
  } catch (err) {
    console.error('Error fetching products:', err.message)
  } finally {
    await db.close()
  }
}

//viewQual()
viewAllFinal()