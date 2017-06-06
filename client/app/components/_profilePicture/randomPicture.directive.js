let randomPictureDirective = ($document) => {
  "ngInject";
  return {
    restrict: "EA",
    scope: {
      seed: "<",
      size: "<",
      name: "<"
    },
    template: "",
    link: {
      post: (scope, iElement) => {
        function pseudoRandom(seed) {
          let random = Math.sin(seed) * 10000;
          random -= Math.floor(random);
          return random;
        }
        let seed = pseudoRandom(scope.seed);
        let size = scope.size;

        function getRandomRange(min, max, add = 1000) {
          return Math.floor(pseudoRandom(seed * add) * (max - min) + min);
        }
        const svgns = "http://www.w3.org/2000/svg";
        const box = $document[0].createElementNS(svgns, "svg");

        const rows = 3;
        const columns = 3;
        const blockSize = Math.floor(size / 2);
        const rotate = blockSize * rows / 2 ;

        box.setAttribute("xmlns:xlink","http://www.w3.org/1999/xlink");
        box.setAttribute("width", size);
        box.setAttribute("height", size);
        box.setAttribute("viewbox", "0 0 100 100");
        box.setAttribute("class", "box");

        const g = $document[0].createElementNS(svgns, "g");
        g.setAttribute(
            "transform",
            `translate(${-(rows * blockSize - size) / 2} ${-((rows * blockSize - size) / 2)}) ` +
            `rotate(${90 * seed} ${rotate} ${rotate})`
          );

        for (let i = 0; i < columns; i++) {
          //noprotect
          for (let j = 0; j < rows; j++) {
            let rect = $document[0].createElementNS(svgns, "rect");
            rect.setAttribute("width", blockSize);
            rect.setAttribute("height", blockSize);
            rect.setAttribute("fill", "rgba(" +
              getRandomRange(100, 255, (i + 1) * (j + 1) * 1) + "," +
              getRandomRange(100, 255, (i + 1) * (j + 1) * 2) + "," +
              getRandomRange(100, 255, (i + 1) * (j + 1) * 3) + ",1)"
            );
            rect.setAttribute("x", i * blockSize);
            rect.setAttribute("y", j * blockSize);

            g.appendChild(rect);
          }
        }
        box.appendChild(g);

        let overlay = $document[0].createElementNS(svgns, "rect");
        overlay.setAttribute("width", size);
        overlay.setAttribute("height", size);
        overlay.setAttribute("fill", "rgba(" +
          getRandomRange(100, 255, 1) + "," +
          getRandomRange(100, 255, 2) + "," +
          getRandomRange(100, 255, 3) + ",0.5)"
        );
        overlay.setAttribute("x", 0);
        overlay.setAttribute("y", 0);
        box.appendChild(overlay);

        if (angular.isDefined(scope.name)){
          let name = scope.name.substring(0, 2).toUpperCase();

          let initials = $document[0].createTextNode(name);
          let textOverlay = $document[0].createElementNS(svgns, "text");
          textOverlay.setAttribute("width", size);
          textOverlay.setAttribute("height", size);
          textOverlay.setAttribute("fill", "rgba(0,0,0,1)");
          textOverlay.setAttribute("font-size", 12);
          textOverlay.setAttribute("text-anchor", "middle");
          textOverlay.setAttribute("x", 10);
          textOverlay.setAttribute("y", 15);
          textOverlay.appendChild(initials);
          box.appendChild(textOverlay);
        }

        iElement.append(box);

      }
    }
  };
};

export default randomPictureDirective;
