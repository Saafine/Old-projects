/* global model_height_array, model_width_array, model_depth_array, model_shelf_array, board, minimum_shelf_space, sockle_height, furniture_thickness, space_array, scene, model_max_height, minimum_model_height, minimum_model_depth, model_max_depth, maximum_space_width, minimum_space_width, maximum_model_height, maximum_model_depth, model_columns, backwall_active, door, model_width, active_door_texture, active_backwall_texture, maximum_model_width, minimum_model_width, model_height, model_depth, model_standingByWall, model_cutoutwall, model_coutoutheight, model_coutoutwidth, maximum_cutout_height, maximum_cutout_width, wall, backwall,  sockle, sliding_door, sliding_door_width, model_space_array, materialDOOR, scene_box_dr, counter, visibility_clicked_dr, sliding_door_height, BABYLON, model_tabletop, tabletop, furniture_thickness_1, furniture_thickness_2 */
$(document).ready(function () {
    $(document).on('focusin', '.check_value', function () {
        var focus = parseFloat($(this).val());
        $(this).val(focus); // clear input
    }).on('blur', '.check_value', function () {
        var val = $(this).val();
        if (val === '') {
            switch (this.id) {
                //STEP 1 STARTS
                case ('user_init_slider_height_input'):
                    $(this).val(model_height + ' ' + global_text['cm']);
                    break;
                case ('user_init_slider_width_input'):
                    $(this).val(model_width + ' ' + global_text['cm']);
                    break;
                case ('user_init_slider_depth_input'):
                    $(this).val(model_depth + ' ' + global_text['cm']);
                    break;
                case ('user_init_slider_shelves_input'):
                    $(this).val(model_shelf_array[0]);
                    break;
                case('user_init_slider_columns_input'):
                    $(this).val(model_columns);
                    break;
                //STEP 2 STARTS
                case('user_edit_slider_height_input'):
                    $(this).val(model_height_array[global_which - 1] + ' ' + global_text['cm']);
                    break;
                case('user_edit_slider_width_input'):
                    $(this).val(model_width_array[global_which - 1].toFixed(1) + ' ' + global_text['cm']);
                    break;
                case('user_edit_slider_depth_input'):
                    $(this).val(model_depth_array[global_which - 1] + ' ' + global_text['cm']);
                    break;
                case('user_edit_slider_shelves_input'):
                    $(this).val(model_shelf_array[global_which - 1]);
                    break;
                case('user_edit_slider_spaceheight_input'):
                    $(this).val(space_array[global_which - 1][global_space - 1].toFixed(1) + ' ' + global_text['cm']);
                    break;
                default:
                    console.log('check value class failure');
            }
        } else {
            val = parseFloat(val);
            if (isNaN(val)) {
                return;
            }
            var min;
            var max;

            switch (this.id) {
// ---------------------------------------------- STEP 1 STARTS ---------------------------------------------- 
                case ('user_init_slider_height_input'):
                    if (val < minimum_model_height) { // set minimum value if user_input is too small
                        val = minimum_model_height;
                    } else if (val > maximum_model_height) { // set maximum value if user_input is too big
                        val = maximum_model_height;
                    }

                    model_height = val;
                    update_slider('init_height', val, minimum_model_height, maximum_model_height);
                    user_init();
                    break;

                case ('user_init_slider_width_input'):
                    if (val < minimum_model_width) { // set minimum value if user_input is too small
                        val = minimum_model_width;
                    } else if (val > maximum_model_width) { // set maximum value if user_input is too big
                        val = maximum_model_width;
                    }

                    model_width = val;
                    update_slider('init_width', val, minimum_model_width, maximum_model_width);
                    user_init('change_width');
                    break;

                case ('user_init_slider_depth_input'):
                    if (val < minimum_model_depth) { // set minimum value if user_input is too small
                        val = minimum_model_depth;
                    } else if (val > maximum_model_depth) { // set maximum value if user_input is too big
                        val = maximum_model_depth;
                    }

                    model_depth = val;
                    update_slider('init_depth', val, minimum_model_depth, maximum_model_depth);
                    user_init();
                    break;

                case('user_init_slider_columns_input'):
                    if (val < minimum_columns) { // set minimum value if user_input is too small
                        val = minimum_columns;
                    } else if (val > maximum_columns) { // set maximum value if user_input is too big
                        val = maximum_columns;
                    }

                    update_slider('init_columns', val, minimum_columns, maximum_columns);
                    user_init();
                    break;

                case('user_init_slider_shelves_input'):
                    var shelf_max = check_maximum_shelves(1);
                    if (val < 0) { // set minimum value if user_input is too small
                        val = 0;
                    } else if (val > shelf_max) { // set maximum value if user_input is too big
                        val = shelf_max;
                    }

                    update_slider('init_shelves', val, 0, shelf_max);
                    user_init();
                    break;
// ---------------------------------------------- STEP 1 ENDS ---------------------------------------------- 

// ---------------------------------------------- STEP 2 STARTS ---------------------------------------------- 
                case('user_edit_slider_height_input'):
                    if (val < minimum_model_height) { // set minimum value if user_input is too small
                        val = minimum_model_height;
                    } else if (val > maximum_model_height) { // set maximum value if user_input is too big
                        val = maximum_model_height;
                    }

                    update_slider('edit_height', val, minimum_model_height, maximum_model_height);
                    user_decision('fh', global_which);
                    break;

                case('user_edit_slider_width_input'):
                    var min = parseFloat($('#user_edit_slider_width_min').html());
                    var max = parseFloat($('#user_edit_slider_width_max').html());

                    if (val < min) { // set minimum value if user_input is too small
                        val = min;
                    } else if (val > max) { // set maximum value if user_input is too big
                        val = max;
                    }

                    update_slider('edit_width', val, min, max);
                    user_decision('sw', global_which, global_space);
                    break;

                case('user_edit_slider_depth_input'):
                    if (val < minimum_model_depth) { // set minimum value if user_input is too small
                        val = minimum_model_depth;
                    } else if (val > maximum_model_depth) { // set maximum value if user_input is too big
                        val = maximum_model_depth;
                    }

                    update_slider('edit_depth', val, minimum_model_depth, maximum_model_depth);
                    user_decision('fd', global_which);
                    break;

                case('user_edit_slider_shelves_input'):
                    var shelf_max = check_maximum_shelves(global_which);

                    if (val < 0) { // set minimum value if user_input is too small
                        val = 0;
                    } else if (val > shelf_max) { // set maximum value if user_input is too big
                        val = shelf_max;
                    }

                    update_slider('edit_shelves', val, 0, shelf_max);
                    user_decision('fs', global_which);
                    break;

                case('user_edit_slider_spaceheight_input'):
                    var max = parseFloat($('#user_edit_slider_spaceheight_max').html());

                    if (val < minimum_shelf_space) { // set minimum value if user_input is too small
                        val = minimum_shelf_space;
                    } else if (val > max) { // set maximum value if user_input is too big
                        val = max;
                    }

                    update_slider('edit_spaceheight', val, minimum_shelf_space, max);
                    user_decision('sh', global_which, global_space);
                    break;
                case('user_add_slider_cubic_input'):
                    max = parseFloat($('#user_add_slider_cubic_max').html());
                    min = parseFloat($('#user_add_slider_cubic_min').html());

                    if (val < min) {
                        val = min;
                    } else if (val > max) {
                        val = max;
                    }
                    update_slider('add_cubic', val, min, max);
                    break;
                default:
                    alert('check value blur switch failure ' + this.id);
            }
// ---------------------------------------------- STEP 2 ENDS ---------------------------------------------- 
        }
    }).on('keyup', '.check_value', function () { // ALLOW NUMBERS AND 1 COMMA ONLY
        var val = $(this).val();
        switch (this.id) {
            case('user_edit_slider_width_input'):
            case('user_edit_slider_spaceheight_input'):
                val = val.replace(/[^0-9.]/g, ''); // allow full space and numbers, !update: should allow 1 fullspace only
                break
            default:
                val = val.replace(/[^0-9]/g, ''); // allow whole numbers only
        }
        $(this).val(val);

    }).on('keypress', '.check_value', function (e) { // blur if enter pressed
        if (e.which == 13) {
            $(this).blur();
        }
    });
});

