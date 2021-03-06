function renderLeaders(data){
    let layout = "";
    
    layout += `<header>
                   <h1 class="title">${data["title"]}</h1>
                   <h3 class="subtitle">${data["subtitle"]}</h3>
               </header>`;
    
    layout += '<div class="leaders_list">';

    selectedUserIndex = undefined;
    if(data["selectedUserId"] !== undefined){
        for(let i = 0; i < data["users"].length; i++){
            if(data["users"][i]["id"] == data["selectedUserId"]){
                selectedUserIndex = i;
                break;
            }
        }
    }

    for(let i = 0; i < 5; i++){
        userIndex = [
            (selectedUserIndex === undefined || selectedUserIndex < 4 ? 4 : selectedUserIndex),
            2,
            0,
            1,
            3
        ][i];
        userAvatar = data["users"][userIndex]["avatar"]
        userName = data["users"][userIndex]["name"]
        userScore = data["users"][userIndex]["valueText"]
        userPlace = userIndex + 1
        isUserSelected = data["users"][userIndex]["id"] === data["selectedUserId"]

        layout += `<div class="column${isUserSelected ? ' selected' : ''}" data-place="${userPlace}">
                       <img class="avatar" src="./images/${userAvatar}">`;

        if(userPlace == 1){
            layout += `<div class="emoji">${data["emoji"]}</div>`;
        }
        else if(isUserSelected){
            layout += `<div class="emoji">👍</div>`;
        }

        layout += `    <h3 class="name">${userName}</h3>
                       <h4 class="score">${userScore}</h4>
                       <div class="place_box"></div>
                       <h1 class="place_number">${userPlace}</h1>
                   </div>`;
    }

    layout += '</div>';

    return layout;
}

function renderVote(data, offset=0){
    let layout = "";

    let backButtonDataParams = JSON.stringify({
        alias: 'vote',
        data: {
            offset: Math.max(0, offset - 6)
        }
    });
    let nextButtonDataParams = JSON.stringify({
        alias: 'vote',
        data: {
            offset: Math.min(data["users"].length - 8, offset + 6)
        }
    });

    let canGoBack = (offset == 0);
    let canGoFurther = (offset >= data["users"].length - 8);

    layout += `<header>
                   <h1 class="title">${data["title"]}</h1>
                   <h3 class="subtitle">${data["subtitle"]}</h3>
               </header>`;
    layout += `<div class="grid">
                   <button class="back_button" type="button" ${canGoBack ? "disabled" : ""} data-action="update" data-params='${backButtonDataParams}'></button>`;
    
    for(let i = offset; i < Math.min(data["users"].length, offset + 8); i++){
        isSelected = (data["selectedUserId"] == data["users"][i]["id"]);
        
        if(isSelected){
            layout += `<button class="user selected" type="button" disabled>`;
        }
        else{
            layout += `<button class="user" type="button" data-action="update">`;
        }

        layout += `<img src="./images/${data["users"][i]["avatar"]}" class="avatar">`;

        if(isSelected){
            layout += `<span class="emoji">👍</span>`;
        }

        layout += `    <h3 class="name">${data["users"][i]["name"]}</h3>
                   </button>`;
    }

    layout += `<button class="next_button" type="button" ${canGoFurther ? "disabled" : ""} data-action="update" data-params='${nextButtonDataParams}'></button>`;

    return layout;
}

function renderChart(data){
    let layout = "";
    
    layout += `<header>
                   <h1 class="title">${data["title"]}</h1>
                   <h3 class="subtitle">${data["subtitle"]}</h3>
               </header>`;
    layout += `<div class="columns">`;

    let maxValue = data["values"][0]["value"];
    let activeColumnIndex = data["values"].length - 1;

    for(let i = 0; i < data["values"].length; i++){
        if(data["values"][i]["active"]){
            activeColumnIndex = i;
            maxValue = Math.max(maxValue, data["values"][i]["value"]);
        }
    }

    // Чтобы перед активным стобиком было не больше двух других столбиков
    let maxIndex = Math.min(data["values"].length - 1, activeColumnIndex + 2);

    // Чтобы в DOM добавлялось не больше 50 столбиков
    let minIndex = Math.max(0, maxIndex - 50);

    for(let i = maxIndex; i >= minIndex; i--){
        isActive = Boolean(data["values"][i]["active"]);
        percentage = data["values"][i]["value"] / Math.max(0.0001, maxValue);

        layout += `<div class="column${isActive ? " active" : ""}">
                       ${
                           data["values"][i]["value"] > 0 ?
                           `<h2 class="column_value">${data["values"][i]["value"]}</h2>` :
                           ``
                       }
                       <div class="column_box" style="flex: ${percentage}"></div>
                       <h3 class="column_title">${data["values"][i]["title"]}</h3>
                   </div>`;
    }

    layout += `</div>
               <div class="leaders">
                   <div class="leader">
                       <img class="leader_avatar" src="./images/${data["users"][0]["avatar"]}">
                       <div class="leader_text_block">
                           <h3 class="leader_name">${data["users"][0]["name"]}</h3>
                           <h4 class="leader_score">${data["users"][0]["valueText"]}</h4>
                       </div>
                   </div>
                   <hr>
                   <div class="leader">
                       <img class="leader_avatar" src="./images/${data["users"][1]["avatar"]}">
                       <div class="leader_text_block">
                           <h3 class="leader_name">${data["users"][1]["name"]}</h3>
                           <h4 class="leader_score">${data["users"][1]["valueText"]}</h4>
                       </div>
                   </div>
               </div>`;
    
    return layout;
}

