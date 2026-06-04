const year_input = document.getElementById("year-input")
const round_input = document.getElementById("round-input")

const get_prediction = document.getElementById("get-prediction")

const prediction_display = document.getElementById("display-container")

get_prediction.addEventListener("click", async () => {

    try {

        const res = await fetch("/api/race/prediction", {
            method: "POST",
            headers: {"Content-Type": "application/json" },
            body: JSON.stringify({season: year_input.value, wantedRound: round_input.value})

        })

        const information = await res.json()
        console.log(information)

        //prediction_display.innerHTML = 

        let HTML = ""

        for(let x = 0; x < information.length; x++) {
            HTML += `<p>${information[x].driverId} : Position: ${x+1}</p>`
        }

        prediction_display.innerHTML = HTML




    } catch(err) {
        console.log(err)
    }

})