function user_init(mode) {
    model_height_array = [];
    model_width_array = [];
    model_depth_array = [];
    model_shelf_array = [];

    board = [];
    space = [];
    door = [];
    space_array = [];
    hanger = [];
    divider = [];
    sliding_door = null;
    cubic = [];

    if ($('#user_init_thickness').is(':checked')) {
        furniture_thickness = furniture_thickness_2;
    } else {
        furniture_thickness = furniture_thickness_1;
    }

    if (mode === 'init') {
        var current_columns = check_maximum_columns(3);
        model_columns = current_columns;
        update_slider('init_columns', model_columns, minimum_columns, maximum_columns);
    } else if (mode === 'change_width' || mode === 'change_thickness') {
        var current_columns = check_maximum_columns(model_columns);
        model_columns = current_columns;
        update_slider('init_columns', current_columns, minimum_columns, maximum_columns);
    } else {
        var get_current_columns = document.getElementById('user_init_slider_columns').noUiSlider.get(); // get user input
        get_current_columns = parseInt(get_current_columns);
        model_columns = get_current_columns;
    }

    if ($('#user_init_sockle').is(':checked')) {
        sockle_height = 4.5;
    } else {
        sockle_height = 0;
    }

// SHELF SETTER STARTS (reset for new height)
    model_height_array[0] = model_height;
    var shelf_max = check_maximum_shelves(1);
    var shelf_number;

    if (mode !== 'init') {
        shelf_number = document.getElementById('user_init_slider_shelves').noUiSlider.get();
        ;
        shelf_number = parseInt(shelf_number);
        if (shelf_number > shelf_max) {
            shelf_number = shelf_max;
        }
    } else {
        shelf_number = 5;
        if (shelf_number > shelf_max) {
            shelf_number = shelf_max;
        }
    }
    update_slider('init_shelves', shelf_number, 0, shelf_max);
// SHELF SETTER ENDS

    for (var run_col = 1; run_col <= model_columns; run_col++) { // set default
        model_height_array[run_col - 1] = model_height;
        model_depth_array[run_col - 1] = model_depth;
        model_shelf_array.push(shelf_number);
        board[run_col - 1] = [];
        space[run_col - 1] = [];
        space_array[run_col - 1] = [];
        space_array[run_col - 1] = normalize(model_height_array[run_col - 1], shelf_number, 'shelf'); // !update that could only be called once, using model_height only

        if (run_col === 1 && model_columns > 1) {
            model_width_array = normalize(model_width, model_columns, 'width');
        } else if (model_columns === 1) {
            model_width_array[0] = model_width - 2 * (furniture_thickness);
        }
        board_builder(run_col, shelf_number); //build top/bottom boards
    }

    if (mode !== 'init') {
        scene.dispose();
        scene = null; // clear the scene
        scene = createScene(); // recreate the scene 
    }
}

function load_div(load) {
    step = load; // steps: DIMENSIONS/MATERIALS/BACKWALL etc
    var to_top_div = '#top_options';
    // HIDE TOP OPTIONS START, same as in load_column()
    var load_all_TOP_divs = '#top_options_';
    var hidden_wrapper_TOP_div = '#top_options_hidden';

    var counter = 1;
    while ($(load_all_TOP_divs + counter).length) {
        $(load_all_TOP_divs + counter).detach().appendTo(hidden_wrapper_TOP_div);
        $(load_all_TOP_divs + counter + '_init').detach().appendTo(hidden_wrapper_TOP_div);
        counter++;
    }
    // HIDE TOP OPTIONS ENDS

    for (var run_tab = 1; run_tab <= 7; run_tab++) {
        $('#top_tab_' + run_tab).removeClass('x-tab-current');
    }

    if (step === 8 || step === 9) {
        $('#top_tab_' + 7).addClass('x-tab-current');
    } else {
        $('#top_tab_' + step).addClass('x-tab-current');
    }

    // Show called option
    if (step === 1 || step === 5) { // this part copies bottom options from step 2 into current step. It ignores _init, so go to load_column function
    } else {
        $(load_all_TOP_divs + load + '_init').detach().appendTo(to_top_div);
    }

    $('#left_and_middle_2_wrap').show();
    $('#main_section_summary').hide();

    switch (load) {
        case 1:
            check_maximum_columns();
            var shelf_max = check_maximum_shelves(1);

            update_slider('init_height', model_height, minimum_model_height, maximum_model_height);
            update_slider('init_width', model_width, minimum_model_width, maximum_model_width);
            update_slider('init_depth', model_depth, minimum_model_depth, maximum_model_depth);
            update_slider('init_columns', model_columns, minimum_columns, maximum_columns);
            update_slider('init_shelves', model_shelf_array[0], 0, shelf_max);

            if (furniture_thickness === furniture_thickness_2) {
                $('#user_init_thickness').prop('checked', true);
            } else {
                $('#user_init_thickness').prop('checked', false);
            }
            if (sockle_height > 0) {
                $('#user_init_sockle').prop('checked', true);
            } else {
                $('#user_init_sockle').prop('checked', false);
            }
            load_column(1);
            break;
        case 2:
            break;
        case 3:
            load_column(1);
            break;
        case 4:
            load_column(1);
            break;
        case 5:
            if (model_tabletop === 'over') {
                $('#user_tabletop').prop('checked', true);
            } else {
                $('#user_tabletop').prop('checked', false);
            }
            load_column(1); // 
            break;
        case 6:
            $('#left_and_middle_2_wrap').hide();
            $('#main_section_summary').show();

            summary();
            break;
        case 7:
            load_column(1);
            break;
        case 8:
            load_column(1);
            break;
        case 9:
            load_column(1);
            break;
        default:
            alert('load div failure');
    }

    if (scene != null && step !== 6) {
        engine.resize();
        scene.dispose();
        scene = null; // clear the scene
        scene = createScene(); // recreate the scene
    }
}

