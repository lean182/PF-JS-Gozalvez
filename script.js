class Calculadora {
  constructor() {
    this.entradaActual = "";
    this.resultado = 0;
    this.estaParentesisAbierto = true;
    this.pantalla = document.getElementById("pantalla");
    this.historialEcuaciones =
      JSON.parse(localStorage.getItem("historial")) || [];
    this.inicializarEventos();
    this.actualizarHistorial();
  }

  agregarAPantalla(valor) {
    this.entradaActual += valor;
    this.pantalla.value = this.entradaActual;
  }

  limpiarPantalla() {
    this.entradaActual = "";
    this.resultado = 0;
    this.pantalla.value = "";
  }

  calcular(expr) {
    expr = expr.replace(/x/g, "*").replace(/÷/g, "/");
    let operandos = expr.split(/[\+\-\*\/]/).map((o) => parseFloat(o));
    let operaciones = expr.match(/[\+\-\*\/]/g) || [];

    while (operaciones.includes("*") || operaciones.includes("/")) {
      let i = operaciones.findIndex((o) => o === "*" || o === "/");
      operandos[i] =
        operaciones[i] === "*"
          ? operandos[i] * operandos[i + 1]
          : operandos[i] / operandos[i + 1];
      operandos.splice(i + 1, 1);
      operaciones.splice(i, 1);
    }

    while (operaciones.includes("+") || operaciones.includes("-")) {
      let i = operaciones.findIndex((o) => o === "+" || o === "-");
      operandos[i] =
        operaciones[i] === "+"
          ? operandos[i] + operandos[i + 1]
          : operandos[i] - operandos[i + 1];
      operandos.splice(i + 1, 1);
      operaciones.splice(i, 1);
    }

    return operandos[0];
  }

  calcularResultado() {
    try {
      this.resultado = this.calcular(this.entradaActual);
      if (isNaN(this.resultado) || !isFinite(this.resultado)) {
        this.pantalla.value = "Error";
      } else {
        this.historialEcuaciones.push({
          ecuacion: this.entradaActual,
          resultado: this.resultado,
        });
        localStorage.setItem(
          "historial",
          JSON.stringify(this.historialEcuaciones)
        );
        this.pantalla.value = this.resultado;
        this.entradaActual = this.resultado.toString();
        this.actualizarHistorial();
      }
    } catch (error) {
      this.pantalla.value = "Error";
      console.error("Ha ocurrido un error en el cálculo: ", error);
    }
  }

  alternarParentesis() {
    this.agregarAPantalla(this.estaParentesisAbierto ? "(" : ")");
    this.estaParentesisAbierto = !this.estaParentesisAbierto;
  }

  borrarUltimaEntrada() {
    this.entradaActual = this.entradaActual.slice(0, -1);
    this.pantalla.value = this.entradaActual;
  }

  eliminarDelHistorial(indice) {
    this.historialEcuaciones.splice(indice, 1);
    this.actualizarHistorial();
  }

  actualizarHistorial() {
    const listaHistorial = document.getElementById("lista-historial");
    listaHistorial.innerHTML = "";
    this.historialEcuaciones.forEach((entrada, indice) => {
      const elementoLista = document.createElement("li");

      const spanEcuacion = document.createElement("span");
      spanEcuacion.textContent = entrada.ecuacion;
      spanEcuacion.style.cursor = "pointer";
      spanEcuacion.addEventListener("click", () => {
        this.entradaActual = entrada.ecuacion;
        this.pantalla.value = this.entradaActual;
      });

      const spanResultado = document.createElement("span");
      spanResultado.textContent = ` = ${entrada.resultado}`;
      spanResultado.style.cursor = "pointer";
      spanResultado.addEventListener("click", () => {
        this.entradaActual = entrada.resultado.toString();
        this.pantalla.value = this.entradaActual;
      });

      elementoLista.appendChild(spanEcuacion);
      elementoLista.appendChild(spanResultado);

      listaHistorial.appendChild(elementoLista);
    });
  }

  inicializarEventos() {
    document
      .getElementById("btn-limpiarPantalla")
      .addEventListener("click", () => this.limpiarPantalla());
    document
      .getElementById("btn-borrarUltimaEntrada")
      .addEventListener("click", () => this.borrarUltimaEntrada());
    document
      .getElementById("btn-calcularResultado")
      .addEventListener("click", () => this.calcularResultado());
    document
      .getElementById("btn-alternarParentesis")
      .addEventListener("click", () => this.alternarParentesis());

    document.querySelectorAll(".btn-agregarALaPantalla").forEach((button) => {
      button.addEventListener("click", () => {
        this.agregarAPantalla(button.getAttribute("data-valor"));
      });
    });
  }
}

document.addEventListener("DOMContentLoaded", () => new Calculadora());

const switchModoOscuro = document.getElementById("switch-modo-oscuro");
let modoOscuroActivado = false;

switchModoOscuro.addEventListener("change", () => {
  modoOscuroActivado = switchModoOscuro.checked;
  const body = document.body;

  if (modoOscuroActivado) {
    body.classList.add("modo-oscuro");
  } else {
    body.classList.remove("modo-oscuro");
  }
});

function borrarHistorial() {
  const listaHistorial = document.getElementById("lista-historial");
  listaHistorial.innerHTML = "";

  localStorage.clear();

  window.location.reload();
}

document
  .getElementById("btn-borrarHistorialCompleto")
  .addEventListener("click", borrarHistorial);


