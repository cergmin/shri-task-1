let data_activity = {
    "title": "Коммиты, 1 неделя",
    "subtitle": "Спринт № 213",
    "data": {
        "mon": [0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 2, 3, 2, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0],
        "tue": [0, 0, 0, 0, 1, 0, 0, 0, 0, 5, 0, 4, 0, 0, 0, 0, 1, 0, 3, 0, 0, 2, 1, 0],
        "wed": [1, 0, 0, 0, 1, 0, 5, 0, 0, 4, 0, 0, 0, 5, 0, 2, 1, 0, 0, 0, 0, 0, 0, 1],
        "thu": [0, 1, 0, 1, 0, 0, 0, 0, 6, 0, 1, 0, 0, 1, 0, 0, 5, 0, 0, 0, 1, 0, 0, 0],
        "fri": [0, 0, 0, 0, 0, 0, 0, 1, 3, 0, 0, 5, 0, 4, 0, 0, 3, 0, 0, 0, 0, 1, 0, 0],
        "sat": [0, 0, 0, 0, 2, 1, 0, 0, 1, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0],
        "sun": [0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 3, 1, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0]
    }
}

let data_leaders = {
    "title": "Самый 🔎 внимательный разработчик",
    "subtitle": "Спринт № 213",
    "emoji": "🔎",
    "selectedUserId": 11,
    "users": [
        {"id": 1, "name": "Евгений Дементьев", "avatar": "1.jpg", "valueText": "22 голоса"},
        {"id": 4, "name": "Вадим Пацев", "avatar": "4.jpg", "valueText": "19 голосов"},
        {"id": 10, "name": "Яна Берникова", "avatar": "10.jpg", "valueText": "17 голосов"},
        {"id": 12, "name": "Алексей Ярошевич", "avatar": "12.jpg", "valueText": "16 голосов"},
        {"id": 11, "name": "Юрий Фролов", "avatar": "11.jpg", "valueText": "15 голосов"},
        {"id": 2, "name": "Александр Шлейко", "avatar": "2.jpg", "valueText": "14 голосов"},
        {"id": 5, "name": "Александр Николаичев", "avatar": "5.jpg", "valueText": "12 голосов"},
        {"id": 6, "name": "Андрей Мокроусов", "avatar": "6.jpg", "valueText": "9 голосов"},
        {"id": 8, "name": "Александр Иванков", "avatar": "8.jpg", "valueText": "8 голосов"},
        {"id": 7, "name": "Дмитрий Андриянов", "avatar": "7.jpg", "valueText": "6 голосов"},
        {"id": 3, "name": "Дарья Ковалева", "avatar": "3.jpg", "valueText": "5 голосов"},
        {"id": 9, "name": "Сергей Бережной", "avatar": "9.jpg", "valueText": "4 голоса"}
    ]
}

function renderLeaders(data){
    let layout = "";
    
    layout += '<header>' +
              '    <h1 class="title">' + data["title"] + '</h1>' +
              '    <h3 class="subtitle">' + data["subtitle"] + '</h3>' +
              '</header>';
    
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
            (selectedUserIndex === undefined ? 4 : selectedUserIndex),
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

        layout += '<div class="column' + (isUserSelected ? ' selected' : '') + '" data-place="' + userPlace + '">' + 
                  '    <img class="avatar" src="./images/' + userAvatar + '">';

        if(userPlace == 1){
            layout += '<div class="emoji">' + data["emoji"] + '</div>';
        }
        else if(isUserSelected){
            layout += '<div class="emoji">👍</div>';
        }

        layout += '    <h3 class="name">' + userName + '</h3>' +
                  '    <h4 class="score">' + userScore + '</h4>' +
                  '    <div class="place_box"></div>' +
                  '    <h1 class="place_number">' + userPlace + '</h1>' +
                  '</div>';
    }

    layout += '</div>';

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
    layout += '<header>' +
              '    <h1 class="title">' + data["title"] + '</h1>' +
              '    <h3 class="subtitle">' + data["subtitle"] + '</h3>' +
              '</header>';
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
    layout += '<ul class="legend">';
    layout += '<li>' +
              '    <div class="legend__step"></div>' +
              '    <h2 class="hide_on_horiz">1 час</h2>' +
              '    <h2 class="hide_on_vertic">2 часа</h2>' +
              '</li>';
    
    for(let i = 0; i < ranges.length; i++){
        layout += '<li>';
        layout += '<div class="legend__' +
            ranges[i][2] +
            '_cell"></div>';
        
        if(ranges[i][0] === ranges[i][1]){
            layout += '<h2>' + ranges[i][0] + '</h2>';
        }
        else{
            layout += '<h2>' +
                ranges[i][0] +
                ' — ' +
                ranges[i][1] +
                '</h2>';
        }

        layout += '</li>';
    }
    
    layout += '</ul>';

    return layout;
}

function renderTemplate(alias, data){
    alias = alias.toLowerCase();

    let layout = '<div class="story-' + alias + '">'; 

    if(alias === "activity"){
        layout += renderActivity(data);
    }
    else if(alias === "leaders"){
        layout += renderLeaders(data);
    }
    else{
        console.error("Unknown alias '" + alias + "'");
        return "";
    }

    layout += '</div>';

    return layout;
}

window.renderTemplate = renderTemplate;

window.onload = function() {
    let body = document.getElementsByTagName("body")[0];
    // body.innerHTML = renderTemplate('activity', data_activity);
    body.innerHTML = renderTemplate('leaders', data_leaders);
}