export class ImageMaker {
  #root: HTMLDivElement;
  #canvas: HTMLCanvasElement;

  constructor() {
    this.#root = document.createElement('div');
    this.#canvas = document.createElement('canvas');
  }

  greyscale() {
    const imageData = this.#getImageData();
    if (!imageData) {
      return;
    }

    for (let i = 0; i < imageData.data.length; i += 4) {
      const avg = Math.round(
        (imageData.data[i] + imageData.data[i + 1] + imageData.data[i + 2]) / 3,
      );
      imageData.data[i] = imageData.data[i + 1] = imageData.data[i + 2] = avg;
    }
    this.#setImageData(imageData);
  }

  *iterBlick() {
    const imageData = this.#getImageData();
    if (!imageData) {
      return;
    }

    while (true) {
      for (let i = 0; i < imageData.data.length; i += 4) {
        imageData.data[i] = imageData.data[i + 1];
        imageData.data[i + 1] = imageData.data[i + 2];
        imageData.data[i + 2] = imageData.data[i];
      }
      this.#setImageData(imageData);
      yield;
    }
  }

  inverse() {
    const imageData = this.#getImageData();
    if (!imageData) {
      return;
    }

    for (let i = 0; i < imageData.data.length; i += 4) {
      imageData.data[i] = 255 - imageData.data[i];
      imageData.data[i + 1] = 255 - imageData.data[i + 1];
      imageData.data[i + 2] = 255 - imageData.data[i + 2];
    }
    this.#setImageData(imageData);
  }

  yellowToBlue() {
    const imageData = this.#getImageData();
    if (!imageData) {
      return;
    }

    for (let i = 0; i < imageData.data.length; i += 4) {
      if (
        imageData.data[i] > 150 &&
        imageData.data[i + 1] > 150 &&
        imageData.data[i + 2] < 100
      ) {
        imageData.data[i] = 255 - imageData.data[i];
        imageData.data[i + 1] = 255 - imageData.data[i + 1];
        imageData.data[i + 2] = 255 - imageData.data[i + 2];
      }
    }
    this.#setImageData(imageData);
  }

  drawImage(image: HTMLImageElement) {
    this.#canvas.width = image.width;
    this.#canvas.height = image.height;
    const context = this.#canvas.getContext('2d');
    context?.drawImage(image, 0, 0, image.width, image.height);
  }

  #getImageData() {
    if (!this.#canvas) {
      return;
    }
    const context = this.#canvas.getContext('2d');
    if (!context) {
      return;
    }
    return context.getImageData(0, 0, this.#canvas.width, this.#canvas.height);
  }

  #setImageData(imageData: ImageData) {
    if (!this.#canvas) {
      return;
    }
    const context = this.#canvas.getContext('2d');
    if (!context) {
      return;
    }
    context.putImageData(imageData, 0, 0);
  }

  #createInput() {
    const input = document.createElement('input');
    input.type = 'file';
    input.addEventListener('change', (e) => {
      const target = e.target as HTMLInputElement;
      const file = target.files && target.files[0];
      if (file) {
        const fr = new FileReader();

        fr.addEventListener('load', (e) => {
          const image = new Image();
          const result = e.target?.result;
          if (result) {
            image.src = result as string;
            image.addEventListener('load', () => {
              this.drawImage(image);
            });
          }
        });

        fr.readAsDataURL(file);
      }
    });
    return input;
  }

  #createBtn(label: string, callback: () => void) {
    const btn = document.createElement('button');
    btn.innerText = label;
    btn.onclick = () => callback.call(this);
    return btn;
  }

  addInput() {
    this.#root.appendChild(this.#createInput());
  }

  addGreyScaleBtn() {
    this.#root.appendChild(this.#createBtn('grey scale', this.greyscale));
  }

  addInverseBtn() {
    this.#root.appendChild(this.#createBtn('inverse', this.inverse));
  }

  addYellowToBlue() {
    this.#root.appendChild(
      this.#createBtn('yellow to blue', this.yellowToBlue),
    );
  }

  addBlink() {
    this.#root.appendChild(
      this.#createBtn('blink btn', () => {
        const iter = this.iterBlick();

        const interval = setInterval(() => {
          const res = iter.next();
          if (res.done) {
            clearInterval(interval);
          }
        }, 100);
      }),
    );
  }

  render() {
    this.#canvas.width = 0;
    this.#canvas.height = 0;
    this.#root.appendChild(this.#canvas);
    return this.#root;
  }
}
