function calcularKDIGO() {
    // Obtener elementos
    const errorElement = document.getElementById("error");
    const resultadoElement = document.getElementById("resultado");
    const resultadoTitulo = resultadoElement.querySelector(".resultado-titulo");
    const criteriosElement = resultadoElement.querySelector(".criterios");

    // Obtener y validar valores
    const valores = {
        peso: parseFloat(document.getElementById("peso").value),
        creaBasal: parseFloat(document.getElementById("crea_basal").value),
        creaActual: parseFloat(document.getElementById("crea_actual").value),
        diuresis: parseFloat(document.getElementById("diuresis").value)
    };

    // Reiniciar visualización
    errorElement.classList.remove("visible");
    resultadoElement.classList.remove("visible");

    // Validaciones
    if (isNaN(valores.peso) || isNaN(valores.creaBasal) || isNaN(valores.creaActual) || isNaN(valores.diuresis)) {
        mostrarError("Por favor, complete todos los campos con valores válidos.");
        return;
    }

    if (valores.peso <= 0 || valores.creaBasal <= 0 || valores.creaActual <= 0) {
        mostrarError("Peso y creatinina deben ser mayores que cero.");
        return;
    }

    if (valores.diuresis < 0) {
        mostrarError("La diuresis no puede ser un valor negativo.");
        return;
    }

    // Cálculos
    const ratioCrea = valores.creaActual / valores.creaBasal;
    const diuresisPorKg = valores.diuresis / valores.peso;
    const criterios = [];

    // Determinar etapa KDIGO
    let resultado = "No cumple criterios de IRA";

    if (ratioCrea >= 3 || valores.creaActual >= 4 || diuresisPorKg < 0.3 || valores.diuresis === 0) {
        resultado = "KDIGO Etapa 3";
        if (ratioCrea >= 3) criterios.push("Creatinina aumentó ≥3 veces");
        if (valores.creaActual >= 4) criterios.push("Creatinina actual ≥4 mg/dL");
        if (diuresisPorKg < 0.3) criterios.push("Diuresis <0.3 mL/kg/24h");
        if (valores.diuresis === 0) criterios.push("Anuria (diuresis = 0 mL)");
    } else if (ratioCrea >= 2 || diuresisPorKg < 0.5) {
        resultado = "KDIGO Etapa 2";
        if (ratioCrea >= 2) criterios.push("Creatinina aumentó ≥2 veces");
        if (diuresisPorKg < 0.5) criterios.push("Diuresis <0.5 mL/kg/24h");
    } else if (ratioCrea >= 1.5 || (valores.creaActual - valores.creaBasal) >= 0.3) {
        resultado = "KDIGO Etapa 1";
        if (ratioCrea >= 1.5) criterios.push("Creatinina aumentó ≥1.5 veces");
        if ((valores.creaActual - valores.creaBasal) >= 0.3) criterios.push("Incremento de creatinina ≥0.3 mg/dL");
    }

    // Mostrar resultado
    resultadoTitulo.textContent = resultado;
    criteriosElement.innerHTML = criterios.length > 0 
        ? `<p>Criterios cumplidos:</p><ul>${criterios.map(criterio => `<li>${criterio}</li>`).join('')}</ul>`
        : '';

    resultadoElement.classList.add("visible");
}

function mostrarError(mensaje) {
    const errorElement = document.getElementById("error");
    errorElement.textContent = mensaje;
    errorElement.classList.add("visible");
}

// Limpiar error al cambiar inputs
document.querySelectorAll('input').forEach(input => {
    input.addEventListener('input', () => {
        document.getElementById("error").classList.remove("visible");
    });
});
