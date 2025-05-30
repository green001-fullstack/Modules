// Build a table

 const MOUNTAINS = [
    {name: "Kilimanjaro", height: 5895, place: "Tanzania"},
    {name: "Everest", height: 8848, place: "Nepal"},
    {name: "Mount Fuji", height: 3776, place: "Japan"},
    {name: "Vaalserberg", height: 323, place: "Netherlands"},
    {name: "Denali", height: 6168, place: "United States"},
    {name: "Popocatepetl", height: 5465, place: "Mexico"},
    {name: "Mont Blanc", height: 4808, place: "Italy/France"}
  ];

  const table = document.createElement('table')
  const headRow = document.createElement('tr')

  const tableStructure = (data) => {
    const headers = Object.keys(data[0])
    headers.forEach(header=>{
      const th = document.createElement('th')
      th.textContent = header
      headRow.appendChild(th)
    })
    table.appendChild(headRow)

    data.forEach(mountain =>{
      const dataRow = document.createElement('tr')
      headers.forEach(header =>{
        const td = document.createElement('td')
        td.textContent = mountain[header]
        if (typeof mountain[header] === "number") {
          td.style.textAlign = "right"
        }
        dataRow.appendChild(td)
      })
      table.appendChild(dataRow)
    })
    return table
  }

  document.addEventListener("DOMContentLoaded", () => {
  document.getElementById('mountains').appendChild(tableStructure(MOUNTAINS));
});

//   Elements by tag name
  
function byTagName(node, tagName) {
    const matches = [];
    const tagCase = tagName.toUpperCase();

    const childrenElement = (presentNode) => {
        for (const child of presentNode.children) {
            if (child.nodeName === tagCase) {
                matches.push(child);
            }
            childrenElement(child);
        }
    };

    childrenElement(node);
    return matches;
}

  console.log(byTagName(document.body, "h1").length);
  console.log(byTagName(document.body, "span").length);
  let para = document.querySelector("p");
  console.log(byTagName(para, "span").length);


  // Quiet Time

 async function activityTable(day) {
  let logFileList = await textFile("camera_logs.txt");
  let logFiles = logFileList.split("\n").filter(file => file.trim() !== "");

  let hourCounts = new Array(24).fill(0);

  for (let file of logFiles) {
    let content = await textFile(file.trim());
    let lines = content.split("\n").filter(line => line.trim() !== "");
    
    for (let line of lines) {
      let timestamp = Number(line.trim());
      let date = new Date(timestamp);
      
      if (date.getDay() === day) {
        let hour = date.getHours();
        hourCounts[hour]++;
      }
    }
  }
  return hourCounts;
}

activityTable(1)
  .then(table => console.log(activityGraph(table)));


  // Real Promise

  function activityTable(day) {
  const table = new Array(24).fill(0);
  
  return textFile("camera_logs.txt")
    .then(files => {
      return Promise.all(
        files.split("\n")
          .filter(name => name.trim()) 
          .map(name => textFile(name.trim())
            .then(log => {
              log.split("\n")
                .filter(timestamp => timestamp.trim()) 
                .forEach(timestamp => {
                  const date = new Date(Number(timestamp));
                  if (date.getDay() === day) {
                    table[date.getHours()]++;
                  }
                });
            })
            .catch(() => {})
          )
      );
    })
    .then(() => table);  
}

activityTable(6)
  .then(table => console.log(activityGraph(table)))
  .catch(err => console.error("Error:", err));



  
  // Build Promise.All

  function Promise_all(promises) {
  return new Promise((resolve, reject) => {
    if (promises.length === 0) {
      resolve([]);
      return;
    }

    const results = new Array(promises.length);
    let pending = promises.length;

    promises.forEach((promise, index) => {
      Promise.resolve(promise) 
        .then(result => {
          results[index] = result;
          pending--;
          if (pending === 0) {
            resolve(results);
          }
        })
        .catch(reject); 
    });
  });
}