function options_pick(group, texture, mode) {
    var icon_container = 'color_options_selected_';
    var index;

    switch (group) {
        case('material'):
            index = 2;
            break;
        case('backwall'):
            index = 3;
            break;
        case('door'):
            index = 4;
            break;
        default:
            alert('options_pick error group: ' + group);
    }

    // current material/backwall texture icon setter
    var data_icon = '<i id="' + icon_container + index + '" class="fa fa-check-circle t-okay-icon" aria-hidden="true"></i>';
    $('div[data-group="' + group + '"]').each(function () {
        if ($(this).attr('data-texture') === texture) {
            $('#' + icon_container + index).remove();
            $(this).children('.t-flex-left').prepend(data_icon); // prepends icon to the children of div with specified data group
            return false; // break the loop
        }
    });

    // summary sections
    var user_current = '#user_current_' + group;
    var user_current_color = '#user_color_' + group;

    switch (index) { // can be replaced with step
        case 2:
            active_texture = texture;
            $(user_current).attr('src', textures_dest + active_texture + '.jpg');
            $(user_current_color).html(global_textures[active_texture]);
            break;
        case 3:
            active_backwall_texture = texture;
            $(user_current).attr('src', textures_dest + active_backwall_texture + '.jpg');
            $(user_current_color).html(global_textures[active_backwall_texture]);
            break;
        case 4:
            var counter = 0;
            var count = 0;
            while (scene_box_dr[counter] != null) {
                if (scene_box_dr[counter].visibility === visibility_clicked_dr) {
                    if (texture === 'glass') {
                        if (door[counter].type !== 'door' && door[counter].type !== 'doubleLEFT' && door[counter].type !== 'doubleRIGHT') {
                            modal.open('user_modal_64');
                            return;
                        }
                    }

                    door[counter].texture = texture;
                    count++;
                }
                counter++;
            }

            if (sliding_door != null && scene_box_sld.visibility === visibility_clicked) {
                if (texture === 'glass') {
                    modal.open('user_modal_64');
                    return;
                }
                sliding_door.texture = texture;
                count++;
            }

            for (var x = 0; x < cubic.length; x++) {
                var box_index = x * 4;
                if (scene_box_cubi[box_index].visibility === visibility_clicked_dr) {
                    if (texture === 'glass') {
                        modal.open('user_modal_64');
                        return;
                    }
                    cubic[x].texture = texture;
                    count++;
                }
            }

            if (count === 0) {
                // select a door to change color
                modal.open('user_modal_42');
                return;
            } else {
                $(user_current).attr('src', textures_dest + texture + '.jpg');
                $(user_current_color).html(global_textures[texture]);
            }
            break;
        default:
            alert('options pick switch group failure');
    }

    if (mode !== 'init') {
        scene.dispose();
        scene = null; // clear the scene
        scene = createScene(); // recreate the scene
    }
}

function load_column(which, space) { // which -> column, space -> space, remove is used in step 4 (which doors to remove)
    global_which = parseInt(which); // trigger block passes information which trigger block was clicked
    global_space = parseInt(space); // these values can be removed and replaced in trigger_block builder. Those are needed in check_value input

    // LOAD TOP OPTIONS START, same as in load_div()
    var load_all_TOP_divs = '#top_options_';
    var load_TOP_div = '#top_options_' + step;
    var to_TOP_div = '#top_options';
    var hidden_wrapper_TOP_div = '#top_options_hidden';

    // HIDE ALL TOP OPTIONS START
    var counter = 1;
    while ($(load_all_TOP_divs + counter).length) {
        $(load_all_TOP_divs + counter).detach().appendTo(hidden_wrapper_TOP_div);
        $(load_all_TOP_divs + counter + '_init').detach().appendTo(hidden_wrapper_TOP_div);
        counter++;
    }
    //HIDE ALL TOP OPTIONS END

    $(load_TOP_div).detach().appendTo(to_TOP_div);

    switch (step) {
        case 1:
            break; // step 1 and 5 loads nothing. Load nothing, check load_div function (show called option part)
        case 2:
            var title_dim_div = '#user_input_title_dim';
            var title_space_div = '#user_input_title_space';
            var title_text_dim = which;
            var title_text_space = space;
            var space_width_div = '#user_space_width';
            var space_height_div = '#user_space_height';

            $(title_dim_div).html(title_text_dim);
            $(title_space_div).html(title_text_space);


            //SET HEIGHT SLIDER
            update_slider('edit_height', model_height_array[which - 1], minimum_model_height, maximum_model_height);

            //SET WIDTH SLIDER
            if (model_columns === 1) {
                update_slider('edit_width', model_width_array[which - 1], model_width_array[which - 1], model_width_array[which - 1]);
                $('#user_edit_slider_width_input').css('background', '#eeeeee');
                $('#user_edit_slider_width_input').css('cursor', 'no-drop');
                $('#user_edit_slider_width_input').prop('disabled', true);
            } else {
                var width_range = append_values(space_width_div, which, space); // return min and max space height for given column and space
                width_range[0] = parseFloat(width_range[0]);
                width_range[1] = parseFloat(width_range[1]);
                update_slider('edit_width', model_width_array[which - 1], width_range[0], width_range[1]);
                $('#user_edit_slider_width_input').css('background', 'white');
                $('#user_edit_slider_width_input').css('cursor', 'auto');
                $('#user_edit_slider_width_input').prop('disabled', false);
            }
            //SET SHELVES SLIDER
            var shelf_max = check_maximum_shelves(which);
            update_slider('edit_shelves', model_shelf_array[which - 1], 0, shelf_max);
            //SET SPACEHEIGHT SLIDER
            if (model_shelf_array[which - 1] > 0) {
                var height_range = append_values(space_height_div, which, space); // return min and max space height for given column and space
                height_range[0] = parseFloat(height_range[0]);
                height_range[1] = parseFloat(height_range[1]);
                update_slider('edit_spaceheight', space_array[which - 1][space - 1], height_range[0], height_range[1]);
                //document.getElementById('user_edit_slider_spaceheight').removeAttribute('disabled');
                $('#user_edit_slider_spaceheight_input').css('background', 'white');
                $('#user_edit_slider_spaceheight_input').css('cursor', 'auto');
                $('#user_edit_slider_spaceheight_input').prop('disabled', false);
            } else {
                update_slider('edit_spaceheight', space_array[which - 1][space - 1], space_array[which - 1][space - 1], space_array[which - 1][space - 1]);
                //document.getElementById('user_edit_slider_spaceheight').setAttribute('disabled', true);
                $('#user_edit_slider_spaceheight_input').css('background', '#eeeeee');
                $('#user_edit_slider_spaceheight_input').css('cursor', 'no-drop');
                $('#user_edit_slider_spaceheight_input').prop('disabled', true);
            }
            break;
        case 3:
            break;
        case 4:
            break;
        case 5:
            break; // step 1 and 5 loads nothing
        case 6:
            break;
        case 7:
            break;
        case 8:
            break;
        case 9:
            break;
        default:
            alert('switch failure in load columns');
    }
}

