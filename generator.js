const fs = require('fs');
var startYear = parseInt(process.argv[2])
var startDate = new Date(startYear, 0, 1);
var now = new Date();
var daysAgo = parseInt((now.getTime() - startDate.getTime()) / (86400 * 1000))
var shFileText = ""
var arrCommits = []
for (var i = 0; i < 365; i ++) {
    arrCommits.push(Math.floor(Math.random() * 5))
}

for (var i = 0; i < 100; i ++) {
    var randDate = Math.floor(Math.random() * 365)
    arrCommits[randDate] = 0;
}

for (var i = 0; i < arrCommits.length; i ++) {
    for (var j = 0; j < arrCommits[i]; j ++) {
        shFileText += "git commit --allow-empty -m \"commit\"\n"
        shFileText += "git commit --amend --allow-empty --no-edit --date=format:relative:"+daysAgo+".days.ago\n"
    }
    daysAgo -= 1;
}
shFileText += "git push -f\n"

fs.writeFile('generated_commiter.sh', shFileText, err => {
    if (err) {
        console.log('Error writing file', err)
    } else {
        console.log('Successfully wrote file')
    }
})
