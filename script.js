var
    freeCoordinants=[],
    frameDocument,
    svgArea,
    bubbles = [],
    sizes,
    bubblesStyle = '<defs><radialGradient id="gradient--bw-light" fy="10%">' +
        '<stop offset="60%"' +
        'stop-color="black" stop-opacity="0"/>' +
        '<stop offset="90%" stop-color="white" stop-opacity=".25"/>' +
        '<stop offset="100%" stop-color="black"/>' +
        '</radialGradient>' +
        '</defs>';

//задаем размер окна для области пузырьков согласно размерам окна браузера у пользователя
function setFrameWindowSize() {
    var
        frameWindow = document.getElementById('iframe'),
        clientHeight = document.documentElement.clientHeight,
		offsetHeight = document.getElementById('buttons').offsetHeight,
        offsetWidth = document.getElementById('frameDiv').offsetWidth;

    frameWindow.width = offsetWidth;
    frameWindow.height = clientHeight - offsetHeight - 25;
}

//задание основных атрибутов
function prepareBubbleArea() {

    sizes = [2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
    bubbles = [];

    //задаем массив координат 100 х 100
    for (var i = 0; i < 100; i++) {
        for (var j = 0; j < 100; j++) {
            freeCoordinants.push({cx: i, cy: j});
        }
    }

    //возвращаем параметрам SVG области значения по умолчанию
    svgArea.setAttribute('width', '1000');
    svgArea.setAttribute('height', '1000');
    svgArea.innerHTML = bubblesStyle;
}

//задаем случайный набор размеров из списка размеров( от 2 до 11)
function getRandomCountOfSizes() {
    var
        count = getRandomInt(5, 11),
        randomSizes = [],
        size,
        randomSizeIndex;

    while (randomSizes.length < count) {
        randomSizeIndex = getRandomInt(0, sizes.length);
        size = sizes.splice(sizes.indexOf(randomSizeIndex), 1);
        randomSizes.push(size[0]);
    }

    randomSizes.sort(function(a, b) {
        return a - b;
    });

    return randomSizes;
}

//генерируем область
function generateBubbleArea() {
    prepareBubbleArea();
    sizes = getRandomCountOfSizes();
    while (sizes.length > 0) {

        var
            randomRadius = sizes[getRandomInt(0, sizes.length)],
            availableCenters = freeCoordinants,
            center;

        if (bubbles.length === 0) {
            center = availableCenters[getRandomInt(0, availableCenters.length)];
            appendBubble({
                name: 'bubble',
                transform: 'scale(10)',
                cx: center.cx,
                cy: center.cy,
                r: randomRadius
            });

        } else {

            for (var i = 0; i < bubbles.length; i++) {
                var bubble=bubbles[i];
                availableCenters = availableCenters.filter(function(item) {

                    return Math.sqrt (
                            Math.pow(item.cx - bubble.cx, 2) +
                            Math.pow(item.cy - bubble.cy, 2)
                        ) >= bubble.r + randomRadius;

                });
            }

            if (availableCenters.length > 0) {
                center = availableCenters[getRandomInt(0, availableCenters.length)];
                appendBubble({
                    name: 'bubble',
                    transform: 'scale(10)',
                    cx: center.cx,
                    cy: center.cy,
                    r: randomRadius
                });
            } else {
                sizes = sizes.slice(0, sizes.indexOf(randomRadius));
            }
        }
    }
}

//функция добавления пузырька в область
function appendBubble(properties) {
    var bubble = frameDocument.createElement('circle');

    for (var item in properties) {
        if (properties.hasOwnProperty(item)) {
            bubble.setAttribute(item, properties[item]);
        }
    }

    setRandomColor(bubble);
    bubble = {
        cx: properties.cx,
        cy: properties.cy,
        r: properties.r
    };
    bubbles.push(bubble);
    removeBusyPoints(bubble);

}

//удаление всех точек, в которых не может размещаться пузырек ввиду пересечения с другим пузырьком
function removeBusyPoints(newBubble) {
    freeCoordinants = freeCoordinants.filter(function(item) {

        return  Math.sqrt (
                Math.pow(item.cx - newBubble.cx, 2) +
                Math.pow(item.cy - newBubble.cy, 2)
            ) >= newBubble.r + sizes[0];

    });
}

//генерация рандомного цвета для пузырька согласно цветовой палитре RGB
function setRandomColor(circle) {
    var
        red = getRandomInt(0, 255),
        green = getRandomInt(0, 255),
        blue = getRandomInt(0, 255);

    /*
    пузырик создаем засчет вставки в область круга с цветом
    и накладывания сверху круга с радиальным градиентом прозрачности
    */
    circle.setAttribute('fill', 'rgb(' + red + ',' + green + ',' + blue + ')');
    svgArea.innerHTML += circle.outerHTML;
    circle.setAttribute('fill','url(#gradient--bw-light)');
    svgArea.innerHTML += circle.outerHTML;
}

//функция выбора случайного числа
function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}

//функция масштабирования
function setZoomAttributes (zoomParameter) {
    if (frameDocument.getElementsByName('bubble').length === 0) return;

    var
        bubbles = frameDocument.getElementsByName('bubble'),
        transformProperty = bubbles[0].getAttribute('transform'),
        zoomIndex = transformProperty.substring(6, transformProperty.length - 1),
        propertyValue,
        svgProperties = {
            width: 'width',
            height: 'height'
        };

    if (zoomParameter === 'in') {
        zoomIndex *= 2;
    } else {
        zoomIndex /= 2;
    }

    for (var property in svgProperties) {

        if (svgProperties.hasOwnProperty(property)) {
            propertyValue = svgArea.getAttribute(property);

            switch (zoomParameter) {
                case 'in':
                    svgArea.setAttribute(property, propertyValue * 2);
                    break;
                case 'out':
                    svgArea.setAttribute(property, propertyValue / 2);
                    break;
            }
        }
    }

    bubbles.forEach(function(item) {
        propertyValue = 'scale(' + zoomIndex + ')';
        item.setAttribute('transform', propertyValue);
    });
}

document.addEventListener('DOMContentLoaded', function() {
    setFrameWindowSize();
    frameDocument = document.getElementById('iframe').contentWindow.document;
    frameDocument.open();
    frameDocument.write('<svg></svg>');
    frameDocument.close();
    frameDocument.body.style.background = 'radial-gradient(circle, #780206, #061161)';
    svgArea = frameDocument.getElementsByTagName('svg')[0];

    document.getElementById('Zoom-In').addEventListener('click', function() {
        setZoomAttributes('in');
    });

    document.getElementById('Zoom-Out').addEventListener('click', function() {
        setZoomAttributes('out');
    });

    document.getElementById('generate').addEventListener('click', generateBubbleArea);
});
