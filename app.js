console.log("hello");
fetch('http://codeforces.com/api/user.status?handle=hapsidra').then(function(response){
    return response.json();
}).then(function (problems){
    console.log(problems);
})