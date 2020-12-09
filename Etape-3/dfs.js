$(document).ready(function () {

    let dataLab = [];

    $.getJSON("../labyrinthes.json", function (data) {
        let currentLab = null;
        $.each(data, function (size, group) { // chaque groupe de taille
            let sizeGroup = [];
            let i = 0;
            $.each(group, function (label, lab) { // chaque labyrinthe
                let labyrinthe = {
                    'size': size,
                    'current-position': 0,
                    'exit': lab.length - 1,
                    'squares': []
                }
                $.each(lab, function (index, square) { // Chaque case du labyrithe
                    // let squarePos = square.posX + '-' + square.posY;
                    let squareData = {
                        'x': square.posX,
                        'y': square.posY,
                        'canMoveTo': canMoveTo(size, square.posX, square.posY, square.walls),
                        'walls': square.walls,
                        'visited': false
                    }
                    labyrinthe['squares'].push(squareData);
                });

                sizeGroup.splice(i, 0, labyrinthe);
                i++;
            });
            dataLab[size] = sizeGroup;
        });
        chooseSize();

        function chooseSize() {
            dataLab.forEach(function (data, labSize) {

                let sizeButton = '<button class="btn btn-primary size-btn" type="button" value="' + labSize + '">' + labSize + '</button>';

                $('.choose').append(sizeButton);
            });

        }

        function drawLab(size, index) {
            let labWidth = 600;
            let squareSize = labWidth / size;
            let currentLab = dataLab[size][index];
            let squares = [];

            currentLab['squares'].forEach(function (square, index) {
                let classes = [];
                let posX = square.x;
                let posY = square.y;
                for (let i = 0; i < square.walls.length; i++) {
                    if (square.walls[i] === true) {
                        classes.push('wall-' + i);
                    }
                }

                if (index === currentLab['current-position']) {
                    classes.push('is-active');
                }

                if (index === currentLab['exit']) {
                    classes.push('exit');
                }

                let domSquare = '<div id="' + index + '" style="top:' + squareSize * posY + 'px; left:' + squareSize * posX + 'px; height:' + squareSize + 'px; width:'
                    + squareSize + 'px;" class="square ' + classes.join(' ') + '"></div>';
                squares.push(domSquare);

            });

            let domLab = '<div class="lab" id="lab-' + size + '-' + index + '">' + squares.join(' ') + '</div>';
            let title = '<h3 class="lab-level">Labyrinthe de niveau ' + size + ' !</h3>';
            $('.container-labs').prepend(title);
            $('.labs').append(domLab);

            let btn = '<button class="btn btn-secondary start-btn start-' + size + '-' + index + '" data-target="#lab-' + size + '-' + index + '" data-size="' + size + '" data-index="' + index + '">Start</button>';

            $('.controls').append(btn);

        }


        $('.controls').on('click', '.start-btn', onStartClick);

        function onStartClick() {
            dfsResolve(currentLab, currentLab['current-position']);
        }


        $('.size-btn').on('click', function () {
            let size = $(this).attr('value');
            let labsNum = dataLab[size].length;

            let chosenLab = Math.floor((Math.random() * labsNum));
            $('h3.lab-level').detach();
            $('.start-btn').detach();
            $('.lab').detach();
            drawLab(parseInt(size), parseInt(chosenLab));
            currentLab = dataLab[size][chosenLab];
        });

        let i = 0;

        async function dfsResolve(lab, position) {
            showStack(lab);
            showPosition(position);
            console.log(position);
            if (lab.exit === position) {
                console.log('found it!');
                return position;
            }

            i++;

            lab['squares'][position].visited = true;

            let neighbours = lab['squares'][position]['canMoveTo'];

            for (const neighbourPos of neighbours) {

                let neighbourIndex = neighbourPos.x + neighbourPos.y * lab.size;

                if (lab['squares'][neighbourIndex].visited === false) {

                    let timeout = 1 / lab.size * 1000;
                    console.log(timeout);
                    await new Promise(resolve => setTimeout(resolve, timeout));

                    let result = await dfsResolve(lab, neighbourIndex);

                    if (result) {
                        return result;
                    }
                }
            }
        }

        function showStack(currentLab) {
            currentLab['squares'].forEach(function (square, index) {
                if (square.visited === true) {
                    let posId = '#' + index;
                    $('.lab').find(posId).addClass('visited');
                }
            })
        }

        function showPosition(pos) {
            let posId = '#' + pos;
            $('.lab').find('.square').each(function () {
                $(this).removeClass('is-active');
            });
            $('.lab').find(posId).addClass('is-active');
        }

    });


    function canMoveTo(maxSize, x, y, walls) {
        var canMoveTo = [];
        var order = [{'x': 0, 'y': -1}, {'x': 1, 'y': 0}, {'x': 0, 'y': 1}, {'x': -1, 'y': 0}];

        walls.forEach(function (value, index) {
            if (value === false) {
                let newX = x + order[index].x;
                let newY = y + order[index].y;
                if (newX >= 0 && newX <= maxSize && newY >= 0 && newY <= maxSize) {
                    let squareToMove = {
                        'x': newX,
                        'y': newY
                    }

                    canMoveTo.push(squareToMove);
                }
            }
        })
        return canMoveTo;
    }

});
