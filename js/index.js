//variables
const menu = document.querySelector("#menu");
const nav = document.querySelector(".nav");

const productosContenedor = document.querySelector(".productos");
const productosNavegacion = document.querySelectorAll(".navegacion-item");

menu.addEventListener("click", () => {
  nav.classList.toggle("nav-activo");
  if (nav.className.includes("nav-activo")) {
    menu.className = "fa-solid fa-xmark menu";
  } else {
    menu.className = "fa-solid fa-bars menu";
  }
});

//modal
const modal = document.querySelector(".modal-productos");
const cerrarModal = document.querySelector(".cerrar-modal");

//eventos
window.addEventListener("load", () => {
  const todosLosProductos = traerProductos().then((res) => {
    pintarProductos(res.productos1);
    animacionDeCarga();
  });
});

productosNavegacion.forEach((element) => {
  element.addEventListener("click", (e) => {
    removeClassActive();
    element.classList.add("navegacion-activo");
    let valor = Number(e.target.innerHTML);
    traerProductos().then((res) => {
      switch (valor) {
        case 1:
          pintarProductos(res.productos1);
          animacionDeCarga();
          break;
        case 2:
          pintarProductos(res.productos2);
          animacionDeCarga();
          break;
        case 3:
          pintarProductos(res.productos3);
          animacionDeCarga();
          break;
      }
    });
  });
});
//funciones
function removeClassActive() {
  productosNavegacion.forEach((element) => {
    element.classList.remove("navegacion-activo");
  });
}

async function traerProductos() {
  const peticion = await fetch("../../servicios/productos.json");
  const productos = await peticion.json();
  const [productos1, productos2, productos3] = productos;

  return {
    productos1,
    productos2,
    productos3,
  };
}

function pintarProductos(arr) {
  productosContenedor.innerHTML = "";
  arr.forEach((element) => {
    productosContenedor.innerHTML += `
      <div class="item">
      <span class="loader"></span>
         <img src="${element.img}" alt="${element.info}" class="productos-img" data-id="${element.id}" />
         <p class="item-text">${element.info}</p>
      </div>
   `;
  });
  mostrarModal();
}
function animacionDeCarga() {
  const todasImagenesProductos = document.querySelectorAll(".productos-img");
  todasImagenesProductos.forEach((img) => {
    img.style.display = "none"; //imagen
    img.nextElementSibling.style.display = "none"; //texto
    img.parentElement.style.height = "400px"; //padre
    img.parentElement.firstElementChild.style.display = "flex"; //texto

    img.addEventListener("load", () => {
      img.style.display = "block"; //imagen
      img.nextElementSibling.style.display = "block"; //texto
      img.parentElement.style.height = "auto"; //padre
      img.parentElement.firstElementChild.style.display = "none"; //texto
    });
  });
}
function mostrarModal() {
  const productosImg = document.querySelectorAll(".productos-img");

  productosImg.forEach((e) => {
    e.addEventListener("click", () => {
      modal.classList.add("modal-abierta");
      let id = e.getAttribute("data-id");
      mostrarDatosEnElModal(id);
    });
  });
  cerrarModal.addEventListener("click", () => {
    modal.classList.remove("modal-abierta");
  });
}
function mostrarDatosEnElModal(id) {
  let productoNombre = document.querySelector(".info");
  let productoPrecio = document.querySelector(".precio");
  let productoImg = document.querySelector(".modal-img");
  let productoDescripcion = document.querySelector(".info-parrafo");

  traerProductos().then((res) => {
    let productos = [...res.productos1, ...res.productos2, ...res.productos3];
    let producto = productos.find((e) => e.id == id);
    productoNombre.innerHTML = producto.info;
    productoPrecio.innerHTML = producto.precio;
    productoImg.src = producto.img;
    productoDescripcion.innerHTML = producto.descripcion;
  });
}
