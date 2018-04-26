function go() {
    search(document.getElementsByTagName('input')[0].value);
}
function search(handle) {
    var table = document.getElementsByTagName('table')[0];
    table.style.visibility = "hidden";

    var mainButtonText = document.getElementById('main_button_text');
    mainButtonText.textContent = '';

    var loadingSpinner = document.getElementById('loading_spinner');
    loadingSpinner.style.visibility = "visible";
   
    var tbody = table.getElementsByTagName('tbody')[0];
    while (tbody.firstChild) {
        tbody.removeChild(tbody.firstChild);
    }

    if (handle.length > 0) {
        fetch('http://codeforces.com/api/user.status?handle=' + handle).then(function(response) {
            return response.json();
        }).then(function (json) {
            var problems = json.result;
            console.log(problems);
            var solved = {};
            var unsolved = {};
            for(var i = 0;i<problems.length;i++){
                if (problems[i].verdict === 'OK') {
                    solved[problems[i].problem.contestId + problems[i].problem.index] = problems[i];
                }
            }
            for(var i = 0;i<problems.length;i++){
                if (solved[problems[i].problem.contestId + problems[i].problem.index] == null) {
                    unsolved[problems[i].problem.contestId + problems[i].problem.index] = problems[i];
                }
            }

            for (number in unsolved) {
                var tr = document.createElement('tr');
                var numberTd = document.createElement('td');
                var nameTd = document.createElement('td');
                var numberLink = document.createElement('a');
                var nameLink = document.createElement('a');
                numberLink.innerText = number;
                numberLink.href = "http://codeforces.com/contest/"+unsolved[number].contestId+"/problem/"+unsolved[number].problem.index;
                nameLink.innerText = unsolved[number].problem.name;
                nameLink.href = "http://codeforces.com/contest/"+unsolved[number].contestId+"/problem/"+unsolved[number].problem.index;
                numberTd.appendChild(numberLink);
                nameTd.appendChild(nameLink);
                tr.appendChild(numberTd);
                tr.appendChild(nameTd);
                tbody.appendChild(tr);
            }

            if (Object.keys(unsolved).length > 0) {
                table.style.visibility = "visible";
            }
            loadingSpinner.style.visibility = "hidden";
            mainButtonText.textContent = 'OK';
        }).catch(function(error){
            console.log(error);
            loadingSpinner.style.visibility = "hidden";
            mainButtonText.textContent = 'OK';
        })
    }
    else {
        loadingSpinner.style.visibility = "hidden";
        mainButtonText.textContent = 'OK';
    }
}