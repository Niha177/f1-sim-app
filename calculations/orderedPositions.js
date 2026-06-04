import {predictGrid} from "./weightedScoringModel.js"

export async function orderedPositions(season, wantedRound) {

    const data = await predictGrid(season, wantedRound)



    data.sort((a, b) => a.relPosition - b.relPosition)

    console.log(data)

    return data
}

//orderedPositions(2026, 6)