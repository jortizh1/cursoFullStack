const init = () =>{
    $('#movie_search').on('keyup', (e) => {
        if(e.keyCode == 13){
            var movie = document.getElementById('movie_search').value;
            if(movie.length <= 0){
                alert("Por Favor, ingrese Nombre de pelicula");
            }
            else{
                load_movies(movie, 's', 1);
                //console.log(movie);
            }
        }
    });   
}

const load_movies = (movies, type, page) =>{
    //const myKey = '42af3ea1';
    const myKey = '26be8198';
    let pages = '';

    if(page != 'none'){
        pages = '&page='+page;
    }

    $.ajax({
        url: "http://www.omdbapi.com/?apikey="+myKey+"&"+type+"="+movies+pages,
        dataType: 'json',
        type: 'post',
        success: (response) => {
            console.log(response);
            let dict = {
                s: show_movies,
                i: show_single_movie
            };
            let args = {
                s: [response, 'movie_results', movies],
                i: [response]
            };
            dict[type](...args[type]);
        },
        error: () => {
            console.log("No funciona");
        }
    });
}

const show_movies = (results, div, movies) =>{
    let container = document.getElementById(div);
    container.innerHTML = '';
    let row = document.createElement('div');
    row.className = 'row';
    container.appendChild(row);
    for(let i of results.Search){
        let col = document.createElement('div');
        col.className = 'col-md-4 col-sm-6 col-xs-12';
        row.appendChild(col);
        let t_div = document.createElement('div');
        t_div.className = 'thumbnail custom-thumbnail';
        col.appendChild(t_div);
        let t_img = document.createElement('img');
        t_img.src = i.Poster;
        t_div.appendChild(t_img);

        let t_cap = document.createElement('div');
        t_cap.className = 'caption';
        t_div.appendChild(t_cap);

        let t_h3 = document.createElement('h4');
        t_h3.innerHTML = i.Title+'-'+i.Year;
        t_cap.appendChild(t_h3);

        let t_buttons = document.createElement('p');
        t_cap.appendChild(t_buttons);

        let t_b_rate = document.createElement('a');
        t_b_rate.className = 'btn btn-primary';
        t_b_rate.innerHTML = "Calificar";

        let t_b_info = document.createElement('a');
        t_b_info.className = 'btn btn-default';
        t_b_info.innerHTML = "Ver Mas";       
        
        t_buttons.appendChild(t_b_rate);
        t_buttons.appendChild(t_b_info);

        $(t_b_info).on('click', () =>{
            load_movies(i.imdbID, 'i', 'none');
        });
    }
    movie_paginator(movies, results.totalResults, 'movie_paginator');
}

const show_single_movie = (results) =>{
    
    let m_t = document.getElementById('modal_title');
    let c_t = document.getElementById('modal_content');
    m_t.innerHTML = "";
    c_t.innerHTML = "";
    m_t.innerHTML = results.Title;
    let row = document.createElement('div');    
    row.className = "row";
    c_t.appendChild(row);

    let col1 = document.createElement('div');
    col1.className = "col-md-6 col-sm-6";
    row.appendChild(col1);
    let col2 = document.createElement('div');
    col2.className = "col-md-6 col-sm-6";
    row.appendChild(col2);
    let t_img = document.createElement('img');
    t_img.src = results.Poster;
    col1.appendChild(t_img);

    let col_p = document.createElement('p');
    col_p.innerHTML =  results.Plot;
    col2.appendChild(col_p);


    //col2.innerHTML =  results.Plot;
    //c_t.innerHTML = results.Plot;
    $('#movie_modal').modal('show');
}

const movie_paginator = (movie, results, div) =>{

    let numPages = parseInt(results/10);
    if(results % 10 != 0) numPages++;

    let p_c = document.getElementById(div);
    p_c.innerHTML = "";
    let ul = document.createElement('ul');
    ul.className='pagination';

    for(let i=1; i <= numPages; i++){
        let li = document.createElement('li');
        ul.appendChild(li);
        let button = document.createElement('a');
        button.innerHTML = i;
        li.appendChild(button);
        $(button).on('click', () =>{
            load_movies(movie, 's', i);
        });
    }
    p_c.appendChild(ul);
}