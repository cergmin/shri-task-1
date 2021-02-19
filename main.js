let data = {
    "mon": [0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 2, 3, 2, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0],
    "tue": [0, 0, 0, 0, 1, 0, 0, 0, 0, 5, 0, 4, 0, 0, 0, 0, 1, 0, 3, 0, 0, 2, 1, 0],
    "wed": [1, 0, 0, 0, 1, 0, 5, 0, 0, 4, 0, 0, 0, 5, 0, 2, 1, 0, 0, 0, 0, 0, 0, 1],
    "thu": [0, 1, 0, 1, 0, 0, 0, 0, 6, 0, 1, 0, 0, 1, 0, 0, 5, 0, 0, 0, 1, 0, 0, 0],
    "fri": [0, 0, 0, 0, 0, 0, 0, 1, 3, 0, 0, 5, 0, 4, 0, 0, 3, 0, 0, 0, 0, 1, 0, 0],
    "sat": [0, 0, 0, 0, 2, 1, 0, 0, 1, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0],
    "sun": [0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 3, 1, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0]
}

function renderTemplate(alias, data){
    alias = alias.toLowerCase();

    const weekdays = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"];
    let layout = '<main class="story-' + alias + '">'; 

    if(alias === "activity"){
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
                    data[weekdays[weekday]][hour],
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
        layout += '<h1 class="title">Коммиты, 1 неделя</h1>';
        layout += '<h2 class="subtitle">Спринт № 213</h2>';
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
                let commitsPerHour = data[
                    weekdays[weekday]
                ][hour];

                // Количество комитов за 2 часа
                let commitsPerHours = data[
                    weekdays[weekday]
                ][hour] + data[
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
        console.log(ranges);
    }
    else{
        console.error("Unknown alias '" + alias + "'");
        return "";
    }

    return layout;
}

window.onload = function() {
    let body = document.getElementsByTagName("body")[0];
    body.innerHTML = renderTemplate('activity', data);
}