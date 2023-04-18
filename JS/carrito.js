let carritoHP = JSON.parse(localStorage.getItem("carrito")) || [];
const confirmarCompra = document.getElementById('confirmarCompra');
const vaciarCarrito = document.getElementById('vaciarCarrito');
let buttonsDelete = document.querySelectorAll(".carrito-producto-eliminar");
const sumaTotal = document.querySelector('#total');
confirmarCompra.addEventListener("click", confirmarBtnCompra);
vaciarCarrito.addEventListener("click", borrarCarrito);

function armadoCarrito({ imagen, nombre, precio, cantidad, id }) {

    return `<tr>
            <td><img style="width:5rem;" src="${imagen}" alt="${nombre}"></td>
            <td>${nombre}</td>
            <td>${cantidad}</td>
            <td>${precio} €</td>
            <td>${precio * cantidad} €</td>
            <td><button class=" btn btn-primary btn-light btnAll" id="${id}"><i class="bi bi-trash3"></i></button></td>
            </tr>
            `
};

function recuperarCarrito() {
    let carritoHTML = [];
    const tbody = document.querySelector("tbody");
    if (carritoHP.length > 0) {
        carritoHP.forEach(producto => carritoHTML += armadoCarrito(producto));
        activarBotonesAll();
        tbody.innerHTML = carritoHTML;
        calcularTotal();
    } else {
        carritoHTML = '';
        tbody.innerHTML = carritoHTML;
        calcularTotal();
    };

};
recuperarCarrito();


//Botones deleteall carrito


function activarBotonesAll() {
    let botonesAll = document.querySelectorAll(".btn.btn-primary.btn-light.btnAll");
    botonesAll.forEach(btn => {
        btn.addEventListener("click", () => {
            let resultado = carritoHP.findIndex(prod => prod.id === parseInt(btn.id));
            let name = carritoHP.find(prod => prod.id === parseInt(btn.id));
            carritoHP.splice(resultado, 1);
            localStorage.setItem("carrito", JSON.stringify(carritoHP));
            recuperarCarrito();
            activarBotonesAll();
            alertaEliminar(`${name.nombre} Producto eliminado`);
        });
    });
};
activarBotonesAll();

//CALCULAR TOTAL

function calcularTotal() {
    let total = document.querySelector("p#total");
    let totalDelCarrito = carritoHP.reduce((acc, producto) => acc + (producto.precio * producto.cantidad), 0);
    total.innerText = `EL TOTAL ES: € ${totalDelCarrito.toLocaleString()}`;
};

//GIFT ESPERA
const espera = () => `<img src="img/gift.gif" width="40px">`;

const randomNumber = () => parseInt(Math.random() * 1_500);

//CONFIRMAR COMPRA

function confirmarBtnCompra() {
    confirmarCompra.innerHTML = espera();
    setTimeout(() => {
        if (carritoHP.length > 0) {
            sweetAlert('question', 'Esta seguro que quiere confirmar su compra?', '', true, true, 0);

        } else {
            borrarCarrito();
        }
        confirmarCompra.innerText = "CONFIRMAR COMPRA";
    }, randomNumber());
}

//Borrar carrito 

function borrarCarrito() {
    carritoHP.length = 0;
    localStorage.setItem("carrito", JSON.stringify(carritoHP));
    recuperarCarrito();
    sweetAlert('warning', 'Carrito vacio', '', '', '', 3000);
}

//SWEET ALERTA

const sweetAlert = (icon, title, text, showCancelButton, showConfirmButton, timer) => {
    Swal.fire({
        position: 'center',
        icon: icon || '',
        title: title || '',
        text: text || '',
        showCancelButton: showCancelButton || false,
        showConfirmButton: showConfirmButton || false,
        confirmButtonText: 'Aceptar',
        denyButtonText: `Cancelar`,
        timer: timer
    })
        .then((result) => {
            if (result.isConfirmed) {
                borrarCarrito();
                Swal.fire('Compra confirmada!!', '', 'success');

            } else if (result.isDenied) {
                Swal.fire('Changes are not saved', '', 'info');
            }
        })
}

//Sweet alert

let alertaEliminar = (title) => {
    Swal.fire({
        toast: true,
        position: 'top-end',
        icon: 'success',
        showConfirmButton: false,
        title: title || '',
        timer: 1500,
    })
}