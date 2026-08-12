# [PTCGTools](https://ptcg-tools.vercel.app)(Para Pokémon TCG)

![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Status](https://img.shields.io/badge/Status-En_Desarrollo-blue?style=for-the-badge)

**PTCGTools** es un conjunto de herramientas para la creación de mazos que permite a los usuarios conocer de antemano las estadísticas de sus mazos como la probabilidad de mulligans en la mano inicial y que cartas son las más probables de salir en esta mano.

> **¿Qué es un Mulligan?** <br> Ocurre cuando al empezar la partida no robas ningún Pokémon básico en tu mano inicial. Esto obliga a barajar de nuevo y permite al rival robar una carta extra, dándole una ventaja desde antes de empezar el primer turno.

---

## ¿Por qué esta herramienta?

A diferencia de otras herramientas "rudimentarias" donde debes introducir los datos a mano, esta aplicación se centra en **ser útil y fácil de usar**:

* **Importación Directa:** Copia y pega tu lista de mazo desde **Limitless TCG** o el juego oficial (**Pokémon TCG Live**).
* **Automatización:** Gracias a la integración con la API de TCGDex, la herramienta identifica automáticamente qué cartas son básicos y cuáles no (salvo casos excepcionales).
* **Visualización Clara:** Resultados estadísticos mostrados mediante gráficos dinámicos.

## Tecnologías y Librerías

* **[React](https://reactjs.org/):** Base del desarrollo del proyecto.
* **[TCGDex API](https://tcgdex.dev/):** Fuente de datos actualizada para obtener la información oficial de las cartas y sus respectivas imágenes.
* **[Recharts](https://recharts.org/):** Para la generación de los gráficos de las estadísticas.
* **[React Router](https://reactrouter.com/):** Gestión de la navegación interna de la aplicación.
* **[i18next](https://www.i18next.com/):** Implementación de sistema multi-idioma para llegar a mayor parte de la comunidad.

## Instalación

Si quieres ejecutar el proyecto en local, debes realizar los siguientes pasos:

1. **Clona este repositorio:**
   ```bash
   git clone [https://github.com/tu-usuario/mulligan-calculator.git](https://github.com/tu-usuario/mulligan-calculator.git)
2. **Instalar las librerias**
    ```bash
    pnpm install
3. **Ejecutar la aplicación**
    ```bash
    pnpm start
## Objetivos del proyecto
1. Ayudar a la comunidad a la que pertenezco brindando de una herramienta fácil de usar y que sea capaz de dar bastante información de sus mazos.
2. Seguir poniendo en práctica lo aprendido sobre desarrollo frontend con el framework React.

## Próximas mejoras e implementaciones
* **Cálculo de Premios:** Función extra para visualizar la probabilidad de que cartas irán a premios en caso de que la mano no sea mulligan.
* **Refactorización:** Limpieza y optimización del código para mejorar la velocidad y facilitar las mejoras a futuro.

## Autor
**Jorge Colomer Albertos** <br>
[![LinkedIn](https://img.shields.io/badge/LinkedIn-0077B5?style=for-the-badge&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/jorge-colomer-albertos-944346275)
[![GitHub](https://img.shields.io/badge/GitHub-100000?style=for-the-badge&logo=github&logoColor=white)](https://github.com/jorgelol20)
