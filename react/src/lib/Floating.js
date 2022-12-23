/**
 * Float a number of things up on a page (hearts, flowers, 👌 ...)
 * <br>
 * You give the options in an object.
 *
 * @module floating
 * @param {string} [options.content='👌']
 *   the character or string to float
 * @param {number} [options.number=1]
 *   the number of items
 * @param {number} [options.duration=10]
 *   the amount of seconds it takes to float up
 * @param {number|string} [options.repeat='infinite']
 *   the number of times you want the animation to repeat
 * @param {string} [options.direction='normal']
 *   The <a href="https://developer.mozilla.org/en-US/docs/Web/CSS/animation-direction">
 *   animation-direction</a> of the main animation
 * @param {number|array} [options.sizes=2]
 *   The size (in em) of each element. Giving two values in an array will
 *   give a random size between those values.
 * 
 * @param {string} [options.color='#fff']
 * 
 * @param {number} [options.classNumber=0]


 */
 export default function floating({
  content = "👌",
  number = 1,
  duration = 3,
  repeat = "infinite",
  direction = "normal",
  size = 2,
  color = "#fff",
  classNumber = 0,
} = {}) {
  const style = document.createElement("style");
  style.id = "floating-style";

  if (!document.getElementById("floating-style")) {
    document.head.appendChild(style);
  }

  const MAX = 120;

  const styles = `
    .float-container {
      font-size: 12px;
      font-weight: bold;
      padding: 2;
      color: ${color};
      align-self: center;
      width: 100vw;
      max-width: 500px;
      height: 100vh;
      position: absolute;
      top: 0;
      pointer-events: none;
    }
    .float-container div * {
      width: 1em;
      height: 1em
    }
    @keyframes float{
      0% {
        opacity: 0.5;
      }

      ${Array.apply(null, { length: MAX + 1 })
        .map((v, x) => ({
          percent: (x * 100) / MAX,
          width: Math.sin(x / 50) * 10,
          height: 110 + x * (-120 / MAX),
        }))
        .map(
          ({ percent, width, height }) =>
            `${percent}% {
            transform: translate(
              ${width / 10}vw,
              ${height * 0.4}vh
            )
          }`
        )
        .join("")}

        100% {
          opacity: 0;
          font-size: 6px;
        }
    }
    
    .float-container-wow {
      font-size: 12px;
      font-weight: bold;
      padding: 2;
      color: ${color};
      align-self: center;
      width: 100vw;
      height: 100vh;
      max-width: 500px;
      border:1px solid red;
      position: absolute;
      top: 0;
      pointer-events: none;
      
    }
    .float-container-wow spam * {
      width: 1em;
      height: 1em
    }
    @keyframes float-wow{
   
      ${Array.apply(null, { length: MAX + 1 })
        .map((v, x) => ({
          percent: (x * 100) / MAX,
          width: Math.sin(x / 10) * 12,
          height: 110 + x * (-120 / MAX),
        }))
        .map(
          ({ percent, width, height }) =>
            `${percent}% {
          transform: translate(
            ${width / 4}vw, 
            ${height / 3.5}vh
          )
        }`
        )
        .join("")}



    }
    `;

  if (document.querySelectorAll(".float-container").length > 1000) {
    document.querySelectorAll(".float-container").forEach((el) => el.remove());
  }

  document.getElementById("floating-style").innerHTML = styles;

  const container = document.createElement("spam");

  let uniqueId = new Date().getTime();

  container.className =
    content == "wow" ? `float-container-wow` : `float-container`;
  container.setAttribute("id", uniqueId);

  const _size = Array.isArray(size)
    ? Math.floor(Math.random() * (size[1] - size[0] + 1)) + size[0]
    : size;

  for (let i = 0; i < number; i++) {
    const floater = document.createElement("spam");
    floater.innerHTML = content;

    floater.style.cssText = `
       position: absolute;
       left: 0;
       font-size: ${_size}em;
       transform: translateY(110vh);
       transition-timing-function: ease-in;
       animation: 
         ${content == "wow" ? "float-wow" : "float"}
         ${content == "wow" ? duration : "1"}s
         linear
         ${i * Math.random()}s
         ${repeat}
         ${direction};
          margin-left:  ${content == "wow" ? "100px" : "45vw"};`;

    floater.addEventListener("animationend", (e) => {
      if (e.animationName === "float") {
        container.removeChild(floater);
      }
    });
    container.appendChild(floater);
  }

  let containerBattle = document.getElementById('containerBattle');
  containerBattle.appendChild(container);

  document.getElementById(uniqueId).style.color = color;

  if (content == "wow") {
    setTimeout(() => {
      try {
        document.getElementById(uniqueId).remove();
      } catch (error) {
        console.error(`error remove uniqueId ${uniqueId}`, error);
      }
    }, 4000);
  } else {
    setTimeout(() => {
      try {
        document.getElementById(uniqueId).remove();
      } catch (error) {
        console.error(`error remove uniqueId ${uniqueId}`, error);
      }
    }, 2000);
  }
}