function append_values(where, column, space) { // called when user clicks on ACTION block
    switch (where) {
        case('#user_space_width'):
            var column = column - 1;
            if (column === model_columns - 1) {
                var modify_column = model_columns - 2;
            } else { // modify previous column
                var modify_column = column + 1;
            }
            var this_column_value = model_width_array[column];
            var modifiy_column_value = model_width_array[modify_column]; // 36-16    36-20=16
            var this_maximum_space_width = this_column_value + (modifiy_column_value - minimum_space_width);// local maximum
            var this_minimium_space_width = minimum_space_width;

            if (this_maximum_space_width > maximum_space_width) { // dont exceed maximum space width limit
                this_minimium_space_width = minimum_space_width + (this_maximum_space_width - maximum_space_width);
                this_maximum_space_width = maximum_space_width;
            }

            return [this_minimium_space_width.toFixed(1), this_maximum_space_width.toFixed(1)];
            break;
        case ('#user_space_height'):
            var column = column - 1;
            var space = space - 1;

            if (space === model_shelf_array[column]) { // modify next column
                var modify_space = model_shelf_array[column] - 1;
            } else { // modify previous column
                var modify_space = space + 1;
            }

            var this_space_value = space_array[column][space];
            var modified_space_value = space_array[column][modify_space];
            var this_maximum_space_height = this_space_value + (modified_space_value - minimum_shelf_space);
            return [minimum_shelf_space.toFixed(1), this_maximum_space_height.toFixed(1)];
            break;
        default:
            alert(where + ' - appending values failure');
    }

}

function save_current_dimensions() {
    var save_div = '#current';
    var counter;
    $(save_div).empty();
    $(save_div).append('<div id="load_model_height">' + model_height + '</div>');//max height
    $(save_div).append('<div id="load_model_width">' + model_width + '</div>');
    $(save_div).append('<div id="load_model_depth">' + model_depth + '</div>');//max depth
    $(save_div).append('<div id="load_sockle_height">' + sockle_height + '</div>');
    $(save_div).append('<div id="load_furniture_thickness">' + furniture_thickness + '</div>');
    $(save_div).append('<div id="load_model_columns">' + model_columns + '</div>');
    $(save_div).append('<div id="load_model_tabletop">' + model_tabletop + '</div>');
    $(save_div).append('<div id="load_active_texture">' + active_texture + '</div>');
    $(save_div).append('<div id="load_active_backwall_texture">' + active_backwall_texture + '</div>');
    //$(save_div).append('<div id="load_model_standingByWall">'+model_standingByWall+'</div>');
    $(save_div).append('<div id="store_id">' + $('#store_id').html() + '</div>');
    save_single_data('model_height_array');
    save_single_data('model_depth_array');
    save_single_data('model_width_array');
    save_single_data('model_shelf_array');

    if (sliding_door != null) {// builder the same
        $(save_div).append('<div id="load_sliding_door">' + sliding_door.lowestColumn + ',' + sliding_door.lowestSpace + ',\n\
        ' + sliding_door.highestColumn + ',' + sliding_door.highestSpace + ',' + sliding_door.startDoor + ',' + sliding_door.endDoor + ',' + sliding_door.startRailing + ',' + sliding_door.endRailing + ',' + sliding_door.texture + '</div>');
    }

    function save_single_data(what) {
        var save_inner_id = '<div id="load_' + what + '"></div>';
        var save_inner_div = '#load_' + what;
        $(save_div).append(save_inner_id);
        counter = 0;
        while (this[what][counter] != null) {
            $(save_inner_div).append(this[what][counter]);
            if (this[what][counter + 1] != null) { // skip ';' if its the last element in an array
                $(save_inner_div).append(';');
            }
            counter++;
        }
    }

    save_multi_data('space_array');
    function save_multi_data(what) {
        for (run_col = 0; run_col < model_columns; run_col++) {
            var save_inner_id = '<div id="load_' + what + '_' + run_col + '"></div>'; // create inner id for every column
            var save_inner_div = '#load_' + what + '_' + run_col;
            $(save_div).append(save_inner_id);
            counter = 0;
            while (this[what][run_col][counter] != null) {
                $(save_inner_div).append(this[what][run_col][counter]);
                if (this[what][run_col][counter + 1] != null) { // skip ';' if its the last element in an array
                    $(save_inner_div).append(';');
                }
                counter++;
            }
        }
    }

    counter = 0;
    while (door[counter] != null) { // if doors exist
        var save_inner_id = '<div id="load_door_object_' + counter + '"></div>'; // create inner id for every column
        var save_inner_div = '#load_door_object_' + counter;
        $(save_div).append(save_inner_id);
        $(save_inner_div).append(door[counter].column + ',' + door[counter].start + ',' + door[counter].end + ',' + door[counter].type + ',' + door[counter].texture + ',' + door[counter].columnEnd + ',' + door[counter].open);
        counter++;
    }

    counter = 0;
    while (hanger[counter] != null) { // if hangers exist
        var save_inner_id2 = '<div id="load_hanger_object_' + counter + '"></div>';
        var save_inner_div2 = '#load_hanger_object_' + counter;
        $(save_div).append(save_inner_id2);
        $(save_inner_div2).append(hanger[counter].column + ',' + hanger[counter].space + ',' + hanger[counter].type);
        counter++;
    }

    counter = 0;
    while (divider[counter] != null) { // if divider exist
        var save_inner_id3 = '<div id="load_divider_object_' + counter + '"></div>';
        var save_inner_div3 = '#load_divider_object_' + counter;
        $(save_div).append(save_inner_id3);
        $(save_inner_div3).append(divider[counter].column + ',' + divider[counter].space + ',' + divider[counter].position);
        counter++;
    }

    counter = 0;
    while (cubic[counter] != null) { // if cubic exists
        var save_inner_id4 = '<div id="load_cubic_object_' + counter + '"></div>';
        var save_inner_div4 = '#load_cubic_object_' + counter;
        $(save_div).append(save_inner_id4);
        $(save_inner_div4).append(cubic[counter].column + ',' + cubic[counter].space + ',' + cubic[counter].width + ',' + cubic[counter].texture);
        counter++;
    }
}

function check_maximum_columns(current_columns) {
    maximum_columns = 1;
    minimum_columns = 1;

    while (((model_width - furniture_thickness) / minimum_columns) - furniture_thickness >= maximum_space_width) {
        minimum_columns++; // set minimum ccholumns possible
    }

    maximum_columns = minimum_columns;

    while (((model_width - furniture_thickness) / maximum_columns) - furniture_thickness >= minimum_space_width) {
        maximum_columns++; // set maximum columns possible
    }
    maximum_columns--;

    if (maximum_columns === 0) {
        maximum_columns = 1;
    }

    if (current_columns != null) {
        current_columns = parseInt(current_columns);
        if (minimum_columns <= current_columns && current_columns <= maximum_columns) {
            return current_columns;
        } else {
            return minimum_columns;
        }
    }
}

