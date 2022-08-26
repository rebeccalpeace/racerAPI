{
    let form = document.getElementById('standingsForm');
    console.log(form);

    // function to handle the submit event
    async function handleSubmit(event){
        event.preventDefault();
        try {
        let inputSeason = event.target.season.value   // 1950-2022
        let inputRound = event.target.round.value    
        console.log(inputRound)
        let standing = await getStandingsInfo(inputSeason, inputRound);
        buildTable(standing)} catch(err) {
            let display = document.getElementById('standingTable');
            display.innerHTML = '';

            let error = document.createElement('h3');
            error.className = 'text-center'
            error.innerHTML = "Invalid -- Please choose year between 1950 and 2022 or a different Round"
            let errorDiv = document.getElementById('standingTable')
            errorDiv.append(error)
        }
        // season.value = '';
        // round.value = '';
    }

    // function to grab data from the racer API
    async function getStandingsInfo(season, round){
        let res = ""
        if (!!season && !!round){
            res = await fetch(`https://ergast.com/api/f1/${season}/${round}/driverStandings.json`);
        } else if (!!season){
            res = await fetch(`https://ergast.com/api/f1/${season}/driverStandings.json`);
        } else {
            res = await fetch(`https://ergast.com/api/f1/driverStandings.json`);
        }
        
        let data = await res.json();
        return data['MRData']['StandingsTable']['StandingsLists'][0]['DriverStandings'];
    }

    // function that will take the standings object from the API and build a table for it
    function buildTable(standingObj){
        let table = document.createElement('table');
        table.className = 'table table-success table-striped';

        let tableHeader = document.createElement('thead');
        table.append(tableHeader)

        let tableRow = document.createElement('tr');
        tableHeader.append(tableRow)

        let headerColumn1 = document.createElement('th');
        headerColumn1.scope = 'col'
        headerColumn1.innerHTML = "Position"
        tableRow.append(headerColumn1)

        let headerColumn2 = document.createElement('th');
        headerColumn2.scope = 'col'
        headerColumn2.innerHTML = "Points"
        tableRow.append(headerColumn2)

        let headerColumn3 = document.createElement('th');
        headerColumn3.scope = 'col'
        headerColumn3.innerHTML = "Driver Name"
        tableRow.append(headerColumn3)

        let headerColumn4 = document.createElement('th');
        headerColumn4.scope = 'col'
        headerColumn4.innerHTML = "Driver Nationality"
        tableRow.append(headerColumn4)

        let headerColumn5 = document.createElement('th');
        headerColumn5.scope = 'col'
        headerColumn5.innerHTML = "Constructor"
        tableRow.append(headerColumn5)

        let tableBody = document.createElement('tbody');
        table.append(tableBody);

        for (let i in standingObj){
            let tableRow = document.createElement('tr');
            tableBody.append(tableRow);
            let td1 = document.createElement('td');
            td1.innerHTML = standingObj[i]['position'];
            tableRow.append(td1);

            let td2 = document.createElement('td');
            td2.innerHTML = standingObj[i]['points'];
            tableRow.append(td2);

            let td3 = document.createElement('td');
            td3.innerHTML = `${standingObj[i]['Driver']['givenName']} ${standingObj[i]['Driver']['familyName']}`;
            tableRow.append(td3);

            let td4 = document.createElement('td');
            td4.innerHTML = standingObj[i]['Driver']['nationality'];
            tableRow.append(td4);

            let td5 = document.createElement('td');
            td5.innerHTML = standingObj[i]['Constructors'][0]['name'];
            tableRow.append(td5);
        }

        let display = document.getElementById('standingTable');
        display.innerHTML = '';
        display.append(table)
    }
    form.addEventListener('submit', handleSubmit);
}

