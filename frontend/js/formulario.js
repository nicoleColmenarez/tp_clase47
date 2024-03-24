window.onload = async () => {

    const URL_BASE = 'http://localhost:3031/api/'

    let query = new URLSearchParams(location.search)
    
    const id = query.get('id');
    
    if(!query.has('id')){
        alert('Necesito un id')
        location.href = "http://127.0.0.1:5500/frontend/home.html"
    }

    
    try {
        const response = await fetch(`${URL_BASE}movies/${id}`);
        const result = await response.json();
        const {data,meta} = result;
        
        const inputTitle = document.getElementById('title');
        inputTitle.setAttribute('value', data.title)
        
        const inputRating = document.getElementById('rating');
        inputRating.setAttribute('value', data.rating)
        
        const inputAwards = document.getElementById('awards');
        inputAwards.setAttribute('value', data.awards)
        
        const inputreleaseDate = document.getElementById('release_date');
        inputreleaseDate.setAttribute('value', data.release_date.split('T')[0])
        
        const inputLength = document.getElementById('length');
        inputLength.setAttribute('value', data.length)
        
        const selectGenres = document.getElementById('genre');
        const responseGenres = await fetch(`${URL_BASE}genres/`);  
        const resultGenres = await responseGenres.json()
        resultGenres.data.forEach(genre => {
            const option = document.createElement('option')
            option.textContent = genre.name
            option.setAttribute('value', genre.id)
            selectGenres.appendChild(option)
        });
        
        
    } catch (error) {
        console.log(error)
    }
    
    const form = document.querySelector('form');
    const btnAgregar = document.querySelector('#btn-agregar');
    const btnEnviar = document.querySelector('#btn-enviar');
    const btnEliminar = document.querySelector('#btn-eliminar');

    btnAgregar.addEventListener('click', (e) => {
        //form.reset()

        for (let i = 0; i < form.elements.length; i++) {
            form.elements[i].value = null;
        }


        btnEnviar.textContent = 'Guardar';
        btnEliminar.style.display = 'none';
        btnAgregar.textContent = 'Cancelar'
        btnAgregar.onclick = () => location.href = "http://127.0.0.1:5500/frontend/home.html"
         query.set('edit', false)
        
    });

    btnEliminar.addEventListener('click', async function(e){
        e.preventDefault()
        try {

            const response = await fetch(`${URL_BASE}movies/delete/${id}`, {
                method : 'DELETE',
            })
            await response.json()

            Swal.fire({
                position: "top-end",
                icon: "success",
                title: "Película eliminada con éxito!",
                showConfirmButton: false,
                timer: 1500
              })
              setTimeout(() => {
                  location.href = "http://127.0.0.1:5500/frontend/home.html"
                
              }, 2000);


              
            
        } catch (error) {
            console.log(error)
        }
    })

    form.addEventListener('submit', async function (e) {
        e.preventDefault()

        const endpoint = query.get('edit') == 'true' ? `${URL_BASE}movies/update/${id}` : `${URL_BASE}movies/create`


        try {

            const response = await fetch(endpoint, {
                method : query.get('edit') == 'true' ? 'put' : 'post',
                headers : {
                    'Content-Type' : 'application/json'
                },
                body : JSON.stringify({
                    title : this.elements[1].value,
                    rating : this.elements[2].value,
                    awards : this.elements[3].value,
                    release_date : this.elements[4].value,
                    length : this.elements[5].value,
                    genre_id : this.elements[6].value,
                })
            })
            await response.json()

            Swal.fire({
                position: "top-end",
                icon: "success",
                title: "Cambios guardados con éxito",
                showConfirmButton: false,
                timer: 1500
              })
              setTimeout(() => {
                  location.href = "http://127.0.0.1:5500/frontend/home.html"
                
              }, 2000);


              
            
        } catch (error) {
            console.log(error)
        }
    });

    
    
}