function summary() {
    var order_height = '#order_height_max';
    var order_width = '#order_width_max';
    var order_depth = '#order_depth_max';
    var order_material = '#order_material';
    var order_door = '#order_door';
    var order_backwall = '#order_backwall';
    var order_dimensions = '#order_dimensions';

    var this_maximum_heigth = model_height;
    var this_maximum_depth = model_depth;
    var this_material_texture = global_textures[active_texture];
    var this_backwall_texture = global_textures[active_backwall_texture];
    var this_door_texture = null;
    var counter = 0;
    $(order_door).empty();
    while (door[counter] != null) {
        if (this_door_texture !== null && this_door_texture !== global_textures[door[counter].texture]) {
            $(order_door).html(global_textures['many_colors']);
            break;
        }
        this_door_texture = global_textures[door[counter].texture];
        $(order_door).html(this_door_texture);
        counter++;
    }

    if (door[0] == null) { // if doors dont exist
        $(order_door).html(global_textures['none']);
    }

    $(order_height).html(this_maximum_heigth + ' ' + global_text['cm']);
    $(order_width).html(model_width + ' ' + global_text['cm']);
    $(order_depth).html(this_maximum_depth + ' ' + global_text['cm']);
    $(order_material).html(this_material_texture);
    $(order_backwall).html(this_backwall_texture);

    $(order_dimensions).empty();
    var this_row = 't_row';
    for (var run_col = 1; run_col <= model_columns; run_col++) {
        $(order_dimensions).append('<tr id="' + this_row + run_col + '"></tr>');
        $('#' + this_row + run_col).append('<td>' + run_col + '</td>'); // append column
        $('#' + this_row + run_col).append('<td>' + model_height_array[run_col - 1] + '</td>'); // append this depth
        $('#' + this_row + run_col).append('<td>' + model_width_array[run_col - 1].toFixed(1) + '</td>'); // append this width
        $('#' + this_row + run_col).append('<td>' + model_depth_array[run_col - 1] + '</td>'); // append this depth
        $('#' + this_row + run_col).append('<td>' + model_shelf_array[run_col - 1] + '</td>'); // append this depth
    }
}

function get_material_price(texture) {
    var veneer_oak = 12;
    var veneer_ash = 15;
    var veneer_walnut = 27;
    var laq = 8;
    var stain = 10;
    var paint = 15;
    var paint2 = 24;
    var glass = 50;
    var price;

    switch (texture) {
        case ('oak-light'):
            price = veneer_oak + laq + stain;
            break;
        case ('oak'):
            price = veneer_oak + laq;
            break;
        case ('oak-bronze'):
            price = veneer_oak + laq + stain;
            break;
        case ('oak-cherry'):
            price = veneer_oak + laq + stain;
            break;
        case ('ash'):
            price = veneer_ash + laq;
            break;
        case ('walnut'):
            price = veneer_walnut + laq + stain;
            break;
        case ('glass'):
            price = glass;
            break;
        case ('7016'):
            price = paint2;
            break;
        case ('2002'):
            price = paint2;
            break;
        case ('5015'):
            price = paint2;
            break;
        case ('6005'):
            price = paint2;
            break;
        case ('3015'):
            price = paint2;
            break;
        case ('7035'):
            price = paint2;
            break;
        case ('1018'):
            price = paint2;
            break;
        case ('5011'):
            price = paint2;
            break;
        case ('9005'):
            price = paint2;
            break;
        case ('9003'):
            price = paint;
            break;
        case ('white'):
            price = 0;
            break;
        case ('NCSS1050-B30G'):
            price = paint2;
            break;
        default:
            alert('unknown texture');
    }

    return price;
}

function user_save(btn) {
    // btn turn off
    var clicked = $(btn);
    var clicked_text = clicked.html();
    var clicked_action = clicked.attr('onclick');
    clicked.attr('onclick', '');
    clicked.html('Zapisywanie');

    // save data
    var save_current = '<div id="load" style="display:none;">' + $('#current').html() + '</div>';
    var pathname = window.location.pathname; // in effect:
    var php_var = '?conf=';

    $.ajax({ // AJAX
        url: 'php/save.php', // pass the data
        type: "POST",
        data: {
            save: save_current
        },

        success: function (data) { // call back with data
            history.pushState('data', '', pathname + php_var + data);
            // configuration saved on link
            modal.open('user_modal_43', [window.location.href]);
            // btn turn on
            clicked.html(clicked_text);
            clicked.attr('onclick', clicked_action);
        }
    });
}


