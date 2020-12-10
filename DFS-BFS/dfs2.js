$(document).ready(function () {

    let dataMazes = [];

    $.getJSON("../labyrinthes.json", function (data) {

        $.each(data, function (size, group) { // chaque groupe de taille
            let sizeGroup = [];
            let i = 0;
            $.each(group, function (label, maze) { // chaque labyrinthe
                let dataMaze = {
                    'size': size,
                    'current-position': 0,
                    'exit': maze.length - 1,
                    'squares': []
                }
                $.each(maze, function (index, square) { // Chaque case du labyrithe
                    let squareData = {
                        'x': square.posX,
                        'y': square.posY,
                        'canMoveTo': canMoveTo(size, square.posX, square.posY, square.walls),
                        'walls': square.walls,
                        'visited': false
                    }
                    dataMaze['squares'].push(squareData);
                });

                sizeGroup.splice(i, 0, dataMaze);
                i++;
            });
            dataMazes[size] = sizeGroup;
        });
        chooseSize();

        function chooseSize() {
            dataMazes.forEach(function (data, mazeSize) {

                let sizeButton = '<button class="btn btn-secondary size-btn" type="button" value="' + mazeSize + '">' + mazeSize + '</button>';

                $('.choose').append(sizeButton);
            });

        }

        $('.choose').on('click', '.size-btn', function () {
            $('.break-btn').detach();
            $('.result').detach();
            let size = $(this).attr('value');
            let mazesNum = dataMazes[size].length;

            let chosenIndex = Math.floor((Math.random() * mazesNum));
            let chosenMaze = dataMazes[size][chosenIndex];

            $('h3.lab-level').detach();
            $('.start-btn').detach();
            $('.lab').detach();

            drawMaze(chosenIndex, chosenMaze);

        });


        function drawMaze(mazeIndex, maze) {
            let mazeWidth = 600;
            let squareSize = mazeWidth / maze.size;
            let squares = [];
            maze['squares'].forEach(function (square, index) {
                let classes = [];
                let posX = square.x;
                let posY = square.y;
                for (let i = 0; i < square.walls.length; i++) {
                    if (square.walls[i] === true) {
                        classes.push('wall-' + i);
                    }
                }

                if (index === maze['current-position']) {
                    classes.push('entrance');
                    classes.push('is-active');
                }

                if (index === maze['exit']) {
                    classes.push('exit');
                }

                let domSquare = '<div id="' + index + '" style="top:' + squareSize * posY + 'px; left:' + squareSize * posX + 'px; height:' + squareSize + 'px; width:'
                    + squareSize + 'px;" class="square ' + classes.join(' ') + '"></div>';
                squares.push(domSquare);

            });

            let domMaze = '<div class="lab" id="lab-' + maze.size + '">' + squares.join(' ') + '</div>';
            let title = '<h3 class="lab-level">Labyrinthe de niveau ' + maze.size + ' !</h3>';
            $('.container-labs').prepend(title);
            $('.labs').append(domMaze);

            let dfsRecBtn = '<button class="btn btn-secondary dfs-rec start-btn start-' + maze.size + '-' + mazeIndex + '" data-target="#lab-' + maze.size + '-' + mazeIndex + '" data-size="' + maze.size + '" data-index="' + mazeIndex + '">Resolve with recursive DFS</button>';
            let dfsItBtn = '<button class="btn btn-secondary dfs-it start-btn start-' + maze.size + '-' + mazeIndex + '" data-target="#lab-' + maze.size + '-' + mazeIndex + '" data-size="' + maze.size + '" data-index="' + mazeIndex + '">Resolve with iterative DFS</button>';
            let bfsBtn = '<button class="btn btn-secondary bfs start-btn start-' + maze.size + '-' + mazeIndex + '" data-target="#lab-' + maze.size + '-' + mazeIndex + '" data-size="' + maze.size + '" data-index="' + mazeIndex + '">Resolve with BFS</button>';

            $('.controls').append(dfsRecBtn, dfsItBtn, bfsBtn);

            let breakWalls = '<button class="btn break-btn break-' + maze.size + '-' + mazeIndex + '" data-target="#lab-' + maze.size + '-' + mazeIndex + '" data-size="' + maze.size + '" data-index="' + mazeIndex + '">Break some walls before!</button>'
            $('.result-container').prepend(breakWalls);
        }

        let i = 0;

        $('.controls').on('click', '.start-btn', onStartClick);
        $('.result-container').on('click', '.break-btn', breakWalls);

        function breakWalls() {
            let currentMazeIndex = $(this).attr('data-index');
            let currentMazeSize = $(this).attr('data-size');
            let currentMaze = dataMazes[currentMazeSize][currentMazeIndex];

            let walls = [];
            let wallsToBreak = parseInt(currentMaze['squares'].length / 3);
            for (const [squareIndex, square] of currentMaze['squares'].entries()) {


                for (let [wallIndex, bool] of square.walls.entries()) {
                    if (bool === true) {
                        // console.log(squareIndex, wallIndex);
                        let sideSquare;
                        let sideWallIndex;
                        let size = currentMaze['size'];
                        switch (wallIndex) {
                            case 0:
                                sideSquare = Number(squareIndex) - Number(size);
                                sideWallIndex = 2;
                                break;
                            case 1:
                                sideSquare = Number(squareIndex) + 1;
                                sideWallIndex = 3;
                                break;
                            case 2:
                                sideSquare = Number(squareIndex) + Number(size);
                                sideWallIndex = 0;
                                break;
                            case 3:
                                sideSquare = Number(squareIndex) - 1;
                                sideWallIndex = 1;
                                break;
                        }
                        let sideWall;
                        if (sideSquare < 0 || sideSquare > currentMaze['squares'].length - 1) {
                            sideWall = null;

                        } else {

                            sideWall = {
                                'squareIndex': sideSquare,
                                'wallIndex': sideWallIndex,
                            };

                        }
                        walls.push({
                            'squareIndex': squareIndex,
                            'wallIndex': wallIndex,
                            'sideWall': sideWall
                        });

                    }
                }
            }

            for (let count = 0; count < wallsToBreak; count++) {
                const random = Math.floor(Math.random() * walls.length);
                let pickedSquare = walls[random];
                let squareIndex = pickedSquare.squareIndex;
                let wallIndex = pickedSquare.wallIndex;

                // console.log('boucle break walls, mur qui tombe: ');
                // console.log(currentMaze['squares'][squareIndex].walls[wallIndex]);
                // console.log(squareIndex, wallIndex);

                currentMaze['squares'][squareIndex].walls[wallIndex] = false;
                currentMaze['squares'][squareIndex].canMoveTo = canMoveTo(currentMaze['size'], currentMaze['squares'][squareIndex].x, currentMaze['squares'][squareIndex].y, currentMaze['squares'][squareIndex].walls);
                console.log(squareIndex, currentMaze['squares'][squareIndex].canMoveTo);

                disappear(squareIndex, wallIndex);
                if (pickedSquare.sideWall) {
                    let sidesquareIndex = pickedSquare.sideWall.squareIndex;
                    let sideWallIndex = pickedSquare.sideWall.wallIndex;
                    currentMaze['squares'][sidesquareIndex].walls[sideWallIndex] = false;
                    currentMaze['squares'][sidesquareIndex].canMoveTo = canMoveTo(currentMaze['size'], currentMaze['squares'][sidesquareIndex].x, currentMaze['squares'][sidesquareIndex].y, currentMaze['squares'][sidesquareIndex].walls);

                    disappear(sidesquareIndex, sideWallIndex);
                }
            }

            $(this).detach();
        }

        function disappear(squareIndex, wallIndex) {
            let squareId = '#' + squareIndex;
            let wallClass = 'wall-' + wallIndex;
            let newWallClass = 'wall-' + wallIndex + '-break';
            $(squareId).addClass(newWallClass);
            setTimeout(function () {
                $(squareId).removeClass(wallClass);
                $(squareId).removeClass(newWallClass);
            }, 1500);

        }

        function onStartClick() {
            let currentMazeIndex = $(this).attr('data-index');
            let currentMazeSize = $(this).attr('data-size');
            let currentMaze = dataMazes[currentMazeSize][currentMazeIndex];
            console.log('au clic sur start: ');
            console.log(currentMaze);
            $('.break-btn').detach();
            f = [];
            i = 0;
            $('.result').detach();
            currentMaze['squares'].forEach(function (square, index) {
                square.visited = false;
            });

            if ($(this).hasClass('dfs-rec')) {
                recDfsResolve(currentMaze, currentMaze['current-position']);
            } else if ($(this).hasClass('dfs-it')) {
                itDfsResolve(currentMaze, currentMaze['current-position']);
            } else if ($(this).hasClass('bfs')) {
                bfsResolve(currentMaze, currentMaze['current-position']);
            }
        }


        async function recDfsResolve(maze, position) {
            showStack(maze);
            showPosition(position);
            if (maze.exit === position) {
                let displayResult = '<div class="result">Sortie trouvée en <p class="count">' + i + '</p> déplacements!</div>';
                $('.result-container').prepend(displayResult);
                return i;
            }
            i++;

            maze['squares'][position].visited = true;

            let neighbours = maze['squares'][position]['canMoveTo'];
            // if (neighbours.length > 2) {
            //     console.log('Plusieurs chemins, lequel est un cul de sac?!');
            // }
            for (const neighbourPos of neighbours) {

                let neighbourIndex = neighbourPos.x + neighbourPos.y * maze.size;

                if (maze['squares'][neighbourIndex].visited === false) {

                    let timeout = 1 / maze.size * 1000;
                    await new Promise(resolve => setTimeout(resolve, timeout));

                    let result = await recDfsResolve(maze, neighbourIndex);

                    if (result) {
                        return result;
                    }
                }
            }
        }

        let f = [];


        async function itDfsResolve(maze, position) {

            f.push(position);
            maze['squares'][position].visited = true;

            while (f.length > 0) {
                if (maze.exit === position) {
                    let displayResult = '<div class="result">Sortie trouvée en <p class="count">' + i + '</p> déplacements!</div>';
                    $('.result-container').prepend(displayResult);
                    return i;
                }
                position = f.pop();
                let timeout = 1 / maze.size * 1000;
                await new Promise(resolve => setTimeout(resolve, timeout));
                showPosition(position);
                showStack(maze);
                let neighbours = maze['squares'][position]['canMoveTo'];
                for (const neighbourPos of neighbours) {
                    let neighbourIndex = neighbourPos.x + neighbourPos.y * maze.size;

                    if (maze['squares'][neighbourIndex].visited === false) {
                        f.push(neighbourIndex);
                        maze['squares'][neighbourIndex].visited = true;
                        i++;
                    }
                }
            }
        }


        async function bfsResolve(maze, position) {

            f.push(position);
            maze['squares'][position].visited = true;

            while (f.length > 0) {
                if (maze.exit === position) {
                    let displayResult = '<div class="result">Sortie trouvée en <p class="count">' + i + '</p> déplacements!</div>';
                    $('.result-container').prepend(displayResult);
                    return i;
                }

                position = f.shift();
                let timeout = 1 / maze.size * 1000;
                await new Promise(resolve => setTimeout(resolve, timeout));
                showPosition(position);
                showStack(maze);
                let neighbours = maze['squares'][position]['canMoveTo'];
                for (const neighbourPos of neighbours) {
                    let neighbourIndex = neighbourPos.x + neighbourPos.y * maze.size;

                    if (maze['squares'][neighbourIndex].visited === false) {
                        f.push(neighbourIndex);
                        maze['squares'][neighbourIndex].visited = true;
                        i++;
                    }
                }
            }
            if (maze.exit === position) {
                let displayResult = '<div class="result">Sortie trouvée en <p class="count">' + i + '</p> déplacements!</div>';
                $('.result-container').prepend(displayResult);
                return i;
            }
        }


        function showStack(maze) {
            maze['squares'].forEach(function (square, index) {
                let posId = '#' + index;
                $('.lab').find(posId).removeClass('visited');
                if (square.visited === true) {
                    $('.lab').find(posId).addClass('visited');
                    $('.lab').find(posId).text(index);
                }
            });
        }

        function showPosition(pos) {
            let posId = '#' + pos;
            $('.lab').find('.square').each(function () {
                $(this).removeClass('is-active');
            });
            $('.lab').find(posId).addClass('is-active');
        }

        // function findCulDeSac() {
        // }
    });


    function canMoveTo(maxSize, x, y, walls) {
        let canMoveTo = [];
        let order = [{'x': 0, 'y': -1}, {'x': 1, 'y': 0}, {'x': 0, 'y': 1}, {'x': -1, 'y': 0}];

        walls.forEach(function (value, index) {
            if (value === false) {
                let newX = x + order[index].x;
                let newY = y + order[index].y;
                if (newX >= 0 && newX < maxSize && newY >= 0 && newY < maxSize) {
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
