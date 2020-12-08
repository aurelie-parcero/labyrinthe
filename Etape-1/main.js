$(document).ready(function () {


    let dataLab = [];

    $.getJSON("../labyrinthes.json", function (data) {
        $.each(data, function (size, group) { // chaque groupe de taille
            let sizeGroup = [];
            let i = 0;
            $.each(group, function (label, lab) { // chaque labyrinthe
                let labyrinthe = [];
                $.each(lab, function (index, square) { // Chaque case du labyrithe
                    // let squarePos = square.posX + '-' + square.posY;
                    let squareData = {
                        'x': square.posX,
                        'y': square.posY,
                        'canMoveTo': canMoveTo(size, square.posX, square.posY, square.walls),
                        'walls': square.walls
                    }
                    // labyrinthe[squarePos] = squareData;
                    labyrinthe.push(squareData);
                });
                // sizeGroup.push(labyrinthe);

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

            currentLab.forEach(function (square, index) {
                let classes = [];
                let posX = square.x;
                let posY = square.y;
                for (let i = 0; i < square.walls.length; i++) {
                    if (square.walls[i] === true) {
                        classes.push('wall-' + i);
                    }
                }

                let domSquare = '<div style="top:' + squareSize * posX + 'px; left:' + squareSize * posY + 'px; height:' + squareSize + 'px; width:' + squareSize + 'px;" class="square ' + classes.join(' ') + '"></div>';
                squares.push(domSquare);

            });
            let domLab = '<div class="lab lab-' + size + '-' + index + '">' + squares.join(' ') + '</div>';

            $('.labs').append(domLab);

            let currentDomLab = $('.lab-' + size + '-' + index);
            currentDomLab.css('height', size + '00');


        }

        $('.size-btn').on('click', function (){
            let size = $(this).attr('value');
            let labsNum = dataLab[size].length - 1;

            let chosenLab = Math.floor((Math.random() * labsNum ));
            $('.lab').detach();
            drawLab(parseInt(size), parseInt(chosenLab));
        });


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

})
;