function get_current_price() {
    var thick25 = 36;
    var thick18 = 25;
    var HDF = 11;
    var material_price = 0;

    if (furniture_thickness === furniture_thickness_2) {
        material_price = thick25;
    } else {
        material_price = thick18;
    }

    // accessories prices
    var door_hinges_price = 8; // per hinge
    var drawer_price = 80; // without sync
    var flap_price = 100;
    var drawer_wide_price = 120; // with sync
    var board_accs_price = 5; // per board
    var board_accs_wide_price = 9;

    var hanger_accs_price = 20;
    var sockle_accs_price = 3; // 4 on 1 meter
    var divider_accs_price = 2;
    var slider_accs_price = 180;

    //this model price
    var door_hinges = 0;
    //sqrs
    var sliding_door_total = 0;
    var door_total = 0;
    var wall_e_square = 0;
    var wall_square = 0;
    var sockle_square = 0;
    var dividers_square = 0;
    var backwall_square = 0;
    var tabletop_square = 0;
    var get_total_board_sq = 0;
    var door_total_square = 0;
    var door_total_material = 0;
    var door_finish_price = 0;
    var door_finish = 0;
    var door_total_finish = 0;
    var temp_door_accs_price = 0;
    var temp_drawer_price = 0;
    var door_total_accs = 0;
    //ACCESSORIES START        
    // board accs
    var count_boards = 0;
    var count_wide_boards = 0;
    for (run_col = 0; run_col < model_columns; run_col++) {
        if (model_depth_array[run_col] < 55) {
            count_boards = count_boards + model_shelf_array[run_col];
        } else {
            count_wide_boards = count_wide_boards + model_shelf_array[run_col];
        }

        for (run_shelf = 0; run_shelf <= model_shelf_array[run_col]; run_shelf++) { // doesn't count 1 fanthom board (tabletop)
            get_total_board_sq = get_total_board_sq + board[run_col][run_shelf].sq;
        }
    }
    var tabletop_accs_total = tabletop.length * board_accs_price;
    var hanger_accs_total = hanger.length * hanger_accs_price;
    var board_accs_total = count_boards * board_accs_price + count_wide_boards * board_accs_wide_price;
    var divider_accs_total = (divider.length + wall_e.length) * divider_accs_price;
    var sockle_accs_total = (model_width / 100) * sockle_accs_price;
    var price_accs_total = board_accs_total + hanger_accs_total + sockle_accs_total + divider_accs_total + tabletop_accs_total;
    //ACCESSORIES OVER

    //SQUARES START
    //get wall sq
    for (run_col = 0; run_col <= model_columns; run_col++) {
        wall_square = wall_square + wall[run_col].sq;
    }

    // get tabletop sq
    var counter = 0;
    while (tabletop[counter] != null) {
        tabletop_square = tabletop_square + tabletop[counter].sq;
        counter++;
    }

    // get wall_e sq
    var counter = 0;
    while (wall_e[counter] != null) {
        wall_e_square = wall_e_square + wall_e[counter].sq;
        counter++;
    }

    // get dividers sq
    var counter = 0;
    while (divider[counter] != null) {
        dividers_square = dividers_square + divider[counter].sq;
        counter++;
    }

    // get sockle sq
    var counter = 0;
    while (sockle[counter] != null) {
        sockle_square = sockle_square + sockle[counter].sq;
        counter++;
    }

    // get backwall sq
    var counter = 0;
    while (backwall[counter] != null) {
        backwall_square = backwall_square + backwall[counter].sq;
        counter++;
    }

    //SQUARES OVER
    var board_finish_price = get_material_price(active_texture);
    var board_square = wall_square + get_total_board_sq + wall_e_square + dividers_square + sockle_square + tabletop_square;
    var board_total_material = board_square * material_price;
    var board_total_finish = board_square * 2 * board_finish_price;

    // ADD BACKWALL STARTS
    var backwall_finish_price = get_material_price(active_backwall_texture);
    var backwall_total_material = backwall_square * HDF;
    var backwall_total_finish = backwall_square * backwall_finish_price;
    // ADD BACKWALL ENDS 

    // doors doors price
    var counter = 0;
    while (door[counter]) {
        door_total_square = door_total_square + door[counter].sq;
        door_total_material = door_total_material + door[counter].sq * thick18;
        door_finish_price = get_material_price(door[counter].texture);
        door_finish = door[counter].sq * 2 * door_finish_price;
        door_total_finish = door_total_finish + door_finish;
        if (door[counter].type === 'door' || door[counter].type === 'doubleLEFT' || door[counter].type === 'doubleRIGHT') {
            var door_height = door[counter].height;
            if (door_height > 250) {
                door_hinges = 5;
            } else if (door_height > 200 && door_height < 250) {
                door_hinges = 4;
            } else if (door_height > 150 && door_height < 200) {
                door_hinges = 3;
            } else {
                door_hinges = 2;
            }
            temp_door_accs_price = door_hinges * door_hinges_price;
            door_total_accs = door_total_accs + temp_door_accs_price;
            door_total = door_total + door_total_material + door_finish + door_hinges;
        } else if (door[counter].type === 'drawer') {
            if (door[counter].width > drawer_sync_width) {
                temp_drawer_price = drawer_wide_price;
            } else {
                temp_drawer_price = drawer_price;
            }
            door_total_accs = door_total_accs + temp_drawer_price;
            door_total = door_total + door_total_material + door_finish + temp_drawer_price;
        } else if (door[counter].type === 'flap') {
            door_total_accs = door_total_accs + flap_price;
            door_total = door_total + door_total_material + door_finish + flap_price;
        }
        counter++;
    }

    // cubic price
    var cubic_total_square = 0;
    var cubic_total_material = 0;
    var cubic_finish_price = 0;
    var cubic_finish = 0;
    var cubic_total_finish = 0;
    for (var x = 0; x < cubic.length; x++) {
        cubic_total_square = cubic_total_square + cubic[x].sq;
        cubic_total_material = cubic_total_material + cubic[x].sq * thick18;
        cubic_finish_price = get_material_price(cubic[x].texture);
        cubic_finish = cubic[x].sq * 2 * cubic_finish_price;
        cubic_total_finish = cubic_total_finish + cubic_finish;
    }

    // get sliding door price
    if (sliding_door !== null) {
        var sliding_door_finish_price = get_material_price(sliding_door.texture);
        var sliding_door_square = (sliding_door_width * sliding_door_height) / 10000;
        var sliding_door_materials = sliding_door_square * thick18;
        var sliding_door_finished = sliding_door_square * 2 * sliding_door_finish_price;
        sliding_door_total = sliding_door_materials + sliding_door_finished + slider_accs_price;
    }

    var total_price_netto = board_total_material + backwall_total_material + board_total_finish + door_total_finish + backwall_total_finish + price_accs_total + door_total + sliding_door_total + cubic_total_material + cubic_total_finish;
    var total_price_2 = total_price_netto * 1.8;
    var total_price_3 = total_price_2 * 1.35;
    var total_price = total_price_3 * 1.23;
    total_price = total_price.toFixed();
    $('.user_price').html('<span id="user_totalprice">' + total_price + '</span>,00 PLN');

    //console.clear();
    //console.log('m2:');
    //console.log('-korpus: '+(wall_square+get_total_board_sq+tabletop_square+wall_e_square+dividers_square+sockle_square) +' m2');
    //console.log('-drzwi: '+door_total_square.toFixed(2) +' m2');
    //console.log('-tylna ściana: '+backwall_square.toFixed(2)+' m2');
    //console.log('-kubiki: '+cubic_total_square.toFixed(2)+' m2');
    //console.log('');
    //console.log('Cena netto za płyty:');
    //console.log('-korpus: '+board_total_material);
    //console.log('-drzwi: '+door_total_material);
    //console.log('-tylna ściana: '+backwall_total_material);
    //console.log('-kubik: '+cubic_total_material);
    //console.log('');
    //console.log('Cena netto za okleinę i lakier/farbę:');
    //console.log('-korpus: ' + board_total_finish);
    //console.log('-drzwi: ' + door_total_finish);
    //console.log('-tylne ściany: ' + backwall_total_finish);
    //console.log('-kubik: ' + cubic_total_finish);
    //console.log('');
    //console.log('Akcesoria:');
    //console.log('-półi: '+board_accs_total);
    //console.log('-cokół: '+sockle_accs_total);
    //console.log('-pioniki: '+divider_accs_total);
    //console.log('-wieszaki: '+hanger_accs_total);
    //console.log('-blat: '+tabletop_accs_total);
    //console.log('-drzwi: '+door_total_accs);
    //console.log('');
    //console.log('Cena całkowita: ');
    //console.log('Koszt: '+total_price_netto);
    //console.log('Netto: '+total_price_2);
    //console.log('Marza: '+total_price_3);
    //console.log('Vat: '+total_price);
}

