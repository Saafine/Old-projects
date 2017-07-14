  init();

  if (webgl_detect() === false) {
        modal.open('user_modal_41');
  }

function load_single_data(what) {
      var temp_string = $('#load_' + what).html();
      var temp_array = temp_string.split(';');
      for (run_col = 0; run_col < model_columns; run_col++) {
          this[what][run_col] = parseFloat(temp_array[run_col]);
      }
  }

function load_multi_data(what) {
    for (run_col = 0; run_col < model_columns; run_col++) {
        if ($('#load_' + what + '_' + run_col).length) {
            this[what][run_col] = [];
            var temp_string = $('#load_' + what + '_' + run_col).html();
            var temp_array = temp_string.split(';');
            for (run_shelf = 0; run_shelf < temp_array.length; run_shelf++) {
                this[what][run_col][run_shelf] = parseFloat(temp_array[run_shelf]);
            }
        }
    }
}


  function init() {
      fit_window();

      // APP OPTIONS START
      step = 1; // where to start configuring
      visibility_clicked_dr = 0.9; // door clicked
      visibility_clicked = 0.9; // trigger blocked clicked
      visibility_mouseover = 0.4; // trigger block mouse over
      textures_dest = 'textures/';
      // APP OPTIONS END

      //GLOBALS DEFAULT START
      model_height_array = [];
      model_width_array = [];
      model_depth_array = [];
      model_shelf_array = [];
      door_texture = [];

      board = [];
      space = [];
      door = [];
      space_array = [];
      hanger = [];
      divider = [];
      cubic = [];
      sliding_door = null;
      //GLOBALS DEFAULT END

      //GLOBAL OPTIONS START
      furniture_thickness_1 = 1.9;
      furniture_thickness_2 = 2.6;
      
      minimum_shelf_space = 15;
      minimum_model_height = 40;
      maximum_model_height = 260;
      maximum_tabletop = 260;

      minimum_model_width = 30;
      maximum_model_width = 400;

      minimum_model_depth = 30;
      maximum_model_depth = 70;

      minimum_space_width = 25;
      maximum_space_width = 100;

      maximum_drawer_height = 60;
      minimum_drawer_height = 15;
      minimum_drawer_width = 25;
      maximum_drawer_width = 100;
      minimum_drawer_depth = 30;
      drawer_sync_width = 60;

      minimum_door_height = 30;
      maximum_door_height = 240;
      minimum_door_width = 25;
      maximum_door_width = 65;

      minimum_dbldoor_width = 50;
      maximum_dbldoor_width = 130;
      maximum_dbldoor_shelfspace = 160;

      maximum_flap_height = 50; // was 35
      minimum_flap_height = 25;
      maximum_flap_width = 100; // was 80
      minimum_flap_width = 35;

      minimum_sliding_door_height = 30;
      maximum_sliding_door_height = 150;
      minimum_sliding_door_width = 30;
      maximum_sliding_door_width = 100;

      minimum_hanger_height = 100;
      minimum_hanger_width = 30;
      minimum_hanger_depth = 40;

      minimum_divider_height = 20;
      minimum_divider_spacewidth = 15;

      minimum_cubic_height = 20;
      minimum_cubic_width = 20;
      maximum_cubic_width = 60;
      maximum_cubic_height = 60;
      //GLOBAL OPTIONS OVER

      // LOAD DIMENSIONS - PART 1 - STARTS
      if ($('#load').length) {
          //integers start
          model_height = parseInt($('#load_model_height').html());
          model_width = parseInt($('#load_model_width').html()); // total model width
          model_depth = parseInt($('#load_model_depth').html());
          sockle_height = parseFloat($('#load_sockle_height').html());
          furniture_thickness = parseFloat($('#load_furniture_thickness').html());
          model_columns = parseInt($('#load_model_columns').html());
          //integers end
          active_texture = $('#load_active_texture').html();
          active_backwall_texture = $('#load_active_backwall_texture').html();
          options_pick('material', active_texture, 'init'); // active texture
          options_pick('backwall', active_backwall_texture, 'init'); // active backwall

          model_tabletop = $('#load_model_tabletop').html();
          //model_standingByWall = $('#load_model_standingByWall').html();

          load_single_data('model_height_array');
          load_single_data('model_width_array');
          load_single_data('model_depth_array');
          load_single_data('model_shelf_array');
          load_multi_data('space_array');

          for (run_col = 0; run_col < model_columns; run_col++) {
              board_builder((run_col + 1), model_shelf_array[run_col]); //build top/bottom boards
          }

          // sliding door starts
          if ($('#load_sliding_door').length) {
              var load_sliding_door = $('#load_sliding_door').html();
              var temp_array = load_sliding_door.split(',');
              sliding_door = {
                  lowestColumn: parseInt(temp_array[0]),
                  lowestSpace: parseInt(temp_array[1]),
                  highestColumn: parseInt(temp_array[2]),
                  highestSpace: parseInt(temp_array[3]),
                  startDoor: parseInt(temp_array[4]),
                  endDoor: parseInt(temp_array[5]),
                  startRailing: parseInt(temp_array[6]),
                  endRailing: parseInt(temp_array[7]),
                  texture: temp_array[8]
              };
          }
          // sliding door ends
          load_div(4);

          // LOAD DIMENSIONS - PART 1 - ENDS
      } else { // INITIATE WITH USER VALUES
          options_pick('material', 'oak', 'init'); // active texture
          options_pick('backwall', 'white', 'init'); // active backwall
          //model_standingByWall = 'tak';
          model_height = 180;
          model_width = 100;
          model_depth = 40;
          model_tabletop = 'over';
          user_init('init');
          load_div(1, 'init');
      }
  }

  function user_decision(mode, column, spaceY) {
      column = parseInt(column);
      spaceY = parseInt(spaceY);

      switch (step) {
          case 2: // variables relevant on step 2
              var model_height_changed_div = document.getElementById('user_edit_slider_height');
              var model_height_changed = parseFloat(model_height_changed_div.noUiSlider.get());
              var model_width_changed_div = document.getElementById('user_edit_slider_width');
              var model_width_changed = parseFloat(model_width_changed_div.noUiSlider.get());
              var model_shelf_changed_div = document.getElementById('user_edit_slider_shelves');
              var model_shelf_changed = parseFloat(model_shelf_changed_div.noUiSlider.get());
              var space_height_changed_div = document.getElementById('user_edit_slider_spaceheight');
              var space_height_changed = parseFloat(space_height_changed_div.noUiSlider.get());
              break;
          default:
              //            console.log('no variables relevant in step '+step);
      }

      switch (mode) {
          // ----------------------------------------------------- STEP TWO STARTS HERE -----------------------------------------------------      
          case ('fh'): // fh = furniture height
              if (model_height_changed === model_height_array[column - 1]) {
                  return;
              }

              model_height_array[column - 1] = model_height_changed;
              space_array[column - 1] = normalize(model_height_array[column - 1], 0, 'shelf'); // transfered from board builder, counts space for each shelf
              board_builder(column, 0);
              check_maximum_shelves(column);
              model_shelf_array[column - 1] = 0;

              object_remover(column); // remove objects if height changed
              if (sliding_door !== null) {
                  if (x_overlap(column, column, sliding_door.startRailing, sliding_door.endRailing)) {
                      sliding_door = null;
                  }
              }

              counter = 0;
              while (door[counter] != null) {
                  if (x_overlap(column, column, door[counter].column, door[counter].columnEnd)) {
                      door.splice(counter, 1);
                      counter--;
                  }
                  counter++;
              }

              load_column(column, 1);
              break;

          case ('sw'): // sw = space width
              if (isNaN(model_width_changed)) {
                  $(model_width_changed_div).val(model_width_array[column - 1]);
                  return;
              }

              if (column === model_columns) { // modify next column
                  var modify_column = model_columns - 2;
              } else { // modify previous column
                  var modify_column = (column - 1) + 1;
              }

              var old_column_value = model_width_array[column - 1];
              var old_modified_column_value = model_width_array[modify_column];

              if (model_width_changed < minimum_space_width) { // user input too small
                  model_width_changed = minimum_space_width;
              } else if (model_width_changed > maximum_space_width) { // user input too big
                  model_width_changed = maximum_space_width;
              }

              var new_modified_column_value = old_modified_column_value + (old_column_value - model_width_changed);
              if (new_modified_column_value < minimum_space_width) { // auto modified column width too small
                  var auto = old_modified_column_value - minimum_space_width;
                  new_modified_column_value = minimum_space_width;
                  model_width_changed = old_column_value + auto;
              } else if (new_modified_column_value > maximum_space_width) { // auto modified column width too big
                  var auto = new_modified_column_value - maximum_space_width;
                  new_modified_column_value = maximum_space_width;
                  model_width_changed = model_width_changed + auto;
              }
              model_width_array[column - 1] = model_width_changed; // set new value for clicked column
              model_width_array[modify_column] = new_modified_column_value; // set new value for automodified column

              if (model_width_changed !== old_column_value) {
                  object_remover(modify_column + 1);
                  object_remover(column); // remove objects if width changed
                  if (sliding_door !== null) {
                      if (x_overlap(sliding_door.startRailing, sliding_door.endRailing, column, modify_column + 1)) { // calls function that test if 2 ranges of integers overlap 
                          sliding_door = null;
                      }
                  }
              }

              counter = 0;
              while (door[counter] != null) {
                  if (x_overlap(column, modify_column, door[counter].column, door[counter].columnEnd)) {
                      door.splice(counter, 1);
                      counter--;
                  }
                  counter++;
              }
              break;

          case ('fd'): // fd = furniture depth
              var old_column_value = model_depth_array[column - 1];
              var difference = old_column_value - model_depth_changed;
              model_depth_array[column - 1] = model_depth_changed;
              var counter = 0;
              while (board[column - 1][counter] != null) {
                  board[column - 1][counter].depth = model_depth_array[column - 1];
                  board[column - 1][counter].z = board[column - 1][counter].z + difference / 2;
                  counter++;
              }

              if (difference !== 0) {
                  object_remover(column); // remove objects if depth changed
                  if (sliding_door !== null) {
                      if (x_overlap(column, column, sliding_door.startRailing, sliding_door.endRailing)) {
                          sliding_door = null;
                      }
                  }
              }

              counter = 0;
              while (door[counter] != null) {
                  if (x_overlap(column, column, door[counter].column, door[counter].columnEnd)) {
                      door.splice(counter, 1);
                      counter--;
                  }
                  counter++;
              }
              break;
          case ('fs'): // furniture shelf
              space_array[column - 1] = normalize(model_height_array[column - 1], model_shelf_changed, 'shelf'); // transfered from board builder, counts space for each shelf
              board_builder(column, model_shelf_changed);
              model_shelf_array[column - 1] = model_shelf_changed;

              if (sliding_door !== null) {
                  if (x_overlap(column, column, sliding_door.startRailing, sliding_door.endRailing)) {
                      sliding_door = null;
                  }
              }

              object_remover(column);
              load_column(column, 1);
              break;
          case ('sh'): // furniture space
              if (isNaN(space_height_changed)) {
                  $(space_height_changed_div).val(space_array[column - 1][spaceY]);
                  return;
              }
              spaceY = spaceY - 1;

              if (spaceY === model_shelf_array[column - 1]) { // modify this space if last space clicked
                  var clicked_space = model_shelf_array[column - 1];
                  var modify_space = model_shelf_array[column - 1] - 1;
                  var modify_board = model_shelf_array[column - 1];
                  var ref_space = model_shelf_array[column - 1] - 1;
                  var reference = furniture_thickness / 2 + furniture_thickness + board[column - 1][ref_space].y;
              } else { // modify space above
                  var clicked_space = spaceY;
                  var modify_space = spaceY + 1;
                  var modify_board = spaceY + 1;
                  var ref_space = spaceY;
                  var reference = furniture_thickness / 2 + furniture_thickness + board[column - 1][ref_space].y;
              }

              object_remover(column, modify_board);

              if (sliding_door !== null) {
                  if (x_overlap(column, column, sliding_door.startRailing, sliding_door.endRailing)) {
                      var boardPos = board[column - 1][modify_board].y; // old board position needed for sliding door
                      var slidingEnd = board[sliding_door.highestColumn - 1][sliding_door.highestSpace].y;
                      var slidingStart = board[sliding_door.lowestColumn - 1][sliding_door.lowestSpace - 1].y;
                      if (boardPos === slidingStart || boardPos === slidingEnd) {
                          sliding_door = null;
                      }
                  }
              }

              var old_space_value = space_array[column - 1][spaceY]; // get old value of clicked cell
              var old_modified_space_value = space_array[column - 1][modify_space]; // get old value of auto modified cell
              if (space_height_changed < minimum_shelf_space) { // if the value is too small
                  space_height_changed = minimum_shelf_space;
                  space_array[column - 1][clicked_space] = space_height_changed;
                  space_array[column - 1][modify_space] = old_modified_space_value + (old_space_value - space_height_changed);
                  board[column - 1][modify_board] = new board_object(column, reference + space_array[column - 1][ref_space], furniture_thickness);
                  space[column - 1][clicked_space] = new space_object(column, clicked_space + 1);
                  space[column - 1][modify_space] = new space_object(column, modify_space + 1);
              } else if (space_height_changed > old_modified_space_value + old_space_value - minimum_shelf_space) { // if the value modified is too small
                  space_height_changed = old_modified_space_value + old_space_value - minimum_shelf_space;
                  space_array[column - 1][clicked_space] = space_height_changed;
                  space_array[column - 1][modify_space] = old_modified_space_value + (old_space_value - space_height_changed);
                  board[column - 1][modify_board] = new board_object(column, reference + space_array[column - 1][ref_space], furniture_thickness);
                  space[column - 1][clicked_space] = new space_object(column, clicked_space + 1);
                  space[column - 1][modify_space] = new space_object(column, modify_space + 1);
              } else { // if the value is OK
                  space_array[column - 1][clicked_space] = space_height_changed; // clicked space = user value
                  space_array[column - 1][modify_space] = old_modified_space_value + (old_space_value - space_height_changed); // modified space = old modified space+clicked space-user value
                  board[column - 1][modify_board] = new board_object(column, reference + space_array[column - 1][ref_space], furniture_thickness); // recreate board
                  space[column - 1][clicked_space] = new space_object(column, clicked_space + 1); // reacreate clicked space object
                  space[column - 1][modify_space] = new space_object(column, modify_space + 1); // recreate modified space object
              }

              break;
              // ----------------------------------------------------- STEP TWO ENDS HERE -----------------------------------------------------         
              // ---------------------------------------------------- STEP THREE STARTS HERE ----------------------------------------------------      
          case ('do'): // doors adder
          case ('dd'): // double doors adder
          case ('fl'): // flap doors adder
              var count = 0;
              var start = null;
              var end = null;
              var column;
              var flap_doors = 'no';
              var column_end;
              var tolerance = 0.3;

              for (run_col = 1; run_col <= model_columns; run_col++) {
                  for (run_shelf = 1; run_shelf <= model_shelf_array[run_col - 1] + 1; run_shelf++) { // run for every shelf space.
                      if (scene_box_spc[run_col - 1][run_shelf - 1].visibility === visibility_clicked) {
                          count++;
                          if (start === null) { // first column
                              start = run_shelf;
                              column = run_col;
                              column_end = run_col;
                          }
                          if (start !== null && column !== run_col) { // check for flap doors
                              flap_doors = 'yes';
                              column_end = run_col;
                              end = start + 1; // flap doors can only cover 1 space in column
                          }
                          if (start !== null && column === column_end) { // first column, get door's height
                              end = run_shelf + 1;
                          }
                      }
                      // stop searching after 1 column found if not flap doors
                      if (run_shelf === model_shelf_array[run_col - 1] + 1 && (mode === 'do' || mode === 'dd') && start !== null) {
                          run_col = model_columns;
                      }
                  }
              }

              if (start === null) {
                  modal.open('user_modal_3'); // user didnt pick space for door insert
                  return;
              } else if (start !== null && column === column_end && mode === 'fl' && start !== end - 1) {
                  modal.open('user_modal_4'); // cant add flap doors, try horizontal
                  return;
              }

              var startY = board[column - 1][start - 1].y;
              var endY = board[column - 1][end - 1].y;
              var get_space_height = endY - startY - furniture_thickness;
              var get_space_width = wall[column_end].x - wall[column - 1].x - furniture_thickness;

              if (flap_doors === 'yes' && mode === 'dd') {
                  modal.open('user_modal_5');
                  return;
              }

              // CUBIC - check for cubic
              for (var x=0; x<cubic.length; x++){
                  if (x_overlap(cubic[x].column,cubic[x].column, column, column_end)){
                      if (mode==='fl'){
                          var cubic_start = board[cubic[x].column-1][cubic[x].space-1].y;
                          var cubic_end = board[cubic[x].column-1][cubic[x].space].y;
                          if (x_overlap(cubic_start, cubic_end, startY, endY) && startY !== cubic_end && endY !== cubic_start) {
                              modal.open('user_modal_61');
                              return;
                            }
                      }else {
                          if (x_overlap(cubic[x].space, cubic[x].space, start, end-1)){
                              modal.open('user_modal_60');
                              return;
                          }
                      }

                  }
              }
              // FLAP DOORS MODE STARTS
              if (mode === 'fl') {
                  var is_possible = 0;
                  for (run_col = column; run_col <= column_end; run_col++) { // check is columns contain same level boards
                      for (run_shelf = 1; run_shelf <= model_shelf_array[run_col - 1] + 2; run_shelf++) {
                          if (board[run_col - 1][run_shelf - 1].y + tolerance > startY && board[run_col - 1][run_shelf - 1].y - tolerance < startY) {
                              is_possible++;
                          }
                          if (board[run_col - 1][run_shelf - 1].y + tolerance > endY && board[run_col - 1][run_shelf - 1].y - tolerance < endY) {
                              is_possible++;
                              run_shelf = model_shelf_array[run_col - 1] + 2;
                          }
                      }
                  }

                  if ((column_end + 1 - column) * 2 !== is_possible) {
                      modal.open('user_modal_6');  // flap doors not in one line
                      return;
                  }

                  if (object_fit(get_space_width, minimum_flap_width, maximum_flap_width) || object_fit(get_space_height, minimum_flap_height, maximum_flap_height)) {
                    // flap only in given dimensions
                    modal.open('user_modal_7', [minimum_flap_height, maximum_flap_height, minimum_flap_width, maximum_flap_width, get_space_height.toFixed(1), get_space_width.toFixed(1)]);
                    return;
                  }

                  var exact_width = model_depth_array[column - 1];
                  for (run_col = column; run_col < column_end; run_col++) {
                      if (exact_width !== model_depth_array[run_col]) {
                        // flap doors - various depth
                        modal.open('user_modal_8');
                          return;
                      }
                  }
              }
              // FLAP DOORS MODE ENDS

              if (mode === 'dd' || mode === 'do') {
                  if ((end - start) !== count) { //  - if selected cells are in not line
                      modal.open('user_modal_9');
                      return;
                  }

                  if (mode === 'dd') {
                      if (object_fit(get_space_height, minimum_door_height, maximum_door_height) || object_fit(get_space_width, minimum_dbldoor_width, maximum_dbldoor_width)) {
                          // double door dimensions
                          modal.open('user_modal_10', [minimum_door_height, maximum_door_height, minimum_dbldoor_width, maximum_dbldoor_width, get_space_height.toFixed(1), get_space_width.toFixed(1)]);
                          return;
                      }
                      for (run_shelf = start; run_shelf < end; run_shelf++) {
                          if (space_array[column - 1][run_shelf - 1] > maximum_dbldoor_shelfspace) {
                              var counter = 0;
                              while (divider[counter] != null) { // if divider exists inside space, don't request shelf
                                  if (divider[counter].column === column && divider[counter].space === run_shelf) {
                                      var counter = 9999;
                                  }
                                  counter++;
                              }
                              if (counter !== 10000) { // if divider exists inside space, don't request shelf
                                  // shelf needed add double doors
                                  modal.open('user_modal_11', [maximum_dbldoor_shelfspace, space_array[column - 1][run_shelf - 1].toFixed(1)]);
                                  return;
                              }
                          }
                      }
                  } else {
                      if (object_fit(get_space_height, minimum_door_height, maximum_door_height) || object_fit(get_space_width, minimum_door_width, maximum_door_width)) { // || get_space_width>maximum_door_width || get_space_width<minimum_door_width
                          // horizontal doors dimensions
                          modal.open('user_modal_12', [minimum_door_height, maximum_door_height, minimum_door_width, maximum_door_width, get_space_height.toFixed(1), get_space_width.toFixed(1)]);                                
                          return;
                      }
                  }
              }

              var counter = 0;
              var ex_door_start;
              var ex_door_end;

              while (door[counter] != null) {
                  if (x_overlap(door[counter].column, door[counter].columnEnd, column, column_end)) {
                      ex_door_start = board[door[counter].column - 1][door[counter].start - 1].y;
                      ex_door_end = board[door[counter].column - 1][door[counter].end - 1].y;
                      if (x_overlap(ex_door_start, ex_door_end, startY, endY) && startY !== ex_door_end && endY !== ex_door_start) {
                          // already has doors
                          modal.open('user_modal_13');
                          return;
                      }
                  }
                  counter++;
              }

              if (sliding_door !== null) {
                  if (x_overlap(sliding_door.startRailing, sliding_door.endRailing, column, column_end)) { // calls function that test if 2 ranges of integers overlap
                      var slidingEnd = board[sliding_door.highestColumn - 1][sliding_door.highestSpace].y;
                      var slidingStart = board[sliding_door.lowestColumn - 1][sliding_door.lowestSpace - 1].y;
                      if (x_overlap(startY, endY, slidingStart, slidingEnd) && startY !== slidingEnd && endY !== slidingStart) { // OVERLAP FIX
                          // this place contains sliding doors
                          modal.open('user_modal_14');
                          return;
                      }
                  }
              }
              if (mode === 'dd') { // create double doors
                  door.push(new door_object(column, start, end, 'doubleLEFT', active_texture, column_end, 'left'));
                  door.push(new door_object(column, start, end, 'doubleRIGHT', active_texture, column_end, 'right'));
              } else if (flap_doors === 'yes' || mode === 'fl') {
                  modal.open('user_modal_47');
                  $('#user_modal_47_top').attr('onclick', 'add_doors('+column+','+start+','+end+','+'\'flap\''+','+'\''+active_texture+'\''+','+column_end+','+'\'top\')');
                  $('#user_modal_47_bot').attr('onclick', 'add_doors('+column+','+start+','+end+','+'\'flap\''+','+'\''+active_texture+'\''+','+column_end+','+'\'bot\')');
                  return;
              } else {
                  modal.open('user_modal_1');
                  $('#user_modal_1_left').attr('onclick', 'add_doors('+column+','+start+','+end+','+'\'door\''+','+'\''+active_texture+'\''+','+column_end+','+'\'left\')');
                  $('#user_modal_1_right').attr('onclick', 'add_doors('+column+','+start+','+end+','+'\'door\''+','+'\''+active_texture+'\''+','+column_end+','+'\'right\')');
                  return;
              }

              break;
          case ('da'): // furniture drawer adder
              var start = null;
              var end = null;
              var column = null;

              for (run_col = 1; run_col <= model_columns; run_col++) {
                  for (run_shelf = 1; run_shelf <= model_shelf_array[run_col - 1] + 1; run_shelf++) { // run for every shelf space.
                      if (scene_box_spc[run_col - 1][run_shelf - 1].visibility === visibility_clicked) {
                          start = run_shelf;
                          end = run_shelf + 1;
                          column = run_col;
                          run_col = model_columns;
                          run_shelf = model_shelf_array[model_columns - 1] + 1;
                      }
                  }
              }

              if (start === null) {
                  // pick a space to add a drawer
                  modal.open('user_modal_15');
                  return;
              }

              var startY = board[column - 1][start - 1].y; //!update, getting space_array is sufficient for single block objects
              var endY = board[column - 1][end - 1].y;
              var get_space_height = endY - startY - furniture_thickness;

              if (object_fit(get_space_height, minimum_drawer_height, maximum_drawer_height) || object_fit(model_width_array[column - 1], minimum_drawer_width, maximum_drawer_width)) {
                // drawer dimensions
                modal.open('user_modal_16', [minimum_drawer_height, maximum_drawer_height, minimum_drawer_width, maximum_drawer_width, get_space_height.toFixed(2), model_width_array[column - 1].toFixed(2)]);
                return;
              }

              var counter = 0;
              var ex_door_start;
              var ex_door_end;
              while (door[counter] != null) {
                  if (door[counter].column <= column && column <= door[counter].columnEnd || door[counter].column <= column_end && column_end <= door[counter].columnEnd) {
                      ex_door_start = board[door[counter].column - 1][door[counter].start - 1].y;
                      ex_door_end = board[door[counter].column - 1][door[counter].end - 1].y;
                      if ((ex_door_start <= startY && startY < ex_door_end) || (ex_door_start < endY && endY <= ex_door_end)) { // there is better solution in door adder
                          // space already has doors
                          modal.open('user_modal_17');
                          return;
                      }
                  }
                  counter++;
              }

              var counter = 0;
              while (hanger[counter] != null) {
                  if (hanger[counter].column === column && hanger[counter].space === start) {
                      // space has hanger
                      modal.open('user_modal_18');
                      return;
                  }
                  counter++;
              }

              // CUBIC - check for cubic
              for (var x=0; x<cubic.length; x++){
                  if (cubic[x].column === column && cubic[x].space === start){
                      modal.open('user_modal_62');
                      return;
                  }
              }

              if (sliding_door !== null) {
                  if (x_overlap(sliding_door.startRailing, sliding_door.endRailing, column, column_end)) { // calls function that test if 2 ranges of integers overlap
                      var slidingEnd = board[sliding_door.highestColumn - 1][sliding_door.highestSpace].y;
                      var slidingStart = board[sliding_door.lowestColumn - 1][sliding_door.lowestSpace - 1].y;

                      if (x_overlap(startY, endY, slidingStart, slidingEnd) && startY !== slidingEnd && endY !== slidingStart) {
                          // cant add cause of sliding door
                          modal.open('user_modal_19');
                          return;
                      }
                  }
              }

              var counter = 0;
              while (divider[counter] != null) {
                  if (divider[counter].column === column && divider[counter].space === start) {
                      modal.open('user_modal_20');
                      return;
                  }
                  counter++;
              }

              door.push(new door_object(column, start, end, 'drawer', active_texture, column, 'standard'));
              break;
          case ('sl'): // sliding door
          case ('sl-update'): // sliding door  
              modal.close();
              var counter;
              var get_start_bot_board;
              var get_start_top_board;
              var get_end_bot_board;
              var get_end_top_board;
              var startX = null;
              var endX;

              var texture = active_texture;
              var sliding_door_div_start = '#sliding_door_select_start';
              var sliding_door_div_end = '#sliding_door_select_end';
              var from_column = parseInt($(sliding_door_div_start).val());
              var to_column = parseInt($(sliding_door_div_end).val());

              if (mode === 'sl-update' && sliding_door !== null) { // if triggered by select option with existing doors
                  var lowest_column = sliding_door.lowestColumn;
                  var lowest_space = sliding_door.lowestSpace;
                  var highest_column = sliding_door.highestColumn;
                  var highest_space = sliding_door.highestSpace;
                  var startX = sliding_door.startDoor;
                  var endX = sliding_door.endDoor;
                  texture = sliding_door.texture;
                  var slid_door_cover;

                  if (from_column > startX) {
                      slid_door_cover = (endX) - startX;
                      startX = from_column;
                      endX = startX + slid_door_cover;
                  }
                  if (to_column < endX) {
                      slid_door_cover = (endX) - startX;
                      endX = to_column;
                      startX = endX - slid_door_cover;
                  }
              } else if (mode === 'sl-update' && sliding_door === null) {
                  return;
              } else {
                  for (run_col = 1; run_col <= model_columns; run_col++) {
                      for (run_shelf = 1; run_shelf <= model_shelf_array[run_col - 1] + 1; run_shelf++) { // run for every shelf space.
                          if (scene_box_spc[run_col - 1][run_shelf - 1].visibility === visibility_clicked) {
                              if (startX === null) {
                                  get_start_bot_board = run_shelf;
                                  get_start_top_board = run_shelf;
                                  get_end_bot_board = run_shelf;
                                  get_end_top_board = run_shelf;
                                  startX = run_col;
                                  endX = run_col;
                              }
                              if (startX !== null && startX === run_col) {
                                  get_start_top_board = run_shelf;
                                  get_end_top_board = run_shelf;
                              }
                              if (startX !== null && startX !== run_col && endX !== run_col) {
                                  endX = run_col;
                                  get_end_bot_board = run_shelf;
                                  get_end_top_board = run_shelf;
                              }
                              if (startX !== null && startX !== run_col && endX === run_col) {
                                  get_end_top_board = run_shelf;
                              }
                          }
                      }
                  }

                  if (startX === null) {
                      // select a space to add sliding door
                      modal.open('user_modal_21');
                      return;
                  }

                  var lowest_point_start = board[startX - 1][get_start_bot_board - 1].y;
                  var highest_point_start = board[startX - 1][get_start_top_board].y;

                  var lowest_point_end = board[startX - 1][get_end_bot_board - 1].y;
                  var highest_point_end = board[startX - 1][get_end_top_board].y;

                  var lowest_column;
                  var lowest_space;
                  var highest_column;
                  var highest_space;

                  if (lowest_point_start <= lowest_point_end) {
                      lowest_column = startX;
                      lowest_space = get_start_bot_board;
                  } else {
                      lowest_column = endX;
                      lowest_space = get_end_bot_board;
                  }
                  if (highest_point_start >= highest_point_end) {
                      highest_column = startX;
                      highest_space = get_start_top_board;
                  } else {
                      highest_column = endX;
                      highest_space = get_end_top_board;
                  }
              }

              var tolerance = 0.3;
              var startingY = board[lowest_column - 1][lowest_space - 1].y;
              var endingY = board[highest_column - 1][highest_space].y;
              var get_height = endingY - startingY - furniture_thickness;
              var get_width = wall[endX].x - wall[startX - 1].x - furniture_thickness;


              if (object_fit(get_height, minimum_sliding_door_height, maximum_sliding_door_height) || object_fit(get_width, minimum_sliding_door_width, maximum_sliding_door_width)) {
                modal.open('user_modal_22', [minimum_sliding_door_height, maximum_sliding_door_height, minimum_sliding_door_width, maximum_sliding_door_width, get_height.toFixed(1), get_width.toFixed(1)]);
                  return;
              }

              if (!x_overlap(from_column, to_column, startX, endX)) {
                    // can't add sliding doors: selected space has to be between selected sliding doors start and end
                    modal.open('user_modal_23');    
                    return;
              }

              var is_possible = 0;
              for (run_col = from_column; run_col <= to_column; run_col++) { // check is columns contain same level boards
                  for (run_shelf = 1; run_shelf <= model_shelf_array[run_col - 1] + 2; run_shelf++) {
                      if (board[run_col - 1][run_shelf - 1].y + tolerance > startingY && board[run_col - 1][run_shelf - 1].y - tolerance < startingY) {
                          is_possible++;
                      }
                      if (board[run_col - 1][run_shelf - 1].y + tolerance > endingY && board[run_col - 1][run_shelf - 1].y - tolerance < endingY) {
                          is_possible++;
                          run_shelf = model_shelf_array[run_col - 1] + 2;
                      }
                  }
              }

              var length_from_left = (wall[startX - 1].x - wall[from_column - 1].x);
              var length_to_right = (wall[to_column].x - wall[endX].x);

              if ((to_column + 1 - from_column) * 2 !== is_possible) {
                  // to add a sliding door, shelves need to be at the same horizontal position y
                  modal.open('user_modal_24', [from_column, to_column]); 
                  return;
              }

              if (length_from_left < get_width - tolerance && length_to_right < get_width - tolerance) {
                  // not enough space to move sliding door
                  modal.open('user_modal_25'); 
                  return;
              }

              var total_depth = 0;
              for (run_col = from_column; run_col <= to_column; run_col++) {
                  total_depth = total_depth + model_depth_array[run_col - 1];
                  if (model_width_array[run_col - 1] !== model_width_array[run_col - 2] && run_col > 1) {
                      var dif = Math.abs(model_width_array[run_col - 1] - model_width_array[run_col - 2]);
                      if (dif >= tolerance) {
                          // to add a sliding door, width between segments needs to be equal
                          modal.open('user_modal_26',[from_column, to_column]); 
                          return;
                      }
                  }
              }

              if (total_depth !== model_depth_array[from_column - 1] * (to_column + 1 - from_column)) {
                    // to add a sliding door, depth between segments need to be equal
                    modal.open('user_modal_27',[from_column, to_column]); 
                    return;
              }
              
                                 
            if (sliding_door!==null){
                $(sliding_door_div_start).val(sliding_door.startRailing);
                $(sliding_door_div_end).val(sliding_door.endRailing);
            }

              sliding_door = {
                  lowestColumn: lowest_column,
                  lowestSpace: lowest_space,
                  highestColumn: highest_column,
                  highestSpace: highest_space,
                  startDoor: startX,
                  endDoor: endX,
                  startRailing: from_column,
                  endRailing: to_column,
                  texture: texture
              };

              counter = 0;
              var board_start;
              var board_end;
              while (door[counter] != null) {
                  if (x_overlap(from_column, to_column, door[counter].column, door[counter].columnEnd)) { // calls function that test if 2 ranges of integers overlap
                      board_start = board[door[counter].column - 1][door[counter].start - 1].y;
                      board_end = board[door[counter].column - 1][door[counter].end - 1].y;
                      if (x_overlap(board_start, board_end, startingY, endingY) && startingY !== board_end && endingY !== board_start) {
                          if (door[counter].type === 'doubleLEFT') {
                              door.splice(counter, 1); // remove 1st door
                              door.splice(counter, 1); // remove 2nd door
                              counter--;
                          } else if (door[counter].type === 'doubleRIGHT') {
                              door.splice(counter, 1); // remove 1st door
                              door.splice(counter - 1, 1); // remove 2nd door
                              counter = counter - 2;
                          } else {
                              door.splice(counter, 1); // remove 1 door only
                              counter--;
                          }
                      }
                  }
                  counter++;
              }
              break;
          case ('pl'): // shelf adder
              var start = null;
              var end = null;
              var column = 0;

              for (run_col = 1; run_col <= model_columns; run_col++) {
                  for (run_shelf = 1; run_shelf <= model_shelf_array[run_col - 1] + 1; run_shelf++) { // run for every shelf space.
                      if (scene_box_spc[run_col - 1][run_shelf - 1].visibility === visibility_clicked) {
                          start = run_shelf;
                          end = run_shelf + 1;
                          column = run_col;
                          run_col = model_columns; // stop when space found
                          run_shelf = model_shelf_array[model_columns - 1] + 1;
                      }
                  }
              }

              if (start === null) {
                  // select a space to add shelf
                  modal.open('user_modal_28');
                  return;
              }

              var middle_space = board[column - 1][start].y - board[column - 1][start - 1].y - furniture_thickness;
              var created_space = middle_space / 2 - furniture_thickness / 2;

              if (created_space >= minimum_shelf_space) {
                  counter = 0;
                  while (door[counter] != null) { // change existing doors position if the shelf was added in column containing doors
                      if (door[counter].column === column) { // flip doors are placed in reference to only one column, so check only 1
                          if (start < door[counter].start) { // check if shelf was added below doors
                              door[counter].start = door[counter].start + 1;
                              door[counter].end = door[counter].end + 1;
                          }

                          if (door[counter].start <= start && start < (door[counter].end)) { // check if shelf was added inside doors
                              if (door[counter].type === 'drawer') {
                                  // cant add shelf, drawer here
                                  modal.open('user_modal_29');
                                  return;
                              } else {
                                  door[counter].end = door[counter].end + 1;
                              }
                          }
                      }
                      counter++;
                  }

                  counter = 0;
                  while (hanger[counter] != null) {
                      if (hanger[counter].column === column) {
                          if (hanger[counter].space === start) {
                              hanger.splice(counter, 1); // remove hanger if added in the same space
                              counter--;
                          } else if (hanger[counter].space > start) {
                              hanger[counter].space = hanger[counter].space + 1;
                          }
                      }
                      counter++;
                  }

                  counter = 0;
                  while (divider[counter] != null) {
                      if (divider[counter].column === column) {
                          if (divider[counter].space === start) {
                              divider.splice(counter, 1); // remove divider if added in the same space
                              counter--;
                          } else if (divider[counter].space > start) {
                              divider[counter].space = divider[counter].space + 1;
                          }
                      }
                      counter++;
                  }

                  var positionY = board[column - 1][start].y - middle_space / 2;
                  model_shelf_array[column - 1] = model_shelf_array[column - 1] + 1;
                  space_array[column - 1].splice(start - 1, 0, created_space);
                  space_array[column - 1][start] = created_space;
                  board[column - 1].splice(start, 0, (new board_object(column, positionY, furniture_thickness)));

                  for (run_space = 1; run_space <= model_shelf_array[column - 1] + 1; run_space++) {
                      space[column - 1][run_space - 1] = new space_object(column, run_space);
                  }

                  if (sliding_door !== null) { // check if shelf was added to the initial sliding door spot
                      if (sliding_door.lowestColumn === column && sliding_door.lowestSpace > start) {
                          sliding_door.lowestSpace = sliding_door.lowestSpace + 1;
                      }
                      if (sliding_door.highestColumn === column && sliding_door.highestSpace >= start) {
                          sliding_door.highestSpace = sliding_door.highestSpace + 1;
                      }
                  }
              } else {
                  // to small space to add a shelf
                  modal.open('user_modal_30');
                  return;
              }
              break;
          case ('ha'): // hanger
              var start = null;
              var column;

              for (run_col = 1; run_col <= model_columns; run_col++) {
                  for (run_shelf = 1; run_shelf <= model_shelf_array[run_col - 1] + 1; run_shelf++) { // run for every shelf space.
                      if (scene_box_spc[run_col - 1][run_shelf - 1].visibility === visibility_clicked) {
                          start = run_shelf;
                          column = run_col;
                          run_col = model_columns; // stop when space found
                          run_shelf = model_shelf_array[model_columns - 1] + 1;
                      }
                  }
              }

              if (start === null) {
                  // select a space to add hanger
                  modal.open('user_modal_31');
                  return;
              }
              var counter = 0; // !update one global counter
              while (hanger[counter] != null) {
                  if (hanger[counter].column === column && hanger[counter].space === start) {
                      // this space already has a hanger
                      modal.open('user_modal_32');
                      return;
                  }
                  counter++;
              }

              var counter = 0;
              while (divider[counter] != null) {
                  if (divider[counter].column === column && divider[counter].space === start) {
                      // this space has a divider
                      modal.open('user_modal_33');
                      return;
                  }
                  counter++;
              }

              if (object_fit(space_array[column - 1][start - 1], minimum_hanger_height, maximum_model_height) ||
                  object_fit(model_width_array[column - 1], minimum_hanger_width, maximum_space_width) ||
                  object_fit(model_depth_array[column - 1], minimum_hanger_depth, maximum_model_depth)) {
                // hanger dimensions
                modal.open('user_modal_34',[minimum_hanger_height, minimum_hanger_width, minimum_hanger_depth, 
                    space_array[column - 1][start - 1].toFixed(1), model_width_array[column - 1].toFixed(1), model_depth_array[column - 1]]);
                  return;
              }

              var counter = 0;
              while (door[counter] != null) {
                  if (door[counter].type === 'drawer') {
                      if (door[counter].column === column && door[counter].start === start) {
                          // this space has drawer
                           modal.open('user_modal_35');
                          return;
                      }
                  }
                  counter++;
              }
              
              $('#user_modal_49_tube').attr('onclick', 'add_hanger('+column+','+start+','+'\'tube\')'); 
              $('#user_modal_49_runner').attr('onclick', 'add_hanger('+column+','+start+','+'\'runner\')'); 
              modal.open('user_modal_49');
              return;
              break;
          case ('pi'): // pionik
              var start = null;
              var column;

              for (run_col = 1; run_col <= model_columns; run_col++) {
                  for (run_shelf = 1; run_shelf <= model_shelf_array[run_col - 1] + 1; run_shelf++) { // run for every shelf space.
                      if (scene_box_spc[run_col - 1][run_shelf - 1].visibility === visibility_clicked) {
                          start = run_shelf;
                          column = run_col;
                          run_col = model_columns; // stop when space found
                          run_shelf = model_shelf_array[model_columns - 1] + 1;
                      }
                  }
              }

              if (start === null) {
                  // select a space to add a divider
                  modal.open('user_modal_36');
                  return;
              }

              var counter = 0;
              var left_divider_possible = true;
              var right_divider_possible = true;
              var middle_divider_possible = true;
              while (divider[counter] != null) {
                  if (divider[counter].column === column && divider[counter].space === start) {
                      // divider already inside space
                      middle_divider_possible = false;
                      if (divider[counter].position === 'middle'){ // if divider exists in the middle, output error
                        left_divider_possible = false;
                        right_divider_possible = false;
                      }else if (divider[counter].position === 'left'){
                          left_divider_possible = false;
                      }else if (divider[counter].position === 'right') {
                          right_divider_possible = false;
                      }  
                  }
                  counter++;
              }
              
              if (left_divider_possible === false && right_divider_possible === false){
                  modal.open('user_modal_37');
                  return;
              }

              counter = 0;
              while (hanger[counter] != null) {
                  if (hanger[counter].column === column && hanger[counter].space === start) {
                      // hanger inside space
                      modal.open('user_modal_38');
                      return;
                  }
                  counter++;
              }

              // CUBIC - check for cubic
              for (var x=0; x<cubic.length; x++){
                  if (cubic[x].column === column && cubic[x].space === start){
                      modal.open('user_modal_63');
                      return;
                  }
              }

              counter = 0;
              while (door[counter] != null) {
                  if (door[counter].type === 'drawer') {
                      if (door[counter].column === column && door[counter].start === start) {
                          // drawer inside space
                          modal.open('user_modal_39');
                          return;
                      }
                  }
                  counter++;
              }
              
              // get actual space width for current thickness and 1 middle divider
              var min_this_spacewidth = (2*minimum_divider_spacewidth + furniture_thickness).toFixed(1);
              if (parseFloat(space_array[column - 1][start - 1].toFixed(1))<minimum_divider_height){
                  // space height not enough
                  modal.open('user_modal_40', [minimum_divider_height,min_this_spacewidth,
                      space_array[column - 1][start - 1].toFixed(1), model_width_array[column - 1].toFixed(1)]);
                  return;
              }
              

              if (parseFloat(((model_width_array[column - 1]-furniture_thickness)/2).toFixed(1))<minimum_divider_spacewidth){
                  // not enough space to add a middle divider
                  modal.open('user_modal_40', [minimum_divider_height,min_this_spacewidth,
                      space_array[column - 1][start - 1].toFixed(1), model_width_array[column - 1].toFixed(1)]);
                  return;
              }
              
              if ((model_width_array[column - 1]-(2*furniture_thickness))/3<minimum_divider_spacewidth){
                // not enough space to add third space divider
                left_divider_possible = false;
                right_divider_possible = false;
              }
              
              var show = 0;
              if (middle_divider_possible){
                 show++;
                 $('#user_modal_48_mid').show();
                 $('#user_modal_48_mid').attr('onclick', 'add_divider('+column+','+start+','+'\'middle\')'); 
              }else {
                 $('#user_modal_48_mid').hide(); 
              }

              if (left_divider_possible){
                    show++;
                    $('#user_modal_48_left').show();
                    $('#user_modal_48_left').attr('onclick', 'add_divider('+column+','+start+','+'\'left\')'); 
              }else {
                    $('#user_modal_48_left').hide(); 
              }
              
              if (right_divider_possible){
                    show++;
                    $('#user_modal_48_right').show();
                    $('#user_modal_48_right').attr('onclick', 'add_divider('+column+','+start+','+'\'right\')'); 
              }else {
                    $('#user_modal_48_right').hide(); 
              }
              
              if (show===1){
                    $('#user_modal_48_left').attr('class','col s12 t-option1 t-z-depth-1');
                    $('#user_modal_48_mid').attr('class','col s12 t-option1 t-z-depth-1');
                    $('#user_modal_48_right').attr('class','col s12 t-option1 t-z-depth-1');
              }else if (show===2){
                    $('#user_modal_48_left').attr('class','col s6 t-option1 t-z-depth-1');
                    $('#user_modal_48_mid').attr('class','col s6 t-option1 t-z-depth-1');
                    $('#user_modal_48_right').attr('class','col s6 t-option1 t-z-depth-1');
              }else if (show===3){
                    $('#user_modal_48_left').attr('class','col s4 t-option1 t-z-depth-1');
                    $('#user_modal_48_mid').attr('class','col s4 t-option1 t-z-depth-1');
                    $('#user_modal_48_right').attr('class','col s4 t-option1 t-z-depth-1');
               }
                modal.open('user_modal_48');
                return;
              break;
          case ('cu'):
              var start = null;
              var column;

              for (run_col = 1; run_col <= model_columns; run_col++) {
                  for (run_shelf = 1; run_shelf <= model_shelf_array[run_col - 1] + 1; run_shelf++) {
                      if (scene_box_spc[run_col - 1][run_shelf - 1].visibility === visibility_clicked) {
                          start = run_shelf;
                          column = run_col;
                          run_col = model_columns; // stop when space found
                          run_shelf = model_shelf_array[model_columns - 1] + 1;
                      }
                  }
              }

              if (start === null) {
                  // select a space to add a cubic
                  modal.open('user_modal_52');
                  return;
              }

              // CUBIC - check for cubic
              for (var x=0; x<cubic.length; x++){
                  if (cubic[x].column === column && cubic[x].space === start){
                      modal.open('user_modal_59');
                      return;
                  }
              }

              // DIVIDER - check for divider
              for (var x=0; x<divider.length; x++){
                  if (divider[x].column === column && divider[x].space === start){
                      modal.open('user_modal_53');
                      return;
                  }
              }

              // HANGER - check for hanger
              for (var x=0; x<hanger.length; x++){
                  if (hanger[x].column === column && hanger[x].space === start){
                      modal.open('user_modal_54');
                      return;
                  }
              }

              // DOOR - check for doors
              var ex_door_start;
              var ex_door_end
              var startY = board[column - 1][start - 1].y;
              var endY = board[column - 1][start].y;
              for (var x=0; x<door.length;x++){
                  if (x_overlap(door[x].column, door[x].columnEnd, column, column_end)) {
                      ex_door_start = board[door[x].column - 1][door[x].start - 1].y;
                      ex_door_end = board[door[x].column - 1][door[x].end - 1].y;
                      if (x_overlap(ex_door_start, ex_door_end, startY, endY) && startY !== ex_door_end && endY !== ex_door_start) {
                          modal.open('user_modal_58');
                          return;
                      }
                  }
              }

              // check if fits
              if (object_fit(space_array[column - 1][start - 1], minimum_cubic_height, maximum_cubic_height) ||
                  model_width_array[column - 1] < minimum_cubic_width) {
                  modal.open('user_modal_56',[minimum_cubic_height, maximum_cubic_height,
                      minimum_cubic_width, maximum_cubic_width, space_array[column - 1][start - 1].toFixed(1), model_width_array[column - 1].toFixed(1)]);
                  return;
              }

              if (model_width_array[column-1] > maximum_cubic_width){
                  var this_maximum_cubic_width = maximum_cubic_width;
              }else {
                  this_maximum_cubic_width = parseFloat(model_width_array[column-1].toFixed(1));
              }

              if (model_width_array[column-1]>space_array[column-1][start-1]){
                  var this_cubic_width = space_array[column-1][start-1]; // make it square if possible
              }else {
                  this_cubic_width = minimum_cubic_width;
              }


              update_slider('add_cubic', this_cubic_width, minimum_cubic_width, this_maximum_cubic_width);
              global_which = column;
              global_space = start;
              modal.open('user_modal_57',[space_array[column-1][start-1].toFixed(1)]);
              return;
              break;
              // ---------------------------------------------------- STEP THREE ENDS HERE ----------------------------------------------------
              // --------------------------------------------------- STEP FOUR STARTS HERE ---------------------------------------------------
          case ('er'): // furniture elements remover
              // DOOR REMOVER STARTS
              counter = 0;
              while (door[counter] != null) { // search for selected doors
                  if (scene_box_dr[counter].visibility === visibility_clicked_dr) {
                      if (door[counter].type === 'doubleLEFT') {
                          door.splice(counter, 1); // remove 1 door
                          scene_box_dr.splice(counter, 1);
                          door.splice(counter, 1); // remove 1 door
                          scene_box_dr.splice(counter, 1);
                          counter--;
                      } else if (door[counter].type === 'doubleRIGHT') {
                          door.splice(counter, 1); // remove 1 door
                          scene_box_dr.splice(counter, 1);
                          door.splice(counter - 1, 1); // remove 1 door
                          scene_box_dr.splice(counter - 1, 1);
                          counter = counter - 2;
                      } else {
                          door.splice(counter, 1); // remove 1 door
                          scene_box_dr.splice(counter, 1);
                          counter--;
                      }
                  }
                  counter++;
              }
              // DOOR REMOVER ENDS

              // HANGER REMOVER STARTS
              counter = 0;
              while (hanger[counter] != null) { // search for selected hanger
                  if (scene_box_hng[counter].visibility === visibility_clicked_dr) {
                      hanger.splice(counter, 1);
                      scene_box_hng.splice(counter, 1);
                      counter--;
                  }
                  counter++;
              }
              // HANGER REMOVER ENDS

              // DIVIDER REMOVER STARTS
              counter = 0;
              while (divider[counter] != null) { // search for selected divider
                  if (scene_box_divi[counter].visibility === visibility_clicked_dr) {
                      divider.splice(counter, 1);
                      scene_box_divi.splice(counter, 1);
                      counter--;
                  }
                  counter++;
              }
              // DIVIDER REMOVER ENDS

              // CUBIC REMOVER STARTS
              for (var x=0;x<cubic.length;x++){
                  var box_index = x*4;
                  if (scene_box_cubi[box_index].visibility === visibility_clicked_dr) {
                      cubic.splice(x, 1);
                      scene_box_cubi.splice(box_index, 4);
                      x--;
                  }
              }
              // CUBIC REMOVER ENDS

              // SHELF REMOVER STARTS
              var board_column;
              for (run_col = 1; run_col <= model_columns; run_col++) { // search for selected shelves
                  for (run_shelf = 2; run_shelf <= model_shelf_array[run_col - 1] + 1; run_shelf++) {
                      if (scene_box_brd[run_col - 1][run_shelf - 1].visibility === visibility_clicked) {
                          if (sliding_door !== null) {
                                var boardPos = board[run_col - 1][run_shelf - 1].y; // get removed board position for sliding door checkup
                                var slidingEnd = board[sliding_door.highestColumn - 1][sliding_door.highestSpace].y;
                                var slidingStart = board[sliding_door.lowestColumn - 1][sliding_door.lowestSpace - 1].y;
                          }
                          object_remover(run_col, run_shelf - 1); // remove doors below and above
                          scene_box_brd[run_col - 1].splice(run_shelf - 1, 1);
                          board_column = run_col;
                          board[run_col - 1].splice(run_shelf - 1, 1);
                          model_shelf_array[run_col - 1] = model_shelf_array[run_col - 1] - 1;
                          space_array[run_col - 1][run_shelf - 2] = space_array[run_col - 1][run_shelf - 2] + space_array[run_col - 1][run_shelf - 1] + furniture_thickness;
                          space_array[run_col - 1].splice(run_shelf - 1, 1);
                          space[run_col - 1] = [];
                          for (run_space = 1; run_space <= model_shelf_array[run_col - 1] + 2; run_space++) {
                              space[run_col - 1][run_space - 1] = new space_object(run_col, run_space);
                          }
                          counter = 0;
                          while (door[counter] != null) { // change existing doors position if the shelf was removed from column containing doors
                              if (door[counter].column === run_col) {
                                  if (run_shelf < door[counter].start) {
                                      door[counter].start = door[counter].start - 1;
                                      door[counter].end = door[counter].end - 1;
                                  }
                              }
                              counter++;
                          }
                          counter = 0;
                          while (hanger[counter] != null) {
                              if (hanger[counter].column === run_col) {
                                  if (run_shelf < hanger[counter].space) {
                                      hanger[counter].space = hanger[counter].space - 1;
                                  }
                              }
                              counter++;
                          }
                          counter = 0;
                          while (divider[counter] != null) {
                              if (divider[counter].column === run_col) {
                                  if (run_shelf < divider[counter].space) {
                                      divider[counter].space = divider[counter].space - 1;
                                  }
                              }
                              counter++;
                          }
                          counter = 0;
                          while (cubic[counter] != null) {
                              if (cubic[counter].column === run_col) {
                                  if (run_shelf < cubic[counter].space) {
                                      cubic[counter].space = cubic[counter].space - 1;
                                  }
                              }
                              counter++;
                          }
                          if (sliding_door !== null) { // Check if shelf was removed from the column that contains shelf
                              if (x_overlap(sliding_door.startRailing, sliding_door.endRailing, run_col, run_col)) { // calls function that test if 2 ranges of integers overlap
                                  if (boardPos === slidingStart || boardPos === slidingEnd) { // if removed shelf was supporting rail
                                      sliding_door = null;
                                  } else { // update the sliding door position
                                      if (sliding_door.lowestColumn === run_col && sliding_door.lowestSpace > run_shelf) {
                                          sliding_door.lowestSpace = sliding_door.lowestSpace - 1;
                                      }
                                      if (sliding_door.highestColumn === run_col && sliding_door.highestSpace > run_shelf) {
                                          sliding_door.highestSpace = sliding_door.highestSpace - 1;
                                      }
                                  }
                              }
                          }
                          run_shelf--;
                      }
                  }
              }

              if (sliding_door !== null) { // check if sliding door was selected
                  if (scene_box_sld.visibility === visibility_clicked) {
                      sliding_door = null;
                  }
              }
              // SHELF REMOVER ENDS
              break;
              // --------------------------------------------------- STEP FOUR ENDS HERE ---------------------------------------------------    
              // --------------------------------------------------- STEP FIVE STARTS HERE ---------------------------------------------------
          //case ('ff'): // is model free standing?
          //    if ($('#user_free_furniture').is(':checked')) {
          //        model_standingByWall = 'tak';
          //    } else {
          //        model_standingByWall = 'nie';
          //    }
          //    break;
          case ('tt'): // tabletop mode
              if ($('#user_tabletop').is(':checked')) {
                  model_tabletop = 'over';
              } else {
                  model_tabletop = 'between';
              }
              break;
              // --------------------------------------------------- STEP FIVE ENDS HERE ---------------------------------------------------
          default:
              console.log('user decision failure');
      }
      scene.dispose();
      scene = null; // clear the scene
      scene = createScene(); // recreate the scene
  }
  
  function add_doors(column, start, end, type, active_texture, column_end, open){
      door.push(new door_object(column, start, end, type, active_texture, column_end, open));
      scene.dispose();
      scene = null; // clear the scene
      scene = createScene(); // recreate the scene
      modal.close();
  }
   
  function add_divider(column, start, position){
    divider.push(new divider_object(column, start, position));
    scene.dispose();
    scene = null;
    scene = createScene();
    modal.close();
  }
  
  function add_hanger(column, start, type){
    hanger.push(new hanger_object(column, start, type));
    scene.dispose();
    scene = null;
    scene = createScene();
    modal.close();
  }

  function add_cubic(){
      var width_id = document.getElementById('user_add_slider_cubic');
      var width = parseFloat(width_id.noUiSlider.get());
      cubic.push(new Cubic_Object(global_which, global_space, width, '9003'));
      scene.dispose();
      scene = null;
      scene = createScene();
      modal.close();
  }

  function add_sliding(){
    if (model_columns === 1){
        // more than 1 columns required to add a sliding door
        modal.open('user_modal_51');
        return;
    }
    
    var selected = false;
    for (run_col = 1; run_col <= model_columns; run_col++) {
        for (run_shelf = 1; run_shelf <= model_shelf_array[run_col - 1] + 1; run_shelf++) {
            if (scene_box_spc[run_col - 1][run_shelf - 1].visibility === visibility_clicked) {
                if (selected === false) {
                    selected = true;
                    break;
                }
            }
        }
    }
    if (selected===false){
        modal.open('user_modal_21');
        return;
    }
         
    var sliding_door_div='#sliding_door_select_start';
    var sliding_door_div_end='#sliding_door_select_end';
    
    $(sliding_door_div).empty();
    $(sliding_door_div_end).empty();

    for (var run_col=1;run_col<=model_columns;run_col++){
        if (run_col<model_columns){
            $(sliding_door_div).append('<option value="'+run_col+'">'+ global_text['from column'] +' '+run_col+'</option>');
        }
        if(run_col>1){
            $(sliding_door_div_end).append('<option value="'+run_col+'">'+global_text['to column']+' '+run_col+'</option>');
            $(sliding_door_div_end).val(run_col);
        }
    }
    
    modal.open('user_modal_50');
  }

  function normalize(number, times, mode) {
      var normalized_array = [];
      var subtract = 0;
      var normalized;
      var rest;
      var normalized_sum;

      switch (mode) {
          case ('width'):
              normalized = (((number) - furniture_thickness) / times) - furniture_thickness;
              normalized = round(normalized, 2);
              break;
          case ('shelf'): //height=number, times=shelves
              normalized = (number - sockle_height - furniture_thickness * (times + 2)) / (times + 1);
              normalized = round(normalized, 2);
              rest = (normalized * (times + 1) + (furniture_thickness * (times + 2)));
              subtract = number - sockle_height - rest;
              times++;
              break;
          default:
              console.log('no mode in normalize');
              return;
      }

      for (x = 1; x <= times; x++) {
          if (x < times) { // push reduced number
              normalized_array.push(normalized);
          } else { // push bigger number
              normalized_sum = normalized + subtract;
              normalized_array.push(normalized_sum);
          }
      }

      return normalized_array;
  }

  /* global BABYLON, box, board, scene_box, wall, scene_box_spc, scene_box_dr, backwall, wall_e, model_height_array, model_shelf_array, model_depth_array, model_width_array, space_array, space, sockle, door, scene_box_brd, materialbox2, sockle_height, scene_box_sld, minimum_flap_width, maximum_flap_width, minimum_flap_height, maximum_flap_height, minimum_columns, scene_box_hng, scene_box_divi, tabletop, modal */
  var canvas = document.getElementById("renderCanvas");

  if ($('#admin_save_btn').length){
      var engine = new BABYLON.Engine(canvas, true, {preserveDrawingBuffer:true});
      console.log('Screenshotting enabled');
  }else {
      engine = new BABYLON.Engine(canvas, true);
  }

  var createScene = function() {
      var scene = new BABYLON.Scene(engine);
      scene.clearColor = new BABYLON.Color4(0, 0, 0, 0.0000000000000001); //transparent background

      // MATERIAL - BASIC MATERIAL
      var materialbox1 = new BABYLON.StandardMaterial("active_texture", scene);
      materialbox1.diffuseTexture = new BABYLON.Texture(textures_dest + active_texture + '.jpg', scene);
      materialbox1.specularColor = new BABYLON.Color3.Black();

      // MATERIAL - BASIC MATERIAL
      var materialbox1Horizontal = new BABYLON.StandardMaterial("active_texture", scene);
      materialbox1Horizontal.diffuseTexture = new BABYLON.Texture(textures_dest + active_texture+'.jpg', scene);
      materialbox1Horizontal.specularColor = new BABYLON.Color3.Black();
      materialbox1Horizontal.diffuseTexture.wAng = 0.5*Math.PI;

      if (sliding_door != null) {
          var materialSLIDINGdoor = new BABYLON.StandardMaterial("active_texture", scene);
          materialSLIDINGdoor.diffuseTexture = new BABYLON.Texture(textures_dest + sliding_door.texture+'.jpg', scene);
          materialSLIDINGdoor.specularColor = new BABYLON.Color3.Black();
          materialSLIDINGdoor.diffuseTexture.wAng = 0.5*Math.PI;
      }

      // MATERIAL - RAILING MATERIAL
      var materialRAILING = new BABYLON.StandardMaterial("active_door_texture", scene);
      materialRAILING.diffuseTexture = new BABYLON.Texture('textures/rail.jpg', scene);
      
      // MATERIAL - BLACK METAL
      var materialBLACK = new BABYLON.StandardMaterial("black_metal", scene);
      materialBLACK.diffuseTexture = new BABYLON.Texture('textures/black_metal.jpg', scene);

      // MATERIAL - DRAWER MATERIAL
      var materialDrawer = new BABYLON.StandardMaterial("drawer", scene);
      materialDrawer.diffuseTexture = new BABYLON.Texture('textures/9003.jpg', scene);

      // MATERIAL - BACKWALL MATERIAL
      var materialBACKWALL = new BABYLON.StandardMaterial("active_backwall_texture", scene);
      materialBACKWALL.diffuseTexture = new BABYLON.Texture(textures_dest + active_backwall_texture+'.jpg', scene);
      materialBACKWALL.specularColor = new BABYLON.Color3.Black();
      materialBACKWALL.diffuseTexture.wAng = 0.5*Math.PI;

      //MATERIAL - SELECTED STARTS
      var materialbox2 = new BABYLON.StandardMaterial("selected-blue", scene);
      materialbox2.diffuseTexture = new BABYLON.Texture("textures/selected.jpg", scene);
      materialbox2.emissiveColor = new BABYLON.Color3(1, 1, 1);
      materialbox2.specularColor = new BABYLON.Color3.Black(); // turn off light specular
      materialbox2.alpha = 1;

      //BOARD - SELECTED STARTS
      var materialbox3 = new BABYLON.StandardMaterial("selected-blue", scene);
      materialbox3.diffuseTexture = new BABYLON.Texture("textures/selected.jpg", scene);
      materialbox3.emissiveColor = new BABYLON.Color3(1, 1, 1);
      materialbox3.specularColor = new BABYLON.Color3.Black(); // turn off light specular
      materialbox3.alpha = 0.7;

      // set new globals on every scene
      var scene_box = [];
      scene_box_spc = [];
      scene_box_dr = [];
      scene_box_hng = [];
      scene_box_divi = [];
      scene_box_cubi = [];
      //scene_box_glass = [];
      wall = [];
      wall_e = [];
      tabletop = [];
      sockle = [];
      backwall = [];
      scene_box_brd = [];

      wall_builder();

      function wall_builder() {
          for (run_col = 0; run_col <= model_columns; run_col++) {
              if (run_col === 0) { // build first wall
                  wall[run_col] = new wall_object(model_height_array[run_col], model_depth_array[run_col], furniture_thickness, run_col);
                  backwall[run_col] = new backwall_object(run_col + 1);
              }
              if (run_col < model_columns && run_col > 0) { // build inner walls (2 simple stages)
                  if (model_height_array[run_col] <= model_height_array[run_col - 1]) { // if this height is <= previous height
                      if (model_depth_array[run_col - 1] >= model_depth_array[run_col]) { // if this depth <=  previous depth
                          wall[run_col] = new wall_object(model_height_array[run_col - 1], model_depth_array[run_col - 1], furniture_thickness, run_col);
                      } else { // if this depth > previous depth
                          var difference_in_height = model_height_array[run_col - 1] - model_height_array[run_col];
                          var depth = model_depth_array[run_col - 1];
                          wall[run_col] = new wall_object(model_height_array[run_col], model_depth_array[run_col], furniture_thickness, run_col); // CHANGED TO 2
                          if (model_height_array[run_col] < model_height_array[run_col - 1]) { // skip making wall-e if this column height equals previous one.
                              wall_e.push(new wall_e_object(run_col + 1, difference_in_height, depth));
                          }
                      }
                  } else { // if this height is > previous height
                      if (model_depth_array[run_col - 1] > model_depth_array[run_col]) {
                          var difference_in_height = model_height_array[run_col] - model_height_array[run_col - 1];
                          var depth = model_depth_array[run_col];
                          wall[run_col] = new wall_object(model_height_array[run_col - 1], model_depth_array[run_col - 1], furniture_thickness, run_col);
                          wall_e.push(new wall_e_object(run_col + 1, difference_in_height, depth));
                      } else {
                          wall[run_col] = new wall_object(model_height_array[run_col], model_depth_array[run_col], furniture_thickness, run_col);
                      }
                  }
                  backwall[run_col] = new backwall_object(run_col + 1);
              }
              if (run_col === model_columns) { // build last wall
                  wall[run_col] = new wall_object(model_height_array[run_col - 1], model_depth_array[run_col - 1], furniture_thickness, run_col); //!update, remove furniture_thickness
              }

          }
      }

      tabletop_builder();

      function tabletop_builder() {
          if (model_tabletop === 'over') {
              var temp_tabletops = [0, 1];

              for (var x = 1; x < model_columns; x++) {
                  var get_start = temp_tabletops[temp_tabletops.length - 2];
                  var get_end = temp_tabletops[temp_tabletops.length - 1];
                  var tabletop_width = wall[get_end+1].x - wall[get_start].x;

                  if (tabletop_width <= maximum_tabletop && model_depth_array[x - 1] === model_depth_array[x] && model_height_array[x - 1] === model_height_array[x]) {
                      temp_tabletops[temp_tabletops.length - 1]++;
                  } else {
                      temp_tabletops.push(get_end, get_end + 1);
                  }
              }
              

              var tabletops_number = temp_tabletops.length;
              for (var run_tabletops = 0; run_tabletops < tabletops_number; run_tabletops += 2) { // step = 2
                  var start = temp_tabletops[run_tabletops];
                  var end = temp_tabletops[run_tabletops + 1];
                  var start_reduced = wall[start].reduced;

                  var this_height = model_height_array[start];
                  if (start !== 0) {
                      var prev_height = model_height_array[start - 1];
                  }
                  if (end !== model_columns) {
                      var next_height = model_height_array[end];
                  }

                  if (start === 0) {
                      var cover_left = true;
                  } else {
                      if (start_reduced && (tabletop[tabletop.length - 1].cover !== 'RIGHT' && tabletop[tabletop.length - 1].cover !== 'BOTH')) {
                          var cover_left = true;
                      } else if (this_height > prev_height) { // fix for wall-e
                          var cover_left = true;
                      } else {
                          var cover_left = false;
                      }
                  }

                  if (end === model_columns) {
                      var cover_right = true;
                  } else {
                      var cover_right = (this_height > next_height) ? true : false;
                  }

                  if (cover_left === true && cover_right === true) {
                      var cover = 'BOTH';
                  } else if (cover_left === false && cover_right === false) {
                      var cover = 'NONE';
                  } else if (cover_left === true && cover_right === false) {
                      var cover = 'LEFT';
                  } else if (cover_left === false && cover_right === true) {
                      var cover = 'RIGHT';
                  }

                  tabletop.push(new tabletop_object(start, end, cover));
              }

          } else {
              for (var run_tabletops = 0; run_tabletops < model_columns; run_tabletops++) {
                  tabletop.push(new tabletop_object(run_tabletops, run_tabletops + 1, 'NONE')); // !updated fixed bug
              }
          }
      }

      if (sockle_height > 0) {
          sockle_builder();
      }

      function sockle_builder() {
          for (run_col = 1; run_col <= model_columns; run_col++) {
              sockle[run_col - 1] = new sockle_object(run_col);
          }
      }

      model_builder('wall');
      model_builder('sockle');
      model_builder('backwall');
      model_builder('tabletop');

      function model_builder(what) {
          var counter = 0;
          while (this[what][counter]) {
              scene_box.push(BABYLON.MeshBuilder.CreateBox('box', {
                  height: this[what][counter].height,
                  width: this[what][counter].thickness,
                  depth: this[what][counter].depth
              }, scene));
              scene_box[scene_box.length - 1].position.x = this[what][counter].x;
              scene_box[scene_box.length - 1].position.y = this[what][counter].y;
              scene_box[scene_box.length - 1].position.z = this[what][counter].z;

              if (what === 'backwall') {
                  scene_box[scene_box.length - 1].material = materialBACKWALL;
              } else if (what === 'tabletop') {
                  scene_box[scene_box.length - 1].material = materialbox1Horizontal;
              } else {
                  scene_box[scene_box.length - 1].material = materialbox1;
              }
              counter++;
          }
      }


      // WALL-E
      wall_e_builder();

      function wall_e_builder() {
          var counter = 0;
          while (wall_e[counter]) {
              scene_box.push(null);
              scene_box[scene_box.length - 1] = BABYLON.MeshBuilder.CreateBox('box', {
                  height: wall_e[counter].height,
                  width: wall_e[counter].thickness,
                  depth: wall_e[counter].depth
              }, scene);
              scene_box[scene_box.length - 1].position.x = wall_e[counter].x;
              scene_box[scene_box.length - 1].position.y = wall_e[counter].y;
              scene_box[scene_box.length - 1].position.z = wall_e[counter].z;
              scene_box[scene_box.length - 1].material = materialbox1;
              counter++;
          }
      }

      // LOAD OBJECTS - PART 2 - STARTS
      if ($('#load').length) {
          var counter = 0;
          var temp_string;
          var temp_array;
          while ($('#load_door_object_' + counter).length) {
              temp_string = $('#load_door_object_' + counter).html();
              temp_array = temp_string.split(',');
              temp_array[0] = parseInt(temp_array[0]);
              temp_array[1] = parseInt(temp_array[1]);
              temp_array[2] = parseInt(temp_array[2]);
              temp_array[5] = parseInt(temp_array[5]);
              door.push(new door_object(temp_array[0], temp_array[1], temp_array[2], temp_array[3], temp_array[4], temp_array[5], temp_array[6])); //column,start,end,type,texture, open
              counter++;
          }
          var counter = 0;
          while ($('#load_hanger_object_' + counter).length) {
              temp_string = $('#load_hanger_object_' + counter).html();
              temp_array = temp_string.split(',');
              temp_array[0] = parseInt(temp_array[0]);
              temp_array[1] = parseInt(temp_array[1]);
              hanger.push(new hanger_object(temp_array[0], temp_array[1], temp_array[2])); //column, space, type
              counter++;
          }
          var counter = 0;
          while ($('#load_divider_object_' + counter).length) {
              temp_string = $('#load_divider_object_' + counter).html();
              temp_array = temp_string.split(',');
              temp_array[0] = parseInt(temp_array[0]);
              temp_array[1] = parseInt(temp_array[1]);
              divider.push(new divider_object(temp_array[0], temp_array[1], temp_array[2])); //column, space, position
              counter++;
          }
          var counter = 0;
          while ($('#load_cubic_object_' + counter).length) {
              temp_string = $('#load_cubic_object_' + counter).html();
              temp_array = temp_string.split(',');
              temp_array[0] = parseInt(temp_array[0]);
              temp_array[1] = parseInt(temp_array[1]);
              temp_array[2] = parseFloat(temp_array[2]);
              cubic.push(new Cubic_Object(temp_array[0], temp_array[1], temp_array[2], temp_array[3], temp_array[4])); //column, space, width, texture
              counter++;
          }
          $('#load').remove(); // remove load data
      }
      // LOAD OBJECTS - PART 2 - ENDS

      var materialDOORS = [];
      var counter = 0;
      while (door[counter] != null) {
          if (door[counter].texture==='glass'){
              materialDOORS[counter] = new BABYLON.StandardMaterial("active_door_texture", scene);
              materialDOORS[counter].diffuseTexture = new BABYLON.Texture(textures_dest + door[counter].texture+'.jpg', scene);
              materialDOORS[counter].alpha = 0.6;
              //materialDOORS[counter].specularColor = new BABYLON.Color3.Black();
              //materialDOORS[counter].diffuseTexture.wAng = 0.5*Math.PI;
              counter++;
          }else {
              materialDOORS[counter] = new BABYLON.StandardMaterial("active_door_texture", scene);
              materialDOORS[counter].diffuseTexture = new BABYLON.Texture(textures_dest + door[counter].texture+'.jpg', scene);
              materialDOORS[counter].specularColor = new BABYLON.Color3.Black();
              materialDOORS[counter].diffuseTexture.wAng = 0.5*Math.PI;
              counter++;
          }

      }

      var materialCUBIC = [];
      var materialCUBIC2 = [];
      for (var x=0; x<cubic.length;x++){
          materialCUBIC[x] = new BABYLON.StandardMaterial("cubic", scene);
          materialCUBIC2[x] = new BABYLON.StandardMaterial("cubic", scene);
          materialCUBIC[x].diffuseTexture = new BABYLON.Texture(textures_dest + cubic[x].texture+'.jpg', scene);
          materialCUBIC2[x].diffuseTexture = new BABYLON.Texture(textures_dest + cubic[x].texture+'.jpg', scene);

          materialCUBIC[x].specularColor = new BABYLON.Color3.Black();
          materialCUBIC2[x].specularColor = new BABYLON.Color3.Black();
          materialCUBIC2[x].diffuseTexture.wAng = 0.5*Math.PI;
      }

      if (hanger != null) {
          hanger_builder();
      }

      function hanger_builder() {
          var actionHANGER = function(evt) {
              var box = evt.source.name;
              var dblclicked;
              if (scene_box_hng[box].material === materialbox2 && scene_box_hng[box].visibility === visibility_clicked_dr) {
                  dblclicked = 'yes';
              } else {
                  dblclicked = 'no';
              }

              if (dblclicked === 'no') {
                  scene_box_hng[box].material = materialbox2;
                  scene_box_hng[box].visibility = visibility_clicked_dr;
              } else {
                  scene_box_hng[box].material = materialbox2;
                  scene_box_hng[box].visibility = 0;
              }
          };

          var ActionHANGERover = function(evt) {
              var box = evt.source.name;
              if (scene_box_hng[box].material === materialbox2 && scene_box_hng[box].visibility === visibility_clicked_dr) {} else {
                  scene_box_hng[box].visibility = visibility_mouseover;
                  scene_box_hng[box].material = materialbox2;
              }
          };

          var ActionHANGERout = function(evt) {
              var box = evt.source.name;
              if (scene_box_hng[box].material === materialbox2 && scene_box_hng[box].visibility === visibility_clicked_dr) {
                  scene_box_hng[box].material = materialbox2;
                  scene_box_hng[box].visibility = visibility_clicked_dr;
              } else {
                  scene_box_hng[box].material = materialbox2;
                  scene_box_hng[box].visibility = 0;
              }
          };

          // hanger action manager options
          var executeActionHANGER = new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnPickTrigger, actionHANGER);
          var executeActionHANGERover = new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnPointerOverTrigger, ActionHANGERover);
          var executeActionHANGERout = new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnPointerOutTrigger, ActionHANGERout);
          var actionManagerHANGER = new BABYLON.ActionManager(scene);
          actionManagerHANGER.registerAction(executeActionHANGER);
          actionManagerHANGER.registerAction(executeActionHANGERover);
          actionManagerHANGER.registerAction(executeActionHANGERout);

          counter = 0;
          while (hanger[counter] != null) {
              if (hanger[counter].type === 'tube' ){
                var temp_tube_length = [];
                var radius = 1.25;
                var distance = 7 + furniture_thickness / 2;
                var depth = -model_depth_array[hanger[counter].column - 1] / 2;
                temp_tube_length[0] = new BABYLON.Vector3(wall[hanger[counter].column - 1].x, board[hanger[counter].column - 1][hanger[counter].space].y - radius - distance, depth);
                temp_tube_length[1] = new BABYLON.Vector3(wall[hanger[counter].column].x, board[hanger[counter].column - 1][hanger[counter].space].y - radius - distance, depth);
                scene_box.push(BABYLON.Mesh.CreateTube(counter, temp_tube_length, radius, 60, null, 0, scene, false, BABYLON.Mesh.FRONTSIDE));
                scene_box[scene_box.length - 1].material = materialRAILING;
                //LEFT RING
                temp_tube_length[0] = new BABYLON.Vector3(wall[hanger[counter].column - 1].x, board[hanger[counter].column - 1][hanger[counter].space].y - radius - distance, depth);
                temp_tube_length[1] = new BABYLON.Vector3(wall[hanger[counter].column - 1].x + 2, board[hanger[counter].column - 1][hanger[counter].space].y - radius - distance, depth);
                scene_box.push(BABYLON.Mesh.CreateTube(counter + 'L', temp_tube_length, radius + 1, 60, null, BABYLON.Mesh.CAP_ALL, scene, false, BABYLON.Mesh.FRONTSIDE));
                scene_box[scene_box.length - 1].material = materialRAILING;
                //RIGHT RING
                temp_tube_length[0] = new BABYLON.Vector3(wall[hanger[counter].column].x, board[hanger[counter].column - 1][hanger[counter].space].y - radius - distance, depth);
                temp_tube_length[1] = new BABYLON.Vector3(wall[hanger[counter].column].x - 2, board[hanger[counter].column - 1][hanger[counter].space].y - radius - distance, depth);
                scene_box.push(BABYLON.Mesh.CreateTube(counter + 'R', temp_tube_length, radius + 1, 60, null, BABYLON.Mesh.CAP_ALL, scene, false, BABYLON.Mesh.FRONTSIDE));
                scene_box[scene_box.length - 1].material = materialRAILING;   
                
                scene_box_hng.push(BABYLON.MeshBuilder.CreateBox(counter, {
                    height: 10,
                    width: model_width_array[hanger[counter].column - 1],
                    depth: 10
                }, scene));

                scene_box_hng[counter].material = materialbox2;
                scene_box_hng[counter].visibility = 0;
                scene_box_hng[counter].position.x = wall[hanger[counter].column - 1].x+model_width_array[hanger[counter].column - 1]/2;
                scene_box_hng[counter].position.y = board[hanger[counter].column - 1][hanger[counter].space].y - radius - distance;
                scene_box_hng[counter].position.z = depth;
              }else if (hanger[counter].type === 'runner'){
                  var runner = {
                      depth : 32,
                      click_depth : 32+10,
                      height : 1.8,
                      click_height : 10,
                      width : 1.8,
                      height2: 2.3,
                      depth2: 2,
                      x : 1.8/2 + wall[hanger[counter].column - 1].x+furniture_thickness/2 + model_width_array[hanger[counter].column - 1]/2,
                      y : -1.8/2 + board[hanger[counter].column - 1][hanger[counter].space].y-board[hanger[counter].column - 1][hanger[counter].space].thickness/2,
                      z : -model_depth_array[hanger[counter].column - 1]/2
                  };
                  
                scene_box.push(BABYLON.MeshBuilder.CreateBox(counter, {
                    height: runner['height'],
                    width: runner['width'],
                    depth: runner['depth']
                }, scene));
                scene_box[scene_box.length - 1].position.x = runner['x'];
                scene_box[scene_box.length - 1].position.y = runner['y']-1;
                scene_box[scene_box.length - 1].position.z = runner['z'];
                scene_box[scene_box.length - 1].material = materialRAILING; 
                
                scene_box.push(BABYLON.MeshBuilder.CreateBox(counter+'F', {
                    height: runner['height2'],
                    width: runner['height2'],
                    depth: runner['depth2']
                }, scene));
                scene_box[scene_box.length - 1].position.x = runner['x'];
                scene_box[scene_box.length - 1].position.y = runner['y'];
                scene_box[scene_box.length - 1].position.z = runner['z']-runner['depth']/2;
                scene_box[scene_box.length - 1].material = materialBLACK;    
                
                scene_box.push(BABYLON.MeshBuilder.CreateBox(counter+'B', {
                    height: runner['height2'],
                    width: runner['height2'],
                    depth: runner['depth2']
                }, scene));
                scene_box[scene_box.length - 1].position.x = runner['x'];
                scene_box[scene_box.length - 1].position.y = runner['y'];
                scene_box[scene_box.length - 1].position.z = runner['z']+runner['depth']/2;
                scene_box[scene_box.length - 1].material = materialBLACK; 
                        
                scene_box_hng.push(BABYLON.MeshBuilder.CreateBox(counter, {
                    height: runner['click_height'],
                    width: runner['click_height'],
                    depth: runner['click_depth']
                }, scene));

                scene_box_hng[counter].material = materialbox2;
                scene_box_hng[counter].visibility = 0;
                scene_box_hng[counter].position.x = runner['x'];
                scene_box_hng[counter].position.y = runner['y']-runner['click_height']/2+runner['height']/2;
                scene_box_hng[counter].position.z = runner['z'];
              }
              if (step===9 || step === 4){
                  scene_box_hng[counter].actionManager = actionManagerHANGER;
              }
              counter++;
          }
      }
      

      board_meshes();

      function board_meshes() { // BOARDS
          var actionBOARD = function(evt) {
              var mesh_name = evt.source.name;
              var box = mesh_name.split(',');
              var dblclicked;

              if (scene_box_brd[box[0] - 1][box[1] - 1].material === materialbox2 && scene_box_brd[box[0] - 1][box[1] - 1].visibility === visibility_clicked) { // if clicked, set var as 'yes'
                  dblclicked = 'yes';
              } else {
                  dblclicked = 'no';
              }

              if (dblclicked === 'no') {
                  scene_box_brd[box[0] - 1][box[1] - 1].material = materialbox2;
                  scene_box_brd[box[0] - 1][box[1] - 1].visibility = visibility_clicked;
              } else {
                  scene_box_brd[box[0] - 1][box[1] - 1].material = materialbox1Horizontal;
                  scene_box_brd[box[0] - 1][box[1] - 1].visibility = 1;
              }
          };

          var actionBOARDover = function(evt) {
              var mesh_name = evt.source.name;
              var box = mesh_name.split(',');
              if (scene_box_brd[(box[0] - 1)][box[1] - 1].material === materialbox2) {
                  scene_box_brd[(box[0] - 1)][box[1] - 1].visibility = visibility_clicked;
              } else {
                  scene_box_brd[(box[0] - 1)][box[1] - 1].material = materialbox2;
                  scene_box_brd[(box[0] - 1)][box[1] - 1].visibility = visibility_mouseover;
              }
          };

          var actionBOARDout = function(evt) { // mouse OUT
              var mesh_name = evt.source.name;
              var box = mesh_name.split(',');
              if (scene_box_brd[(box[0] - 1)][box[1] - 1].material === materialbox2 && scene_box_brd[(box[0] - 1)][box[1] - 1].visibility === visibility_clicked) {
                  scene_box_brd[(box[0] - 1)][box[1] - 1].material = materialbox2;
                  scene_box_brd[(box[0] - 1)][box[1] - 1].visibility = visibility_clicked;
              } else {
                  scene_box_brd[(box[0] - 1)][box[1] - 1].material = materialbox1Horizontal;
                  scene_box_brd[(box[0] - 1)][box[1] - 1].visibility = 1;
              }
          };

          // board action manager options
          var executeActionBOARD = new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnPickTrigger, actionBOARD);
          var executeActionBOARDover = new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnPointerOverTrigger, actionBOARDover);
          var executeActionBOARDout = new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnPointerOutTrigger, actionBOARDout);
          var actionManagerBOARD = new BABYLON.ActionManager(scene);
          actionManagerBOARD.registerAction(executeActionBOARD);
          actionManagerBOARD.registerAction(executeActionBOARDover);
          actionManagerBOARD.registerAction(executeActionBOARDout);

          for (run_col = 1; run_col <= model_columns; run_col++) {
              scene_box_brd[run_col - 1] = [];
              for (run_shelf = 1; run_shelf <= model_shelf_array[run_col - 1] + 1; run_shelf++) {
                  scene_box_brd[run_col - 1][run_shelf - 1] = BABYLON.MeshBuilder.CreateBox(run_col + ',' + run_shelf, {
                      height: furniture_thickness,
                      width: model_width_array[run_col - 1],
                      depth: board[run_col - 1][run_shelf - 1].depth
                  }, scene);
                  scene_box_brd[run_col - 1][run_shelf - 1].position.x = wall[run_col - 1].x + model_width_array[run_col - 1] / 2 + board[run_col - 1][run_shelf - 1].thickness / 2;
                  scene_box_brd[run_col - 1][run_shelf - 1].position.y = board[run_col - 1][run_shelf - 1].y;
                  scene_box_brd[run_col - 1][run_shelf - 1].position.z = board[run_col - 1][run_shelf - 1].z;
                  scene_box_brd[run_col - 1][run_shelf - 1].material = materialbox1Horizontal;
                  if (step === 4 && run_shelf !== 1 && run_shelf !== model_shelf_array[run_col - 1] + 2) {
                      scene_box_brd[run_col - 1][run_shelf - 1].actionManager = actionManagerBOARD;
                  }
              }
          }
      }

      if (sliding_door !== null) { // save summary the same
          scene_box_sld = null;
          sliding_door_builder();
      }

      function sliding_door_builder() {
          var actionSLIDING = function() {
              var dblclicked;
              if (scene_box_sld.material === materialbox2 && scene_box_sld.visibility === visibility_clicked) {
                  dblclicked = 'yes';
              } else {
                  dblclicked = 'no';
              }

              if (dblclicked === 'no') {
                  scene_box_sld.material = materialbox2;
                  scene_box_sld.visibility = visibility_clicked;
              } else {
                  scene_box_sld.material = materialbox1Horizontal;
                  scene_box_sld.visibility = 1;
              }
          };

          var actionSLIDINGover = function() {
              if (scene_box_sld.material === materialbox2) {
                  scene_box_sld.visibility = visibility_clicked;
              } else {
                  scene_box_sld.material = materialbox2;
                  scene_box_sld.visibility = visibility_mouseover;
              }
          };

          var actionSLIDINGout = function() { // mouse OUT
              if (scene_box_sld.material === materialbox2 && scene_box_sld.visibility === visibility_clicked) {
                  scene_box_sld.material = materialbox2;
                  scene_box_sld.visibility = visibility_clicked;
              } else {
                  scene_box_sld.material = materialSLIDINGdoor;
                  scene_box_sld.visibility = 1;
              }
          };

          var executeActionSLIDING = new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnPickTrigger, actionSLIDING);
          var executeActionSLIDINGover = new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnPointerOverTrigger, actionSLIDINGover);
          var executeActionSLIDINGout = new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnPointerOutTrigger, actionSLIDINGout);
          var actionManagerSLIDING = new BABYLON.ActionManager(scene);
          actionManagerSLIDING.registerAction(executeActionSLIDING);
          actionManagerSLIDING.registerAction(executeActionSLIDINGover);
          actionManagerSLIDING.registerAction(executeActionSLIDINGout);

          sliding_door_height = board[sliding_door.highestColumn - 1][sliding_door.highestSpace].y - board[sliding_door.lowestColumn - 1][sliding_door.lowestSpace - 1].y;
          sliding_door_width = wall[sliding_door.endDoor].x - wall[sliding_door.startDoor - 1].x;
          var endingY = board[sliding_door.highestColumn - 1][sliding_door.highestSpace].y;
          var startingY = board[sliding_door.lowestColumn - 1][sliding_door.lowestSpace - 1].y;
          var sd_depth = 2;
          var sd_gap = 1;

          scene_box_sld = BABYLON.MeshBuilder.CreateBox('sliding', {
              height: sliding_door_height,
              width: sliding_door_width,
              depth: sd_depth
          }, scene);
          scene_box_sld.position.x = wall[sliding_door.startDoor - 1].x + sliding_door_width / 2;
          scene_box_sld.position.y = endingY - sliding_door_height / 2;
          scene_box_sld.position.z = -model_depth_array[sliding_door.lowestColumn - 1] - sd_depth / 2 - sd_gap;
          scene_box_sld.material = materialSLIDINGdoor;
          if (step !== 6) {
              scene_box_sld.actionManager = actionManagerSLIDING;
          }

          //create railing
          var rail_depth = 1;
          var rail_height = 3;
          var railing_width = wall[sliding_door.endRailing].x - wall[sliding_door.startRailing - 1].x - furniture_thickness;

          scene_box.push(null); // this is top
          scene_box[scene_box.length - 1] = BABYLON.MeshBuilder.CreateBox('box', {
              height: rail_height,
              width: railing_width,
              depth: rail_depth
          }, scene);
          scene_box[scene_box.length - 1].position.x = wall[sliding_door.startRailing - 1].x + railing_width / 2 + furniture_thickness / 2;
          scene_box[scene_box.length - 1].position.y = startingY;
          scene_box[scene_box.length - 1].position.z = -model_depth_array[sliding_door.lowestColumn - 1] - rail_depth / 2;
          scene_box[scene_box.length - 1].material = materialRAILING;

          scene_box.push(null); // this is bottom
          scene_box[scene_box.length - 1] = BABYLON.MeshBuilder.CreateBox('box', {
              height: rail_height,
              width: railing_width,
              depth: rail_depth
          }, scene);
          scene_box[scene_box.length - 1].position.x = wall[sliding_door.startRailing - 1].x + railing_width / 2 + furniture_thickness / 2;
          scene_box[scene_box.length - 1].position.y = endingY;
          scene_box[scene_box.length - 1].position.z = -model_depth_array[sliding_door.lowestColumn - 1] - rail_depth / 2;
          scene_box[scene_box.length - 1].material = materialRAILING;
      }


      if (divider != null) {
          divider_builder();
      }


      function divider_builder() {
          var actionDIVIDER = function(evt) {
              var box = evt.source.name;
              var dblclicked;
              if (scene_box_divi[box].material === materialbox2 && scene_box_divi[box].visibility === visibility_clicked_dr) {
                  dblclicked = 'yes';
              } else {
                  dblclicked = 'no';
              }

              if (dblclicked === 'no') {
                  scene_box_divi[box].material = materialbox2;
                  scene_box_divi[box].visibility = visibility_clicked_dr;
              } else {
                  scene_box_divi[box].material = materialbox1;
                  scene_box_divi[box].visibility = 1;
              }
          };

          var ActionDIVIDERover = function(evt) {
              var box = evt.source.name;
              if (scene_box_divi[box].material === materialbox2 && scene_box_divi[box].visibility === visibility_clicked_dr) {} else {
                  scene_box_divi[box].visibility = visibility_mouseover;
                  scene_box_divi[box].material = materialbox2;
              }
          };

          var ActionDIVIDERout = function(evt) {
              var box = evt.source.name;
              if (scene_box_divi[box].material === materialbox2 && scene_box_divi[box].visibility === visibility_clicked_dr) {
                  scene_box_divi[box].material = materialbox2;
                  scene_box_divi[box].visibility = visibility_clicked_dr;
              } else {
                  scene_box_divi[box].material = materialbox1;
                  scene_box_divi[box].visibility = 1;
              }
          };

          // DIVIDER action manager options
          var executeActionDIVIDER = new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnPickTrigger, actionDIVIDER);
          var executeActionDIVIDERover = new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnPointerOverTrigger, ActionDIVIDERover);
          var executeActionDIVIDERout = new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnPointerOutTrigger, ActionDIVIDERout);
          var actionManagerDIVIDER = new BABYLON.ActionManager(scene);
          actionManagerDIVIDER.registerAction(executeActionDIVIDER);
          actionManagerDIVIDER.registerAction(executeActionDIVIDERover);
          actionManagerDIVIDER.registerAction(executeActionDIVIDERout);

          counter = 0;
          while (divider[counter]) {
              scene_box_divi[counter] = BABYLON.MeshBuilder.CreateBox(counter, {
                  height: divider[counter].height,
                  width: furniture_thickness,
                  depth: divider[counter].depth
              }, scene);
              scene_box_divi[counter].position.x = divider[counter].x;
              scene_box_divi[counter].position.y = divider[counter].y;
              scene_box_divi[counter].position.z = -divider[counter].depth / 2;
              scene_box_divi[counter].material = materialbox1;
              scene_box_divi[counter].actionManager = actionManagerDIVIDER;
              counter++;
          }
      }

      if (cubic.length>0){
          cubic_builder();
      }

      function cubic_builder(){
          var actionCUBIC = function(evt) {
              var box = evt.source.name;
              // cubic boxes consist of 4 separate elements, so we get cubic number from (evt) argument and then break it into 4 seperate scene blocks
              var box_nr = parseInt(box)*4;
              var i = {
                  'L' : box_nr,
                  'R' : box_nr+1,
                  'B' : box_nr+2,
                  'T' : box_nr+3
              };

              var dblclicked;
              if (scene_box_cubi[i['L']].visibility === visibility_clicked_dr) {
                  dblclicked = 1;
              } else {
                  dblclicked = 0;
              }
              if (dblclicked) {
                  scene_box_cubi[i['L']].material = materialCUBIC[box];
                  scene_box_cubi[i['R']].material = materialCUBIC[box];
                  scene_box_cubi[i['B']].material = materialCUBIC2[box];
                  scene_box_cubi[i['T']].material = materialCUBIC2[box];
                  scene_box_cubi[i['L']].visibility = 1;
                  scene_box_cubi[i['R']].visibility = 1;
                  scene_box_cubi[i['B']].visibility = 1;
                  scene_box_cubi[i['T']].visibility = 1;
              } else {
                  scene_box_cubi[i['L']].material = materialbox2;
                  scene_box_cubi[i['R']].material = materialbox2;
                  scene_box_cubi[i['B']].material = materialbox2;
                  scene_box_cubi[i['T']].material = materialbox2;
                  scene_box_cubi[i['L']].visibility = visibility_clicked_dr;
                  scene_box_cubi[i['R']].visibility = visibility_clicked_dr;
                  scene_box_cubi[i['B']].visibility = visibility_clicked_dr;
                  scene_box_cubi[i['T']].visibility = visibility_clicked_dr;
              }
          };

          var actionCUBICover = function(evt) {
              var box = evt.source.name;
              var box_nr = parseInt(box)*4;
              var i = {
                  'L' : box_nr,
                  'R' : box_nr+1,
                  'B' : box_nr+2,
                  'T' : box_nr+3
              };
              if (scene_box_cubi[i['L']].material === materialCUBIC[box]){
                  scene_box_cubi[i['L']].material = materialbox2;
                  scene_box_cubi[i['R']].material = materialbox2;
                  scene_box_cubi[i['B']].material = materialbox2;
                  scene_box_cubi[i['T']].material = materialbox2;
                  scene_box_cubi[i['L']].visibility = visibility_mouseover;
                  scene_box_cubi[i['R']].visibility = visibility_mouseover;
                  scene_box_cubi[i['B']].visibility = visibility_mouseover;
                  scene_box_cubi[i['T']].visibility = visibility_mouseover;
              }
          };

          var actionCUBICout = function(evt) {
              var box = evt.source.name;
              var box_nr = parseInt(box)*4;
              var i = {
                  'L' : box_nr,
                  'R' : box_nr+1,
                  'B' : box_nr+2,
                  'T' : box_nr+3
              };
              if (scene_box_cubi[i['L']].material === materialbox2 && scene_box_cubi[i['L']].visibility !== visibility_clicked_dr){
                  scene_box_cubi[i['L']].material = materialCUBIC[box];
                  scene_box_cubi[i['R']].material = materialCUBIC[box];
                  scene_box_cubi[i['B']].material = materialCUBIC2[box];
                  scene_box_cubi[i['T']].material = materialCUBIC2[box];
                  scene_box_cubi[i['L']].visibility = 1;
                  scene_box_cubi[i['R']].visibility = 1;
                  scene_box_cubi[i['B']].visibility = 1;
                  scene_box_cubi[i['T']].visibility = 1;
              }
          };

          var executeActionCubic = new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnPickTrigger, actionCUBIC);
          var executeActionCubicOver = new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnPointerOverTrigger, actionCUBICover);
          var executeActionCubicOut = new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnPointerOutTrigger, actionCUBICout);
          var actionManagerCubic = new BABYLON.ActionManager(scene);
          actionManagerCubic.registerAction(executeActionCubic);
          actionManagerCubic.registerAction(executeActionCubicOver);
          actionManagerCubic.registerAction(executeActionCubicOut);

          for (var x=0; x<cubic.length; x++){
              // left wall
              scene_box_cubi.push(BABYLON.MeshBuilder.CreateBox(x, {height: cubic[x].height, width: cubic[x].thickness, depth: cubic[x].depth}, scene));
              scene_box_cubi[scene_box_cubi.length-1].position.x = cubic[x].x;
              scene_box_cubi[scene_box_cubi.length-1].position.y = cubic[x].y;
              scene_box_cubi[scene_box_cubi.length-1].position.z = cubic[x].z;
              scene_box_cubi[scene_box_cubi.length-1].material = materialCUBIC[x];
              //right wall
              scene_box_cubi.push(BABYLON.MeshBuilder.CreateBox(x, {height: cubic[x].height, width: cubic[x].thickness, depth: cubic[x].depth}, scene));
              scene_box_cubi[scene_box_cubi.length-1].position.x = cubic[x].x3;
              scene_box_cubi[scene_box_cubi.length-1].position.y = cubic[x].y;
              scene_box_cubi[scene_box_cubi.length-1].position.z = cubic[x].z;
              scene_box_cubi[scene_box_cubi.length-1].material = materialCUBIC[x];
              // bottom
              scene_box_cubi.push(BABYLON.MeshBuilder.CreateBox(x,{height: cubic[x].thickness, width: cubic[x].top_bot_width, depth: cubic[x].depth}, scene));
              scene_box_cubi[scene_box_cubi.length-1].position.x = cubic[x].x2;
              scene_box_cubi[scene_box_cubi.length-1].position.y = cubic[x].y2;
              scene_box_cubi[scene_box_cubi.length-1].position.z = cubic[x].z;
              scene_box_cubi[scene_box_cubi.length-1].material = materialCUBIC2[x];
              // top
              scene_box_cubi.push(BABYLON.MeshBuilder.CreateBox(x, {height: cubic[x].thickness, width: cubic[x].top_bot_width, depth: cubic[x].depth}, scene));
              scene_box_cubi[scene_box_cubi.length-1].position.x = cubic[x].x2;
              scene_box_cubi[scene_box_cubi.length-1].position.y = cubic[x].y3;
              scene_box_cubi[scene_box_cubi.length-1].position.z = cubic[x].z;
              scene_box_cubi[scene_box_cubi.length-1].material = materialCUBIC2[x];

              if (step===9 || step === 4){
                  scene_box_cubi[scene_box_cubi.length-4].actionManager = actionManagerCubic;
                  scene_box_cubi[scene_box_cubi.length-3].actionManager = actionManagerCubic;
                  scene_box_cubi[scene_box_cubi.length-2].actionManager = actionManagerCubic;
                  scene_box_cubi[scene_box_cubi.length-1].actionManager = actionManagerCubic;
              }
          }
      }


      door_builder();
      function door_builder() {
          var actionDOOR = function(evt) { // CLICK DOOR
              var box = evt.source.name; // get clicked box number
              var dblclicked;

              if (scene_box_dr[box].material === materialbox2 && scene_box_dr[box].visibility === visibility_clicked_dr) { // if clicked, set var as 'yes'
                  dblclicked = 'yes';
              } else {
                  dblclicked = 'no';
              }

              if (dblclicked === 'no') { // set as selected if not double clicked
                  scene_box_dr[box].material = materialbox2;
                  scene_box_dr[box].visibility = visibility_clicked_dr;
                  // highlight glass door frames also
                  if (door[box].texture==='glass'){
                      var glass_door_index = scene_box_dr[box].glassDoor;
                      glass_frame_box[glass_door_index].visibility = visibility_clicked_dr;
                      glass_frame_box[glass_door_index+1].visibility = visibility_clicked_dr;
                      glass_frame_box[glass_door_index+2].visibility = visibility_clicked_dr;
                      glass_frame_box[glass_door_index+3].visibility = visibility_clicked_dr;
                      glass_frame_box[glass_door_index].material = materialbox2;
                      glass_frame_box[glass_door_index+1].material = materialbox2;
                      glass_frame_box[glass_door_index+2].material = materialbox2;
                      glass_frame_box[glass_door_index+3].material = materialbox2;
                  }
              } else {
                  scene_box_dr[box].material = materialDOORS[box];
                  scene_box_dr[box].visibility = 1;
                  // unhighlight glass door frames also
                  if (door[box].texture==='glass'){
                      var glass_door_index = scene_box_dr[box].glassDoor;
                      glass_frame_box[glass_door_index].visibility = 1;
                      glass_frame_box[glass_door_index+1].visibility = 1;
                      glass_frame_box[glass_door_index+2].visibility = 1;
                      glass_frame_box[glass_door_index+3].visibility = 1;
                      glass_frame_box[glass_door_index].material = materialbox1;
                      glass_frame_box[glass_door_index+1].material = materialbox1;
                      glass_frame_box[glass_door_index+2].material = materialbox1;
                      glass_frame_box[glass_door_index+3].material = materialbox1;
                  }
              }
          };

          var ActionDOORover = function(evt) {
              var box = evt.source.name;
              if (scene_box_dr[box].material !== materialbox2 && scene_box_dr[box].visibility !== visibility_clicked_dr) {
                  scene_box_dr[box].visibility = visibility_mouseover;
                  scene_box_dr[box].material = materialbox2;
                  if (door[box].texture==='glass'){
                      var glass_door_index = scene_box_dr[box].glassDoor;
                      glass_frame_box[glass_door_index].visibility = visibility_mouseover;
                      glass_frame_box[glass_door_index+1].visibility = visibility_mouseover;
                      glass_frame_box[glass_door_index+2].visibility = visibility_mouseover;
                      glass_frame_box[glass_door_index+3].visibility = visibility_mouseover;
                      glass_frame_box[glass_door_index].material = materialbox2;
                      glass_frame_box[glass_door_index+1].material = materialbox2;
                      glass_frame_box[glass_door_index+2].material = materialbox2;
                      glass_frame_box[glass_door_index+3].material = materialbox2;
                  }
              }
          };

          var ActionDOORout = function(evt) { // mouse OUT
              var box = evt.source.name;
              if (scene_box_dr[box].material === materialbox2 && scene_box_dr[box].visibility === visibility_mouseover) {
                  scene_box_dr[box].material = materialDOORS[box];
                  scene_box_dr[box].visibility = 1;
                  if (door[box].texture==='glass'){
                      var glass_door_index = scene_box_dr[box].glassDoor;
                      glass_frame_box[glass_door_index].visibility = 1;
                      glass_frame_box[glass_door_index+1].visibility = 1;
                      glass_frame_box[glass_door_index+2].visibility = 1;
                      glass_frame_box[glass_door_index+3].visibility = 1;
                      glass_frame_box[glass_door_index].material = materialbox1;
                      glass_frame_box[glass_door_index+1].material = materialbox1;
                      glass_frame_box[glass_door_index+2].material = materialbox1;
                      glass_frame_box[glass_door_index+3].material = materialbox1;
                  }
              }
          };
          // door action manager options
          var executeActionDOOR = new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnPickTrigger, actionDOOR);
          var executeActionDOORover = new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnPointerOverTrigger, ActionDOORover);
          var executeActionDOORout = new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnPointerOutTrigger, ActionDOORout);
          var actionManagerDOOR = new BABYLON.ActionManager(scene);
          actionManagerDOOR.registerAction(executeActionDOOR);
          actionManagerDOOR.registerAction(executeActionDOORover);
          actionManagerDOOR.registerAction(executeActionDOORout);

          var counter = 0;
          var glass_frame_box = [];
          while (door[counter]) {
              if (door[counter].texture==='glass'){
                  var glass = {
                      'frame_width' : 10,
                      'depth' : 0.5
                  };
                  scene_box_dr[counter] = BABYLON.MeshBuilder.CreateBox(counter, {
                      height: door[counter].height-glass['frame_width'],
                      width: door[counter].width-glass['frame_width'],
                      depth: glass['depth']
                  }, scene);
                  scene_box_dr[counter].position.x = door[counter].x;
                  scene_box_dr[counter].position.y = door[counter].y;
                  scene_box_dr[counter].position.z = door[counter].z;
                  scene_box_dr[counter].material = materialDOORS[counter];

                  scene_box_dr[counter].glassDoor = glass_frame_box.length; // specify glass door number in relation to all doors, needed in acionmanager

                  var frame = {
                      //left
                      'x' : door[counter].x-door[counter].width/2+glass['frame_width']/4,
                      'width' : glass['frame_width']/2,
                      //bot
                      'y' : door[counter].y-door[counter].height/2+glass['frame_width']/4,
                      //top
                      'y2' : door[counter].y+door[counter].height/2-glass['frame_width']/4,
                      //right
                      'x2' : door[counter].x+door[counter].width/2-glass['frame_width']/4
                  };
                  //frame left
                  //var box_count = scene_box.length-1;
                  glass_frame_box.push(BABYLON.MeshBuilder.CreateBox(counter, {height: door[counter].height, width: frame['width'], depth: door[counter].depth}, scene));
                  glass_frame_box[glass_frame_box.length - 1].position.x = frame['x'];
                  glass_frame_box[glass_frame_box.length - 1].position.y = door[counter].y;
                  glass_frame_box[glass_frame_box.length - 1].position.z = door[counter].z;
                  glass_frame_box[glass_frame_box.length - 1].material = materialbox1;

                  // frame bot
                  glass_frame_box.push(BABYLON.MeshBuilder.CreateBox(counter, {height: frame['width'], width: door[counter].width-glass['frame_width'], depth: door[counter].depth}, scene));
                  glass_frame_box[glass_frame_box.length - 1].position.x = door[counter].x;
                  glass_frame_box[glass_frame_box.length - 1].position.y = frame['y'];
                  glass_frame_box[glass_frame_box.length - 1].position.z = door[counter].z;
                  glass_frame_box[glass_frame_box.length - 1].material = materialbox1;

                  // frame top
                  glass_frame_box.push(BABYLON.MeshBuilder.CreateBox(counter, {height: frame['width'], width: door[counter].width-glass['frame_width'], depth: door[counter].depth}, scene));
                  glass_frame_box[glass_frame_box.length - 1].position.x = door[counter].x;
                  glass_frame_box[glass_frame_box.length - 1].position.y = frame['y2'];
                  glass_frame_box[glass_frame_box.length - 1].position.z = door[counter].z;
                  glass_frame_box[glass_frame_box.length - 1].material = materialbox1;

                  //frame right
                  glass_frame_box.push(BABYLON.MeshBuilder.CreateBox(counter, {height: door[counter].height, width: frame['width'], depth: door[counter].depth}, scene));
                  glass_frame_box[glass_frame_box.length - 1].position.x = frame['x2'];
                  glass_frame_box[glass_frame_box.length - 1].position.y = door[counter].y;
                  glass_frame_box[glass_frame_box.length - 1].position.z = door[counter].z;
                  glass_frame_box[glass_frame_box.length - 1].material = materialbox1;

                  if (step===9 || step === 4){
                      scene_box_dr[counter].actionManager = actionManagerDOOR; // glass door action manager
                      glass_frame_box[glass_frame_box.length-4].actionManager = actionManagerDOOR; // glass framers action manager
                      glass_frame_box[glass_frame_box.length-3].actionManager = actionManagerDOOR;
                      glass_frame_box[glass_frame_box.length-2].actionManager = actionManagerDOOR;
                      glass_frame_box[glass_frame_box.length-1].actionManager = actionManagerDOOR;
                  }
              }else{
                  scene_box_dr[counter] = BABYLON.MeshBuilder.CreateBox(counter, {
                      height: door[counter].height,
                      width: door[counter].width,
                      depth: door[counter].depth
                  }, scene);
                  scene_box_dr[counter].position.x = door[counter].x;
                  scene_box_dr[counter].position.y = door[counter].y;
                  scene_box_dr[counter].position.z = door[counter].z;
                  scene_box_dr[counter].material = materialDOORS[counter];
                  if (step===9 || step === 4){
                      scene_box_dr[counter].actionManager = actionManagerDOOR;
                  }
              }


            if (door[counter].type === 'door' || door[counter].type === 'doubleLEFT' || door[counter].type === 'doubleRIGHT'){
                var hinge_height = 5;
                var hinge_depth = 3;
                var hinge_thickness = 0.5;
                var hinge_position = 10;
                var hinge_startY = door[counter].startY+hinge_position;
                var hinge_endY = door[counter].endY-hinge_position;

                var cup_radius = 2;
                if (door[counter].open==='left'){
                    var hinge_x = wall[door[counter].column-1].x+furniture_thickness/2+hinge_thickness/2;
                    var cup_x = wall[door[counter].column-1].x+cup_radius+furniture_thickness/2;
                }else if (door[counter].open==='right'){
                    var hinge_x = wall[door[counter].column].x-furniture_thickness/2-hinge_thickness/2;
                    var cup_x = wall[door[counter].column].x-cup_radius-furniture_thickness/2;
                }
                                                
                var hinge_z1 = door[counter].z+door[counter].depth/2+hinge_depth/2; // depth
                
                var cup_z1 = door[counter].z+door[counter].depth/2+hinge_thickness/2; // depth
                var cup_z2 = cup_z1+hinge_thickness; // depth        
                
                var cup_dim_lower = [];
                cup_dim_lower[0] = new BABYLON.Vector3(cup_x, hinge_startY, cup_z1);
                cup_dim_lower[1] = new BABYLON.Vector3(cup_x, hinge_startY, cup_z2);
                
                var cup_dim_upper = [];
                cup_dim_upper[0] = new BABYLON.Vector3(cup_x, hinge_endY, cup_z1);
                cup_dim_upper[1] = new BABYLON.Vector3(cup_x, hinge_endY, cup_z2);
                
                scene_box.push(BABYLON.MeshBuilder.CreateBox(counter, {height: hinge_height, width: hinge_thickness, depth: hinge_depth}, scene));
                scene_box[scene_box.length - 1].position.x = hinge_x;
                scene_box[scene_box.length - 1].position.y = hinge_startY;
                scene_box[scene_box.length - 1].position.z = hinge_z1;
                scene_box[scene_box.length - 1].material = materialRAILING;
                            
                scene_box.push(BABYLON.Mesh.CreateTube("cup", cup_dim_lower, cup_radius, 60, null, BABYLON.Mesh.CAP_ALL, scene, false, BABYLON.Mesh.FRONTSIDE));
                scene_box[scene_box.length - 1].material = materialRAILING;
                
                scene_box.push(BABYLON.MeshBuilder.CreateBox(counter, {height: hinge_height, width: hinge_thickness, depth: hinge_depth}, scene));
                scene_box[scene_box.length - 1].position.x = hinge_x;
                scene_box[scene_box.length - 1].position.y = hinge_endY;
                scene_box[scene_box.length - 1].position.z = hinge_z1;
                scene_box[scene_box.length - 1].material = materialRAILING;
                              
                scene_box.push(BABYLON.Mesh.CreateTube("cup", cup_dim_upper, cup_radius, 60, null, BABYLON.Mesh.CAP_ALL, scene, false, BABYLON.Mesh.FRONTSIDE));
                scene_box[scene_box.length - 1].material = materialRAILING;
            }
            
            if (door[counter].type === 'flap'){
                var flap_acc = {
                    radius: 2,
                    thickness: 0.5,
                    xstart: wall[door[counter].column-1].x+furniture_thickness/2+5,
                    xend: wall[door[counter].columnEnd].x-furniture_thickness/2-5,
                    z: door[counter].z+door[counter].depth/2+1
                };
                
                if (door[counter].open === 'bot'){
                    flap_acc['y'] = door[counter].startY+furniture_thickness/2;
                }else {
                    flap_acc['y'] = door[counter].endY-furniture_thickness/2-flap_acc['thickness'];
                }
                
                var flap_disk_left = [];
                flap_disk_left[0] = new BABYLON.Vector3(flap_acc['xstart'], flap_acc['y'], flap_acc['z']);
                flap_disk_left[1] = new BABYLON.Vector3(flap_acc['xstart'], flap_acc['y']+flap_acc['thickness'], flap_acc['z']);
                
                scene_box.push(BABYLON.Mesh.CreateTube("flap_disk", flap_disk_left, flap_acc['radius'], 60, null, BABYLON.Mesh.CAP_ALL, scene, false, BABYLON.Mesh.FRONTSIDE));
                scene_box[scene_box.length - 1].material = materialRAILING;
                
                // RIGHT HINGE
                var flap_disk_right = [];
                flap_disk_right[0] = new BABYLON.Vector3(flap_acc['xend'], flap_acc['y'], flap_acc['z']);
                flap_disk_right[1] = new BABYLON.Vector3(flap_acc['xend'], flap_acc['y']+flap_acc['thickness'], flap_acc['z']);
                scene_box.push(BABYLON.Mesh.CreateTube("flap_disk", flap_disk_right, flap_acc['radius'], 60, null, BABYLON.Mesh.CAP_ALL, scene, false, BABYLON.Mesh.FRONTSIDE));
                scene_box[scene_box.length - 1].material = materialRAILING;
            }
            

              if (door[counter].type === 'drawer') {
                  var raise = 2; // distance between board below and bottom drawer
                  var drawer_height = space_array[door[counter].column-1][door[counter].start-1]*0.7-raise;
                  if (drawer_height > 30) {
                      drawer_height = 30;
                  }

                  var drawer_width = door[counter].width - 5;
                  var drawer_depth = model_depth_array[door[counter].column - 1] - 4;
                  var drawer_thickness = 1.6;
                  var drawer_btm_thickness = 0.4;
                  var backed = 0.5; // door pushed outside
                  var fix_y = board[door[counter].column - 1][door[counter].start - 1].y + furniture_thickness/2; // below board Y + its thickness + half drawer thickness

                  scene_box.push(BABYLON.MeshBuilder.CreateBox(counter, { // add bottom of the drawer
                      height: drawer_btm_thickness,
                      width: drawer_width,
                      depth: drawer_depth
                  }, scene));
                  scene_box[scene_box.length - 1].position.x = door[counter].x;
                  scene_box[scene_box.length - 1].position.y = fix_y + drawer_btm_thickness/2 + raise;
                  scene_box[scene_box.length - 1].position.z = door[counter].z + (drawer_depth / 2) + (furniture_thickness / 2 - backed); // half board width - half thickness - backed
                  scene_box[scene_box.length - 1].material = materialDrawer;

                  scene_box.push(BABYLON.MeshBuilder.CreateBox(counter, {
                      height: drawer_height,
                      width: drawer_thickness,
                      depth: drawer_depth
                  }, scene)); // add right side of the drawer
                  scene_box[scene_box.length - 1].position.x = door[counter].x + (drawer_width / 2) - (drawer_thickness / 2); // door.x + half board bottom width
                  scene_box[scene_box.length - 1].position.y = fix_y + drawer_btm_thickness + raise + drawer_height / 2;
                  scene_box[scene_box.length - 1].position.z = door[counter].z + (drawer_depth / 2) + (furniture_thickness / 2 - backed); // half board width - half thickness - backed
                  scene_box[scene_box.length - 1].material = materialDrawer;

                  scene_box.push(BABYLON.MeshBuilder.CreateBox(counter, {
                      height: drawer_height,
                      width: drawer_thickness,
                      depth: drawer_depth
                  }, scene)); // add left side of the drawer
                  scene_box[scene_box.length - 1].position.x = door[counter].x - (drawer_width / 2) + drawer_thickness / 2;
                  scene_box[scene_box.length - 1].position.y = fix_y + drawer_btm_thickness + raise + drawer_height / 2;
                  scene_box[scene_box.length - 1].position.z = door[counter].z + (drawer_depth / 2) + (furniture_thickness / 2 - backed); // half board width - half thickness - backed
                  scene_box[scene_box.length - 1].material = materialDrawer;

                  scene_box.push(BABYLON.MeshBuilder.CreateBox(counter, {
                      height: drawer_height,
                      width: (drawer_width - 2 * drawer_thickness),
                      depth: drawer_thickness
                  }, scene)); // add back side of the drawer
                  scene_box[scene_box.length - 1].position.x = door[counter].x; // door.x + half board bottom width
                  scene_box[scene_box.length - 1].position.y = fix_y + drawer_btm_thickness + raise + drawer_height / 2;
                  scene_box[scene_box.length - 1].position.z = door[counter].z + drawer_depth;
                  scene_box[scene_box.length - 1].material = materialDrawer;

                  scene_box.push(BABYLON.MeshBuilder.CreateBox(counter, {
                      height: drawer_height,
                      width: (drawer_width - 2 * drawer_thickness),
                      depth: drawer_thickness
                  }, scene)); // add front side of the drawer
                  scene_box[scene_box.length - 1].position.x = door[counter].x; // door.x + half board bottom width
                  scene_box[scene_box.length - 1].position.y = fix_y + drawer_btm_thickness + raise + drawer_height / 2;
                  scene_box[scene_box.length - 1].position.z = door[counter].z + drawer_thickness;
                  scene_box[scene_box.length - 1].material = materialDrawer;
              }
              counter++;
          }
      }

      if (step === 2 || step === 3) {
          model_builder3(); // TRIGGER BLOCK
      }

      function model_builder3() {
          var codeAction1 = function(evt) {
              var mesh_name = evt.source.name;
              var box = mesh_name.split(',');
              var dblclicked;
              load_column(box[0], box[1]); // [0] -> horizontal position, [1] -> vertical position

              if (scene_box_spc[(box[0] - 1)][box[1] - 1].visibility === visibility_clicked) {
                  dblclicked = 'yes';
              } else {
                  dblclicked = 'no';
              }

              var counter;
              if (step === 2) { // dont allow multi selection
                  for (run_col = 1; run_col <= model_columns; run_col++) {
                      counter = 0;
                      while (scene_box_spc[run_col - 1][counter] != null) { // turn off all selections
                          scene_box_spc[run_col - 1][counter].visibility = 0;
                          counter++;
                      }
                  }
              }

              if (dblclicked === 'no') {
                  scene_box_spc[(box[0] - 1)][box[1] - 1].visibility = visibility_clicked;
              } else {
                  scene_box_spc[(box[0] - 1)][box[1] - 1].visibility = 0;
              }

              for (run_col = 1; run_col <= model_columns; run_col++) { // selecting spaces unselects all doors
                  counter = 0;
                  while (scene_box_dr[counter] != null) {
                      scene_box_dr[counter].edgesWidth = 0;
                      counter++;
                  }
              }
          };

          var codeAction2 = function(evt) {
              var mesh_name = evt.source.name;
              var box = mesh_name.split(',');
              if (scene_box_spc[(box[0] - 1)][box[1] - 1].visibility === visibility_clicked) {
                  scene_box_spc[(box[0] - 1)][box[1] - 1].visibility = visibility_clicked;
              } else {
                  scene_box_spc[(box[0] - 1)][box[1] - 1].visibility = visibility_mouseover;
              }
          };

          var codeAction3 = function(evt) { // mouse OUT
              var mesh_name = evt.source.name;
              var box = mesh_name.split(',');
              if (scene_box_spc[(box[0] - 1)][box[1] - 1].visibility === visibility_clicked) {
                  scene_box_spc[(box[0] - 1)][box[1] - 1].visibility = visibility_clicked;
              } else {
                  scene_box_spc[(box[0] - 1)][box[1] - 1].visibility = 0;
              }
          };

          // space action manager options
          var executeAction1 = new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnPickTrigger, codeAction1);
          var executeAction2 = new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnPointerOverTrigger, codeAction2);
          var executeAction3 = new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnPointerOutTrigger, codeAction3);
          var actionManager1 = new BABYLON.ActionManager(scene);
          actionManager1.registerAction(executeAction1);
          actionManager1.registerAction(executeAction2);
          actionManager1.registerAction(executeAction3);

          // check for spaces filled with objects like cubics and freeze them, PART 1
          if (cubic.length>0) {
              var ignore = [];
              for (var run_col = 1; run_col <= model_columns; run_col++) {
                  ignore.push([]);
                  for (var run_shelf = 1; run_shelf <= model_shelf_array[run_col - 1] + 1; run_shelf++) {
                      ignore[run_col - 1][run_shelf - 1] = false;
                  }
              }
              for (var x = 0; x < cubic.length; x++) {
                  ignore[cubic[x].column - 1][cubic[x].space - 1] = true;
              }
          }

          //alert(ignore[0][0]);
          var fix = 0.5; // same in object space
          for (var run_col = 1; run_col <= model_columns; run_col++) {
              scene_box_spc[run_col - 1] = [];
              var counter = 0;
              while (space[run_col - 1][counter]) {
                  scene_box_spc[run_col - 1][counter] = BABYLON.MeshBuilder.CreateBox(run_col + ',' + (counter + 1), {
                      height: space[run_col - 1][counter].thickness,
                      width: (model_width_array[run_col - 1] - fix),
                      depth: model_depth_array[run_col - 1]
                  }, scene);
                  scene_box_spc[run_col - 1][counter].position.x = wall[run_col - 1].x + (model_width_array[run_col - 1] - fix) / 2 + wall[run_col - 1].thickness / 2 + (fix / 2);
                  scene_box_spc[run_col - 1][counter].position.y = space[run_col - 1][counter].y;
                  scene_box_spc[run_col - 1][counter].position.z = board[run_col - 1][counter].z;
                  scene_box_spc[run_col - 1][counter].material = materialbox2;
                  scene_box_spc[run_col - 1][counter].visibility = 0;
                  scene_box_spc[run_col - 1][counter].actionManager = actionManager1;
                  // check for spaces filled with objects like cubics and freeze them, PART 2
                  if (cubic.length>0){
                      if (ignore[run_col-1][counter]){
                          scene_box_spc[run_col - 1][counter].dispose();
                      }
                  }
                  counter++;
              }
          }
      }

      model_height = Math.max.apply(Math, model_height_array);
      model_depth = Math.max.apply(Math, model_depth_array);

      $('#user_dim_height').html(model_height + ' ' + global_text['cm']);
      $('#user_dim_width').html(model_width + ' ' + global_text['cm']);
      $('#user_dim_depth').html(model_depth + ' ' + global_text['cm']);
      cameras();
      function cameras() {
          camera = new BABYLON.ArcRotateCamera("ArcRotateCamera", 0, 0, 0, BABYLON.Vector3.Zero(), scene);
          camera.attachControl(canvas, true); // enable moving
          camera.setTarget(new BABYLON.Vector3(model_width / 2, model_height / 2, -model_depth / 2));
          camera.setPosition(new BABYLON.Vector3(200, 100, -1.207 * model_width - 1.5 * model_height));
          //camera.lowerRadiusLimit = 100; // disable zoom-in/out
          //camera.upperRadiusLimit = 1000; // disable zoom-in/out
      }

      lights();
      function lights() {
          var light = new BABYLON.PointLight("Omni", new BABYLON.Vector3(0, model_height / 2, -model_depth - 200), scene);
          var light2 = new BABYLON.HemisphericLight("hemi2", new BABYLON.Vector3(0, 1, 0), scene);
          light.intensity = 2;
      }


      get_current_price();
      save_current_dimensions();

      return scene;
  };

  var scene = createScene();
  engine.runRenderLoop(function() {
      scene.render();
  });
  window.addEventListener("resize", function() { // Watch for browser/canvas resize events
      fit_window();
      engine.resize();
  });

  function fit_window() {
      var user_window_height = '.user_window_height';
      var window_height = $(window).height() - 69;
      $(user_window_height).css('height', window_height + 'px');
  }

  function wall_object(height, depth, thickness, column) { // column is actually a singlewall
      this.column = column;

      if (model_tabletop === 'between') {
          this.height = height;
          this.reduced = false;
      } else { // 'over'
          // MODE 1 - tabletop covering wall
          this.height = height - furniture_thickness;
          this.reduced = true;

          // MODE 2 - inbetween walls with varying heights or depths
          if (column > 0 && column < model_columns) { // consider odd number singlewalls
              if (column / 2 % 1 !== 0) {
                  if (model_height_array[column] > model_height_array[column - 1]) {
                      if (model_depth_array[column] < model_depth_array[column - 1]) {
                          this.height = height;
                          this.reduced = false;
                      }
                  }

                  if (model_height_array[column] < model_height_array[column - 1]) {
                      if (model_depth_array[column] > model_depth_array[column - 1]) {
                          this.height = height;
                          this.reduced = false;
                      }
                  }

                  if (model_height_array[column] === model_height_array[column - 1]) {
                      if (model_depth_array[column] !== model_depth_array[column - 1]) {
                          this.height = height;
                          this.reduced = false;
                      }
                  }
              }

              if (column / 2 % 1 === 0) { // consider even number singlewalls
                  if (model_height_array[column] < model_height_array[column - 1]) {
                      if (model_depth_array[column] > model_depth_array[column - 1]) {
                          this.height = height;
                          this.reduced = false;
                      }
                  }

                  if (model_height_array[column] > model_height_array[column - 1]) {
                      if (model_depth_array[column] < model_depth_array[column - 1]) {
                          this.height = height;
                          this.reduced = false;
                      }
                  }

                  if (model_height_array[column] === model_height_array[column - 1]) {
                      if (model_depth_array[column] !== model_depth_array[column - 1]) {
                          this.height = height;
                          this.reduced = false;
                      }
                  }
              }
          }
      }

      this.thickness = thickness;
      this.depth = depth;
      this.y = this.height / 2;
      this.z = -depth / 2;
      this.sq = (this.height * this.depth) / 10000;
      if (wall.length > 0) {
          this.x = wall[wall.length - 1].x + model_width_array[wall.length - 1] + wall[wall.length - 1].thickness;
      } else {
          this.x = 0; // to the middle of wall, so it actually begins -furniture_thickness/2
      }
  }

  function wall_e_object(column, height, depth) {
      // THIS IS WALL-E
      if (model_tabletop === 'over') {
          if (wall[column - 1].reduced === false) { // reduce height of wall_e if it wasnt yet reduced
              this.height = height - furniture_thickness;
          } else {
              this.height = height;
          }
      } else { // between mode
          this.height = height;
      }

      this.y = wall[column - 1].height + this.height / 2;
      this.thickness = furniture_thickness;
      this.depth = depth;
      this.x = wall[column - 1].x;

      this.z = -this.depth / 2;

      this.sq = (this.height * this.depth) / 10000;

  }

  function tabletop_object(start, end, cover) {
      this.start = start;
      this.end = end;
      this.height = furniture_thickness; // actual thickness
      this.cover = cover;

      var a = wall[end].x - wall[start].x + furniture_thickness;
      var b = wall[end].x - wall[start].x;
      var c = b - furniture_thickness;
      var x_a = wall[start].x - furniture_thickness / 2;
      var x_b_left = wall[start].x - furniture_thickness / 2;
      var x_b_right = wall[start].x + furniture_thickness / 2;
      var x_c = wall[start].x + furniture_thickness / 2;

      if (cover === 'BOTH') {
          this.thickness = a;
          this.x = x_a + this.thickness / 2;
      } else if (cover === 'NONE') {
          this.thickness = c;
          this.x = x_c + this.thickness / 2;
      } else if (cover === 'LEFT') {
          this.thickness = b;
          this.x = x_b_left + this.thickness / 2;
      } else if (cover === 'RIGHT') {
          this.thickness = b;
          this.x = x_b_right + this.thickness / 2;
      }

      this.depth = model_depth_array[start]; // actual depth
      this.y = model_height_array[start] - furniture_thickness / 2;
      this.z = -this.depth / 2;
      this.sq = this.thickness * this.depth / 10000;
  }

  function board_object(column, positionY, thickness, last) { // one if can be removed, this object doesnt sum all boards sq
      var back = 0.5; // same in cubic
      this.thickness = thickness;
      this.width = model_width_array[column - 1];
      this.y = positionY - (furniture_thickness) / 2; // ! can be simplified in board builder

      if (board[column - 1].length === 0) { // if the board is first
          this.depth = model_depth_array[column - 1];
          this.sq = this.width * this.depth / 10000;
          this.z = -this.depth / 2;
      } else if (last === 'last') { // if the board is last
          this.depth = model_depth_array[column - 1];
          this.sq = this.width * this.depth / 10000;
          this.z = -this.depth / 2;
      } else {
          this.column = column; // number of columns, may be replaced with board.length
          this.depth = model_depth_array[column - 1] - back;
          this.sq = this.width * this.depth / 10000;
          this.z = -this.depth / 2;
      }
  }

  function divider_object(column, space, position) {
      var back = 0.5;
      this.position = position;
      this.column = column;
      this.space = space;
      this.height = space_array[column - 1][space - 1];
      this.depth = model_depth_array[column - 1] - back;
      this.y = board[column - 1][space - 1].y + this.height / 2 + furniture_thickness / 2;
      if (this.position === 'left'){
        this.x = wall[column - 1].x + furniture_thickness / 2 + (model_width_array[column - 1]/ 3);  
      }else if (this.position === 'right'){
        this.x = wall[column - 1].x + furniture_thickness / 2 + (model_width_array[column - 1]* 2/3);  
      }else {
        this.x = wall[column - 1].x + furniture_thickness / 2 + model_width_array[column - 1] / 2;
      }
      this.sq = this.height * this.depth / 10000;
  }

  function sockle_object(column) {
      var back = 0.2;
      this.height = sockle_height;
      this.depth = 1.9;
      this.thickness = model_width_array[column - 1];
      this.x = wall[column - 1].x + this.thickness / 2 + furniture_thickness / 2;
      this.y = this.height / 2;
      this.z = -model_depth_array[column - 1] + this.depth / 2 + back;
      this.sq = (this.height * this.thickness) / 10000;

  }

  function space_object(column, space) {
      var fix = 0.5; // save in builder
      this.thickness = space_array[column - 1][space - 1] - fix; //space_array[column-1][space-1];
      this.y = this.thickness / 2 + board[column - 1][space - 1].y + board[column - 1][space - 1].thickness / 2 + (fix / 2);
  }

  function door_object(column, start, end, type, texture, column_end, open) {
      this.type = type;
      this.open = open;
      var free_space = 0.8; // desired space between two neighbouring doors
      var cover = (furniture_thickness - free_space) / 2;
      var dbl_gap=0.1;

      //cover = 0;
      switch (type) {
          case ('door'):
          case ('drawer'):
              this.width = model_width_array[column - 1] + cover*2;
              this.x = wall[column - 1].x + furniture_thickness/2 + this.width / 2  - cover ;
              break;
          case ('flap'):
              var columns_width = 0;
              for (var run_col = column; run_col <= column_end; run_col++) {
                  columns_width = columns_width + model_width_array[run_col - 1];
              }
              this.width = columns_width + ((column_end - column) * furniture_thickness) + cover*2;
              this.x = wall[column - 1].x + furniture_thickness/2 + this.width / 2 - cover;
              break;
          case ('doubleLEFT'):
              this.width = model_width_array[column - 1]/2 + cover - dbl_gap;
              this.x = wall[column - 1].x + furniture_thickness/2 + this.width /2 - cover;
              break;
          case ('doubleRIGHT'):
              this.width = model_width_array[column - 1]/2 + cover - dbl_gap;
              this.x = wall[column - 1].x + furniture_thickness/2 + this.width + this.width /2 - cover + 2*dbl_gap;
              break;
          default:
              console.log('door_object switch failure');
      }

      this.column = column;
      this.columnEnd = column_end;
      this.start = start;
      this.end = end;
      this.startY = board[column - 1][start - 1].y;
      this.endY = board[column - 1][end - 1].y;

      this.height = this.endY - this.startY - furniture_thickness+cover*2;
      this.depth = 2;
      this.y = board[column - 1][start - 1].y + this.height / 2+furniture_thickness/2-cover;
      this.z = -model_depth_array[column - 1] - 1.2; // 1.2 -> doors are slightly in front of the model

      if (texture == null) {
          this.texture = 'oak';
      } else {
          this.texture = texture;
      }
      this.sq = (this.height * this.width) / 10000;
  }

  function hanger_object(column, space, type) {
      this.column = column;
      this.space = space;
      this.type = type;
  }

  function Cubic_Object(column, space, width, texture){
      var backwall = 0.5;
      var recess = 0.5;
      this.thickness = 1.2;
      this.column = parseInt(column);
      this.space = parseInt(space);
      this.height = space_array[column-1][space-1];
      this.width = parseFloat(width);
      this.top_bot_width = this.width-2*this.thickness;
      this.depth = model_depth_array[column-1]-recess-backwall;
      this.texture = texture;
      this.x = wall[column-1].x+furniture_thickness/2+this.thickness/2+model_width_array[column-1]/2-this.width/2;
      // bot x
      this.x2 = wall[column-1].x+furniture_thickness/2+this.top_bot_width/2+this.thickness+model_width_array[column-1]/2-this.width/2;
      // right x
      this.x3 = wall[column-1].x+furniture_thickness/2+this.thickness/2+this.top_bot_width+this.thickness+model_width_array[column-1]/2-this.width/2;
      // left y
      this.y = board[column-1][space-1].y+this.height/2+furniture_thickness/2;
      // bot y
      this.y2 = board[column-1][space-1].y+this.thickness/2+furniture_thickness/2;
      // top y
      this.y3 = board[column-1][space-1].y+furniture_thickness/2+this.height-this.thickness/2;
      this.z = -this.depth/2-backwall;
      this.sq = (2*this.depth*this.top_bot_width/10000)+(2*this.depth*this.height/10000); // top+bot -> to m2, left+right -> to m2
  }

  function backwall_object(column) {
      this.height = model_height_array[column - 1] - sockle_height - 2 * (furniture_thickness / 2);
      this.thickness = model_width_array[column - 1] + furniture_thickness;
      this.depth = 0.5;
      this.x = wall[column - 1].x + this.thickness / 2;
      this.y = model_height_array[column - 1] / 2 + sockle_height / 2;
      this.z = this.depth / 2;
      this.sq = (this.height * this.thickness) / 10000;
  }

  function check_maximum_shelves(which) {
      var shelf_max = 0;
      do {
          shelf_max++;
      } while (minimum_shelf_space <= (model_height_array[which - 1] - sockle_height - furniture_thickness * (shelf_max + 2)) / (shelf_max + 1));

      return shelf_max - 1;
  }

  function board_builder(column, times) {
      board[column - 1] = []; // destroy objects
      space[column - 1] = []; // destroy spaces
      board[column - 1][0] = new board_object(column, sockle_height + furniture_thickness, furniture_thickness); //build bottom board
      space[column - 1][0] = new space_object(column, 1);

      for (var run_shelf = 1; run_shelf <= times; run_shelf++) { //build inner boards
          // add half the thickness of the previous board, thickness of the current board, Y position of the previous board
          var fix_position_y = board[column - 1][run_shelf - 1].thickness / 2 + furniture_thickness + board[column - 1][run_shelf - 1].y;
          board[column - 1].push(new board_object(column, fix_position_y + space_array[column - 1][run_shelf - 1], furniture_thickness));
          space[column - 1][run_shelf] = new space_object(column, run_shelf + 1);
      }

      board[column - 1].push(new board_object(column, model_height_array[column - 1], furniture_thickness, 'last')); // create fanthom board
  }

  function object_remover(column, space) { // remove objects (doors, drawers) from the column
      var counter = 0;
      if (space == null) { // if space(board) was not specified, remove all objects in the column
          while (door[counter] != null) {
              if (door[counter].column === column) {
                  door.splice(counter, 1); // remove the doors
                  counter--;
              }
              counter++;
          }
          counter = 0;
          while (hanger[counter] != null) {
              if (hanger[counter].column === column) {
                  hanger.splice(counter, 1); // remove hangers
                  counter--;
              }
              counter++;
          }
          counter = 0;
          while (divider[counter] != null) {
              if (divider[counter].column === column) {
                  divider.splice(counter, 1); // remove divider
                  counter--;
              }
              counter++;
          }
          counter = 0;
          while (cubic[counter] != null) {
              if (cubic[counter].column === column) {
                  cubic.splice(counter, 1); // remove cubic
                  counter--;
              }
              counter++;
          }
      } else {
          var boardPos = board[column - 1][space].y; // get board position
          var doorPos_btm; // check door lower edge position
          var doorPos_top; // check door upper edge position
          while (door[counter] != null) {
              if (x_overlap(column, column, door[counter].column, door[counter].columnEnd)) {
                  doorPos_btm = board[door[counter].column - 1][door[counter].start - 1].y;
                  doorPos_top = board[door[counter].column - 1][door[counter].end - 1].y;
                  if (doorPos_btm === boardPos || doorPos_top === boardPos) {
                      door.splice(counter, 1); // remove doors above and below board
                      counter--;
                  }
              }
              counter++;
          }
          counter = 0;
          while (hanger[counter] != null) {
              if (hanger[counter].column === column && (hanger[counter].space === space || hanger[counter].space === space + 1)) {
                  hanger.splice(counter, 1); // remove hangers above and below board
                  counter--;
              }
              counter++;
          }
          counter = 0;
          while (divider[counter] != null) {
              if (divider[counter].column === column && (divider[counter].space === space || divider[counter].space === space + 1)) {
                  divider.splice(counter, 1); // remove dividers above and below board
                  counter--;
              }
              counter++;
          }
          counter = 0;
          while (cubic[counter] != null) {
              if (cubic[counter].column === column && (cubic[counter].space === space || cubic[counter].space === space + 1)) {
                  cubic.splice(counter, 1); // remove cubics above and below board
                  counter--;
              }
              counter++;
          }
      }
  }

  function round(value, decimals) {
      decimals = decimals || 0;
      return (Math.floor(value * Math.pow(10, decimals)) / Math.pow(10, decimals));
  }
 