let carritoHP = JSON.parse(localStorage.getItem("carrito")) || [];
const cards = document.querySelector(".cards");
const imgCarrito = document.getElementById("imgCarrito");
const inputSearch = document.querySelector("input#inputSearch");
const busquedas = [];
const ruta = '../base_datos/productos.json';
const productos = [];

//FETCH
async function obtenerRuta() {
    try {
        const response = await fetch(ruta)
        const data = await response.json()
        if (data.length > 0) {
            productos.push(...data)
            cargarProductos(productos)
            activarBotonesAll()
        }
    } catch (error) {
        cards.innerHTML = "<h2 class='error-cards'>⛔ Error al cargar productos.</h2>"
    }
}
obtenerRuta();

//CARDS DE LA TIENDA
function cargarCards({ imagen, precio, nombre, id }) {
    return `           <div class="card" style="width:18rem;">
        <div class="card-img-top">
          <img style="width:18rem;" src="${imagen}" alt="${nombre}"> 
        </div>
    <div class="card-body">
        <h5 class="card-title">${nombre}</h5>
              <p class="card-text">${precio} €</p>
        <a href="#" id="${id}" class="btn btn-primary btn-light btnAll">Agregar al 🛒</a>
    </div>
    </div>`;

};
//Cargar los productos en las cards
const cargarProductos = (array) => {
    let cardsHTML = "";
    if (array.length > 0) {
        array.forEach(producto => cardsHTML += cargarCards(producto));
        cards.innerHTML = cardsHTML;
    }
}


//EVENTO DEL CARRITO

imgCarrito.addEventListener("mousemove", () => {
    let totalProductos = carritoHP.reduce((acc, producto) => acc + (producto.cantidad), 0);
    imgCarrito.title = `${totalProductos} productos en el carrito`;
})

//Activar el evento click en las cards
function activarBotonesAll() {
    const botonesAll = document.querySelectorAll(".btn.btn-primary.btn-light.btnAll");
    botonesAll.forEach(btn => {
        btn.addEventListener("click", () => {
            let resultado = productos.find(carrito => carrito.id === parseInt(btn.id));
            if (carritoHP.some(carrito => carrito.id === parseInt(btn.id))) {
                const indexNumber = carritoHP.findIndex(carrito => carrito.id === parseInt(btn.id));
                carritoHP[indexNumber].cantidad++;
            } else {
                resultado.cantidad = 1;
                carritoHP.push(resultado);
            }
            localStorage.setItem("carrito", JSON.stringify(carritoHP));
            alertaSweet('', '', '', `${resultado.nombre} se agrego`);
        });
    });
};



/* FILTRO */

function ordenMenosMas() {
    const ordenMenosMas = document.querySelector('button#precioMenoraMayor');
    ordenMenosMas.addEventListener("click", () => {
        productos.sort((a, b) => a.precio - b.precio);
        cargarProductos(productos);
        activarBotonesAll();

    })
}
ordenMenosMas()
function ordenMasMenos() {
    const ordenMasMenos = document.querySelector('button#precioMayoraMenor');
    ordenMasMenos.addEventListener("click", () => {
        productos.sort((a, b) => a.precio - b.precio).reverse();
        cargarProductos(productos);
        activarBotonesAll();
    })
}
ordenMasMenos()
function ordenAlfabetico() {
    const ordenAlfabetico = document.querySelector('button#deAZ');
    ordenAlfabetico.addEventListener("click", () => {
        productos.sort((a, b) => a.nombre.localeCompare(b.nombre));
        cargarProductos(productos);
        activarBotonesAll();
    })
}
ordenAlfabetico();

//Search

function filtrarProductos() {
    let resultado = productos.filter(producto => producto.nombre.toUpperCase().includes(inputSearch.value.toUpperCase().trim()));
    if (resultado.length > 0) {
        cargarProductos(resultado);
        activarBotonesAll();
    } else {
        alertaSweet(false, 'center', 'warning', 'No se ha encontrado coincidencias');
    }
}

inputSearch.addEventListener("search", () => {
    if (inputSearch.value.trim() !== "") {
        filtrarProductos();
        busquedas.push(inputSearch.value.trim());
        localStorage.setItem("busquedas", busquedas);
    } else {
        cargarProductos(productos);
        activarBotonesAll();
    };
});



//Sweet alert

let alertaSweet = (toast, position, icon, title) => {
    Swal.fire({
        toast: toast || true,
        position: position || 'top-end',
        icon: icon || 'success',
        showConfirmButton: false,
        title: title || '',
        timer: 1500,
    })
}












