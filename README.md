# Демо
leaders-1 ([light](https://cergmin.github.io/shri-task-1?slide=1&theme=light) | [dark](https://cergmin.github.io/shri-task-1?slide=1&theme=dark))  
leaders-2 ([light](https://cergmin.github.io/shri-task-1?slide=2&theme=light) | [dark](https://cergmin.github.io/shri-task-1?slide=2&theme=dark))  
vote-1 ([light](https://cergmin.github.io/shri-task-1?slide=3&theme=light) | [dark](https://cergmin.github.io/shri-task-1?slide=3&theme=dark))  
leaders-3 ([light](https://cergmin.github.io/shri-task-1?slide=4&theme=light) | [dark](https://cergmin.github.io/shri-task-1?slide=4&theme=dark))  
vote-2 ([light](https://cergmin.github.io/shri-task-1?slide=5&theme=light) | [dark](https://cergmin.github.io/shri-task-1?slide=5&theme=dark))  
leaders-4 ([light](https://cergmin.github.io/shri-task-1?slide=6&theme=light) | [dark](https://cergmin.github.io/shri-task-1?slide=6&theme=dark))  
chart-1 ([light](https://cergmin.github.io/shri-task-1?slide=7&theme=light) | [dark](https://cergmin.github.io/shri-task-1?slide=7&theme=dark))  
chart-2 ([light](https://cergmin.github.io/shri-task-1?slide=8&theme=light) | [dark](https://cergmin.github.io/shri-task-1?slide=8&theme=dark))  
diagram ([light](https://cergmin.github.io/shri-task-1?slide=9&theme=light) | [dark](https://cergmin.github.io/shri-task-1?slide=9&theme=dark))  
activity-1 ([light](https://cergmin.github.io/shri-task-1?slide=10&theme=light) | [dark](https://cergmin.github.io/shri-task-1?slide=10&theme=dark))  
activity-2 ([light](https://cergmin.github.io/shri-task-1?slide=11&theme=light) | [dark](https://cergmin.github.io/shri-task-1?slide=11&theme=dark))  

# Структура проекта
В директории **src** есть файл main.js, к нему подключаются все css и js исходники. В директории **src/styles** лежат файлы стилей для каждого слайда по отдельности (vote.css, chart.css и т. д.), с общими стилями, стилями для подключения шрифтов и переменными с цветами для тем. В директории **src/scripts** лежит файл render.js с функцией renderTemplate.
Есть директория **build**, в ней лежат собранные с помощью webpack исходники.
В корневой директории есть скрипт сервера - server.js, файл с данными шаблонов - data.json и конфигурационные файлы node.js и webpack.

# Структура render.js
Есть основаня функция **renderTemplate(alias, data)**, она принемает название шаблона и данные. Потом она обращается к одной из функций рендеринга слайда (**renderChart(data)**, **renderActivity(data)** и т.п.), это позволяет вынести header, одинаковый для всех слайдов, и даёт возможность более удобно добавлять новые шаблоны. Если по alias не будет найден подходящий шаблон, то функция вернёт пустую троку и выкинет ошибку в консоль.

# Про main.css, themes.css, fonts.css
В main.css содержатся стили, используемые глобально. Также там присутствукет конструкция:
```css
*[class^='story'],
*[class*=' story']{
    ...
}
```
она нужна для того, чтобы к каждому слайду, классы которых различаются, но имеют одинаковый формат **.story-{alias_name}** (.story-activity, .story-vote и т.д.), добавить определённые стили.

В theme.css устанавливаются значения всем переменным, отвечающим за цвета или изображения в различных темах. Это позволяет легко добавить новую тему или изменить уже существующую.

В fonts.css подключаются шрифты и их различные начертания.

# Адаптивность
Адаптивность вёрстки реализована, в основном, за счёт изменения размера шрифта корневого элемента при разных размерах экрана. Масштабируется не только текст но и различные блоки, потому что размеры многих из них устанавляваются в **rem**, единице измерения, котороая и равна размеру шрифта корневого элеменат.

# Слайд activity
Функция **renderActivity(data)** создаёт все 24 * 7 столбиков и добавляет по два класса, которые сигнализируют, какой высоты должен быть столбик в горизонтальной и вертикальной ориентации. В вертикальном варианте высота зависит только от собственного значения столбика, а в горизонтальном от суммы собственного значения и значения соседа.
Столбики располагаются с помощью Grid CSS, некоторые из них сдвигаются на полклетки.

# Слайд diagram
Функция **renderDiagram(data)** строит svg диаграмму по заданным параметрам (размер, толщина сегмента и т.д.) и данным, добавляя в цикле точки в <path>. В файле diagram.css её размер задаётся с помощью calc() и min() для достижения нужного поведения адаптивности.
Как изображение столбика используется png картинка, а не svg, потому что последнее часто даёт менее приятный глазу вариант, например, может некоректно работать сглаживание краёв. Картинка столбика отображается как фон псевдоэлемента, который прижат к нижнему краю. 

# Что можно было сделать лучше?
Во время повторного просмотра кода были обнаружены вещи, которые можно было бы сделать лучше, но из-за нехватки времени переписать их не получается.
1. Во время добавления точек диаграммы в <path> можно заменить построение сегментов в цикле, с помощью отрезков *L*, на построение сегментов с помощью дуг *A*, по аналогии с тем, как сделаны скругления тех же самых сегментов. Это улучшет время отрисовки, хотя и не на много, т.к. диаграмма строится меньше чем за 1000 иттераций циклов.
2. На слайде diagram используется Grid в .story-diagram main, его использование не имеет особого смысла, т.к. одновременно существует только один ряд или столбик. Grid можно заменить на Flex.

# Сборка
В проекте используется webpack, для того чтобы собрать stories.css и stories.js нужно воспользоваться одной из команд:

Сборка проекта в продакшн
```sh
npm run build
```
Сборка проекта во время разработке
```sh
npm run dev
```

Запустить наблюдение за изменениями файлов
```sh
npm run watch
```