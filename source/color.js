const elements = {
  hue: document.getElementById("hue"),
  saturation: document.getElementById("saturation"),
  valueInput: document.getElementById("value"),
  red: document.getElementById("red"),
  green: document.getElementById("green"),
  blue: document.getElementById("blue"),
  hex: document.getElementById("hex"),
  colorBox: document.getElementById("colorBox"),
  hueValue: document.getElementById("hueValue"),
  saturationValue: document.getElementById("saturationValue"),
  valueValue: document.getElementById("valueValue"),
  hexError: document.getElementById("hexError"),
  redValue: document.getElementById("redValue"),
  greenValue: document.getElementById("greenValue"),
  blueValue: document.getElementById("blueValue"),
};

const hsvToRgb = (h, s, v) => {
  h *= 6;
  const i = Math.floor(h);
  const f = h - i;
  const p = v * (1 - s);
  const q = v * (1 - f * s);
  const t = v * (1 - (1 - f) * s);

  const [r, g, b] =
    i % 6 === 0
      ? [v, t, p]
      : i % 6 === 1
      ? [q, v, p]
      : i % 6 === 2
      ? [p, v, t]
      : i % 6 === 3
      ? [p, q, v]
      : i % 6 === 4
      ? [t, p, v]
      : [v, p, q];

  return {
    r: Math.round(r * 255),
    g: Math.round(g * 255),
    b: Math.round(b * 255),
  };
};

const rgbToHsv = (r, g, b) => {
  [r, g, b] = [r / 255, g / 255, b / 255];
  const max = Math.max(r, g, b),
    min = Math.min(r, g, b);
  const d = max - min;
  const s = max === 0 ? 0 : d / max;
  let h = 0;

  if (max !== min) {
    h =
      max === r
        ? (g - b) / d + (g < b ? 6 : 0)
        : max === g
        ? (b - r) / d + 2
        : (r - g) / d + 4;
    h /= 6;
  }

  return { h, s, v: max };
};

const rgbToHex = (r, g, b) =>
  `#${[r, g, b]
    .map((x) => x.toString(16).padStart(2, "0"))
    .join("")
    .toUpperCase()}`;

const updateColor = (rgb, hsv) => {
  // 更新RGB字段
  elements.red.value = rgb.r;
  elements.redValue.textContent = rgb.r;
  elements.green.value = rgb.g;
  elements.greenValue.textContent = rgb.g;
  elements.blue.value = rgb.b;
  elements.blueValue.textContent = rgb.b;

  // 更新HSV字段
  if (hsv) {
    elements.hue.value = hsv.h.toFixed(2);
    elements.hueValue.textContent = hsv.h.toFixed(2);
    elements.saturation.value = hsv.s.toFixed(2);
    elements.saturationValue.textContent = hsv.s.toFixed(2);
    elements.valueInput.value = hsv.v.toFixed(2);
    elements.valueValue.textContent = hsv.v.toFixed(2);
  } else {
    const { h, s, v } = rgbToHsv(rgb.r, rgb.g, rgb.b);
    elements.hue.value = h.toFixed(2);
    elements.hueValue.textContent = h.toFixed(2);
    elements.saturation.value = s.toFixed(2);
    elements.saturationValue.textContent = s.toFixed(2);
    elements.valueInput.value = v.toFixed(2);
    elements.valueValue.textContent = v.toFixed(2);
  }

  // 更新HEX字段
  elements.hex.value = rgbToHex(rgb.r, rgb.g, rgb.b);

  // 更新颜色框
  elements.colorBox.style.backgroundColor = `rgb(${rgb.r},${rgb.g},${rgb.b})`;

  // 清除错误信息
  elements.hexError.textContent = "";
};

const handleInput = (source) => {
  let r, g, b;

  if (source === "hsv") {
    const h = parseFloat(elements.hue.value);
    const s = parseFloat(elements.saturation.value);
    const v = parseFloat(elements.valueInput.value);
    ({ r, g, b } = hsvToRgb(h, s, v));
    // 传递hsv参数以直接使用输入值
    updateColor({ r, g, b }, { h, s, v });
  } else if (source === "rgb") {
    r = parseInt(elements.red.value);
    g = parseInt(elements.green.value);
    b = parseInt(elements.blue.value);
    updateColor({ r, g, b });
  } else if (source === "hex") {
    const hexValue = elements.hex.value.trim();

    // 清除之前的错误信息
    elements.hexError.textContent = "";

    // 检查 HEX 格式是否有效
    if (!/^#?([0-9A-Fa-f]{0,6})$/.test(hexValue)) {
      elements.hexError.textContent = "Invalid HEX format";
      return;
    }

    // 去掉 # 号
    let hexClean = hexValue.replace(/^#/, "");

    // 如果 HEX 值不完整，不更新颜色
    if (hexClean.length !== 6) {
      elements.hexError.textContent = "Incomplete HEX value";
      return;
    }

    // 解析 HEX 值
    r = parseInt(hexClean.substr(0, 2), 16);
    g = parseInt(hexClean.substr(2, 2), 16);
    b = parseInt(hexClean.substr(4, 2), 16);

    if (isNaN(r) || isNaN(g) || isNaN(b)) {
      elements.hexError.textContent = "Invalid HEX value";
      return;
    }
    updateColor({ r, g, b });
  }
};

// 事件监听器保持不变
elements.hue.addEventListener("input", () => handleInput("hsv"));
elements.saturation.addEventListener("input", () => handleInput("hsv"));
elements.valueInput.addEventListener("input", () => handleInput("hsv"));
elements.red.addEventListener("input", () => handleInput("rgb"));
elements.green.addEventListener("input", () => handleInput("rgb"));
elements.blue.addEventListener("input", () => handleInput("rgb"));
elements.hex.addEventListener("input", () => handleInput("hex"));

// 初始更新
handleInput("hsv");