function user_order() {
    var user_order_btn = '#user_make_order';
    // variables
    var user_firstname = $('#user_firstname').val();
    var user_lastname = $('#user_lastname').val();
    var user_street = $('#user_street').val();
    var user_postcode = $('#user_postcode').val();
    var user_city = $('#user_city').val();
    var user_phone = $('#user_phone').val();
    var user_mail = $('#user_mail').val();
    var user_comment = $('#user_comment').val();

    var user_price = $('#user_totalprice').html();
    var user_corpus = $('#order_material').html();
    var user_doors = $('#order_door').html();
    var user_backwall = $('#order_backwall').html();
    var save_current = '<div id="load" style="display:none;">' + $('#current').html() + '</div>';
    var pathname = window.location.pathname;
    var localhost = window.location.hostname;
    var php_var = '?conf=';


    var user_store = $('#store_id').html();


    //fillup checks
    if (user_firstname === '' || user_lastname === '' || user_street === '' || user_postcode === '' || user_city === '' || user_phone === '' || user_mail === '') {
        // fill all cells before continue
        modal.open('user_modal_44');
        return;
    }

    $(user_order_btn).attr('onclick', '');
    var temp_order_text = $(user_order_btn).html();
    $(user_order_btn).html('Wysyłanie...');

    //get doors specification
    var counter = 0;
    var door_type = [];
    var door_finish = [];
    while (door[counter] != null) {
        var type;
        switch (door[counter].type) {
            case ('door'):
                if (door[counter].open === 'left') {
                    type = 'drzwi lewe';
                } else {
                    type = 'drzwi prawe';
                }
                break;
            case ('drawer'):
                type = 'szuflada';
                break;
            case ('flap'):
                if (door[counter].open === 'top') {
                    type = 'drzwi podnoszone';
                } else {
                    type = 'drzwi opuszczane';
                }
                break;
            case ('doubleLEFT'):
                type = 'drzwi lewe';
                break;
            case ('doubleRIGHT'):
                type = 'drzwi prawe';
                break;
            default:
                type = '#############';
        }
        door_type.push(type);
        door_finish.push(global_textures[door[counter].texture]);
        counter++;
    }

    //get cubic specification
    var cubic_finish = [];
    var cubic_dimensions = [];
    for (var x = 0; x < cubic.length; x++) {
        cubic_finish.push(global_textures[cubic[x].texture]);
        cubic_dimensions.push(cubic[x].height.toFixed(1) + ' x ' + cubic[x].width.toFixed(1) + ' x ' + cubic[x].depth.toFixed(1));
    }

    if (sliding_door !== null) {
        door_type.push('drzwi przesuwne (pomiędzy ' + sliding_door.startRailing + ' i ' + sliding_door.endRailing + ' segmentem)');
        door_finish.push(global_textures[sliding_door.texture]);
    }


    var thickness = furniture_thickness;

    //prepare arrays for JSON
    var temp_height = JSON.stringify(model_height_array);
    var temp_width = JSON.stringify(model_width_array);
    var temp_depth = JSON.stringify(model_depth_array);
    var temp_shelf = JSON.stringify(model_shelf_array);
    var temp_door_type = JSON.stringify(door_type);
    var temp_door_finish = JSON.stringify(door_finish);
    var temp_cubic_finish = JSON.stringify(cubic_finish);
    var temp_cubic_dimensions = JSON.stringify(cubic_dimensions);

    $.ajax({ // AJAX
        url: 'php/save.php', // pass the data
        type: 'POST',
        data: {
            save: save_current, // SAVE CONFIGURATION
            firstname: user_firstname, // SEND USER INFO
            lastname: user_lastname,
            street: user_street,
            postcode: user_postcode,
            city: user_city,
            phone: user_phone,
            mail: user_mail,
            comment: user_comment,
            store_id: user_store,
            price: user_price,
            height: model_height,
            width: model_width,
            depth: model_depth,
            corpus: user_corpus,
            doors: user_doors,
            backwall: user_backwall,
            columns: model_columns,
            height_array: temp_height,
            width_array: temp_width,
            depth_array: temp_depth,
            shelf_array: temp_shelf,
            door_type: temp_door_type,
            door_finish: temp_door_finish,
            sockle: sockle_height,
            //standingByWall:model_standingByWall,
            pathname: localhost + pathname + php_var,
            hanger: hanger.length,
            divider: divider.length,
            thickness: thickness,
            tabletop: model_tabletop,
            cubic_dim: temp_cubic_dimensions,
            cubic_finish: temp_cubic_finish
        },
        success: function (data) { // call back with data
            load_div(2);
            if (data === 'error') {
                // order failed
                modal.open('user_modal_45');
            } else {
                // order successful
                modal.open('user_modal_46');
            }
            history.pushState('data', '', pathname + php_var + data);
        }
    });

    $(user_order_btn).attr('onclick', 'user_order()');
    $(user_order_btn).html(temp_order_text);
}


function webgl_detect(return_context) {
    if (!!window.WebGLRenderingContext) {
        var canvas = document.createElement("canvas"),
            names = ["webgl", "experimental-webgl", "moz-webgl", "webkit-3d"],
            context = false;

        for (var i = 0; i < 4; i++) {
            try {
                context = canvas.getContext(names[i]);
                if (context && typeof context.getParameter == "function") {
                    // WebGL is enabled
                    if (return_context) {
                        // return WebGL object if the function's argument is present
                        return {name: names[i], gl: context};
                    }
                    // else, return just true
                    return true;
                }
            } catch (e) {
            }
        }

        // WebGL is supported, but disabled
        return false;
    }

    // WebGL not supported
    return false;
}

function x_overlap(a_start, a_end, b_start, b_end) { // this function tests if two ranges of integers overlap
    if (a_start <= b_start && b_start <= a_end) return true; // b starts in a
    if (a_start <= b_end && b_end <= a_end) return true; // b ends in a
    if (b_start < a_start && a_end < b_end) return true; // a in b
    return false;
}

function x_overlap2(a_start, a_end, b_start, b_end) { // this function tests if two ranges of integers overlap BUT excludes equals
    if (a_start < b_start && b_start < a_end) return true; // b starts in a
    if (a_start < b_end && b_end < a_end) return true; // b ends in a
    if (b_start < a_start && a_end < b_end) return true; // a in b
    return false;
}

function object_fit(value, min, max) { // fit min and max value to check, compare to min/max
    try {
        value = parseFloat(value.toFixed(1)); // toFixed(1) tolerance: 0.5 mm
        min = parseFloat(min.toFixed(1));
        max = parseFloat(max.toFixed(1));
    } // catch error
    catch (err) {
        alert('Object fitter was given wrong value (not integer nor float)');
    }

    if (value < min) return true; // doesnt fit
    if (value > max) return true; // doesnt fit

    return false; // object fits
}

