import sqlite3 from 'sqlite3'
import { open } from 'sqlite'
import path from 'node:path'

async function viewAllProducts() {
  const db = await open({ 
    filename: path.join('rawDatabase.db'),
    driver: sqlite3.Database
  });

  try { 
    const products = await db.all('SELECT * FROM circuits')
    // Neater table display
    const displayItems = products.map(({ circuitId, circuitName, track_type }) => {
      return { circuitId, circuitName, track_type }
    })
    console.table(displayItems)
  } catch (err) {
    console.error('Error fetching products:', err.message)
  } finally {
    await db.close()
  }
}

viewAllProducts()