function renderActivity(data){
    let layout = "";

    const weekdays = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"];
    let maxValue = 0;
    let ranges = [
        [0, 0, "min"],
        [1, 2, "mid"],
        [3, 4, "max"],
        [5, 6, "extra"]
    ];

    // Определяем максимальное значение и интервалы
    for(let hour = 0; hour < 24; hour++){
        for(let weekday = 0; weekday < 7; weekday++){
            maxValue = Math.max(
                data["data"][weekdays[weekday]][hour],
                maxValue
            );
        }
    }

    ranges[1][0] = 1;
    ranges[1][1] = ranges[1][0] + Math.floor(maxValue / 3) - 1;
    ranges[2][0] = ranges[1][1] + 1;
    ranges[2][1] = ranges[2][0] + Math.floor(maxValue / 3) - 1;
    ranges[3][0] = ranges[2][1] + 1;
    ranges[3][1] = maxValue;

    // Рендерим слайд
    layout += `<header>
                   <h1 class="title">${data["title"]}</h1>
                   <h3 class="subtitle">${data["subtitle"]}</h3>
               </header>`;
    layout += '<div class="grid">';

    for(let hour = 0; hour < 24; hour++){
        layout += '<div class="row" hour="' + hour + '">';

        for(let weekday = 0; weekday < 7; weekday++){
            let cellClassList = "cell";

            // Высота столбика при вертикальной ориентации
            let verticalCellHeight = "min";

            // Высота столбика при горизонтальной ориентации
            let horizontalCellHeight = "min";

            // Количество комитов за 1 час
            let commitsPerHour = data["data"][
                weekdays[weekday]
            ][hour];

            // Количество комитов за 2 часа
            let commitsPerHours = data["data"][
                weekdays[weekday]
            ][hour] + data["data"][
                weekdays[weekday]
            ][hour + (hour % 2 ? -1 : 1)];
            
            // Определяем интервал для столбика
            for(let i = 0; i < ranges.length; i++){
                if(commitsPerHour >= ranges[i][0] && 
                   commitsPerHour <= ranges[i][1]){
                    verticalCellHeight = ranges[i][2];
                }
                if(commitsPerHours >= ranges[i][0] && 
                   commitsPerHours <= ranges[i][1]){
                    horizontalCellHeight = ranges[i][2];
                }
            }

            cellClassList += ' v-' + verticalCellHeight;            
            cellClassList += ' h-' + horizontalCellHeight;            
            layout += '<div class="' + cellClassList + '" h_value="' + commitsPerHours + '" week="' + weekdays[weekday] + '"></div>';
        }

        layout += '</div>';
    }

    layout += '</div>';

    // Добавляем легенду
    layout += `<ul class="legend">
                   <li>
                       <div class="legend__step"></div>
                       <h2 class="hide_on_horiz">1 час</h2>
                       <h2 class="hide_on_vertic">2 часа</h2>
                   </li>`;
    
    for(let i = 0; i < ranges.length; i++){
        layout += `<li>
                       <div class="legend__${ranges[i][2]}_cell"></div>`;
        
        if(ranges[i][0] === ranges[i][1]){
            layout += `<h2>${ranges[i][0]}</h2>`;
        }
        else{
            layout += `<h2>${ranges[i][0]} — ${ranges[i][1]}</h2>`;
        }

        layout += `</li>`;
    }
    
    layout += `</ul>`;

    return layout;
}

function renderTemplate(alias, data){
    alias = alias.toLowerCase();

    let layout = `<div class="story-${alias}">`; 

    if(alias === "activity"){
        layout += renderActivity(data);
    }
    else if(alias === "leaders"){
        layout += renderLeaders(data);
    }
    else if(alias === "vote"){
        layout += renderVote(data);
    }
    else if(alias === "chart"){
        layout += renderChart(data);
    }
    else{
        console.error("Unknown alias '" + alias + "'");
        return "";
    }

    layout += '</div>';

    return layout;
}

window.renderTemplate = renderTemplate;