function slider_value(id, mode) {
    var value = document.getElementById(id);
    value = value.noUiSlider.get();
    value = parseFloat(value);


    switch (id) {
        case ('user_init_slider_height'):
            model_height = value;
            $('#user_init_slider_height_input').val(value + ' ' + global_text['cm']);
            break;
        case ('user_init_slider_width'):
            model_width = value;
            $('#user_init_slider_width_input').val(value + ' ' + global_text['cm']);
            break;
        case ('user_init_slider_depth'):
            model_depth = value;
            $('#user_init_slider_depth_input').val(value + ' ' + global_text['cm']);
            break;
        case ('user_init_slider_columns'):
            model_columns = value;
            $('#user_init_slider_columns_input').val(value);
            break;
        case ('user_init_slider_shelves'):
            $('#user_init_slider_shelves_input').val(value);
            break;
        //STEP 2
        case ('user_edit_slider_height'):
            $('#user_edit_slider_height_input').val(value + ' ' + global_text['cm']);
            break;
        case('user_edit_slider_width'):
            $('#user_edit_slider_width_input').val(value + ' ' + global_text['cm']);
            break;
        case ('user_edit_slider_depth'):
            $('#user_edit_slider_depth_input').val(value + ' ' + global_text['cm']);  // !update user_edit_height
            break;
        case ('user_edit_slider_shelves'): // !update user_edit_shelf
            $('#user_edit_slider_shelves_input').val(value);
            break;
        case('user_edit_slider_spaceheight'):
            $('#user_edit_slider_spaceheight_input').val(value + ' ' + global_text['cm']);
            break;
        case('user_add_slider_cubic'):
            $('#user_add_slider_cubic_input').val(value + ' ' + global_text['cm']);
            break;
        default:
            alert('slider value failure number 1 ' + id);
    }

    switch (mode) {
        //STEP 1
        case ('change_height'):
            user_init('change_height');
            break;
        case ('change_width'):
            user_init('change_width');
            break;
        case ('change_dim'):
            user_init();
            break;
        //STEP 2
        case ('edit_fh'): //height
            user_decision('fh', global_which, global_space);
            break;
        case ('edit_sw'): // width
            user_decision('sw', global_which, global_space);
            break;
        case ('edit_fd'): // depth
            user_decision('fd', global_which, global_space);
            break;
        case ('edit_fs'): // shelves
            user_decision('fs', global_which, global_space);
            break;
        case ('edit_sh'): // spaceheight
            user_decision('sh', global_which, global_space);
            break;
    }
}

function update_slider(what, start, min, max) {
    var step;
    var unit;
    var slider;
    var mode;
    switch (what) {
        case ('init_height'):
            what = 'user_init_slider_height';
            step = 1;
            unit = ' ' + global_text['cm'];
            mode = 'change_height';
            break;
        case ('init_width'):
            what = 'user_init_slider_width';
            step = 1;
            unit = ' ' + global_text['cm'];
            mode = 'change_width';
            break;
        case ('init_depth'):
            what = 'user_init_slider_depth';
            step = 1;
            unit = ' ' + global_text['cm'];
            mode = 'change_dim';
            break;
        case ('init_columns'):
            what = 'user_init_slider_columns';
            step = 1;
            unit = '';
            mode = 'change_dim';
            break;
        case ('init_shelves'):
            what = 'user_init_slider_shelves';
            step = 1;
            unit = '';
            mode = 'change_dim';
            break;
        // STEP 2
        case ('edit_height'):
            what = 'user_edit_slider_height';
            step = 1;
            unit = ' ' + global_text['cm'];
            mode = 'edit_fh';
            break;
        case ('edit_width'):
            what = 'user_edit_slider_width';
            step = 0.1;
            unit = ' ' + global_text['cm'];
            mode = 'edit_sw';
            start = start.toFixed(1);
            min = min.toFixed(1);
            max = max.toFixed(1);
            break;
        case ('edit_shelves'):
            what = 'user_edit_slider_shelves';
            step = 1;
            unit = '';
            mode = 'edit_fs';
            break;
        case ('edit_spaceheight'):
            what = 'user_edit_slider_spaceheight';
            step = 0.1;
            unit = ' ' + global_text['cm'];
            mode = 'edit_sh';
            start = start.toFixed(1);
            min = min.toFixed(1);
            max = max.toFixed(1);
            break;
        case ('add_cubic'):
            what = 'user_add_slider_cubic';
            step = 0.1;
            unit = ' ' + global_text['cm'];
            start = start.toFixed(1);
            min = min.toFixed(1);
            max = max.toFixed(1);
            break;
        default:
            alert('update slider failure');
    }

    $('#' + what + '_min').html(min);
    $('#' + what + '_max').html(max);
    $('#' + what + '_input').val(start + unit);

    slider = document.getElementById(what);

    if (slider.noUiSlider) {
        slider.noUiSlider.destroy(); // remove slider if only updating
    }

    noUiSlider.create(slider, {
        start: [parseFloat(start)],
        step: step,
        connect: [true, false],
        animate: true,
        animationDuration: 300,
        behaviour: 'tap',
        range: {
            'min': [parseFloat(min)],
            'max': [parseFloat(max)]
        }
    });

    if (min === max) {
        document.getElementById(what).setAttribute('disabled', true);
    } else {
        document.getElementById(what).removeAttribute('disabled');
    }

    slider.noUiSlider.on('slide', function () { // runs on touch
        slider_value(what);
    });

    slider.noUiSlider.on('change', function () { // runs on drop
        slider_value(what, mode);
    });
}

var modal = function () {
    var name = document.getElementById('x-myModal');
    var hidden_modals = 'hidden_modals';
    var visible_modals = 'visible_modals';
    var close_stack = [];

    function open(modal_id, update) {
        modal.close_stack.push(modal_id);
        if (typeof update !== 'undefined') {
            var counter = 1;
            for (var each in update) {  // update modal values
                $('#' + modal_id + '_' + counter).html(update[each]);
                counter++;
            }
        }
        this.name.style.display = "table"; // show overlay
        $('#' + modal_id).detach().appendTo('#' + visible_modals);
    }

    function close() {
        var close_all = close_stack.length;
        for (var x = 0; x < close_all; x++) {
            $('#' + modal.close_stack[x]).detach().appendTo('#' + hidden_modals);
        }
        this.name.style.display = "none"; // close overlay
    }


    window.onmousedown = function (event) {
        if (event.target === modal.name) {
            modal.close();
        }
    };

    return {
        name: name,
        open: open,
        close: close,
        close_stack: close_stack
    };

}();

function launchFullScreen(element) {
    if (!document.fullscreenElement &&    // alternative standard method
        !document.mozFullScreenElement && !document.webkitFullscreenElement && !document.msFullscreenElement) {  // current working methods
        if (document.documentElement.requestFullscreen) {
            document.documentElement.requestFullscreen();
        } else if (document.documentElement.msRequestFullscreen) {
            document.documentElement.msRequestFullscreen();
        } else if (document.documentElement.mozRequestFullScreen) {
            document.documentElement.mozRequestFullScreen();
        } else if (document.documentElement.webkitRequestFullscreen) {
            document.documentElement.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT);
        }
    } else {
        if (document.exitFullscreen) {
            document.exitFullscreen();
        } else if (document.msExitFullscreen) {
            document.msExitFullscreen();
        } else if (document.mozCancelFullScreen) {
            document.mozCancelFullScreen();
        } else if (document.webkitExitFullscreen) {
            document.webkitExitFullscreen();
        }
    }
}

